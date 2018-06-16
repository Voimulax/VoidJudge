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
        public async Task<IActionResult> GetAsync([FromRoute] long id)
        {
            var result = await _userService.GetStudentAsync(id);

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
        public async Task<IActionResult> GetsAsync()
        {
            var result = await _userService.GetStudentsAsync();

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
        public async Task<IActionResult> PutAsync([FromRoute] long id, [FromBody] PutStudentViewModel putStudent)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiDataResult { Error = PutResultType.Wrong, Data = new { ModelState } });
            }

            if (id != putStudent.Id)
            {
                return BadRequest(new ApiResult { Error = PutResultType.Wrong });
            }

            var result = await _userService.PutStudentAsync(putStudent);
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
        public async Task<IActionResult> DeleteAsync([FromRoute] long id)
        {
            var result = await _userService.DeleteStudentAsync(id);
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