using BussinessLogic.Common;
using DataAccess.Modals;
using LawPracticeFirm.Common;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Mvc;

namespace LawPracticeFirm.Controllers
{
    public class EnquiryController : BaseFirmController
    {
        // GET: Enquiry
        public ActionResult Index()
        {
            return View();
        }

        [System.Web.Mvc.HttpPost]
        public JsonResult SaveEnquiry()
        {
            try
            {
                var db = new LawPracticeEntities();
                string name = "", companyname = "", remail = "", rcontact = "", message = "", city = "", Source = "";
                DateTime date;
                name = Convert.ToString(QueryAES.UrlDecode(Request.Form["name"]));
                companyname = Convert.ToString(QueryAES.UrlDecode(Request.Form["companyname"]));
                rcontact = Convert.ToString(QueryAES.UrlDecode(Request.Form["rcontact"]));
                message = Convert.ToString(QueryAES.UrlDecode(Request.Form["message"]));
                remail = Convert.ToString(QueryAES.UrlDecode(Request.Form["remail"]));
                Source = Convert.ToString(QueryAES.UrlDecode(Request.Form["Source"]));
                var OrganisationTypes = QueryAES.UrlDecode(Request.Form["OrganisationTypes"]);
                var Hearabout = QueryAES.UrlDecode(Request.Form["Hearabout"]);
                var ddates = QueryAES.UrlDecode(Request.Form["ddate"]);
                if (String.IsNullOrEmpty(ddates))
                {
                    ddates = "1900-01-01";
                }
                else
                {
                    ddates = QueryAES.UrlDecode(Request.Form["ddate"]);
                }

                date = Convert.ToDateTime(ddates);
                string timeslot = Convert.ToString(QueryAES.UrlDecode(Request.Form["timeslot"]).Replace("null", ""));
                string sitetype = Convert.ToString(QueryAES.UrlDecode(Request.Form["site"]));
                city = Convert.ToString(QueryAES.UrlDecode(Request.Form["city"]));
                var ct = db.sp_AddMyKaseEnquiry(name, companyname, rcontact, remail, message, Convert.ToInt32(sitetype), date, timeslot, city, 0, Source, Hearabout);
                string strfilename = "";
                if (ct >= 1)
                {
                    try
                    {
                        if (ddates != "1900-01-01")
                        {
                            strfilename = "mykase_demo_" + DateTime.Now.Ticks.ToString();
                            string strSchrdate = Convert.ToDateTime(ddates).ToString("yyyyMMdd");
                            var createpath = Server.MapPath("/" + System.Web.Configuration.WebConfigurationManager.AppSettings["Demoicspath"].ToString() + "/");
                            if (!Directory.Exists(createpath))
                            {
                                Directory.CreateDirectory(createpath);
                            }
                            string path = Server.MapPath("/" + System.Web.Configuration.WebConfigurationManager.AppSettings["Demoicspath"].ToString() + "/" + strfilename + ".ics");
                            FileStream fs = new FileStream(path, FileMode.OpenOrCreate);
                            StreamWriter sw = new StreamWriter(fs);
                            sw.WriteLine("BEGIN:VCALENDAR");
                            sw.WriteLine("VERSION:2.0");
                            sw.WriteLine("PRODID:-//hacksw/handcal//NONSGML v1.0//EN");
                            sw.WriteLine("BEGIN:VEVENT");
                            if (ddates != "1900-01-01")
                            {
                                if (timeslot != "" && timeslot != "Select")
                                {
                                    string starttime = timeslot.Replace(":", "").Substring(0, 4);
                                    string endtime = timeslot.Replace(":", "").Substring(5, 4);
                                    sw.WriteLine("DTSTART:" + strSchrdate + "T" + starttime + "000Z");
                                    sw.WriteLine("DTEND:" + strSchrdate + "T" + endtime + "000Z");
                                }
                                else
                                {
                                    sw.WriteLine("DTSTART:" + strSchrdate + "T0000000Z");
                                    sw.WriteLine("DTEND:" + strSchrdate + "T0000000Z");
                                }
                            }

                            sw.WriteLine("SUMMARY: myKase demo scheduled");
                            sw.WriteLine("DESCRIPTION:myKase demo scheduled on " + ddates + " " + System.Web.Configuration.WebConfigurationManager.AppSettings["SiteUrl"].ToString() + "");
                            sw.WriteLine("LOCATION: " + city + "");
                            sw.WriteLine("END:VEVENT");
                            sw.WriteLine("BEGIN:VEVENT");
                            sw.Close();
                            fs.Close();
                            fs.Dispose();
                        }

                        CommomUtility objmail = new CommomUtility();
                        string DemoMail = System.Web.Configuration.WebConfigurationManager.AppSettings["DemoMail"].ToString();
                        string DemoMailAdmin = System.Web.Configuration.WebConfigurationManager.AppSettings["DemoMailAdmin"].ToString();
                        string fromemail = System.Web.Configuration.WebConfigurationManager.AppSettings["fromemail"].ToString();
                        DemoMail = DemoMail.Replace("#NAME#", name);
                        objmail.SendEmail(fromemail, remail, "", "", "Demo of myKase - Law Practice Management Platform", DemoMail, null);
                        string strbody = "";
                        strbody += "Please find the below detail for myKase demo request:<br><br>";
                        strbody += "Name : " + name + "<br>";
                        strbody += "Company Name : " + companyname + "<br>";
                        strbody += "Contact : " + rcontact + "<br>";
                        strbody += "Email ID : " + remail + "<br>";
                        strbody += "Date : " + ddates.Replace("1900-01-01", "") + "<br>";
                        strbody += "Time Slot : " + timeslot + "<br>";
                        strbody += "City : " + city + "<br>";
                        if (!String.IsNullOrEmpty(Source))
                        {
                            strbody += "Source : " + Source + "<br>";
                        }
                        if (!String.IsNullOrEmpty(Hearabout))
                        {
                            strbody += "How did you hear about MyKase : " + Hearabout + "<br>";
                        }
                        try
                        {
                            var data = db.usp_GetCommonDropdownData("Organisation_Type", null, null).Where(x => x.iid == Convert.ToInt32(OrganisationTypes)).FirstOrDefault();
                            strbody += "Organisation Type : " + data.Name + "<br>";
                        }
                        catch
                        {
                        }
                        strbody += "Message : " + message + "<br><br><br>";
                        strbody += "Thank You<br>Team MyKase";
                        if (strfilename == "")
                            objmail.SendEmail(fromemail, DemoMailAdmin, "", "", "myKase demo request", strbody, null);
                        else
                            objmail.SendEmail(fromemail, DemoMailAdmin, "", "", "myKase demo request", strbody, Server.MapPath("/" + System.Web.Configuration.WebConfigurationManager.AppSettings["Demoicspath"].ToString() + "/" + strfilename + ".ics"));
                    }
                    catch { }
                    TempData["filename"] = strfilename;
                    return Json("success", JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json("failed", JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }


        /// <summary>
        /// Fill timeslot
        /// </summary>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        public JsonResult FillTimeSlot()
        {
            List<sp_GetMyKaseEnquiryTimeSlot3_Result> list = new List<sp_GetMyKaseEnquiryTimeSlot3_Result>();
            if (QueryAES.UrlDecode(Request.Form["ddate"]) != "")
            {
                var db = new LawPracticeEntities();
                DateTime date = Convert.ToDateTime(QueryAES.UrlDecode(Request.Form["ddate"]));
                list = db.sp_GetMyKaseEnquiryTimeSlot3(date).ToList();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(list, JsonRequestBehavior.AllowGet);
            }

        }
        /// <summary>
        /// Save new demo enquiry
        /// </summary>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        public JsonResult SaveDemoEnquiryNew()
        {
            try
            {
                var db = new LawPracticeEntities();
                string name = "", product = "", remail = "", rcontact = "", message = "", city = "", Source = "";
                DateTime date;
                name = Convert.ToString(QueryAES.UrlDecode(Request.Form["name"]));
                product = Convert.ToString(QueryAES.UrlDecode(Request.Form["product"]));
                rcontact = Convert.ToString(QueryAES.UrlDecode(Request.Form["rcontact"]));
                remail = Convert.ToString(QueryAES.UrlDecode(Request.Form["remail"]));
                Source = Convert.ToString(QueryAES.UrlDecode(Request.Form["Source"]));
                city = Convert.ToString(QueryAES.UrlDecode(Request.Form["city"]));
                var ct = db.sp_AddMyKaseDemoEnquiryNew(name, product, rcontact, remail, city, Source);
                string strfilename = "";
                if (ct >= 1)
                {
                    try
                    {

                        CommomUtility objmail = new CommomUtility();
                        string DemoMail = System.Web.Configuration.WebConfigurationManager.AppSettings["DemoMail"].ToString();
                        string DemoMailAdmin = System.Web.Configuration.WebConfigurationManager.AppSettings["DemoMailAdmin"].ToString();
                        string fromemail = System.Web.Configuration.WebConfigurationManager.AppSettings["fromemail"].ToString();
                        DemoMail = DemoMail.Replace("#NAME#", name);
                        objmail.SendEmail(fromemail, remail, "", "", "Demo of myKase - Law Practice Management Platform", DemoMail, null);
                        string strbody = "";
                        strbody += "Please find the below detail for myKase demo request:<br><br>";
                        strbody += "Name : " + name + "<br>";
                        if (!String.IsNullOrEmpty(product))
                        {
                            strbody += "Product: " + product + "<br>";
                        }
                        strbody += "Contact : " + rcontact + "<br>";
                        strbody += "Email ID : " + remail + "<br>";
                        strbody += "DateTime : " + DateTime.Now.ToString() + "<br>";
                        if (!String.IsNullOrEmpty(product))
                        {
                            strbody += "City : " + city + "<br>";
                        }
                        if (!String.IsNullOrEmpty(Source))
                        {
                            strbody += "Source : " + Source + "<br>";
                        }
                        strbody += "<br><br>Thank You<br>Team MyKase";
                        objmail.SendEmail(fromemail, DemoMailAdmin, "", "", "myKase demo request", strbody, null);
                    }
                    catch { }
                    TempData["filename"] = strfilename;
                    return Json("success", JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json("failed", JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }

    }
}