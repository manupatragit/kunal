using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Modals
{
    public class InvoiceEntryAmend
    {
        public string Type { get; set; }
        public string ItemName { get; set; }
        public string CaseName { get; set; }
        public string UserName { get; set; }
        public string Quantity { get; set; }
        public string Price { get; set; }

        public string TotalAmount { get; set; }
        public string tempCaseName { get; set; }
        public string tempUserName { get; set; }
        public string billyby { get; set; }
        
    }
}
