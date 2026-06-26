using BussinessLogic;
using BussinessLogic.BusinessEntity;
using BussinessLogic.Common;
using DataAccess.Modals;
using LawPracticeFirm.Common;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NJDGDetail.Models;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Configuration;
using System.Web.Http;
using static LawPracticeFirm.Models.AuditData;

namespace LawPracticeFirm.API
{
    public class EmployeeApiController : BaseFirmApiController
    {
        private LawPracticeEntities db1 = new LawPracticeEntities();
        public string controllername = "EmployeeApiController";
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization()]
        public Tuple<string, List<ApplicationUrl>, List<string>, FirmEmployee> UserProfile([FromBody] JObject paramJObject)
        {

            if (HttpContext.Current.Request.UrlReferrer != null)
            {
                string firm = (HttpContext.Current.Request.UrlReferrer.Segments[1].Replace("/", string.Empty));
                //Get URLs
                var types = new string[] { "LIST", "CONFIGURATION", "WORKFLOW", "INFO", "ADD" };
                var urls = CacheManager.UrlList.Where(u => types.Contains(u.Type)).OrderBy(o => o.Sequence).Select(s => new ApplicationUrl
                {
                    Url = string.Concat("/", firm, s.Url),
                    Title = s.Title,
                    Type = s.Type
                }).ToList();

                var url = CacheManager.FindUrlByName("CaseDetail");
                if (HttpContext.Current.Request.UrlReferrer != null)
                {
                    url = string.Concat("/", firm, url);
                }

                var mycases = CacheManager.FindUrlByName("CaseList");
                if (HttpContext.Current.Request.UrlReferrer != null)
                {
                    mycases = string.Concat("/", firm, mycases);
                }
                return new Tuple<string, List<ApplicationUrl>, List<string>, FirmEmployee>(firm, urls, new List<string> { url, mycases }, LoggedInUser);
            }

            return null;
        }

