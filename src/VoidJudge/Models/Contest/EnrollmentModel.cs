using System.ComponentModel.DataAnnotations.Schema;

namespace VoidJudge.Models.Contest
{
    public class EnrollmentModel
    {
        public long Id { get; set; }
        public long? StudentId { get; set; }
        public StudentModel Student { get; set; }
        public long ContestId { get; set; }
        public ContestModel Contest { get; set; }

        [Column(TypeName = "nvarchar(max)")]
        public string Token { get; set; }
    }
}