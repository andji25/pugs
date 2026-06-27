using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.ServiceFabric.Data;
using Microsoft.ServiceFabric.Services.Communication.AspNetCore;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using SharingService.Data;
using SharingService.Services;
using System.Fabric;
using System.Text;

namespace SharingService
{
    internal sealed class SharingService : StatefulService
    {
        public SharingService(StatefulServiceContext context)
            : base(context)
        { }

        protected override IEnumerable<ServiceReplicaListener> CreateServiceReplicaListeners()
        {
            return new ServiceReplicaListener[]
            {
                new ServiceReplicaListener(serviceContext =>
                    new KestrelCommunicationListener(serviceContext, (url, listener) =>
                    {
                        var builder = WebApplication.CreateBuilder();

                        builder.Services
                            .AddSingleton<StatefulServiceContext>(serviceContext)
                            .AddSingleton<IReliableStateManager>(this.StateManager);

                        builder.Services.AddDbContext<AppDbContext>(options =>
                            options.UseSqlServer("Server=localhost\\SQLEXPRESS;Database=TravelPlannerSharing;Trusted_Connection=True;TrustServerCertificate=True"));

                        builder.Services.AddScoped<ShareTokenService>();

                        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                            .AddJwtBearer(options =>
                            {
                                options.TokenValidationParameters = new TokenValidationParameters
                                {
                                    ValidateIssuer = true,
                                    ValidateAudience = true,
                                    ValidateLifetime = true,
                                    ValidateIssuerSigningKey = true,
                                    ValidIssuer = "TravelPlannerApp",
                                    ValidAudience = "TravelPlannerApp",
                                    IssuerSigningKey = new SymmetricSecurityKey(
                                        Encoding.UTF8.GetBytes("TravelPlannerSuperSecretKey123!@#"))
                                };
                            });

                        builder.Services.AddCors(options =>
                        {
                            options.AddPolicy("AllowFrontend", policy =>
                            {
                                policy.WithOrigins("http://localhost:5173")
                                      .AllowAnyHeader()
                                      .AllowAnyMethod();
                            });
                        });

                        builder.Services.AddControllers();
                        builder.Services.AddEndpointsApiExplorer();
                        builder.Services.AddSwaggerGen();

                        builder.WebHost
    .UseContentRoot(Directory.GetCurrentDirectory())
    .UseServiceFabricIntegration(listener, ServiceFabricIntegrationOptions.None)
    .UseUrls("http://0.0.0.0:8083");

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