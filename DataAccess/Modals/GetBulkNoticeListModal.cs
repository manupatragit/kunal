using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Modals
{
    public class GetBulkNoticeListModal
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedDate { get; set; }
        public Nullable<int> TotalRows { get; set; }
        public Nullable<long> RowId { get; set; }
        public string NoticeTitle { get; set; }
        public Nullable<int> oedit { get; set; }
        public Nullable<int> odelete { get; set; }
        public Nullable<int> ocreate { get; set; }
        public Nullable<bool> BulkMailSendStatus { get; set; }
        public string SelfTemplateId { get; set; }
    }
}
