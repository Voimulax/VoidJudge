using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VoidJudge.Models;
using VoidJudge.Models.User;
using VoidJudge.Services;

namespace VoidJudge.Controllers
{
    [Route("api/[controller]")]
    [Produces("application/json")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] IEnumerable<User<AddUserBasicInfo>> addUsers)
        {
            var result = await _userService.AddUsers(addUsers);
            if (result.Type == AddResult.Repeat)
            {
                return new ObjectResult(new GeneralResult { Error = $"{(int)result.Type}", Data = result.Repeat })
                {
                    StatusCode = StatusCodes.Status406NotAcceptable
                };
            }
            else if (result.Type == AddResult.Wrong)
            {
                return new ObjectResult(new GeneralResult { Error = $"{(int)result.Type}" })
                {
                    StatusCode = StatusCodes.Status406NotAcceptable
                };
            }
            else if (result.Type == AddResult.Error)
            {
                return BadRequest(new GeneralResult {Error = $"{(int) result.Type}"});
            }
            else
            {
                return Ok(new GeneralResult { Error = $"{(int)result.Type}" });
            }
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser([FromRoute] long id, [FromQuery] string roleCode)
        {
            var claims = Request.HttpContext.User.Claims;
            if (!_userService.CheckAuth(claims, roleCode)) return new ObjectResult(new GeneralResult { Error = "1" }) { StatusCode = StatusCodes.Status401Unauthorized };
            var user = await _userService.GetUser(id, roleCode);

            if (user == null)
            {
                return NotFound(new GeneralResult { Error = "2" });
            }

            return Ok(new GeneralResult { Error = "0", Data = user });
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery] string roleCode)
        {
            var user = await _userService.GetUsers(roleCode);

            if (user == null)
            {
                return NotFound(new GeneralResult { Error = "1" });
            }

            return Ok(new GeneralResult { Error = "0", Data = user });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser([FromRoute] long id, [FromBody] User<IdUserBasicInfo> putUser)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new GeneralResult { Error = "3" , Data = ModelState });
            }

            if (id != putUser.BasicInfo.Id)
            {
                return BadRequest(new GeneralResult { Error = "3" });
            }

            var result = await _userService.PutUser(putUser);
            if (result == PutResult.ConcurrencyException)
            {
                return BadRequest(new GeneralResult {Error = $"{(int)result}" });
            } 
            else if (result == PutResult.UserNotFound)
            {
                return NotFound(new GeneralResult { Error = $"{(int)result}" });
            }
            else if (result == PutResult.Error)
            {
                return BadRequest(new GeneralResult { Error = $"{(int)result}" });
            }
            else
            {
                return Ok(new GeneralResult {Error = $"{(int) result}"});
            }
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser([FromRoute] long id)
        {
            var result = await _userService.DeleteUser(id);
            if (result == DeleteResult.Forbiddance)
            {
                return new ObjectResult(new GeneralResult { Error = $"{(int)result}"})
                {
                    StatusCode = StatusCodes.Status403Forbidden
                };
            }
            else if (result == DeleteResult.UserNotFound)
            {
                return NotFound(new GeneralResult { Error = $"{(int)result}" });
            }
            else if (result == DeleteResult.Error)
            {
                return BadRequest(new GeneralResult { Error = $"{(int)result}" });
            }
            else
            {
                return Ok(new GeneralResult { Error = $"{(int)result}" });
            }
        }
    }
}