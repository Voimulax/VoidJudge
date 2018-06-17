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
    [Route("api/contest/{contestId}/problems")]
    [Produces("application/json")]
    [ApiController]
    [Authorize]
    public class ProblemController : Controller
    {
        private readonly IAuthService _authService;
        private readonly IProblemService _problemService;

        public ProblemController(IAuthService authService, IProblemService problemService)
        {
            _authService = authService;
            _problemService = problemService;
        }

        [HttpPost]
        [Authorize(Roles = "1")]
        public async Task<IActionResult> AddProblemAsync(long contestId, [FromForm] AddProblemViewModel addProblem)
        {
            var userId = _authService.GetUserIdFromRequest(Request.HttpContext.User.Claims);

            var result = await _problemService.AddProblemAsync(contestId, userId, addProblem);
            switch (result.Error)
            {
                case AddProblemResultType.Unauthorized:
                    return new ObjectResult(result)
                    {
                        StatusCode = StatusCodes.Status401Unauthorized
                    };
                case AddProblemResultType.Forbiddance:
                    return new ObjectResult(result)
                    {
                        StatusCode = StatusCodes.Status403Forbidden
                    };
                case AddProblemResultType.ContestNotFound:
                    return NotFound(result);
                case AddProblemResultType.FileTooBig:
                    return BadRequest(result);
                case AddProblemResultType.Wrong:
                    return new ObjectResult(result) {StatusCode = StatusCodes.Status422UnprocessableEntity};
                case AddProblemResultType.Error:
                    return BadRequest(result);
                case AddProblemResultType.Ok:
                    return Ok(result);
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        [HttpGet]
        [Authorize(Roles = "1,2")]
        public async Task<IActionResult> GetProblemsAsync(long contestId)
        {
            var userId = _authService.GetUserIdFromRequest(Request.HttpContext.User.Claims);

            var result = await _problemService.GetProblemsAsync(contestId, userId);
            switch (result.Error)
            {
                case GetProblemResultType.Unauthorized:
                    return new ObjectResult(result)
                    {
                        StatusCode = StatusCodes.Status401Unauthorized
                    };
                case GetProblemResultType.ContestNotFound:
                    return NotFound(result);
                case GetProblemResultType.Error:
                    return BadRequest(result);
                case GetProblemResultType.Ok:
                    return Ok(result);
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "1")]
        public async Task<IActionResult> DeleteProblemsAsync(long contestId, long id)
        {
            var userId = _authService.GetUserIdFromRequest(Request.HttpContext.User.Claims);

            var result = await _problemService.DeleteProblemAsync(contestId, userId, id);
            switch (result.Error)
            {
                case DeleteProblemResultType.Unauthorized:
                    return new ObjectResult(result)
                    {
                        StatusCode = StatusCodes.Status401Unauthorized
                    };
                case DeleteProblemResultType.ContestNotFound:
                    return NotFound(result);
                case DeleteProblemResultType.ProblemNotFound:
                    return NotFound(result);
                case DeleteProblemResultType.Forbiddance:
                    return new ObjectResult(result)
                    {
                        StatusCode = StatusCodes.Status403Forbidden
                    };
                case DeleteProblemResultType.Error:
                    return BadRequest(result);
                case DeleteProblemResultType.Ok:
                    return Ok(result);
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }
    }
}