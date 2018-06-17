using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using VoidJudge.Data;
using VoidJudge.Models.Contest;
using VoidJudge.Models.storage;
using VoidJudge.ViewModels;
using VoidJudge.ViewModels.Contest;

namespace VoidJudge.Services.Contest
{
    public class ProblemService : IProblemService
    {
        private readonly IHostingEnvironment _hosting;
        private readonly VoidJudgeContext _context;
        private readonly IMapper _mapper;

        public ProblemService(IHostingEnvironment hosting, VoidJudgeContext context, IMapper mapper)
        {
            _hosting = hosting;
            _context = context;
            _mapper = mapper;
        }


        public async Task<ApiResult> AddProblemAsync(long contestId, long userId, AddProblemViewModel addProblem)
        {
            var contest = await _context.Contests.Include(c => c.Owner).SingleOrDefaultAsync(c => c.Id == contestId);
            if (contest == null) return new ApiResult { Error = AddProblemResultType.ContestNotFound };
            if (contest.Owner.UserId != userId) return new ApiResult { Error = AddProblemResultType.Unauthorized };
            if (contest.ProgressState != ContestProgressState.NoStarted &&
                contest.ProgressState != ContestProgressState.UnPublished)
            {
                return new ApiResult { Error = AddProblemResultType.Forbiddance };
            }

            var problem = _mapper.Map<AddProblemViewModel, ProblemModel>(addProblem);
            problem.ContestId = contestId;

            var uploadsFolderPath = Path.Combine(_hosting.WebRootPath, "Uploads");
            if (!Directory.Exists(uploadsFolderPath))
            {
                Directory.CreateDirectory(uploadsFolderPath);
            }
            var fileName = Guid.NewGuid() + Path.GetExtension(addProblem.File.FileName);
            var filePath = Path.Combine(uploadsFolderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await addProblem.File.CopyToAsync(stream);
            }

            var file = new FileModel
            {
                CreateTime = DateTime.Now,
                SaveName = fileName,
                UploadName = addProblem.File.FileName,
                UserId = userId
            };

            problem.Content = fileName;
            await _context.Problems.AddAsync(problem);
            await _context.Files.AddAsync(file);
            await _context.SaveChangesAsync();

            return new ApiResult { Error = AddProblemResultType.Ok };
        }

        public async Task<ApiResult> GetProblemsAsync(long contestId, long userId)
        {
            var contest = await _context.Contests.Include(c => c.Owner).Include(c => c.Enrollments).ThenInclude(e => e.Student).Include(c => c.Problems).SingleOrDefaultAsync(c => c.Id == contestId);
            if (contest == null) return new ApiResult { Error = GetProblemResultType.ContestNotFound };
            var enrollment = contest.Enrollments.SingleOrDefault(e => e.Student.UserId == userId);
            if (contest.Owner.UserId != userId && enrollment == null || enrollment != null && contest.ProgressState != ContestProgressState.InProgress)
            {
                return new ApiResult { Error = GetProblemResultType.Unauthorized };
            }

            var problems = contest.Problems.Select(p => _mapper.Map<ProblemModel, GetProblemViewModel>(p)).ToList();
            return new GetProblemResult { Error = GetProblemResultType.Ok, Data = problems };
        }

        public async Task<ApiResult> DeleteProblemAsync(long contestId, long userId, long problemId)
        {
            var contest = await _context.Contests.Include(c => c.Owner).Include(c => c.Problems).SingleOrDefaultAsync(c => c.Id == contestId);
            if (contest == null) return new ApiResult { Error = DeleteProblemResultType.ContestNotFound };
            if (contest.Owner.UserId != userId) return new ApiResult { Error = DeleteProblemResultType.Unauthorized };
            if (contest.ProgressState != ContestProgressState.NoStarted &&
                contest.ProgressState != ContestProgressState.UnPublished)
            {
                return new ApiResult { Error = DeleteProblemResultType.Forbiddance };
            }

            var problem = contest.Problems.SingleOrDefault(p => p.Id == problemId);
            if (problem == null) return new ApiResult { Error = DeleteProblemResultType.ProblemNotFound };

            if (problem.Type == ProblemType.TestPaper)
            {
                var file = await _context.Files.SingleOrDefaultAsync(f => f.SaveName == problem.Content);
                var uploadsFolderPath = Path.Combine(_hosting.WebRootPath, "Uploads");
                if (Directory.Exists(uploadsFolderPath))
                {
                    var filePath = Path.Combine(uploadsFolderPath, problem.Content);
                    File.Delete(filePath);
                }

                _context.Files.Remove(file);
            }
            _context.Problems.Remove(problem);
            await _context.SaveChangesAsync();

            return new ApiResult { Error = DeleteProblemResultType.Ok };
        }
    }
}