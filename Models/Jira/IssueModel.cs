namespace StandupHelper.Models.Jira
{
    public class IssueModel
    {
        public string Id { get; set; }
        public string Self { get; set; }
        public string Key { get; set; }
        public FieldsModel Fields { get; set; }

    }

}