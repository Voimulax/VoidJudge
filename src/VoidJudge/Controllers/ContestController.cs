﻿using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VoidJudge.Services;
using VoidJudge.ViewModels.Contest;

namespace VoidJudge.Controllers
{
    [Route("api/contests")]
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
                case ContestResultType.NotFound:
                    return NotFound(result);
                case ContestResultType.Error:
                    return BadRequest(result);
                case ContestResultType.Ok:
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
                case ContestResultType.NotFound:
                    return NotFound(result);
                case ContestResultType.Error:
                    return BadRequest(result);
                case ContestResultType.Ok:
                    return Ok(result);
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        //// POST: api/Contest
        //[HttpPost]
        //public void Post([FromBody] string value)
        //{
        //}

        //// PUT: api/Contest/5
        //[HttpPut("{id}")]
        //public void Put(int id, [FromBody] string value)
        //{
        //}

        //// DELETE: api/ApiWithActions/5
        //[HttpDelete("{id}")]
        //public void Delete(int id)
        //{
        //}
    }
}