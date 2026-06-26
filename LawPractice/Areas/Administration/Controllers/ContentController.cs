using System.Web.Mvc;
using LawPractice.Common;

namespace LawPractice.Areas.Administration.Controllers
{
    public class ContentController : BaseController
    {
        // GET: Content
        public ActionResult Index()
        {
            return View();
        }
    }
}