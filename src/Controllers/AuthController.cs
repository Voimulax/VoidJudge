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
        [Route("[action]")]
        [HttpPost]
        public IActionResult Login([FromBody] LoginUser loginUser)
        {
            var ipAddress = Request.HttpContext.Connection.RemoteIpAddress.ToString();
            var result = _authService.Login(loginUser, ipAddress);
            if (result.Type == AuthResult.Wrong)
            {
                return new ObjectResult(new GeneralResult { Error = $"{(int)result.Type}" })
                {
                    StatusCode = StatusCodes.Status401Unauthorized
                };
            }
            else if (result.Type == AuthResult.Error)
            {
                return new ObjectResult(new GeneralResult { Error = $"{(int)result.Type}" })
                {
                    StatusCode = StatusCodes.Status400BadRequest
                };
            }
            else
            {
                return Ok(new GeneralResult { Error = $"{(int)result.Type}", Data = new { result.Token } });
            }
        }

        [Route("[action]")]
        [HttpPost]
        public IActionResult ResetPassword([FromBody] ResetUser resetUser)
        {
            var result = _authService.ResetPassword(resetUser);
            if (result == AuthResult.Wrong)
            {
                return new ObjectResult(new GeneralResult { Error = $"{(int)result}" })
                {
                    StatusCode = StatusCodes.Status401Unauthorized
                };
            }
            else if (result == AuthResult.Error)
            {
                return new ObjectResult(new GeneralResult { Error = $"{(int)result}" })
                {
                    StatusCode = StatusCodes.Status400BadRequest
                };
            }
            else
            {
                return Ok(new GeneralResult { Error = $"{(int)result}" });
            }
        }
    }
}