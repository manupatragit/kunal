using System.Web.Mvc;
using LawPractice.Common;

namespace LawPractice.Areas.Administration.Controllers
{
    public class QueriesController : BaseController
    {
        // GET: Queries
        public ActionResult Index()
        {
            return View();
        }
    }
}