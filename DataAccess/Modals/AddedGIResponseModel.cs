using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Modals
{
    public class AddedGIResponseModel
    {
        public Nullable<int> TotalRecord { get; set; }
        public Nullable<int> RowId { get; set; }
        public Nullable<int> iid { get; set; }
        public string vApplicantName { get; set; }
        public string vApplicationNo { get; set; }
        public string vStatus { get; set; }
        public string dDateOffilingfrom { get; set; }
        public string dDateoffilingto { get; set; }
        public string vJournalNo { get; set; }
        public string dRegisteredDate { get; set; }
        public string vClass { get; set; }
        public string dDateoffiling { get; set; }
        public string vRegisteredProp { get; set; }
        public string vGoods { get; set; }
        public string vGIName { get; set; }
        public string vGeoIndication { get; set; }
        public string vRegistrationValidUpto { get; set; }
        public Nullable<int> Tradeiid { get; set; }
    }
}
