using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VoidJudge.Services.System;
using VoidJudge.ViewModels.System;

namespace VoidJudge.Controllers.System
{
    [Route("api/system/settings")]
    [Produces("application/json")]
    [ApiController]
    [Authorize]
    public class SettingsController : Controller
    {
        private readonly ISettingsService _settingsService;

        public SettingsController(ISettingsService settingsService)
        {
            _settingsService = settingsService;
        }

        [HttpGet]
        public async Task<IActionResult> GetSettingsAsync()
        {
            var result = await _settingsService.GetSettingsAsync();
            switch (result.Error)
            {
                case GetSettingsResultType.Error:
                    return BadRequest(result);
                case GetSettingsResultType.Ok:
                    return Ok(result);
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        [HttpPut]
        [Authorize(Roles = "0")]
        public async Task<IActionResult> PutSettingsAsync([FromBody] IList<SettingsViewModel> putSettings)
        {
            var result = await _settingsService.PutSettingsAsync(putSettings);
            switch (result.Error)
            {
                case PutSettingsResultType.Error:
                    return BadRequest(result);
                case PutSettingsResultType.Wrong:
                    return new ObjectResult(result) { StatusCode = StatusCodes.Status422UnprocessableEntity };
                case PutSettingsResultType.Ok:
                    return Ok(result);
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }
    }
}