using LawPracticeFirm.Common;
using LawPracticeFirm.CustomFIlter;
using System.Web.Mvc;

namespace LawPracticeFirm.Controllers
{
    public class AdminController : BaseFirmController
    {
        /// <summary>
        /// Admin view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Admin")]
        public ActionResult Index()
        {
            return View();
        }

        [AuthLog(Roles = "Admin1")]
        public ActionResult Index1()
        {
            return View();
        }
       
        public ActionResult Index2()
        {
            return View();
        }
    }
}