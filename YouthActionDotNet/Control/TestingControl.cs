using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using YouthActionDotNet.DAL;
using YouthActionDotNet.Data;
using YouthActionDotNet.Models;

namespace YouthActionDotNet.Controllers
{
    public class TestingControl : IUserInterfaceCRUD<Testing>
    {
        private GenericRepositoryIn<Project> ProjectRepositoryIn;

        private GenericRepositoryOut<Project> ProjectRepositoryOut;

        private GenericRepositoryIn<Testing> TestingRepositoryIn;

        private GenericRepositoryOut<Testing> TestingRepositoryOut;

        JsonSerializerSettings
            settings =
                new JsonSerializerSettings {
                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                };

        public TestingControl(DBContext context)
        {
            ProjectRepositoryIn = new GenericRepositoryIn<Project>(context);
            ProjectRepositoryOut = new GenericRepositoryOut<Project>(context);
            TestingRepositoryIn = new GenericRepositoryIn<Testing>(context);
            TestingRepositoryOut = new GenericRepositoryOut<Testing>(context);
        }

        public bool Exists(string id)
        {
            return TestingRepositoryOut.GetByID(id) != null;
        }

        public async Task<ActionResult<string>> Create(Testing template)
        {
            var project = await TestingRepositoryIn.InsertAsync(template);
            return JsonConvert
                .SerializeObject(new {
                    success = true,
                    message = "Testing Created",
                    data = project
                },
                settings);
        }

        public async Task<ActionResult<string>> Get(string id)
        {
            var project = await TestingRepositoryOut.GetByIDAsync(id);
            if (project == null)
            {
                return JsonConvert
                    .SerializeObject(new {
                        success = false,
                        message = "Testing Not Found"
                    });
            }
            return JsonConvert
                .SerializeObject(new {
                    success = true,
                    data = project,
                    message = "Testing Successfully Retrieved"
                });
        }

        public async Task<ActionResult<string>>
        Update(string id, Testing template)
        {
            if (id != template.TestingId)
            {
                return JsonConvert
                    .SerializeObject(new {
                        success = false,
                        data = "",
                        message = "Testing Id Mismatch"
                    });
            }
            await TestingRepositoryIn.UpdateAsync(template);
            try
            {
                return JsonConvert
                    .SerializeObject(new {
                        success = true,
                        data = template,
                        message = "Testing Successfully Updated"
                    });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Exists(id))
                {
                    return JsonConvert
                        .SerializeObject(new {
                            success = false,
                            data = "",
                            message = "Testing Not Found"
                        });
                }
                else
                {
                    throw;
                }
            }
        }

        public async Task<ActionResult<string>>
        UpdateAndFetchAll(string id, Testing template)
        {
            if (id != template.TestingId)
            {
                return JsonConvert
                    .SerializeObject(new {
                        success = false,
                        data = "",
                        message = "Testing Id Mismatch"
                    });
            }
            await TestingRepositoryIn.UpdateAsync(template);
            try
            {
                var projects = await TestingRepositoryOut.GetAllAsync();
                return JsonConvert
                    .SerializeObject(new {
                        success = true,
                        data = projects,
                        message = "Testing Successfully Updated"
                    });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Exists(id))
                {
                    return JsonConvert
                        .SerializeObject(new {
                            success = false,
                            data = "",
                            message = "Testing Not Found"
                        });
                }
                else
                {
                    throw;
                }
            }
        }

        public async Task<ActionResult<string>> Delete(string id)
        {
            var project = await TestingRepositoryOut.GetByIDAsync(id);
            if (project == null)
            {
                return JsonConvert
                    .SerializeObject(new {
                        success = false,
                        data = "",
                        message = "Testing Not Found"
                    });
            }
            await TestingRepositoryIn.DeleteAsync(id);
            return JsonConvert
                .SerializeObject(new {
                    success = true,
                    data = "",
                    message = "Testing Successfully Deleted"
                });
        }

        public async Task<ActionResult<string>> Delete(Testing template)
        {
            var project =
                await TestingRepositoryOut.GetByIDAsync(template.TestingId);
            if (project == null)
            {
                return JsonConvert
                    .SerializeObject(new {
                        success = false,
                        data = "",
                        message = "Testing Not Found"
                    });
            }
            await TestingRepositoryIn.DeleteAsync(template);
            return JsonConvert
                .SerializeObject(new {
                    success = true,
                    data = "",
                    message = "Testing Successfully Deleted"
                });
        }

        public async Task<ActionResult<string>> All()
        {
            var projects = await TestingRepositoryOut.GetAllAsync();
            return JsonConvert
                .SerializeObject(new {
                    success = true,
                    data = projects,
                    message = "Testings Successfully Retrieved"
                });
        }

        public string Settings()
        {
            Settings settings = new Settings();
            settings.ColumnSettings = new Dictionary<string, ColumnHeader>();
            settings.FieldSettings = new Dictionary<string, InputType>();

            settings
                .ColumnSettings
                .Add("TestingId",
                new ColumnHeader { displayHeader = "Testing Id" });
            settings
                .ColumnSettings
                .Add("TestingDesc",
                new ColumnHeader { displayHeader = "Testing Desc" });
            settings
                .ColumnSettings
                .Add("TestingFKId",
                new ColumnHeader { displayHeader = "Project Name" });

            settings
                .FieldSettings
                .Add("TestingId",
                new InputType {
                    type = "text",
                    displayLabel = "Testing Id",
                    editable = false,
                    primaryKey = true
                });
            settings
                .FieldSettings
                .Add("TestingDesc",
                new InputType {
                    type = "text",
                    displayLabel = "Testing Desc",
                    editable = true,
                    primaryKey = false
                });

            var allProjects = ProjectRepositoryOut.GetAll();
            settings
                .FieldSettings
                .Add("TestingFKId",
                new DropdownInputType {
                    type = "dropdown",
                    displayLabel = "Project Name",
                    editable = true,
                    primaryKey = false,
                    options =
                        allProjects
                            .Select(x =>
                                new DropdownOption {
                                    value = x.ProjectId,
                                    label = x.ProjectName
                                })
                            .ToList()
                });

            return JsonConvert
                .SerializeObject(new {
                    success = true,
                    data = settings,
                    message = "Settings Successfully Retrieved"
                });
        }
    }
}
