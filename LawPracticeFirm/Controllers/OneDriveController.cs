using BussinessLogic;
using LawPracticeFirm.Common;
using LawPracticeFirm.CustomFIlter;
using LawPracticeFirm.Models;
using Microsoft.Graph;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web.Configuration;
using System.Web.Mvc;

namespace LawPracticeFirm.Controllers
{
    [Serializable]
    public class OneDriveController : BaseFirmController
    {
        string appKey = WebConfigurationManager.AppSettings["OneDriveAppKey"];
        string appSecret = WebConfigurationManager.AppSettings["OneDriveAppSecret"];
        /// <summary>
        /// OneDrive view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult Index()
        {
            return View();
        }
        /// <summary>
        /// Connect microsoft online
        /// </summary>
        /// <returns></returns>
        public ActionResult connect()
        {
            var redirect1 = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id="+appKey+"&response_type=code&redirect_uri=" + RedirectUri + "&response_mode=query&scope=Files.ReadWrite.All&state=12345";
            return Redirect(redirect1.ToString());
        }
        private string RedirectUri
        {
            get
            {
                if (this.Request.Url.Host.ToLowerInvariant() == "localhost")
                {
                    return string.Format("https://{0}:{1}/OneDrive/Auth", this.Request.Url.Host, this.Request.Url.Port);
                }
                var builder = new UriBuilder(
                    Uri.UriSchemeHttps,
                    this.Request.Url.Host);
                builder.Path = "/OneDrive/Auth";
                return builder.ToString();
            }
        }
        /// <summary>
        /// Disconnect from online
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        [HttpPost]
        public ActionResult Disconnect()
        {
            Session["drivesessiontoken"] = string.Empty;
            var urlsgement = Session["firmcode"];
            return Redirect("~/" + urlsgement + "/OneDrive/index");
        }
        /// <summary>
        /// Upload file
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        [HttpPost]
        public async Task<string> UploadFile()
        {
            if (String.IsNullOrEmpty(Convert.ToString(Session["drivesessiontoken"])))
            {
                return "invalid token";
            }
            try
            {
                dynamic postedFiledata = "";
                var httpRequest = Request;
                if (httpRequest.Files.Count > 0)
                {
                    var docfiles = new List<string>();
                    string folderPath = Server.MapPath("/onedrive");
                    //Check whether Directory (Folder) exists.
                    if (!System.IO.Directory.Exists(folderPath))
                    {
                        //If Directory (Folder) does not exists. Create it.
                        System.IO.Directory.CreateDirectory(folderPath);
                    }
                    for (int i = 0; i < httpRequest.Files.Count; i++)
                    {
                        var postedFile = httpRequest.Files[i];
                        var UploadfileName = Path.GetFileName(postedFile.FileName);
                        string hiddenpath = QueryAES.UrlDecode(Request.Form["hiddenpath"]);
                        var filePath = folderPath + "\\" + Path.GetFileName(postedFile.FileName); //HttpContext.Current.Server.MapPath(+ postedFile.FileName);
                        var fileextchk = Path.GetExtension(postedFile.FileName);
                        var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);
                        postedFile.SaveAs(filePath);
                        using (var stream = new MemoryStream(System.IO.File.ReadAllBytes(filePath)))
                        {
                            var graphServiceClient = new GraphServiceClient(new DelegateAuthenticationProvider((requestMessage) =>
                            {
                                requestMessage
                                    .Headers
                                    .Authorization = new AuthenticationHeaderValue("bearer", Convert.ToString(Session["drivesessiontoken"]));
                                return Task.FromResult(0);
                            }));
                            if (String.IsNullOrEmpty(hiddenpath))
                            {
                                var items = await graphServiceClient.Me.Drive.Root.Children.Request().Filter($"name eq '" + postedFile.FileName + "'").GetAsync();
                                if (items.Count == 0)
                                {
                                    var result = await graphServiceClient.Me.Drive.Root.ItemWithPath(postedFile.FileName).Content.Request().PutAsync<DriveItem>(stream);
                                }
                                else
                                {
                                    //exist
                                }
                            }
                            else
                            {
                                var items = await graphServiceClient.Me.Drive.Root.Children.Request().Filter($"name eq '" + postedFile.FileName + "'").GetAsync();
                                if (items.Count == 0)
                                {
                                    var result = await graphServiceClient.Me.Drive.Items[hiddenpath].ItemWithPath(postedFile.FileName).Content.Request().PutAsync<DriveItem>(stream);
                                }
                                else
                                {
                                }
                            }
                            stream.Flush();
                            stream.Dispose();
                            stream.Close();
                        }
                        //delete file
                        try
                        {
                            System.IO.File.Delete(filePath);
                        }
                        catch (Exception er)
                        {
                        }
                    }
                }
            }
            catch(Exception er)
            {
                return er.Message.ToString();
            }
            return "true";
        }
        /// <summary>
        /// Createfole in oneDrive
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        [HttpPost]
        public async Task<string> CreateFolder()
        {
            try
            {
                if (String.IsNullOrEmpty(Convert.ToString(Session["drivesessiontoken"])))
                {
                    return "invalid token";
                }
                string foldername = QueryAES.UrlDecode(Request.Form["foldername"]);
                string hiddenpath = QueryAES.UrlDecode(Request.Form["hiddenfid"]);
                //checkexist
                var graphServiceClient = new GraphServiceClient(new DelegateAuthenticationProvider((requestMessage) =>
                {
                    requestMessage
                        .Headers
                        .Authorization = new AuthenticationHeaderValue("bearer", Convert.ToString(Session["drivesessiontoken"]));
                    return Task.FromResult(0);
                }));
                if (String.IsNullOrEmpty(hiddenpath))
                {
                    //check folder exist or not
                    var items = await graphServiceClient.Me.Drive.Root.Children.Request().Filter($"name eq '" + foldername + "'").GetAsync();
                    if (items.Count == 0)
                    {
                        var driveItem = new DriveItem
                        {
                            Name = foldername,
                            Folder = new Microsoft.Graph.Folder
                            {
                            },
                            AdditionalData = new Dictionary<string, object>()
                         {
                               {"@microsoft.graph.conflictBehavior","rename"}
                         }
                        };
                        var newFolder = await graphServiceClient.Me.Drive.Root.Children.Request().AddAsync(driveItem);
                        return "true";
                    }
                    else
                    {
                        return "exist";
                    }
                }
                else
                {
                    var items = await graphServiceClient.Me.Drive.Items[hiddenpath].Children.Request().Filter($"name eq '" + foldername + "'").GetAsync();
                    if (items.Count == 0)
                    {
                        var driveItem = new DriveItem
                        {
                            Name = foldername,
                            Folder = new Microsoft.Graph.Folder
                            {
                            },
                            AdditionalData = new Dictionary<string, object>()
                         {
                               {"@microsoft.graph.conflictBehavior","rename"}
                         }
                        };
                        var newFolder = await graphServiceClient.Me.Drive.Items[hiddenpath].Children.Request().AddAsync(driveItem);
                        return "true";
                    }
                    else
                    {
                        return "exist";
                    }
                }
            }
            catch (Exception ex)
            {
                return ex.Message.ToString();
            }
        }
        /// <summary>
        /// File list
        /// </summary>
        /// <param name="dtoken"></param>
        /// <param name="ftoken"></param>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public async Task<ActionResult> Filelist(string dtoken, string ftoken)
        {
            ViewBag.filesize = ConfigurationManager.AppSettings["filesize"];
            try
            {
                var accessToken = Session["drivesessiontoken"];
                if (String.IsNullOrEmpty(Convert.ToString(accessToken)))
                {
                    var urlsgement = Session["firmcode"];
                    return Redirect("~/" + urlsgement + "/OneDrive/index");
                }
                var graphServiceClient = new GraphServiceClient(new DelegateAuthenticationProvider((requestMessage) =>
                {
                    requestMessage
                        .Headers
                        .Authorization = new AuthenticationHeaderValue("bearer", accessToken.ToString());
                    return Task.FromResult(0);
                }));
                List<OneDriveFile> items = new List<OneDriveFile>();
                if (String.IsNullOrEmpty(ftoken))
                {// Get the files and folders in the current user's drive.
                    IDriveItemChildrenCollectionPage driveItems = await graphServiceClient.Me.Drive.Root.Children.Request().GetAsync();
                    string tempdownloadurl = "";
                    foreach (DriveItem fileOrFolder in driveItems)
                    {
                        ViewBag.dirpath = fileOrFolder.ParentReference.Path;
                        // Get file and folder properties.
                        string type = fileOrFolder.File?.ToString() ?? fileOrFolder.Folder?.ToString();
                        if (fileOrFolder.AdditionalData != null)
                        {
                            try
                            {
                                tempdownloadurl = fileOrFolder.AdditionalData["@microsoft.graph.downloadUrl"].ToString();
                            }
                            catch(Exception er)
                            {
                            }
                        }
                        items.Add(new OneDriveFile
                        {
                            Name = fileOrFolder.Name,
                            Id = fileOrFolder.Id,
                            Type = type?.Replace("Microsoft.Graph.", ""),
                            Create_date = fileOrFolder.CreatedDateTime.ToString(),
                            modify_date = fileOrFolder.LastModifiedDateTime.ToString(),
                            driveid = fileOrFolder.ParentReference.DriveId,
                            weburl = fileOrFolder.WebUrl,
                            size = fileOrFolder.Size.ToString(),
                            downloadurl = tempdownloadurl,
                            path = fileOrFolder.ParentReference.Path
                        });
                    }
                }
                else
                {
                    IDriveItemChildrenCollectionPage driveItems = await graphServiceClient.Me.Drive.Items[ftoken].Children.Request().GetAsync();
                    string tempdownloadurl = "";
                    foreach (DriveItem fileOrFolder in driveItems)
                    {
                        ViewBag.dirpath = fileOrFolder.ParentReference.Path;
                        // Get file and folder properties.
                        string type = fileOrFolder.File?.ToString() ?? fileOrFolder.Folder?.ToString();
                        if (fileOrFolder.AdditionalData != null)
                        {
                            try
                            {
                                tempdownloadurl = fileOrFolder.AdditionalData["@microsoft.graph.downloadUrl"].ToString();
                            }
                            catch (Exception er)
                            {
                            }
                        }
                        items.Add(new OneDriveFile
                        {
                            Name = fileOrFolder.Name,
                            Id = fileOrFolder.Id,
                            Type = type?.Replace("Microsoft.Graph.", ""),
                            Create_date = fileOrFolder.CreatedDateTime.ToString(),
                            modify_date = fileOrFolder.LastModifiedDateTime.ToString(),
                            driveid = fileOrFolder.ParentReference.DriveId,
                            weburl = fileOrFolder.WebUrl,
                            size = fileOrFolder.Size.ToString(),
                            downloadurl = tempdownloadurl,
                            path = fileOrFolder.ParentReference.Path
                        });
                    }
                }
                ViewBag.filelist = items;
            }
            catch(Exception er)
            {
                ViewBag.filelist = null;
            }
            return View();
        }
        /// <summary>
        /// Auhentication
        /// </summary>
        /// <param name="access_token"></param>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult Auth(string access_token)
        {
            try
            {
                var code = QueryAES.UrlDecode(Request.QueryString["code"]);
                var client = new HttpClient();
          var parameters = new Dictionary<string, string>
          {
          {"client_id", appKey},
          {"scope", "Files.ReadWrite.All"},
          {"code",code },
          {"redirect_uri",  RedirectUri}, //http://localhost:27592/Home/Authorize
          {"grant_type","authorization_code" },
          {"client_secret", appSecret}
           };
                var content = new FormUrlEncodedContent(parameters);
                var response = client.PostAsync("https://login.microsoftonline.com/common/oauth2/v2.0/token", content);
                var tokensJsonString = response.Result.Content.ReadAsStringAsync();
                dynamic data = JsonConvert.SerializeObject(tokensJsonString.Result);
                data = data.TrimStart('\"');
                data = data.TrimEnd('\"');
                data = data.Replace("\\", "");
              //  List<OneDriveToken> item = JsonConvert.DeserializeObject<List<OneDriveToken>>(data);
                JObject jObject = JObject.Parse(data);
                Session["drivesessiontoken"] = JsonConvert.SerializeObject(jObject["access_token"]);
                var urlsgement = Session["firmcode"];
                return Redirect("~/" + urlsgement + "/OneDrive/Filelist");
            }
            catch (Exception e)
            {
                var urlsgement = Session["firmcode"];
                return Redirect("~/" + urlsgement + "/OneDrive/index");
            }
        }
    }
}