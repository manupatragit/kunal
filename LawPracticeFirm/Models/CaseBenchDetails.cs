using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LawPracticeFirm.Models
{
    /// <summary>
    /// Case details model
    /// </summary>
    public class CaseBenchDetails
    {
        public string UserCaseId { get; set; }

        public string Bench_Name { get; set; }

        public string Manualnexthearing { get; set; }

        public string Next_Hearing { get; set; }
    }
}