using System;

namespace LawPracticeFirm.Models
{
    /// <summary>
    /// Dropbox file list
    /// </summary>
    [Serializable]
    public class DropBoxFileList
    {
        public string Name { get; set; }
        public string PathLower { get; set; }
        public string PathDisplay { get; set; }
        public string Id { get; set; }
        public string ClientModified { get; set; }
        public string ContentHash { get; set; }
        public string ServerModified { get; set; }
        public string Size { get; set; }
        public string Rev { get; set; }
        public bool IsFolder { get; set; }
        public bool IsFile { get; set; }
        public string IsDownloadable { get; set; }
        public string IsDelete { get; set; }
       
       
    }
}