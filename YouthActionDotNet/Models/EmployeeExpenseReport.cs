using System;
using System.Text.Json.Serialization;

namespace YouthActionDotNet.Models
{
    public class EmployeeExpenseReport
    {
        public string EmployeeName { get; set; }
        public string EmployeeNationalId { get; set; }
        public string DateJoined { get; set; }

        public string EmployeeType { get; set; }
        public string EmployeeRole { get; set; }
        public string ExpenseId { get; set; }
        public string ExpenseAmount { get; set; }
        public string ExpenseDescription { get; set; }
        public string ExpenseReceipt { get; set; }
        public string Status { get; set; }
        public DateTime DateOfExpense { get; set; }
        public DateTime DateOfSubmission { get; set; }
        public DateTime DateOfReimbursement { get; set; }
        public string ApprovalName { get; set; }
    }
}