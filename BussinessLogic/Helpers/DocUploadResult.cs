using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LawPracticeFirm.Models
{
    public class DocUploadResult
    {
        public string FileName { get; set; }
        public string FileSize { get; set; }
        public string EmailFilePath { get; set; }
        public string InfectedFile { get; set; }
    }
}