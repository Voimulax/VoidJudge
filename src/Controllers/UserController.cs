using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
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

        [Authorize(Roles = "0")]
        [HttpPost]
        public async Task<IActionResult> PostAsync([FromBody] IEnumerable<User<AddUserBasicInfo>> addUsers)
        {
            var result = await _userService.AddUsersAsync(addUsers);
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
                return BadRequest(new GeneralResult { Error = $"{(int)result.Type}" });
            }
            else
            {
                return Ok(new GeneralResult { Error = $"{(int)result.Type}" });
            }
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserAsync([FromRoute] long id)
        {
            var roleType = Request.HttpContext.User.Claims.SingleOrDefault(x => x.Type == ClaimTypes.Role)?.Value;
            if (roleType == null)
            {
                return BadRequest(new GeneralResult { Error = $"{(int)GetResult.Error}" });
            }

            var result = await _userService.GetUserAsync(id, roleType);

            switch (result.Type)
            {
                case GetResult.Unauthorized:
                    return new ObjectResult(new GeneralResult { Error = "1" }) { StatusCode = StatusCodes.Status401Unauthorized };
                case GetResult.UserNotFound:
                    return NotFound(new GeneralResult { Error = $"{(int)result.Type}" });
                case GetResult.Ok:
                    return Ok(new GeneralResult { Error = $"{(int)result.Type}", Data = result.User });
                case GetResult.Error:
                    return BadRequest(new GeneralResult { Error = $"{(int)result.Type}" });
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        [Authorize(Roles = "0")]
        [HttpGet]
        public async Task<IActionResult> GetUsersAsync([FromQuery] string roleType)
        {
            var user = await _userService.GetUsersAsync(roleType.Split('#'));

            if (user == null)
            {
                return NotFound(new GeneralResult { Error = "1" });
            }

            return Ok(new GeneralResult { Error = "0", Data = user });
        }

        [Authorize(Roles = "0")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserAsync([FromRoute] long id, [FromBody] User<PutUserBasicInfo> putUser)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new GeneralResult { Error = "3", Data = ModelState });
            }

            if (id != putUser.BasicInfo.Id)
            {
                return BadRequest(new GeneralResult { Error = "3" });
            }

            var result = await _userService.PutUserAsync(putUser);
            switch (result.Type)
            {
                case PutResult.ConcurrencyException:
                    return BadRequest(new GeneralResult { Error = $"{(int)result.Type}" });
                case PutResult.UserNotFound:
                    return NotFound(new GeneralResult { Error = $"{(int)result.Type}" });
                case PutResult.Error:
                    return BadRequest(new GeneralResult { Error = $"{(int)result.Type}" });
                case PutResult.Ok:
                    return Ok(new GeneralResult { Error = $"{(int)result.Type}", Data = result.User });
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        [Authorize(Roles = "0")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserAsync([FromRoute] long id)
        {
            var result = await _userService.DeleteUserAsync(id);
            switch (result)
            {
                case DeleteResult.Forbiddance:
                    return new ObjectResult(new GeneralResult { Error = $"{(int)result}" })
                    {
                        StatusCode = StatusCodes.Status403Forbidden
                    };
                case DeleteResult.UserNotFound:
                    return NotFound(new GeneralResult { Error = $"{(int)result}" });
                case DeleteResult.Error:
                    return BadRequest(new GeneralResult { Error = $"{(int)result}" });
                case DeleteResult.Ok:
                    return Ok(new GeneralResult { Error = $"{(int)result}" });
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }
    }
}