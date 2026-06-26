using LawPracticeFirm.Common;
using LawPracticeFirm.CustomFIlter;
using System.Web.Mvc;

namespace LawPracticeFirm.Controllers
{
    public class UserController : BaseFirmController
    {
        /// <summary>
        /// User index view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles="User")]
        public ActionResult Index()
        {
            return View();
        }
    }
}