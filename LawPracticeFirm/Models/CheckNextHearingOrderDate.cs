using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LawPracticeFirm.Models
{
    /// <summary>
    /// Check Next Hearing Order Date
    /// </summary>
    public class CheckNextHearingOrderDate
    {
        string finaldate = "";

        public string Finaldate
        {
            get { return finaldate; }
            set { finaldate = value; }
        }

    }
    public class CheckNextHearingOrderDateList : List<CheckNextHearingOrderDate>
    {
        public CheckNextHearingOrderDateList()
        {
        }
    }
}