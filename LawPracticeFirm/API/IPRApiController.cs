using DataAccess.Modals;
using LawPracticeFirm.Common;
using LawPracticeFirm.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using static LawPracticeFirm.Models.AuditData;
using IPRManagement.BusinessLayer.BusinessRepository;
using IPRManagement.BusinessLayer.IBusinessRepository;
using IPRManagement.BusinessLayer.BusinessEntity;
using LawPracticeFirm.Helpers;
using System.Text.RegularExpressions;
using System.IO;
using LawPracticeFirm.DAL;
using TrademarkDetailsList = LawPracticeFirm.Models.TrademarkDetailsList;

namespace LawPracticeFirm.API
{
    public class IPRApiController : BaseFirmApiController
    {
        private List<int> Tradeiid = new List<int>();
        private LawPracticeEntities db1 = new LawPracticeEntities();

        private Iipr iprreport;
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpGet]
        public IHttpActionResult GetIPRSignUP1()
        {

            string userId = LoggedInUser.UserId.ToString();
            string firmId = LoggedInUser.FirmId.ToString();
            int roleid = Convert.ToInt32(LoggedInUser.RoleId);
            GetIPRSignUP(userId, firmId, roleid);
            return Ok();

        }

        public static string GetIPRSignUP(string userId, string firmId, int roleid)
        {
            var db1 = new LawPracticeEntities();
            string ds = "";
            try
            {

                var vdisplayname = "";
                var countryname = "";
                var statename = "";

                var startdate = "";
                var enddate = "";
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                //var apiUrl = "http://10.60.1.42:9010/API/IPR/Signup";
                string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId;
                // string userId = "", firmId = "";
                //userId = LoggedInUser.UserId.ToString();
                //firmId = LoggedInUser.FirmId.ToString();
                //var roleid = Convert.ToInt32(LoggedInUser.RoleId);
                string status = "", EmailID = "", MobileNo = "", Password = "";

                var getuserdetails = db1.usp_GetUserDetailByUserID(firmId, userId).FirstOrDefault();
                if (getuserdetails != null)
                {
                    vdisplayname = getuserdetails.Name;
                    countryname = getuserdetails.country;
                    statename = getuserdetails.cstate;
                    EmailID = getuserdetails.EmailId;
                    MobileNo = getuserdetails.cmobile;

                }

                var firmdates = db1.usp_wf_GetFirmDetailByID(Guid.Parse(firmId)).FirstOrDefault();
                if (firmdates != null)
                {
                    startdate = Convert.ToDateTime(firmdates.SubscriptionStartDate).Month.ToString("D2") + "/" + Convert.ToDateTime(firmdates.SubscriptionStartDate).Day.ToString("D2") + "/" + Convert.ToDateTime(firmdates.SubscriptionStartDate).Year.ToString();
                    enddate = Convert.ToDateTime(firmdates.ExpiryDate).Month.ToString("D2") + "/" + Convert.ToDateTime(firmdates.ExpiryDate).Day.ToString("D2") + "/" + Convert.ToDateTime(firmdates.ExpiryDate).Year.ToString();

                }


                var addfClient = new WebClientConnection();
                object rawfile = new
                {
                    Accesstoken = "mykase123456789abcdef",
                    Email = EmailID,
                    Memberuserid = strusername,
                    Password = "MykaSe_PasSsword",
                    Mobile = MobileNo,
                    Name = vdisplayname,
                    Countryname = countryname,
                    StateName = statename,
                    Subscriptionstart = startdate,
                    Subscriptionend = enddate,
                    isAdmin = "1"
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/Signup"), "POST", builders);


                // var param = apiUrl + "IPRController=>" + "@" + builders;


                try
                {
                    var db2 = new LawPracticeEntities();
                    var param = apiUrl + "IPRApi=>GetIPRSignUP1=>/API/IPR/Signup" + "@" + builders;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), Guid.Parse(HttpContext.Current.Session["sessionuserid"].ToString()), param, myIP(), GetMacAddress().ToString(), 0, "");


                }
                catch
                {

                }


                dynamic data = JObject.Parse(resid);
                string status1 = data.Status;
                string Message = data.Message;
                string dataval = data.data;

                if (status1 == "True")
                {

                    ds = resid;
                    return ds;
                }
                else
                {
                    ds = "false";
                    return ds;
                }
                // ds = resid;

            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, AuditData.myIP(), AuditData.GetMacAddress().ToString(), 1, "");
                //return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
            return ds;
        }


        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpGet]
        public async Task<IHttpActionResult> GetIPList()
        {

            var data = await IPList();

            return Ok(new { data = data });
        }

        public async Task<string> IPList()
        {
            string a = "";
            var db = new IPRRepository();
            string userId = LoggedInUser.UserId.ToString();
            string firmId = LoggedInUser.FirmId.ToString();
            //List<sp_GetIPRList_Result> list = new List<sp_GetIPRList_Result>();
            var list = db.GetIPRList(userId, firmId).ToList();
            var rawfile = list.Cast<object>().ToArray();
            //for (int i = 0; list.Count > i; i++) 
            //{
            //    rawfile= new 
            //    {
            //        ipname = list[i].IPName,
            //        iid = list[i].iid
            //    };
            //}
            var newlist = JsonConvert.SerializeObject(rawfile);

            return newlist.ToString();
        }

        //public async Task<string> IPList()
        //{
        //    try
        //    {
        //        string userId = LoggedInUser.UserId.ToString();
        //        LawPracticeEntities db = new LawPracticeEntities();
        //        string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId;
        //        var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
        //        //var apiUrl = "http://10.60.1.42:9010/API/IPR/IPList";
        //        var addfClient = new HttpClient();
        //        object rawfile = new
        //        {
        //            userid = strusername,
        //            Accesstoken = "mykase123456789abcdef"

        //        };

        //        string content = JsonConvert.SerializeObject(rawfile);

        //        StringContent queryString = new StringContent(content, Encoding.UTF8, "application/json");
        //        addfClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        //        var response = await addfClient.PostAsync(new Uri(apiUrl + "/API/IPR/IPList").ToString(), queryString);
        //        return await response.Content.ReadAsStringAsync();



        //    }
        //    catch (Exception ex)
        //    {
        //        return ex.Message;
        //    }

        //}

        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpGet]
        public async Task<IHttpActionResult> GetTypeList()
        {

            var data = await TypeList();

            return Ok(new { data = data });
        }
        public async Task<string> TypeList()
        {
            try
            {
                string userId = LoggedInUser.UserId.ToString();
                LawPracticeEntities db = new LawPracticeEntities();
                string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId;
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                //var apiUrl = "http://10.60.1.42:9010/API/IPR/TypeList";
                var addfClient = new HttpClient();
                object rawfile = new
                {
                    userid = strusername,
                    Accesstoken = "mykase123456789abcdef"

                };

                string content = JsonConvert.SerializeObject(rawfile);

                StringContent queryString = new StringContent(content, Encoding.UTF8, "application/json");
                addfClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var response = await addfClient.PostAsync(new Uri(apiUrl + "/API/IPR/TypeList").ToString(), queryString);
                return await response.Content.ReadAsStringAsync();



            }
            catch (Exception ex)
            {
                return ex.Message;
            }

        }


        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public async Task<IHttpActionResult> UsedSinceList()
        {
            // Prefix = Prefix.Replace(@"\", "");
            var ip = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ip"]);
            var data = await UserDetails(ip);

            return Ok(new { data = data });


        }
        public async Task<string> UserDetails(string ip)
        {
            try
            {
                string userId = LoggedInUser.UserId.ToString();
                LawPracticeEntities db = new LawPracticeEntities();
                string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId;
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                //var apiUrl = "http://10.60.1.42:9010/API/IPR/UsedSinceList";
                var addfClient = new HttpClient();
                object rawfile = new
                {
                    userid = strusername,
                    Accesstoken = "mykase123456789abcdef",
                    ip = ip

                };

                string content = JsonConvert.SerializeObject(rawfile);

                StringContent queryString = new StringContent(content, Encoding.UTF8, "application/json");
                addfClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var response = await addfClient.PostAsync(new Uri(apiUrl + "/API/IPR/UserDetailsList").ToString(), queryString);
                return await response.Content.ReadAsStringAsync();



            }
            catch (Exception ex)
            {
                return ex.Message;
            }

        }


        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public async Task<IHttpActionResult> ProprietorList()
        {
            // Prefix = Prefix.Replace(@"\", "");
            var prefix = QueryAES.UrlDecode(HttpContext.Current.Request.Form["prefix1"]);
            var data = await ProprietorList1(prefix);

            return Ok(new { data = data });


        }
        public async Task<string> ProprietorList1(string prefix)
        {
            try
            {
                string userId = LoggedInUser.UserId.ToString();
                LawPracticeEntities db = new LawPracticeEntities();
                string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId;
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                //var apiUrl = "http://10.60.1.42:9010/API/IPR/ProprietorList";
                var addfClient = new HttpClient();
                object rawfile = new
                {
                    userid = strusername,
                    Accesstoken = "mykase123456789abcdef",
                    proprietor = prefix,
                    jurisdiction = "1"

                };

                string content = JsonConvert.SerializeObject(rawfile);

                StringContent queryString = new StringContent(content, Encoding.UTF8, "application/json");
                addfClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var response = await addfClient.PostAsync(new Uri(apiUrl + "/API/IPR/ProprietorList").ToString(), queryString);
                return await response.Content.ReadAsStringAsync();



            }
            catch (Exception ex)
            {
                return ex.Message;
            }

        }

        //[FirmApiAuthorization()]
        //[System.Web.Mvc.HttpPost]      

        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public async Task<IHttpActionResult> JurisdictionList()
        {

            var data = await JurisdictionList1();

            return Ok(new { data = data });


        }
        public async Task<string> JurisdictionList1()
        {
            try
            {
                string userId = LoggedInUser.UserId.ToString();
                LawPracticeEntities db = new LawPracticeEntities();
                string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId;
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                //var apiUrl = "http://10.60.1.42:9010/API/IPR/JurisdictionList";
                var addfClient = new HttpClient();
                object rawfile = new
                {
                    userid = strusername,
                    Accesstoken = "mykase123456789abcdef"

                };

                string content = JsonConvert.SerializeObject(rawfile);

                StringContent queryString = new StringContent(content, Encoding.UTF8, "application/json");
                addfClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var response = await addfClient.PostAsync(new Uri(apiUrl + "/API/IPR/JurisdictionList").ToString(), queryString);
                return await response.Content.ReadAsStringAsync();



            }
            catch (Exception ex)
            {
                return ex.Message;
            }

        }

        /// <summary>
        /// Method for Trademark Search Page
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public async Task<IHttpActionResult> SearchIPR()
        {
            string data = "";
            try
            {
                int pagesize1 = 10, pageindex = 1;
                pageindex = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                pagesize1 = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                var IPList = QueryAES.UrlDecode(HttpContext.Current.Request.Form["IPList"]);
                var tradeId = HttpContext.Current.Request.Form["tradeid"];
                if (tradeId == null || tradeId == "undefined")
                {
                    tradeId = "";
                }
                var filtertradmark = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtertradmark"]);
                var applicationno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["applicationno"]);
                var searchclass = QueryAES.UrlDecode(HttpContext.Current.Request.Form["searchclass"]);
                var searchtype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["searchtype"]);
                var searchstatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["searchstatus"]);
                if (string.IsNullOrEmpty(searchtype) || Convert.ToString(searchtype) == "undefined")
                {
                    searchtype = "";
                }
                var dateapplicationto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtdateapplicationto"]);
                var dateapplicationfrom = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtdateapplicationfrom"]);
                var searchuserdetetail = QueryAES.UrlDecode(HttpContext.Current.Request.Form["searchuserdetetail"]);
                if (string.IsNullOrEmpty(searchuserdetetail) || Convert.ToString(searchuserdetetail) == "undefined")
                {
                    searchuserdetetail = "";
                }

                var Proprietor = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Proprietor"]);
                var JurisdictionList = QueryAES.UrlDecode(HttpContext.Current.Request.Form["JurisdictionList"]);
                var usedsincefrom1 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["usedsincefrom"]);
                var usedsinceto1 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["usedsinceto"]);
                var vsort = QueryAES.UrlDecode(HttpContext.Current.Request.Form["vsort"]);
                var colname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["colname"]);
                if (string.IsNullOrEmpty(colname) || Convert.ToString(colname) == "undefined")
                {
                    searchuserdetetail = "";
                }
                var classification = QueryAES.UrlDecode(HttpContext.Current.Request.Form["classification"]);

                tradeId = (tradeId == null || tradeId == "null") ? "" : tradeId;
                filtertradmark = (filtertradmark == null || filtertradmark == "null") ? "" : filtertradmark;
                applicationno = (applicationno == null || applicationno == "null") ? "" : applicationno;
                searchclass = (searchclass == null || searchclass == "null") ? "" : searchclass;
                searchtype = (searchtype == null || searchtype == "null") ? "" : searchtype;
                searchstatus = (searchstatus == null || searchstatus == "null") ? "" : searchstatus;
                dateapplicationto = (dateapplicationto == null || dateapplicationto == "null") ? "" : dateapplicationto;
                dateapplicationfrom = (dateapplicationfrom == null || dateapplicationfrom == "null") ? "" : dateapplicationfrom;
                searchuserdetetail = (searchuserdetetail == null || searchuserdetetail == "null") ? "" : searchuserdetetail;
                Proprietor = (Proprietor == null || Proprietor == "null") ? "" : Proprietor;
                JurisdictionList = (JurisdictionList == null || JurisdictionList == "null") ? "" : JurisdictionList;
                usedsincefrom1 = (usedsincefrom1 == null || usedsincefrom1 == "null") ? "" : usedsincefrom1;
                usedsinceto1 = (usedsinceto1 == null || usedsinceto1 == "null") ? "" : usedsinceto1;
                vsort = (vsort == null || vsort == "null") ? "0" : vsort;
                colname = (colname == null || colname == "null") ? "" : colname;
                classification = (classification == null || classification == "null") ? "" : classification;

                if (vsort == null)
                {
                    vsort = "0";
                }

                if (colname == null || colname == "undefined")
                {
                    colname = "";
                }

                data = await APIResponseForTM(IPList, filtertradmark, applicationno, searchclass, searchtype, ReplaceSplCharacter(searchstatus), dateapplicationto, dateapplicationfrom, searchuserdetetail, Proprietor, JurisdictionList, pageindex, pagesize1, usedsincefrom1, usedsinceto1, vsort, colname, classification);
            }

            catch (Exception ex)
            {
                //File.WriteAllText("ErrorLogForTMSearch.txt", data);
            }

            return Ok(new { data = data });
        }

        public async Task<string> APIResponseForTM(string IPList, string filtertradmark, string applicationno, string searchclass, string searchtype, string searchstatus, string dateapplicationto, string dateapplicationfrom, string searchuserdetetail, string Proprietor, string JurisdictionList, int pagenum, int pagesize1, string usedsincefrom1, string usedsinceto1, string vsort, string colname, string classification)
        {
            HttpResponseMessage response = new HttpResponseMessage();
            string responsestrfom = "";
            try
            {
                string userId = LoggedInUser.UserId.ToString();
                string firmId = LoggedInUser.FirmId.ToString();
                LawPracticeEntities db = new LawPracticeEntities();
                string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId;
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                int timeout = Convert.ToInt32(ConfigurationManager.AppSettings["Timeout"]);
                //var apiUrl = "http://10.60.1.42:9010/API/IPR/SearchIPR";
                var addfClient = new HttpClient();
                addfClient.Timeout = TimeSpan.FromMinutes(timeout);
                object rawfile = new
                {
                    userid = strusername,
                    firmId = firmId,
                    Accesstoken = "mykase123456789abcdef",
                    jurisdiction = JurisdictionList,
                    ip = IPList,
                    vclass = searchclass,
                    proprietor = Proprietor,
                    ApplicationDatefrom = dateapplicationfrom,
                    ApplicationDateto = dateapplicationto,
                    Status = searchstatus,
                    userdetails = searchuserdetetail,
                    usedsincefrom = usedsincefrom1,
                    usedsinceto = usedsinceto1,
                    agent = "",
                    ApplNo = applicationno,
                    vtype = searchtype,
                    searchtext = filtertradmark,
                    pageindex = pagenum,
                    pagesize = pagesize1,
                    vsort = vsort,
                    colname = colname,
                    Classification = classification,
                };

                string content = JsonConvert.SerializeObject(rawfile);
                string deviceIP = myIP();

                StringContent queryString = new StringContent(content, Encoding.UTF8, "application/json");
                addfClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                response = await addfClient.PostAsync(new Uri(apiUrl + "/API/IPR/SearchIPR").ToString(), queryString);

                responsestrfom = await response.Content.ReadAsStringAsync();
                var responseJSONfom = (JObject)JsonConvert.DeserializeObject<object>(responsestrfom);

                //if (responseJSONfom["Message"].ToString()== "UH-OH Something went wrong on our end.")
                //{
                //    db1.usp_AddAudit(Convert.ToInt32(EventType.TrdsrcIPR), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.TrdsrcIPR), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), new Guid(LoggedInUser.UserId.ToString()), "Message=" + responseJSONfom["Message"].ToString() + "@Stack Trace=APIResponseForTM", myIP(), GetMacAddress().ToString(), 0, "");
                //}

                db1.usp_AddAudit(Convert.ToInt32(EventType.TrdsrcIPR), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.TrdsrcIPR), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), new Guid(LoggedInUser.UserId.ToString()), "Message=" + responseJSONfom["Message"].ToString() + "@Stack Trace=APIResponseForTM", deviceIP, GetMacAddress().ToString(), 0, "");

            }
            catch (Exception ex)
            {
                File.WriteAllText("TMSearchErrorLog.txt", ex.Message.ToString());
            }

            //return await response.Content.ReadAsStringAsync();
            return responsestrfom;
        }

        /// <summary>
        /// Method for Patent Search Page.
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization]
        [System.Web.Mvc.HttpPost]
        public async Task<IHttpActionResult> SearchIPRForPatent()
        {
            string data = "";
            try
            {
                int pagesize1 = 10, pageindex = 1;
                pageindex = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                pagesize1 = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                var IPList = QueryAES.UrlDecode(HttpContext.Current.Request.Form["IPList"]);
                var tradeId = HttpContext.Current.Request.Form["tradeid"];
                var filterpatent = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtertradmark"]);
                var ApplicationNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["applicationno"]);
                var PatentNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["patentno"]);
                var Datefilingfrom = QueryAES.UrlDecode(HttpContext.Current.Request.Form["datefilingfrom"]);
                var Datefilingto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["datefilingto"]);
                var vStatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["searchstatusforpatent"]);
                var ApplicantName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["applicantname"]);
                var Prioritydatefrom = QueryAES.UrlDecode(HttpContext.Current.Request.Form["prioritydategfrom"]);
                var Prioritydateto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["prioritydateto"]);

                var pubDatefrom = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pubDategfrom"]);
                var pubDateTo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pubDategTo"]);


                ApplicationNo = (ApplicationNo == null || ApplicationNo == "null") ? "" : ApplicationNo;
                PatentNo = (PatentNo == null || PatentNo == "null") ? "" : PatentNo;
                Datefilingfrom = (Datefilingfrom == null || Datefilingfrom == "null") ? "" : Datefilingfrom;
                Datefilingto = (Datefilingto == null || Datefilingto == "null") ? "" : Datefilingto;
                vStatus = (vStatus == null || vStatus == "null") ? "" : vStatus;
                ApplicantName = (ApplicantName == null || ApplicantName == "null") ? "" : ApplicantName;
                Prioritydatefrom = (Prioritydatefrom == null || Prioritydatefrom == "null") ? "" : Prioritydatefrom;
                Prioritydateto = (Prioritydateto == null || Prioritydateto == "null") ? "" : Prioritydateto;

                pubDatefrom = (pubDatefrom == null || pubDatefrom == "null") ? "" : pubDatefrom;
                pubDateTo = (pubDateTo == null || pubDateTo == "null") ? "" : pubDateTo;

                data = await APIResponseForPatent(IPList, ApplicationNo, PatentNo, Datefilingfrom, Datefilingto, vStatus, ApplicantName, Prioritydatefrom, Prioritydateto, filterpatent, pageindex, pagesize1, pubDatefrom, pubDateTo);
            }
            catch (Exception ex)
            {
                File.WriteAllText("ErrorLogForPatentSearch.txt", data);
            }

            return Ok(new { data = data });
        }

        public async Task<string> APIResponseForPatent(string IPList, string Applicationno, string Patentno, string Datefilingfrom, string Datefilingto, string vStatus, string ApplicantName, string Prioritydatefrom, string Prioritydateto, string filterpatent, int pagenum, int pagesize1, string pubDatefrom, string pubDateTo)
        {
            HttpResponseMessage response = new HttpResponseMessage();
            string responsestrfom = "";
            try
            {
                string userId = LoggedInUser.UserId.ToString();
                string firmId = LoggedInUser.FirmId.ToString();
                LawPracticeEntities db = new LawPracticeEntities();
                string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId;
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                int timeout = Convert.ToInt32(ConfigurationManager.AppSettings["Timeout"]);
                //var apiUrl = "http://10.60.1.42:9010/API/IPR/SearchIPR";
                var addfClient = new HttpClient();
                addfClient.Timeout = TimeSpan.FromMinutes(timeout);
                object rawfile = new
                {
                    UserId = strusername,
                    firmId = firmId,
                    Accesstoken = "mykase123456789abcdef",
                    ip = IPList,
                    ApplicationNo = Applicationno,
                    PatentNo = Patentno,
                    Datefilingfrom = Datefilingfrom,
                    Datefilingto = Datefilingto,
                    vStatus = vStatus,
                    ApplicantName = ApplicantName,
                    Prioritydatefrom = Prioritydatefrom,
                    Prioritydateto = Prioritydateto,
                    searchtext = filterpatent,
                    pageindex = pagenum,
                    pagesize = pagesize1,
                    vsort = "0",
                    colname = "",
                    pubDatefrom = pubDatefrom,
                    pubDateTo = pubDateTo

                };

                string content = JsonConvert.SerializeObject(rawfile);
                string deviceIP = myIP();
                StringContent queryString = new StringContent(content, Encoding.UTF8, "application/json");
                addfClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                response = await addfClient.PostAsync(new Uri(apiUrl + "/API/IPR/SearchIPR").ToString(), queryString);

                responsestrfom = await response.Content.ReadAsStringAsync();
                var responseJSONfom = (JObject)JsonConvert.DeserializeObject<object>(responsestrfom);
                db1.usp_AddAudit(Convert.ToInt32(EventType.PtntsrcIPR), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.PtntsrcIPR), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), new Guid(LoggedInUser.UserId.ToString()), "Message=" + responseJSONfom["Message"].ToString() + "@Stack Trace=APIResponseForPatent", deviceIP, GetMacAddress().ToString(), 0, "");

            }
            catch (Exception ex)
            {
                File.WriteAllText("ErrorLogForPatentSearch.txt", ex.Message.ToString());
            }

            return await response.Content.ReadAsStringAsync();
        }

        [FirmApiAuthorization]
        [System.Web.Mvc.HttpPost]
        public async Task<IHttpActionResult> SearchInSearch()
        {

            int count = 0;
            int pageindex = 1;
            int pagesize = 10;
            pageindex = Convert.ToInt32(HttpContext.Current.Request.Form["pageindex"]);

            int fromdata = ((pageindex - 1) * pagesize) + 1;
            int todata = (fromdata + pagesize) - 1;

            var jsonObject = new JObject();

            var searchword = HttpContext.Current.Request.Form["keyword"];

            string jsonData = HttpContext.Current.Request.Form["jsondata"];
            DataTable dt = new DataTable();
            DataTable dt1 = new DataTable();

            string jsondeserialize = JsonConvert.DeserializeObject(jsonData).ToString();

            var list = JsonConvert.DeserializeObject<SearchInSearch>(jsondeserialize);

            if (list.data != null && list.data.Count > 0)
            {
                dt.Columns.Add("RowId", typeof(int));
                dt.Columns.Add("iid");
                dt.Columns.Add("vWordMark");
                dt.Columns.Add("vProprietor");
                dt.Columns.Add("vApplNo");
                dt.Columns.Add("vClass");
                dt.Columns.Add("dApplDate");
                dt.Columns.Add("vStatus");
                dt.Columns.Add("vUsedSince");
                dt.Columns.Add("Count", typeof(int));
                dt.Columns.Add("TotalRows", typeof(int));


                foreach (var listdata in list.data)
                {
                    DataRow dr = dt.NewRow();

                    dr["RowId"] = listdata.RowId;
                    dr["iid"] = listdata.iid;
                    dr["vWordMark"] = listdata.vWordMark;
                    dr["vProprietor"] = listdata.vProprietor;
                    dr["vApplNo"] = listdata.vApplNo;
                    dr["vClass"] = listdata.vClass;
                    dr["dApplDate"] = listdata.dApplDate;
                    dr["vStatus"] = listdata.vStatus;
                    dr["vUsedSince"] = listdata.vUsedSince;

                    dt.Rows.Add(dr);
                }
            }

            DataView dv = new DataView(dt);
            dv.RowFilter = "vWordMark like'%" + searchword + "%'";

            dt1 = dv.ToTable(dt.TableName);

            //dt1.
            foreach (DataRow dr in dt1.Rows)
            {
                count = count + 1;
                dr["Count"] = count;
                dr["TotalRows"] = dt1.Rows.Count;
            }
            DataView dv1 = new DataView(dt1);
            dv1.RowFilter = "Count >=" + fromdata + "and Count <=" + todata;
            DataTable dt2 = dv1.ToTable();

            string JsonString = JsonConvert.SerializeObject(dt2);

            //jsonObject = JObject.Parse(JsonString);

            return Ok(new { data = JsonString });
        }

        [FirmApiAuthorization]
        [System.Web.Mvc.HttpPost]
        public async Task<IHttpActionResult> DataForSearchInSearch()
        {
            string userId = LoggedInUser.UserId.ToString();
            LawPracticeEntities db = new LawPracticeEntities();
            string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId;
            var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
            int timeout = Convert.ToInt32(ConfigurationManager.AppSettings["Timeout"]);
            //var apiUrl = "http://10.60.1.42:9010/API/IPR/SearchIPR";
            var addfClient = new HttpClient();
            addfClient.Timeout = TimeSpan.FromMinutes(timeout);
            object rawfile = new
            { };

            string content = JsonConvert.SerializeObject(rawfile);

            StringContent queryString = new StringContent(content, Encoding.UTF8, "application/json");
            addfClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            var response = await addfClient.PostAsync(new Uri(apiUrl + "/API/IPR/SearchInSearch").ToString(), queryString);
            string result = await response.Content.ReadAsStringAsync();

            return Ok(new { data = result });

            //var jsonObject = new JObject();

            //var dt = DataAccessADO.SearchInSearch();
            //if (dt.Rows.Count > 0)
            //{
            //    jsonObject.Add("Status", true);
            //    jsonObject.Add("Message", "Successfully");
            //    jsonObject["data"] = JToken.FromObject(dt);
            //}

            //return Ok(new { data = jsonObject });
        }
        public int updateCounter(string keywordValue)
        {
            IPRRepository repo = new IPRRepository();
            var userId = LoggedInUser.UserId.ToString();
            var firmId = LoggedInUser.FirmId.ToString();
            LawPracticeEntities db = new LawPracticeEntities();
            int i = repo.UpdateCounterForIPR(keywordValue, userId, firmId);

            return i;
        }

        /// <summary>
        /// Method for Copyright Search Page
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public async Task<IHttpActionResult> CopyrightSearchList()
        {
            string data = "";
            try
            {
                var pagesize = 10;
                var pagenum = 1;
                var iplist = HttpContext.Current.Request.Form["IPList"];
                var filtertrademark = HttpContext.Current.Request.Form["filtertradmark"];
                var diaryno = HttpContext.Current.Request.Form["diaryno"];
                var category = HttpContext.Current.Request.Form["ctgry"];
                var datefrom = HttpContext.Current.Request.Form["dtFrom"];
                var dateto = HttpContext.Current.Request.Form["dtTo"];
                var applicant = HttpContext.Current.Request.Form["applicant"];
                var rocno = HttpContext.Current.Request.Form["roc"];
                var vstatus = HttpContext.Current.Request.Form["statusforcopyright"];
                pagesize = Convert.ToInt32(HttpContext.Current.Request.Form["pagesize"]);
                pagenum = Convert.ToInt32(HttpContext.Current.Request.Form["pagenum"]);
                datefrom = (datefrom == null || datefrom == "null") ? "" : datefrom;
                dateto = (dateto == null || dateto == "null") ? "" : dateto;
                diaryno = (diaryno == null || diaryno == "null") ? "" : diaryno;
                category = (category == null || category == "null") ? "" : category;
                pagesize = (pagesize == 0) ? 10 : pagesize;
                pagenum = (pagenum == 0) ? 1 : pagenum;
                data = await CopyrightSearchAPI(applicant, filtertrademark, iplist, datefrom, dateto, diaryno, category, pagesize, pagenum, rocno, vstatus);
            }
            catch (Exception ex)
            {
                //db1.usp_AddAuditError(Convert.ToInt32(EventType.IPR), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.IPR), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            return Ok(new { data = data });
        }

        public async Task<string> CopyrightSearchAPI(string applicantname, string searchtext, string Ip, string datefrom, string dateto, string diaryno, string category, int pagesize, int pagenum, string RocNo, string vstatus)
        {
            string responsestrfom = "";
            try
            {
                string userId = LoggedInUser.UserId.ToString();
                string firmId = LoggedInUser.FirmId.ToString();
                LawPracticeEntities db = new LawPracticeEntities();
                string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId;
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                var addfClient = new HttpClient();
                object rawfile = new
                {
                    userid = strusername,
                    firmId = firmId,
                    Accesstoken = "mykase123456789abcdef",
                    searchtext = searchtext,
                    diaryno = diaryno,
                    category = category,
                    datefrom = datefrom,
                    dateto = dateto,
                    applicant = applicantname,
                    rocno = RocNo,
                    vstatus = vstatus,
                    pageindex = pagenum,
                    pagesize = pagesize,
                    vsort = 0,
                    colname = "",
                    ip = Ip
                };

                string content = JsonConvert.SerializeObject(rawfile);
                string deviceIP = myIP();
                StringContent queryString = new StringContent(content, Encoding.UTF8, "application/json");
                addfClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var response = await addfClient.PostAsync(new Uri(apiUrl + "/API/IPR/SearchIPR").ToString(), queryString);

                responsestrfom = await response.Content.ReadAsStringAsync();
                var responseJSONfom = (JObject)JsonConvert.DeserializeObject<object>(responsestrfom);
                db1.usp_AddAudit(Convert.ToInt32(EventType.CpysrcIPR), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.CpysrcIPR), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), new Guid(LoggedInUser.UserId.ToString()), "Message=" + responseJSONfom["Message"].ToString() + "@Stack Trace=CopyrightSearchAPI", deviceIP, GetMacAddress().ToString(), 0, "");

                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        /// <summary>
        /// Method for Design Search Page  
        /// </summary>
        /// <returns>The list for the 'Design' search page</returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public async Task<IHttpActionResult> DesignSearchList()
        {
            string data = "";
            try
            {

                var pagesize = 10;
                var pagenum = 1;
                var filtertrademark = HttpContext.Current.Request.Form["filtertradmark"];
                var designno = HttpContext.Current.Request.Form["designnum"];
                var iplist = "5";
                var appDetails = HttpContext.Current.Request.Form["applicantdetails"];
                var status = HttpContext.Current.Request.Form["status"];
                var dateofregisterfrom = HttpContext.Current.Request.Form["registerfromdate"];
                var dateofregisterto = HttpContext.Current.Request.Form["registertodate"];
                var title = HttpContext.Current.Request.Form["title"];
                if (title == "undefined" || title == null || title == "null")
                {
                    title = "";
                }

                var pcountry = HttpContext.Current.Request.Form["country"];
                if (pcountry == "undefined" || pcountry == null || pcountry == "null")
                {
                    pcountry = "";
                }
                var vClass = HttpContext.Current.Request.Form["vclass"];
                pagesize = Convert.ToInt32(HttpContext.Current.Request.Form["pagesize"]);
                pagenum = Convert.ToInt32(HttpContext.Current.Request.Form["pagenum"]);

                designno = (designno == null || designno == "null") ? "" : designno;
                iplist = (iplist == null || iplist == "null") ? "5" : iplist;
                appDetails = (appDetails == null || appDetails == "null") ? "" : appDetails;
                status = (status == null || status == "null") ? "" : status;
                dateofregisterfrom = (dateofregisterfrom == null || dateofregisterfrom == "null") ? "" : dateofregisterfrom;
                dateofregisterto = (dateofregisterto == null || dateofregisterto == "null") ? "" : dateofregisterto;
                title = (title == null || title == "null") ? "" : title;
                vClass = (vClass == null || vClass == "null" || vClass == "undefined") ? "" : vClass;
                pcountry = (pcountry == null || pcountry == "null") ? "" : pcountry;
                pagesize = (pagesize == 0) ? 10 : pagesize;
                pagenum = (pagenum == 0) ? 1 : pagenum;
                data = await DesignSearchAPI(designno, vClass, filtertrademark, iplist, appDetails, status, dateofregisterfrom, dateofregisterto, title, pcountry, pagenum, pagesize);
            }
            catch (Exception ex)
            {
                //db1.usp_AddAuditError(Convert.ToInt32(EventType.IPR), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.IPR), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            return Ok(new { data = data });
        }

        public async Task<string> DesignSearchAPI(string Designno, string vClass, string Searchtext, string Ip, string AppDetails, string Status, string DateofRegisterFrom, string DateofRegisterTo, string Title, string PCountry, int Pagenum, int Pagesize)
        {
            string responsestrfom = "";
            try
            {
                string userId = LoggedInUser.UserId.ToString();
                string firmId = LoggedInUser.FirmId.ToString();
                LawPracticeEntities db = new LawPracticeEntities();
                string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId;
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                //var apiUrl = "http://10.60.1.42:9010/API/IPR/SearchIPR";
                var addfClient = new HttpClient();
                object rawfile = new
                {
                    userid = strusername,
                    firmId = firmId,
                    Accesstoken = "mykase123456789abcdef",
                    searchtext = Searchtext,
                    ip = Ip,
                    designno = Designno,
                    vclass = vClass,
                    appdetails = AppDetails,
                    Status = Status,
                    dateofRegisterFrom = DateofRegisterFrom,
                    dateofRegisterTo = DateofRegisterTo,
                    title = Title,
                    pcountry = PCountry,
                    pageindex = Pagenum,
                    pagesize = Pagesize,
                    vsort = 0,
                    colname = "",
                };

                string content = JsonConvert.SerializeObject(rawfile);
                string deviceIP = myIP();
                StringContent queryString = new StringContent(content, Encoding.UTF8, "application/json");
                addfClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var response = await addfClient.PostAsync(new Uri(apiUrl + "/API/IPR/SearchIPR").ToString(), queryString);

                responsestrfom = await response.Content.ReadAsStringAsync();
                var responseJSONfom = (JObject)JsonConvert.DeserializeObject<object>(responsestrfom);
                db1.usp_AddAudit(Convert.ToInt32(EventType.DgnsrcIPR), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.DgnsrcIPR), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), new Guid(LoggedInUser.UserId.ToString()), "Message=" + responseJSONfom["Message"].ToString() + "@Stack Trace=DesignSearchAPI", deviceIP, GetMacAddress().ToString(), 0, "");
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx End xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

        /// <summary>
        /// Method for GI Search Page
        /// </summary>
        /// <returns>returns a list of searched GI</returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public async Task<IHttpActionResult> GISearchList()
        {
            string data = "";
            try
            {
                var pagesize = 10;
                var pagenum = 1;
                var filtertrademark = HttpContext.Current.Request.Form["filtertradmark"];
                var iplist = HttpContext.Current.Request.Form["IPList"];
                var applicationno = HttpContext.Current.Request.Form["applicationno"];
                var status = HttpContext.Current.Request.Form["status"];
                var vclass = HttpContext.Current.Request.Form["vclass"];
                var journalno = HttpContext.Current.Request.Form["journalno"];
                var datefrom = HttpContext.Current.Request.Form["doffrom"];
                var dateto = HttpContext.Current.Request.Form["dofto"];
                var validupto = HttpContext.Current.Request.Form["registdate"];
                var vsort = 0;
                var vcolname = HttpContext.Current.Request.Form["colname"];

                pagenum = Convert.ToInt32(HttpContext.Current.Request.Form["pagenum"]);

                iplist = (iplist == null || iplist == "null") ? "4" : iplist;
                applicationno = (applicationno == null || applicationno == "null") ? "" : applicationno;
                status = (status == null || status == "null") ? "" : status;
                vclass = (vclass == null || vclass == "null") ? "" : vclass;
                journalno = (journalno == null || journalno == "null") ? "" : journalno;
                datefrom = (datefrom == null || datefrom == "null") ? "" : datefrom;
                dateto = (dateto == null || dateto == "null") ? "" : dateto;
                validupto = (validupto == null || validupto == "null") ? "" : validupto;
                vcolname = (vcolname == null || vcolname == "null") ? "" : vcolname;
                pagesize = (pagesize == 0) ? 10 : pagesize;
                pagenum = (pagenum == 0) ? 1 : pagenum;

                data = await GISearchAPI(filtertrademark, iplist, applicationno, status, vclass, journalno, datefrom, dateto, validupto, vsort, vcolname, pagenum, pagesize);

            }
            catch (Exception ex)
            {
                //db1.usp_AddAuditError(Convert.ToInt32(EventType.IPR), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.IPR), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            return Ok(new { data = data });
        }

        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public async Task<string> GISearchAPI(string searchtext, string iplist, string applicationno, string status, string vclass, string journalno, string datefrom, string dateto, string validupto, int vsort, string colname, int pagenum, int pagesize)
        {
            string responsestrfom = "";
            try
            {
                string userId = LoggedInUser.UserId.ToString();
                string firmId = LoggedInUser.FirmId.ToString();
                LawPracticeEntities db = new LawPracticeEntities();
                string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId;
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                var addfClient = new HttpClient();
                object rawfile = new
                {
                    userid = strusername,
                    firmId = firmId,
                    Accesstoken = "mykase123456789abcdef",
                    searchtext = searchtext,
                    ip = iplist,
                    ApplicationNo1 = applicationno,
                    Status1 = status,
                    vClass1 = vclass,
                    JournalNo1 = journalno,
                    DateFrom = datefrom,
                    DateTo = dateto,
                    ValidUpto = validupto,
                    vsort = vsort,
                    colname = colname,
                    pageindex = pagenum,
                    pagesize = pagesize
                };

                string content = JsonConvert.SerializeObject(rawfile);
                string deviceIP = myIP();

                StringContent queryString = new StringContent(content, Encoding.UTF8, "application/json");
                addfClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var response = await addfClient.PostAsync(new Uri(apiUrl + "/API/IPR/SearchIPR").ToString(), queryString);

                responsestrfom = await response.Content.ReadAsStringAsync();
                var responseJSONfom = (JObject)JsonConvert.DeserializeObject<object>(responsestrfom);
                db1.usp_AddAudit(Convert.ToInt32(EventType.GIsrcIPR), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.GIsrcIPR), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), new Guid(LoggedInUser.UserId.ToString()), "Message=" + responseJSONfom["Message"].ToString() + "@Stack Trace=GISearchAPI", deviceIP, GetMacAddress().ToString(), 0, "");

                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        /// <summary>
        /// Method for Inserting Keyword for Proprietor 
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public async Task<IHttpActionResult> ProprietorInsert()
        {
            int data = 0;
            var userId = LoggedInUser.UserId.ToString();
            var firmId = LoggedInUser.FirmId.ToString();
            var searchtext = HttpContext.Current.Request.Form["filtertradmark"];

            var category = HttpContext.Current.Request.Form["category"];
            dynamic categoriesArray = null;
            if (!string.IsNullOrEmpty(category))
            {
                categoriesArray = category.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
            }

            try
            {
                foreach (var cat in categoriesArray)
                {
                    var db = new LawPracticeEntities();
                    data = db.sp_InsertIPRProprietorSearch(searchtext, firmId, userId, "");
                }
            }

            catch (Exception ex)
            {
                return Ok("There was an error");
            }

            return Ok(new { data = data });
        }

        /// <summary>
        /// Method for Proprietor Search Page
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public async Task<IHttpActionResult> ProprietorSearchList()
        {
            List<sp_GetIPRProprietorSearchResults_Result> data = new List<sp_GetIPRProprietorSearchResults_Result>();
            string SerializedValue = "";
            var userId = LoggedInUser.UserId.ToString();
            var firmId = LoggedInUser.FirmId.ToString();
            var searchtext = HttpContext.Current.Request.Form["filtertradmark"];
            var pageindex = HttpContext.Current.Request.Form["pageNum"];
            var pageSize = HttpContext.Current.Request.Form["pagesize"];

            try
            {
                var db = new LawPracticeEntities();
                data = db.sp_GetIPRProprietorSearchResults(userId, firmId, "", "", "", "", 0, 0, Convert.ToInt32(pageindex), Convert.ToInt32(pageSize), 0, "").ToList();

                SerializedValue = JsonConvert.SerializeObject(data);
            }

            catch (Exception ex)
            {
                return Ok("There was an error");
            }

            return Ok(new { data = SerializedValue });
        }

        /// <summary>
        /// Load IPR Data By Tradeid
        /// </summary>
        /// <returns></returns>

        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public async Task<IHttpActionResult> loadtrademarkdatabyiid()
        {
            var tradeid = Convert.ToString(HttpContext.Current.Request.Form["tradeid"]);
            var IpValue = Convert.ToString(HttpContext.Current.Request.Form["ip"]);
            var data = await IPRDetailsbyIid(tradeid, IpValue);
            return Ok(new { data = data });
        }
        public async Task<string> IPRDetailsbyIid(string tradeid, string iptype)
        {
            try
            {
                string userId = LoggedInUser.UserId.ToString();
                LawPracticeEntities db = new LawPracticeEntities();
                string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId;
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                var addfClient = new HttpClient();
                object rawfile = new
                {
                    userid = strusername,
                    Accesstoken = "mykase123456789abcdef",
                    iid = tradeid,
                    ip = iptype
                };

                string content = JsonConvert.SerializeObject(rawfile);
                StringContent queryString = new StringContent(content, Encoding.UTF8, "application/json");
                addfClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var response = await addfClient.PostAsync(new Uri(apiUrl + "/API/IPR/IPRDetailsbyIid").ToString(), queryString);
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                return ex.Message;
            }

        }

        /// <summary>
        /// Adding Data For Trademark By Tradeid 
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CreateIPRCase()
        {
            string hidden = QueryAES.UrlDecode(HttpContext.Current.Request.Form["hidden"]);
            string LoginUserId = LoggedInUser.UserId.ToString();
            string UserType = LoggedInUser.RoleId.ToString();
            var FirmId = LoggedInUser.FirmId.ToString();
            var Username = LoggedInUser.UserFullName.ToString();
            var iptype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["iptype"]);
            var Applicantdetail = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Applicantdetail"]);
            var ddlApplicantType = QueryAES.UrlDecodeEditor(HttpContext.Current.Request.Form["ddlApplicantType"]);
            var name = QueryAES.UrlDecode(HttpContext.Current.Request.Form["name"]);
            var Address = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Address"]);
            var Country = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Country"]);
            var State = QueryAES.UrlDecode(HttpContext.Current.Request.Form["State"]);
            var District = QueryAES.UrlDecode(HttpContext.Current.Request.Form["District"]);
            var EmailId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["EmailId"]);
            var PhoneNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["PhoneNo"]);
            var LegalStatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["LegalStatus"]);
            var UseOfMark = QueryAES.UrlDecode(HttpContext.Current.Request.Form["UseOfMark"]);
            var CategoryOfMark = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CategoryOfMark"]);
            var trademark = QueryAES.UrlDecode(HttpContext.Current.Request.Form["trademark"]);
            var ConditionsLimitations = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ConditionsLimitations"]);
            var txtclass = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtclass"]);
            var Priority = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Priority"]);
            var ImageDes = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ImageDes"]);
            var IPRDate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["IPRDate"]);
            var iprtype = HttpContext.Current.Request.Form["ip"];

            try
            {
                var caseid = "";
                string Id = hidden;
                if (Id == null || Id == "null")
                {
                    Id = "";
                }
                DateTime date_tine = DateTime.Now;

                /// Insert new Data or Update data
                var result1 = DataAccessIPRADO.saveipr(Id, LoginUserId, FirmId, iptype, ddlApplicantType, name, Address, Country, State,
                District, EmailId, PhoneNo, LegalStatus, UseOfMark, CategoryOfMark, trademark, ImageDes, "", ConditionsLimitations, txtclass, Priority, 1, 0, date_tine, IPRDate, Convert.ToInt32(iprtype));

                caseid = result1.Rows[0]["CaseID"].ToString(); /// Primary key
                var updateflag = result1.Rows[0]["updateflag"].ToString(); /// Flag for check data Updated if updateflag is 1

                if (updateflag == "2")
                {
                    return Ok(new { Status = false, data = "Application Name Already Exits." });
                }
                var createiprtype = iprtype;
                if (createiprtype == "1")
                {
                    iprtype = "Trademark";
                }

                try
                {
                    /// Create Folder Function
                    if (!string.IsNullOrEmpty(caseid.ToString()))
                    {
                        var resultdata = CommonDocIntegration.CreateIPRFolder(LoggedInUser.UserId.ToString(), LoggedInUser.FirmId.ToString(), caseid.ToString(), "CreateIPR", iprtype, null, name, UserType, Username, updateflag);
                    }
                }
                catch { }
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
            return Ok(new { Status = true, data = "OK" });
        }

        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public async Task<IHttpActionResult> AddTrademarkData()
        {
            TrademarkDetailsList list = new TrademarkDetailsList();

            var tradeid = Convert.ToString(HttpContext.Current.Request.Form["tradeid"]);
            var ipListValue = Convert.ToString(HttpContext.Current.Request.Form["ip"]);
            var data = await IPRDetailsbyIid(tradeid, ipListValue);
            list = new System.Web.Script.Serialization.JavaScriptSerializer().Deserialize<TrademarkDetailsList>(data);
            string flag = await AddTrademarkDataById(list);
            return Ok(new { data = data, flag = flag });
            //return Ok(new { data = data });
        }
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public async Task<IHttpActionResult> ViewAddedTradeMarkDetails()
        {
            //var testdata = storedData;
            var searchD = HttpContext.Current.Request.QueryString["AppNo"];
            //var allParams = HttpContext.Current.Request.QueryString;
            //foreach (string key in allParams.AllKeys)
            //{
            //    System.Diagnostics.Debug.WriteLine($"Key: {key}, Value: {allParams[key]}");
            //}
            int pagesize1 = 10, pageindex = 1;
            string searchstatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["searchstatus"]);
            searchstatus = searchstatus.Replace("&amp;", "&");
            //switch (HttpContext.Current.Request.QueryString["Status"])
            //{
            //    case "Registered":
            //        searchstatus = HttpContext.Current.Request.QueryString["Status"];
            //        break;

            //    case "Pending":
            //        searchstatus = HttpContext.Current.Request.QueryString["Status"];
            //        break;

            //    case null:
            //        searchstatus = "";
            //        break;

            //    case "undefined":
            //        searchstatus = "";
            //        break;
            //}

            //if (HttpContext.Current.Request.UrlReferrer.Query.Split('=').Length == 3)
            //{
            //    searchstatus = HttpContext.Current.Request.UrlReferrer.Query.Split('=')[2];
            //}

            //else
            //{

            //}

            pageindex = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
            pagesize1 = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
            var IPList = QueryAES.UrlDecode(HttpContext.Current.Request.Form["IPList"]);
            var filtertradmark = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtertradmark"]);
            var searchclass = QueryAES.UrlDecode(HttpContext.Current.Request.Form["searchclass"]);
            var Proprietor = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Proprietor"]);
            var applicationno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["applicationno"]);
            var dateapplicationto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtdateapplicationto"]);
            var dateapplicationfrom = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtdateapplicationfrom"]);
            var sort = HttpContext.Current.Request.Form["vsort"];
            var colname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["colname"]);
            var dHearingDatefrom = QueryAES.UrlDecode(HttpContext.Current.Request.Form["hearingFrmDate"]);
            var dHearingDateto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["hearingToDate"]);
            if(dHearingDateto=="Invalid Date")
            {
                dHearingDateto = "";
            }
            if(dHearingDateto== "Invalid Date")
            {
                dHearingDateto = "";
            }
            var IPRCounter = HttpContext.Current.Request.Form["iprcounter"];

            var httpRequest = HttpContext.Current.Request;

            if (sort == null || sort == "" || sort == "undefined")
            {
                sort = "0";
            }

            if (colname == null || colname == "undefined")
            {
                colname = "";
            }

            string message = "";
            string userId = LoggedInUser.UserId.ToString();
            string firmId = LoggedInUser.FirmId.ToString();
            var db = new IPRRepository();

            var ds = db.GetAddedIPRTrademark(userId, firmId, searchclass, Proprietor, dateapplicationfrom, dateapplicationto, searchstatus, "", "", "", "", filtertradmark, applicationno, "", pageindex, pagesize1, Convert.ToInt32(sort), colname, dHearingDatefrom,dHearingDateto).ToList();

            var js = JsonConvert.SerializeObject(ds);

            return Ok(new { data = js });
        }

        /// <summary>
        /// This method is used for binding the added copyright data to the page
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public async Task<IHttpActionResult> ViewAddedCopyrightDetails()
        {
            DataTable dt = new DataTable();
            try
            {
                int pageNum = 1;
                int pageSize = 10;
                var userId = LoggedInUser.UserId.ToString();
                var firmId = LoggedInUser.FirmId.ToString();
                string vStatus = HttpContext.Current.Request.Form["statusforcopyright"];
                pageNum = Convert.ToInt16(HttpContext.Current.Request.Form["pagenum"]);
                pageSize = Convert.ToInt16(HttpContext.Current.Request.Form["pagesize"]);
                var searchtext = HttpContext.Current.Request.Form["filtertradmark"];
                var diaryno = HttpContext.Current.Request.Form["txtdiaryno"];
                var categoryno = HttpContext.Current.Request.Form["ctgry"];
                var datefrom = HttpContext.Current.Request.Form["txtdatefrom"];
                var dateto = HttpContext.Current.Request.Form["txtdateto"];
                var applicant = HttpContext.Current.Request.Form["txtApplicant"];
                var rocno = HttpContext.Current.Request.Form["txtroc"];
                var iprcounter = HttpContext.Current.Request.Form["hdncounter"];
                var sort = Convert.ToInt32(HttpContext.Current.Request.Form["vsort"]);
                var colname = HttpContext.Current.Request.Form["colname"];

                diaryno = (diaryno == null || diaryno == "null") ? "" : diaryno;
                categoryno = (categoryno == null || categoryno == "null") ? "" : categoryno;
                datefrom = (datefrom == null || datefrom == "null") ? "" : datefrom;
                dateto = (dateto == null || dateto == "null") ? "" : dateto;
                applicant = (applicant == null || applicant == "null") ? "" : applicant;
                rocno = (rocno == null || rocno == "null") ? "" : rocno;
                iprcounter = (iprcounter == null || iprcounter == "null") ? "" : iprcounter;
                colname = (colname == null || colname == "null") ? "" : colname;
                vStatus = (vStatus == "null" || string.IsNullOrEmpty(vStatus)) ? "" : vStatus;

                var vStatuslist = "";
                if (vStatus != "")
                {
                    foreach (var item in vStatus.Split(','))
                    {
                        vStatuslist += "'" + item + "',";
                    }
                    vStatuslist = vStatuslist.TrimStart('\'');
                    vStatuslist = vStatuslist.TrimEnd('\'', ',');
                }

                dt = DataAccessIPRADO.GetIPRCopyrightList(userId, firmId, pageNum, pageSize, searchtext, diaryno, categoryno, datefrom, dateto, vStatuslist, applicant, rocno, sort, colname);

            }
            catch (Exception ex)
            {
            }

            return Ok(new { data = dt });
        }

        /// <summary>
        /// This method is used for Viewing Added Patent
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public async Task<IHttpActionResult> ViewAddedPatentDetails()
        {
            DataTable dt = new DataTable();
            try
            {
                int pageNum = 1, pageSize = 10;
                string vStatus = "";
                var userId = LoggedInUser.UserId.ToString();
                var firmId = LoggedInUser.FirmId.ToString();
                var searchtext = HttpContext.Current.Request.Form["filtertradmark"];
                var applicationno = HttpContext.Current.Request.Form["applicationno"];
                vStatus = HttpContext.Current.Request.Form["vstatus"];
                var applicantName = HttpContext.Current.Request.Form["applicant"];
                var patentno = HttpContext.Current.Request.Form["patentno"];
                var datefrom = HttpContext.Current.Request.Form["datefrom"];
                var dateto = HttpContext.Current.Request.Form["dateto"];
                var priorityDateFrom = HttpContext.Current.Request.Form["pdatefrom"];
                var priorityDateTo = HttpContext.Current.Request.Form["pdateto"];
                var publishDateFrom = HttpContext.Current.Request.Form["pubDateFrom"];
                var publishDateTo = HttpContext.Current.Request.Form["pubDateTo"];
                pageNum = Convert.ToInt16(HttpContext.Current.Request.Form["pagenum"]);
                pageSize = Convert.ToInt16(HttpContext.Current.Request.Form["pagesize"]);

                searchtext = (searchtext == null || searchtext == "null") ? "" : searchtext;
                applicationno = (applicationno == null || applicationno == "null") ? "" : applicationno;
                vStatus = (vStatus == null || vStatus == "null") ? "" : vStatus;
                applicantName = (applicantName == null || applicantName == "null") ? "" : applicantName;
                patentno = (patentno == null || patentno == "null") ? "" : patentno;
                datefrom = (datefrom == null || datefrom == "null") ? "" : datefrom;
                dateto = (dateto == null || dateto == "null") ? "" : dateto;
                priorityDateFrom = (priorityDateFrom == null || priorityDateFrom == "null") ? "" : priorityDateFrom;
                priorityDateTo = (priorityDateTo == null || priorityDateTo == "null") ? "" : priorityDateTo;
                publishDateFrom = (publishDateFrom == null || publishDateFrom == "null") ? "" : publishDateFrom;
                publishDateTo = (publishDateTo == null || publishDateTo == "null") ? "" : publishDateTo;

                dt = DataAccessIPRADO.GetAddedPatentDetails(userId, firmId, pageNum, pageSize, searchtext, datefrom, dateto, vStatus, applicantName, priorityDateFrom, priorityDateTo, publishDateFrom, publishDateTo, patentno, applicationno);
                string vappNoList = "";
                foreach (DataRow row in dt.Rows)
                {
                    vappNoList += row["vApplNo"].ToString() + "','";
                }
                JObject jObject = new JObject();
                try
                {
                    var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        vApplNo = vappNoList.TrimEnd('\'', ','),
                    };
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var res = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/PatentDoccountByAppNo"), "POST", builders);
                    jObject = JObject.Parse(res);

                    dt.Columns.Add("DocCount", typeof(String));
                    dt.Columns.Add("DecisionDocCount", typeof(String));
                    foreach (DataRow row in dt.Rows)
                    {
                        foreach (var x in jObject["data"])
                        {
                            if (row["vApplNo"].ToString() == x["vApplNo"].ToString())
                            {
                                if (x["DocName"].ToString() == "DocFile") row["DocCount"] = x["fileCount"].ToString();
                                if (x["DocName"].ToString() == "DecisionFile") row["DecisionDocCount"] = x["fileCount"].ToString();
                            }
                        }
                    }
                }
                catch (Exception ex) { }
            }
            catch (Exception ex)
            {
            }
            return Ok(new { data = dt });
        }

        /// <summary>
        /// This method is used for binding the added GI data to the page
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        //public async Task<IHttpActionResult> ViewAddedGIDetails()
        public IHttpActionResult ViewAddedGIDetails()
        {
            int pageNum = 1;
            int pageSize = 10;
            string searchstatus = "";
            searchstatus = HttpContext.Current.Request.Form["drpstatusforgi"];
            pageNum = Convert.ToInt16(HttpContext.Current.Request.Form["pagenum"]);
            pageSize = Convert.ToInt16(HttpContext.Current.Request.Form["pagesize"]);
            var searchtext = HttpContext.Current.Request.Form["filtertradmark"];
            var applicationname = HttpContext.Current.Request.Form["applicationname"];
            var applicationno = HttpContext.Current.Request.Form["txtapplicationno"];
            var vclass = HttpContext.Current.Request.Form["searchclass"];
            var journalno = HttpContext.Current.Request.Form["journalno"];
            var doffrom = HttpContext.Current.Request.Form["txtdatefilingfrom"];
            var dofto = HttpContext.Current.Request.Form["txtdatefilingto"];
            var registdate = HttpContext.Current.Request.Form["validupto"];
            var sort = Convert.ToInt32(HttpContext.Current.Request.Form["sort"]);
            var colname = HttpContext.Current.Request.Form["colname"];

            applicationno = (applicationno == null || applicationno == "null") ? "" : applicationno;
            searchstatus = (searchstatus == null || searchstatus == "null") ? "" : searchstatus;
            vclass = (vclass == null || vclass == "null") ? "" : vclass;
            journalno = (journalno == null || journalno == "null") ? "" : journalno;
            doffrom = (doffrom == null || doffrom == "null") ? "" : doffrom;
            dofto = (dofto == null || dofto == "null") ? "" : dofto;
            registdate = (registdate == null || registdate == "null") ? "" : registdate;
            colname = (colname == null || colname == "null") ? "" : colname;

            var userId = LoggedInUser.UserId.ToString();
            var firmId = LoggedInUser.FirmId.ToString();

            var db = new IPRRepository();
            var data = db.GetAddedGIDetails(userId, firmId, searchtext, applicationno, searchstatus, applicationname, vclass, journalno, doffrom, dofto, registdate, pageNum, pageSize, sort, "");
            //var newdata = JsonConvert.SerializeObject(data);

            return Ok(new { data = data });

        }

        /// <summary>
        /// This method is used for binding the added GI data to the page
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ViewAddedDesignDetails()
        {
            var pagesize = 10;
            var pagenum = 1;

            string status = "";
            status = HttpContext.Current.Request.Form["status"];
            var filtertrademark = HttpContext.Current.Request.Form["filtertradmark"];
            var designno = HttpContext.Current.Request.Form["designnum"];
            var iplist = "5";
            var appDetails = HttpContext.Current.Request.Form["applicantdetails"];
            var dateofregisterfrom = HttpContext.Current.Request.Form["registerfromdate"];
            var dateofregisterto = HttpContext.Current.Request.Form["registertodate"];
            var title = HttpContext.Current.Request.Form["title"];
            var pcountry = HttpContext.Current.Request.Form["country"];
            var vClass = HttpContext.Current.Request.Form["searchclassforDesign"];
            pagesize = Convert.ToInt32(HttpContext.Current.Request.Form["pagesize"]);
            pagenum = Convert.ToInt32(HttpContext.Current.Request.Form["pagenum"]);

            designno = (designno == null || designno == "null") ? "" : designno;
            iplist = (iplist == null || iplist == "null") ? "5" : iplist;
            appDetails = (appDetails == null || appDetails == "null") ? "" : appDetails;
            status = (status == null || status == "null") ? "" : status;
            dateofregisterfrom = (dateofregisterfrom == null || dateofregisterfrom == "null") ? "" : dateofregisterfrom;
            dateofregisterto = (dateofregisterto == null || dateofregisterto == "null") ? "" : dateofregisterto;
            title = (title == null || title == "null" || title == "undefined") ? "" : title;
            pcountry = (pcountry == null || pcountry == "null" || pcountry == "undefined") ? "" : pcountry;
            vClass = (vClass == null || vClass == "null" || vClass == "undefined") ? "" : vClass;
            pagesize = (pagesize == 0) ? 10 : pagesize;
            pagenum = (pagenum == 0) ? 1 : pagenum;

            var userId = LoggedInUser.UserId.ToString();
            var firmId = LoggedInUser.FirmId.ToString();

            var db = new IPRRepository();
            var data = db.ViewAddedDesign(userId, firmId, filtertrademark, designno, vClass, appDetails, status, title, pagenum, pagesize, 0, "", dateofregisterfrom, dateofregisterto);
            var newdata = JsonConvert.SerializeObject(data);

            return Ok(new { data = newdata });

        }
        public async Task<string> AddTrademarkDataById(TrademarkDetailsList list)
        {

            int cnnt = 0;
            string msg = "";
            var db = new LawPracticeEntities();
            string userId = LoggedInUser.UserId.ToString();
            string firmId = LoggedInUser.FirmId.ToString();

            try
            {
                cnnt = db.sp_AddUserTrademarkData(Convert.ToInt32(list.data[0].iid), Convert.ToInt32(list.data[0].ifid), Convert.ToString(list.data[0].vWordMark), Convert.ToString(list.data[0].vProprietor), Convert.ToString(list.data[0].vApplNo), Convert.ToString(list.data[0].vClass), Convert.ToString(list.data[0].dApplDate), Convert.ToString(list.data[0].vJournalNo), Convert.ToString(list.data[0].dJournalDate), Convert.ToString(list.data[0].vStatus), Convert.ToString(list.data[0].vUsedSince), Convert.ToString(list.data[0].dValidUpto), "", "", Convert.ToString(list.data[0].vImgPath), Convert.ToString(list.data[0].Agent), Convert.ToString(list.data[0].AgentAddress), firmId, userId);
            }


            catch (Exception ex)
            {
                throw ex;
            }

            return cnnt.ToString();
        }
        

        /// <summary>
        /// Method For Add Patent Data 
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public async Task<IHttpActionResult> AddPatentData()
        {
            PatentDetailsList list = new PatentDetailsList();
            var tradeid = HttpContext.Current.Request.Form["tradeid"];
            var ipListValue = Convert.ToString(HttpContext.Current.Request.Form["ip"]);
            var data = await IPRDetailsbyIid(Convert.ToString(tradeid), ipListValue);
            list = new System.Web.Script.Serialization.JavaScriptSerializer().Deserialize<LawPracticeFirm.Models.PatentDetailsList>(data);
            //list = (PatentDetailsList)JsonConvert.DeserializeObject(data);

            var patentAddMethod = AddPatentDataById(list, tradeid).ToString();
            return Ok(new { flag = patentAddMethod });
            //var patentAddMethod = AddPatentDataById(list, tradeid).ToString();
            //return Ok(new { data = patentAddMethod });
        }

        public string AddPatentDataById(PatentDetailsList list, string tradeid)
        {
            var db = new IPRRepository();
            var userId = LoggedInUser.UserId.ToString();
            var firmId = LoggedInUser.FirmId.ToString();

            list.data[0].dDateOffiling = (list.data[0].dDateOffiling == null || list.data[0].dDateOffiling == "null") ? "" : list.data[0].dDateOffiling;
            list.data[0].vInventionTitle = (list.data[0].vInventionTitle == null || list.data[0].vInventionTitle == "null") ? "" : list.data[0].vInventionTitle;
            list.data[0].PatentNo = (list.data[0].PatentNo == null || list.data[0].PatentNo == "null") ? "" : list.data[0].PatentNo;
            list.data[0].vApplNo = (list.data[0].vApplNo == null || list.data[0].vApplNo == "null") ? "" : list.data[0].vApplNo;
            list.data[0].dPriorityDate = (list.data[0].dPriorityDate == null || list.data[0].dPriorityDate == "null") ? "" : list.data[0].dPriorityDate;
            list.data[0].vApplicantName = (list.data[0].vApplicantName == null || list.data[0].vApplicantName == "null") ? "" : list.data[0].vApplicantName;
            list.data[0].vStatus = (list.data[0].vStatus == null || list.data[0].vStatus == "null") ? "" : list.data[0].vStatus;
            list.data[0].dAddedOn = (list.data[0].dAddedOn == null || list.data[0].dAddedOn == "null") ? "" : list.data[0].dAddedOn;
            list.data[0].dPublicationDate = (list.data[0].dPublicationDate == null || list.data[0].dPublicationDate == "null") ? "" : list.data[0].dPublicationDate;
            if (list.data[0].dDateOffiling != "")
            {
                var result = list.data[0].dDateOffiling.Split('T');
                list.data[0].dDateOffiling = result[0];
            }
            if (list.data[0].dPriorityDate != "")
            {
                var pDate = list.data[0].dPriorityDate.Split('T');
                list.data[0].dPriorityDate = pDate[0];
            }
            if (list.data[0].dPublicationDate != "")
            {
                var pubDate = list.data[0].dPublicationDate.Split('T');
                list.data[0].dPublicationDate = pubDate[0];
            }

            var data = db.AddUserPatentDetails(list.data[0].ifid, list.data[0].vInventionTitle, list.data[0].vApplNo, list.data[0].dDateOffiling, list.data[0].dPriorityDate, list.data[0].vApplicantName, list.data[0].vStatus, list.data[0].PatentNo, tradeid, userId, firmId, list.data[0].dAddedOn, list.data[0].dPublicationDate).ToString();

            return data;
        }

        /// <summary>
        /// Method for adding Copyright Data
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public async Task<IHttpActionResult> AddCopyrightData()
        {
            CopyrightDetailsList list = new CopyrightDetailsList();
            var tradeid = HttpContext.Current.Request.Form["tradeid"];
            var ipListValue = Convert.ToString(HttpContext.Current.Request.Form["ip"]);
            var data = await IPRDetailsbyIid(Convert.ToString(tradeid), ipListValue);
            list = new System.Web.Script.Serialization.JavaScriptSerializer().Deserialize<LawPracticeFirm.Models.CopyrightDetailsList>(data);
            //list = (PatentDetailsList)JsonConvert.DeserializeObject(data);

            string copyrightAddMethod = AddCopyrightDataById(list, Convert.ToInt32(tradeid));

            return Ok(new { data = copyrightAddMethod });
        }

        public string AddCopyrightDataById(CopyrightDetailsList list, int tradeid)
        {
            var db = new IPRRepository();
            var userId = LoggedInUser.UserId.ToString();
            var firmId = LoggedInUser.FirmId.ToString();

            list.data[0].vApplicantName = (list.data[0].vApplicantName == null || list.data[0].vApplicantName == "null") ? "" : list.data[0].vApplicantName;
            list.data[0].vTitleofWork = (list.data[0].vTitleofWork == null || list.data[0].vTitleofWork == "null") ? "" : list.data[0].vTitleofWork;
            list.data[0].vDiaryNo = (list.data[0].vDiaryNo == null || list.data[0].vDiaryNo == "null") ? "" : list.data[0].vDiaryNo;
            list.data[0].vStatus = (list.data[0].vStatus == null || list.data[0].vStatus == "null") ? "" : list.data[0].vStatus;
            list.data[0].dApplDate = (list.data[0].dApplDate == null || list.data[0].dApplDate == "null") ? "" : list.data[0].dApplDate.Split(' ')[0];
            list.data[0].CategoryId = (list.data[0].CategoryId == null || list.data[0].CategoryId == "null") ? "" : list.data[0].CategoryId;
            list.data[0].vCategory = (list.data[0].vCategory == null || list.data[0].vCategory == "null") ? "" : list.data[0].vCategory;
            list.data[0].vROCNumber = (list.data[0].vROCNumber == null || list.data[0].vROCNumber == "null") ? "" : list.data[0].vROCNumber;
            list.data[0].NoofPages = (list.data[0].NoofPages == null || list.data[0].NoofPages == "null") ? "" : list.data[0].NoofPages;
            //list.data[0].dCrwalDate = (list.data[0].dCrwalDate == null || list.data[0].dCrwalDate == "null") ? "" : list.data[0].dCrwalDate;
            //list.data[0].vImgPath = (list.data[0].vImgPath == null || list.data[0].vImgPath == "null") ? "" : list.data[0].vImgPath;

            var data = db.AddUserCopyrightDetails(list.data[0].vApplicantName, list.data[0].vTitleofWork, list.data[0].vDiaryNo, list.data[0].vStatus, list.data[0].dApplDate, list.data[0].CategoryId, list.data[0].vCategory, list.data[0].vROCNumber, list.data[0].NoofPages, userId, firmId, tradeid).ToString();

            return data;
        }

        /// <summary>
        /// Method For Add GI Data
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public async Task<IHttpActionResult> AddGIData()
        {
            GIDetailsList list = new GIDetailsList();
            var tradeid = Convert.ToString(HttpContext.Current.Request.Form["tradeid"]);
            var ip = HttpContext.Current.Request.Form["ip"];
            var databyiid = await IPRDetailsbyIid(tradeid, ip);

            list = new System.Web.Script.Serialization.JavaScriptSerializer().Deserialize<LawPracticeFirm.Models.GIDetailsList>(databyiid);

            var data = AddGIDataByiid(list, Convert.ToInt32(tradeid));

            return Ok(new { data = data });
        }

        public int AddGIDataByiid(GIDetailsList list, int tradeid)
        {
            var db = new IPRRepository();
            var userId = LoggedInUser.UserId.ToString();
            var firmid = LoggedInUser.FirmId.ToString();

            var data = db.AddUserGIDetails(userId, firmid, tradeid, list.data[0].vApplicationNo, list.data[0].vStatus, list.data[0].vApplicantName, list.data[0].dDateOfFiling, list.data[0].vClass, list.data[0].dRegisterDate, list.data[0].vGoods, list.data[0].vApplicantAddress, list.data[0].vGIName, list.data[0].vRegisteredProp, list.data[0].vJournalNo, list.data[0].vGeoArea, list.data[0].vGeoIndication, list.data[0].vPriorityCountry, list.data[0].dAvailDate, list.data[0].vCertificateNo, list.data[0].dCertificateDate, list.data[0].dDateofFilingto, list.data[0].dDateofFilingfrom);

            return data;
        }

        /// <summary>
        /// Method For Add Design Data
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public async Task<IHttpActionResult> AddDesignData()
        {
            string data = "";
            try
            {
                DesignDetailsList list = new DesignDetailsList();
                var tradeid = Convert.ToString(HttpContext.Current.Request.Form["tradeid"]);
                var IpList = Convert.ToString(HttpContext.Current.Request.Form["ip"]);
                var databyiid = await IPRDetailsbyIid(tradeid, IpList);

                list = new System.Web.Script.Serialization.JavaScriptSerializer().Deserialize<LawPracticeFirm.Models.DesignDetailsList>(databyiid);

                data = AddDesignDataByiid(list);
            }

            catch (Exception ex)
            {

            }
            return Ok(new { data = data });
        }

        public string AddDesignDataByiid(DesignDetailsList list)
        {
            var repo = new IPRRepository();
            string userId = LoggedInUser.UserId.ToString();
            string firmid = LoggedInUser.FirmId.ToString();

            var data = repo.AddUserDesignDetails(0, list.data[0].vDesignNo, list.data[0].vClass, list.data[0].vApplDetails, list.data[0].vAddress, list.data[0].dDateOfRegistration, list.data[0].vPatentOffJournalNo, list.data[0].vTitle, list.data[0].vPriorityNo, userId, firmid, list.data[0].iid, list.data[0].vStatus).ToString();

            return data;
        }

        /// <summary>
        /// Method For Removing/Deleting Trademarks 
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveMarks()
        {
            try
            {
                string userId = LoggedInUser.UserId.ToString();
                string firmId = LoggedInUser.FirmId.ToString();
                var ipList = HttpContext.Current.Request.Form["ip"];
                var tradeid = Convert.ToString(HttpContext.Current.Request.Form["tradeid"]);
                var iid = Convert.ToString(HttpContext.Current.Request.Form["iid"]);
                var cnnt = DataAccessIPRADO.RemoveUserAddedTradeMarkDetails(tradeid, userId, firmId, ipList, iid);
                return Ok(new { data = cnnt });
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.User), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.User), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }

        }

        /// <summary>
        /// Remove shared trademark
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveShareTrademark()
        {
            try
            {
                string userId = LoggedInUser.UserId.ToString();
                string firmId = LoggedInUser.FirmId.ToString();
                var ipList = HttpContext.Current.Request.Form["ip"];
                var tradeid = Convert.ToString(HttpContext.Current.Request.Form["tradeid"]);
                int cnnt = Repository.IPR.RemoveShareTradeMarkDetails(Convert.ToInt32(tradeid), userId, firmId, ipList);
                return Ok(new { data = cnnt });
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.User), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.User), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }

            //var ipList = HttpContext.Current.Request.Form["ip"];
            //var tradeid = Convert.ToString(HttpContext.Current.Request.Form["tradeid"]);
            //int cnnt = RemoveUserAddedMarks(Convert.ToInt32(tradeid), ipList);
            //return Ok(new { data = cnnt });
        }


        //public List<sp_GetAddedIPRTrademark_Result> exporttoexcel(string userid, string firmid, string filtertradmark, string searchclass, string Proprietor, string searchstatus, string applicationno, string searchtype, string dateapplicationto, string dateapplicationfrom, string searchuserdetetail, string JurisdictionList, string usedsincefrom1, string usedsinceto1, string pagenum1, int sort, string colname)
        //{
        //    var data = new IPRRepository();
        //    string agent = "";
        //    string agentAddress = "";
        //    string pagesize1 = "10";
        //    var ds = data.GetAddedIPRTrademark(userid, firmid, searchclass, Proprietor, dateapplicationfrom, dateapplicationto, searchstatus, searchuserdetetail, usedsincefrom1, usedsinceto1, agent, filtertradmark, applicationno, searchtype, Convert.ToInt32(pagenum1), Convert.ToInt32(pagesize1), sort, colname).ToList();

        //    return ds;
        //}
        public List<AddedTrademarkResponseModel> exporttoexcel(string userid, string firmid, string filtertradmark, string searchclass, string Proprietor, string searchstatus, string applicationno, string searchtype, string dateapplicationto, string dateapplicationfrom, string searchuserdetetail, string JurisdictionList, string usedsincefrom1, string usedsinceto1, string pagenum1, int sort, string colname,string dHearingDatefrom, string dHearingDateto)
        {
            List<AddedTrademarkResponseModel> list = new List<AddedTrademarkResponseModel>();
            //var data = new IPRRepository();
            string agent = "";
            string agentAddress = "";
            string pagesize1 = "10";
            //var ds = data.GetAddedIPRTrademark(userid, firmid, searchclass, Proprietor, dateapplicationfrom, dateapplicationto, searchstatus, searchuserdetetail, usedsincefrom1, usedsinceto1, agent, filtertradmark, applicationno, searchtype, Convert.ToInt32(pagenum1), Convert.ToInt32(pagesize1), sort, colname).ToList();

            //var detail = DataAccessIPRADO.GetAddedIPRTrademark(userid, firmid, searchclass, Proprietor, dateapplicationfrom, dateapplicationto, searchstatus,
            //    searchuserdetetail, usedsincefrom1, usedsinceto1, agent, filtertradmark, applicationno, searchtype, Convert.ToInt32(pagenum1), 
            //    Convert.ToInt32(pagesize1), sort, colname, dHearingDatefrom, dHearingDateto);
            try
            {
                var detail = DataAccessIPRADO.GetAddedIPRTrademark(userid, firmid, filtertradmark, searchclass, Proprietor, dateapplicationfrom, dateapplicationto, searchstatus,
                applicationno, Convert.ToInt32(pagenum1), Convert.ToInt32(pagesize1), sort, colname, dHearingDatefrom, dHearingDateto);

                var result = JsonConvert.SerializeObject(detail);
                list = JsonConvert.DeserializeObject<List<AddedTrademarkResponseModel>>(result);
            }
            catch
            {
            }
            return list;
        }

        /// <summary>
        /// Export share detail in excel
        /// </summary>
        /// <param name="userid"></param>
        /// <param name="firmid"></param>
        /// <param name="etc."></param>
        /// <returns></returns>
        public List<GetIPRShareTrademarkResponseModel> exportsharetoexcel(string userid, string firmid, string filtertradmark, string searchclass, string Proprietor, string searchstatus, string applicationno, string searchtype, string dateapplicationto, string dateapplicationfrom, string searchuserdetetail, string JurisdictionList, string usedsincefrom1, string usedsinceto1, string pagenum1, int sort, string colname, string dHearingDatefrom, string dHearingDateto)
        {
            var data = new IPRRepository();
            //string agent = "";
            //string agentAddress = "";
            //string pagesize1 = "10";
            //var ds = data.GetSharedIPRTrademark(userid, firmid, searchclass, Proprietor, dateapplicationfrom, dateapplicationto, searchstatus, searchuserdetetail, usedsincefrom1, usedsinceto1, agent, filtertradmark, applicationno, searchtype, Convert.ToInt32(pagenum1), Convert.ToInt32(pagesize1), sort, colname).ToList();

            //return ds;
            List<GetIPRShareTrademarkResponseModel> list = new List<GetIPRShareTrademarkResponseModel>();
            string agent = "";
            string agentAddress = "";
            string pagesize1 = "10";
            try
            {
                //var detail = data.GetSharedIPRTrademark(userid, firmid, searchclass, Proprietor, dateapplicationfrom, dateapplicationto, searchstatus, searchuserdetetail, usedsincefrom1, usedsinceto1, agent, filtertradmark, applicationno, searchtype, Convert.ToInt32(pagenum1), Convert.ToInt32(pagesize1), sort, colname);
                var detail = DataAccessIPRADO.GetSharedIPRTrademark(userid, firmid, filtertradmark, searchclass, Proprietor, dateapplicationfrom, dateapplicationto,
                    searchstatus, applicationno, Convert.ToInt32(pagenum1), Convert.ToInt32(pagesize1), sort, colname, dHearingDatefrom, dHearingDateto);
                var result = JsonConvert.SerializeObject(detail);
                list = JsonConvert.DeserializeObject<List<GetIPRShareTrademarkResponseModel>>(result);
            }
            catch
            {
            }
            return list;
        }

        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public async Task<Object> CounterDetails()
        {
            var userId = LoggedInUser.UserId.ToString();
            var firmId = LoggedInUser.FirmId.ToString();

            var iprList = Convert.ToInt32(HttpContext.Current.Request.Form["IPList"]);

            var repo = new IPRRepository();
            Object obj = repo.GetCounterForIP(userId, firmId, iprList);

            var serializedValue = JsonConvert.SerializeObject(obj);
            var data = serializedValue;

            return Ok(new { data = data });

        }

        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public async Task<IHttpActionResult> TradeidFromAddedIPR()
        {
            var tradeiid = Convert.ToInt32(HttpContext.Current.Request.Form["trademarkId"]);
            var userId = LoggedInUser.UserId.ToString();
            var firmId = LoggedInUser.FirmId.ToString();
            List<sp_TradeidFromAddedIPR_Result> list = new List<sp_TradeidFromAddedIPR_Result>();
            var repo = new IPRRepository();
            try
            {
                list = repo.GetCounterForAddedIPR(userId, firmId, tradeiid).ToList();
            }

            catch (Exception ex)
            { }

            var serializedValue = JsonConvert.SerializeObject(list);
            var data = serializedValue;

            return Ok(new { data = data });
        }

        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]

        public async Task<IHttpActionResult> ViewTrademarkArchiveList()
        {
            int pageIndex = 1, pageSize = 10;
            pageIndex = Convert.ToInt32(HttpContext.Current.Request.Form["pageindex"]);
            var Ip = HttpContext.Current.Request.Form["ip"];
            var list = await FetchDataForKeywordHistory(pageIndex, pageSize, Ip);

            return Ok(new { data = list });
        }

        public async Task<string> FetchDataForKeywordHistory(int pageIndex, int pageSize, string Ip)
        {
            try
            {

                string userId = LoggedInUser.UserId.ToString();
                LawPracticeEntities db = new LawPracticeEntities();
                string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId;
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                var addfClient = new HttpClient();
                object rawfile = new
                {
                    accesstoken = "mykase123456789abcdef",
                    userid = strusername,
                    pageindex = pageIndex,
                    pagesize = pageSize,
                    ip = Ip
                };

                string content = JsonConvert.SerializeObject(rawfile);

                StringContent queryString = new StringContent(content, Encoding.UTF8, "application/json");
                addfClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var response = await addfClient.PostAsync(new Uri(apiUrl + "/API/IPR/IPRUserKeywordHistory").ToString(), queryString);
                return await response.Content.ReadAsStringAsync();
            }

            catch (Exception ex)
            {
                return ex.Message;
            }


        }

        /// <summary>
        /// Method for the page View IPR Case Page are below :- 
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ListForViewIPRCase()
        {
            DataTable list = new DataTable();
            try
            {
                int pagesize = 10, pagenum = 1;
                var userId = LoggedInUser.UserId.ToString();
                var firmId = LoggedInUser.FirmId.ToString();
                pagenum = Convert.ToInt32(HttpContext.Current.Request.Form["pagenum1"]);
                pagesize = Convert.ToInt32(HttpContext.Current.Request.Form["pagesize1"]);
                list = DataAccessIPRADO.ViewIPRTrademarkCaseList(userId, firmId, pagenum, pagesize);
            }
            catch (Exception ex)
            {

            }
            return Ok(new { data = list });
        }

        /// <summary>
        /// Viewing IPR Case By Id
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ViewIPRCaseById()
        {
            DataTable list = new DataTable();
            try
            {
                int pagesize = 10, pagenum = 1;
                var userId = LoggedInUser.UserId.ToString();
                var firmId = LoggedInUser.FirmId.ToString();
                var id = HttpContext.Current.Request.Form["iid"];
                list = DataAccessIPRADO.ViewIPRTrademarkCaseList(userId, firmId, 1, 10, id);
            }
            catch (Exception ex)
            {

            }
            return Ok(new { data = list });
        }

        //[FirmApiAuthorization()]
        //[System.Web.Mvc.HttpPost]

        //public async Task<IHttpActionResult> FetchPatentStatus()
        //{
        //    var data = await FetchDataForPatentStatus();

        //    //var SerializedValue = JsonConvert.SerializeObject(data);
        //    return Ok(new { data = data });
        //}

        //public async Task<string> FetchDataForPatentStatus()
        //{
        //    var data1 = "";

        //    try
        //    {
        //        List<IPRList> casedeatils = new List<IPRList>();

        //        string userId = LoggedInUser.UserId.ToString();
        //        LawPracticeEntities db = new LawPracticeEntities();
        //        string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId;
        //        var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
        //        //var apiUrl = "http://10.60.1.42:9010/API/IPR/SearchIPR";
        //        var addfClient = new HttpClient();
        //        var objrawdata = new
        //        {
        //            userid = strusername,
        //            accesstoken = "mykase123456789abcdef",
        //        };

        //        var rawdt = JsonConvert.SerializeObject(objrawdata);

        //        StringContent queryString = new StringContent(rawdt, Encoding.UTF8, "application/json");
        //        addfClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        //        var response = await addfClient.PostAsync(new Uri(apiUrl + "/API/IPR/IPRPatentStatusList").ToString(), queryString);
        //        data1 = await response.Content.ReadAsStringAsync();

        //    }

        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }

        //    return data1;
        //}

        /// <summary>
        /// method for populating design status
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public async Task<IHttpActionResult> FetchDesignStatus()
        {
            var data = await FetchDataForDesignStatus();
            //var SerializedValue = JsonConvert.SerializeObject(data);
            return Ok(new { data = data });
        }

        public async Task<string> FetchDataForDesignStatus()
        {
            var data1 = "";

            try
            {

                List<IPRList> casedeatils = new List<IPRList>();
                string userId = LoggedInUser.UserId.ToString();
                //string userId = LoggedInUser.UserId.ToString();
                LawPracticeEntities db = new LawPracticeEntities();
                string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId;
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                //var apiUrl = "http://10.60.1.42:9010/API/IPR/SearchIPR";
                var addfClient = new HttpClient();
                var objrawdata = new
                {
                    userid = strusername,
                    accesstoken = "mykase123456789abcdef",
                };

                var rawdt = JsonConvert.SerializeObject(objrawdata);

                StringContent queryString = new StringContent(rawdt, Encoding.UTF8, "application/json");
                addfClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var response = await addfClient.PostAsync(new Uri(apiUrl + "/API/IPR/IPRDesignStatusList").ToString(), queryString);
                data1 = await response.Content.ReadAsStringAsync();

            }

            catch (Exception ex)
            {
                throw ex;
            }

            return data1;
        }



        /// <summary>
        /// Method For Getting All User Added IPR
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public async Task<IHttpActionResult> FetchUserAddedIPRData()
        {
            var newdata = "";
            int pageNum = 1;
            int pageSize = 10;
            pageNum = Convert.ToInt16(HttpContext.Current.Request.Form["pagenum"]);
            pageSize = Convert.ToInt16(HttpContext.Current.Request.Form["pagesize"]);
            var ip = HttpContext.Current.Request.Form["IPList"];

            if (ip == "1")
            {

            }

            if (ip == "2")
            {

            }

            if (ip == "3")
            {

            }

            if (ip == "4")
            {
                var searchtext = HttpContext.Current.Request.Form["filtertradmark"];
                var vapplicationno = HttpContext.Current.Request.Form["applicationno"];
                var vstatus = HttpContext.Current.Request.Form["searchstatus"];
                var vclass = HttpContext.Current.Request.Form["class"];
                var vjournalno = HttpContext.Current.Request.Form["journalno"];
                var datefrom = HttpContext.Current.Request.Form["doffrom"];
                var dateto = HttpContext.Current.Request.Form["dofto"];
                var validupto = HttpContext.Current.Request.Form["registdate"];
                var vsort = HttpContext.Current.Request.Form["sort"];
                var vcolname = HttpContext.Current.Request.Form["colname"];

                vapplicationno = (vapplicationno == null || vapplicationno == "null") ? "" : vapplicationno;
                vstatus = (vstatus == null || vstatus == "null") ? "" : vstatus;
                vclass = (vclass == null || vclass == "null") ? "" : vclass;
                vjournalno = (vjournalno == null || vjournalno == "null") ? "" : vjournalno;
                datefrom = (datefrom == null || datefrom == "null") ? "" : datefrom;
                dateto = (dateto == null || dateto == "null") ? "" : dateto;
                validupto = (validupto == null || validupto == "null") ? "" : validupto;
                vsort = (vsort == null || vsort == "null") ? "" : vsort;
                vcolname = (vcolname == null || vcolname == "null") ? "" : vcolname;

                string userId = LoggedInUser.UserId.ToString();
                string fimrid = LoggedInUser.FirmId.ToString();
                string Accesstoken = "mykase123456789abcdef";

                try
                {
                    string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId;
                    var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                    int timeout = Convert.ToInt32(ConfigurationManager.AppSettings["Timeout"]);
                    //var apiUrl = "http://10.60.1.42:9010/API/IPR/SearchIPR";
                    var addfClient = new HttpClient();
                    addfClient.Timeout = TimeSpan.FromMinutes(timeout);
                    object rawfile = new
                    {
                        accesstoken = Accesstoken,
                        searchtext = searchtext,
                        UserId = userId,
                        ip = ip,
                        ApplNo = vapplicationno,
                        Status = vstatus,
                        vclass = vclass,
                        JournalNo = vjournalno,
                        dDateoffilingfrom = datefrom,
                        dDateoffilingto = dateto,
                        validUpto = validupto,
                        pageindex = pageNum,
                        pagesize = pageSize,
                        vsort = vsort,
                        colname = vcolname
                    };

                    string content = JsonConvert.SerializeObject(rawfile);

                    StringContent queryString = new StringContent(content, Encoding.UTF8, "application/json");
                    addfClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    var response = await addfClient.PostAsync(new Uri(apiUrl + "/API/IPR/UserAddedIPRs").ToString(), queryString);
                    newdata = await response.Content.ReadAsStringAsync();
                }

                catch (Exception ex)
                {
                    throw ex;
                }
            }


            return Ok(new { data = newdata });
        }


        /// <summary>
        /// Method For Getting All IPR Dropdown Values
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public async Task<IHttpActionResult> FetchDropdownValues()
        {
            string apidata = "";
            var IpValue = HttpContext.Current.Request.Form["ip"];

            // Condition for getting category name for the Copyright Search and Tracking Page.

            if (IpValue == "2")
            {
                try
                {
                    string userId = LoggedInUser.UserId.ToString();
                    LawPracticeEntities db = new LawPracticeEntities();
                    string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId;
                    var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                    int timeout = Convert.ToInt32(ConfigurationManager.AppSettings["Timeout"]);
                    //var apiUrl = "http://10.60.1.42:9010/API/IPR/SearchIPR";
                    var addfClient = new HttpClient();
                    addfClient.Timeout = TimeSpan.FromMinutes(timeout);
                    object rawfile = new
                    {
                        userid = strusername,
                        Accesstoken = "mykase123456789abcdef",
                        Ip = IpValue
                    };

                    string content = JsonConvert.SerializeObject(rawfile);

                    StringContent queryString = new StringContent(content, Encoding.UTF8, "application/json");
                    addfClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    var response = await addfClient.PostAsync(new Uri(apiUrl + "/API/IPR/BindDropDowns").ToString(), queryString);
                    apidata = await response.Content.ReadAsStringAsync();
                }

                catch (Exception ex)
                {
                    Console.Write(ex.Message);
                }
            }

            // Condition for getting status for the Patent Search and Tracking Page.

            if (IpValue == "3")
            {
                try
                {
                    string userId = LoggedInUser.UserId.ToString();
                    LawPracticeEntities db = new LawPracticeEntities();
                    string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId;
                    var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                    int timeout = Convert.ToInt32(ConfigurationManager.AppSettings["Timeout"]);
                    //var apiUrl = "http://10.60.1.42:9010/API/IPR/SearchIPR";
                    var addfClient = new HttpClient();
                    addfClient.Timeout = TimeSpan.FromMinutes(timeout);
                    object rawfile = new
                    {
                        userid = strusername,
                        Accesstoken = "mykase123456789abcdef",
                        Ip = IpValue
                    };

                    string content = JsonConvert.SerializeObject(rawfile);

                    StringContent queryString = new StringContent(content, Encoding.UTF8, "application/json");
                    addfClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    var response = await addfClient.PostAsync(new Uri(apiUrl + "/API/IPR/BindDropDowns").ToString(), queryString);
                    apidata = await response.Content.ReadAsStringAsync();
                }

                catch (Exception ex)
                {
                    Console.Write(ex.Message);
                }
            }

            if (IpValue == "4")
            {
                try
                {
                    string userId = LoggedInUser.UserId.ToString();
                    LawPracticeEntities db = new LawPracticeEntities();
                    string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId;
                    var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                    int timeout = Convert.ToInt32(ConfigurationManager.AppSettings["Timeout"]);
                    //var apiUrl = "http://10.60.1.42:9010/API/IPR/SearchIPR";
                    var addfClient = new HttpClient();
                    addfClient.Timeout = TimeSpan.FromMinutes(timeout);
                    object rawfile = new
                    {
                        userid = strusername,
                        Accesstoken = "mykase123456789abcdef",
                        Ip = IpValue
                    };

                    string content = JsonConvert.SerializeObject(rawfile);

                    StringContent queryString = new StringContent(content, Encoding.UTF8, "application/json");
                    addfClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    var response = await addfClient.PostAsync(new Uri(apiUrl + "/API/IPR/BindDropDowns").ToString(), queryString);
                    apidata = await response.Content.ReadAsStringAsync();
                }

                catch (Exception ex)
                {
                    Console.Write(ex.Message);
                }
            }

            return Ok(new { data = apidata });
        }


        /// <summary>
        /// Below methods for IPR Dashboard
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult DashboardTypeOfIPGraph()
        {
            var LoginUserId = LoggedInUser.UserId.ToString();
            var RoleId = LoggedInUser.RoleId.ToString();
            var FirmId = LoggedInUser.FirmId.ToString();
            try
            {
                List<sp_GetDashboardIPRList_Result> list = new List<sp_GetDashboardIPRList_Result>();
                string message = "";
                var db = new LawPracticeEntities();
                list = db.sp_GetDashboardIPRList(LoginUserId, FirmId).ToList();
                //var result = iprreport.GetDashboardIPRList(LoginUserId, FirmId);
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok("Somthing went wrong.");
            }
        }

        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult DashboardIPRStatusGraph()
        {
            var LoginUserId = LoggedInUser.UserId.ToString();
            var RoleId = LoggedInUser.RoleId.ToString();
            var FirmId = LoggedInUser.FirmId.ToString();
            try
            {
                List<sp_GetDashboardIPRStatusGraph_Result> list = new List<sp_GetDashboardIPRStatusGraph_Result>();
                string message = "";
                var db = new LawPracticeEntities();
                list = db.sp_GetDashboardIPRStatusGraph(LoginUserId, FirmId).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok("Somthing went wrong.");
            }
        }

        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult DashboardIPRStatusGraphDetail()
        {
            var LoginUserId = LoggedInUser.UserId.ToString();
            var RoleId = LoggedInUser.RoleId.ToString();
            var FirmId = LoggedInUser.FirmId.ToString();
            var vstatus = HttpContext.Current.Request.Form["status"];
            try
            {
                List<sp_GetDashboardIPRStatusGraphDetail_Result> list = new List<sp_GetDashboardIPRStatusGraphDetail_Result>();
                string message = "";
                var db = new LawPracticeEntities();
                list = db.sp_GetDashboardIPRStatusGraphDetail(LoginUserId, FirmId, vstatus).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok("Somthing went wrong.");
            }
        }

        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult DashboardProprietorGraph()
        {
            var LoginUserId = LoggedInUser.UserId.ToString();
            var RoleId = LoggedInUser.RoleId.ToString();
            var FirmId = LoggedInUser.FirmId.ToString();
            try
            {
                List<sp_GetDashboardProprietorGraph_Result> list = new List<sp_GetDashboardProprietorGraph_Result>();
                string message = "";
                var db = new LawPracticeEntities();
                list = db.sp_GetDashboardProprietorGraph(LoginUserId, FirmId).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok("Somthing went wrong.");
            }
        }

        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult DashboardTotalIPCount()
        {
            var LoginUserId = LoggedInUser.UserId.ToString();
            var RoleId = LoggedInUser.RoleId.ToString();
            var FirmId = LoggedInUser.FirmId.ToString();
            int ccount = 0;
            try
            {
                string message = "";
                var db = new LawPracticeEntities();
                var data = db.sp_GetDashboardTotalIPCount(LoginUserId, FirmId);
                //ccount = Convert.ToInt32(data);
                return Ok(data);
            }
            catch (Exception ex)
            {
                return Ok("Somthing went wrong.");
            }
        }

        public IHttpActionResult CalendarDetails()
        {
            var LoginUserId = LoggedInUser.UserId.ToString();
            //var RoleId = LoggedInUser.RoleId.ToString();
            var FirmId = LoggedInUser.FirmId.ToString();
            int ccount = 0;
            try
            {

                string message = "";
                var db = new LawPracticeEntities();
                var data = db.sp_GetDashboardIPRRenewalData(LoginUserId, FirmId, "");
                //ccount = Convert.ToInt32(data);
                return Ok(data);
            }
            catch (Exception ex)
            {
                return Ok("Somthing went wrong.");
            }

        }

        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public async Task<IHttpActionResult> IPRQuota()
        {
            string a = "";
            var db = new IPRRepository();
            string userId = LoggedInUser.UserId.ToString();
            string firmId = LoggedInUser.FirmId.ToString();
            //List<sp_GetIPRList_Result> list = new List<sp_GetIPRList_Result>();
            var list = db.GetQuota(userId, firmId).ToList();
            //var rawfile = list.Cast<object>().ToArray();

            return Ok(new { data = list });
        }

        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ProprietorIPGraph(int id)
        {
            var LoginUserId = LoggedInUser.UserId.ToString();
            var RoleId = LoggedInUser.RoleId.ToString();
            var FirmId = LoggedInUser.FirmId.ToString();
            try
            {
                List<sp_GetProprietorIPGraph_Result> list = new List<sp_GetProprietorIPGraph_Result>();
                string message = "";
                var db = new LawPracticeEntities();
                list = db.sp_GetProprietorIPGraph(LoginUserId, FirmId, id).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok("Somthing went wrong.");
            }
        }

        //Added by prem kumar

        /// <summary>
        /// Get The tabular data of Propriter
        /// </summary>
        /// <returns></returns>

        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult PropriterTabularDetails()
        {
            JObject jObject = new JObject();
            int IprTypeId = Convert.ToInt32(HttpContext.Current.Request.Form["iprid"]);
            string responsestrfom = "";
            try
            {
                string deviceIP = myIP();
                //For Trademark
                if (IprTypeId == 1)
                {
                    int pageSize = 10, pageNumber = 1;

                    pageNumber = Convert.ToInt32(HttpContext.Current.Request.Form["pageNumber"]);
                    pageSize = Convert.ToInt32(HttpContext.Current.Request.Form["pageSize"]);
                    string vProprietorSearch = Convert.ToString(HttpContext.Current.Request.Form["vProprietorSearch"]);
                    string vProprietorAddressSearch = Convert.ToString(HttpContext.Current.Request.Form["vProprietorAddressSearch"]);

                    if (string.IsNullOrEmpty(vProprietorAddressSearch))
                    {
                        vProprietorAddressSearch = "";
                    }

                    if (vProprietorSearch.Length < 3)
                    {
                        return BadRequest("Search keyword should not be less than 3");
                    }
                    var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                    //var apiUrl = "http://localhost:44389/";
                    var addfClient = new WebClient();
                    //var addfClient2 = new WebClientConnection();
                    object rawfile = new
                    {
                        IprTypeId = IprTypeId,
                        pageNumber = pageNumber,
                        pageSize = pageSize,
                        vProprietorSearch = vProprietorSearch,
                        vProprietorAddressSearch = vProprietorAddressSearch
                    };
                    addfClient.Encoding = System.Text.Encoding.UTF8;
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var res = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/PropriterTabularDetails"), "POST", builders);
                    jObject = JObject.Parse(res);
                    db1.usp_AddAudit(Convert.ToInt32(EventType.TrdPropIPR), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.TrdPropIPR), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), new Guid(LoggedInUser.UserId.ToString()), "Message=" + jObject["Message"].ToString() + "@Stack Trace=PropriterTabularDetails", deviceIP, GetMacAddress().ToString(), 0, "");
                }

                //For Copyright
                else if (IprTypeId == 2)
                {
                    int pageSize = 10, pageNumber = 1;

                    pageNumber = Convert.ToInt32(HttpContext.Current.Request.Form["pageNumber"]);
                    pageSize = Convert.ToInt32(HttpContext.Current.Request.Form["pageSize"]);
                    string vProprietorSearch = Convert.ToString(HttpContext.Current.Request.Form["vProprietorSearch"]);
                    string vProprietorAddressSearch = Convert.ToString(HttpContext.Current.Request.Form["vProprietorAddressSearch"]);

                    if (string.IsNullOrEmpty(vProprietorAddressSearch))
                    {
                        vProprietorAddressSearch = "";
                    }

                    if (vProprietorSearch.Length < 3)
                    {
                        return BadRequest("Search keyword should not be less than 3");
                    }
                    var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                    //var apiUrl = "http://localhost:44389";
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        IprTypeId = IprTypeId,
                        pageNumber = pageNumber,
                        pageSize = pageSize,
                        vProprietorSearch = vProprietorSearch,
                        vProprietorAddressSearch = vProprietorAddressSearch
                    };

                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var res = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/PropriterTabularDetails"), "POST", builders);
                    jObject = JObject.Parse(res);
                    db1.usp_AddAudit(Convert.ToInt32(EventType.CpyAppIPR), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.CpyAppIPR), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), new Guid(LoggedInUser.UserId.ToString()), "Message=" + jObject["Message"].ToString() + "@Stack Trace=PropriterTabularDetails", deviceIP, GetMacAddress().ToString(), 0, "");
                }

                //For Patent
                else if (IprTypeId == 3)
                {
                    int pageSize = 10, pageNumber = 1;

                    pageNumber = Convert.ToInt32(HttpContext.Current.Request.Form["pageNumber"]);
                    pageSize = Convert.ToInt32(HttpContext.Current.Request.Form["pageSize"]);
                    string vProprietorSearch = Convert.ToString(HttpContext.Current.Request.Form["vProprietorSearch"]);
                    string vProprietorAddressSearch = Convert.ToString(HttpContext.Current.Request.Form["vProprietorAddressSearch"]);

                    if (string.IsNullOrEmpty(vProprietorAddressSearch))
                    {
                        vProprietorAddressSearch = "";
                    }

                    if (vProprietorSearch.Length < 3)
                    {
                        return BadRequest("Search keyword should not be less than 3");
                    }
                    var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                    //var apiUrl = "http://localhost:44389";
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        IprTypeId = IprTypeId,
                        pageNumber = pageNumber,
                        pageSize = pageSize,
                        vProprietorSearch = vProprietorSearch
                    };

                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var res = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/PropriterTabularDetails"), "POST", builders);
                    jObject = JObject.Parse(res);
                    db1.usp_AddAudit(Convert.ToInt32(EventType.PtntAppIPR), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.PtntAppIPR), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), new Guid(LoggedInUser.UserId.ToString()), "Message=" + jObject["Message"].ToString() + "@Stack Trace=PropriterTabularDetails", deviceIP, GetMacAddress().ToString(), 0, "");
                }

                // For GI
                else if (IprTypeId == 4)
                {
                    int pageSize = 10, pageNumber = 1;

                    pageNumber = Convert.ToInt32(HttpContext.Current.Request.Form["pageNumber"]);
                    pageSize = Convert.ToInt32(HttpContext.Current.Request.Form["pageSize"]);
                    string vProprietorSearch = Convert.ToString(HttpContext.Current.Request.Form["vProprietorSearch"]);
                    string vProprietorAddressSearch = Convert.ToString(HttpContext.Current.Request.Form["vProprietorAddressSearch"]);

                    if (string.IsNullOrEmpty(vProprietorAddressSearch))
                    {
                        vProprietorAddressSearch = "";
                    }

                    if (vProprietorSearch.Length < 3)
                    {
                        return BadRequest("Search keyword should not be less than 3");
                    }
                    var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                    //var apiUrl = "http://localhost:44389";
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        IprTypeId = IprTypeId,
                        pageNumber = pageNumber,
                        pageSize = pageSize,
                        vProprietorSearch = vProprietorSearch,
                        vProprietorAddressSearch = vProprietorAddressSearch
                    };

                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var res = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/PropriterTabularDetails"), "POST", builders);
                    jObject = JObject.Parse(res);
                    db1.usp_AddAudit(Convert.ToInt32(EventType.GIAppIPR), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.GIAppIPR), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), new Guid(LoggedInUser.UserId.ToString()), "Message=" + jObject["Message"].ToString() + "@Stack Trace=PropriterTabularDetails", deviceIP, GetMacAddress().ToString(), 0, "");
                }

                //For Design
                else if (IprTypeId == 5)
                {
                    int pageSize = 10, pageNumber = 1;

                    pageNumber = Convert.ToInt32(HttpContext.Current.Request.Form["pageNumber"]);
                    pageSize = Convert.ToInt32(HttpContext.Current.Request.Form["pageSize"]);
                    string vProprietorAddressSearch = Convert.ToString(HttpContext.Current.Request.Form["vProprietorAddressSearch"]);

                    if (string.IsNullOrEmpty(vProprietorAddressSearch))
                    {
                        vProprietorAddressSearch = "";
                    }

                    var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        IprTypeId = IprTypeId,
                        pageNumber = pageNumber,
                        pageSize = pageSize,
                        vProprietorAddressSearch = vProprietorAddressSearch
                    };

                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var res = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/PropriterTabularDetails"), "POST", builders);
                    jObject = JObject.Parse(res);
                    db1.usp_AddAudit(Convert.ToInt32(EventType.DgnAppIPR), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.DgnAppIPR), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), new Guid(LoggedInUser.UserId.ToString()), "Message=" + jObject["Message"].ToString() + jObject["Message"].ToString() + "@Stack Trace=PropriterTabularDetails", deviceIP, GetMacAddress().ToString(), 0, "");
                }
            }
            catch (Exception ex)
            {
                //db1.usp_AddAuditError(Convert.ToInt32(EventType.IPR), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.IPR), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return BadRequest("Something went wrong");
            }

            return Ok(jObject);
        }

        /// <summary>
        /// Get Information on the behalf of Pro Name and address
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult PropriterDetailsByNameAndAddress()
        {
            JObject jObject = new JObject();
            int IprTypeId = Convert.ToInt32(HttpContext.Current.Request.Form["iprid"]);
            string responsestrfom = "";
            try
            {
                int pageSize = 10, pageNumber = 1;
                string deviceIP = myIP();
                if (IprTypeId == 1)
                {
                    pageNumber = Convert.ToInt32(HttpContext.Current.Request.Form["pageNumber"]);
                    pageSize = Convert.ToInt32(HttpContext.Current.Request.Form["pageSize"]);
                    string vProprietorSearch = Convert.ToString(HttpContext.Current.Request.Form["vProprietorSearch"]);
                    string vProprietorAddressSearch = Convert.ToString(HttpContext.Current.Request.Form["vProprietorAddressSearch"]);

                    //if (string.IsNullOrEmpty(vProprietorAddressSearch))
                    //{
                    //    return BadRequest("Proprietor Address should not be blank.");
                    //}

                    if (string.IsNullOrEmpty(vProprietorSearch))
                    {
                        return BadRequest("Proprietor Name should not be blank.");
                    }
                    var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                    //var apiUrl = "http://localhost:44389";
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        IprTypeId = IprTypeId,
                        pageNumber = pageNumber,
                        pageSize = pageSize,
                        vProprietorSearch = vProprietorSearch,
                        vProprietorAddressSearch = vProprietorAddressSearch
                    };
                    addfClient.Encoding = System.Text.Encoding.UTF8;
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var res = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/PropriterDetailsByNameAndAddress"), "POST", builders);
                    jObject = JObject.Parse(res);
                    db1.usp_AddAudit(Convert.ToInt32(EventType.TrdPropIPR), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.TrdPropIPR), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), new Guid(LoggedInUser.UserId.ToString()), "Message=" + jObject["Message"].ToString() + "@Stack Trace=PropriterDetailsByNameAndAddress", deviceIP, GetMacAddress().ToString(), 0, "");
                }

                if (IprTypeId == 2)
                {
                    pageNumber = Convert.ToInt32(HttpContext.Current.Request.Form["pageNumber"]);
                    pageSize = Convert.ToInt32(HttpContext.Current.Request.Form["pageSize"]);
                    string vProprietorSearch = Convert.ToString(HttpContext.Current.Request.Form["vProprietorSearch"]);

                    if (string.IsNullOrEmpty(vProprietorSearch))
                    {
                        return BadRequest("Proprietor Name should not be blank.");
                    }
                    var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                    //var apiUrl = "http://localhost:44389";
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        IprTypeId = IprTypeId,
                        pageNumber = pageNumber,
                        pageSize = pageSize,
                        vProprietorSearch = vProprietorSearch
                    };

                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var res = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/PropriterDetailsByNameAndAddress"), "POST", builders);
                    jObject = JObject.Parse(res);
                    db1.usp_AddAudit(Convert.ToInt32(EventType.CpyAppIPR), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.CpyAppIPR), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), new Guid(LoggedInUser.UserId.ToString()), "Message=" + jObject["Message"].ToString() + "@Stack Trace=PropriterDetailsByNameAndAddress", deviceIP, GetMacAddress().ToString(), 0, "");
                }

                if (IprTypeId == 3)
                {
                    pageNumber = Convert.ToInt32(HttpContext.Current.Request.Form["pageNumber"]);
                    pageSize = Convert.ToInt32(HttpContext.Current.Request.Form["pageSize"]);
                    string vProprietorSearch = Convert.ToString(HttpContext.Current.Request.Form["vProprietorSearch"]);

                    if (string.IsNullOrEmpty(vProprietorSearch))
                    {
                        return BadRequest("Proprietor Name should not be blank.");
                    }
                    var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                    //var apiUrl = "http://localhost:44389";
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        IprTypeId = IprTypeId,
                        pageNumber = pageNumber,
                        pageSize = pageSize,
                        vProprietorSearch = vProprietorSearch
                    };

                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var res = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/PropriterDetailsByNameAndAddress"), "POST", builders);
                    jObject = JObject.Parse(res);
                    db1.usp_AddAudit(Convert.ToInt32(EventType.PtntAppIPR), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.PtntAppIPR), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), new Guid(LoggedInUser.UserId.ToString()), "Message=" + jObject["Message"].ToString() + "@Stack Trace=PropriterDetailsByNameAndAddress", deviceIP, GetMacAddress().ToString(), 0, "");
                }

                if (IprTypeId == 4)
                {
                    pageNumber = Convert.ToInt32(HttpContext.Current.Request.Form["pageNumber"]);
                    pageSize = Convert.ToInt32(HttpContext.Current.Request.Form["pageSize"]);
                    string vProprietorSearch = Convert.ToString(HttpContext.Current.Request.Form["vProprietorSearch"]);
                    string vProprietorAddressSearch = Convert.ToString(HttpContext.Current.Request.Form["vProprietorAddressSearch"]);

                    if (string.IsNullOrEmpty(vProprietorAddressSearch))
                    {
                        return BadRequest("Proprietor Address should not be blank.");
                    }

                    if (string.IsNullOrEmpty(vProprietorSearch))
                    {
                        return BadRequest("Proprietor Name should not be blank.");
                    }
                    var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                    //var apiUrl = "http://localhost:44389";
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        IprTypeId = IprTypeId,
                        pageNumber = pageNumber,
                        pageSize = pageSize,
                        vProprietorSearch = vProprietorSearch,
                        vProprietorAddressSearch = vProprietorAddressSearch
                    };

                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var res = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/PropriterDetailsByNameAndAddress"), "POST", builders);
                    jObject = JObject.Parse(res);
                    db1.usp_AddAudit(Convert.ToInt32(EventType.GIAppIPR), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.GIAppIPR), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), new Guid(LoggedInUser.UserId.ToString()), "Message=" + jObject["Message"].ToString() + "@Stack Trace=PropriterDetailsByNameAndAddress", deviceIP, GetMacAddress().ToString(), 0, "");
                }

                if (IprTypeId == 5)
                {
                    pageNumber = Convert.ToInt32(HttpContext.Current.Request.Form["pageNumber"]);
                    pageSize = Convert.ToInt32(HttpContext.Current.Request.Form["pageSize"]);
                    string vProprietorSearch = Convert.ToString(HttpContext.Current.Request.Form["vProprietorAddressSearch"]);

                    if (string.IsNullOrEmpty(vProprietorSearch))
                    {
                        return BadRequest("Proprietor Name should not be blank.");
                    }
                    var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                    //var apiUrl = "http://localhost:44389";
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        IprTypeId = IprTypeId,
                        pageNumber = pageNumber,
                        pageSize = pageSize,
                        vProprietorAddressSearch = vProprietorSearch
                        //vProprietorSearch = vProprietorSearch
                    };

                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var res = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/PropriterDetailsByNameAndAddress"), "POST", builders);
                    jObject = JObject.Parse(res);
                    db1.usp_AddAudit(Convert.ToInt32(EventType.DgnAppIPR), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.DgnAppIPR), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), new Guid(LoggedInUser.UserId.ToString()), "Message=" + jObject["Message"].ToString() + "@Stack Trace=PropriterDetailsByNameAndAddress", deviceIP, GetMacAddress().ToString(), 0, "");
                }
            }
            catch (Exception ex)
            {

                return BadRequest("Something went wrong");
            }

            return Ok(jObject);
        }
        //End Prem Work 

        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult AgentSearchForTrademark()
        {
            JObject jObject = new JObject();
            string responsestrfom = "";
            try
            {
                int pagesize = 10;
                int IprTypeId = Convert.ToInt32(HttpContext.Current.Request.Form["iprtypeid"]);
                var pagenum = HttpContext.Current.Request.Form["ppindex"];
                string AgentName = HttpContext.Current.Request.Form["agentname"];
                string AgentAddress = HttpContext.Current.Request.Form["agentaddress"];

                if (pagenum == "undefined" || pagenum == null || pagenum == "")
                {
                    pagenum = "1";
                }
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                //var apiUrl = "http://localhost:44389";
                var addfClient = new WebClient();
                object rawfile = new
                {
                    IprTypeId = IprTypeId,
                    pageNumber = Convert.ToInt32(pagenum),
                    pageSize = pagesize,
                    vAgentName = AgentName,
                    vAgentAddress = AgentAddress
                };

                string deviceIP = myIP();
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var res = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/AgentSearchWithAgentAddress"), "POST", builders);
                jObject = JObject.Parse(res);
                db1.usp_AddAudit(Convert.ToInt32(EventType.TrdsrcIPR), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.TrdsrcIPR), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), new Guid(LoggedInUser.UserId.ToString()), "Message=" + jObject["Message"].ToString() + "@Stack Trace=AgentSearchForTrademark", deviceIP, GetMacAddress().ToString(), 0, "");
            }
            catch(Exception ex)
            {
                File.WriteAllText("ErrorLogForPatentSearch.txt", ex.Message.ToString());
                //db1.usp_AddAuditError(Convert.ToInt32(EventType.IPR), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.IPR), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            return Ok(jObject);
        }

        public IHttpActionResult AgentSearchByNameAndAddress()
        {
            JObject jObject = new JObject();
            try
            {
                int pagenum = 1, pagesize = 10;
                pagenum = Convert.ToInt32(HttpContext.Current.Request.Form["pageindex"]);
                var AgentName = HttpContext.Current.Request.Form["agentname"];
                AgentName = AgentName.Replace("\r\n", "");
                var AgentAddress = HttpContext.Current.Request.Form["agentaddress"];

                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                //var apiUrl = "http://localhost:44389";
                var addfClient = new WebClient();
                object rawfile = new
                {
                    pageNumber = pagenum,
                    pageSize = pagesize,
                    vAgentName = AgentName,
                    vAgentAddress = AgentAddress
                };
                addfClient.Encoding = System.Text.Encoding.UTF8;
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var res = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/AgentDetailsByNameAndAddress"), "POST", builders);
                jObject = JObject.Parse(res);
            }
            catch (Exception ex)
            {

            }
            return Ok(jObject);
        }

        // code by sunny for ViewIPRCase

        /// <summary>
        /// Adding Data For Patent By Tradeid 
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CreateIPRCaseForPatent()
        {
            try
            {
                string hidden = QueryAES.UrlDecode(HttpContext.Current.Request.Form["hidden"]);
                var FirmId = LoggedInUser.FirmId.ToString();
                var UserId = LoggedInUser.UserId.ToString();
                var Username = LoggedInUser.UserFullName.ToString();
                string UserType = LoggedInUser.RoleId.ToString();
                var ApplicantName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ApplicantName"]);
                var ApplicationNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ApplicationNo"]);
                var PublicationDate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["PublicationDate"]);
                var FilingDate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["FilingDate"]);
                var TitleOfInvention = QueryAES.UrlDecode(HttpContext.Current.Request.Form["TitleOfInvention"]);
                var InternationalClassification = QueryAES.UrlDecode(HttpContext.Current.Request.Form["InternationalClassification"]);
                var PriorityDocumentNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["PriorityDocumentNo"]);
                var PriorityDate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["PriorityDate"]);
                var PriorityCountry = QueryAES.UrlDecode(HttpContext.Current.Request.Form["PriorityCountry"]);
                var InternationalApplicationNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["InternationalApplicationNo"]);
                var InternationalFilingDate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["InternationalFilingDate"]);
                var InternationalPublicationNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["InternationalPublicationNo"]);
                var PatentAdditionNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["PatentAdditionNo"]);
                var FilingDatePatentAddition = QueryAES.UrlDecode(HttpContext.Current.Request.Form["FilingDatePatentAddition"]);
                var DivisionalNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["DivisionalNo"]);
                var FilingDateInventor = QueryAES.UrlDecode(HttpContext.Current.Request.Form["FilingDateInventor"]);
                var InventorName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["InventorName"]);
                var Abstract = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Abstract"]);
                var NoOfPages = QueryAES.UrlDecode(HttpContext.Current.Request.Form["NoOfPages"]);
                var NoOfClaims = QueryAES.UrlDecode(HttpContext.Current.Request.Form["NoOfClaims"]);
                var PatentOfficeJournal = QueryAES.UrlDecode(HttpContext.Current.Request.Form["PatentOfficeJournal"]);
                var iprtype = HttpContext.Current.Request.Form["ip"];

                string Id = hidden;
                if (Id == null || Id == "null")
                {
                    Id = "";
                }
                try
                {
                    var result1 = DataAccessIPRADO.saveiprPatent(Id, FirmId, UserId, ApplicantName, ApplicationNo, PublicationDate, FilingDate, TitleOfInvention, InternationalClassification, PriorityDocumentNo, PriorityDate, PriorityCountry, InternationalApplicationNo, InternationalFilingDate,
                        InternationalPublicationNo, PatentAdditionNo, FilingDatePatentAddition, DivisionalNo, FilingDateInventor, InventorName, Abstract, NoOfPages, NoOfClaims, PatentOfficeJournal);

                    var caseid = result1.Rows[0]["CaseID"].ToString(); /// Primary key
					var updateflag = result1.Rows[0]["updateflag"].ToString(); /// Flag for check data Updated if updateflag is 1
					if (updateflag == "2")
                    {
                        return Ok(new { Status = false, data = "Application Name Already Exits." });
                    }

                    var createiprtype = iprtype;
                    if (createiprtype == "3")
                    {
                        iprtype = "Patent";
                    }

                    try
                    {
                        /// Create Folder Function
                        if (!string.IsNullOrEmpty(caseid.ToString()))
                        {
                            var resultdata = CommonDocIntegration.CreateIPRFolder(LoggedInUser.UserId.ToString(), LoggedInUser.FirmId.ToString(), caseid.ToString(), "CreateIPR", iprtype, null, ApplicantName, UserType, Username, updateflag);
                        }
                    }
                    catch { }
                }
                catch (Exception ex)
                {
                    // Handle exception (log or do something meaningful)
                }

            }
            catch (Exception ex)
            {

            }
            return Ok(new { Status = true, data = "OK" });
        }


        /// <summary>
        /// Method for the View IPR Patent List Case  are below :- 
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ListForIPRPatentCase()
        {
            DataTable list = new DataTable();
            try
            {
                int pagesize = 10, pagenum = 1;
                var userId = LoggedInUser.UserId.ToString();
                var firmId = LoggedInUser.FirmId.ToString();
                pagenum = Convert.ToInt32(HttpContext.Current.Request.Form["pagenum1"]);
                pagesize = Convert.ToInt32(HttpContext.Current.Request.Form["pagesize1"]);
                list = DataAccessIPRADO.ViewIPRPatentCaseList(firmId, userId, pagenum, pagesize);
            }
            catch (Exception ex)
            {
            }
            return Ok(new { data = list });
        }


        /// <summary>
        /// Viewing IPR Patent Case By Id
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ViewPatentIPRById()
        {
            DataTable list = new DataTable();
            try
            {
                int pagesize = 10, pagenum = 1;
                var userId = LoggedInUser.UserId.ToString();
                var firmId = LoggedInUser.FirmId.ToString();
                var id = HttpContext.Current.Request.Form["iid"];
                list = DataAccessIPRADO.ViewIPRPatentCaseList(firmId, userId, pagenum, pagesize, id);
            }
            catch (Exception ex)
            {
            }
            return Ok(new { data = list });
        }


        /// <summary>
        /// Adding Data For Patent By Tradeid 
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CreateIPRCaseForGI()
        {
            try
            {
                string hidden = QueryAES.UrlDecode(HttpContext.Current.Request.Form["hidden"]);
                var FirmId = LoggedInUser.FirmId.ToString();
                var UserId = LoggedInUser.UserId.ToString();
                var Username = LoggedInUser.UserFullName.ToString();
                string UserType = LoggedInUser.RoleId.ToString();
                var ApplicantName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ApplicantName"]);
                var ApplicantAddress = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ApplicantAddress"]);
                var ApplicationNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ApplicationNo"]);
                var GIName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["GIName"]);
                var GIDate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["GIDate"]);
                var Class = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Class"]);
                var Goods = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Goods"]);
                var Specifications = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Specifications"]);
                var iprtype = HttpContext.Current.Request.Form["ip"];

                string Id = hidden;
                if (Id == null || Id == "null")
                {
                    Id = "";
                }
                try
                {
                    var result1 = DataAccessIPRADO.saveiprGI(Id, FirmId, UserId, ApplicantName, ApplicantAddress, ApplicationNo, GIName, GIDate, Class, Goods, Specifications);

                    var caseid = result1.Rows[0]["CaseID"].ToString(); /// Primary key
					var updateflag = result1.Rows[0]["updateflag"].ToString(); /// Flag for check data Updated if updateflag is 1

                    if (updateflag == "2")
                    {
                        return Ok(new { Status = false, data = "Application Name Already Exits." });
                    }

                    var createiprtype = iprtype;
                    if (createiprtype == "4")
                    {
                        iprtype = "GI";
                    }

                    try
                    {
                        /// Create Folder Function
                        if (!string.IsNullOrEmpty(caseid.ToString()))
                        {
                            var resultdata = CommonDocIntegration.CreateIPRFolder(LoggedInUser.UserId.ToString(), LoggedInUser.FirmId.ToString(), caseid.ToString(), "CreateIPR", iprtype, null, ApplicantName, UserType, Username, updateflag);
                        }
                    }
                    catch { }
                }
                catch (Exception ex)
                {
                    // Handle exception (log or do something meaningful)
                }
            }
            catch (Exception ex)
            {
                // Handle exception (log or do something meaningful)
            }
            return Ok(new { Status = true, data = "OK" });
        }


        /// <summary>
        /// Method for the View IPR Patent List Case  are below :- 
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ListForIPRGICase()
        {
            DataTable list = new DataTable();
            try
            {
                int pagesize = 10, pagenum = 1;
                var userId = LoggedInUser.UserId.ToString();
                var firmId = LoggedInUser.FirmId.ToString();
                pagenum = Convert.ToInt32(HttpContext.Current.Request.Form["pagenum1"]);
                pagesize = Convert.ToInt32(HttpContext.Current.Request.Form["pagesize1"]);
                list = DataAccessIPRADO.ViewIPRGICaseList(firmId, userId, pagenum, pagesize);
            }
            catch (Exception ex)
            {

            }
            return Ok(new { data = list });
        }

        /// <summary>
        /// Viewing IPR Patent Case By Id
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ViewGIIPRById()
        {
            DataTable list = new DataTable();
            try
            {
                int pagesize = 10, pagenum = 1;
                var userId = LoggedInUser.UserId.ToString();
                var firmId = LoggedInUser.FirmId.ToString();
                var id = HttpContext.Current.Request.Form["iid"];
                list = DataAccessIPRADO.ViewIPRGICaseList(firmId, userId, pagenum, pagesize, id);
            }
            catch (Exception ex)
            {
            }
            return Ok(new { data = list });
        }


        /// <summary>
        /// Viewing IPR Copyright Case By Id
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ViewCopyrightIPRById()
        {
            DataTable list = new DataTable();
            try
            {
                int pagesize = 10, pagenum = 1;
                var userId = LoggedInUser.UserId.ToString();
                var firmId = LoggedInUser.FirmId.ToString();
                var id = HttpContext.Current.Request.Form["iid"];
                list = DataAccessIPRADO.ViewIPRCopyrightCaseList(firmId, userId, pagenum, pagesize, id);
            }
            catch (Exception ex)
            {
            }
            return Ok(new { data = list });
        }

        /// <summary>
        /// Method for the View IPR Copyright List Case  are below :- 
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ListForIPRCopyrightCase()
        {
            DataTable list = new DataTable();
            try
            {
                int pagesize = 10, pagenum = 1;
                var userId = LoggedInUser.UserId.ToString();
                var firmId = LoggedInUser.FirmId.ToString();
                pagenum = Convert.ToInt32(HttpContext.Current.Request.Form["pagenum1"]);
                pagesize = Convert.ToInt32(HttpContext.Current.Request.Form["pagesize1"]);
                list = DataAccessIPRADO.ViewIPRCopyrightCaseList(firmId, userId, pagenum, pagesize);
            }
            catch (Exception ex)
            {
            }
            return Ok(new { data = list });
        }

        /// <summary>
        /// Adding Data For Copyright By Tradeid 
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CreateIPRCaseForCopyRight()
        {
            try
            {
                string hidden = QueryAES.UrlDecode(HttpContext.Current.Request.Form["hidden"]);
                string UserId = LoggedInUser.UserId.ToString();
                var FirmId = LoggedInUser.FirmId.ToString();
                var Username = LoggedInUser.UserFullName.ToString();
                string UserType = LoggedInUser.RoleId.ToString();
                var txtApplicantName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtApplicantName"]);
                var applicantAddress = QueryAES.UrlDecode(HttpContext.Current.Request.Form["applicantAddress"]);
                var titleWork = QueryAES.UrlDecode(HttpContext.Current.Request.Form["titleWork"]);
                var diaryNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["diaryNo"]);
                var rocNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["rocNo"]);
                var category = QueryAES.UrlDecode(HttpContext.Current.Request.Form["category"]);
                var dateValue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dateValue"]);
                var iprtype = HttpContext.Current.Request.Form["ip"];

                string Id = hidden;
                if (Id == null || Id == "null")
                {
                    Id = "";
                }
                try
                {
                    var result1 = DataAccessIPRADO.saveiprCopyright(Id, FirmId, UserId, txtApplicantName, applicantAddress, titleWork, diaryNo, rocNo, category, dateValue);

                    var caseid = result1.Rows[0]["CaseID"].ToString(); /// Primary key
					var updateflag = result1.Rows[0]["updateflag"].ToString(); /// Flag for check data Updated if updateflag is 1

                    if (updateflag == "2")
                    {
                        return Ok(new { Status = false, data = "Application Name Already Exits." });
                    }

                    var createiprtype = iprtype;
                    if (createiprtype == "2")
                    {
                        iprtype = "Copy Right";
                    }

                    try
                    {
                        /// Create Folder Function
                        if (!string.IsNullOrEmpty(caseid.ToString()))
                        {
                            var resultdata = CommonDocIntegration.CreateIPRFolder(LoggedInUser.UserId.ToString(), LoggedInUser.FirmId.ToString(), caseid.ToString(), "CreateIPR", iprtype, null, txtApplicantName, UserType, Username, updateflag);
                        }
                    }
                    catch { }

                }
                catch (Exception ex)
                {
                }
            }
            catch (Exception ex)
            {
            }
            return Ok(new { Status = true, data = "OK" });
        }


        /// <summary>
        /// Adding Data For Design By Tradeid 
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CreateIPRCaseForDesign()
        {
            try
            {
                string hidden = QueryAES.UrlDecode(HttpContext.Current.Request.Form["hidden"]);
                var FirmId = LoggedInUser.FirmId.ToString();
                var UserId = LoggedInUser.UserId.ToString();
                var Username = LoggedInUser.UserFullName.ToString();
                string UserType = LoggedInUser.RoleId.ToString();
                var ApplicantName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ApplicantName"]);
                var ApplicantAddress = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ApplicantAddress"]);
                var Title = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Title"]);
                var DesignNumber = QueryAES.UrlDecode(HttpContext.Current.Request.Form["DesignNumber"]);
                var Class = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Class"]);
                var dDate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dDate"]);
                var JournalNumber = QueryAES.UrlDecode(HttpContext.Current.Request.Form["JournalNumber"]);
                var PriorityNumber = QueryAES.UrlDecode(HttpContext.Current.Request.Form["PriorityNumber"]);
                var PriorityDate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["PriorityDate"]);
                var PriorityCountry = QueryAES.UrlDecode(HttpContext.Current.Request.Form["PriorityCountry"]);
                var iprtype = HttpContext.Current.Request.Form["ip"];

                string Id = hidden;
                if (Id == null || Id == "null")
                {
                    Id = "";
                }
                try
                {
                    var result1 = DataAccessIPRADO.saveiprDesign(Id, FirmId, UserId, ApplicantName, ApplicantAddress, Title, DesignNumber, Class, dDate, JournalNumber, PriorityNumber, PriorityDate, PriorityCountry);

                    var caseid = result1.Rows[0]["CaseID"].ToString(); /// Primary key
					var updateflag = result1.Rows[0]["updateflag"].ToString(); /// Flag for check data Updated if updateflag is 1

                    if (updateflag == "2")
                    {
                        return Ok(new { Status = false, data = "Application Name Already Exits." });
                    }

                    var createiprtype = iprtype;
                    if (createiprtype == "5")
                    {
                        iprtype = "Design";
                    }
                    try
                    {
                        /// Create Folder Function
                        if (!string.IsNullOrEmpty(caseid.ToString()))
                        {
                            var resultdata = CommonDocIntegration.CreateIPRFolder(LoggedInUser.UserId.ToString(), LoggedInUser.FirmId.ToString(), caseid.ToString(), "CreateIPR", iprtype, null, ApplicantName, UserType, Username, updateflag);
                        }
                    }
                    catch { }
                }
                catch (Exception ex)
                {
                    // Handle exception (log or do something meaningful)
                }
            }
            catch (Exception ex)
            {
                // Handle exception (log or do something meaningful)
            }
            return Ok(new { Status = true, data = "done" });
        }

        /// <summary>
        /// Method for the View IPR Design List Case  are below :- 
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ListForIPRDesignCase()
        {
            DataTable list = new DataTable();
            try
            {
                int pagesize = 10, pagenum = 1;
                var userId = LoggedInUser.UserId.ToString();
                var firmId = LoggedInUser.FirmId.ToString();
                pagenum = Convert.ToInt32(HttpContext.Current.Request.Form["pagenum1"]);
                pagesize = Convert.ToInt32(HttpContext.Current.Request.Form["pagesize1"]);
                list = DataAccessIPRADO.ViewIPRDesignCaseList(firmId, userId, pagenum, pagesize);
            }
            catch (Exception ex)
            {
                // Handle exception (log or do something meaningful)
            }
            return Ok(new { data = list });
        }

        /// <summary>
        /// Viewing IPR Design Case By Id
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ViewDesignIPRById()
        {
            DataTable list = new DataTable();
            try
            {
                int pagesize = 10, pagenum = 1;
                var userId = LoggedInUser.UserId.ToString();
                var firmId = LoggedInUser.FirmId.ToString();
                var id = HttpContext.Current.Request.Form["iid"];
                list = DataAccessIPRADO.ViewIPRDesignCaseList(firmId, userId, pagenum, pagesize, id);
            }
            catch (Exception ex)
            {
                // Handle exception (log or do something meaningful)
            }
            return Ok(new { data = list });
        }

        /// <summary>
        /// Delete IPR Case By Id and Ip
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult FetchDeleteIPRCaseById()
        {
            var userId = LoggedInUser.UserId.ToString();
            var firmId = LoggedInUser.FirmId.ToString();
            var repo = new IPRRepository();
            string id = HttpContext.Current.Request.Form["id"];
            int ip = Convert.ToInt32(HttpContext.Current.Request.Form["ip"]);
            int result = repo.RemoveIPRCaseList(userId, firmId, id, ip);
            return Ok(new { data = result });
        }

        /// <summary>
        /// Method for fetching seperate User Added IPs and bnind it to the IPRDashboard
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult DashboardDifferentIPs()
        {
            var userId = LoggedInUser.UserId.ToString();
            var firmId = LoggedInUser.FirmId.ToString();

            var repo = new IPRRepository();
            var list = repo.GetIPListCount(userId, firmId);
            var newdata = JsonConvert.SerializeObject(list);
            return Ok(new { data = newdata });
        }

        /// <summary>
        /// Method for fetching IPR Docs Path,Applicaiton No and Description
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult IPRUploadedDocs()
        {
            JObject jObject = new JObject();

            var vApplicationNo = HttpContext.Current.Request.Form["vapplno"];
            var PageNum = HttpContext.Current.Request.Form["pagenum"];
            var PageSize = HttpContext.Current.Request.Form["pagesize"];

            vApplicationNo = (vApplicationNo == null || vApplicationNo == "null") ? "" : vApplicationNo;

            var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
            //var apiUrl = "http://localhost:44389";
            var addfClient = new WebClient();
            object rawfile = new
            {
                vApplNo = vApplicationNo,
                Pagenum = PageNum,
                Pagesize = PageSize
            };

            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            var res = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/IPRUploadedDocs"), "POST", builders);
            jObject = JObject.Parse(res);

            return Ok(jObject);
        }

        /// <summary>
        /// Method for fetching IPR Opposition Docs Path,Applicaiton No and Description
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult IPROppositionUploadedDocs()
        {
            JObject jObject = new JObject();

            var vApplicationNo = HttpContext.Current.Request.Form["vapplno"];
            var PageNum = HttpContext.Current.Request.Form["pagenum"];
            var PageSize = HttpContext.Current.Request.Form["pagesize"];

            vApplicationNo = (vApplicationNo == null || vApplicationNo == "null") ? "" : vApplicationNo;

            var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
            //var apiUrl = "http://localhost:44389";
            var addfClient = new WebClient();
            object rawfile = new
            {
                vApplNo = vApplicationNo,
                Pagenum = PageNum,
                Pagesize = PageSize
            };

            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            var res = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/IPRUploadedDocsForOpposition"), "POST", builders);
            jObject = JObject.Parse(res);

            return Ok(jObject);

        }

        /// <summary>
        /// Method for fetching Added IPRs with a 'Registered' status
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult IPRDashRegisteredData()
        {
            //var jObject = new JObject();
            string UserId = LoggedInUser.UserId.ToString();
            string firmId = LoggedInUser.FirmId.ToString();

            IPRRepository repo = new IPRRepository();

            var list = repo.GetRegistIPRData(UserId, firmId);

            var SerialValue = JsonConvert.SerializeObject(list);

            //var data = JObject.Parse(SerialValue);           

            return Ok(new { data = SerialValue });
        }

        /// <summary>
        /// Method for fetching Added IPRs with a 'Pending' status
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult IPRDashPendingData()
        {
            string UserId = LoggedInUser.UserId.ToString();
            string firmId = LoggedInUser.FirmId.ToString();

            IPRRepository repo = new IPRRepository();

            var list = repo.GetPendingIPRData(UserId, firmId);

            var SerialValue = JsonConvert.SerializeObject(list);

            return Ok(new { data = SerialValue });
        }

        [FirmApiAuthorization]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult IPROppositionDetails()
        {
            int PageNum = 1, PageSize = 10;
            JObject jObject = new JObject();

            string vApplNo = HttpContext.Current.Request.Form["vapplno"];
            PageNum = Convert.ToInt32(HttpContext.Current.Request.Form["pagenum"]);
            PageSize = Convert.ToInt32(HttpContext.Current.Request.Form["pagesize"]);

            var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
            //var apiUrl = "http://localhost:44389";
            var addfClient = new WebClient();
            object rawfile = new
            {
                vApplNo = vApplNo,
                PageNum = PageNum,
                Pagesize = PageSize
            };

            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            var res = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/IPROppositionDetails"), "POST", builders);
            jObject = JObject.Parse(res);

            return Ok(jObject);
        }

        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public string ReplaceSplCharacter(string input)
        {
            string NewInput = input;

            if (Regex.IsMatch(NewInput, "amp;", RegexOptions.IgnoreCase))
            {
                NewInput = Regex.Replace(NewInput, "amp;", "");
            }

            return NewInput;
        }
        /// <summary>
        /// Assign trademark to user
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpGet]
        public IHttpActionResult AssignTrademarkToUser()
        {
            try
            {
                var tradeMarkId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["tradeid"]);
                var applicationNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ApplicationNo"]);
                var tradeMarkIP = QueryAES.UrlDecode(HttpContext.Current.Request.Form["TradeIP"]);
                var assignedUser = QueryAES.UrlDecode(HttpContext.Current.Request.Form["assignedUser"]);
                var firmId = LoggedInUser.FirmId.ToString();
                var loggedInUserId = LoggedInUser.UserId.ToString();
                var assignUserResult = Repository.IPR.SaveAssignUser(tradeMarkId, applicationNo, assignedUser, firmId, loggedInUserId, tradeMarkIP);
                return Ok(assignUserResult);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Get all active firm user
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpGet]
        public IHttpActionResult GetAllActiveFirmUser()
        {
            try
            {
                var db = new LawPracticeEntities();
                var matter = db.usp_GetTeamMemberbyFirmId(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).OrderBy(x => x.UserName).ToList();
                //var cmatter = JsonConvert.SerializeObject(matter);
                var result = matter.Where(e => e.roleid != 1 && e.UserName != LoggedInUser.UserName.ToString()).ToList();
                //matter.Where(matter.roleid != 1 && matter.loginid != LoggedInUser.UserId.ToString());
                var cmatter = JsonConvert.SerializeObject(result);
                return Ok(cmatter);
            }
            catch
            {
                return Ok();
            }
        }


        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ViewSharedTradeMarkDetails()
        {
            //var testdata = storedData;

            int pagesize1 = 10, pageindex = 1;
            string searchstatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["searchstatus"]);
            searchstatus = searchstatus.Replace("&amp;", "&");
            //switch (HttpContext.Current.Request.QueryString["Status"])
            //{
            //    case "Registered":
            //        searchstatus = HttpContext.Current.Request.QueryString["Status"];
            //        break;

            //    case "Pending":
            //        searchstatus = HttpContext.Current.Request.QueryString["Status"];
            //        break;

            //    case null:
            //        searchstatus = "";
            //        break;

            //    case "undefined":
            //        searchstatus = "";
            //        break;
            //}
            pageindex = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
            pagesize1 = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
            var IPList = QueryAES.UrlDecode(HttpContext.Current.Request.Form["IPList"]);
            var filtertradmark = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtertradmark"]);
            var searchclass = QueryAES.UrlDecode(HttpContext.Current.Request.Form["searchclass"]);
            var Proprietor = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Proprietor"]);
            var applicationno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["applicationno"]);
            var dateapplicationto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtdateapplicationto"]);
            var dateapplicationfrom = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtdateapplicationfrom"]);
            var sort = HttpContext.Current.Request.Form["vsort"];
            var colname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["colname"]);
            var dHearingDatefrom = QueryAES.UrlDecode(HttpContext.Current.Request.Form["hearingFrmDate"]);
            var dHearingDateto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["hearingToDate"]);

            var IPRCounter = HttpContext.Current.Request.Form["iprcounter"];

            var httpRequest = HttpContext.Current.Request;

            if (sort == null || sort == "" || sort == "undefined")
            {
                sort = "0";
            }

            if (colname == null || colname == "undefined")
            {
                colname = "";
            }

            string message = "";
            string userId = LoggedInUser.UserId.ToString();
            string firmId = LoggedInUser.FirmId.ToString();
            var db = new IPRRepository();

            var ds = Repository.IPR.GetSharedIPRTrademark(userId, firmId, searchclass, Proprietor, dateapplicationfrom, dateapplicationto, searchstatus, "", "", "", "", filtertradmark, applicationno, "", pageindex, pagesize1, Convert.ToInt32(sort), colname, dHearingDatefrom, dHearingDateto).ToList();
            var js = JsonConvert.SerializeObject(ds);
            return Ok(new { data = js });
        }
        /// <summary>
        /// Bind Examination Report
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult BindExaminationReport()
        {
            JObject jObject = new JObject();
            int PageNum = 1, PageSize = 10;
            try
            {
                var applicationno = HttpContext.Current.Request.Form["applNo"];
                //PageNum = Convert.ToInt32(HttpContext.Current.Request.Form["PageNum"]);
                //PageSize = Convert.ToInt32(HttpContext.Current.Request.Form["PageSize"]);
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];

                var addfClient = new WebClient();
                object rawfile = new
                {
                    vApplNo = applicationno,
                    PageNum = PageNum,
                    PageSize = PageSize
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var res = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/BindExamReportDoc"), "POST", builders);
                jObject = JObject.Parse(res);
            }
            catch (Exception ex) { }
            return Ok(jObject);
        }

        /// <summary>
        /// Bind Correspondence Report
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult BindCorrespondenceReport()
        {
            JObject jObject = new JObject();
            int PageNum = 1, PageSize = 10;
            try
            {
                var applicationno = HttpContext.Current.Request.Form["applNo"];
                PageNum = Convert.ToInt32(HttpContext.Current.Request.Form["PageNum"]);
                PageSize = Convert.ToInt32(HttpContext.Current.Request.Form["PageSize"]);
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];

                var addfClient = new WebClient();
                object rawfile = new
                {
                    vApplNo = applicationno,
                    PageNum = PageNum,
                    PageSize = PageSize
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var res = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/BindCorrespondenceReport"), "POST", builders);
                jObject = JObject.Parse(res);
            }
            catch (Exception ex) { }
            return Ok(jObject);
        }

        /// <summary>
        /// Bind Property rights detail
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult BindPropertyRightDetail()
        {
            JObject jObject = new JObject();
            int PageNum = 1, PageSize = 10;
            try
            {
                var applicationno = HttpContext.Current.Request.Form["applNo"];
                PageNum = Convert.ToInt32(HttpContext.Current.Request.Form["PageNum"]);
                PageSize = Convert.ToInt32(HttpContext.Current.Request.Form["PageSize"]);
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];

                var addfClient = new WebClient();
                object rawfile = new
                {
                    vApplNo = applicationno,
                    PageNum = PageNum,
                    PageSize = PageSize
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var res = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/BindPRDetails"), "POST", builders);
                jObject = JObject.Parse(res);
            }
            catch (Exception ex) { }
            return Ok(jObject);
        }

        /// <summary>
        /// Bind Property rights detail
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CheckDetailAvailablity()
        {
            JObject jObject = new JObject();
            try
            {
                var applicationno = HttpContext.Current.Request.Form["applNo"];
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                var addfClient = new WebClient();
                object rawfile = new
                {
                    vApplNo = applicationno
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var res = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/CheckDetailAvailableOrNot"), "POST", builders);
                jObject = JObject.Parse(res);
            }
            catch (Exception ex) { }
            return Ok(jObject);
        }

        /// <summary>
        /// Bind judgement detail
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult BindJudgementDocDetail()
        {
            JObject jObject = new JObject();
            try
            {
                var applicationno = HttpContext.Current.Request.Form["vApplNo"];
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];
                var addfClient = new WebClient();
                object rawfile = new
                {
                    vApplNo = applicationno
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var res = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/BindJudgementDocDetails"), "POST", builders);
                jObject = JObject.Parse(res);
            }
            catch (Exception ex) { }
            return Ok(jObject);
        }


        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ViewDeletedTradeMarkDetails()
        {
            int pagesize1 = 10, pageindex = 1;
            pageindex = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
            pagesize1 = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
            var filtertradmark = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtertradmark"]);
            var applicationno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["applicationno"]);

            string userId = LoggedInUser.UserId.ToString();
            string firmId = LoggedInUser.FirmId.ToString();

            var listobj = DataAccessIPRADO.GetdeleteRestoreIPRTrademark(userId, firmId, filtertradmark, applicationno, pageindex, pagesize1);

            return Content(HttpStatusCode.OK, listobj);
        }


        /// <summary>
        /// Restore Deleted IPR data
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RestoreDeletedTradeMarkDetails()
        {
            DataTable dt = new DataTable();
            try
            {
                var trademarkId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["trademarkId"]);
                var iid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["iid"]);
                var ip = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ip"]);
                string userId = LoggedInUser.UserId.ToString();
                string firmId = LoggedInUser.FirmId.ToString();
                dt = DataAccessIPRADO.RestoredeleteRestoreIPRTrademark(userId, firmId, trademarkId, iid, ip);
            }
            catch (Exception ex)
            {
            }
            return Content(HttpStatusCode.OK, dt);
        }

        /// <summary>
        /// Remove deleted IPR Data (Trandemark, Copyright, Design...)
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveDeletedTradeMarkDetails()
        {
            DataTable dt = new DataTable();
            try
            {
                var trademarkId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["trademarkId"]);
                var iid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["iid"]);
                var ip = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ip"]);
                string userId = LoggedInUser.UserId.ToString();
                string firmId = LoggedInUser.FirmId.ToString();
                dt = DataAccessIPRADO.RemovedeleteRestoreIPRTrademark(userId, firmId, trademarkId, iid, ip);
            }
            catch (Exception ex)
            {
            }
            return Content(HttpStatusCode.OK, dt);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult DashboardIPRTotalSearchesGraph()
        {
            JObject jObject = new JObject();
            try
            {
                string userId = LoggedInUser.UserId.ToString();
                string RoleId = LoggedInUser.RoleId.ToString();
                string firmId = LoggedInUser.FirmId.ToString();
                string strusername = ConfigurationManager.AppSettings["IPRmatteridname"] + userId;
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];

                var addfClient = new WebClient();
                object rawfile = new
                {
                    username = strusername,
                    RoleId = RoleId,
                    firmId = firmId,
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var res = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/BindIPRTotalSearchesGraph"), "POST", builders);
                jObject = JObject.Parse(res);
            }
            catch (Exception ex) { }
            return Ok(jObject);
        }

        /// <summary>
        /// Get dynamic save email
        /// </summary>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult BindSaveEmail()
        {
            var tradeId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["tradeid"]);
            string message = "";
            string userId = LoggedInUser.UserId.ToString();
            string firmId = LoggedInUser.FirmId.ToString();
            var db = new IPRRepository();

            var ds = Repository.IPR.GetSavedEmail(userId, firmId, tradeId);
            var js = JsonConvert.SerializeObject(ds);
            return Ok(new { data = js });
        }

        /// <summary>
        /// Get List of deleted Copyright list
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ViewDeletedCopytightDetails()
        {
            DataTable dt = new DataTable();
            try
            {
                int pagesize1 = 10, pageindex = 1;
                pageindex = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                pagesize1 = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                var filtertradmark = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtertradmark"]);
                var applicationno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["applicationno"]);
                string userId = LoggedInUser.UserId.ToString();
                string firmId = LoggedInUser.FirmId.ToString();
                dt = DataAccessIPRADO.GetdeleteRestoreIPRCopyright(userId, firmId, filtertradmark, applicationno, pageindex, pagesize1);
            }
            catch (Exception ex)
            {
            }
            return Content(HttpStatusCode.OK, dt);
        }

        /// <summary>
        /// Get List of deleted GI list
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ViewDeletedGIDetails()
        {
            DataTable dt = new DataTable();
            try
            {
                int pagesize = 10, pageindex = 1;
                pageindex = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                var filtertradmark = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtertradmark"]);
                var applicationno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["applicationno"]);
                string userId = LoggedInUser.UserId.ToString();
                string firmId = LoggedInUser.FirmId.ToString();
                dt = DataAccessIPRADO.GetdeleteRestoreIPRGI(userId, firmId, filtertradmark, applicationno, pageindex, pagesize);
            }
            catch (Exception ex)
            {
            }
            return Content(HttpStatusCode.OK, dt);
        }


        /// <summary>
        /// Get List of deleted Design list
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ViewDeletedDesignDetails()
        {
            DataTable dt = new DataTable();
            try
            {
                int pagesize = 10, pageindex = 1;
                pageindex = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                var filtertradmark = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtertradmark"]);
                var applicationno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["applicationno"]);
                string userId = LoggedInUser.UserId.ToString();
                string firmId = LoggedInUser.FirmId.ToString();
                dt = DataAccessIPRADO.GetdeleteRestoreIPRDesign(userId, firmId, filtertradmark, applicationno, pageindex, pagesize);
            }
            catch (Exception ex)
            {
            }
            return Content(HttpStatusCode.OK, dt);
        }


        /// <summary>
        /// Get List of deleted Patent list
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ViewDeletedPatentDetails()
        {
            DataTable dt = new DataTable();
            try
            {
                int pagesize = 10, pageindex = 1;
                pageindex = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                var filtertradmark = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtertradmark"]);
                var applicationno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["applicationno"]);
                string userId = LoggedInUser.UserId.ToString();
                string firmId = LoggedInUser.FirmId.ToString();
                dt = DataAccessIPRADO.GetdeleteRestoreIPRPatent(userId, firmId, filtertradmark, applicationno, pageindex, pagesize);
            }
            catch (Exception ex)
            {
            }
            return Content(HttpStatusCode.OK, dt);
        }

        /// <summary>
        /// AddToTrackProprietorDetails Agent and Propritor deatils add to track
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public async Task<IHttpActionResult> AddToTrackProprietorDetails()
        {
            string vProprietorSearch = HttpContext.Current.Request.Form["vProprietorSearch"];
            string vProprietorAddressSearch = HttpContext.Current.Request.Form["vProprietorAddressSearch"];
            string SearchType = HttpContext.Current.Request.Form["SearchType"];
            if (string.IsNullOrEmpty(vProprietorSearch))
            {
                return Ok("Not Found");
            }
            else if (string.IsNullOrEmpty(vProprietorAddressSearch))
            {
                return Ok("Not Found");
            }
            var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];

            try
            {
                var client = new HttpClient();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                client.DefaultRequestHeaders.ExpectContinue = false;

                var requestPayload = new
                {
                    searchName = vProprietorSearch,
                    searchAddress = vProprietorAddressSearch,
                    searchType = SearchType
                };

                var jsonPayload = JsonConvert.SerializeObject(requestPayload);
                var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                HttpResponseMessage response = await client.PostAsync($"{apiUrl}/API/IPR/AddToTrackProprietorDetails", content);

                if (!response.IsSuccessStatusCode)
                {
                    return BadRequest("Failed to retrieve data from the external service.");
                }

                var responseString = await response.Content.ReadAsStringAsync();
                var list = JsonConvert.DeserializeObject<DataAccess.Modals.TrademarkDetailsList>(responseString);
                var dt = DataAccessIPRADO.SaveMultipleDetailsToTrack(list, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), SearchType);

                return Ok(dt);
            }
            catch (Exception ex)
            {
                return BadRequest("Something went wrong");
            }
        }

        /// <summary>
        /// Bind Correspondence Report
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult PatentFileListThoughAppealNo()
        {
            JObject jObject = new JObject();
            int PageNum = 1, PageSize = 10;
            try
            {
                var applicationno = HttpContext.Current.Request.Form["applNo"];
                PageNum = Convert.ToInt32(HttpContext.Current.Request.Form["PageNum"]);
                PageSize = Convert.ToInt32(HttpContext.Current.Request.Form["PageSize"]);
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];

                var addfClient = new WebClient();
                object rawfile = new
                {
                    vApplNo = applicationno,
                    PageNum = PageNum,
                    PageSize = PageSize
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var res = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/PatentFileListThoughAppealNo"), "POST", builders);
                jObject = JObject.Parse(res);
            }
            catch (Exception ex) { }
            return Ok(jObject);
        }

        /// <summary>
        /// Bind Decision Document by Application No.
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult PatentDecisionDocFileListThoughAppealNo()
        {
            JObject jObject = new JObject();
            int PageNum = 1, PageSize = 10;
            try
            {
                var applicationno = HttpContext.Current.Request.Form["applNo"];
                PageNum = Convert.ToInt32(HttpContext.Current.Request.Form["PageNum"]);
                PageSize = Convert.ToInt32(HttpContext.Current.Request.Form["PageSize"]);
                var apiUrl = ConfigurationManager.AppSettings["IPRapiurl"];

                var addfClient = new WebClient();
                object rawfile = new
                {
                    vApplNo = applicationno,
                    PageNum = PageNum,
                    PageSize = PageSize
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var res = addfClient.UploadString(new Uri(apiUrl + "/API/IPR/PatentDecisionDocFileListThoughAppealNo"), "POST", builders);
                jObject = JObject.Parse(res);
            }
            catch (Exception ex) { }
            return Ok(jObject);
        }

        /// <summary>
        /// Get Phonetic Search Details by mark.
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public async Task<IHttpActionResult> PhoneticSearchDetails()
        {
            JArray jsonObject = new JArray();
            int PageNum = 1, PageSize = 10;

            try
            {
                var searchTest =  HttpContext.Current.Request.Form["searchTest"];//"Abhishek";
                PageNum = Convert.ToInt16(HttpContext.Current.Request.Form["PageNum"]);
                PageSize = Convert.ToInt16(HttpContext.Current.Request.Form["PageSize"]);
                var phoneticAPIUrl = ConfigurationManager.AppSettings["IPRPhoneticSearchUrl"];

                object rawfile = new
                {
                    word = searchTest
                };

                string requestBody = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                using (var httpClient = new HttpClient())
                {
                    // Set timeout to 30 seconds
                    httpClient.Timeout = TimeSpan.FromSeconds(300);
                    httpClient.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

                    // Construct request URI
                    var requestUri = $"{phoneticAPIUrl+"/process_strings"}?word={searchTest}&page={PageNum}&pagesize={PageSize}";
                    var content = new StringContent(requestBody, Encoding.UTF8, "application/json");

                    // Send POST request
                    var response = await httpClient.PostAsync(requestUri, content);
                    response.EnsureSuccessStatusCode();

                    // Parse response content
                    var responseString = await response.Content.ReadAsStringAsync();
                    jsonObject = JArray.Parse(responseString);
                }
            }
            catch (Exception ex)
            {
                // Log exception or handle errors
                return InternalServerError(ex);
            }

            return Ok(jsonObject);
        }
        /// <summary>
        /// Get Phonetic Search Details by mark.
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public async Task<IHttpActionResult> PhoneticPopupDetails()
        {
            JArray jsonObject = new JArray();
            int PageNum = 1, PageSize = 10;

            try
            {
                var searchTest = HttpContext.Current.Request.Form["searchTest"];//"Abhishek";
                searchTest= searchTest.Replace("+", "%2B");
                PageNum = Convert.ToInt16(HttpContext.Current.Request.Form["PageNum"]);
                PageSize = Convert.ToInt16(HttpContext.Current.Request.Form["PageSize"]);
                var phoneticAPIUrl = ConfigurationManager.AppSettings["IPRPhoneticSearchUrl"];

                object rawfile = new
                {
                    word = searchTest
                };

                string requestBody = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                using (var httpClient = new HttpClient())
                {
                    // Set timeout to 30 seconds
                    httpClient.Timeout = TimeSpan.FromSeconds(300);
                    httpClient.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

                    // Construct request URI
                    var requestUri = $"{phoneticAPIUrl + "/word"}?word={searchTest}&page={PageNum}&pagesize={PageSize}";
                    var content = new StringContent(requestBody, Encoding.UTF8, "application/json");

                    // Send POST request
                    var response = await httpClient.PostAsync(requestUri, content);
                    response.EnsureSuccessStatusCode();

                    // Parse response content
                    var responseString = await response.Content.ReadAsStringAsync();
                    jsonObject = JArray.Parse(responseString);
                }
            }
            catch (Exception ex)
            {
                // Log exception or handle errors
                return InternalServerError(ex);
            }

            return Ok(jsonObject);
        }
        /// <summary>
        /// Get Phonetic Search Details by mark.
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult PhoneticSubDetails()
        {
            DataTable dt = new DataTable();
            try
            {
                string userId = LoggedInUser.UserId.ToString();
                string firmId = LoggedInUser.FirmId.ToString();
                dt = DataAccessIPRADO.GetPhoneticSubDetail(firmId);
            }
            catch (Exception ex)
            {
            }
            return Content(HttpStatusCode.OK, dt);
        }

        /// <summary>
        /// Get set alert detail
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult BindSetAlertDetail()
        {
            DataTable dt = new DataTable();
            try
            {
                string userId = LoggedInUser.UserId.ToString();
                string firmId = LoggedInUser.FirmId.ToString();
                var applicationNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["vsetAppNo"]);

                dt = DataAccessIPRADO.GetJournalAlertDetail(firmId, userId, applicationNo);
            }
            catch (Exception ex)
            {
            }
            return Content(HttpStatusCode.OK, dt);
        }

        /// <summary>
        /// Update Alert isactive
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult UpdateSetAlertDetail()
        {
            DataTable dt = new DataTable();
            try
            {
                string userId = LoggedInUser.UserId.ToString();
                string firmId = LoggedInUser.FirmId.ToString();
                var applicationNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["vsetAppNo"]);
                var IsActiveStatus = HttpContext.Current.Request.Form["rdAlertValue"];

                dt = DataAccessIPRADO.UpdateJournalAlertDetail(firmId, userId, applicationNo, IsActiveStatus);
            }
            catch (Exception ex)
            {
            }
            return Content(HttpStatusCode.OK, dt);
        }

        /// <summary>
        /// Check Journal Alert Subscriptopn
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CheckJournalAlertSub()
        {
            DataTable dt = new DataTable();
            try
            {
                string userId = LoggedInUser.UserId.ToString();
                string firmId = LoggedInUser.FirmId.ToString();
                dt = DataAccessIPRADO.CheckJournalAlertSub(firmId);
            }
            catch (Exception ex)
            {
            }
            return Content(HttpStatusCode.OK, dt);
        }

        /// <summary>
        /// Get Journal Alert history
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ViewJournalAlertHistory()
        {
            DataTable dt = new DataTable();
            try
            {
                int pagesize1 = 10, pageindex = 1;
                string userId = LoggedInUser.UserId.ToString();
                string firmId = LoggedInUser.FirmId.ToString();
                var applicationNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["vApplNo"]);
                var trademarkName= QueryAES.UrlDecode(HttpContext.Current.Request.Form["trademarkName"]);
                pageindex = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                pagesize1 = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));

                dt = DataAccessIPRADO.GetJournalAlertHistory(firmId, userId, applicationNo, pageindex, pagesize1, trademarkName);
            }
            catch (Exception ex)
            {
            }
            //var js = JsonConvert.SerializeObject(ds);

            return Ok(new { data = dt });

            //return Content(HttpStatusCode.OK, dt);
        }
        /// <summary>
        /// Get Journal Alert history
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ViewSimilarTrademark()
        {
            DataTable dt = new DataTable();
            try
            {
                int pagesize1 = 10, pageindex = 1;
                string firmId = LoggedInUser.FirmId.ToString();
                var applicationNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["jApplNo"]);
                var journalHId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["journalHId"]);
                pageindex = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                pagesize1 = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));

                dt = DataAccessIPRADO.ViewSimilarTrademark(firmId, applicationNo, journalHId, pageindex, pagesize1);
            }
            catch (Exception ex)
            {
            }
            return Ok(new { data = dt });
        }

        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult BindCountPhoneticAppl()
        {
            DataTable dt = new DataTable();
            try
            {
                var applicationno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["phVapplNo"]);
                string pagesize1 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize1"]); 
                string pagenum = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]);
                applicationno = (applicationno == null || applicationno.ToLower() == "null") ? "" : applicationno;
                pagenum = "1";
                string userId = LoggedInUser.UserId.ToString();
                string firmId = LoggedInUser.FirmId.ToString();
                dt = DataAccessIPRADO.ExportPhoneticallySimilarTrademark(firmId, userId, applicationno, pagenum, pagesize1);
            }
            catch { }
            return Ok(new { data = dt });
        }
        /// <summary>
        /// Added trademark if not available in master db
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult AddTrademarkForTracking()
        {
            DataTable dt = new DataTable();
            var applicationno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ApplNo"]);

            string userId = LoggedInUser.UserId.ToString();
            string firmId = LoggedInUser.FirmId.ToString();
            int cnnt = 0;
            string msg = "";
            try
            {
                var db = new LawPracticeEntities();
                dt = DataAccessIPRADO.AddedTradedMarkForTracking(applicationno, firmId, userId);
            }
            catch { }
            return Ok(new { data = dt });

        }

        //public IHttpActionResult PhoneticSearchDetails()
        //{
        //    JArray jsonObject = new JArray();
        //    string inputString = "";
        //    string responsestrfom = "";
        //    int PageNum = 1, PageSize = 10;
        //    try
        //    {
        //        var searchTest = HttpContext.Current.Request.Form["searchTest"];
        //        PageNum= Convert.ToInt16(HttpContext.Current.Request.Form["PageNum"]);
        //        PageSize = Convert.ToInt16(HttpContext.Current.Request.Form["PageSize"]);
        //        var phoneticAPIUrl = ConfigurationManager.AppSettings["IPRPhoneticSearchUrl"];
        //        object rawfile = new
        //        {
        //            word = searchTest
        //        };
        //        var addfClient = new WebClient();
        //        addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
        //        string builders = JsonConvert.SerializeObject(rawfile);

        //        ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
        //        //var res = addfClient.UploadString(new Uri(phoneticAPIUrl + "?word="+ searchTest), "POST", searchTest);
        //        var res = addfClient.UploadString(new Uri(phoneticAPIUrl + "?word=" + searchTest +"&page="+ PageNum + "&pagesize=" + PageSize), "POST", searchTest);
        //        jsonObject = JArray.Parse(res);
        //    }
        //    catch (Exception ex)
        //    {

        //    }
        //    return Ok(jsonObject);
        //}
    }
}
