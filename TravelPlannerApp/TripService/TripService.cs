using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.ServiceFabric.Services.Communication.AspNetCore;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using System.Fabric;
using System.Text;
using TripService.Data;
using TripService.Services;

namespace TripService
{
    internal sealed class TripService : StatelessService
    {
        public TripService(StatelessServiceContext context)
            : base(context)
        { }

        protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
        {
            return new ServiceInstanceListener[]
            {
                new ServiceInstanceListener(serviceContext =>
                    new KestrelCommunicationListener(serviceContext, "ServiceEndpoint", (url, listener) =>
                    {
                        ServiceEventSource.Current.ServiceMessage(serviceContext, $"Starting Kestrel on {url}");

                        var builder = WebApplication.CreateBuilder();


                        builder.Services.AddSingleton(serviceContext);


                        builder.Services.AddControllers();
                        builder.Services.AddEndpointsApiExplorer();
                        builder.Services.AddSwaggerGen();


                        builder.Services.AddDbContext<AppDbContext>(options =>
                            options.UseSqlServer(
                                builder.Configuration.GetConnectionString("DefaultConnection")));


                        builder.Services.AddScoped<TripManagementService>();
                        builder.Services.AddScoped<DestinationService>();
                        builder.Services.AddScoped<ActivityService>();
                        builder.Services.AddScoped<ExpenseService>();
                        builder.Services.AddScoped<ChecklistService>();


                        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                            .AddJwtBearer(options =>
                            {
                                options.TokenValidationParameters = new TokenValidationParameters
                                {
                                    ValidateIssuer = true,
                                    ValidateAudience = true,
                                    ValidateLifetime = true,
                                    ValidateIssuerSigningKey = true,
                                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                                    ValidAudience = builder.Configuration["Jwt:Audience"],
                                    IssuerSigningKey = new SymmetricSecurityKey(
                                        Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
                                };
                            });


                        builder.Services.AddCors(options =>
                        {
                            options.AddPolicy("AllowFrontend", policy =>
                            {
                                policy.AllowAnyOrigin()
                                      .AllowAnyHeader()
                                      .AllowAnyMethod();
                            });
                        });


                        var app = builder.Build();

                        app.UseSwagger();
                        app.UseSwaggerUI();

                        app.UseCors("AllowFrontend");

                        app.UseAuthentication();
                        app.UseAuthorization();

                        app.MapControllers();

                        return app;
                    }))
            };
        }
    }
}
