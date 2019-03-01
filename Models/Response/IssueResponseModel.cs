using System;
using System.Collections.Generic;
using System.Linq;
using StandupHelper.Models.Jira;

namespace StandupHelper.Models.Response
{

    public class IssueResponseModel
    {
        public string Id { get; set; }
        public string Url { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Color => GetColor();
        public string Title { get; set; }
        public string Description { get; set; }
        public string Assignee { get; set; }
        public string Avatar { get; set; }
        public IEnumerable<string> Labels { get; set; }
        public IEnumerable<string> UnReleasedFixVersions { get; set; }
        public int ReleasedFixVersions { get; set; }

        public IssueResponseModel(IssueModel issue)
        {
            Id = issue.Id;
            Url = issue.Self;
            Name = issue.Key;
            Type = issue.Fields.Issuetype.Name;
            Title = issue.Fields.Summary;
            Assignee = issue.Fields.Assignee?.Name ?? "INGEN";
            Avatar = issue.Fields.Assignee?.AvatarUrls["48x48"];
            Description = issue.Fields.Description?.Replace("\r\n", "<br/>").Replace("(/)", "✔").Replace("(x)", "✘").Replace("(i)", "ℹ️").Replace("(!)", "❗");
            Labels = issue.Fields.Labels;
            UnReleasedFixVersions = issue.Fields.FixVersions.Where(v => !v.Released).Select(v => v.Name).ToList();
            ReleasedFixVersions = issue.Fields.FixVersions.Count() - UnReleasedFixVersions.Count();
        }

        private string GetColor() 
        {
            switch(Type) 
            {
                case "Story": 
                    return "green";
                case "Bug":
                    return "red";
                case "Task":
                    return "offwhite";
                default:
                    return "grey";
            }
        }
    }
}