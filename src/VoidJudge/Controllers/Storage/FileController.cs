using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VoidJudge.Services.Auth;
using VoidJudge.Services.Storage;
using VoidJudge.ViewModels.Storage;

namespace VoidJudge.Controllers.Storage
{
    [Route("api/files")]
    [ApiController]
    [Authorize(Roles = "1,2")]
    public class FileController : Controller
    {
        private readonly IFileService _fileService;
        private readonly IAuthService _authService;

        public FileController(IFileService fileService, IAuthService authService)
        {
            _fileService = fileService;
            _authService = authService;
        }

        [HttpGet("{fileName}")]
        public async Task<IActionResult> GetFileAsync(string fileName)
        {
            var userId = _authService.GetUserIdFromRequest(Request.HttpContext.User.Claims);

            var result = await _fileService.GetFileAsync(fileName, userId);
            switch (result.Error)
            {
                case GetFileResultType.Error:
                    return BadRequest();
                case GetFileResultType.Ok:
                    return File(result.Data.Stream, result.Data.Memi, result.Data.FileName);
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }
    }
}