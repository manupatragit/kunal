using DataAccess.Modals;
using LawPracticeFirm.Common;
using LawPracticeFirm.CustomFIlter;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System.Web.UI.WebControls;
namespace LawPracticeFirm.Controllers
{
    [AuthLog(Roles = "Firm,User,Client")]
    public class ChatController : BaseFirmController
    {
        private LawPracticeEntities db = new LawPracticeEntities();

        public ActionResult CreateChannel1()
        {
            return View();
        }
        /// <summary>
        /// Invite channel list
        /// </summary>
        /// <returns></returns>
        public ActionResult InvitedChannelList()
        {
            return View();
        }
        /// <summary>
        /// Show team user list
        /// </summary>
        /// <returns></returns>
        public ActionResult TeamList()
        {
            return View();
        }
        /// <summary>
        /// Get channel list
        /// </summary>
        /// <returns></returns>
        public ActionResult ChannelList()
        {
            return View();
        }
        /// <summary>
        /// Create new channel list
        /// </summary>
        /// <returns></returns>
        public ActionResult CreateChannel()
        {
            return View();
        }
        /// <summary>
        /// Get channel member
        /// </summary>
        /// <returns></returns>
        public ActionResult ChannelMember()
        {
            return View();
        }
        /// <summary>
        /// Get team chat details
        /// </summary>
        /// <returns></returns>
        public ActionResult TeamChat()
        {
            ViewBag.UseName = Session["fullusername"];
            var valid = "0";
            List<sp_ValidChatUser_Result> list = new List<sp_ValidChatUser_Result>();
            var channelid = QueryStringEDAES.QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(QueryAES.UrlDecode(Request.QueryString["tid"]).ToString().Replace(" ", "+")));
            var userid = LoggedInUser.UserId.ToString();
            LawPracticeEntities db = new LawPracticeEntities();
            var channelids = (String)channelid;
            list = db.sp_ValidChatUser(channelids, userid).ToList();
            if (list.Count > 0)
            {
                valid = "1";
            }
            else
            {
                valid = "0";
            }
            if (valid == "0")
            {
                return RedirectToAction("UnauthoriseChat", "home");
            }
            else
            {
                return View();
            }
        }
        /// <summary>
        /// Get invite chat by client firm user
        /// </summary>
        /// <returns></returns>
        public ActionResult FirmUserClientInviteChat()
        {
            ViewBag.UseName = Session["fullusername"];
            return View();
        }
        /// <summary>
        /// Join chat by firm user
        /// </summary>
        /// <returns></returns>
        public ActionResult FirmUserClientJoinChat()
        {
            ViewBag.UseName = Session["fullusername"];
            return View();
        }
        /// <summary>
        /// Join private chat by firm user
        /// </summary>
        /// <returns></returns>
        public ActionResult JoinPrivateChat()
        {
            ViewBag.UseName = Session["fullusername"];
            return View();
        }
        /// <summary>
        /// Create private channel
        /// </summary>
        /// <returns></returns>
        public ActionResult CreatePrivateChannel()
        {
            ViewBag.UseName = Session["fullusername"];
            return View();
        }
        /// <summary>
        /// Get private channel list
        /// </summary>
        /// <returns></returns>
        public ActionResult PrivateChannelList()
        {
            return View();
        }
        /// <summary>
        /// Get private channel list details
        /// </summary>
        /// <returns></returns>
        public ActionResult PrivateChannelMember()
        {
            return View();
        }
        /// <summary>
        /// Get QT channel list
        /// </summary>
        /// <returns></returns>
        public ActionResult ChannelListQT()
        {
            ViewBag.UseName = Session["fullusername"];
            return View();
        }
        /// <summary>
        /// Get channel QT details
        /// </summary>
        /// <returns></returns>
        public ActionResult ChannelListQTDetail()
        {
            ViewBag.UseName = Session["fullusername"];
            return View();
        }
        /// <summary>
        /// Private channel QT detail list
        /// </summary>
        /// <returns></returns>
        public ActionResult PrivateChannelListQTDetail()
        {
            ViewBag.UseName = Session["fullusername"];
            return View();
        }
        /// <summary>
        /// Get private chat details
        /// </summary>
        /// <returns></returns>
        public ActionResult PrivateChat()
        {
            ViewBag.UseName = Session["fullusername"];
            var valid = "0";
            List<sp_ValidChatUser_Result> list = new List<sp_ValidChatUser_Result>();
            var channelid = QueryStringEDAES.QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(QueryAES.UrlDecode(Request.QueryString["tid"]).ToString().Replace(" ", "+")));
            var userid = LoggedInUser.UserId.ToString();
            LawPracticeEntities db = new LawPracticeEntities();
            var channelids = (String)channelid;
            list = db.sp_ValidChatUser(channelids, userid).ToList();
            if (list.Count > 0)
            {
                valid = "1";
            }
            else
            {
                valid = "0";
            }
            if (valid == "0")
            {
                return RedirectToAction("UnauthoriseChat", "home");
            }
            else
            {
                return View();
            }
        }
        /// <summary>
        /// Invite all chat
        /// </summary>
        /// <returns></returns>
        public ActionResult InvitedChat()
        {
            ViewBag.UseName = Session["fullusername"];
            return View();
        }
        /// <summary>
        /// Invited chat QT
        /// </summary>
        /// <returns></returns>
        public ActionResult InvitedChatQT()
        {
            ViewBag.UseName = Session["fullusername"];
            return View();
        }
        /// <summary>
        /// Get private team list
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public JsonResult PrivateTeamList()
        {
            string name = QueryAES.UrlDecode(Request.Form["name"]);
            var pagenum = QueryAES.UrlDecode(Request.Form["pagenum"]);
            var pagesize = QueryAES.UrlDecode(Request.Form["pagesize"]);
            dynamic list = null;
            //  ViewBag.filesize = ConfigurationManager.AppSettings["filesizemultiple"];
            try
            {
                var trialList_1 = db.usp_PrivateChatUserList(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Convert.ToInt32(LoggedInUser.RoleId), name, Convert.ToInt32(pagenum), Convert.ToInt32(pagesize)).ToList();
                //var trialList = (from ob in trialList_1
                //                 select new
                //                 {
                //                     label = ob.UserName + " -(" + ob.RoleName + ")",
                //                     val = ob.Userid,
                //                     //roleid = ob.roleid,
                //                     role = ob.RoleName,
                //                     Partnerid = ob.PartnerId,
                //                     ChatJoinCount = ob.ChatJoinCount,
                //                     Firmid=ob.Firmid
                //                 }).Where(x => x.label.Contains(name)).OrderBy(x => x.label).ToList();
                foreach (var data in trialList_1.ToList())
                {
                    trialList_1[trialList_1.IndexOf(data)].ChannelGuid = Convert.ToBase64String(QueryStringEDAES.QueryAES.EncryptAes(data.ChannelGuid.ToString()));
                }
                list = trialList_1;
            }
            catch (Exception ex)
            {
                //  db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            return Json(new { Result = list }, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Get user login details
        /// </summary>
        /// <returns></returns>
        public ActionResult UserLogin()
        {
            ViewBag.UseName = Session["fullusername"];
            var valid = "0";
            List<sp_ValidChatUser_Result> list = new List<sp_ValidChatUser_Result>();
            var channelid = QueryStringEDAES.QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(QueryAES.UrlDecode(Request.QueryString["tid"]).ToString().Replace(" ", "+")));
            var userid = LoggedInUser.UserId.ToString();
            LawPracticeEntities db = new LawPracticeEntities();
            var channelids = (String)channelid;
            list = db.sp_ValidChatUser(channelids, userid).ToList();
            if (list.Count > 0)
            {
                valid = "1";
            }
            else
            {
                valid = "0";
            }
            if (valid == "0")
            {
                return RedirectToAction("UnauthoriseChat", "home");
            }
            else
            {
                return View();
            }
        }
        /// <summary>
        /// Save chat details in list
        /// </summary>
        /// <returns></returns>
        public ActionResult ChatSaveList()
        {
            ViewBag.UseName = Session["fullusername"];
            return View();
        }
        /// <summary>
        /// Get chat active user name
        /// </summary>
        /// <returns></returns>
        public ActionResult ChatMenu()
        {
            ViewBag.UseName = Session["fullusername"];
            return View();
        }
        /// <summary>
        /// Get chat user list
        /// </summary>
        /// <returns></returns>
        public ActionResult ChatView()
        {
            ViewBag.UseName = Session["fullusername"];
            return View();
        }
        /// <summary>
        /// Get valid chat user list
        /// </summary>
        /// <returns></returns>
        public ActionResult ValidChatUser()
        {
            var valid = "0";
            List<sp_ValidChatUser_Result> list = new List<sp_ValidChatUser_Result>();
            var channelid = QueryStringEDAES.QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(QueryAES.UrlDecode(Request.Form["channelid"]).ToString().Replace(" ", "+")));
            var userid = LoggedInUser.UserId.ToString();
            LawPracticeEntities db = new LawPracticeEntities();
            var channelids = (String)channelid;
            list = db.sp_ValidChatUser(channelids, userid).ToList();
            if (list.Count > 0)
            {
                valid = "1";
            }
            else
            {
                valid = "0";
            }
            if (valid == "0")
            {
                return RedirectToAction("UnauthoriseChat", "home");
            }
            else
            {
                return View("PrivateChat");
            }
        }
    }
}