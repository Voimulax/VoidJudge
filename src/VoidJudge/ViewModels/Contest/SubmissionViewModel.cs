using System.Collections.Generic;
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

    public class SubmissionStateViewModel
    {
        public string ProblemName { get; set; }
        public bool IsSubmitted { get; set; }
    }

    public class GetSubmissionInfoViewModel
    {
        public long Id { get; set; }
        public long StudentId { get; set; }
        public string UserName { get; set; }
        public string Group { get; set; }
        public bool IsLogged { get; set; }
        public IList<SubmissionStateViewModel> SubmissionStates { get; set; }
    }
}