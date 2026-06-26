using BussinessLogic.BusinessRepository;
using LawPracticeFirm.Common;
using LawPracticeFirm.CustomFIlter;
using LawPracticeFirm.Models;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Web.Mvc;

namespace NoticeManagement.Controllers
{
    public class RejoinderNoticeController : BaseFirmController
    {
        DBHandle handle = new DBHandle();
        /// <summary>
        /// Rejoinder Notice view
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            return View();
        }
        /// <summary>
        /// Get received rejoinder list
        /// </summary>
        /// <param name="SearchValue"></param>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult RejoinderReceived(string SearchValue)
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
        /// Rejoinder HOme
        /// </summary>
        /// <param name="SearchValue"></param>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult RejoinderHome(string SearchValue)
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
        /// Add rejoinder notice
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult AddRejoinderNotice()
        {
            string parentId = QueryAES.UrlDecode(Request.QueryString["Id"]);
            string mainnoticeid = QueryAES.UrlDecode(Request.QueryString["Main"]);
            string InitiatedBy = QueryAES.UrlDecode(Request.QueryString["InitiatedBy"]);
            ViewBag.parentId = parentId;
            ViewBag.mainnoticeid = mainnoticeid;
            ViewBag.InitiatedBy = InitiatedBy;
            return View();
        }
        /// <summary>
        /// Get draft rejoinder notice
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult DraftRejoinderNotice()
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
        /// Edit rejoinder notice
        /// </summary>
        /// <param name="RejoinderNoticeID"></param>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult EditRejoinderNotice(string RejoinderNoticeID)
        {
            dynamic list = handle.GetRejoinderNoticeDetailByID(RejoinderNoticeID, LoggedInUser.FirmId.ToString());
            FileUpload model = new FileUpload();
            List<FileUpload> lists = new List<FileUpload>();
            DataTable dtFiles = handle.GetFileDetails(RejoinderNoticeID);
            foreach (DataRow dr in dtFiles.Rows)
            {
                lists.Add(new FileUpload
                {
                    FileName = @dr["FileName"].ToString(),
                });
            }
            for (int i = 0; i < lists.Count; i++)
            {
                lists[i].FileUrl = Url.Content(Path.Combine("~/Content/UploadedFile/", RejoinderNoticeID, lists[i].FileName));
            }
            ViewData["Files"] = lists;
            ViewBag.MyList = lists;
            return View("EditRejoinderNotice", list);
        }
        /// <summary>
        /// Delete rejoinder notice
        /// </summary>
        /// <param name="RejoinderNoticeID"></param>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        [HttpPost]
        public JsonResult Delete(string RejoinderNoticeID)
        {
            bool val = handle.DeleteReplyToNotice(RejoinderNoticeID);
            return Json(val);
        }
        /// <summary>
        /// Download file
        /// </summary>
        /// <param name="filePath"></param>
        /// <returns></returns>
        public ActionResult DownloadFile(string filePath)
        {
            string fullName = Server.MapPath("~" + filePath);
            byte[] fileBytes = GetFile(fullName);
            return File(
                fileBytes, System.Net.Mime.MediaTypeNames.Application.Octet, filePath);
        }
        /// <summary>
        /// Get file
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