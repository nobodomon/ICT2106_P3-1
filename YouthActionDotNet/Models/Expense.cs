using System;
using Newtonsoft.Json;
namespace YouthActionDotNet.Models
{
    public class Expense
    {
        public Expense()
        {
            this.ExpenseId = Guid.NewGuid().ToString();
        }

        public string ExpenseId { get; set; }

        public Submission submission { get; set; }

        public Reimbursement Reimbursement { get; set; }
    }
}
