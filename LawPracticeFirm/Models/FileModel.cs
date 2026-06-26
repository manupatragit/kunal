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
using DataAccess.Modals;
using LawPracticeFirm.Helpers;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
namespace LawPracticeFirm.Models
{
    /// <summary>
    /// Create file folder
    /// </summary>
    public class FileModel
    {
        public string Mode { get; set; }  // editor mode
        public string Type { get; set; }  // editor type
        public string dname { get; set; }
        public string cmode { get; set; }
        public string ftoken { get; set; }  
        public string utoken { get; set; } 
        public string token { get; set; } 
        public string verifyurl { get; set; }  
        public string sharedfolder { get; set; }
        public string creatednew { get; set; }
        public string firmid { get; set; }
        public string userid { get; set; }
        public string username { get; set; }
        public string doclimit { get; set; }
        /// <summary>
        /// Get file url for Document Server
        /// </summary>
        public string FileUri
        {
            get { return DocManagerHelper.GetFileUri(FileName, true); }
        }
        /// <summary>
        /// Get file url for user
        /// </summary>
        public string FileUriUser
        {
            get { return DocManagerHelper.GetFileUri(FileName, false); }
        }
        /// <summary>
        /// Get file name
        /// </summary>
        public string FileName { get; set; }  // file name
        /// <summary>
        /// Get document type
        /// </summary>
        public string DocumentType
        {
            get { return FileUtility.GetFileType(FileName).ToString().ToLower(); }
        }
        /// <summary>
        /// Get document key
        /// </summary>
        public string Key
        {
            get { return ServiceConverter.GenerateRevisionId(DocManagerHelper.CurUserHostAddress() + "/" + FileName + "/" + File.GetLastWriteTime(DocManagerHelper.StoragePath(FileName, null)).GetHashCode()); }
        }
        /// <summary>
        /// Get the callback url
        /// </summary>
        public string CallbackUrl
        {
            get { return DocManagerHelper.GetCallback(FileName); }
        }
        /// <summary>
        /// Download Url
        /// </summary>
        public string DownloadUrl
        {
            get { return DocManagerHelper.GetDownloadUrl(FileName); }
        }
        /// <summary>
        /// Generate doc key
        /// </summary>
        /// <returns></returns>
        public string GenerateDocKey()
        {
            const string src = "abcdefghijklmnopqrstuvwxyz0123456789";
            int length = 16;
            var sb = new StringBuilder();
            Random RNG = new Random();
            for (var i = 0; i < length; i++)
            {
                var c = src[RNG.Next(0, src.Length)];
                sb.Append(c);
            }
            return sb.ToString();
        }
        /// <summary>
        /// Service log
        /// </summary>
        /// <param name="content"></param>
        private void LogService(string content)
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
        /// get the document config
        /// </summary>
        /// <param name="request"></param>
        /// <param name="url"></param>
        /// <param name="dname"></param>
        /// <param name="cmode"></param>
        /// <param name="ftoken"></param>
        /// <param name="utoken"></param>
        /// <param name="Azuretoken"></param>
        /// <param name="verifyurl"></param>
        /// <param name="sharedfolder"></param>
        /// <param name="creatednew"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="username"></param>
        /// <param name="doclimit"></param>
        /// <returns></returns>
        public string GetDocConfig(HttpRequest request, UrlHelper url, string dname, string cmode, string ftoken, string utoken, string Azuretoken, string verifyurl, string sharedfolder, string creatednew, string firmid, string userid, string username, string doclimit)
        {
            string fullpath, dfullpath, fid, uid, dfullpathcloud, azurefileid = "";
            string dnames = dname;
            var documentkey = GenerateDocKey();
            if (dname == "0")
            {
                dname = "00000000-0000-0000-0000-000000000000";
            }
            if (dname == null)
            {
                dname = "00000000-0000-0000-0000-000000000000";
            }
            string folderdirectid = dname;
            bool fileExists = false;
            azurefileid = Azuretoken;
            var existpathcloud = azurefileid.Replace("WorkSpace", ConfigurationManager.AppSettings["UserHostAddress"]);
            var checkexistfile = AzureDocument.fileexist(existpathcloud, FileName, firmid, userid);
            if (checkexistfile == true)
            {
                fileExists = true;
                dfullpath = "/" + existpathcloud;
                dfullpathcloud = existpathcloud;
                fullpath = "/" + existpathcloud + "/" + FileName;
            }
            else
            {
                fileExists = false;
                dfullpath = "/" + azurefileid;
                dfullpathcloud = azurefileid;
                fullpath = "/" + azurefileid + "/" + FileName;
            }
            try
            {
                //create temp directoy
                dfullpath = dfullpath.Replace("/WorkSpace", "/TempWorkSpaceCloud");
                dfullpath = dfullpath.Replace("/LawPractice_ds", "/TempLawPractice_dsCloud");
                string fakepathin = HttpContext.Current.Server.MapPath("~/azuredirin/" + firmid + "/" + userid);
                string fakepathout = HttpContext.Current.Server.MapPath("~/" + dfullpath);
                dfullpath = HttpContext.Current.Server.MapPath("//" + dfullpath);
                //create dir
                if (!(Directory.Exists(dfullpath)))
                {
                    Directory.CreateDirectory(dfullpath);
                }
                if (!(Directory.Exists(fakepathin)))
                {
                    Directory.CreateDirectory(fakepathin);
                }
                if (!(Directory.Exists(fakepathout)))
                {
                    Directory.CreateDirectory(fakepathout);
                }
                //Create Temp File
                string sourceFile = HttpContext.Current.Server.MapPath("//" + fullpath);
                dfullpathcloud = dfullpathcloud.TrimStart('/').TrimEnd('/');
                var destinationFile = "";
                destinationFile = AzureDocument.Dirfilepath(dfullpathcloud, FileName, fakepathin, fakepathout, firmid, userid);
            }
            catch (Exception ex)
            {
                LogService("write file=" + ex.Message);
            }
            fullpath = fullpath.Replace("/WorkSpace", "/TempWorkSpaceCloud");
            fullpath = fullpath.Replace("/LawPractice_ds", "/TempLawPractice_dsCloud");
            var jss = new JavaScriptSerializer();
            var ext = Path.GetExtension(FileName).ToLower();  // get file extension
            var editorsMode = Mode ?? "edit";  // get editor mode
            var canEdit = DocManagerHelper.EditedExts.Contains(ext);  // check if the file with such an extension can be edited
            var id = request.Cookies.GetOrDefault("uid", null);
            var user = Users.getUser(id);  // get the user
            if ((!canEdit && editorsMode.Equals("edit") || editorsMode.Equals("fillForms")) && DocManagerHelper.FillFormExts.Contains(ext)) {
                editorsMode = "fillForms";
                canEdit = true;
            }
            var submitForm = editorsMode.Equals("fillForms") && id.Equals("uid-1") && false;  // check if the Submit form button is displayed or not
            var mode = canEdit && editorsMode != "view" ? "edit" : "view";  // set the mode parameter: change it to view if the document can't be edited
            var db = new LawPracticeEntities();
            //condotion based mode//
            var getuserdetails = db.usp_GetUserDetailByUserID(firmid, userid).FirstOrDefault();
            var userroleid = getuserdetails.RoleId;
            if (cmode == "createfile")
            {
                mode = "edit";
            }
            else
            {
                var chkchinout = db.usp_getchkinoutstatus(firmid.ToString(), userid.ToString(), ftoken).FirstOrDefault();
                if (chkchinout == 1)
                {
                    mode = "view";
                }
                if (chkchinout != 1)
                {
                    if (userroleid == 2)
                    {
                        var urlsegment = "directorylist/0";
                        var pagelist = db.usp_GetRightsPageDatabyPagelink(Convert.ToString(urlsegment)).FirstOrDefault();
                        if (pagelist != null)
                        {
                            //var pageaccesslist = db.usp_GetUserModuleRights(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.UserId.ToString(), pagelist.ParentPage).FirstOrDefault();
                            var pageaccesslist = db.usp_getdocsroll(firmid.ToString(), userid.ToString(), ftoken, pagelist.ParentPage.ToString()).FirstOrDefault();
                            if (pageaccesslist != null)
                            {
                                if (pageaccesslist.EditAll == 1)
                                {
                                    //check docs userid
                                    mode = "edit";
                                }
                                else if (pageaccesslist.Edit == 1)
                                {
                                    var getdocsuser = db.usp_CheckFilefolderCloud(firmid.ToString(), ftoken).FirstOrDefault();
                                    if (getdocsuser != null)
                                    {
                                        mode = "edit";
                                    }
                                    else
                                    {
                                        mode = "view";
                                    }
                                }
                                else
                                {
                                    mode = "view";
                                }
                            }
                            else
                            {
                            }
                        }
                    }
                }
            }
            try
            {
                if (!String.IsNullOrEmpty(verifyurl))
                {
                    if (!String.IsNullOrEmpty(sharedfolder))
                    {
                        //get data if valid
                        var dataverify = db.usp_CheckEditFilePermission(firmid.ToString(), userid.ToString(), sharedfolder).FirstOrDefault();
                        if (dataverify != null)
                        {
                            mode = "edit";
                        }
                        else
                        {
                            mode = "view";
                        }
                    }
                    else
                    {
                        //get data if valid
                        var dataverify = db.usp_CheckEditFilePermission(firmid.ToString(), userid.ToString(), ftoken).FirstOrDefault();
                        if (dataverify != null)
                        {
                            mode = "edit";
                        }
                        else
                        {
                            mode = "view";
                        }
                    }
                }
            }
            catch
            {
            }
            if (userroleid == 3)
            {
                mode = "view";
            }
            //insert user active 
            var ctuser = db.usp_onlyofficeuser(firmid.ToString(), userid.ToString(), ftoken);
            //check docsactive user
            int checkuserdocseditcount = db.usp_onlyofficeactiveuser(firmid.ToString(), userid.ToString(), ftoken).Count();
            if (checkuserdocseditcount > 0)
            {
                //get key
                var dockeys = db.usp_getofficekey(firmid.ToString(), userid.ToString(), ftoken).FirstOrDefault();
                if (String.IsNullOrEmpty(dockeys))
                {
                    //update key in db
                    var ct = db.usp_updateodckey(firmid.ToString(), userid.ToString(), ftoken, documentkey);
                }
                else
                {
                    documentkey = dockeys;
                }
            }
            else
            {
                //update key in db
                var ct = db.usp_updateodckey(firmid.ToString(), userid.ToString(), ftoken, documentkey);
            }
            if (doclimit.ToString() != "Available")
            {
                mode = "view";
            }
            //window.location.origin + "/webeditorcloud.ashx?type=track&fileName=@Model.FileName&userAddress=LawPractice_ds&dtoken=@ViewBag.dtoken&ftoken=@ViewBag.Firmid&utoken=@ViewBag.userid&Token=@ViewBag.token
            var callbackUrl = new UriBuilder(DocManagerHelper.GetServerUrl(false))
            {
                Path =
                    HttpRuntime.AppDomainAppVirtualPath
                    + (HttpRuntime.AppDomainAppVirtualPath.EndsWith("/") ? "" : "/")
                    + "webeditorcloud.ashx",
                Query = "type=track"
                        + "&fileName=" + HttpUtility.UrlEncode(FileName)
                        + "&userAddress=" + HttpUtility.UrlEncode(ConfigurationManager.AppSettings["UserHostAddress"])
                         + "&dtoken=" + HttpUtility.UrlEncode(ftoken)
                         + "&ftoken=" + HttpUtility.UrlEncode(firmid)
                         + "&utoken=" + HttpUtility.UrlEncode(utoken)
                         + "&Token=" + HttpUtility.UrlEncode(ftoken)
            };
            var getcallbackurl = callbackUrl.ToString();
            //condition based mode/
            var FileUrl = new UriBuilder(DocManagerHelper.GetServerUrl(false))
            {
                Path =
                   HttpRuntime.AppDomainAppVirtualPath
                   + (HttpRuntime.AppDomainAppVirtualPath.EndsWith("/") ? "" : "/")
                   + fullpath
            };
            var baseurl = FileUrl.ToString();
            // favorite icon state
            // bool? favorite = user.favorite;
            bool? favorite = false;
            var actionLink = request.GetOrDefault("actionLink", null);  // get the action link (comment or bookmark) if it exists
            var actionData = string.IsNullOrEmpty(actionLink) ? null : jss.DeserializeObject(actionLink);  // get action data for the action link
            var createUrl = DocManagerHelper.GetCreateUrl(FileUtility.GetFileType(FileName));
            var templatesImageUrl = DocManagerHelper.GetTemplateImageUrl(FileUtility.GetFileType(FileName)); // image url for templates
            var templates = new List<Dictionary<string, string>>
            {
                new Dictionary<string, string>()
                {
                    { "image", "" },
                    { "title", "Blank" },
                    { "url", createUrl },
                },
                new Dictionary<string, string>()
                {
                    { "image", templatesImageUrl },
                    { "title", "With sample content" },
                    { "url", createUrl + "&sample=true" },
                }
            };
            // specify the document config
            var config = new Dictionary<string, object>
                {
                    { "type", Type ?? "desktop" },
                    { "documentType", DocumentType },
                    {
                        "document", new Dictionary<string, object>
                            {
                                { "title", FileName },
                                { "url", baseurl },
                                { "fileType", ext.Trim('.') },
                                { "key", documentkey },
                                { "status", 2 },
                                {
                                    "info", new Dictionary<string, object>
                                        {
                                            { "owner", "Me" },
                                            { "uploaded", DateTime.Now.ToShortDateString() },
                                            { "favorite", favorite}
                                        }
                                },
                                {
                                    // the permission for the document to be edited and downloaded or not
                                    "permissions", new Dictionary<string, object>
                                        {
                                            { "comment", editorsMode != "view" && editorsMode != "fillForms" && editorsMode != "embedded" && editorsMode != "blockcontent" },
                                            { "copy", !user.deniedPermissions.Contains("copy") },
                                            { "download", !user.deniedPermissions.Contains("download") },
                                            { "edit", canEdit && (editorsMode == "edit" || editorsMode == "view" || editorsMode == "filter" || editorsMode == "blockcontent") },
                                            { "print", !user.deniedPermissions.Contains("print") },
                                            { "fillForms", editorsMode != "view" && editorsMode != "comment" && editorsMode != "embedded" && editorsMode != "blockcontent" },
                                            { "modifyFilter", editorsMode != "filter" },
                                            { "modifyContentControl", editorsMode != "blockcontent" },
                                            { "review", canEdit && (editorsMode == "edit" || editorsMode == "review") },
                                            { "reviewGroups", user.reviewGroups },
                                            { "commentGroups", user.commentGroups }
                                        }
                                }
                            }
                    },
                    {
                        "editorConfig", new Dictionary<string, object>
                            {
                                { "actionLink", actionData },
                                { "mode", mode },
                                { "lang", request.Cookies.GetOrDefault("ulang", "en") },
                                { "callbackUrl", getcallbackurl },  // absolute URL to the document storage service
                                { "createUrl", !user.id.Equals("uid-0") ? createUrl : null },
                                { "templates", user.templates ? templates : null },
                                {
                                    // the user currently viewing or editing the document
                                    "user", new Dictionary<string, object>
                                        {
                                            { "id", userid },
                                            { "name", username },
                                            { "group", user.group }
                                        }
                                },
                                {
                                    // the parameters for the embedded document type
                                    "embedded", new Dictionary<string, object>
                                        {
                                            { "saveUrl", baseurl },  // the absolute URL that will allow the document to be saved onto the user personal computer
                                            { "embedUrl", baseurl },  // the absolute URL to the document serving as a source file for the document embedded into the web page
                                            { "shareUrl", baseurl },  // the absolute URL that will allow other users to share this document
                                            { "toolbarDocked", "top" }  // the place for the embedded viewer toolbar (top or bottom)
                                        }
                                },
                                {
                                    // the parameters for the editor interface
                                    "customization", new Dictionary<string, object>
                                        {
                                            { "about", true },  // the About section display
                                            { "feedback", true },  // the Feedback & Support menu button display
                                            { "forcesave", false },  // adds the request for the forced file saving to the callback handler
                                            { "submitForm", submitForm },  // if the Submit form button is displayed or not
                                            {
                                                "goback", new Dictionary<string, object>  // settings for the Open file location menu button and upper right corner button
                                                    {
                                                        { "url", url.Action("Index", "Home") }  // the absolute URL to the website address which will be opened when clicking the Open file location menu button
                                                    }
                                            }
                                        }
                                }
                            }
                    }
                };
            // if the secret key to generate token exists
            if (JwtManager.Enabled)
            {
                // encode the document config into a token
                var token = JwtManager.Encode(config);
                config.Add("token", token);
            }
            return jss.Serialize(config);
        }
        /// <summary>
        /// Get the document history
        /// </summary>
        /// <param name="history"></param>
        /// <param name="historyData"></param>
        public void GetHistory(out string history, out string historyData)
        {
            var jss = new JavaScriptSerializer();
            var histDir = DocManagerHelper.HistoryDir(DocManagerHelper.StoragePath(FileName, null));
            history = null;
            historyData = null;
            if (DocManagerHelper.GetFileVersion(histDir) > 0)  // if the file was modified (the file version is greater than 0)
            {
                var currentVersion = DocManagerHelper.GetFileVersion(histDir);
                var hist = new List<Dictionary<string, object>>();
                var histData = new Dictionary<string, object>();
                for (var i = 1; i <= currentVersion; i++)  // run through all the file versions
                {
                    var obj = new Dictionary<string, object>();
                    var dataObj = new Dictionary<string, object>();
                    var verDir = DocManagerHelper.VersionDir(histDir, i);  // get the path to the given file version
                    var key = i == currentVersion ? Key : File.ReadAllText(Path.Combine(verDir, "key.txt"));  // get document key
                    obj.Add("key", key);
                    obj.Add("version", i);
                    if (i == 1)  // check if the version number is equal to 1
                    {
                        var infoPath = Path.Combine(histDir, "createdInfo.json");  // get meta data of this file
                        if (File.Exists(infoPath))
                        {
                            var info = jss.Deserialize<Dictionary<string, object>>(File.ReadAllText(infoPath));
                            obj.Add("created", info["created"]);  // write meta information to the object (user information and creation date)
                            obj.Add("user", new Dictionary<string, object>() {
                                { "id", info["id"] },
                                { "name", info["name"] },
                            });
                        }
                    }
                    dataObj.Add("key", key);
                    // write file url to the data object
                    dataObj.Add("url", i == currentVersion ? FileUri : DocManagerHelper.GetPathUri(Directory.GetFiles(verDir, "prev.*")[0].Substring(HttpRuntime.AppDomainAppPath.Length)));
                    dataObj.Add("version", i);
                    if (i > 1)  // check if the version number is greater than 1 (the file was modified)
                    {
                        // get the path to the changes.json file
                        var changes = jss.Deserialize<Dictionary<string, object>>(File.ReadAllText(Path.Combine(DocManagerHelper.VersionDir(histDir, i - 1), "changes.json")));
                        var changesArray = (ArrayList)changes["changes"];
                        var change = changesArray.Count > 0
                            ? (Dictionary<string, object>)changesArray[0]
                            : new Dictionary<string, object>();
                        // write information about changes to the object
                        obj.Add("changes", change.Count > 0 ? changes["changes"] : null);
                        obj.Add("serverVersion", changes["serverVersion"]);
                        obj.Add("created", change.Count > 0  ? change["created"] : null);
                        obj.Add("user", change.Count > 0 ? change["user"] : null);
                        var prev = (Dictionary<string, object>)histData[(i - 2).ToString()];  // get the history data from the previous file version
                        dataObj.Add("previous", new Dictionary<string, object>() {  // write information about previous file version to the data object
                            { "key", prev["key"] },  // write key and url information about previous file version
                            { "url", prev["url"] },
                        });
                        // write the path to the diff.zip archive with differences in this file version
                        dataObj.Add("changesUrl", DocManagerHelper.GetPathUri(Path.Combine(DocManagerHelper.VersionDir(histDir, i - 1), "diff.zip").Substring(HttpRuntime.AppDomainAppPath.Length)));
                    }
                    if(JwtManager.Enabled)
                    {
                        var token = JwtManager.Encode(dataObj);
                        dataObj.Add("token", token);
                    }
                    hist.Add(obj);  // add object dictionary to the hist list
                    histData.Add((i - 1).ToString(), dataObj);  // write data object information to the history data
                }
                // write history information about the current file version to the history object
                history = jss.Serialize(new Dictionary<string, object>()
                {
                    { "currentVersion", currentVersion },
                    { "history", hist }
                });
                historyData = jss.Serialize(histData);
            }
        }

