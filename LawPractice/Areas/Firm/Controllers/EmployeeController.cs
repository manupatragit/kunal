using System.Web.Mvc;
using System.Web.Script.Serialization;
using BussinessLogic.Common;
using LawPractice.Areas.Firm.Common;
using LawPractice.Common;

namespace LawPractice.Areas.Firm.Controllers
{
    public class EmployeeController : BaseFirmController
    {
        public EmployeeController()
        {
            
        }
        // GET: Company/Employee
        [FirmControllerAuthorization(Module = Module.Matters, AccessRight = AccessRight.Read)]
        public ActionResult Index()
        {
            var json = new JavaScriptSerializer().Serialize(LoggedInUser);
            return View();
        }

        public ActionResult Settings()
        {
            return View();
        }

        [FirmControllerAuthorization]
        public ActionResult Case(string caseid)
        {
            ViewBag.Id = caseid;
            //Check matterId is valid for User
            return View();
        }

        [FirmControllerAuthorization]
        public ActionResult Cases()
        {
            return View();
        }

        [FirmControllerAuthorization]
        public ActionResult Employee()
        {
            return View();
        }

        [FirmControllerAuthorization]
        public ActionResult Employees()
        {
            return View();
        }

        [FirmControllerAuthorization]
        public ActionResult Events()
        {
            return View();
        }

        [FirmControllerAuthorization]
        public ActionResult Event()
        {
            return View();
        }

        [FirmControllerAuthorization]
        public ActionResult Tasks()
        {
            return View();
        }

        [FirmControllerAuthorization]
        public ActionResult Task()
        {
            return View();
        }

        [FirmControllerAuthorization]
        public ActionResult Clients()
        {
            return View();
        }

        [ApplicationControllerAuthorization]
        public ActionResult Client()
        {
            return View();
        }


        [ApplicationControllerAuthorization(Module = Module.Team,  AccessRight =AccessRight.ManageTeamUser)]
        public ActionResult TeamUsers(string caseid)
        {
            return View();
        }

        [ApplicationControllerAuthorization(Module = Module.Firm)]
        public ActionResult FirmInformation()
        {
            return View();
        }
    }
}