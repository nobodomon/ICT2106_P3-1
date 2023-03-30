using System;
using Newtonsoft.Json;
namespace YouthActionDotNet.Models
{
    public class Reimbursement
    {
        public Reimbursement()
        {
            this.ReimbursementId = Guid.NewGuid().ToString();
        }

        public string ReimbursementId { get; set; }

        public DateTime DateOfReimbursement { get; set; }

        public string ApprovalId { get; set; }
        
        [JsonIgnore]
        public virtual User user { get; set; }
    }
}
