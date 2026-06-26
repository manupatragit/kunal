using LawPracticeFirm.Common;
using QueryStringEDAES;
using System;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace LawPracticeFirm.API
{
    public class FileStreamApiController : BaseFirmApiController
    {
        /// <summary>
        /// File Stream Responder
        /// </summary>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult FileStreamResponder()
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
                        var tempdirname = Path.GetDirectoryName(url);
                        var tempfilename = Path.GetFileName(url);
                        tempfilename = "__SYnc__" + tempfilename;
                        var url1 = tempdirname + "\\" + tempfilename;
                        try
                        {
                            File.Delete(url1);
                        }
                        catch (Exception ee)
                        {

                        }
                        DateTime lastmodified = DateTime.Now;
                        lastmodified = File.GetLastWriteTime(url);
                        try
                        {
                            QueryAES.FileDecrypt(url, url1);
                            byte[] bytes = System.IO.File.ReadAllBytes(url1);
                            string actualfile = Convert.ToBase64String(bytes);
                            File.Delete(url1);
                            var result = new { Data = actualfile, ModifyDate = lastmodified };
                            return Ok(result);
                        }
                        catch (Exception er)
                        {
                            return Ok(er.Message);
                        }
                    }
                    else if (File.Exists(urloffice))
                    {
                        var tempdirname = Path.GetDirectoryName(urloffice);
                        var tempfilename = Path.GetFileName(urloffice);
                        tempfilename = "__SYnc__" + tempfilename;
                        var urloffice1 = tempdirname + "\\" + tempfilename;
                        try
                        {
                            File.Delete(urloffice1);
                        }
                        catch (Exception ee)
                        {

                        }
                        DateTime lastmodified = DateTime.Now;
                        lastmodified = File.GetLastWriteTime(urloffice);
                        try
                        {
                            QueryAES.FileDecrypt(urloffice, urloffice1);
                            byte[] bytes = System.IO.File.ReadAllBytes(urloffice1);
                            string actualfile = Convert.ToBase64String(bytes);
                            File.Delete(urloffice1);
                            var result = new { Data = actualfile, ModifyDate = lastmodified };
                            return Ok(result);
                        }
                        catch (Exception er)
                        {
                            return Ok(er.Message);
                        }
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
