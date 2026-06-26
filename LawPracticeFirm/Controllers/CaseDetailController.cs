using System;
using System.Web.Mvc;

namespace NJDGDetail.Controllers
{
    public class CaseDetailController : Controller
    {

        public ActionResult Index()
        {
            return View();
        }
        /// <summary>
        /// Case detail view page
        /// </summary>
        /// <returns></returns>
        public ActionResult GetCaseDetails()
        {
            return View();
        }
        /// <summary>
        /// Show full case details
        /// </summary>
        /// <returns></returns>
        public ActionResult ShowFullCaseDetails()
        {
            return View();
        }
        /// <summary>
        /// Case detail Data
        /// </summary>
        /// <returns></returns>
        public ActionResult Data()
        {
            return View();
        }

        public ActionResult CalendarTest()
        {
            return View();
        }
        /// <summary>
        /// Save case details notes
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [ValidateInput(false)]
        public ActionResult SaveNotes()
        {
            string iid = Request.Form["hdnqrystr"];
            try
            {
                string notes = Request.Form["txtnote"];
            }
            catch (Exception ex)
            {
            }
            return RedirectToAction("ShowFullCaseDetails?id=" + iid, "CaseDetail");
        }
    }
}
