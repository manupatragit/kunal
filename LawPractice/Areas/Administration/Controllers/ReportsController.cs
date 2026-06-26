using System.Web.Mvc;
using LawPractice.Common;

namespace LawPractice.Areas.Administration.Controllers
{
    public class ReportsController : BaseController
    {
        // GET: Reports
        public ActionResult Index()
        {
            return View();
        }
    }
}