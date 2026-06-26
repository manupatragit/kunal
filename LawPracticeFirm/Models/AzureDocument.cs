using Azure.Storage.Files.Shares;
using DataAccess.Modals;
using Microsoft.Azure.Storage;
using Microsoft.Azure.Storage.Auth;
using Microsoft.Azure.Storage.File;
using Microsoft.Azure.Storage.File.Protocol;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Configuration;

namespace LawPracticeFirm.Models
{
    /// <summary>
    /// Azure document
    /// </summary>
    public class AzureDocument
    {
        static string AzureStorageName = WebConfigurationManager.AppSettings["AzureStorageName"];
        static string AzureStorageKey = WebConfigurationManager.AppSettings["AzureStorageKey"];
        static string azureroot = "mykase";
        static string azuredir = "WorkSpace";
        static string isdefault = "";
        static string azureProtocol = "https";
        /// <summary>
        /// Check string
        /// </summary>
        public static void checkstring()
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            var fids = HttpContext.Current.Session["sessionfirmid"];
            var uids = HttpContext.Current.Session["sessionuserid"];
            LogService("firmidschk=" + fids);
            LogService("useridschk=" + uids);
            var db = new LawPracticeEntities();
            var data = db.usp_getazurestring(fids.ToString(), uids.ToString()).FirstOrDefault();
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
        /// Calculate size2
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public static string CalculateSize2(string firmid, string userid)
        {
            checkstring();
            string azurerootuser = "WorkSpace" + "/" + firmid.ToString();
            string azurerootuserds = "LawPractice_ds" + "/" + firmid.ToString();
            var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
            var account = new CloudStorageAccount(cred, true);
            var client = account.CreateCloudFileClient();
            var sharenbame = "mykase";
            CloudFileShare share = client.GetShareReference(sharenbame);
            ShareStats stats = share.GetStats();
            Console.WriteLine("Current file share usage: {0} GB, maximum size: {1} GB", stats.Usage.ToString(), share.Properties.Quota);
            return stats.Usage.ToString();
        }
        /// <summary>
        /// Calculate size
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public static string CalculateSize(string firmid, string userid)
        {
            checkstring();
            string azurerootuser = "WorkSpace" + "/" + firmid.ToString();
            string azurerootuserds = "LawPractice_ds" + "/" + firmid.ToString();
            var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
            var account = new CloudStorageAccount(cred, true);
            var client = account.CreateCloudFileClient();
            var share = client.GetShareReference(azureroot);
            share.CreateIfNotExists();
            var cloudFileDirectory = share.GetRootDirectoryReference();
            var stats = cloudFileDirectory.Share.GetStats();
            Console.WriteLine("Current file share usage: {0} GB, maximum size: {1} GB", stats.Usage.ToString(), share.Properties.Quota);
            //Specify the nested folder
            CloudFileDirectory rootDir = cloudFileDirectory.GetDirectoryReference(azurerootuser);
            long bytesCount = 0;
            FileShareByteCount(rootDir, ref bytesCount);
            double totsizes = (bytesCount / (1024.0));
            Double dc = Math.Round((Double)totsizes, 2);
            //lawpractice_ds
            CloudFileDirectory rootDir_ds = cloudFileDirectory.GetDirectoryReference(azurerootuserds);
            long bytesCount_ds = 0;
            FileShareByteCount(rootDir_ds, ref bytesCount_ds);
            double totsizes_ds = (bytesCount_ds / (1024.0));
            Double dc_ds = Math.Round((Double)totsizes_ds, 2);
            double finaltotal_dc = dc + dc_ds;
            finaltotal_dc = Math.Round((Double)finaltotal_dc, 2);
            return finaltotal_dc.ToString();
        }
        /// <summary>
        /// File share byte count
        /// </summary>
        /// <param name="dir"></param>
        /// <param name="bytesCount"></param>
        static void FileShareByteCount(CloudFileDirectory dir, ref long bytesCount)
        {
            FileContinuationToken continuationToken = null;
            FileResultSegment resultSegment = null;
            do
            {
                resultSegment = dir.ListFilesAndDirectoriesSegmented(100, continuationToken, null, null);
                if (resultSegment.Results.Count() > 0)
                {
                    foreach (var item in resultSegment.Results)
                    {
                        if (item.GetType() == typeof(CloudFileDirectory))
                        {
                            var CloudFileDirectory = item as CloudFileDirectory;
                            Console.WriteLine($" List sub CloudFileDirectory with name：[{CloudFileDirectory.Name}]");
                            FileShareByteCount(CloudFileDirectory, ref bytesCount);
                        }
                        else if (item.GetType() == typeof(CloudFile))
                        {
                            var CloudFile = item as CloudFile;
                            Console.WriteLine($"file name：[{CloudFile.Name}]，size：{CloudFile.Properties.Length}B");
                            bytesCount += CloudFile.Properties.Length;
                        }
                    }
                }
            } while (continuationToken != null);
        }
        /// <summary>
        /// Create root
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        public static void creatroot(string firmid, string userid)
        {
            checkstring();
            string azurerootuser = "WorkSpace" + "/" + firmid.ToString() + "/" + userid.ToString();
            string azurerootuserds = "LawPractice_ds" + "/" + firmid + "/" + userid.ToString();
            var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
            var account = new CloudStorageAccount(cred, true);
            var client = account.CreateCloudFileClient();
            var share = client.GetShareReference(azureroot);
            share.CreateIfNotExists();
            var cloudFileDirectory = share.GetRootDirectoryReference();
            //Specify the nested folder
            var nestedFolderStructure = azurerootuser;
            var delimiter = new char[] { '/' };
            var nestedFolderArray = nestedFolderStructure.Split(delimiter);
            for (var i = 0; i < nestedFolderArray.Length; i++)
            {
                cloudFileDirectory = cloudFileDirectory.GetDirectoryReference(nestedFolderArray[i]);
                cloudFileDirectory.CreateIfNotExists();
            }
            var cred1 = new StorageCredentials(AzureStorageName, AzureStorageKey);
            var account1 = new CloudStorageAccount(cred1, true);
            var client1 = account1.CreateCloudFileClient();
            var share1 = client1.GetShareReference(azureroot);
            share1.CreateIfNotExists();
            var cloudFileDirectory1 = share1.GetRootDirectoryReference();
            //Specify the nested folder
            var nestedFolderStructure1 = azurerootuserds;
            var delimiter1 = new char[] { '/' };
            var nestedFolderArray1 = nestedFolderStructure1.Split(delimiter1);
            for (var i = 0; i < nestedFolderArray1.Length; i++)
            {
                cloudFileDirectory1 = cloudFileDirectory1.GetDirectoryReference(nestedFolderArray1[i]);
                cloudFileDirectory1.CreateIfNotExists();
            }
        }
        /// <summary>
        /// Create folder
        /// </summary>
        /// <param name="dpath"></param>
        /// <param name="foldername"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public static string createfolder(string dpath, string foldername, string firmid, string userid)
        {
            checkstring();
            var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
            var account = new CloudStorageAccount(cred, true);
            var client = account.CreateCloudFileClient();
            if (!String.IsNullOrEmpty(dpath))
            {
                foldername = dpath + "/" + foldername;
                foldername = foldername.TrimEnd('/').TrimStart('/');
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
                string azurerootuser = azuredir + "/" + firmid + "/" + userid;
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
        /// Delete folder
        /// </summary>
        /// <param name="dpath"></param>
        /// <param name="Name"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string DeleteFolder(string dpath, string Name, string firmid, string userid)
        {
            try
            {
                checkstring();
                Uri uri = new Uri(Name);
                string filename = System.IO.Path.GetFileName(uri.LocalPath);
                if (String.IsNullOrEmpty(dpath))
                {
                    string azurerootuser = azuredir + "/" + firmid + "/" + userid;
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
                    // cloudFileDirectory.CreateIfNotExists();
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
                    // cloudFileDirectory.CreateIfNotExists();
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
        /// Delete file
        /// </summary>
        /// <param name="dpath"></param>
        /// <param name="Name"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        public static void DeleteFile(string dpath, string Name, string firmid, string userid)
        {
            checkstring();
            Uri uri = new Uri(Name);
            string filename = System.IO.Path.GetFileName(uri.LocalPath);
            if (String.IsNullOrEmpty(dpath))
            {
                string azurerootuser = azuredir + "/" + firmid + "/" + userid;
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
                // cloudFileDirectory.CreateIfNotExists();
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
                // cloudFileDirectory.CreateIfNotExists();
                //Create a reference to the filename that you will be uploading
                CloudFile cloudFile = cloudFileDirectory.GetFileReference(filename);
                cloudFile.Delete();
            }
        }
        public static string Dirfilepath(string dpath, string filename, string fakepathin, string fakepathout, string firmid, string userid)
        {
            checkstring();
            if (!String.IsNullOrEmpty(dpath))
            {
                var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
                var account = new CloudStorageAccount(cred, true);
                var client = account.CreateCloudFileClient();
                var share = client.GetShareReference(azureroot);
                var cloudFileDirectory = share.GetRootDirectoryReference().GetDirectoryReference(dpath);
                CloudFile cloudFile = cloudFileDirectory.GetFileReference(filename);
                LogService("dffd" + fakepathin + "\\" + filename + "@" + dpath + "@" + filename);
                cloudFile.DownloadToFile(fakepathin + "\\" + filename, FileMode.Create);
            }
            else
            {
                string azurerootuser = azuredir + "/" + firmid + "/" + userid;
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
            try
            {
                File.Delete(input);
            }
            catch (Exception err)
            {
                LogService("delete edit file=" + err.Message);
            }
            return output;
        }
        /// <summary>
        /// Folder exist
        /// </summary>
        /// <param name="dpath"></param>
        /// <param name="foldername"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="onlycheckexist"></param>
        /// <returns></returns>
        public static bool folderexist(string dpath, string foldername, string firmid, string userid, string onlycheckexist = null)
        {
            try
            {
                checkstring();
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
                        return true;
                    }
                    else
                    {
                        if (onlycheckexist != "1")
                        {
                            cloudFileDirectory.CreateIfNotExists();
                        }
                        return false;
                    }
                }
                else
                {
                    string azurerootuser = azuredir + "/" + firmid + "/" + userid;
                    foldername = azurerootuser + "/" + foldername;
                    var share = client.GetShareReference(azureroot);
                    share.CreateIfNotExists();
                    var cloudFileDirectory = share.GetRootDirectoryReference();
                    //Specify the nested folder
                    cloudFileDirectory = cloudFileDirectory.GetDirectoryReference(foldername);
                    if (cloudFileDirectory.Exists())
                    {
                        return true;
                    }
                    else
                    {
                        if (onlycheckexist != "1")
                        {
                            cloudFileDirectory.CreateIfNotExists();
                        }
                        return false;
                    }
                }
            }
            catch (Exception er)
            {
                LogService("FOlder eXIst:" + er.Message + "@" + er.InnerException + "@" + er.StackTrace);
                return false;
            }
        }
        /// <summary>
        /// Check file exist
        /// </summary>
        /// <param name="dpath"></param>
        /// <param name="filename"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public static bool fileexist(string dpath, string filename, string firmid, string userid)
        {
            checkstring();
            dpath = dpath.TrimEnd('/');
            var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
            var account = new CloudStorageAccount(cred, true);
            var client = account.CreateCloudFileClient();
            CloudStorageAccount storageAccount = new CloudStorageAccount(cred, true);
            // Create a reference to the file client.
            CloudFileClient fileClient = storageAccount.CreateCloudFileClient();
            var share = client.GetShareReference(azureroot);
            // Create a reference to the Azure path
            var cloudFileDirectory = share.GetRootDirectoryReference().GetDirectoryReference(dpath);
            //cloudFileDirectory.CreateIfNotExists();
            //Create a reference to the filename that you will be uploading
            CloudFile cloudFile = cloudFileDirectory.GetFileReference(filename);
            var fileext = Path.GetExtension(filename);
            //Open a stream from a local file.
            //Upload the file to Azure.
            if (cloudFile.Exists())
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        /// <summary>
        /// Log service
        /// </summary>
        /// <param name="content"></param>
        private static void LogService(string content)
        {
            var templogpath = HttpContext.Current.Server.MapPath("//");
            FileStream fs = new FileStream(templogpath + "//azurerename.txt", FileMode.OpenOrCreate, FileAccess.Write);
            StreamWriter sw = new StreamWriter(fs);
            sw.BaseStream.Seek(0, SeekOrigin.End);
            sw.WriteLine(content);
            sw.Flush();
            sw.Close();
        }
        /// <summary>
        /// Create file after edit
        /// </summary>
        /// <param name="output"></param>
        /// <param name="dpath"></param>
        /// <param name="filename"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public static bool filecreateafteredit(string output, string dpath, string filename, string firmid, string userid)
        {
            try
            {
                checkstring();
            }
            catch (Exception er)
            {
                LogService("errores=" + er.InnerException);
            }
            string azurerootuser = azuredir + "/" + firmid + "/" + userid;
            dpath = dpath.TrimEnd('/').TrimStart('/');
            LogService("azurerootuser=" + azurerootuser);
            LogService("dpath=" + dpath);
            LogService("filename=" + filename);
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
                cloudFileDirectory.CreateIfNotExists();
            }
            catch (Exception ex)
            {
            }
            //Create a reference to the filename that you will be uploading
            CloudFile cloudFile = cloudFileDirectory.GetFileReference(filename);
            var fileext = Path.GetExtension(filename);
            //Open a stream from a local file.
            //Upload the file to Azure.
            cloudFile.UploadFromFile(output);
            try
            {
                // System.IO.File.Delete(output);
            }
            catch (Exception ex)
            {
                LogService("errors=" + ex.Message);
            }
            return true;
        }
        /// <summary>
        /// Create nested directory
        /// </summary>
        /// <param name="azurerootuser"></param>
        public static void CreateNestedDirectory(string azurerootuser)
        {
            checkstring();
            var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
            var account = new CloudStorageAccount(cred, true);
            var client = account.CreateCloudFileClient();
            var share = client.GetShareReference(azureroot);
            share.CreateIfNotExists();
            var cloudFileDirectory = share.GetRootDirectoryReference();
            //Specify the nested folder
            var nestedFolderStructure = azurerootuser;
            var delimiter = new char[] { '/' };
            var nestedFolderArray = nestedFolderStructure.Split(delimiter);
            for (var i = 0; i < nestedFolderArray.Length; i++)
            {
                cloudFileDirectory = cloudFileDirectory.GetDirectoryReference(nestedFolderArray[i]);
                cloudFileDirectory.CreateIfNotExists();
            }
        }
        /// <summary>
        /// Insert document to elastic search
        /// </summary>
        /// <param name="Id"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="focfile"></param>
        /// <param name="doctitle"></param>
        /// <param name="docname"></param>
        /// <param name="mimetype"></param>
        /// <param name="filepath"></param>
        /// <returns></returns>
        public static bool insertdoctoelastic(string Id, string firmid, string userid, string focfile, string doctitle, string docname, string mimetype, string filepath)
        {
            dynamic data = null;
            var client = new WebClient();
            object inputf = new
            {
                Id = Id,
                FirmId = firmid,
                UserId = userid,
                DocFile = focfile,
                DocTitle = doctitle,
                DocName = docname,
                MimeType = mimetype,
                Filepath = filepath,
                Module = "1"
            };
            var dataString = JsonConvert.SerializeObject(inputf);
            client.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string json = client.UploadString(new Uri(WebConfigurationManager.AppSettings["ElasticSearchAdd"]), "POST", dataString);
            data = JObject.Parse(json);
            var tempstatus = data["Status"];
            if (tempstatus == true)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        /// <summary>
        /// Remove doc to elastic search
        /// </summary>
        /// <param name="Id"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public static bool removedoctoelastic(string Id, string firmid, string userid)
        {
            dynamic data = null;
            var client = new WebClient();
            object input = new
            {
                Id = Id,
                FirmId = firmid,
                UserId = userid
            };
            var dataString = JsonConvert.SerializeObject(input);
            client.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string json = client.UploadString(new Uri(WebConfigurationManager.AppSettings["ElasticSearchDelete"]), "POST", dataString);
            data = JObject.Parse(json);
            var tempstatus = data["Status"];
            if (tempstatus == true)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        /// <summary>
        /// Search elastic doc
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="searchtext"></param>
        /// <param name="azurepath"></param>
        /// <param name="roleid"></param>
        /// <param name="viewallpermission"></param>
        /// <returns></returns>
        public static string searchelasticdoc(string firmid, string userid, string searchtext, string azurepath, int roleid, string viewallpermission)
        {
            dynamic json = null;
            using (var client = new WebClient())
            {
                object input = new
                {
                    Id = "",
                    FirmId = firmid,
                    UserId = "",
                    DocTitle = "",
                    SearchText = searchtext,
                    Filepath = "",
                    Module = "1"
                };
                var dataString = JsonConvert.SerializeObject(input);
                client.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                json = client.UploadString(new Uri(WebConfigurationManager.AppSettings["ElasticSearch"]), "POST", dataString);
                return json;
            }
        }
        /// <summary>
        /// Message insert doc to elastic
        /// </summary>
        /// <param name="Id"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="focfile"></param>
        /// <param name="doctitle"></param>
        /// <param name="docname"></param>
        /// <param name="mimetype"></param>
        /// <param name="filepath"></param>
        /// <returns></returns>
        public static bool Messageinsertdoctoelastic(string Id, string firmid, string userid, string focfile, string doctitle, string docname, string mimetype, string filepath)
        {
            dynamic data = null;
            var client = new WebClient();
            object inputf = new
            {
                Id = Id,
                FirmId = firmid,
                UserId = userid,
                DocFile = focfile,
                DocTitle = doctitle,
                DocName = docname,
                MimeType = mimetype,
                Filepath = filepath,
                Module = "3"
            };
            var dataString = JsonConvert.SerializeObject(inputf);
            client.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string json = client.UploadString(new Uri(WebConfigurationManager.AppSettings["ElasticSearchAdd"]), "POST", dataString);
            data = JObject.Parse(json);
            var tempstatus = data["Status"];
            if (tempstatus == true)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        /// <summary>
        /// Message remove doc to elastic search
        /// </summary>
        /// <param name="Id"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public static bool Messageremovedoctoelastic(string Id, string firmid, string userid)
        {
            dynamic data = null;
            var client = new WebClient();
            object input = new
            {
                Id = Id,
                FirmId = firmid,
                UserId = userid
            };
            var dataString = JsonConvert.SerializeObject(input);
            client.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string json = client.UploadString(new Uri(WebConfigurationManager.AppSettings["ElasticSearchDelete"]), "POST", dataString);
            data = JObject.Parse(json);
            var tempstatus = data["Status"];
            if (tempstatus == true)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        /// <summary>
        /// Message search elastic doc
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="searchtext"></param>
        /// <param name="azurepath"></param>
        /// <returns></returns>
        public static string Messagesearchelasticdoc(string firmid, string userid, string searchtext, string azurepath)
        {
            dynamic json = null;
            using (var client = new WebClient())
            {
                object input = new
                {
                    Id = "",
                    FirmId = firmid,
                    UserId = userid,
                    DocTitle = "",
                    SearchText = searchtext,
                    Filepath = azurepath,
                    Module = "3"
                };
                var dataString = JsonConvert.SerializeObject(input);
                client.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                json = client.UploadString(new Uri(WebConfigurationManager.AppSettings["ElasticSearch"]), "POST", dataString);
                return json;
            }
        }
        /// <summary>
        /// Rename folder
        /// </summary>
        /// <param name="dpath"></param>
        /// <param name="foldername"></param>
        /// <param name="newfoldername"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pfile"></param>
        /// <returns></returns>
        public static bool RenameFolder(string dpath, string foldername, string newfoldername, string firmid, string userid, string pfile)
        {
            try
            {
                checkstring();
                string connectionString = string.Format("DefaultEndpointsProtocol={0};AccountName={1};AccountKey={2}",
                                  azureProtocol, AzureStorageName, AzureStorageKey);
                if (pfile.ToString() == Guid.Empty.ToString())
                {
                    foldername = dpath + "/" + foldername;
                    newfoldername = dpath + "/" + newfoldername;
                }
                else
                {
                    foldername = dpath;
                    var foldernametmp = dpath;
                    string str3 = foldernametmp;
                    var arr3 = str3.Split('/');
                    foldernametmp = string.Join("/", arr3.Take(arr3.Length - 1));
                    newfoldername = foldernametmp.TrimEnd('/').TrimStart('/') + "/" + newfoldername;
                }
                foldername = foldername.TrimEnd('/').TrimStart('/');
                newfoldername = newfoldername.TrimEnd('/').TrimStart('/');
                var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
                var account = new CloudStorageAccount(cred, true);
                var client = account.CreateCloudFileClient();
                //foldername = dpath + foldername;
                var share = client.GetShareReference(azureroot);
                share.CreateIfNotExists();
                var cloudFileDirectory = share.GetRootDirectoryReference();
                var cloudFileDirectorynew = share.GetRootDirectoryReference();
                //Specify the nested folder
                cloudFileDirectory = cloudFileDirectory.GetDirectoryReference(foldername);
                var fileList = cloudFileDirectory.ListFilesAndDirectories();
                //copy folder for workspace
                ShareDirectoryClient destDir = new ShareDirectoryClient(connectionString, azureroot, newfoldername);
                destDir.CreateIfNotExists();
                foreach (IListFileItem listItem in fileList)
                {
                    if (listItem.GetType() == typeof(CloudFile))
                    {
                        var SourceFile = foldername + "/" + ((Microsoft.Azure.Storage.File.CloudFile)listItem).Name.ToString();
                        var Targetfile = newfoldername + "/" + ((Microsoft.Azure.Storage.File.CloudFile)listItem).Name.ToString();
                        // Get a reference to the file we created previous
                        ShareFileClient sourceFile = new ShareFileClient(connectionString, azureroot, SourceFile);
                        ShareFileClient destFile = new ShareFileClient(connectionString, azureroot, Targetfile);
                        destFile.StartCopy(sourceFile.Uri);
                    }
                }
                //copy folder for lawpractice_ds
                string UserHostAddress = WebConfigurationManager.AppSettings["UserHostAddress"];
                var foldername_ds = foldername;
                string str = foldername_ds;
                var arr = str.Split('/');
                foldername_ds = UserHostAddress + "/" + string.Join("/", arr.Skip(1));
                var newfoldername_ds = newfoldername;
                string newstr = newfoldername_ds;
                var newarr = newstr.Split('/');
                newfoldername_ds = UserHostAddress + "/" + string.Join("/", newarr.Skip(1));
                ShareDirectoryClient destDir1 = new ShareDirectoryClient(connectionString, azureroot, foldername_ds);
                if (destDir1.Exists())
                {
                    var fileList1 = destDir1.GetFilesAndDirectories();
                    var nestedFolderStructure = newfoldername_ds;
                    var newstructuredpath = "";
                    var delimiter = new char[] { '/' };
                    var nestedFolderArray = nestedFolderStructure.Split(delimiter);
                    for (var i = 0; i < nestedFolderArray.Length; i++)
                    {
                        newstructuredpath = newstructuredpath + "/" + nestedFolderArray[i];
                        newstructuredpath = newstructuredpath.TrimEnd('/').TrimStart('/');
                        ShareDirectoryClient destDir_ds = new ShareDirectoryClient(connectionString, azureroot, newstructuredpath);
                        destDir_ds.CreateIfNotExists();
                    }
                    foreach (var listItem in fileList1)
                    {
                        if (listItem.IsDirectory)
                        {
                        }
                        else
                        {
                            var SourceFile1 = foldername_ds + "/" + listItem.Name.ToString();
                            var Targetfile1 = newfoldername_ds + "/" + listItem.Name.ToString();
                            // Get a reference to the file we created previous
                            ShareFileClient sourceFile1 = new ShareFileClient(connectionString, azureroot, SourceFile1);
                            ShareFileClient destFile1 = new ShareFileClient(connectionString, azureroot, Targetfile1);
                            destFile1.StartCopy(sourceFile1.Uri);
                        }
                    }
                }
                //copy folder for backup to workspace
                ShareDirectoryClient destDir11 = new ShareDirectoryClient(connectionString, azureroot, foldername);
                if (destDir11.Exists())
                {
                    var fileList2 = destDir11.GetFilesAndDirectories();
                    var basebakupfolder = "Backup/" + DateTime.Now.ToString("ddMMMyyyy") + "/" + foldername;
                    var nestedFolderStructure = basebakupfolder;
                    var newstructuredpath = "";
                    var delimiter = new char[] { '/' };
                    var nestedFolderArray = nestedFolderStructure.Split(delimiter);
                    for (var i = 0; i < nestedFolderArray.Length; i++)
                    {
                        newstructuredpath = newstructuredpath + "/" + nestedFolderArray[i];
                        newstructuredpath = newstructuredpath.TrimEnd('/').TrimStart('/');
                        ShareDirectoryClient destDirbackup = new ShareDirectoryClient(connectionString, azureroot, newstructuredpath);
                        destDirbackup.CreateIfNotExists();
                    }
                    foreach (var listItem in fileList2)
                    {
                        if (listItem.IsDirectory)
                        {
                        }
                        else
                        {
                            var SourceFilebk = foldername + "/" + listItem.Name.ToString();
                            var Targetfilebk = basebakupfolder + "/" + listItem.Name.ToString();
                            // Get a reference to the file we created previous
                            ShareFileClient sourceFilebk = new ShareFileClient(connectionString, azureroot, SourceFilebk);
                            ShareFileClient destFilebk = new ShareFileClient(connectionString, azureroot, Targetfilebk);
                            destFilebk.StartCopy(sourceFilebk.Uri);
                        }
                    }
                }
                //copy folder for backup to lawpract_ds
                ShareDirectoryClient destDir11_ds = new ShareDirectoryClient(connectionString, azureroot, foldername_ds);
                if (destDir11_ds.Exists())
                {
                    var fileList2 = destDir11_ds.GetFilesAndDirectories();
                    var basebakupfolder = "Backup/" + DateTime.Now.ToString("ddMMMyyyy") + "/" + foldername_ds;
                    var nestedFolderStructure = basebakupfolder;
                    var newstructuredpath = "";
                    var delimiter = new char[] { '/' };
                    var nestedFolderArray = nestedFolderStructure.Split(delimiter);
                    for (var i = 0; i < nestedFolderArray.Length; i++)
                    {
                        newstructuredpath = newstructuredpath + "/" + nestedFolderArray[i];
                        newstructuredpath = newstructuredpath.TrimEnd('/').TrimStart('/');
                        ShareDirectoryClient destDirbackup = new ShareDirectoryClient(connectionString, azureroot, newstructuredpath);
                        destDirbackup.CreateIfNotExists();
                    }
                    foreach (var listItem in fileList2)
                    {
                        if (listItem.IsDirectory)
                        {
                        }
                        else
                        {
                            var SourceFilebk = foldername_ds + "/" + listItem.Name.ToString();
                            var Targetfilebk = basebakupfolder + "/" + listItem.Name.ToString();
                            // Get a reference to the file we created previous
                            ShareFileClient sourceFilebk = new ShareFileClient(connectionString, azureroot, SourceFilebk);
                            ShareFileClient destFilebk = new ShareFileClient(connectionString, azureroot, Targetfilebk);
                            destFilebk.StartCopy(sourceFilebk.Uri);
                        }
                    }
                }
                return true;
            }
            catch (Exception er)
            {
                LogService("FOlder rename:" + er.Message + "@" + er.InnerException + "@" + er.StackTrace);
                return false;
            }
        }
        /// <summary>
        /// Renameold folder
        /// </summary>
        /// <param name="dpath"></param>
        /// <param name="foldername"></param>
        /// <param name="newfoldername"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public static bool RenameOldFolder(string dpath, string foldername, string newfoldername, string firmid, string userid)
        {
            try
            {
                var foldername1 = foldername;
                var newfoldername1 = newfoldername;
                var dpaths1 = dpath;
                var firstfoldername = foldername;
                var firstnewfoldername = newfoldername;
                checkstring();
                string connectionString = string.Format("DefaultEndpointsProtocol={0};AccountName={1};AccountKey={2}",
                                  azureProtocol, AzureStorageName, AzureStorageKey);
                foldername = dpath;
                newfoldername = dpath + "/" + newfoldername;
                foldername = foldername.TrimEnd('/').TrimStart('/');
                newfoldername = newfoldername.TrimEnd('/').TrimStart('/');
                var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
                var account = new CloudStorageAccount(cred, true);
                var client = account.CreateCloudFileClient();
                //foldername = dpath + foldername;
                var share = client.GetShareReference(azureroot);
                share.CreateIfNotExists();
                var cloudFileDirectory = share.GetRootDirectoryReference();
                var cloudFileDirectorynew = share.GetRootDirectoryReference();
                //Specify the nested folder
                cloudFileDirectory = cloudFileDirectory.GetDirectoryReference(foldername);
                var fileList = cloudFileDirectory.ListFilesAndDirectories();
                //copy folder for workspace
                ShareDirectoryClient destDir = new ShareDirectoryClient(connectionString, azureroot, newfoldername);
                destDir.CreateIfNotExists();
                foreach (IListFileItem listItem in fileList)
                {
                    if (listItem.GetType() == typeof(CloudFile))
                    {
                        var SourceFile = foldername + "/" + ((Microsoft.Azure.Storage.File.CloudFile)listItem).Name.ToString();
                        var Targetfile = newfoldername + "/" + ((Microsoft.Azure.Storage.File.CloudFile)listItem).Name.ToString();
                        // Get a reference to the file we created previous
                        ShareFileClient sourceFile = new ShareFileClient(connectionString, azureroot, SourceFile);
                        ShareFileClient destFile = new ShareFileClient(connectionString, azureroot, Targetfile);
                        destFile.StartCopy(sourceFile.Uri);
                    }
                }
                //copy folder for lawpractice_ds
                string UserHostAddress = WebConfigurationManager.AppSettings["UserHostAddress"];
                var foldername_ds = foldername;
                string str = foldername_ds;
                var arr = str.Split('/');
                foldername_ds = UserHostAddress + "/" + string.Join("/", arr.Skip(1));
                var newfoldername_ds = newfoldername;
                string newstr = newfoldername_ds;
                var newarr = newstr.Split('/');
                newfoldername_ds = UserHostAddress + "/" + string.Join("/", newarr.Skip(1));
                ShareDirectoryClient destDir1 = new ShareDirectoryClient(connectionString, azureroot, foldername_ds);
                if (destDir1.Exists())
                {
                    var fileList1 = destDir1.GetFilesAndDirectories();
                    var nestedFolderStructure = foldername_ds;
                    var newstructuredpath = "";
                    var delimiter = new char[] { '/' };
                    var nestedFolderArray = nestedFolderStructure.Split(delimiter);
                    for (var i = 0; i < nestedFolderArray.Length; i++)
                    {
                        newstructuredpath = newstructuredpath + "/" + nestedFolderArray[i];
                        newstructuredpath = newstructuredpath.TrimEnd('/').TrimStart('/');
                        ShareDirectoryClient destDir_ds = new ShareDirectoryClient(connectionString, azureroot, newstructuredpath);
                        destDir_ds.CreateIfNotExists();
                    }
                    foreach (var listItem in fileList1)
                    {
                        if (listItem.IsDirectory)
                        {
                        }
                        else
                        {
                            var SourceFile1 = foldername_ds + "/" + listItem.Name.ToString();
                            var Targetfile1 = newfoldername_ds + "/" + listItem.Name.ToString();
                            // Get a reference to the file we created previous
                            ShareFileClient sourceFile1 = new ShareFileClient(connectionString, azureroot, SourceFile1);
                            ShareFileClient destFile1 = new ShareFileClient(connectionString, azureroot, Targetfile1);
                            destFile1.StartCopy(sourceFile1.Uri);
                        }
                    }
                }
                //copy folder for backup to workspace
                ShareDirectoryClient destDir11 = new ShareDirectoryClient(connectionString, azureroot, foldername);
                if (destDir11.Exists())
                {
                    var fileList2 = destDir11.GetFilesAndDirectories();
                    var basebakupfolder = "Backup/" + DateTime.Now.ToString("ddMMMyyyy") + "/" + foldername;
                    var nestedFolderStructure = basebakupfolder;
                    var newstructuredpath = "";
                    var delimiter = new char[] { '/' };
                    var nestedFolderArray = nestedFolderStructure.Split(delimiter);
                    for (var i = 0; i < nestedFolderArray.Length; i++)
                    {
                        newstructuredpath = newstructuredpath + "/" + nestedFolderArray[i];
                        newstructuredpath = newstructuredpath.TrimEnd('/').TrimStart('/');
                        ShareDirectoryClient destDirbackup = new ShareDirectoryClient(connectionString, azureroot, newstructuredpath);
                        destDirbackup.CreateIfNotExists();
                    }
                    foreach (var listItem in fileList2)
                    {
                        if (listItem.IsDirectory)
                        {
                        }
                        else
                        {
                            var SourceFilebk = foldername + "/" + listItem.Name.ToString();
                            var Targetfilebk = basebakupfolder + "/" + listItem.Name.ToString();
                            // Get a reference to the file we created previous
                            ShareFileClient sourceFilebk = new ShareFileClient(connectionString, azureroot, SourceFilebk);
                            ShareFileClient destFilebk = new ShareFileClient(connectionString, azureroot, Targetfilebk);
                            destFilebk.StartCopy(sourceFilebk.Uri);
                        }
                    }
                }
                //copy folder for backup to lawpract_ds
                ShareDirectoryClient destDir11_ds = new ShareDirectoryClient(connectionString, azureroot, foldername_ds);
                if (destDir11_ds.Exists())
                {
                    var fileList2 = destDir11_ds.GetFilesAndDirectories();
                    var basebakupfolder = "Backup/" + DateTime.Now.ToString("ddMMMyyyy") + "/" + foldername_ds;
                    var nestedFolderStructure = basebakupfolder;
                    var newstructuredpath = "";
                    var delimiter = new char[] { '/' };
                    var nestedFolderArray = nestedFolderStructure.Split(delimiter);
                    for (var i = 0; i < nestedFolderArray.Length; i++)
                    {
                        newstructuredpath = newstructuredpath + "/" + nestedFolderArray[i];
                        newstructuredpath = newstructuredpath.TrimEnd('/').TrimStart('/');
                        ShareDirectoryClient destDirbackup = new ShareDirectoryClient(connectionString, azureroot, newstructuredpath);
                        destDirbackup.CreateIfNotExists();
                    }
                    foreach (var listItem in fileList2)
                    {
                        if (listItem.IsDirectory)
                        {
                        }
                        else
                        {
                            var SourceFilebk = foldername_ds + "/" + listItem.Name.ToString();
                            var Targetfilebk = basebakupfolder + "/" + listItem.Name.ToString();
                            // Get a reference to the file we created previous
                            ShareFileClient sourceFilebk = new ShareFileClient(connectionString, azureroot, SourceFilebk);
                            ShareFileClient destFilebk = new ShareFileClient(connectionString, azureroot, Targetfilebk);
                            destFilebk.StartCopy(sourceFilebk.Uri);
                        }
                    }
                }
                //move new uploaded files
                try
                {
                    foldername = foldername1;
                    newfoldername = newfoldername1;
                    dpath = dpaths1;
                    foldername = dpath + "/" + foldername;
                    newfoldername = dpath + "/" + newfoldername;
                    foldername = foldername.TrimEnd('/').TrimStart('/');
                    newfoldername = newfoldername.TrimEnd('/').TrimStart('/');
                    var cred1 = new StorageCredentials(AzureStorageName, AzureStorageKey);
                    var account1 = new CloudStorageAccount(cred, true);
                    var client1 = account.CreateCloudFileClient();
                    //foldername = dpath + foldername;
                    var share1 = client.GetShareReference(azureroot);
                    share1.CreateIfNotExists();
                    var cloudFileDirectory1 = share.GetRootDirectoryReference();
                    var cloudFileDirectorynew1 = share.GetRootDirectoryReference();
                    //Specify the nested folder
                    cloudFileDirectory1 = cloudFileDirectory1.GetDirectoryReference(foldername);
                    var fileList13 = cloudFileDirectory1.ListFilesAndDirectories();
                    //copy folder for workspace
                    ShareDirectoryClient destDirnew = new ShareDirectoryClient(connectionString, azureroot, newfoldername);
                    destDirnew.CreateIfNotExists();
                    foreach (IListFileItem listItem in fileList13)
                    {
                        if (listItem.GetType() == typeof(CloudFile))
                        {
                            var SourceFile = foldername + "/" + ((Microsoft.Azure.Storage.File.CloudFile)listItem).Name.ToString();
                            var Targetfile = newfoldername + "/" + ((Microsoft.Azure.Storage.File.CloudFile)listItem).Name.ToString();
                            // Get a reference to the file we created previous
                            ShareFileClient sourceFile = new ShareFileClient(connectionString, azureroot, SourceFile);
                            ShareFileClient destFile = new ShareFileClient(connectionString, azureroot, Targetfile);
                            destFile.StartCopy(sourceFile.Uri);
                        }
                    }
                    //copy folder for lawpractice_ds
                    var foldername_dsnew = foldername;
                    string strnew = foldername_ds;
                    var arrnew = strnew.Split('/');
                    foldername_dsnew = UserHostAddress + "/" + string.Join("/", arrnew.Skip(1));
                    var newfoldername_dsnew = newfoldername;
                    string newstrnew = newfoldername_dsnew;
                    var newarrnew = newstrnew.Split('/');
                    newfoldername_dsnew = UserHostAddress + "/" + string.Join("/", newarrnew.Skip(1));
                    ShareDirectoryClient destDir1new = new ShareDirectoryClient(connectionString, azureroot, foldername_dsnew);
                    if (destDir1new.Exists())
                    {
                        var fileList1new = destDir1.GetFilesAndDirectories();
                        var nestedFolderStructure = foldername_dsnew;
                        var newstructuredpath = "";
                        var delimiter = new char[] { '/' };
                        var nestedFolderArray = nestedFolderStructure.Split(delimiter);
                        for (var i = 0; i < nestedFolderArray.Length; i++)
                        {
                            newstructuredpath = newstructuredpath + "/" + nestedFolderArray[i];
                            newstructuredpath = newstructuredpath.TrimEnd('/').TrimStart('/');
                            ShareDirectoryClient destDir_ds = new ShareDirectoryClient(connectionString, azureroot, newstructuredpath);
                            destDir_ds.CreateIfNotExists();
                        }
                        foreach (var listItem in fileList1new)
                        {
                            if (listItem.IsDirectory)
                            {
                            }
                            else
                            {
                                var SourceFile1 = foldername_ds + "/" + listItem.Name.ToString();
                                var Targetfile1 = newfoldername_ds + "/" + listItem.Name.ToString();
                                // Get a reference to the file we created previous
                                ShareFileClient sourceFile1 = new ShareFileClient(connectionString, azureroot, SourceFile1);
                                ShareFileClient destFile1 = new ShareFileClient(connectionString, azureroot, Targetfile1);
                                destFile1.StartCopy(sourceFile1.Uri);
                            }
                        }
                    }
                    //copy folder for backup to workspace
                    ShareDirectoryClient destDir11new = new ShareDirectoryClient(connectionString, azureroot, foldername);
                    if (destDir11new.Exists())
                    {
                        var fileList2 = destDir11new.GetFilesAndDirectories();
                        var basebakupfolder = "Backup/" + DateTime.Now.ToString("ddMMMyyyy") + "/" + foldername;
                        var nestedFolderStructure = basebakupfolder;
                        var newstructuredpath = "";
                        var delimiter = new char[] { '/' };
                        var nestedFolderArray = nestedFolderStructure.Split(delimiter);
                        for (var i = 0; i < nestedFolderArray.Length; i++)
                        {
                            newstructuredpath = newstructuredpath + "/" + nestedFolderArray[i];
                            newstructuredpath = newstructuredpath.TrimEnd('/').TrimStart('/');
                            ShareDirectoryClient destDirbackup = new ShareDirectoryClient(connectionString, azureroot, newstructuredpath);
                            destDirbackup.CreateIfNotExists();
                        }
                        foreach (var listItem in fileList2)
                        {
                            if (listItem.IsDirectory)
                            {
                            }
                            else
                            {
                                var SourceFilebk = foldername + "/" + listItem.Name.ToString();
                                var Targetfilebk = basebakupfolder + "/" + listItem.Name.ToString();
                                // Get a reference to the file we created previous
                                ShareFileClient sourceFilebk = new ShareFileClient(connectionString, azureroot, SourceFilebk);
                                ShareFileClient destFilebk = new ShareFileClient(connectionString, azureroot, Targetfilebk);
                                destFilebk.StartCopy(sourceFilebk.Uri);
                            }
                        }
                    }
                    //copy folder for backup to lawpract_ds
                    ShareDirectoryClient destDir11_dsnew = new ShareDirectoryClient(connectionString, azureroot, foldername_ds);
                    if (destDir11_dsnew.Exists())
                    {
                        var fileList2 = destDir11_ds.GetFilesAndDirectories();
                        var basebakupfolder = "Backup/" + DateTime.Now.ToString("ddMMMyyyy") + "/" + foldername_ds;
                        var nestedFolderStructure = basebakupfolder;
                        var newstructuredpath = "";
                        var delimiter = new char[] { '/' };
                        var nestedFolderArray = nestedFolderStructure.Split(delimiter);
                        for (var i = 0; i < nestedFolderArray.Length; i++)
                        {
                            newstructuredpath = newstructuredpath + "/" + nestedFolderArray[i];
                            newstructuredpath = newstructuredpath.TrimEnd('/').TrimStart('/');
                            ShareDirectoryClient destDirbackup = new ShareDirectoryClient(connectionString, azureroot, newstructuredpath);
                            destDirbackup.CreateIfNotExists();
                        }
                        foreach (var listItem in fileList2)
                        {
                            if (listItem.IsDirectory)
                            {
                            }
                            else
                            {
                                var SourceFilebk = foldername_ds + "/" + listItem.Name.ToString();
                                var Targetfilebk = basebakupfolder + "/" + listItem.Name.ToString();
                                // Get a reference to the file we created previous
                                ShareFileClient sourceFilebk = new ShareFileClient(connectionString, azureroot, SourceFilebk);
                                ShareFileClient destFilebk = new ShareFileClient(connectionString, azureroot, Targetfilebk);
                                destFilebk.StartCopy(sourceFilebk.Uri);
                            }
                        }
                    }
                }
                catch (Exception er)
                {
                }
                return true;
            }
            catch (Exception er)
            {
                LogService("FOlder rename old:" + er.Message + "@" + er.InnerException + "@" + er.StackTrace);
                return false;
            }
        }
        /// <summary>
        /// Get list sub directory
        /// </summary>
        /// <param name="list"></param>
        /// <param name="cloudFileDirectory"></param>
        /// <param name="cloudFileDirectorynew"></param>
        /// <param name="temppath"></param>
        public static void list_subdir(IListFileItem list, CloudFileDirectory cloudFileDirectory, CloudFileDirectory cloudFileDirectorynew, string temppath)
        {
            CloudFileDirectory fileDirectory = (CloudFileDirectory)list;
            IEnumerable<IListFileItem> fileList = fileDirectory.ListFilesAndDirectories();
            foreach (IListFileItem listItem in fileList)
            {
                if (listItem.GetType() == typeof(CloudFileDirectory))
                {
                    list_subdir(listItem, cloudFileDirectory, cloudFileDirectorynew, temppath);
                }
                else
                {
                    Console.WriteLine(((Microsoft.Azure.Storage.File.CloudFile)listItem).Name.ToString());
                    CloudFile cloudFile = cloudFileDirectory.GetFileReference(((Microsoft.Azure.Storage.File.CloudFile)listItem).Name.ToString());
                    //Open a stream from a local file.
                    //Upload the file to Azure.
                    cloudFile.DownloadToFile(temppath + "\\" + ((Microsoft.Azure.Storage.File.CloudFile)listItem).Name.ToString(), FileMode.Create);
                    CloudFile cloudFile1 = cloudFileDirectorynew.GetFileReference(((Microsoft.Azure.Storage.File.CloudFile)listItem).Name.ToString());
                    if (!cloudFile1.Exists())
                    {
                        cloudFile1.UploadFromFile(temppath + "\\" + ((Microsoft.Azure.Storage.File.CloudFile)listItem).Name.ToString().ToString());
                    }
                }
            }
        }
        /// <summary>
        /// Copy file
        /// </summary>
        /// <param name="shareName"></param>
        /// <param name="sourceFilePath"></param>
        /// <param name="destFilePath"></param>
        public static void CopyFile(string shareName, string sourceFilePath, string destFilePath)
        {
            // Get the connection string from app settings
            // string connectionString = ConfigurationManager.AppSettings["StorageConnectionString"];
            string connectionString = "AccountName=mykase;AccountKey=aNXw640rPjnFXqlEOQtz8y4OjfVP2yLVfNlP9p/WHwD6mgYv3I40Y4rrD2jr6rd7o6UkrESh/nFHg1XGB0eJ5A==;EndpointSuffix=core.windows.net;DefaultEndpointsProtocol=https;";
            // Get a reference to the file we created previously
            ShareFileClient sourceFile = new ShareFileClient(connectionString, shareName, sourceFilePath);
            // Get a reference to the destination file
            ShareFileClient destFile = new ShareFileClient(connectionString, shareName, destFilePath);
            // Start the copy operation
            destFile.StartCopy(sourceFile.Uri);
            // destFile.Create("test1");
            if (destFile.Exists())
            {
                Console.WriteLine($"{sourceFile.Uri} copied to {destFile.Uri}");
            }
        }
        /// <summary>
        /// Remove folder
        /// </summary>
        /// <param name="dpath"></param>
        /// <param name="foldername"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public static bool RemoveFolder(string dpath, string foldername, string firmid, string userid)
        {
            try
            {
                checkstring();
                string connectionString = string.Format("DefaultEndpointsProtocol={0};AccountName={1};AccountKey={2}",
                                  azureProtocol, AzureStorageName, AzureStorageKey);
                foldername = dpath + "/" + foldername;
                foldername = foldername.TrimEnd('/').TrimStart('/');
                ShareDirectoryClient destDir = new ShareDirectoryClient(connectionString, azureroot, foldername);
                var fileList = destDir.GetFilesAndDirectories();
                foreach (var listItem in fileList)
                {
                    if (listItem.IsDirectory)
                    {
                    }
                    else
                    {
                        var SourceFile = foldername + "/" + listItem.Name.ToString();
                        // Get a reference to the file we created previous
                        ShareFileClient sourceFile = new ShareFileClient(connectionString, azureroot, SourceFile);
                        sourceFile.DeleteIfExists();
                    }
                }
                destDir.DeleteIfExists();
                return true;
            }
            catch (Exception er)
            {
                LogService("FOlder remove:" + er.Message + "@" + er.InnerException + "@" + er.StackTrace);
                return false;
            }
        }
        /// <summary>
        /// Move file
        /// </summary>
        /// <param name="dpath"></param>
        /// <param name="filename"></param>
        /// <param name="destiazurepath"></param>
        /// <param name="sourceazurepath"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="dirid"></param>
        /// <param name="fileidpfile"></param>
        /// <returns></returns>
        public static string MoveFile(string dpath, string filename, string destiazurepath, string sourceazurepath, string firmid, string userid, string dirid, string fileidpfile)
        {
            try
            {
                checkstring();
                string connectionString = string.Format("DefaultEndpointsProtocol={0};AccountName={1};AccountKey={2}",
                                  azureProtocol, AzureStorageName, AzureStorageKey);
                var newfoldername = destiazurepath;
                newfoldername = newfoldername.TrimEnd('/').TrimStart('/');
                sourceazurepath = sourceazurepath.TrimEnd('/').TrimStart('/');
                //copy file for workspace
                //checked dist exist or not 
                ShareDirectoryClient destDir = new ShareDirectoryClient(connectionString, azureroot, newfoldername);
                if (destDir.Exists())
                {
                    var DestinnationFile = newfoldername + "/" + filename;
                    // Get a reference to the file we created previous
                    ShareFileClient destfile = new ShareFileClient(connectionString, azureroot, DestinnationFile);
                    if (destfile.Exists())
                    {
                        return "exist";
                    }
                    else
                    {
                        var SourceFile = sourceazurepath + "/" + filename;
                        // Get a reference to the file we created previous
                        ShareFileClient sourceFile = new ShareFileClient(connectionString, azureroot, SourceFile);
                        var prop = sourceFile.GetProperties();
                        destfile.StartCopy(sourceFile.Uri);
                    }
                }
                else
                {
                    return "false";
                }
                //copy file for lawpractice_ds
                //checked dist exist or not 
                string UserHostAddress = WebConfigurationManager.AppSettings["UserHostAddress"];
                var newfoldername_ds = newfoldername;
                string str = newfoldername_ds;
                var arr = str.Split('/');
                newfoldername_ds = UserHostAddress + "/" + string.Join("/", arr.Skip(1));
                var sourceazurepath_ds = sourceazurepath;
                string str_ds = sourceazurepath_ds;
                var arr_ds = str_ds.Split('/');
                sourceazurepath_ds = UserHostAddress + "/" + string.Join("/", arr_ds.Skip(1));
                ShareDirectoryClient destDir_ds = new ShareDirectoryClient(connectionString, azureroot, newfoldername_ds);
                if (destDir_ds.Exists())
                {
                    var DestinnationFile_ds = newfoldername_ds + "/" + filename;
                    // Get a reference to the file we created previous
                    ShareFileClient destfile_ds = new ShareFileClient(connectionString, azureroot, DestinnationFile_ds);
                    if (!destfile_ds.Exists())
                    {
                        var SourceFile_ds = sourceazurepath_ds + "/" + filename;
                        // Get a reference to the file we created previous
                        ShareFileClient sourceFile_ds = new ShareFileClient(connectionString, azureroot, SourceFile_ds);
                        if (sourceFile_ds.Exists())
                        {
                            destfile_ds.StartCopy(sourceFile_ds.Uri);
                        }
                    }
                }
                //copy folder for backup to workspace
                ShareDirectoryClient destDir_bk = new ShareDirectoryClient(connectionString, azureroot, newfoldername);
                if (destDir_bk.Exists())
                {
                    var fileList2 = destDir_bk.GetFilesAndDirectories();
                    var basebakupfolder = "Backup/" + DateTime.Now.ToString("ddMMMyyyy") + "/MoveFile/" + newfoldername;
                    var nestedFolderStructure = basebakupfolder;
                    var newstructuredpath = "";
                    var delimiter = new char[] { '/' };
                    var nestedFolderArray = nestedFolderStructure.Split(delimiter);
                    for (var i = 0; i < nestedFolderArray.Length; i++)
                    {
                        newstructuredpath = newstructuredpath + "/" + nestedFolderArray[i];
                        newstructuredpath = newstructuredpath.TrimEnd('/').TrimStart('/');
                        ShareDirectoryClient destDirbackup = new ShareDirectoryClient(connectionString, azureroot, newstructuredpath);
                        destDirbackup.CreateIfNotExists();
                    }
                    var SourceFilebk = newfoldername + "/" + filename;
                    var Targetfilebk = basebakupfolder + "/" + filename;
                    // Get a reference to the file we created previous
                    ShareFileClient sourceFilebk = new ShareFileClient(connectionString, azureroot, SourceFilebk);
                    if (sourceFilebk.Exists())
                    {
                        ShareFileClient destFilebk = new ShareFileClient(connectionString, azureroot, Targetfilebk);
                        destFilebk.StartCopy(sourceFilebk.Uri);
                    }
                }
                //copy folder for backup to lawpracrice_ds
                var newfoldername_ds_bk = newfoldername;
                string str_ds_bk = newfoldername_ds_bk;
                var arr_ds_bk = str_ds_bk.Split('/');
                newfoldername_ds_bk = UserHostAddress + "/" + string.Join("/", arr_ds_bk.Skip(1));
                var sourceazurepath_ds_bk = sourceazurepath;
                string str_ds_bk1 = sourceazurepath_ds_bk;
                var arr_ds_bk1 = str_ds_bk1.Split('/');
                sourceazurepath_ds_bk = UserHostAddress + "/" + string.Join("/", arr_ds_bk1.Skip(1));
                ShareDirectoryClient destDir_bk_ds = new ShareDirectoryClient(connectionString, azureroot, newfoldername_ds_bk);
                if (destDir_bk_ds.Exists())
                {
                    var fileList2_ds = destDir_bk_ds.GetFilesAndDirectories();
                    var basebakupfolder = "Backup/" + DateTime.Now.ToString("ddMMMyyyy") + "/MoveFile/" + newfoldername_ds_bk;
                    var nestedFolderStructure = basebakupfolder;
                    var newstructuredpath = "";
                    var delimiter = new char[] { '/' };
                    var nestedFolderArray = nestedFolderStructure.Split(delimiter);
                    for (var i = 0; i < nestedFolderArray.Length; i++)
                    {
                        newstructuredpath = newstructuredpath + "/" + nestedFolderArray[i];
                        newstructuredpath = newstructuredpath.TrimEnd('/').TrimStart('/');
                        ShareDirectoryClient destDirbackup = new ShareDirectoryClient(connectionString, azureroot, newstructuredpath);
                        destDirbackup.CreateIfNotExists();
                    }
                    var SourceFilebk = newfoldername + "/" + filename;
                    var Targetfilebk = basebakupfolder + "/" + filename;
                    // Get a reference to the file we created previous
                    ShareFileClient sourceFilebk = new ShareFileClient(connectionString, azureroot, SourceFilebk);
                    if (sourceFilebk.Exists())
                    {
                        ShareFileClient destFilebk = new ShareFileClient(connectionString, azureroot, Targetfilebk);
                        destFilebk.StartCopy(sourceFilebk.Uri);
                    }
                }
                return "true";
            }
            catch (Exception er)
            {
                LogService("File rename:" + er.Message + "@" + er.InnerException + "@" + er.StackTrace);
                return "false";
            }
        }
        /// <summary>
        /// Delete document
        /// </summary>
        /// <param name="dpath"></param>
        /// <param name="filename"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public static string DeleteDocument(string dpath, string filename, string firmid, string userid)
        {
            try
            {
                checkstring();
                string connectionString = string.Format("DefaultEndpointsProtocol={0};AccountName={1};AccountKey={2}",
                                  azureProtocol, AzureStorageName, AzureStorageKey);
                dpath = dpath.TrimEnd('/').TrimStart('/');
                //copy file for workspace
                //checked dist exist or not 
                ShareDirectoryClient destDir = new ShareDirectoryClient(connectionString, azureroot, dpath);
                if (destDir.Exists())
                {
                    var DestinnationFile = dpath + "/" + filename;
                    // Get a reference to the file we created previous
                    ShareFileClient destfile = new ShareFileClient(connectionString, azureroot, DestinnationFile);
                    destfile.DeleteIfExists();
                    return "true";
                }
                else
                {
                    return "false";
                }
            }
            catch
            {
                return "false";
            }
        }
        /// <summary>
        /// Move folder
        /// </summary>
        /// <param name="dpath"></param>
        /// <param name="filename"></param>
        /// <param name="destiazurepath"></param>
        /// <param name="sourceazurepath"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="dirid"></param>
        /// <param name="fileidpfile"></param>
        /// <returns></returns>
        public static string MoveFolder(string dpath, string filename, string destiazurepath, string sourceazurepath, string firmid, string userid, string dirid, string fileidpfile)
        {
            try
            {
                checkstring();
                string connectionString = string.Format("DefaultEndpointsProtocol={0};AccountName={1};AccountKey={2}",
                                  azureProtocol, AzureStorageName, AzureStorageKey);
                var newfoldername = destiazurepath;
                sourceazurepath = sourceazurepath.TrimEnd('/').TrimStart('/');
                newfoldername = newfoldername.TrimEnd('/').TrimStart('/');
                //chceck already exist dir
                ShareDirectoryClient destDirfirst = new ShareDirectoryClient(connectionString, azureroot, newfoldername);
                if (destDirfirst.Exists())
                {
                    return "exist";
                }
                //copy file for workspace
                //checked dist exist or not 
                ShareDirectoryClient destDir = new ShareDirectoryClient(connectionString, azureroot, newfoldername);
                CreateDocEditDestination(newfoldername, firmid, userid);
                if (destDir.Exists())
                {
                    var DestinnationFile = newfoldername;
                    // Get a reference to the file we created previous
                    ShareFileClient destfile = new ShareFileClient(connectionString, azureroot, DestinnationFile);
                    var SourceFile = "";
                    if (dirid.ToString() == Guid.Empty.ToString())
                    {
                        SourceFile = sourceazurepath;
                    }
                    else
                    {
                        SourceFile = sourceazurepath;
                    }
                    ShareDirectoryClient SourceFolder = new ShareDirectoryClient(connectionString, azureroot, SourceFile);
                    if (SourceFolder.Exists())
                    {
                        var fileList2 = SourceFolder.GetFilesAndDirectories();
                        foreach (var listItem in fileList2)
                        {
                            if (listItem.IsDirectory)
                            {
                            }
                            else
                            {
                                var SourceFile1 = SourceFile + "/" + listItem.Name.ToString();
                                var Targetfile1 = DestinnationFile + "/" + listItem.Name.ToString();
                                // Get a reference to the file we created previous
                                ShareFileClient sourceFile1 = new ShareFileClient(connectionString, azureroot, SourceFile1);
                                ShareFileClient destFile1 = new ShareFileClient(connectionString, azureroot, Targetfile1);
                                destFile1.StartCopy(sourceFile1.Uri);
                            }
                        }
                    }
                }
                else
                {
                    return "false";
                }
                //copy file for lawpractice_ds
                //checked dist exist or not 
                string UserHostAddress = WebConfigurationManager.AppSettings["UserHostAddress"];
                var newfoldername_ds = newfoldername;
                string str = newfoldername_ds;
                var arr = str.Split('/');
                newfoldername_ds = UserHostAddress + "/" + string.Join("/", arr.Skip(1));
                var sourceazurepath_ds = sourceazurepath;
                string str_ds = sourceazurepath_ds;
                var arr_ds = str_ds.Split('/');
                sourceazurepath_ds = UserHostAddress + "/" + string.Join("/", arr_ds.Skip(1));
                ShareDirectoryClient destDir_ds = new ShareDirectoryClient(connectionString, azureroot, newfoldername_ds);
                CreateDocEditDestination(newfoldername_ds, firmid, userid);
                if (destDir_ds.Exists())
                {
                    var DestinnationFile_ds = newfoldername_ds;
                    // Get a reference to the file we created previous
                    var SourceFile_ds = "";
                    if (dirid.ToString() == Guid.Empty.ToString())
                    {
                        SourceFile_ds = sourceazurepath_ds;
                    }
                    else
                    {
                        SourceFile_ds = sourceazurepath_ds;
                    }
                    ShareDirectoryClient SourceFolder = new ShareDirectoryClient(connectionString, azureroot, SourceFile_ds);
                    try
                    {
                        CreateDocEditDestination(SourceFile_ds, firmid, userid);
                    }
                    catch
                    {
                    }
                    if (SourceFolder.Exists())
                    {
                        var fileList2 = SourceFolder.GetFilesAndDirectories();
                        foreach (var listItem in fileList2)
                        {
                            if (listItem.IsDirectory)
                            {
                            }
                            else
                            {
                                var SourceFile1 = SourceFile_ds + "/" + listItem.Name.ToString();
                                var Targetfile1 = DestinnationFile_ds + "/" + listItem.Name.ToString();
                                // Get a reference to the file we created previous
                                ShareFileClient sourceFile1 = new ShareFileClient(connectionString, azureroot, SourceFile1);
                                ShareFileClient destFile1 = new ShareFileClient(connectionString, azureroot, Targetfile1);
                                destFile1.StartCopy(sourceFile1.Uri);
                            }
                        }
                    }
                }
                //copy folder for backup to workspace
                ShareDirectoryClient destDir_bk = new ShareDirectoryClient(connectionString, azureroot, newfoldername);
                try
                {
                    CreateDocEditDestination(newfoldername, firmid, userid);
                }
                catch
                {
                }
                if (destDir_bk.Exists())
                {
                    var fileList2 = destDir_bk.GetFilesAndDirectories();
                    var basebakupfolder = "Backup/" + DateTime.Now.ToString("ddMMMyyyy") + "/MoveFolder/" + newfoldername;
                    var nestedFolderStructure = basebakupfolder;
                    var newstructuredpath = "";
                    var delimiter = new char[] { '/' };
                    var nestedFolderArray = nestedFolderStructure.Split(delimiter);
                    for (var i = 0; i < nestedFolderArray.Length; i++)
                    {
                        newstructuredpath = newstructuredpath + "/" + nestedFolderArray[i];
                        newstructuredpath = newstructuredpath.TrimEnd('/').TrimStart('/');
                        ShareDirectoryClient destDirbackup = new ShareDirectoryClient(connectionString, azureroot, newstructuredpath);
                        destDirbackup.CreateIfNotExists();
                    }
                    // Get a reference to the file we created previous
                    foreach (var listItem in fileList2)
                    {
                        if (listItem.IsDirectory)
                        {
                        }
                        else
                        {
                            var SourceFile1 = newfoldername + "/" + listItem.Name.ToString();
                            var Targetfile1 = basebakupfolder + "/" + listItem.Name.ToString();
                            // Get a reference to the file we created previous
                            ShareFileClient sourceFile1 = new ShareFileClient(connectionString, azureroot, SourceFile1);
                            ShareFileClient destFile1 = new ShareFileClient(connectionString, azureroot, Targetfile1);
                            destFile1.StartCopy(sourceFile1.Uri);
                        }
                    }
                }
                //copy folder for backup to lawpracrice_ds
                var newfoldername_ds_bk = newfoldername;
                string str_ds_bk = newfoldername_ds_bk;
                var arr_ds_bk = str_ds_bk.Split('/');
                newfoldername_ds_bk = UserHostAddress + "/" + string.Join("/", arr_ds_bk.Skip(1));
                var sourceazurepath_ds_bk = sourceazurepath;
                string str_ds_bk1 = sourceazurepath_ds_bk;
                var arr_ds_bk1 = str_ds_bk1.Split('/');
                sourceazurepath_ds_bk = UserHostAddress + "/" + string.Join("/", arr_ds_bk1.Skip(1));
                ShareDirectoryClient destDir_bk_ds = new ShareDirectoryClient(connectionString, azureroot, newfoldername_ds_bk);
                if (destDir_bk_ds.Exists())
                {
                    var fileList2_ds = destDir_bk_ds.GetFilesAndDirectories();
                    var basebakupfolder = "Backup/" + DateTime.Now.ToString("ddMMMyyyy") + "/MoveFolder/" + newfoldername_ds_bk;
                    var nestedFolderStructure = basebakupfolder;
                    var newstructuredpath = "";
                    var delimiter = new char[] { '/' };
                    var nestedFolderArray = nestedFolderStructure.Split(delimiter);
                    for (var i = 0; i < nestedFolderArray.Length; i++)
                    {
                        newstructuredpath = newstructuredpath + "/" + nestedFolderArray[i];
                        newstructuredpath = newstructuredpath.TrimEnd('/').TrimStart('/');
                        ShareDirectoryClient destDirbackup = new ShareDirectoryClient(connectionString, azureroot, newstructuredpath);
                        destDirbackup.CreateIfNotExists();
                    }
                    ShareDirectoryClient SourceFolder = new ShareDirectoryClient(connectionString, azureroot, newfoldername_ds_bk);
                    if (SourceFolder.Exists())
                    {
                        var fileList2 = SourceFolder.GetFilesAndDirectories();
                        foreach (var listItem in fileList2)
                        {
                            if (listItem.IsDirectory)
                            {
                            }
                            else
                            {
                                var SourceFile1 = newfoldername_ds_bk + "/" + listItem.Name.ToString();
                                var Targetfile1 = basebakupfolder + "/" + listItem.Name.ToString();
                                // Get a reference to the file we created previous
                                ShareFileClient sourceFile1 = new ShareFileClient(connectionString, azureroot, SourceFile1);
                                ShareFileClient destFile1 = new ShareFileClient(connectionString, azureroot, Targetfile1);
                                destFile1.StartCopy(sourceFile1.Uri);
                            }
                        }
                    }
                }
                return "true";
            }
            catch (Exception er)
            {
                LogService("File rename:" + er.Message + "@" + er.InnerException + "@" + er.StackTrace);
                return "false";
            }
        }
        /// <summary>
        /// Remove move folder
        /// </summary>
        /// <param name="dpath"></param>
        /// <param name="foldername"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="fileidpfile"></param>
        /// <returns></returns>
        public static bool RemoveFolderMove(string dpath, string foldername, string firmid, string userid, string fileidpfile)
        {
            try
            {
                checkstring();
                string connectionString = string.Format("DefaultEndpointsProtocol={0};AccountName={1};AccountKey={2}",
                                  azureProtocol, AzureStorageName, AzureStorageKey);
                dpath = dpath.TrimEnd('/').TrimStart('/');
                ShareDirectoryClient destDir = new ShareDirectoryClient(connectionString, azureroot, dpath);
                var fileList = destDir.GetFilesAndDirectories();
                foreach (var listItem in fileList)
                {
                    if (listItem.IsDirectory)
                    {
                    }
                    else
                    {
                        var SourceFile = dpath + "/" + listItem.Name.ToString();
                        // Get a reference to the file we created previous
                        ShareFileClient sourceFile = new ShareFileClient(connectionString, azureroot, SourceFile);
                        sourceFile.DeleteIfExists();
                    }
                }
                destDir.DeleteIfExists();
                return true;
            }
            catch (Exception er)
            {
                LogService("FOlder remove:" + er.Message + "@" + er.InnerException + "@" + er.StackTrace);
                return false;
            }
        }
        /// <summary>
        /// Folderexist rename
        /// </summary>
        /// <param name="dpath"></param>
        /// <param name="foldername"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pfile"></param>
        /// <param name="onlycheckexist"></param>
        /// <returns></returns>
        public static bool folderexistRename(string dpath, string foldername, string firmid, string userid, string pfile, string onlycheckexist = null)
        {
            try
            {
                checkstring();
                var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
                var account = new CloudStorageAccount(cred, true);
                var client = account.CreateCloudFileClient();
                if (!String.IsNullOrEmpty(dpath))
                {
                    if (pfile.ToString() == Guid.Empty.ToString())
                    {
                        foldername = dpath.TrimEnd('/').TrimStart('/') + "/" + foldername;
                    }
                    else
                    {
                        string str3 = dpath;
                        var arr3 = str3.Split('/');
                        var foldernametmp = string.Join("/", arr3.Take(arr3.Length - 1));
                        foldername = foldernametmp.TrimEnd('/').TrimStart('/') + "/" + foldername;
                    }
                    var share = client.GetShareReference(azureroot);
                    share.CreateIfNotExists();
                    var cloudFileDirectory = share.GetRootDirectoryReference();
                    //Specify the nested folder
                    cloudFileDirectory = cloudFileDirectory.GetDirectoryReference(foldername);
                    if (cloudFileDirectory.Exists())
                    {
                        return true;
                    }
                    else
                    {
                        if (onlycheckexist != "1")
                        {
                            cloudFileDirectory.CreateIfNotExists();
                        }
                        return false;
                    }
                }
                else
                {
                    string azurerootuser = azuredir + "/" + firmid + "/" + userid;
                    foldername = azurerootuser + "/" + foldername;
                    var share = client.GetShareReference(azureroot);
                    share.CreateIfNotExists();
                    var cloudFileDirectory = share.GetRootDirectoryReference();
                    //Specify the nested folder
                    cloudFileDirectory = cloudFileDirectory.GetDirectoryReference(foldername);
                    if (cloudFileDirectory.Exists())
                    {
                        return true;
                    }
                    else
                    {
                        if (onlycheckexist != "1")
                        {
                            cloudFileDirectory.CreateIfNotExists();
                        }
                        return false;
                    }
                }
            }
            catch (Exception er)
            {
                LogService("FOlder eXIst:" + er.Message + "@" + er.InnerException + "@" + er.StackTrace);
                return false;
            }
        }
        /// <summary>
        /// Remove folder rename
        /// </summary>
        /// <param name="dpath"></param>
        /// <param name="foldername"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="pfile"></param>
        /// <returns></returns>
        public static bool RemoveFolderRename(string dpath, string foldername, string firmid, string userid, string pfile)
        {
            try
            {
                checkstring();
                string connectionString = string.Format("DefaultEndpointsProtocol={0};AccountName={1};AccountKey={2}",
                                  azureProtocol, AzureStorageName, AzureStorageKey);
                if (pfile.ToString() == Guid.Empty.ToString())
                {
                    dpath = dpath.TrimEnd('/').TrimStart('/');
                    foldername = dpath + "/" + foldername;
                }
                else
                {
                    foldername = dpath;
                }
                foldername = foldername.TrimEnd('/').TrimStart('/');
                ShareDirectoryClient destDir = new ShareDirectoryClient(connectionString, azureroot, foldername);
                var fileList = destDir.GetFilesAndDirectories();
                foreach (var listItem in fileList)
                {
                    if (listItem.IsDirectory)
                    {
                    }
                    else
                    {
                        var SourceFile = foldername + "/" + listItem.Name.ToString();
                        // Get a reference to the file we created previous
                        ShareFileClient sourceFile = new ShareFileClient(connectionString, azureroot, SourceFile);
                        sourceFile.DeleteIfExists();
                    }
                }
                destDir.DeleteIfExists();
                return true;
            }
            catch (Exception er)
            {
                LogService("FOlder remove:" + er.Message + "@" + er.InnerException + "@" + er.StackTrace);
                return false;
            }
        }
        /// <summary>
        /// Check string for edit handler
        /// </summary>
        /// <param name="fids"></param>
        /// <param name="uids"></param>
        public static void checkstringForEditHandler(string fids, string uids)
        {
            LogService("firmidschk=" + fids);
            LogService("useridschk=" + uids);
            var db = new LawPracticeEntities();
            var data = db.usp_getazurestring(fids.ToString(), uids.ToString()).FirstOrDefault();
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
        /// Create doc edit destination
        /// </summary>
        /// <param name="dpath"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        public static void CreateDocEditDestination(string dpath, string firmid, string userid)
        {
            checkstringForEditHandler(firmid, userid);
            string connectionString = string.Format("DefaultEndpointsProtocol={0};AccountName={1};AccountKey={2}",
                              azureProtocol, AzureStorageName, AzureStorageKey);
            var nestedFolderStructure = dpath;
            var newstructuredpath = "";
            var delimiter = new char[] { '/' };
            var nestedFolderArray = nestedFolderStructure.Split(delimiter);
            for (var i = 0; i < nestedFolderArray.Length; i++)
            {
                newstructuredpath = newstructuredpath + "/" + nestedFolderArray[i];
                newstructuredpath = newstructuredpath.TrimEnd('/').TrimStart('/');
                ShareDirectoryClient destDirbackup = new ShareDirectoryClient(connectionString, azureroot, newstructuredpath);
                destDirbackup.CreateIfNotExists();
            }
        }
        /// <summary>
        /// Download file without 
        /// </summary>
        /// <param name="dpath"></param>
        /// <param name="filename"></param>
        /// <param name="fakepathin"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public static string DownloadFileWithOutDecrypt(string dpath, string filename, string fakepathin, string firmid, string userid)
        {
            checkstring();
            string input = "";
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
                string azurerootuser = azuredir + "/" + firmid + "/" + userid;
                dpath = azurerootuser + dpath;
                var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
                var account = new CloudStorageAccount(cred, true);
                var client = account.CreateCloudFileClient();
                var share = client.GetShareReference(azureroot);
                var cloudFileDirectory = share.GetRootDirectoryReference();
                CloudFile cloudFile = cloudFileDirectory.GetFileReference(filename);
                cloudFile.DownloadToFile(fakepathin + "\\" + filename, FileMode.Create);
            }
            input = fakepathin + "\\" + filename;
            return input;
        }
        /// <summary>
        /// Copy from Mykase document to other module
        /// </summary>
        /// <param name="filename"></param>
        /// <param name="newfilename"></param>
        /// <param name="destiazurepath"></param>
        /// <param name="sourceazurepath"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public static bool CopyFromMykaseDocumenttoOtherModule(string filename, string newfilename, string destiazurepath, string sourceazurepath, string firmid, string userid)
        {
            try
            {
                //fixed storage name and storage key for others module
                string AzureStorageNameDn = WebConfigurationManager.AppSettings["AzureStorageName"];
                string AzureStorageKeyDn = WebConfigurationManager.AppSettings["AzureStorageKey"];
                //source for mykase document mgmt
                checkstring();
                string connectionStringsource = string.Format("DefaultEndpointsProtocol={0};AccountName={1};AccountKey={2}", azureProtocol, AzureStorageName, AzureStorageKey);
                //destination
                string connectionStringdestination = string.Format("DefaultEndpointsProtocol={0};AccountName={1};AccountKey={2}", azureProtocol, AzureStorageNameDn, AzureStorageKeyDn);
                destiazurepath = destiazurepath.TrimEnd('/').TrimStart('/');
                sourceazurepath = sourceazurepath.TrimEnd('/').TrimStart('/');
                ShareDirectoryClient destDir_bk = new ShareDirectoryClient(connectionStringdestination, azureroot, destiazurepath);
                if (!destDir_bk.Exists())
                {
                    var nestedFolderStructure = destiazurepath;
                    var newstructuredpath = "";
                    var delimiter = new char[] { '/' };
                    var nestedFolderArray = nestedFolderStructure.Split(delimiter);
                    for (var i = 0; i < nestedFolderArray.Length; i++)
                    {
                        newstructuredpath = newstructuredpath + "/" + nestedFolderArray[i];
                        newstructuredpath = newstructuredpath.TrimEnd('/').TrimStart('/');
                        ShareDirectoryClient destDirbackup = new ShareDirectoryClient(connectionStringdestination, azureroot, newstructuredpath);
                        destDirbackup.CreateIfNotExists();
                    }
                }
                if (destDir_bk.Exists())
                {
                    string UserHostAddress = WebConfigurationManager.AppSettings["UserHostAddress"];
                    var SourceFilebk = "";
                    var sourceazurepath_ds = sourceazurepath;
                    string str = sourceazurepath_ds;
                    var arr = str.Split('/');
                    sourceazurepath_ds = UserHostAddress + "/" + string.Join("/", arr.Skip(1));
                    //check _ds exist or not
                    ShareFileClient sourceFilebk_ds = new ShareFileClient(connectionStringsource, azureroot, sourceazurepath_ds + "/" + filename);
                    if (sourceFilebk_ds.Exists())
                    {
                        SourceFilebk = sourceazurepath_ds + "/" + filename;
                    }
                    else
                    {
                        SourceFilebk = sourceazurepath + "/" + filename;
                    }
                    var Targetfilebk = destiazurepath + "/" + newfilename;
                    // Get a reference to the file we created previous
                    ShareFileClient sourceFilebk = new ShareFileClient(connectionStringsource, azureroot, SourceFilebk);
                    if (sourceFilebk.Exists())
                    {
                        ShareFileClient destFilebk = new ShareFileClient(connectionStringdestination, azureroot, Targetfilebk);
                        destFilebk.StartCopy(sourceFilebk.Uri);
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
                return false;
            }
            catch (Exception er)
            {
                return false;
            }
        }
    }
}