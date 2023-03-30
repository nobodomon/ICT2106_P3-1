using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using YouthActionDotNet.Control;
using YouthActionDotNet.DAL;
using YouthActionDotNet.Data;
using YouthActionDotNet.Models;

namespace YouthActionDotNet.Interfaces
{
    public interface IPermission
    {
        Task<ActionResult<string>> All();

        Task<ActionResult<string>> All([FromBody] SearchRequest request);

        Task<ActionResult<string>> Create(Permissions template);

        Task<ActionResult<string>> CreateModule(string name);

        Task<ActionResult<string>> Delete(string id);

        Task<ActionResult<string>> Delete(Permissions template);

        bool Exists(string id);

        Task<ActionResult<string>> Get(string id);

        string GetAllModules();

        Task<ActionResult<string>> GetByRole(string role);

        Task<ActionResult<string>> DeleteModule(string name);

        string Settings();

        Task<ActionResult<string>> Update(string id, Permissions template);

        Task<ActionResult<string>>
        UpdateAndFetchAll(
            string id, Permissions template
        );
    }
}
