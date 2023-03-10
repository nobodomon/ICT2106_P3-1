using System.Collections;
using System.IO;
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

        public async Task<ArrayList> getEmployeeExpenseReportData(string reportStartDate, string reportEndDate, string projectId)
        {
            var employees = await employeeSet.ToListAsync();
            var expenses =
                await expenseSet.FromSqlRaw("SELECT * FROM Expense WHERE DateOfSubmission BETWEEN {0} AND {1}", reportStartDate, reportEndDate).ToListAsync();
            var project = await projectSet.FromSqlRaw("SELECT * FROM Project WHERE ProjectId = {0}", projectId).FirstOrDefaultAsync();

            ArrayList employeeExpenseArray = new ArrayList();
            foreach (var employee in employees)
            {
                var employeeExpense = new EmployeeExpenseReport();
                foreach (var expense in expenses)
                {
                    if (project == expense.project && employee.UserId == expense.user.UserId)
                    {
                        employeeExpense.EmployeeName = employee.username;
                        employeeExpense.EmployeeNationalId =
                            employee.EmployeeNationalId;
                        employeeExpense.DateJoined = employee.DateJoined;
                        employeeExpense.EmployeeType = employee.EmployeeType;
                        employeeExpense.EmployeeRole = employee.EmployeeRole;
                        employeeExpense.ExpenseId = expense.ExpenseId;
                        employeeExpense.ExpenseAmount = expense.ExpenseAmount;
                        employeeExpense.ExpenseDescription =
                            expense.ExpenseDesc;
                        employeeExpense.ExpenseReceipt = expense.ExpenseReceipt;
                        employeeExpense.Status = expense.Status;
                        employeeExpense.DateOfExpense = expense.DateOfExpense;
                        employeeExpense.DateOfSubmission =
                            expense.DateOfSubmission;
                        employeeExpense.DateOfReimbursement =
                            expense.DateOfReimbursement;
                        employeeExpense.ApprovalName = expense.user.username;
                    }
                }
                employeeExpenseArray.Add(employeeExpense);
            }
            return employeeExpenseArray;
        }
    }
}
