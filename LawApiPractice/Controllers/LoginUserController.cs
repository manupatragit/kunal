using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DataAccess.Modals;
using Newtonsoft.Json;

namespace LawApiPractice.Controllers
{
    public class LoginUserController : ApiController
    {
       // [BasicAuthentication]
        [HttpPost]
        public IHttpActionResult Get()
        {
            // var uids= Convert.ToBase64String(uid.ToArray());
            var db = new LawPracticeEntities();
            var uid =Request.Headers.GetValues("username").FirstOrDefault();
            byte[] uids = System.Convert.FromBase64String(uid);
            var uidss=AES.DecryptAes(uids);


            var password = Request.Headers.GetValues("password").FirstOrDefault();
            byte[] passwords = System.Convert.FromBase64String(password);
            var passwordss = AES.DecryptAes(passwords);



            if (uidss != "" && passwordss != "")
            {
                var data = db.usp_GetLoginUserApi(uidss, passwordss).ToList();
                var json = JsonConvert.SerializeObject(data);
                byte[] encryptdata = AES.EncryptAes(json.ToString());
                // var endata = Convert.ToBase64String(encryptdata);
                //byte[] dedata = System.Convert.FromBase64String(endata);
                //dynamic rdata = AES.DecryptAes(dedata);
                return Ok(encryptdata);

            }
          
            else
            {
                return Ok("Invalid Authentication!");
            }
          

        }


        
    }
}
