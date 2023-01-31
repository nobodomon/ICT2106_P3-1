using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YouthActionDotNet.Data;
using YouthActionDotNet.Models;
using Newtonsoft.Json;
using YouthActionDotNet.DAL;
using YouthActionDotNet.Control;

namespace YouthActionDotNet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestingController : ControllerBase, IUserInterfaceCRUD<Testing>
    {
        private TestingControl testingControl;
        JsonSerializerSettings settings = new JsonSerializerSettings
        {
            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
        };

        public TestingController(DBContext context)
        {
            testingControl = new TestingControl(context);
        }

        [HttpGet("All")]
        public async Task<ActionResult<string>> All()
        {
            return await testingControl.All();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<string>> Get(string id)
        {
            return await testingControl.Get(id);
        }

        [HttpPost("Create")]
        public async Task<ActionResult<string>> Create(Testing template)
        {
            Console.WriteLine("Create");
            return await testingControl.Create(template);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<string>> Update(string id, Testing template)
        {
            return await testingControl.Update(id, template);
        }

        [HttpPut("UpdateAndFetch/{id}")]
        public async Task<ActionResult<string>> UpdateAndFetchAll(string id, Testing template)
        {
            return await testingControl.UpdateAndFetchAll(id, template);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<string>> Delete(string id)
        {
            return await testingControl.Delete(id);
        }

        [HttpDelete("Delete")]
        public async Task<ActionResult<String>> Delete(Testing template)
        {
            return await testingControl.Delete(template);
        }

        public bool Exists(string id)
        {
            return testingControl.Get(id) != null;
        }

        [HttpGet("Settings")]
        public string Settings()
        {
            return testingControl.Settings();
        }
    }
}
