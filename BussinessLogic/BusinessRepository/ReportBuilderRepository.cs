using BussinessLogic.IBusinessRepository;
using DataAccess.Modals;
using Newtonsoft.Json;
using System.Linq;

namespace BussinessLogic.BusinessRepository
{
    public class ReportBuilderRepository : IReportBuilderRepository
    {
        /// <summary>
        /// Bind column report
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="moduleid"></param>
        /// <returns></returns>
        public string BindColumnForReport(string firmid, string moduleid)
        {
            var db = new LawPracticeEntities();

            var result = db.sp_GetColumnForReport(moduleid).ToList();
            var data = JsonConvert.SerializeObject(result);
            return data;
        }
        /// <summary>
        /// Bind filter report
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="moduleid"></param>
        /// <returns></returns>
        public string BindFilterForReport(string firmid, string moduleid)
        {
            var db = new LawPracticeEntities();

            var result = db.sp_GetFilterForReport(firmid, moduleid).ToList();
            var data = JsonConvert.SerializeObject(result);
            return data;
        }
        /// <summary>
        /// Bind Group By Master List Column For Report
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="moduleid"></param>
        /// <returns></returns>
        public string BindGroupByMasterListColumnForReport(string firmid, string moduleid)
        {
            var db = new LawPracticeEntities();

            var result = db.sp_GetGroupByMasterListColumnForReport().ToList();
            var data = JsonConvert.SerializeObject(result);
            return data;
        }
        /// <summary>
        /// Bind report builder module
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string BindReportBuilderModule(string firmid, string userid)
        {
            var db = new LawPracticeEntities();

            var result = db.sp_GetReportModules().ToList();
            var data = JsonConvert.SerializeObject(result);
            return data;
        }
        /// <summary>
        /// Delete report builder
        /// </summary>
        /// <param name="reportId"></param>
        /// <param name="createdby"></param>
        /// <param name="firmid"></param>
        /// <param name="moduleid"></param>
        /// <returns></returns>
        public string DeleteReportBuilder(string reportId, string createdby, string firmid, string moduleid)
        {
            var db = new LawPracticeEntities();

            var result = db.sp_DeleteReportBuilder(reportId, createdby, firmid);
            var data = JsonConvert.SerializeObject(result);
            return data;
        }
        /// <summary>
        /// Insert report builder filter
        /// </summary>
        /// <param name="reportname"></param>
        /// <param name="createdby"></param>
        /// <param name="resultCol"></param>
        /// <param name="filter"></param>
        /// <param name="order"></param>
        /// <param name="vGroup"></param>
        /// <param name="firmid"></param>
        /// <param name="reporttypeforcustomRpt"></param>
        /// <param name="filterArray"></param>
        /// <param name="filterValueArray"></param>
        /// <param name="columnArray"></param>
        /// <param name="groupByArray"></param>
        /// <param name="orderByArray"></param>
        /// <param name="orderByValueArray"></param>
        /// <param name="moduleid"></param>
        /// <returns></returns>
        public string InsertReportBuilderFilter(string reportname, string createdby, string resultCol, string filter, string order, string vGroup, string firmid, string reporttypeforcustomRpt, string filterArray, string filterValueArray, string columnArray, string groupByArray, string orderByArray, string orderByValueArray, string moduleid)
        {
            var db = new LawPracticeEntities();

            var result = db.sp_InsertReportBuilderFilter(reportname, createdby, resultCol,
                                                               filter, order, vGroup,
                                                               firmid, reporttypeforcustomRpt, filterArray, filterValueArray, columnArray, groupByArray, orderByArray, orderByValueArray, moduleid);

            var data = JsonConvert.SerializeObject(result);
            return data;
        }
        /// <summary>
        /// Update report builder filter
        /// </summary>
        /// <param name="reportId"></param>
        /// <param name="reportname"></param>
        /// <param name="createdby"></param>
        /// <param name="resultCol"></param>
        /// <param name="filter"></param>
        /// <param name="order"></param>
        /// <param name="vGroup"></param>
        /// <param name="firmid"></param>
        /// <param name="reporttypeforcustomRpt"></param>
        /// <param name="filterArray"></param>
        /// <param name="filterValueArray"></param>
        /// <param name="columnArray"></param>
        /// <param name="groupByArray"></param>
        /// <param name="orderByArray"></param>
        /// <param name="orderByValueArray"></param>
        /// <param name="moduleid"></param>
        /// <returns></returns>
        public string UpdateReportBuilderFilter(string reportId, string reportname, string createdby, string resultCol, string filter, string order, string vGroup, string firmid, string reporttypeforcustomRpt, string filterArray, string filterValueArray, string columnArray, string groupByArray, string orderByArray, string orderByValueArray, string moduleid)
        {
            var db = new LawPracticeEntities();

            var result = db.sp_UpdateReportBuilderFilter(reportId, reportname, createdby, resultCol,
                                                             filter, order, vGroup,
                                                             firmid, reporttypeforcustomRpt, filterArray, filterValueArray, columnArray, groupByArray, orderByArray, orderByValueArray, moduleid);

            var data = JsonConvert.SerializeObject(result);
            return data;
        }
    }
}