        /// <summary>
        /// Get a document which will be compared with the current document
        /// </summary>
        /// <param name="compareConfig"></param>
        public void GetCompareFileData(out string compareConfig)
        {
            var jss = new JavaScriptSerializer();
            // get the path to the compared file
            var compareFileUrl = new UriBuilder(DocManagerHelper.GetServerUrl(true))
            {
                Path = HttpRuntime.AppDomainAppVirtualPath
                    + (HttpRuntime.AppDomainAppVirtualPath.EndsWith("/") ? "" : "/")
                    + "webeditorcloud.ashx",
                Query = "type=assets&fileName=" + HttpUtility.UrlEncode("sample.docx")
            };
            // create an object with the information about the compared file
            var dataCompareFile = new Dictionary<string, object>
            {
                { "fileType", "docx" },
                { "url", compareFileUrl.ToString() }
            };
            if (JwtManager.Enabled)  // if the secret key to generate token exists
            {
                var compareFileToken = JwtManager.Encode(dataCompareFile);  // encode the dataCompareFile object into the token
                dataCompareFile.Add("token", compareFileToken);  // and add it to the dataCompareFile object
            }
            compareConfig = jss.Serialize(dataCompareFile);
        }

        /// <summary>
        /// Get a logo config
        /// </summary>
        /// <param name="logoUrl"></param>
        public void GetLogoConfig(out string logoUrl)
        {
            var jss = new JavaScriptSerializer();
            // get the path to the logo image
            var mailMergeUrl = new UriBuilder(DocManagerHelper.GetServerUrl(true))
            {
                Path = HttpRuntime.AppDomainAppVirtualPath
                    + (HttpRuntime.AppDomainAppVirtualPath.EndsWith("/") ? "" : "/")
                    + "Content\\images\\logo.png"
            };
            // create a logo config
            var logoConfig = new Dictionary<string, object>
            {
                { "fileType", "png"},
                { "url", mailMergeUrl.ToString()}
            };
            if (JwtManager.Enabled)  // if the secret key to generate token exists
            {
                var token = JwtManager.Encode(logoConfig);  // encode logoConfig into the token
                logoConfig.Add("token", token);  // and add it to the logo config
            }
            logoUrl = jss.Serialize(logoConfig).Replace("{", "").Replace("}", "");
        }

