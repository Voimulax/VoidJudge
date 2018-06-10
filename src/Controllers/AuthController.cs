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
            switch (result.Type)
            {
                case AuthResult.Wrong:
                    return new ObjectResult(new GeneralResult { Error = $"{(int)result.Type}" })
                    {
                        StatusCode = StatusCodes.Status401Unauthorized
                    };
                case AuthResult.Error:
                    return new ObjectResult(new GeneralResult { Error = $"{(int)result.Type}" })
                    {
                        StatusCode = StatusCodes.Status400BadRequest
                    };
                case AuthResult.Ok:
                    return Ok(new GeneralResult { Error = $"{(int)result.Type}", Data = new { result.Token } });
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        [Route("resetpassword")]
        [HttpPost]
        public async Task<IActionResult> ResetPasswordAsync([FromBody] ResetUser resetUser)
        {
            var result = await _authService.ResetPasswordAsync(resetUser);
            switch (result)
            {
                case AuthResult.Wrong:
                    return new ObjectResult(new GeneralResult { Error = $"{(int)result}" })
                    {
                        StatusCode = StatusCodes.Status401Unauthorized
                    };
                case AuthResult.Error:
                    return new ObjectResult(new GeneralResult { Error = $"{(int)result}" })
                    {
                        StatusCode = StatusCodes.Status400BadRequest
                    };
                case AuthResult.Ok:
                    return Ok(new GeneralResult { Error = $"{(int)result}" });
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }
    }
}