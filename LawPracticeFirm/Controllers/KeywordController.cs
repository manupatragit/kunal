using DataAccess.Modals;
using LawPracticeFirm.Common;
using LawPracticeFirm.CustomFIlter;
using LawPracticeFirm.Models;
using LawPracticeFirm.Models.Keyword;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NJDGDetail.Models;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Entity.Core.Objects;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Web.Configuration;
using System.Web.Mvc;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace LawPracticeFirm.Controllers
{
    public class KeywordController : BaseFirmController
    {
        // GET: ProactiveAlerts
        public ActionResult Proactivealert()
        {
            return View();
        }
        public ActionResult ProactiveCases()
        {
            return View();
        }
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult FillKeywordCourtType()
        {
            List<CourtTypeList> CourtType = new List<CourtTypeList>();
            try
            {
                string userId = LoggedInUser.UserId.ToString();
                LawPracticeEntities db = new LawPracticeEntities();
                string strusername = ConfigurationManager.AppSettings["matteridname"] + userId;
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                //var apiUrl = "http://10.60.1.42:9010/API/IPR/ClassList";
                //For CW Live User Migartion
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
                    userIdDetail = strusername;
                }
                var addfClient = new WebClientConnection();
                object rawfile = new
                {
                    userid = userIdDetail,
                    Accesstoken = AccessTokenDetail
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/FillKeywordCourtType"), "POST", builders);
                JObject jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string status = data.Status;
                    string Message = data.Message;
                    string id = data.data[i].CourtTypeId;
                    string Name = data.data[i].CourtType;
                    // Add parts to the list.
                    CourtType.Add(new CourtTypeList
                    {
                        CourtTypeId = id,
                        CourtType = Name,
                    });
                }
            }
            catch (Exception ex)
            {
            }
            return Json(CourtType, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Get court details
        /// </summary>
        /// <param name="courttypeId"></param>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult GetCourt(string courttypeId = "")
        {
            List<CourtTypeList> CourtType = new List<CourtTypeList>();
            try
            {
                string userId = LoggedInUser.UserId.ToString();
                LawPracticeEntities db = new LawPracticeEntities();
                string strusername = ConfigurationManager.AppSettings["matteridname"] + userId;
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                //var apiUrl = "http://10.60.1.42:9010/API/IPR/ClassList";
                //For CW Live User Migartion
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
                    userIdDetail = strusername;
                }
                var addfClient = new WebClientConnection();
                object rawfile = new
                {
                    userid = userIdDetail,
                    Accesstoken = AccessTokenDetail,
                    Courttype = courttypeId
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/FillKeywordCourt"), "POST", builders);
                JObject jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string status = data.Status;
                    string Message = data.Message;
                    string id = data.data[i].CourtId;
                    string Name = data.data[i].Courtname;
                    // Add parts to the list.
                    CourtType.Add(new CourtTypeList
                    {
                        CourtTypeId = id,
                        CourtType = Name,
                    });
                }
            }
            catch (Exception ex)
            {
            }
            return Json(CourtType, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// User searchkeywords  quota
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult UserSearchKeywordsQuota()
        {
            KeywordsQuotaList quota = new KeywordsQuotaList();
            try
            {
                string userId = LoggedInUser.UserId.ToString();
                LawPracticeEntities db = new LawPracticeEntities();
                string strusername = ConfigurationManager.AppSettings["matteridname"] + userId;
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                //var apiUrl = "http://10.60.1.42:9010/API/IPR/ClassList";
                //For CW Live User Migartion
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
                    userIdDetail = strusername;
                }
                var addfClient = new WebClientConnection();
                object rawfile = new
                {
                    userid = userIdDetail,
                    Accesstoken = AccessTokenDetail
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/UserSearchKeywordsQuota"), "POST", builders);
                JObject jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                if (data1.Count > 0)
                {
                    for (int i = 0; i < data1.Count; i++)
                    {
                        dynamic data = JObject.Parse(resid);
                        string status = data.Status;
                        string Message = data.Message;
                        quota.vQuota = data.data[i].vQuota;
                        quota.addedkeyword = data.data[i].addedkeyword;
                        quota.iApproved = data.data[i].iApproved;
                        quota.ApprovedBy = data.data[i].ApprovedBy;
                        quota.ApprovedOn = data.data[i].ApprovedOn;
                        quota.Remarks = data.data[i].Remarks;
                        quota.vUserName = data.data[i].vUserName;
                        quota.ddate = data.data[i].ddate;
                        quota.dExpiryDate = data.data[i].dExpiryDate;
                        quota.KeywordPlanId = data.data[i].KeywordPlanId;
                    }
                }
                else
                {
                    quota.vQuota = "0";
                    quota.addedkeyword = "0";
                    quota.iApproved = "0";
                    quota.dExpiryDate = "";
                }
            }
            catch (Exception ex)
            {
            }
            return Json(quota, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Save keyword
        /// </summary>
        /// <param name="key"></param>
        /// <param name="courttype"></param>
        /// <param name="vcourt"></param>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public string SaveKeywords(string key, string courttype = "", string vcourt = "")
        {
            string cresponse = "";
            string userId = LoggedInUser.UserId.ToString();
            string firmids = LoggedInUser.FirmId.ToString();
            LawPracticeEntities db = new LawPracticeEntities();
            string strusername = ConfigurationManager.AppSettings["matteridname"] + userId;
            var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];

            #region for addregistration
            var vdisplayname = "";
            var countryname = "";
            var statename = "";
            var firmadminuserid = "";
            var startdate = "";
            var enddate = "";
            var firmadminusername = "";

            var getuserdetails = db.usp_GetUserDetailByUserID(firmids, userId).FirstOrDefault();
            if (getuserdetails != null)
            {
                vdisplayname = getuserdetails.Name;
                countryname = getuserdetails.country;
                statename = getuserdetails.cstate;
                firmadminuserid = getuserdetails.FirmAdminuserId;
                firmadminusername = getuserdetails.FirmAdminUserName.ToString();

            }

            var firmdates = db.usp_wf_GetFirmDetailByID(Guid.Parse(firmids)).FirstOrDefault();
            if (firmdates != null)
            {
                startdate = Convert.ToDateTime(firmdates.SubscriptionStartDate).Month.ToString("D2") + "/" + Convert.ToDateTime(firmdates.SubscriptionStartDate).Day.ToString("D2") + "/" + Convert.ToDateTime(firmdates.SubscriptionStartDate).Year.ToString();
                enddate = Convert.ToDateTime(firmdates.ExpiryDate).Month.ToString("D2") + "/" + Convert.ToDateTime(firmdates.ExpiryDate).Day.ToString("D2") + "/" + Convert.ToDateTime(firmdates.ExpiryDate).Year.ToString();

            }

            var IsCWUser = LoggedInUser.IsCaseWatchUser.ToString();
            var CWUserId = LoggedInUser.UserName.ToString();
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
                if (getuserdetails.IsAdminCW == 1)
                {
                    userIdDetail = LoggedInUser.UserName.ToString();
                    FirmuserIdDetail = firmadminusername;
                    AccessTokenDetail = "internal";
                }
                else
                {
                    AccessTokenDetail = "mykase123456789abcdef";
                    userIdDetail = WebConfigurationManager.AppSettings["matteridname"] + LoggedInUser.UserId;
                    FirmuserIdDetail = WebConfigurationManager.AppSettings["matteridname"] + firmadminuserid;
                }

            }
            #endregion
            object rawfile = new
            {
                Accesstoken = AccessTokenDetail,
                Email = getuserdetails.EmailId,
                Memberuserid = userIdDetail,
                Password = "MykaSe_PasSsword",
                Mobile = getuserdetails.cmobile,
                Dispname = vdisplayname,
                Countryname = countryname,
                StateName = statename,
                Subscriptionstart = startdate,
                Subscriptionend = enddate,
                userid = FirmuserIdDetail,
                //UserId = strusername,
                //Accesstoken = "mykase123456789abcdef",
                keyword = key,
                Courttype = courttype,
                Courtid = vcourt
            };
            var addfClient = new WebClientConnection();
            addfClient.Encoding = Encoding.UTF8;
            addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            string builders = JsonConvert.SerializeObject(rawfile);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/SaveKeyword"), "POST", builders);
            JObject jObject = JObject.Parse(resid);
            dynamic data1 = jObject["data"];
            dynamic data2 = JObject.Parse(resid);
            string status = data2.Status;
            string data = data2.Message;
            // string data = "Success";
            return data;
        }
        /// <summary>
        /// Get keyword list by user
        /// </summary>
        /// <param name="pagenum"></param>
        /// <param name="pagesize"></param>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult GetKeywordListByUser(string pagenum, string pagesize)
        {
            List<KeywordList> keylist = new List<KeywordList>();
            try
            {
                string userId = LoggedInUser.UserId.ToString();
                LawPracticeEntities db = new LawPracticeEntities();
                string strusername = ConfigurationManager.AppSettings["matteridname"] + userId;
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                //For CW Live User Migartion
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
                    userIdDetail = strusername;
                }
                var addfClient = new WebClientConnection();
                addfClient.Encoding = Encoding.UTF8;

                object rawfile = new
                {
                    UserId = userIdDetail,
                    Accesstoken = AccessTokenDetail,
                    Pageindex = pagenum,
                    Pagesize = pagesize
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/UserSearchKeywords"), "POST", builders);
                JObject jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string status = data.Status;
                    string Message = data.Message;
                    // Add parts to the list.
                    keylist.Add(new KeywordList
                    {
                        TotalRecord = data.data[i].TotalRecord,
                        RowId = data.data[i].RowId,
                        iid = data.data[i].iid,
                        vUsername = data.data[i].vUsername,
                        vKeyword = data.data[i].vKeyword,
                        ddate = data.data[i].ddate,
                        isActive = data.data[i].isActive,
                        vCourtType = data.data[i].vCourtType,
                        courtTypeName = data.data[i].courtTypeName,
                        vCourtName = data.data[i].vCourtName
                    });
                }
            }
            catch (Exception ex)
            {
            }
            return Json(keylist, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Update keyword active status
        /// </summary>
        /// <param name="keyid"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public string UpdateKeywordActiveStatus(string keyid, string status)
        {
            string Message = "";
            try
            {
                string userId = LoggedInUser.UserId.ToString();
                LawPracticeEntities db = new LawPracticeEntities();
                string strusername = ConfigurationManager.AppSettings["matteridname"] + userId;
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                //For CW Live User Migartion
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
                    userIdDetail = strusername;
                }

                var addfClient = new WebClientConnection();
                object rawfile = new
                {
                    userid = userIdDetail,
                    Accesstoken = AccessTokenDetail,
                    keyid = keyid,
                    Status = status
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/UpdateKeywordActiveStatus"), "POST", builders);
                JObject jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                dynamic data = JObject.Parse(resid);
                string istatus = data.Status;
                Message = data.Message;
                if (istatus.ToLower() == "true")
                {
                    Message = "Success";
                }
            }
            catch (Exception ex)
            {
            }
            return Message;
        }
        /// <summary>
        /// Get user search keywords by court
        /// </summary>
        /// <param name="courttype"></param>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public string GetUserSearchKeywordsByCourt(string courttype = "")
        {
            string str = "";
            try
            {
                DataTable dt = new DataTable();
                string userId = Convert.ToString(Session["sessionuserid"]);
                dt = KeywordModel.ActiveUsersKeywords(userId, courttype,LoggedInUser.IsCaseWatchUser,LoggedInUser.UserName.ToString());
                for (int k = 0; k < dt.Rows.Count; k++)
                {
                    str += "<option value='" + dt.Rows[k]["vKeyword"] + "'>" + Convert.ToString(dt.Rows[k]["vKeyword"]).ToUpper() + "</option>";
                }
            }
            catch (Exception ex)
            {
                return str;
            }
            return str;
        }
        /// <summary>
        /// View proactive alerts
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult ViewProactiveAlerts()
        {
            List<KeywordCaseList> keylist = new List<KeywordCaseList>();
            try
            {
                string courttype = "", pagenum = "1", pagesize = "10", datefrom = "", dateto = "", courtid = "", keyword = "";
                courttype = Convert.ToString(Request.Form["itype"]);
                pagenum = Convert.ToString(Request.Form["pagenum"]);
                pagesize = Convert.ToString(Request.Form["pagesize"]);
                datefrom = Convert.ToString(Request.Form["frmdate"]);
                dateto = Convert.ToString(Request.Form["todate"]);
                courtid = Convert.ToString(Request.Form["vcourtId"]);
                keyword = Convert.ToString(Request.Form["ddlKeyword"]);
                var causelistdatefilter = Convert.ToString(Request.Form["causelistdatefilter"]);
                if (datefrom == "")
                {
                    datefrom = DateTime.Now.Date.ToString();
                }
                if (dateto == "")
                {
                    dateto = DateTime.Now.Date.ToString();
                }
                string userId = LoggedInUser.UserId.ToString();
                LawPracticeEntities db = new LawPracticeEntities();
                string strusername = ConfigurationManager.AppSettings["matteridname"] + userId;
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                //For CW Live User Migartion
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
                    userIdDetail = strusername;
                }
                var addfClient = new WebClientConnection();
                object rawfile = new
                {
                    UserId = userIdDetail,
                    Accesstoken = AccessTokenDetail,
                    Courttype = courttype,
                    Pageindex = pagenum,
                    Pagesize = pagesize,
                    Datefrom = datefrom,
                    Dateto = dateto,
                    Courtid = courtid,
                    Keyword = keyword,
                    datetype = causelistdatefilter
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
				addfClient.Encoding = Encoding.UTF8;
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/ViewProActiveAlerts"), "POST", builders);
                JObject jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string status = data.Status;
                    string Message = data.Message;
                    string vdistrict = "";
                    if (Convert.ToString(data.data[i].vDistrictName) != "")
                    {
                        vdistrict = Convert.ToString(data.data[i].vDistrictName);
                    }
                    if (vdistrict != "" || Convert.ToString(data.data[i].Statename) != "")
                    {
                        if (Convert.ToString(data.data[i].Statename) != "" && vdistrict != "")
                        {
                            vdistrict = vdistrict + " (" + Convert.ToString(data.data[i].Statename) + ")";
                        }
                        else if (Convert.ToString(data.data[i].Statename) != "" && string.IsNullOrEmpty(vdistrict))
                        {
                            vdistrict = Convert.ToString(data.data[i].Statename);
                        }
                    }
                    string _filetext = Convert.ToString(data.data[i].Filetext);
                    string CleanedString = Regex.Replace(_filetext, "(<([^>]+)>)", "");
                    string filetext = CleanedString.Replace("- <", "").Replace("<", "").Replace("cdetail>", "").Replace("/cdetail>", "").Replace("cnr>", "").Replace("/cnr> /", "");
                    string filetext_ = filetext.Replace("/\n/", "").Replace("\n", "");
                    filetext = filetext_;
                    // Add parts to the list.
                    keylist.Add(new KeywordCaseList
                    {
                        TotalRecord = data.data[i].TotalRecord,
                        RowId = data.data[i].RowId,
                        iid = data.data[i].iid,
                        uUserguid = data.data[i].uUserguid,
                        vKeyword = data.data[i].vKeyword,
                        itype = data.data[i].itype,
                        appealno = data.data[i].appealno,
                        vCourt = (data.data[i].vCourt == null ? "" : data.data[i].vCourt),
                        //vCourt = data.data[i].vCourt,
                        vDistrict = vdistrict,
                        Filetext = filetext,
                        vCauselistdate = (data.data[i].vCauselistdate == "01 Jan 1900" ? "" : data.data[i].vCauselistdate),
                        vJudge = data.data[i].vJudge,
                        vCourtName = (data.data[i].vCourt == "MHRERA" ? "RERA Maharashtra" : (data.data[i].vCourtName == null ? "" : data.data[i].vCourtName)),//(data.data[i].vCourtName == null ? "" : data.data[i].vCourtName),
                        //vCourtName = data.data[i].vCourtName,
                        Statename = data.data[i].Statename,
                        vDistrictName = data.data[i].vDistrictName,
                        totalSentMail = data.data[i].totalSentMail,
                        isAdded = data.data[i].isAdded,
                        vCompEstbCodeName = (data.data[i].vCompEstbCodeName == null ? "" : data.data[i].vCompEstbCodeName),
                        vDocType = data.data[i].vDocType,
                        vstamp = data.data[i].vstamp,
                        vCNRNo = (data.data[i].vCNRNo == null ? "" : data.data[i].vCNRNo),
                        filingdate = (data.data[i].filingdate == null ? "" : data.data[i].filingdate),
                        AlertReceivedOn = (data.data[i].AlertReceivedOn == null ? "" : data.data[i].AlertReceivedOn)
                    });
                }
            }
            catch (Exception ex)
            {
            }
            return Json(keylist, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
                 /// Add keyword cases
                 /// </summary>
                 /// <param name="keyid"></param>
                 /// <param name="itypeval"></param>
                 /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult AddKeywordCase()
        {
            string cresponse = "", mesg = "";
            var db1 = new LawPracticeEntities();
            try
            {
                var keyid = QueryAES.UrlDecode(Request.Form["iids"]);
                var itypeval = QueryAES.UrlDecode(Request.Form["ittype"]);
                var casename = QueryAES.UrlDecode(Request.Form["casename"]);
                var teammember = QueryAES.UrlDecode(Request.Form["teammember"]);
                var courtname = QueryAES.UrlDecode(Request.Form["courtname"]);
                var othercourtname = QueryAES.UrlDecode(Request.Form["othercourtname"]);
                var caseno = QueryAES.UrlDecode(Request.Form["appealNo"]);
                var isReraCourt = 0;
                if(itypeval=="7")
                {
                    isReraCourt = 1;
                }
                else
                {
                    isReraCourt = 0;
                }

                if (teammember == "null")
                {
                    teammember = "";
                }
                string userId = LoggedInUser.UserId.ToString();
                string firmids = LoggedInUser.FirmId.ToString();
                LawPracticeEntities db = new LawPracticeEntities();
                string strusername = ConfigurationManager.AppSettings["matteridname"] + userId;
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var addfClient = new WebClientConnection();
                //For CW Live User Migartion
                //string AccessTokenDetail = string.Empty;
                //string userIdDetail = string.Empty;
                //string IsCaseWatchUser = LoggedInUser.IsCaseWatchUser.ToString();
                //if (IsCaseWatchUser == "1")
                //{
                //    userIdDetail = LoggedInUser.UserName.ToString();
                //    AccessTokenDetail = "internal";
                //}
                //else
                //{
                //    AccessTokenDetail = "mykase123456789abcdef";
                //    userIdDetail = strusername;
                //}
                //var addfClient = new WebClientConnection();
                //object rawfile = new
                //{
                //    UserId = userIdDetail,
                //    Accesstoken = AccessTokenDetail,
                //    Courttype = itypeval,
                //    keyid = keyid
                //};
                #region for addregistration
                var vdisplayname = "";
                var countryname = "";
                var statename = "";
                var firmadminuserid = "";
                var startdate = "";
                var enddate = "";
                var firmadminusername = "";

                var getuserdetails = db.usp_GetUserDetailByUserID(firmids, userId).FirstOrDefault();
                if (getuserdetails != null)
                {
                    vdisplayname = getuserdetails.Name;
                    countryname = getuserdetails.country;
                    statename = getuserdetails.cstate;
                    firmadminuserid = getuserdetails.FirmAdminuserId;
                    firmadminusername = getuserdetails.FirmAdminUserName.ToString();

                }

                var firmdates = db.usp_wf_GetFirmDetailByID(Guid.Parse(firmids)).FirstOrDefault();
                if (firmdates != null)
                {
                    startdate = Convert.ToDateTime(firmdates.SubscriptionStartDate).Month.ToString("D2") + "/" + Convert.ToDateTime(firmdates.SubscriptionStartDate).Day.ToString("D2") + "/" + Convert.ToDateTime(firmdates.SubscriptionStartDate).Year.ToString();
                    enddate = Convert.ToDateTime(firmdates.ExpiryDate).Month.ToString("D2") + "/" + Convert.ToDateTime(firmdates.ExpiryDate).Day.ToString("D2") + "/" + Convert.ToDateTime(firmdates.ExpiryDate).Year.ToString();

                }

                var IsCWUser = LoggedInUser.IsCaseWatchUser.ToString();
                var CWUserId = LoggedInUser.UserName.ToString();
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
                    if (getuserdetails.IsAdminCW == 1)
                    {
                        userIdDetail = LoggedInUser.UserName.ToString();
                        FirmuserIdDetail = firmadminusername;
                        AccessTokenDetail = "internal";
                    }
                    else
                    {
                        AccessTokenDetail = "mykase123456789abcdef";
                        userIdDetail = WebConfigurationManager.AppSettings["matteridname"] + LoggedInUser.UserId;
                        FirmuserIdDetail = WebConfigurationManager.AppSettings["matteridname"] + firmadminuserid;
                    }

                }
                #endregion
                object rawfile = new
                {
                    Accesstoken = AccessTokenDetail,
                    Email = getuserdetails.EmailId,
                    Memberuserid = userIdDetail,
                    Password = "MykaSe_PasSsword",
                    Mobile = getuserdetails.cmobile,
                    Dispname = vdisplayname,
                    Countryname = countryname,
                    StateName = statename,
                    Subscriptionstart = startdate,
                    Subscriptionend = enddate,
                    userid = userIdDetail,
                    //UserId = strusername,
                    //Accesstoken = "mykase123456789abcdef",
                    Courttype = itypeval,
                    keyid = keyid
                };

                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/AddKeywordCase"), "POST", builders);
                JObject jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                dynamic data = JObject.Parse(resid);
                string status = data.Status;
                string UserCaseids = data.usercaseid;
                var addfClient2 = new WebClientConnection();
                object rawfile1 = new
                {

                    Accesstoken = AccessTokenDetail,
                    caseUniqueId = UserCaseids,
                    Firmid = firmids,
                    Userid = userIdDetail
                };

                addfClient2.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders1 = JsonConvert.SerializeObject(rawfile1);
                addfClient2.UploadString(new Uri(apiUrl + "/API/Search/UpsertCreatedByUserId"), "POST", builders1);
                var UserCaseids1 = "";
                //  cresponse = data.Message;
                //start code for adding matter to mykase
                if (status == "True")
                {
                    try
                    {
                        var countdatas = "";
                        var caseid = "";
                        var clientid = "00000000-0000-0000-0000-000000000000";
                        var auserid = "00000000-0000-0000-0000-000000000000";
                        var countdata = Repository.Matter.SaveShortCase(firmids, userId, null, clientid, casename,
                                  caseno, null, "42", auserid, null, null, "", "", "", DateTime.Now.ToString(), LoggedInUser.RoleId.ToString(), "", teammember, courtname, othercourtname);
                        Guid chkid = Guid.Parse(countdata);
                        caseid = countdata;
                        countdatas = "1";
                        int pageid = 0;
                        //Map Mk case to CW Case
                        var cts = db.usp_savetblUserCasesMapCaseStatusMaster(firmids, Convert.ToInt32(UserCaseids), caseid, userId, 0, isReraCourt);
                        //Case Assign to MK and CW.
                        List<usp_UserlistbycaseIdForAlerts_Result> list = new List<usp_UserlistbycaseIdForAlerts_Result>();
                        list = db.usp_UserlistbycaseIdForAlerts(firmids, userId, caseid).ToList();
                        if (list.Count > 0)
                        {
                            string auserids = string.Join(",", list.Select(x => x.auser));
                            AddCaseCaseWatch.SaveCaseAlertUser_update(auserids, userId, firmids, apiUrl, UserCaseids,LoggedInUser.IsCaseWatchUser,LoggedInUser.UserName.ToString());
                        }

                        var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("caselist")).FirstOrDefault();
                        if (pagelist != null)
                        {
                            pageid = Convert.ToInt32(pagelist.ParentPage);
                        }

                        string id = "";
                        var checkroles = db.usp_GetUserbyId(firmids, auserid).FirstOrDefault();
                        if (checkroles != null)
                        {
                            if (checkroles.roleid != 1)
                            {
                                var roweffected2 = db.usp_SaveUserDefaultCaseRights(firmids, userId, auserid, caseid, pageid);
                                //for partner
                                if (!String.IsNullOrEmpty(checkroles.PartnerId))
                                {
                                    var roweffected4 = db.usp_SaveUserDefaultCaseRights(firmids, userId, checkroles.PartnerId, caseid, pageid);
                                }
                            }
                        }
                        if (LoggedInUser.RoleId != 1)
                        {
                            //for creator
                            var checkroles1 = db.usp_GetUserbyId(firmids, userId).FirstOrDefault();
                            if (checkroles1 != null)
                            {

                                var roweffected2 = db.usp_SaveUserDefaultCaseRights(firmids, userId, userId, caseid, pageid);
                                //for partner
                                if (!String.IsNullOrEmpty(checkroles1.PartnerId))
                                {
                                    var roweffected4 = db.usp_SaveUserDefaultCaseRights(firmids, userId, checkroles1.PartnerId, caseid, pageid);

                                }
                            }
                        }
                        try
                        {
                            int pageids = 0;


                            var pagelists = db.usp_GetDocRightsPageDatabyPagelink(Convert.ToString("Case Documents")).FirstOrDefault();
                            if (pagelists != null)
                            {
                                pageids = Convert.ToInt32(pagelists.Id);
                            }
                            var checkroless = db.usp_GetUserbyId(firmids, auserid).FirstOrDefault();
                            if (checkroless != null)
                            {
                                if (checkroless.roleid != 1)
                                {
                                    var roweffected2 = db.usp_SaveUserDefaultCaseRights(firmids, userId, auserid, caseid, pageids);
                                    //for partner
                                    if (!String.IsNullOrEmpty(checkroless.PartnerId))
                                    {
                                        var roweffected4 = db.usp_SaveUserDefaultCaseRights(firmids, userId, checkroless.PartnerId, caseid, pageids);

                                    }
                                }
                            }
                            if (LoggedInUser.RoleId != 1)
                            {
                                //for creator
                                var checkroles1 = db.usp_GetUserbyId(firmids, userId).FirstOrDefault();
                                if (checkroles1 != null)
                                {

                                    var roweffected2 = db.usp_SaveUserDefaultCaseRights(firmids, userId, userId, caseid, pageid);
                                    //for partner
                                    if (!String.IsNullOrEmpty(checkroles1.PartnerId))
                                    {
                                        var roweffected4 = db.usp_SaveUserDefaultCaseRights(firmids, userId, checkroles1.PartnerId, caseid, pageid);
                                    }
                                }
                            }

                            //for Creating the folder strcture
                            if (countdatas.ToString() == "1")
                            {
                                var newcasefolderid = "";
                                var dpaths = "";
                                int maxFileSize = Convert.ToInt32(WebConfigurationManager.AppSettings["docelasticmaxFileSize"]);

                                var ids = "";
                                var directoryid = "00000000-0000-0000-0000-000000000000";

                                var checkexistcasefolder = db1.usp_checkcasefolderid(LoggedInUser.FirmId.ToString(), caseid).FirstOrDefault();
                                if (checkexistcasefolder != null)
                                {
                                    newcasefolderid = checkexistcasefolder.Id.ToString();
                                    dpaths = "WorkSpace/" + LoggedInUser.FirmId + "/" + caseid;

                                }
                                else
                                {
                                    var dname = db1.usp_getcasename(LoggedInUser.FirmId.ToString(), caseid).FirstOrDefault();
                                    if (dname == null)
                                    {
                                        dname = "DefaultCase";
                                    }
                                    dpaths = "WorkSpace/" + LoggedInUser.FirmId + "/" + caseid;
                                    AzureDocument.creatroot(LoggedInUser.FirmId.ToString(), caseid);
                                    var createdirectorydata = AzureDocument.createfolder(dpaths, null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                                    ObjectParameter IDParameter;
                                    IDParameter = new ObjectParameter("id", ids);
                                    var data11 = db1.usp_SaveFilefolderCloudNew(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), dname.TrimStart().TrimEnd(), dpaths, 0, directoryid.ToString(), null, null, null, IDParameter, caseid, null, 0, "1", null, null);
                                    newcasefolderid = Convert.ToString(IDParameter.Value);
                                }
                            }
                        }
                        catch
                        {

                        }
                        cresponse = "sucess";

                    }
                    catch (Exception ex)
                    {
                        cresponse = "";
                    }
                    cresponse = "sucess";
                }
                else if (status == "False")
                {
                    cresponse = data.Message;

                }
                else { }
            }
            catch
            {
                cresponse = "";
            }
            return Json(cresponse, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Export Pro-Active Case  list details in excel
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void ExportToExcelProActiveCaseListDetails()
        {
            List<KeywordCaseList> keylist = new List<KeywordCaseList>();
            try
            {
                string exlfilename = "ProActiveCaseDetails_" + DateTime.Now;
                var courttype = Convert.ToString(Request.QueryString["itype"]);
                var  pagenum = Convert.ToString(Request.QueryString["pagenum"]);
                var  pagesize = Convert.ToString(Request.QueryString["pagesize"]);
                var  datefrom = Convert.ToString(Request.QueryString["frmdate"]);
                var  dateto = Convert.ToString(Request.QueryString["todate"]);
                var  courtid1 = Convert.ToString(Request.QueryString["vcourtId"]);
                var keyword1 = Convert.ToString(Request.QueryString["ddlKeyword"]);
                var causelistdatefilter = Convert.ToString(Request.QueryString["causelistdatefilter"]);
                var keyword = "";var courtid = "";
                if (datefrom == "")
                {
                    datefrom = DateTime.Now.Date.ToString();
                }
                if (dateto == "")
                {
                    dateto = DateTime.Now.Date.ToString();
                }
                if (keyword1 != "")
                {
                    keyword = keyword1.Replace("%20", " ");
                }
                if (courtid1 != "")
                {
                    courtid = courtid1.Replace("%20", " ");
                }
                string userId = LoggedInUser.UserId.ToString();
                LawPracticeEntities db = new LawPracticeEntities();
                string strusername = ConfigurationManager.AppSettings["matteridname"] + userId;
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                //For CW Live User Migartion
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
                    userIdDetail = strusername;
                }
                var addfClient = new WebClientConnection();
                object rawfile = new
                {
                    UserId = userIdDetail,
                    Accesstoken = AccessTokenDetail,
                    Courttype = courttype,
                    Pageindex = pagenum,
                    Pagesize = pagesize,
                    Datefrom = datefrom,
                    Dateto = dateto,
                    Courtid = courtid,
                    Keyword = keyword,
                    datetype = causelistdatefilter
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                addfClient.Encoding = Encoding.UTF8;
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/ViewProActiveAlerts"), "POST", builders);
                JObject jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(resid);
                    string status = data.Status;
                    string Message = data.Message;
                    string vdistrict = "";
                    if (Convert.ToString(data.data[i].vDistrictName) != "")
                    {
                        vdistrict = Convert.ToString(data.data[i].vDistrictName);
                    }
                    if (vdistrict != "")
                    {
                        if (Convert.ToString(data.data[i].Statename) != "")
                        {
                            vdistrict = vdistrict + " (" + Convert.ToString(data.data[i].Statename) + ")";
                        }
                    }
                    string _filetext = Convert.ToString(data.data[i].Filetext);
                    string CleanedString = Regex.Replace(_filetext, "(<([^>]+)>)", "");
                    string filetext = CleanedString.Replace("- <", "").Replace("<", "").Replace("cdetail>", "").Replace("/cdetail>", "").Replace("cnr>", "").Replace("/cnr> /", "");
                    string filetext_ = filetext.Replace("/\n/", "").Replace("\n", "");
                    filetext = filetext_;
                    // Add parts to the list.
                    keylist.Add(new KeywordCaseList
                    {
                        TotalRecord = data.data[i].TotalRecord,
                        RowId = data.data[i].RowId,
                        iid = data.data[i].iid,
                        uUserguid = data.data[i].uUserguid,
                        vKeyword = data.data[i].vKeyword,
                        itype = data.data[i].itype,
                        appealno = data.data[i].appealno,
                        vCourt = data.data[i].vCourt,
                        vDistrict = vdistrict,
                        Filetext = filetext,
                        vCauselistdate = (data.data[i].vCauselistdate == "01 Jan 1900" ? "" : data.data[i].vCauselistdate),
                        vJudge = data.data[i].vJudge,
                        vCourtName = data.data[i].vCourtName,
                        Statename = data.data[i].Statename,
                        vDistrictName = data.data[i].vDistrictName,
                        totalSentMail = data.data[i].totalSentMail,
                        isAdded = data.data[i].isAdded,
                        vCompEstbCodeName = data.data[i].vCompEstbCodeName,
                        vDocType = data.data[i].vDocType,
                        vstamp = data.data[i].vstamp,
                        vCNRNo = (data.data[i].vCNRNo == null ? "" : data.data[i].vCNRNo),
                        filingdate = (data.data[i].filingdate == null ? "" : data.data[i].filingdate),
                        AlertReceivedOn = (data.data[i].AlertReceivedOn == null ? "" : data.data[i].AlertReceivedOn)

                    });  
                }
                var trialList = (from ob in keylist
                                 select new
                                 {
                                     SNo = ob.RowId,
                                     HearingDate = ob.vCauselistdate,
                                     Keyword_Party_Name = ob.vKeyword,
                                     AppealNo = removeSpecialCharacter(ob.appealno),
                                     CourtName = removeSpecialCharacter(ob.vCourtName),
                                     District = ob.vDistrict,
                                     CourtEstablishment=ob.vCompEstbCodeName,
                                     SearchResult = removeSpecialCharacter(ob.Filetext),
                                     JudgeName = (ob.vJudge == null || ob.vJudge == "") ? "" : Regex.Replace(ob.vJudge, "<.*?>", string.Empty),
                                     vCNRNo= ob.vCNRNo,
                                     Filingdate= ob.filingdate,
                                     AlertReceivedOn = ob.AlertReceivedOn,
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
                Response.Charset = "utf-8";
                Response.ContentEncoding = System.Text.Encoding.UTF8;
                Response.HeaderEncoding = System.Text.Encoding.UTF8;
                Response.BinaryWrite(System.Text.Encoding.UTF8.GetPreamble());
                StringWriter objStringWriter = new StringWriter();
                HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);
                gv.RenderControl(objHtmlTextWriter);
                Response.Output.Write(objStringWriter.ToString());
                Response.Flush();
                Response.End();
            }
            catch (Exception){}   
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
            }
            return noHTML;
        }
    }
}