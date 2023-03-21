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

        private DbSet<Volunteer> volunteerSet;

        private DbSet<VolunteerWork> volunteerWorkSet;
        public ReportRepositoryOut(DBContext context) :
            base(context)
        {
            this.context = context;
            this.dbSet = context.Set<Report>();
            this.volunteerSet = context.Set<Models.Volunteer>();
            this.volunteerWorkSet = context.Set<Models.VolunteerWork>();
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
        public async Task<IList> getVolunteerWorkReportData(string reportStartDate, string reportEndDate, string projectId){
            Console.WriteLine(projectId);
            Console.WriteLine(reportStartDate);
            var volunteerWorkArray = await volunteerSet.Join(volunteerWorkSet, volunteer => volunteer.UserId, volunteerWork => volunteerWork.volunteer.UserId, (volunteer, volunteerWork) => new { volunteer, volunteerWork })
                .Where(x => x.volunteerWork.ShiftStart >= DateTime.Parse(reportStartDate) && x.volunteerWork.ShiftEnd <= DateTime.Parse(reportEndDate))
                .Where(y => y.volunteerWork.projectId == projectId)
                .Select(z => new {
                    volunteerNationalId = z.volunteer.VolunteerNationalId,
                    volunteerName = z.volunteer.username,
                    volunteerDateJoined = z.volunteer.VolunteerDateJoined,
                    volunteerQualifications = z.volunteer.Qualifications,
                    volunteerCriminalHistory = z.volunteer.CriminalHistory,
                    volunteerCriminalHistoryDesc = z.volunteer.CriminalHistoryDesc,
                    shiftStart = z.volunteerWork.ShiftStart,
                    shiftEnd = z.volunteerWork.ShiftEnd,
                    supervisingEmployee = z.volunteerWork.employee.username,
                    projectId = z.volunteerWork.project.ProjectName
                }).ToListAsync();
            return volunteerWorkArray;
        }
    }
}
