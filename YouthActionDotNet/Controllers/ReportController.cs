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

namespace YouthActionDotNet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase, IUserInterfaceCRUD<Report>
    {
        private ReportControl reportControl;
        JsonSerializerSettings settings = new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore };

        public ReportController(DBContext context)
        {
            reportControl = new ReportControl(context);
        }

        public bool Exists(string id)
        {
            return reportControl.Get(id) != null;
        }

        [HttpPost("Create")]
        public async Task<ActionResult<string>> Create(Report template)
        {
            return await reportControl.Create(template);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<string>> Get(string id)
        {
            return await reportControl.Get(id);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<string>> Update(string id, Report template)
        {
            return await reportControl.Update(id, template);
        }

        [HttpPut("UpdateAndFetch/{id}")]
        public async Task<ActionResult<string>> UpdateAndFetchAll(string id, Report template)
        {
            return await reportControl.UpdateAndFetchAll(id, template);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<string>> Delete(string id)
        {
            return await reportControl.Delete(id);
        }

        [HttpDelete("Delete")]
        public async Task<ActionResult<string>> Delete(Report template)
        {
            return await reportControl.Delete(template);
        }

        [HttpGet("All")]
        public async Task<ActionResult<string>> All()
        {
            return await reportControl.All();
        }

        [HttpPost("EmployeeExpense")]
        public async Task<ActionResult<string>> getEmployeeExpenseReport([FromBody] ReportQuery request)
        {
            return await reportControl.GetEmployeeExpenseData(request.startDate, request.endDate, request.projectId);
        }

        [HttpPost("VolunteerWork")]
        public async Task<ActionResult<string>> getVolunteerWork([FromBody] ReportQuery request)
        {
            return await reportControl.GetVolunteerWorkData(request.startDate, request.endDate, request.projectId);
        }


        [HttpGet("Settings")]
        public string Settings()
        {
            return reportControl.Settings();
        }
    }
}
