using System;
using System.IO;
using System.Net;
using System.Web;
using System.Web.Configuration;
using Microsoft.Azure.Storage;
#pragma warning disable CS0105 // The using directive for 'Microsoft.Azure.Storage' appeared previously in this namespace
#pragma warning restore CS0105 // The using directive for 'Microsoft.Azure.Storage' appeared previously in this namespace
using Microsoft.Azure.Storage.Auth;
using Microsoft.Azure.Storage.File;
using QueryStringEDAES;

namespace LawPracticeFirm.Models
{
    public class AzureDocumentself
    {
        static string AzureStorageName = WebConfigurationManager.AppSettings["AzureStorageName"];
        static string AzureStorageKey = WebConfigurationManager.AppSettings["AzureStorageKey"];
        static string azureroot = "mykase";
        static string azuredir = "WorkSpace";
        /// <summary>
        /// Create root
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        public static void creatroot(string firmid, string userid)
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
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
        /// Get Directory file path without decrypt
        /// </summary>
        /// <param name="dpath"></param>
        /// <param name="filename"></param>
        /// <param name="fakepathin"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public static string Dirfilepathwithoutdecrypt(string dpath, string filename, string fakepathin, string firmid, string userid)
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            //string fakepathin = Server.MapPath("~/azuredirin/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId);
            //string fakepathout = Server.MapPath("~/azuredirout/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId);
            if (!String.IsNullOrEmpty(dpath))
            {
                //CloudBlobContainer blobContainer = CreateCloudBlobContainer(tenantId, applicationId, clientSecret, azureOperationHelper.storageAccountName, azureOperationHelper.containerName, azureOperationHelper.storageEndPoint);
                //CloudBlockBlob blob = blobContainer.GetBlockBlobReference(azureOperationHelper.blobName);
                //blob.DownloadToFile(azureOperationHelper.destinationPath, FileMode.OpenOrCreate);
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
            string input = fakepathin + "\\" + filename;
            //System.IO.FileInfo fileInfo = new System.IO.FileInfo(output);
            //var dfilename = fileInfo.Name;
            //var finalpath = "/azuredirout/" + firmid + "/" + userid + '/' + dfilename;
            return input;
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
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
            var account = new CloudStorageAccount(cred, true);
            var client = account.CreateCloudFileClient();
            if (!String.IsNullOrEmpty(dpath))
            {
                foldername = dpath + foldername;
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
        /// Delete directory folder
        /// </summary>
        /// <param name="dpath"></param>
        /// <param name="Name"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public static string DeleteFolder(string dpath, string Name, string firmid, string userid)
        {
            try
            {
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                dpath = dpath + "/" + Name;
                dpath = dpath.Replace("//", "/").TrimEnd('/').TrimStart('/');
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
        /// <param name="Names"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        public static void DeleteFile(string dpath, string Names, string firmid, string userid)
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            var Name = "https://mykase.file.core.windows.net/mykase/" + dpath + "/" + Names;
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
        /// <summary>
        /// Directory file path
        /// </summary>
        /// <param name="dpath"></param>
        /// <param name="filename"></param>
        /// <param name="fakepathin"></param>
        /// <param name="fakepathout"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public static string Dirfilepath(string dpath, string filename, string fakepathin, string fakepathout, string firmid, string userid)
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
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
            string input = fakepathin + "\\" + filename;
            string output = fakepathout + "\\" + filename;
            try
            {
                QueryAES.FileDecrypt(input, output);
            }
#pragma warning disable CS0168 // The variable 'err' is declared but never used
            catch (Exception err)
#pragma warning restore CS0168 // The variable 'err' is declared but never used
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
        /// Check folder exist or not
        /// </summary>
        /// <param name="dpath"></param>
        /// <param name="foldername"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public static bool folderexist(string dpath, string foldername, string firmid, string userid)
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            var cred = new StorageCredentials(AzureStorageName, AzureStorageKey);
            var account = new CloudStorageAccount(cred, true);
            var client = account.CreateCloudFileClient();
            if (!String.IsNullOrEmpty(dpath))
            {
                foldername = dpath + foldername;
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
                    cloudFileDirectory.CreateIfNotExists();
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
                    cloudFileDirectory.CreateIfNotExists();
                    return false;
                }
            }
        }
        /// <summary>
        /// Check file exist or not
        /// </summary>
        /// <param name="dpath"></param>
        /// <param name="filename"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public static bool fileexist(string dpath, string filename, string firmid, string userid)
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
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
        /// Service log
        /// </summary>
        /// <param name="content"></param>
        private static void LogService(string content)
        {
            var templogpath = HttpContext.Current.Server.MapPath("//");
            FileStream fs = new FileStream(templogpath + "//CloudMyKaseoffiecSyncLog.txt", FileMode.OpenOrCreate, FileAccess.Write);
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
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string azurerootuser = azuredir + "/" + firmid + "/" + userid;
            //dpath = azurerootuser + dpath;
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
            cloudFileDirectory.CreateIfNotExists();
            CloudFile cloudFile = cloudFileDirectory.GetFileReference(filename);
            var fileext = Path.GetExtension(filename);
            //Open a stream from a local file.
            //Upload the file to Azure.
            try
            {
                cloudFile.UploadFromFile(output);
            }
            catch
            {
            }
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
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
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
    }
}