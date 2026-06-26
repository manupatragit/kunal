using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using DataAccess.Modals;
using Newtonsoft.Json;

namespace LawApiPractice.Controllers
{
    public class CreateDirController : ApiController
    {
        //create directory
        [BasicAuthentication]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CreateDirectory()
        {
            
            var dirname = Request.Headers.GetValues("dirname").FirstOrDefault();
            byte[] dirnames = System.Convert.FromBase64String(dirname);
            var directname = AES.DecryptAes(dirnames);


            var firmid = Request.Headers.GetValues("firmid").FirstOrDefault();
            byte[] firmids = System.Convert.FromBase64String(firmid);
            var fid = AES.DecryptAes(firmids);
            string fids = fid;


            var userid = Request.Headers.GetValues("userid").FirstOrDefault();
            byte[] userids = System.Convert.FromBase64String(userid);
            var uid = AES.DecryptAes(userids);
            string uids =uid;


            //string baseURL = HttpContext.Current.Request.Url.Host;

            if (dirname != "" && fids.ToString() !="" )
            {
                //AppDomain.CurrentDomain.BaseDirectory
                //   var fpath = HttpContext.Current.Server.MapPath("~/WorkSpace/" + fids + "/" + dirname);

                //   var fpath = HttpContext.Current.Server.MapPath("~/WorkSpace/" + fids + "/" + dirname);
                //var fpath = "D:\\Project\\LawPractice\\LawPracticeFirm\\WorkSpace\\" + fids + "\\" + dirname;
                var fpath = "D:\\ASPLivesites\\LawPracticeNew\\WorkSpace\\" + fids + "\\" + directname;

                var path = "WorkSpace/" + fids + "/" + directname;
                if (!(Directory.Exists(fpath)))

                {

                    Directory.CreateDirectory(fpath);
                    var db = new LawPracticeEntities();
                    ViewFile vf = new ViewFile();
                    vf.fname = path;
                    vf.ftype = 0;
                    vf.pfile = null;
                    vf.Firmid = Guid.Parse(fids.ToString());
                    vf.Firmuser = Guid.Parse(uids.ToString());
                    vf.date_time = System.DateTime.Now;
                    db.ViewFiles.Add(vf);
                    db.SaveChanges();
                    return Ok("successfully created");

                    

                }

                else

                {
                    return Ok("Already Directory Exits With Same Name");


                }
            }
            else
            {
                return Ok("Directory Name is Blank");
            }

        }


       
    }
}
