using BussinessLogic;
using DataAccess.Modals;
using LawPracticeFirm.Common;
using Newtonsoft.Json.Linq;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http;
using static LawPracticeFirm.Models.AuditData;
using CustomField = BussinessLogic.BusinessEntity.CustomField;

namespace LawPracticeFirm.API
{

    public class DemoController : BaseFirmApiController
    {
        private LawPracticeEntities db1 = new LawPracticeEntities();
        public string controllername = "DemoController";

        /// <summary>
        /// Remove Contact details
        /// </summary>
        /// <param name="typeIds"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveContact(string[] typeIds)
        {
            try
            {
                var countcontact = Repository.Matter.removecontactlist(typeIds, LoggedInUser.FirmId.ToString());
                var param = controllername + ">RemoveContact>removecontactlist>param=" + typeIds + "@" + LoggedInUser.FirmId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                db1.saveuseractivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.UserId.ToString(), 1, DateTime.Now.ToString(), "delcontact", Guid.Empty.ToString(), null, null, DateTime.Now.ToString());
                return Ok(countcontact);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Add Contact to Favourite
        /// </summary>
        /// <param name="typeIds"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult FavContact(string[] typeIds)
        {
            try
            {
                var countcontact = Repository.Matter.Addtofavcontactlist(typeIds, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Convert.ToInt32(LoggedInUser.RoleId));
                var db = new LawPracticeEntities();
                db.saveuseractivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.UserId.ToString(), 1, DateTime.Now.ToString(), "confav", Guid.Empty.ToString(), null, null, DateTime.Now.ToString());
                var param = controllername + ">FavContact>removecontactlist>param=" + typeIds + "@" + LoggedInUser.FirmId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(countcontact);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Remve Contact to Favourite
        /// </summary>
        /// <param name="typeIds"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveFavContact(string[] typeIds)
        {
            try
            {
                var countcontact = Repository.Matter.Removetofavcontactlist(typeIds, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Convert.ToInt32(LoggedInUser.RoleId));
                var db = new LawPracticeEntities();
                db.saveuseractivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.UserId.ToString(), 1, DateTime.Now.ToString(), "conunfav", Guid.Empty.ToString(), null, null, DateTime.Now.ToString());
                var param = controllername + ">RemoveFavContact>Addtofavcontactlist>param=" + typeIds + "@" + LoggedInUser.FirmId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(countcontact);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Generate random string
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
        /// Custom Fields
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization(AdminUser = true)]
        [System.Web.Mvc.HttpPost]
        public List<CustomField> CustomFields([FromBody] JObject paramJObject)
        {
            try
            {
                var r = Repository.Configuration.CustomFieldList();
                var param = controllername + ">CustomFields>CustomFieldList>param=";
                db1.usp_AddAudit(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return r;
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                throw ex;
            }
        }

        /// <summary>
        /// Save Firm Custom Fields
        /// </summary>
        /// <param name="fm"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        public IHttpActionResult PostSaveFirmCustomFields(FirmConfiguredCustomField fm)
        {
            try
            {
                Repository.Matter.savefirmcustom(fm, LoggedInUser.FirmId.ToString());
                var param = controllername + ">PostSaveFirmCustomFields>savefirmcustom>param=" + fm + "@" + LoggedInUser.FirmId;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok();
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Save Firm Custom Fields other
        /// </summary>
        /// <param name="fm"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        public IHttpActionResult PostSaveFirmCustomFieldsother(FirmConfiguredCustomField fm)
        {
            try
            {
                Repository.Matter.savefirmcustomother(fm, LoggedInUser.FirmId.ToString());
                var param = controllername + ">PostSaveFirmCustomFields>savefirmcustom>param=" + fm + "@" + LoggedInUser.FirmId;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok();
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Firm Employees create1
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult FirmEmployeescreate1([FromBody] JObject paramJObject)
        {
            try
            {
                var headers = Request.Headers;
                var configurationtype = Convert.ToString(headers.GetValues("configurationtype").First());
                long rty = Convert.ToInt32(configurationtype);
                var data = Repository.Matter.FirmEmployeescreate1(LoggedInUser.FirmId.ToString(), rty.ToString());
                var param = controllername + ">FirmEmployeescreate1>FirmEmployeescreate1>param=" + rty + "@" + LoggedInUser.FirmId;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(data);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }

        }

        /// <summary>
        /// Get dynamic fields
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult FirmEmployees1([FromBody] JObject paramJObject)
        {
            try
            {
                var headers = Request.Headers;
                var configurationtype = Convert.ToString(headers.GetValues("configurationtype").First());
                long rty = Convert.ToInt32(configurationtype);
                var data = Repository.Matter.FirmEmployees1(LoggedInUser.FirmId.ToString(), rty.ToString());
                var param = controllername + ">FirmEmployees1>FirmEmployees1>param=" + rty + "@" + LoggedInUser.FirmId;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(data);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }

        }

        /// <summary>
        /// Custom cases
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CustomCases([FromBody] JObject paramJObject)
        {
            try
            {
                var db = new LawPracticeEntities();
                var cases = db.CaseTypes.ToList();
                return Ok(cases);
            }
            catch (Exception ex)
            {

                db1.usp_AddAuditError(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Get custom field count
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CustomFieldCount()
        {
            try
            {
                var headers = Request.Headers;
                var configurationtype = Convert.ToString(headers.GetValues("configurationtype").First());
                long ctype = Convert.ToInt32(configurationtype);
                var data = Repository.Matter.customfieldcount(LoggedInUser.FirmId.ToString(), ctype.ToString());
                return Ok(data);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.CustomField), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.CustomField), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Save contact
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
                var tempassign = "";
                string chkassign = QueryAES.UrlDecode(HttpContext.Current.Request.Form["cassign"]);
                if (String.IsNullOrEmpty(chkassign))
                {
                    tempassign = LoggedInUser.UserId.ToString();
                }
                else
                {
                    tempassign = chkassign;
                }
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
                Repository.Matter.savecontact(fm, tempassign, LoggedInUser.FirmId.ToString(), ftype, sum, ctxt1, ctxt2, ctxt3, ctxt4, ctxt5, ctxt6, ctxt7, ctxt8, ctxt9, ctxt10, ctxt11, ctxt12, ctxt13, ctxt14, ctxt15);
                var param = controllername + ">PostSaveContact>savecontact>param=" + fm.cadd1 + "@" + fm.cassign + "@" + fm.cemail + "@" + fm.cid + "@" + fm.cnotes + "@" + fm.cnumber + "@" + fm.cphoto + "@" + fm.cport + "@" + fm.ctags + "@" + fm.cwebsite + "@" + fm.date_time + "@" + fm.fax + "@" + fm.firmuser + "@" + fm.fname + "@" + fm.homeno + "@" + fm.lname + "@" + fm.Firmid + "@" + fm.mname + "@" + fm.mobno + "@" + fm.offno + "@" + LoggedInUser.FirmId + "@" + ftype;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok();
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.CustomField), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.CustomField), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
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
                fm.ContactType = QueryAES.UrlDecode(HttpContext.Current.Request.Form["contacttype"]);
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
                var tempassign = "";
                var chkassign = QueryAES.UrlDecode(HttpContext.Current.Request.Form["cassign"]);
                if (String.IsNullOrEmpty(chkassign))
                {
                    tempassign = "";
                }
                else
                {
                    tempassign = chkassign;
                }
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
                Repository.Matter.editcontact(fm, tempassign, LoggedInUser.FirmId.ToString(), ftype, sum, ctxt1, ctxt2, ctxt3, ctxt4, ctxt5, ctxt6, ctxt7, ctxt8, ctxt9, ctxt10, ctxt11, ctxt12, ctxt13, ctxt14, ctxt15);
                var param = controllername + ">PostUpdateContact>editcontact>param=" + fm.cadd1 + "@" + fm.cassign + "@" + fm.cemail + "@" + fm.cid + "@" + fm.cnotes + "@" + fm.cnumber + "@" + fm.cphoto + "@" + fm.cport + "@" + fm.ctags + "@" + fm.cwebsite + "@" + fm.date_time + "@" + fm.fax + "@" + fm.firmuser + "@" + fm.fname + "@" + fm.homeno + "@" + fm.lname + "@" + fm.Firmid + "@" + fm.mname + "@" + fm.mobno + "@" + fm.offno + "@" + LoggedInUser.FirmId + "@" + ftype;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok();
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Publish Page
        /// </summary>
        /// <param name="fm"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult PublishPage(FirmConfiguredCustomField fm)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var ftype = Request.Headers.GetValues("configurationtype").FirstOrDefault();
                var ctype = Convert.ToInt32(ftype);
                Repository.Matter.publish(LoggedInUser.FirmId.ToString(), ctype);
                var param = controllername + ">PublishPage>publish>param=" + LoggedInUser.FirmId + "@" + ctype;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok();
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
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
                var param = controllername + ">ResetCF>>param=";
                db1.usp_AddAudit(Convert.ToInt32(EventType.CustomField), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.CustomField), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok();
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Getcontactdetails data sp
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
                    var cases1 = Repository.Matter.searchcontactlist(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), pagenum, pagesize, search);
                    return Ok(cases1);
                }
                else
                {
                    var cases1 = Repository.Matter.viewcontactlist(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), pagenum, pagesize);
                    var param = controllername + ">SpContactData>viewcontactlist>param=" + LoggedInUser.FirmId;
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
        /// Getcontactdetails data sp
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SpFavContactData()
        {
            try
            {
                var search = QueryAES.UrlDecode(HttpContext.Current.Request.Form["search"]);
                int pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                int pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                LawPracticeEntities db = new LawPracticeEntities();
                if (search != "")
                {
                    var cases1 = Repository.Matter.searchfavcontactlist(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), pagenum, pagesize, search, Convert.ToInt32(LoggedInUser.RoleId));
                    return Ok(cases1);
                }
                else
                {
                    var cases1 = Repository.Matter.viewfavcontactlist(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), pagenum, pagesize, Convert.ToInt32(LoggedInUser.RoleId));
                    var param = controllername + ">SpContactData>viewcontactlist>param=" + LoggedInUser.FirmId;
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
        /// Get colmaps data
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SpColMaps1()
        {
            try
            {
                var fid = Request.Headers.GetValues("fid").FirstOrDefault();
                if (fid != "0")
                {
                    var cid = Convert.ToInt32(fid);
                    var cases = Repository.Matter.spcolmap1(LoggedInUser.FirmId.ToString(), cid.ToString());
                    return Ok(cases);
                }
                return Ok();
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Demo read api repo
        /// </summary>
        /// <returns></returns>
        public IHttpActionResult demorp()
        {
            var cases = Repository.Firm.SelectAll1();
            return Ok(cases);
        }

        /// <summary>
        /// Demo insert api repo
        /// </summary>
        /// <returns></returns>
        public IHttpActionResult demoin()
        {
            var ft = "125";
            var cases = Repository.Firm.SelectAll(ft);
            return Ok(cases);
        }

        /// <summary>
        /// Remove fields
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveField()
        {
            try
            {
                var ftype = Request.Headers.GetValues("configurationtype").FirstOrDefault();
                var ctype = Convert.ToInt32(ftype);
                var cid = Request.Headers.GetValues("fid").FirstOrDefault();
                Repository.Matter.removefield(LoggedInUser.FirmId.ToString(), ctype.ToString(), cid.ToString());
                var param = controllername + ">RemoveField>removefield>param=" + LoggedInUser.FirmId + "@" + ctype + "@" + cid;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok();
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Contact), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Contact), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
    }
}