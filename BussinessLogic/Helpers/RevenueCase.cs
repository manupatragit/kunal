using DataAccess.Modals;
using LawPractice.Models;
using LawPracticeFirm.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Configuration;
using static LawPractice.Models.AuditData;
namespace BussinessLogic
{
    public class RevenueCase
    {
        public static string APIAccessToken = "mykase123456789abcdef";
        public static string apiUrl = WebConfigurationManager.AppSettings["savetocasewatchurl"];
        public static string matteridname = WebConfigurationManager.AppSettings["matteridname"];
        /// <summary>
        /// Service log
        /// </summary>
        /// <param name="content"></param>
        private static void LogService(string content)
        {
            var templogpath = HttpContext.Current.Server.MapPath("//");
            FileStream fs = new FileStream(templogpath + "//MyKasecaseLog.txt", FileMode.OpenOrCreate, FileAccess.Write);
            StreamWriter sw = new StreamWriter(fs);
            sw.BaseStream.Seek(0, SeekOrigin.End);
            sw.WriteLine(content);
            sw.Flush();
            sw.Close();
        }
        /// <summary>
        /// Fill file revenue court
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public static string FillRevenueVCourt(string firmid, string userid)
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var addfClient1 = new WebClient();
                object rawfile1 = new
                {
                    Accesstoken = APIAccessToken,
                    Userid = userid,
                };
                addfClient1.Encoding = System.Text.Encoding.UTF8;
                addfClient1.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders1 = JsonConvert.SerializeObject(rawfile1);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid1 = addfClient1.UploadString(new Uri(apiUrl + "/API/Search/FillRevenueVCourt"), "POST", builders1);
                var param = apiUrl + "BusinessLogic/RevenueCase=>FillRevenueVCourt=>" + apiUrl + " /API/Search/FillRevenueVCourt" + "@" + builders1;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
                return resid1;
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return "Error";
            }
        }
        /// <summary>
        /// Fill mandal details
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="court"></param>
        /// <returns></returns>
        public static string FillMandal(string firmid, string userid, string court)
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var addfClient1 = new WebClient();
                object rawfile1 = new
                {
                    Accesstoken = APIAccessToken,
                    Userid = userid,
                    revvCourt = court,
                };
                addfClient1.Encoding = System.Text.Encoding.UTF8;
                addfClient1.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders1 = JsonConvert.SerializeObject(rawfile1);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid1 = addfClient1.UploadString(new Uri(apiUrl + "/API/Search/FillMandal"), "POST", builders1);
                var param = apiUrl + "BusinessLogic/RevenueCase=>FillMandal=>" + apiUrl + " /API/Search/FillMandal" + "@" + builders1;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
                return resid1;
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return "Error";
            }
        }
        /// <summary>
        /// Fill janpad by mandal
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="mandalvalue"></param>
        /// <returns></returns>
        public static string FillJanpadByMandal(string firmid, string userid, string mandalvalue)
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var addfClient1 = new WebClient();
                object rawfile1 = new
                {
                    Accesstoken = APIAccessToken,
                    Userid = userid,
                    mandalval = mandalvalue,
                };
                addfClient1.Encoding = System.Text.Encoding.UTF8;
                addfClient1.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders1 = JsonConvert.SerializeObject(rawfile1);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid1 = addfClient1.UploadString(new Uri(apiUrl + "/API/Search/FillJanpadByMandal"), "POST", builders1);
                var param = apiUrl + "BusinessLogic/RevenueCase=>FillJanpadByMandal=>" + apiUrl + " /API/Search/FillJanpadByMandal" + "@" + builders1;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
                return resid1;
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return "Error";
            }
        }
        /// <summary>
        /// Fill tehsil by janpad
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="janpadvalue"></param>
        /// <returns></returns>
        public static string FillTahsilByJanpad(string firmid, string userid, string janpadvalue)
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var addfClient1 = new WebClient();
                object rawfile1 = new
                {
                    Accesstoken = APIAccessToken,
                    Userid = userid,
                    janpadval = janpadvalue,
                };
                addfClient1.Encoding = System.Text.Encoding.UTF8;
                addfClient1.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders1 = JsonConvert.SerializeObject(rawfile1);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid1 = addfClient1.UploadString(new Uri(apiUrl + "/API/Search/FillTahsilByJanpad"), "POST", builders1);
                var param = apiUrl + "BusinessLogic/RevenueCase=>FillTahsilByJanpad=>" + apiUrl + " /API/Search/FillTahsilByJanpad" + "@" + builders1;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
                return resid1;
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return "Error";
            }
        }
        /// <summary>
        /// Fill revenue court by tehsil
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="tahsilvalue"></param>
        /// <returns></returns>
        public static string FillRevenueCourtByTahsil(string firmid, string userid, string tahsilvalue)
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var addfClient1 = new WebClient();
                object rawfile1 = new
                {
                    Accesstoken = APIAccessToken,
                    Userid = userid,
                    tahsilval = tahsilvalue,
                };
                addfClient1.Encoding = System.Text.Encoding.UTF8;
                addfClient1.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders1 = JsonConvert.SerializeObject(rawfile1);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid1 = addfClient1.UploadString(new Uri(apiUrl + "/API/Search/FillRevenueCourtByTahsil"), "POST", builders1);
                var param = apiUrl + "BusinessLogic/RevenueCase=>FillRevenueCourtByTahsil=>" + apiUrl + " /API/Search/FillRevenueCourtByTahsil" + "@" + builders1;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
                return resid1;
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return "Error";
            }
        }
        /// <summary>
        /// Add revenue court
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="useremail"></param>
        /// <param name="usermobile"></param>
        /// <param name="username"></param>
        /// <param name="CasetypeValue"></param>
        /// <param name="CasenoValue"></param>
        /// <param name="CaseyearValue"></param>
        /// <param name="vCourtValue"></param>
        /// <param name="mandalValue"></param>
        /// <param name="janpadValue"></param>
        /// <param name="tahsilValue"></param>
        /// <param name="revenueCourt"></param>
        /// <param name="RefNo"></param>
        /// <returns></returns>
        public static string AddRevenueCase(string firmid, string userid, string useremail, string usermobile, string username, string CasetypeValue, string CasenoValue, string CaseyearValue, string vCourtValue, string mandalValue, string janpadValue, string tahsilValue, string revenueCourt, string RefNo)
        {
            var db1 = new LawPracticeEntities();
            try
            {
                string ds = "";
                dynamic aff1 = 0;
                dynamic aff = 0;
                var vdisplayname = "";
                var countryname = "";
                var statename = "";
                var startdate = "";
                var enddate = "";
                var db = new LawPracticeEntities();
                var getuserdetails = db.usp_GetUserDetailByUserID(firmid, userid).FirstOrDefault();
                if (getuserdetails != null)
                {
                    vdisplayname = getuserdetails.Name;
                    countryname = getuserdetails.country;
                    statename = getuserdetails.cstate;
                }
                var firmdates = db.usp_wf_GetFirmDetailByID(Guid.Parse(firmid)).FirstOrDefault();
                if (firmdates != null)
                {
                    startdate = Convert.ToDateTime(firmdates.SubscriptionStartDate).Month.ToString("D2") + "/" + Convert.ToDateTime(firmdates.SubscriptionStartDate).Day.ToString("D2") + "/" + Convert.ToDateTime(firmdates.SubscriptionStartDate).Year.ToString();
                    enddate = Convert.ToDateTime(firmdates.ExpiryDate).Month.ToString("D2") + "/" + Convert.ToDateTime(firmdates.ExpiryDate).Day.ToString("D2") + "/" + Convert.ToDateTime(firmdates.ExpiryDate).Year.ToString();
                }
                //add login data
                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = "mykase123456789abcdef",
                    Email = useremail,
                    Memberuserid = username,
                    Password = "MykaSe_PasSsword",
                    Mobile = usermobile,
                    Dispname = vdisplayname,
                    Countryname = countryname,
                    StateName = statename,
                    Subscriptionstart = startdate,
                    Subscriptionend = enddate,
                    Courttype = "6",
                    Userid = matteridname + userid,
                    Casetype = CasetypeValue,
                    Caseno = CasenoValue,
                    Caseyear = CaseyearValue,
                    vCourtval = vCourtValue,
                    mandalval = mandalValue,
                    janpadval = janpadValue,
                    tahsilval = tahsilValue,
                    revenueCourtValue = revenueCourt,
                    cRefNo = RefNo
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AddMykaseCasesToCasewatch"), "POST", builders);
                try
                {
                    //var db1 = new LawPracticeEntities();
                    var param = apiUrl + "AddCaseCaseWatch=>InsertCaseDetailNew=>/API/Search/AddMykaseCasesToCasewatch" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
                }
                catch
                { }
                dynamic data = JObject.Parse(resid);
                string status = data.Status;
                string Message = data.Message;
                // string dataval = data.data;
                if (status == "True")
                {
                    //insert login into mykase
                    var insertusermap = db.sp_AddUserNeWCashwatch(firmid, userid, username);
                    ds = resid;
                    return ds;
                }
                else
                {
                    ds = "false";
                    return ds;
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return "Error";
            }
        }
        /// <summary>
        /// Get my revenue cases
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="revvCourtValue"></param>
        /// <param name="UserCaseIdValue"></param>
        /// <param name="StatusValue"></param>
        /// <param name="mandalvalue"></param>
        /// <param name="janpadvalue"></param>
        /// <param name="tahsilvalue"></param>
        /// <param name="revenueCourtValues"></param>
        /// <param name="Searchtextvalue"></param>
        /// <param name="Datefromvalue"></param>
        /// <param name="Datetovalue"></param>
        /// <param name="istypevalue"></param>
        /// <param name="Pagesizevalue"></param>
        /// <param name="pageindexvalue"></param>
        /// <param name="sortvalue"></param>
        /// <param name="IsCWuser"></param>
        /// <param name="CWUserId"></param>
        /// <returns></returns>
        public static string MyRevenueCases(string firmid, string userid, string revvCourtValue, string UserCaseIdValue,
            string StatusValue, string mandalvalue, string janpadvalue, string tahsilvalue, string revenueCourtValues,
            string Searchtextvalue, string Datefromvalue, string Datetovalue, string istypevalue, string Pagesizevalue,
            string pageindexvalue, string sortvalue, int IsCWuser, string CWUserId)
        {
            var db1 = new LawPracticeEntities();
            string AccessTokenDetail = string.Empty;
            string userIdDetail = string.Empty;
            string IsCaseWatchUser = IsCWuser.ToString();
            if (IsCaseWatchUser == "1")
            {
                userIdDetail = CWUserId.ToString();
                AccessTokenDetail = "internal";
            }
            else
            {
                AccessTokenDetail = "mykase123456789abcdef";
                userIdDetail = userid;
            }
            try
            {
                var addfClient1 = new WebClient();
                object rawfile1 = new
                {
                    Accesstoken = AccessTokenDetail,
                    Userid = userIdDetail,
                    revvCourt = revvCourtValue,
                    Flag = 0,
                    UserCaseId = UserCaseIdValue,
                    Status = StatusValue,
                    mandalval = mandalvalue,
                    janpadval = janpadvalue,
                    tahsilval = tahsilvalue,
                    revenueCourtValue = revenueCourtValues,
                    Searchtext = Searchtextvalue,
                    Datefrom = Datefromvalue,
                    Dateto = Datetovalue,
                    istype = istypevalue,
                    Pagesize = Pagesizevalue,
                    Pageindex = pageindexvalue,
                    sort = sortvalue,
                };
                addfClient1.Encoding = System.Text.Encoding.UTF8;
                addfClient1.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders1 = JsonConvert.SerializeObject(rawfile1);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid1 = addfClient1.UploadString(new Uri(apiUrl + "/API/Search/MyRevenueCases"), "POST", builders1);
                var param = apiUrl + "BusinessLogic/RevenueCase=>MyRevenueCases=>" + apiUrl + " /API/Search/MyRevenueCases" + "@" + builders1;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
                return resid1;
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return "Error";
            }
        }
        /// <summary>
        /// Get my revenue case details
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="UserCaseIdValue"></param>
        /// <param name="Pagesizevalue"></param>
        /// <param name="pageindexvalue"></param>
        /// <param name="sortvalue"></param>
        /// <returns></returns>
        public static string MyRevenueCaseDetails(string firmid, string userid, string UserCaseIdValue, string Pagesizevalue, string pageindexvalue, string sortvalue)
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var addfClient1 = new WebClient();
                object rawfile1 = new
                {
                    Accesstoken = APIAccessToken,
                    Userid = userid,
                    UserCaseId = UserCaseIdValue,
                    Pagesize = Pagesizevalue,
                    Pageindex = pageindexvalue,
                    sort = sortvalue,
                };
                addfClient1.Encoding = System.Text.Encoding.UTF8;
                addfClient1.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders1 = JsonConvert.SerializeObject(rawfile1);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid1 = addfClient1.UploadString(new Uri(apiUrl + "/API/Search/MyRevenueCaseDetails"), "POST", builders1);
                var param = apiUrl + "BusinessLogic/RevenueCase=>MyRevenueCaseDetails=>" + apiUrl + " /API/Search/MyRevenueCaseDetails" + "@" + builders1;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
                return resid1;
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return "Error";
            }
        }
        /// <summary>
        /// Show revenue case order by id
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="UserCaseIdValue"></param>
        /// <returns></returns>
        public static string ShowRevenueCaseOrdersById(string firmid, string userid, string UserCaseIdValue, int IsCasewtachuser, string UserName)
        {
            var db1 = new LawPracticeEntities();
            try
            {
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                //  string IsCaseWatchUser = Session["IsCaseWatchUser"].ToString();
                if (IsCasewtachuser == 1)
                {
                    userIdDetail = UserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = userid;
                }

                var addfClient1 = new WebClient();
                object rawfile1 = new
                {
                    Accesstoken = AccessTokenDetail,
                    Userid = userIdDetail,
                    UserCaseId = UserCaseIdValue
                };
                addfClient1.Encoding = System.Text.Encoding.UTF8;
                addfClient1.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders1 = JsonConvert.SerializeObject(rawfile1);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid1 = addfClient1.UploadString(new Uri(apiUrl + "/API/Search/ShowRevenueCaseOrdersById"), "POST", builders1);
                var param = apiUrl + "BusinessLogic/RevenueCase=>ShowRevenueCaseOrdersById=>" + apiUrl + " /API/Search/ShowRevenueCaseOrdersById" + "@" + builders1;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
                return resid1;
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return "Error";
            }
        }
        /// <summary>
        /// Add revenue case
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="useremail"></param>
        /// <param name="usermobile"></param>
        /// <param name="username"></param>
        /// <param name="CasetypeValue"></param>
        /// <param name="CasenoValue"></param>
        /// <param name="CaseyearValue"></param>
        /// <param name="vCourtValue"></param>
        /// <param name="mandalValue"></param>
        /// <param name="janpadValue"></param>
        /// <param name="tahsilValue"></param>
        /// <param name="revenueCourt"></param>
        /// <param name="RefNo"></param>
        /// <param name="caseid"></param>
        /// <returns></returns>
        public static string AddRevenueCase_1(string firmid, string userid, string useremail, string usermobile,
            string username, string CasetypeValue, string CasenoValue, string CaseyearValue,
            string vCourtValue, string mandalValue, string janpadValue, string tahsilValue,
            string revenueCourt, string RefNo, string caseid, int IsCWUser, string CWUserId)
        {
            var db1 = new LawPracticeEntities();
            try
            {
                string ds = "";
                dynamic aff1 = 0;
                dynamic aff = 0;
                var vdisplayname = "";
                var countryname = "";
                var statename = "";
                var startdate = "";
                var enddate = "";
                var db = new LawPracticeEntities();
                var firmadminuserid = "";
                var firmadminusername = "";
                var getuserdetails = db.usp_GetUserDetailByUserID(firmid, userid).FirstOrDefault();
                if (getuserdetails != null)
                {
                    vdisplayname = getuserdetails.Name;
                    countryname = getuserdetails.country;
                    statename = getuserdetails.cstate;
                    firmadminuserid = getuserdetails.FirmAdminuserId;
                    firmadminusername = getuserdetails.FirmAdminUserName.ToString();
                }
                var firmdates = db.usp_wf_GetFirmDetailByID(Guid.Parse(firmid)).FirstOrDefault();
                if (firmdates != null)
                {
                    startdate = Convert.ToDateTime(firmdates.SubscriptionStartDate).Month.ToString("D2") + "/" + Convert.ToDateTime(firmdates.SubscriptionStartDate).Day.ToString("D2") + "/" + Convert.ToDateTime(firmdates.SubscriptionStartDate).Year.ToString();
                    enddate = Convert.ToDateTime(firmdates.ExpiryDate).Month.ToString("D2") + "/" + Convert.ToDateTime(firmdates.ExpiryDate).Day.ToString("D2") + "/" + Convert.ToDateTime(firmdates.ExpiryDate).Year.ToString();
                }
                string AccessTokenDetail = string.Empty;
                string userIdDetail = string.Empty;
                string FirmuserIdDetail = string.Empty;
                string IsCaseWatchUser = IsCWUser.ToString();
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = CWUserId.ToString();
                    FirmuserIdDetail = firmadminusername.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    if (getuserdetails.IsAdminCW == 1)
                    {
                        userIdDetail = username;
                        FirmuserIdDetail = firmadminusername;
                        AccessTokenDetail = "internal";
                    }
                    else
                    {
                        AccessTokenDetail = "mykase123456789abcdef";
                        userIdDetail = username;
                        FirmuserIdDetail = matteridname + firmadminuserid;
                    }

                }
                //add login data
                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    Email = useremail,
                    Memberuserid = userIdDetail,
                    Password = "MykaSe_PasSsword",
                    Mobile = usermobile,
                    Dispname = vdisplayname,
                    Countryname = countryname,
                    StateName = statename,
                    Subscriptionstart = startdate,
                    Subscriptionend = enddate,
                    Courttype = "6",
                    Userid = FirmuserIdDetail,
                    Casetype = CasetypeValue,
                    Caseno = CasenoValue,
                    Caseyear = CaseyearValue,
                    vCourtval = vCourtValue,
                    mandalval = mandalValue,
                    janpadval = janpadValue,
                    tahsilval = tahsilValue,
                    revenueCourtValue = revenueCourt,
                    cRefNo = RefNo
                };
                addfClient.Encoding = Encoding.UTF8;
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json; charset=utf-8");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AddMykaseCasesToCasewatch"), "POST", builders);
                try
                {
                    //var db1 = new LawPracticeEntities();
                    var param = apiUrl + "AddCaseCaseWatch=>InsertCaseDetailNew=>/API/Search/AddMykaseCasesToCasewatch" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
                }
                catch
                { }
                dynamic data = JObject.Parse(resid);
                string status = data.Status;
                string Message = data.Message;
                // string dataval = data.data;
                if (status == "True")
                {
                    //insert login into mykase
                    var insertusermap = db.sp_AddUserNeWCashwatch(firmid, userid, username);
                    ds = resid;
                    //------------------------for provisions to auto assigned------------------------//
                    try
                    {
                        string dbstatus = "";
                        dynamic data2 = JObject.Parse(ds);
                        dbstatus = data2.usercaseid;
                        // string newcaseid = data2.caseid;
                        List<usp_UserlistbycaseIdForAlerts_Result> list = new List<usp_UserlistbycaseIdForAlerts_Result>();
                        list = db.usp_UserlistbycaseIdForAlerts(firmid, userid, caseid).ToList();
                        if (list != null)
                        {
                            string auserid = string.Join(",", list.Select(x => x.auser));
                            SaveCaseAlertUserRevenue_1(auserid, userid, firmid, apiUrl, dbstatus);
                        }
                    }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
                    catch (Exception ex) { }
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
                    //------------------------End---------------------------------------------------//
                    return ds;
                }
                else
                {
                    ds = resid;
                    return ds;
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return "Error";
            }
        }
        /// <summary>
        /// Save revenue case alert user
        /// </summary>
        /// <param name="auserid"></param>
        /// <param name="userid"></param>
        /// <param name="userfirmid"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <param name="cwcaseid"></param>
        /// <returns></returns>
        public static string SaveCaseAlertUserRevenue_1(string auserid, string userid, string userfirmid, string savetocasewatchurl, string cwcaseid)
        {
            var db = new LawPracticeEntities();
            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            string[] values = auserid.Split(',');
            var vdisplayname = "";
            string status2 = "";
            var countryname = "";
            var statename = "";
            List<CaseUserMapDetailList> casemaplist = new List<CaseUserMapDetailList>();
            var apiUrl = savetocasewatchurl;
            for (int i = 0; i < values.Length; i++)
            {
                values[i] = values[i].Trim();
                //map to nyaksetable
                var insertusermap = db.sp_AddUserNeWCashwatch(userfirmid, values[i], matteridname + values[i]);
                //casewatchuser
                var getuseremailmobile = db.usp_GetUserDetailByUserID(userfirmid, values[i]).FirstOrDefault();
                if (getuseremailmobile != null)
                {
                    vdisplayname = getuseremailmobile.Name;
                    countryname = getuseremailmobile.country;
                    statename = getuseremailmobile.cstate;
                }
                dynamic aff1 = 0;
                dynamic aff = 0;
                casemaplist.Add(new CaseUserMapDetailList
                {
                    Dispname = vdisplayname,
                    Email = getuseremailmobile.EmailId,
                    Mobile = getuseremailmobile.cmobile,
                    Password = "MykaSe_PasSsword",
                    Memberuserid = matteridname + values[i],
                    Countryname = countryname,
                    StateName = statename,
                    Subscriptionstart = "",
                    Subscriptionend = "",
                    LoggedInEmail = "",
                    Userid = matteridname + userid,
                });
            }
            //add login data
            var addfClient2 = new WebClient();
            object rawfile2 = new
            {
                accesstoken = "mykase123456789abcdef",
                usercaseid = cwcaseid,
                ClientMember = casemaplist
            };
            try
            {
                addfClient2.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders2 = JsonConvert.SerializeObject(rawfile2);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid2 = addfClient2.UploadString(new Uri(apiUrl + "/API/Search/MapReveneueCasetoUserList"), "POST", builders2);
                dynamic data2 = JObject.Parse(resid2);
                status2 = data2.Status;
                string Message2 = data2.Message;
                var db1 = new LawPracticeEntities();
                var param = apiUrl + "AddCaseCaseWatch=>SaveCaseAlertUser=>/API/Search/MapReveneueCasetoUserList" + "@" + builders2;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (Exception ex) { }
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            return status2;
        }

        /// <summary>
        /// Get janpad by revenue court
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="vCourtval"></param>
        /// <returns></returns>
        public static string FillJanpadByRevenueCourt(string firmid, string userid, string vCourtval)
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var addfClient1 = new WebClient();
                object rawfile1 = new
                {
                    Accesstoken = APIAccessToken,
                    Userid = userid,
                    vCourtval = vCourtval,
                };
                addfClient1.Encoding = System.Text.Encoding.UTF8;
                addfClient1.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders1 = JsonConvert.SerializeObject(rawfile1);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid1 = addfClient1.UploadString(new Uri(apiUrl + "/API/Search/FillJanpadByRevenueCourt"), "POST", builders1);
                var param = apiUrl + "BusinessLogic/RevenueCase=>FillJanpadByRevenueCourt=>" + apiUrl + " /API/Search/FillJanpadByRevenueCourt" + "@" + builders1;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
                return resid1;
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return "Error";
            }
        }
        /// <summary>
        /// Get Tahsil by revenue court
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="vCourtval"></param>
        /// <returns></returns>
        public static string FillTahsilByRevenueCourt(string firmid, string userid, string vCourtval)
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var addfClient1 = new WebClient();
                object rawfile1 = new
                {
                    Accesstoken = APIAccessToken,
                    Userid = userid,
                    vCourtval = vCourtval,
                };
                addfClient1.Encoding = System.Text.Encoding.UTF8;
                addfClient1.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders1 = JsonConvert.SerializeObject(rawfile1);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid1 = addfClient1.UploadString(new Uri(apiUrl + "/API/Search/FillTahsilByRevenueCourt"), "POST", builders1);
                var param = apiUrl + "BusinessLogic/RevenueCase=>FillTahsilByRevenueCourt=>" + apiUrl + " /API/Search/FillTahsilByRevenueCourt" + "@" + builders1;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
                return resid1;
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return "Error";
            }
        }
        /// <summary>
        /// Get revenue court by tahsil and janpad
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="vCourtval"></param>
        /// <param name="janpadval"></param>
        /// <param name="tahsilval"></param>
        /// <returns></returns>
        public static string FillRevenueCourtByTahsilAndJanpad(string firmid, string userid, string vCourtval, string janpadval, string tahsilval)
        {
            var db1 = new LawPracticeEntities();
            try
            {
                var addfClient1 = new WebClient();
                object rawfile1 = new
                {
                    Accesstoken = APIAccessToken,
                    Userid = userid,
                    vCourtval = vCourtval,
                    janpadval = janpadval,
                    tahsilval = tahsilval
                };
                addfClient1.Encoding = System.Text.Encoding.UTF8;
                addfClient1.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders1 = JsonConvert.SerializeObject(rawfile1);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid1 = addfClient1.UploadString(new Uri(apiUrl + "/API/Search/FillRevenueCourtByTahsilAndJanpad"), "POST", builders1);
                var param = apiUrl + "BusinessLogic/RevenueCase=>FillRevenueCourtByTahsilAndJanpad=>" + apiUrl + " /API/Search/FillRevenueCourtByTahsilAndJanpad" + "@" + builders1;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
                return resid1;
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                return "Error";
            }
        }
    }
}
