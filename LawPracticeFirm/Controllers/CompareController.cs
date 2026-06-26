using BussinessLogic;
using DataAccess.Modals;
using Draftable.CompareAPI.Client;
using LawPracticeFirm.Common;
using LawPracticeFirm.CustomFIlter;
using LawPracticeFirm.DAL;
using LawPracticeFirm.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web.Configuration;
using System.Web.Helpers;
using System.Web.Mvc;
namespace LawPracticeFirm.Controllers
{
    public class CompareController : BaseFirmController
    {
        /// <summary>
        /// Compare document list
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        public ActionResult CompareDocList()
        {
            return View();
        }
        /// <summary>
        /// Compare new document
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        public ActionResult CompareNewDoc()
        {
            return View();
        }
        /// <summary>
        /// Compare document result
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        public ActionResult CompareDocResult()
        {
            return View();
        }
        //New Compare Document
        [AuthLog(Roles = "Firm,User,Client")]
        [System.Web.Mvc.HttpPost]
        public async Task<JsonResult> NewCompareDocuments()
        {
            try
            {

                DateTime date = DateTime.Now;
                var db = new LawPracticeEntities();
                string strfilepath1type = "";
                string strfilepath2type = "";
                var primaryFile = Request.Files["primary"];
                var secondaryFile = Request.Files["secondary"];
                string strfilepath1 = QueryAES.UrlDecode(Request.Form["filepath1"]);
                string strfilepath2 = QueryAES.UrlDecode(Request.Form["filepath2"]);
                if (String.IsNullOrEmpty(strfilepath1))
                {
                    return Json(new { Result = "firstfileblank" }, JsonRequestBehavior.AllowGet);
                }
                if (String.IsNullOrEmpty(strfilepath2))
                {
                    return Json(new { Result = "secondfileblank" }, JsonRequestBehavior.AllowGet);
                }
                string name = QueryAES.UrlDecode(Request.Form["name"]);
                string day = QueryAES.UrlDecode(Request.Form["day"]);
                var savecheckbox = QueryAES.UrlDecode(Request.Form["savecheckbox"]);

                int defaultexpirydate = 7;
                double expirydays = 0;
                DateTime Comparedate = DateTime.Now;
                if (day.Trim() == "")
                    date = DateTime.Now.AddDays(defaultexpirydate);
                else
                    date = Convert.ToDateTime(day);
                if (date.ToString("dd MMM yyyy") == DateTime.Now.ToString("dd MMM yyyy"))
                {
                    Comparedate = date.AddDays(1);
                }
                else
                {
                    Comparedate = date.AddDays(1);
                }
                DateTime Date1 = new DateTime(Comparedate.Year, Comparedate.Month, Comparedate.Day);
                DateTime Date2 = DateTime.Now;
                TimeSpan myDateResult = new TimeSpan();
                myDateResult = Date1 - Date2;
                expirydays = myDateResult.TotalMinutes;
                if (strfilepath1.IndexOf(".") > -1 && strfilepath2.IndexOf(".") > -1)
                {
                    strfilepath1type = strfilepath1.Substring(strfilepath1.LastIndexOf(".") + 1);
                    strfilepath2type = strfilepath2.Substring(strfilepath2.LastIndexOf(".") + 1);
                }
                int strlist = 0;
                DataTable dt = DataAccessADO.GetComparecountDetails(Session["sessionfirmid"].ToString());
                if (dt.Rows.Count > 0)
                {
                    DataRow row = dt.Rows[0];
                    strlist = Convert.ToInt32(dt.Rows[0][0]);
                }
                if (strlist >= 0)
                {
                    // Validate the uploaded files
                    if (Request.Files.Count < 2)
                    {
                        return Json(new { error = "Two files are required: primary and secondary." });
                    }



                    if (primaryFile == null || secondaryFile == null)
                    {
                        return Json(new { error = "Missing primary or secondary file." });
                    }
                    string apiBaseUrlForCompareDoc = System.Configuration.ConfigurationManager.AppSettings["CompareDocAPIURL"];
                    string apiBaseUrl = apiBaseUrlForCompareDoc + "upload";
                    primaryFile.InputStream.Position = 0;
                    secondaryFile.InputStream.Position = 0;

                    using (var httpClient = new HttpClient())
                    using (var formData = new MultipartFormDataContent())
                    {
                        // Wrap primary file
                        var primaryContent = new StreamContent(primaryFile.InputStream);
                        primaryContent.Headers.ContentType = MediaTypeHeaderValue.Parse(primaryFile.ContentType ?? "application/octet-stream");
                        formData.Add(primaryContent, "primary", primaryFile.FileName);

                        // Wrap secondary file
                        var secondaryContent = new StreamContent(secondaryFile.InputStream);
                        secondaryContent.Headers.ContentType = MediaTypeHeaderValue.Parse(secondaryFile.ContentType ?? "application/octet-stream");
                        formData.Add(secondaryContent, "secondary", secondaryFile.FileName);

                        // Send POST request to target API
                        var response = await httpClient.PostAsync(apiBaseUrl, formData);
                        var responseBody = await response.Content.ReadAsStringAsync();
                        var jsonObj = JObject.Parse(responseBody);
                        string sessionId = jsonObj["session_id"]?.ToString();
                        string responseURL = apiBaseUrlForCompareDoc + "api/comparison/" + sessionId;

                        if (!response.IsSuccessStatusCode)
                        {
                            return Json(new
                            {
                                error = $"API error: {(int)response.StatusCode} - {response.ReasonPhrase}",
                                response = responseBody
                            });
                        }

                        //if (strlist==0)
                        //{
                        //    responseBody.app
                        //}
                        var saveCompareFlag = 0;
                        if (savecheckbox == "true" && strlist > 0)
                        {
                            saveCompareFlag = db.sp_AddCOmpareDoc(Session["sessionfirmid"].ToString(), Session["sessionuserid"].ToString(), name, strfilepath1, strfilepath2, Convert.ToDateTime(date.ToString("dd MMM yyyy")), responseURL);
                        }
                        jsonObj["Result"] = strlist;
                        jsonObj["saveCompareFlag"] = saveCompareFlag;

                        // overwrite responseBody with modified JSON
                        responseBody = jsonObj.ToString();
                        return Json(responseBody);
                    }
                }
                else
                {
                    return Json(new { Result = "0" }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { error = ex.Message });
            }
        }

        [AuthLog(Roles = "Firm,User,Client")]
        [System.Web.Mvc.HttpPost]
        public async Task<ActionResult> GetCompareDocumentsResult()
        {
            string session_id;

            using (var reader = new StreamReader(Request.InputStream))
            {
                session_id = await reader.ReadToEndAsync();
            }

            if (string.IsNullOrWhiteSpace(session_id))
                return new HttpStatusCodeResult(400, "Invalid session_id");
            session_id = session_id.Trim().Trim('"');
            string apiBaseUrlForCompareDoc = System.Configuration.ConfigurationManager.AppSettings["CompareDocAPIURL"];
            string apiUrl = $"{apiBaseUrlForCompareDoc}api/comparison/{session_id}";

            using (var httpClient = new HttpClient())
            {
                try
                {
                    var response = await httpClient.GetAsync(apiUrl);
                    response.EnsureSuccessStatusCode();

                    var resultContent = await response.Content.ReadAsStringAsync();

                    return Content(resultContent, "application/json");
                }
                catch (Exception ex)
                {
                    return new HttpStatusCodeResult(500, "Server error: " + ex.Message);
                }
            }
        }


        /// <summary>
        /// Compare documents
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public JsonResult CompareDocuments()
        {
            DateTime date = DateTime.Now;
            var db = new LawPracticeEntities();
            string strfilepath1type = "";
            string strfilepath2type = "";
            string strfilepath1 = QueryAES.UrlDecode(Request.Form["filepath1"]);
            string strfilepath2 = QueryAES.UrlDecode(Request.Form["filepath2"]);
            if (String.IsNullOrEmpty(strfilepath1))
            {
                return Json(new { Result = "firstfileblank" }, JsonRequestBehavior.AllowGet);
            }
            if (String.IsNullOrEmpty(strfilepath2))
            {
                return Json(new { Result = "secondfileblank" }, JsonRequestBehavior.AllowGet);
            }
            string name = QueryAES.UrlDecode(Request.Form["name"]);
            string day = QueryAES.UrlDecode(Request.Form["day"]);
            int defaultexpirydate = 7;
            double expirydays = 0;
            DateTime Comparedate = DateTime.Now;
            if (day.Trim() == "")
                date = DateTime.Now.AddDays(defaultexpirydate);
            else
                date = Convert.ToDateTime(day);
            if (date.ToString("dd MMM yyyy") == DateTime.Now.ToString("dd MMM yyyy"))
            {
                Comparedate = date.AddDays(1);
            }
            else
            {
                Comparedate = date.AddDays(1);
            }
            DateTime Date1 = new DateTime(Comparedate.Year, Comparedate.Month, Comparedate.Day);
            DateTime Date2 = DateTime.Now;
            TimeSpan myDateResult = new TimeSpan();
            myDateResult = Date1 - Date2;
            expirydays = myDateResult.TotalMinutes;
            if (strfilepath1.IndexOf(".") > -1 && strfilepath2.IndexOf(".") > -1)
            {
                strfilepath1type = strfilepath1.Substring(strfilepath1.LastIndexOf(".") + 1);
                strfilepath2type = strfilepath2.Substring(strfilepath2.LastIndexOf(".") + 1);
            }
            dynamic strlist = db.sp_CheckCompareDoc3(Session["sessionfirmid"].ToString()).FirstOrDefault();
            if (strlist > 0)
            {
                using (var comparisons = new Comparisons(WebConfigurationManager.AppSettings["CompareAccountId"], WebConfigurationManager.AppSettings["CompareAuthToken"]))
                {
                    strfilepath1 = strfilepath1.Substring(strfilepath1.IndexOf(WebConfigurationManager.AppSettings["Comparepath"].ToString().Replace("\\", "/")));
                    strfilepath2 = strfilepath2.Substring(strfilepath2.IndexOf(WebConfigurationManager.AppSettings["Comparepath"].ToString().Replace("\\", "/")));
                    var identifier = Comparisons.GenerateIdentifier();
                    System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var comparison = comparisons.Create(
                         Comparisons.Side.FromFile(Server.MapPath(strfilepath1)),
                          Comparisons.Side.FromFile(Server.MapPath(strfilepath2)),
                         identifier: identifier,
                        expires: TimeSpan.FromMinutes(expirydays)
                    );

                    db.sp_AddCOmpareDoc(Session["sessionfirmid"].ToString(), Session["sessionuserid"].ToString(), name, strfilepath1, strfilepath2, Convert.ToDateTime(date.ToString("dd MMM yyyy")), comparisons.SignedViewerURL(comparison.Identifier, TimeSpan.FromMinutes(expirydays)).ToString());                    //System.IO.File.Delete(Server.MapPath(strfilepath1));

                    return Json(new { Result = comparisons.SignedViewerURL(comparison.Identifier, TimeSpan.FromMinutes(expirydays)) }, JsonRequestBehavior.AllowGet);
                }
            }
            else
            {
                return Json(new { Result = "0" }, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Save path
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public string savedpath()
        {
            string path = Server.MapPath(WebConfigurationManager.AppSettings["Comparepath"].ToString() + "\\" + Session["sessionfirmid"] + "\\" + Session["sessionuserid"]);
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
            return path.ToString() + "\\";
        }
        /// <summary>
        /// Upload file from drive
        /// </summary>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost, ValidateInput(false)]
        [AuthLog(Roles = "Firm,User,Client")]
        public JsonResult UploadFileFromDrive1()
        {
            var path = "";
            //get total file count
            var savemykasefileid = QueryAES.UrlDecode(Request.Form["savemykasefileid"]);
            if (!String.IsNullOrEmpty(savemykasefileid))
            {
                savemykasefileid = savemykasefileid.TrimEnd(',').TrimStart(',');
                string[] values = savemykasefileid.Split(',');
                int dynamicattachlength = Convert.ToInt32(values.Length);
                if (dynamicattachlength > 1)
                {
                    return Json(new { Result = "FileAttachExceed" }, JsonRequestBehavior.AllowGet);
                }
            }
            else
            {
                return Json(new { Result = "NoFileAttach" }, JsonRequestBehavior.AllowGet);
            }
            using (LawPracticeEntities db = new LawPracticeEntities())
            {
                using (var transaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var parentid = "";
                        string folderPath = "";
                        string folderpathazure = "";
                        parentid = Guid.Empty.ToString();
                        folderPath = savedpath();
                        if (!String.IsNullOrEmpty(savemykasefileid))
                        {
                            var filelist = SaveMykaseDocument.SaveMykaseDocumentToOtherModule(savemykasefileid, "compare", LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), "1");
                            if (!String.IsNullOrEmpty(filelist))
                            {
                                string[] values2 = filelist.Split('|');
                                for (int j = 0; j < values2.Length; j++)
                                {
                                    //get file physical path
                                    values2[j] = values2[j].Trim();
                                    var fileName = Path.GetFileNameWithoutExtension(values2[j]);
                                    var fileext = Path.GetExtension(values2[j]);
                                    string[] stringArray = { ".DOC", ".DOCX", ".PDF" };
                                    string value = fileext.ToUpper();
                                    int pos = Array.IndexOf(stringArray, value);
                                    if (pos > -1)
                                    {
                                    }
                                    else
                                    {
                                        try
                                        {
                                            System.IO.File.Delete(values2[j]);
                                        }
                                        catch
                                        {
                                        }
                                        return Json(new { Result = "ExtentionNotAllowed" }, JsonRequestBehavior.AllowGet);
                                    }
                                    //check file size
                                    FileInfo info = new FileInfo(values2[j]);
                                    long length = info.Length;
                                    //Convert to KB
                                    var finalfilelengthKb = length / 1024;
                                    if (finalfilelengthKb > 20480)
                                    {
                                        try
                                        {
                                            System.IO.File.Delete(values2[j]);
                                        }
                                        catch
                                        {
                                        }
                                        return Json(new { Result = "FileSizeExceed" }, JsonRequestBehavior.AllowGet);
                                    }
                                    fileName = ReplaceSpecialChar(fileName);
                                    var fileName1 = fileName + "_" + DateTime.Now.Ticks + fileext;
                                    var filePath = folderPath + Path.GetFileName(fileName1); //HttpContext.Current.Server.MapPath(+ postedFile.FileName);
                                    System.IO.File.Copy(values2[j], filePath, true);
                                    path = WebConfigurationManager.AppSettings["SiteUrl"] + filePath.Substring(filePath.IndexOf(WebConfigurationManager.AppSettings["Comparepath"].ToString().Replace("/", "\\"))).Replace("\\", "/");
                                }
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                    }
                }
            }
            return Json(new { Result = path }, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Upload file from drive
        /// </summary>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost, ValidateInput(false)]
        [AuthLog(Roles = "Firm,User,Client")]
        public JsonResult UploadFileFromDrive2()
        {
            var path = "";
            //get total file count
            var savemykasefileid = QueryAES.UrlDecode(Request.Form["savemykasefileid"]);
            if (!String.IsNullOrEmpty(savemykasefileid))
            {
                savemykasefileid = savemykasefileid.TrimEnd(',').TrimStart(',');
                string[] values = savemykasefileid.Split(',');
                int dynamicattachlength = Convert.ToInt32(values.Length);
                if (dynamicattachlength > 1)
                {
                    return Json(new { Result = "FileAttachExceed" }, JsonRequestBehavior.AllowGet);
                }
            }
            else
            {
                return Json(new { Result = "NoFileAttach" }, JsonRequestBehavior.AllowGet);
            }
            using (LawPracticeEntities db = new LawPracticeEntities())
            {
                using (var transaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var parentid = "";
                        string folderPath = "";
                        string folderpathazure = "";
                        parentid = Guid.Empty.ToString();
                        folderPath = savedpath();
                        if (!String.IsNullOrEmpty(savemykasefileid))
                        {
                            var filelist = SaveMykaseDocument.SaveMykaseDocumentToOtherModule(savemykasefileid, "compare", LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), "1");
                            if (!String.IsNullOrEmpty(filelist))
                            {
                                string[] values2 = filelist.Split('|');
                                for (int j = 0; j < values2.Length; j++)
                                {
                                    //get file physical path
                                    values2[j] = values2[j].Trim();
                                    var fileName = Path.GetFileNameWithoutExtension(values2[j]);
                                    var fileext = Path.GetExtension(values2[j]);
                                    string[] stringArray = { ".DOC", ".DOCX", ".PDF" };
                                    string value = fileext.ToUpper();
                                    int pos = Array.IndexOf(stringArray, value);
                                    if (pos > -1)
                                    {
                                    }
                                    else
                                    {
                                        try
                                        {
                                            System.IO.File.Delete(values2[j]);
                                        }
                                        catch
                                        {
                                        }
                                        return Json(new { Result = "ExtentionNotAllowed" }, JsonRequestBehavior.AllowGet);
                                    }
                                    //check file size
                                    FileInfo info = new FileInfo(values2[j]);
                                    long length = info.Length;
                                    //Convert to KB
                                    var finalfilelengthKb = length / 1024;
                                    if (finalfilelengthKb > 20480)
                                    {
                                        try
                                        {
                                            System.IO.File.Delete(values2[j]);
                                        }
                                        catch
                                        {
                                        }
                                        return Json(new { Result = "FileSizeExceed" }, JsonRequestBehavior.AllowGet);
                                    }
                                    fileName = ReplaceSpecialChar(fileName);
                                    var fileName1 = fileName + "_" + DateTime.Now.Ticks + fileext;
                                    var filePath = folderPath + Path.GetFileName(fileName1); //HttpContext.Current.Server.MapPath(+ postedFile.FileName);
                                    System.IO.File.Copy(values2[j], filePath, true);
                                    path = WebConfigurationManager.AppSettings["SiteUrl"] + filePath.Substring(filePath.IndexOf(WebConfigurationManager.AppSettings["Comparepath"].ToString().Replace("/", "\\"))).Replace("\\", "/");
                                }
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                    }
                }
            }
            return Json(new { Result = path }, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Upload file
        /// </summary>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost, ValidateInput(false)]
        [AuthLog(Roles = "Firm,User,Client")]
        public JsonResult UploadFile1()
        {
            var path = "";
            using (LawPracticeEntities db = new LawPracticeEntities())
            {
                using (var transaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var parentid = "";
                        string folderPath = "";
                        string folderpathazure = "";
                        parentid = Guid.Empty.ToString();
                        folderPath = savedpath();
                        var httpRequest = System.Web.HttpContext.Current.Request;
                        if (Convert.ToInt32(httpRequest.Files.Count) == 0)
                        {
                            return Json(new { Result = "NoFileAttach" }, JsonRequestBehavior.AllowGet);
                        }
                        if (httpRequest.Files.Count > 0)
                        {
                            var docfiles = new List<string>();
                            //Check whether Directory (Folder) exists.
                            for (int i = 0; i < httpRequest.Files.Count; i++)
                            {
                                var postedFile = httpRequest.Files[i];
                                var fileName = Path.GetFileNameWithoutExtension(postedFile.FileName);
                                var fileext = Path.GetExtension(postedFile.FileName);
                                fileName = ReplaceSpecialChar(fileName);
                                var fileName1 = fileName + "_" + DateTime.Now.Ticks + fileext;
                                var filePath = folderPath + Path.GetFileName(fileName1); //HttpContext.Current.Server.MapPath(+ postedFile.FileName);
                                var fileextchk = Path.GetExtension(postedFile.FileName);
                                var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);
                                postedFile.SaveAs(filePath);
                                path = WebConfigurationManager.AppSettings["SiteUrl"] + filePath.Substring(filePath.IndexOf(WebConfigurationManager.AppSettings["Comparepath"].ToString().Replace("/", "\\"))).Replace("\\", "/");
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                    }
                }
            }
            return Json(new { Result = path }, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Upload file
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost, ValidateInput(false)]
        public JsonResult UploadFile2()
        {
            var path = "";
            using (LawPracticeEntities db = new LawPracticeEntities())
            {
                using (var transaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var parentid = "";
                        string folderPath = "";
                        string folderpathazure = "";
                        parentid = Guid.Empty.ToString();
                        folderPath = System.Web.HttpContext.Current.Server.MapPath(WebConfigurationManager.AppSettings["Comparepath"] + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/");
                        var httpRequest = System.Web.HttpContext.Current.Request;
                        if (Convert.ToInt32(httpRequest.Files.Count) == 0)
                        {
                            return Json(new { Result = "NoFileAttach" }, JsonRequestBehavior.AllowGet);
                        }
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
                                fileName = ReplaceSpecialChar(fileName);
                                var fileName1 = fileName + "_" + DateTime.Now.Ticks + fileext;
                                var filePath = folderPath + Path.GetFileName(fileName1); //HttpContext.Current.Server.MapPath(+ postedFile.FileName);
                                var fileextchk = Path.GetExtension(postedFile.FileName);
                                var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);
                                postedFile.SaveAs(filePath);
                                // path = filePath;
                                path = WebConfigurationManager.AppSettings["SiteUrl"] + filePath.Substring(filePath.IndexOf(WebConfigurationManager.AppSettings["Comparepath"].ToString().Replace("/", "\\"))).Replace("\\", "/");
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                    }
                }
            }
            return Json(new { Result = path }, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Check file locked or not
        /// </summary>
        /// <param name="file"></param>
        /// <returns></returns>
        protected virtual bool IsFileLocked(FileInfo file)
        {
            FileStream stream = null;
            try
            {
                stream = file.Open(FileMode.Open, FileAccess.ReadWrite, FileShare.None);
            }
            catch (IOException)
            {
                //the file is unavailable because it is:
                //still being written to
                //or being processed by another thread
                //or does not exist (has already been processed)
                return true;
            }
            finally
            {
                if (stream != null)
                    stream.Close();
            }
            //file is not locked
            return false;
        }
        /// <summary>
        /// Remove browse document file
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public JsonResult RemoveBrowseDocumentfile()
        {
            string strfilepath1 = QueryAES.UrlDecode(Request.Form["filepath1"]);
            string strfilepath2 = QueryAES.UrlDecode(Request.Form["filepath2"]);
            strfilepath1 = strfilepath1.Substring(strfilepath1.IndexOf(WebConfigurationManager.AppSettings["Comparepath"].ToString().Replace("\\", "/")));
            strfilepath2 = strfilepath2.Substring(strfilepath2.IndexOf(WebConfigurationManager.AppSettings["Comparepath"].ToString().Replace("\\", "/")));
            try
            {
                System.IO.File.Delete(Server.MapPath(strfilepath1));
            }
            catch (Exception er)
            {
                return Json(new { Result = "failed" }, JsonRequestBehavior.AllowGet);
            }
            return Json(new { Result = "success" }, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Compare document list
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [AuthLog(Roles = "Firm,User,Client")]
        public JsonResult CompareDocumentList()
        {
            string name = QueryAES.UrlDecode(Request.Form["name"]);
            string frmdate = QueryAES.UrlDecode(Request.Form["datefrom"]);
            string todate = QueryAES.UrlDecode(Request.Form["dateto"]);
            string pagenum = QueryAES.UrlDecode(Request.Form["pagenum"]);
            string pagesize = QueryAES.UrlDecode(Request.Form["pagesize"]);
            string firmid = Session["sessionfirmid"].ToString();
            string userid = Session["sessionuserid"].ToString();
            List<usp_CompareDocsList1_Result> list = new List<usp_CompareDocsList1_Result>();
            using (LawPracticeEntities db = new LawPracticeEntities())
            {
                list = db.usp_CompareDocsList1(firmid, userid, frmdate, todate, name, Convert.ToInt32(pagenum), Convert.ToInt32(pagesize)).ToList();
                return Json(list);
            }
        }
        /// <summary>
        /// Check document quata
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [AuthLog(Roles = "Firm,User,Client")]
        public JsonResult CompareDocQuota()
        {
            string firmid = Session["sessionfirmid"].ToString();
            List<sp_CompareDocQuota_Result> list = new List<sp_CompareDocQuota_Result>();
            using (LawPracticeEntities db = new LawPracticeEntities())
            {
                list = db.sp_CompareDocQuota(firmid).ToList();
                return Json(list);
            }
        }
        /// <summary>
        /// Remove special character
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        protected string ReplaceSpecialChar(string input)
        {
            string[] replaceables = new[] { @"\", "|", "+", "$", "!", "#", "%", "&", "/", "=", "?", "»", "«", "@", "£", "§", "€", "{", "}", ";", "'", "<", ">", ",", "`", " " };
            string rxString = string.Join("|", replaceables.Select(s => Regex.Escape(s)));
            return Regex.Replace(input, rxString, "_");
        }
        /// <summary>
        /// Remove compare document
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [AuthLog(Roles = "Firm,User,Client")]
        public string RemoveCompareDoc()
        {
            string firmid = Convert.ToString(Session["sessionfirmid"]);
            string userid = Convert.ToString(Session["sessionuserid"]);
            string uCGuid = Convert.ToString(QueryAES.UrlDecode(Request.Form["uCGuid"]));
            int isdelete = 1;
            using (LawPracticeEntities db = new LawPracticeEntities())
            {
                var effectedrows = db.usp_DeleteCompareDocs(firmid, userid, uCGuid, isdelete);
                if (effectedrows > 0)
                {
                    return "Success";
                }
                else
                {
                    return "error";
                }
            }
        }
    }
}