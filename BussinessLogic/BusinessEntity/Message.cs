using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NoticeManagement.BusinessLayer.BusinessEntity
{
    public class Message
    {
        public string message { get; set; }
        public bool status { get; set; }
        public string output { get; set; }
        public bool checkForDraftId { get; set; }
        public string DraftId { get; set; }
        public string parentDraftId { get; set; }
    }
}
