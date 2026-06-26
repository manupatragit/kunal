using LawPracticeFirm.Common;
using QueryStringEDAES;
using System;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace LawPracticeFirm.API
{
    public class DataFileStreamApiController : BaseFirmApiController
    {

        /// <summary>
        /// Data File Stream Responder
        /// </summary>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult DataFileStreamResponder()
        {
            try
            {
                dynamic streams = "";
                string urloffice = "";
                var url = Request.Headers.GetValues("filepath").FirstOrDefault();
                var token = Request.Headers.GetValues("token").FirstOrDefault();
                url = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(url));
                token = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(token));
                if (token.ToString() == "MyKAselawPractice9852187@25125412")
                {
                    url = HttpContext.Current.Server.MapPath("//" + url);
                    urloffice = url;
                    string downloadUrireplace = HttpContext.Current.Server.MapPath("//LawPractice_ds");
                    string downloadUrireplace1 = HttpContext.Current.Server.MapPath("//WorkSpace");

                    urloffice = urloffice.ToString().Replace(downloadUrireplace, downloadUrireplace1);

                    if (File.Exists(url))
                    {
                        DateTime lastmodified = DateTime.Now;
                        lastmodified = File.GetLastWriteTime(url);
                        byte[] bytes = System.IO.File.ReadAllBytes(url);
                        string actualfile = Convert.ToBase64String(bytes);
                        var result = new { Data = actualfile, ModifyDate = lastmodified };
                        return Ok(result);
                    }
                    else if (File.Exists(urloffice))
                    {
                        DateTime lastmodified = DateTime.Now;
                        lastmodified = File.GetLastWriteTime(urloffice);
                        byte[] bytes = System.IO.File.ReadAllBytes(urloffice);
                        string actualfile = Convert.ToBase64String(bytes);
                        var result = new { Data = actualfile, ModifyDate = lastmodified };
                        return Ok(result);

                    }
                    else
                    {
                        var result = new { Data = "", ModifyDate = "" };
                        return Ok(result);
                    }
                }
                else
                {
                    return Ok("invalid token");
                }
            }
            catch (Exception ad)
            {
                return Ok(ad.Message);
            }
        }
    }
}