        /// <summary>
        /// Get a mail merge config
        /// </summary>
        /// <param name="dataMailMergeRecipients"></param>
        public void GetMailMergeConfig(out string dataMailMergeRecipients)
        {
            var jss = new JavaScriptSerializer();
            // get the path to the recipients data for mail merging
            var mailMergeUrl = new UriBuilder(DocManagerHelper.GetServerUrl(true))
            {
                Path =
                    HttpRuntime.AppDomainAppVirtualPath
                    + (HttpRuntime.AppDomainAppVirtualPath.EndsWith("/") ? "" : "/")
                    + "webeditorcloud.ashx",
                Query = "type=csv"
            };
            // create a mail merge config
            var mailMergeConfig = new Dictionary<string, object>
            {
                { "fileType", "csv" },
                { "url", mailMergeUrl.ToString()}
            };
            if (JwtManager.Enabled)  // if the secret key to generate token exists
            {
                var mailmergeToken = JwtManager.Encode(mailMergeConfig);  // encode mailMergeConfig into the token
                mailMergeConfig.Add("token", mailmergeToken);  // and add it to the mail merge config
            }
            dataMailMergeRecipients = jss.Serialize(mailMergeConfig);
        }
        /// <summary>
        /// Get a users for mentions
        /// </summary>
        /// <param name="request"></param>
        /// <param name="usersForMentions"></param>
        public void GetUsersMentions(HttpRequest request, out string usersForMentions)
        {
            var jss = new JavaScriptSerializer();
            var id = request.Cookies.GetOrDefault("uid", null);
            var user = Users.getUser(id);
            usersForMentions = !user.id.Equals("uid-0") ? jss.Serialize(Users.getUsersForMentions(user.id)) : null;
        }
    }
}