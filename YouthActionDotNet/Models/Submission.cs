using System;
using Newtonsoft.Json;
namespace YouthActionDotNet.Models
{
    public class Submission
    {
        public Submission()
        {
            this.SubmissionId = Guid.NewGuid().ToString();
        }

        public string SubmissionId { get; set; }

        public string ExpenseAmount { get; set; }

        public string ExpenseDesc { get; set; }

        public string ProjectId { get; set; }

        public string ExpenseReceipt { get; set; }

        public string Status { get; set; }

        public DateTime DateOfExpense { get; set; }

        public DateTime DateOfSubmission { get; set; }
        
        [JsonIgnore]
        public virtual User user { get; set; }
        [JsonIgnore]
        public virtual Project project { get; set; }
        [JsonIgnore]
        public virtual File ExpenseReceiptFile { get; set; }
    }
}
