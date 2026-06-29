using BussinessLogic;
using BussinessLogic.Common;
using DataAccess.Modals;
using LawPracticeFirm.Common;
using LawPracticeFirm.CustomFIlter;
using LawPracticeFirm.DAL;
using LawPracticeFirm.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NJDGDetail.Models;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Web.Configuration;
using System.Web.Mvc;
// using System.Web.SessionState;
using System.Web.UI;
using System.Web.UI.WebControls;
using static LawPracticeFirm.Models.AuditData;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;
using System.Web;
using MailKit.Search;
namespace LawPracticeFirm.Controllers
{
    // [SessionState(SessionStateBehavior.ReadOnly)]
    public class CWController : BaseFirmController
    {
        /// <summary>
        /// Case suggestion view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult CaseSuggestion()
        {
            return View();
        }
        /// <summary>
        /// Search by party name view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult SearchByPartyName()
        {
            var db1 = new LawPracticeEntities();

            try
            {
                var firmid = Convert.ToString(LoggedInUser.FirmId);
                // var data = db1.sp_Get_STF_Permission(firmid).FirstOrDefault();
                // if (data > 0)
                string stfpermission = System.Configuration.ConfigurationManager.AppSettings["StfModulePermission"];
                if (stfpermission.ToLower() == firmid.ToLower())
                {
                    ViewBag.stfUser = 1;


                }
                else
                {
                    ViewBag.stfUser = 0;

                }
            }
            catch (Exception ex)
            {

            }

            return View();
        }
        /// <summary>
        /// Search by party name for case
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult SearchByPartyNameForCase()
        {
            return View();
        }
        /// <summary>
        /// Show live case list view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult LiveCaseList()
        {
            return View();
        }
        /// <summary>
        /// Archive live case list
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult ArchiveLiveCaseList()
        {
            return View();
        }
        /// <summary>
        /// Get casewatch index view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult IndexCW()
        {
            return View();
        }
        /// <summary>
        /// Daily causelist view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult DailyCauseList()
        {
            return View();
        }
        /// <summary>
        /// Show casewatch daily cause list details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public JsonResult CWDailyCauseListDetails()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var casedate = QueryAES.UrlDecode(Request.Form["casedate"]);
                var court = QueryAES.UrlDecode(Request.Form["court"]);
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                //add login data
                var addfClient = new WebClient();

                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if(IsCaseWatchUser=="1")
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = WebConfigurationManager.AppSettings["matteridname"] + LoggedInUser.UserId;
                }

                object rawfile = new
                {
                    accesstoken = AccessTokenDetail,
                    userid = userIdDetail,
                    Courtflag = court,
                    Date = casedate,
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MyKaseDailyCauselist"), "POST", builders);
                var param = apiUrl + "CWController=>CWDailyCauseListDetails=>/API/Search/MyKaseDailyCauselist" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                JObject jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                if (court.ToString() == "3")
                {
                    List<MyKaseDistrictCauselist> CauseList = new List<MyKaseDistrictCauselist>();
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        string status = data.Status;
                        string Message = data.Message;
                        string Case = data.data[i].Case;
                        string State = data.data[i].State;
                        string District = data.data[i].District;
                        string JudgeName = data.data[i].JudgName;
                        string SessionTime = data.data[i].SessionTime;
                        string CourtComplexCourtEstablishmentType = data.data[i].Complex_Court_Establishment_Type;
                        string CourtComplexCourtEstablishment = data.data[i].Complex_Court_Establishment;
                        string CauselistDate = data.data[i].CauselistDate;
                        string CauselistDetail = data.data[i].CauselistDetail;
                        // Add parts to the list.
                        CauseList.Add(new MyKaseDistrictCauselist
                        {
                            Case = Case,
                            State = State,
                            District = District,
                            JudgeName = JudgeName,
                            SessionTime = SessionTime,
                            CourtComplexCourtEstablishmentType = CourtComplexCourtEstablishmentType,
                            CourtComplexCourtEstablishment = CourtComplexCourtEstablishment,
                            CauselistDate = CauselistDate,
                            CauselistDetail = CauselistDetail,
                        });
                    }
                    return Json(CauseList, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    List<MyKaseDailyCauselist> CauseList = new List<MyKaseDailyCauselist>();
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        string status = data.Status;
                        string Message = data.Message;
                        string Courtname = data.data[i].Courtname;
                        if (String.IsNullOrEmpty(Courtname))
                        {
                            Courtname = "";
                        }
                        string CaseType = data.data[i].CaseType;
                        if (String.IsNullOrEmpty(CaseType))
                        {
                            CaseType = "";
                        }
                        string Caseno = data.data[i].Caseno;
                        if (String.IsNullOrEmpty(Caseno))
                        {
                            Caseno = "";
                        }
                        string Caseyear = data.data[i].Caseyear;
                        if (String.IsNullOrEmpty(Caseyear))
                        {
                            Caseyear = "";
                        }
                        string Benchname = data.data[i].Benchname;
                        if (String.IsNullOrEmpty(Benchname))
                        {
                            Benchname = "";
                        }
                        string CourtNo = data.data[i].CourtNo;
                        if (String.IsNullOrEmpty(CourtNo))
                        {
                            CourtNo = "";
                        }
                        string JudgeName = data.data[i].JudgName;
                        if (String.IsNullOrEmpty(JudgeName))
                        {
                            JudgeName = "";
                        }
                        string SessionTime = data.data[i].SessionTime;
                        if (String.IsNullOrEmpty(SessionTime))
                        {
                            SessionTime = "";
                        }
                        string CauselistDate = data.data[i].CauselistDate;
                        if (String.IsNullOrEmpty(CauselistDate))
                        {
                            CauselistDate = "";
                        }
                        string Filetext = data.data[i].Filetext;
                        if (String.IsNullOrEmpty(Filetext))
                        {
                            Filetext = "";
                        }
                        // Add parts to the list.
                        CauseList.Add(new MyKaseDailyCauselist
                        {
                            Filetext = Filetext,
                            Courtname = Courtname,
                            CaseType = CaseType,
                            Caseno = Caseno,
                            Caseyear = Caseyear,
                            Benchname = Benchname,
                            CourtNo = CourtNo,
                            JudgeName = JudgeName,
                            SessionTime = SessionTime,
                            CauselistDate = CauselistDate,
                        });
                    }
                    return Json(CauseList, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// View alert
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult ViewAlert()
        {
            try
            {
                var search = QueryAES.UrlDecode(Request.QueryString["search"]);
                ViewBag.search = Convert.ToString(search);
            }
            catch (Exception ex)
            {
            }
            return View();
        }
        /// <summary>
        /// Get order notes details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult GetOrderNotesDetails()
        {
            return View();
        }
        /// <summary>
        /// Case notes details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult CaseNotes()
        {
            try
            {
                var id = QueryAES.UrlDecode(Request.QueryString["id"]);
                var search = QueryAES.UrlDecode(Request.QueryString["search"]);
                ViewBag.CaseId = Convert.ToString(id);
                ViewBag.search = Convert.ToString(search);
            }
            catch (Exception ex)
            {
            }
            return View();
        }
        /// <summary>
        /// Case order notes
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult CaseOrderNotes()
        {
            try
            {
                var id = QueryAES.UrlDecode(Request.QueryString["id"]);
                var search = QueryAES.UrlDecode(Request.QueryString["search"]);
                ViewBag.CaseId = Convert.ToString(id);
                ViewBag.search = Convert.ToString(search);
            }
            catch (Exception ex)
            {
            }
            return View();
        }
        /// <summary>
        /// Email order notes
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult EmailOrderNotes()
        {
            try
            {
                var id = QueryAES.UrlDecode(Request.QueryString["id"]);
                var search = QueryAES.UrlDecode(Request.QueryString["search"]);
                ViewBag.CaseId = Convert.ToString(id);
                ViewBag.search = Convert.ToString(search);
            }
            catch (Exception ex)
            {
            }
            return View();
        }
        /// <summary>
        /// Get total case notes details
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult GetTotalCaseNotesDetails()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                List<CaseDetailObject> casedeatils = new List<CaseDetailObject>();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                string Search = "";
                Search = Convert.ToString(QueryAES.UrlDecode(Request.Form["search"]));
                // "mykase123456789abcdef",
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }

                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    UserId = userIdDetail,
                    IsAdmin = roleid,
                    Search = Search
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/TotalNotesDetails"), "POST", builders);
                var param = apiUrl + "CWController=>GetTotalCaseNotesDetails=>/API/Search/TotalNotesDetails" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    casedeatils.Add(new CaseDetailObject { Iid = data.data[i].caseid, Csno = data.data[i].caseno });
                }
                return Json(casedeatils, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Get total case order details
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult GetTotalCaseOrdersDetails()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                List<CaseDetailObject> casedeatils = new List<CaseDetailObject>();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                string Search = "";
                Search = Convert.ToString(QueryAES.UrlDecode(Request.Form["search"]));
                // "mykase123456789abcdef",

                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }

                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = userIdDetail,
                    UserId = userIdDetail,
                    IsAdmin = roleid,
                    Search = Search
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/TotalOrderDetails"), "POST", builders);
                var param = apiUrl + "CWController=>GetTotalCaseOrdersDetails=>/API/Search/TotalOrderDetails" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    casedeatils.Add(new CaseDetailObject { vNotesId = data.data[i].vOrderDtid, Iid = data.data[i].caseid, Orderdt = data.data[i].orderdate, Csno = data.data[i].caseno });
                }
                return Json(casedeatils, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Get case notes details
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult GetCaseNotes()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                List<CaseDetailObject> casedeatils = new List<CaseDetailObject>();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                string search = "";
                search = Convert.ToString(QueryAES.UrlDecode(Request.Form["search"]));
                string caseid = Convert.ToString(QueryAES.UrlDecode(Request.Form["caseid"]));
                string doctype = "casenote";

                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }

                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    UserId = userIdDetail,
                    CaseId = caseid,
                    Doctype = doctype,
                    Search = search,
                    Monthid = ""
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/CaseNotesDataSearch"), "POST", builders);
                var param = apiUrl + "CWController=>GetCaseNotes=>/API/Search/CaseNotesDataSearch" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    casedeatils.Add(new CaseDetailObject { Iid = data.data[i].Iid, Notes = data.data[i].Notes, Orderdt = data.data[i].CreatedDate, Casename = data.data[i].Casename, caseid = caseid });
                }
                return Json(casedeatils, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Get case order notes details
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult GetCaseOrderNotes()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                List<CaseDetailObject> casedeatils = new List<CaseDetailObject>();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                string search = "";
                search = Convert.ToString(QueryAES.UrlDecode(Request.Form["search"]));
                string caseid = Convert.ToString(QueryAES.UrlDecode(Request.Form["caseid"]));
                string doctype = "ordernote";

                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }

                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    UserId = userIdDetail,
                    CaseId = caseid,
                    Doctype = doctype,
                    Search = search,
                    Monthid = ""
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/OrderNotesDetails"), "POST", builders);
                var param = apiUrl + "CWController=>GetCaseOrderNotes=>/API/Search/OrderNotesDetails" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    casedeatils.Add(new CaseDetailObject { Iid = data.data[i].Iid, Notes = data.data[i].Notes, Orderdt = data.data[i].CreatedDate });
                }
                return Json(casedeatils, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Share notes to user
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public string ShareNotes()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                List<CaseDetailObject> casedeatils = new List<CaseDetailObject>();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                string caseid = Convert.ToString(QueryAES.UrlDecode(Request.Form["caseid"]));
                var toemail = Convert.ToString(QueryAES.UrlDecode(Request.Form["toemail"]));
                string doctype = "casenote";

                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }
                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    UserId = userIdDetail,
                    CaseId = caseid,
                    Toemail = toemail
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/ShareNotes"), "POST", builders);
                var param = apiUrl + "CWController=>ShareNotes=>/API/Search/ShareNotes" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                dynamic data = JObject.Parse(resid);
                string status = data.Status;
                if (status.ToLower() == "true")
                {
                    return "Mail Sent Successfully.";
                }
                else
                {
                    return "OOps! Something went wrong.";
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return ex.Message.ToString();
            }
        }
        /// <summary>
        /// Get SMS case alert list details
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult GetSMSAlertList()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                List<AlertlistObject> casedeatils = new List<AlertlistObject>();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                string search = "";
                search = Convert.ToString(QueryAES.UrlDecode(Request.Form["search"]));
                if(search == "undefined")
                {
                    search = "";
                }
                int pagesize = 10, pageindex = 1;
                pageindex = Convert.ToInt32(QueryAES.UrlDecode(Request.Form["pagenum"]));
                pagesize = Convert.ToInt32(QueryAES.UrlDecode(Request.Form["pagesize"]));

                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }

                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    UserId = userIdDetail,
                    Pageindex = pageindex,
                    Pagesize = pagesize,
                    Search = search
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MyAlertListCW"), "POST", builders);
                var param = apiUrl + "CWController=>GetSMSAlertList=>/API/Search/MyAlertListCW" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    casedeatils.Add(new AlertlistObject
                    {
                        RowId = Convert.ToString(data.data[i].RowNo),
                        TotalRecord = Convert.ToString(data.data[i].TotalRecord),
                        SMSText = data.data[i].SMSText,
                        EmailText = data.data[i].EmailText,
                        SentOn = Convert.ToString(data.data[i].SentOn)
                    });
                }
                return Json(casedeatils, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Get casewatch cause details list
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public JsonResult CWCauseListDetails()
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
                string fullcauselistURL = ConfigurationManager.AppSettings["Casefullcauselist"];
                var db = new LawPracticeEntities();
                var joineduser = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                if (string.IsNullOrEmpty(joineduser))
                {
                    joineduser = strusername + LoggedInUser.UserId.ToString();
                }
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = joineduser;
                }

                if (court.ToString() == "3")
                {
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        accesstoken = AccessTokenDetail,
                        userid = userIdDetail,
                        Courtflag = court,
                        Date = casedate,
                        Searchtext = "",
                        pageindex = pageno,
                        pagesize = pagesizes
                    };
                    addfClient.Encoding = System.Text.Encoding.UTF8;
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MyKaseDailyCauselist"), "POST", builders);
                    var param = apiUrl + "CWController=>CWCauseListDetails=>/API/Search/MyKaseDailyCauselist" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                    JObject jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    List<MyKaseDistrictCauselist> CauseList = new List<MyKaseDistrictCauselist>();
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        string status = data.Status;
                        string Message = data.Message;
                        string Case = data.data[i].Case;
                        string State = data.data[i]["Court"];
                        string District = data.data[i].District;
                        string JudgeName = data.data[i]["JudgName"];
                        string SessionTime = data.data[i]["SessionTime"];
                        string CourtComplexCourtEstablishmentType = data.data[i]["Complex_Court_Establishment_Type"];
                        string CourtComplexCourtEstablishment = data.data[i]["Complex_Court_Establishment"];
                        string CauselistDate = data.data[i]["CauselistDate"];
                        string CauselistDetail = data.data[i]["CauselistDetail"];
                        string CourtNo = data.data[i]["Court No"];
                        string PartyName = data.data[i]["Partyname"];
                        string RowId = data.data[i]["RowId"];
                        string TotalRecord = data.data[i]["TotalRecord"];
                        string MasterCaseId = data.data[i].MasterCaseId;
                        string UserCaseId = data.data[i].UserCaseId;
                        string Stages = data.data[i].Stage;
                        string DiaryNo = data.data[i].DiaryNo;
                        string DiaryYear = data.data[i].DiaryYear;
                        string filename = data.data[i].filename;
                        string ItemNo = data.data[i].ItemNo;
                        if (String.IsNullOrEmpty(filename))
                        {
                            filename = "";
                        }
                        else
                        {
                            filename = fullcauselistURL + filename;
                        }
                        // Add parts to the list.
                        CauseList.Add(new MyKaseDistrictCauselist
                        {
                            Case = Case,
                            State = State,
                            District = District,
                            JudgeName = JudgeName,
                            SessionTime = SessionTime,
                            CourtComplexCourtEstablishmentType = CourtComplexCourtEstablishmentType,
                            CourtComplexCourtEstablishment = CourtComplexCourtEstablishment,
                            CauselistDate = CauselistDate,
                            CauselistDetail = CauselistDetail,
                            CourtNo = CourtNo,
                            PartyName = PartyName,
                            Stage = Stages,
                            RowId = RowId,
                            TotalRecord = TotalRecord,
                            MasterCaseId = MasterCaseId,
                            UserCaseId = UserCaseId,
                            DiaryNo= DiaryNo,
                            DiaryYear= DiaryYear,
                            filename= filename,
                            ItemNo = ItemNo

                        });
                    }
                    return Json(CauseList, JsonRequestBehavior.AllowGet);
                }
                else if (court.ToString() == "4")
                {
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        accesstoken = AccessTokenDetail,
                        userid = userIdDetail,
                        Courtflag = court,
                        Date = casedate,
                        Searchtext = "",
                        pageindex = pageno,
                        pagesize = pagesizes
                    };
                    addfClient.Encoding = System.Text.Encoding.UTF8;
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/DailyTribunalCauselist"), "POST", builders);
                    var param = apiUrl + "CWController=>CWCauseListDetails=>/API/Search/DailyTribunalCauselist" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                    JObject jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    List<MyKaseDailyCauselist> CauseList = new List<MyKaseDailyCauselist>();
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        string status = data.Status;
                        string Message = data.Message;
                        string Courtname = data.data[i]["Court"];
                        if (String.IsNullOrEmpty(Courtname))
                        {
                            Courtname = "";
                        }
                        string CaseType = data.data[i]["Case Type"];
                        if (String.IsNullOrEmpty(CaseType))
                        {
                            CaseType = "";
                        }
                        string Caseno = data.data[i]["Case no"];
                        if (String.IsNullOrEmpty(Caseno))
                        {
                            Caseno = "";
                        }
                        string Caseyear = data.data[i]["Case Year"];
                        if (String.IsNullOrEmpty(Caseyear))
                        {
                            Caseyear = "";
                        }
                        string Benchname = data.data[i]["Bench Name"];
                        if (String.IsNullOrEmpty(Benchname))
                        {
                            Benchname = "";
                        }
                        string CourtNo = data.data[i]["Court No."];
                        if (String.IsNullOrEmpty(CourtNo))
                        {
                            CourtNo = "";
                        }
                        string JudgeName = data.data[i]["Judge Name"];
                        if (String.IsNullOrEmpty(JudgeName))
                        {
                            JudgeName = "";
                        }
                        string SessionTime = data.data[i]["Session Time"];
                        if (String.IsNullOrEmpty(SessionTime))
                        {
                            SessionTime = "";
                        }
                        string CauselistDate = data.data[i]["Causelist Date"];
                        if (String.IsNullOrEmpty(CauselistDate))
                        {
                            CauselistDate = "";
                        }
                        string CauselistDetail = data.data[i]["Causelist Detail"];
                        if (String.IsNullOrEmpty(CauselistDetail))
                        {
                            CauselistDetail = "";
                        }
                        string Partyname = data.data[i]["Partyname"];
                        if (String.IsNullOrEmpty(Partyname))
                        {
                            Partyname = "";
                        }
                        string DiaryNo = data.data[i]["DiaryNo"];
                        if (String.IsNullOrEmpty(DiaryNo))
                        {
                            DiaryNo = "";
                        }
                        string DiaryYear = data.data[i]["DiaryYear"];
                        if (String.IsNullOrEmpty(DiaryYear))
                        {
                            DiaryYear = "";
                        }
                        string filename = data.data[i]["filename"];
                        if (String.IsNullOrEmpty(filename))
                        {
                            filename = "";
                        }
                        else
                        {
                            filename = fullcauselistURL + filename;
                        }

                        string RowId = data.data[i]["RowId"];
                        string TotalRecord = data.data[i]["TotalRecord"];
                        string MasterCaseId = data.data[i].MasterCaseId;
                        string UserCaseId = data.data[i].UserCaseId;
                        string Stages = data.data[i].Stage;
                        string ItemNo = data.data[i].ItemNo;
                        // Add parts to the list.
                        CauseList.Add(new MyKaseDailyCauselist
                        {
                            Courtname = Courtname,
                            CaseType = CaseType,
                            Caseno = Caseno,
                            Caseyear = Caseyear,
                            Benchname = Benchname,
                            CourtNo = CourtNo,
                            JudgeName = JudgeName,
                            SessionTime = SessionTime,
                            CauselistDate = CauselistDate,
                            CauselistDetail = CauselistDetail,
                            Partyname = Partyname,
                            Stage = Stages,
                            RowId = RowId,
                            TotalRecord = TotalRecord,
                            MasterCaseId = MasterCaseId,
                            UserCaseId = UserCaseId,
                            DiaryNo= DiaryNo,
                            DiaryYear= DiaryYear,
                            filename= filename,
                            ItemNo = ItemNo

                        });
                    }
                    return Json(CauseList, JsonRequestBehavior.AllowGet);
                }
                else if (court.ToString() == "RERH")
                {
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        accesstoken = AccessTokenDetail,
                        userid = userIdDetail,
                        Courtflag = court,
                        Date = casedate,
                        Searchtext = "",
                        pageindex = pageno,
                        pagesize = pagesizes
                    };
                    addfClient.Encoding = System.Text.Encoding.UTF8;
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MyKaseDailyCauselist"), "POST", builders);
                    var param = apiUrl + "CWController=>CWCauseListDetails=>/API/Search/MyKaseDailyCauselist" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                    JObject jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    List<MyKaseDailyRevCauselist> revCauseList = new List<MyKaseDailyRevCauselist>();
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        string status = data.Status;
                        string Message = data.Message;
                        string Courtname = data.data[i]["Courtname"] ?? "";
                        string CaseName = data.data[i]["vCaseName"] ?? "";
                        string Court = data.data[i]["vCourt"] ?? "";
                        string AppealNo = data.data[i]["AppealNo"] ?? "";
                        string vCauselistDate = data.data[i]["vCauselistDate"] ?? "";
                        string vStatus = data.data[i]["vStatus"] ?? "";
                        string ItemNo = data.data[i].vItemNo;
                        string MasterCaseId = data.data[i].MasterCaseId;
                        string UserCaseId = data.data[i].UserCaseId;
                        string filename = !string.IsNullOrEmpty(Convert.ToString(data.data[i]["Filename"])) ? fullcauselistURL + Convert.ToString(data.data[i]["Filename"]) : "";
                        string TotalRecord = data.data[i].TotalRecord;
                        // Add parts to the list.
                        revCauseList.Add(new MyKaseDailyRevCauselist
                        {
                            MasterCaseId = MasterCaseId,
                            UserCaseId = UserCaseId,
                            Courtname = Courtname,
                            vCaseName = CaseName,
                            vItemNo = ItemNo,
                            vCourt = Court,
                            AppealNo = AppealNo,
                            vCauselistDate = vCauselistDate,
                            vStatus = vStatus,
                            filename = filename,
                            TotalRecord = TotalRecord
                        });
                    }
                    return Json(revCauseList, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        accesstoken = AccessTokenDetail,
                        userid = userIdDetail,
                        Courtflag = court,
                        Date = casedate,
                        Searchtext = "",
                        pageindex = pageno,
                        pagesize = pagesizes
                    };
                    addfClient.Encoding = System.Text.Encoding.UTF8;
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MyKaseDailyCauselist"), "POST", builders);
                    var param = apiUrl + "CWController=>CWCauseListDetails=>/API/Search/MyKaseDailyCauselist" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                    JObject jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    List<MyKaseDailyCauselist> CauseList = new List<MyKaseDailyCauselist>();
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        string status = data.Status;
                        string Message = data.Message;
                        string Courtname = data.data[i]["Courtname"];
                        if (String.IsNullOrEmpty(Courtname))
                        {
                            Courtname = "";
                        }
                        string CaseType = data.data[i]["CaseType"];
                        if (String.IsNullOrEmpty(CaseType))
                        {
                            CaseType = "";
                        }
                        string Caseno = data.data[i]["Caseno"];
                        if (String.IsNullOrEmpty(Caseno))
                        {
                            Caseno = "";
                        }
                        string Caseyear = data.data[i]["Caseyear"];
                        if (String.IsNullOrEmpty(Caseyear))
                        {
                            Caseyear = "";
                        }
                        string Benchname = data.data[i]["Benchname"];
                        if (String.IsNullOrEmpty(Benchname))
                        {
                            Benchname = "";
                        }
                        string CourtNo = data.data[i]["CourtNo"];
                        if (String.IsNullOrEmpty(CourtNo))
                        {
                            CourtNo = "";
                        }
                        string JudgeName = data.data[i]["JudgName"];
                        if (String.IsNullOrEmpty(JudgeName))
                        {
                            JudgeName = "";
                        }
                        string SessionTime = data.data[i]["SessionTime"];
                        if (String.IsNullOrEmpty(SessionTime))
                        {
                            SessionTime = "";
                        }
                        string CauselistDate = data.data[i]["CauselistDate"];
                        if (String.IsNullOrEmpty(CauselistDate))
                        {
                            CauselistDate = "";
                        }
                        string CauselistDetail = data.data[i]["Filetext"];
                        if (String.IsNullOrEmpty(CauselistDetail))
                        {
                            CauselistDetail = "";
                        }
                        string Partyname = data.data[i]["Partyname"];
                        if (String.IsNullOrEmpty(Partyname))
                        {
                            Partyname = "";
                        }
                        string DiaryNo = data.data[i]["DiaryNo"];
                        if (String.IsNullOrEmpty(DiaryNo))
                        {
                            DiaryNo = "";
                        }
                        string DiaryYear = data.data[i]["DiaryYear"];
                        if (String.IsNullOrEmpty(DiaryYear))
                        {
                            DiaryYear = "";
                        }
                        string filename = data.data[i]["filename"];
                        if (String.IsNullOrEmpty(filename))
                        {
                            filename = "";
                        }
                        else
                        {
                            filename = fullcauselistURL + filename;
                        }
                        string RowId = data.data[i]["RowId"];
                        string TotalRecord = data.data[i]["TotalRecord"];
                        string MasterCaseId = data.data[i].MasterCaseId;
                        string UserCaseId = data.data[i].UserCaseId;
                        string Stages = data.data[i].Stage;
                        string ItemNo = data.data[i].ItemNo;
                        // Add parts to the list.
                        CauseList.Add(new MyKaseDailyCauselist
                        {
                            Courtname = Courtname,
                            CaseType = CaseType,
                            Caseno = Caseno,
                            Caseyear = Caseyear,
                            Benchname = Benchname,
                            CourtNo = CourtNo,
                            JudgeName = JudgeName,
                            SessionTime = SessionTime,
                            CauselistDate = CauselistDate,
                            CauselistDetail = CauselistDetail,
                            Partyname = Partyname,
                            Stage = Stages,
                            RowId = RowId,
                            TotalRecord = TotalRecord,
                            MasterCaseId = MasterCaseId,
                            UserCaseId = UserCaseId,
                            DiaryNo = DiaryNo,
                            DiaryYear = DiaryYear,
                            filename = filename,
                            ItemNo= ItemNo
                        });
                    }
                    return Json(CauseList, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Export Casewatch cause list details in excel
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportToExcelCWCauseListDetails()
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
                if (string.IsNullOrEmpty(joineduser))
                {
                    joineduser = strusername + LoggedInUser.UserId.ToString();
                }
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = joineduser;
                }
                if(court.ToString() == "1")
                {
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        accesstoken = AccessTokenDetail,
                        userid = userIdDetail,
                        Courtflag = court,
                        Date = casedate,
                        Searchtext = "",
                        pageindex = pageno,
                        pagesize = pagesizes
                    };
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    addfClient.Encoding = Encoding.UTF8;
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MyKaseDailyCauselist"), "POST", builders);
                    var param = apiUrl + "CWController=>ExportToExcelCWCauseListDetails=>/API/Search/MyKaseDailyCauselist" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                    JObject jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    List<ExportDailyCauseListForCW> CauseList = new List<ExportDailyCauseListForCW>();
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        string status = data.Status;
                        string Message = data.Message;
                        string Courtname = data.data[i]["Courtname"];
                        string Stages = data.data[i].Stage;
                        if (String.IsNullOrEmpty(Courtname))
                        {
                            Courtname = "";
                        }
                        string CaseType = data.data[i]["CaseType"];
                        if (String.IsNullOrEmpty(CaseType))
                        {
                            CaseType = "";
                        }
                        string Caseno = data.data[i]["Caseno"];
                        if (String.IsNullOrEmpty(Caseno))
                        {
                            Caseno = "";
                        }
                        string Caseyear = data.data[i]["Caseyear"];
                        if (String.IsNullOrEmpty(Caseyear))
                        {
                            Caseyear = "";
                        }
                        string Benchname = data.data[i]["Benchname"];
                        if (String.IsNullOrEmpty(Benchname))
                        {
                            Benchname = "";
                        }
                        string CourtNo = data.data[i]["CourtNo"];
                        if (String.IsNullOrEmpty(CourtNo))
                        {
                            CourtNo = "";
                        }
                        string JudgeName = data.data[i]["JudgName"];
                        if (String.IsNullOrEmpty(JudgeName))
                        {
                            JudgeName = "";
                        }
                        string SessionTime = data.data[i]["SessionTime"];
                        if (String.IsNullOrEmpty(SessionTime))
                        {
                            SessionTime = "";
                        }
                        string CauselistDate = data.data[i]["CauselistDate"];
                        if (String.IsNullOrEmpty(CauselistDate))
                        {
                            CauselistDate = "";
                        }
                        string CauselistDetail = data.data[i]["Filetext"];
                        if (String.IsNullOrEmpty(CauselistDetail))
                        {
                            CauselistDetail = "";
                        }
                        //string Partyname = data.data[i]["Partyname"];
                        //if (String.IsNullOrEmpty(Partyname))
                        //{
                        //    Partyname = "";
                        //}
                        string DiaryNo = data.data[i]["DiaryNo"];
                        if (String.IsNullOrEmpty(DiaryNo))
                        {
                            DiaryNo = "";
                        }
                        string DiaryYear = data.data[i]["DiaryYear"];
                        if (String.IsNullOrEmpty(DiaryYear))
                        {
                            DiaryYear = "";
                        }
                        string ItemNo = data.data[i].ItemNo;
                        // Add parts to the list.
                        CauseList.Add(new ExportDailyCauseListForCW
                        {
                            Courtname = Courtname,
                            CaseType = CaseType,
                            Caseno = Caseno,
                            Caseyear = Caseyear,
                          //  Benchname = Benchname,
                            CourtNo = CourtNo,
                            JudgeName = JudgeName,
                            CauselistDate = CauselistDate,
                            CauselistDetail = removeSpecialCharacter(CauselistDetail),//CauselistDetail,
                          //  Partyname = Partyname,
                            Stage= Stages,
                            DiaryNo = DiaryNo,
                            DiaryYear = DiaryYear,
                            ItemNo = ItemNo
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
                    //return "";
                }
                else if (court.ToString() == "3")
                {
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        accesstoken = AccessTokenDetail,
                        userid = userIdDetail,
                        Courtflag = court,
                        Date = casedate,
                        Searchtext = "",
                        pageindex = pageno,
                        pagesize = pagesizes
                    };
                    addfClient.Encoding = System.Text.Encoding.UTF8;
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MyKaseDailyCauselist"), "POST", builders);
                    var param = apiUrl + "CWController=>ExportToExcelCWCauseListDetails=>/API/Search/MyKaseDailyCauselist" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                    JObject jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    List<ExportMyKaseDistrictCauselist> CauseList = new List<ExportMyKaseDistrictCauselist>();
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        string status = data.Status;
                        string Message = data.Message;
                        string Case = data.data[i].Case;
                        string State = data.data[i]["Court"];
                        string District = data.data[i].District;
                        string JudgeName = data.data[i]["JudgName"];
                        string SessionTime = data.data[i]["SessionTime"];
                        string CourtComplexCourtEstablishmentType = data.data[i]["Complex_Court_Establishment_Type"];
                        string CourtComplexCourtEstablishment = data.data[i]["Complex_Court_Establishment"];
                        string CauselistDate = data.data[i]["CauselistDate"];
                        string CauselistDetail = data.data[i]["CauselistDetail"];
                        string CourtNo = data.data[i]["Court No"];
                        string PartyName = data.data[i]["Partyname"];
                        string Stages = data.data[i].Stage;
                        string ItemNo = data.data[i].ItemNo;
                        // Add parts to the list.
                        CauseList.Add(new ExportMyKaseDistrictCauselist
                        {
                            Case = Case,
                            State = State,
                            District = District,
                            JudgeName = JudgeName,
                            courtestablishment = CourtComplexCourtEstablishment,
                            CauselistDate = CauselistDate,
                            CauselistDetail = removeSpecialCharacter(CauselistDetail),//CauselistDetail,
                            CourtNo = CourtNo,
                            Stage= Stages,
                            ItemNo = ItemNo
                            // PartyName = PartyName,
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
                    //  return "success";
                }
                else if (court.ToString() == "RERH")
                {
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        accesstoken = AccessTokenDetail,
                        userid = userIdDetail,
                        Courtflag = court,
                        Date = casedate,
                        Searchtext = "",
                        pageindex = pageno,
                        pagesize = pagesizes
                    };
                    addfClient.Encoding = System.Text.Encoding.UTF8;
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MyKaseDailyCauselist"), "POST", builders);
                    var param = apiUrl + "CWController=>ExportToExcelCWCauseListDetails=>/API/Search/MyKaseDailyCauselist" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                    JObject jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    List<ExportMyKaseRevenueCauselist> revCauseList = new List<ExportMyKaseRevenueCauselist>();
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        string status = data.Status;
                        string Message = data.Message;
                        string JudgeName = data.data[i]["AppealNo"];
                        string CauselistDate = data.data[i]["vCauselistDate"];
                        string CourtName = data.data[i]["Courtname"];
                        string PartyName = data.data[i]["vCaseName"];
                        string Stages = data.data[i].vStatus;
                        string Court = data.data[i].vCourt;
                        string ItemNo = data.data[i].vItemNo;
                        // Add parts to the list.
                        revCauseList.Add(new ExportMyKaseRevenueCauselist
                        {
                            AppealNo = JudgeName,
                            CauselistDate = CauselistDate,
                            CourtName = CourtName,
                            Case = PartyName,
                            Stage = Stages,
                            ItemNo = ItemNo,
                            Court = Court,
                        });
                    }
                    var gv = new GridView();
                    gv.DataSource = revCauseList;
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
                    //  return "success";
                }
                else if (court.ToString() == "4")
                {
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        accesstoken = AccessTokenDetail,
                        userid = userIdDetail,
                        Courtflag = court,
                        Date = casedate,
                        Searchtext = "",
                        pageindex = pageno,
                        pagesize = pagesizes
                    };
                    addfClient.Encoding = System.Text.Encoding.UTF8;
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/DailyTribunalCauselist"), "POST", builders);
                    var param = apiUrl + "CWController=>ExportToExcelCWCauseListDetails=>/API/Search/DailyTribunalCauselist" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                    JObject jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    List<ExportDailyCauseListForTribunal> CauseList = new List<ExportDailyCauseListForTribunal>();
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        string status = data.Status;
                        string Message = data.Message;
                        string Courtname = data.data[i]["Court"];
                        string Stages = data.data[i].Stage;
                        if (String.IsNullOrEmpty(Courtname))
                        {
                            Courtname = "";
                        }
                        string CaseType = data.data[i]["Case Type"];
                        if (String.IsNullOrEmpty(CaseType))
                        {
                            CaseType = "";
                        }
                        string Caseno = data.data[i]["Case no"];
                        if (String.IsNullOrEmpty(Caseno))
                        {
                            Caseno = "";
                        }
                        string Caseyear = data.data[i]["Case Year"];
                        if (String.IsNullOrEmpty(Caseyear))
                        {
                            Caseyear = "";
                        }
                        string Benchname = data.data[i]["Bench Name"];
                        if (String.IsNullOrEmpty(Benchname))
                        {
                            Benchname = "";
                        }
                        string CourtNo = data.data[i]["Court No."];
                        if (String.IsNullOrEmpty(CourtNo))
                        {
                            CourtNo = "";
                        }
                        string JudgeName = data.data[i]["Judge Name"];
                        if (String.IsNullOrEmpty(JudgeName))
                        {
                            JudgeName = "";
                        }
                        string SessionTime = data.data[i]["Session Time"];
                        if (String.IsNullOrEmpty(SessionTime))
                        {
                            SessionTime = "";
                        }
                        string CauselistDate = data.data[i]["Causelist Date"];
                        if (String.IsNullOrEmpty(CauselistDate))
                        {
                            CauselistDate = "";
                        }
                        string CauselistDetail = data.data[i]["Causelist Detail"];
                        if (String.IsNullOrEmpty(CauselistDetail))
                        {
                            CauselistDetail = "";
                        }
                        string Partyname = data.data[i]["Partyname"];
                        if (String.IsNullOrEmpty(Partyname))
                        {
                            Partyname = "";
                        }
                        string DiaryNo = data.data[i]["DiaryNo"];
                        if (String.IsNullOrEmpty(DiaryNo))
                        {
                            DiaryNo = "";
                        }
                        string DiaryYear = data.data[i]["DiaryYear"];
                        if (String.IsNullOrEmpty(DiaryYear))
                        {
                            DiaryYear = "";
                        }
                        string ItemNo = data.data[i].ItemNo;
                        // Add parts to the list.
                        CauseList.Add(new ExportDailyCauseListForTribunal
                        {
                            Courtname = Courtname,
                            CaseType = CaseType,
                            Caseno = Caseno,
                            Caseyear = Caseyear,
                            Benchname = Benchname,
                            CourtNo = CourtNo,
                            JudgeName = JudgeName,
                            CauselistDate = CauselistDate,
                            CauselistDetail = removeSpecialCharacter(CauselistDetail),//CauselistDetail,
                          //  Partyname = Partyname,
                            DiaryNo= DiaryNo,
                            DiaryYear= DiaryYear,
                            Stage= Stages,
                            ItemNo = ItemNo
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
                else
                {
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        accesstoken = AccessTokenDetail,
                        userid = userIdDetail,
                        Courtflag = court,
                        Date = casedate,
                        Searchtext = "",
                        pageindex = pageno,
                        pagesize = pagesizes
                    };
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MyKaseDailyCauselist"), "POST", builders);
                    var param = apiUrl + "CWController=>ExportToExcelCWCauseListDetails=>/API/Search/MyKaseDailyCauselist" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                    JObject jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    List<ExportDailyCauseList> CauseList = new List<ExportDailyCauseList>();
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        string status = data.Status;
                        string Message = data.Message;
                        string Courtname = data.data[i]["Courtname"];
                        string Stages = data.data[i].Stage;
                        if (String.IsNullOrEmpty(Courtname))
                        {
                            Courtname = "";
                        }
                        string CaseType = data.data[i]["CaseType"];
                        if (String.IsNullOrEmpty(CaseType))
                        {
                            CaseType = "";
                        }
                        string Caseno = data.data[i]["Caseno"];
                        if (String.IsNullOrEmpty(Caseno))
                        {
                            Caseno = "";
                        }
                        string Caseyear = data.data[i]["Caseyear"];
                        if (String.IsNullOrEmpty(Caseyear))
                        {
                            Caseyear = "";
                        }
                        string Benchname = data.data[i]["Benchname"];
                        if (String.IsNullOrEmpty(Benchname))
                        {
                            Benchname = "";
                        }
                        string CourtNo = data.data[i]["CourtNo"];
                        if (String.IsNullOrEmpty(CourtNo))
                        {
                            CourtNo = "";
                        }
                        string JudgeName = data.data[i]["JudgName"];
                        if (String.IsNullOrEmpty(JudgeName))
                        {
                            JudgeName = "";
                        }
                        string SessionTime = data.data[i]["SessionTime"];
                        if (String.IsNullOrEmpty(SessionTime))
                        {
                            SessionTime = "";
                        }
                        string CauselistDate = data.data[i]["CauselistDate"];
                        if (String.IsNullOrEmpty(CauselistDate))
                        {
                            CauselistDate = "";
                        }
                        string CauselistDetail = data.data[i]["Filetext"];
                        if (String.IsNullOrEmpty(CauselistDetail))
                        {
                            CauselistDetail = "";
                        }
                        string Partyname = data.data[i]["Partyname"];
                        if (String.IsNullOrEmpty(Partyname))
                        {
                            Partyname = "";
                        }
                        string DiaryNo = data.data[i]["DiaryNo"];
                        if (String.IsNullOrEmpty(DiaryNo))
                        {
                            DiaryNo = "";
                        }
                        string DiaryYear = data.data[i]["DiaryYear"];
                        if (String.IsNullOrEmpty(DiaryYear))
                        {
                            DiaryYear = "";
                        }
                        string ItemNo = data.data[i].ItemNo;
                        // Add parts to the list.
                        CauseList.Add(new ExportDailyCauseList
                        {
                            Courtname = Courtname,
                            CaseType = CaseType,
                            Caseno = Caseno,
                            Caseyear = Caseyear,
                            Benchname = Benchname,
                            CourtNo = CourtNo,
                            JudgeName = JudgeName,
                            CauselistDate = CauselistDate,
                            CauselistDetail = removeSpecialCharacter(CauselistDetail), //CauselistDetail,
                            Stage= Stages,
                            ItemNo = ItemNo
                            //Partyname = Partyname,
                            //DiaryNo = DiaryNo,
                            //DiaryYear = DiaryYear
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
                    //return "";
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                Response.Redirect("/home/Error");
            }
        }
        /// <summary>
        /// Remove special character and HTML tag from text
        /// </summary>
        /// <param name="textDetail"></param>
        /// <returns></returns>
        public string removeSpecialCharacter(string textDetail)
        {
            string noHTML = "";
            if (!string.IsNullOrEmpty(textDetail))
            {
                noHTML = Regex.Replace(textDetail, @"<pre>", "").Trim();
                noHTML = Regex.Replace(noHTML, @"<\/pre>", "");
                noHTML = Regex.Replace(noHTML, @"<br>", "");
                noHTML = Regex.Replace(noHTML, @"</br>", "");
                noHTML = Regex.Replace(noHTML, @"<br />", "");
                noHTML = Regex.Replace(noHTML, @"<br/>", "");
            }
            return noHTML;
        }
        /// <summary>
        /// Export casewatch cause list in pdf
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportToPDFCWCauseListDetails()
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
                if (string.IsNullOrEmpty(joineduser))
                {
                    joineduser = strusername + LoggedInUser.UserId.ToString();
                }
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = joineduser;
                }
                if (court.ToString() == "1")
                {
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        accesstoken = AccessTokenDetail,
                        userid = userIdDetail,
                        Courtflag = court,
                        Date = casedate,
                        Searchtext = "",
                        pageindex = pageno,
                        pagesize = pagesizes
                    };
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    addfClient.Encoding = Encoding.UTF8;
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MyKaseDailyCauselist"), "POST", builders);
                    var param = apiUrl + "CWController=>ExportToPDFCWCauseListDetails=>/API/Search/MyKaseDailyCauselist" + "@" + builders;
                    db.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                    JObject jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    List<ExportDailyCauseListForCW> CauseList = new List<ExportDailyCauseListForCW>();
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        string status = data.Status;
                        string Message = data.Message;
                        string Courtname = data.data[i]["Courtname"];
                        string Stages = data.data[i].Stage;
                        if (String.IsNullOrEmpty(Courtname))
                        {
                            Courtname = "";
                        }
                        string CaseType = data.data[i]["CaseType"];
                        if (String.IsNullOrEmpty(CaseType))
                        {
                            CaseType = "";
                        }
                        string Caseno = data.data[i]["Caseno"];
                        if (String.IsNullOrEmpty(Caseno))
                        {
                            Caseno = "";
                        }
                        string Caseyear = data.data[i]["Caseyear"];
                        if (String.IsNullOrEmpty(Caseyear))
                        {
                            Caseyear = "";
                        }
                        string Benchname = data.data[i]["Benchname"];
                        if (String.IsNullOrEmpty(Benchname))
                        {
                            Benchname = "";
                        }
                        string CourtNo = data.data[i]["CourtNo"];
                        if (String.IsNullOrEmpty(CourtNo))
                        {
                            CourtNo = "";
                        }
                        string JudgeName = data.data[i]["JudgName"];
                        if (String.IsNullOrEmpty(JudgeName))
                        {
                            JudgeName = "";
                        }
                        string SessionTime = data.data[i]["SessionTime"];
                        if (String.IsNullOrEmpty(SessionTime))
                        {
                            SessionTime = "";
                        }
                        string CauselistDate = data.data[i]["CauselistDate"];
                        if (String.IsNullOrEmpty(CauselistDate))
                        {
                            CauselistDate = "";
                        }
                        string CauselistDetail = data.data[i]["Filetext"];
                        if (String.IsNullOrEmpty(CauselistDetail))
                        {
                            CauselistDetail = "";
                        }
                        //string Partyname = data.data[i]["Partyname"];
                        //if (String.IsNullOrEmpty(Partyname))
                        //{
                        //    Partyname = "";
                        //}
                        string DiaryNo = data.data[i]["DiaryNo"];
                        if (String.IsNullOrEmpty(DiaryNo))
                        {
                            DiaryNo = "";
                        }
                        string DiaryYear = data.data[i]["DiaryYear"];
                        if (String.IsNullOrEmpty(DiaryYear))
                        {
                            DiaryYear = "";
                        }
                        // Add parts to the list.
                        CauseList.Add(new ExportDailyCauseListForCW
                        {
                            Courtname = Courtname,
                            CaseType = CaseType,
                            Caseno = Caseno,
                            Caseyear = Caseyear,
                            CourtNo = CourtNo,
                            JudgeName = JudgeName,
                            CauselistDate = CauselistDate,
                            CauselistDetail = CauselistDetail,
                            DiaryNo = DiaryNo,
                            DiaryYear = DiaryYear,
                            Stage = Stages
                        });
                    }
                    strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                    strtemplate += "  <thead><tr> ";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Court</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Case Type</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Case No.</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Case year</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Court No.</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Judge Name</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Causelist Date</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Causelist Detail</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Stage</th>";
                    strtemplate += "</tr></thead><tbody>";
                    if (CauseList != null)
                    {
                        foreach (ExportDailyCauseListForCW idata in CauseList)
                        {
                            strtemplate += "<tr><td height = '20' align = 'left' valign ='top'  style='padding:0 5px;' >" + idata.Courtname + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.CaseType + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.Caseno + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.Caseyear + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.CourtNo + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.JudgeName + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + String.Format("{0:dd MMM yyyy}", idata.CauselistDate) + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.CauselistDetail + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.Stage + "  </td></tr>";
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
                else if (court.ToString() == "3")
                {
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        accesstoken = AccessTokenDetail,
                        userid = userIdDetail,
                        Courtflag = court,
                        Date = casedate,
                        Searchtext = "",
                        pageindex = pageno,
                        pagesize = pagesizes
                    };
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MyKaseDailyCauselist"), "POST", builders);
                    var param = apiUrl + "CWController=>ExportToPDFCWCauseListDetails=>/API/Search/MyKaseDailyCauselist" + "@" + builders;
                    db.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                    JObject jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    List<ExportMyKaseDistrictCauselist> CauseList = new List<ExportMyKaseDistrictCauselist>();
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        string status = data.Status;
                        string Message = data.Message;
                        string Case = data.data[i].Case;
                        string State = data.data[i].Court;
                        string District = data.data[i].District;
                        string JudgeName = data.data[i]["JudgName"];
                        string SessionTime = data.data[i]["SessionTime"];
                        string CourtComplexCourtEstablishmentType = data.data[i]["Complex_Court_Establishment_Type"];
                        string CourtComplexCourtEstablishment = data.data[i]["Complex_Court_Establishment"];
                        string CauselistDate = data.data[i]["CauselistDate"];
                        string CauselistDetail = data.data[i]["CauselistDetail"];
                        string CourtNo = data.data[i]["Court No"];
                        string PartyName = data.data[i]["Partyname"];
                        // Add parts to the list.
                        CauseList.Add(new ExportMyKaseDistrictCauselist
                        {
                            Case = Case,
                            State = State,
                            District = District,
                            JudgeName = JudgeName,
                            courtestablishment = CourtComplexCourtEstablishment,
                            CauselistDate = CauselistDate,
                            CauselistDetail = CauselistDetail,
                            CourtNo = CourtNo,
                           // PartyName = PartyName,
                        });
                    }
                    strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                    strtemplate += "  <thead><tr> ";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Case</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>State</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>District</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Judge Name</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Causelist Date</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Causelist Detail</th>";
                    strtemplate += "</tr></thead><tbody>";
                    if (CauseList != null)
                    {
                        foreach (ExportMyKaseDistrictCauselist idata in CauseList)
                        {
                            strtemplate += "<tr><td height = '20' align = 'left' valign ='top'  style='padding:0 5px;' >" + idata.Case + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.State + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.District + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.JudgeName + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + String.Format("{0:dd MMM yyyy}", idata.CauselistDate) + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.CauselistDetail + "  </td>";
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
                else if (court.ToString() == "RERH")
                {
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        accesstoken = AccessTokenDetail,
                        userid = userIdDetail,
                        Courtflag = court,
                        Date = casedate,
                        Searchtext = "",
                        pageindex = pageno,
                        pagesize = pagesizes
                    };
                    addfClient.Encoding = Encoding.UTF8;
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    addfClient.Headers.Add("Accept-Charset", "utf-8");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MyKaseDailyCauselist"), "POST", builders);
                    var param = apiUrl + "CWController=>ExportToPDFCWCauseListDetails=>/API/Search/MyKaseDailyCauselist" + "@" + builders;
                    db.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                    JObject jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    List<ExportMyKaseRevenueCauselist> revCauseList = new List<ExportMyKaseRevenueCauselist>();
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        string status = data.Status;
                        string Message = data.Message;
                        string PartyName = data.data[i]["vCaseName"];
                        string CourtName = data.data[i]["Courtname"];
                        string Court = data.data[i].vCourt;
                        string JudgeName = data.data[i]["AppealNo"];
                        string CauselistDate = data.data[i]["vCauselistDate"];
                        string Stages = data.data[i].vStatus;
                        string ItemNo = data.data[i].vItemNo;
                        // Add parts to the list.
                        revCauseList.Add(new ExportMyKaseRevenueCauselist
                        {
                            Case = PartyName,
                            CourtName = CourtName,
                            Court = Court,
                            AppealNo = JudgeName,
                            CauselistDate = CauselistDate,
                            Stage = Stages,
                            ItemNo = ItemNo,

                        });
                    }
                    strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                    strtemplate += "  <thead><tr> ";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Case</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>CourtName</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Court</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>AppealNo</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>CauselistDate</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Stage</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>ItemNo</th>";
                    strtemplate += "</tr></thead><tbody>";
                    if (revCauseList != null)
                    {
                        foreach (ExportMyKaseRevenueCauselist idata in revCauseList)
                        {
                            strtemplate += "<tr>";  // Start row

                            strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'>" + idata.Case + "</td>";
                            strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'>" + idata.CourtName + "</td>";
                            strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'>" + idata.Court + "</td>";
                            strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'>" + idata.AppealNo + "</td>";
                            strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'>" + idata.CauselistDate + "</td>";
                            strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'>" + idata.Stage + "</td>";
                            strtemplate += "<td height='20' align='left' valign='top' style='padding:0 5px;'>" + idata.ItemNo + "</td>";

                            strtemplate += "</tr>"; // End row
                        }
                        strtemplate += "</tbody></table>";
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
                else if (court.ToString() == "4")
                {
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        accesstoken = AccessTokenDetail,
                        userid = userIdDetail,
                        Courtflag = court,
                        Date = casedate,
                        Searchtext = "",
                        pageindex = pageno,
                        pagesize = pagesizes
                    };
                    addfClient.Encoding = System.Text.Encoding.UTF8;
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/DailyTribunalCauselist"), "POST", builders);
                    var param = apiUrl + "CWController=>ExportToPDFCWCauseListDetails=>/API/Search/DailyTribunalCauselist" + "@" + builders;
                    db.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                    JObject jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    List<ExportDailyCauseList> CauseList = new List<ExportDailyCauseList>();
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        string status = data.Status;
                        string Message = data.Message;
                        string Courtname = data.data[i]["Court"];
                        if (String.IsNullOrEmpty(Courtname))
                        {
                            Courtname = "";
                        }
                        string CaseType = data.data[i]["Case Type"];
                        if (String.IsNullOrEmpty(CaseType))
                        {
                            CaseType = "";
                        }
                        string Caseno = data.data[i]["Case no"];
                        if (String.IsNullOrEmpty(Caseno))
                        {
                            Caseno = "";
                        }
                        string Caseyear = data.data[i]["Case Year"];
                        if (String.IsNullOrEmpty(Caseyear))
                        {
                            Caseyear = "";
                        }
                        string Benchname = data.data[i]["Bench Name"];
                        if (String.IsNullOrEmpty(Benchname))
                        {
                            Benchname = "";
                        }
                        string CourtNo = data.data[i]["Court No."];
                        if (String.IsNullOrEmpty(CourtNo))
                        {
                            CourtNo = "";
                        }
                        string JudgeName = data.data[i]["Judge Name"];
                        if (String.IsNullOrEmpty(JudgeName))
                        {
                            JudgeName = "";
                        }
                        string SessionTime = data.data[i]["Session Time"];
                        if (String.IsNullOrEmpty(SessionTime))
                        {
                            SessionTime = "";
                        }
                        string CauselistDate = data.data[i]["Causelist Date"];
                        if (String.IsNullOrEmpty(CauselistDate))
                        {
                            CauselistDate = "";
                        }
                        string CauselistDetail = data.data[i]["Causelist Detail"];
                        if (String.IsNullOrEmpty(CauselistDetail))
                        {
                            CauselistDetail = "";
                        }
                        string Partyname = data.data[i]["Partyname"];
                        if (String.IsNullOrEmpty(Partyname))
                        {
                            Partyname = "";
                        }
                        // Add parts to the list.
                        CauseList.Add(new ExportDailyCauseList
                        {
                            Courtname = Courtname,
                            CaseType = CaseType,
                            Caseno = Caseno,
                            Caseyear = Caseyear,
                            // Benchname = Benchname,
                            CourtNo = CourtNo,
                            JudgeName = JudgeName,
                            CauselistDate = CauselistDate,
                            CauselistDetail = CauselistDetail,
                            //  Partyname = Partyname,
                        });
                    }
                    strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                    strtemplate += "  <thead><tr> ";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Court</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Case Type</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Case No.</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Case year</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Judge Name</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Causelist Date</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Causelist Detail</th>";
                    strtemplate += "</tr></thead><tbody>";
                    if (CauseList != null)
                    {
                        foreach (ExportDailyCauseList idata in CauseList)
                        {
                            strtemplate += "<tr><td height = '20' align = 'left' valign ='top'  style='padding:0 5px;' >" + idata.Courtname + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.CaseType + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.Caseno + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.Caseyear + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.JudgeName + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + String.Format("{0:dd MMM yyyy}", idata.CauselistDate) + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.CauselistDetail + "  </td></tr>";
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
                else
                {
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        accesstoken = AccessTokenDetail,
                        userid = userIdDetail,
                        Courtflag = court,
                        Date = casedate,
                        Searchtext = "",
                        pageindex = pageno,
                        pagesize = pagesizes
                    };
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MyKaseDailyCauselist"), "POST", builders);
                    var param = apiUrl + "CWController=>ExportToPDFCWCauseListDetails=>/API/Search/MyKaseDailyCauselist" + "@" + builders;
                    db.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                    JObject jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    List<ExportDailyCauseList> CauseList = new List<ExportDailyCauseList>();
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        string status = data.Status;
                        string Message = data.Message;
                        string Courtname = data.data[i]["Courtname"];
                        string Stages = data.data[i].Stage;
                        if (String.IsNullOrEmpty(Courtname))
                        {
                            Courtname = "";
                        }
                        string CaseType = data.data[i]["CaseType"];
                        if (String.IsNullOrEmpty(CaseType))
                        {
                            CaseType = "";
                        }
                        string Caseno = data.data[i]["Caseno"];
                        if (String.IsNullOrEmpty(Caseno))
                        {
                            Caseno = "";
                        }
                        string Caseyear = data.data[i]["Caseyear"];
                        if (String.IsNullOrEmpty(Caseyear))
                        {
                            Caseyear = "";
                        }
                        string Benchname = data.data[i]["Benchname"];
                        if (String.IsNullOrEmpty(Benchname))
                        {
                            Benchname = "";
                        }
                        string CourtNo = data.data[i]["CourtNo"];
                        if (String.IsNullOrEmpty(CourtNo))
                        {
                            CourtNo = "";
                        }
                        string JudgeName = data.data[i]["JudgName"];
                        if (String.IsNullOrEmpty(JudgeName))
                        {
                            JudgeName = "";
                        }
                        string SessionTime = data.data[i]["SessionTime"];
                        if (String.IsNullOrEmpty(SessionTime))
                        {
                            SessionTime = "";
                        }
                        string CauselistDate = data.data[i]["CauselistDate"];
                        if (String.IsNullOrEmpty(CauselistDate))
                        {
                            CauselistDate = "";
                        }
                        string CauselistDetail = data.data[i]["Filetext"];
                        if (String.IsNullOrEmpty(CauselistDetail))
                        {
                            CauselistDetail = "";
                        }
                        string Partyname = data.data[i]["Partyname"];
                        if (String.IsNullOrEmpty(Partyname))
                        {
                            Partyname = "";
                        }
                        // Add parts to the list.
                        CauseList.Add(new ExportDailyCauseList
                        {
                            Courtname = Courtname,
                            CaseType = CaseType,
                            Caseno = Caseno,
                            Caseyear = Caseyear,
                            Benchname = Benchname,
                            CourtNo = CourtNo,
                            JudgeName = JudgeName,
                            CauselistDate = CauselistDate,
                            CauselistDetail = CauselistDetail,
                            Stage = Stages
                            //  Partyname = Partyname,
                        });
                    }
                    strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                    strtemplate += "  <thead><tr> ";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Court</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Case Type</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Case No.</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Case year</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Bench Name</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Judge Name</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Causelist Date</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Causelist Detail</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Stage</th>";
                    strtemplate += "</tr></thead><tbody>";
                    if (CauseList != null)
                    {
                        foreach (ExportDailyCauseList idata in CauseList)
                        {
                            strtemplate += "<tr><td height = '20' align = 'left' valign ='top'  style='padding:0 5px;' >" + idata.Courtname + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.CaseType + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.Caseno + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.Caseyear + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.Benchname + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.JudgeName + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + String.Format("{0:dd MMM yyyy}", idata.CauselistDate) + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.CauselistDetail + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.Stage + "  </td></tr>";
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
            }
            catch (Exception ex)
            {
                db.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                Response.Redirect("/home/Error");
            }
        }
        /// <summary>
        /// Get casewatch cause list
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public JsonResult CWCaseList()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var court = Convert.ToString(QueryAES.UrlDecode(Request.Form["courttype"]));
                var courtname = Convert.ToString(QueryAES.UrlDecode(Request.Form["courtname"]));
                var stateid = Convert.ToString(QueryAES.UrlDecode(Request.Form["stateid"]));
                var districtid = Convert.ToString(QueryAES.UrlDecode(Request.Form["districtid"]));
                var courtcompestname = Convert.ToString(QueryAES.UrlDecode(Request.Form["courtcompestname"]));
                var ditrictcourt = Convert.ToString(QueryAES.UrlDecode(Request.Form["ditrictcourt"]));
                var sortdate = Convert.ToString(QueryAES.UrlDecode(Request.Form["sortdate"]));
                var CaseStatus = Convert.ToString(QueryAES.UrlDecode(Request.Form["CaseStatus"]));
                var hearingfrom = Convert.ToString(QueryAES.UrlDecode(Request.Form["hearingfrom"]));
                var hearingto = Convert.ToString(QueryAES.UrlDecode(Request.Form["hearingto"]));
                var casename = Convert.ToString(QueryAES.UrlDecode(Request.Form["casename"]));
                var searchany = Convert.ToString(QueryAES.UrlDecode(Request.Form["searchany"]));
                var tagname = Convert.ToString(QueryAES.UrlDecode(Request.Form["tagname"]));
                var benchname = Convert.ToString(QueryAES.UrlDecode(Request.Form["benchname"]));
                if (String.IsNullOrEmpty(court) || court == "null" || court == "0") { court = ""; }
                if (String.IsNullOrEmpty(courtname) || courtname == "null" || courtname == "0") { courtname = ""; }
                if (String.IsNullOrEmpty(stateid) || stateid == "null" || stateid == "0") { stateid = ""; }
                if (String.IsNullOrEmpty(districtid) || districtid == "null" || districtid == "0") { districtid = ""; }
                if (String.IsNullOrEmpty(courtcompestname) || courtcompestname == "null" || courtcompestname == "0") { courtcompestname = ""; }
                if (String.IsNullOrEmpty(ditrictcourt) || ditrictcourt == "null" || ditrictcourt == "0") { ditrictcourt = ""; }
                if (String.IsNullOrEmpty(sortdate) || sortdate == "null" || sortdate == "0") { sortdate = ""; }
                if (String.IsNullOrEmpty(CaseStatus) || CaseStatus == "null" || CaseStatus == "0") { CaseStatus = ""; }
                if (String.IsNullOrEmpty(hearingfrom) || hearingfrom == "null" || hearingfrom == "0") { hearingfrom = ""; }
                if (String.IsNullOrEmpty(hearingto) || hearingto == "null" || hearingto == "0") { hearingto = ""; }
                if (String.IsNullOrEmpty(tagname) || tagname == "null" || tagname == "0") { tagname = ""; }
                if (String.IsNullOrEmpty(benchname) || benchname == "null" || benchname == "0") { benchname = ""; }
                List<CWCaseList> casedeatils = new List<CWCaseList>();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                string search = "";
                search = Convert.ToString(QueryAES.UrlDecode(Request.Form["search"]));
                int pagesize = 10, pageindex = 1;
                pageindex = Convert.ToInt32(QueryAES.UrlDecode(Request.Form["pagenum"]));
                pagesize = Convert.ToInt32(QueryAES.UrlDecode(Request.Form["pagesize"]));
                var db = new LawPracticeEntities();
                string joineduser = "";
                joineduser = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = joineduser;
                }

                var Iflag = 0;
                if (LoggedInUser.RoleId == 1)
                {
                    Iflag = 1;
                }
                if (court == "3") // for district court
                {
                    if (!String.IsNullOrEmpty(ditrictcourt))
                    {
                        //court = ditrictcourt;
                    }
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        Accesstoken = AccessTokenDetail,
                        userid = userIdDetail,
                        stateid = stateid,
                        districtid = districtid,
                        courtcompestname = ditrictcourt,
                        courttype = court,
                        iflag = Iflag,
                        pageindex = pageindex,
                        pagesize = pagesize,
                        pstatus = CaseStatus,
                        nextdatesorting = sortdate,
                        CaseId = "",
                        SearchText = casename,
                        fromdate = hearingfrom,
                        todate = hearingto,
                        istype = searchany,
                        taggedname = tagname,
                        bench = benchname
                    };
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MyCases"), "POST", builders);
                    var param = apiUrl + "CWController=>CWCaseList=>/API/Search/MyCases" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                    dynamic jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        int tempusercaseid = Convert.ToInt32(data.data[i]["UserCaseId"]);
                        var matterIDCase = db.Usp_MattersDetilsForCW(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), tempusercaseid.ToString()).FirstOrDefault();
                        casedeatils.Add(new CWCaseList
                        {
                            CaseId = Convert.ToString(data.data[i]["CaseId"]),
                            CaseDiary = Convert.ToString(data.data[i]["Case/Diary"]),
                            Court = data.data[i]["CourtName"],
                            CaseName = (data.data[i]["iCaseNotFound"] == 1 ? "Case not available" : data.data[i]["Case Name"]),
                            BenchName = Convert.ToString(data.data[i]["Bench Name"]),
                            Advocate = data.data[i]["Advocate"],
                            NextHearing = data.data[i]["Next Hearing"],
                            DisposedDate = data.data[i]["Disposed Date"],
                            Status = data.data[i]["Status"],
                            District = data.data[i]["District"],
                            CourtComplexCourtEstablishmentType = data.data[i]["Court Complex/Court Establishment Type"],
                            CourtComplexCourtEstablishment = data.data[i]["Court Complex/Court Establishment"],
                            CourttypeId = data.data[i]["CourttypeId"],
                            CourtId = data.data[i]["CourtId"],
                            DistrictId = data.data[i]["DistrictId"],
                            TaggedName = data.data[i]["TaggedName"],
                            iCaseNotFound = data.data[i]["iCaseNotFound"],
                            RowId = data.data[i]["RowId"],
                            TotalRecord = data.data[i]["TotalRecord"],
                            UserCaseId = Convert.ToString(data.data[i]["UserCaseId"]),
                            MatterID = matterIDCase == null ? "" : matterIDCase.Id.ToString(),
                            MatterName = matterIDCase == null ? "" : matterIDCase.mname.ToString(),
                        });
                    }
                    return Json(casedeatils, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        Accesstoken = AccessTokenDetail,
                        userid = userIdDetail,
                        court = courtname,
                        courttype = court,
                        iflag = Iflag,
                        pageindex = pageindex,
                        pagesize = pagesize,
                        pstatus = CaseStatus,
                        nextdatesorting = sortdate,
                        CaseId = "",
                        SearchText = casename,
                        fromdate = hearingfrom,
                        todate = hearingto,
                        istype = searchany,
                        taggedname = tagname,
                        bench = benchname
                    };
                    addfClient.Encoding = System.Text.Encoding.UTF8;
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MyCases"), "POST", builders);
                    var param = apiUrl + "CWController=>CWCaseList=>/API/Search/MyCases" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                    dynamic jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    if (data1 != null)
                    {
                        for (int i = 0; i < data1.Count; i++)
                        {
                            dynamic data = JObject.Parse(resid);
                            int tempusercaseid = Convert.ToInt32(data.data[i]["UserCaseId"]);
                            var matterIDCase = db.Usp_MattersDetilsForCW(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), tempusercaseid.ToString()).FirstOrDefault();
                            casedeatils.Add(new CWCaseList
                            {
                                UserCaseId = Convert.ToString(data.data[i]["UserCaseId"]),
                                CaseId = Convert.ToString(data.data[i]["CaseId"]),
                                CaseDiary = Convert.ToString(data.data[i]["Case/Diary"]),
                                Court = data.data[i]["CourtName"],
                                CaseName = (data.data[i]["iCaseNotFound"] == 1 ? "Case not available" : data.data[i]["Case Name"]),
                                BenchName = Convert.ToString(data.data[i]["Bench Name"]),
                                Advocate = data.data[i]["Advocate"],
                                NextHearing = data.data[i]["Next Hearing"],
                                DisposedDate = data.data[i]["Disposed Date"],
                                Status = data.data[i]["Status"],
                                District = data.data[i]["District"],
                                CourtComplexCourtEstablishmentType = data.data[i]["Court Complex/Court Establishment Type"],
                                CourtComplexCourtEstablishment = data.data[i]["Court Complex/Court Establishment"],
                                CourttypeId = data.data[i]["CourttypeId"],
                                CourtId = data.data[i]["CourtId"],
                                DistrictId = data.data[i]["DistrictId"],
                                TaggedName = data.data[i]["TaggedName"],
                                RowId = data.data[i]["RowId"],
                                TotalRecord = data.data[i]["TotalRecord"],
                                MatterID = matterIDCase == null ? "" : matterIDCase.Id.ToString(),
                                MatterName = matterIDCase == null ? "" : matterIDCase.mname.ToString(),
                            });
                        }
                    }
                    return Json(casedeatils, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Search details in casewatch list
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public JsonResult CWCaseListSearch()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var court = Convert.ToString(QueryAES.UrlDecode(Request.Form["courttype"]));
                var courtname = Convert.ToString(QueryAES.UrlDecode(Request.Form["courtname"]));
                var stateid = Convert.ToString(QueryAES.UrlDecode(Request.Form["stateid"]));
                var districtid = Convert.ToString(QueryAES.UrlDecode(Request.Form["districtid"]));
                var courtcompestname = Convert.ToString(QueryAES.UrlDecode(Request.Form["courtcompestname"]));
                var ditrictcourt = Convert.ToString(QueryAES.UrlDecode(Request.Form["ditrictcourt"]));
                var sortdate = Convert.ToString(QueryAES.UrlDecode(Request.Form["sortdate"]));
                var CaseStatus = Convert.ToString(QueryAES.UrlDecode(Request.Form["CaseStatus"]));
                var hearingfrom = Convert.ToString(QueryAES.UrlDecode(Request.Form["hearingfrom"]));
                var hearingto = Convert.ToString(QueryAES.UrlDecode(Request.Form["hearingto"]));
                var casename = Convert.ToString(QueryAES.UrlDecode(Request.Form["casename"]));
                var searchany = Convert.ToString(QueryAES.UrlDecode(Request.Form["searchany"]));
                var tagname = Convert.ToString(QueryAES.UrlDecode(Request.Form["tagname"]));
                var benchname = Convert.ToString(QueryAES.UrlDecode(Request.Form["benchname"]));
                if (String.IsNullOrEmpty(court) || court == "null" || court == "0") { court = ""; }
                if (String.IsNullOrEmpty(courtname) || courtname == "null" || courtname == "0") { courtname = ""; }
                if (String.IsNullOrEmpty(stateid) || stateid == "null" || stateid == "0") { stateid = ""; }
                if (String.IsNullOrEmpty(districtid) || districtid == "null" || districtid == "0") { districtid = ""; }
                if (String.IsNullOrEmpty(courtcompestname) || courtcompestname == "null" || courtcompestname == "0") { courtcompestname = ""; }
                if (String.IsNullOrEmpty(ditrictcourt) || ditrictcourt == "null" || ditrictcourt == "0") { ditrictcourt = ""; }
                if (String.IsNullOrEmpty(sortdate) || sortdate == "null" || sortdate == "0") { sortdate = ""; }
                if (String.IsNullOrEmpty(CaseStatus) || CaseStatus == "null" || CaseStatus == "0") { CaseStatus = ""; }
                if (String.IsNullOrEmpty(hearingfrom) || hearingfrom == "null" || hearingfrom == "0") { hearingfrom = ""; }
                if (String.IsNullOrEmpty(hearingto) || hearingto == "null" || hearingto == "0") { hearingto = ""; }
                if (String.IsNullOrEmpty(tagname) || tagname == "null" || tagname == "0") { tagname = ""; }
                if (String.IsNullOrEmpty(benchname) || benchname == "null" || benchname == "0") { benchname = ""; }
                List<CWCaseList> casedeatils = new List<CWCaseList>();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                string search = "";
                search = Convert.ToString(QueryAES.UrlDecode(Request.Form["search"]));
                int pagesize = 10, pageindex = 1;
                pageindex = Convert.ToInt32(QueryAES.UrlDecode(Request.Form["pagenum"]));
                pagesize = Convert.ToInt32(QueryAES.UrlDecode(Request.Form["pagesize"]));
                var db = new LawPracticeEntities();
                string joineduser = "";
                joineduser = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();

                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }

                var Iflag = 0;
                if (LoggedInUser.RoleId == 1)
                {
                    Iflag = 1;
                }
                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    userid = userIdDetail,
                    court = courtname,
                    courttype = "",
                    iflag = Iflag,
                    pageindex = pageindex,
                    pagesize = pagesize,
                    pstatus = "",
                    nextdatesorting = "",
                    CaseId = "",
                    SearchText = casename,
                    fromdate = hearingfrom,
                    todate = hearingto,
                    istype = searchany,
                    taggedname = tagname,
                    bench = benchname
                };
                addfClient.Encoding = System.Text.Encoding.UTF8;
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MyCases"), "POST", builders);
                var param = apiUrl + "CWController=>CWCaseList=>/API/Search/MyCases" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                if (data1 != null)
                {
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        int tempusercaseid = Convert.ToInt32(data.data[i]["UserCaseId"]);
                        var matterIDCase = db.Usp_MattersDetilsForCW(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), tempusercaseid.ToString()).FirstOrDefault();
                        //string status = data.Status;
                        casedeatils.Add(new CWCaseList
                        {
                            UserCaseId = Convert.ToString(data.data[i]["UserCaseId"]),
                            CaseId = Convert.ToString(data.data[i]["CaseId"]),
                            CaseDiary = Convert.ToString(data.data[i]["Case/Diary"]),
                            Court = data.data[i]["CourtName"],
                            CaseName = (data.data[i]["iCaseNotFound"] == 1 ? "Case not available" : data.data[i]["Case Name"]),
                            NextHearing = data.data[i]["Next Hearing"],
                            TotalRecord = data.data[i]["TotalRecord"],
                            Status = data.data[i]["Status"],
                            MatterID = matterIDCase == null ? "" : matterIDCase.Id.ToString(),
                            MatterName = matterIDCase == null ? "" : matterIDCase.mname.ToString(),
                        });
                    }
                }
                casedeatils = casedeatils.OrderBy(x => x.NextHearing).ToList();
                return Json(casedeatils, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Add case to archive list
        /// </summary>
        /// <param name="typeIds"></param>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public JsonResult AddCasetoArchive(string[] typeIds)
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                var userId = strusername + LoggedInUser.UserId.ToString();

                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }

                foreach (string caseid in typeIds)
                {
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        Accesstoken = AccessTokenDetail,
                        userid = userIdDetail,
                        caseid = caseid
                    };
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AddCasetoArchive"), "POST", builders);
                    var param = apiUrl + "CWController=>AddCasetoArchive=>/API/Search/AddCasetoArchive" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                    dynamic data = JObject.Parse(resid);
                    string status = data.Status;
                    string Message = data.Message;
                    string dataval = data.data;
                }
                return Json("sucess", JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Remove case from archive list
        /// </summary>
        /// <param name="typeIds"></param>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public JsonResult RemoveCasetoArchive(string[] typeIds)
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                var userId = strusername + LoggedInUser.UserId.ToString();

                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }

                foreach (string caseid in typeIds)
                {
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        Accesstoken = AccessTokenDetail,
                        userid = userIdDetail,
                        caseid = caseid
                    };
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/RemoveArchivedCase"), "POST", builders);
                    var param = apiUrl + "CWController=>RemoveCasetoArchive=>/API/Search/RemoveArchivedCase" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                    dynamic data = JObject.Parse(resid);
                    string status = data.Status;
                    string Message = data.Message;
                }
                return Json("success", JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// Get casewatch archive cases
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public JsonResult CWMyArchiveCases()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var court = Convert.ToString(QueryAES.UrlDecode(Request.Form["courttype"]));
                var courtname = Convert.ToString(QueryAES.UrlDecode(Request.Form["courtname"]));
                var stateid = Convert.ToString(QueryAES.UrlDecode(Request.Form["stateid"]));
                var districtid = Convert.ToString(QueryAES.UrlDecode(Request.Form["districtid"]));
                var courtcompestname = Convert.ToString(QueryAES.UrlDecode(Request.Form["courtcompestname"]));
                var ditrictcourt = Convert.ToString(QueryAES.UrlDecode(Request.Form["ditrictcourt"]));
                if (String.IsNullOrEmpty(court) || court == "null" || court == "0") { court = ""; }
                if (String.IsNullOrEmpty(courtname) || courtname == "null" || courtname == "0") { courtname = ""; }
                if (String.IsNullOrEmpty(stateid) || stateid == "null" || stateid == "0") { stateid = ""; }
                if (String.IsNullOrEmpty(districtid) || districtid == "null" || districtid == "0") { districtid = ""; }
                if (String.IsNullOrEmpty(courtcompestname) || courtcompestname == "null" || courtcompestname == "0") { courtcompestname = ""; }
                if (String.IsNullOrEmpty(ditrictcourt) || ditrictcourt == "null" || ditrictcourt == "0") { ditrictcourt = ""; }
                List<CWArchiveCaseList> casedeatils = new List<CWArchiveCaseList>();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                string search = "";
                search = Convert.ToString(QueryAES.UrlDecode(Request.Form["search"]));
                int pagesize = 10, pageindex = 1;
                pageindex = Convert.ToInt32(QueryAES.UrlDecode(Request.Form["pagenum"]));
                pagesize = Convert.ToInt32(QueryAES.UrlDecode(Request.Form["pagesize"]));
                string joineduser = "";
                var db = new LawPracticeEntities();
                joineduser = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();

                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = joineduser;
                }

                var Iflag = 0;
                if (LoggedInUser.RoleId == 1)
                {
                    Iflag = 1;
                }
                if (court == "3") // for district court
                {
                    if (!String.IsNullOrEmpty(ditrictcourt))
                    {
                        court = ditrictcourt;
                    }
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        Accesstoken = AccessTokenDetail,
                        userid = userIdDetail,
                        stateid = stateid,
                        districtid = districtid,
                        courtcompestname = courtcompestname,
                        courttype = court,
                        iflag = Iflag,
                        pageindex = pageindex,
                        pagesize = pagesize,
                        Caseid = ""
                    };
                    addfClient.Encoding = System.Text.Encoding.UTF8;
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MyArchiveCases"), "POST", builders);
                    var param = apiUrl + "CWController=>CWMyArchiveCases=>/API/Search/MyArchiveCases" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                    dynamic jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        //string status = data.Status;
                        casedeatils.Add(new CWArchiveCaseList
                        {
                            CaseId = Convert.ToString(data.data[i]["CaseId"]),
                            UserCaseId = Convert.ToString(data.data[i]["UserCaseId"]),
                            CaseDairy = Convert.ToString(data.data[i]["Case/Diary"]),
                            Court = data.data[i].Court,
                            CaseName = (data.data[i]["iCaseNotFound"] == 1 ? "Case not available" : data.data[i]["Case Name"]),
                            Advocate = data.data[i]["Advocate"],
                            NextHearing = data.data[i]["Next Hearing"],
                            DisposedDate = data.data[i]["Disposed Date"],
                            Status = data.data[i]["Status"],
                            CourtComplexCourtEstablishmentType =(data.data[i]["Court Complex/Court Establishment Type"] == null ? "" : data.data[i]["Court Complex/Court Establishment Type"]),
                            //CourtComplexCourtEstablishmentType = data.data[i]["Court Complex/Court Establishment Type"],
                            //CourtComplexCourtEstablishment = data.data[i]["Court Complex/Court Establishment"],
                            CourtComplexCourtEstablishment = (data.data[i]["Court Complex/Court Establishment"] == null ? "" : data.data[i]["Court Complex/Court Establishment"]),
                            RowId = data.data[i]["RowId"],
                            TotalRecord = data.data[i]["TotalRecord"],
                        });
                    }
                    return Json(casedeatils, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        Accesstoken = AccessTokenDetail,
                        userid = userIdDetail,
                        court = courtname,
                        courttype = court,
                        iflag = Iflag,
                        pageindex = pageindex,
                        pagesize = pagesize,
                        Caseid = ""
                    };
                    addfClient.Encoding = System.Text.Encoding.UTF8;
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MyArchiveCases"), "POST", builders);
                    var param = apiUrl + "CWController=>CWMyArchiveCases=>/API/Search/MyArchiveCases" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                    dynamic jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        casedeatils.Add(new CWArchiveCaseList
                        {
                            UserCaseId = Convert.ToString(data.data[i]["UserCaseId"]),
                            CaseId = Convert.ToString(data.data[i]["CaseId"]),
                            CaseDairy = Convert.ToString(data.data[i]["Case/Diary"]),
                            Court = data.data[i].Court,
                            CaseName = (data.data[i]["iCaseNotFound"] == 1 ? "Case not available" : data.data[i]["Case Name"]),
                            Advocate = data.data[i]["Advocate"],
                            NextHearing = data.data[i]["Next Hearing"],
                            DisposedDate = data.data[i]["Disposed Date"],
                            Status = data.data[i]["Status"],
                            RowId = data.data[i]["RowId"],
                            TotalRecord = data.data[i]["TotalRecord"],
                        });
                    }
                    return Json(casedeatils, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Get all casewatch list details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public JsonResult AllCWCauseListDetails()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var casedate = QueryAES.UrlDecode(Request.Form["casedate"]);
                var court = QueryAES.UrlDecode(Request.Form["court"]);
                var pageno = QueryAES.UrlDecode(Request.Form["pageno"]);
                var pagesizes = QueryAES.UrlDecode(Request.Form["pagesize"]);
                var fromdate = QueryAES.UrlDecode(Request.Form["fromdate"]);
                var todate = QueryAES.UrlDecode(Request.Form["todate"]);
                string joineduser = "";
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                var db = new LawPracticeEntities();
                joineduser = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];

                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = joineduser;
                }

                //add login data
                var addfClient = new MyWebClient();
                if (court.ToString() == "3")
                {
                    object rawfile = new
                    {
                        accesstoken = AccessTokenDetail,
                        userid = userIdDetail,
                        Courtflag = court,
                        stateid = "",
                        iflag = 1,
                        districtid = "",
                        courtcompcode = "",
                        searchtext = "",
                        pageindex = pageno,
                        pagesize = pagesizes,
                        Datefrom= fromdate,
                        Dateto= todate
                    };
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MykaseAllCauselistData"), "POST", builders);
                    var param = apiUrl + "CWController=>AllCWCauseListDetails=>/API/Search/MykaseAllCauselistData" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                    JObject jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    List<MyKaseDistrictCauselist> CauseList = new List<MyKaseDistrictCauselist>();
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        string status = data.Status;
                        string Message = data.Message;
                        string Case = data.data[i].Case;
                        string State = data.data[i].State;
                        string District = data.data[i].District;
                        string JudgeName = data.data[i]["JudgName"];
                        string SessionTime = data.data[i]["SessionTime"];
                        string CourtComplexCourtEstablishmentType = data.data[i]["CourtComplex_CourtEstablishmentType"];
                        string CourtComplexCourtEstablishment = data.data[i]["CourtComplex_CourtEstablishment"];
                        string CauselistDate = data.data[i]["CauselistDate"];
                        string CauselistDetail = data.data[i]["CauselistDetail"];
                        string CourtNo = data.data[i]["Court No"];
                        string PartyName = data.data[i]["Partyname"];
                        string Caseid = data.data[i].CaseId;
                        string RowId = data.data[i]["RowId"];
                        string TotalRecord = data.data[i]["TotalRecord"];
                        string MasterCaseId = data.data[i].MasterCaseId;
                        string UserCaseId = data.data[i].UserCaseId;
                        string Stages = data.data[i].Stage;
                        // Add parts to the list.
                        CauseList.Add(new MyKaseDistrictCauselist
                        {
                            Case = Case,
                            State = State,
                            District = District,
                            JudgeName = JudgeName,
                            SessionTime = SessionTime,
                            CourtComplexCourtEstablishmentType = CourtComplexCourtEstablishmentType,
                            CourtComplexCourtEstablishment = CourtComplexCourtEstablishment,
                            CauselistDate = CauselistDate,
                            CauselistDetail = CauselistDetail,
                            CourtNo = CourtNo,
                            PartyName = PartyName,
                            Stage = Stages,
                            CaseId = Caseid,
                            RowId = RowId,
                            TotalRecord = TotalRecord,
                            MasterCaseId = MasterCaseId,
                            UserCaseId = UserCaseId
                        });
                    }
                    return Json(CauseList, JsonRequestBehavior.AllowGet);
                }
                else if (court.ToString() == "4")
                {
                    object rawfile = new
                    {
                        accesstoken = AccessTokenDetail,
                        userid = userIdDetail,
                        court = "",
                        Courtflag = court,
                        iflag = 1,
                        searchtext = "",
                        pageindex = pageno,
                        pagesize = pagesizes,
                        Datefrom = fromdate,
                        Dateto = todate
                    };
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MykaseAllTribunalCauselistData"), "POST", builders);
                    var param = apiUrl + "CWController=>AllCWCauseListDetails=>/API/Search/MykaseAllTribunalCauselistData" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                    JObject jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    List<MyKaseDailyCauselist> CauseList = new List<MyKaseDailyCauselist>();
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        string status = data.Status;
                        string Message = data.Message;
                        string Courtname = data.data[i]["Court"];
                        if (String.IsNullOrEmpty(Courtname))
                        {
                            Courtname = "";
                        }
                        string CaseType = data.data[i]["CaseType"];
                        if (String.IsNullOrEmpty(CaseType))
                        {
                            CaseType = "";
                        }
                        string Caseno = data.data[i]["Caseno"];
                        if (String.IsNullOrEmpty(Caseno))
                        {
                            Caseno = "";
                        }
                        string Caseyear = data.data[i]["Caseyear"];
                        if (String.IsNullOrEmpty(Caseyear))
                        {
                            Caseyear = "";
                        }
                        string Benchname = data.data[i]["BenchName"];
                        if (String.IsNullOrEmpty(Benchname))
                        {
                            Benchname = "";
                        }
                        string CourtNo = data.data[i]["CourtNo"];
                        if (String.IsNullOrEmpty(CourtNo))
                        {
                            CourtNo = "";
                        }
                        string JudgeName = data.data[i]["JudgName"];
                        if (String.IsNullOrEmpty(JudgeName))
                        {
                            JudgeName = "";
                        }
                        string SessionTime = data.data[i]["SessionTime"];
                        if (String.IsNullOrEmpty(SessionTime))
                        {
                            SessionTime = "";
                        }
                        string CauselistDate = data.data[i]["CauselistDate"];
                        if (String.IsNullOrEmpty(CauselistDate))
                        {
                            CauselistDate = "";
                        }
                        string CauselistDetail = data.data[i]["CauselistDetail"];
                        if (String.IsNullOrEmpty(CauselistDetail))
                        {
                            CauselistDetail = "";
                        }
                        string Partyname = data.data[i]["Partyname"];
                        if (String.IsNullOrEmpty(Partyname))
                        {
                            Partyname = "";
                        }
                        string Caseid = data.data[i].CaseId;
                        string RowId = data.data[i]["RowId"];
                        string TotalRecord = data.data[i]["TotalRecord"];
                        string MasterCaseId = data.data[i].MasterCaseId;
                        string UserCaseId = data.data[i].UserCaseId;
                        string Stages = data.data[i].Stage;
                        // Add parts to the list.
                        CauseList.Add(new MyKaseDailyCauselist
                        {
                            Courtname = Courtname,
                            CaseType = CaseType,
                            Caseno = Caseno,
                            Caseyear = Caseyear,
                            Benchname = Benchname,
                            CourtNo = CourtNo,
                            JudgeName = JudgeName,
                            SessionTime = SessionTime,
                            CauselistDate = CauselistDate,
                            CauselistDetail = CauselistDetail,
                            Partyname = Partyname,
                            Stage = Stages,
                            CaseId = Caseid,
                            RowId = RowId,
                            TotalRecord = TotalRecord,
                            MasterCaseId = MasterCaseId,
                            UserCaseId = UserCaseId
                        });
                    }
                    return Json(CauseList, JsonRequestBehavior.AllowGet);
                }
                else if (court.ToString() == "7")
                {
                    object rawfile = new
                    {
                        accesstoken = AccessTokenDetail,
                        userid = userIdDetail,
                        court = "",
                        Courtflag = court,
                        iflag = 1,
                        searchtext = "",
                        pageindex = pageno,
                        pagesize = pagesizes,
                        Datefrom = fromdate,
                        Dateto = todate
                    };
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MykaseAllCauselistData"), "POST", builders);
                    var param = apiUrl + "CWController=>AllCWCauseListDetails=>/API/Search/MykaseAllCauselistData" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                    JObject jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    List<MyKaseDailyCauselist> CauseList = new List<MyKaseDailyCauselist>();
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        string status = data.Status;
                        string Message = data.Message;
                        string Courtname = data.data[i]["Courtname"];
                        if (String.IsNullOrEmpty(Courtname))
                        {
                            Courtname = "";
                        }
                        string CaseType = data.data[i]["CaseType"];
                        if (String.IsNullOrEmpty(CaseType))
                        {
                            CaseType = "";
                        }
                        string Caseno = data.data[i]["Caseno"];
                        if (String.IsNullOrEmpty(Caseno))
                        {
                            Caseno = "";
                        }
                        string Caseyear = data.data[i]["Caseyear"];
                        if (String.IsNullOrEmpty(Caseyear))
                        {
                            Caseyear = "";
                        }
                        string Benchname = data.data[i]["Benchname"];
                        if (String.IsNullOrEmpty(Benchname))
                        {
                            Benchname = "";
                        }
                        string CourtNo = data.data[i]["CourtNo"];
                        if (String.IsNullOrEmpty(CourtNo))
                        {
                            CourtNo = "";
                        }
                        string JudgeName = data.data[i]["JudgName"];
                        if (String.IsNullOrEmpty(JudgeName))
                        {
                            JudgeName = "";
                        }
                        string SessionTime = data.data[i]["SessionTime"];
                        if (String.IsNullOrEmpty(SessionTime))
                        {
                            SessionTime = "";
                        }
                        string CauselistDate = data.data[i]["CauselistDate"];
                        if (String.IsNullOrEmpty(CauselistDate))
                        {
                            CauselistDate = "";
                        }
                        string CauselistDetail = data.data[i]["Filetext"];
                        if (String.IsNullOrEmpty(CauselistDetail))
                        {
                            CauselistDetail = "";
                        }
                        string Partyname = data.data[i]["Partyname"];
                        if (String.IsNullOrEmpty(Partyname))
                        {
                            Partyname = "";
                        }
                        string RowId = data.data[i]["RowId"];
                        string TotalRecord = data.data[i]["TotalRecord"];
                        string MasterCaseId = data.data[i].MasterCaseId;
                        string UserCaseId = data.data[i].UserCaseId;
                        string Stages = data.data[i].Stage;
                        // Add parts to the list.
                        CauseList.Add(new MyKaseDailyCauselist
                        {
                            Courtname = Courtname,
                            CaseType = CaseType,
                            Caseno = Caseno,
                            Caseyear = Caseyear,
                            Benchname = Benchname,
                            CourtNo = CourtNo,
                            JudgeName = JudgeName,
                            SessionTime = SessionTime,
                            CauselistDate = CauselistDate,
                            CauselistDetail = CauselistDetail,
                            Partyname = Partyname,
                            Stage = Stages,
                            CaseId = "",
                            RowId = RowId,
                            TotalRecord = TotalRecord,
                            MasterCaseId = MasterCaseId,
                            UserCaseId = UserCaseId
                        });
                    }
                    return Json(CauseList, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    object rawfile = new
                    {
                        accesstoken = AccessTokenDetail,
                        userid = userIdDetail,
                        court = "",
                        Courtflag = court,
                        iflag = 1,
                        searchtext = "",
                        pageindex = pageno,
                        pagesize = pagesizes,
                        Datefrom = fromdate,
                        Dateto = todate
                    };
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MykaseAllCauselistData"), "POST", builders);
                    var param = apiUrl + "CWController=>AllCWCauseListDetails=>/API/Search/MykaseAllCauselistData" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                    JObject jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    List<MyKaseDailyCauselist> CauseList = new List<MyKaseDailyCauselist>();
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        string status = data.Status;
                        string Message = data.Message;
                        string Courtname = data.data[i]["Court"];
                        if (String.IsNullOrEmpty(Courtname))
                        {
                            Courtname = "";
                        }
                        string CaseType = data.data[i]["CaseType"];
                        if (String.IsNullOrEmpty(CaseType))
                        {
                            CaseType = "";
                        }
                        string Caseno = data.data[i]["Caseno"];
                        if (String.IsNullOrEmpty(Caseno))
                        {
                            Caseno = "";
                        }
                        string Caseyear = data.data[i]["Caseyear"];
                        if (String.IsNullOrEmpty(Caseyear))
                        {
                            Caseyear = "";
                        }
                        string Benchname = data.data[i]["BenchName"];
                        if (String.IsNullOrEmpty(Benchname))
                        {
                            Benchname = "";
                        }
                        string CourtNo = data.data[i]["CourtNo"];
                        if (String.IsNullOrEmpty(CourtNo))
                        {
                            CourtNo = "";
                        }
                        string JudgeName = data.data[i]["JudgName"];
                        if (String.IsNullOrEmpty(JudgeName))
                        {
                            JudgeName = "";
                        }
                        string SessionTime = data.data[i]["SessionTime"];
                        if (String.IsNullOrEmpty(SessionTime))
                        {
                            SessionTime = "";
                        }
                        string CauselistDate = data.data[i]["CauselistDate"];
                        if (String.IsNullOrEmpty(CauselistDate))
                        {
                            CauselistDate = "";
                        }
                        string CauselistDetail = data.data[i]["CauselistDetail"];
                        if (String.IsNullOrEmpty(CauselistDetail))
                        {
                            CauselistDetail = "";
                        }
                        string Partyname = data.data[i]["Partyname"];
                        if (String.IsNullOrEmpty(Partyname))
                        {
                            Partyname = "";
                        }
                        string Caseid = data.data[i].CaseId;
                        string RowId = data.data[i]["RowId"];
                        string TotalRecord = data.data[i]["TotalRecord"];
                        string MasterCaseId = data.data[i].MasterCaseId;
                        string UserCaseId = data.data[i].UserCaseId;
                        string Stages = data.data[i].Stage;
                        // Add parts to the list.
                        CauseList.Add(new MyKaseDailyCauselist
                        {
                            Courtname = Courtname,
                            CaseType = CaseType,
                            Caseno = Caseno,
                            Caseyear = Caseyear,
                            Benchname = Benchname,
                            CourtNo = CourtNo,
                            JudgeName = JudgeName,
                            SessionTime = SessionTime,
                            CauselistDate = CauselistDate,
                            CauselistDetail = CauselistDetail,
                            Partyname = Partyname,
                            Stage = Stages,
                            CaseId = Caseid,
                            RowId = RowId,
                            TotalRecord = TotalRecord,
                            MasterCaseId = MasterCaseId,
                            UserCaseId = UserCaseId
                        });
                    }
                    return Json(CauseList, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Export all casewatch details list in excel
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportToExcelAllCWCauseListDetails()
        {
            string result = "";
            var db1 = new LawPracticeEntities();
            try
            {
                string exlfilename = "CauseList_" + DateTime.Now;
                var casedate = QueryAES.UrlDecode(Request.QueryString["casedate"]);
                var court = QueryAES.UrlDecode(Request.QueryString["court"]);
                var pageno = QueryAES.UrlDecode(Request.QueryString["pageno"]);
                var pagesizes = QueryAES.UrlDecode(Request.QueryString["pagesize"]);
                var fromdate = QueryAES.UrlDecode(Request.QueryString["fromdate"]);
                var todate = QueryAES.UrlDecode(Request.QueryString["todate"]);
                var joineduser = "";
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                var db = new LawPracticeEntities();
                joineduser = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                if (string.IsNullOrEmpty(joineduser))
                {
                    joineduser = strusername + LoggedInUser.UserId.ToString();
                }
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];

                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = joineduser;
                }

                //add login data
                var addfClient = new WebClient();
                if (court.ToString() == "3")
                {
                    object rawfile = new
                    {
                        accesstoken = AccessTokenDetail,
                        userid = userIdDetail,
                        Courtflag = court,
                        stateid = "",
                        iflag = 1,
                        districtid = "",
                        courtcompcode = "",
                        searchtext = "",
                        pageindex = pageno,
                        pagesize = pagesizes,
                        Datefrom = fromdate,
                        Dateto = todate
                    };
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MykaseAllCauselistData"), "POST", builders);
                    var param = apiUrl + "CWController=>ExportToExcelAllCWCauseListDetails=>/API/Search/MykaseAllCauselistData" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                    JObject jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    List<MyKaseDistrictCauselist> CauseList = new List<MyKaseDistrictCauselist>();
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        string status = data.Status;
                        string Message = data.Message;
                        string Case = data.data[i].Case;
                        string State = data.data[i].State;
                        string District = data.data[i].District;
                        string JudgeName = data.data[i]["JudgName"];
                        string SessionTime = data.data[i]["SessionTime"];
                        string CourtComplexCourtEstablishmentType = data.data[i]["CourtComplex_CourtEstablishmentType"];
                        string CourtComplexCourtEstablishment = data.data[i]["CourtComplex_CourtEstablishment"];
                        string CauselistDate = data.data[i]["CauselistDate"];
                        string CauselistDetail = data.data[i]["CauselistDetail"];
                        string CourtNo = data.data[i]["Court No"];
                        string PartyName = data.data[i]["Partyname"];
                        string Caseid = data.data[i].CaseId;
                        string RowId = data.data[i]["RowId"];
                        string TotalRecord = data.data[i]["TotalRecord"];
                        // Add parts to the list.
                        CauseList.Add(new MyKaseDistrictCauselist
                        {
                            RowId = RowId,
                            Case = Case,
                            State = State,
                            District = District,
                            JudgeName = JudgeName,
                            SessionTime = SessionTime,
                            CourtComplexCourtEstablishmentType = CourtComplexCourtEstablishmentType,
                            CourtComplexCourtEstablishment = CourtComplexCourtEstablishment,
                            CauselistDate = CauselistDate,
                            CauselistDetail = CauselistDetail,
                            CourtNo = CourtNo,
                            PartyName = PartyName,
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
                else if (court.ToString() == "4")
                {
                    object rawfile = new
                    {
                        accesstoken = AccessTokenDetail,
                        userid = userIdDetail,
                        court = "",
                        Courtflag = court,
                        iflag = 1,
                        searchtext = "",
                        pageindex = pageno,
                        pagesize = pagesizes,
                        Datefrom = fromdate,
                        Dateto = todate
                    };
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MykaseAllTribunalCauselistData"), "POST", builders);
                    var param = apiUrl + "CWController=>ExportToExcelAllCWCauseListDetails=>/API/Search/MykaseAllTribunalCauselistData" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                    JObject jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    List<MyKaseDailyCauselist> CauseList = new List<MyKaseDailyCauselist>();
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        string status = data.Status;
                        string Message = data.Message;
                        string Courtname = data.data[i]["Court"];
                        if (String.IsNullOrEmpty(Courtname))
                        {
                            Courtname = "";
                        }
                        string CaseType = data.data[i]["CaseType"];
                        if (String.IsNullOrEmpty(CaseType))
                        {
                            CaseType = "";
                        }
                        string Caseno = data.data[i]["Caseno"];
                        if (String.IsNullOrEmpty(Caseno))
                        {
                            Caseno = "";
                        }
                        string Caseyear = data.data[i]["Caseyear"];
                        if (String.IsNullOrEmpty(Caseyear))
                        {
                            Caseyear = "";
                        }
                        string Benchname = data.data[i]["BenchName"];
                        if (String.IsNullOrEmpty(Benchname))
                        {
                            Benchname = "";
                        }
                        string CourtNo = data.data[i]["CourtNo"];
                        if (String.IsNullOrEmpty(CourtNo))
                        {
                            CourtNo = "";
                        }
                        string JudgeName = data.data[i]["JudgName"];
                        if (String.IsNullOrEmpty(JudgeName))
                        {
                            JudgeName = "";
                        }
                        string SessionTime = data.data[i]["SessionTime"];
                        if (String.IsNullOrEmpty(SessionTime))
                        {
                            SessionTime = "";
                        }
                        string CauselistDate = data.data[i]["CauselistDate"];
                        if (String.IsNullOrEmpty(CauselistDate))
                        {
                            CauselistDate = "";
                        }
                        string CauselistDetail = data.data[i]["CauselistDetail"];
                        if (String.IsNullOrEmpty(CauselistDetail))
                        {
                            CauselistDetail = "";
                        }
                        string Partyname = data.data[i]["Partyname"];
                        if (String.IsNullOrEmpty(Partyname))
                        {
                            Partyname = "";
                        }
                        string Caseid = data.data[i].CaseId;
                        string RowId = data.data[i]["RowId"];
                        string TotalRecord = data.data[i]["TotalRecord"];
                        // Add parts to the list.
                        CauseList.Add(new MyKaseDailyCauselist
                        {
                            Courtname = Courtname,
                            CaseType = CaseType,
                            Caseno = Caseno,
                            Caseyear = Caseyear,
                            Benchname = Benchname,
                            CourtNo = CourtNo,
                            JudgeName = JudgeName,
                            SessionTime = SessionTime,
                            CauselistDate = CauselistDate,
                            CauselistDetail = CauselistDetail,
                            Partyname = Partyname,
                            CaseId = Caseid,
                            RowId = RowId,
                            TotalRecord = TotalRecord,
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
                else
                {
                    object rawfile = new
                    {
                        accesstoken = AccessTokenDetail,
                        userid = userIdDetail,
                        court = "",
                        Courtflag = court,
                        iflag = 1,
                        searchtext = "",
                        pageindex = pageno,
                        pagesize = pagesizes,
                        Datefrom = fromdate,
                        Dateto = todate
                    };
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MykaseAllCauselistData"), "POST", builders);
                    var param = apiUrl + "CWController=>ExportToExcelAllCWCauseListDetails=>/API/Search/MykaseAllCauselistData" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                    JObject jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    List<MyKaseDailyCauselist> CauseList = new List<MyKaseDailyCauselist>();
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        string status = data.Status;
                        string Message = data.Message;
                        string Courtname = data.data[i]["Court"];
                        if (String.IsNullOrEmpty(Courtname))
                        {
                            Courtname = "";
                        }
                        string CaseType = data.data[i]["CaseType"];
                        if (String.IsNullOrEmpty(CaseType))
                        {
                            CaseType = "";
                        }
                        string Caseno = data.data[i]["Caseno"];
                        if (String.IsNullOrEmpty(Caseno))
                        {
                            Caseno = "";
                        }
                        string Caseyear = data.data[i]["Caseyear"];
                        if (String.IsNullOrEmpty(Caseyear))
                        {
                            Caseyear = "";
                        }
                        string Benchname = data.data[i]["BenchName"];
                        if (String.IsNullOrEmpty(Benchname))
                        {
                            Benchname = "";
                        }
                        string CourtNo = data.data[i]["CourtNo"];
                        if (String.IsNullOrEmpty(CourtNo))
                        {
                            CourtNo = "";
                        }
                        string JudgeName = data.data[i]["JudgName"];
                        if (String.IsNullOrEmpty(JudgeName))
                        {
                            JudgeName = "";
                        }
                        string SessionTime = data.data[i]["SessionTime"];
                        if (String.IsNullOrEmpty(SessionTime))
                        {
                            SessionTime = "";
                        }
                        string CauselistDate = data.data[i]["CauselistDate"];
                        if (String.IsNullOrEmpty(CauselistDate))
                        {
                            CauselistDate = "";
                        }
                        string CauselistDetail = data.data[i]["CauselistDetail"];
                        if (String.IsNullOrEmpty(CauselistDetail))
                        {
                            CauselistDetail = "";
                        }
                        string Partyname = data.data[i]["Partyname"];
                        if (String.IsNullOrEmpty(Partyname))
                        {
                            Partyname = "";
                        }
                        string Caseid = data.data[i].CaseId;
                        string RowId = data.data[i]["RowId"];
                        string TotalRecord = data.data[i]["TotalRecord"];
                        // Add parts to the list.
                        CauseList.Add(new MyKaseDailyCauselist
                        {
                            Courtname = Courtname,
                            CaseType = CaseType,
                            Caseno = Caseno,
                            Caseyear = Caseyear,
                            Benchname = Benchname,
                            CourtNo = CourtNo,
                            JudgeName = JudgeName,
                            SessionTime = SessionTime,
                            CauselistDate = CauselistDate,
                            CauselistDetail = CauselistDetail,
                            Partyname = Partyname,
                            CaseId = Caseid,
                            RowId = RowId,
                            TotalRecord = TotalRecord,
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
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                Response.Redirect("/home/Error");
            }
        }
        /// <summary>
        /// Export all casewatch causelist in pdf
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportToPDFAllCWCauseListDetails()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                string filename = "CauseList.pdf";
                var court = QueryAES.UrlDecode(Request.QueryString["court"]);
                var pageno = QueryAES.UrlDecode(Request.QueryString["pageno"]);
                var pagesizes = QueryAES.UrlDecode(Request.QueryString["pagesize"]);
                var fromdate = QueryAES.UrlDecode(Request.QueryString["fromdate"]);
                var todate = QueryAES.UrlDecode(Request.QueryString["todate"]);
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

                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = joineduser;
                }
                if (court.ToString() == "3")
                {
                    object rawfile = new
                    {
                        accesstoken = AccessTokenDetail,
                        userid = userIdDetail,
                        Courtflag = court,
                        stateid = "",
                        iflag = 1,
                        districtid = "",
                        courtcompcode = "",
                        searchtext = "",
                        pageindex = pageno,
                        pagesize = pagesizes,
                        Datefrom = fromdate,
                        Dateto = todate
                    };
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MykaseAllCauselistData"), "POST", builders);
                    var param = apiUrl + "CWController=>ExportToPDFAllCWCauseListDetails=>/API/Search/MykaseAllCauselistData" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                    JObject jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    List<MyKaseDistrictCauselist> CauseList = new List<MyKaseDistrictCauselist>();
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        string status = data.Status;
                        string Message = data.Message;
                        string Case = data.data[i].Case;
                        string State = data.data[i].State;
                        string District = data.data[i].District;
                        string JudgeName = data.data[i]["JudgName"];
                        string SessionTime = data.data[i]["SessionTime"];
                        string CourtComplexCourtEstablishmentType = data.data[i]["CourtComplex_CourtEstablishmentType"];
                        string CourtComplexCourtEstablishment = data.data[i]["CourtComplex_CourtEstablishment"];
                        string CauselistDate = data.data[i]["CauselistDate"];
                        string CauselistDetail = data.data[i]["CauselistDetail"];
                        string CourtNo = data.data[i]["Court No"];
                        string PartyName = data.data[i]["Partyname"];
                        string Caseid = data.data[i].CaseId;
                        string RowId = data.data[i]["RowId"];
                        string TotalRecord = data.data[i]["TotalRecord"];
                        // Add parts to the list.
                        CauseList.Add(new MyKaseDistrictCauselist
                        {
                            RowId = RowId,
                            Case = Case,
                            State = State,
                            District = District,
                            JudgeName = JudgeName,
                            SessionTime = SessionTime,
                            CourtComplexCourtEstablishmentType = CourtComplexCourtEstablishmentType,
                            CourtComplexCourtEstablishment = CourtComplexCourtEstablishment,
                            CauselistDate = CauselistDate,
                            CauselistDetail = CauselistDetail,
                            CourtNo = CourtNo,
                            PartyName = PartyName,
                        });
                    }
                    strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                    strtemplate += "  <thead><tr> ";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Case</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>State</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>District</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Judge Name</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Causelist Date</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Causelist Detail</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Court Complex/ Court Establishment Type</th>";
                    strtemplate += "</tr></thead><tbody>";
                    if (CauseList != null)
                    {
                        foreach (MyKaseDistrictCauselist idata in CauseList)
                        {
                            strtemplate += "<tr><td height = '20' align = 'left' valign ='top'  style='padding:0 5px;' >" + idata.Case + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.State + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.District + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.JudgeName + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + String.Format("{0:dd MMM yyyy}", idata.CauselistDate) + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.CauselistDetail + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.CourtComplexCourtEstablishmentType + "  </td></tr>";
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
                else if (court.ToString() == "4")
                {
                    object rawfile = new
                    {
                        accesstoken = AccessTokenDetail,
                        userid = userIdDetail,
                        court = "",
                        Courtflag = court,
                        iflag = 1,
                        searchtext = "",
                        pageindex = pageno,
                        pagesize = pagesizes,
                        Datefrom = fromdate,
                        Dateto = todate
                    };
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MykaseAllTribunalCauselistData"), "POST", builders);
                    var param = apiUrl + "CWController=>ExportToPDFAllCWCauseListDetails=>/API/Search/MykaseAllTribunalCauselistData" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                    JObject jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    List<MyKaseDailyCauselist> CauseList = new List<MyKaseDailyCauselist>();
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        string status = data.Status;
                        string Message = data.Message;
                        string Courtname = data.data[i]["Court"];
                        if (String.IsNullOrEmpty(Courtname))
                        {
                            Courtname = "";
                        }
                        string CaseType = data.data[i]["CaseType"];
                        if (String.IsNullOrEmpty(CaseType))
                        {
                            CaseType = "";
                        }
                        string Caseno = data.data[i]["Caseno"];
                        if (String.IsNullOrEmpty(Caseno))
                        {
                            Caseno = "";
                        }
                        string Caseyear = data.data[i]["Caseyear"];
                        if (String.IsNullOrEmpty(Caseyear))
                        {
                            Caseyear = "";
                        }
                        string Benchname = data.data[i]["BenchName"];
                        if (String.IsNullOrEmpty(Benchname))
                        {
                            Benchname = "";
                        }
                        string CourtNo = data.data[i]["CourtNo"];
                        if (String.IsNullOrEmpty(CourtNo))
                        {
                            CourtNo = "";
                        }
                        string JudgeName = data.data[i]["JudgName"];
                        if (String.IsNullOrEmpty(JudgeName))
                        {
                            JudgeName = "";
                        }
                        string SessionTime = data.data[i]["SessionTime"];
                        if (String.IsNullOrEmpty(SessionTime))
                        {
                            SessionTime = "";
                        }
                        string CauselistDate = data.data[i]["CauselistDate"];
                        if (String.IsNullOrEmpty(CauselistDate))
                        {
                            CauselistDate = "";
                        }
                        string CauselistDetail = data.data[i]["CauselistDetail"];
                        if (String.IsNullOrEmpty(CauselistDetail))
                        {
                            CauselistDetail = "";
                        }
                        string Partyname = data.data[i]["Partyname"];
                        if (String.IsNullOrEmpty(Partyname))
                        {
                            Partyname = "";
                        }
                        string Caseid = data.data[i].CaseId;
                        string RowId = data.data[i]["RowId"];
                        string TotalRecord = data.data[i]["TotalRecord"];
                        // Add parts to the list.
                        CauseList.Add(new MyKaseDailyCauselist
                        {
                            Courtname = Courtname,
                            CaseType = CaseType,
                            Caseno = Caseno,
                            Caseyear = Caseyear,
                            Benchname = Benchname,
                            CourtNo = CourtNo,
                            JudgeName = JudgeName,
                            SessionTime = SessionTime,
                            CauselistDate = CauselistDate,
                            CauselistDetail = CauselistDetail,
                            Partyname = Partyname,
                            CaseId = Caseid,
                            RowId = RowId,
                            TotalRecord = TotalRecord,
                        });
                    }
                    strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                    strtemplate += "  <thead><tr> ";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Court</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Case Type</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Case No.</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Case year</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Judge Name</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Causelist Date</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Causelist Detail</th>";
                    strtemplate += "</tr></thead><tbody>";
                    if (CauseList != null)
                    {
                        foreach (MyKaseDailyCauselist idata in CauseList)
                        {
                            strtemplate += "<tr><td height = '20' align = 'left' valign ='top'  style='padding:0 5px;' >" + idata.Courtname + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.CaseType + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.Caseno + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.Caseyear + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.JudgeName + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + String.Format("{0:dd MMM yyyy}", idata.CauselistDate) + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.CauselistDetail + "  </td></tr>";
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
                else
                {
                    object rawfile = new
                    {
                        accesstoken = AccessTokenDetail,
                        userid = userIdDetail,
                        court = "",
                        Courtflag = court,
                        iflag = 1,
                        searchtext = "",
                        pageindex = pageno,
                        pagesize = pagesizes,
                        Datefrom = fromdate,
                        Dateto = todate
                    };
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MykaseAllCauselistData"), "POST", builders);
                    var param = apiUrl + "CWController=>ExportToPDFAllCWCauseListDetails=>/API/Search/MykaseAllCauselistData" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                    JObject jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    List<MyKaseDailyCauselist> CauseList = new List<MyKaseDailyCauselist>();
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        string status = data.Status;
                        string Message = data.Message;
                        string Courtname = data.data[i]["Court"];
                        if (String.IsNullOrEmpty(Courtname))
                        {
                            Courtname = "";
                        }
                        string CaseType = data.data[i]["CaseType"];
                        if (String.IsNullOrEmpty(CaseType))
                        {
                            CaseType = "";
                        }
                        string Caseno = data.data[i]["Caseno"];
                        if (String.IsNullOrEmpty(Caseno))
                        {
                            Caseno = "";
                        }
                        string Caseyear = data.data[i]["Caseyear"];
                        if (String.IsNullOrEmpty(Caseyear))
                        {
                            Caseyear = "";
                        }
                        string Benchname = data.data[i]["BenchName"];
                        if (String.IsNullOrEmpty(Benchname))
                        {
                            Benchname = "";
                        }
                        string CourtNo = data.data[i]["CourtNo"];
                        if (String.IsNullOrEmpty(CourtNo))
                        {
                            CourtNo = "";
                        }
                        string JudgeName = data.data[i]["JudgName"];
                        if (String.IsNullOrEmpty(JudgeName))
                        {
                            JudgeName = "";
                        }
                        string SessionTime = data.data[i]["SessionTime"];
                        if (String.IsNullOrEmpty(SessionTime))
                        {
                            SessionTime = "";
                        }
                        string CauselistDate = data.data[i]["CauselistDate"];
                        if (String.IsNullOrEmpty(CauselistDate))
                        {
                            CauselistDate = "";
                        }
                        string CauselistDetail = data.data[i]["CauselistDetail"];
                        if (String.IsNullOrEmpty(CauselistDetail))
                        {
                            CauselistDetail = "";
                        }
                        string Partyname = data.data[i]["Partyname"];
                        if (String.IsNullOrEmpty(Partyname))
                        {
                            Partyname = "";
                        }
                        string Caseid = data.data[i].CaseId;
                        string RowId = data.data[i]["RowId"];
                        string TotalRecord = data.data[i]["TotalRecord"];
                        // Add parts to the list.
                        CauseList.Add(new MyKaseDailyCauselist
                        {
                            Courtname = Courtname,
                            CaseType = CaseType,
                            Caseno = Caseno,
                            Caseyear = Caseyear,
                            Benchname = Benchname,
                            CourtNo = CourtNo,
                            JudgeName = JudgeName,
                            SessionTime = SessionTime,
                            CauselistDate = CauselistDate,
                            CauselistDetail = CauselistDetail,
                            Partyname = Partyname,
                            CaseId = Caseid,
                            RowId = RowId,
                            TotalRecord = TotalRecord,
                        });
                    }
                    strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                    strtemplate += "  <thead><tr> ";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Court</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Case Type</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Case No.</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Case year</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Judge Name</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Causelist Date</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Causelist Detail</th>";
                    strtemplate += "</tr></thead><tbody>";
                    if (CauseList != null)
                    {
                        foreach (MyKaseDailyCauselist idata in CauseList)
                        {
                            strtemplate += "<tr><td height = '20' align = 'left' valign ='top'  style='padding:0 5px;' >" + idata.Courtname + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.CaseType + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.Caseno + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.Caseyear + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.JudgeName + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + String.Format("{0:dd MMM yyyy}", idata.CauselistDate) + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.CauselistDetail + "  </td></tr>";
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
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                Response.Redirect("/home/Error");
            }
        }

        /// <summary>
        /// Display board area
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult DisplayBoard()
        {
            try
            {
                var search = QueryAES.UrlDecode(Request.QueryString["search"]);
                ViewBag.search = Convert.ToString(search);
            }
            catch (Exception ex)
            {
            }
            return View();
        }

        //Logging 
        private static void WriteSearchLogFast(
        string userId,
        string courttype,
        string crtid,
        string searchtext,
        long responseTime,
        string Exception)
        {
            try
            {
                Task.Run(() =>
                {
                    try
                    {
                        //string logFolder = System.Web.Hosting.HostingEnvironment.MapPath("~/Logs");
                        string logFolder = AppDomain.CurrentDomain.BaseDirectory + "Logs";

                        if (!Directory.Exists(logFolder))
                        {
                            Directory.CreateDirectory(logFolder);
                        }

                        string filePath = Path.Combine(
                            logFolder,
                            "SearchByPartyName_" + DateTime.Now.ToString("ddMMyyyy") + ".txt"
                        );

                        string log =
                            DateTime.Now.ToString("dd-MM-yyyy HH:mm:ss") +
                            " | UserId: " + userId +
                            " | CourtType: " + courttype +
                            " | CourtId: " + crtid +
                            " | SearchText: " + searchtext +
                            " | ResponseTime: " + responseTime + " ms" +
                            " | Exception: " + Exception + 
                            Environment.NewLine;

                        System.IO.File.AppendAllText(filePath, log);
                    }
                    catch
                    {
                    }
                });
            }
            catch
            {
            }
        }
        /// <summary>
        /// Get search by party name details
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult GetSearchByPartyName()
        {
            var db1 = new LawPracticeEntities();
            Stopwatch sw = new Stopwatch();

            string userIdDetail = string.Empty;
            var searchtext = "";
            var courttype = "";
            var crtid = "";
            sw.Start();
            try
            {
                List<SearchByPartyNameObject> casedeatils = new List<SearchByPartyNameObject>();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                var addfClient = new WebClient();
                var stateid = "";
                var districtid = "";
                var pageindex = "";
                var pagesize = "";
                var removecasefiler = "";
                var caseYear = "";
                courttype = Convert.ToString(QueryAES.UrlDecode(Request.Form["courttype"]));
                crtid = Convert.ToString(QueryAES.UrlDecode(Request.Form["Courtid"]));
                stateid = Convert.ToString(QueryAES.UrlDecode(Request.Form["stateid"]));
                districtid = Convert.ToString(QueryAES.UrlDecode(Request.Form["districtid"]));
                searchtext = Convert.ToString(QueryAES.UrlDecode(Request.Form["Searchtext"]));
                pageindex = Convert.ToString(QueryAES.UrlDecode(Request.Form["Pageindex"]));
                pagesize = Convert.ToString(QueryAES.UrlDecode(Request.Form["Pagesize"]));
                removecasefiler = Convert.ToString(QueryAES.UrlDecode(Request.Form["removecasefiler"]));
                caseYear = Convert.ToString(QueryAES.UrlDecode(Request.Form["caseYear"]));

                string AccessTokenDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }

                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    UserId = userIdDetail,
                    Courttype = courttype,
                    Courtid = crtid,
                    Stateid = stateid,
                    Districtid = districtid,
                    Searchtext = searchtext,
                    Pageindex = pageindex,
                    Pagesize = pagesize,
                    caseYear = caseYear
                };
                //addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                //string builders = JsonConvert.SerializeObject(rawfile);
                addfClient.Encoding = Encoding.UTF8;
                addfClient.Headers[HttpRequestHeader.ContentType] = "application/json; charset=utf-8";
                addfClient.Headers[HttpRequestHeader.AcceptCharset] = "utf-8";
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                //string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/SearchByPartyName"), "POST", builders);


                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/SearchByPartyName"), "POST", builders);


                var param = apiUrl + "CWController=>GetSearchByPartyName=>/API/Search/SearchByPartyName" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                try
                {
                    if (data1.Count == 0)
                    {
                        CommomUtility obj1 = new CommomUtility();
                        string fromemail = WebConfigurationManager.AppSettings["fromemail"].ToString();
                        string SearchByPartyNameEmail = WebConfigurationManager.AppSettings["SearchByPartyNameEmail"].ToString();
                        var AssignmentSubmittedMailBody = "Request Param: " + builders + "</br>API URL: " + apiUrl + "/API/Search/SearchByPartyName </br>Response: " + resid + " DateTime:" + DateTime.Now.ToString() + "</br> Seatch By Username:" + LoggedInUser.UserName.ToString();
                        obj1.SendEmail(fromemail, SearchByPartyNameEmail, "", "No result fouond-Search By Party Name Mykase", AssignmentSubmittedMailBody);
                    }
                }
                catch (Exception ex)
                {
                }
                var db = new LawPracticeEntities();
                var existcaselist = db.sp_GetCaseSearchByPartyName(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).ToList();
                var cntsearch = 0;
                cntsearch = data1.Count;
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    //var Appres1 = Convert.ToString(data.data[i].Appres).Replace("Â", "").Replace(" Â ", " ").Trim();
                    var Appres1 = Regex.Replace(Convert.ToString(data.data[i].Appres).Replace("Â", ""), @"\s+", " ").Trim();

                    var Counsels1 = Convert.ToString(data.data[i].Counsels).Replace("Â", "").Replace(" Â ", " ");
                    var Filetext1 = Convert.ToString(data.data[i].Filetext).Replace("Â", "").Replace(" Â ", " ");
                    var caseno = Convert.ToString(data.data[i].Caseno).Trim();
                    var caseyear = Convert.ToString(data.data[i].CaseYear).Trim();
                    var courtname = Convert.ToString(data.data[i].Court).Trim();
                    var exists = new sp_GetCaseSearchByPartyName_Result();
                    if (removecasefiler == "true")
                    {
                        //check before add in list its exist or not
                        exists = existcaselist.Where(x => (x.caseinfo == Appres1 && x.CourtName.ToString() == courtname) || (x.matterno == caseno && x.matteryear == caseyear)).FirstOrDefault();
                        // exists = existcaselist.Where(x => x.caseinfo == Appres1 && x.matterno == caseno && x.matteryear == caseyear && x.CourtName.ToString()== courtname).FirstOrDefault();
                        if (exists == null)
                        {
                            casedeatils.Add(new SearchByPartyNameObject
                            {
                                Id = data.data[i].Id,
                                AppealNo = data.data[i].AppealNo,
                                CaseType = data.data[i].CaseType,
                                Caseno = data.data[i].Caseno,
                                CaseYear = data.data[i].CaseYear,
                                Court = data.data[i].Court,
                                CourtName = data.data[i].CourtName,
                                Appres = Appres1,
                                Filename = data.data[i].Filename,
                                Createdon = data.data[i].Createdon,
                                Counsels = Counsels1,
                                RefApptypeId = data.data[i].RefApptypeId,
                                Filetext = Filetext1,
                                vCasuelistDate = data.data[i].vCasuelistDate,
                                Bench = data.data[i].Bench,
                                vDocumentType = data.data[i].vDocumentType,
                                sflag = data.data[i].sflag,
                                CourtNo = data.data[i].CourtNo,
                                District = data.data[i].District,
                                CompEstbType = data.data[i].CompEstbType,
                                CompEastbCourtId = data.data[i].CompEastbCourtId,
                                DistrictName = data.data[i].DistrictName,
                                CNRNo= data.data[i].CNRNo,
                                BenchName = data.data[i].BenchName
                            });
                        }
                    }
                    else
                    {
                        casedeatils.Add(new SearchByPartyNameObject
                        {
                            Id = data.data[i].Id,
                            AppealNo = data.data[i].AppealNo,
                            CaseType = data.data[i].CaseType,
                            Caseno = data.data[i].Caseno,
                            CaseYear = data.data[i].CaseYear,
                            Court = data.data[i].Court,
                            CourtName = data.data[i].CourtName,
                            Appres = Appres1,
                            Filename = data.data[i].Filename,
                            Createdon = data.data[i].Createdon,
                            Counsels = Counsels1,
                            RefApptypeId = data.data[i].RefApptypeId,
                            Filetext = Filetext1,
                            vCasuelistDate = data.data[i].vCasuelistDate,
                            Bench = data.data[i].Bench,
                            vDocumentType = data.data[i].vDocumentType,
                            sflag = data.data[i].sflag,
                            CourtNo = data.data[i].CourtNo,
                            District = data.data[i].District,
                            CompEstbType = data.data[i].CompEstbType,
                            CompEastbCourtId = data.data[i].CompEastbCourtId,
                            DistrictName = data.data[i].DistrictName,
                            CNRNo = data.data[i].CNRNo,
                            BenchName = data.data[i].BenchName
                        });
                    }
                }
                sw.Stop();

                WriteSearchLogFast(
                    userIdDetail,
                    courttype,
                    crtid,
                    searchtext,
                    sw.ElapsedMilliseconds,
                    "No"
                );
                return Json(casedeatils, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                sw.Stop();

                WriteSearchLogFast(
                    userIdDetail,
                    courttype,
                    crtid,
                    searchtext,
                    sw.ElapsedMilliseconds,
                    "Yes"
                );
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Get court details
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult GetCourt()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                List<DisplayboardCourtObject> casedeatils = new List<DisplayboardCourtObject>();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + Convert.ToString(LoggedInUser.UserId);
                firmId = Convert.ToString(LoggedInUser.FirmId);
                string courttype = Convert.ToString(QueryAES.UrlDecode(Request.Form["Courttype"]));

                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                // string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }
                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    UserId = userIdDetail,
                    casetype = courttype
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/FillCourtnamebyCourttype"), "POST", builders);
                var param = apiUrl + "CWController=>GetCourt=>/API/Search/FillCourtnamebyCourttype" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    casedeatils.Add(new DisplayboardCourtObject
                    {
                        Courtname = Convert.ToString(data.data[i].CourtName),
                        CourtId = Convert.ToString(data.data[i].CourtId)
                    });
                }
                return Json(casedeatils, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Get party details by appeal number
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult PartyNameDetailsbyAppealNo()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                List<PartyNameDetailsById> casedeatils = new List<PartyNameDetailsById>();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + Convert.ToString(LoggedInUser.UserId);
                firmId = Convert.ToString(LoggedInUser.FirmId);
                string courttype = Convert.ToString(QueryAES.UrlDecode(Request.Form["Courttype"]));
                string Id = Convert.ToString(QueryAES.UrlDecode(Request.Form["Id"]));
                string crtid = Convert.ToString(QueryAES.UrlDecode(Request.Form["crtid"]));
                string caseYear = Convert.ToString(QueryAES.UrlDecode(Request.Form["caseYear"]));

                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }

                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    UserId = userIdDetail,
                    courttype = courttype,
                    id = Id,
                    crtid = crtid,
                    caseYear = caseYear
                };
                  //addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                addfClient.Encoding = Encoding.UTF8;
                addfClient.Headers[HttpRequestHeader.ContentType] = "application/json; charset=utf-8";
                addfClient.Headers[HttpRequestHeader.AcceptCharset] = "utf-8";
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/DetailsById"), "POST", builders);
                var param = apiUrl + "CWController=>PartyNameDetailsbyAppealNo=>/API/Search/DetailsById" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                if (string.IsNullOrWhiteSpace(resid) || resid.Trim() == "0")
                {
                    return Json(new List<PartyNameDetailsById>(), JsonRequestBehavior.AllowGet);
                }
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                if (data1 == null || !data1.HasValues)
                {
                    return Json(new List<PartyNameDetailsById>(), JsonRequestBehavior.AllowGet);
                }
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    var Appres1 = Convert.ToString(data.data[i]["Appres"]).Replace("Â", "").Replace(" Â ", " ");
                    var Counsels1 = Convert.ToString(data.data[i]["Counsels"]).Replace("Â", "").Replace(" Â ", " ");
                    var Filetext1 = Convert.ToString(data.data[i]["Filetext"]).Replace("Â", "").Replace(" Â ", " ");
                    //string status = data.Status;
                    casedeatils.Add(new PartyNameDetailsById
                    {
                        Id = Convert.ToString(data.data[i]["Id"]),
                        AppealNo = Convert.ToString(data.data[i]["AppealNo"]),
                        CaseType = Convert.ToString(data.data[i]["CaseType"]),
                        Caseno = Convert.ToString(data.data[i]["Caseno"]),
                        CaseYear = Convert.ToString(data.data[i]["CaseYear"]),
                        Court = Convert.ToString(data.data[i]["Court"]),
                        CourtName = Convert.ToString(data.data[i]["CourtName"]),
                        DistrictName = Convert.ToString(data.data[i]["DistrictName"]),
                        Appres = Appres1,
                        IFilenamed = Convert.ToString(data.data[i]["Filename"]),
                        Createdon = Convert.ToString(data.data[i]["Createdon"]),
                        Counsels = Counsels1,
                        RefApptypeId = Convert.ToString(data.data[i]["RefApptypeId"]),
                        Filetext = Filetext1,
                        vCasuelistDate = Convert.ToString(data.data[i]["vCasuelistDate"]),
                        Bench = Convert.ToString(data.data[i]["Bench"]),
                        vDocumentType = Convert.ToString(data.data[i]["vDocumentType"]),
                        sflag = Convert.ToString(data.data[i]["sflag"]),
                        CourtNo = Convert.ToString(data.data[i]["CourtNo"]),
                        District = Convert.ToString(data.data[i]["District"]),
                        CompEstbType = Convert.ToString(data.data[i]["CompEstbType"]),
                        CompEastbCourtId = Convert.ToString(data.data[i]["CompEastbCourtId"]),
                        vState = Convert.ToString(data.data[i]["vState"]),
                        sCourt = Convert.ToString(data.data[i]["sCourt"]),
                        vStampReg = Convert.ToString(data.data[i]["vStampReg"]),
                        CNRNo= Convert.ToString(data.data[i]["CNRNo"]),
                        Purpose = Convert.ToString(data.data[i]["Purpose"]),
                        District_name = Convert.ToString(data.data[i]["District_name"]),
                        Court_type = Convert.ToString(data.data[i]["Court_type"]),
                        Court_name = Convert.ToString(data.data[i]["Court_name"]),
                    });
                }
                return Json(casedeatils, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Get all mykase counsel suggested cases
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult MyKaseCounselSuggestedCases()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                List<SearchByPartyNameObject> casedeatils = new List<SearchByPartyNameObject>();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                var addfClient = new WebClient();
                var vcode = "";
                var searchtext = "";
                var pageindex = "";
                var pagesize = "";
                vcode = Convert.ToString(QueryAES.UrlDecode(Request.Form["vcode"]));
                pageindex = Convert.ToString(QueryAES.UrlDecode(Request.Form["Pageindex"]));
                pagesize = Convert.ToString(QueryAES.UrlDecode(Request.Form["Pagesize"]));
                //get username and state
                var db = new LawPracticeEntities();
                var result = db.usp_GetUserDetailByUserID(firmId, LoggedInUser.UserId.ToString()).FirstOrDefault();
                object rawfile = new
                {
                    Accesstoken = "mykase123456789abcdef",
                    UserId = userId,
                    VCodeId = "",
                    Name = result.Name,
                    statename = result.cstate,
                    Courttype = vcode,
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MyKaseCounselSuggestedCases"), "POST", builders);
                var param = apiUrl + "CWController=>MyKaseCounselSuggestedCases=>/API/Search/MyKaseCounselSuggestedCases" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    casedeatils.Add(new SearchByPartyNameObject
                    {
                        Id = data.data[i].Id,
                        AppealNo = data.data[i].AppealNo,
                        Appres = data.data[i].PartyName,
                        District = data.data[i].District,
                        Court = data.data[i].Court,
                    });
                }
                return Json(casedeatils, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Get counsel jurisdiction details
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult CounselJurisdiction()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                List<CounselJurisdictionObject> casedeatils = new List<CounselJurisdictionObject>();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                var addfClient = new WebClient();
                //getting vcode fromapi
                object drawfile = new
                {
                    Accesstoken = "mykase123456789abcdef",
                    UserId = userId
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string dbuilders = JsonConvert.SerializeObject(drawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string dresid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MyKaseCounselJurisdiction"), "POST", dbuilders);
                var param = apiUrl + "CWController=>CounselJurisdiction=>/API/Search/MyKaseCounselJurisdiction" + "@" + dbuilders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic djObject = JObject.Parse(dresid);
                dynamic ddata1 = djObject["data"];
                try
                {
                    for (int i = 0; i < ddata1.Count; i++)
                    {
                        dynamic data = JObject.Parse(dresid);
                        casedeatils.Add(new CounselJurisdictionObject
                        {
                            Id = data.data[i].id,
                            VCode = data.data[i].vCode
                        });
                    }
                }
                catch { }
                return Json(casedeatils, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Mykase counsel suggested case details by case id
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult MyKaseCounselSuggestedCaseDetailsById()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                List<SearchByPartyNameObject> casedeatils = new List<SearchByPartyNameObject>();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                var addfClient = new WebClient();
                var vid = Convert.ToString(QueryAES.UrlDecode(Request.Form["id"]));
                object rawfile = new
                {
                    Accesstoken = "mykase123456789abcdef",
                    userid = userId,
                    id = vid
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MyKaseCounselSuggestedCaseDetails"), "POST", builders);
                var param = apiUrl + "CWController=>MyKaseCounselSuggestedCaseDetailsById=>/API/Search/MyKaseCounselSuggestedCaseDetails" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                try
                {
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        casedeatils.Add(new SearchByPartyNameObject
                        {
                            AppealNo = data.data[i].AppealNo,
                            Counsels = data.data[i].Counsels,
                            Appres = data.data[i]["Applent/Respondent"],
                            District = data.data[i].vDistrict,
                            Caseno = data.data[i].District,
                            CaseYear = data.data[i].District,
                            Court = data.data[i].Court,
                        });
                    }
                }
                catch { }
                return Json(casedeatils, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Get disposed and pending case
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult MyDisposedPendingCases()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                List<SearchByPartyNameObject> casedeatils = new List<SearchByPartyNameObject>();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                var addfClient = new WebClient();
                var status = Request.Headers["status"];
                object rawfile = new
                {
                    Accesstoken = "mykase123456789abcdef",
                    userid = userId,
                    court = "",
                    courttype = "",
                    iflag = 1,
                    pagesize = 10,
                    pageindex = 1,
                    pstatus = status,
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MyDisposedPendingCases"), "POST", builders);
                var param = apiUrl + "CWController=>MyDisposedPendingCases=>/API/Search/MyDisposedPendingCases" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                try
                {
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        casedeatils.Add(new SearchByPartyNameObject
                        {
                            AppealNo = data.data[i].AppealNo,
                            Counsels = data.data[i].Counsels,
                            Appres = data.data[i]["Applent/Respondent"],
                            District = data.data[i].vDistrict,
                            Caseno = data.data[i].District,
                            CaseYear = data.data[i].District,
                            Court = data.data[i].Court,
                        });
                    }
                }
                catch { }
                return Json(casedeatils, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Get ordre time line details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult OrderTimeline()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var strdt = QueryAES.UrlDecode(Request.QueryString["UserCaseid"]);
                ViewBag.token = strdt;
                var caseid = QueryAES.UrlDecode(Request.QueryString["caseid"]);
                ViewBag.caseid = caseid;
                string username = "";
                var db2 = new LawPracticeEntities();
                var data2 = db2.FindCaseUsername(Convert.ToInt32(caseid), LoggedInUser.FirmId.ToString()).ToList();
                if (data2 != null)
                {
                    foreach (var datas in data2)
                    {
                        username = WebConfigurationManager.AppSettings["matteridname"] + datas;
                    }
                    var data22 = db2.Usp_GetCasewatchCaseMapDetails(LoggedInUser.FirmId.ToString(), caseid).FirstOrDefault();
                    if (data22 != null)
                    {
                        var casecreateuser = data22.UserId;
                        if (!String.IsNullOrEmpty(casecreateuser))
                        {
                            username = WebConfigurationManager.AppSettings["matteridname"] + casecreateuser;
                        }
                    }
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
                    var param = apiUrl + "CWController=>OrderTimeline=>/API/Search/ShowMykaseDetailsById" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                    JObject jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    List<CaseWatchOrder> CaseWatchOrder = new List<CaseWatchOrder>();
                    if (data1 != null)
                    {
                        for (int i = 0; i < data1.Count; i++)
                        {
                            dynamic data = JObject.Parse(resid);
                            string status = data.Status;
                            string Message = data.Message;
                            string Id = data.data[i].Id;
                            var OrderDateForTimeLine = data.data[i].Order_Date;
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
                            var newdate = OrderDateForTimeLine.ToString("dd/mm/yyyy", CultureInfo.InvariantCulture);
                            // Add parts to the list.
                            CaseWatchOrder.Add(new CaseWatchOrder { Id = Id, Order_Date = newdate, OrderDateForTimeLine = Convert.ToDateTime(OrderDateForTimeLine), Status = Status, Filename = Filename, Filepath = Filepath });
                        }
                    }
                    ViewBag.data = CaseWatchOrder.OrderBy(x => x.OrderDateForTimeLine).ToList();
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
            }
            return View();
        }
        /// <summary>
        /// Export live case list details in excel
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportToExcelLiveCaseListDetails()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                string exlfilename = "DiscoveredMattersList_" + DateTime.Now;
                var court = QueryAES.UrlDecode(Convert.ToString(HttpContext.Request.QueryString["courttype"]));
                var courtname = QueryAES.UrlDecode(Convert.ToString(HttpContext.Request.QueryString["courtname"]));
                var stateid = QueryAES.UrlDecode(Convert.ToString(HttpContext.Request.QueryString["stateid"]));
                var districtid = QueryAES.UrlDecode(Convert.ToString(HttpContext.Request.QueryString["districtid"]));
                var courtcompestname = QueryAES.UrlDecode(Convert.ToString(HttpContext.Request.QueryString["courtcompestname"]));
                var ditrictcourt = QueryAES.UrlDecode(Convert.ToString(HttpContext.Request.QueryString["ditrictcourt"]));
                var sortdate = QueryAES.UrlDecode(Convert.ToString(HttpContext.Request.QueryString["sortdate"]));
                var CaseStatus = QueryAES.UrlDecode(Convert.ToString(HttpContext.Request.QueryString["CaseStatus"]));
                var benchname = QueryAES.UrlDecode(Convert.ToString(HttpContext.Request.QueryString["benchname"]));
                if (String.IsNullOrEmpty(court) || court == "null" || court == "0") { court = ""; }
                if (String.IsNullOrEmpty(courtname) || courtname == "null" || courtname == "0") { courtname = ""; }
                if (String.IsNullOrEmpty(stateid) || stateid == "null" || stateid == "0") { stateid = ""; }
                if (String.IsNullOrEmpty(districtid) || districtid == "null" || districtid == "0") { districtid = ""; }
                if (String.IsNullOrEmpty(courtcompestname) || courtcompestname == "null" || courtcompestname == "0") { courtcompestname = ""; }
                if (String.IsNullOrEmpty(ditrictcourt) || ditrictcourt == "null" || ditrictcourt == "0") { ditrictcourt = ""; }
                if (String.IsNullOrEmpty(sortdate) || sortdate == "null" || sortdate == "0") { sortdate = ""; }
                if (String.IsNullOrEmpty(CaseStatus) || CaseStatus == "null" || CaseStatus == "0") { CaseStatus = ""; }
                if (String.IsNullOrEmpty(CaseStatus) || CaseStatus == "null" || CaseStatus == "0") { CaseStatus = ""; }
                if (String.IsNullOrEmpty(CaseStatus) || CaseStatus == "null" || CaseStatus == "0") { CaseStatus = ""; }
                if (String.IsNullOrEmpty(benchname) || benchname == "null" || benchname == "0") { benchname = ""; }
                var hearingfrom = QueryAES.UrlDecode(Convert.ToString(HttpContext.Request.QueryString["hearingfrom"]));
                var hearingto = QueryAES.UrlDecode(Convert.ToString(HttpContext.Request.QueryString["hearingto"]));
                var casename = QueryAES.UrlDecode(Convert.ToString(HttpContext.Request.QueryString["casename"]));
                var searchany = QueryAES.UrlDecode(Convert.ToString(HttpContext.Request.QueryString["searchany"]));
                var tagname = QueryAES.UrlDecode(Convert.ToString(HttpContext.Request.QueryString["tagname"]));
                if (String.IsNullOrEmpty(hearingfrom) || hearingfrom == "null" || hearingfrom == "0") { hearingfrom = ""; }
                if (String.IsNullOrEmpty(hearingto) || hearingto == "null" || hearingto == "0")
                { hearingto = ""; }
                if (String.IsNullOrEmpty(tagname) || tagname == "null" || tagname == "0") { tagname = ""; }
                List<CWCaseList> casedeatils = new List<CWCaseList>();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                string search = "";
                search = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["search"]));
                int pagesize = 10, pageindex = 1;
                pageindex = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagenum"]));
                pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagesize"]));
                var db = new LawPracticeEntities();
                string joineduser = "";
                joineduser = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                var mykaselist = db.usp_CaseListForCW(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).ToList();
                var Iflag = 0;
                if (LoggedInUser.RoleId == 1)
                {
                    Iflag = 1;
                }
                //add login data
                var addfClient = new WebClient();
                if (court.ToString() == "3")
                {
                    if (!String.IsNullOrEmpty(ditrictcourt))
                    {
                        // court = ditrictcourt;
                    }
                    object rawfile = new
                    {
                        Accesstoken = "mykase123456789abcdef",
                        userid = joineduser,
                        stateid = stateid,
                        districtid = districtid,
                        courtcompestname = ditrictcourt,
                        courttype = court,
                        iflag = Iflag,
                        pageindex = pageindex,
                        pagesize = pagesize,
                        pstatus = CaseStatus,
                        nextdatesorting = sortdate,
                        CaseId = "",
                        SearchText = casename,
                        fromdate = hearingfrom,
                        todate = hearingto,
                        istype = searchany,
                        taggedname = tagname,
                        bench = benchname
                    };
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    addfClient.Encoding = System.Text.Encoding.UTF8;
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MyCases"), "POST", builders);
                    var param = apiUrl + "CWController=>ExportToExcelLiveCaseListDetails=>/API/Search/MyCases" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
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
                            CaseDiary = Convert.ToString(data.data[i]["Case/Diary"]),
                            Court = data.data[i]["CourtName"],
                            CaseName = (data.data[i]["iCaseNotFound"] == 1 ? "Case not available" : data.data[i]["Case Name"]),
                            CourtComplexCourtEstablishmentType = data.data[i]["Court Complex/Court Establishment Type"],
                            CourtComplexCourtEstablishment = data.data[i]["Court Complex/Court Establishment"],
                            Advocate = data.data[i]["Advocate"],
                            NextHearing = data.data[i]["Next Hearing"],
                            DisposedDate = data.data[i]["Disposed Date"],
                            Status = data.data[i]["Status"],
                            MatterName = matterIDCase == null ? "" : matterIDCase.mname.ToString(),
                        });
                    }
                    var trialList = (from ob in casedeatils
                                     select new
                                     {
                                         CaseDiary = (ob.CaseDiary == null || ob.CaseDiary == "") ? "" : Regex.Replace(ob.CaseDiary, "<.*?>", string.Empty),
                                         District = ob.Court,
                                         CaseName = removeSpecialCharacter(ob.CaseName), //ob.CaseName,
                                         CourtComplexCourtEstablishmentType = ob.CourtComplexCourtEstablishmentType,
                                         CourtComplexCourtEstablishment = ob.CourtComplexCourtEstablishment,
                                         NextHearing = ob.NextHearing,
                                         Advocate = (ob.Advocate == null || ob.Advocate == "") ? "" : Regex.Replace(ob.Advocate, "<.*?>", string.Empty),
                                         DisposedDate = ob.DisposedDate,
                                         Status = ob.Status,
                                         MatterName = ob.MatterName,
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
                else
                {
                    object rawfile = new
                    {
                        Accesstoken = "mykase123456789abcdef",
                        userid = joineduser,
                        court = courtname,
                        courttype = court,
                        iflag = Iflag,
                        pageindex = pageindex,
                        pagesize = pagesize,
                        pstatus = CaseStatus,
                        nextdatesorting = sortdate,
                        CaseId = "",
                        SearchText = casename,
                        fromdate = hearingfrom,
                        todate = hearingto,
                        istype = searchany,
                        taggedname = tagname,
                        bench = benchname
                    };
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    addfClient.Encoding = System.Text.Encoding.UTF8;
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MyCases"), "POST", builders);
                    var param = apiUrl + "CWController=>ExportToExcelLiveCaseListDetails=>/API/Search/MyCases" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                    dynamic jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        int tempusercaseid = Convert.ToInt32(data.data[i]["UserCaseId"]);
                        var matterIDCase = mykaselist.Where(x => x.UserCaseId == tempusercaseid).FirstOrDefault();
                        casedeatils.Add(new CWCaseList
                        {
                            CaseDiary = Convert.ToString(data.data[i]["Case/Diary"]),
                            Court = data.data[i]["CourtName"],
                            CaseName = (data.data[i]["iCaseNotFound"] == 1 ? "Case not available" : data.data[i]["Case Name"]),
                            BenchName = data.data[i]["Bench Name"],
                            Advocate = data.data[i]["Advocate"],
                            NextHearing = data.data[i]["Next Hearing"],
                            DisposedDate = data.data[i]["Disposed Date"],
                            Status = data.data[i]["Status"],
                            MatterName = matterIDCase == null ? "" : matterIDCase.mname.ToString(),
                        });
                    }
                    var trialList = (from ob in casedeatils
                                     select new
                                     {
                                         CaseDiary = (ob.CaseDiary == null || ob.CaseDiary == "") ? "" : Regex.Replace(ob.CaseDiary, "<.*?>", string.Empty),
                                         Court = ob.Court,
                                         CaseName = removeSpecialCharacter(ob.CaseName), //ob.CaseName,
                                         BenchName = ob.BenchName,
                                         Advocate = (ob.Advocate == null || ob.Advocate == "") ? "" : Regex.Replace(ob.Advocate, "<.*?>", string.Empty),
                                         NextHearing = ob.NextHearing,
                                         DisposedDate = ob.DisposedDate,
                                         Status = ob.Status,
                                         MatterName = ob.MatterName,
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
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                Response.Redirect("/home/Error");
            }
        }
        
        /// <summary>
        /// Export case tracking in excel
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportToExcelCaseTrackingSearch()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                string exlfilename = "Nexthearinglist_" + DateTime.Now;
                var court = QueryAES.UrlDecode(Convert.ToString(HttpContext.Request.QueryString["courttype"]));
                var courtname = QueryAES.UrlDecode(Convert.ToString(HttpContext.Request.QueryString["courtname"]));
                var stateid = QueryAES.UrlDecode(Convert.ToString(HttpContext.Request.QueryString["stateid"]));
                var districtid = QueryAES.UrlDecode(Convert.ToString(HttpContext.Request.QueryString["districtid"]));
                var courtcompestname = QueryAES.UrlDecode(Convert.ToString(HttpContext.Request.QueryString["courtcompestname"]));
                var ditrictcourt = QueryAES.UrlDecode(Convert.ToString(HttpContext.Request.QueryString["ditrictcourt"]));
                var sortdate = QueryAES.UrlDecode(Convert.ToString(HttpContext.Request.QueryString["sortdate"]));
                var CaseStatus = QueryAES.UrlDecode(Convert.ToString(HttpContext.Request.QueryString["CaseStatus"]));
                var benchname = QueryAES.UrlDecode(Convert.ToString(HttpContext.Request.QueryString["benchname"]));
                if (String.IsNullOrEmpty(court) || court == "null" || court == "0") { court = ""; }
                if (String.IsNullOrEmpty(courtname) || courtname == "null" || courtname == "0") { courtname = ""; }
                if (String.IsNullOrEmpty(stateid) || stateid == "null" || stateid == "0") { stateid = ""; }
                if (String.IsNullOrEmpty(districtid) || districtid == "null" || districtid == "0") { districtid = ""; }
                if (String.IsNullOrEmpty(courtcompestname) || courtcompestname == "null" || courtcompestname == "0") { courtcompestname = ""; }
                if (String.IsNullOrEmpty(ditrictcourt) || ditrictcourt == "null" || ditrictcourt == "0") { ditrictcourt = ""; }
                if (String.IsNullOrEmpty(sortdate) || sortdate == "null" || sortdate == "0") { sortdate = ""; }
                if (String.IsNullOrEmpty(CaseStatus) || CaseStatus == "null" || CaseStatus == "0") { CaseStatus = ""; }
                if (String.IsNullOrEmpty(CaseStatus) || CaseStatus == "null" || CaseStatus == "0") { CaseStatus = ""; }
                if (String.IsNullOrEmpty(CaseStatus) || CaseStatus == "null" || CaseStatus == "0") { CaseStatus = ""; }
                if (String.IsNullOrEmpty(benchname) || benchname == "null" || benchname == "0") { benchname = ""; }
                var hearingfrom = QueryAES.UrlDecode(Convert.ToString(HttpContext.Request.QueryString["hearingfrom"]));
                var hearingto = QueryAES.UrlDecode(Convert.ToString(HttpContext.Request.QueryString["hearingto"]));
                var casename = QueryAES.UrlDecode(Convert.ToString(HttpContext.Request.QueryString["casename"]));
                var searchany = QueryAES.UrlDecode(Convert.ToString(HttpContext.Request.QueryString["searchany"]));
                var tagname = QueryAES.UrlDecode(Convert.ToString(HttpContext.Request.QueryString["tagname"]));
                if (String.IsNullOrEmpty(hearingfrom) || hearingfrom == "null" || hearingfrom == "0") { hearingfrom = ""; }
                if (String.IsNullOrEmpty(hearingto) || hearingto == "null" || hearingto == "0")
                { hearingto = ""; }
                if (String.IsNullOrEmpty(tagname) || tagname == "null" || tagname == "0") { tagname = ""; }
                List<CWCaseList> casedeatils = new List<CWCaseList>();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                string search = "";
                search = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["search"]));
                int pagesize = 10, pageindex = 1;
                pageindex = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagenum"]));
                pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagesize"]));
                var db = new LawPracticeEntities();
                string joineduser = "";
                joineduser = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                var Iflag = 0;
                if (LoggedInUser.RoleId == 1)
                {
                    Iflag = 1;
                }
                //add login data
                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = "mykase123456789abcdef",
                    userid = joineduser,
                    court = courtname,
                    courttype = court,
                    iflag = Iflag,
                    pageindex = pageindex,
                    pagesize = pagesize,
                    pstatus = CaseStatus,
                    nextdatesorting = sortdate,
                    CaseId = "",
                    SearchText = casename,
                    fromdate = hearingfrom,
                    todate = hearingto,
                    istype = searchany,
                    taggedname = tagname,
                    bench = benchname
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                addfClient.Encoding = System.Text.Encoding.UTF8;
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MyCases"), "POST", builders);
                var param = apiUrl + "CWController=>ExportToExcelLiveCaseListDetails=>/API/Search/MyCases" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    int tempusercaseid = Convert.ToInt32(data.data[i]["UserCaseId"]);
                    casedeatils.Add(new CWCaseList
                    {
                        CaseDiary = Convert.ToString(data.data[i]["Case/Diary"]),
                        Court = data.data[i]["CourtName"],
                        CaseName = (data.data[i]["iCaseNotFound"] == 1 ? "Case not available" : data.data[i]["Case Name"]),
                        BenchName = data.data[i]["Bench Name"],
                        Advocate = data.data[i]["Advocate"],
                        NextHearing = data.data[i]["Next Hearing"],
                        DisposedDate = data.data[i]["Disposed Date"],
                        Status = data.data[i]["Status"],
                    });
                }
                var trialList = (from ob in casedeatils
                                 select new
                                 {
                                     CaseDiary = (ob.CaseDiary == null || ob.CaseDiary == "") ? "" : Regex.Replace(ob.CaseDiary, "<.*?>", string.Empty),
                                     Court = ob.Court,
                                     CaseName = ob.CaseName,
                                     NextHearing = ob.NextHearing,
                                     Status = ob.Status,
                                 }).ToList();
                trialList = trialList.OrderBy(x => x.NextHearing).ToList();
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
        //-------------------x--------------------x--------------------x-----------------------x------------------------x------------------x //
        /// <summary>
        /// Export live case list details in excel
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportToPDFLiveCaseListDetails()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                string filename = "DiscoveredMattersList.pdf";
                var court = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["courttype"]));
                var courtname = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["courtname"]));
                var stateid = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["stateid"]));
                var districtid = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["districtid"]));
                var courtcompestname = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["courtcompestname"]));
                var ditrictcourt = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["ditrictcourt"]));
                var sortdate = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["sortdate"]));
                var CaseStatus = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["CaseStatus"]));
                var benchname = Convert.ToString(QueryAES.UrlDecode((HttpContext.Request.QueryString["benchname"])));
                if (String.IsNullOrEmpty(court) || court == "null" || court == "0") { court = ""; }
                if (String.IsNullOrEmpty(courtname) || courtname == "null" || courtname == "0") { courtname = ""; }
                if (String.IsNullOrEmpty(stateid) || stateid == "null" || stateid == "0") { stateid = ""; }
                if (String.IsNullOrEmpty(districtid) || districtid == "null" || districtid == "0") { districtid = ""; }
                if (String.IsNullOrEmpty(courtcompestname) || courtcompestname == "null" || courtcompestname == "0") { courtcompestname = ""; }
                if (String.IsNullOrEmpty(ditrictcourt) || ditrictcourt == "null" || ditrictcourt == "0") { ditrictcourt = ""; }
                if (String.IsNullOrEmpty(sortdate) || sortdate == "null" || sortdate == "0") { sortdate = ""; }
                if (String.IsNullOrEmpty(CaseStatus) || CaseStatus == "null" || CaseStatus == "0") { CaseStatus = ""; }
                if (String.IsNullOrEmpty(benchname) || benchname == "null" || benchname == "0") { benchname = ""; }
                var hearingfrom = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["hearingfrom"]));
                var hearingto = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["hearingto"]));
                var casename = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["casename"]));
                var searchany = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["searchany"]));
                var tagname = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["tagname"]));
                if (String.IsNullOrEmpty(hearingfrom) || hearingfrom == "null" || hearingfrom == "0") { hearingfrom = ""; }
                if (String.IsNullOrEmpty(hearingto) || hearingto == "null" || hearingto == "0")
                { hearingto = ""; }
                if (String.IsNullOrEmpty(tagname) || tagname == "null" || tagname == "0") { tagname = ""; }
                List<CWCaseList> casedeatils = new List<CWCaseList>();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                string search = "";
                search = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["search"]));
                int pagesize = 10, pageindex = 1;
                pageindex = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagenum"]));
                pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagesize"]));
                string joineduser = "";
                joineduser = db1.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                var mykaselist = db1.usp_CaseListForCW(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).ToList();
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
                strtemplate += "<center><p><strong>Mykase-Discovered matters List</strong><span style='float:right'>Date: " + String.Format("{0:dd MMM yyyy}", DateTime.Now) + "</span></p></hr>";
                strtemplate += " <p></p>";
                var addfClient = new WebClient();
                if (court.ToString() == "3")
                {
                    if (!String.IsNullOrEmpty(ditrictcourt))
                    {
                        //court = ditrictcourt;
                    }
                    object rawfile = new
                    {
                        Accesstoken = "mykase123456789abcdef",
                        userid = joineduser,
                        stateid = stateid,
                        districtid = districtid,
                        courtcompestname = ditrictcourt,
                        courttype = court,
                        iflag = Iflag,
                        pageindex = pageindex,
                        pagesize = pagesize,
                        pstatus = CaseStatus,
                        nextdatesorting = sortdate,
                        CaseId = "",
                        SearchText = casename,
                        fromdate = hearingfrom,
                        todate = hearingto,
                        istype = searchany,
                        taggedname = tagname,
                        bench = benchname
                    };
                    addfClient.Encoding = System.Text.Encoding.UTF8;
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MyCases"), "POST", builders);
                    var param = apiUrl + "CWController=>ExportToPDFLiveCaseListDetails=>/API/Search/MyCases" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                    dynamic jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        int tempusercaseid = Convert.ToInt32(data.data[i]["UserCaseId"]);
                        var matterIDCase = mykaselist.Where(x => x.UserCaseId == tempusercaseid).FirstOrDefault();
                        casedeatils.Add(new CWCaseList
                        {
                            CaseDiary = Convert.ToString(data.data[i]["Case/Diary"]),
                            Court = data.data[i]["CourtName"],
                            CaseName = (data.data[i]["iCaseNotFound"] == 1 ? "Case not available" : data.data[i]["Case Name"]),
                            CourtComplexCourtEstablishmentType = data.data[i]["Court Complex/Court Establishment Type"],
                            CourtComplexCourtEstablishment = data.data[i]["Court Complex/Court Establishment"],
                            Advocate = data.data[i]["Advocate"],
                            NextHearing = data.data[i]["Next Hearing"],
                            DisposedDate = data.data[i]["Disposed Date"],
                            Status = data.data[i]["Status"],
                            MatterName = matterIDCase == null ? "" : matterIDCase.mname.ToString(),
                        });
                    }
                    var trialList = (from ob in casedeatils
                                     select new
                                     {
                                         CaseDiary = (ob.CaseDiary == null || ob.CaseDiary == "") ? "" : Regex.Replace(ob.CaseDiary, "<.*?>", string.Empty),
                                         District = ob.Court,
                                         CaseName = ob.CaseName,
                                         CourtComplexCourtEstablishmentType = ob.CourtComplexCourtEstablishmentType,
                                         CourtComplexCourtEstablishment = ob.CourtComplexCourtEstablishment,
                                         NextHearing = ob.NextHearing,
                                         Advocate = (ob.Advocate == null || ob.Advocate == "") ? "" : Regex.Replace(ob.Advocate, "<.*?>", string.Empty),
                                         DisposedDate = ob.DisposedDate,
                                         Status = ob.Status,
                                         MatterName = ob.MatterName
                                     }).ToList();
                    strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                    strtemplate += "  <thead><tr> ";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>CaseDiary</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>District</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>District </th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>CourtComplexCourtEstablishmentType</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>CourtComplexCourtEstablishment</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>NextHearing</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Advocate</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>DisposedDate</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Status</th>";
                    strtemplate += "</tr></thead><tbody>";
                    if (trialList != null)
                    {
                        foreach (var idata in trialList)
                        {
                            strtemplate += "<tr><td height = '20' align = 'left' valign ='top'  style='padding:0 5px;' >" + idata.CaseDiary + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.District + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.CaseName + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.CourtComplexCourtEstablishmentType + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.CourtComplexCourtEstablishment + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + String.Format("{0:dd MMM yyyy}", idata.NextHearing) + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.Advocate + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + String.Format("{0:dd MMM yyyy}", idata.DisposedDate) + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.Status + "  </td></tr>";
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
                    System.IO.MemoryStream ms = new System.IO.MemoryStream(pdfBytes);
                    Response.ContentType = "application/pdf";
                    Response.AddHeader("content-disposition", "attachment;filename=" + filename + "");
                    Response.Buffer = true;
                    ms.WriteTo(Response.OutputStream);
                    Response.End();
                }
                else
                {
                    object rawfile = new
                    {
                        Accesstoken = "mykase123456789abcdef",
                        userid = joineduser,
                        court = courtname,
                        courttype = court,
                        iflag = Iflag,
                        pageindex = pageindex,
                        pagesize = pagesize,
                        pstatus = CaseStatus,
                        nextdatesorting = sortdate,
                        CaseId = "",
                        SearchText = casename,
                        fromdate = hearingfrom,
                        todate = hearingto,
                        istype = searchany,
                        taggedname = tagname,
                        bench = benchname
                    };
                    addfClient.Encoding = System.Text.Encoding.UTF8;
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MyCases"), "POST", builders);
                    var param = apiUrl + "CWController=>ExportToPDFLiveCaseListDetails=>/API/Search/MyCases" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                    dynamic jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        int tempusercaseid = Convert.ToInt32(data.data[i]["UserCaseId"]);
                        var matterIDCase = mykaselist.Where(x => x.UserCaseId == tempusercaseid).FirstOrDefault();
                        casedeatils.Add(new CWCaseList
                        {
                            CaseDiary = Convert.ToString(data.data[i]["Case/Diary"]),
                            Court = data.data[i]["CourtName"],
                            CaseName = (data.data[i]["iCaseNotFound"] == 1 ? "Case not available" : data.data[i]["Case Name"]),
                            Advocate = data.data[i]["Advocate"],
                            NextHearing = data.data[i]["Next Hearing"],
                            DisposedDate = data.data[i]["Disposed Date"],
                            Status = data.data[i]["Status"],
                            MatterName = matterIDCase == null ? "" : matterIDCase.mname.ToString(),
                        });
                    }
                    var trialList = (from ob in casedeatils
                                     select new
                                     {
                                         CaseDiary = (ob.CaseDiary == null || ob.CaseDiary == "") ? "" : Regex.Replace(ob.CaseDiary, "<.*?>", string.Empty),
                                         Court = ob.Court,
                                         CaseName = ob.CaseName,
                                         Advocate = (ob.Advocate == null || ob.Advocate == "") ? "" : Regex.Replace(ob.Advocate, "<.*?>", string.Empty),
                                         NextHearing = ob.NextHearing,
                                         DisposedDate = ob.DisposedDate,
                                         Status = ob.Status,
                                         MatterName = ob.MatterName
                                     }).ToList();
                    strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                    strtemplate += "  <thead><tr> ";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>CaseDiary</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Court</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>CaseName</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Advocate</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>NextHearing</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>DisposedDate</th>";
                    strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Status</th>";
                    strtemplate += "</tr></thead><tbody>";
                    if (trialList != null)
                    {
                        foreach (var idata in trialList)
                        {
                            strtemplate += "<tr><td height = '20' align = 'left' valign ='top'  style='padding:0 5px;' >" + idata.CaseDiary + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.Court + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.CaseName + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.Advocate + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + String.Format("{0:dd MMM yyyy}", idata.NextHearing) + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + String.Format("{0:dd MMM yyyy}", idata.DisposedDate) + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.Status + "  </td></tr>";
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
                    System.IO.MemoryStream ms = new System.IO.MemoryStream(pdfBytes);
                    Response.ContentType = "application/pdf";
                    Response.AddHeader("content-disposition", "attachment;filename=" + filename + "");
                    Response.Buffer = true;
                    ms.WriteTo(Response.OutputStream);
                    Response.End();
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                Response.Redirect("/home/Error");
            }
        }
        
        /// <summary>
        /// Export case tracking in pdf
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportToPDFCaseTrackingSearch()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                string filename = "Nexthearinglist.pdf";
                var court = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["courttype"]));
                var courtname = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["courtname"]));
                var stateid = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["stateid"]));
                var districtid = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["districtid"]));
                var courtcompestname = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["courtcompestname"]));
                var ditrictcourt = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["ditrictcourt"]));
                var sortdate = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["sortdate"]));
                var CaseStatus = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["CaseStatus"]));
                var benchname = Convert.ToString(QueryAES.UrlDecode((HttpContext.Request.QueryString["benchname"])));
                if (String.IsNullOrEmpty(court) || court == "null" || court == "0") { court = ""; }
                if (String.IsNullOrEmpty(courtname) || courtname == "null" || courtname == "0") { courtname = ""; }
                if (String.IsNullOrEmpty(stateid) || stateid == "null" || stateid == "0") { stateid = ""; }
                if (String.IsNullOrEmpty(districtid) || districtid == "null" || districtid == "0") { districtid = ""; }
                if (String.IsNullOrEmpty(courtcompestname) || courtcompestname == "null" || courtcompestname == "0") { courtcompestname = ""; }
                if (String.IsNullOrEmpty(ditrictcourt) || ditrictcourt == "null" || ditrictcourt == "0") { ditrictcourt = ""; }
                if (String.IsNullOrEmpty(sortdate) || sortdate == "null" || sortdate == "0") { sortdate = ""; }
                if (String.IsNullOrEmpty(CaseStatus) || CaseStatus == "null" || CaseStatus == "0") { CaseStatus = ""; }
                if (String.IsNullOrEmpty(benchname) || benchname == "null" || benchname == "0") { benchname = ""; }
                var hearingfrom = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["hearingfrom"]));
                var hearingto = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["hearingto"]));
                var casename = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["casename"]));
                var searchany = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["searchany"]));
                var tagname = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["tagname"]));
                if (String.IsNullOrEmpty(hearingfrom) || hearingfrom == "null" || hearingfrom == "0") { hearingfrom = ""; }
                if (String.IsNullOrEmpty(hearingto) || hearingto == "null" || hearingto == "0")
                { hearingto = ""; }
                if (String.IsNullOrEmpty(tagname) || tagname == "null" || tagname == "0") { tagname = ""; }
                List<CWCaseList> casedeatils = new List<CWCaseList>();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                string search = "";
                search = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["search"]));
                int pagesize = 10, pageindex = 1;
                pageindex = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagenum"]));
                pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagesize"]));
                string joineduser = "";
                joineduser = db1.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
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
                strtemplate += "<center><p><strong>Mykase-Discovered matters List</strong><span style='float:right'>Date: " + String.Format("{0:dd MMM yyyy}", DateTime.Now) + "</span></p></hr>";
                strtemplate += " <p></p>";
                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = "mykase123456789abcdef",
                    userid = joineduser,
                    court = courtname,
                    courttype = court,
                    iflag = Iflag,
                    pageindex = pageindex,
                    pagesize = pagesize,
                    pstatus = CaseStatus,
                    nextdatesorting = sortdate,
                    CaseId = "",
                    SearchText = casename,
                    fromdate = hearingfrom,
                    todate = hearingto,
                    istype = searchany,
                    taggedname = tagname,
                    bench = benchname
                };
                addfClient.Encoding = System.Text.Encoding.UTF8;
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MyCases"), "POST", builders);
                var param = apiUrl + "CWController=>ExportToPDFLiveCaseListDetails=>/API/Search/MyCases" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    int tempusercaseid = Convert.ToInt32(data.data[i]["UserCaseId"]);
                    casedeatils.Add(new CWCaseList
                    {
                        CaseDiary = Convert.ToString(data.data[i]["Case/Diary"]),
                        Court = data.data[i]["CourtName"],
                        CaseName = (data.data[i]["iCaseNotFound"] == 1 ? "Case not available" : data.data[i]["Case Name"]),
                        Advocate = data.data[i]["Advocate"],
                        NextHearing = data.data[i]["Next Hearing"],
                        DisposedDate = data.data[i]["Disposed Date"],
                        Status = data.data[i]["Status"],
                    });
                }
                var trialList = (from ob in casedeatils
                                 select new
                                 {
                                     CaseDiary = (ob.CaseDiary == null || ob.CaseDiary == "") ? "" : Regex.Replace(ob.CaseDiary, "<.*?>", string.Empty),
                                     Court = ob.Court,
                                     CaseName = ob.CaseName,
                                     NextHearing = ob.NextHearing,
                                     Status = ob.Status,
                                 }).ToList();
                trialList = trialList.OrderBy(x => x.NextHearing).ToList();
                strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                strtemplate += "  <thead><tr> ";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>CaseDiary</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Court</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>CaseName</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>NextHearing</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Status</th>";
                strtemplate += "</tr></thead><tbody>";
                if (trialList != null)
                {
                    foreach (var idata in trialList)
                    {
                        strtemplate += "<tr><td height = '20' align = 'left' valign ='top'  style='padding:0 5px;' >" + idata.CaseDiary + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.Court + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.CaseName + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + String.Format("{0:dd MMM yyyy}", idata.NextHearing) + "  </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.Status + "  </td></tr>";
                    }
                    strtemplate += "</tbody></table>";
                }
                else
                { }
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
        //------------------------------------------x---------------------------------------------------x---------------------------------------------------------x
        /// <summary>
        /// Get cause list details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public JsonResult CauseListModal()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                string search = "";
                int pagesize = 10, pageindex = 1;
                var db = new LawPracticeEntities();
                string joineduser = "";
                joineduser = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                var s = string.Format("{0:D1}", Convert.ToDateTime(DateTime.Now.ToShortDateString()).ToString("MM"));
                var s1 = Convert.ToDateTime(DateTime.Now.ToShortDateString()).ToString("dd");
                var y1 = Convert.ToDateTime(DateTime.Now.ToShortDateString()).ToString("yyyy");
                var date = s + "/" + s1 + "/" + y1;
                string resid = AddCaseCaseWatch.MyDailyCauselistModal(LoggedInUser.UserId.ToString(), joineduser, date, apiUrl, LoggedInUser.IsCaseWatchUser, LoggedInUser.UserName.ToString());
                return Json(resid, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Get all tag list details
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult TagList()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userIds = "", firmId = "";
                userIds = strusername + Convert.ToString(LoggedInUser.UserId);
                firmId = Convert.ToString(LoggedInUser.FirmId);

                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (!String.IsNullOrEmpty(IsCaseWatchUser))
                {
                    if (IsCaseWatchUser == "1")
                    {
                        userIdDetail = LoggedInUser.UserName.ToString();
                        AccessTokenDetail = "internal";
                    }
                    else
                    {
                        AccessTokenDetail = "mykase123456789abcdef";
                        userIdDetail = userIds;
                    }
                }

                var addfClient = new WebClient();
                object rawfile = new
                {
                    accesstoken = AccessTokenDetail,
                    userid = userIdDetail,
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/FillTaggedCase"), "POST", builders);
                var param = apiUrl + "CWController=>TagList=>/API/Search/FillTaggedCase" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                return Json(resid, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Create new tag
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult CreateTag()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var statusResult = "";
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + Convert.ToString(LoggedInUser.UserId);
                firmId = Convert.ToString(LoggedInUser.FirmId);
                string tagname = Convert.ToString(QueryAES.UrlDecode(Request.Form["tagname"]));
                string usercaseid = Convert.ToString(QueryAES.UrlDecode(Request.Form["usercaseid"]));
                string[] values = usercaseid.Split(',');
                for (int i = 0; i < values.Length; i++)
                {
                    values[i] = values[i].Trim();
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        accesstoken = "mykase123456789abcdef",
                        userid = userId,
                        taggedname = tagname,
                        caseid = values[i]
                    };
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AddTag"), "POST", builders);
                    var param = apiUrl + "CWController=>CreateTag=>/API/Search/AddTag" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                    dynamic data = JObject.Parse(resid);
                    statusResult = data.Status;
                }
                return Json(statusResult, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Remove tag by id
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult RemoveTag()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var statusResult = "";
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + Convert.ToString(LoggedInUser.UserId);
                firmId = Convert.ToString(LoggedInUser.FirmId);
                string tagname = Convert.ToString(QueryAES.UrlDecode(Request.Form["tagname"]));
                string usercaseid = Convert.ToString(QueryAES.UrlDecode(Request.Form["usercaseid"]));
                string[] values = usercaseid.Split(',');
                for (int i = 0; i < values.Length; i++)
                {
                    values[i] = values[i].Trim();
                    if (values[i] == "")
                    {
                        values[i] = "0";
                    }
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        accesstoken = "mykase123456789abcdef",
                        userid = userId,
                        taggedname = tagname,
                        caseid = values[i]
                    };
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/RemoveTag"), "POST", builders);
                    var param = apiUrl + "CWController=>RemoveTag=>/API/Search/RemoveTag" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                    dynamic data = JObject.Parse(resid);
                    statusResult = data.Status;
                }
                return Json(statusResult, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Send next hearing detail in pdf from mail
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult NextHearingSendPDFMail()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var statusResult = "";
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string joined = "";
                var db = new LawPracticeEntities();
                joined = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                string userId = "", firmId = "", Isreracort = "";
                userId = strusername + Convert.ToString(LoggedInUser.UserId);
                firmId = Convert.ToString(LoggedInUser.FirmId);
                string email = Convert.ToString(QueryAES.UrlDecode(Request.Form["email"]));
                string date = Convert.ToString(QueryAES.UrlDecode(Request.Form["date"]));
                date = System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String(date));
                string name = Convert.ToString(QueryAES.UrlDecode(Request.Form["name"]));
                string Isreracortcheck = QueryAES.UrlDecode(Request.Form["IsReracheck"]);
                if (Isreracortcheck == "RERA")
                {
                    Isreracort = "Rera";
                }
                else
                {
                    Isreracort = "";
                }
                //For CWLive User Login
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string AdminuserIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (!String.IsNullOrEmpty(IsCaseWatchUser))
                {
                    if (IsCaseWatchUser == "1")
                    {
                        userIdDetail = LoggedInUser.UserName.ToString();
                        AccessTokenDetail = "internal";
                        AdminuserIdDetail = LoggedInUser.UserName.ToString();
                    }
                    else
                    {
                        AccessTokenDetail = "mykase123456789abcdef";
                        userIdDetail = joined;
                        AdminuserIdDetail = userId;
                    }
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = joined;
                    AdminuserIdDetail = userId;
                }
                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    UserId = userIdDetail,
                    Date = date,
                    mailto = email,
                    Name = name,
                    loginuserid = AdminuserIdDetail,
                    courttype = Isreracort
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/NextHearingSendPDFMail"), "POST", builders);
                var param = apiUrl + "CWController=>NextHearingSendPDFMail=>/API/Search/NextHearingSendPDFMail" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic data = JObject.Parse(resid);
                statusResult = data.Status;
                return Json(statusResult, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Send next hearing alert notification
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult NextHearingSendAlert()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var statusResult = "";
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string joined = "";
                var db = new LawPracticeEntities();
                joined = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                string userId = "", firmId = "", Isreracort = "";
                userId = strusername + Convert.ToString(LoggedInUser.UserId);
                firmId = Convert.ToString(LoggedInUser.FirmId);
                string email = Convert.ToString(QueryAES.UrlDecode(Request.Form["email"]));
                string date = Convert.ToString(QueryAES.UrlDecode(Request.Form["date"]));
                date = System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String(date));
                string name = Convert.ToString(QueryAES.UrlDecode(Request.Form["name"]));
                string Isreracortcheck = QueryAES.UrlDecode(Request.Form["IsRerachecks"]);
                if (Isreracortcheck == "RERA")
                {
                    Isreracort = "Rera";
                }
                else
                {
                    Isreracort = "";
                }
                var addfClient = new WebClient();
                //For CWLive User Login
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string AdminuserIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (!String.IsNullOrEmpty(IsCaseWatchUser))
                {
                    if (IsCaseWatchUser == "1")
                    {
                        userIdDetail = LoggedInUser.UserName.ToString();
                        AccessTokenDetail = "internal";
                        AdminuserIdDetail = LoggedInUser.UserName.ToString();
                    }
                    else
                    {
                        AccessTokenDetail = "mykase123456789abcdef";
                        userIdDetail = joined;
                        AdminuserIdDetail = userId;
                    }
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = joined;
                    AdminuserIdDetail = userId;
                }
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    UserId = userIdDetail,
                    Date = date,
                    loginuserid = AdminuserIdDetail,
                    courttype = Isreracort
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/NextHearingSendAlert"), "POST", builders);
                var param = apiUrl + "CWController=>NextHearingSendAlert=>/API/Search/NextHearingSendAlert" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic data = JObject.Parse(resid);
                statusResult = data.Status;
                return Json(statusResult, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Download nexthearing detail pdf 
        /// </summary>
        [FirmControllerAuthorization]
        public void NextHearingDownLoadPDF()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var statusResult = "";
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string joined = "";
                var db = new LawPracticeEntities();
                joined = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                string userId = "", firmId = "", Isreracort = "";
                userId = strusername + Convert.ToString(LoggedInUser.UserId);
                firmId = Convert.ToString(LoggedInUser.FirmId);
                string date = Convert.ToString(HttpContext.Request.QueryString["date"]);
                date = System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String(date));
                string Isreracortcheck = QueryAES.UrlDecode(HttpContext.Request.QueryString["IsReracheckd"]);
                if (Isreracortcheck == "RERA")
                {
                    Isreracort = "Rera";
                }
                else
                {
                    Isreracort = "";
                }
                //For CWLive User Login
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string AdminuserIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (!String.IsNullOrEmpty(IsCaseWatchUser))
                {
                    if (IsCaseWatchUser == "1")
                    {
                        userIdDetail = LoggedInUser.UserName.ToString();
                        AccessTokenDetail = "internal";
                        AdminuserIdDetail = LoggedInUser.UserName.ToString();
                    }
                    else
                    {
                        AccessTokenDetail = "mykase123456789abcdef";
                        userIdDetail = joined;
                        AdminuserIdDetail = userId;
                    }
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = joined;
                    AdminuserIdDetail = userId;
                }
                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    UserId = userIdDetail,
                    Date = date,
                    loginuserid = AdminuserIdDetail,
                    courttype = Isreracort
                };
                addfClient.Encoding = System.Text.Encoding.UTF8;
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/NextHearingDownLoadPDF"), "POST", builders);
                var param = apiUrl + "CWController=>NextHearingDownLoadPDF=>/API/Search/NextHearingDownLoadPDF" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic data = JObject.Parse(resid);
                var downloadpath1 = data.data;
                try
                {
                    System.Net.WebClient webClient = new System.Net.WebClient();
                    string url = downloadpath1;
                    byte[] bytes = webClient.DownloadData(url);
                    string fileName = url.Split('/').Last();
                    Response.ContentType = "application/octet-stream";
                    Response.AppendHeader("Content-Disposition", "attachment; filename=" + fileName);
                    Response.BinaryWrite(bytes);
                    Response.End();
                }
                catch { }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
            }
        }
        /// <summary>
        /// Download nexthearing detail Excel 
        /// </summary>
        [FirmControllerAuthorization]
        public void NextHearingDownLoadExcel()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                string exlfilename = "NextHearingCaseDetailList_" + DateTime.Now;
                var statusResult = "";
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string joined = "";
                var db = new LawPracticeEntities();
                joined = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                string userId = "", firmId = "", Isreracort = "";
                userId = strusername + Convert.ToString(LoggedInUser.UserId);
                firmId = Convert.ToString(LoggedInUser.FirmId);
                string date = Convert.ToString(HttpContext.Request.QueryString["date"]);
                date = System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String(date));
                string Isreracortcheck = QueryAES.UrlDecode(HttpContext.Request.QueryString["IsReracheckd"]);
                if (Isreracortcheck == "RERA")
                {
                    Isreracort = "Rera";
                }
                else
                {
                    Isreracort = "";
                }
                //For CWLive User Login
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string AdminuserIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (!String.IsNullOrEmpty(IsCaseWatchUser))
                {
                    if (IsCaseWatchUser == "1")
                    {
                        userIdDetail = LoggedInUser.UserName.ToString();
                        AccessTokenDetail = "internal";
                        AdminuserIdDetail = LoggedInUser.UserName.ToString();
                    }
                    else
                    {
                        AccessTokenDetail = "mykase123456789abcdef";
                        userIdDetail = joined;
                        AdminuserIdDetail = userId;
                    }
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = joined;
                    AdminuserIdDetail = userId;
                }
                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    UserId = userIdDetail,
                    Date = date,
                    loginuserid = AdminuserIdDetail,
                    courttype = Isreracort
                };
                addfClient.Encoding = System.Text.Encoding.UTF8;
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/ShowNextHearingDateLawPracticePopup"), "POST", builders);
                var param = apiUrl + "CWController=>NextHearingDownLoadExcel=>/API/Search/ShowNextHearingDateLawPracticePopup" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                JObject jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                dynamic datass = JObject.Parse(resid);
                string Recracheck = datass.isRera;
                List<CalendarOrderList> orderlist = new List<CalendarOrderList>();
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string status = data.Status;
                    string Message = data.Message;
                    string Casename = data.data[i].vCaseName;
                    string nexthearing = data.data[i].vordernexthearing;
                    string ManualNexthearing = data.data[i].ManualNexthearing;
                    //Add Rera check
                    if (String.IsNullOrEmpty(nexthearing))
                    {
                        nexthearing = "";
                    }
                    else
                    {
                        try
                        {
                            var _dts = DateTime.Parse(nexthearing);
                            nexthearing = _dts.ToString("dd MMM yyyy");
                        }
                        catch (Exception er)
                        {
                        }
                    }
                    if (String.IsNullOrEmpty(ManualNexthearing))
                    {
                        ManualNexthearing = "";
                    }
                    else
                    {
                        try
                        {
                            var _dts = DateTime.Parse(ManualNexthearing);
                            ManualNexthearing = _dts.ToString("dd MMM yyyy");
                        }
                        catch (Exception er)
                        {
                        }
                    }
                    if (String.IsNullOrEmpty(Casename))
                    {
                        Casename = "";
                    }
                    string Advname = data.data[i].vAdvocateName;
                    if (String.IsNullOrEmpty(Advname))
                    {
                        Advname = "";
                    }
                    string Court = data.data[i].vCourtName;
                    if (String.IsNullOrEmpty(Court))
                    {
                        Court = "";
                    }
                    string csno = data.data[i].csno;
                    // Add parts to the list.
                    orderlist.Add(new CalendarOrderList
                    {
                        Casename = removeSpecialCharacter(Casename),
                        Advname = removeSpecialCharacter(Advname),
                        Court = Court,
                        csno = removeSpecialCharacter(csno),
                        Vordernexthearing = nexthearing,
                        ManualNexthearing = ManualNexthearing
                    });

                  
                }
                var trialList = (from ob in orderlist
                                 select new
                                 {
                                     MatterNo = ob.csno,
                                     MatterName = ob.Casename,
                                     AdvocateName = ob.Advname,
                                     Court = ob.Court,
                                     NexthearingDate = ob.Vordernexthearing,
                                     ManualNexthearingDate = ob.ManualNexthearing
                                 });

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
            }
        }
        /// <summary>
        /// Map matter case id to casewatch
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult GetMatterCaseIdMaptoCW()
        {
            string userId = "", firmId = "";
            userId = Convert.ToString(LoggedInUser.UserId);
            firmId = Convert.ToString(LoggedInUser.FirmId);
            var usercaseid = Convert.ToInt32(QueryAES.UrlDecode(Request.Form["usercaseid"]));
            var db = new LawPracticeEntities();
            var data = db.usp_getUserCasesMapCaseStatusMasterByCaseid(firmId, usercaseid);
            return Json(data, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Send order details in pdf from mail
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult OrderSendPDFMail()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var statusResult = "";
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string joined = "";
                var db = new LawPracticeEntities();
                joined = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                string userId = "", firmId = "";
                userId = strusername + Convert.ToString(LoggedInUser.UserId);
                firmId = Convert.ToString(LoggedInUser.FirmId);
                string email = Convert.ToString(QueryAES.UrlDecode(Request.Form["email"]));
                string id = Convert.ToString(QueryAES.UrlDecode(Request.Form["id"]));
                id = System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String(id));
                string name = Convert.ToString(QueryAES.UrlDecode(Request.Form["name"]));
                var addfClient = new WebClient();
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string loginUserIds = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (!String.IsNullOrEmpty(IsCaseWatchUser))
                {
                    if (IsCaseWatchUser == "1")
                    {
                        userIdDetail = LoggedInUser.UserName.ToString();
                        AccessTokenDetail = "internal";
                        loginUserIds = LoggedInUser.UserName.ToString();
                    }
                    else
                    {
                        AccessTokenDetail = "mykase123456789abcdef";
                        userIdDetail = joined;
                        loginUserIds = userId;
                    }
                }
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    UserId = userIdDetail,
                    Date = id,
                    mailto = email,
                    Name = name,
                    loginuserid = loginUserIds
                };
                addfClient.Encoding = System.Text.Encoding.UTF8;
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/OrderSendPDFMail"), "POST", builders);
                var param = apiUrl + "CWController=>OrderSendPDFMail=>/API/Search/OrderSendPDFMail" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic data = JObject.Parse(resid);
                statusResult = data.Status;
                return Json(statusResult, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Download order in pdf
        /// </summary>
        [FirmControllerAuthorization]
        public void OrderDownloadPDF()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var statusResult = "";
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string joined = "";
                var db = new LawPracticeEntities();
                joined = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                string userId = "", firmId = "";
                userId = strusername + Convert.ToString(LoggedInUser.UserId);
                firmId = Convert.ToString(LoggedInUser.FirmId);
                string date = Convert.ToString(HttpContext.Request.QueryString["id"]);
                date = System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String(date));
                var addfClient = new WebClient();
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string loginUserId= string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (!String.IsNullOrEmpty(IsCaseWatchUser))
                {
                    if (IsCaseWatchUser == "1")
                    {
                        userIdDetail = LoggedInUser.UserName.ToString();
                        AccessTokenDetail = "internal";
                        loginUserId= LoggedInUser.UserName.ToString();
                    }
                    else
                    {
                        AccessTokenDetail = "mykase123456789abcdef";
                        userIdDetail = joined;
                        loginUserId = userId;
                    }
                }
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    UserId = userIdDetail,
                    Date = date,
                    loginuserid = loginUserId
                };
                addfClient.Encoding = System.Text.Encoding.UTF8;
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/OrderDownloadPDF"), "POST", builders);
                var param = apiUrl + "CWController=>OrderDownloadPDF=>/API/Search/OrderDownloadPDF" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic data = JObject.Parse(resid);
                var downloadpath1 = data.data;
                try
                {
                    System.Net.WebClient webClient = new System.Net.WebClient();
                    string url = downloadpath1;
                    byte[] bytes = webClient.DownloadData(url);
                    string fileName = url.Split('/').Last();
                    Response.ContentType = "application/octet-stream";
                    Response.AppendHeader("Content-Disposition", "attachment; filename=" + fileName);
                    Response.BinaryWrite(bytes);
                    Response.End();
                }
                catch { }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
            }
        }
        /// <summary>
        /// Download nexthearing detail Excel 
        /// </summary>
        [FirmControllerAuthorization]
        public void OrderDownLoadExcel()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                string exlfilename = "OrderCaseDetailList_" + DateTime.Now;
                dynamic str = null;
                var firmids = LoggedInUser.FirmId;
                string date = Convert.ToString(HttpContext.Request.QueryString["id"]);
                date = System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String(date));
                var username = "";
                var db = new LawPracticeEntities();
                var user = LoggedInUser.UserId;
                var rolesuser = LoggedInUser.RoleId;
                var joined = "";
                string strusername = WebConfigurationManager.AppSettings["matteridname"];
                joined = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                string matteridlist = joined.ToString();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var CaseorderBaseurl = ConfigurationManager.AppSettings["CaseorderBaseurl"];
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = joined;
                }
                //add login data
                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    UserId = userIdDetail,
                    Date = date,
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/CalendarOrderDatabyDate"), "POST", builders);
                JObject jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                dynamic datass = JObject.Parse(resid);
                List<CalendarOrderList> orderlist = new List<CalendarOrderList>();
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string status = data.Status;
                    string Message = data.Message;
                    string Casename = data.data[i].vCaseName;
                    string orderdate = data.data[i].vorderDateFinal1;
                    //Add Rera check
                    if (String.IsNullOrEmpty(orderdate))
                    {
                        orderdate = "";
                    }
                    else
                    {
                        try
                        {
                            var _dts = DateTime.Parse(orderdate);
                            orderdate = _dts.ToString("dd MMM yyyy");
                        }
                        catch (Exception er)
                        {
                        }
                    }
                  
                    if (String.IsNullOrEmpty(Casename))
                    {
                        Casename = "";
                    }
                    string Advname = data.data[i].vAdvocateName;
                    if (String.IsNullOrEmpty(Advname))
                    {
                        Advname = "";
                    }
                    string Court = data.data[i].vCourt;
                    if (String.IsNullOrEmpty(Court))
                    {
                        Court = "";
                    }
                    var strcasenumber = data.data[i].casetype + " " + data.data[i].vCaseNo + "/" + data.data[i].vCaseYear;
                    // Add parts to the list.
                    orderlist.Add(new CalendarOrderList
                    {
                        Casename = removeSpecialCharacter(Casename),
                        Advname = removeSpecialCharacter(Advname),
                        Court = Court,
                        csno = strcasenumber,
                        Vordernexthearing = orderdate
                    });


                }
                var trialList = (from ob in orderlist
                                 select new
                                 {
                                     CaseNo = ob.csno,
                                     MatterName = ob.Casename,
                                     AdvocateName = ob.Advname,
                                     Court = ob.Court,
                                     OrderDate = ob.Vordernexthearing

                                 });

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
            }
        }
        /// <summary>
        /// Update live update cases manually view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult AddLiveUpdateManuallyCase()
        {
            return View();
        }
        /// <summary>
        /// Get supreme court notes and other details
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult SupremeCourtNotesAndOthers()
        {
            var db = new LawPracticeEntities();
            try
            {
                List<CounselJurisdictionObject> casedeatils = new List<CounselJurisdictionObject>();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                var doctype = QueryAES.UrlDecode(Request.Form["doctype"]);
                var caseid = QueryAES.UrlDecode(Request.Form["caseid"]);
                try
                {
                    caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
                }
                catch { }
                var username = "";
                var data2 = db.FindCaseUsername(Convert.ToInt32(caseid), LoggedInUser.FirmId.ToString()).ToList();
                if (data2 != null)
                {
                    foreach (var datas in data2)
                    {
                        username = WebConfigurationManager.AppSettings["matteridname"] + datas;
                    }
                    var data22 = db.Usp_GetCasewatchCaseMapDetails(LoggedInUser.FirmId.ToString(), caseid).FirstOrDefault();
                    if (data22 != null)
                    {
                        var casecreateuser = data22.UserId;
                        if (!String.IsNullOrEmpty(casecreateuser))
                        {
                            username = WebConfigurationManager.AppSettings["matteridname"] + casecreateuser;
                        }
                    }
                    if (doctype == "OtherDetails")
                    {
                        var addfClient = new WebClient();
                        string AccessTokenDetail = string.Empty;
                        string userIdDetail = string.Empty;
                        string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                        if (!String.IsNullOrEmpty(IsCaseWatchUser))
                        {
                            if (IsCaseWatchUser == "1")
                            {
                                userIdDetail = LoggedInUser.UserName.ToString();
                                AccessTokenDetail = "internal";
                            }
                            else
                            {
                                AccessTokenDetail = "mykase123456789abcdef";
                                userIdDetail = username;
                            }
                        }
                      
                        object drawfile = new
                        {
                            Accesstoken = AccessTokenDetail,
                            UserId = userIdDetail,
                            usercaseId = caseid,
                        };
                        addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                        string dbuilders = JsonConvert.SerializeObject(drawfile);
                        ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                        string dresid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/OtherDetails"), "POST", dbuilders);
                        var param = apiUrl + "CWController=>SupremeCourtNotesAndOthers=>/API/Search/OtherDetails" + "@" + dbuilders;
                        db.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                        return Json(dresid, JsonRequestBehavior.AllowGet);
                    }
                    else if(doctype == "tagmatter")
                    {
                        var addfClient = new WebClient();
                        string AccessTokenDetail = string.Empty;
                        string userIdDetail = string.Empty;
                        string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                        if (!String.IsNullOrEmpty(IsCaseWatchUser))
                        {
                            if (IsCaseWatchUser == "1")
                            {
                                userIdDetail = LoggedInUser.UserName.ToString();
                                AccessTokenDetail = "internal";
                            }
                            else
                            {
                                AccessTokenDetail = "mykase123456789abcdef";
                                userIdDetail = username;
                            }
                        }

                        object drawfile = new
                        {
                            Accesstoken = AccessTokenDetail,
                            UserId = userIdDetail,
                            usercaseId = caseid,
                        };
                        addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                        string dbuilders = JsonConvert.SerializeObject(drawfile);
                        ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                        string dresid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/TagMattersList"), "POST", dbuilders);
                        var param = apiUrl + "CWController=>SupremeCourtNotesAndOthers=>/API/Search/TagMattersList" + "@" + dbuilders;
                        db.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                        return Json(dresid, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        var addfClient = new WebClient();
                        string AccessTokenDetail = string.Empty;
                        string userIdDetail = string.Empty;
                        string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                        if (!String.IsNullOrEmpty(IsCaseWatchUser))
                        {
                            if (IsCaseWatchUser == "1")
                            {
                                userIdDetail = LoggedInUser.UserName.ToString();
                                AccessTokenDetail = "internal";
                            }
                            else
                            {
                                AccessTokenDetail = "mykase123456789abcdef";
                                userIdDetail = username;
                            }
                        }
                        //getting vcode fromapi
                        object drawfile = new
                        {
                            Accesstoken = AccessTokenDetail,
                            UserId = userIdDetail,
                            caseid = caseid,
                            doctype = doctype,
                            search = "",
                        };
                        addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                        string dbuilders = JsonConvert.SerializeObject(drawfile);
                        ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                        string dresid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/DocNotesDetails"), "POST", dbuilders);
                        var param = apiUrl + "CWController=>SupremeCourtNotesAndOthers=>/API/Search/DocNotesDetails" + "@" + dbuilders;
                        db.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                        return Json(dresid, JsonRequestBehavior.AllowGet);
                    }
                }
                return Json("", JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Upload custom order document details in casewatch
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult UploadCustomOrderDocument()
        {
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var caseid = QueryAES.UrlDecode(Request.Form["caseid"]);
                try
                {
                    caseid = caseid.Replace(" ", "+");
                    caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
                }
                catch
                {
                }
                var corderdate = QueryAES.UrlDecode(Request.Form["corderdate"]);
                var status = QueryAES.UrlDecode(Request.Form["status"]);
                var httpRequest = HttpContext.Request;
                var resid = AddCaseCaseWatch.UploadAppendCourtOrders(httpRequest, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), caseid, corderdate, status, apiUrl,LoggedInUser.UserName.ToString(),LoggedInUser.IsCaseWatchUser.ToString());
                return Json(resid, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Set ON/OFF case alert
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult AddCaseAlertOnOFF()
        {
            if (LoggedInUser.RoleId != 1)
            {
                var data = "\"Status\":true,\"Message\":\"Invalid User\",\"data\":[]";
                return Json(data, JsonRequestBehavior.AllowGet);
            }
            try
            {

                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var userid = QueryAES.UrlDecode(Request.Form["userid"]);
                var status = QueryAES.UrlDecode(Request.Form["status"]);
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                var db = new LawPracticeEntities();
                string joineduser = "";
                var getuserdetails = db.usp_GetUserDetailByUserID(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).FirstOrDefault();
                if (IsCaseWatchUser == "1" || getuserdetails.IsAdminCW == 1)
                {
                    userid = LoggedInUser.UserName.ToString();
                }
                else
                {
                    try
                    {
                        userid = userid.Replace(" ", "+");
                        userid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(userid));
                    }
                    catch
                    {
                    }
                }
                //try
                //{
                //    userid = userid.Replace(" ", "+");
                //    userid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(userid));
                //}
                //catch
                //{
                //}
                var resid = AddCaseCaseWatch.AddCaseAlertOnOFF(userid, status, apiUrl, IsCaseWatchUser);
                return Json(resid, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// Set case alert datewise
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult AddCaseAlertDays()
        {
            if (LoggedInUser.RoleId != 1)
            {
                var data = "\"Status\":true,\"Message\":\"Invalid User\",\"data\":[]";
                return Json(data, JsonRequestBehavior.AllowGet);
            }
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var userid = QueryAES.UrlDecode(Request.Form["userid"]);
                var days = QueryAES.UrlDecode(Request.Form["daysno"]);
                try
                {
                    userid = userid.Replace(" ", "+");
                    userid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(userid));
                }
                catch
                {
                }
                var resid = AddCaseCaseWatch.AddCaseAlertDays(userid, days, apiUrl);
                return Json(resid, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Set alert before set days
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult AlertDaysBefore()
        {
            if (LoggedInUser.RoleId != 1)
            {
                var data = "\"Status\":true,\"Message\":\"Invalid User\",\"data\":[]";
                return Json(data, JsonRequestBehavior.AllowGet);
            }
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var userid = QueryAES.UrlDecode(Request.Form["userid"]);
                try
                {
                    userid = userid.Replace(" ", "+");
                    userid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(userid));
                }
                catch
                {
                }
                var resid = AddCaseCaseWatch.AlertDaysBefore(userid, apiUrl);
                return Json(resid, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Download today causelist in pdf
        /// </summary>
        [FirmControllerAuthorization]
        public void TodayCauseListDownLoadPDF()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                var db = new LawPracticeEntities();
                string joineduser = "";
                joineduser = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                var s = string.Format("{0:D1}", Convert.ToDateTime(DateTime.Now.ToShortDateString()).ToString("MM"));
                var s1 = Convert.ToDateTime(DateTime.Now.ToShortDateString()).ToString("dd");
                var y1 = Convert.ToDateTime(DateTime.Now.ToShortDateString()).ToString("yyyy");
                var date = s + "/" + s1 + "/" + y1;
                string resid = AddCaseCaseWatch.MyDailyCauselistModal(LoggedInUser.UserId.ToString(), joineduser, date, apiUrl,LoggedInUser.IsCaseWatchUser,LoggedInUser.UserName.ToString());
                //export to pdf
                var filepath = CreateTodayCauseListPDFFile(resid, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), true);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
            }
        }
        /// <summary>
        /// Send today causelist in pdf from mail
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult TodayCauseListSendPDFMail()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                var db = new LawPracticeEntities();
                string joineduser = "";
                var email = QueryAES.UrlDecode(Request.Form["email"]);
                joineduser = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                var s = string.Format("{0:D1}", Convert.ToDateTime(DateTime.Now.ToShortDateString()).ToString("MM"));
                var s1 = Convert.ToDateTime(DateTime.Now.ToShortDateString()).ToString("dd");
                var y1 = Convert.ToDateTime(DateTime.Now.ToShortDateString()).ToString("yyyy");
                var date = s + "/" + s1 + "/" + y1;
                string resid = AddCaseCaseWatch.MyDailyCauselistModal(LoggedInUser.UserId.ToString(), joineduser, date, apiUrl, LoggedInUser.IsCaseWatchUser, LoggedInUser.UserName.ToString());
                //export to pdf
                dynamic pdfBytes = "";
                var filepath = CreateTodayCauseListPDFFile(resid, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), false);
                if (!String.IsNullOrEmpty(filepath))
                {
                    //string AssignmentSubmittedMailBody = WebConfigurationManager.AppSettings["basicmailtemplate"].ToString();
                    string AssignmentSubmittedMailBody = WebConfigurationManager.AppSettings["CauseListModalBasicTemplate"].ToString();
                    
                    string fromemail = WebConfigurationManager.AppSettings["fromemail"].ToString();
                    string strsubject = "", strbody = "";
                    strsubject = "myKase-Today’s Causelist details(" + @String.Format("{0:dd MMM yyyy}", DateTime.Now.ToString()) + ")";
                    strbody += "Please find attached the Today’s Causelist.";
                    AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#CONTENT#", strbody);
                    try
                    {
                        CommomUtility objmail = new CommomUtility();
                        objmail.SendEmail(fromemail, email, "", strsubject, AssignmentSubmittedMailBody, filepath);
                    }
                    catch (Exception ex)
                    {
                    }
                    //remove files
                    try
                    {
                        if (System.IO.File.Exists(filepath))
                        {
                            System.IO.File.Delete(filepath);
                        }
                    }
                    catch (Exception er)
                    {
                    }
                }
                return Json("True", JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Create today causelist pdf file
        /// </summary>
        /// <param name="resid"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="IsDownload"></param>
        /// <returns></returns>
        public string CreateTodayCauseListPDFFile(string resid, string firmid, string userid, bool IsDownload)
        {
            var db = new LawPracticeEntities();
            string strtemplate = "";
            var mykaselogopath = Server.MapPath("~\\Manupanel\\img\\top-logopdf.png");
            var firmlogopath = "";
            var firmlogo = db.usp_GetHomePageData(Guid.Parse(firmid)).FirstOrDefault();
            if (firmlogo != null)
            {
                firmlogopath = Server.MapPath("~\\" + firmlogo.LogoPath.Replace("/", "\\"));
            }
            JObject jObject = JObject.Parse(resid);
            dynamic dataStatus = jObject["data"]["Table1"];
            dynamic dataStatus1 = jObject["data"]["Table2"];
            dynamic dataStatus2 = jObject["data"]["Table3"];
            dynamic dataStatus3 = jObject["data"]["Table4"];
            dynamic dataStatus4 = jObject["data"]["Table5"];
            List<TodayCauseList> CauseListSupreme = new List<TodayCauseList>();
            List<TodayCauseList> CauseListDistrict = new List<TodayCauseList>();
            List<TodayCauseList> CauseListTribunal = new List<TodayCauseList>();
            List<TodayCauseList> CauseListRera = new List<TodayCauseList>();
            List<TodayCauseList> CauseListRERH = new List<TodayCauseList>();
            for (int i = 0; i < dataStatus.Count; i++)
            {
                dynamic data = dataStatus;
                string Courtname = data[i]["Courtname"];
                string vCaseType = data[i]["vCaseType"];
                string vcaseno = data[i]["vcaseno"];
                string vcaseyear = data[i]["vcaseyear"];
                string vCourtNo = data[i]["vCourtNo"];
                string Filetext = data[i]["Filetext"];
                string vDiaryNo = data[i]["vDiaryNo"];
                string vDiaryYear = data[i]["vDiaryYear"];
                // Add parts to the list.
                CauseListSupreme.Add(new TodayCauseList
                {
                    Courtname = Courtname,
                    vCaseType = vCaseType,
                    vcaseno = vcaseno,
                    vcaseyear = vcaseyear,
                    vCourtNo = vCourtNo,
                    Filetext = Filetext,
                    vDiaryNo = vDiaryNo,
                    vDiaryYear = vDiaryYear,
                });
            }
            for (int i = 0; i < dataStatus1.Count; i++)
            {
                dynamic data = dataStatus1;
                string vcasetypename = data[i]["vcasetypename"];
                string vstate = data[i]["vstate"];
                string vDistrict = data[i]["vDistrict"];
                string JudgName = data[i]["JudgName"];
                string vCourtDetails = data[i]["vCourtDetails"];
                string Filetext = data[i]["Filetext"];
                // Add parts to the list.
                CauseListDistrict.Add(new TodayCauseList
                {
                    vcasetypename = vcasetypename,
                    vstate = vstate,
                    vDistrict = vDistrict,
                    JudgName = JudgName,
                    vCourtDetails = vCourtDetails,
                    Filetext = Filetext,
                });
            }
            for (int i = 0; i < dataStatus2.Count; i++)
            {
                dynamic data = dataStatus2;
                string Courtname = data[i]["Courtname"];
                string vCaseType = data[i]["vCaseType"];
                string vcaseno = data[i]["vcaseno"];
                string vcaseyear = data[i]["vcaseyear"];
                string Benchname = data[i]["Benchname"];
                string Filetext = data[i]["Filetext"];
                string vDiaryNo = data[i]["vDiaryNo"];
                string vDiaryYear = data[i]["vDiaryYear"];
                // Add parts to the list.
                CauseListTribunal.Add(new TodayCauseList
                {
                    Courtname = Courtname,
                    vCaseType = vCaseType,
                    vcaseno = vcaseno,
                    vcaseyear = vcaseyear,
                    Benchname = Benchname,
                    Filetext = Filetext,
                    vDiaryNo = vDiaryNo,
                    vDiaryYear = vDiaryYear,
                });
            }
            for (int i = 0; i < dataStatus3.Count; i++)
            {
                dynamic data = dataStatus3;
                string Courtname = data[i]["Courtname"];
                string vCaseType = data[i]["vCaseType"];
                string vcaseno = data[i]["vcaseno"];
                string vcaseyear = data[i]["vcaseyear"];
                string Benchname = data[i]["Benchname"];
                string Filetext = data[i]["Filetext"];
                // Add parts to the list.
                CauseListRera.Add(new TodayCauseList
                {
                    Courtname = Courtname,
                    vCaseType = vCaseType,
                    vcaseno = vcaseno,
                    vcaseyear = vcaseyear,
                    Benchname = Benchname,
                    Filetext = Filetext
                });
            }
            for (int i = 0; i < dataStatus4.Count; i++)

            {

                dynamic data = dataStatus4;

                string vCourt = data[i]["vCourt"];

                string vCauselistDate = data[i]["vCauselistDate"];

                string AppealNo = data[i]["AppealNo"];

                string Courtname = data[i]["Courtname"];

                string Status = data[i]["vStatus"];

                string vCaseName = data[i]["vCaseName"];

                // Add parts to the list.

                CauseListRERH.Add(new TodayCauseList

                {

                    Courtname = Courtname,

                    vCaseType = vCaseName,

                    vcaseno = vCauselistDate,

                    vcaseyear = AppealNo,

                    Benchname = Status,

                    Filetext = vCourt

                });

            }

            string filename = "TodayCauseList_" + DateTime.Now.Millisecond + ".pdf";
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
            if (CauseListSupreme?.Count > 0)
            {
                strtemplate += " <p>Supreme Court/High Court</p>";
                //////Supreme Court/High Court//////
                strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                strtemplate += "  <thead><tr> ";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Court</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Case Type</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Case no</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Case Year</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Court No</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Causelist Detail</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Diary no</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Diary Year</th>";
                strtemplate += "</tr></thead><tbody>";
                foreach (var idata in CauseListSupreme)
                {
                    strtemplate += "<tr><td height = '20' align = 'left' valign ='top'  style='padding:0 5px;' >" + idata.Courtname + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.vCaseType + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.vcaseno + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.vcaseyear + "  </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.vCourtNo + "  </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.Filetext + "  </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.vDiaryNo + "  </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.vDiaryYear + "  </td></tr>";
                }
                strtemplate += "</tbody></table>";
            }
            //////District Court//////
            if (CauseListDistrict?.Count > 0)
            {
                strtemplate += " <p>District Court</p>";
                strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                strtemplate += "  <thead><tr> ";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Case</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>State</ th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>District</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Judge Name</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Court Details</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Causelist Detail</th>";
                strtemplate += "</tr></thead><tbody>";
                foreach (var idata in CauseListDistrict)
                {
                    strtemplate += "<tr><td height = '20' align = 'left' valign ='top'  style='padding:0 5px;' >" + idata.vcasetypename + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.vstate + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.vDistrict + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.JudgName + "  </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.vCourtDetails + "  </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.Filetext + "  </td></tr>";
                }
                strtemplate += "</tbody></table>";
            }
            //////Tribunals Court//////
            if (CauseListTribunal?.Count > 0)
            {
                strtemplate += " <p>Tribunals Court</p>";
                strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                strtemplate += "  <thead><tr> ";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Court</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Case Type</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Case no</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Case Year</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Bench Name</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Causelist Detail</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Diary no</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Diary Year</th>";
                strtemplate += "</tr></thead><tbody>";
                foreach (var idata in CauseListTribunal)
                {
                    strtemplate += "<tr><td height = '20' align = 'left' valign ='top'  style='padding:0 5px;' >" + idata.Courtname + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.vCaseType + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.vcaseno + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.vcaseyear + "  </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.Benchname + "  </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.Filetext + "  </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.vDiaryNo + "  </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.vDiaryYear + "  </td></tr>";
                }
                strtemplate += "</tbody></table>";
            }
            if (CauseListRera?.Count > 0)
            {
                strtemplate += " <p>RERA Court</p>";
                strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                strtemplate += "  <thead><tr> ";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Court</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Case Type</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Case no</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Case Year</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Bench Name</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Causelist Detail</th>";
                strtemplate += "</tr></thead><tbody>";
                foreach (var idata in CauseListRera)
                {
                    strtemplate += "<tr><td height = '20' align = 'left' valign ='top'  style='padding:0 5px;' >" + idata.Courtname + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.vCaseType + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.vcaseno + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.vcaseyear + "  </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.Benchname + "  </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.Filetext + "  </td></tr>";
                }
                strtemplate += "</tbody></table>";
            }
            if (CauseListRERH?.Count > 0)
            {
                strtemplate += " <p>Revenue Court</p>";
                strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                strtemplate += "  <thead><tr> ";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Case Name</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Court</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Causelist Date</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>AppealNo</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Court Name</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Status</th>";
                strtemplate += "</tr></thead><tbody>";
                foreach (var idata in CauseListRERH)
                {
                    strtemplate += "<tr><td height = '20' align = 'left' valign ='top'  style='padding:0 5px;' >" + idata.vCaseType + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.Filetext + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.vcaseno + " </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.vcaseyear + "  </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.Courtname + "  </td>";
                    strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.Benchname + "  </td></tr>";
                }
                strtemplate += "</tbody></table>";
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
            if (IsDownload == true)
            {
                if (!String.IsNullOrEmpty(pffth))
                {
                    Response.Clear();
                    System.IO.MemoryStream ms = new System.IO.MemoryStream(pdfBytes);
                    Response.ContentType = "application/pdf";
                    Response.AddHeader("content-disposition", "attachment;filename=" + Path.GetFileName(pffth) + "");
                    Response.Buffer = true;
                    ms.WriteTo(Response.OutputStream);
                    Response.End();
                }
            }
            else
            {
            }
            return pffth;
        }
        /// <summary>
        /// Update notes by case id
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public string UploadNotesByCaseId()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                string caseid = Convert.ToString(QueryAES.UrlDecode(Request.Form["caseid"]));
                var detaiils = Convert.ToString(QueryAES.UrlDecode(Request.Form["detaiils"]));
                string resid = AddCaseCaseWatch.UploadNotesByCaseId(caseid, userId, detaiils, apiUrl,LoggedInUser.IsCaseWatchUser,LoggedInUser.UserName.ToString());
                return resid;
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return ex.Message.ToString();
            }
        }
        /// <summary>
        /// Remove case notes by case id
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public string RemoveCaseNotes()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                string noteid = Convert.ToString(QueryAES.UrlDecode(Request.Form["noteid"]));

                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (!String.IsNullOrEmpty(IsCaseWatchUser))
                {
                    if (IsCaseWatchUser == "1")
                    {
                        userIdDetail = LoggedInUser.UserName.ToString();
                        AccessTokenDetail = "internal";
                    }
                    else
                    {
                        AccessTokenDetail = "mykase123456789abcdef";
                        userIdDetail = userId;
                    }
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }

                string resid = AddCaseCaseWatch.RemoveCaseNotes(userIdDetail, noteid, apiUrl, AccessTokenDetail);
                return resid;
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return ex.Message.ToString();
            }
        }
        /// <summary>
        /// Get mykase document notes details
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public string MyKaseDocNotesDetails()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "";
                userId = strusername + LoggedInUser.UserId.ToString();

                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (!String.IsNullOrEmpty(IsCaseWatchUser))
                {
                    if (IsCaseWatchUser == "1")
                    {
                        userIdDetail = LoggedInUser.UserName.ToString();
                        AccessTokenDetail = "internal";
                    }
                    else
                    {
                        AccessTokenDetail = "mykase123456789abcdef";
                        userIdDetail = userId;
                    }
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }

                string caseid = Convert.ToString(QueryAES.UrlDecode(Request.Form["caseid"]));
                //string resid = AddCaseCaseWatch.MyKaseDocNotesDetails(caseid, userId, "note", "", apiUrl);
                string resid = AddCaseCaseWatch.MyKaseDocNotesDetails(caseid, userIdDetail, "note", "", apiUrl, AccessTokenDetail);
                return resid;
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return ex.Message.ToString();
            }
        }
        /// <summary>
        /// Bind set ON alert details
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public string BindAlertFor()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                string resid = AddCaseCaseWatch.FillAlertOn(userId, apiUrl);
                return resid;
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return ex.Message.ToString();
            }
        }
        /// <summary>
        /// Get mykase court count details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public JsonResult MykaseCourtCount()
        {
            List<CWCaseList> casedeatils = new List<CWCaseList>();
            try
            {
                var db1 = new LawPracticeEntities();
                //var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                //string strusername = ConfigurationManager.AppSettings["matteridname"];
                //string userId = "", firmId = "";
                //userId = strusername + LoggedInUser.UserId.ToString();
                //firmId = LoggedInUser.FirmId.ToString();
                //int pagesize = 10, pageindex = 1;
                //var db = new LawPracticeEntities();
                //string joineduser = "";
                //var Iflag = 0;
                //if (LoggedInUser.RoleId == 1)
                //{
                //    Iflag = 1;
                //}
                //joineduser = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                //var addfClient = new WebClient();
                //object rawfile = new
                //{
                //    Accesstoken = "mykase123456789abcdef",
                //    iflag = Iflag,
                //    UserId = joineduser
                //};
                //addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                //string builders = JsonConvert.SerializeObject(rawfile);
                //ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                //string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MykaseCourtCount"), "POST", builders);
                //dynamic jObject = JObject.Parse(resid);
                //dynamic data1 = jObject["data"];
                //for (int i = 0; i < data1.Count; i++)
                //{
                //    dynamic data = JObject.Parse(resid);
                //    casedeatils.Add(new CWCaseList
                //    {
                //        Court = data.data[i]["courttype"],
                //        Totals = Convert.ToString(data.data[i]["Totals"])
                //    });
                //}
                var courtCount = db1.Usp_GetCourtWiseCount(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).ToList();
                for (int i = 0; i < courtCount.Count(); i++)
                {
                    //dynamic data = JObject.Parse(resid);
                    casedeatils.Add(new CWCaseList
                    {
                        Court = courtCount[i].Court,
                        Totals = Convert.ToString(courtCount[i].Totals)
                    });
                }
                casedeatils.OrderByDescending(x => x.CaseName);
                return Json(casedeatils, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Litigation Casewatch and Mykase merge task starting
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult LitigationCaseList()
        {

            //Check STF User Right Permission Start
            var db = new LawPracticeEntities();

            try
            {
                string firmid = LoggedInUser.FirmId.ToString();
                string roleId = LoggedInUser.RoleId.ToString();
                // var data = db.sp_Get_STF_Permission(firmid).FirstOrDefault();
                string stfpermission = ConfigurationManager.AppSettings["StfModulePermission"];
                string isIOB = ConfigurationManager.AppSettings["IOBCutstomFirmId"];
                if (stfpermission.ToLower() == firmid.ToLower())
                {
                    ViewBag.stfUser = 1;
                    if (roleId.Equals("2"))
                    {
                        ViewBag.stfUserRole = 2;
                    }
                    else
                    {
                        ViewBag.stfUserRole = 0;

                    }

                }
                else
                {
                    ViewBag.stfUser = 0;
                    ViewBag.stfUserRole = 0;


                }

                //For IOB Custmization
                if (isIOB.ToLower() == firmid.ToLower())
                {
                    ViewBag.isIOB = 1;
                }
                else
                {
                    ViewBag.isIOB = 0;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            //Check STF User Right Permission End


            return View();
        }
        /// <summary>
        /// Litigation archive caselist details
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public string LitigationcaseArchive()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                string Usercaseid = QueryAES.UrlDecode(Request.Form["Usercaseid"]);
                try
                {
                    Usercaseid = Usercaseid.Replace(" ", "+");
                    Usercaseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(Usercaseid));
                }
                catch { }
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                var userId = strusername + LoggedInUser.UserId.ToString();

                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (!String.IsNullOrEmpty(IsCaseWatchUser))
                {
                    if (IsCaseWatchUser == "1")
                    {
                        userIdDetail = LoggedInUser.UserName.ToString();
                        AccessTokenDetail = "internal";
                    }
                    else
                    {
                        AccessTokenDetail = "mykase123456789abcdef";
                        userIdDetail = userId;
                    }
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }
                 
                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    userid = userIdDetail,
                    caseid = Usercaseid
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AddCasetoArchive"), "POST", builders);
                var param = apiUrl + "CWController=>AddCasetoArchive=>/API/Search/AddCasetoArchive" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic data = JObject.Parse(resid);
                string status = data.Status;
                string Message = data.Message;
                string dataval = data.data;
                return resid;
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return ex.Message.ToString();
            }
        }
        /// <summary>
        /// Export litigation case details list
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportToExcelLitigationCaseDetails()
        {
            var db1 = new LawPracticeEntities();
            List<CaseDetailsListByUserCaseId> lstModelPDF = new List<CaseDetailsListByUserCaseId>();
            CaseDetailsListByUserCaseId modelPDF = new CaseDetailsListByUserCaseId();
            try
            {
                string exlfilename = "LitigationCaseList_" + DateTime.Now;
                var courtname = QueryAES.UrlDecode(HttpContext.Request.QueryString["courtname"]);
                var CaseStatus = QueryAES.UrlDecode(HttpContext.Request.QueryString["CaseStatus"]);
                var hearingfrom = QueryAES.UrlDecode(HttpContext.Request.QueryString["hearingfrom"]);
                var hearingto = QueryAES.UrlDecode(HttpContext.Request.QueryString["hearingto"]);
                var casename = QueryAES.UrlDecode(HttpContext.Request.QueryString["casename"]);
                var casenumber = QueryAES.UrlDecode(HttpContext.Request.QueryString["casenuber"]);
                var mnexthearingflag = QueryAES.UrlDecode(HttpContext.Request.QueryString["mnexthearingflag"]);
                var advocatefilter = QueryAES.UrlDecode(HttpContext.Request.QueryString["advocate"]);
                var searchany = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchany"]);
                var tagname = QueryAES.UrlDecode(HttpContext.Request.QueryString["tagname"]);
                if (String.IsNullOrEmpty(hearingfrom) || hearingfrom == "null" || hearingfrom == "0") { hearingfrom = ""; }
                if (String.IsNullOrEmpty(hearingto) || hearingto == "null" || hearingto == "0")
                { hearingto = ""; }
                if (String.IsNullOrEmpty(tagname) || tagname == "null" || tagname == "0") { tagname = ""; }
                List<CWCaseList> casedeatils = new List<CWCaseList>();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                var teammembersr = QueryAES.UrlDecode(HttpContext.Request.QueryString["teammebersrch"]);
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                int pagesize = 10, pageindex = 1;
                pageindex = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagenum"]));
                pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagesize"]));
                var petionersrh = QueryAES.UrlDecode(HttpContext.Request.QueryString["petionersrh"]);
                var respondentsrh = QueryAES.UrlDecode(HttpContext.Request.QueryString["respondentsrh"]);
                var sortdate = QueryAES.UrlDecode(HttpContext.Request.QueryString["sortdate"]);
                var exportcolumn = QueryAES.UrlDecode(HttpContext.Request.QueryString["exportcolumn"]);
                var courtfilter = QueryAES.UrlDecode(HttpContext.Request.QueryString["courtfilter"]);
                //Remarks filter
                var Remarks = QueryAES.UrlDecode(HttpContext.Request.QueryString["Remarks"]);
                var db = new LawPracticeEntities();
                string joineduser = "";
                joineduser = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                if (string.IsNullOrEmpty(joineduser))
                {
                    joineduser = userId;
                }
                var Iflag = 0;
                if (LoggedInUser.RoleId == 1)
                {
                    Iflag = 1;
                }

                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (!String.IsNullOrEmpty(IsCaseWatchUser))
                {
                    if (IsCaseWatchUser == "1")
                    {
                        userIdDetail = LoggedInUser.UserName.ToString();
                        AccessTokenDetail = "internal";
                    }
                    else
                    {
                        AccessTokenDetail = "mykase123456789abcdef";
                        userIdDetail = joineduser;
                    }
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = joineduser;
                }
                //for Adding the filter option of Assign team member.
                string teammemberid = "";
                if (!string.IsNullOrEmpty(teammembersr))
                {
                    var getuserdetails = db.usp_GetUserDetailByUserID(LoggedInUser.FirmId.ToString(), teammembersr).FirstOrDefault();
                    if (getuserdetails.IsCaseWatch == 1)
                    {
                        teammemberid = getuserdetails.UserName.ToString();
                    }
                    else
                    {
                        teammemberid = strusername + teammembersr.ToString();
                    }
                }
                //add login data
                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    userid = userId,
                    court = "",
                    courttype = courtfilter,
                    iflag = Iflag,
                    pageindex = pageindex,
                    pagesize = pagesize,
                    pstatus = CaseStatus,
                    nextdatesorting = sortdate,
                    SearchText = "",
                    fromdate = hearingfrom,
                    todate = hearingto,
                    istype = searchany,
                    Taggedname = tagname,
                    bench = "",
                    caseno = casenumber,
                    advocatename = advocatefilter,
                    flagManualdtrange = mnexthearingflag,
                    casename = casename,
                    courtdistrict = courtname,
                    diaryno = "",
                    cnrno = "",
                    caseyear = "",
                    assigneduserid = teammemberid,
                    applicant = petionersrh,
                    respondent = respondentsrh,
                    casenotesearch = Remarks
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                addfClient.Encoding = Encoding.UTF8;
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                //   string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MyCasesV1Export"), "POST", builders);
                //  var param = apiUrl + "CWController=>ExportToExcelLitigationCaseDetails=>/API/Search/MyCasesV1Export" + "@" + builders;
                //     db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MyCasesV1"), "POST", builders);
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                  //  int tempusercaseid = Convert.ToInt32(data.data[i]["UserCaseId"]);
                   // var matterIDCase = db.Usp_MattersDetilsForCW(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), tempusercaseid.ToString()).FirstOrDefault();
                    casedeatils.Add(new CWCaseList
                    {
                        CaseDiary = Convert.ToString(data.data[i]["Case/Diary"]),
                        Court = data.data[i]["CourtName"],
                        CaseName = (data.data[i]["iCaseNotFound"] == 1 ? "Case not available" : data.data[i]["Case Name"]),
                        Advocate = data.data[i]["Advocate"],
                        NextHearing = data.data[i]["Next Hearing"],
                        DisposedDate = data.data[i]["Disposed Date"],
                        Status = data.data[i]["Status"],
                        ManualNextHearing = data.data[i]["ManualNexthearing"],
                        PetitionerName = data.data[i]["PetitionerName"],
                        RespondentName = data.data[i]["RespondentName"],
                        CourtComplexCourtEstablishment = (data.data[i]["Court Complex/Court Establishment"] == null ? "" : data.data[i]["Court Complex/Court Establishment"]),
                        CreatedOn = data.data[i]["CreatedOn"],
                        BenchName = Convert.ToString(data.data[i]["Bench Name"]),
                        CNRNo = (data.data[i]["CNR No"] == null ? "" : data.data[i]["CNR No"]),
                        CourtName = (data.data[i]["CourtType"] == "1" ? "Supreme Court" : data.data[i]["CourtType"] == "2" ? "High Court" : data.data[i]["CourtType"] == "3" ? "District Court" : data.data[i]["CourtType"] == "4" ? "Tribunals" : data.data[i]["CourtType"] == "5" ? "Add a Court" : data.data[i]["CourtType"]),
                        // MatterName = matterIDCase == null ? "" : matterIDCase.mname.ToString()
                        MatterName = "",
                        BranchName = (data.data[i]["BranchName"] == null ? "" : data.data[i]["BranchName"]),
                        BranchCode = (data.data[i]["BranchCode"] == null ? "" : data.data[i]["BranchCode"]),
                        RegionCode = (data.data[i]["RegionCode"] == null ? "" : data.data[i]["RegionCode"]),
                        RegionName = (data.data[i]["RegionName"] == null ? "" : data.data[i]["RegionName"]),
                        CaseNote = (data.data[i]["CaseNotes"] == null ? "" : data.data[i]["CaseNotes"]),
                        UserCaseId= Convert.ToString(data.data[i]["UserCaseId"])
                    });
                }
                try
                {
                    var Idlist = casedeatils.Select(x => x.UserCaseId).ToList();
                    var UserIdlist=string.Join(",", Idlist);
                    var trialList_1 = DataAccessADO.GetMatterDetailsByUserCaseId(LoggedInUser.FirmId.ToString(), UserIdlist);
                    lstModelPDF = JsonConvert.DeserializeObject<List<CaseDetailsListByUserCaseId>>(trialList_1);
                    //var matterIDCase = db.Usp_MattersDetilsForCW1(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), UserIdlist.ToString()).ToList();
                }
                catch{}

                var trialList = (from ob in casedeatils
                                 select new
                                 {
                                     OpenDate= ob.CreatedOn,
                                     CourtCaseNo = (ob.CaseDiary == null || ob.CaseDiary == "") ? "" : Regex.Replace(ob.CaseDiary, "<.*?>", string.Empty),
                                     CourtName = ob.Court,
                                     CaseName = ob.CaseName,
                                     Advocate = (ob.Advocate == null || ob.Advocate == "") ? "" : Regex.Replace(ob.Advocate, "<.*?>", string.Empty),
                                     NextHearing = ob.NextHearing,
                                     ManualNextHearing = ob.ManualNextHearing,
                                     DisposedDate = ob.DisposedDate,
                                     CourtStatus = ob.Status,
                                     PetitionerName = ob.PetitionerName,
                                     RespondentName = ob.RespondentName,
                                     CourtComplex = (ob.CourtComplexCourtEstablishment+ " "+ ob.BenchName),
                                     CNRNumber=ob.CNRNo,
                                     Court= ob.CourtName,
                                     // MatterName=ob.MatterName
                                     MatterName= lstModelPDF.Where(x => x.UserCaseId == ob.UserCaseId).Select(x=>x.mname).FirstOrDefault(),
                                     RegionName =ob.RegionName,
                                     BranchName=ob.BranchName,
                                     BranchCode=ob.BranchCode,
                                     Remarks=ob.CaseNote
                                 }).ToList();
                var gv = new GridView();
                gv.DataSource = trialList;
                gv.DataBind();

                var chkcvaues = exportcolumn;
                string[] nums = chkcvaues.Split(',');
                for (int j = 0; j < gv.HeaderRow.Cells.Count; j++)
                {
                    gv.HeaderRow.Cells[j].Visible = false;
                    foreach (GridViewRow itemrow in gv.Rows)
                    {
                        var sd = itemrow.Cells[0].Text;
                        itemrow.Cells[j].Visible = false;
                    }
                }
                for (int j = 0; j < gv.HeaderRow.Cells.Count; j++)
                {
                    var cdd = gv.HeaderRow.Cells[j].Text;
                    if (nums.Contains(cdd))
                    {
                        gv.HeaderRow.Cells[j].Visible = true;
                        foreach (GridViewRow itemrow in gv.Rows)
                        {
                            itemrow.Cells[j].Visible = true;
                        }
                    }
                }
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
        /// Export litigation case details in PDF
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportToPDFLitigationCaseDetails()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                string filename = "LitigationCaseList.pdf";
                var courtname = QueryAES.UrlDecode(HttpContext.Request.QueryString["courtname"]);
                var CaseStatus = QueryAES.UrlDecode(HttpContext.Request.QueryString["CaseStatus"]);
                var hearingfrom = QueryAES.UrlDecode(HttpContext.Request.QueryString["hearingfrom"]);
                var hearingto = QueryAES.UrlDecode(HttpContext.Request.QueryString["hearingto"]);
                var casename = QueryAES.UrlDecode(HttpContext.Request.QueryString["casename"]);
                var casenumber = QueryAES.UrlDecode(HttpContext.Request.QueryString["casenuber"]);
                var mnexthearingflag = QueryAES.UrlDecode(HttpContext.Request.QueryString["mnexthearingflag"]);
                var advocatefilter = QueryAES.UrlDecode(HttpContext.Request.QueryString["advocate"]);
                var searchany = QueryAES.UrlDecode(HttpContext.Request.QueryString["searchany"]);
                var tagname = QueryAES.UrlDecode(HttpContext.Request.QueryString["tagname"]);
                var teammembersr = QueryAES.UrlDecode(HttpContext.Request.QueryString["teammebersrch"]);
                var petionersrh = QueryAES.UrlDecode(HttpContext.Request.QueryString["petionersrh"]);
                var respondentsrh = QueryAES.UrlDecode(HttpContext.Request.QueryString["respondentsrh"]);
                var sortdate = QueryAES.UrlDecode(HttpContext.Request.QueryString["sortdate"]);
                if (String.IsNullOrEmpty(hearingfrom) || hearingfrom == "null" || hearingfrom == "0") { hearingfrom = ""; }
                if (String.IsNullOrEmpty(hearingto) || hearingto == "null" || hearingto == "0")
                { hearingto = ""; }
                if (String.IsNullOrEmpty(tagname) || tagname == "null" || tagname == "0") { tagname = ""; }
                List<CWCaseList> casedeatils = new List<CWCaseList>();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                int pagesize = 10, pageindex = 1;
                pageindex = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagenum"]));
                pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagesize"]));
                var courtfilter = QueryAES.UrlDecode(HttpContext.Request.QueryString["courtfilter"]);
                //Remarks filter
                var Remarks = QueryAES.UrlDecode(HttpContext.Request.QueryString["Remarks"]);
                var db = new LawPracticeEntities();
                string joineduser = "";
                joineduser = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                if (string.IsNullOrEmpty(joineduser))
                {
                    joineduser = userId;
                }
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
                strtemplate += "<center><p><strong>Mykase-Discovered matters List</strong><span style='float:right'>Date: " + String.Format("{0:dd MMM yyyy}", DateTime.Now) + "</span></p></hr>";
                strtemplate += " <p></p>";
                var addfClient = new WebClient();

                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (!String.IsNullOrEmpty(IsCaseWatchUser))
                {
                    if (IsCaseWatchUser == "1")
                    {
                        userIdDetail = LoggedInUser.UserName.ToString();
                        AccessTokenDetail = "internal";
                    }
                    else
                    {
                        AccessTokenDetail = "mykase123456789abcdef";
                        userIdDetail = joineduser;
                    }
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = joineduser;
                }
                //for Adding the filter option of Assign team member.
                string teammemberid = "";
                if (!string.IsNullOrEmpty(teammembersr))
                {
                    var getuserdetails = db.usp_GetUserDetailByUserID(LoggedInUser.FirmId.ToString(), teammembersr).FirstOrDefault();
                    if (getuserdetails.IsCaseWatch == 1)
                    {
                        teammemberid = getuserdetails.UserName.ToString();
                    }
                    else
                    {
                        teammemberid = strusername + teammembersr.ToString();
                    }
                }
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    userid = userId,
                    court = "",
                    courttype = courtfilter,
                    iflag = Iflag,
                    pageindex = pageindex,
                    pagesize = pagesize,
                    pstatus = CaseStatus,
                    nextdatesorting = sortdate,
                    SearchText = "",
                    fromdate = hearingfrom,
                    todate = hearingto,
                    istype = searchany,
                    Taggedname = tagname,
                    bench = "",
                    caseno = casenumber,
                    advocatename = advocatefilter,
                    flagManualdtrange = mnexthearingflag,
                    casename = casename,
                    courtdistrict = courtname,
                    diaryno = "",
                    cnrno = "",
                    caseyear = "",
                    assigneduserid = teammemberid,
                    applicant = petionersrh,
                    respondent = respondentsrh,
                    casenotesearch = Remarks
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                addfClient.Encoding = Encoding.UTF8;
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                // string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MyCasesV1Export"), "POST", builders);
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MyCasesV1"), "POST", builders);
                var param = apiUrl + "CWController=>ExportToPDFLitigationCaseDetails=>/API/Search/MyCasesV1" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    casedeatils.Add(new CWCaseList
                    {
                        CaseDiary = Convert.ToString(data.data[i]["Case/Diary"]),
                        Court = data.data[i]["CourtName"],
                        CaseName = (data.data[i]["iCaseNotFound"] == 1 ? "Case not available" : data.data[i]["Case Name"]),
                        Advocate = data.data[i]["Advocate"],
                        NextHearing = data.data[i]["Next Hearing"],
                        DisposedDate = data.data[i]["Disposed Date"],
                        Status = data.data[i]["Status"],
                        ManualNextHearing = data.data[i]["ManualNexthearing"],
                        PetitionerName = data.data[i]["PetitionerName"],
                        RespondentName = data.data[i]["RespondentName"],
                        CourtComplexCourtEstablishment = (data.data[i]["Court Complex/Court Establishment"] == null ? "" : data.data[i]["Court Complex/Court Establishment"]),
                    });
                }
                var trialList = (from ob in casedeatils
                                 select new
                                 {
                                     CaseNo = (ob.CaseDiary == null || ob.CaseDiary == "") ? "" : Regex.Replace(ob.CaseDiary, "<.*?>", string.Empty),
                                     Court_District = ob.Court,
                                     CaseName = ob.CaseName,
                                     Advocate = (ob.Advocate == null || ob.Advocate == "") ? "" : Regex.Replace(ob.Advocate, "<.*?>", string.Empty),
                                     NextHearing = ob.NextHearing,
                                     ManualNextHearing = ob.ManualNextHearing,
                                     DisposedDate = ob.DisposedDate,
                                     Status = ob.Status,
                                     PetitionerName = ob.PetitionerName,
                                     RespondentName = ob.RespondentName,
                                     CourtEstablishment = ob.CourtComplexCourtEstablishment
                                 }).ToList();
                strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                strtemplate += "  <thead><tr> ";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>CaseNo</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Court_District</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>CaseName</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Advocate</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>NextHearing</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>ManualNextHearing</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>DisposedDate</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Status</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>PetitionerName</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>RespondentName</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>CourtEstablishment</th>";
                strtemplate += "</tr></thead><tbody>";
                if (trialList != null)
                {
                    foreach (var idata in trialList)
                    {
                        strtemplate += "<tr><td height = '20' align = 'left' valign ='top'  style='padding:0 5px;' >" + idata.CaseNo + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.Court_District + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.CaseName + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.Advocate + "  </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + String.Format("{0:dd MMM yyyy}", idata.NextHearing) + "  </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + String.Format("{0:dd MMM yyyy}", idata.ManualNextHearing) + "  </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + String.Format("{0:dd MMM yyyy}", idata.DisposedDate) + "  </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.Status + "  </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.PetitionerName + "  </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.RespondentName + "  </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.CourtEstablishment + "  </td></tr>";
                    }
                    strtemplate += "</tbody></table>";
                }
                else { }
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
                System.IO.MemoryStream ms = new System.IO.MemoryStream(pdfBytes);
                Response.ContentType = "application/pdf";
                Response.AddHeader("content-disposition", "attachment;filename=" + filename + "");
                Response.Buffer = true;
                ms.WriteTo(Response.OutputStream);
                Response.End();
                //return "success";
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                Response.Redirect("/home/Error");
            }
        }
        /// <summary>
        /// Rerun litigation case list details
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public string LitigationCaseRerun()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                string Usercaseid = QueryAES.UrlDecode(Request.Form["Usercaseid"]);
                try
                {
                    Usercaseid = Usercaseid.Replace(" ", "+");
                    Usercaseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(Usercaseid));
                }
                catch { }
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                var userId = strusername + LoggedInUser.UserId.ToString();

                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }

                var addfClient = new WebClient();
                object rawfile = new
                {
                    accesstoken = AccessTokenDetail,
                    userid = userIdDetail,
                    caseIds = Usercaseid
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/ReRunCase"), "POST", builders);
                var param = apiUrl + "CWController=>ReRunCase=>/API/Search/ReRunCase" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic data = JObject.Parse(resid);
                string status = data.Status;
                string Message = data.Message;
                var result = status;
                return result.ToString();
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return ex.Message.ToString();
            }
        }
        /// <summary>
        /// Remove litigation case from casewatch
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public string LitigationCaseReomve()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                string Usercaseid = QueryAES.UrlDecode(Request.Form["Usercaseid"]);
                try
                {
                    Usercaseid = Usercaseid.Replace(" ", "+");
                    Usercaseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(Usercaseid));
                }
                catch { }
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                var userId = strusername + LoggedInUser.UserId.ToString();

                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (!String.IsNullOrEmpty(IsCaseWatchUser))
                {
                    if (IsCaseWatchUser == "1")
                    {
                        userIdDetail = LoggedInUser.UserName.ToString();
                        AccessTokenDetail = "internal";
                    }
                    else
                    {
                        AccessTokenDetail = "mykase123456789abcdef";
                        userIdDetail = userId;
                    }
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }

                var addfClient = new WebClient();
                object rawfile = new
                {
                    accesstoken = AccessTokenDetail,
                    Userid = userIdDetail,
                    id = Usercaseid
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/RemoveCasebyAdminUser"), "POST", builders);
                var param = apiUrl + "CWController=>RemoveCasebyAdminUser=>/API/Search/RemoveCasebyAdminUser" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic data = JObject.Parse(resid);
                string status = data.Status;
                string Message = data.Message;
                if (status == "True")
                {
                    var results = db1.usp_RemoveLitigationcase(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Usercaseid);
                }
                var result = status;
                return result.ToString();
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return ex.Message.ToString();
            }
        }
        /// <summary>
        /// New litigation case list details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public JsonResult LitigationCWCaseList()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var courtname = Convert.ToString(QueryAES.UrlDecode(Request.Form["courtname"]));
                var sortdate = Convert.ToString(QueryAES.UrlDecode(Request.Form["sortdate"]));
                var CaseStatus = Convert.ToString(QueryAES.UrlDecode(Request.Form["CaseStatus"]));
                var hearingfrom = Convert.ToString(QueryAES.UrlDecode(Request.Form["hearingfrom"]));
                var hearingto = Convert.ToString(QueryAES.UrlDecode(Request.Form["hearingto"]));
                var casename = Convert.ToString(QueryAES.UrlDecode(Request.Form["casename"]));
                var searchany = Convert.ToString(QueryAES.UrlDecode(Request.Form["searchany"]));
                var tagname = Convert.ToString(QueryAES.UrlDecode(Request.Form["tagname"]));
                if (tagname == "null")
                {
                    tagname = "";
                }
                var benchname = Convert.ToString(QueryAES.UrlDecode(Request.Form["benchname"]));
                var mnexthearingflag = QueryAES.UrlDecode(Request.Form["mnexthearingflag"]);
                var advocatefilter = QueryAES.UrlDecode(Request.Form["advocatefilter"]);
                var casenumber = QueryAES.UrlDecode(Request.Form["casenumber"]);
                List<CWCaseList> casedeatils = new List<CWCaseList>();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                string search = "";
                search = Convert.ToString(QueryAES.UrlDecode(Request.Form["search"]));
                int pagesize = 10, pageindex = 1;
                pageindex = Convert.ToInt32(QueryAES.UrlDecode(Request.Form["pagenum"]));
                pagesize = Convert.ToInt32(QueryAES.UrlDecode(Request.Form["pagesize"]));
                var courtfilter = QueryAES.UrlDecode(Request.Form["courtfilter"]);
                var assignteammember = Convert.ToString(QueryAES.UrlDecode(Request.Form["assignuserfilter"]));
                var petionersrh = QueryAES.UrlDecode(Request.Form["petionersrh"]);
                var respondentsrh = QueryAES.UrlDecode(Request.Form["respondentsrh"]);
                //Added Remark Filter
                var Remarks = QueryAES.UrlDecode(Request.Form["Remarks"]);

                var db = new LawPracticeEntities();
                string joineduser = "";
                string AccessTokenDetail = "";
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();

                joineduser = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();

                // Hierarchy firm: additionally append ALL subordinates from UserParentChain
                string hierarchyFirmId = System.Configuration.ConfigurationManager.AppSettings["HierarchyFirmId"];
                if (!string.IsNullOrEmpty(hierarchyFirmId) && LoggedInUser.FirmId.ToString().ToUpper() == hierarchyFirmId.ToUpper())
                {
                    var chainUserIds = db.Database.SqlQuery<string>(
                        @"SELECT CAST(fu.Id AS NVARCHAR(100))
                          FROM UserParentChain upc
                          JOIN FirmUsers fu ON upc.UserId = fu.Id
                          WHERE CAST(upc.AncestorUserId AS NVARCHAR(100)) = @p0 
                            AND fu.IsActive = 1 
                            AND CAST(fu.Id AS NVARCHAR(100)) != @p0",
                        LoggedInUser.UserId.ToString()).ToList();

                    if (chainUserIds.Count > 0)
                    {
                        var extraList = new List<string>();
                        foreach (var uid in chainUserIds)
                        {
                            try
                            {
                                var userDetail = db.usp_GetUserDetailByUserID(LoggedInUser.FirmId.ToString(), uid).FirstOrDefault();
                                if (userDetail != null)
                                    extraList.Add(userDetail.IsCaseWatch == 1 ? userDetail.UserName : strusername + uid);
                            }
                            catch { }
                        }
                        if (extraList.Count > 0)
                        {
                            if (!string.IsNullOrEmpty(joineduser))
                                joineduser += "," + string.Join(",", extraList);
                            else
                                joineduser = string.Join(",", extraList);
                        }
                    }
                }

                if (string.IsNullOrEmpty(joineduser))
                {
                    joineduser = userId;
                }

                // Hierarchy firm: override userId to include full chain
                string hierarchyFirmId2 = System.Configuration.ConfigurationManager.AppSettings["HierarchyFirmId"];
                if (!string.IsNullOrEmpty(hierarchyFirmId2) && LoggedInUser.FirmId.ToString().ToUpper() == hierarchyFirmId2.ToUpper())
                {
                    userId = joineduser;  // <-- THIS was missing: replace single userId with chain-inclusive list
                }

                var Iflag = 0;
                if (LoggedInUser.RoleId == 1)
                {
                    Iflag = 1;
                }
                if (IsCaseWatchUser == "1")
                {
                    joineduser = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                }
                //for Adding the filter option of Assign team member.
                string teammemberid = "";
                if (!string.IsNullOrEmpty(assignteammember))
                {
                    var getuserdetails = db.usp_GetUserDetailByUserID(LoggedInUser.FirmId.ToString(), assignteammember).FirstOrDefault();
                    if (getuserdetails.IsCaseWatch == 1)
                    {
                        teammemberid = getuserdetails.UserName.ToString();
                    }
                    else
                    {
                        teammemberid = strusername + assignteammember.ToString();
                    }
                }
                var addfClient = new WebClient();
                object rawfile = new
                {
                    //Accesstoken = "mykase123456789abcdef",
                    Accesstoken = AccessTokenDetail,
                    userid = userId,
                    court = "",
                    courttype = courtfilter,
                    iflag = Iflag,
                    pageindex = pageindex,
                    pagesize = pagesize,
                    pstatus = CaseStatus,
                    nextdatesorting = sortdate,
                    SearchText = "",
                    fromdate = hearingfrom,
                    todate = hearingto,
                    istype = searchany,
                    Taggedname = tagname,
                    bench = benchname,
                    caseno = casenumber,
                    advocatename = advocatefilter,
                    flagManualdtrange = mnexthearingflag,
                    casename = casename,
                    courtdistrict = courtname,
                    diaryno = "",
                    cnrno = "",
                    caseyear = "",
                    assigneduserid = teammemberid,
                    applicant = petionersrh,
                    respondent = respondentsrh,
                    casenotesearch= Remarks
                };
                addfClient.Encoding = System.Text.Encoding.UTF8;
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MyCasesV1"), "POST", builders);
                var param = apiUrl + "CWController=>MyCasesV1=>/API/Search/MyCasesV1" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                if (data1 != null)
                {
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        int tempusercaseid = Convert.ToInt32(data.data[i]["UserCaseId"]);
                        var matterIDCase = db.Usp_MattersDetilsForCW(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), tempusercaseid.ToString()).FirstOrDefault();
                        var tempusercaseids = Convert.ToBase64String(QueryAES.EncryptAes(tempusercaseid.ToString()));
                        string tempcaseid = Convert.ToString(data.data[i]["CaseId"]);
                        tempcaseid = Convert.ToBase64String(QueryAES.EncryptAes(tempcaseid.ToString()));
                        casedeatils.Add(new CWCaseList
                        {
                            UserCaseId = tempusercaseids,
                            CaseId = tempcaseid,
                            CaseDiary = Convert.ToString(data.data[i]["Case/Diary"]),
                            Court = data.data[i]["CourtName"],
                            // Court = (data.data[i]["CourtType"] == "3" ? data.data[i]["CourtName"] +'/'+data.data[i]["Court Complex/Court Establishment"] : data.data[i]["CourtName"]),
                            CaseName = (data.data[i]["iCaseNotFound"] == 1 ? "Case not found" : data.data[i]["Case Name"]),
                            BenchName = Convert.ToString(data.data[i]["Bench Name"]),
                            Advocate = data.data[i]["Advocate"],
                            NextHearing = data.data[i]["Next Hearing"],
                            DisposedDate = data.data[i]["Disposed Date"],
                            Status = data.data[i]["Status"],
                            District = data.data[i]["District"],
                            CourtComplexCourtEstablishmentType = data.data[i]["Court Complex/Court Establishment Type"],
                            CourtComplexCourtEstablishment = (data.data[i]["Court Complex/Court Establishment"] == null ? "" : data.data[i]["Court Complex/Court Establishment"]),
                            CourttypeId = data.data[i]["CourttypeId"],
                            CourtId = data.data[i]["CourtId"],
                            DistrictId = data.data[i]["DistrictId"],
                            TaggedName = data.data[i]["TaggedName"],
                            RowId = data.data[i]["RowId"],
                            TotalRecord = data.data[i]["TotalRecord"],
                            ManualNextHearing = data.data[i]["ManualNexthearing"],
                            PetitionerName = data.data[i]["PetitionerName"],
                            RespondentName = data.data[i]["RespondentName"],
                            CourtType = data.data[i]["CourtType"],
                            MatterID = matterIDCase == null ? "" : matterIDCase.Id.ToString(),
                            MatterName = matterIDCase == null ? "" : matterIDCase.mname.ToString(),
                            MasterCaseId = Convert.ToString(data.data[i]["CaseId"]),
                            vTaggedname = data.data[i]["vTaggedname"],
                            CreatedOn = data.data[i]["CreatedOn"],
                            CNRNo = (data.data[i]["CNR No"] == null ? "" : data.data[i]["CNR No"]),
                            CourtName= (data.data[i]["CourtType"] == "1" ? "Supreme Court" : data.data[i]["CourtType"] =="2" ? "High Court" : data.data[i]["CourtType"] == "3" ? "District Court" : data.data[i]["CourtType"] == "4" ? "Tribunals": data.data[i]["CourtType"] == "5" ? "Add a Court": data.data[i]["CourtType"]),
                            isDeleteLiveTrack = Convert.ToString(data.data[i]["isDeleteLiveTrack"]),
                            BranchName = (data.data[i]["BranchName"] == null ? "" : data.data[i]["BranchName"]),
                            BranchCode = (data.data[i]["BranchCode"] == null ? "" : data.data[i]["BranchCode"]),
                            RegionCode = (data.data[i]["RegionCode"] == null ? "" : data.data[i]["RegionCode"]),
                            RegionName = (data.data[i]["RegionName"] == null ? "" : data.data[i]["RegionName"]),
                            CaseNote = (data.data[i]["CaseNotes"] == null ? "" : data.data[i]["CaseNotes"])
                        });
                    }
                }
                return Json(casedeatils, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// Get liigation case detail by user case id
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public JsonResult LitigationCaseDetailsByUsercaseId()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                List<LitigationCaseDetails> casedeatils = new List<LitigationCaseDetails>();
                var UserCaseId = QueryAES.UrlDecode(Request.Form["Usercaseid"]);
                var CourtType = QueryAES.UrlDecode(Request.Form["courttype"]);
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                var userId = strusername + LoggedInUser.UserId.ToString();
                try
                {
                    UserCaseId = UserCaseId.Replace(" ", "+");
                    UserCaseId = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(UserCaseId));
                }
                catch { }

                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }

                var addfClient = new WebClient();
                //for district court details
                if (CourtType == "3")
                {
                    object rawfile = new
                    {
                        accesstoken = AccessTokenDetail,
                        Userid = userIdDetail,
                        Caseid = UserCaseId
                    };
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/DCCaseDetails"), "POST", builders);
                    dynamic jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    if (data1 != null)
                    {
                        for (int i = 0; i < data1.Count; i++)
                        {
                            dynamic data = JObject.Parse(resid);
                            casedeatils.Add(new LitigationCaseDetails
                            {
                                Filingno = data.data[i]["Filingno"],
                                FilingDate = data.data[i]["FilingDate"],
                                RegistationNo = data.data[i]["RegistationNo"],
                                RegistationDate = data.data[i]["RegistationDate"],
                                Firsthearingdate = data.data[i]["Firsthearingdate"],
                                CourtNumber = data.data[i]["CourtNumber"]
                            });
                        }
                    }
                    var param = apiUrl + "CWController=>DCCaseDetails=>/API/Search/DCCaseDetails" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                }
                //for All court
                else
                {
                    object rawfile = new
                    {
                        accesstoken = AccessTokenDetail,
                        Userid = userIdDetail,
                        Caseid = UserCaseId
                    };
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/HCCaseDetails"), "POST", builders);
                    dynamic jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    if (data1 != null)
                    {
                        for (int i = 0; i < data1.Count; i++)
                        {
                            dynamic data = JObject.Parse(resid);
                            casedeatils.Add(new LitigationCaseDetails
                            {
                                Filingno = data.data[i]["FilingNo"],
                                FilingDate = data.data[i]["FilingDate"],
                                LodgmentNo = data.data[i]["LodgmentNo"],
                                RegistationNo = data.data[i]["RegistationNo"],
                                RegistationDate = data.data[i]["RegistationDate"]
                            });
                        }
                    }
                    var param = apiUrl + "CWController=>HCCaseDetails=>/API/Search/HCCaseDetails" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                }
                return Json(casedeatils, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Create litigation tag
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult CreateTagLM()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var statusResult = "";
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + Convert.ToString(LoggedInUser.UserId);
                firmId = Convert.ToString(LoggedInUser.FirmId);
                string tagname = Convert.ToString(QueryAES.UrlDecode(Request.Form["tagname"]));
                string usercaseid = Convert.ToString(QueryAES.UrlDecode(Request.Form["usercaseid"]));
                try
                {
                    usercaseid = usercaseid.Replace(" ", "+");
                    usercaseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(usercaseid));
                }
                catch { }
                //For Case Watch User Map
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }
                string[] values = usercaseid.Split(',');
                for (int i = 0; i < values.Length; i++)
                {
                    values[i] = values[i].Trim();
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        accesstoken = AccessTokenDetail,
                        userid = userIdDetail,
                        taggedname = tagname,
                        caseid = values[i]
                    };
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AddTag"), "POST", builders);
                    var param = apiUrl + "CWController=>CreateTagLM=>/API/Search/AddTag" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                    dynamic data = JObject.Parse(resid);
                    statusResult = data.Status;
                }
                return Json(statusResult, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Remove litigation tag
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult RemoveTagLM()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var statusResult = "";
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + Convert.ToString(LoggedInUser.UserId);
                firmId = Convert.ToString(LoggedInUser.FirmId);
                string tagname = Convert.ToString(QueryAES.UrlDecode(Request.Form["tagname"]));
                string usercaseid = Convert.ToString(QueryAES.UrlDecode(Request.Form["usercaseid"]));
                try
                {
                    usercaseid = usercaseid.Replace(" ", "+");
                    usercaseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(usercaseid));
                }
                catch { }
                string[] values = usercaseid.Split(',');
                for (int i = 0; i < values.Length; i++)
                {
                    values[i] = values[i].Trim();
                    if (values[i] == "")
                    {
                        values[i] = "0";
                    }
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        accesstoken = "mykase123456789abcdef",
                        userid = userId,
                        taggedname = tagname,
                        caseid = values[i]
                    };
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/RemoveTag"), "POST", builders);
                    var param = apiUrl + "CWController=>RemoveTagLM=>/API/Search/RemoveTag" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                    dynamic data = JObject.Parse(resid);
                    statusResult = data.Status;
                }
                return Json(statusResult, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Add live update view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult LitigationAddLiveUpdate()
        {
            try
            {
                var Courtflag = QueryAES.UrlDecode(Request.QueryString["type"]);
                ViewBag.Courtflag = Convert.ToString(Courtflag);
                var MatterName = QueryAES.UrlDecode(Request.Form["matterName"]);
                var matterid = QueryAES.UrlDecode(Request.Form["matterId"]);
                var TeamMember = QueryAES.UrlDecode(Request.Form["TeamMember"]);
                if (MatterName == "undefined" || MatterName == null || MatterName == "null")
                {
                    MatterName = "";
                }
                if (matterid == "undefined" || matterid == null || matterid == "null")
                {
                    matterid = "";
                }
                if (TeamMember == "undefined" || TeamMember == null || TeamMember == "null")
                {
                    TeamMember = "";
                }
                ViewBag.MatterNames = MatterName;
                ViewBag.MatterIds = matterid;
                ViewBag.TeamMember = TeamMember;
            }
            catch (Exception ex) { }
            return View();
        }
        /// <summary>
        /// Search case live update to casewatch
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult SearchCaseLiveUpdateToCW()
        {
            var db = new LawPracticeEntities();
            try
            {
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var files = "";
                var usermobile = "";
                var useremail = "";
                var flag = 0;
                AddCaseObject1 addcase = new AddCaseObject1();
                var usertypes = QueryAES.UrlDecode(Request.Form["usertypes"]);
                var clientid = QueryAES.UrlDecode(Request.Form["clientname"]);
                var casename = QueryAES.UrlDecode(Request.Form["mattersforlink21"]);
                var caseno = QueryAES.UrlDecode(Request.Form["caseno"]);
                var clientcontact = QueryAES.UrlDecode(Request.Form["clientcontacts"]);
                var casetype = QueryAES.UrlDecode(Request.Form["casecasetype"]);
                var auserid = QueryAES.UrlDecode(Request.Form["teamlead"]);
                var details = QueryAES.UrlDecode(Request.Form["details"]);
                var username = QueryAES.UrlDecode(Request.Form["userid"]);
                var confirmPassword = QueryAES.UrlDecode(Request.Form["confirmPassword"]);
                var checkclient = QueryAES.UrlDecode(Request.Form["checkclient"]);
                var odate = QueryAES.UrlDecode(Request.Form["odate"]);
                var assignuser = QueryAES.UrlDecode(Request.Form["assignuser"]);
                var newcompanyid = QueryAES.UrlDecode(Request.Form["newcompanyid"]);
                try
                {
                    if (casename != "")
                    {
                        casename = casename.Substring(0, 100);
                    }
                }
                catch { }
                if (QueryAES.UrlDecode(Request.Form["divSCHCDistrict"]).ToString() != "3")
                {
                    if (QueryAES.UrlDecode(Request.Form["divSCHCDistrict"]).ToString() == "5")  //using custom court
                    {
                        addcase.Caseno = QueryAES.UrlDecode(Request.Form["txtno"]).Trim();
                        addcase.Caseyear = QueryAES.UrlDecode(Request.Form["drpYear"]).Trim();
                        addcase.Court = QueryAES.UrlDecode(Request.Form["drpcourtname"]).Trim();
                        addcase.Username = WebConfigurationManager.AppSettings["matteridname"] + LoggedInUser.UserId.ToString();
                        addcase.Casename = QueryAES.UrlDecode(Request.Form["txtcasename"]).Trim();
                        addcase.Nexthearingdate = QueryAES.UrlDecode(Request.Form["dtnhearingdate"]).Trim();
                        addcase.Advocate = QueryAES.UrlDecode(Request.Form["txtcustomadvocate"]).Trim();
                        addcase.Status = QueryAES.UrlDecode(Request.Form["txtcustomstatus"]).Trim();
                        addcase.Suffix = QueryAES.UrlDecode(Request.Form["txtsuffix"]).ToString();
                        addcase.Casetype = "";
                    }
                    //end using custom court
                    else if (QueryAES.UrlDecode(Request.Form["divSCHCDistrict"]).ToString() == "6")  //using revenue court
                    {
                        addcase.RevenueCourt = QueryAES.UrlDecode(Request.Form["RevenueCourt"]).Trim();
                        addcase.RevenueMandal = QueryAES.UrlDecode(Request.Form["RevenueMandal"]).Trim();
                        addcase.RevenueJanpad = HttpUtility.HtmlDecode(QueryAES.UrlDecode(Request.Form["RevenueJanpad"])).Trim();
                        addcase.Username = WebConfigurationManager.AppSettings["matteridname"] + LoggedInUser.UserId.ToString();
                        addcase.RevenueTahsil = HttpUtility.HtmlDecode(QueryAES.UrlDecode(Request.Form["RevenueTahsil"])).Trim();
                        addcase.RevenueCourtName = QueryAES.UrlDecode(Request.Form["RevenueCourtName"]).Trim();
                        addcase.Caseno = QueryAES.UrlDecode(Request.Form["txtno"]).Trim();
                        addcase.Caseyear = QueryAES.UrlDecode(Request.Form["RevenueYear"]).Trim();
                        addcase.RefNo = QueryAES.UrlDecode(Request.Form["RevenueRefNo"]).Trim();
                    }
                    //For Rera Court start
                    else if (QueryAES.UrlDecode(Request.Form["divSCHCDistrict"]).ToString() == "7")  //using rera court
                    {
                        addcase.Court = QueryAES.UrlDecode(Request.Form["ReraCourt"]).Trim();
                        addcase.Casetype = QueryAES.UrlDecode(Request.Form["reracasetype"]).Trim();
                        addcase.Caseno = QueryAES.UrlDecode(Request.Form["reracasno"]).Trim();
                        addcase.Username = WebConfigurationManager.AppSettings["matteridname"] + LoggedInUser.UserId.ToString();
                        addcase.Caseyear = QueryAES.UrlDecode(Request.Form["reracaseyear"]).Trim();
                        // addcase.ReraRefNo = QueryAES.UrlDecode(Request.Form["reraRefNo"]).Trim();
                    }
                    //END
                    else
                    {
                        if (QueryAES.UrlDecode(Request.Form["drpcourtname"]).ToString() != "0")//For highCourt,Supreme court,Tribunals Addition
                        {
                            addcase.Caseno = QueryAES.UrlDecode(Request.Form["txtno"]).ToString();
                            addcase.Caseyear = QueryAES.UrlDecode(Request.Form["drpYear"]).ToString();
                            addcase.Casetype = QueryAES.UrlDecode(Request.Form["drptype"]).ToString();
                            addcase.Court = QueryAES.UrlDecode(Request.Form["drpcourtname"]).ToString();
                            addcase.FileNo = QueryAES.UrlDecode(Request.Form["txtFileNo"]).ToString();
                            addcase.BenchID = "";
                            addcase.SideID = "";
                            addcase.Courttitle = "";
                            addcase.Stampreg = "";
                            addcase.Matterid = null;
                            addcase.Diaryno = QueryAES.UrlDecode(Request.Form["txtDiaryNo"]).ToString();
                            addcase.Casedetail = QueryAES.UrlDecode(Request.Form["casedetails"]).ToString();
                            addcase.Suffix = QueryAES.UrlDecode(Request.Form["txtsuffix"]).ToString();
                            if (QueryAES.UrlDecode(Request.Form["drpcourtname"]).ToString() == "SC" || QueryAES.UrlDecode(Request.Form["drpcourtname"]).ToString() == "DT")
                            {
                                if (QueryAES.UrlDecode(Request.Form["txtDiaryNo"]).ToString() != "")
                                {
                                    addcase.Casetype = "DN";
                                    addcase.Caseno = QueryAES.UrlDecode(Request.Form["txtDiaryNo"]).ToString();
                                }
                            }
                            if (QueryAES.UrlDecode(Request.Form["drpcourtname"]).ToString() == "KA")
                            {
                                addcase.BenchID = QueryAES.UrlDecode(Request.Form["drpKAbench"]).ToString();
                            }
                            else if (QueryAES.UrlDecode(Request.Form["drpcourtname"]).ToString() == "MH")
                            {
                                if (QueryAES.UrlDecode(Request.Form["drpGoa"]).ToString() == "")
                                {
                                    addcase.BenchID = QueryAES.UrlDecode(Request.Form["drpbench"]).ToString();
                                    addcase.SideID = QueryAES.UrlDecode(Request.Form["drpside"]).ToString();
                                    addcase.Stampreg = QueryAES.UrlDecode(Request.Form["drpstampregister"]).ToString();
                                }
                                else
                                {
                                    addcase.BenchID = QueryAES.UrlDecode(Request.Form["drpGoa"]).ToString();
                                }
                            }
                            else if (QueryAES.UrlDecode(Request.Form["drpcourtname"]).ToString() == "NL" || QueryAES.UrlDecode(Request.Form["drpcourtname"]).ToString() == "CT" ||
                                QueryAES.UrlDecode(Request.Form["drpcourtname"]).ToString() == "NC" || QueryAES.UrlDecode(Request.Form["drpcourtname"]).ToString() == "DT"
                                || QueryAES.UrlDecode(Request.Form["drpcourtname"]).ToString() == "CF" || QueryAES.UrlDecode(Request.Form["drpcourtname"]).ToString() == "CI"
                                || QueryAES.UrlDecode(Request.Form["drpcourtname"]).ToString() == "RC" || QueryAES.UrlDecode(Request.Form["drpcourtname"]).ToString() == "NGT"
                                || QueryAES.UrlDecode(Request.Form["drpcourtname"]).ToString() == "GS")
                            {
                                addcase.BenchID = QueryAES.UrlDecode(Request.Form["drpNCBench"]).ToString();
                                if (QueryAES.UrlDecode(Request.Form["drpcourtname"]).ToString() == "CF")
                                {
                                    if (QueryAES.UrlDecode(Request.Form["drpNCBench"]).ToString() == "E")
                                    {
                                        addcase.TriState = Convert.ToInt32(QueryAES.UrlDecode(Request.Form["drpncdrcstate"]).ToString());
                                        addcase.District = Convert.ToString(QueryAES.UrlDecode(Request.Form["drpncdrcDistrict"]));
                                    }
                                    if (QueryAES.UrlDecode(Request.Form["drpNCBench"]).ToString() == "C")
                                    {
                                        addcase.TriState = Convert.ToInt32(QueryAES.UrlDecode(Request.Form["drpncdrcstate"]).ToString());
                                    }
                                    if (QueryAES.UrlDecode(Request.Form["drpNCBench"]).ToString() == "B")
                                    {
                                        addcase.District = Convert.ToString(QueryAES.UrlDecode(Request.Form["drpncdrcDistrict"]));
                                    }
                                }
                            }
                            else if (QueryAES.UrlDecode(Request.Form["drpcourtname"]).ToString() == "IT" || QueryAES.UrlDecode(Request.Form["drpcourtname"]).ToString() == "CE" || QueryAES.UrlDecode(Request.Form["drpcourtname"]).ToString() == "NGT")
                            {
                                addcase.BenchID = QueryAES.UrlDecode(Request.Form["drpNCBench"]).ToString();
                            }
                            else if (QueryAES.UrlDecode(Request.Form["drpcourtname"]).ToString() == "TN")
                            {
                                addcase.BenchID = QueryAES.UrlDecode(Request.Form["divTNBench"]).ToString();
                            }
                            else if (QueryAES.UrlDecode(Request.Form["drpcourtname"]).ToString() == "BH")
                            {
                                addcase.BenchID = QueryAES.UrlDecode(Request.Form["divBHBench"]).ToString();
                            }
                            else if (QueryAES.UrlDecode(Request.Form["drpcourtname"]).ToString() == "MP")
                            {
                                addcase.BenchID = QueryAES.UrlDecode(Request.Form["divMPBench"]).ToString();
                            }
                            else if (QueryAES.UrlDecode(Request.Form["drpcourtname"]).ToString() == "RH")
                            {
                                addcase.BenchID = QueryAES.UrlDecode(Request.Form["divRHBench"]).ToString();
                            }
                            else if (QueryAES.UrlDecode(Request.Form["drpcourtname"]).ToString() == "JK")
                            {
                                addcase.BenchID = QueryAES.UrlDecode(Request.Form["divJKBench"]).ToString();
                            }
                            else if (QueryAES.UrlDecode(Request.Form["drpcourtname"]).ToString() == "CF")
                            {
                            }
                            else if (QueryAES.UrlDecode(Request.Form["drpcourtname"]).ToString() == "UP")
                            {
                                addcase.BenchID = QueryAES.UrlDecode(Request.Form["divUPBench"]).ToString();
                            }
                            else if (QueryAES.UrlDecode(Request.Form["drpcourtname"]).ToString() == "GH")
                            {
                                addcase.BenchID = QueryAES.UrlDecode(Request.Form["divGHBench"]).ToString();
                            }
                            else if (QueryAES.UrlDecode(Request.Form["drpcourtname"]).ToString() == "WB")
                            {
                                addcase.BenchID = QueryAES.UrlDecode(Request.Form["divWBBench"]).ToString();
                            }
                            addcase.Username = WebConfigurationManager.AppSettings["matteridname"] + LoggedInUser.UserId.ToString();
                            flag = 0;
                        }
                    }
                }
                else
                //For District court Addition
                {
                    if (QueryAES.UrlDecode(Request.Form["divSCHCDistrict"]).ToString() == "3")
                    {
                        addcase.Casetype = QueryAES.UrlDecode(Request.Form["drptype"]).Trim();
                        addcase.Caseno = QueryAES.UrlDecode(Request.Form["txtno"]).Trim();
                        addcase.Caseyear = QueryAES.UrlDecode(Request.Form["drpYear"]).Trim();
                        addcase.Court = QueryAES.UrlDecode(Request.Form["drpcourtnameDC"]).Trim();
                        addcase.BenchID = QueryAES.UrlDecode(Request.Form["drpdistrictcourtname"]).Trim();
                        addcase.SideID = QueryAES.UrlDecode(Request.Form["drpcourtcomplexestb"]).Trim();
                        addcase.Courttitle = QueryAES.UrlDecode(Request.Form["drpcompestbcourt"]).Trim();
                        addcase.Stampreg = "1";
                        addcase.Username = WebConfigurationManager.AppSettings["matteridname"] + LoggedInUser.UserId.ToString();
                        flag = 1;
                    }
                }
                var countdata1 = "";
                List<LitigationAddCaseSearch> casedeatils = new List<LitigationAddCaseSearch>();
                List<LitigationRERHCaseDetails> litigationRERHs = new List<LitigationRERHCaseDetails>();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var drpcourtname = QueryAES.UrlDecode(Request.Form["drpcourtname"]).ToString();
                var caseinfo = QueryAES.UrlDecode(Request.Form["caseinfo"]).ToString();
                //start managing the casewatch exception
                var divSCHCDistrict = QueryAES.UrlDecode(Request.Form["divSCHCDistrict"]);
                var drpcourtnamed = QueryAES.UrlDecode(Request.Form["drpcourtname"]);
                var drpdistrictcourtname = QueryAES.UrlDecode(Request.Form["drpdistrictcourtname"]);
                var drpdistrictcourtfullname = QueryAES.UrlDecode(Request.Form["drpdistrictcourtfullname"]);
                var drpdcourtcnr1 = QueryAES.UrlDecode(Request.Form["drpdcourtcnr1"]);
                dynamic countdata = null;
                var courttype = "";
                try
                {
                    string customcourttype = "";
                    if (divSCHCDistrict == "1" || divSCHCDistrict == "2")
                    {
                        customcourttype = "1";
                    }
                    else if (divSCHCDistrict == "4")
                    {
                        customcourttype = "4";
                    }
                    else if (divSCHCDistrict == "3")
                    {
                        customcourttype = "3";
                        courttype = "1";
                    }
                    else if (divSCHCDistrict == "7")
                    {
                        customcourttype = "7";
                        courttype = "1";
                    }
                    else if (divSCHCDistrict == "6")
                    {
                        customcourttype = "6";
                        courttype = "6";
                    }
                    //For CWUser Change Request
                    string AccessTokenDetail = string.Empty;
                    string userIdDetail = string.Empty;
                    string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                    if (IsCaseWatchUser == "1")
                    {
                        userIdDetail = LoggedInUser.UserName.ToString();
                        AccessTokenDetail = "internal";
                    }
                    else
                    {
                        AccessTokenDetail = "mykase123456789abcdef";
                        userIdDetail = addcase.Username;
                    }
                    if (String.IsNullOrEmpty(drpdcourtcnr1))
                    {
                        var statename = "";
                        //add login data
                        var addfClient = new WebClient();
                        object rawfile = new object();
                        if (addcase.RevenueCourt == "RERH")
                        {
                            rawfile = new
                            {
                                Accesstoken = AccessTokenDetail,
                                userid = userIdDetail,
                                courttype = customcourttype,
                                vCourtval = addcase.RevenueCourt,
                                janpadval = addcase.RevenueJanpad,
                                Username = addcase.Username,
                                tahsilval = addcase.RevenueTahsil,
                                Casetypename = addcase.RevenueCourtName,
                                Caseno = addcase.Caseno,
                                pagesize = "1",
                                pageindex = "1"
                            };

                        }
                        else
                        {
                            rawfile = new
                            {
                                Accesstoken = AccessTokenDetail,
                                userid = userIdDetail,
                                courttype = customcourttype,
                                Courtid = addcase.Court,
                                SideId = addcase.SideID,
                                stampReg = addcase.Stampreg,
                                districtid = addcase.BenchID,
                                stateId = addcase.TriState,
                                Casetype = addcase.Casetype,
                                Caseyear = addcase.Caseyear,
                                Caseno = addcase.Caseno,
                                CompEstbType = courttype,
                                Courtcompestbcourt = addcase.Courttitle,
                                Benchid = addcase.BenchID,
                                triState = addcase.TriState,
                                district = addcase.District,
                                pagesize = "1",
                                pageindex = "1"
                            };
                        }
                        addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                        addfClient.Encoding = Encoding.UTF8;
                        string builders = JsonConvert.SerializeObject(rawfile);
                        ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                        string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/SearchInMongodB"), "POST", builders);
                        dynamic jObject = JObject.Parse(resid);
                        dynamic data1 = jObject["data"];
                        if (addcase.RevenueCourt == "RERH")
                        {
                            for (int i = 0; i < data1.Count; i++)
                            {
                                dynamic data = JObject.Parse(resid);
                                //string status = data.Status;
                                litigationRERHs.Add(new LitigationRERHCaseDetails
                                {
                                    Id = Convert.ToString(data.data[i]["Id"]),
                                    AppealNo = Convert.ToString(data.data[i]["AppealNo"]),
                                    vcourt = Convert.ToString(data.data[i]["vcourt"]),
                                    Appres = Convert.ToString(data.data[i]["Appres"]),
                                    Counsels = Convert.ToString(data.data[i]["Counsels"]),
                                    vCasuelistDate = data.data[i]["vCasuelistDate"].ToString("dd MMMM yyyy"),
                                    janpadval = Convert.ToString(data.data[i]["janpadval"]),
                                    purpose = Convert.ToString(data.data[i]["purpose"]),
                                    tahsilval = Convert.ToString(data.data[i]["tahsilval"]),
                                    Casetypename = Convert.ToString(data.data[i]["Casetypename"]),
                                    CourtName = Convert.ToString(data.data[i]["courtname"]),
                                });
                            }
                            return Json(litigationRERHs, JsonRequestBehavior.AllowGet);
                        }
                        else
                        {
                            for (int i = 0; i < data1.Count; i++)
                            {
                                dynamic data = JObject.Parse(resid);
                                //string status = data.Status;
                                casedeatils.Add(new LitigationAddCaseSearch
                                {
                                    Id = Convert.ToString(data.data[i]["Id"]),
                                    AppealNo = Convert.ToString(data.data[i]["AppealNo"]),
                                    CaseType = Convert.ToString(data.data[i]["CaseType"]),
                                    Caseno = Convert.ToString(data.data[i]["Caseno"]),
                                    CaseYear = Convert.ToString(data.data[i]["CaseYear"]),
                                    Court = Convert.ToString(data.data[i]["Court"]),
                                    CourtName = Convert.ToString(data.data[i]["CourtName"]),
                                    DistrictName = Convert.ToString(data.data[i]["DistrictName"]),
                                    Appres = Convert.ToString(data.data[i]["Appres"]),
                                    Counsels = Convert.ToString(data.data[i]["Counsels"]),
                                    RefApptypeId = Convert.ToString(data.data[i]["RefApptypeId"]),
                                    Bench = Convert.ToString(data.data[i]["Bench"]),
                                    District = Convert.ToString(data.data[i]["District"]),
                                    CNRNo = Convert.ToString(data.data[i]["CNRNo"]),
                                    Benchid = Convert.ToString(data.data[i]["Benchid"]),
                                    nexthearingdate = Convert.ToString(data.data[i]["vCasuelistDate"]),
                                    sCourt = Convert.ToString(data.data[i]["sCourt"]),
                                    CompEastbCourtId = Convert.ToString(data.data[i]["CompEstbType"]),
                                    CompEstbType = Convert.ToString(data.data[i]["CompEstbType"]),
                                    courttype = customcourttype,
                                    vDocumentType = Convert.ToString(data.data[i]["vDocumentType"]),
                                    vStampReg = Convert.ToString(data.data[i]["vStampReg"]),
                                    vState = Convert.ToString(data.data[i]["vTriState"]),
                                    BenchName = Convert.ToString(data.data[i]["BenchName"])
                                });
                            }
                        }
                        
                    }
                    else
                    {
                        // add district cnr
                        if (divSCHCDistrict.ToString() == "3" || divSCHCDistrict.ToString() == "2")
                        {
                            if (!String.IsNullOrEmpty(drpdcourtcnr1))
                            {
                                var addfClient = new WebClient();
                                object rawfile = new
                                {
                                    Accesstoken = AccessTokenDetail,
                                    userid = userIdDetail,
                                    Cnrno = drpdcourtcnr1,
                                    Stateid = addcase.Court,
                                    districtid = addcase.District,
                                    pagesize = "1",
                                    pageindex = "1"
                                };
                                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                                string builders = JsonConvert.SerializeObject(rawfile);
                                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                                addfClient.Encoding = Encoding.UTF8;

                                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/SearchDataByCNRNo"), "POST", builders);
                                dynamic jObject = JObject.Parse(resid);
                                dynamic data1 = jObject["data"];
                                for (int i = 0; i < data1.Count; i++)
                                {
                                    dynamic data = JObject.Parse(resid);
                                    casedeatils.Add(new LitigationAddCaseSearch
                                    {
                                        Id = Convert.ToString(data.data[i]["Id"]),
                                        AppealNo = Convert.ToString(data.data[i]["AppealNo"]),
                                        CaseType = Convert.ToString(data.data[i]["CaseType"]),
                                        Caseno = Convert.ToString(data.data[i]["Caseno"]),
                                        CaseYear = Convert.ToString(data.data[i]["CaseYear"]),
                                        Court = Convert.ToString(data.data[i]["Court"]),
                                        CourtName = Convert.ToString(data.data[i]["CourtName"]),
                                        DistrictName = Convert.ToString(data.data[i]["DistrictName"]),
                                        Appres = Convert.ToString(data.data[i]["Appres"]),
                                        Counsels = Convert.ToString(data.data[i]["Counsels"]),
                                        RefApptypeId = Convert.ToString(data.data[i]["RefApptypeId"]),
                                        Bench = Convert.ToString(data.data[i]["Bench"]),
                                        District = Convert.ToString(data.data[i]["District"]),
                                        CNRNo = Convert.ToString(data.data[i]["CNRNo"]),
                                        nexthearingdate = Convert.ToString(data.data[i]["vCasuelistDate"]),
                                        sCourt = Convert.ToString(data.data[i]["sCourt"]),
                                        CompEastbCourtId = Convert.ToString(data.data[i]["CompEstbType"]),
                                        CompEstbType = Convert.ToString(data.data[i]["CompEstbType"]),
                                        vState = Convert.ToString(data.data[i]["vState"]),
                                        courttype = customcourttype
                                    });
                                }
                            }
                        }
                    }
                }
                catch
                {
                    countdata = "Sorry! Unable to Add now.";
                }
                return Json(casedeatils, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Json("", JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Update notes by litigation case id
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public string UploadNotesByCaseIdLitigation()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string caseid = Convert.ToString(QueryAES.UrlDecode(Request.Form["caseid"]));
                string userId = "";
                userId = strusername + LoggedInUser.UserId.ToString();

                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (!String.IsNullOrEmpty(IsCaseWatchUser))
                {
                    if (IsCaseWatchUser == "1")
                    {
                        userIdDetail = LoggedInUser.UserName.ToString();
                        AccessTokenDetail = "internal";
                    }
                    else
                    {
                        AccessTokenDetail = "mykase123456789abcdef";
                        userIdDetail = userId;
                    }
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }
                try
                {
                    caseid = caseid.Replace(" ", "+");
                    caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));

                }
                catch { }
                var detaiils = Convert.ToString(QueryAES.UrlDecode(Request.Form["detaiils"]));
                string resid = AddCaseCaseWatch.UploadNotesByCaseId(caseid, userIdDetail, detaiils, apiUrl, LoggedInUser.IsCaseWatchUser, LoggedInUser.UserName.ToString());
                return resid;
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return ex.Message.ToString();
            }
        }
        /// <summary>
        /// Litigation mykase document notes details
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public string MyKaseDocNotesDetailsLitigation()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "";
                userId = strusername + LoggedInUser.UserId.ToString();

                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (!String.IsNullOrEmpty(IsCaseWatchUser))
                {
                    if (IsCaseWatchUser == "1")
                    {
                        userIdDetail = LoggedInUser.UserName.ToString();
                        AccessTokenDetail = "internal";
                    }
                    else
                    {
                        AccessTokenDetail = "mykase123456789abcdef";
                        userIdDetail = userId;
                    }
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }

                string caseid = Convert.ToString(QueryAES.UrlDecode(Request.Form["caseid"]));
                try
                {
                    caseid = caseid.Replace(" ", "+");
                    caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
                }
                catch { }
                string resid = AddCaseCaseWatch.MyKaseDocNotesDetails(caseid, userIdDetail, "note", "", apiUrl,AccessTokenDetail);
                return resid;
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return ex.Message.ToString();
            }
        }
        /// <summary>
        /// Litigation Archive CaseList view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult LitigationArchiveCaseList()
        {
            return View();
        }
        /// <summary>
        /// Update notes by litigation case id
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public string UpdateNotesByCaseIdLitigation()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                string noteid = Convert.ToString(QueryAES.UrlDecode(Request.Form["noteid"]));
                var detaiils = Convert.ToString(QueryAES.UrlDecode(Request.Form["noticetext"]));

                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (!String.IsNullOrEmpty(IsCaseWatchUser))
                {
                    if (IsCaseWatchUser == "1")
                    {
                        userIdDetail = LoggedInUser.UserName.ToString();
                        AccessTokenDetail = "internal";
                    }
                    else
                    {
                        AccessTokenDetail = "mykase123456789abcdef";
                        userIdDetail = userId;
                    }
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }

                string resid = AddCaseCaseWatch.UpdatesNotesByCaseId(userIdDetail, detaiils, noteid, apiUrl, AccessTokenDetail);
                return resid;
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return ex.Message.ToString();
            }
        }
        /// <summary>
        /// Get case tag by case id
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public string CaseTageByCaseId()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                string caseid = Convert.ToString(QueryAES.UrlDecode(Request.Form["usercaseids"]));
                try
                {
                    caseid = caseid.Replace(" ", "+");
                    caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
                }
                catch { }
                string resid = AddCaseCaseWatch.CaseTagListByCaseId(caseid, userId, apiUrl,LoggedInUser.IsCaseWatchUser,LoggedInUser.UserName.ToString());
                return resid;
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return ex.Message.ToString();
            }
        }
        /// <summary>
        /// Remove case tag by case id and userid
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public string RemoveCaseTag()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string caseid = Convert.ToString(QueryAES.UrlDecode(Request.Form["usercaseids"]));
                try
                {
                    caseid = caseid.Replace(" ", "+");
                    caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
                }
                catch { }
                string userId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                string taggedname = Convert.ToString(QueryAES.UrlDecode(Request.Form["taggedname"]));
                string resid = AddCaseCaseWatch.RemoveCaseTag(caseid, userId, taggedname, apiUrl,LoggedInUser.IsCaseWatchUser,LoggedInUser.UserName);
                return resid;
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return ex.Message.ToString();
            }
        }

        /// <summary>
        /// Litigation dashbaord 
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult LitigationDashboard()
        {
            return View();
        }

        /// <summary>
        ///Get Litigation dashbaord count
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public JsonResult LitigationDasboardCount()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                var rolesids = LoggedInUser.RoleId;
                string resid = AddCaseCaseWatch.LitigationDashbaordCount(userId, apiUrl, Convert.ToInt32(rolesids),LoggedInUser.IsCaseWatchUser,LoggedInUser.UserName.ToString(), LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername);
                return Json(resid, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// Litigation calender sync
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult LitigationCalendar()
        {
            return View();
        }
        /// <summary>
        /// Litigation To Do List
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult GetToDOSDetails()
        {
            return View();
        }
        /// <summary>
        /// Schedule Calendar Event For To DO
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult ScheduleCalendarEventForToDo()
        {
            return View();
        }
        #region Case note and order notes list added by Amit Kumar

        /// <summary>
        /// Get Total Notes Details by User ID (Case notes, Order Notes etc)
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult GetTotalNotesDetails()
        {
            return View();
        }

        /// <summary>
        /// Get Total case Notes detail list
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public string TotalNotesDetails()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                var db = new LawPracticeEntities();
                string joineduser = "";
                //joineduser = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();

                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                var getuserdetails = db.usp_GetUserDetailByUserID(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).FirstOrDefault();
                if (!String.IsNullOrEmpty(IsCaseWatchUser))
                {
                    if (IsCaseWatchUser == "1" || getuserdetails.IsAdminCW == 1)
                    {
                        userIdDetail = LoggedInUser.UserName.ToString();
                        AccessTokenDetail = "internal";
                    }
                    else
                    {
                        AccessTokenDetail = "mykase123456789abcdef";
                        userIdDetail = userId;
                    }
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }
                string resid = AddCaseCaseWatch.TotalNotesDetails(userIdDetail, "note", "", apiUrl, AccessTokenDetail);
                JObject obj = JObject.Parse(resid);

                // Access the "data" array
                JArray dataArray = (JArray)obj["data"];

                // Loop through each item in the "data" array
                foreach (var item in dataArray)
                {
                    item["caseid"] = Convert.ToBase64String(QueryAES.EncryptAes(item["caseid"].ToString()));
                }
                string newJson = JsonConvert.SerializeObject(obj);
                return newJson;
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return ex.Message.ToString();
            }
        }

        /// <summary>
        /// Get Total Order Notes detail list
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public string TotalOrderNotesDetails()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "";
                userId = strusername + LoggedInUser.UserId.ToString();

                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();

                var db = new LawPracticeEntities();
                string joineduser = "";
                //joineduser = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                var getuserdetails = db.usp_GetUserDetailByUserID(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).FirstOrDefault();
                if (!String.IsNullOrEmpty(IsCaseWatchUser))
                {
                    if (IsCaseWatchUser == "1" || getuserdetails.IsAdminCW == 1)
                    {
                        userIdDetail = LoggedInUser.UserName.ToString();
                        AccessTokenDetail = "internal";
                    }
                    else
                    {
                        AccessTokenDetail = "mykase123456789abcdef";
                        userIdDetail = userId;
                    }
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }
                string resid = AddCaseCaseWatch.TotalOrderNotesDetails(userIdDetail, "note", "", apiUrl, AccessTokenDetail);
                // Deserialize JSON into a JObject
                JObject obj = JObject.Parse(resid);

                // Access the "data" array
                JArray dataArray = (JArray)obj["data"];

                // Loop through each item in the "data" array
                foreach (var item in dataArray)
                {
                    item["vOrderDtid"] = Convert.ToBase64String(QueryAES.EncryptAes(item["vOrderDtid"].ToString()));
                }
                string newJson = JsonConvert.SerializeObject(obj);
                return newJson;
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return ex.Message.ToString();
            }
        }

        /// <summary>
        /// Get case Notes detail by Case ID
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public string GetCaseNotesList()
        {
            var id = QueryAES.UrlDecode(Request.Form["id"]);
            id = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(id));
            var search = QueryAES.UrlDecode(Request.Form["search"]);
            var db1 = new LawPracticeEntities();
            try
            {
                List<CaseDetailObject> casedeatils = new List<CaseDetailObject>();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                search = search;
                string caseid = id;
                string doctype = "casenote";

                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();

                var db = new LawPracticeEntities();
                string joineduser = "";
                //joineduser = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                var getuserdetails = db.usp_GetUserDetailByUserID(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).FirstOrDefault();
                if (IsCaseWatchUser == "1" || getuserdetails.IsAdminCW == 1)
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }

                var addfClient = new WebClient();
                //object rawfile = new
                //{
                //    Accesstoken = AccessTokenDetail,
                //    UserId = userIdDetail,
                //    CaseId = caseid,
                //    Doctype = doctype,
                //    Search = search,
                //    Monthid = ""
                //};
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    userid = userIdDetail,
                    caseId = caseid,
                    doctype = doctype,
                    search = "",
                };

                //AddCaseCaseWatch.MyKaseDocNotesDetails(caseid, userIdDetail, "note", "", apiUrl, AccessTokenDetail)
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/CaseNotesDataSearch"), "POST", builders);
                JObject obj = JObject.Parse(resid);

                // Access the "data" array
                JArray dataArray = (JArray)obj["data"];

                // Loop through each item in the "data" array
                foreach (var item in dataArray)
                {
                    item["Iid"] = Convert.ToBase64String(QueryAES.EncryptAes(item["Iid"].ToString()));
                }
                string newJson = JsonConvert.SerializeObject(obj);
                return newJson;

            }
            catch (Exception ex) { return ex.Message.ToString(); }
        }

        /// <summary>
        /// Get All order Notes detail by Order ID
        /// </summary>
        /// <returns></returns>

        [AuthLog(Roles = "Firm,User")]
        public string MyCaseOrderNotes()
        {
            try
            {
                var id = QueryAES.UrlDecode(Request.Form["id"]);
                try
                {
                    id = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(id));
                }
                catch (Exception)
                {
                }

                var search = QueryAES.UrlDecode(Request.Form["search"]);
                var db1 = new LawPracticeEntities();
                try
                {
                    List<CaseDetailObject> casedeatils = new List<CaseDetailObject>();
                    var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                    string strusername = ConfigurationManager.AppSettings["matteridname"];
                    string userId = "", firmId = "";
                    userId = strusername + LoggedInUser.UserId.ToString();
                    firmId = LoggedInUser.FirmId.ToString();
                    var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                    search = search;
                    string caseid = id;
                    string doctype = "ordernote";

                    string AccessTokenDetail = string.Empty;
                    string userIdDetail = string.Empty;
                    string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                    var db = new LawPracticeEntities();
                    string joineduser = "";
                    //joineduser = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                    var getuserdetails = db.usp_GetUserDetailByUserID(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).FirstOrDefault();
                    if (IsCaseWatchUser == "1" || getuserdetails.IsAdminCW == 1)
                    {
                        userIdDetail = LoggedInUser.UserName.ToString();
                        AccessTokenDetail = "internal";
                    }
                    else
                    {
                        AccessTokenDetail = "mykase123456789abcdef";
                        userIdDetail = userId;
                    }

                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        Accesstoken = AccessTokenDetail,
                        userid = userIdDetail,
                        caseId = caseid,
                        doctype = doctype,
                        search = "",
                    };
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/OrderNotesDetails"), "POST", builders);
                    var param = apiUrl + "CWController=>GetCaseOrderNotes=>/API/Search/OrderNotesDetails" + "@" + builders;
                    JObject obj = JObject.Parse(resid);

                    // Access the "data" array
                    JArray dataArray = (JArray)obj["data"];

                    // Loop through each item in the "data" array
                    foreach (var item in dataArray)
                    {
                        item["Iid"] = Convert.ToBase64String(QueryAES.EncryptAes(item["Iid"].ToString()));
                    }
                    string newJson = JsonConvert.SerializeObject(obj);
                    return newJson;
                }
                catch (Exception ex)
                {
                    db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                    return ex.Message;
                }

            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        /// <summary>
        /// Remove all case Notes by Case ID
        /// </summary>
        /// <returns></returns>

        [FirmControllerAuthorization]
        public string RemoveCaseNotesList()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                string noteid = Convert.ToString(QueryAES.UrlDecode(Request.Form["ccc"]));
                noteid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(noteid));
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                var db = new LawPracticeEntities();
                string joineduser = "";
                joineduser = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                var getuserdetails = db.usp_GetUserDetailByUserID(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).FirstOrDefault();
                if (!String.IsNullOrEmpty(IsCaseWatchUser))
                {
                    if (IsCaseWatchUser == "1" || getuserdetails.IsAdminCW == 1)
                    {
                        userIdDetail = LoggedInUser.UserName.ToString();
                        AccessTokenDetail = "internal";
                    }
                    else
                    {
                        AccessTokenDetail = "mykase123456789abcdef";
                        userIdDetail = userId;
                    }
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }

                string resid = AddCaseCaseWatch.RemoveCaseNotesByCaseID(userId, noteid, apiUrl, AccessTokenDetail, userIdDetail);
                return resid;
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return ex.Message.ToString();
            }
        }

        /// <summary>
        /// Remove all order Notes by order ID
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public string RemoveCaseOrderNotes()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                string noteid = Convert.ToString(QueryAES.UrlDecode(Request.Form["ccc"]));
                noteid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(noteid));
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                var db = new LawPracticeEntities();
                string joineduser = "";
                joineduser = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                var getuserdetails = db.usp_GetUserDetailByUserID(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).FirstOrDefault();
                if (!String.IsNullOrEmpty(IsCaseWatchUser))
                {
                    if (IsCaseWatchUser == "1" || getuserdetails.IsAdminCW == 1)
                    {
                        userIdDetail = LoggedInUser.UserName.ToString();
                        AccessTokenDetail = "internal";
                    }
                    else
                    {
                        AccessTokenDetail = "mykase123456789abcdef";
                        userIdDetail = userId;
                    }
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }

                string resid = AddCaseCaseWatch.RemoveCaseOrderNotesByOrderID(userId, noteid, apiUrl, AccessTokenDetail, userIdDetail);
                return resid;
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return ex.Message.ToString();
            }
        }

        /// <summary>
        /// Share case Notes on email by case id
        /// </summary>
        /// <returns></returns>

        [FirmControllerAuthorization]
        public string ShareEmailNotes()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                List<CaseDetailObject> casedeatils = new List<CaseDetailObject>();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                string caseid = Convert.ToString(QueryAES.UrlDecode(Request.Form["caseid"]));
                caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
                var toemail = Convert.ToString(QueryAES.UrlDecode(Request.Form["toemail"]));
                string doctype = "casenote";

                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                var db = new LawPracticeEntities();
                string joineduser = "";
                joineduser = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                var getuserdetails = db.usp_GetUserDetailByUserID(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).FirstOrDefault();
                if (IsCaseWatchUser == "1" || getuserdetails.IsAdminCW == 1)
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }
                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    UserId = userIdDetail,
                    CaseId = caseid,
                    Toemail = toemail
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/ShareNotes"), "POST", builders);
                var param = apiUrl + "CWController=>ShareNotes=>/API/Search/ShareNotes" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                dynamic data = JObject.Parse(resid);
                string status = data.Status;
                if (status.ToLower() == "true")
                {
                    return "Mail Sent Successfully.";
                }
                else
                {
                    return "OOps! Something went wrong.";
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return ex.Message.ToString();
            }
        }

        [FirmControllerAuthorization]
        public string OrderAddNotes()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                List<CaseDetailObject> casedeatils = new List<CaseDetailObject>();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                string Orderid = Convert.ToString(QueryAES.UrlDecode(Request.Form["Orderid"]));
                var Notes = Convert.ToString(QueryAES.UrlDecode(Request.Form["Notes"]));

                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                var db = new LawPracticeEntities();
                string joineduser = "";
                joineduser = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                var getuserdetails = db.usp_GetUserDetailByUserID(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).FirstOrDefault();
                if (IsCaseWatchUser == "1" || getuserdetails.IsAdminCW == 1)
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }
                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    UserId = userIdDetail,
                    orderid = Orderid,
                    notes = Notes
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/OrderAddNotes"), "POST", builders);
                var param = apiUrl + "CWController=>OrderAddNotes=>/API/Search/OrderAddNotes" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                return resid;
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return ex.Message.ToString();
            }
        }


        #endregion Case note and order notes list added by Amit Kumar

        /// <summary>
        ///  Litigation Contact  List 
        /// </summary>
        /// <returns></returns>
        public ActionResult LitigationContactList()
        {
            return View();
        }

        /// <summary>
        /// Get Litigation Contact  
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public JsonResult GetLitigationContact()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                string Search = QueryAES.UrlDecode(Request.Form["Search"]);
                string iid = QueryAES.UrlDecode(Request.Form["iid"]);
                int pagesize = 10, pageindex = 1;
                pageindex = Convert.ToInt32(QueryAES.UrlDecode(Request.Form["pagenum"]));
                pagesize = Convert.ToInt32(QueryAES.UrlDecode(Request.Form["pagesize"]));
                var db = new LawPracticeEntities();
                //string joineduser = "";
                //string AccessTokenDetail = "";
                //string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                //var Iflag = 0;
                //if (LoggedInUser.RoleId == 1)
                //{
                //    Iflag = 1;
                //}
                //if (IsCaseWatchUser == "1")
                //{
                //    joineduser = LoggedInUser.UserName.ToString();
                //    AccessTokenDetail = "internal";
                //}
                //else
                //{
                //    joineduser = userId;
                //    AccessTokenDetail = "mykase123456789abcdef";
                //}
                var id = 0;
                if (!string.IsNullOrEmpty(iid) && iid != "0")
                {
                    id = Convert.ToInt16(iid);
                }
                if (string.IsNullOrEmpty(Search))
                    Search = "";
                var caselist = db1.Usp_GetLitigationConatctList(id, firmId, LoggedInUser.UserId.ToString(), roleid.ToString(), Search).ToList();

                return Json(caselist, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// Add Litigation Contact  
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public JsonResult SaveLitigationContact()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                string iid = QueryAES.UrlDecode(Request.Form["iid"]);
                string vFullName = QueryAES.UrlDecode(Request.Form["fullname"]);
                string vHome = QueryAES.UrlDecode(Request.Form["home"]); ;
                string vMobile = QueryAES.UrlDecode(Request.Form["mobile"]);
                string vOffice = QueryAES.UrlDecode(Request.Form["office"]);
                string vFax = QueryAES.UrlDecode(Request.Form["fax"]);
                string vEmail = QueryAES.UrlDecode(Request.Form["email"]);
                string vHomePhoneNo = QueryAES.UrlDecode(Request.Form["homeph"]);
                string vAddress = QueryAES.UrlDecode(Request.Form["address"]);
                string vWebsite = QueryAES.UrlDecode(Request.Form["website"]);
                string OrgnizationName = QueryAES.UrlDecode(Request.Form["Organization"]);
                string vMainiid = LoggedInUser.UserName.ToString();

                var db = new LawPracticeEntities();
                string joineduser = "";
                string AccessTokenDetail = "";
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                var Iflag = 0;
                if (LoggedInUser.RoleId == 1)
                {
                    Iflag = 1;
                }
                //if (IsCaseWatchUser == "1")
                //{
                //    joineduser = LoggedInUser.UserName.ToString();
                //    AccessTokenDetail = "internal";
                //}
                //else
                //{
                //    joineduser = userId;
                //    AccessTokenDetail = "mykase123456789abcdef";
                //}
                string MSG = "";
                if (iid == "0")
                {
                    var caselist = db1.Usp_AddLitigationConatct(vFullName, vHome, vMobile, vOffice, vFax, vEmail, vHomePhoneNo, vAddress, vWebsite, LoggedInUser.UserId.ToString(), firmId, LoggedInUser.UserId.ToString(), OrgnizationName);//  db1.Usp_AddLitigationConatct(0, firmId, joineduser, roleid.ToString()).ToList();
                    if (caselist > 0)
                        MSG = "Contact added successfully";
                }
                else
                {
                    var caselist = db1.Usp_UpdateLitigationContact(vFullName, vHome, vMobile, vOffice, vFax, vEmail, vHomePhoneNo, vAddress, vWebsite, LoggedInUser.UserId.ToString(), firmId, LoggedInUser.UserId.ToString(), OrgnizationName, iid);//  db1.Usp_AddLitigationConatct(0, firmId, joineduser, roleid.ToString()).ToList();
                    if (caselist > 0)
                        MSG = "Contact updated successfully";
                }
                return Json(MSG, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// Remove Litigation Contact  
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public JsonResult RemoveLitigationContact()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                string iid = QueryAES.UrlDecode(Request.Form["iid"]);

                var db = new LawPracticeEntities();
                string joineduser = "";
                string AccessTokenDetail = "";
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                var Iflag = 0;
                //if (LoggedInUser.RoleId == 1)
                //{
                //    Iflag = 1;
                //}
                //if (IsCaseWatchUser == "1")
                //{
                //    joineduser = LoggedInUser.UserName.ToString();
                //    AccessTokenDetail = "internal";
                //}
                //else
                //{
                //    AccessTokenDetail = "mykase123456789abcdef";
                //}
                var caselist = db1.Usp_RemoveLitigationContactList(iid, LoggedInUser.UserId.ToString(), firmId);
                string MSG = "";
                if (caselist > 0)
                    MSG = "Contact deleted successfully";

                return Json(MSG, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Export litigation case details list
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportToExcelLitigationContactList()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                string exlfilename = "LitigationContactList_" + DateTime.Now;
                var Search = QueryAES.UrlDecode(HttpContext.Request.QueryString["Search"]);
                var pagenum = QueryAES.UrlDecode(HttpContext.Request.QueryString["pagenum"]);
                var pagesize = QueryAES.UrlDecode(HttpContext.Request.QueryString["pagesize"]);
                var casedeatils = db1.Usp_GetLitigationConatctList(0, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.RoleId.ToString(), Search).ToList();
                var trialList = (from ob in casedeatils
                                 select new
                                 {
                                     Name = ob.vFullName,
                                     Mobile = ob.vMobile,
                                     Email = ob.vEmail,
                                     HomeAddress = ob.vHome,
                                     OfficeAddress=ob.vAddress,
                                     AlternateMobile=ob.vHomePhoneNo,
                                     OfficeName=ob.vOffice,
                                    // Website = ob.vWebsite,
                                     OrgnizationName = ob.OrgnizationName
                                     //OfficeAddress = (ob.Advocate == null || ob.Advocate == "") ? "" : Regex.Replace(ob.Advocate, "<.*?>", string.Empty),
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
        /// IOB Custmization Get branch name
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public string GetBranchNameList()
        {
            var regionid = QueryAES.UrlDecode(Request.Form["regionid"]);
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                var db = new LawPracticeEntities();
                string joineduser = "";
                var getuserdetails = db.usp_GetUserDetailByUserID(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).FirstOrDefault();
                if (IsCaseWatchUser == "1" || getuserdetails.IsAdminCW == 1)
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }
                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    userid = userIdDetail,
                    regioncode= regionid
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/BranchCodeList"), "POST", builders);
                JObject obj = JObject.Parse(resid);
                string newJson = JsonConvert.SerializeObject(obj);
                return newJson;

            }
            catch (Exception ex) { return ex.Message.ToString(); }
        }

        /// <summary>
        /// IOB Custmization Get Region List
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public string GetRegionNameList()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                var db = new LawPracticeEntities();
                string joineduser = "";
                var getuserdetails = db.usp_GetUserDetailByUserID(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).FirstOrDefault();
                if (IsCaseWatchUser == "1" || getuserdetails.IsAdminCW == 1)
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }
                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    userid = userIdDetail
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/RegionCodeList"), "POST", builders);
                JObject obj = JObject.Parse(resid);
                string newJson = JsonConvert.SerializeObject(obj);
                return newJson;

            }
            catch (Exception ex) { return ex.Message.ToString(); }
        }

        /// <summary>
        /// IOB Custmization Map  branch to code name
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public string MapeCaseToBranchName()
        {
            var usercaseid = QueryAES.UrlDecode(Request.Form["caseid"]);
            var BranchName = QueryAES.UrlDecode(Request.Form["BranchName"]);
            var RegionName = QueryAES.UrlDecode(Request.Form["RegionName"]);
            try
            {
                usercaseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(usercaseid));
            }
            catch{}
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                var db = new LawPracticeEntities();
                string joineduser = "";
                var getuserdetails = db.usp_GetUserDetailByUserID(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).FirstOrDefault();
                if (IsCaseWatchUser == "1" || getuserdetails.IsAdminCW == 1)
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }
                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    userid = userIdDetail,
                    UserCaseId = usercaseid,
                    branchcode= BranchName
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/UpdateCasesBranchMapping"), "POST", builders);
                JObject obj = JObject.Parse(resid);
                string newJson = JsonConvert.SerializeObject(obj);
                return newJson;

            }
            catch (Exception ex) { return ex.Message.ToString(); }
        }

        /// <summary>
        /// MK Litigation Help Video
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult CaseTrackingHelp()
        {
            return View();
        }
        /// <summary>
        /// MK Litigation Help Video
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult CaseTrackingHelpVideo()
        {
            return View();
        }
        /// <summary>
        /// Get cause list details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public JsonResult CWFirmPackDetails()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                //add login data
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (!String.IsNullOrEmpty(IsCaseWatchUser))
                {
                    if (IsCaseWatchUser == "1")
                    {
                        userIdDetail = LoggedInUser.UserName.ToString();
                        AccessTokenDetail = "internal";
                    }
                    else
                    {
                        AccessTokenDetail = "mykase123456789abcdef";
                        userIdDetail = userId;
                    }
                }

                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    UserId = userIdDetail
                   
                };
                addfClient.Encoding = System.Text.Encoding.UTF8;
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string Apiresid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/DashboardlabelVen"), "POST", builders);
                JObject obj = JObject.Parse(Apiresid);
                string newJson = JsonConvert.SerializeObject(obj);
                //For Firm Expiry Details
                var firmbasic = db1.usp_GetFirmBasicInformation(firmId.ToString()).FirstOrDefault();
                string MKjson = JsonConvert.SerializeObject(firmbasic);
                var result = new { Apiresult = newJson, MKDeatils = MKjson };

                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {
                return Json("", JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// SEBI Custmization Showing All Party Name
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public string LoadAllPartyName()
        {
            var usercaseid = QueryAES.UrlDecode(Request.Form["caseid"]);
            try
            {
                usercaseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(usercaseid));
            }
            catch { }
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = "mykase123456789abcdef",
                    Userid = userId,
                    UserCaseId = usercaseid
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/FullAppResList"), "POST", builders);
                JObject obj = JObject.Parse(resid);
                string newJson = JsonConvert.SerializeObject(obj);
                return newJson;

            }
            catch (Exception ex) { return ex.Message.ToString(); }
        }

        /// <summary>
        /// IOB Custom Requirement of Advocate updation
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult UpdateAdvocateToCW()
        {
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var Usercaseid = QueryAES.UrlDecode(Request.Form["CWUserCaseIds"]);
                var Advocate = QueryAES.UrlDecode(Request.Form["CWAdvocateName"]);
                try
                {
                    Usercaseid = Usercaseid.Replace(" ", "+");
                    Usercaseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(Usercaseid));
                }
                catch
                {
                }
                var db1 = new LawPracticeEntities();
                try
                {
                    string strusername = ConfigurationManager.AppSettings["matteridname"];
                    string userId = "", firmId = "";
                    userId = strusername + LoggedInUser.UserId.ToString();
                    firmId = LoggedInUser.FirmId.ToString();
                    string AccessTokenDetail = string.Empty;
                    string userIdDetail = string.Empty;
                    string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                    if (IsCaseWatchUser == "1")
                    {
                        userIdDetail = LoggedInUser.UserName.ToString();
                        AccessTokenDetail = "internal";
                    }
                    else
                    {
                        AccessTokenDetail = "mykase123456789abcdef";
                        userIdDetail = userId;
                    }
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        Accesstoken = AccessTokenDetail,
                        userid = userIdDetail,
                        CaseId = Usercaseid,
                        Advocatename = Advocate
                    };
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/UpdateAdvocateNamebyiid"), "POST", builders);
                    JObject obj = JObject.Parse(resid);
                    string newJson = JsonConvert.SerializeObject(obj);
                   // return newJson;
                    return Json(newJson, JsonRequestBehavior.AllowGet);
                }
                catch (Exception ex)
                {
                    return Json("Error", JsonRequestBehavior.AllowGet);
                }
                //return Json(resid, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// BOM Client Custom Dashboard- New Customization
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult CustomDashboard()
        {
            return View();
        }

        [AuthLog(Roles = "Firm,User")]
        public ActionResult AddAgainstTheBank()
        {
            var Courtflag = QueryAES.UrlDecode(Request.QueryString["type"]);
            ViewBag.Courtflag = Convert.ToString(Courtflag);
            var MatterName = QueryAES.UrlDecode(Request.Form["matterName"]);
            var matterid = QueryAES.UrlDecode(Request.Form["matterId"]);
            var TeamMember = QueryAES.UrlDecode(Request.Form["TeamMember"]);
            if (MatterName == "undefined" || MatterName == null || MatterName == "null")
            {
                MatterName = "";
            }
            if (matterid == "undefined" || matterid == null || matterid == "null")
            {
                matterid = "";
            }
            if (TeamMember == "undefined" || TeamMember == null || TeamMember == "null")
            {
                TeamMember = "";
            }
            ViewBag.MatterNames = MatterName;
            ViewBag.MatterIds = matterid;
            ViewBag.TeamMember = TeamMember;
            return View();
        }

        [AuthLog(Roles = "Firm,User")]
        public ActionResult RecordDeleteAgainstTheBank()
        {
            try
            {
                var mcaseNo = Convert.ToString(QueryAES.UrlDecode(Request.Form["mcaseNo"]));
                var caseType = Convert.ToString(QueryAES.UrlDecode(Request.Form["caseType"]));
                DataSet ds = DataAccessADO.DeleteMatterDetails(mcaseNo, caseType);

                return Json(new { success = true, message = "Matter deleted successfully" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }



        [AuthLog(Roles = "Firm,User")]
        public ActionResult AddConsumerCases()
        {
            var Courtflag = QueryAES.UrlDecode(Request.QueryString["type"]);
            ViewBag.Courtflag = Convert.ToString(Courtflag);
            var MatterName = QueryAES.UrlDecode(Request.Form["matterName"]);
            var matterid = QueryAES.UrlDecode(Request.Form["matterId"]);
            var TeamMember = QueryAES.UrlDecode(Request.Form["TeamMember"]);
            if (MatterName == "undefined" || MatterName == null || MatterName == "null")
            {
                MatterName = "";
            }
            if (matterid == "undefined" || matterid == null || matterid == "null")
            {
                matterid = "";
            }
            if (TeamMember == "undefined" || TeamMember == null || TeamMember == "null")
            {
                TeamMember = "";
            }
            ViewBag.MatterNames = MatterName;
            ViewBag.MatterIds = matterid;
            ViewBag.TeamMember = TeamMember;
            return View();
        }

        [AuthLog(Roles = "Firm,User")]
        public ActionResult AddContingentLiability()
        {
            var Courtflag = QueryAES.UrlDecode(Request.QueryString["type"]);
            ViewBag.Courtflag = Convert.ToString(Courtflag);
            var MatterName = QueryAES.UrlDecode(Request.Form["matterName"]);
            var matterid = QueryAES.UrlDecode(Request.Form["matterId"]);
            var TeamMember = QueryAES.UrlDecode(Request.Form["TeamMember"]);
            if (MatterName == "undefined" || MatterName == null || MatterName == "null")
            {
                MatterName = "";
            }
            if (matterid == "undefined" || matterid == null || matterid == "null")
            {
                matterid = "";
            }
            if (TeamMember == "undefined" || TeamMember == null || TeamMember == "null")
            {
                TeamMember = "";
            }
            ViewBag.MatterNames = MatterName;
            ViewBag.MatterIds = matterid;
            ViewBag.TeamMember = TeamMember;
            return View();
        }

        /// <summary>
        /// Get casewatch cause list
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public JsonResult CustomCaseList()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var court = Convert.ToString(QueryAES.UrlDecode(Request.Form["courttype"]));
                var courtname = Convert.ToString(QueryAES.UrlDecode(Request.Form["courtname"]));
                var stateid = Convert.ToString(QueryAES.UrlDecode(Request.Form["stateid"]));
                var districtid = Convert.ToString(QueryAES.UrlDecode(Request.Form["districtid"]));
                var courtcompestname = Convert.ToString(QueryAES.UrlDecode(Request.Form["courtcompestname"]));
                var ditrictcourt = Convert.ToString(QueryAES.UrlDecode(Request.Form["ditrictcourt"]));
                var sortdate = Convert.ToString(QueryAES.UrlDecode(Request.Form["sortdate"]));
                var CaseStatus = Convert.ToString(QueryAES.UrlDecode(Request.Form["CaseStatus"]));
                var hearingfrom = Convert.ToString(QueryAES.UrlDecode(Request.Form["hearingfrom"]));
                var hearingto = Convert.ToString(QueryAES.UrlDecode(Request.Form["hearingto"]));
                var casename = Convert.ToString(QueryAES.UrlDecode(Request.Form["casename"]));
                var searchany = Convert.ToString(QueryAES.UrlDecode(Request.Form["searchany"]));
                var PetionerName = Convert.ToString(QueryAES.UrlDecode(Request.Form["PetionerName"]));
                var RespondentName = Convert.ToString(QueryAES.UrlDecode(Request.Form["RespondentName"]));
                var Advocate = Convert.ToString(QueryAES.UrlDecode(Request.Form["Advocate"]));
                var CourtCaseNo=Convert.ToString(QueryAES.UrlDecode(Request.Form["CourtCaseNo"]));
                List<CWCaseList> casedeatils = new List<CWCaseList>();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                string search = "";
                search = Convert.ToString(QueryAES.UrlDecode(Request.Form["search"]));
                int pagesize = 10, pageindex = 1;
                pageindex = Convert.ToInt32(QueryAES.UrlDecode(Request.Form["pagenum"]));
                pagesize = Convert.ToInt32(QueryAES.UrlDecode(Request.Form["pagesize"]));
                if (courtname == "0")
                {
                    courtname = "";
                }
                if (stateid == "0")
                {
                    stateid = "";
                }
                if (court == "1")
                {
                    court = "Supreme Court";
                }
                else if(court == "2")
                {
                    court = "High Court";
                }
                else if (court == "3")
                {
                    court = "District Court";
                }
                else if (court == "4")
                {
                    court = "Tribunals";
                }
                else if (court == "4")
                {
                    court = "Tribunals";
                }
                var db = new LawPracticeEntities();

                DataTable pageaccesslist = new DataTable();
                if (LoggedInUser.RoleId == 1)
                {
                    pageaccesslist = DataAccessADO.GetCaseDeatilsByUserCaseId(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), court, courtname,
                    stateid, districtid, courtcompestname, ditrictcourt, sortdate, CaseStatus, hearingfrom, hearingto, casename, PetionerName,
                    RespondentName, Advocate, CourtCaseNo, pageindex, pagesize);
                }
                else
                {
                    pageaccesslist = DataAccessADO.GetCaseDeatilsByUserCaseIdForUser(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), court, courtname,
                    stateid, districtid, courtcompestname, ditrictcourt, sortdate, CaseStatus, hearingfrom, hearingto, casename, PetionerName,
                    RespondentName, Advocate, CourtCaseNo, pageindex, pagesize);
                }

                for (int i = 0; i < pageaccesslist.Rows.Count; i++)
                {

                    casedeatils.Add(new CWCaseList
                    {
                        TotalRecord = Convert.ToString(pageaccesslist.Rows[i]["totRow"]),
                        RowId = Convert.ToString(pageaccesslist.Rows[i]["rownum"]),
                        MatterName = Convert.ToString(pageaccesslist.Rows[i]["CounselName"]),
                        BranchName= Convert.ToString(pageaccesslist.Rows[i]["ZoneName"]),
                        Court = Convert.ToString(pageaccesslist.Rows[i]["CourtName"]),
                        CourtName = Convert.ToString(pageaccesslist.Rows[i]["Court"]),
                        CaseName= Convert.ToString(pageaccesslist.Rows[i]["MatterName"]),
                        Advocate = Convert.ToString(pageaccesslist.Rows[i]["AdvocateName"]),
                        UserCaseId = Convert.ToString(pageaccesslist.Rows[i]["UserCaseId"]),
                        NextHearing= Convert.ToString(pageaccesslist.Rows[i]["Nexthearingdate"]),
                        DisposedDate= Convert.ToString(pageaccesslist.Rows[i]["Disposeddate"]),
                        Status= Convert.ToString(pageaccesslist.Rows[i]["CourtStatus"]),
                        PetitionerName= Convert.ToString(pageaccesslist.Rows[i]["PetitionerName"]),
                        RespondentName= Convert.ToString(pageaccesslist.Rows[i]["RespondentName"]),
                        dUpdateDate= Convert.ToString(pageaccesslist.Rows[i]["FilingDate"]),
                        MatterID= Convert.ToString(pageaccesslist.Rows[i]["Id"]),
                        CaseDiary = Convert.ToString(pageaccesslist.Rows[i]["CourtCaseNo"]),
                        CourtComplexCourtEstablishment = Convert.ToString(pageaccesslist.Rows[i]["CourtComplex"] == null ? "" : pageaccesslist.Rows[i]["CourtComplex"]),
                    });
                }

                return Json(casedeatils, JsonRequestBehavior.AllowGet);

                
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Export litigation case details list
        /// </summary>
        [AuthLog(Roles = "Firm,User")]
        public void ExportToExcelBOMCustomDashboard()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                string exlfilename = "LitigationCaseList_" + DateTime.Now;
                var court = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["courttype"]));
                var courtname = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["courtname"]));
                var stateid = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["stateid"]));
                var districtid = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["districtid"]));
                var courtcompestname = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["courtcompestname"]));
                var ditrictcourt = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["ditrictcourt"]));
                var sortdate = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["sortdate"]));
                var CaseStatus = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["CaseStatus"]));
                var hearingfrom = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["hearingfrom"]));
                var hearingto = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["hearingto"]));
                var casename = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["casename"]));
                var searchany = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["searchany"]));
                var PetionerName = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["PetionerName"]));
                var RespondentName = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["RespondentName"]));
                var Advocate = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["Advocate"]));
                var CourtCaseNo = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["CourtCaseNo"]));
                List<CWCaseList> casedeatils = new List<CWCaseList>();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                string search = "";
                search = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["search"]));
                int pagesize = 10, pageindex = 1;
                pageindex = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagenum"]));
                pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagesize"]));
                var db = new LawPracticeEntities();
                if (courtname == "0")
                {
                    courtname = "";
                }
                if (stateid == "0")
                {
                    stateid = "";
                }
                if (court == "1")
                {
                    court = "Supreme Court";
                }
                else if (court == "2")
                {
                    court = "High Court";
                }
                else if (court == "3")
                {
                    court = "District Court";
                }
                else if (court == "4")
                {
                    court = "Tribunals";
                }
                else if (court == "4")
                {
                    court = "Tribunals";
                }

                DataTable pageaccesslist = new DataTable();

                if (LoggedInUser.RoleId == 1)
                {
                    pageaccesslist = DataAccessADO.GetCaseDeatilsByUserCaseId(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), court, courtname,
                    stateid, districtid, courtcompestname, ditrictcourt, sortdate, CaseStatus, hearingfrom, hearingto, casename, PetionerName,
                    RespondentName, Advocate, CourtCaseNo, pageindex, pagesize);
                }
                else
                {
                    pageaccesslist = DataAccessADO.GetCaseDeatilsByUserCaseIdForUser(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), court, courtname,
                    stateid, districtid, courtcompestname, ditrictcourt, sortdate, CaseStatus, hearingfrom, hearingto, casename, PetionerName,
                    RespondentName, Advocate, CourtCaseNo, pageindex, pagesize);
                }

                for (int i = 0; i < pageaccesslist.Rows.Count; i++)
                {

                    casedeatils.Add(new CWCaseList
                    {
                        TotalRecord = Convert.ToString(pageaccesslist.Rows[i]["totRow"]),
                        RowId = Convert.ToString(pageaccesslist.Rows[i]["rownum"]),
                        MatterName = Convert.ToString(pageaccesslist.Rows[i]["CounselName"]),
                        BranchName = Convert.ToString(pageaccesslist.Rows[i]["ZoneName"]),
                        Court = Convert.ToString(pageaccesslist.Rows[i]["CourtName"]),
                        CourtName = Convert.ToString(pageaccesslist.Rows[i]["Court"]),
                        CaseName = Convert.ToString(pageaccesslist.Rows[i]["MatterName"]),
                        Advocate = Convert.ToString(pageaccesslist.Rows[i]["AdvocateName"]),
                        UserCaseId = Convert.ToString(pageaccesslist.Rows[i]["UserCaseId"]),
                        NextHearing = Convert.ToString(pageaccesslist.Rows[i]["Nexthearingdate"]),
                        DisposedDate = Convert.ToString(pageaccesslist.Rows[i]["Disposeddate"]),
                        Status = Convert.ToString(pageaccesslist.Rows[i]["CourtStatus"]),
                        PetitionerName = Convert.ToString(pageaccesslist.Rows[i]["PetitionerName"]),
                        RespondentName = Convert.ToString(pageaccesslist.Rows[i]["RespondentName"]),
                        dUpdateDate = Convert.ToString(pageaccesslist.Rows[i]["FilingDate"]),
                        MatterID = Convert.ToString(pageaccesslist.Rows[i]["Id"]),
                        CaseDiary = Convert.ToString(pageaccesslist.Rows[i]["CourtCaseNo"]),
                        CourtComplexCourtEstablishment = Convert.ToString(pageaccesslist.Rows[i]["CourtComplex"] == null ? "" : pageaccesslist.Rows[i]["CourtComplex"]),
                    });
                }
                var trialList = (from ob in casedeatils
                                 select new
                                 {
                                     CourtCaseNo = (ob.CaseDiary == null || ob.CaseDiary == "") ? "" : Regex.Replace(ob.CaseDiary, "<.*?>", string.Empty),
                                     CourtName = ob.Court,
                                     Court = ob.CourtName,
                                     MatterName = ob.CaseName,
                                     Advocate = (ob.Advocate == null || ob.Advocate == "") ? "" : Regex.Replace(ob.Advocate, "<.*?>", string.Empty),
                                     NextHearing = ob.NextHearing,
                                     DisposedDate = ob.DisposedDate,
                                     CourtStatus = ob.Status,
                                     PetitionerName = ob.PetitionerName,
                                     RespondentName = ob.RespondentName,
                                     CourtComplex = (ob.CourtComplexCourtEstablishment + " " + ob.BenchName),
                                     ZoneName = ob.BranchName,
                                     CounselName = ob.MatterName,
                                     // MatterFilingDate = ob.dUpdateDate
                                     MatterFilingDate = (ob.dUpdateDate == null || ob.dUpdateDate == "") ? "" : (Convert.ToDateTime(ob.dUpdateDate).Year == 1900 ? "" : Convert.ToDateTime(ob.dUpdateDate).ToString("dd/MM/yyyy")),
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
        /// Export To PDF BOM CustomDashboard
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportToPDFBOMCustomDashboard()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                string filename = "LitigationCaseList.pdf";
                var court = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["courttype"]));
                var courtname = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["courtname"]));
                var stateid = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["stateid"]));
                var districtid = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["districtid"]));
                var courtcompestname = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["courtcompestname"]));
                var ditrictcourt = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["ditrictcourt"]));
                var sortdate = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["sortdate"]));
                var CaseStatus = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["CaseStatus"]));
                var hearingfrom = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["hearingfrom"]));
                var hearingto = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["hearingto"]));
                var casename = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["casename"]));
                var searchany = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["searchany"]));
                var PetionerName = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["PetionerName"]));
                var RespondentName = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["RespondentName"]));
                var Advocate = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["Advocate"]));
                var CourtCaseNo = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["CourtCaseNo"]));
                List<CWCaseList> casedeatils = new List<CWCaseList>();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                string search = "";
                search = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["search"]));
                int pagesize = 10, pageindex = 1;
                pageindex = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagenum"]));
                pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagesize"]));
                if (courtname == "0")
                {
                    courtname = "";
                }
                if (stateid == "0")
                {
                    stateid = "";
                }
                if (court == "1")
                {
                    court = "Supreme Court";
                }
                else if (court == "2")
                {
                    court = "High Court";
                }
                else if (court == "3")
                {
                    court = "District Court";
                }
                else if (court == "4")
                {
                    court = "Tribunals";
                }
                else if (court == "4")
                {
                    court = "Tribunals";
                }
                var db = new LawPracticeEntities();
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
                strtemplate += "<center><p><strong>Mykase-Discovered matters List</strong><span style='float:right'>Date: " + String.Format("{0:dd MMM yyyy}", DateTime.Now) + "</span></p></hr>";
                strtemplate += " <p></p>";
                DataTable pageaccesslist = new DataTable();
                if (LoggedInUser.RoleId == 1)
                {
                    pageaccesslist = DataAccessADO.GetCaseDeatilsByUserCaseId(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), court, courtname,
                    stateid, districtid, courtcompestname, ditrictcourt, sortdate, CaseStatus, hearingfrom, hearingto, casename, PetionerName,
                    RespondentName, Advocate, CourtCaseNo, pageindex, pagesize);
                }
                else
                {
                    pageaccesslist = DataAccessADO.GetCaseDeatilsByUserCaseIdForUser(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), court, courtname,
                    stateid, districtid, courtcompestname, ditrictcourt, sortdate, CaseStatus, hearingfrom, hearingto, casename, PetionerName,
                    RespondentName, Advocate, CourtCaseNo, pageindex, pagesize);
                }

                for (int i = 0; i < pageaccesslist.Rows.Count; i++)
                {

                    casedeatils.Add(new CWCaseList
                    {
                        TotalRecord = Convert.ToString(pageaccesslist.Rows[i]["totRow"]),
                        RowId = Convert.ToString(pageaccesslist.Rows[i]["rownum"]),
                        MatterName = Convert.ToString(pageaccesslist.Rows[i]["CounselName"]),
                        BranchName = Convert.ToString(pageaccesslist.Rows[i]["ZoneName"]),
                        Court = Convert.ToString(pageaccesslist.Rows[i]["CourtName"]),
                        CourtName = Convert.ToString(pageaccesslist.Rows[i]["Court"]),
                        CaseName = Convert.ToString(pageaccesslist.Rows[i]["MatterName"]),
                        Advocate = Convert.ToString(pageaccesslist.Rows[i]["AdvocateName"]),
                        UserCaseId = Convert.ToString(pageaccesslist.Rows[i]["UserCaseId"]),
                        NextHearing = Convert.ToString(pageaccesslist.Rows[i]["Nexthearingdate"]),
                        DisposedDate = Convert.ToString(pageaccesslist.Rows[i]["Disposeddate"]),
                        Status = Convert.ToString(pageaccesslist.Rows[i]["CourtStatus"]),
                        PetitionerName = Convert.ToString(pageaccesslist.Rows[i]["PetitionerName"]),
                        RespondentName = Convert.ToString(pageaccesslist.Rows[i]["RespondentName"]),
                        dUpdateDate = Convert.ToString(pageaccesslist.Rows[i]["FilingDate"]),
                        MatterID = Convert.ToString(pageaccesslist.Rows[i]["Id"]),
                        CaseDiary = Convert.ToString(pageaccesslist.Rows[i]["CourtCaseNo"]),
                        CourtComplexCourtEstablishment = Convert.ToString(pageaccesslist.Rows[i]["CourtComplex"] == null ? "" : pageaccesslist.Rows[i]["CourtComplex"]),
                    });
                }
                var trialList = (from ob in casedeatils
                                 select new
                                 {
                                     CourtCaseNo = (ob.CaseDiary == null || ob.CaseDiary == "") ? "" : Regex.Replace(ob.CaseDiary, "<.*?>", string.Empty),
                                     CourtName = ob.Court,
                                     Court = ob.CourtName,
                                     MatterName = ob.CaseName,
                                     Advocate = (ob.Advocate == null || ob.Advocate == "") ? "" : Regex.Replace(ob.Advocate, "<.*?>", string.Empty),
                                     NextHearing = ob.NextHearing,
                                     DisposedDate = ob.DisposedDate,
                                     CourtStatus = ob.Status,
                                     PetitionerName = ob.PetitionerName,
                                     RespondentName = ob.RespondentName,
                                     CourtComplex = (ob.CourtComplexCourtEstablishment + " " + ob.BenchName),
                                     ZoneName = ob.BranchName,
                                     CounselName = ob.MatterName,
                                     MatterFilingDate = ob.dUpdateDate
                                 }).ToList();


                strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                strtemplate += "  <thead><tr> ";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Court Case No</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Court</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Court Name</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Matter Name</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>NextHearing</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>DisposedDate</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Court Status</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>PetitionerName</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>RespondentName</th>";
                strtemplate += "</tr></thead><tbody>";
                if (trialList != null)
                {
                    foreach (var idata in trialList)
                    {
                        strtemplate += "<tr><td height = '20' align = 'left' valign ='top'  style='padding:0 5px;' >" + idata.CourtCaseNo + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.Court + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.CourtName + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.MatterName + "  </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + String.Format("{0:dd MMM yyyy}", idata.NextHearing) + "  </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + String.Format("{0:dd MMM yyyy}", idata.DisposedDate) + "  </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.CourtStatus + "  </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.PetitionerName + "  </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.RespondentName + "  </td></tr>";
                    }
                    strtemplate += "</tbody></table>";
                }
                else { }
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
        /// Get casewatch cause list
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public JsonResult AssignCaseCountByUserId()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                string usersearch = "";
                usersearch = Convert.ToString(QueryAES.UrlDecode(Request.Form["SearchUserName"]));
                int pagesize = 10, pageindex = 1;
                pageindex = Convert.ToInt32(QueryAES.UrlDecode(Request.Form["pagenum"]));
                pagesize = Convert.ToInt32(QueryAES.UrlDecode(Request.Form["pagesize"]));
              
                var db = new LawPracticeEntities();
                var  pageaccesslist = DataAccessADO.GetDashboardCountByUserId(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(),pageindex, pagesize, usersearch);
                return Json(pageaccesslist, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Export User case details list
        /// </summary>
        [AuthLog(Roles = "Firm,User")]
        public void ExportToExcelUserCaseListReport()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                string exlfilename = "UserCaseListCount_" + DateTime.Now;
                List<LitigationUserCaseDetails> casedeatils = new List<LitigationUserCaseDetails>();
                string usersearch = "";
                usersearch = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["loginusername"]));
                int pagesize = 10, pageindex = 1;
                pageindex = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagenum"]));
                pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagesize"]));
                var db = new LawPracticeEntities();
                var  pageaccesslist = DataAccessADO.GetDashboardCountByUserId(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), pageindex, pagesize, usersearch);
                dynamic dynamicdata = JsonConvert.DeserializeObject(pageaccesslist);
                if (dynamicdata != null)
                {
                    for (int i = 0; i < dynamicdata.Count; i++)
                    {
                        casedeatils.Add(new LitigationUserCaseDetails
                        {
                            totRow = Convert.ToInt32(dynamicdata[i]["rownum"]),
                            LoginId = dynamicdata[i]["LoginId"],
                            UserName = dynamicdata[i]["UserName"],
                            totalcount = dynamicdata[i]["totalcount"]
                        });
                    }
                }
                var trialList = (from ob in casedeatils
                                 select new
                                 {
                                     SRNo=ob.totRow,
                                     LoginUserId = ob.LoginId,
                                     UserName = ob.UserName,
                                     TotalMatterAssign = ob.totalcount
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
        /// Export User case details list
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportToPdfUserCaseReport()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                string exlfilename = "UserCaseListCount.pdf";
                List<LitigationUserCaseDetails> casedeatils = new List<LitigationUserCaseDetails>();
                string usersearch = "";
                usersearch = Convert.ToString(QueryAES.UrlDecode(HttpContext.Request.QueryString["loginusername"]));
                int pagesize = 10, pageindex = 1;
                pageindex = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagenum"]));
                pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Request.QueryString["pagesize"]));
                var db = new LawPracticeEntities();
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
                strtemplate += "<center><p><strong>Mykase-Discovered Assign Matter List</strong><span style='float:right'>Date: " + String.Format("{0:dd MMM yyyy}", DateTime.Now) + "</span></p></hr>";
                strtemplate += " <p></p>";
                var pageaccesslist = DataAccessADO.GetDashboardCountByUserId(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), pageindex, pagesize, usersearch);
                dynamic dynamicdata = JsonConvert.DeserializeObject(pageaccesslist);
                if (dynamicdata != null)
                {
                    for (int i = 0; i < dynamicdata.Count; i++)
                    {
                        casedeatils.Add(new LitigationUserCaseDetails
                        {
                            totRow = Convert.ToInt32(dynamicdata[i]["rownum"]),
                            LoginId = dynamicdata[i]["LoginId"],
                            UserName = dynamicdata[i]["UserName"],
                            totalcount = dynamicdata[i]["totalcount"]
                        });
                    }
                }
                var trialList = (from ob in casedeatils
                                 select new
                                 {
                                     SRNo = ob.totRow,
                                     LoginId = ob.LoginId,
                                     UserName = ob.UserName,
                                     TotalMatterAssign = ob.totalcount
                                 }).ToList();

                strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                strtemplate += "  <thead><tr> ";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Sr No</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Login UserId</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>User Name</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Total Matter Assign</th>";
                strtemplate += "</tr></thead><tbody>";
                if (trialList != null)
                {
                    foreach (var idata in trialList)
                    {
                        strtemplate += "<tr><td height = '20' align = 'left' valign ='top'  style='padding:0 5px;' >" + idata.SRNo + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.LoginId + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.UserName + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.TotalMatterAssign + "  </td></tr>";
                    }
                    strtemplate += "</tbody></table>";
                }
                else { }
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
                var pffth = Server.MapPath("~\\Documents\\ExportData\\Pdf\\" + LoggedInUser.FirmId.ToString() + "\\" + LoggedInUser.UserId.ToString() + "\\" + exlfilename);
                System.IO.File.WriteAllBytes(pffth, pdfBytes);
                Response.Clear();
                System.IO.MemoryStream ms = new System.IO.MemoryStream(pdfBytes);
                Response.ContentType = "application/pdf";
                Response.AddHeader("content-disposition", "attachment;filename=" + exlfilename + "");
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
        ///Get Litigation dashboard total count
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public JsonResult LitigationDasboardTotalCount()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                var rolesids = LoggedInUser.RoleId;
                string resid = AddCaseCaseWatch.LitigationDashbaordTotalCount(userId, apiUrl, Convert.ToInt32(rolesids),
                    LoggedInUser.IsCaseWatchUser, LoggedInUser.UserName.ToString(),LoggedInUser.FirmId.ToString(),
                    LoggedInUser.UserId.ToString(), strusername);
                return Json(resid, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        ///Get Litigation dashboard Status Not Found count
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public JsonResult LitigationDasboardStatusnotFoundCount()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                var rolesids = LoggedInUser.RoleId;
                string resid = AddCaseCaseWatch.LitigationDashbaordStatusnotFoundCount(userId, apiUrl, Convert.ToInt32(rolesids),
                    LoggedInUser.IsCaseWatchUser, LoggedInUser.UserName.ToString(), LoggedInUser.FirmId.ToString(),
                    LoggedInUser.UserId.ToString(), strusername);
                return Json(resid, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        ///Get Litigation dashboard Pending count
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public JsonResult LitigationDasboardPendingCount()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                var rolesids = LoggedInUser.RoleId;
                string resid = AddCaseCaseWatch.LitigationDashbaordPendingCount(userId, apiUrl, Convert.ToInt32(rolesids),
                    LoggedInUser.IsCaseWatchUser, LoggedInUser.UserName.ToString(), LoggedInUser.FirmId.ToString(),
                    LoggedInUser.UserId.ToString(), strusername);
                return Json(resid, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        ///Get Litigation dashboard Disposed count
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public JsonResult LitigationDasboardDisposedCount()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                var rolesids = LoggedInUser.RoleId;
                string resid = AddCaseCaseWatch.LitigationDashbaordDisposedCount(userId, apiUrl, Convert.ToInt32(rolesids),
                    LoggedInUser.IsCaseWatchUser, LoggedInUser.UserName.ToString(), LoggedInUser.FirmId.ToString(),
                    LoggedInUser.UserId.ToString(), strusername);
                return Json(resid, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        ///Get Litigation dashboard Notes count
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public JsonResult LitigationDasboardNotesCount()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                var rolesids = LoggedInUser.RoleId;
                string resid = AddCaseCaseWatch.LitigationDashbaordNotesCount(userId, apiUrl, Convert.ToInt32(rolesids),
                    LoggedInUser.IsCaseWatchUser, LoggedInUser.UserName.ToString(), LoggedInUser.FirmId.ToString(),
                    LoggedInUser.UserId.ToString(), strusername);
                return Json(resid, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }        [AuthLog(Roles = "Firm,User")]
        public ActionResult LitigationColumnSelection()
        {
            return View();
        }
        /// <summary>
        /// Load Main Matters Details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public string LoadMainMattersDetails()
        {
            var Caseids = QueryAES.UrlDecode(Request.Form["caseid"]);
            try
            {
                Caseids = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(Caseids));
            }
            catch { }
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = "mykase123456789abcdef",
                    Userid = userId,
                    CaseId = Caseids
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MainMattersDetails"), "POST", builders);
                JObject obj = JObject.Parse(resid);
                string newJson = JsonConvert.SerializeObject(obj);
                return newJson;

            }
            catch (Exception ex) { return ex.Message.ToString(); }
        }

        /// <summary>
        /// Load Main Matters Details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public string LoadLinkedMattersDetails()
        {
            var Caseids = QueryAES.UrlDecode(Request.Form["caseid"]);
            try
            {
                Caseids = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(Caseids));
            }
            catch { }
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = "mykase123456789abcdef",
                    Userid = userId,
                    CaseId = Caseids
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                // string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/LinkedCasesDetails"), "POST", builders);
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MainMatters_LinkedDetails"), "POST", builders);
                JObject obj = JObject.Parse(resid);
                string newJson = JsonConvert.SerializeObject(obj);
                return newJson;

            }
            catch (Exception ex) { return ex.Message.ToString(); }
        }

        /// <summary>
        /// Contempt Case Add Live update 
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public string LoadContemptCaseDetails()
        {
            var mastercaseid = QueryAES.UrlDecode(Request.Form["mastercaseid"]);
            var Linkedcaseno = QueryAES.UrlDecode(Request.Form["Linkedcaseno"]);
            var Ctypes = QueryAES.UrlDecode(Request.Form["ccasetype"]);

            var db1 = new LawPracticeEntities();
            try
            {
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = WebConfigurationManager.AppSettings["matteridname"] + LoggedInUser.UserId;
                }

                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    userid = userIdDetail,
                    linkedcaseno = Linkedcaseno,
                    CaseId = mastercaseid,
                    linkedcasetype = Ctypes
                };

                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var addfClient = new WebClient();
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/LinkedCaseForModal"), "POST", builders);
                JObject obj = JObject.Parse(resid);
                string newJson = JsonConvert.SerializeObject(obj);
                return newJson;

            }
            catch (Exception ex) { return ex.Message.ToString(); }
        }
        /// <summary>
        /// Load Sub Matters Details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public string LoadSubMattersDetails()
        {
            var userCaseids = QueryAES.UrlDecode(Request.Form["Usercaseid"]);
            try
            {
                userCaseids = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(userCaseids));
            }
            catch { }
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = "mykase123456789abcdef",
                    Userid = userId,
                    UserCaseId = userCaseids
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/ViewSubMatters"), "POST", builders);
                JObject obj = JObject.Parse(resid);
                string newJson = JsonConvert.SerializeObject(obj);
                return newJson;

            }
            catch (Exception ex) { return ex.Message.ToString(); }
        }
        /// <summary>
        /// Load FIR Details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public string LoadFIRDetails()
        {
            var userCaseids = QueryAES.UrlDecode(Request.Form["Usercaseid"]);
            try
            {
                userCaseids = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(userCaseids));
            }
            catch { }
            var db1 = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = "mykase123456789abcdef",
                    Userid = userId,
                    UserCaseId = userCaseids
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/FIRDetails"), "POST", builders);
                JObject obj = JObject.Parse(resid);
                string newJson = JsonConvert.SerializeObject(obj);
                return newJson;

            }
            catch (Exception ex) { return ex.Message.ToString(); }
        }
        /// <summary>
        /// View Linked Case details
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public string ViewLinkedCaseDetails()
        {
           var db1 = new LawPracticeEntities();
           try
           {
              string caseid = Convert.ToString(QueryAES.UrlDecode(Request.Form["caseid"]));
              try
              {
                caseid = caseid.Replace(" ", "+");
                caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
              }
              catch { }
              var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
              string strusername = ConfigurationManager.AppSettings["matteridname"];
              string userId = "", firmId = "";
              userId = strusername + LoggedInUser.UserId.ToString();
              firmId = LoggedInUser.FirmId.ToString();
              var addfClient = new WebClient();
              object rawfile = new
              {
                 Accesstoken = "mykase123456789abcdef",
                 userid = userId,
                 CaseId = caseid
              };
             addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
             string builders = JsonConvert.SerializeObject(rawfile);
             ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
             string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/ViewMappedLinkedMainCase"), "POST", builders);
             JObject obj = JObject.Parse(resid);
             string newJson = JsonConvert.SerializeObject(obj);
             return newJson;

           }
                catch (Exception ex) { return ex.Message.ToString(); } 
        }
        //Prem work start
        /// <summary>
        ///Add zone deatils
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public string AddZoneDetails()
        {
            var zone = QueryAES.UrlDecode(Request.Form["zoneName"])?.Trim();
            var db = new LawPracticeEntities();
            try
            {
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string userId = string.Empty;
                string userName = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (Convert.ToInt32(LoggedInUser.RoleId) == 1)
                {
                    userId = Convert.ToString(LoggedInUser.UserId);
                    userName = LoggedInUser.UserName;

                }
                else
                {
                    var result = db.usp_GetUserDetailByUserID(Convert.ToString(LoggedInUser.FirmId), LoggedInUser.UserId.ToString()).FirstOrDefault();
                    userId = result.FirmAdminuserId;
                    userName = result.FirmAdminUserName;
                }
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = userName;
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = WebConfigurationManager.AppSettings["matteridname"] + userId;
                }

                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    UserId = userIdDetail,
                    source = zone,

                };

                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var addfClient = new WebClient();
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AddZone"), "POST", builders);
                JObject obj = JObject.Parse(resid);
                string newJson = JsonConvert.SerializeObject(obj);
                return newJson;
            }
            catch (Exception ex) { return ex.Message.ToString(); }
        }


        /// <summary>
        ///Add zone deatils
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public string ZonlistById()
        {
            var db = new LawPracticeEntities();
            try
            {
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string userId = string.Empty;
                string userName = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (Convert.ToInt32(LoggedInUser.RoleId) == 1)
                {
                    userId = Convert.ToString(LoggedInUser.UserId);
                    userName = LoggedInUser.UserName;
                }
                else
                {
                    var result = db.usp_GetUserDetailByUserID(Convert.ToString(LoggedInUser.FirmId), LoggedInUser.UserId.ToString()).FirstOrDefault();
                    userId = result.FirmAdminuserId;
                    userName = result.FirmAdminUserName;
                }
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = userName;
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = WebConfigurationManager.AppSettings["matteridname"] + userId;
                }

                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    UserId = userIdDetail
                };

                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var addfClient = new WebClient();
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/ZoneListByAdminId"), "POST", builders);
                JObject obj = JObject.Parse(resid);
                string newJson = JsonConvert.SerializeObject(obj);
                return newJson;
            }
            catch (Exception ex) { return ex.Message.ToString(); }
        }



        /// <summary>
        ///Add zone deatils
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public string ListOfAssignCourtZoneWise()
        {
            var db = new LawPracticeEntities();
            try
            {
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string userId = string.Empty;
                string userName = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                var zone = QueryAES.UrlDecode(Request.Form["Id"]);
                if (Convert.ToInt32(LoggedInUser.RoleId) == 1)
                {
                    userId = Convert.ToString(LoggedInUser.UserId);
                    userName = LoggedInUser.UserName;
                }
                else
                {
                    //  var result = db.usp_GetUserDetailByUserID(Convert.ToString(LoggedInUser.FirmId), LoggedInUser.UserId.ToString()).FirstOrDefault();
                    userId = LoggedInUser.UserId.ToString();
                    userName = LoggedInUser.UserName;
                }
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = userName;
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = WebConfigurationManager.AppSettings["matteridname"] + userId;
                }

                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    UserId = userIdDetail,
                    source = zone
                };

                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var addfClient = new WebClient();
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/ListOfAssignCourtZoneWise"), "POST", builders);
                JObject obj = JObject.Parse(resid);
                string newJson = JsonConvert.SerializeObject(obj);
                return newJson;
            }
            catch (Exception ex) { return ex.Message.ToString(); }
        }

        /// <summary>
        ///Assign Court Zone Wise
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public string AssignCourtZoneWise()
        {
            var zone = QueryAES.UrlDecode(Request.Form["ZoneId"]);
            var vcourt = QueryAES.UrlDecode(Request.Form["crtid"]);
            var vBench = QueryAES.UrlDecode(Request.Form["bench"]);
            var vState = QueryAES.UrlDecode(Request.Form["vState"]);
            var db = new LawPracticeEntities();
            try
            {
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string userId = string.Empty;
                string userName = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (Convert.ToInt32(LoggedInUser.RoleId) == 1)
                {
                    userId = Convert.ToString(LoggedInUser.UserId);
                    userName = LoggedInUser.UserName;

                }
                else
                {
                    var result = db.usp_GetUserDetailByUserID(Convert.ToString(LoggedInUser.FirmId), LoggedInUser.UserId.ToString()).FirstOrDefault();
                    userId = result.FirmAdminuserId;
                    userName = result.FirmAdminUserName;
                }
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = userName;
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = WebConfigurationManager.AppSettings["matteridname"] + userId;
                }

                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    UserId = userIdDetail,
                    source = zone,
                    crtid = vcourt,
                    Benchid = vBench,
                    triState = vState

                };

                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var addfClient = new WebClient();
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AssignCourtZoneWise"), "POST", builders);
                JObject obj = JObject.Parse(resid);
                string newJson = JsonConvert.SerializeObject(obj);
                return newJson;
            }
            catch (Exception ex) { return ex.Message.ToString(); }
        }

        //Assign user to zone

        /// <summary>
        ///Assign Court Zone Wise
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public string AssignUserZoneWise()
        {
            var zone = QueryAES.UrlDecode(Request.Form["ZoneId"]);
            var AssignTo = QueryAES.UrlDecode(Request.Form["Assignto"]);
            var AssignUserName = QueryAES.UrlDecode(Request.Form["AssignUserName"]);
            var db = new LawPracticeEntities();
            try
            {
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string userId = string.Empty;
                string userName = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                string updatedAssignTo = string.Empty;
                if (Convert.ToInt32(LoggedInUser.RoleId) == 1)
                {
                    userId = Convert.ToString(LoggedInUser.UserId);
                    userName = LoggedInUser.UserName;

                }
                else
                {
                    var result = db.usp_GetUserDetailByUserID(Convert.ToString(LoggedInUser.FirmId), LoggedInUser.UserId.ToString()).FirstOrDefault();
                    userId = result.FirmAdminuserId;
                    userName = result.FirmAdminUserName;
                }
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = userName;
                    AccessTokenDetail = "internal";
                    updatedAssignTo = AssignUserName;
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = WebConfigurationManager.AppSettings["matteridname"] + userId;
                    updatedAssignTo = string.Join(",", AssignTo.Split(',').Select(value => WebConfigurationManager.AppSettings["matteridname"] + value));

                }

                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    NewUserId = userIdDetail,
                    UserId = updatedAssignTo,
                    source = zone
                };

                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var addfClient = new WebClient();
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AssignUserZoneWise"), "POST", builders);
                JObject obj = JObject.Parse(resid);
                string newJson = JsonConvert.SerializeObject(obj);
                return newJson;
            }
            catch (Exception ex) { return ex.Message.ToString(); }
        }
        /// <summary>
        ///Add zone deatils
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public string DeleteZoneDetailsById()
        {
            var zoneId = QueryAES.UrlDecode(Request.Form["zoneId"]);
            var db = new LawPracticeEntities();
            try
            {
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string userId = string.Empty;
                string userName = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (Convert.ToInt32(LoggedInUser.RoleId) == 1)
                {
                    userId = Convert.ToString(LoggedInUser.UserId);
                    userName = LoggedInUser.UserName;
                }
                else
                {
                    var result = db.usp_GetUserDetailByUserID(Convert.ToString(LoggedInUser.FirmId), LoggedInUser.UserId.ToString()).FirstOrDefault();
                    userId = result.FirmAdminuserId;
                    userName = result.FirmAdminUserName;
                }
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = userName;
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = WebConfigurationManager.AppSettings["matteridname"] + userId;
                }
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    UserId = userIdDetail,
                    source = zoneId,
                };
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var addfClient = new WebClient();
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/DeleteZone"), "POST", builders);
                JObject obj = JObject.Parse(resid);
                string newJson = JsonConvert.SerializeObject(obj);
                return newJson;
            }
            catch (Exception ex) { return ex.Message.ToString(); }
        }
        //Get Assign user list
        [AuthLog(Roles = "Firm,User")]
        public string ListOfAssignUserZoneWise()
        {
            var db = new LawPracticeEntities();
            try
            {
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string userId = string.Empty;
                string userName = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                var zone = QueryAES.UrlDecode(Request.Form["Id"]);
                if (Convert.ToInt32(LoggedInUser.RoleId) == 1)
                {
                    userId = Convert.ToString(LoggedInUser.UserId);
                    userName = LoggedInUser.UserName;
                }
                else
                {
                    //  var result = db.usp_GetUserDetailByUserID(Convert.ToString(LoggedInUser.FirmId), LoggedInUser.UserId.ToString()).FirstOrDefault();
                    userId = LoggedInUser.UserId.ToString();
                    userName = LoggedInUser.UserName;
                }
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = userName;
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = WebConfigurationManager.AppSettings["matteridname"] + userId;
                }
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    UserId = userIdDetail,
                    source = zone
                };

                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var addfClient = new WebClient();
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/ListOfAssignUserZoneWise"), "POST", builders);
                JObject obj = JObject.Parse(resid);
                string newJson = JsonConvert.SerializeObject(obj);
                return newJson;
            }
            catch (Exception ex) { return ex.Message.ToString(); }
        }
        /// <summary>
        ///Delete Assign user to zone
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public string DeleteAssignUserDetailsById()
        {
            var iid = QueryAES.UrlDecode(Request.Form["iid"]);
            var db = new LawPracticeEntities();
            try
            {
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string userId = string.Empty;
                string userName = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (Convert.ToInt32(LoggedInUser.RoleId) == 1)
                {
                    userId = Convert.ToString(LoggedInUser.UserId);
                    userName = LoggedInUser.UserName;
                }
                else
                {
                    var result = db.usp_GetUserDetailByUserID(Convert.ToString(LoggedInUser.FirmId), LoggedInUser.UserId.ToString()).FirstOrDefault();
                    userId = result.FirmAdminuserId;
                    userName = result.FirmAdminUserName;
                }
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = userName;
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = WebConfigurationManager.AppSettings["matteridname"] + userId;
                }
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    UserId = userIdDetail,
                    source = iid,

                };

                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var addfClient = new WebClient();
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/DeleteAssignUser"), "POST", builders);
                JObject obj = JObject.Parse(resid);
                string newJson = JsonConvert.SerializeObject(obj);
                return newJson;
            }
            catch (Exception ex) { return ex.Message.ToString(); }
        }
        /// <summary>
        ///Delete Assign user to zone
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public string DeleteAssignCourtDetailsById()
        {
            var iid = QueryAES.UrlDecode(Request.Form["iid"]);
            var db = new LawPracticeEntities();
            try
            {
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string userId = string.Empty;
                string userName = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (Convert.ToInt32(LoggedInUser.RoleId) == 1)
                {
                    userId = Convert.ToString(LoggedInUser.UserId);
                    userName = LoggedInUser.UserName;

                }
                else
                {
                    var result = db.usp_GetUserDetailByUserID(Convert.ToString(LoggedInUser.FirmId), LoggedInUser.UserId.ToString()).FirstOrDefault();
                    userId = result.FirmAdminuserId;
                    userName = result.FirmAdminUserName;
                }
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = userName;
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = WebConfigurationManager.AppSettings["matteridname"] + userId;
                }

                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    UserId = userIdDetail,
                    source = iid,

                };

                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var addfClient = new WebClient();
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/DeleteAssignCourtToZone"), "POST", builders);
                JObject obj = JObject.Parse(resid);
                string newJson = JsonConvert.SerializeObject(obj);
                return newJson;
            }
            catch (Exception ex) { return ex.Message.ToString(); }
        }






        /// <summary>
        ///Get filter  matter list
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public string GetFilterMetterList()
        {
            var zone = QueryAES.UrlDecode(Request.Form["zone"]);
            var year = QueryAES.UrlDecode(Request.Form["year"]);
            var court = QueryAES.UrlDecode(Request.Form["court"]);
            var month = QueryAES.UrlDecode(Request.Form["month"]);
            var yearSize = QueryAES.UrlDecode(Request.Form["yearSize"]);

            var db = new LawPracticeEntities();
            try
            {
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string userId = string.Empty;
                string userName = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (Convert.ToInt32(LoggedInUser.RoleId) == 1)
                {
                    userId = Convert.ToString(LoggedInUser.UserId);
                    userName = LoggedInUser.UserName;

                }
                else
                {
                    var result = db.usp_GetUserDetailByUserID(Convert.ToString(LoggedInUser.FirmId), LoggedInUser.UserId.ToString()).FirstOrDefault();
                    userId = result.FirmAdminuserId;
                    userName = result.FirmAdminUserName;
                }
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = userName;
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = WebConfigurationManager.AppSettings["matteridname"] + userId;
                }

                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    UserId = userIdDetail,
                    monthid = month,
                    Year = yearSize,
                    vCourtval = court,
                    source = zone,
                    Flag = year
                };

                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var addfClient = new WebClient();
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AgewiseShortPendingReportMatterList"), "POST", builders);
                JObject obj = JObject.Parse(resid);
                string newJson = JsonConvert.SerializeObject(obj);
                return newJson;
            }
            catch (Exception ex) { return ex.Message.ToString(); }
        }


        /// <summary>
        ///Get filter  matter list
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public void ExportToExcel(string zone, string year, string court, string month, string yearSize, string fileName)
        {


            var db = new LawPracticeEntities();
            try
            {
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string userId = string.Empty;
                string userName = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (Convert.ToInt32(LoggedInUser.RoleId) == 1)
                {
                    userId = Convert.ToString(LoggedInUser.UserId);
                    userName = LoggedInUser.UserName;

                }
                else
                {
                    var result = db.usp_GetUserDetailByUserID(Convert.ToString(LoggedInUser.FirmId), LoggedInUser.UserId.ToString()).FirstOrDefault();
                    userId = result.FirmAdminuserId;
                    userName = result.FirmAdminUserName;
                }
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = userName;
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = WebConfigurationManager.AppSettings["matteridname"] + userId;
                }

                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    UserId = userIdDetail,
                    monthid = month,
                    Year = yearSize,
                    vCourtval = court,
                    source = zone,
                    Flag = year
                };

                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var addfClient = new WebClient();
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AgewiseShortPendingReportMatterList"), "POST", builders);
                ApiResponse response = JsonConvert.DeserializeObject<ApiResponse>(resid);
                List<FilterMatterListData> tableData = response.Data.Table;

                List<FinalResultForExport> finalData = new List<FinalResultForExport>();
                for (int i = 0; i < tableData.Count; i++)
                {
                    finalData.Add(new FinalResultForExport
                    {
                        Court = Convert.ToString(tableData[i].CourtName),
                        Matter_Name = Convert.ToString(tableData[i].VCaseName),
                        Case_No = Convert.ToString(tableData[i].VCaseNo).Replace("<br/>", "").Replace("<br><font size=1>(", "/").Replace("</font>", "").Replace("<br>", ""),
                        Status = Convert.ToString(tableData[i].VStatus),
                        Filing_Date = Convert.ToString(tableData[i].FilingDate),
                        Next_Hearing = Convert.ToString(tableData[i].VCauselistDate)
                    });
                }
                var trialList = (from ob in finalData
                                 select new
                                 {
                                     Court = ob.Court,
                                     Matter_Name = ob.Matter_Name,

                                     Case_No = ob.Case_No,

                                     Status = ob.Status,
                                     Filing_Date = ob.Filing_Date,
                                     Next_Hearing = ob.Next_Hearing
                                 }).ToList();
                var gv = new System.Web.UI.WebControls.GridView();
                gv.DataSource = trialList;
                gv.DataBind();
                gv.HeaderStyle.BackColor = Color.Gray;
                gv.HeaderStyle.ForeColor = Color.White;
                Response.ClearContent();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", "attachment; filename=" + fileName + ".xls");
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
            }
        }
        [AuthLog(Roles = "Firm,User")]
        public string GetFilterMetterListPendingData()
        {

            var dateFlag = QueryAES.UrlDecode(Request.Form["dateFlag"]);
            var flag = QueryAES.UrlDecode(Request.Form["flag"]);
            var courtFlag = QueryAES.UrlDecode(Request.Form["courtFlag"]);
            var year = QueryAES.UrlDecode(Request.Form["year"]);
            var month = QueryAES.UrlDecode(Request.Form["month"]);
            var db = new LawPracticeEntities();
            try
            {
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string userId = string.Empty;
                string userName = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (Convert.ToInt32(LoggedInUser.RoleId) == 1)
                {
                    userId = Convert.ToString(LoggedInUser.UserId);
                    userName = LoggedInUser.UserName;

                }
                else
                {
                    var result = db.usp_GetUserDetailByUserID(Convert.ToString(LoggedInUser.FirmId), LoggedInUser.UserId.ToString()).FirstOrDefault();
                    userId = result.FirmAdminuserId;
                    userName = result.FirmAdminUserName;
                }
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = userName;
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = WebConfigurationManager.AppSettings["matteridname"] + userId;
                }

                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    UserId = userIdDetail,
                    Monthid = month,
                    Year = year,
                    vCourtval = courtFlag,
                    source = dateFlag,
                    Flag = flag
                };

                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var addfClient = new WebClient();
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/FilterMetterListPendingData"), "POST", builders);
                JObject obj = JObject.Parse(resid);
                string newJson = JsonConvert.SerializeObject(obj);
                return newJson;
            }
            catch (Exception ex) { return ex.Message.ToString(); }
        }
        /// <summary>
        ///Get filter  matter list
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public void ExportToExcelGetFilterMetterListPendingData(string dateFlag, string flag, string courtFlag, string year, string month)
        {
            var db = new LawPracticeEntities();
            try
            {
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string userId = string.Empty;
                string userName = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (Convert.ToInt32(LoggedInUser.RoleId) == 1)
                {
                    userId = Convert.ToString(LoggedInUser.UserId);
                    userName = LoggedInUser.UserName;

                }
                else
                {
                    var result = db.usp_GetUserDetailByUserID(Convert.ToString(LoggedInUser.FirmId), LoggedInUser.UserId.ToString()).FirstOrDefault();
                    userId = result.FirmAdminuserId;
                    userName = result.FirmAdminUserName;
                }
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = userName;
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = WebConfigurationManager.AppSettings["matteridname"] + userId;
                }
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    UserId = userIdDetail,
                    Monthid = month,
                    Year = year,
                    vCourtval = courtFlag,
                    source = dateFlag,
                    Flag = flag
                };
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var addfClient = new WebClient();
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/FilterMetterListPendingData"), "POST", builders);
                ApiResponse response = JsonConvert.DeserializeObject<ApiResponse>(resid);
                List<FilterMatterListData> tableData = response.Data.Table;

                List<FinalResultForExport> finalData = new List<FinalResultForExport>();
                for (int i = 0; i < tableData.Count; i++)
                {
                    finalData.Add(new FinalResultForExport
                    {
                        Court = Convert.ToString(tableData[i].CourtName),
                        Matter_Name = Convert.ToString(tableData[i].VCaseName),
                        Case_No = Convert.ToString(tableData[i].VCaseNo).Replace("<br/>", "").Replace("<br><font size=1>(", "/").Replace("</font>", "").Replace("<br>", ""),
                        Status = Convert.ToString(tableData[i].VStatus),
                        Filing_Date = Convert.ToString(tableData[i].FilingDate),
                        Next_Hearing = Convert.ToString(tableData[i].VCauselistDate)
                    });
                }
                var trialList = (from ob in finalData
                                 select new
                                 {
                                     Court = ob.Court,
                                     Matter_Name = ob.Matter_Name,
                                     Case_No = ob.Case_No,
                                     Status = ob.Status,
                                     Filing_Date = ob.Filing_Date,
                                     Next_Hearing = ob.Next_Hearing
                                 }).ToList();
                var gv = new System.Web.UI.WebControls.GridView();
                string encodedFileName = Uri.EscapeDataString("AgeWise_Pending_Report");
                gv.DataSource = trialList;
                gv.DataBind();
                gv.HeaderStyle.BackColor = Color.Gray;
                gv.HeaderStyle.ForeColor = Color.White;
                Response.ClearContent();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", $"attachment; filename={encodedFileName}.xls");
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
            }
        }


        [AuthLog(Roles = "Firm,User")]
        public void ExportToExcelAllMatterListFavourAgainst(string likeFlag, string courtTypeFlag, string yearFlag, string year, string monthid)
        {

            var db = new LawPracticeEntities();
            try
            {
                var result = DataAccessADO.Usp_GetUserCaseidFavourAgainst(LoggedInUser.FirmId.ToString(), likeFlag, courtTypeFlag, yearFlag, year, monthid);
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                string joineduser = "";
                var getuserdetails = db.usp_GetUserDetailByUserID(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).FirstOrDefault();
                if (IsCaseWatchUser == "1" || getuserdetails.IsAdminCW == 1)
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }
                var addfClient = new WebClient();
                object rawfile = new
                {
                    accesstoken = AccessTokenDetail,
                    userid = userIdDetail,
                    caseid = result
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/ShowMatterListByCaseId"), "POST", builders);
                ApiResponse response = JsonConvert.DeserializeObject<ApiResponse>(resid);
                List<FilterMatterListData> tableData = response.Data.Table;

                List<FinalResultForExport> finalData = new List<FinalResultForExport>();
                for (int i = 0; i < tableData.Count; i++)
                {
                    finalData.Add(new FinalResultForExport
                    {
                        Court = Convert.ToString(tableData[i].CourtName),
                        Matter_Name = Convert.ToString(tableData[i].VCaseName),
                        Case_No = Convert.ToString(tableData[i].VCaseNo).Replace("<br/>", "").Replace("<br><font size=1>(", "/").Replace("</font>", "").Replace("<br>", ""),
                        Status = Convert.ToString(tableData[i].VStatus),
                        Filing_Date = Convert.ToString(tableData[i].FilingDate),
                        Next_Hearing = Convert.ToString(tableData[i].VCauselistDate)
                    });
                }
                var trialList = (from ob in finalData
                                 select new
                                 {
                                     Court = ob.Court,
                                     Matter_Name = ob.Matter_Name,
                                     Case_No = ob.Case_No,
                                     Status = ob.Status,
                                     Filing_Date = ob.Filing_Date,
                                     Next_Hearing = ob.Next_Hearing
                                 }).ToList();
                var gv = new System.Web.UI.WebControls.GridView();
                string encodedFileName = Uri.EscapeDataString("Favour_Against_Desposed_Report");
                gv.DataSource = trialList;
                gv.DataBind();
                gv.HeaderStyle.BackColor = Color.Gray;
                gv.HeaderStyle.ForeColor = Color.White;
                Response.ClearContent();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", $"attachment; filename={encodedFileName}.xls");
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
            }
        }
        [AuthLog(Roles = "Firm,User")]
        public void ExportToExcelAllMatterListCourtWise(string vCourtval, string Year, string Monthid)
        {
            var db = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                string joineduser = "";
                var getuserdetails = db.usp_GetUserDetailByUserID(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).FirstOrDefault();
                if (IsCaseWatchUser == "1" || getuserdetails.IsAdminCW == 1)
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }
                var addfClient = new WebClient();
                object rawfile = new
                {
                    accesstoken = AccessTokenDetail,
                    userid = userIdDetail,
                    vCourtval = vCourtval,
                    Monthid = Monthid,
                    Year = Year
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/FilterMetterListCourtWiseData"), "POST", builders);
                ApiResponse response = JsonConvert.DeserializeObject<ApiResponse>(resid);
                List<FilterMatterListData> tableData = response.Data.Table;

                List<FinalResultForExport> finalData = new List<FinalResultForExport>();
                for (int i = 0; i < tableData.Count; i++)
                {
                    finalData.Add(new FinalResultForExport
                    {
                        Court = Convert.ToString(tableData[i].CourtName),
                        Matter_Name = Convert.ToString(tableData[i].VCaseName),
                        Case_No = Convert.ToString(tableData[i].VCaseNo).Replace("<br/>", "").Replace("<br><font size=1>(", "/").Replace("</font>", "").Replace("<br>", ""),
                        Status = Convert.ToString(tableData[i].VStatus),
                        Filing_Date = Convert.ToString(tableData[i].FilingDate),
                        Next_Hearing = Convert.ToString(tableData[i].VCauselistDate)
                    });
                }
                var trialList = (from ob in finalData
                                 select new
                                 {
                                     Court = ob.Court,
                                     Matter_Name = ob.Matter_Name,
                                     Case_No = ob.Case_No,
                                     Status = ob.Status,
                                     Filing_Date = ob.Filing_Date,
                                     Next_Hearing = ob.Next_Hearing
                                 }).ToList();
                var gv = new System.Web.UI.WebControls.GridView();
                string encodedFileName = Uri.EscapeDataString("Court_Wise_Pending_Cases_Report");
                gv.DataSource = trialList;
                gv.DataBind();
                gv.HeaderStyle.BackColor = Color.Gray;
                gv.HeaderStyle.ForeColor = Color.White;
                Response.ClearContent();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", $"attachment; filename={encodedFileName}.xls");
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
            }
        }

        [AuthLog(Roles = "Firm,User")]
        public void ExportToExcelAllMatterListZoneWise(string vCourtval, string Year, string Monthid, string flag, string courtType)
        {
            var db = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                string joineduser = "";
                var getuserdetails = db.usp_GetUserDetailByUserID(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).FirstOrDefault();
                if (IsCaseWatchUser == "1" || getuserdetails.IsAdminCW == 1)
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }
                var addfClient = new WebClient();
                object rawfile = new
                {
                    accesstoken = AccessTokenDetail,
                    userid = userIdDetail,
                    monthid = Monthid,
                    year = Year,
                    vCourtval = vCourtval,
                    flag = flag,
                    courtType = courtType
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/FilterMetterListZoneWiseData"), "POST", builders);
                ApiResponse response = JsonConvert.DeserializeObject<ApiResponse>(resid);
                List<FilterMatterListData> tableData = response.Data.Table;

                List<FinalResultForExport> finalData = new List<FinalResultForExport>();
                for (int i = 0; i < tableData.Count; i++)
                {
                    finalData.Add(new FinalResultForExport
                    {
                        Court = Convert.ToString(tableData[i].CourtName),
                        Matter_Name = Convert.ToString(tableData[i].VCaseName),
                        Case_No = Convert.ToString(tableData[i].VCaseNo).Replace("<br/>", "").Replace("<br><font size=1>(", "/").Replace("</font>", "").Replace("<br>", ""),
                        Status = Convert.ToString(tableData[i].VStatus),
                        Next_Hearing = Convert.ToString(tableData[i].VCauselistDate)
                    });
                }
                var trialList = (from ob in finalData
                                 select new
                                 {
                                     Court = ob.Court,
                                     Matter_Name = ob.Matter_Name,
                                     Case_No = ob.Case_No,
                                     Status = ob.Status,
                                     Next_Hearing = ob.Next_Hearing
                                 }).ToList();
                var gv = new System.Web.UI.WebControls.GridView();
                string encodedFileName = Uri.EscapeDataString("Categorisation_Of_Litigation_Cases_Report");
                gv.DataSource = trialList;
                gv.DataBind();
                gv.HeaderStyle.BackColor = Color.Gray;
                gv.HeaderStyle.ForeColor = Color.White;
                Response.ClearContent();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", $"attachment; filename={encodedFileName}.xls");
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
            }
        }

        [AuthLog(Roles = "Firm,User")]
        public void ExportToExcelAllMatterListStateWise(string vcourt, string monthid, string year, string like, string status, string courtType, string CourtName)
        {
            var db = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                string joineduser = "";
                var getuserdetails = db.usp_GetUserDetailByUserID(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).FirstOrDefault();
                if (IsCaseWatchUser == "1" || getuserdetails.IsAdminCW == 1)
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }
                var addfClient = new WebClient();
                object rawfile = new
                {
                    accesstoken = AccessTokenDetail,
                    userid = userIdDetail,
                    Courtid = vcourt,
                    monthid = monthid,
                    year = year,
                    statename = like,
                    Status = status,
                    courtType = courtType,
                    Courttitle = CourtName
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/FilterMetterListStateWiseData"), "POST", builders);
                ApiResponse response = JsonConvert.DeserializeObject<ApiResponse>(resid);
                List<FilterMatterListData> tableData = response.Data.Table;

                List<FinalResultForExport> finalData = new List<FinalResultForExport>();
                for (int i = 0; i < tableData.Count; i++)
                {
                    finalData.Add(new FinalResultForExport
                    {
                        Court = Convert.ToString(tableData[i].CourtName),
                        Matter_Name = Convert.ToString(tableData[i].VCaseName),
                        Case_No = Convert.ToString(tableData[i].VCaseNo).Replace("<br/>", "").Replace("<br><font size=1>(", "/").Replace("</font>", "").Replace("<br>", ""),
                        Status = Convert.ToString(tableData[i].VStatus),
                        Filing_Date = Convert.ToString(tableData[i].FilingDate),
                        Next_Hearing = Convert.ToString(tableData[i].VCauselistDate)
                    });
                }
                var trialList = (from ob in finalData
                                 select new
                                 {
                                     Court = ob.Court,
                                     Matter_Name = ob.Matter_Name,
                                     Case_No = ob.Case_No,
                                     Status = ob.Status,
                                     Filing_Date = ob.Filing_Date,
                                     Next_Hearing = ob.Next_Hearing
                                 }).ToList();
                var gv = new System.Web.UI.WebControls.GridView();
                string encodedFileName = Uri.EscapeDataString("Statewise_Break_Up_Case_Reports");
                gv.DataSource = trialList;
                gv.DataBind();
                gv.HeaderStyle.BackColor = Color.Gray;
                gv.HeaderStyle.ForeColor = Color.White;
                Response.ClearContent();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", $"attachment; filename={encodedFileName}.xls");
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
            }
        }


        [AuthLog(Roles = "Firm,User")]
        public void ExportToExcelAllMatterListStConsolated(string Courtid, string Monthid, string Year, string Courttype)
        {
            var db = new LawPracticeEntities();
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                string joineduser = "";
                var getuserdetails = db.usp_GetUserDetailByUserID(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).FirstOrDefault();
                if (IsCaseWatchUser == "1" || getuserdetails.IsAdminCW == 1)
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }
                var addfClient = new WebClient();
                object rawfile = new
                {
                    accesstoken = AccessTokenDetail,
                    userid = userIdDetail,
                    Courtid = Courtid,
                    Monthid = Monthid,
                    Year = Year,
                    Courttype = Courttype
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/FilterMetterListAllCourtData"), "POST", builders);
                ApiResponse response = JsonConvert.DeserializeObject<ApiResponse>(resid);
                List<FilterMatterListData> tableData = response.Data.Table;

                List<FinalResultForExport> finalData = new List<FinalResultForExport>();
                for (int i = 0; i < tableData.Count; i++)
                {
                    finalData.Add(new FinalResultForExport
                    {
                        Court = Convert.ToString(tableData[i].CourtName),
                        Matter_Name = Convert.ToString(tableData[i].VCaseName),
                        Case_No = Convert.ToString(tableData[i].VCaseNo).Replace("<br/>", "").Replace("<br><font size=1>(", "/").Replace("</font>", "").Replace("<br>", ""),
                        Status = Convert.ToString(tableData[i].VStatus),
                        Filing_Date = Convert.ToString(tableData[i].FilingDate),
                        Next_Hearing = Convert.ToString(tableData[i].VCauselistDate)
                    });
                }
                var trialList = (from ob in finalData
                                 select new
                                 {
                                     Court = ob.Court,
                                     Matter_Name = ob.Matter_Name,

                                     Case_No = ob.Case_No,

                                     Status = ob.Status,
                                     Filing_Date = ob.Filing_Date,
                                     Next_Hearing = ob.Next_Hearing
                                 }).ToList();
                var gv = new System.Web.UI.WebControls.GridView();
                string encodedFileName = Uri.EscapeDataString("Case_Report_For_All_Court");
                gv.DataSource = trialList;
                gv.DataBind();
                gv.HeaderStyle.BackColor = Color.Gray;
                gv.HeaderStyle.ForeColor = Color.White;
                Response.ClearContent();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", $"attachment; filename={encodedFileName}.xls");
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
            }
        }
        [AuthLog(Roles = "Firm,User")]
        public void ExportToExcelAllMatterListSebiSuccess(string flag, string year, string monthid)
        {
            var db = new LawPracticeEntities();
            try
            {
                var result = DataAccessADO.Sp_GetUserCaseId(LoggedInUser.FirmId.ToString(), flag, monthid, year);

                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "", firmId = "";
                userId = strusername + LoggedInUser.UserId.ToString();
                firmId = LoggedInUser.FirmId.ToString();
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                string joineduser = "";
                var getuserdetails = db.usp_GetUserDetailByUserID(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).FirstOrDefault();
                if (IsCaseWatchUser == "1" || getuserdetails.IsAdminCW == 1)
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }
                var addfClient = new WebClient();
                object rawfile = new
                {
                    accesstoken = AccessTokenDetail,
                    userid = userIdDetail,
                    caseid = result
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/ShowMatterListByCaseId"), "POST", builders);
                ApiResponse response = JsonConvert.DeserializeObject<ApiResponse>(resid);
                List<FilterMatterListData> tableData = response.Data.Table;

                List<FinalResultForExport> finalData = new List<FinalResultForExport>();
                for (int i = 0; i < tableData.Count; i++)
                {
                    finalData.Add(new FinalResultForExport
                    {
                        Court = Convert.ToString(tableData[i].CourtName),
                        Matter_Name = Convert.ToString(tableData[i].VCaseName),
                        Case_No = Convert.ToString(tableData[i].VCaseNo).Replace("<br/>", "").Replace("<br><font size=1>(", "/").Replace("</font>", "").Replace("<br>", ""),
                        Status = Convert.ToString(tableData[i].VStatus),
                        Filing_Date = Convert.ToString(tableData[i].FilingDate),
                        Next_Hearing = Convert.ToString(tableData[i].VCauselistDate)
                    });
                }
                var trialList = (from ob in finalData
                                 select new
                                 {
                                     Court = ob.Court,
                                     Matter_Name = ob.Matter_Name,

                                     Case_No = ob.Case_No,

                                     Status = ob.Status,
                                     Filing_Date = ob.Filing_Date,
                                     Next_Hearing = ob.Next_Hearing
                                 }).ToList();
                var gv = new System.Web.UI.WebControls.GridView();
                string encodedFileName = Uri.EscapeDataString("Sebi_Success_Rate_Report");
                gv.DataSource = trialList;
                gv.DataBind();
                gv.HeaderStyle.BackColor = Color.Gray;
                gv.HeaderStyle.ForeColor = Color.White;
                Response.ClearContent();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", $"attachment; filename={encodedFileName}.xls");
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
            }
        }





        //Download Pdf
        [FirmControllerAuthorization]
        public void NextHearingDownLoadCalanderPDF()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var statusResult = "";
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string joined = "";
                var db = new LawPracticeEntities();
                joined = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                string userId = "", firmId = "", Isreracort = "";
                userId = strusername + Convert.ToString(LoggedInUser.UserId);
                firmId = Convert.ToString(LoggedInUser.FirmId);
                string date = Convert.ToString(HttpContext.Request.QueryString["date"]);
                date = System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String(date));
                string cols = QueryAES.UrlDecode(HttpContext.Request.QueryString["cols"]);

                //For CWLive User Login
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string AdminuserIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (!String.IsNullOrEmpty(IsCaseWatchUser))
                {
                    if (IsCaseWatchUser == "1")
                    {
                        userIdDetail = LoggedInUser.UserName.ToString();
                        AccessTokenDetail = "internal";
                        AdminuserIdDetail = LoggedInUser.UserName.ToString();
                    }
                    else
                    {
                        AccessTokenDetail = "mykase123456789abcdef";
                        userIdDetail = joined;
                        AdminuserIdDetail = userId;
                    }
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = joined;
                    AdminuserIdDetail = userId;
                }
                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    UserId = userIdDetail,
                    Date = date,
                    mailto = "",
                    loginuserid = AdminuserIdDetail,
                    courttype = cols,
                    iflag = 1

                };
                addfClient.Encoding = System.Text.Encoding.UTF8;
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/NextHearingDownLoadDailyPDFAndSendEmail"), "POST", builders);
                var param = apiUrl + "CWController=>NextHearingDownLoadPDF=>/API/Search/NextHearingDownLoadPDF" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic data = JObject.Parse(resid);
                var downloadpath1 = data.data;
                try
                {
                    System.Net.WebClient webClient = new System.Net.WebClient();
                    string url = downloadpath1;
                    byte[] bytes = webClient.DownloadData(url);
                    string fileName = url.Split('/').Last();
                    Response.ContentType = "application/octet-stream";
                    Response.AppendHeader("Content-Disposition", "attachment; filename=" + fileName);
                    Response.BinaryWrite(bytes);
                    Response.End();
                }
                catch { }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
            }
        }



        //NextHearingSendPdf
        [FirmControllerAuthorization]
        public ActionResult NextHearingSendCalanderPDFMail()
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var statusResult = "";
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string joined = "";
                var db = new LawPracticeEntities();
                joined = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                string userId = "", firmId = "", cols = "";
                userId = strusername + Convert.ToString(LoggedInUser.UserId);
                firmId = Convert.ToString(LoggedInUser.FirmId);
                string email = Convert.ToString(QueryAES.UrlDecode(Request.Form["email"]));
                string date = Convert.ToString(QueryAES.UrlDecode(Request.Form["date"]));
                date = System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String(date));
                cols = QueryAES.UrlDecode(Request.Form["cols"]);

                //For CWLive User Login
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string AdminuserIdDetail = string.Empty;
                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (!String.IsNullOrEmpty(IsCaseWatchUser))
                {
                    if (IsCaseWatchUser == "1")
                    {
                        userIdDetail = LoggedInUser.UserName.ToString();
                        AccessTokenDetail = "internal";
                        AdminuserIdDetail = LoggedInUser.UserName.ToString();
                    }
                    else
                    {
                        AccessTokenDetail = "mykase123456789abcdef";
                        userIdDetail = joined;
                        AdminuserIdDetail = userId;
                    }
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = joined;
                    AdminuserIdDetail = userId;
                }
                var addfClient = new WebClient();



                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    UserId = userIdDetail,
                    Date = date,
                    mailto = email,
                    loginuserid = AdminuserIdDetail,
                    courttype = cols,
                    iflag = 0
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/NextHearingDownLoadDailyPDFAndSendEmail"), "POST", builders);
                var param = apiUrl + "CWController=>NextHearingSendPDFMail=>/API/Search/NextHearingDownLoadDailyPDFAndSendEmail" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");
                dynamic data = JObject.Parse(resid);
                statusResult = data.Status;
                return Json(statusResult, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
		
		/// <summary>
        /// Get Alert On-Off User List
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult GetAlertOnOffUserList(List<string> userIds)
        {
            var db1 = new LawPracticeEntities();

            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                //userid = Request.QueryString["userid"];
                string userId = strusername + LoggedInUser.UserId.ToString();
                string firmId = LoggedInUser.FirmId.ToString();

                string AccessTokenDetail = "";
                string userIdDetail = "";

                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();

                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userId;
                }

                //string finalUserIds = "";

                string finalUserIds = string.Join(",", userIds.Select(x => "MyKase_" + x.Trim()));

                var addfClient = new WebClient();

                object rawfile = new
                {
                    Accesstoken = "internal",
                    UserId = finalUserIds
                };

                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");

                string builders = JsonConvert.SerializeObject(rawfile);

                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

                string resid = addfClient.UploadString(
                    new Uri(apiUrl + "/API/Search/CaseAlertOnOFFUserList"),
                    "POST",
                    builders
                );

                var param = apiUrl + "CWController=>GetCaseOrderNotes=>/API/Search/CaseAlertOnOFFUserList@" + builders;

                db1.usp_AddAudit(
                    Convert.ToInt32(EventType.Case),
                    Convert.ToInt32(Severity.High),
                    Convert.ToInt32(REQUEST_TYPE.API),
                    Convert.ToString(EventType.Case),
                    Convert.ToString(Severity.High),
                    Convert.ToString(REQUEST_TYPE.API),
                    Guid.Parse(Session["sessionuserid"].ToString()),
                    param,
                    AuditData.myIP(),
                    AuditData.GetMacAddress().ToString(),
                    0,
                    ""
                );

                JObject jObject = JObject.Parse(resid);

                bool status = Convert.ToBoolean(jObject["Status"]);

                if (status)
                {
                    var data = jObject["data"].ToObject<List<Dictionary<string, object>>>();
                    return Json(data, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { Status = false, Message = jObject["Message"] }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(
                    Convert.ToInt32(EventType.Firm),
                    Convert.ToInt32(Severity.High),
                    Convert.ToInt32(REQUEST_TYPE.API),
                    Convert.ToString(EventType.Firm),
                    Convert.ToString(Severity.High),
                    Convert.ToString(REQUEST_TYPE.API),
                    null,
                    "Message=" + ex.Message +
                    "@Inner Exception=" + ex.InnerException +
                    "@Stack Trace=" + ex.StackTrace,
                    AuditData.myIP(),
                    AuditData.GetMacAddress().ToString(),
                    1,
                    ""
                );

                return Json(new { Status = false, Message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        // BOM Customization - Custom Lists 
        [FirmControllerAuthorization]
        public JsonResult GetConsumerCases(
    string caseNo = "",
    string caseId = "",
    string courtDetail = "",
    string placeOfCourt = "",
    string zone = "",
    string branch = "",
    string presentStatus = "",

    string nextHearingDateFrom = "",
    string nextHearingDateTo = "",

    string disposalDateFrom = "",
    string disposalDateTo = "",

    string filingDateFrom = "",
    string filingDateTo = "",

    string firstSummonDateFrom = "",
    string firstSummonDateTo = "",

    string firstSummonReceivedDateFrom = "",
    string firstSummonReceivedDateTo = "",

    string writtenStatementDateFrom = "",
    string writtenStatementDateTo = "",

    string interimOrderDateFrom = "",
    string interimOrderDateTo = "",

    string interimOrderReceivedDateFrom = "",
    string interimOrderReceivedDateTo = "",

    string finalOrderReceivedDateFrom = "",
    string finalOrderReceivedDateTo = "",
    string caseIdDetail = "",

    int pageNumber = 1,
    int pageSize = 10
)
        {
            var FirmId = LoggedInUser.FirmId.ToString();
            DataSet ds = DataAccessADO.GetConsumerCases(caseIdDetail,
                caseNo,
                caseId,
                courtDetail,
                placeOfCourt,
                zone,
                branch,
                presentStatus,

                nextHearingDateFrom,
                nextHearingDateTo,

                disposalDateFrom,
                disposalDateTo,

                filingDateFrom,
                filingDateTo,

                firstSummonDateFrom,
                firstSummonDateTo,

                firstSummonReceivedDateFrom,
                firstSummonReceivedDateTo,

                writtenStatementDateFrom,
                writtenStatementDateTo,

                interimOrderDateFrom,
                interimOrderDateTo,

                interimOrderReceivedDateFrom,
                interimOrderReceivedDateTo,

                finalOrderReceivedDateFrom,
                finalOrderReceivedDateTo,

                pageNumber,
                pageSize, FirmId
            );

            DataTable dtData = ds.Tables[0];
            DataTable dtPagination = ds.Tables[1];

            var data = dtData.AsEnumerable()
                .Select(row => dtData.Columns
                    .Cast<DataColumn>()
                    .ToDictionary(
                        col => col.ColumnName,
                        col => row[col]
                    ))
                .ToList();

            var result = new
            {
                Data = data,
                TotalRecords = dtPagination.Rows.Count > 0
                    ? Convert.ToInt32(dtPagination.Rows[0]["TotalRecords"])
                    : 0,

                TotalPages = dtPagination.Rows.Count > 0
                    ? Convert.ToInt32(dtPagination.Rows[0]["TotalPages"])
                    : 0,

                CurrentPage = dtPagination.Rows.Count > 0
                    ? Convert.ToInt32(dtPagination.Rows[0]["CurrentPage"])
                    : pageNumber,

                PageSize = dtPagination.Rows.Count > 0
                    ? Convert.ToInt32(dtPagination.Rows[0]["PageSize"])
                    : pageSize
            };

            var jsonResult = Json(result, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;

            return jsonResult;
        }
        [FirmControllerAuthorization]
        public JsonResult GetAgainstBank(
        string caseNo = "",
        string caseId = "",
        string courtDetail = "",
        string placeOfCourt = "",
        string zone = "",
        string branch = "",
        string presentStatus = "",
        string caseIdDetail = "",
        DateTime? nextHearingDateFrom = null,
        DateTime? nextHearingDateTo = null,

        DateTime? disposalDateFrom = null,
        DateTime? disposalDateTo = null,

        DateTime? finalOrderReceivedDateFrom = null,
        DateTime? finalOrderReceivedDateTo = null,

        DateTime? interimOrderDateFrom = null,
        DateTime? interimOrderDateTo = null,

        DateTime? interimOrderReceivedDateFrom = null,
        DateTime? interimOrderReceivedDateTo = null,

        int pageNumber = 1,
        int pageSize = 10
    )
        {
            var FirmId = LoggedInUser.FirmId.ToString();
            DataSet ds = DataAccessADO.GetAgainstBank(
                caseIdDetail,
                caseNo,
                caseId,
                courtDetail,
                placeOfCourt,
                zone,
                branch,
                presentStatus,

                nextHearingDateFrom,
                nextHearingDateTo,

                disposalDateFrom,
                disposalDateTo,

                finalOrderReceivedDateFrom,
                finalOrderReceivedDateTo,

                interimOrderDateFrom,
                interimOrderDateTo,

                interimOrderReceivedDateFrom,
                interimOrderReceivedDateTo,

                pageNumber,
                pageSize,
                FirmId
            );

            DataTable dtData = ds.Tables[0];
            DataTable dtPaging = ds.Tables[1];

            var records = dtData.AsEnumerable()
                .Select(row => dtData.Columns
                    .Cast<DataColumn>()
                    .ToDictionary(
                        col => col.ColumnName,
                        col => row[col]
                    ))
                .ToList();

            var result = new
            {
                Data = records,
                TotalRecords = Convert.ToInt32(dtPaging.Rows[0]["TotalRecords"]),
                TotalPages = Convert.ToInt32(dtPaging.Rows[0]["TotalPages"]),
                CurrentPage = Convert.ToInt32(dtPaging.Rows[0]["CurrentPage"]),
                PageSize = Convert.ToInt32(dtPaging.Rows[0]["PageSize"])
            };

            var jsonResult = Json(result, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;

            return jsonResult;
        }
        [FirmControllerAuthorization]
        public JsonResult GetContingentLiability(
    string caseNo = "",
    string caseId = "",
    string courtDetail = "",
    string placeOfCourt = "",
    string nextHearingDateFrom = "",
    string nextHearingDateTo = "",
    string dateOfClaimFrom = "",
    string dateOfClaimTo = "",
    string caseIdDetail = "",
    int pageNumber = 1,
    int pageSize = 10

)
        {
            var FirmId = LoggedInUser.FirmId.ToString();
            DataSet ds = DataAccessADO.GetContingentLiability(
                caseIdDetail,
                FirmId,
                caseNo,
                caseId,
                courtDetail,
                placeOfCourt,
                nextHearingDateFrom,
                nextHearingDateTo,
                dateOfClaimFrom,
                dateOfClaimTo,
                pageNumber,
                pageSize

            );

            DataTable dt = ds.Tables[0];
            DataTable dtPaging = ds.Tables[1];

            var data = dt.AsEnumerable()
                .Select(row => dt.Columns
                .Cast<DataColumn>()
                .ToDictionary(
                    col => col.ColumnName,
                    col => row[col]
                ))
                .ToList();

            return Json(new
            {
                Data = data,
                TotalRecords = dtPaging.Rows.Count > 0
                    ? Convert.ToInt32(dtPaging.Rows[0]["TotalRecords"])
                    : 0,

                TotalPages = dtPaging.Rows.Count > 0
                    ? Convert.ToInt32(dtPaging.Rows[0]["TotalPages"])
                    : 0,

                CurrentPage = dtPaging.Rows.Count > 0
                    ? Convert.ToInt32(dtPaging.Rows[0]["CurrentPage"])
                    : pageNumber,

                PageSize = dtPaging.Rows.Count > 0
                    ? Convert.ToInt32(dtPaging.Rows[0]["PageSize"])
                    : pageSize
            }, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        [AuthLog(Roles = "Firm,User")]
        public JsonResult SaveAgainstBank()
        {
            try
            {
                var body = new StreamReader(Request.InputStream).ReadToEnd();
                var input = JsonConvert.DeserializeObject<AgainstBankModel>(body);

                DataAccessADO.UpsertAgainstBank(input);

                return Json(new { success = true, message = "Saved successfully." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        //[AuthLog(Roles = "Firm,User")]
        //public JsonResult MatterNameDetails()
        //{
        //    try
        //    {
        //        var FirmId = Convert.ToString(LoggedInUser.FirmId);
        //        DataTable dt = DataAccessADO.Usp_GetMatterNameWithId(FirmId);

        //        var data = dt.AsEnumerable().Select(row => dt.Columns.Cast<DataColumn>().ToDictionary(col => col.ColumnName, col => row[col]));

        //        return Json(new {success = true, data = data }, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception ex)
        //    {
        //        return Json(new {success = false,message = ex.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        [AuthLog(Roles = "Firm,User")]
        public JsonResult MatterNameDetails(string term)
        {
            try
            {
                var firmId = Convert.ToString(LoggedInUser.FirmId);
                var term1 = Convert.ToString(HttpContext.Request.QueryString["term"]);
                DataTable dt = DataAccessADO.Usp_GetMatterNameWithId(firmId, term);

                var result = dt.AsEnumerable()
                    .Select(r => new
                    {
                        label = r["MatterName"].ToString(),
                        value = r["MatterName"].ToString(),
                        id = r["Id"].ToString(),
                        NextHearingDate = r["Nexthearingdate"].ToString(),
                        vStatus = r["VStatus"].ToString(),
                        mtrno = r["mtrno"].ToString(),
                        courtName = r["CourtName"].ToString()
                    })
                    .ToList();

                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new List<object>(), JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult SaveConsumerCases()
        {
            try
            {
                var body = new StreamReader(Request.InputStream).ReadToEnd();
                var input = JsonConvert.DeserializeObject<ConsumerCasesModel>(body);

                DataAccessADO.UpsertConsumerCases(input);

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult SaveContingentLiability()
        {
            try
            {
                var body = new StreamReader(Request.InputStream).ReadToEnd();
                var input = JsonConvert.DeserializeObject<ContingentLiabilityModel>(body);

                DataAccessADO.UpsertContingentLiability(input);

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [AuthLog(Roles = "Firm,User")]
        public void ExportToExcelAgainstBankBOM()
        {
            var db1 = new LawPracticeEntities();

            try
            {
                string exlfilename =
                    "AgainstBankCases_" +
                    DateTime.Now.ToString("ddMMyyyyHHmmss");

                // ================= GET QUERY PARAMS =================

                var CaseNo = Convert.ToString(
                    QueryAES.UrlDecode(Request.QueryString["CaseNo"])
                );

                var CaseId = Convert.ToString(
                    QueryAES.UrlDecode(Request.QueryString["CaseId"])
                );

                var Zone = Convert.ToString(
                    QueryAES.UrlDecode(Request.QueryString["Zone"])
                );

                var Branch = Convert.ToString(
                    QueryAES.UrlDecode(Request.QueryString["Branch"])
                );

                var AccountHolderName = Convert.ToString(
                    QueryAES.UrlDecode(Request.QueryString["AccountHolderName"])
                );

                var ClaimantAddress = Convert.ToString(
                    QueryAES.UrlDecode(Request.QueryString["ClaimantAddress"])
                );

                var CIFNo = Convert.ToString(
                    QueryAES.UrlDecode(Request.QueryString["CIFNo"])
                );

                var AccountNo = Convert.ToString(
                    QueryAES.UrlDecode(Request.QueryString["AccountNo"])
                );

                var FirstSummonDate = Convert.ToString(
                    QueryAES.UrlDecode(Request.QueryString["FirstSummonDate"])
                );

                var FirstSummonReceivedDate = Convert.ToString(
                    QueryAES.UrlDecode(Request.QueryString["FirstSummonReceivedDate"])
                );

                var RespondentDetails = Convert.ToString(
                    QueryAES.UrlDecode(Request.QueryString["RespondentDetails"])
                );

                var ProformaParties = Convert.ToString(
                    QueryAES.UrlDecode(Request.QueryString["ProformaParties"])
                );

                var CaseProposing = Convert.ToString(
                    QueryAES.UrlDecode(Request.QueryString["CaseProposing"])
                );

                var CaseType = Convert.ToString(
                    QueryAES.UrlDecode(Request.QueryString["CaseType"])
                );

                var Department = Convert.ToString(
                    QueryAES.UrlDecode(Request.QueryString["Department"])
                );

                var CourtDetail = Convert.ToString(
                    QueryAES.UrlDecode(Request.QueryString["CourtDetail"])
                );

                var PlaceOfCourt = Convert.ToString(
                    QueryAES.UrlDecode(Request.QueryString["PlaceOfCourt"])
                );

                var AreaOfComplaint = Convert.ToString(
                    QueryAES.UrlDecode(Request.QueryString["AreaOfComplaint"])
                );

                var WrittenStatementDate = Convert.ToString(
                    QueryAES.UrlDecode(Request.QueryString["WrittenStatementDate"])
                );

                var FactsOfCase = Convert.ToString(
                    QueryAES.UrlDecode(Request.QueryString["FactsOfCase"])
                );

                var ClaimAmount = Convert.ToString(
                    QueryAES.UrlDecode(Request.QueryString["ClaimAmount"])
                );

                var AdvocateName = Convert.ToString(
                    QueryAES.UrlDecode(Request.QueryString["AdvocateName"])
                );

                var AdvocateContact = Convert.ToString(
                    QueryAES.UrlDecode(Request.QueryString["AdvocateContact"])
                );

                var PresentStatus = Convert.ToString(
                    QueryAES.UrlDecode(Request.QueryString["PresentStatus"])
                );

                var NextHearingDate = Convert.ToString(
                    QueryAES.UrlDecode(Request.QueryString["NextHearingDate"])
                );

                var NextHearingPurpose = Convert.ToString(
                    QueryAES.UrlDecode(Request.QueryString["NextHearingPurpose"])
                );

                var InterimOrderDate = Convert.ToString(
                    QueryAES.UrlDecode(Request.QueryString["InterimOrderDate"])
                );

                var InterimOrderReceivedDate = Convert.ToString(
                    QueryAES.UrlDecode(Request.QueryString["InterimOrderReceivedDate"])
                );

                var InterimDirection = Convert.ToString(
                    QueryAES.UrlDecode(Request.QueryString["InterimDirection"])
                );

                var InterimComplianceStatus = Convert.ToString(
                    QueryAES.UrlDecode(Request.QueryString["InterimComplianceStatus"])
                );

                var InterimRemarks = Convert.ToString(
                    QueryAES.UrlDecode(Request.QueryString["InterimRemarks"])
                );

                var DisposalDate = Convert.ToString(
                    QueryAES.UrlDecode(Request.QueryString["DisposalDate"])
                );

                var FinalOrderReceivedDate = Convert.ToString(
                    QueryAES.UrlDecode(Request.QueryString["FinalOrderReceivedDate"])
                );

                var AwardAmount = Convert.ToString(
                    QueryAES.UrlDecode(Request.QueryString["AwardAmount"])
                );

                var FinalDirection = Convert.ToString(
                    QueryAES.UrlDecode(Request.QueryString["FinalDirection"])
                );

                var FinalComplianceStatus = Convert.ToString(
                    QueryAES.UrlDecode(Request.QueryString["FinalComplianceStatus"])
                );

                var FinalRemarks = Convert.ToString(
                    QueryAES.UrlDecode(Request.QueryString["FinalRemarks"])
                );

                // ================= GET DATA =================

                DataTable dt = DataAccessADO.GetAgainstBankData(
                    CaseNo,
                    CaseId,
                    Zone,
                    Branch,
                    AccountHolderName,
                    ClaimantAddress,
                    CIFNo,
                    AccountNo,
                    FirstSummonDate,
                    FirstSummonReceivedDate,
                    RespondentDetails,
                    ProformaParties,
                    CaseProposing,
                    CaseType,
                    Department,
                    CourtDetail,
                    PlaceOfCourt,
                    AreaOfComplaint,
                    WrittenStatementDate,
                    FactsOfCase,
                    ClaimAmount,
                    AdvocateName,
                    AdvocateContact,
                    PresentStatus,
                    NextHearingDate,
                    NextHearingPurpose,
                    InterimOrderDate,
                    InterimOrderReceivedDate,
                    InterimDirection,
                    InterimComplianceStatus,
                    InterimRemarks,
                    DisposalDate,
                    FinalOrderReceivedDate,
                    AwardAmount,
                    FinalDirection,
                    FinalComplianceStatus,
                    FinalRemarks
                );

                // ================= EXPORT FORMAT =================

                var exportList =
                    (from DataRow row in dt.Rows
                     select new
                     {
                         CaseId = Convert.ToString(row["CaseId"]),
                         CaseNo = Convert.ToString(row["CaseNo"]),
                         Zone = Convert.ToString(row["Zone"]),
                         Branch = Convert.ToString(row["Branch"]),
                         AccountHolderName = Convert.ToString(row["AccountHolderName"]),
                         ClaimantAddress = Convert.ToString(row["ClaimantAddress"]),
                         CIFNo = Convert.ToString(row["CIFNo"]),
                         AccountNo = Convert.ToString(row["AccountNo"]),

                         FirstSummonDate =
                            row["FirstSummonDate"] == DBNull.Value
                            ? ""
                            : Convert.ToDateTime(
                                row["FirstSummonDate"]
                            ).ToString("dd/MM/yyyy"),

                         FirstSummonReceivedDate =
                            row["FirstSummonReceivedDate"] == DBNull.Value
                            ? ""
                            : Convert.ToDateTime(
                                row["FirstSummonReceivedDate"]
                            ).ToString("dd/MM/yyyy"),

                         RespondentDetails =
                            Convert.ToString(row["RespondentDetails"]),

                         ProformaParties =
                            Convert.ToString(row["ProformaParties"]),

                         CaseProposing =
                            Convert.ToString(row["CaseProposing"]),

                         CaseType =
                            Convert.ToString(row["CaseType"]),

                         Department =
                            Convert.ToString(row["Department"]),

                         CourtDetail =
                            Convert.ToString(row["CourtDetail"]),

                         PlaceOfCourt =
                            Convert.ToString(row["PlaceOfCourt"]),

                         AreaOfComplaint =
                            Convert.ToString(row["AreaOfComplaint"]),

                         WrittenStatementDate =
                            row["WrittenStatementDate"] == DBNull.Value
                            ? ""
                            : Convert.ToDateTime(
                                row["WrittenStatementDate"]
                            ).ToString("dd/MM/yyyy"),

                         FactsOfCase =
                            Convert.ToString(row["FactsOfCase"]),

                         ClaimAmount =
                            Convert.ToString(row["ClaimAmount"]),

                         AdvocateName =
                            Convert.ToString(row["AdvocateName"]),

                         AdvocateContact =
                            Convert.ToString(row["AdvocateContact"]),

                         PresentStatus =
                            Convert.ToString(row["PresentStatus"]),

                         NextHearingDate =
                            row["NextHearingDate"] == DBNull.Value
                            ? ""
                            : Convert.ToDateTime(
                                row["NextHearingDate"]
                            ).ToString("dd/MM/yyyy"),

                         NextHearingPurpose =
                            Convert.ToString(row["NextHearingPurpose"]),

                         InterimOrderDate =
                            row["InterimOrderDate"] == DBNull.Value
                            ? ""
                            : Convert.ToDateTime(
                                row["InterimOrderDate"]
                            ).ToString("dd/MM/yyyy"),

                         InterimOrderReceivedDate =
                            row["InterimOrderReceivedDate"] == DBNull.Value
                            ? ""
                            : Convert.ToDateTime(
                                row["InterimOrderReceivedDate"]
                            ).ToString("dd/MM/yyyy"),

                         InterimDirection =
                            Convert.ToString(row["InterimDirection"]),

                         InterimComplianceStatus =
                            Convert.ToString(row["InterimComplianceStatus"]),

                         InterimRemarks =
                            Convert.ToString(row["InterimRemarks"]),

                         DisposalDate =
                            row["DisposalDate"] == DBNull.Value
                            ? ""
                            : Convert.ToDateTime(
                                row["DisposalDate"]
                            ).ToString("dd/MM/yyyy"),

                         FinalOrderReceivedDate =
                            row["FinalOrderReceivedDate"] == DBNull.Value
                            ? ""
                            : Convert.ToDateTime(
                                row["FinalOrderReceivedDate"]
                            ).ToString("dd/MM/yyyy"),

                         AwardAmount =
                            Convert.ToString(row["AwardAmount"]),

                         FinalDirection =
                            Convert.ToString(row["FinalDirection"]),

                         FinalComplianceStatus =
                            Convert.ToString(row["FinalComplianceStatus"]),

                         FinalRemarks =
                            Convert.ToString(row["FinalRemarks"])
                     }).ToList();

                // ================= GRID =================

                GridView gv = new GridView();

                gv.DataSource = exportList;
                gv.DataBind();

                // ================= STYLING =================

                gv.HeaderStyle.BackColor = Color.FromArgb(31, 78, 121);
                gv.HeaderStyle.ForeColor = Color.White;
                gv.HeaderStyle.Font.Bold = true;

                gv.RowStyle.BackColor = Color.White;

                gv.AlternatingRowStyle.BackColor =
                    Color.FromArgb(242, 242, 242);

                gv.BorderStyle = BorderStyle.Solid;
                gv.BorderWidth = Unit.Pixel(1);
                gv.GridLines = GridLines.Both;

                gv.Font.Name = "Calibri";
                gv.Font.Size = FontUnit.Point(10);

                gv.CellPadding = 8;

                // ================= HEADER STYLE =================

                foreach (TableCell cell in gv.HeaderRow.Cells)
                {
                    cell.HorizontalAlign = HorizontalAlign.Center;
                    cell.VerticalAlign = VerticalAlign.Middle;

                    cell.Style["padding"] = "10px";
                    cell.Style["border"] = "1px solid #d9d9d9";
                    cell.Style["white-space"] = "normal";
                }

                // ================= ROW STYLE =================

                foreach (GridViewRow row in gv.Rows)
                {
                    foreach (TableCell cell in row.Cells)
                    {
                        cell.Style["border"] = "1px solid #d9d9d9";
                        cell.Style["padding"] = "8px";
                        cell.VerticalAlign = VerticalAlign.Top;
                    }
                }

                // ================= RESPONSE =================

                Response.ClearContent();
                Response.Buffer = true;

                Response.AddHeader(
                    "content-disposition",
                    "attachment; filename=" +
                    exlfilename + ".xls"
                );

                Response.ContentType = "application/ms-excel";
                Response.Charset = "";

                // ================= EXCEL STYLE =================

                StringWriter sw = new StringWriter();

                sw.Write(@"
        <style>

        table {
            border-collapse: collapse;
            width: 100%;
            font-family: Calibri;
            font-size: 10pt;
        }

        th {
            background-color: #1F4E79;
            color: white;
            font-weight: bold;
            text-align: center;
            padding: 10px;
            border: 1px solid #d9d9d9;
        }

        td {
            border: 1px solid #d9d9d9;
            padding: 8px;
            vertical-align: top;
        }

        tr:nth-child(even) {
            background-color: #f2f2f2;
        }

        </style>
        ");

                HtmlTextWriter htw = new HtmlTextWriter(sw);

                gv.RenderControl(htw);

                Response.Output.Write(sw.ToString());

                Response.Flush();
                Response.End();
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(
                    Convert.ToInt32(EventType.Firm),
                    Convert.ToInt32(Severity.High),
                    Convert.ToInt32(REQUEST_TYPE.API),
                    Convert.ToString(EventType.Firm),
                    Convert.ToString(Severity.High),
                    Convert.ToString(REQUEST_TYPE.API),
                    null,
                    "Message=" + ex.Message +
                    "@Inner Exception=" + ex.InnerException +
                    "@Stack Trace=" + ex.StackTrace,
                    AuditData.myIP(),
                    AuditData.GetMacAddress().ToString(),
                    1,
                    ""
                );

                Response.Redirect("/home/Error");
            }
        }

        [AuthLog(Roles = "Firm,User")]
        public void ExportToExcelConsumerCasesBOM()
        {
            try
            {
                string exlfilename = "ConsumerCases_" +
                                     DateTime.Now.ToString("ddMMyyyyHHmmss");

                string CaseNo = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["CaseNo"]));
                string CaseId = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["CaseId"]));

                string Zone = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["Zone"]));
                string Branch = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["Branch"]));

                string PetitionerName = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["PetitionerName"]));

                string CIFNo = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["CIFNo"]));
                string AccountNo = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["AccountNo"]));

                string FirstSummonDate = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["FirstSummonDate"]));
                string FirstSummonReceivedDate = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["FirstSummonReceivedDate"]));

                string RespondentDetails = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["RespondentDetails"]));

                string FilingDate = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["FilingDate"]));
                string PresentStatus = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["PresentStatus"]));

                string CourtDetail = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["CourtDetail"]));
                string PlaceOfCourt = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["PlaceOfCourt"]));

                string ClaimAmount = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["ClaimAmount"]));
                string CaseType = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["CaseType"]));

                string AreaOfComplaint = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["AreaOfComplaint"]));
                string FactsOfCase = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["FactsOfCase"]));

                string WrittenStatementDate = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["WrittenStatementDate"]));

                string NextHearingDate = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["NextHearingDate"]));
                string NextHearingPurpose = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["NextHearingPurpose"]));

                string InterimOrderDate = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["InterimOrderDate"]));
                string InterimOrderReceivedDate = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["InterimOrderReceivedDate"]));

                string InterimDirection = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["InterimDirection"]));
                string InterimComplianceStatus = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["InterimComplianceStatus"]));
                string InterimRemarks = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["InterimRemarks"]));

                string DisposalDate = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["DisposalDate"]));
                string FinalOrderReceivedDate = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["FinalOrderReceivedDate"]));

                string AwardAmount = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["AwardAmount"]));

                string FinalDirection = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["FinalDirection"]));
                string FinalComplianceStatus = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["FinalComplianceStatus"]));
                string FinalRemarks = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["FinalRemarks"]));

                string AdvocateName = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["AdvocateName"]));
                string AdvocateContact = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["AdvocateContact"]));

                DataTable dt = DataAccessADO.ExportToExcelConsumerCasesBOM(
                    CaseNo, CaseId, Zone, Branch, PetitionerName,
                    CIFNo, AccountNo, FirstSummonDate, FirstSummonReceivedDate,
                    RespondentDetails, FilingDate, PresentStatus,
                    CourtDetail, PlaceOfCourt, ClaimAmount,
                    CaseType, AreaOfComplaint, FactsOfCase,
                    WrittenStatementDate, NextHearingDate,
                    NextHearingPurpose, InterimOrderDate,
                    InterimOrderReceivedDate, InterimDirection,
                    InterimComplianceStatus, InterimRemarks,
                    DisposalDate, FinalOrderReceivedDate,
                    AwardAmount, FinalDirection,
                    FinalComplianceStatus, FinalRemarks,
                    AdvocateName, AdvocateContact
                );

                // ================= GRIDVIEW =================

                GridView gv = new GridView();

                gv.AutoGenerateColumns = true;

                gv.DataSource = dt;

                gv.DataBind();

                // ================= GRID STYLE =================

                gv.BorderStyle = BorderStyle.Solid;

                gv.BorderWidth = Unit.Pixel(1);

                gv.GridLines = GridLines.Both;

                gv.Font.Name = "Calibri";

                gv.Font.Size = FontUnit.Point(10);

                gv.HeaderStyle.BackColor = ColorTranslator.FromHtml("#1F4E78");

                gv.HeaderStyle.ForeColor = Color.White;

                gv.HeaderStyle.Font.Bold = true;

                gv.HeaderStyle.Font.Size = FontUnit.Point(10);

                // ================= HEADER STYLE =================

                if (gv.HeaderRow != null)
                {
                    foreach (TableCell cell in gv.HeaderRow.Cells)
                    {
                        cell.HorizontalAlign = HorizontalAlign.Center;

                        cell.VerticalAlign = VerticalAlign.Middle;

                        cell.BorderStyle = BorderStyle.Solid;

                        cell.BorderWidth = Unit.Pixel(1);

                        cell.BorderColor = Color.Black;

                        cell.Style["padding"] = "8px";

                        cell.Width = Unit.Pixel(180);
                    }
                }

                // ================= ROW STYLE =================

                foreach (GridViewRow row in gv.Rows)
                {
                    foreach (TableCell cell in row.Cells)
                    {
                        cell.BorderStyle = BorderStyle.Solid;

                        cell.BorderWidth = Unit.Pixel(1);

                        cell.BorderColor = Color.Black;

                        cell.Style["padding"] = "6px";

                        cell.HorizontalAlign = HorizontalAlign.Left;
                    }

                    // Alternate Row Color

                    if (row.RowIndex % 2 == 0)
                    {
                        row.BackColor = Color.White;
                    }
                    else
                    {
                        row.BackColor = ColorTranslator.FromHtml("#F2F2F2");
                    }
                }

                // ================= EXPORT =================

                Response.ClearContent();

                Response.Buffer = true;

                Response.AddHeader(
                    "content-disposition",
                    "attachment; filename=" + exlfilename + ".xls"
                );

                Response.ContentType = "application/ms-excel";

                Response.Charset = "";

                StringWriter sw = new StringWriter();

                HtmlTextWriter htw = new HtmlTextWriter(sw);

                gv.RenderControl(htw);

                Response.Output.Write(sw.ToString());

                Response.Flush();

                Response.End();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        [AuthLog(Roles = "Firm,User")]
        public void ExportToExcelContingentLiability()
        {
            try
            {
                string exlfilename = "ContingentLiability_" +
                                     DateTime.Now.ToString("ddMMyyyyHHmmss");

                // ================= QUERY PARAMS =================

                string CaseId = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["CaseId"]));
                string CaseNo = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["CaseNo"]));

                string Zone = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["Zone"]));
                string Branch = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["Branch"]));

                string AccountHolderName = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["AccountHolderName"]));
                string ClaimantName = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["ClaimantName"]));
                string ClaimantAddress = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["ClaimantAddress"]));

                string DateOfClaim = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["DateOfClaim"]));

                string BankGuarantee = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["BankGuarantee"]));
                string LetterOfCredit = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["LetterOfCredit"]));
                string WrongPayment = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["WrongPayment"]));
                string Fraud = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["Fraud"]));
                string CounterClaim = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["CounterClaim"]));
                string OthersClaim = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["OthersClaim"]));

                string NatureOfSecurity = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["NatureOfSecurity"]));
                string RealisableValue = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["RealisableValue"]));

                string FactsOfCase = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["FactsOfCase"]));

                string NextHearingPurpose = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["NextHearingPurpose"]));
                string NextHearingDate = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["NextHearingDate"]));

                string ProvisionDetail = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["ProvisionDetail"]));
                string YearOfProvision = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["YearOfProvision"]));

                string AmountProvision = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["AmountProvision"]));
                string AmountDepositedInCourt = Convert.ToString(QueryAES.UrlDecode(Request.QueryString["AmountDepositedInCourt"]));

                // ================= GET DATA =================

                DataTable dt = DataAccessADO.ExportToExcelContingentLiability(
                    CaseId,
                    CaseNo,
                    Zone,
                    Branch,
                    AccountHolderName,
                    ClaimantName,
                    ClaimantAddress,
                    DateOfClaim,
                    BankGuarantee,
                    LetterOfCredit,
                    WrongPayment,
                    Fraud,
                    CounterClaim,
                    OthersClaim,
                    NatureOfSecurity,
                    RealisableValue,
                    FactsOfCase,
                    NextHearingPurpose,
                    NextHearingDate,
                    ProvisionDetail,
                    YearOfProvision,
                    AmountProvision,
                    AmountDepositedInCourt
                );

                // ================= REMOVE EXTRA COLUMNS =================

                if (dt.Columns.Contains("Id"))
                    dt.Columns.Remove("Id");

                if (dt.Columns.Contains("CreatedOn"))
                    dt.Columns.Remove("CreatedOn");

                if (dt.Columns.Contains("CreatedBy"))
                    dt.Columns.Remove("CreatedBy");

                // ================= GRIDVIEW =================

                GridView gv = new GridView();

                gv.AutoGenerateColumns = false;

                // ================= BOUND COLUMNS =================

                gv.Columns.Add(new BoundField() { HeaderText = "Case ID", DataField = "CaseId" });
                gv.Columns.Add(new BoundField() { HeaderText = "Case No", DataField = "CaseNo" });
                gv.Columns.Add(new BoundField() { HeaderText = "Zone", DataField = "Zone" });
                gv.Columns.Add(new BoundField() { HeaderText = "Branch", DataField = "Branch" });

                gv.Columns.Add(new BoundField() { HeaderText = "Account Holder", DataField = "AccountHolderName" });
                gv.Columns.Add(new BoundField() { HeaderText = "Claimant Name", DataField = "ClaimantName" });
                gv.Columns.Add(new BoundField() { HeaderText = "Claimant Address", DataField = "ClaimantAddress" });

                gv.Columns.Add(new BoundField() { HeaderText = "Date Of Claim", DataField = "DateOfClaim" });

                // ===== CLAIM GROUP =====

                gv.Columns.Add(new BoundField() { HeaderText = "Bank Guarantee", DataField = "BankGuarantee" });
                gv.Columns.Add(new BoundField() { HeaderText = "Letter Of Credit", DataField = "LetterOfCredit" });
                gv.Columns.Add(new BoundField() { HeaderText = "Wrong Payment", DataField = "WrongPayment" });
                gv.Columns.Add(new BoundField() { HeaderText = "Fraud", DataField = "Fraud" });
                gv.Columns.Add(new BoundField() { HeaderText = "Counter Claim", DataField = "CounterClaim" });
                gv.Columns.Add(new BoundField() { HeaderText = "Others Claim", DataField = "OthersClaim" });

                // ===== OTHER COLUMNS =====

                gv.Columns.Add(new BoundField() { HeaderText = "Nature Of Security", DataField = "NatureOfSecurity" });
                gv.Columns.Add(new BoundField() { HeaderText = "Realisable Value", DataField = "RealisableValue" });

                gv.Columns.Add(new BoundField() { HeaderText = "Facts Of Case", DataField = "FactsOfCase" });

                gv.Columns.Add(new BoundField() { HeaderText = "Next Hearing Purpose", DataField = "NextHearingPurpose" });
                gv.Columns.Add(new BoundField() { HeaderText = "Next Hearing Date", DataField = "NextHearingDate" });

                gv.Columns.Add(new BoundField() { HeaderText = "Provision Detail", DataField = "ProvisionDetail" });
                gv.Columns.Add(new BoundField() { HeaderText = "Year Of Provision", DataField = "YearOfProvision" });

                gv.Columns.Add(new BoundField() { HeaderText = "Amount Provision", DataField = "AmountProvision" });
                gv.Columns.Add(new BoundField() { HeaderText = "Amount Deposited In Court", DataField = "AmountDepositedInCourt" });

                // ================= BIND DATA =================

                gv.DataSource = dt;
                gv.DataBind();

                // ================= REMOVE DEFAULT HEADER =================

                gv.HeaderRow.Visible = false;

                // ================= SUPER HEADER =================

                GridViewRow superHeader = new GridViewRow(
                    0,
                    0,
                    DataControlRowType.Header,
                    DataControlRowState.Normal
                );

                TableCell superHeaderCell = new TableCell();

                superHeaderCell.Text = "Contingent Liability of the bank not acknowledged as debt as on 30.12.2025";

                superHeaderCell.ColumnSpan = 24;

                superHeaderCell.HorizontalAlign = HorizontalAlign.Center;

                superHeader.Cells.Add(superHeaderCell);

                // ================= MAIN HEADER =================

                GridViewRow headerRow1 = new GridViewRow(
                    1,
                    0,
                    DataControlRowType.Header,
                    DataControlRowState.Normal
                );

                headerRow1.Cells.Add(new TableCell() { Text = "Case ID", RowSpan = 3 });
                headerRow1.Cells.Add(new TableCell() { Text = "Case No", RowSpan = 3 });
                headerRow1.Cells.Add(new TableCell() { Text = "Zone", RowSpan = 3 });
                headerRow1.Cells.Add(new TableCell() { Text = "Branch", RowSpan = 3 });

                headerRow1.Cells.Add(new TableCell() { Text = "Account Holder", RowSpan = 3 });
                headerRow1.Cells.Add(new TableCell() { Text = "Claimant Name", RowSpan = 3 });
                headerRow1.Cells.Add(new TableCell() { Text = "Claimant Address", RowSpan = 3 });

                headerRow1.Cells.Add(new TableCell() { Text = "Date Of Claim", RowSpan = 3 });

                // ===== NEW GROUP HEADER =====

                TableCell tallyGroup = new TableCell();

                tallyGroup.Text = "To be tallied with amounts against G/L codes 512101 (Liability side) and 612101 (Assets side)";

                tallyGroup.ColumnSpan = 10;

                tallyGroup.HorizontalAlign = HorizontalAlign.Center;

                headerRow1.Cells.Add(tallyGroup);

                // ===== OTHER HEADERS =====

                // headerRow1.Cells.Add(new TableCell() { Text = "Next Hearing Purpose", RowSpan = 3 });
                headerRow1.Cells.Add(new TableCell() { Text = "Next Hearing Date", RowSpan = 3 });

                headerRow1.Cells.Add(new TableCell() { Text = "Provision Detail", RowSpan = 3 });
                headerRow1.Cells.Add(new TableCell() { Text = "Year Of Provision", RowSpan = 3 });

                headerRow1.Cells.Add(new TableCell() { Text = "Amount Provision", RowSpan = 3 });
                headerRow1.Cells.Add(new TableCell() { Text = "Amount Deposited In Court", RowSpan = 3 });

                // ================= SECOND HEADER =================

                GridViewRow headerRow2 = new GridViewRow(
                    2,
                    0,
                    DataControlRowType.Header,
                    DataControlRowState.Normal
                );

                // ===== CLAIM GROUP =====

                TableCell claimGroup = new TableCell();

                claimGroup.Text = "Amount of Claim against Bank as under";

                claimGroup.ColumnSpan = 6;

                claimGroup.HorizontalAlign = HorizontalAlign.Center;

                headerRow2.Cells.Add(claimGroup);

                headerRow2.Cells.Add(new TableCell()
                {
                    Text = "Nature Of Security",
                    RowSpan = 2
                });

                headerRow2.Cells.Add(new TableCell()
                {
                    Text = "Realisable Value",
                    RowSpan = 2
                });

                headerRow2.Cells.Add(new TableCell()
                {
                    Text = "Facts of the case / Reasons for claim against the Bank",
                    RowSpan = 2
                });
                headerRow2.Cells.Add(new TableCell()
                {
                    Text = "Purpose of next hearing/Stage of Suit.",
                    RowSpan = 2
                });

                // ================= THIRD HEADER =================

                GridViewRow headerRow3 = new GridViewRow(
                    3,
                    0,
                    DataControlRowType.Header,
                    DataControlRowState.Normal
                );

                headerRow3.Cells.Add(new TableCell() { Text = "Bank Guarantee" });
                headerRow3.Cells.Add(new TableCell() { Text = "Letter Of Credit" });
                headerRow3.Cells.Add(new TableCell() { Text = "Wrong Payment" });
                headerRow3.Cells.Add(new TableCell() { Text = "Fraud" });
                headerRow3.Cells.Add(new TableCell() { Text = "Counter Claim" });
                headerRow3.Cells.Add(new TableCell() { Text = "Others Claim" });

                // ================= HEADER STYLE =================

                superHeader.BackColor = ColorTranslator.FromHtml("#203864");
                superHeader.ForeColor = Color.White;
                superHeader.Font.Bold = true;
                superHeader.Font.Size = FontUnit.Point(13);

                headerRow1.BackColor = ColorTranslator.FromHtml("#1F4E78");
                headerRow1.ForeColor = Color.White;
                headerRow1.Font.Bold = true;
                headerRow1.Font.Size = FontUnit.Point(11);

                headerRow2.BackColor = ColorTranslator.FromHtml("#2F75B5");
                headerRow2.ForeColor = Color.White;
                headerRow2.Font.Bold = true;
                headerRow2.Font.Size = FontUnit.Point(10);

                headerRow3.BackColor = ColorTranslator.FromHtml("#5B9BD5");
                headerRow3.ForeColor = Color.White;
                headerRow3.Font.Bold = true;
                headerRow3.Font.Size = FontUnit.Point(10);

                // ================= COMMON STYLE =================

                foreach (GridViewRow gvr in new[] { superHeader, headerRow1, headerRow2, headerRow3 })
                {
                    foreach (TableCell cell in gvr.Cells)
                    {
                        cell.HorizontalAlign = HorizontalAlign.Center;
                        cell.VerticalAlign = VerticalAlign.Middle;
                        cell.BorderStyle = BorderStyle.Solid;
                        cell.BorderWidth = Unit.Pixel(1);
                        cell.BorderColor = Color.Black;
                        cell.Style["padding"] = "8px";
                    }
                }

                // ================= INSERT HEADERS =================

                gv.Controls[0].Controls.AddAt(0, headerRow3);

                gv.Controls[0].Controls.AddAt(0, headerRow2);

                gv.Controls[0].Controls.AddAt(0, headerRow1);

                gv.Controls[0].Controls.AddAt(0, superHeader);

                // ================= GRID STYLE =================

                gv.BorderStyle = BorderStyle.Solid;
                gv.BorderWidth = Unit.Pixel(1);
                gv.GridLines = GridLines.Both;

                gv.Font.Name = "Calibri";
                gv.Font.Size = FontUnit.Point(10);

                // ================= ROW STYLE =================

                foreach (GridViewRow row in gv.Rows)
                {
                    foreach (TableCell cell in row.Cells)
                    {
                        cell.BorderStyle = BorderStyle.Solid;
                        cell.BorderWidth = Unit.Pixel(1);
                        cell.BorderColor = Color.Black;
                        cell.Style["padding"] = "6px";
                        cell.HorizontalAlign = HorizontalAlign.Left;
                    }

                    if (row.RowIndex % 2 == 0)
                    {
                        row.BackColor = Color.White;
                    }
                    else
                    {
                        row.BackColor = ColorTranslator.FromHtml("#F2F2F2");
                    }
                }

                // ================= EXPORT =================

                Response.ClearContent();

                Response.Buffer = true;

                Response.AddHeader(
                    "content-disposition",
                    "attachment; filename=" + exlfilename + ".xls"
                );

                Response.ContentType = "application/ms-excel";

                Response.Charset = "";

                StringWriter sw = new StringWriter();

                HtmlTextWriter htw = new HtmlTextWriter(sw);

                gv.RenderControl(htw);

                Response.Output.Write(sw.ToString());

                Response.Flush();

                Response.End();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}