using System.Web.Mvc;
using LawPracticeFirm.Common;

namespace LawPracticeFirm.Controllers
{
    public class ConfigurationController : BaseFirmController
    {
        // GET: Firm/Configuration
        [FirmControllerAuthorization(AdminUser = true)]
        public ActionResult CaseField()
        {
            return View();
        }

        [FirmControllerAuthorization(AdminUser = true)]
        public ActionResult UserField()
        {
            return View();
        }

        [FirmControllerAuthorization(AdminUser =true)]
        public ActionResult ClientField()
        {
            return View();
        }

        [FirmControllerAuthorization(AdminUser = true)]
        public ActionResult TaskField()
        {
            return View();
        }

        [FirmControllerAuthorization(AdminUser = true)]
        public ActionResult EventField()
        {
            return View();
        }
    }
}