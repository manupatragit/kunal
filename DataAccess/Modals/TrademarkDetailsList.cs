using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Modals
{
    public class TrademarkDetailsList
    {
        public List<userDetails> data { get; set; }
    }
    public class userDetails
    {

        public int iid { get; set; }
        public Nullable<int> ifid { get; set; }
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
        public string dCrwalDate { get; set; }
        public string vImgPath { get; set; }
        public string Agent { get; set; }
        public string AgentAddress { get; set; }


    }
}
