using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VoidJudge.Models;
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
            var token = _authService.Login(loginUser);
            if (token == null) return Unauthorized();
            return Ok(new {token});
        }
    }
}