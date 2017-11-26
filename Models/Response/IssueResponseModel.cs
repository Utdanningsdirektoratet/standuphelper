using StandupHelper.Models.Jira;

namespace StandupHelper.Models.Response
{

    public class IssueResponseModel
    {
        public string Id { get; set; }
        public string Url { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
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
            Description = issue.Fields.Description?.Replace("\r\n", "<br/>");
        }
    }
}