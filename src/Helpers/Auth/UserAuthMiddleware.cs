using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using VoidJudge.Services;

namespace VoidJudge.Helpers.Auth
{
    public class UserAuthMiddleware
    {
        private readonly RequestDelegate _next;

        public UserAuthMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, IAuthService authService)
        {
            var sid = context.User.Claims.SingleOrDefault(x => x.Type == "id")?.Value;
            if (sid != null)
            {
                if (long.TryParse(sid, out var id))
                {
                    if (!await authService.IsUserExistAsync(id))
                    {
                        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                        context.Response.Body = null;
                        return;
                    }
                }
                else
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    context.Response.Body = null;
                    return;
                }
            }

            // Call the next delegate/middleware in the pipeline
            await _next(context);
        }
    }
}