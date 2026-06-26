using BussinessLogic;
using DataAccess.Modals;
using LawPracticeFirm.Common;
using LawPracticeFirm.Models;
using Newtonsoft.Json.Linq;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http;
using static LawPracticeFirm.Models.AuditData;

namespace LawPracticeFirm.API
{
    public class LeadApiController : BaseFirmApiController
    {
        private LawPracticeEntities db1 = new LawPracticeEntities();
        public string controllername = "LeadApiController";

        /// <summary>
        /// Generate Random number
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
        /// Create lead
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CreateLead()
        {
            try
            {
                var myList = new List<string>();
                var db = new LawPracticeEntities();
                dynamic postedFiledata = "";
                dynamic postedFiledata1 = "";
                var ml = new LeadList();
                string faeemail = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["lemail"]));
                string facontact = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["lmob"]));
                var firmusercontact = db.ValidateMobile(facontact, LoggedInUser.FirmId.ToString()).FirstOrDefault();
                if (firmusercontact != null)
                {
                    return Ok("Already Exists Mobile Please Try Another Mobile!");
                }
                else
                {
                }
                var lfirmusercontact = db.LeadLists.Where(x => x.ldmob == facontact.Trim()).FirstOrDefault();
                if (lfirmusercontact != null)
                {
                    return Ok("Already Exists Mobile Please Try Another Mobile!");
                }
                else
                {
                }
                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count > 0)
                {
                    var docfiles = new List<string>();
                    string folderPath = HttpContext.Current.Server.MapPath("~/Documents/Leaddocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/");
                    string folderpathazure = "Documents/Leaddocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
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
                        var fileName1 = "E2bdADS_" + fileName + randomno() + fileext;
                        var filePath = folderPath + Path.GetFileName(fileName1); //HttpContext.Current.Server.MapPath(+ postedFile.FileName);
                        var fileextchk = Path.GetExtension(postedFile.FileName);
                        var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);
                        postedFile.SaveAs(filePath);
                        docfiles.Add(filePath);
                        string input = filePath;
                        string tempflname = fileName1;
                        tempflname = tempflname.Remove(0, 8);
                        ml.lddocs = tempflname;
                        myList.Add(ml.lddocs);
                        string output = folderPath + Path.GetFileName(tempflname);
                        QueryAES.FileEncrypt(input, output);
                        try
                        {
                            var status = AzureDocumentself.filecreateafteredit(output, folderpathazure, Path.GetFileName(tempflname), null, null);
                        }
                        catch (Exception er)
                        {
                            AzureDocumentself.CreateNestedDirectory(folderpathazure);
                            var status = AzureDocumentself.filecreateafteredit(output, folderpathazure, Path.GetFileName(tempflname), null, null);
                        }
                        //delete file
                        System.IO.File.Delete(input);
                    }
                }
                var filearray = myList.ToArray();
                postedFiledata = string.Join("/", filearray);
                ml.lddocs = postedFiledata;
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
                ml.Firmid = LoggedInUser.FirmId;
                ml.firmuser = LoggedInUser.UserId;
                ml.ldname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["lname"]);
                ml.ldcperson = QueryAES.UrlDecode(HttpContext.Current.Request.Form["cperson"]);
                ml.ldorg = QueryAES.UrlDecode(HttpContext.Current.Request.Form["org"]);
                ml.lddesign = QueryAES.UrlDecode(HttpContext.Current.Request.Form["lpost"]);
                ml.ldadd = QueryAES.UrlDecode(HttpContext.Current.Request.Form["laddress"]);
                ml.ldcountry = QueryAES.UrlDecode(HttpContext.Current.Request.Form["lcountry"]);
                ml.ldstate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["lstate"]);
                ml.ldcity = QueryAES.UrlDecode(HttpContext.Current.Request.Form["lcity"]);
                ml.ldfax = QueryAES.UrlDecode(HttpContext.Current.Request.Form["lfax"]);
                ml.ldemail = QueryAES.UrlDecode(HttpContext.Current.Request.Form["lemail"]);
                ml.ldpin = QueryAES.UrlDecode(HttpContext.Current.Request.Form["lpin"]);
                ml.ldphn = QueryAES.UrlDecode(HttpContext.Current.Request.Form["lphn"]);
                ml.ldmob = QueryAES.UrlDecode(HttpContext.Current.Request.Form["lmob"]);
                ml.ldctype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["lbtyte"]);
                ml.ldcategory = QueryAES.UrlDecode(HttpContext.Current.Request.Form["lcategory"]);
                ml.ldsource = QueryAES.UrlDecode(HttpContext.Current.Request.Form["lsource"]);
                ml.ldltype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ltype"]);
                ml.ldplan = QueryAES.UrlDecode(HttpContext.Current.Request.Form["lplan"]);
                ml.ldec = QueryAES.UrlDecode(HttpContext.Current.Request.Form["lec"]);
                ml.ldinfo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["linfo"]);
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
                Repository.Lead.createlead(ml, ftype, sum, ctxt1, ctxt2, ctxt3, ctxt4, ctxt5, ctxt6, ctxt7, ctxt8, ctxt9, ctxt10, ctxt11, ctxt12, ctxt13, ctxt14, ctxt15);
                var param = controllername + ">CreateLead>createlead>param=" + ml.lstatus + "@" + ml.lid + "@" + ml.ldstate + "@" + ml.ldsource + "@" + ml.ldplan + "@" + ml.ldpin + "@" + ml.ldphn + "@" + ml.ldorg + "@" + ml.ldname + "@" + ml.ldmob + "@" + ml.ldltype + "@" + ml.ldinfo + "@" + ml.ldfax + "@" + ml.ldemail + "@" + ml.ldec + "@" + ml.lddocs + "@" + ml.lddesign + "@" + ml.ldctype + "@" + ml.ldcperson + "@" + ml.ldcountry + "@" + ml.ldcity + "@" + ml.ldcategory + "@" + ml.ldadd + "@" + ml.firmuser + "@" + ml.Firmid + "@" + ml.date_time;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Lead), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Lead), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok();
            }
            catch (Exception ex)
            {

                db1.usp_AddAuditError(Convert.ToInt32(EventType.Lead), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Lead), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }


        /// <summary>
        /// Update Lead
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult UpdateLead()
        {
            try
            {
                var myList = new List<string>();
                var db = new LawPracticeEntities();
                dynamic postedFiledata = "";
                dynamic postedFiledata1 = "";
                var ml = new LeadList();
                string faeemail = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["lemail"]));
                var checkemail = db.FirmUsers.Where(a => a.Id == LoggedInUser.UserId).FirstOrDefault();
                string facontact = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["lmob"]));
                var checkmob = db.usp_wf_GetUserDetails(LoggedInUser.FirmId, LoggedInUser.UserId).FirstOrDefault();
                if (checkmob != null)
                {
                    if (checkmob.cmobile.ToString() == facontact)
                    {
                    }
                    else
                    {
                        var firmusermob = db.ValidateMobile(facontact, LoggedInUser.FirmId.ToString()).FirstOrDefault();
                        if (firmusermob != null)
                        {
                            return Ok("Already Exists Mobile Please Try Another Mobile!");
                        }
                        else
                        {
                        }
                    }
                }
                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count > 0)
                {
                    var docfiles = new List<string>();
                    string folderPath = HttpContext.Current.Server.MapPath("~/Documents/Leaddocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/");
                    string folderpathazure = "Documents/Leaddocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
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
                        var fileName1 = "E2bdADS_" + fileName + randomno() + fileext;
                        var filePath = folderPath + Path.GetFileName(fileName1); //HttpContext.Current.Server.MapPath(+ postedFile.FileName);
                        var fileextchk = Path.GetExtension(postedFile.FileName);
                        var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);
                        postedFile.SaveAs(filePath);
                        docfiles.Add(filePath);
                        string input = filePath;
                        string tempflname = fileName1;
                        tempflname = tempflname.Remove(0, 8);
                        ml.lddocs = tempflname;
                        myList.Add(ml.lddocs);
                        string output = folderPath + Path.GetFileName(tempflname);
                        QueryAES.FileEncrypt(input, output);
                        try
                        {
                            var status = AzureDocumentself.filecreateafteredit(output, folderpathazure, Path.GetFileName(tempflname), null, null);
                        }
                        catch (Exception er)
                        {
                            AzureDocumentself.CreateNestedDirectory(folderpathazure);
                            var status = AzureDocumentself.filecreateafteredit(output, folderpathazure, Path.GetFileName(tempflname), null, null);
                        }
                        //delete file
                        System.IO.File.Delete(input);
                    }
                }
                var filearray = myList.ToArray();
                postedFiledata = string.Join("/", filearray);
                ml.lddocs = postedFiledata;
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
                var id = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Id"]);
                ml.lid = Guid.Parse(QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(id.ToString())));
                ml.Firmid = LoggedInUser.FirmId;
                ml.firmuser = LoggedInUser.UserId;
                ml.ldname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["lname"]);
                ml.ldcperson = QueryAES.UrlDecode(HttpContext.Current.Request.Form["cperson"]);
                ml.ldorg = QueryAES.UrlDecode(HttpContext.Current.Request.Form["org"]);
                ml.lddesign = QueryAES.UrlDecode(HttpContext.Current.Request.Form["lpost"]);
                ml.ldadd = QueryAES.UrlDecode(HttpContext.Current.Request.Form["laddress"]);
                ml.ldcountry = QueryAES.UrlDecode(HttpContext.Current.Request.Form["lcountry"]);
                ml.ldstate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["lstate"]);
                ml.ldcity = QueryAES.UrlDecode(HttpContext.Current.Request.Form["lcity"]);
                ml.ldfax = QueryAES.UrlDecode(HttpContext.Current.Request.Form["lfax"]);
                ml.ldemail = QueryAES.UrlDecode(HttpContext.Current.Request.Form["lemail"]);
                ml.ldpin = QueryAES.UrlDecode(HttpContext.Current.Request.Form["lpin"]);
                ml.ldphn = QueryAES.UrlDecode(HttpContext.Current.Request.Form["lphn"]);
                ml.ldmob = QueryAES.UrlDecode(HttpContext.Current.Request.Form["lmob"]);
                ml.ldctype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["lbtyte"]);
                ml.ldcategory = QueryAES.UrlDecode(HttpContext.Current.Request.Form["lcategory"]);
                ml.ldsource = QueryAES.UrlDecode(HttpContext.Current.Request.Form["lsource"]);
                ml.ldltype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ltype"]);
                ml.ldplan = QueryAES.UrlDecode(HttpContext.Current.Request.Form["lplan"]);
                ml.ldec = QueryAES.UrlDecode(HttpContext.Current.Request.Form["lec"]);
                ml.ldinfo = QueryAES.UrlDecode(HttpContext.Current.Request.Form["linfo"]);
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
                Repository.Lead.updatelead(ml, LoggedInUser.FirmId.ToString(), ftype, sum, ctxt1, ctxt2, ctxt3, ctxt4, ctxt5, ctxt6, ctxt7, ctxt8, ctxt9, ctxt10, ctxt11, ctxt12, ctxt13, ctxt14, ctxt15);
                var param = controllername + ">UpdateLead>updatelead>param=" + ml.lstatus + "@" + ml.lid + "@" + ml.ldstate + "@" + ml.ldsource + "@" + ml.ldplan + "@" + ml.ldpin + "@" + ml.ldphn + "@" + ml.ldorg + "@" + ml.ldname + "@" + ml.ldmob + "@" + ml.ldltype + "@" + ml.ldinfo + "@" + ml.ldfax + "@" + ml.ldemail + "@" + ml.ldec + "@" + ml.lddocs + "@" + ml.lddesign + "@" + ml.ldctype + "@" + ml.ldcperson + "@" + ml.ldcountry + "@" + ml.ldcity + "@" + ml.ldcategory + "@" + ml.ldadd + "@" + ml.firmuser + "@" + ml.Firmid + "@" + ml.date_time;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Lead), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Lead), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok();
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Lead), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Lead), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Remove Field In  Lead
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
                Repository.Lead.leadremovefield(LoggedInUser.FirmId.ToString(), ctype.ToString(), fid.ToString());
                var param = controllername + ">RemoveField>leadremovefield>param=" + LoggedInUser.FirmId + "@" + ctype + "@" + fid;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Lead), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Lead), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok();
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Lead), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Lead), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
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
                    var cases = Repository.Lead.spcolmap1(LoggedInUser.FirmId.ToString(), cid.ToString());
                    return Ok(cases);
                }
                return Ok();
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Lead), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Lead), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Get lead data
        /// </summary>
        /// <param name="paramJObject"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SpLeadData([FromBody] JObject paramJObject)
        {
            try
            {
                LawPracticeEntities db = new LawPracticeEntities();
                var cases1 = Repository.Lead.viewleadlist(LoggedInUser.FirmId.ToString());
                var param = controllername + ">SpLeadData>viewleadlist>param=" + LoggedInUser.FirmId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.Lead), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Lead), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(cases1);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Lead), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Lead), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Get lead data by rowid
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SpLeadDataByRowid()
        {
            try
            {
                var search = QueryAES.UrlDecode(HttpContext.Current.Request.Form["search"]);
                int pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                int pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                LawPracticeEntities db = new LawPracticeEntities();
                if (search != "")
                {
                    var cases1 = Repository.Lead.viewleadlistsearchbyrowid(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), pagenum, pagesize, search);
                    return Ok(cases1);
                }
                else
                {
                    var cases1 = Repository.Lead.viewleadlistbyrowid(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), pagenum, pagesize);
                    var param = controllername + ">SpLeadDataByRowid>viewleadlistbyrowid>param=" + LoggedInUser.FirmId.ToString();
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Lead), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Lead), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                    return Ok(cases1);
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Lead), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Lead), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Remove Lead
        /// </summary>
        /// <param name="typeIds"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveLead(string[] typeIds)
        {
            try
            {
                var countcontact = Repository.Lead.removeleadlist(typeIds, LoggedInUser.FirmId.ToString());
                var db = new LawPracticeEntities();
                db.saveuseractivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.UserId.ToString(), 1, DateTime.Now.ToString(), "removeprospect", Guid.Empty.ToString(), null, null, DateTime.Now.ToString());
                var param = controllername + ">RemoveLead>removeleadlist>param=" + typeIds + "@" + LoggedInUser.FirmId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.Lead), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Lead), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(countcontact);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Lead), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Lead), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }


        /// <summary>
        /// Get Lead  Details 
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SingleLeadDetails()
        {
            try
            {
                var mid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["mid"]);
                mid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(mid));
                if (mid != "")
                {
                    var data = Repository.Lead.singleleaddetails(mid, LoggedInUser.FirmId.ToString());
                    var param = controllername + ">SingleLeadDetails>singleleaddetails>param=" + mid + "@" + LoggedInUser.FirmId.ToString();
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Lead), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Lead), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                    return Ok(data);
                }
                else
                {
                    return Ok("Opps! please After Some time.");
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Lead), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Lead), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
    }
}