using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LawPracticeFirm.Models
{
    public class IPRList
    {
        public string id { get; set; }
        public string name { get; set; }

        public string RowId { get; set; }
        public string vWordMark { get; set; }
        public string vProprietor { get; set; }
        public string vApplNo { get; set; }
        public string vStatus { get; set; }
        public string vClass { get; set; }
        public string dApplDate { get; set; }
        public string vUsedSince { get; set; }
        public string className { get; set; }

    }

    public class AgentDetails
    {
        public string vApplNo { get; set; }
        public string vWordMark { get; set; }
        public string vProprietor { get; set; }
        public string vStatus { get; set; }
        public string vClass { get; set; }
        public string dApplDate { get; set; }
        public string vUsedSince { get; set; }
        public int RowId { get; set; }
        public int TotalRecord{ get; set; }
    }
}