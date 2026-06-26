using DataAccess.Modals;
using LawPracticeFirm.Common;
using QueryStringEDAES;
using System;
using System.IO;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using static LawPracticeFirm.Models.AuditData;

namespace LawPracticeFirm.Controllers
{
    public class AccountController : BaseFirmController
    {
        private LawPracticeEntities db1 = new LawPracticeEntities();
        public string controllername = "AccountController";
        /// <summary>
        /// User Login view
        /// </summary>
        /// <param name="RedirectUrl"></param>
        /// <returns></returns>
        public ActionResult Login(string RedirectUrl)
        {
            return Redirect("/");
        }
        /// <summary>
        /// Registration view
        /// </summary>
        /// <returns></returns>
        public ActionResult Register()
        {
            return View();
        }
        /// <summary>
        /// Forgot password
        /// </summary>
        /// <returns></returns>
        public ActionResult ForgotPassword()
        {
            return View();
        }
        /// <summary>
        /// User profile view
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization()]
        public ActionResult UserProfile()
        {
            return View();
        }
        /// <summary>
        /// Change password view
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization()]
        public ActionResult ChangePassword()
        {
            return View();
        }
        /// <summary>
        /// LogOff
        /// </summary>
        [FirmControllerAuthorization()]
        public void LogOff()
        {
            var db = new LawPracticeEntities();
            try
            {
                var ctd1 = db.usp_removeloginlog(LoggedInUser.FirmId.ToString(), LoggedInUser.UserName.ToString());
            }
            catch (Exception d)
            {
            }
        }
        /// <summary>
        /// Logon
        /// </summary>
        [FirmControllerAuthorization()]
        public void LogOn()
        {
            var db = new LawPracticeEntities();
            try
            {
                db.usp_saveloginlog(LoggedInUser.FirmId.ToString(), LoggedInUser.UserName.ToString());
            }
            catch (Exception er)
            {
            }
            try
            {
                db.Usp_SaveUserActiveStatus(LoggedInUser.FirmId.ToString(), LoggedInUser.UserName.ToString(), Session["GetSessionID"].ToString());
            }
            catch (Exception er)
            {
            }
        }
        /// <summary>
        /// Logout
        /// </summary>
        /// <returns></returns>
        [FirmControllerAuthorization()]
        public ActionResult LogOut()
        {
            var curuser = Convert.ToBase64String(QueryAES.EncryptAes(LoggedInUser.UserId.ToString()));
            var curfirm = Convert.ToBase64String(QueryAES.EncryptAes(LoggedInUser.FirmId.ToString()));
            ViewBag.CurUserName = curuser;
            ViewBag.CurFirm = curfirm;
            var fcodes = LoggedInUser.FirmCode;
            ViewBag.fcodes = fcodes;
            try
            {
                Session["sessiontoken"] = string.Empty;
            }
            catch (Exception er)
            {
            }
            try
            {
                var db = new LawPracticeEntities();
                try
                {
                    var ctd = db.saveuseractivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.UserId.ToString(), 1, DateTime.Now.ToString(), "Logout", Guid.Empty.ToString(), null, null, DateTime.Now.ToString());
                }
                catch (Exception er)
                {
                }
                try
                {
                    var ctd1 = db.usp_removeloginlog(LoggedInUser.FirmId.ToString(), LoggedInUser.UserName.ToString());
                }
                catch (Exception er)
                {
                }
                try
                {
                    var client = new WebClient();
                    var content = client.DownloadString("https://mail.google.com/mail/u/0/?logout&hl=en");
                }
                catch (Exception er)
                {
                }
                try
                {
                    var client = new WebClient();
                    var enuser = Convert.ToBase64String(QueryAES.EncryptAes(LoggedInUser.UserId.ToString()));
                    var enfirm = Convert.ToBase64String(QueryAES.EncryptAes(LoggedInUser.FirmId.ToString()));
                    var content = client.DownloadString("https://c1.mykase.in/Chat/exitchat?uid=" + enuser + "&fid=" + enfirm + "&flag=1");
                }
                catch (Exception er)
                {
                }
                try
                {
                    String FolderPath = Server.MapPath("~/");
                    String FilePath = Path.Combine(FolderPath + "\\GDriveTokens\\" + LoggedInUser.FirmId.ToString() + "\\" + LoggedInUser.UserId.ToString(), "Credentials.json");
                    System.IO.DirectoryInfo di = new DirectoryInfo(FilePath);
                    foreach (FileInfo file in di.GetFiles())
                    {
                        file.Delete();
                    }
                }
                catch (Exception er)
                {
                }
                try
                {
                    var destination12 = "/TempWorkSpace/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                    if (Directory.Exists(Server.MapPath("~/" + destination12)))
                    {
                        Directory.Delete(Server.MapPath("~/" + destination12), true);
                    }
                }
                catch (Exception er)
                {
                }
                try
                {
                    var destination13 = "/TempLawPractice_ds/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                    if (Directory.Exists(Server.MapPath("~/" + destination13)))
                    {
                        Directory.Delete(Server.MapPath("~/" + destination13), true);
                    }
                }
                catch (Exception er)
                {
                }
                try
                {
                    var destination12 = "/TempWorkSpaceCloud/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                    if (Directory.Exists(Server.MapPath("~/" + destination12)))
                    {
                        Directory.Delete(Server.MapPath("~/" + destination12), true);
                    }
                }
                catch (Exception er)
                {
                }
                try
                {
                    var destination13 = "/TempLawPractice_dsCloud/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                    if (Directory.Exists(Server.MapPath("~/" + destination13)))
                    {
                        Directory.Delete(Server.MapPath("~/" + destination13), true);
                    }
                }
                catch (Exception er)
                {
                }
                try
                {
                    var destination14 = "/TempDocuments/textcontent/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                    if (Directory.Exists(Server.MapPath("~/" + destination14)))
                    {
                        Directory.Delete(Server.MapPath("~/" + destination14), true);
                    }
                }
                catch (Exception er)
                {
                }
                try
                {
                    var destination = "/Tempwps/knowqus/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                    if (Directory.Exists(Server.MapPath("~/" + destination)))
                    {
                        Directory.Delete(Server.MapPath("~/" + destination), true);
                    }
                }
                catch (Exception er)
                {
                }
                try
                {
                    var folderPath = Server.MapPath("~/CaseOrders/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/");
                    if (Directory.Exists(folderPath))
                    {
                        Directory.Delete(folderPath, true);
                    }
                }
                catch (Exception er)
                {
                }
                try
                {
                    var destination1 = "/Tempwps/Gdwqus/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                    if (Directory.Exists(Server.MapPath("~/" + destination1)))
                    {
                        Directory.Delete(Server.MapPath("~/" + destination1), true);
                    }
                }
                catch (Exception er)
                {
                }
                RemoveSession(System.Web.HttpContext.Current);
                Session.Clear();
                Session.Abandon();
                Session["sessionfirmid"] = "";
                Session["sessionuserid"] = "";
                try
                {
                    var ctd1 = db.usp_removeloginlog(LoggedInUser.FirmId.ToString(), LoggedInUser.UserName.ToString());
                }
                catch (Exception er)
                {
                }
                Response.Cookies.Clear();
                FormsAuthentication.SignOut();
                Session.Clear();
                Session.Abandon();
                Session.RemoveAll();
                if (Request.Cookies["ASP.NET_SessionId"] != null)
                {
                    Response.Cookies["ASP.NET_SessionId"].Expires = DateTime.Now.AddDays(-1);
                    Response.Cookies["ASP.NET_SessionId"].Value = string.Empty;
                    Response.Cookies.Add(new HttpCookie("ASP.NET_SessionId", string.Empty));
                }
                if (Request.Cookies[".ASPXAUTH"] != null)
                {
                    Response.Cookies[".ASPXAUTH"].Value = string.Empty;
                    Response.Cookies[".ASPXAUTH"].Expires = DateTime.Now.AddMonths(-20);
                    Response.Cookies.Add(new HttpCookie(".ASPXAUTH", ""));
                }
                if (Request.Cookies["G_ENABLED_IDPS"] != null)
                {
                    Response.Cookies["G_ENABLED_IDPS"].Value = string.Empty;
                    Response.Cookies["G_ENABLED_IDPS"].Expires = DateTime.Now.AddMonths(-20);
                    Response.Cookies.Add(new HttpCookie("G_ENABLED_IDPS", ""));
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Logout), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Logout), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
            }
            return View();
        }
    }
}
