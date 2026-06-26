using BussinessLogic;
using LawPracticeFirm.Common;
using LawPracticeFirm.CustomFIlter;
using LawPracticeFirm.Models;
using Newtonsoft.Json;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Net;
using System.Text;
using System.Web.Mvc;

namespace LawPracticeFirm.Controllers
{
    public class GoogleDriveController : BaseFirmController
    {
        /// <summary>
        /// Google Drive view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult Index()
        {
            return View();
        }
        /// <summary>
        /// Authorize user view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult authorize()
        {
            return View();
        }
        /// <summary>
        /// File list details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult Filelist()
        {
            ViewBag.filesize = ConfigurationManager.AppSettings["filesize"];
            String FolderPath = Server.MapPath("~/");
            String FilePath = Path.Combine(FolderPath + "\\GDriveTokens\\" + LoggedInUser.FirmId.ToString() + "\\" + LoggedInUser.UserId.ToString() + "\\Credentials.json", "Google.Apis.Auth.OAuth2.Responses.TokenResponse-"+ HttpContext.Session.SessionID.ToString());
            if (System.IO.File.Exists(FilePath))
            {
                var folderid = QueryAES.UrlDecode(Request.QueryString["ftoken"]);
                var data = GoogleDriveAPIHelper.GetDriveFiles(folderid,LoggedInUser.UserId.ToString());
                ViewBag.filelist = data;
                return View();
            }
            else
            {
                var urlsgement = Session["firmcode"];
                return Redirect("~/" + urlsgement + "/GoogleDrive/index");
            }
        }
        private class WebClient : System.Net.WebClient
        {
            public int Timeout { get; set; }
            protected override WebRequest GetWebRequest(Uri uri)
            {
                WebRequest lWebRequest = base.GetWebRequest(uri);
                lWebRequest.Timeout = Timeout;
                ((HttpWebRequest)lWebRequest).ReadWriteTimeout = Timeout;
                return lWebRequest;
            }
        }
        public static string[] Scopes = { Google.Apis.Drive.v2.DriveService.Scope.Drive };
        public static string GetAuthorizationUrl(string data)
        {
            string ClientId = ConfigurationManager.AppSettings["GoogleDriveClientId"];
            string Scopes = "https://www.googleapis.com/auth/drive";
            //get this value by opening your web app in browser.    
            string RedirectUrl = ConfigurationManager.AppSettings["GoogleDriveCallBackURL"];
            string Url = "https://accounts.google.com/o/oauth2/auth?";
            StringBuilder UrlBuilder = new StringBuilder(Url);
            UrlBuilder.Append("client_id=" + ClientId);
            UrlBuilder.Append("&redirect_uri=" + RedirectUrl);
            UrlBuilder.Append("&response_type=" + "code");
            UrlBuilder.Append("&scope=" + Scopes);
            UrlBuilder.Append("&access_type=" + "offline");
            UrlBuilder.Append("&state=" + data); //setting the user id in state  
            return UrlBuilder.ToString();
        }
        public class Token
        {
            public string access_token
            {
                get;
                set;
            }
            public string token_type
            {
                get;
                set;
            }
            public string expires_in
            {
                get;
                set;
            }
            public string refresh_token
            {
                get;
                set;
            }
            public string scope
            {
                get;
                set;
            }
            public string Issued
            {
                get;
                set;
            }
            public string IssuedUtc
            {
                get;
                set;
            }
        }
        /// <summary>
        /// Exchange authorization code
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="code"></param>
        /// <param name="accessToken"></param>
        /// <returns></returns>
        private string ExchangeAuthorizationCode(int userId, string code, out string accessToken)
        {
            accessToken = string.Empty;
            string ClientSecret = ConfigurationManager.AppSettings["GoogleDriveClientSecret"];
            string ClientId = ConfigurationManager.AppSettings["GoogleDriveClientId"];
            //get this value by opening your web app in browser.    
            string RedirectUrl = ConfigurationManager.AppSettings["GoogleDriveCallBackURL"];
            var Content = "code=" + code + "&client_id=" + ClientId + "&client_secret=" + ClientSecret + "&redirect_uri=" + RedirectUrl + "&grant_type=authorization_code";
            LogService("Content" + RedirectUrl);
            LogService("Content" + Content);
            var request = WebRequest.Create("https://accounts.google.com/o/oauth2/token");
            request.Method = "POST";
            byte[] byteArray = Encoding.UTF8.GetBytes(Content);
            request.ContentType = "application/x-www-form-urlencoded";
            request.ContentLength = byteArray.Length;
            using (Stream dataStream = request.GetRequestStream())
            {
                dataStream.Write(byteArray, 0, byteArray.Length);
                dataStream.Close();
            }
            var Response = (HttpWebResponse)request.GetResponse();
            Stream responseDataStream = Response.GetResponseStream();
            StreamReader reader = new StreamReader(responseDataStream);
            string ResponseData = reader.ReadToEnd();
            reader.Close();
            responseDataStream.Close();
            Response.Close();
            if (Response.StatusCode == HttpStatusCode.OK)
            {
                var ReturnedToken = JsonConvert.DeserializeObject<Token>(ResponseData);
                Token ts = new Token();
                ts.access_token = ReturnedToken.access_token;
                ts.token_type = ReturnedToken.token_type;
                ts.expires_in = ReturnedToken.expires_in;
                ts.refresh_token = ReturnedToken.refresh_token;
                ts.scope = ReturnedToken.scope;
                ts.Issued = DateTime.Now.ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fff+05:30");
                ts.IssuedUtc = DateTime.UtcNow.ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fffK");
                string output = JsonConvert.SerializeObject(ts);
                if (ReturnedToken.access_token != null)
                {
                    accessToken = ReturnedToken.access_token;
                    Session["GDRefresh_token"] = ReturnedToken.refresh_token;
                    String FolderPath = HttpContext.Server.MapPath("~/");
                    String FilePath = Path.Combine(FolderPath + "\\GDriveTokens\\" + LoggedInUser.FirmId.ToString() + "\\" + LoggedInUser.UserId.ToString(), "Credentials.json");
                    var templogpath = HttpContext.Server.MapPath("/GDriveTokens/" + LoggedInUser.FirmId.ToString() + "/" + LoggedInUser.UserId.ToString() + "/Credentials.json");
                    if (!Directory.Exists(templogpath))
                    {
                        Directory.CreateDirectory(templogpath);
                    }
                    FileStream fs = new FileStream(templogpath + "//Google.Apis.Auth.OAuth2.Responses.TokenResponse-"+ HttpContext.Session.SessionID.ToString(), FileMode.OpenOrCreate, FileAccess.Write);
                    fs.SetLength(0);
                    StreamWriter sw = new StreamWriter(fs);
                    sw.BaseStream.Seek(0, SeekOrigin.End);
                    sw.WriteLine(output);
                    sw.Flush();
                    sw.Close();
                    return ReturnedToken.access_token;
                }
                else
                {
                    return null;
                }
            }
            else
            {
                return string.Empty;
            }
        }
        /// <summary>
        /// Get refresh token
        /// </summary>
        /// <param name="refreshToken"></param>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public  string GetAccessToken(string refreshToken)
        {
            string ClientSecret = ConfigurationManager.AppSettings["GoogleDriveClientSecret"];
            string ClientId = ConfigurationManager.AppSettings["GoogleDriveClientId"];
            var Content = "refresh_token=" + refreshToken + "&client_id=" + ClientId + "&client_secret=" + ClientSecret + "&grant_type=refresh_token";
            WebRequest request = WebRequest.Create("https://accounts.google.com/o/oauth2/token");
            request.Method = "POST";
            byte[] byteArray = Encoding.UTF8.GetBytes(Content);
            request.ContentType = "application/x-www-form-urlencoded";
            request.ContentLength = byteArray.Length;
            using (Stream dataStream = request.GetRequestStream())
            {
                dataStream.Write(byteArray, 0, byteArray.Length);
                dataStream.Close();
            }
            var Response = (HttpWebResponse)request.GetResponse();
            Stream responseDataStream = Response.GetResponseStream();
            StreamReader reader = new StreamReader(responseDataStream);
            string ResponseData = reader.ReadToEnd();
            reader.Close();
            responseDataStream.Close();
            Response.Close();
            if (Response.StatusCode == HttpStatusCode.OK)
            {
                var ReturnedToken = JsonConvert.DeserializeObject<Token>(ResponseData);
                Token ts = new Token();
                ts.access_token = ReturnedToken.access_token;
                ts.token_type = ReturnedToken.token_type;
                ts.expires_in = ReturnedToken.expires_in;
                ts.refresh_token = refreshToken;
                ts.scope = ReturnedToken.scope;
                ts.Issued = DateTime.Now.ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fff+05:30");
                ts.IssuedUtc = DateTime.UtcNow.ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fffK");
                string output = JsonConvert.SerializeObject(ts);
                var templogpath = HttpContext.Server.MapPath("/GDriveTokens/" + LoggedInUser.FirmId.ToString() + "/" + LoggedInUser.UserId.ToString() + "/Credentials.json");
                if (!Directory.Exists(templogpath))
                {
                    Directory.CreateDirectory(templogpath);
                }
                FileStream fs = new FileStream(templogpath + "//Google.Apis.Auth.OAuth2.Responses.TokenResponse-" + HttpContext.Session.SessionID.ToString(), FileMode.OpenOrCreate, FileAccess.Write);
                fs.SetLength(0);
                StreamWriter sw = new StreamWriter(fs);
                sw.BaseStream.Seek(0, SeekOrigin.End);
                sw.WriteLine(output);
                sw.Flush();
                sw.Close();
                return ReturnedToken.access_token;
            }
            else
            {
                return string.Empty;
            }
        }
        /// <summary>
        /// Google call back
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult  GoogleCallBack()
        {
            var urlsgement = Session["firmcode"];
            try
            {
                string Code = QueryAES.UrlDecode(Request.QueryString["code"]);
                string Error = QueryAES.UrlDecode(Request.QueryString["error"]);
                if (Error != null) { }
                else if (Code != null)
                {
                    //Remember, we have set userid in State    
                    string UserId = QueryAES.UrlDecode(Request.QueryString["state"]);
                    //Get AccessToken    
                    int Id = Convert.ToInt32(UserId);
                    string AccessToken = string.Empty;
                    LogService("GDRefresh_token"+ Session["GDRefresh_token"]);
                    if (Session["GDRefresh_token"] == null)
                    {
                        LogService("noitnull");
                        string RefreshToken = ExchangeAuthorizationCode(Id, Code, out AccessToken);
                        //saving refresh token in database    
                    }
                    else
                    {
                        LogService("null");
                        string Token = GetAccessToken(Session["GDRefresh_token"].ToString());
                    }
                    //Get Email Id of the authorized user    
                    //Redirect the user to Authorize.aspx with user id    
                    return Redirect("~/" + urlsgement + "/GoogleDrive/filelist");
                }
            }
            catch(Exception es)
            {
                LogService("GoogleDrive Error:"+ es.InnerException + "@" + es.StackTrace + "@" + es.Source + "@" + es.Message);
            }
            return Redirect("~/" + urlsgement + "/GoogleDrive/index");
        }
        /// <summary>
        /// Google drive connect
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult Connect()
        {
            try
            {
                string Url = GetAuthorizationUrl("1");
                //HttpContext.Response.Redirect(Url, false);
                // return Redirect("~/" + urlsgement + "/GoogleDrive/index");
                 //var service = GoogleDriveAPIHelper.GetService();
                var urlsgement = Session["firmcode"];
                return Redirect(Url);
            }
            catch(Exception er)
            {
                LogService("" + er.Message + er.StackTrace + er.InnerException);
                var urlsgement = Session["firmcode"];
                return Redirect("~/" + urlsgement + "/GoogleDrive/index");
            }
        }
        /// <summary>
        /// Service log
        /// </summary>
        /// <param name="content"></param>
        private void LogService(string content)
        {
            var templogpath = Server.MapPath("//");
            FileStream fs = new FileStream(templogpath + "//MyKasecslyncLog.txt", FileMode.OpenOrCreate, FileAccess.Write);
            StreamWriter sw = new StreamWriter(fs);
            sw.BaseStream.Seek(0, SeekOrigin.End);
            sw.WriteLine(content);
            sw.Flush();
            sw.Close();
        }
        /// <summary>
        /// Upload details
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [AuthLog(Roles = "Firm,User")]
        public string Upload()
        {
            string hiddenpath = QueryAES.UrlDecode(Request.Form["hiddenpath"]);
            dynamic postedFiledata = "";
            var details = "";
            var httpRequest = Request;
            if (httpRequest.Files.Count > 0)
            {
                var docfiles = new List<string>();
                string folderPath = Server.MapPath("/GoogleDriveFiles/");
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
                    var chkexist = GoogleDriveAPIHelper.CheckFileFolder(UploadfileName, hiddenpath, "file",LoggedInUser.UserId.ToString());
                    if (chkexist == true)
                    {
                        details = "exist";
                    }
                    else
                    {
                        GoogleDriveAPIHelper.uploadFile(filePath, hiddenpath,LoggedInUser.UserId.ToString());
                        details = "success";
                    }
                }
            }
            return details;
        }
        /// <summary>
        /// Create folder for google drive
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [AuthLog(Roles = "Firm,User")]
        public string CreateFolder()
        {
            string foldername = QueryAES.UrlDecode(Request.Form["foldername"]);
           string hiddenpath= QueryAES.UrlDecode(Request.Form["hiddenpath"]); 
            var details = "";
            var chkexist = GoogleDriveAPIHelper.CheckFileFolder(foldername, hiddenpath, "folder",LoggedInUser.UserId.ToString());
            if (chkexist == true)
            {
                details = "exist";
            }
            else
            {
                GoogleDriveAPIHelper.CreateDirectory(foldername, details, hiddenpath,LoggedInUser.UserId.ToString());
                details = "success";
            }
            return details;
        }
        [AuthLog(Roles = "Firm,User")]
        public ActionResult Disconnect()
        {
            String strResult;
            WebResponse objResponse;
            WebRequest objRequest = HttpWebRequest.Create("https://mail.google.com/mail/u/0/?logout&hl=en");
            objResponse = objRequest.GetResponse();
            using (StreamReader sr = new StreamReader(objResponse.GetResponseStream()))
            {
                strResult = sr.ReadToEnd();
                sr.Close();
            }
            String FolderPath = Server.MapPath("~/");
            String FilePath = Path.Combine(FolderPath + "\\GDriveTokens\\" + LoggedInUser.FirmId.ToString() + "\\" + LoggedInUser.UserId.ToString() ,"Credentials.json");
            try
            {
                System.IO.DirectoryInfo di = new DirectoryInfo(FilePath);
                foreach (FileInfo file in di.GetFiles())
                {
                    file.Delete();
                }
            }
            catch (Exception er)
            {
            }
            var urlsgement = Session["firmcode"];
            return View();
        }
    }
}