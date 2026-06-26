using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Modals
{
    public class GetIPRShareTrademarkResponseModel
    {
        public Nullable<int> TotalRecord { get; set; }
        public Nullable<int> RowId { get; set; }
        public Nullable<int> tradeiid { get; set; }
        public Nullable<int> ifid { get; set; }
        public string Keyword { get; set; }
        public string vWordMark { get; set; }
        public string vProprietor { get; set; }
        public string vApplNo { get; set; }
        public string vClass { get; set; }
        public string dApplDate { get; set; }
        public string vJournalNo { get; set; }
        public string dJournalDate { get; set; }
        public string vStatus { get; set; }
        public string vUsedSince { get; set; }
        public string dValidUpto { get; set; }
        public string dGSDescription { get; set; }
        public string vImgPath { get; set; }
        public string Documents { get; set; }
        public string Agent { get; set; }
        public string AgentAddress { get; set; }
        public string UserId { get; set; }
        public string FirmId { get; set; }
        public Nullable<System.DateTime> date_Time { get; set; }
        public string vHearingDate { get; set; }
    }
}
