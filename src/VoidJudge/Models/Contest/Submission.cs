using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VoidJudge.Models.Contest
{
    public enum SubmissionType
    {
        Binary, Text
    }

    public class Submission
    {
        public long Id { get; set; }

        [Required]
        public long ProblemId { get; set; }
        public Problem Problem { get; set; }

        [Required]
        public long? StudentId { get; set; }
        public Student Student { get; set; }

        [Required]
        [Column(TypeName ="int")]
        public SubmissionType Type { get; set; }

        [Column(TypeName ="nvarchar(max)")]
        public string Content { get; set; }

    }
}