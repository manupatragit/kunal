using BussinessLogic;
using LawPracticeFirm.Common;
using QueryStringEDAES;
using System;
using System.Web.Mvc;


namespace LawPracticeFirm.Controllers
{
    public class DigitalSignatureController : BaseFirmController
    {
        /// <summary>
        /// Set Digital Signature
        /// </summary>
        /// <returns></returns>
        [AcceptVerbs(HttpVerbs.Get | HttpVerbs.Post)]
        public ActionResult Sucess()
        {
            if (Request.RequestType != "POST")
            {
                return View("PageNotFound");
            }
            string token = Request.QueryString["token"];
            string tokenToDecrypt = token.Replace(" ", "+");
            string docnum = Request.QueryString["docnum"];
            string docname = Request.QueryString["docname"];
            string userid = Request.QueryString["userid"];
            string signtype = Request.QueryString["signtype"];
            string[] dts = Request.Form.AllKeys;
            string SignedData = Request.Form["Returnvalue"];
            string Referencenumber = Request.Form["Referencenumber"];
            string Transactionnumber = Request.Form["Transactionnumber"];
            string ftoken = Request.QueryString["ftoken"];
            byte[] newbyte1 = Convert.FromBase64String(SignedData);
            byte[] newbyte2 = Convert.FromBase64String(tokenToDecrypt);
            var firmid = ftoken;
            ESign.DecryptJsonDataAES(newbyte1, newbyte2, userid, signtype, docnum, docname, Referencenumber, Transactionnumber, firmid);
            ViewBag.docname = docname;
            return View();
        }
        /// <summary>
        /// Get digital signature cloud success detail
        /// </summary>
        /// <returns></returns>
        [AcceptVerbs(HttpVerbs.Get | HttpVerbs.Post)]
        public ActionResult SucessCloud()
        {
            if (Request.RequestType != "POST")
            {
                return View("PageNotFound");
            }
            string token = QueryAES.UrlDecode(Request.QueryString["token"]);
            string tokenToDecrypt = token.Replace(" ", "+");
            string docnum = QueryAES.UrlDecode(Request.QueryString["docnum"]);
            string docname = QueryAES.UrlDecode(Request.QueryString["docname"]);
            string userid = QueryAES.UrlDecode(Request.QueryString["userid"]);
            string signtype = QueryAES.UrlDecode(Request.QueryString["signtype"]);//Username
            string username = QueryAES.UrlDecode(Request.QueryString["Username"]);
            string Filetype = QueryAES.UrlDecode(Request.QueryString["Filetype"]);
            string Uid = QueryAES.UrlDecode(Request.QueryString["Uid"]);
            string Cordinatetype = QueryAES.UrlDecode(Request.QueryString["Cordinatetype"]);

            string[] dts = Request.Form.AllKeys;
            string SignedData = QueryAES.UrlDecode(Request.Form["Returnvalue"]);
            string Referencenumber = QueryAES.UrlDecode(Request.Form["Referencenumber"]);
            string Transactionnumber = QueryAES.UrlDecode(Request.Form["Transactionnumber"]);
            string ftoken = Request.QueryString["ftoken"];
            byte[] newbyte1 = Convert.FromBase64String(SignedData);
            byte[] newbyte2 = Convert.FromBase64String(tokenToDecrypt);

            var firmid = ftoken;
            ESignCloud.DecryptJsonDataAES(newbyte1, newbyte2, userid, signtype, docnum, docname, Referencenumber, Transactionnumber, firmid, username, Filetype, Uid, Cordinatetype);
            ViewBag.docname = docname;
            return View();

        }
        /// <summary>
        /// Error
        /// </summary>
        /// <returns></returns>
        public ActionResult Error()
        {
            return View();
        }
        /// <summary>
        /// Cancel
        /// </summary>
        /// <returns></returns>
        public ActionResult Cancel()
        {
            return View();
        }
    }
}