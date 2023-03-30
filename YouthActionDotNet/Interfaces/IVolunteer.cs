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
using System.Security.Cryptography;
using YouthActionDotNet.DAL;
using YouthActionDotNet.Control;

namespace YouthActionDotNet.Interfaces
{
    public interface IVolunteer
    {
        Task<ActionResult<string>> All();
        Task<ActionResult<string>> All([FromBody] SearchRequest request);
        Task<ActionResult<string>> Approve(string id, Employee template);
        Task<ActionResult<string>> Create(Volunteer template);
        Task<ActionResult<string>> Delete(string id);
        Task<ActionResult<string>> Delete(Volunteer template);
        bool Exists(string id);
        Task<ActionResult<string>> Get(string id);
        Task<ActionResult<string>> Register(Volunteer template);
        Task<ActionResult<string>> RevokeApproval(string id);
        string Settings();
        Task<ActionResult<string>> Update(string id, Volunteer template);
        Task<ActionResult<string>> UpdateAndFetchAll(string id, Volunteer template);
    }

}