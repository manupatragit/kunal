using BussinessLogic;
using DataAccess.Modals;
using iTextSharp.text;
using iTextSharp.text.pdf;
using LawPracticeFirm.Common;
using LawPracticeFirm.CustomFIlter;
using LawPracticeFirm.Models;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;

namespace LawPracticeFirm.Controllers
{
    public class PDFMergeController : BaseFirmController
    {
        LawPracticeEntities db = new LawPracticeEntities();
        string finalpdf = "Combine_" + DateTime.Now.Ticks.ToString() + ".pdf";
        string strIndexpage = "IndexPage_" + DateTime.Now.Ticks.ToString() + ".html";
        string path = WebConfigurationManager.AppSettings["PDFMergePath"];
        /// <summary>
        /// Merge PDF file
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult PDFMerge()
        {
            path = Server.MapPath(path + "\\" + LoggedInUser.UserId.ToString());
            if (!Directory.Exists(path))
            {
                //If Directory (Folder) does not exists. Create it.
                Directory.CreateDirectory(path);
            }
            return View();
        }
        /// <summary>
        /// Merge pdf list details
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult PDFMergeList()
        {
            return View();
        }
        /// <summary>
        /// Merge PDF view
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public ActionResult PDFMergeView()
        {
            return View();
        }
        /// <summary>
        /// Save pdf path
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public string savedpath()
        {
            path = Server.MapPath(path + "\\" + Session["sessionuserid"]);
            if (!Directory.Exists(path))
            {
                //If Directory (Folder) does not exists. Create it.
                Directory.CreateDirectory(path);
            }
            return path.ToString() + "\\";
        }
        /// <summary>
        /// Upload pdf document
        /// </summary>
        /// <param name="fileData"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult Upload(List<HttpPostedFileBase> fileData)
        {
            string fileName = "";
            try
            {
                path = savedpath();
                StringBuilder sb = new StringBuilder();
                sb.Clear();
                var builder = new System.Text.StringBuilder();
                List<string> filelist = new List<string>();
                string path1 = path;// Server.MapPath(path);//Server.MapPath("~/Uploads/");
                var httpRequest = System.Web.HttpContext.Current.Request;
                if (httpRequest.Files.Count > 0)
                {
                    for (int i = 0; i < httpRequest.Files.Count; i++)
                    {
                        var postedFile = httpRequest.Files[i];
                        if (postedFile != null)
                        {
                            fileName = Path.GetFileName(postedFile.FileName);
                            fileName = HttpUtility.UrlDecode(fileName);
                            fileName = ReplaceSpecialChar(fileName);
                            if (System.IO.File.Exists(path1 + fileName))
                                System.IO.File.Delete(path1 + fileName);
                            var fileextchk = Path.GetExtension(postedFile.FileName);
                            var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);
                            postedFile.SaveAs(path1 + fileName);
                        }
                    }
                }
            }
            catch
            {
            }
            return Content(fileName);
        }
        /// <summary>
        /// Upload pdf in drive
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [AuthLog(Roles = "Firm,User,Client")]
        public JsonResult UploadDrive()
        {
            try
            {
                List<string> filelistBundle = new List<string>();
                List<string> filelistBundleFullPath = new List<string>();
                var path = "";
                //get total file count
                var savemykasefileid = QueryAES.UrlDecode(Request.Form["savemykasefileid"]);
                if (!String.IsNullOrEmpty(savemykasefileid))
                {
                    savemykasefileid = savemykasefileid.TrimEnd(',').TrimStart(',');
                    string[] values = savemykasefileid.Split(',');
                    int dynamicattachlength = Convert.ToInt32(values.Length);
                    if (dynamicattachlength > 25)
                    {
                        return Json(new { Result = "FileAttachExceed" }, JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    return Json(new { Result = "NoFileAttach" }, JsonRequestBehavior.AllowGet);
                }
                path = savedpath();
                StringBuilder sb = new StringBuilder();
                sb.Clear();
                var builder = new System.Text.StringBuilder();
                string path1 = path;// Server.MapPath(path);//Server.MapPath("~/Uploads/");
                var httpRequest = System.Web.HttpContext.Current.Request;
                if (!String.IsNullOrEmpty(savemykasefileid))
                {
                    var filelist = SaveMykaseDocument.SaveMykaseDocumentToOtherModule(savemykasefileid, "bundle", LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), "1");
                    if (!String.IsNullOrEmpty(filelist))
                    {
                        string[] values2 = filelist.Split('|');
                        for (int j = 0; j < values2.Length; j++)
                        {
                            //get file physical path
                            values2[j] = values2[j].Trim();
                            var fileName = Path.GetFileNameWithoutExtension(values2[j]);
                            var fileext = Path.GetExtension(values2[j]);
                            string[] stringArray = { ".PDF" };
                            string value = fileext.ToUpper();
                            int pos = Array.IndexOf(stringArray, value);
                            if (pos > -1)
                            {
                            }
                            else
                            {
                                try
                                {
                                    System.IO.File.Delete(values2[j]);
                                }
                                catch
                                {
                                }
                                for (int i = 0; i < filelistBundleFullPath.Count(); i++)
                                {
                                    var result = filelistBundleFullPath[i];
                                    try
                                    {
                                        if (System.IO.File.Exists(result))
                                            System.IO.File.Delete(result);
                                    }
                                    catch
                                    {
                                    }
                                }
                                return Json(new { Result = "ExtentionNotAllowed" }, JsonRequestBehavior.AllowGet);
                            }
                            //check file size
                            FileInfo info = new FileInfo(values2[j]);
                            long length = info.Length;
                            //Convert to KB
                            var finalfilelengthKb = length / 1024;
                            if (finalfilelengthKb > 20480)
                            {
                                try
                                {
                                    System.IO.File.Delete(values2[j]);
                                }
                                catch
                                {
                                }
                                for (int i = 0; i < filelistBundleFullPath.Count(); i++)
                                {
                                    var result = filelistBundleFullPath[i];
                                    try
                                    {
                                        if (System.IO.File.Exists(result))
                                            System.IO.File.Delete(result);
                                    }
                                    catch
                                    {
                                    }
                                }
                                return Json(new { Result = "FileSizeExceed" }, JsonRequestBehavior.AllowGet);
                            }
                            fileName = ReplaceSpecialChar(fileName);
                            var fileName1 = fileName + fileext;
                            var filePath = path + Path.GetFileName(fileName1); //HttpContext.Current.Server.MapPath(+ postedFile.FileName);
                            if (System.IO.File.Exists(filePath))
                                System.IO.File.Delete(filePath);
                            System.IO.File.Copy(values2[j], filePath, true);
                            filelistBundle.Add(fileName1);
                            filelistBundleFullPath.Add(filePath);
                        }
                        return Json(new { Result = filelistBundle }, JsonRequestBehavior.AllowGet);
                    }
                }
            }
            catch (Exception es)
            {
                return Json(new { Result = "" }, JsonRequestBehavior.AllowGet);
            }
            return Json(new { Result = "" }, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Replace special character
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        protected string ReplaceSpecialChar(string input)
        {
            string[] replaceables = new[] { @"\", "|", "!", "#", "%", "&", "/", "=", "?", "»", "«", "@", "£", "§", "€", "{", "}", ";", "'", "<", ">", ",", "`", " " };
            string rxString = string.Join("|", replaceables.Select(s => Regex.Escape(s)));
            return Regex.Replace(input, rxString, "_");
        }
        /// <summary>
        /// Generate PDF details
        /// </summary>
        /// <returns></returns>
        [ValidateInput(false)]
        [AuthLog(Roles = "Firm,User,Client")]
        public JsonResult GeneratePDF()
        {
            path = savedpath();
            var filesizemerge = QueryAES.UrlDecode(Request.Form["filesize"]);
            var struserfilename = QueryAES.UrlDecode(Request.Form["filename"]);
            string strIndexpagepdf = strIndexpage.Replace(".html", ".pdf");
            string[] filename = (strIndexpagepdf + "," + QueryAES.UrlDecode(Request.Form["id"]).ToString()).Split(',');
            int totpage = 1;
            string strcontent = "";
            int noofpages = 1;
            int start = 0;
            int prenoofpages = 1;
            string strtable = "<table style=\"margin:0 auto; width:100%\"><tr><td style=\"text-align:center;font-weight:bold\" colspan =\"3\">INDEX</td></tr>";
            string strtr = "";
            for (int i = 1; i < filename.Length; i++)
            {
                string fname = filename[i];
                if (fname != "")
                {
                    if (IsValidPdf(path + fname))
                    {
                        PdfReader reader = new PdfReader(path + fname);
                        reader.ConsolidateNamedDestinations();
                        noofpages += reader.NumberOfPages;
                        start = prenoofpages + 1;
                        prenoofpages = noofpages;
                        fname = fname.Substring(fname.LastIndexOf("\\") + 1);
                        fname = fname.Substring(0, fname.ToLower().LastIndexOf(".pdf"));
                        strtr += "<tr><td style=\"text-align:left;width:50%;word-wrap:break-word;\">" + fname + "</td><td style=\"text-align:left;width:30%\">   -----------  </td><td style=\"text-align:left;;width:20%\">" + start.ToString() + " - " + noofpages.ToString() + "</td></tr>";
                        //strcontent += fname + "     --------------------------------------------- ---------------------------------------------          " + start.ToString() + " - " + noofpages.ToString();
                    }
                }
            }
            strtable = strtable + strtr + "</table>";
            var pdfindex = WebConfigurationManager.AppSettings["PDFMergehtml"];
            if (System.IO.File.Exists(Server.MapPath(pdfindex + strIndexpage)))
                System.IO.File.Delete(Server.MapPath(pdfindex + strIndexpage));
            System.IO.File.WriteAllText(Server.MapPath(pdfindex + strIndexpage), strtable);
            var input = Server.MapPath(pdfindex + strIndexpage);
            var pdfindexpdf = WebConfigurationManager.AppSettings["PDFMergefinal"];
            var output = Server.MapPath(pdfindexpdf + strIndexpagepdf);
            var outd = ConvertHtmlToPdf(input, output);
            string strfinalpdfpath = WebConfigurationManager.AppSettings["PDFMergefinal"] + Session["sessionfirmid"] + "\\" + Session["sessionuserid"] + "\\";
            if (!Directory.Exists(Server.MapPath(strfinalpdfpath)))
            {
                Directory.CreateDirectory(Server.MapPath(strfinalpdfpath));
            }
            CombineMultiplePDFs(filename, Server.MapPath(strfinalpdfpath) + finalpdf);
            if (filesizemerge == "0")
            {
                string strfinalfilename = "Final_" + finalpdf.Replace("Combine", "");
                string strfinalfilenamefinal = "FinalA4_" + finalpdf.Replace("Combine", "");
                PdfStamping(Server.MapPath(strfinalpdfpath) + finalpdf, strfinalpdfpath + strfinalfilename);
                System.IO.File.Copy(Server.MapPath(strfinalpdfpath) + "\\" + strfinalfilename, Server.MapPath(strfinalpdfpath) + "\\" + strfinalfilenamefinal);
                ScaleToA4(Server.MapPath(strfinalpdfpath) + "\\" + strfinalfilename, Server.MapPath(strfinalpdfpath) + "\\" + strfinalfilenamefinal);
                PdfReader reader = new PdfReader(Server.MapPath(strfinalpdfpath + "\\" + strfinalfilenamefinal));
                var straff = db.usp_InsertPdfBundling(struserfilename, reader.NumberOfPages, LoggedInUser.UserId.ToString(), strfinalpdfpath + "\\" + strfinalfilenamefinal, strfinalfilenamefinal, filesizemerge);
                return Json(new { Result = "SUCCESS", Message = strtable, FileName = strfinalpdfpath + strfinalfilenamefinal }, JsonRequestBehavior.AllowGet);
            }
            else if (filesizemerge == "1")
            {
                string strfinalfilename = "Final_" + finalpdf.Replace("Combine", "");
                string strfinalfilenamefinal = "FinalLegal_" + finalpdf.Replace("Combine", "");
                PdfStamping(Server.MapPath(strfinalpdfpath) + finalpdf, strfinalpdfpath + strfinalfilename);
                System.IO.File.Copy(Server.MapPath(strfinalpdfpath) + "\\" + strfinalfilename, Server.MapPath(strfinalpdfpath) + "\\" + strfinalfilenamefinal);
                ScaleToLEGAL(Server.MapPath(strfinalpdfpath) + "\\" + strfinalfilename, Server.MapPath(strfinalpdfpath) + "\\" + strfinalfilenamefinal);
                PdfReader reader = new PdfReader(Server.MapPath(strfinalpdfpath + "\\" + strfinalfilenamefinal));
                var straff = db.usp_InsertPdfBundling(struserfilename, reader.NumberOfPages, LoggedInUser.UserId.ToString(), strfinalpdfpath + "\\" + strfinalfilenamefinal, strfinalfilenamefinal, filesizemerge);
                return Json(new { Result = "SUCCESS", Message = strtable, FileName = strfinalpdfpath + strfinalfilenamefinal }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                string strfinalfilename = "Final_" + finalpdf.Replace("Combine", "");
                PdfStamping(Server.MapPath(strfinalpdfpath) + finalpdf, strfinalpdfpath + strfinalfilename);
                PdfReader reader = new PdfReader(Server.MapPath(strfinalpdfpath + "\\" + strfinalfilename));
                var straff = db.usp_InsertPdfBundling(struserfilename, reader.NumberOfPages, LoggedInUser.UserId.ToString(), strfinalpdfpath + "\\" + strfinalfilename, strfinalfilename, filesizemerge);
                return Json(new { Result = "SUCCESS", Message = strtable, FileName = strfinalpdfpath + strfinalfilename }, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// Generate pdf after edit index
        /// </summary>
        /// <returns></returns>
        [ValidateInput(false)]
        [AuthLog(Roles = "Firm,User,Client")]
        public JsonResult GeneratePDFAfterEditIndex()
        {
            path = savedpath();
            var struserfilename = QueryAES.UrlDecode(Request.Form["filename"]);
            var filesizemerge = QueryAES.UrlDecode(Request.Form["filesize"]);
            string strIndexpagepdf = strIndexpage.Replace(".html", ".pdf");
            string[] filename1 = (strIndexpagepdf + "," + QueryAES.UrlDecode(Request.Form["id"]).ToString()).Split(',');
            string strtxt = QueryAES.UrlDecode(Request.Form["txt"]);
            int totpage1 = 1;
            var pdfindex = WebConfigurationManager.AppSettings["PDFMergehtml"];
            System.IO.File.WriteAllText(Server.MapPath(pdfindex + strIndexpage), strtxt.Trim());
            var input = Server.MapPath(pdfindex + strIndexpage);
            var pdfindexpdf = WebConfigurationManager.AppSettings["PDFMergefinal"];
            var output = Server.MapPath(pdfindexpdf + strIndexpagepdf);
            var outd = ConvertHtmlToPdf(input, output);
            string strfinalpdfpath = WebConfigurationManager.AppSettings["PDFMergefinal"] + Session["sessionfirmid"] + "\\" + Session["sessionuserid"] + "\\";
            if (!Directory.Exists(Server.MapPath(strfinalpdfpath)))
            {
                Directory.CreateDirectory(Server.MapPath(strfinalpdfpath));
            }
            string strerrmsg = CombineMultiplePDFs(filename1, Server.MapPath(strfinalpdfpath) + finalpdf);
            if (filesizemerge == "0")
            {
                string strfinalfilename = "Final_" + finalpdf.Replace("Combine", "");
                string strfinalfilenamefinal = "FinalA4_" + finalpdf.Replace("Combine", "");
                PdfStamping(Server.MapPath(strfinalpdfpath) + finalpdf, strfinalpdfpath + strfinalfilename);
                System.IO.File.Copy(Server.MapPath(strfinalpdfpath) + "\\" + strfinalfilename, Server.MapPath(strfinalpdfpath) + "\\" + strfinalfilenamefinal);
                ScaleToA4(Server.MapPath(strfinalpdfpath) + "\\" + strfinalfilename, Server.MapPath(strfinalpdfpath) + "\\" + strfinalfilenamefinal);
                if (strerrmsg == "")
                {
                    PdfReader reader = new PdfReader(Server.MapPath(strfinalpdfpath + "\\" + strfinalfilenamefinal));
                    var straff = db.usp_InsertPdfBundling(struserfilename, reader.NumberOfPages, LoggedInUser.UserId.ToString(), strfinalpdfpath + "\\" + strfinalfilenamefinal, strfinalfilenamefinal, "10");
                    return Json(new { Result = "SUCCESS", Message = strtxt.Trim(), FileName = strfinalpdfpath + strfinalfilenamefinal }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { Result = "ERROR", Message = strerrmsg.Trim(), FileName = strfinalpdfpath + strfinalfilenamefinal }, JsonRequestBehavior.AllowGet);
                }
            }
            else if (filesizemerge == "1")
            {
                string strfinalfilename = "Final_" + finalpdf.Replace("Combine", "");
                string strfinalfilenamefinal = "FinalLegal_" + finalpdf.Replace("Combine", "");
                PdfStamping(Server.MapPath(strfinalpdfpath) + finalpdf, strfinalpdfpath + strfinalfilename);
                System.IO.File.Copy(Server.MapPath(strfinalpdfpath) + "\\" + strfinalfilename, Server.MapPath(strfinalpdfpath) + "\\" + strfinalfilenamefinal);
                ScaleToLEGAL(Server.MapPath(strfinalpdfpath) + "\\" + strfinalfilename, Server.MapPath(strfinalpdfpath) + "\\" + strfinalfilenamefinal);
                if (strerrmsg == "")
                {
                    PdfReader reader = new PdfReader(Server.MapPath(strfinalpdfpath + "\\" + strfinalfilenamefinal));
                    var straff = db.usp_InsertPdfBundling(struserfilename, reader.NumberOfPages, LoggedInUser.UserId.ToString(), strfinalpdfpath + "\\" + strfinalfilenamefinal, strfinalfilenamefinal, "10");
                    return Json(new { Result = "SUCCESS", Message = strtxt.Trim(), FileName = strfinalpdfpath + strfinalfilenamefinal }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { Result = "ERROR", Message = strerrmsg.Trim(), FileName = strfinalpdfpath + strfinalfilenamefinal }, JsonRequestBehavior.AllowGet);
                }
            }
            else
            {
                string strfinalfilename = "Final_" + finalpdf.Replace("Combine", "");
                PdfStamping(Server.MapPath(strfinalpdfpath) + finalpdf, strfinalpdfpath + strfinalfilename);
                if (strerrmsg == "")
                {
                    PdfReader reader = new PdfReader(Server.MapPath(strfinalfilename + "\\" + strfinalfilename));
                    var straff = db.usp_InsertPdfBundling(struserfilename, reader.NumberOfPages, LoggedInUser.UserId.ToString(), strfinalfilename + "\\" + strfinalfilename, strfinalfilename, "10");
                    return Json(new { Result = "SUCCESS", Message = strtxt.Trim(), FileName = strfinalfilename + strfinalfilename }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { Result = "ERROR", Message = strerrmsg.Trim(), FileName = strfinalpdfpath + strfinalfilename }, JsonRequestBehavior.AllowGet);
                }
            }
        }
        /// <summary>
        /// Combine multiple pdf file
        /// </summary>
        /// <param name="fileNames"></param>
        /// <param name="outFile"></param>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public string CombineMultiplePDFs(string[] fileNames, string outFile)
        {
            String errMsg = "";
            using (FileStream stream = new FileStream(outFile, FileMode.OpenOrCreate))
            using (Document doc = new Document())
            using (PdfCopy pdf = new PdfCopy(doc, stream))
            {
                doc.Open();
                PdfReader reader = null;
                PdfImportedPage page = null;
                foreach (string fileName in fileNames)
                {
                    if (fileName != "")
                    {
                        if (fileName.IndexOf("IndexPage_") > -1)
                        {
                            path = Server.MapPath(WebConfigurationManager.AppSettings["PDFMergefinal"]);
                        }
                        else
                        {
                            path = Server.MapPath(WebConfigurationManager.AppSettings["PDFMergePath"] + "\\" + LoggedInUser.UserId.ToString());
                        }
                        try
                        {
                            reader = new PdfReader(path + "\\" + fileName);
                            for (int i = 0; i < reader.NumberOfPages; i++)
                            {
                                page = pdf.GetImportedPage(reader, i + 1);
                                pdf.AddPage(page);
                            }
                            pdf.FreeReader(reader);
                            reader.Close();
                        }
                        catch (Exception e)
                        {
                            errMsg = errMsg + fileName + "  " + e.Message + "<br>";
                        }
                    }
                }
                doc.Close();
            }
            return errMsg;
        }
        /// <summary>
        /// Convert HTML to pdf
        /// </summary>
        /// <param name="infile"></param>
        /// <param name="outfile"></param>
        /// <returns></returns>
        private string ConvertHtmlToPdf(string infile, string outfile)
        {
            System.Type VeryPDFType = System.Type.GetTypeFromProgID("VeryPDFCom.RunCmd");
            return outfile;
        }
        /// <summary>
        /// Generate pdf file index
        /// </summary>
        /// <param name="fileNames"></param>
        /// <param name="outFile"></param>
        public void GenerateIndex(string[] fileNames, string outFile)
        {
            string path = Server.MapPath(WebConfigurationManager.AppSettings["PDFMergePath"] + "\\" + LoggedInUser.UserId.ToString());
            string strIndexpagepdf = strIndexpage.Replace(".html", ".pdf");
            string[] filename = (strIndexpagepdf + "," + QueryAES.UrlDecode(Request.Form["id"]).ToString()).Split(',');
            int totpage = 1;
            string strcontent = "";
            int noofpages = 1;
            int start = 0;
            int prenoofpages = 1;
            string strtable = "<table style=\"margin:0 auto; width:100%\"><tr><td style=\"text-align:center;font-weight:bold\" colspan =\"3\">INDEX</td></tr>";
            string strtr = "";
            for (int i = 1; i < filename.Length; i++)
            {
                string fname = filename[i];
                if (fname != "")
                {
                    //string outFile;
                    FileStream stream = new FileStream(path + "\\" + fname, FileMode.Open);
                    Document doc = new Document();
                    using (PdfCopy pdf = new PdfCopy(doc, stream))
                    {
                        doc.Open();
                        PdfReader reader = null;
                        PdfImportedPage page = null;
                        try
                        {
                            reader = new PdfReader(path + "\\" + fname);
                            for (int j = 0; j < reader.NumberOfPages; j++)
                            {
                                page = pdf.GetImportedPage(reader, j + 1);
                                pdf.AddPage(page);
                            }
                            pdf.FreeReader(reader);
                            reader.Close();
                        }
                        catch (Exception e)
                        {
                            //  noofpages = 0;
                        }
                    }
                    start = prenoofpages + 1;
                    prenoofpages = noofpages;
                    fname = fname.Substring(fname.LastIndexOf("\\") + 1);
                    fname = fname.Substring(0, fname.LastIndexOf(".pdf"));
                    strtr += "<tr><td style=\"text-align:left;width:30%\">" + fname + "</td><td style=\"text-align:left;width:50%\">   --------------------------------------------------------   </td><td style=\"text-align:left\">" + start.ToString() + " - " + noofpages.ToString() + "</td></tr>";
                    strcontent += fname + "    ------------------------------------------------------------------          " + start.ToString() + " - " + noofpages.ToString();
                }
            }
            strtable = strtable + strtr + "</table>";
            var pdfindex = WebConfigurationManager.AppSettings["PDFMergefinal"];
            if (System.IO.File.Exists(Server.MapPath(pdfindex + strIndexpage)))
                System.IO.File.Delete(Server.MapPath(pdfindex + strIndexpage));
            System.IO.File.WriteAllText(Server.MapPath(pdfindex + strIndexpage), strtable);
            var input = Server.MapPath(pdfindex + strIndexpage);
            var pdfindexpdf = WebConfigurationManager.AppSettings["PDFMergefinal"];
            var output = Server.MapPath(pdfindexpdf + strIndexpagepdf);
            var outd = ConvertHtmlToPdf(input, output);
            CombineMultiplePDFs(filename, Server.MapPath(WebConfigurationManager.AppSettings["PDFMergefinal"]) + finalpdf);
        }
        /// <summary>
        /// Check pdf is valid or not
        /// </summary>
        /// <param name="filepath"></param>
        /// <returns></returns>
        private bool IsValidPdf(string filepath)
        {
            bool Ret = false;
            PdfReader r = new PdfReader(filepath);
            if (PdfEncryptor.IsCopyAllowed((int)(r.Permissions)) || !r.IsEncrypted())
            {
                Ret = true;
            }
            else if (PdfEncryptor.IsAssemblyAllowed((int)(r.Permissions)) || !r.IsEncrypted())
            {
                Ret = true;
            }
            else
            {
                Ret = false;
            }
            return Ret;
        }
        /// <summary>
        /// Pdf stamping
        /// </summary>
        /// <param name="pathin"></param>
        /// <param name="filename"></param>
        public void PdfStamping(string pathin, string filename)
        {
            string pdffile = "Text";
            PdfReader pdfReader = new PdfReader(pathin);
            string pout = filename;
            String pathout = Server.MapPath(pout);
            //create PdfReader object to read from the existing document
            PdfReader reader = new PdfReader(pathin);
            PdfReader.unethicalreading = true;
            reader.SelectPages("1-" + pdfReader.NumberOfPages);
            PdfStamper stamper = new PdfStamper(reader, new FileStream(pathout, FileMode.Create));
            for (int i = 1; i <= pdfReader.NumberOfPages; i++)
            {
                iTextSharp.text.Rectangle mediabox = pdfReader.GetPageSize(i);
                float pght = mediabox.Top;
                string foo = " (Page " + i + " of " + pdfReader.NumberOfPages + ") ";
                BaseFont bf = BaseFont.CreateFont(BaseFont.COURIER_BOLD, BaseFont.WINANSI, false);
                BaseColor bc = BaseColor.BLUE;
                PdfContentByte pbover = stamper.GetOverContent(i);
                //add content to the page using ColumnText
                pbover.SetCMYKColorFill(255, 88, 70, 18);
                pbover.SetFontAndSize(bf, 10);
                pbover.MoveTo(10, 30);
                pbover.LineTo(580, 30);
                pbover.Stroke();
                //Setting the Footer line 
                ColumnText.ShowTextAligned(pbover, Element.ALIGN_CENTER, new Phrase(new Chunk(foo, FontFactory.GetFont(FontFactory.HELVETICA, 9))), 300, 10, 0);
                //Setting Pdf title on top
                PdfContentByte pbunder = stamper.GetOverContent(i);
            }
            stamper.Close();
        }
        /// <summary>
        /// Scale to legal
        /// </summary>
        /// <param name="inPDF"></param>
        /// <param name="outPDF"></param>
        public static void ScaleToLEGAL(string inPDF, string outPDF)
        {
            var reader = new PdfReader(inPDF);
            using (var doc = new Document(PageSize.LEGAL))
            {
                Document.Compress = true;
                using (
                    var writer = PdfWriter.GetInstance(doc,
                        new FileStream(outPDF, FileMode.Create)))
                {
                    doc.Open();
                    var cb = writer.DirectContent;
                    PdfImportedPage page;
                    for (var pageNumber = 1; pageNumber <= reader.NumberOfPages; pageNumber++)
                    {
                        page = writer.GetImportedPage(reader, pageNumber);
                        if (page.Width <= page.Height)
                            doc.SetPageSize(PageSize.LEGAL);
                        else
                            doc.SetPageSize(PageSize.LEGAL.Rotate());
                        doc.NewPage();
                        cb.AddTemplate(page,
                            doc.PageSize.Width / reader.GetPageSize(pageNumber).Width,
                            0, 0,
                            doc.PageSize.Height / reader.GetPageSize(pageNumber).Height,
                            0, 0);
                    }
                    doc.Close();
                }
            }
        }
        /// <summary>
        /// Scale to A4
        /// </summary>
        /// <param name="inPDF"></param>
        /// <param name="outPDF"></param>
        public static void ScaleToA4(string inPDF, string outPDF)
        {
            var reader = new PdfReader(new MemoryStream(System.IO.File.ReadAllBytes(inPDF)));
            using (var document = new Document(PageSize.A4))
            using (var ms = new MemoryStream())
            using (var writer = PdfWriter.GetInstance(document, ms))
            {
                document.Open();
                var cb = writer.DirectContent;
                for (var pageNumber = 1; pageNumber <= reader.NumberOfPages; pageNumber++)
                {
                    var page = writer.GetImportedPage(reader, pageNumber);
                    if (page.Width <= page.Height)
                        document.SetPageSize(PageSize.A4);
                    else
                        document.SetPageSize(PageSize.A4.Rotate());
                    document.NewPage();
                    var widthFactor = document.PageSize.Width / page.Width;
                    var heightFactor = document.PageSize.Height / page.Height;
                    var factor = Math.Min(widthFactor, heightFactor);
                    var offsetX = (document.PageSize.Width - (page.Width * factor)) / 2;
                    var offsetY = (document.PageSize.Height - (page.Height * factor)) / 2;
                    cb.AddTemplate(page, factor, 0, 0, factor, offsetX, offsetY);
                }
                document.Close();
                System.IO.File.WriteAllBytes(outPDF, ms.GetBuffer());
            }
        }
        /// <summary>
        /// Get pdf bundling list
        /// </summary>
        /// <returns></returns>
        [AuthLog(Roles = "Firm,User,Client")]
        public JsonResult PdfBundlingList()
        {
            List<usp_GetPdfBundling_Result> list = new List<usp_GetPdfBundling_Result>();
            string strname = QueryAES.UrlDecode(Request.Form["name"]);
            string frmdt = QueryAES.UrlDecode(Request.Form["frmdt"]);
            string todt = QueryAES.UrlDecode(Request.Form["todt"]);
            string pageno = QueryAES.UrlDecode(Request.Form["pageno"]);
            string pagesize = QueryAES.UrlDecode(Request.Form["pagesize"]);
            var userid = LoggedInUser.UserId.ToString();
            LawPracticeEntities db = new LawPracticeEntities();
            list = db.usp_GetPdfBundling(strname, userid, frmdt, todt, Convert.ToInt32(pageno), Convert.ToInt32(pagesize)).ToList();
            return Json(new { Result = list }, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Remove bundle document
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [AuthLog(Roles = "Firm,User,Client")]
        public string RemoveBundleDoc()
        {
            string firmid = Convert.ToString(LoggedInUser.FirmId.ToString());
            string userid = Convert.ToString(LoggedInUser.UserId.ToString());
            string uCGuid = Convert.ToString(QueryAES.UrlDecode(Request.Form["uCGuid"]));
            int isdelete = 1;
            using (LawPracticeEntities db = new LawPracticeEntities())
            {
                var effectedrows = db.usp_RemovePdfBundling(firmid, userid, uCGuid, isdelete);
                if (effectedrows > 0)
                {
                    return "Success";
                }
                else
                {
                    return "error";
                }
            }
        }
    }
}