using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using YouthActionDotNet.Data;
using YouthActionDotNet.Models;

namespace YouthActionDotNet.DAL
{
    public class GenericRepositoryOut<TEntity> where TEntity: class {
        internal DbSet<TEntity> dbSet;
        internal DbContext context;

        public GenericRepositoryOut(DbContext context){
            this.context = context;
            this.dbSet = context.Set<TEntity>();
        }
        public virtual IEnumerable<TEntity> GetAll(Expression<Func<TEntity, bool>> filter = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
            string includeProperties = "")
        {
            IQueryable<TEntity> query = dbSet;

            if (filter != null)
            {
                query = query.Where(filter);
            }

            foreach (var includeProperty in includeProperties.Split
                (new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                query = query.Include(includeProperty);
            }

            if (orderBy != null)
            {
                return orderBy(query).ToList();
            }
            else
            {
                return query.ToList();
            }
        }

        public virtual IEnumerable<TEntity> GetAllInPages(Expression<Func<TEntity, bool>> filter = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
            string includeProperties = "", int page = 1 , int pageSize = 20)
        {
            IQueryable<TEntity> query = dbSet;

            if (filter != null)
            {
                query = query.Where(filter);
            }

            foreach (var includeProperty in includeProperties.Split
                (new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                query = query.Include(includeProperty);
            }

            if (orderBy != null)
            {
                return orderBy(query).Take(pageSize).Skip(((page-1) * pageSize)).ToList();
            }
            else
            {
                return query.Take(pageSize).Skip(((page-1) * pageSize)).ToList();
            }
        }

        public virtual int GetPages(){
            return dbSet.Count();
        }

        public virtual Task<int> GetPagesAsync(){
            return dbSet.CountAsync();
        }

        public virtual TEntity GetByID(object id)
        {
            return dbSet.Find(id);
        }


        public virtual async Task<IEnumerable<TEntity>> GetAllAsync(List<Tag> filter = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
            string includeProperties = "")
        {
            IQueryable<TEntity> query = dbSet;

            if(filter != null){
                foreach(var tag in filter){
                    query = query.Where(x => x.GetType().GetProperty(tag.type).GetValue(x).ToString().Contains(tag.value));
                }
            }


            foreach (var includeProperty in includeProperties.Split
                (new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                query = query.Include(includeProperty);
            }

            if (orderBy != null)
            {
                return await orderBy(query).ToListAsync();
            }
            else
            {
                return await query.ToListAsync();
            }
        }


        public virtual async Task<IEnumerable<TEntity>> GetAllInPagesAsync(List<Tag> filter = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
            string includeProperties = "", int page = 1 , int pageSize = 10)
        {
            IQueryable<TEntity> query = dbSet;

            if(filter != null){
                foreach(var tag in filter){
                    string columnName = tag.type;
                    string value = tag.value;

                    ParameterExpression param = Expression.Parameter(typeof(TEntity), "x");
                    MemberExpression member = Expression.Property(param, columnName);
                    ConstantExpression constant = Expression.Constant(value);

                    var containsMethod = typeof(string).GetMethod("Contains", new[] { typeof(string) });

                    var someValue = Expression.Constant(value, typeof(string));
                    
                    var containsMethodExp = Expression.Call(member, containsMethod, someValue);

                    var lambda = Expression.Lambda<Func<TEntity, bool>>(containsMethodExp, param);

                    query = query.Where(lambda);
                }
            }


            foreach (var includeProperty in includeProperties.Split
                (new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                query = query.Include(includeProperty);
            }

            if (orderBy != null)
            {
                return await orderBy(query).Take(pageSize).Skip(((page-1) * pageSize)).ToListAsync();
            }
            else
            {
                return await query.Take(pageSize).Skip(((page-1) * pageSize)).ToListAsync();
            }
        }

        public virtual async Task<TEntity> GetByIDAsync(object id)
        {
            return await dbSet.FindAsync(id);
        }

        internal Task GetAllInPagesAsync(Expression<Func<Employee, bool>> filter, IOrderedQueryable<Employee> orderBy, string includeProperties, int page, int pageSize)
        {
            throw new NotImplementedException();
        }
    }
}