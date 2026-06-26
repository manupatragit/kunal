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
    public class CreateFileController : ApiController
    {

        [BasicAuthentication]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult Createfile()
        {

            //  var cfile = HttpContext.Current.Request.Files["FileUpload"];
            //var fpermissions = HttpContext.Current.Request.Form["selectedpermission"];
           // var filedetail = HttpContext.Current.Request.Form["details"];
            //if (filedetail == "")
            //{
            //    filedetail = null;
            //}
           // var directname = HttpContext.Current.Request.Form["dirname"];
            //long folderdirectid = Convert.ToInt32(directname);

            var dirname = Request.Headers.GetValues("dirname").FirstOrDefault();
            byte[] dirnames = System.Convert.FromBase64String(dirname);
            var directname = AES.DecryptAes(dirnames);
            string folderdirectid = directname;

            var firmid = Request.Headers.GetValues("firmid").FirstOrDefault();
            byte[] firmids = System.Convert.FromBase64String(firmid);
            var fid = AES.DecryptAes(firmids);
            var fids = Convert.ToInt32(fid);


            var userid = Request.Headers.GetValues("userid").FirstOrDefault();
            byte[] userids = System.Convert.FromBase64String(userid);
            var uid = AES.DecryptAes(userids);
            var uids = Convert.ToInt32(uid);



            var db = new LawPracticeEntities();
            var actualpath = db.ViewFiles.Where(x => x.Id.ToString() == folderdirectid).Select(x => new { fullname = x.fname }).FirstOrDefault();
            var completepath = actualpath.fullname;
            var path = "";
            string newpath = completepath.ToString();
            //newpath = newpath.Replace("\\", "/");
            newpath = newpath.Replace("/", "\\");
            var httpRequest = HttpContext.Current.Request;
            if (httpRequest.Files.Count > 0)
            {
                var docfiles = new List<string>();
                foreach (string file in httpRequest.Files)
                {
                    var postedFile = httpRequest.Files[file];
                    //var fileName = Path.GetFileNameWithoutExtension(postedFile.FileName);
                    //var fileext = Path.GetExtension(postedFile.FileName);
                    //fileName = fileName + System.DateTime.Now.ToShortDateString() + randomno() + fileext;
                   //// var filePath = HttpContext.Current.Server.MapPath("~/" + newpath + "/" + postedFile.FileName);

                  //  var filePath = "D:\\Project\\LawPractice\\LawPracticeFirm\\" + newpath + "\\" + postedFile.FileName;
                    var filePath = "D:\\ASPLivesites\\LawPracticeNew\\" + newpath + "\\" + postedFile.FileName;


                    postedFile.SaveAs(filePath);
                    docfiles.Add(filePath);
                    //ml.cfile = "/Documents/Matterdocuments/" + postedFile.FileName;
                    var fileext = Path.GetExtension(postedFile.FileName);
                    //var data = Repository.Matter.Createfile(postedFile.FileName, fpermissions, filedetail, directname, fileext, LoggedInUser.FirmId, LoggedInUser.UserId);
                 
                    string directname1 = folderdirectid;
                    ViewFile vf = new ViewFile();
                    vf.fname = postedFile.FileName;
                    vf.ftype = 1;
                    vf.pfile = Guid.Parse(directname1);
                    vf.Firmid = Guid.Parse(fids.ToString());
                    vf.Firmuser = Guid.Parse(uids.ToString());
                   // vf.fdetails = filedetail;
                    vf.filetype = fileext;
                    //vf.fpermission = fpermissions;
                    vf.date_time = System.DateTime.Now;
                    db.ViewFiles.Add(vf);
                    db.SaveChanges();
                   

                    return Ok("save successfully");
                }

            }
            else
            {
                return Ok("File not found");
            }

            return Ok();

        }
    }
}
