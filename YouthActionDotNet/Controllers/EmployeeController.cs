using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using YouthActionDotNet.Data;
using System.Security.Cryptography;
using YouthActionDotNet.Models;
using YouthActionDotNet.DAL;
using YouthActionDotNet.Control;
using System.Linq.Expressions;

namespace YouthActionDotNet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase, IUserInterfaceCRUD<Employee>
    {
        private EmployeeControl employeeControl;


        public EmployeeController(DBContext context)
        {
            employeeControl = new EmployeeControl(context);
        
        }

        [HttpPost("Create")]
        public async Task<ActionResult<string>> Create(Employee template)
        {
            return await employeeControl.Create(template);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<string>> Get(string id)
        {
            return await employeeControl.Get(id);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<string>> Update(string id, Employee template)
        {
            return await employeeControl.Update(id,template);
        }
        
        [HttpPut("UpdateAndFetch/{id}")]
        public async Task<ActionResult<string>> UpdateAndFetchAll(string id, Employee template)
        {
            return await employeeControl.UpdateAndFetchAll(id,template);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<string>> Delete(string id)
        {
            return await employeeControl.Delete(id);
        }

        [HttpDelete("Delete")]
        public async Task<ActionResult<string>> Delete(Employee template)
        {
            return await employeeControl.Delete(template);
        }

        [HttpGet("All")]
        public async Task<ActionResult<string>> All()
        {
            return await employeeControl.All();
        }

        [HttpGet("All/{page}/pageSize={pageSize}")]
        public async Task<ActionResult<string>> All(
            int page, int pageSize)
        {
            return await employeeControl.AllInPages(null, null,page, pageSize);
        }

        [HttpPost("All")]
        public async Task<ActionResult<string>> All([FromBody] SearchRequest request)
        {
            List<Tag> tags = request.data;
            int page = request.pageData.page;
            int pageSize = request.pageData.pageSize;
            
            return await employeeControl.AllInPages(tags, null, page, pageSize);
        }
        [HttpGet("Count")]
        public async Task<ActionResult<string>> Count()
        {
            return await employeeControl.Count();
        }

        [HttpGet("Settings")]
        public string Settings()
        {
            return employeeControl.Settings();    
        }
        public bool Exists(string id)
        {
            return employeeControl.Get(id) != null;
        }
    }
}
