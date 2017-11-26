using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace StandupHelper.Models.Response
{
    public class BoardResponseModel
    {
        public ColumnResponseModel InProgress { get; set; }
        public ColumnResponseModel PeerReview { get; set; }
        public ColumnResponseModel Test { get; set; }
        public ColumnResponseModel Merge { get; set; }

    }
}