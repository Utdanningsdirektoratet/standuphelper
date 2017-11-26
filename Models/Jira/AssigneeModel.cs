using System.Collections.Generic;

namespace StandupHelper.Models.Jira
{

    public class AssigneeModel
    {
        public string Name { get; set; }
        public Dictionary<string, string> AvatarUrls { get; set; }
    }

}