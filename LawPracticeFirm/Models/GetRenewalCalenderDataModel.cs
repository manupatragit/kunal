using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LawPracticeFirm.Models
{
    public class GetRenewalCalenderDataModel
    {
        public string AppNo { get; set; }
        public string Trademark { get; set; }
        public string Proprietor { get; set; }
        public string Class { get; set; }
        public string AppDate { get; set; }
        public int? RenewalCount { get; set; }
        public int? RowId { get; set; }
        public string RenewalDate { get; set; }
        public string vClass { get; set; }
        public string Datetype { get; set; }
        

    }
}