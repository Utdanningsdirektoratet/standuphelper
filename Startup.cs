using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StandupHelper.Config;
using StandupHelper.Utils;

namespace StandupHelper
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<JiraConfig>(Configuration.GetSection("Jira"));
            services.AddSingleton<HttpClientUtils, HttpClientUtils>();

            services.AddMvc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app)
        {
            if (Configuration["DetailedErrors"] == "true")
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseStaticFiles();    
            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    "default",
                    "{controller=App}/{action=Index}");

                endpoints.MapFallbackToController("Index", "App");
            });
        }
    }
}
