using System;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using YouthActionDotNet.Control;
using YouthActionDotNet.DAL;
using YouthActionDotNet.Data;
using YouthActionDotNet.Models;

namespace YouthActionDotNet.Interfaces
{
    public interface IReport
    {
        Task<ActionResult<string>> All();
        Task<ActionResult<string>> Create(Report template);
        Task<ActionResult<string>> Delete(string id);
        Task<ActionResult<string>> Delete(Report template);
        bool Exists(string id);
        Task<ActionResult<string>> Get(string id);
        Task<ActionResult<string>> getEmployeeExpenseReport([FromBody] ReportQuery request);
        Task<ActionResult<string>> getVolunteerWork([FromBody] ReportQuery request);
        string Settings();
        Task<ActionResult<string>> Update(string id, Report template);
        Task<ActionResult<string>> UpdateAndFetchAll(string id, Report template);
    }
}