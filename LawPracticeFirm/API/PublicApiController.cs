using DataAccess.Modals;
using LawPracticeFirm.Common;
using QueryStringEDAES;
using System;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace LawPracticeFirm.API
{
    public class PublicApiController : BaseFirmApiController
    {
        private LawPracticeEntities db1 = new LawPracticeEntities();

        /// <summary>
        /// Load Common Dropdown
        /// </summary>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadCommonDropdown()
        {
            try
            {
                string dropdownname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["dropdownname"]);
                var cmatter = db1.usp_GetCommonDropdownData(dropdownname,null,null).OrderBy(x=>x.Sequence).ToList();
                return Ok(cmatter);
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }
        /// <summary>
        /// Generate Captcha
        /// </summary>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult GenerateCaptcha()
        {
            string text = GenerateRandomCode();
            return Ok(text);
        }
        /// <summary>
        /// Generate Random Code
        /// </summary>
        /// <returns></returns>
        public static string GenerateRandomCode()
        {
            Random random = new Random();
            string s = "";
            for (int i = 0; i < 6; i++)
                s = String.Concat(s, random.Next(10).ToString());
            return s;
        }
    }
}