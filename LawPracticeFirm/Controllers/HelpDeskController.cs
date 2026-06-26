using DataAccess.Modals;
using LawPracticeFirm.Common;
using System.Web.Mvc;

namespace LawPracticeFirm.Controllers
{
    public class HelpDeskController : BaseFirmController
    {
        private LawPracticeEntities db = new LawPracticeEntities();
        /// <summary>
        /// Help desk view
        /// </summary>
        /// <returns></returns>
        public ActionResult Help()
        {
            return View();
        }
    }
}