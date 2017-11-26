using System.Collections.Generic;
using System.Linq;
using StandupHelper.Models.Jira;

namespace StandupHelper.Models.Response
{
    public class ColumnResponseModel
    {
        public IEnumerable<IssueResponseModel> Issues { get; set; }
        public ColumnResponseModel(ColumnModel column)
        {
            Issues = column.Issues.Select(i => new IssueResponseModel(i));
        }
    }
}