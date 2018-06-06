using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VoidJudge.Models;
using VoidJudge.Models.Auth;
using VoidJudge.Services.Auth;

namespace VoidJudge.Controllers
{
    [Route("api/[controller]")]
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
        [Produces("application/json")]
        [Route("[action]")]
        [HttpPost]
        public IActionResult Login([FromBody] LoginUser loginUser)
        {
            var ipAddress = Request.HttpContext.Connection.RemoteIpAddress.ToString();
            var result = _authService.Login(loginUser, ipAddress);
            if (result.Type == LoginType.Wrong)
            {
                return new ObjectResult(new GeneralResult { Error = $"{(int)result.Type}" })
                {
                    StatusCode = StatusCodes.Status401Unauthorized
                };
            }
            else if (result.Type == LoginType.Error)
            {
                return new ObjectResult(new GeneralResult {Error = $"{(int) result.Type}"})
                {
                    StatusCode = StatusCodes.Status503ServiceUnavailable
                };
            }
            else
            {
                return Ok(new GeneralResult { Error = $"{(int)result.Type}", Data = new { result.Token } });
            }
        }
    }
}