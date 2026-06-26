using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LawPracticeFirm.Models
{
    public class FilterMatterListData
    {
        public string FilingDate { get; set; }
        public string CourtName { get; set; }
        public string BenchName { get; set; }
        public string VCaseName { get; set; }
        public string VStatus { get; set; }
        public string VCaseNo { get; set; }
        public string VCaseTypeName { get; set; }
        public string VCaseType { get; set; }
        public string VCauselistDate { get; set; }
    }
    public class DataContainer
    {
        public List<FilterMatterListData> Table { get; set; }
    }

    public class ApiResponse
    {
        public bool Status { get; set; }
        public string Message { get; set; }
        public DataContainer Data { get; set; }
    }

    public class FinalResultForExport
    {
       public string Court  { get; set; }
       public string  Matter_Name { get; set; }
        public string Case_No { get; set; }
        public string Status { get; set; }
        public string Filing_Date { get; set; }
        public string Next_Hearing { get; set; }
    }
}