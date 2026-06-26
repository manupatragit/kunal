using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LawPracticeFirm.Models
{
    public class CaseReportForCourt
    {
        public string vState { get; set; }
        public Int32 HighCOURT { get; set; }
        public Int32 CityCivilCourt { get; set; }
        public Int32 CONSUMERFORUMS { get; set; }
        public Int32 NCLT_NCLAT { get; set; }
        public Int32 LabourCourt { get; set; }
        public Int32 CommissionerOfIncomeTax { get; set; }
        public Int32 DebtRecoveryTribunal { get; set; }
        public Int32 SAT_Mumbai { get; set; }
        public Int32 Total { get; set; }
    }
}