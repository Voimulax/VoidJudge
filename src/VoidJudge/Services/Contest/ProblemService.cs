using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using VoidJudge.Data;
using VoidJudge.Models.Contest;
using VoidJudge.Services.Storage;
using VoidJudge.ViewModels;
using VoidJudge.ViewModels.Contest;
using VoidJudge.ViewModels.Storage;

namespace VoidJudge.Services.Contest
{
    public class ProblemService : IProblemService
    {
        private readonly IFileService _fileService;
        private readonly VoidJudgeContext _context;
        private readonly IMapper _mapper;

        public ProblemService(VoidJudgeContext context, IMapper mapper, IFileService fileService)
        {
            _context = context;
            _mapper = mapper;
            _fileService = fileService;
        }


        public async Task<ApiResult> AddProblemAsync(long contestId, long userId, AddProblemViewModel addProblem)
        {
            var contest = await _context.Contests.Include(c => c.Owner).SingleOrDefaultAsync(c => c.Id == contestId && c.Id == addProblem.ContestId);
            if (contest == null) return new ApiResult { Error = AddProblemResultType.ContestNotFound };
            if (contest.Owner.UserId != userId) return new ApiResult { Error = AddProblemResultType.Unauthorized };
            if (contest.ProgressState != ContestProgressState.NoStarted &&
                contest.ProgressState != ContestProgressState.UnPublished)
            {
                return new ApiResult { Error = AddProblemResultType.Forbiddance };
            }

            var problem = _mapper.Map<AddProblemViewModel, ProblemModel>(addProblem);

            var fileResult = await _fileService.AddFileAsync(addProblem.File, userId);
            switch (fileResult.Error)
            {
                case AddFileResultType.Error:
                    return new ApiResult { Error = AddProblemResultType.Error };
                case AddFileResultType.FileTooBig:
                    return new ApiResult { Error = AddProblemResultType.FileTooBig };
                case AddFileResultType.Ok:
                    problem.Content = fileResult.Data;
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }

            await _context.Problems.AddAsync(problem);
            await _context.SaveChangesAsync();

            return new ApiResult { Error = AddProblemResultType.Ok };
        }

        public async Task<ApiResult> GetProblemsAsync(long contestId, long userId)
        {
            var contest = await _context.Contests.Include(c => c.Owner).Include(c => c.Enrollments).ThenInclude(e => e.Student).Include(c => c.Problems).ThenInclude(p => p.Submissions).SingleOrDefaultAsync(c => c.Id == contestId);
            if (contest == null) return new ApiResult { Error = GetProblemResultType.ContestNotFound };
            var enrollment = contest.Enrollments.SingleOrDefault(e => e.Student.UserId == userId);
            if (contest.Owner.UserId != userId && enrollment == null || enrollment != null && contest.ProgressState != ContestProgressState.InProgress)
            {
                return new ApiResult { Error = GetProblemResultType.Unauthorized };
            }

            if (enrollment != null)
            {
                var problems = contest.Problems.OrderBy(p => p.Id).Select(p => _mapper.Map<ProblemModel, GetStudentProblemViewModel>(p)).ToList();
                var submissions = contest.Problems.OrderBy(p => p.Id).Select(p =>
                {
                    var submission = p.Submissions.SingleOrDefault(s => s.StudentId == enrollment.StudentId);
                    return submission != null;
                }).ToList();
                for (var i = 0; i < problems.Count; i++)
                {
                    problems[i].IsSubmitted = submissions[i];
                }
                return new GetProblemResult<GetStudentProblemViewModel> { Error = GetProblemResultType.Ok, Data = problems };
            }
            else
            {
                var problems = contest.Problems.OrderBy(p => p.Id).Select(p => _mapper.Map<ProblemModel, GetProblemViewModel>(p)).ToList();
                return new GetProblemResult<GetProblemViewModel> { Error = GetProblemResultType.Ok, Data = problems };
            }
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
                var fileResult = await _fileService.DeleteFileAsync(problem.Content);
                switch (fileResult)
                {
                    case DeleteFileResultType.Error:
                        return new ApiResult { Error = AddProblemResultType.Error };
                    case DeleteFileResultType.Ok:
                        break;
                    default:
                        throw new ArgumentOutOfRangeException();
                }
            }
            _context.Problems.Remove(problem);
            await _context.SaveChangesAsync();

            return new ApiResult { Error = DeleteProblemResultType.Ok };
        }
    }
}