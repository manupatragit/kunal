using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LawPracticeFirm.Models
{
    /// <summary>
    /// Cause list details
    /// </summary>
    public class CauseList
    {
        public string Filetext { get; set; }
        public string Casename { get; set; }
        public string CourtId { get; set; }
        public string Bench { get; set; }
        public string Causelistdate { get; set; }

    }
    public class RevenueCauseList
    {
        public string vCaseno { get; set; }
        public string Appres { get; set; }
        public string vCourt { get; set; }
        public string Causelistdate { get; set; }
    }

}