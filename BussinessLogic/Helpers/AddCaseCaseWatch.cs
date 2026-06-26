using DataAccess.Modals;
using LawPracticeFirm.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.NetworkInformation;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Configuration;
using static LawPractice.Models.AuditData;

namespace NJDGDetail.Models
{
    public class AddCaseCaseWatch
    {
        /// <summary>
        /// Get MAC address
        /// </summary>
        /// <returns></returns>        
        /// 
        public static string GetMacAddress()
        {
            NetworkInterface[] nics = NetworkInterface.GetAllNetworkInterfaces();
            String sMacAddress = string.Empty;
            foreach (NetworkInterface adapter in nics)
            {
                if (sMacAddress == String.Empty)// only return MAC Address from first card  
                {
                    IPInterfaceProperties properties = adapter.GetIPProperties();
                    sMacAddress = adapter.GetPhysicalAddress().ToString();
                }
            }
            return sMacAddress;
          
        }
        /// <summary>
        /// Get my IP
        /// </summary>
        /// <returns></returns>        
        /// 
        public static string myIP()
        {
            string ipAdd = HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];

            if (string.IsNullOrEmpty(ipAdd))
            {
                ipAdd = HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
            }
            else
            {

            }
            return ipAdd;
        }

        /// <summary>
        /// Log service
        /// </summary>
        /// <param name="content"></param>        
        /// 
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
        /// Enable disable casewatch user
        /// </summary>
        /// <param name="userfirmid"></param>
        /// <param name="auserid"></param>
        /// <param name="status"></param>
        /// <returns></returns>        
        /// 
        public static bool EnableDisableUserToCW(string userfirmid, string auserid, int status, DateTime? ExpiryDate)
        {
            var result = false;
            //update on CW
            var apiUrl = WebConfigurationManager.AppSettings["savetocasewatchurl"];
            var addfClient1 = new WebClient();
            object rawfile1 = new
            {
                Accesstoken = "mykase123456789abcdef",
                userid = WebConfigurationManager.AppSettings["matteridname"] + auserid,
                Flag = status,
                ExpireDate = ExpiryDate

            };

            addfClient1.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders1 = JsonConvert.SerializeObject(rawfile1);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid1 = addfClient1.UploadString(new Uri(apiUrl + "/API/Search/UpdateUserApproval"), "POST", builders1);
            try
            {
                var db1 = new LawPracticeEntities();
                var param = apiUrl + "AddCaseCaseWatch=>EnableDisableUserToCW=>/API/Search/UpdateUserApproval" + "@" + builders1;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");


            }
            catch
            {

            }
            dynamic data = JObject.Parse(resid1);
            string statusResult = data.Status;
            string Message = data.Message;
            string dataval = data.data;

            try
            {
                var db1 = new LawPracticeEntities();
                var param = apiUrl + "/API/Search/UpdateUserApproval" + "@" + userfirmid + "@" + auserid + "@" + status;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");


            }
            catch
            {

            }
            return result;
        }
        /// <summary>
        /// Insert CNR district
        /// </summary>
        /// <param name="userfirmid"></param>
        /// <param name="userid"></param>
        /// <param name="caseid"></param>
        /// <param name="Cnrno"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <param name="useremail"></param>
        /// <param name="usermobile"></param>
        /// <param name="Username"></param>
        /// <returns></returns>        
        /// 
        public static string InsertDistrictCNR(string userfirmid, string userid, string caseid, string Cnrno, string savetocasewatchurl, string useremail, string usermobile, string Username)
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

            var getuserdetails = db.usp_GetUserDetailByUserID(userfirmid, userid).FirstOrDefault();
            if (getuserdetails != null)
            {
                vdisplayname = getuserdetails.Name;
                countryname = getuserdetails.country;
                statename = getuserdetails.cstate;
            }

            var firmdates = db.usp_wf_GetFirmDetailByID(Guid.Parse(userfirmid)).FirstOrDefault();
            if (firmdates != null)
            {
                startdate = Convert.ToDateTime(firmdates.SubscriptionStartDate).Month.ToString("D2") + "/" + Convert.ToDateTime(firmdates.SubscriptionStartDate).Day.ToString("D2") + "/" + Convert.ToDateTime(firmdates.SubscriptionStartDate).Year.ToString();
                enddate = Convert.ToDateTime(firmdates.ExpiryDate).Month.ToString("D2") + "/" + Convert.ToDateTime(firmdates.ExpiryDate).Day.ToString("D2") + "/" + Convert.ToDateTime(firmdates.ExpiryDate).Year.ToString();

            }
            var apiUrl = savetocasewatchurl;
            //add login data


            var addfClient = new WebClient();
            object rawfile = new
            {
                Accesstoken = "mykase123456789abcdef",
                Email = useremail,
                Memberuserid = Username,
                Password = "MykaSe_PasSsword",
                Mobile = usermobile,
                Dispname = vdisplayname,
                Countryname = countryname,
                StateName = statename,
                Subscriptionstart = startdate,
                Subscriptionend = enddate
            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AddUserMyKase"), "POST", builders);

            try
            {
                var db1 = new LawPracticeEntities();
                var param = apiUrl + "AddCaseCaseWatch=>InsertDistrictCNR=>/API/Search/AddUserMyKase" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");


            }
            catch
            {

            }

            dynamic data = JObject.Parse(resid);
            string status = data.Status;
            string Message = data.Message;
            string dataval = data.data;


            if (status == "True")
            {

                //add login data
                var addfClient1 = new WebClient();
                object rawfile1 = new
                {
                    accesstoken = "mykase123456789abcdef",
                    userid = WebConfigurationManager.AppSettings["matteridname"] + userid,
                    cnrno = Cnrno.Trim(),


                };
                addfClient1.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders1 = JsonConvert.SerializeObject(rawfile1);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid1 = addfClient1.UploadString(new Uri(apiUrl + "/API/Search/AddMyKaseCNRCase"), "POST", builders1);
                try
                {
                    var db1 = new LawPracticeEntities();
                    var param = apiUrl + "AddCaseCaseWatch=>InsertDistrictCNR=>/API/Search/AddMyKaseCNRCase" + "@" + builders1;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");


                }
                catch
                {

                }
                ds = resid1;
                return ds;
            }
            else
            {
                ds = "false";
                return ds;
            }
        }

        /// <summary>
        /// Insert Case Detail New Append Court
        /// </summary>
        /// <param name="addcaseobj"></param>
        /// <param name="iflag"></param>
        /// <param name="useremail"></param>
        /// <param name="usermobile"></param>
        /// <param name="userfirmid"></param>
        /// <param name="userid"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <returns></returns>        
        /// 
        public static string InsertCaseDetailNewAppendCourt(AddCaseObject1 addcaseobj, int iflag, string useremail, string usermobile, string userfirmid, string userid, string savetocasewatchurl)
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

            var getuserdetails = db.usp_GetUserDetailByUserID(userfirmid, userid).FirstOrDefault();
            if (getuserdetails != null)
            {
                vdisplayname = getuserdetails.Name;
                countryname = getuserdetails.country;
                statename = getuserdetails.cstate;
            }

            var firmdates = db.usp_wf_GetFirmDetailByID(Guid.Parse(userfirmid)).FirstOrDefault();
            if (firmdates != null)
            {
                startdate = Convert.ToDateTime(firmdates.SubscriptionStartDate).Month.ToString("D2") + "/" + Convert.ToDateTime(firmdates.SubscriptionStartDate).Day.ToString("D2") + "/" + Convert.ToDateTime(firmdates.SubscriptionStartDate).Year.ToString();
                enddate = Convert.ToDateTime(firmdates.ExpiryDate).Month.ToString("D2") + "/" + Convert.ToDateTime(firmdates.ExpiryDate).Day.ToString("D2") + "/" + Convert.ToDateTime(firmdates.ExpiryDate).Year.ToString();

            }
            var apiUrl = savetocasewatchurl;
            //add login data


            var addfClient = new WebClient();
            object rawfile = new
            {
                Accesstoken = "mykase123456789abcdef",
                Email = useremail,
                Memberuserid = addcaseobj.Username,
                Password = "MykaSe_PasSsword",
                Mobile = usermobile,
                Dispname = vdisplayname,
                Countryname = countryname,
                StateName = statename,
                Subscriptionstart = startdate,
                Subscriptionend = enddate
            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AddUserMyKase"), "POST", builders);

            try
            {
                var db1 = new LawPracticeEntities();
                var param = apiUrl + "AddCaseCaseWatch=>InsertCaseDetailNewAppendCourt=>/API/Search/AddUserMyKase" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");


            }
            catch
            {

            }


            dynamic data = JObject.Parse(resid);
            string status = data.Status;
            string Message = data.Message;
            string dataval = data.data;


            if (status == "True")
            {
                //insert login into mykase
                var insertusermap = db.sp_AddUserNeWCashwatch(userfirmid, userid, addcaseobj.Username);

                // add case in casewatch
                var addfClient1 = new WebClient();
                object rawfile1 = new
                {
                    Accesstoken = "mykase123456789abcdef",
                    userid = addcaseobj.Username,
                    courttype = "5",
                    Caseno = addcaseobj.Caseno.Trim(),
                    Caseyear = addcaseobj.Caseyear,
                    Court = addcaseobj.Court,
                    casename = addcaseobj.Casename,
                    mhearingdate = addcaseobj.Nexthearingdate,
                    madvocatename = addcaseobj.Advocate,
                    mstatus = addcaseobj.Status,
                };


                addfClient1.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders1 = JsonConvert.SerializeObject(rawfile1);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid1 = addfClient1.UploadString(new Uri(apiUrl + "/API/Search/AddCaseTypeMykase"), "POST", builders1);
                try
                {
                    var db1 = new LawPracticeEntities();
                    var param = apiUrl + "AddCaseCaseWatch=>InsertCaseDetailNewAppendCourt=>/API/Search/AddCaseTypeMykase" + "@" + builders1;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");


                }
                catch
                {

                }
                ds = resid1;
                return ds;
            }
            else
            {
                ds = "false";
                return ds;
            }




        }

        /// <summary>
        /// Insert new case detail
        /// </summary>
        /// <param name="addcaseobj"></param>
        /// <param name="iflag"></param>
        /// <param name="useremail"></param>
        /// <param name="usermobile"></param>
        /// <param name="userfirmid"></param>
        /// <param name="userid"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <returns></returns>        
        /// 
        public static string InsertCaseDetailNew(AddCaseObject1 addcaseobj, int iflag, string useremail, string usermobile, string userfirmid, string userid, string savetocasewatchurl)
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

            var getuserdetails = db.usp_GetUserDetailByUserID(userfirmid, userid).FirstOrDefault();
            if (getuserdetails != null)
            {
                vdisplayname = getuserdetails.Name;
                countryname = getuserdetails.country;
                statename = getuserdetails.cstate;
            }

            var firmdates = db.usp_wf_GetFirmDetailByID(Guid.Parse(userfirmid)).FirstOrDefault();
            if (firmdates != null)
            {
                startdate = Convert.ToDateTime(firmdates.SubscriptionStartDate).Month.ToString("D2") + "/" + Convert.ToDateTime(firmdates.SubscriptionStartDate).Day.ToString("D2") + "/" + Convert.ToDateTime(firmdates.SubscriptionStartDate).Year.ToString();
                enddate = Convert.ToDateTime(firmdates.ExpiryDate).Month.ToString("D2") + "/" + Convert.ToDateTime(firmdates.ExpiryDate).Day.ToString("D2") + "/" + Convert.ToDateTime(firmdates.ExpiryDate).Year.ToString();

            }
            var apiUrl = savetocasewatchurl;
            //add login data


            var addfClient = new WebClient();
            object rawfile = new
            {
                Accesstoken = "mykase123456789abcdef",
                Email = useremail,
                Memberuserid = addcaseobj.Username,
                Password = "MykaSe_PasSsword",
                Mobile = usermobile,
                Dispname = vdisplayname,
                Countryname = countryname,
                StateName = statename,
                Subscriptionstart = startdate,
                Subscriptionend = enddate
            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AddUserMyKase"), "POST", builders);

            try
            {
                var db1 = new LawPracticeEntities();
                var param = apiUrl + "AddCaseCaseWatch=>InsertCaseDetailNew=>/API/Search/AddUserMyKase" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");


            }
            catch
            {

            }

            dynamic data = JObject.Parse(resid);
            string status = data.Status;
            string Message = data.Message;
            string dataval = data.data;


