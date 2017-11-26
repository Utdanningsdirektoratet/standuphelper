using System.Collections.Generic;

namespace StandupHelper.Models.Jira
{
    public class ColumnModel 
    {
        public IEnumerable<IssueModel> Issues { get; set; }
    }

}