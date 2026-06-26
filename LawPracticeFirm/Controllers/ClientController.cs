using BussinessLogic;
using DataAccess.Modals;
using LawPracticeFirm.Common;
using LawPracticeFirm.CustomFIlter;
using LawPracticeFirm.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NJDGDetail.Controllers;
using NJDGDetail.Models;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web.Configuration;
using System.Web.Mvc;
using System.Web.UI;
using System.Web.UI.WebControls;
using static LawPracticeFirm.Models.AuditData;

namespace LawPracticeFirm.Controllers
{
    public class ClientController : BaseFirmController
    {
        private LawPracticeEntities db1 = new LawPracticeEntities();
        public string controllername = "ClientController";
        [AuthLog(Roles = "Client")]
        public ActionResult Index()
        {
            return View();
        }
        private LawPracticeEntities db = new LawPracticeEntities();
        /// <summary>
        /// Client dashboard details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Client")]
        public ActionResult Dashboard()
        {
            try
            {
                var db = new LawPracticeEntities();
                var loggeduser = LoggedInUser.UserId;
                var logd = LoggedInUser.FirmId;
                var username = db.FirmUsers.Where(x => x.Id.ToString() == loggeduser.ToString()).FirstOrDefault();
                Session["loggeduser"] = username.UserName;
                Session["usertype"] = username.IsFirmClient;
                var firmname = db.Firms.Where(z => z.Id.ToString() == username.Firmid.ToString()).FirstOrDefault();
                Session["firmname"] = firmname.FirmTitle;
                var messagecount = db.GetMessageNotificationcount(LoggedInUser.FirmId, LoggedInUser.UserId, 0, "Messages").ToList();
                ViewBag.countmessage = messagecount.Count;
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Client), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Client), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            return View();
        }
        /// <summary>
        /// Client header
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Client")]
        public ActionResult header()
        {
            try
            {
                Session["authsessionfirmid"] = "";
                Session["authsessionuserid"] = "";
                Session["authsessionmobile"] = "";
                var db = new LawPracticeEntities();
                string firmcode = Request.Url.Segments[1];
                string firmcodes = firmcode.Replace("/", "");
                ViewBag.username = LoggedInUser.UserName;
                Session["username"] = LoggedInUser.UserName;
                var fullusername = LoggedInUser.UserFullName;
                if (!String.IsNullOrEmpty(fullusername))
                {
                    Session["fullusername"] = fullusername;
                }
                Session["FullName"] = LoggedInUser.FirstName;
                var companyids = "00000000-0000-0000-0000-000000000000";
                var companyid = db.usp_wf_GetClientDetails(LoggedInUser.FirmId, LoggedInUser.UserId).FirstOrDefault();
                if (companyid != null)
                {
                    Session["Companyid"] = companyid.CompanyId;
                    companyids = companyid.CompanyId.ToString();
                    string[] tokens = fullusername.Split('(');
                    var companyname = tokens[0];
                    if (companyids != "00000000-0000-0000-0000-000000000000")
                    {
                        Session["FullName"] = companyname + " (" + companyid.cfname + " " + companyid.cmname + " " + companyid.clname + " )";
                    }
                }
                try
                {
                    var getcompanycontact = db.Usp_CompanyClintContactList(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), companyids).Where(x => x.Loginid.ToString().ToLower() != LoggedInUser.UserId.ToString().ToLower()).ToList();
                    ViewBag.companycontact = getcompanycontact;
                }
                catch
                {
                }
                var hsdashboard = "";
                var hsuser = "display:none";
                var hscontact = "display:none";
                var hsmatter = "display:none";
                var hsdocument = "display:none";
                var hsknowledge = "display:none";
                var hsexpense = "display:none";
                var hsright = "display:none";
                var hsimessage = "display:none";
                var hsconflict = "display:none";
                var hsglobal = "display:none";
                var hsreport = "display:none";
                var hstask = "display:none";
                var hsbundle = "display:none";
                var hscompare = "display:none";
                var hsocr = "display:none";
                var hsvideoconference = "display:none";
                var hsmanupatra = "display:none";
                var hsdsign = "display:none";
                var hscalendar = "display:none";
                var hstimeentry = "display:none";
                var hschat = "display:none";
                var hscoludint = "display:none";
                var hsemailsync = "display:none";
                var hsfeaturesc = "display:none";
                var hslegal = "display:none";
                var hsothers = "display:none";
                var hsvcgooglemeet = "display:none";
                var hsinvoice = "display:none";
                var hscfield = "display:none";
                var hslimit = "display:none";
                var hscw = "display:none";
                var hsnotice = "display:none";
                var firmpackmodulelist = db.Usp_GetFirmPackByFirmId(LoggedInUser.FirmId.ToString()).ToList();
                if (firmpackmodulelist.Count > 0)
                {
                    foreach (var data in firmpackmodulelist)
                    {
                        if (data.ModuleName == ConfigurationManager.AppSettings["DashboardFixed"])
                        {
                            hsdashboard = "display:unset";
                        }
                        if (data.ModuleName == ConfigurationManager.AppSettings["ContactManagement"])
                        {
                            hscontact = "display:unset";
                        }
                        if (data.ModuleName == ConfigurationManager.AppSettings["MatterManagement"])
                        {
                            hsmatter = "display:unset";
                        }
                        if (data.ModuleName == ConfigurationManager.AppSettings["UserManagement"])
                        {
                            hsuser = "display:unset";
                        }
                        if (data.ModuleName == ConfigurationManager.AppSettings["DocumentManagement"])
                        {
                            hsdocument = "display:unset";
                        }
                        if (data.ModuleName == ConfigurationManager.AppSettings["KnowledgeManagement"])
                        {
                            hsknowledge = "display:unset";
                        }
                        if (data.ModuleName == ConfigurationManager.AppSettings["ExpenseManagement"])
                        {
                            hsexpense = "display:unset";
                        }
                        if (data.ModuleName == ConfigurationManager.AppSettings["RightsManagement"])
                        {
                            hsright = "display:unset";
                        }
                        if (data.ModuleName == ConfigurationManager.AppSettings["TimeEntry"])
                        {
                            hstimeentry = "display:unset";
                        }
                        if (data.ModuleName == ConfigurationManager.AppSettings["Internalmessaging"])
                        {
                            hsimessage = "display:unset";
                        }
                        if (data.ModuleName == ConfigurationManager.AppSettings["Conflictcheck"])
                        {
                            hsconflict = "display:unset";
                        }
                        if (data.ModuleName == ConfigurationManager.AppSettings["GlobalSearch"])
                        {
                            hsglobal = "display:unset";
                        }
                        if (data.ModuleName == ConfigurationManager.AppSettings["Reports"])
                        {
                            hsreport = "display:unset";
                        }
                        if (data.ModuleName == ConfigurationManager.AppSettings["TaskManagement"])
                        {
                            hstask = "display:unset";
                        }
                        if (data.ModuleName == ConfigurationManager.AppSettings["BundlingPDF"])
                        {
                            hsbundle = "display:unset";
                        }
                        if (data.ModuleName == ConfigurationManager.AppSettings["CompareDocuments"])
                        {
                            hscompare = "display:unset";
                        }
                        if (data.ModuleName == ConfigurationManager.AppSettings["OCR"])
                        {
                            hsocr = "display:unset";
                        }
                        if (data.ModuleName == ConfigurationManager.AppSettings["Videoconferencing"])
                        {
                            hsvideoconference = "display:unset";
                        }
                        if (data.ModuleName == ConfigurationManager.AppSettings["ManupatraIntegration"])
                        {
                            hsmanupatra = "display:unset";
                        }
                        if (data.ModuleName == ConfigurationManager.AppSettings["DigitalSignature"])
                        {
                            hsdsign = "display:unset";
                        }
                        if (data.ModuleName == ConfigurationManager.AppSettings["CalendarManagement"])
                        {
                            hscalendar = "display:unset";
                        }
                        if (data.ModuleName == ConfigurationManager.AppSettings["TimeEntry"])
                        {
                            hstimeentry = "display:unset";
                        }
                        if (data.ModuleName == ConfigurationManager.AppSettings["Chat"])
                        {
                            hschat = "display:unset";
                        }
                        if (data.ModuleName == ConfigurationManager.AppSettings["CloudIntegration"])
                        {
                            hscoludint = "display:unset";
                        }
                        if (data.ModuleName == ConfigurationManager.AppSettings["FeatureSpecificSearch"])
                        {
                            hsfeaturesc = "display:unset";
                        }
                        if (data.ModuleName == ConfigurationManager.AppSettings["LegalUpdates"])
                        {
                            hslegal = "display:unset";
                        }
                        if (data.ModuleName == ConfigurationManager.AppSettings["Others"])
                        {
                            hsothers = "display:unset";
                        }
                        if (data.ModuleName == ConfigurationManager.AppSettings["VCGoogleMeet"])
                        {
                            hsvcgooglemeet = "display:unset";
                        }
                        if (data.ModuleName == ConfigurationManager.AppSettings["InvoiceManagement"])
                        {
                            hsinvoice = "display:unset";
                        }
                        if (data.ModuleName == ConfigurationManager.AppSettings["EmailSync"])
                        {
                            hsemailsync = "display:unset";
                        }
                        if (data.ModuleName == ConfigurationManager.AppSettings["CustomFields"])
                        {
                            hscfield = "display:unset";
                        }
                        if (data.ModuleName == ConfigurationManager.AppSettings["PeriodofLimitation"])
                        {
                            hslimit = "display:unset";
                        }
                        if (data.ModuleName == ConfigurationManager.AppSettings["CaseWatchIntegration"])
                        {
                            hscw = "display:unset";
                        }
                        if (data.ModuleName == ConfigurationManager.AppSettings["NoticeManagement"])
                        {
                            hsnotice = "display:unset";
                        }
                    }
                }
                else
                {
                    hsdashboard = "display:unset";
                    hsuser = "display:unset";
                    hscontact = "display:unset";
                    hsmatter = "display:unset";
                    hsdocument = "display:unset";
                    hsknowledge = "display:unset";
                    hsexpense = "display:unset";
                    hsright = "display:unset";
                    hsimessage = "display:unset";
                    hsconflict = "display:unset";
                    hsglobal = "display:unset";
                    hsreport = "display:unset";
                    hstask = "display:unset";
                    hsbundle = "display:unset";
                    hscompare = "display:unset";
                    hsocr = "display:unset";
                    hsvideoconference = "display:unset";
                    hsmanupatra = "display:unset";
                    hsdsign = "display:unset";
                    hscalendar = "display:unset";
                    hstimeentry = "display:unset";
                    hschat = "display:unset";
                    hscoludint = "display:unset";
                    hsemailsync = "display:unset";
                    hsfeaturesc = "display:unset";
                    hslegal = "display:unset";
                    hsothers = "display:unset";
                    hsvcgooglemeet = "display:unset";
                    hsinvoice = "display:unset";
                    hsemailsync = "display:unset";
                    hscfield = "display:unset";
                    hslimit = "display:unset";
                    hscw = "display:unset";
                    hsnotice = "display:unset";
                }
                // Hierarchy firm: always unlock Matter
                string hfId = ConfigurationManager.AppSettings["HierarchyFirmId"];
                if (!string.IsNullOrEmpty(hfId) && LoggedInUser.FirmId.ToString().ToUpper() == hfId.ToUpper())
                {
                    hsmatter = "display:unset";
                }

                ViewBag.hsdashboard = hsdashboard;
                ViewBag.hsuser = hsuser;
                ViewBag.hscontact = hscontact;
                ViewBag.hsmatter = hsmatter;
                ViewBag.hsdocument = hsdocument;
                ViewBag.hsknowledge = hsknowledge;
                ViewBag.hsexpense = hsexpense;
                ViewBag.hsrights = hsright;
                ViewBag.hsimessage = hsimessage;
                ViewBag.hsconflict = hsconflict;
                ViewBag.hsglobal = hsglobal;
                ViewBag.hsreport = hsreport;
                ViewBag.hstask = hstask;
                ViewBag.hsbundle = hsbundle;
                ViewBag.hscompare = hscompare;
                ViewBag.hsocr = hsocr;
                ViewBag.hsvideoconference = hsvideoconference;
                ViewBag.hsmanupatra = hsmanupatra;
                ViewBag.hsdsign = hsdsign;
                ViewBag.hscalendar = hscalendar;
                ViewBag.hstimeentry = hstimeentry;
                ViewBag.hschat = hschat;
                ViewBag.hscoludint = hscoludint;
                ViewBag.hsemailsync = hsemailsync;
                ViewBag.hsfeaturesc = hsfeaturesc;
                ViewBag.hslegal = hslegal;
                ViewBag.hsothers = hsothers;
                ViewBag.hsvcgooglemeet = hsvcgooglemeet;
                ViewBag.hsinvoice = hsinvoice;
                ViewBag.hsemailsync = hsemailsync;
                ViewBag.hscfield = hscfield;
                ViewBag.hslimit = hslimit;
                ViewBag.hscw = hscw;
                ViewBag.hsnotice = hsnotice;
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Client), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Client), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            return View();
        }
        public ActionResult testpage()
        {
            return View();
        }
        /// <summary>
        /// Update Client profile 
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Client")]
        public ActionResult ProfileUpdate()
        {
            return View();
        }
        /// <summary>
        /// Task list details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Client")]
        public ActionResult Tasklist()
        {
            return View();
        }
        /// <summary>
        /// Get work flow activity notification
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Client")]
        public ActionResult WorkflowNUserActivity()
        {
            try
            {
                var db = new LawPracticeEntities();
                var datas = db.tbl_notification.Where(x => x.ntype == "Workflow" && x.Firmid.ToString() == LoggedInUser.FirmId.ToString() && x.auser.ToString() == LoggedInUser.UserId.ToString()).ToList();
                foreach (var data in datas)
                {
                    if (data != null)
                    {
                        data.status = 1;
                        db.Entry(data).State = EntityState.Modified;
                        db.SaveChanges();
                    }
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Client), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Client), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            return View();
        }
        /// <summary>
        /// Profile view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Client")]
        public ActionResult Profile()
        {
            return View();
        }
        /// <summary>
        /// Calender view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Client")]
        public ActionResult Calender()
        {
            return View();
        }
        /// <summary>
        /// Matterlist view detail list
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Client")]
        public ActionResult MatterList()
        {
            return View();
        }
        /// <summary>
        /// Client change password
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult ChangePassword()
        {
            return View();
        }
        /// <summary>
        /// Client first login
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Client")]
        public ActionResult ClientFirstLogin()
        {
            ViewBag.firmcodenewclient = LoggedInUser.FirmCode;
            return View();
        }
        /// <summary>
        /// Calender details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Client")]
        public ActionResult Calendar()
        {
            return View();
        }
        /// <summary>
        /// Single view matter details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Client")]
        public ActionResult MatterSingleView()
        {
            try
            {
                var typeid = QueryAES.UrlDecode(Request.Form["token"]);
                ViewBag.token = typeid;
                typeid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(typeid));
                var db = new LawPracticeEntities();
                var data = db.tbl_notification.Where(x => x.typeid.ToString() == typeid.ToString() && x.Firmid.ToString() == LoggedInUser.FirmId.ToString() && x.auser.ToString() == LoggedInUser.UserId.ToString()).FirstOrDefault();
                if (data != null)
                {
                    data.status = 1;
                    db.Entry(data).State = EntityState.Modified;
                    db.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Client), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Client), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            return View();
        }
        /// <summary>
        /// Show calender hybrid data
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Client")]
        public ActionResult CalendarHybridData()
        {
            Response.ContentType = "application/xml";
            return View();
        }
        /// <summary>
        /// Show calender hybrid
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Client")]
        public ActionResult CalendarHybrid()
        {
            return View();
        }
        /// <summary>
        /// Calender details
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public JsonResult Calendardata()
        {
            int i = 0;
            int eventid = 1;
            int eventid1 = 1;
            string s = "";
            string s1 = "";
            string y1 = "";
            string main1 = "";
            string ch = "";
            string main = "";
            List<CalendarData> recentlyViewedEvent = new List<CalendarData>();
            List<CalendarData> recentlyViewedEvent1 = new List<CalendarData>();
            string nexthearingtext = "";
            string disposedtext = "";
            CheckNextHearingOrderDateList chknextorder = new CheckNextHearingOrderDateList();
            caldatalist objdata1 = new caldatalist();
            List<caldata> objdata2 = new List<caldata>();
            string strusername = WebConfigurationManager.AppSettings["matteridname"];
            Guid user = LoggedInUser.UserId;
            Guid firmids = LoggedInUser.FirmId;
            string joined = "";
            string matteridlist = "";
            var rolesuser = LoggedInUser.RoleId;
            if (rolesuser.ToString() == "3")
            {
                var matterid = db.AddLawMatterLists.Where(x => x.matterclientid.ToString() == LoggedInUser.UserId.ToString() && x.Firmid.ToString() == LoggedInUser.FirmId.ToString()).Select(x => new { x.Id }).ToList();
                foreach (var itemid in matterid)
                {
                    var caseid = db.tblUserCasesMapCaseStatusMasters.Where(x => x.MatterID == itemid.Id).Select(x => new { x.UserCaseId }).ToList();
                    foreach (var itemcaseid in caseid)
                    {
                        joined += itemcaseid.UserCaseId + ",";
                    }
                }
                joined = joined.TrimEnd(',');
                joined = joined.Replace(",", "','");
            }
            else
            {
                if (LoggedInUser.RoleId.ToString() == "1")
                {
                    var matterid = db.Caselistforcalendar(firmids, user).ToList();
                    foreach (var itemid in matterid)
                    {
                        var caseid = db.tblUserCasesMapCaseStatusMasters.Where(x => x.MatterID.ToString() == itemid.ToString()).Select(x => new { x.UserCaseId }).ToList();
                        foreach (var itemcaseid in caseid)
                        {
                            joined += itemcaseid.UserCaseId + ",";
                        }
                    }
                }
                else
                {
                    var matterid = db.Caselistforcalendar(firmids, user).ToList();
                    foreach (var itemid in matterid)
                    {
                        var caseid = db.tblUserCasesMapCaseStatusMasters.Where(x => x.MatterID.ToString() == itemid.ToString()).Select(x => new { x.UserCaseId }).ToList();
                        foreach (var itemcaseid in caseid)
                        {
                            joined += itemcaseid.UserCaseId + ",";
                        }
                    }
                }
                joined = joined.TrimEnd(',');
                joined = joined.Replace(",", "','");
            }
            matteridlist = joined.ToString();
            string strapiuser = strusername + "_" + user;
            if (LoggedInUser.RoleId.ToString() != "1")
            {
                CalendarEventByAllUserLawPractice(recentlyViewedEvent, strapiuser, matteridlist);
            }
            else
            {
                CalendarEventByAllUserLawPractice(recentlyViewedEvent, strapiuser, matteridlist);
            }
            var dis_Date = (from obj in recentlyViewedEvent select new { DisposedDate = obj.Disposeddt }).Distinct().ToList();
            foreach (var myevent1 in dis_Date)
            {
                string disdt = Convert.ToString(myevent1.DisposedDate);
                var checkRecord = recentlyViewedEvent.Where(x => x.Disposeddt == disdt).ToList();
                for (int j = 0; j < checkRecord.Count; j++)
                {
                    s = string.Format("{0:D1}", Convert.ToDateTime(checkRecord[j].Disposeddt).ToString("MM"));
                    s1 = Convert.ToDateTime(checkRecord[j].Disposeddt).ToString("dd");
                    y1 = Convert.ToDateTime(checkRecord[j].Disposeddt).ToString("yyyy");
                    main = s + "/" + s1 + "/" + y1;
                    checkRecord[j].start_date = main;
                    if (i == 0)
                    {
                        i = 1;
                        if (LoggedInUser.RoleId.ToString() != "1")
                        {
                            NextHearingDateAllUserLawPractice(recentlyViewedEvent1, strapiuser, matteridlist);
                        }
                        else
                        {
                            NextHearingDateAllUserLawPractice(recentlyViewedEvent1, strapiuser, matteridlist);
                        }
                        var nexthearing_Date = (from obj in recentlyViewedEvent1 select new { DisposedDate = obj.Disposeddt }).Distinct().ToList();
                        foreach (var myevent2 in nexthearing_Date)
                        {
                            string nexthearingdt = Convert.ToString(myevent2.DisposedDate);
                            //--
                            var dttt = recentlyViewedEvent.Where(x => x.Disposeddt == nexthearingdt).Take(1).ToList();
                            if (dttt.Count > 0)
                            {
                                CheckNextHearingOrderDate chk = new CheckNextHearingOrderDate();
                                chk.Finaldate = nexthearingdt;
                                chknextorder.Add(chk);
                            }
                            //--
                            var checkRecordnexthearing = recentlyViewedEvent1.Where(x => x.Disposeddt == nexthearingdt).ToList();
                            int k = 0;
                            for (k = 0; k < checkRecordnexthearing.Count; k++)
                            {
                                s = string.Format("{0:D1}", Convert.ToDateTime(checkRecordnexthearing[k].Disposeddt).ToString("MM"));
                                s1 = Convert.ToDateTime(checkRecordnexthearing[k].Disposeddt).ToString("dd");
                                y1 = Convert.ToDateTime(checkRecordnexthearing[k].Disposeddt).ToString("yyyy");
                                main = s + "/" + s1 + "/" + y1;
                                checkRecordnexthearing[k].start_date = main;
                                if (checkRecordnexthearing.Count > 1)
                                {
                                    nexthearingtext = "<span class=\"mhide\">" + checkRecordnexthearing[k].Casetype + " " + checkRecordnexthearing[k].CaseNo + "/" + checkRecordnexthearing[k].Caseyear + " (" + checkRecordnexthearing[k].Disposeddt + ") </span>" + "<a class=\"more\" href=\"#\" data-toggle=\"modal\" data-target=\"#modalDatebindBysuser\" name=\"register\" onclick=\"NexthearingbyUser('" + checkRecordnexthearing[k].Disposeddt + "');\">" + "More Next Hearing</a> <a class=\"m-more\" href=\"#\" data-toggle=\"modal\" data-target=\"#modalDatebindBysuser\" name=\"register\" onclick=\"NexthearingbyUser('" + checkRecordnexthearing[k].Disposeddt + "');\">" + "<img src=\"/assets/img/next_hearing.png\" width=\"16\" height=\"16\"></a>";//" Next Hearing";
                                }
                                else
                                {
                                    nexthearingtext = "<a class=\"more\" href=\"#\" data-toggle=\"modal\" data-target=\"#modalDatebindBysuser\" name=\"register\" onclick=\"NexthearingbyUser('" + checkRecordnexthearing[k].Disposeddt + "');\">" + checkRecordnexthearing[k].Casetype + " " + checkRecordnexthearing[k].CaseNo + "/" + checkRecordnexthearing[k].Caseyear + " (" + checkRecordnexthearing[k].Disposeddt + ") " + "Next Hearing</a><a class=\"m-more\" href=\"#\" data-toggle=\"modal\" data-target=\"#modalDatebindBysuser\" name=\"register\" onclick=\"NexthearingbyUser('" + checkRecordnexthearing[k].Disposeddt + "');\">" + checkRecordnexthearing[k].Casetype + " " + checkRecordnexthearing[k].CaseNo + "/" + checkRecordnexthearing[k].Caseyear + " (" + checkRecordnexthearing[k].Disposeddt + ") " + "<img src=\"/assets/img/next_hearing.png\" width=\"16\" height=\"16\"></a>";//" Next Hearing";
                                }
                                //Check Next hearing 
                                var nexthearingorderdstnct = chknextorder.Distinct().ToList();
                                for (int m = 0; m < nexthearingorderdstnct.Count; m++)
                                {
                                    if (nexthearingorderdstnct[m].Finaldate == checkRecordnexthearing[k].Disposeddt)
                                    {
                                        nexthearingtext = "";
                                    }
                                }
                                if (nexthearingtext != "")
                                {
                                    eventid = eventid + 1;
                                    caldata objdatanxthdt = new caldata();
                                    objdatanxthdt.id = eventid;
                                    objdatanxthdt.start_date = checkRecordnexthearing[k].start_date;
                                    objdatanxthdt.end_date = checkRecordnexthearing[k].start_date;
                                    objdatanxthdt.text = nexthearingtext;
                                    objdata2.Add(objdatanxthdt);
                                    break;
                                }
                            }
                        }
                    }
                    i = 1;
                    if (checkRecord.Count > 1)
                    {
                        disposedtext = "<span class=\"mhide\">" + checkRecord[j].Casetype + ' ' + checkRecord[j].CaseNo + '/' + checkRecord[j].Caseyear + " (" + checkRecord[j].Disposeddt + ") - " + checkRecord[j].Court + " </span> <br /> <a class=\"more\" href=\"#\" data-toggle=\"modal\" data-target=\"#modalDatebindBysuser\" name=\"register\" onclick=\"DateUservalue('" + checkRecord[j].Disposeddt + "');\">More</a><a class=\"m-txt\" href=\"#\" data-toggle=\"modal\" data-target=\"#modalDatebindBysuser\" name=\"register\" onclick=\"DateUservalue('" + checkRecord[j].Disposeddt + "');\"><img src=\"/assets/img/link.png\" width=\"16\" height=\"16\"></a>" + " " + ch;
                    }
                    else
                    {
                        disposedtext = "<a class=\"txt\" href=\"#\" data-toggle=\"modal\" data-target=\"#modalDatebindBysuser\" name=\"register\" onclick=\"DateUservalue('" + checkRecord[j].Disposeddt + "');\">" + checkRecord[j].Casetype + ' ' + checkRecord[j].CaseNo + '/' + checkRecord[j].Caseyear + " (" + checkRecord[j].Disposeddt + ") - " + checkRecord[j].Court + " </a><a class=\"m-txt\" href=\"#\" data-toggle=\"modal\" data-target=\"#modalDatebindBysuser\" name=\"register\" onclick=\"DateUservalue('" + checkRecord[j].Disposeddt + "');\">" + "<img src=\"/assets/img/link.png\" width=\"16\" height=\"16\"></a>";
                    }
                    //Check Next hearing 
                    var nexthearingorderdstnct1 = chknextorder.Distinct().ToList();
                    for (int m = 0; m < nexthearingorderdstnct1.Count; m++)
                    {
                        if (checkRecord[j].Disposeddt == nexthearingorderdstnct1[m].Finaldate)
                        {
                            disposedtext += "<a class=\"more\" style=\"display:block\" href=\"#\" data-toggle=\"modal\" data-target=\"#modalDatebindBysuser\" name=\"register\" onclick=\"NexthearingbyUser('" + checkRecord[j].Disposeddt + "');\">" + "Next Hearing</a><a class=\"m-more\" style=\"display:block\" href=\"#\" data-toggle=\"modal\" data-target=\"#modalDatebindBysuser\" name=\"register\" onclick=\"NexthearingbyUser('" + checkRecord[j].Disposeddt + "');\">" + "<img src=\"/assets/img/next_hearing.png\" width=\"16\" height=\"16\"></a>";
                        }
                    }
                    eventid = eventid + 1;
                    caldata objdata = new caldata();
                    objdata.id = eventid;
                    objdata.start_date = checkRecord[j].start_date;
                    objdata.end_date = checkRecord[j].start_date;
                    objdata.text = disposedtext;
                    objdata2.Add(objdata);
                    break;
                }
            }
            return Json(objdata2, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Merge calender deta
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public JsonResult CalendardataMerge()
        {
            // 5-minute cache � calendar hearing data doesn't change every second
            string cacheKey = "CalendardataMerge_" + LoggedInUser.FirmId.ToString() + "_" + LoggedInUser.UserId.ToString();
            var cached = HttpContext.Cache[cacheKey] as List<caldata>;
            if (cached != null) return Json(cached, JsonRequestBehavior.AllowGet);

            int i = 0;
            int eventid = 0;
            int eventid1 = 1;
            string s = "";
            string s1 = "";
            string y1 = "";
            string main1 = "";
            string ch = "";
            string main = "";
            List<CalendarData> recentlyViewedEvent = new List<CalendarData>();
            List<CalendarData> recentlyViewedEvent1 = new List<CalendarData>();
            List<CalendarData> recentlyViewedOrder = new List<CalendarData>();
            string nexthearingtext = "";
            string disposedtext = "";
            CheckNextHearingOrderDateList chknextorder = new CheckNextHearingOrderDateList();
            caldatalist objdata1 = new caldatalist();
            List<caldata> objdata2 = new List<caldata>();
            string strusername = WebConfigurationManager.AppSettings["matteridname"];
            Guid user = LoggedInUser.UserId;
            Guid firmids = LoggedInUser.FirmId;
            string joined = "";
            string matteridlist = "";
            var rolesuser = LoggedInUser.RoleId;
            joined = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
            matteridlist = joined.ToString();
            string strapiuser = matteridlist;
            CalendarEventByAllUserLawPractice(recentlyViewedEvent, strapiuser, "");
            var dis_Date = (from obj in recentlyViewedEvent select new { DisposedDate = obj.Disposeddt, HearingType = obj.HearingType }).Distinct().ToList();
            foreach (var myevent1 in dis_Date)
            {
                string disdt = Convert.ToString(myevent1.DisposedDate);
                DateTime disposedDate;
                if (!DateTime.TryParse(disdt, out disposedDate))
                    continue;
                if (myevent1.HearingType == "M")
                {
                    nexthearingtext = "<br/><a  class=\"more\" href=\"#\" data-toggle=\"modal\" data-target=\"#modalDatebindBysuser\" name=\"register\" onclick=\"NexthearingbyUser('" + myevent1.DisposedDate + "','" + myevent1.HearingType + "');\">" + "<div class='rectangle11'>Hearing</div></a>";
                }
                else if (myevent1.HearingType == "RERA")
                {
                    //  nexthearingtext = "<br/><a  class=\"more\" href=\"#\" data-toggle=\"modal\" data-target=\"#modalDatebindBysuser\" name=\"register\" onclick=\"NexthearingbyUser('" + myevent1.DisposedDate + "','" + myevent1.HearingType + "');\">" + "Court Hearing</a>";
                }
                else
                {
                    nexthearingtext = "<br/><br/><br/><br/><a  class=\"more\" href=\"#\" data-toggle=\"modal\" data-target=\"#modalDatebindBysuser\" name=\"register\" onclick=\"NexthearingbyUser('" + myevent1.DisposedDate + "','" + myevent1.HearingType + "');\">" + "<div class='rectangle11'>Hearing</div></a>";
                }
                caldata objdata = new caldata();
                main = disposedDate.ToString("MM/dd/yyyy");
                objdata.start_date = main;
                var main12 = disposedDate.AddDays(1).ToString("MM/dd/yyyy");
                try
                {
                    objdata.end_date = disposedDate.AddDays(1).ToString("MM/dd/yyyy");
                }
                catch { }

                objdata.type = "case";
                objdata.end_date = main12;
                objdata.text = nexthearingtext;
                if (!String.IsNullOrEmpty(disdt))
                {
                    eventid = eventid + 1;
                    objdata.id = eventid;
                    objdata.type = "case";
                    objdata.HearingType = myevent1.HearingType;
                    objdata2.Add(objdata);
                }
            }
            int finalcount = objdata2.Count() + 1;
            //mykase reminder
            List<usp_PersonalDashboardTaskList_Calendar_Result> listremind = new List<usp_PersonalDashboardTaskList_Calendar_Result>();
            listremind = db.usp_PersonalDashboardTaskList_Calendar(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), 1, 100, "", "").ToList();
            var cntr22 = objdata2.Count() + 1;
            List<usp_PersonalDashboardTaskList_Calendar_Result> listremindtmp = new List<usp_PersonalDashboardTaskList_Calendar_Result>();
            foreach (var data in listremind.ToList())
            {
                DateTime taskDueDate;
                if (!DateTime.TryParse(Convert.ToString(data.TaskDueDate), out taskDueDate))
                    continue;
                usp_PersonalDashboardTaskList_Calendar_Result newItem = new usp_PersonalDashboardTaskList_Calendar_Result();
                newItem.Tid = Convert.ToBase64String(QueryAES.EncryptAes(data.Tid.ToString()));
                listremind[listremind.IndexOf(data)].Tid = newItem.Tid;
                cntr22 = cntr22 + 1;
                caldata objevt = new caldata();
                objevt.id = cntr22;
                main = taskDueDate.ToString("MM/dd/yyyy");
                objevt.start_date = main;
                objevt.end_date = taskDueDate.AddDays(1).ToString("MM/dd/yyyy");
                var types = "";
                usp_PersonalDashboardTaskList_Calendar_Result newItemtmp = new usp_PersonalDashboardTaskList_Calendar_Result();
                if (listremindtmp.ToList().Count > 0)
                {
                    foreach (var datachk in listremindtmp.ToList())
                    {
                        objevt.text = "<p id=\"transferpageevent\"  type=\"" + types + "\" data-date=\"" + data.TaskDueDate + "\" data-val=\"" + data.Tid + "\" class=\"m-event\" style=\"color:black;top:50px !Important;font-size:11px;cursor:pointer;display:block\" title=\"Task: " + data.TaskName + "\"> <span class=\"evnts txt1 rectangleta\">Task</span </p><br>";
                    }
                }
                else
                {
                    objevt.text = "<p id=\"transferpageevent\"  data-date=\"" + data.TaskDueDate + "\" data-val=\"" + data.Tid + "\" class=\"m-event\" style=\"color:black;top:50px !Important;font-size:11px;cursor:pointer;display:block\" title=\"Task: " + data.TDetails + "\"> <span class=\"evnts txt1 rectangleta\">Task</span> </p><br>";
                }
                newItemtmp.TDetails = main.ToString();
                listremindtmp.Add(newItemtmp);
                objevt.type = "task";
                var datas = objdata2.Where(x => x.type == "task" && x.start_date == main).FirstOrDefault();
                if (datas == null)
                {
                    objdata2.Add(objevt);
                }
                //already exist
            }
            //mykase reminder
            List<usp_CalendarEventReminderList_Result> list1 = new List<usp_CalendarEventReminderList_Result>();
            list1 = db.usp_CalendarEventReminderList(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Convert.ToInt32(LoggedInUser.RoleId)).ToList();
            cntr22 = objdata2.Count() + 1;
            foreach (var data in list1.ToList())
            {
                DateTime eventDate;
                if (!DateTime.TryParse(Convert.ToString(data.EventDate), out eventDate))
                    continue;
                usp_CalendarEventReminderList_Result newItem = new usp_CalendarEventReminderList_Result();
                newItem.Rid = Convert.ToBase64String(QueryAES.EncryptAes(data.Rid.ToString()));
                list1[list1.IndexOf(data)].Rid = newItem.Rid;
                cntr22 = cntr22 + 1;
                caldata objevt = new caldata();
                objevt.id = cntr22;
                main = eventDate.ToString("MM/dd/yyyy");
                objevt.start_date = main;
                objevt.end_date = eventDate.AddDays(1).ToString("MM/dd/yyyy");
                var types = "";
                usp_CalendarEventReminderList_Result newItemtmp = new usp_CalendarEventReminderList_Result();
                objevt.text = "<p id=\"transferpagecalevent\"  data-date=\"" + data.EventDate + "\" data-val=\"" + data.Rid + "\" class=\"m-event\" style=\"color:black;top:50px !Important;font-size:11px;cursor:pointer;display:block\" title=\"Event: " + data.Details + "\"> <span class=\"evnts txt1 rectangle12\">Event</span> </p><br>";
                newItemtmp.Details = main.ToString();
                list1.Add(newItemtmp);
                objevt.type = "event";
                var datas = objdata2.Where(x => x.type == "event" && x.start_date == main).FirstOrDefault();
                if (datas == null)
                {
                    objdata2.Add(objevt);
                }
                //already exist
            }
            int finalcount2 = objdata2.Count() + 1;
            var cntr222 = objdata2.Count() + 1;

            //For Todo List Add In Calendar start
            List<Usp_GetToDoDetailsForCalendar_Result> list2 = new List<Usp_GetToDoDetailsForCalendar_Result>();
            list2 = db.Usp_GetToDoDetailsForCalendar(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Convert.ToInt32(LoggedInUser.RoleId), "").ToList();
            cntr22 = objdata2.Count() + 1;
            foreach (var data in list2.ToList())
            {
                DateTime dueDate;
                if (!DateTime.TryParse(Convert.ToString(data.duedate), out dueDate))
                    continue;
                Usp_GetToDoDetailsForCalendar_Result newItem = new Usp_GetToDoDetailsForCalendar_Result();
                newItem.Id = data.Id;
                list2[list2.IndexOf(data)].Id = newItem.Id;
                cntr22 = cntr22 + 1;
                caldata objevt = new caldata();
                objevt.id = cntr22;
                main = dueDate.ToString("MM/dd/yyyy");
                objevt.start_date = main;
                objevt.end_date = dueDate.AddDays(1).ToString("MM/dd/yyyy");
                var types = "";
                Usp_GetToDoDetailsForCalendar_Result newItemtmp = new Usp_GetToDoDetailsForCalendar_Result();
                objevt.text = "<p id=\"transferpagecaltodo\"  data-date=\"" + data.duedate + "\" data-val=\"" + data.Id + "\" class=\"m-event\" style=\"color:black;top:50px !Important;font-size:11px;cursor:pointer;display:block\" title=\"Event: " + data.asDetails + "\"> <span class=\"evnts txt1 rectangle13\">To Dos</span> </p><br>";
                newItemtmp.asDetails = main.ToString();
                list2.Add(newItemtmp);
                objevt.type = "ToDo";
                var datas = objdata2.Where(x => x.type == "ToDo" && x.start_date == main).FirstOrDefault();
                if (datas == null)
                {
                    objdata2.Add(objevt);
                }
                //already exist
            }
            // int finalcount2 = objdata2.Count() + 1;
            // var cntr222 = objdata2.Count() + 1;

            //ENd

            //mykase manual next hearing
            var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
            //for case order
            CalendarOrdrerCW(recentlyViewedOrder, strapiuser, "");
            //var dis_Dateorder = (from obj in recentlyViewedOrder select new { DisposedDate = obj.Disposeddt }).Distinct().ToList();
            var dis_Dateorder = (from obj in recentlyViewedOrder select new { DisposedDate = obj.Disposeddt, iid = obj.iid }).Distinct().ToList();
            foreach (var myevent1 in dis_Dateorder)
            {
                string disdt = Convert.ToString(myevent1.DisposedDate);
                DateTime orderDisposedDate;
                if (!DateTime.TryParse(disdt, out orderDisposedDate))
                    continue;
                caldata objdata = new caldata();
                main = orderDisposedDate.ToString("MM/dd/yyyy");
                objdata.start_date = main;
                var main12 = orderDisposedDate.AddDays(1).ToString("MM/dd/yyyy");
                objdata.end_date = main12;
                objdata.type = "Order";
                objdata.end_date = main12;
                objdata.text = "<p id=\"transferpageorder\"   class=\"m-event\" style=\"color:#069;top:70px !Important;font-size:10px;cursor:pointer;display:block\" title=\"Order\"  onclick=\"NextOrderbyUser('" + main + "');\"> <span class=\"evnts txt1 rectangle14\">Order</span> </p><br>";
                if (!String.IsNullOrEmpty(disdt))
                {
                    eventid = eventid + 1;
                    objdata.id = eventid;
                    objdata.type = "Order";
                    objdata2.Add(objdata);
                }
            }
            int it = 0;
            foreach (var data in objdata2.OrderBy(x => x.start_date).ToList())
            {
                it = it + 1;
                objdata2[objdata2.IndexOf(data)].id = it;
            }
            var result = objdata2.OrderBy(x => x.id).ToList();
            HttpContext.Cache.Insert(cacheKey, result, null, DateTime.Now.AddMinutes(5), TimeSpan.Zero);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Client calender data
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public JsonResult CalendardataClient()
        {
            var db = new LawPracticeEntities();
            int i = 0;
            List<caldata> objdata2 = new List<caldata>();
            var user = LoggedInUser.UserId;
            var userlist = db.AddLawMatterLists.Where(x => x.matterclientid.ToString() == user.ToString()).ToList();

            var usernames = userlist
                .Select(x => WebConfigurationManager.AppSettings["matteridname"] + x.firmuser.ToString())
                .Distinct()
                .ToList();

            foreach (var strusername in usernames)
            {
                // Get all hearing dates for this user (1 SP call)
                EventList dateList = CalendarEventController.CountCaseBYUserName(strusername);
                if (dateList == null || dateList.Count == 0) continue;

                // Pre-fetch next hearing ONCE before the loop (moved out from inner loop)
                EventList nextHearings = CalendarEventController.GetNextHearingByUser(strusername, "");

                foreach (var dateEntry in dateList)
                {
                    // Get events for this specific date (N calls, but no nesting anymore)
                    var eventList = CalendarEventController.GetCalendarEventByUserName1(dateEntry.username_, dateEntry.Disposeddt);
                    if (eventList == null || eventList.Count == 0) continue;

                    foreach (var myevent1 in eventList)
                    {
                        myevent1.LastFinaldate = Convert.ToDateTime(myevent1.start_date);
                        string s = string.Format("{0:D1}", Convert.ToDateTime(myevent1.start_date).ToString("MM"));
                        string s1 = Convert.ToDateTime(myevent1.start_date).ToString("dd");
                        string y1 = Convert.ToDateTime(myevent1.start_date).ToString("yyyy");
                        string main = s + "/" + s1 + "/" + y1;
                        myevent1.start_date = main;

                        if (eventList.Count > 1)
                            myevent1.text = myevent1.Casetype + ' ' + myevent1.CaseNo + '/' + myevent1.Caseyear + " (" + myevent1.Disposeddt + ") - " + myevent1.Court + "  <br /> <a class=\"more\" href=\"#\" data-toggle=\"modal\" data-target=\"#modalDatebindBysuser\" name=\"register\" onclick=\"DateUservalue('" + myevent1.LastFinaldate + "');\">More</a> ";
                        else
                            myevent1.text = "<a class=\"txt\" href=\"#\" data-toggle=\"modal\" data-target=\"#modalDatebindBysuser\" name=\"register\" onclick=\"DateUservalue('" + myevent1.LastFinaldate + "');\">" + myevent1.Casetype + ' ' + myevent1.CaseNo + '/' + myevent1.Caseyear + " (" + myevent1.Disposeddt + ") - " + myevent1.Court + " </a> ";

                        // Next hearing: only for first date, using pre-fetched results
                        if (i == 0 && nextHearings != null)
                        {
                            foreach (var nh in nextHearings)
                            {
                                string ns = string.Format("{0:D1}", Convert.ToDateTime(nh.Disposeddt).ToString("MM"));
                                string ns1 = Convert.ToDateTime(nh.Disposeddt).ToString("dd");
                                string ny1 = Convert.ToDateTime(nh.Disposeddt).ToString("yyyy");
                                nh.start_date = ns + "/" + ns1 + "/" + ny1;

                                string nhText = (nextHearings.Count > 1)
                                    ? nh.Casetype + " " + nh.CaseNo + "/" + nh.Caseyear + " (" + nh.Disposeddt + ") " + "<a class=\"more\" href=\"#\" data-toggle=\"modal\" data-target=\"#modalDatebindBysuser\" name=\"register\" onclick=\"NexthearingbyUser('" + nh.Disposeddt + "');\">More Next Hearing</a>"
                                    : "<a class=\"more\" href=\"#\" data-toggle=\"modal\" data-target=\"#modalDatebindBysuser\" name=\"register\" onclick=\"NexthearingbyUser('" + nh.Disposeddt + "');\">" + nh.Casetype + " " + nh.CaseNo + "/" + nh.Caseyear + " (" + nh.Disposeddt + ") Next Hearing</a>";

                                caldata nhObj = new caldata();
                                nhObj.id = nh.id;
                                nhObj.start_date = nh.start_date;
                                nhObj.end_date = nh.start_date;
                                nhObj.text = nhText;
                                objdata2.Add(nhObj);
                                i = 1;
                                break;
                            }
                        }

                        caldata objdata = new caldata();
                        objdata.id = myevent1.id;
                        objdata.start_date = myevent1.start_date;
                        objdata.end_date = myevent1.start_date;
                        objdata.text = myevent1.text;
                        objdata2.Add(objdata);
                        break;
                    }
                }
            }
            return Json(objdata2, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Get calender event detail by username
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        [HttpPost]
        public JsonResult CalendarViewDataDetail()
        {
            dynamic strdetail = "";
            EventList recentlyViewedEvent1;
            dynamic str = null;
            EventList recentlyViewedEvent = NJDGDetail.Controllers.CalendarEventController.CountCaseBYUserName(Convert.ToString(QueryAES.UrlDecode(Request.Form["id"])));
            foreach (var myevent in recentlyViewedEvent)
            {
                recentlyViewedEvent1 = NJDGDetail.Controllers.CalendarEventController.GetCalendarEventByUserName1(Convert.ToString(myevent.username_), myevent.Disposeddt);
                str = recentlyViewedEvent1.ToList();
            }
            return Json(str, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Get calender view details by user map id
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        [HttpPost]
        public JsonResult CalendarViewDataDetailByUserMapId()
        {
            int i = 0;
            dynamic strdetail = "";
            dynamic str = null;
            EventList recentlyViewedEvent1;
            EventList recentlyViewedEvent = NJDGDetail.Controllers.CalendarEventController.CountCaseBYUserName("1594");
            foreach (var myevent in recentlyViewedEvent)
            {
                recentlyViewedEvent1 = NJDGDetail.Controllers.CalendarEventController.GetCalendarEventByUserName1(Convert.ToString(myevent.username_), myevent.Disposeddt);
                str = recentlyViewedEvent1.ToList();
            }
            return Json(str, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Show nexthearing date in calender view
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        [HttpPost]
        public JsonResult CalendarViewDataDetailNxtHeardt()
        {
            dynamic strdetail = "";
            EventList recentlyViewedEvent3 = CalendarEventController.GetDistinctNextHearingByUser(Convert.ToString(LoggedInUser.UserId), "");
            var str1 = "";
            foreach (var myevent3 in recentlyViewedEvent3)
            {
                EventList recentlyViewedEvent2 = CalendarEventController.GetNextHearingByUser(Convert.ToString(LoggedInUser.UserId), myevent3.Disposeddt);
                foreach (var myevent2 in recentlyViewedEvent2)
                {
                    if (recentlyViewedEvent2.Count > 0)
                    {
                        if (recentlyViewedEvent2.Count > 1)
                        {
                            str1 = myevent2.Casetype + " " + myevent2.CaseNo + "/" + myevent2.Caseyear + " (" + myevent2.Disposeddt + ") " + "<a class=\"more\" href=\"#\" data-toggle=\"modal\" data-target=\"#modalDatebindBysuser\" name=\"register\" onclick=\"NexthearingbyUser('" + myevent2.Disposeddt + "');\">" + "More Next Hearing</a>";//" Next Hearing";
                        }
                        else
                        {
                            str1 = "<a class=\"more\" href=\"#\" data-toggle=\"modal\" data-target=\"#modalDatebindBysuser\" name=\"register\" onclick=\"NexthearingbyUser('" + myevent2.Disposeddt + "');\">" + myevent2.Casetype + " " + myevent2.CaseNo + "/" + myevent2.Caseyear + " (" + myevent2.Disposeddt + ") " + "Next Hearing</a>";//" Next Hearing";
                        }
                    }
                }
            }
            return Json(str1, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Calender details
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult CalendarDetail()
        {
            return View();
        }
        /// <summary>
        /// Get case detail by date
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult CaseDetailsByDate()
        {
            var path = Request.Url.AbsolutePath;
            var strdt = path.Split('/').Last();
            ViewBag.id = strdt;
            return View();
        }
        /// <summary>
        /// Get All Mapped cases by FirmID and userid
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public JsonResult CaseDetails()
        {
            var db = new LawPracticeEntities();
            var path = Request.Url.AbsolutePath;
            var strdt = path.Split('/').Last();
            strdt = System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String(strdt));
            dynamic str = null;
            var user = LoggedInUser.UserId;
            var firmids = LoggedInUser.FirmId;
            var rolesuser = LoggedInUser.RoleId;
            var joined = "";
            var userlist = db.AddLawMatterLists.Where(x => x.matterclientid.ToString() == user.ToString()).ToList();
            if (rolesuser.ToString() == "3")
            {
                joined = db.sp_GetAllMappedcasesbyFirmID(firmids.ToString(), user.ToString()).FirstOrDefault();
            }
            else
            {
                joined = db.sp_GetAllMappedcasesbyFirmID(firmids.ToString(), user.ToString()).FirstOrDefault();
            }
            joined = joined.TrimEnd(',');
            joined = joined.Replace(",", "','");
            string matteridlist = joined.ToString();
            var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
            //add login data
            var addfClient = new WebClient();
            object rawfile = new
            {
                accesstoken = "mykase123456789abcdef",
                userid = WebConfigurationManager.AppSettings["matteridname"] + user,
                date = strdt,
                id = matteridlist,
            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/ShowMasterCaseBYUserNameLawPracticePopup"), "POST", builders);
            JObject jObject = JObject.Parse(resid);
            dynamic data1 = jObject["data"];
            List<CalendarOrderList> orderlist = new List<CalendarOrderList>();
            for (int i = 0; i < data1.Count; i++)
            {
                dynamic data = JObject.Parse(resid);
                string status = data.Status;
                string Message = data.Message;
                string Casetype = data.data[i].casetype;
                string CaseNo = data.data[i].vCaseNo;
                string Caseyear = data.data[i].vCaseYear;
                string Casename = data.data[i].vCaseName;
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
                string Disposeddt = data.data[i].vDisposedDate;
                if (String.IsNullOrEmpty(Disposeddt))
                {
                    Disposeddt = "";
                }
                string strfile = data.data[i].vLocalFile;
                if (String.IsNullOrEmpty(strfile))
                {
                    strfile = "";
                }
                //    // Add parts to the list.
                orderlist.Add(new CalendarOrderList { Casetype = Casetype, CaseNo = CaseNo, Caseyear = Caseyear, Casename = Casename, Advname = Advname, Court = Court, Disposeddt = Disposeddt, strfile = strfile });
            }
            return Json(orderlist, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Next hearing by user
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult NextHearingByUser()
        {
            var path = Request.Url.AbsolutePath;
            var strdt = path.Split('/').Last();
            ViewBag.id = strdt;
            return View();
        }
        /// <summary>
        /// Get next hearing date by username
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public JsonResult NextHearing()
        {
            var path = Request.Url.AbsolutePath;
            var strdt = path.Split('/').Last();
            strdt = System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String(strdt));
            var db = new LawPracticeEntities();
            EventList recentlyViewedEvent1 = CalendarEventController.GetNextHearingByUser(LoggedInUser.UserName.ToString(), strdt);
            dynamic str = null;
            foreach (var myevent1 in recentlyViewedEvent1)
            {
                str = recentlyViewedEvent1.ToList();
            }
            return Json(str, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Get nexthearing details by client id
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult NextHearingByClient()
        {
            var path = Request.Url.AbsolutePath;
            var strdt = path.Split('/').Last();
            ViewBag.id = strdt;
            var htype = Request.QueryString["type"];
            ViewBag.htype = htype;
            return View();
        }
        /// <summary>
        /// Next hearing by client
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public JsonResult NextHearingClient()
        {
            var path = Request.Url.AbsolutePath;
            var strdt = path.Split('/').Last();
            dynamic str = null;
            var firmids = LoggedInUser.FirmId;
            strdt = System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String(strdt));
            var username = "";
            var db = new LawPracticeEntities();
            var user = LoggedInUser.UserId;
            var rolesuser = LoggedInUser.RoleId;
            var joined = "";
            string strusername = WebConfigurationManager.AppSettings["matteridname"];
            joined = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
            string matteridlist = joined.ToString();
            var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
            var htype = Request.QueryString["type"];
            //if (htype == "Disposed") htype = "";
            if (htype == "Disposed" || htype == "All" || string.IsNullOrEmpty(htype))
            {
                htype = "";
            }
            var courttype = "";
            if (htype == "RERA")
            {
                courttype = "RERA";
            }
            //add login data
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
                userIdDetail = matteridlist;
            }

            var addfClient = new WebClient();
            object rawfile = new
            {
                accesstoken = AccessTokenDetail,
                userid = userIdDetail,
                date = strdt,
                id = "",
                hearingtype = htype,
                courttype = courttype
            };
            addfClient.Encoding = System.Text.Encoding.UTF8;
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/ShowNextHearingDateLawPracticePopup"), "POST", builders);
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
                string Casetype = data.data[i].casetype;
                string CaseNo = data.data[i].vCaseNo;
                string Caseyear = data.data[i].vCaseYear;
                string Casename = data.data[i].vCaseName;
                string DiaryNo = data.data[i].DiaryNo;
                string nexthearing = data.data[i].vordernexthearing;
                string ManualNexthearing = data.data[i].ManualNexthearing;
                string tempusercaseid = data.data[i].ifid;
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
                string Disposeddt = data.data[i].vNextHearing;
                if (String.IsNullOrEmpty(Disposeddt))
                {
                    Disposeddt = "";
                }
                else
                {
                    try
                    {
                        var _dts = DateTime.Parse(Disposeddt);
                        Disposeddt = _dts.ToString("dd MMM yyyy");
                    }
                    catch (Exception er)
                    {
                    }
                }
                string strfile = data.data[i].vLocalFile;
                if (String.IsNullOrEmpty(strfile))
                {
                    strfile = "";
                }
                if (!String.IsNullOrEmpty(DiaryNo))
                {
                    DiaryNo = DiaryNo.Trim();
                }
                string csno = data.data[i].csno;
                // Add parts to the list.
                orderlist.Add(new CalendarOrderList
                {
                    Casetype = Casetype,
                    CaseNo = CaseNo,
                    Caseyear = Caseyear,
                    Casename = Casename,
                    Advname = Advname,
                    Court = Court,
                    Disposeddt = Disposeddt,
                    strfile = strfile,
                    DiaryNo = DiaryNo,
                    csno = csno,
                    Vordernexthearing = nexthearing,
                    ManualNexthearing = ManualNexthearing,
                    IsReraCheck = Recracheck,
                    UserCaseId = tempusercaseid
                });
            }
            var orderlists = new { OrdLists = orderlist, IsReraCHeck = Recracheck };
            return Json(orderlists, JsonRequestBehavior.AllowGet);
        }

        //New Next Hearing Data Date Wise
        [FirmControllerAuthorization]
        public ActionResult NextHeringDataDateWise()
        {
            JObject ui = new JObject();

            try
            {
                var path = Request.Url.AbsolutePath;
                var strdtBase64 = path.Split('/').Last();

                // Decode date safely
                string strdt;
                try
                {
                    strdt = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(strdtBase64));
                }
                catch
                {
                    ui["Status"] = false;
                    ui["Message"] = "Invalid date value in URL.";
                    ui["OrdLists"] = new JArray();
                    return Content(ui.ToString(Newtonsoft.Json.Formatting.None), "application/json");
                }

                var db = new LawPracticeEntities();
                string strusername = WebConfigurationManager.AppSettings["matteridname"];

                var joined = db.usp_GetUnderUserListById(
                    LoggedInUser.FirmId.ToString(),
                    LoggedInUser.UserId.ToString(),
                    strusername
                ).FirstOrDefault();

                string matteridlist = joined ?? "";
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];

                // login data
                string AccessTokenDetail;
                string userIdDetail;

                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = matteridlist;
                }

                object rawfile = new
                {
                    accesstoken = AccessTokenDetail,
                    userid = userIdDetail,
                    date = strdt
                };

                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

                JObject apiResp;
                using (var addfClient = new WebClient())
                {
                    addfClient.Encoding = System.Text.Encoding.UTF8;
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");

                    string builders = JsonConvert.SerializeObject(rawfile);
                    var resid = addfClient.UploadString(
                        new Uri(apiUrl + "/API/Search/ShowNextHearingDataDateWise"),
                        "POST",
                        builders
                    );

                    apiResp = JObject.Parse(resid);
                }

                // Convert API response => UI response
                var listToken = apiResp["data"];
                bool hasData = listToken != null && listToken.Type == JTokenType.Array && listToken.HasValues;

                ui["Status"] = (apiResp["Status"] ?? true);
                ui["Message"] = (apiResp["Message"] ?? "");
                ui["OrdLists"] = hasData ? listToken : new JArray(); // always array

                return Content(ui.ToString(Newtonsoft.Json.Formatting.None), "application/json");
            }
            catch (Exception ex)
            {
                ui["Status"] = false;
                ui["Message"] = ex.Message;
                ui["OrdLists"] = new JArray();
                return Content(ui.ToString(Newtonsoft.Json.Formatting.None), "application/json");
            }
        }



        public ActionResult NextHeringDataDateWiseDowmloadPdf()
        {
            JObject ui = new JObject();

            try
            {
                var path = Request.Url.AbsolutePath;
                var strdtBase64 = path.Split('/').Last();

                // Decode date safely
                string strdt;
                try
                {
                    strdt = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(strdtBase64));
                }
                catch
                {
                    ui["Status"] = false;
                    ui["Message"] = "Invalid date value in URL.";
                    ui["OrdLists"] = new JArray();
                    return Content(ui.ToString(Newtonsoft.Json.Formatting.None), "application/json");
                }

                var db = new LawPracticeEntities();
                string strusername = WebConfigurationManager.AppSettings["matteridname"];

                var joined = db.usp_GetUnderUserListById(
                    LoggedInUser.FirmId.ToString(),
                    LoggedInUser.UserId.ToString(),
                    strusername
                ).FirstOrDefault();

                string matteridlist = joined ?? "";
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];

                // login data
                string AccessTokenDetail;
                string userIdDetail;

                string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = matteridlist;
                }

                object rawfile = new
                {
                    accesstoken = AccessTokenDetail,
                    userid = userIdDetail,
                    date = strdt
                };

                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

                JObject apiResp;
                using (var addfClient = new WebClient())
                {
                    addfClient.Encoding = System.Text.Encoding.UTF8;
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");

                    string builders = JsonConvert.SerializeObject(rawfile);
                    var resid = addfClient.UploadString(
                        new Uri(apiUrl + "/API/Search/ShowNextHearingDataDateWise"),
                        "POST",
                        builders
                    );

                    apiResp = JObject.Parse(resid);
                }

                // Convert API response => UI response
                var listToken = apiResp["data"];
                bool hasData = listToken != null && listToken.Type == JTokenType.Array && listToken.HasValues;

                ui["Status"] = (apiResp["Status"] ?? true);
                ui["Message"] = (apiResp["Message"] ?? "");
                ui["OrdLists"] = hasData ? listToken : new JArray(); // always array

                return Content(ui.ToString(Newtonsoft.Json.Formatting.None), "application/json");
            }
            catch (Exception ex)
            {
                ui["Status"] = false;
                ui["Message"] = ex.Message;
                ui["OrdLists"] = new JArray();
                return Content(ui.ToString(Newtonsoft.Json.Formatting.None), "application/json");
            }
        }

        ////New Next Hearing Data Date Wise
        //[FirmControllerAuthorization]
        //public ActionResult NextHeringDataDateWise()
        //{
        //    JObject ui = new JObject();

        //    try
        //    {
        //        var path = Request.Url.AbsolutePath;
        //        var strdtBase64 = path.Split('/').Last();

        //        // Decode date safely
        //        string strdt;
        //        try
        //        {
        //            strdt = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(strdtBase64));
        //        }
        //        catch
        //        {
        //            ui["Status"] = false;
        //            ui["Message"] = "Invalid date value in URL.";
        //            ui["OrdLists"] = new JArray();
        //            return Content(ui.ToString(Newtonsoft.Json.Formatting.None), "application/json");
        //        }

        //        var db = new LawPracticeEntities();
        //        string strusername = WebConfigurationManager.AppSettings["matteridname"];

        //        var joined = db.usp_GetUnderUserListById(
        //            LoggedInUser.FirmId.ToString(),
        //            LoggedInUser.UserId.ToString(),
        //            strusername
        //        ).FirstOrDefault();

        //        string matteridlist = joined ?? "";
        //        var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];

        //        // login data
        //        string AccessTokenDetail;
        //        string userIdDetail;

        //        string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
        //        if (IsCaseWatchUser == "1")
        //        {
        //            userIdDetail = LoggedInUser.UserName.ToString();
        //            AccessTokenDetail = "internal";
        //        }
        //        else
        //        {
        //            AccessTokenDetail = "mykase123456789abcdef";
        //            userIdDetail = matteridlist;
        //        }

        //        object rawfile = new
        //        {
        //            accesstoken = AccessTokenDetail,
        //            userid = userIdDetail,
        //            date = strdt
        //        };

        //        ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

        //        JObject apiResp;
        //        using (var addfClient = new WebClient())
        //        {
        //            addfClient.Encoding = System.Text.Encoding.UTF8;
        //            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");

        //            string builders = JsonConvert.SerializeObject(rawfile);
        //            var resid = addfClient.UploadString(
        //                new Uri(apiUrl + "/API/Search/ShowNextHearingDataDateWise"),
        //                "POST",
        //                builders
        //            );

        //            apiResp = JObject.Parse(resid);
        //        }

        //        // Convert API response => UI response
        //        var listToken = apiResp["data"];
        //        bool hasData = listToken != null && listToken.Type == JTokenType.Array && listToken.HasValues;

        //        ui["Status"] = (apiResp["Status"] ?? true);
        //        ui["Message"] = (apiResp["Message"] ?? "");
        //        ui["OrdLists"] = hasData ? listToken : new JArray(); // always array

        //        return Content(ui.ToString(Newtonsoft.Json.Formatting.None), "application/json");
        //    }
        //    catch (Exception ex)
        //    {
        //        ui["Status"] = false;
        //        ui["Message"] = ex.Message;
        //        ui["OrdLists"] = new JArray();
        //        return Content(ui.ToString(Newtonsoft.Json.Formatting.None), "application/json");
        //    }
        //}



        //public ActionResult NextHeringDataDateWiseDowmloadPdf()
        //{
        //    JObject ui = new JObject();

        //    try
        //    {
        //        var path = Request.Url.AbsolutePath;
        //        var strdtBase64 = path.Split('/').Last();

        //        // Decode date safely
        //        string strdt;
        //        try
        //        {
        //            strdt = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(strdtBase64));
        //        }
        //        catch
        //        {
        //            ui["Status"] = false;
        //            ui["Message"] = "Invalid date value in URL.";
        //            ui["OrdLists"] = new JArray();
        //            return Content(ui.ToString(Newtonsoft.Json.Formatting.None), "application/json");
        //        }

        //        var db = new LawPracticeEntities();
        //        string strusername = WebConfigurationManager.AppSettings["matteridname"];

        //        var joined = db.usp_GetUnderUserListById(
        //            LoggedInUser.FirmId.ToString(),
        //            LoggedInUser.UserId.ToString(),
        //            strusername
        //        ).FirstOrDefault();

        //        string matteridlist = joined ?? "";
        //        var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];

        //        // login data
        //        string AccessTokenDetail;
        //        string userIdDetail;

        //        string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
        //        if (IsCaseWatchUser == "1")
        //        {
        //            userIdDetail = LoggedInUser.UserName.ToString();
        //            AccessTokenDetail = "internal";
        //        }
        //        else
        //        {
        //            AccessTokenDetail = "mykase123456789abcdef";
        //            userIdDetail = matteridlist;
        //        }

        //        object rawfile = new
        //        {
        //            accesstoken = AccessTokenDetail,
        //            userid = userIdDetail,
        //            date = strdt
        //        };

        //        ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

        //        JObject apiResp;
        //        using (var addfClient = new WebClient())
        //        {
        //            addfClient.Encoding = System.Text.Encoding.UTF8;
        //            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");

        //            string builders = JsonConvert.SerializeObject(rawfile);
        //            var resid = addfClient.UploadString(
        //                new Uri(apiUrl + "/API/Search/ShowNextHearingDataDateWise"),
        //                "POST",
        //                builders
        //            );

        //            apiResp = JObject.Parse(resid);
        //        }

        //        // Convert API response => UI response
        //        var listToken = apiResp["data"];
        //        bool hasData = listToken != null && listToken.Type == JTokenType.Array && listToken.HasValues;

        //        ui["Status"] = (apiResp["Status"] ?? true);
        //        ui["Message"] = (apiResp["Message"] ?? "");
        //        ui["OrdLists"] = hasData ? listToken : new JArray(); // always array

        //        return Content(ui.ToString(Newtonsoft.Json.Formatting.None), "application/json");
        //    }
        //    catch (Exception ex)
        //    {
        //        ui["Status"] = false;
        //        ui["Message"] = ex.Message;
        //        ui["OrdLists"] = new JArray();
        //        return Content(ui.ToString(Newtonsoft.Json.Formatting.None), "application/json");
        //    }
        //}

        //public JsonResult NextHeringDataDateWise()
        //{
        //    JObject jObject = new JObject();

        //    try
        //    {
        //        var path = Request.Url.AbsolutePath;
        //        var strdtBase64 = path.Split('/').Last();

        //        // Decode base64 date safely
        //        string strdt;
        //        try
        //        {
        //            strdt = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(strdtBase64));
        //        }
        //        catch
        //        {
        //            jObject["Status"] = false;
        //            jObject["Message"] = "Invalid date value in URL.";
        //            jObject["data"] = new JArray();
        //            return Json(jObject, JsonRequestBehavior.AllowGet);
        //        }

        //        var db = new LawPracticeEntities();

        //        string strusername = WebConfigurationManager.AppSettings["matteridname"];

        //        var joined = db.usp_GetUnderUserListById(
        //            LoggedInUser.FirmId.ToString(),
        //            LoggedInUser.UserId.ToString(),
        //            strusername
        //        ).FirstOrDefault();

        //        string matteridlist = joined ?? "";

        //        var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];

        //        // login data
        //        string AccessTokenDetail;
        //        string userIdDetail;

        //        string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
        //        if (IsCaseWatchUser == "1")
        //        {
        //            userIdDetail = LoggedInUser.UserName.ToString();
        //            AccessTokenDetail = "internal";
        //        }
        //        else
        //        {
        //            AccessTokenDetail = "mykase123456789abcdef";
        //            userIdDetail = matteridlist;
        //        }

        //        // payload (keep property names as API expects)
        //        object rawfile = new
        //        {
        //            accesstoken = AccessTokenDetail,
        //            userid = userIdDetail,
        //            date = strdt
        //        };

        //        ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

        //        using (var addfClient = new WebClient())
        //        {
        //            addfClient.Encoding = System.Text.Encoding.UTF8;
        //            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");

        //            string builders = JsonConvert.SerializeObject(rawfile);

        //            var resid = addfClient.UploadString(
        //                new Uri(apiUrl + "/API/Search/ShowNextHearingDataDateWise"),
        //                "POST",
        //                builders
        //            );

        //            jObject = JObject.Parse(resid);
        //        }

        //        return Json(jObject, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception ex)
        //    {
        //        jObject["Status"] = false;
        //        jObject["Message"] = ex.Message; // or "Something went wrong"
        //        jObject["data"] = new JArray();
        //        return Json(jObject, JsonRequestBehavior.AllowGet);
        //    }
        //}



        /// <summary>
        /// Case detail by date firm
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult CaseDetailsByDatefirm()
        {
            var path = Request.Url.AbsolutePath;
            var strdt = path.Split('/').Last();
            ViewBag.id = strdt;
            return View();
        }
        /// <summary>
        /// Case firm details
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public JsonResult CaseDetailsfirm()
        {
            var db = new LawPracticeEntities();
            var path = Request.Url.AbsolutePath;
            var strdt = path.Split('/').Last();
            strdt = System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String(strdt));
            dynamic str = null;
            string strusername = WebConfigurationManager.AppSettings["matteridname"];
            dynamic user = "";
            string joined = "";
            var userids = db.AddLawMatterLists.Where(x => x.firmuser.ToString() == LoggedInUser.UserId.ToString() || x.assignto.ToString() == LoggedInUser.UserId.ToString()).Select(x => new { x.firmuser }).Distinct().ToList();
            foreach (var itemid in userids)
            {
                joined += strusername + itemid.firmuser + ",";
            }
            joined = joined.TrimEnd(',');
            joined = joined.Replace(",", "','");
            user = joined.ToString();
            EventList recentlyViewedEvent1 = CalendarEventController.GetCalendarEventByUserName1(user, strdt);
            foreach (var myevent1 in recentlyViewedEvent1)
            {
                myevent1.text = "";
                myevent1.text = myevent1.Casetype + " " + myevent1.CaseNo + "/" + myevent1.Caseyear;
                str = recentlyViewedEvent1.ToList();
            }
            return Json(str, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Get next hearing by firm user
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult NextHearingByUserfirm()
        {
            var path = Request.Url.AbsolutePath;
            var strdt = path.Split('/').Last();
            ViewBag.id = strdt;
            return View();
        }
        /// <summary>
        /// Get next hearing firm details
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public JsonResult NextHearingfirm()
        {
            string joined = "";
            string matteridlist = "";
            var matterid = db.AddLawMatterLists.Where(x => x.assignto.ToString() == LoggedInUser.UserId.ToString()).Select(x => new { x.Id }).ToList();
            foreach (var itemid in matterid)
            {
                joined += itemid.Id + ",";
            }
            joined = joined.TrimEnd(',');
            joined = joined.Replace(",", "','");
            matteridlist = joined.ToString();
            var path = Request.Url.AbsolutePath;
            var strdt = path.Split('/').Last();
            strdt = System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String(strdt));
            EventList recentlyViewedEvent1 = CalendarEventController.GetNextHearingByUser(WebConfigurationManager.AppSettings["matteridname"] + LoggedInUser.UserId.ToString(), strdt);
            dynamic str = null;
            foreach (var myevent1 in recentlyViewedEvent1)
            {
                str = recentlyViewedEvent1.ToList();
            }
            return Json(str, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Download custom form
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Client")]
        public ActionResult Customformdownload()
        {
            try
            {
                var wftoken1 = QueryAES.UrlDecode(Request.Form["wftoken"]);
                var ftoken = QueryAES.UrlDecode(Request.Form["ftoken"]);
                ViewBag.ftoken = ftoken;
                ViewBag.wftoken = wftoken1;
                string wftokens = QueryAES.DecryptStringAES(wftoken1);
                var db = new LawPracticeEntities();
                var workflowname = db.tblWorkFlows.Where(x => x.id.ToString() == wftokens.ToString()).FirstOrDefault();
                ViewBag.wfname = workflowname.WorkFlowName;
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Client), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Client), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            return View();
        }

        /// <summary>
        /// View Custom Form List
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Client")]
        public ActionResult Customform()
        {
            try
            {
                var wftoken1 = QueryAES.UrlDecode(Request.Form["wftoken"]);
                var ftoken = QueryAES.UrlDecode(Request.Form["ftoken"]);
                ViewBag.ftoken = ftoken;
                ViewBag.wftoken = wftoken1;
                string wftokens = QueryAES.DecryptStringAES(wftoken1);
                var db = new LawPracticeEntities();
                var workflowname = db.tblWorkFlows.Where(x => x.id.ToString() == wftokens.ToString()).FirstOrDefault();
                ViewBag.wfname = workflowname.WorkFlowName;
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Client), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Client), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            return View();
        }
        /// <summary>
        /// Preview live page
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [AuthLog(Roles = "Client")]
        public ActionResult LivePagePreview(string id)
        {
            ViewBag.filesize = ConfigurationManager.AppSettings["filesize"];
            try
            {
                var wftoken1 = QueryAES.UrlDecode(Request.Form["wftoken"]);
                var ftoken = QueryAES.UrlDecode(Request.Form["ftoken"]);
                ViewBag.ftoken = ftoken;
                ViewBag.wftoken = wftoken1;
                string wftokens = QueryAES.DecryptStringAES(wftoken1);
                var db = new LawPracticeEntities();
                var workflowname = db.tblWorkFlows.Where(x => x.id.ToString() == wftokens.ToString()).FirstOrDefault();
                ViewBag.wfname = workflowname.WorkFlowName;
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Client), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Client), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            return View();
        }
        /// <summary>
        /// Send custom form mail
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Client")]
        public ActionResult CustomFormSendmail()
        {
            return View();
        }
        /// <summary>
        /// Update custom form details
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [AuthLog(Roles = "Client")]
        public ActionResult CustomFormDataUpdate(string id)
        {
            ViewBag.filesize = ConfigurationManager.AppSettings["filesize"];
            try
            {
                var wftoken1 = QueryAES.UrlDecode(Request.Form["wftoken"]);
                var ftoken = QueryAES.UrlDecode(Request.Form["ftoken"]);
                var cid = QueryAES.UrlDecode(Request.Form["cid"]);
                ViewBag.cid = cid;
                ViewBag.ftoken = ftoken;
                ViewBag.wftoken = wftoken1;
                string wftokens = QueryAES.DecryptStringAES(wftoken1);
                var db = new LawPracticeEntities();
                var workflowname = db.tblWorkFlows.Where(x => x.id.ToString() == wftokens.ToString()).FirstOrDefault();
                ViewBag.wfname = workflowname.WorkFlowName;
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Client), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Client), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            return View(id);
        }
        /// <summary>
        /// View case details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Client")]
        public ActionResult VCaseDetails()
        {
            var path = Request.Url.AbsolutePath;
            var strdt = path.Split('/').Last();
            strdt = QueryAES.ConvertHexToString(strdt, System.Text.Encoding.Unicode);
            strdt = QueryAES.DecryptStringAES(strdt);
            ViewBag.id = strdt;
            return View();
        }
        /// <summary>
        /// View matter case details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Client")]
        public ActionResult CaseDetailsmatter()
        {
            try
            {
                var strdt = QueryAES.UrlDecode(Request.Form["token"]);
                ViewBag.token = strdt;
                strdt = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(strdt.ToString()));
                dynamic strdetail = "";
                EventList recentlyViewedEvent1;
                dynamic str = null;
                dynamic username = null;
                dynamic courtname = null;
                Userlist struser = CalendarEventController.GetCaseDataByCaseIdLawPractice(strdt.ToString());
                foreach (var myevent2 in struser)
                {
                    username = myevent2.name;
                    courtname = myevent2.vCourt;
                }
                ViewBag.username = username;
                ViewBag.courtname = courtname;
                ViewBag.iid = strdt;
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Client), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Client), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            return View();
        }

        /// <summary>
        /// Compose New  message full screen
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Client")]
        public ActionResult ComposeNewMessage()
        {
            try
            {
                ViewBag.filesize = ConfigurationManager.AppSettings["filesizemultiple"];
                var user = LoggedInUser.FirmId;
                var firmusers = (from c in db.FirmUsers
                                 join d in db.Roles on c.RoleId equals d.ID
                                 where c.Firmid.ToString() == user.ToString() && c.IsActive == true
                                 && c.RoleId.ToString() != "3"
                                 select new
                                 {
                                     label = c.UserName + " -( " + d.RoleName + " )",
                                     val = c.Id,
                                     roleid = c.RoleId,
                                     role = d.RoleName
                                 }).ToList();
                var firmusers1 = (from c in db.FirmUsers
                                  join d in db.Roles on c.RoleId equals d.ID
                                  where c.Firmid.ToString() == user.ToString() && c.IsActive == true
                                  && c.Id == LoggedInUser.UserId
                                  select new
                                  {
                                      label = c.UserName + " -( " + d.RoleName + " )",
                                      val = c.Id,
                                      roleid = c.RoleId,
                                      role = d.RoleName
                                  }).ToList();
                var list = firmusers.Concat(firmusers1).ToList();
                ViewBag.Fruits = list;
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Client), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Client), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            return View();
        }
        /// <summary>
        /// Reply message
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization()]
        public ActionResult ReplySentMessage()
        {
            try
            {
                ViewBag.filesize = ConfigurationManager.AppSettings["filesizemultiple"];
                var user = LoggedInUser.FirmId;
                var firmusers = (from c in db.FirmUsers
                                 join d in db.Roles on c.RoleId equals d.ID
                                 where c.Firmid.ToString() == user.ToString() && c.IsActive == true
                                 select new
                                 {
                                     label = c.UserName + " -( " + d.RoleName + " )",
                                     val = c.Id,
                                     roleid = c.RoleId,
                                     role = d.RoleName
                                 }).ToList();
                ViewBag.Fruits = firmusers;
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Client), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Client), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            return View();
        }

        /// <summary>
        /// Compose Message
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Client")]
        public ActionResult ComposeMessage()
        {
            try
            {
                var wftoken1 = QueryAES.UrlDecode(Request.Form["token"]);
                if (wftoken1 != "")
                {
                    wftoken1 = wftoken1.ToString().Replace(" ", "+");
                }
                ViewBag.tokenid = wftoken1;
                var user = LoggedInUser.FirmId;
                var firmusers = (from c in db.FirmUsers
                                 join d in db.Roles on c.RoleId equals d.ID
                                 where c.Firmid.ToString() == user.ToString() && c.IsActive == true
                                 select new
                                 {
                                     label = c.UserName + " -( " + d.RoleName + " )",
                                     val = c.Id,
                                     roleid = c.RoleId,
                                     role = d.RoleName
                                 }).ToList();
                ViewBag.Fruits = firmusers;
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Client), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Client), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            return View();
        }
        /// <summary>
        /// Configure message
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Client")]
        public ActionResult ConfigMessage()
        {
            try
            {
                var user = LoggedInUser.FirmId;
                var firmusers = (from c in db.FirmUsers
                                 join d in db.Roles on c.RoleId equals d.ID
                                 where c.Firmid.ToString() == user.ToString() && c.IsActive == true
                                 select new
                                 {
                                     label = c.UserName + " -( " + d.RoleName + " )",
                                     val = c.Id,
                                     roleid = c.RoleId,
                                     role = d.RoleName
                                 }).ToList();
                ViewBag.Fruits = firmusers;
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Client), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Client), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            return View();
        }
        /// <summary>
        /// Get configure message list
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Client")]
        public ActionResult ConfigMessageList()
        {
            try
            {
                ViewBag.pagesize = System.Configuration.ConfigurationManager.AppSettings["pagesize"];
                var typeid = Request.Url.Segments[4];
                var db = new LawPracticeEntities();
                var data = db.tbl_notification.Where(x => x.typeid.ToString() == typeid.ToString() && x.Firmid.ToString() == LoggedInUser.FirmId.ToString() && x.auser.ToString() == LoggedInUser.UserId.ToString()).FirstOrDefault();
                if (data != null)
                {
                    data.status = 1;
                    db.Entry(data).State = EntityState.Modified;
                    db.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Client), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Client), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            return View();
        }
        /// <summary>
        /// Get archive message list details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Client")]
        public ActionResult ArchiveMessageList()
        {
            try
            {
                ViewBag.pagesize = System.Configuration.ConfigurationManager.AppSettings["pagesize"];
                ViewBag.filesize = ConfigurationManager.AppSettings["filesizemultiple"];
                var typeid = Request.Url.Segments[4];
                var db = new LawPracticeEntities();
                var data = db.tbl_notification.Where(x => x.typeid.ToString() == typeid.ToString() && x.Firmid.ToString() == LoggedInUser.FirmId.ToString() && x.auser.ToString() == LoggedInUser.UserId.ToString()).ToList();
                if (data != null)
                {
                    foreach (var item in data)
                    {
                        item.status = 1;
                        db.Entry(item).State = EntityState.Modified;
                        db.SaveChanges();
                    }
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            return View();
        }
        /// <summary>
        /// Get receive notification list details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Client")]
        public ActionResult ReceiveMessageList()
        {
            try
            {
                ViewBag.pagesize = System.Configuration.ConfigurationManager.AppSettings["pagesize"];
                ViewBag.filesize = ConfigurationManager.AppSettings["filesizemultiple"];
                var typeid = Request.Url.Segments[4];
                var db = new LawPracticeEntities();
                var data = db.tbl_notification.Where(x => x.typeid.ToString() == typeid.ToString() && x.Firmid.ToString() == LoggedInUser.FirmId.ToString() && x.auser.ToString() == LoggedInUser.UserId.ToString()).ToList();
                if (data != null)
                {
                    foreach (var item in data)
                    {
                        item.status = 1;
                        db.Entry(item).State = EntityState.Modified;
                        db.SaveChanges();
                    }
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Client), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Client), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            return View();
        }
        /// <summary>
        /// Get draft message list details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Client")]
        public ActionResult DraftMessageList()
        {
            try
            {
                ViewBag.pagesize = System.Configuration.ConfigurationManager.AppSettings["pagesize"];
                ViewBag.role = LoggedInUser.RoleId;
                ViewBag.filesize = ConfigurationManager.AppSettings["filesizemultiple"];
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            return View();
        }
        /// <summary>
        /// Get calender casewatch order list
        /// </summary>
        /// <param name="CalendarDataobj"></param>
        /// <param name="struser"></param>
        /// <param name="matterids"></param>
        /// <returns></returns>
        public JsonResult CalendarOrdrerCW(List<CalendarData> CalendarDataobj, string struser, string matterids)
        {
            var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
            //add login data
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
                userIdDetail = struser;
            }
            var addfClient = new WebClient();
            object rawfile = new
            {
                Accesstoken = AccessTokenDetail,
                UserId = userIdDetail,
                Flag = 1
            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/CalendarOrderDateList"), "POST", builders);
            JObject jObject = JObject.Parse(resid);
            dynamic data1 = jObject["data"];
            List<CalendarData> CalendarDataList = new List<CalendarData>();
            if (data1 != null)
            {
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string status = data.Status;
                    string Message = data.Message;
                    string vordernexthearing = data.data[i].Date;
                    // Add parts to the list.
                    CalendarDataobj.Add(new CalendarData
                    {
                        Disposeddt = vordernexthearing,
                    });
                }
            }
            return Json(CalendarDataList, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Get all user calender event list details
        /// </summary>
        /// <param name="CalendarDataobj"></param>
        /// <param name="struser"></param>
        /// <param name="matterids"></param>
        /// <returns></returns>
        public JsonResult CalendarEventByAllUserLawPractice(List<CalendarData> CalendarDataobj, string struser, string matterids)
        {
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
                userIdDetail = struser;
            }
            //add login data
            var addfClient = new MyWebClient();
            object rawfile = new
            {
                accesstoken = AccessTokenDetail,
                userid = userIdDetail,
                date = "",
                Id = "",
            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/ShowNextHearingDateLawPracticePopup"), "POST", builders);
            JObject jObject = JObject.Parse(resid);
            dynamic data1 = jObject["data"];
            List<CalendarData> CalendarDataList = new List<CalendarData>();
            if (data1 != null)
            {
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string status = data.Status;
                    string Message = data.Message;
                    string vordernexthearing = data.data[i].vordernexthearing;
                    string hearingtype = data.data[i].hearingtype;
                    // Add parts to the list.
                    CalendarDataobj.Add(new CalendarData
                    {
                        Disposeddt = vordernexthearing,
                        HearingType = hearingtype
                    });
                }
            }
            return Json(CalendarDataList, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Get all user calender event for client
        /// </summary>
        /// <param name="CalendarDataobj"></param>
        /// <param name="struser"></param>
        /// <param name="matterids"></param>
        /// <returns></returns>
        public JsonResult CalendarEventByAllUserLawPracticeForClient(List<CalendarData> CalendarDataobj, string struser, string matterids)
        {
            var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
            //add login data
            var addfClient = new WebClient();
            object rawfile = new
            {
                accesstoken = "mykase123456789abcdef",
                userid = struser,
                flag = 1,
                Id = "",
            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/CalendarEventByAllUserLawPractice"), "POST", builders);
            JObject jObject = JObject.Parse(resid);
            dynamic data1 = jObject["data"];
            var mykaselist = db.sp_GetAllMappedcasesbyFirmID(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).ToList();
            List<CalendarData> CalendarDataList = new List<CalendarData>();
            if (data1 != null)
            {
                for (int i = 0; i < data1.Count; i++)
                {
                    int tempusercaseid = Convert.ToInt32(data1.data[i]["UserCaseId"]);
                    var matterIDCase = mykaselist.Contains(tempusercaseid.ToString());
                    if (matterIDCase == true)
                    {
                        dynamic data = JObject.Parse(resid);
                        string status = data.Status;
                        string Message = data.Message;
                        string vordernexthearing = data.data[i].vordernexthearing;
                        // Add parts to the list.
                        CalendarDataobj.Add(new CalendarData
                        {
                            Disposeddt = vordernexthearing
                        });
                    }
                }
            }
            return Json(CalendarDataList, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Get all user next hearing date
        /// </summary>
        /// <param name="CalendarDataobj"></param>
        /// <param name="struser"></param>
        /// <param name="matterids"></param>
        /// <returns></returns>
        public JsonResult NextHearingDateAllUserLawPractice(List<CalendarData> CalendarDataobj, string struser, string matterids)
        {
            var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
            //add login data
            var addfClient = new WebClient();
            object rawfile = new
            {
                accesstoken = "mykase123456789abcdef",
                userid = "mykase",
                flag = 1,
                Id = matterids,
            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/NextHearingDateAllUserLawPractice"), "POST", builders);
            JObject jObject = JObject.Parse(resid);
            dynamic data1 = jObject["data"];
            List<CalendarData> CalendarDataList = new List<CalendarData>();
            for (int i = 0; i < data1.Count; i++)
            {
                dynamic data = JObject.Parse(resid);
                string status = data.Status;
                string Message = data.Message;
                string id = data.data[i].iid;
                string showstatus = data.data[i].showstatus;
                string vorderDateFinal = data.data[i].vorderDateFinal;
                string vorderDateFinal1 = data.data[i].vorderDateFinal1;
                string vCaseName = data.data[i].vCaseName;
                string vAdvocateName = data.data[i].vAdvocateName;
                string casetype1 = data.data[i].casetype1;
                string casetype = data.data[i].casetype;
                string vStatus = data.data[i].vStatus;
                string vCaseid = data.data[i].vCaseid;
                string vCaseType = data.data[i].vCaseType;
                string vCaseNo = data.data[i].vCaseNo;
                string vCaseYear = data.data[i].vCaseYear;
                string vCourt = data.data[i].vCourt;
                string vDisposedDate = data.data[i].vordernexthearing;
                string vLocalFile = data.data[i].vLocalFile;
                // Add parts to the list.
                CalendarDataobj.Add(new CalendarData
                {
                    showstatus = showstatus,
                    vorderDateFinal = vorderDateFinal,
                    vorderDateFinal1 = vorderDateFinal1,
                    vCaseName = vCaseName,
                    vAdvocateName = vAdvocateName,
                    casetype1 = casetype1,
                    casetype = casetype,
                    vStatus = vStatus,
                    vCaseid = vCaseid,
                    Casetype = casetype,
                    CaseNo = vCaseNo,
                    Caseyear = vCaseYear,
                    Court = vCourt,
                    Disposeddt = vDisposedDate,
                    vLocalFile = vLocalFile
                });
            }
            return Json(CalendarDataList, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Communicaion view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Client")]
        public ActionResult Communication()
        {
            return View();
        }
        /// <summary>
        /// Export all matter in excel by logged in user
        /// </summary>
        [AuthLog(Roles = "Client")]
        public void ExportmattertoExcel()
        {
            try
            {
                var esearchdata = QueryAES.UrlDecode(Request.QueryString["esearchdata"]);
                var ecasefilterdate = QueryAES.UrlDecode(Request.QueryString["ecasefilterdate"]);
                var ecasefilterclient = QueryAES.UrlDecode(Request.QueryString["ecasefilterclient"]);
                try
                {
                    ecasefilterclient = ecasefilterclient.Replace(" ", "+");
                    ecasefilterclient = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(ecasefilterclient));
                }
                catch
                {
                }
                var ecasefiltercourt = QueryAES.UrlDecode(Request.QueryString["ecasefiltercourt"]);
                var ecasefilterstatus = QueryAES.UrlDecode(Request.QueryString["ecasefilterstatus"]);
                var searchuser = QueryAES.UrlDecode(Request.QueryString["eusers"]);
                string exlfilename = "MatterReport_" + DateTime.Now;
                int pagenum = 1;
                int pagesize = 10000;
                if (!string.IsNullOrEmpty(ecasefiltercourt) && ecasefiltercourt != "null")
                {
                }
                else { ecasefiltercourt = ""; }
                if (!string.IsNullOrEmpty(ecasefilterstatus) && ecasefilterstatus != "null")
                {
                }
                else { ecasefilterstatus = ""; }
                if (!string.IsNullOrEmpty(esearchdata) && esearchdata != "null")
                {
                }
                else { esearchdata = ""; }
                var db = new LawPracticeEntities();
                List<usp_wf_GetMatterDetailByUser_Result> trialList_1 = new List<usp_wf_GetMatterDetailByUser_Result>();
                trialList_1 = db.usp_wf_GetMatterDetailByUser(Guid.Parse(LoggedInUser.UserId.ToString()), Guid.Parse(LoggedInUser.FirmId.ToString()),
                    ecasefilterstatus, ecasefiltercourt, pagenum, pagesize, esearchdata).ToList();
                foreach (var data in trialList_1.ToList())
                {
                    usp_wf_GetMatterDetailByUser_Result newItem = new usp_wf_GetMatterDetailByUser_Result();
                    newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                    trialList_1[trialList_1.IndexOf(data)].Id = newItem.Id;
                    if (data.UserCaseid != null)
                    {
                        newItem.UserCaseid = Convert.ToBase64String(QueryAES.EncryptAes(data.UserCaseid.ToString()));
                        trialList_1[trialList_1.IndexOf(data)].UserCaseid = newItem.UserCaseid;
                    }
                }
                var trialList = (from ob in trialList_1
                                 select new
                                 {
                                     StartDate = String.Format("{0:dd MMM yyyy}", ob.odate),
                                     MatterName = ob.mname,
                                     Court = ob.CourtName,
                                     Status = ob.cstatus,
                                     TeamMembers = ob.assignuserto,
                                     ClientContact = ob.PrimaryContactName,
                                     CloseDate = ob.cdate.ToString() == "01-01-1900 00:00:00" ? "" : String.Format("{0:dd MMM yyyy}", ob.cdate),
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
                Response.Redirect("/home/Error");
            }
        }
        /// <summary>
        /// Export matter pdf for client
        /// </summary>
        [AuthLog(Roles = "Client")]
        public void ExportmattertoPdf()
        {
            try
            {
                var esearchdata = QueryAES.UrlDecode(Request.QueryString["esearchdata"]);
                var ecasefilterdate = QueryAES.UrlDecode(Request.QueryString["ecasefilterdate"]);
                var ecasefilterclient = QueryAES.UrlDecode(Request.QueryString["ecasefilterclient"]);
                try
                {
                    ecasefilterclient = ecasefilterclient.Replace(" ", "+");
                    ecasefilterclient = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(ecasefilterclient));
                }
                catch
                {
                }
                var ecasefiltercourt = QueryAES.UrlDecode(Request.QueryString["ecasefiltercourt"]);
                var ecasefilterstatus = QueryAES.UrlDecode(Request.QueryString["ecasefilterstatus"]);
                var searchuser = QueryAES.UrlDecode(Request.QueryString["eusers"]);
                int pagenum = 1;
                int pagesize = 10000;
                if (!string.IsNullOrEmpty(ecasefiltercourt) && ecasefiltercourt != "null")
                {
                }
                else { ecasefiltercourt = ""; }
                if (!string.IsNullOrEmpty(ecasefilterstatus) && ecasefilterstatus != "null")
                {
                }
                else { ecasefilterstatus = ""; }
                if (!string.IsNullOrEmpty(esearchdata) && esearchdata != "null")
                {
                }
                else { esearchdata = ""; }
                var db = new LawPracticeEntities();
                string filename = "MatterReport.pdf";
                string strtemplate = "";
                var mykaselogopath = Server.MapPath("~\\Manupanel\\img\\top-logopdf.png");
                var firmlogopath = "";
                var firmlogo = db.usp_GetHomePageData(Guid.Parse(LoggedInUser.FirmId.ToString())).FirstOrDefault();
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
                strtemplate += "<center><p><strong>Mykase-Matter Report</strong><span style='float:right'>Date: " + String.Format("{0:dd MMM yyyy}", DateTime.Now) + "</span></p></hr>";
                strtemplate += " <p></p>";
                strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                strtemplate += "  <thead><tr> ";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>StartDate </th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>MatterName </th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>CourtName </th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Status</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>TeamMembers </th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>ClientContact </th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>CloseDate </th>";
                strtemplate += "</tr></thead><tbody>";
                List<usp_wf_GetMatterDetailByUser_Result> trialList_1 = new List<usp_wf_GetMatterDetailByUser_Result>();
                trialList_1 = db.usp_wf_GetMatterDetailByUser(Guid.Parse(LoggedInUser.UserId.ToString()), Guid.Parse(LoggedInUser.FirmId.ToString()),
                    ecasefilterstatus, ecasefiltercourt, pagenum, pagesize, esearchdata).ToList();
                foreach (var data in trialList_1.ToList())
                {
                    usp_wf_GetMatterDetailByUser_Result newItem = new usp_wf_GetMatterDetailByUser_Result();
                    newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                    trialList_1[trialList_1.IndexOf(data)].Id = newItem.Id;
                    if (data.UserCaseid != null)
                    {
                        newItem.UserCaseid = Convert.ToBase64String(QueryAES.EncryptAes(data.UserCaseid.ToString()));
                        trialList_1[trialList_1.IndexOf(data)].UserCaseid = newItem.UserCaseid;
                    }
                }
                if (trialList_1 != null)
                {
                    foreach (usp_wf_GetMatterDetailByUser_Result idata in trialList_1)
                    {
                        strtemplate += "<tr><td height = '20' align = 'left' valign ='top'  style='padding:0 5px;' >" + String.Format("{0:dd MMM yyyy}", idata.odate) + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + idata.mname + "  </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + idata.CourtName + "  </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + idata.cstatus + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + idata.assignuserto + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + idata.PrimaryContactName + " </td>";
                        var closesate = idata.cdate.ToString();
                        if (String.IsNullOrEmpty(closesate) || closesate.ToString() == "01-01-1900 00:00:00" || closesate.ToString() == "01/01/1900 00:00:00")
                        {
                            closesate = "";
                            strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + closesate + " </td>";
                        }
                        else
                        {
                            strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;'> " + String.Format("{0:dd MMM yyyy}", Convert.ToDateTime(closesate)) + " </td>";
                        }
                        strtemplate += "</tr>";
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
            catch (Exception ex)
            {
                Response.Redirect("/home/Error");
            }
        }
        /// <summary>
        /// Get next hearing calender event
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult NextHearingCalendarOrder()
        {
            var path = Request.Url.AbsolutePath;
            var strdt = path.Split('/').Last();
            ViewBag.id = strdt;
            return View();
        }
        /// <summary>
        /// Get next hearing calender order details
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public JsonResult NextHearingcalendarOrderDetail()
        {
            var path = Request.Url.AbsolutePath;
            var strdt = path.Split('/').Last();
            dynamic str = null;
            var firmids = LoggedInUser.FirmId;
            strdt = System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String(strdt));
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
                Date = strdt,
            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            addfClient.Encoding = Encoding.UTF8;
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/CalendarOrderDatabyDate"), "POST", builders);
            JObject jObject = JObject.Parse(resid);
            dynamic data1 = jObject["data"];
            List<CalendarNewOrderList> orderlist = new List<CalendarNewOrderList>();
            for (int i = 0; i < data1.Count; i++)
            {
                dynamic data = JObject.Parse(resid);
                string status = data.Status;
                string Message = data.Message;
                string Casetype = data.data[i].casetype;
                string CaseNo = data.data[i].vCaseNo;
                string Caseyear = data.data[i].vCaseYear;
                string Notes = data.data[i].Notes;
                string vLocalFile = data.data[i].vLocalFile;
                string Casename = data.data[i].vCaseName;
                string Advname = data.data[i].vAdvocateName;
                string tempusercaseid = data.data[i].Usercaseid;
                if (String.IsNullOrEmpty(Casename))
                {
                    Casename = "";
                }
                if (String.IsNullOrEmpty(Advname))
                {
                    Advname = "";
                }
                string Court = data.data[i].vCourt;
                if (String.IsNullOrEmpty(Court))
                {
                    Court = "";
                }
                string Disposeddt = data.data[i].vorderDateFinal1;
                if (String.IsNullOrEmpty(Disposeddt))
                {
                    Disposeddt = "";
                }
                else
                {
                    try
                    {
                        var _dts = DateTime.Parse(Disposeddt);
                        Disposeddt = _dts.ToString("dd MMM yyyy");
                    }
                    catch (Exception er)
                    {
                    }
                }
                string strfile = data.data[i].vLocalFile;
                if (String.IsNullOrEmpty(strfile.Trim()))
                {
                    strfile = "";
                }
                else
                {
                    strfile = Convert.ToBase64String(QueryAES.EncryptAes(CaseorderBaseurl + strfile));
                }
                //    // Add parts to the list.
                orderlist.Add(new CalendarNewOrderList
                {
                    Casetype = Casetype,
                    CaseNo = CaseNo,
                    Caseyear = Caseyear,
                    Casename = Casename,
                    Advname = Advname,
                    Court = Court,
                    Disposeddt = Disposeddt,
                    strfile = strfile,
                    Notes = Notes,
                    UserCaseId = tempusercaseid
                });
            }
            return Json(orderlist, JsonRequestBehavior.AllowGet);
        }
    }
}
