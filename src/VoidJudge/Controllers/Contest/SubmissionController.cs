using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VoidJudge.Services.Auth;
using VoidJudge.Services.Contest;
using VoidJudge.ViewModels.Contest;

namespace VoidJudge.Controllers.Contest
{
    [Route("api/contest/{contestId}")]
    [Produces("application/json")]
    [ApiController]
    [Authorize]
    public class SubmissionController : Controller
    {
        private readonly IAuthService _authService;
        private readonly ISubmissionService _submissionService;

        public SubmissionController(IAuthService authService, ISubmissionService submissionService)
        {
            _authService = authService;
            _submissionService = submissionService;
        }

        [HttpPost]
        [Authorize(Roles = "2")]
        [Route("problem/{problemId}/submissions")]
        public async Task<IActionResult> AddSubmissionAsync(long contestId, long problemId, [FromForm] AddSubmissionViewModel addSubmission)
        {
            var userId = _authService.GetUserIdFromRequest(Request.HttpContext.User.Claims);

            var result = await _submissionService.AddSubmissionAsync(contestId, problemId, userId, addSubmission);
            switch (result.Error)
            {
                case AddSubmissionResultType.Unauthorized:
                    return new ObjectResult(result)
                    {
                        StatusCode = StatusCodes.Status401Unauthorized
                    };
                case AddSubmissionResultType.Forbiddance:
                    return new ObjectResult(result)
                    {
                        StatusCode = StatusCodes.Status403Forbidden
                    };
                case AddSubmissionResultType.ContestNotFound:
                    return NotFound(result);
                case AddSubmissionResultType.ProblemNotFound:
                    return NotFound(result);
                case AddSubmissionResultType.FileTooBig:
                    return BadRequest(result);
                case AddSubmissionResultType.Wrong:
                    return new ObjectResult(result) { StatusCode = StatusCodes.Status422UnprocessableEntity };
                case AddSubmissionResultType.Error:
                    return BadRequest(result);
                case AddSubmissionResultType.Ok:
                    return Ok(result);
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }
    }
}