using BussinessLogic;
using DataAccess.Modals;
using LawPracticeFirm.Common;
using LawPracticeFirm.Models;
using Newtonsoft.Json;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.UI.WebControls;
namespace LawPracticeFirm.API
{
    public class LimitationApiController : BaseFirmApiController
    {
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
        /// View limitation cases
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ViewLimitationCases()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var pagenum = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]);
                var pagesize = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]);
                var subject = QueryAES.UrlDecode(HttpContext.Current.Request.Form["subject"]);
                try
                {
                    subject = subject.Replace(" ", "+");
                    subject = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(subject));
                }
                catch
                {
                }
                List<usp_GetAddLawMatterListbySubject_Result> list = new List<usp_GetAddLawMatterListbySubject_Result>();
                list = db.usp_GetAddLawMatterListbySubject(subject, firmid, userid, Convert.ToInt32(pagenum), Convert.ToInt32(pagesize)).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Case Limitation Subject
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CaseLimitationSubject()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var list = db.usp_GetCaseLimitationSubject().ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Get Case Limitation by Id
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CaseLimitationbyId()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var id = QueryAES.UrlDecode(HttpContext.Current.Request.Form["id"]);
                var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["case"]);
                var startdate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["startdate"]);
                try
                {
                    caseid = caseid.Replace(" ", "+");
                    caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
                }
                catch
                {
                }
                List<usp_GetCaseLimitationbyId_Result> list = new List<usp_GetCaseLimitationbyId_Result>();
                list = db.usp_GetCaseLimitationbyId(firmid, id, caseid, startdate).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Get Case Limitation manual by Id
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CaseLimitationmanualbyId()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var id = QueryAES.UrlDecode(HttpContext.Current.Request.Form["id"]);
                var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["case"]);
                var startdate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["startdate"]);
                try
                {
                    caseid = caseid.Replace(" ", "+");
                    caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
                }
                catch
                {
                }
                List<usp_GetCaseLimitationManualbyId_Result> list = new List<usp_GetCaseLimitationManualbyId_Result>();
                list = db.usp_GetCaseLimitationManualbyId(firmid, id, caseid, startdate).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Delete Case Limtation Alert
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult DeleteCaseLimtationAlert()
        {
            try
            {
                var db = new LawPracticeEntities();
                var id = QueryAES.UrlDecode(HttpContext.Current.Request.Form["id"]);
                int result = db.sp_DeleteLimitationAlert(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Alert Users by Cl Id
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult AlertUsersbyClId()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var clid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["clid"]);
                var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["case"]);
                try
                {
                    caseid = caseid.Replace(" ", "+");
                    caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
                }
                catch
                {
                }
                List<usp_GetCaseLimitationAlertsUserbyCLAId_Result> list = new List<usp_GetCaseLimitationAlertsUserbyCLAId_Result>();
                list = db.usp_GetCaseLimitationAlertsUserbyCLAId(clid, firmid, caseid).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Case Limitation Alert Date by Cl Id
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CaseLimitationAlertDatebyClId()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var clid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["clid"]);
                var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseid"]);
                try
                {
                    caseid = caseid.Replace(" ", "+");
                    caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
                }
                catch
                {
                }
                List<usp_GetCaseLimitationAlertDate_Result> list = new List<usp_GetCaseLimitationAlertDate_Result>();
                list = db.usp_GetCaseLimitationAlertDate(clid, caseid, LoggedInUser.FirmId.ToString()).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }
        /// <summary>
        /// Update Case Limitation Alerts
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult UpdateCaseLimitationAlerts()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var id = QueryAES.UrlDecode(HttpContext.Current.Request.Form["id"]); // id of Tbl_CaseLimitation
                var remarks = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Remarks"]);
                var ddate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ddate"]);
                var setalert = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["setalert"]));
                var caid = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["hidcaid"])); // id of Tbl_CaseLimitationAlert
                var userloginids = QueryAES.UrlDecode(HttpContext.Current.Request.Form["userloginids"]);
                var multipledays = QueryAES.UrlDecode(HttpContext.Current.Request.Form["multipledays"]);
                var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseid"]);
                var isfile = 0;
                var isaction = 0;
                var httpRequest = HttpContext.Current.Request;
                var files = "";
                if (httpRequest.Files.Count > 0)
                {
                    isfile = 1;
                }
                int effected = 0;
                string[] strmultipledays = multipledays.TrimEnd(',').Split(',');
                for (int d = 0; d < strmultipledays.Length; d++)
                {
                    int days = 0;
                    string strdays = Convert.ToString(strmultipledays[d]);
                    if (!string.IsNullOrEmpty(strdays))
                    {
                        days = Convert.ToInt32(strdays);
                    }
                    ObjectParameter IDParameter1;
                    IDParameter1 = new ObjectParameter("id", caid);
                    effected = db.usp_UpdateCaseLimitationAlerts(IDParameter1, id, firmid, userid, remarks, Convert.ToDateTime(ddate), setalert, isfile, isaction, days, caseid, 0);
                    caid = Convert.ToString(IDParameter1.Value);
                    if (effected > 0)
                    {
                        int aleraddeffected = db.usp_AddCaseLimitationAlertsUser(caid, firmid, userid, 0);
                        string[] struserloginids = userloginids.TrimEnd(',').Split(',');
                        for (int i = 0; i < struserloginids.Length; i++)
                        {
                            string assignuser = Convert.ToString(struserloginids[i]);
                            if (!string.IsNullOrEmpty(assignuser))
                            {
                                aleraddeffected = db.usp_AddCaseLimitationAlertsUser(caid, firmid, assignuser, 0);
                            }
                        }
                    }
                }
                dynamic postedFiledata = "";
                //upload files in azure server
                files = postedFiledata;
                var myList = new List<string>();
                //upload files in azure server
                var ml = new AddCallList();
                if (httpRequest.Files.Count > 0)
                {
                    var docfiles = new List<string>();
                    string folderPath = HttpContext.Current.Server.MapPath("~/Documents/LimitationDocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/");
                    string folderpathazure = "Documents/LimitationDocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
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
                        try
                        {
                            var status = AzureDocumentself.filecreateafteredit(output, folderpathazure, Path.GetFileName(tempflname), null, null);
                        }
                        catch (Exception er)
                        {
                            AzureDocumentself.CreateNestedDirectory(folderpathazure);
                            var status = AzureDocumentself.filecreateafteredit(output, folderpathazure, Path.GetFileName(tempflname), null, null);
                        }
                        System.IO.File.Delete(input);
                    }
                    var filearray = myList.ToArray();
                    postedFiledata = string.Join("/", filearray);
                    ml.cfiles = postedFiledata;
                    ml.Id = Guid.Parse(caid);
                    MultipleFileMap mf = new MultipleFileMap();
                    string s = ml.cfiles;
                    string userlist = ml.cpuser;
                    ml.cpuser = new Guid().ToString();
                    if (ml.cfiles != "")
                    {
                        ml.cfiles = "1";
                    }
                    if (s != "")
                    {
                        string[] values = s.Split('/');
                        for (int i = 0; i < values.Length; i++)
                        {
                            values[i] = values[i].Trim();
                            mf.filedocs = values[i];
                            mf.Firmid = Guid.Parse(firmid);
                            mf.userid = Guid.Parse(userid);
                            mf.rowid = ml.Id;
                            mf.date_time = DateTime.Now;
                            mf.moduletype = "STATUTEOFLIMITATION";
                            db.Usp_SaveMultipleFileMap(mf.Firmid.ToString(), mf.userid.ToString(), mf.rowid.ToString(), mf.filedocs, mf.moduletype, null);
                        }
                    }
                }
                if (effected > 0)
                {
                    return Ok("Success");
                }
                else
                {
                    return Ok("OOPs! Something went wrong.");
                }
            }
            catch (Exception ex)
            {
                return Ok("OOPs! Something went wrong.");
            }
        }

        /// <summary>
        /// Update Case Limitation Alerts Manual
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult UpdateCaseLimitationAlertsManual()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var id = QueryAES.UrlDecode(HttpContext.Current.Request.Form["id"]); // id of Tbl_CaseLimitation
                var remarks = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Remarks"]);
                var ddate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ddate"]);
                var setalert = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["setalert"]));
                var caid = "";
                var userloginids = QueryAES.UrlDecode(HttpContext.Current.Request.Form["userloginids"]);
                var multipledays = QueryAES.UrlDecode(HttpContext.Current.Request.Form["multipledays"]);
                var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseid"]);
                var isfile = 0;
                var isaction = 0;
                var httpRequest = HttpContext.Current.Request;
                var files = "";
                if (httpRequest.Files.Count > 0)
                {
                    isfile = 1;
                }
                int effected = 0;
                string[] strmultipledays = multipledays.TrimEnd(',').Split(',');
                for (int d = 0; d < strmultipledays.Length; d++)
                {
                    int days = 0;
                    string strdays = Convert.ToString(strmultipledays[d]);
                    if (!string.IsNullOrEmpty(strdays))
                    {
                        days = Convert.ToInt32(strdays);
                    }
                    var finaldate = Convert.ToDateTime(ddate).AddDays(-days).ToShortDateString();
                    if (Convert.ToDateTime(finaldate) < Convert.ToDateTime(DateTime.Now.ToShortDateString()))
                    {
                        return Ok("previousdate");
                    }
                    ObjectParameter IDParameter1;
                    IDParameter1 = new ObjectParameter("id", caid);
                    effected = db.usp_UpdateCaseLimitationAlerts(IDParameter1, id, firmid, userid, remarks, Convert.ToDateTime(ddate), setalert, isfile, isaction, days, caseid, 1);
                    caid = Convert.ToString(IDParameter1.Value);
                    if (effected > 0)
                    {
                        int aleraddeffected = db.usp_AddCaseLimitationAlertsUser(caid, firmid, userid, 1);
                        string[] struserloginids = userloginids.TrimEnd(',').Split(',');
                        for (int i = 0; i < struserloginids.Length; i++)
                        {
                            string assignuser = Convert.ToString(struserloginids[i]);
                            if (!string.IsNullOrEmpty(assignuser))
                            {
                                aleraddeffected = db.usp_AddCaseLimitationAlertsUser(caid, firmid, assignuser, 1);
                            }
                        }
                    }
                }
                dynamic postedFiledata = "";
                //upload files in azure server
                files = postedFiledata;
                var myList = new List<string>();
                //upload files in azure server
                var ml = new AddCallList();
                if (httpRequest.Files.Count > 0)
                {
                    var docfiles = new List<string>();
                    string folderPath = HttpContext.Current.Server.MapPath("~/Documents/LimitationDocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/");
                    string folderpathazure = "Documents/LimitationDocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
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
                        try
                        {
                            var status = AzureDocumentself.filecreateafteredit(output, folderpathazure, Path.GetFileName(tempflname), null, null);
                        }
                        catch (Exception er)
                        {
                            AzureDocumentself.CreateNestedDirectory(folderpathazure);
                            var status = AzureDocumentself.filecreateafteredit(output, folderpathazure, Path.GetFileName(tempflname), null, null);
                        }
                        System.IO.File.Delete(input);
                    }
                    var filearray = myList.ToArray();
                    postedFiledata = string.Join("/", filearray);
                    ml.cfiles = postedFiledata;
                    ml.Id = Guid.Parse(caid);
                    MultipleFileMap mf = new MultipleFileMap();
                    string s = ml.cfiles;
                    string userlist = ml.cpuser;
                    ml.cpuser = new Guid().ToString();
                    if (ml.cfiles != "")
                    {
                        ml.cfiles = "1";
                    }
                    if (s != "")
                    {
                        string[] values = s.Split('/');
                        for (int i = 0; i < values.Length; i++)
                        {
                            values[i] = values[i].Trim();
                            mf.filedocs = values[i];
                            mf.Firmid = Guid.Parse(firmid);
                            mf.userid = Guid.Parse(userid);
                            mf.rowid = ml.Id;
                            mf.date_time = DateTime.Now;
                            mf.moduletype = "STATUTEOFLIMITATION";
                            db.Usp_SaveMultipleFileMap(mf.Firmid.ToString(), mf.userid.ToString(), mf.rowid.ToString(), mf.filedocs, mf.moduletype, null);
                        }
                    }
                }
                if (effected > 0)
                {
                    return Ok("Success");
                }
                else
                {
                    return Ok("OOPs! Something went wrong.");
                }
            }
            catch (Exception ex)
            {
                return Ok("OOPs! Something went wrong.");
            }
        }

        /// <summary>
        /// Update Case Limitation Action
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult UpdateCaseLimitationAction()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var id = QueryAES.UrlDecode(HttpContext.Current.Request.Form["id"]); // id of Tbl_CaseLimitation
                var caid = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["hidcaid"])); // id of Tbl_CaseLimitationAlert
                var isfile = 0;
                var isaction = QueryAES.UrlDecode(HttpContext.Current.Request.Form["isaction"]);
                var actonremarks = QueryAES.UrlDecode(HttpContext.Current.Request.Form["actonremarks"]);
                var httpRequest = HttpContext.Current.Request;
                var files = "";
                if (httpRequest.Files.Count > 0)
                {
                    isfile = 1;
                }
                ObjectParameter IDParameter1;
                IDParameter1 = new ObjectParameter("id", caid);
                int effected = db.usp_UpdateCaseLimitationAction(IDParameter1, id, firmid, userid, isfile, Convert.ToInt32(isaction), actonremarks);
                caid = Convert.ToString(IDParameter1.Value);
                dynamic postedFiledata = "";
                //upload files in azure server
                files = postedFiledata;
                var myList = new List<string>();
                //upload files in azure server
                var ml = new AddCallList();
                if (httpRequest.Files.Count > 0)
                {
                    var docfiles = new List<string>();
                    string folderPath = HttpContext.Current.Server.MapPath("~/Documents/LimitationDocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/");
                    string folderpathazure = "Documents/LimitationDocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
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
                        try
                        {
                            var status = AzureDocumentself.filecreateafteredit(output, folderpathazure, Path.GetFileName(tempflname), null, null);
                        }
                        catch (Exception er)
                        {
                            AzureDocumentself.CreateNestedDirectory(folderpathazure);
                            var status = AzureDocumentself.filecreateafteredit(output, folderpathazure, Path.GetFileName(tempflname), null, null);
                        }
                        System.IO.File.Delete(input);
                    }
                    var filearray = myList.ToArray();
                    postedFiledata = string.Join("/", filearray);
                    ml.cfiles = postedFiledata;
                    ml.Id = Guid.Parse(caid);
                    MultipleFileMap mf = new MultipleFileMap();
                    string s = ml.cfiles;
                    string userlist = ml.cpuser;
                    ml.cpuser = new Guid().ToString();
                    if (ml.cfiles != "")
                    {
                        ml.cfiles = "1";
                    }
                    if (s != "")
                    {
                        string[] values = s.Split('/');
                        for (int i = 0; i < values.Length; i++)
                        {
                            values[i] = values[i].Trim();
                            mf.filedocs = values[i];
                            mf.Firmid = Guid.Parse(firmid);
                            mf.userid = Guid.Parse(userid);
                            mf.rowid = ml.Id;
                            mf.date_time = DateTime.Now;
                            mf.moduletype = "STATUTEOFLIMITATION";
                            db.Usp_SaveMultipleFileMap(mf.Firmid.ToString(), mf.userid.ToString(), mf.rowid.ToString(), mf.filedocs, mf.moduletype, null);
                        }
                    }
                }
                if (effected > 0)
                {
                    return Ok("Success");
                }
                else
                {
                    return Ok("OOPs! Something went wrong.");
                }
            }
            catch (Exception ex)
            {
                return Ok("OOPs! Something went wrong.");
            }
        }

        /// <summary>
        /// Save Case Condonation
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SaveCaseCondonation()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseid"]);
                try
                {
                    caseid = caseid.Replace(" ", "+");
                    caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
                }
                catch
                {
                }
                var Condonationvaue = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Condonation"]);
                var data = db.usp_savecaseCondonation(firmid, userid, caseid, Convert.ToInt16(Condonationvaue));
                return Ok(data);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Case Condonation Count
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CaseCondonationCount()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseid"]);
                try
                {
                    caseid = caseid.Replace(" ", "+");
                    caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
                }
                catch
                {
                }
                var data = db.usp_GetCondonation(firmid, userid, caseid, 0).FirstOrDefault();
                var a = JsonConvert.SerializeObject(data);
                return Ok(data);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// View Limitation Cases By Search
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ViewLimitationCasesBySearch()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var pagenum = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]);
                var pagesize = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]);
                var search = QueryAES.UrlDecode(HttpContext.Current.Request.Form["search"]);
                List<sp_getLimitationApplicable_Result> list = new List<sp_getLimitationApplicable_Result>();
                if (search != "")
                {
                    list = db.sp_getLimitationApplicable(search, firmid, userid, Convert.ToInt32(pagenum), Convert.ToInt32(pagesize)).ToList();
                }
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Save Case Limtation Alert
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SaveCaseLimtationAlert()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var id = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ClId"]);
                var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseid"]);
                var Remarks = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Remarks"]);
                var DueDate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["DueDate"]);
                var startdate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["startdate"]);
                try
                {
                    caseid = caseid.Replace(" ", "+");
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                string idd = Guid.NewGuid().ToString();
                DateTime dtt = Convert.ToDateTime(DueDate);
                int result = db.sp_SaveLimitaionAlert(idd, id, firmid, userid, Remarks, dtt, caseid, null, startdate);
                return Ok();
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// View Saved Limitations Cases
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult ViewSavedLimitationsCases()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var pagenum = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]);
                var pagesize = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]);
                var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseid"]);
                try
                {
                    caseid = caseid.Replace(" ", "+");
                    caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
                }
                catch (Exception ex)
                {
                }
                List<sp_GetSavedAlertById_Result> list = new List<sp_GetSavedAlertById_Result>();
                list = db.sp_GetSavedAlertById(firmid, userid, caseid).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Get Limitation Manual Data
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult GetLimitationManualData()
        {
            var db = new LawPracticeEntities();
            var firmid = LoggedInUser.FirmId.ToString();
            var userid = LoggedInUser.UserId.ToString();
            var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseid"]);
            try
            {
                caseid = caseid.Replace(" ", "+");
                caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
            }
            catch (Exception ex)
            {
            }
            try
            {
                List<sp_GetlimitationManualEntry_Result> list = new List<sp_GetlimitationManualEntry_Result>();
                list = db.sp_GetlimitationManualEntry(firmid, userid, caseid).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Post Save Limitation Data
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [HttpPost]
        public IHttpActionResult PostSaveLimitationData()
        {
            var db = new LawPracticeEntities();
            var firmid = LoggedInUser.FirmId.ToString();
            var userid = LoggedInUser.UserId.ToString();
            var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseid"]);
            string sdate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fStartDate"]);
            string fLimitationDate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fLimitationDate"]);
            string fDateSatisfied = DateTime.Now.ToShortDateString();
            string fReminder = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fReminder"]);
            if (fReminder == "" || fReminder == "null" || fReminder == null || fReminder == "undefined")
            {
                fReminder = null;
            }
            string fDescription = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fDescription"]);
            try
            {
                var result = db.sp_SaveLimitationManualEntry(Guid.Parse(firmid), userid, caseid, Convert.ToDateTime(sdate), Convert.ToDateTime(fLimitationDate), Convert.ToDateTime(fDateSatisfied), fReminder, fDescription, null);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Remove Manual Limitation
        /// </summary>
        /// <param name="typeIds"></param>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveManualLimitation(string[] typeIds)
        {
            var db = new LawPracticeEntities();
            try
            {
                foreach (string did1 in typeIds)
                {
                    var result = db.usp_removeManuallimitation(Guid.Parse(LoggedInUser.FirmId.ToString()), Guid.Parse(LoggedInUser.UserId.ToString()), Guid.Parse(did1));
                    return Ok(result);
                }
            }
            catch (Exception ex)
            {
            }
            return Ok();
        }
    }
}