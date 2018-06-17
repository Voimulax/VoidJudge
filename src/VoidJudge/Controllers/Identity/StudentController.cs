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
    [Route("api/user/students")]
    [Produces("application/json")]
    [ApiController]
    public class StudentController : Controller
    {
        private readonly IUserService _userService;

        public StudentController(IUserService userService, IAuthService authService)
        {
            _userService = userService;
        }

        [Authorize(Roles = "0")]
        [HttpPost]
        public async Task<IActionResult> PostAsync([FromBody] IList<AddStudentViewModel> addStudents)
        {
            var result = await _userService.AddStudentsAsync(addStudents);
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
        public async Task<IActionResult> GetAsync([FromRoute] long id)
        {
            var result = await _userService.GetStudentAsync(id);

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
        public async Task<IActionResult> GetsAsync()
        {
            var result = await _userService.GetStudentsAsync();

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
        public async Task<IActionResult> PutAsync([FromRoute] long id, [FromBody] PutStudentViewModel putStudent)
        {
            if (!ModelState.IsValid)
            {
                return new ObjectResult(new ApiDataResult { Error = PutUserResultType.Wrong, Data = new { ModelState } }) { StatusCode = StatusCodes.Status422UnprocessableEntity };
            }

            if (id != putStudent.Id)
            {
                return BadRequest(new ApiResult { Error = PutUserResultType.Wrong });
            }

            var result = await _userService.PutStudentAsync(putStudent);
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
        public async Task<IActionResult> DeleteAsync([FromRoute] long id)
        {
            var result = await _userService.DeleteStudentAsync(id);
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