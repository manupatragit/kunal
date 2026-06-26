using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LawPracticeFirm.Models
{
    public class GetTaskCountModal
    {
        public int InboxCount { get; set; }
        public int OutBoxCount { get; set; }
        public int MyTaskCount { get; set; }
        public int OverDueTaskCount { get; set; }
        public int ArchiveCount { get; set; }
    }
}