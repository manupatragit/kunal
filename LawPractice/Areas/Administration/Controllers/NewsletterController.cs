using System.Web.Mvc;
using LawPractice.Common;

namespace LawPractice.Controllers
{
    public class NewsletterController : BaseController
    {
        // GET: Newsletter
        public ActionResult Index()
        {
            return View();
        }
    }
}