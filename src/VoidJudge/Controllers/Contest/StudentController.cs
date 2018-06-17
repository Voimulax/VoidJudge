using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VoidJudge.Services.Auth;
using VoidJudge.Services.Contest;
using VoidJudge.ViewModels;
using VoidJudge.ViewModels.Contest;

namespace VoidJudge.Controllers.Contest
{
    [Route("api/contest/{contestId}/students")]
    [Produces("application/json")]
    [ApiController]
    [Authorize(Roles = "1")]
    public class StudentController : Controller
    {
        private readonly IStudentService _studentService;
        private readonly IAuthService _authService;

        public StudentController(IAuthService authService, IStudentService studentService)
        {
            _authService = authService;
            _studentService = studentService;
        }

        [HttpPost]
        public async Task<IActionResult> AddStudentsAsync(int contestId, [FromBody] IList<AddStudentViewModel> addStudents)
        {
            if (!ModelState.IsValid)
            {
                return new ObjectResult(new ApiDataResult { Error = AddStudentResultType.Wrong, Data = new { ModelState } }) { StatusCode = StatusCodes.Status422UnprocessableEntity };
            }

            var userId = _authService.GetUserIdFromRequest(Request.HttpContext.User.Claims);

            var result = await _studentService.AddStudentsAsync(contestId, addStudents, userId);
            switch (result.Error)
            {
                case AddStudentResultType.Unauthorized:
                    return new ObjectResult(result)
                    {
                        StatusCode = StatusCodes.Status401Unauthorized
                    };
                case AddStudentResultType.Forbiddance:
                    return new ObjectResult(result)
                    {
                        StatusCode = StatusCodes.Status403Forbidden
                    };
                case AddStudentResultType.ContestNotFound:
                    return NotFound(result);
                case AddStudentResultType.StudentsNotFound:
                    return NotFound(result);
                case AddStudentResultType.Wrong:
                    return new ObjectResult(result) { StatusCode = StatusCodes.Status422UnprocessableEntity };
                case AddStudentResultType.Error:
                    return BadRequest(result);
                case AddStudentResultType.Ok:
                    return Ok(result);
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetStudentsAsync(int contestId)
        {
            var userId = _authService.GetUserIdFromRequest(Request.HttpContext.User.Claims);
            var result = await _studentService.GetStudentsAsync(contestId, userId);

            switch (result.Error)
            {
                case GetStudentResultType.Unauthorized:
                    return new ObjectResult(result)
                    {
                        StatusCode = StatusCodes.Status401Unauthorized
                    };
                case GetStudentResultType.ContestNotFound:
                    return NotFound(result);
                case GetStudentResultType.Error:
                    return BadRequest(result);
                case GetStudentResultType.Ok:
                    return Ok(result);
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }
    }
}