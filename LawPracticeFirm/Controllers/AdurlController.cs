using DataAccess.Modals;
using LawPracticeFirm.Common;
using QueryStringEDAES;
using System;
using System.Web.Mvc;
namespace LawPracticeFirm.Controllers
{
    public class AdurlController : BaseFirmController
    {
        /// <summary>
        /// Bar and Bench details
        /// </summary>
        /// <returns></returns>
        [Route("Adurl/{barNbenchsr}")]
        public ActionResult barNbench()
        {
            var db = new LawPracticeEntities();
            string url = Request.Url.AbsoluteUri;
            Uri uriAddress1 = new Uri(url);
            var ct = db.usp_SaveUrlPageTrack(uriAddress1.Segments[2], GetIp(), "/Adurl/MykaseDemoReg", Request.Headers["User-Agent"].ToString());
            return RedirectToAction("MykaseDemoReg", "Adurl", new { Source = uriAddress1.Segments[2] });
        }
        /// <summary>
        /// Get IP details
        /// </summary>
        /// <returns></returns>
        public static string GetIp()
        {
            string ip = System.Web.HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
            if (string.IsNullOrEmpty(ip))
            {
                ip = System.Web.HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
            }
            return ip;
        }
        [Route("AdurlReg/MykaseDemoReg")]
        public ActionResult MykaseDemoReg()
        {
            var Source = QueryAES.UrlDecode(Request.QueryString["Source"]);
            ViewBag.Source = Source;
            return Redirect("/schedule-demo-law-practice-management?Source=" + Source);
        }
        /// <summary>
        /// Schedule demo law practice management
        /// </summary>
        /// <returns></returns>
        [Route("schedule-demo-law-practice-management")]
        public ActionResult scheduledemolawpracticemanagement()
        {
            var Source = QueryAES.UrlDecode(Request.QueryString["Source"]);
            ViewBag.Source = Source;
            return View();
        }
        /// <summary>
        /// New Bar and bench details
        /// </summary>
        /// <returns></returns>
        [Route("mykase/{barNbenchsr}")]
        public ActionResult barNbenchNew()
        {
            var db = new LawPracticeEntities();
            string url = Request.Url.AbsoluteUri;
            Uri uriAddress1 = new Uri(url);
            var ct = db.usp_SaveUrlPageTrack(uriAddress1.Segments[2], GetIp(), "/mykase", Request.Headers["User-Agent"].ToString());
            ViewBag.Source = uriAddress1.Segments[2];
            return View();
        }
    }
}