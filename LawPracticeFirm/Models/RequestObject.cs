using System.Collections.Generic;
namespace LawPracticeFirm.Models
{
    /// <summary>
    /// Request object model
    /// </summary>
    public class RequestObject
    {
        public string sortcolname { get; set; }
        public string reporttypeforcustomRpt { get; set; }
        public string groupcolcollectionforcustomRpt { get; set; }
        public string ordercolcollecionforcustomRpt { get; set; } 
        public string reportnameforcustomRpt { get; set; }
        public string columnnameforcustomRpt { get; set; }
        public string filternameforcustomRpt { get; set; }
        public string groupBycolumn { get; set; }
        public string TempTablecolumnnameforcustomRpt { get; set; }
        public string FilterArray { get; set; }
        public string FilterValueArray { get; set; }
        public string ColumnArray { get; set; }
        public string GroupByArray { get; set; }
        public string OrderByArray { get; set; }
        public string OrderByValueArray { get; set; }
        public string id { get; set; }
        public string moduleid { get; set; }
        public string type { get; set; }
        public string pageno { get; set; }
        public string pagesize { get; set; }
    }
}
