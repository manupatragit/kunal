using BussinessLogic;
using Dropbox.Api;
using Dropbox.Api.Files;
using LawPracticeFirm.Common;
using LawPracticeFirm.CustomFIlter;
using LawPracticeFirm.Helpers;
using LawPracticeFirm.Models;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace LawPracticeFirm.Controllers
{
    [RequireHttpsOrXForwarded]
    public class DropboxController : BaseFirmController
    {
        /// <summary>
        /// Dropbox index view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult Index()
        {
            return View();
        }
        /// <summary>
        /// Call dropbox url
        /// </summary>
        /// <param name="url"></param>
        public void callurl(string url)
        {
            WebRequest request = HttpWebRequest.Create(url);
            WebResponse response = request.GetResponse();
            StreamReader reader = new StreamReader(response.GetResponseStream());
            string urlText = reader.ReadToEnd(); // it takes the response from your url. now you can use as your need  
            Response.Write(urlText.ToString());
        }
        /// <summary>
        /// Get file list details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public async Task<ActionResult> Filelist()
        {
            ViewBag.filesize = ConfigurationManager.AppSettings["filesize"];
            var sesiontoken = Session["sessiontoken"];
            string id = QueryAES.UrlDecode(Request.QueryString["id"]);
            using (var client = ModelHelpers.GetAuthenticatedClient(sesiontoken))
            {
                if (client == null)
                {
                    return RedirectToAction("index", "Dropbox");
                }
                var articles = await client.GetFilesList(id);
                ViewBag.filelist = articles;
                return View();
            }
        }
        /// <summary>
        /// Redirect uri
        /// </summary>
        private string RedirectUri
        {
            get
            {
                if (this.Request.Url.Host.ToLowerInvariant() == "localhost")
                {
                    return string.Format("https://{0}:{1}/Dropbox/Auth", this.Request.Url.Host, this.Request.Url.Port);
                }
                var builder = new UriBuilder(
                    Uri.UriSchemeHttps,
                    this.Request.Url.Host);
                builder.Path = "/Dropbox/Auth";
                return builder.ToString();
            }
        }
        /// <summary>
        /// Logout from dropbox, Disconnect
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        [HttpPost]
        public ActionResult Disconnect()
        {
            Session["sessiontoken"] = string.Empty;
            try
            {
                callurl("https://www.dropbox.com/logout");
            }
            catch
            {
            }
            return this.RedirectToAction("index", "dropbox");
        }
        /// <summary>
        /// Login from dropbox connected
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult Connect()
        {
            var newquserid = Guid.NewGuid().ToString("N");
            Session["sessiontoken"] = newquserid;
            var redirect = DropboxOAuth2Helper.GetAuthorizeUri(
                OAuthResponseType.Code,
                Application.AppKey,
                RedirectUri,
                newquserid);
            return Redirect(redirect.ToString());
        }
        /// <summary>
        /// Upload file
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        [HttpPost]
        public string UploadFile()
        {
            var sesiontoken = Session["sessiontoken"];
            using (var client = ModelHelpers.GetAuthenticatedClient(sesiontoken))
            {
                if (client == null)
                {
                    return "invalid token";
                }
            }
            dynamic postedFiledata = "";
            var httpRequest = Request;
            try
            {
                if (httpRequest.Files.Count > 0)
                {
                    var docfiles = new List<string>();
                    string folderPath = Server.MapPath("/dropbox");
                    //Check whether Directory (Folder) exists.
                    if (!Directory.Exists(folderPath))
                    {
                        //If Directory (Folder) does not exists. Create it.
                        Directory.CreateDirectory(folderPath);
                    }
                    for (int i = 0; i < httpRequest.Files.Count; i++)
                    {
                        var postedFile = httpRequest.Files[i];
                        var UploadfileName = Path.GetFileName(postedFile.FileName);
                        var paths = "";
                        string hiddenpath = QueryAES.UrlDecode(Request.Form["hiddenpath"]);
                        if (String.IsNullOrEmpty(hiddenpath))
                        {
                            paths = "/" + UploadfileName;
                        }
                        else
                        {
                            paths = hiddenpath + "/" + UploadfileName;
                        }
                        var filePath = folderPath + Path.GetFileName(postedFile.FileName); //HttpContext.Current.Server.MapPath(+ postedFile.FileName);
                        var fileextchk = Path.GetExtension(postedFile.FileName);
                        var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);
                        postedFile.SaveAs(filePath);
                        using (var stream = new MemoryStream(System.IO.File.ReadAllBytes(filePath)))
                        {
                            using (var client = ModelHelpers.GetAuthenticatedClient(sesiontoken))
                            {
                                var response = client.Files.UploadAsync(paths, WriteMode.Overwrite.Instance, body: stream);
                                var rest = response.Result; //Added to wait for the result from Async method  
                            }
                        }
                    }
                }
                return "true";
            }
            catch (Exception es)
            {
                return es.Message;
            }
        }
        /// <summary>
        /// Download file from dropbox
        /// </summary>
        /// <param name="filename"></param>
        /// <param name="folderpath"></param>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public async Task<String> Download(string filename, string folderpath)
        {
            var Isavlable = false;
            var sesiontoken = Session["sessiontoken"];
            using (var client = ModelHelpers.GetAuthenticatedClient(sesiontoken))
            {
                if (!String.IsNullOrEmpty(folderpath))
                {
                    folderpath = "/" + folderpath;
                }
                else
                {
                }
                try
                {
                    string basepath = Server.MapPath("/dropbox");
                    new System.IO.DirectoryInfo(basepath).Create();
                    string output = basepath + "\\" + filename;
                    using (var response = await client.Files.DownloadAsync(folderpath + "/" + filename))
                    {
                        using (var fileStream = new FileStream(output, FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.ReadWrite))
                        {
                            (await response.GetContentAsStreamAsync()).CopyTo(fileStream);
                            response.Dispose();
                        }
                    }
                    try
                    {
                        System.IO.FileInfo fileInfo = new System.IO.FileInfo(output);
                        var dfilename = fileInfo.Name;
                        if (fileInfo.Exists)
                        {
                            Response.Clear();
                            Response.AddHeader("Content-Disposition", "attachment;filename=\"" + dfilename + "\"");
                            Response.AddHeader("Content-Length", fileInfo.Length.ToString());
                            Response.ContentType = "application/octet-stream";
                            Response.TransmitFile(fileInfo.FullName);
                            Response.Flush();
                        }
                        else
                        {
                            throw new Exception("File not found");
                        }
                    }
                    catch (Exception ex)
                    {
                        Response.ContentType = "text/plain";
                    }
                    finally
                    {
                        if (System.IO.File.Exists(output))
                        {
                            FileStream streams = null;
                            FileInfo fileq = new FileInfo(output);
                            try
                            {
                                streams = fileq.Open(FileMode.Open, FileAccess.ReadWrite, FileShare.None);
                                Isavlable = true;
                            }
                            catch (IOException)
                            {
                                //the file is unavailable because it is:
                                //still being written to
                                //or being processed by another thread
                                //or does not exist (has already been processed)
                                Isavlable = false;
                            }
                            finally
                            {
                                if (streams != null)
                                    streams.Close();
                            }
                        }
                        else
                        {
                            Isavlable = true;
                        }
                        if (Isavlable == true)
                        {
                            System.IO.File.Delete(output);
                        }
                        Response.End();
                        Response.Flush();
                    }
                }
                catch (Exception er)
                {
                    filename = filename.Replace(" ", "%20");
                    string basepath = Server.MapPath("/dropbox");
                    new System.IO.DirectoryInfo(basepath).Create();
                    string output = basepath + "\\" + filename;
                    using (var response = await client.Files.DownloadAsync(folderpath + "/" + filename))
                    {
                        using (var fileStream = new FileStream(output, FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.ReadWrite))
                        {
                            (await response.GetContentAsStreamAsync()).CopyTo(fileStream);
                            response.Dispose();
                        }
                    }
                    try
                    {
                        System.IO.FileInfo fileInfo = new System.IO.FileInfo(output);
                        var dfilename = fileInfo.Name;
                        if (fileInfo.Exists)
                        {
                            Response.Clear();
                            Response.AddHeader("Content-Disposition", "attachment;filename=\"" + dfilename + "\"");
                            Response.AddHeader("Content-Length", fileInfo.Length.ToString());
                            Response.ContentType = "application/octet-stream";
                            Response.TransmitFile(fileInfo.FullName);
                            Response.Flush();
                        }
                        else
                        {
                            throw new Exception("File not found");
                        }
                    }
                    catch (Exception ex)
                    {
                        Response.ContentType = "text/plain";
                    }
                    finally
                    {
                        if (System.IO.File.Exists(output))
                        {
                            FileStream streams = null;
                            FileInfo fileq = new FileInfo(output);
                            try
                            {
                                streams = fileq.Open(FileMode.Open, FileAccess.ReadWrite, FileShare.None);
                                Isavlable = true;
                            }
                            catch (IOException)
                            {
                                //the file is unavailable because it is:
                                //still being written to
                                //or being processed by another thread
                                //or does not exist (has already been processed)
                                Isavlable = false;
                            }
                            finally
                            {
                                if (streams != null)
                                    streams.Close();
                            }
                        }
                        else
                        {
                            Isavlable = true;
                        }
                        if (Isavlable == true)
                        {
                            System.IO.File.Delete(output);
                        }
                        Response.End();
                        Response.Flush();
                    }
                }
                return "success";
            }
        }
        /// <summary>
        /// Authenticate dropbox connected user
        /// </summary>
        /// <param name="code"></param>
        /// <param name="state"></param>
        /// <returns></returns>
        public async Task<ActionResult> Auth(string code, string state)
        {
            try
            {
                var response = await DropboxOAuth2Helper.ProcessCodeFlowAsync(
                    code,
                    Application.AppKey,
                    Application.AppSecret,
                    this.RedirectUri);
                TokenAccess.DropboxAccessToken = response.AccessToken;
                Session["sessiontoken"] = response.AccessToken;
                var urlsgement = Session["firmcode"];
                return Redirect("~/" + urlsgement + "/Dropbox/Filelist");
            }
            catch (Exception e)
            {
                var message = string.Format(
                    "code: {0}\nAppKey: {1}\nAppSecret: {2}\nRedirectUri: {3}\nException : {4}",
                    code,
                    Application.AppKey,
                    Application.AppSecret,
                    this.RedirectUri,
                    e);
                var urlsgement = Session["firmcode"];
                return Redirect("~/" + urlsgement + "/Dropbox/index");
            }
        }
        /// <summary>
        /// Create new folder in dropbox
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        [HttpPost]
        public string CreateFolder()
        {
            try
            {
                var sesiontoken = Session["sessiontoken"];
                using (var client = ModelHelpers.GetAuthenticatedClient(sesiontoken))
                {
                    if (client == null)
                    {
                        return "invalid token";
                    }
                }
                string path = "";
                string paths = QueryAES.UrlDecode(Request.Form["foldername"]);
                string hiddenpath = QueryAES.UrlDecode(Request.Form["hiddenpath"]);
                if (String.IsNullOrEmpty(hiddenpath))
                {
                    path = "/" + paths;
                }
                else
                {
                    path = hiddenpath + "/" + paths;
                }
                var checkexist = FolderExists(path);
                if (checkexist == false)
                {
                    using (var client = ModelHelpers.GetAuthenticatedClient(sesiontoken))
                    {
                        var folderArg = new CreateFolderArg(path);
                        var folder = client.Files.CreateFolderAsync(folderArg);
                        var result = folder.Result;
                        return "true";
                    }
                }
                else
                {
                    return "exist";
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
        /// <summary>
        /// Check folder exist or not in dropbox
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
        public bool FolderExists(string path)
        {
            try
            {
                var sesiontoken = Session["sessiontoken"];
                using (var client = ModelHelpers.GetAuthenticatedClient(sesiontoken))
                {
                    var folders = client.Files.ListFolderAsync(path);
                    var result = folders.Result;
                    return true;
                }
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}