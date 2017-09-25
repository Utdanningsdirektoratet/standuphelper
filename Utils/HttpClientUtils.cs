using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using StandupHelper.Config;

namespace StandupHelper.Utils 
{
    public class HttpClientUtils 
    {
        private readonly JiraConfig _config;

        public HttpClientUtils(IOptions<JiraConfig> config)
        {
            _config = config.Value;
        }

        public HttpClient GetClient()
        {
            var credentials = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{_config.UserName}:{_config.Password}"));

            var client = new HttpClient(new RetryHandler(new HttpClientHandler()));
            System.Net.ServicePointManager.Expect100Continue = false;
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", credentials);
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            return client;
        }
    }

    public class RetryHandler : DelegatingHandler
    {
        private const int MaxRetries = 3;

        public RetryHandler(HttpMessageHandler innerHandler)
            : base(innerHandler)
        {
        }

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            HttpResponseMessage response = null;
            for (int i = 0; i < MaxRetries; i++)
            {
                response = await base.SendAsync(request, cancellationToken);
                
                if (response.IsSuccessStatusCode)
                {
                    return response;
                }

                var error = await response.Content.ReadAsStringAsync();
                System.Diagnostics.Debug.WriteLine(error);
                
                await Task.Delay(2000);
            }

            return response;
        }
    }
}