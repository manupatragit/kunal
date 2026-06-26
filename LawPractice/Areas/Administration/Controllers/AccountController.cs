using System.Web.Mvc;
using LawPractice.Common;

namespace LawPractice.Areas.Administration.Controllers
{
    public class AccountController : BaseController
    {
        [AllowAnonymous]
        public ActionResult Login()
        {
            return View();
        }

        [AllowAnonymous]
        public ActionResult Register()
        {
            return View();
        }

        [AllowAnonymous]
        public ActionResult ForgotPassword()
        {
            return View();
        }

        [ApplicationControllerAuthorization(Roles = "Admins")]
        public ActionResult UserProfile()
        {
            return View();
        }

        [ApplicationControllerAuthorization(Roles = "")]
        public ActionResult ChangePassword()
        {
            return View();
        }
    }
}