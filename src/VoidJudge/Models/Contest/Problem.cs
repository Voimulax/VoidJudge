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

    public class Problem
    {
        public long Id { get; set; }

        [Required]
        public long ContestId { get; set; }
        public Contest Contest { get; set; }

        [Required]
        [Column(TypeName ="nvarchar(256)")]
        public string Name { get; set; }

        [Required]
        [Column(TypeName ="int")]
        public ProblemType Type { get; set; }

        [Column(TypeName ="nvarchar(max)")]
        public string Content { get; set; }
        public ICollection<Submission> Submissions { get; set; } = new Collection<Submission>();

    }
}