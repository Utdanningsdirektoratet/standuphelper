using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Net.Http.Formatting;
using StandupHelper.Config;
using StandupHelper.Utils;
using System.Net.Http;
using StandupHelper.Models.Jira;
using StandupHelper.Models.Response;
using standuphelper.Models;

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
            return View(new PreloadViewModel(board));
        }

        private async Task<BoardResponseModel> GetBoard()
        {
            using(var client = _httpClientUtils.GetClient())
            {
                var inProgress = await GetColumn(client, "In Progress");
                var peerReview = await GetColumn(client, "Peer Review");
                var test = await GetColumn(client, "System Test");
                var merge = await GetMergeColumn(client);
                return new BoardResponseModel
                {
                    InProgress = inProgress,
                    PeerReview = peerReview,
                    Test = test,
                    Merge = merge
                };
            }
        }

        private async Task<ColumnResponseModel> GetColumn(HttpClient client, string column)
        {
            var response = await client.GetAsync($"https://jira.udir.no/rest/agile/1.0/board/145/issue?jql=status='{column}'");
            var columnModel = await response.Content.ReadAsAsync<ColumnModel>();
            return new ColumnResponseModel(columnModel);
        }

        private async Task<ColumnResponseModel> GetMergeColumn(HttpClient client)
        {
            var response = await client.GetAsync($"https://jira.udir.no/rest/agile/1.0/board/145/issue?jql=status='Done' AND (fixVersion in unreleasedVersions() OR fixVersion is EMPTY )");
            var columnModel = await response.Content.ReadAsAsync<ColumnModel>();
            return new ColumnResponseModel(columnModel);
        }
    }
}
