using BussinessLogic;
using DataAccess.Modals;
using LawPracticeFirm.Common;
using LawPracticeFirm.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity.Core.Objects;
using System.IO;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Configuration;
using System.Web.Http;
using System.Web.Script.Serialization;
using static LawPracticeFirm.Models.AuditData;
using System.Configuration;

namespace LawPracticeFirm.API
{
    public class WorkFlowNewApiController : BaseFirmApiController
    {
        public WorkFlowNewApiController()
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
        }
        private LawPracticeEntities db1 = new LawPracticeEntities();
        public string controllername = "WorkFlowNewApiController";

        /// <summary>
        /// Get firm user details
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult FirmUser([FromBody] JObject paramJObject)
        {
            try
            {
                var db = new LawPracticeEntities();
                var stage = Repository.WorkFlowNew.FirmUserList(LoggedInUser.FirmId.ToString());
                var param = controllername + ">FirmUser>FirmUserList>param=" + LoggedInUser.FirmId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.Lead), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Lead), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(stage);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.WorkFlow), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.WorkFlow), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Get matter hearing
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult MatterHearing()
        {
            try
            {
                tblMatterHearing obj = new tblMatterHearing();
                obj.MatterId = Convert.ToInt32(Request.Headers.GetValues("matterid").FirstOrDefault());
                var strdetail = Repository.WorkFlowNew.MatterHearing(obj);
                return Ok(strdetail);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Get matter list details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult MatterListDetail()
        {
            try
            {
                AddLawMatterList obj = new AddLawMatterList();
                obj.assignto = LoggedInUser.UserId;
                obj.cstatus = Convert.ToString(Request.Headers.GetValues("status").FirstOrDefault());
                var strdetail = Repository.WorkFlowNew.MatterListDetail(obj);
                var param = controllername + ">MatterListDetail>MatterListDetail>param=" + obj.assignto + "@" + obj.cstatus;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(strdetail);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Get client details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ClientDetail()
        {
            try
            {
                var call = Repository.WorkFlowNew.ClientDetail(LoggedInUser.UserId.ToString(), LoggedInUser.FirmId.ToString());
                var param = controllername + ">ClientDetail>ClientDetail>param=" + LoggedInUser.UserId + "@" + LoggedInUser.FirmId;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Client), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Client), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(call);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Client), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Client), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Save profile details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SaveProfile()
        {
            try
            {
                RegUserTable obj = new RegUserTable();
                var db = new LawPracticeEntities();
                var httpRequest = HttpContext.Current.Request;
                string faeemail = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["email"]));
                string famobile = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["mobile"]));
                var checkmob = db.usp_wf_GetUserDetails(LoggedInUser.FirmId, LoggedInUser.UserId).FirstOrDefault();
                if (checkmob != null)
                {
                    if (checkmob.cmobile.ToString() == famobile)
                    {
                    }
                    else
                    {
                        var firmusermob = db.ValidateMobile(famobile, LoggedInUser.FirmId.ToString()).FirstOrDefault();
                        if (firmusermob != null)
                        {
                            return Ok("Already Exists Mobile Please Try Another Mobile!");
                        }
                        else
                        {
                        }
                    }
                }
                if (httpRequest.Files.Count > 0)
                {
                    var docfiles = new List<string>();
                    string folderPath = HttpContext.Current.Server.MapPath("~/Documents/ClientPic/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/");
                    //Check whether Directory (Folder) exists.
                    if (!Directory.Exists(folderPath))
                    {
                        //If Directory (Folder) does not exists. Create it.
                        Directory.CreateDirectory(folderPath);
                    }
                    for (int i = 0; i < httpRequest.Files.Count; i++)
                    {
                        var postedFile = httpRequest.Files[i];
                        var fileName = Path.GetFileNameWithoutExtension(postedFile.FileName);
                        var fileext = Path.GetExtension(postedFile.FileName);
                        var fileName1 = fileName + randomno() + fileext;
                        var filePath = folderPath + Path.GetFileName(fileName1); //HttpContext.Current.Server.MapPath(+ postedFile.FileName);
                        var fileextchk = Path.GetExtension(postedFile.FileName);
                        var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);
                        postedFile.SaveAs(filePath);
                        docfiles.Add(filePath);
                        obj.cphoto = "/Documents/ClientPic/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/" + fileName1;
                    }
                    if (!string.IsNullOrEmpty(obj.cphoto))
                    {
                        obj.cphoto = Convert.ToBase64String(QueryAES.EncryptAes(obj.cphoto));
                    }
                }
                if (!string.IsNullOrEmpty(QueryAES.UrlDecode(HttpContext.Current.Request.Form["barno"])))
                {
                    obj.BARNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["barno"]);
                }
                if (!string.IsNullOrEmpty(QueryAES.UrlDecode(HttpContext.Current.Request.Form["fname"])))
                {
                    obj.cfname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fname"]);
                }
                if (!string.IsNullOrEmpty(QueryAES.UrlDecode(HttpContext.Current.Request.Form["mname"])))
                {
                    obj.cmname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["mname"]);
                }
                if (!string.IsNullOrEmpty(QueryAES.UrlDecode(HttpContext.Current.Request.Form["lname"])))
                {
                    obj.clname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["lname"]);
                }
                if (!string.IsNullOrEmpty(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pin"])))
                {
                    obj.Pin = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pin"]);
                }
                string uemail = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["email"]));
                if (!string.IsNullOrEmpty(QueryAES.UrlDecode(HttpContext.Current.Request.Form["mobile"])))
                {
                    obj.cmobile = QueryAES.UrlDecode(HttpContext.Current.Request.Form["mobile"]);
                }
                if (!string.IsNullOrEmpty(QueryAES.UrlDecode(HttpContext.Current.Request.Form["landline"])))
                {
                    obj.clandline = QueryAES.UrlDecode(HttpContext.Current.Request.Form["landline"]);
                }
                if (!string.IsNullOrEmpty(QueryAES.UrlDecode(HttpContext.Current.Request.Form["address"])))
                {
                    obj.caddress = QueryAES.UrlDecode(HttpContext.Current.Request.Form["address"]);
                }
                obj.country = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["country"]));
                obj.cstate = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["state"]));
                obj.ccity = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["city"]));
                if (!string.IsNullOrEmpty(QueryAES.UrlDecode(HttpContext.Current.Request.Form["designation"])))
                {
                    obj.Designation = QueryAES.UrlDecode(HttpContext.Current.Request.Form["designation"]);
                }
                if (!string.IsNullOrEmpty(QueryAES.UrlDecode(HttpContext.Current.Request.Form["department"])))
                {
                    obj.Department = QueryAES.UrlDecode(HttpContext.Current.Request.Form["department"]);
                }
                var aadhar = "";
                if (!string.IsNullOrEmpty(QueryAES.UrlDecode(HttpContext.Current.Request.Form["aadhar"])))
                {
                    aadhar = QueryAES.UrlDecode(HttpContext.Current.Request.Form["aadhar"]);
                }
                var gst = QueryAES.UrlDecode(HttpContext.Current.Request.Form["gstin"]);
                var pan = QueryAES.UrlDecode(HttpContext.Current.Request.Form["panno"]);
                obj.Firmid = LoggedInUser.FirmId;
                obj.Id = Guid.Parse(QueryAES.UrlDecode(HttpContext.Current.Request.Form["id"]));
                var strdetail = Repository.FirmUsers.SaveProfile(obj, uemail, aadhar, gst, pan, null, null);
                var param = controllername + ">UserDetail>ClientDetail>param=" + obj.cfname + "@" + uemail + "@" + obj.cmobile + "@" + obj.clandline + "@" + obj.caddress + "@" + obj.country + "@" + obj.cstate + "@" + obj.ccity + "@" + obj.Id;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Employee), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(strdetail);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Employee), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
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
        /// Matter list by user
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult MatterListByUser()
        {
            try
            {
                var court = Convert.ToString(Request.Headers.GetValues("court").FirstOrDefault());
                var status = Convert.ToString(Request.Headers.GetValues("status").FirstOrDefault());
                var pagenum = Convert.ToString(Request.Headers.GetValues("pagenum").FirstOrDefault());
                var pagesize = Convert.ToString(Request.Headers.GetValues("pagesize").FirstOrDefault());
                var mattername = Convert.ToString(Request.Headers.GetValues("mattername").FirstOrDefault());
                AddLawMatterList obj = new AddLawMatterList();
                if (!string.IsNullOrEmpty(court) && court != "null")
                {
                    obj.CourtName = court;
                }
                else { obj.CourtName = ""; }
                if (!string.IsNullOrEmpty(status) && status != "null")
                {
                    obj.cstatus = status;
                }
                else { obj.cstatus = ""; }
                if (!string.IsNullOrEmpty(mattername) && mattername != "null")
                {
                    obj.mname = mattername;
                }
                else { obj.mname = ""; }
                obj.Firmid = LoggedInUser.FirmId;
                obj.assignto = Guid.Parse(LoggedInUser.UserId.ToString());//Request.Headers.GetValues("uid").FirstOrDefault();    
                var strdetail = Repository.WorkFlowNew.MatterListByUser(obj, Convert.ToInt32(pagenum), Convert.ToInt32(pagesize));
                var param = controllername + ">MatterListByUser>MatterListByUser>param=" + obj.cstatus + "@" + obj.Firmid + "@" + obj.assignto;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(strdetail);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Change profile password
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ChangePassword()
        {
            try
            {
                var gethjascode = QueryAES.GetHashedCode("12345678");
                var usercrpass = "";
                FirmUser obj = new FirmUser();
                obj.Password = QueryAES.GetHashedCode(QueryAES.UrlDecode(HttpContext.Current.Request.Form["newpass"]));
                obj.UserName = QueryAES.GetHashedCode(QueryAES.UrlDecode(HttpContext.Current.Request.Form["oldpass"]));
                obj.UserName = obj.UserName.Replace("\n", "");
                obj.Password = obj.Password.Replace("\n", "");
                obj.Firmid = Guid.Parse(LoggedInUser.FirmId.ToString());
                obj.Id = Guid.Parse(LoggedInUser.UserId.ToString());
                var chckoldpass = db1.usp_wf_GetUserDetails(LoggedInUser.FirmId, obj.Id).FirstOrDefault();
                HttpContext.Current.Session["tempUserGrid"] = "temp_" + Guid.Parse(LoggedInUser.UserId.ToString());
                if (chckoldpass != null)
                {
                    usercrpass = chckoldpass.Password;
                    if (usercrpass.ToString() != obj.UserName.ToString())
                    {
                        return Ok("passwordmismatch");
                    }
                    if (usercrpass.ToString() == obj.Password.ToString())
                    {
                        return Ok("existpassword");
                    }
                    else
                    {
                        var strdetail = Repository.WorkFlowNew.ChangePassword(obj);
                        var db = new LawPracticeEntities();
                        db.saveuseractivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.UserId.ToString(), 1, DateTime.Now.ToString(), "changepassword", Guid.Empty.ToString(), null, null, DateTime.Now.ToString());
                        try
                        {
                            var dataac = Notification.SaveNotifications("PasswordChange", null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.UserName);
                            string notification = "You have Changed the Password";
                            db.usp_AddActivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), notification, "Change Password",
                                null, null);
                        }
                        catch
                        {
                        }
                        //Add code for automatic logout on every where start 
                        if (System.Web.HttpContext.Current.Application["SessionAbandonFlags"] == null)
                            System.Web.HttpContext.Current.Application["SessionAbandonFlags"] = new List<string>();
                        ((List<string>)System.Web.HttpContext.Current.Application["SessionAbandonFlags"]).Add(LoggedInUser.UserId.ToString());
                        //END
                        var param = controllername + ">ChangePassword>ChangePassword>param=" + obj.Password + "@" + obj.UserName + "@" + obj.Firmid + "@" + obj.Id;
                        db1.usp_AddAudit(Convert.ToInt32(EventType.ChangePassowrd), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.ChangePassowrd), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                        return Ok(strdetail);
                    }
                }
                else
                {
                    return Ok("User not registered with us.");
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.ChangePassowrd), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.ChangePassowrd), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Get matter list by client id
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult MatterListByClient()
        {
            try
            {
                AddLawMatterList obj = new AddLawMatterList();
                obj.Firmid = LoggedInUser.FirmId;
                obj.matterclientid = Guid.Parse(LoggedInUser.UserId.ToString());//Request.Headers.GetValues("uid").FirstOrDefault();           
                var strdetail = Repository.WorkFlowNew.MatterListByClient(obj);
                var param = controllername + ">MatterListByClient>MatterListByClient>param=" + obj.Firmid + "@" + obj.matterclientid;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(strdetail);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Calender view data
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CalendarViewdata()
        {
            try
            {
                AddLawMatterList obj = new AddLawMatterList();
                obj.Firmid = LoggedInUser.FirmId;
                obj.matterclientid = Guid.Parse(LoggedInUser.UserId.ToString());//Request.Headers.GetValues("uid").FirstOrDefault();           
                var strdetail = Repository.WorkFlowNew.CalendarViewdata(obj);
                var param = controllername + ">CalendarViewdata>CalendarViewdata>param=" + obj.Firmid + "@" + obj.matterclientid;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Calendar), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Calendar), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(strdetail);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Calendar), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Calendar), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// New firm registration
        /// </summary>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult FirmRegistrationNew()
        {
            try
            {
                Firm obj = new Firm();
                FirmUser obju = new FirmUser();
                var db = new LawPracticeEntities();
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                //add login data
                var addfClient = new WebClient();

                string firstname = "", middlename = "", lastname = "", Designation = "", OrganisationName = "";
                string OrganisationType = "", OrganisationSize = "", remail = "", rcontact = "";
                string raddress = "", country = "", state = "", city = "";
                string pincode = "", adminusername = "", adminemail = "", adminmobile = "", username = "";
                string password = "", secondaryname = "", secondaryemail = "", secondarymobile = "";
                string pack = "";
                firstname = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["firstname"]));
                middlename = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["middlename"]));
                lastname = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["lastname"]));
                Designation = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["Designation"]));
                OrganisationName = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["OrganisationName"]));
                OrganisationType = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["OrganisationType"]));
                OrganisationSize = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["OrganisationSize"]));
                remail = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["email"]));
                rcontact = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["contact"]));
                raddress = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["address"]));
                country = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["country"]));
                state = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["state"]));
                city = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["city"]));
                pincode = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pincode"]));
                adminusername = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["adminusername"]));
                adminemail = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["adminemail"]));
                adminmobile = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["adminmobile"]));
                username = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["rusername"]));
                password = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["rpassword"]));
                secondaryname = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["secondaryname"]));
                secondaryemail = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["secondaryemail"]));
                secondarymobile = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["secondarymobile"]));
                string otptemp = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["otptemp"]));
                string regtype = "";// Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["regtype"]);
                pack = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pack"]));
                obj.FirmName = OrganisationName;
                obj.FirmTitle = "";
                var firmusernames = db.CommonValidationByUserName(username).FirstOrDefault();
                if (firmusernames == 1)
                {
                    return Ok("ExistUserID");
                }
                string facontact = adminmobile;
                if (!string.IsNullOrEmpty(facontact))
                {
                    string facontact1 = facontact;
                    var firmusercontact = db.ValidateMobile(facontact, null).FirstOrDefault();
                    if (firmusercontact != null)
                    {
                        return Ok("ExistContact");
                    }
                }
                //var sessionotp = otptemp;
                //var checkotp = db.usp_UpdateFirmRegistationOtp(facontact, sessionotp);
                //if (checkotp > 0)
                //{
                //}
                //else
                //{
                //    return Ok("Unauthorisedotp");
                //}
                string firmcode = Convert.ToString(OrganisationName).Replace(".", "").Replace(" ", "").Replace("-", "");
                if (firmcode.Length > 3)
                    firmcode = firmcode.Substring(0, 4).ToUpper();
                string strfirmcode = "";
                var strfirmdetail1 = db.usp_GetFirmsbyCode_api(firmcode).FirstOrDefault();
                if (strfirmdetail1 != null)
                {
                    string strcode = Getdigit(strfirmdetail1.FirmCode);
                    var isint = Regex.IsMatch(strcode, @"^\d+$");
                    if (isint)
                    {
                        strfirmcode = strcode + Convert.ToString(Convert.ToInt32(isint) + 1);
                    }
                    else
                    {
                        strfirmcode = Convert.ToString(strfirmdetail1.FirmCode) + "1";
                    }
                    strfirmcode = strfirmcode.ToUpper();
                    for (int i = 0; 500 > i; i++)
                    {
                        var strdata = db.usp_GetFirmsbyCode_api(strfirmcode).ToList();
                        if (strdata.Count > 0)
                        {
                            if (strfirmcode.Length > 0)
                            {
                                string strtxtcode = strfirmcode.Substring(0, (strfirmcode.Length - Getdigit(strfirmcode).Length));
                                string strcode1 = Getdigit(strfirmcode);//strfirmcode.Substring(strfirmcode.Length - 1, 1);
                                var isint1 = Regex.IsMatch(strcode1, @"^\d+$");
                                if (isint1)
                                {
                                    strfirmcode = strtxtcode + Convert.ToString(Convert.ToInt32(strcode1) + 1);
                                }
                            }
                        }
                        else
                        {
                            break;
                        }
                    }
                    obj.FirmCode = strfirmcode;
                }
                else
                {
                    obj.FirmCode = firmcode;
                }
                var itypes = regtype;
                var packs = pack;
                if (packs != null)
                {
                    obj.PackModule = Convert.ToByte(packs);
                }
                obj.FirmContactno = rcontact;
                obj.FirmContactEmail = remail;
                obj.AdminUser = 1;
                obj.FirmBriefDetails = "";
                obj.FirmAddress1 = raddress;
                obj.City = city;
                obj.State = state;
                obj.Country = country;
                obj.iTrail = 0;
                obj.SubscriptionStartDate = DateTime.Now;
                obj.PinCode = pincode;
                obj.CreatedOn = DateTime.Now;
                obj.Landline = "";
                obj.SecondEmail = secondaryemail;
                obj.secondarymobile = secondarymobile;
                obj.secondaryname = secondaryname;
                obju.UserName = username;
                var originalpass = password;
                obju.Password = QueryAES.GetHashedCode(password);
                obju.Password = obju.Password.Replace("\n", "");
                obju.IsFirmAdmin = true;
                obju.IsFirmClient = false;
                obju.IsActive = true;
                obju.DefaultController = "firm";
                obju.RoleId = 1;
                obju.DefaultAction = "dashboard";
                obju.EmailId = adminemail;
                var result = Repository.WorkFlowNew.FirmRegistration(obj, obju, adminusername, originalpass, Designation, firstname, middlename, lastname, OrganisationSize, OrganisationType, adminmobile);
                string[] parts = result.Split(new char[] { '_' }, 2);
                string before = parts[0];
                string after = parts[1];
                var cnts = before;
                object rawfile = new
                {
                    Accesstoken = "mykase123456789abcdef",
                    Email = adminemail,
                    Memberuserid = "Mykase_" + after,
                    Password = "MykaSe_PasSsword",
                    Mobile = adminmobile,
                    Dispname = firstname,
                    Countryname = country,
                    StateName = state,
                    Userid = "Mykase_" + after,
                    RegistrationType = 0,
                    RoleId = 1
                };
                addfClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                string builders = JsonConvert.SerializeObject(rawfile);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string resid = addfClient.UploadString(new Uri(apiUrl + "/API/Search/FirmMappingAndAddUser"), "POST", builders);


                var param = controllername + ">FirmRegistration>FirmRegistration>param=" + obj.FirmContactno + "@" + obj.FirmContactEmail + "@" + obj.AdminUser + "@" + obj.FirmBriefDetails + "@" + obj.FirmAddress1 + "@" + obj.City + "@" + obj.State + "@" + obj.Country + "@" + obj.iTrail + "@" + obj.SubscriptionStartDate + "@" + obj.PinCode + "@" + obj.CreatedOn + "@" + obju.UserName + "@" + obju.Password + "@" + obju.IsActive + "@" + obju.IsFirmClient + "@" + obju.IsFirmAdmin + "@" + obju.DefaultAction + "@" + obju.DefaultController + "@" + obju.RoleId + "@" + obju.EmailId;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), default(Guid), param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(cnts);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Firm registration
        /// </summary>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult FirmRegistration()
        {
            try
            {
                Firm obj = new Firm();
                FirmUser obju = new FirmUser();
                var db = new LawPracticeEntities();
                string fname = "", mname = "", lname = "", tDesignation = "", tOrganisationName = "";
                string OrganisationSize = "", OrganisationType = "";
                obj.FirmName = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["name"]));
                obj.FirmTitle = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["title"]));
                string adminusername = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["adminusername"]));
                string fausername = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["username"]));
                var firmusernames = db.ValidateUserName(fausername).FirstOrDefault();
                if (firmusernames != null)
                {
                    return Ok("ExistUserID");
                }
                else
                {
                }
                string faeemail = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["email"]));
                var firmuseremail = db.ValidateEmail(faeemail, null).FirstOrDefault();
                if (firmuseremail != null)
                {
                    return Ok("ExistEmail");
                }
                else
                {
                }
                string facontact = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["contact"]));
                if (!string.IsNullOrEmpty(facontact))
                {
                    var firmusercontact = db.ValidateMobile(facontact, null).FirstOrDefault();
                    if (firmusercontact != null)
                    {
                        return Ok("ExistContact");
                    }
                    else
                    {
                    }
                }
                var sessionotp = QueryAES.UrlDecode(HttpContext.Current.Request.Form["otptemp"]);
                var checkotp = db.usp_UpdateFirmRegistationOtp(facontact, sessionotp);
                if (checkotp > 0)
                {
                }
                else
                {
                    return Ok("Unauthorisedotp");
                }
                string firmcode = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["name"])).Replace(".", "").Replace(" ", "").Replace("-", "");
                if (firmcode.Length > 3)
                    firmcode = firmcode.Substring(0, 4).ToUpper();
                string strfirmcode = "";
                var strfirmdetail1 = db.usp_GetFirmsbyCode_api(firmcode).FirstOrDefault();
                if (strfirmdetail1 != null)
                {
                    string strcode = Getdigit(strfirmdetail1.FirmCode);
                    var isint = Regex.IsMatch(strcode, @"^\d+$");
                    if (isint)
                    {
                        strfirmcode = strcode + Convert.ToString(Convert.ToInt32(isint) + 1);
                    }
                    else
                    {
                        strfirmcode = Convert.ToString(strfirmdetail1.FirmCode) + "1";
                    }
                    strfirmcode = strfirmcode.ToUpper();
                    for (int i = 0; 500 > i; i++)
                    {
                        var strdata = db.usp_GetFirmsbyCode_api(strfirmcode).ToList();
                        if (strdata.Count > 0)
                        {
                            if (strfirmcode.Length > 0)
                            {
                                string strtxtcode = strfirmcode.Substring(0, (strfirmcode.Length - Getdigit(strfirmcode).Length));
                                string strcode1 = Getdigit(strfirmcode);
                                var isint1 = Regex.IsMatch(strcode1, @"^\d+$");
                                if (isint1)
                                {
                                    strfirmcode = strtxtcode + Convert.ToString(Convert.ToInt32(strcode1) + 1);
                                }
                            }
                        }
                        else
                        {
                            break;
                        }
                    }
                    obj.FirmCode = strfirmcode;
                }
                else
                {
                    obj.FirmCode = firmcode;
                }
                var itypes = QueryAES.UrlDecode(HttpContext.Current.Request.Form["regtype"]);
                if (itypes != null)
                {
                    obj.itype = Convert.ToByte(itypes);
                }
                var packs = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pack"]);
                if (packs != null)
                {
                    obj.PackModule = Convert.ToByte(packs);
                }
                obj.FirmContactno = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["contact"]));
                obj.FirmContactEmail = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["email"]));
                obj.AdminUser = 1;
                obj.FirmBriefDetails = "";//Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["remark"]);
                obj.FirmAddress1 = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["address"]));
                obj.City = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["city"]));
                obj.State = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["state"]));
                obj.Country = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["country"]));
                obj.iTrail = Convert.ToByte(QueryAES.UrlDecode(HttpContext.Current.Request.Form["trail"]));
                obj.SubscriptionStartDate = DateTime.Now;
                obj.PinCode = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pincode"]));
                obj.CreatedOn = DateTime.Now;
                obj.Landline = QueryAES.UrlDecode(HttpContext.Current.Request.Form["landline"]);
                obj.SecondEmail = QueryAES.UrlDecode(HttpContext.Current.Request.Form["secondemail"]);
                obju.UserName = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["username"]));
                var originalpass = QueryAES.UrlDecode(HttpContext.Current.Request.Form["password"]);
                obju.Password = QueryAES.GetHashedCode(QueryAES.UrlDecode(HttpContext.Current.Request.Form["password"]));
                obju.Password = obju.Password.Replace("\n", "");
                obju.IsFirmAdmin = true;
                obju.IsFirmClient = false;
                obju.IsActive = true;
                obju.DefaultController = "firm";
                obju.RoleId = 1;
                obju.DefaultAction = "dashboard";
                obju.EmailId = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["email"]));
                var strdetail = Repository.WorkFlowNew.FirmRegistration(obj, obju, adminusername, originalpass, tDesignation, fname, mname, lname, OrganisationSize, OrganisationType, facontact);
                var param = controllername + ">FirmRegistration>FirmRegistration>param=" + obj.FirmContactno + "@" + obj.FirmContactEmail + "@" + obj.AdminUser + "@" + obj.FirmBriefDetails + "@" + obj.FirmAddress1 + "@" + obj.City + "@" + obj.State + "@" + obj.Country + "@" + obj.iTrail + "@" + obj.SubscriptionStartDate + "@" + obj.PinCode + "@" + obj.CreatedOn + "@" + obju.UserName + "@" + obju.Password + "@" + obju.IsActive + "@" + obju.IsFirmClient + "@" + obju.IsFirmAdmin + "@" + obju.DefaultAction + "@" + obju.DefaultController + "@" + obju.RoleId + "@" + obju.EmailId;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(strdetail);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Trial firm registration
        /// </summary>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult FirmRegistrationTrial()
        {
            try
            {
                Firm obj = new Firm();
                FirmUser obju = new FirmUser();
                var db = new LawPracticeEntities();
                string fname = "", mname = "", lname = "", tDesignation = "", tOrganisationName = "";
                string OrganisationSize = "", OrganisationType = "";
                obj.FirmName = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["name"]));
                obj.FirmTitle = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["title"]));
                string adminusername = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["adminusername"]));
                string fausername = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["username"]));
                var firmusernames = db.ValidateUserName(fausername).FirstOrDefault();
                if (firmusernames != null)
                {
                    return Ok("ExistUserID");
                }
                else
                {
                }
                string faeemail = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["email"]));
                var firmuseremail = db.ValidateEmail(faeemail, null).FirstOrDefault();
                if (firmuseremail != null)
                {
                    return Ok("ExistEmail");
                }
                else
                {
                }
                string facontact = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["contact"]));
                if (!string.IsNullOrEmpty(facontact))
                {
                    string facontact1 = facontact;
                    var firmusercontact = db.ValidateMobile(facontact1, null).FirstOrDefault();
                    if (firmusercontact != null)
                    {
                        return Ok("ExistContact");
                    }
                    else
                    {
                    }
                }
                var sessionotp = QueryAES.UrlDecode(HttpContext.Current.Request.Form["otptemp"]);
                var checkotp = db.usp_UpdateFirmRegistationOtp(facontact, sessionotp);
                if (checkotp > 0)
                {
                }
                else
                {
                    return Ok("Unauthorisedotp");
                }
                string firmcode = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["name"])).Replace(".", "").Replace(" ", "").Replace("-", "");
                if (firmcode.Length > 3)
                    firmcode = firmcode.Substring(0, 4).ToUpper();
                string strfirmcode = "";
                var strfirmdetail1 = db.usp_GetFirmsbyCode_api(firmcode).FirstOrDefault();
                if (strfirmdetail1 != null)
                {
                    string strcode = Getdigit(strfirmdetail1.FirmCode);
                    var isint = Regex.IsMatch(strcode, @"^\d+$");
                    if (isint)
                    {
                        strfirmcode = strcode + Convert.ToString(Convert.ToInt32(isint) + 1);
                    }
                    else
                    {
                        strfirmcode = Convert.ToString(strfirmdetail1.FirmCode) + "1";
                    }
                    strfirmcode = strfirmcode.ToUpper();
                    for (int i = 0; 500 > i; i++)
                    {
                        var strdata = db.usp_GetFirmsbyCode_api(strfirmcode).ToList();
                        if (strdata.Count > 0)
                        {
                            if (strfirmcode.Length > 0)
                            {
                                string strtxtcode = strfirmcode.Substring(0, (strfirmcode.Length - Getdigit(strfirmcode).Length));
                                string strcode1 = Getdigit(strfirmcode);//strfirmcode.Substring(strfirmcode.Length - 1, 1);
                                var isint1 = Regex.IsMatch(strcode1, @"^\d+$");
                                if (isint1)
                                {
                                    strfirmcode = strtxtcode + Convert.ToString(Convert.ToInt32(strcode1) + 1);
                                }
                            }
                        }
                        else
                        {
                            break;
                        }
                    }
                    obj.FirmCode = strfirmcode;
                }
                else
                {
                    obj.FirmCode = firmcode;
                }
                var itypes = QueryAES.UrlDecode(HttpContext.Current.Request.Form["regtype"]);
                if (itypes != null)
                {
                    obj.itype = Convert.ToByte(itypes);
                }
                var packs = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pack"]);
                if (packs != null)
                {
                    obj.PackModule = Convert.ToByte(packs);
                }
                obj.FirmContactno = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["contact"]));
                obj.FirmContactEmail = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["email"]));
                obj.AdminUser = 1;
                // obj.IsActive = true;
                obj.FirmBriefDetails = "";//Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["remark"]);
                obj.FirmAddress1 = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["address"]));
                obj.City = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["city"]));
                obj.State = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["state"]));
                obj.Country = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["country"]));
                obj.iTrail = Convert.ToByte(QueryAES.UrlDecode(HttpContext.Current.Request.Form["trail"]));
                obj.SubscriptionStartDate = DateTime.Now;
                obj.ExpiryDate = DateTime.Now.AddDays(15);
                obj.iTrail = 1;
                obj.PinCode = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pincode"]));
                obj.CreatedOn = DateTime.Now;
                obj.Landline = QueryAES.UrlDecode(HttpContext.Current.Request.Form["landline"]);
                obj.SecondEmail = QueryAES.UrlDecode(HttpContext.Current.Request.Form["secondemail"]);
                var originalpass = QueryAES.UrlDecode(HttpContext.Current.Request.Form["password"]);
                obju.UserName = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["username"]));
                obju.Password = QueryAES.GetHashedCode(QueryAES.UrlDecode(HttpContext.Current.Request.Form["password"]));
                obju.Password = obju.Password.Replace("\n", "");
                obju.IsFirmAdmin = true;
                obju.IsFirmClient = false;
                obju.IsActive = true;
                obju.DefaultController = "firm";
                obju.RoleId = 1;
                obju.DefaultAction = "dashboard";
                obju.EmailId = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["email"]));
                var strdetail = Repository.WorkFlowNew.FirmRegistration(obj, obju, adminusername, originalpass, tDesignation, fname, mname, lname, OrganisationSize, OrganisationType, facontact);
                var param = controllername + ">FirmRegistration>FirmRegistration>param=" + obj.FirmContactno + "@" + obj.FirmContactEmail + "@" + obj.AdminUser + "@" + obj.FirmBriefDetails + "@" + obj.FirmAddress1 + "@" + obj.City + "@" + obj.State + "@" + obj.Country + "@" + obj.iTrail + "@" + obj.SubscriptionStartDate + "@" + obj.PinCode + "@" + obj.CreatedOn + "@" + obju.UserName + "@" + obju.Password + "@" + obju.IsActive + "@" + obju.IsFirmClient + "@" + obju.IsFirmAdmin + "@" + obju.DefaultAction + "@" + obju.DefaultController + "@" + obju.RoleId + "@" + obju.EmailId;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(strdetail);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Trail new firm registration
        /// </summary>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult FirmRegistrationTrialNew()
        {
            try
            {
                string trialdays = System.Web.Configuration.WebConfigurationManager.AppSettings["trialdays"].ToString();
                Firm obj = new Firm();
                FirmUser obju = new FirmUser();
                var db = new LawPracticeEntities();
                string fname = "", mname = "", lname = "", tDesignation = "", tOrganisationName = "";
                string OrganisationSize = "", OrganisationType = "";
                fname = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["fname"]));
                mname = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["mname"]));
                lname = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["lname"]));
                tDesignation = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["tDesignation"]));
                tOrganisationName = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["tOrganisationName"]));
                OrganisationSize = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["OrganisationSize"]));
                OrganisationType = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["OrganisationType"]));
                obj.FirmName = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["name"]));
                obj.FirmTitle = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["title"]));
                string adminusername = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["adminusername"]));
                string fausername = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["username"]));
                var firmusernames = db.ValidateUserName(fausername).FirstOrDefault();
                if (firmusernames != null)
                {
                    return Ok("ExistUserID");
                }
                else
                {
                }
                string faeemail = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["email"]));
                var firmuseremail = db.ValidateEmail(faeemail, null).FirstOrDefault();
                if (firmuseremail != null)
                {
                    return Ok("ExistEmail");
                }
                else
                {
                }
                string facontact = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["contact"]));
                if (!string.IsNullOrEmpty(facontact))
                {
                    string facontact1 = facontact;
                    var firmusercontact = db.ValidateMobile(facontact1, null).FirstOrDefault();
                    if (firmusercontact != null)
                    {
                        return Ok("ExistContact");
                    }
                    else
                    {
                    }
                }
                var sessionotp = QueryAES.UrlDecode(HttpContext.Current.Request.Form["otptemp"]);
                var checkotp = db.usp_UpdateFirmRegistationOtp(facontact, sessionotp);
                if (checkotp > 0)
                {
                }
                else
                {
                    return Ok("Unauthorisedotp");
                }
                string firmcode = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["tOrganisationName"])).Replace(".", "").Replace(" ", "").Replace("-", "");
                if (firmcode.Length > 3)
                    firmcode = firmcode.Substring(0, 4).ToUpper();
                string strfirmcode = "";
                var strfirmdetail1 = db.usp_GetFirmsbyCode_api(firmcode).FirstOrDefault();
                if (strfirmdetail1 != null)
                {
                    string strcode = Getdigit(strfirmdetail1.FirmCode);
                    var isint = Regex.IsMatch(strcode, @"^\d+$");
                    if (isint)
                    {
                        strfirmcode = strcode + Convert.ToString(Convert.ToInt32(isint) + 1);
                    }
                    else
                    {
                        strfirmcode = Convert.ToString(strfirmdetail1.FirmCode) + "1";
                    }
                    strfirmcode = strfirmcode.ToUpper();
                    for (int i = 0; 500 > i; i++)
                    {
                        var strdata = db.usp_GetFirmsbyCode_api(strfirmcode).ToList();
                        if (strdata.Count > 0)
                        {
                            if (strfirmcode.Length > 0)
                            {
                                string strtxtcode = strfirmcode.Substring(0, (strfirmcode.Length - Getdigit(strfirmcode).Length));
                                string strcode1 = Getdigit(strfirmcode);//strfirmcode.Substring(strfirmcode.Length - 1, 1);
                                var isint1 = Regex.IsMatch(strcode1, @"^\d+$");
                                if (isint1)
                                {
                                    strfirmcode = strtxtcode + Convert.ToString(Convert.ToInt32(strcode1) + 1);
                                }
                            }
                        }
                        else
                        {
                            break;
                        }
                    }
                    obj.FirmCode = strfirmcode;
                }
                else
                {
                    obj.FirmCode = firmcode;
                }
                var itypes = QueryAES.UrlDecode(HttpContext.Current.Request.Form["regtype"]);
                obj.FirmContactno = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["contact"]));
                obj.FirmContactEmail = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["email"]));
                obj.AdminUser = 1;
                //obj.IsActive = true;
                obj.FirmBriefDetails = "";//Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["remark"]);
                obj.FirmAddress1 = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["address"]));
                obj.City = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["city"]));
                obj.State = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["state"]));
                obj.Country = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["country"]));
                obj.SubscriptionStartDate = DateTime.Now;
                obj.ExpiryDate = DateTime.Now.AddDays(Convert.ToInt32(trialdays));
                obj.iTrail = 1;
                obj.PinCode = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pincode"]));
                obj.CreatedOn = DateTime.Now;
                obj.Landline = QueryAES.UrlDecode(HttpContext.Current.Request.Form["landline"]);
                obj.SecondEmail = QueryAES.UrlDecode(HttpContext.Current.Request.Form["secondemail"]);
                obju.UserName = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["username"]));
                string originalpass = Guid.NewGuid().ToString();
                originalpass = originalpass.Substring(0, 10);
                obju.Password = QueryAES.GetHashedCode(originalpass);
                obju.Password = obju.Password.Replace("\n", "");
                obju.IsFirmAdmin = true;
                obju.IsFirmClient = false;
                obju.IsActive = true;
                obju.DefaultController = "firm";
                obju.RoleId = 1;
                obju.DefaultAction = "dashboard";
                obju.EmailId = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["email"]));
                if (mname != "")
                {
                    adminusername += " " + mname;
                }
                if (lname != "")
                {
                    adminusername += " " + lname;
                }
                obj.PackModule = 1;
                var strdetail = Repository.WorkFlowNew.FirmRegistration(obj, obju, adminusername, originalpass, tDesignation, fname, mname, lname, OrganisationSize, OrganisationType, facontact);
                var param = controllername + ">FirmRegistration>FirmRegistration>param=" + obj.FirmContactno + "@" + obj.FirmContactEmail + "@" + obj.AdminUser + "@" + obj.FirmBriefDetails + "@" + obj.FirmAddress1 + "@" + obj.City + "@" + obj.State + "@" + obj.Country + "@" + obj.iTrail + "@" + obj.SubscriptionStartDate + "@" + obj.PinCode + "@" + obj.CreatedOn + "@" + obju.UserName + "@" + obju.Password + "@" + obju.IsActive + "@" + obju.IsFirmClient + "@" + obju.IsFirmAdmin + "@" + obju.DefaultAction + "@" + obju.DefaultController + "@" + obju.RoleId + "@" + obju.EmailId;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(strdetail);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Load Knowldge Details
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadKnowldgeDetails([FromBody] JObject paramJObject)
        {
            try
            {
                var title = Request.Headers.GetValues("title").FirstOrDefault();
                var db = new LawPracticeEntities();
                var matter = db.usp_wf_GetKnowldgeDetails1(LoggedInUser.FirmId, LoggedInUser.UserId, title).ToList();
                var param = controllername + ">LoadKnowldgeDetails>usp_wf_GetKnowldgeDetails1>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId + "@" + title;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var a = JsonConvert.SerializeObject(matter);
                return Ok(a);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Load User Knowldge Details by rowid
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadUserKnowldgeDetailsbyrowid()
        {
            try
            {
                var title = Request.Headers.GetValues("title").FirstOrDefault();
                int pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                int pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                var db = new LawPracticeEntities();
                int pageid = 0;
                var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("ViewKnowledge/0")).FirstOrDefault();
                if (pagelist != null)
                {
                    pageid = Convert.ToInt32(pagelist.ParentPage);
                }
                List<usp_wf_GetKnowldgeDetails1byrowid_Result> list = new List<usp_wf_GetKnowldgeDetails1byrowid_Result>();
                list = db.usp_wf_GetKnowldgeDetails1byrowid(LoggedInUser.FirmId, LoggedInUser.UserId, title, pagenum, pagesize, pageid).ToList();
                foreach (var data in list.ToList())
                {
                    usp_wf_GetKnowldgeDetails1byrowid_Result newItem = new usp_wf_GetKnowldgeDetails1byrowid_Result();
                    newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                    list[list.IndexOf(data)].Id = newItem.Id;
                }
                var param = controllername + ">LoadKnowldgeDetailsbyrowid>usp_wf_GetKnowldgeDetails1byrowid>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId + "@" + title;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var a = JsonConvert.SerializeObject(list);
                return Ok(a);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Load Knowldge Details by rowid
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadKnowldgeDetailsbyrowid()
        {
            try
            {
                var title = Request.Headers.GetValues("title").FirstOrDefault();
                int pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                int pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                var dirtoken = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dirtoken"]);
                var strdoctext = "";
                var type = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["type"]));
                var strdoctitle = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["strtxt"]));
                if (type == 1)
                {
                    if (dirtoken != null)
                    {
                        if (dirtoken == "0")
                        {
                            dirtoken = "00000000-0000-0000-0000-000000000000";
                        }
                        var db = new LawPracticeEntities();
                        int pageid = 0;
                        var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("ViewKnowledge/0")).FirstOrDefault();
                        if (pagelist != null)
                        {
                            pageid = Convert.ToInt32(pagelist.ParentPage);
                        }
                        List<usp_wf_GetKnowldgeDetailswithFolder_Result> list = new List<usp_wf_GetKnowldgeDetailswithFolder_Result>();
                        list = db.usp_wf_GetKnowldgeDetailswithFolder(LoggedInUser.FirmId, LoggedInUser.UserId, title, pagenum, pagesize, dirtoken, pageid).ToList();
                        foreach (var data in list.ToList())
                        {
                            usp_wf_GetKnowldgeDetailswithFolder_Result newItem = new usp_wf_GetKnowldgeDetailswithFolder_Result();
                            newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                            list[list.IndexOf(data)].Id = newItem.Id;
                            if (!String.IsNullOrEmpty(data.AzureFileId))
                            {
                                newItem.AzureFileId = Convert.ToBase64String(QueryAES.EncryptAes(data.AzureFileId.ToString()));
                                list[list.IndexOf(data)].AzureFileId = newItem.AzureFileId;
                            }
                        }
                        var param = controllername + ">LoadKnowldgeDetailsbyrowid>usp_wf_GetKnowldgeDetailswithFolder_Result>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId + "@" + title;
                        db1.usp_AddAudit(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                        var a = JsonConvert.SerializeObject(list);
                        return Ok(a);
                    }
                    else
                    {
                        return Ok();
                    }
                }
                else
                {
                    if (dirtoken != null)
                    {
                        if (dirtoken == "0")
                        {
                            dirtoken = "00000000-0000-0000-0000-000000000000";
                        }
                        var db = new LawPracticeEntities();
                        int pageid = 0;
                        var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("ViewKnowledge/0")).FirstOrDefault();
                        if (pagelist != null)
                        {
                            pageid = Convert.ToInt32(pagelist.ParentPage);
                        }
                        List<usp_wf_GetKnowldgeDetailswithFolder_DocIndex2_Result> list = new List<usp_wf_GetKnowldgeDetailswithFolder_DocIndex2_Result>();
                        list = db.usp_wf_GetKnowldgeDetailswithFolder_DocIndex2(LoggedInUser.FirmId, LoggedInUser.UserId, title, pagenum, pagesize, dirtoken, pageid).ToList();
                        foreach (var data in list.ToList())
                        {
                            usp_wf_GetKnowldgeDetailswithFolder_DocIndex2_Result newItem = new usp_wf_GetKnowldgeDetailswithFolder_DocIndex2_Result();
                            newItem.Id = Convert.ToBase64String(QueryAES.EncryptAes(data.Id.ToString()));
                            list[list.IndexOf(data)].Id = newItem.Id;
                            if (!String.IsNullOrEmpty(data.AzureFileId))
                            {
                                newItem.AzureFileId = Convert.ToBase64String(QueryAES.EncryptAes(data.AzureFileId.ToString()));
                                list[list.IndexOf(data)].AzureFileId = newItem.AzureFileId;
                            }
                        }
                        var param = controllername + ">LoadKnowldgeDetailsbyrowid>usp_wf_GetKnowldgeDetailswithFolder_Result>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId + "@" + title;
                        db1.usp_AddAudit(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                        var a = JsonConvert.SerializeObject(list);
                        return Ok(a);
                    }
                    else
                    {
                        return Ok();
                    }
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Load Knowldge Fav Details
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadKnowldgeFavDetails([FromBody] JObject paramJObject)
        {
            try
            {
                var db = new LawPracticeEntities();
                var title = Request.Headers.GetValues("title").FirstOrDefault();
                var matter = db.usp_wf_GetKnowldgeDetailsFav1(LoggedInUser.FirmId, LoggedInUser.UserId, title).ToList();
                var param = controllername + ">LoadKnowldgeFavDetails>usp_wf_GetKnowldgeDetailsFav1>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId + "@" + title;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var a = JsonConvert.SerializeObject(matter);
                return Ok(a);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Load Knowldge Fav Details by rowid
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadKnowldgeFavDetailsbyrowid()
        {
            try
            {
                var db = new LawPracticeEntities();
                var title = Request.Headers.GetValues("title").FirstOrDefault();
                int pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                int pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                var matter = db.usp_wf_GetKnowldgeDetailsFav1byrowid(LoggedInUser.FirmId, LoggedInUser.UserId, title, pagenum, pagesize).ToList();
                var param = controllername + ">LoadKnowldgeFavDetailsbyrowid>usp_wf_GetKnowldgeDetailsFav1byrowid>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId + "@" + title;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var a = JsonConvert.SerializeObject(matter);
                return Ok(a);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Save knowledge document
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult InsertKnowledgeDoc()
        {
            using (LawPracticeEntities db = new LawPracticeEntities())
            {
                using (var transaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var aff = 0;
                        var title = QueryAES.UrlDecode(HttpContext.Current.Request.Form["title"]);
                        var text = QueryAES.UrlDecode(HttpContext.Current.Request.Form["desc"]);
                        if (title == "")
                        {
                            title = "DefaultTemplate";
                        }
                        var path = "";
                        path = HttpContext.Current.Server.MapPath("~/Documents/Knowledge/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId);
                        if (!(Directory.Exists(path)))
                        {
                            Directory.CreateDirectory(path);
                        }
                        var httpRequest = HttpContext.Current.Request;
                        if (httpRequest.Files.Count > 0)
                        {
                            var docfiles = new List<string>();
                            string folderPath = HttpContext.Current.Server.MapPath("~/Documents/Knowledge/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/");
                            string folderpathazure = "Documents/Knowledge/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                            //Check whether Directory (Folder) exists.
                            if (!Directory.Exists(folderPath))
                            {
                                //If Directory (Folder) does not exists. Create it.
                                Directory.CreateDirectory(folderPath);
                            }
                            for (int i = 0; i < httpRequest.Files.Count; i++)
                            {
                                var postedFile = httpRequest.Files[i];
                                var fileName = Path.GetFileNameWithoutExtension(postedFile.FileName);
                                var fileext = Path.GetExtension(postedFile.FileName);
                                var fileName1 = "_E2bdADS__" + fileName + randomno() + fileext;
                                var filePath = folderPath + Path.GetFileName(fileName1); //HttpContext.Current.Server.MapPath(+ postedFile.FileName);
                                var fileextchk = Path.GetExtension(postedFile.FileName);
                                var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);
                                postedFile.SaveAs(filePath);
                                string input = filePath;
                                string tempflname = fileName1;
                                tempflname = tempflname.Remove(0, 10);
                                docfiles.Add(tempflname);
                                string output = folderPath + Path.GetFileName(tempflname);
                                QueryAES.FileEncrypt(input, output);
                                //save file to azure
                                AzureDocumentself.CreateNestedDirectory(folderpathazure);
                                var status = AzureDocumentself.filecreateafteredit(output, folderpathazure, Path.GetFileName(tempflname), null, null);
                                if (status == true)
                                {
                                    tblknowledge tm = new tblknowledge();
                                    tm.Firmid = LoggedInUser.FirmId;
                                    tm.firmuser = LoggedInUser.UserId;
                                    tm.date_time = DateTime.Now;
                                    tm.tname = title;
                                    tm.tfile = tempflname;
                                    tm.Content = text;
                                    tm.Active = Convert.ToByte(1);
                                    tm.AzureFileId = folderpathazure;
                                    tm.ftype = 1;
                                    tm.pfile = Guid.Empty;
                                    db.tblknowledges.Add(tm);
                                    aff = db.SaveChanges();
                                    var id = tm.tid;
                                    tblknowledgePermission objp = new tblknowledgePermission();
                                    objp.kid = id;
                                    objp.Userid = Guid.Parse(LoggedInUser.UserId.ToString());
                                    objp.ViewRight = 1;
                                    objp.Firmid = Guid.Parse(LoggedInUser.FirmId.ToString());
                                    objp.DownloadRight = 1;
                                    objp.CreatedBy = Guid.Parse(LoggedInUser.UserId.ToString());
                                    objp.CreatedOn = DateTime.Now;
                                    db.tblknowledgePermissions.Add(objp);
                                    db.SaveChanges();
                                    tbl_notification tn1 = new tbl_notification();
                                    tn1.date_time = DateTime.Now;
                                    tn1.Firmid = Guid.Parse(LoggedInUser.FirmId.ToString());
                                    tn1.userid = Guid.Parse(LoggedInUser.UserId.ToString());
                                    tn1.auser = Guid.Parse(LoggedInUser.UserId.ToString());
                                    tn1.ntype = "Knowledge";
                                    tn1.status = 0;
                                    tn1.urllink = "";
                                    tn1.notification = "You have Create New File";
                                    tn1.typeid = id;
                                    db.tbl_notification.Add(tn1);
                                    db.SaveChanges();
                                    string strfilepath = filePath;
                                    var directory = Path.GetDirectoryName(strfilepath);
                                    string strfileName = Path.GetFileName(strfilepath);
                                    string mimeType = MimeMapping.GetMimeMapping(strfileName);
                                    var base64File = Convert.ToBase64String(System.IO.File.ReadAllBytes(Path.Combine(directory, strfileName)));
                                    //delete file
                                    try
                                    {
                                        System.IO.File.Delete(input);
                                    }
                                    catch (Exception er)
                                    {
                                    }
                                    if (aff > 0)
                                    {
                                        dynamic data = null;
                                        var client = new WebClient();
                                        object inputf = new
                                        {
                                            Id = id,
                                            FirmId = LoggedInUser.FirmId,
                                            UserId = LoggedInUser.UserId,
                                            DocFile = base64File,
                                            DocTitle = tempflname,
                                            DocName = title,
                                            Filepath = tempflname,
                                            MimeType = postedFile.ContentType,
                                        };
                                        var dataString = JsonConvert.SerializeObject(inputf);
                                        client.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                                        ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                                        string json = client.UploadString(new Uri(WebConfigurationManager.AppSettings["ElasticSearchAdd"]), "POST", dataString);
                                        data = JObject.Parse(json);
                                        var tempstatus = data["Status"];
                                        if (tempstatus == true)
                                        {
                                            transaction.Commit();
                                        }
                                        else
                                        {
                                            transaction.Rollback();
                                            return Ok(data);
                                        }
                                    }
                                }
                                else
                                {
                                    return Ok("Document uploading failed in cloud server.");
                                }
                            }
                        }
                        else
                        {
                            return Ok("File not found");
                        }
                        var param = controllername + ">InsertKnowledgeDoc>>param=";
                        db1.usp_AddAudit(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                        return Ok(aff);
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        db1.usp_AddAuditError(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                        return Ok();
                    }
                }
            }
        }

        /// <summary>
        /// Elastic search in document
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ElasticSearchinDoc()
        {
            try
            {
                var param = controllername + ">ElasticSearchinDoc>>param=";
                db1.usp_AddAudit(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var db = new LawPracticeEntities();
                var strloggeduser = LoggedInUser.UserId;
                //get azurepath
                var dirname = Request.Headers.GetValues("dirname").FirstOrDefault();
                var parentid = "";
                string folderPath = "";
                string folderpathazure = "";
                if (String.IsNullOrEmpty(dirname))
                {
                    dirname = Guid.Empty.ToString();
                    folderpathazure = "";
                }
                else
                {
                    folderpathazure = db.usp_getknowledeFileIdbyid(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), dirname).FirstOrDefault();
                }
                var strdoctitle = "";
                var strdoctext = "";
                var type = Convert.ToInt32(Request.Headers.GetValues("type").FirstOrDefault());
                if (type == 1)
                {
                    strdoctitle = Convert.ToString(Request.Headers.GetValues("strtxt").FirstOrDefault());
                    strdoctext = "";
                }
                else
                {
                    strdoctitle = "";
                    strdoctext = Convert.ToString(Request.Headers.GetValues("strtxt").FirstOrDefault());
                }
                int pageid = 0;
                var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("ViewKnowledge/0")).FirstOrDefault();
                if (pagelist != null)
                {
                    pageid = Convert.ToInt32(pagelist.ParentPage);
                }
                var listdatas = db1.usp_AllGetKnowldgeFiles(LoggedInUser.FirmId, LoggedInUser.UserId, "", 1, int.MaxValue, "", pageid).ToList();
                dynamic json = null;
                using (var client = new WebClient())
                {
                    object input = new
                    {
                        Id = "",
                        FirmId = LoggedInUser.FirmId.ToString(),
                        UserId = "",
                        DocTitle = strdoctitle,
                        SearchText = strdoctext,
                        Filepath = "",
                        Module = "2"
                    };
                    var dataString = JsonConvert.SerializeObject(input);
                    client.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    json = client.UploadString(new Uri(WebConfigurationManager.AppSettings["ElasticSearch"]), "POST", dataString);
                    JavaScriptSerializer js = new JavaScriptSerializer();
                    dynamic blogObject = js.Deserialize<dynamic>(json);
                    string kids = blogObject[0]["UserId"];
                    var getkuser = db.tblknowledges.Where(x => x.tid.ToString() == kids.ToString()).FirstOrDefault();
                    string createdby = "";
                    if (getkuser != null)
                    {
                        createdby = getkuser.firmuser.ToString();
                    }
                    List<TempIdModal> lsIds = new List<TempIdModal>();
                    foreach (var key in blogObject)
                    {
                        var tid = new TempIdModal();
                        dynamic fids = key["Id"];
                        tid.Id = Guid.Parse(fids);
                        lsIds.Add(tid);
                    }
                    var adata = (from ord in listdatas
                                 join detail in lsIds on ord.tid equals detail.Id
                                 select new
                                 {
                                     ord.totRow,
                                     ord.rownum,
                                     ord.tid,
                                     ord.AuthorName,
                                     ord.Active,
                                     ord.AzureFileId,
                                     ord.Category,
                                     ord.Content,
                                     ord.Createby,
                                     ord.date_time,
                                     ord.creator,
                                     ord.DownRight,
                                     ord.DocDate,
                                     ord.export,
                                     ord.Fav,
                                     ord.Firmid,
                                     ord.firmuser,
                                     ord.ftype,
                                     ord.iupdate,
                                     ord.share,
                                     ord.pfile,
                                     ord.IsSync,
                                     ord.tname,
                                     ord.oedit,
                                     ord.odelete,
                                     ord.tfile,
                                     ord.Source,
                                 }).ToList();
                    var data = JsonConvert.SerializeObject(adata);
                    var result = new { Data = data, Createdby = createdby };
                    return Ok(data);
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Mark as favourite
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        public IHttpActionResult MarkFavourite([FromBody] JObject paramJObject)
        {
            try
            {
                var aff = 0;
                var db = new LawPracticeEntities();
                tblFavKnowledge tm = new tblFavKnowledge();
                var id = Request.Headers.GetValues("id").FirstOrDefault();
                var fav = Convert.ToString(Request.Headers.GetValues("fav").FirstOrDefault());
                var param = controllername + ">MarkFavourite>>param=" + id + "@" + fav;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var col = db.usp_GetFavKnowledgeById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), id.ToString()).FirstOrDefault();
                if (col != null && col.kid.ToString() != "0")
                {
                    if (Convert.ToString(fav) == "1")
                    {
                        aff = db.usp_SaveFavKnowledge(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), id.ToString(), Convert.ToByte(fav));
                        string notification = "You have added file in Favourite list of Knowledge";
                        db.usp_AddActivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), notification, "Add in Favourite", null, id.ToString());
                    }
                    else
                    {
                        col.iupdate = 1;
                        col.Firmid = LoggedInUser.FirmId;
                        col.Fav = Convert.ToByte(0);
                        aff = db.usp_SaveFavKnowledge(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), id.ToString(), Convert.ToByte(0));
                        var datas = db.usp_getknowledeFileNameById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), id.ToString()).FirstOrDefault();
                        string notification = "You have removed the file (" + datas + ") from Favorite list of Knowledge.";
                        db.usp_AddActivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), notification, "Un-Favourite Knowledge Document", null, id.ToString());
                    }
                }
                else
                {
                    tblFavKnowledge objf = new tblFavKnowledge();
                    if (Convert.ToString(fav) == "1")
                    {
                        objf.Fav = Convert.ToByte(fav);
                    }
                    else
                    {
                        objf.Fav = Convert.ToByte(0);
                    }
                    aff = db.usp_SaveFavKnowledge(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), id.ToString(), objf.Fav);
                    string notification = "You have added file in Favourite list of Knowledge";
                    db.usp_AddActivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), notification, "Add in Favourite", null, id.ToString());
                }
                return Ok(aff);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Load knowledge all details
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadKnowldgeAllDetails([FromBody] JObject paramJObject)
        {
            try
            {
                var struser = Request.Headers.GetValues("user").FirstOrDefault();
                var db = new LawPracticeEntities();
                var matter = db.usp_wf_GetKnowldgeAllDetails(struser, LoggedInUser.FirmId).ToList();
                var param = controllername + ">LoadKnowldgeAllDetails>usp_wf_GetKnowldgeAllDetails>param=" + struser + "@" + LoggedInUser.FirmId;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var a = JsonConvert.SerializeObject(matter);
                return Ok(a);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Get knowldge all details by rowid
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadKnowldgeAllDetailsbyrowid()
        {
            try
            {
                var struser = Request.Headers.GetValues("user").FirstOrDefault();
                int pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                int pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                var db = new LawPracticeEntities();
                var matter = db.usp_wf_GetKnowldgeAllDetailsbyrowid(struser, LoggedInUser.FirmId, pagenum, pagesize).ToList();
                var param = controllername + ">LoadKnowldgeAllDetailsbyrowid>usp_wf_GetKnowldgeAllDetailsbyrowid>param=" + struser + "@" + LoggedInUser.FirmId;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var a = JsonConvert.SerializeObject(matter);
                return Ok(a);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// User knowledge permission
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        public IHttpActionResult UserKnowledgePermission()
        {
            try
            {
                var aff = 0;
                var db = new LawPracticeEntities();
                var id = Request.Headers.GetValues("id").FirstOrDefault();
                var struser = Request.Headers.GetValues("Userid").FirstOrDefault();
                var param = controllername + ">UserKnowledgePermission>>param=" + id + "@" + struser;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var data = db.Usp_GetKnowledgeUserRight(LoggedInUser.FirmId.ToString(), struser, id).FirstOrDefault();
                var a = JsonConvert.SerializeObject(data);
                return Ok(a);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Knowledge permission
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        public IHttpActionResult KnowledgePermission()
        {
            try
            {
                var aff = 0;
                var id = "";
                var db = new LawPracticeEntities();
                try
                {
                    id = QueryAES.DecryptStringAES(Request.Headers.GetValues("id").FirstOrDefault());
                }
                catch (Exception es)
                {
                    id = Request.Headers.GetValues("id").FirstOrDefault();
                }
                var struser = Request.Headers.GetValues("Userid").FirstOrDefault();
                var param = controllername + ">KnowledgePermission>>param=" + id + "@" + struser;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var tblval = db.usp_GetKnowledgeRightsPermissionByAssignUserId(LoggedInUser.FirmId.ToString(), struser.ToString(), id.ToString()).FirstOrDefault();
                if (tblval != null && tblval.id.ToString() != "0")
                {
                    tblval.ViewRight = Convert.ToInt32(Request.Headers.GetValues("chkView").FirstOrDefault());
                    tblval.DownloadRight = Convert.ToInt32(Request.Headers.GetValues("chkDwn").FirstOrDefault());
                    aff = db.usp_SaveKnowledgeRightsPermission(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), struser, id.ToString(), tblval.DownloadRight, tblval.ViewRight);
                }
                else
                {
                    tblknowledgePermission objp = new tblknowledgePermission();
                    objp.ViewRight = Convert.ToInt32(Request.Headers.GetValues("chkView").FirstOrDefault());
                    objp.DownloadRight = Convert.ToInt32(Request.Headers.GetValues("chkDwn").FirstOrDefault());
                    aff = db.usp_SaveKnowledgeRightsPermission(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), struser, id.ToString(), objp.DownloadRight, objp.ViewRight);
                }
                try
                {
                    var filename = db.usp_getknowledeFileNameById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), id.ToString()).FirstOrDefault();
                    if (filename != null)
                    {
                        string notification = "You have Shared the Document (" + filename + ") in knowledge";
                        db.usp_AddActivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), notification, "Share Document", null, Guid.Empty.ToString());
                    }
                }
                catch
                {
                }
                return Ok(aff);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Get Knowledge rights permission by assign userid
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        public IHttpActionResult KnowledgeDwnPermission()
        {
            try
            {
                var aff = 0;
                var id = "";
                var db = new LawPracticeEntities();
                try
                {
                    id = QueryAES.DecryptStringAES(Request.Headers.GetValues("id").FirstOrDefault());
                }
                catch (Exception es)
                {
                    id = Request.Headers.GetValues("id").FirstOrDefault();
                }
                var struser = Request.Headers.GetValues("Userid").FirstOrDefault();
                var param = controllername + ">KnowledgeDwnPermission>>param=" + id + "@" + struser;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var tblval = db.usp_GetKnowledgeRightsPermissionByAssignUserId(LoggedInUser.FirmId.ToString(), struser.ToString(), id.ToString()).FirstOrDefault();
                if (tblval != null && tblval.id.ToString() != "0")
                {
                    tblval.ViewRight = Convert.ToInt32(Request.Headers.GetValues("chkView").FirstOrDefault());
                    tblval.DownloadRight = Convert.ToInt32(Request.Headers.GetValues("chkDwn").FirstOrDefault());
                    aff = db.usp_SaveKnowledgeRightsPermission(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), struser, id.ToString(), tblval.DownloadRight, tblval.ViewRight);
                }
                else
                {
                    tblknowledgePermission objp = new tblknowledgePermission();
                    objp.ViewRight = Convert.ToInt32(Request.Headers.GetValues("chkView").FirstOrDefault());
                    objp.DownloadRight = Convert.ToInt32(Request.Headers.GetValues("chkDwn").FirstOrDefault());
                    aff = db.usp_SaveKnowledgeRightsPermission(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), struser, id.ToString(), objp.DownloadRight, objp.ViewRight);
                }
                return Ok(aff);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Mark as delete
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        public IHttpActionResult MarkDelete([FromBody] JObject paramJObject)
        {
            try
            {
                var aff = 0;
                var folderpathazure = "";
                var db = new LawPracticeEntities();
                tblknowledge tm = new tblknowledge();
                var id = Request.Headers.GetValues("id").FirstOrDefault();
                var param = controllername + ">MarkDelete>>param=" + id;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var checkfolderfile = db.usp_CheckfolderKnowledge(LoggedInUser.FirmId.ToString(), id.ToString()).FirstOrDefault();
                if (checkfolderfile.ftype == 0)//for folder
                {
                    int isEmpty1 = db.Usp_FindFolderEmpty(LoggedInUser.FirmId.ToString(), checkfolderfile.firmuser.ToString(), id.ToString()).Count();
                    if (isEmpty1 == 0)
                    {
                        var removedata = db.Usp_RemoveKnowledgefilefolder(LoggedInUser.FirmId.ToString(), checkfolderfile.firmuser.ToString(), id.ToString());
                        //delete document from azure
                        try
                        {
                            if (checkfolderfile.pfile.ToString() == Guid.Empty.ToString())
                            {
                                folderpathazure = "Documents/Knowledge/" + checkfolderfile.Firmid + "/" + checkfolderfile.firmuser;
                            }
                            else
                            {
                                var dirfullpath = db.sp_Getknowfilepaths(Guid.Parse(checkfolderfile.Firmid.ToString()), Guid.Parse(checkfolderfile.firmuser.ToString()), Guid.Parse(checkfolderfile.pfile.ToString())).FirstOrDefault();
                                string dirpathname = dirfullpath.ToString();
                                folderpathazure = "Documents/Knowledge/" + checkfolderfile.Firmid + "/" + checkfolderfile.firmuser + "/" + dirpathname;
                            }
                            var data = AzureDocumentself.DeleteFolder(folderpathazure, checkfolderfile.tfile, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                        }
                        catch (Exception ex)
                        {
                        }
                        return Ok("");
                    }
                    else
                    {
                        return Ok("false");
                    }
                }
                else
                {
                    dynamic data = null;
                    var client = new WebClient();
                    object input = new
                    {
                        Id = id,
                        FirmId = LoggedInUser.FirmId,
                        UserId = LoggedInUser.UserId
                    };
                    var dataString = JsonConvert.SerializeObject(input);
                    client.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    string json = client.UploadString(new Uri(WebConfigurationManager.AppSettings["ElasticSearchDelete"]), "POST", dataString);
                    data = JObject.Parse(json);
                    //delete from database
                    var removedata = db.Usp_RemoveKnowledgefilefolder(LoggedInUser.FirmId.ToString(), checkfolderfile.firmuser.ToString(), id.ToString());
                    //delete document from azure
                    try
                    {
                        if (checkfolderfile.pfile.ToString() == Guid.Empty.ToString())
                        {
                            folderpathazure = "Documents/Knowledge/" + checkfolderfile.Firmid + "/" + checkfolderfile.firmuser;
                        }
                        else
                        {
                            var dirfullpath = db.sp_Getknowfilepaths(Guid.Parse(checkfolderfile.Firmid.ToString()), Guid.Parse(checkfolderfile.firmuser.ToString()), Guid.Parse(checkfolderfile.pfile.ToString())).FirstOrDefault();
                            string dirpathname = dirfullpath.ToString();
                            folderpathazure = "Documents/Knowledge/" + checkfolderfile.Firmid + "/" + checkfolderfile.firmuser + "/" + dirpathname;
                        }
                        AzureDocumentself.DeleteFile(folderpathazure, checkfolderfile.tfile, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                    }
                    catch (Exception ex)
                    {
                    }
                }
                return Ok(aff);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Check user details
        /// </summary>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CheckUser()
        {
            try
            {
                var rst = "0";
                var db = new LawPracticeEntities();
                var struser = Request.Headers.GetValues("username").FirstOrDefault();
                var param = controllername + ">CheckUser>>param=" + struser;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, param, myIP(), GetMacAddress().ToString(), 0, "");
                var strdetail = db.CommonValidationByUserName(struser).FirstOrDefault();
                if (strdetail == 1)
                {
                    rst = "1";
                }
                else
                {
                    rst = "0";
                }
                return Ok(rst);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Get digit
        /// </summary>
        /// <param name="strtxt"></param>
        /// <returns></returns>
        private string Getdigit(string strtxt)
        {
            string digit = "";
            if (!string.IsNullOrEmpty(strtxt))
            {
                string[] numbers = Regex.Split(strtxt, @"\D+");
                digit = numbers[numbers.Length - 1];
            }
            return digit;
        }
        /// <summary>
        /// Get home page data by firm id
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult HomePageDataByFirmid()
        {
            try
            {
                var strfirmid = LoggedInUser.FirmId;
                var db = new LawPracticeEntities();
                var matter = db.usp_GetHomePageData(Guid.Parse(strfirmid.ToString())).ToList();
                var param = controllername + ">HomePageDataByFirmid>usp_GetHomePageData>param=" + strfirmid;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var a = JsonConvert.SerializeObject(matter);
                return Ok(a);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Save home page details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult HomePageSave()
        {
            try
            {
                var httpRequest = HttpContext.Current.Request;
                string folderPath = HttpContext.Current.Server.MapPath("~/HomePage/Logo/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/");
                //Check whether Directory (Folder) exists.
                if (!Directory.Exists(folderPath))
                {
                    //If Directory (Folder) does not exists. Create it.
                    Directory.CreateDirectory(folderPath);
                }
                var LogoPath = "";
                if (httpRequest.Files.Count > 0)
                {
                    var postedFile = httpRequest.Files[0];
                    var fileName = Path.GetFileNameWithoutExtension(postedFile.FileName);
                    var fileext = Path.GetExtension(postedFile.FileName);
                    var fileName1 = fileName + randomno() + fileext;
                    var filePath = folderPath + Path.GetFileName(fileName1); //HttpContext.Current.Server.MapPath(+ postedFile.FileName);
                    var fileextchk = Path.GetExtension(postedFile.FileName);
                    var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);
                    postedFile.SaveAs(filePath);
                    LogoPath = Convert.ToString("/HomePage/Logo/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/" + fileName1);
                }
                else
                {
                    LogoPath = QueryAES.UrlDecode(HttpContext.Current.Request.Form["logopath"]).ToString();
                }
                var db = new LawPracticeEntities();
                tblHome objp = new tblHome();
                var BackgroundImg = QueryAES.UrlDecode(HttpContext.Current.Request.Form["bkimg"]).ToString();
                var LogoHeading = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["heading"]));
                var Logotext = Convert.ToString(QueryAES.UrlDecodeEditor(HttpContext.Current.Request.Form["logotext"]));
                var Aboutus = Convert.ToString(QueryAES.UrlDecodeEditor(HttpContext.Current.Request.Form["aboutus"]));
                var Services = Convert.ToString(QueryAES.UrlDecodeEditor(HttpContext.Current.Request.Form["services"]));
                var Address = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["address"])); ;
                var ContactNo = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["phonenumber"]));
                var email = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["emailid"]));
                var website = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["website"]));
                var logoposition = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["logoposition"]));
                var CreatedOn = DateTime.Now;
                var CreatedBy = Guid.Parse(LoggedInUser.UserId.ToString());
                var Firm = Guid.Parse(LoggedInUser.FirmId.ToString());
                int aff = db.usp_InsertHomePageData(LogoPath, LogoHeading, Logotext, Aboutus, Services, Address, ContactNo, email, website, CreatedBy, Firm, BackgroundImg, logoposition);
                db.saveuseractivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.UserId.ToString(), 1, DateTime.Now.ToString(), "homepage", Guid.Empty.ToString(), null, null, DateTime.Now.ToString());
                var param = controllername + ">HomePageSave>usp_InsertHomePageData>param=" + LogoPath + "@" + LogoHeading + "@" + Logotext + "@" + Aboutus + "@" + Services + "@" + Address + "@" + ContactNo + "@" + email + "@" + website + "@" + CreatedBy + "@" + Firm + "@" + BackgroundImg;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(aff);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Home page data
        /// </summary>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult HomePageData()
        {
            try
            {
                var strfirmcode = "";
                if (!string.IsNullOrEmpty(Request.Headers.GetValues("firmcode").FirstOrDefault()))
                    strfirmcode = Request.Headers.GetValues("firmcode").FirstOrDefault();
                var strfirmid = GetFirmIdByFirmCode(strfirmcode.ToString().Replace("#", ""));
                var db = new LawPracticeEntities();
                var matter = db.usp_GetHomePageData(Guid.Parse(strfirmid)).ToList();
                var a = JsonConvert.SerializeObject(matter);
                var param = controllername + ">HomePageData>usp_GetHomePageData>param=" + strfirmid;
                return Ok(a);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Get firmid by firm code
        /// </summary>
        /// <param name="strfircode"></param>
        /// <returns></returns>
        public string GetFirmIdByFirmCode(string strfircode)
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmcode = strfircode;
                var strdetail = db.usp_GetFirmsbyCode_api(firmcode).FirstOrDefault();
                var firmid = strdetail.Id;
                return firmid.ToString();
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                throw ex;
            }
        }

        /// <summary>
        /// Matter list detail by clientId
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult MatterListDetailByClientId()
        {
            try
            {
                AddLawMatterList obj = new AddLawMatterList();
                obj.assignto = Guid.Parse(QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(Request.Headers.GetValues("clientid").FirstOrDefault())));
                obj.cstatus = Convert.ToString(Request.Headers.GetValues("status").FirstOrDefault());
                var strdetail = Repository.WorkFlowNew.MatterListDetailbyclientid(obj, LoggedInUser.RoleId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.FirmId.ToString());
                var param = controllername + ">MatterListDetailByClientId>MatterListDetailbyclientid>param=" + obj.assignto + "@" + obj.cstatus;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(strdetail);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Get client detail by client id
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ClientDetailByClientId()
        {
            try
            {
                var clientid = Request.Headers.GetValues("clientid").FirstOrDefault();
                clientid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(clientid));
                var call = Repository.WorkFlowNew.ClientDetail(clientid.ToString(), LoggedInUser.FirmId.ToString());
                var param = controllername + ">ClientDetailByClientId>ClientDetail>param=" + clientid + "@" + LoggedInUser.FirmId;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Client), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Client), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(call);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Client), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Client), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Create knowlege document file directory
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CreatefileDirectory()
        {
            try
            {
                var dname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dname"]);
                var directoryids = QueryAES.UrlDecode(HttpContext.Current.Request.Form["directoryid"]);
                var db = new LawPracticeEntities();
                var directoryname = "";
                string folderdirectid = "";
                if (dname != "" && directoryids != null)
                {
                    var directoryid = directoryids;
                    if (directoryid == "0")
                    {
                        directoryid = "00000000-0000-0000-0000-000000000000";
                    }
                    else
                    {
                    }
                    var dpath = "";
                    var path = "";
                    var ddetails = db.usp_CheckfolderKnowledge(LoggedInUser.FirmId.ToString(), directoryid.ToString()).FirstOrDefault();
                    if (ddetails != null)
                    {
                        folderdirectid = directoryids;
                        var fid = LoggedInUser.FirmId;
                        var uid = LoggedInUser.UserId;
                        directoryname = ddetails.tfile;
                        var dirfullpath = db.sp_Getknowfilepaths(fid, uid, Guid.Parse(folderdirectid)).FirstOrDefault();
                        string dirpathname = dirfullpath.ToString();
                        path = "Documents/Knowledge/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/" + dirpathname;
                        dpath = "Documents/Knowledge/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/" + dirpathname;
                    }
                    else
                    {
                        path = "Documents/Knowledge/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                        dpath = "";
                    }
                    path = path.TrimEnd('/').TrimStart('/');
                    AzureDocumentself.CreateNestedDirectory(path);
                    var createdirectorydata = AzureDocumentself.createfolder(path, "/" + dname, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                    if (createdirectorydata == "exist")
                    {
                        return Ok("Already Directory Exits With Same Name");
                    }
                    else
                    {
                        var param = controllername + ">CreatefileDirectory>Createdir>param=" + dname + "@" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId;
                        var data = db1.usp_SaveKnowledgefolder(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), dname, path, directoryid.ToString(), null);
                        return Ok("successfully created");
                    }
                }
                else
                {
                    return Ok("Directory Name is Blank");
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Create knowlege document file
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult Createknowledgefile()
        {
            using (LawPracticeEntities db = new LawPracticeEntities())
            {
                using (var transaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var path = "";
                        var aff = 0;
                        //  var cfile = HttpContext.Current.Request.Files["FileUpload"];
                        var category = QueryAES.UrlDecode(HttpContext.Current.Request.Form["category"]);
                        var author = QueryAES.UrlDecode(HttpContext.Current.Request.Form["author"]);
                        var source = QueryAES.UrlDecode(HttpContext.Current.Request.Form["source"]);
                        var date = QueryAES.UrlDecode(HttpContext.Current.Request.Form["date"]);
                        var title = QueryAES.UrlDecode(HttpContext.Current.Request.Form["title"]);
                        var text = QueryAES.UrlDecode(HttpContext.Current.Request.Form["desc"]);
                        if (title == "")
                        {
                            title = "DefaultTemplate";
                        }
                        var dirname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dirname"]);
                        var parentid = "";
                        string folderPath = "";
                        string folderpathazure = "";
                        if (!String.IsNullOrEmpty(dirname))
                        {
                            parentid = dirname;
                            var folderdirectid = dirname;
                            var fid = LoggedInUser.FirmId;
                            var uid = LoggedInUser.UserId;
                            var dirfullpath = db.sp_Getknowfilepaths(fid, uid, Guid.Parse(folderdirectid)).FirstOrDefault();
                            if (String.IsNullOrEmpty(dirfullpath))
                            {
                                return Ok("unauthoriseuser");
                            }
                            string dirpathname = dirfullpath.ToString();
                            path = HttpContext.Current.Server.MapPath("~/Documents/Knowledge/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/" + dirpathname);
                            folderPath = HttpContext.Current.Server.MapPath("~/Documents/Knowledge/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/" + dirpathname);
                            folderpathazure = "Documents/Knowledge/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/" + dirpathname;
                        }
                        else
                        {
                            parentid = Guid.Empty.ToString();
                            path = HttpContext.Current.Server.MapPath("~/Documents/Knowledge/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId);
                            folderPath = HttpContext.Current.Server.MapPath("~/Documents/Knowledge/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/");
                            folderpathazure = "Documents/Knowledge/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                        }
                        folderpathazure = folderpathazure.TrimStart('/').TrimEnd('/');
                        if (!(Directory.Exists(path)))
                        {
                            Directory.CreateDirectory(path);
                        }
                        var httpRequest = HttpContext.Current.Request;
                        if (httpRequest.Files.Count > 0)
                        {
                            var docfiles = new List<string>();
                            //Check whether Directory (Folder) exists.
                            if (!Directory.Exists(folderPath))
                            {
                                //If Directory (Folder) does not exists. Create it.
                                Directory.CreateDirectory(folderPath);
                            }
                            for (int i = 0; i < httpRequest.Files.Count; i++)
                            {
                                var postedFile = httpRequest.Files[i];
                                var fileName = Path.GetFileNameWithoutExtension(postedFile.FileName);
                                var fileext = Path.GetExtension(postedFile.FileName);
                                var fileName1 = "_E2bdADS__" + fileName + randomno() + fileext;
                                var filePath = folderPath + Path.GetFileName(fileName1); //HttpContext.Current.Server.MapPath(+ postedFile.FileName);
                                var fileextchk = Path.GetExtension(postedFile.FileName);
                                var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);
                                postedFile.SaveAs(filePath);
                                FileInfo fi = new FileInfo(filePath);
                                var DocSize = fi.Length;
                                string input = filePath;
                                string tempflname = fileName1;
                                tempflname = tempflname.Remove(0, 10);
                                docfiles.Add(tempflname);
                                string output = folderPath + Path.GetFileName(tempflname);
                                QueryAES.FileEncrypt(input, output);
                                //save file to azure
                                AzureDocumentself.CreateNestedDirectory(folderpathazure);
                                var status = AzureDocumentself.filecreateafteredit(output, folderpathazure, Path.GetFileName(tempflname), null, null);
                                if (status == true)
                                {
                                    string id = "";
                                    ObjectParameter IDParameter2;
                                    IDParameter2 = new ObjectParameter("id", id);
                                    var rs2 = db.usp_saveknowledgeDoc(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), title, tempflname, text, Convert.ToByte(1), folderpathazure, 1, date, author, category, source, parentid, IDParameter2, DocSize);
                                    id = Convert.ToString(IDParameter2.Value);
                                    var rs3 = db.usp_SaveKnowledgePermission(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), id, 1, 1, LoggedInUser.UserId.ToString());
                                    tbl_notification tn1 = new tbl_notification();
                                    tn1.date_time = DateTime.Now;
                                    tn1.Firmid = Guid.Parse(LoggedInUser.FirmId.ToString());
                                    tn1.userid = Guid.Parse(LoggedInUser.UserId.ToString());
                                    tn1.auser = Guid.Parse(LoggedInUser.UserId.ToString());
                                    tn1.ntype = "Knowledge";
                                    tn1.status = 0;
                                    tn1.urllink = "";
                                    tn1.notification = "You have Create New File";
                                    tn1.typeid = Guid.Parse(id);
                                    db.tbl_notification.Add(tn1);
                                    db.SaveChanges();
                                    string strfilepath = filePath;
                                    var directory = Path.GetDirectoryName(strfilepath);
                                    string strfileName = Path.GetFileName(strfilepath);
                                    string mimeType = MimeMapping.GetMimeMapping(strfileName);
                                    var base64File = Convert.ToBase64String(System.IO.File.ReadAllBytes(Path.Combine(directory, strfileName)));
                                    //delete file
                                    try
                                    {
                                        System.IO.File.Delete(input);
                                    }
                                    catch (Exception er)
                                    {
                                    }
                                    transaction.Commit();
                                }
                                else
                                {
                                    return Ok("Document uploading failed in cloud server.");
                                }
                            }
                        }
                        else
                        {
                            return Ok("File not found");
                        }
                        var param = controllername + ">Createknowledgefile>>param=";
                        db1.usp_AddAudit(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                        return Ok(aff);
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        db1.usp_AddAuditError(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                        return Ok();
                    }
                }
            }
        }

        /// <summary>
        /// Open browse document file
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult OpenBrowseDocumentfileOne()
        {
            using (LawPracticeEntities db = new LawPracticeEntities())
            {
                using (var transaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var path = "";
                        var aff = "";
                        var parentid = "";
                        string folderPath = "";
                        string folderpathazure = "";
                        parentid = Guid.Empty.ToString();
                        folderPath = HttpContext.Current.Server.MapPath("~/azuredirout/Compare/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/");
                        folderpathazure = "/azuredirout/Compare/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                        var httpRequest = HttpContext.Current.Request;
                        if (httpRequest.Files.Count > 0)
                        {
                            var docfiles = new List<string>();
                            //Check whether Directory (Folder) exists.
                            if (!Directory.Exists(folderPath))
                            {
                                //If Directory (Folder) does not exists. Create it.
                                Directory.CreateDirectory(folderPath);
                            }
                            for (int i = 0; i < httpRequest.Files.Count; i++)
                            {
                                var postedFile = httpRequest.Files[i];
                                var fileName = Path.GetFileNameWithoutExtension(postedFile.FileName);
                                var fileext = Path.GetExtension(postedFile.FileName);
                                var fileName1 = fileName + randomno() + fileext;
                                var filePath = folderPath + Path.GetFileName(fileName1); //HttpContext.Current.Server.MapPath(+ postedFile.FileName);
                                var fileextchk = Path.GetExtension(postedFile.FileName);
                                var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);
                                postedFile.SaveAs(filePath);
                                string input = filePath;
                                string tempflname = fileName1;
                                tempflname = tempflname.Remove(0, 10);
                                docfiles.Add(tempflname);
                                folderpathazure = folderpathazure + "/" + fileName1;
                                string output = folderPath + Path.GetFileName(tempflname);
                                aff = folderpathazure;
                            }
                        }
                        else
                        {
                            return Ok("File not found");
                        }
                        var param = controllername + ">Createknowledgefile>>param=";
                        db1.usp_AddAudit(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                        return Ok(aff);
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        db1.usp_AddAuditError(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                        return Ok();
                    }
                }
            }
        }

        /// <summary>
        /// Open two browse document files
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult OpenBrowseDocumentfileTwo()
        {
            using (LawPracticeEntities db = new LawPracticeEntities())
            {
                using (var transaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var path = "";
                        var aff = "";
                        var parentid = "";
                        string folderPath = "";
                        string folderpathazure = "";
                        parentid = Guid.Empty.ToString();
                        folderPath = HttpContext.Current.Server.MapPath("~/azuredirout/Compare/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/");
                        folderpathazure = "/azuredirout/Compare/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                        var httpRequest = HttpContext.Current.Request;
                        if (httpRequest.Files.Count > 0)
                        {
                            var docfiles = new List<string>();
                            //Check whether Directory (Folder) exists.
                            if (!Directory.Exists(folderPath))
                            {
                                //If Directory (Folder) does not exists. Create it.
                                Directory.CreateDirectory(folderPath);
                            }
                            for (int i = 0; i < httpRequest.Files.Count; i++)
                            {
                                var postedFile = httpRequest.Files[i];
                                var fileName = Path.GetFileNameWithoutExtension(postedFile.FileName);
                                var fileext = Path.GetExtension(postedFile.FileName);
                                var fileName1 = fileName + randomno() + fileext;
                                var filePath = folderPath + Path.GetFileName(fileName1); //HttpContext.Current.Server.MapPath(+ postedFile.FileName);
                                var fileextchk = Path.GetExtension(postedFile.FileName);
                                var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);
                                postedFile.SaveAs(filePath);
                                string input = filePath;
                                string tempflname = fileName1;
                                tempflname = tempflname.Remove(0, 10);
                                docfiles.Add(tempflname);
                                folderpathazure = folderpathazure + "/" + fileName1;
                                string output = folderPath + Path.GetFileName(tempflname);
                                aff = folderpathazure;
                            }
                        }
                        else
                        {
                            return Ok("File not found");
                        }
                        var param = controllername + ">Createknowledgefile>>param=";
                        db1.usp_AddAudit(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                        return Ok(aff);
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        db1.usp_AddAuditError(Convert.ToInt32(EventType.Knowledge), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Knowledge), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                        return Ok();
                    }
                }
            }
        }

        /// <summary>
        /// Remove document browse document file
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveBrowseDocumentfile()
        {
            var filepath = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filepath"]);
            try
            {
                System.IO.File.Delete(filepath);
            }
            catch (Exception er)
            {
            }
            return Ok();
        }

        /// <summary>
        /// Upload notice logo
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult NoticePageLogoSave()
        {
            // dynamic aff = 0;
            try
            {
                var httpRequest = HttpContext.Current.Request;
                string folderPath = HttpContext.Current.Server.MapPath("~/Notice/Logo/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/");
                //Check whether Directory (Folder) exists.
                if (!Directory.Exists(folderPath))
                {
                    //If Directory (Folder) does not exists. Create it.
                    Directory.CreateDirectory(folderPath);
                }
                var LogoPath = "";
                if (httpRequest.Files.Count > 0)
                {
                    var postedFile = httpRequest.Files[0];
                    var fileName = Path.GetFileNameWithoutExtension(postedFile.FileName);
                    var fileext = Path.GetExtension(postedFile.FileName);
                    var fileName1 = fileName + randomno() + fileext;
                    var filePath = folderPath + Path.GetFileName(fileName1); //HttpContext.Current.Server.MapPath(+ postedFile.FileName);
                    var fileextchk = Path.GetExtension(postedFile.FileName);
                    var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);
                    postedFile.SaveAs(filePath);
                    LogoPath = Convert.ToString("/Notice/Logo/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/" + fileName1);
                }
                var heading = QueryAES.UrlDecode(HttpContext.Current.Request.Form["heading"]).ToString();
                var db = new LawPracticeEntities();
                tblHome objp = new tblHome();
                int aff = db.usp_InsertNoticeLogo(LogoPath, heading, LoggedInUser.UserId.ToString(), LoggedInUser.FirmId.ToString());
                db.saveuseractivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.UserId.ToString(), 1, DateTime.Now.ToString(), "homepage", Guid.Empty.ToString(), null, null, DateTime.Now.ToString());
                return Ok(aff);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Get notice logo path
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult NoticeLogoPath()
        {
            try
            {
                var firmlogopath = "";
                var db = new LawPracticeEntities();
                var firmlogo = db.usp_GetNoticeLogoData(LoggedInUser.FirmId.ToString()).FirstOrDefault();
                if (firmlogo != null)
                {
                    firmlogopath = firmlogo.LogoPath.ToString();
                }
                return Ok(firmlogopath);
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }

        /// <summary>
        /// Remove notice logo path
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveNoticeLogoPath()
        {
            try
            {
                var filepath = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filepath"]);
                var firmlogopath = "";
                var db = new LawPracticeEntities();
                var firmlogo = db.usp_RemoveNoticeLogoData(LoggedInUser.FirmId.ToString(), filepath);
                if (firmlogo > 0)
                {
                    try
                    {
                        System.IO.File.Delete(filepath);
                    }
                    catch
                    {
                    }
                }
                return Ok(firmlogo);
            }
            catch
            {
                return Ok();
            }
        }
    }
}
