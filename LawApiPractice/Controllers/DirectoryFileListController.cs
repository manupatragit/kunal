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
    public class DirectoryFileListController : ApiController
    {
        [BasicAuthentication]
        [HttpPost]
        public IHttpActionResult Get()
        {


            var db = new LawPracticeEntities();
            var uid = Request.Headers.GetValues("uid").FirstOrDefault();


            byte[] uids = System.Convert.FromBase64String(uid);
            var uidss = AES.DecryptAes(uids);
            var userid = Convert.ToInt32(uidss);
            //var listdir = db.ViewFiles.Where(x => x.Firmuser == userid && x.ftype == 1).ToList();
            var listdir = db.GetFilesApi(Guid.Parse(userid.ToString())).ToList();
            var json = JsonConvert.SerializeObject(listdir);
            byte[] encryptdata = AES.EncryptAes(json.ToString());
            return Ok(encryptdata);

        }
    }
}
