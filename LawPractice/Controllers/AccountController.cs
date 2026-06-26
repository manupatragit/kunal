using System.Web.Mvc;
using LawPractice.Common;

namespace LawPractice.Controllers
{
    public class AccountController : BaseController
    {
        // GET: Account
        public ActionResult Registration()
        {
            return View();
        }
    }
}