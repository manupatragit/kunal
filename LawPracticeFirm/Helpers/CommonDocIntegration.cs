using BussinessLogic;
using DataAccess.Modals;
using LawPracticeFirm.Models;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using LawPracticeFirm.DAL;

namespace LawPracticeFirm.Helpers
{
    public class CommonDocIntegration
    {
        /// <summary>
        /// Upload document draft notice
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="noticeid"></param>
        /// <param name="ModuleName"></param>
        /// <returns></returns>
        public static string DocUploadNoticeDraft(string firmid, string userid, string noticeid, string ModuleName)
        {
            //upload on azure draft
            using (var db = new LawPracticeEntities())
            {
                string folderpathazure1 = "WorkSpace/" + firmid + "/NoticeManagement/" + noticeid.ToString();
                folderpathazure1 = folderpathazure1.TrimEnd('/').TrimStart('/');
                string fakepathout = "azuredirout/" + firmid.ToString() + "/" + userid.ToString();
                if (!(Directory.Exists(HttpContext.Current.Server.MapPath("~/" + fakepathout))))
                {
                    Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/" + fakepathout));
                }
                AzureDocumentself.CreateNestedDirectory(folderpathazure1);
                var noticeDraftFileName = db.sp_getNoticeDraftByNoticeId(noticeid).FirstOrDefault();
                var filename = noticeDraftFileName.Filename + ".doc";
                string outputs = HttpContext.Current.Server.MapPath("~/" + fakepathout + "/" + filename);
                var status = AzureDocumentself.filecreateafteredit(outputs, folderpathazure1, filename, null, null);
                var id = "";
                ObjectParameter IDParameter1;
                IDParameter1 = new ObjectParameter("id", id);
                FileInfo fi = new FileInfo(outputs);
                var DocSize = fi.Length;
                var newfolderid = "";
                var getfolderid = db.usp_GetNoticeFolderDetailsByNoticeId(firmid.ToString(), userid.ToString(), noticeid).FirstOrDefault();
                if (getfolderid != null)
                {
                    newfolderid = getfolderid.id.ToString();
                }
                try
                {
                    var data1 = db.usp_SaveFilefolderCloudNewForNotice(firmid.ToString(), userid.ToString(), filename, folderpathazure1, 1, newfolderid.ToString(), null, "pdf", null, IDParameter1, null, null, 0, null, DocSize, "1", "");
                    id = Convert.ToString(IDParameter1.Value);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                //map data into notice table
                var resultdata = db.usp_SaveNoticeDocMap(firmid.ToString(), userid.ToString(), noticeid.ToString(), id, "CreateNotice", null, null);
            }
            return "";
        }
        /// <summary>
        /// Upload notice document
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="noticeid"></param>
        /// <param name="ModuleName"></param>
        /// <param name="noticetitle"></param>
        /// <param name="receiveReplyID"></param>
        /// <param name="sendernameId"></param>
        /// <param name="NoticeSentOrReceived"></param>
        /// <param name="renameFolderName"></param>
        /// <returns></returns>
        public static string CommonDocUploadNotice(string firmid, string userid, string noticeid, string ModuleName, string noticetitle, string receiveReplyID, string sendernameId, string NoticeSentOrReceived, string renameFolderName)
        {
            var db = new LawPracticeEntities();
            var newfolderid = "";
            var dname = "";
            var dpaths = "";
            int maxFileSize = Convert.ToInt32(WebConfigurationManager.AppSettings["docelasticmaxFileSize"]);
            var id = "";
            var directoryid = "00000000-0000-0000-0000-000000000000";
            if (!String.IsNullOrEmpty(noticetitle)) //for new notice
            {
                //check notice parent exist or not
                try
                {
                    var chkparent = db.usp_GetNoticeParentFolder(firmid, userid, noticetitle, null, null).FirstOrDefault();
                    if (chkparent == null)
                    {
                        return "false";
                    }
                    //Create Folder for Notice
                    var noticeType = db.sp_getNoticeTypeByNoticeId(noticeid, firmid.ToString()).FirstOrDefault();
                    var foldername = db.sp_getNoticeThroughByNoticeId(noticeid, firmid.ToString(), noticeType).FirstOrDefault();
                    if (sendernameId.ToString().Trim() == "Other")
                    {
                        sendernameId = foldername.Senderothertxt;
                    }
                    var CheckClientFolder = db.usp_ClientFolderExistOrNot(firmid.ToString(), sendernameId.ToString()).FirstOrDefault();
                    if (CheckClientFolder != null)
                    {
                        dpaths = chkparent.AzureFileId + "/" + noticeid;
                        newfolderid = CheckClientFolder.ToString();
                    }
                    else
                    {
                        dname = foldername.NoticeThrough;
                        var NoticeThroughs = foldername.NoticeThrough;
                        if (dname == "Other")
                        {
                            dname = foldername.Senderothertxt;
                            NoticeThroughs = foldername.Senderothertxt;
                        }
                        if (dname == "Others")
                        {
                            dname = foldername.Senderothertxt;
                            NoticeThroughs = foldername.Senderothertxt;
                        }
                        dpaths = chkparent.AzureFileId + "/" + noticeid;
                        AzureDocument.CreateNestedDirectory(dpaths);
                        var createdirectorydata = AzureDocument.createfolder(dpaths, null, firmid.ToString(), userid.ToString());
                        ObjectParameter IDParameter;
                        IDParameter = new ObjectParameter("id", id);
                        var data = db.usp_SaveFilefolderCloudNewForNotice(firmid, userid, dname.TrimStart().TrimEnd(), dpaths, 0, chkparent.Id.ToString(), null, null, null, IDParameter, null, null, 0, "1", null, "1", sendernameId);
                        newfolderid = Convert.ToString(IDParameter.Value);
                        var resultdata1 = db.usp_SaveNoticeDocMap(firmid.ToString(), userid.ToString(), noticeid.ToString(), newfolderid, null, null, null);
                    }
                    var checkSentReceived = db.usp_SentReceivedFolderExistOrNot(firmid.ToString(), NoticeSentOrReceived, newfolderid).FirstOrDefault();
                    if (checkSentReceived != null)
                    {
                        dpaths = chkparent.AzureFileId + "/" + noticeid;
                        newfolderid = checkSentReceived.ToString();
                    }
                    else
                    {
                        if (NoticeSentOrReceived == "Sent")
                        {
                            dpaths = chkparent.AzureFileId + "/" + noticeid;
                            AzureDocument.CreateNestedDirectory(dpaths);
                            var createdirectorydata1 = AzureDocument.createfolder(dpaths, null, firmid.ToString(), userid.ToString());
                            ObjectParameter IDParameter1;
                            IDParameter1 = new ObjectParameter("id", id);
                            var data1 = db.usp_SaveFilefolderCloudNewForNotice(firmid, userid, "Sent", dpaths, 0, newfolderid.ToString(), null, null, null, IDParameter1, null, null, 0, "1", null, "1", "");
                            newfolderid = Convert.ToString(IDParameter1.Value);
                            var resultdata2 = db.usp_SaveNoticeDocMap(firmid.ToString(), userid.ToString(), noticeid.ToString(), newfolderid, null, null, null);
                        }
                        else
                        {
                            dpaths = chkparent.AzureFileId + "/" + noticeid;
                            AzureDocument.CreateNestedDirectory(dpaths);
                            var createdirectorydata2 = AzureDocument.createfolder(dpaths, null, firmid.ToString(), userid.ToString());
                            ObjectParameter IDParameter2;
                            IDParameter2 = new ObjectParameter("id", id);
                            var data2 = db.usp_SaveFilefolderCloudNewForNotice(firmid, userid, "Received", dpaths, 0, newfolderid.ToString(), null, null, null, IDParameter2, null, null, 0, "1", null, "1", "");
                            newfolderid = Convert.ToString(IDParameter2.Value);
                            var resultdata3 = db.usp_SaveNoticeDocMap(firmid.ToString(), userid.ToString(), noticeid.ToString(), newfolderid, null, null, null);
                        }
                    }
                    var checkTitleExist = db.usp_CheckTitleExistOrNot(firmid.ToString(), noticetitle, newfolderid).FirstOrDefault();
                    if (checkTitleExist != null)
                    {
                        dpaths = chkparent.AzureFileId + "/" + noticeid;
                        newfolderid = checkTitleExist.ToString();
                    }
                    else
                    {
                        dname = noticetitle;
                        if (dname == null)
                        {
                            dname = "DefaultNotice";
                        }
                        dpaths = chkparent.AzureFileId + "/" + noticeid;
                        AzureDocument.CreateNestedDirectory(dpaths);
                        var createdirectorydata3 = AzureDocument.createfolder(dpaths, null, firmid.ToString(), userid.ToString());
                        ObjectParameter IDParameter3;
                        IDParameter3 = new ObjectParameter("id", id);
                        var data3 = db.usp_SaveFilefolderCloudNewForNotice(firmid, userid, dname.TrimStart().TrimEnd(), dpaths, 0, newfolderid.ToString(), null, null, null, IDParameter3, null, null, 0, "1", null, "1", "");
                        newfolderid = Convert.ToString(IDParameter3.Value);
                        //map data into notice table
                        var resultdata = db.usp_SaveNoticeDocMap(firmid.ToString(), userid.ToString(), noticeid.ToString(), newfolderid, null, 1, null);
                    }
                }
                catch (Exception e)
                {
                    throw e;
                }
            }
            else
            {
                var getfolderid = db.usp_GetNoticeFolderDetailsByNoticeId(firmid, userid, noticeid).FirstOrDefault();
                if (getfolderid != null)
                {
                    if (renameFolderName.Trim() != "")
                    {
                        if (getfolderid.fname.Trim() != renameFolderName.Trim())
                        {
                            var result = db.usp_ModifyNoticeTitleFolderName(getfolderid.id.ToString(), renameFolderName.Trim(), firmid.ToString());
                        }
                    }
                    newfolderid = getfolderid.id.ToString();
                }
            }
            if (!String.IsNullOrEmpty(newfolderid))
            {
                var dpath = dpaths.TrimEnd('/');
                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count > 0)
                {
                    var docfiles = new List<string>();
                    string folderpathazure = "WorkSpace/" + firmid.ToString() + "/NoticeManagement/" + noticeid.ToString();
                    string fakepathin = "azuredirin/" + firmid + "/" + userid;
                    string fakepathout = "azuredirout/" + firmid + "/" + userid;
                    if (!(Directory.Exists(HttpContext.Current.Server.MapPath("~/" + fakepathin))))
                    {
                        Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/" + fakepathin));
                    }
                    if (!(Directory.Exists(HttpContext.Current.Server.MapPath("~/" + fakepathout))))
                    {
                        Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/" + fakepathout));
                    }
                    for (int i = 0; i < httpRequest.Files.Count; i++)
                    {
                        var postedFile = httpRequest.Files[i];
                        //encrypt file
                        string input = HttpContext.Current.Server.MapPath("~/" + fakepathin);
                        var fileextchk = Path.GetExtension(postedFile.FileName);
                        var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);
                        postedFile.SaveAs(input + "\\" + postedFile.FileName);
                        string strfilepath = input + "\\" + postedFile.FileName;
                        FileInfo fi = new FileInfo(strfilepath);
                        var DocSize = fi.Length;
                        int fileSize = postedFile.ContentLength;
                        var directory = Path.GetDirectoryName(strfilepath);
                        string strfileName = Path.GetFileName(strfilepath);
                        input = input + "\\" + postedFile.FileName;
                        string output = HttpContext.Current.Server.MapPath("~/" + fakepathout + "/" + postedFile.FileName);
                        QueryAES.FileEncrypt(input, output);
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
                        while (AzureDocument.fileexist(folderpathazure, origininalfilename, firmid.ToString(), userid.ToString()))
                        {
                            it += 1;
                            origininalfilename = string.Format("{0}({1}).{2}", orfileNameOnly, it, extension);
                        }
                        try
                        {
                            var status = AzureDocument.filecreateafteredit(output, folderpathazure, origininalfilename, null, null);
                        }
                        catch (Exception er)
                        {
                            AzureDocument.CreateNestedDirectory(folderpathazure);
                            var status = AzureDocument.filecreateafteredit(output, folderpathazure, origininalfilename, null, null);
                        }
                        try
                        {
                            File.Delete(output);
                        }
                        catch (Exception ex)
                        {
                            // throw ex;
                        }
                        ObjectParameter IDParameter1;
                        IDParameter1 = new ObjectParameter("id", id);
                        var data1 = db.usp_SaveFilefolderCloudNewForNotice(firmid.ToString(), userid.ToString(), origininalfilename, folderpathazure, 1, newfolderid.ToString(), null, extension, null, IDParameter1, null, null, 0, null, DocSize, "1", "");
                        id = Convert.ToString(IDParameter1.Value);
                        //map data into notice table
                        var resultdata = db.usp_SaveNoticeDocMap(firmid.ToString(), userid.ToString(), noticeid.ToString(), id, ModuleName, null, receiveReplyID);
                    }
                }
            }
            return "";
        }
        /// <summary>
        /// Upload IPR document
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="noticeid"></param>
        /// <param name="ModuleName"></param>
        /// <param name="noticetitle"></param>
        /// <param name="receiveReplyID"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        public static string CommonDocUploadIPR(string firmid, string userid, string noticeid, string ModuleName, string noticetitle, string receiveReplyID, string name)
        {
            var db = new LawPracticeEntities();
            var newfolderid = "";
            var dpaths = "";
            var newfolderid1 = "";
            int maxFileSize = Convert.ToInt32(WebConfigurationManager.AppSettings["docelasticmaxFileSize"]);
            var id = "";
            var id1 = "";
            var directoryid = "00000000-0000-0000-0000-000000000000";
            if (!String.IsNullOrEmpty(ModuleName)) //for new notice
            {
                //check notice parent exist or not
                try
                {
                    var chkparent = db.usp_GetNoticeParentFolder(firmid, userid, noticetitle, null, null).FirstOrDefault();
                    if (chkparent == null)
                    {
                        return "false";
                    }
                    dpaths = chkparent.AzureFileId + "/" + noticeid;
                    AzureDocument.CreateNestedDirectory(dpaths);
                    var createdirectorydata = AzureDocument.createfolder(dpaths, null, firmid.ToString(), userid.ToString());
                    ObjectParameter IDParameter;
                    IDParameter = new ObjectParameter("id", id);
                    var data = db.usp_SaveFilefolderCloudNew_IPR(firmid, userid, noticetitle.TrimStart().TrimEnd(), dpaths, 0, chkparent.Id.ToString(), null, null, null, IDParameter, null, null, 0, "1", null, null, "1");
                    newfolderid = Convert.ToString(IDParameter.Value);
                }
                catch (Exception ex)
                {
                }
                var resultdata = db.usp_SaveNoticeDocMap(firmid.ToString(), userid.ToString(), noticeid.ToString(), newfolderid, null, 1, null);
            }
            else
            {
                var getfolderid = db.usp_GetNoticeFolderDetailsByNoticeId(firmid, userid, noticeid).FirstOrDefault();
                if (getfolderid != null)
                {
                    newfolderid = getfolderid.id.ToString();
                }
            }
            if (!String.IsNullOrEmpty(newfolderid))
            {
                var dpath = dpaths.TrimEnd('/');
                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count > 0)
                {
                    var docfiles = new List<string>();
                    string folderpathazure = "WorkSpace/" + firmid.ToString() + "/IPRManagement/" + noticeid.ToString();
                    string fakepathin = "azuredirin/" + firmid + "/" + userid;
                    string fakepathout = "azuredirout/" + firmid + "/" + userid;
                    if (!(Directory.Exists(HttpContext.Current.Server.MapPath("~/" + fakepathin))))
                    {
                        Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/" + fakepathin));
                    }
                    if (!(Directory.Exists(HttpContext.Current.Server.MapPath("~/" + fakepathout))))
                    {
                        Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/" + fakepathout));
                    }
                    for (int i = 0; i < httpRequest.Files.Count; i++)
                    {
                        var postedFile = httpRequest.Files[i];
                        //encrypt file
                        string input = HttpContext.Current.Server.MapPath("~/" + fakepathin);
                        var fileextchk = Path.GetExtension(postedFile.FileName);
                        var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);
                        postedFile.SaveAs(input + "\\" + postedFile.FileName);
                        string strfilepath = input + "\\" + postedFile.FileName;
                        FileInfo fi = new FileInfo(strfilepath);
                        var DocSize = fi.Length;
                        int fileSize = postedFile.ContentLength;
                        var directory = Path.GetDirectoryName(strfilepath);
                        string strfileName = Path.GetFileName(strfilepath);
                        input = input + "\\" + postedFile.FileName;
                        string output = HttpContext.Current.Server.MapPath("~/" + fakepathout + "/" + postedFile.FileName);
                        QueryAES.FileEncrypt(input, output);
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
                        while (AzureDocument.fileexist(folderpathazure, origininalfilename, firmid.ToString(), userid.ToString()))
                        {
                            it += 1;
                            origininalfilename = string.Format("{0}({1}).{2}", orfileNameOnly, it, extension);
                        }
                        try
                        {
                            var status = AzureDocument.filecreateafteredit(output, folderpathazure, origininalfilename, null, null);
                        }
                        catch (Exception er)
                        {
                            AzureDocument.CreateNestedDirectory(folderpathazure);
                            var status = AzureDocument.filecreateafteredit(output, folderpathazure, origininalfilename, null, null);
                        }
                        try
                        {
                            File.Delete(output);
                        }
                        catch (Exception ex)
                        {
                            // throw ex;
                        }
                        ObjectParameter IDParameter1;
                        IDParameter1 = new ObjectParameter("id", id);
                        var data1 = db.usp_SaveFilefolderCloudNew_IPR(firmid.ToString(), userid.ToString(), origininalfilename, folderpathazure, 1, newfolderid.ToString(), null, extension, null, IDParameter1, null, null, 0, null, DocSize, null, null);
                        id = Convert.ToString(IDParameter1.Value);
                        //map data into notice table
                        var resultdata = db.usp_SaveNoticeDocMap(firmid.ToString(), userid.ToString(), noticeid.ToString(), id, ModuleName, null, receiveReplyID);
                    }
                    // return "true";
                }
            }
            return "";
        }
        /// <summary>
        /// Upload IPR draft document
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="noticeid"></param>
        /// <param name="ModuleName"></param>
        /// <returns></returns>
        public static string DocUploadIPRDraft(string firmid, string userid, string noticeid, string ModuleName)
        {
            //upload on azure draft
            using (var db = new LawPracticeEntities())
            {
                string folderpathazure1 = "WorkSpace/" + firmid + "/IPRManagement/" + noticeid.ToString();
                folderpathazure1 = folderpathazure1.TrimEnd('/').TrimStart('/');
                string fakepathout = "azuredirout/" + firmid.ToString() + "/" + userid.ToString();
                if (!(Directory.Exists(HttpContext.Current.Server.MapPath("~/" + fakepathout))))
                {
                    Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/" + fakepathout));
                }
                AzureDocumentself.CreateNestedDirectory(folderpathazure1);
                var noticeDraftFileName = db.sp_getNoticeDraftByNoticeId(noticeid).FirstOrDefault();
                var filename = noticeDraftFileName.Filename + ".pdf";
                string outputs = HttpContext.Current.Server.MapPath("~/" + fakepathout + "/" + filename);
                var status = AzureDocumentself.filecreateafteredit(outputs, folderpathazure1, filename, null, null);
                var id = "";
                ObjectParameter IDParameter1;
                IDParameter1 = new ObjectParameter("id", id);
                FileInfo fi = new FileInfo(outputs);
                var DocSize = fi.Length;
                var newfolderid = "";
                var getfolderid = db.usp_GetNoticeFolderDetailsByNoticeId(firmid.ToString(), userid.ToString(), noticeid).FirstOrDefault();
                if (getfolderid != null)
                {
                    newfolderid = getfolderid.id.ToString();
                }
                var data1 = db.usp_SaveFilefolderCloudNew_IPR(firmid.ToString(), userid.ToString(), filename, folderpathazure1, 1, newfolderid.ToString(), null, "pdf", null, IDParameter1, null, null, 0, null, DocSize, null, null);
                id = Convert.ToString(IDParameter1.Value);
                //map data into notice table
                var resultdata = db.usp_SaveNoticeDocMap(firmid.ToString(), userid.ToString(), noticeid.ToString(), id, "CreateIPR", null, null);
            }
            return "";
        }
        /// <summary>
        /// Upload Bulk notice document
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="noticeid"></param>
        /// <param name="ModuleName"></param>
        /// <param name="noticetitle"></param>
        /// <param name="receiveReplyID"></param>
        /// <param name="sendernameId"></param>
        /// <param name="NoticeSentOrReceived"></param>
        /// <param name="renameFolderName"></param>
        /// <returns></returns>
        public static string DocUploadBulkNotice(string firmid, string userid, string noticeid, string ModuleName, string noticetitle, string receiveReplyID, string sendernameId, string NoticeSentOrReceived, string renameFolderName)
        {
            var db = new LawPracticeEntities();
            var newfolderid = "";
            var dname = "";
            var dpaths = "";
            int maxFileSize = Convert.ToInt32(WebConfigurationManager.AppSettings["docelasticmaxFileSize"]);
            var id = "";
            var directoryid = "00000000-0000-0000-0000-000000000000";
            if (!String.IsNullOrEmpty(noticetitle)) //for new notice
            {
                //check notice parent exist or not
                try
                {
                    var chkparent = db.usp_GetNoticeParentFolder(firmid, userid, noticetitle, null, null).FirstOrDefault();
                    if (chkparent == null)
                    {
                        return "false";
                    }
                    var CheckBulkFolder = db.usp_BulkFolderExistOrNot(ModuleName, firmid).FirstOrDefault();
                    if (CheckBulkFolder != null)
                    {
                        dpaths = chkparent.AzureFileId + "/" + noticeid;
                        newfolderid = CheckBulkFolder.ToString();
                    }
                    else
                    {
                        dpaths = chkparent.AzureFileId + "/" + noticeid;
                        AzureDocument.CreateNestedDirectory(dpaths);
                        var createdirectorydata1 = AzureDocument.createfolder(dpaths, null, firmid.ToString(), userid.ToString());
                        ObjectParameter IDParameter1;
                        IDParameter1 = new ObjectParameter("id", id);
                        //var data1 = db.usp_SaveFilefolderCloudNewForNotice(firmid, userid, "Bulk Notice", dpaths, 0, chkparent.Id.ToString(), null, null, null, IDParameter1, null, null, 0, "1", null, "1", "");
                        var data1 = db.usp_SaveFilefolderCloudNewForNotice(firmid, directoryid, "Bulk Notice", dpaths, 0, chkparent.Id.ToString(), null, null, null, IDParameter1, null, null, 0, "1", null, "1", "");
                        newfolderid = Convert.ToString(IDParameter1.Value);
                        var resultdata2 = db.usp_SaveNoticeDocMap(firmid.ToString(), userid.ToString(), noticeid.ToString(), newfolderid, null, null, null);
                    }
                    var TodayDate = System.DateTime.Today.ToString("dd/MM/yyyy");
                    var checkDateFolder = db.usp_DateFolderExistOrNot(firmid.ToString(), TodayDate, newfolderid).FirstOrDefault();
                    if (checkDateFolder != null)
                    {
                        dpaths = chkparent.AzureFileId + "/" + noticeid;
                        newfolderid = checkDateFolder.ToString();
                    }
                    else
                    {
                        dpaths = chkparent.AzureFileId + "/" + noticeid;
                        AzureDocument.CreateNestedDirectory(dpaths);
                        var createdirectorydata2 = AzureDocument.createfolder(dpaths, null, firmid.ToString(), userid.ToString());
                        ObjectParameter IDParameter2;
                        IDParameter2 = new ObjectParameter("id", id);
                        //var data2 = db.usp_SaveFilefolderCloudNewForNotice(firmid, userid, TodayDate, dpaths, 0, newfolderid.ToString(), null, null, null, IDParameter2, null, null, 0, "1", null, "1", "");
                        var data2 = db.usp_SaveFilefolderCloudNewForNotice(firmid, "00000000-0000-0000-0000-000000000000", TodayDate, dpaths, 0, newfolderid.ToString(), null, null, null, IDParameter2, null, null, 0, "1", null, "1", "");
                        newfolderid = Convert.ToString(IDParameter2.Value);
                        var resultdata3 = db.usp_SaveNoticeDocMap(firmid.ToString(), userid.ToString(), noticeid.ToString(), newfolderid, null, null, null);
                    }
                    var checkTitleExist = db.usp_CheckTitleExistOrNot(firmid.ToString(), noticetitle, newfolderid).FirstOrDefault();
                    if (checkTitleExist != null)
                    {
                        dpaths = chkparent.AzureFileId + "/" + noticeid;
                        newfolderid = checkTitleExist.ToString();
                    }
                    else
                    {
                        dname = noticetitle;
                        if (dname == null)
                        {
                            dname = "DefaultNotice";
                        }
                        dpaths = chkparent.AzureFileId + "/" + noticeid;
                        AzureDocument.CreateNestedDirectory(dpaths);
                        var createdirectorydata3 = AzureDocument.createfolder(dpaths, null, firmid.ToString(), userid.ToString());
                        ObjectParameter IDParameter3;
                        IDParameter3 = new ObjectParameter("id", id);
                        var data3 = db.usp_SaveFilefolderCloudNewForNotice(firmid, userid, dname.TrimStart().TrimEnd(), dpaths, 0, newfolderid.ToString(), null, null, null, IDParameter3, null, null, 0, "1", null, "1", "");
                        newfolderid = Convert.ToString(IDParameter3.Value);
                        //map data into notice table
                        var resultdata = db.usp_SaveNoticeDocMap(firmid.ToString(), userid.ToString(), noticeid.ToString(), newfolderid, null, 1, null);
                    }
                }
                catch (Exception e)
                {
                    throw e;
                }
            }
            if (!String.IsNullOrEmpty(newfolderid))
            {
                var dpath = dpaths.TrimEnd('/');
                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count > 0)
                {
                    var docfiles = new List<string>();
                    string folderpathazure = "WorkSpace/" + firmid.ToString() + "/NoticeManagement/" + userid.ToString();
                    string fakepathin = "azuredirin/" + firmid + "/" + userid;
                    string fakepathout = "azuredirout/" + firmid + "/" + userid;
                    if (!(Directory.Exists(HttpContext.Current.Server.MapPath("~/" + fakepathin))))
                    {
                        Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/" + fakepathin));
                    }
                    if (!(Directory.Exists(HttpContext.Current.Server.MapPath("~/" + fakepathout))))
                    {
                        Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/" + fakepathout));
                    }
                    for (int i = 0; i < httpRequest.Files.Count; i++)
                    {
                        var postedFile = httpRequest.Files[i];
                        //encrypt file
                        string input = HttpContext.Current.Server.MapPath("~/" + fakepathin);
                        var fileextchk = Path.GetExtension(postedFile.FileName);
                        var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);
                        postedFile.SaveAs(input + "\\" + postedFile.FileName);
                        string strfilepath = input + "\\" + postedFile.FileName;
                        FileInfo fi = new FileInfo(strfilepath);
                        var DocSize = fi.Length;
                        int fileSize = postedFile.ContentLength;
                        var directory = Path.GetDirectoryName(strfilepath);
                        string strfileName = Path.GetFileName(strfilepath);
                        input = input + "\\" + postedFile.FileName;
                        string output = HttpContext.Current.Server.MapPath("~/" + fakepathout + "/" + postedFile.FileName);
                        QueryAES.FileEncrypt(input, output);
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
                        while (AzureDocument.fileexist(folderpathazure, origininalfilename, firmid.ToString(), userid.ToString()))
                        {
                            it += 1;
                            origininalfilename = string.Format("{0}({1}).{2}", orfileNameOnly, it, extension);
                        }
                        try
                        {
                            var status = AzureDocument.filecreateafteredit(output, folderpathazure, origininalfilename, null, null);
                        }
                        catch (Exception er)
                        {
                            AzureDocument.CreateNestedDirectory(folderpathazure);
                            var status = AzureDocument.filecreateafteredit(output, folderpathazure, origininalfilename, null, null);
                        }
                        try
                        {
                            File.Delete(output);
                        }
                        catch (Exception ex)
                        {
                            // throw ex;
                        }
                        ObjectParameter IDParameter1;
                        IDParameter1 = new ObjectParameter("id", id);
                        var data1 = db.usp_SaveFilefolderCloudNewForNotice(firmid.ToString(), userid.ToString(), origininalfilename, folderpathazure, 1, newfolderid.ToString(), null, extension, null, IDParameter1, null, null, 0, null, DocSize, "1", "");
                        id = Convert.ToString(IDParameter1.Value);
                        //map data into notice table
                        var resultdata = db.usp_SaveNoticeDocMap(firmid.ToString(), userid.ToString(), noticeid.ToString(), id, ModuleName, null, receiveReplyID);
                    }
                }
            }
            return "";
        }


        /// <summary>
        /// Create Folder in IPR Management 
        /// </summary>
        public static string CreateIPRFolder(string userId, string firmId, string noticeid, string ModuleName, string noticetitle, string receiveReplyID, string name, string UserType, string Username, string updateflag)
        {
            var newfolderid = "";
            var dpaths = "";
            if (!String.IsNullOrEmpty(ModuleName)) //for new notice
            {
                try
                {
                    /// Create Root IPR Management Folder
                    var directoryid = "00000000-0000-0000-0000-000000000000";
                    var fname = "IPR Management";
                    var pid = "";
                    var dataresult = DataAccessIPRADO.CreateRootIPRFolder(userId, firmId, directoryid, fname);

                    if (dataresult == null)
                    {
                        return "false";
                    }

                    /// Create TradeMark, GI, Design... Folder
                    fname = noticetitle;
                    pid = dataresult.Rows[0]["Id"].ToString();
                    var CheckTMfolder = DataAccessIPRADO.usp_ClientFolderExistOrNot(firmId, "00000000-0000-0000-0000-000000000000", fname, pid);

                    if (CheckTMfolder.Rows.Count > 0)
                    {
                        dpaths = dataresult.Rows[0]["AzureFileId"].ToString() + "/" + noticeid;
                        newfolderid = CheckTMfolder.Rows[0]["Id"].ToString();
                    }
                    else
                    {
                        dpaths = dataresult.Rows[0]["AzureFileId"].ToString() + "/" + noticeid;
                        AzureDocument.CreateNestedDirectory(dpaths);
                        var createdirectorydata = AzureDocument.createfolder(dpaths, null, firmId, "00000000-0000-0000-0000-000000000000");
                        var datasavefolder = DataAccessIPRADO.usp_SaveFilefolderCloudNew_IPR(firmId, "00000000-0000-0000-0000-000000000000", fname.TrimStart().TrimEnd(), dpaths, 0, pid, "", "", "", "", "", null, 0, "1", 0, "", "1");
                        newfolderid = Convert.ToString(datasavefolder.Rows[0]["Id"].ToString());
                    }

                    /// Create Folder based on Admin or User
                    if (UserType == "1")
                    {
                        fname = name;
                    }
                    else
                    {
                        fname = name + " (" + Username + ")";
                    }

                    if (updateflag == "1")  /// Check for Details are Edit and Change Folder name in database
                    {
                        var getfolderid = DataAccessIPRADO.usp_GetIPRFolderDetailsByNoticeId(firmId, userId, noticeid);
                        var folderid = getfolderid.Rows[0]["DocumentId"].ToString();
                        if (folderid != null)
                        {
                            if (fname.Trim() != "")
                            {
                                var result = DataAccessIPRADO.usp_ModifyIPRTitleFolderName(firmId, folderid, fname);
                            }
                        }
                    }

                    var CheckTMAdminfolder = DataAccessIPRADO.usp_ClientFolderExistOrNot(firmId, userId, fname, newfolderid);

                    if (CheckTMAdminfolder.Rows.Count > 0)
                    {
                        dpaths = dataresult.Rows[0]["AzureFileId"].ToString() + "/" + noticeid;
                        newfolderid = CheckTMAdminfolder.Rows[0]["Id"].ToString();
                    }
                    else
                    {
                        dpaths = dataresult.Rows[0]["AzureFileId"].ToString() + "/" + noticeid;
                        AzureDocument.CreateNestedDirectory(dpaths);
                        var createdirectorydata = AzureDocument.createfolder(dpaths, null, firmId, userId);
                        var datasavefolder = DataAccessIPRADO.usp_SaveFilefolderCloudNew_IPR(firmId, userId, fname.TrimStart().TrimEnd(), dpaths, 0, newfolderid, "", "", "", "", "", null, 0, "1", 0, "", "1");
                        newfolderid = Convert.ToString(datasavefolder.Rows[0]["Id"].ToString());
                        var resultdata1 = DataAccessIPRADO.usp_SaveNoticeDocMap(firmId, userId, noticeid, newfolderid, null, null, null);
                    }
                }
                catch (Exception ex)
                {
                }
            }

            if (!String.IsNullOrEmpty(newfolderid))
            {
                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files["FilePosted[0]"] != null) /// Files Upload in TMApplication FIeld.
                {
                    CreateIPRFolderFile("TMApplication", "FilePosted", firmId, userId, noticeid, ModuleName, newfolderid, receiveReplyID, dpaths, UserType);
                }
                if (httpRequest.Files["FileUpload[0]"] != null) /// Files are Upload in UploadDoc
                {
                    CreateIPRFolderFile("UploadDoc", "FileUpload", firmId, userId, noticeid, ModuleName, newfolderid, receiveReplyID, dpaths, UserType);
                }
            }
            return "done";
        }

        /// <summary>
        /// Upload Files in TMApplication and UploadDoc in IPR Management 
        /// </summary>
        public static void CreateIPRFolderFile(string foldername, string filetype, string firmId, string userId, string noticeid, string ModuleName, string newfolderid, string receiveReplyID, string dpaths, string UserType)
        {
            var httpRequest = HttpContext.Current.Request;
            try
            {
                /// Create Folder TMApplication or UploadDoc
                var CheckTMfolder = DataAccessIPRADO.usp_ClientFolderExistOrNot(firmId, userId, foldername, newfolderid);

                if (CheckTMfolder.Rows.Count > 0)
                {
                    newfolderid = CheckTMfolder.Rows[0]["Id"].ToString();
                }
                else
                {
                    AzureDocument.CreateNestedDirectory(dpaths);
                    var createdirectorydata = AzureDocument.createfolder(dpaths, null, firmId, userId);
                    var datasavefolder = DataAccessIPRADO.usp_SaveFilefolderCloudNew_IPR(firmId, userId, foldername.TrimStart().TrimEnd(), dpaths, 0, newfolderid, "", "", "", "", "", null, 0, "1", 0, "", "1");
                    newfolderid = Convert.ToString(datasavefolder.Rows[0]["Id"].ToString());
                }

                /// File Upload in Folder 
                string folderpathazure = "WorkSpace/" + firmId + "/IPR Management/" + noticeid;
                string fakepathin = "azuredirin/" + firmId + "/IPR Managemen/" + userId;
                string fakepathout = "azuredirout/" + firmId + "/IPR Managemen/" + userId;

                if (!(Directory.Exists(HttpContext.Current.Server.MapPath("~/" + fakepathin))))
                {
                    Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/" + fakepathin));
                }
                if (!(Directory.Exists(HttpContext.Current.Server.MapPath("~/" + fakepathout))))
                {
                    Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/" + fakepathout));
                }

                int i = 0;
                while (httpRequest.Files[filetype + "[" + i + "]"] != null)
                {
                    var postedFile = httpRequest.Files[filetype + "[" + i + "]"];
                    string input = HttpContext.Current.Server.MapPath("~/" + fakepathin);
                    var fileextchk = Path.GetExtension(postedFile.FileName);
                    var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);
                    postedFile.SaveAs(input + "\\" + postedFile.FileName);
                    string strfilepath = input + "\\" + postedFile.FileName;
                    FileInfo fi = new FileInfo(strfilepath);
                    var DocSize = fi.Length;
                    int fileSize = postedFile.ContentLength;
                    var directory = Path.GetDirectoryName(strfilepath);
                    string strfileName = Path.GetFileName(strfilepath);
                    input = input + "\\" + postedFile.FileName;
                    string output = HttpContext.Current.Server.MapPath("~/" + fakepathout + "/" + postedFile.FileName);
                    QueryAES.FileEncrypt(input, output);

                    try
                    {
                        System.IO.File.Delete(input);
                    }
                    catch (Exception ex)
                    {
                    }

                    int it = 0;
                    var fileName = postedFile.FileName;
                    var origininalfilename = fileName;
                    var orfileNameOnly = fileName.Remove(fileName.LastIndexOf('.') + 1).TrimEnd('.');
                    var extension = fileName.Split('.').Last();
                    while (AzureDocument.fileexist(folderpathazure, origininalfilename, firmId, userId))
                    {
                        it += 1;
                        origininalfilename = string.Format("{0}({1}).{2}", orfileNameOnly, it, extension);
                    }
                    try
                    {
                        var status = AzureDocument.filecreateafteredit(output, folderpathazure, origininalfilename, firmId, userId);
                    }
                    catch (Exception er)
                    {
                        AzureDocument.CreateNestedDirectory(folderpathazure);
                        var status = AzureDocument.filecreateafteredit(output, folderpathazure, origininalfilename, firmId, userId);
                    }
                    try
                    {
                        File.Delete(output);
                    }
                    catch (Exception ex)
                    {
                    }

                    var datasavefolderCloud = DataAccessIPRADO.usp_SaveFilefolderCloudNew_IPR(firmId, userId, origininalfilename, folderpathazure, 1, newfolderid.ToString(), "", extension, "", "", "", null, 0, "", DocSize, "", "1");
                    var id = Convert.ToString(datasavefolderCloud.Rows[0]["Id"].ToString());

                    i++;
                }
            }
            catch (Exception ex)
            {
            }
        }
    }
}