using BussinessLogic.Common;
using DataAccess.Modals;
using LawPracticeFirm.Common;
using LawPracticeFirm.CustomFIlter;
using LawPracticeFirm.DAL;
using NJDGDetail.Controllers;
using NJDGDetail.Models;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;
using static LawPracticeFirm.Models.AuditData;

namespace LawPracticeFirm.Controllers
{
    public class EmployeeController : BaseFirmController
    {
        private LawPracticeEntities db1 = new LawPracticeEntities();
        public string controllername = "EmployeeController";
        /// <summary>
        /// Constructor
        /// </summary>
        public EmployeeController()
        {

        }
        /// <summary>
        /// Employee dashboard
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult Index()
        {
            var json = new JavaScriptSerializer().Serialize(LoggedInUser);
            return View();
        }
        /// <summary>
        /// Get firm type details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult sidebar()
        {
            var checktype = db.usp_GetFirmType(LoggedInUser.FirmId.ToString()).FirstOrDefault();
            if (checktype != null)
            {
                Session["firmtype"] = checktype.Value;
            }

            return View();
        }
        /// <summary>
        /// Employee setting details
        /// </summary>
        /// <returns></returns>
        public ActionResult Settings()
        {
            return View();
        }

        /// <summary>
        /// Team user
        /// </summary>
        /// <param name="caseid"></param>
        /// <returns></returns>
        [FirmControllerAuthorization(Module = Module.Team, AccessRight = AccessRight.ManageTeamUser)]
        public ActionResult TeamUsers(string caseid)
        {
            return View();
        }

        /// <summary>
        /// Recent activity details
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult RecentActivity()
        {
            var db = new LawPracticeEntities();
            dynamic recentactivitymore = db.GetRecentActivityAll(LoggedInUser.FirmId, LoggedInUser.UserId).ToList();
            Session["recentactivitymore"] = recentactivitymore;
            return View();
        }

