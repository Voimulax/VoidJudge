using System.IO;

namespace VoidJudge.ViewModels.Storage
{
    public class GetFileViewModel
    {
        public FileStream Stream { get; set; }
        public string Memi { get; set; }
        public string FileName { get; set; }
    }
}