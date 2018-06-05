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

        private ColumnResponseModel() { }
        private ColumnResponseModel(ColumnModel column, string title)
        {
            Title = title;
            Issues = column.Issues
                .Where(i => !string.Equals(i.Fields.Issuetype.Name, "Epic", StringComparison.InvariantCultureIgnoreCase))
                .Select(i => new IssueResponseModel(i)).ToList();
        }

        public static ColumnResponseModel ForColumn(ColumnModel column, string title)
        {
            return new ColumnResponseModel(column, title);
        }

        public static ColumnResponseModel ForMerge(ColumnModel column)
        {
            return new ColumnResponseModel
            {
                Title = "Merge",
                Issues = column.Issues
                    .Where(i => !i.Fields.Labels.Any(l => string.Equals("merged", l, StringComparison.InvariantCultureIgnoreCase)))
                    .Where(i => !string.Equals(i.Fields.Issuetype.Name, "Epic", StringComparison.InvariantCultureIgnoreCase))
                    .Select(i => new IssueResponseModel(i)).ToList()
            };
        }
    }
}