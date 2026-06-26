using BussinessLogic.BusinessRepository;
using LawPracticeFirm.BusinessEntity;
using LawPracticeFirm.Common;
using LawPracticeFirm.CustomFIlter;
using LawPracticeFirm.Models;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.IO;
using System.Web;
using System.Web.Mvc;

namespace NoticeManagement.Controllers
{
    public class ReplyToNoticeController : BaseFirmController
    {
        DBHandle handle = new DBHandle();
        /// <summary>
        /// Reply to notice list
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult Index()
        {
            return View();
        }
        /// <summary>
        /// Reply to notice
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult ReplyToNoticeHome()
        {
            return View();
        }
        /// <summary>
        /// Reply draft notice list
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult ReplyToNoticeDraft()
        {
            if (LoggedInUser.RoleId == 2)
            {
                ViewBag.IsCreate = 0;
                ViewBag.IsEdit = 0;
                ViewBag.IsDelete = 0;
                ViewBag.export = 0;
                ViewBag.share = 0;
                ViewBag.enable = 0;
                var data = CheckRoles.FindModuleRights(Request.Url.Segments[3], LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Convert.ToInt32(LoggedInUser.RoleId));
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
        /// Get reply notice details
        /// </summary>
        /// <param name="SearchValue"></param>
        /// <param name="ColumName"></param>
        /// <param name="SortedOrder"></param>
        /// <param name="PageNumber"></param>
        /// <param name="PageSize"></param>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        [HttpPost]
        public JsonResult ReplyToNoticeHome(string SearchValue, string ColumName, string SortedOrder, int PageNumber, int PageSize)
        {
            ModelState.Clear();
            dynamic noticeList = handle.GetReplyToNoticeDetails(LoggedInUser.UserId.ToString(), SearchValue, ColumName, SortedOrder, PageNumber, PageSize,LoggedInUser.FirmId.ToString());
            ViewBag.noticeDetails = noticeList;
            return Json(noticeList);
        }
        /// <summary>
        /// Add reply notice details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult AddReplyToNotice()
        {
            string parentId = QueryAES.UrlDecode(Request.QueryString["Id"]);
            ViewBag.parentId = parentId;
            return View();
        }
        /// <summary>
        /// Get reply notice by notice id
        /// </summary>
        /// <param name="NoticeID"></param>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult EditReplyToNotice(string NoticeID)
        {
            dynamic list = handle.GetReplyToNoticeDetailByID(NoticeID,LoggedInUser.FirmId.ToString());
            FileUpload model = new FileUpload();
            List<FileUpload> lists = new List<FileUpload>();
            DataTable dtFiles = handle.GetFileDetails(NoticeID);
            foreach (DataRow dr in dtFiles.Rows)
            {
                lists.Add(new FileUpload
                {
                    FileName = @dr["FileName"].ToString(),
                });
            }
            for (int i = 0; i < lists.Count; i++)
            {
                lists[i].FileUrl = Url.Content(Path.Combine("~/Content/UploadedFile/", NoticeID, lists[i].FileName));
            }
            ViewData["Files"] = lists;
            ViewBag.MyList = lists;
            return View("EditReplyToNotice", list);
        }
        /// <summary>
        /// Edit reply notice
        /// </summary>
        /// <param name="replyToNotice"></param>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        [HttpPost]
        public ActionResult EditReplyToNotice(ReplyToNoticeModal replyToNotice)
        {
            try
            {
                var reptonotice = new ReplyToNotice();
                reptonotice.CreateReply = replyToNotice.CreateReply;
                reptonotice.AssignmentofTask = replyToNotice.AssignmentofTask;
                reptonotice.AddresseeAddress = replyToNotice.AddresseeAddress;
                reptonotice.CaseStatus = replyToNotice.CaseStatus;
                reptonotice.ClientName = replyToNotice.ClientName;
                reptonotice.CurrentStatus = replyToNotice.CurrentStatus;
                reptonotice.DateofDelivery = replyToNotice.DateofDelivery;
                reptonotice.DateofReceipt = replyToNotice.DateofReceipt;
                reptonotice.DateofRejoinder = replyToNotice.DateofRejoinder;
                reptonotice.DateofReply = replyToNotice.DateofReply;
                reptonotice.GenerationofAlerts = replyToNotice.GenerationofAlerts;
                reptonotice.isClient = replyToNotice.isClient;
                reptonotice.IsFileAvailable = replyToNotice.IsFileAvailable;
                reptonotice.ManagerName = replyToNotice.ManagerName;
                reptonotice.ModeofServiceorDelivery = replyToNotice.ModeofServiceorDelivery;
                reptonotice.NoticeBroughtbyClientforReply = replyToNotice.NoticeBroughtbyClientforReply;
                reptonotice.NoticeID = replyToNotice.NoticeID;
                reptonotice.NoticeReceivedbyClient = replyToNotice.NoticeReceivedbyClient;
                reptonotice.NoticeReference = replyToNotice.NoticeReference;
                reptonotice.NoticeTitle = replyToNotice.NoticeTitle;
                reptonotice.NoticeType = replyToNotice.NoticeType;
                reptonotice.OtherDetailsofAddressee = replyToNotice.OtherDetailsofAddressee;
                reptonotice.OtherDetailsofRespondent = replyToNotice.OtherDetailsofRespondent;
                reptonotice.ReplyAddressedto = replyToNotice.ReplyAddressedto;
                reptonotice.ReplySubject = replyToNotice.ReplySubject;
                reptonotice.ReplyThrough = replyToNotice.ReplyThrough;
                reptonotice.ReplytoNoticeCreatedOn = replyToNotice.ReplytoNoticeCreatedOn;
                reptonotice.RespondentsAddress = replyToNotice.RespondentsAddress;
                reptonotice.RespondentsName = replyToNotice.RespondentsName;
                reptonotice.StatutoryProvision = replyToNotice.StatutoryProvision;
                reptonotice.TotalRows = replyToNotice.TotalRows;
                reptonotice.UserId = LoggedInUser.UserId.ToString();
                reptonotice.FirmId = LoggedInUser.FirmId.ToString();
                string NoticeId = handle.AddReplyToNotice(reptonotice, 0, "").ToString();
                if (NoticeId != null)
                {
                    foreach (HttpPostedFileBase file in replyToNotice.Files)
                    {
                        string ProfilePath = System.IO.Path.Combine(ConfigurationManager.AppSettings["FilePath"], NoticeId);
                        //Checking file is available to save.  
                        if (file != null)
                        {
                            if (!System.IO.Directory.Exists(Server.MapPath(ProfilePath)))
                            {
                                System.IO.Directory.CreateDirectory(Server.MapPath(ProfilePath));
                            }
                            var InputFileName = Path.GetFileName(file.FileName);
                            string filename = Guid.NewGuid().ToString() + System.IO.Path.GetExtension(file.FileName);
                            string SaveFilePath = System.IO.Path.Combine(ProfilePath, filename);
                            //Save file to server folder  
                            file.SaveAs(Server.MapPath(SaveFilePath));
                            var result = handle.AddFile(NoticeId, filename);
                        }
                    }
                    ViewBag.Message = "Notice details Updated successfully";
                }
                return RedirectToAction("ReplyToNoticeHome");
            }
            catch
            {
                return RedirectToAction("ReplyToNoticeHome");
            }
        }
        /// <summary>
        /// Delete reply notice by notice id
        /// </summary>
        /// <param name="ReplyNoticeID"></param>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        [HttpPost]
        public JsonResult Delete(string ReplyNoticeID)
        {
            bool val = handle.DeleteReplyToNotice(ReplyNoticeID);
            return Json(val);
        }
        /// <summary>
        /// Download reply file
        /// </summary>
        /// <param name="filePath"></param>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult DownloadFile(string filePath)
        {
            string fullName = Server.MapPath("~" + filePath);
            byte[] fileBytes = GetFile(fullName);
            return File(
                fileBytes, System.Net.Mime.MediaTypeNames.Application.Octet, filePath);
        }
        /// <summary>
        /// Get file details
        /// </summary>
        /// <param name="s"></param>
        /// <returns></returns>
        byte[] GetFile(string s)
        {
            System.IO.FileStream fs = System.IO.File.OpenRead(s);
            byte[] data = new byte[fs.Length];
            int br = fs.Read(data, 0, data.Length);
            if (br != fs.Length)
                throw new System.IO.IOException(s);
            return data;
        }
    }
}