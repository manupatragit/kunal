using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LawPracticeFirm.Models
{
    /// <summary>
    /// Case details model
    /// </summary>
    public class CaseWatchBulkRequest
    {
        public string token { get; set; }

        public int IsRevenueCourt { get; set; }

        public int IsReraCourt { get; set; }
    }
}