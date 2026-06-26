using LawPracticeFirm.Common;
using QueryStringEDAES;
using System;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace LawPracticeFirm.API
{
    public class FileValidateApiController : BaseFirmApiController
    {
        
        /// <summary>
        /// File validate responder
        /// </summary>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult FileValidateResponder()
        {
            try
            {
                dynamic streams = "";
                string urloffice = "";
                var url = Request.Headers.GetValues("filepath").FirstOrDefault();
               
                var token = Request.Headers.GetValues("token").FirstOrDefault();
                var mode = Request.Headers.GetValues("mode").FirstOrDefault();
                url = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(url));
                
                token = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(token));
                mode = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(mode));
                if(mode.ToString()=="File") //for file sync 
                {
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
                            var result = new { Data = url, ModifyDate = lastmodified };
                            return Ok(result);
                        }
                        if (File.Exists(urloffice))
                        {
                            DateTime lastmodified = DateTime.Now;
                            lastmodified = File.GetLastWriteTime(urloffice);
                            var result = new { Data = urloffice, ModifyDate = lastmodified };
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
                if (mode.ToString() == "Data") //for data sync   
                {
                    if (token.ToString() == "MyKAselawPractice9852187@25125412")
                    {
                        url = HttpContext.Current.Server.MapPath("//" + url);
                        if (File.Exists(url))
                        {
                            DateTime lastmodified = DateTime.Now;
                            lastmodified = File.GetLastWriteTime(url);
                            var result = new { Data = url, ModifyDate = lastmodified };
                            return Ok(result);
                        }
                        else
                        {
                            var result = new { Data = "", ModifyDate ="" };
                            return Ok(result);
                        }
                    }
                    else
                    {
                        return Ok("invalid token");
                    }
                }
                return Ok("invalid Request");
            }
            catch(Exception ad)
            {
                return Ok(ad.Message);
            }
       }
    }
}
