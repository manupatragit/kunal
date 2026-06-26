using System.Web.Mvc;
using LawPracticeFirm.Common;

namespace LawPracticeFirm.Controllers
{
    public class ErrorController : Controller
    {
        // GET: Firm/Error
        public ActionResult Timeout()
        {
            return View();
        }

        public ActionResult WrongPath()
        {
            return View();
        }
    }
}