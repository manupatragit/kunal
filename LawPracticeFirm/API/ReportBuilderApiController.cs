using DataAccess.Modals;
using LawPracticeFirm.Common;
using LawPracticeFirm.DAL;
using LawPracticeFirm.Models;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;

namespace LawPracticeFirm.API
{
    public class ReportBuilderApiController : BaseFirmApiController
    {
        private LawPracticeEntities db = new LawPracticeEntities();
        public string controllername = "ReportBuilderApiController";

        /// <summary>
        /// Module report list
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Http.HttpPost]
        public IHttpActionResult ModuleListForReport([FromBody] JObject paramJObject)
        {
            dynamic request = "";
            if (paramJObject != null)
            {
                request = paramJObject.ToObject<RequestObject>();
            }
            string firmid = LoggedInUser.FirmId.ToString();
            string userid = LoggedInUser.UserId.ToString();
            var listobj = Repository.ReportBuilder.BindReportBuilderModule(firmid, userid);
            return Content(HttpStatusCode.OK, listobj);
        }

        /// <summary>
        /// Filter report list
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Http.HttpPost]
        public IHttpActionResult FilterListForReport([FromBody] JObject paramJObject)
        {
            dynamic request = "";
            if (paramJObject != null)
            {
                request = paramJObject.ToObject<RequestObject>();
            }
            var moduleid = request.moduleid;
            string firmid = LoggedInUser.FirmId.ToString();
            var listobj = Repository.ReportBuilder.BindFilterForReport(firmid, moduleid);
            return Content(HttpStatusCode.OK, listobj);
        }

        /// <summary>
        /// Column report list details
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Http.HttpPost]
        public IHttpActionResult ColumnListForReport([FromBody] JObject paramJObject)
        {
            dynamic request = "";
            if (paramJObject != null)
            {
                request = paramJObject.ToObject<RequestObject>();
            }
            var moduleid = request.moduleid;
            string firmid = LoggedInUser.FirmId.ToString();
            var listobj = Repository.ReportBuilder.BindColumnForReport(firmid, moduleid);
            return Content(HttpStatusCode.OK, listobj);
        }

        /// <summary>
        /// Group by column  report list
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Http.HttpPost]
        public IHttpActionResult ColumnGroupByListForReport([FromBody] JObject paramJObject)
        {
            dynamic request = "";
            if (paramJObject != null)
            {
                request = paramJObject.ToObject<RequestObject>();
            }
            string firmid = LoggedInUser.FirmId.ToString();
            var moduleid = request.moduleid;
            var listobj = Repository.ReportBuilder.BindGroupByMasterListColumnForReport(firmid, moduleid);
            return Content(HttpStatusCode.OK, listobj);
        }

        /// <summary>
        /// Type filter report dropdown list
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Http.HttpPost]
        public IHttpActionResult DropdownBindForReportbyTypeFilter([FromBody] JObject paramJObject)
        {
            var ResponseData = new List<ReportBuilderCommonDropdownResponseDTO>();
            dynamic request = "";
            if (paramJObject != null)
            {
                request = paramJObject.ToObject<RequestObject>();
            }
            string firmid = LoggedInUser.FirmId.ToString();
            string Type = request.type;
            var moduleid = request.moduleid;
            if (!String.IsNullOrEmpty(Type))
            {
                if (Type.ToLower() == "mattertype" && moduleid == "1")
                {
                    List<usp_GetCommonDropdownData_Result> listobj = new List<usp_GetCommonDropdownData_Result>();
                    using (var db = new LawPracticeEntities())
                    {
                        listobj = db.usp_GetCommonDropdownData("Matter_Type", firmid.ToString(), LoggedInUser.UserId.ToString()).ToList();
                        if (listobj == null || listobj.Count == 0)
                        {
                            return Content(HttpStatusCode.OK, "Result Not Found");
                        }
                        else
                        {
                            var result = listobj.ToList().Select(x => new ReportBuilderCommonDropdownResponseDTO()
                            {
                                Id = x.iid.ToString(),
                                Name = x.Name,
                                Type = request.type
                            }).ToList();
                            return Content(HttpStatusCode.OK, result);
                        }
                    }
                }
                else if (Type.ToLower() == "status" && moduleid == "1")
                {
                    List<usp_GetCommonDropdownData_Result> listobj = new List<usp_GetCommonDropdownData_Result>();
                    using (var db = new LawPracticeEntities())
                    {
                        listobj = db.usp_GetCommonDropdownData("Case_Status", firmid.ToString(), LoggedInUser.UserId.ToString()).ToList();
                        if (listobj == null || listobj.Count == 0)
                        {
                            return Content(HttpStatusCode.OK, "Result Not Found");
                        }
                        else
                        {
                            var result = listobj.ToList().Select(x => new ReportBuilderCommonDropdownResponseDTO()
                            {
                                Id = x.iid.ToString(),
                                Name = x.Name,
                                Type = request.type
                            }).ToList();
                            return Content(HttpStatusCode.OK, result);
                        }
                    }
                }
                else
                {
                    return Content(HttpStatusCode.OK, "");
                }
            }
            else
            {
                return Content(HttpStatusCode.OK, "Invalid type");
            }
        }

        /// <summary>
        /// Custom report filter details
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Http.AllowAnonymous]
        [System.Web.Http.HttpPost]
        public IHttpActionResult CustomReportData([FromBody] JObject paramJObject)
        {
            dynamic request = "";
            if (paramJObject != null)
            {
                request = paramJObject.ToObject<RequestObject>();
            }
            string firmid = LoggedInUser.FirmId.ToString();
            var TempTablecolumnnameforcustomRpt = request.TempTablecolumnnameforcustomRpt;
            var columnnameforcustomRpt = request.columnnameforcustomRpt;
            var filternameforcustomRpt = request.filternameforcustomRpt;
            var groupcolcollectionforcustomRpt = request.groupcolcollectionforcustomRpt;
            var ordercolcollecionforcustomRpt = request.ordercolcollecionforcustomRpt;
            var reportnameforcustomRpt = request.reportnameforcustomRpt;
            var reporttypeforcustomRpt = request.reporttypeforcustomRpt;
            var groupBycolumn = request.groupBycolumn;
            var createdBy = LoggedInUser.UserId.ToString();
            var FilterArray = request.FilterArray;
            var FilterValueArray = request.FilterValueArray;
            var ColumnArray = request.ColumnArray;
            var GroupByArray = request.GroupByArray;
            var OrderByArray = request.OrderByArray;
            var OrderByValueArray = request.OrderByValueArray;
            var moduleid = request.moduleid;
            var loginuser = LoggedInUser.UserId.ToString();
            var userRole = LoggedInUser.RoleId.ToString();
            dynamic listobj = null;
            using (var db = new LawPracticeEntities())
            {
                var tempfilternameforcustomRpt = filternameforcustomRpt.Replace(",", " and ");
                listobj = DataAccessADO.GetReportBuilderQueryPreview(columnnameforcustomRpt, firmid, tempfilternameforcustomRpt,
                     ordercolcollecionforcustomRpt, groupcolcollectionforcustomRpt, reporttypeforcustomRpt, 1, 10, "", groupBycolumn, loginuser, userRole, moduleid);
                if (listobj.Rows.Count > 0)
                {
                    var output = Repository.ReportBuilder.InsertReportBuilderFilter(reportnameforcustomRpt, createdBy, columnnameforcustomRpt,
                                                               TempTablecolumnnameforcustomRpt, ordercolcollecionforcustomRpt, groupcolcollectionforcustomRpt,
                                                               firmid, reporttypeforcustomRpt, FilterArray, FilterValueArray, ColumnArray, GroupByArray, OrderByArray, groupBycolumn, moduleid);
                }
            }
            if (listobj == null || listobj.Rows.Count == 0)
            {
                return Content(HttpStatusCode.OK, "Result Not Found");
            }
            return Content(HttpStatusCode.OK, "Report saved successfully");
        }

        /// <summary>
        /// Add custom report data preview
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Http.HttpPost]
        public IHttpActionResult AddCustomReportDataPreview([FromBody] JObject paramJObject)
        {
            dynamic request = "";
            if (paramJObject != null)
            {
                request = paramJObject.ToObject<RequestObject>();
            }
            string firmid = LoggedInUser.FirmId.ToString();
            var TempTablecolumnnameforcustomRpt = request.TempTablecolumnnameforcustomRpt;
            var columnnameforcustomRpt = request.columnnameforcustomRpt;
            var filternameforcustomRpt = request.filternameforcustomRpt;
            var groupcolcollectionforcustomRpt = request.groupcolcollectionforcustomRpt;
            var ordercolcollecionforcustomRpt = request.ordercolcollecionforcustomRpt;
            var reportnameforcustomRpt = request.reportnameforcustomRpt;
            var reporttypeforcustomRpt = request.reporttypeforcustomRpt;
            var groupBycolumn = request.groupBycolumn;
            var createdBy = LoggedInUser.UserId.ToString();
            var FilterArray = request.FilterArray;
            var FilterValueArray = request.FilterValueArray;
            var ColumnArray = request.ColumnArray;
            var GroupByArray = request.GroupByArray;
            var OrderByArray = request.OrderByArray;
            var OrderByValueArray = request.OrderByValueArray;
            var pagenumber = request.pageno;
            var pagesize = request.pagesize;
            var moduleid = request.moduleid;
            var loginuser = LoggedInUser.UserId.ToString();
            var userRole = LoggedInUser.RoleId.ToString();
            dynamic listobj = null;
            using (var db = new LawPracticeEntities())
            {
                var tempfilternameforcustomRpt = filternameforcustomRpt.Replace(",", " and ");
                listobj = DataAccessADO.GetReportBuilderQueryPreview(columnnameforcustomRpt, firmid, tempfilternameforcustomRpt,
                    ordercolcollecionforcustomRpt, groupcolcollectionforcustomRpt, reporttypeforcustomRpt, Convert.ToInt32(pagenumber), Convert.ToInt32(pagesize), "", groupBycolumn, loginuser, userRole, moduleid);
            }
            if (listobj == null || listobj.Rows.Count == 0)
            {
                return Content(HttpStatusCode.OK, "Result Not Found");
            }
            return Content(HttpStatusCode.OK, listobj);
        }

        /// <summary>
        /// Custom report builder list
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Http.HttpPost]
        public IHttpActionResult CustomReportBuilderList([FromBody] JObject paramJObject)
        {
            dynamic request = "";
            if (paramJObject != null)
            {
                request = paramJObject.ToObject<RequestObject>();
            }
            string firmid = LoggedInUser.FirmId.ToString();
            var filternameforcustomRpt = request.filternameforcustomRpt;
            var pageno = request.pageno;
            var pagesize = request.pagesize;
            var createdBy = LoggedInUser.UserId.ToString();
            var moduleid = request.moduleid;
            dynamic listobj = null;
            using (var db = new LawPracticeEntities())
            {
                listobj = DataAccessADO.GetSaveReportBuilderList(firmid, createdBy, filternameforcustomRpt, pageno, pagesize, moduleid);
            }
            if (listobj == null || listobj.Rows.Count == 0)
            {
                return Content(HttpStatusCode.OK, "Result Not Found");
            }
            return Content(HttpStatusCode.OK, listobj);
        }

        /// <summary>
        /// Get final custom report list
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Http.HttpPost]
        public IHttpActionResult BindCustomReportFinal([FromBody] JObject paramJObject)
        {
            dynamic request = "";
            if (paramJObject != null)
            {
                request = paramJObject.ToObject<RequestObject>();
            }
            string firmid = LoggedInUser.FirmId.ToString();
            var Id = request.id;
            var pagenumber = request.pageno;
            var pagesize = request.pagesize;
            var createdBy = LoggedInUser.UserId.ToString();
            var moduleid = request.moduleid;
            var loginuser = LoggedInUser.UserId.ToString();
            var userRole = LoggedInUser.RoleId.ToString();
            dynamic listobj = null;
            using (var db = new LawPracticeEntities())
            {
                listobj = DataAccessADO.GetBindCustomReportFinal(firmid, createdBy, Id, pagenumber, pagesize, loginuser, userRole, moduleid);
            }
            return Content(HttpStatusCode.OK, listobj);
        }

        /// <summary>
        /// Get master custom report by id
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Http.HttpPost]
        public IHttpActionResult BindCustomReportMasterById([FromBody] JObject paramJObject)
        {
            dynamic request = "";
            if (paramJObject != null)
            {
                request = paramJObject.ToObject<RequestObject>();
            }
            string firmid = LoggedInUser.FirmId.ToString();
            var Id = request.id;
            var createdBy = LoggedInUser.UserId.ToString();
            var moduleid = request.moduleid;
            dynamic listobj = null;
            using (var db = new LawPracticeEntities())
            {
                listobj = DataAccessADO.GetBindCustomReportMasterById(firmid, createdBy, Id, moduleid);
            }
            return Content(HttpStatusCode.OK, listobj);
        }

        /// <summary>
        /// Update custom report data
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Http.HttpPost]
        public IHttpActionResult UpdateCustomReportData([FromBody] JObject paramJObject)
        {
            dynamic request = "";
            if (paramJObject != null)
            {
                request = paramJObject.ToObject<RequestObject>();
            }
            string firmid = LoggedInUser.FirmId.ToString();
            var TempTablecolumnnameforcustomRpt = request.TempTablecolumnnameforcustomRpt;
            var columnnameforcustomRpt = request.columnnameforcustomRpt;
            var filternameforcustomRpt = request.filternameforcustomRpt;
            var groupcolcollectionforcustomRpt = request.groupcolcollectionforcustomRpt;
            var ordercolcollecionforcustomRpt = request.ordercolcollecionforcustomRpt;
            var reportnameforcustomRpt = request.reportnameforcustomRpt;
            var reporttypeforcustomRpt = request.reporttypeforcustomRpt;
            var createdBy = LoggedInUser.UserId.ToString();
            var FilterArray = request.FilterArray;
            var FilterValueArray = request.FilterValueArray;
            var ColumnArray = request.ColumnArray;
            var GroupByArray = request.GroupByArray;
            var OrderByArray = request.OrderByArray;
            var OrderByValueArray = request.OrderByValueArray;
            var moduleid = request.moduleid;
            var ReportId = request.id;
            dynamic listobj = null;
            using (var db = new LawPracticeEntities())
            {
                var tempfilternameforcustomRpt = filternameforcustomRpt.Replace(",", " and ");
                listobj = DataAccessADO.GetReportBuilderQuery(columnnameforcustomRpt, firmid, tempfilternameforcustomRpt,
                    ordercolcollecionforcustomRpt, groupcolcollectionforcustomRpt, reporttypeforcustomRpt, 1, 10, "", moduleid);
                if (listobj.Rows.Count > 0)
                {
                    if (!String.IsNullOrEmpty(ReportId))
                    {
                        var output = Repository.ReportBuilder.UpdateReportBuilderFilter(ReportId, reportnameforcustomRpt, createdBy, columnnameforcustomRpt,
                                                             TempTablecolumnnameforcustomRpt, ordercolcollecionforcustomRpt, groupcolcollectionforcustomRpt,
                                                             firmid, reporttypeforcustomRpt, FilterArray, FilterValueArray, ColumnArray, GroupByArray, OrderByArray, OrderByValueArray, moduleid);
                    }
                }
            }
            if (listobj == null || listobj.Rows.Count == 0)
            {
                return Content(HttpStatusCode.OK, "Result Not Found");
            }
            return Content(HttpStatusCode.OK, "Report saved successfully");
        }

        /// <summary>
        /// Remove custom report by Id
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Http.HttpPost]
        public IHttpActionResult RemoveCustomReportById([FromBody] JObject paramJObject)
        {
            dynamic request = "";
            if (paramJObject != null)
            {
                request = paramJObject.ToObject<RequestObject>();
            }
            string firmid = LoggedInUser.FirmId.ToString();
            var Id = request.id;
            var createdBy = LoggedInUser.UserId.ToString();
            var moduleid = request.moduleid;
            var listobj = Repository.ReportBuilder.DeleteReportBuilder(Id, createdBy, firmid, moduleid);
            if (Convert.ToInt32(listobj) > 0)
            {
                return Content(HttpStatusCode.OK, "Deleted Successfully");
            }
            else
            {
                return Content(HttpStatusCode.OK, "Something went wrong");
            }
        }
    }
}