            if (status == "True")
            {
                //insert login into mykase
                var insertusermap = db.sp_AddUserNeWCashwatch(userfirmid, userid, addcaseobj.Username);

                // add case in casewatch
                var addfClient1 = new WebClient();
                object rawfile1 = new
                {
                    Accesstoken = "mykase123456789abcdef",
                    userid = addcaseobj.Username,
                    Casetype = addcaseobj.Casetype,
                    Caseno = addcaseobj.Caseno.Trim(),
                    Caseyear = addcaseobj.Caseyear,
                    DiaryNo = addcaseobj.Diaryno.Trim(),
                    Court = addcaseobj.Court,
                    FileNo = "",
                    BenchID = addcaseobj.BenchID,
                    SideID = addcaseobj.SideID,
                    courttitle = addcaseobj.Courttitle,
                    stampreg = addcaseobj.Stampreg,
                    Flag = 0,
                    districtid = addcaseobj.District,
                    stateId = addcaseobj.TriState,
                    suffix = addcaseobj.Suffix,


                };
                //LogService("Flag:"+ iflag);

                addfClient1.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders1 = JsonConvert.SerializeObject(rawfile1);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid1 = addfClient1.UploadString(new Uri(apiUrl + "/API/Search/AddCaseTypeMykase"), "POST", builders1);
                try
                {
                    var db1 = new LawPracticeEntities();
                    var param = apiUrl + "AddCaseCaseWatch=>InsertCaseDetailNew=>/API/Search/AddCaseTypeMykase" + "@" + builders1;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");


                }
                catch { }
                ds = resid1;
          
                return ds;
            }
            else
            {
                ds = "false";
                return ds;
            }




        }
        /// <summary>
        /// Update new case details
        /// </summary>
        /// <param name="addcaseobj"></param>
        /// <param name="iflag"></param>
        /// <param name="useremail"></param>
        /// <param name="usermobile"></param>
        /// <param name="userfirmid"></param>
        /// <param name="userid"></param>
        /// <param name="districtname"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <returns></returns>
        public static string UpdateCaseDetailNew(AddCaseObject1 addcaseobj, int iflag, string useremail, string usermobile, string userfirmid, string userid,string districtname, string savetocasewatchurl)
        {
            string ds = "";
            dynamic aff1 = 0;
            dynamic aff = 0;
            string finalcaseid = "";
            var vdisplayname = "";
            var countryname = "";
            var statename = "";
            var db = new LawPracticeEntities();

            var startdate = "";
            var enddate = "";


            ////insert user login to casewatch

            var getuserdetails = db.usp_GetUserDetailByUserID(userfirmid, userid).FirstOrDefault();
            if (getuserdetails != null)
            {
                 vdisplayname = getuserdetails.Name;
                countryname = getuserdetails.country;
                statename = getuserdetails.cstate;
            }

            var firmdates = db.usp_wf_GetFirmDetailByID(Guid.Parse(userfirmid)).FirstOrDefault();
            if (firmdates != null)
            {
                startdate = Convert.ToDateTime(firmdates.SubscriptionStartDate).Month.ToString("D2") + "/" + Convert.ToDateTime(firmdates.SubscriptionStartDate).Day.ToString("D2") + "/" + Convert.ToDateTime(firmdates.SubscriptionStartDate).Year.ToString();
                enddate = Convert.ToDateTime(firmdates.ExpiryDate).Month.ToString("D2") + "/" + Convert.ToDateTime(firmdates.ExpiryDate).Day.ToString("D2") + "/" + Convert.ToDateTime(firmdates.ExpiryDate).Year.ToString();

            }

            var apiUrl = savetocasewatchurl;
            //add login data
            var addfClient = new WebClient();
            object rawfile = new
            {
                Accesstoken = "mykase123456789abcdef",
                Email = useremail,
                Memberuserid = addcaseobj.Username,
                Password = "MykaSe_PasSsword",
                Mobile = usermobile,
                Dispname = vdisplayname,
                Countryname = countryname,
                StateName = statename,
                Subscriptionstart = startdate,
                Subscriptionend = enddate

            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AddUserMyKase"), "POST", builders);

            try
            {
                var db1 = new LawPracticeEntities();
                var param = apiUrl + "AddCaseCaseWatch=>UpdateCaseDetailNew=>/API/Search/AddUserMyKase" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");


            }
            catch
            {

            }


            dynamic data = JObject.Parse(resid);
            string status = data.Status;
            string Message = data.Message;
            string dataval = data.data;


            if (status == "True")
            {

                //insert login into mykase
                var insertusermap = db.sp_AddUserNeWCashwatch(userfirmid, userid, addcaseobj.Username);
                //add case
                var addfClient1 = new WebClient();
                object rawfile1 = new
                {
                    Accesstoken = "mykase123456789abcdef",
                    userid = addcaseobj.Username,
                    Casetype = addcaseobj.Casetype,
                    Caseno = addcaseobj.Caseno.Trim(),
                    Caseyear = addcaseobj.Caseyear,
                    DiaryNo = addcaseobj.Diaryno.Trim(),
                    Court = addcaseobj.Court,
                    FileNo = "",
                    BenchID = addcaseobj.BenchID,
                    SideID = addcaseobj.SideID,
                    courttitle = addcaseobj.Courttitle,
                    stampreg = addcaseobj.Stampreg,
                    Flag = iflag,
                    districtid = addcaseobj.District,
                    stateId = addcaseobj.TriState,
                };
                addfClient1.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders1 = JsonConvert.SerializeObject(rawfile1);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid1 = addfClient1.UploadString(new Uri(apiUrl + "/API/Search/AddCaseTypeMykase"), "POST", builders1);
                try
                {
                    var db1 = new LawPracticeEntities();
                    var param = apiUrl + "AddCaseCaseWatch=>UpdateCaseDetailNew=>/API/Search/AddCaseTypeMykase" + "@" + builders1;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");


                }
                catch
                {

                }
                dynamic data1 = JObject.Parse(resid1);
                string status1 = data1.Status;
                string Message1 = data1.Message;


                string dbstatus = "";
                string dbmessage = "";

                if (Message1.ToString() == "Sorry! Unable to Add now.")
                {
                    ds = resid1;

                }
                else
                {
                    dbstatus = data1.data[0].dbStatus;
                    dbmessage = data1.data[0].dbMessage;
                }

                ds = resid1;
                if (Convert.ToInt32(dbstatus) > 0)
                {
                    var chkmtrcase = db.tblUserCasesMapCaseStatusMasters.Where(x => x.MatterID.ToString() == addcaseobj.Matterid.ToString()).FirstOrDefault();
                    if (chkmtrcase == null)
                    {
                        tblUserCasesMapCaseStatusMaster tbl = new tblUserCasesMapCaseStatusMaster();
                        tbl.MatterID = Guid.Parse(addcaseobj.Matterid.ToString());
                        tbl.UserCaseId = Convert.ToInt32(dbstatus.ToString());
                        tbl.CreatedOn = DateTime.Now;

                        db.tblUserCasesMapCaseStatusMasters.Add(tbl);
                        db.SaveChanges();

                        try
                        {
                            if (!String.IsNullOrEmpty(HttpContext.Current.Request.Form["drpdistrictcourtname"]))
                            {
                                Tbl_CaseDistrict tbl1 = new Tbl_CaseDistrict();
                                tbl1.caseId = Guid.Parse(addcaseobj.Matterid.ToString());
                                tbl1.Firmid = Guid.Parse(userfirmid);
                                tbl1.Userid = Guid.Parse(userid);
                                tbl1.districtid = addcaseobj.BenchID.ToString();
                                tbl1.districtname = districtname;
                                tbl1.date_time = DateTime.Now;
                                var rslt = db.usp_savecasedistrict(tbl1.Firmid.ToString(), tbl1.Userid.ToString(), tbl1.caseId.ToString(), tbl1.districtid.ToString(), tbl1.districtname.ToString());

                            }
                        }
                        catch (Exception es)
                        {

                        }
                        //string iid = SqlDbDAL.ExecuteScalarSP();
                    }
                    else
                    {
                        //remove old case

                        var addfClientd = new WebClient();
                        object rawfiled = new
                        {
                            Accesstoken = "mykase123456789abcdef",
                            id = chkmtrcase.UserCaseId,


                        };
                        addfClientd.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                        string buildersd = JsonConvert.SerializeObject(rawfiled);
                        ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                        string residd = addfClientd.UploadString(new Uri(apiUrl + "/API/Search/RemoveCasebyAdminUser"), "POST", buildersd);
                        try
                        {
                            var db1 = new LawPracticeEntities();
                            var param = apiUrl + "AddCaseCaseWatch=>UpdateCaseDetailNew=>/API/Search/RemoveCasebyAdminUser" + "@" + buildersd;
                            db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");


                        }
                        catch
                        {

                        }

                        dynamic datad = JObject.Parse(residd);
                        string statusd = datad.Status;

                        if (statusd.ToString() == "True")
                        {
                            tblUserCasesMapCaseStatusMaster tbl = new tblUserCasesMapCaseStatusMaster();
                            var mtcase = db.tblUserCasesMapCaseStatusMasters.Where(x => x.MatterID.ToString() == addcaseobj.Matterid.ToString()).FirstOrDefault();
                            mtcase.MatterID = Guid.Parse(addcaseobj.Matterid.ToString());
                            mtcase.UserCaseId = Convert.ToInt32(dbstatus.ToString());

                            //mtcase.CreatedOn = DateTime.Now;
                            db.Entry(mtcase).State = EntityState.Modified;
                            db.SaveChanges();




                        }
                    }


                }



                return ds;

            }
            else
            {
                ds = "false";
                return ds;
            }


            //  return ds;

        }

        /// <summary>
        /// Save case alert user
        /// </summary>
        /// <param name="auserid"></param>
        /// <param name="userid"></param>
        /// <param name="userfirmid"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <param name="cwcaseid"></param>
        /// <param name="IsCwuser"></param>
        /// <param name="CWUserId"></param>
        /// <returns></returns>        
        /// 
        public static string SaveCaseAlertUser(string auserid, string userid, string userfirmid, string savetocasewatchurl, string cwcaseid,int IsCwuser,string CWUserId)
        {
            var db = new LawPracticeEntities();
            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            string AccessTokenDetail = string.Empty;
            string userIdDetail = string.Empty;
            string memberuserids = string.Empty;
            string IsCaseWatchUser = IsCwuser.ToString();
            string IsCWLoginUserName = string.Empty;
            if (!String.IsNullOrEmpty(IsCaseWatchUser))
            {
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = CWUserId.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = matteridname + userid;
                }
            }
           
            string[] values = auserid.Split(',');
            var vdisplayname = "";
            string status2 = "";
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
                }
                //check member userid is CW User
                if (getuseremailmobile.IsCaseWatch == 1)
                {
                    memberuserids = getuseremailmobile.UserName;
                    if(IsCaseWatchUser == "1")
                    {
                        userIdDetail = CWUserId.ToString();
                    }
                    else
                    {
                        userIdDetail = matteridname + userid;
                    }   
                }
                else
                { 
                    //if(IsCaseWatchUser == "1")
                    //{
                    //    memberuserids = matteridname + values[i];
                    //    userIdDetail = CWUserId.ToString();
                    //}
                    //else
                    //{
                    //    memberuserids = matteridname + values[i];
                    //    userIdDetail = matteridname + userid;
                    //}
                    memberuserids = matteridname + values[i];
                    //userIdDetail = matteridname + userid;
                }
                dynamic aff1 = 0;
                dynamic aff = 0;

