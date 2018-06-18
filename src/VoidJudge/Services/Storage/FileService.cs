using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
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
                OriginName = formFile.FileName,
                UserId = userId,
                Type = FileType.Upload
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

            var folderPath = file.Type == FileType.Upload ? GetUploadsFolderPath() : GetBuildsFolderPath();
            var filePath = Path.Combine(folderPath, fileName);

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

        public async Task<AddFileResult> ZipFoldersAsync(IList<ZipFolderViewModel> zipFolders, long userId)
        {
            var tempName = Guid.NewGuid().ToString();
            var tempPath = Path.Combine(GetBuildsFolderPath(), tempName);
            if (!Directory.Exists(tempPath))
            {
                Directory.CreateDirectory(tempPath);
            }
            else
            {
                Directory.Delete(tempPath, true);
                Directory.CreateDirectory(tempPath);
            }

            foreach (var zipFolder in zipFolders)
            {
                var folderPath = Path.Combine(tempPath, zipFolder.ZipFolderName);
                Directory.CreateDirectory(folderPath);
                foreach (var zipFile in zipFolder.ZipFiles)
                {
                    var originPath = Path.Combine(GetUploadsFolderPath(), zipFile.OriginName);
                    var movePath = Path.Combine(folderPath, zipFile.ZipName);
                    File.Copy(originPath, movePath);
                }
                ZipFile.CreateFromDirectory(folderPath, Path.Combine(tempPath, zipFolder.ZipFolderName + ".zip"));
                Directory.Delete(folderPath, true);
            }
            ZipFile.CreateFromDirectory(tempPath, Path.Combine(GetBuildsFolderPath(), tempName + ".zip"));
            Directory.Delete(tempPath, true);

            var file = new FileModel
            {
                CreateTime = DateTime.Now,
                SaveName = tempName + ".zip",
                OriginName = tempName + ".zip",
                UserId = userId,
                Type = FileType.Build
            };

            await _context.Files.AddAsync(file);
            await _context.SaveChangesAsync();
            return new AddFileResult {Error = AddFileResultType.Ok, Data = file.SaveName};
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

        private string GetBuildsFolderPath()
        {
            var buildsFolderPath = Path.Combine(_hosting.WebRootPath, "Builds");
            if (!Directory.Exists(buildsFolderPath))
            {
                Directory.CreateDirectory(buildsFolderPath);
            }

            return buildsFolderPath;
        }
    }
}