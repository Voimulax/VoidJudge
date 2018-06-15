using System;
using System.Collections.Generic;

namespace VoidJudge.ViewModels.Contest
{
    public class StudentViewModel
    {
        public long StudentId { get; set; }
        public string UserName { get; set; }
        public string Group { get; set; }
    }

    public abstract class ContestViewModel
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }

    public class AdminContestViewModel : ContestViewModel
    {
        public string OwnerName { get; set; }
        public int? State { get; set; }
    }
    public class TeacherContestViewModel : ContestViewModel
    {
        public string Notice { get; set; }
        public int? State { get; set; }
    }
    public class StudentContestViewModel : ContestViewModel
    {
        public string OwnerName { get; set; }
        public string Notice { get; set; }
    }
}