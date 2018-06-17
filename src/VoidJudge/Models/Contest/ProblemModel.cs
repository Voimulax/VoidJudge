using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VoidJudge.Models.Contest
{
    public enum ProblemType
    {
        TestPaper, Judge
    }

    public class ProblemModel
    {
        public long Id { get; set; }

        public long ContestId { get; set; }
        public ContestModel Contest { get; set; }

        [Required]
        [Column(TypeName ="nvarchar(256)")]
        public string Name { get; set; }

        [Required]
        [Column(TypeName ="int")]
        public ProblemType Type { get; set; }

        [Column(TypeName ="nvarchar(max)")]
        public string Content { get; set; }
        public ICollection<SubmissionModel> Submissions { get; set; } = new Collection<SubmissionModel>();

    }
}