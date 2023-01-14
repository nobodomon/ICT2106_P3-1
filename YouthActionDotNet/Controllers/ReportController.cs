using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using YouthActionDotNet.Data;
using YouthActionDotNet.Models;

namespace YouthActionDotNet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly DBContext _context;

        public ReportController(DBContext context)
        {
            _context = context;
        }

        // GET: api/Report
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Report>>> GetReport()
        {
            return await _context.Report.ToListAsync();
        }

        // GET: api/Report/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Report>> GetReport(int id)
        {
            var report = await _context.Report.FindAsync(id);

            if (report == null)
            {
                return NotFound();
            }

            return report;
        }

        // PUT: api/Report/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReport(int id, Report report)
        {
            if (id != report.ReportId)
            {
                return BadRequest();
            }

            _context.Entry(report).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReportExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpGet("All")]
        public async Task<ActionResult<String>> GetAllReports()
        {
            var reports = await _context.Report.ToListAsync();
            return JsonConvert.SerializeObject(new { success = true, message = "Reports Retrieved", data = reports });
        }

        [HttpPost("Create")]
        public async Task<ActionResult<String>> PostCenter(Report report)
        {
            _context.Report.Add(report);
            await _context.SaveChangesAsync();

            return JsonConvert.SerializeObject(new { success = true, message = "Report Created", data = report });
        }

        // POST: api/Report
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Report>> PostReport(Report report)
        {
            _context.Report.Add(report);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetReport", new { id = report.ReportId }, report);
        }

        // DELETE: api/Report/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReport(int id)
        {
            var report = await _context.Report.FindAsync(id);
            if (report == null)
            {
                return NotFound();
            }

            _context.Report.Remove(report);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Report/Settings/
        [HttpGet("Settings")]
        public string getServiceCenterSettings()
        {
            Settings settings = new Settings();
            settings.ColumnSettings = new Dictionary<string, ColumnHeader>();
            settings.FieldSettings = new Dictionary<string, InputType>();

            settings.ColumnSettings.Add("ReportId", new ColumnHeader { displayHeader = "ID" });
            settings.ColumnSettings.Add("Name", new ColumnHeader { displayHeader = "Report Name" });
            settings.ColumnSettings.Add("Type", new ColumnHeader { displayHeader = "Report Type" });
            settings.ColumnSettings.Add("Date", new ColumnHeader { displayHeader = "Report Date" });

            settings.FieldSettings.Add("ReportId", new InputType { type = "number", displayLabel = "ID", editable = false, primaryKey = true });
            settings.FieldSettings.Add("Name", new InputType { type = "text", displayLabel = "Report Name", editable = true, primaryKey = false });
            settings.FieldSettings.Add("Type", new InputType { type = "text", displayLabel = "Report Type", editable = true, primaryKey = false });
            settings.FieldSettings.Add("Date", new InputType { type = "datetime", displayLabel = "Report Date", editable = true, primaryKey = false });

            return JsonConvert.SerializeObject(settings);
        }

        private bool ReportExists(int id)
        {
            return _context.Report.Any(e => e.ReportId == id);
        }
    }
}
