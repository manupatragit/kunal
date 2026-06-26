using DataAccess.Modals;
using LawPracticeFirm.Common;
using LawPracticeFirm.CustomFIlter;
using QueryStringEDAES;
using System.Configuration;
using System.Linq;
using System.Web.Mvc;

namespace LawPracticeFirm.Controllers
{
    public class NoticeController : BaseFirmController
    {
        private LawPracticeEntities db1 = new LawPracticeEntities();
        public string controllername = "ClientController";
        /// <summary>
        /// Notice view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult Index()
        {
            ViewBag.filesize = ConfigurationManager.AppSettings["filesizemultiple"];
            ViewBag.pagesize = System.Configuration.ConfigurationManager.AppSettings["pagesize"];
            return View();
        }
        /// <summary>
        /// View assigned notice
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult AssignedNotice()
        {
            ViewBag.filesize = ConfigurationManager.AppSettings["filesizemultiple"];
            ViewBag.pagesize = System.Configuration.ConfigurationManager.AppSettings["pagesize"];
            return View();
        }
        /// <summary>
        /// Create notice details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult CreateNotice()
        {
            var db = new LawPracticeEntities();
            ViewBag.filesize = ConfigurationManager.AppSettings["filesize"];
            var user = LoggedInUser.FirmId;
            var firmusers = (from c in db.FirmUsers
                             join d in db.Roles on c.RoleId equals d.ID
                             where c.Firmid.ToString() == user.ToString() && c.IsActive == true && c.RoleId != 3
                             select new
                             {
                                 label = c.UserName + " -( " + d.RoleName + " )",
                                 val = c.Id,
                                 roleid = c.RoleId,
                                 role = d.RoleName
                             }).ToList();
            ViewBag.Fruits = firmusers;
            return View();
        }
        /// <summary>
        /// Edit notice details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User")]
        public ActionResult EditNotice()
        {
            var db = new LawPracticeEntities();
            ViewBag.filesize = ConfigurationManager.AppSettings["filesize"];
            var token = QueryAES.UrlDecode(Request.Form["token"]);
            ViewBag.token = token;
            var user = LoggedInUser.FirmId;
            var firmusers = (from c in db.FirmUsers
                             join d in db.Roles on c.RoleId equals d.ID
                             where c.Firmid.ToString() == user.ToString() && c.IsActive == true && c.RoleId != 3
                             select new
                             {
                                 label = c.UserName + " -( " + d.RoleName + " )",
                                 val = c.Id,
                                 roleid = c.RoleId,
                                 role = d.RoleName
                             }).ToList();
            ViewBag.Fruits = firmusers;
            return View();
        }
    }
}