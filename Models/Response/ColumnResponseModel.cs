using System;
using System.Collections.Generic;
using System.Linq;
using StandupHelper.Models.Jira;

namespace StandupHelper.Models.Response
{
    public class ColumnResponseModel
    {
        private readonly string[] _teamFilter;
        public string Title { get; set; }
        public IEnumerable<IssueResponseModel> Issues { get; set; }

        private ColumnResponseModel() { }

        private ColumnResponseModel(string[] teamFilter)
        {
            _teamFilter = teamFilter;
        }
        private ColumnResponseModel(ColumnModel column, string title, string[] teamFilter) : this (teamFilter)
        {
            Title = title;
            Issues = column.Issues
                .Where(BelongsToTeam)
                .Where(i => !string.Equals(i.Fields.Issuetype.Name, "Epic", StringComparison.InvariantCultureIgnoreCase))
                .Select(i => new IssueResponseModel(i)).ToList();
        }

        private bool BelongsToTeam(IssueModel i) => BelongsToTeam(i, _teamFilter);

        private static bool BelongsToTeam(IssueModel i, string[] teamFilter)
        {
            if (i.Fields.Assignee == null)
            {
                return true;
            }

            return !teamFilter.Any() || teamFilter.Any(n => string.Equals(n, i.Fields.Assignee?.Name.Split("@")[0], StringComparison.InvariantCultureIgnoreCase));
        }

        public static ColumnResponseModel ForColumn(ColumnModel column, string title, string[] teamFilter)
        {
            return new ColumnResponseModel(column, title, teamFilter);
        }

        public static ColumnResponseModel ForMerge(ColumnModel column, string[] teamFilter)
        {
            return new ColumnResponseModel(teamFilter)
            {
                Title = "Merge",
                Issues = column.Issues
                    .Where(i => BelongsToTeam(i, teamFilter))
                    .Where(i => !i.Fields.Labels.Any(l => string.Equals("merged", l, StringComparison.InvariantCultureIgnoreCase)))
                    .Where(i => !string.Equals(i.Fields.Issuetype.Name, "Epic", StringComparison.InvariantCultureIgnoreCase))
                    .Select(i => new IssueResponseModel(i)).ToList()
            };
        }
    }
}