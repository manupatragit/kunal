using LawPracticeFirm.Common;
using LawPracticeFirm.CustomFIlter;
using LawPracticeFirm.Models;
using QueryStringEDAES;
using System;
using System.Web.Mvc;

namespace NoticeManagement.Controllers
{
    public class NoticeReceivedController : BaseFirmController
    {
        /// <summary>
        /// Get received notice lisr=t details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult ReceivedNoticeList()
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
            var NoitceId = QueryAES.UrlDecode(Request.Form["NoitceId"]);
            ViewBag.NoticeId = NoitceId;
            return View();
        }
        /// <summary>
        /// Convert to case received
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult ConvertToCaseReceived()
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
            var NoitceId = QueryAES.UrlDecode(Request.Form["NoitceId"]);
            ViewBag.NoticeId = NoitceId;
            return View();
        }
        /// <summary>
        /// Settled notice received
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult SettledReceived()
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
            var NoitceId = QueryAES.UrlDecode(Request.Form["NoitceId"]);
            ViewBag.NoticeId = NoitceId;
            return View();
        }
        /// <summary>
        /// Add received notice view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult AddReceivedNotice()
        {
            return View();
        }
        /// <summary>
        /// Delete received notice view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult ReceivedNoticeDeleteList()
        {
            return View();
        }
        /// <summary>
        /// Archive received notice list
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult ArchiveReceivedNoticeList()
        {
            return View();
        }
        /// <summary>
        /// Get client notice list
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult ClientNoticeList()
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
            var ClientId = QueryAES.UrlDecode(Request.Form["ClientId"]);
            ViewBag.ClientId = ClientId;
            return View();
        }
        /// <summary>
        /// Received draft notice list
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult ReceivedDraftNotice()
        {
            var NoitceId = QueryAES.UrlDecode(Request.Form["NoitceId"]);
            ViewBag.NoticeId = NoitceId;
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
    }
}