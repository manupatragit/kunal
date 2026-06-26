using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Modals
{
    /// <summary>
    /// Add design response model
    /// </summary>
    public class AddedDesignResponseModel
    {
        public Nullable<int> TotalRecord { get; set; }
        public Nullable<int> RowId { get; set; }
        public Nullable<int> iid { get; set; }
        public string vDesignNo { get; set; }
        public string vClass { get; set; }
        public string vApplDetails { get; set; }
        public string vStatus { get; set; }
        public string vTitle { get; set; }
        public string vAddress { get; set; }
        public string dDateOfRegistration { get; set; }
        public string vPriorityNo { get; set; }
        public Nullable<int> Tradeiid { get; set; }
        public string vPatentOffJournalNo { get; set; }
    }
}
