using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using VoidJudge.Data;
using VoidJudge.Models.Storage;
using VoidJudge.ViewModels.Storage;

namespace VoidJudge.Services.Storage
{
    public class FileService : IFileService
    {
        private readonly IHostingEnvironment _hosting;
        private readonly VoidJudgeContext _context;

        public FileService(IHostingEnvironment hosting, VoidJudgeContext context)
        {
            _hosting = hosting;
            _context = context;
        }

        public async Task<AddFileResult> AddFileAsync(IFormFile formFile, long userId)
        {
            var fileName = Guid.NewGuid() + Path.GetExtension(formFile.FileName);
            var filePath = Path.Combine(GetUploadsFolderPath(), fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await formFile.CopyToAsync(stream);
            }

            var file = new FileModel
            {
                CreateTime = DateTime.Now,
                SaveName = fileName,
                UploadName = formFile.FileName,
                UserId = userId
            };

            await _context.Files.AddAsync(file);
            return new AddFileResult { Error = AddFileResultType.Ok, Data = fileName };
        }

        public async Task<DeleteFileResultType> DeleteFileAsync(string fileName)
        {
            var file = await _context.Files.SingleOrDefaultAsync(f => f.SaveName == fileName);

            var filePath = Path.Combine(GetUploadsFolderPath(), fileName);
            File.Delete(filePath);

            _context.Files.Remove(file);
            return DeleteFileResultType.Ok;
        }

        public async Task<GetFileResult> GetFileAsync(string fileName, long userId)
        {
            var file = await _context.Files.SingleOrDefaultAsync(f => f.SaveName == fileName);
            if (file == null) return new GetFileResult { Error = GetFileResultType.Error };
            if (file.UserId != userId)
            {
                var enrollment = await _context.Enrollments.Include(e => e.Student).Include(e => e.Contest)
                    .ThenInclude(c => c.Problems)
                    .SingleOrDefaultAsync(e =>
                        e.Student.UserId == userId &&
                        e.Contest.Problems.SingleOrDefault(p => p.Content == fileName) != null);
                if (enrollment == null)
                {
                    return new GetFileResult { Error = GetFileResultType.Error };
                }
            }

            var filePath = Path.Combine(GetUploadsFolderPath(), fileName);

            if (!File.Exists(filePath))
            {
                return new GetFileResult { Error = GetFileResultType.Error };
            }

            var stream = File.OpenRead(filePath);
            var fileExt = Path.GetExtension(fileName);
            //获取文件的ContentType
            var provider = new FileExtensionContentTypeProvider();
            var memi = provider.Mappings.Keys.Contains(fileExt) ? provider.Mappings[fileExt] : "application/octet-stream";
            return new GetFileResult { Error = GetFileResultType.Ok, Data = new GetFileViewModel { Stream = stream, Memi = memi, FileName = Path.GetFileName(filePath) } };
        }

        private string GetUploadsFolderPath()
        {
            var uploadsFolderPath = Path.Combine(_hosting.WebRootPath, "Uploads");
            if (!Directory.Exists(uploadsFolderPath))
            {
                Directory.CreateDirectory(uploadsFolderPath);
            }

            return uploadsFolderPath;
        }
    }
}