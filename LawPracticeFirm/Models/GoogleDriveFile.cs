using System;
using System.Collections.Generic;
namespace LawPracticeFirm.Models
{
    /// <summary>
    /// Google drive file
    /// </summary>
    public class GoogleDriveFile
    {
        public string Id { get;  set; }
        public long? Size { get;  set; }
        public string Name { get;  set; }
        public long? Version { get;  set; }
        public DateTime? CreatedTime { get;  set; }
        public IList<string> Parents { get;  set; }
        public string MimeType { get;  set; }
        public string WebContentLink { get; set; }
    }
}