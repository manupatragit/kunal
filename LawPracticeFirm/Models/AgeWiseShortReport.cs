using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LawPracticeFirm.Models
{
    public class AgeWiseShortReport
    {
        public string Court { get; set; }
        public string Rowlevel { get; set; }
        public Int64 CountofYearofFiling { get; set; }

        public int HO { get; set; }
        public int ERO { get; set; }
        public int NRO { get; set; }
        public int WRO { get; set; }
        public int SRO { get; set; }
        public int TotalCase { get; set; }
    }
    public class AgeWiseSortReportSc
    {
        public string Court { get; set; }

        public string Rowlevel { get; set; }

        public long CountOfYearOfFiling { get; set; }

        public int Non_15Z { get; set; } // Internal name is "Non15Z", but serialized as "Non 15Z"

        public int _15Z { get; set; } 

        public int TotalCase { get; set; }
    }

}