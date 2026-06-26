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
    public class ListUrlPathController : ApiController
    {
        [BasicAuthentication]
        [HttpPost]

        public IHttpActionResult Get()
        {
            var db = new LawPracticeEntities();
            var listdir = db.usp_GetUrlPath().ToList();
            var json = JsonConvert.SerializeObject(listdir);
            byte[] encryptdata = AES.EncryptAes(json.ToString());
            return Ok(encryptdata);

        }
    }
}
