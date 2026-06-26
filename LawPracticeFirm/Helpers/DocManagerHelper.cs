/**
 *
 * (c) Copyright Ascensio System SIA 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity.Core.Objects;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Configuration;
using System.Web.Script.Serialization;
using DataAccess.Modals;
using LawPracticeFirm.Models;
using QueryStringEDAES;

namespace LawPracticeFirm.Helpers
{
    public class DocManagerHelper
    {
        /// <summary>
        /// Get max file size
        /// </summary>
        public static long MaxFileSize
        {
            get
            {
                long size;
                long.TryParse(WebConfigurationManager.AppSettings["filesize-max"], out size);
                return size > 0 ? size : 5 * 1024 * 1024;
            }
        }

        /// <summary>
        /// Get all the supported file extensions
        /// </summary>
        public static List<string> FileExts
        {
            get { return ViewedExts.Concat(EditedExts).Concat(ConvertExts).Concat(FillFormExts).ToList(); }
        }

        /// <summary>
        /// Get file extensions that can be viewed
        /// </summary>
        public static List<string> ViewedExts
        {
            get { return (WebConfigurationManager.AppSettings["files.docservice.viewed-docs"] ?? "").Split(new char[] { '|', ',' }, StringSplitOptions.RemoveEmptyEntries).ToList(); }
        }
        /// <summary>
        /// Add file extension
        /// </summary>
        public static List<string> FillFormExts
        {
            get { return (WebConfigurationManager.AppSettings["files.docservice.fillform-docs"] ?? "").Split(new char[] { '|', ',' }, StringSplitOptions.RemoveEmptyEntries).ToList(); }
        }

        /// <summary>
        /// Get file extensions that can be edited
        /// </summary>
        public static List<string> EditedExts
        {
            get { return (WebConfigurationManager.AppSettings["files.docservice.edited-docs"] ?? "").Split(new char[] { '|', ',' }, StringSplitOptions.RemoveEmptyEntries).ToList(); }
        }

        /// <summary>
        /// Get file extensions that can be converted
        /// </summary>
        public static List<string> ConvertExts
        {
            get { return (WebConfigurationManager.AppSettings["files.docservice.convert-docs"] ?? "").Split(new char[] { '|', ',' }, StringSplitOptions.RemoveEmptyEntries).ToList(); }
        }

        /// <summary>
        ///  Get current user host address
        /// </summary>
        /// <param name="userAddress"></param>
        /// <returns></returns>
        public static string CurUserHostAddress(string userAddress = null)
        {
            return Regex.Replace(userAddress ?? HttpContext.Current.Request.UserHostAddress, "[^0-9a-zA-Z.=]", "_");
        }

        /// <summary>
        /// Get the storage path of the file
        /// </summary>
        /// <param name="fileName"></param>
        /// <param name="userAddress"></param>
        /// <returns></returns>
        public static string StoragePath(string fileName, string userAddress = null)
        {
            var directory = HttpRuntime.AppDomainAppPath + CurUserHostAddress(userAddress) + "\\";
            return directory + Path.GetFileName(fileName);
        }

        /// <summary>
        /// Get the path to the forcesaved file version
        /// </summary>
        /// <param name="fileName"></param>
        /// <param name="userAddress"></param>
        /// <param name="create"></param>
        /// <returns></returns>
        public static string ForcesavePath(string fileName, string userAddress, Boolean create)
        {
            // create the directory to this file version
            var directory = HttpRuntime.AppDomainAppPath + CurUserHostAddress(userAddress) + "\\";
            if (!Directory.Exists(directory))
            {
                return "";
            }

            // create the directory to the history of this file version
            directory = directory + Path.GetFileName(fileName) + "-hist" + "\\";
            if (!Directory.Exists(directory))
            {
                if (create)
                {
                    //Directory.CreateDirectory(directory);
                }
                else
                {
                    return "";
                }
            }

            // get the path to the given file
            directory = directory + Path.GetFileName(fileName);
            if (!File.Exists(directory))
            {
                if (!create)
                {
                    return "";
                }
            }

            return directory;
        }

        /// <summary>
        /// Get the history directory
        /// </summary>
        /// <param name="storagePath"></param>
        /// <returns></returns>
        public static string HistoryDir(string storagePath)
        {
            return storagePath += "-hist";
        }

        /// <summary>
        /// Get the path to the file version by the history path and file version
        /// </summary>
        /// <param name="histPath"></param>
        /// <param name="version"></param>
        /// <returns></returns>
        public static string VersionDir(string histPath, int version)
        {
            return Path.Combine(histPath, version.ToString());
        }

        /// <summary>
        /// Get the path to the file version by the file name, user address and file version
        /// </summary>
        /// <param name="fileName"></param>
        /// <param name="userAddress"></param>
        /// <param name="version"></param>
        /// <returns></returns>
        public static string VersionDir(string fileName, string userAddress, int version)
        {
            return VersionDir(HistoryDir(StoragePath(fileName, userAddress)), version);
        }

        /// <summary>
        /// Get the file version by the history path
        /// </summary>
        /// <param name="historyPath"></param>
        /// <returns></returns>
        public static int GetFileVersion(string historyPath)
        {
            if (!Directory.Exists(historyPath)) return 1;  // if the history path doesn't exist, then the file version is 1
            return Directory.EnumerateDirectories(historyPath).Count() + 1;  // take only directories from the history folder and count them
        }

        /// <summary>
        /// Get the file version by the file name and user address
        /// </summary>
        /// <param name="fileName"></param>
        /// <param name="userAddress"></param>
        /// <returns></returns>
        public static int GetFileVersion(string fileName, string userAddress)
        {
            return GetFileVersion(HistoryDir(StoragePath(fileName, userAddress)));
        }

        /// <summary>
        /// Get a file name with an index if the file with such a name already exists
        /// </summary>
        /// <param name="fileName"></param>
        /// <param name="userAddress"></param>
        /// <returns></returns>
        public static string GetCorrectName(string fileName, string userAddress = null)
        {
            var baseName = Path.GetFileNameWithoutExtension(fileName);
            var ext = Path.GetExtension(fileName).ToLower();
            var name = baseName + ext;

            for (var i = 1; File.Exists(StoragePath(name, userAddress)); i++)  // run through all the files with such a name in the storage directory
            {
                name = baseName + " (" + i + ")" + ext;  // and add an index to the base name
            }
            return name;
        }

        /// <summary>
        /// Get all the stored files from the user host address
        /// </summary>
        /// <returns></returns>
        public static List<FileInfo> GetStoredFiles()
        {
            var directory = HttpRuntime.AppDomainAppPath + WebConfigurationManager.AppSettings["storage-path"] + CurUserHostAddress(null) + "\\";
            if (!Directory.Exists(directory)) return new List<FileInfo>();

            var directoryInfo = new DirectoryInfo(directory);

            // take files from the root directory
            List<FileInfo> storedFiles = directoryInfo.GetFiles("*.*", SearchOption.TopDirectoryOnly).ToList();

            return storedFiles;
        }

        /// <summary>
        /// Create demo document
        /// </summary>
        /// <param name="fileExt"></param>
        /// <param name="withContent"></param>
        /// <returns></returns>
        public static string CreateDemo(string fileExt, bool withContent)
        {
            var demoName = (withContent ? "sample." : "new.") + fileExt;  // create sample or new template file with the necessary extension
            var demoPath = "assets\\" + (withContent ? "sample\\" : "new\\");  // get the path to the sample document

            var fileName = GetCorrectName(demoName);  // get a file name with an index if the file with such a name already exists

            File.Copy(HttpRuntime.AppDomainAppPath + demoPath + demoName, StoragePath(fileName));  // copy file to the storage directory

            return fileName;
        }
        /// <summary>
        /// Get storage file path for cloud
        /// </summary>
        /// <param name="fileName"></param>
        /// <param name="userAddress"></param>
        /// <param name="dname"></param>
        /// <param name="firmids"></param>
        /// <param name="userids"></param>
        /// <returns></returns>
        public static string StoragePathEditFilecloudNewFile(string fileName, string userAddress = null, string dname = null, string firmids = null, string userids = null)
        {


            string dpath = "";
            string dnames = dname;

            var db = new LawPracticeEntities();
            string folderdirectid = dnames;
            var fids = firmids;
            var uids = userids;
            var fid = fids;
            var uid = uids;
            if (folderdirectid == "0")
            {
                folderdirectid = Guid.Empty.ToString();
            }
            else
            {
            }
            var dirfullpath = db.sp_GetfilepathsCloud(Guid.Parse(fid), Guid.Parse(uid), Guid.Parse(folderdirectid)).FirstOrDefault();
            string filedata = dirfullpath;
            if (filedata != null)
            {
                dpath = filedata;
                dpath = "/" + fid + "/" + uid + "/" + dpath;
            }
            else
            {
                dpath = "/" + fid + "/" + uid;
            }
            userAddress = "WorkSpace";
            string firmid = "";
            userAddress = userAddress + dpath;
            return userAddress;
        }
        /// <summary>
        /// Write service log
        /// </summary>
        /// <param name="content"></param>
        private static void LogService(string content)
        {
            var templogpath = HttpContext.Current.Server.MapPath("//");
            FileStream fs = new FileStream(templogpath + "//MyKaseoffiecSyncLog.txt", FileMode.OpenOrCreate, FileAccess.Write);
            StreamWriter sw = new StreamWriter(fs);
            sw.BaseStream.Seek(0, SeekOrigin.End);
            sw.WriteLine(content);
            sw.Flush();
            sw.Close();
        }
        /// <summary>
        /// Create demo file cloud
        /// </summary>
        /// <param name="fileExt"></param>
        /// <param name="fname"></param>
        /// <param name="dname"></param>
        /// <param name="firmuser"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public static string CreateDemoCloud(string fileExt, string fname = null, string dname = null, string firmuser = null, string userid = null)
        {
            var dbdirectory1 = "";
            var caseid = "";
            string folderdirectid = "";
            string newpath = "";
            var demoName = fname + "." + fileExt;
            var demoName1 = "File." + fileExt;
            var isNoticeParent = "";
            var fileName = demoName;
            string input = HttpContext.Current.Server.MapPath("~/Documents/AppData/" + demoName1);
            FileInfo fi = new FileInfo(input);
            var DocSize = fi.Length;
            string output = OnlineStoragePathCloud(fileName, firmuser, dname, userid);
            try
            {
                LogService("input=" + input);
                LogService("output=" + output);
                QueryAES.FileEncrypt(input, output);
            }
            catch (Exception err)
            {
                LogService("decrpt file=" + err.Message);
            }
            var origininalfilename = "";
            var parentfoldername = "";
            //get azure save path
            var db = new LawPracticeEntities();
            if (dname.ToString() != "0")
            {
                folderdirectid = dname;
                var storagePathcloud = "";
                var ddetails = db.usp_CheckFilefolderCloud(firmuser, folderdirectid.ToString()).FirstOrDefault();
                if (ddetails != null)
                {
                    parentfoldername = ddetails.fname;
                    caseid = ddetails.Caseid;
                    isNoticeParent = ddetails.IsNoticeParent.ToString();
                    if (!String.IsNullOrEmpty(caseid))
                    {
                        if (ddetails.pfile.ToString() == Guid.Empty.ToString())
                        {
                            storagePathcloud = ddetails.AZureFileId.TrimEnd('/').TrimStart('/');
                        }
                        else
                        {
                            var foldernamedata = db.usp_GetViewFilesCloudById(Guid.Parse(firmuser), ddetails.pfile.ToString()).FirstOrDefault();
                            if (foldernamedata != null)
                            {
                                if (foldernamedata.pfile.ToString() == Guid.Empty.ToString())
                                {
                                    storagePathcloud = ddetails.AZureFileId.TrimStart('/').TrimEnd('/') + "/" + ddetails.fname;
                                }
                                else
                                {
                                    storagePathcloud = ddetails.AZureFileId.TrimStart('/').TrimEnd('/');
                                }
                            }
                        }
                    }
                    else
                    {
                        if (ddetails.pfile.ToString() == Guid.Empty.ToString())
                        {
                            storagePathcloud = ddetails.AZureFileId.TrimStart('/').TrimEnd('/') + "/" + ddetails.fname;
                        }
                        else
                        {
                            storagePathcloud = ddetails.AZureFileId.TrimStart('/').TrimEnd('/');
                        }
                    }

                }
                //create directory
                AzureDocument.creatroot(firmuser, userid);
                //inser file in azure
                int it = 0;
                origininalfilename = fileName;
                var orfileNameOnly = fileName.Remove(fileName.LastIndexOf('.') + 1).TrimEnd('.');
                var extension = fileName.Split('.').Last();
                while (AzureDocument.fileexist(storagePathcloud, origininalfilename, firmuser, userid))
                {
                    it += 1;
                    origininalfilename = string.Format("{0}({1}).{2}", orfileNameOnly, it, extension);
                }
                var cratefile = AzureDocument.filecreateafteredit(output, storagePathcloud, origininalfilename, firmuser, userid);
                var actualpath = db.ViewFilesClouds.Where(z => z.Id.ToString() == folderdirectid.ToString() && z.Firmid.ToString() == firmuser.ToString()).Select(x => new { fullname = x.fname, firmid = x.Firmid, firmuser = x.Firmuser }).FirstOrDefault();
                var completepath = actualpath.fullname;
                newpath = completepath.ToString();
                dbdirectory1 = newpath;
                string firmid = firmuser;
                ViewFilesCloud vf = new ViewFilesCloud();
                string id = "";
                ObjectParameter IDParameter;
                IDParameter = new ObjectParameter("id", id);
                var data = db.usp_SaveFileOnlineCreateOrCheckIn(firmuser, userid, origininalfilename, storagePathcloud, 1, dname.ToString(), null, fileExt, null, IDParameter, caseid, null, 0, "1", DocSize, null, isNoticeParent);
                id = Convert.ToString(IDParameter.Value);
                try
                {
                    if (!String.IsNullOrEmpty(caseid))
                    {
                        var getcaseuser = db.usp_getassignuserbycaseid(firmuser, userid, caseid).ToList();
                        if (getcaseuser != null)
                        {
                            foreach (var item in getcaseuser)
                            {
                                if (item.auser.ToString() != userid.ToString())
                                {
                                    if (item.cstatus != 1)
                                    {
                                        Notification.SendEmailFromDBContent("CreateOnlineDocUnderSubFolder", null, firmuser, userid, item.auser.ToString(), caseid, origininalfilename, parentfoldername);
                                    }
                                }
                            }
                        }
                    }
                }
                catch
                {
                }
                return id;
            }
            else
            {
                var storagePathcloud = DocManagerHelper.StoragePathEditFilecloudNewFile(fileName, "WorkSpace", dname, firmuser, userid);
                //inser file in azure
                AzureDocument.creatroot(firmuser, userid);
                //check and rename file
                int it = 0;
                origininalfilename = fileName;
                var orfileNameOnly = fileName.Remove(fileName.LastIndexOf('.') + 1).TrimEnd('.');
                var extension = fileName.Split('.').Last();
                while (AzureDocument.fileexist(storagePathcloud, origininalfilename, firmuser, userid))
                {
                    it += 1;
                    origininalfilename = string.Format("{0}({1}).{2}", orfileNameOnly, it, extension);
                }
                var cratefile = AzureDocument.filecreateafteredit(output, storagePathcloud, origininalfilename, firmuser, userid);
                string id = "";
                ObjectParameter IDParameter;
                IDParameter = new ObjectParameter("id", id);
                var data = db.usp_SaveFileOnlineCreateOrCheckIn(firmuser, userid, origininalfilename, storagePathcloud, 1, Guid.Empty.ToString(), null, fileExt, null, IDParameter, null, null, 0, "1", DocSize, null, null);
                id = Convert.ToString(IDParameter.Value);
                return id.ToString();
            }
        }
        /// <summary>
        /// Get online storage file path
        /// </summary>
        /// <param name="fileName"></param>
        /// <param name="firmuser"></param>
        /// <param name="dname"></param>
        /// <param name="userid"></param>
        /// <param name="userAddress"></param>
        /// <returns></returns>
        public static string OnlineStoragePathCloud(string fileName, string firmuser = null, string dname = null, string userid = null, string userAddress = null)
        {
            string folderdirectid = "";
            var path = "";
            string dpath = "";
            string oldpath = "";
            var directory = "";
            var newpath = "";
            var newpath1 = "";
            var db = new LawPracticeEntities();
            if (dname == "0")
            {
                directory = HttpContext.Current.Server.MapPath("~/TempWorkSpace/" + firmuser + "/" + userid);
                if (!Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory);
                }
                return directory + "/" + fileName;
            }
            else
            {
                folderdirectid = dname;
                var actualpath = db.ViewFilesClouds.Where(z => z.Id.ToString() == folderdirectid.ToString() && z.Firmid.ToString() == firmuser.ToString()).Select(x => new { fullname = x.fname, firmid = x.Firmid, firmuser = x.Firmuser }).FirstOrDefault();
                var completepath = actualpath.firmid + "/" + actualpath.firmuser + "/" + actualpath.fullname;
                var fid = actualpath.firmid;
                var uid = actualpath.firmuser;
                var dirfullpath = db.sp_GetfilepathsCloud(fid, uid, Guid.Parse(folderdirectid)).FirstOrDefault();
                string filedata = dirfullpath;
                if (filedata != null)
                {
                    dpath = filedata;
                    var getcaseid = db.usp_GetViewFilesCloudById(Guid.Parse(firmuser), dname).FirstOrDefault();
                    if (!String.IsNullOrEmpty(getcaseid.Caseid))
                    {
                        if (getcaseid.Caseid.ToString() != Guid.Empty.ToString())
                        {
                            oldpath = "/TempWorkSpace/" + fid + "/" + uid + "/" + getcaseid.Caseid;
                        }
                        else
                        {
                            oldpath = "/TempWorkSpace/" + fid + "/" + uid;
                        }
                    }
                    else
                    {
                        oldpath = "/TempWorkSpace/" + fid + "/" + uid;
                    }
                    directory = HttpContext.Current.Server.MapPath("~/" + oldpath + "/");
                }
                if (!Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory);
                }
                return directory + "/" + fileName;
            }
        }
        /// <summary>
        /// Create meta information
        /// </summary>
        /// <param name="fileName"></param>
        /// <param name="uid"></param>
        /// <param name="uname"></param>
        /// <param name="userAddress"></param>
        public static void CreateMeta(string fileName, string uid, string uname, string userAddress = null)
        {
            var histDir = HistoryDir(StoragePath(fileName, userAddress));  // create history directory
            Directory.CreateDirectory(histDir);
            // create createdInfo.json file with meta information in the history directory (creation time, user id and name)
            File.WriteAllText(Path.Combine(histDir, "createdInfo.json"), new JavaScriptSerializer().Serialize(new Dictionary<string, object> {
                { "created", DateTime.Now.ToString("yyyy'-'MM'-'dd HH':'mm':'ss") },
                { "id", uid },
                { "name", uname }
            }));
        }

        /// <summary>
        /// Get file url
        /// </summary>
        /// <param name="fileName"></param>
        /// <param name="forDocumentServer"></param>
        /// <returns></returns>
        public static string GetFileUri(string fileName, Boolean forDocumentServer)
        {
            var uri = new UriBuilder(GetServerUrl(forDocumentServer))
            {
                Path = HttpRuntime.AppDomainAppVirtualPath + "/"
                           + CurUserHostAddress() + "/"
                           + fileName,
                Query = ""
            };

            return uri.ToString();
        }

        /// <summary>
        /// Get the path url
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
        public static string GetPathUri(string path)
        {
            var uri = new UriBuilder(GetServerUrl(true))
            {
                Path = HttpRuntime.AppDomainAppVirtualPath + "/"
                           + path,
                Query = ""
            };

            return uri.ToString();
        }

        /// <summary>
        /// Get the server url
        /// </summary>
        /// <param name="forDocumentServer"></param>
        /// <returns></returns>
        public static string GetServerUrl(Boolean forDocumentServer)
        {
            if (forDocumentServer && !WebConfigurationManager.AppSettings["files.docservice.url.example"].Equals(""))
            {
                return WebConfigurationManager.AppSettings["files.docservice.url.example"];
            }
            else
            {
                var uri = new UriBuilder(HttpContext.Current.Request.Url) { Query = "" };
                var requestHost = HttpContext.Current.Request.Headers["Host"];
                if (!string.IsNullOrEmpty(requestHost))
                    uri = new UriBuilder(uri.Scheme + "://" + requestHost);

                return uri.ToString();
            }
        }

        /// <summary>
        /// Get the callback url
        /// </summary>
        /// <param name="fileName"></param>
        /// <returns></returns>
        public static string GetCallback(string fileName)
        {
            var callbackUrl = new UriBuilder(GetServerUrl(true))
            {
                Path =
                    HttpRuntime.AppDomainAppVirtualPath
                    + (HttpRuntime.AppDomainAppVirtualPath.EndsWith("/") ? "" : "/")
                    + "webeditorcloud.ashx",
                Query = "type=track"
                        + "&fileName=" + HttpUtility.UrlEncode(fileName)
                        + "&userAddress=" + HttpUtility.UrlEncode(HttpContext.Current.Request.UserHostAddress)
            };
            return callbackUrl.ToString();
        }

        /// <summary>
        /// Get url to the created file
        /// </summary>
        /// <param name="fileType"></param>
        /// <returns></returns>
        public static string GetCreateUrl(FileUtility.FileType fileType)
        {
            var createUrl = new UriBuilder(GetServerUrl(false))
            {
                Path =
                    HttpRuntime.AppDomainAppVirtualPath
                    + (HttpRuntime.AppDomainAppVirtualPath.EndsWith("/") ? "" : "/")
                    + "Docs/SampleCloud",
                Query = "fileExt=" + DocManagerHelper.GetInternalExtension(fileType).Trim('.')
            };
            return createUrl.ToString();
        }

        /// <summary>
        /// Get url to download a file
        /// </summary>
        /// <param name="fileName"></param>
        /// <returns></returns>
        public static string GetDownloadUrl(string fileName)
        {
            var downloadUrl = new UriBuilder(GetServerUrl(true))
            {
                Path =
                    HttpRuntime.AppDomainAppVirtualPath
                    + (HttpRuntime.AppDomainAppVirtualPath.EndsWith("/") ? "" : "/")
                    + "webeditorcloud.ashx",
                Query = "type=download"
                        + "&fileName=" + HttpUtility.UrlEncode(fileName)
                        + "&userAddress=" + HttpUtility.UrlEncode(HttpContext.Current.Request.UserHostAddress)
            };
            return downloadUrl.ToString();
        }

        /// <summary>
        /// Get an editor internal extension
        /// </summary>
        /// <param name="fileType"></param>
        /// <returns></returns>
        public static string GetInternalExtension(FileUtility.FileType fileType)
        {
            switch (fileType)
            {
                case FileUtility.FileType.Word:  // .docx for word file type
                    return ".docx";
                case FileUtility.FileType.Cell:  // .xlsx for cell file type
                    return ".xlsx";
                case FileUtility.FileType.Slide:  // .pptx for slide file type
                    return ".pptx";
                default:
                    return ".docx";  // the default file type is .docx
            }
        }

        /// <summary>
        /// Get image url for templates
        /// </summary>
        /// <param name="fileType"></param>
        /// <returns></returns>
        public static string GetTemplateImageUrl(FileUtility.FileType fileType)
        {
            var path = new UriBuilder(GetServerUrl(true)) // templates image url in the "From Template" section
            {
                Path = HttpRuntime.AppDomainAppVirtualPath
                    + (HttpRuntime.AppDomainAppVirtualPath.EndsWith("/") ? "" : "/")
                    + "Content\\images\\"
            };
            switch (fileType)
            {
                case FileUtility.FileType.Word:  // for word file type
                    return path + "file_docx.svg";
                case FileUtility.FileType.Cell:  // for cell file type
                    return path + "file_xlsx.svg";
                case FileUtility.FileType.Slide:  // for slide file type
                    return path + "file_pptx.svg";
                default:
                    return path + "file_docx.svg";  // the default value
            }
        }

        /// <summary>
        /// Get file information
        /// </summary>
        /// <param name="fileId"></param>
        /// <returns></returns>
        public static List<Dictionary<string, object>> GetFilesInfo(string fileId = null)
        {
            var files = new List<Dictionary<string, object>>();

            // run through all the stored files
            foreach (var file in GetStoredFiles())
            {
                // write all the parameters to the map
                var dictionary = new Dictionary<string, object>();
                dictionary.Add("version", GetFileVersion(file.Name, null));
                dictionary.Add("id", ServiceConverter.GenerateRevisionId(DocManagerHelper.CurUserHostAddress() + "/" + file.Name + "/" + File.GetLastWriteTime(DocManagerHelper.StoragePath(file.Name, null)).GetHashCode()));
                dictionary.Add("contentLength", Math.Round(file.Length / 1024.0, 2) + " KB");
                dictionary.Add("pureContentLength", file.Length);
                dictionary.Add("title", file.Name);
                dictionary.Add("updated", file.LastWriteTime.ToString());

                // get file information by its id
                if (fileId != null)
                {
                    if (fileId.Equals(dictionary["id"]))
                    {
                        files.Add(dictionary);
                        break;
                    }
                }
                else
                {
                    files.Add(dictionary);
                }
            }

            return files;
        }

        /// <summary>
        /// Get azure storage edit file path
        /// </summary>
        /// <param name="fileName"></param>
        /// <param name="userAddress"></param>
        /// <param name="dname"></param>
        /// <param name="firmids"></param>
        /// <param name="userids"></param>
        /// <returns></returns>
        public static string StoragePathEditFileAzure(string fileName, string userAddress = null, string dname = null, string firmids = null, string userids = null)
        {

            var UserHostAddress = ConfigurationManager.AppSettings["UserHostAddress"];
            string dpath = "";
            string dnames = dname;

            var db = new LawPracticeEntities();
            string folderdirectid = dnames;

            var fids = firmids;
            var uids = userids;
            var fid = fids;
            var uid = uids;
            var dirfullpath = db.sp_GetfilepathsCloud(Guid.Parse(fid), Guid.Parse(uid), Guid.Parse(folderdirectid)).FirstOrDefault();
            string filedata = dirfullpath;
            if (filedata != null)
            {
                var dirfullpath2 = db.Usp_FileDetailsCloud(fid, uid, folderdirectid).FirstOrDefault();

                userAddress = dirfullpath2.AZureFileId.Replace("WorkSpace", UserHostAddress);

                string directory = HttpContext.Current.Server.MapPath("~/" + userAddress + "/");

                if (!Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory);
                }
                return directory;
            }
            else
            {

                dpath = "/" + fid + "/" + uid;
                string firmid = "";
                userAddress = userAddress + dpath;
                string directory = HttpContext.Current.Server.MapPath("~/" + userAddress + "/");
                if (!Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory);
                }
                return directory;
            }
        }
        /// <summary>
        /// Get cloud storage edit file path
        /// </summary>
        /// <param name="fileName"></param>
        /// <param name="userAddress"></param>
        /// <param name="dname"></param>
        /// <param name="firmids"></param>
        /// <param name="userids"></param>
        /// <returns></returns>
        public static string StoragePathEditFilecloud(string fileName, string userAddress = null, string dname = null, string firmids = null, string userids = null)
        {

            var UserHostAddress = ConfigurationManager.AppSettings["UserHostAddress"];
            string dpath = "";
            string dnames = dname;
            var db = new LawPracticeEntities();
            string folderdirectid = dnames;
            var fids = firmids;
            var uids = userids;
            var fid = fids;
            var uid = uids;
            var dirfullpath = db.sp_GetfilepathsCloud(Guid.Parse(fid), Guid.Parse(uid), Guid.Parse(folderdirectid)).FirstOrDefault();
            string filedata = dirfullpath;
            if (filedata != null)
            {
                var dirfullpathchk = db.Usp_FileDetailsCloud(fid, uid, folderdirectid).FirstOrDefault();
                dpath = dirfullpathchk.AZureFileId.Replace("WorkSpace", UserHostAddress);
                userAddress = dpath;
            }
            else
            {
                dpath = "/" + fid + "/" + uid;
                userAddress = WebConfigurationManager.AppSettings["UserHostAddress"];
                userAddress = userAddress + dpath;
            }
            return userAddress;
        }
    }
}