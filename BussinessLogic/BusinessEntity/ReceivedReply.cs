using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NoticeManagement.BusinessLayer.BusinessEntity
{
    public class ReceivedReply
    {
        public string PostedFiledocmodule { get; set; }
        public string setdateofreply { get; set; }
        public string Id { get; set; }
        public Nullable<System.DateTime> ReceivedDate { get; set; }
        public string ReceivedThrogh { get; set; }
        public Nullable<System.DateTime> CreateDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<bool> IsFileAvailable { get; set; }
        public string NoticeId { get; set; }
        public string FirmId { get; set; }
        public string postedfile { get; set; }
        public Nullable<System.DateTime> DateOfReply { get; set; }

        public string ModeofService { get; set; }
    }
}
