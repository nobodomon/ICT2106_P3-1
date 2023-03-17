using System;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace YouthActionDotNet.Models
{
    public class Report
    {
        public Report()
        {
            this.ReportId = Guid.NewGuid().ToString();
        }

        public string ReportId { get; set; }

        public string ReportName { get; set; }

        public DateTime ReportDateCreation { get; set; }

        public DateTime ReportStartDate { get; set; }

        public DateTime ReportEndDate { get; set; }

        public string FileId { get; set; }

        [JsonIgnore]
        public virtual File File { get; set; }
    }
}
