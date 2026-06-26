using System.Web.Mvc;
using LawPractice.Areas.Firm.Common;

namespace LawPractice.Areas.Firm.Controllers
{
    public class HomeController : BaseFirmController
    {
        // GET: Company/Home
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your Company description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your Company contact page.";

            return View();
        }


        public ActionResult Articles()
        {
            ViewBag.Message = "Your Company contact page.";

            return View();
        }

        public ActionResult Article()
        {
            ViewBag.Message = "Your Company contact page.";

            return View();
        }

        public ActionResult Won()
        {
            ViewBag.Message = "Your Company contact page.";

            return View();
        }

        public ActionResult Practice()
        {
            ViewBag.Message = "Your Company contact page.";

            return View();
        }

    }
}