using System.Collections.Generic;
using System.IO;

namespace VoidJudge.ViewModels.Storage
{
    public class GetFileViewModel
    {
        public FileStream Stream { get; set; }
        public string Memi { get; set; }
        public string FileName { get; set; }
    }

    public class ZipFileViewModel
    {
        public string OriginName { get; set; }
        public string ZipName { get; set; }
    }

    public class ZipFolderViewModel
    {
        public string ZipFolderName { get; set; }
        public IList<ZipFileViewModel> ZipFiles { get; set; }
    }
}