namespace StandupHelper.Config 
{
    public class JiraConfig
    {
        public JiraConfig()
        {
            
        }

        public string UserName { get; set; }
        public string Password { get; set; }
        public string MergeColumnFilter { get; set; }
        public string PrankIssue { get; set; }
        public string PrankIssueColumn { get; set; }
    }
}