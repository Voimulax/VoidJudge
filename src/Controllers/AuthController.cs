using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VoidJudge.Models;
using VoidJudge.Models.Auth;
using VoidJudge.Services;

namespace VoidJudge.Controllers
{
    [Route("api/[controller]")]
    [Produces("application/json")]
    [Authorize]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [AllowAnonymous]
        [Route("login")]
        [HttpPost]
        public async Task<IActionResult> LoginAsync([FromBody] LoginUser loginUser)
        {
            var ipAddress = Request.HttpContext.Connection.RemoteIpAddress.ToString();
            var result = await _authService.LoginAsync(loginUser, ipAddress);
            switch (result.Error)
            {
                case AuthResultTypes.Wrong:
                    return new ObjectResult(result)
                    {
                        StatusCode = StatusCodes.Status401Unauthorized
                    };
                case AuthResultTypes.Error:
                    return new ObjectResult(result)
                    {
                        StatusCode = StatusCodes.Status400BadRequest
                    };
                case AuthResultTypes.Ok:
                    return Ok(result);
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        [Route("resetpassword")]
        [HttpPost]
        public async Task<IActionResult> ResetPasswordAsync([FromBody] ResetUser resetUser)
        {
            var result = await _authService.ResetPasswordAsync(resetUser);
            switch (result.Error)
            {
                case AuthResultTypes.Wrong:
                    return new ObjectResult(result)
                    {
                        StatusCode = StatusCodes.Status401Unauthorized
                    };
                case AuthResultTypes.Error:
                    return new ObjectResult(result)
                    {
                        StatusCode = StatusCodes.Status400BadRequest
                    };
                case AuthResultTypes.Ok:
                    return Ok(result);
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }
    }
}