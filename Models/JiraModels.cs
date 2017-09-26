using System.Collections.Generic;

namespace StandupHelper.Models.Jira
{
    public class ColumnModel 
    {
        public IEnumerable<IssueModel> Issues { get; set; }
    }

    public class IssueModel
    {
        public string Id { get; set; }
        public string Self { get; set; }
        public string Key { get; set; }
        public FieldsModel Fields { get; set; }

    }

    public class FieldsModel
    {
        public IssuetypeModel Issuetype { get; set; }
        public AssigneeModel Assignee { get; set; }
        public string Summary { get; set; }

    }

    public class IssuetypeModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }

    public class AssigneeModel
    {
        public string Name { get; set; }
        public Dictionary<string, string> AvatarUrls { get; set; }
    }

}