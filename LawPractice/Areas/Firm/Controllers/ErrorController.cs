using System.Web.Mvc;
using LawPractice.Areas.Firm.Common;

namespace LawPractice.Areas.Firm.Controllers
{
    public class ErrorController : BaseFirmController
    {
        // GET: Firm/Error
        public ActionResult Timeout()
        {
            return View();
        }
    }
}