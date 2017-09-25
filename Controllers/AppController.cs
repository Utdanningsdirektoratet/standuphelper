using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Net.Http.Formatting;
using StandupHelper.Config;
using StandupHelper.Utils;
using System.Net.Http;

namespace StandupHelper.Controllers
{
    public class AppController : Controller
    {
        private readonly HttpClientUtils _httpClientUtils;
        private readonly ILogger<AppController> _logger;

        public AppController(HttpClientUtils httpClientUtils, ILogger<AppController> logger)
        {
            _httpClientUtils = httpClientUtils;
            _logger = logger;
        }
        public async Task<IActionResult> Index()
        {            
            var board = await GetBoard();
            return View();
        }

        private async Task<IEnumerable<ColumnModel>> GetBoard()
        {
            using(var client = _httpClientUtils.GetClient())
            {
                var inprogress = await client.GetAsync("https://jira.udir.no/rest/agile/1.0/board/145/issue?jql=status='In Progress'");
                var column = await inprogress.Content.ReadAsAsync<ColumnModel>();

                return new[] { column };
            }
        }
    }

    public class ColumnModel 
    {
        public IEnumerable<IssueModel> Issues { get; set; }
        public int Total { get; set; }
    }

    public class IssueModel
    {
        public string Id { get; set; }
        public string Self { get; set; }
        public string Key { get; set; }
        public FieldsModel Fields { get; set; }

    }

    public class FieldsModel
    {
        public IssuetypeModel Issuetype { get; set; }
        public AssigneeModel Assignee { get; set; }

        public StatusModel Status { get; set; }

        public string Summary { get; set; }

    }

    public class IssuetypeModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }

    public class AssigneeModel
    {
        public string Name { get; set; }
        public Dictionary<string, string> AvatarUrls { get; set; }
    }

    public class StatusModel
    {
        public string Id  { get; set; }
        public string Name { get; set; }
    }
}
