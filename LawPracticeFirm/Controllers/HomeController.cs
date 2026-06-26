using BussinessLogic.BusinessEntity;
using BussinessLogic.Common;
using DataAccess.Modals;
using LawPracticeFirm.Common;
using LawPracticeFirm.DAL;
using LawPracticeFirm.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;
using System.Web.UI.WebControls;
using static LawPracticeFirm.Models.AuditData;

namespace LawPracticeFirm.Controllers
{
    public class HomeController : BaseFirmController
    {
        /// <summary>
        /// Help view
        /// </summary>
        /// <returns></returns>
        public ActionResult Help_A()
        {
            return View();
        }
        /// <summary>
        /// Help view
        /// </summary>
        /// <returns></returns>
        [Route("Help")]
        public ActionResult Help()
        {
            return View();
        }
        /// <summary>
        /// FAQ view
        /// </summary>
        /// <returns></returns>
        [Route("faq")]
        public ActionResult Faq()
        {
            return View();
        }
        /// <summary>
        /// Log service
        /// </summary>
        /// <param name="content"></param>
        private static void LogService22(string content)
        {
            var templogpath = System.Web.HttpContext.Current.Server.MapPath("//");
            FileStream fs = new FileStream(templogpath + "//Mytest.txt", FileMode.OpenOrCreate, FileAccess.Write);
            StreamWriter sw = new StreamWriter(fs);
            sw.BaseStream.Seek(0, SeekOrigin.End);
            sw.WriteLine(content);
            sw.Flush();
            sw.Close();
        }
        /// <summary>
        /// Log service error
        /// </summary>
        /// <param name="content"></param>
        private static void LogService22er(string content)
        {
            var templogpath = System.Web.HttpContext.Current.Server.MapPath("//");
            FileStream fs = new FileStream(templogpath + "//Mytester.txt", FileMode.OpenOrCreate, FileAccess.Write);
            StreamWriter sw = new StreamWriter(fs);
            sw.BaseStream.Seek(0, SeekOrigin.End);
            sw.WriteLine(content);
            sw.Flush();
            sw.Close();
        }
        /// <summary>
        /// Client document management
        /// </summary>
        /// <returns></returns>
        [Route("article-client-document-management-storage-lawpracticemanagement")]
        public ActionResult clientdocumentmanagement()
        {
            return View();
        }
        /// <summary>
        /// Corporate legal department
        /// </summary>
        /// <returns></returns>
        [Route("corporate-legal-department-request-intake-matter-management")]
        public ActionResult corporatelegaldepartment()
        {
            return View();
        }
        /// <summary>
        /// Knowledge Management blog
        /// </summary>
        /// <returns></returns>
        [Route("article-client-knowledge-management-lawpracticemanagement")]
        public ActionResult KnowledgeManagementblog()
        {
            return View();
        }
        /// <summary>
        /// client collaboration
        /// </summary>
        /// <returns></returns>
        [Route("article-client-portal-collaboration-lawpracticemanagement")]
        public ActionResult clientcollaboration()
        {
            return View();
        }
        /// <summary>
        /// Mykase video law firm technology
        /// </summary>
        /// <returns></returns>
        [Route("article-blog-law-legal-practice-management-operations-agile")]
        public ActionResult mykasevideolawfirmtechnology()
        {
            return View();
        }
        /// <summary>
        /// Mykase video law firm
        /// </summary>
        /// <returns></returns>
        [Route("article-mykase-mykasevideo-law-firm-management")]
        public ActionResult mykasevideolawfirm()
        {
            return View();
        }
        /// <summary>
        /// Cloud migration view
        /// </summary>
        /// <returns></returns>
        [Route("article-cloud-migration-law-firm-management")]
        public ActionResult CloudMigration()
        {
            return View();
        }
        /// <summary>
        /// Legal view
        /// </summary>
        /// <returns></returns>
        [Route("article-lawyer-Legal-technology-competence")]
        public ActionResult Legal()
        {
            return View();
        }
        /// <summary>
        /// Enterprise view
        /// </summary>
        /// <returns></returns>
        [Route("article-Enterprise-mobility-cloud-law-firm-management")]
        public ActionResult Enterprise()
        {
            return View();
        }
        /// <summary>
        /// Disclaimer view
        /// </summary>
        /// <returns></returns>
        public ActionResult Disclaimer()
        {
            return View();
        }
        /// <summary>
        /// CopyRight view
        /// </summary>
        /// <returns></returns>
        public ActionResult CopyRight()
        {
            return View();
        }
        /// <summary>
        /// Client Portal
        /// </summary>
        /// <returns></returns>
        [Route("law-legal-practice-client-management")]
        public ActionResult ClientPortal()
        {
            return Redirect("https://mykase.in/law-legal-practice-client-management");
            // return View();
        }
        /// <summary>
        /// Document Management
        /// </summary>
        /// <returns></returns>
        [Route("document-management-solution-software-legal-practice")]
        public ActionResult DocumentManagement()
        {
            return Redirect("https://www.mykase.in/document-management-solution-software-legal-practice");
            // return View();
        }
        /// <summary>
        /// Invoice
        /// </summary>
        /// <returns></returns>
        [Route("law-legal-practice-Invoice-management")]
        public ActionResult Invoice()
        {
            return Redirect("https://www.mykase.in/law-legal-practice-Invoice-management");
        }
        /// <summary>
        /// Reports
        /// </summary>
        /// <returns></returns>
        [Route("law-legal-practice-data-reports-metrics")]
        public ActionResult Reports()
        {
            return Redirect("https://www.mykase.in/law-legal-practice-data-reports-metrics");
        }
        /// <summary>
        /// Search
        /// </summary>
        /// <returns></returns>
        [Route("law-legal-practice-management-Search")]
        public ActionResult Search()
        {
            return Redirect("https://www.mykase.in/law-legal-practice-management-Search");
        }
        /// <summary>
        /// Time entry
        /// </summary>
        /// <returns></returns>
        [Route("law-legal-practice-management--track-Time-Entry")]
        public ActionResult TimeEntry()
        {
            return Redirect("https://www.mykase.in/law-legal-practice-management--track-Time-Entry");
        }
        /// <summary>
        /// Security
        /// </summary>
        /// <returns></returns>
        [Route("law-legal-practice-cloud-saas-security")]
        public ActionResult Security()
        {
            return Redirect("https://www.mykase.in/law-legal-practice-cloud-saas-security");
        }
        /// <summary>
        /// Alerts
        /// </summary>
        /// <returns></returns>
        [Route("law-legal-practice-management-notifications-Alerts")]
        public ActionResult Alerts()
        {
            return Redirect("https://www.mykase.in/law-legal-practice-management-notifications-Alerts");
        }
        /// <summary>
        /// Calendar
        /// </summary>
        /// <returns></returns>
        [Route("law-legal-practice-management-due-date-Calendar")]
        public ActionResult Calendar()
        {
            return Redirect("https://www.mykase.in/law-legal-practice-management-due-date-Calendar");
            //  return View();
        }
        /// <summary>
        /// Conflict Check
        /// </summary>
        /// <returns></returns>
        [Route("law-legal-practice-management-client-Conflict-Check")]
        public ActionResult ConflictCheck()
        {
            return Redirect("https://www.mykase.in/law-legal-practice-management-client-Conflict-Check");
            // return View();
        }
        /// <summary>
        /// Contacts
        /// </summary>
        /// <returns></returns>
        [Route("law-legal-practice-Contact-client-management")]
        public ActionResult Contacts()
        {
            return Redirect("https://www.mykase.in/law-legal-practice-Contact-client-management");
            // return View();
        }
        /// <summary>
        /// Expense Management
        /// </summary>
        /// <returns></returns>
        [Route("law-legal-practice-Expense-Management")]
        public ActionResult ExpenseManagement()
        {
            return Redirect("https://www.mykase.in/law-legal-practice-Expense-Management");
            // return View();
        }
        /// <summary>
        /// Knowledge
        /// </summary>
        /// <returns></returns>
        [Route("law-practice-knowledge-management-software")]
        public ActionResult Knowledge()
        {
            return Redirect("https://mykase.in/law-practice-knowledge-management-software");
            // return View();
        }
        /// <summary>
        /// Mobile App
        /// </summary>
        /// <returns></returns>
        [Route("law-legal-practice-mobile-app")]
        public ActionResult MobileApp()
        {
            return Redirect("https://www.mykase.in/law-legal-practice-mobile-app");
            //return View();
        }
        /// <summary>
        /// Task
        /// </summary>
        /// <returns></returns>
        [Route("law-legal-operations-workflow-task-management")]
        public ActionResult Task()
        {
            return Redirect("https://www.mykase.in/law-legal-operations-workflow-task-management");
            //return View();
        }
        /// <summary>
        /// Communication
        /// </summary>
        /// <returns></returns>
        [Route("law-legal-practice-collaboration-communication")]
        public ActionResult Communication()
        {
            return Redirect("https://www.mykase.in/law-legal-practice-collaboration-communication");
            // return View();
        }
        /// <summary>
        /// Integration
        /// </summary>
        /// <returns></returns>
        [Route("law-legal-practice-integration")]
        public ActionResult Integration()
        {
            return Redirect("https://www.mykase.in/law-legal-practice-integration");
            // return View();
        }
        /// <summary>
        /// Matter management
        /// </summary>
        /// <returns></returns>
        [Route("legal-matter-management-system-software")]
        public ActionResult MatterManagement()
        {
            return Redirect("https://mykase.in/legal-matter-management-system-software");
            // return View();
        }

