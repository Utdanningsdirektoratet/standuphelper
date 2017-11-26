using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using StandupHelper.Models.Response;

namespace standuphelper.Models
{
    public class PreloadViewModel
    {
        private readonly JsonSerializerSettings _jsonSettings =
            new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() };

        public PreloadViewModel(BoardResponseModel board)
        {
            Board = board;
        }

        public BoardResponseModel Board { get; set; }

        public override string ToString()
        {
            return JsonConvert.SerializeObject(this, _jsonSettings);
        }
    }
}