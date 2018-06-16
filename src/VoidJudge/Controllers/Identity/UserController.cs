using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VoidJudge.Services.Auth;
using VoidJudge.Services.Identity;
using VoidJudge.ViewModels;
using VoidJudge.ViewModels.Identity;

namespace VoidJudge.Controllers.Identity
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
                case AddUserResultType.Repeat:
                    return Conflict(result);
                case AddUserResultType.Wrong:
                    return new ObjectResult(result)
                    {
                        StatusCode = StatusCodes.Status422UnprocessableEntity
                    };
                case AddUserResultType.Error:
                    return BadRequest(result);
                case AddUserResultType.Ok:
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
                case GetUserResultType.Unauthorized:
                    return new ObjectResult(result) { StatusCode = StatusCodes.Status401Unauthorized };
                case GetUserResultType.UserNotFound:
                    return NotFound(result);
                case GetUserResultType.Ok:
                    return Ok(result);
                case GetUserResultType.Error:
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
                case GetUserResultType.Unauthorized:
                    return new ObjectResult(result) { StatusCode = StatusCodes.Status401Unauthorized };
                case GetUserResultType.UserNotFound:
                    return NotFound(result);
                case GetUserResultType.Ok:
                    return Ok(result);
                case GetUserResultType.Error:
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
                return BadRequest(new ApiDataResult { Error = PutUserResultType.Wrong, Data = new { ModelState } });
            }

            if (id != putUser.Id)
            {
                return BadRequest(new ApiResult { Error = PutUserResultType.Wrong });
            }

            var result = await _userService.PutUserAsync(putUser);
            switch (result.Error)
            {
                case PutUserResultType.Forbiddance:
                    return new ObjectResult(result)
                    {
                        StatusCode = StatusCodes.Status403Forbidden
                    };
                case PutUserResultType.ConcurrencyException:
                    return BadRequest(result);
                case PutUserResultType.UserNotFound:
                    return NotFound(result);
                case PutUserResultType.Repeat:
                    return BadRequest(result);
                case PutUserResultType.Wrong:
                    return new ObjectResult(result) { StatusCode = StatusCodes.Status422UnprocessableEntity };
                case PutUserResultType.Error:
                    return BadRequest(result);
                case PutUserResultType.Ok:
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
                case DeleteUserResultType.Forbiddance:
                    return new ObjectResult(result)
                    {
                        StatusCode = StatusCodes.Status403Forbidden
                    };
                case DeleteUserResultType.UserNotFound:
                    return NotFound(result);
                case DeleteUserResultType.Error:
                    return BadRequest(result);
                case DeleteUserResultType.Ok:
                    return Ok(result);
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }
    }
}