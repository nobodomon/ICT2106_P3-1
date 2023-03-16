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

        public async Task<IList> getEmployeeExpenseReportData(string  reportStartDate, string reportEndDate, string projectId)
        {
            var employeeExpenseArray = await employeeSet.Join(expenseSet, employee => employee.UserId, expense => expense.user.UserId, (employee, expense) => new { employee, expense })
                .Where(x => x.expense.DateOfSubmission >= DateTime.Parse(reportStartDate) && x.expense.DateOfSubmission <= DateTime.Parse(reportEndDate))
                .Where(y => y.expense.ProjectId == projectId)
                .Select(z => new EmployeeExpenseReport
                {
                    EmployeeName = z.employee.username,
                    EmployeeNationalId = z.employee.EmployeeNationalId,
                    DateJoined = z.employee.DateJoined,
                    EmployeeType = z.employee.EmployeeType,
                    EmployeeRole = z.employee.EmployeeRole,
                    ExpenseId = z.expense.ExpenseId,
                    ExpenseAmount = z.expense.ExpenseAmount,
                    ExpenseDescription = z.expense.ExpenseDesc,
                    ExpenseReceipt = z.expense.ExpenseReceipt,
                    Status = z.expense.Status,
                    DateOfExpense = z.expense.DateOfExpense,
                    DateOfSubmission = z.expense.DateOfSubmission,
                    DateOfReimbursement = z.expense.DateOfReimbursement,
                    ApprovalName = z.expense.user.username
                }).ToListAsync();
            return employeeExpenseArray;
        }
    }
}
