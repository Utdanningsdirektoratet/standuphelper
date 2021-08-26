using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using StandupHelper.Config;
using StandupHelper.Utils;
using System.Net.Http;
using Microsoft.Extensions.Options;
using StandupHelper.Models.Jira;
using StandupHelper.Models.Response;
using standuphelper.Models;

namespace StandupHelper.Controllers
{
    public class AppController : Controller
    {
        private readonly HttpClientUtils _httpClientUtils;
        private readonly ILogger<AppController> _logger;
        private readonly IOptions<JiraConfig> _jiraConfig;

        public AppController(HttpClientUtils httpClientUtils, ILogger<AppController> logger, IOptions<JiraConfig> jiraConfig)
        {
            _httpClientUtils = httpClientUtils;
            _logger = logger;
            _jiraConfig = jiraConfig;
        }
        public IActionResult Index()
        {            
            return View();
        }

        [HttpGet]
        public async Task<JsonResult> Get([FromQuery]string team = null)
        {            
            var board = await GetBoard(team?.ToLowerInvariant());
            return new JsonResult(new PreloadViewModel(board));
        }

        private async Task<BoardResponseModel> GetBoard(string team = null)
        {
            using(var client = _httpClientUtils.GetClient())
            {
                var teamNames = team != null && _jiraConfig.Value.TeamFilters.ContainsKey(team)
                    ? _jiraConfig.Value.TeamFilters[team]
                    : Array.Empty<string>();
                    
                var inProgress = await GetColumn(client, "In Progress", teamNames);
                var peerReview = await GetColumn(client, "Peer Review", teamNames);
                var test = await GetColumn(client, "System Test", teamNames);
                var merge = await GetMergeColumn(client, teamNames);

                // Trollface
                if (_jiraConfig.Value.PrankIssue != null && _jiraConfig.Value.PrankIssue.Trim() != "")
                {
                    var issue = await GetIssue(client, _jiraConfig.Value.PrankIssue);
                    if (issue != null)
                    {
                        switch (_jiraConfig.Value.PrankIssueColumn)
                        {
                            case "Merge":
                                merge.Issues = merge.Issues.Append(issue);
                                break;
                            case "Peer Review":
                                peerReview.Issues = peerReview.Issues.Append(issue);
                                break;
                            case "System Test":
                                test.Issues = test.Issues.Append(issue);
                                break;
                            default:
                                inProgress.Issues = inProgress.Issues.Append(issue);
                                break;
                        }
                    }
                }

                return new BoardResponseModel
                {
                    InProgress = inProgress,
                    PeerReview = peerReview,
                    Test = test,
                    Merge = merge
                };
            }
        }

        private async Task<ColumnResponseModel> GetColumn(HttpClient client, string column, string[] teamNames)
        {
            var response = await client.GetAsync($"https://jira.udir.no/rest/agile/1.0/board/145/issue?jql=status='{column}'");
            var columnModel = await response.Content.ReadAsAsync<ColumnModel>();
            return ColumnResponseModel.ForColumn(columnModel, column, teamNames);
        }

        private async Task<IssueResponseModel> GetIssue(HttpClient client, string issue)
        {
            var response = await client.GetAsync($"https://jira.udir.no/rest/agile/1.0/board/145/issue?jql=Issue={issue}");
            var columnModel = await response.Content.ReadAsAsync<ColumnModel>();
            return columnModel.Issues?.Select(i => new IssueResponseModel(i)).FirstOrDefault();
        }

        private async Task<ColumnResponseModel> GetMergeColumn(HttpClient client, string[] teamNames)
        {
            var response = await client.GetAsync($"https://jira.udir.no/rest/agile/1.0/board/145/issue?jql={_jiraConfig.Value.MergeColumnFilter}");
            var columnModel = await response.Content.ReadAsAsync<ColumnModel>();
            return ColumnResponseModel.ForMerge(columnModel, teamNames);
        }
    }
}
