using System;
using System.Collections.Generic;
using System.Linq;
using StandupHelper.Models.Jira;

namespace StandupHelper.Models.Response
{
    public class ColumnResponseModel
    {
        public string Title { get; set; }
        public IEnumerable<IssueResponseModel> Issues { get; set; }
        public ColumnResponseModel(ColumnModel column, string title)
        {
            Title = title;
            Issues = column.Issues.Where(i => !string.Equals(i.Fields.Issuetype.Name, "Epic", StringComparison.InvariantCultureIgnoreCase)).Select(i => new IssueResponseModel(i)).ToList();
        }
    }
}