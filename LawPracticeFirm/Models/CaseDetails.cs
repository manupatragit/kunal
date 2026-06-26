using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LawPracticeFirm.Models
{
    /// <summary>
    /// Case details model
    /// </summary>
    public class CaseDetails
    {

        public string Id { get; set; }
        public string CaseId { get; set; }
        public string Court { get; set; }
        public string Case_Diary { get; set; }
        public string Case_Name { get; set; }
        public string Bench_Name { get; set; }
        public string Advocate { get; set; }
        public string Next_Hearing { get; set; }
        public string Disposed_Date { get; set; }
        public string Status { get; set; }
        public string District { get; set; }
        public string Manualnexthearing { get; set; }
        public string CNRNO { get; set; }
        public string Court_Complex_Court_Establishment_Type { get; set; }
        public string Court_Complex_Court_Establishment { get; set; }
        public string Notes { get; set; }
        public string Docs { get; set; }
        public string Earlier_Court_Details { get; set; }
        public string Notices { get; set; }
        public string Office_Reports { get; set; }
        public string Caveat { get; set; }
        public string TaggedName { get; set; }
        public string CourtType { get; set; }
        public string TagMatters { get; set; }
        public string MainMatterCount { get; set; }
        public string LinkedCasesCount { get; set; }
        public string SubMattersCount { get; set; }
        public string FIRDetailsCount { get; set; }

    }
}