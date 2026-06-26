using BussinessLogic;
using BussinessLogic.Common;
using DataAccess.Modals;
using LawPracticeFirm.Common;
using LawPracticeFirm.Models;
using Microsoft.Azure.Storage;
using Microsoft.Azure.Storage.Auth;
using Microsoft.Azure.Storage.File;
using Newtonsoft.Json;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity.Core.Objects;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Configuration;
using System.Web.Http;
using static LawPracticeFirm.Models.AuditData;

namespace LawPracticeFirm.API
{
    public class AzureApiController : BaseFirmApiController
    {
        private LawPracticeEntities db1 = new LawPracticeEntities();
        public string controllername = "AzureApiController";
        string AzureStorageName = WebConfigurationManager.AppSettings["AzureStorageName"];
        string AzureStorageKey = WebConfigurationManager.AppSettings["AzureStorageKey"];
        string azureroot = "mykase";
        string azuredir = "WorkSpace";
        string isdefault = "";

        /// <summary>
        /// Check azure string path
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
        /// Create azure folder
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult Azurecreatefolder()
        {
            try
            {
                checkstring();
                var dpath = QueryAES.UrlDecode(HttpContext.Current.Request.Form["hiddenpath"]);
                var foldername = QueryAES.UrlDecode(HttpContext.Current.Request.Form["foldername"]);
                var foldernames = foldername;
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
                        return Ok("exist");
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
                        return Ok("exist");
                    }
                    else
                    {
                        cloudFileDirectory.CreateIfNotExists();
                    }

                }
                return Ok("success");
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }

        }

        /// <summary>
        /// check Malicious Process and Save Before Malicious dDoc
        /// </summary>
        /// <param name="againrequest"></param>
        /// <param name="filename"></param>
        /// <param name="malciousfilename"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pfile"></param>
        /// <param name="token"></param>
        /// <param name="azurepath"></param>
        /// <returns></returns>
        public static string MaliciousProcess(string againrequest, string filename, string malciousfilename, string firmid, string userid, string pfile, string token, string azurepath)
        {
            var db = new LawPracticeEntities();
            if (againrequest.ToLower().ToString() == "true")
            {
                if (!String.IsNullOrEmpty(malciousfilename))
                {
                    //skip malicious
                    if (malciousfilename.ToLower().ToString() == filename.ToString().ToLower())
                    {
                        return "skip";
                    }
                    var cnt = db.Usp_GetSaveBeforeMalicioudDoc(firmid, userid, pfile, filename, azurepath, token).FirstOrDefault();
                    if (cnt == null)
                    {
                        return "upload";
                    }
                    else
                    {
                        return "skip";
                    }
                }
                else
                {
                    //on confirm upload all
                    var cnt = db.Usp_GetSaveBeforeMalicioudDoc(firmid, userid, pfile, filename, azurepath, token).FirstOrDefault();
                    if (cnt == null)
                    {
                        return "upload";
                    }
                    else
                    {
                        return "skip";
                    }
                }
            }
            else
            {
                return "upload";
            }
        }

        /// <summary>
        /// Create file
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult Createfile()
        {
            try
            {
                var maliciousConfirm = QueryAES.UrlDecode(HttpContext.Current.Request.Form["maliciousConfirm"]);
                var Againupload = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Againupload"]);
                var infectedfilename = QueryAES.UrlDecode(HttpContext.Current.Request.Form["infectedfilename"]);
                var tokendocrequest = QueryAES.UrlDecode(HttpContext.Current.Request.Form["tokendocrequest"]);
                int maxFileSize = Convert.ToInt32(WebConfigurationManager.AppSettings["docelasticmaxFileSize"]);
                var isNoticeParent = "";
                //check NOtice FOLDER
                var maindirid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dirname"]);

                if (!String.IsNullOrEmpty(maindirid))
                {
                    var checknoticefolder = db1.usp_CheckFilefolderCloud(LoggedInUser.FirmId.ToString(), maindirid).FirstOrDefault();
                    if (checknoticefolder != null)
                    {
                        if (checknoticefolder.Firmuser.ToString() == Guid.Empty.ToString())
                        {
                            return Ok("UnauthorizedNotice");
                        }
                    }
                }

                //check size of storage

                var doclimit = DocumentQuota.CheckDocumentmanagementFileSize(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                if (doclimit.ToString() != "Available")
                {
                    return Ok(doclimit);
                }
                //end size of storage
                checkstring();
                AzureDocument.creatroot(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                var fpermissions = QueryAES.UrlDecode(HttpContext.Current.Request.Form["selectedpermission"]);
                var filedetail = QueryAES.UrlDecode(HttpContext.Current.Request.Form["details"]);
                var isindex = 0;
                if (filedetail == "")
                {
                    filedetail = null;
                }
                var cmatter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["cmatter"]);
                try
                {
                    cmatter = cmatter.Replace(" ", "+");
                    cmatter = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(cmatter));
                }
                catch
                {

                }
                var newcasefolderid = "";
                string id = "";
                var caseid = "";
                if (!String.IsNullOrEmpty(cmatter) && !String.IsNullOrEmpty(maindirid)) //create folder named case
                {
                    cmatter = "";
                }

                if (!String.IsNullOrEmpty(cmatter)) //create folder named case
                {
                    var dname = db1.usp_getcasename(LoggedInUser.FirmId.ToString(), cmatter).FirstOrDefault();
                    if (dname == null)
                    {
                        dname = "DefaultCase";
                    }
                    var dpaths = "WorkSpace/" + LoggedInUser.FirmId + "/" + cmatter;
                    var directoryid = "00000000-0000-0000-0000-000000000000";

                    var checkexistcasefolder = db1.usp_checkcasefolderid(LoggedInUser.FirmId.ToString(), cmatter).FirstOrDefault();
                    if (checkexistcasefolder != null)
                    {
                        newcasefolderid = checkexistcasefolder.Id.ToString();
                    }
                    else
                    {
                        AzureDocument.creatroot(LoggedInUser.FirmId.ToString(), cmatter);
                        var createdirectorydata = AzureDocument.createfolder(dpaths, null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                        ObjectParameter IDParameter;
                        IDParameter = new ObjectParameter("id", id);
                        var data = db1.usp_SaveFilefolderCloudNew(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), dname, dpaths, 0, directoryid.ToString(), null, null, null, IDParameter, cmatter, null, 0, null, null, null);
                        newcasefolderid = Convert.ToString(IDParameter.Value);
                    }

                    var dpath = dpaths.TrimEnd('/');
                    var httpRequest = HttpContext.Current.Request;
                    var newfilename = "";
                    var newfilenames = "";
                    string fakepathin = "azuredirin/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                    string fakepathout = "azuredirout/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                    //var dpath = Request.Form["hiddenpath"];
                    var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
                    var account = new CloudStorageAccount(cred, true);
                    var client = account.CreateCloudFileClient();

                    if (httpRequest.Files.Count > 0)
                    {
                        var docfiles = new List<string>();
                        for (int i = 0; i < httpRequest.Files.Count; i++)
                        {
                            var postedFile = httpRequest.Files[i];
                            //encrypt file
                            string input = HttpContext.Current.Server.MapPath("~/" + fakepathin);
                            if (!(Directory.Exists(input)))
                            {
                                Directory.CreateDirectory(input);
                            }
                            if (!(Directory.Exists(HttpContext.Current.Server.MapPath("~/" + fakepathout))))
                            {
                                Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/" + fakepathout));
                            }
                            postedFile.SaveAs(input + "\\" + postedFile.FileName);
                            //for start elastic
                            string strfilepath = input + "\\" + postedFile.FileName;
                            FileInfo fi = new FileInfo(strfilepath);
                            var DocSize = fi.Length;
                            int fileSize = postedFile.ContentLength;
                            var fileextchk = Path.GetExtension(postedFile.FileName);
                            var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);
                            var directory = Path.GetDirectoryName(strfilepath);
                            string strfileName = Path.GetFileName(strfilepath);
                            string mimeType = MimeMapping.GetMimeMapping(strfileName);
                            var base64File = Convert.ToBase64String(System.IO.File.ReadAllBytes(Path.Combine(directory, strfileName)));

                            //end elastic

                            input = input + "\\" + postedFile.FileName;
                            string output = HttpContext.Current.Server.MapPath("~/" + fakepathout + "/" + postedFile.FileName);
                            if (maliciousConfirm == "true")
                            {
                                var result = MaliciousProcess(Againupload, postedFile.FileName, infectedfilename, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), newcasefolderid.ToString(), tokendocrequest, "");
                                if (result == "skip")
                                {
                                    continue;
                                }
                            }
                            //start scan file
                            var scanresult = AntivirusScanDocs.ScanDocument(input, maliciousConfirm);
                            if (scanresult.ToLower().ToString() != "true")
                            {
                                try
                                {
                                    if (File.Exists(input))
                                    {
                                        GC.Collect();
                                        GC.WaitForPendingFinalizers();
                                        File.Delete(input);
                                    }
                                }
                                catch (Exception ex)
                                {

                                }
                                return Ok(new { result = scanresult.ToString(), filename = postedFile.FileName });
                            }
                            //end scan file

                            if (Path.GetExtension(strfilepath).ToLower() == ".zip")
                            {
                                output = input;
                            }
                            else
                            {
                                QueryAES.FileEncrypt(input, output);
                                //delete file
                                try
                                {
                                    System.IO.File.Delete(input);
                                }
                                catch (Exception ex)
                                {

                                }
                            }
                            //rename file exist
                            int it = 0;
                            var fileName = postedFile.FileName;
                            var origininalfilename = fileName;
                            var orfileNameOnly = fileName.Remove(fileName.LastIndexOf('.') + 1).TrimEnd('.');
                            var extension = fileName.Split('.').Last();
                            while (AzureDocument.fileexist(dpath, origininalfilename, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()))
                            {
                                it += 1;
                                origininalfilename = string.Format("{0}({1}).{2}", orfileNameOnly, it, extension);

                            }

                            CloudStorageAccount storageAccount = new CloudStorageAccount(cred, true);
                            // Create a reference to the file client.
                            CloudFileClient fileClient = storageAccount.CreateCloudFileClient();
                            var share = client.GetShareReference(azureroot);
                            // Create a reference to the Azure path
                            var cloudFileDirectory = share.GetRootDirectoryReference().GetDirectoryReference(dpath);
                            cloudFileDirectory.CreateIfNotExists();
                            //Create a reference to the filename that you will be uploading
                            CloudFile cloudFile = cloudFileDirectory.GetFileReference(origininalfilename);
                            var fileext = Path.GetExtension(origininalfilename);
                            //Open a stream from a local file.


                            //Upload the file to Azure.
                            if (cloudFile.Exists())
                            {
                                return Ok("exist");
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
                            ObjectParameter IDParameter1;
                            IDParameter1 = new ObjectParameter("id", id);
                            var data1 = db1.usp_SaveFilefolderCloudNew(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), origininalfilename, dpath, 1, newcasefolderid.ToString(), filedetail, fileext, fpermissions, IDParameter1, cmatter, null, 0, null, DocSize, null);
                            id = Convert.ToString(IDParameter1.Value);
                            //upload in logs
                            var ct4 = db1.Usp_SaveBeforeMalicioudDoc(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), id, newcasefolderid.ToString(), postedFile.FileName, dpath, tokendocrequest);
                            if (Againupload.ToLower().ToString() == "true")
                            {
                            }
                            //save notification
                            //try
                            //{
                            //    var getcaseuser = db1.usp_getassignuserbycaseid(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), cmatter).ToList();
                            //    if (getcaseuser != null)
                            //    {
                            //        foreach (var item in getcaseuser)
                            //        {
                            //            var dataac = Notification.SaveNotifications("UploadDoc", null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), item.auser.ToString(), cmatter, cmatter);

                            //            if (item.auser.ToString() != LoggedInUser.UserId.ToString())
                            //            {
                            //                if (item.cstatus != 1)
                            //                {
                            //                    Notification.SendEmailFromDBContent("UploadDoc", null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), item.auser.ToString(), cmatter, origininalfilename);
                            //                }
                            //            }
                            //        }

                            //    }

                            //}
                            try
                            {
                                var getadmin = db1.usp_getfirmadmindetails(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).FirstOrDefault();
                                if (getadmin != null)
                                {
                                    var dataac = Notification.SaveNotifications("UploadDoc", null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), getadmin.Id.ToString(), cmatter, cmatter);
                                    Notification.SendEmailFromDBContent("UploadDoc", null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), getadmin.Id.ToString(), cmatter, origininalfilename);
                                }

                            }
                            catch
                            {

                            }
                        }
                    }
                    //end folder named case
                }
                else
                {
                    var azurefileid = "";
                    string folderdirectid = "";
                    string newpath = "";
                    var path = "";
                    var directname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dirname"]);
                    string folderdirectidtemp = directname;


                    if (folderdirectidtemp == "")
                    {
                        newpath = "/WorkSpace/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                        var newpathcheck = "WorkSpace/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                        var db = new LawPracticeEntities();
                        ViewFile vf = new ViewFile();
                    }
                    else
                    {
                        var db = new LawPracticeEntities();
                        var dirname = folderdirectidtemp;
                        if (dirname != null)
                        {
                            folderdirectid = folderdirectidtemp;
                            var fid = LoggedInUser.FirmId;
                            var uid = LoggedInUser.UserId;

                            var dirfullpath = db.sp_GetfilepathsCloud(fid, uid, Guid.Parse(folderdirectid)).FirstOrDefault();
                            //get caseid
                            var ddetails = db.usp_CheckFilefolderCloud(LoggedInUser.FirmId.ToString(), folderdirectid.ToString()).FirstOrDefault();
                            if (ddetails != null)
                            {
                                isNoticeParent = ddetails.IsNoticeParent.ToString();
                                caseid = ddetails.Caseid;
                                if (!String.IsNullOrEmpty(caseid))
                                {
                                    var foldernamedata = db.usp_GetViewFilesCloudById(LoggedInUser.FirmId, ddetails.pfile.ToString()).FirstOrDefault();
                                    if (foldernamedata != null)
                                    {
                                        if (foldernamedata.pfile.ToString() == Guid.Empty.ToString())
                                        {
                                            azurefileid = ddetails.AZureFileId.TrimStart('/').TrimEnd('/') + "/" + ddetails.fname;
                                        }
                                        else
                                        {
                                            azurefileid = ddetails.AZureFileId.TrimStart('/').TrimEnd('/');
                                        }
                                    }
                                    else
                                    {
                                        azurefileid = ddetails.AZureFileId.TrimStart('/').TrimEnd('/');
                                    }

                                }
                                else
                                {
                                    if (ddetails.pfile.ToString() == Guid.Empty.ToString())
                                    {
                                        azurefileid = ddetails.AZureFileId.TrimStart('/').TrimEnd('/') + "/" + ddetails.fname;
                                    }
                                    else
                                    {
                                        azurefileid = ddetails.AZureFileId.TrimStart('/').TrimEnd('/');
                                    }
                                }
                            }

                            string dirpathname = dirfullpath;
                            newpath = "WorkSpace/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/" + dirpathname;
                        }
                        else
                        {
                            newpath = "WorkSpace/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                        }
                    }
                    var newfilename = "";
                    var newfilenames = "";
                    var httpRequest = HttpContext.Current.Request;

                    var dpath = QueryAES.UrlDecode(HttpContext.Current.Request.Form["hiddenpath"]);

                    string fakepathin = "azuredirin/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                    string fakepathout = "azuredirout/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                    //var dpath = Request.Form["hiddenpath"];
                    var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
                    var account = new CloudStorageAccount(cred, true);
                    var client = account.CreateCloudFileClient();
                    if (!String.IsNullOrEmpty(directname))
                    {
                        dpath = azurefileid.TrimEnd('/');
                        if (httpRequest.Files.Count > 0)
                        {
                            var docfiles = new List<string>();
                            //Check whether Directory (Folder) exists.

                            for (int i = 0; i < httpRequest.Files.Count; i++)
                            {
                                var postedFile = httpRequest.Files[i];

                                //encrypt file
                                string input = HttpContext.Current.Server.MapPath("~/" + fakepathin);
                                if (!(Directory.Exists(input)))
                                {
                                    Directory.CreateDirectory(input);
                                }
                                if (!(Directory.Exists(HttpContext.Current.Server.MapPath("~/" + fakepathout))))
                                {
                                    Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/" + fakepathout));
                                }

                                postedFile.SaveAs(input + "\\" + postedFile.FileName);
                                var fileextchk = Path.GetExtension(postedFile.FileName);
                                var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);

                                //for start elastic
                                string strfilepath = input + "\\" + postedFile.FileName;
                                FileInfo fi = new FileInfo(strfilepath);
                                var DocSize = fi.Length;
                                int fileSize = postedFile.ContentLength;
                                var directory = Path.GetDirectoryName(strfilepath);
                                string strfileName = Path.GetFileName(strfilepath);
                                string mimeType = MimeMapping.GetMimeMapping(strfileName);
                                var base64File = Convert.ToBase64String(System.IO.File.ReadAllBytes(Path.Combine(directory, strfileName)));

                                //end elastic
                                input = input + "\\" + postedFile.FileName;
                                string output = HttpContext.Current.Server.MapPath("~/" + fakepathout + "/" + postedFile.FileName);
                                if (maliciousConfirm == "true")
                                {
                                    var result = MaliciousProcess(Againupload, postedFile.FileName, infectedfilename, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), folderdirectid.ToString(), tokendocrequest, "");
                                    if (result == "skip")
                                    {
                                        continue;
                                    }
                                }

                                //start sacn file
                                var scanresult = AntivirusScanDocs.ScanDocument(input, maliciousConfirm);
                                if (scanresult.ToLower().ToString() != "true")
                                {
                                    try
                                    {
                                        if (File.Exists(input))
                                        {
                                            GC.Collect();
                                            GC.WaitForPendingFinalizers();
                                            File.Delete(input);
                                        }
                                    }
                                    catch (Exception ex)
                                    {

                                    }
                                    return Ok(new { result = scanresult.ToString(), filename = postedFile.FileName });
                                }
                                //end scan file
                                if (Path.GetExtension(strfilepath).ToLower() == ".zip")
                                {
                                    output = input;
                                }
                                else
                                {
                                    QueryAES.FileEncrypt(input, output);
                                    //delete file
                                    try
                                    {
                                        System.IO.File.Delete(input);
                                    }
                                    catch (Exception ex)
                                    {

                                    }
                                }
                                //rename file exist
                                int it = 0;
                                var fileName = postedFile.FileName;
                                var origininalfilename = fileName;
                                var orfileNameOnly = fileName.Remove(fileName.LastIndexOf('.') + 1).TrimEnd('.');
                                var extension = fileName.Split('.').Last();
                                while (AzureDocument.fileexist(dpath, origininalfilename, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()))
                                {
                                    it += 1;
                                    origininalfilename = string.Format("{0}({1}).{2}", orfileNameOnly, it, extension);

                                }
                                CloudStorageAccount storageAccount = new CloudStorageAccount(cred, true);
                                // Create a reference to the file client.
                                CloudFileClient fileClient = storageAccount.CreateCloudFileClient();
                                var share = client.GetShareReference(azureroot);
                                // Create a reference to the Azure path
                                var cloudFileDirectory = share.GetRootDirectoryReference().GetDirectoryReference(azurefileid);
                                cloudFileDirectory.CreateIfNotExists();

                                //Create a reference to the filename that you will be uploading
                                CloudFile cloudFile = cloudFileDirectory.GetFileReference(origininalfilename);
                                var fileext = Path.GetExtension(origininalfilename);
                                //Open a stream from a local file.

                                //Upload the file to Azure.
                                if (cloudFile.Exists())
                                {
                                    return Ok("exist");
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

                                ObjectParameter IDParameter;
                                IDParameter = new ObjectParameter("id", id);
                                var data = db1.usp_SaveFilefolderCloudNew(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), origininalfilename, dpath, 1, folderdirectid.ToString(), filedetail, fileext, fpermissions, IDParameter, caseid, null, Convert.ToInt16(isindex), null, DocSize, isNoticeParent);
                                id = Convert.ToString(IDParameter.Value);

                                //upload in logs
                                var ct4 = db1.Usp_SaveBeforeMalicioudDoc(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), id, folderdirectid.ToString(), postedFile.FileName, dpath, tokendocrequest);
                                if (Againupload.ToLower().ToString() == "true")
                                {
                                }
                                //insert into case users
                                try
                                {
                                    var getfilename = db1.Usp_FileDetailsCloud(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), folderdirectid.ToString()).FirstOrDefault();
                                    //check usercase
                                    if (getfilename != null)
                                    {
                                        //if (!String.IsNullOrEmpty(getfilename.Caseid))
                                        //{
                                        //    //get users related to case
                                        //    var getcaseusers = db1.usp_getassignuserbycaseid(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), getfilename.Caseid).ToList();
                                        //    if (getcaseusers != null)
                                        //    {
                                        //        //send for case users
                                        //        foreach (var item in getcaseusers)
                                        //        {
                                        //            var dataac = Notification.SaveNotifications("UploadDoc", null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), item.auser.ToString(), getfilename.Caseid, getfilename.Caseid);
                                        //            if (item.auser.ToString() != LoggedInUser.UserId.ToString())
                                        //            {
                                        //                if (item.cstatus != 1)
                                        //                {
                                        //                    var dataac111 = Notification.SendEmailFromDBContent("UploadDocUnderSubFolder", null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), item.auser.ToString(), getfilename.Caseid, origininalfilename, getfilename.fname);
                                        //                }
                                        //            }
                                        //        }

                                        //        //send for creator
                                        //        var dataac1 = Notification.SaveNotifications("UploadDoc", null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), getfilename.Firmuser.ToString(), getfilename.Caseid, getfilename.Caseid);
                                        //    }
                                        //}
                                        if (!String.IsNullOrEmpty(getfilename.Caseid))
                                        {
                                            //send notification only to firm admin
                                            var getadmin = db1.usp_getfirmadmindetails(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).FirstOrDefault();
                                            if (getadmin != null)
                                            {
                                                var dataac = Notification.SaveNotifications("UploadDoc", null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), getadmin.Id.ToString(), getfilename.Caseid, getfilename.Caseid);
                                                var dataac111 = Notification.SendEmailFromDBContent("UploadDocUnderSubFolder", null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), getadmin.Id.ToString(), getfilename.Caseid, origininalfilename, getfilename.fname);
                                            }
                                        }
                                    }
                                }
                                catch (Exception rt)
                                {

                                }
                            }
                        }
                    }
                    else
                    {
                        //for root
                        string azurerootuser = azuredir + "/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                        dpath = azurerootuser + dpath;

                        if (httpRequest.Files.Count > 0)
                        {
                            var docfiles = new List<string>();
                            //Check whether Directory (Folder) exists.
                            for (int i = 0; i < httpRequest.Files.Count; i++)
                            {
                                var postedFile = httpRequest.Files[i];
                                string input = HttpContext.Current.Server.MapPath("~/" + fakepathin);
                                if (!(Directory.Exists(input)))
                                {
                                    Directory.CreateDirectory(input);
                                }
                                var fileextchk = Path.GetExtension(postedFile.FileName);
                                var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);

                                postedFile.SaveAs(input + "\\" + postedFile.FileName);

                                //for start elastic
                                string strfilepath = input + "\\" + postedFile.FileName;
                                FileInfo fi = new FileInfo(strfilepath);
                                var DocSize = fi.Length;
                                int fileSize = postedFile.ContentLength;

                                var directory = Path.GetDirectoryName(strfilepath);
                                string strfileName = Path.GetFileName(strfilepath);
                                string mimeType = MimeMapping.GetMimeMapping(strfileName);
                                var base64File = Convert.ToBase64String(System.IO.File.ReadAllBytes(Path.Combine(directory, strfileName)));

                                //end elastic

                                input = input + "\\" + postedFile.FileName;
                                string output = HttpContext.Current.Server.MapPath("~/" + fakepathout);
                                if (maliciousConfirm == "true")
                                {
                                    var result = MaliciousProcess(Againupload, postedFile.FileName, infectedfilename, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Guid.Empty.ToString(), tokendocrequest, "");
                                    if (result == "skip")
                                    {
                                        continue;
                                    }
                                }
                                //start sacn file
                                var scanresult = AntivirusScanDocs.ScanDocument(input, maliciousConfirm);
                                if (scanresult.ToLower().ToString() != "true")
                                {
                                    try
                                    {
                                        if (File.Exists(input))
                                        {
                                            GC.Collect();
                                            GC.WaitForPendingFinalizers();
                                            File.Delete(input);
                                        }
                                    }
                                    catch (Exception ex)
                                    {

                                    }
                                    return Ok(new { result = scanresult.ToString(), filename = postedFile.FileName });
                                }
                                //end scan file
                                if (!(Directory.Exists(output)))
                                {
                                    Directory.CreateDirectory(output);
                                }
                                if (Path.GetExtension(strfilepath).ToLower() == ".zip")
                                {
                                    output = input;
                                }
                                else
                                {
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
                                }
                                int it = 0;
                                var fileName = postedFile.FileName;
                                var origininalfilename = fileName;
                                var orfileNameOnly = fileName.Remove(fileName.LastIndexOf('.') + 1).TrimEnd('.');
                                var extension = fileName.Split('.').Last();
                                // var checkexistfile=AzureDocument.fileexist(storagePathcloud, fileName, firmuser, userid);
                                while (AzureDocument.fileexist(dpath, origininalfilename, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()))
                                {
                                    it += 1;
                                    origininalfilename = string.Format("{0}({1}).{2}", orfileNameOnly, it, extension);
                                }
                                CloudStorageAccount storageAccount = new CloudStorageAccount(cred, true);
                                // Create a reference to the file client.
                                CloudFileClient fileClient = storageAccount.CreateCloudFileClient();
                                var share = client.GetShareReference(azureroot);
                                // Create a reference to the Azure path
                                var cloudFileDirectory = share.GetRootDirectoryReference().GetDirectoryReference(dpath);
                                cloudFileDirectory.CreateIfNotExists();
                                //Create a reference to the filename that you will be uploading
                                CloudFile cloudFile = cloudFileDirectory.GetFileReference(origininalfilename);
                                var fileext = Path.GetExtension(origininalfilename);
                                //Open a stream from a local file.

                                //Upload the file to Azure.
                                if (cloudFile.Exists())
                                {
                                    return Ok("exist");
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

                                ObjectParameter IDParameter;
                                IDParameter = new ObjectParameter("id", id);
                                var data = db1.usp_SaveFilefolderCloudNew(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), origininalfilename, dpath, 1, Guid.Empty.ToString(), filedetail, fileext, fpermissions, IDParameter, caseid, null, Convert.ToInt16(isindex), null, DocSize, null);
                                id = Convert.ToString(IDParameter.Value);
                                //upload in logs
                                var ct4 = db1.Usp_SaveBeforeMalicioudDoc(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), id, Guid.Empty.ToString(), postedFile.FileName, dpath, tokendocrequest);
                                if (Againupload.ToLower().ToString() == "true")
                                {

                                }
                            }
                        }
                    }
                }

                return Ok(true);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }

        }
        /// <summary>
        /// user Load directory by rowid
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult UserDirectoryList1byrowid()
        {
            try
            {
                var dirtoken = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dirtoken"]);
                int pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                int pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                var search = QueryAES.UrlDecode(HttpContext.Current.Request.Form["search"]);
                var user = QueryAES.UrlDecode(HttpContext.Current.Request.Form["user"]);
                var searchtype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["searchtype"]);

                int roleid = 0;
                if (dirtoken != null)
                {
                    if (dirtoken == "0")
                    {
                        dirtoken = "00000000-0000-0000-0000-000000000000";
                    }
                    string pfile = dirtoken;
                    string firmid = LoggedInUser.FirmId.ToString();
                    string userid = LoggedInUser.UserId.ToString();
                    if (user != "")
                    {
                        if (LoggedInUser.RoleId == 1)
                        {
                            var checkuserrole = db1.usp_CheckUserRoleCloud(LoggedInUser.FirmId.ToString(), user.ToString()).FirstOrDefault();
                            if (checkuserrole != null)
                            {
                                roleid = 2;
                                userid = checkuserrole.Id.ToString();
                            }

                        }
                        else
                        {

                            var checkuserrole = db1.usp_CheckUserRoleCloud(LoggedInUser.FirmId.ToString(), user.ToString()).FirstOrDefault();
                            if (checkuserrole != null)
                            {
                                roleid = Convert.ToInt32(checkuserrole.RoleId);
                                userid = checkuserrole.Id.ToString();
                            }

                        }
                    }
                    else
                    {
                        var checkuserrole = db1.usp_CheckUserRoleCloud(LoggedInUser.FirmId.ToString(), userid.ToString()).FirstOrDefault();
                        if (checkuserrole != null)
                        {
                            roleid = Convert.ToInt32(checkuserrole.RoleId);
                        }
                    }
                    if (search == "")
                    {
                        var data = Repository.Matter.UserLoadDirectorybyrowidCloud(pfile, firmid, userid, pagenum, pagesize, roleid);
                        var param = controllername + ">UserDirectoryList1byrowid>UserLoadDirectorybyrowid>param=" + pfile + "@" + firmid + "@" + userid;
                        db1.usp_AddAudit(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");

                        return Ok(data);
                    }
                    else
                    {
                        if (searchtype == "1")
                        {
                            var data = Repository.Matter.SearchUserLoadDirectorybyrowidCloud(pfile, firmid, userid, pagenum, pagesize, roleid, search);
                            return Ok(data);
                        }
                        else
                        {
                            var db = new LawPracticeEntities();
                            int pageid = 0;
                            var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("directorylist/0")).FirstOrDefault();
                            if (pagelist != null)
                            {
                                pageid = Convert.ToInt32(pagelist.ParentPage);
                            }
                            List<sp_GetSearchFilesAndDirectorybyrowidCloudInOut_DocIndex2_Result> list = new List<sp_GetSearchFilesAndDirectorybyrowidCloudInOut_DocIndex2_Result>();
                            list = db.sp_GetSearchFilesAndDirectorybyrowidCloudInOut_DocIndex2(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, Guid.Parse(pfile), roleid, search, pageid).ToList();
                            foreach (var data in list.ToList())
                            {
                                sp_GetSearchFilesAndDirectorybyrowidCloudInOut_DocIndex2_Result newItem = new sp_GetSearchFilesAndDirectorybyrowidCloudInOut_DocIndex2_Result();
                                if (!string.IsNullOrEmpty(data.AZureFileId))
                                {
                                    newItem.AZureFileId = Convert.ToBase64String(QueryAES.EncryptAes(data.AZureFileId));
                                    list[list.IndexOf(data)].AZureFileId = newItem.AZureFileId;
                                }
                            }
                            var a = JsonConvert.SerializeObject(list);
                            return Ok(a);
                        }
                    }
                }
                else
                {
                    return Ok();
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
        /// <summary>
        /// Create file Directory
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CreatefileDirectory()
        {
            try
            {
                checkstring();
                AzureDocument.creatroot(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                var dname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dname"]);
                var directoryids = QueryAES.UrlDecode(HttpContext.Current.Request.Form["directoryid"]);
                var cmatter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["cmatter"]);
                try
                {
                    cmatter = cmatter.Replace(" ", "+");
                    cmatter = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(cmatter));
                }
                catch
                {
                }
                var db = new LawPracticeEntities();
                var fpath = "";
                var directoryname = "";
                string folderdirectid = "";
                if (dname != "" && directoryids != null)
                {
                    var directoryid = directoryids;
                    if (directoryid == "0")
                    {
                        directoryid = "00000000-0000-0000-0000-000000000000";
                    }
                    else
                    {

                    }
                    var dpath = "";
                    var path = "";
                    var caseid = "";
                    string dirpathname = "";
                    var isNoticeParent = "";
                    var filedetislisuserid = "";
                    var ddetails = db.usp_CheckFilefolderCloud(LoggedInUser.FirmId.ToString(), directoryid.ToString()).FirstOrDefault();
                    if (ddetails != null)
                    {
                        if (ddetails.Firmuser.ToString() == Guid.Empty.ToString())
                        {
                            return Ok("UnauthorizedNotice");
                        }
                        isNoticeParent = ddetails.IsNoticeParent.ToString();
                        filedetislisuserid = ddetails.Firmuser.ToString();
                        folderdirectid = directoryids;
                        var fid = LoggedInUser.FirmId;
                        var uid = LoggedInUser.UserId;
                        directoryname = ddetails.fname;
                        var dirfullpath = db.sp_GetfilepathsCloud(fid, uid, Guid.Parse(folderdirectid)).FirstOrDefault();
                        caseid = ddetails.Caseid;
                        if (String.IsNullOrEmpty(caseid))
                        {
                            if (LoggedInUser.RoleId != 1)
                            {
                                if (ddetails.Firmuser.ToString().ToLower() != LoggedInUser.UserId.ToString().ToLower())
                                {
                                    return Ok("otheruser");
                                }
                            }
                        }

                        try
                        {
                            Guid.Parse(caseid);
                            if (ddetails.pfile.ToString() == Guid.Empty.ToString())
                            {
                                dpath = "WorkSpace/" + LoggedInUser.FirmId + "/" + caseid;
                                path = "WorkSpace/" + LoggedInUser.FirmId + "/" + caseid;
                            }
                            else
                            {
                                StringBuilder sd = new StringBuilder();
                                sd.Clear();
                                string[] sdq = dirfullpath.Split('/');
                                for (int i = 0; i < sdq.Length; i++)
                                {
                                    if (i == 0)
                                    {

                                    }
                                    else
                                    {
                                        if (!String.IsNullOrEmpty(sdq[i]))
                                        {
                                            sd = sd.Append(sdq[i]);
                                            sd = sd.Append("/");
                                        }
                                    }
                                }


                                dirfullpath = sd.ToString().TrimEnd('/').TrimEnd('/');
                                dpath = "WorkSpace/" + LoggedInUser.FirmId + "/" + caseid + "/" + dirfullpath;
                                path = "WorkSpace/" + LoggedInUser.FirmId + "/" + caseid + "/" + dirfullpath;

                                path = path.TrimStart('/').TrimEnd('/') + "/" + dname;
                                path = path.TrimStart('/').TrimEnd('/');
                            }

                        }
                        catch
                        {
                            if (isNoticeParent == "1")
                            {
                                dpath = ddetails.AZureFileId.TrimStart('/').TrimEnd('/');
                                path = ddetails.AZureFileId.TrimStart('/').TrimEnd('/');
                                path = path.TrimStart('/').TrimEnd('/') + "/" + dname;
                                path = path.TrimStart('/').TrimEnd('/');
                            }
                            else
                            {
                                dpath = "WorkSpace/" + LoggedInUser.FirmId + "/" + filedetislisuserid + "/" + dirfullpath;
                                path = "WorkSpace/" + LoggedInUser.FirmId + "/" + filedetislisuserid + "/" + dirfullpath;
                                path = path.TrimStart('/').TrimEnd('/') + "/" + dname;
                                path = path.TrimStart('/').TrimEnd('/');
                            }
                        }
                    }
                    else
                    {
                        path = "WorkSpace/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                        dpath = "";
                    }
                    dpath = dpath.TrimEnd('/').TrimStart('/');
                    var createdirectorydata = AzureDocument.createfolder(dpath, dname, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                    if (createdirectorydata == "exist")
                    {
                        return Ok("Already Directory Exits With Same Name");
                    }
                    else
                    {
                        var chkfolderindb = db.usp_checkfoldernamecloud(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), directoryid, dname.Trim()).ToList().Count();
                        if (chkfolderindb > 0)
                        {
                            return Ok("Already Directory Exits With Same Name");
                        }
                        var param = controllername + ">CreatefileDirectory>Createdir>param=" + dname + "@" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId;
                        string id = "";
                        ObjectParameter IDParameter;
                        IDParameter = new ObjectParameter("id", id);
                        var data = db1.usp_SaveFilefolderCloudNew(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), dname, path, 0, directoryid.ToString(), null, null, null, IDParameter, caseid, null, 0, null, null, isNoticeParent);

                        //send email

                        if (!String.IsNullOrEmpty(caseid))
                        {
                            try
                            {
                                var getcaseuser = db1.usp_getassignuserbycaseid(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), caseid).ToList();
                                if (getcaseuser != null)
                                {
                                    foreach (var item in getcaseuser)
                                    {

                                        if (item.auser.ToString() != LoggedInUser.UserId.ToString())
                                        {
                                            if (data > 0)
                                            {
                                                Notification.SendEmailFromDBContent("CreateFolderUnderSubFolder", null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), item.auser.ToString(), cmatter, dname);
                                            }
                                        }
                                    }

                                }
                            }
                            catch
                            {

                            }
                        }
                        return Ok("successfully created");
                    }
                }
                else
                {
                    return Ok("Directory Name is Blank");
                }
            }
            catch (Exception ex)
            {

                db1.usp_AddAuditError(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }

        }
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult MarkRemoveDirectoryFile()
        {
            var db = new LawPracticeEntities();
            try
            {
                var userid = "";
                var ffid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["value"]);
                var remark = QueryAES.UrlDecode(HttpContext.Current.Request.Form["remark"]);
                var userids = db.Usp_FileDetailsCloud(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), ffid.ToString()).FirstOrDefault();
                if (userids != null)
                {
                    if (userids.IsCheckinOut == 1)
                    {
                        return Ok("alreadycheckout");
                    }
                    userid = userids.Firmuser.ToString();
                    var isdelete = userids.IdDeleted;
                    if (isdelete == 1)
                    {
                        isdelete = 0;
                    }
                    else if (isdelete == null)
                    {
                        isdelete = 1;
                    }
                    else if (isdelete == 0)
                    {
                        isdelete = 1;
                    }
                    var data = db.SaveforMarkFileDeletionCloud(LoggedInUser.FirmId.ToString(), userid.ToString(), ffid.ToString(), isdelete, LoggedInUser.UserId.ToString());
                    var data1 = db.usp_SaveMarkContentModuleWise(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), remark, "MarkDocDeletion", ffid.ToString());
                    try
                    {
                        var getcaseuser = db.usp_GetFirmUsers_RegUser_by_Id(userid, LoggedInUser.FirmId.ToString()).FirstOrDefault();
                        if (getcaseuser != null)
                        {
                            if (!String.IsNullOrEmpty(getcaseuser.ReportManager))
                            {
                                var dataacq = Notification.SaveNotifications("DocDelete", null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), getcaseuser.ReportManager.ToString(), LoggedInUser.UserName);
                            }
                        }
                        //send request to admin
                        var getadmin = db.usp_getfirmadmindetails(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).FirstOrDefault();
                        if (getadmin != null)
                        {
                            var dataacq1 = Notification.SaveNotifications("DocDelete", null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), getadmin.Id.ToString(), LoggedInUser.UserName);
                            try
                            {
                                if (isdelete == 1)
                                {
                                    if (LoggedInUser.RoleId == 2)
                                    {
                                        CommomUtility objmail = new CommomUtility();
                                        string mykaselink = WebConfigurationManager.AppSettings["SiteUrl"].ToString();
                                        string fromemail = WebConfigurationManager.AppSettings["fromemail"].ToString();
                                        string AssignmentSubmittedMailBody = WebConfigurationManager.AppSettings["basicmailtemplate"].ToString();

                                        var stringcontent = "";
                                        var stringsubject = "";
                                        var res = db.usp_GetEmailTemplate("MarkDocumentDeletion").FirstOrDefault();
                                        stringcontent = res.EmailContent;
                                        stringsubject = res.EmailSubject;

                                        stringsubject = stringsubject.Replace("#DocumentName#", userids.fname);
                                        stringcontent = stringcontent.Replace("#AdminName#", getadmin.UserName);

                                        stringcontent = stringcontent.Replace("#FileName#", userids.fname);
                                        stringcontent = stringcontent.Replace("#DeletionDate#", DateTime.Today.Date.ToString("dd/MM/yyyy"));
                                        stringcontent = stringcontent.Replace("#Remarks#", remark);
                                        var getuserdetails = db.usp_GetUserDetailByUserID(LoggedInUser.FirmId.ToString(), userid).FirstOrDefault();
                                        if (getuserdetails != null)
                                        {
                                            stringcontent = stringcontent.Replace("#UserName#", getuserdetails.Name.ToUpper());
                                        }
                                        var getuserdetails1 = db.usp_GetUserDetailByUserID(LoggedInUser.FirmId.ToString(), userids.Firmuser.ToString()).FirstOrDefault();
                                        if (getuserdetails1 != null)
                                        {
                                            stringcontent = stringcontent.Replace("#CreatedBy#", getuserdetails1.Name);
                                        }
                                        AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#CONTENT#", stringcontent);
                                        objmail.SendEmail(fromemail, getadmin.EmailId, "", stringsubject, AssignmentSubmittedMailBody, "");
                                    }
                                }
                            }
                            catch (Exception ex) { }
                        }
                    }
                    catch
                    {

                    }
                    var param = controllername + ">RemoveDirectoryFile>removedirectoryfile>param=" + ffid + "@" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                    return Ok(data);
                }
                else
                {
                    return Ok("Directory Name is Blank");
                }
            }
            catch (Exception ex)
            {

                db1.usp_AddAuditError(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message + "@" + ex.InnerException);
            }
        }
        /// <summary>
        /// Save File Remove Request
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SaveFileRemoveRequest()
        {
            try
            {
                var typeIds = QueryAES.UrlDecode(HttpContext.Current.Request.Form["typeIds"]);
                typeIds = typeIds.Replace(",", "','");
                var db = new LawPracticeEntities();
                var count = db.usp_saveFileRemoveRequestCloud("", "", "", typeIds);
                return Ok(count);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Lead), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Lead), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
        /// <summary>
        /// Save File Sync Request
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SaveFileSyncRequest()
        {
            try
            {
                var fileid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["typeIds"]);

                var countcontact = Repository.Matter.filesyncRequestCloud(fileid, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.RoleId.ToString(), "");
                var param = controllername + ">SaveFileSyncRequest>filesyncRequest>param=" + fileid + "@" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString() + "@" + LoggedInUser.RoleId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                db1.saveuseractivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.UserId.ToString(), 1, DateTime.Now.ToString(), "filesync", Guid.Empty.ToString(), null, null, DateTime.Now.ToString());

                return Ok(countcontact);
            }
            catch (Exception ex)
            {

                db1.usp_AddAuditError(Convert.ToInt32(EventType.Lead), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Lead), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Assign File Per User List
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult AssignFilePerUserList()
        {
            try
            {
                var did = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Id"]);
                if (did != null)
                {
                    var data = Repository.Matter.AssignFilePerUserListCloud(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), did.ToString());
                    var param = controllername + ">AssignFilePerUserList>AssignFilePerUserListCloud>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId + "@" + did;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                    return Ok(data);
                }
                else
                {
                    return Ok("");
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Assign File Permission
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult AssignFilePermission()
        {
            try
            {
                var db = new LawPracticeEntities();
                var did = QueryAES.UrlDecode(HttpContext.Current.Request.Form["did"]);

                var ptype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["permissiontype"]);
                var user = QueryAES.UrlDecode(HttpContext.Current.Request.Form["user"]);
                if (user == "")
                {
                    return Ok("nouser");
                }
                else if (ptype == "")
                {
                    return Ok("nopermission");
                }
                else if (did != "")
                {
                    string id = did;
                    user = user.TrimEnd(',').TrimStart(',');
                    if (user != "")
                    {
                        string[] values = user.Split(',');
                        for (int i = 0; i < values.Length; i++)
                        {
                            values[i] = values[i].Trim();
                            //save
                            var countvalue = Repository.Matter.userfilepermissionCloud(did, ptype, values[i], LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                            try
                            {
                                var getfilename = db.Usp_FileDetailsCloud(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), did).FirstOrDefault();
                                var dataac = Notification.SaveNotifications("SharedDoc", null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), values[i], getfilename.fname);
                                try
                                {
                                    if (getfilename.ftype == 1)
                                    {
                                        //added by umesh on 6 may 22      
                                        string notification = LoggedInUser.UserFullName + " has shared the " + getfilename.fname + ".";
                                        db.usp_AddActivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), notification, "Share File", null, did);
                                    }
                                    else
                                    {
                                        //added by umesh on 6 may 22                                       
                                        var getassigndetails = db.usp_GetUserDetailByUserID(LoggedInUser.FirmId.ToString(), values[i].ToString()).FirstOrDefault();
                                        string strassignusername = getassigndetails.Name;
                                        string notification = LoggedInUser.UserFullName + " has shared the folder with " + strassignusername;
                                        db.usp_AddActivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), notification, "Share File", null, did);
                                    }
                                }
                                catch
                                {

                                }
                            }
                            catch
                            {

                            }
                            try
                            {
                                var getfilename = db.Usp_FileDetailsCloud(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), did).FirstOrDefault();
                                CommomUtility objmail = new CommomUtility();

                                //get user email
                                var useremail = db.usp_GetUserDetailByUserID(LoggedInUser.FirmId.ToString(), values[i].ToString()).FirstOrDefault();
                                if (useremail != null)
                                {
                                    string strsubject = "", strbody = "";
                                    var username = "";
                                    if (!string.IsNullOrEmpty(LoggedInUser.UserFullName))
                                    {
                                        username = LoggedInUser.UserFullName;
                                    }
                                    strsubject = getfilename.fname + " shared by " + username + " through myKase";
                                    strbody += "Dear " + useremail.Name + ",<br><br>";
                                    if (getfilename.ftype == 1)
                                    {
                                        strbody += "A document has been shared with you on myKase:<br><br>";
                                    }
                                    else
                                    {
                                        strbody += "A Folder has been shared with you on myKase:<br><br>";
                                    }
                                    strbody += "Sender’s name: " + username + "<br>";
                                    if (getfilename.ftype == 1)
                                    {
                                        strbody += "Document name: " + getfilename.fname + "<br><br>";
                                    }
                                    else
                                    {
                                        strbody += "Folder name: " + getfilename.fname + "<br><br>";
                                    }

                                    strbody += "Date/Time:" + DateTime.Now.ToString() + "<br><br>";

                                    if (getfilename.ftype == 1)
                                    {
                                        strbody += "To view the document, please login to myKase.<br><br><br><br>";
                                    }
                                    else
                                    {
                                        strbody += "To view the folder, please login to myKase.<br><br><br><br>";

                                    }
                                    // strbody += "Thanks & Regards,<br>Mykase<br><br>";

                                    string AssignmentSubmittedMailBody = WebConfigurationManager.AppSettings["basicmailtemplate"].ToString();
                                    AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#CONTENT#", strbody);
                                    objmail.SendEmail("contact@mykase.in", useremail.EmailId, "", strsubject, AssignmentSubmittedMailBody);
                                }
                            }
                            catch
                            {

                            }

                            var param = controllername + ">AssignFilePermission>userfilepermission>param=" + did + "@" + ptype + "@" + values[i] + "@" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId;
                            db1.usp_AddAudit(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                        }

                    }
                    return Ok("1");
                }
                else
                {
                    return Ok("nothing");
                }
            }
            catch (Exception ex)
            {

                db1.usp_AddAuditError(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }

        }

        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RevertAssignFile()
        {
            try
            {
                var ffid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["did"]);
                if (ffid != "")
                {
                    var data = Repository.Matter.revertassignfileCloud(ffid, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Convert.ToInt32(LoggedInUser.RoleId));
                    var param = controllername + ">RevertAssignFile>revertassignfileCloud>param=" + ffid + "@" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                    return Ok(data);
                }
                else
                {
                    return Ok("File Can not be Revert !");
                }
            }
            catch (Exception ex)
            {

                db1.usp_AddAuditError(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok("Object reference not set to an instance of an object.");
            }

        }

        /// <summary>
        /// Remove User Directory File
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveUserDirectoryFile()
        {
            try
            {
                var ffid = Request.Headers.GetValues("ffid").FirstOrDefault();
                var ffdir = Request.Headers.GetValues("ffdir").FirstOrDefault();

                if (ffid != "")
                {
                    var data = Repository.Matter.removeuserdirectoryfileCloud(ffid, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                    var param = controllername + ">RemoveUserDirectoryFile>removeuserdirectoryfileCloud>param=" + ffid + "@" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                    return Ok(data);
                }
                else
                {
                    return Ok("Directory Name is Blank");
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }

        }

        /// <summary>
        /// User Assign load files by rowid
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult AssignUserFileListbyrowid()
        {
            try
            {
                var did = "00000000-0000-0000-0000-000000000000";
                int pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                int pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                var searchtype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["searchtype"]);
                var search = QueryAES.UrlDecode(HttpContext.Current.Request.Form["search"]);
                var pfile = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pfile"]);
                var pfilemain = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pfilemain"]);
                if (did != null)
                {
                    if (searchtype == "1")
                    {
                        var data = Repository.Matter.AssignUserFileListbyrowidCloud(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), did.ToString(), pagenum, pagesize, search, pfile, pfilemain);
                        var param = controllername + ">AssignUserFileListbyrowid>AssignUserFileListCloud>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId + "@" + did;
                        db1.usp_AddAudit(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");

                        return Ok(data);
                    }
                    else
                    {
                        var data = Repository.Matter.AssignUserFileListbyrowidCloudContentSearch(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), did.ToString(), pagenum, pagesize, search, pfile, pfilemain);
                        var param = controllername + ">AssignUserFileListbyrowid>AssignUserFileListCloud>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId + "@" + did;
                        db1.usp_AddAudit(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                        return Ok(data);
                    }
                }
                else
                {
                    return Ok("");
                }
            }
            catch (Exception ex)
            {

                db1.usp_AddAuditError(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// user Load directory by rowid
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult UserRemoveFileListbyrowid()
        {
            try
            {
                int pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                int pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                var search = QueryAES.UrlDecode(HttpContext.Current.Request.Form["search"]);
                var user = QueryAES.UrlDecode(HttpContext.Current.Request.Form["user"]);
                int roleid = 0;
                string firmid = LoggedInUser.FirmId.ToString();
                string userid = LoggedInUser.UserId.ToString();

                if (LoggedInUser.RoleId == 1)
                {
                    if (user == "")
                    {
                        user = Guid.Empty.ToString();
                        roleid = Convert.ToInt32(LoggedInUser.RoleId);
                    }
                    else
                    {
                        var checkuserrole = db1.usp_wf_GetUserDetails(LoggedInUser.FirmId, Guid.Parse(user)).FirstOrDefault();
                        if (checkuserrole != null)
                        {
                            roleid = Convert.ToInt32(checkuserrole.roleid);
                        }
                    }
                    var data = Repository.Matter.RemoveUserFileRequestListbyrowidCloud(firmid, user, pagenum, pagesize, roleid, search);
                    var param = controllername + ">UserRemoveFileListbyrowid>UserRemoveFileListbyrowidCloud>param=@" + firmid + "@" + userid;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                    return Ok(data);
                }
                else
                {
                    return Ok();
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
        /// <summary>
        /// Log Service
        /// </summary>
        /// <param name="content"></param>
        private void LogService(string content)
        {
            var templogpath = HttpContext.Current.Server.MapPath("//");
            FileStream fs = new FileStream(templogpath + "//azureofficefile.txt", FileMode.OpenOrCreate, FileAccess.Write);
            StreamWriter sw = new StreamWriter(fs);
            sw.BaseStream.Seek(0, SeekOrigin.End);
            sw.WriteLine(content);
            sw.Flush();
            sw.Close();
        }
        /// <summary>
        /// Is File Locked
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
                return true;
            }
            finally
            {
                if (stream != null)
                    stream.Close();
            }
            return false;
        }
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveDirectoryFile()
        {
            var db = new LawPracticeEntities();
            try
            {
                checkstring();
                var userid = "";
                string destination12 = "";
                string destination13 = "";
                string destination14 = "";
                string destination15 = "";

                var ffid = Request.Headers.GetValues("value").FirstOrDefault();
                var dname = Request.Headers.GetValues("dname").FirstOrDefault();
                var fid = Request.Headers.GetValues("fid").FirstOrDefault();
                var fpath = Request.Headers.GetValues("fpath").FirstOrDefault();
                var code = Request.Headers.GetValues("code").FirstOrDefault();
                var azurefileid = "";
                var filename = "";
                var caseid = "";
                var userids = db.usp_CheckFilefolderCloud(LoggedInUser.FirmId.ToString(), ffid.ToString()).FirstOrDefault();
                if (userids != null)
                {
                    if (userids.IsCheckinOut == 1)
                    {
                        return Ok("alreadycheckout");
                    }
                    userid = userids.Firmuser.ToString();
                    azurefileid = userids.AZureFileId;
                    caseid = userids.Caseid;
                    filename = userids.fname;
                }
                string workingfolder = "";
                string workingfolder1 = "";
                workingfolder = "WorkSpace";

                workingfolder1 = "LawPractice_ds";
                try
                {
                    var dirfullpath = db.sp_GetfilepathsCloud(LoggedInUser.FirmId, LoggedInUser.UserId, Guid.Parse(ffid)).FirstOrDefault();
                    var existpathcloud = azurefileid.Replace("WorkSpace", ConfigurationManager.AppSettings["UserHostAddress"]);
                    string temppath = HttpContext.Current.Server.MapPath("~/" + azurefileid + "/" + dirfullpath);
                    string temppath1 = HttpContext.Current.Server.MapPath("~/" + existpathcloud + "/" + dirfullpath);
                    //start temp path//
                    if (!String.IsNullOrEmpty(caseid))
                    {
                        var existpathcloud3 = azurefileid.Replace("WorkSpace", "TempWorkSpaceCloud");
                        destination14 = HttpContext.Current.Server.MapPath("~/" + existpathcloud3 + "/" + filename);
                        var existpathcloud4 = azurefileid.Replace("WorkSpace", "TempLawPractice_dsCloud");
                        destination15 = HttpContext.Current.Server.MapPath("~/" + existpathcloud4 + "/" + filename);
                    }
                    else
                    {
                        var existpathcloud3 = azurefileid.Replace("WorkSpace", "TempWorkSpaceCloud");
                        destination12 = HttpContext.Current.Server.MapPath("~/" + existpathcloud3 + "/" + filename);
                        var existpathcloud4 = azurefileid.Replace("WorkSpace", "TempLawPractice_dsCloud");
                        destination13 = HttpContext.Current.Server.MapPath("~/" + existpathcloud4 + "/" + filename);
                        var existpathcloud13 = azurefileid.Replace("WorkSpace", "TempWorkSpaceCloud");
                        destination14 = HttpContext.Current.Server.MapPath("~/" + existpathcloud3 + "/" + dirfullpath.TrimEnd('/'));
                        var existpathcloud14 = azurefileid.Replace("WorkSpace", "TempLawPractice_dsCloud");
                        destination15 = HttpContext.Current.Server.MapPath("~/" + existpathcloud14 + "/" + dirfullpath.TrimEnd('/'));
                    }

                    try
                    {  //for workspace
                        if (File.Exists(temppath))
                        {
                            GC.Collect();
                            GC.WaitForPendingFinalizers();
                            File.Delete(temppath);
                            LogService("temppath" + temppath);
                        }
                    }
                    catch (Exception er)
                    {
                        LogService("temppath" + er.Message);

                    }
                    try
                    {   //for lawpractice_ds
                        if (File.Exists(temppath1))
                        {
                            GC.Collect();
                            GC.WaitForPendingFinalizers();
                            File.Delete(temppath1);
                            LogService("temppath1" + temppath1);
                        }
                    }
                    catch (Exception er)
                    {
                        LogService("temppath1er" + er.Message);
                    }
                    try
                    {
                        if (File.Exists(destination12))
                        {
                            GC.Collect();
                            GC.WaitForPendingFinalizers();
                            File.Delete(destination12);
                            LogService("destination12" + destination12);
                        }
                    }
                    catch (Exception er)
                    {
                        LogService("destination12er" + er.Message);
                    }
                    try
                    {
                        if (File.Exists(destination13))
                        {
                            GC.Collect();
                            GC.WaitForPendingFinalizers();
                            File.Delete(destination13);
                            LogService("destination13" + destination13);
                        }
                    }
                    catch (Exception er)
                    {
                        LogService("destination13er" + er.Message);
                    }
                    try
                    {
                        if (File.Exists(destination14))
                        {
                            GC.Collect();
                            GC.WaitForPendingFinalizers();
                            File.Delete(destination14);
                            LogService("destination14" + destination14);
                        }
                    }
                    catch (Exception er)
                    {
                        LogService("destination14er" + er.Message);
                    }
                    try
                    {
                        if (File.Exists(destination15))
                        {
                            GC.Collect();
                            GC.WaitForPendingFinalizers();
                            File.Delete(destination15);
                            LogService("destination15" + destination15);
                        }
                    }
                    catch (Exception er)
                    {
                        LogService("destination15er" + er.Message);
                    }
                }
                catch
                {
                }
                if (ffid != "")
                {
                    code = code.Replace(" ", "+");
                    var dpath = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(code));
                    var Name = "https://mykase.file.core.windows.net/mykase/" + dpath + "/" + dname;
                    Uri uri = new Uri(Name);
                    var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
                    var account = new CloudStorageAccount(cred, true);
                    var client = account.CreateCloudFileClient();
                    CloudStorageAccount storageAccount = new CloudStorageAccount(cred, true);
                    // Create a reference to the file client.
                    CloudFileClient fileClient = storageAccount.CreateCloudFileClient();
                    var share = client.GetShareReference(azureroot);
                    // Create a reference to the Azure path
                    var cloudFileDirectory = share.GetRootDirectoryReference().GetDirectoryReference(dpath);
                    try
                    {
                        //Create a reference to the filename that you will be uploading
                        CloudFile cloudFile = cloudFileDirectory.GetFileReference(dname);
                        cloudFile.Delete();
                        var arr = dpath.Split('/');
                        // skips the first element and joins rest of the array
                        string rest = string.Join("/", arr.Skip(1));
                        //delete from lawpractic_ds
                        var dpath1 = WebConfigurationManager.AppSettings["UserHostAddress"] + "/" + rest;
                        var cred1 = new StorageCredentials(AzureStorageName, AzureStorageKey);
                        var account1 = new CloudStorageAccount(cred, true);
                        var client1 = account.CreateCloudFileClient();
                        CloudStorageAccount storageAccount1 = new CloudStorageAccount(cred, true);
                        // Create a reference to the file client.
                        CloudFileClient fileClient1 = storageAccount1.CreateCloudFileClient();
                        var share1 = client1.GetShareReference(azureroot);
                        // Create a reference to the Azure path
                        var cloudFileDirectory1 = share1.GetRootDirectoryReference().GetDirectoryReference(dpath1);
                        //Create a reference to the filename that you will be uploading
                        CloudFile cloudFile1 = cloudFileDirectory1.GetFileReference(dname);
                        cloudFile1.Delete();
                    }
                    catch (Exception ex)
                    {

                    }
                    var data = Repository.Matter.removedirectoryfileCloud(ffid, LoggedInUser.FirmId.ToString(), userid);
                    db.saveuseractivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.UserId.ToString(), 1, DateTime.Now.ToString(), "removefile", Guid.Empty.ToString(), null, null, DateTime.Now.ToString());
                    var param = controllername + ">RemoveDirectoryFile>removedirectoryfileCloud>param=" + ffid + "@" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                    //remove file from elastic
                    try
                    {
                        var result = AzureDocument.removedoctoelastic(ffid, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                    }
                    catch
                    {

                    }
                    return Ok(data);
                }
                else
                {
                    return Ok("Directory Name is Blank");
                }
            }
            catch (Exception ex)
            {

                db1.usp_AddAuditError(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message + "@" + ex.InnerException);
            }
        }
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveMultipleFiles()
        {
            var count = 0;
            var filesdata = HttpContext.Current.Request.Form["multiplefilesdata"];
            if (filesdata != "[]")
            {
                List<RemoveMultipleFiles> list = JsonConvert.DeserializeObject<List<RemoveMultipleFiles>>(filesdata);
                if (list.Count > 0)
                {
                    for (var i = 0; i < list.Count; i++)
                    {
                        var db = new LawPracticeEntities();
                        try
                        {
                            checkstring();
                            var userid = "";
                            string destination12 = "";
                            string destination13 = "";
                            string destination14 = "";
                            string destination15 = "";

                            var ffid = list[i].value;
                            var dname = list[i].directoryname;
                            var fid = list[i].fid;
                            var fpath = list[i].fpath;
                            var code = list[i].code;
                            var azurefileid = "";
                            var filename = "";
                            var caseid = "";
                            var userids = db.usp_CheckFilefolderCloud(LoggedInUser.FirmId.ToString(), ffid.ToString()).FirstOrDefault();
                            if (userids != null)
                            {
                                if (userids.IsCheckinOut == 1)
                                {
                                    continue;
                                    //return Ok("alreadycheckout");
                                }
                                userid = userids.Firmuser.ToString();
                                azurefileid = userids.AZureFileId;
                                caseid = userids.Caseid;
                                filename = userids.fname;
                            }
                            string workingfolder = "";
                            string workingfolder1 = "";
                            workingfolder = "WorkSpace";
                            workingfolder1 = "LawPractice_ds";
                            try
                            {
                                var dirfullpath = db.sp_GetfilepathsCloud(LoggedInUser.FirmId, LoggedInUser.UserId, Guid.Parse(ffid)).FirstOrDefault();
                                var existpathcloud = azurefileid.Replace("WorkSpace", ConfigurationManager.AppSettings["UserHostAddress"]);
                                string temppath = HttpContext.Current.Server.MapPath("~/" + azurefileid + "/" + dirfullpath);
                                string temppath1 = HttpContext.Current.Server.MapPath("~/" + existpathcloud + "/" + dirfullpath);
                                if (!String.IsNullOrEmpty(caseid))
                                {
                                    var existpathcloud3 = azurefileid.Replace("WorkSpace", "TempWorkSpaceCloud");
                                    destination14 = HttpContext.Current.Server.MapPath("~/" + existpathcloud3 + "/" + filename);
                                    var existpathcloud4 = azurefileid.Replace("WorkSpace", "TempLawPractice_dsCloud");
                                    destination15 = HttpContext.Current.Server.MapPath("~/" + existpathcloud4 + "/" + filename);
                                }
                                else
                                {
                                    var existpathcloud3 = azurefileid.Replace("WorkSpace", "TempWorkSpaceCloud");
                                    destination12 = HttpContext.Current.Server.MapPath("~/" + existpathcloud3 + "/" + filename);
                                    var existpathcloud4 = azurefileid.Replace("WorkSpace", "TempLawPractice_dsCloud");
                                    destination13 = HttpContext.Current.Server.MapPath("~/" + existpathcloud4 + "/" + filename);
                                    var existpathcloud13 = azurefileid.Replace("WorkSpace", "TempWorkSpaceCloud");
                                    destination14 = HttpContext.Current.Server.MapPath("~/" + existpathcloud3 + "/" + dirfullpath.TrimEnd('/'));
                                    var existpathcloud14 = azurefileid.Replace("WorkSpace", "TempLawPractice_dsCloud");
                                    destination15 = HttpContext.Current.Server.MapPath("~/" + existpathcloud14 + "/" + dirfullpath.TrimEnd('/'));
                                }
                                try
                                {
                                    //for workspace
                                    if (File.Exists(temppath))
                                    {
                                        GC.Collect();
                                        GC.WaitForPendingFinalizers();
                                        File.Delete(temppath);

                                        LogService("temppath" + temppath);
                                    }
                                }
                                catch (Exception er)
                                {
                                    LogService("temppath" + er.Message);

                                }
                                try
                                {
                                    //for lawpractice_ds
                                    if (File.Exists(temppath1))
                                    {
                                        GC.Collect();
                                        GC.WaitForPendingFinalizers();
                                        File.Delete(temppath1);
                                        LogService("temppath1" + temppath1);
                                    }
                                }
                                catch (Exception er)
                                {
                                    LogService("temppath1er" + er.Message);
                                }
                                try
                                {
                                    if (File.Exists(destination12))
                                    {
                                        GC.Collect();
                                        GC.WaitForPendingFinalizers();
                                        File.Delete(destination12);
                                        LogService("destination12" + destination12);
                                    }
                                }
                                catch (Exception er)
                                {
                                    LogService("destination12er" + er.Message);
                                }
                                try
                                {
                                    if (File.Exists(destination13))
                                    {
                                        GC.Collect();
                                        GC.WaitForPendingFinalizers();
                                        File.Delete(destination13);
                                        LogService("destination13" + destination13);
                                    }
                                }
                                catch (Exception er)
                                {
                                    LogService("destination13er" + er.Message);
                                }
                                try
                                {
                                    if (File.Exists(destination14))
                                    {
                                        GC.Collect();
                                        GC.WaitForPendingFinalizers();
                                        File.Delete(destination14);
                                        LogService("destination14" + destination14);
                                    }
                                }
                                catch (Exception er)
                                {
                                    LogService("destination14er" + er.Message);
                                }
                                try
                                {
                                    if (File.Exists(destination15))
                                    {
                                        GC.Collect();
                                        GC.WaitForPendingFinalizers();
                                        File.Delete(destination15);
                                        LogService("destination15" + destination15);
                                    }
                                }
                                catch (Exception er)
                                {
                                    LogService("destination15er" + er.Message);
                                }
                            }
                            catch
                            {
                            }
                            if (ffid != "")
                            {
                                //delete from azure
                                //var Name = dname;
                                code = code.Replace(" ", "+");
                                var dpath = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(code));
                                var Name = "https://mykase.file.core.windows.net/mykase/" + dpath + "/" + dname;

                                Uri uri = new Uri(Name);
                                var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
                                var account = new CloudStorageAccount(cred, true);
                                var client = account.CreateCloudFileClient();
                                CloudStorageAccount storageAccount = new CloudStorageAccount(cred, true);
                                // Create a reference to the file client.
                                CloudFileClient fileClient = storageAccount.CreateCloudFileClient();
                                var share = client.GetShareReference(azureroot);
                                // Create a reference to the Azure path
                                var cloudFileDirectory = share.GetRootDirectoryReference().GetDirectoryReference(dpath);
                                // cloudFileDirectory.CreateIfNotExists();

                                try
                                {
                                    //Create a reference to the filename that you will be uploading
                                    CloudFile cloudFile = cloudFileDirectory.GetFileReference(dname);
                                    cloudFile.Delete();
                                    var arr = dpath.Split('/');
                                    // skips the first element and joins rest of the array
                                    string rest = string.Join("/", arr.Skip(1));
                                    //delete from lawpractic_ds
                                    var dpath1 = WebConfigurationManager.AppSettings["UserHostAddress"] + "/" + rest;
                                    var cred1 = new StorageCredentials(AzureStorageName, AzureStorageKey);
                                    var account1 = new CloudStorageAccount(cred, true);
                                    var client1 = account.CreateCloudFileClient();
                                    CloudStorageAccount storageAccount1 = new CloudStorageAccount(cred, true);
                                    // Create a reference to the file client.
                                    CloudFileClient fileClient1 = storageAccount1.CreateCloudFileClient();
                                    var share1 = client1.GetShareReference(azureroot);
                                    // Create a reference to the Azure path
                                    var cloudFileDirectory1 = share1.GetRootDirectoryReference().GetDirectoryReference(dpath1);

                                    //Create a reference to the filename that you will be uploading
                                    CloudFile cloudFile1 = cloudFileDirectory1.GetFileReference(dname);
                                    cloudFile1.Delete();
                                }
                                catch (Exception ex)
                                {

                                }
                                var data = Repository.Matter.removedirectoryfileCloud(ffid, LoggedInUser.FirmId.ToString(), userid);
                                count = count + 1;
                                db.saveuseractivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.UserId.ToString(), 1, DateTime.Now.ToString(), "removefile", Guid.Empty.ToString(), null, null, DateTime.Now.ToString());
                                var param = controllername + ">RemoveDirectoryFile>removedirectoryfileCloud>param=" + ffid + "@" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId;
                                db1.usp_AddAudit(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                            }
                            else
                            {
                                return Ok("Directory Name is Blank");
                            }
                        }
                        catch (Exception ex)
                        {
                            db1.usp_AddAuditError(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                            return Ok(ex.Message + "@" + ex.InnerException);
                        }
                    }
                }
            }
            return Ok(count);
        }
        /// <summary>
        /// Remove Directory
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveDirectory()
        {
            var db = new LawPracticeEntities();
            try
            {
                checkstring();
                var userid = "";
                var fid = Request.Headers.GetValues("fid").FirstOrDefault();
                var fdirpath = Request.Headers.GetValues("fdirpath").FirstOrDefault();
                var fdir = Request.Headers.GetValues("fdir").FirstOrDefault();
                var code = Request.Headers.GetValues("code").FirstOrDefault();
                var userids = db.usp_CheckFilefolderCloud(LoggedInUser.FirmId.ToString(), fid.ToString()).FirstOrDefault();
                if (userids != null)
                {
                    userid = userids.Firmuser.ToString();
                }
                string workingfolder = "WorkSpace";
                var DestinationPath = "";
                if (fid != "")
                {
                    int isEmpty1 = db.usp_CheckParentFilefolderCloud(LoggedInUser.FirmId.ToString(), fid.ToString()).Count();
                    if (isEmpty1 == 0)
                    {
                        if (String.IsNullOrEmpty(userids.Caseid))
                        {
                            //for get destination path
                            if (userids.pfile.ToString() == Guid.Empty.ToString())
                            {
                                DestinationPath = userids.AZureFileId.TrimEnd('/').TrimStart('/') + "/" + userids.fname;
                            }
                            else
                            {
                                DestinationPath = userids.AZureFileId.TrimEnd('/').TrimStart('/');
                            }
                        }
                        else
                        {
                            if (userids.pfile.ToString() == Guid.Empty.ToString())
                            {
                                DestinationPath = userids.AZureFileId;
                            }
                            else
                            {
                                var foldernamedatap = db.usp_CheckFilefolderCloud(LoggedInUser.FirmId.ToString(), userids.pfile.ToString()).FirstOrDefault();
                                if (foldernamedatap != null)
                                {
                                    if (foldernamedatap.pfile.ToString() == Guid.Empty.ToString())
                                    {
                                        DestinationPath = userids.AZureFileId.TrimStart('/').TrimEnd('/') + '/' + userids.fname;
                                    }
                                    else
                                    {
                                        DestinationPath = userids.AZureFileId.TrimStart('/').TrimEnd('/');
                                    }
                                }
                            }
                        }
                        var dpath = DestinationPath.TrimEnd('/').TrimStart('/');
                        var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
                        var account = new CloudStorageAccount(cred, true);
                        var client = account.CreateCloudFileClient();
                        CloudStorageAccount storageAccount = new CloudStorageAccount(cred, true);
                        // Create a reference to the file client.
                        CloudFileClient fileClient = storageAccount.CreateCloudFileClient();
                        var share = client.GetShareReference(azureroot);
                        // Create a reference to the Azure path
                        var cloudFileDirectory = share.GetRootDirectoryReference().GetDirectoryReference(dpath);
                        if (cloudFileDirectory.Exists())
                        {
                            cloudFileDirectory.Delete();
                            var data = Repository.Matter.removedirectoryCloud(fid, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                            var param = controllername + ">RemoveDirectory>removedirectory>param=" + fid + "@" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId;
                            db1.usp_AddAudit(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                            db1.saveuseractivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.UserId.ToString(), 1, DateTime.Now.ToString(), "delfolder", Guid.Empty.ToString(), null, null, DateTime.Now.ToString());
                            return Ok(data);
                        }
                        else
                        {
                            var data = Repository.Matter.removedirectoryCloud(fid, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                            var param = controllername + ">RemoveDirectory>removedirectory>param=" + fid + "@" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId;
                            db1.usp_AddAudit(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                            db1.saveuseractivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.UserId.ToString(), 1, DateTime.Now.ToString(), "delfolder", Guid.Empty.ToString(), null, null, DateTime.Now.ToString());
                            return Ok(data);
                        }
                    }
                    else
                    {
                        return Ok("false");
                    }
                }
                else
                {
                    return Ok("Directory Name is Blank");
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
        /// <summary>
        /// Directory List1
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult DirectoryList1()
        {
            try
            {
                var dirtoken = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dirtoken"]);
                var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["caseid"]);
                if (dirtoken != null)
                {
                    if (dirtoken.ToString() == "0")
                    {
                        dirtoken = "00000000-0000-0000-0000-000000000000";
                    }
                    else
                    {
                        dirtoken = dirtoken.Replace("#", "");
                    }
                    string pfile = dirtoken;
                    string firmid = LoggedInUser.FirmId.ToString();
                    string userid = LoggedInUser.UserId.ToString();

                    //get folder caseid
                    var db = new LawPracticeEntities();
                    var getfolderdata = db.Usp_FileDetailsCloud(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), dirtoken).FirstOrDefault();
                    if (getfolderdata != null)
                    {
                        if (!String.IsNullOrEmpty(getfolderdata.Caseid))
                        {
                            caseid = getfolderdata.Caseid;
                        }
                    }

                    var data = Repository.Matter.LoadDirectoryCloud(pfile, firmid, userid, caseid);
                    var param = controllername + ">DirectoryList1>LoadDirectory>param=" + pfile + "@" + firmid + "@" + userid;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                    return Ok(data);
                }
                else
                {
                    return Ok();
                }
            }
            catch (Exception ex)
            {

                db1.usp_AddAuditError(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
        /// <summary>
        /// Directory file path
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult Dirfilepath()
        {
            try
            {
                var db = new LawPracticeEntities();
                checkstring();
                var urltypes = QueryAES.UrlDecode(HttpContext.Current.Request.Form["urltypes"]);
                var baseurl = QueryAES.UrlDecode(HttpContext.Current.Request.Form["baseurl"]);
                var filepath = QueryAES.UrlDecodeWithOutInputInvalid(HttpContext.Current.Request.Form["filepath"]);
                var dpath = QueryAES.UrlDecode(HttpContext.Current.Request.Form["code"]);
                try
                {
                    dpath = dpath.Replace(" ", "+");
                    dpath = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(dpath));
                }
                catch (Exception ex)
                {
                    LogService("e1" + ex.Message + "@" + ex.InnerException + "@" + ex.StackTrace + "dpath" + dpath);
                }
                try
                {
                    filepath = filepath.Replace(" ", "+");
                    filepath = QueryAES.DecryptStringAES(filepath);
                }
                catch (Exception ex)
                {
                    filepath = QueryAES.UrlDecodeWithOutInputInvalid(HttpContext.Current.Request.Form["filepath"]);
                    LogService("e1" + ex.Message + "@" + ex.InnerException + "@" + ex.StackTrace);
                }
                filepath = filepath.Replace("//", "/");
                var dfullpathcloud = dpath.TrimEnd('/').TrimStart('/');
                var fileName = filepath.Split('/').Last();
                string fakepathin = HttpContext.Current.Server.MapPath("~/azuredirin/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId);
                string fakepathout = HttpContext.Current.Server.MapPath("~/azuredirout/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId);

                if (!Directory.Exists(fakepathin))
                {
                    Directory.CreateDirectory(fakepathin);
                }

                if (!Directory.Exists(fakepathout))
                {
                    Directory.CreateDirectory(fakepathout);
                }
                var source = AzureDocument.Dirfilepath(dfullpathcloud, fileName, fakepathin, fakepathout, null, null);
                var destination = "/azuredirout/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/" + fileName;

                if (urltypes == "office")
                {
                    urltypes = "https://view.officeapps.live.com/op/view.aspx?src=" + baseurl + destination;
                }
                if (urltypes == "docs")
                {
                    urltypes = baseurl + destination;
                }
                if (urltypes == "dropbox")
                {
                    urltypes = baseurl + destination;
                }
                return Ok(urltypes);
            }
            catch (Exception ex)
            {

                db1.usp_AddAuditError(Convert.ToInt32(EventType.ChangePassowrd), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.ChangePassowrd), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
        /// <summary>
        /// Random number
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
        /// File Details For doc Edit
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult FileDetailsFordocEdit()
        {
            var token = QueryAES.UrlDecode(HttpContext.Current.Request.Form["token"]);
            var db = new LawPracticeEntities();
            var data = db.Usp_FileDetailsCloud(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), token.ToString()).ToList();
            var a = JsonConvert.SerializeObject(data);
            return Ok(a);
        }
        /// <summary>
        /// File Deatils
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult FileDeatils()
        {
            var DriveType = QueryAES.UrlDecode(HttpContext.Current.Request.Form["DriveType"]);
            if (DriveType.ToString() == "MykaseDrive")
            {
                var token = QueryAES.UrlDecode(HttpContext.Current.Request.Form["token"]);
                var db = new LawPracticeEntities();
                var data = db.Usp_FileDetailsCloud(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), token.ToString()).ToList();
                var a = JsonConvert.SerializeObject(data);
                return Ok(a);
            }
            else
            {
                var docpath = "";
                var db = new LawPracticeEntities();
                var myList = new List<string>();
                dynamic postedFiledata = "";

                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count > 0)
                {
                    var docfiles = new List<string>();
                    string folderPath = HttpContext.Current.Server.MapPath("~/Documents/Esign/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/");
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
                        var fileName1 = fileName + fileext;
                        var filePath = folderPath + Path.GetFileName(fileName1); //HttpContext.Current.Server.MapPath(+ postedFile.FileName);
                        var fileextchk = Path.GetExtension(postedFile.FileName);
                        var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);
                        postedFile.SaveAs(filePath);
                        docpath = filePath;
                        //check file size
                        FileInfo info = new FileInfo(filePath);
                        long length = info.Length;
                        //Convert to KB
                        var finalfilelengthKb = length / 1024;
                        if (finalfilelengthKb > 10240)
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
                    }
                }
                return Ok(docpath);
            }
        }
        /// <summary>
        /// Edit File Deatils
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult EditFileDeatils()
        {
            var token = QueryAES.UrlDecode(HttpContext.Current.Request.Form["token"]);
            var filedetails = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filedetails"]);
            var db = new LawPracticeEntities();
            var data = db.Usp_updatedetailsFilescloud(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), token.ToString(), filedetails.ToString());
            try
            {
                var getfilename = db.Usp_FileDetailsCloud(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), token.ToString()).FirstOrDefault();

                var getcaseuser = db.GetAssignFileUserListCloud(LoggedInUser.FirmId, LoggedInUser.UserId, Guid.Parse(token)).ToList();
                if (getcaseuser != null)
                {
                    foreach (var item in getcaseuser)
                    {
                        var dataac = Notification.SaveNotifications("FileDescEdit", null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), item.pcontact.ToString(), getfilename.fname);
                    }
                }

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
                                var dataac = Notification.SaveNotifications("FileDescEdit", null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), item.auser.ToString(), getfilename.fname);
                            }
                            //send for creator
                            var dataac1 = Notification.SaveNotifications("FileDescEdit", null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), getfilename.Firmuser.ToString(), getfilename.fname);
                        }
                    }
                }
            }
            catch
            {

            }
            return Ok(data);
        }
        /// <summary>
        /// knowledge Directory List
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult knowledgeDirectoryList()
        {
            try
            {
                var dirtoken = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dirtoken"]);
                if (dirtoken != null)
                {
                    if (dirtoken.ToString() == "0")
                    {
                        dirtoken = "00000000-0000-0000-0000-000000000000";
                    }
                    else
                    {
                        dirtoken = dirtoken.Replace("#", "");
                    }
                    string pfile = dirtoken;
                    string firmid = LoggedInUser.FirmId.ToString();
                    string userid = LoggedInUser.UserId.ToString();
                    var data = Repository.Matter.LoadKnowDirectory(pfile, firmid, userid);
                    var param = controllername + ">knowledgeDirectoryList>LoadKnowDirectory>param=" + pfile + "@" + firmid + "@" + userid;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                    return Ok(data);
                }
                else
                {
                    return Ok();
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
        /// <summary>
        /// Check Document Quota
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CheckDocumentQuota()
        {
            var chklmt = DocumentQuota.CheckDocumentmanagementFileSize(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
            return Ok(chklmt);
        }
        /// <summary>
        /// Create file checkin
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult Createfilecheckin()
        {
            try
            {
                //check size of storage
                var doclimit = DocumentQuota.CheckDocumentmanagementFileSize(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                if (doclimit.ToString() != "Available")
                {
                    return Ok(doclimit);
                }
                //end size of storage
                var DocumentVersionCount = Convert.ToInt32(WebConfigurationManager.AppSettings["DocumentVersionCount"]);
                var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
                var account = new CloudStorageAccount(cred, true);
                var client = account.CreateCloudFileClient();
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                checkstring();
                AzureDocument.creatroot(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());

                var fileid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fileid"]);
                if (String.IsNullOrEmpty(fileid))
                {
                    return Ok("Oops file id is not found.");
                }
                try
                {
                    fileid = fileid.Replace(" ", "+");
                    fileid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(fileid));
                }
                catch (Exception er)
                {

                }
                //checked  valid user for checkin
                var chckinoutown = db.usp_checkCheckoutOwner(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), fileid.ToString()).FirstOrDefault();
                if (chckinoutown != null)
                {
                    if (chckinoutown.UserId.ToString() != LoggedInUser.UserId.ToString())
                    {
                        return Ok("Unauthorizeduser");
                    }
                }
                else
                {
                    return Ok("We found this file is not being check-out.");
                }
                //check file already checkin or not
                var chckinout = db.usp_CheckFilefolderCloud(LoggedInUser.FirmId.ToString(), fileid.ToString()).FirstOrDefault();
                if (chckinout != null)
                {
                    if (chckinout.IsCheckinOut != 1)
                    {
                        return Ok("File Already Checkedin.");
                    }
                }

                var filenameparent = "";
                var newfileparentid = "";
                var caseid = "";
                var azurepath = "";
                var fileuserid = "";
                var fileversion = "1";
                string id = "";

                var isNoticeParent = "";
                //get filename
                var getfilename = db.Usp_FileDetailsCloud(firmid, userid, fileid).FirstOrDefault();
                if (getfilename != null)
                {
                    isNoticeParent = getfilename.IsNoticeParent.ToString();
                    filenameparent = getfilename.fname;
                    azurepath = getfilename.AZureFileId;
                    newfileparentid = getfilename.pfile.ToString();
                    caseid = getfilename.Caseid;
                    fileuserid = getfilename.Firmuser.ToString();

                }
                var httpRequest = HttpContext.Current.Request;
                string fakepathin = "azuredirin/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                string fakepathout = "azuredirout/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                for (int i = 0; i < httpRequest.Files.Count; i++)
                {
                    var postedFile = httpRequest.Files[i];

                    //encrypt file
                    string input = HttpContext.Current.Server.MapPath("~/" + fakepathin);
                    if (!(Directory.Exists(input)))
                    {
                        Directory.CreateDirectory(input);
                    }
                    if (!(Directory.Exists(HttpContext.Current.Server.MapPath("~/" + fakepathout))))
                    {
                        Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/" + fakepathout));
                    }
                    //check filename
                    var basefilecompare = filenameparent.Remove(filenameparent.LastIndexOf('.') + 1).TrimEnd('.');
                    var uploadfilecompare = postedFile.FileName.Remove(postedFile.FileName.LastIndexOf('.') + 1).TrimEnd('.');
                    bool result = uploadfilecompare.StartsWith(basefilecompare);
                    if (result)
                    {

                    }
                    else
                    {
                        return Ok("differfilename");
                    }
                    var uploadfilecompareext = postedFile.FileName.Split('.').Last();
                    var basefilecompareext = filenameparent.Split('.').Last();
                    if (uploadfilecompareext.ToLower() == basefilecompareext.ToLower())
                    {

                    }
                    else
                    {
                        return Ok("differfileext");
                    }

                    var fileextchk = Path.GetExtension(postedFile.FileName);
                    var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);

                    postedFile.SaveAs(input + "\\" + postedFile.FileName);

                    FileInfo fi = new FileInfo(input + "\\" + postedFile.FileName);
                    var DocSize = fi.Length;
                    input = input + "\\" + postedFile.FileName;
                    string output = HttpContext.Current.Server.MapPath("~/" + fakepathout + "/" + postedFile.FileName);

                    //start sacn file
                    var scanresult = AntivirusScanDocs.ScanDocument(input, "true");
                    if (scanresult.ToLower().ToString() != "true")
                    {
                        try
                        {
                            System.IO.File.Delete(input);
                        }
                        catch (Exception ex)
                        {

                        }
                        if (scanresult.ToString() == "false")
                        {
                            return Ok("Document have virus infection");
                        }
                        else
                        {
                            return Ok(scanresult.ToString());
                        }
                    }
                    //end scan file
                    if (Path.GetExtension(input).ToLower() == ".zip")
                    {
                        output = input;
                    }
                    else
                    {
                        QueryAES.FileEncrypt(input, output);
                        //delete file
                        try
                        {
                            System.IO.File.Delete(input);
                        }
                        catch (Exception ex)
                        {

                        }
                    }

                    //rename file exist andcheck file name versions
                    var dpath = azurepath.TrimEnd('/');
                    int it = 0;
                    var fileName = postedFile.FileName;
                    var origininalfilename = filenameparent;
                    var orfileNameOnly = filenameparent.Remove(filenameparent.LastIndexOf('.') + 1).TrimEnd('.');
                    var extension = fileName.Split('.').Last();
                    var chkfverison = db.Usp_CheckCloudFileVerion(firmid, userid, fileid).FirstOrDefault();
                    if (chkfverison != null)
                    {
                        fileversion = chkfverison.FileVersion;
                        fileversion = (Convert.ToInt32(fileversion) + 1).ToString();
                    }

                    // renAME  file 
                    origininalfilename = string.Format("{0}_V{1}{2}.{3}", orfileNameOnly, fileversion, DateTime.Now.ToString("yyyyMMddhhmmss").Trim(), extension);

                    CloudStorageAccount storageAccount = new CloudStorageAccount(cred, true);
                    // Create a reference to the file client.
                    CloudFileClient fileClient = storageAccount.CreateCloudFileClient();
                    var share = client.GetShareReference(azureroot);
                    // Create a reference to the Azure path
                    var cloudFileDirectory = share.GetRootDirectoryReference().GetDirectoryReference(dpath);
                    cloudFileDirectory.CreateIfNotExists();

                    //Create a reference to the filename that you will be uploading
                    CloudFile cloudFile = cloudFileDirectory.GetFileReference(origininalfilename);
                    var fileext = Path.GetExtension(origininalfilename);
                    //Open a stream from a local file.

                    //Upload the file to Azure.
                    if (cloudFile.Exists())
                    {
                        return Ok("exist");
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
                    using (var transaction = db.Database.BeginTransaction())
                    {
                        try
                        {
                            //upload filw version
                            ObjectParameter IDParameter1;
                            IDParameter1 = new ObjectParameter("id", id);
                            var data1 = db1.usp_SaveFileOnlineCreateOrCheckIn(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), origininalfilename, dpath, 1, newfileparentid.ToString(), null, fileext, null, IDParameter1, null, fileid, 0, "2", DocSize, postedFile.FileName, isNoticeParent);
                            id = Convert.ToString(IDParameter1.Value);
                            //save checkin file version
                            var chksave = db.USp_SaveCloudFileVersion(firmid, userid, fileid, fileversion, 0);
                            //chckin file
                            var checkinoutstatus = db.USp_SaveCheckInOutStatus(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), fileid, 0);

                            //chck file  version count
                            var fileversioncount = db.usp_FileVersionCount(firmid, userid, fileid).FirstOrDefault();
                            if (Convert.ToInt32(fileversioncount.Counts) > DocumentVersionCount)
                            {
                                //get first  version file data
                                var Getfirstvfile = db.usp_FindFirstFileVersion(firmid, userid, fileid).FirstOrDefault();

                                //remove file
                                var removevfile = db.Usp_Removefileversion(Getfirstvfile.Firmid.ToString(), Getfirstvfile.Firmuser.ToString(), Getfirstvfile.Id.ToString());
                                //remove physical file
                                var dpath1 = Getfirstvfile.AZureFileId;

                                //var Name = "https://mykase.file.core.windows.net/mykase/" + dpath1 + "/" + Getfirstvfile.fname;

                                //Uri uri = new Uri(Name);

                                CloudStorageAccount storageAccount1 = new CloudStorageAccount(cred, true);
                                // Create a reference to the file client.
                                CloudFileClient fileClient1 = storageAccount.CreateCloudFileClient();
                                var share1 = client.GetShareReference(azureroot);
                                // Create a reference to the Azure path
                                var cloudFileDirectory1 = share.GetRootDirectoryReference().GetDirectoryReference(dpath1);
                                // cloudFileDirectory.CreateIfNotExists();

                                //Create a reference to the filename that you will be uploading
                                CloudFile cloudFile1 = cloudFileDirectory.GetFileReference(Getfirstvfile.fname);
                                cloudFile1.Delete();
                                //}
                                //transaction.Commit();
                                ////save notification
                                //try
                                //{
                                //    var getcaseuser = db.GetAssignFileUserListCloud(LoggedInUser.FirmId, LoggedInUser.UserId, Guid.Parse(caseid)).ToList();
                                //    if (getcaseuser != null)
                                //    {
                                //        foreach (var item in getcaseuser)
                                //        {
                                //            var dataac = Notification.SaveNotifications("DocCheckin", null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), item.pcontact.ToString(), getfilename.fname);
                                //        }
                                //    }
                                //}
                                //catch
                                //{

                                //}
                                //try
                                //{
                                //    //check usercase
                                //    if (getfilename != null)
                                //    {
                                //        if (!String.IsNullOrEmpty(getfilename.Caseid))
                                //        {
                                //            //get users related to case
                                //            var getcaseusers = db.usp_getassignuserbycaseid(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), getfilename.Caseid).ToList();
                                //            if (getcaseusers != null)
                                //            {
                                //                //send for case users
                                //                foreach (var item in getcaseusers)
                                //                {
                                //                    var dataac = Notification.SaveNotifications("DocCheckin", null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), item.auser.ToString(), getfilename.fname);
                                //                    try
                                //                    {
                                //                        if (item.auser.ToString() != LoggedInUser.UserId.ToString())
                                //                        {
                                //                            if (item.cstatus != 1)
                                //                            {
                                //                                Notification.SendEmailFromDBContent("DocCheckin", null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), item.auser.ToString(), getfilename.Caseid, getfilename.fname);
                                //                            }
                                //                        }
                                //                    }
                                //                    catch
                                //                    {

                                //                    }
                                //                }
                                //                //send for creator
                                //                var dataac1 = Notification.SaveNotifications("DocCheckin", null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), getfilename.Firmuser.ToString(), getfilename.fname);
                                //            }
                                //        }
                                //    }

                            }
                            transaction.Commit();
                            //save notification only to firm admin
                            try
                            {
                                //check usercase
                                if (getfilename != null)
                                {
                                    if (!String.IsNullOrEmpty(getfilename.Caseid))
                                    {
                                        var getadmin = db.usp_getfirmadmindetails(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).FirstOrDefault();
                                        if (getadmin != null)
                                        {
                                            var dataac = Notification.SaveNotifications("DocCheckin", null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), getadmin.Id.ToString(), getfilename.fname);
                                            Notification.SendEmailFromDBContent("DocCheckin", null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), getadmin.Id.ToString(), getfilename.Caseid, getfilename.fname);
                                        }
                                    }
                                }
                            }
                            catch (Exception rt)
                            {

                            }
                            return Ok(true);
                        }
                        catch (Exception ex)
                        {
                            transaction.Rollback();
                            try
                            {
                                CloudStorageAccount storageAccount1 = new CloudStorageAccount(cred, true);
                                // Create a reference to the file client.
                                CloudFileClient fileClient1 = storageAccount.CreateCloudFileClient();
                                var share1 = client.GetShareReference(azureroot);
                                // Create a reference to the Azure path
                                var cloudFileDirectory1 = share.GetRootDirectoryReference().GetDirectoryReference(dpath);
                                // cloudFileDirectory.CreateIfNotExists();

                                //Create a reference to the filename that you will be uploading
                                CloudFile cloudFile1 = cloudFileDirectory.GetFileReference(origininalfilename);
                                cloudFile1.Delete();
                            }
                            catch (Exception ex3)
                            {

                            }
                            //remove file from azure server
                            return Ok(ex.Message);
                        }
                    }
                }
                return Ok();
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// File Version List
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult FileVersionList()
        {
            try
            {
                var fileid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dirtoken"]);
                string firmid = LoggedInUser.FirmId.ToString();
                string userid = LoggedInUser.UserId.ToString();
                var data = Repository.Matter.FileVersionList(firmid, userid, fileid);
                var param = controllername + ">FileVersionList>FileVersionList>param=" + fileid + "@" + firmid + "@" + userid;
                db1.usp_AddAudit(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(data);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Create file from dashboard
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult Createfilefromdashboard()
        {
            try
            {
                int maxFileSize = Convert.ToInt32(WebConfigurationManager.AppSettings["docelasticmaxFileSize"]);
                var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["cmatter"]);
                var details = QueryAES.UrlDecode(HttpContext.Current.Request.Form["details"]);
                try
                {
                    caseid = caseid.Replace(" ", "+");
                    caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
                }
                catch (Exception ex)
                {
                }
                var chkcaseid = "";
                string firmid = LoggedInUser.FirmId.ToString();
                string userid = LoggedInUser.UserId.ToString();
                var httpRequest = HttpContext.Current.Request;
                var newcasefolderid = "";
                var id = "";
                try
                {
                    chkcaseid = Guid.Parse(caseid).ToString();
                }
                catch
                {
                    return Ok("Invalid case id");
                }
                if (!String.IsNullOrEmpty(caseid))
                {
                    if (httpRequest.Files.Count > 0)
                    {
                        var dname = db1.usp_getcasename(LoggedInUser.FirmId.ToString(), caseid).FirstOrDefault();
                        if (dname == null)
                        {
                            dname = "DefaultCase";
                        }
                        var dpaths = "WorkSpace/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/" + caseid;
                        var directoryid = "00000000-0000-0000-0000-000000000000";
                        var checkexistcasefolder = db1.usp_checkcasefolderid(LoggedInUser.FirmId.ToString(), caseid).FirstOrDefault();
                        if (checkexistcasefolder != null)
                        {
                            newcasefolderid = checkexistcasefolder.Id.ToString();
                        }
                        else
                        {
                            var createdirectorydata = AzureDocument.createfolder(dpaths, null, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                            ObjectParameter IDParameter;
                            IDParameter = new ObjectParameter("id", id);
                            var data = db1.usp_SaveFilefolderCloudNew(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), dname, dpaths, 0, directoryid.ToString(), null, null, null, IDParameter, caseid, null, 0, null, null, null);
                            newcasefolderid = Convert.ToString(IDParameter.Value);
                        }
                        var dpath = dpaths.TrimEnd('/');
                        var newfilename = "";
                        var newfilenames = "";
                        string AzureStorageName = WebConfigurationManager.AppSettings["AzureStorageName"];
                        string AzureStorageKey = WebConfigurationManager.AppSettings["AzureStorageKey"];
                        string azureroot = "mykase";
                        string azuredir = "WorkSpace";
                        string fakepathin = "azuredirin/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                        string fakepathout = "azuredirout/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                        //var dpath = Request.Form["hiddenpath"];
                        var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
                        var account = new CloudStorageAccount(cred, true);
                        var client = account.CreateCloudFileClient();
                        if (httpRequest.Files.Count > 0)
                        {
                            var docfiles = new List<string>();
                            //Check whether Directory (Folder) exists.
                            for (int i = 0; i < httpRequest.Files.Count; i++)
                            {
                                var postedFile = httpRequest.Files[i];
                                //encrypt file
                                string input = HttpContext.Current.Server.MapPath("~/" + fakepathin);
                                if (!(Directory.Exists(input)))
                                {
                                    Directory.CreateDirectory(input);
                                }
                                if (!(Directory.Exists(HttpContext.Current.Server.MapPath("~/" + fakepathout))))
                                {
                                    Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/" + fakepathout));
                                }
                                var fileextchk = Path.GetExtension(postedFile.FileName);
                                var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);
                                postedFile.SaveAs(input + "\\" + postedFile.FileName);
                                //for start elastic
                                string strfilepath = input + "\\" + postedFile.FileName;
                                int fileSize = postedFile.ContentLength;
                                FileInfo fi = new FileInfo(strfilepath);
                                var DocSize = fi.Length;
                                var directory = Path.GetDirectoryName(strfilepath);
                                string strfileName = Path.GetFileName(strfilepath);
                                string mimeType = MimeMapping.GetMimeMapping(strfileName);
                                var base64File = Convert.ToBase64String(System.IO.File.ReadAllBytes(Path.Combine(directory, strfileName)));
                                //end elastic
                                input = input + "\\" + postedFile.FileName;
                                string output = HttpContext.Current.Server.MapPath("~/" + fakepathout + "/" + postedFile.FileName);
                                QueryAES.FileEncrypt(input, output);
                                //delete file
                                try
                                {
                                    System.IO.File.Delete(input);
                                }
                                catch (Exception ex)
                                {

                                }
                                //rename file exist
                                int it = 0;
                                var fileName = postedFile.FileName;
                                var origininalfilename = fileName;
                                var orfileNameOnly = fileName.Remove(fileName.LastIndexOf('.') + 1).TrimEnd('.');
                                var extension = fileName.Split('.').Last();
                                // var checkexistfile=AzureDocument.fileexist(storagePathcloud, fileName, firmuser, userid);
                                while (AzureDocument.fileexist(dpath, origininalfilename, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()))
                                {
                                    it += 1;
                                    origininalfilename = string.Format("{0}({1}).{2}", orfileNameOnly, it, extension);

                                }
                                CloudStorageAccount storageAccount = new CloudStorageAccount(cred, true);
                                // Create a reference to the file client.
                                CloudFileClient fileClient = storageAccount.CreateCloudFileClient();
                                var share = client.GetShareReference(azureroot);
                                // Create a reference to the Azure path
                                var cloudFileDirectory = share.GetRootDirectoryReference().GetDirectoryReference(dpath);
                                cloudFileDirectory.CreateIfNotExists();
                                //Create a reference to the filename that you will be uploading
                                CloudFile cloudFile = cloudFileDirectory.GetFileReference(origininalfilename);
                                var fileext = Path.GetExtension(origininalfilename);
                                //Open a stream from a local file.

                                //Upload the file to Azure.
                                if (cloudFile.Exists())
                                {
                                    return Ok("exist");
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
                                ObjectParameter IDParameter1;
                                IDParameter1 = new ObjectParameter("id", id);
                                var data1 = db1.usp_SaveFilefolderCloudNew(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), origininalfilename, dpath, 1, newcasefolderid.ToString(), details, fileext, null, IDParameter1, caseid, null, 0, null, DocSize, null);
                                id = Convert.ToString(IDParameter1.Value);
                            }
                        }
                    }
                }
                else
                {
                    return Ok("case id could not be blank");
                }
                return Ok();
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Mark Confident Document
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult MarkConfidentDocument()
        {
            try
            {
                var ffid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["token"]);
                var db = new LawPracticeEntities();
                if (ffid != "")
                {
                    var data = db.usp_MarkConfidentDocument(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), ffid);
                    var param = controllername + ">MarkConfidentDocument>param=" + LoggedInUser.FirmId + "@" + LoggedInUser.UserId + "@" + ffid;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                    return Ok(data);
                }
                else
                {
                    return Ok("Directory Name is Blank");
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
        /// <summary>
        /// Bruid cumb
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult Bruidcumb()
        {
            try
            {
                var db = new LawPracticeEntities();
                var did = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dirid"]);
                try
                {
                    did = did.Replace(" ", "+");
                    did = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(did));
                }
                catch
                {

                }
                if (did != "")
                {
                    var data = db.usp_GetDirectoryLinkCloud(Guid.Parse(did)).ToList();
                    var a = JsonConvert.SerializeObject(data);
                    return Ok(a);
                }
                else
                {
                    return Ok("");
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Remo All Office User
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoAllOfficeUser()
        {
            var db = new LawPracticeEntities();
            var did = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dirid"]);
            try
            {
                did = did.Replace(" ", "+");
                did = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(did));
            }
            catch
            {

            }
            var ct = db.usp_Deleteonlyofficeuser(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), did);
            return Ok();
        }

        /// <summary>
        /// Rename Folder
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RenameFolder()
        {
            var db = new LawPracticeEntities();
            var did = QueryAES.UrlDecode(HttpContext.Current.Request.Form["directoryid"]);
            var newfoldername = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dname"]);
            var dpath = "";
            var dpath_ds = "";
            var parentid = "";
            var dbfolderpath = "";
            try
            {
                did = did.Replace(" ", "+");
                did = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(did));
            }
            catch
            {

            }
            var newupdatewfiledpathazure = "";
            using (var transaction = db.Database.BeginTransaction())
            {
                try
                {
                    //get directly data
                    var result = db.usp_CheckFilefolderCloud(LoggedInUser.FirmId.ToString(), did).FirstOrDefault();
                    if (result != null)
                    {
                        dpath = result.AZureFileId.TrimEnd('/').TrimStart('/');
                        string UserHostAddress = WebConfigurationManager.AppSettings["UserHostAddress"];
                        string str = dpath;
                        var arr = str.Split('/');
                        dpath_ds = UserHostAddress + "/" + string.Join("/", arr.Skip(1));

                        var createdirectorydata = AzureDocument.folderexistRename(dpath, newfoldername, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), result.pfile.ToString(), "1");
                        if (createdirectorydata == true)
                        {
                            return Ok("AlreadyExistDirectory");
                        }
                        //copy direcotry to new folder
                        var resultdata = AzureDocument.RenameFolder(dpath, result.fname, newfoldername, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), result.pfile.ToString());
                        if (resultdata == true)
                        {
                            parentid = result.pfile.ToString();
                            //update name of folder
                            if (result.pfile.ToString() == Guid.Empty.ToString())
                            {
                                newupdatewfiledpathazure = dpath + "/" + newfoldername;
                                dbfolderpath = dpath;
                            }
                            else
                            {
                                var foldernametmp = dpath;
                                string str3 = foldernametmp;
                                var arr3 = str3.Split('/');
                                foldernametmp = string.Join("/", arr3.Take(arr3.Length - 1));
                                newupdatewfiledpathazure = foldernametmp.TrimEnd('/').TrimStart('/') + "/" + newfoldername;
                                dbfolderpath = newupdatewfiledpathazure;
                            }
                            var ct = db.usp_RenameFolder(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), did, result.fname, newfoldername, newupdatewfiledpathazure, dbfolderpath);
                            //remove directory from folder
                            if (ct > 0)
                            {
                                //Remove  previoud directory name after success
                                var dataresult = AzureDocument.RemoveFolderRename(dpath, result.fname, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), result.pfile.ToString());
                                var dataresult_ds = AzureDocument.RemoveFolderRename(dpath_ds, result.fname, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), result.pfile.ToString());
                                transaction.Commit();
                            }
                            else
                            {
                                //Remove  new directory name after fail
                                var dataresult = AzureDocument.RemoveFolderRename(dpath, newfoldername, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), result.pfile.ToString());
                                var dataresult_ds = AzureDocument.RemoveFolderRename(dpath_ds, newfoldername, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), result.pfile.ToString());
                                transaction.Rollback();
                            }

                            return Ok();
                        }
                        else
                        {
                            //Remove  new directory name after fail
                            var dataresult = AzureDocument.RemoveFolderRename(dpath, newfoldername, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), result.pfile.ToString());
                            var dataresult_ds = AzureDocument.RemoveFolderRename(dpath_ds, newfoldername, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), result.pfile.ToString());
                            transaction.Rollback();
                            return Ok("no result found");
                        }
                    }
                    else
                    {
                        return Ok("transaction.Rollback1");
                    }
                }
                catch (Exception ex)
                {
                    //Remove  new directory name after fail
                    var dataresult = AzureDocument.RemoveFolderRename(dpath, newfoldername, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), parentid);
                    var dataresult_ds = AzureDocument.RemoveFolderRename(dpath_ds, newfoldername, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), parentid);
                    transaction.Rollback();
                    db1.usp_AddAudit(Convert.ToInt32(EventType.User), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.User), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                    return Ok(ex.Message + "@" + ex.InnerException + "@" + ex.StackTrace);
                }
            }
        }

        /// <summary>
        /// Move file
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SaveMoveFile()
        {
            var db = new LawPracticeEntities();
            using (var transaction = db.Database.BeginTransaction())
            {
                try
                {
                    var dpath = "";
                    var dpath_ds = "";
                    var foldername = "";
                    var filename = "";
                    var isNoticeParent = "";
                    var fid = Request.Headers.GetValues("fid").FirstOrDefault();

                    var dirid = Request.Headers.GetValues("dirid").FirstOrDefault();
                    if (dirid.ToString() == "0")
                    {
                        dirid = "00000000-0000-0000-0000-000000000000";
                    }
                    var newdirpath = Request.Headers.GetValues("dirpath").FirstOrDefault();
                    var chckowner = db.usp_CheckFilefolderCloud(LoggedInUser.FirmId.ToString(), dirid).FirstOrDefault();
                    var deletedestination = "";
                    if (chckowner != null) //for non root
                    {
                        var chkowner1 = chckowner.Firmuser.ToString();
                        if (chckowner.Firmuser.ToString() == Guid.Empty.ToString())
                        {
                            return Ok("UnauthorizedNotice");
                        }
                        isNoticeParent = chckowner.IsNoticeParent.ToString();
                        var checkassignfile = db.FirmFilePermissionClouds.Where(x => x.FileId.ToString() == fid.ToString()).FirstOrDefault();
                        if (checkassignfile != null)
                        {
                            return Ok("assign");
                        }
                        if (chckowner.fpermission == "1")
                        {
                            return Ok("Sync");
                        }
                        else
                        {
                            dpath = chckowner.AZureFileId.TrimEnd('/').TrimStart('/');
                            string UserHostAddress = WebConfigurationManager.AppSettings["UserHostAddress"];
                            string str = dpath;
                            var arr = str.Split('/');
                            dpath_ds = UserHostAddress + "/" + string.Join("/", arr.Skip(1));
                            var filedetails = db.usp_CheckFilefolderCloud(LoggedInUser.FirmId.ToString(), fid).FirstOrDefault();
                            if (filedetails != null)
                            {
                                filename = filedetails.fname;
                                deletedestination = filedetails.AZureFileId.ToString();
                                var getdestrinationdetais = db.usp_CheckFilefolderCloud(LoggedInUser.FirmId.ToString(), dirid).FirstOrDefault();
                                if (getdestrinationdetais != null)
                                {
                                    var newAZureFileId = "";
                                    if (String.IsNullOrEmpty(getdestrinationdetais.Caseid))
                                    {
                                        if (dirid.ToString() == Guid.Empty.ToString())
                                        {
                                            newAZureFileId = dpath;
                                        }
                                        else
                                        {
                                            if (getdestrinationdetais.pfile.ToString() == Guid.Empty.ToString())
                                            {
                                                newAZureFileId = dpath + "/" + chckowner.fname;
                                            }
                                            else
                                            {
                                                newAZureFileId = dpath;
                                            }
                                        }
                                    }
                                    else
                                    {
                                        if (getdestrinationdetais.pfile.ToString() == Guid.Empty.ToString())
                                        {
                                            newAZureFileId = dpath;
                                        }
                                        else
                                        {
                                            newAZureFileId = dpath;
                                        }
                                    }
                                    var result = AzureDocument.MoveFile(dpath, filename, newAZureFileId, filedetails.AZureFileId.ToString(), LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), dirid, getdestrinationdetais.pfile.ToString());
                                    if (result == "exist")
                                    {
                                        return Ok(new { status = "documentalreadyexist", filename = filename });
                                    }
                                    else if (result == "true")
                                    {
                                        var data = db.usp_SaveMoveFileFolderLog(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), fid, filename, newAZureFileId, filedetails.AZureFileId, dirid, 1, 0, "", isNoticeParent);
                                        if (data > 0)
                                        {
                                            string notification = LoggedInUser.UserFullName + " has moved the document " + filename + " to folder " + getdestrinationdetais.fname + ".";
                                            db.usp_AddActivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), notification, "Move File", null, dirid);
                                            //Added by file move doc histry
                                            db.usp_AddActivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), notification, "Move File", null, fid);
                                            deletedestination = deletedestination.TrimEnd('/').TrimStart('/');
                                            string str_ds = deletedestination;
                                            var arr_ds = str_ds.Split('/');
                                            var deletedestination_ds = UserHostAddress + "/" + string.Join("/", arr_ds.Skip(1));
                                            //remove file from soource
                                            AzureDocument.DeleteDocument(deletedestination, filename, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                                            AzureDocument.DeleteDocument(deletedestination_ds, filename, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                                            //for file version
                                            var getfileversion = db.usp_FIleVersionlist(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), fid).ToList();
                                            if (getfileversion.Count > 0)
                                            {
                                                foreach (var datas in getfileversion)
                                                {
                                                    var resultchild = AzureDocument.MoveFile(dpath, datas.fname, newAZureFileId, filedetails.AZureFileId.ToString(), LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), dirid, getdestrinationdetais.pfile.ToString());
                                                    if (resultchild == "true")
                                                    {
                                                        var dataresult2 = db.usp_SaveMoveFileFolderLog(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), datas.Id.ToString(), datas.fname, newAZureFileId, filedetails.AZureFileId, dirid, 1, 0, "", isNoticeParent);
                                                        AzureDocument.DeleteDocument(deletedestination, datas.fname, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                                                        AzureDocument.DeleteDocument(deletedestination_ds, datas.fname, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                                                    }
                                                }
                                                transaction.Commit();
                                                return Ok("1");
                                            }
                                            else
                                            {
                                                transaction.Commit();
                                                return Ok("1");
                                            }
                                        }
                                        else
                                        {
                                            //remove file from destination
                                            transaction.Rollback();
                                            return Ok("false");
                                        }
                                    }
                                    else
                                    {
                                        //remove file from destination
                                        return Ok("false");
                                    }
                                }
                                else
                                {
                                    return Ok("folder not found");
                                }
                            }
                            else
                            {
                                return Ok("Document not found");
                            }
                        }
                    }
                    else
                    {
                        //for root
                        if (dirid.ToString() == "00000000-0000-0000-0000-000000000000")
                        {
                            var checkassignfile = db.FirmFilePermissionClouds.Where(x => x.FileId.ToString() == fid.ToString()).FirstOrDefault();
                            if (checkassignfile != null)
                            {
                                return Ok("assign");
                            }
                            else
                            {
                                string UserHostAddress = WebConfigurationManager.AppSettings["UserHostAddress"];
                                dpath = "WorkSpace" + "/" + LoggedInUser.FirmId.ToString() + "/" + LoggedInUser.UserId.ToString();
                                string str = dpath;
                                var arr = str.Split('/');
                                dpath_ds = UserHostAddress + "/" + string.Join("/", arr.Skip(1));
                                var filedetails = db.usp_CheckFilefolderCloud(LoggedInUser.FirmId.ToString(), fid).FirstOrDefault();
                                if (filedetails != null)
                                {
                                    filename = filedetails.fname;
                                    var result = AzureDocument.MoveFile(dpath, filename, dpath, filedetails.AZureFileId.ToString(), LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), dirid, filedetails.pfile.ToString());
                                    if (result == "exist")
                                    {
                                        return Ok(new { status = "documentalreadyexist", filename = filename });

                                    }
                                    else if (result == "true")
                                    {
                                        //update in db
                                        var newAZureFileId = "";
                                        if (dirid.ToString() == Guid.Empty.ToString())
                                        {
                                            newAZureFileId = "WorkSpace" + "/" + LoggedInUser.FirmId.ToString() + "/" + LoggedInUser.UserId.ToString();
                                        }

                                        var data = db.usp_SaveMoveFileFolderLog(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), fid, filename, newAZureFileId, filedetails.AZureFileId, dirid, 1, 0, "", isNoticeParent);
                                        if (data > 0)
                                        {
                                            var deldpath = filedetails.AZureFileId.ToString();
                                            string str1 = deldpath;
                                            var arr1 = str1.Split('/');
                                            var deldpath_ds = UserHostAddress + "/" + string.Join("/", arr1.Skip(1));
                                            AzureDocument.DeleteDocument(deldpath, filename, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                                            AzureDocument.DeleteDocument(deldpath_ds, filename, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                                            //for file version
                                            var getfileversion = db.usp_FIleVersionlist(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), fid).ToList();
                                            if (getfileversion.Count > 0)
                                            {
                                                foreach (var datas in getfileversion)
                                                {
                                                    var resultchild = AzureDocument.MoveFile(dpath, datas.fname, dpath, filedetails.AZureFileId.ToString(), LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), dirid, filedetails.pfile.ToString());

                                                    if (resultchild == "true")
                                                    {
                                                        var dataresult2 = db.usp_SaveMoveFileFolderLog(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), datas.Id.ToString(), datas.fname, newAZureFileId, filedetails.AZureFileId, dirid, 1, 0, "", isNoticeParent);
                                                        AzureDocument.DeleteDocument(deldpath, datas.fname, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                                                        AzureDocument.DeleteDocument(deldpath_ds, datas.fname, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                                                    }
                                                }
                                                transaction.Commit();
                                                return Ok("1");
                                            }
                                            else
                                            {
                                                transaction.Commit();
                                                return Ok("1");
                                            }
                                        }
                                        else
                                        {
                                            //remove file from destination
                                            transaction.Rollback();
                                            return Ok("false");
                                        }
                                    }
                                    else
                                    {
                                        //remove file from destination
                                        return Ok("false");
                                    }
                                }
                                else
                                {
                                    return Ok("Document not found");
                                }
                            }
                        }
                    }
                    return Ok("Document not found");
                }
                catch (Exception ex)
                {
                    db1.usp_AddAuditError(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                    return Ok("Object reference not set to an instance of an object.");
                }
            }
        }
        // move Directory
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SaveMoveFolder()
        {
            var db = new LawPracticeEntities();
            using (var transaction = db.Database.BeginTransaction())
            {
                try
                {
                    var dpath = "";
                    var dpath_ds = "";
                    var foldername = "";
                    var filename = "";
                    var isNoticeParent = "";
                    var fid = Request.Headers.GetValues("fid").FirstOrDefault();

                    var dirid = Request.Headers.GetValues("dirid").FirstOrDefault();
                    if (dirid.ToString() == "0")
                    {
                        dirid = "00000000-0000-0000-0000-000000000000";
                    }
                    var newdirpath = Request.Headers.GetValues("dirpath").FirstOrDefault();
                    var chckowner = db.usp_CheckFilefolderCloud(LoggedInUser.FirmId.ToString(), dirid).FirstOrDefault();

                    if (chckowner != null) //for non root
                    {
                        var chkowner1 = chckowner.Firmuser.ToString();
                        isNoticeParent = chckowner.IsNoticeParent.ToString();
                        if (chckowner.Firmuser.ToString() == Guid.Empty.ToString())
                        {
                            return Ok("UnauthorizedNotice");
                        }
                        var checkassignfile = db.FirmFilePermissionClouds.Where(x => x.FileId.ToString() == fid.ToString()).FirstOrDefault();
                        if (checkassignfile != null)
                        {
                            return Ok("assign");
                        }
                        if (chckowner.fpermission == "1")
                        {
                            return Ok("Sync");
                        }
                        else
                        {
                            string UserHostAddress = WebConfigurationManager.AppSettings["UserHostAddress"];
                            var filedetails = db.usp_CheckFilefolderCloud(LoggedInUser.FirmId.ToString(), fid).FirstOrDefault();
                            if (filedetails != null)
                            {
                                dpath = filedetails.AZureFileId.TrimEnd('/').TrimStart('/');
                                string str = dpath;
                                var arr = str.Split('/');
                                dpath_ds = UserHostAddress + "/" + string.Join("/", arr.Skip(1));

                                filename = filedetails.fname;
                                var DestinationPath = "";
                                var SourcePath = "";
                                var getdestrinationdetais = db.usp_CheckFilefolderCloud(LoggedInUser.FirmId.ToString(), dirid).FirstOrDefault();
                                if (getdestrinationdetais != null)
                                {
                                    if (getdestrinationdetais.Id.ToString().ToLower() == filedetails.Id.ToString().ToLower())
                                    {
                                        return Ok("sdequal");
                                    }
                                    //for get source path
                                    if (filedetails.pfile.ToString() == Guid.Empty.ToString())
                                    {
                                        SourcePath = dpath + "/" + filedetails.fname;
                                    }
                                    else
                                    {
                                        SourcePath = dpath;
                                    }
                                    if (String.IsNullOrEmpty(getdestrinationdetais.Caseid))
                                    {
                                        //for get destination path
                                        if (getdestrinationdetais.pfile.ToString() == Guid.Empty.ToString())
                                        {
                                            DestinationPath = getdestrinationdetais.AZureFileId.TrimEnd('/').TrimStart('/') + "/" + getdestrinationdetais.fname + "/" + filename;
                                        }
                                        else
                                        {
                                            DestinationPath = getdestrinationdetais.AZureFileId.TrimEnd('/').TrimStart('/') + "/" + filename;
                                        }
                                    }
                                    else
                                    {
                                        if (getdestrinationdetais.pfile.ToString() == Guid.Empty.ToString())
                                        {
                                            DestinationPath = getdestrinationdetais.AZureFileId + "/" + filename;
                                        }
                                        else
                                        {
                                            DestinationPath = getdestrinationdetais.AZureFileId + "/" + filename;
                                        }
                                    }
                                    var result = AzureDocument.MoveFolder(dpath, filename, DestinationPath, SourcePath, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), dirid, filedetails.pfile.ToString());
                                    if (result == "exist")
                                    {
                                        return Ok(new { status = "documentalreadyexist", filename = filename });
                                    }
                                    else if (result == "true")
                                    {
                                        var data = db.usp_SaveMoveFileFolderLog(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), fid, filename, DestinationPath, filedetails.AZureFileId, dirid, 0, 0, "", isNoticeParent);
                                        if (data > 0)
                                        {
                                            string notification = LoggedInUser.UserFullName + " has moved " + filename + " folder to " + getdestrinationdetais.fname + " folder.";
                                            db.usp_AddActivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), notification, "Move Folder", null, dirid);
                                            var newAZureFileId_dl = "";
                                            var newAZureFileId_ds_dl = "";
                                            newAZureFileId_dl = SourcePath;
                                            string str3 = SourcePath;
                                            var arr3 = str3.Split('/');
                                            newAZureFileId_ds_dl = UserHostAddress + "/" + string.Join("/", arr3.Skip(1));
                                            //remove file from soource
                                            AzureDocument.RemoveFolderMove(newAZureFileId_dl, filename, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), filedetails.pfile.ToString());
                                            AzureDocument.RemoveFolderMove(newAZureFileId_ds_dl, filename, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), filedetails.pfile.ToString());
                                            transaction.Commit();
                                            return Ok("1");
                                        }
                                        else
                                        {
                                            //remove file from destination
                                            transaction.Rollback();
                                            return Ok("false");
                                        }
                                    }
                                }
                                else
                                {
                                    return Ok("false");
                                }
                                return Ok("Folder not found");
                            }
                            else
                            {
                                return Ok("Document not found");
                            }
                        }
                    }
                    else
                    {
                        //for root
                        if (dirid.ToString() == "00000000-0000-0000-0000-000000000000")
                        {
                            var checkassignfile = db.FirmFilePermissionClouds.Where(x => x.FileId.ToString() == fid.ToString()).FirstOrDefault();
                            if (checkassignfile != null)
                            {
                                return Ok("assign");
                            }
                            else
                            {
                                string UserHostAddress = WebConfigurationManager.AppSettings["UserHostAddress"];
                                dpath = "WorkSpace" + "/" + LoggedInUser.FirmId.ToString() + "/" + LoggedInUser.UserId.ToString();
                                string str = dpath;
                                var arr = str.Split('/');
                                dpath_ds = UserHostAddress + "/" + string.Join("/", arr.Skip(1));
                                var filedetails = db.usp_CheckFilefolderCloud(LoggedInUser.FirmId.ToString(), fid).FirstOrDefault();
                                if (filedetails != null)
                                {
                                    if (dpath.ToString().ToLower().TrimEnd('/').TrimStart('/') == filedetails.Id.ToString().ToLower().TrimEnd('/').TrimStart('/'))
                                    {
                                        return Ok("sdequal");
                                    }
                                    filename = filedetails.fname;
                                    var newAZureFileId = "";
                                    if (dirid.ToString() == Guid.Empty.ToString())
                                    {
                                        newAZureFileId = dpath + "/" + filename;
                                    }
                                    var result = AzureDocument.MoveFolder(dpath, filename, newAZureFileId, filedetails.AZureFileId.ToString(), LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), dirid, filedetails.pfile.ToString());
                                    if (result == "exist")
                                    {
                                        return Ok(new { status = "documentalreadyexist", filename = filename });

                                    }
                                    else if (result == "true")
                                    {
                                        //update in db
                                        if (dirid.ToString() == Guid.Empty.ToString())
                                        {
                                            newAZureFileId = dpath + "/" + filename;
                                        }
                                        var data = db.usp_SaveMoveFileFolderLog(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), fid, filename, newAZureFileId, filedetails.AZureFileId, dirid, 0, 1, dpath, isNoticeParent);
                                        if (data > 0)
                                        {
                                            var deldpath = filedetails.AZureFileId.ToString();
                                            string str1 = deldpath;
                                            var arr1 = str1.Split('/');
                                            var deldpath_ds = UserHostAddress + "/" + string.Join("/", arr1.Skip(1));
                                            AzureDocument.RemoveFolderMove(deldpath, filename, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), "");
                                            AzureDocument.RemoveFolderMove(deldpath_ds, filename, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), "");
                                            transaction.Commit();
                                            return Ok("1");
                                        }
                                        else
                                        {
                                            //remove file from destination
                                            transaction.Rollback();
                                            return Ok("false");
                                        }
                                    }
                                    else
                                    {
                                        //remove file from destination
                                        return Ok("false");
                                    }
                                }
                                else
                                {
                                    return Ok("Document not found");
                                }
                            }
                        }
                    }
                    return Ok("Document not found");
                }
                catch (Exception ex)
                {
                    db1.usp_AddAuditError(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                    return Ok("Object reference not set to an instance of an object.");
                }
            }
        }

        /// <summary>
        /// Sign copy
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult Signcopy()
        {
            var filename = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filename"]);
            var signtype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["signtype"]);
            var UserId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["userid"]);
            var DocNumber = QueryAES.UrlDecode(HttpContext.Current.Request.Form["docid"]);
            var DocName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["docname"]);
            var username = QueryAES.UrlDecode(HttpContext.Current.Request.Form["username"]);
            var pageselect = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pageselect"]);

            if (String.IsNullOrEmpty(DocNumber))
            {
                DocNumber = Guid.Empty.ToString();
                DocName = "Drive";
            }
            try
            {
                var result = Repository.Matter.ApplyDigitalSign(filename, signtype, UserId, DocNumber, DocName, username, pageselect, LoggedInUser.FirmId.ToString(), LoggedInUser.UserFullName);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Sign copy Cloud
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SigncopyCloud()
        {
            var filename = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filename"]);
            var signtype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["signtype"]);
            var UserId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["userid"]);
            var DocNumber = QueryAES.UrlDecode(HttpContext.Current.Request.Form["docid"]);
            var DocName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["docname"]);
            var username = QueryAES.UrlDecode(HttpContext.Current.Request.Form["username"]);
            var pageselect = QueryAES.UrlDecode(HttpContext.Current.Request.Form["pageselect"]);
            var Filetype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Filetype"]);
            var Uid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Uid"]);
            var Cordinatetype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Cordinatetype"]);
            try
            {
                var result = Repository.Matter.ApplyDigitalSignCloud(filename, signtype, UserId, DocNumber, DocName, username, pageselect, LoggedInUser.FirmId.ToString(), LoggedInUser.UserFullName, Filetype, Uid, Cordinatetype);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// ESign File Deatils
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ESignFileDeatils()
        {
            var token = QueryAES.UrlDecode(HttpContext.Current.Request.Form["token"]);
            var db = new LawPracticeEntities();
            var data = db.Usp_FileDetailsCloud(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), token.ToString()).ToList();
            var list = db.get_digital_signature_value("", LoggedInUser.UserId.ToString(), "", LoggedInUser.FirmId.ToString()).ToList();

            var a = JsonConvert.SerializeObject(data);
            var b = JsonConvert.SerializeObject(list);
            var daata = new { a = a, b = b };
            return Ok(daata);
        }

        /// <summary>
        /// Digital Sign Doc List
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult DigitalSignDocList()
        {
            try
            {
                var db = new LawPracticeEntities();
                var list = db.Usp_GetDigitalSignatureList("", LoggedInUser.UserId.ToString(), "", LoggedInUser.FirmId.ToString()).ToList();
                var b = JsonConvert.SerializeObject(list);
                return Ok(b);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// User Directory List1 by CheckOut row id
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult UserDirectoryList1byCheckOutrowid()
        {
            try
            {
                int pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                int pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                var search = QueryAES.UrlDecode(HttpContext.Current.Request.Form["search"]);
                var user = LoggedInUser.UserId.ToString();
                var searchtype = "";
                int roleid = 0;
                var dirtoken = "00000000-0000-0000-0000-000000000000";
                string pfile = dirtoken;
                string firmid = LoggedInUser.FirmId.ToString();
                string userid = LoggedInUser.UserId.ToString();
                if (LoggedInUser.RoleId == 1)
                {
                    var checkuserrole = db1.usp_CheckUserRoleCloud(LoggedInUser.FirmId.ToString(), user.ToString()).FirstOrDefault();
                    if (checkuserrole != null)
                    {
                        roleid = 1;
                        userid = checkuserrole.Id.ToString();
                    }
                }
                else
                {
                    var checkuserrole = db1.usp_CheckUserRoleCloud(LoggedInUser.FirmId.ToString(), user.ToString()).FirstOrDefault();
                    if (checkuserrole != null)
                    {
                        roleid = Convert.ToInt32(checkuserrole.RoleId);
                        userid = checkuserrole.Id.ToString();
                    }
                }
                if (search == "")
                {
                    var data = Repository.Matter.UserCheckoutLoadDirectorybyrowid(pfile, firmid, userid, pagenum, pagesize, roleid);
                    var param = controllername + ">UserDirectoryList1byCheckOutrowid>UserCheckoutLoadDirectorybyrowid>param=" + pfile + "@" + firmid + "@" + userid;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");

                    return Ok(data);
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
            return Ok();
        }

        /// <summary>
        /// User Directory List by case
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult UserDirectoryListbycase()
        {
            try
            {
                var caseid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Caseid"]);
                try
                {
                    caseid = caseid.Replace(" ", "+");
                    caseid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(caseid));
                }
                catch
                {

                }
                var dirtoken = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dirtoken"]);
                int pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                int pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                var search = QueryAES.UrlDecode(HttpContext.Current.Request.Form["search"]);
                var user = QueryAES.UrlDecode(HttpContext.Current.Request.Form["user"]);
                var searchtype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["searchtype"]);
                int roleid = 0;
                if (dirtoken != null)
                {
                    if (dirtoken == "0")
                    {
                        dirtoken = "00000000-0000-0000-0000-000000000000";
                    }
                    string pfile = dirtoken;
                    string firmid = LoggedInUser.FirmId.ToString();
                    string userid = LoggedInUser.UserId.ToString();
                    if (user != "")
                    {
                        if (LoggedInUser.RoleId == 1)
                        {
                            var checkuserrole = db1.usp_CheckUserRoleCloud(LoggedInUser.FirmId.ToString(), user.ToString()).FirstOrDefault();
                            if (checkuserrole != null)
                            {
                                roleid = 2;
                                userid = checkuserrole.Id.ToString();
                            }
                        }
                        else
                        {
                            var checkuserrole = db1.usp_CheckUserRoleCloud(LoggedInUser.FirmId.ToString(), user.ToString()).FirstOrDefault();
                            if (checkuserrole != null)
                            {
                                roleid = Convert.ToInt32(checkuserrole.RoleId);
                                userid = checkuserrole.Id.ToString();
                            }
                        }
                    }
                    else
                    {
                        var checkuserrole = db1.usp_CheckUserRoleCloud(LoggedInUser.FirmId.ToString(), userid.ToString()).FirstOrDefault();
                        if (checkuserrole != null)
                        {
                            roleid = Convert.ToInt32(checkuserrole.RoleId);
                        }
                    }
                    if (search == "")
                    {
                        var data = Repository.Matter.UserLoadDirectorybyrowidCloud(pfile, firmid, userid, pagenum, pagesize, roleid);
                        var param = controllername + ">UserDirectoryList1byrowid>UserLoadDirectorybyrowid>param=" + pfile + "@" + firmid + "@" + userid;
                        db1.usp_AddAudit(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                        return Ok(data);
                    }
                    else
                    {
                        if (searchtype == "1")
                        {
                            var data = Repository.Matter.UserLoadDirectorybyrowidCloudforcaseid(caseid, firmid, userid, pagenum, pagesize, roleid, search);
                            return Ok(data);
                        }
                        else
                        {
                            var db = new LawPracticeEntities();
                            int pageid = 0;
                            var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString("directorylist/0")).FirstOrDefault();
                            if (pagelist != null)
                            {
                                pageid = Convert.ToInt32(pagelist.ParentPage);
                            }
                            List<sp_GetSearchFilesAndDirectorybyCaseIdCloudInOut_DocIndex2_Result> list = new List<sp_GetSearchFilesAndDirectorybyCaseIdCloudInOut_DocIndex2_Result>();
                            list = db.sp_GetSearchFilesAndDirectorybyCaseIdCloudInOut_DocIndex2(Guid.Parse(firmid), Guid.Parse(userid), pagenum, pagesize, caseid, roleid, search, pageid).ToList();
                            var a = JsonConvert.SerializeObject(list);
                            return Ok(a);
                        }
                    }
                }
                else
                {
                    return Ok();
                }
            }
            catch (Exception ex)
            {

                db1.usp_AddAuditError(Convert.ToInt32(EventType.FileDirectory), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.FileDirectory), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
    }
}
