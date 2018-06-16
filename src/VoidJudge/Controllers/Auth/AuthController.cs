using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VoidJudge.Services.Auth;
using VoidJudge.ViewModels.Auth;
using VoidJudge.ViewModels.Identity;

namespace VoidJudge.Controllers.Auth
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
        public async Task<IActionResult> LoginAsync([FromBody] LoginUserViewModel loginUser)
        {
            var ipAddress = Request.HttpContext.Connection.RemoteIpAddress.ToString();
            var result = await _authService.LoginAsync(loginUser, ipAddress);
            switch (result.Error)
            {
                case AuthResultType.Wrong:
                    return new ObjectResult(result)
                    {
                        StatusCode = StatusCodes.Status401Unauthorized
                    };
                case AuthResultType.Error:
                    return BadRequest(result);
                case AuthResultType.Ok:
                    return Ok(result);
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        [Route("resetpassword")]
        [HttpPost]
        public async Task<IActionResult> ResetPasswordAsync([FromBody] ResetUserViewModel resetUser)
        {
            var id = _authService.GetUserIdFromRequest(Request.HttpContext.User.Claims);
            resetUser.Id = id;
            var result = await _authService.ResetPasswordAsync(resetUser);
            switch (result.Error)
            {
                case AuthResultType.Wrong:
                    return new ObjectResult(result)
                    {
                        StatusCode = StatusCodes.Status401Unauthorized
                    };
                case AuthResultType.Error:
                    return BadRequest(result);
                case AuthResultType.Ok:
                    return Ok(result);
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }
    }
}