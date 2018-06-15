using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VoidJudge.Models.Contest
{
    public class Enrollment
    {
        public long Id { get; set; }
        public long? StudentId { get; set; }
        public Student Student { get; set; }
        public long ContestId { get; set; }
        public Contest Contest { get; set; }

        [Column(TypeName = "nvarchar(max)")]
        public string Token { get; set; }
    }
}