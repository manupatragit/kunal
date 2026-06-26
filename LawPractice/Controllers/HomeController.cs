using System.Web.Mvc;
using LawPractice.Common;

namespace LawPractice.Controllers
{
    public class HomeController : BaseController
    {
        // GET: Company/Home
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your Application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            var x = new AccountController();

            ViewBag.Message = "Your Application contact page.";

            return View();
        }
    }
}