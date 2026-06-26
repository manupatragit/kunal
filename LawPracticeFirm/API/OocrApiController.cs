using BussinessLogic;
using DataAccess.Modals;
using LawPracticeFirm.Common;
using LawPracticeFirm.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using static LawPracticeFirm.Models.OCRResult;

namespace LawPracticeFirm.API
{
    public class OocrApiController : BaseFirmApiController
    {
        public string controllername = "OocrApiController";
        // GET api/<controller>
        public string ImagePath { get; set; }
        public string PdfPath { get; set; }

        /// <summary>
        /// Service log
        /// </summary>
        /// <param name="content"></param>
        private static void LogService(string content)
        {
            //var templogpath = HttpContext.Current.Server.MapPath("//");
            //FileStream fs = new FileStream(templogpath + "//ocrfile.txt", FileMode.OpenOrCreate, FileAccess.Write);
            //StreamWriter sw = new StreamWriter(fs);
            //sw.BaseStream.Seek(0, SeekOrigin.End);
            //sw.WriteLine(content);
            //sw.Flush();
            //sw.Close();
        }

        /// <summary>
        /// View User Groups Data
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public async Task<IHttpActionResult> ViewUserGroupsData()
        {
            int OCRCountValue = Convert.ToInt32(ConfigurationManager.AppSettings["OCRCountValue"]);
            var db = new LawPracticeEntities();
            try
            {
                var details = QueryAES.UrlDecode(HttpContext.Current.Request.Form["desc"]);
                var ocrlanguage = QueryAES.UrlDecode(HttpContext.Current.Request.Form["language"]);
                var chkSave = QueryAES.UrlDecode(HttpContext.Current.Request.Form["chkSave"]);
                var newfilename = "";
                var ocrcontent = "";
                string folderPath = HttpContext.Current.Server.MapPath("~/Documents/OcrDocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/");
                string folderpathazure = "Documents/OcrDocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                //Check whether Directory (Folder) exists.
                if (!Directory.Exists(folderPath))
                {
                    //If Directory (Folder) does not exists. Create it.
                    Directory.CreateDirectory(folderPath);
                }
                var httpRequest = HttpContext.Current.Request;
                string firmids = LoggedInUser.FirmId.ToString();
                string userids = LoggedInUser.UserId.ToString();
                if (chkSave == "true")
                {
                    var ocrcount = db.usp_GetCountTblOcrFile(firmids.ToString(), userids.ToString()).SingleOrDefault();
                    if (ocrcount >= OCRCountValue)
                    {
                        return Ok("Exceed");
                    }
                }
                //get total file count
                var savemykasefileid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["savemykasefileid"]);
                if (savemykasefileid.ToString() == "undefined")
                {
                    savemykasefileid = "";
                }
                if (String.IsNullOrEmpty(savemykasefileid) && Convert.ToInt32(httpRequest.Files.Count) == 0)
                {
                    return Ok("NoFileAttach");
                }
                if (!String.IsNullOrEmpty(savemykasefileid))
                {
                    savemykasefileid = savemykasefileid.TrimEnd(',').TrimStart(',');
                    string[] values = savemykasefileid.Split(',');
                    int dynamicattachlength = Convert.ToInt32(values.Length) + Convert.ToInt32(httpRequest.Files.Count);
                    if (dynamicattachlength > 1)
                    {
                        return Ok("FileAttachExceed");
                    }
                }
                if (httpRequest.Files.Count > 0)
                {
                    for (int i = 0; i < httpRequest.Files.Count; i++)
                    {
                        var docfiles = new List<string>();
                        var postedFile = httpRequest.Files[i];
                        float size = postedFile.ContentLength;
                        //checked if already esxist
                        string extension = Path.GetExtension(postedFile.FileName);
                        string pathName = Path.GetDirectoryName(postedFile.FileName);
                        string orignialfiles = "";
                        newfilename = postedFile.FileName;
                        orignialfiles = newfilename;
                        newfilename = Path.GetFileNameWithoutExtension(newfilename);
                        string originalfilename = newfilename;
                        newfilename = Regex.Replace(newfilename, @"[^0-9a-zA-Z]+", "");
                        string fileNameOnly = Path.Combine(pathName, newfilename);
                        int it = 0;
                        string newfilename1 = "AE2bdADSAA" + newfilename + extension;
                        newfilename = newfilename + extension;
                        string fileNameOnly1 = Path.Combine(pathName, originalfilename + extension);
                        var filePath = HttpContext.Current.Server.MapPath("~/Documents/OcrDocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/" + newfilename1);
                        var tempshowpath = "/Documents/OcrDocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/" + newfilename1;
                        var fileextchk = Path.GetExtension(postedFile.FileName);
                        var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);
                        postedFile.SaveAs(filePath);
                        string input = "";
                        if (chkSave == "true")
                        {
                            input = filePath;
                            string tempfilename = originalfilename + extension;
                            while (AzureDocument.fileexist(folderpathazure, orignialfiles, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()))
                            {
                                it += 1;
                                orignialfiles = string.Format("{0}({1}).{2}", originalfilename, it, extension.TrimStart('.').TrimEnd('.'));
                            }
                            string output = HttpContext.Current.Server.MapPath("~/Documents/OcrDocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/" + tempfilename);
                            QueryAES.FileEncrypt(input, output);
                            try
                            {
                                var status = AzureDocumentself.filecreateafteredit(output, folderpathazure, Path.GetFileName(orignialfiles), null, null);
                            }
                            catch (Exception er)
                            {
                                AzureDocumentself.CreateNestedDirectory(folderpathazure);
                                var status = AzureDocumentself.filecreateafteredit(output, folderpathazure, Path.GetFileName(orignialfiles), null, null);
                            }
                        }
                        if (extension == ".pdf")
                        {
                            var result = await Ocrcontent(filePath, ocrlanguage, extension);// open disscussed with @sudhakar sir 02dec2022
                            result = Regex.Replace(result, @"\r\n?|\n", "<br>");
                            LogService("step5");
                            if (chkSave == "true")
                            {
                                var effectedrow = Repository.Matter.saveocrfile(orignialfiles, Convert.ToString(result), details.ToString(), firmids.ToString(), userids.ToString());
                                var param = controllername + ">PostSaveOcrFiles>SaveOcrFiles>param=" + fileNameOnly1 + "@" + result + "@" + details + "@" + firmids + "@" + userids;
                                if (effectedrow != "")
                                {
                                    var data1 = JsonConvert.SerializeObject(ocrcontent);
                                    return Ok(new { result = result, filePath = tempshowpath });
                                }
                            }
                            else
                            {
                                LogService("step6");
                                LogService("ocrcontent" + JsonConvert.SerializeObject(ocrcontent));
                                var data1 = JsonConvert.SerializeObject(ocrcontent);
                                return Ok(new { result = result, filePath = tempshowpath });
                            }
                        }
                        else
                        {
                            var result = await Ocrcontent(filePath, ocrlanguage, extension);
                            result = Regex.Replace(result, @"\r\n?|\n", "<br>");
                            LogService("step4");
                            if (chkSave == "true")
                            {
                                var effectedrow = Repository.Matter.saveocrfile(orignialfiles, Convert.ToString(result), details.ToString(), firmids.ToString(), userids.ToString());
                                var param = controllername + ">PostSaveOcrFiles>SaveOcrFiles>param=" + fileNameOnly1 + "@" + result + "@" + details + "@" + firmids + "@" + userids;
                                if (effectedrow != "")
                                {
                                    var data1 = JsonConvert.SerializeObject(ocrcontent);
                                    return Ok(new { result = result, filePath = tempshowpath });
                                }
                            }
                            else
                            {
                                LogService("step5");
                                var data1 = JsonConvert.SerializeObject(ocrcontent);
                                LogService("JsonConvert.SerializeObject(ocrcontent)" + JsonConvert.SerializeObject(ocrcontent));
                                return Ok(new { result = result, filePath = tempshowpath });
                            }
                        }
                        // Init client
                        // You could also call GetOcrClient to use client without retry policy
                    }
                }
                if (!String.IsNullOrEmpty(savemykasefileid))
                {
                    //upload docuemnt from mykase server
                    try
                    {
                        var filelist = SaveMykaseDocument.SaveMykaseDocumentToOtherModule(savemykasefileid, "ocr", LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), "1");
                        if (!String.IsNullOrEmpty(filelist))
                        {
                            string[] values2 = filelist.Split('|');
                            for (int j = 0; j < values2.Length; j++)
                            {
                                //get file physical path
                                values2[j] = values2[j].Trim();
                                var filePath = values2[j];
                                string input = "";
                                string orignialfiles = "";
                                int it = 0;
                                orignialfiles = Path.GetFileNameWithoutExtension(values2[j]);
                                var extension = Path.GetExtension(values2[j]);
                                //check file extention
                                string[] stringArray = { ".JPG", ".JPEG", ".PNG", ".PDF" };
                                string value = extension.ToUpper();
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
                                    return Ok("ExtentionNotAllowed");
                                }
                                //check file size
                                FileInfo info = new FileInfo(filePath);
                                long length = info.Length;
                                //Convert to KB
                                var finalfilelengthKb = length / 1024;
                                if (finalfilelengthKb > 20480)
                                {
                                    try
                                    {
                                        File.Delete(filePath);
                                    }
                                    catch
                                    {
                                    }
                                    return Ok("FileSizeExceed");
                                }
                                var originalfilename = Path.GetFileName(values2[j]);
                                input = filePath;
                                var tempshowpath = "/Documents/OcrDocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/" + originalfilename;
                                if (chkSave == "true")
                                {
                                    while (AzureDocument.fileexist(folderpathazure, originalfilename, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()))
                                    {
                                        it += 1;
                                        originalfilename = string.Format("{0}({1}).{2}", orignialfiles, it, extension.TrimStart('.').TrimEnd('.'));
                                    }
                                    string tempfilename = "AE2bdADSAA" + orignialfiles + extension;
                                    string output = HttpContext.Current.Server.MapPath("~/Documents/OcrDocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/" + tempfilename);
                                    QueryAES.FileEncrypt(input, output);
                                    try
                                    {
                                        var status = AzureDocumentself.filecreateafteredit(output, folderpathazure, Path.GetFileName(originalfilename), null, null);
                                    }
                                    catch (Exception er)
                                    {
                                        AzureDocumentself.CreateNestedDirectory(folderpathazure);
                                        var status = AzureDocumentself.filecreateafteredit(output, folderpathazure, Path.GetFileName(originalfilename), null, null);
                                    }
                                }
                                if (extension == ".pdf")
                                {
                                    var result = await PreocessOCRAsync(filePath, ocrlanguage, extension);
                                    result = Regex.Replace(result, @"\r\n?|\n", "<br>");
                                    LogService("step5");
                                    if (chkSave == "true")
                                    {
                                        var effectedrow = Repository.Matter.saveocrfile(originalfilename, Convert.ToString(result), details.ToString(), firmids.ToString(), userids.ToString());
                                        var param = controllername + ">PostSaveOcrFiles>SaveOcrFiles>param=" + originalfilename + "@" + result + "@" + details + "@" + firmids + "@" + userids;
                                        if (effectedrow != "")
                                        {
                                            var data1 = JsonConvert.SerializeObject(ocrcontent);
                                            return Ok(new { result = result, filePath = tempshowpath });
                                        }
                                    }
                                    else
                                    {
                                        LogService("step6");
                                        LogService("ocrcontent" + JsonConvert.SerializeObject(ocrcontent));
                                        var data1 = JsonConvert.SerializeObject(ocrcontent);
                                        return Ok(new { result = result, filePath = tempshowpath });
                                    }
                                }
                                else
                                {
                                    var result = await PreocessOCRAsync(filePath, ocrlanguage, extension);
                                    result = Regex.Replace(result, @"\r\n?|\n", "<br>");
                                    LogService("step4");
                                    if (chkSave == "true")
                                    {
                                        var effectedrow = Repository.Matter.saveocrfile(originalfilename, Convert.ToString(result), details.ToString(), firmids.ToString(), userids.ToString());
                                        var param = controllername + ">PostSaveOcrFiles>SaveOcrFiles>param=" + originalfilename + "@" + result + "@" + details + "@" + firmids + "@" + userids;
                                        if (effectedrow != "")
                                        {
                                            var data1 = JsonConvert.SerializeObject(ocrcontent);
                                            return Ok(new { result = result, filePath = tempshowpath });
                                        }
                                    }
                                    else
                                    {
                                        LogService("step5");
                                        var data1 = JsonConvert.SerializeObject(ocrcontent);
                                        LogService("JsonConvert.SerializeObject(ocrcontent)" + JsonConvert.SerializeObject(ocrcontent));
                                        return Ok(new { result = result, filePath = tempshowpath });
                                    }
                                }
                            }
                        }
                    }
                    catch
                    {
                    }
                }
                return Ok();
            }
            catch (Exception ed)
            {
                return Ok(ed.TargetSite + "@" + ed.TargetSite + "@" + ed.Source + "@" + ed.HResult + "@" + ed.Message + "@" + ed.InnerException + "@" + ed.StackTrace);
            }
        }

        /// <summary>
        /// Get OCR content
        /// </summary>
        /// <param name="filepath"></param>
        /// <param name="langauagepack"></param>
        /// <param name="fileext"></param>
        /// <returns></returns>
        public static async Task<string> Ocrcontent(string filepath, string langauagepack, string fileext)
        {
            try
            {
                var OspaceOCRKey = ConfigurationManager.AppSettings["OspaceOCRKey"];
                var OspaceOCREngine = ConfigurationManager.AppSettings["OspaceOCREngine"];
                HttpClient httpClient = new HttpClient();
                httpClient.Timeout = new TimeSpan(1, 1, 1);
                MultipartFormDataContent form = new MultipartFormDataContent();
                form.Add(new StringContent(OspaceOCRKey), "apikey"); //Added api key in form data
                form.Add(new StringContent(langauagepack), "language");
                form.Add(new StringContent("true"), "scale");
                form.Add(new StringContent("true"), "istable");
                if (fileext.ToLower().ToString() == ".pdf")
                {
                    if (string.IsNullOrEmpty(filepath) == false)
                    {
                        byte[] imageData = File.ReadAllBytes(filepath);
                        form.Add(new ByteArrayContent(imageData, 0, imageData.Length), "PDF", "pdf.pdf");
                    }
                }
                else
                {
                    if (string.IsNullOrEmpty(filepath) == false)
                    {
                        byte[] imageData = File.ReadAllBytes(filepath);
                        form.Add(new ByteArrayContent(imageData, 0, imageData.Length), "image", "image.jpg");
                    }
                }
                HttpResponseMessage response = await httpClient.PostAsync(OspaceOCREngine, form);
                string strContent = await response.Content.ReadAsStringAsync();
                Rootobject ocrResult = JsonConvert.DeserializeObject<Rootobject>(strContent);
                var txtresult = "";
                if (ocrResult.IsErroredOnProcessing == true)
                {
                    return ocrResult.ErrorMessage.ToString();
                }
                if (ocrResult.OCRExitCode == 1)
                {
                    for (int i = 0; i < ocrResult.ParsedResults.Count(); i++)
                    {
                        txtresult = txtresult + ocrResult.ParsedResults[i].ParsedText;
                    }
                    return txtresult.ToString();
                }
                else
                {
                    return strContent.ToString();
                }
            }
            catch (Exception exception)
            {
                return exception.ToString();
            }
        }

        /// <summary>
        /// Process OCR Async
        /// </summary>
        /// <param name="filepath"></param>
        /// <param name="langauagepack"></param>
        /// <param name="fileext"></param>
        /// <returns></returns>
        public static async Task<string> PreocessOCRAsync(string filepath, string langauagepack, string fileext)
        {
            var token = ConfigurationManager.AppSettings["manuocrapitoken"];
            var filename = Path.GetFileName(filepath);
            var contentbytedata = File.ReadAllBytes(filepath);
            var contentbyte = Convert.ToBase64String(contentbytedata);
            var client = new HttpClient();
            string contentResult = "";
            if (filepath != null)
            {
                try
                {
                    var multiForm = new MultipartFormDataContent();
                    multiForm.Add(new StringContent(token), "token");
                    multiForm.Add(new StringContent(filename), "filename");
                    multiForm.Add(new StringContent(contentbyte), "contentbyte");
                    string AuthorityURL = ConfigurationManager.AppSettings["manuocrapi"];
                    LogService("AuthorityURL" + AuthorityURL);
                    LogService("multiForm" + multiForm);
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    using (HttpResponseMessage httpResponse = await client.PostAsync(AuthorityURL, multiForm))
                    {
                        contentResult = await httpResponse.Content.ReadAsStringAsync();
                    }
                    contentResult = contentResult.Replace("\\r", "").Replace("\\n", "");
                    if (contentResult != "timeout")
                    {
                        dynamic data = JObject.Parse(contentResult);
                        string status = data.status;
                        string Message = data.message;
                        string datavals = data.result;
                        contentResult = "";
                        contentResult = datavals;
                    }
                }
                catch (Exception ex)
                {
                }
            }
            return contentResult;
        }
    }
}