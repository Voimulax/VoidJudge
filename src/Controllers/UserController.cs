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
        private readonly IAuthService _authService;
        private readonly IUserService _userService;

        public UserController(IUserService userService, IAuthService authService)
        {
            _userService = userService;
            _authService = authService;
        }

        [Authorize(Roles = "0")]
        [HttpPost]
        public async Task<IActionResult> PostAsync([FromBody] IEnumerable<UserInfo<AddUserBasicInfo>> addUsers)
        {
            var result = await _userService.AddUsersAsync(addUsers);
            switch (result.Error)
            {
                case AddResultTypes.Repeat:
                    return new ObjectResult(result)
                    {
                        StatusCode = StatusCodes.Status406NotAcceptable
                    };
                case AddResultTypes.Wrong:
                    return new ObjectResult(result)
                    {
                        StatusCode = StatusCodes.Status406NotAcceptable
                    };
                case AddResultTypes.Error:
                    return BadRequest(result);
                case AddResultTypes.Ok:
                    return Ok(result);
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserAsync([FromRoute] long id)
        {
            var roleType = _authService.GetRoleTypeFromRequest(Request.HttpContext.User.Claims);
            var result = await _userService.GetUserAsync(id, roleType);

            switch (result.Error)
            {
                case GetResultTypes.Unauthorized:
                    return new ObjectResult(result) { StatusCode = StatusCodes.Status401Unauthorized };
                case GetResultTypes.UserNotFound:
                    return NotFound(result);
                case GetResultTypes.Ok:
                    return Ok(result);
                case GetResultTypes.Error:
                    return BadRequest(result);
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        [Authorize(Roles = "0")]
        [HttpGet]
        public async Task<IActionResult> GetUsersAsync([FromQuery] string roleType)
        {
            var result = await _userService.GetUsersAsync(roleType.Split('#'));

            switch (result.Error)
            {
                case GetResultTypes.Unauthorized:
                    return new ObjectResult(result) { StatusCode = StatusCodes.Status401Unauthorized };
                case GetResultTypes.UserNotFound:
                    return NotFound(result);
                case GetResultTypes.Ok:
                    return Ok(result);
                case GetResultTypes.Error:
                    return BadRequest(result);
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        [Authorize(Roles = "0")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserAsync([FromRoute] long id, [FromBody] UserInfo<PutUserBasicInfo> putUser)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiDataResult { Error = PutResultTypes.Wrong, Data = new { ModelState } });
            }

            if (id != putUser.BasicInfo.Id)
            {
                return BadRequest(new ApiResult { Error = PutResultTypes.Wrong });
            }

            var result = await _userService.PutUserAsync(putUser);
            switch (result.Error)
            {
                case PutResultTypes.ConcurrencyException:
                    return BadRequest(result);
                case PutResultTypes.UserNotFound:
                    return NotFound(result);
                case PutResultTypes.Wrong:
                    return NotFound(result);
                case PutResultTypes.Error:
                    return BadRequest(result);
                case PutResultTypes.Ok:
                    return Ok(result);
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        [Authorize(Roles = "0")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserAsync([FromRoute] long id)
        {
            var result = await _userService.DeleteUserAsync(id);
            switch (result.Error)
            {
                case DeleteResultTypes.Forbiddance:
                    return new ObjectResult(result)
                    {
                        StatusCode = StatusCodes.Status403Forbidden
                    };
                case DeleteResultTypes.UserNotFound:
                    return NotFound(result);
                case DeleteResultTypes.Error:
                    return BadRequest(result);
                case DeleteResultTypes.Ok:
                    return Ok(result);
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }
    }
}