        /// <summary>
        /// Index
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            //decrptfile();
           
            string RedirectUrlwebsite = WebConfigurationManager.AppSettings["RedirectUrlwebsite"].ToString();
            //uncomment below line for production update 

          //return Redirect(RedirectUrlwebsite);

            ViewBag.datesf = DateTime.Now.ToString();
            return View();
        }
        /// <summary>
        /// Case Management
        /// </summary>
        /// <returns></returns>
        public ActionResult CaseManagement()
        {
            return View();
        }
        /// <summary>
        /// Client Relationship Management
        /// </summary>
        /// <returns></returns>
        public ActionResult ClientRelationshipManagement()
        {
            return View();
        }
        /// <summary>
        /// Communication Collaboration
        /// </summary>
        /// <returns></returns>
        public ActionResult CommunicationCollaboration()
        {
            return View();
        }
        /// <summary>
        /// Efficiency Enablers
        /// </summary>
        /// <returns></returns>
        public ActionResult EfficiencyEnablers()
        {
            return View();
        }
        /// <summary>
        /// Invoice Expense Management
        /// </summary>
        /// <returns></returns>
        public ActionResult InvoiceExpenseManagement()
        {
            return View();
        }
        /// <summary>
        /// Knowledge Management
        /// </summary>
        /// <returns></returns>
        public ActionResult KnowledgeManagement()
        {
            return View();
        }
        /// <summary>
        /// Work flow
        /// </summary>
        /// <returns></returns>
        public ActionResult Workflow()
        {
            return View();
        }
        /// <summary>
        /// Two Factor Authentication
        /// </summary>
        /// <returns></returns>
        public ActionResult TwoFactorAuthentication()
        {
            try
            {
                var db = new LawPracticeEntities();
                var TwoFactorfirmid = QueryStringEDAES.QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(Session["authsessionfirmid"].ToString()));
                var TwoFactoruserid = QueryStringEDAES.QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(Session["authsessionuserid"].ToString()));
                var TwoFactormobile = QueryStringEDAES.QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(Session["authsessionmobile"].ToString()));
                if (TwoFactorfirmid.ToString() == "" || TwoFactormobile.ToString() == "" || TwoFactoruserid.ToString() == "")
                {
                    return Redirect("/home/index");
                }
                ViewBag.mobile = "We have sent One Time Password (OTP) on your registered mobile ending with ********" + TwoFactormobile.ToString().Substring(TwoFactormobile.Length - 2); ;
            }
            catch (Exception er)
            {
                if (er.Message.ToString() == "Object reference not set to an instance of an object.")
                {
                    return Redirect("/home/index");
                }
            }
            return View();
        }
        /// <summary>
        /// Reset Password
        /// </summary>
        /// <returns></returns>
        public ActionResult ResetPassword()
        {
            return View();
        }
        /// <summary>
        /// create password
        /// </summary>
        /// <returns></returns>
        public ActionResult createpassword()
        {
            var token = QueryAES.UrlDecode(Request.QueryString["token"]);
            token = token.ToString().Replace(" ", "+");
            ViewBag.token = token;
            var reft = QueryAES.UrlDecode(Request.QueryString["ref"]);
            reft = reft.ToString().Replace(" ", "+");
            ViewBag.reft = reft;
            var reftid = QueryAES.UrlDecode(Request.QueryString["refid"]);
            reftid = reftid.ToString().Replace(" ", "+");
            ViewBag.reftid = reftid;
            return View();
        }
        /// <summary>
        /// Save contact us
        /// </summary>
        /// <returns></returns>
        public JsonResult SaveContactUs()
        {
            try
            {
                var db = new LawPracticeEntities();
                var name = QueryAES.UrlDecode(Request.Form["contactname"]);
                var email = QueryAES.UrlDecode(Request.Form["contactemail"]);
                var phone = QueryAES.UrlDecode(Request.Form["contactphone"]);
                var msg = QueryAES.UrlDecode(Request.Form["contactmsg"]);
                var firmcode = QueryAES.UrlDecode(Request.Form["firmcode"]);
                var data = db.Usp_SaveContactUs(name, email, msg, phone);
                try
                {
                    var Email = db.usp_GetAdminEmailbyFirmCode(firmcode).FirstOrDefault();
                    if (Email != null)
                    {
                        string fromemail = WebConfigurationManager.AppSettings["fromemail"].ToString();
                        string AssignmentSubmittedMailSubject = WebConfigurationManager.AppSettings["FirmContactUsSubject"].ToString();
                        string strbody = "";
                        strbody += "Please find the below details of your mykase homepage enquiry:<br><br>";
                        strbody += "Name : " + name + "<br>";
                        strbody += "Email ID : " + email + "<br>";
                        strbody += "Phone : " + phone + "<br>";
                        strbody += "Message : " + msg + "<br><br><br>";
                        strbody += "Date : " + DateTime.Now.ToShortDateString() + "<br>";
                        string AssignmentSubmittedMailBody1 = WebConfigurationManager.AppSettings["basicmailtemplate"].ToString();
                        AssignmentSubmittedMailBody1 = AssignmentSubmittedMailBody1.Replace("#CONTENT#", strbody);
                        try
                        {
                            CommomUtility obj1 = new CommomUtility();
                            obj1.SendEmail(fromemail, Email, "", AssignmentSubmittedMailSubject, AssignmentSubmittedMailBody1);
                        }
                        catch (Exception ex)
                        {
                        }
                    }
                }
                catch
                {
                }
                return Json("success", JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Send authorize OTP
        /// </summary>
        /// <returns></returns>
        public JsonResult AuthSendOTP()
        {
            try
            {
                Session["GenerateOTPValue"] = "";
                int otpValue = new Random().Next(100000, 999999);
                var status = "";
                string mobileotp = Session["authsessionmobile"].ToString();
                var db = new LawPracticeEntities();
                if (mobileotp.ToString() != "")
                {
                    var check = db.usp_GetTblRegOtps_api(mobileotp, 1).FirstOrDefault();
                    if (check != null)
                    {
                        int scussess = db.usp_UpdateTblRegOtps_api(check.Id.ToString(), otpValue.ToString(), DateTime.Now.ToString(), 0, 1);
                        string strURL = System.Configuration.ConfigurationManager.AppSettings["smsauthlink"];
                        strURL = strURL.Replace("#cmobile", mobileotp.ToString()).Replace("#otpvalue", otpValue.ToString());
                        String strResult;
                        WebResponse objResponse;
                        WebRequest objRequest = HttpWebRequest.Create(strURL);
                        objResponse = objRequest.GetResponse();
                        using (StreamReader sr = new StreamReader(objResponse.GetResponseStream()))
                        {
                            strResult = sr.ReadToEnd();
                            sr.Close();
                        }
                        Session["authsessionotp"] = Convert.ToBase64String(QueryAES.EncryptAes(otpValue.ToString()));
                        return Json("success", JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        int scussess = db.usp_AddTblRegOtps_api(mobileotp, otpValue.ToString(), DateTime.Now.ToString(), 0, 1);
                        string strURL = System.Configuration.ConfigurationManager.AppSettings["smsauthlink"];
                        strURL = strURL.Replace("#cmobile", mobileotp.ToString()).Replace("#otpvalue", otpValue.ToString());
                        String strResult;
                        WebResponse objResponse;
                        WebRequest objRequest = HttpWebRequest.Create(strURL);
                        objResponse = objRequest.GetResponse();
                        using (StreamReader sr = new StreamReader(objResponse.GetResponseStream()))
                        {
                            strResult = sr.ReadToEnd();
                            sr.Close();
                        }
                        Session["GenerateOTPValue"] = otpValue;
                        Session["authsessionotp"] = Convert.ToBase64String(QueryAES.EncryptAes(otpValue.ToString()));
                        return Json("success", JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    return Json(status, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                throw (e);
            }
        }
        /// <summary>
        /// Two factor OTP verification
        /// </summary>
        /// <returns></returns>
        public JsonResult TwoFactorVerifyOTP()
        {
            try
            {
                var db = new LawPracticeEntities();
                string status = "";
                string otpvalue = QueryAES.UrlDecodeWithOutInputInvalid(Request.Form["otpvalue"]);
                string mobile = Session["authsessionmobile"].ToString();
                string mobileotp = QueryStringEDAES.QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(Session["authsessionotp"].ToString()));
                if (otpvalue.ToString() != "" && mobile.ToString() != "" && mobileotp.ToString() != "")
                {
                    var check = db.usp_TwoFactorVerifyOTP_api(otpvalue, mobile, 1).FirstOrDefault();
                    if (check != null)
                    {
                        var sessionotp = check.otpvalue;
                        if (sessionotp.ToString() == otpvalue.ToString())
                        {
                            int updateactive = db.usp_UpdateTblRegOtp_api(check.Id.ToString(), 1);
                            var Areas = "";
                            //login after success
                            var authusernamenew = QueryStringEDAES.QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(Session["authsessionusername"].ToString()));
                            var authpassword = Session["authsessionpassword"].ToString();
                            var authusername = (String)authusernamenew;
                            var firmids = db.usp_GetFirmUsers_api(authusername, authpassword, null).FirstOrDefault();
                            if (firmids != null)
                            {
                                var firmcodes = db.usp_GetFirms_api(firmids.Firmid.ToString()).FirstOrDefault();
                                Areas = firmcodes.FirmCode;
                            }
                            var user = Repository.FirmUser.Login(authusername, authpassword, "", Areas);
                            Session["sessionpackmodule"] = user.Packmodule.ToString();
                            var pname = Convert.ToString(ConfigurationManager.AppSettings["PrimaryNameField"]);
                            user.Cases = Repository.Firm.GetSpecificFirmInputData(user.FirmId.ToString(), Convert.ToInt32(ModuleType.Case), pname, Convert.ToString(user.UserId));
                            user.Events = Repository.Firm.GetUserSpecificFirmInputData(user.FirmId.ToString(), Convert.ToInt32(ModuleType.Event), Convert.ToString(user.UserId));
                            user.Tasks = Repository.Firm.GetUserSpecificFirmInputData(user.FirmId.ToString(), Convert.ToInt32(ModuleType.Task), Convert.ToString(user.UserId));
                            new FormsAuthenticationService().SignIn(user.UserId.ToString(), false);
                            Session["sessionfirmid"] = user.FirmId;
                            Session["sessionuserid"] = user.UserId;
                            Session["sessionroleid"] = user.RoleId;
                            CreateSessionAuth(System.Web.HttpContext.Current, user);
                            var y = UrlHelper.GenerateContentUrl(@"~\" + user.DefaultController + @"\" + user.DefaultAction, new HttpContextWrapper(System.Web.HttpContext.Current));
                            try
                            {
                                db.usp_saveloginlog(user.FirmId.ToString(), authusername.ToString());
                            }
                            catch (Exception er)
                            {
                            }
                            return Json(Areas + y, JsonRequestBehavior.AllowGet);
                        }
                        else
                        {
                            return Json(false, JsonRequestBehavior.AllowGet);
                        }
                    }
                    return Json(false, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(false, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                throw (e);
            }
        }
        /// <summary>
        /// Create session authontication
        /// </summary>
        /// <param name="context"></param>
        /// <param name="user"></param>
        protected void CreateSessionAuth(HttpContext context, FirmEmployee user)
        {
            var browser = string.IsNullOrEmpty(context.Request.Headers["User-Agent"]) ? string.Empty : Convert.ToString(context.Request.Headers["User-Agent"]);
            context.Session.Set("User", new FirmUserSession { Browser = browser, FirmUserDetails = user, CreationTime = DateTime.Now });
        }
        [Route("legal-case-management-software")]
        public ActionResult About()
        {
            ViewBag.Message = "Your Company description page.";
            return Redirect("https://mykase.in/legal-case-management-software");
            //  return View();
        }
        /// <summary>
        /// Startup view
        /// </summary>
        /// <returns></returns>
        public ActionResult StartUp()
        {
            return View();
        }
        /// <summary>
        /// Terms and condition
        /// </summary>
        /// <returns></returns>
        public ActionResult TermsConditions()
        {
            ViewBag.Message = "Your Company description page.";
            return View();
        }
        /// <summary>
        /// Privacy
        /// </summary>
        /// <returns></returns>
        public ActionResult Privacy()
        {
            ViewBag.Message = "Your Company description page.";
            return View();
        }
        /// <summary>
        /// Signup view
        /// </summary>
        /// <returns></returns>
        public ActionResult SignUp()
        {
            ViewBag.Message = "Your Company description page.";
            return View();
        }
        /// <summary>
        /// Trial signup
        /// </summary>
        /// <returns></returns>
        public ActionResult SignUpTrial()
        {
            ViewBag.Message = "Your Company description page.";
            return View();
        }
        /// <summary>
        /// Page not found
        /// </summary>
        /// <returns></returns>
        public ActionResult NotFound()
        {
            ViewBag.Message = "Your Company description page.";
            return View();
        }
        /// <summary>
        /// Unauthorise Chat
        /// </summary>
        /// <returns></returns>
        public ActionResult UnauthoriseChat()
        {
            ViewBag.Message = "Your Company description page.";
            return View();
        }
        /// <summary>
        /// Unauthorise
        /// </summary>
        /// <returns></returns>
        public ActionResult Unauthorise()
        {
            ViewBag.Message = "Your Company description page.";
            return View();
        }
        /// <summary>
        /// Unauthorise Admin
        /// </summary>
        /// <returns></returns>
        public ActionResult UnauthoriseAdmin()
        {
            ViewBag.Message = "Your Company description page.";
            return View();
        }
        /// <summary>
        /// Custom Error
        /// </summary>
        /// <returns></returns>
        public ActionResult CustomError()
        {
            ViewBag.Message = "Your Company description page.";
            return View();
        }

        [HttpPost]
        public ActionResult About1(HttpPostedFileBase file)
        {
            return RedirectToAction("Index");
        }
        /// <summary>
        /// Company contact page
        /// </summary>
        /// <returns></returns>
        public ActionResult Contact()
        {
            ViewBag.Message = "Your Company contact page.";
            return View();
        }
        /// <summary>
        /// Articles
        /// </summary>
        /// <returns></returns>
        [Route("law-legal-tech-blog-articles")]
        public ActionResult Articles()
        {
            ViewBag.Message = "Your Company contact page.";
            return View();
        }
        /// <summary>
        /// Article
        /// </summary>
        /// <returns></returns>
        public ActionResult Article()
        {
            ViewBag.Message = "Your Company contact page.";
            return View();
        }
        /// <summary>
        /// Won
        /// </summary>
        /// <returns></returns>
        public ActionResult Won()
        {
            ViewBag.Message = "Your Company contact page.";
            return View();
        }
        /// <summary>
        /// Practice
        /// </summary>
        /// <returns></returns>
        public ActionResult Practice()
        {
            ViewBag.Message = "Your Company contact page.";
            return View();
        }
        /// <summary>
        /// Add Practice
        /// </summary>
        /// <returns></returns>
        public ActionResult AddPractice()
        {
            ViewBag.Message = "Your Company contact page.";
            return View();
        }
        /// <summary>
        /// Contact field
        /// </summary>
        /// <returns></returns>
        public ActionResult CField()
        {
            ViewBag.Message = "Your Company contact page.";
            return View();
        }
        [HttpPost]
        public ActionResult CField(string DynamicTextBox, string DynamicTextDate, string cities, AddContactsList ct)
        {
            LawPracticeEntities dc = new LawPracticeEntities();
            //Serialize the Array and assign to ViewBag.
            //JavaScriptSerializer serializer = new JavaScriptSerializer();
            //ViewBag.Values = serializer.Serialize(DynamicTextBox);
            // var cy = serializer.Serialize(DynamicTextDate);
            //Loop through the dynamic TextBox values.
            AddContactsList cd = new AddContactsList();
            cd.lname = DynamicTextBox;
            cd.fname = ct.fname;
            cd.homeno = DynamicTextDate;
            //cd.city = cities;
            dc.AddContactsLists.Add(cd);
            dc.SaveChanges();
            //Set the Message to be displayed later in View.
            ViewBag.Message = DynamicTextBox + " records saved.";
            return View();
        }
        /// <summary>
        /// News Article Content
        /// </summary>
        /// <returns></returns>
        public ActionResult NewsArticleContent()
        {
            string id = QueryAES.UrlDecode(Request.QueryString["id"]);
            string token = QueryAES.UrlDecode(Request.QueryString["token"]);
            string iid = id + token;
            string json = "";
            int res = -1;
            var jsonObject = new JObject();
            string strval = "<entry>";
            string result = null;
            string url = System.Configuration.ConfigurationManager.AppSettings["manupatranewandarticlelink"];
            System.Net.WebResponse response = null;
            System.IO.StreamReader reader = null;
            DataTable dt1 = new DataTable();
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "GET";
            response = request.GetResponse();
            reader = new StreamReader(response.GetResponseStream());
            result = reader.ReadToEnd();
            string text = "";
            string title = "";
            string subtitle = "";
            string strid = "";
            string update = "";
            string linktext = "";
            string mainlinktext = "";
            int count = 0;
            try
            {
                string stri = "";
                string linkcontent = "";
                string updatecontent = "";
                string summarycontent = "";
                string titlecontent = "";
                string idcontent = "";
                string dateid = "";
                int pos = result.IndexOf("<entry>", 0);
                int poscount = result.IndexOf("<entry>", 0);
                dt1.Columns.Add("title", typeof(string));
                dt1.Columns.Add("link", typeof(string));
                dt1.Columns.Add("updated", typeof(string));
                dt1.Columns.Add("summary", typeof(string));
                dt1.Columns.Add("id", typeof(string));
                dt1.Columns.Add("serialno", typeof(int));
                while (pos != -1)
                {
                    count = count + 1;
                    stri = "";
                    int epos = result.IndexOf("</entry>", pos);
                    if (epos != -1)
                    {
                        text = result.Substring(pos, epos - pos);
                    }
                    int linkpos = text.IndexOf("<link ", 0);
                    if (linkpos != -1)
                    {
                        int elinkpos = text.IndexOf("/>", linkpos);
                        if (elinkpos != -1)
                        {
                            linktext = text.Substring(linkpos + "<link ".Length, elinkpos - linkpos - "<link ".Length);
                            int pdfpos = linktext.IndexOf(".pdf", 0);
                            if (linktext != "") //pdfpos != -1)
                            {
                                string linktext1 = "";
                                int downpos = linktext.IndexOf("href=\"", 0);
                                if (downpos != -1)
                                {
                                    int edownpos = linktext.IndexOf("\"", downpos + "href=\"".Length);
                                    if (edownpos != -1)
                                    {
                                        linktext1 = linktext.Substring(downpos + "href=\"".Length, edownpos - downpos - "href=\"".Length);
                                        if (linktext1 != "https://www.manupatra.com/")
                                        {
                                            mainlinktext = "<link>" + linktext1 + "</link>";
                                            linkcontent = linktext1;
                                        }
                                        else
                                        {
                                            linkcontent = "";
                                            mainlinktext = "<link></link>";
                                        }
                                    }
                                }
                            }
                            else
                            {
                                linktext = "";
                                mainlinktext = "";
                                linkcontent = "";
                            }
                        }
                    }
                    int titpos = text.IndexOf("<title>", 0);
                    if (titpos != -1)
                    {
                        int etitpos = text.IndexOf("</title>", titpos);
                        if (etitpos != -1)
                        {
                            title = text.Substring(titpos + "<title>".Length, etitpos - titpos - "<title>".Length);
                            if (mainlinktext == "")
                            {
                                stri = stri + " " + title;
                                titlecontent = "";
                            }
                            else
                            {
                                stri = stri + " <title>" + title + "</title> " + mainlinktext;
                                titlecontent = title;
                            }
                        }
                    }
                    int utitpos = text.IndexOf("<updated>", 0);
                    if (utitpos != -1)
                    {
                        int eutitpos = text.IndexOf("</updated>", utitpos);
                        if (eutitpos != -1)
                        {
                            update = text.Substring(utitpos + "<updated>".Length, eutitpos - utitpos - "<updated>".Length);
                            stri = stri + "<updated>" + update.Replace("GMT", "IST") + "</updated>";
                            updatecontent = update.Replace("GMT", "IST");
                            string s1 = updatecontent;
                            dateid = DateTime.ParseExact(s1, "ddd, dd MMM yyyy HH:mm:ss 'IST'", CultureInfo.InvariantCulture).ToString("yyyyMMddHHmmss");
                        }
                    }
                    int stitpos = text.IndexOf("<summary>", 0);
                    if (stitpos != -1)
                    {
                        int estitpos = text.IndexOf("</summary>", stitpos);
                        if (estitpos != -1)
                        {
                            subtitle = text.Substring(stitpos + "<summary>".Length, estitpos - stitpos - "<summary>".Length);
                            stri = stri + "<summary>" + subtitle + "</summary>";
                            summarycontent = subtitle;
                        }
                    }
                    int idspos = text.IndexOf("<id>", 0);
                    if (idspos != -1)
                    {
                        int eidpos = text.IndexOf("</id>", idspos);
                        if (eidpos != -1)
                        {
                            strid = text.Substring(idspos + "<id>".Length, eidpos - idspos - "<id>".Length);
                            idcontent = strid;
                        }
                    }
                    if (iid.ToString() == dateid.ToString())
                    {
                        dt1.Rows.Add(titlecontent, linkcontent, updatecontent, summarycontent, idcontent, count);
                        ViewBag.title = titlecontent;
                        ViewBag.url = HttpContext.Request.Url.AbsoluteUri.ToString().Replace("amp;", "");
                        ViewBag.baseimagepath = HttpContext.Request.Url.Authority;
                        break;
                    }
                    pos = result.IndexOf("<entry>", pos + 8);
                }
            }
            catch (Exception ex)
            {
            }
            return View();
        }
        /// <summary>
        /// vcard
        /// </summary>
        /// <returns></returns>
        public ActionResult vcard()
        {
            return View();
        }
        /// <summary>
        /// Discover
        /// </summary>
        /// <returns></returns>
        public ActionResult discover()
        {
            return View();
        }
        /// <summary>
        /// Free trial
        /// </summary>
        /// <returns></returns>
        public ActionResult freetrial()
        {
            return View();
        }
        /// <summary>
        /// Check server
        /// </summary>
        /// <returns></returns>
        public ActionResult checkserver()
        {
            try
            {
                var db = new LawPracticeEntities();
                var data = db.Roles.FirstOrDefault();
                ViewBag.data = data.RoleName;
            }
            catch (Exception ex)
            {
                ViewBag.data = ex.Message;
            }
            return View();
        }
        /// <summary>
        /// MyKase Enquiry
        /// </summary>
        /// <returns></returns>
        public ActionResult MyKaseEnquiry()
        {
            var Source = QueryAES.UrlDecode(Request.QueryString["Source"]);
            ViewBag.Source = Source;
            return View();
        }
        /// <summary>
        /// Schedule demo
        /// </summary>
        /// <returns></returns>
        [Route("schedule-demo")]
        public ActionResult scheduledemo()
        {
            var Source = QueryAES.UrlDecode(Request.QueryString["Source"]);
            ViewBag.Source = Source;
            return View();
        }
        /// <summary>
        /// Request demo
        /// </summary>
        /// <returns></returns>
        [Route("request-demo")]
        public ActionResult requestdemo()
        {
            var Source = QueryAES.UrlDecode(Request.QueryString["Source"]);
            ViewBag.Source = Source;
            return View();
        }
        /// <summary>
        /// Solution
        /// </summary>
        /// <returns></returns>
        [Route("law-practice-software-pricing-plan-Solution")]
        public ActionResult Solution()
        {
            return View();
        }
        /// <summary>
        /// Mykase thank you enquiry
        /// </summary>
        /// <returns></returns>
        public ActionResult MyKaseEnquiryThankyou()
        {
            return View();
        }
        /// <summary>
        /// Bind city
        /// </summary>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        public JsonResult BindCity()
        {
            var db = new LawPracticeEntities();
            List<City> cityDetail = new List<City>();
            cityDetail = db.Cities.OrderBy(x => x.CityName).ToList();
            return Json(cityDetail, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Reg URL
        /// </summary>
        /// <returns></returns>
        public ActionResult RegURL()
        {
            return View();
        }
        /// <summary>
        /// Login MK
        /// </summary>
        /// <returns></returns>
        public ActionResult Loginmk()
        {
            return View();
        }
        /// <summary>
        /// Article law firm
        /// </summary>
        /// <returns></returns>
        [Route("article-law-firm-practice-management-platform")]
        public ActionResult articlelawfirm()
        {
            return View();
        }
        /// <summary>
        /// Cloud computing articles
        /// </summary>
        /// <returns></returns>
        [Route("article-cloud-computing-law-practice-management-platform")]
        public ActionResult articlecloudcomputing()
        {
            return View();
        }
        /// <summary>
        /// Common login page
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public ActionResult CommonloginPage(string type)
        {
            var db = new LawPracticeEntities();
            try
            {
                if (type != "" && type != null && type != "null")
                {
                    type = QueryAES.UrlDecodeWithOutInputInvalid(type);
                    string[] tokens = type.Split(',');
                    var Username = tokens[0];
                    var Password = tokens[1];
                    var Timestap = tokens[2];
                    ViewBag.UserName = Username;
                    ViewBag.Password = Password;
                    ViewBag.TimeStamp = Timestap;
                }
                else
                {
                    ViewBag.UserName = "";
                    ViewBag.Password = "";
                    ViewBag.TimeStamp = "";
                }
                ViewBag.datesf = DateTime.Now.ToString();
            }
            catch (Exception ex)
            {
                db.usp_AddAuditError(Convert.ToInt32(EventType.CustomField), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.CustomField), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
           
            return View();
        }
        /// <summary>
        /// Reset common password
        /// </summary>
        /// <param name="em"></param>
        /// <param name="fu"></param>
        /// <param name="td"></param>
        /// <returns></returns>
        public ActionResult ResetPasswordCommon(string em, string fu, string td)
        {
            var db = new LawPracticeEntities();
            try
            {
                var remail = QueryAES.UrlDecodeWithOutInputInvalid(em);
                var forgetuserid = QueryAES.UrlDecodeWithOutInputInvalid(fu);
                var Timestampdd = QueryAES.UrlDecodeWithOutInputInvalid(td);
                LogService22("befireLoginTimestamp" + Timestampdd);
                var forgetuseridss = HttpUtility.UrlDecode(forgetuserid).Replace(" ", "+");
                var decryptedforgetuserid = DecryptStringAESSSO(forgetuseridss);
                forgetuserid = forgetuserid.Replace(" ", "+");
                remail = remail.Replace(" ", "+");
                Timestampdd = Timestampdd.Replace(" ", "+");
                LogService22("LoginTimestamp" + Timestampdd);
                var LoginTimestamp = QueryAES.DecryptStringAESSSO(Timestampdd);
                LogService22("LoginTimestamp1" + LoginTimestamp);
                var currentdatetime = DateTime.Now.AddMinutes(-1);
                var receiveddatetime = Convert.ToDateTime(LoginTimestamp);
                var getResetMailTime = DataAccessADO.getResetMailTime(decryptedforgetuserid);

                if (!string.IsNullOrEmpty(getResetMailTime.ToString()) && getResetMailTime.ToString() != "0")
                {
                    DateTime resetMailTime = Convert.ToDateTime(getResetMailTime);
                    DateTime currentTime = DateTime.Now;

                    double minutesDifference = (currentTime - resetMailTime).TotalMinutes;
                    if (minutesDifference > 2)
                    {
                        if (currentdatetime <= receiveddatetime)
                        {
                            remail = QueryAES.DecryptStringAESSSO(remail);
                            forgetuserid = QueryAES.DecryptStringAESSSO(forgetuserid);
                            ViewBag.result = "";
                            var checkemail = db.usp_CheckEmailPasswordReset(remail.ToString(), forgetuserid.ToString()).FirstOrDefault();
                            if (checkemail != null)
                            {
                                CommomUtility objmail = new CommomUtility();
                                string strsubject = "", strbody = "";
                                string resetlink = "https://" + Request.Url.Host + "/home/createpassword?status=true&token=" + Convert.ToBase64String(QueryAES.EncryptAes(checkemail.EmailId)) + "&ref=" + Convert.ToBase64String(QueryAES.EncryptAes(DateTime.Now.ToString())) + "&refid=" + Convert.ToBase64String(QueryAES.EncryptAes(checkemail.UserName.ToString()));
                                var insertTokenInDB = DataAccessADO.usp_InsertPasswordResetToken(resetlink, forgetuserid.ToString());
                                string AssignmentSubmittedMailSubject = WebConfigurationManager.AppSettings["forgetPasswordSubject"].ToString();
                                string bottomlinkref = WebConfigurationManager.AppSettings["bottomlinkref"].ToString();
                                string resetlinkhrf = "<a style = 'color:#0000ff; font-weight:bold;' href='" + resetlink.ToString() + "'>Here</a>";
                                // string AssignmentSubmittedMailBody = WebConfigurationManager.AppSettings["ForgotPasswordBody"].ToString();
                                string AssignmentSubmittedMailBody = WebConfigurationManager.AppSettings["ResetPasswordLinkForCommon"].ToString();
                                AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#USERNAME#", checkemail.UserName.ToString());
                                AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#Here#", resetlinkhrf);
                                // AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#LINKREF#", bottomlinkref);
                                objmail.SendEmail("contact@mykase.in", remail, "", AssignmentSubmittedMailSubject, AssignmentSubmittedMailBody);
                                ViewBag.result = "A link to reset the password with instruction has been sent on your registered email, please check and follow the instruction.";
                                return View();
                            }
                            else
                            {
                                ViewBag.result = "UserId/Email is not registered with us. Please enter valid UserId/email";
                                return View();
                            }
                        }
                        else
                        {
                            ViewBag.result = "unauthorised access.";
                            return View();
                        }
                    }
                    else
                    {
                        ViewBag.result = "Please try after 2 minutes";
                        return View();
                    }
                }
                else
                {
                    if (currentdatetime <= receiveddatetime)
                    {
                        remail = QueryAES.DecryptStringAESSSO(remail);
                        forgetuserid = QueryAES.DecryptStringAESSSO(forgetuserid);
                        ViewBag.result = "";
                        var checkemail = db.usp_CheckEmailPasswordReset(remail.ToString(), forgetuserid.ToString()).FirstOrDefault();
                        if (checkemail != null)
                        {
                            CommomUtility objmail = new CommomUtility();
                            string strsubject = "", strbody = "";
                            string resetlink = "https://" + Request.Url.Host + "/home/createpassword?status=true&token=" + Convert.ToBase64String(QueryAES.EncryptAes(checkemail.EmailId)) + "&ref=" + Convert.ToBase64String(QueryAES.EncryptAes(DateTime.Now.ToString())) + "&refid=" + Convert.ToBase64String(QueryAES.EncryptAes(checkemail.UserName.ToString()));
                            var insertTokenInDB = DataAccessADO.usp_InsertPasswordResetToken(resetlink, forgetuserid.ToString());
                            string AssignmentSubmittedMailSubject = WebConfigurationManager.AppSettings["forgetPasswordSubject"].ToString();
                            string bottomlinkref = WebConfigurationManager.AppSettings["bottomlinkref"].ToString();
                            string resetlinkhrf = "<a style = 'color:#0000ff; font-weight:bold;' href='" + resetlink.ToString() + "'>Here</a>";
                            // string AssignmentSubmittedMailBody = WebConfigurationManager.AppSettings["ForgotPasswordBody"].ToString();
                            string AssignmentSubmittedMailBody = WebConfigurationManager.AppSettings["ResetPasswordLinkForCommon"].ToString();
                            AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#USERNAME#", checkemail.UserName.ToString());
                            AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#Here#", resetlinkhrf);
                            // AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#LINKREF#", bottomlinkref);
                            objmail.SendEmail("contact@mykase.in", remail, "", AssignmentSubmittedMailSubject, AssignmentSubmittedMailBody);
                            ViewBag.result = "A link to reset the password with instruction has been sent on your registered email, please check and follow the instruction.";
                            return View();
                        }
                        else
                        {
                            ViewBag.result = "UserId/Email is not registered with us. Please enter valid UserId/email";
                            return View();
                        }
                    }
                    else
                    {
                        ViewBag.result = "unauthorised access.";
                        return View();
                    }
                }

                return View();
            }
            catch (Exception ex)
            {
                ViewBag.result = ex.Message.ToString();
                db.usp_AddAuditError(Convert.ToInt32(EventType.CustomField), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.CustomField), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return View();
            }
        }
        [Route("CauseListAlerts")]
        public ActionResult CauseListAlerts()
        {
            return View();
        }
        //23 apr 24        
        public string GetMykaseCauselistDetailsByCode(string code = "")
        {
            var db1 = new LawPracticeEntities();
            string casedeatils = "";
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string strusername = ConfigurationManager.AppSettings["matteridname"];
                string userId = "mykase", firmId = "";
                //userId = strusername + LoggedInUser.UserId.ToString();
                //firmId = LoggedInUser.FirmId.ToString();
                //var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                //string vcode = "";
                //code = Convert.ToString(QueryAES.UrlDecode(Request.Form["vcode"]));
                // "mykase123456789abcdef",
                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = "mykase123456789abcdef",
                    UserId = userId,
                    vcode = code
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                addfClient.Encoding = Encoding.UTF8;
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MykaseCauselistDetailsByCode"), "POST", builders);

                //var param = apiUrl + "CWController=>GetMykaseCauselistDetailsByCode=>/API/Search/MykaseCauselistDetailsByCode" + "@" + builders;
                // db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(Session["sessionuserid"].ToString()), param, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 0, "");

                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                casedeatils = Convert.ToString(data1);
                return casedeatils;
            }
            catch (Exception ex)
            {
                //db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                //return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
            return casedeatils;
        }
        public ActionResult Error()
        {
            return View();
        }

        public static string DecryptStringAESSSO(string data)
        {
            var keybytes = Encoding.UTF8.GetBytes("8125468236514789");
            var iv = Encoding.UTF8.GetBytes("8125468236514789");

            //c# encrrption
            //var encryptStringToBytes = EncryptStringToBytes("It works", keybytes, iv);

            //// Decrypt the bytes to a string.
            //var roundtrip = DecryptStringFromBytes(encryptStringToBytes, keybytes, iv);

            //DECRYPT FROM CRIPTOJS




            var encrypted = Convert.FromBase64String(data);
            var decriptedFromJavascript = DecryptStringFromBytes(encrypted, keybytes, iv);
            return string.Format(

                decriptedFromJavascript);
        }
        private static string DecryptStringFromBytes(byte[] cipherText, byte[] key, byte[] iv)
        {
            // Check arguments.
            if (cipherText == null || cipherText.Length <= 0)
            {
                throw new ArgumentNullException("cipherText");
            }
            if (key == null || key.Length <= 0)
            {
                throw new ArgumentNullException("key");
            }
            if (iv == null || iv.Length <= 0)
            {
                throw new ArgumentNullException("key");
            }

            // Declare the string used to hold
            // the decrypted text.
            string plaintext = null;

            // Create an RijndaelManaged object
            // with the specified key and IV.
            using (var rijAlg = new RijndaelManaged())
            {
                //Settings
                rijAlg.Mode = CipherMode.CBC;
                rijAlg.Padding = PaddingMode.PKCS7;
                rijAlg.FeedbackSize = 128;

                rijAlg.Key = key;
                rijAlg.IV = iv;

                // Create a decrytor to perform the stream transform.
                var decryptor = rijAlg.CreateDecryptor(rijAlg.Key, rijAlg.IV);

                // Create the streams used for decryption.
                using (var msDecrypt = new MemoryStream(cipherText))
                {
                    using (var csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (var srDecrypt = new StreamReader(csDecrypt))
                        {
                            // Read the decrypted bytes from the decrypting stream
                            // and place them in a string.
                            plaintext = srDecrypt.ReadToEnd();
                        }
                    }
                }
            }

            return plaintext;
        }
    }
}