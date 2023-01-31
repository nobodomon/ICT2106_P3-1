using System;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace YouthActionDotNet.Models
{
    public class Testing
    {
        public Testing(){
            TestingId = Guid.NewGuid().ToString();
        }
        public string TestingId { get; set; }

        public string TestingDesc { get; set; }

        public string TestingFKId { get; set; }
        
        [JsonIgnore]
        public virtual Project project { get; set; }
    }
}