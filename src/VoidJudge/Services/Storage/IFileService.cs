using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using VoidJudge.ViewModels;
using VoidJudge.ViewModels.Storage;

namespace VoidJudge.Services.Storage
{
    public interface IFileService
    {
        Task<AddFileResult> AddFileAsync(IFormFile formFile, long userId);
        Task<DeleteFileResultType> DeleteFileAsync(string fileName);
        Task<GetFileResult> GetFileAsync(string fileName, long userId);
    }
}