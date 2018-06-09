using Microsoft.AspNetCore.Builder;

namespace VoidJudge.Helpers.Auth
{
    public static class UserAuthMiddlewareExtensions
    {
        public static IApplicationBuilder UseUserAuth(
            this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<UserAuthMiddleware>();
        }
    }
}