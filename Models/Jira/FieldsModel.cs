using System.Collections.Generic;

namespace StandupHelper.Models.Jira
{
    public class FieldsModel
    {
        public string Description { get; set; }
        public IssuetypeModel Issuetype { get; set; }

        public IEnumerable<FixVersionModel> FixVersions { get; set; }
        public AssigneeModel Assignee { get; set; }
        public string Summary { get; set; }

        public IEnumerable<string> Labels {get; set; }
    }
}