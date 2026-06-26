using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LawPracticeFirm.Models
{
    public class AgeWiseDetailReport
    {
        public string Court { get; set; }
        public string Rowlevel { get; set; }
        public string FiledbySEBICount { get; set; }
        public string FiledAgainstSEBICount { get; set; }
    }
}