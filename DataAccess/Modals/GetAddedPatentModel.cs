using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.IPRModel
{
    /// <summary>
    /// Bind patent detail
    /// </summary>
    public class GetAddedPatentModel
    {
        public Nullable<int> TotalRecord { get; set; }
        public Nullable<int> RowId { get; set; }
        public Nullable<int> iid { get; set; }
        public string vApplicantName { get; set; }
        public string vInventionTitle { get; set; }
        public string vApplNo { get; set; }
        public string StatusName { get; set; }
        public string dDateOffiling { get; set; }
        public string dPriorityDate { get; set; }
        public string vCompSpecification { get; set; }
        public string dEntryDate { get; set; }
        public string Tradeiid { get; set; }
        public string vPatentNum { get; set; }
    }
    /// <summary>
    /// Get saved email
    /// </summary>
    public class GetSavedEmailModel
    {
        public string EmailId { get; set; }
    }
}
