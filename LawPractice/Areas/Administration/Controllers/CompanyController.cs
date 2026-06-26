using System.Web.Mvc;
using LawPractice.Common;

namespace LawPractice.Areas.Administration.Controllers
{
    public class CompanyController : BaseController
    {
        // GET: Company
        public ActionResult Index()
        {
            return View();
        }
    }
}