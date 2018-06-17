using System;
using System.Data.SqlClient;
using System.Text;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using VoidJudge.Data;
using VoidJudge.Helpers.Auth;
using VoidJudge.Models.Identity;
using VoidJudge.Services.Auth;
using VoidJudge.Services.Contest;
using VoidJudge.Services.Identity;

namespace VoidJudge
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
            services.AddAutoMapper();

            //services.AddDbContext<VoidJudgeContext>(options =>
            //    options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            var builder = new SqlConnectionStringBuilder(
                Configuration.GetConnectionString("LocalSQLServerConnection"));

            if (string.IsNullOrEmpty(builder.Password))
            {
                builder.Password = Configuration["DbPassword"];
            }

            services.AddDbContext<VoidJudgeContext>(options =>
                options.UseSqlServer(builder.ConnectionString));

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ClockSkew = new TimeSpan(0, 0, 5),
                        ValidateIssuerSigningKey = true,//是否验证SecurityKey
                        ValidAudience = Configuration["Audience"],//Audience
                        ValidIssuer = Configuration["Issuer"],//Issuer，这两项和前面签发jwt的设置一致
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["SecretKey"]))//拿到SecretKey
                    };
                });

            services.AddScoped<PasswordHasher<UserModel>>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IContestService, ContestService>();
            services.AddScoped<IStudentService, StudentService>();
            services.AddScoped<IProblemService, ProblemService>();

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1)
                .AddJsonOptions(setupAction =>
                {
                    setupAction.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.Local;
                });

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
                app.UseHttpsRedirection();
            }

            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseAuthentication();
            app.UseUserAuth();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    //spa.UseAngularCliServer(npmScript: "start");
                    spa.UseProxyToSpaDevelopmentServer("http://localhost:5244");
                }
            });
        }
    }
}
