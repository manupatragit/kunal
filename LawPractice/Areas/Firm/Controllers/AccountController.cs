using System.Web.Mvc;
using LawPractice.Areas.Firm.Common;

namespace LawPractice.Areas.Firm.Controllers
{
    public class AccountController : BaseFirmController
    {
        public ActionResult Login()
        {
            return View();
        }

        public ActionResult Register()
        {
            return View();
        }

        public ActionResult ForgotPassword()
        {
            return View();
        }

        [FirmControllerAuthorization()]
        public ActionResult UserProfile()
        {
            return View();
        }

        [FirmControllerAuthorization()]
        public ActionResult ChangePassword()
        {
            return View();
        }

        [FirmControllerAuthorization()]
        public ActionResult LogOut()
        {
            RemoveSession(System.Web.HttpContext.Current);
            return View();
        }
    }
}