        /// <summary>
        /// Get employee dashboard details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult dashboard()
        {
            try
            {
                var db = new LawPracticeEntities();
                Session["firmtypes"] = "Client";
                var checktype = db.usp_GetFirmType(LoggedInUser.FirmId.ToString()).FirstOrDefault();
                if (checktype != null)
                {
                    if (checktype.Value.ToString() == "3")
                    {
                        Session["firmtypes"] = "Lawyer/LawFirm";
                    }
                }
                var loggeduser = LoggedInUser.UserId;
                var logd = LoggedInUser.FirmId;
                var username = db.FirmUsers.Where(x => x.Id.ToString() == loggeduser.ToString()).FirstOrDefault();
                Session["loggeduser"] = username.UserName;
                Session["usertype"] = username.IsFirmClient;
                var firmname = db.Firms.Where(z => z.Id.ToString() == username.Firmid.ToString()).FirstOrDefault();
                Session["firmname"] = firmname.FirmTitle;
                dynamic upconingevent = db.GetUpComingEventList(LoggedInUser.FirmId, LoggedInUser.UserId).ToList();
                Session["upconingevent"] = upconingevent;
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");

            }
            return View();

        }
        /// <summary>
        /// Get client list details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult ClientList()
        {
            ViewBag.pagesize = System.Configuration.ConfigurationManager.AppSettings["pagesize"];
            return View();
        }
        /// <summary>
        /// Check role
        /// </summary>
        /// <param name="urlsegment"></param>
        /// <returns></returns>
        public string checkroles(string urlsegment)
        {
            ViewBag.IsCreate = "";
            ViewBag.IsEdit = "";
            ViewBag.view = "";
            if (urlsegment == "Directorylist/0")
            {
            }
            else
            {
                urlsegment = urlsegment.Replace("/", "");
            }
            var db = new LawPracticeEntities();
            var foutput = true;
            var frmids = Session["sessionfirmid"].ToString();
            var usrids = Session["sessionuserid"].ToString();
            int rlid = Convert.ToInt32(Session["sessionroleid"].ToString());
            var finalresult = "";
            int pageid = 0;
            var sflag = true;
            if (LoggedInUser.RoleId == 2)
            {
                var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString(urlsegment)).ToList();
                if (pagelist.Count > 0)
                {
                    foreach (var data in pagelist)
                    {
                        int pwrite = 0, pview = 0, pedit = 0, pdel = 0, pviewall = 0, peditall = 0;
                        pageid = Convert.ToInt32(data.ParentPage);
                        pwrite = Convert.ToInt32(data.Write);
                        pview = Convert.ToInt32(data.View);
                        pedit = Convert.ToInt32(data.Edit);
                        pdel = Convert.ToInt32(data.Delete);
                        pviewall = Convert.ToInt32(data.ViewAll);
                        peditall = Convert.ToInt32(data.EditAll);
                        dynamic pageaccesslist;
                        if (urlsegment == "caselist" || urlsegment == "NewCaseDashboard" || urlsegment == "Casedetails" || urlsegment == "EditCase" || urlsegment == "CreateCase")
                        {
                            // pageaccesslist = db.usp_GetUserCaseModuleRights(frmids, usrids, usrids, pageid).ToList();
                            pageaccesslist = DataAccessADO.GetUserCaseModuleRights(frmids, usrids, usrids, pageid);
                        }
                        else
                        {
                            pageaccesslist = db.usp_GetUserModuleRights(frmids, usrids, usrids, pageid).ToList();
                        }
                        int write = 0, view = 0, edit = 0, del = 0, viewall = 0, editall = 0, share = 0, enable = 0, export = 0;
                        foreach (var access in pageaccesslist)
                        {
                            write = Convert.ToInt32(access.Write);
                            view = Convert.ToInt32(access.View);
                            edit = Convert.ToInt32(access.Edit);
                            del = Convert.ToInt32(access.Delete);
                            viewall = Convert.ToInt32(access.ViewAll);
                            editall = Convert.ToInt32(access.EditAll);
                            ViewBag.IsViewAll = viewall;
                            ViewBag.view = view;
                            ViewBag.share = 0;
                            ViewBag.enable = 0;
                            ViewBag.export = 0;
                            try
                            {
                                ViewBag.share = access.Share;
                                ViewBag.enable = access.Enable;
                                ViewBag.export = access.Export;
                                ViewBag.Create = access.Share;
                            }
                            catch
                            {

                            }
                            if (viewall > 0 || editall > 0)
                            {
                                foutput = false;
                                ViewBag.IsDelete = del;
                                ViewBag.IsCreate = write;
                                ViewBag.IsEdit = edit;
                                if (write == 1)
                                {
                                    foutput = false;
                                }
                                if (pedit == 1)
                                {
                                    if (edit == 1 || editall == 1)
                                    {
                                        foutput = false;
                                    }
                                    else
                                    {
                                        foutput = true;
                                    }
                                }
                            }
                            else
                            {
                                if (sflag == true)
                                {
                                    if (write > 0)
                                    {
                                        ViewBag.IsCreate = write;
                                        if (pwrite == write)
                                        {
                                            foutput = false;
                                            sflag = false;
                                        }
                                    }
                                    else
                                    {
                                        ViewBag.IsCreate = 0;
                                        foutput = true;
                                    }
                                }
                                //logic for view
                                if (sflag == true)
                                {
                                    if (view > 0)
                                    {
                                        if (pview == view)
                                        {
                                            foutput = false;
                                            sflag = false;
                                        }
                                    }
                                    else
                                    {
                                        foutput = true;
                                    }
                                }
                                if (sflag == true)
                                {
                                    if (edit > 0)
                                    {
                                        if (pedit == edit)
                                        {
                                            foutput = false;
                                            sflag = false;
                                            ViewBag.IsEdit = edit;
                                        }
                                    }
                                    else
                                    {
                                        foutput = true;
                                    }
                                }
                                ViewBag.IsDelete = 0;
                                if (del > 0)
                                {
                                    ViewBag.IsDelete = 1;
                                }
                                else
                                {
                                    ViewBag.IsDeletes = 0;
                                }
                            }
                        }
                    }
                }
                finalresult = ViewBag.IsCreate + "," + ViewBag.IsEdit + "," + ViewBag.view;
            }
            return finalresult.ToString();
        }
        /// <summary>
        /// Employee header details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        // [OutputCache(Duration = 30, VaryByParam = "name")]
        public ActionResult header()
        {
            Session["authsessionfirmid"] = "";
            Session["authsessionuserid"] = "";
            Session["authsessionmobile"] = "";
            var db = new LawPracticeEntities();
            string firmcode = Request.Url.Segments[1];
            string firmcodes = firmcode.Replace("/", "");
            ViewBag.username = LoggedInUser.UserName;
            var fullusername = LoggedInUser.UserFullName;
            if (!String.IsNullOrEmpty(fullusername))
            {
                Session["fullusername"] = fullusername;
            }
            var getuserdetails = db.usp_GetUserDetailByUserID(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).FirstOrDefault();
            if (getuserdetails != null)
            {
                ViewBag.ispartner = getuserdetails.IsPartner;
                ViewBag.roleids = getuserdetails.RoleId;
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
            var hsmklitigation = "display:none";
            var hsprocactivealerts = "display:none";
            //For IPR Related
            var hsipr = "display:none";
            var hsiprtrademark = "display:none";
            var hsiprcopyright = "display:none";
            var hsiprpatent = "display:none";
            var hsiprproprietor = "display:none";
            var hsiprgi = "display:none";
            var hsiprdesign = "display:none";
            var hsipragent = "display:none";
            var hsiprresources = "display:none";
            var hsiprjournalsearch = "display:none";
            var AIOrdertools = "display:none";
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
                    if (data.ModuleName == ConfigurationManager.AppSettings["MKLitigation"])
                    {
                        hsmklitigation = "display:unset";
                    }
                    if (data.ModuleName == ConfigurationManager.AppSettings["ProctiveALerts"])
                    {
                        hsprocactivealerts = "display:unset";
                    }
                    if (data.ModuleName == ConfigurationManager.AppSettings["IPRManagement"])
                    {
                        hsipr = "display:unset";
                    }
                    if (data.ModuleName == ConfigurationManager.AppSettings["IPRTrademark"])
                    {
                        hsiprtrademark = "display:unset";
                    }
                    if (data.ModuleName == ConfigurationManager.AppSettings["IPRCopyright"])
                    {
                        hsiprcopyright = "display:unset";
                    }
                    if (data.ModuleName == ConfigurationManager.AppSettings["IPRPatent"])
                    {
                        hsiprpatent = "display:unset";
                    }
                    if (data.ModuleName == ConfigurationManager.AppSettings["IPRProprietor"])
                    {
                        hsiprproprietor = "display:unset";
                    }
                    if (data.ModuleName == ConfigurationManager.AppSettings["ProctiveALerts"])
                    {
                        hsprocactivealerts = "display:unset";
                    }
                    if (data.ModuleName == ConfigurationManager.AppSettings["IPRGI"])
                    {
                        hsiprgi = "display:unset";
                    }

                    if (data.ModuleName == ConfigurationManager.AppSettings["IPRDesign"])
                    {
                        hsiprdesign = "display:unset";
                    }

                    if (data.ModuleName == ConfigurationManager.AppSettings["IPRAgent"])
                    {
                        hsipragent = "display:unset";
                    }

                    if (data.ModuleName == ConfigurationManager.AppSettings["IPRResources"])
                    {
                        hsiprresources = "display:unset";
                    }

                    if (data.ModuleName == ConfigurationManager.AppSettings["IPRJournalSearch"])
                    {
                        hsiprjournalsearch = "display:unset";
                    }
                    //FOr AI Order Tools
                    if (data.ModuleName == ConfigurationManager.AppSettings["MKAIOrderSummary"])
                    {
                        AIOrdertools = "display:unset";
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
                hsmklitigation = "display:unset";
                AIOrdertools = "display:unset";

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
            ViewBag.hsmklitigation = hsmklitigation;
            ViewBag.hsprocactivealerts = hsprocactivealerts;
            ViewBag.IsCWActive = "";
            ViewBag.hsipr = hsipr;
            ViewBag.hsiprtrademark = hsiprtrademark;
            ViewBag.hsiprcopyright = hsiprcopyright;
            ViewBag.hsiprpatent = hsiprpatent;
            ViewBag.hsiprproprietor = hsiprproprietor;
            ViewBag.hsiprgi = hsiprgi;
            ViewBag.hsiprdesign = hsiprdesign;
            ViewBag.hsipragent = hsipragent;
            ViewBag.hsiprresources = hsiprresources;
            ViewBag.hsiprjournalsearch = hsiprjournalsearch;
            ViewBag.AIOrdertools = AIOrdertools;
            try
            {
                var checkCWACtive = db.usp_GetFirmLimit(LoggedInUser.FirmId.ToString()).FirstOrDefault();
                if (checkCWACtive != null)
                {
                    if (checkCWACtive.IsCWActive == 1)
                    {
                        ViewBag.IsCWActive = "1";
                    }

                }
            }
            catch
            {

            }
            if (LoggedInUser.RoleId == 2)
            {

                ViewBag.IsCreateUserList = 0;
                ViewBag.IsViewUserList = 0;
                ViewBag.IsEditUserList = 0;

                ViewBag.IsCreateAssignRights = 0;
                ViewBag.IsViewAssignRights = 0;
                ViewBag.IsEditAssignRights = 0;

                ViewBag.IsCreateMatterRights = 0;
                ViewBag.IsViewMatterRights = 0;
                ViewBag.IsEditMatterRights = 0;

                ViewBag.IsCreateknowRights = 0;
                ViewBag.IsViewknowRights = 0;
                ViewBag.IsEditknowRights = 0;


                ViewBag.IsCreateinvRights = 0;
                ViewBag.IsViewinvRights = 0;
                ViewBag.IsEditinvRights = 0;


                ViewBag.IsCreatenoticeRights = 0;
                ViewBag.IsViewnoticeRights = 0;
                ViewBag.IsEditnoticeRights = 0;


                ViewBag.IsCreateDocumentRights = 0;
                ViewBag.IsViewDocumentRights = 0;
                ViewBag.IsEditDocumentRights = 0;

                var data = checkroles("userlist");

                string[] values = data.Split(',');
                for (int i = 0; i < values.Length; i++)
                {
                    if (i == 0)
                    {
                        ViewBag.IsCreateUserList = values[i];
                    }
                    if (i == 1)
                    {
                        ViewBag.IsEditUserList = values[i];
                    }
                    if (i == 2)
                    {
                        ViewBag.IsViewUserList = values[i];
                    }


                }
                var data1 = checkroles("RoleAccess");

                string[] values1 = data1.Split(',');
                for (int i = 0; i < values1.Length; i++)
                {
                    if (i == 0)
                    {
                        ViewBag.IsCreateAssignRights = values1[i];
                    }
                    if (i == 1)
                    {
                        ViewBag.IsEditAssignRights = values1[i];
                    }
                    if (i == 2)
                    {
                        ViewBag.IsViewAssignRights = values1[i];
                    }


                }
                var data2 = checkroles("CaseRoleAccess");

                string[] values2 = data2.Split(',');
                for (int i = 0; i < values2.Length; i++)
                {
                    if (i == 0)
                    {
                        ViewBag.IsCreateMatterRights = values2[i];
                    }
                    if (i == 1)
                    {
                        ViewBag.IsEditMatterRights = values2[i];
                    }
                    if (i == 2)
                    {
                        ViewBag.IsViewMatterRights = values2[i];
                    }


                }
                var data3 = checkroles("ViewKnowledge");

                string[] values3 = data3.Split(',');
                for (int i = 0; i < values3.Length; i++)
                {
                    if (i == 0)
                    {
                        ViewBag.IsCreateknowRights = values3[i];
                    }
                    if (i == 1)
                    {
                        ViewBag.IsEditknowRights = values3[i];
                    }
                    if (i == 2)
                    {
                        ViewBag.IsViewknowRights = values3[i];
                    }


                }

                var data4 = checkroles("ViewInvoice");

                string[] values4 = data4.Split(',');
                for (int i = 0; i < values4.Length; i++)
                {
                    if (i == 0)
                    {
                        ViewBag.IsCreateinvRights = values4[i];
                    }
                    if (i == 1)
                    {
                        ViewBag.IsEditinvRights = values4[i];
                    }
                    if (i == 2)
                    {
                        ViewBag.IsViewinvRights = values4[i];
                    }
                }

                var data5 = checkroles("NewNoticeList");

                string[] values5 = data5.Split(',');
                for (int i = 0; i < values5.Length; i++)
                {
                    if (i == 0)
                    {
                        ViewBag.IsCreatenoticeRights = values5[i];
                    }
                    if (i == 1)
                    {
                        ViewBag.IsEditnoticeRights = values5[i];
                    }
                    if (i == 2)
                    {
                        ViewBag.IsViewnoticeRights = values5[i];
                    }
                }
                var data6 = checkroles("Directorylist/0");
                string[] values6 = data6.Split(',');
                for (int i = 0; i < values6.Length; i++)
                {
                    if (i == 0)
                    {
                        ViewBag.IsCreateDocumentRights = values6[i];
                    }
                    if (i == 1)
                    {
                        ViewBag.IsViewDocumentRights = values6[i];
                    }
                    if (i == 2)
                    {
                        ViewBag.IsEditDocumentRights = values6[i];
                    }


                }
                if (LoggedInUser.FirmId.ToString().ToUpper() == ConfigurationManager.AppSettings["DivChartFirmId"])
                {
                    ViewBag.divisionChart = "AssignDivisionChart";
                }
                //for BPCL Custmization
                if (LoggedInUser.FirmId.ToString().ToUpper() == ConfigurationManager.AppSettings["BPCLDivChartFirmId"])
                {
                    ViewBag.CaseTypesChart = "AssignCaseTypeChart";
                }
                //for Syngenta Custmization
                if (LoggedInUser.FirmId.ToString().ToUpper() == ConfigurationManager.AppSettings["SyngentaDivChartFirmId"])
                {
                    ViewBag.StatesTypesChart = "AssignStateTypeChart";
                }
                //for BOM Custmization
                if (LoggedInUser.FirmId.ToString().ToUpper() == ConfigurationManager.AppSettings["BOMCustomization"])
                {
                    ViewBag.BOMCustomType = "BOMCustomtype";
                }
            }

            return View();
        }
        /// <summary>
        /// Get work flow user activity notification
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
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
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");

            }
            return View();
        }
        /// <summary>
        /// Update user profile
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult ProfileUpdate()
        {
            return View();
        }
        /// <summary>
        /// Get lead user details
        /// </summary>
        /// <param name="Prefix"></param>
        /// <returns></returns>
        [HttpPost]
        [AuthLog(Roles = "User")]
        public JsonResult Leaduser(string Prefix)
        {
            var leaduser = (from c in db.LeadLists
                            where c.ldname.Contains(Prefix) && c.Firmid.ToString() == LoggedInUser.FirmId.ToString() && c.lstatus != "1"
                            select new
                            {
                                label = c.ldname,
                                val = c.lid
                            }).ToList();

            return Json(leaduser, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Lead user login detail list
        /// </summary>
        /// <param name="Prefix"></param>
        /// <returns></returns>
        [HttpPost]
        [AuthLog(Roles = "User")]
        public ActionResult LeadUserListlogin(string Prefix)
        {
            try
            {
                var db = new LawPracticeEntities();
                var user = LoggedInUser.FirmId;
                var getclientid = db.RegUsers.Where(c => c.leadid.ToString() == Prefix && c.Firmid.ToString() == LoggedInUser.FirmId.ToString() && c.IsAdmin == "3").FirstOrDefault();
                if (getclientid != null)
                {
                    var leaduser = (from c in db.FirmUsers
                                    where c.clientId == getclientid.Id && c.Firmid.ToString() == LoggedInUser.FirmId.ToString()
                                    select new
                                    {
                                        username = c.UserName,
                                        password = c.Password
                                    }).ToList();
                    return Json(leaduser, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var data = "null";
                    return Json(data, JsonRequestBehavior.AllowGet);
                }

            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");

            }
            return View();
        }

        /// <summary>
        /// User profile view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult UserProfile()
        {
            return View();
        }


        private LawPracticeEntities db = new LawPracticeEntities();

        /// <summary>
        /// Contact configuration
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult ConfigContact(string type)
        {
            try
            {
                ViewBag.filesize = ConfigurationManager.AppSettings["filesize"];
                var tfind = db.ConfigurationTypes.Where(x => x.Type == type).FirstOrDefault();
                if (tfind != null)
                {
                    var types = tfind.Id;
                    ViewBag.type = types;
                    return View();
                }
                else
                {
                    return View();
                }

            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");

            }
            return View();

        }

        /// <summary>
        /// View contact
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult vcontact(string type)
        {
            try
            {
                ViewBag.pagesize = System.Configuration.ConfigurationManager.AppSettings["pagesize"];

                var tfind = db.ConfigurationTypes.Where(x => x.Type == type).FirstOrDefault();
                if (tfind != null)
                {
                    var types = tfind.Id;
                    ViewBag.type = types;
                    return View();
                }

            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");

            }
            return View();
        }
        /// <summary>
        /// Contact Single View 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult ContactSingleView(string id)
        {
            try
            {
                var typeid = QueryAES.UrlDecode(Request.Form["token"]);
                ViewBag.token = typeid;
                string typeids = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(typeid));
                var db = new LawPracticeEntities();
                var data = db.tbl_notification.Where(x => x.typeid.ToString() == typeids.ToString() && x.Firmid.ToString() == LoggedInUser.FirmId.ToString() && x.auser.ToString() == LoggedInUser.UserId.ToString() && x.nmode == null).FirstOrDefault();
                if (data != null)
                {
                    data.status = 1;
                    db.Entry(data).State = EntityState.Modified;
                    db.SaveChanges();
                }
                var chkuser = db.AddContactsLists.Where(x => x.cid.ToString() == typeids.ToString() && x.Firmid == LoggedInUser.FirmId).FirstOrDefault();
                if (chkuser != null)
                {
                    var creater = chkuser.firmuser.ToString();
                    if (creater.ToString() == LoggedInUser.UserId.ToString())
                    {
                        ViewBag.validuser = "true";
                    }
                    else
                    {
                        ViewBag.validuser = "false";
                    }
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");

            }

            var path = Request.Url.AbsolutePath;
            var cid = path.Split('/').Last();

            ViewBag.aid = cid;
            return View(id);
        }
        /// <summary>
        /// Matter configuration user wise detail
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult ConfigMatter(string type)
        {
            try
            {
                ViewBag.filesize = ConfigurationManager.AppSettings["filesize"];
                LawPracticeEntities db = new LawPracticeEntities();
                var checkmodule = db.usp_Getfimpack(LoggedInUser.FirmId.ToString()).FirstOrDefault();
                if (checkmodule != null)
                {
                    ViewBag.Module = checkmodule.Value;
                }
                var tfind = db.ConfigurationTypes.Where(x => x.Type == type).FirstOrDefault();
                if (tfind != null)
                {
                    var types = tfind.Id;
                    ViewBag.type = types;
                    return View();
                }
                else
                {
                    return View();
                }

            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");

            }

            return View();
        }

        /// <summary>
        /// View matter
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult vmatter(string type)
        {
            try
            {
                ViewBag.pagesize = System.Configuration.ConfigurationManager.AppSettings["pagesize"];
                var tfind = db.ConfigurationTypes.Where(x => x.Type == type).FirstOrDefault();
                if (tfind != null)
                {
                    var types = tfind.Id;
                    ViewBag.type = types;
                    return View();
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            return View();
        }

        /// <summary>
        /// View Caselist clientwise
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        // View Caselist clientwise
        [AuthLog(Roles = "User")]
        public ActionResult Clientcaselist()
        {
            int pagenum = 1, pagesize = 1000;
            try
            {
                var db = new LawPracticeEntities();
                var status = "";
                var typeid = Request.Url.Segments[4];
                var strdetail = db.usp_wf_GetMatterDetailByUser(Guid.Parse(typeid), LoggedInUser.FirmId, status, null, pagenum, pagesize, null).ToList();
                ViewBag.clientcaselist = strdetail;
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            return View();
        }

        /// <summary>
        /// Update single contact based on user id 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult ContactSingleEdit(string id)
        {
            ViewBag.filesize = ConfigurationManager.AppSettings["filesize"];
            var token = QueryAES.UrlDecode(Request.Form["token"]);
            ViewBag.token = token;
            ViewBag.aid = token;
            return View(id);
        }
        /// <summary>
        /// View single matter based on userid
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult MatterSingleView(string id)
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
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            ViewBag.aid = id;
            return View(id);
        }

        /// <summary>
        /// Edit single matter based on user id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult MatterSingleEdit(string id)
        {
            try
            {
                var typeid = QueryAES.UrlDecode(Request.Form["token"]);
                ViewBag.token = typeid;
                ViewBag.aid = id;
                ViewBag.filesize = ConfigurationManager.AppSettings["filesize"];
                LawPracticeEntities db = new LawPracticeEntities();
                var checkmodule = db.usp_Getfimpack(LoggedInUser.FirmId.ToString()).FirstOrDefault();
                if (checkmodule != null)
                {
                    ViewBag.Module = checkmodule.Value;
                }
                var user = LoggedInUser.FirmId;
                var firmusers = (from c in db.FirmUsers
                                 join d in db.Roles on c.RoleId equals d.ID
                                 where c.Firmid.ToString() == user.ToString() && c.IsActive == true && (c.RoleId == 1 || c.RoleId == 2)
                                 select new
                                 {
                                     label = c.UserName + " -( " + d.RoleName + " )",
                                     val = c.Id,
                                     roleid = c.RoleId,
                                     role = d.RoleName

                                 }).ToList();
                ViewBag.Users = firmusers;
                var tfind = db.ConfigurationTypes.Where(x => x.Type == "matter").FirstOrDefault();
                if (tfind != null)
                {
                    var types = tfind.Id;
                    ViewBag.type = types;
                    return View(id);
                }
                else
                {
                    return View(id);
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            return View();
        }
        /// <summary>
        /// Assign user directory list detail
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult AssignUserDirectoryList()
        {
            ViewBag.pagesize = System.Configuration.ConfigurationManager.AppSettings["pagesize"];
            ViewBag.filesize = ConfigurationManager.AppSettings["filesize"];
            ViewBag.userId = LoggedInUser.UserId;

            ViewBag.firmid = LoggedInUser.FirmId;
            return View();

        }
        /// <summary>
        /// Assign user file list
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult AssignUserFileList()
        {
            ViewBag.pagesize = System.Configuration.ConfigurationManager.AppSettings["pagesize"];

            ViewBag.filesize = ConfigurationManager.AppSettings["filesize"];
            //var id = Request.Url.Segments[4];
            //long ids = Convert.ToInt64(id);

            //var db = new LawPracticeEntities();
            //var ddetails = db.ViewFiles.Where(z => z.Id == ids && z.firmId == LoggedInUser.FirmId).FirstOrDefault();
            //ViewBag.dirname = ddetails.fname;
            ViewBag.userId = LoggedInUser.UserId;

            ViewBag.firmid = LoggedInUser.FirmId;
            return View();

        }
        /// <summary>
        /// Get user directory list
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult UserDirectoryList()
        {
            try
            {
                ViewBag.pagesize = System.Configuration.ConfigurationManager.AppSettings["pagesize"];
                var db = new LawPracticeEntities();
                string path = System.Web.HttpContext.Current.Server.MapPath("~/WorkSpace/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/Template");
                if (!(Directory.Exists(path)))
                {
                    Directory.CreateDirectory(path);
                }
                var chkfolder = db.ViewFiles.Where(x => x.fname == "Template" && x.ftype == 0 && x.Firmid == LoggedInUser.FirmId && x.Firmuser == LoggedInUser.UserId && x.pfile.ToString() == "00000000-0000-0000-0000-000000000000").FirstOrDefault();
                if (chkfolder == null)
                {
                    ViewFile vf = new ViewFile();
                    vf.fname = "Template";
                    vf.ftype = 0;
                    vf.pfile = Guid.Parse("00000000-0000-0000-0000-000000000000");
                    vf.Firmid = LoggedInUser.FirmId;
                    vf.Firmuser = LoggedInUser.UserId;
                    vf.fdetails = null;
                    vf.filetype = null;
                    vf.fpermission = null;
                    vf.date_time = System.DateTime.Now;
                    db.ViewFiles.Add(vf);
                    db.SaveChanges();
                }
                ViewBag.filesize = ConfigurationManager.AppSettings["filesize"];
                ViewBag.userId = LoggedInUser.UserId;
                ViewBag.firmid = LoggedInUser.FirmId;
                var fid = LoggedInUser.FirmId;
                var uid = LoggedInUser.UserId;
                var id = Request.Url.Segments[4];
                var tempid = QueryAES.UrlDecode(Request.Form["token"]);
                if (tempid == null)
                {
                    if (id != "0")
                    {
                        ViewBag.directoryid = "";
                        return View();
                    }
                    else
                    {
                        id = id;
                    }
                }
                else
                {
                    if (tempid == "0")
                    {
                        id = "0";
                    }
                    else
                    {
                        id = tempid;
                    }
                }
                string ids = id;
                string folderdirectid = id;
                ViewBag.directoryid = ids;
                if (ids == "0")
                {
                    ids = "00000000-0000-0000-0000-000000000000";
                }
                ViewBag.DIRECTORYLINK = db.usp_GetDirectoryLink(Guid.Parse(ids)).ToList();
                if (ids != "0")
                {
                    var ddetails = db.ViewFiles.Where(z => z.Id.ToString() == ids.ToString() && z.Firmid.ToString() == LoggedInUser.FirmId.ToString()).FirstOrDefault();
                    ViewBag.directoryname = ddetails.fname;
                    var dirfullpath = db.sp_Getfilepaths(fid, uid, Guid.Parse(folderdirectid)).FirstOrDefault();
                    ViewBag.directorypath = dirfullpath;
                }
                else
                {
                    ViewBag.directoryname = "";
                    ViewBag.directorypath = "";
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            return View();
        }

        /// <summary>
        /// Get user file list
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult UserFileList()
        {
            ViewBag.filesize = ConfigurationManager.AppSettings["filesize"];
            var id = Request.Url.Segments[4];
            var db = new LawPracticeEntities();
            var ddetails = db.ViewFiles.Where(z => z.Id.ToString() == id.ToString() && z.Firmid.ToString() == LoggedInUser.FirmId.ToString()).FirstOrDefault();
            ViewBag.dirname = ddetails.fname;
            ViewBag.userId = LoggedInUser.UserId;
            ViewBag.firmid = LoggedInUser.FirmId;
            return View();
        }
        /// <summary>
        /// Share user directory list
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult ShareUserDirectoryList()
        {
            ViewBag.pagesize = System.Configuration.ConfigurationManager.AppSettings["pagesize"];
            ViewBag.filesize = ConfigurationManager.AppSettings["filesize"];
            ViewBag.userId = LoggedInUser.UserId;
            ViewBag.firmid = LoggedInUser.FirmId;
            return View();
        }
        /// <summary>
        /// Share user file list
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult ShareUserFileList()
        {
            ViewBag.pagesize = System.Configuration.ConfigurationManager.AppSettings["pagesize"];
            ViewBag.filesize = ConfigurationManager.AppSettings["filesize"];
            ViewBag.userId = LoggedInUser.UserId;
            ViewBag.firmid = LoggedInUser.FirmId;
            return View();
        }
        /// <summary>
        /// Get case details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult CaseDetails()
        {
            try
            {
                ViewBag.filesize = ConfigurationManager.AppSettings["filesize"];
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
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            return View();
        }
        /// <summary>
        /// Get user activity details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult Activities()
        {
            ViewBag.pagesize = System.Configuration.ConfigurationManager.AppSettings["pagesize"];
            return View();
        }
        /// <summary>
        /// Get user event configuration details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult ConfigEvent()
        {
            ViewBag.filesize = ConfigurationManager.AppSettings["filesize"];
            var user = LoggedInUser.FirmId;
            var firmusers = (from c in db.FirmUsers
                             join d in db.Roles on c.RoleId equals d.ID
                             where c.Firmid.ToString() == user.ToString() && c.IsActive == true && c.RoleId != 3
                             select new
                             {
                                 label = c.UserName + " -( " + d.RoleName + " )",
                                 val = c.Id,
                                 roleid = c.RoleId,
                                 role = d.RoleName

                             }).ToList();
            ViewBag.Fruits = firmusers;
            return View();
        }

        /// <summary>
        /// Update user event configuration
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult ConfigEventEdit(string ids)
        {
            ViewBag.filesize = ConfigurationManager.AppSettings["filesize"];
            var typeid = QueryAES.UrlDecode(Request.QueryString["token"]);
            typeid = typeid.ToString().Replace(" ", "+");
            ViewBag.token = typeid;
            var user = LoggedInUser.FirmId;
            var firmusers = (from c in db.FirmUsers
                             join d in db.Roles on c.RoleId equals d.ID
                             where c.Firmid.ToString() == user.ToString() && c.IsActive == true && c.RoleId != 3
                             select new
                             {
                                 label = c.UserName + " -( " + d.RoleName + " )",
                                 val = c.Id,
                                 roleid = c.RoleId,
                                 role = d.RoleName

                             }).ToList();
            ViewBag.Fruits = firmusers;
            return View();
        }
        /// <summary>
        /// Edit user timer configuration
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult editConfigTimer()
        {
            var id = QueryAES.UrlDecode(Request.QueryString["token"]);
            id = id.ToString().Replace(" ", "+");
            ViewBag.timeid = id;
            return View();
        }
        /// <summary>
        /// Add user configuration call
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult ConfigCall()
        {
            ViewBag.filesize = ConfigurationManager.AppSettings["filesize"];
            var user = LoggedInUser.FirmId;
            var firmusers = (from c in db.FirmUsers
                             join d in db.Roles on c.RoleId equals d.ID
                             where c.Firmid.ToString() == user.ToString() && c.IsActive == true && c.RoleId != 3
                             select new
                             {
                                 label = c.UserName + " -( " + d.RoleName + " )",
                                 val = c.Id,
                                 roleid = c.RoleId,
                                 role = d.RoleName

                             }).ToList();
            ViewBag.Fruits = firmusers;
            return View();

        }
        /// <summary>
        /// Edit configuration call
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult ConfigCallEdit(string ids)
        {
            var typeid = QueryAES.UrlDecode(Request.QueryString["token"]);
            typeid = typeid.ToString().Replace(" ", "+");
            ViewBag.token = typeid;
            ViewBag.filesize = ConfigurationManager.AppSettings["filesize"];
            var user = LoggedInUser.FirmId;
            var firmusers = (from c in db.FirmUsers
                             join d in db.Roles on c.RoleId equals d.ID
                             where c.Firmid.ToString() == user.ToString() && c.IsActive == true && c.RoleId != 3
                             select new
                             {
                                 label = c.UserName + " -( " + d.RoleName + " )",
                                 val = c.Id,
                                 roleid = c.RoleId,
                                 role = d.RoleName

                             }).ToList();
            ViewBag.Fruits = firmusers;
            return View();
        }

        /// <summary>
        /// Add configuration notes
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult ConfigNote()
        {
            ViewBag.filesize = ConfigurationManager.AppSettings["filesize"];
            return View();
        }

        /// <summary>
        /// Edit configuration notes
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult ConfigNoteEdit(string ids)
        {
            ViewBag.filesize = ConfigurationManager.AppSettings["filesize"];
            var typeid = QueryAES.UrlDecode(Request.QueryString["token"]);
            typeid = typeid.ToString().Replace(" ", "+");
            ViewBag.token = typeid;
            return View();
        }
        /// <summary>
        /// User task configuration
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult ConfigTask()
        {
            ViewBag.filesize = ConfigurationManager.AppSettings["filesize"];
            var user = LoggedInUser.FirmId;
            var firmusers = (from c in db.FirmUsers
                             join d in db.Roles on c.RoleId equals d.ID
                             where c.Firmid.ToString() == user.ToString() && c.IsActive == true && c.RoleId != 3
                             select new
                             {
                                 label = c.UserName + " -( " + d.RoleName + " )",
                                 val = c.Id,
                                 roleid = c.RoleId,
                                 role = d.RoleName

                             }).ToList();
            ViewBag.Fruits = firmusers;
            return View();
        }
        /// <summary>
        /// Edit task configuration
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult ConfigTaskEdit(string ids)
        {
            ViewBag.filesize = ConfigurationManager.AppSettings["filesize"];
            var typeid = QueryAES.UrlDecode(Request.QueryString["token"]);
            typeid = typeid.ToString().Replace(" ", "+");
            ViewBag.token = typeid;
            var user = LoggedInUser.FirmId;
            var firmusers = (from c in db.FirmUsers
                             join d in db.Roles on c.RoleId equals d.ID
                             where c.Firmid.ToString() == user.ToString() && c.IsActive == true && c.RoleId != 3
                             select new
                             {
                                 label = c.UserName + " -( " + d.RoleName + " )",
                                 val = c.Id,
                                 roleid = c.RoleId,
                                 role = d.RoleName

                             }).ToList();
            ViewBag.Fruits = firmusers;
            return View();
        }
        /// <summary>
        /// View Single Task 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult TaskSingleView(string id = null)
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
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            ViewBag.aid = id;
            return View(id);
        }
        /// <summary>
        /// View user single event
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult EventSingleView(string ids)
        {
            try
            {
                var typeid = QueryAES.UrlDecode(Request.Form["token"]);
                ViewBag.token = typeid;
                typeid = typeid.ToString().Replace(" ", "+");
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
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            ViewBag.aid = ids;
            return View();
        }

        /// <summary>
        /// Single view notes
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult NoteSingleView(string ids)
        {
            try
            {
                var typeids = QueryAES.UrlDecode(Request.Form["token"]);
                ViewBag.token = typeids;
                typeids = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(typeids));
                var db = new LawPracticeEntities();
                var data = db.tbl_notification.Where(x => x.typeid.ToString() == typeids.ToString() && x.Firmid.ToString() == LoggedInUser.FirmId.ToString() && x.auser.ToString() == LoggedInUser.UserId.ToString()).FirstOrDefault();
                if (data != null)
                {
                    data.status = 1;
                    db.Entry(data).State = EntityState.Modified;
                    db.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            ViewBag.aid = ids;
            return View();
        }

        /// <summary>
        /// View single calls
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult CallSingleView(string ids)
        {
            try
            {
                var typeids = QueryAES.UrlDecode(Request.Form["token"]);
                var typeids2 = typeids;
                try
                {
                    typeids = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(typeids));
                    ViewBag.token = typeids2;
                }
                catch (Exception er)
                {
                    typeids2 = Convert.ToBase64String(QueryAES.EncryptAes(typeids2));
                    ViewBag.token = typeids2;
                }
                var db = new LawPracticeEntities();
                var data = db.tbl_notification.Where(x => x.typeid.ToString() == typeids.ToString() && x.Firmid.ToString() == LoggedInUser.FirmId.ToString() && x.auser.ToString() == LoggedInUser.UserId.ToString()).FirstOrDefault();
                if (data != null)
                {
                    data.status = 1;
                    db.Entry(data).State = EntityState.Modified;
                    db.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            ViewBag.aid = ids;
            return View();
        }

        /// <summary>
        /// Get calender details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult Calender()
        {
            return View();

        }
        /// <summary>
        /// To Handle connection related activities  
        /// </summary>
        private SqlConnection con;
        private void connection()
        {
            string constr = ConfigurationManager.ConnectionStrings["db_checksome"].ToString();
            con = new SqlConnection(constr);
        }
        /// <summary>
        /// View user case details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
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
        /// Get user Case details data
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public JsonResult CaseDetailsdata()
        {
            var path = Request.Url.AbsolutePath;
            var strdt = path.Split('/').Last();
            strdt = System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String(strdt));
            dynamic str = null;
            EventList recentlyViewedEvent1 = CalendarEventController.GetCalendarEventByUserName1("sudhakar", strdt);
            foreach (var myevent1 in recentlyViewedEvent1)
            {
                myevent1.text = "";
                myevent1.text = myevent1.Casetype + " " + myevent1.CaseNo + "/" + myevent1.Caseyear;
                str = recentlyViewedEvent1.ToList();
            }
            return Json(str, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Get Case Data By CaseId
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        [HttpPost]
        public JsonResult CaseViewDataDetail()
        {

            dynamic strdetail = "";
            EventList recentlyViewedEvent1;
            dynamic str = null;
            dynamic username = null;
            dynamic courtname = null;
            Userlist struser = CalendarEventController.GetCaseDataByCaseIdLawPractice("1622");
            foreach (var myevent2 in struser)
            {
                username = myevent2.name;
                courtname = myevent2.vCourt;
            }
            CaseDetailObjectList casemasterddata = CaseDetailObjeController.GetMasterCaseData(courtname, username);
            return Json(casemasterddata.ToList(), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Calender hybrid
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult CalendarHybrid()
        {
            return View();
        }
        /// <summary>
        /// Download Custom form
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
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
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            return View();
        }

        /// <summary>
        /// View Custom Form List
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
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
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");

            }
            return View();

        }
        /// <summary>
        /// Preview live page
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
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
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");

            }
            return View();

        }
        /// <summary>
        /// Send custom form from mail
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult CustomFormSendmail()
        {
            return View();
        }
        /// <summary>
        /// Update custom form data
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
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
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");

            }
            // ViewBag.aid = id;
            return View(id);

        }
        /// <summary>
        /// Timer configuration
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult ConfigTimer()
        {
            return View();

        }

        /// <summary>
        /// Add all timer
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult ConfigAllTimer()
        {
            return View();

        }
        /// <summary>
        /// View Timer
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult ViewTimer()
        {
            ViewBag.pagesize = System.Configuration.ConfigurationManager.AppSettings["pagesize"];
            return View();
        }
        /// <summary>
        /// View knowledge
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult ViewKnowledge()
        {
            ViewBag.pagesize = System.Configuration.ConfigurationManager.AppSettings["pagesize"];
            return View();
        }
        /// <summary>
        /// View fav knowledge
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult ViewKnowledgeFav()
        {
            ViewBag.pagesize = System.Configuration.ConfigurationManager.AppSettings["pagesize"];
            return View();
        }

        /// <summary>
        /// Compose NEw  Message Full Sreen
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult ComposeNewMessage()
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

                                     role = d.RoleName

                                 }).ToList();
                var firmusers1 = (from c in db.MessageGroups

                                  where c.Firmid.ToString() == user.ToString()
                                  select new
                                  {
                                      label = c.Groupname + " -(Group)",
                                      val = c.Id,
                                      role = ""

                                  }).ToList();
                var list = firmusers.Concat(firmusers1).ToList();
                ViewBag.Fruits = list;
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");

            }
            return View();

        }

        /// <summary>
        /// Sent reply message
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

                                     role = d.RoleName

                                 }).ToList();
                var firmusers1 = (from c in db.MessageGroups

                                  where c.Firmid.ToString() == user.ToString()
                                  select new
                                  {
                                      label = c.Groupname + " -(Group)",
                                      val = c.Id,
                                      role = ""

                                  }).ToList();
                var list = firmusers.Concat(firmusers1).ToList();
                ViewBag.Fruits = list;
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            return View();
        }

        /// <summary>
        /// Compose Message
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
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
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            return View();
        }
        /// <summary>
        /// View configuration message
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
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
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");

            }
            return View();
        }

        /// <summary>
        /// Configuration message list
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
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
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            return View();
        }

        /// <summary>
        /// Get archive message list
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
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
        /// Get received message list
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
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
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");

            }
            return View();
        }

        /// <summary>
        /// view user Lead details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult ViewLead()
        {
            ViewBag.pagesize = System.Configuration.ConfigurationManager.AppSettings["pagesize"];
            return View();

        }
        /// <summary>
        /// View single lead details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult LeadSingleView()
        {
            var typeid = QueryAES.UrlDecode(Request.Form["token"]);
            ViewBag.token = typeid;
            return View();

        }
        /// <summary>
        /// Get OCR details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult ocr()
        {
            ViewBag.pagesize = System.Configuration.ConfigurationManager.AppSettings["pagesize"];
            ViewBag.filesize = ConfigurationManager.AppSettings["filesize"];
            return View();
        }
        /// <summary>
        /// Get user draft message list
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
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
        /// User page security
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "User")]
        public ActionResult UserPageSecurity()
        {
            var db = new LawPracticeEntities();
            var liveurl = Request.Url.Segments[3].Replace("/", "");
            var checkdata = db.checkchildpageAuth(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), liveurl).FirstOrDefault();
            if (checkdata != null)
            {
                ViewBag.value = "none";
            }
            else
            {
                ViewBag.value = "ok";
            }
            return View();
        }


        /// <summary>
        /// Export user contact in excel
        /// </summary>
        [AuthLog(Roles = "User")]
        public void ExportoExcelContact()
        {
            try
            {
                var searchdata = QueryAES.UrlDecode(Request.QueryString["searchdata"]);
                var exportfilterdata = QueryAES.UrlDecode(Request.QueryString["exportfilter"]);

                string exlfilename = "ContactReport_" + DateTime.Now;

                var db = new LawPracticeEntities();
                if (exportfilterdata.ToString() == "true")
                {
                    List<GetSearchUserContactDetailsByRowId_Result> trialList_1 = new List<GetSearchUserContactDetailsByRowId_Result>();
                    trialList_1 = db.GetSearchUserContactDetailsByRowId(LoggedInUser.FirmId, LoggedInUser.UserId, 1, 1, 1, searchdata).ToList();
                    var actionmode = "";
                    var recentlabel = "";
                    GetSearchUserContactDetailsByRowId_Result Item = new GetSearchUserContactDetailsByRowId_Result();
                    int count = trialList_1.Count;
                    string sf = "dsf";
                    var trialList = (from ob in trialList_1
                                     select new
                                     {
                                         SlNo = ob.rownum,
                                         FullName = ob.fname + " " + ob.mname + " " + ob.lname,
                                         Mobile = ob.mobno,
                                         ContactTypes = ob.ContactType,
                                         Email = ob.cemail,
                                         Address = ob.cadd1,
                                         Tags = ob.ctags,
                                         Website = ob.cwebsite,
                                         ob.col1,
                                         ob.col2,
                                         ob.col3,
                                         ob.col4,
                                         ob.col5,
                                         ob.col6,
                                         ob.col7,
                                         ob.col8,
                                         ob.col9,
                                         ob.col10,
                                         ob.col11,
                                         ob.col12,
                                         ob.col13,
                                         ob.col14,
                                         ob.col15
                                     }).ToList();


                    var gv = new GridView();

                    gv.DataSource = trialList;


                    gv.DataBind();

                    var counts = gv.Rows.Count;
                    if (gv.Rows.Count > 0)
                    {
                        var datas = (from c in db.FirmConfiguredCustomFields

                                     join ct in db.CustomFields on c.FieldType equals ct.Id
                                     where c.Firmid.ToString() == LoggedInUser.FirmId.ToString() && c.ConfigurationType.ToString() == "7" && c.IsActive == true
                                     select new

                                     { // result selector 
                                         Id = c.Id,
                                         ConfigurationType = c.ConfigurationType,
                                         FieldName = c.FieldName,
                                         FieldType = c.FieldType,
                                         Formatter = string.IsNullOrEmpty(ct.Formatter) ? "" : ct.Formatter.Trim(),
                                         IsRequired = c.IsRequired,
                                         MaxLength = c.MaxLength,
                                         MinLength = c.MinLength,
                                         Sequence = c.Sequence,
                                         FieldValues = string.IsNullOrEmpty(ct.DefaultValues) ? c.FieldValues : ct.DefaultValues.Trim(),
                                         IsDefault = c.IsDefault,
                                         SubConfigurationType = c.SubConfigurationType,
                                         IsSortable = c.IsPositionChangable,
                                         Url = string.IsNullOrEmpty(ct.Url) ? "" : ct.Url.Trim()
                                     }).ToList();

                        int startindex = 9;

                        foreach (var incolumn in datas)
                        {
                            int colindex = datas.IndexOf(incolumn);
                            colindex = colindex + startindex;
                            gv.HeaderRow.Cells[colindex].Text = incolumn.FieldName;
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
                else
                {
                    List<GetUserContactDetailsByRowId_Result> trialList_1 = new List<GetUserContactDetailsByRowId_Result>();

                    trialList_1 = db.GetUserContactDetailsByRowId(LoggedInUser.FirmId, LoggedInUser.UserId, 1, 1, 1).ToList();
                    var actionmode = "";
                    var recentlabel = "";
                    GetUserContactDetailsByRowId_Result Item = new GetUserContactDetailsByRowId_Result();
                    int count = trialList_1.Count;
                    string sf = "dsf";
                    var trialList = (from ob in trialList_1
                                     select new
                                     {
                                         SlNo = ob.rownum,
                                         FullName = ob.fname + " " + ob.mname + " " + ob.lname,
                                         Mobile = ob.mobno,
                                         ContactTypes = ob.ContactType,
                                         Email = ob.cemail,
                                         Address = ob.cadd1,
                                         Tags = ob.ctags,
                                         Website = ob.cwebsite,
                                         ob.col1,
                                         ob.col2,
                                         ob.col3,
                                         ob.col4,
                                         ob.col5,
                                         ob.col6,
                                         ob.col7,
                                         ob.col8,
                                         ob.col9,
                                         ob.col10,
                                         ob.col11,
                                         ob.col12,
                                         ob.col13,
                                         ob.col14,
                                         ob.col15
                                     }).ToList();


                    var gv = new GridView();

                    gv.DataSource = trialList;


                    gv.DataBind();

                    var counts = gv.Rows.Count;
                    if (gv.Rows.Count > 0)
                    {


                        var datas = (from c in db.FirmConfiguredCustomFields

                                     join ct in db.CustomFields on c.FieldType equals ct.Id
                                     where c.Firmid.ToString() == LoggedInUser.FirmId.ToString() && c.ConfigurationType.ToString() == "7" && c.IsActive == true
                                     select new

                                     { // result selector 
                                         Id = c.Id,
                                         ConfigurationType = c.ConfigurationType,
                                         FieldName = c.FieldName,
                                         FieldType = c.FieldType,
                                         Formatter = string.IsNullOrEmpty(ct.Formatter) ? "" : ct.Formatter.Trim(),
                                         IsRequired = c.IsRequired,
                                         MaxLength = c.MaxLength,
                                         MinLength = c.MinLength,
                                         Sequence = c.Sequence,
                                         FieldValues = string.IsNullOrEmpty(ct.DefaultValues) ? c.FieldValues : ct.DefaultValues.Trim(),
                                         IsDefault = c.IsDefault,
                                         SubConfigurationType = c.SubConfigurationType,
                                         IsSortable = c.IsPositionChangable,
                                         Url = string.IsNullOrEmpty(ct.Url) ? "" : ct.Url.Trim()
                                     }).ToList();

                        int startindex = 9;

                        foreach (var incolumn in datas)
                        {
                            int colindex = datas.IndexOf(incolumn);
                            colindex = colindex + startindex;
                            gv.HeaderRow.Cells[colindex].Text = incolumn.FieldName;


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
            }
            catch (Exception ex)
            {
                Response.Redirect("/home/Error");
            }

        }

        /// <summary>
        /// Export contact to pdf
        /// </summary>
        [AuthLog(Roles = "User")]
        public void ExportoPdfContact()
        {
            try
            {
                var searchdata = QueryAES.UrlDecode(Request.QueryString["searchdata"]);
                var exportfilterdata = QueryAES.UrlDecode(Request.QueryString["exportfilter"]);

                string filename = "ContactReport.pdf";
                string firmid = LoggedInUser.FirmId.ToString();
                string userid = LoggedInUser.UserId.ToString();


                var db = new LawPracticeEntities();


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
                strtemplate += "<center><p><strong>Mykase-Contact List</strong><span style='float:right'>Date: " + String.Format("{0:dd MMM yyyy}", DateTime.Now) + "</span></p></hr>";
                strtemplate += " <p></p>";
                strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                strtemplate += "  <thead><tr> ";
                strtemplate += "<th height='20' width='5%' align='left' valign='top' style='padding:0 5px;'>Sl. No.</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Full Name</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Mobile No.</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Contact Type</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Email</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Address</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Tags</th>";
                strtemplate += "<th height='20' width='10%' align='left' valign='top' style='padding:0 5px;'>Website</th>";


                strtemplate += "</tr></thead><tbody>";


                if (exportfilterdata.ToString() == "true")
                {
                    List<GetSearchUserContactDetailsByRowId_Result> trialList_1 = new List<GetSearchUserContactDetailsByRowId_Result>();
                    trialList_1 = db.GetSearchUserContactDetailsByRowId(LoggedInUser.FirmId, LoggedInUser.UserId, 1, 1, 1, searchdata).ToList();
                    if (trialList_1 != null)
                    {
                        foreach (GetSearchUserContactDetailsByRowId_Result idata in trialList_1)
                        {

                            strtemplate += "<tr><td height = '20' align = 'left' valign ='top'  style='padding:0 5px;' >" + idata.rownum + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.fname + " " + idata.mname + " " + idata.lname + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.mobno + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.ContactType + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.cemail + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.cadd1 + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.ctags + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.cwebsite + " </td></tr>";

                        }
                        strtemplate += "</tbody></table>";
                    }
                    else
                    {
                    }
                }
                else
                {
                    List<GetUserContactDetailsByRowId_Result> trialList_1 = new List<GetUserContactDetailsByRowId_Result>();
                    trialList_1 = db.GetUserContactDetailsByRowId(LoggedInUser.FirmId, LoggedInUser.UserId, 1, 1, 1).ToList();
                    if (trialList_1 != null)
                    {
                        foreach (GetUserContactDetailsByRowId_Result idata in trialList_1)
                        {
                            strtemplate += "<tr><td height = '20' align = 'left' valign ='top'  style='padding:0 5px;' >" + idata.rownum + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.fname + " " + idata.mname + " " + idata.lname + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'  style='padding:0 5px;'> " + idata.mobno + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.ContactType + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.cemail + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.cadd1 + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.ctags + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.cwebsite + " </td></tr>";
                        }
                        strtemplate += "</tbody></table>";
                    }
                    else
                    {
                    }
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
                Response.Redirect("/home/Error");
            }

        }

        /// <summary>
        /// Export case in excel
        /// </summary>
        [AuthLog(Roles = "User")]
        public void ExportoExcelCase()
        {
            try
            {
                var searchdata = QueryAES.UrlDecode(Request.QueryString["searchdata"]);
                var exportfilterdata = QueryAES.UrlDecode(Request.QueryString["exportfilter"]);

                string exlfilename = "CaseReport_" + DateTime.Now;

                var db = new LawPracticeEntities();

                if (exportfilterdata.ToString() == "true")
                {
                    List<GetSearchUserMattersDetailByRowId_Result> trialList_1 = new List<GetSearchUserMattersDetailByRowId_Result>();

                    trialList_1 = db.GetSearchUserMattersDetailByRowId(LoggedInUser.FirmId, LoggedInUser.UserId, 1, 1, 1, searchdata).OrderBy(s => s.rownum).ToList();

                    StringBuilder sb = new StringBuilder();
                    foreach (var data in trialList_1.ToList())
                    {
                        sb.Clear();
                        GetSearchUserMattersDetailByRowId_Result newItem = new GetSearchUserMattersDetailByRowId_Result();

                        if (!string.IsNullOrEmpty(data.assignuserto))
                        {
                            string[] words = data.assignuserto.ToString().Split(',');
                            foreach (string word in words)
                            {
                                string tempuser = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(word.ToString()));
                                sb.Append(tempuser);
                                sb.Append(",");
                            }
                            newItem.assignuserto = sb.ToString().TrimEnd(',');
                            trialList_1[trialList_1.IndexOf(data)].assignuserto = newItem.assignuserto;
                        }

                        if (!string.IsNullOrEmpty(data.assignuserby))
                        {
                            newItem.assignuserby = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.assignuserby.ToString()));
                            trialList_1[trialList_1.IndexOf(data)].assignuserby = newItem.assignuserby;
                        }
                    }
                    var actionmode = "";
                    var recentlabel = "";
                    GetSearchUserMattersDetailByRowId_Result Item = new GetSearchUserMattersDetailByRowId_Result();
                    int count = trialList_1.Count;
                    var trialList = (from ob in trialList_1
                                     select new
                                     {
                                         SlNo = ob.rownum,
                                         CaseName = ob.mname,
                                         ClientName = ob.UserName,
                                         CNRNo = ob.cnrno,
                                         Status = ob.cstatus,
                                         CaseSubject = ob.CaseSubject,
                                         TimeSpend = ob.TotalCaseTime,
                                         AssignTo = ob.assignuserto,
                                         AssignBy = ob.assignuserby,
                                         OpenDate = String.Format("{0:dd MMM yyyy}", ob.odate),
                                         CloseDate = String.Format("{0:dd MMM yyyy}", ob.cdate),
                                         CreateDate = String.Format("{0:dd MMM yyyy}", ob.date_time) + " " + String.Format("{0:HH:mm:ss}", ob.date_time),
                                         Tags = ob.tags,
                                         ob.col1,
                                         ob.col2,
                                         ob.col3,
                                         ob.col4,
                                         ob.col5,
                                         ob.col6,
                                         ob.col7,
                                         ob.col8,
                                         ob.col9,
                                         ob.col10,
                                         ob.col11,
                                         ob.col12,
                                         ob.col13,
                                         ob.col14,
                                         ob.col15
                                     }).ToList();

                    var gv = new GridView();
                    gv.DataSource = trialList;
                    gv.DataBind();
                    var counts = gv.Rows.Count;
                    if (gv.Rows.Count > 0)
                    {
                        var datas = (from c in db.FirmConfiguredCustomFields
                                     join ct in db.CustomFields on c.FieldType equals ct.Id
                                     where c.Firmid.ToString() == LoggedInUser.FirmId.ToString() && c.ConfigurationType.ToString() == "8" && c.IsActive == true
                                     select new
                                     { // result selector 
                                         Id = c.Id,
                                         ConfigurationType = c.ConfigurationType,
                                         FieldName = c.FieldName,
                                         FieldType = c.FieldType,
                                         Formatter = string.IsNullOrEmpty(ct.Formatter) ? "" : ct.Formatter.Trim(),
                                         IsRequired = c.IsRequired,
                                         MaxLength = c.MaxLength,
                                         MinLength = c.MinLength,
                                         Sequence = c.Sequence,
                                         FieldValues = string.IsNullOrEmpty(ct.DefaultValues) ? c.FieldValues : ct.DefaultValues.Trim(),
                                         IsDefault = c.IsDefault,
                                         SubConfigurationType = c.SubConfigurationType,
                                         IsSortable = c.IsPositionChangable,
                                         Url = string.IsNullOrEmpty(ct.Url) ? "" : ct.Url.Trim()
                                     }).ToList();

                        int startindex = 13;

                        foreach (var incolumn in datas)
                        {
                            int colindex = datas.IndexOf(incolumn);
                            colindex = colindex + startindex;
                            gv.HeaderRow.Cells[colindex].Text = incolumn.FieldName;
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
                else
                {
                    List<GetUserMattersDetailByRowId_Result> trialList_1 = new List<GetUserMattersDetailByRowId_Result>();
                    trialList_1 = db.GetUserMattersDetailByRowId(LoggedInUser.FirmId, LoggedInUser.UserId, 1, 1, 1).OrderBy(s => s.rownum).ToList();
                    StringBuilder sb = new StringBuilder();
                    foreach (var data in trialList_1.ToList())
                    {
                        sb.Clear();
                        GetSearchUserMattersDetailByRowId_Result newItem = new GetSearchUserMattersDetailByRowId_Result();

                        if (!string.IsNullOrEmpty(data.assignuserto))
                        {
                            string[] words = data.assignuserto.ToString().Split(',');
                            foreach (string word in words)
                            {
                                string tempuser = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(word.ToString()));
                                sb.Append(tempuser);
                                sb.Append(",");
                            }
                            newItem.assignuserto = sb.ToString().TrimEnd(',');
                            trialList_1[trialList_1.IndexOf(data)].assignuserto = newItem.assignuserto;
                        }

                        if (!string.IsNullOrEmpty(data.assignuserby))
                        {
                            newItem.assignuserby = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.assignuserby.ToString()));
                            trialList_1[trialList_1.IndexOf(data)].assignuserby = newItem.assignuserby;
                        }

                    }
                    var actionmode = "";
                    var recentlabel = "";
                    GetUserMattersDetailByRowId_Result Item = new GetUserMattersDetailByRowId_Result();
                    int count = trialList_1.Count;

                    var trialList = (from ob in trialList_1
                                     select new
                                     {
                                         SlNo = ob.rownum,
                                         CaseName = ob.mname,
                                         ClientName = ob.UserName,
                                         CNRNo = ob.cnrno,
                                         Status = ob.cstatus,
                                         CaseSubject = ob.CaseSubject,
                                         TimeSpend = ob.TotalCaseTime,
                                         AssignTo = ob.assignuserto,
                                         AssignBy = ob.assignuserby,
                                         OpenDate = String.Format("{0:dd MMM yyyy}", ob.odate),
                                         CloseDate = String.Format("{0:dd MMM yyyy}", ob.cdate),
                                         CreateDate = String.Format("{0:dd MMM yyyy}", ob.date_time) + " " + String.Format("{0:HH:mm:ss}", ob.date_time),
                                         Tags = ob.tags,
                                         ob.col1,
                                         ob.col2,
                                         ob.col3,
                                         ob.col4,
                                         ob.col5,
                                         ob.col6,
                                         ob.col7,
                                         ob.col8,
                                         ob.col9,
                                         ob.col10,
                                         ob.col11,
                                         ob.col12,
                                         ob.col13,
                                         ob.col14,
                                         ob.col15
                                     }).ToList();
                    var gv = new GridView();
                    gv.DataSource = trialList;
                    gv.DataBind();
                    var counts = gv.Rows.Count;
                    if (gv.Rows.Count > 0)
                    {
                        var datas = (from c in db.FirmConfiguredCustomFields
                                     join ct in db.CustomFields on c.FieldType equals ct.Id
                                     where c.Firmid.ToString() == LoggedInUser.FirmId.ToString() && c.ConfigurationType.ToString() == "8" && c.IsActive == true
                                     select new

                                     { // result selector 
                                         Id = c.Id,
                                         ConfigurationType = c.ConfigurationType,
                                         FieldName = c.FieldName,
                                         FieldType = c.FieldType,
                                         Formatter = string.IsNullOrEmpty(ct.Formatter) ? "" : ct.Formatter.Trim(),
                                         IsRequired = c.IsRequired,
                                         MaxLength = c.MaxLength,
                                         MinLength = c.MinLength,
                                         Sequence = c.Sequence,
                                         FieldValues = string.IsNullOrEmpty(ct.DefaultValues) ? c.FieldValues : ct.DefaultValues.Trim(),
                                         IsDefault = c.IsDefault,
                                         SubConfigurationType = c.SubConfigurationType,
                                         IsSortable = c.IsPositionChangable,
                                         Url = string.IsNullOrEmpty(ct.Url) ? "" : ct.Url.Trim()
                                     }).ToList();

                        int startindex = 13;

                        foreach (var incolumn in datas)
                        {
                            int colindex = datas.IndexOf(incolumn);
                            colindex = colindex + startindex;
                            gv.HeaderRow.Cells[colindex].Text = incolumn.FieldName;
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
            }
            catch (Exception ex)
            {
                Response.Redirect("/home/Error");
            }
        }

        /// <summary>
        /// Export case in pdf
        /// </summary>
        [AuthLog(Roles = "User")]
        public void ExportoPdfCase()
        {
            try
            {
                var searchdata = QueryAES.UrlDecode(Request.QueryString["searchdata"]);
                var exportfilterdata = QueryAES.UrlDecode(Request.QueryString["exportfilter"]);
                string filename = "CaseReport.pdf";
                string firmid = LoggedInUser.FirmId.ToString();
                string userid = LoggedInUser.UserId.ToString();
                var db = new LawPracticeEntities();
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
                strtemplate += "<center><p><strong>Mykase-Case List</strong><span style='float:right'>Date: " + String.Format("{0:dd MMM yyyy}", DateTime.Now) + "</span></p></hr>";
                strtemplate += " <p></p>";
                strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                strtemplate += "  <thead><tr> ";
                strtemplate += "<th height='20' width='5%' align='left' valign='top' style='padding:0 5px;'>Sl. No.</th>";
                strtemplate += "<th height='20' width='8%' align='left' valign='top' style='padding:0 5px;'>Case Name</th>";
                strtemplate += "<th height='20' width='8%' align='left' valign='top' style='padding:0 5px;'>Client Name</th>";
                strtemplate += "<th height='20' width='8%' align='left' valign='top' style='padding:0 5px;'>CNRNo</th>";
                strtemplate += "<th height='20' width='8%' align='left' valign='top' style='padding:0 5px;'>CaseSubject</th>";
                strtemplate += "<th height='20' width='8%' align='left' valign='top' style='padding:0 5px;'>TimeSpend</th>";
                strtemplate += "<th height='20' width='8%' align='left' valign='top' style='padding:0 5px;'>AssignTo</th>";
                strtemplate += "<th height='20' width='8%' align='left' valign='top' style='padding:0 5px;'>AssignBy</th>";
                strtemplate += "<th height='20' width='8%' align='left' valign='top' style='padding:0 5px;'>OpenDate</th>";
                strtemplate += "<th height='20' width='8%' align='left' valign='top' style='padding:0 5px;'>CloseDate</th>";
                strtemplate += "<th height='20' width='8%' align='left' valign='top' style='padding:0 5px;'>CreateDate</th>";
                strtemplate += "<th height='20' width='8%' align='left' valign='top' style='padding:0 5px;'>Tags</th>";
                strtemplate += "</tr></thead><tbody>";

                if (exportfilterdata.ToString() == "true")
                {
                    List<GetSearchUserMattersDetailByRowId_Result> trialList_1 = new List<GetSearchUserMattersDetailByRowId_Result>();
                    trialList_1 = db.GetSearchUserMattersDetailByRowId(LoggedInUser.FirmId, LoggedInUser.UserId, 1, 1, 1, searchdata).OrderBy(s => s.rownum).ToList();

                    StringBuilder sb = new StringBuilder();
                    foreach (var data in trialList_1.ToList())
                    {
                        sb.Clear();
                        GetSearchUserMattersDetailByRowId_Result newItem = new GetSearchUserMattersDetailByRowId_Result();

                        if (!string.IsNullOrEmpty(data.assignuserto))
                        {
                            string[] words = data.assignuserto.ToString().Split(',');
                            foreach (string word in words)
                            {
                                string tempuser = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(word.ToString()));
                                sb.Append(tempuser);
                                sb.Append(",");
                            }
                            newItem.assignuserto = sb.ToString().TrimEnd(',');
                            trialList_1[trialList_1.IndexOf(data)].assignuserto = newItem.assignuserto;
                        }

                        if (!string.IsNullOrEmpty(data.assignuserby))
                        {
                            newItem.assignuserby = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.assignuserby.ToString()));
                            trialList_1[trialList_1.IndexOf(data)].assignuserby = newItem.assignuserby;
                        }
                    }
                    if (trialList_1 != null)
                    {
                        foreach (GetSearchUserMattersDetailByRowId_Result idata in trialList_1)
                        {
                            strtemplate += "<tr><td height = '20' align = 'left' valign ='top' style='padding:0 5px;' >" + idata.rownum + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'  style='padding:0 5px;' > " + idata.mname + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'  style='padding:0 5px;' > " + idata.UserName + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.cnrno + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.CaseSubject + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.TotalCaseTime + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.assignuserto + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'  style='padding:0 5px;'> " + idata.assignuserby + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'  style='padding:0 5px;'> " + String.Format("{0:dd MMM yyyy}", idata.odate) + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + String.Format("{0:dd MMM yyyy}", idata.cdate) + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + String.Format("{0:dd MMM yyyy}", idata.date_time) + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.tags + " </td></tr>";
                        }
                        strtemplate += "</tbody></table>";
                    }
                    else
                    {
                    }
                }
                else
                {
                    List<GetUserMattersDetailByRowId_Result> trialList_1 = new List<GetUserMattersDetailByRowId_Result>();
                    trialList_1 = db.GetUserMattersDetailByRowId(LoggedInUser.FirmId, LoggedInUser.UserId, 1, 1, 1).OrderBy(s => s.rownum).ToList();
                    StringBuilder sb = new StringBuilder();
                    foreach (var data in trialList_1.ToList())
                    {
                        sb.Clear();
                        GetSearchUserMattersDetailByRowId_Result newItem = new GetSearchUserMattersDetailByRowId_Result();

                        if (!string.IsNullOrEmpty(data.assignuserto))
                        {
                            string[] words = data.assignuserto.ToString().Split(',');
                            foreach (string word in words)
                            {
                                string tempuser = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(word.ToString()));
                                sb.Append(tempuser);
                                sb.Append(",");
                            }
                            newItem.assignuserto = sb.ToString().TrimEnd(',');
                            trialList_1[trialList_1.IndexOf(data)].assignuserto = newItem.assignuserto;
                        }

                        if (!string.IsNullOrEmpty(data.assignuserby))
                        {
                            newItem.assignuserby = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.assignuserby.ToString()));
                            trialList_1[trialList_1.IndexOf(data)].assignuserby = newItem.assignuserby;
                        }

                    }
                    if (trialList_1 != null)
                    {
                        foreach (GetUserMattersDetailByRowId_Result idata in trialList_1)
                        {

                            strtemplate += "<tr><td height = '20' align = 'left' valign ='top' style='padding:0 5px;' >" + idata.rownum + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.mname + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'  style='padding:0 5px;' > " + idata.UserName + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.cnrno + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.CaseSubject + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.TotalCaseTime + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.assignuserto + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.assignuserby + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + String.Format("{0:dd MMM yyyy}", idata.odate) + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + String.Format("{0:dd MMM yyyy}", idata.cdate) + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + String.Format("{0:dd MMM yyyy}", idata.date_time) + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.tags + " </td></tr>";
                        }
                        strtemplate += "</tbody></table>";
                    }
                    else
                    {
                    }
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
                Response.Redirect("/home/Error");
            }
        }

        /// <summary>
        /// Export client list in excel
        /// </summary>
        [AuthLog(Roles = "User")]
        public void ExportoExcelClientList()
        {
            try
            {
                var searchdata = QueryAES.UrlDecode(Request.QueryString["searchdata"]);
                var exportfilterdata = QueryAES.UrlDecode(Request.QueryString["exportfilter"]);
                var pagetype = QueryAES.UrlDecode(Request.QueryString["pagetype"]);
                string exlfilename = "ClientList_" + DateTime.Now;
                var db = new LawPracticeEntities();
                if (exportfilterdata.ToString() == "true")
                {
                    List<ClientSearchListUserByRowid_Result> trialList_1 = new List<ClientSearchListUserByRowid_Result>();
                    trialList_1 = db.ClientSearchListUserByRowid(LoggedInUser.FirmId, LoggedInUser.UserId, 1, 1, 1, searchdata).ToList();
                    var actionmode = "";
                    var recentlabel = "";
                    ClientSearchListUserByRowid_Result Item = new ClientSearchListUserByRowid_Result();
                    int count = trialList_1.Count;
                    int ccnt = 0;
                    var trialList = (from ob in trialList_1
                                     select new
                                     {

                                         ClientName = String.IsNullOrEmpty(ob.cfname) ? ob.cfname : QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(ob.cfname)),
                                         LoginUserName = ob.Username,
                                         Email = ob.cemail,
                                         Mobile = String.IsNullOrEmpty(ob.cmobile) ? ob.cfname : QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(ob.cmobile)),
                                         Address = String.IsNullOrEmpty(ob.caddress) ? ob.caddress : QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(ob.caddress)),
                                         State = ob.cstate,
                                         City = ob.ccity,
                                         Country = ob.country,
                                         LandLine = String.IsNullOrEmpty(ob.clandline) ? ob.clandline : QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(ob.clandline)),
                                         Date = String.Format("{0:dd MMM yyyy}", ob.date_time) + " " + String.Format("{0:HH:mm:ss}", ob.date_time),

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
                    List<ClientListUserByRowid_Result> trialList_1 = new List<ClientListUserByRowid_Result>();
                    trialList_1 = db.ClientListUserByRowid(LoggedInUser.FirmId, LoggedInUser.UserId, 1, 1, 1).ToList();
                    var actionmode = "";
                    var recentlabel = "";
                    ClientListUserByRowid_Result Item = new ClientListUserByRowid_Result();
                    int count = trialList_1.Count;
                    int ccnt = 0;
                    var trialList = (from ob in trialList_1
                                     select new
                                     {

                                         ClientName = String.IsNullOrEmpty(ob.cfname) ? ob.cfname : QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(ob.cfname)),
                                         LoginUserName = ob.Username,
                                         Email = ob.cemail,
                                         Mobile = String.IsNullOrEmpty(ob.cmobile) ? ob.cfname : QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(ob.cmobile)),
                                         Address = String.IsNullOrEmpty(ob.caddress) ? ob.caddress : QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(ob.caddress)),
                                         State = ob.cstate,
                                         City = ob.ccity,
                                         Country = ob.country,
                                         LandLine = String.IsNullOrEmpty(ob.clandline) ? ob.clandline : QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(ob.clandline)),
                                         Date = String.Format("{0:dd MMM yyyy}", ob.date_time) + " " + String.Format("{0:HH:mm:ss}", ob.date_time),

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
                Response.Redirect("/home/Error");
            }

        }

        /// <summary>
        /// Export client list in pdf
        /// </summary>
        [AuthLog(Roles = "User")]
        public void ExportoPdfClientList()
        {
            try
            {
                var searchdata = QueryAES.UrlDecode(Request.QueryString["searchdata"]);
                var exportfilterdata = QueryAES.UrlDecode(Request.QueryString["exportfilter"]);
                string filename = "ClientList.pdf";
                string firmid = LoggedInUser.FirmId.ToString();
                string userid = LoggedInUser.UserId.ToString();
                var db = new LawPracticeEntities();
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
                strtemplate += "<center><p><strong>Mykase-Client List</strong><span style='float:right'>Date: " + String.Format("{0:dd MMM yyyy}", DateTime.Now) + "</span></p></hr>";
                strtemplate += " <p></p>";
                strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                strtemplate += "  <thead><tr> ";
                strtemplate += "<th height='20'  width='5%' align='left' valign='top' style='padding:0 5px;'>Sl. No.</th>";
                strtemplate += "<th height='20'  width='10%' align='left' valign='top' style='padding:0 5px;'>Client Name</th>";
                strtemplate += "<th height='20'  width='14%' align='left' valign='top' style='padding:0 5px;'>Login UserName</th>";
                strtemplate += "<th height='20'  width='10%' align='left' valign='top' style='padding:0 5px;'>Email</th>";
                strtemplate += "<th height='20'  width='10%' align='left' valign='top' style='padding:0 5px;'>Mobile</th>";
                strtemplate += "<th height='20'  width='10%' align='left' valign='top' style='padding:0 5px;'>Address</th>";
                strtemplate += "<th height='20'  width='10%' align='left' valign='top' style='padding:0 5px;'>State</th>";
                strtemplate += "<th height='20'  width='10%' align='left' valign='top' style='padding:0 5px;'>City</th>";
                strtemplate += "<th height='20'  width='10%' align='left' valign='top' style='padding:0 5px;'>Country</th>";
                strtemplate += "<th height='20'  width='10%' align='left' valign='top' style='padding:0 5px;'>Landline</th>";
                strtemplate += "<th height='20'  width='10%' align='left' valign='top' style='padding:0 5px;'>Date</th>";

                strtemplate += "</tr></thead><tbody>";
                if (exportfilterdata.ToString() == "true")
                {
                    List<ClientSearchListUserByRowid_Result> trialList_1 = new List<ClientSearchListUserByRowid_Result>();
                    trialList_1 = db.ClientSearchListUserByRowid(LoggedInUser.FirmId, LoggedInUser.UserId, 1, 1, 1, searchdata).ToList();
                    if (trialList_1 != null)
                    {
                        int cnr = 0;
                        foreach (ClientSearchListUserByRowid_Result idata in trialList_1.ToList())
                        {

                            cnr = cnr + 1;
                            strtemplate += "<tr><td height = '20' align = 'left' valign ='top' style='padding:0 5px;' >" + cnr + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + (String.IsNullOrEmpty(idata.cfname) ? idata.cfname : QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(idata.cfname))) + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.Username + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.cemail + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + (String.IsNullOrEmpty(idata.cmobile) ? idata.cmobile : QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(idata.cmobile))) + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + (String.IsNullOrEmpty(idata.caddress) ? idata.caddress : QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(idata.caddress))) + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.cstate + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.ccity + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.country + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + (String.IsNullOrEmpty(idata.clandline) ? idata.clandline : QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(idata.clandline))) + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + String.Format("{0:dd MMM yyyy}", idata.date_time) + " </td></tr>";
                        }
                        strtemplate += "</tbody></table>";
                    }
                    else
                    {
                    }
                }
                else
                {
                    List<ClientListUserByRowid_Result> trialList_1 = new List<ClientListUserByRowid_Result>();
                    trialList_1 = db.ClientListUserByRowid(LoggedInUser.FirmId, LoggedInUser.UserId, 1, 1, 1).ToList();
                    if (trialList_1 != null)
                    {
                        int cnr = 0;
                        foreach (ClientListUserByRowid_Result idata in trialList_1.ToList())
                        {

                            cnr = cnr + 1;
                            strtemplate += "<tr><td height = '20' align = 'left' valign ='top' style='padding:0 5px;' >" + cnr + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + (String.IsNullOrEmpty(idata.cfname) ? idata.cfname : QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(idata.cfname))) + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.Username + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.cemail + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + (String.IsNullOrEmpty(idata.cmobile) ? idata.cmobile : QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(idata.cmobile))) + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + (String.IsNullOrEmpty(idata.caddress) ? idata.caddress : QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(idata.caddress))) + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.cstate + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.ccity + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.country + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + (String.IsNullOrEmpty(idata.clandline) ? idata.clandline : QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(idata.clandline))) + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + String.Format("{0:dd MMM yyyy}", idata.date_time) + " </td></tr>";
                        }
                        strtemplate += "</tbody></table>";
                    }
                    else
                    {
                    }

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
                Response.Redirect("/home/Error");
            }
        }

        /// <summary>
        /// Export user timer list in excel
        /// </summary>
        [AuthLog(Roles = "User")]
        public void ExportoExcelTimerList()
        {
            try
            {
                var searchdata = QueryAES.UrlDecode(Request.QueryString["searchdata"]);
                var exportfilterdata = QueryAES.UrlDecode(Request.QueryString["exportfilter"]);
                var pagetype = QueryAES.UrlDecode(Request.QueryString["pagetype"]);
                string exlfilename = "CaseTimerList_" + DateTime.Now;
                var db = new LawPracticeEntities();
                if (exportfilterdata.ToString() == "true")
                {
                    List<GetSearchUserTimerDetailsByRowId_Result> trialList_1 = new List<GetSearchUserTimerDetailsByRowId_Result>();
                    trialList_1 = db.GetSearchUserTimerDetailsByRowId(LoggedInUser.FirmId, LoggedInUser.UserId, 1, 1, 1, searchdata).ToList();
                    var actionmode = "";
                    var recentlabel = "";
                    GetSearchUserTimerDetailsByRowId_Result Item = new GetSearchUserTimerDetailsByRowId_Result();
                    int count = trialList_1.Count;
                    var trialList = (from ob in trialList_1
                                     select new
                                     {
                                         SlNo = ob.rownum,
                                         CaseName = ob.mattername,
                                         Client = String.IsNullOrEmpty(ob.client) ? ob.client : QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(ob.client)),
                                         Date = String.Format("{0:dd MMM yyyy}", ob.date_time) + " " + String.Format("{0:HH:mm:ss}", ob.date_time),
                                         Duartion = ob.callDura,
                                         Billedby = String.IsNullOrEmpty(ob.billedby) ? ob.billedby : QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(ob.billedby)),
                                         CreatedBy = String.IsNullOrEmpty(ob.createdby) ? ob.createdby : QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(ob.createdby)),
                                         Item = ob.titem,
                                         HourlyRate = ob.hrrate,
                                         Total = ob.total,
                                         Details = ob.tdetails
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
                    List<GetUserTimerDetailsByRowId_Result> trialList_1 = new List<GetUserTimerDetailsByRowId_Result>();
                    trialList_1 = db.GetUserTimerDetailsByRowId(LoggedInUser.FirmId, LoggedInUser.UserId, 1, 1, 1).ToList();
                    var actionmode = "";
                    var recentlabel = "";
                    GetUserTimerDetailsByRowId_Result Item = new GetUserTimerDetailsByRowId_Result();
                    int count = trialList_1.Count;
                    var trialList = (from ob in trialList_1
                                     select new
                                     {
                                         SlNo = ob.rownum,
                                         CaseName = ob.mattername,
                                         Client = String.IsNullOrEmpty(ob.client) ? ob.client : QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(ob.client)),
                                         Date = String.Format("{0:dd MMM yyyy}", ob.date_time) + " " + String.Format("{0:HH:mm:ss}", ob.date_time),
                                         Duartion = ob.callDura,
                                         Billedby = String.IsNullOrEmpty(ob.billedby) ? ob.billedby : QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(ob.billedby)),
                                         CreatedBy = String.IsNullOrEmpty(ob.createdby) ? ob.createdby : QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(ob.createdby)),
                                         Item = ob.titem,
                                         HourlyRate = ob.hrrate,
                                         Total = ob.total,
                                         Details = ob.tdetails

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
                Response.Redirect("/home/Error");
            }
        }

        /// <summary>
        /// Export timer list in excel
        /// </summary>
        [AuthLog(Roles = "User")]
        public void ExportoPdfTimerList()
        {
            try
            {
                var searchdata = QueryAES.UrlDecode(Request.QueryString["searchdata"]);
                var exportfilterdata = QueryAES.UrlDecode(Request.QueryString["exportfilter"]);
                string filename = "CaseTimer.pdf";
                string firmid = LoggedInUser.FirmId.ToString();
                string userid = LoggedInUser.UserId.ToString();
                var db = new LawPracticeEntities();
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
                strtemplate += "<center><p><strong>Mykase-Case Timer List</strong><span style='float:right'>Date: " + String.Format("{0:dd MMM yyyy}", DateTime.Now) + "</span></p></hr>";
                strtemplate += " <p></p>";
                strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                strtemplate += "  <thead><tr> ";
                strtemplate += "<th height='20' width='5%' align='left' valign='top' style='padding:0 5px;'>Sl. No.</th>";
                strtemplate += "<th height='20' width='9%' align='left' valign='top' style='padding:0 5px;'>Case Name</th>";
                strtemplate += "<th height='20' width='9%' align='left' valign='top' style='padding:0 5px;'>Client</th>";
                strtemplate += "<th height='20' width='9%' align='left' valign='top' style='padding:0 5px;'>Date</th>";
                strtemplate += "<th height='20' width='9%' align='left' valign='top' style='padding:0 5px;'>Duartion</th>";
                strtemplate += "<th height='20' width='9%' align='left' valign='top' style='padding:0 5px;'>Billed By</th>";
                strtemplate += "<th height='20' width='9%' align='left' valign='top' style='padding:0 5px;'>Created By</th>";
                strtemplate += "<th height='20' width='9%' align='left' valign='top' style='padding:0 5px;'>Item</th>";
                strtemplate += "<th height='20' width='9%' align='left' valign='top' style='padding:0 5px;'>Hourly Rate</th>";
                strtemplate += "<th height='20' width='9%' align='left' valign='top' style='padding:0 5px;'>Total</th>";
                strtemplate += "<th height='20' width='9%' align='left' valign='top' style='padding:0 5px;'>Details</th>";
                strtemplate += "</tr></thead><tbody>";
                if (exportfilterdata.ToString() == "true")
                {
                    List<GetSearchUserTimerDetailsByRowId_Result> trialList_1 = new List<GetSearchUserTimerDetailsByRowId_Result>();

                    trialList_1 = db.GetSearchUserTimerDetailsByRowId(LoggedInUser.FirmId, LoggedInUser.UserId, 1, 1, 1, searchdata).ToList();
                    if (trialList_1 != null)
                    {
                        foreach (GetSearchUserTimerDetailsByRowId_Result idata in trialList_1)
                        {

                            strtemplate += "<tr><td height = '20' align = 'left' valign ='top' style='padding:0 5px;' >" + idata.rownum + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.mattername + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + (String.IsNullOrEmpty(idata.client) ? idata.client : QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(idata.client))) + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + String.Format("{0:dd MMM yyyy}", idata.date_time) + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.callDura + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + (String.IsNullOrEmpty(idata.billedby) ? idata.billedby : QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(idata.billedby))) + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + (String.IsNullOrEmpty(idata.createdby) ? idata.createdby : QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(idata.createdby))) + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.titem + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.hrrate + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.total + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.tdetails + " </td></tr>";
                        }
                        strtemplate += "</tbody></table>";
                    }
                    else
                    {
                    }
                }
                else
                {
                    List<GetUserTimerDetailsByRowId_Result> trialList_1 = new List<GetUserTimerDetailsByRowId_Result>();
                    trialList_1 = db.GetUserTimerDetailsByRowId(LoggedInUser.FirmId, LoggedInUser.UserId, 1, 1, 1).ToList();
                    if (trialList_1 != null)
                    {
                        foreach (GetUserTimerDetailsByRowId_Result idata in trialList_1)
                        {
                            strtemplate += "<tr><td height = '20' align = 'left' valign ='top' style='padding:0 5px;' >" + idata.rownum + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + idata.mattername + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;' > " + (String.IsNullOrEmpty(idata.client) ? idata.client : QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(idata.client))) + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + String.Format("{0:dd MMM yyyy}", idata.date_time) + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.callDura + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + (String.IsNullOrEmpty(idata.billedby) ? idata.billedby : QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(idata.billedby))) + "  </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + (String.IsNullOrEmpty(idata.createdby) ? idata.createdby : QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(idata.createdby))) + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.titem + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.hrrate + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.total + " </td>";
                            strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.tdetails + " </td></tr>";
                        }
                        strtemplate += "</tbody></table>";
                    }
                    else
                    {
                    }
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
                Response.Redirect("/home/Error");
            }
        }
        /// <summary>
        /// Export activity list in excel
        /// </summary>
        [AuthLog(Roles = "User")]
        public void ExportoExcelActivityList()
        {
            try
            {
                var pagetype = QueryAES.UrlDecode(Request.QueryString["pagetype"]);
                var search = QueryAES.UrlDecode(Request.QueryString["search"]);
                string exlfilename = "ActivityList_" + DateTime.Now;
                var db = new LawPracticeEntities();
                List<GetAllUserActivityDetailsbyrowid_Result> trialList_1 = new List<GetAllUserActivityDetailsbyrowid_Result>();
                if (LoggedInUser.RoleId == 2)
                {
                    trialList_1 = db.GetAllUserActivityDetailsbyrowid(LoggedInUser.FirmId, LoggedInUser.UserId, 1, 1, 1, search, pagetype).ToList();
                    StringBuilder sb = new StringBuilder();
                    foreach (var data in trialList_1.ToList())
                    {
                        sb.Clear();
                        GetAllUserActivityDetailsbyrowid_Result newItem = new GetAllUserActivityDetailsbyrowid_Result();

                        if (!string.IsNullOrEmpty(data.assignuserto))
                        {
                            string[] words = data.assignuserto.ToString().Split(',');
                            foreach (string word in words)
                            {
                                string tempuser = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(word.ToString()));
                                sb.Append(tempuser);
                                sb.Append(",");
                            }
                            newItem.assignuserto = sb.ToString().TrimEnd(',');
                            trialList_1[trialList_1.IndexOf(data)].assignuserto = newItem.assignuserto;
                        }

                        if (!string.IsNullOrEmpty(data.assignuserby))
                        {
                            newItem.assignuserby = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.assignuserby.ToString()));
                            trialList_1[trialList_1.IndexOf(data)].assignuserby = newItem.assignuserby;
                        }

                    }
                }
                else
                {
                    // trialList_1 = db.GetContactDetailsByRowId(LoggedInUser.FirmId, LoggedInUser.UserId, 1, 1, 1).ToList();
                }
                var actionmode = "";
                var recentlabel = "";
                GetAllUserActivityDetailsbyrowid_Result Item = new GetAllUserActivityDetailsbyrowid_Result();
                int count = trialList_1.Count;

                var trialList = (from ob in trialList_1
                                 select new
                                 {
                                     SlNo = ob.rownum,
                                     ActivityName = ob.subject,
                                     Status = ob.status,
                                     Date = String.Format("{0:dd MMM yyyy}", ob.date_time) + " " + String.Format("{0:HH:mm:ss}", ob.date_time),
                                     AssignTo = ob.assignuserto,
                                     AssignBy = ob.assignuserby,
                                     ActivityType = ob.TempField

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
        /// Export user activity list in pdf
        /// </summary>
        [AuthLog(Roles = "User")]
        public void ExportoPdfActivityList()
        {
            try
            {
                var pagetype = QueryAES.UrlDecode(Request.QueryString["pagetype"]);
                var search = QueryAES.UrlDecode(Request.QueryString["search"]);
                string filename = "ActivityList.pdf";
                string firmid = LoggedInUser.FirmId.ToString();
                string userid = LoggedInUser.UserId.ToString();
                var db = new LawPracticeEntities();
                List<GetAllUserActivityDetailsbyrowid_Result> trialList_1 = new List<GetAllUserActivityDetailsbyrowid_Result>();
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
                strtemplate += "<center><p><strong>Mykase-Activity List</strong><span style='float:right'>Date: " + String.Format("{0:dd MMM yyyy}", DateTime.Now) + "</span></p></hr>";
                strtemplate += " <p></p>";
                strtemplate += " <table id='table1' border='1' cellspacing='0' cellpadding='6' align='center' style='table-layout:auto;'>";
                strtemplate += "  <thead><tr> ";
                strtemplate += "<th height='20'  width='5%' align='left' valign='top' style='padding:0 5px;'>Sl. No.</th>";
                strtemplate += "<th height='20'  width='10%' align='left' valign='top' style='padding:0 5px;'>Activity Name</th>";
                strtemplate += "<th height='20'  width='10%' align='left' valign='top' style='padding:0 5px;'>Status</th>";
                strtemplate += "<th height='20'  width='10%' align='left' valign='top' style='padding:0 5px;'>Date</th>";
                strtemplate += "<th height='20'  width='10%' align='left' valign='top' style='padding:0 5px;'>AssignTo</th>";
                strtemplate += "<th height='20'  width='10%' align='left' valign='top' style='padding:0 5px;'>AssignBy</th>";
                strtemplate += "<th height='20'  width='10%' align='left' valign='top' style='padding:0 5px;'>Activity Type</th>";
                strtemplate += "</tr></thead><tbody>";
                trialList_1 = db.GetAllUserActivityDetailsbyrowid(LoggedInUser.FirmId, LoggedInUser.UserId, 1, 1, 1, search, pagetype).ToList();
                StringBuilder sb = new StringBuilder();
                foreach (var data in trialList_1.ToList())
                {
                    sb.Clear();
                    GetAllUserActivityDetailsbyrowid_Result newItem = new GetAllUserActivityDetailsbyrowid_Result();

                    if (!string.IsNullOrEmpty(data.assignuserto))
                    {
                        string[] words = data.assignuserto.ToString().Split(',');
                        foreach (string word in words)
                        {
                            string tempuser = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(word.ToString()));
                            sb.Append(tempuser);
                            sb.Append(",");
                        }
                        newItem.assignuserto = sb.ToString().TrimEnd(',');
                        trialList_1[trialList_1.IndexOf(data)].assignuserto = newItem.assignuserto;
                    }

                    if (!string.IsNullOrEmpty(data.assignuserby))
                    {
                        newItem.assignuserby = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.assignuserby.ToString()));
                        trialList_1[trialList_1.IndexOf(data)].assignuserby = newItem.assignuserby;
                    }

                }
                if (trialList_1 != null)
                {
                    foreach (GetAllUserActivityDetailsbyrowid_Result idata in trialList_1)
                    {

                        strtemplate += "<tr><td height = '20' align = 'left' valign ='top'  style='padding:0 5px;' >" + idata.rownum + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'  style='padding:0 5px;' > " + idata.subject + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top' style='padding:0 5px;' > " + idata.status + " </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + String.Format("{0:dd MMM yyyy}", idata.date_time) + "  </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + idata.assignuserto + "  </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'  style='padding:0 5px;'> " + idata.assignuserby + "  </td>";
                        strtemplate += "<td height = '20' align = 'left' valign ='top'   style='padding:0 5px;'> " + (idata.TempField.ToString() == "cactivity" ? "Custom Activity" : idata.TempField) + " </td></tr>";
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
                Response.Redirect("/home/Error");
            }
        }
    }
}