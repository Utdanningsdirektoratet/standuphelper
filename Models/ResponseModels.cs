using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using StandupHelper.Models.Jira;

namespace StandupHelper.Models.Response
{
    public class BoardResponseModel
    {
        private readonly JsonSerializerSettings _jsonSettings =
            new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() };
        public ColumnResponseModel InProgress { get; set; }
        public ColumnResponseModel PeerReview { get; set; }
        public ColumnResponseModel Test { get; set; }
        public ColumnResponseModel Merge { get; set; }

        public override string ToString()
        {
            return JsonConvert.SerializeObject(this, _jsonSettings);
        }
    }

    public class ColumnResponseModel
    {
        public IEnumerable<IssueResponseModel> Issues { get; set; }
        public ColumnResponseModel(ColumnModel column)
        {
            Issues = column.Issues.Select(i => new IssueResponseModel(i));
        }
    }

    public class IssueResponseModel
    {
        public string Id { get; set; }
        public string Url { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Title { get; set; }
        public string Assignee { get; set; }
        public string Avatar { get; set; }

        public IssueResponseModel(IssueModel issue)
        {
            Id = issue.Id;
            Url = issue.Self;
            Name = issue.Key;
            Type = issue.Fields.Issuetype.Name;
            Title = issue.Fields.Summary;
            Assignee = issue.Fields.Assignee.Name;
            Avatar = issue.Fields.Assignee.AvatarUrls["48x48"];
        }
    }
}