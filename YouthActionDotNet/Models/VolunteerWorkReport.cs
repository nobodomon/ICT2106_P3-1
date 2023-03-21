using System;
using System.Text.Json.Serialization;

namespace YouthActionDotNet.Models
{
    public class VolunteerWorkReport
    {
        public string volunteerNationalId { get; set; }

        public string volunteerName { get; set; }

        public string volunteerDateJoined { get; set; }

        public string volunteerQualifications { get; set; }

        public string volunteerCriminalHistory { get; set; }

        public string volunteerCriminalHistoryDesc { get; set; }

        public DateTime shiftStart { get; set; }

        public DateTime shiftEnd { get; set; }

        public string supervisingEmployee { get; set; }

        public string projectId { get; set; }
    }
}
