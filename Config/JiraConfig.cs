using System.Collections.Generic;

namespace StandupHelper.Config 
{
    public class JiraConfig
    {
        public JiraConfig()
        {
            TeamFilters = new Dictionary<string, string[]>();
        }

        public string UserName { get; set; }
        public string Password { get; set; }
        public string MergeColumnFilter { get; set; }
        public string PrankIssue { get; set; }
        public string PrankIssueColumn { get; set; }
        public Dictionary<string, string[]> TeamFilters { get; set; }
    }
}