using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Google.Apis.Util.Store;
using System.Threading;
using System.IO;
using Google.Apis.Drive.v2;
using Google.Apis.Drive.v2.Data;
using File = Google.Apis.Drive.v2.Data.File;

namespace LawPracticeFirm.Models
{
    public class GoogleDriveAPIHelper
    {
        /// <summary>
        /// Add scope
        /// </summary>
        public static string[] Scopes = { Google.Apis.Drive.v2.DriveService.Scope.Drive };
        /// <summary>
        /// Service log
        /// </summary>
        /// <param name="content"></param>
        private static void LogService(string content)
        {
            var templogpath = HttpContext.Current.Server.MapPath("//");
            FileStream fs = new FileStream(templogpath + "//MyKasecslyncLog.txt", FileMode.OpenOrCreate, FileAccess.Write);
            StreamWriter sw = new StreamWriter(fs);
            sw.BaseStream.Seek(0, SeekOrigin.End);
            sw.WriteLine(content);
            sw.Flush();
            sw.Close();
        }
        /// <summary>
        /// Service log by user
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public static DriveService GetService2(string user)
        {
            var firmids = HttpContext.Current.Session["sessionfirmid"];
            var userids = HttpContext.Current.Session["sessionuserid"];
            var firmid = Convert.ToString(firmids);
            var userid = Convert.ToString(userids);
            UserCredential credential;
            // Load Web Secret file
            var CSPath = HttpContext.Current.Server.MapPath("~/");
            using (var stream = new FileStream(Path.Combine(CSPath, "Gdrivecredentials.json"), FileMode.Open, FileAccess.Read))
            {
                // Path to token folder 
                String FolderPath = HttpContext.Current.Server.MapPath("~/");
                String FilePath = Path.Combine(FolderPath + "\\GDriveTokens\\" + firmid + "\\" + userid, "Credentials.json");
                credential = GoogleWebAuthorizationBroker.AuthorizeAsync(
                    GoogleClientSecrets.Load(stream).Secrets,
                    Scopes,
                    "user",
                    CancellationToken.None,
                    new FileDataStore(FilePath, true)).Result;
            }
            // Create Drive API service.
            var service = new DriveService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = "mykase2",
            });
            return service;
        }
        /// <summary>
        /// Create Drive API service.
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public static DriveService GetService(string user)
        {
            var firmids = HttpContext.Current.Session["sessionfirmid"];
            var userids = HttpContext.Current.Session["sessionuserid"];
            var firmid = Convert.ToString(firmids);
            var userid = Convert.ToString(userids);
            UserCredential credential;
            //Root Folder of project
            var CSPath = HttpContext.Current.Server.MapPath("~/");
            using (var stream = new FileStream(Path.Combine(CSPath, "Gdrivecredentials.json"), FileMode.Open, FileAccess.Read))
            {
                String FolderPath = HttpContext.Current.Server.MapPath("~/");
                String FilePath = Path.Combine(FolderPath + "\\GDriveTokens\\" + firmid + "\\" + userid, "Credentials.json");
                credential = GoogleWebAuthorizationBroker.AuthorizeAsync(
                    GoogleClientSecrets.FromStream(stream).Secrets,
                    Scopes,
                     HttpContext.Current.Session.SessionID.ToString(),
                    CancellationToken.None,
                new FileDataStore(FilePath, true)).Result;
            }
            //create Drive API service.
            DriveService service = new Google.Apis.Drive.v2.DriveService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = "Mykase",
            });
            return service;
        }
        /// <summary>
        /// Get all files from Google Drive.
        /// </summary>
        /// <param name="folderid"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        public static List<Google.Apis.Drive.v2.Data.File> GetDriveFiles(string folderid = null, string user = null)
        {
            var rootfolderid = "";
            Google.Apis.Drive.v2.DriveService service = GetService(user);
            // Define parameters of request.
            List<Google.Apis.Drive.v2.Data.File> result = new List<Google.Apis.Drive.v2.Data.File>();
            About about = service.About.Get().Execute();
            if (String.IsNullOrEmpty(folderid))
            {
                rootfolderid = about.RootFolderId;
            }
            else
            {
                rootfolderid = folderid;
            }
            ///all listl
            DriveList request1 = new DriveList();
            FilesResource.ListRequest request = service.Files.List();
            request.Q = "'" + rootfolderid + "' in parents and trashed=false";
            do
            {
                try
                {
                    FileList files = request.Execute();
                    result.AddRange(files.Items);
                    request.PageToken = files.NextPageToken;
                }
                catch (Exception e)
                {
                    Console.WriteLine("An error occurred: " + e.Message);
                    request.PageToken = null;
                }
            } while (!String.IsNullOrEmpty(request.PageToken));
            //
            return result;
        }
        /// <summary>
        /// File Upload to the Google Drive root folder.
        /// </summary>
        /// <param name="service"></param>
        /// <param name="title"></param>
        /// <param name="description"></param>
        /// <param name="parentId"></param>
        /// <param name="mimeType"></param>
        /// <param name="filename"></param>
        /// <returns></returns>
        private static Google.Apis.Drive.v2.Data.File insertFile(DriveService service, String title, String description, String parentId, String mimeType, String filename)
        {
            // File's metadata.
            Google.Apis.Drive.v2.Data.File body = new Google.Apis.Drive.v2.Data.File();
            body.Title = title;
            body.Description = description;
            body.MimeType = mimeType;
            // Set the parent folder.
            if (!String.IsNullOrEmpty(parentId))
            {
                body.Parents = new List<ParentReference>()
          {new ParentReference() {Id = parentId}};
            }
            // File's content.
            byte[] byteArray = System.IO.File.ReadAllBytes(filename);
            MemoryStream stream = new MemoryStream(byteArray);
            try
            {
                FilesResource.InsertMediaUpload request = service.Files.Insert(body, stream, mimeType);
                request.Upload();
                File file = request.ResponseBody;
                return file;
            }
            catch (Exception e)
            {
                Console.WriteLine("An error occurred: " + e.Message);
                return null;
            }
        }
        /// <summary>
        /// Create directory
        /// </summary>
        /// <param name="_title"></param>
        /// <param name="_description"></param>
        /// <param name="_parent"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        public static string CreateDirectory(string _title, string _description, string _parent, string user)
        {
            File NewDirectory = null;
            Google.Apis.Drive.v2.DriveService service = GetService(user);
            File body = new File();
            body.Title = _title;
            body.Description = _description;
            body.MimeType = "application/vnd.google-apps.folder";
            if (String.IsNullOrEmpty(_parent))
            {
                body.Parents = new List<ParentReference>() { new ParentReference() { Id = "root" } };
            }
            else
            {
                body.Parents = new List<ParentReference>() { new ParentReference() { Id = _parent } };
            }
            try
            {
                FilesResource.InsertRequest request = service.Files.Insert(body);
                NewDirectory = request.Execute();
            }
            catch (Exception e)
            {
                //MessageBox.Show(e.Message, "Error Occured");
            }
            return "true";
        }
        /// <summary>
        /// Tries to figure out the mime type of the file.
        /// </summary>
        /// <param name="fileName"></param>
        /// <returns></returns>
        private static string GetMimeType(string fileName)
        {
            string mimeType = "application/unknown";
            string ext = System.IO.Path.GetExtension(fileName).ToLower();
            Microsoft.Win32.RegistryKey regKey = Microsoft.Win32.Registry.ClassesRoot.OpenSubKey(ext);
            if (regKey != null && regKey.GetValue("Content Type") != null)
                mimeType = regKey.GetValue("Content Type").ToString();
            return mimeType;
        }
        /// <summary>
        /// Upload file
        /// </summary>
        /// <param name="_uploadFile"></param>
        /// <param name="_parent"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        public static File uploadFile(string _uploadFile, string _parent, string user)
        {
            Google.Apis.Drive.v2.DriveService service = GetService(user);
            if (System.IO.File.Exists(_uploadFile))
            {
                File body = new File();
                body.Title = System.IO.Path.GetFileName(_uploadFile);
                body.Description = "File uploaded by user";
                body.MimeType = GetMimeType(_uploadFile);
                if (String.IsNullOrEmpty(_parent))
                {
                    body.Parents = new List<ParentReference>() { new ParentReference() { Id = "root" } };
                }
                else
                {
                    body.Parents = new List<ParentReference>() { new ParentReference() { Id = _parent } };
                }
                // File's content.
                byte[] byteArray = System.IO.File.ReadAllBytes(_uploadFile);
                System.IO.MemoryStream stream = new System.IO.MemoryStream(byteArray);
                try
                {
                    FilesResource.InsertMediaUpload request = service.Files.Insert(body, stream, GetMimeType(_uploadFile));
                    request.Upload();
                    return request.ResponseBody;
                }
                catch (Exception e)
                {
                    Console.WriteLine("An error occurred: " + e.Message);
                    return null;
                }
            }
            else
            {
                Console.WriteLine("File does not exist: " + _uploadFile);
                return null;
            }
        }
        /// <summary>
        /// Check file and folder
        /// </summary>
        /// <param name="foldername"></param>
        /// <param name="parent"></param>
        /// <param name="ftype"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        public static bool CheckFileFolder(string foldername, string parent = null, string ftype = null, string user = null)
        {
            bool IsExist = false;
            var rootfolderid = "";
            Google.Apis.Drive.v2.DriveService service = GetService(user);
            About about = service.About.Get().Execute();
            if (String.IsNullOrEmpty(parent))
            {
                rootfolderid = about.RootFolderId;
            }
            else
            {
                rootfolderid = parent;
            }
            // Define parameters of request.
            Google.Apis.Drive.v2.FilesResource.ListRequest FileListRequest = service.Files.List();
            if (ftype.ToString() == "file")
            {
                FileListRequest.Q = " Title='" + foldername + "' and '" + rootfolderid + "' in parents and trashed=false";
            }
            else
            {
                FileListRequest.Q = " Title='" + foldername + "'  and '" + rootfolderid + "' in parents and mimeType = 'application/vnd.google-apps.folder'  and trashed=false";
            }
            var files = FileListRequest.Execute();
            // List files.
            if (files.Items.Count > 0)
            {
                IsExist = true;
            }
            return IsExist;
        }
    }
}