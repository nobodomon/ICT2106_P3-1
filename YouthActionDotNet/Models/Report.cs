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

        public string ReportDateCreation { get; set; }

        public string ReportStartDate { get; set; }

        public string ReportEndDate { get; set; }

        public string FileId { get; set; }

        [JsonIgnore]
        public virtual File File { get; set; }
    }
}
