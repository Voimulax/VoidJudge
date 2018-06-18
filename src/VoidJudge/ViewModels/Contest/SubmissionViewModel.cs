using Microsoft.AspNetCore.Http;
using VoidJudge.Models.Contest;

namespace VoidJudge.ViewModels.Contest
{
    public class AddSubmissionViewModel
    {
        public long ProblemId { get; set; }
        public long StudentId { get; set; }
        public SubmissionType Type { get; set; }
        public IFormFile File { get; set; }
    }
}