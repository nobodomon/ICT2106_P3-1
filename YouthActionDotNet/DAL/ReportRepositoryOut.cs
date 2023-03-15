using System;
using System.Collections;
using System.Data.SqlTypes;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using YouthActionDotNet.Data;
using YouthActionDotNet.Models;

namespace YouthActionDotNet.DAL
{
    public class ReportRepositoryOut : GenericRepositoryOut<Models.Report>
    {
        private DbSet<Employee> employeeSet;

        private DbSet<Expense> expenseSet;

        private DbSet<Project> projectSet;

        public ReportRepositoryOut(DBContext context) :
            base(context)
        {
            this.context = context;
            this.dbSet = context.Set<Report>();
            this.employeeSet = context.Set<Models.Employee>();
            this.expenseSet = context.Set<Models.Expense>();
            this.projectSet = context.Set<Models.Project>();
        }

        public async Task<IList> getEmployeeExpenseReportData(SqlDateTime  reportStartDate, SqlDateTime reportEndDate, string projectId)
        {
            var employeeExpenseArray = await employeeSet.Join(expenseSet, employee => employee.UserId, expense => expense.user.UserId, (employee, expense) => new { employee, expense })
                .Where(x => x.expense.ProjectId == projectId)
                // .Where(x => x.expense.DateOfSubmission >= reportStartDate && x.expense.DateOfSubmission <= reportEndDate)
                .Select(x => new EmployeeExpenseReport
                {
                    EmployeeName = x.employee.username,
                    EmployeeNationalId = x.employee.EmployeeNationalId,
                    DateJoined = x.employee.DateJoined,
                    EmployeeType = x.employee.EmployeeType,
                    EmployeeRole = x.employee.EmployeeRole,
                    ExpenseId = x.expense.ExpenseId,
                    ExpenseAmount = x.expense.ExpenseAmount,
                    ExpenseDescription = x.expense.ExpenseDesc,
                    ExpenseReceipt = x.expense.ExpenseReceipt,
                    Status = x.expense.Status,
                    DateOfExpense = x.expense.DateOfExpense,
                    DateOfSubmission = x.expense.DateOfSubmission,
                    DateOfReimbursement = x.expense.DateOfReimbursement,
                    ApprovalName = x.expense.user.username
                }).ToListAsync();
            return employeeExpenseArray;
        }
    }
}