        /// <summary>
        /// Firm employee list
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization(AdminUser = true)]
        public Tuple<string, List<string>> FirmEmployeeList([FromBody] JObject paramJObject)
        {
            var url = CacheManager.FindUrlByName("UserDetail");
            List<string> urls = new List<string>();
            if (HttpContext.Current.Request.UrlReferrer != null)
            {
                string firm = (HttpContext.Current.Request.UrlReferrer.Segments[1].Replace("/", string.Empty));
                urls.Add(string.Concat("/", firm, url));
            }

            var d = Repository.Firm.GetFirmInputData(LoggedInUser.FirmId.ToString(), Convert.ToInt32(ModuleType.User));
            return new Tuple<string, List<string>>(d, urls);
        }

        /// <summary>
        /// Firm employee
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization(AdminUser = true)]
        public string FirmEmployees([FromBody] JObject paramJObject)
        {
            var request = paramJObject.ToObject<BussinessLogic.BusinessEntity.CustomField>();
            var pname = Convert.ToString(ConfigurationManager.AppSettings["PrimaryNameField"]);
            var d = Repository.Firm.GetSpecificFirmInputData(LoggedInUser.FirmId.ToString(), Convert.ToInt32(ModuleType.User), pname, request.DefaultValues);
            return d;

        }

        /// <summary>
        /// Get firm users
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization(AdminUser = true)]
        public Tuple<string, string> FirmUsers([FromBody] JObject paramJObject)
        {
            try
            {
                var request = paramJObject.ToObject<BussinessLogic.BusinessEntity.CustomField>();
                var pname = Convert.ToString(ConfigurationManager.AppSettings["PrimaryNameField"]);
                var confId = string.Concat(Convert.ToInt32(ModuleType.User).ToString(), ",", Convert.ToInt32(ModuleType.Client).ToString());
                var u = Repository.Firm.GetSpecificFirmInputData(LoggedInUser.FirmId.ToString(), Convert.ToInt32(ModuleType.User), pname, request.DefaultValues);
                var c = Repository.Firm.GetSpecificFirmInputData(LoggedInUser.FirmId.ToString(), Convert.ToInt32(ModuleType.Client), pname, request.DefaultValues);
                return new Tuple<string, string>(u, c);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return new Tuple<string, string>("a", "b");
            }

        }

        /// <summary>
        /// Get users detail
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization(AdminUser = true)]
        public Tuple<string, string> EmployeeDetails([FromBody] JObject paramJObject)
        {
            try
            {
                var request = paramJObject.ToObject<FirmInputData>();
                var u = Repository.FirmUser.GetUser(LoggedInUser.FirmId.ToString(), request.Id.ToString());
                return u;
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Employee), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                throw ex;
            }
        }

        /// <summary>
        /// Update Profile
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization(AdminUser = true)]
        public bool UpdateProfile([FromBody] JObject paramJObject)
        {
            try
            {
                var request = paramJObject.ToObject<FirmInputData>();
                var result = Repository.Firm.UpdateFirmInputData(request);
                if (result)
                {
                    LoggedInUser.Details = Repository.FirmUser.UserProfile(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), ModuleType.User.ToString());
                    UpdateSession(HttpContext.Current, LoggedInUser);
                }
                return result;
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Employee), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                throw ex;
            }
        }

        /// <summary>
        /// Add new user
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization(AdminUser = true)]
        public bool AddNewUser([FromBody] JObject paramJObject)
        {
            try
            {
                var request = paramJObject.ToObject<FirmInputData>();
                var result = Repository.FirmUser.AddNewUser(request.User, request.Data, LoggedInUser.FirmId.ToString());
                return result;
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Employee), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                throw ex;
            }
        }

        /// <summary>
        /// Update user
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        [FirmApiAuthorization(AdminUser = true)]
        public bool UpdateUser([FromBody] JObject paramJObject)
        {
            try
            {
                var request = paramJObject.ToObject<FirmInputData>();
                if (request.Id <= 0)
                {
                    return false;
                }
                var result = Repository.Firm.UpdateFirmInputData(request, request.Id);

                return result;
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Employee), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                throw ex;
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
        /// User details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult UserDetail()
        {
            try
            {
                var call = Repository.FirmUsers.ClientDetail(LoggedInUser.UserId.ToString(), LoggedInUser.FirmId.ToString());
                var param = controllername + ">UserDetail>ClientDetail>param=" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Employee), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(call);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Employee), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Save profile
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
                string savedEmail = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["savedEmail"]));
                string savedMobile = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["savedMobile"]));
                string faeemail = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["email"]));
                if (faeemail != savedEmail)
                {
                    if (faeemail != null)
                    {
                        var firmuserem = db.ValidateEmail(faeemail, LoggedInUser.FirmId.ToString()).FirstOrDefault();
                        if (firmuserem != null)
                        {
                            return Ok("E-Mail Already Exists  Please Try Another E-Mail!");
                        }
                    }
                }
                var checkemail = db.FirmUsers.Where(a => a.Id == LoggedInUser.UserId).FirstOrDefault();
                string famobile = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["mobile"]));
                var checkmob = db.usp_wf_GetUserDetails(LoggedInUser.FirmId, LoggedInUser.UserId).FirstOrDefault();
                if (famobile != savedMobile)
                {
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
                }
                if (httpRequest.Files.Count > 0)
                {
                    var docfiles = new List<string>();
                    string folderPath = HttpContext.Current.Server.MapPath("~/Documents/UserPic/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/");
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
                        obj.cphoto = "/Documents/UserPic/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/" + fileName1;
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
                if (!string.IsNullOrEmpty(QueryAES.UrlDecode(HttpContext.Current.Request.Form["department"])))
                {
                    aadhar = QueryAES.UrlDecode(HttpContext.Current.Request.Form["aadhar"]);
                }
                var gst = QueryAES.UrlDecode(HttpContext.Current.Request.Form["gstin"]);
                var pan = QueryAES.UrlDecode(HttpContext.Current.Request.Form["panno"]);
                obj.Firmid = LoggedInUser.FirmId;
                obj.Id = Guid.Parse(QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(QueryAES.UrlDecode(HttpContext.Current.Request.Form["id"]).Replace(" ", "+"))));
                obj.firmuser = LoggedInUser.UserId;
                var apiurl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                string commuemail = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["commuemail"]));
                var strdetail = Repository.FirmUsers.SaveProfile(obj, uemail, aadhar, gst, pan, apiurl, commuemail);
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
        /// Save contact details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult PostSaveContact()
        {
            try
            {
                var db = new LawPracticeEntities();
                var fm = new AddContactsList();
                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count > 0)
                {
                    var docfiles = new List<string>();
                    string folderPath = HttpContext.Current.Server.MapPath("~/Documents/Contactdocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/");
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
                        fm.cphoto = "/Documents/Contactdocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/" + fileName1;
                    }
                }
                var ftype = Convert.ToString(Request.Headers.GetValues("ftype").FirstOrDefault());
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
                fm.ContactType = QueryAES.UrlDecode(HttpContext.Current.Request.Form["contacttype"]);
                fm.Firmid = Guid.Parse(LoggedInUser.FirmId.ToString());
                fm.firmuser = LoggedInUser.UserId;
                fm.lname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["lname"]);
                fm.fname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fname"]);
                fm.homeno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["homeno"]);
                fm.mobno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["mobno"]);
                fm.offno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["offno"]);
                fm.fax = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fax"]);
                fm.cemail = QueryAES.UrlDecode(HttpContext.Current.Request.Form["cemail"]);
                fm.cnotes = QueryAES.UrlDecode(HttpContext.Current.Request.Form["cnotes"]);
                fm.cport = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["cport"]));
                fm.cadd1 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["cadd1"]);
                fm.ctags = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ctags"]);
                fm.cnumber = QueryAES.UrlDecode(HttpContext.Current.Request.Form["cnumber"]);
                fm.cwebsite = QueryAES.UrlDecode(HttpContext.Current.Request.Form["cwebsite"]);
                fm.mname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["mname"]);
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
                    fm.col1 = null;
                }
                else
                {
                    fm.col1 = mcol1;
                }

                if (mcol2 == "undefined")
                {
                    fm.col2 = null;
                }
                else
                {
                    fm.col2 = mcol2;
                }

                if (mcol3 == "undefined")
                {
                    fm.col3 = null;
                }
                else
                {
                    fm.col3 = mcol3;
                }
                if (mcol4 == "undefined")
                {
                    fm.col4 = null;
                }
                else
                {
                    fm.col4 = mcol4;
                }

                if (mcol5 == "undefined")
                {
                    fm.col5 = null;
                }
                else
                {
                    fm.col5 = mcol5;
                }

                if (mcol6 == "undefined")
                {
                    fm.col6 = null;
                }
                else
                {
                    fm.col6 = mcol6;
                }
                if (mcol7 == "undefined")
                {
                    fm.col7 = null;
                }
                else
                {
                    fm.col7 = mcol7;
                }
                if (mcol8 == "undefined")
                {
                    fm.col8 = null;
                }
                else
                {
                    fm.col8 = mcol8;
                }
                if (mcol9 == "undefined")
                {
                    fm.col9 = null;
                }
                else
                {
                    fm.col9 = mcol9;
                }
                if (mcol10 == "undefined")
                {
                    fm.col10 = null;
                }
                else
                {
                    fm.col10 = mcol10;
                }
                if (mcol11 == "undefined")
                {
                    fm.col11 = null;
                }
                else
                {
                    fm.col11 = mcol11;
                }
                if (mcol12 == "undefined")
                {
                    fm.col12 = null;
                }
                else
                {
                    fm.col12 = mcol12;
                }
                if (mcol13 == "undefined")
                {
                    fm.col13 = null;
                }
                else
                {
                    fm.col13 = mcol13;
                }
                if (mcol14 == "undefined")
                {
                    fm.col14 = null;
                }
                else
                {
                    fm.col14 = mcol14;
                }
                if (mcol15 == "undefined")
                {
                    fm.col15 = null;
                }
                else
                {
                    fm.col15 = mcol15;
                }
                fm.date_time = DateTime.Now;
                Repository.FirmUsers.savecontact(fm, LoggedInUser.FirmId.ToString(), ftype, sum, ctxt1, ctxt2, ctxt3, ctxt4, ctxt5, ctxt6, ctxt7, ctxt8, ctxt9, ctxt10, ctxt11, ctxt12, ctxt13, ctxt14, ctxt15);
                var param = controllername + ">PostSaveContact>savecontact>param=" + fm.cadd1 + "@" + fm.cassign + "@" + fm.cemail + "@" + fm.cid + "@" + fm.cnotes + "@" + fm.cnumber + "@" + fm.cphoto + "@" + fm.cport + "@" + fm.ctags + "@" + fm.cwebsite + "@" + fm.date_time + "@" + fm.fax + "@" + fm.firmuser + "@" + fm.fname + "@" + fm.homeno + "@" + fm.lname + "@" + fm.Firmid + "@" + fm.mname + "@" + fm.mobno + "@" + fm.offno + "@" + LoggedInUser.FirmId + "@" + ftype;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok();
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Remove Contact
        /// </summary>
        /// <param name="typeIds"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveContact(string[] typeIds)
        {
            try
            {
                var countcontact = Repository.FirmUsers.removecontactlist(typeIds, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                var param = controllername + ">RemoveContact>removecontactlist>param=" + typeIds + "@" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(countcontact);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Get contact details data sp
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SpContactData()
        {
            try
            {
                var search = QueryAES.UrlDecode(HttpContext.Current.Request.Form["search"]);
                int pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                int pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                LawPracticeEntities db = new LawPracticeEntities();
                if (search != "")
                {
                    var cases1 = Repository.Matter.searchusercontactlist(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), pagenum, pagesize, search);
                    return Ok(cases1);
                }
                else
                {
                    var cases1 = Repository.FirmUsers.viewcontactlistbyrowid(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), pagenum, pagesize);
                    var param = controllername + ">SpContactData>viewcontactlist>param=" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString();
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                    return Ok(cases1);
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Get Single Contact Details 
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SingleContactDetails()
        {
            try
            {
                var mid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["mid"]);
                mid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(mid)).Replace(" ", "+");
                if (mid != "")
                {
                    var data = Repository.FirmUsers.singlecontactdetails(mid, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                    var param = controllername + ">SingleContactDetails>singlecontactdetails>param=" + mid + "@" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString();
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                    return Ok(data);
                }
                else
                {
                    return Ok("Opps! please After Some time.");
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Update contact
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult PosUpdateContact()
        {
            try
            {
                var db = new LawPracticeEntities();
                var fm = new AddContactsList();
                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count > 0)
                {
                    var docfiles = new List<string>();
                    string folderPath = HttpContext.Current.Server.MapPath("~/Documents/Contactdocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/");
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
                        fm.cphoto = "/Documents/Contactdocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/" + fileName1;
                    }
                }
                var ftype = Convert.ToString(Request.Headers.GetValues("ftype").FirstOrDefault());
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
                var cidd = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(QueryAES.UrlDecode(HttpContext.Current.Request.Form["mid"])));
                fm.ContactType = QueryAES.UrlDecode(HttpContext.Current.Request.Form["contacttype"]);
                fm.firmuser = LoggedInUser.UserId;
                fm.Firmid = Guid.Parse(LoggedInUser.FirmId.ToString());
                fm.cid = Guid.Parse(cidd.ToString());
                fm.cnotes = QueryAES.UrlDecode(HttpContext.Current.Request.Form["cnotes"]);
                fm.lname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["lname"]);
                fm.cid = Guid.Parse(QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(QueryAES.UrlDecode(HttpContext.Current.Request.Form["mid"]))));
                fm.fname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fname"]);
                fm.homeno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["homeno"]);
                fm.mobno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["mobno"]);
                fm.offno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["offno"]);
                fm.fax = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fax"]);
                fm.cemail = QueryAES.UrlDecode(HttpContext.Current.Request.Form["cemail"]);
                fm.cport = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["cport"]));
                fm.cadd1 = QueryAES.UrlDecode(HttpContext.Current.Request.Form["cadd1"]);
                fm.ctags = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ctags"]);
                fm.cnumber = QueryAES.UrlDecode(HttpContext.Current.Request.Form["cnumber"]);
                fm.cwebsite = QueryAES.UrlDecode(HttpContext.Current.Request.Form["cwebsite"]);
                fm.mname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["mname"]);
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
                    fm.col1 = null;
                }
                else
                {
                    fm.col1 = mcol1;
                }

                if (mcol2 == "undefined")
                {
                    fm.col2 = null;
                }
                else
                {
                    fm.col2 = mcol2;
                }

                if (mcol3 == "undefined")
                {
                    fm.col3 = null;
                }
                else
                {
                    fm.col3 = mcol3;
                }
                if (mcol4 == "undefined")
                {
                    fm.col4 = null;
                }
                else
                {
                    fm.col4 = mcol4;
                }

                if (mcol5 == "undefined")
                {
                    fm.col5 = null;
                }
                else
                {
                    fm.col5 = mcol5;
                }

                if (mcol6 == "undefined")
                {
                    fm.col6 = null;
                }
                else
                {
                    fm.col6 = mcol6;
                }
                if (mcol7 == "undefined")
                {
                    fm.col7 = null;
                }
                else
                {
                    fm.col7 = mcol7;
                }
                if (mcol8 == "undefined")
                {
                    fm.col8 = null;
                }
                else
                {
                    fm.col8 = mcol8;
                }
                if (mcol9 == "undefined")
                {
                    fm.col9 = null;
                }
                else
                {
                    fm.col9 = mcol9;
                }
                if (mcol10 == "undefined")
                {
                    fm.col10 = null;
                }
                else
                {
                    fm.col10 = mcol10;
                }
                if (mcol11 == "undefined")
                {
                    fm.col11 = null;
                }
                else
                {
                    fm.col11 = mcol11;
                }
                if (mcol12 == "undefined")
                {
                    fm.col12 = null;
                }
                else
                {
                    fm.col12 = mcol12;
                }
                if (mcol13 == "undefined")
                {
                    fm.col13 = null;
                }
                else
                {
                    fm.col13 = mcol13;
                }
                if (mcol14 == "undefined")
                {
                    fm.col14 = null;
                }
                else
                {
                    fm.col14 = mcol14;
                }
                if (mcol15 == "undefined")
                {
                    fm.col15 = null;
                }
                else
                {
                    fm.col15 = mcol15;
                }
                fm.date_time = DateTime.Now;
                Repository.FirmUsers.editcontact(fm, LoggedInUser.FirmId.ToString(), ftype, sum, ctxt1, ctxt2, ctxt3, ctxt4, ctxt5, ctxt6, ctxt7, ctxt8, ctxt9, ctxt10, ctxt11, ctxt12, ctxt13, ctxt14, ctxt15);
                var param = controllername + ">PostUpdateConatct>editcontact>param=" + fm.cadd1 + "@" + fm.cassign + "@" + fm.cemail + "@" + fm.cid + "@" + fm.cnotes + "@" + fm.cnumber + "@" + fm.cphoto + "@" + fm.cport + "@" + fm.ctags + "@" + fm.cwebsite + "@" + fm.date_time + "@" + fm.fax + "@" + fm.firmuser + "@" + fm.fname + "@" + fm.homeno + "@" + fm.lname + "@" + fm.Firmid + "@" + fm.mname + "@" + fm.mobno + "@" + fm.offno + "@" + LoggedInUser.FirmId + "@" + ftype;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok();
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Assign user
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult Assignuser([FromBody] JObject paramJObject)
        {
            try
            {
                var cmatter = Repository.FirmUsers.assignuserlist(LoggedInUser.FirmId.ToString());
                var param = controllername + ">Assignuser>assignuserlist>param=" + LoggedInUser.FirmId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");

                return Ok(cmatter);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Employee), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Get matter datails
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
                    var cases1 = Repository.FirmUsers.findmatterlistbyrowid(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), pagenum, pagesize, search);
                    return Ok(cases1);
                }
                else
                {
                    var cases1 = Repository.FirmUsers.matterlistbyrowid(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), pagenum, pagesize);
                    var param = controllername + ">SpMatterData>matterlist>param=" + LoggedInUser.FirmId.ToString();
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
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
        /// Update matter
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult PostUpdateMatter()
        {
            var myList = new List<string>();
            dynamic postedFiledata = "";
            try
            {
                var db = new LawPracticeEntities();
                AddLawMatterList ml = new AddLawMatterList();
                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count > 0)
                {
                    var docfiles = new List<string>();
                    string folderPath = HttpContext.Current.Server.MapPath("~/Documents/Matterdocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/");
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
                        docfiles.Add(filePath);
                        string input = filePath;
                        string tempflname = fileName1;
                        tempflname = tempflname.Remove(0, 10);
                        ml.cfile = tempflname;
                        myList.Add(ml.cfile);
                        string output = folderPath + Path.GetFileName(tempflname);
                        QueryAES.FileEncrypt(input, output);
                        //delete file
                        System.IO.File.Delete(input);
                    }
                }
                var filearray = myList.ToArray();
                postedFiledata = string.Join("/", filearray);
                ml.cfile = postedFiledata;
                var ftype = Convert.ToString(Request.Headers.GetValues("ftype").FirstOrDefault());
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
                var id = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(QueryAES.UrlDecode(HttpContext.Current.Request.Form["Id"])));
                ml.CaseSubject = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casesubject"]);
                ml.Id = Guid.Parse(id.ToString());
                ml.Firmid = LoggedInUser.FirmId;
                ml.firmuser = LoggedInUser.UserId;
                ml.cnrno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["cnrno"]);
                var tsol = QueryAES.UrlDecode(HttpContext.Current.Request.Form["msol"]);
                ml.mtrno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["mtrno"]);
                var odt = QueryAES.UrlDecode(HttpContext.Current.Request.Form["odate"]);
                ml.orgaty = QueryAES.UrlDecode(HttpContext.Current.Request.Form["orgaty"]);
                ml.tags = QueryAES.UrlDecode(HttpContext.Current.Request.Form["tags"]);
                var cdt = QueryAES.UrlDecode(HttpContext.Current.Request.Form["cdate"]);
                ml.mnotes = QueryAES.UrlDecode(HttpContext.Current.Request.Form["mnotes"]);
                if (tsol != "")
                {
                    ml.msol = Convert.ToDateTime(tsol);
                }
                if (odt != "")
                {
                    ml.odate = Convert.ToDateTime(odt);
                }
                if (cdt != "")
                {
                    ml.cdate = Convert.ToDateTime(cdt);
                }
                var tempassign = QueryAES.UrlDecode(HttpContext.Current.Request.Form["assignto"]);
                if (tempassign != "")
                {
                    ml.assignto = Guid.Parse(tempassign);
                }
                ml.cstatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["cstatus"]);
                ml.mname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["mname"]);
                ml.date_time = DateTime.Now;
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
                    ml.col1 = null;
                }
                else
                {
                    ml.col1 = mcol1;
                }
                if (mcol2 == "undefined")
                {
                    ml.col2 = null;
                }
                else
                {
                    ml.col2 = mcol2;
                }
                if (mcol3 == "undefined")
                {
                    ml.col3 = null;
                }
                else
                {
                    ml.col3 = mcol3;
                }
                if (mcol4 == "undefined")
                {
                    ml.col4 = null;
                }
                else
                {
                    ml.col4 = mcol4;
                }

                if (mcol5 == "undefined")
                {
                    ml.col5 = null;
                }
                else
                {
                    ml.col5 = mcol5;
                }

                if (mcol6 == "undefined")
                {
                    ml.col6 = null;
                }
                else
                {
                    ml.col6 = mcol6;
                }
                if (mcol7 == "undefined")
                {
                    ml.col7 = null;
                }
                else
                {
                    ml.col7 = mcol7;
                }
                if (mcol8 == "undefined")
                {
                    ml.col8 = null;
                }
                else
                {
                    ml.col8 = mcol8;
                }
                if (mcol9 == "undefined")
                {
                    ml.col9 = null;
                }
                else
                {
                    ml.col9 = mcol9;
                }
                if (mcol10 == "undefined")
                {
                    ml.col10 = null;
                }
                else
                {
                    ml.col10 = mcol10;
                }
                if (mcol11 == "undefined")
                {
                    ml.col11 = null;
                }
                else
                {
                    ml.col11 = mcol11;
                }
                if (mcol12 == "undefined")
                {
                    ml.col12 = null;
                }
                else
                {
                    ml.col12 = mcol12;
                }
                if (mcol13 == "undefined")
                {
                    ml.col13 = null;
                }
                else
                {
                    ml.col13 = mcol13;
                }
                if (mcol14 == "undefined")
                {
                    ml.col14 = null;
                }
                else
                {
                    ml.col14 = mcol14;
                }
                if (mcol15 == "undefined")
                {
                    ml.col15 = null;
                }
                else
                {
                    ml.col15 = mcol15;
                }
                ml.date_time = DateTime.Now;
                var datastatus = "";
                var param = controllername + ">PostUpdatematter>editmatter>param=" + ml.assignto + "@" + ml.cdate + "@" + ml.cfile + "@" + ml.cid + "@" + ml.cnrno + "@" + ml.cstatus + "@" + ml.Firmid + "@" + ml.firmuser + "@" + ml.mname + "@" + ml.matterclientid + "@" + ml.mnotes + "@" + ml.msol + "@" + ml.mtrno + "@" + ml.odate + "@" + ml.orgaty + "@" + ml.tags;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                Repository.FirmUsers.editmatter(ml, LoggedInUser.FirmId.ToString(), ftype, sum, ctxt1, ctxt2, ctxt3, ctxt4, ctxt5, ctxt6, ctxt7, ctxt8, ctxt9, ctxt10, ctxt11, ctxt12, ctxt13, ctxt14, ctxt15);
                int aff = 0;
                AddCaseObject addcase = new AddCaseObject();
                if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "" || QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == null)
                {
                    return Ok();
                }
                else
                {
                    if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() != "0")
                    {
                        string ctname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString();
                        addcase.Caseno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtno"]).ToString();
                        addcase.Casetype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drptype"]).ToString();
                        addcase.Caseyear = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpYear"]).ToString();
                        addcase.Court = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString();
                        addcase.FileNo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtFileNo"]).ToString();
                        addcase.BenchID = "";
                        addcase.SideID = "";
                        addcase.Courttitle = "";
                        addcase.Stampreg = "";
                        addcase.Matterid = Guid.Parse(id);
                        addcase.Diaryno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["txtDiaryNo"]).ToString();
                        addcase.Casedetail = QueryAES.UrlDecode(HttpContext.Current.Request.Form["casedetails"]).ToString();

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
                        else if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "NC" || QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "NL")
                        {
                            addcase.Casetype = "";
                            addcase.BenchID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpNCBench"]).ToString();
                        }
                        else if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "IT" || QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "CE")
                        {
                            addcase.BenchID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpNCBench"]).ToString();
                        }
                        else if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "TN")
                        {
                            addcase.BenchID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["divTNBench"]).ToString();
                        }
                        else if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "RH")
                        {
                            addcase.BenchID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["divRHBench"]).ToString();
                        }
                        else if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "JK")
                        {
                            addcase.BenchID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["divJKBench"]).ToString();
                        }
                        else if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "BH")
                        {
                            addcase.BenchID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["divBHBench"]).ToString();
                        }
                        else if (QueryAES.UrlDecode(HttpContext.Current.Request.Form["drpcourtname"]).ToString() == "MP")
                        {
                            addcase.BenchID = QueryAES.UrlDecode(HttpContext.Current.Request.Form["divMPBench"]).ToString();
                        }
                        addcase.Username = WebConfigurationManager.AppSettings["matteridname"] + LoggedInUser.UserId.ToString();
                    }
                    if (aff == 0)
                    {
                        datastatus = "false";
                    }
                    else
                    {
                        datastatus = "true";
                    }
                    return Ok(datastatus);
                }
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
        public IHttpActionResult RemoveMatter(string typeIds)
        {
            try
            {
                var apiUrl = ConfigurationManager.AppSettings["savetocasewatchurl"];
                var countmatter = Repository.FirmUsers.removematterlist(typeIds, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), apiUrl, "", "");
                var param = controllername + ">RemoveMatter>removematterlist>param=" + typeIds + "@" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(countmatter);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Single matter details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SingleMatterDetails()
        {
            try
            {
                var mid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["mid"]);
                mid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(mid));
                if (mid != "")
                {
                    var data = Repository.FirmUsers.singlematterdetails(mid, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                    var param = controllername + ">SingleMatterDetails>singlematterdetails>param=" + mid + "@" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString();
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                    return Ok(data);
                }
                else
                {
                    return Ok("Opps! please After Some time.");
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Save event details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult PostSaveEvent()
        {
            try
            {
                var db = new LawPracticeEntities();
                var ml = new AddEventList();
                var myList = new List<string>();
                dynamic postedFiledata = "";
                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count > 0)
                {
                    var docfiles = new List<string>();
                    string folderPath = HttpContext.Current.Server.MapPath("~/Documents/Eventdocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/");
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
                        docfiles.Add(filePath);
                        string input = filePath;
                        string tempflname = fileName1;
                        tempflname = tempflname.Remove(0, 10);
                        ml.tfile = tempflname;
                        myList.Add(ml.tfile);
                        string output = folderPath + Path.GetFileName(tempflname);
                        QueryAES.FileEncrypt(input, output);
                        //delete file
                        System.IO.File.Delete(input);
                    }
                }
                var filearray = myList.ToArray();
                postedFiledata = string.Join("/", filearray);
                ml.tfile = postedFiledata;
                ml.Firmid = LoggedInUser.FirmId;
                ml.firmuser = LoggedInUser.UserId;
                ml.tmatter = Guid.Parse(QueryAES.UrlDecode(HttpContext.Current.Request.Form["matter"]));
                ml.tsubject = QueryAES.UrlDecode(HttpContext.Current.Request.Form["subject"]);
                var sd = QueryAES.UrlDecode(HttpContext.Current.Request.Form["sd"]);
                if (sd != "")
                {
                    ml.sdate = Convert.ToDateTime(sd);
                }
                var ed = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ed"]);
                if (ed != "")
                {
                    ml.edate = Convert.ToDateTime(ed);
                }
                var st = QueryAES.UrlDecode(HttpContext.Current.Request.Form["st"]);
                if (st != "")
                {
                    ml.stime = Convert.ToDateTime(st).TimeOfDay;
                }
                var et = QueryAES.UrlDecode(HttpContext.Current.Request.Form["et"]);
                if (et != "")
                {
                    ml.etime = Convert.ToDateTime(et).TimeOfDay;
                }
                ml.eallday = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["allday"]));
                ml.ecolor = QueryAES.UrlDecode(HttpContext.Current.Request.Form["color"]);
                ml.elocation = QueryAES.UrlDecode(HttpContext.Current.Request.Form["location"]);
                ml.tdetails = QueryAES.UrlDecode(HttpContext.Current.Request.Form["details"]);
                ml.tpriority = QueryAES.UrlDecode(HttpContext.Current.Request.Form["priority"]);
                ml.tauser = Guid.Parse(QueryAES.UrlDecode(HttpContext.Current.Request.Form["user"]));
                ml.ttags = QueryAES.UrlDecode(HttpContext.Current.Request.Form["tags"]);
                ml.trepeat = QueryAES.UrlDecode(HttpContext.Current.Request.Form["repeat"]);
                ml.date_time = DateTime.Now;
                int sum = Convert.ToInt32(Request.Headers.GetValues("sum").FirstOrDefault());
                var x1 = Convert.ToString(Request.Headers.GetValues("x1").FirstOrDefault());
                var x2 = Convert.ToString(Request.Headers.GetValues("x2").FirstOrDefault());
                var x3 = Convert.ToString(Request.Headers.GetValues("x3").FirstOrDefault());
                var x4 = Convert.ToString(Request.Headers.GetValues("x4").FirstOrDefault());
                var x5 = Convert.ToString(Request.Headers.GetValues("x5").FirstOrDefault());
                var nx1 = Convert.ToString(Request.Headers.GetValues("nx1").FirstOrDefault());
                var nx2 = Convert.ToString(Request.Headers.GetValues("nx2").FirstOrDefault());
                var nx3 = Convert.ToString(Request.Headers.GetValues("nx3").FirstOrDefault());
                var nx4 = Convert.ToString(Request.Headers.GetValues("nx4").FirstOrDefault());
                var nx5 = Convert.ToString(Request.Headers.GetValues("nx5").FirstOrDefault());
                var ctxt1 = Convert.ToString(Request.Headers.GetValues("ctxt1").FirstOrDefault());
                var ctxt2 = Convert.ToString(Request.Headers.GetValues("ctxt2").FirstOrDefault());
                var ctxt3 = Convert.ToString(Request.Headers.GetValues("ctxt3").FirstOrDefault());
                var ctxt4 = Convert.ToString(Request.Headers.GetValues("ctxt4").FirstOrDefault());
                var ctxt5 = Convert.ToString(Request.Headers.GetValues("ctxt5").FirstOrDefault());
                var result = Repository.FirmUsers.saveevent(ml, sum, x1, x2, x3, x4, x5, nx1, nx2, nx3, nx4, nx5, ctxt1, ctxt2, ctxt3, ctxt4, ctxt5);
                var param = controllername + ">PostSaveEvent>saveevent>param=" + ml.Firmid + "@" + ml.firmuser + "@" + ml.tcontact + "@" + ml.tmatter + "@" + ml.tsubject + "@" + ml.tdetails + "@" + ml.sdate + "@" + ml.edate + "@" + ml.stime + "@" + ml.etime + "@" + ml.eallday + "@" + ml.ecolor + "@" + ml.elocation + "@" + ml.tpriority + "@" + ml.trepeat + "@" + ml.ttags;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(result);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
        
        /// <summary>
        /// Update event details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult PostUpdateEvent()
        {
            try
            {
                var db = new LawPracticeEntities();
                var myList = new List<string>();
                dynamic postedFiledata = "";
                var ml = new AddEventList();
                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count > 0)
                {
                    var docfiles = new List<string>();
                    string folderPath = HttpContext.Current.Server.MapPath("~/Documents/Eventdocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/");
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
                        docfiles.Add(filePath);
                        string input = filePath;
                        string tempflname = fileName1;
                        tempflname = tempflname.Remove(0, 10);
                        ml.tfile = tempflname;
                        myList.Add(ml.tfile);
                        string output = folderPath + Path.GetFileName(tempflname);
                        QueryAES.FileEncrypt(input, output);
                        //delete file
                        System.IO.File.Delete(input);
                    }
                }
                var filearray = myList.ToArray();
                postedFiledata = string.Join("/", filearray);
                ml.tfile = postedFiledata;
                ml.Firmid = LoggedInUser.FirmId;
                ml.firmuser = LoggedInUser.UserId;
                ml.tcontact = Guid.Parse(QueryAES.UrlDecode(HttpContext.Current.Request.Form["contact"]));
                ml.tmatter = Guid.Parse(QueryAES.UrlDecode(HttpContext.Current.Request.Form["matter"]));
                ml.tsubject = QueryAES.UrlDecode(HttpContext.Current.Request.Form["subject"]);
                var sd = QueryAES.UrlDecode(HttpContext.Current.Request.Form["sd"]);
                if (sd != "")
                {
                    ml.sdate = Convert.ToDateTime(sd);
                }
                var ed = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ed"]);
                if (ed != "")
                {
                    ml.edate = Convert.ToDateTime(ed);
                }
                var st = QueryAES.UrlDecode(HttpContext.Current.Request.Form["st"]);
                if (st != "")
                {
                    ml.stime = Convert.ToDateTime(st).TimeOfDay;
                }
                var et = QueryAES.UrlDecode(HttpContext.Current.Request.Form["et"]);
                if (et != "")
                {
                    ml.etime = Convert.ToDateTime(et).TimeOfDay;
                }
                ml.eallday = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["allday"]));
                ml.ecolor = QueryAES.UrlDecode(HttpContext.Current.Request.Form["color"]);
                ml.elocation = QueryAES.UrlDecode(HttpContext.Current.Request.Form["location"]);
                ml.tdetails = QueryAES.UrlDecode(HttpContext.Current.Request.Form["details"]);
                ml.Id = Guid.Parse(QueryAES.DecryptStringAES(QueryAES.UrlDecode(HttpContext.Current.Request.Form["ID"])));
                ml.tpriority = QueryAES.UrlDecode(HttpContext.Current.Request.Form["priority"]);
                ml.tauser = Guid.Parse(QueryAES.UrlDecode(HttpContext.Current.Request.Form["auser"]));
                ml.tacontact = Guid.Parse(QueryAES.UrlDecode(HttpContext.Current.Request.Form["acontact"]));
                ml.ttags = QueryAES.UrlDecode(HttpContext.Current.Request.Form["tags"]);
                ml.trepeat = QueryAES.UrlDecode(HttpContext.Current.Request.Form["repeat"]);
                ml.date_time = DateTime.Now;
                var result = Repository.FirmUsers.editevent(ml);
                var param = controllername + ">PostUpdateEvent>editevent>param=" + ml.Firmid + "@" + ml.firmuser + "@" + ml.tcontact + "@" + ml.tmatter + "@" + ml.tsubject + "@" + ml.tdetails + "@" + ml.sdate + "@" + ml.edate + "@" + ml.stime + "@" + ml.etime + "@" + ml.eallday + "@" + ml.ecolor + "@" + ml.elocation + "@" + ml.tpriority + "@" + ml.trepeat + "@" + ml.ttags;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                db1.saveuseractivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.UserId.ToString(), 1, DateTime.Now.ToString(), "editevent", ml.Id.ToString(), null, null, DateTime.Now.ToString());
                return Ok(result);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
        
        /// <summary>
        /// Load task details
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadTask([FromBody] JObject paramJObject)
        {
            try
            {
                var param = controllername + ">LoadTask>tasklist>param=" + LoggedInUser.FirmId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var task = Repository.FirmUsers.tasklist(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                return Ok(task);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        ///Load event 
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadEvent([FromBody] JObject paramJObject)
        {
            try
            {
                var param = controllername + ">LoadEvent>eventlist>param=" + LoggedInUser.FirmId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var events = Repository.FirmUsers.eventlist(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                return Ok(events);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Load note
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadNote([FromBody] JObject paramJObject)
        {
            try
            {
                var param = controllername + ">LoadNote>notelist>param=" + LoggedInUser.FirmId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");

                var note = Repository.FirmUsers.notelist(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                return Ok(note);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Load call
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadCall([FromBody] JObject paramJObject)
        {
            try
            {
                var param = controllername + ">LoadCall>calllist>param=" + LoggedInUser.FirmId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");

                var call = Repository.FirmUsers.calllist(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                return Ok(call);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Remove call
        /// </summary>
        /// <param name="typeIds"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveCall(string[] typeIds)
        {
            try
            {
                var param = controllername + ">RemoveCall>removecalllist>param=" + typeIds + "@" + LoggedInUser.FirmId;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var count = Repository.FirmUsers.removecalllist(typeIds, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                var db = new LawPracticeEntities();
                db.saveuseractivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.UserId.ToString(), 1, DateTime.Now.ToString(), "delcall", Guid.Empty.ToString(), null, null, DateTime.Now.ToString());
                return Ok(count);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Remove event
        /// </summary>
        /// <param name="typeIds"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveEvent(string[] typeIds)
        {
            try
            {
                var param = controllername + ">RemoveEvent>removeeventlist>param=" + typeIds + "@" + LoggedInUser.FirmId;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");

                var countevent = Repository.FirmUsers.removeeventlist(typeIds, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                var db = new LawPracticeEntities();
                db.saveuseractivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.UserId.ToString(), 1, DateTime.Now.ToString(), "delevent", Guid.Empty.ToString(), null, null, DateTime.Now.ToString());

                return Ok(countevent);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Remove Note
        /// </summary>
        /// <param name="typeIds"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveNote(string[] typeIds)
        {
            try
            {
                var param = controllername + ">RemoveNote>removenotelist>param=" + typeIds + "@" + LoggedInUser.FirmId;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");

                var countnote = Repository.FirmUsers.removenotelist(typeIds, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                var db = new LawPracticeEntities();
                db.saveuseractivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.UserId.ToString(), 1, DateTime.Now.ToString(), "delnote", Guid.Empty.ToString(), null, null, DateTime.Now.ToString());
                return Ok(countnote);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Remove Task
        /// </summary>
        /// <param name="typeIds"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveTask(string[] typeIds)
        {
            try
            {
                var param = controllername + ">RemoveTask>removetasklist>param=" + typeIds + "@" + LoggedInUser.FirmId;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");

                var counttask = Repository.FirmUsers.removetasklist(typeIds, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                var db = new LawPracticeEntities();
                db.saveuseractivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.UserId.ToString(), 1, DateTime.Now.ToString(), "deltask", Guid.Empty.ToString(), null, null, DateTime.Now.ToString());

                return Ok(counttask);
            }
            catch (Exception ex)
            {

                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// View single task
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SingleTask()
        {
            try
            {
                var db = new LawPracticeEntities();
                var did = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Id"]);
                did = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(did));
                if (did != null)
                {
                    var countask = Repository.FirmUsers.singletasklist(LoggedInUser.FirmId.ToString(), did.ToString(), LoggedInUser.UserId.ToString());
                    return Ok(countask);
                }
                else
                {
                    return Ok(did);
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
        
        /// <summary>
        /// View single notes
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SingleNote()
        {
            try
            {
                var db = new LawPracticeEntities();
                var did = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Id"]);
                did = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(did));
                var param = controllername + ">SingleTask>singletasklist>param=" + did + "@" + LoggedInUser.FirmId;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                if (did != null)
                {
                    var countnote = Repository.FirmUsers.singlenotelist(LoggedInUser.FirmId.ToString(), did.ToString(), LoggedInUser.UserId.ToString());
                    return Ok(countnote);
                }
                else
                {
                    return Ok(did);
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// View single call
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SingleCall()
        {
            try
            {
                var db = new LawPracticeEntities();
                var did = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Id"]);
                did = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(did));
                var param = controllername + ">SingleCall>singlecalllist>param=" + did + "@" + LoggedInUser.FirmId;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                if (did != null)
                {
                    var countcall = Repository.FirmUsers.singlecalllist(LoggedInUser.FirmId.ToString(), did.ToString(), LoggedInUser.UserId.ToString());
                    return Ok(countcall);
                }
                else
                {
                    return Ok(did);
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// View Single Event
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SingleEvent()
        {
            try
            {
                var db = new LawPracticeEntities();
                var did = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Id"]);
                did = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(did));
                var param = controllername + ">SingleEvent>singleeventlist>param=" + did + "@" + LoggedInUser.FirmId;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                if (did != null)
                {
                    var countevent = Repository.FirmUsers.singleeventlist(LoggedInUser.FirmId.ToString(), did.ToString(), LoggedInUser.UserId.ToString());
                    return Ok(countevent);
                }
                else
                {
                    return Ok(did);
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Save call
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult PostSaveCall()
        {
            try
            {
                var db = new LawPracticeEntities();
                var ml = new AddCallList();
                var myList = new List<string>();
                dynamic postedFiledata = "";
                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count > 0)
                {
                    var docfiles = new List<string>();
                    string folderPath = HttpContext.Current.Server.MapPath("~/Documents/Calldocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/");
                    if (!Directory.Exists(folderPath))
                    {
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
                        docfiles.Add(filePath);
                        string input = filePath;
                        string tempflname = fileName1;
                        tempflname = tempflname.Remove(0, 10);
                        ml.cfiles = tempflname;
                        myList.Add(ml.cfiles);
                        string output = folderPath + Path.GetFileName(tempflname);
                        QueryAES.FileEncrypt(input, output);
                        //delete file
                        System.IO.File.Delete(input);
                    }

                }
                var filearray = myList.ToArray();
                postedFiledata = string.Join("/", filearray);
                ml.cfiles = postedFiledata;
                ml.Firmid = LoggedInUser.FirmId;
                ml.firmuser = LoggedInUser.UserId;
                ml.ccontact = Guid.Parse(QueryAES.UrlDecode(HttpContext.Current.Request.Form["contact"]));
                ml.cmatter = Guid.Parse(QueryAES.UrlDecode(HttpContext.Current.Request.Form["matter"]));
                ml.csubject = QueryAES.UrlDecode(HttpContext.Current.Request.Form["subject"]);
                ml.ctags = QueryAES.UrlDecode(HttpContext.Current.Request.Form["tags"]);
                ml.ctype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["calltype"]);
                var tdate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dt"]);
                if (tdate != "")
                {
                    ml.cdatetime = Convert.ToDateTime(tdate);
                }
                ml.cdura = QueryAES.UrlDecode(HttpContext.Current.Request.Form["duration"]);
                ml.cdetails = QueryAES.UrlDecode(HttpContext.Current.Request.Form["details"]);
                ml.cpuser = QueryAES.UrlDecode(HttpContext.Current.Request.Form["puser"]);
                ml.cpcontact = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pcontact"]);
                ml.date_time = DateTime.Now;
                var result = Repository.FirmUsers.savecall(ml);
                var param = controllername + ">PostSaveCall>savecall>param=" + ml.Firmid + "@" + ml.firmuser + "@" + ml.ccontact + "@" + ml.cmatter + "@" + ml.csubject + "@" + ml.ctags + "@" + ml.ctype + "@" + ml.cdura + "@" + ml.cdetails + "@" + ml.cpuser + "@" + ml.cpcontact;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Lead), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Lead), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(result);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Update call
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult PostUpdateCall()
        {
            try
            {
                var db = new LawPracticeEntities();
                var ml = new AddCallList();
                var myList = new List<string>();
                dynamic postedFiledata = "";
                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count > 0)
                {
                    var docfiles = new List<string>();
                    string folderPath = HttpContext.Current.Server.MapPath("~/Documents/Calldocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/");
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
                        docfiles.Add(filePath);
                        string input = filePath;
                        string tempflname = fileName1;
                        tempflname = tempflname.Remove(0, 10);
                        ml.cfiles = tempflname;
                        myList.Add(ml.cfiles);
                        string output = folderPath + Path.GetFileName(tempflname);
                        QueryAES.FileEncrypt(input, output);
                        //delete file
                        System.IO.File.Delete(input);
                    }
                }
                var filearray = myList.ToArray();
                postedFiledata = string.Join("/", filearray);
                ml.cfiles = postedFiledata;
                ml.Firmid = LoggedInUser.FirmId;
                ml.firmuser = LoggedInUser.UserId;
                ml.ccontact = Guid.Parse(QueryAES.UrlDecode(HttpContext.Current.Request.Form["contact"]));
                ml.cmatter = Guid.Parse(QueryAES.UrlDecode(HttpContext.Current.Request.Form["matter"]));
                ml.csubject = QueryAES.UrlDecode(HttpContext.Current.Request.Form["subject"]);
                ml.ctags = QueryAES.UrlDecode(HttpContext.Current.Request.Form["tags"]);
                ml.cpuser = QueryAES.UrlDecode(HttpContext.Current.Request.Form["puser"]);
                ml.cpcontact = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pcontact"]);
                ml.ctype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["calltype"]);
                ml.Id = Guid.Parse(QueryAES.DecryptStringAES(QueryAES.UrlDecode(HttpContext.Current.Request.Form["ID"])));
                var tdate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dt"]);
                if (tdate != "")
                {
                    ml.cdatetime = Convert.ToDateTime(tdate);
                }
                ml.cdura = QueryAES.UrlDecode(HttpContext.Current.Request.Form["duration"]);
                ml.cdetails = QueryAES.UrlDecode(HttpContext.Current.Request.Form["details"]);
                ml.date_time = DateTime.Now;
                var result = Repository.FirmUsers.editcall(ml);
                var param = controllername + ">PostUpdateCall>editcall>param=" + ml.Firmid + "@" + ml.firmuser + "@" + ml.ccontact + "@" + ml.cmatter + "@" + ml.csubject + "@" + ml.ctags + "@" + ml.ctype + "@" + ml.cdura + "@" + ml.cdetails + "@" + ml.cpuser + "@" + ml.cpcontact;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Lead), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Lead), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                db1.saveuseractivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.UserId.ToString(), 1, DateTime.Now.ToString(), "editcall", ml.Id.ToString(), null, null, DateTime.Now.ToString());
                return Ok(result);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Save note
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult PostSaveNote()
        {
            try
            {
                var db = new LawPracticeEntities();
                var myList = new List<string>();
                dynamic postedFiledata = "";
                var ml = new AddNoteList();
                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count > 0)
                {
                    var docfiles = new List<string>();
                    string folderPath = HttpContext.Current.Server.MapPath("~/Documents/Notedocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/");
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
                        docfiles.Add(filePath);
                        string input = filePath;
                        string tempflname = fileName1;
                        tempflname = tempflname.Remove(0, 10);
                        ml.nfiles = tempflname;
                        myList.Add(ml.nfiles);
                        string output = folderPath + Path.GetFileName(tempflname);
                        QueryAES.FileEncrypt(input, output);
                        //delete file
                        System.IO.File.Delete(input);
                    }
                }
                var filearray = myList.ToArray();
                postedFiledata = string.Join("/", filearray);
                ml.nfiles = postedFiledata;
                ml.Firmid = LoggedInUser.FirmId;
                ml.firmuser = LoggedInUser.UserId;
                ml.ncontact = Guid.Parse(QueryAES.UrlDecode(HttpContext.Current.Request.Form["contact"]));
                ml.nmatter = Guid.Parse(QueryAES.UrlDecode(HttpContext.Current.Request.Form["matter"]));
                ml.nsubject = QueryAES.UrlDecode(HttpContext.Current.Request.Form["subject"]);
                ml.ntags = QueryAES.UrlDecode(HttpContext.Current.Request.Form["tags"]);
                var tdate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dt"]);
                if (tdate != "")
                {
                    ml.ndatetime = Convert.ToDateTime(tdate);
                }
                ml.nnote = QueryAES.UrlDecode(HttpContext.Current.Request.Form["details"]);
                ml.date_time = DateTime.Now;
                var result = Repository.FirmUsers.savenote(ml);
                var param = controllername + ">PostSaveNote>savenote>param=" + ml.Firmid + "@" + ml.firmuser + "@" + ml.ncontact + "@" + ml.nmatter + "@" + ml.nsubject + "@" + ml.ntags + "@" + tdate + "@" + ml.nnote;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(result);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Update note
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult PostUpdateNote()
        {
            try
            {
                var db = new LawPracticeEntities();
                var myList = new List<string>();
                dynamic postedFiledata = "";
                var ml = new AddNoteList();
                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count > 0)
                {
                    var docfiles = new List<string>();
                    string folderPath = HttpContext.Current.Server.MapPath("~/Documents/Notedocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/");
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
                        docfiles.Add(filePath);
                        string input = filePath;
                        string tempflname = fileName1;
                        tempflname = tempflname.Remove(0, 10);
                        ml.nfiles = tempflname;
                        myList.Add(ml.nfiles);
                        string output = folderPath + Path.GetFileName(tempflname);
                        QueryAES.FileEncrypt(input, output);
                        //delete file
                        System.IO.File.Delete(input);
                    }
                }
                var filearray = myList.ToArray();
                postedFiledata = string.Join("/", filearray);
                ml.nfiles = postedFiledata;
                ml.Firmid = LoggedInUser.FirmId;
                ml.firmuser = LoggedInUser.UserId;
                ml.ncontact = Guid.Parse(QueryAES.UrlDecode(HttpContext.Current.Request.Form["contact"]));
                ml.nmatter = Guid.Parse(QueryAES.UrlDecode(HttpContext.Current.Request.Form["matter"]));
                ml.nsubject = QueryAES.UrlDecode(HttpContext.Current.Request.Form["subject"]);
                ml.ntags = QueryAES.UrlDecode(HttpContext.Current.Request.Form["tags"]);
                ml.Id = Guid.Parse(QueryAES.DecryptStringAES(QueryAES.UrlDecode(HttpContext.Current.Request.Form["ID"])));
                var tdate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dt"]);
                if (tdate != "")
                {
                    ml.ndatetime = Convert.ToDateTime(tdate);
                }
                ml.nnote = QueryAES.UrlDecode(HttpContext.Current.Request.Form["details"]);
                ml.date_time = DateTime.Now;
                var result = Repository.FirmUsers.editnote(ml);
                var param = controllername + ">PostUpdateNote>editnote>param=" + ml.Firmid + "@" + ml.firmuser + "@" + ml.ncontact + "@" + ml.nmatter + "@" + ml.nsubject + "@" + ml.ntags + "@" + tdate + "@" + ml.nnote;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                db1.saveuseractivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.UserId.ToString(), 1, DateTime.Now.ToString(), "editnote", ml.Id.ToString(), null, null, DateTime.Now.ToString());
                return Ok(result);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Save task
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult PostSaveTask()
        {
            try
            {
                var db = new LawPracticeEntities();
                var myList = new List<string>();
                dynamic postedFiledata = "";
                var ml = new AddTaskList();
                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count > 0)
                {
                    var docfiles = new List<string>();
                    string folderPath = HttpContext.Current.Server.MapPath("~/Documents/Taskdocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/");
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
                        docfiles.Add(filePath);
                        string input = filePath;
                        string tempflname = fileName1;
                        tempflname = tempflname.Remove(0, 10);
                        ml.tfile = tempflname;
                        myList.Add(ml.tfile);
                        string output = folderPath + Path.GetFileName(tempflname);
                        QueryAES.FileEncrypt(input, output);
                        //delete file
                        System.IO.File.Delete(input);
                    }
                }
                var filearray = myList.ToArray();
                postedFiledata = string.Join("/", filearray);
                ml.tfile = postedFiledata;
                ml.eallday = 1;
                ml.Firmid = LoggedInUser.FirmId;
                ml.firmuser = LoggedInUser.UserId;
                ml.tcontact = Guid.Parse(QueryAES.UrlDecode(HttpContext.Current.Request.Form["contact"]));
                ml.tmatter = Guid.Parse(QueryAES.UrlDecode(HttpContext.Current.Request.Form["matter"]));
                ml.tsubject = QueryAES.UrlDecode(HttpContext.Current.Request.Form["subject"]);
                ml.tstatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["status"]);
                ml.tdetails = QueryAES.UrlDecode(HttpContext.Current.Request.Form["details"]);
                ml.tpriority = QueryAES.UrlDecode(HttpContext.Current.Request.Form["priority"]);
                ml.tauser = Guid.Parse(QueryAES.UrlDecode(HttpContext.Current.Request.Form["user"]));
                ml.tacontact = Guid.Parse(QueryAES.UrlDecode(HttpContext.Current.Request.Form["acontact"]));
                ml.ttags = QueryAES.UrlDecode(HttpContext.Current.Request.Form["tags"]);
                ml.teassign = Guid.Parse(QueryAES.UrlDecode(HttpContext.Current.Request.Form["assign"]));
                ml.trepeat = QueryAES.UrlDecode(HttpContext.Current.Request.Form["repeat"]);
                var tdate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dt"]);
                if (tdate != "")
                {
                    ml.duedate = Convert.ToDateTime(tdate);
                }

                ml.date_time = DateTime.Now;
                int sum = Convert.ToInt32(Request.Headers.GetValues("sum").FirstOrDefault());
                var x1 = Convert.ToString(Request.Headers.GetValues("x1").FirstOrDefault());
                var x2 = Convert.ToString(Request.Headers.GetValues("x2").FirstOrDefault());
                var x3 = Convert.ToString(Request.Headers.GetValues("x3").FirstOrDefault());
                var x4 = Convert.ToString(Request.Headers.GetValues("x4").FirstOrDefault());
                var x5 = Convert.ToString(Request.Headers.GetValues("x5").FirstOrDefault());
                var nx1 = Convert.ToString(Request.Headers.GetValues("nx1").FirstOrDefault());
                var nx2 = Convert.ToString(Request.Headers.GetValues("nx2").FirstOrDefault());
                var nx3 = Convert.ToString(Request.Headers.GetValues("nx3").FirstOrDefault());
                var nx4 = Convert.ToString(Request.Headers.GetValues("nx4").FirstOrDefault());
                var nx5 = Convert.ToString(Request.Headers.GetValues("nx5").FirstOrDefault());
                var ctxt1 = Convert.ToString(Request.Headers.GetValues("ctxt1").FirstOrDefault());
                var ctxt2 = Convert.ToString(Request.Headers.GetValues("ctxt2").FirstOrDefault());
                var ctxt3 = Convert.ToString(Request.Headers.GetValues("ctxt3").FirstOrDefault());
                var ctxt4 = Convert.ToString(Request.Headers.GetValues("ctxt4").FirstOrDefault());
                var ctxt5 = Convert.ToString(Request.Headers.GetValues("ctxt5").FirstOrDefault());
                var result = Repository.FirmUsers.savetask(ml, sum, x1, x2, x3, x4, x5, nx1, nx2, nx3, nx4, nx5, ctxt1, ctxt2, ctxt3, ctxt4, ctxt5);
                var param = controllername + ">PostSaveTask>savetask>param=" + ml.eallday + "@" + ml.Firmid + "@" + ml.firmuser + "@" + ml.tcontact + "@" + ml.tmatter + "@" + ml.tstatus + "@" + ml.tsubject + "@" + ml.tdetails + "@" + ml.tauser + "@" + ml.tacontact + "@" + ml.ttags + "@" + ml.teassign + "@" + ml.trepeat;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(result);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Update task
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult PostUpdateTask()
        {
            try
            {
                var db = new LawPracticeEntities();
                var ml = new AddTaskList();
                var myList = new List<string>();
                dynamic postedFiledata = "";
                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count > 0)
                {
                    var docfiles = new List<string>();
                    string folderPath = HttpContext.Current.Server.MapPath("~/Documents/Taskdocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/");
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
                        //fileName = fileName.Replace(" ", string.Empty);
                        var fileName1 = "_E2bdADS__" + fileName + randomno() + fileext;
                        var filePath = folderPath + Path.GetFileName(fileName1); //HttpContext.Current.Server.MapPath(+ postedFile.FileName);
                        var fileextchk = Path.GetExtension(postedFile.FileName);
                        var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);
                        postedFile.SaveAs(filePath);
                        docfiles.Add(filePath);
                        string input = filePath;
                        string tempflname = fileName1;
                        tempflname = tempflname.Remove(0, 10);
                        ml.tfile = tempflname;
                        myList.Add(ml.tfile);
                        string output = folderPath + Path.GetFileName(tempflname);
                        QueryAES.FileEncrypt(input, output);
                        //delete file
                        System.IO.File.Delete(input);
                    }
                }
                var filearray = myList.ToArray();
                postedFiledata = string.Join("/", filearray);
                ml.tfile = postedFiledata;
                ml.eallday = 1;
                ml.Firmid = LoggedInUser.FirmId;
                ml.firmuser = LoggedInUser.UserId;
                ml.tcontact = Guid.Parse(QueryAES.UrlDecode(HttpContext.Current.Request.Form["contact"].ToString()));
                ml.tmatter = Guid.Parse(QueryAES.UrlDecode(HttpContext.Current.Request.Form["matter"]));
                ml.tsubject = QueryAES.UrlDecode(HttpContext.Current.Request.Form["subject"]);
                ml.tstatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["status"]);
                ml.tdetails = QueryAES.UrlDecode(HttpContext.Current.Request.Form["details"]);
                ml.tpriority = QueryAES.UrlDecode(HttpContext.Current.Request.Form["priority"]);
                ml.tauser = Guid.Parse(QueryAES.UrlDecode(HttpContext.Current.Request.Form["user"]));
                ml.tacontact = Guid.Parse(QueryAES.UrlDecode(HttpContext.Current.Request.Form["acontact"]));
                ml.Id = Guid.Parse(QueryAES.DecryptStringAES(QueryAES.UrlDecode(HttpContext.Current.Request.Form["ID"])));
                ml.ttags = QueryAES.UrlDecode(HttpContext.Current.Request.Form["tags"]);
                ml.teassign = Guid.Parse((QueryAES.UrlDecode(HttpContext.Current.Request.Form["assign"])));
                ml.trepeat = QueryAES.UrlDecode(HttpContext.Current.Request.Form["repeat"]);
                var tdate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dt"]);
                if (tdate != "")
                {
                    ml.duedate = Convert.ToDateTime(tdate);
                }
                ml.date_time = DateTime.Now;
                var result = Repository.FirmUsers.edittask(ml);
                var param = controllername + ">PostUpdateTask>edittask>param=" + ml.eallday + "@" + ml.Firmid + "@" + ml.firmuser + "@" + ml.tcontact + "@" + ml.tmatter + "@" + ml.tstatus + "@" + ml.tsubject + "@" + ml.tdetails + "@" + ml.tauser + "@" + ml.tacontact + "@" + ml.ttags + "@" + ml.teassign + "@" + ml.trepeat;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                db1.saveuseractivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.UserId.ToString(), 1, DateTime.Now.ToString(), "edittask", ml.Id.ToString(), null, null, DateTime.Now.ToString());
                return Ok(result);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Remove single task
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveSingleTask()
        {
            try
            {
                var typeId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Id"]);
                typeId = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(typeId));
                var param = controllername + ">RemoveSingleTask>removesingletasklist>param=" + typeId + "@" + LoggedInUser.FirmId;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var counttask = Repository.FirmUsers.removesingletasklist(typeId, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                return Ok(counttask);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Remove single event
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveSingleEvent()
        {
            try
            {
                var typeId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Id"]);
                typeId = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(typeId));
                var param = controllername + ">RemoveSingleEvent>removesingleeventlist>param=" + typeId + "@" + LoggedInUser.FirmId;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");

                var countevent = Repository.FirmUsers.removesingleeventlist(typeId, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                return Ok(countevent);
            }
            catch (Exception ex)
            {

                db1.usp_AddAudit(Convert.ToInt32(EventType.Activites), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Activites), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Save timer
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult PostSaveTimer()
        {
            try
            {
                var db = new LawPracticeEntities();
                var ml = new TimerList();
                ml.Firmid = LoggedInUser.FirmId;
                ml.userid = LoggedInUser.UserId;
                var tcontact = QueryAES.UrlDecode(HttpContext.Current.Request.Form["contact"]);
                try
                {
                    tcontact = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(tcontact));
                }
                catch (Exception er)
                {
                }
                ml.tcontact = Guid.Parse((tcontact));
                ml.tmatter = Guid.Parse((QueryAES.UrlDecode(HttpContext.Current.Request.Form["matter"])));
                ml.titem = QueryAES.UrlDecode(HttpContext.Current.Request.Form["item"].ToString());
                ml.callDura = QueryAES.UrlDecode(HttpContext.Current.Request.Form["duration"]);
                ml.tdetails = QueryAES.UrlDecode(HttpContext.Current.Request.Form["details"]);
                var tdate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dt"]);
                if (tdate != "")
                {
                    ml.tdate = Convert.ToDateTime(tdate);
                }
                ml.tbill = bool.Parse(QueryAES.UrlDecode(HttpContext.Current.Request.Form["billable"].ToString()));
                dynamic bby = QueryAES.UrlDecode(HttpContext.Current.Request.Form["billby"]);
                if (bby != "")
                {
                    ml.tbillby = Guid.Parse(QueryAES.UrlDecode(HttpContext.Current.Request.Form["billby"]));
                }
                dynamic hrate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["hrate"]);
                if (hrate != "")
                {
                    ml.hrrate = Convert.ToInt64(QueryAES.UrlDecode(HttpContext.Current.Request.Form["hrate"]));
                }
                dynamic ttotal = QueryAES.UrlDecode(HttpContext.Current.Request.Form["total"]);

                if (ttotal != "")
                {
                    ml.total = Convert.ToInt64(QueryAES.UrlDecode(HttpContext.Current.Request.Form["total"]));
                }
                ml.tprivnotes = QueryAES.UrlDecode(HttpContext.Current.Request.Form["prevnotes"]);
                ml.date_time = DateTime.Now;
                var result = Repository.FirmUsers.savetimer(ml);
                var param = controllername + ">PostSaveTimer>savetimer>param=" + ml.Firmid + "@" + ml.userid + "@" + ml.tprivnotes + "@" + ml.total + "@" + ml.tmatter + "@" + ml.titem + "@" + ml.tdetails + "@" + ml.tdate + "@" + ml.tcontact + "@" + ml.tbillby + "@" + ml.tbill + "@" + ml.stime + "@" + ml.hrrate + "@" + ml.etime;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Timer), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Timer), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(result);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Timer), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Timer), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Load Timer Data
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadTimerData([FromBody] JObject paramJObject)
        {
            try
            {
                var call = Repository.FirmUsers.timerlist(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                var param = controllername + ">LoadTimerData>timerlist>param=" + LoggedInUser.FirmId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.Timer), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Timer), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");

                return Ok(call);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Timer), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Timer), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Load Timer Data by rowid
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadTimerDatabyrowid()
        {
            try
            {
                var search = QueryAES.UrlDecode(HttpContext.Current.Request.Form["search"]);
                int pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                int pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                LawPracticeEntities db = new LawPracticeEntities();
                if (search != "")
                {
                    var cases1 = Repository.FirmUsers.timerlistsearchbyrowid(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), pagenum, pagesize, search);
                    return Ok(cases1);
                }
                else
                {
                    var call = Repository.FirmUsers.timerlistbyrowid(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), pagenum, pagesize);
                    var param = controllername + ">LoadTimerDatabyrowid>timerlistbyrowid>param=" + LoggedInUser.FirmId.ToString();
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Timer), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Timer), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                    return Ok(call);
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Timer), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Timer), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Load Country Data
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [System.Web.Mvc.HttpGet]
        public IHttpActionResult BindCountryDetails([FromBody] JObject paramJObject)
        {
            var db = new LawPracticeEntities();
            try
            {
                var countryDetail = db.usp_GetCountry_api().ToList();
                return Ok(countryDetail);
            }
            catch (ApplicationException ex)
            {
                throw new HttpResponseException(new HttpResponseMessage { StatusCode = HttpStatusCode.BadRequest, ReasonPhrase = ex.Message });
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Load state details based on country
        /// </summary>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult BindStateDetails()
        {
            string CountryName = Request.Headers.GetValues("CountryName").FirstOrDefault();
            var db = new LawPracticeEntities();

            List<State> stateDetail = new List<State>();
            try
            {
                stateDetail = db.States.Where(x => x.CountryName == CountryName).OrderBy(x => new { x.StateName }).ToList();
            }
            catch (ApplicationException ex)
            {
                throw new HttpResponseException(new HttpResponseMessage { StatusCode = HttpStatusCode.BadRequest, ReasonPhrase = ex.Message });
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(new HttpResponseMessage { StatusCode = HttpStatusCode.BadGateway, ReasonPhrase = ex.Message });
            }
            return Ok(stateDetail);
        }

        /// <summary>
        /// Load City Data
        /// </summary>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult BindCityDetails()
        {
            string StateName = Request.Headers.GetValues("StateName").FirstOrDefault();
            var db = new LawPracticeEntities();
            List<City> cityDetail = new List<City>();
            try
            {
                cityDetail = db.Cities.Where(x => x.StateName == StateName).ToList();
            }
            catch (ApplicationException ex)
            {
                throw new HttpResponseException(new HttpResponseMessage { StatusCode = HttpStatusCode.BadRequest, ReasonPhrase = ex.Message });
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(new HttpResponseMessage { StatusCode = HttpStatusCode.BadGateway, ReasonPhrase = ex.Message });
            }
            return Ok(cityDetail);
        }

        /// <summary>
        /// Remove Profile picture
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveProfilepic()
        {
            try
            {
                RegUser obj = new RegUser();
                var db = new LawPracticeEntities();
                var httpRequest = HttpContext.Current.Request;
                var id = QueryAES.UrlDecode(HttpContext.Current.Request.Form["id"]);
                try
                {
                    obj.Id = Guid.Parse(QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(id)));
                }
                catch (Exception er)
                {
                    obj.Id = Guid.Parse(id);
                }
                int chksuccess = db.usp_UpdateUserProfilePhoto_api(obj.Id, null, 1);
                var param = controllername + ">RemoveProfilepic>param=" + obj.Id;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Employee), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(chksuccess);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Employee), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Remove Contact picture
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveContactpic()
        {
            try
            {
                RegUser obj = new RegUser();
                var db = new LawPracticeEntities();
                var httpRequest = HttpContext.Current.Request;
                obj.Id = Guid.Parse(QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(QueryAES.UrlDecode(HttpContext.Current.Request.Form["id"]))));
                var straff = db.AddContactsLists.FirstOrDefault(x => x.cid == obj.Id);
                if (!string.IsNullOrEmpty(straff.cphoto))
                {
                    straff.cphoto = null;
                    straff.iupdate = 1;
                    db.SaveChanges();
                    var param = controllername + ">RemoveContactpic>param=" + obj.Id;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Employee), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                    return Ok(straff);
                }
                else
                {
                    return Ok();
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Employee), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Case User Detail
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CaseUserDetail()
        {
            try
            {
                string loginid = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["loginid"]));
                try
                {
                    loginid = loginid.Replace(" ", "+");
                    loginid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(loginid));
                }
                catch
                {
                }
                var call = Repository.FirmUsers.ClientDetail(loginid, LoggedInUser.FirmId.ToString());
                var param = controllername + ">UserDetail>ClientDetail>param=" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Employee), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(call);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Employee), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Compnay Case Name Details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CompnayCaseNameDetails()
        {
            try
            {
                string loginid = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["loginid"]));
                try
                {
                    loginid = loginid.Replace(" ", "+");
                    loginid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(loginid));
                }
                catch
                {
                }
                var db = new LawPracticeEntities();
                var list = db.usp_ClientNameForCompanyClient(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), loginid.ToString()).ToList();
                var a = JsonConvert.SerializeObject(list);
                var param = controllername + ">UserDetail>ClientDetail>param=" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Employee), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(a);
            }
            catch (Exception ex)
            {
                db1.usp_AddAudit(Convert.ToInt32(EventType.Employee), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Employee), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
    }
}