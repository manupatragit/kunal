using BussinessLogic;
using DataAccess.Modals;
using LawPracticeFirm.Common;
using LawPracticeFirm.Helpers;
using LawPracticeFirm.Models;
using System.IO;
using System.Linq;
using System.Web.Mvc;
namespace LawPracticeFirm.Controllers
{
    public class DocsController : BaseFirmController
    {
        /// <summary>
        /// Log service
        /// </summary>
        /// <param name="content"></param>
        private void LogService(string content)
        {
            var templogpath = Server.MapPath("//");
            FileStream fs = new FileStream(templogpath + "//MyKaseoffiecSyncLog.txt", FileMode.OpenOrCreate, FileAccess.Write);
            StreamWriter sw = new StreamWriter(fs);
            sw.BaseStream.Seek(0, SeekOrigin.End);
            sw.WriteLine(content);
            sw.Flush();
            sw.Close();
        }
        /// <summary>
        /// Editor cloud
        /// </summary>
        /// <param name="fileName"></param>
        /// <param name="editorsMode"></param>
        /// <param name="editorsType"></param>
        /// <returns></returns>
        public ActionResult EditorCloud1(string fileName, string editorsMode, string editorsType)
        {
            var file = new FileModel
            {
                Mode = editorsMode,  // editor mode: edit or view
                Type = editorsType,  // editor type: desktop, mobile, embedded
                FileName = Path.GetFileName(fileName)  // file name
            };
            return View("EditorCloud", file);
        }
        /// <summary>
        /// Create a sample document
        /// </summary>
        /// <param name="fileExt"></param>
        /// <param name="sample"></param>
        /// <returns></returns>
        public ActionResult SampleCloud1(string fileExt, bool? sample)
        {
            var fileName = DocManagerHelper.CreateDemo(fileExt, sample ?? false);  // create a sample document
            var id = Request.Cookies.GetOrDefault("uid", null);
            var user = Users.getUser(id);
            DocManagerHelper.CreateMeta(fileName, user.id, user.name);  // create meta information for the sample document
            Response.Redirect(Url.Action("EditorCloud", "Docs", new { fileName = fileName }));
            return null;
        }
        /// <summary>
        /// Editor cloud
        /// </summary>
        /// <param name="fileName"></param>
        /// <param name="editorsMode"></param>
        /// <param name="editorsType"></param>
        /// <param name="dname"></param>
        /// <param name="cmode"></param>
        /// <param name="ftoken"></param>
        /// <param name="utoken"></param>
        /// <param name="token"></param>
        /// <param name="verifyurl"></param>
        /// <param name="sharedfolder"></param>
        /// <param name="creatednew"></param>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult EditorCloud(string fileName, string editorsMode, string editorsType, string dname, string cmode, string ftoken = null, string utoken = null, string token = null, string verifyurl = null, string sharedfolder = null, string creatednew = null)
        {
            var doclimit = DocumentQuota.CheckDocumentmanagementFileSize(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
            if (doclimit.ToString() != "Available")
            {
                ViewBag.doclimitStatus = doclimit;
            }
            var file = new FileModel
            {
                Mode = editorsMode,  // editor mode: edit or view
                Type = editorsType,  // editor type: desktop, mobile, embedded
                FileName = Path.GetFileName(fileName),  // file name
                dname = dname,
                cmode = cmode,
                ftoken = ftoken,
                utoken = utoken,
                token = token,
                verifyurl = verifyurl,
                sharedfolder = sharedfolder,
                creatednew = creatednew,
                firmid = LoggedInUser.FirmId.ToString(),
                userid = LoggedInUser.UserId.ToString(),
                username = LoggedInUser.UserName,
                doclimit = doclimit
            };
            var db = new LawPracticeEntities();
            if (LoggedInUser.FirmId.ToString().ToLower() != LoggedInUser.FirmId.ToString().ToLower())//for other firm security
            {
                return View("EditorCloud", "");
            }
            else if (LoggedInUser.RoleId == 1 && LoggedInUser.FirmId.ToString().ToLower() == LoggedInUser.FirmId.ToString().ToLower())
            {
            }
            else
            {
                var getvaliduser = db.usp_checkvaliduserfordocaccess(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), ftoken).FirstOrDefault();
                if (getvaliduser != null)
                {
                }
                else
                {
                    return View("EditorCloud", "");
                }
            }
            return View("EditorCloud", file);
        }
        /// <summary>
        /// Get sample cloud details
        /// </summary>
        /// <param name="fileExt"></param>
        /// <param name="sample"></param>
        /// <param name="fname"></param>
        /// <param name="dname"></param>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult SampleCloud(string fileExt, bool? sample, string fname = "test", string dname = "0")
        {
            var db = new LawPracticeEntities();
            string firmid = LoggedInUser.FirmId.ToString();
            var fileid = DocManagerHelper.CreateDemoCloud(fileExt, fname, dname, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
            var fildata = db.usp_CheckFilefolderCloud(firmid, fileid).FirstOrDefault();
            var filename = fildata.fname;
            Response.Redirect(Url.Action("EditorCloud", "Docs", new { fileName = filename, dname = dname, utoken = fildata.Firmuser.ToString(), cmode = "createfile", firmids = LoggedInUser.FirmId, userids = LoggedInUser.UserId, ftoken = fileid, token = fildata.AZureFileId, verifyurl = "", sharedfolder = "", creatednew = "1" }));
            return null;
        }
        /// <summary>
        /// View sample cloud details
        /// </summary>
        /// <param name="fileName"></param>
        /// <param name="dname"></param>
        /// <param name="cmode"></param>
        /// <param name="ftoken"></param>
        /// <param name="utoken"></param>
        /// <param name="token"></param>
        /// <param name="verifyurl"></param>
        /// <param name="sharedfolder"></param>
        /// <returns></returns>
        [FirmControllerAuthorization]
        public ActionResult ViewSampleCloud(string fileName, string dname, string cmode, string ftoken = null, string utoken = null, string token = null, string verifyurl = null, string sharedfolder = null)
        {
            var db = new LawPracticeEntities();
            string firmid = LoggedInUser.FirmId.ToString();
            var fildata = db.usp_CheckFilefolderCloud(firmid, token).FirstOrDefault();
            var filename = fildata.fname;
            Response.Redirect(Url.Action("EditorCloud", "Docs", new { fileName = filename, dname = fildata.pfile, utoken = fildata.Firmuser.ToString(), cmode = cmode, firmids = LoggedInUser.FirmId, userids = LoggedInUser.UserId, ftoken = token, token = fildata.AZureFileId, verifyurl = verifyurl, sharedfolder = sharedfolder }));
            return null;
        }
    }
}