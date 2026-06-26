using BussinessLogic;
using DataAccess.Modals;
using LawPracticeFirm.Common;
using LawPracticeFirm.DAL;
using LawPracticeFirm.Models;
using Microsoft.Azure.Storage;
using Microsoft.Azure.Storage.Auth;
using Microsoft.Azure.Storage.File;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NJDGDetail.Models;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Entity.Core.Objects;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Runtime.Caching;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Configuration;
using System.Web.Http;
using static LawPracticeFirm.Models.AuditData;

namespace LawPracticeFirm.API
{
    public class MatterApiController : BaseFirmApiController
    {
        public MatterApiController()
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
        }
        private LawPracticeEntities db1 = new LawPracticeEntities();
        public string controllername = "MatterApiController";

        /// <summary>
        /// Load contact details
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ContactMatter([FromBody] JObject paramJObject)
        {
            try
            {
                var cmatter = Repository.Matter.contactlist(LoggedInUser.FirmId.ToString());
                var param = controllername + ">ContactMatter>contactlist>param=" + LoggedInUser.FirmId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(cmatter);
            }

            
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Load assign user details
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult Assignuser([FromBody] JObject paramJObject)
        {
            try
            {
                var cmatter = Repository.Matter.assignuserlist(LoggedInUser.FirmId.ToString());
                var param = controllername + ">Assignuser>assignuserlist>param=" + LoggedInUser.FirmId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.User), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.User), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(cmatter);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.User), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.User), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Load user for assign teamlead
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult Assignuserteamlead([FromBody] JObject paramJObject)
        {
            try
            {
                var db = new LawPracticeEntities();
                var matter = db.usp_GetTeamleadercasemember(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).OrderBy(x => x.UserName).ToList();
                var cmatter = JsonConvert.SerializeObject(matter);
                var param = controllername + ">Assignuserteamlead>param=" + LoggedInUser.FirmId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.User), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.User), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(cmatter);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.User), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.User), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
        /// <summary>
        /// Assign Report Manager
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult AssignReportManager([FromBody] JObject paramJObject)
        {
            try
            {
                var db = new LawPracticeEntities();
                var matter = db.usp_GetReportManager(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).OrderBy(x => x.UserName).ToList();
                var cmatter = JsonConvert.SerializeObject(matter);
                var param = controllername + ">Assignuserteamlead>param=" + LoggedInUser.FirmId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.User), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.User), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(cmatter);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.User), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.User), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Load all assign user
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult AllAssignuser([FromBody] JObject paramJObject)
        {
            try
            {
                var usertype = "";
                var userid = "";
                try
                {
                    usertype = HttpContext.Current.Request.Headers["usertype"];
                }
                catch
                {
                    usertype = "";
                }
                try
                {
                    userid = HttpContext.Current.Request.Headers["userid"];
                }
                catch
                {
                    userid = "";
                }
                var cmatter = Repository.Matter.allassignuserlist(LoggedInUser.FirmId.ToString(), usertype, userid);
                var param = controllername + ">Assignuser>assignuserlist>param=" + LoggedInUser.FirmId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.User), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.User), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(cmatter);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.User), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.User), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
        /// <summary>
        /// Generate random number
        /// </summary>
        /// <returns></returns>
        public string randomno()
        {
            string alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            string small_alphabets = "abcdefghijklmnopqrstuvwxyz";
            string numbers = "1234567890";
            string characters = alphabets + small_alphabets + numbers;
            int length = 10;
            string otp = string.Empty;
            for (int i = 0; i < length; i++)
            {
                string character = string.Empty;
                do
                {
                    int index = new Random().Next(0, characters.Length);
                    character = characters.ToCharArray()[index].ToString();
                } while (otp.IndexOf(character) != -1);
                otp += character;
            }
            return otp;
        }

        /// <summary>
        /// Load all event
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadEvent([FromBody] JObject paramJObject)
        {
            try
            {
                var events = Repository.Matter.eventlist(LoggedInUser.FirmId);
                var param = controllername + ">LoadEvent>eventlist>param=" + LoggedInUser.FirmId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(events);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Load all task details
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadTask([FromBody] JObject paramJObject)
        {
            try
            {
                var events = Repository.Matter.tasklist(LoggedInUser.FirmId);
                var param = controllername + ">LoadTask>eventlist>param=" + LoggedInUser.FirmId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(events);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Remove field in matter
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveField()
        {
            try
            {
                var db = new LawPracticeEntities();
                var ftype = Request.Headers.GetValues("configurationtype").FirstOrDefault();
                var ctype = Convert.ToInt32(ftype);
                var fid = Request.Headers.GetValues("fid").FirstOrDefault();
                Repository.Matter.matterremovefield(LoggedInUser.FirmId.ToString(), ctype.ToString(), fid.ToString());
                var param = controllername + ">RemoveField>matterremovefield>param=" + LoggedInUser.FirmId + "@" + ctype + "@" + fid;
                db1.usp_AddAudit(Convert.ToInt32(EventType.CustomField), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.CustomField), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok();
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.CustomField), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.CustomField), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Get matter details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SpMatterData()
        {
            try
            {
                var search = QueryAES.UrlDecode(HttpContext.Current.Request.Form["search"]);
                int pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                int pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                LawPracticeEntities db = new LawPracticeEntities();
                if (search != "")
                {
                    var cases1 = Repository.Matter.findmatterlist(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), pagenum, pagesize, search);
                    return Ok(cases1);
                }
                else
                {
                    var cases1 = Repository.Matter.matterlist(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), pagenum, pagesize);
                    var param = controllername + ">SpMatterData>matterlist>param=" + LoggedInUser.FirmId;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                    return Ok(cases1);
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// get colmaps data
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SpColMaps1()
        {
            try
            {
                var fid = Request.Headers.GetValues("fid").FirstOrDefault();
                if (fid != null)
                {
                    var cid = Convert.ToInt32(fid);
                    var cases = Repository.Matter.spcolmap1(LoggedInUser.FirmId.ToString(), cid.ToString());
                    return Ok(cases);
                }
                return Ok();
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Remove matter details
        /// </summary>
        /// <param name="typeIds"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveMatter(string[] typeIds)
        {
            try
            {
                string dburl = ConfigurationManager.ConnectionStrings["db_checksome"].ToString();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                if (LoggedInUser.RoleId == 1)
                {
                    var countmatter = Repository.Matter.removematterlist(typeIds, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), dburl, apiUrl);
                    var param = controllername + ">RemoveMatter>removematterlist>param=" + typeIds + "@" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString();
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                    db1.saveuseractivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.UserId.ToString(), 1, DateTime.Now.ToString(), "delmatter", Guid.Empty.ToString(), null, null, DateTime.Now.ToString());
                    return Ok(countmatter);
                }
                else
                {
                    return Ok();
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Reset custom field
        /// </summary>
        /// <param name="fm"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ResetCF(FirmConfiguredCustomField fm)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var ftype = Request.Headers.GetValues("configurationtype").FirstOrDefault();
                var ctype = Convert.ToInt32(ftype);
                var db = new LawPracticeEntities();
                var result = db.Usp_ResetCustomFieldData(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), ctype);
                var param = controllername + ">MatterApi>ResetCF>param=" + ctype + "@" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.CustomField), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.CustomField), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok();
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.CustomField), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.CustomField), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Short Save Case
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ShortSaveCase()
        {
            var myList = new List<string>();
            dynamic postedFiledata = "";
            var db = new LawPracticeEntities();
            try
            {
                var usertypes = QueryAES.UrlDecode(HttpContext.Current.Request.Form["usertypes"]);
                var clientid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["clientname"]);
                var casename1 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casename"]);
                var casename = "";
                if (casename1 != "")
                {
                    casename = casename1.Replace("&amp;", "&");
                }
                var caseno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseno"]);
                var clientcontact = QueryAES.UrlDecode(HttpContext.Current.Request.Form["clientcontacts"]);
                var casetype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casecasetype"]);
                var auserid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["teamlead"]);
                var details = QueryAES.UrlDecode(HttpContext.Current.Request.Form["details"]);
                var username = QueryAES.UrlDecode(HttpContext.Current.Request.Form["userid"]);
                var confirmPassword = QueryAES.UrlDecode(HttpContext.Current.Request.Form["confirmPassword"]);
                var checkclient = QueryAES.UrlDecode(HttpContext.Current.Request.Form["checkclient"]);
                var odate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["odate"]);
                if (odate == "undefined" || odate == "" || odate == null)
                {
                    odate = DateTime.Now.ToString();
                }
                var assignuser = QueryAES.UrlDecode(HttpContext.Current.Request.Form["assignuser"]);
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var newcompanyid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["newcompanyid"]);
                var files = "";
                if (clientid == "")
                {
                    clientid = "00000000-0000-0000-0000-000000000000";
                }
                if (auserid == "")
                {
                    auserid = "00000000-0000-0000-0000-000000000000";
                }
                if (assignuser == null || assignuser == "null")
                {
                    assignuser = LoggedInUser.UserId.ToString();
                }
                else
                {
                    assignuser = assignuser;
                }
                if (clientcontact == "undefined" || clientcontact == "")
                {
                    clientcontact = null;
                }
                //validate casename exist
                var chkcase = db.usp_checkcasenameexist(LoggedInUser.FirmId.ToString(), casename.TrimEnd().TrimStart(), null, LoggedInUser.UserId.ToString()).FirstOrDefault();
                if (chkcase == 1)
                {
                    return Ok("Already exist matter name. please try another matter name");
                }
                if (!String.IsNullOrEmpty(username))
                {
                    //check userid if exist
                    var checkuser = db.ValidateUserName(username).FirstOrDefault();
                    if (checkuser != null)
                    {
                        return Ok("Already Exists User Please Try Another User Name!");
                    }
                }
                var companyIds = "";
                // get teamlead data for create client
                if (usertypes == "company")
                {
                    if (checkclient == "1")
                    {
                        try
                        {
                            //get company id
                            var getusersdata = db.usp_wf_GetClientDetails(Guid.Parse(firmid), Guid.Parse(clientid)).FirstOrDefault();
                            companyIds = getusersdata.CompanyId.ToString();
                        }
                        catch
                        {
                            companyIds = Guid.Empty.ToString();
                        }
                    }
                    else
                    {
                        try
                        {
                            if (clientcontact == null && clientid != "00000000-0000-0000-0000-000000000000")
                            {
                                companyIds = newcompanyid;
                            }
                            else
                            {
                                var getusersdata = db.usp_SingleContactsDetails(firmid, userid, null, clientcontact).FirstOrDefault();
                                companyIds = getusersdata.CompanyId;
                            }
                        }
                        catch
                        {
                            companyIds = Guid.Empty.ToString();
                        }
                    }
                }
                //upload files in azure server
                var httpRequest = HttpContext.Current.Request;
                files = postedFiledata;
                var countdatas = "";
                var caseid = "";
                var countdata = Repository.Matter.SaveShortCase(firmid, userid, usertypes, clientid, casename, caseno, clientcontact, casetype, auserid, details, username, confirmPassword, checkclient, files, odate, LoggedInUser.RoleId.ToString(), companyIds, assignuser, null, null);
                //insert in rights
                try
                {
                    Guid chkid = Guid.Parse(countdata);
                    caseid = countdata;
                    countdatas = "1";
                    try
                    {
                        //BridgeStone insert unique case id on the behalf on mastercaseid
                        string BridgeStoneModulePermission = System.Configuration.ConfigurationManager.AppSettings["BridgeStoneModulePermission"];
                        if (!string.IsNullOrEmpty(Convert.ToString(caseid)) && string.Equals(firmid, BridgeStoneModulePermission, StringComparison.OrdinalIgnoreCase))
                        {
                            var status = DataAccessADO.SaveBridgeStoneOtherMatterDetails(Convert.ToString(caseid));
                        }
                        int pageid = 0;
                        var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("caselist")).FirstOrDefault();
                        if (pagelist != null)
                        {
                            pageid = Convert.ToInt32(pagelist.ParentPage);
                        }
                        string id = "";
                        ObjectParameter IDParameter;
                        IDParameter = new ObjectParameter("iid", id);
                        var checkroles = db.usp_GetUserbyId(firmid, auserid).FirstOrDefault();
                        if (checkroles != null)
                        {
                            if (checkroles.roleid != 1)
                            {
                                var roweffected2 = db.usp_SaveUserDefaultCaseRights(firmid, userid, auserid, caseid, pageid);
                                //for partner
                                if (!String.IsNullOrEmpty(checkroles.PartnerId))
                                {
                                    var roweffected4 = db.usp_SaveUserDefaultCaseRights(firmid, userid, checkroles.PartnerId, caseid, pageid);
                                }
                            }
                        }
                        if (LoggedInUser.RoleId != 1)
                        {
                            //for creator
                            var checkroles1 = db.usp_GetUserbyId(firmid, userid).FirstOrDefault();
                            if (checkroles1 != null)
                            {
                                var roweffected2 = db.usp_SaveUserDefaultCaseRights(firmid, userid, userid, caseid, pageid);
                                //for partner
                                if (!String.IsNullOrEmpty(checkroles1.PartnerId))
                                {
                                    var roweffected4 = db.usp_SaveUserDefaultCaseRights(firmid, userid, checkroles1.PartnerId, caseid, pageid);
                                }
                            }
                        }
                    }
                    catch
                    {
                    }
                    try
                    {
                        int pageid = 0;
                        var pagelist = db.usp_GetDocRightsPageDatabyPagelink(Convert.ToString("Case Documents")).FirstOrDefault();
                        if (pagelist != null)
                        {
                            pageid = Convert.ToInt32(pagelist.Id);
                        }
                        string id = "";
                        ObjectParameter IDParameter;
                        IDParameter = new ObjectParameter("iid", id);
                        //for assign user
                        var checkroles = db.usp_GetUserbyId(firmid, auserid).FirstOrDefault();
                        if (checkroles != null)
                        {
                            if (checkroles.roleid != 1)
                            {
                                var roweffected2 = db.usp_SaveUserDefaultCaseRights(firmid, userid, auserid, caseid, pageid);
                                //for partner
                                if (!String.IsNullOrEmpty(checkroles.PartnerId))
                                {
                                    var roweffected4 = db.usp_SaveUserDefaultCaseRights(firmid, userid, checkroles.PartnerId, caseid, pageid);
                                }
                            }
                        }
                        if (LoggedInUser.RoleId != 1)
                        {
                            //for creator
                            var checkroles1 = db.usp_GetUserbyId(firmid, userid).FirstOrDefault();
                            if (checkroles1 != null)
                            {
                                var roweffected2 = db.usp_SaveUserDefaultCaseRights(firmid, userid, userid, caseid, pageid);
                                //for partner
                                if (!String.IsNullOrEmpty(checkroles1.PartnerId))
                                {
                                    var roweffected4 = db.usp_SaveUserDefaultCaseRights(firmid, userid, checkroles1.PartnerId, caseid, pageid);
                                }
                            }
                        }
                    }
                    catch
                    {
                    }
                }
                catch
                {
                    countdatas = countdata;
                }
                if (countdatas.ToString() == "1")
                {
                    var newcasefolderid = "";
                    var dpaths = "";
                    int maxFileSize = Convert.ToInt32(WebConfigurationManager.AppSettings["docelasticmaxFileSize"]);
                    var id = "";
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
                        IDParameter = new ObjectParameter("id", id);
                        var data = db1.usp_SaveFilefolderCloudNew(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), dname.TrimStart().TrimEnd(), dpaths, 0, directoryid.ToString(), null, null, null, IDParameter, caseid, null, 0, "1", null, null);
                        newcasefolderid = Convert.ToString(IDParameter.Value);
                    }
                    var dpath = dpaths.TrimEnd('/');
                    try
                    {
                        if (httpRequest.Files.Count > 0)
                        {
                            if (Convert.ToInt32(countdatas) == 1)
                            {
                                //update docs in document mgmt
                                if (!String.IsNullOrEmpty(countdata))
                                {
                                    var newfilename = "";
                                    var newfilenames = "";
                                    string AzureStorageName = WebConfigurationManager.AppSettings["AzureStorageName"];
                                    string AzureStorageKey = WebConfigurationManager.AppSettings["AzureStorageKey"];
                                    string azureroot = "mykase";
                                    string azuredir = "WorkSpace";
                                    string fakepathin = "azuredirin/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                                    string fakepathout = "azuredirout/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                                    //var dpath = Request.Form["hiddenpath"];
                                    var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
                                    var account = new CloudStorageAccount(cred, true);
                                    var client = account.CreateCloudFileClient();
                                    if (httpRequest.Files.Count > 0)
                                    {
                                        var docfiles = new List<string>();
                                        //Check whether Directory (Folder) exists.
                                        for (int i = 0; i < httpRequest.Files.Count; i++)
                                        {
                                            var postedFile = httpRequest.Files[i];
                                            //encrypt file
                                            string input = HttpContext.Current.Server.MapPath("~/" + fakepathin);
                                            if (!(Directory.Exists(input)))
                                            {
                                                Directory.CreateDirectory(input);
                                            }
                                            if (!(Directory.Exists(HttpContext.Current.Server.MapPath("~/" + fakepathout))))
                                            {
                                                Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/" + fakepathout));
                                            }
                                            var fileextchk = Path.GetExtension(postedFile.FileName);
                                            var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);
                                            postedFile.SaveAs(input + "\\" + postedFile.FileName);
                                            //for start elastic
                                            string strfilepath = input + "\\" + postedFile.FileName;
                                            int fileSize = postedFile.ContentLength;
                                            var directory = Path.GetDirectoryName(strfilepath);
                                            string strfileName = Path.GetFileName(strfilepath);
                                            string mimeType = MimeMapping.GetMimeMapping(strfileName);
                                            var base64File = Convert.ToBase64String(System.IO.File.ReadAllBytes(Path.Combine(directory, strfileName)));
                                            //end elastic
                                            input = input + "\\" + postedFile.FileName;
                                            string output = HttpContext.Current.Server.MapPath("~/" + fakepathout + "/" + postedFile.FileName);
                                            QueryAES.FileEncrypt(input, output);
                                            //delete file
                                            try
                                            {
                                                System.IO.File.Delete(input);
                                            }
                                            catch (Exception ex)
                                            {
                                            }
                                            //rename file exist
                                            int it = 0;
                                            var fileName = postedFile.FileName;
                                            var origininalfilename = fileName;
                                            var orfileNameOnly = fileName.Remove(fileName.LastIndexOf('.') + 1).TrimEnd('.');
                                            var extension = fileName.Split('.').Last();
                                            while (AzureDocument.fileexist(dpath, origininalfilename, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()))
                                            {
                                                it += 1;
                                                origininalfilename = string.Format("{0}({1}).{2}", orfileNameOnly, it, extension);
                                            }
                                            CloudStorageAccount storageAccount = new CloudStorageAccount(cred, true);
                                            // Create a reference to the file client.
                                            CloudFileClient fileClient = storageAccount.CreateCloudFileClient();
                                            var share = client.GetShareReference(azureroot);
                                            // Create a reference to the Azure path
                                            var cloudFileDirectory = share.GetRootDirectoryReference().GetDirectoryReference(dpath);
                                            cloudFileDirectory.CreateIfNotExists();
                                            //Create a reference to the filename that you will be uploading
                                            CloudFile cloudFile = cloudFileDirectory.GetFileReference(origininalfilename);
                                            var fileext = Path.GetExtension(origininalfilename);
                                            //Open a stream from a local file.
                                            //Upload the file to Azure.
                                            if (cloudFile.Exists())
                                            {
                                                return Ok("exist");
                                            }
                                            else
                                            {
                                                cloudFile.UploadFromFile(output);
                                            }
                                            try
                                            {
                                                System.IO.File.Delete(output);
                                            }
                                            catch (Exception ex)
                                            {
                                            }
                                            ObjectParameter IDParameter1;
                                            IDParameter1 = new ObjectParameter("id", id);
                                            var data1 = db1.usp_SaveFilefolderCloudNew(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), origininalfilename, dpath, 1, newcasefolderid.ToString(), null, fileext, null, IDParameter1, null, null, 0, "1", null, null);
                                            id = Convert.ToString(IDParameter1.Value);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    catch
                    {
                    }
                }
                var param = controllername + ">ShortSaveCase>SaveShortCase>param=" + firmid + "@" + userid + "@" + usertypes + "@" + clientid + "@" + casename + "@" + caseno + "@" + clientcontact + "@" + casetype + "@" + auserid + "@" + details + "@" + auserid + "@" + confirmPassword + "@" + checkclient;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(countdatas);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Full Screen Save Case
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult FullScreenSaveCase()
        {
            var myList = new List<string>();
            dynamic postedFiledata = "";
            var db = new LawPracticeEntities();
            try
            {   //Pmrda customisation start var field
                var compdep = "";
                var compadVocateName = "";
                try
                {
                    compdep = QueryAES.UrlDecode(HttpContext.Current.Request.Form["compdep"]);
                    compadVocateName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["compadVocateName"]);
                }
                catch
                {

                }

                //Pmrda customisation end
                var usertypes = QueryAES.UrlDecode(HttpContext.Current.Request.Form["usertypes"]);
                var clientid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["clientname"]);
                var casename1 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casename"]);
                var casename = "";
                if (casename1 != "")
                {
                    casename = casename1.Replace("&amp;", "&");
                }


                var casetype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fcasecasetype"]);
                var caseclientcontact = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fcaseclientcontact"]);
                var casedetails = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fcasedetails"]);
                var casenotes = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fcasenotes"]);
                var court = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fcourt"]);
                var othercourt = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fothercourt"]);
                var casestatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fcasestatus"]);
                var fdisposedoption = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fdisposedoption"]);
                var caseodate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fcaseodate"]);
                var casenumber = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fcasenumber"]);
                var casecdate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fcasecdate"]);
                var caseteamlead = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fcaseteamlead"]);
                var casecnr = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fcasecnr"]);
                var username = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fcasesideuserid"]);
                var casesidepassword = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fcasesidepassword"]);
                var clientto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["clientto"]);
                var assignto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["assignto"]);
                var checkclient = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fcheckclient"]);
                var sollist = QueryAES.UrlDecode(HttpContext.Current.Request.Form["itemlistdata"]);
                var clientno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["clientno"]);
                string MatterType, PoliceStation, Firno, CertifiedCopyAppliedon, CertifiedCopyReceivedon, ValuationofSuit, Courtfee;
                string OppositePartyCounselname, OppositePartyCounselemail, OppositePartyCounselphone, CasenumberInternal;
                string IsCourtFeePaid, SubjectType;
                string fmatterType, txtMatterOther, DisputeMatterType, fcompanystructure;
                fmatterType = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fmatterType"]);
                txtMatterOther = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtMatterOther"]);
                DisputeMatterType = QueryAES.UrlDecode(HttpContext.Current.Request.Form["DisputeMatterType"]);
                fcompanystructure = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fcompanystructure"]);
                string NoticeId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["NoticeId"]);
                var NotesCasedetail = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casedetails"]).ToString();
                //validate casename exist
                var chkcase = db.usp_checkcasenameexist(LoggedInUser.FirmId.ToString(), casename.TrimEnd().TrimStart(), null, LoggedInUser.UserId.ToString()).FirstOrDefault();
                if (chkcase == 1)
                {
                    return Ok("Already exist matter name. please try another matter name");
                }
                // get teamlead data for create client
                if (usertypes == "company")
                {
                    if (checkclient == "1")
                    {
                        try
                        {
                            //get company id
                            var getusersdata = db.usp_wf_GetClientDetails(LoggedInUser.FirmId, Guid.Parse(clientid)).FirstOrDefault();
                            if (getusersdata != null)
                            {
                                fcompanystructure = getusersdata.CompanyId.ToString();
                            }
                        }
                        catch
                        {
                        }
                    }
                    else
                    {
                        try
                        {
                            var getusersdata = db.usp_SingleContactsDetails(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), null, fcompanystructure).FirstOrDefault();
                            if (getusersdata != null)
                            {
                                fcompanystructure = getusersdata.CompanyId;
                            }
                        }
                        catch
                        {
                        }
                    }
                }
                MatterType = QueryAES.UrlDecode(HttpContext.Current.Request.Form["MatterType"]);
                PoliceStation = QueryAES.UrlDecode(HttpContext.Current.Request.Form["PoliceStation"]);
                Firno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Firno"]);
                CertifiedCopyAppliedon = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CertifiedCopyAppliedon"]);
                CertifiedCopyReceivedon = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CertifiedCopyReceivedon"]);
                ValuationofSuit = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ValuationofSuit"]);
                Courtfee = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Courtfee"]);
                OppositePartyCounselname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["OppositePartyCounselname"]);
                OppositePartyCounselemail = QueryAES.UrlDecode(HttpContext.Current.Request.Form["OppositePartyCounselemail"]);
                OppositePartyCounselphone = QueryAES.UrlDecode(HttpContext.Current.Request.Form["OppositePartyCounselphone"]);
                CasenumberInternal = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CasenumberInternal"]);
                IsCourtFeePaid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["IsCourtFeePaid"]);
                SubjectType = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SubjectType"]);
                //extra party information
                var firstfilingdate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casefilingcdate"]);
                DateTime casefilingcdate = Convert.ToDateTime("1900-01-01");
                if (!string.IsNullOrEmpty(firstfilingdate))
                {
                    casefilingcdate = Convert.ToDateTime(firstfilingdate);
                }
                DateTime submitDate = DateTime.Now;// Convert.ToDateTime(QueryAES.UrlDecode(HttpContext.Current.Request.Form["submitDate"]);
                DateTime returnDate = DateTime.Now;// Convert.ToDateTime(QueryAES.UrlDecode(HttpContext.Current.Request.Form["returnDate"]);
                var ePartyName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ePartyName"]);
                var ePartyFatherName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ePartyFatherName"]);
                var ePartyAddress = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ePartyAddress"]);
                var ePartyAdharCardNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ePartyAdharCardNo"]);
                var ePartyGender = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ePartyGender"]);
                var ePartyDateOfBirth = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ePartyDateOfBirth"]);
                var ePartyEmail = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ePartyEmail"]);
                var ePartyNationality = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ePartyNationality"]);
                var ePartyMobileNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ePartyMobileNo"]);
                int ftype = Convert.ToInt32(Request.Headers.GetValues("ftype").FirstOrDefault());
                int sum = Convert.ToInt32(Request.Headers.GetValues("sum").FirstOrDefault());
                var ctxt1 = Convert.ToString(Request.Headers.GetValues("ctxt1").FirstOrDefault());
                var ctxt2 = Convert.ToString(Request.Headers.GetValues("ctxt2").FirstOrDefault());
                var ctxt3 = Convert.ToString(Request.Headers.GetValues("ctxt3").FirstOrDefault());
                var ctxt4 = Convert.ToString(Request.Headers.GetValues("ctxt4").FirstOrDefault());
                var ctxt5 = Convert.ToString(Request.Headers.GetValues("ctxt5").FirstOrDefault());
                var ctxt6 = Convert.ToString(Request.Headers.GetValues("ctxt6").FirstOrDefault());
                var ctxt7 = Convert.ToString(Request.Headers.GetValues("ctxt7").FirstOrDefault());
                var ctxt8 = Convert.ToString(Request.Headers.GetValues("ctxt8").FirstOrDefault());
                var ctxt9 = Convert.ToString(Request.Headers.GetValues("ctxt9").FirstOrDefault());
                var ctxt10 = Convert.ToString(Request.Headers.GetValues("ctxt10").FirstOrDefault());
                var ctxt11 = Convert.ToString(Request.Headers.GetValues("ctxt11").FirstOrDefault());
                var ctxt12 = Convert.ToString(Request.Headers.GetValues("ctxt12").FirstOrDefault());
                var ctxt13 = Convert.ToString(Request.Headers.GetValues("ctxt13").FirstOrDefault());
                var ctxt14 = Convert.ToString(Request.Headers.GetValues("ctxt14").FirstOrDefault());
                var ctxt15 = Convert.ToString(Request.Headers.GetValues("ctxt15").FirstOrDefault());
                var mcol1 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col1"]);
                var mcol2 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col2"]);
                var mcol3 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col3"]);
                var mcol4 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col4"]);
                var mcol5 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col5"]);
                var mcol6 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col6"]);
                var mcol7 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col7"]);
                var mcol8 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col8"]);
                var mcol9 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col9"]);
                var mcol10 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col10"]);
                var mcol11 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col11"]);
                var mcol12 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col12"]);
                var mcol13 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col13"]);
                var mcol14 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col14"]);
                var mcol15 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col15"]);
                if (mcol1 == "undefined")
                {
                    mcol1 = null;
                }
                else if (mcol1 != null)
                {
                    mcol1 = mcol1.Replace("&amp;", "&");
                }
                if (mcol2 == "undefined")
                {
                    mcol2 = null;
                }
                else if (mcol2 != null)
                {
                    mcol2 = mcol2.Replace("&amp;", "&");
                }
                if (mcol3 == "undefined")
                {
                    mcol3 = null;
                }
                else if (mcol3 != null)
                {
                    mcol3 = mcol3.Replace("&amp;", "&");
                }
                if (mcol4 == "undefined")
                {
                    mcol4 = null;
                }
                else if (mcol4 != null)
                {
                    mcol4 = mcol4.Replace("&amp;", "&");
                }
                if (mcol5 == "undefined")
                {
                    mcol5 = null;
                }
                else if (mcol5 != null)
                {
                    mcol5 = mcol5.Replace("&amp;", "&");
                }
                if (mcol6 == "undefined")
                {
                    mcol6 = null;
                }
                else if (mcol6 != null)
                {
                    mcol6 = mcol6.Replace("&amp;", "&");
                }
                if (mcol7 == "undefined")
                {
                    mcol7 = null;
                }
                else if (mcol7 != null)
                {
                    mcol7 = mcol7.Replace("&amp;", "&");
                }
                if (mcol8 == "undefined")
                {
                    mcol8 = null;
                }
                else if (mcol8 != null)
                {
                    mcol8 = mcol8.Replace("&amp;", "&");
                }
                if (mcol9 == "undefined")
                {
                    mcol9 = null;
                }
                else if (mcol9 != null)
                {
                    mcol9 = mcol9.Replace("&amp;", "&");
                }
                if (mcol10 == "undefined")
                {
                    mcol10 = null;
                }
                else if (mcol10 != null)
                {
                    mcol10 = mcol10.Replace("&amp;", "&");
                }
                if (mcol11 == "undefined")
                {
                    mcol11 = null;
                }
                else if (mcol11 != null)
                {
                    mcol11 = mcol11.Replace("&amp;", "&");
                }
                if (mcol12 == "undefined")
                {
                    mcol12 = null;
                }
                else if (mcol12 != null)
                {
                    mcol12 = mcol12.Replace("&amp;", "&");
                }
                if (mcol13 == "undefined")
                {
                    mcol13 = null;
                }
                else if (mcol13 != null)
                {
                    mcol13 = mcol13.Replace("&amp;", "&");
                }
                if (mcol14 == "undefined")
                {
                    mcol14 = null;
                }
                else if (mcol14 != null)
                {
                    mcol14 = mcol14.Replace("&amp;", "&");
                }
                if (mcol15 == "undefined")
                {
                    mcol15 = null;
                }
                else if (mcol15 != null)
                {
                    mcol15 = mcol15.Replace("&amp;", "&");
                }
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var files = "";
                if (!String.IsNullOrEmpty(username))
                {
                    //check userid if exist
                    var checkuser = db.ValidateUserName(username).FirstOrDefault();
                    if (checkuser != null)
                    {
                        return Ok("Already Exists User Please Try Another User Name!");
                    }
                }
                //upload files in azure server
                var httpRequest = HttpContext.Current.Request;
                files = postedFiledata;
                string useremail = "";
                string usermobile = "";
                var flag = 0;
                AddCaseObject1 addcase = new AddCaseObject1();
                var getuseremil = db.usp_GetEmailByUserId(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).FirstOrDefault();
                if (getuseremil.cmobile != null)
                {
                    usermobile = getuseremil.cmobile;
                }
                if (getuseremil.EmailId != null)
                {
                    useremail = getuseremil.EmailId;
                }
                addcase.Username = WebConfigurationManager.AppSettings["matteridname"] + LoggedInUser.UserId.ToString();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var countdatas = "";
                var caseid = "";
                if (caseteamlead == "")
                {
                    caseteamlead = null;
                }
                //For Other Party Deatails
                var otherpartyFname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["otherpartyFname"]);
                var otherpartyEMail = QueryAES.UrlDecode(HttpContext.Current.Request.Form["otherpartyEMail"]);
                var otherpartyPhone = QueryAES.UrlDecode(HttpContext.Current.Request.Form["otherpartyPhone"]);
                var otherpartyType = QueryAES.UrlDecode(HttpContext.Current.Request.Form["otherpartyType"]);

                var countdata = Repository.Matter.SaveFullScreenCase(firmid, userid, usertypes, clientid, casename, casetype, caseclientcontact, casedetails, casenotes,
                    court, othercourt, casestatus, caseodate, casenumber, casecdate, caseteamlead, casecnr, username, casesidepassword, clientto, assignto,
                    sollist, checkclient, files, sum, ctxt1, ctxt2, ctxt3, ctxt4, ctxt5, ctxt6, ctxt7, ctxt8, ctxt9, ctxt10, ctxt11, ctxt12, ctxt13, ctxt14,
                    ctxt15, mcol1, mcol2, mcol3, mcol4, mcol5, mcol6, mcol7, mcol8, mcol9, mcol10, mcol11, mcol12, mcol13, mcol14, mcol15, ftype.ToString(),
                    addcase, flag, useremail, usermobile, apiUrl, clientno, fmatterType, PoliceStation, Firno, CertifiedCopyAppliedon, CertifiedCopyReceivedon,
                    ValuationofSuit, Courtfee, OppositePartyCounselname, OppositePartyCounselemail, OppositePartyCounselphone, CasenumberInternal,
                    IsCourtFeePaid, SubjectType, casefilingcdate,
                    submitDate.Date, returnDate.Date, ePartyName, ePartyFatherName, ePartyAddress, ePartyAdharCardNo, ePartyGender,
                   ePartyDateOfBirth, ePartyNationality, ePartyMobileNo, ePartyEmail, LoggedInUser.RoleId.ToString(), MatterType, txtMatterOther,
                   DisputeMatterType, fcompanystructure, fdisposedoption, NotesCasedetail,
                   otherpartyFname, otherpartyEMail, otherpartyPhone, otherpartyType
                    );
                try
                {
                    Guid chkid = Guid.Parse(countdata);
                    caseid = countdata;
                    countdatas = "1";
                    //link to notice
                    try
                    {
                        //BridgeStone insert unique case id on the behalf on mastercaseid
                        string BridgeStoneModulePermission = System.Configuration.ConfigurationManager.AppSettings["BridgeStoneModulePermission"];
                        string pmrdaFirmId = System.Configuration.ConfigurationManager.AppSettings["IPRDACustomization"];

                        if (!string.IsNullOrEmpty(Convert.ToString(caseid)) && string.Equals(firmid, BridgeStoneModulePermission, StringComparison.OrdinalIgnoreCase))
                        {
                            var status = DataAccessADO.SaveBridgeStoneOtherMatterDetails(Convert.ToString(caseid));
                        }
                        //Pmrda insert department and advocate name for customization
                        if (pmrdaFirmId.ToLower() == firmid.ToLower())
                        {
                            var status = DataAccessADO.SavePmrdaMatterAdvAndDepDetails(Convert.ToString(caseid), compdep, compadVocateName);

                        }

                        if (!String.IsNullOrEmpty(NoticeId))
                        {
                            var dataresult = db.usp_SaveLinkNoticetoMatter(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), NoticeId, caseid, null);
                        }
                    }
                    catch (Exception ex)
                    {
                    }
                    try
                    {
                        int pageid = 0;
                        var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("caselist")).FirstOrDefault();
                        if (pagelist != null)
                        {
                            pageid = Convert.ToInt32(pagelist.ParentPage);
                        }
                        string id = "";
                        ObjectParameter IDParameter;
                        IDParameter = new ObjectParameter("iid", id);
                        //for assign user
                        if (!String.IsNullOrEmpty(assignto))
                        {
                            string[] values = assignto.Split(',');
                            for (int i = 0; i < values.Length; i++)
                            {
                                values[i] = values[i].Trim();
                                var checkroles = db.usp_GetUserbyId(firmid, values[i]).FirstOrDefault();
                                if (checkroles != null)
                                {
                                    if (checkroles.roleid != 1)
                                    {
                                        var roweffected2 = db.usp_SaveUserDefaultCaseRights(firmid, userid, values[i], caseid, pageid);
                                        //for partner
                                        if (!String.IsNullOrEmpty(checkroles.PartnerId))
                                        {
                                            var roweffected4 = db.usp_SaveUserDefaultCaseRights(firmid, userid, checkroles.PartnerId, caseid, pageid);
                                        }
                                    }
                                }
                            }
                            if (LoggedInUser.RoleId != 1)
                            {
                                //for creator
                                var checkroles = db.usp_GetUserbyId(firmid, userid).FirstOrDefault();
                                if (checkroles != null)
                                {
                                    var roweffected2 = db.usp_SaveUserDefaultCaseRights(firmid, userid, userid, caseid, pageid);
                                    //for partner
                                    if (!String.IsNullOrEmpty(checkroles.PartnerId))
                                    {
                                        var roweffected4 = db.usp_SaveUserDefaultCaseRights(firmid, userid, checkroles.PartnerId, caseid, pageid);
                                    }
                                }
                            }
                        }
                    }
                    catch
                    {
                    }
                    try
                    {
                        int pageid = 0;
                        var pagelist = db.usp_GetDocRightsPageDatabyPagelink(Convert.ToString("Case Documents")).FirstOrDefault();
                        if (pagelist != null)
                        {
                            pageid = Convert.ToInt32(pagelist.Id);
                        }
                        string id = "";
                        ObjectParameter IDParameter;
                        IDParameter = new ObjectParameter("iid", id);
                        //for assign user
                        if (!String.IsNullOrEmpty(assignto))
                        {
                            string[] values = assignto.Split(',');
                            for (int i = 0; i < values.Length; i++)
                            {
                                values[i] = values[i].Trim();
                                var checkroles = db.usp_GetUserbyId(firmid, values[i]).FirstOrDefault();
                                if (checkroles != null)
                                {
                                    if (checkroles.roleid != 1)
                                    {
                                        var roweffected2 = db.usp_SaveUserDefaultCaseRights(firmid, userid, values[i], caseid, pageid);
                                        //for partner
                                        if (!String.IsNullOrEmpty(checkroles.PartnerId))
                                        {
                                            var roweffected4 = db.usp_SaveUserDefaultCaseRights(firmid, userid, checkroles.PartnerId, caseid, pageid);
                                        }
                                    }
                                }
                            }
                            if (LoggedInUser.RoleId != 1)
                            {
                                //for creator
                                var checkroles = db.usp_GetUserbyId(firmid, userid).FirstOrDefault();
                                if (checkroles != null)
                                {
                                    var roweffected2 = db.usp_SaveUserDefaultCaseRights(firmid, userid, userid, caseid, pageid);
                                    //for partner
                                    if (!String.IsNullOrEmpty(checkroles.PartnerId))
                                    {
                                        var roweffected4 = db.usp_SaveUserDefaultCaseRights(firmid, userid, checkroles.PartnerId, caseid, pageid);
                                    }
                                }
                            }
                        }
                    }
                    catch
                    {
                    }
                }
                catch
                {
                    countdatas = countdata;
                }
                if (countdatas.ToString() == "1")
                {
                    var newcasefolderid = "";
                    int maxFileSize = Convert.ToInt32(WebConfigurationManager.AppSettings["docelasticmaxFileSize"]);
                    var id = "";
                    var dpaths = "";
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
                        IDParameter = new ObjectParameter("id", id);
                        var data = db1.usp_SaveFilefolderCloudNew(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), dname.TrimStart().TrimEnd(), dpaths, 0, directoryid.ToString(), null, null, null, IDParameter, caseid, null, 0, "1", null, null);
                        newcasefolderid = Convert.ToString(IDParameter.Value);
                    }
                    var dpath = dpaths.TrimEnd('/');
                    try
                    {
                        if (httpRequest.Files.Count > 0)
                        {
                            if (Convert.ToInt32(countdatas) == 1)
                            {
                                //update docs in document mgmt
                                if (!String.IsNullOrEmpty(countdata))
                                {
                                    var newfilename = "";
                                    var newfilenames = "";
                                    string AzureStorageName = WebConfigurationManager.AppSettings["AzureStorageName"];
                                    string AzureStorageKey = WebConfigurationManager.AppSettings["AzureStorageKey"];
                                    string azureroot = "mykase";
                                    string azuredir = "WorkSpace";
                                    string fakepathin = "azuredirin/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                                    string fakepathout = "azuredirout/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                                    var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
                                    var account = new CloudStorageAccount(cred, true);
                                    var client = account.CreateCloudFileClient();
                                    if (httpRequest.Files.Count > 0)
                                    {
                                        var docfiles = new List<string>();
                                        //Check whether Directory (Folder) exists.
                                        for (int i = 0; i < httpRequest.Files.Count; i++)
                                        {
                                            var postedFile = httpRequest.Files[i];
                                            //encrypt file
                                            string input = HttpContext.Current.Server.MapPath("~/" + fakepathin);
                                            if (!(Directory.Exists(input)))
                                            {
                                                Directory.CreateDirectory(input);
                                            }
                                            if (!(Directory.Exists(HttpContext.Current.Server.MapPath("~/" + fakepathout))))
                                            {
                                                Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/" + fakepathout));
                                            }
                                            var fileextchk = Path.GetExtension(postedFile.FileName);
                                            var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);
                                            postedFile.SaveAs(input + "\\" + postedFile.FileName);
                                            //for start elastic
                                            string strfilepath = input + "\\" + postedFile.FileName;
                                            int fileSize = postedFile.ContentLength;
                                            var directory = Path.GetDirectoryName(strfilepath);
                                            string strfileName = Path.GetFileName(strfilepath);
                                            string mimeType = MimeMapping.GetMimeMapping(strfileName);
                                            var base64File = Convert.ToBase64String(System.IO.File.ReadAllBytes(Path.Combine(directory, strfileName)));
                                            //end elastic
                                            input = input + "\\" + postedFile.FileName;
                                            string output = HttpContext.Current.Server.MapPath("~/" + fakepathout + "/" + postedFile.FileName);
                                            QueryAES.FileEncrypt(input, output);
                                            //delete file
                                            try
                                            {
                                                System.IO.File.Delete(input);
                                            }
                                            catch (Exception ex)
                                            {
                                            }
                                            //rename file exist
                                            int it = 0;
                                            var fileName = postedFile.FileName;
                                            var origininalfilename = fileName;
                                            var orfileNameOnly = fileName.Remove(fileName.LastIndexOf('.') + 1).TrimEnd('.');
                                            var extension = fileName.Split('.').Last();
                                            while (AzureDocument.fileexist(dpath, origininalfilename, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()))
                                            {
                                                it += 1;
                                                origininalfilename = string.Format("{0}({1}).{2}", orfileNameOnly, it, extension);
                                            }
                                            CloudStorageAccount storageAccount = new CloudStorageAccount(cred, true);
                                            // Create a reference to the file client.
                                            CloudFileClient fileClient = storageAccount.CreateCloudFileClient();
                                            var share = client.GetShareReference(azureroot);
                                            // Create a reference to the Azure path
                                            var cloudFileDirectory = share.GetRootDirectoryReference().GetDirectoryReference(dpath);
                                            cloudFileDirectory.CreateIfNotExists();
                                            //Create a reference to the filename that you will be uploading
                                            CloudFile cloudFile = cloudFileDirectory.GetFileReference(origininalfilename);
                                            var fileext = Path.GetExtension(origininalfilename);
                                            //Open a stream from a local file.
                                            //Upload the file to Azure.
                                            if (cloudFile.Exists())
                                            {
                                                return Ok("exist");
                                            }
                                            else
                                            {
                                                cloudFile.UploadFromFile(output);
                                            }
                                            try
                                            {
                                                System.IO.File.Delete(output);
                                            }
                                            catch (Exception ex)
                                            {
                                            }
                                            ObjectParameter IDParameter1;
                                            IDParameter1 = new ObjectParameter("id", id);
                                            var data1 = db1.usp_SaveFilefolderCloudNew(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), origininalfilename, dpath, 1, newcasefolderid.ToString(), null, fileext, null, IDParameter1, null, null, 0, "1", null, null);
                                            id = Convert.ToString(IDParameter1.Value);
                                            //if size is lessthan or equal to 2 mb thwn proceed
                                            if (fileSize <= ((maxFileSize * 1024) * 1024))
                                            {
                                                //insert doc to elastic
                                                try
                                                {
                                                    var result = AzureDocument.insertdoctoelastic(id, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), base64File, origininalfilename, origininalfilename, mimeType, dpath);
                                                    if (result == true)
                                                    {
                                                        //update index value of data
                                                        var cts = db1.usp_updateFileindexvalue(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), id, 1);
                                                    }
                                                    else
                                                    {
                                                    }
                                                }
                                                catch
                                                {
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    catch
                    {
                    }
                }
                var param = controllername + ">FullScreenSaveCase>SaveFullScreenCase>param=" + firmid + "@" + userid + "@" + usertypes + "@" + clientid + "@" + casename + "@" + casetype + "@" + caseclientcontact + "@" + casedetails + "@" + casenotes + "@" + court + "@" + othercourt + "@" + casestatus + "@" + caseodate + "@" + casenumber + "@" + casecdate + "@" + caseteamlead + "@" + casecnr + "@" + username + "@" + casesidepassword + "@" + clientto + "@" + assignto + "@" + sollist + "@" + checkclient + "@" + files + "@" + sum + "@" + ctxt1 + "@" + ctxt2 + "@" + ctxt3 + "@" + ctxt4 + "@" + ctxt5 + "@" + ctxt6 + "@" + ctxt7 + "@" + ctxt8 + "@" + ctxt9 + "@" + ctxt10 + "@" + ctxt11 + "@" + ctxt12 + "@" + ctxt13 + "@" + ctxt14 + "@" + ctxt15 + "@" + mcol1 + "@" + mcol2 + "@" + mcol3 + "@" + mcol4 + "@" + mcol5 + "@" + mcol6 + "@" + mcol7 + "@" + mcol8 + "@" + mcol9 + "@" + mcol10 + "@" + mcol11 + "@" + mcol12 + "@" + mcol13 + "@" + mcol14 + "@" + mcol15 + "@" + ftype.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(countdatas);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Load new case list
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadNewCaseList()
        {
            try
            {
                var odate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["odate"]);
                var casename = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casename"]);
                var clientname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["clientname"]);
                var court = QueryAES.UrlDecode(HttpContext.Current.Request.Form["court"]);
                var cstatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["cstatus"]);
                var searchuser = QueryAES.UrlDecode(HttpContext.Current.Request.Form["users"]);
                int pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                int pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                var createdby = QueryAES.UrlDecode(HttpContext.Current.Request.Form["createdby"]);
                var filtervalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtervalue"]);
                //Add companyfilter
                var companynamefiltervalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["companyfilter"]);
                var mattertypefiltervalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["mattertypefilter"]);
                var subjecttypefiltervalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["subjecttypefilter"]);
                var casefilternotes = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casefilternotes"]);
                var casefiltercourtname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casefiltercourtname"]);
                var odateto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["odateto"]);
                var fillingdate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fillingdate"]);
                var fillingdateto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fillingdateto"]);
                var searchcustomcolname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["searchcustomcolname"]);
                var searchcustomcolvalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["searchcustomcolvalue"]);
                var filtercasedisposeoption = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casedisposefilter"]);
                //Add new filter as per new requirement
                var casefilterCaseDetails = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casefilterCaseDetails"]);
                var casefiltermtrno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casefiltermtrno"]);
                var casefilterInternalno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casefilterInternalno"]);
                var casefiltercnrno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casefiltercnrno"]);
                var caseredirectfilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseredirectfilter"]);
                //Add new next hearing date range filter
                var NextHearingfromd = QueryAES.UrlDecode(HttpContext.Current.Request.Form["NextHearingfromd"]);
                var NextHearingtod = QueryAES.UrlDecode(HttpContext.Current.Request.Form["NextHearingtod"]);
                var courtstatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CourtStatusfiletr"]);
                var hearingsorting = QueryAES.UrlDecode(HttpContext.Current.Request.Form["hearingsorting"]);
                var casedetailsfilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casedetailsfilter"]);
                //Add new filter petioner/respondent
                var hearingsortfilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["hearingsortfilter"]);
                var petionerfilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["petionerfilter"]);
                var respondentrfilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["respondentrfilter"]);
                if (filtercasedisposeoption == "null" || filtercasedisposeoption == null)
                {
                    filtercasedisposeoption = "";
                }
                if (searchuser == "null" || searchuser == "undefined" || searchuser == null)
                    searchuser = "";
                var IsCaseArchived = "";

                IsCaseArchived = QueryAES.UrlDecode(HttpContext.Current.Request.Form["IsCaseArchived"]);

                LawPracticeEntities db = new LawPracticeEntities();
                int pageid = 0;
                var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("caselist")).FirstOrDefault();
                if (pagelist != null)
                {
                    pageid = Convert.ToInt32(pagelist.ParentPage);
                }
                if (LoggedInUser.RoleId == 1)
                {
                    if (String.IsNullOrEmpty(searchuser))
                    {

                        var cases1 = DataAccessADO.loadnewcaselist(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), pagenum,
                        pagesize, odate, casename, clientname, court, cstatus, createdby, Convert.ToInt32(filtervalue), companynamefiltervalue,
                        mattertypefiltervalue.ToString(), subjecttypefiltervalue.ToString(), casefilternotes, casefiltercourtname, odateto,
                        fillingdate, fillingdateto, IsCaseArchived, searchcustomcolname, searchcustomcolvalue, filtercasedisposeoption,
                        casefilterCaseDetails, casefiltermtrno, casefilterInternalno, casefiltercnrno, caseredirectfilter, NextHearingfromd, NextHearingtod,
                        casedetailsfilter, courtstatus, hearingsortfilter, petionerfilter, respondentrfilter);
                        //var cases1 = Repository.Matter.loadnewcaselist(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), pagenum,
                        // pagesize, odate, casename, clientname, court, cstatus, createdby, Convert.ToInt32(filtervalue), companynamefiltervalue,
                        //  mattertypefiltervalue.ToString(), subjecttypefiltervalue.ToString(), casefilternotes, casefiltercourtname, odateto,
                        //  fillingdate, fillingdateto, IsCaseArchived, searchcustomcolname, searchcustomcolvalue, filtercasedisposeoption,
                        // casefilterCaseDetails, casefiltermtrno, casefilterInternalno, casefiltercnrno, caseredirectfilter, NextHearingfromd, NextHearingtod,
                        // courtstatus, hearingsorting, casedetailsfilter, hearingsortfilter, petionerfilter, respondentrfilter);

                        // var param = controllername + ">LoadNewCaseList>loadnewcaselist>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId.ToString() + "@" + pagenum + "@" + pagesize + "@" + odate + "@" + casename + "@" + clientname + "@" + court + "@" + cstatus + "@" + createdby + "@" + Convert.ToInt32(filtervalue) + "@" + companynamefiltervalue + "@" + mattertypefiltervalue.ToString() + "@" + subjecttypefiltervalue.ToString() + "@" + casefilternotes + "@" + casefiltercourtname + "@" + odateto + "@" + fillingdate + "@" + fillingdateto + "@" + IsCaseArchived;
                        // db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                        var cases = JsonConvert.DeserializeObject<List<GetNewCaseDetailByRowIdNew_Result>>(cases1);

                        // Encrypt UserCaseid for each case
                        foreach (var c in cases)
                        {
                            if (!string.IsNullOrEmpty(c.UserCaseid))
                            {
                                c.UserCaseid = Convert.ToBase64String(QueryAES.EncryptAes(c.UserCaseid.ToString()));
                            }
                        }
                        string encryptedJson = JsonConvert.SerializeObject(cases);
                        return Ok(encryptedJson);
                    }
                    else
                    {
                        var cases1 = DataAccessADO.loadusernewcaselist(LoggedInUser.FirmId.ToString(), searchuser, pagenum, pagesize,
                         odate, casename, clientname, court, cstatus, pageid, 1, createdby, Convert.ToInt32(filtervalue), companynamefiltervalue,
                         mattertypefiltervalue.ToString(), subjecttypefiltervalue.ToString(), casefilternotes, casefiltercourtname,
                         odateto, fillingdate, fillingdateto, IsCaseArchived, searchcustomcolname, searchcustomcolvalue, filtercasedisposeoption,
                         casefilterCaseDetails, casefiltermtrno, casefilterInternalno, casefiltercnrno, caseredirectfilter, NextHearingfromd, NextHearingtod,
                         courtstatus, casedetailsfilter, hearingsortfilter, petionerfilter, respondentrfilter);

                        // var cases1 = Repository.Matter.loadusernewcaselist(LoggedInUser.FirmId.ToString(), searchuser, pagenum, pagesize,
                        //odate, casename, clientname, court, cstatus, 1, createdby, Convert.ToInt32(filtervalue), companynamefiltervalue,
                        //mattertypefiltervalue.ToString(), subjecttypefiltervalue.ToString(), casefilternotes, casefiltercourtname,
                        //odateto, fillingdate, fillingdateto, IsCaseArchived, searchcustomcolname, searchcustomcolvalue, filtercasedisposeoption,
                        //casefilterCaseDetails, casefiltermtrno, casefilterInternalno, casefiltercnrno, caseredirectfilter, NextHearingfromd, NextHearingtod,
                        //courtstatus, hearingsorting, casedetailsfilter, hearingsortfilter, petionerfilter, respondentrfilter);

                        //var param = controllername + ">LoadNewCaseList>loadusernewcaselist>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId.ToString() + "@" + pagenum + "@" + pagesize + "@" + odate + "@" + casename + "@" + clientname + "@" + court + "@" + cstatus + "@" + createdby + "@" + Convert.ToInt32(filtervalue) + "@" + companynamefiltervalue + "@" + mattertypefiltervalue.ToString() + "@" + subjecttypefiltervalue.ToString() + "@" + casefilternotes + "@" + casefiltercourtname + "@" + odateto + "@" + fillingdate + "@" + fillingdateto + "@" + IsCaseArchived;
                        // db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                        var cases = JsonConvert.DeserializeObject<List<GetNewCaseDetailByRowIdNew_Result>>(cases1);

                        // Encrypt UserCaseid for each case
                        foreach (var c in cases)
                        {
                            if (!string.IsNullOrEmpty(c.UserCaseid))
                            {
                                c.UserCaseid = Convert.ToBase64String(QueryAES.EncryptAes(c.UserCaseid.ToString()));
                            }
                        }
                        string encryptedJson = JsonConvert.SerializeObject(cases);
                        return Ok(encryptedJson);
                    }
                }
                else if (LoggedInUser.RoleId == 2)
                {


                    var cases1 = DataAccessADO.loadusernewcaselist(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(),
                    pagenum, pagesize, odate, casename, clientname, court, cstatus, pageid, 2, createdby, Convert.ToInt32(filtervalue),
                    companynamefiltervalue, mattertypefiltervalue.ToString(), subjecttypefiltervalue.ToString(), casefilternotes,
                    casefiltercourtname, odateto, fillingdate, fillingdateto, IsCaseArchived, searchcustomcolname, searchcustomcolvalue,
                    filtercasedisposeoption, casefilterCaseDetails, casefiltermtrno, casefilterInternalno, casefiltercnrno,
                    caseredirectfilter, NextHearingfromd, NextHearingtod, courtstatus, casedetailsfilter, hearingsortfilter, petionerfilter, respondentrfilter);
                    // var param = controllername + ">LoadNewCaseList>LoadUserNewCaseList>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId.ToString() + "@" + pagenum + "@" + pagesize + "@" + odate + "@" + casename + "@" + clientname + "@" + court + "@" + cstatus + "@" + createdby + "@" + Convert.ToInt32(filtervalue) + "@" + companynamefiltervalue + "@" + mattertypefiltervalue.ToString() + "@" + subjecttypefiltervalue.ToString() + "@" + casefilternotes + "@" + casefiltercourtname + "@" + odateto + "@" + fillingdate + "@" + fillingdateto + "@" + IsCaseArchived;
                    // db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");


                    var cases = JsonConvert.DeserializeObject<List<GetNewCaseDetailByRowIdNew_Result>>(cases1);

                    // Encrypt UserCaseid for each case
                    foreach (var c in cases)
                    {
                        if (!string.IsNullOrEmpty(c.UserCaseid))
                        {
                            c.UserCaseid = Convert.ToBase64String(QueryAES.EncryptAes(c.UserCaseid.ToString()));
                        }
                    }
                    string encryptedJson = JsonConvert.SerializeObject(cases);
                    return Ok(encryptedJson);
                    //return Ok(cases);

                }
                else
                {
                    return Ok("");
                }


            }
            catch (Exception ex)
            {

                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }



        }
        /// <summary>
        /// RBI-only: Returns ALL matters for the firm without role-based filtering.
        /// For RBI Partner/User roles (RoleId 2,3) to see the same matter list as Admin.
        /// </summary>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadNewCaseList_RBIAll()
        {
            try
            {
                var odate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["odate"]);
                var casename = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casename"]);
                var clientname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["clientname"]);
                var court = QueryAES.UrlDecode(HttpContext.Current.Request.Form["court"]);
                var cstatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["cstatus"]);
                var searchuser = QueryAES.UrlDecode(HttpContext.Current.Request.Form["users"]);
                if (searchuser == "null" || searchuser == "undefined" || searchuser == null) searchuser = "";
                int pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                int pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                var createdby = QueryAES.UrlDecode(HttpContext.Current.Request.Form["createdby"]);
                var filtervalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtervalue"]);
                var companynamefiltervalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["companyfilter"]);
                var mattertypefiltervalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["mattertypefilter"]);
                var subjecttypefiltervalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["subjecttypefilter"]);
                var casefilternotes = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casefilternotes"]);
                var casefiltercourtname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casefiltercourtname"]);
                var odateto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["odateto"]);
                var fillingdate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fillingdate"]);
                var fillingdateto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fillingdateto"]);
                var IsCaseArchived = QueryAES.UrlDecode(HttpContext.Current.Request.Form["IsCaseArchived"]);
                var searchcustomcolname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["searchcustomcolname"]);
                var searchcustomcolvalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["searchcustomcolvalue"]);
                var filtercasedisposeoption = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casedisposefilter"]);
                if (filtercasedisposeoption == "null" || filtercasedisposeoption == null) filtercasedisposeoption = "";
                var casefilterCaseDetails = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casefilterCaseDetails"]);
                var casefiltermtrno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casefiltermtrno"]);
                var casefilterInternalno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casefilterInternalno"]);
                var casefiltercnrno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casefiltercnrno"]);
                var caseredirectfilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseredirectfilter"]);
                var NextHearingfromd = QueryAES.UrlDecode(HttpContext.Current.Request.Form["NextHearingfromd"]);
                var NextHearingtod = QueryAES.UrlDecode(HttpContext.Current.Request.Form["NextHearingtod"]);
                var courtstatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CourtStatusfiletr"]);
                var casedetailsfilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casedetailsfilter"]);
                var hearingsortfilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["hearingsortfilter"]);
                var petionerfilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["petionerfilter"]);
                var respondentrfilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["respondentrfilter"]);

                // Validate RBI firm + Partner/User role
                bool isRBI = LoggedInUser.FirmId.ToString().ToUpper() == (ConfigurationManager.AppSettings["RBICustomization"] ?? "").ToUpper();
                if (!isRBI || (LoggedInUser.RoleId != 2 && LoggedInUser.RoleId != 3))
                    return Ok("[]");

                // Find an active Admin user to pass as @userid so the SP returns all matters
                var queryUserId = LoggedInUser.UserId.ToString();
                try
                {
                    var db = new LawPracticeEntities();
                    var adminUser = db.FirmUsers
                        .Where(x => x.Firmid == LoggedInUser.FirmId && x.IsActive && x.IsFirmAdmin)
                        .Select(x => x.Id)
                        .FirstOrDefault();
                    if (adminUser != Guid.Empty)
                        queryUserId = adminUser.ToString();
                }
                catch { }

                var casesJson = DataAccessADO.loadnewcaselist(LoggedInUser.FirmId.ToString(), queryUserId, pagenum,
                    pagesize, odate, casename, clientname, court, cstatus, createdby, Convert.ToInt32(filtervalue), companynamefiltervalue,
                    mattertypefiltervalue.ToString(), subjecttypefiltervalue.ToString(), casefilternotes, casefiltercourtname, odateto,
                    fillingdate, fillingdateto, IsCaseArchived, searchcustomcolname, searchcustomcolvalue, filtercasedisposeoption,
                    casefilterCaseDetails, casefiltermtrno, casefilterInternalno, casefiltercnrno, caseredirectfilter, NextHearingfromd, NextHearingtod,
                    courtstatus, casedetailsfilter, hearingsortfilter, petionerfilter, respondentrfilter);

                var cases = JsonConvert.DeserializeObject<List<GetNewCaseDetailByRowIdNew_Result>>(casesJson);
                foreach (var c in cases)
                {
                    if (!string.IsNullOrEmpty(c.UserCaseid))
                        c.UserCaseid = Convert.ToBase64String(QueryAES.EncryptAes(c.UserCaseid.ToString()));
                }
                return Ok(JsonConvert.SerializeObject(cases));
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
        /// <summary>
        /// Load new standard case list
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadNewStandardCaseList()
        {
            try
            {
                var odate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["odate"]);
                var casename = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casename"]);
                var clientname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["clientname"]);
                var court = QueryAES.UrlDecode(HttpContext.Current.Request.Form["court"]);
                var cstatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["cstatus"]);
                var searchuser = QueryAES.UrlDecode(HttpContext.Current.Request.Form["users"]);
                int pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                int pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                var createdby = QueryAES.UrlDecode(HttpContext.Current.Request.Form["createdby"]);
                var filtervalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtervalue"]);
                //Add companyfilter
                var companynamefiltervalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["companyfilter"]);
                var mattertypefiltervalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["mattertypefilter"]);
                var subjecttypefiltervalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["subjecttypefilter"]);
                var casefilternotes = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casefilternotes"]);
                LawPracticeEntities db = new LawPracticeEntities();
                bool isRBI = LoggedInUser.FirmId.ToString().ToUpper() == (ConfigurationManager.AppSettings["RBICustomization"] ?? "").ToUpper();
                bool isPartnerOrUser = LoggedInUser.RoleId == 2 || LoggedInUser.RoleId == 3;
                var effectiveRoleId = (isRBI && isPartnerOrUser) ? 1 : LoggedInUser.RoleId;

                var queryUserId = LoggedInUser.UserId.ToString();
                if (isRBI && isPartnerOrUser)
                {
                    try
                    {
                        var adminUserId = db.FirmUsers
                            .Where(x => x.Firmid == LoggedInUser.FirmId && x.IsActive && x.IsFirmAdmin)
                            .Select(x => x.Id)
                            .FirstOrDefault();
                        if (adminUserId != Guid.Empty)
                        {
                            queryUserId = adminUserId.ToString();
                        }
                    }
                    catch
                    {
                    }
                }

                if (effectiveRoleId == 1)
                {
                    if (String.IsNullOrEmpty(searchuser))
                    {
                        var cases1 = Repository.Matter.loadstandardcaselist(LoggedInUser.FirmId.ToString(), queryUserId, pagenum, pagesize, odate, casename, clientname, court, cstatus, createdby, Convert.ToInt32(filtervalue), companynamefiltervalue, mattertypefiltervalue.ToString(), subjecttypefiltervalue.ToString(), casefilternotes);
                        var param = controllername + ">LoadNewStandardCaseList>loadstandardcaselist>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId.ToString() + "@" + pagenum + "@" + pagesize + "@" + odate + "@" + casename + "@" + clientname + "@" + court + "@" + cstatus;
                        db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                        return Ok(cases1);
                    }
                    else
                    {
                        var cases1 = Repository.Matter.loadusernewstandardcaselist(LoggedInUser.FirmId.ToString(), searchuser, pagenum, pagesize, odate, casename, clientname, court, cstatus, 1, createdby, Convert.ToInt32(filtervalue), companynamefiltervalue, mattertypefiltervalue.ToString(), subjecttypefiltervalue.ToString(), casefilternotes);
                        var param = controllername + ">LoadNewStandardCaseList>loadusernewstandardcaselist>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId.ToString() + "@" + pagenum + "@" + pagesize + "@" + odate + "@" + casename + "@" + clientname + "@" + court + "@" + cstatus;
                        db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                        return Ok(cases1);
                    }
                }
                else if (effectiveRoleId == 2)
                {
                    var cases1 = Repository.Matter.loadusernewstandardcaselist(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), pagenum, pagesize, odate, casename, clientname, court, cstatus, 2, createdby, Convert.ToInt32(filtervalue), companynamefiltervalue, mattertypefiltervalue.ToString(), subjecttypefiltervalue.ToString(), casefilternotes);
                    var param = controllername + ">LoadNewStandardCaseList>loadusernewstandardcaselist>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId.ToString() + "@" + pagenum + "@" + pagesize + "@" + odate + "@" + casename + "@" + clientname + "@" + court + "@" + cstatus;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                    return Ok(cases1);
                }
                else
                {
                    return Ok("");
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
        /// <summary>
        /// Load new archive matter list details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadNewArchiveMatterList()
        {
            try
            {
                var odate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["odate"]);
                var casename = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casename"]);
                var clientname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["clientname"]);
                var court = QueryAES.UrlDecode(HttpContext.Current.Request.Form["court"]);
                var cstatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["cstatus"]);
                var searchuser = QueryAES.UrlDecode(HttpContext.Current.Request.Form["users"]);
                int pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                int pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                var createdby = QueryAES.UrlDecode(HttpContext.Current.Request.Form["createdby"]);
                var filtervalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtervalue"]);
                //Add companyfilter
                var companynamefiltervalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["companyfilter"]);
                var mattertypefiltervalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["mattertypefilter"]);
                var subjecttypefiltervalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["subjecttypefilter"]);
                var casefilternotes = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casefilternotes"]);
                LawPracticeEntities db = new LawPracticeEntities();
                bool isRBI = LoggedInUser.FirmId.ToString().ToUpper() == (ConfigurationManager.AppSettings["RBICustomization"] ?? "").ToUpper();
                bool isPartnerOrUser = LoggedInUser.RoleId == 2 || LoggedInUser.RoleId == 3;
                var effectiveRoleId = (isRBI && isPartnerOrUser) ? 1 : LoggedInUser.RoleId;

                var queryUserId = LoggedInUser.UserId.ToString();
                if (isRBI && isPartnerOrUser)
                {
                    try
                    {
                        var adminUserId = db.FirmUsers
                            .Where(x => x.Firmid == LoggedInUser.FirmId && x.IsActive && x.IsFirmAdmin)
                            .Select(x => x.Id)
                            .FirstOrDefault();
                        if (adminUserId != Guid.Empty)
                        {
                            queryUserId = adminUserId.ToString();
                        }
                    }
                    catch
                    {
                    }
                }

                if (effectiveRoleId == 1)
                {
                    if (String.IsNullOrEmpty(searchuser))
                    {
                        var cases1 = Repository.Matter.loadnewarchivematterlist(LoggedInUser.FirmId.ToString(), queryUserId, pagenum, pagesize, odate, casename, clientname, court, cstatus, createdby, Convert.ToInt32(filtervalue), companynamefiltervalue, mattertypefiltervalue.ToString(), subjecttypefiltervalue.ToString(), casefilternotes);
                        var param = controllername + ">LoadNewArchiveMatterList>loadnewarchivematterlist>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId.ToString() + "@" + pagenum + "@" + pagesize + "@" + odate + "@" + casename + "@" + clientname + "@" + court + "@" + cstatus;
                        db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                        return Ok(cases1);
                    }
                    else
                    {
                        var cases1 = Repository.Matter.loadusernewarchivematterlist(LoggedInUser.FirmId.ToString(), searchuser, pagenum, pagesize, odate, casename, clientname, court, cstatus, 1, createdby, Convert.ToInt32(filtervalue), companynamefiltervalue, mattertypefiltervalue.ToString(), subjecttypefiltervalue.ToString(), casefilternotes);
                        var param = controllername + ">LoadNewArchiveMatterList>loadusernewarchivematterlist>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId.ToString() + "@" + pagenum + "@" + pagesize + "@" + odate + "@" + casename + "@" + clientname + "@" + court + "@" + cstatus;
                        db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                        return Ok(cases1);
                    }
                }
                else if (effectiveRoleId == 2)
                {
                    var cases1 = Repository.Matter.loadusernewarchivematterlist(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), pagenum, pagesize, odate, casename, clientname, court, cstatus, 2, createdby, Convert.ToInt32(filtervalue), companynamefiltervalue, mattertypefiltervalue.ToString(), subjecttypefiltervalue.ToString(), casefilternotes);
                    var param = controllername + ">LoadNewArchiveMatterList>loadusernewarchivematterlist>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId.ToString() + "@" + pagenum + "@" + pagesize + "@" + odate + "@" + casename + "@" + clientname + "@" + court + "@" + cstatus;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                    return Ok(cases1);
                }
                else
                {
                    return Ok("");
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
        /// <summary>
        /// Load notice link new case list
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadNoticeLinkNewCaseList()
        {
            try
            {
                var odate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["odate"]);
                var casename = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casename"]);
                var clientname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["clientname"]);
                var court = QueryAES.UrlDecode(HttpContext.Current.Request.Form["court"]);
                var cstatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["cstatus"]);
                var searchuser = QueryAES.UrlDecode(HttpContext.Current.Request.Form["users"]);
                int pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                int pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                var createdby = QueryAES.UrlDecode(HttpContext.Current.Request.Form["createdby"]);
                var filtervalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtervalue"]);
                //Add companyfilter
                var companynamefiltervalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["companyfilter"]);
                var mattertypefiltervalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["mattertypefilter"]);
                var subjecttypefiltervalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["subjecttypefilter"]);
                var casefilternotes = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casefilternotes"]);
                LawPracticeEntities db = new LawPracticeEntities();
                if (LoggedInUser.RoleId == 1)
                {
                    if (String.IsNullOrEmpty(searchuser))
                    {
                        var cases1 = Repository.Matter.loadNoticelinknewcaselist(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), pagenum, pagesize, odate, casename, clientname, court, cstatus, createdby, Convert.ToInt32(filtervalue), companynamefiltervalue, mattertypefiltervalue.ToString(), subjecttypefiltervalue.ToString(), casefilternotes);
                        var param = controllername + ">LoadNewCaseList>loadnewcaselist>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId.ToString() + "@" + pagenum + "@" + pagesize + "@" + odate + "@" + casename + "@" + clientname + "@" + court + "@" + cstatus;
                        db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                        return Ok(cases1);
                    }
                    else
                    {
                        var cases1 = Repository.Matter.loaduserNoticelinknewcaselist(LoggedInUser.FirmId.ToString(), searchuser, pagenum, pagesize, odate, casename, clientname, court, cstatus, 1, createdby, Convert.ToInt32(filtervalue), companynamefiltervalue, mattertypefiltervalue.ToString(), subjecttypefiltervalue.ToString(), casefilternotes);
                        var param = controllername + ">LoadNewCaseList>loadusernewcaselist>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId.ToString() + "@" + pagenum + "@" + pagesize + "@" + odate + "@" + casename + "@" + clientname + "@" + court + "@" + cstatus;
                        db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                        return Ok(cases1);
                    }
                }
                else if (LoggedInUser.RoleId == 2)
                {
                    var cases1 = Repository.Matter.loaduserNoticelinknewcaselist(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), pagenum, pagesize, odate, casename, clientname, court, cstatus, 2, createdby, Convert.ToInt32(filtervalue), companynamefiltervalue, mattertypefiltervalue.ToString(), subjecttypefiltervalue.ToString(), casefilternotes);
                    var param = controllername + ">LoadNewCaseList>loaduserNoticelinknewcaselist>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId.ToString() + "@" + pagenum + "@" + pagesize + "@" + odate + "@" + casename + "@" + clientname + "@" + court + "@" + cstatus;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                    return Ok(cases1);
                }
                else
                {
                    return Ok("");
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
        /// <summary>
        /// Remove cases
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveCase()
        {
            try
            {
                var remarks = QueryAES.UrlDecode(HttpContext.Current.Request.Form["remark"]);
                dynamic typeIds = QueryAES.UrlDecode(HttpContext.Current.Request.Form["typeIds"]);
                string dburl = "";
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var roleid = LoggedInUser.RoleId.ToString();
                var countmatter = Repository.FirmUsers.removematterlist(typeIds, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), apiUrl, remarks, roleid);
                var param = controllername + ">RemoveMatter>removematterlist>param=" + typeIds + "@" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString() + "@remark" + remarks;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(countmatter);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
        /// <summary>
        /// Archive cases
        /// </summary>
        /// <param name="typeIds"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ArchiveCase(string[] typeIds)
        {
            try
            {
                string dburl = "";
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var countmatter = Repository.FirmUsers.archivematterlist(typeIds, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), apiUrl);
                var param = controllername + ">ArchiveCase>archivematterlist>param=" + typeIds + "@" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(countmatter);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
        /// <summary>
        /// Get dashboard task list
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CaseDashboardCaseTaskList()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Caseid"]);
                try
                {
                    caseid = caseid.Replace(" ", "+");
                    caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
                }
                catch (Exception e)
                {
                }
                var pagenum = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]);
                var pagesize = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]);
                var datefilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["datefilter"]);
                var filtertask = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtertask"]);
                var filterclient = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filterclient"]);
                var filteruser = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filteruser"]);
                var assignby = QueryAES.UrlDecode(HttpContext.Current.Request.Form["assignby"]);
                var assignto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["assignto"]);
                var status = QueryAES.UrlDecode(HttpContext.Current.Request.Form["status"]);
                var filterduedate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filterduedate"]);
                var list = Repository.Matter.CaseDashboardTaskList(firmid, userid, caseid, Convert.ToInt32(pagenum), Convert.ToInt32(pagesize), datefilter, filtertask, filterclient, filteruser, assignby, assignto, status, filterduedate);
                var param = controllername + ">CaseDashboardCaseTaskList>CaseDashboardTaskList>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId.ToString() + "@" + pagenum + "@" + pagesize + "@" + datefilter + "@" + filtertask + "@" + filterclient + "@" + filteruser + "@" + filterduedate;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(list);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }
        /// <summary>
        /// Dashboard Case Comm unique List
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CaseDashboardCaseCommuniqueList()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Caseid"]);
                try
                {
                    caseid = caseid.Replace(" ", "+");
                    caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
                }
                catch (Exception e)
                {
                }
                var pagenum = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]);
                var pagesize = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]);
                var filtertype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtertype"]);
                var filtercreatedby = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtercreatedby"]);
                var filteralertto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filteralertto"]);
                var berieffilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["berieffilter"]);
                var searchfrom = QueryAES.UrlDecode(HttpContext.Current.Request.Form["searchfrom"]);
                var searchto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["searchto"]);
                var cases1 = Repository.Matter.CaseDashboardCaseCommuniqueList(firmid, userid, caseid, Convert.ToInt32(pagenum), Convert.ToInt32(pagesize), filtertype, filtercreatedby, berieffilter, searchfrom, searchto, filteralertto);
                var param = controllername + ">CaseDashboardCaseCommuniqueList>CaseDashboardCaseCommuniqueList>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId.ToString() + "@" + pagenum + "@" + pagesize + "@" + filtertype + "@" + filtercreatedby + "@" + berieffilter + "@" + filteralertto;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(cases1);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }
        /// <summary>
        /// Get basic case details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CaseBasicDetails()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Caseid"]);
                try
                {
                    caseid = caseid.Replace(" ", "+");
                    caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
                }
                catch (Exception e)
                {
                }
                var list = Repository.Matter.CaseBasicDetails(firmid, userid, caseid);
                var param = controllername + ">CaseBasicDetails>CaseBasicDetails>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId.ToString() + "@" + caseid;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(list);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Get External case contact
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CaseExternalContact()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var pagenum = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]);
                var pagesize = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]);
                var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Caseid"]);
                try
                {
                    caseid = caseid.Replace(" ", "+");
                    caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
                }
                catch (Exception e)
                {
                }
                var list = Repository.Matter.CaseExternalContact(firmid, userid, caseid, Convert.ToInt32(pagenum), Convert.ToInt32(pagesize));
                var param = controllername + ">CaseExternalContact>CaseExternalContact>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId.ToString() + "@" + caseid + "@" + pagenum + "@" + pagesize;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(list);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }
        /// <summary>
        /// Load status case
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadStatuteCase()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Caseid"]);
                var id = QueryAES.UrlDecode(HttpContext.Current.Request.Form["id"]);
                try
                {
                    caseid = caseid.Replace(" ", "+");
                    caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
                }
                catch (Exception e)
                {
                }
                List<usp_GetStatuteCase_Result> list = new List<usp_GetStatuteCase_Result>();
                list = db.usp_GetStatuteCase(Convert.ToString(firmid), Convert.ToString(userid), Convert.ToString(caseid), id).ToList();
                var param = controllername + ">Caselist>EditCase>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId.ToString() + "@" + caseid;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(list);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }
        /// <summary>
        /// Update case status detail
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult UpdateStatuteCase()
        {
            var db = new LawPracticeEntities();
            using (var transaction = db.Database.BeginTransaction())
            {
                try
                {
                    var firmid = LoggedInUser.FirmId.ToString();
                    var userid = LoggedInUser.UserId.ToString();
                    var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseid"]);
                    var id = QueryAES.UrlDecode(HttpContext.Current.Request.Form["id"]);
                    var statutename = QueryAES.UrlDecode(HttpContext.Current.Request.Form["statutename"]);
                    var limitdate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["limitdate"]);
                    var statuteuser = QueryAES.UrlDecode(HttpContext.Current.Request.Form["statuteuser"]);
                    var statutedays = QueryAES.UrlDecode(HttpContext.Current.Request.Form["statutedays"]);
                    var datesatisfied = QueryAES.UrlDecode(HttpContext.Current.Request.Form["datesatisfied"]);
                    try
                    {
                        caseid = caseid.Replace(" ", "+");
                        caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
                    }
                    catch (Exception er)
                    {
                    }
                    int roweffected = 0;
                    roweffected = db.usp_UpdateStatuteCase(firmid, userid, caseid, id, statutename, limitdate, statuteuser, Convert.ToInt32(statutedays), Convert.ToInt32(datesatisfied));
                    if (roweffected > 0)
                    {
                        transaction.Commit();
                        return Ok("Success");
                    }
                    else
                    {
                        transaction.Rollback();
                        return Ok("error");
                    }
                }
                catch (Exception ex)
                {
                    return Ok("error");
                }
            }
        }
        /// <summary>
        /// Remove case status
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveStatuteCase()
        {
            var db = new LawPracticeEntities();
            using (var transaction = db.Database.BeginTransaction())
            {
                try
                {
                    var firmid = LoggedInUser.FirmId.ToString();
                    var userid = LoggedInUser.UserId.ToString();
                    var id = QueryAES.UrlDecode(HttpContext.Current.Request.Form["id"]);
                    int roweffected = 0;
                    roweffected = db.usp_DeleteStatuteCase(id);
                    if (roweffected > 0)
                    {
                        transaction.Commit();
                        return Ok("Success");
                    }
                    else
                    {
                        transaction.Rollback();
                        return Ok("error");
                    }
                }
                catch (Exception ex)
                {
                    return Ok("error");
                }
            }
        }
        /// <summary>
        /// Check user case map case status master
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CheckUserCasesMapCaseStatusMaster()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Caseid"]);
                try
                {
                    caseid = caseid.Replace(" ", "+");
                    caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
                }
                catch (Exception e)
                {
                }
                int usercaseid = 0; string status = "";
                var list = db.usp_CheckUserCasesMapCaseStatusMaster(firmid, caseid, usercaseid).ToList();
                foreach (var datas in list.ToList())
                {
                    status = Convert.ToString(datas);
                }
                return Ok(status);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }
        /// <summary>
        /// Update full screen case details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult UpdateFullScreenSaveCase()
        {
            var myList = new List<string>();
            dynamic postedFiledata = "";
            var db = new LawPracticeEntities();
            try
            {


                var compdep = "";
                var compadVocateName = "";
                try
                {
                    compdep = QueryAES.UrlDecode(HttpContext.Current.Request.Form["compdep"]);
                    compadVocateName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["compadVocateName"]);
                }
                catch
                {

                }
                string dcaseid = "";

                dcaseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseid"]);
                try
                {
                    dcaseid = dcaseid.Replace(" ", "+");
                    dcaseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(dcaseid));
                }
                catch { }
                var caseid = dcaseid;
                var usertypes = QueryAES.UrlDecode(HttpContext.Current.Request.Form["usertypes"]);
                var clientid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["clientname"]);
                var casename1 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casename"]);
                var casename = "";
                if (casename1 != "")
                {
                    casename = casename1.Replace("&amp;", "&");
                }
                var casetype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fcasecasetype"]);
                var caseclientcontact = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fcaseclientcontact"]);
                var casedetails = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fcasedetails"]);
                var casenotes = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fcasenotes"]);
                var court = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fcourt"]);
                var othercourt = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fothercourt"]);
                var casestatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fcasestatus"]);
                var fdisposedoption = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fdisposedoption"]);
                var caseodate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fcaseodate"]);
                var casenumber = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fcasenumber"]);
                var casecdate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fcasecdate"]);
                var caseteamlead = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fcaseteamlead"]);
                var casecnr = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fcasecnr"]);
                var username = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fcasesideuserid"]);
                var casesidepassword = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fcasesidepassword"]);
                var clientto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["clientto"]);
                var assignto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["assignto"]);
                var checkclient = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fcheckclient"]);
                var sollist = QueryAES.UrlDecode(HttpContext.Current.Request.Form["itemlistdata"]);
                var clientno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["clientno"]);
                string MatterType, PoliceStation, Firno, CertifiedCopyAppliedon, CertifiedCopyReceivedon, ValuationofSuit, Courtfee;
                string OppositePartyCounselname, OppositePartyCounselemail, OppositePartyCounselphone, CasenumberInternal;
                string IsCourtFeePaid, SubjectType;
                string fmatterType, txtMatterOther, DisputeMatterType;
                fmatterType = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fmatterType"]);
                if (fmatterType == "null")
                {
                    fmatterType = "";
                }
                if (casestatus == "null")
                {
                    casestatus = "";
                }
                txtMatterOther = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtMatterOther"]);
                DisputeMatterType = QueryAES.UrlDecode(HttpContext.Current.Request.Form["DisputeMatterType"]);
                MatterType = QueryAES.UrlDecode(HttpContext.Current.Request.Form["MatterType"]);
                PoliceStation = QueryAES.UrlDecode(HttpContext.Current.Request.Form["PoliceStation"]);
                Firno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Firno"]);
                CertifiedCopyAppliedon = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CertifiedCopyAppliedon"]);
                CertifiedCopyReceivedon = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CertifiedCopyReceivedon"]);
                ValuationofSuit = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ValuationofSuit"]);
                Courtfee = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Courtfee"]);
                OppositePartyCounselname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["OppositePartyCounselname"]);
                OppositePartyCounselemail = QueryAES.UrlDecode(HttpContext.Current.Request.Form["OppositePartyCounselemail"]);
                OppositePartyCounselphone = QueryAES.UrlDecode(HttpContext.Current.Request.Form["OppositePartyCounselphone"]);
                CasenumberInternal = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CasenumberInternal"]);
                IsCourtFeePaid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["IsCourtFeePaid"]);
                SubjectType = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SubjectType"]);
                //validate casename exist
                var NotesCasedetail = "";
                if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["casedetails"]) != "" || QueryAES.UrlDecode(HttpContext.Current.Request.Form["casedetails"]) != null)
                {
                    NotesCasedetail = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casedetails"]).ToString();
                }
                var chkcase = db.usp_checkcasenameexist(LoggedInUser.FirmId.ToString(), casename.TrimEnd().TrimStart(), caseid, LoggedInUser.UserId.ToString()).FirstOrDefault();
                if (chkcase == 1)
                {
                    return Ok("Already exist matter name. please try another matter name");
                }
                //extra party information
                var firstfilingdate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casefilingcdate"]);
                DateTime casefilingcdate = Convert.ToDateTime("1900-01-01");
                if (!string.IsNullOrEmpty(firstfilingdate))
                {
                    casefilingcdate = Convert.ToDateTime(firstfilingdate);
                }
                DateTime submitDate = DateTime.Now;// Convert.ToDateTime(QueryAES.UrlDecode(HttpContext.Current.Request.Form["submitDate"]);
                DateTime returnDate = DateTime.Now;//Convert.ToDateTime(QueryAES.UrlDecode(HttpContext.Current.Request.Form["returnDate"]);
                var ePartyName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ePartyName"]);
                var ePartyFatherName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ePartyFatherName"]);
                var ePartyAddress = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ePartyAddress"]);
                var ePartyAdharCardNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ePartyAdharCardNo"]);
                var ePartyGender = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ePartyGender"]);
                var ePartyDateOfBirth = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ePartyDateOfBirth"]);
                var ePartyEmail = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ePartyEmail"]);
                var ePartyNationality = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ePartyNationality"]);
                var ePartyMobileNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ePartyMobileNo"]);
                int ftype = Convert.ToInt32(Request.Headers.GetValues("ftype").FirstOrDefault());
                int sum = Convert.ToInt32(Request.Headers.GetValues("sum").FirstOrDefault());
                //var ctxt1 = Convert.ToString(Request.Headers.GetValues("ctxt1").FirstOrDefault());
                //var ctxt2 = Convert.ToString(Request.Headers.GetValues("ctxt2").FirstOrDefault());
                //var ctxt3 = Convert.ToString(Request.Headers.GetValues("ctxt3").FirstOrDefault());
                //var ctxt4 = Convert.ToString(Request.Headers.GetValues("ctxt4").FirstOrDefault());
                //var ctxt5 = Convert.ToString(Request.Headers.GetValues("ctxt5").FirstOrDefault());
                //var ctxt6 = Convert.ToString(Request.Headers.GetValues("ctxt6").FirstOrDefault());
                //var ctxt7 = Convert.ToString(Request.Headers.GetValues("ctxt7").FirstOrDefault());
                //var ctxt8 = Convert.ToString(Request.Headers.GetValues("ctxt8").FirstOrDefault());
                //var ctxt9 = Convert.ToString(Request.Headers.GetValues("ctxt9").FirstOrDefault());
                //var ctxt10 = Convert.ToString(Request.Headers.GetValues("ctxt10").FirstOrDefault());
                //var ctxt11 = Convert.ToString(Request.Headers.GetValues("ctxt11").FirstOrDefault());
                //var ctxt12 = Convert.ToString(Request.Headers.GetValues("ctxt12").FirstOrDefault());
                //var ctxt13 = Convert.ToString(Request.Headers.GetValues("ctxt13").FirstOrDefault());
                //var ctxt14 = Convert.ToString(Request.Headers.GetValues("ctxt14").FirstOrDefault());
                //var ctxt15 = Convert.ToString(Request.Headers.GetValues("ctxt15").FirstOrDefault());
                var ctxt1 = Convert.ToString(Request.Headers.GetValues("ctxt1")?.FirstOrDefault()) ?? "";
                var ctxt2 = Convert.ToString(Request.Headers.GetValues("ctxt2")?.FirstOrDefault()) ?? "";
                var ctxt3 = Convert.ToString(Request.Headers.GetValues("ctxt3")?.FirstOrDefault()) ?? "";
                var ctxt4 = Convert.ToString(Request.Headers.GetValues("ctxt4")?.FirstOrDefault()) ?? "";
                var ctxt5 = Convert.ToString(Request.Headers.GetValues("ctxt5")?.FirstOrDefault()) ?? "";
                var ctxt6 = Convert.ToString(Request.Headers.GetValues("ctxt6")?.FirstOrDefault()) ?? "";
                var ctxt7 = Convert.ToString(Request.Headers.GetValues("ctxt7")?.FirstOrDefault()) ?? "";
                var ctxt8 = Convert.ToString(Request.Headers.GetValues("ctxt8")?.FirstOrDefault()) ?? "";
                var ctxt9 = Convert.ToString(Request.Headers.GetValues("ctxt9")?.FirstOrDefault()) ?? "";
                var ctxt10 = Convert.ToString(Request.Headers.GetValues("ctxt10")?.FirstOrDefault()) ?? "";
                var ctxt11 = Convert.ToString(Request.Headers.GetValues("ctxt11")?.FirstOrDefault()) ?? "";
                var ctxt12 = Convert.ToString(Request.Headers.GetValues("ctxt12")?.FirstOrDefault()) ?? "";
                var ctxt13 = Convert.ToString(Request.Headers.GetValues("ctxt13")?.FirstOrDefault()) ?? "";
                var ctxt14 = Convert.ToString(Request.Headers.GetValues("ctxt14")?.FirstOrDefault()) ?? "";
                var ctxt15 = Convert.ToString(Request.Headers.GetValues("ctxt15")?.FirstOrDefault()) ?? "";
                var mcol1 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col1"]);
                var mcol2 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col2"]);
                var mcol3 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col3"]);
                var mcol4 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col4"]);
                var mcol5 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col5"]);
                var mcol6 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col6"]);
                var mcol7 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col7"]);
                var mcol8 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col8"]);
                var mcol9 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col9"]);
                var mcol10 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col10"]);
                var mcol11 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col11"]);
                var mcol12 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col12"]);
                var mcol13 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col13"]);
                var mcol14 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col14"]);
                var mcol15 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["col15"]);
                if (mcol1 == "undefined")
                {
                    mcol1 = null;
                }
                else if (mcol1 != null)
                {
                    mcol1 = mcol1.Replace("&amp;", "&");
                }
                if (mcol2 == "undefined")
                {
                    mcol2 = null;
                }
                else if (mcol2 != null)
                {
                    mcol2 = mcol2.Replace("&amp;", "&");
                }
                if (mcol3 == "undefined")
                {
                    mcol3 = null;
                }
                else if (mcol3 != null)
                {
                    mcol3 = mcol3.Replace("&amp;", "&");
                }
                if (mcol4 == "undefined")
                {
                    mcol4 = null;
                }
                else if (mcol4 != null)
                {
                    mcol4 = mcol4.Replace("&amp;", "&");
                }
                if (mcol5 == "undefined")
                {
                    mcol5 = null;
                }
                else if (mcol5 != null)
                {
                    mcol5 = mcol5.Replace("&amp;", "&");
                }
                if (mcol6 == "undefined")
                {
                    mcol6 = null;
                }
                else if (mcol6 != null)
                {
                    mcol6 = mcol6.Replace("&amp;", "&");
                }
                if (mcol7 == "undefined")
                {
                    mcol7 = null;
                }
                else if (mcol7 != null)
                {
                    mcol7 = mcol7.Replace("&amp;", "&");
                }
                if (mcol8 == "undefined")
                {
                    mcol8 = null;
                }
                else if (mcol8 != null)
                {
                    mcol8 = mcol8.Replace("&amp;", "&");
                }
                if (mcol9 == "undefined")
                {
                    mcol9 = null;
                }
                else if (mcol9 != null)
                {
                    mcol9 = mcol9.Replace("&amp;", "&");
                }
                if (mcol10 == "undefined")
                {
                    mcol10 = null;
                }
                else if (mcol10 != null)
                {
                    mcol10 = mcol10.Replace("&amp;", "&");
                }
                if (mcol11 == "undefined")
                {
                    mcol11 = null;
                }
                else if (mcol11 != null)
                {
                    mcol11 = mcol11.Replace("&amp;", "&");
                }
                if (mcol12 == "undefined")
                {
                    mcol12 = null;
                }
                else if (mcol12 != null)
                {
                    mcol12 = mcol12.Replace("&amp;", "&");
                }
                if (mcol13 == "undefined")
                {
                    mcol13 = null;
                }
                else if (mcol13 != null)
                {
                    mcol13 = mcol13.Replace("&amp;", "&");
                }
                if (mcol14 == "undefined")
                {
                    mcol14 = null;
                }
                else if (mcol14 != null)
                {
                    mcol14 = mcol14.Replace("&amp;", "&");
                }
                if (mcol15 == "undefined")
                {
                    mcol15 = null;
                }
                else if (mcol15 != null)
                {
                    mcol15 = mcol15.Replace("&amp;", "&");
                }
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var files = "";
                //check userid if exist
                if (!string.IsNullOrEmpty(username))
                {
                    var checkuser = db.ValidateUserName(username).FirstOrDefault();
                    if (checkuser != null)
                    {
                        return Ok("Already Exists User Please Try Another User Name!");
                    }
                }
                //upload files in azure server
                var httpRequest = HttpContext.Current.Request;
                files = postedFiledata;
                string useremail = "";
                string usermobile = "";
                var flag = 0;
                AddCaseObject1 addcase = new AddCaseObject1();
                var getuseremil = db.usp_GetEmailByUserId(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).FirstOrDefault();
                if (getuseremil.cmobile != null)
                {
                    usermobile = getuseremil.cmobile;
                }
                if (getuseremil.EmailId != null)
                {
                    useremail = getuseremil.EmailId;
                }
                //For Other Party Deatails
                var otherpartyFname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["otherpartyFname"]);
                var otherpartyEMail = QueryAES.UrlDecode(HttpContext.Current.Request.Form["otherpartyEMail"]);
                var otherpartyPhone = QueryAES.UrlDecode(HttpContext.Current.Request.Form["otherpartyPhone"]);
                var otherpartyType = QueryAES.UrlDecode(HttpContext.Current.Request.Form["otherpartyType"]);
                var otherpartyId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["otherpartyId"]);
                addcase.Username = WebConfigurationManager.AppSettings["matteridname"] + LoggedInUser.UserId.ToString();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var countdata = Repository.Matter.UpdateFullScreenCase(caseid, firmid, userid, usertypes, clientid, casename, casetype, caseclientcontact, casedetails,
                    casenotes, court, othercourt, casestatus, caseodate, casenumber, casecdate, caseteamlead, casecnr, username, casesidepassword, clientto, assignto,
                    sollist, checkclient, files, sum, ctxt1, ctxt2, ctxt3, ctxt4, ctxt5, ctxt6, ctxt7, ctxt8, ctxt9, ctxt10, ctxt11, ctxt12, ctxt13, ctxt14, ctxt15,
                    mcol1, mcol2, mcol3, mcol4, mcol5, mcol6, mcol7, mcol8, mcol9, mcol10, mcol11, mcol12, mcol13, mcol14, mcol15, ftype.ToString(), "", "", "", "", "",
                    addcase, flag, useremail, usermobile, apiUrl, clientno, MatterType, PoliceStation, Firno, CertifiedCopyAppliedon, CertifiedCopyReceivedon,
                    ValuationofSuit, Courtfee, OppositePartyCounselname, OppositePartyCounselemail, OppositePartyCounselphone, CasenumberInternal,
                    IsCourtFeePaid, SubjectType, casefilingcdate, submitDate.Date, returnDate.Date, ePartyName, ePartyFatherName, ePartyAddress, ePartyAdharCardNo, ePartyGender,
                   ePartyDateOfBirth, ePartyNationality, ePartyMobileNo, ePartyEmail, LoggedInUser.RoleId.ToString(), fmatterType, txtMatterOther,
                   DisputeMatterType, fdisposedoption, NotesCasedetail, otherpartyFname, otherpartyEMail, otherpartyPhone, otherpartyType, otherpartyId);
                var newcasefolderid = "";
                try
                {
                    //Start Pmrda Customisation for update 
                    string pmrdaFirmId = System.Configuration.ConfigurationManager.AppSettings["IPRDACustomization"];
                    if (pmrdaFirmId.ToLower() == firmid.ToLower())
                    {
                        var status = DataAccessADO.SavePmrdaMatterAdvAndDepDetails(Convert.ToString(caseid), compdep, compadVocateName);

                    }
                    //End Pmrda customisation for update 
                    int pageid = 0;
                    var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("caselist")).FirstOrDefault();
                    if (pagelist != null)
                    {
                        pageid = Convert.ToInt32(pagelist.ParentPage);
                    }
                    string id = "";
                    ObjectParameter IDParameter;
                    IDParameter = new ObjectParameter("iid", id);
                    //for assign user
                    if (!String.IsNullOrEmpty(assignto))
                    {
                        string[] values = assignto.Split(',');
                        for (int i = 0; i < values.Length; i++)
                        {
                            values[i] = values[i].Trim();
                            var checkroles = db.usp_GetUserbyId(firmid, values[i]).FirstOrDefault();
                            if (checkroles != null)
                            {
                                if (checkroles.roleid != 1)
                                {
                                    var roweffected2 = db.usp_SaveUserDefaultCaseRights(firmid, userid, values[i], caseid, pageid);
                                    //for partner
                                    if (!String.IsNullOrEmpty(checkroles.PartnerId))
                                    {
                                        var roweffected4 = db.usp_SaveUserDefaultCaseRights(firmid, userid, checkroles.PartnerId, caseid, pageid);
                                    }
                                }
                            }
                        }
                        if (LoggedInUser.RoleId != 1)
                        {
                            //for creator
                            var checkroles = db.usp_GetUserbyId(firmid, userid).FirstOrDefault();
                            if (checkroles != null)
                            {
                                var roweffected2 = db.usp_SaveUserDefaultCaseRights(firmid, userid, userid, caseid, pageid);
                                //for partner
                                if (!String.IsNullOrEmpty(checkroles.PartnerId))
                                {
                                    var roweffected4 = db.usp_SaveUserDefaultCaseRights(firmid, userid, checkroles.PartnerId, caseid, pageid);
                                }
                            }
                        }
                    }
                }
                catch { }
                try
                {
                    int pageid = 0;
                    var pagelist = db.usp_GetDocRightsPageDatabyPagelink(Convert.ToString("Case Documents")).FirstOrDefault();
                    if (pagelist != null)
                    {
                        pageid = Convert.ToInt32(pagelist.Id);
                    }
                    string id = "";
                    ObjectParameter IDParameter;
                    IDParameter = new ObjectParameter("iid", id);
                    //for assign user
                    if (!String.IsNullOrEmpty(assignto))
                    {
                        string[] values = assignto.Split(',');
                        for (int i = 0; i < values.Length; i++)
                        {
                            values[i] = values[i].Trim();
                            var checkroles = db.usp_GetUserbyId(firmid, values[i]).FirstOrDefault();
                            if (checkroles != null)
                            {
                                if (checkroles.roleid != 1)
                                {
                                    var roweffected2 = db.usp_SaveUserDefaultCaseRights(firmid, userid, values[i], caseid, pageid);
                                    //for partner
                                    if (!String.IsNullOrEmpty(checkroles.PartnerId))
                                    {
                                        var roweffected4 = db.usp_SaveUserDefaultCaseRights(firmid, userid, checkroles.PartnerId, caseid, pageid);
                                    }
                                }
                            }
                        }
                        if (LoggedInUser.RoleId != 1)
                        {
                            //for creator
                            var checkroles = db.usp_GetUserbyId(firmid, userid).FirstOrDefault();
                            if (checkroles != null)
                            {
                                var roweffected2 = db.usp_SaveUserDefaultCaseRights(firmid, userid, userid, caseid, pageid);
                                //for partner
                                if (!String.IsNullOrEmpty(checkroles.PartnerId))
                                {
                                    var roweffected4 = db.usp_SaveUserDefaultCaseRights(firmid, userid, checkroles.PartnerId, caseid, pageid);
                                }
                            }
                        }
                    }
                }
                catch
                {
                }
                try
                {
                    int maxFileSize = 2;
                    var id = "";
                    if (httpRequest.Files.Count > 0)
                    {
                        if (Convert.ToInt32(countdata) == 1)
                        {
                            //update docs in document mgmt
                            var dpaths = "";
                            if (!String.IsNullOrEmpty(caseid))
                            {
                                var dname = db1.usp_getcasename(LoggedInUser.FirmId.ToString(), caseid).FirstOrDefault();
                                if (dname == null)
                                {
                                    dname = "DefaultCase";
                                }
                                var directoryid = "00000000-0000-0000-0000-000000000000";
                                var checkexistcasefolder = db1.usp_checkcasefolderid(LoggedInUser.FirmId.ToString(), caseid).FirstOrDefault();
                                if (checkexistcasefolder != null)
                                {
                                    newcasefolderid = checkexistcasefolder.Id.ToString();
                                    dpaths = "WorkSpace/" + LoggedInUser.FirmId + "/" + caseid;
                                }
                                else
                                {
                                    dpaths = "WorkSpace/" + LoggedInUser.FirmId + "/" + caseid;
                                    AzureDocument.creatroot(LoggedInUser.FirmId.ToString(), caseid);
                                    var createdirectorydata = AzureDocument.createfolder(dpaths, null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                                    ObjectParameter IDParameter;
                                    IDParameter = new ObjectParameter("id", id);
                                    var data = db1.usp_SaveFilefolderCloudNew(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), dname.TrimStart().TrimEnd(), dpaths, 0, directoryid.ToString(), null, null, null, IDParameter, caseid, null, 0, "1", null, null);
                                    newcasefolderid = Convert.ToString(IDParameter.Value);
                                }
                                var dpath = dpaths.TrimEnd('/');
                                var newfilename = "";
                                var newfilenames = "";
                                string AzureStorageName = WebConfigurationManager.AppSettings["AzureStorageName"];
                                string AzureStorageKey = WebConfigurationManager.AppSettings["AzureStorageKey"];
                                string azureroot = "mykase";
                                string azuredir = "WorkSpace";
                                string fakepathin = "azuredirin/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                                string fakepathout = "azuredirout/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                                var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
                                var account = new CloudStorageAccount(cred, true);
                                var client = account.CreateCloudFileClient();
                                if (httpRequest.Files.Count > 0)
                                {
                                    var docfiles = new List<string>();
                                    //Check whether Directory (Folder) exists.
                                    for (int i = 0; i < httpRequest.Files.Count; i++)
                                    {
                                        var postedFile = httpRequest.Files[i];
                                        //encrypt file
                                        string input = HttpContext.Current.Server.MapPath("~/" + fakepathin);
                                        if (!(Directory.Exists(input)))
                                        {
                                            Directory.CreateDirectory(input);
                                        }
                                        if (!(Directory.Exists(HttpContext.Current.Server.MapPath("~/" + fakepathout))))
                                        {
                                            Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/" + fakepathout));
                                        }
                                        var fileextchk = Path.GetExtension(postedFile.FileName);
                                        var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);
                                        postedFile.SaveAs(input + "\\" + postedFile.FileName);
                                        //for start elastic
                                        string strfilepath = input + "\\" + postedFile.FileName;
                                        int fileSize = postedFile.ContentLength;
                                        var directory = Path.GetDirectoryName(strfilepath);
                                        string strfileName = Path.GetFileName(strfilepath);
                                        string mimeType = MimeMapping.GetMimeMapping(strfileName);
                                        var base64File = Convert.ToBase64String(System.IO.File.ReadAllBytes(Path.Combine(directory, strfileName)));
                                        //end elastic
                                        input = input + "\\" + postedFile.FileName;
                                        string output = HttpContext.Current.Server.MapPath("~/" + fakepathout + "/" + postedFile.FileName);
                                        QueryAES.FileEncrypt(input, output);
                                        //delete file
                                        try
                                        {
                                            System.IO.File.Delete(input);
                                        }
                                        catch (Exception ex)
                                        {
                                        }
                                        //rename file exist
                                        int it = 0;
                                        var fileName = postedFile.FileName;
                                        var origininalfilename = fileName;
                                        var orfileNameOnly = fileName.Remove(fileName.LastIndexOf('.') + 1).TrimEnd('.');
                                        var extension = fileName.Split('.').Last();
                                        while (AzureDocument.fileexist(dpath, origininalfilename, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()))
                                        {
                                            it += 1;
                                            origininalfilename = string.Format("{0}({1}).{2}", orfileNameOnly, it, extension);
                                        }
                                        CloudStorageAccount storageAccount = new CloudStorageAccount(cred, true);
                                        // Create a reference to the file client.
                                        CloudFileClient fileClient = storageAccount.CreateCloudFileClient();
                                        var share = client.GetShareReference(azureroot);
                                        // Create a reference to the Azure path
                                        var cloudFileDirectory = share.GetRootDirectoryReference().GetDirectoryReference(dpath);
                                        cloudFileDirectory.CreateIfNotExists();
                                        //Create a reference to the filename that you will be uploading
                                        CloudFile cloudFile = cloudFileDirectory.GetFileReference(origininalfilename);
                                        var fileext = Path.GetExtension(origininalfilename);
                                        //Open a stream from a local file.
                                        //Upload the file to Azure.
                                        if (cloudFile.Exists())
                                        {
                                            return Ok("exist");
                                        }
                                        else
                                        {
                                            cloudFile.UploadFromFile(output);
                                        }
                                        try
                                        {
                                            System.IO.File.Delete(output);
                                        }
                                        catch (Exception ex)
                                        {
                                        }
                                        ObjectParameter IDParameter1;
                                        IDParameter1 = new ObjectParameter("id", id);
                                        var data1 = db1.usp_SaveFilefolderCloudNew(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), origininalfilename, dpath, 1, newcasefolderid.ToString(), null, fileext, null, IDParameter1, null, null, 0, "1", null, null);
                                        id = Convert.ToString(IDParameter1.Value);
                                        //if size is lessthan or equal to 2 mb thwn proceed
                                        if (fileSize <= ((maxFileSize * 1024) * 1024))
                                        {
                                            //insert doc to elastic
                                            try
                                            {
                                                var result = AzureDocument.insertdoctoelastic(id, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), base64File, origininalfilename, origininalfilename, mimeType, dpath);
                                                if (result == true)
                                                {
                                                    //update index value of data
                                                    var cts = db1.usp_updateFileindexvalue(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), id, 1);
                                                }
                                                else
                                                {
                                                }
                                            }
                                            catch
                                            {
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                }
                var param = controllername + ">UpdateFullScreenSaveCase>UpdateFullScreenCase>param=" + firmid + "@" + userid + "@" + usertypes + "@" + clientid + "@" + casename + "@" + casetype + "@" + caseclientcontact + "@" + casedetails + "@" + casenotes + "@" + court + "@" + othercourt + "@" + casestatus + "@" + caseodate + "@" + casenumber + "@" + casecdate + "@" + caseteamlead + "@" + casecnr + "@" + username + "@" + casesidepassword + "@" + clientto + "@" + assignto + "@" + sollist + "@" + checkclient + "@" + files + "@" + sum + "@" + ctxt1 + "@" + ctxt2 + "@" + ctxt3 + "@" + ctxt4 + "@" + ctxt5 + "@" + ctxt6 + "@" + ctxt7 + "@" + ctxt8 + "@" + ctxt9 + "@" + ctxt10 + "@" + ctxt11 + "@" + ctxt12 + "@" + ctxt13 + "@" + ctxt14 + "@" + ctxt15 + "@" + mcol1 + "@" + mcol2 + "@" + mcol3 + "@" + mcol4 + "@" + mcol5 + "@" + mcol6 + "@" + mcol7 + "@" + mcol8 + "@" + mcol9 + "@" + mcol10 + "@" + mcol11 + "@" + mcol12 + "@" + mcol13 + "@" + mcol14 + "@" + mcol15 + "@" + ftype.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(countdata);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }
        /// <summary>
        /// Get dashboard case docs
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CaseDashboardCasedocs()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Caseid"]);
                try
                {
                    caseid = caseid.Replace(" ", "+");
                    caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
                }
                catch (Exception e)
                {
                }
                var pagenum = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]);
                var pagesize = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]);
                var cases1 = Repository.Matter.CaseDashboardCasedocs(firmid, userid, caseid, Convert.ToInt32(pagenum), Convert.ToInt32(pagesize));
                var param = controllername + ">CaseDashboardCasedocs>CaseDashboardCasedocs>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId.ToString() + "@" + pagenum + "@" + pagesize;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(cases1);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Edit basic case details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult EditCaseBasicDetails()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Caseid"]);
                try
                {
                    caseid = caseid.Replace(" ", "+");
                    caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
                }
                catch (Exception e)
                {
                }
                var list = Repository.Matter.EditCaseBasicDetails(firmid, userid, caseid);
                var param = controllername + ">EditCaseBasicDetails>EditCaseBasicDetails>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId.ToString() + "@" + caseid;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(list);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }
        /// <summary>
        /// Get client case list
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadClientNewCaseList()
        {
            try
            {
                var odate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["odate"]);
                var casename = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casename"]);
                var clientname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["clientname"]);
                var court = QueryAES.UrlDecode(HttpContext.Current.Request.Form["court"]);
                var cstatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["cstatus"]);
                var searchuser = QueryAES.UrlDecode(HttpContext.Current.Request.Form["users"]);
                int pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                int pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                var clientid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["token"]);
                try
                {
                    clientid = clientid.Replace(" ", "+");
                    clientid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(clientid));
                }
                catch
                {
                }
                LawPracticeEntities db = new LawPracticeEntities();
                if (searchuser == "" || searchuser == "null" || searchuser == null)
                {
                    var cases1 = Repository.Matter.loadclientnewcaselist(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), pagenum, pagesize, odate, casename, clientname, court, cstatus, clientid);
                    var param = controllername + ">LoadNewCaseList>loadnewcaselist>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId.ToString() + "@" + pagenum + "@" + pagesize + "@" + odate + "@" + casename + "@" + clientname + "@" + court + "@" + cstatus + "@" + clientid;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                    return Ok(cases1);
                }
                else
                {
                    var cases1 = Repository.Matter.loadclientnewcaselist(LoggedInUser.FirmId.ToString(), searchuser, pagenum, pagesize, odate, casename, clientname, court, cstatus, clientid);
                    var param = controllername + ">LoadNewCaseList>loadnewcaselist>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId.ToString() + "@" + pagenum + "@" + pagesize + "@" + odate + "@" + casename + "@" + clientname + "@" + court + "@" + cstatus + "@" + clientid;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                    return Ok(cases1);
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
        /// <summary>
        /// Get client communication list
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ClientCommunicationList()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Caseid"]);
                try
                {
                    caseid = caseid.Replace(" ", "+");
                    caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
                }
                catch (Exception e)
                {
                }
                var pagenum = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]);
                var pagesize = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]);
                var filtertype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtertype"]);
                var filtercreatedby = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtercreatedby"]);
                var berieffilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["berieffilter"]);
                var cases1 = Repository.Matter.ClientCommuniqueList(firmid, userid, caseid, Convert.ToInt32(pagenum), Convert.ToInt32(pagesize), filtertype, filtercreatedby, berieffilter);
                var param = controllername + ">ClientCommuniqueList>ClientCommuniqueList>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId.ToString() + "@" + pagenum + "@" + pagesize + "@" + filtertype + "@" + filtercreatedby + "@" + berieffilter;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(cases1);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }
        /// <summary>
        /// Case chart count
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CaseChartCount()
        {
            string chartdata = "";
            try
            {
                LawPracticeEntities db = new LawPracticeEntities();
                var casedata = db.usp_GetCaseChartCount(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).ToList();
                return Ok(casedata);
            }
            catch (Exception ex)
            {
                return Ok(chartdata);
            }
        }
        /// <summary>
        /// Case type chart count
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CaseTypeChartCount()
        {
            string chartdata = "";
            try
            {
                LawPracticeEntities db = new LawPracticeEntities();
                var casedata = db.usp_GetCaseTypeChartCount(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).ToList();
                return Ok(casedata);
            }
            catch (Exception ex)
            {
                return Ok(chartdata);
            }
        }
        /// <summary>
        /// Case status chart count
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CaseStatusChartCount()
        {
            string chartdata = "";
            var filterid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtervalue"]);
            try
            {
                LawPracticeEntities db = new LawPracticeEntities();
                var casedata = db.usp_GetCaseStatusChartCount(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Convert.ToInt32(filterid)).ToList();
                return Ok(casedata);
            }
            catch (Exception ex)
            {
                return Ok(chartdata);
            }
        }

        /// <summary>
        /// Case status chart count
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CourtStatusChartCount()
        {
            string chartdata = "";
            var filterid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtervalue"]);
            try
            {
                DataTable dt = new DataTable();
                dt = DataAccessADO.usp_mykase_GetCaseStatusChartCount(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Convert.ToInt32(filterid));
                return Ok(dt);
            }
            catch (Exception ex)
            {
                return Ok(chartdata);
            }
        }

        /// <summary>
        /// Division customize Transrail chart count
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult DivisionChartCount()
        {
            string chartdata = "";
            var filterid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtervalue"]);
            try
            {
                LawPracticeEntities db = new LawPracticeEntities();
                var divisionData = db.Usp_GetDivisionWiseCount(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).ToList();
                return Ok(divisionData);
            }
            catch (Exception ex)
            {
                return Ok(chartdata);
            }
        }
        /// <summary>
        /// Pending task chart count
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult PendingTaskChartCount()
        {
            var filterid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtervalue"]);
            string chartdata = "";
            try
            {
                LawPracticeEntities db = new LawPracticeEntities();
                var casedata = db.usp_GetPendingTaskChartCount(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Convert.ToInt32(filterid)).ToList();
                return Ok(casedata);
            }
            catch (Exception ex)
            {
                return Ok(chartdata);
            }
        }
        /// <summary>
        /// Time spend chart count
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult TimeSpendChartCount()
        {
            string chartdata = "";
            var filterid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtervalue"]);
            try
            {
                LawPracticeEntities db = new LawPracticeEntities();
                var casedata = db.usp_GetTimeSpendChartCount(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Convert.ToInt32(filterid)).ToList();
                return Ok(casedata);
            }
            catch (Exception ex)
            {
                return Ok(chartdata);
            }
        }
        /// <summary>
        /// Client Comm unique Created By list
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ClientCommuniqueCreatedBylist([FromBody] JObject paramJObject)
        {
            try
            {
                var db = new LawPracticeEntities();
                var matter = db.usp_ClientCommuniqueCreatedBylist(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).ToList();
                var cmatter = JsonConvert.SerializeObject(matter);
                var param = controllername + ">ClientCommuniqueCreatedBylist>param=" + LoggedInUser.FirmId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.User), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.User), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(cmatter);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.User), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.User), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
        /// <summary>
        /// Matter type chart count
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult MattertypeChartCount()
        {
            string chartdata = "";
            var filterid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtervalue"]);
            try
            {
                LawPracticeEntities db = new LawPracticeEntities();
                var casedata = db.usp_GetmattertypeChartCount(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Convert.ToInt32(filterid)).ToList();
                return Ok(casedata);
            }
            catch (Exception ex)
            {
                return Ok(chartdata);
            }
        }
        /// <summary>
        /// Get subject type chart count
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SubjecttypeChartCount()
        {
            string chartdata = "";
            var filterid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtervalue"]);
            try
            {
                LawPracticeEntities db = new LawPracticeEntities();
                var casedata = db.usp_GetSubjecttypeChartCount(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Convert.ToInt32(filterid)).ToList();
                return Ok(casedata);
            }
            catch (Exception ex)
            {
                return Ok(chartdata);
            }
        }
        /// <summary>
        /// Get invoice chart count
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult InvoiceChartCount()
        {
            string chartdata = "";
            try
            {
                var filterid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtervalue"]);
                LawPracticeEntities db = new LawPracticeEntities();
                var casedata = db.usp_GetInvoiceChartCount(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Convert.ToInt32(filterid)).ToList();
                return Ok(casedata);
            }
            catch (Exception ex)
            {
                return Ok(chartdata);
            }
        }
        /// <summary>
        /// Load chart setting
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadChartSetting()
        {
            try
            {
                var cmatter = db1.usp_GetChartSetting(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).ToList();
                return Ok(cmatter);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
        /// <summary>
        /// Save chart setting details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SaveChartSetting()
        {
            string msg = "OOPs! Something went wrong.";
            try
            {
                var db = new LawPracticeEntities();
                var chartids = QueryAES.UrlDecode(HttpContext.Current.Request.Form["chartids"]);
                string[] strIds = chartids.Split(',');
                if (strIds.Length > 0)
                {
                    db.usp_RemoveChartSetting(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                    for (int i = 0; i < strIds.Length; i++)
                    {
                        int chartid = Convert.ToInt32(strIds[i]);
                        if (chartid > 0)
                        {
                            int result = db.usp_AddChartSetting(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), chartid);
                            if (result > 0)
                            {
                                msg = "Saved Successfully";
                            }
                        }
                    }
                }
                return Ok(msg);
            }
            catch (Exception ex)
            {
                msg = "OOPs! Something went wrong.";
                return Ok(msg);
            }
        }
        /// <summary>
        /// Get my matter count
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult MyMatterCount()
        {
            try
            {
                var cmatter = db1.usp_MyMatterCount(LoggedInUser.FirmId, LoggedInUser.UserId).ToList();
                return Ok(cmatter);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
        /// <summary>
        /// Get my client count
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult MyClientsCount()
        {
            try
            {
                var search = QueryAES.UrlDecode(HttpContext.Current.Request.Form["search"]);
                var type = QueryAES.UrlDecode(HttpContext.Current.Request.Form["type"]);
                int pagenum = 1;
                int pagesize = 500000;
                LawPracticeEntities db = new LawPracticeEntities();
                if (type.ToString().ToUpper() == "ALL" || type.ToString().ToUpper() == "CLIENT")
                {
                    var cases1 = Repository.Matter.allcontactslist(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), pagenum, pagesize, search, type, null);
                    var param = controllername + ">Sp_NewContactsData>viewcontactlist>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId + "@" + search + "@" + type;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                    return Ok(cases1);
                }
                else
                {
                    var cases1 = Repository.Matter.contactslist(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), pagenum, pagesize, search, type, null);
                    var param = controllername + ">Sp_NewContactsData>viewcontactlist>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId + "@" + search + "@" + type;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                    return Ok(cases1);
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
        /// <summary>
        /// Get communication received count
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CommunicationReceivedCount()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var caseid = "";
                try
                {
                    caseid = caseid.Replace(" ", "+");
                    caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
                }
                catch (Exception e)
                {
                }
                var pagenum = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]);
                var pagesize = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]);
                var filtertype = "";
                var filtercreatedby = "";
                var berieffilter = "";
                var searchfrom = QueryAES.UrlDecode(HttpContext.Current.Request.Form["searchfrom"]);
                var searchto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["searchto"]);
                var filterid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtervalue"]);
                var list = db.usp_CaseCommuniquelistCount(firmid, userid, caseid, Convert.ToInt32(pagenum), Convert.ToInt32(pagesize), filtertype, filtercreatedby, "", searchfrom, searchto, Convert.ToInt32(filterid)).ToList();
                var a = JsonConvert.SerializeObject(list);
                return Ok(a);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }
        /// <summary>
        /// Communication Received Count1
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CommunicationReceivedCount1()
        {
            try
            {
                var cmatter = db1.usp_CommunicationReceivedCount(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).ToList();
                return Ok(cmatter);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
        /// <summary>
        /// Get task due today count details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult TaskDueTodayCount()
        {
            var filterid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtervalue"]);
            try
            {
                var cmatter = db1.usp_TaskDueTodayCount(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Convert.ToInt32(filterid)).ToList();
                return Ok(cmatter);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
        /// <summary>
        /// Matter count
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult MatterCount()
        {
            var filterid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtervalue"]);
            try
            {
                var cmatter = db1.usp_MatterCount(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Convert.ToInt32(filterid)).ToList();
                return Ok(cmatter);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
        /// <summary>
        /// Team member by firm id
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult TeamMemberbyFirmId([FromBody] JObject paramJObject)
        {
            try
            {
                var db = new LawPracticeEntities();
                string firmId = LoggedInUser.FirmId.ToString();
                string userId = LoggedInUser.UserId.ToString();

                // Hierarchy firm: only show chain members (ancestors + self + subordinates)
                string hierarchyFirmId = System.Configuration.ConfigurationManager.AppSettings["HierarchyFirmId"];
                if (!string.IsNullOrEmpty(hierarchyFirmId) && firmId.ToUpper() == hierarchyFirmId.ToUpper())
                {
                    var chainUsers = db.Database.SqlQuery<usp_GetTeamMemberbyFirmId_Result>(
                        @"SELECT DISTINCT fu.Id, fu.UserName 
                          FROM UserParentChain upc
                          JOIN FirmUsers fu ON upc.AncestorUserId = fu.Id
                          WHERE upc.UserId = @p0 AND fu.IsActive = 1
                          UNION
                          SELECT DISTINCT fu.Id, fu.UserName
                          FROM UserParentChain upc
                          JOIN FirmUsers fu ON upc.UserId = fu.Id
                          WHERE upc.AncestorUserId = @p0 AND fu.IsActive = 1
                          UNION
                          SELECT Id, UserName FROM FirmUsers WHERE Id = @p0 AND IsActive = 1
                          ORDER BY UserName",
                        userId).ToList();

                    var cmatter = JsonConvert.SerializeObject(chainUsers);
                    return Ok(cmatter);
                }

                // Non-hierarchy: return all team members
                var matter = db.usp_GetTeamMemberbyFirmId(firmId, userId).OrderBy(x => x.UserName).ToList();
                var cmatter2 = JsonConvert.SerializeObject(matter);
                var param = controllername + ">TeamMemberbyFirmId>param=" + firmId;
                db1.usp_AddAudit(Convert.ToInt32(EventType.User), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.User), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(cmatter2);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.User), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.User), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
        /// <summary>
        /// Load new archive case list
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadNewCaseListArchive()
        {
            try
            {
                var odate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["odate"]);
                var casename = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casename"]);
                var clientname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["clientname"]);
                var court = QueryAES.UrlDecode(HttpContext.Current.Request.Form["court"]);
                var cstatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["cstatus"]);
                var searchuser = QueryAES.UrlDecode(HttpContext.Current.Request.Form["users"]);
                int pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                int pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                var createdby = QueryAES.UrlDecode(HttpContext.Current.Request.Form["createdby"]);
                var filtervalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtervalue"]);
                LawPracticeEntities db = new LawPracticeEntities();
                if (LoggedInUser.RoleId == 1)
                {
                    if (String.IsNullOrEmpty(searchuser))
                    {
                        var cases1 = Repository.Matter.loadnewcaselistArchive(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), pagenum, pagesize, odate, casename, clientname, court, cstatus, createdby, Convert.ToInt32(filtervalue));
                        var param = controllername + ">LoadNewCaseList>loadnewcaselist>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId.ToString() + "@" + pagenum + "@" + pagesize + "@" + odate + "@" + casename + "@" + clientname + "@" + court + "@" + cstatus;
                        db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                        return Ok(cases1);
                    }
                    else
                    {
                        var cases1 = Repository.Matter.loadusernewcaselistAchive(LoggedInUser.FirmId.ToString(), searchuser, pagenum, pagesize, odate, casename, clientname, court, cstatus, 1, createdby, Convert.ToInt32(filtervalue));
                        var param = controllername + ">LoadNewCaseList>loadusernewcaselist>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId.ToString() + "@" + pagenum + "@" + pagesize + "@" + odate + "@" + casename + "@" + clientname + "@" + court + "@" + cstatus;
                        db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                        return Ok(cases1);
                    }
                }
                else if (LoggedInUser.RoleId == 2)
                {
                    var cases1 = Repository.Matter.loadusernewcaselistAchive(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), pagenum, pagesize, odate, casename, clientname, court, cstatus, 2, createdby, Convert.ToInt32(filtervalue));
                    var param = controllername + ">LoadNewCaseList>LoadUserNewCaseList>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId.ToString() + "@" + pagenum + "@" + pagesize + "@" + odate + "@" + casename + "@" + clientname + "@" + court + "@" + cstatus;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                    return Ok(cases1);
                }
                else
                {
                    return Ok("");
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
        /// <summary>
        /// Remove archive case details
        /// </summary>
        /// <param name="typeIds"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveCaseArchive(string[] typeIds)
        {
            try
            {
                string dburl = "";
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                if (LoggedInUser.RoleId == 1)
                {
                    var countmatter = Repository.Matter.removematterlist(typeIds, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), dburl, apiUrl);
                    var param = controllername + ">RemoveMatter>removematterlist>param=" + typeIds + "@" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString();
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                    db1.saveuseractivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.UserId.ToString(), 1, DateTime.Now.ToString(), "delmatter", Guid.Empty.ToString(), null, null, DateTime.Now.ToString());
                    return Ok(countmatter);
                }
                else
                {
                    return Ok(0);
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
        /// <summary>
        /// Comm unique list
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CommuniqueList()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var casename = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casename"]);
                var pagenum = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]);
                var pagesize = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]);
                var filtertype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtertype"]);
                var filtercreatedby = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtercreatedby"]);
                var filteralertto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filteralertto"]);
                var berieffilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["berieffilter"]);
                var searchfrom = QueryAES.UrlDecode(HttpContext.Current.Request.Form["searchfrom"]);
                var searchto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["searchto"]);
                var adminpersonal = QueryAES.UrlDecode(HttpContext.Current.Request.Form["adminpersonal"]);
                var cases1 = Repository.Matter.CommuniqueList(firmid, userid, casename, Convert.ToInt32(pagenum), Convert.ToInt32(pagesize), filtertype, filtercreatedby, berieffilter, searchfrom, searchto, filteralertto, adminpersonal);
                var param = controllername + ">CommuniqueList>CommuniqueList>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId.ToString() + "@" + pagenum + "@" + pagesize + "@" + filtertype + "@" + filtercreatedby + "@" + berieffilter + "@" + filteralertto;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(cases1);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }
        /// <summary>
        /// Add case watch alert users
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SaveCasewatchAlertUsers()
        {
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var auserid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["auser"]);
                var caseidtoken = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseid"]);
                var CaseId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["token"]);
                var casename = QueryAES.UrlDecode(HttpContext.Current.Request.Form["matternamesval"]);
                try
                {
                    CaseId = CaseId.Replace(" ", "+");
                    CaseId = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(CaseId));
                }
                catch { }
                try
                {
                    caseidtoken = caseidtoken.Replace(" ", "+");
                    caseidtoken = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseidtoken));
                }
                catch { }
                var db = new LawPracticeEntities();
                if (CaseId != "")
                {
                    //start code for Add case user assign
                    if (!String.IsNullOrEmpty(auserid))
                    {
                        string[] values = auserid.Split(',');
                        for (int i = 0; i < values.Length; i++)
                        {
                            values[i] = values[i].Trim();
                            //check user exist or not in the case
                            var Isexist = db.Usp_CheckCaseUserExistOrNot(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), CaseId, values[i]).FirstOrDefault();
                            if (Isexist == 0)
                            {
                                //Assign User To Case
                                if (LoggedInUser.RoleId.ToString() == "1" || values[i].ToString().ToLower() == LoggedInUser.UserId.ToString())
                                {
                                    var cnt1 = db.Usp_SaveCaseUser(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), CaseId, values[i], 0);
                                }
                                else
                                {
                                    var checkroles1 = db.usp_GetUserbyId(LoggedInUser.FirmId.ToString(), values[i]).FirstOrDefault();
                                    if (checkroles1 != null)
                                    {
                                        if (!String.IsNullOrEmpty(checkroles1.PartnerId)) // other partner or admin if true
                                        {
                                            var cnt1 = db.Usp_SaveCaseUser(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), CaseId, values[i], 1);
                                            var parentpartner = checkroles1.PartnerId;
                                            //send request to partner for this user
                                            var data = db.Usp_SaveFirmCaseTask(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), parentpartner, CaseId, "12", null, null, null);
                                        }
                                        else
                                        {
                                            var cnt1 = db.Usp_SaveCaseUser(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), CaseId, values[i], 0);
                                        }
                                    }
                                }
                                //Notification Send for each user
                                try
                                {
                                    var resultnitfications = Repository.Matter.SearchAssignUserSendNotificationEmail(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), values[i], LoggedInUser.RoleId.ToString(), casename, CaseId);
                                }
                                catch
                                { }
                                var checkroles = db.usp_GetUserbyId(LoggedInUser.FirmId.ToString(), values[i]).FirstOrDefault();
                                try
                                {
                                    //For finding default page id
                                    int pageid = 0;
                                    var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("caselist")).FirstOrDefault();
                                    if (pagelist != null)
                                    {
                                        pageid = Convert.ToInt32(pagelist.ParentPage);
                                    }
                                    //Assign Matter default rights
                                    if (checkroles != null)
                                    {
                                        if (checkroles.roleid != 1)
                                        {
                                            var roweffected2 = db.usp_SaveUserDefaultCaseRights(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), values[i], CaseId, pageid);
                                            //for partner
                                            if (!String.IsNullOrEmpty(checkroles.PartnerId))
                                            {
                                                var roweffected4 = db.usp_SaveUserDefaultCaseRights(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), checkroles.PartnerId, CaseId, pageid);
                                            }
                                        }
                                    }
                                    if (LoggedInUser.RoleId != 1)
                                    {
                                        if (checkroles != null)
                                        {
                                            var roweffected2 = db.usp_SaveUserDefaultCaseRights(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.UserId.ToString(), CaseId, pageid);
                                            //for partner
                                            if (!String.IsNullOrEmpty(checkroles.PartnerId))
                                            {
                                                var roweffected4 = db.usp_SaveUserDefaultCaseRights(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), checkroles.PartnerId, CaseId, pageid);
                                            }
                                        }
                                    }
                                }
                                catch (Exception) { }
                                //For getting document related pageid
                                try
                                {
                                    int pageids = 0;
                                    var pagelists = db.usp_GetDocRightsPageDatabyPagelink(Convert.ToString("Case Documents")).FirstOrDefault();
                                    if (pagelists != null)
                                    {
                                        pageids = Convert.ToInt32(pagelists.Id);
                                    }
                                    //For Matter Document default rights
                                    if (checkroles != null)
                                    {
                                        if (checkroles.roleid != 1)
                                        {
                                            var roweffected2 = db.usp_SaveUserDefaultCaseRights(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), values[i], CaseId, pageids);
                                            //for partner
                                            if (!String.IsNullOrEmpty(checkroles.PartnerId))
                                            {
                                                var roweffected4 = db.usp_SaveUserDefaultCaseRights(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), checkroles.PartnerId, CaseId, pageids);
                                            }
                                        }
                                    }
                                    if (LoggedInUser.RoleId != 1)
                                    {
                                        //for creator
                                        if (checkroles != null)
                                        {
                                            var roweffected2 = db.usp_SaveUserDefaultCaseRights(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.UserId.ToString(), CaseId, pageids);
                                            //for partner
                                            if (!String.IsNullOrEmpty(checkroles.PartnerId))
                                            {
                                                var roweffected4 = db.usp_SaveUserDefaultCaseRights(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), checkroles.PartnerId, CaseId, pageids);
                                            }
                                        }
                                    }
                                }
                                catch (Exception) { }
                            }
                            else { }
                        }
                    }
                    //End
                    var casecreatorid = db.usp_CaseBasicDetails(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), CaseId).FirstOrDefault();
                    if (casecreatorid != null)
                    {
                        if (casecreatorid.IsRevenueCourt == 1)
                        {
                            var result = AddCaseCaseWatch.SaveCaseAlertUserRevenue(auserid, casecreatorid.CWCreator.ToString(), LoggedInUser.FirmId.ToString(), apiUrl, caseidtoken, LoggedInUser.IsCaseWatchUser, LoggedInUser.UserName.ToString());
                            //change FirmUser concepta
                            return Ok(result);
                        }
                        else if (casecreatorid.IsReraCourt == 1)
                        {
                            var result = AddCaseCaseWatch.SaveCaseAlertUserForRera(auserid, casecreatorid.CWCreator.ToString(), LoggedInUser.FirmId.ToString(), apiUrl, caseidtoken, LoggedInUser.IsCaseWatchUser, LoggedInUser.UserName.ToString());
                            return Ok(result);
                        }
                        else
                        {
                            var result = AddCaseCaseWatch.SaveCaseAlertUser(auserid, casecreatorid.CWCreator.ToString(), LoggedInUser.FirmId.ToString(), apiUrl, caseidtoken, LoggedInUser.IsCaseWatchUser, LoggedInUser.UserName.ToString());
                            //change FirmUser concepta
                            return Ok(result);
                        }
                    }
                    else
                    {
                        return Ok("false");
                    }
                }
                else
                {
                    //Add New Code for Case List
                    var result = AddCaseCaseWatch.SaveCaseAlertUser(auserid, LoggedInUser.UserId.ToString(), LoggedInUser.FirmId.ToString(), apiUrl, caseidtoken, LoggedInUser.IsCaseWatchUser, LoggedInUser.UserName.ToString());
                    //change FirmUser concepta
                    return Ok(result);
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }
        /// <summary>
        /// Delete case watch alert users
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveCasewatchAlertUsers()
        {
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var auserid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["auser"]);
                var caseidtoken = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseid"]);
                var token = QueryAES.UrlDecode(HttpContext.Current.Request.Form["token"]);
                try
                {
                    token = token.Replace(" ", "+");
                    token = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(token));
                }
                catch
                {
                }
                try
                {
                    caseidtoken = caseidtoken.Replace(" ", "+");
                    caseidtoken = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseidtoken));
                }
                catch
                {
                }
                var db = new LawPracticeEntities();
                var casecreatorid = db.usp_CaseBasicDetails(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), token).FirstOrDefault();
                if (casecreatorid != null)
                {
                    var casestatusdetails = db.usp_UserCasesMapCaseStatusMaster(token).FirstOrDefault();
                    if (casestatusdetails.UserId != null)
                    {
                        //Remove From Matter List Also start code
                        try
                        {
                            var assineduser = auserid.Replace("MyKase_", "");
                            var checkroles = db.usp_GetUserbyId(LoggedInUser.FirmId.ToString(), assineduser).FirstOrDefault();
                            if (checkroles.roleid != 1)
                            {
                                var status = db.Usp_RemoveUserFromCase(LoggedInUser.FirmId.ToString(), assineduser, token);
                            }
                        }
                        catch (Exception) { }
                        //End
                        if (casecreatorid.IsRevenueCourt == 1)
                        {
                            var result = AddCaseCaseWatch.RemoveCaseWatchAlertUserRevenue(auserid, casestatusdetails.UserId.ToString(), LoggedInUser.FirmId.ToString(), apiUrl, caseidtoken);
                        }
                        else if (casecreatorid.IsReraCourt == 1)
                        {
                            var result = AddCaseCaseWatch.RemoveCaseWatchAlertUserForRera(auserid, casestatusdetails.UserId.ToString(), LoggedInUser.FirmId.ToString(), apiUrl, caseidtoken);
                        }
                        else
                        {
                            var result = AddCaseCaseWatch.RemoveCaseWatchAlertUser(auserid, casestatusdetails.UserId.ToString(), LoggedInUser.FirmId.ToString(), apiUrl, caseidtoken, 0, "");
                        }
                    }
                    return Ok();
                }
                else
                {
                    if (LoggedInUser.IsCaseWatchUser == 1)
                    {
                        var result = AddCaseCaseWatch.RemoveCaseWatchAlertUser(auserid, LoggedInUser.UserId.ToString(), LoggedInUser.FirmId.ToString(), apiUrl, caseidtoken, LoggedInUser.IsCaseWatchUser, LoggedInUser.UserName.ToString());
                    }
                    return Ok();
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }
        /// <summary>
        /// Case watch alert user list
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CasewatchAlertUsersList()
        {
            try
            {
                var db = new LawPracticeEntities();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var caseidtoken = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseid"]);
                try
                {
                    caseidtoken = caseidtoken.Replace(" ", "+");
                    caseidtoken = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseidtoken));
                }
                catch { }
                var result = "";
                var datares = db.usp_getUserCasesMapCaseStatusMasterByCaseid(LoggedInUser.FirmId.ToString(), Convert.ToInt64(caseidtoken)).FirstOrDefault();
                if (datares != null)
                {
                    var casecreatorid = db.usp_CaseBasicDetails(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), datares.MatterID.ToString()).FirstOrDefault();

                    if (casecreatorid.IsRevenueCourt == 1)
                    {
                        result = AddCaseCaseWatch.CaseWatchAlertUserListRevenue(LoggedInUser.UserId.ToString(), LoggedInUser.FirmId.ToString(), apiUrl, caseidtoken, LoggedInUser.IsCaseWatchUser, LoggedInUser.UserName.ToString());
                    }
                    else if (casecreatorid.IsReraCourt == 1)
                    {
                        result = AddCaseCaseWatch.CaseWatchAlertUserListForRera(LoggedInUser.UserId.ToString(), LoggedInUser.FirmId.ToString(), apiUrl, caseidtoken, LoggedInUser.IsCaseWatchUser, LoggedInUser.UserName.ToString());
                    }
                    else
                    {
                        result = AddCaseCaseWatch.CaseWatchAlertUserList(LoggedInUser.UserId.ToString(), LoggedInUser.FirmId.ToString(), apiUrl, caseidtoken, LoggedInUser.IsCaseWatchUser, LoggedInUser.UserName.ToString());
                    }
                }
                else
                {
                    result = AddCaseCaseWatch.CaseWatchAlertUserList(LoggedInUser.UserId.ToString(), LoggedInUser.FirmId.ToString(), apiUrl, caseidtoken, LoggedInUser.IsCaseWatchUser, LoggedInUser.UserName.ToString());
                }
                JObject jObject = JObject.Parse(result);
                dynamic data1 = jObject["data"];
                List<CaseWatchMykaseUserAlertList> FillCasetypeDiaryList = new List<CaseWatchMykaseUserAlertList>();
                for (int i = 0; i < data1.Count; i++)
                {
                    dynamic data = JObject.Parse(result);
                    string status = data.Status;
                    string Message = data.Message;
                    string iid = data.data[i].iid;
                    string User_Id = data.data[i].User_Id;
                    string vDispName = data.data[i].vDispName;
                    string email_id = data.data[i].email_id;
                    string mobile_No = data.data[i].mobile_No;
                    string dEntryDate = data.data[i].dEntryDate;
                    string Usercseid = data.data[i].Usercseid;
                    // Add parts to the list.
                    FillCasetypeDiaryList.Add(new CaseWatchMykaseUserAlertList { iid = iid, User_Id = User_Id, vDispName = vDispName, email_id = email_id, mobile_No = mobile_No, dEntryDate = dEntryDate, Usercseid = Usercseid });
                }
                //List<CaseWatchMykaseUserAlertList> list = new List<CaseWatchMykaseUserAlertList>();
                //list = FillCasetypeDiaryList.ToList();
                //foreach (var data in list.ToList())
                //{
                //    CaseWatchMykaseUserAlertList newItem = new CaseWatchMykaseUserAlertList();
                //    if (data.User_Id != null)
                //    {
                //        var userids = data.User_Id;
                //        userids = userids.Remove(0, 7);
                //        userids = userids.TrimEnd(' ').TrimStart(' ');
                //        var mykaseusername = db.usp_GetUserDetailByUserID(LoggedInUser.FirmId.ToString(), userids).FirstOrDefault();
                //        if (mykaseusername != null)
                //        {
                //            list[list.IndexOf(data)].vDispName = mykaseusername.Name;
                //        }
                //    }
                //}
                var a = JsonConvert.SerializeObject(FillCasetypeDiaryList);
                return Ok(a);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult UnLinkCaseToCaseWatch()
        {
            try
            {
                string dburl = "";
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseid"]);
                if (!String.IsNullOrEmpty(caseid))
                {
                    var countmatter = Repository.Matter.unlinkcasewatchcase(caseid, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), dburl, apiUrl);
                    var param = controllername + ">UnLinkCaseToCaseWatch>unlinkcasewatchcase>param=" + caseid + "@" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString();
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                    db1.saveuseractivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.UserId.ToString(), 1, DateTime.Now.ToString(), "delmatter", Guid.Empty.ToString(), null, null, DateTime.Now.ToString());
                    return Ok(countmatter);
                }
                else
                {
                    return Ok(0);
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
        /// <summary>
        /// Case Dashboard Reply Case Comm unique List
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CaseDashboardReplyCaseCommuniqueList()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var comid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["comid"]);
                try
                {
                    comid = comid.Replace(" ", "+");
                    comid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(comid));
                }
                catch (Exception e)
                {
                }
                var pagenum = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]);
                var pagesize = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]);
                var berieffilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["berieffilter"]);
                var searchfrom = QueryAES.UrlDecode(HttpContext.Current.Request.Form["subjectfilter"]);
                var cases1 = Repository.Matter.CaseDashboardReplyCaseCommuniqueList(firmid, userid, comid, Convert.ToInt32(pagenum), Convert.ToInt32(pagesize), "", "");
                var param = controllername + ">CaseDashboardReplyCaseCommuniqueList>CaseDashboardReplyCaseCommuniqueList>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId.ToString() + "@" + pagenum + "@" + pagesize + "@" + comid;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(cases1);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }
        /// <summary>
        /// Add direct case to case watch
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult DirectAddCaseToCW()
        {
            var myList = new List<string>();
            dynamic postedFiledata = "";
            var starttime = DateTime.Now;
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
                var getuseremil = db.usp_GetEmailByUserId(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).FirstOrDefault();
                if (getuseremil.cmobile != null)
                {
                    usermobile = getuseremil.cmobile;
                }
                if (getuseremil.EmailId != null)
                {
                    useremail = getuseremil.EmailId;
                }
                var usertypes = QueryAES.UrlDecode(HttpContext.Current.Request.Form["usertypes"]);
                var clientid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["clientname"]);
                var casename1 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["mattersforlink21"]);
                var casename = "";
                if (casename1 != "")
                {
                    casename = casename1.Replace("&amp;", "&");
                }
                var caseno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseno"]);
                var clientcontact = QueryAES.UrlDecode(HttpContext.Current.Request.Form["clientcontacts"]);
                var casetype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casecasetype"]);
                var auserid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["teamlead"]);
                var details = QueryAES.UrlDecode(HttpContext.Current.Request.Form["details"]);
                var username = QueryAES.UrlDecode(HttpContext.Current.Request.Form["userid"]);
                var confirmPassword = QueryAES.UrlDecode(HttpContext.Current.Request.Form["confirmPassword"]);
                var checkclient = QueryAES.UrlDecode(HttpContext.Current.Request.Form["checkclient"]);
                var odate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["odate"]);
                var assignuser = QueryAES.UrlDecode(HttpContext.Current.Request.Form["assignuser"]);
                var newcompanyid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["newcompanyid"]);
                //Add New Colomn
                var mattertypetext = QueryAES.UrlDecode(HttpContext.Current.Request.Form["mattertypetext"]);
                var othercourttxt = QueryAES.UrlDecode(HttpContext.Current.Request.Form["othercourttxt"]);
                var districtothercourt = QueryAES.UrlDecode(HttpContext.Current.Request.Form["districtothercourt"]);
                var districtcourtsatate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["districtcourtsatate"]);
                var districtcourtdistrict = QueryAES.UrlDecode(HttpContext.Current.Request.Form["districtcourtdistrict"]);
                var addedcnrno = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpdcourtcnr1"]));

                if (clientid == "" || clientid == null || clientid == "null")
                {
                    clientid = "00000000-0000-0000-0000-000000000000";
                }
                if (auserid == "" || auserid == null || auserid == "null")
                {
                    auserid = "00000000-0000-0000-0000-000000000000";
                }
                if (assignuser == null || assignuser == "null")
                {
                    assignuser = LoggedInUser.UserId.ToString();
                }
                else
                {
                    assignuser = assignuser;
                }
                if (clientcontact == "undefined" || clientcontact == null || clientcontact == "null" || clientcontact == "")
                {
                    clientcontact = null;
                }
                if (usertypes == "")
                {
                    usertypes = null;
                }
                if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["casedetails"]) != "" || QueryAES.UrlDecode(HttpContext.Current.Request.Form["casedetails"]) != null)
                {
                    addcase.Casedetail = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casedetails"]).ToString();
                }
                if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["divSCHCDistrict"]).ToString() != "3")
                {
                    if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["divSCHCDistrict"]).ToString() == "5")  //using custom court
                    {
                        addcase.Caseno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtno"]).Trim();
                        addcase.Caseyear = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpYear"]).Trim();
                        addcase.Court = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).Trim();
                        addcase.Username = WebConfigurationManager.AppSettings["matteridname"] + LoggedInUser.UserId.ToString();
                        addcase.Casename = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtcasename"]).Trim();
                        addcase.Nexthearingdate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dtnhearingdate"]).Trim();
                        addcase.Advocate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtcustomadvocate"]).Trim();
                        addcase.Status = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtcustomstatus"]).Trim();
                        addcase.Suffix = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtsuffix"]).ToString();
                        addcase.Casetype = "";
                    }
                    //end using custom court
                    else if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["divSCHCDistrict"]).ToString() == "6")  //using revenue court
                    {
                        addcase.RevenueCourt = QueryAES.UrlDecode(HttpContext.Current.Request.Form["RevenueCourt"]).Trim();
                        addcase.RevenueMandal = QueryAES.UrlDecode(HttpContext.Current.Request.Form["RevenueMandal"]).Trim();
                        addcase.RevenueJanpad = QueryAES.UrlDecode(HttpContext.Current.Request.Form["RevenueJanpad"]).Trim();
                        addcase.Username = WebConfigurationManager.AppSettings["matteridname"] + LoggedInUser.UserId.ToString();
                        addcase.RevenueTahsil = QueryAES.UrlDecode(HttpContext.Current.Request.Form["RevenueTahsil"]).Trim();
                        addcase.RevenueCourtName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["RevenueCourtName"]).Trim();
                        addcase.Caseno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Revenuetxtno"]).Trim();
                        addcase.Caseyear = QueryAES.UrlDecode(HttpContext.Current.Request.Form["RevenueYear"]).Trim();
                        addcase.RefNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["RevenueRefNo"]).Trim();
                    }
                    //For Rera Court start
                    else if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["divSCHCDistrict"]).ToString() == "7")  //using rera court
                    {
                        addcase.ReraCourt = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ReraCourt"]).Trim();
                        addcase.Reracasetype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["reracasetype"]).Trim();
                        addcase.Reracasno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["reracasno"]).Trim();
                        addcase.Username = WebConfigurationManager.AppSettings["matteridname"] + LoggedInUser.UserId.ToString();
                        addcase.Reracaseyear = QueryAES.UrlDecode(HttpContext.Current.Request.Form["reracaseyear"]).Trim();
                        addcase.ReraRefNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["reraRefNo"]).Trim();
                    }
                    //END
                    else
                    {
                        if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() != "0")//For highCourt,Supreme court,Tribunals Addition
                        {
                            addcase.Caseno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtno"]).ToString();
                            addcase.Caseyear = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpYear"]).ToString();
                            addcase.Casetype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drptype"]).ToString();
                            addcase.Court = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString();
                            addcase.FileNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtFileNo"]).ToString();
                            addcase.BenchID = "";
                            addcase.SideID = "";
                            addcase.Courttitle = "";
                            addcase.Stampreg = "";
                            addcase.Matterid = null;
                            addcase.Diaryno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtDiaryNo"]).ToString();
                            //addcase.Casedetail = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casedetails"]).ToString();
                            addcase.Suffix = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtsuffix"]).ToString();
                            if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "SC" || QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "DE")
                            {
                                if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtDiaryNo"]).ToString() != "")
                                {
                                    addcase.Casetype = "";
                                }
                            }
                            if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "KA")
                            {
                                addcase.BenchID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpKAbench"]).ToString();
                            }
                            else if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "MH")
                            {
                                if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpGoa"]).ToString() == "")
                                {
                                    addcase.BenchID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpbench"]).ToString();
                                    addcase.SideID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpside"]).ToString();
                                    addcase.Courttitle = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpGoa"]).ToString();
                                    addcase.Stampreg = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpstampregister"]).ToString();
                                }
                                else
                                {
                                    addcase.Courttitle = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpGoa"]).ToString();
                                }
                            }
                            else if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "NL" || QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "CT" ||
                                QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "NC" || QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "DT"
                                || QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "CF" || QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "CI"
                                || QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "RC" || QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "NGT")
                            {
                                addcase.BenchID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpNCBench"]).ToString();
                                if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "CF")
                                {
                                    if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpNCBench"]).ToString() == "E")
                                    {
                                        addcase.TriState = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpncdrcstate"]).ToString());
                                        addcase.District = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpncdrcDistrict"]));
                                    }
                                    if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpNCBench"]).ToString() == "C")
                                    {
                                        addcase.TriState = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpncdrcstate"]).ToString());
                                    }
                                    if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpNCBench"]).ToString() == "B")
                                    {
                                        addcase.District = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpncdrcDistrict"]));
                                    }
                                }
                            }
                            else if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "IT" || QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "CE" || QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "NGT")
                            {
                                addcase.BenchID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpNCBench"]).ToString();
                            }
                            else if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "TN")
                            {
                                addcase.BenchID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["divTNBench"]).ToString();
                            }
                            else if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "BH")
                            {
                                addcase.BenchID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["divBHBench"]).ToString();
                            }
                            else if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "MP")
                            {
                                addcase.BenchID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["divMPBench"]).ToString();
                            }
                            else if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "RH")
                            {
                                addcase.BenchID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["divRHBench"]).ToString();
                            }
                            else if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "JK")
                            {
                                addcase.BenchID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["divJKBench"]).ToString();
                            }
                            else if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "CF")
                            {
                            }
                            else if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "UP")
                            {
                                addcase.BenchID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["divUPBench"]).ToString();
                            }
                            else if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "GH")
                            {
                                addcase.BenchID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["divGHBench"]).ToString();
                            }
                            else if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "WB")
                            {
                                addcase.BenchID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["divWBBench"]).ToString();
                            }
                            addcase.Username = WebConfigurationManager.AppSettings["matteridname"] + LoggedInUser.UserId.ToString();
                            flag = 0;
                        }
                    }
                }
                else
                //For District court Addition
                {
                    if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["divSCHCDistrict"]).ToString() == "3")
                    {
                        addcase.Casetype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drptype"]).ToString();
                        addcase.Caseno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtno"]).ToString();
                        addcase.Caseyear = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpYear"]).ToString();
                        addcase.Court = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtnameDC"]).ToString();
                        addcase.BenchID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpdistrictcourtname"]).ToString();
                        addcase.SideID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtcomplexestb"]).ToString();
                        addcase.Courttitle = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcompestbcourt"]).ToString();
                        addcase.Stampreg = "1";
                        addcase.Username = WebConfigurationManager.AppSettings["matteridname"] + LoggedInUser.UserId.ToString();
                        flag = 1;
                    }
                }

                var mkcourtids = QueryAES.UrlDecode(HttpContext.Current.Request.Form["divSCHCDistrict"]).ToString();

                var countdata1 = "";
                var matterid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["matterid"]).ToString();
                //validate casename exist
                if (matterid == "")
                {
                    var chkcase = db.usp_checkcasenameexist(LoggedInUser.FirmId.ToString(), casename.TrimEnd().TrimStart(), null, LoggedInUser.UserId.ToString()).FirstOrDefault();
                    if (chkcase == 1)
                    {
                        return Ok("Already exist matter name. please try another matter name");
                    }
                    if (!String.IsNullOrEmpty(username))
                    {
                        //check userid if exist
                        var checkuser = db.ValidateUserName(username).FirstOrDefault();
                        if (checkuser != null)
                        {
                            return Ok("Already Exists User Please Try Another User Name!");
                        }
                    }
                    var companyIds = "";
                    // get teamlead data for create client
                    if (usertypes == "company")
                    {
                        if (checkclient == "1")
                        {
                            try
                            {
                                //get company id
                                var getusersdata = db.usp_wf_GetClientDetails(Guid.Parse(firmid), Guid.Parse(clientid)).FirstOrDefault();
                                companyIds = getusersdata.CompanyId.ToString();
                            }
                            catch
                            {
                                companyIds = Guid.Empty.ToString();
                            }
                        }
                        else
                        {
                            try
                            {
                                if (clientcontact == null && clientid != "00000000-0000-0000-0000-000000000000")
                                {
                                    companyIds = newcompanyid;
                                }
                                else
                                {
                                    var getusersdata = db.usp_SingleContactsDetails(firmid, userid, null, clientcontact).FirstOrDefault();
                                    companyIds = getusersdata.CompanyId;
                                }
                            }
                            catch
                            {
                                companyIds = Guid.Empty.ToString();
                            }
                        }
                    }
                    //upload files in azure server
                    var httpRequest = HttpContext.Current.Request;
                    files = postedFiledata;
                    var countdatas = "";
                    var caseid = "";
                    //countdata1 = Repository.Matter.SaveShortCase(firmid, userid, usertypes, clientid, casename, caseno, clientcontact, casetype, auserid, details, username, confirmPassword, checkclient, files, odate, LoggedInUser.RoleId.ToString(), companyIds, assignuser);
                    countdata1 = Repository.Matter.SaveShortCaseForLitigation(firmid, userid, usertypes, clientid, casename, caseno, clientcontact,
                        casetype, auserid, details, username, confirmPassword, checkclient, files, odate, LoggedInUser.RoleId.ToString(),
                        companyIds, assignuser, mattertypetext, addcase, mkcourtids, othercourttxt, districtothercourt, districtcourtsatate, districtcourtdistrict, addedcnrno);
                    try
                    {
                        Guid chkid = Guid.Parse(countdata1);
                        caseid = countdata1;
                        countdatas = "1";
                        try
                        {
                            int pageid = 0;
                            var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("caselist")).FirstOrDefault();
                            if (pagelist != null)
                            {
                                pageid = Convert.ToInt32(pagelist.ParentPage);
                            }
                            string id = "";
                            ObjectParameter IDParameter;
                            IDParameter = new ObjectParameter("iid", id);
                            var checkroles = db.usp_GetUserbyId(firmid, auserid).FirstOrDefault();
                            if (checkroles != null)
                            {
                                if (checkroles.roleid != 1)
                                {
                                    var roweffected2 = db.usp_SaveUserDefaultCaseRights(firmid, userid, auserid, caseid, pageid);
                                    //for partner
                                    if (!String.IsNullOrEmpty(checkroles.PartnerId))
                                    {
                                        var roweffected4 = db.usp_SaveUserDefaultCaseRights(firmid, userid, checkroles.PartnerId, caseid, pageid);
                                    }
                                }
                            }
                            if (LoggedInUser.RoleId != 1)
                            {
                                //for creator
                                var checkroles1 = db.usp_GetUserbyId(firmid, userid).FirstOrDefault();
                                if (checkroles1 != null)
                                {
                                    var roweffected2 = db.usp_SaveUserDefaultCaseRights(firmid, userid, userid, caseid, pageid);
                                    //for partner
                                    if (!String.IsNullOrEmpty(checkroles1.PartnerId))
                                    {
                                        var roweffected4 = db.usp_SaveUserDefaultCaseRights(firmid, userid, checkroles1.PartnerId, caseid, pageid);
                                    }
                                }
                            }
                        }
                        catch
                        {
                        }
                        try
                        {
                            int pageid = 0;
                            var pagelist = db.usp_GetDocRightsPageDatabyPagelink(Convert.ToString("Case Documents")).FirstOrDefault();
                            if (pagelist != null)
                            {
                                pageid = Convert.ToInt32(pagelist.Id);
                            }
                            string id = "";
                            ObjectParameter IDParameter;
                            IDParameter = new ObjectParameter("iid", id);
                            //for assign user
                            var checkroles = db.usp_GetUserbyId(firmid, auserid).FirstOrDefault();
                            if (checkroles != null)
                            {
                                if (checkroles.roleid != 1)
                                {
                                    var roweffected2 = db.usp_SaveUserDefaultCaseRights(firmid, userid, auserid, caseid, pageid);
                                    //for partner
                                    if (!String.IsNullOrEmpty(checkroles.PartnerId))
                                    {
                                        var roweffected4 = db.usp_SaveUserDefaultCaseRights(firmid, userid, checkroles.PartnerId, caseid, pageid);
                                    }
                                }
                            }
                            if (LoggedInUser.RoleId != 1)
                            {
                                //for creator
                                var checkroles1 = db.usp_GetUserbyId(firmid, userid).FirstOrDefault();
                                if (checkroles1 != null)
                                {
                                    var roweffected2 = db.usp_SaveUserDefaultCaseRights(firmid, userid, userid, caseid, pageid);
                                    //for partner
                                    if (!String.IsNullOrEmpty(checkroles1.PartnerId))
                                    {
                                        var roweffected4 = db.usp_SaveUserDefaultCaseRights(firmid, userid, checkroles1.PartnerId, caseid, pageid);
                                    }
                                }
                            }
                        }
                        catch { }
                    }
                    catch
                    {
                        countdatas = countdata1;
                    }
                    if (countdatas.ToString() == "1")
                    {
                        var newcasefolderid = "";
                        var dpaths = "";
                        int maxFileSize = Convert.ToInt32(WebConfigurationManager.AppSettings["docelasticmaxFileSize"]);
                        var id = "";
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
                            IDParameter = new ObjectParameter("id", id);
                            var data = db1.usp_SaveFilefolderCloudNew(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), dname.TrimStart().TrimEnd(), dpaths, 0, directoryid.ToString(), null, null, null, IDParameter, caseid, null, 0, "1", null, null);
                            newcasefolderid = Convert.ToString(IDParameter.Value);
                        }
                        var dpath = dpaths.TrimEnd('/');
                        try
                        {
                            if (httpRequest.Files.Count > 0)
                            {
                                if (Convert.ToInt32(countdatas) == 1)
                                {
                                    //update docs in document mgmt
                                    if (!String.IsNullOrEmpty(countdata1))
                                    {
                                        var newfilename = "";
                                        var newfilenames = "";
                                        string AzureStorageName = WebConfigurationManager.AppSettings["AzureStorageName"];
                                        string AzureStorageKey = WebConfigurationManager.AppSettings["AzureStorageKey"];
                                        string azureroot = "mykase";
                                        string azuredir = "WorkSpace";
                                        string fakepathin = "azuredirin/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                                        string fakepathout = "azuredirout/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                                        var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
                                        var account = new CloudStorageAccount(cred, true);
                                        var client = account.CreateCloudFileClient();
                                        if (httpRequest.Files.Count > 0)
                                        {
                                            var docfiles = new List<string>();
                                            //Check whether Directory (Folder) exists.
                                            for (int i = 0; i < httpRequest.Files.Count; i++)
                                            {
                                                var postedFile = httpRequest.Files[i];
                                                //encrypt file
                                                string input = HttpContext.Current.Server.MapPath("~/" + fakepathin);
                                                if (!(Directory.Exists(input)))
                                                {
                                                    Directory.CreateDirectory(input);
                                                }
                                                if (!(Directory.Exists(HttpContext.Current.Server.MapPath("~/" + fakepathout))))
                                                {
                                                    Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/" + fakepathout));
                                                }
                                                var fileextchk = Path.GetExtension(postedFile.FileName);
                                                var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);
                                                postedFile.SaveAs(input + "\\" + postedFile.FileName);
                                                //for start elastic
                                                string strfilepath = input + "\\" + postedFile.FileName;
                                                int fileSize = postedFile.ContentLength;
                                                var directory = Path.GetDirectoryName(strfilepath);
                                                string strfileName = Path.GetFileName(strfilepath);
                                                string mimeType = MimeMapping.GetMimeMapping(strfileName);
                                                var base64File = Convert.ToBase64String(System.IO.File.ReadAllBytes(Path.Combine(directory, strfileName)));
                                                //end elastic
                                                input = input + "\\" + postedFile.FileName;
                                                string output = HttpContext.Current.Server.MapPath("~/" + fakepathout + "/" + postedFile.FileName);
                                                QueryAES.FileEncrypt(input, output);
                                                //delete file
                                                try
                                                {
                                                    System.IO.File.Delete(input);
                                                }
                                                catch (Exception ex)
                                                {
                                                }
                                                //rename file exist
                                                int it = 0;
                                                var fileName = postedFile.FileName;
                                                var origininalfilename = fileName;
                                                var orfileNameOnly = fileName.Remove(fileName.LastIndexOf('.') + 1).TrimEnd('.');
                                                var extension = fileName.Split('.').Last();
                                                while (AzureDocument.fileexist(dpath, origininalfilename, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()))
                                                {
                                                    it += 1;
                                                    origininalfilename = string.Format("{0}({1}).{2}", orfileNameOnly, it, extension);
                                                }
                                                CloudStorageAccount storageAccount = new CloudStorageAccount(cred, true);
                                                // Create a reference to the file client.
                                                CloudFileClient fileClient = storageAccount.CreateCloudFileClient();
                                                var share = client.GetShareReference(azureroot);
                                                // Create a reference to the Azure path
                                                var cloudFileDirectory = share.GetRootDirectoryReference().GetDirectoryReference(dpath);
                                                cloudFileDirectory.CreateIfNotExists();
                                                //Create a reference to the filename that you will be uploading
                                                CloudFile cloudFile = cloudFileDirectory.GetFileReference(origininalfilename);
                                                var fileext = Path.GetExtension(origininalfilename);
                                                //Open a stream from a local file.
                                                //Upload the file to Azure.
                                                if (cloudFile.Exists())
                                                {
                                                    return Ok("exist");
                                                }
                                                else
                                                {
                                                    cloudFile.UploadFromFile(output);
                                                }
                                                try
                                                {
                                                    System.IO.File.Delete(output);
                                                }
                                                catch (Exception ex) { }
                                                ObjectParameter IDParameter1;
                                                IDParameter1 = new ObjectParameter("id", id);
                                                var data1 = db1.usp_SaveFilefolderCloudNew(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), origininalfilename, dpath, 1, newcasefolderid.ToString(), null, fileext, null, IDParameter1, null, null, 0, "1", null, null);
                                                id = Convert.ToString(IDParameter1.Value);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        catch
                        {
                        }
                    }
                }
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var drpcourtname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString();
                if (drpcourtname.ToString() == "" || drpcourtname.ToString() == null || drpcourtname.ToString() == "null")
                {
                }
                else
                {
                    //check limit
                    var modulelimit = db.usp_GetFirmLimit(LoggedInUser.FirmId.ToString()).FirstOrDefault();
                    if (modulelimit != null)
                    {
                        //get total livecase count
                        if (modulelimit.IsCWActive == 1)
                        {
                            var caselivecount = db.Usp_CountLiveCaseUpdateLimit(LoggedInUser.FirmId.ToString()).FirstOrDefault();
                            if (caselivecount != 0)
                            {
                                if (!String.IsNullOrEmpty(modulelimit.icwcaselimit))
                                {
                                    if (caselivecount >= Convert.ToInt32(modulelimit.icwcaselimit))
                                    {
                                        return Ok("livecaselimitexceed");
                                    }
                                }
                                else
                                {
                                    return Ok("livecaselimitnotfound");
                                }
                            }
                        }
                        else
                        {
                            return Ok("livecasenotactive");
                        }
                    }
                    else
                    {
                        return Ok("livecaseaccessdenied");
                    }
                }
                var caseinfo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseinfo"]).ToString();
                try
                {
                    if (matterid == "")
                    {
                        matterid = countdata1;
                    }
                    else
                    {
                        matterid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(matterid));
                    }
                }
                catch
                {
                    matterid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["matterid"]).ToString();
                }
                var countdata = Repository.Matter.DirectAddCaseToCW(firmid, userid, QueryAES.UrlDecode(HttpContext.Current.Request.Form["divSCHCDistrict"]).ToString(),
                    Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"])), Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpdistrictcourtname"])),
                    Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpdistrictcourtfullname"])), Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpdcourtcnr1"])),
                    addcase, useremail, usermobile, apiUrl, caseinfo, matterid, LoggedInUser.IsCaseWatchUser, LoggedInUser.UserName.ToString());
                var param = controllername + ">DirectAddCaseToCW>DirectAddCaseToCW>param=" + firmid + "@" + userid;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(countdata);
            }
            catch (Exception ex)
            {
                LogService("/API/Search/DirectAddCaseToCW" + ex.Message + "&" + ex.InnerException + "starttime" + starttime + "Endtime" + DateTime.Now);
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                var counterror = "Sorry! Unable to Add now.";
                return Ok(counterror);
            }
        }
        /// <summary>
        /// Bind Case For map case watch
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult BindCaseForCWMAP()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var cases1 = Repository.Matter.BindCaseForCWMAP(firmid, userid);
                var param = controllername + ">BindCaseForCWMAP>BindCaseForCWMAP>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(cases1);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }
        /// <summary>
        /// Add case for casewatch map
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SaveCaseForCWMAP()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var matterid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["matterid"]);
                var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseid"]);
                var cases1 = Repository.Matter.SaveCaseForCWMAP(firmid, userid, matterid, caseid);
                var param = controllername + ">BindCaseForCWMAP>BindCaseForCWMAP>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId.ToString() + "@" + matterid + "@caseid" + caseid;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(cases1);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }
        /// <summary>
        /// Add case for notice map
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SaveCaseForNoticeMAP()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var matterid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["matterid"]);
                var noticeid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["noticeid"]);
                var type = QueryAES.UrlDecode(HttpContext.Current.Request.Form["type"]);
                var cases1 = Repository.Matter.SaveCaseForNoticeMAP(firmid, userid, matterid, noticeid, type);
                var param = controllername + ">SaveCaseForNoticeMAP>SaveCaseForNoticeMAP>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId.ToString() + "@" + matterid + "@" + noticeid + "@" + type;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(cases1);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }
        /// <summary>
        /// Get matter notice chart count
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult MatterNoticeChartCount()
        {
            string chartdata = "";
            try
            {
                var filterid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtervalue"]);
                LawPracticeEntities db = new LawPracticeEntities();
                var casedata = db.usp_GetLinkNoticeMatterChartCount(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Convert.ToInt32(filterid)).ToList();
                return Ok(casedata);
            }
            catch (Exception ex)
            {
                return Ok(chartdata);
            }
        }
        /// <summary>
        /// Next Hearing If id By UserId
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public async Task<IHttpActionResult> NextHearingIfidByUserId()
        {
            // var data= await ReturnNexthearingNew();
            var data = await ReturnNexthearing();
            var dataRevenue = await ReturnNexthearingRevenue();
            return Ok(new { data = data, dataRevenue = dataRevenue });
        }
        /// <summary>
        /// Return Next hearing
        /// </summary>
        /// <returns></returns>
        public async Task<string> ReturnNexthearing()
        {
            try
            {
                LawPracticeEntities db = new LawPracticeEntities();
                string strusername = WebConfigurationManager.AppSettings["matteridname"];
                Guid user = LoggedInUser.UserId;
                Guid firmids = LoggedInUser.FirmId;
                string joined = "";
                string matteridlist = "";
                var rolesuser = LoggedInUser.RoleId;
                joined = joined.TrimEnd(',');
                joined = joined.Replace(",", "','");
                joined = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                matteridlist = joined.ToString();
                string strapiuser = matteridlist;
                var apiUrl = WebConfigurationManager.AppSettings["savetocasewatchurl"];
                var addfClient = new HttpClient();
                object rawfile = new
                {
                    Accesstoken = "mykase123456789abcdef",
                    UserId = strapiuser,
                };
                string content = JsonConvert.SerializeObject(rawfile);
                StringContent queryString = new StringContent(content, Encoding.UTF8, "application/json");
                addfClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var response = await addfClient.PostAsync(new Uri(apiUrl + "/API/Search/NextHearingIfidByUserId").ToString(), queryString);
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
        /// <summary>
        /// Return New Next hearing
        /// </summary>
        /// <returns></returns>
        public async Task<string> ReturnNexthearingNew()
        {
            var resid = "";
            var result = "";
            try
            {
                if (LoggedInUser.RoleId == 1)
                {
                    LawPracticeEntities db = new LawPracticeEntities();
                    string strusername = WebConfigurationManager.AppSettings["matteridname"];
                    Guid user = LoggedInUser.UserId;
                    Guid firmids = LoggedInUser.FirmId;
                    string joined = "";
                    string matteridlist = "";
                    var rolesuser = LoggedInUser.RoleId;

                    joined = joined.TrimEnd(',');
                    joined = joined.Replace(",", "','");
                    joined = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();

                    matteridlist = joined.ToString();
                    string strapiuser = matteridlist;
                    var apiUrl = WebConfigurationManager.AppSettings["savetocasewatchurl"];
                    var addfClient = new WebClient();
                    object rawfile = new
                    {
                        Accesstoken = "mykase123456789abcdef",
                        UserId = strapiuser,
                    };
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/NextHearingIfidByUserId"), "POST", builders);
                    JObject jObject = JObject.Parse(resid);
                    dynamic data1 = jObject["data"];
                    //  dynamic data = JObject.Parse(resid);
                    var jsonstring = JsonConvert.SerializeObject(data1);

                    //for (int i = 0; i < data1.Count; i++)
                    //{
                    //    dynamic data = JObject.Parse(resid);
                    //    string NexthearingDate = data.data[i].NexthearingDate;
                    //    string UserCaseId = Convert.ToString(data.data[i].iid);
                    //    string MasterCaseId = Convert.ToString(data.data[i].CaseId);
                    // Repository.Matter.SaveNextHearingJSONdata(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), 
                    //        Convert.ToDateTime(NexthearingDate), UserCaseId.ToString(), MasterCaseId.ToString());
                    //}

                    result = await Repository.Matter.SaveNextHearingJSONdata(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), jsonstring);
                }
                else
                {
                    result = "1";
                }
            }
            catch (Exception ex)
            {

            }
            return result;
        }
        /// <summary>
        /// Return Next hearing Revenue
        /// </summary>
        /// <returns></returns>
        public async Task<string> ReturnNexthearingRevenue()
        {
            try
            {
                LawPracticeEntities db = new LawPracticeEntities();
                string strusername = WebConfigurationManager.AppSettings["matteridname"];
                Guid user = LoggedInUser.UserId;
                Guid firmids = LoggedInUser.FirmId;
                string joined = "";
                string matteridlist = "";
                var rolesuser = LoggedInUser.RoleId;
                joined = joined.TrimEnd(',');
                joined = joined.Replace(",", "','");
                joined = db.usp_GetUnderUserListById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), strusername).FirstOrDefault();
                matteridlist = joined.ToString();
                string strapiuser = matteridlist;
                var apiUrl = WebConfigurationManager.AppSettings["savetocasewatchurl"];
                var response = await AddCaseCaseWatch.NextHearingIfidByUserIdRevenueAsync(strapiuser, apiUrl, LoggedInUser.UserId.ToString());
                return response;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
        /// <summary>
        /// Load Case List By Assign User and All
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadCaseListByAssignUserandAll()
        {
            try
            {
                var userid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["userid"]);
                var optype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["optype"]);
                var pageno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pageno"]);
                var SelectConType = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SelectConType"]);
                var SelectContacts = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SelectContacts"]);
                var data = Repository.Matter.LoadCaseListByAssignUserandAll(LoggedInUser.FirmId.ToString(), userid, optype, pageno, SelectConType, SelectContacts);
                var param = controllername + ">LoadCaseListByAssignUserandAll>LoadCaseListByAssignUserandAll>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId + "@" + optype + "@" + pageno + "@" + SelectConType + "@" + SelectContacts;
                db1.usp_AddAudit(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(data);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
        /// <summary>
        /// Save Bulk Case Assign
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SaveBulkCaseAssign()
        {
            var db = new LawPracticeEntities();
            try
            {
                string FromWorkUser = QueryAES.UrlDecode(HttpContext.Current.Request.Form["FromWorkUser"]);
                string optype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["optype"]);
                string caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseid"]);
                string SelectConType = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SelectConType"]);
                string SelectContacts = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SelectContacts"]);
                var firmid = LoggedInUser.FirmId;
                var userid = LoggedInUser.UserId;
                var data = Repository.Matter.SaveBulkCaseAssign(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), FromWorkUser, optype, caseid, SelectConType, SelectContacts);
                var param = controllername + ">SaveBulkCaseAssign>SaveBulkCaseAssign>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId + "@" + FromWorkUser + "@" + optype + "@" + caseid + "@" + SelectConType + "@" + SelectContacts;
                db1.usp_AddAudit(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(data);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
        /// <summary>
        /// UnLink Case To CaseWatch From Live update
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult UnLinkCaseToCaseWatchFromLiveupdate()
        {
            try
            {
                string dburl = "";
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseid"]);
                var usercaseid1 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["usercaseid"]);
                string usercaseid = "";
                try
                {
                    usercaseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(usercaseid1));
                }
                catch
                {
                    usercaseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["usercaseid"]);
                }
                if (!String.IsNullOrEmpty(usercaseid))
                {
                    var countmatter = Repository.Matter.unlinkcasewatchcaseForLivecase(usercaseid, caseid, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), dburl, apiUrl, LoggedInUser.IsCaseWatchUser);
                    var param = controllername + ">UnLinkCaseToCaseWatch>unlinkcasewatchcase>param=" + usercaseid + "@" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString();
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                    db1.saveuseractivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.UserId.ToString(), 1, DateTime.Now.ToString(), "delmatter", Guid.Empty.ToString(), null, null, DateTime.Now.ToString());
                    return Ok(countmatter);
                }
                else
                {
                    return Ok(0);
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ReLinkCaseToCaseWatchFromLiveupdate()
        {
            try
            {
                string dburl = "";
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseid"]);
                var usercaseid1 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["usercaseid"]);
                string usercaseid = "";
                try
                {
                    usercaseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(usercaseid1));
                }
                catch
                {
                    usercaseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["usercaseid"]);
                }
                if (!String.IsNullOrEmpty(usercaseid))
                {
                    var countmatter = Repository.Matter.RelinkcasewatchcaseForLivecase(usercaseid, caseid, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), dburl, apiUrl, LoggedInUser.IsCaseWatchUser);
                    var param = controllername + ">ReLinkCaseToCaseWatch>unlinkcasewatchcase>param=" + usercaseid + "@" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString();
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                    db1.saveuseractivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.UserId.ToString(), 1, DateTime.Now.ToString(), "delLiveUpdatematter", Guid.Empty.ToString(), null, null, DateTime.Now.ToString());
                    return Ok(countmatter);
                }
                else
                {
                    return Ok(0);
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
        /// <summary>
        /// Get Assignee
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult GetAssignee()
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var UserId = LoggedInUser.UserId.ToString();
                var firmId = LoggedInUser.FirmId.ToString();
                var matterId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["id"]);
                try
                {
                    matterId = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(matterId));
                }
                catch { }
                var result = db1.Usp_GetAssignByCaseId(firmId, UserId, matterId).FirstOrDefault();
                return Ok(result);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.CustomField), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.CustomField), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
        /// <summary>
        /// Add case live update to casewatch
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult AddCaseLiveUpdateToCW()
        {
            var myList = new List<string>();
            dynamic postedFiledata = "";
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
                var getuseremil = db.usp_GetEmailByUserId(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).FirstOrDefault();
                if (getuseremil.cmobile != null)
                {
                    usermobile = getuseremil.cmobile;
                }
                if (getuseremil.EmailId != null)
                {
                    useremail = getuseremil.EmailId;
                }
                var usertypes = QueryAES.UrlDecode(HttpContext.Current.Request.Form["usertypes"]);
                var clientid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["clientname"]);
                var casename = QueryAES.UrlDecode(HttpContext.Current.Request.Form["mattersforlink21"]);
                var caseno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseno"]);
                var clientcontact = QueryAES.UrlDecode(HttpContext.Current.Request.Form["clientcontacts"]);
                var casetype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casecasetype"]);
                var auserid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["teamlead"]);
                var details = QueryAES.UrlDecode(HttpContext.Current.Request.Form["details"]);
                var username = QueryAES.UrlDecode(HttpContext.Current.Request.Form["userid"]);
                var confirmPassword = QueryAES.UrlDecode(HttpContext.Current.Request.Form["confirmPassword"]);
                var checkclient = QueryAES.UrlDecode(HttpContext.Current.Request.Form["checkclient"]);
                var odate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["odate"]);
                var assignuser = QueryAES.UrlDecode(HttpContext.Current.Request.Form["assignuser"]);
                var newcompanyid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["newcompanyid"]);
                if (clientid == "" || clientid == null || clientid == "null")
                {
                    clientid = "00000000-0000-0000-0000-000000000000";
                }
                if (auserid == "" || auserid == null || auserid == "null")
                {
                    auserid = "00000000-0000-0000-0000-000000000000";
                }
                if (assignuser == null || assignuser == "null")
                {
                    assignuser = LoggedInUser.UserId.ToString();
                }
                else
                {
                    assignuser = assignuser;
                }
                if (clientcontact == "undefined" || clientcontact == null || clientcontact == "null" || clientcontact == "")
                {
                    clientcontact = null;
                }
                if (usertypes == "")
                {
                    usertypes = null;
                }
                //for matter name short (0 to 100 charctor)
                try
                {
                    if (casename != "")
                    {
                        casename = casename.Substring(0, 100);
                    }
                }
                catch { }
                if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["casedetails"]) != "" || QueryAES.UrlDecode(HttpContext.Current.Request.Form["casedetails"]) != null)
                {
                    addcase.Casedetail = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casedetails"]).ToString();
                }

                if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["divSCHCDistrict"]).ToString() != "3")
                {
                    if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["divSCHCDistrict"]).ToString() == "5")  //using custom court
                    {
                        addcase.Caseno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtno"]).Trim();
                        addcase.Caseyear = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpYear"]).Trim();
                        addcase.Court = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).Trim();
                        addcase.Username = WebConfigurationManager.AppSettings["matteridname"] + LoggedInUser.UserId.ToString();
                        addcase.Casename = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtcasename"]).Trim();
                        addcase.Nexthearingdate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dtnhearingdate"]).Trim();
                        addcase.Advocate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtcustomadvocate"]).Trim();
                        addcase.Status = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtcustomstatus"]).Trim();
                        addcase.Suffix = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtsuffix"]).ToString();
                        addcase.Casetype = "";
                    }
                    //end using custom court
                    else if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["divSCHCDistrict"]).ToString() == "6")  //using revenue court
                    {
                         addcase.Username = WebConfigurationManager.AppSettings["matteridname"] + LoggedInUser.UserId.ToString();
                        addcase.RevenueCourt = GetFormValue("RevenueCourt");
                        string revenueRefNo = GetFormValue("RevenueRefNo");
                        string revenueTxtNo = GetFormValue("Revenuetxtno");

                        string caseNo = !string.IsNullOrWhiteSpace(revenueRefNo) ? revenueRefNo : revenueTxtNo;

                        addcase.RefNo = caseNo;
                        addcase.Caseno = caseNo;
                        if (addcase.RevenueCourt == "RELK") //For Lucknow Revenue court 
                        {
                            addcase.RevenueMandal = GetFormValue("RevenueMandal");
                            addcase.Caseyear = GetFormValue("RevenueYear");
                            addcase.RefNo = GetFormValue("RevenueRefNo");
                            addcase.Caseno = GetFormValue("Revenuetxtno");
                        }

                        addcase.RevenueJanpad = HttpUtility.HtmlDecode(GetFormValue("RevenueJanpad"));
                        addcase.RevenueTahsil = HttpUtility.HtmlDecode(GetFormValue("RevenueTahsil"));
                        addcase.RevenueCourtName = GetFormValue("RevenueCourtName");

                    }
                    //For Rera Court start
                    else if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["divSCHCDistrict"]).ToString() == "7")  //using rera court
                    {
                        addcase.ReraCourt = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ReraCourt"]).Trim();
                        addcase.Reracasetype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["reracasetype"]).Trim();
                        addcase.Reracasno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["reracasno"]).Trim();
                        addcase.Username = WebConfigurationManager.AppSettings["matteridname"] + LoggedInUser.UserId.ToString();
                        addcase.Reracaseyear = QueryAES.UrlDecode(HttpContext.Current.Request.Form["reracaseyear"]).Trim();
                        addcase.ReraRefNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["reraRefNo"]).Trim();
                    }
                    //END
                    else
                    {
                        if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() != "0")//For highCourt,Supreme court,Tribunals Addition
                        {
                            addcase.Caseno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtno"]).ToString();
                            addcase.Caseyear = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpYear"]).ToString();
                            addcase.Casetype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drptype"]).ToString();
                            if (addcase.Casetype == "null")
                            {
                                addcase.Casetype = null;
                            }
                            addcase.Court = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString();
                            addcase.FileNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtFileNo"]).ToString();
                            addcase.BenchID = "";
                            addcase.SideID = "";
                            addcase.Courttitle = "";
                            addcase.Stampreg = "";
                            addcase.Matterid = null;
                            addcase.Diaryno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtDiaryNo"]).ToString();
                            // addcase.Casedetail = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casedetails"]).ToString();
                            addcase.Suffix = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtsuffix"]).ToString();
                            if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "SC" || QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "DE")
                            {
                                if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtDiaryNo"]).ToString() != "")
                                {
                                    addcase.Casetype = "";
                                }
                            }
                            if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "KA")
                            {
                                addcase.BenchID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpKAbench"]).ToString();
                            }
                            else if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "MH")
                            {
                                if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpGoa"]).ToString() == "")
                                {
                                    addcase.BenchID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpbench"]).ToString();
                                    addcase.SideID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpside"]).ToString();
                                    addcase.Courttitle = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpGoa"]).ToString();
                                    addcase.Stampreg = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpstampregister"]).ToString();
                                }
                                else
                                {
                                    addcase.Courttitle = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpGoa"]).ToString();
                                }
                            }
                            else if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "NL" || QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "CT" ||
                                QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "NC" || QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "DT"
                                || QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "CF" || QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "CI"
                                || QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "RC" || QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "NGT"
                                || QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "GS")
                            {
                                addcase.BenchID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpNCBench"]).ToString();
                                if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "CF")
                                {
                                    if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpNCBench"]).ToString() == "E")
                                    {
                                        addcase.TriState = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpncdrcstate"]).ToString());
                                        addcase.District = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpncdrcDistrict"]));
                                    }
                                    if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpNCBench"]).ToString() == "C")
                                    {
                                        addcase.TriState = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpncdrcstate"]).ToString());
                                    }
                                    if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpNCBench"]).ToString() == "B")
                                    {
                                        addcase.District = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpncdrcDistrict"]));
                                    }
                                }
                            }
                            else if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "IT" || QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "CE" || QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "NGT")
                            {
                                addcase.BenchID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpNCBench"]).ToString();
                            }
                            else if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "TN")
                            {
                                addcase.BenchID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["divTNBench"]).ToString();
                            }
                            else if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "BH")
                            {
                                addcase.BenchID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["divBHBench"]).ToString();
                            }
                            else if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "MP")
                            {
                                addcase.BenchID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["divMPBench"]).ToString();
                            }
                            else if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "RH")
                            {
                                addcase.BenchID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["divRHBench"]).ToString();
                            }
                            else if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "JK")
                            {
                                addcase.BenchID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["divJKBench"]).ToString();
                            }
                            else if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "CF")
                            {
                            }
                            else if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "UP")
                            {
                                addcase.BenchID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["divUPBench"]).ToString();
                            }
                            else if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "GH")
                            {
                                addcase.BenchID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["divGHBench"]).ToString();
                            }
                            else if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "WB")
                            {
                                addcase.BenchID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["divWBBench"]).ToString();
                            }
                            addcase.Username = WebConfigurationManager.AppSettings["matteridname"] + LoggedInUser.UserId.ToString();
                            flag = 0;
                        }
                    }
                }
                else//For District court Addition
                {
                    if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["divSCHCDistrict"]).ToString() == "3")
                    {
                        addcase.Casetype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drptype"]).ToString();
                        addcase.Caseno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtno"]).ToString();
                        addcase.Caseyear = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpYear"]).ToString();
                        addcase.Court = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtnameDC"]).ToString();
                        addcase.BenchID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpdistrictcourtname"]).ToString();
                        addcase.SideID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtcomplexestb"]).ToString();
                        addcase.Courttitle = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcompestbcourt"]).ToString();
                        addcase.Stampreg = "1";
                        addcase.Username = WebConfigurationManager.AppSettings["matteridname"] + LoggedInUser.UserId.ToString();
                        flag = 1;
                    }
                }
                var countdata1 = "";
                var matterid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["matterid"]).ToString();
                //validate casename exist
                var companyIds = "";
                if (matterid == "")
                {
                    var chkcase = db.usp_checkcasenameexist(LoggedInUser.FirmId.ToString(), casename.TrimEnd().TrimStart(), null, LoggedInUser.UserId.ToString()).FirstOrDefault();
                    if (chkcase == 1)
                    {
                        return Ok("Already exist matter name. please try another matter name");
                    }
                    if (!String.IsNullOrEmpty(username))
                    {
                        //check userid if exist
                        var checkuser = db.ValidateUserName(username).FirstOrDefault();
                        if (checkuser != null)
                        {
                            return Ok("Already Exists User Please Try Another User Name!");
                        }
                    }
                    // get teamlead data for create client
                    if (usertypes == "company")
                    {
                        if (checkclient == "1")
                        {
                            try
                            {
                                //get company id
                                var getusersdata = db.usp_wf_GetClientDetails(Guid.Parse(firmid), Guid.Parse(clientid)).FirstOrDefault();
                                companyIds = getusersdata.CompanyId.ToString();
                            }
                            catch
                            {
                                companyIds = Guid.Empty.ToString();
                            }
                        }
                        else
                        {
                            try
                            {
                                if (clientcontact == null && clientid != "00000000-0000-0000-0000-000000000000")
                                {
                                    companyIds = newcompanyid;
                                }
                                else
                                {
                                    var getusersdata = db.usp_SingleContactsDetails(firmid, userid, null, clientcontact).FirstOrDefault();
                                    companyIds = getusersdata.CompanyId;
                                }
                            }
                            catch
                            {
                                companyIds = Guid.Empty.ToString();
                            }
                        }
                    }
                    //upload files in azure server
                    var httpRequest = HttpContext.Current.Request;
                    files = postedFiledata;
                    var countdatas = "";
                    var caseid = "";
                }
                var OtherCourtName = "";
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var drpcourtname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString();
                if (drpcourtname.ToString() == "" || drpcourtname.ToString() == null || drpcourtname.ToString() == "null")
                {
                    if (addcase.RevenueCourt == "RELK" || addcase.RevenueCourt == "RERH")
                    {
                        OtherCourtName = addcase.RevenueCourt == "RELK" ? "Lucknow" : "Rajasthan";
                    }
                }
                else
                {
                    //check limit
                    var modulelimit = db.usp_GetFirmLimit(LoggedInUser.FirmId.ToString()).FirstOrDefault();
                    if (modulelimit != null)
                    {
                        //get total livecase count
                        if (modulelimit.IsCWActive == 1)
                        {
                            var caselivecount = db.Usp_CountLiveCaseUpdateLimit(LoggedInUser.FirmId.ToString()).FirstOrDefault();
                            if (caselivecount != 0)
                            {
                                if (!String.IsNullOrEmpty(modulelimit.icwcaselimit))
                                {
                                    if (caselivecount >= Convert.ToInt32(modulelimit.icwcaselimit))
                                    {
                                        return Ok("livecaselimitexceed");
                                    }
                                }
                                else
                                {
                                    return Ok("livecaselimitnotfound");
                                }
                            }
                        }
                        else
                        {
                            return Ok("livecasenotactive");
                        }
                    }
                    else
                    {
                        return Ok("livecaseaccessdenied");
                    }
                }
                var caseinfo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseinfo"]).ToString();
                try
                {
                    if (matterid == "")
                    {
                        matterid = countdata1;
                    }
                    else
                    {
                        matterid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(matterid));
                    }
                }
                catch
                {
                    matterid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["matterid"]).ToString();
                }
                //start managing the casewatch exception
                var divSCHCDistrict = QueryAES.UrlDecode(HttpContext.Current.Request.Form["divSCHCDistrict"]);
                var drpcourtnamed = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]);
                var drpdistrictcourtname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpdistrictcourtname"]);
                var drpdistrictcourtfullname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpdistrictcourtfullname"]);
                var drpdcourtcnr1 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpdcourtcnr1"]);
                var mattertypetext = QueryAES.UrlDecode(HttpContext.Current.Request.Form["mattertypetext"]);
                var othercourttxt = QueryAES.UrlDecode(HttpContext.Current.Request.Form["othercourttxt"]);
                var districtothercourt = QueryAES.UrlDecode(HttpContext.Current.Request.Form["districtothercourt"]);
                var districtcourtsatate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["districtcourtsatate"]);
                var districtcourtdistrict = QueryAES.UrlDecode(HttpContext.Current.Request.Form["districtcourtdistrict"]);
                var Courtname = "";

                var CaseExternalNo = "";
                if (divSCHCDistrict == "1")
                {
                    if (addcase.Diaryno != "")
                    {
                        CaseExternalNo = "Diary No-" + "" + addcase.Diaryno + "/" + addcase.Caseyear;
                    }
                    else
                    {
                        CaseExternalNo = mattertypetext + " " + addcase.Caseno + "/" + addcase.Caseyear;
                    }

                    Courtname = "Supreme Court";
                    OtherCourtName = "Supreme Court";
                }
                else if (divSCHCDistrict == "2")
                {
                    CaseExternalNo = mattertypetext + " " + addcase.Caseno + "/" + addcase.Caseyear;
                    Courtname = "High Court";
                    OtherCourtName = othercourttxt;
                }
                else if (divSCHCDistrict == "3")
                {
                    if (!String.IsNullOrEmpty(drpdcourtcnr1))
                    {
                        CaseExternalNo = "(CNR-No." + drpdcourtcnr1 + ")";
                        Courtname = "District Court";
                        OtherCourtName = districtcourtsatate + "/" + districtcourtdistrict + "/" + districtothercourt;
                        if (OtherCourtName == "Select Your State / UT//")
                        {
                            OtherCourtName = "";
                        }
                    }
                    else
                    {
                        CaseExternalNo = mattertypetext + " " + addcase.Caseno + "/" + addcase.Caseyear;
                        Courtname = "District Court";
                        OtherCourtName = districtcourtsatate + "/" + districtcourtdistrict + "/" + districtothercourt;
                    }

                }
                else if (divSCHCDistrict == "4")
                {
                    if (addcase.Diaryno != "")
                    {
                        CaseExternalNo = "Diary No-" + "" + addcase.Diaryno + "/" + addcase.Caseyear;
                    }
                    else
                    {
                        //CaseExternalNo = mattertypetext + " " + addcase.Caseno + "/" + addcase.Caseyear;
                        CaseExternalNo = mattertypetext + " " + addcase.Caseno + "" + (addcase.Caseyear == "0" ? "" : "/" + addcase.Caseyear);
                    }
                    Courtname = "Tribunals";
                    OtherCourtName = othercourttxt;
                }
                else if (divSCHCDistrict == "5")
                {
                    CaseExternalNo = mattertypetext + " " + addcase.Caseno + "/" + addcase.Caseyear;
                    Courtname = "Add a Court";
                    OtherCourtName = othercourttxt;
                }
                else if (divSCHCDistrict == "6")
                {
                    CaseExternalNo = addcase.RevenueCourt == "RELK" ?
                    mattertypetext + " " + addcase.Caseno + "/" + addcase.Caseyear : mattertypetext + " " + addcase.Caseno;
                    Courtname = "Revenue Court";
                    OtherCourtName = addcase.RevenueCourt == "RELK" ? "Lucknow" : "Rajasthan";
                }
                else if (divSCHCDistrict == "7")
                {
                    CaseExternalNo = addcase.Reracasetype + " " + addcase.Reracasno + "/" + addcase.Reracaseyear;
                    Courtname = "RERA Court";
                    OtherCourtName = "RERA Court";
                }
                else { }

                var countdata = "";
                try
                {
                    countdata = Repository.Matter.LitigationAddCaseToCW(firmid, userid, divSCHCDistrict.ToString(), Convert.ToString(drpcourtnamed),
                        Convert.ToString(drpdistrictcourtname), Convert.ToString(drpdistrictcourtfullname), Convert.ToString(drpdcourtcnr1), addcase,
                        useremail, usermobile, apiUrl, caseinfo, usertypes, clientid, casename, CaseExternalNo, clientcontact, casetype, auserid, details, username,
                        confirmPassword, checkclient, files, odate, LoggedInUser.RoleId.ToString(), companyIds, assignuser, Courtname, OtherCourtName, drpdcourtcnr1, LoggedInUser.IsCaseWatchUser,
                        LoggedInUser.UserName.ToString());
                }
                catch
                {
                    countdata = "Sorry! Unable to Add now.";
                }
                if (countdata == "Exist")
                {
                    countdata = countdata;
                }
                else if (countdata == "Case entry Limit Exceeded, Please upgrade your plan." || countdata.ToString() == "Case entry Limit Exceeded, Please upgrade your plan.")
                {
                    countdata = "Case entry Limit Exceeded, Please upgrade your plan.";
                }
                else if (countdata == "Case Detail Already Exists!!" || countdata.ToString() == "Case Detail Already Exist!!")
                {
                    countdata = "Exist";
                }
                else if (countdata == "Sorry!Unable to Add now.")
                {
                    countdata = "Sorry! Unable to Add now.";
                }
                else if (countdata == "emailexist")
                {
                    countdata = "Sorry! Unable to Add now.";
                }
                else if (countdata == "livecaselimitexceed")
                {
                    countdata = "livecaselimitexceed";
                }
                else if (countdata != "")
                {
                    //start matter documnent craetion part
                    var caseid = countdata;
                    try
                    {
                        try
                        {
                            int pageid = 0;
                            var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("caselist")).FirstOrDefault();
                            if (pagelist != null)
                            {
                                pageid = Convert.ToInt32(pagelist.ParentPage);
                            }
                            var checkroles = db.usp_GetUserbyId(firmid, auserid).FirstOrDefault();
                            if (checkroles != null)
                            {
                                if (checkroles.roleid != 1)
                                {
                                    var roweffected2 = db.usp_SaveUserDefaultCaseRights(firmid, userid, auserid, caseid, pageid);
                                    //for partner
                                    if (!String.IsNullOrEmpty(checkroles.PartnerId))
                                    {
                                        var roweffected4 = db.usp_SaveUserDefaultCaseRights(firmid, userid, checkroles.PartnerId, caseid, pageid);
                                    }
                                }
                            }
                            if (LoggedInUser.RoleId != 1)
                            {
                                //for creator
                                var checkroles1 = db.usp_GetUserbyId(firmid, userid).FirstOrDefault();
                                if (checkroles1 != null)
                                {
                                    var roweffected2 = db.usp_SaveUserDefaultCaseRights(firmid, userid, userid, caseid, pageid);
                                    //for partner
                                    if (!String.IsNullOrEmpty(checkroles1.PartnerId))
                                    {
                                        var roweffected4 = db.usp_SaveUserDefaultCaseRights(firmid, userid, checkroles1.PartnerId, caseid, pageid);
                                    }
                                }
                            }
                        }
                        catch { }
                        try
                        {
                            int pageid = 0;
                            var pagelist = db.usp_GetDocRightsPageDatabyPagelink(Convert.ToString("Case Documents")).FirstOrDefault();
                            if (pagelist != null)
                            {
                                pageid = Convert.ToInt32(pagelist.Id);
                            }
                            var checkroles = db.usp_GetUserbyId(firmid, auserid).FirstOrDefault();
                            if (checkroles != null)
                            {
                                if (checkroles.roleid != 1)
                                {
                                    var roweffected2 = db.usp_SaveUserDefaultCaseRights(firmid, userid, auserid, caseid, pageid);
                                    //for partner
                                    if (!String.IsNullOrEmpty(checkroles.PartnerId))
                                    {
                                        var roweffected4 = db.usp_SaveUserDefaultCaseRights(firmid, userid, checkroles.PartnerId, caseid, pageid);
                                    }
                                }
                            }
                            if (LoggedInUser.RoleId != 1)
                            {
                                //for creator
                                var checkroles1 = db.usp_GetUserbyId(firmid, userid).FirstOrDefault();
                                if (checkroles1 != null)
                                {
                                    var roweffected2 = db.usp_SaveUserDefaultCaseRights(firmid, userid, userid, caseid, pageid);
                                    //for partner
                                    if (!String.IsNullOrEmpty(checkroles1.PartnerId))
                                    {
                                        var roweffected4 = db.usp_SaveUserDefaultCaseRights(firmid, userid, checkroles1.PartnerId, caseid, pageid);
                                    }
                                }
                            }
                        }
                        catch { }
                    }
                    catch
                    {
                    }
                    if (caseid != "")
                    {
                        var newcasefolderid = "";
                        var dpaths = "";
                        int maxFileSize = Convert.ToInt32(WebConfigurationManager.AppSettings["docelasticmaxFileSize"]);
                        var id = "";
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
                            IDParameter = new ObjectParameter("id", id);
                            var data = db1.usp_SaveFilefolderCloudNew(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), dname.TrimStart().TrimEnd(), dpaths, 0, directoryid.ToString(), null, null, null, IDParameter, caseid, null, 0, "1", null, null);
                            newcasefolderid = Convert.ToString(IDParameter.Value);
                        }
                    }
                    countdata = "success";
                }
                //
                var param = controllername + ">AddCaseLiveUpdateToCW>AddCaseLiveUpdateToCW>param=" + firmid + "@" + userid;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(countdata);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }
        /// <summary>
        /// Search Case Add Live Update
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SearchCaseAddLiveUpdate()
        {
            var myList = new List<string>();
            dynamic postedFiledata = "";
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
                var getuseremil = db.usp_GetEmailByUserId(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).FirstOrDefault();
                if (getuseremil.cmobile != null)
                {
                    usermobile = getuseremil.cmobile;
                }
                if (getuseremil.EmailId != null)
                {
                    useremail = getuseremil.EmailId;
                }
                var Cnrnos = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Cnrnos"]);
                var Casetypes = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Casetypes"]);
                var Casenos = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Casenos"]);
                var Caseyears = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Caseyears"]);
                var AppealNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["AppealNo"]);
                var Courts = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Courts"]);
                var BenchIDs = QueryAES.UrlDecode(HttpContext.Current.Request.Form["BenchIDs"]);
                var StateIds = QueryAES.UrlDecode(HttpContext.Current.Request.Form["StateIds"]);
                var Districtids = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Districtids"]);
                var Courttypes = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Courttypes"]);
                var casenames = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casenames"]);
                var mhearingdates = QueryAES.UrlDecode(HttpContext.Current.Request.Form["mhearingdates"]);
                var madvocatenames = QueryAES.UrlDecode(HttpContext.Current.Request.Form["madvocatenames"]);
                var Courtcompestbtypes = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Courtcompestbtypes"]);
                var Courtcompestbcourts = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Courtcompestbcourts"]);
                var mkcasenames = QueryAES.UrlDecode(HttpContext.Current.Request.Form["mkcasenames"]);
                var mkId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["mkId"]);
                var teammemberlist = QueryAES.UrlDecode(HttpContext.Current.Request.Form["teammemberlist"]);
                //Added today
                var othercourttxt = QueryAES.UrlDecode(HttpContext.Current.Request.Form["othercourttxt"]);
                //End
                var suffix = QueryAES.UrlDecode(HttpContext.Current.Request.Form["suffix"]);
                var sideId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["sideId"]);
                var stampReg = QueryAES.UrlDecode(HttpContext.Current.Request.Form["stampReg"]);
                var Username = WebConfigurationManager.AppSettings["matteridname"] + LoggedInUser.UserId.ToString();
                if (!string.IsNullOrEmpty(mkId))
                {
                    try
                    {
                        mkId = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(mkId));
                    }
                    catch { }

                }
                if (teammemberlist == "undefined" || teammemberlist == "null")
                {
                    teammemberlist = "";
                }
                //validate casename exist
                if (string.IsNullOrEmpty(mkId))
                {
                    var chkcase = db.usp_checkcasenameexist(LoggedInUser.FirmId.ToString(), mkcasenames.TrimEnd().TrimStart(), null, LoggedInUser.UserId.ToString()).FirstOrDefault();
                    if (chkcase == 1)
                    {
                        return Ok("Already exist matter name. please try another matter name");
                    }
                    if (Courts.ToString() == "" || Courts.ToString() == null || Courts.ToString() == "null")
                    { }
                    else
                    {
                        //check limit
                        var modulelimit = db.usp_GetFirmLimit(LoggedInUser.FirmId.ToString()).FirstOrDefault();
                        if (modulelimit != null)
                        {
                            //get total livecase count
                            if (modulelimit.IsCWActive == 1)
                            {
                                var caselivecount = db.Usp_CountLiveCaseUpdateLimit(LoggedInUser.FirmId.ToString()).FirstOrDefault();
                                if (caselivecount != 0)
                                {
                                    if (!String.IsNullOrEmpty(modulelimit.icwcaselimit))
                                    {
                                        if (caselivecount >= Convert.ToInt32(modulelimit.icwcaselimit))
                                        {
                                            return Ok("livecaselimitexceed");
                                        }
                                    }
                                    else
                                    {
                                        return Ok("livecaselimitnotfound");
                                    }
                                }
                            }
                            else
                            {
                                return Ok("livecasenotactive");
                            }
                        }
                        else
                        {
                            return Ok("livecaseaccessdenied");
                        }
                    }
                }
                //upload files in azure server
                var httpRequest = HttpContext.Current.Request;
                files = postedFiledata;
                var countdatas = "";
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var courtName = "";
                var caseExternalNo = "";
                var cnrNo = "";
                var OtherCourtName = "";
                //For Adding the court details
                if (Courttypes == "1")
                {
                    caseExternalNo = AppealNo;
                    courtName = "Supreme Court";
                }
                else if (Courttypes == "2")
                {
                    caseExternalNo = AppealNo;
                    courtName = "High Court";
                    OtherCourtName = othercourttxt;
                }
                else if (Courttypes == "3")
                {
                    if (!String.IsNullOrEmpty(Cnrnos))
                    {
                        //caseExternalNo = AppealNo;
                        caseExternalNo = AppealNo + "<br>(CNR-No. " + Cnrnos + ")";
                        courtName = "District Court";
                    }
                    else
                    {
                        caseExternalNo = AppealNo;
                        courtName = "District Court";
                        OtherCourtName = othercourttxt;
                    }

                }
                else if (Courttypes == "4")
                {
                    caseExternalNo = AppealNo;
                    courtName = "Tribunals";
                    OtherCourtName = othercourttxt;
                }
                else if (Courttypes == "5")
                {
                    caseExternalNo = AppealNo;
                    courtName = "Add a Court";
                    OtherCourtName = othercourttxt;
                }
                else if (Courttypes == "6")
                {
                    caseExternalNo = AppealNo;
                    courtName = "Revenue Court";
                    OtherCourtName = "Revenue Court";
                }
                else if (Courttypes == "7")
                {
                    caseExternalNo = AppealNo;
                    courtName = "RERA Court";
                    OtherCourtName = "RERA Court";
                }
                else { }
                //
                //start managing the casewatch exception
                var countdata = "";
                try
                {
                    countdata = Repository.Matter.SearchAddCaseToLiveupdate(firmid, userid, useremail, usermobile, apiUrl, LoggedInUser.RoleId.ToString(),
                        Cnrnos, Casetypes, Casenos, Caseyears, AppealNo, Courts, BenchIDs, StateIds, Districtids, Courttypes, casenames,
                        mhearingdates, madvocatenames, Courtcompestbtypes, Courtcompestbcourts, suffix, mkcasenames, teammemberlist, Username,
                        caseExternalNo, courtName, OtherCourtName, LoggedInUser.IsCaseWatchUser, LoggedInUser.UserName.ToString(), stampReg, sideId, mkId);
                }
                catch
                {
                    countdata = "Sorry! Unable to Add now.";
                }
                if (countdata == "Exist")
                {
                    countdata = countdata;
                }
                else if (countdata == "Case entry Limit Exceeded, Please upgrade your plan." || countdata.ToString() == "Case entry Limit Exceeded, Please upgrade your plan.")
                {
                    countdata = "Case entry Limit Exceeded, Please upgrade your plan.";
                }
                else if (countdata == "Case Detail Already Exists!!" || countdata.ToString() == "Case Detail Already Exist!!")
                {
                    countdata = "Exist";
                }
                else if (countdata == "Sorry!Unable to Add now.")
                {
                    countdata = "Sorry! Unable to Add now.";
                }
                else if (countdata == "livecaselimitexceed")
                {
                    countdata = "Case entry Limit Exceeded, Please upgrade your plan.";
                }
                else if (countdata == "Invalid email")
                {
                    countdata = "Email Id not present";
                }
                else if (countdata == "Invalid member mobile")
                {
                    countdata = "Mobile No not present";
                }
                else if (countdata != "")
                {
                    //start matter documnent craetion part
                    var caseid = countdata;
                    try
                    {
                        try
                        {
                            int pageid = 0;
                            var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("caselist")).FirstOrDefault();
                            if (pagelist != null)
                            {
                                pageid = Convert.ToInt32(pagelist.ParentPage);
                            }
                            var checkroles = db.usp_GetUserbyId(firmid, userid).FirstOrDefault();
                            if (checkroles != null)
                            {
                                if (checkroles.roleid != 1)
                                {
                                    var roweffected2 = db.usp_SaveUserDefaultCaseRights(firmid, userid, userid, caseid, pageid);
                                    //for partner
                                    if (!String.IsNullOrEmpty(checkroles.PartnerId))
                                    {
                                        var roweffected4 = db.usp_SaveUserDefaultCaseRights(firmid, userid, checkroles.PartnerId, caseid, pageid);
                                    }
                                }
                            }
                            if (LoggedInUser.RoleId != 1)
                            {
                                //for creator
                                var checkroles1 = db.usp_GetUserbyId(firmid, userid).FirstOrDefault();
                                if (checkroles1 != null)
                                {
                                    var roweffected2 = db.usp_SaveUserDefaultCaseRights(firmid, userid, userid, caseid, pageid);
                                    //for partner
                                    if (!String.IsNullOrEmpty(checkroles1.PartnerId))
                                    {
                                        var roweffected4 = db.usp_SaveUserDefaultCaseRights(firmid, userid, checkroles1.PartnerId, caseid, pageid);
                                    }
                                }
                            }
                        }
                        catch { }
                        try
                        {
                            int pageid = 0;
                            var pagelist = db.usp_GetDocRightsPageDatabyPagelink(Convert.ToString("Case Documents")).FirstOrDefault();
                            if (pagelist != null)
                            {
                                pageid = Convert.ToInt32(pagelist.Id);
                            }
                            var checkroles = db.usp_GetUserbyId(firmid, userid).FirstOrDefault();
                            if (checkroles != null)
                            {
                                if (checkroles.roleid != 1)
                                {
                                    var roweffected2 = db.usp_SaveUserDefaultCaseRights(firmid, userid, userid, caseid, pageid);
                                    //for partner
                                    if (!String.IsNullOrEmpty(checkroles.PartnerId))
                                    {
                                        var roweffected4 = db.usp_SaveUserDefaultCaseRights(firmid, userid, checkroles.PartnerId, caseid, pageid);
                                    }
                                }
                            }
                            if (LoggedInUser.RoleId != 1)
                            {
                                //for creator
                                var checkroles1 = db.usp_GetUserbyId(firmid, userid).FirstOrDefault();
                                if (checkroles1 != null)
                                {
                                    var roweffected2 = db.usp_SaveUserDefaultCaseRights(firmid, userid, userid, caseid, pageid);
                                    //for partner
                                    if (!String.IsNullOrEmpty(checkroles1.PartnerId))
                                    {
                                        var roweffected4 = db.usp_SaveUserDefaultCaseRights(firmid, userid, checkroles1.PartnerId, caseid, pageid);
                                    }
                                }
                            }
                        }
                        catch { }
                    }
                    catch
                    {
                    }
                    if (caseid != "")
                    {
                        var newcasefolderid = "";
                        var dpaths = "";
                        int maxFileSize = Convert.ToInt32(WebConfigurationManager.AppSettings["docelasticmaxFileSize"]);
                        var id = "";
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
                            IDParameter = new ObjectParameter("id", id);
                            var data = db1.usp_SaveFilefolderCloudNew(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), dname.TrimStart().TrimEnd(), dpaths, 0, directoryid.ToString(), null, null, null, IDParameter, caseid, null, 0, "1", null, null);
                            newcasefolderid = Convert.ToString(IDParameter.Value);
                        }
                    }
                    countdata = "success";
                }
                //
                var param = controllername + ">SearchCaseAddLiveUpdate>SearchCaseAddLiveUpdate>param=" + firmid + "@" + userid;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(countdata);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Search Case Add Live Update
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SearchCaseAddLiveUpdateRERH()
        {
            var myList = new List<string>();
            dynamic postedFiledata = "";
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
                var getuseremil = db.usp_GetEmailByUserId(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).FirstOrDefault();
                if (getuseremil.cmobile != null)
                {
                    usermobile = getuseremil.cmobile;
                }
                if (getuseremil.EmailId != null)
                {
                    useremail = getuseremil.EmailId;
                }
                var Cnrnos = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Cnrnos"]);
                var Casetypes = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Casetypes"]);
                var Casenos = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Casenos"]);
                var Caseyears = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Caseyears"]);
                var AppealNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["appealNo"]);
                var Courts = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Courts"]);
                var BenchIDs = QueryAES.UrlDecode(HttpContext.Current.Request.Form["BenchIDs"]);
                var StateIds = QueryAES.UrlDecode(HttpContext.Current.Request.Form["StateIds"]);
                var Districtids = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Districtids"]);
                var Courttypes = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Courttypes"]);
                var casenames = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casenames"]);
                var mhearingdates = QueryAES.UrlDecode(HttpContext.Current.Request.Form["mhearingdates"]);
                var madvocatenames = QueryAES.UrlDecode(HttpContext.Current.Request.Form["madvocatenames"]);
                var Courtcompestbtypes = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Courtcompestbtypes"]);
                var Courtcompestbcourts = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Courtcompestbcourts"]);
                var mkcasenames = QueryAES.UrlDecode(HttpContext.Current.Request.Form["mkcasenames"]);
                var mkId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["mkId"]);
                var teammemberlist = QueryAES.UrlDecode(HttpContext.Current.Request.Form["teammemberlist"]);
                //Added today
                var othercourttxt = QueryAES.UrlDecode(HttpContext.Current.Request.Form["othercourttxt"]);
                //End
                var suffix = QueryAES.UrlDecode(HttpContext.Current.Request.Form["suffix"]);
                var sideId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["sideId"]);
                var stampReg = QueryAES.UrlDecode(HttpContext.Current.Request.Form["stampReg"]);
                var Username = WebConfigurationManager.AppSettings["matteridname"] + LoggedInUser.UserId.ToString();
                if (!string.IsNullOrEmpty(mkId))
                {
                    try
                    {
                        mkId = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(mkId));
                    }
                    catch { }

                }
                if (teammemberlist == "undefined" || teammemberlist == "null")
                {
                    teammemberlist = "";
                }
                //validate casename exist
                if (string.IsNullOrEmpty(mkId))
                {
                    var chkcase = db.usp_checkcasenameexist(LoggedInUser.FirmId.ToString(), mkcasenames.TrimEnd().TrimStart(), null, LoggedInUser.UserId.ToString()).FirstOrDefault();
                    if (chkcase == 1)
                    {
                        return Ok("Already exist matter name. please try another matter name");
                    }
                    if (Courts.ToString() == "" || Courts.ToString() == null || Courts.ToString() == "null")
                    { }
                    else
                    {
                        //check limit
                        var modulelimit = db.usp_GetFirmLimit(LoggedInUser.FirmId.ToString()).FirstOrDefault();
                        if (modulelimit != null)
                        {
                            //get total livecase count
                            if (modulelimit.IsCWActive == 1)
                            {
                                var caselivecount = db.Usp_CountLiveCaseUpdateLimit(LoggedInUser.FirmId.ToString()).FirstOrDefault();
                                if (caselivecount != 0)
                                {
                                    if (!String.IsNullOrEmpty(modulelimit.icwcaselimit))
                                    {
                                        if (caselivecount >= Convert.ToInt32(modulelimit.icwcaselimit))
                                        {
                                            return Ok("livecaselimitexceed");
                                        }
                                    }
                                    else
                                    {
                                        return Ok("livecaselimitnotfound");
                                    }
                                }
                            }
                            else
                            {
                                return Ok("livecasenotactive");
                            }
                        }
                        else
                        {
                            return Ok("livecaseaccessdenied");
                        }
                    }
                }
                //upload files in azure server
                var httpRequest = HttpContext.Current.Request;
                files = postedFiledata;
                var countdatas = "";
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var courtName = "";
                var caseExternalNo = "";
                var cnrNo = "";
                var OtherCourtName = "";
                //For Adding the court details
                caseExternalNo = AppealNo;
                courtName = "Revenue Court";
                OtherCourtName = "Rajasthan";
                //
                //start managing the casewatch exception
                var countdata = "";
                try
                {
                    var vCourt = QueryAES.UrlDecode(HttpContext.Current.Request.Form["vCourt"]);
                    var Appres = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Appres"]);
                    var appealNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["appealNo"]);
                    var District = QueryAES.UrlDecode(HttpContext.Current.Request.Form["District"]);
                    var CourtType = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CourtType"]);
                    var courtNameR = QueryAES.UrlDecode(HttpContext.Current.Request.Form["cType"]);
                    var Status = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Status"]);
                    countdata = Repository.Matter.SearchAddCaseToLiveupdateRERH(firmid, userid, useremail, usermobile, apiUrl, LoggedInUser.RoleId.ToString(),
                            Cnrnos, Casetypes, Casenos, Caseyears, AppealNo, Courts, BenchIDs, StateIds, Districtids, Courttypes, casenames,
                            mhearingdates, madvocatenames, Courtcompestbtypes, Courtcompestbcourts, suffix, mkcasenames, teammemberlist, Username,
                            caseExternalNo, courtName, OtherCourtName, LoggedInUser.IsCaseWatchUser, LoggedInUser.UserName.ToString(), stampReg, sideId, mkId, Appres, appealNo,
                            District, CourtType, courtNameR, Status);
                }
                catch
                {
                    countdata = "Sorry! Unable to Add now.";
                }
                if (countdata == "Exist")
                {
                    countdata = countdata;
                }
                else if (countdata == "Case entry Limit Exceeded, Please upgrade your plan." || countdata.ToString() == "Case entry Limit Exceeded, Please upgrade your plan.")
                {
                    countdata = "Case entry Limit Exceeded, Please upgrade your plan.";
                }
                else if (countdata == "Case Detail Already Exists!!" || countdata.ToString() == "Case Detail Already Exist!!")
                {
                    countdata = "Exist";
                }
                else if (countdata == "Sorry!Unable to Add now.")
                {
                    countdata = "Sorry! Unable to Add now.";
                }
                else if (countdata == "livecaselimitexceed")
                {
                    countdata = "Case entry Limit Exceeded, Please upgrade your plan.";
                }
                else if (countdata != "")
                {
                    //start matter documnent craetion part
                    var caseid = countdata;
                    try
                    {
                        try
                        {
                            int pageid = 0;
                            var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("caselist")).FirstOrDefault();
                            if (pagelist != null)
                            {
                                pageid = Convert.ToInt32(pagelist.ParentPage);
                            }
                            var checkroles = db.usp_GetUserbyId(firmid, userid).FirstOrDefault();
                            if (checkroles != null)
                            {
                                if (checkroles.roleid != 1)
                                {
                                    var roweffected2 = db.usp_SaveUserDefaultCaseRights(firmid, userid, userid, caseid, pageid);
                                    //for partner
                                    if (!String.IsNullOrEmpty(checkroles.PartnerId))
                                    {
                                        var roweffected4 = db.usp_SaveUserDefaultCaseRights(firmid, userid, checkroles.PartnerId, caseid, pageid);
                                    }
                                }
                            }
                            if (LoggedInUser.RoleId != 1)
                            {
                                //for creator
                                var checkroles1 = db.usp_GetUserbyId(firmid, userid).FirstOrDefault();
                                if (checkroles1 != null)
                                {
                                    var roweffected2 = db.usp_SaveUserDefaultCaseRights(firmid, userid, userid, caseid, pageid);
                                    //for partner
                                    if (!String.IsNullOrEmpty(checkroles1.PartnerId))
                                    {
                                        var roweffected4 = db.usp_SaveUserDefaultCaseRights(firmid, userid, checkroles1.PartnerId, caseid, pageid);
                                    }
                                }
                            }
                        }
                        catch { }
                        try
                        {
                            int pageid = 0;
                            var pagelist = db.usp_GetDocRightsPageDatabyPagelink(Convert.ToString("Case Documents")).FirstOrDefault();
                            if (pagelist != null)
                            {
                                pageid = Convert.ToInt32(pagelist.Id);
                            }
                            var checkroles = db.usp_GetUserbyId(firmid, userid).FirstOrDefault();
                            if (checkroles != null)
                            {
                                if (checkroles.roleid != 1)
                                {
                                    var roweffected2 = db.usp_SaveUserDefaultCaseRights(firmid, userid, userid, caseid, pageid);
                                    //for partner
                                    if (!String.IsNullOrEmpty(checkroles.PartnerId))
                                    {
                                        var roweffected4 = db.usp_SaveUserDefaultCaseRights(firmid, userid, checkroles.PartnerId, caseid, pageid);
                                    }
                                }
                            }
                            if (LoggedInUser.RoleId != 1)
                            {
                                //for creator
                                var checkroles1 = db.usp_GetUserbyId(firmid, userid).FirstOrDefault();
                                if (checkroles1 != null)
                                {
                                    var roweffected2 = db.usp_SaveUserDefaultCaseRights(firmid, userid, userid, caseid, pageid);
                                    //for partner
                                    if (!String.IsNullOrEmpty(checkroles1.PartnerId))
                                    {
                                        var roweffected4 = db.usp_SaveUserDefaultCaseRights(firmid, userid, checkroles1.PartnerId, caseid, pageid);
                                    }
                                }
                            }
                        }
                        catch { }
                    }
                    catch
                    {
                    }
                    if (caseid != "")
                    {
                        var newcasefolderid = "";
                        var dpaths = "";
                        int maxFileSize = Convert.ToInt32(WebConfigurationManager.AppSettings["docelasticmaxFileSize"]);
                        var id = "";
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
                            IDParameter = new ObjectParameter("id", id);
                            var data = db1.usp_SaveFilefolderCloudNew(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), dname.TrimStart().TrimEnd(), dpaths, 0, directoryid.ToString(), null, null, null, IDParameter, caseid, null, 0, "1", null, null);
                            newcasefolderid = Convert.ToString(IDParameter.Value);
                        }
                    }
                    countdata = "success";
                }
                //
                var param = controllername + ">SearchCaseAddLiveUpdate>SearchCaseAddLiveUpdate>param=" + firmid + "@" + userid;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(countdata);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }


        /// <summary>
        /// For Department Wise Matter Count
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult DepartmentWiseMatterCount()
        {
            try
            {
                var firmId = LoggedInUser.FirmId.ToString();
                var cacheKey = "DepartmentWiseMatterCount_" + firmId;

                var lazy = MemoryCache.Default.Get(cacheKey) as Lazy<List<Usp_GetmattertbyDepartmentwise_Result>>;
                if (lazy == null)
                {
                    var newLazy = new Lazy<List<Usp_GetmattertbyDepartmentwise_Result>>(() =>
                    {
                        var db = new LawPracticeEntities();
                        return db.Usp_GetmattertbyDepartmentwise(firmId, LoggedInUser.UserId.ToString(), 0).ToList();
                    });
                    var existing = MemoryCache.Default.AddOrGetExisting(cacheKey, newLazy, DateTimeOffset.Now.AddMinutes(30));
                    lazy = (existing as Lazy<List<Usp_GetmattertbyDepartmentwise_Result>>) ?? newLazy;
                }
                return Ok(lazy.Value);
            }
            catch (Exception ex)
            {
                return Ok("");
            }

        }
        /// <summary>
        ///  Save Calculator value //Custom requirements for TASL
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SaveCalCulator()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var dateofvaluation = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dateofvaluation"]);
                var lwdofworkman = QueryAES.UrlDecode(HttpContext.Current.Request.Form["lwdofworkman"]);
                var claimdate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["claimdate"]);
                var matterid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["matterid"]);
                var ageofclm = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ageofclaim"]);
                var backwagespayable = QueryAES.UrlDecode(HttpContext.Current.Request.Form["backwagespayable"]);
                var numberofmonth = QueryAES.UrlDecode(HttpContext.Current.Request.Form["numberofmonth"]);
                var lastCTCpermonth = QueryAES.UrlDecode(HttpContext.Current.Request.Form["lastCTCpermonth"]);
                var principalclmamt = QueryAES.UrlDecode(HttpContext.Current.Request.Form["principalclmamt"]);
                var intersetclmperannum = QueryAES.UrlDecode(HttpContext.Current.Request.Form["intersetclmperannum"]);
                var totintrestpayable = QueryAES.UrlDecode(HttpContext.Current.Request.Form["totintrestpayable"]);
                matterid = matterid.Replace(" ", "+");
                try
                {
                    matterid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(matterid));
                }
                catch { }
                Savedatamodelforcalculator obj = new Savedatamodelforcalculator();
                obj.FirmId = LoggedInUser.FirmId.ToString();
                obj.UserId = LoggedInUser.UserId.ToString();
                obj.Natureofclm = QueryAES.UrlDecode(HttpContext.Current.Request.Form["natureofclaim"]);
                if (dateofvaluation != "")
                {
                    obj.Valuationdate = dateofvaluation;
                }
                if (claimdate != "")
                {
                    obj.Claimdate = claimdate;
                }
                else
                {
                    //obj.Claimdate = Convert.ToDateTime("01-1-1900");
                }
                if (lwdofworkman != "")
                {
                    obj.LWDOfWorkman = lwdofworkman;
                }
                else
                {
                    //obj.LWDOfWorkman = Convert.ToDateTime("01-1-1900");
                }
                var anyotheraddval = QueryAES.UrlDecode(HttpContext.Current.Request.Form["anyaddvaluations"]);
                if (anyotheraddval != "")
                {
                    obj.AdditionalValuation = Convert.ToDecimal(anyotheraddval);
                }
                var totvaluation = QueryAES.UrlDecode(HttpContext.Current.Request.Form["totalvaluationas"]);
                if (totvaluation != "")
                {
                    obj.TotalValuation = Convert.ToDecimal(totvaluation);
                }
                if (lastCTCpermonth != "")
                {
                    obj.LastCTCPermonth = Convert.ToDecimal(lastCTCpermonth);
                }
                if (numberofmonth != "")
                {
                    obj.Numberofmonth = Convert.ToDecimal(numberofmonth);
                }
                if (backwagespayable != "")
                {
                    obj.Backwagespayable = Convert.ToDecimal(backwagespayable);
                }
                if (ageofclm != "")
                {
                    obj.AgeofClm = Convert.ToDecimal(ageofclm);
                }
                if (principalclmamt != "")
                {
                    obj.PrincipalCLMAmt = Convert.ToDecimal(principalclmamt);
                }
                if (intersetclmperannum != "")
                {
                    obj.IntrCLMPerAnnum = Convert.ToDecimal(intersetclmperannum);
                }
                if (totintrestpayable != "")
                {
                    obj.TotalInterPayble = Convert.ToDecimal(totintrestpayable);
                }
                obj.MatterId = matterid;
                var cases1 = Repository.Matter.SaveCalculator(obj);
                return Ok(cases1);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }

        /// <summary>
        ///  Get Calculator value //Custom requirements for TASL
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CalCulatorByCaseId()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var matterid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["matterid"]);
                var calcluatorId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["calcluatorId"]);
                matterid = matterid.Replace(" ", "+");
                try
                {
                    matterid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(matterid));
                }
                catch { }
                var cases1 = Repository.Matter.GetCalCulatorValues(firmid, userid, matterid);
                return Ok(cases1);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }

        /// <summary>
        ///  Update Calculator value //Custom requirements for TASL
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult UpdateCalCulator()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var dateofvaluation = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dateofvaluation"]);
                var lwdofworkman = QueryAES.UrlDecode(HttpContext.Current.Request.Form["lwdofworkman"]);
                var claimdate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["claimdate"]);
                var matterid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["matterid"]);
                var ageofclm = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ageofclaim"]);
                var backwagespayable = QueryAES.UrlDecode(HttpContext.Current.Request.Form["backwagespayable"]);
                var numberofmonth = QueryAES.UrlDecode(HttpContext.Current.Request.Form["numberofmonth"]);
                var lastCTCpermonth = QueryAES.UrlDecode(HttpContext.Current.Request.Form["lastCTCpermonth"]);
                var principalclmamt = QueryAES.UrlDecode(HttpContext.Current.Request.Form["principalclmamt"]);
                var intersetclmperannum = QueryAES.UrlDecode(HttpContext.Current.Request.Form["intersetclmperannum"]);
                var totintrestpayable = QueryAES.UrlDecode(HttpContext.Current.Request.Form["totintrestpayable"]);
                matterid = matterid.Replace(" ", "+");
                try
                {
                    matterid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(matterid));
                }
                catch { }
                Savedatamodelforcalculator obj = new Savedatamodelforcalculator();
                obj.FirmId = LoggedInUser.FirmId.ToString();
                obj.UserId = LoggedInUser.UserId.ToString();
                obj.Natureofclm = QueryAES.UrlDecode(HttpContext.Current.Request.Form["natureofclaim"]);
                if (dateofvaluation != "")
                {
                    obj.Valuationdate = dateofvaluation;
                }
                if (claimdate != "")
                {
                    obj.Claimdate = claimdate;
                }
                //else
                //{
                //    obj.Claimdate = Convert.ToDateTime("01-1-1900");
                //}
                if (lwdofworkman != "")
                {
                    obj.LWDOfWorkman = lwdofworkman;
                }
                //else
                //{
                //    obj.LWDOfWorkman = Convert.ToDateTime("01-1-1900");
                //}
                var anyothervalutions = QueryAES.UrlDecode(HttpContext.Current.Request.Form["anyaddvaluations"]);
                if (anyothervalutions != "")
                {
                    obj.AdditionalValuation = Convert.ToDecimal(anyothervalutions);
                }
                var totvaluatios = QueryAES.UrlDecode(HttpContext.Current.Request.Form["totalvaluationas"]);
                if (totvaluatios != "")
                {
                    obj.TotalValuation = Convert.ToDecimal(totvaluatios);
                }
                if (lastCTCpermonth != "")
                {
                    obj.LastCTCPermonth = Convert.ToDecimal(lastCTCpermonth);
                }
                if (numberofmonth != "")
                {
                    obj.Numberofmonth = Convert.ToDecimal(numberofmonth);
                }
                if (backwagespayable != "")
                {
                    obj.Backwagespayable = Convert.ToDecimal(backwagespayable);
                }
                if (ageofclm != "")
                {
                    obj.AgeofClm = Convert.ToDecimal(ageofclm);
                }
                if (principalclmamt != "")
                {
                    obj.PrincipalCLMAmt = Convert.ToDecimal(principalclmamt);
                }
                if (intersetclmperannum != "")
                {
                    obj.IntrCLMPerAnnum = Convert.ToDecimal(intersetclmperannum);
                }
                if (totintrestpayable != "")
                {
                    obj.TotalInterPayble = Convert.ToDecimal(totintrestpayable);
                }
                obj.MatterId = matterid;
                var cases1 = Repository.Matter.SaveCalculator(obj);
                return Ok(cases1);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }
        /// <summary>
        /// CW Matter Details By UserCaseId
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CWMatterDetailsByUserCaseId()
        {
            try
            {
                var db = new LawPracticeEntities();
                var caseidtoken = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseid"]);
                try
                {
                    caseidtoken = caseidtoken.Replace(" ", "+");
                    caseidtoken = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseidtoken));
                }
                catch { }
                var matterIDCase = db.Usp_MattersDetilsForCW(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), caseidtoken.ToString()).FirstOrDefault();
                var a = JsonConvert.SerializeObject(matterIDCase);
                return Ok(a);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// CW Matter Update
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CWMatterUpdate()
        {
            try
            {
                var db = new LawPracticeEntities();
                var caseidtoken = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CWUserCaseIds"]);
                var MatterName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CWMatterName"]);
                var MatterIds = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Matterids"]);
                // validate casename exist
                var chkcase = db.usp_checkcasenameexist(LoggedInUser.FirmId.ToString(), MatterName.TrimEnd().TrimStart(), null, LoggedInUser.UserId.ToString()).FirstOrDefault();
                if (chkcase == 1)
                {
                    return Ok("exist");
                }
                try
                {
                    caseidtoken = caseidtoken.Replace(" ", "+");
                    caseidtoken = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseidtoken));
                }
                catch { }
                var cases1 = Repository.Matter.EditCWMatter(MatterName, MatterIds, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                return Ok(cases1);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// CW Matter Save
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CWMatterSave()
        {
            try
            {
                var db = new LawPracticeEntities();
                var caseidtoken = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CWUserCaseIds"]);
                var MatterName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CWMatterName"]);
                var casenos = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casenos"]);
                var courtname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["courtname"]);
                var othercourtname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["othercourtname"]);
                try
                {
                    caseidtoken = caseidtoken.Replace(" ", "+");
                    caseidtoken = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseidtoken));
                }
                catch { }
                // validate casename exist
                var chkcase = db.usp_checkcasenameexist(LoggedInUser.FirmId.ToString(), MatterName.TrimEnd().TrimStart(), null, LoggedInUser.UserId.ToString()).FirstOrDefault();
                if (chkcase == 1)
                {
                    return Ok("exist");
                }
                //End Case Limit section
                var result = "";
                var countdata = "";
                countdata = Repository.Matter.SaveCWMatter(MatterName, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(),
                    casenos, courtname, othercourtname, caseidtoken, LoggedInUser.FirmId.ToString(), LoggedInUser.RoleId.ToString());
                //For creating the Matter Folder
                if (countdata != "")
                {
                    result = "sucess";
                    var caseid = countdata;
                    var newcasefolderid = "";
                    int maxFileSize = Convert.ToInt32(WebConfigurationManager.AppSettings["docelasticmaxFileSize"]);
                    var id = "";
                    var dpaths = "";
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
                        IDParameter = new ObjectParameter("id", id);
                        var data = db1.usp_SaveFilefolderCloudNew(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), dname.TrimStart().TrimEnd(), dpaths, 0, directoryid.ToString(), null, null, null, IDParameter, caseid, null, 0, "1", null, null);
                        newcasefolderid = Convert.ToString(IDParameter.Value);
                    }
                }
                else
                {
                    result = "Error";
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }
        /// <summary>
        /// Case Type chart count customize By BPCL 
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CustomCaseTypeChartCount()
        {
            string chartdata = "";
            var filterid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtervalue"]);
            try
            {
                LawPracticeEntities db = new LawPracticeEntities();
                var CaseTypedata = db.Usp_GetCustomCaseTypeWiseCount(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).ToList();
                return Ok(CaseTypedata);
            }
            catch (Exception ex)
            {
                return Ok(chartdata);
            }
        }
        /// <summary>
        /// State wise chart count customize By Syngenta  Client
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CustomStateTypeChartCount()
        {
            string chartdata = "";
            var filterid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtervalue"]);
            try
            {
                LawPracticeEntities db = new LawPracticeEntities();
                var CaseTypedata = db.Usp_GetCustomStateWiseGraphCount(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).ToList();
                return Ok(CaseTypedata);
            }
            catch (Exception ex)
            {
                return Ok(chartdata);
            }
        }
        /// <summary>
        /// Load sebi case list
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadSebiNewCaseList()
        {
            try
            {
                var odate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["odate"]);
                var casename = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casename"]);
                var clientname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["clientname"]);
                var court = QueryAES.UrlDecode(HttpContext.Current.Request.Form["court"]);
                var cstatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["cstatus"]);
                var searchuser = QueryAES.UrlDecode(HttpContext.Current.Request.Form["users"]);
                int pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                int pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                var createdby = QueryAES.UrlDecode(HttpContext.Current.Request.Form["createdby"]);
                var filtervalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtervalue"]);
                //Add companyfilter
                var companynamefiltervalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["companyfilter"]);
                var mattertypefiltervalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["mattertypefilter"]);
                var subjecttypefiltervalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["subjecttypefilter"]);
                var casefilternotes = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casefilternotes"]);
                var casefiltercourtname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casefiltercourtname"]);
                var odateto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["odateto"]);
                var fillingdate = "";
                var fillingdateto = "";
                var searchcustomcolname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["searchcustomcolname"]);
                var searchcustomcolvalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["searchcustomcolvalue"]);
                var filtercasedisposeoption = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casedisposefilter"]);
                //Add new filter as per new requirement
                var casefilterCaseDetails = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casefilterCaseDetails"]);
                var casefiltermtrno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casefiltermtrno"]);
                var casefilterInternalno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casefilterInternalno"]);
                var casefiltercnrno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casefiltercnrno"]);
                var caseredirectfilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseredirectfilter"]);
                //Add new next hearing date range filter
                var NextHearingfromd = QueryAES.UrlDecode(HttpContext.Current.Request.Form["NextHearingfromd"]);
                var NextHearingtod = QueryAES.UrlDecode(HttpContext.Current.Request.Form["NextHearingtod"]);
                var courtstatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CourtStatusfiletr"]);
                var hearingsorting = QueryAES.UrlDecode(HttpContext.Current.Request.Form["hearingsorting"]);
                var casedetailsfilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casedetailsfilter"]);

                if (filtercasedisposeoption == "null" || filtercasedisposeoption == null)
                {
                    filtercasedisposeoption = "";
                }
                var FiledByAgainstfilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Filed_By_Againstfilter"]);
                var FavourAgainstfilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Favour_Againstfilter"]);
                var DeptTypefilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["DeptType_filter"]);
                var IsCaseArchived = "";
                IsCaseArchived = QueryAES.UrlDecode(HttpContext.Current.Request.Form["IsCaseArchived"]);

                int pageid = 0;
                var pagelist = db1.usp_GetRightsPageDatabyPagelink(Convert.ToString("caselist")).FirstOrDefault();
                if (pagelist != null)
                {
                    pageid = Convert.ToInt32(pagelist.ParentPage);
                }
                LawPracticeEntities db = new LawPracticeEntities();
                if (LoggedInUser.RoleId == 1)
                {
                    if (String.IsNullOrEmpty(searchuser))
                    {
                        var pageaccesslist = DataAccessADO.loadnewcaselistSebi(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), pagenum,
                        pagesize, odate, casename, clientname, court, cstatus, createdby, Convert.ToInt32(filtervalue), companynamefiltervalue,
                        mattertypefiltervalue.ToString(), subjecttypefiltervalue.ToString(), casefilternotes, casefiltercourtname, odateto,
                        fillingdate, fillingdateto, IsCaseArchived, searchcustomcolname, searchcustomcolvalue, filtercasedisposeoption,
                        casefilterCaseDetails, casefiltermtrno, casefilterInternalno, casefiltercnrno, caseredirectfilter, NextHearingfromd, NextHearingtod,
                        courtstatus, hearingsorting, casedetailsfilter, FiledByAgainstfilter, FavourAgainstfilter, Convert.ToString(LoggedInUser.IsCaseWatchUser), DeptTypefilter);
                        //var cases1 = Repository.Matter.loadnewcaselistSebi(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), pagenum,
                        //pagesize, odate, casename, clientname, court, cstatus, createdby, Convert.ToInt32(filtervalue), companynamefiltervalue,
                        //mattertypefiltervalue.ToString(), subjecttypefiltervalue.ToString(), casefilternotes, casefiltercourtname, odateto,
                        //fillingdate, fillingdateto, IsCaseArchived, searchcustomcolname, searchcustomcolvalue, filtercasedisposeoption,
                        //casefilterCaseDetails, casefiltermtrno, casefilterInternalno, casefiltercnrno, caseredirectfilter, NextHearingfromd, NextHearingtod,
                        //courtstatus, hearingsorting, casedetailsfilter, FiledByAgainstfilter,FavourAgainstfilter, Convert.ToString(LoggedInUser.IsCaseWatchUser));
                        var param = controllername + ">LoadNewCaseList>loadnewcaselist>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId.ToString() + "@" + pagenum + "@" + pagesize + "@" + odate + "@" + casename + "@" + clientname + "@" + court + "@" + cstatus + "@" + createdby + "@" + Convert.ToInt32(filtervalue) + "@" + companynamefiltervalue + "@" + mattertypefiltervalue.ToString() + "@" + subjecttypefiltervalue.ToString() + "@" + casefilternotes + "@" + casefiltercourtname + "@" + odateto + "@" + fillingdate + "@" + fillingdateto + "@" + IsCaseArchived;
                        db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");

                        return Ok(pageaccesslist);
                    }
                    else
                    {

                        var pageaccesslist = DataAccessADO.loadSebiusernewcaselist(LoggedInUser.FirmId.ToString(), searchuser, pagenum,
                            pagesize, odate, casename, clientname, court, cstatus, Convert.ToInt32(LoggedInUser.RoleId), pageid, createdby, Convert.ToInt32(filtervalue), companynamefiltervalue,
                            mattertypefiltervalue.ToString(), subjecttypefiltervalue.ToString(), casefilternotes, casefiltercourtname, odateto,
                            fillingdate, fillingdateto, IsCaseArchived, searchcustomcolname, searchcustomcolvalue, filtercasedisposeoption,
                            casefilterCaseDetails, casefiltermtrno, casefilterInternalno, casefiltercnrno, caseredirectfilter, NextHearingfromd,
                            NextHearingtod, courtstatus, hearingsorting, casedetailsfilter, FiledByAgainstfilter, FavourAgainstfilter, Convert.ToString(LoggedInUser.IsCaseWatchUser), DeptTypefilter);
                        // var cases1 = Repository.Matter.loadSebiusernewcaselist(LoggedInUser.FirmId.ToString(), searchuser, pagenum, pagesize,
                        // odate, casename, clientname, court, cstatus, 1, createdby, Convert.ToInt32(filtervalue), companynamefiltervalue,
                        // mattertypefiltervalue.ToString(), subjecttypefiltervalue.ToString(), casefilternotes, casefiltercourtname,
                        // odateto, fillingdate, fillingdateto, IsCaseArchived, searchcustomcolname, searchcustomcolvalue, filtercasedisposeoption,
                        // casefilterCaseDetails, casefiltermtrno, casefilterInternalno, casefiltercnrno, caseredirectfilter, NextHearingfromd, NextHearingtod,
                        // courtstatus, hearingsorting, casedetailsfilter, FiledByAgainstfilter, FavourAgainstfilter);
                        var param = controllername + ">LoadNewCaseList>loadusernewcaselist>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId.ToString() + "@" + pagenum + "@" + pagesize + "@" + odate + "@" + casename + "@" + clientname + "@" + court + "@" + cstatus + "@" + createdby + "@" + Convert.ToInt32(filtervalue) + "@" + companynamefiltervalue + "@" + mattertypefiltervalue.ToString() + "@" + subjecttypefiltervalue.ToString() + "@" + casefilternotes + "@" + casefiltercourtname + "@" + odateto + "@" + fillingdate + "@" + fillingdateto + "@" + IsCaseArchived;
                        db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                        return Ok(pageaccesslist);
                    }
                }
                else if (LoggedInUser.RoleId == 2)
                {

                    var pageaccesslist = DataAccessADO.loadSebiusernewcaselist(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), pagenum,
                           pagesize, odate, casename, clientname, court, cstatus, Convert.ToInt32(LoggedInUser.RoleId), pageid, createdby, Convert.ToInt32(filtervalue), companynamefiltervalue,
                           mattertypefiltervalue.ToString(), subjecttypefiltervalue.ToString(), casefilternotes, casefiltercourtname, odateto,
                           fillingdate, fillingdateto, IsCaseArchived, searchcustomcolname, searchcustomcolvalue, filtercasedisposeoption,
                           casefilterCaseDetails, casefiltermtrno, casefilterInternalno, casefiltercnrno, caseredirectfilter, NextHearingfromd,
                           NextHearingtod, courtstatus, hearingsorting, casedetailsfilter, FiledByAgainstfilter, FavourAgainstfilter, Convert.ToString(LoggedInUser.IsCaseWatchUser), DeptTypefilter);
                    //var cases1 = Repository.Matter.loadSebiusernewcaselist(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(),
                    //pagenum, pagesize, odate, casename, clientname, court, cstatus, 2, createdby, Convert.ToInt32(filtervalue),
                    //companynamefiltervalue, mattertypefiltervalue.ToString(), subjecttypefiltervalue.ToString(), casefilternotes,
                    //casefiltercourtname, odateto, fillingdate, fillingdateto, IsCaseArchived, searchcustomcolname, searchcustomcolvalue,
                    //filtercasedisposeoption, casefilterCaseDetails, casefiltermtrno, casefilterInternalno, casefiltercnrno,
                    //caseredirectfilter, NextHearingfromd, NextHearingtod, courtstatus, hearingsorting, casedetailsfilter, FiledByAgainstfilter, FavourAgainstfilter);
                    var param = controllername + ">LoadNewCaseList>LoadUserNewCaseList>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId.ToString() + "@" + pagenum + "@" + pagesize + "@" + odate + "@" + casename + "@" + clientname + "@" + court + "@" + cstatus + "@" + createdby + "@" + Convert.ToInt32(filtervalue) + "@" + companynamefiltervalue + "@" + mattertypefiltervalue.ToString() + "@" + subjecttypefiltervalue.ToString() + "@" + casefilternotes + "@" + casefiltercourtname + "@" + odateto + "@" + fillingdate + "@" + fillingdateto + "@" + IsCaseArchived;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                    return Ok(pageaccesslist);
                }
                else
                {
                    return Ok("");
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult OtherMatterDetailsById()
        {
            try
            {
                var db = new LawPracticeEntities();
                var metterId = HttpContext.Current.Request.Form["MatterId"];
                var result = DataAccessADO.GetSebiMatterOtherDetails(metterId);
                // var result = db.sp_GetSebiMatterOtherDetails(metterId).ToList().FirstOrDefault();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        //Added by prem kumar For Sebi work
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SaveAndUpdateMatterOtherDetails()
        {
            try
            {
                var db = new LawPracticeEntities();
                var ULN = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ULN"]);
                var NatureOfCase = HttpContext.Current.Request.Form["NatureOfCase"];
                var MatterType = HttpContext.Current.Request.Form["MatterType"];
                var MatterOf = HttpContext.Current.Request.Form["MatterOf"];
                var BriefOfMatter = HttpContext.Current.Request.Form["BriefOfMatter"];
                var Relevance = HttpContext.Current.Request.Form["Relevance"];
                var IssuesInvolved = HttpContext.Current.Request.Form["IssuesInvolved"];
                var NatureOfViolation = HttpContext.Current.Request.Form["NatureOfViolation"];
                var Casecategory = HttpContext.Current.Request.Form["Casecategory"];
                var DateOfImpugned = HttpContext.Current.Request.Form["DateOfImpugned"];
                var IssuingAuthority = HttpContext.Current.Request.Form["IssuingAuthority"];
                var DirectionUnderTheOrder = HttpContext.Current.Request.Form["DirectionUnderTheOrder"];
                var ReplyField = HttpContext.Current.Request.Form["ReplyField"];
                var MatterStage = HttpContext.Current.Request.Form["MatterStage"];
                var StayOrder = HttpContext.Current.Request.Form["StayOrder"];
                var DateOfStayOrder = HttpContext.Current.Request.Form["DateOfStayOrder"];
                var NameOfParty = HttpContext.Current.Request.Form["NameOfParty"];
                var DateTill = HttpContext.Current.Request.Form["DateTill"];
                var ExtendedTill = HttpContext.Current.Request.Form["ExtendedTill"];
                var StayVacatedOn = HttpContext.Current.Request.Form["StayVacatedOn"];
                var DirectionOfCourt = HttpContext.Current.Request.Form["DirectionOfCourt"];
                var ExpactedDateOfCompliance = HttpContext.Current.Request.Form["ExpactedDateOfCompliance"];
                var OprationDepartmentInchargeOFCompliance = HttpContext.Current.Request.Form["OprationDepartmentInchargeOFCompliance"];
                var DateOfCompliance = HttpContext.Current.Request.Form["DateOfCompliance"];
                var DisposalInFavour = HttpContext.Current.Request.Form["DisposalInFavour"];
                var NatureOfDisposal = HttpContext.Current.Request.Form["NatureOfDisposal"];
                var OperationDepartmentForThePurposeOfSeeking = HttpContext.Current.Request.Form["OperationDepartmentForThePurposeOfSeeking"];
                var NameOfTheDealingOfficer = HttpContext.Current.Request.Form["NameOfTheDealingOfficer"];
                var NameOfOfficer = HttpContext.Current.Request.Form["NameOfOfficer"];
                var ProformaParty = HttpContext.Current.Request.Form["ProformaParty"];
                var MarketActivity = HttpContext.Current.Request.Form["MarketActivity"];
                var GovernmentAuthorityParty = HttpContext.Current.Request.Form["GovernmentAuthorityParty"];
                var Remarks = HttpContext.Current.Request.Form["Remarks"];
                var MatterId = HttpContext.Current.Request.Form["MatterId"];
                var solicitor = HttpContext.Current.Request.Form["solicitor"];
                var courtorder = HttpContext.Current.Request.Form["courtorder"];
                var connectedmatters = HttpContext.Current.Request.Form["connectedmatters"];
                var result = DataAccessADO.SaveCWMatterOtherDetails(ULN, NatureOfCase, MatterType, MatterOf, BriefOfMatter, Relevance, IssuesInvolved, NatureOfViolation, Casecategory
                                           , DateOfImpugned, IssuingAuthority, DirectionUnderTheOrder, ReplyField, MatterStage, StayOrder, DateOfStayOrder, NameOfParty,
            DateTill, ExtendedTill, StayVacatedOn, DirectionOfCourt, ExpactedDateOfCompliance, OprationDepartmentInchargeOFCompliance,
            DateOfCompliance, DisposalInFavour, NatureOfDisposal, OperationDepartmentForThePurposeOfSeeking, NameOfTheDealingOfficer, NameOfOfficer, ProformaParty,
            MarketActivity, GovernmentAuthorityParty, Remarks, MatterId, solicitor, courtorder, connectedmatters);


                //    var result = Repository.Matter.SaveCWMatterOtherDetails(ULN, NatureOfCase, MatterType, MatterOf, BriefOfMatter, Relevance, IssuesInvolved, NatureOfViolation, Casecategory
                //                               , DateOfImpugned, IssuingAuthority, DirectionUnderTheOrder, ReplyField, MatterStage, StayOrder, DateOfStayOrder, NameOfParty,
                //DateTill, ExtendedTill, StayVacatedOn, DirectionOfCourt, ExpactedDateOfCompliance, OprationDepartmentInchargeOFCompliance,
                //DateOfCompliance, DisposalInFavour, NatureOfDisposal, OperationDepartmentForThePurposeOfSeeking, NameOfTheDealingOfficer, NameOfOfficer, ProformaParty,
                //MarketActivity, GovernmentAuthorityParty, Remarks, MatterId);
                return Ok(result);

            }
            catch (Exception ex)
            {
                return Ok(ex.Message);

            }
        }
        //File List Get Sebi 
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ViewSebiFileList()
        {
            try
            {
                var PageNo = HttpContext.Current.Request.Form["PageNo"];
                var SearchText = HttpContext.Current.Request.Form["SearchText"];
                var PageSize = HttpContext.Current.Request.Form["PageSize"];
                var db = new LawPracticeEntities();
                var result = DataAccessADO.ViewSebiFileList(SearchText, Convert.ToInt32(PageSize), Convert.ToInt32(PageNo));
                //   var result = db.sp_GetSebiForwardBackwardJudgeMentList(SearchText, Convert.ToInt32(PageSize), Convert.ToInt32(PageNo)).ToList();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }
        /// <summary>
        /// Updatefavouragaint
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult Updatefavouragaint()
        {
            try
            {
                string matterid = HttpContext.Current.Request.Form["matterid"];
                string usercaseid = HttpContext.Current.Request.Form["usercaseid"];
                string ActionStatus = HttpContext.Current.Request.Form["ActionStatus"];
                string FirmID = LoggedInUser.FirmId.ToString();
                string UserID = LoggedInUser.UserId.ToString();
                var db = new LawPracticeEntities();
                try
                {
                    matterid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(matterid));
                }
                catch (Exception)
                {
                }
                try
                {
                    usercaseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(usercaseid));
                }
                catch (Exception)
                {
                }
                //int result = DataAccessADO.UpdateFavAgainCase(matterid, UserID, usercaseid, FirmID, ActionStatus);
                //if (result > 0)
                //{
                //    var response = new
                //    {
                //        StatusCode = true,
                //        Message = "Successfully",
                //        data = ""
                //    };
                //    return Ok(response); // Return the response here
                //}
                //else
                //{
                //    var response = new
                //    {
                //        StatusCode = false,
                //        Message = "No Record Found",
                //        data = ""
                //    };
                //    return Ok(response); // Return the response here
                //}
                string db_manuconn = System.Configuration.ConfigurationManager.ConnectionStrings["ApplicationContext"].ConnectionString;
                using (SqlConnection conn = new SqlConnection(db_manuconn))
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand("sp_UpdateFavAgainCase", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@Matterid", matterid);
                        cmd.Parameters.AddWithValue("@UserID", UserID);
                        cmd.Parameters.AddWithValue("@UserCaseid", usercaseid);
                        cmd.Parameters.AddWithValue("@FirmID", FirmID);
                        cmd.Parameters.AddWithValue("@ActionStatus", ActionStatus);

                        int result = cmd.ExecuteNonQuery();
                        conn.Close();
                        if (result > 0)
                        {
                            var response = new
                            {
                                StatusCode = true,
                                Message = "Successfully",
                                data = ""
                            };
                            return Ok(response); // Return the response here
                        }
                        else
                        {
                            var response = new
                            {
                                StatusCode = false,
                                Message = "No Record Found",
                                data = ""
                            };
                            return Ok(response); // Return the response here
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                var response = new
                {
                    StatusCode = false,
                    Message = ex.Message,
                    data = ""
                };
                return Ok(response);
            }
        }

        /// <summary>
        /// Update Department Type
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult UpdateDepartmentType()
        {
            string status = "";
            try
            {
                string matterid = HttpContext.Current.Request.Form["matterid"];
                string usercaseid = HttpContext.Current.Request.Form["usercaseid"];
                string DepartmentType = HttpContext.Current.Request.Form["DepartmentType"];
                string DepartmentText = HttpContext.Current.Request.Form["DepartmentTypeText"];
                string FirmID = LoggedInUser.FirmId.ToString();
                string UserID = LoggedInUser.UserId.ToString();
                var db = new LawPracticeEntities();
                try
                {
                    matterid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(matterid));
                }
                catch (Exception)
                {
                }
                //API Call Update Department Type
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
                        UserId = userId,
                        CaseId = usercaseid,
                        branchcode = DepartmentType,
                        destination = DepartmentText
                    };
                    addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    string builders = JsonConvert.SerializeObject(rawfile);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/MappedAndUpdateDepartmentWithUsercaseid"), "POST", builders);
                    dynamic data = JObject.Parse(resid);
                    status = data.Status;
                }

                catch (Exception ex) { }
                if (status == "True")
                {
                    string db_manuconn = System.Configuration.ConfigurationManager.ConnectionStrings["ApplicationContext"].ConnectionString;
                    using (SqlConnection conn = new SqlConnection(db_manuconn))
                    {
                        conn.Open();
                        using (SqlCommand cmd = new SqlCommand("sp_UpdateDepartmentType", conn))
                        {
                            cmd.CommandType = CommandType.StoredProcedure;
                            cmd.Parameters.AddWithValue("@Matterid", matterid);
                            cmd.Parameters.AddWithValue("@UserID", UserID);
                            cmd.Parameters.AddWithValue("@UserCaseid", usercaseid);
                            cmd.Parameters.AddWithValue("@FirmID", FirmID);
                            cmd.Parameters.AddWithValue("@DepartmentType", DepartmentText);

                            int result = cmd.ExecuteNonQuery();
                            conn.Close();
                            if (result > 0)
                            {
                                var response = new
                                {
                                    StatusCode = true,
                                    Message = "Successfully",
                                    data = ""
                                };
                                return Ok(response);
                            }
                            else
                            {
                                var response = new
                                {
                                    StatusCode = false,
                                    Message = "No Record Found",
                                    data = ""
                                };
                                return Ok(response);
                            }
                        }
                    }
                }
                else
                {
                    var response = new
                    {
                        StatusCode = false,
                        Message = "No Record Found",
                        data = ""
                    };
                    return Ok(response);
                }

            }
            catch (Exception ex)
            {
                var response = new
                {
                    StatusCode = false,
                    Message = ex.Message,
                    data = ""
                };
                return Ok(response);
            }
        }


        /// <summary>
        /// GetSEBIFavourAgainstbycaseid
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult BindSEBIFavourAgainstbycaseid()
        {
            try
            {
                string matterid = HttpContext.Current.Request.Form["matterid"];
                string usercaseid = HttpContext.Current.Request.Form["usercaseid"];
                string FirmID = LoggedInUser.FirmId.ToString();
                string UserID = LoggedInUser.UserId.ToString();
                var db = new LawPracticeEntities();

                //string Message = DataAccessADO.GetSEBIFavourAgainstbycaseid(matterid, UserID, Convert.ToInt32(usercaseid), FirmID);
                //if (Message != "No data found.")
                //{
                //    return Ok(new { Status = true, Data = Message });
                //}
                //else
                //{
                //    return Ok(new { Status = true, Data = "No data found." });

                //}
                string db_manuconn = System.Configuration.ConfigurationManager.ConnectionStrings["ApplicationContext"].ConnectionString;
                using (SqlConnection conn = new SqlConnection(db_manuconn))
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand("sp_GetSEBIFavourAgainstbycaseid", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@Matterid", matterid);
                        cmd.Parameters.AddWithValue("@UserID", UserID);
                        cmd.Parameters.AddWithValue("@UserCaseid", usercaseid);
                        cmd.Parameters.AddWithValue("@FirmID", FirmID);
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                string message = reader["ActionStatus"].ToString(); // Adjust according to your data column
                                return Ok(new { Status = true, Data = message });
                            }
                            else
                            {
                                return Ok(new { Status = false, Message = "No data found." });
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                var response = new
                {
                    StatusCode = false,
                    Message = ex.Message,
                    data = ""
                };
                return Ok(response);
            }
        }

        [FirmApiAuthorization()]
        [FirmControllerAuthorization]
        [System.Web.Mvc.HttpPost]
        public string CWUpdateFiledByStatus()
        {
            string matterid = HttpContext.Current.Request.Form["matterid"];
            string FiledByStatus = HttpContext.Current.Request.Form["FiledByStatus"];
            try
            {
                matterid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(matterid));
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
                    FiledAgainstStatus = FiledByStatus,
                    CaseId = matterid
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/CWUpdateFiledAgainstBy"), "POST", builders);

                dynamic jObject = JObject.Parse(resid);
                dynamic data1 = jObject["data"];
                for (int i = 0; i < data1.Count; i++)
                {
                    Int64 usercaseid = data1[i].usercaseiid;
                    //int result = DataAccessADO.UpdateFiledAgaistbyusercaseid(usercaseid, FiledByStatus);
                    string db_manuconn = System.Configuration.ConfigurationManager.ConnectionStrings["ApplicationContext"].ConnectionString;
                    using (System.Data.SqlClient.SqlConnection conn = new System.Data.SqlClient.SqlConnection(db_manuconn))
                    {
                        conn.Open();
                        using (System.Data.SqlClient.SqlCommand cmd = new System.Data.SqlClient.SqlCommand("sp_UpdateFiledAgaistbyusercaseid  ", conn))
                        {
                            cmd.CommandType = CommandType.StoredProcedure;
                            cmd.Parameters.AddWithValue("@usercaseid", usercaseid);
                            cmd.Parameters.AddWithValue("@FiledAgainstStatus", FiledByStatus);
                            int result1 = cmd.ExecuteNonQuery();
                            conn.Close();
                            if (result1 > 0)
                            {
                            }
                            else
                            {
                            }
                        }
                    }
                }
                JObject obj = JObject.Parse(resid);
                string newJson = JsonConvert.SerializeObject(obj);
                return newJson;

            }
            catch (Exception ex) { return ex.Message.ToString(); }
        }

        /// <summary>
        /// Insert and Update the BridgeStone Matter Other Details
        /// @Author Prem Kumar
        /// @param matterId,PlaintiffDefendant,Summary,isUnknown,Defendant,Plaintiff,Probability_of_Exposure,Realised_Financial_Costs,Realised_Claims
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult BridgeStoneMatterOtherDetailsUpdate()
        {
            try
            {
                var matterId = HttpContext.Current.Request.Form["matterId"];
                var PlaintiffDefendant = HttpContext.Current.Request.Form["PlaintiffDefendant"];
                var Summary = HttpContext.Current.Request.Form["Summary"];
                var isUnknown = HttpContext.Current.Request.Form["isUnknown"];
                var Defendant = HttpContext.Current.Request.Form["Defendant"];
                var Plaintiff = HttpContext.Current.Request.Form["Plaintiff"];
                var Probability_of_Exposure = HttpContext.Current.Request.Form["Probability_of_Exposure"];
                var Realised_Financial_Costs = HttpContext.Current.Request.Form["Realised_Financial_Costs"];
                var Realised_Claims = HttpContext.Current.Request.Form["Realised_Claims"];
                if (string.IsNullOrEmpty(PlaintiffDefendant))
                {
                    return Ok("Please Select The Plaintiff or Defendant");
                }
                try
                {
                    matterId = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(matterId));
                }
                catch (Exception ex)
                {

                }
                var db = new LawPracticeEntities();
                var result = DataAccessADO.SaveBridgeStoneOtherMatterDetailsRecord(matterId, PlaintiffDefendant, Summary, isUnknown, Defendant, Plaintiff, Probability_of_Exposure, Realised_Financial_Costs, Realised_Claims);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// @Author Prem Kumar
        /// @Param matterId
        /// Get record of matter other details By matterid
        /// </summary>
        /// <returns></returns>

        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult BridgeStoneMetterOtherDetailsByMatterId()
        {
            try
            {
                var matterId = HttpContext.Current.Request.Form["matterId"];
                try
                {
                    matterId = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(matterId));
                }
                catch (Exception ex)
                {

                }
                var db = new LawPracticeEntities();
                var result = DataAccessADO.BridgeStoneMetterOtherDetailsById(matterId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }
        /// <summary>
        /// Search Case Add Live Update
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LinkedCaseAddLiveUpdate()
        {
            var myList = new List<string>();
            dynamic postedFiledata = "";
            var db = new LawPracticeEntities();
            try
            {
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var files = "";
                var flag = 0;
                var Cnrnos = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Cnrnos"]);
                var Casetypes = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Casetypes"]);
                var Casenos = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Casenos"]);
                var Caseyears = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Caseyears"]);
                var AppealNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["AppealNo"]);
                var Courts = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Courts"]);
                var casenames = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casenames"]);
                var mkcasenames = QueryAES.UrlDecode(HttpContext.Current.Request.Form["mkcasenames"]);
                var teammemberlist = QueryAES.UrlDecode(HttpContext.Current.Request.Form["teammemberlist"]);
                var LinkedCaseUserName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["LinkedCaseUserName"]);
                var MasterCaseIds = QueryAES.UrlDecode(HttpContext.Current.Request.Form["MasterCaseIds"]);
                var ParentUserCaseIds = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ParentUserCaseIds"]);
                var LinkedCaseNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["LinkedCaseNo"]);
                var Courttypes = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Courttypes"]);
                var Scasetype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Scasetype"]);
                var slinkedcasetype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["slinkedcasetype"]);
                var Username = WebConfigurationManager.AppSettings["matteridname"] + LoggedInUser.UserId.ToString();
                if (teammemberlist == "undefined" || teammemberlist == "null")
                {
                    teammemberlist = "";
                }
                //validate casename exist
                var chkcase = db.usp_checkcasenameexist(LoggedInUser.FirmId.ToString(), mkcasenames.TrimEnd().TrimStart(), null, LoggedInUser.UserId.ToString()).FirstOrDefault();
                if (chkcase == 1)
                {
                    return Ok("Already exist matter name. please try another matter name");
                }
                //upload files in azure server
                var httpRequest = HttpContext.Current.Request;
                files = postedFiledata;
                var countdatas = "";
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var courtName = "";
                var caseExternalNo = "";
                var cnrNo = "";
                var OtherCourtName = "";
                //For Adding the court details
                if (Courttypes == "1")
                {
                    caseExternalNo = AppealNo;
                    courtName = "Supreme Court";
                }
                else if (Courttypes == "2")
                {
                    caseExternalNo = AppealNo;
                    courtName = "High Court";
                    OtherCourtName = Courts;
                    Cnrnos = "";
                }
                else if (Courttypes == "3")
                {
                    if (!String.IsNullOrEmpty(Cnrnos))
                    {
                        caseExternalNo = AppealNo;
                        courtName = "District Court";
                    }
                    else
                    {
                        caseExternalNo = AppealNo;
                        courtName = "District Court";
                        OtherCourtName = Courts;
                    }

                }
                else if (Courttypes == "4")
                {
                    caseExternalNo = AppealNo;
                    courtName = "Tribunals";
                    OtherCourtName = Courts;
                }
                else if (Courttypes == "5")
                {
                    caseExternalNo = AppealNo;
                    courtName = "Add a Court";
                    OtherCourtName = Courts;
                }
                else if (Courttypes == "6")
                {
                    caseExternalNo = AppealNo;
                    courtName = "Revenue Court";
                    OtherCourtName = "Revenue Court";
                }
                else if (Courttypes == "7")
                {
                    caseExternalNo = AppealNo;
                    courtName = "RERA Court";
                    OtherCourtName = "RERA Court";
                }
                else { }
                //
                //start managing the casewatch exception
                var countdata = "";
                try
                {
                    countdata = Repository.Matter.LinkedCaseAddCaseToLiveupdate(firmid, userid, LinkedCaseUserName, MasterCaseIds, LinkedCaseNo,
                        Cnrnos, AppealNo, Courts, mkcasenames, teammemberlist, Username, caseExternalNo, courtName, OtherCourtName, apiUrl,
                        LoggedInUser.RoleId.ToString(), LoggedInUser.IsCaseWatchUser, LoggedInUser.UserName, Casetypes, Casenos,
                        Caseyears, ParentUserCaseIds, Scasetype, slinkedcasetype);
                }
                catch
                {
                    countdata = "Sorry! Unable to Add now.";
                }
                if (countdata == "Exist")
                {
                    countdata = countdata;
                }
                else if (countdata == "Case entry Limit Exceeded, Please upgrade your plan." || countdata.ToString() == "Case entry Limit Exceeded, Please upgrade your plan.")
                {
                    countdata = "Case entry Limit Exceeded, Please upgrade your plan.";
                }
                else if (countdata == "Case Detail Already Exists!!" || countdata.ToString() == "Case Detail Already Exist!!")
                {
                    countdata = "Exist";
                }
                else if (countdata == "Sorry!Unable to Add now.")
                {
                    countdata = "Sorry! Unable to Add now.";
                }
                else if (countdata != "")
                {
                    //start matter documnent craetion part
                    var caseid = countdata;
                    try
                    {
                        try
                        {
                            int pageid = 0;
                            var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("caselist")).FirstOrDefault();
                            if (pagelist != null)
                            {
                                pageid = Convert.ToInt32(pagelist.ParentPage);
                            }
                            var checkroles = db.usp_GetUserbyId(firmid, userid).FirstOrDefault();
                            if (checkroles != null)
                            {
                                if (checkroles.roleid != 1)
                                {
                                    var roweffected2 = db.usp_SaveUserDefaultCaseRights(firmid, userid, userid, caseid, pageid);
                                    //for partner
                                    if (!String.IsNullOrEmpty(checkroles.PartnerId))
                                    {
                                        var roweffected4 = db.usp_SaveUserDefaultCaseRights(firmid, userid, checkroles.PartnerId, caseid, pageid);
                                    }
                                }
                            }
                            if (LoggedInUser.RoleId != 1)
                            {
                                //for creator
                                var checkroles1 = db.usp_GetUserbyId(firmid, userid).FirstOrDefault();
                                if (checkroles1 != null)
                                {
                                    var roweffected2 = db.usp_SaveUserDefaultCaseRights(firmid, userid, userid, caseid, pageid);
                                    //for partner
                                    if (!String.IsNullOrEmpty(checkroles1.PartnerId))
                                    {
                                        var roweffected4 = db.usp_SaveUserDefaultCaseRights(firmid, userid, checkroles1.PartnerId, caseid, pageid);
                                    }
                                }
                            }
                        }
                        catch { }
                        try
                        {
                            int pageid = 0;
                            var pagelist = db.usp_GetDocRightsPageDatabyPagelink(Convert.ToString("Case Documents")).FirstOrDefault();
                            if (pagelist != null)
                            {
                                pageid = Convert.ToInt32(pagelist.Id);
                            }
                            var checkroles = db.usp_GetUserbyId(firmid, userid).FirstOrDefault();
                            if (checkroles != null)
                            {
                                if (checkroles.roleid != 1)
                                {
                                    var roweffected2 = db.usp_SaveUserDefaultCaseRights(firmid, userid, userid, caseid, pageid);
                                    //for partner
                                    if (!String.IsNullOrEmpty(checkroles.PartnerId))
                                    {
                                        var roweffected4 = db.usp_SaveUserDefaultCaseRights(firmid, userid, checkroles.PartnerId, caseid, pageid);
                                    }
                                }
                            }
                            if (LoggedInUser.RoleId != 1)
                            {
                                //for creator
                                var checkroles1 = db.usp_GetUserbyId(firmid, userid).FirstOrDefault();
                                if (checkroles1 != null)
                                {
                                    var roweffected2 = db.usp_SaveUserDefaultCaseRights(firmid, userid, userid, caseid, pageid);
                                    //for partner
                                    if (!String.IsNullOrEmpty(checkroles1.PartnerId))
                                    {
                                        var roweffected4 = db.usp_SaveUserDefaultCaseRights(firmid, userid, checkroles1.PartnerId, caseid, pageid);
                                    }
                                }
                            }
                        }
                        catch { }
                    }
                    catch
                    {
                    }
                    if (caseid != "")
                    {
                        var newcasefolderid = "";
                        var dpaths = "";
                        int maxFileSize = Convert.ToInt32(WebConfigurationManager.AppSettings["docelasticmaxFileSize"]);
                        var id = "";
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
                            IDParameter = new ObjectParameter("id", id);
                            var data = db1.usp_SaveFilefolderCloudNew(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), dname.TrimStart().TrimEnd(), dpaths, 0, directoryid.ToString(), null, null, null, IDParameter, caseid, null, 0, "1", null, null);
                            newcasefolderid = Convert.ToString(IDParameter.Value);
                        }
                    }
                    countdata = "success";
                }
                //
                var param = controllername + ">LinkedCaseAddLiveUpdate>LinkedCaseAddLiveUpdate>param=" + firmid + "@" + userid;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(countdata);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }
        /// <summary>
        /// BOM New Customized Report
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CustomZoneDetails()
        {
            string chartdata = "";
            var Zonevalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Zonevalue"]);
            var Courtfilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["court"]);
            var CourtStatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CourtStatus"]);
            var UserAdvocate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["UserAdvocate"]);
            var Nexthearing = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Nexthearing"]);
            var Nexthearingto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Nexthearingto"]);
            var Againstthefilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Againstthefilter"]);
            var type = QueryAES.UrlDecode(HttpContext.Current.Request.Form["type"]);
            if (string.IsNullOrEmpty(type))
            {
                type = "0";
            }
            try
            {
                LawPracticeEntities db = new LawPracticeEntities();
                var result = DataAccessADO.GetZoneValue(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Zonevalue, Courtfilter, CourtStatus, UserAdvocate, Nexthearing, Nexthearingto, Againstthefilter, Convert.ToInt32(type));
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(chartdata);
            }
        }
        /// <summary>
        /// BOM New Customized Report
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult AllMattersWithCourtWise()
        {
            string chartdata = "";
            var Zonevalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Zonevalue"]);
            var Courtfilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["court"]);
            var CourtStatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CourtStatus"]);
            var UserAdvocate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["UserAdvocate"]);
            var Nexthearing = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Nexthearing"]);
            var Nexthearingto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Nexthearingto"]);
            var Againstthefilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Againstthefilter"]);
            var type = QueryAES.UrlDecode(HttpContext.Current.Request.Form["type"]);
            if (string.IsNullOrEmpty(type))
            {
                type = "0";
            }

            try
            {
                LawPracticeEntities db = new LawPracticeEntities();
                var result = DataAccessADO.GetAllMattersByCourtWise(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Zonevalue, Courtfilter, CourtStatus, UserAdvocate, Nexthearing, Nexthearingto, Againstthefilter, Convert.ToInt32(type));
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(chartdata);
            }
        }
        /// <summary>
        /// Case status chart count
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult AllCourtCaseStatusChart()
        {
            string chartdata = "";
            var Zonevalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Zonevalue"]);
            var Courtfilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["court"]);
            var CourtStatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CourtStatus"]);
            var UserAdvocate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["UserAdvocate"]);
            var Nexthearing = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Nexthearing"]);
            var Nexthearingto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Nexthearingto"]);
            var Againstthefilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Againstthefilter"]);
            var type = QueryAES.UrlDecode(HttpContext.Current.Request.Form["type"]);
            if (string.IsNullOrEmpty(type))
            {
                type = "0";
            }

            try
            {
                var result = DataAccessADO.GetAllMattersByCourtStatus(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Zonevalue, Courtfilter, CourtStatus, UserAdvocate, Nexthearing, Nexthearingto, Againstthefilter, Convert.ToInt32(type));
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(chartdata);
            }
        }

        /// <summary>
        /// Case status chart count
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult AllCaseCountByZone()
        {
            string chartdata = "";
            var Zonevalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Zonevalue"]);
            var Courtfilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["court"]);
            var CourtStatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CourtStatus"]);
            var UserAdvocate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["UserAdvocate"]);
            var Nexthearing = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Nexthearing"]);
            var Nexthearingto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Nexthearingto"]);
            var Againstthefilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Againstthefilter"]);
            var type = QueryAES.UrlDecode(HttpContext.Current.Request.Form["type"]);
            if (string.IsNullOrEmpty(type))
            {
                type = "0";
            }

            try
            {
                var result = DataAccessADO.GetAllMattersCountByZone(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Zonevalue, Courtfilter, CourtStatus, UserAdvocate, Nexthearing, Nexthearingto, Againstthefilter, Convert.ToInt32(type));
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(chartdata);
            }
        }
        /// <summary>
        /// Case status chart count
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult AllassignCaseByZonewise()
        {
            string chartdata = "";
            var Zonevalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Zonevalue"]);
            var Courtfilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["court"]);
            var CourtStatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CourtStatus"]);
            var UserAdvocate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["UserAdvocate"]);
            var Nexthearing = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Nexthearing"]);
            var Nexthearingto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Nexthearingto"]);
            var Againstthefilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Againstthefilter"]);
            var type = QueryAES.UrlDecode(HttpContext.Current.Request.Form["type"]);
            if (string.IsNullOrEmpty(type))
            {
                type = "0";
            }
            try
            {
                var result = DataAccessADO.GetAllAssignPartnerUerByZone(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Zonevalue, Courtfilter, CourtStatus, UserAdvocate, Nexthearing, Nexthearingto, Againstthefilter, Convert.ToInt32(type));
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(chartdata);
            }
        }
        /// <summary>
        /// BOM New Customized Report Sub Court
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult AllMatterBySubCourtWise()
        {
            string chartdata = "";
            var Zonevalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Zonevalue"]);
            var Courtfilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["court"]);
            var CourtStatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CourtStatus"]);
            var UserAdvocate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["UserAdvocate"]);
            var Nexthearing = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Nexthearing"]);
            var Nexthearingto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Nexthearingto"]);
            var Againstthefilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Againstthefilter"]);
            var type = QueryAES.UrlDecode(HttpContext.Current.Request.Form["type"]);
            if (string.IsNullOrEmpty(type))
            {
                type = "0";
            }
            try
            {
                LawPracticeEntities db = new LawPracticeEntities();
                var result = DataAccessADO.GetMatterBySubCourtWise(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Zonevalue, Courtfilter, CourtStatus, UserAdvocate, Nexthearing, Nexthearingto, Againstthefilter, Convert.ToInt32(type));
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(chartdata);
            }
        }

        /// <summary>
        /// BOM New Customized Report  Court Complex Details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult MatterCountBySubCourtName()
        {
            string chartdata = "";
            var Zonevalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Zonevalue"]);
            var Courtfilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["court"]);
            var CourtStatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CourtStatus"]);
            var UserAdvocate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["UserAdvocate"]);
            var Nexthearing = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Nexthearing"]);
            var Nexthearingto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Nexthearingto"]);
            var SubCourtName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SubCourtName"]);
            var Againstthefilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Againstthefilter"]);
            var type = QueryAES.UrlDecode(HttpContext.Current.Request.Form["type"]);
            if (string.IsNullOrEmpty(type))
            {
                type = "0";
            }

            try
            {
                LawPracticeEntities db = new LawPracticeEntities();
                var result = DataAccessADO.GetMatterCountBySubCourtName(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Zonevalue, Courtfilter, CourtStatus, UserAdvocate, Nexthearing, Nexthearingto, SubCourtName, Againstthefilter, Convert.ToInt32(type));
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(chartdata);
            }
        }

        /// <summary>
        /// BOM New Customized Report Matter Details By Assigned User
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult MatterDetailsByAssignUser()
        {
            string chartdata = "";
            var AssignUserId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["AssignUserId"]);
            var Zonevalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Zonevalue"]);
            var Courtfilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["court"]);
            var CourtStatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CourtStatus"]);
            var UserAdvocate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["UserAdvocate"]);
            var Nexthearing = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Nexthearing"]);
            var Nexthearingto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Nexthearingto"]);
            var SubCourtName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["SubCourtName"]);
            var Againstthefilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Againstthefilter"]);
            var type = QueryAES.UrlDecode(HttpContext.Current.Request.Form["type"]);
            if (string.IsNullOrEmpty(type))
            {
                type = "0";
            }
            try
            {
                LawPracticeEntities db = new LawPracticeEntities();
                var result = DataAccessADO.GetMatterDetailsByAssignUser(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), AssignUserId, Zonevalue, Courtfilter, CourtStatus, UserAdvocate, Nexthearing, Nexthearingto, SubCourtName, Againstthefilter, Convert.ToInt32(type));
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(chartdata);
            }
        }
        /// <summary>
        /// Matter Report Againt/By  the PartyName
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult MatterReportAgaintthePartyName()
        {
            string chartdata = "";
            var AssignUserId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["AssignUserId"]);
            var Zonevalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Zonevalue"]);
            var Courtfilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["court"]);
            var CourtStatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CourtStatus"]);
            var UserAdvocate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["UserAdvocate"]);
            var Nexthearing = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Nexthearing"]);
            var Nexthearingto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Nexthearingto"]);
            var Againstthefilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Againstthefilter"]);
            var type = QueryAES.UrlDecode(HttpContext.Current.Request.Form["type"]);
            if (string.IsNullOrEmpty(type))
            {
                type = "0";
            }

            try
            {
                LawPracticeEntities db = new LawPracticeEntities();
                var result = DataAccessADO.GeMatterReportAgainstBytheParty(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), AssignUserId, Zonevalue, Courtfilter, CourtStatus, UserAdvocate, Nexthearing, Nexthearingto, Againstthefilter, Convert.ToInt32(type));
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(chartdata);
            }
        }
        //Rbi customization by prem
        /// <summary>
        /// Case status chart count RBI Customization
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult AllCourtCaseContestedChart()
        {
            string chartdata = "";
            var location = QueryAES.UrlDecode(HttpContext.Current.Request.Form["location"]);
            var status = QueryAES.UrlDecode(HttpContext.Current.Request.Form["status"]);
            var department = QueryAES.UrlDecode(HttpContext.Current.Request.Form["department"]);
            var subCourt = QueryAES.UrlDecode(HttpContext.Current.Request.Form["subCourt"]);
            var Nexthearing = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Nexthearing"]);
            var Nexthearingto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Nexthearingto"]);
            var typeFlag = QueryAES.UrlDecode(HttpContext.Current.Request.Form["typeFlag"]);
            try
            {
                var result = DataAccessADO.GetAllMattersByCourtContested(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), location, status, Nexthearing, Nexthearingto, department, subCourt, typeFlag);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(chartdata);
            }
        }
        /// <summary>
        /// Rbi New Customized Report
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CustomLocation()
        {
            string chartdata = "";
            var location = QueryAES.UrlDecode(HttpContext.Current.Request.Form["location"]);
            var status = QueryAES.UrlDecode(HttpContext.Current.Request.Form["status"]);
            var department = QueryAES.UrlDecode(HttpContext.Current.Request.Form["department"]);
            var subCourt = QueryAES.UrlDecode(HttpContext.Current.Request.Form["subCourt"]);
            var Nexthearing = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Nexthearing"]);
            var Nexthearingto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Nexthearingto"]);
            var typeFlag = QueryAES.UrlDecode(HttpContext.Current.Request.Form["typeFlag"]);
            try
            {
                LawPracticeEntities db = new LawPracticeEntities();
                var result = DataAccessADO.GetlocationValue(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), location, status, Nexthearing, Nexthearingto, department, subCourt, typeFlag);

                // var result = DataAccessADO.GetlocationValue(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), location, status, Nexthearing, Nexthearingto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(chartdata);
            }
        }
        /// <summary>
        /// Rbi New Customized Report
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CustomDepartment()
        {
            string chartdata = "";
            var location = QueryAES.UrlDecode(HttpContext.Current.Request.Form["location"]);
            var status = QueryAES.UrlDecode(HttpContext.Current.Request.Form["status"]);
            var department = QueryAES.UrlDecode(HttpContext.Current.Request.Form["department"]);
            var subCourt = QueryAES.UrlDecode(HttpContext.Current.Request.Form["subCourt"]);
            var Nexthearing = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Nexthearing"]);
            var Nexthearingto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Nexthearingto"]);
            var typeFlag = QueryAES.UrlDecode(HttpContext.Current.Request.Form["typeFlag"]);
            try
            {
                LawPracticeEntities db = new LawPracticeEntities();
                var result = DataAccessADO.GetDepartmentValue(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), location, status, Nexthearing, Nexthearingto, department, subCourt, typeFlag);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(chartdata);
            }
        }
        /// <summary>
        /// Rbi New Customized Report
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CustomSubcourt()
        {
            string chartdata = "";
            var location = QueryAES.UrlDecode(HttpContext.Current.Request.Form["location"]);
            var status = QueryAES.UrlDecode(HttpContext.Current.Request.Form["status"]);
            var department = QueryAES.UrlDecode(HttpContext.Current.Request.Form["department"]);
            var subCourt = QueryAES.UrlDecode(HttpContext.Current.Request.Form["subCourt"]);
            var Nexthearing = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Nexthearing"]);
            var Nexthearingto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Nexthearingto"]);
            var typeFlag = QueryAES.UrlDecode(HttpContext.Current.Request.Form["typeFlag"]);
            try
            {
                LawPracticeEntities db = new LawPracticeEntities();
                var result = DataAccessADO.GetSubCourtValue(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), location, status, Nexthearing, Nexthearingto, department, subCourt, typeFlag);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(chartdata);
            }
        }
        /// <summary>
        /// Case status chart count
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult AllMatterCountRbi()
        {
            string chartdata = "";
            var location = QueryAES.UrlDecode(HttpContext.Current.Request.Form["location"]);
            var status = QueryAES.UrlDecode(HttpContext.Current.Request.Form["status"]);
            var department = QueryAES.UrlDecode(HttpContext.Current.Request.Form["department"]);
            var subCourt = QueryAES.UrlDecode(HttpContext.Current.Request.Form["subCourt"]);
            var Nexthearing = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Nexthearing"]);
            var Nexthearingto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Nexthearingto"]);
            var typeFlag = QueryAES.UrlDecode(HttpContext.Current.Request.Form["typeFlag"]);
            try
            {
                var result = DataAccessADO.AllMatterCountRbi(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), location, status, Nexthearing, Nexthearingto, department, subCourt, typeFlag);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(chartdata);
            }
        }
        //Next Hearing count
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult AllMatterCountNextHearing()
        {
            string chartdata = "";
            var location = QueryAES.UrlDecode(HttpContext.Current.Request.Form["location"]);
            var status = QueryAES.UrlDecode(HttpContext.Current.Request.Form["status"]);
            var department = QueryAES.UrlDecode(HttpContext.Current.Request.Form["department"]);
            var subCourt = QueryAES.UrlDecode(HttpContext.Current.Request.Form["subCourt"]);
            var Nexthearing = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Nexthearing"]);
            var Nexthearingto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Nexthearingto"]);
            var typeFlag = QueryAES.UrlDecode(HttpContext.Current.Request.Form["typeFlag"]);
            try
            {
                var result = DataAccessADO.AllMatterCountRbinextHearing(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), location, status, Nexthearing, Nexthearingto, department, subCourt, typeFlag);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(chartdata);
            }
        }
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult AllMatterCountNextHearingTabularData()
        {
            string chartdata = "";
            var location = QueryAES.UrlDecode(HttpContext.Current.Request.Form["location"]);
            var status = QueryAES.UrlDecode(HttpContext.Current.Request.Form["status"]);
            var department = QueryAES.UrlDecode(HttpContext.Current.Request.Form["department"]);
            var subCourt = QueryAES.UrlDecode(HttpContext.Current.Request.Form["subCourt"]);
            var Nexthearing = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Nexthearing"]);

            try
            {
                var result = DataAccessADO.AllMatterRbinextHearingTabularData(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Nexthearing, location, status, department, subCourt);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(chartdata);
            }
        }
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult AllMatterList()
        {
            var location = QueryAES.UrlDecode(HttpContext.Current.Request.Form["location"]);
            var status = QueryAES.UrlDecode(HttpContext.Current.Request.Form["status"]);
            var department = QueryAES.UrlDecode(HttpContext.Current.Request.Form["department"]);
            var subCourt = QueryAES.UrlDecode(HttpContext.Current.Request.Form["subCourt"]);
            var Nexthearing = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Nexthearing"]);
            var Nexthearingto = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Nexthearingto"]);
            var typeFlag = QueryAES.UrlDecode(HttpContext.Current.Request.Form["typeFlag"]);
            var pageNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pageNo"]);
            var pageSize = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pageSize"]);

            try
            {
                var result = DataAccessADO.AllMatterListTabularData(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), location, status, Nexthearing, Nexthearingto, department, subCourt, typeFlag, pageNo, pageSize);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(ex);
            }
        }
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LatestOrderDetails()
        {
            try
            {
                var caseId = (QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseId"]));
                try
                {
                    caseId = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseId));
                }
                catch { }

                var type = (QueryAES.UrlDecode(HttpContext.Current.Request.Form["type"]));
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
                    accesstoken = AccessTokenDetail,
                    userid = userIdDetail,
                    caseid = caseId,
                    iflag = type
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/ShowMykaseDetailsSingleOrderById"), "POST", builders);

                JObject obj = JObject.Parse(resid);
                string newJson = JsonConvert.SerializeObject(obj);
                return Ok(newJson);

            }
            catch (Exception ex)
            {
                return Ok(ex);
            }
        }
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public string AllMatterListFavourAgainst()
        {
            var likeFlag = QueryAES.UrlDecode(HttpContext.Current.Request.Form["likeFlag"]);
            var courtTypeFlag = QueryAES.UrlDecode(HttpContext.Current.Request.Form["courtTypeFlag"]);
            var yearFlag = QueryAES.UrlDecode(HttpContext.Current.Request.Form["yearFlag"]);
            var year = QueryAES.UrlDecode(HttpContext.Current.Request.Form["year"]);
            var monthid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["monthid"]);

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
                    accesstoken = AccessTokenDetail,
                    userid = userIdDetail,
                    caseid = result
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/ShowMatterListByCaseId"), "POST", builders);
                JObject obj = JObject.Parse(resid);
                string newJson = JsonConvert.SerializeObject(obj);
                return newJson;


            }
            catch (Exception ex)
            {
                return ex.Message.ToString();
            }
        }



        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public string AllMatterListCourtWise()
        {
            var vCourtval = QueryAES.UrlDecode(HttpContext.Current.Request.Form["vCourtval"]);
            var Year = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Year"]);
            var Monthid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Monthid"]);

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
                JObject obj = JObject.Parse(resid);
                string newJson = JsonConvert.SerializeObject(obj);
                return newJson;


            }
            catch (Exception ex)
            {
                return ex.Message.ToString();
            }
        }
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public string AllMatterListZoneWise()
        {
            var vCourtval = QueryAES.UrlDecode(HttpContext.Current.Request.Form["vCourtval"]);
            var Year = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Year"]);
            var Monthid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Monthid"]);
            var flag = QueryAES.UrlDecode(HttpContext.Current.Request.Form["flag"]);
            var courtType = QueryAES.UrlDecode(HttpContext.Current.Request.Form["courtType"]);

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
                JObject obj = JObject.Parse(resid);
                string newJson = JsonConvert.SerializeObject(obj);
                return newJson;


            }
            catch (Exception ex)
            {
                return ex.Message.ToString();
            }
        }

        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public string AllMatterListStateWise()
        {
            var vcourt = QueryAES.UrlDecode(HttpContext.Current.Request.Form["vcourt"]);
            var monthid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["monthid"]);
            var year = QueryAES.UrlDecode(HttpContext.Current.Request.Form["year"]);
            var like = QueryAES.UrlDecode(HttpContext.Current.Request.Form["like"]);
            var status = QueryAES.UrlDecode(HttpContext.Current.Request.Form["status"]);
            var courtType = QueryAES.UrlDecode(HttpContext.Current.Request.Form["courtType"]);
            var CourtName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["CourtName"]);
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
                JObject obj = JObject.Parse(resid);
                string newJson = JsonConvert.SerializeObject(obj);
                return newJson;
            }
            catch (Exception ex)
            {
                return ex.Message.ToString();
            }
        }

        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public string AllMatterListStConsolated()
        {
            var vcourt = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Courtid"]);
            var monthid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Monthid"]);
            var year = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Year"]);
            var courtType = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Courttype"]);
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
                    accesstoken = AccessTokenDetail,
                    userid = userIdDetail,
                    Courtid = vcourt,
                    Monthid = monthid,
                    Year = year,
                    Courttype = courtType
                };

                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/FilterMetterListAllCourtData"), "POST", builders);
                JObject obj = JObject.Parse(resid);
                string newJson = JsonConvert.SerializeObject(obj);
                return newJson;
            }
            catch (Exception ex)
            {
                return ex.Message.ToString();
            }
        }

        //Get user Case report by percent
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public string AllMatterListSebiSuccess()
        {
            var flag = QueryAES.UrlDecode(HttpContext.Current.Request.Form["flag"]);
            var year = QueryAES.UrlDecode(HttpContext.Current.Request.Form["year"]);
            var monthid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["monthid"]);

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
                    accesstoken = AccessTokenDetail,
                    userid = userIdDetail,
                    caseid = result
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/ShowMatterListByCaseId"), "POST", builders);
                JObject obj = JObject.Parse(resid);
                string newJson = JsonConvert.SerializeObject(obj);
                return newJson;


            }
            catch (Exception ex)
            {
                return ex.Message.ToString();
            }
        }
        /// <summary>
        /// Bulk Restore cases
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult BulkRestoreCase(string[] typeIds)
        {
            try
            {
                var remarks = "";
                string dburl = "";
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var roleid = LoggedInUser.RoleId.ToString();
                var countmatter = Repository.Matter.Restorematterlist(typeIds, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), apiUrl, remarks, roleid);
                var param = controllername + ">RemoveMatter>removematterlist>param=" + typeIds + "@" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString() + "@remark" + remarks;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(countmatter);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }


        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult IprdaAdvAndDepDetails()
        {
            try
            {
                var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseid"]);

                var status = DataAccessADO.GetPmrdaAdvocateAndDepartment(Convert.ToString(caseid));

                return Ok(status);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        //Iprda api for graph 
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult IprdaGrahDataCourtWise()
        {
            string chartdata = "";
            var filterCourtName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filterCourtName"]);
            var filterStatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filterStatus"]);
            var filterDepartment = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filterDepartment"]);
            var filterAdvocate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filterAdvocate"]);

            try
            {
                var result = DataAccessADO.IprdaDashBoardCourtWise(LoggedInUser.FirmId.ToString(), filterCourtName, filterStatus, filterDepartment, filterAdvocate);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(chartdata);
            }
        }

        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult IprdaGrahDataStatusWise()
        {
            string chartdata = "";
            var filterCourtName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filterCourtName"]);
            var filterStatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filterStatus"]);
            var filterDepartment = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filterDepartment"]);
            var filterAdvocate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filterAdvocate"]);

            try
            {
                var result = DataAccessADO.IprdaDashBoardStatusWise(LoggedInUser.FirmId.ToString(), filterCourtName, filterStatus, filterDepartment, filterAdvocate);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(chartdata);
            }
        }

        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult IprdaGrahDataTotalCount()
        {
            string chartdata = "";
            var filterCourtName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filterCourtName"]);
            var filterStatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filterStatus"]);
            var filterDepartment = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filterDepartment"]);
            var filterAdvocate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filterAdvocate"]);

            try
            {
                var result = DataAccessADO.IprdaDashBoardCount(LoggedInUser.FirmId.ToString(), filterCourtName, filterStatus, filterDepartment, filterAdvocate);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(chartdata);
            }
        }

        //Advocte wise matrix data 
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult IprdaGrahDataAdvocateWiseStatusData()
        {
            string chartdata = "";
            var filterCourtName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filterCourtName"]);
            var filterStatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filterStatus"]);
            var filterDepartment = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filterDepartment"]);
            var filterAdvocate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filterAdvocate"]);

            try
            {
                var result = DataAccessADO.IprdaDashBoardAdvocateWiseStatus(LoggedInUser.FirmId.ToString(), filterCourtName, filterStatus, filterDepartment, filterAdvocate);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(chartdata);
            }
        }

        //status wise count data
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult IprdaGrahDataStatusData()
        {
            string chartdata = "";
            var filterCourtName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filterCourtName"]);
            var filterStatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filterStatus"]);
            var filterDepartment = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filterDepartment"]);
            var filterAdvocate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filterAdvocate"]);

            try
            {
                var result = DataAccessADO.IprdaDashBoardStatusWise(LoggedInUser.FirmId.ToString(), filterCourtName, filterStatus, filterDepartment, filterAdvocate);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(chartdata);
            }
        }


        //Department wise count data
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult IprdaGrahDataDepartmentData()
        {
            string chartdata = "";
            var filterCourtName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filterCourtName"]);
            var filterStatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filterStatus"]);
            var filterDepartment = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filterDepartment"]);
            var filterAdvocate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filterAdvocate"]);

            try
            {
                var result = DataAccessADO.IprdaDashBoardDepartmentwise(LoggedInUser.FirmId.ToString(), filterCourtName, filterStatus, filterDepartment, filterAdvocate);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(chartdata);
            }
        }
        //Court list
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult IprdaGrahDataCourtList()
        {
            try
            {
                var result = DataAccessADO.IprdaDashBoardCourtList(LoggedInUser.FirmId.ToString());
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //Status wise list
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult IprdaGrahDatastatusList()
        {
            try
            {
                var result = DataAccessADO.IprdaDashBoardStatusList(LoggedInUser.FirmId.ToString());
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        //Status advocate list
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult IprdaGrahDataAdvocateList()
        {
            try
            {
                var result = DataAccessADO.IprdaDashBoardAdvocateList();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Log service
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
        /// Consolidated Personal Dashboard Summary
        /// Replaces 10+ separate API calls (4 counts + chart data) with ONE call.
        /// </summary>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult PersonalDashboardSummary()
        {
            try
            {
                var filtervalue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filtervalue"]);
                int ispersonal = string.IsNullOrEmpty(filtervalue) ? 0 : Convert.ToInt32(filtervalue);

                var ds = DataAccessADO.GetPersonalDashboardSummary(
                    LoggedInUser.FirmId.ToString(),
                    LoggedInUser.UserId.ToString(),
                    ispersonal);

                if (ds == null || ds.Tables.Count == 0)
                    return Ok();

                // Safe int parse — handles DBNull, empty string, and non-numeric values
                Func<object, int> toInt = val =>
                {
                    if (val == null || val == DBNull.Value) return 0;
                    var s = val.ToString();
                    if (string.IsNullOrEmpty(s)) return 0;
                    int result;
                    return int.TryParse(s, out result) ? result : 0;
                };

                // Safe long parse for BIGINT values
                Func<object, long> toLong = val =>
                {
                    if (val == null || val == DBNull.Value) return 0;
                    var s = val.ToString();
                    if (string.IsNullOrEmpty(s)) return 0;
                    long result;
                    return long.TryParse(s, out result) ? result : 0;
                };

                // Safe string
                Func<object, string> toStr = val =>
                    val == null || val == DBNull.Value ? "" : Convert.ToString(val);

                var response = new JObject();

                // Result Set 0: Counts
                if (ds.Tables[0].Rows.Count > 0)
                {
                    var r = ds.Tables[0].Rows[0];
                    response.Add("MatterCount", toInt(r["MatterCount"]));
                    response.Add("ArchivedMatterCount", toInt(r["ArchivedMatterCount"]));
                    response.Add("ClientCount", toInt(r["ClientCount"]));
                    response.Add("TaskDueTodayCount", toInt(r["TaskDueTodayCount"]));
                }

                // Result Set 1: Matter Type Chart
                var matterTypeArr = new JArray();
                if (ds.Tables.Count > 1)
                    foreach (DataRow row in ds.Tables[1].Rows)
                    {
                        var obj = new JObject();
                        obj.Add("Label", toStr(row["MatterType"]));
                        obj.Add("Total", toInt(row["Total"]));
                        matterTypeArr.Add(obj);
                    }
                response.Add("MatterTypeChart", matterTypeArr);

                // Result Set 2: Case Status Chart
                var caseStatusArr = new JArray();
                if (ds.Tables.Count > 2)
                    foreach (DataRow row in ds.Tables[2].Rows)
                    {
                        var obj = new JObject();
                        obj.Add("CaseStatus", toStr(row["CaseStatus"]));
                        obj.Add("Total", toInt(row["Total"]));
                        obj.Add("Id", toInt(row["Id"]));
                        caseStatusArr.Add(obj);
                    }
                response.Add("CaseStatusChart", caseStatusArr);

                // Result Set 3: Court Status Chart — Type is a STRING, not int
                var courtStatusArr = new JArray();
                if (ds.Tables.Count > 3)
                    foreach (DataRow row in ds.Tables[3].Rows)
                    {
                        var obj = new JObject();
                        obj.Add("CaseStatus", toStr(row["CaseStatus"]));
                        obj.Add("Total", toInt(row["Total"]));
                        obj.Add("Type", toStr(row["Type"]));
                        courtStatusArr.Add(obj);
                    }
                response.Add("CourtStatusChart", courtStatusArr);

                // Result Set 4: Pending Task Chart
                var pendingTaskArr = new JArray();
                if (ds.Tables.Count > 4)
                    foreach (DataRow row in ds.Tables[4].Rows)
                    {
                        var obj = new JObject();
                        obj.Add("Label", toStr(row["TaskName"]));
                        obj.Add("Total", toInt(row["Total"]));
                        pendingTaskArr.Add(obj);
                    }
                response.Add("PendingTaskChart", pendingTaskArr);

                // Result Set 5: Time Spend Chart
                var timeSpendArr = new JArray();
                if (ds.Tables.Count > 5)
                    foreach (DataRow row in ds.Tables[5].Rows)
                    {
                        var obj = new JObject();
                        obj.Add("Label", toStr(row["TaskType"]));
                        obj.Add("Total", toInt(row["Total"]));
                        timeSpendArr.Add(obj);
                    }
                response.Add("TimeSpendChart", timeSpendArr);

                // Result Set 6: Subject Type Chart
                var subjectTypeArr = new JArray();
                if (ds.Tables.Count > 6)
                    foreach (DataRow row in ds.Tables[6].Rows)
                    {
                        var obj = new JObject();
                        obj.Add("Label", toStr(row["SubjectType"]));
                        obj.Add("Total", toInt(row["Total"]));
                        subjectTypeArr.Add(obj);
                    }
                response.Add("SubjectTypeChart", subjectTypeArr);

                // Result Set 7: Invoice Chart — uses BIGINT, return as long
                var invoiceArr = new JArray();
                if (ds.Tables.Count > 7)
                    foreach (DataRow row in ds.Tables[7].Rows)
                    {
                        var obj = new JObject();
                        obj.Add("Invoicetype", toStr(row["Invoicetype"]));
                        obj.Add("Total", toLong(row["Total"]));
                        invoiceArr.Add(obj);
                    }
                response.Add("InvoiceChart", invoiceArr);

                // Result Set 8: Notice-Matter Link Chart
                if (ds.Tables.Count > 8 && ds.Tables[8].Rows.Count > 0)
                {
                    var nm = new JObject();
                    nm.Add("TotalMatter", toInt(ds.Tables[8].Rows[0]["TotalMatter"]));
                    nm.Add("LinkNoticeToMatter", toInt(ds.Tables[8].Rows[0]["LinkNoticeToMatter"]));
                    response.Add("NoticeMatterChart", nm);
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                var err = new JObject();
                err.Add("error", ex.Message);
                return Ok(err);
            }
        }
    }
}
