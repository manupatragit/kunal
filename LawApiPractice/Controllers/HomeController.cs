using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataAccess.Modals;
using Newtonsoft.Json;


namespace LawApiPractice.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";
         ViewBag.path=System.Net.Dns.GetHostName();
            return View();
        }

        public ActionResult testfile()
        {
            ViewBag.Title = "Home Page";
            ViewBag.path = System.Net.Dns.GetHostName();
            return View();
        }
        public ActionResult ContactList()

        {
            //byte[] ssss= AES.EncryptAes("neelesh"); 

            ViewBag.Title = "Home Page";
            // ViewBag.entr = Convert.ToBase64String(ssss.ToArray());
            var db = new LawPracticeEntities();
            //var data = "('hi','123'}"; //db.usp_GetLoginUserApi("team", "123456").FirstOrDefault();.
           // var data = db.usp_GetLoginUserApi("DHAssociates", "12345678").FirstOrDefault();

           // var json = JsonConvert.SerializeObject(data);
           //var encryptdata = AES.EncryptAes(json.ToString());
           // var rdata = Convert.ToBase64String(encryptdata);
           // byte[] uids = System.Convert.FromBase64String(rdata);
           // dynamic uidss = AES.DecryptAes(uids);
            // var ld = uids.ToList();
            //return Ok(rdata);
            //return Ok(rdata)

            var dts = "dhassociates:12345678";
            var encryptdata1 = AES.EncryptAes(dts.ToString());
            var rdata1 = Convert.ToBase64String(encryptdata1);

            byte[] uids1 = System.Convert.FromBase64String(rdata1);
            dynamic uidss1 = AES.DecryptAes(uids1);
            //var data= AES.DecryptAes(ssss);

            var dts1 = "12345678";
            var encryptdata11 = AES.EncryptAes(dts1.ToString());
            var rdata11 = Convert.ToBase64String(encryptdata11);

            byte[] uids11 = System.Convert.FromBase64String(rdata11);
            dynamic uidss11 = AES.DecryptAes(uids11);
            //var data= AES.DecryptAes(ssss);
            //AES.DecryptAes(System.Byte[]);
            return View();
        }
    }
}
