using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VoidJudge.Services;
using VoidJudge.ViewModels;
using VoidJudge.ViewModels.Identity;

namespace VoidJudge.Controllers
{
    [Route("api/users")]
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
        public async Task<IActionResult> PostUsersAsync([FromBody] IList<AddUserViewModel> addUsers)
        {
            var result = await _userService.AddUsersAsync(addUsers);
            switch (result.Error)
            {
                case AddResultType.Repeat:
                    return Conflict(result);
                case AddResultType.Wrong:
                    return new ObjectResult(result)
                    {
                        StatusCode = StatusCodes.Status422UnprocessableEntity
                    };
                case AddResultType.Error:
                    return BadRequest(result);
                case AddResultType.Ok:
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
                case GetResultType.Unauthorized:
                    return new ObjectResult(result) { StatusCode = StatusCodes.Status401Unauthorized };
                case GetResultType.UserNotFound:
                    return NotFound(result);
                case GetResultType.Ok:
                    return Ok(result);
                case GetResultType.Error:
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
                case GetResultType.Unauthorized:
                    return new ObjectResult(result) { StatusCode = StatusCodes.Status401Unauthorized };
                case GetResultType.UserNotFound:
                    return NotFound(result);
                case GetResultType.Ok:
                    return Ok(result);
                case GetResultType.Error:
                    return BadRequest(result);
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        [Authorize(Roles = "0")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserAsync([FromRoute] long id, [FromBody] PutUserViewModel putUser)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiDataResult { Error = PutResultType.Wrong, Data = new { ModelState } });
            }

            if (id != putUser.Id)
            {
                return BadRequest(new ApiResult { Error = PutResultType.Wrong });
            }

            var result = await _userService.PutUserAsync(putUser);
            switch (result.Error)
            {
                case PutResultType.Forbiddance:
                    return new ObjectResult(result)
                    {
                        StatusCode = StatusCodes.Status403Forbidden
                    };
                case PutResultType.ConcurrencyException:
                    return BadRequest(result);
                case PutResultType.UserNotFound:
                    return NotFound(result);
                case PutResultType.Repeat:
                    return BadRequest(result);
                case PutResultType.Wrong:
                    return new ObjectResult(result) { StatusCode = StatusCodes.Status422UnprocessableEntity };
                case PutResultType.Error:
                    return BadRequest(result);
                case PutResultType.Ok:
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
                case DeleteResultType.Forbiddance:
                    return new ObjectResult(result)
                    {
                        StatusCode = StatusCodes.Status403Forbidden
                    };
                case DeleteResultType.UserNotFound:
                    return NotFound(result);
                case DeleteResultType.Error:
                    return BadRequest(result);
                case DeleteResultType.Ok:
                    return Ok(result);
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }
    }
}