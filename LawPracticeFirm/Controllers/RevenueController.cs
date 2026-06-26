using BussinessLogic;
using DataAccess.Modals;
using LawPracticeFirm.Common;
using LawPracticeFirm.CustomFIlter;
using LawPracticeFirm.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NJDGDetail.Models;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Web.Configuration;
using System.Web.Mvc;
using System.Web.UI;
using System.Web.UI.WebControls;
using static LawPracticeFirm.Models.AuditData;
using AuditData = LawPracticeFirm.Models.AuditData;

namespace LawPracticeFirm.Controllers
{
    public class RevenueController : BaseFirmController
    {
        public string prefixName = WebConfigurationManager.AppSettings["matteridname"];
        private LawPracticeEntities db = new LawPracticeEntities();
        public string controllername = "RevenueController";
        /// <summary>
        /// Get revenue Vcourt details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public JsonResult FillRevenueVCourt()
        {
            try
            {
                var FirmId = LoggedInUser.FirmId.ToString();
                var UserId = LoggedInUser.UserId.ToString();
                var User = prefixName + UserId;
                var Result = RevenueCase.FillRevenueVCourt(FirmId, User);
                var param = controllername + "=>FillRevenueVCourt=>RevenueCase.FillRevenueVCourt" + "@" + FirmId + "@" + User;
                db.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                return Json(Result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Fill mandal
        /// </summary>
        /// <param name="RevCourt"></param>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public JsonResult FillMandal(string RevCourt = "")
        {
            try
            {
                var FirmId = LoggedInUser.FirmId.ToString();
                var UserId = LoggedInUser.UserId.ToString();
                var User = prefixName + UserId;
                var Result = RevenueCase.FillMandal(FirmId, User, RevCourt);
                var param = controllername + "=>FillMandal=>RevenueCase.FillMandal" + "@" + FirmId + "@" + User + "@" + RevCourt;
                db.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                return Json(Result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Get janpad detail by mandal
        /// </summary>
        /// <param name="MandalValue"></param>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public JsonResult FillJanpadByMandal(string MandalValue = "")
        {
            try
            {
                var FirmId = LoggedInUser.FirmId.ToString();
                var UserId = LoggedInUser.UserId.ToString();
                var User = prefixName + UserId;
                var Result = RevenueCase.FillJanpadByMandal(FirmId, User, MandalValue);
                var param = controllername + "=>FillJanpadByMandal=>RevenueCase.FillJanpadByMandal" + "@" + FirmId + "@" + User + "@" + MandalValue;
                db.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                return Json(Result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Get tahsil by janpad
        /// </summary>
        /// <param name="JanPadValue"></param>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public JsonResult FillTahsilByJanpad(string JanPadValue = "")
        {
            try
            {
                var FirmId = LoggedInUser.FirmId.ToString();
                var UserId = LoggedInUser.UserId.ToString();
                var User = prefixName + UserId;
                var Result = RevenueCase.FillTahsilByJanpad(FirmId, User, JanPadValue);
                var param = controllername + "=>FillTahsilByJanpad=>RevenueCase.FillTahsilByJanpad" + "@" + FirmId + "@" + User + "@" + JanPadValue;
                db.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                return Json(Result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Fill revenue court by tahsil
        /// </summary>
        /// <param name="TahsilValue"></param>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public JsonResult FillRevenueCourtByTahsil(string TahsilValue = "")
        {
            try
            {
                var FirmId = LoggedInUser.FirmId.ToString();
                var UserId = LoggedInUser.UserId.ToString();
                var User = prefixName + UserId;
                var Result = RevenueCase.FillRevenueCourtByTahsil(FirmId, User, TahsilValue);
                var param = controllername + "=>FillRevenueCourtByTahsil=>RevenueCase.FillRevenueCourtByTahsil" + "@" + FirmId + "@" + User + "@" + TahsilValue;
                db.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                return Json(Result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Show revenue case order by Id
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public JsonResult ShowRevenueCaseOrdersById()
        {
            try
            {
                var FirmId = LoggedInUser.FirmId.ToString();
                var UserId = LoggedInUser.UserId.ToString();
                var User = prefixName + UserId;
                var UserCaseIdValue = QueryAES.UrlDecode(Request.Form["UserCaseIdValue"]);
                var Result = RevenueCase.ShowRevenueCaseOrdersById(FirmId, User, UserCaseIdValue, LoggedInUser.IsCaseWatchUser, LoggedInUser.UserName.ToString());
                var param = controllername + "=>ShowRevenueCaseOrdersById=>RevenueCase.ShowRevenueCaseOrdersById" + "@" + FirmId + "@" + User + "@" + UserCaseIdValue;
                db.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                return Json(Result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Get myrevenue case details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public JsonResult MyRevenueCaseDetails()
        {
            try
            {
                var FirmId = LoggedInUser.FirmId.ToString();
                var UserId = LoggedInUser.UserId.ToString();
                var User = prefixName + UserId;
                var UserCaseIdValue = QueryAES.UrlDecode(Request.Form["UserCaseIdValue"]);
                var PageSize = QueryAES.UrlDecode(Request.Form["PageSize"]);
                var PageIndex = QueryAES.UrlDecode(Request.Form["PageIndex"]);
                var SortValue = QueryAES.UrlDecode(Request.Form["SortValue"]);
                var Result = RevenueCase.MyRevenueCaseDetails(FirmId, User, UserCaseIdValue, PageSize, PageIndex, SortValue);
                var param = controllername + "=>MyRevenueCaseDetails=>RevenueCase.MyRevenueCaseDetails" + "@" + FirmId + "@" + User + "@" + UserCaseIdValue + "@" + PageSize + "@" + PageIndex + "@" + SortValue;
                db.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                return Json(Result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Get Myrevenue cases
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public JsonResult MyRevenueCases()
        {
            try
            {
                var FirmId = LoggedInUser.FirmId.ToString();
                var UserId = LoggedInUser.UserId.ToString();
                var User = prefixName + UserId;
                var UserCaseIdValue = QueryAES.UrlDecode(Request.Form["UserCaseIdValue"]);
                var revvCourtValue = QueryAES.UrlDecode(Request.Form["revvCourtValue"]);
                var StatusValue = QueryAES.UrlDecode(Request.Form["StatusValue"]);
                var mandalvalue = QueryAES.UrlDecode(Request.Form["mandalvalue"]);
                var janpadvalue = QueryAES.UrlDecode(Request.Form["janpadvalue"]);
                var tahsilvalue = QueryAES.UrlDecode(Request.Form["tahsilvalue"]);
                var revenueCourtValues = QueryAES.UrlDecode(Request.Form["revenueCourtValues"]);
                var Searchtextvalue = QueryAES.UrlDecode(Request.Form["Searchtextvalue"]);
                var Datefromvalue = QueryAES.UrlDecode(Request.Form["Datefromvalue"]);
                var Datetovalue = QueryAES.UrlDecode(Request.Form["Datetovalue"]);
                var istypevalue = QueryAES.UrlDecode(Request.Form["istypevalue"]);
                var PageSize = QueryAES.UrlDecode(Request.Form["PageSize"]);
                var PageIndex = QueryAES.UrlDecode(Request.Form["PageIndex"]);
                var SortValue = QueryAES.UrlDecode(Request.Form["SortValue"]);
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string joineduser = "";
                List<CWCaseList> casedeatils = new List<CWCaseList>();
                joineduser = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                var mykaselist = db.usp_CaseListForCWRevenue(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).ToList();
                var resid = RevenueCase.MyRevenueCases(FirmId, joineduser, revvCourtValue, UserCaseIdValue, StatusValue, mandalvalue,
                    janpadvalue, tahsilvalue, revenueCourtValues, Searchtextvalue, Datefromvalue, Datetovalue,
                    istypevalue, PageSize, PageIndex, SortValue, LoggedInUser.IsCaseWatchUser, LoggedInUser.UserName.ToString());
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    int tempusercaseid = Convert.ToInt32(data.data[i]["UserCaseId"]);
                    var matterIDCase = mykaselist.Where(x => x.UserCaseId == tempusercaseid).FirstOrDefault();
                    casedeatils.Add(new CWCaseList
                    {
                        CaseId = Convert.ToString(data.data[i]["UserCaseId"]),
                        Court = data.data[i]["vCourtName"],
                        CaseName = data.data[i]["vCaseName"],
                        vCaseNo = data.data[i]["vCaseNo"],
                        vCaseYear = data.data[i]["vCaseYear"],
                        MandalName = data.data[i]["MandalName"],
                        JanpadName = data.data[i]["JanpadName"],
                        TahsilName = data.data[i]["TahsilName"],
                        RevenueCourtName = data.data[i]["RevenueCourtName"],
                        DisposedDate = data.data[i]["vDisposedDate"],
                        NextHearing = data.data[i]["vorderDateFinal"],
                        ComputerCaseno = data.data[i]["vComputerCaseno"],
                        Nature = data.data[i]["vNature"],
                        AdmissionDate = data.data[i]["vFilingDate"],
                        Act = data.data[i]["vActDec"],
                        Status = data.data[i]["vStatus"],
                        RowId = data.data[i]["RowId"],
                        TotalRecord = data.data[i]["TotalRecord"],
                        UserCaseId = Convert.ToString(data.data[i]["UserCaseId"]),
                        MatterID = matterIDCase == null ? "" : matterIDCase.Id.ToString(),
                        MatterName = matterIDCase == null ? "" : matterIDCase.mname.ToString(),
                        cRefNo = Convert.ToString(data.data[i]["cRefNo"]),
                    });
                }
                var param = controllername + "=>MyRevenueCases=>RevenueCase.MyRevenueCases" + "@" + FirmId + "@" + User + "@" + UserCaseIdValue + "@" + PageSize + "@" + PageIndex + "@" + SortValue;
                db.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                return Json(casedeatils, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Revenue case list view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult RevenueCaseList()
        {
            return View();
        }
        /// <summary>
        /// Revenue case details view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult RevenueCaseDetails()
        {
            return View();
        }
        /// <summary>
        /// Exort revenue case list details in excel
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportToExcelRevenueCaseListDetails()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                string exlfilename = "RevenueMattersList_" + DateTime.Now;
                var FirmId = LoggedInUser.FirmId.ToString();
                var UserId = LoggedInUser.UserId.ToString();
                var User = prefixName + UserId;
                var UserCaseIdValue = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["UserCaseIdValue"]));
                var revvCourtValue = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["revvCourtValue"]));
                var StatusValue = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["StatusValue"]));
                var mandalvalue = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["mandalvalue"]));
                var janpadvalue = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["janpadvalue"]));
                var tahsilvalue = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["tahsilvalue"]));
                var revenueCourtValues = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["revenueCourtValues"]));
                var Searchtextvalue = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["Searchtextvalue"]));
                var Datefromvalue = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["Datefromvalue"]));
                var Datetovalue = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["Datetovalue"]));
                var istypevalue = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["istypevalue"]));
                var SortValue = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["SortValue"]));
                if (String.IsNullOrEmpty(UserCaseIdValue) || UserCaseIdValue == "null" || UserCaseIdValue == "0") { UserCaseIdValue = ""; }
                if (String.IsNullOrEmpty(revvCourtValue) || revvCourtValue == "null" || revvCourtValue == "0") { revvCourtValue = ""; }
                if (String.IsNullOrEmpty(StatusValue) || StatusValue == "null" || StatusValue == "0") { StatusValue = ""; }
                if (String.IsNullOrEmpty(mandalvalue) || mandalvalue == "null" || mandalvalue == "0") { mandalvalue = ""; }
                if (String.IsNullOrEmpty(janpadvalue) || janpadvalue == "null" || janpadvalue == "0") { janpadvalue = ""; }
                if (String.IsNullOrEmpty(tahsilvalue) || tahsilvalue == "null" || tahsilvalue == "0") { tahsilvalue = ""; }
                if (String.IsNullOrEmpty(revenueCourtValues) || revenueCourtValues == "null" || revenueCourtValues == "0") { revenueCourtValues = ""; }
                if (String.IsNullOrEmpty(Searchtextvalue) || Searchtextvalue == "null" || Searchtextvalue == "0") { Searchtextvalue = ""; }
                if (String.IsNullOrEmpty(Datefromvalue) || Datefromvalue == "null" || Datefromvalue == "0") { Datefromvalue = ""; }
                if (String.IsNullOrEmpty(Datetovalue) || Datetovalue == "null" || Datetovalue == "0") { Datetovalue = ""; }
                if (String.IsNullOrEmpty(SortValue) || SortValue == "null" || SortValue == "0") { SortValue = ""; }
                List<CWCaseList> casedeatils = new List<CWCaseList>();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                string search = "";
                search = Convert.ToString(HttpContext.Request.QueryString["search"]);
                int pagesize = 10, pageindex = 1;
                pageindex = Convert.ToInt32(HttpContext.Request.QueryString["PageIndex"]);
                pagesize = Convert.ToInt32(HttpContext.Request.QueryString["PageSize"]);
                var db = new LawPracticeEntities();
                string joineduser = "";
                joineduser = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                var mykaselist = db.usp_CaseListForCWRevenue(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).ToList();
                var resid = RevenueCase.MyRevenueCases(FirmId, joineduser, revvCourtValue, UserCaseIdValue, StatusValue,
                    mandalvalue, janpadvalue, tahsilvalue, revenueCourtValues, Searchtextvalue, Datefromvalue, Datetovalue,
                    istypevalue, pagesize.ToString(), pageindex.ToString(), SortValue, LoggedInUser.IsCaseWatchUser, LoggedInUser.UserName.ToString());
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    //string status = data.Status;
                    int tempusercaseid = Convert.ToInt32(data.data[i]["UserCaseId"]);
                    var matterIDCase = mykaselist.Where(x => x.UserCaseId == tempusercaseid).FirstOrDefault();
                    casedeatils.Add(new CWCaseList
                    {
                        CaseId = Convert.ToString(data.data[i]["UserCaseId"]),
                        Court = data.data[i]["vCourtName"],
                        CaseName = data.data[i]["vCaseName"],
                        vCaseNo = data.data[i]["vCaseNo"],
                        vCaseYear = data.data[i]["vCaseYear"],
                        MandalName = data.data[i]["MandalName"],
                        JanpadName = data.data[i]["JanpadName"],
                        TahsilName = data.data[i]["TahsilName"],
                        RevenueCourtName = data.data[i]["RevenueCourtName"],
                        DisposedDate = data.data[i]["vDisposedDate"],
                        NextHearing = data.data[i]["vorderDateFinal"],
                        ComputerCaseno = data.data[i]["vComputerCaseno"],
                        Nature = data.data[i]["Nature"],
                        AdmissionDate = data.data[i]["vFilingDate"],
                        Act = data.data[i]["vActDec"],
                        Status = data.data[i]["vStatus"],
                        RowId = data.data[i]["RowId"],
                        TotalRecord = data.data[i]["TotalRecord"],
                        UserCaseId = Convert.ToString(data.data[i]["UserCaseId"]),
                        MatterID = matterIDCase == null ? "" : matterIDCase.Id.ToString(),
                        MatterName = matterIDCase == null ? "" : matterIDCase.mname.ToString(),
                        cRefNo = Convert.ToString(data.data[i]["cRefNo"]),
                    });
                }
                var trialList = (from ob in casedeatils
                                 select new
                                 {
                                     CaseNo = ob.Court == "Lucknow" ? ob.vCaseNo + "/" + ob.vCaseYear + (ob.cRefNo == null ? "" : " (" + ob.cRefNo + ")") : ob.vCaseNo + (ob.cRefNo == null || ob.cRefNo == "" ? "" : " (" + ob.cRefNo + ")"),
                                     CaseName = ob.Court == "Lucknow" ? ob.CaseName + " " + ob.vCaseNo + "/" + ob.vCaseYear : ob.CaseName + " " + ob.vCaseNo,
                                     Court = ob.Court,
                                     MandalName = ob.MandalName,
                                     JanpadName = ob.JanpadName,
                                     TahsilName = ob.TahsilName,
                                     RevenueCourtName = (ob.RevenueCourtName == null || ob.RevenueCourtName == "") ? "" : Regex.Replace(ob.RevenueCourtName, "<.*?>", string.Empty),
                                     DisposedDate = ob.DisposedDate,
                                     NextHearing = ob.NextHearing,
                                     ComputerCaseno = ob.ComputerCaseno,
                                     Nature = ob.Nature,
                                     AdmissionDate = ob.AdmissionDate,
                                     Act = ob.Act,
                                     Status = ob.Status,
                                 }).ToList();
                var gv = new GridView();
                gv.DataSource = trialList;
                gv.DataBind();
                gv.HeaderStyle.BackColor = Color.Gray;
                gv.HeaderStyle.ForeColor = Color.White;
                Response.ClearContent();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", "attachment; filename=" + exlfilename + ".xls");
                Response.ContentType = "application/ms-excel";
                Response.Charset = "";
                StringWriter objStringWriter = new StringWriter();
                HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                gv.RenderControl(objHtmlTextWriter);
                Response.Output.Write(objStringWriter.ToString());
                Response.Flush();
                Response.End();
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                Response.Redirect("/home/Error");
            }
        }
        /// <summary>
        /// Export revenue case list details in pdf
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportToPDFRevenueCaseListDetails()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                string filename = "RevenueMattersList.pdf";
                var FirmId = LoggedInUser.FirmId.ToString();
                var UserId = LoggedInUser.UserId.ToString();
                var User = prefixName + UserId;
                var UserCaseIdValue = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["UserCaseIdValue"]));
                var revvCourtValue = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["revvCourtValue"]));
                var StatusValue = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["StatusValue"]));
                var mandalvalue = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["mandalvalue"]));
                var janpadvalue = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["janpadvalue"]));
                var tahsilvalue = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["tahsilvalue"]));
                var revenueCourtValues = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["revenueCourtValues"]));
                var Searchtextvalue = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["Searchtextvalue"]));
                var Datefromvalue = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["Datefromvalue"]));
                var Datetovalue = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["Datetovalue"]));
                var istypevalue = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["istypevalue"]));
                var SortValue = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["SortValue"]));
                if (String.IsNullOrEmpty(UserCaseIdValue) || UserCaseIdValue == "null" || UserCaseIdValue == "0") { UserCaseIdValue = ""; }
                if (String.IsNullOrEmpty(revvCourtValue) || revvCourtValue == "null" || revvCourtValue == "0") { revvCourtValue = ""; }
                if (String.IsNullOrEmpty(StatusValue) || StatusValue == "null" || StatusValue == "0") { StatusValue = ""; }
                if (String.IsNullOrEmpty(mandalvalue) || mandalvalue == "null" || mandalvalue == "0") { mandalvalue = ""; }
                if (String.IsNullOrEmpty(janpadvalue) || janpadvalue == "null" || janpadvalue == "0") { janpadvalue = ""; }
                if (String.IsNullOrEmpty(tahsilvalue) || tahsilvalue == "null" || tahsilvalue == "0") { tahsilvalue = ""; }
                if (String.IsNullOrEmpty(revenueCourtValues) || revenueCourtValues == "null" || revenueCourtValues == "0") { revenueCourtValues = ""; }
                if (String.IsNullOrEmpty(Searchtextvalue) || Searchtextvalue == "null" || Searchtextvalue == "0") { Searchtextvalue = ""; }
                if (String.IsNullOrEmpty(Datefromvalue) || Datefromvalue == "null" || Datefromvalue == "0") { Datefromvalue = ""; }
                if (String.IsNullOrEmpty(Datetovalue) || Datetovalue == "null" || Datetovalue == "0") { Datetovalue = ""; }
                if (String.IsNullOrEmpty(SortValue) || SortValue == "null" || SortValue == "0") { SortValue = ""; }
                List<CWCaseList> casedeatils = new List<CWCaseList>();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                string search = "";
                search = Convert.ToString(HttpContext.Request.QueryString["search"]);
                int pagesize = 10, pageindex = 1;
                pageindex = Convert.ToInt32(HttpContext.Request.QueryString["pagenum"]);
                pagesize = Convert.ToInt32(HttpContext.Request.QueryString["pagesize"]);
                string joineduser = "";
                joineduser = db1.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                var mykaselist = db1.usp_CaseListForCWRevenue(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).ToList();
                var Iflag = 0;
                if (LoggedInUser.RoleId == 1)
                {
                    Iflag = 1;
                }
                string strtemplate = "";
                var mykaselogopath = Server.MapPath("~\\Manupanel\\img\\top-logopdf.png");
                var firmlogopath = "";
                var firmlogo = db1.usp_GetHomePageData(Guid.Parse(LoggedInUser.FirmId.ToString())).FirstOrDefault();
                if (firmlogo != null)
                {
                    firmlogopath = Server.MapPath("~\\" + firmlogo.LogoPath.Replace("/", "\\"));
                }
                strtemplate += "<style> table { overflow: visible !important; }";
                strtemplate += " thead { display:table-header-group }";
                strtemplate += " tfoot { display: table-row-group }";
                strtemplate += " tr { page-break-inside:avoid }</style>";
                strtemplate += "<div style='width:100%'>";
                strtemplate += "<div style='float:left;width:25%'>";
                strtemplate += "<img src='" + mykaselogopath + "' width='132px' height='56px;'></img>";
                strtemplate += "</div>";
                strtemplate += "<div style='float:left;width:50%'>";
                strtemplate += "<center><p>&nbsp;</p></center>";
                strtemplate += "</div>";
                strtemplate += "<div style='float:right;'>";
                strtemplate += "<img src='" + firmlogopath + "' width='132px' height='56px;'></img>";
                strtemplate += "</div>";
                strtemplate += "</div>";
                strtemplate += "<br><br><br>";
                strtemplate += "<center>";
                strtemplate += "<hr style='border: 1px solid #65cebd; clear:both;'>";
                strtemplate += " <p></p>";
                strtemplate += "<center><p><strong>Mykase-Revenue matters List</strong><span style='float:right'>Date: " + String.Format("{0:dd MMM yyyy}", DateTime.Now) + "</span></p></hr>";
                strtemplate += " <p></p>";
                var addfClient = new WebClient();
                var resid = RevenueCase.MyRevenueCases(FirmId, joineduser, revvCourtValue, UserCaseIdValue, StatusValue, mandalvalue,
                    janpadvalue, tahsilvalue, revenueCourtValues, Searchtextvalue, Datefromvalue, Datetovalue,
                    istypevalue, pagesize.ToString(), pageindex.ToString(), SortValue, LoggedInUser.IsCaseWatchUser, LoggedInUser.UserName.ToString());
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    //string status = data.Status;
                    int tempusercaseid = Convert.ToInt32(data.data[i]["UserCaseId"]);
                    var matterIDCase = mykaselist.Where(x => x.UserCaseId == tempusercaseid).FirstOrDefault();
                    casedeatils.Add(new CWCaseList
                    {
                        CaseId = Convert.ToString(data.data[i]["UserCaseId"]),
                        Court = data.data[i]["vCourtName"],
                        CaseName = data.data[i]["vCaseName"],
                        vCaseNo = data.data[i]["vCaseNo"],
                        vCaseYear = data.data[i]["vCaseYear"],
                        MandalName = data.data[i]["MandalName"],
                        JanpadName = data.data[i]["JanpadName"],
                        TahsilName = data.data[i]["TahsilName"],
                        RevenueCourtName = data.data[i]["RevenueCourtName"],
                        DisposedDate = data.data[i]["vDisposedDate"],
                        Status = data.data[i]["vStatus"],
                        RowId = data.data[i]["RowId"],
                        TotalRecord = data.data[i]["TotalRecord"],
                        UserCaseId = Convert.ToString(data.data[i]["UserCaseId"]),
                        MatterID = matterIDCase == null ? "" : matterIDCase.Id.ToString(),
                        MatterName = matterIDCase == null ? "" : matterIDCase.mname.ToString(),
                        cRefNo = Convert.ToString(data.data[i]["cRefNo"]),
                    });
                }
                var trialList = (from ob in casedeatils
                                 select new
                                 {
                                     CaseNo = ob.Court == "Lucknow" ? ob.vCaseNo + "/" + ob.vCaseYear + (ob.cRefNo == null ? "" : " (" + ob.cRefNo + ")") : ob.vCaseNo + (ob.cRefNo == null || ob.cRefNo == "" ? "" : " (" + ob.cRefNo + ")"),
                                     CaseName = ob.Court == "Lucknow" ? ob.CaseName + " " + ob.vCaseNo + "/" + ob.vCaseYear : ob.CaseName + " " + ob.vCaseNo,
                                     Court = ob.Court,
                                     MandalName = ob.MandalName,
                                     JanpadName = ob.JanpadName,
                                     TahsilName = ob.TahsilName,
                                     RevenueCourtName = (ob.RevenueCourtName == null || ob.RevenueCourtName == "") ? "" : Regex.Replace(ob.RevenueCourtName, "<.*?>", string.Empty),
                                     DisposedDate = ob.DisposedDate,
                                     NextHearing = ob.NextHearing,
                                     ComputerCaseno = ob.ComputerCaseno,
                                     Nature = ob.Nature,
                                     AdmissionDate = ob.AdmissionDate,
                                     Act = ob.Act,
                                     Status = ob.Status,
                                 }).ToList();
                strtemplate += " <meta http-equiv='content-type' content='text/html;charset=utf-8' />";
                strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                strtemplate += "  <thead><tr> ";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Case No</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Case Name</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Court</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Mandal Name </th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Janpad Name</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Tahsil Name</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Revenue Court Name</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>DisposedDate</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Status</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Next Hearing</th>";
                strtemplate += "</tr></thead><tbody>";
                if (trialList != null)
                {
                    foreach (var idata in trialList)
                    {
                        strtemplate += "<tr><td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.CaseNo + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.CaseName + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'  style='padding:0 5px;' >" + idata.Court + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.MandalName + "  </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.JanpadName + "  </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.TahsilName + "  </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.RevenueCourtName + "  </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + String.Format("{0:dd MMM yyyy}", idata.DisposedDate) + "  </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.Status + "  </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + String.Format("{0:dd MMM yyyy}", idata.NextHearing) + "  </td></tr>";
                    }
                    strtemplate += "</tbody></table>";
                }
                else
                {
                }
                string folderPath = Server.MapPath("~/Documents/ExportData/Pdf/" + LoggedInUser.FirmId.ToString() + "/" + LoggedInUser.UserId.ToString() + "/");
                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }
                var htmlToPdf = new NReco.PdfGenerator.HtmlToPdfConverter();
                htmlToPdf.Orientation = NReco.PdfGenerator.PageOrientation.Landscape;
                var pageMargins = new NReco.PdfGenerator.PageMargins { Bottom = 10, Left = 05, Right = 05, Top = 05 };
                htmlToPdf.Margins = pageMargins;
                htmlToPdf.PageFooterHtml = "<div style='width:50%;float:left'><img style='padding:0 0 0 5px;' src='" + Server.MapPath("~\\Manupanel\\img\\powerby-logo.png") + "' width='140px' height='30px;'></img></div>" +
                    "<div style='width:50%;float:left;padding:5px 0 0 0;'>  Page <span class='page'></span> of  <span class='topage'></span></div>";
                var pdfBytes = htmlToPdf.GeneratePdf(strtemplate);
                var pffth = Server.MapPath("~\\Documents\\ExportData\\Pdf\\" + LoggedInUser.FirmId.ToString() + "\\" + LoggedInUser.UserId.ToString() + "\\" + filename);
                System.IO.File.WriteAllBytes(pffth, pdfBytes);
                Response.Clear();
                Response.ContentEncoding = System.Text.Encoding.UTF8;
                System.IO.MemoryStream ms = new System.IO.MemoryStream(pdfBytes);
                Response.ContentType = "application/pdf";
                Response.AddHeader("content-disposition", "attachment;filename=" + filename + "");
                Response.Buffer = true;
                ms.WriteTo(Response.OutputStream);
                Response.End();
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                Response.Redirect("/home/Error");
            }
        }
        /// <summary>
        /// Get revenue case list orders
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public JsonResult RevenueListCaseOrders()
        {
            var db2 = new LawPracticeEntities();
            var strdt = QueryAES.UrlDecode(Request.Form["id"]);
            string username = "";
            var data2 = db2.FindCaseUsername(Convert.ToInt32(strdt), LoggedInUser.FirmId.ToString()).ToList();
            if (data2 != null)
            {
                foreach (var datas in data2)
                {
                    username = WebConfigurationManager.AppSettings["matteridname"] + datas;
                }
                var data22 = db2.Usp_GetCasewatchCaseMapDetails(LoggedInUser.FirmId.ToString(), strdt).FirstOrDefault();
                if (data22 != null)
                {
                    var casecreateuser = data22.UserId;
                    if (!String.IsNullOrEmpty(casecreateuser))
                    {
                        username = WebConfigurationManager.AppSettings["matteridname"] + casecreateuser;
                    }
                }
                if (data22.IsRevenueCourt == 1)
                {
                    var resid = RevenueCase.ShowRevenueCaseOrdersById(LoggedInUser.FirmId.ToString(), username, strdt, LoggedInUser.IsCaseWatchUser, LoggedInUser.UserName.ToString());
                    JObject jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    List<CaseWatchOrder> CaseWatchOrder = new List<CaseWatchOrder>();
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        string status = data.Status;
                        string Message = data.Message;
                        string Id = data.data[0].Id;
                        string Order_Date = data.data[i].OrderDate;
                        string Status = data.data[i].Status;
                        string Filename = data.data[i].Filename;
                        string Filepath = data.data[i].Filepath;
                        string OrderData = data.data[i].OrderData;
                        string DisputeLandDetails = data.data[i].DisputeLandDetails;
                        if (Filepath == "File Not Found")
                        {
                            Filepath = "";
                        }
                        else
                        {
                            Filepath = Convert.ToBase64String(QueryAES.EncryptAes(Filepath.ToString()));
                        }
                        // Add parts to the list.
                        CaseWatchOrder.Add(new CaseWatchOrder { Id = Id, Order_Date = Order_Date, Status = Status, Filename = Filename, Filepath = Filepath });
                    }
                    return Json(CaseWatchOrder, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                    //add login data
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        accesstoken = "mykase123456789abcdef",
                        userid = username,
                        caseid = strdt,
                    };
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/ShowMykaseDetailsById"), "POST", builders);
                    try
                    {
                        var db1 = new LawPracticeEntities();
                        var param = apiUrl + "FirmController=>ListCaseOrders=>/API/Search/ShowMykaseDetailsById" + "@" + builders;
                        db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
                    }
                    catch
                    {
                    }
                    JObject jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    List<CaseWatchOrder> CaseWatchOrder = new List<CaseWatchOrder>();
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        string status = data.Status;
                        string Message = data.Message;
                        string Id = data.data[0].Id;
                        string Order_Date = data.data[i].Order_Date;
                        string Status = data.data[i].Status;
                        string Filename = data.data[i].Filename;
                        string Filepath = data.data[i].Filepath;
                        if (Filepath == "File Not Found")
                        {
                            Filepath = "";
                        }
                        else
                        {
                            Filepath = Convert.ToBase64String(QueryAES.EncryptAes(Filepath.ToString()));
                        }
                        // Add parts to the list.
                        CaseWatchOrder.Add(new CaseWatchOrder { Id = Id, Order_Date = Order_Date, Status = Status, Filename = Filename, Filepath = Filepath });
                    }
                    return Json(CaseWatchOrder, JsonRequestBehavior.AllowGet);
                }
            }
            else
            {
                return Json("", JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Cause list revenue view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult CauseListRevenue()
        {
            return View();
        }
        /// <summary>
        /// All CW Cause List Details Revenue
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public JsonResult AllCWCauseListDetailsRevenue()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var search = "";
                var pageno = QueryAES.UrlDecode(Request.Form["pageno"]);
                var pagesizes = QueryAES.UrlDecode(Request.Form["pagesize"]);
                string joineduser = "";
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                var db = new LawPracticeEntities();
                joineduser = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var resid = AddCaseCaseWatch.MykaseAllCauselistDataRevenue(joineduser, search, pageno, pagesizes, apiUrl);
                JObject jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                List<MyKaseRevenueCauselist> CauseList = new List<MyKaseRevenueCauselist>();
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string status = data.Status;
                    string Message = data.Message;
                    string RevenueCourtName = data.data[i]["RevenueCourtName"];
                    string JanpadName = data.data[i]["JanpadName"];
                    string MandalName = data.data[i]["MandalName"];
                    string TahsilName = data.data[i]["TahsilName"];
                    string vCaseName = data.data[i]["vCaseName"];
                    string vCaseNo = data.data[i]["vCaseNo"];
                    string vCauselistDate = data.data[i]["vCauselistDate"];
                    string Filetext = data.data[i]["Filetext"];
                    var RowId = data.data[i]["RowId"];
                    string TotalRecord = data.data[i]["TotalRecord"];
                    string caseid = data.data[i].caseid;
                    string usercaseid = data.data[i].usercaseid;
                    // Add parts to the list.
                    CauseList.Add(new MyKaseRevenueCauselist
                    {
                        RevenueCourtName = RevenueCourtName,
                        JanpadName = JanpadName,
                        MandalName = MandalName,
                        TahsilName = TahsilName,
                        vCaseName = vCaseName,
                        vCaseNo = vCaseNo,
                        vCauselistDate = vCauselistDate,
                        Filetext = Filetext,
                        RowId = RowId,
                        TotalRecord = TotalRecord,
                        caseid = caseid,
                        usercaseid = usercaseid
                    });
                }
                return Json(CauseList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Export All CW Cause List Revenue details in excel
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportToExcelAllCWCauseListDetailsRevenue()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                string exlfilename = "CauseList_" + DateTime.Now;
                var casedate = QueryAES.UrlDecode(Request.QueryString["casedate"]);
                var court = QueryAES.UrlDecode(Request.QueryString["court"]);
                var pageno = QueryAES.UrlDecode(Request.QueryString["pageno"]);
                var pagesizes = QueryAES.UrlDecode(Request.QueryString["pagesize"]);
                var joineduser = "";
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                var db = new LawPracticeEntities();
                joineduser = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var search = "";
                var resid = AddCaseCaseWatch.MykaseAllCauselistDataRevenue(joineduser, search, pageno, pagesizes, apiUrl);
                JObject jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                List<MyKaseRevenueCauselistExport> CauseList = new List<MyKaseRevenueCauselistExport>();
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string status = data.Status;
                    string Message = data.Message;
                    string RevenueCourtName = data.data[i]["RevenueCourtName"];
                    string JanpadName = data.data[i]["JanpadName"];
                    string MandalName = data.data[i]["MandalName"];
                    string TahsilName = data.data[i]["TahsilName"];
                    string vCaseName = data.data[i]["vCaseName"];
                    string vCaseNo = data.data[i]["vCaseNo"];
                    string vCauselistDate = data.data[i]["vCauselistDate"];
                    string Filetext = data.data[i]["Filetext"];
                    var RowId = data.data[i]["RowId"];
                    string TotalRecord = data.data[i]["TotalRecord"];
                    string caseid = data.data[i].caseid;
                    string usercaseid = data.data[i].usercaseid;
                    // Add parts to the list.
                    CauseList.Add(new MyKaseRevenueCauselistExport
                    {
                        RevenueCourtName = RevenueCourtName,
                        JanpadName = JanpadName,
                        MandalName = MandalName,
                        TahsilName = TahsilName,
                        CaseName = vCaseName,
                        CaseNo = vCaseNo,
                        CauseListDate = vCauselistDate,
                        CauseListDetail = Filetext,
                    });
                }
                var gv = new GridView();
                gv.DataSource = CauseList;
                gv.DataBind();
                gv.HeaderStyle.BackColor = Color.Gray;
                gv.HeaderStyle.ForeColor = Color.White;
                Response.ClearContent();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", "attachment; filename=" + exlfilename + ".xls");
                Response.ContentType = "application/ms-excel";
                Response.Charset = "";
                StringWriter objStringWriter = new StringWriter();
                HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                gv.RenderControl(objHtmlTextWriter);
                Response.Output.Write(objStringWriter.ToString());
                Response.Flush();
                Response.End();
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                Response.Redirect("/home/Error");
            }
        }
        /// <summary>
        /// Export All CW Cause List Revenue details in pdf
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportToPDFAllCWCauseListDetailsRevenue()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                string filename = "CauseList.pdf";
                var court = QueryAES.UrlDecode(Request.QueryString["court"]);
                var pageno = QueryAES.UrlDecode(Request.QueryString["pageno"]);
                var pagesizes = QueryAES.UrlDecode(Request.QueryString["pagesize"]);
                string firmid = LoggedInUser.FirmId.ToString();
                string userid = LoggedInUser.UserId.ToString();
                string strtemplate = "";
                var mykaselogopath = Server.MapPath("~\\Manupanel\\img\\top-logopdf.png");
                var firmlogopath = "";
                var firmlogo = db1.usp_GetHomePageData(Guid.Parse(LoggedInUser.FirmId.ToString())).FirstOrDefault();
                if (firmlogo != null)
                {
                    firmlogopath = Server.MapPath("~\\" + firmlogo.LogoPath.Replace("/", "\\"));
                }
                strtemplate = "<meta http-equiv='content-type' content='text/html; charset=utf-8'>";
                strtemplate += "<style> table { overflow: visible !important; }";
                strtemplate += " thead { display:table-header-group }";
                strtemplate += " tfoot { display: table-row-group }";
                strtemplate += " tr { page-break-inside:avoid }</style>";
                strtemplate += "<div style='width:100%'>";
                strtemplate += "<div style='float:left;width:25%'>";
                strtemplate += "<img src='" + mykaselogopath + "' width='132px' height='56px;'></img>";
                strtemplate += "</div>";
                strtemplate += "<div style='float:left;width:50%'>";
                strtemplate += "<center><p>&nbsp;</p></center>";
                strtemplate += "</div>";
                strtemplate += "<div style='float:right;'>";
                strtemplate += "<img src='" + firmlogopath + "' width='132px' height='56px;'></img>";
                strtemplate += "</div>";
                strtemplate += "</div>";
                strtemplate += "<br><br><br>";
                strtemplate += "<center>";
                strtemplate += "<hr style='border: 1px solid #65cebd; clear:both;'>";
                strtemplate += " <p></p>";
                strtemplate += "<center><p><strong>Mykase-Cause List</strong><span style='float:right'>Date: " + String.Format("{0:dd MMM yyyy}", DateTime.Now) + "</span></p></hr>";
                strtemplate += " <p></p>";
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                //add login data
                var addfClient = new WebClient();
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                var joineduser = db1.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                var search = "";
                var resid = AddCaseCaseWatch.MykaseAllCauselistDataRevenue(joineduser, search, pageno, pagesizes, apiUrl);
                JObject jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                List<MyKaseRevenueCauselistExport> CauseList = new List<MyKaseRevenueCauselistExport>();
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string status = data.Status;
                    string Message = data.Message;
                    string RevenueCourtName = data.data[i]["RevenueCourtName"];
                    string JanpadName = data.data[i]["JanpadName"];
                    string MandalName = data.data[i]["MandalName"];
                    string TahsilName = data.data[i]["TahsilName"];
                    string vCaseName = data.data[i]["vCaseName"];
                    string vCaseNo = data.data[i]["vCaseNo"];
                    string vCauselistDate = data.data[i]["vCauselistDate"];
                    string Filetext = data.data[i]["Filetext"];
                    var RowId = data.data[i]["RowId"];
                    string TotalRecord = data.data[i]["TotalRecord"];
                    string caseid = data.data[i].caseid;
                    string usercaseid = data.data[i].usercaseid;
                    // Add parts to the list.
                    CauseList.Add(new MyKaseRevenueCauselistExport
                    {
                        RevenueCourtName = RevenueCourtName,
                        JanpadName = JanpadName,
                        MandalName = MandalName,
                        TahsilName = TahsilName,
                        CaseName = vCaseName,
                        CaseNo = vCaseNo,
                        CauseListDate = vCauselistDate,
                        CauseListDetail = Filetext,
                    });
                }
                strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                strtemplate += "  <thead><tr> ";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Revenue Court Name</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Janpad Name</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Mandal Name</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Tahsil Name</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>CaseName</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Case No</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>CauseList Date</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>CauseList Detail</th>";
                strtemplate += "</tr></thead><tbody>";
                if (CauseList != null)
                {
                    foreach (MyKaseRevenueCauselistExport idata in CauseList)
                    {
                        strtemplate += "<tr><td height = '20' align = 'left' valign ='top'  style='padding:0 5px;' >" + idata.RevenueCourtName + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.JanpadName + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.MandalName + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.TahsilName + "  </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.CaseName + "  </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.CaseNo + "  </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + String.Format("{0:dd MMM yyyy}", idata.CauseListDate) + "  </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.CauseListDetail + "  </td></tr>";
                        //strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + (idata.TempField.ToString() == "cactivity" ? "Custom Activity" : idata.TempField) + " </td></tr>";
                    }
                    strtemplate += "</tbody></table>";
                }
                else
                {
                }
                string folderPath = Server.MapPath("~/Documents/ExportData/Pdf/" + firmid + "/" + userid + "/");
                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }
                var htmlToPdf = new NReco.PdfGenerator.HtmlToPdfConverter();
                htmlToPdf.Orientation = NReco.PdfGenerator.PageOrientation.Landscape;
                var pageMargins = new NReco.PdfGenerator.PageMargins { Bottom = 10, Left = 05, Right = 05, Top = 05 };
                htmlToPdf.Margins = pageMargins;
                htmlToPdf.PageFooterHtml = "<div style='width:50%;float:left'><img style='padding:0 0 0 5px;' src='" + Server.MapPath("~\\Manupanel\\img\\powerby-logo.png") + "' width='140px' height='30px;'></img></div>" +
                    "<div style='width:50%;float:left;padding:5px 0 0 0;'>  Page <span class='page'></span> of  <span class='topage'></span></div>";
                var pdfBytes = htmlToPdf.GeneratePdf(strtemplate);
                var pffth = Server.MapPath("~\\Documents\\ExportData\\Pdf\\" + firmid + "\\" + userid + "\\" + filename);
                System.IO.File.WriteAllBytes(pffth, pdfBytes);
                Response.Clear();
                System.IO.MemoryStream ms = new System.IO.MemoryStream(pdfBytes);
                Response.ContentType = "application/pdf";
                Response.AddHeader("content-disposition", "attachment;filename=" + filename + "");
                Response.Buffer = true;
                ms.WriteTo(Response.OutputStream);
                Response.End();
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                Response.Redirect("/home/Error");
            }
        }
        /// <summary>
        /// Get CW Cause List Revenue Details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public JsonResult CWCauseListDetailsRevenue()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var casedate = QueryAES.UrlDecode(Request.Form["casedate"]);
                var court = QueryAES.UrlDecode(Request.Form["court"]);
                var pageno = QueryAES.UrlDecode(Request.Form["pageno"]);
                var pagesizes = QueryAES.UrlDecode(Request.Form["pagesize"]);
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                //add login data
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                var db = new LawPracticeEntities();
                var joineduser = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                var search = "";
                var resid = AddCaseCaseWatch.MyKaseDailyCauselistRevenue(joineduser, casedate, search, pageno, pagesizes, apiUrl);
                JObject jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                List<MyKaseRevenueCauselist> CauseList = new List<MyKaseRevenueCauselist>();
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string status = data.Status;
                    string Message = data.Message;
                    string RevenueCourtName = data.data[i]["RevenueCourtName"];
                    string JanpadName = data.data[i]["JanpadName"];
                    string MandalName = data.data[i]["MandalName"];
                    string TahsilName = data.data[i]["TahsilName"];
                    string vCaseName = data.data[i]["vCaseName"];
                    string vCaseNo = data.data[i]["vCaseNo"];
                    string vCauselistDate = data.data[i]["vCauselistDate"];
                    string Filetext = data.data[i]["Filetext"];
                    var RowId = data.data[i]["RowId"];
                    string TotalRecord = data.data[i]["TotalRecord"];
                    string caseid = data.data[i].caseid;
                    string usercaseid = data.data[i].usercaseid;
                    // Add parts to the list.
                    CauseList.Add(new MyKaseRevenueCauselist
                    {
                        RevenueCourtName = RevenueCourtName,
                        JanpadName = JanpadName,
                        MandalName = MandalName,
                        TahsilName = TahsilName,
                        vCaseName = vCaseName,
                        vCaseNo = vCaseNo,
                        vCauselistDate = vCauselistDate,
                        Filetext = Filetext,
                        RowId = RowId,
                        TotalRecord = TotalRecord,
                        caseid = caseid,
                        usercaseid = usercaseid
                    });
                }
                return Json(CauseList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Export  CW Cause List Revenue Details in excel
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportToExcelCWCauseListDetailsRevenue()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                string exlfilename = "CauseList_" + DateTime.Now;
                var casedate = QueryAES.UrlDecode(Request.QueryString["casedate"]);
                var court = QueryAES.UrlDecode(Request.QueryString["court"]);
                var pageno = QueryAES.UrlDecode(Request.QueryString["pageno"]);
                var pagesizes = QueryAES.UrlDecode(Request.QueryString["pagesize"]);
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                //add login data
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                var db = new LawPracticeEntities();
                var joineduser = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                var search = "";
                var resid = AddCaseCaseWatch.MyKaseDailyCauselistRevenue(joineduser, casedate, search, pageno, pagesizes, apiUrl);
                JObject jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                List<MyKaseRevenueCauselistExport> CauseList = new List<MyKaseRevenueCauselistExport>();
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string status = data.Status;
                    string Message = data.Message;
                    string RevenueCourtName = data.data[i]["RevenueCourtName"];
                    string JanpadName = data.data[i]["JanpadName"];
                    string MandalName = data.data[i]["MandalName"];
                    string TahsilName = data.data[i]["TahsilName"];
                    string vCaseName = data.data[i]["vCaseName"];
                    string vCaseNo = data.data[i]["vCaseNo"];
                    string vCauselistDate = data.data[i]["vCauselistDate"];
                    string Filetext = data.data[i]["Filetext"];
                    var RowId = data.data[i]["RowId"];
                    string TotalRecord = data.data[i]["TotalRecord"];
                    string caseid = data.data[i].caseid;
                    string usercaseid = data.data[i].usercaseid;
                    // Add parts to the list.
                    CauseList.Add(new MyKaseRevenueCauselistExport
                    {
                        RevenueCourtName = RevenueCourtName,
                        JanpadName = JanpadName,
                        MandalName = MandalName,
                        TahsilName = TahsilName,
                        CaseName = vCaseName,
                        CaseNo = vCaseNo,
                        CauseListDate = vCauselistDate,
                        CauseListDetail = Filetext,
                    });
                }
                var gv = new GridView();
                gv.DataSource = CauseList;
                gv.DataBind();
                gv.HeaderStyle.BackColor = Color.Gray;
                gv.HeaderStyle.ForeColor = Color.White;
                Response.ClearContent();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", "attachment; filename=" + exlfilename + ".xls");
                Response.ContentType = "application/ms-excel";
                Response.Charset = "";
                StringWriter objStringWriter = new StringWriter();
                HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                gv.RenderControl(objHtmlTextWriter);
                Response.Output.Write(objStringWriter.ToString());
                Response.Flush();
                Response.End();
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                Response.Redirect("/home/Error");
            }
        }
        /// <summary>
        /// Export  CW Cause List Revenue Details in pdf
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportToPDFCWCauseListDetailsRevenue()
        {
            var db = new LawPracticeEntities();
            try
            {
                string filename = "CauseList.pdf";
                var casedate = QueryAES.UrlDecode(Request.QueryString["casedate"]);
                var court = QueryAES.UrlDecode(Request.QueryString["court"]);
                var pageno = QueryAES.UrlDecode(Request.QueryString["pageno"]);
                var pagesizes = QueryAES.UrlDecode(Request.QueryString["pagesize"]);
                string firmid = LoggedInUser.FirmId.ToString();
                string userid = LoggedInUser.UserId.ToString();
                string strtemplate = "";
                var mykaselogopath = Server.MapPath("~\\Manupanel\\img\\top-logopdf.png");
                var firmlogopath = "";
                var firmlogo = db.usp_GetHomePageData(Guid.Parse(LoggedInUser.FirmId.ToString())).FirstOrDefault();
                if (firmlogo != null)
                {
                    firmlogopath = Server.MapPath("~\\" + firmlogo.LogoPath.Replace("/", "\\"));
                }
                strtemplate = "<meta http-equiv='content-type' content='text/html; charset=utf-8'>";
                strtemplate += "<style> table { overflow: visible !important; }";
                strtemplate += " thead { display:table-header-group }";
                strtemplate += " tfoot { display: table-row-group }";
                strtemplate += " tr { page-break-inside:avoid }</style>";
                strtemplate += "<div style='width:100%'>";
                strtemplate += "<div style='float:left;width:25%'>";
                strtemplate += "<img src='" + mykaselogopath + "' width='132px' height='56px;'></img>";
                strtemplate += "</div>";
                strtemplate += "<div style='float:left;width:50%'>";
                strtemplate += "<center><p>&nbsp;</p></center>";
                strtemplate += "</div>";
                strtemplate += "<div style='float:right;'>";
                strtemplate += "<img src='" + firmlogopath + "' width='132px' height='56px;'></img>";
                strtemplate += "</div>";
                strtemplate += "</div>";
                strtemplate += "<br><br><br>";
                strtemplate += "<center>";
                strtemplate += "<hr style='border: 1px solid #65cebd; clear:both;'>";
                strtemplate += " <p></p>";
                strtemplate += "<center><p><strong>Mykase-Cause List</strong><span style='float:right'>Date: " + String.Format("{0:dd MMM yyyy}", DateTime.Now) + "</span></p></hr>";
                strtemplate += " <p></p>";
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                //add login data
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                var joineduser = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                var search = "";
                var resid = AddCaseCaseWatch.MyKaseDailyCauselistRevenue(joineduser, casedate, search, pageno, pagesizes, apiUrl);
                JObject jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                List<MyKaseRevenueCauselistExport> CauseList = new List<MyKaseRevenueCauselistExport>();
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string status = data.Status;
                    string Message = data.Message;
                    string RevenueCourtName = data.data[i]["RevenueCourtName"];
                    string JanpadName = data.data[i]["JanpadName"];
                    string MandalName = data.data[i]["MandalName"];
                    string TahsilName = data.data[i]["TahsilName"];
                    string vCaseName = data.data[i]["vCaseName"];
                    string vCaseNo = data.data[i]["vCaseNo"];
                    string vCauselistDate = data.data[i]["vCauselistDate"];
                    string Filetext = data.data[i]["Filetext"];
                    var RowId = data.data[i]["RowId"];
                    string TotalRecord = data.data[i]["TotalRecord"];
                    string caseid = data.data[i].caseid;
                    string usercaseid = data.data[i].usercaseid;
                    // Add parts to the list.
                    CauseList.Add(new MyKaseRevenueCauselistExport
                    {
                        RevenueCourtName = RevenueCourtName,
                        JanpadName = JanpadName,
                        MandalName = MandalName,
                        TahsilName = TahsilName,
                        CaseName = vCaseName,
                        CaseNo = vCaseNo,
                        CauseListDate = vCauselistDate,
                        CauseListDetail = Filetext,
                    });
                }
                strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                strtemplate += "  <thead><tr> ";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Revenue Court Name</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Janpad Name</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Mandal Name</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Tahsil Name</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>CaseName</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Case No</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>CauseList Date</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>CauseList Detail</th>";
                strtemplate += "</tr></thead><tbody>";
                if (CauseList != null)
                {
                    foreach (MyKaseRevenueCauselistExport idata in CauseList)
                    {
                        strtemplate += "<tr><td height = '20' align = 'left' valign ='top'  style='padding:0 5px;' >" + idata.RevenueCourtName + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.JanpadName + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.MandalName + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.TahsilName + "  </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.CaseName + "  </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.CaseNo + "  </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + String.Format("{0:dd MMM yyyy}", idata.CauseListDate) + "  </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.CauseListDetail + "  </td></tr>";
                        //strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + (idata.TempField.ToString() == "cactivity" ? "Custom Activity" : idata.TempField) + " </td></tr>";
                    }
                    strtemplate += "</tbody></table>";
                }
                else
                {
                }
                string folderPath = Server.MapPath("~/Documents/ExportData/Pdf/" + firmid + "/" + userid + "/");
                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }
                var htmlToPdf = new NReco.PdfGenerator.HtmlToPdfConverter();
                htmlToPdf.Orientation = NReco.PdfGenerator.PageOrientation.Landscape;
                var pageMargins = new NReco.PdfGenerator.PageMargins { Bottom = 10, Left = 05, Right = 05, Top = 05 };
                htmlToPdf.Margins = pageMargins;
                htmlToPdf.PageFooterHtml = "<div style='width:50%;float:left'><img style='padding:0 0 0 5px;' src='" + Server.MapPath("~\\Manupanel\\img\\powerby-logo.png") + "' width='140px' height='30px;'></img></div>" +
                    "<div style='width:50%;float:left;padding:5px 0 0 0;'>  Page <span class='page'></span> of  <span class='topage'></span></div>";
                var pdfBytes = htmlToPdf.GeneratePdf(strtemplate);
                var pffth = Server.MapPath("~\\Documents\\ExportData\\Pdf\\" + firmid + "\\" + userid + "\\" + filename);
                System.IO.File.WriteAllBytes(pffth, pdfBytes);
                Response.Clear();
                System.IO.MemoryStream ms = new System.IO.MemoryStream(pdfBytes);
                Response.ContentType = "application/pdf";
                Response.AddHeader("content-disposition", "attachment;filename=" + filename + "");
                Response.Buffer = true;
                ms.WriteTo(Response.OutputStream);
                Response.End();
            }
            catch (Exception ex)
            {
                db.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                Response.Redirect("/home/Error");
            }
        }
        /// <summary>
        /// Get Janpad List by Revenue Court
        /// </summary>
        /// <param name="vCourtval"></param>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public JsonResult FillJanpadByRevenueCourt(string vCourtval = "")
        {
            try
            {
                var FirmId = LoggedInUser.FirmId.ToString();
                var UserId = LoggedInUser.UserId.ToString();
                var User = prefixName + UserId;
                var Result = RevenueCase.FillJanpadByRevenueCourt(FirmId, User, vCourtval);
                var param = controllername + "=>FillJanpadByRevenueCourt=>RevenueCase.FillJanpadByRevenueCourt  " + "@" + FirmId + "@" + User + "@" + vCourtval;
                db.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                return Json(Result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Get Tahsil List by Revenue Court
        /// </summary>
        /// <param name="vCourtval"></param>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public JsonResult FillTahsilByRevenueCourt(string vCourtval = "")
        {
            try
            {
                var FirmId = LoggedInUser.FirmId.ToString();
                var UserId = LoggedInUser.UserId.ToString();
                var User = prefixName + UserId;
                var Result = RevenueCase.FillTahsilByRevenueCourt(FirmId, User, vCourtval);
                var param = controllername + "=>FillTahsilByRevenueCourt=>RevenueCase.FillTahsilByRevenueCourt  " + "@" + FirmId + "@" + User + "@" + vCourtval;
                db.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                return Json(Result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Get Revenue Court List by Tahsil and Janpad
        /// </summary>
        /// <param name="vCourtval"></param>
        /// <param name="janpadVal"></param>
        /// <param name="tahsilVal"></param>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public JsonResult FillRevenueCourtByTahsilAndJanpad(string vCourtval = "", string janpadVal = "", string tahsilVal = "")
        {
            try
            {
                var FirmId = LoggedInUser.FirmId.ToString();
                var UserId = LoggedInUser.UserId.ToString();
                var User = prefixName + UserId;
                var Result = RevenueCase.FillRevenueCourtByTahsilAndJanpad(FirmId, User, vCourtval, janpadVal, tahsilVal);
                var param = controllername + "=>FillTahsilByRevenueCourt=>RevenueCase.FillRevenueCourtByTahsilAndJanpad  " + "@" + FirmId + "@" + User + "@" + vCourtval + "@" + janpadVal + "@" + tahsilVal;
                db.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                return Json(Result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
    }
}
