using System;

namespace YouthActionDotNet.Models
{
    public class Report
    {
        public int ReportId { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public DateTime Date { get; set; }
    }
}