using System;

namespace BussinessLogic.IBusinessRepository
{
    public interface IReportBuilderRepository
    {
        string BindReportBuilderModule(string firmid, string userid);
        string BindFilterForReport(string firmid, string moduleid);
        string BindColumnForReport(string firmid, string moduleid);
        string BindGroupByMasterListColumnForReport(string firmid, string moduleid);
        string InsertReportBuilderFilter(string reportname, string createdby, string resultCol, string filter, string order, string vGroup, string firmid, string reporttypeforcustomRpt, string filterArray, string filterValueArray, string columnArray, string groupByArray, string orderByArray, string orderByValueArray, string moduleid);
        string UpdateReportBuilderFilter(string reportId, string reportname, string createdby, string resultCol, string filter, string order, string vGroup, string firmid, string reporttypeforcustomRpt, string filterArray, string filterValueArray, string columnArray, string groupByArray, string orderByArray, string orderByValueArray, string moduleid);
        string DeleteReportBuilder(string reportId, string createdby, string firmid, string moduleid);
    }
}
