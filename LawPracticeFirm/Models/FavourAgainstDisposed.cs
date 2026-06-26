using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LawPracticeFirm.Models
{
    public class FavourAgainstDisposed
    {
        public string Court { get; set; }
        public string YearPendecy { get; set; }
        public Int64 Favour { get; set; }
        public Int64 Against { get; set; }
    }
    public class FinalFavourAgainstDisposed
    {
        public string YearPendency { get; set; }
        public string FaAg { get; set; }
        public Int64 SC { get; set; }
        public Int64 HC { get; set; }
        public Int64 OF { get; set; }
    }
}