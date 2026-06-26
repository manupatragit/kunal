using LawPracticeFirm.Common;
using LawPracticeFirm.CustomFIlter;
using System.Web.Mvc;

namespace LawPracticeFirm.Controllers
{
    public class ManupatraSearchController : BaseFirmController
    {
        /// <summary>
        /// Manupatra Search view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm")]
        public ActionResult GetSearchQuery()
        {
            ViewBag.pagesize = System.Configuration.ConfigurationManager.AppSettings["pagesize"];
            return View();
        }

        [AuthLog(Roles = "Firm")]
        public ActionResult AddSearchQuery()
        {
            return View();
        }
    }
}