using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StandupHelper.Config;
using StandupHelper.Utils;
using Udir.Authentication.OpenId;

namespace StandupHelper
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IWebHostEnvironment environment)
        {
            Configuration = configuration;
            Environment = environment;
        }

        public IConfiguration Configuration { get; }
        private IWebHostEnvironment Environment { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<JiraConfig>(Configuration.GetSection("Jira"));
            services.AddSingleton<HttpClientUtils, HttpClientUtils>();

            services.UseUdirOpenIdAuthentication(options =>
                {
                    var providerConfig = new IdentityProviderConfig();
                    Configuration.Bind("IdentityProvider", providerConfig);

                    options.CookieSchemeName = "HelpersAuthCookie";
                    options.Authority = providerConfig.Authority;
                    options.ClientId = providerConfig.ClientId;
                    options.ClientSecret = providerConfig.ClientSecret;

                    options.Scopes.Add(UdirScopes.Id);
                    options.Scopes.Add(UdirScopes.OpenId);
                    options.Scopes.Add(UdirScopes.Email);
                    options.Scopes.Add(UdirScopes.UdirGroups);

                    options.CookieSlidingExpiration = false;
                    options.CookieExpireTimeSpanHours = 8;
                    options.GetClaimsFromUserInfoEndpoint = true;
                    options.UseTokenLifetime = false;
                    options.NameClaimType = "name";
                    options.ClaimActions = new DefaultClaimActions();
                    options.CookiesSameSiteMode = OpenIdBaseOptions.GetRecommendedSameSiteMode(Environment);
                    options.CookiesSecurePolicy = OpenIdBaseOptions.GetRecommendedCookieSecurePolicy(Environment);
                }
            );

            services.AddAuthorization(options =>
            {
                options.DefaultPolicy = new AuthorizationPolicyBuilder()
                    .AddAuthenticationSchemes(OpenIdConnectDefaults.AuthenticationScheme)
                    .RequireAuthenticatedUser()
                    .Build();
            });

            services.AddMvc(o =>
            {
                o.Filters.Add(new AuthorizeFilter());
            });
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

            app.UseAuthentication();
            app.UseAuthorization();

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
