using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using YouthActionDotNet.Controllers;
using YouthActionDotNet.DAL;
using YouthActionDotNet.Data;
using YouthActionDotNet.Models;

namespace YouthActionDotNet.Control
{
    public class ReportControl : IUserInterfaceCRUD<Report>
    {
        private GenericRepositoryIn<Report> ReportRepositoryIn;
        private ReportRepositoryOut ReportRepositoryOut;
        private GenericRepositoryIn<File> FileRepositoryIn;
        private GenericRepositoryOut<File> FileRepositoryOut;

        JsonSerializerSettings settings = new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore };
        public ReportControl(DBContext context)
        {
            ReportRepositoryIn = new GenericRepositoryIn<Report>(context);
            ReportRepositoryOut = new ReportRepositoryOut(context);
            FileRepositoryIn = new GenericRepositoryIn<File>(context);
            FileRepositoryOut = new GenericRepositoryOut<File>(context);
        }

        public bool Exists(string id)
        {
            return ReportRepositoryOut.GetByID(id) != null;
        }

        public async Task<ActionResult<string>> Create(Report template)
        {

            var report = await ReportRepositoryIn.InsertAsync(template);
            return JsonConvert.SerializeObject(new { success = true, message = "Report Created", data = report }, settings);
        }

        public async Task<ActionResult<string>> Get(string id)
        {
            var report = await ReportRepositoryOut.GetByIDAsync(id);
            if (report == null)
            {
                return JsonConvert.SerializeObject(new { success = false, message = "Report Not Found" });
            }
            return JsonConvert.SerializeObject(new { success = true, data = report, message = "Report Successfully Retrieved" });
        }

        public async Task<ActionResult<string>> Update(string id, Report template)
        {
            if (id != template.ReportId)
            {
                return JsonConvert.SerializeObject(new { success = false, data = "", message = "Report Id Mismatch" });
            }
            await ReportRepositoryIn.UpdateAsync(template);
            try
            {
                return JsonConvert.SerializeObject(new { success = true, data = template, message = "Report Successfully Updated" });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Exists(id))
                {
                    return JsonConvert.SerializeObject(new { success = false, data = "", message = "Report Not Found" });
                }
                else
                {
                    throw;
                }
            }
        }

        public async Task<ActionResult<string>> UpdateAndFetchAll(string id, Report template)
        {
            if (id != template.ReportId)
            {
                return JsonConvert.SerializeObject(new { success = false, data = "", message = "Report Id Mismatch" });
            }
            await ReportRepositoryIn.UpdateAsync(template);
            try
            {
                var reports = await ReportRepositoryOut.GetAllAsync();
                return JsonConvert.SerializeObject(new { success = true, data = reports, message = "Report Successfully Updated" });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Exists(id))
                {
                    return JsonConvert.SerializeObject(new { success = false, data = "", message = "Report Not Found" });
                }
                else
                {
                    throw;
                }
            }
        }

        public async Task<ActionResult<string>> Delete(string id)
        {
            var report = await ReportRepositoryOut.GetByIDAsync(id);
            if (report == null)
            {
                return JsonConvert.SerializeObject(new { success = false, data = "", message = "Report Not Found" });
            }
            await ReportRepositoryIn.DeleteAsync(id);
            return JsonConvert.SerializeObject(new { success = true, data = "", message = "Report Successfully Deleted" });
        }

        public async Task<ActionResult<string>> Delete(Report template)
        {
            var report = await ReportRepositoryOut.GetByIDAsync(template.ReportId);
            if (report == null)
            {
                return JsonConvert.SerializeObject(new { success = false, data = "", message = "Report Not Found" });
            }
            await ReportRepositoryIn.DeleteAsync(template);
            return JsonConvert.SerializeObject(new { success = true, data = "", message = "Report Successfully Deleted" });
        }

        public async Task<ActionResult<string>> All()
        {
            var reports = await ReportRepositoryOut.GetAllAsync();
            return JsonConvert.SerializeObject(new { success = true, data = reports, message = "Reports Successfully Retrieved" });
        }

        public async Task<ActionResult<string>> GetEmployeeExpenseData(string reportStartDate, string reportEndDate, string projectId)
        {
            var data = await ReportRepositoryOut.getEmployeeExpenseReportData(reportStartDate, reportEndDate, projectId);
            return JsonConvert.SerializeObject(new { success = true, data = data, message = "Reports Successfully Retrieved" });
        }

        public async Task<ActionResult<string>> GetVolunteerWorkData(string reportStartDate, string reportEndDate, string projectId)
        {
            var data = await ReportRepositoryOut.getVolunteerWorkReportData(reportStartDate, reportEndDate, projectId);
            return JsonConvert.SerializeObject(new { success = true, data = data, message = "Reports Successfully Retrieved" });
        }

        public string Settings()
        {
            Settings settings = new Settings();
            settings.ColumnSettings = new Dictionary<string, ColumnHeader>();
            settings.FieldSettings = new Dictionary<string, InputType>();

            settings.ColumnSettings.Add("ReportId", new ColumnHeader { displayHeader = "Report Id" });
            settings.ColumnSettings.Add("ReportName", new ColumnHeader { displayHeader = "Report Name" });
            settings.ColumnSettings.Add("ReportDateCreation", new ColumnHeader { displayHeader = "Report Date Creation" });
            settings.ColumnSettings.Add("ReportStartDate", new ColumnHeader { displayHeader = "Report Start Date" });
            settings.ColumnSettings.Add("ReportEndDate", new ColumnHeader { displayHeader = "Report End Date" });
            settings.ColumnSettings.Add("FileId", new ColumnHeader { displayHeader = "File Name" });

            settings.FieldSettings.Add("ReportId", new InputType { type = "text", displayLabel = "Report Id", editable = false, primaryKey = true });
            settings.FieldSettings.Add("ReportName", new InputType { type = "text", displayLabel = "Report Name", editable = true, primaryKey = false });
            settings.FieldSettings.Add("ReportDateCreation", new InputType { type = "datetime", displayLabel = "Report Date Creation", editable = true, primaryKey = false });
            settings.FieldSettings.Add("ReportStartDate", new InputType { type = "datetime", displayLabel = "Report Start Date", editable = true, primaryKey = false });
            settings.FieldSettings.Add("ReportEndDate", new InputType { type = "datetime", displayLabel = "Report End Date", editable = true, primaryKey = false });

            var files = FileRepositoryOut.GetAll();
            settings.FieldSettings.Add("FileId", new DropdownInputType
            {
                type = "dropdown",
                displayLabel = "File Name",
                editable = true,
                primaryKey = false,
                options = files.Select(x => new DropdownOption { value = x.FileId, label = x.FileName }).ToList()
            });

            return JsonConvert.SerializeObject(new { success = true, data = settings, message = "Settings Successfully Retrieved" });
        }
    }
}
