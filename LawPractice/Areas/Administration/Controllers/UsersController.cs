using System.Web.Mvc;
using LawPractice.Common;

namespace LawPractice.Areas.Administration.Controllers
{
    public class UsersController : BaseController
    {
        // GET: Users
        public ActionResult Index()
        {
            return View();
        }
    }
}