using System;
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
    [Route("api/contests")]
    [Produces("application/json")]
    [ApiController]
    [Authorize]
    public class ContestController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IContestService _contestService;

        public ContestController(IContestService contestService, IAuthService authService)
        {
            _contestService = contestService;
            _authService = authService;
        }

        [HttpGet]
        public async Task<IActionResult> GetContestsAsync()
        {
            var roleType = _authService.GetRoleTypeFromRequest(Request.HttpContext.User.Claims);
            var userId = _authService.GetUserIdFromRequest(Request.HttpContext.User.Claims);
            var result = await _contestService.GetContestsAsync(roleType, userId);

            switch (result.Error)
            {
                case GetContestResultType.ContestNotFound:
                    return NotFound(result);
                case GetContestResultType.Error:
                    return BadRequest(result);
                case GetContestResultType.Ok:
                    return Ok(result);
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetContestAsync(int id)
        {
            var roleType = _authService.GetRoleTypeFromRequest(Request.HttpContext.User.Claims);
            var userId = _authService.GetUserIdFromRequest(Request.HttpContext.User.Claims);
            var result = await _contestService.GetContestAsync(id, roleType, userId);

            switch (result.Error)
            {
                case GetContestResultType.ContestNotFound:
                    return NotFound(result);
                case GetContestResultType.Error:
                    return BadRequest(result);
                case GetContestResultType.Ok:
                    return Ok(result);
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        [Authorize(Roles = "1")]
        [HttpPost]
        public async Task<IActionResult> PostContestAsync([FromBody] TeacherContestViewModel addContest)
        {
            var userId = _authService.GetUserIdFromRequest(Request.HttpContext.User.Claims);
            var result = await _contestService.AddContestAsync(addContest, userId);

            switch (result.Error)
            {
                case AddContestResultType.Wrong:
                    return BadRequest(result);
                case AddContestResultType.Error:
                    return BadRequest(result);
                case AddContestResultType.Ok:
                    return Ok(result);
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        [Authorize(Roles = "1")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutContestAsync(int id, [FromBody] TeacherContestViewModel putContest)
        {
            if (!ModelState.IsValid)
            {
                return new ObjectResult(new ApiDataResult { Error = PutContestResultType.Wrong, Data = new { ModelState } }) { StatusCode = StatusCodes.Status422UnprocessableEntity };
            }

            if (id != putContest.Id)
            {
                return BadRequest(new ApiResult {Error = PutContestResultType.Wrong});
            }

            var userId = _authService.GetUserIdFromRequest(Request.HttpContext.User.Claims);

            var result = await _contestService.PutContestAsync(putContest, userId);
            switch (result.Error)
            {
                case PutContestResultType.Unauthorized:
                    return new ObjectResult(result)
                    {
                        StatusCode = StatusCodes.Status401Unauthorized
                    };
                case PutContestResultType.ConcurrencyException:
                    return BadRequest(result);
                case PutContestResultType.ContestNotFound:
                    return NotFound(result);
                case PutContestResultType.Wrong:
                    return new ObjectResult(result) {StatusCode = StatusCodes.Status422UnprocessableEntity};
                case PutContestResultType.Error:
                    return BadRequest(result);
                case PutContestResultType.Ok:
                    return Ok(result);
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContestAsync(int id)
        {
            var userId = _authService.GetUserIdFromRequest(Request.HttpContext.User.Claims);

            var result = await _contestService.DeleteContestAsync(id, userId);
            switch (result.Error)
            {
                case DeleteContestResultType.Unauthorized:
                    return new ObjectResult(result)
                    {
                        StatusCode = StatusCodes.Status401Unauthorized
                    };
                case DeleteContestResultType.Forbiddance:
                    return new ObjectResult(result)
                    {
                        StatusCode = StatusCodes.Status403Forbidden
                    };
                case DeleteContestResultType.ContestNotFound:
                    return NotFound(result);
                case DeleteContestResultType.Error:
                    return BadRequest(result);
                case DeleteContestResultType.Ok:
                    return Ok(result);
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }
    }
}
