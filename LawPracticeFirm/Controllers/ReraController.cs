using DataAccess.Modals;
using LawPracticeFirm.Common;
using LawPracticeFirm.CustomFIlter;
using LawPracticeFirm.Models;
using Newtonsoft.Json.Linq;
using NJDGDetail.Models;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web.Configuration;
using System.Web.Mvc;
using System.Web.UI;
using System.Web.UI.WebControls;
using static LawPracticeFirm.Models.AuditData;
using AuditData = LawPracticeFirm.Models.AuditData;

namespace LawPracticeFirm.Controllers
{
    public class ReraController : BaseFirmController
    {
        public string prefixName = WebConfigurationManager.AppSettings["matteridname"];
        private LawPracticeEntities db = new LawPracticeEntities();
        public string controllername = "ReraController";
        /// <summary>
        /// Get Rera causelist
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult ReraCaseList()
        {
            return View();
        }
        /// <summary>
        /// Get myrera causelist
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public JsonResult MyReraCases()
        {
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var FirmId = LoggedInUser.FirmId.ToString();
                var UserId = LoggedInUser.UserId.ToString();
                var User = prefixName + UserId;
                var ReraCourt = QueryAES.UrlDecode(Request.Form["reraCourt"]);
                var Search = QueryAES.UrlDecode(Request.Form["Search"]);
                var SortValue = QueryAES.UrlDecode(Request.Form["SortValue"]);
                var PageSize = QueryAES.UrlDecode(Request.Form["PageSize"]);
                var PageIndex = QueryAES.UrlDecode(Request.Form["PageIndex"]);
                var Datefromvalue = QueryAES.UrlDecode(Request.Form["Datefromvalue"]);
                var Datetovalue = QueryAES.UrlDecode(Request.Form["Datetovalue"]);
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string joineduser = "";
                List<CWCaseList> casedeatils = new List<CWCaseList>();
                var mykaselist = db.usp_CaseListForCWRera(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).ToList();
                joineduser = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                var resid = AddCaseCaseWatch.GetReracaseList(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(),
                    User, ReraCourt, Search, SortValue, PageSize, PageIndex, 
                    Datefromvalue, Datetovalue, "", apiUrl,LoggedInUser.IsCaseWatchUser,LoggedInUser.UserName.ToString());
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    //string status = data.Status;
                    int tempusercaseid = Convert.ToInt32(data.data[i]["UserCaseId"]);
                    var matterIDCase = mykaselist.Where(x => x.UserCaseId == tempusercaseid).FirstOrDefault();
                    string isalert = "", caseno = "";
                    if (Convert.ToString(data.data[i].vCaseType) != "" && Convert.ToString(data.data[i].vCaseType) != "0")
                    {
                        caseno = Convert.ToString(data.data[i].vCaseType) + " " + Convert.ToString(data.data[i].vCaseNo) + "/" + Convert.ToString(data.data[i].vCaseYear);
                    }
                    else
                    {
                        caseno = Convert.ToString(data.data[i].vRefNo);
                    }
                    casedeatils.Add(new CWCaseList
                    {
                        CaseId = Convert.ToString(data.data[i]["UserCaseId"]),
                        Court = data.data[i]["vCourt"],
                        CaseName = data.data[i]["vCaseName"],
                        Reracourtname= data.data[i]["vCourtName"],
                        vCaseNo = caseno,
                        vCaseYear = data.data[i]["vCaseYear"],
                        DisposedDate = data.data[i]["vDisposedDate"],
                        NextHearing = data.data[i]["vorderDateFinal"],
                        ManualNextHearing = data.data[i]["IsManualNextHearing"],
                        dEntryDate = data.data[i]["dEntryDate"],
                        dUpdateDate= data.data[i]["dUpdateDate"],
                        Status = data.data[i]["vStatus"],
                        RowId = data.data[i]["RowId"],
                        TotalRecord = data.data[i]["TotalRecord"],
                        UserCaseId = Convert.ToString(data.data[i]["UserCaseId"]),
                        Advocate = data.data[i]["vAdvocateName"],
                        MatterID = matterIDCase == null ? "" : matterIDCase.Id.ToString(),
                        MatterName = matterIDCase == null ? "" : matterIDCase.mname.ToString(),
                        vRefNo = Convert.ToString(data.data[i]["vRefNo"]),
                        MasterCaseId= data.data[i]["MasterCaseid"],
                    });
                }
                var param = controllername + "=>MyRevenueCases=>RevenueCase.MyRevenueCases" + "@" + FirmId + "@" + User + "@"  + PageSize + "@" + PageIndex + "@" + SortValue;
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
        /// Export Rera causelist report detail in excel
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportToExcelReraCaseListDetails()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                int pagesize = 10, pageindex = 1;
                string exlfilename = "ReraCaseList_" + DateTime.Now;
                var FirmId = LoggedInUser.FirmId.ToString();
                var UserId = LoggedInUser.UserId.ToString();
                var User = prefixName + UserId;
                var reraCourt = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["reraCourt"]));
                var Search = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["Search"]));
                var SortValue = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["SortValue"]));
                var Datefromvalue = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["Datefromvalue"]));
                var Datetovalue = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["Datetovalue"]));
                pageindex = Convert.ToInt32(HttpContext.Request.QueryString["PageIndex"]);
                pagesize = Convert.ToInt32(HttpContext.Request.QueryString["pagesize"]);
                if (String.IsNullOrEmpty(Datefromvalue) || Datefromvalue == "null" || Datefromvalue == "0") { Datefromvalue = ""; }
                if (String.IsNullOrEmpty(Datetovalue) || Datetovalue == "null" || Datetovalue == "0") { Datetovalue = ""; }
                if (String.IsNullOrEmpty(SortValue) || SortValue == "null" || SortValue == "0") { SortValue = ""; }
                if (String.IsNullOrEmpty(reraCourt) || reraCourt == "null" || reraCourt == "0") { reraCourt = ""; }
                List<CWCaseList> casedeatils = new List<CWCaseList>();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var db = new LawPracticeEntities();
                var mykaselist = db.usp_CaseListForCWRera(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).ToList();
                var resid = AddCaseCaseWatch.GetReracaseList(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(),User, reraCourt, Search, SortValue, pagesize.ToString(), pageindex.ToString(), Datefromvalue, Datetovalue, "", apiUrl,LoggedInUser.IsCaseWatchUser,LoggedInUser.UserName.ToString());
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
                        Court = data.data[i]["vCourt"],
                        CaseName = data.data[i]["vCaseName"],
                        Reracourtname = data.data[i]["vCourtName"],
                        vCaseNo = data.data[i]["vCaseNo"],
                        vCaseYear = data.data[i]["vCaseYear"],
                        DisposedDate = data.data[i]["vDisposedDate"],
                        NextHearing = data.data[i]["vorderDateFinal"],
                        ManualNextHearing = data.data[i]["IsManualNextHearing"],
                        dEntryDate = data.data[i]["dEntryDate"],
                        dUpdateDate = data.data[i]["dUpdateDate"],
                        Status = data.data[i]["vStatus"],
                        RowId = data.data[i]["RowId"],
                        TotalRecord = data.data[i]["TotalRecord"],
                        UserCaseId = Convert.ToString(data.data[i]["UserCaseId"]),
                        Advocate = "",
                        MatterID = matterIDCase == null ? "" : matterIDCase.Id.ToString(),
                        MatterName = matterIDCase == null ? "" : matterIDCase.mname.ToString(),
                        vRefNo = Convert.ToString(data.data[i]["vRefNo"]),
                    });
                }
                var trialList = (from ob in casedeatils
                                 select new
                                 {
                                     CaseNo = ob.vCaseNo,
                                     CaseName = ob.CaseName,
                                     Court = ob.Court,
                                     ReraCourtName = ob.Reracourtname,
                                     DisposedDate = ob.DisposedDate,
                                     NextHearing = ob.NextHearing,
                                     ManualNextHearing = ob.ManualNextHearing,
                                     Advocate=ob.Advocate,
                                     Status = ob.Status,
                                     MatterName = ob.MatterName
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
    }
}