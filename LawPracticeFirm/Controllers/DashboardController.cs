using NJDGDetail.Models;
using System;
using System.Linq;
using System.Web.Mvc;

namespace NJDGDetail.Controllers
{
    public class DashboardController : Controller
    {
        /// <summary>
        /// Dashbord view
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            return View();
        }
        /// <summary>
        /// Case Detail Dashbord
        /// </summary>
        /// <returns></returns>
        public ActionResult CaseDetailDashbord()
        {
            return View();
        }
        /// <summary>
        /// Get Master Case Details
        /// </summary>
        /// <param name="crtid"></param>
        /// <param name="username"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult GetMasterCaseData(string crtid = "", string username = "")
        {
            try
            {
                CaseDetailObjectList courseEnrolList = CaseDetailObjeController.GetMasterCaseData(crtid, username);
                var clist = (from ob in courseEnrolList select new { casetype = ob.Court, casetypename = ob.Courtname }).Distinct().OrderBy(x => x.casetypename).ToList();
                return Json(clist, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR IN UPDATING STATUS", Message = "ERROR" }, JsonRequestBehavior.AllowGet);
            }
        }

    }
}
