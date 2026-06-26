using System.Web.Mvc;
using LawPractice.Common;

namespace LawPractice.Controllers
{
    public class ErrorController : BaseController
    {
        // GET: Company/Error
        public ActionResult Index()
        {
            return View();
        }
    }
}