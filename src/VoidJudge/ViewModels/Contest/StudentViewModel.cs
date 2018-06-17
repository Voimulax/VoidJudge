namespace VoidJudge.ViewModels.Contest
{
    public class AddStudentViewModel
    {
        public long StudentId { get; set; }
    }

    public class GetStudentViewModel
    {
        public long StudentId { get; set; }
        public string UserName { get; set; }
        public string Group { get; set; }
    }
}