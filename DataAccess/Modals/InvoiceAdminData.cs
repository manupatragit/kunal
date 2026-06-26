using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LawPracticeFirm
{
    public class InvoiceAdminData
    {
     
        public System.Guid Id { get; set; }
        public System.Guid Firmid { get; set; }
        public System.Guid userid { get; set; }
        public string website { get; set; }
        public string inaddress { get; set; }

        public string inphone { get; set; }
        public string inemail { get; set; }
        public string ingstregno { get; set; }
        public string inpan { get; set; }
        public string saccode { get; set; }
        public string Incompanyname { get; set; }
        public string inlogo { get; set; }
        public string innotes { get; set; }
        public string intermscondtion { get; set; }

        public int intemplate { get; set; }
        public string state { get; set; }
        public int isdefault { get; set; }

    }
}