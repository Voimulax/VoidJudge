using Microsoft.AspNetCore.Http;
using VoidJudge.Models.Contest;

namespace VoidJudge.ViewModels.Contest
{
    public class AddProblemViewModel
    {
        public string Name { get; set; }
        public ProblemType Type { get; set; }
        public IFormFile File { get; set; }
    }

    public class GetProblemViewModel
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public ProblemType Type { get; set; }
        public string Content { get; set; }
    }
}