                var apiUrl = savetocasewatchurl;
                //add login data
                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    userId = userIdDetail,
                    email = getuseremailmobile.EmailId,
                    memberuserid = memberuserids,
                    Password = "MykaSe_PasSsword",
                    Mobile = getuseremailmobile.cmobile,
                    Dispname = vdisplayname,

                };

                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AddMyKaseClientMember"), "POST", builders);

                //try
                //{
                //    var db1 = new LawPracticeEntities();
                //    var param = apiUrl + "AddCaseCaseWatch=>SaveCaseAlertUser=>/API/Search/AddMyKaseClientMember" + "@" + builders;
                //    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");

                //}
                //catch { }
                dynamic data1 = JObject.Parse(resid);
                string status = data1.Status;
                string Message = data1.Message;


                if (status == "True")
                {
                    string dbstatususerid = "";


                    dbstatususerid = data1.data[0].UserId;

                    //insert login into mykase


                    //add login data
                    var addfClient2 = new WebClient();
                    object rawfile2 = new
                    {
                        Accesstoken = AccessTokenDetail,
                        userId = userIdDetail,

                        memberuserid = dbstatususerid,
                        userCaseId = cwcaseid,

                    };

                    addfClient2.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders2 = JsonConvert.SerializeObject(rawfile2);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    string resid2 = addfClient2.UploadString(new Uri(apiUrl + "/API/Search/MapCasetoMyKaseUser"), "POST", builders2);

                    dynamic data2 = JObject.Parse(resid2);
                    status2 = data2.Status;
                    string Message2 = data2.Message;

                    //try
                    //{
                    //    var db1 = new LawPracticeEntities();
                    //    var param = apiUrl + "AddCaseCaseWatch=>SaveCaseAlertUser=>/API/Search/MapCasetoMyKaseUser" + "@" + builders2;
                    //    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");


                    //}
                    //catch
                    //{

                    //}


                }
                //if (Message == "Userid Already Exist !!")
                //{
                //    status2 = "Exist";
                //}

                if (Message == "Invalid member email")
                {
                    status2 = "Invalid member email";
                }
                if (Message == "Invalid member mobile")
                {
                    status2 = "Invalid member mobile";
                }

            }

            return status2;
        }
        /// <summary>
        /// Save and update case alert user
        /// </summary>
        /// <param name="auserid"></param>
        /// <param name="userid"></param>
        /// <param name="userfirmid"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <param name="cwcaseid"></param>
        /// <returns></returns>        
        /// 
        public static string SaveCaseAlertUser_update(string auserid, string userid, string userfirmid, 
            string savetocasewatchurl, string cwcaseid,int IsCWUser,string CWUserIds)
        {
            var db = new LawPracticeEntities();
            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            string[] values = auserid.Split(',');
            var vdisplayname = "";
            string status2 = "";
            var countryname = "";
            var statename = "";
            string memberuserids = string.Empty;
            string Loginuserids = string.Empty;
            List<CaseUserMapDetailList> casemaplist = new List<CaseUserMapDetailList>();
            var apiUrl = savetocasewatchurl;
            if (IsCWUser == 1)
            {
                Loginuserids = CWUserIds;
            }
            else
            {
                Loginuserids = matteridname + userid;
            }
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
                //check member userid is CW User
                if (getuseremailmobile.IsCaseWatch == 1)
                {
                    memberuserids = getuseremailmobile.UserName;
                    if (IsCWUser == 1)
                    {
                        Loginuserids = CWUserIds;
                    }
                    else
                    {
                        Loginuserids = matteridname + userid;
                    }
                }
                else
                {
                    //if (IsCWUser == 1)
                    //{
                    //    memberuserids = matteridname + values[i];
                    //    Loginuserids = CWUserIds;
                    //}
                    //else
                    //{
                    //    memberuserids = matteridname + values[i];
                    //    Loginuserids = matteridname + userid;
                    //}
                    memberuserids = matteridname + values[i];
                   // Loginuserids = matteridname + userid;
                }
                dynamic aff1 = 0;
                dynamic aff = 0;
                casemaplist.Add(new CaseUserMapDetailList
                {
                    Dispname = vdisplayname,
                    Email = getuseremailmobile.EmailId,
                    Mobile = getuseremailmobile.cmobile,
                    Password = "MykaSe_PasSsword",
                    Memberuserid = memberuserids,
                    Countryname = countryname,
                    StateName = statename,
                    Subscriptionstart = "",
                    Subscriptionend = "",
                    LoggedInEmail = "",
                    Userid = Loginuserids,
                });
            }

            //add login data
            var addfClient2 = new WebClientConnection();
            var starttime = DateTime.Now;
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
                string resid2 = addfClient2.UploadString(new Uri(apiUrl + "/API/Search/MykaseUserCaseMapingToCasewatch"), "POST", builders2);
                dynamic data2 = JObject.Parse(resid2);
                status2 = data2.Status;
                string Message2 = data2.Message;

            }
            catch (Exception ex)
            {
                LogService("/API/Search/MykaseUserCaseMapingToCasewatch" + ex.Message + "&" + ex.InnerException + "starttime" + starttime + "Endtime" + DateTime.Now);
            
            }
            return status2;
            //  return "false";
        }

        /// <summary>
        /// GEt casewatch user alert list
        /// </summary>
        /// <param name="userid"></param>
        /// <param name="userfirmid"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <param name="cwcaseid"></param>
        /// <param name="IsCWUser"></param>
        /// <param name="CWUserId"></param>
        /// <returns></returns>       
        /// 
        public static string CaseWatchAlertUserList(string userid, string userfirmid, string savetocasewatchurl, string cwcaseid,int IsCWUser,string CWUserId)
        {
            var db = new LawPracticeEntities();
            var matteridname = WebConfigurationManager.AppSettings["matteridname"];


            dynamic aff1 = 0;
            dynamic aff = 0;

            var apiUrl = savetocasewatchurl;
            //add login data
            var addfClient = new WebClient();
            string AccessTokenDetail = string.Empty;
            string userIdDetail = string.Empty;
            string IsCaseWatchUser = IsCWUser.ToString();
            if (!String.IsNullOrEmpty(IsCaseWatchUser))
            {
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = CWUserId.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = matteridname + userid;
                }
            }

            object rawfile = new
            {
                Accesstoken = AccessTokenDetail,
                userId = userIdDetail,
                UserCaseId = cwcaseid,

            };

            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MykaseUsersOfAdminUser"), "POST", builders);

            try
            {
                var db1 = new LawPracticeEntities();
                var param = apiUrl + "AddCaseCaseWatch=>CaseWatchAlertUserList=>/API/Search/MykaseUsersOfAdminUser" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");


            }
            catch
            {

            }


            return resid;



        }
        /// <summary>
        /// Remove case watch alert user
        /// </summary>
        /// <param name="auserid"></param>
        /// <param name="userid"></param>
        /// <param name="userfirmid"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <param name="cwcaseid"></param>
        /// <param name="IsCwuser"></param>
        /// <param name="CWUserNmae"></param>
        /// <returns></returns>        
        /// 
        public static string RemoveCaseWatchAlertUser(string auserid, string userid, string userfirmid, string savetocasewatchurl, string cwcaseid,int IsCwuser,string CWUserNmae)
        {

            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            dynamic aff1 = 0;
            dynamic aff = 0;

            var apiUrl = savetocasewatchurl;
            string AccessTokenDetail = string.Empty;
            string userIdDetail = string.Empty;
            string IsCaseWatchUser = IsCwuser.ToString();
            if (!String.IsNullOrEmpty(IsCaseWatchUser))
            {
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = CWUserNmae.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = matteridname + userid;
                }
            }
            //add login data
            var addfClient = new WebClient();
            object rawfile = new
            {
                Accesstoken = AccessTokenDetail,
                userId = userIdDetail,
                memberuserid = auserid,
                userCaseId = cwcaseid,


            };

            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/RemoveMappedCaseMyKaseUser"), "POST", builders);
            try
            {
                var db1 = new LawPracticeEntities();
                var param = apiUrl + "AddCaseCaseWatch=>RemoveCaseWatchAlertUser=>/API/Search/RemoveMappedCaseMyKaseUser" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");


            }
            catch
            {

            }

            dynamic data1 = JObject.Parse(resid);
            string status = data1.Status;
            string Message = data1.Message;



            return status;




        }

        /// <summary>
        /// MyUser ID Update for Case
        /// </summary>
        /// <param name="fromuser"></param>
        /// <param name="touser"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <param name="cwcaseid"></param>
        /// <returns></returns>        
        /// 
        public static string MyUserIDUpdateforACase(string fromuser, string touser, string savetocasewatchurl, string cwcaseid)
        {


            dynamic aff1 = 0;
            dynamic aff = 0;


            var apiUrl = savetocasewatchurl;
            var addfClient = new WebClient();
            object rawfile = new
            {

                accesstoken = "mykase123456789abcdef",
                UserId = "MyKase_" + fromuser,
                NewUserId = "MyKase_" + touser,
                UserCaseId = cwcaseid,


            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MyUserIDUpdateforACase"), "POST", builders);
            try
            {
                var db1 = new LawPracticeEntities();
                var param = apiUrl + "AddCaseCaseWatch=>MyUserIDUpdateforACase=>/API/Search/MyUserIDUpdateforACase" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");


            }
            catch
            {

            }


            dynamic data = JObject.Parse(resid);
            var status = data.Status;
            string Message = data.Message;
            string dataval = data.data;

            return dataval;
        }

        /// <summary>
        /// Case Watch Transfer Request
        /// </summary>
        /// <param name="sourceuser"></param>
        /// <param name="destuser"></param>
        /// <param name="userirmid"></param>
        /// <param name="userid"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <param name="cwcaseid"></param>
        /// <returns></returns>       
        /// 
        public static string CaseWatchTransferRequest(string sourceuser, string destuser, string userirmid, string userid, string savetocasewatchurl, string cwcaseid)
        {

            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            dynamic aff1 = 0;
            dynamic aff = 0;

            var apiUrl = savetocasewatchurl;
            //add login data
            var addfClient = new WebClient();
            object rawfile = new
            {
                Accesstoken = "mykase123456789abcdef",
                userId = matteridname + userid,
                source = matteridname + sourceuser,
                destination = matteridname + destuser,
                userCaseId = cwcaseid,

            };

            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/CaseTransferRequest"), "POST", builders);
            try
            {
                var db1 = new LawPracticeEntities();
                var param = apiUrl + "AddCaseCaseWatch=>CaseWatchTransferRequest=>/API/Search/CaseTransferRequest" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");


            }
            catch
            {

            }

            dynamic data1 = JObject.Parse(resid);
            string status = data1.Status;
            string Message = data1.Message;



            return status;




        }

        /// <summary>
        /// Find user for matter
        /// </summary>
        /// <param name="source"></param>
        /// <param name="destination"></param>
        /// <param name="userfirmid"></param>
        /// <returns></returns>        
   
        public static string FindUserForMatter(string source, string destination, string userfirmid)
        {
            StringBuilder sd = new StringBuilder();
            var result = "";
            sd.Clear();
            if (!String.IsNullOrEmpty(source.ToString()))
            {


                string[] values = source.Split(',');
                for (int i = 0; i < values.Length; i++)
                {
                    values[i] = values[i].Trim();
                    var newuserflagcompare = destination.Contains(values[i].ToString());
                    if (newuserflagcompare == false)
                    {
                        sd = sd.Append(values[i] + ",");
                        //remove user alert from casewatch
                    }
                }



            }
            result = Convert.ToString(sd).TrimEnd(',').TrimStart(',');
            return result;
        }

        /// <summary>
        /// Remove Revenue Case by User Case Id
        /// </summary>
        /// <param name="userid"></param>
        /// <param name="Ids"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <returns></returns>       
        public static string RemoveRevenueCasebyUserCaseId(string userid, string Ids, string savetocasewatchurl)
        {

            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            dynamic aff1 = 0;
            dynamic aff = 0;

            var apiUrl = savetocasewatchurl;
            //add login data
            var addfClient = new WebClient();
            object rawfile = new
            {
                Accesstoken = "mykase123456789abcdef",
                Userid = matteridname + userid,
                Id = Ids,

            };

            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/RemoveRevenueCasebyUserCaseId"), "POST", builders);
            try
            {
                var db1 = new LawPracticeEntities();
                var param = apiUrl + "AddCaseCaseWatch=>RemoveRevenueCasebyUserCaseId=>/API/Search/RemoveRevenueCasebyUserCaseId" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");


            }
            catch
            {

            }
            return resid;
        }

        /// <summary>
        /// Upload append court orders
        /// </summary>
        /// <param name="httpRequest"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="caseids"></param>
        /// <param name="corderdates"></param>
        /// <param name="statuss"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <returns></returns>        
        /// 
        public static string UploadAppendCourtOrders(HttpRequestBase httpRequest, string firmid, string userid, string caseids, string corderdates, string statuss,
            string savetocasewatchurl,string CWLoginuser,string IsCWuser)
        {

            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            var apiUrl = savetocasewatchurl;
            var resid = "";
            var fileContent = "";
            var filename = "";
            for (int i = 0; i < httpRequest.Files.Count; i++)
            {
                var file = httpRequest.Files[i];
                if (file.ContentLength > 5242880)
                {
                    return "FileSizeLimit";
                }
                BinaryReader b = new BinaryReader(file.InputStream);
                byte[] Bytes = b.ReadBytes(file.ContentLength);

                fileContent = Convert.ToBase64String(Bytes);
                filename = file.FileName;


            }
            string AccessTokenDetail = string.Empty;
            string userIdDetail = string.Empty;
            string IsCaseWatchUser = IsCWuser;
            string LogincwUserId = CWLoginuser;
            if (IsCaseWatchUser == "1")
            {
                userIdDetail = CWLoginuser.ToString();
                AccessTokenDetail = "internal";
            }
            else
            {
                AccessTokenDetail = "mykase123456789abcdef";
                userIdDetail = matteridname + userid;
            }

            if (!String.IsNullOrEmpty(fileContent))
            {
                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    userid = userIdDetail,
                    caseid = caseids,
                    orderid = 0,
                    corderdate = corderdates,
                    status = statuss,
                    filename = filename,
                    fileinbyte = fileContent,


                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AddCustomOrder"), "POST", builders);
                try
                {
                    var db1 = new LawPracticeEntities();
                    var param = apiUrl + "AddCaseCaseWatch=>UploadAppendCourtOrders=>/API/Search/AddCustomOrder" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
                }
                catch
                {

                }

            }

            return resid;
        }


        /// <summary>
        /// Save revenue case alert user
        /// </summary>
        /// <param name="auserid"></param>
        /// <param name="userid"></param>
        /// <param name="userfirmid"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <param name="cwcaseid"></param>
        /// <param name="IsCWuser"></param>
        /// <param name="CWUserId"></param>
        /// <returns></returns>        
        /// 
        public static string SaveCaseAlertUserRevenue(string auserid, string userid, string userfirmid, string savetocasewatchurl, string cwcaseid,int IsCWuser,string CWUserId)
        {

            var db = new LawPracticeEntities();
            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            string AccessTokenDetail = string.Empty;
            string userIdDetail = string.Empty;
            string memberuserids = string.Empty;
            string IsCaseWatchUser = IsCWuser.ToString();
            if (!String.IsNullOrEmpty(IsCaseWatchUser))
            {
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = CWUserId.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = matteridname + userid;
                }
            }
            string[] values = auserid.Split(',');
            var vdisplayname = "";
            string status2 = "";
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
                }
                //check member userid is CW User
                if (getuseremailmobile.IsCaseWatch == 1)
                {
                    memberuserids = getuseremailmobile.UserName;
                    userIdDetail = CWUserId.ToString();
                }
                else
                {
                    memberuserids = matteridname + values[i];
                    userIdDetail = matteridname + userid;
                }
                dynamic aff1 = 0;
                dynamic aff = 0;
                var apiUrl = savetocasewatchurl;
                //add login data
                var addfClient = new WebClient();
                object rawfile = new
                {
                    accesstoken = AccessTokenDetail,
                    userId = userIdDetail,
                    email = getuseremailmobile.EmailId,
                    memberuserid = memberuserids,
                    Password = "MykaSe_PasSsword",
                    Mobile = getuseremailmobile.cmobile,
                    Dispname = vdisplayname,

                };

                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AddMyKaseClientMember"), "POST", builders);

                try
                {
                    var db1 = new LawPracticeEntities();
                    var param = apiUrl + "AddCaseCaseWatch=>SaveCaseAlertUser=>/API/Search/AddMyKaseClientMember" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");


                }
                catch
                {

                }

                dynamic data1 = JObject.Parse(resid);
                string status = data1.Status;
                string Message = data1.Message;


                if (status == "True")
                {
                    string dbstatususerid = "";


                    dbstatususerid = data1.data[0].UserId;

                    //insert login into mykase


                    //add login data
                    var addfClient2 = new WebClient();
                    object rawfile2 = new
                    {
                        accesstoken = AccessTokenDetail,
                        userId = userIdDetail,
                        memberuserid = dbstatususerid,
                        userCaseId = cwcaseid,

                    };

                    addfClient2.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders2 = JsonConvert.SerializeObject(rawfile2);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    string resid2 = addfClient2.UploadString(new Uri(apiUrl + "/API/Search/MapCasetoMyKaseUserRevenue"), "POST", builders2);

                    dynamic data2 = JObject.Parse(resid2);
                    status2 = data2.Status;
                    string Message2 = data2.Message;

                    try
                    {
                        var db1 = new LawPracticeEntities();
                        var param = apiUrl + "AddCaseCaseWatch=>MapCasetoMyKaseUserRevenue=>/API/Search/MapCasetoMyKaseUserRevenue" + "@" + builders2;
                        db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");


                    }
                    catch
                    {

                    }


                }
            }
            return status2;
        }

        /// <summary>
        /// Get revenue case watch user list
        /// </summary>
        /// <param name="userid"></param>
        /// <param name="userfirmid"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <param name="cwcaseid"></param>
        /// <param name="IsCWUser"></param>
        /// <param name="CWUserId"></param>
        /// <returns></returns>        
        /// 
        public static string CaseWatchAlertUserListRevenue(string userid, string userfirmid, string savetocasewatchurl, string cwcaseid, int IsCWUser, string CWUserId)
        {

            var db = new LawPracticeEntities();
            var matteridname = WebConfigurationManager.AppSettings["matteridname"];


            dynamic aff1 = 0;
            dynamic aff = 0;
            var apiUrl = savetocasewatchurl;
            string AccessTokenDetail = string.Empty;
            string userIdDetail = string.Empty;
            string IsCaseWatchUser = IsCWUser.ToString();
            if (!String.IsNullOrEmpty(IsCaseWatchUser))
            {
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = CWUserId.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = matteridname + userid;
                }
            }
            //add login data
            var addfClient = new WebClient();
            object rawfile = new
            {
                accesstoken = AccessTokenDetail,
                userId = userIdDetail,
                UserCaseId = cwcaseid,

            };

            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MykaseUsersOfAdminUserRevenue"), "POST", builders);

            try
            {
                var db1 = new LawPracticeEntities();
                var param = apiUrl + "AddCaseCaseWatch=>MykaseUsersOfAdminUserRevenue=>/API/Search/MykaseUsersOfAdminUserRevenue" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");


            }
            catch
            {

            }


            return resid;



        }
        /// <summary>
        /// Remove revenue case watch alert user
        /// </summary>
        /// <param name="auserid"></param>
        /// <param name="userid"></param>
        /// <param name="userfirmid"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <param name="cwcaseid"></param>
        /// <returns></returns>        
        /// 
        public static string RemoveCaseWatchAlertUserRevenue(string auserid, string userid, string userfirmid, string savetocasewatchurl, string cwcaseid)
        {


            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            dynamic aff1 = 0;
            dynamic aff = 0;

            var apiUrl = savetocasewatchurl;
            //add login data
            var addfClient = new WebClient();
            object rawfile = new
            {
                accesstoken = "mykase123456789abcdef",
                userId = matteridname + userid,
                memberuserid = auserid,
                userCaseId = cwcaseid,


            };

            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/RemoveMappedCaseMyKaseUserRevenue"), "POST", builders);
            try
            {
                var db1 = new LawPracticeEntities();
                var param = apiUrl + "AddCaseCaseWatch=>RemoveMappedCaseMyKaseUserRevenue=>/API/Search/RemoveMappedCaseMyKaseUserRevenue" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");


            }
            catch
            {

            }

            dynamic data1 = JObject.Parse(resid);
            string status = data1.Status;
            string Message = data1.Message;



            return status;




        }

        /// <summary>
        /// Set ON/OFF case alert user
        /// </summary>
        /// <param name="userid"></param>
        /// <param name="statusAlert"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <returns></returns>        
        /// 
        public static string AddCaseAlertOnOFF(string userid, string statusAlert, string savetocasewatchurl, string IsCaseWatchUser)
        {
            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            dynamic aff1 = 0;
            dynamic aff = 0;

            var apiUrl = savetocasewatchurl;
            //add login data
            var addfClient = new WebClient();
            var token = "internal";
            if (IsCaseWatchUser != "1")
            {
                userid = matteridname + userid;
                token = "mykase123456789abcdef";
            }

            object rawfile = new
            {
                accesstoken = token,
                UserId = userid,
                Status = statusAlert,
            };

            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AddCaseAlertOnOFF"), "POST", builders);
            try
            {
                var db1 = new LawPracticeEntities();
                var param = apiUrl + "AddCaseCaseWatch=>AddCaseAlertOnOFF=>/API/Search/AddCaseAlertOnOFF" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");


            }
            catch
            {

            }
            return resid;

        }

        /// <summary>
        /// Add case alert days
        /// </summary>
        /// <param name="userid"></param>
        /// <param name="AlertDays"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <returns></returns>        
        /// 
        public static string AddCaseAlertDays(string userid, string AlertDays, string savetocasewatchurl)
        {
            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            dynamic aff1 = 0;
            dynamic aff = 0;

            var apiUrl = savetocasewatchurl;
            //add login data
            var addfClient = new WebClient();
            object rawfile = new
            {
                accesstoken = "mykase123456789abcdef",
                UserId = matteridname + userid,
                daysno = AlertDays,
            };

            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/UpdateAlertDaysbefore"), "POST", builders);
            try
            {
                var db1 = new LawPracticeEntities();
                var param = apiUrl + "AddCaseCaseWatch=>AddCaseAlertDays=>/API/Search/AlertDaysBefore" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");


            }
            catch
            {

            }
            return resid;

        }
        /// <summary>
        /// Add before alert days
        /// </summary>
        /// <param name="userid"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <returns></returns>        
        /// 
        public static string AlertDaysBefore(string userid, string savetocasewatchurl)
        {
            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            dynamic aff1 = 0;
            dynamic aff = 0;

            var apiUrl = savetocasewatchurl;
            //add login data
            var addfClient = new WebClient();
            object rawfile = new
            {
                accesstoken = "mykase123456789abcdef",
                UserId = matteridname + userid,
            };

            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AlertDaysBefore"), "POST", builders);
            try
            {
                var db1 = new LawPracticeEntities();
                var param = apiUrl + "AddCaseCaseWatch=>AlertDaysBefore=>/API/Search/AlertDaysBefore" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");


            }
            catch
            {

            }
            return resid;

        }
        //end added by umesh on 6Jul22
        public static async Task<string> NextHearingIfidByUserIdRevenueAsync(string strapiuser, string savetocasewatchurl, string userid)
        {

            var db1 = new LawPracticeEntities();
            try
            {
                var matteridname = WebConfigurationManager.AppSettings["matteridname"];
                dynamic aff1 = 0;
                dynamic aff = 0;

                var apiUrl = savetocasewatchurl;
                //add login data
                var addfClient = new HttpClient();
                object rawfile = new
                {
                    accesstoken = "mykase123456789abcdef",
                    UserId = strapiuser,
                };

                string content = JsonConvert.SerializeObject(rawfile);

                StringContent queryString = new StringContent(content, Encoding.UTF8, "application/json");
                addfClient.Timeout = TimeSpan.FromMilliseconds(20000);
                addfClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var response = await addfClient.PostAsync(new Uri(apiUrl + "/API/Search/NextHearingIfidByUserIdRevenue").ToString(), queryString);

                var resruendata = await response.Content.ReadAsStringAsync();
                return resruendata;
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return "Error";

            }


        }
        /// <summary>
        /// Get revenue causelist details
        /// </summary>
        /// <param name="userid"></param>
        /// <param name="date"></param>
        /// <param name="search"></param>
        /// <param name="pagenumber"></param>
        /// <param name="pagesize"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <returns></returns>        
        /// 
        public static string MyKaseDailyCauselistRevenue(string userid, string date, string search, string pagenumber, string pagesize, string savetocasewatchurl)
        {
            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            dynamic aff1 = 0;
            dynamic aff = 0;

            var apiUrl = savetocasewatchurl;
            //add login data
            var addfClient = new WebClient();

            object rawfile = new
            {
                accesstoken = "mykase123456789abcdef",
                UserId = userid,
                Date = date,
                Searchtext = search,
                Pageindex = pagenumber,
                Pagesize = pagesize,
            };
            addfClient.Encoding = System.Text.Encoding.UTF8;
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MyKaseDailyCauselistRevenue"), "POST", builders);
            try
            {
                var db1 = new LawPracticeEntities();
                var param = apiUrl + "AddCaseCaseWatch=>MyKaseDailyCauselistRevenue=>/API/Search/MyKaseDailyCauselistRevenue" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");


            }
            catch
            {

            }
            return resid;

        }

        /// <summary>
        /// All revenue cause list details
        /// </summary>
        /// <param name="userid"></param>
        /// <param name="search"></param>
        /// <param name="pagenumber"></param>
        /// <param name="pagesize"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <returns></returns>        
        /// 
        public static string MykaseAllCauselistDataRevenue(string userid, string search, string pagenumber, string pagesize, string savetocasewatchurl)
        {
            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            dynamic aff1 = 0;
            dynamic aff = 0;

            var apiUrl = savetocasewatchurl;
            //add login data
            var addfClient = new WebClient();

            object rawfile = new
            {
                accesstoken = "mykase123456789abcdef",
                UserId = userid,
                Searchtext = search,
                Pageindex = pagenumber,
                Pagesize = pagesize,
            };
            addfClient.Encoding = System.Text.Encoding.UTF8;
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MykaseAllCauselistDataRevenue"), "POST", builders);
            try
            {
                var db1 = new LawPracticeEntities();
                var param = apiUrl + "AddCaseCaseWatch=>MykaseAllCauselistDataRevenue=>/API/Search/MykaseAllCauselistDataRevenue" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");


            }
            catch
            {

            }
            return resid;

        }


        /// <summary>
        /// Add case watch user
        /// </summary>
        /// <param name="memberuserid"></param>
        /// <param name="useremail"></param>
        /// <param name="usermobile"></param>
        /// <param name="userfirmid"></param>
        /// <param name="userid"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <returns></returns>        
        /// 
        public static string AddUserToCW(string memberuserid, string useremail, string usermobile, string userfirmid, string userid, string savetocasewatchurl)
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

            var getuserdetails = db.usp_GetUserDetailByUserID(userfirmid, userid).FirstOrDefault();
            if (getuserdetails != null)
            {
                vdisplayname = getuserdetails.Name;
                countryname = getuserdetails.country;
                statename = getuserdetails.cstate;
            }

            var firmdates = db.usp_wf_GetFirmDetailByID(Guid.Parse(userfirmid)).FirstOrDefault();
            if (firmdates != null)
            {
                startdate = Convert.ToDateTime(firmdates.SubscriptionStartDate).Month.ToString("D2") + "/" + Convert.ToDateTime(firmdates.SubscriptionStartDate).Day.ToString("D2") + "/" + Convert.ToDateTime(firmdates.SubscriptionStartDate).Year.ToString();
                enddate = Convert.ToDateTime(firmdates.ExpiryDate).Month.ToString("D2") + "/" + Convert.ToDateTime(firmdates.ExpiryDate).Day.ToString("D2") + "/" + Convert.ToDateTime(firmdates.ExpiryDate).Year.ToString();

            }
            var apiUrl = savetocasewatchurl;
            //add login data


            var addfClient = new WebClient();
            object rawfile = new
            {
                Accesstoken = "mykase123456789abcdef",
                Email = useremail,
                Memberuserid = memberuserid,
                Password = "MykaSe_PasSsword",
                Mobile = usermobile,
                Dispname = vdisplayname,
                Countryname = countryname,
                StateName = statename,
                Subscriptionstart = startdate,
                Subscriptionend = enddate
            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AddUserMyKase"), "POST", builders);

            try
            {
                var db1 = new LawPracticeEntities();
                var param = apiUrl + "AddCaseCaseWatch=>InsertCaseDetailNewAppendCourt=>/API/Search/AddUserMyKase" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");


            }
            catch
            {

            }

            return resid;
        }

        /// <summary>
        /// Daily cause list model
        /// </summary>
        /// <param name="userid"></param>
        /// <param name="joineduser"></param>
        /// <param name="date"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <param name="IsCasewatchuser"></param>
        /// <param name="loginusername"></param>
        /// <returns></returns>        
        /// 
        public static string MyDailyCauselistModal(string userid, string joineduser, string date, string savetocasewatchurl,int IsCasewatchuser,string loginusername)
        {
            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            dynamic aff1 = 0;
            dynamic aff = 0;

            var apiUrl = savetocasewatchurl;
            //add login data
            string AccessTokenDetail = string.Empty;
            string userIdDetail = string.Empty;
            string IsCaseWatchUser = IsCasewatchuser.ToString();
            if (!String.IsNullOrEmpty(IsCaseWatchUser))
            {
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = loginusername.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = joineduser;
                }
            }

            var addfClient = new WebClient();
            object rawfile = new
            {
                Accesstoken = AccessTokenDetail,
                Userid = userIdDetail,
                Date = date,
                Pageindex = 1,
                Pagesize = 100,
            };
            addfClient.Encoding = System.Text.Encoding.UTF8;
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MyDailyCauselistModal"), "POST", builders);
            try
            {
                var db1 = new LawPracticeEntities();
                var param = apiUrl + "AddCaseCaseWatch=>MyDailyCauselistModal=>/API/Search/MyDailyCauselistModal" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
            }
            catch{}
            return resid;

        }

        /// <summary>
        /// Get doc notes details
        /// </summary>
        /// <param name="caseid"></param>
        /// <param name="userid"></param>
        /// <param name="doctype"></param>
        /// <param name="search"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <returns></returns>        
        /// 
        public static string MyKaseDocNotesDetails(string caseid, string userid, string doctype, string search, string savetocasewatchurl,string AccessTokenDetail)
        {
            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            var apiUrl = savetocasewatchurl;

            var addfClient = new WebClient();
            object rawfile = new
            {
                Accesstoken = AccessTokenDetail,
                userid = userid,
                caseId = caseid,
                doctype = doctype,
                search = search,
            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MyKaseDocNotesDetails"), "POST", builders);
            try
            {
                var db1 = new LawPracticeEntities();
                var param = apiUrl + "AddCaseCaseWatch=>MyKaseDocNotesDetails=>/API/Search/MyKaseDocNotesDetails" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
            }
            catch
            {

            }
            return resid;

        }
        public static string UploadNotesByCaseId(string Caseid, string Userid, string Notes, string savetocasewatchurl, int CWUser, string CWUserIds)
        {
            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            var apiUrl = savetocasewatchurl;
            var addfClient = new WebClient();
            string AccessTokenDetail = string.Empty;
            string userIdDetail = string.Empty;
            string IsCaseWatchUser = CWUser.ToString();
            if (!String.IsNullOrEmpty(IsCaseWatchUser))
            {
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = CWUserIds.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = Userid;
                }
            }
            object rawfile = new
            {
                Accesstoken = AccessTokenDetail,
                userid = userIdDetail,
                caseId = Caseid,
                notes = Notes,

            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/UploadNotesByCaseId"), "POST", builders);
            //try
            //{
            //    var db1 = new LawPracticeEntities();
            //    var param = apiUrl + "AddCaseCaseWatch=>UploadNotesByCaseId=>/API/Search/UploadNotesByCaseId" + "@" + builders;
            //    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
            //}
            //catch
            //{

            //}
            return resid;

        }
        /// <summary>
        /// Remove case notes
        /// </summary>
        /// <param name="Userid"></param>
        /// <param name="Noteid"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <returns></returns>        
        /// 
        public static string RemoveCaseNotes(string Userid, string Noteid, string savetocasewatchurl,string accesstoken)
        {
            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            var apiUrl = savetocasewatchurl;
            var addfClient = new WebClient();
            object rawfile = new
            {
                Accesstoken = accesstoken,
                userid = Userid,
                noteid = Noteid,

            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/RemoveCaseNotesByNoteId"), "POST", builders);
            //try
            //{
            //    var db1 = new LawPracticeEntities();
            //    var param = apiUrl + "AddCaseCaseWatch=>/RemoveCaseNotes=>/API/Search//RemoveCaseNotesByNoteId" + "@" + builders;
            //    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
            //}
            //catch
            //{

            //}
            return resid;

        }

        /// <summary>
        /// Get Alert ON details
        /// </summary>
        /// <param name="userid"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <returns></returns>        
        /// 
        public static string FillAlertOn(string userid, string savetocasewatchurl)
        {
            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            var apiUrl = savetocasewatchurl;
            var addfClient = new WebClient();
            object rawfile = new
            {
                Accesstoken = "mykase123456789abcdef",
                Userid = userid,


            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/FillAlertOn"), "POST", builders);
            //try
            //{
            //    var db1 = new LawPracticeEntities();
            //    var param = apiUrl + "AddCaseCaseWatch=>/FillAlertOn =>/API/Search//FillAlertOn " + "@" + builders;
            //    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
            //}
            //catch
            //{

            //}
            return resid;

        }
        /// <summary>
        /// Get HC case details
        /// </summary>
        /// <param name="userid"></param>
        /// <param name="caseid"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <returns></returns>        
        /// 
        public static string HCCaseDetails(string userid, string caseid, string savetocasewatchurl)
        {
            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            var apiUrl = savetocasewatchurl;
            var addfClient = new WebClient();
            object rawfile = new
            {
                Accesstoken = "mykase123456789abcdef",
                Userid = userid,
                Caseid = caseid,


            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search//HCCaseDetails"), "POST", builders);
            try
            {
                var db1 = new LawPracticeEntities();
                var param = apiUrl + "AddCaseCaseWatch=>/HCCaseDetails =>/API/Search//HCCaseDetails " + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
            }
            catch
            {

            }
            return resid;

        }
        /// <summary>
        /// Add rera case details
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="useremail"></param>
        /// <param name="usermobile"></param>
        /// <param name="username"></param>
        /// <param name="ReraCourt"></param>
        /// <param name="Reracasetype"></param>
        /// <param name="Reracasno"></param>
        /// <param name="Reracaseyear"></param>
        /// <param name="ReraRefNo"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <returns></returns>        
        /// 
        public static string AddReraCase(string firmid, string userid, string useremail, string usermobile, string username, string ReraCourt, string Reracasetype, string Reracasno, string Reracaseyear, string ReraRefNo, string savetocasewatchurl)
        {
            string resid = "";
            string resid2 = "";
            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            var apiUrl = savetocasewatchurl;
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
                Courttype = "7",
                Userid = username,
                reraCourt = ReraCourt,
                cRefNo = ReraRefNo,
                Casetype = Reracasetype,
                Caseno = Reracasno,
                Caseyear = Reracaseyear,
                districtid = ""
            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AddMykaseCasesToCasewatch"), "POST", builders);
            var addfClient2 = new WebClientConnection();
            String caseIdValue = "0";
            try
            {
                var jObj = Newtonsoft.Json.Linq.JObject.Parse(resid);

                caseIdValue = jObj["data"]?[0]?["caseid"]?.ToString() ?? "0";
            }
            catch
            {
                caseIdValue = "0";
            }

            object rawfile1 = new
            {

                Accesstoken = "mykase123456789abcdef",
                caseUniqueId = caseIdValue,
                Firmid = firmid,
                Userid = username
            };
            addfClient2.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders1 = JsonConvert.SerializeObject(rawfile1);
            addfClient2.UploadString(new Uri(apiUrl + "/API/Search/UpsertCreatedByUserId"), "POST", builders1);
            try
            {
                var db1 = new LawPracticeEntities();
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
                return resid;
            }
            else
            {
                return resid;
            }


        }
        /// <summary>
        /// Get Rera case list
        /// </summary>
        /// <param name="Firmids"></param>
        /// <param name="loginuserid"></param>
        /// <param name="userid"></param>
        /// <param name="ReraCourt"></param>
        /// <param name="Search"></param>
        /// <param name="SortValue"></param>
        /// <param name="PageSize"></param>
        /// <param name="PageIndex"></param>
        /// <param name="Datefromvalue"></param>
        /// <param name="Datetovalue"></param>
        /// <param name="usercaseId"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <returns></returns>        
        public static string GetReracaseList(string Firmids, string loginuserid, string userid, string ReraCourt, string Search, string SortValue, string PageSize,
            string PageIndex, string Datefromvalue, string Datetovalue, string usercaseId, string savetocasewatchurl,int IsCWUser,string CWUserId)
        {

            string resid = "";
            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            var apiUrl = savetocasewatchurl;
            var db = new LawPracticeEntities();

            string joined = "";
            string matteridlist = "";
            joined = joined.TrimEnd(',');
            joined = joined.Replace(",", "','");
            try
            {
                joined = db.usp_GetUnderUserListById(Firmids, loginuserid, matteridname).FirstOrDefault();
            }
            catch (Exception) { }

            matteridlist = joined.ToString();
            string strapiuser = matteridlist;
            //For CWLive User Migration
            string AccessTokenDetail = string.Empty;
            string userIdDetail = string.Empty;
            if (IsCWUser == 1)
            {
                userIdDetail = CWUserId.ToString();
                AccessTokenDetail = "internal";
            }
            else
            {
                AccessTokenDetail = "mykase123456789abcdef";
                userIdDetail = strapiuser;
            }
            var addfClient = new WebClient();
            object rawfile = new
            {
                Accesstoken = AccessTokenDetail,
                Userid = userIdDetail,
                reraCourt = ReraCourt,
                flag = SortValue,
                UserCaseId = usercaseId,
                sort = "",
                Taggedname = "",
                alertsort = "",
                Searchtext = Search,
                Datefrom = "",
                Dateto = "",
                istype = "",
                Pageindex = PageIndex,
                Pagesize = PageSize

            };
            try
            {
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search//MyReraCases"), "POST", builders);

                var db1 = new LawPracticeEntities();
                var param = apiUrl + "AddCaseCaseWatch=>/GetReracaseList =>/API/Search//MyReraCases " + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
            }
            catch (Exception) { }
            return resid;
        }
        /// <summary>
        /// Get rera case order list
        /// </summary>
        /// <param name="userid"></param>
        /// <param name="caseId"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <returns></returns>        
       public static string GetReracaseOrderList(string userid, string caseId, string savetocasewatchurl)
        {
            string resid = "";
            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            var apiUrl = savetocasewatchurl;
            var addfClient = new WebClient();
            object rawfile = new
            {
                Accesstoken = "mykase123456789abcdef",
                Userid = userid,
                casids = caseId

            };
            try
            {
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search//ShowReraCaseOrdersById"), "POST", builders);

                var db1 = new LawPracticeEntities();
                var param = apiUrl + "AddCaseCaseWatch=>/GetReracaseOrderList =>/API/Search//GetReracaseOrderList " + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
            }
            catch (Exception) { }
            return resid;

        }
        /// <summary>
        /// Upload rera note by case id
        /// </summary>
        /// <param name="Caseid"></param>
        /// <param name="Userid"></param>
        /// <param name="Notes"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <returns></returns>        
        /// 
        public static string ReraUploadNotesByCaseId(string Caseid, string Userid, string Notes, string savetocasewatchurl)
        {
            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            var apiUrl = savetocasewatchurl;
            var addfClient = new WebClient();
            object rawfile = new
            {
                Accesstoken = "mykase123456789abcdef",
                userid = Userid,
                CaseId = Caseid,
                Notes = Notes,

            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/InsertReraCaseNoteDetailByUser"), "POST", builders);
            try
            {
                var db1 = new LawPracticeEntities();
                var param = apiUrl + "AddCaseCaseWatch=>ReraUploadNotesByCaseId=>/API/Search/InsertReraCaseNoteDetailByUser" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
            }
            catch
            {

            }
            return resid;

        }
        /// <summary>
        /// Save case alert user for rera
        /// </summary>
        /// <param name="auserid"></param>
        /// <param name="userid"></param>
        /// <param name="userfirmid"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <param name="cwcaseid"></param>
        /// <param name="IsCWUser"></param>
        /// <param name="CWUserId"></param>
        /// <returns></returns>        
        /// 
        public static string SaveCaseAlertUserForRera(string auserid, string userid, string userfirmid, string savetocasewatchurl, string cwcaseid,int IsCWUser,string CWUserId)
        {
            var db = new LawPracticeEntities();
            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            string AccessTokenDetail = string.Empty;
            string userIdDetail = string.Empty;
            string memberuserids= string.Empty;
            string IsCaseWatchUser = IsCWUser.ToString();
            if (!String.IsNullOrEmpty(IsCaseWatchUser))
            {
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = CWUserId.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = matteridname + userid;
                }
            }
            string[] values = auserid.Split(',');
            var vdisplayname = "";
            string status2 = "";
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
                }
                //check member userid is CW User
                if (getuseremailmobile.IsCaseWatch == 1)
                {
                    memberuserids = getuseremailmobile.UserName;
                    userIdDetail = CWUserId.ToString();
                }
                else
                {
                    memberuserids = matteridname + values[i];
                    userIdDetail = matteridname + userid;
                }

                dynamic aff1 = 0;
                dynamic aff = 0;
                var apiUrl = savetocasewatchurl;
                //add login data
                var addfClient = new WebClient();
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    userId = userIdDetail,
                    email = getuseremailmobile.EmailId,
                    memberuserid = memberuserids,
                    Password = "MykaSe_PasSsword",
                    Mobile = getuseremailmobile.cmobile,
                    Dispname = vdisplayname,

                };

                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AddMyKaseClientMember"), "POST", builders);

                try
                {
                    var db1 = new LawPracticeEntities();
                    var param = apiUrl + "AddCaseCaseWatch=>SaveCaseAlertUserForRera=>/API/Search/AddMyKaseClientMember" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");

                }
                catch { }
                dynamic data1 = JObject.Parse(resid);
                string status = data1.Status;
                string Message = data1.Message;
                if (status == "True")
                {
                    string dbstatususerid = "";
                    dbstatususerid = data1.data[0].UserId;
                    //insert login into mykase
                    //add login data
                    var addfClient2 = new WebClient();
                    object rawfile2 = new
                    {
                        Accesstoken = AccessTokenDetail,
                        userId = userIdDetail,
                        memberuserid = dbstatususerid,
                        userCaseId = cwcaseid,

                    };

                    addfClient2.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders2 = JsonConvert.SerializeObject(rawfile2);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    string resid2 = addfClient2.UploadString(new Uri(apiUrl + "/API/Search/MapReraCasetoUser"), "POST", builders2);

                    dynamic data2 = JObject.Parse(resid2);
                    status2 = data2.Status;
                    string Message2 = data2.Message;
                    try
                    {
                        var db1 = new LawPracticeEntities();
                        var param = apiUrl + "AddCaseCaseWatch=>SaveCaseAlertUserForRera=>/API/Search/MapReraCasetoUser" + "@" + builders2;
                        db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");


                    }
                    catch { }

                }
            }
            return status2;
        }
        /// <summary>
        /// Case Watch Alert User List For Rera
        /// </summary>
        /// <param name="userid"></param>
        /// <param name="userfirmid"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <param name="cwcaseid"></param>
        /// <param name="IsCWUser"></param>
        /// <param name="CWUserId"></param>
        /// <returns></returns>        
        /// 
        public static string CaseWatchAlertUserListForRera(string userid, string userfirmid, string savetocasewatchurl, string cwcaseid,int IsCWUser,string CWUserId)
        {
            var db = new LawPracticeEntities();
            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            dynamic aff1 = 0;
            dynamic aff = 0;
            var apiUrl = savetocasewatchurl;
            //add login data
            string AccessTokenDetail = string.Empty;
            string userIdDetail = string.Empty;
            string IsCaseWatchUser = IsCWUser.ToString();
            if (!String.IsNullOrEmpty(IsCaseWatchUser))
            {
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = CWUserId.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = matteridname + userid;
                }
            }
            var addfClient = new WebClient();
            object rawfile = new
            {
                Accesstoken = AccessTokenDetail,
                userId = userIdDetail,
                UserCaseId = cwcaseid,

            };

            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MykaseUsersOfAdminUserRera"), "POST", builders);

            try
            {
                var db1 = new LawPracticeEntities();
                var param = apiUrl + "AddCaseCaseWatch=>CaseWatchAlertUserListForRera=>/API/Search/MykaseUsersOfAdminUserRera" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
            }
            catch { }
            return resid;
        }
        /// <summary>
        /// Remove casewatch alert user for rera
        /// </summary>
        /// <param name="auserid"></param>
        /// <param name="userid"></param>
        /// <param name="userfirmid"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <param name="cwcaseid"></param>
        /// <returns></returns>       
        /// 
        public static string RemoveCaseWatchAlertUserForRera(string auserid, string userid, string userfirmid, string savetocasewatchurl, string cwcaseid)
        {

            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            dynamic aff1 = 0;
            dynamic aff = 0;

            var apiUrl = savetocasewatchurl;
            //add login data
            var addfClient = new WebClient();
            object rawfile = new
            {
                Accesstoken = "mykase123456789abcdef",
                userId = matteridname + userid,
                memberuserid = auserid,
                userCaseId = cwcaseid,
            };

            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/RemoveMappedCaseRera"), "POST", builders);
            try
            {
                var db1 = new LawPracticeEntities();
                var param = apiUrl + "AddCaseCaseWatch=>RemoveCaseWatchAlertUserForRera=>/API/Search/RemoveMappedCaseRera" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");


            }
            catch { }
            dynamic data1 = JObject.Parse(resid);
            string status = data1.Status;
            string Message = data1.Message;
            return status;
        }
        /// <summary>
        /// For new provisons of add case to CW with Assign
        /// </summary>
        /// <param name="addcaseobj"></param>
        /// <param name="iflag"></param>
        /// <param name="useremail"></param>
        /// <param name="usermobile"></param>
        /// <param name="userfirmid"></param>
        /// <param name="userid"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <param name="caseid"></param>
        /// <returns></returns>       
        public static string InsertCaseDetailNew_1(AddCaseObject1 addcaseobj, int iflag, string useremail, string usermobile, 
            string userfirmid, string userid, string savetocasewatchurl, string caseid,int IsCWUser,string CWUserId)
        {
            string ds = "";
            string resid = "";
            dynamic aff1 = 0;
            dynamic aff = 0;
            var vdisplayname = "";
            var countryname = "";
            var statename = "";
            var firmadminuserid = "";
            var startdate = "";
            var enddate = "";
            var firmadminusername = "";
            var db = new LawPracticeEntities();

            var getuserdetails = db.usp_GetUserDetailByUserID(userfirmid, userid).FirstOrDefault();
            if (getuserdetails != null)
            {
                vdisplayname = getuserdetails.Name;
                countryname = getuserdetails.country;
                statename = getuserdetails.cstate;
                firmadminuserid = getuserdetails.FirmAdminuserId;
                firmadminusername = getuserdetails.FirmAdminUserName.ToString();
            }

            var firmdates = db.usp_wf_GetFirmDetailByID(Guid.Parse(userfirmid)).FirstOrDefault();
            if (firmdates != null)
            {
                startdate = Convert.ToDateTime(firmdates.SubscriptionStartDate).Month.ToString("D2") + "/" + Convert.ToDateTime(firmdates.SubscriptionStartDate).Day.ToString("D2") + "/" + Convert.ToDateTime(firmdates.SubscriptionStartDate).Year.ToString();
                enddate = Convert.ToDateTime(firmdates.ExpiryDate).Month.ToString("D2") + "/" + Convert.ToDateTime(firmdates.ExpiryDate).Day.ToString("D2") + "/" + Convert.ToDateTime(firmdates.ExpiryDate).Year.ToString();

            }
            var apiUrl = savetocasewatchurl;
            //add login data
            var starttime = DateTime.Now;
            string AccessTokenDetail = string.Empty;
            string userIdDetail = string.Empty;
            string FirmuserIdDetail = string.Empty;
            string IsCaseWatchUser = IsCWUser.ToString();
            if (IsCaseWatchUser == "1")
            {
                userIdDetail = CWUserId.ToString();
                FirmuserIdDetail = firmadminusername;
                AccessTokenDetail = "internal";
            }
            else
            {
                if(getuserdetails.IsAdminCW==1)
                {
                    userIdDetail = addcaseobj.Username.ToString();
                    FirmuserIdDetail = firmadminusername;
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = addcaseobj.Username;
                    FirmuserIdDetail = WebConfigurationManager.AppSettings["matteridname"] + firmadminuserid;
                }

            }
            var addfClient = new WebClientConnection();
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
                userid = FirmuserIdDetail,
                Casetype = addcaseobj.Casetype,
                Caseno = addcaseobj.Caseno.Trim(),
                Caseyear = addcaseobj.Caseyear,
                DiaryNo = addcaseobj.Diaryno.Trim(),
                Court = addcaseobj.Court,
                FileNo = "",
                BenchID = addcaseobj.BenchID,
                SideID = addcaseobj.SideID,
                courttitle = addcaseobj.Courttitle,
                stampreg = addcaseobj.Stampreg,
                iflag = 0,
                districtid = addcaseobj.District,
                stateId = addcaseobj.TriState,
                suffix = addcaseobj.Suffix
            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            try
            {
                resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AddMykaseCasesToCasewatch"), "POST", builders);
                var addfClient2 = new WebClientConnection();
                String caseIdValue = "0";
                try
                {
                    var jObj = Newtonsoft.Json.Linq.JObject.Parse(resid);

                    caseIdValue = jObj["data"]?[0]?["caseid"]?.ToString() ?? "0";
                }
                catch
                {
                    caseIdValue = "0";
                }

                object rawfile1 = new
                {

                    Accesstoken = "mykase123456789abcdef",
                    caseUniqueId = caseIdValue,
                    Firmid = userfirmid,
                    Userid = userIdDetail
                };
                addfClient2.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders1 = JsonConvert.SerializeObject(rawfile1);
                addfClient2.UploadString(new Uri(apiUrl + "/API/Search/UpsertCreatedByUserId"), "POST", builders1);
            }
            catch(Exception ex)
            {
                LogService("/API/Search/AddMykaseCasesToCasewatch" + ex.Message + "&" + ex.InnerException + "starttime" + starttime + "Endtime" + DateTime.Now);
            }
            dynamic data = JObject.Parse(resid);
            string status = data.Status;
            string Message = data.Message;

            if (status == "True")
            {
                ds = resid;
                if (caseid != "")
                {
                    //insert login into mykase
                    var insertusermap = db.sp_AddUserNeWCashwatch(userfirmid, userid, addcaseobj.Username);
                   
                    //------------------------for provisions to auto assigned------------------------//
                    try
                    {
                        string dbstatus = "";
                        dynamic data2 = JObject.Parse(ds);
                        dbstatus = data2.data[0].dbStatus;
                        // string newcaseid = data2.caseid;
                        List<usp_UserlistbycaseIdForAlerts_Result> list = new List<usp_UserlistbycaseIdForAlerts_Result>();
                        list = db.usp_UserlistbycaseIdForAlerts(userfirmid, userid, caseid).ToList();
                        if (list.Count >0)
                        {
                            string auserid = string.Join(",", list.Select(x => x.auser));
                            SaveCaseAlertUser_update(auserid, userid, userfirmid, savetocasewatchurl, dbstatus, IsCWUser, CWUserId);
                        }

                    }
                    catch (Exception) { }
                    //------------------------End---------------------------------------------------//

                }
                return ds;
            }
            else
            {
                ds = resid;
                return ds;
            }
        }
        /// <summary>
        /// Insert Case Detail New Append Court 
        /// </summary>
        /// <param name="addcaseobj"></param>
        /// <param name="iflag"></param>
        /// <param name="useremail"></param>
        /// <param name="usermobile"></param>
        /// <param name="userfirmid"></param>
        /// <param name="userid"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <param name="caseId"></param>
        /// <returns></returns>       
        /// 
        public static string InsertCaseDetailNewAppendCourt_1(AddCaseObject1 addcaseobj, int iflag, string useremail, string usermobile, 
            string userfirmid, string userid, string savetocasewatchurl, string caseId,int IsCWUser,string CWUserId)
        {
            string ds = "";
            dynamic aff1 = 0;
            dynamic aff = 0;
            var vdisplayname = "";
            var countryname = "";
            var statename = "";
            var firmadminuserid = "";
            var startdate = "";
            var enddate = "";
            var firmadminusername = "";
            var db = new LawPracticeEntities();

            var getuserdetails = db.usp_GetUserDetailByUserID(userfirmid, userid).FirstOrDefault();
            if (getuserdetails != null)
            {
                vdisplayname = getuserdetails.Name;
                countryname = getuserdetails.country;
                statename = getuserdetails.cstate;
                firmadminuserid = getuserdetails.FirmAdminuserId;
                firmadminusername = getuserdetails.FirmAdminUserName.ToString();
            }

            var firmdates = db.usp_wf_GetFirmDetailByID(Guid.Parse(userfirmid)).FirstOrDefault();
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
                FirmuserIdDetail= firmadminusername;
                AccessTokenDetail = "internal";
            }
            else
            {
                if (getuserdetails.IsAdminCW == 1)
                {
                    userIdDetail = addcaseobj.Username.ToString();
                    FirmuserIdDetail = firmadminusername;
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = addcaseobj.Username;
                    FirmuserIdDetail = WebConfigurationManager.AppSettings["matteridname"] + firmadminuserid;
                }
                
            }
            var apiUrl = savetocasewatchurl;
            //add login data
            var addfClient = new WebClientConnection();
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
                userid = FirmuserIdDetail,
               // userid = addcaseobj.Username,
                courttype = "5",
                Caseno = addcaseobj.Caseno.Trim(),
                Caseyear = addcaseobj.Caseyear,
                Court = addcaseobj.Court,
                casename = addcaseobj.Casename,
                mhearingdate = addcaseobj.Nexthearingdate,
                madvocatename = addcaseobj.Advocate,
                mstatus = addcaseobj.Status,

            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AddMykaseCasesToCasewatch"), "POST", builders);

            dynamic data = JObject.Parse(resid);
            string status = data.Status;
            string Message = data.Message;
            string dataval = data.data;
            var addfClient2 = new WebClientConnection();
            String caseIdValue = "0";
            try
            {
                var jObj = Newtonsoft.Json.Linq.JObject.Parse(resid);

                caseIdValue = data.data.caseid;
            }
            catch
            {
                caseIdValue = "0";
            }

            object rawfile1 = new
            {

                Accesstoken = "mykase123456789abcdef",
                caseUniqueId = caseIdValue,
                Firmid = firmadminuserid,
                Userid = userIdDetail
            };
            addfClient2.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders1 = JsonConvert.SerializeObject(rawfile1);
            addfClient2.UploadString(new Uri(apiUrl + "/API/Search/UpsertCreatedByUserId"), "POST", builders1);

            if (status == "True")
            {
                ds = resid;
                if (caseId != "")
                {
                    //insert login into mykase
                    var insertusermap = db.sp_AddUserNeWCashwatch(userfirmid, userid, addcaseobj.Username);
                    //------------------------for provisions to auto assigned------------------------//
                    try
                    {
                        string dbstatus = "";
                        dynamic data2 = JObject.Parse(ds);
                        dbstatus = data2.caseid;

                        List<usp_UserlistbycaseIdForAlerts_Result> list = new List<usp_UserlistbycaseIdForAlerts_Result>();
                        list = db.usp_UserlistbycaseIdForAlerts(userfirmid, userid, caseId).ToList();
                        if (list.Count > 0)
                        {
                            string auserid = string.Join(",", list.Select(x => x.auser));
                            SaveCaseAlertUser_update(auserid, userid, userfirmid, savetocasewatchurl, dbstatus, IsCWUser, CWUserId);
                        }

                    }
                    catch (Exception) { }
                    //------------------------End---------------------------------------------------//
                }
                 return ds;
            }
            else
            {
                ds = resid;
                return ds;
            }
        }

        /// <summary>
        /// Insert district CNR
        /// </summary>
        /// <param name="userfirmid"></param>
        /// <param name="userid"></param>
        /// <param name="caseid"></param>
        /// <param name="Cnrno"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <param name="useremail"></param>
        /// <param name="usermobile"></param>
        /// <param name="Username"></param>
        /// <param name="caseId"></param>
        /// <param name="IsCWUser"></param>
        /// <param name="CWUserId"></param>
        /// <returns></returns>        
        /// 
        public static string InsertDistrictCNR_1(string userfirmid, string userid, string caseid, string Cnrno, string savetocasewatchurl, 
            string useremail, string usermobile, string Username, string caseId,int IsCWUser,string CWUserId)
        {

            string ds = "";
            string resid = "";
            dynamic aff1 = 0;
            dynamic aff = 0;
            var vdisplayname = "";
            var countryname = "";
            var statename = "";
            var firmadminuserid = "";
            var startdate = "";
            var enddate = "";
            var firmadminusername = "";
            var db = new LawPracticeEntities();

            var getuserdetails = db.usp_GetUserDetailByUserID(userfirmid, userid).FirstOrDefault();
            if (getuserdetails != null)
            {
                vdisplayname = getuserdetails.Name;
                countryname = getuserdetails.country;
                statename = getuserdetails.cstate;
                firmadminuserid = getuserdetails.FirmAdminuserId;
                firmadminusername = getuserdetails.FirmAdminUserName.ToString();
            }

            var firmdates = db.usp_wf_GetFirmDetailByID(Guid.Parse(userfirmid)).FirstOrDefault();
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
                FirmuserIdDetail = firmadminusername;
                AccessTokenDetail = "internal";
            }
            else
            {
                if(getuserdetails.IsAdminCW==1)
                {
                    userIdDetail = CWUserId.ToString();
                    FirmuserIdDetail = getuserdetails.FirmAdminUserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = Username;
                    FirmuserIdDetail = WebConfigurationManager.AppSettings["matteridname"] + firmadminuserid;
                }

            }
            var apiUrl = savetocasewatchurl;
            //add login data
            var addfClient = new WebClientConnection();
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
                userid = FirmuserIdDetail,
                cnrno = Cnrno.Trim(),

            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            var starttime = DateTime.Now;
            try
            {
                resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AddMykaseCasesToCasewatch"), "POST", builders);
                var addfClient2 = new WebClientConnection();
                String caseIdValue = "0";
                try
                {
                    var jObj = Newtonsoft.Json.Linq.JObject.Parse(resid);

                    caseIdValue = jObj["data"]?[0]?["caseid"]?.ToString() ?? "0";
                }
                catch
                {
                    caseIdValue = "0";
                }

                object rawfile1 = new
                {

                    Accesstoken = "mykase123456789abcdef",
                    caseUniqueId = caseIdValue,
                    Firmid = userfirmid,
                    Userid = userIdDetail
                };
                addfClient2.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders1 = JsonConvert.SerializeObject(rawfile1);
                addfClient2.UploadString(new Uri(apiUrl + "/API/Search/UpsertCreatedByUserId"), "POST", builders1);
            }
            catch (Exception ex)
            {
                LogService("/API/Search/AddMykaseCasesToCasewatch" + ex.Message + "&" + ex.InnerException+ "starttime"+ starttime+"Endtime"+DateTime.Now);
            }
           
            dynamic data = JObject.Parse(resid);
            string status = data.Status;
            string Message = data.Message;

            if (status == "True")
            {
                ds = resid;
                if (caseId != "")
                {
                    //insert login into mykase
                    var insertusermap = db.sp_AddUserNeWCashwatch(userfirmid, userid, WebConfigurationManager.AppSettings["matteridname"] + userid);
                    //------------------------for provisions to auto assigned------------------------//
                    try
                    {
                        string dbstatus = "";
                        dynamic data2 = JObject.Parse(ds);
                        dbstatus = data2.data[0].dbStatus;

                        List<usp_UserlistbycaseIdForAlerts_Result> list = new List<usp_UserlistbycaseIdForAlerts_Result>();
                        list = db.usp_UserlistbycaseIdForAlerts(userfirmid, userid, caseId).ToList();
                        if (list.Count > 0)
                        {
                            string auserid = string.Join(",", list.Select(x => x.auser));
                            SaveCaseAlertUser_update(auserid, userid, userfirmid, savetocasewatchurl, dbstatus, IsCWUser, CWUserId);
                        }
                    }
                    catch (Exception) { }
                    //------------------------End---------------------------------------------------//
                }
                return ds;
            }
            else
            {
                ds = resid;
                return ds;
            }
        }


        /// <summary>
        /// Add rera case
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="useremail"></param>
        /// <param name="usermobile"></param>
        /// <param name="username"></param>
        /// <param name="ReraCourt"></param>
        /// <param name="Reracasetype"></param>
        /// <param name="Reracasno"></param>
        /// <param name="Reracaseyear"></param>
        /// <param name="ReraRefNo"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <param name="caseId"></param>
        /// <returns></returns>        
        /// 
        public static string AddReraCase_1(string firmid, string userid, string useremail, string usermobile, string username, 
            string ReraCourt, string Reracasetype, string Reracasno, string Reracaseyear, string ReraRefNo, 
            string savetocasewatchurl, string caseId,int IsCwUser,string CWUserId)
        {
            string resid = "";
            string ds = "";
            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            var apiUrl = savetocasewatchurl;
            dynamic aff1 = 0;
            dynamic aff = 0;
            var vdisplayname = "";
            var countryname = "";
            var statename = "";
            var firmadminuserid = "";
            var startdate = "";
            var enddate = "";
            var db = new LawPracticeEntities();
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
            string IsCaseWatchUser = IsCwUser.ToString();
            if (IsCaseWatchUser == "1")
            {
                userIdDetail = CWUserId.ToString();
                FirmuserIdDetail = firmadminusername;
                AccessTokenDetail = "internal";
            }
            else
            {
                if (getuserdetails.IsAdminCW == 1)
                {
                    userIdDetail = username.ToString();
                    FirmuserIdDetail = firmadminusername;
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = username;
                    FirmuserIdDetail = WebConfigurationManager.AppSettings["matteridname"] + firmadminuserid;
                }

            }
            var addfClient = new WebClientConnection();
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
                Courttype = "7",
                userid = FirmuserIdDetail,
                reraCourt = ReraCourt,
                cRefNo = ReraRefNo,
                Casetype = Reracasetype,
                Caseno = Reracasno,
                Caseyear = Reracaseyear,
                districtid = ""
            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AddMykaseCasesToCasewatch"), "POST", builders);
            dynamic data = JObject.Parse(resid);
            string status = data.Status;
            string Message = data.Message;
            var addfClient2 = new WebClientConnection();
            String caseIdValue = "0";
            try
            {
                var jObj = Newtonsoft.Json.Linq.JObject.Parse(resid);

                caseIdValue = data.data.caseid;
            }
            catch
            {
                caseIdValue = "0";
            }

            object rawfile1 = new
            {

                Accesstoken = "mykase123456789abcdef",
                caseUniqueId = caseIdValue,
                Firmid = firmid,
                Userid = userIdDetail
            };
            addfClient2.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders1 = JsonConvert.SerializeObject(rawfile1);
            addfClient2.UploadString(new Uri(apiUrl + "/API/Search/UpsertCreatedByUserId"), "POST", builders1);
            if (status == "True")
            {
                ds = resid;
                if (caseId != "")
                {
                    //insert login into mykase
                    var insertusermap = db.sp_AddUserNeWCashwatch(firmid, userid, username);

                    try
                    {
                        string dbstatus = "";
                        dynamic data2 = JObject.Parse(ds);
                        dbstatus = data2.usercaseid;
                        // string newcaseid = data2.caseid;

                        List<usp_UserlistbycaseIdForAlerts_Result> list = new List<usp_UserlistbycaseIdForAlerts_Result>();
                        list = db.usp_UserlistbycaseIdForAlerts(firmid, userid, caseId).ToList();
                        if (list != null)
                        {
                            string auserid = string.Join(",", list.Select(x => x.auser));
                            SaveCaseAlertUserRera_update(auserid, userid, firmid, savetocasewatchurl, dbstatus);
                        }
                    }
                    catch (Exception) { }
                    //------------------------End---------------------------------------------------//
                }
                return ds;

            }
            else
            {
                ds = resid;
                return ds;
            }


        }

        /// <summary>
        /// Add/Update rera case alert user
        /// </summary>
        /// <param name="auserid"></param>
        /// <param name="userid"></param>
        /// <param name="userfirmid"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <param name="cwcaseid"></param>
        /// <returns></returns>        
        /// 
        public static string SaveCaseAlertUserRera_update(string auserid, string userid, string userfirmid, string savetocasewatchurl, string cwcaseid)
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
                string resid2 = addfClient2.UploadString(new Uri(apiUrl + "/API/Search/MapReraCasetoUserList"), "POST", builders2);
                dynamic data2 = JObject.Parse(resid2);
                status2 = data2.Status;
                string Message2 = data2.Message;

            }
            catch (Exception ex) { }
            return status2;
            //  return "false";
        }
        /// <summary>
        /// Search add case to tracking
        /// </summary>
        /// <param name="Cnrnos"></param>
        /// <param name="Casetypes"></param>
        /// <param name="Casenos"></param>
        /// <param name="Caseyears"></param>
        /// <param name="DiaryNos"></param>
        /// <param name="Courts"></param>
        /// <param name="BenchIDs"></param>
        /// <param name="StateIds"></param>
        /// <param name="Districtids"></param>
        /// <param name="Courttypes"></param>
        /// <param name="casenames"></param>
        /// <param name="mhearingdates"></param>
        /// <param name="madvocatenames"></param>
        /// <param name="Courtcompestbtypes"></param>
        /// <param name="Courtcompestbcourts"></param>
        /// <param name="suffix"></param>
        /// <param name="iflag"></param>
        /// <param name="useremail"></param>
        /// <param name="usermobile"></param>
        /// <param name="userfirmid"></param>
        /// <param name="userid"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <param name="Username"></param>
        /// <returns></returns>        
        /// 
         public static string SearchAddCaseToTracking(string Cnrnos, string Casetypes, string Casenos, string Caseyears, string Courts,
            string BenchIDs, string StateIds, string Districtids, string Courttypes, string casenames,
            string madvocatenames, string Courtcompestbtypes, string Courtcompestbcourts, string suffix, int iflag,
            string useremail, string usermobile, string userfirmid, string userid, string savetocasewatchurl, string Username, string stampReg, string sideId, int  IsCWUser, string  CWUserId)
        {
            string ds = "";
            string resid = "";
            dynamic aff1 = 0;
            dynamic aff = 0;
            var vdisplayname = "";
            var countryname = "";
            var statename = "";
            var firmadminuserid = "";
            var startdate = "";
            var enddate = "";
            var accessToken = "";
            var userIdDetail = "";
            var FirmuserIdDetail = "";
            var firmadminusername = "";
            var db = new LawPracticeEntities();
     
            var getuserdetails = db.usp_GetUserDetailByUserID(userfirmid, userid).FirstOrDefault();
            if (getuserdetails != null)
            {
                
                vdisplayname = getuserdetails.Name;
                countryname = getuserdetails.country;
                statename = getuserdetails.cstate;
                firmadminuserid = getuserdetails.FirmAdminuserId;
                firmadminusername = getuserdetails.FirmAdminUserName.ToString();

            }


            if (IsCWUser == 1)
            {
                userIdDetail = CWUserId.ToString();
                FirmuserIdDetail = firmadminusername;
                accessToken = "internal";
            }
            else
            {
                if (getuserdetails.IsAdminCW == 1)
                {
                    userIdDetail = CWUserId.ToString();
                    FirmuserIdDetail = getuserdetails.FirmAdminUserName.ToString();
                    accessToken = "internal";
                }
                else
                {
                    accessToken = "mykase123456789abcdef";
                    userIdDetail = Username;
                    FirmuserIdDetail = WebConfigurationManager.AppSettings["matteridname"] + firmadminuserid;
                }

            }


            var firmdates = db.usp_wf_GetFirmDetailByID(Guid.Parse(userfirmid)).FirstOrDefault();
            if (firmdates != null)
            {
                startdate = Convert.ToDateTime(firmdates.SubscriptionStartDate).Month.ToString("D2") + "/" + Convert.ToDateTime(firmdates.SubscriptionStartDate).Day.ToString("D2") + "/" + Convert.ToDateTime(firmdates.SubscriptionStartDate).Year.ToString();
                enddate = Convert.ToDateTime(firmdates.ExpiryDate).Month.ToString("D2") + "/" + Convert.ToDateTime(firmdates.ExpiryDate).Day.ToString("D2") + "/" + Convert.ToDateTime(firmdates.ExpiryDate).Year.ToString();

            }
            var apiUrl = savetocasewatchurl;
            //add login data
            var starttime = DateTime.Now;
   
            var addfClient = new WebClientConnection();
            addfClient.Encoding = System.Text.Encoding.UTF8;
            object rawfile = new
            {

                Accesstoken = accessToken,
                Email = useremail,
                Memberuserid = userIdDetail,
                Password = "MykaSe_PasSsword",
                Mobile = usermobile,
                Dispname = vdisplayname,
                Countryname = countryname,
                StateName = statename,
                Subscriptionstart = startdate,
                Subscriptionend = enddate,
                Cnrno= Cnrnos,
                Casetype = Casetypes,
                Caseno = Casenos.Trim(),
                Caseyear = Caseyears,
                Court = Courts,
                BenchID = BenchIDs,
                SideID = sideId,
                courttitle = "",
                stampreg = stampReg,
                iflag = 0,
                StateId = StateIds,
                Districtid = Districtids,
                Courttype = Courttypes,
                casename = casenames,
                madvocatename = madvocatenames,
                mstatus ="",
                Courtcompestbtype= Courtcompestbtypes,
                Courtcompestbcourt = Courtcompestbcourts,
                suffix = suffix,
                Userid = FirmuserIdDetail,
            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);

            try
            {
                resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AddMykaseFetchImidiatecasesToCaseWatch"), "POST", builders);
                var addfClient2 = new WebClientConnection();
                String caseIdValue = "0";
                try
                {
                    var jObj = Newtonsoft.Json.Linq.JObject.Parse(resid);

                    caseIdValue = jObj["data"]?[0]?["caseid"]?.ToString() ?? "0";
                }
                catch
                {
                    caseIdValue = "0";
                }

                object rawfile1 = new
                {

                    Accesstoken = accessToken,
                    caseUniqueId = caseIdValue,
                    Firmid = userfirmid,
                    Userid = userIdDetail
                };
                addfClient2.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders1 = JsonConvert.SerializeObject(rawfile1);
                addfClient2.UploadString(new Uri(apiUrl + "/API/Search/UpsertCreatedByUserId"), "POST", builders1);
            }
            catch (Exception ex)
            {
                LogService("/API/Search/AddMykaseFetchImidiatecasesToCaseWatch" + ex.Message + "&" + ex.InnerException + "starttime" + starttime + "Endtime" + DateTime.Now);
            }
            dynamic data = JObject.Parse(resid);
            string status = data.Status;
            string Message = data.Message;
            // string dataval = data.data;

            if (status == "True")
            {
                //insert login into mykase
                var insertusermap = db.sp_AddUserNeWCashwatch(userfirmid, userid, Username);
                ds = resid;
                return ds;
            }
            else
            {
                ds = resid;
                return ds;
            }
        }
        public static string SearchAddCaseToTrackingRERH(string Cnrnos, string Casetypes, string Casenos, string Caseyears, string Courts,
            string BenchIDs, string StateIds, string Districtids, string Courttypes, string casenames,
            string madvocatenames, string Courtcompestbtypes, string Courtcompestbcourts, string suffix, int iflag,
            string useremail, string usermobile, string userfirmid, string userid, string savetocasewatchurl, string Username, string stampReg, string sideId, int IsCWUser, string CWUserId, string Appres, string appealNo,
                         string District, string CourtType, string courtNameR, string Status)
        {
            string ds = "";
            string resid = "";
            dynamic aff1 = 0;
            dynamic aff = 0;
            var vdisplayname = "";
            var countryname = "";
            var statename = "";
            var firmadminuserid = "";
            var startdate = "";
            var enddate = "";
            var accessToken = "";
            var userIdDetail = "";
            var FirmuserIdDetail = "";
            var firmadminusername = "";
            var db = new LawPracticeEntities();

            var getuserdetails = db.usp_GetUserDetailByUserID(userfirmid, userid).FirstOrDefault();
            if (getuserdetails != null)
            {

                vdisplayname = getuserdetails.Name;
                countryname = getuserdetails.country;
                statename = getuserdetails.cstate;
                firmadminuserid = getuserdetails.FirmAdminuserId;
                firmadminusername = getuserdetails.FirmAdminUserName.ToString();

            }


            if (IsCWUser == 1)
            {
                userIdDetail = CWUserId.ToString();
                FirmuserIdDetail = firmadminusername;
                accessToken = "internal";
            }
            else
            {
                if (getuserdetails.IsAdminCW == 1)
                {
                    userIdDetail = CWUserId.ToString();
                    FirmuserIdDetail = getuserdetails.FirmAdminUserName.ToString();
                    accessToken = "internal";
                }
                else
                {
                    accessToken = "mykase123456789abcdef";
                    userIdDetail = Username;
                    FirmuserIdDetail = WebConfigurationManager.AppSettings["matteridname"] + firmadminuserid;
                }

            }


            var firmdates = db.usp_wf_GetFirmDetailByID(Guid.Parse(userfirmid)).FirstOrDefault();
            if (firmdates != null)
            {
                startdate = Convert.ToDateTime(firmdates.SubscriptionStartDate).Month.ToString("D2") + "/" + Convert.ToDateTime(firmdates.SubscriptionStartDate).Day.ToString("D2") + "/" + Convert.ToDateTime(firmdates.SubscriptionStartDate).Year.ToString();
                enddate = Convert.ToDateTime(firmdates.ExpiryDate).Month.ToString("D2") + "/" + Convert.ToDateTime(firmdates.ExpiryDate).Day.ToString("D2") + "/" + Convert.ToDateTime(firmdates.ExpiryDate).Year.ToString();

            }
            var apiUrl = savetocasewatchurl;
            //add login data
            var starttime = DateTime.Now;

            var addfClient = new WebClientConnection();
            addfClient.Encoding = System.Text.Encoding.UTF8;
            object rawfile = new
            {
                Accesstoken = accessToken ?? string.Empty,
                Email = useremail ?? string.Empty,
                Memberuserid = userIdDetail ?? string.Empty,
                Password = "MykaSe_PasSsword",
                Mobile = usermobile ?? string.Empty,
                Dispname = vdisplayname ?? string.Empty,
                Countryname = countryname ?? string.Empty,
                StateName = statename ?? string.Empty,
                Subscriptionstart = startdate,
                Subscriptionend = enddate,
                Cnrno = Cnrnos ?? string.Empty,
                Casetype = Casetypes ?? string.Empty,
                Caseyear = Caseyears ?? string.Empty,
                Court = Courts ?? string.Empty,
                BenchID = BenchIDs ?? string.Empty,
                SideID = sideId ?? string.Empty,
                courttitle = "",
                stampreg = stampReg ?? string.Empty,
                iflag = 0,
                StateId = StateIds ?? string.Empty,
                Districtid = Districtids ?? string.Empty,
                Courttype = Courttypes ?? string.Empty,
                casename = casenames ?? string.Empty,
                madvocatename = madvocatenames ?? string.Empty,
                Courtcompestbtype = Courtcompestbtypes ?? string.Empty,
                Courtcompestbcourt = Courtcompestbcourts ?? string.Empty,
                Userid = FirmuserIdDetail ?? string.Empty,
                suffix = Appres ?? string.Empty,
                caseno = appealNo ?? string.Empty,
                janpadval = District ?? string.Empty,
                tahsilval = CourtType ?? string.Empty,
                revenueCourtValue = courtNameR ?? string.Empty,
                mstatus = Status ?? string.Empty
            };

            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);

            try
            {
                resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AddMykaseFetchImidiatecasesToCaseWatchRERH"), "POST", builders);
                var addfClient2 = new WebClientConnection();
                String caseIdValue = "0";
                try
                {
                    var jObj = Newtonsoft.Json.Linq.JObject.Parse(resid);

                    caseIdValue = jObj["data"]?[0]?["caseid"]?.ToString() ?? "0";
                }
                catch
                {
                    caseIdValue = "0";
                }

                object rawfile1 = new
                {

                    Accesstoken = accessToken,
                    caseUniqueId = caseIdValue,
                    Firmid = userfirmid,
                    Userid = userIdDetail
                };
                addfClient2.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders1 = JsonConvert.SerializeObject(rawfile1);
                addfClient2.UploadString(new Uri(apiUrl + "/API/Search/UpsertCreatedByUserId"), "POST", builders1);
            }
            catch (Exception ex)
            {
                LogService("/API/Search/AddMykaseFetchImidiatecasesToCaseWatch" + ex.Message + "&" + ex.InnerException + "starttime" + starttime + "Endtime" + DateTime.Now);
            }
            dynamic data = JObject.Parse(resid);
            string status = data.Status;
            string Message = data.Message;
            // string dataval = data.data;

            if (status == "True")
            {
                //insert login into mykase
                var insertusermap = db.sp_AddUserNeWCashwatch(userfirmid, userid, Username);
                ds = resid;
                return ds;
            }
            else
            {
                ds = resid;
                return ds;
            }
        }
        /// <summary>
        /// Search add case tracking with CNR
        /// </summary>
        /// <param name="Cnrnos"></param>
        /// <param name="Casetypes"></param>
        /// <param name="Casenos"></param>
        /// <param name="Caseyears"></param>
        /// <param name="DiaryNos"></param>
        /// <param name="Courts"></param>
        /// <param name="BenchIDs"></param>
        /// <param name="StateIds"></param>
        /// <param name="Districtids"></param>
        /// <param name="Courttypes"></param>
        /// <param name="casenames"></param>
        /// <param name="mhearingdates"></param>
        /// <param name="madvocatenames"></param>
        /// <param name="Courtcompestbtypes"></param>
        /// <param name="Courtcompestbcourts"></param>
        /// <param name="suffix"></param>
        /// <param name="iflag"></param>
        /// <param name="useremail"></param>
        /// <param name="usermobile"></param>
        /// <param name="userfirmid"></param>
        /// <param name="userid"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <param name="Username"></param>
        /// <returns></returns>        
        /// 
        public static string SearchAddCaseToTrackingWithCNR(string Cnrnos, string Casetypes, string Casenos, string Caseyears, string DiaryNos, string Courts,
           string BenchIDs, string StateIds, string Districtids, string Courttypes, string casenames,
           string madvocatenames, string Courtcompestbtypes, string Courtcompestbcourts, string suffix, int iflag,
           string useremail, string usermobile, string userfirmid, string userid, string savetocasewatchurl, string Username , int IsCWUser ,string CWUserId)
        {
            string ds = "";
            string resid = "";
            dynamic aff1 = 0;
            dynamic aff = 0;
            var vdisplayname = "";
            var countryname = "";
            var statename = "";
            var firmadminuserid = "";
            var startdate = "";
            var enddate = "";
            var db = new LawPracticeEntities();
            if (DiaryNos == null)
            {
                DiaryNos = "";
            }
            var firmadminusername = "";
            var accessToken = "";
            var FirmuserIdDetail = "";
            var userIdDetail = "";
            var getuserdetails = db.usp_GetUserDetailByUserID(userfirmid, userid).FirstOrDefault();
            if (getuserdetails != null)
            {
                vdisplayname = getuserdetails.Name;
                countryname = getuserdetails.country;
                statename = getuserdetails.cstate;
                firmadminuserid = getuserdetails.FirmAdminuserId;
                firmadminusername = getuserdetails.FirmAdminUserName.ToString();
            }

            if (IsCWUser == 1)
            {
                userIdDetail = CWUserId.ToString();
                FirmuserIdDetail = firmadminusername;
                accessToken = "internal";
            }
            else
            {
                if (getuserdetails.IsAdminCW == 1)
                {
                    userIdDetail = CWUserId.ToString();
                    FirmuserIdDetail = getuserdetails.FirmAdminUserName.ToString();
                    accessToken = "internal";
                }
                else
                {
                    accessToken = "mykase123456789abcdef";
                    userIdDetail = Username;
                    FirmuserIdDetail = WebConfigurationManager.AppSettings["matteridname"] + firmadminuserid;
                }

            }

            var firmdates = db.usp_wf_GetFirmDetailByID(Guid.Parse(userfirmid)).FirstOrDefault();
            if (firmdates != null)
            {
                startdate = Convert.ToDateTime(firmdates.SubscriptionStartDate).Month.ToString("D2") + "/" + Convert.ToDateTime(firmdates.SubscriptionStartDate).Day.ToString("D2") + "/" + Convert.ToDateTime(firmdates.SubscriptionStartDate).Year.ToString();
                enddate = Convert.ToDateTime(firmdates.ExpiryDate).Month.ToString("D2") + "/" + Convert.ToDateTime(firmdates.ExpiryDate).Day.ToString("D2") + "/" + Convert.ToDateTime(firmdates.ExpiryDate).Year.ToString();

            }
            var apiUrl = savetocasewatchurl;
            //add login data
            var starttime = DateTime.Now;

            var addfClient = new WebClientConnection();
            object rawfile = new
            {

                Accesstoken = accessToken,
                Email = useremail,
                Memberuserid = userIdDetail,
                Password = "MykaSe_PasSsword",
                Mobile = usermobile,
                Dispname = vdisplayname,
                Countryname = countryname,
                StateName = statename,
                Subscriptionstart = startdate,
                Subscriptionend = enddate,
                Cnrno = Cnrnos,
                Casetype = Casetypes,
                Caseno = Casenos.Trim(),
                Caseyear = Caseyears,
                DiaryNo = DiaryNos.Trim(),
                Court = Courts,
                BenchID = BenchIDs,
                SideID = "",
                courttitle = "",
                stampreg = "",
                iflag = 0,
                StateId = StateIds,
                Districtid = Districtids,
                Courttype = Courttypes,
                casename = casenames,
                madvocatename = madvocatenames,
                mstatus = "",
                Courtcompestbtype = Courtcompestbtypes,
                Courtcompestbcourt = Courtcompestbcourts,
                suffix = suffix,
                Userid = FirmuserIdDetail,
            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            // ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            try
            {
                resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AddMykaseFetchImidiatecasesToCaseWatch"), "POST", builders);
                var addfClient2 = new WebClientConnection();
                String caseIdValue = "0";
                try
                {
                    var jObj = Newtonsoft.Json.Linq.JObject.Parse(resid);

                    caseIdValue = jObj["data"]?[0]?["caseid"]?.ToString() ?? "0";
                }
                catch
                {
                    caseIdValue = "0";
                }

                object rawfile1 = new
                {

                    Accesstoken = accessToken,
                    caseUniqueId = caseIdValue,
                    Firmid = userfirmid,
                    Userid = userIdDetail
                };
                addfClient2.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders1 = JsonConvert.SerializeObject(rawfile1);
                addfClient2.UploadString(new Uri(apiUrl + "/API/Search/UpsertCreatedByUserId"), "POST", builders1);
            }
            catch (Exception ex)
            {
                LogService("/API/Search/AddMykaseFetchImidiatecasesToCaseWatch" + ex.Message + "&" + ex.InnerException + "starttime" + starttime + "Endtime" + DateTime.Now);
            }
            dynamic data = JObject.Parse(resid);
            string status = data.Status;
            string Message = data.Message;
            // string dataval = data.data;

            if (status == "True")
            {
                //insert login into mykase
                var insertusermap = db.sp_AddUserNeWCashwatch(userfirmid, userid, Username);
                ds = resid;
                return ds;
            }
            else
            {
                ds = resid;
                return ds;
            }
        }
        /// <summary>
        /// Update notes by case id
        /// </summary>
        /// <param name="Userid"></param>
        /// <param name="Notes"></param>
        /// <param name="NotesId"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <returns></returns>        
       public static string UpdatesNotesByCaseId(string Userid, string Notes, string NotesId, string savetocasewatchurl,string AccessTokenDetail)
        {
            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            var apiUrl = savetocasewatchurl;
            var addfClient = new WebClient();
            object rawfile = new
            {
                Accesstoken = AccessTokenDetail,
                userid = Userid,
                Notes = Notes,
                Noteid = NotesId,

            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/UpdateCaseStatusNoteByiid"), "POST", builders);
            try
            {
                var db1 = new LawPracticeEntities();
                var param = apiUrl + "AddCaseCaseWatch=>UpdatesNotesByCaseId=>/API/Search/UpdateCaseStatusNoteByiid" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
            }
            catch
            {

            }
            return resid;
        }

        /// <summary>
        /// Get case tag list by case id
        /// </summary>
        /// <param name="caseids"></param>
        /// <param name="Userid"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <returns></returns>        
        /// 
        public static string CaseTagListByCaseId(string caseids, string Userid, string savetocasewatchurl,int IsCwuser,string CWUserName)
        {
            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            var apiUrl = savetocasewatchurl;
            var addfClient = new WebClient();
            string AccessTokenDetail = string.Empty;
            string userIdDetail = string.Empty;
            string IsCaseWatchUser = IsCwuser.ToString();
            if (!String.IsNullOrEmpty(IsCaseWatchUser))
            {
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = CWUserName.ToString();
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = Userid;
                }
            }
            else
            {
                AccessTokenDetail = "mykase123456789abcdef";
                userIdDetail = Userid;
            }
            object rawfile = new
            {
                Accesstoken = AccessTokenDetail,
                userid = userIdDetail,
                usercaseid = caseids

            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/FillTaggedbyUserCaseId"), "POST", builders);
            try
            {
                var db1 = new LawPracticeEntities();
                var param = apiUrl + "AddCaseCaseWatch=>FillTaggedbyUserCaseId=>/API/Search/FillTaggedbyUserCaseId" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
            }
            catch
            {

            }
            return resid;

        }
        /// <summary>
        /// Remove case tag
        /// </summary>
        /// <param name="caseid"></param>
        /// <param name="Userid"></param>
        /// <param name="taggedname"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <returns></returns>
        public static string RemoveCaseTag(string caseid,string Userid, string taggedname, string savetocasewatchurl,int IsCWUser,string CWUserId)
        {
            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            var apiUrl = savetocasewatchurl;
            var addfClient = new WebClient();
            string AccessTokenDetail = string.Empty;
            string userIdDetail = string.Empty;
            if (IsCWUser == 1)
            {
                userIdDetail = CWUserId.ToString();
                AccessTokenDetail = "internal";
            }
            else
            {
                AccessTokenDetail = "mykase123456789abcdef";
                userIdDetail = Userid;
            }
            object rawfile = new
            {
                Accesstoken = AccessTokenDetail,
                userid = userIdDetail,
                taggedname= taggedname,
                caseid = caseid

            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/RemoveTag"), "POST", builders);
            try
            {
                var db1 = new LawPracticeEntities();
                var param = apiUrl + "AddCaseCaseWatch=>/RemoveTag=>/API/Search//RemoveTag" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
            }
            catch{}
            return resid;

        }
        /// <summary>
        /// Litigatiob dashboard count
        /// </summary>
        /// <param name="Userid"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <param name="roleids"></param>
        /// <returns></returns>
        public static string LitigationDashbaordCount(string Userid, string savetocasewatchurl,int roleids,int IsCWUser, string CWUserIds, string FirmId, string UserId, string strusername)
        {
            var db = new LawPracticeEntities();
            string resid = "";
            int IsFirmAdmin = 0;
            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            var apiUrl = savetocasewatchurl;
            string joineduser = "";
            joineduser = db.usp_GetUnderUserListById(FirmId, UserId, strusername).FirstOrDefault();
            
            string AccessTokenDetail = string.Empty;
            string userIdDetail = string.Empty;
            if (IsCWUser == 1)
            {
                userIdDetail = CWUserIds.ToString();
                AccessTokenDetail = "internal";
            }
            else
            {
                AccessTokenDetail = "mykase123456789abcdef";
                if (roleids == 1)
                {
                    userIdDetail = Userid;
                }
                else
                {
                    userIdDetail = joineduser;
                }
            }
            var addfClient = new WebClient();
            if (roleids == 1)
            {
                IsFirmAdmin = 1;
            }
            else
            {
                IsFirmAdmin = 0;
            }
            object rawfile = new
            {
                Accesstoken = AccessTokenDetail,
                userid = userIdDetail,
                IsAdmin= IsFirmAdmin

            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            try
            {
                resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/LitigationDashboardCount"), "POST", builders);
            }
            catch (Exception ex)
            {}
            return resid;

        }
        ///Bind Revenue case date without async
        /// </summary>
        /// <param name="strapiuser"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <param name="userid"></param>
        /// <returns></returns>

        public static string NextHearingIfidByUserIdRevenue(string strapiuser, string savetocasewatchurl, string userid)
        {

            var db1 = new LawPracticeEntities();
            try
            {
                var matteridname = WebConfigurationManager.AppSettings["matteridname"];
                dynamic aff1 = 0;
                dynamic aff = 0;

                var apiUrl = savetocasewatchurl;
                //add login data
                var addfClient = new WebClient();
                object rawfile = new
                {
                    accesstoken = "mykase123456789abcdef",
                    UserId = strapiuser,
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                try
                {
                    aff1 = addfClient.UploadString(new Uri(apiUrl + "/API/Search/NextHearingIfidByUserIdRevenue"), "POST", builders);
                }
                catch (Exception)
                { }
               

                return aff1;
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return "Error";

            }
        }
        public static string TotalNotesDetails(string userid, string doctype, string search, string savetocasewatchurl, string AccessTokenDetail)
        {
            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            var apiUrl = savetocasewatchurl;

            var addfClient = new WebClient();
            object rawfile = new
            {
                Accesstoken = AccessTokenDetail,
                userid = userid,
                isadmin = "0",
                search = "",
            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/TotalNotesDetails"), "POST", builders);
            try
            {
                var db1 = new LawPracticeEntities();
                var param = apiUrl + "AddCaseCaseWatch=>TotalNotesDetails=>/API/Search/TotalNotesDetails" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
            }
            catch
            {

            }
            return resid;

        }
        public static string TotalOrderNotesDetails(string userid, string doctype, string search, string savetocasewatchurl, string AccessTokenDetail)
        {
            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            var apiUrl = savetocasewatchurl;

            var addfClient = new WebClient();
            object rawfile = new
            {
                Accesstoken = AccessTokenDetail,
                userid = userid,
                isadmin = "0",
                search = "",
            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/TotalOrderDetails"), "POST", builders);
            try
            {
                var db1 = new LawPracticeEntities();
                var param = apiUrl + "AddCaseCaseWatch=>TotalOrderDetails=>/API/Search/TotalOrderDetails" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
            }
            catch
            {

            }
            return resid;

        }
        public static string RemoveCaseNotesByCaseID(string Userid, string Noteid, string savetocasewatchurl, string AccessTokenDetail = "", string userIdDetail = "")
        {
            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            var apiUrl = savetocasewatchurl;
            var addfClient = new WebClient();
            if (userIdDetail == "")
            {

                userIdDetail = Userid;

            }

            if (AccessTokenDetail == "")
            {

                AccessTokenDetail = "mykase123456789abcdef";

            }
            object rawfile = new
            {
                Accesstoken = AccessTokenDetail,
                userid = userIdDetail,
                noteid = Noteid,

            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/RemoveCaseNotes"), "POST", builders);
            try
            {
                var db1 = new LawPracticeEntities();
                var param = apiUrl + "AddCaseCaseWatch=>/RemoveCaseNotes=>/API/Search//RemoveCaseNotes" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
            }
            catch
            {

            }
            return resid;

        }
        public static string RemoveCaseOrderNotesByOrderID(string Userid, string Noteid, string savetocasewatchurl, string AccessTokenDetail = "", string userIdDetail = "")
        {
            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            var apiUrl = savetocasewatchurl;
            var addfClient = new WebClient();
            if (userIdDetail == "")
            {
                userIdDetail = Userid;
            }
            if (AccessTokenDetail == "")
            {
                AccessTokenDetail = "mykase123456789abcdef";
            }
            object rawfile = new
            {
                Accesstoken = AccessTokenDetail,
                userid = userIdDetail,
                Ordernoteid = Noteid,

            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/RemoveCaseOrderNotes"), "POST", builders);
            try
            {
                var db1 = new LawPracticeEntities();
                var param = apiUrl + "AddCaseCaseWatch=>/RemoveCaseOrderNotes=>/API/Search//RemoveCaseOrderNotes" + "@" + builders;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");
            }
            catch
            {
            }
            return resid;

        }
        /// <summary>
/// <summary>
        /// Litigation dashboard total count
        /// </summary>
        /// <param name="Userid"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <param name="roleids"></param>
        /// <returns></returns>
        public static string LitigationDashbaordTotalCount(string Userid, string savetocasewatchurl, int roleids, int IsCWUser,
            string CWUserIds,string FirmId, string UserId,string strusername)
        {
            var db = new LawPracticeEntities();
            string resid = "";
            int IsFirmAdmin = 0;
            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            var apiUrl = savetocasewatchurl;
            string joineduser = "";
            joineduser = db.usp_GetUnderUserListById(FirmId, UserId, strusername).FirstOrDefault();
            
            string AccessTokenDetail = string.Empty;
            string userIdDetail = string.Empty;
            string IsCaseWatchUser = IsCWUser.ToString();

            if (!String.IsNullOrEmpty(IsCaseWatchUser))
            {
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = CWUserIds;
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    if(roleids == 1)
                    {
                        userIdDetail = Userid;
                    }
                    else
                    {
                        userIdDetail = joineduser;
                    }
                    
                }
            }
            else
            {
                AccessTokenDetail = "mykase123456789abcdef";
                if (roleids == 1)
                {
                    userIdDetail = Userid;
                }
                else
                {
                    userIdDetail = joineduser;
                }
                //userIdDetail = joineduser;
            }
            var addfClient = new WebClient();
            if (roleids == 1)
            {
                IsFirmAdmin = 1;
            }
            else
            {
                IsFirmAdmin = 0;
            }
            object rawfile = new
            {
                Accesstoken = AccessTokenDetail,
                userid = userIdDetail,
                IsAdmin = IsFirmAdmin

            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            try
            {
                resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/LitigationDashboardTotalCases"), "POST", builders);
            }
            catch (Exception ex)
            { }
            return resid;

        }

        /// <summary>
        /// Litigation dashboard Status Not Found count
        /// </summary>
        /// <param name="Userid"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <param name="roleids"></param>
        /// <returns></returns>
        public static string LitigationDashbaordStatusnotFoundCount(string Userid, string savetocasewatchurl, int roleids,
            int IsCWUser, string CWUserIds, string FirmId, string UserId, string strusername)
        {
            var db = new LawPracticeEntities();
            string resid = "";
            int IsFirmAdmin = 0;
            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            var apiUrl = savetocasewatchurl;
            string joineduser = "";
            joineduser = db.usp_GetUnderUserListById(FirmId, UserId, strusername).FirstOrDefault();

            string AccessTokenDetail = string.Empty;
            string userIdDetail = string.Empty;
            string IsCaseWatchUser = IsCWUser.ToString();

            if (!String.IsNullOrEmpty(IsCaseWatchUser))
            {
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = CWUserIds;
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    if (roleids == 1)
                    {
                        userIdDetail = Userid;
                    }
                    else
                    {
                        userIdDetail = joineduser;
                    }
                   // userIdDetail = joineduser;
                }
            }
            else
            {
                AccessTokenDetail = "mykase123456789abcdef";
                if (roleids == 1)
                {
                    userIdDetail = Userid;
                }
                else
                {
                    userIdDetail = joineduser;
                }
                // userIdDetail = joineduser;
            }
            //string AccessTokenDetail = string.Empty;
            //string userIdDetail = string.Empty;
            //if (IsCWUser == 1)
            //{
            //    userIdDetail = CWUserIds.ToString();
            //    AccessTokenDetail = "internal";
            //}
            //else
            //{
            //    AccessTokenDetail = "mykase123456789abcdef";
            //    userIdDetail = Userid;
            //}
            var addfClient = new WebClient();
            if (roleids == 1)
            {
                IsFirmAdmin = 1;
            }
            else
            {
                IsFirmAdmin = 0;
            }
            object rawfile = new
            {
                Accesstoken = AccessTokenDetail,
                userid = userIdDetail,
                IsAdmin = IsFirmAdmin

            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            try
            {
                resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/LitigationDashboardStatusnotFound"), "POST", builders);
            }
            catch (Exception ex)
            { }
            return resid;

        }

        /// <summary>
        /// Litigation dashboard Status Not Found count
        /// </summary>
        /// <param name="Userid"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <param name="roleids"></param>
        /// <returns></returns>
        public static string LitigationDashbaordPendingCount(string Userid, string savetocasewatchurl, int roleids, int IsCWUser,
            string CWUserIds, string FirmId, string UserId, string strusername)
        {
            var db = new LawPracticeEntities();
            string resid = "";
            int IsFirmAdmin = 0;
            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            var apiUrl = savetocasewatchurl;
            string AccessTokenDetail = string.Empty;
            string userIdDetail = string.Empty;
            string joineduser = "";
            joineduser = db.usp_GetUnderUserListById(FirmId, UserId, strusername).FirstOrDefault();
            string IsCaseWatchUser = IsCWUser.ToString();

            if (!String.IsNullOrEmpty(IsCaseWatchUser))
            {
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = CWUserIds;
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    if (roleids == 1)
                    {
                        userIdDetail = Userid;
                    }
                    else
                    {
                        userIdDetail = joineduser;
                    }
                   // userIdDetail = joineduser;
                }
            }
            else
            {
                AccessTokenDetail = "mykase123456789abcdef";
                if (roleids == 1)
                {
                    userIdDetail = Userid;
                }
                else
                {
                    userIdDetail = joineduser;
                }
                // userIdDetail = joineduser;
            }
            //if (IsCWUser == 1)
            //{
            //    userIdDetail = CWUserIds.ToString();
            //    AccessTokenDetail = "internal";
            //}
            //else
            //{
            //    AccessTokenDetail = "mykase123456789abcdef";
            //    userIdDetail = Userid;
            //}
            var addfClient = new WebClient();
            if (roleids == 1)
            {
                IsFirmAdmin = 1;
               // userIdDetail = Userid;
            }
            else
            {
                IsFirmAdmin = 0;
            }
            object rawfile = new
            {
                Accesstoken = AccessTokenDetail,
                userid = userIdDetail,
                IsAdmin = IsFirmAdmin

            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            try
            {
                resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/LitigationDashboardPendingCases"), "POST", builders);
            }
            catch (Exception ex)
            { }
            return resid;

        }

        /// <summary>
        /// Litigation dashboard Status Not Found count
        /// </summary>
        /// <param name="Userid"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <param name="roleids"></param>
        /// <returns></returns>
        public static string LitigationDashbaordDisposedCount(string Userid, string savetocasewatchurl, int roleids,
            int IsCWUser, string CWUserIds, string FirmId, string UserId, string strusername)
        {
            var db = new LawPracticeEntities();
            string resid = "";
            int IsFirmAdmin = 0;
            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            var apiUrl = savetocasewatchurl;
            string joineduser = "";
            joineduser = db.usp_GetUnderUserListById(FirmId, UserId, strusername).FirstOrDefault();

            string AccessTokenDetail = string.Empty;
            string userIdDetail = string.Empty;
            string IsCaseWatchUser = IsCWUser.ToString();

            if (!String.IsNullOrEmpty(IsCaseWatchUser))
            {
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = CWUserIds;
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    if (roleids == 1)
                    {
                        userIdDetail = Userid;
                    }
                    else
                    {
                        userIdDetail = joineduser;
                    }
                    //userIdDetail = joineduser;
                }
            }
            else
            {
                AccessTokenDetail = "mykase123456789abcdef";
                //userIdDetail = joineduser;
                if (roleids == 1)
                {
                    userIdDetail = Userid;
                }
                else
                {
                    userIdDetail = joineduser;
                }
            }
            //string AccessTokenDetail = string.Empty;
            //string userIdDetail = string.Empty;
            //if (IsCWUser == 1)
            //{
            //    userIdDetail = CWUserIds.ToString();
            //    AccessTokenDetail = "internal";
            //}
            //else
            //{
            //    AccessTokenDetail = "mykase123456789abcdef";
            //    userIdDetail = Userid;
            //}
            var addfClient = new WebClient();
            if (roleids == 1)
            {
                IsFirmAdmin = 1;
               // userIdDetail = Userid;
            }
            else
            {
                IsFirmAdmin = 0;
            }
            object rawfile = new
            {
                Accesstoken = AccessTokenDetail,
                userid = userIdDetail,
                IsAdmin = IsFirmAdmin

            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            try
            {
                resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/LitigationDashboardDisposedCases"), "POST", builders);
            }
            catch (Exception ex)
            { }
            return resid;

        }

        /// <summary>
        /// Litigation dashboard Status Not Found count
        /// </summary>
        /// <param name="Userid"></param>
        /// <param name="savetocasewatchurl"></param>
        /// <param name="roleids"></param>
        /// <returns></returns>
        public static string LitigationDashbaordNotesCount(string Userid, string savetocasewatchurl, int roleids,
            int IsCWUser, string CWUserIds, string FirmId, string UserId, string strusername)
        {
            var db = new LawPracticeEntities();
            string resid = "";
            int IsFirmAdmin = 0;
            var matteridname = WebConfigurationManager.AppSettings["matteridname"];
            var apiUrl = savetocasewatchurl;
            string joineduser = "";
            joineduser = db.usp_GetUnderUserListById(FirmId, UserId, strusername).FirstOrDefault();

            string AccessTokenDetail = string.Empty;
            string userIdDetail = string.Empty;
            string IsCaseWatchUser = IsCWUser.ToString();

            if (!String.IsNullOrEmpty(IsCaseWatchUser))
            {
                if (IsCaseWatchUser == "1")
                {
                    userIdDetail = CWUserIds;
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    if (roleids == 1)
                    {
                        userIdDetail = Userid;
                    }
                    else
                    {
                        userIdDetail = joineduser;
                    }
                   // userIdDetail = joineduser;
                }
            }
            else
            {
                AccessTokenDetail = "mykase123456789abcdef";
                if (roleids == 1)
                {
                    userIdDetail = Userid;
                }
                else
                {
                    userIdDetail = joineduser;
                }
                //  userIdDetail = joineduser;
            }
            //string AccessTokenDetail = string.Empty;
            //string userIdDetail = string.Empty;
            //if (IsCWUser == 1)
            //{
            //    userIdDetail = CWUserIds.ToString();
            //    AccessTokenDetail = "internal";
            //}
            //else
            //{
            //    AccessTokenDetail = "mykase123456789abcdef";
            //    userIdDetail = Userid;
            //}
            var addfClient = new WebClient();
            if (roleids == 1)
            {
                IsFirmAdmin = 1;
               // userIdDetail = Userid;
            }
            else
            {
                IsFirmAdmin = 0;
            }
            object rawfile = new
            {
                Accesstoken = AccessTokenDetail,
                userid = userIdDetail,
                IsAdmin = IsFirmAdmin

            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            try
            {
                resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/LitigationDashboardNotesCount"), "POST", builders);
            }
            catch (Exception ex)
            { }
            return resid;

        }        /// Linked Case Add Live Tracking
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="LinkedCaseUserName"></param>
        /// <param name="MasterCaseIds"></param>
        /// <param name="LinkedCaseNo"></param>
        /// <param name="Username"></param>
        /// <param name="apiUrl"></param>
        /// <param name="Casetypes"></param>
        /// <param name="Casenos"></param>
        /// <param name="Caseyears"></param>
        /// <param name="parentusercaseids"></param>
        /// <param name="Scasetype"></param>
        /// <param name="slinkedcasetype"></param>
        /// <returns></returns>
        public static string LinkedCaseAddCaseToLiveTrack(string firmid, string userid, string LinkedCaseUserName, string MasterCaseIds,
            string LinkedCaseNo,string Username,string apiUrl,string Casetypes,string Casenos,string Caseyears,
            string parentusercaseids, string Scasetype,string slinkedcasetype)
        {
            string ds = "";
            string resid = "";
            var db = new LawPracticeEntities();
            //add login data
            var starttime = DateTime.Now;
            var addfClient = new WebClientConnection();
            object rawfile = new
            {
                Accesstoken = "mykase123456789abcdef",
                Userid = LinkedCaseUserName,
                Casetype = Casetypes,
                Caseno = Casenos,
                Caseyear = Caseyears,
                caseid = MasterCaseIds,
                linkedcaseno = LinkedCaseNo,
                usercaseid = parentusercaseids,
                linkedcasetype = slinkedcasetype,
                scasetype= Scasetype
            };
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            // ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            try
            {
                resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AddLinkedCases"), "POST", builders);
            }
            catch (Exception ex)
            {
                LogService("/API/Search/AddLinkedCases" + ex.Message + "&" + ex.InnerException + "starttime" + starttime + "Endtime" + DateTime.Now);
            }
            dynamic data = JObject.Parse(resid);
            string status = data.Status;
            string Message = data.Message;
            if (status == "True")
            {
                //insert login into mykase
                var insertusermap = db.sp_AddUserNeWCashwatch(firmid, userid, Username);
                ds = resid;
                return ds;
            }
            else
            {
                ds = resid;
                return ds;
            }
        }
    }
}