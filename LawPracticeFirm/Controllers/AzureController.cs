using BussinessLogic;
using DataAccess.Modals;
using LawPracticeFirm.Common;
using LawPracticeFirm.CustomFIlter;
using LawPracticeFirm.Models;
using Microsoft.Azure.Storage;
using Microsoft.Azure.Storage.Auth;
using Microsoft.Azure.Storage.File;
using Newtonsoft.Json;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web.Configuration;
using System.Web.Mvc;

namespace LawPracticeFirm.Controllers
{
    public class AzureController : BaseFirmController
    {
        string AzureStorageName = WebConfigurationManager.AppSettings["AzureStorageName"];
        string AzureStorageKey = WebConfigurationManager.AppSettings["AzureStorageKey"];
        string azureroot = "mykase";
        string azuredir = "CloudWorkSpace";
        string isdefault = "";

        /// <summary>
        /// Check azure string
        /// </summary>
        public void checkstring()
        {
            var db = new LawPracticeEntities();
            var data = db.usp_getazurestring(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).FirstOrDefault();
            if (data != null)
            {
                isdefault = data.IsDefault.ToString();
                if (isdefault == "1")
                {
                    var stname = data.StoageName;
                    if (!String.IsNullOrEmpty(stname))
                    {
                        stname = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(stname));
                        AzureStorageName = stname;
                    }
                    var stkey = data.StorageKey;
                    if (!String.IsNullOrEmpty(stkey))
                    {
                        stkey = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(stkey));
                        AzureStorageKey = stkey;
                    }
                }
                else
                {
                    AzureStorageName = WebConfigurationManager.AppSettings["AzureStorageName"];
                    AzureStorageKey = WebConfigurationManager.AppSettings["AzureStorageKey"];
                }
            }
            else
            {
                AzureStorageName = WebConfigurationManager.AppSettings["AzureStorageName"];
                AzureStorageKey = WebConfigurationManager.AppSettings["AzureStorageKey"];
            }
        }
        /// <summary>
        /// Validate case file
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public static bool validatercasefile(string name)
        {
            Regex rgx = new Regex(@"_matter_[0-9]{5}$");
            if (rgx.IsMatch(name) == false)
            {
                return false;
            }
            else
            {
                return true;
            }
        }
        /// <summary>
        /// Get cloud directory link list
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult DirectoryList()
        {
            try
            {
                checkstring();
                ViewBag.pagesize = System.Configuration.ConfigurationManager.AppSettings["pagesize"];
                var db = new LawPracticeEntities();
                string path = System.Web.HttpContext.Current.Server.MapPath("~/WorkSpace/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/Template");
                if (!(Directory.Exists(path)))
                {
                    Directory.CreateDirectory(path);
                }
                ViewBag.filesize = ConfigurationManager.AppSettings["filesize"];
                ViewBag.userId = LoggedInUser.UserId;
                ViewBag.firmid = LoggedInUser.FirmId;
                var fid = LoggedInUser.FirmId;
                var uid = LoggedInUser.UserId;
                var id = Request.Url.Segments[4];
                string tflag = "";
                var tempid = QueryAES.UrlDecode(Request.Form["token"]);
                tflag = QueryAES.UrlDecode(Request.Form["tflag"]);
                if (tempid == null)
                {
                    if (id != "0")
                    {
                        ViewBag.directoryid = "";
                        return RedirectToAction("Unauthorise", "home");
                    }
                    else
                    {
                        id = id;
                    }
                }
                else
                {
                    if (tempid == "0")
                    {
                        id = "0";
                    }
                    else
                    {
                        id = tempid;
                    }
                }
                string ids = id;
                ViewBag.directoryid = ids;
                if (ids == "0")
                {
                    id = "00000000-0000-0000-0000-000000000000";
                }
                string folderdirectid = id;
                List<usp_GetDirectoryLinkCloud_Result> list = new List<usp_GetDirectoryLinkCloud_Result>();
                list = db.usp_GetDirectoryLinkCloud(Guid.Parse(id)).ToList();
                foreach (var data in list.ToList())
                {
                    usp_GetDirectoryLinkCloud_Result newItem = new usp_GetDirectoryLinkCloud_Result();
                    if (!string.IsNullOrEmpty(data.CaseId))
                    {
                        var dirname = data.Name;
                        var ViewFolderName = "";
                        var resultvalid = validatercasefile(dirname);
                        if (resultvalid == true)
                        {
                            ViewFolderName = dirname.Substring(0, dirname.Length - 13);
                            ViewFolderName = ViewFolderName + "(Case)";
                        }
                        else
                        {
                            ViewFolderName = dirname;
                        }
                        newItem.Name = ViewFolderName;
                        list[list.IndexOf(data)].Name = newItem.Name;
                    }
                }
                ViewBag.DIRECTORYLINK = list;
                ViewBag.caseid = "";
                ViewBag.casename = "";
                var caseid = "";
                ViewBag.caseidNew = "";
                var ddetails = db.usp_CheckFilefolderCloud(LoggedInUser.FirmId.ToString(), folderdirectid.ToString()).FirstOrDefault();
                if (ddetails != null)
                {
                    caseid = ddetails.Caseid;
                    ViewBag.caseidNew = caseid;
                    var dname = db.usp_getcasename(LoggedInUser.FirmId.ToString(), caseid).FirstOrDefault();
                    if (ddetails.pfile == Guid.Empty && caseid != "")
                    {
                        ViewBag.caseid = caseid;
                    }
                    else
                    {
                        ViewBag.caseid = "";
                    }
                    ViewBag.casename = dname;
                    // get Notice Parent ID
                    ViewBag.NoticeParent = "";
                    try
                    {
                        if (ddetails.IsNoticeParent == 1)
                        {
                            var GetFirmNoticeParentID = db.usp_GetNoticeParentFolder(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), null, null, null).Select(x => x.Id).FirstOrDefault();
                            ViewBag.NoticeParent = GetFirmNoticeParentID;
                        }
                    }
                    catch (Exception ex)
                    {
                    }
                }
            }
            catch (Exception ex)
            {
            }
            if (LoggedInUser.RoleId == 2)
            {
                ViewBag.IsCreate = 0;
                ViewBag.IsEdit = 0;
                ViewBag.IsDelete = 0;
                ViewBag.export = 0;
                ViewBag.share = 0;
                ViewBag.enable = 0;
                var data = checkroles();
                // Split authors separated by a comma followed by space  
                string[] values = data.Split(',');
                for (int i = 0; i < values.Length; i++)
                {
                    if (i == 0)
                    {
                        ViewBag.IsCreate = values[i];
                    }
                    if (i == 1)
                    {
                        ViewBag.IsEdit = values[i];
                    }
                    if (i == 2)
                    {
                        ViewBag.IsDelete = values[i];
                    }
                    if (i == 3)
                    {
                        ViewBag.export = values[i];
                    }
                    if (i == 5)
                    {
                        ViewBag.share = values[i];
                    }
                    if (i == 6)
                    {
                        ViewBag.enable = values[i];
                    }
                }
            }
            return View();
        }

        /// <summary>
        /// Get azure directory list
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult AzureDirectoryList()
        {
            ViewBag.filesize = System.Configuration.ConfigurationManager.AppSettings["filesize"];
            return View();
        }

        /// <summary>
        /// Get file zise from app setting
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult Index()
        {
            ViewBag.filesize = System.Configuration.ConfigurationManager.AppSettings["filesize"];
            return View();
        }

        /// <summary>
        /// Get azure list
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [AuthLog(Roles = "Firm,User")]
        public JsonResult AzureList()
        {
            checkstring();
            var dpath = QueryAES.UrlDecode(QueryAES.UrlDecode(Request.Form["code"]));
            List<AzureOperations> items = new List<AzureOperations>();
            if (!String.IsNullOrEmpty(dpath))
            {
                var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
                var account = new CloudStorageAccount(cred, true);
                var client = account.CreateCloudFileClient();
                var share = client.GetShareReference(azureroot);
                share.CreateIfNotExists();
                var cloudFileDirectory1 = share.GetRootDirectoryReference();
                // Create a reference to the Azure path
                var nestedFolderStructure = dpath;
                var delimiter = new char[] { '/' };
                var nestedFolderArray = nestedFolderStructure.Split(delimiter);
                for (var i = 0; i < nestedFolderArray.Length; i++)
                {
                    cloudFileDirectory1 = cloudFileDirectory1.GetDirectoryReference(nestedFolderArray[i]);
                    cloudFileDirectory1.CreateIfNotExists();
                }
                var cloudFileDirectory = share.GetRootDirectoryReference().GetDirectoryReference(dpath);
                //Create a reference to the filename that you will be uploading
                foreach (var itemdata in cloudFileDirectory.ListFilesAndDirectories())
                {
                    if (itemdata is CloudFile item)
                    {
                        String[] str = item.Uri.LocalPath.Split('/');
                        StringBuilder sc = new StringBuilder();
                        for (int i = 0; i < str.Count(); i++)
                        {
                            if (i > 1)
                            {
                                if (i == str.Count())
                                {
                                }
                                else if (i == str.Count() - 1)
                                {
                                }
                                else
                                {
                                    sc.Append(str[i]);
                                    sc.Append("/");
                                }
                            }
                        }
                        var fpath = sc.ToString().TrimEnd('/');
                        items.Add(new AzureOperations
                        {
                            srcPath = fpath,
                            destinationPath = item.Uri.ToString(),
                            blobName = item.Name,
                            FileFolder = true,
                        });
                    }
                    if (itemdata is CloudFileDirectory dir)
                    {
                        String[] str = dir.Uri.LocalPath.Split('/');
                        StringBuilder sc = new StringBuilder();
                        for (int i = 0; i < str.Count(); i++)
                        {
                            if (i > 1)
                            {
                                sc.Append(str[i]);
                                sc.Append("/");
                            }
                        }
                        var fpath = sc.ToString().TrimEnd('/');
                        items.Add(new AzureOperations
                        {
                            srcPath = fpath,
                            destinationPath = dir.Uri.ToString(),
                            blobName = dir.Name,
                            FileFolder = false,
                        });
                    }
                }
            }
            else
            {
                string azurerootuser = azuredir + "/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                dpath = azurerootuser + dpath;
                var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
                var account = new CloudStorageAccount(cred, true);
                var client = account.CreateCloudFileClient();
                var share = client.GetShareReference(azureroot);
                share.CreateIfNotExists();
                var cloudFileDirectory = share.GetRootDirectoryReference();
                cloudFileDirectory.CreateIfNotExists();
                var nestedFolderStructure = dpath;
                var delimiter = new char[] { '/' };
                var nestedFolderArray = nestedFolderStructure.Split(delimiter);
                for (var i = 0; i < nestedFolderArray.Length; i++)
                {
                    cloudFileDirectory = cloudFileDirectory.GetDirectoryReference(nestedFolderArray[i]);
                    cloudFileDirectory.CreateIfNotExists();
                }
                //Create a reference to the filename that you will be uploading
                foreach (var itemdata in cloudFileDirectory.ListFilesAndDirectories())
                {
                    if (itemdata is CloudFile item)
                    {
                        String[] str = item.Uri.LocalPath.Split('/');
                        StringBuilder sc = new StringBuilder();
                        for (int i = 0; i < str.Count(); i++)
                        {
                            if (i > 1)
                            {
                                if (i == str.Count())
                                {
                                }
                                else if (i == str.Count() - 1)
                                {
                                }
                                else
                                {
                                    sc.Append(str[i]);
                                    sc.Append("/");
                                }
                            }
                        }
                        var fpath = sc.ToString().TrimEnd('/');
                        items.Add(new AzureOperations
                        {
                            srcPath = fpath,
                            destinationPath = item.Uri.ToString(),
                            blobName = item.Name,
                            FileFolder = true,
                        });
                    }
                    if (itemdata is CloudFileDirectory dir)
                    {
                        String[] str = dir.Uri.LocalPath.Split('/');
                        StringBuilder sc = new StringBuilder();
                        for (int i = 0; i < str.Count(); i++)
                        {
                            if (i > 1)
                            {
                                sc.Append(str[i]);
                                sc.Append("/");
                            }
                        }
                        var fpath = sc.ToString().TrimEnd('/');
                        items.Add(new AzureOperations
                        {
                            srcPath = fpath,
                            destinationPath = dir.Uri.ToString(),
                            blobName = dir.Name,
                            FileFolder = false,
                        });
                    }
                }
            }
            return Json(items, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Create new folder in azure
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [AuthLog(Roles = "Firm,User")]
        public string createfolder()
        {
            checkstring();
            var dpath = QueryAES.UrlDecode(Request.Form["hiddenpath"]);
            var foldername = QueryAES.UrlDecode(Request.Form["foldername"]);
            var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
            var account = new CloudStorageAccount(cred, true);
            var client = account.CreateCloudFileClient();
            if (!String.IsNullOrEmpty(dpath))
            {
                foldername = dpath + "/" + foldername;
                var share = client.GetShareReference(azureroot);
                share.CreateIfNotExists();
                var cloudFileDirectory = share.GetRootDirectoryReference();
                //Specify the nested folder
                cloudFileDirectory = cloudFileDirectory.GetDirectoryReference(foldername);
                if (cloudFileDirectory.Exists())
                {
                    return "exist";
                }
                else
                {
                    cloudFileDirectory.CreateIfNotExists();
                }
            }
            else
            {
                string azurerootuser = azuredir + "/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                foldername = azurerootuser + "/" + foldername;
                var share = client.GetShareReference(azureroot);
                share.CreateIfNotExists();
                var cloudFileDirectory = share.GetRootDirectoryReference();
                //Specify the nested folder
                cloudFileDirectory = cloudFileDirectory.GetDirectoryReference(foldername);
                if (cloudFileDirectory.Exists())
                {
                    return "exist";
                }
                else
                {
                    cloudFileDirectory.CreateIfNotExists();
                }
            }
            return "success";
        }
        /// <summary>
        /// Upload image
        /// </summary>
        /// <param name="image"></param>
        /// <returns></returns>
        [HttpPost]
        [AuthLog(Roles = "Firm,User")]
        public string Upload(FormCollection image)
        {
            checkstring();
            var dpath = QueryAES.UrlDecode(Request.Form["hiddenpath"]);
            string fakepathin = "azuredirin/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
            string fakepathout = "azuredirout/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
            var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
            var account = new CloudStorageAccount(cred, true);
            var client = account.CreateCloudFileClient();
            if (!String.IsNullOrEmpty(dpath))
            {
                var httpRequest = Request;
                if (httpRequest.Files.Count > 0)
                {
                    var docfiles = new List<string>();
                    //Check whether Directory (Folder) exists.
                    for (int i = 0; i < httpRequest.Files.Count; i++)
                    {
                        var postedFile = httpRequest.Files[i];
                        //encrypt file
                        string input = Server.MapPath("~/" + fakepathin);
                        if (!(Directory.Exists(input)))
                        {
                            Directory.CreateDirectory(input);
                        }
                        var fileextchk = Path.GetExtension(postedFile.FileName);
                        var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);
                        postedFile.SaveAs(input + "\\" + postedFile.FileName);
                        input = input + "\\" + postedFile.FileName;
                        string output = Server.MapPath("~/" + fakepathout + "/" + postedFile.FileName);
                        QueryAES.FileEncrypt(input, output);
                        //delete file
                        try
                        {
                            System.IO.File.Delete(input);
                        }
                        catch (Exception ex)
                        {
                        }
                        CloudStorageAccount storageAccount = new CloudStorageAccount(cred, true);
                        // Create a reference to the file client.
                        CloudFileClient fileClient = storageAccount.CreateCloudFileClient();
                        var share = client.GetShareReference(azureroot);
                        // Create a reference to the Azure path
                        var cloudFileDirectory = share.GetRootDirectoryReference().GetDirectoryReference(dpath);
                        cloudFileDirectory.CreateIfNotExists();
                        //Create a reference to the filename that you will be uploading
                        CloudFile cloudFile = cloudFileDirectory.GetFileReference(postedFile.FileName);
                        //Open a stream from a local file.
                        //Upload the file to Azure.
                        if (cloudFile.Exists())
                        {
                            return "exist";
                        }
                        else
                        {
                            cloudFile.UploadFromFile(output);
                        }
                        try
                        {
                            System.IO.File.Delete(output);
                        }
                        catch (Exception ex)
                        {
                        }
                    }
                }
            }
            else
            {
                string azurerootuser = azuredir + "/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                dpath = azurerootuser + dpath;
                var httpRequest = Request;
                if (httpRequest.Files.Count > 0)
                {
                    var docfiles = new List<string>();
                    //Check whether Directory (Folder) exists.
                    for (int i = 0; i < httpRequest.Files.Count; i++)
                    {
                        var postedFile = httpRequest.Files[i];
                        string input = Server.MapPath("~/" + fakepathin);
                        if (!(Directory.Exists(input)))
                        {
                            Directory.CreateDirectory(input);
                        }
                        var fileextchk = Path.GetExtension(postedFile.FileName);
                        var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);
                        postedFile.SaveAs(input + "\\" + postedFile.FileName);
                        input = input + "\\" + postedFile.FileName;
                        string output = Server.MapPath("~/" + fakepathout);
                        if (!(Directory.Exists(output)))
                        {
                            Directory.CreateDirectory(output);
                        }
                        output = output + "\\" + postedFile.FileName;
                        QueryAES.FileEncrypt(input, output);
                        //delete file
                        try
                        {
                            System.IO.File.Delete(input);
                        }
                        catch (Exception ex)
                        {
                        }
                        CloudStorageAccount storageAccount = new CloudStorageAccount(cred, true);
                        // Create a reference to the file client.
                        CloudFileClient fileClient = storageAccount.CreateCloudFileClient();
                        var share = client.GetShareReference(azureroot);
                        // Create a reference to the Azure path
                        var cloudFileDirectory = share.GetRootDirectoryReference().GetDirectoryReference(dpath);
                        cloudFileDirectory.CreateIfNotExists();
                        //Create a reference to the filename that you will be uploading
                        CloudFile cloudFile = cloudFileDirectory.GetFileReference(postedFile.FileName);
                        //Open a stream from a local file.
                        //Upload the file to Azure.
                        if (cloudFile.Exists())
                        {
                            return "exist";
                        }
                        else
                        {
                            cloudFile.UploadFromFile(output);
                        }
                        try
                        {
                            System.IO.File.Delete(output);
                        }
                        catch (Exception ex)
                        {
                        }
                    }
                }
            }
            return "success";
        }

        /// <summary>
        /// Delete file from azure storage
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [AuthLog(Roles = "Firm,User")]
        public string DeleteFile()
        {
            checkstring();
            var dpath = QueryAES.UrlDecode(Request.Form["code"]);
            var Name = QueryAES.UrlDecode(Request.Form["Name"]);
            Uri uri = new Uri(Name);
            string filename = System.IO.Path.GetFileName(uri.LocalPath);
            if (String.IsNullOrEmpty(dpath))
            {
                string azurerootuser = azuredir + "/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                dpath = azurerootuser + dpath;
                var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
                var account = new CloudStorageAccount(cred, true);
                var client = account.CreateCloudFileClient();
                CloudStorageAccount storageAccount = new CloudStorageAccount(cred, true);
                // Create a reference to the file client.
                CloudFileClient fileClient = storageAccount.CreateCloudFileClient();
                var share = client.GetShareReference(azureroot);
                // Create a reference to the Azure path
                var cloudFileDirectory = share.GetRootDirectoryReference();
                //Create a reference to the filename that you will be uploading
                CloudFile cloudFile = cloudFileDirectory.GetFileReference(filename);
                cloudFile.Delete();
                //Open a stream from a local file.
                //Upload the file to Azure.
            }
            else
            {
                var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
                var account = new CloudStorageAccount(cred, true);
                var client = account.CreateCloudFileClient();
                CloudStorageAccount storageAccount = new CloudStorageAccount(cred, true);
                // Create a reference to the file client.
                CloudFileClient fileClient = storageAccount.CreateCloudFileClient();
                var share = client.GetShareReference(azureroot);
                // Create a reference to the Azure path
                var cloudFileDirectory = share.GetRootDirectoryReference().GetDirectoryReference(dpath);
                //Create a reference to the filename that you will be uploading
                CloudFile cloudFile = cloudFileDirectory.GetFileReference(filename);
                cloudFile.Delete();
            }
            return "success";
        }
        /// <summary>
        /// Delete folder from azure storage
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [AuthLog(Roles = "Firm,User")]
        public string DeleteFolder()
        {
            try
            {
                checkstring();
                var dpath = QueryAES.UrlDecode(Request.Form["code"]);
                var Name = QueryAES.UrlDecode(Request.Form["Name"]);
                Uri uri = new Uri(Name);
                string filename = System.IO.Path.GetFileName(uri.LocalPath);
                if (String.IsNullOrEmpty(dpath))
                {
                    string azurerootuser = azuredir + "/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                    dpath = azurerootuser + dpath;
                    var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
                    var account = new CloudStorageAccount(cred, true);
                    var client = account.CreateCloudFileClient();
                    CloudStorageAccount storageAccount = new CloudStorageAccount(cred, true);
                    // Create a reference to the file client.
                    CloudFileClient fileClient = storageAccount.CreateCloudFileClient();
                    var share = client.GetShareReference(azureroot);
                    // Create a reference to the Azure path
                    var cloudFileDirectory = share.GetRootDirectoryReference();
                    //Create a reference to the filename that you will be uploading
                    if (cloudFileDirectory.Exists())
                    {
                        cloudFileDirectory.Delete();
                    }
                    //Open a stream from a local file.
                    //Upload the file to Azure.
                }
                else
                {
                    var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
                    var account = new CloudStorageAccount(cred, true);
                    var client = account.CreateCloudFileClient();
                    CloudStorageAccount storageAccount = new CloudStorageAccount(cred, true);
                    // Create a reference to the file client.
                    CloudFileClient fileClient = storageAccount.CreateCloudFileClient();
                    var share = client.GetShareReference(azureroot);
                    // Create a reference to the Azure path
                    var cloudFileDirectory = share.GetRootDirectoryReference().GetDirectoryReference(dpath);
                    //Create a reference to the filename that you will be uploading
                    if (cloudFileDirectory.Exists())
                    {
                        cloudFileDirectory.Delete();
                    }
                }
                return "success";
            }
            catch (Exception er)
            {
                return er.Message;
            }
        }

        /// <summary>
        /// Download uploaded file
        /// </summary>
        [AuthLog(Roles = "Firm,User")]
        public void DownloadFile()
        {
            checkstring();
            string filename = QueryAES.UrlDecode(Request.QueryString["filename"]);
            string fakepathin = Server.MapPath("~/azuredirin/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId);
            string fakepathout = Server.MapPath("~/azuredirout/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId);
            var dpath = QueryAES.UrlDecode(Request.QueryString["code"]);
            if (!String.IsNullOrEmpty(dpath))
            {
                var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
                var account = new CloudStorageAccount(cred, true);
                var client = account.CreateCloudFileClient();
                var share = client.GetShareReference(azureroot);
                var cloudFileDirectory = share.GetRootDirectoryReference().GetDirectoryReference(dpath);
                CloudFile cloudFile = cloudFileDirectory.GetFileReference(filename);
                cloudFile.DownloadToFile(fakepathin + "\\" + filename, FileMode.Create);
            }
            else
            {
                string azurerootuser = azuredir + "/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                dpath = azurerootuser + dpath;
                var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
                var account = new CloudStorageAccount(cred, true);
                var client = account.CreateCloudFileClient();
                var share = client.GetShareReference(azureroot);
                var cloudFileDirectory = share.GetRootDirectoryReference();
                CloudFile cloudFile = cloudFileDirectory.GetFileReference(filename);
                cloudFile.DownloadToFile(fakepathin + "\\" + filename, FileMode.Create);
            }
            string input = fakepathin + "\\" + filename;
            string output = fakepathout + "\\" + filename;
            try
            {
                QueryAES.FileDecrypt(input, output);
            }
            catch (Exception err)
            {
            }
            System.IO.FileInfo fileInfo = new System.IO.FileInfo(output);
            var dfilename = fileInfo.Name;
            try
            {
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
                Response.Write(ex.Message);
            }
            finally
            {
                System.IO.File.Delete(input);
                System.IO.File.Delete(output);
                Response.End();
            }
        }
        /// <summary>
        /// Service log file
        /// </summary>
        /// <param name="content"></param>
        private void LogService(string content)
        {
            var templogpath = Server.MapPath("//");
            FileStream fs = new FileStream(templogpath + "//CloudMyKaseoffiecSyncLog.txt", FileMode.OpenOrCreate, FileAccess.Write);
            StreamWriter sw = new StreamWriter(fs);
            sw.BaseStream.Seek(0, SeekOrigin.End);
            sw.WriteLine(content);
            sw.Flush();
            sw.Close();
        }
        /// <summary>
        /// Get downloaded file
        /// </summary>
        [AuthLog(Roles = "Firm,User,Client")]
        public void GetDownloadFile()
        {
            checkstring();
            string filename = QueryAES.UrlDecode(Request.QueryString["filename"]);
            string token = QueryAES.UrlDecode(Request.QueryString["token"]);
            var db = new LawPracticeEntities();
            string fakepathin = Server.MapPath("~/azuredirin/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId);
            string fakepathout = Server.MapPath("~/azuredirout/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId);
            if (!Directory.Exists(fakepathin))
            {
                Directory.CreateDirectory(fakepathin);
            }
            if (!Directory.Exists(fakepathout))
            {
                Directory.CreateDirectory(fakepathout);
            }
            var dpath = QueryAES.UrlDecode(Request.QueryString["code"]);
            try
            {
                dpath = dpath.Replace(" ", "+");
                dpath = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(dpath));
            }
            catch (Exception ex)
            {
            }
            if (!String.IsNullOrEmpty(dpath))
            {
                LogService("dpath" + dpath);
                var dpathtemps = dpath.Replace("WorkSpace/", "LawPractice_ds/");
                LogService("dpathtemps" + dpathtemps);
                //check file in lawpractice_ds
                var chkfileexit = AzureDocument.fileexist(dpathtemps, filename, "", "");
                LogService("chkfileexit" + chkfileexit);
                if (chkfileexit == true)
                {
                    dpath = dpathtemps;
                }
                else
                {
                }
                LogService("finaldpath" + dpath);
                var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
                var account = new CloudStorageAccount(cred, true);
                var client = account.CreateCloudFileClient();
                var share = client.GetShareReference(azureroot);
                var cloudFileDirectory = share.GetRootDirectoryReference().GetDirectoryReference(dpath);
                CloudFile cloudFile = cloudFileDirectory.GetFileReference(filename);
                cloudFile.DownloadToFile(fakepathin + "\\" + filename, FileMode.Create);
            }
            else
            {
                string azurerootuser = azuredir + "/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                dpath = azurerootuser + dpath;
                var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
                var account = new CloudStorageAccount(cred, true);
                var client = account.CreateCloudFileClient();
                var share = client.GetShareReference(azureroot);
                var cloudFileDirectory = share.GetRootDirectoryReference();
                CloudFile cloudFile = cloudFileDirectory.GetFileReference(filename);
                cloudFile.DownloadToFile(fakepathin + "\\" + filename, FileMode.Create);
            }
            string input = fakepathin + "\\" + filename;
            string output = fakepathout + "\\" + filename;
            if (Path.GetExtension(input).ToLower() == ".zip")
            {
                output = input;
            }
            else
            {
                try
                {
                    QueryAES.FileDecrypt(input, output);
                }
                catch (Exception err)
                {
                }
            }
            System.IO.FileInfo fileInfo = new System.IO.FileInfo(output);
            var dfilename = fileInfo.Name;
            try
            {
                var getfiledetails = db.Usp_FileDetailsCloud(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), token).FirstOrDefault();
                string notification = LoggedInUser.UserFullName + " has downloaded " + dfilename + ".";
                db.usp_AddActivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), notification, "Download File", LoggedInUser.UserId.ToString(), getfiledetails.Id.ToString());
            }
            catch
            {
            }
            try
            {
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
                Response.Write(ex.Message);
            }
            finally
            {
                System.IO.File.Delete(input);
                System.IO.File.Delete(output);
                Response.End();
            }
        }
        /// <summary>
        /// Get final directory file path
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public string Dirfilepath()
        {
            checkstring();
            string filename = QueryAES.UrlDecode(Request.Form["filename"]);
            string fakepathin = Server.MapPath("~/azuredirin/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId);
            string fakepathout = Server.MapPath("~/azuredirout/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId);
            var dpath = QueryAES.UrlDecode(Request.Form["code"]);
            if (!String.IsNullOrEmpty(dpath))
            {
                var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
                var account = new CloudStorageAccount(cred, true);
                var client = account.CreateCloudFileClient();
                var share = client.GetShareReference(azureroot);
                var cloudFileDirectory = share.GetRootDirectoryReference().GetDirectoryReference(dpath);
                CloudFile cloudFile = cloudFileDirectory.GetFileReference(filename);
                cloudFile.DownloadToFile(fakepathin + "\\" + filename, FileMode.Create);
            }
            else
            {
                string azurerootuser = azuredir + "/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                dpath = azurerootuser + dpath;
                var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
                var account = new CloudStorageAccount(cred, true);
                var client = account.CreateCloudFileClient();
                var share = client.GetShareReference(azureroot);
                var cloudFileDirectory = share.GetRootDirectoryReference();
                CloudFile cloudFile = cloudFileDirectory.GetFileReference(filename);
                cloudFile.DownloadToFile(fakepathin + "\\" + filename, FileMode.Create);
            }
            string input = fakepathin + "\\" + filename;
            string output = fakepathout + "\\" + filename;
            try
            {
                QueryAES.FileDecrypt(input, output);
            }
            catch (Exception err)
            {
            }
            System.IO.FileInfo fileInfo = new System.IO.FileInfo(output);
            var dfilename = fileInfo.Name;
            var finalpath = "/azuredirout/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + '/' + dfilename;
            return finalpath;
        }

        /// <summary>
        /// Assign uploaded file permission
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        [System.Web.Mvc.HttpPost]
        public string AssignFilePermission()
        {
            checkstring();
            try
            {
                var db = new LawPracticeEntities();
                var did = QueryAES.UrlDecode(Request.Form["did"]);
                var filename = QueryAES.UrlDecode(Request.Form["filename"]);
                var user = QueryAES.UrlDecode(Request.Form["user"]);
                if (user == "")
                {
                    return "nouser";
                }
                else if (did != "")
                {
                    string id = did;
                    if (user != "")
                    {
                        var countvalue = db.usp_AssignAzureFile(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), user, did, filename);
                    }
                    return "1";
                }
                else
                {
                    return "nothing";
                }
            }
            catch (Exception ex)
            {
                return "";
            }
        }
        /// <summary>
        /// Check user assigned role
        /// </summary>
        /// <returns></returns>
        public string checkroles()
        {
            var urlsegment = Request.Url.Segments[3];
            urlsegment = urlsegment.Replace("/", "");
            var db = new LawPracticeEntities();
            var foutput = true;
            var frmids = Session["sessionfirmid"].ToString();
            var usrids = Session["sessionuserid"].ToString();
            int rlid = Convert.ToInt32(Session["sessionroleid"].ToString());
            var finalresult = "";
            if (urlsegment.ToLower() == "ViewKnowledge")
            {
                urlsegment = "ViewKnowledge/0";
            }
            if (urlsegment.ToLower() == "directorylist")
            {
                urlsegment = "directorylist/0";
            }
            int pageid = 0;
            var sflag = true;
            if (LoggedInUser.RoleId == 2)
            {
                var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString(urlsegment)).ToList();
                if (pagelist.Count > 0)
                {
                    foreach (var data in pagelist)
                    {
                        int pwrite = 0, pview = 0, pedit = 0, pdel = 0, pviewall = 0, peditall = 0;
                        pageid = Convert.ToInt32(data.ParentPage);
                        pwrite = Convert.ToInt32(data.Write);
                        pview = Convert.ToInt32(data.View);
                        pedit = Convert.ToInt32(data.Edit);
                        pdel = Convert.ToInt32(data.Delete);
                        pviewall = Convert.ToInt32(data.ViewAll);
                        peditall = Convert.ToInt32(data.EditAll);
                        dynamic pageaccesslist;
                        if (urlsegment == "caselist" || urlsegment == "NewCaseDashboard" || urlsegment == "Casedetails" || urlsegment == "EditCase" || urlsegment == "CreateCase")
                        {
                            pageaccesslist = db.usp_GetUserCaseModuleRights(frmids, usrids, usrids, pageid).ToList();
                        }
                        else
                        {
                            pageaccesslist = db.usp_GetUserModuleRights(frmids, usrids, usrids, pageid).ToList();
                        }
                        int write = 0, view = 0, edit = 0, del = 0, viewall = 0, editall = 0, share = 0, enable = 0, export = 0;
                        foreach (var access in pageaccesslist)
                        {
                            write = Convert.ToInt32(access.Write);
                            view = Convert.ToInt32(access.View);
                            edit = Convert.ToInt32(access.Edit);
                            del = Convert.ToInt32(access.Delete);
                            viewall = Convert.ToInt32(access.ViewAll);
                            editall = Convert.ToInt32(access.EditAll);
                            ViewBag.IsViewAll = viewall;
                            ViewBag.share = 0;
                            ViewBag.enable = 0;
                            ViewBag.export = 0;
                            try
                            {
                                ViewBag.share = access.Share;
                                ViewBag.enable = access.Enable;
                                ViewBag.export = access.Export;
                                ViewBag.Create = access.Share;
                            }
                            catch
                            {
                            }
                            if (viewall > 0 || editall > 0)
                            {
                                foutput = false;
                                ViewBag.IsDelete = del;
                                ViewBag.IsCreate = write;
                                ViewBag.IsEdit = edit;
                                if (write == 1)
                                {
                                    foutput = false;
                                }
                                if (pedit == 1)
                                {
                                    if (edit == 1 || editall == 1)
                                    {
                                        foutput = false;
                                    }
                                    else
                                    {
                                        foutput = true;
                                    }
                                }
                            }
                            else
                            {
                                // logic for write(create)
                                if (sflag == true)
                                {
                                    if (write > 0)
                                    {
                                        ViewBag.IsCreate = write;
                                        if (pwrite == write)
                                        {
                                            foutput = false;
                                            sflag = false;
                                        }
                                    }
                                    else
                                    {
                                        ViewBag.IsCreate = 0;
                                        foutput = true;
                                    }
                                }
                                //logic for view
                                if (sflag == true)
                                {
                                    if (view > 0)
                                    {
                                        if (pview == view)
                                        {
                                            foutput = false;
                                            sflag = false;
                                        }
                                    }
                                    else
                                    {
                                        foutput = true;
                                    }
                                }
                                //logic for edit(
                                if (sflag == true)
                                {
                                    if (edit > 0)
                                    {
                                        if (pedit == edit)
                                        {
                                            foutput = false;
                                            sflag = false;
                                            ViewBag.IsEdit = edit;
                                        }
                                    }
                                    else
                                    {
                                        foutput = true;
                                    }
                                }
                                //logic for delete
                                ViewBag.IsDelete = 0;
                                if (del > 0)
                                {
                                    ViewBag.IsDelete = 1;
                                }
                                else
                                {
                                    ViewBag.IsDeletes = 0;
                                }
                            }
                        }
                    }
                }
                finalresult = ViewBag.IsCreate + "," + ViewBag.IsEdit + "," + ViewBag.IsDelete + "," + ViewBag.export + "," + ViewBag.share + "," + ViewBag.enable;
            }
            return finalresult.ToString();
        }
        /// <summary>
        /// Assign user file list details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult AssignUserFileList()
        {
            ViewBag.pagesize = System.Configuration.ConfigurationManager.AppSettings["pagesize"];
            ViewBag.filesize = ConfigurationManager.AppSettings["filesize"];
            ViewBag.userId = LoggedInUser.UserId;
            ViewBag.firmid = LoggedInUser.FirmId;
            if (LoggedInUser.RoleId == 2)
            {
                ViewBag.IsCreate = 0;
                ViewBag.IsEdit = 0;
                ViewBag.IsDelete = 0;
                ViewBag.export = 0;
                ViewBag.share = 0;
                ViewBag.enable = 0;
                var data = checkroles();
                // Split authors separated by a comma followed by space  
                string[] values = data.Split(',');
                for (int i = 0; i < values.Length; i++)
                {
                    if (i == 0)
                    {
                        ViewBag.IsCreate = values[i];
                    }
                    if (i == 1)
                    {
                        ViewBag.IsEdit = values[i];
                    }
                    if (i == 2)
                    {
                        ViewBag.IsDelete = values[i];
                    }
                    if (i == 3)
                    {
                        ViewBag.export = values[i];
                    }
                    if (i == 5)
                    {
                        ViewBag.share = values[i];
                    }
                    if (i == 6)
                    {
                        ViewBag.enable = values[i];
                    }
                }
            }
            return View();
        }
        /// <summary>
        /// Revert assign file
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        [System.Web.Mvc.HttpPost]
        public string RevertAssignFile()
        {
            try
            {
                var ffid = QueryAES.UrlDecode(Request.Form["did"]);
                var auser = QueryAES.UrlDecode(Request.Form["auser"]);
                var db = new LawPracticeEntities();
                if (ffid != "")
                {
                    int data = db.RemoveAzureAssignFileUserList(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), auser, ffid);
                    return data.ToString();
                }
                else
                {
                    return "File Can not be Revert !";
                }
            }
            catch (Exception ex)
            {
                return "Object reference not set to an instance of an object.";
            }
        }

        /// <summary>
        /// Assign file per user list
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        [System.Web.Mvc.HttpPost]
        public string AssignFilePerUserList()
        {
            try
            {
                var db = new LawPracticeEntities();
                var did = QueryAES.UrlDecode(Request.Form["Id"]);
                var filename = QueryAES.UrlDecode(Request.Form["filename"]);
                if (did != null)
                {
                    List<GetAzureAssignFileUserList_Result> list = new List<GetAzureAssignFileUserList_Result>();
                    list = db.GetAzureAssignFileUserList(LoggedInUser.FirmId, LoggedInUser.UserId, did, filename).ToList();
                    foreach (var data in list.ToList())
                    {
                        GetAzureAssignFileUserList_Result newItem = new GetAzureAssignFileUserList_Result();
                        if (!string.IsNullOrEmpty(data.username))
                        {
                            newItem.username = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(data.username.ToString()));
                            list[list.IndexOf(data)].username = newItem.username;
                        }
                    }
                    var datas = JsonConvert.SerializeObject(list);
                    return datas;
                }
                else
                {
                    return "";
                }
            }
            catch (Exception ex)
            {
                return "";
            }
        }
        /// <summary>
        /// Assign user azure file list details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult AzureAssignUserFileList()
        {
            ViewBag.pagesize = System.Configuration.ConfigurationManager.AppSettings["pagesize"];
            ViewBag.filesize = ConfigurationManager.AppSettings["filesize"];
            ViewBag.userId = LoggedInUser.UserId;
            ViewBag.firmid = LoggedInUser.FirmId;
            return View();
        }
        /// <summary>
        /// Remove file request
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm")]
        public ActionResult RemoveFileRequest()
        {
            ViewBag.pagesize = System.Configuration.ConfigurationManager.AppSettings["pagesize"];
            ViewBag.filesize = ConfigurationManager.AppSettings["filesize"];
            return View();
        }
        /// <summary>
        /// Get checkout file details
        /// </summary>
        [AuthLog(Roles = "Firm,User")]
        public void CheckoutFile()
        {
            var db = new LawPracticeEntities();
            checkstring();
            string filename = QueryAES.UrlDecode(Request.QueryString["filename"]);
            string token = QueryAES.UrlDecode(Request.QueryString["token"]);
            //get latest filename
            var chkfilenames = db.usp_gettop_chechoutfile(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), token).FirstOrDefault();
            if (chkfilenames != null)
            {
                filename = chkfilenames.fname;
            }
            string fakepathin = Server.MapPath("~/azuredirin/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId);
            string fakepathout = Server.MapPath("~/azuredirout/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId);
            if (!Directory.Exists(fakepathin))
            {
                Directory.CreateDirectory(fakepathin);
            }
            if (!Directory.Exists(fakepathout))
            {
                Directory.CreateDirectory(fakepathout);
            }
            var dpath = QueryAES.UrlDecode(Request.QueryString["code"]);
            try
            {
                dpath = dpath.Replace(" ", "+");
                dpath = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(dpath));
            }
            catch (Exception ex)
            {
            }
            if (!String.IsNullOrEmpty(dpath))
            {
                LogService("dpath" + dpath);
                var dpathtemps = dpath.Replace("WorkSpace/", "LawPractice_ds/");
                LogService("dpathtemps" + dpathtemps);
                //check file in lawpractice_ds
                var chkfileexit = AzureDocument.fileexist(dpathtemps, filename, "", "");
                LogService("chkfileexit" + chkfileexit);
                if (chkfileexit == true)
                {
                    dpath = dpathtemps;
                }
                else
                {
                }
                LogService("finaldpath" + dpath);
                var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
                var account = new CloudStorageAccount(cred, true);
                var client = account.CreateCloudFileClient();
                var share = client.GetShareReference(azureroot);
                var cloudFileDirectory = share.GetRootDirectoryReference().GetDirectoryReference(dpath);
                CloudFile cloudFile = cloudFileDirectory.GetFileReference(filename);
                cloudFile.DownloadToFile(fakepathin + "\\" + filename, FileMode.Create);
            }
            else
            {
                string azurerootuser = azuredir + "/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                dpath = azurerootuser + dpath;
                var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
                var account = new CloudStorageAccount(cred, true);
                var client = account.CreateCloudFileClient();
                var share = client.GetShareReference(azureroot);
                var cloudFileDirectory = share.GetRootDirectoryReference();
                CloudFile cloudFile = cloudFileDirectory.GetFileReference(filename);
                cloudFile.DownloadToFile(fakepathin + "\\" + filename, FileMode.Create);
            }
            string input = fakepathin + "\\" + filename;
            string output = fakepathout + "\\" + filename;
            if (Path.GetExtension(input).ToLower() == ".zip")
            {
                output = input;
            }
            else
            {
                try
                {
                    QueryAES.FileDecrypt(input, output);
                }
                catch (Exception err)
                {
                }
            }
            System.IO.FileInfo fileInfo = new System.IO.FileInfo(output);
            var dfilename = fileInfo.Name;
            try
            {
                if (fileInfo.Exists)
                {
                    Response.Clear();
                    Response.AddHeader("Content-Disposition", "attachment;filename=\"" + dfilename + "\"");
                    Response.AddHeader("Content-Length", fileInfo.Length.ToString());
                    Response.ContentType = "application/octet-stream";
                    Response.TransmitFile(fileInfo.FullName);
                    Response.Flush();
                    //chamge file status to mark checkout
                    var checkinoutstatus = db.USp_SaveCheckInOutStatus(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), token, 1);
                    //save notification
                    try
                    {
                        var getcaseuser = db.GetAssignFileUserListCloud(LoggedInUser.FirmId, LoggedInUser.UserId, Guid.Parse(token)).ToList();
                        if (getcaseuser != null)
                        {
                            foreach (var item in getcaseuser)
                            {
                                var dataac = Notification.SaveNotifications("DocCheckout", null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), item.pcontact.ToString(), dfilename);
                            }
                        }
                    }
                    catch (Exception er)
                    {
                    }
                    try
                    {
                        var getfilename = db.Usp_FileDetailsCloud(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), token.ToString()).FirstOrDefault();
                        //check usercase
                        if (getfilename != null)
                        {
                            if (!String.IsNullOrEmpty(getfilename.Caseid))
                            {
                                //get users related to case
                                var getcaseusers = db.usp_getassignuserbycaseid(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), getfilename.Caseid).ToList();
                                if (getcaseusers != null)
                                {
                                    //send for case users
                                    foreach (var item in getcaseusers)
                                    {
                                        var dataac = Notification.SaveNotifications("DocCheckout", null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), item.auser.ToString(), getfilename.fname);
                                        try
                                        {
                                            if (item.auser.ToString() != LoggedInUser.UserId.ToString())
                                            {
                                                if (item.cstatus != 1)
                                                {
                                                    Notification.SendEmailFromDBContent("DocCheckout", null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), item.auser.ToString(), getfilename.Caseid, getfilename.fname);
                                                }
                                            }
                                        }
                                        catch
                                        {
                                        }
                                    }
                                    //send for creator
                                    var dataac1 = Notification.SaveNotifications("DocCheckout", null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), getfilename.Firmuser.ToString(), getfilename.fname);
                                }
                            }
                        }
                    }
                    catch (Exception rt)
                    {
                    }
                }
                else
                {
                    throw new Exception("File not found");
                }
            }
            catch (Exception ex)
            {
                Response.ContentType = "text/plain";
                Response.Write(ex.Message);
            }
            finally
            {
                System.IO.File.Delete(input);
                System.IO.File.Delete(output);
                Response.End();
            }
        }
        /// <summary>
        /// Get user signed
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult GetSigncopy()
        {
            Session["sessionfirmid"] = LoggedInUser.FirmId.ToString();
            ViewBag.Url = WebConfigurationManager.AppSettings["DigitalSignUrl"].ToString();
            var token = QueryAES.UrlDecode(Request.Form["token"]);
            if (String.IsNullOrEmpty(token))
            {
                var filepath = Request.Form["filepath"];
                FileInfo file = new FileInfo(filepath);
                ViewBag.filename = file.Name;
                ViewBag.userid = LoggedInUser.UserId.ToString();
                ViewBag.fileid = token;
            }
            else
            {
                var db = new LawPracticeEntities();
                var result = db.usp_CheckFilefolderCloud(LoggedInUser.FirmId.ToString(), token).FirstOrDefault();
                if (result != null)
                {
                    ViewBag.filename = result.fname;
                    ViewBag.userid = LoggedInUser.UserId.ToString();
                    ViewBag.fileid = token;
                }
            }
            return View();
        }
        /// <summary>
        /// Get cloud signed copy
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult GetSigncopyCloud()
        {
            ViewBag.Url = WebConfigurationManager.AppSettings["DigitalSignUrl"].ToString();
            return View();
        }
        /// <summary>
        /// Get file size and page size for digital signature
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult DigitalSignature()
        {
            ViewBag.pagesize = System.Configuration.ConfigurationManager.AppSettings["pagesize"];
            ViewBag.filesize = ConfigurationManager.AppSettings["filesize"];
            return View();
        }
        /// <summary>
        /// Get document checkout list details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult DocumentCheckOutlist()
        {
            ViewBag.userId = LoggedInUser.UserId.ToString();
            ViewBag.firmid = LoggedInUser.FirmId.ToString();
            ViewBag.pagesize = System.Configuration.ConfigurationManager.AppSettings["pagesize"];
            if (LoggedInUser.RoleId == 2)
            {
                ViewBag.IsCreate = 0;
                ViewBag.IsEdit = 0;
                ViewBag.IsDelete = 0;
                ViewBag.export = 0;
                ViewBag.share = 0;
                ViewBag.enable = 0;
                var data = checkroles();
                // Split authors separated by a comma followed by space  
                string[] values = data.Split(',');
                for (int i = 0; i < values.Length; i++)
                {
                    if (i == 0)
                    {
                        ViewBag.IsCreate = values[i];
                    }
                    if (i == 1)
                    {
                        ViewBag.IsEdit = values[i];
                    }
                    if (i == 2)
                    {
                        ViewBag.IsDelete = values[i];
                    }
                    if (i == 3)
                    {
                        ViewBag.export = values[i];
                    }
                    if (i == 5)
                    {
                        ViewBag.share = values[i];
                    }
                    if (i == 6)
                    {
                        ViewBag.enable = values[i];
                    }
                }
            }
            return View();
        }
    }
}