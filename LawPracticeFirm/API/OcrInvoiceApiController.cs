using BussinessLogic;
using BussinessLogic.Common;
using DataAccess.Modals;
using DataAccess.Models;
using ImageMagick;
using LawPracticeFirm.Common;
using LawPracticeFirm.DAL;
using LawPracticeFirm.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using org.apache.pdfbox.pdmodel;
using org.apache.pdfbox.util;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Configuration;
using System.Web.Hosting;
using System.Web.Http;
using Tesseract;
using static LawPracticeFirm.Models.AuditData;

namespace LawPracticeFirm.API
{
    public class OcrInvoiceApiController : BaseFirmApiController
    {
        public OcrInvoiceApiController()
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
        }
        private LawPracticeEntities db1 = new LawPracticeEntities();
        public string controllername = "OcrInvoiceApiController";

        /// <summary>
        /// Save new OCR file
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult PostSaveOcrFilesNew()
        {
            int OCRCountValue = Convert.ToInt32(ConfigurationManager.AppSettings["OCRCountValue"]);
            try
            {
                var db = new LawPracticeEntities();
                var details = QueryAES.UrlDecode(HttpContext.Current.Request.Form["desc"]);
                var ocrlanguage = QueryAES.UrlDecode(HttpContext.Current.Request.Form["language"]);
                var chkSave = QueryAES.UrlDecode(HttpContext.Current.Request.Form["chkSave"]);
                var newfilename = "";
                var ocrcontent = "";
                string folderPath = HttpContext.Current.Server.MapPath("~/Documents/OcrDocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/");
                string folderpathazure = "Documents/OcrDocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId;
                //Check whether Directory (Folder) exists.
                if (!Directory.Exists(folderPath))
                {
                    //If Directory (Folder) does not exists. Create it.
                    Directory.CreateDirectory(folderPath);
                }
                var httpRequest = HttpContext.Current.Request;
                string firmids = LoggedInUser.FirmId.ToString();
                string userids = LoggedInUser.UserId.ToString();
                if (chkSave == "true")
                {
                    var ocrcount = db.usp_GetCountTblOcrFile(firmids.ToString(), userids.ToString()).SingleOrDefault();
                    if (ocrcount >= OCRCountValue)
                    {
                        return Ok("Exceed");
                    }
                }
                //get total file count
                var savemykasefileid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["savemykasefileid"]);
                if (savemykasefileid.ToString() == "undefined")
                {
                    savemykasefileid = "";
                }
                if (String.IsNullOrEmpty(savemykasefileid) && Convert.ToInt32(httpRequest.Files.Count) == 0)
                {
                    return Ok("NoFileAttach");
                }
                if (!String.IsNullOrEmpty(savemykasefileid))
                {
                    savemykasefileid = savemykasefileid.TrimEnd(',').TrimStart(',');
                    string[] values = savemykasefileid.Split(',');
                    int dynamicattachlength = Convert.ToInt32(values.Length) + Convert.ToInt32(httpRequest.Files.Count);
                    if (dynamicattachlength > 1)
                    {
                        return Ok("FileAttachExceed");
                    }
                }
                if (httpRequest.Files.Count > 0)
                {
                    for (int i = 0; i < httpRequest.Files.Count; i++)
                    {
                        var docfiles = new List<string>();
                        var postedFile = httpRequest.Files[i];
                        float size = postedFile.ContentLength;
                        //checked if already esxist
                        string extension = Path.GetExtension(postedFile.FileName);
                        string pathName = Path.GetDirectoryName(postedFile.FileName);
                        string orignialfiles = "";
                        newfilename = postedFile.FileName;
                        orignialfiles = newfilename;
                        newfilename = Path.GetFileNameWithoutExtension(newfilename);
                        string originalfilename = newfilename;
                        newfilename = Regex.Replace(newfilename, @"[^0-9a-zA-Z]+", "");
                        string fileNameOnly = Path.Combine(pathName, newfilename);
                        int it = 0;
                        string newfilename1 = "AE2bdADSAA" + newfilename + extension;
                        newfilename = newfilename + extension;
                        string fileNameOnly1 = Path.Combine(pathName, originalfilename + extension);
                        var filePath = HttpContext.Current.Server.MapPath("~/Documents/OcrDocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/" + newfilename1);
                        var tempshowpath = "/Documents/OcrDocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/" + newfilename1;
                        var fileextchk = Path.GetExtension(postedFile.FileName);
                        var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);
                        postedFile.SaveAs(filePath);
                        string input = "";
                        if (chkSave == "true")
                        {
                            input = filePath;
                            string tempfilename = originalfilename + extension;
                            while (AzureDocument.fileexist(folderpathazure, orignialfiles, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()))
                            {
                                it += 1;
                                orignialfiles = string.Format("{0}({1}).{2}", originalfilename, it, extension.TrimStart('.').TrimEnd('.'));
                            }
                            string output = HttpContext.Current.Server.MapPath("~/Documents/OcrDocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/" + tempfilename);
                            QueryAES.FileEncrypt(input, output);
                            try
                            {
                                var status = AzureDocumentself.filecreateafteredit(output, folderpathazure, Path.GetFileName(orignialfiles), null, null);
                            }
                            catch (Exception er)
                            {
                                AzureDocumentself.CreateNestedDirectory(folderpathazure);
                                var status = AzureDocumentself.filecreateafteredit(output, folderpathazure, Path.GetFileName(orignialfiles), null, null);
                            }
                        }
                        // If the file exists, keep trying until it doesn't
                        //start GetHashCode file content
                        if (extension == ".pdf")
                        {
                            var tempname = "";
                            StringBuilder builder = new StringBuilder();
                            var Pdf2ImageProcess = new Pdf2ImageProcess();
                            Dictionary<string, string> images = new Dictionary<string, string>();
                            try
                            {
                                var outimagefilePath = HttpContext.Current.Server.MapPath("~/azuredirout/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId);
                                if (!Directory.Exists(outimagefilePath))
                                {
                                    Directory.CreateDirectory(outimagefilePath);
                                }
                                images = Pdf2ImageProcess.ExtractImagesFromPDF(filePath, outimagefilePath);
                            }
                            finally
                            {
                                Pdf2ImageProcess.Dispose();
                            }
                            var directory = Path.GetDirectoryName(filePath);
                            foreach (var name in images.Keys)
                            {
                                tempname = name;
                                string tessPath = HostingEnvironment.MapPath(@"~/tessdata");
                                if (ocrlanguage == "eng")
                                {
                                    TesseractEngine engine = new TesseractEngine(tessPath, "eng", EngineMode.Default);
                                    var imageWithText = Pix.LoadFromFile(tempname);
                                    var data = engine.Process(imageWithText);
                                    ocrcontent = data.GetText();
                                    builder.Append(ocrcontent);
                                }
                                if (ocrlanguage == "hin")
                                {
                                    TesseractEngine engine = new TesseractEngine(tessPath, "hin", EngineMode.Default);
                                    var imageWithText = Pix.LoadFromFile(tempname);
                                    var data = engine.Process(imageWithText);
                                    ocrcontent = data.GetText();
                                    builder.Append(ocrcontent);
                                }
                                if (ocrlanguage == "kan")
                                {
                                    TesseractEngine engine = new TesseractEngine(tessPath, "kan", EngineMode.Default);
                                    var imageWithText = Pix.LoadFromFile(tempname);
                                    var data = engine.Process(imageWithText);
                                    ocrcontent = data.GetText();
                                    builder.Append(ocrcontent);
                                }
                                if (ocrlanguage == "mal")
                                {
                                    TesseractEngine engine = new TesseractEngine(tessPath, "mal", EngineMode.Default);
                                    var imageWithText = Pix.LoadFromFile(tempname);
                                    var data = engine.Process(imageWithText);
                                    ocrcontent = data.GetText();
                                    builder.Append(ocrcontent);
                                }
                                if (ocrlanguage == "mar")
                                {
                                    TesseractEngine engine = new TesseractEngine(tessPath, "mar", EngineMode.Default);
                                    var imageWithText = Pix.LoadFromFile(tempname);
                                    var data = engine.Process(imageWithText);
                                    ocrcontent = data.GetText();
                                    builder.Append(ocrcontent);
                                }
                                if (ocrlanguage == "tam")
                                {
                                    TesseractEngine engine = new TesseractEngine(tessPath, "tam", EngineMode.Default);
                                    var imageWithText = Pix.LoadFromFile(tempname);
                                    var data = engine.Process(imageWithText);
                                    ocrcontent = data.GetText();
                                    builder.Append(ocrcontent);
                                }
                                if (ocrlanguage == "guj")
                                {
                                    TesseractEngine engine = new TesseractEngine(tessPath, "guj", EngineMode.Default);
                                    var imageWithText = Pix.LoadFromFile(tempname);
                                    var data = engine.Process(imageWithText);
                                    ocrcontent = data.GetText();
                                    builder.Append(ocrcontent);
                                }
                                if (ocrlanguage == "enghin")
                                {
                                    TesseractEngine engine = new TesseractEngine(tessPath, "eng+hin", EngineMode.Default);
                                    var imageWithText = Pix.LoadFromFile(tempname);
                                    var data = engine.Process(imageWithText);
                                    ocrcontent = data.GetText();
                                    builder.Append(ocrcontent);
                                }
                                //delete image file
                                try
                                {
                                    if (File.Exists(tempname))
                                    {
                                        GC.Collect();
                                        GC.WaitForPendingFinalizers();
                                        File.Delete(tempname);
                                    }
                                }
                                catch
                                {
                                }
                            }
                            PDDocument docs = PDDocument.load(filePath);
                            PDFTextStripper striper = new PDFTextStripper();
                            ocrcontent = (striper.getText(docs));
                            builder.Append(ocrcontent);
                            ocrcontent = builder.ToString();
                        }
                        else
                        {
                            //  Bitmap img = new Bitmap(filePath);
                            string tessPath = HostingEnvironment.MapPath(@"~/tessdata");
                            if (ocrlanguage == "eng")
                            {
                                TesseractEngine engine = new TesseractEngine(tessPath, "eng", EngineMode.Default);
                                var imageWithText = Pix.LoadFromFile(filePath);
                                var data = engine.Process(imageWithText);
                                ocrcontent = data.GetText();
                            }
                            if (ocrlanguage == "hin")
                            {
                                TesseractEngine engine = new TesseractEngine(tessPath, "hin", EngineMode.Default);
                                var imageWithText = Pix.LoadFromFile(filePath);
                                var data = engine.Process(imageWithText);
                                ocrcontent = data.GetText();
                            }
                            if (ocrlanguage == "kan")
                            {
                                TesseractEngine engine = new TesseractEngine(tessPath, "kan", EngineMode.Default);
                                var imageWithText = Pix.LoadFromFile(filePath);
                                var data = engine.Process(imageWithText);
                                ocrcontent = data.GetText();
                            }
                            if (ocrlanguage == "mal")
                            {
                                TesseractEngine engine = new TesseractEngine(tessPath, "mal", EngineMode.Default);
                                var imageWithText = Pix.LoadFromFile(filePath);
                                var data = engine.Process(imageWithText);
                                ocrcontent = data.GetText();
                            }
                            if (ocrlanguage == "mar")
                            {
                                TesseractEngine engine = new TesseractEngine(tessPath, "mar", EngineMode.Default);
                                var imageWithText = Pix.LoadFromFile(filePath);
                                var data = engine.Process(imageWithText);
                                ocrcontent = data.GetText();
                            }
                            if (ocrlanguage == "tam")
                            {
                                TesseractEngine engine = new TesseractEngine(tessPath, "tam", EngineMode.Default);
                                var imageWithText = Pix.LoadFromFile(filePath);
                                var data = engine.Process(imageWithText);
                                ocrcontent = data.GetText();
                            }
                            if (ocrlanguage == "guj")
                            {
                                TesseractEngine engine = new TesseractEngine(tessPath, "guj", EngineMode.Default);
                                var imageWithText = Pix.LoadFromFile(filePath);
                                var data = engine.Process(imageWithText);
                                ocrcontent = data.GetText();
                            }
                            if (ocrlanguage == "enghin")
                            {
                                TesseractEngine engine = new TesseractEngine(tessPath, "eng+hin", EngineMode.Default);
                                var imageWithText = Pix.LoadFromFile(filePath);
                                var data = engine.Process(imageWithText);
                                ocrcontent = data.GetText();
                            }
                        }
                        //end
                        docfiles.Add(filePath);
                        var fileext = Path.GetExtension(orignialfiles);
                        if (chkSave == "true")
                        {
                            var effectedrow = Repository.Matter.saveocrfile(orignialfiles, ocrcontent, details.ToString(), firmids.ToString(), userids.ToString());
                            var param = controllername + ">PostSaveOcrFiles>SaveOcrFiles>param=" + fileNameOnly1 + "@" + ocrcontent + "@" + details + "@" + firmids + "@" + userids;
                            db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                            if (effectedrow != "")
                            {
                                var data1 = JsonConvert.SerializeObject(ocrcontent);
                                return Ok(new { result = data1, filePath = tempshowpath });
                            }
                        }
                        else
                        {
                            var data1 = JsonConvert.SerializeObject(ocrcontent);
                            return Ok(new { result = data1, filePath = tempshowpath });
                        }
                    }
                    return Ok("Success");
                }
                if (!String.IsNullOrEmpty(savemykasefileid))
                {
                    //upload docuemnt from mykase server
                    try
                    {
                        var filelist = SaveMykaseDocument.SaveMykaseDocumentToOtherModule(savemykasefileid, "ocr", LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), "1");
                        if (!String.IsNullOrEmpty(filelist))
                        {
                            string[] values2 = filelist.Split('|');
                            for (int j = 0; j < values2.Length; j++)
                            {
                                //get file physical path
                                values2[j] = values2[j].Trim();
                                var filePath = values2[j];
                                string input = "";
                                string orignialfiles = "";
                                int it = 0;
                                orignialfiles = Path.GetFileNameWithoutExtension(values2[j]);
                                var extension = Path.GetExtension(values2[j]);
                                string[] stringArray = { ".JPG", ".JPEG", ".PNG", ".PDF" };
                                string value = extension.ToUpper();
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
                                    return Ok("ExtentionNotAllowed");
                                }
                                //check file size
                                FileInfo info = new FileInfo(filePath);
                                long length = info.Length;
                                //Convert to KB
                                var finalfilelengthKb = length / 1024;
                                if (finalfilelengthKb > 20480)
                                {
                                    try
                                    {
                                        File.Delete(filePath);
                                    }
                                    catch
                                    {
                                    }
                                    return Ok("FileSizeExceed");
                                }
                                var originalfilename = Path.GetFileName(values2[j]);
                                input = filePath;
                                var tempshowpath = "/Documents/OcrDocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/" + originalfilename;
                                if (chkSave == "true")
                                {
                                    while (AzureDocument.fileexist(folderpathazure, originalfilename, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()))
                                    {
                                        it += 1;
                                        originalfilename = string.Format("{0}({1}).{2}", orignialfiles, it, extension.TrimStart('.').TrimEnd('.'));
                                    }
                                    string tempfilename = "AE2bdADSAA" + orignialfiles + extension;
                                    string output = HttpContext.Current.Server.MapPath("~/Documents/OcrDocuments/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/" + tempfilename);
                                    QueryAES.FileEncrypt(input, output);
                                    try
                                    {
                                        var status = AzureDocumentself.filecreateafteredit(output, folderpathazure, Path.GetFileName(originalfilename), null, null);
                                    }
                                    catch (Exception er)
                                    {
                                        AzureDocumentself.CreateNestedDirectory(folderpathazure);
                                        var status = AzureDocumentself.filecreateafteredit(output, folderpathazure, Path.GetFileName(originalfilename), null, null);
                                    }
                                }
                                if (extension == ".pdf")
                                {
                                    var tempname = "";
                                    StringBuilder builder = new StringBuilder();
                                    var images = PdfImageExtractor.ExtractImages(filePath);
                                    var directory = Path.GetDirectoryName(filePath);
                                    foreach (var name in images.Keys)
                                    {
                                        tempname = directory + "\\" + name;
                                        images[name].Save(Path.Combine(directory, name));
                                        string tessPath = HostingEnvironment.MapPath(@"~/tessdata");
                                        if (ocrlanguage == "eng")
                                        {
                                            TesseractEngine engine = new TesseractEngine(tessPath, "eng", EngineMode.Default);
                                            var imageWithText = Pix.LoadFromFile(tempname);
                                            var data = engine.Process(imageWithText);
                                            ocrcontent = data.GetText();
                                            builder.Append(ocrcontent);
                                            System.IO.File.Delete(Path.Combine(directory, name));
                                        }
                                        if (ocrlanguage == "hin")
                                        {
                                            TesseractEngine engine = new TesseractEngine(tessPath, "hin", EngineMode.Default);
                                            var imageWithText = Pix.LoadFromFile(tempname);
                                            var data = engine.Process(imageWithText);
                                            ocrcontent = data.GetText();
                                            builder.Append(ocrcontent);
                                            System.IO.File.Delete(Path.Combine(directory, name));
                                        }
                                        if (ocrlanguage == "kan")
                                        {
                                            TesseractEngine engine = new TesseractEngine(tessPath, "kan", EngineMode.Default);
                                            var imageWithText = Pix.LoadFromFile(tempname);
                                            var data = engine.Process(imageWithText);
                                            ocrcontent = data.GetText();
                                            builder.Append(ocrcontent);
                                            System.IO.File.Delete(Path.Combine(directory, name));
                                        }
                                        if (ocrlanguage == "mal")
                                        {
                                            TesseractEngine engine = new TesseractEngine(tessPath, "mal", EngineMode.Default);
                                            var imageWithText = Pix.LoadFromFile(tempname);
                                            var data = engine.Process(imageWithText);
                                            ocrcontent = data.GetText();
                                            builder.Append(ocrcontent);
                                            System.IO.File.Delete(Path.Combine(directory, name));
                                        }
                                        if (ocrlanguage == "mar")
                                        {
                                            TesseractEngine engine = new TesseractEngine(tessPath, "mar", EngineMode.Default);
                                            var imageWithText = Pix.LoadFromFile(tempname);
                                            var data = engine.Process(imageWithText);
                                            ocrcontent = data.GetText();
                                            builder.Append(ocrcontent);
                                            System.IO.File.Delete(Path.Combine(directory, name));
                                        }
                                        if (ocrlanguage == "tam")
                                        {
                                            TesseractEngine engine = new TesseractEngine(tessPath, "tam", EngineMode.Default);
                                            var imageWithText = Pix.LoadFromFile(tempname);
                                            var data = engine.Process(imageWithText);
                                            ocrcontent = data.GetText();
                                            builder.Append(ocrcontent);
                                            System.IO.File.Delete(Path.Combine(directory, name));
                                        }
                                        if (ocrlanguage == "guj")
                                        {
                                            TesseractEngine engine = new TesseractEngine(tessPath, "guj", EngineMode.Default);
                                            var imageWithText = Pix.LoadFromFile(tempname);
                                            var data = engine.Process(imageWithText);
                                            ocrcontent = data.GetText();
                                            builder.Append(ocrcontent);
                                            System.IO.File.Delete(Path.Combine(directory, name));
                                        }
                                        if (ocrlanguage == "enghin")
                                        {
                                            TesseractEngine engine = new TesseractEngine(tessPath, "eng+hin", EngineMode.Default);
                                            var imageWithText = Pix.LoadFromFile(tempname);
                                            var data = engine.Process(imageWithText);
                                            ocrcontent = data.GetText();
                                            builder.Append(ocrcontent);
                                            System.IO.File.Delete(Path.Combine(directory, name));
                                        }
                                    }
                                    PDDocument docs = PDDocument.load(filePath);
                                    PDFTextStripper striper = new PDFTextStripper();
                                    ocrcontent = (striper.getText(docs));
                                    builder.Append(ocrcontent);
                                    ocrcontent = builder.ToString();
                                }
                                else
                                {
                                    //  Bitmap img = new Bitmap(filePath);
                                    string tessPath = HostingEnvironment.MapPath(@"~/tessdata");
                                    if (ocrlanguage == "eng")
                                    {
                                        TesseractEngine engine = new TesseractEngine(tessPath, "eng", EngineMode.Default);
                                        var imageWithText = Pix.LoadFromFile(filePath);
                                        var data = engine.Process(imageWithText);
                                        ocrcontent = data.GetText();
                                    }
                                    if (ocrlanguage == "hin")
                                    {
                                        TesseractEngine engine = new TesseractEngine(tessPath, "hin", EngineMode.Default);
                                        var imageWithText = Pix.LoadFromFile(filePath);
                                        var data = engine.Process(imageWithText);
                                        ocrcontent = data.GetText();
                                    }
                                    if (ocrlanguage == "kan")
                                    {
                                        TesseractEngine engine = new TesseractEngine(tessPath, "kan", EngineMode.Default);
                                        var imageWithText = Pix.LoadFromFile(filePath);
                                        var data = engine.Process(imageWithText);
                                        ocrcontent = data.GetText();
                                    }
                                    if (ocrlanguage == "mal")
                                    {
                                        TesseractEngine engine = new TesseractEngine(tessPath, "mal", EngineMode.Default);
                                        var imageWithText = Pix.LoadFromFile(filePath);
                                        var data = engine.Process(imageWithText);
                                        ocrcontent = data.GetText();
                                    }
                                    if (ocrlanguage == "mar")
                                    {
                                        TesseractEngine engine = new TesseractEngine(tessPath, "mar", EngineMode.Default);
                                        var imageWithText = Pix.LoadFromFile(filePath);
                                        var data = engine.Process(imageWithText);
                                        ocrcontent = data.GetText();
                                    }
                                    if (ocrlanguage == "tam")
                                    {
                                        TesseractEngine engine = new TesseractEngine(tessPath, "tam", EngineMode.Default);
                                        var imageWithText = Pix.LoadFromFile(filePath);
                                        var data = engine.Process(imageWithText);
                                        ocrcontent = data.GetText();
                                    }
                                    if (ocrlanguage == "guj")
                                    {
                                        TesseractEngine engine = new TesseractEngine(tessPath, "guj", EngineMode.Default);
                                        var imageWithText = Pix.LoadFromFile(filePath);
                                        var data = engine.Process(imageWithText);
                                        ocrcontent = data.GetText();
                                    }
                                    if (ocrlanguage == "enghin")
                                    {
                                        TesseractEngine engine = new TesseractEngine(tessPath, "eng+hin", EngineMode.Default);
                                        var imageWithText = Pix.LoadFromFile(filePath);
                                        var data = engine.Process(imageWithText);
                                        ocrcontent = data.GetText();
                                    }
                                }
                                if (chkSave == "true")
                                {
                                    var effectedrow = Repository.Matter.saveocrfile(originalfilename, ocrcontent, details.ToString(), firmids.ToString(), userids.ToString());
                                    var param = controllername + ">PostSaveOcrFiles>SaveOcrFiles>param=" + originalfilename + "@" + ocrcontent + "@" + details + "@" + firmids + "@" + userids;
                                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                                    if (effectedrow != "")
                                    {
                                        var data1 = JsonConvert.SerializeObject(ocrcontent);
                                        return Ok(new { result = data1, filePath = tempshowpath });
                                    }
                                }
                                else
                                {
                                    var data1 = JsonConvert.SerializeObject(ocrcontent);
                                    return Ok(new { result = data1, filePath = tempshowpath });
                                }
                            }
                        }
                    }
                    catch
                    {
                    }
                }
                return Ok();
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Load OCR files
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult Loadocrfiles()
        {
            try
            {
                string search = QueryAES.UrlDecode(HttpContext.Current.Request.Form["search"]);
                var param = controllername + ">Loadocrfiles>ocrfilelist>param=" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString() + "@" + search;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var cmatter = Repository.Matter.ocrfilelist(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), search);
                return Ok(cmatter);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Load OCR files by rowid
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult Loadocrfilesbyrowid()
        {
            try
            {
                string search = QueryAES.UrlDecode(HttpContext.Current.Request.Form["search"]);
                int pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                int pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                var param = controllername + ">Loadocrfiles>ocrfilelist>param=" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString() + "@" + search;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var cmatter = Repository.Matter.ocrfilelistbyrowid(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), pagenum, pagesize, search);
                return Ok(cmatter);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Get Ocr file list for DDl
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult BindOcrfilelistForDDl()
        {
            try
            {
                var cmatter = Repository.Matter.OcrfilelistForDDl(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                return Ok(cmatter);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Get OCR file conent
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadOcrContent()
        {
            try
            {
                string fid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["token"]);
                fid = fid.ToString().Replace(" ", "+");
                fid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(fid.ToString()));
                var param = controllername + ">LoadOcrContent>ocrfilecontent>param=" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString() + "@" + fid;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var cmatter = Repository.Matter.ocrfilecontent(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), fid);
                var details = Repository.Matter.ocrfileById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), fid);
                return Ok(new { content = cmatter, Result = details });
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Get OCR files
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadOcrFile()
        {
            try
            {
                var db = new LawPracticeEntities();
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var fid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["token"]);
                var docname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["docname"]);
                docname = docname.Trim();
                fid = fid.ToString().Replace(" ", "+");
                fid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(fid.ToString()));
                var eventpath = "Documents/OcrDocuments";
                var userids = db.Tbl_OcrFile.Where(x => x.Id.ToString() == fid.ToString()).FirstOrDefault();
                if (userids != null)
                {
                    userid = userids.userid.ToString();
                }
                var downloadpath1 = "/" + eventpath + "/" + firmid + "/" + userid;
                //create temp file 
                string fakepathin = HttpContext.Current.Server.MapPath("~/azuredirin/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId);
                string fakepathout = HttpContext.Current.Server.MapPath("~/azuredirout/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId);
                if (!Directory.Exists(fakepathin))
                {
                    Directory.CreateDirectory(fakepathin);
                }
                if (!Directory.Exists(fakepathout))
                {
                    Directory.CreateDirectory(fakepathout);
                }
                var source = AzureDocumentself.Dirfilepath(downloadpath1.TrimEnd('/').TrimStart('/'), docname, fakepathin, fakepathout, null, null);
                //var source = filepath;
                var destination = "/azuredirout/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/" + docname;
                return Ok(destination);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Delete OCR files
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveOcrFile()
        {
            string temppath = "";
            try
            {
                string fid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fileid"]);
                fid = fid.ToString().Replace(" ", "+");
                fid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(fid.ToString()));
                var db = new LawPracticeEntities();
                var checkfid = db.Tbl_OcrFile.Where(x => x.Id.ToString() == fid.ToString() && x.Firmid.ToString() == LoggedInUser.FirmId.ToString()).FirstOrDefault();
                if (checkfid != null)
                {
                    string fullpath = "Documents/OcrDocuments/" + LoggedInUser.FirmId.ToString() + "/" + checkfid.userid;
                    var filename = checkfid.Filename;
                    try
                    {
                        AzureDocumentself.DeleteFile(fullpath, filename, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                    }
                    catch (Exception ex)
                    {
                    }
                }
                if (fid != "")
                {
                    var param = controllername + ">RemoveOcrFile>ocrfilecontent>param=" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString() + "@" + fid;
                    db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                    var cmatter = Repository.Matter.removeocrfile(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), fid);
                    db1.saveuseractivity(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.UserId.ToString(), 1, DateTime.Now.ToString(), "delocrfile", Guid.Empty.ToString(), null, null, DateTime.Now.ToString());
                    return Ok(cmatter);
                }
                else
                {
                    return Ok("File does  not exist");
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Invoice Settings Page Save
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult InvoiceSettingsPageSave()
        {
            try
            {
                var db = new LawPracticeEntities();
                TblinvoiceSetting inv = new TblinvoiceSetting();
                var httpRequest = HttpContext.Current.Request;
                string folderPath = HttpContext.Current.Server.MapPath("~/Documents/HomePage/InvoiceLogo/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/");
                string folderPathsign = HttpContext.Current.Server.MapPath("~/Documents/HomePage/InvoiceSignature/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/");
                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }
                if (!Directory.Exists(folderPathsign))
                {
                    Directory.CreateDirectory(folderPathsign);
                }
                var LogoPath = "";
                var LogoPathSign = "";
                if (httpRequest.Files.Count > 0)
                {
                    for (int i = 0; i < httpRequest.Files.Count; i++)
                    {
                        if (httpRequest.Files.Keys[i] == "logo")
                        {
                            var postedFile = httpRequest.Files[i];
                            var fileName = Path.GetFileNameWithoutExtension(postedFile.FileName);
                            var fileext = Path.GetExtension(postedFile.FileName);
                            var fileName1 = fileName + randomno() + fileext;
                            var filePath = folderPath + Path.GetFileName(fileName1);
                            var fileextchk = Path.GetExtension(postedFile.FileName);
                            var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);
                            postedFile.SaveAs(filePath);
                            LogoPath = Convert.ToString("/Documents/HomePage/InvoiceLogo/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/" + fileName1);
                        }
                        else
                        {
                            var postedFile = httpRequest.Files[i];
                            var fileName = Path.GetFileNameWithoutExtension(postedFile.FileName);
                            var fileext = Path.GetExtension(postedFile.FileName);
                            var fileName1 = fileName + randomno() + fileext;
                            var filePath = folderPathsign + Path.GetFileName(fileName1);
                            var fileextchk = Path.GetExtension(postedFile.FileName);
                            var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);
                            postedFile.SaveAs(filePath);
                            LogoPathSign = Convert.ToString("/Documents/HomePage/InvoiceSignature/" + LoggedInUser.FirmId + "/" + LoggedInUser.UserId + "/" + fileName1);
                        }
                    }
                }
                var logodata = QueryAES.UrlDecode(HttpContext.Current.Request.Form["logo1"]).ToString();
                if (logodata == "")
                {
                    inv.inlogo = LogoPath;
                }
                else
                {
                    inv.inlogo = logodata;
                }
                var logodatasign = QueryAES.UrlDecode(HttpContext.Current.Request.Form["logosign1"]).ToString();
                if (logodatasign == "")
                {
                    inv.InSignature = LogoPathSign;
                }
                else
                {
                    inv.InSignature = logodatasign;
                }
                inv.isdefault = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["isdefault"]).ToString());
                inv.intemplate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invoicename"]).ToString();
                inv.Incompanyname = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["cname"]));
                inv.innotes = Convert.ToString(QueryAES.UrlDecodeEditor(HttpContext.Current.Request.Form["notes"]));
                inv.intermscondtion = Convert.ToString(QueryAES.UrlDecodeEditor(HttpContext.Current.Request.Form["terms"]));
                inv.ingstregno = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["gstno"]));
                inv.inaddress = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["address"]));
                inv.inphone = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["phonenumber"]));
                inv.inemail = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["emailid"]));
                inv.website = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["website"]));
                inv.inpan = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pan"]));
                inv.saccode = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["sacno"]));
                inv.state = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["state"]));
                inv.userid = Guid.Parse(LoggedInUser.UserId.ToString());
                inv.Firmid = Guid.Parse(LoggedInUser.FirmId.ToString());
                if (inv.isdefault == 0)
                {
                    var chkdata = db.TblAnotherAddressInvoices.Where(x => x.Firmid == LoggedInUser.FirmId && x.isdefault == 1).ToList();
                    if (chkdata.Count > 0)
                    {
                    }
                    else
                    {
                        return Ok("setdefault");
                    }
                }
                var result = Repository.Matter.saveinvoicesettings(inv);
                return Ok(result);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Generate random number
        /// </summary>
        /// <returns></returns>
        public string randomno()
        {
            string alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            string small_alphabets = "abcdefghijklmnopqrstuvwxyz";
            string numbers = "1234567890";
            string characters = alphabets + small_alphabets + numbers;
            int length = 10;
            string otp = string.Empty;
            for (int i = 0; i < length; i++)
            {
                string character = string.Empty;
                do
                {
                    int index = new Random().Next(0, characters.Length);
                    character = characters.ToCharArray()[index].ToString();
                } while (otp.IndexOf(character) != -1);
                otp += character;
            }
            return otp;
        }

        /// <summary>
        /// Save invoice tax
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult PostSaveInvoicetax()
        {
            try
            {
                var db = new LawPracticeEntities();
                TblInvoiceTax tx = new TblInvoiceTax();
                string taxname = QueryAES.UrlDecode(HttpContext.Current.Request.Form["taxname"]);
                string tax = QueryAES.UrlDecode(HttpContext.Current.Request.Form["tax"]);
                string sdate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["sdate"]);
                string edate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["edate"]);
                tx.tax = Convert.ToDouble(tax);
                tx.taxtype = taxname;
                tx.FromDate = Convert.ToDateTime(DateTime.Now);
                tx.EndDate = Convert.ToDateTime(DateTime.Now);
                tx.Firmid = LoggedInUser.FirmId;
                tx.userid = LoggedInUser.UserId;
                var chckdate = db.usp_checktaxdate(tx.FromDate, tx.EndDate, tx.Firmid.ToString(), tx.taxtype).ToList();
                if (chckdate.Count != 0)
                {
                    return Ok("alreadyexist");
                }
                var param = controllername + ">PostSaveInvoicetax>saveinvoicetax>param=" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString() + "@" + tax;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var cmatter = Repository.Matter.saveinvoicetax(tx);
                return Ok(cmatter);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Delete invoice tax
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveInvoicetax()
        {
            try
            {
                string fid = HttpContext.Current.Request.Form["token"];//QueryAES.UrlDecode(HttpContext.Current.Request.Form["token"]);
                fid = fid.ToString().Replace(" ", "+");
                fid = QueryAES.DecryptStringAES(fid);
                var param = controllername + ">RemoveInvoicetax>removetaxdata>param=" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString() + "@" + fid;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var cmatter = Repository.Matter.removetaxdata(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), fid);
                return Ok(cmatter);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Get invoice tax details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult Loadtaxdata()
        {
            try
            {
                var param = controllername + ">Loadtaxdata>Loadtaxdata>param=" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var cmatter = Repository.Matter.Loadtaxdata(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                return Ok(cmatter);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Get invoice tax by date
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadInvoicetaxbydate()
        {
            try
            {
                string invdate = Request.Headers.GetValues("invdate").FirstOrDefault();
                var param = controllername + ">LoadInvoicetaxbydate>LoadInvoicetaxbydate>param=" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var cmatter = Repository.Matter.Loadtaxdatabydate(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), invdate);
                return Ok(cmatter);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// State by client
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult Statebyclient()
        {
            try
            {
                string clientid = Request.Headers.GetValues("clientid").FirstOrDefault();
                var list = db1.usp_GetClinetDetail(clientid.ToString(), LoggedInUser.FirmId.ToString()).FirstOrDefault();
                if (list != null)
                {
                    return Ok(list);
                }
                else
                {
                    return Ok();
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Save invoice details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult PostSaveInvoice()
        {
            int invocetaxtype = 0;
            try
            {
                string invclient = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invclient"]);
                string invstate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invstate"]);
                string invsstate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invsstate"]);
                string invinvoicedate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invinvoicedate"]);
                string invduedate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invduedate"]);
                string invmob = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invmob"]);
                string invaddress = QueryAES.UrlDecodeEditor(HttpContext.Current.Request.Form["invaddress"]);
                string invsaddress = QueryAES.UrlDecodeEditor(HttpContext.Current.Request.Form["invsaddress"]);
                string invigstper = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invigstper"]);
                string invcgstper = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invcgstper"]);
                string invsgstper = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invsgstper"]);
                string invigsttempval = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invigsttempval"]);
                string invcgsttempval = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invcgsttempval"]);
                string invsgsttempval = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invsgsttempval"]);
                string invsubtotaltemp = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invsubtotaltemp"]);
                string finaltotaltemp = QueryAES.UrlDecode(HttpContext.Current.Request.Form["finaltotaltemp"]);
                string addressid = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["addressid"]));
                string desObj = QueryAES.UrlDecode(HttpContext.Current.Request.Form["itemlistdata"]);
                string payObj = QueryAES.UrlDecode(HttpContext.Current.Request.Form["itempaymentdata"]);
                string invoicetype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invoicetype"]);
                string UserNameFreeText = QueryAES.UrlDecode(HttpContext.Current.Request.Form["UserNameFreeText"]);
                string EmailText = QueryAES.UrlDecode(HttpContext.Current.Request.Form["EmailText"]);
                string MatterId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["MatterId"]);
                string clientgst = QueryAES.UrlDecode(HttpContext.Current.Request.Form["clientgst"]);
                string clientpan = QueryAES.UrlDecode(HttpContext.Current.Request.Form["clientpan"]);
                string invsubject = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invsubject"]);
                string invReference = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invReference"]);
                //Add for invoice tax optional
                if (invoicetype == "2")
                {
                    invocetaxtype = 1;
                }
                else
                {
                    invocetaxtype = 0;
                }
                if (invclient == "")
                {
                    invclient = "00000000-0000-0000-0000-000000000000";
                }
                var param = controllername + ">PostSaveInvoice>saveinvoice>param=" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var outputinvoice = Repository.Matter.saveinvoice(invclient, invstate, invinvoicedate, invduedate, invmob, invaddress, invigstper, invcgstper, invsgstper, invigsttempval, invcgsttempval, invsgsttempval, invsubtotaltemp, finaltotaltemp, desObj, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.FirmCode.ToString(), addressid, payObj, invsstate, invsaddress, invocetaxtype, UserNameFreeText, EmailText, MatterId, clientpan, clientgst, invsubject, invReference);
                return Ok(outputinvoice);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Get invoice data
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadInvoicedata()
        {
            try
            {
                var cnamefilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["cnamefilter"]);
                var fromfilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fromfilter"]);
                var tofilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["tofilter"]);
                var pagenum = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Pageindex"]);
                var pagesice = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Pagesize"]);
                var filterinvoietype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filterinvoietype"]);
                var FilterInvoiceStatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["FilterInvoiceStatus"]);
                if (String.IsNullOrEmpty(fromfilter))
                {
                    fromfilter = "1900-01-01";
                }
                if (String.IsNullOrEmpty(tofilter))
                {
                    tofilter = DateTime.Now.ToString("yyyy-MM-dd");
                }
                if (!String.IsNullOrEmpty(fromfilter))
                {
                    if (String.IsNullOrEmpty(tofilter))
                    {
                        tofilter = DateTime.Now.ToString("yyyy-MM-dd");
                    }
                }
                var amountfilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["amountfilter"]);
                var filter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["searchflag"]);
                var cmatter = Repository.Matter.LoadInvoicedataSearch(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Convert.ToInt32(LoggedInUser.RoleId), cnamefilter, fromfilter, tofilter, amountfilter, Convert.ToInt32(pagenum), Convert.ToInt32(pagesice), filterinvoietype, FilterInvoiceStatus);
                return Ok(cmatter);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Get invoice details by client id
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadInvoicebyclientid()
        {
            try
            {
                var clientid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ctoken"]);
                var list = db1.usp_GetInvoiceByclientId(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), clientid.ToString()).ToList();
                var a = JsonConvert.SerializeObject(list);
                return Ok(a);
            }
            catch (Exception er)
            {
                return Ok();
            }
        }

        /// <summary>
        /// Get invoice payment by invoice id
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadInvoicePaymentbyInvid()
        {
            try
            {
                var ptoken = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ptoken"]);
                var list = db1.usp_GetInvoicePaymentById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), ptoken.ToString()).ToList();
                var a = JsonConvert.SerializeObject(list);
                return Ok(a);
            }
            catch (Exception er)
            {
                return Ok();
            }
        }
        /// <summary>
        /// Update clear payment
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult UpdateClearPayment()
        {
            try
            {
                var cleardate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["cleardate"]);
                var token = QueryAES.UrlDecode(HttpContext.Current.Request.Form["token"]);
                var isClearence = QueryAES.UrlDecode(HttpContext.Current.Request.Form["isClearence"]);
                var list = db1.usp_InvoiceClearPayment(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), token.ToString(), cleardate.ToString(), isClearence.ToString());
                return Ok(list);
            }
            catch (Exception er)
            {
                return Ok();
            }
        }

        /// <summary>
        /// Get invoice date by client id
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadInvoicedataByClientId()
        {
            try
            {
                var token = QueryAES.UrlDecode(HttpContext.Current.Request.Form["token"]);
                token = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(token));
                var param = controllername + ">LoadInvoicedata>LoadInvoicedata>param=" + LoggedInUser.FirmId.ToString() + "@" + token.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var cmatter = Repository.Matter.LoadInvoicedata(LoggedInUser.FirmId.ToString(), token.ToString(), 3);
                return Ok(cmatter);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Save invoice series
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult PostSaveInvoiceSeries()
        {
            try
            {
                var db = new LawPracticeEntities();
                TblInvoiceSery tx = new TblInvoiceSery();
                string srno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["srno"]);
                string seriescode = QueryAES.UrlDecode(HttpContext.Current.Request.Form["seriescode"]);
                string FormatMonth = QueryAES.UrlDecode(HttpContext.Current.Request.Form["FormatMonth"]);
                string FormatFYCY = QueryAES.UrlDecode(HttpContext.Current.Request.Form["FormatFYCY"]);
                string FormatOperator = QueryAES.UrlDecode(HttpContext.Current.Request.Form["FormatOperator"]);
                string FormatSequence = QueryAES.UrlDecode(HttpContext.Current.Request.Form["FormatSequence"]);
                string FormatPreview = QueryAES.UrlDecode(HttpContext.Current.Request.Form["FormatPreview"]);
                string FormatSeriesArray = QueryAES.UrlDecode(HttpContext.Current.Request.Form["FormatSeriesArray"]);
                tx.FormatFYCY = FormatFYCY;
                tx.FormatMonth = FormatMonth;
                tx.FormatOperator = FormatOperator;
                tx.FormatPreview = FormatPreview;
                tx.FormatSequence = FormatSequence;
                tx.FormatSeriesArray = FormatSeriesArray;
                tx.Serierno = srno;
                tx.SeriesCode = seriescode;
                tx.Firmid = LoggedInUser.FirmId;
                tx.userid = LoggedInUser.UserId;
                var checkseries = db.usp_InvoiceSeriesByFirmId(tx.Firmid.ToString(), "").ToList();
                if (checkseries.Count != 0)
                {
                    return Ok("alreadyexist");
                }
                var param = controllername + ">PostSaveInvoiceSeries>PostSaveInvoiceSeries>param=" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString() + "@" + seriescode;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var series = Repository.Matter.saveinvoiceseries(tx);
                return Ok(series);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Get invoice details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadInvoiceseries()
        {
            try
            {
                var param = controllername + ">LoadInvoiceseries>LoadInvoiceseries>param=" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var cmatter = Repository.Matter.LoadInvoiceseries(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                return Ok(cmatter);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Update invoice series details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult PostEditInvoiceSeries()
        {
            try
            {
                string id = QueryAES.UrlDecode(HttpContext.Current.Request.Form["token"]);
                var db = new LawPracticeEntities();
                TblInvoiceSery tx = new TblInvoiceSery();
                string year = QueryAES.UrlDecode(HttpContext.Current.Request.Form["year"]);
                string srno = QueryAES.UrlDecode(HttpContext.Current.Request.Form["srno"]);
                string seriescode = QueryAES.UrlDecode(HttpContext.Current.Request.Form["seriescode"]);
                string fromdate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fromdate"]);
                string todate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["todate"]);
                tx.fromdate = Convert.ToDateTime(fromdate);
                tx.todate = Convert.ToDateTime(todate);
                tx.Year = year;
                tx.Serierno = srno;
                tx.SeriesCode = seriescode;
                tx.Firmid = LoggedInUser.FirmId;
                tx.userid = LoggedInUser.UserId;
                var chksdate = db.TblInvoiceSeries.Where(x => x.Id.ToString() == id.ToString() && x.Firmid == tx.Firmid).FirstOrDefault();
                if (chksdate != null)
                {
                    if (tx.fromdate == chksdate.fromdate && tx.todate == chksdate.fromdate)
                    {
                    }
                    else
                    {
                        var chksdate1 = db.TblInvoiceSeries.Where(x => x.fromdate == tx.fromdate && x.todate == tx.todate && x.Firmid == tx.Firmid).FirstOrDefault();
                        if (chksdate1 != null)
                        {
                            return Ok("alreadyexist");
                        }
                    }
                    var chckdateseries = db.usp_checkinvoiceseriesdate(tx.fromdate, tx.todate, tx.Firmid.ToString(), tx.SeriesCode, id.ToString()).ToList();
                    if (chckdateseries.Count != 0)
                    {
                        return Ok("alreadyexist");
                    }
                }
                var param = controllername + ">PostSaveInvoiceSeries>PostSaveInvoiceSeries>param=" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString() + "@" + seriescode;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var series = Repository.Matter.saveinvoiceseries(tx, id);
                return Ok(series);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Save invoice address
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SaveInvoiceAddress()
        {
            try
            {
                var db = new LawPracticeEntities();
                TblAnotherAddressInvoice inv = new TblAnotherAddressInvoice();
                var httpRequest = HttpContext.Current.Request;
                inv.isdefault = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["isdefault"]));
                inv.State = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["state"]));
                inv.GSTNo = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["gstno"]));
                inv.Address = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["address"]));
                inv.Phoneno = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["phonenumber"]));
                inv.Email = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["emailid"]));
                inv.website = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["website"]));
                inv.Pan = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pan"]));
                inv.Sac = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["sacno"]));
                inv.Isactive = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["isactive"]));
                inv.userid = Guid.Parse(LoggedInUser.UserId.ToString());
                inv.Firmid = Guid.Parse(LoggedInUser.FirmId.ToString());
                var id = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["token"]));
                if (!String.IsNullOrEmpty(id))
                {
                    try
                    {
                        id = QueryAES.DecryptStringAES(id);
                    }
                    catch
                    {
                    }
                    var result = Repository.Matter.SaveInvoiceAddress(inv, id);
                    return Ok(result);
                }
                else
                {
                    var result = Repository.Matter.SaveInvoiceAddress(inv, "");
                    return Ok(result);
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Firm), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Firm), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Get invoice address details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult Loadinvaddress()
        {
            try
            {
                var param = controllername + ">Loadinvaddress>Loadinvaddress>param=" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var cmatter = Repository.Matter.Loadinvaddress(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString());
                return Ok(cmatter);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Save payment details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult PostSavePayment()
        {
            var db = new LawPracticeEntities();
            try
            {
                string invoiceid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["token"]);
                if (invoiceid != "")
                {
                    invoiceid = invoiceid.ToString().Replace(" ", "+");
                    invoiceid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(invoiceid));
                }
                var paidamttemp = "";
                var totamttemp = "";
                int dueamttemp = 0;
                var data = db.TblInvoices.Where(z => z.Firmid == LoggedInUser.FirmId && z.id.ToString() == invoiceid).FirstOrDefault();
                if (data != null)
                {
                    totamttemp = data.TotAmt.ToString();
                }
                var datapay = db.TblInvoicePayments.Where(z => z.Firmid == LoggedInUser.FirmId && z.InvoiceId.ToString() == invoiceid && z.Cleared == 1).Sum(z => z.Amount);
                if (datapay != null)
                {
                    paidamttemp = datapay.ToString();
                    dueamttemp = Convert.ToInt32(totamttemp) - Convert.ToInt32(paidamttemp);
                }
                else
                {
                    dueamttemp = Convert.ToInt32(totamttemp);
                }
                string payObj = QueryAES.UrlDecode(HttpContext.Current.Request.Form["itempaymentdata"]);
                if (payObj == "[]")
                {
                    return Ok("can not blank");
                }
                int sum = 0;
                List<InvoicePayment> payobj1 = JsonConvert.DeserializeObject<List<InvoicePayment>>(QueryAES.UrlDecode(HttpContext.Current.Request.Form["itempaymentdata"]));
                if (payobj1.Count > 0)
                {
                    for (var i = 0; i < payobj1.Count; i++)
                    {
                        int amount = Convert.ToInt32(payobj1[i].Amount);
                        sum = sum + amount;
                    }
                }
                if (sum > dueamttemp)
                {
                    return Ok("Invalid amount");
                }
                var param = controllername + ">PostSavePayment>SavePayment>param=" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var outputinvoice = Repository.Matter.SavePayment(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), invoiceid, payObj);
                return Ok();
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Edit invoice entry
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadEditInvEntry()
        {
            try
            {
                string invoiceid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["token"]);
                if (invoiceid != "")
                {
                    invoiceid = invoiceid.ToString().Replace(" ", "+");
                    invoiceid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(invoiceid));
                }
                var param = controllername + ">LoadEditInvEntry>LoadEditInvEntry>param=" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString() + "@" + invoiceid;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var cmatter = Repository.Matter.LoadEditInvEntry(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), invoiceid);
                return Ok(cmatter);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Edit invoice payment
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadEditInvPayment()
        {
            try
            {
                string invoiceid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["token"]);
                if (invoiceid != "")
                {
                    invoiceid = invoiceid.ToString().Replace(" ", "+");
                    invoiceid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(invoiceid));
                }
                var param = controllername + ">LoadEditInvPayment>LoadEditInvPayment>param=" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString() + "@" + invoiceid;
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var cmatter = Repository.Matter.LoadEditInvPayment(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), invoiceid);
                return Ok(cmatter);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Update invoice details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult PostUpdateInvoice()
        {
            int invocetaxtype = 0;
            try
            {
                string invoiceid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["token"]);
                if (invoiceid != "")
                {
                    invoiceid = invoiceid.ToString().Replace(" ", "+");
                    invoiceid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(invoiceid));
                }
                string invclient = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invclient"]);
                string invstate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invstate"]);
                string invsstate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invsstate"]);
                string invinvoicedate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invinvoicedate"]);
                string invduedate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invduedate"]);
                string invmob = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invmob"]);
                string invaddress = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invaddress"]);
                string invsaddress = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invsaddress"]);
                string invigstper = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invigstper"]);
                string invcgstper = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invcgstper"]);
                string invsgstper = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invsgstper"]);
                string invigsttempval = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invigsttempval"]);
                string invcgsttempval = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invcgsttempval"]);
                string invsgsttempval = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invsgsttempval"]);
                string invsubtotaltemp = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invsubtotaltemp"]);
                string finaltotaltemp = QueryAES.UrlDecode(HttpContext.Current.Request.Form["finaltotaltemp"]);
                string addressid = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["addressid"]));
                string desObj = QueryAES.UrlDecode(HttpContext.Current.Request.Form["itemlistdata"]);
                string payObj = QueryAES.UrlDecode(HttpContext.Current.Request.Form["itempaymentdata"]);
                string invoicetype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invoicetype"]);
                string UserNameFreeText = QueryAES.UrlDecode(HttpContext.Current.Request.Form["UserNameFreeText"]);
                string EmailText = QueryAES.UrlDecode(HttpContext.Current.Request.Form["EmailText"]);
                string MatterId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["MatterId"]);
                //Add for invoice tax optional
                if (invoicetype == "2")
                {
                    invocetaxtype = 1;
                }
                else
                {
                    invocetaxtype = 0;
                }
                var param = controllername + ">PostUpdateInvoice>UpdateInvoice>param=" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var outputinvoice = Repository.Matter.updateinvoice(invoiceid, invclient, invstate, invinvoicedate, invduedate, invmob, invaddress, invigstper, invcgstper, invsgstper, invigsttempval, invcgsttempval, invsgsttempval, invsubtotaltemp, finaltotaltemp, desObj, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.FirmCode.ToString(), addressid, payObj, invsstate, invsaddress, invocetaxtype, UserNameFreeText, EmailText, MatterId);
                return Ok();
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Get news and articles details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult Loadnewsandarticle()
        {
            try
            {
                var batch = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["batch"]));
                var length = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["length"]));
                int mintemp = 0;
                int maxtemp = 0;
                maxtemp = length * batch;
                mintemp = maxtemp - batch;
                var param = controllername + ">Loadnewsandarticle>param";
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                string json = "";
                int res = -1;
                var jsonObject = new JObject();
                string strval = "<entry>";
                string result = null;
                string url = System.Configuration.ConfigurationManager.AppSettings["manupatranewandarticlelink"];
                System.Net.WebResponse response = null;
                System.IO.StreamReader reader = null;
                DataTable dt1 = new DataTable();
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
                request.Method = "GET";
                response = request.GetResponse();
                reader = new StreamReader(response.GetResponseStream());
                result = reader.ReadToEnd();
                string text = "";
                string title = "";
                string subtitle = "";
                string strid = "";
                string update = "";
                string linktext = "";
                string mainlinktext = "";
                int count = 0;
                try
                {
                    string stri = "";
                    string linkcontent = "";
                    string updatecontent = "";
                    string summarycontent = "";
                    string titlecontent = "";
                    string idcontent = "";
                    string dateid = "";
                    int pos = result.IndexOf("<entry>", 0);
                    int poscount = result.IndexOf("<entry>", 0);
                    dt1.Columns.Add("title", typeof(string));
                    dt1.Columns.Add("link", typeof(string));
                    dt1.Columns.Add("updated", typeof(string));
                    dt1.Columns.Add("summary", typeof(string));
                    dt1.Columns.Add("id", typeof(string));
                    dt1.Columns.Add("serialno", typeof(int));
                    dt1.Columns.Add("dateid", typeof(string));
                    while (pos != -1)
                    {
                        count = count + 1;
                        if (count > mintemp && count <= maxtemp)
                        {
                            stri = "";
                            int epos = result.IndexOf("</entry>", pos);
                            if (epos != -1)
                            {
                                text = result.Substring(pos, epos - pos);
                            }
                            int linkpos = text.IndexOf("<link ", 0);
                            if (linkpos != -1)
                            {
                                int elinkpos = text.IndexOf("/>", linkpos);
                                if (elinkpos != -1)
                                {
                                    linktext = text.Substring(linkpos + "<link ".Length, elinkpos - linkpos - "<link ".Length);
                                    int pdfpos = linktext.IndexOf(".pdf", 0);
                                    if (linktext != "")
                                    {
                                        string linktext1 = "";
                                        int downpos = linktext.IndexOf("href=\"", 0);
                                        if (downpos != -1)
                                        {
                                            int edownpos = linktext.IndexOf("\"", downpos + "href=\"".Length);
                                            if (edownpos != -1)
                                            {
                                                linktext1 = linktext.Substring(downpos + "href=\"".Length, edownpos - downpos - "href=\"".Length);
                                                if (linktext1 != "https://www.manupatra.com/")
                                                {
                                                    mainlinktext = "<link>" + linktext1 + "</link>";
                                                    linkcontent = linktext1;
                                                }
                                                else
                                                {
                                                    linkcontent = "";
                                                    mainlinktext = "<link></link>";
                                                }
                                            }
                                        }
                                    }
                                    else
                                    {
                                        linktext = "";
                                        mainlinktext = "";
                                        linkcontent = "";
                                    }
                                }
                            }
                            int titpos = text.IndexOf("<title>", 0);
                            if (titpos != -1)
                            {
                                int etitpos = text.IndexOf("</title>", titpos);
                                if (etitpos != -1)
                                {
                                    title = text.Substring(titpos + "<title>".Length, etitpos - titpos - "<title>".Length);
                                    if (mainlinktext == "")
                                    {
                                        stri = stri + " " + title;
                                        titlecontent = "";
                                    }
                                    else
                                    {
                                        stri = stri + " <title>" + title + "</title> " + mainlinktext;
                                        titlecontent = title;
                                    }
                                }
                            }
                            int utitpos = text.IndexOf("<updated>", 0);
                            if (utitpos != -1)
                            {
                                int eutitpos = text.IndexOf("</updated>", utitpos);
                                if (eutitpos != -1)
                                {
                                    update = text.Substring(utitpos + "<updated>".Length, eutitpos - utitpos - "<updated>".Length);
                                    stri = stri + "<updated>" + update.Replace("GMT", "IST") + "</updated>";
                                    updatecontent = update.Replace("GMT", "IST");
                                    string s1 = updatecontent;
                                    dateid = DateTime.ParseExact(s1, "ddd, dd MMM yyyy HH:mm:ss 'IST'", CultureInfo.InvariantCulture).ToString("yyyyMMddHHmmss");
                                }
                            }
                            int stitpos = text.IndexOf("<summary>", 0);
                            if (stitpos != -1)
                            {
                                int estitpos = text.IndexOf("</summary>", stitpos);
                                if (estitpos != -1)
                                {
                                    subtitle = text.Substring(stitpos + "<summary>".Length, estitpos - stitpos - "<summary>".Length);
                                    stri = stri + "<summary>" + subtitle + "</summary>";
                                    summarycontent = subtitle;
                                }
                            }
                            int idspos = text.IndexOf("<id>", 0);
                            if (idspos != -1)
                            {
                                int eidpos = text.IndexOf("</id>", idspos);
                                if (eidpos != -1)
                                {
                                    strid = text.Substring(idspos + "<id>".Length, eidpos - idspos - "<id>".Length);
                                    idcontent = strid;
                                }
                            }
                            dt1.Rows.Add(titlecontent, linkcontent, updatecontent, summarycontent, idcontent, count, dateid);
                            pos = result.IndexOf("<entry>", pos + 8);
                        }
                        else
                        {
                            pos = result.IndexOf("<entry>", pos + 8);
                        }
                    }
                }
                catch
                {
                }
                return Ok(dt1);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Get news and articles by id
        /// </summary>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult Loadnewsandarticlebyid()
        {
            try
            {
                string iid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["iid"]);
                string json = "";
                int res = -1;
                var jsonObject = new JObject();
                string strval = "<entry>";
                string result = null;
                string url = System.Configuration.ConfigurationManager.AppSettings["manupatranewandarticlelink"];
                System.Net.WebResponse response = null;
                System.IO.StreamReader reader = null;
                DataTable dt1 = new DataTable();
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
                request.Method = "GET";
                response = request.GetResponse();
                reader = new StreamReader(response.GetResponseStream());
                result = reader.ReadToEnd();
                string text = "";
                string title = "";
                string subtitle = "";
                string strid = "";
                string update = "";
                string linktext = "";
                string mainlinktext = "";
                int count = 0;
                try
                {
                    string stri = "";
                    string linkcontent = "";
                    string updatecontent = "";
                    string summarycontent = "";
                    string titlecontent = "";
                    string idcontent = "";
                    string dateid = "";
                    int pos = result.IndexOf("<entry>", 0);
                    int poscount = result.IndexOf("<entry>", 0);
                    dt1.Columns.Add("title", typeof(string));
                    dt1.Columns.Add("link", typeof(string));
                    dt1.Columns.Add("updated", typeof(string));
                    dt1.Columns.Add("summary", typeof(string));
                    dt1.Columns.Add("id", typeof(string));
                    dt1.Columns.Add("serialno", typeof(int));
                    while (pos != -1)
                    {
                        count = count + 1;
                        stri = "";
                        int epos = result.IndexOf("</entry>", pos);
                        if (epos != -1)
                        {
                            text = result.Substring(pos, epos - pos);
                        }
                        int linkpos = text.IndexOf("<link ", 0);
                        if (linkpos != -1)
                        {
                            int elinkpos = text.IndexOf("/>", linkpos);
                            if (elinkpos != -1)
                            {
                                linktext = text.Substring(linkpos + "<link ".Length, elinkpos - linkpos - "<link ".Length);
                                int pdfpos = linktext.IndexOf(".pdf", 0);
                                if (linktext != "") //pdfpos != -1)
                                {
                                    string linktext1 = "";
                                    int downpos = linktext.IndexOf("href=\"", 0);
                                    if (downpos != -1)
                                    {
                                        int edownpos = linktext.IndexOf("\"", downpos + "href=\"".Length);
                                        if (edownpos != -1)
                                        {
                                            linktext1 = linktext.Substring(downpos + "href=\"".Length, edownpos - downpos - "href=\"".Length);
                                            if (linktext1 != "https://www.manupatra.com/")
                                            {
                                                mainlinktext = "<link>" + linktext1 + "</link>";
                                                linkcontent = linktext1;
                                            }
                                            else
                                            {
                                                linkcontent = "";
                                                mainlinktext = "<link></link>";
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    linktext = "";
                                    mainlinktext = "";
                                    linkcontent = "";
                                }
                            }
                        }
                        int titpos = text.IndexOf("<title>", 0);
                        if (titpos != -1)
                        {
                            int etitpos = text.IndexOf("</title>", titpos);
                            if (etitpos != -1)
                            {
                                title = text.Substring(titpos + "<title>".Length, etitpos - titpos - "<title>".Length);
                                if (mainlinktext == "")
                                {
                                    stri = stri + " " + title;
                                    titlecontent = "";
                                }
                                else
                                {
                                    stri = stri + " <title>" + title + "</title> " + mainlinktext;
                                    titlecontent = title;
                                }
                            }
                        }
                        int utitpos = text.IndexOf("<updated>", 0);
                        if (utitpos != -1)
                        {
                            int eutitpos = text.IndexOf("</updated>", utitpos);
                            if (eutitpos != -1)
                            {
                                update = text.Substring(utitpos + "<updated>".Length, eutitpos - utitpos - "<updated>".Length);
                                stri = stri + "<updated>" + update.Replace("GMT", "IST") + "</updated>";
                                updatecontent = update.Replace("GMT", "IST");
                                string s1 = updatecontent;
                                dateid = DateTime.ParseExact(s1, "ddd, dd MMM yyyy HH:mm:ss 'IST'", CultureInfo.InvariantCulture).ToString("yyyyMMddHHmmss");
                            }
                        }
                        int stitpos = text.IndexOf("<summary>", 0);
                        if (stitpos != -1)
                        {
                            int estitpos = text.IndexOf("</summary>", stitpos);
                            if (estitpos != -1)
                            {
                                subtitle = text.Substring(stitpos + "<summary>".Length, estitpos - stitpos - "<summary>".Length);
                                stri = stri + "<summary>" + subtitle + "</summary>";
                                summarycontent = subtitle;
                            }
                        }
                        int idspos = text.IndexOf("<id>", 0);
                        if (idspos != -1)
                        {
                            int eidpos = text.IndexOf("</id>", idspos);
                            if (eidpos != -1)
                            {
                                strid = text.Substring(idspos + "<id>".Length, eidpos - idspos - "<id>".Length);
                                idcontent = strid;
                            }
                        }
                        if (iid.ToString() == dateid.ToString())
                        {
                            dt1.Rows.Add(titlecontent, linkcontent, updatecontent, summarycontent, idcontent, count);
                            break;
                        }
                        pos = result.IndexOf("<entry>", pos + 8);
                    }
                }
                catch (Exception ex)
                {
                }
                return Ok(dt1);
            }
            catch (Exception ex)
            {
                return Ok();
            }
        }

        /// <summary>
        /// Get vCard details
        /// </summary>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult vcarddata()
        {
            try
            {
                var newfilename = "";
                var ocrcontent = "";
                string folderPath = HttpContext.Current.Server.MapPath("~/vcard/");
                //Check whether Directory (Folder) exists.
                if (!Directory.Exists(folderPath))
                {
                    //If Directory (Folder) does not exists. Create it.
                    Directory.CreateDirectory(folderPath);
                }
                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count > 0)
                {
                    for (int i = 0; i < httpRequest.Files.Count; i++)
                    {
                        var docfiles = new List<string>();
                        var postedFile = httpRequest.Files[i];
                        float size = postedFile.ContentLength;
                        //checked if already esxist
                        string extension = Path.GetExtension(postedFile.FileName);
                        string pathName = Path.GetDirectoryName(postedFile.FileName);
                        newfilename = postedFile.FileName;
                        newfilename = Path.GetFileNameWithoutExtension(newfilename);
                        newfilename = Regex.Replace(newfilename, @"[^0-9a-zA-Z]+", "");
                        string fileNameOnly = Path.Combine(pathName, newfilename);
                        int it = 0;
                        string newfilename1 = newfilename + extension;
                        // If the file exists, keep trying until it doesn't
                        while (File.Exists(HttpContext.Current.Server.MapPath("~/vcard/" + newfilename1)))
                        {
                            it += 1;
                            newfilename1 = string.Format("{0}({1}){2}", fileNameOnly, it, extension);
                        }
                        var filePath = HttpContext.Current.Server.MapPath("~/vcard/" + newfilename1);
                        var fileextchk = Path.GetExtension(postedFile.FileName);
                        var is_valid = SaveCommonModulesDocument.chkValidExtension(fileextchk);
                        postedFile.SaveAs(filePath);
                        ImageMagick.MagickImage image = new ImageMagick.MagickImage(filePath);
                        image.Clone();
                        image.Grayscale();
                        image.Resize(6464, 4864);
                        image.Quality = 100;
                        image.Threshold(new Percentage(75));
                        image.Deskew(new Percentage(40));
                        image.Write(filePath);
                        string tessPath = HostingEnvironment.MapPath(@"~/tessdata");
                        TesseractEngine engine = new TesseractEngine(tessPath, "eng", EngineMode.Default);
                        var imageWithText = Pix.LoadFromFile(filePath);
                        var data = engine.Process(imageWithText);
                        ocrcontent = data.GetText();
                        return Ok(ocrcontent);
                    }
                }
                return Ok();
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        /// <summary>
        /// Delete invoice series
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RemoveInvoiceseries()
        {
            var db = new LawPracticeEntities();
            try
            {
                string fid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["ids"]);
                var invcodes = db.usp_InvoiceSeriesById(LoggedInUser.FirmId.ToString(), fid).FirstOrDefault();
                var cmatter = db.sp_RemoveInvoiceSeries(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), fid);
                var param = controllername + ">RemoveInvoiceseries>sp_RemoveInvoiceSeries>param=" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString() + "@" + System.Text.Json.JsonSerializer.Serialize(invcodes);
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                return Ok(cmatter);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Get invoice date by case id
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadInvoicedataByCase()
        {
            try
            {
                var cnamefilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["cnamefilter"]);
                var fromfilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["fromfilter"]);
                var tofilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["tofilter"]);
                var matterids = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Caseid"]);
                var filterinvoietype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["filterinvoietype"]);
                var FilterInvoiceStatus = QueryAES.UrlDecode(HttpContext.Current.Request.Form["FilterInvoiceStatus"]);
                int pagenum = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagenum"]));
                int pagesize = Convert.ToInt32(QueryAES.UrlDecode(HttpContext.Current.Request.Form["pagesize"]));
                try
                {
                    matterids = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(matterids));
                }
                catch { }
                if (String.IsNullOrEmpty(fromfilter))
                {
                    fromfilter = "1900-01-01";
                }
                if (String.IsNullOrEmpty(tofilter))
                {
                    tofilter = DateTime.Now.ToString("yyyy-MM-dd");
                }
                if (!String.IsNullOrEmpty(fromfilter))
                {
                    if (String.IsNullOrEmpty(tofilter))
                    {
                        tofilter = DateTime.Now.ToString("yyyy-MM-dd");
                    }
                }
                var amountfilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["amountfilter"]);
                var filter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["searchflag"]);
                var param = controllername + ">LoadInvoicedata>LoadInvoicedata>param=" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var cmatter = Repository.Matter.LoadInvoicedataByCaseId(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Convert.ToInt32(LoggedInUser.RoleId), matterids.ToString(), filterinvoietype, pagenum, pagesize, FilterInvoiceStatus);
                return Ok(cmatter);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Invoice payment by invoice id
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult InvoicePaymentbyInvoiceID()
        {
            var db = new LawPracticeEntities();
            try
            {
                string Invoiceid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Invoiceid"]);
                string PaymentTypeFilter = QueryAES.UrlDecode(HttpContext.Current.Request.Form["PaymentTypeFilter"]);
                try
                {
                    Invoiceid = Invoiceid.Replace(" ", "+");
                    Invoiceid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(Invoiceid));
                }
                catch
                {
                }
                var paymentlist = Repository.Matter.InvoicePaymentbyInvoiceID(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Invoiceid, PaymentTypeFilter);
                return Ok(paymentlist);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Share invoice to client
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult ShareInvoicetoClient()
        {
            var db = new LawPracticeEntities();
            try
            {
                string Invoiceid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Invoiceid"]);
                try
                {
                    Invoiceid = Invoiceid.Replace(" ", "+");
                    Invoiceid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(Invoiceid));
                }
                catch
                {
                }
                var invversion = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invversion"]);
                if (invversion == "o")
                {
                    var versioninvid = db.Usp_GetInvoiceVersionList(Convert.ToString(LoggedInUser.FirmId), Convert.ToString(LoggedInUser.UserId), Convert.ToString(Invoiceid), invversion).Select(x => x.id).FirstOrDefault();
                    if (versioninvid != null)
                    {
                        Invoiceid = versioninvid.ToString();
                    }
                }
                else
                {
                    var versioninvid = db.Usp_GetInvoiceVersionList(Convert.ToString(LoggedInUser.FirmId), Convert.ToString(LoggedInUser.UserId), Convert.ToString(Invoiceid), invversion).Where(x => x.RowNum == Convert.ToInt32(invversion)).Select(x => x.id).FirstOrDefault();
                    if (versioninvid != null)
                    {
                        Invoiceid = versioninvid.ToString();
                    }
                }
                //get clientid
                var checkclient = db.usp_getinvoicenobyid(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Invoiceid).FirstOrDefault();
                if (checkclient != null)
                {
                    //check client is active or not
                    var clientdata = db.usp_wf_GetUserDetails(LoggedInUser.FirmId, checkclient.clientid).FirstOrDefault();
                    if (clientdata != null)
                    {
                        if (clientdata.IsActive == false)
                        {
                            return Ok("client is not active.");
                        }
                        else if (String.IsNullOrEmpty(clientdata.Username))
                        {
                            return Ok("client is not active.");
                        }
                        else
                        {
                            //update share inovice to client
                            var cnt = db.usp_SharedInvoicetoclient(LoggedInUser.FirmId.ToString(), Invoiceid, checkclient.clientid.ToString(), LoggedInUser.UserId.ToString());
                            //send email to client
                            try
                            {
                                if (checkclient.clientid.ToString() != "")
                                {
                                    var getemail = db.usp_GetEmailByUserId(LoggedInUser.FirmId.ToString(), checkclient.clientid.ToString()).FirstOrDefault();
                                    if (getemail != null)
                                    {
                                        string fromemail = WebConfigurationManager.AppSettings["fromemail"].ToString();
                                        //send email to user
                                        string strsubject = "", strbody = "";
                                        var getusername2 = db.usp_GetUserNameById(LoggedInUser.FirmId.ToString(), checkclient.clientid.ToString()).FirstOrDefault();
                                        if (getusername2 != null)
                                        {
                                            var msgusernames2 = getusername2.ToString();
                                            strbody += "Dear " + msgusernames2 + ",<br><br>";
                                        }
                                        strbody += "Greetings from myKase!<br><br>";
                                        //get case id by invid
                                        var chkcaseid = db.Usp_GetInvoiceDetailsByID(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), Invoiceid).FirstOrDefault();
                                        if (chkcaseid != null)
                                        {
                                            var getcase = db.usp_GetCaseNameById(LoggedInUser.FirmId.ToString(), chkcaseid.matterid.ToString()).FirstOrDefault();
                                            if (getcase != null)
                                            {
                                                string msgcase = getcase;
                                                strsubject = "myKase Alert-Invoice shared for the matter " + msgcase;
                                                var getusername = db.usp_GetUserNameById(LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString()).FirstOrDefault();
                                                if (getusername != null)
                                                {
                                                    var msgusernames = getusername.ToString();//QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(getusername.ToString()));
                                                    strbody += "You have received an Invoice for the matter " + msgcase + " from " + msgusernames + ".<br><br>";
                                                }
                                            }
                                        }
                                        string SiteUrl = WebConfigurationManager.AppSettings["SiteUrl"].ToString();
                                        strbody += "To view the invoice, please log in to <a href='" + SiteUrl + "' target='_blank'>myKase</a>.<br><br>";
                                        try
                                        {
                                            string AssignmentSubmittedMailBody = WebConfigurationManager.AppSettings["basicmailtemplate"].ToString();
                                            AssignmentSubmittedMailBody = AssignmentSubmittedMailBody.Replace("#CONTENT#", strbody);
                                            CommomUtility objmail = new CommomUtility();
                                            objmail.SendEmail(fromemail, getemail.EmailId, "", strsubject, AssignmentSubmittedMailBody, "");
                                        }
                                        catch (Exception ex)
                                        {
                                        }
                                    }
                                }
                            }
                            catch (Exception ex)
                            {
                            }
                            return Ok(cnt);
                        }
                    }
                    else
                    {
                        return Ok("Client not found");
                    }
                }
                else
                {
                    return Ok("Invoice not found.");
                }
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Save amend invoice details
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult SaveAmendInvoice()
        {
            int invocetaxtype = 0;
            try
            {
                string invoiceid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["token"]);
                if (invoiceid != "")
                {
                    invoiceid = invoiceid.ToString().Replace(" ", "+");
                    invoiceid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(invoiceid));
                }
                string invclient = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invclient"]);
                string invstate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invstate"]);
                string invsstate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invsstate"]);
                string invinvoicedate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invinvoicedate"]);
                string invduedate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invduedate"]);
                string invmob = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invmob"]);
                string invaddress = QueryAES.UrlDecodeEditor(HttpContext.Current.Request.Form["invaddress"]);
                string invsaddress = QueryAES.UrlDecodeEditor(HttpContext.Current.Request.Form["invsaddress"]);
                string invigstper = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invigstper"]);
                string invcgstper = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invcgstper"]);
                string invsgstper = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invsgstper"]);
                string invigsttempval = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invigsttempval"]);
                string invcgsttempval = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invcgsttempval"]);
                string invsgsttempval = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invsgsttempval"]);
                string invsubtotaltemp = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invsubtotaltemp"]);
                string finaltotaltemp = QueryAES.UrlDecode(HttpContext.Current.Request.Form["finaltotaltemp"]);
                string addressid = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["addressid"]));
                string desObj = QueryAES.UrlDecode(HttpContext.Current.Request.Form["itemlistdata"]);
                string payObj = QueryAES.UrlDecode(HttpContext.Current.Request.Form["itempaymentdata"]);
                string invoicetype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invoicetype"]);
                string UserNameFreeText = QueryAES.UrlDecode(HttpContext.Current.Request.Form["UserNameFreeText"]);
                string EmailText = QueryAES.UrlDecode(HttpContext.Current.Request.Form["EmailText"]);
                string MatterId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["MatterId"]);
                string clientgst = QueryAES.UrlDecode(HttpContext.Current.Request.Form["clientgst"]);
                string clientpan = QueryAES.UrlDecode(HttpContext.Current.Request.Form["clientpan"]);
                string invsubject = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invsubject"]);
                string invReference = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invReference"]);
                //Add for invoice tax optional
                if (invoicetype == "2")
                {
                    invocetaxtype = 1;
                }
                else
                {
                    invocetaxtype = 0;
                }
                if (invclient == "")
                {
                    invclient = "00000000-0000-0000-0000-000000000000";
                }
                var param = controllername + ">SaveAmendInvoice>AmendInvoice>param=" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var outputinvoice = Repository.Matter.amendinvoice(invoiceid, invclient, invstate, invinvoicedate, invduedate, invmob, invaddress, invigstper, invcgstper, invsgstper, invigsttempval, invcgsttempval, invsgsttempval, invsubtotaltemp, finaltotaltemp, desObj, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.FirmCode.ToString(), addressid, payObj, invsstate, invsaddress, invocetaxtype, UserNameFreeText, EmailText, MatterId, clientpan, clientgst, invsubject, invReference);
                return Ok(outputinvoice);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Recurrence Invoice
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult RecurrenceInvoice()
        {
            int invocetaxtype = 0;
            try
            {
                string invclient = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invclient"]);
                string invstate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invstate"]);
                string invsstate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invsstate"]);
                string invinvoicedate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invinvoicedate"]);
                string invduedate = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invduedate"]);
                string invmob = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invmob"]);
                string invaddress = QueryAES.UrlDecodeEditor(HttpContext.Current.Request.Form["invaddress"]);
                string invsaddress = QueryAES.UrlDecodeEditor(HttpContext.Current.Request.Form["invsaddress"]);
                string invigstper = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invigstper"]);
                string invcgstper = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invcgstper"]);
                string invsgstper = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invsgstper"]);
                string invigsttempval = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invigsttempval"]);
                string invcgsttempval = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invcgsttempval"]);
                string invsgsttempval = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invsgsttempval"]);
                string invsubtotaltemp = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invsubtotaltemp"]);
                string finaltotaltemp = QueryAES.UrlDecode(HttpContext.Current.Request.Form["finaltotaltemp"]);
                string addressid = Convert.ToString(QueryAES.UrlDecode(HttpContext.Current.Request.Form["addressid"]));
                string desObj = QueryAES.UrlDecode(HttpContext.Current.Request.Form["itemlistdata"]);
                string payObj = QueryAES.UrlDecode(HttpContext.Current.Request.Form["itempaymentdata"]);
                string invoicetype = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invoicetype"]);
                string UserNameFreeText = QueryAES.UrlDecode(HttpContext.Current.Request.Form["UserNameFreeText"]);
                string EmailText = QueryAES.UrlDecode(HttpContext.Current.Request.Form["EmailText"]);
                string MatterId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["MatterId"]);
                string invoiceid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["token"]);
                string clientgst = QueryAES.UrlDecode(HttpContext.Current.Request.Form["clientgst"]);
                string clientpan = QueryAES.UrlDecode(HttpContext.Current.Request.Form["clientpan"]);
                string invsubject = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invsubject"]);
                string invReference = QueryAES.UrlDecode(HttpContext.Current.Request.Form["invReference"]);
                if (invoiceid != "")
                {
                    invoiceid = invoiceid.ToString().Replace(" ", "+");
                    invoiceid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(invoiceid));
                }
                if (invclient == "")
                {
                    invclient = "00000000-0000-0000-0000-000000000000";
                }
                //Add for invoice tax optional
                if (invoicetype == "2")
                {
                    invocetaxtype = 1;
                }
                else
                {
                    invocetaxtype = 0;
                }
                var param = controllername + ">RecurrenceInvoice>Recurrenceinvoice>param=" + LoggedInUser.FirmId.ToString() + "@" + LoggedInUser.UserId.ToString();
                db1.usp_AddAudit(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), LoggedInUser.UserId, param, myIP(), GetMacAddress().ToString(), 0, "");
                var outputinvoice = Repository.Matter.Recurrenceinvoice(invoiceid, invclient, invstate, invinvoicedate, invduedate, invmob, invaddress, invigstper, invcgstper, invsgstper, invigsttempval, invcgsttempval, invsgsttempval, invsubtotaltemp, finaltotaltemp, desObj, LoggedInUser.FirmId.ToString(), LoggedInUser.UserId.ToString(), LoggedInUser.FirmCode.ToString(), addressid, payObj, invsstate, invsaddress, invocetaxtype, UserNameFreeText, EmailText, MatterId, clientpan, clientgst, invsubject, invReference);
                return Ok(outputinvoice);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Cancel invoice
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult CancelInvoice()
        {
            try
            {
                var Invoiceid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Invoiceid"]);
                if (Invoiceid != "")
                {
                    Invoiceid = Invoiceid.ToString().Replace(" ", "+");
                    Invoiceid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(Invoiceid));
                }
                var firmid = LoggedInUser.FirmId.ToString();
                var userid = LoggedInUser.UserId.ToString();
                var outputinvoice = Repository.Matter.CancelInvoice(firmid, userid, Invoiceid);
                return Ok(outputinvoice);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }

        /// <summary>
        /// Get Invoice Version List
        /// </summary>
        /// <returns></returns>
        [FirmApiAuthorization()]
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult InvoiceVersionList()
        {
            var db = new LawPracticeEntities();
            try
            {
                string Invoiceid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["Invoiceid"]);
                try
                {
                    Invoiceid = Invoiceid.Replace(" ", "+");
                    Invoiceid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(Invoiceid));
                }
                catch
                {
                }
                var versioninvid = db.Usp_GetInvoiceVersionList(Convert.ToString(LoggedInUser.FirmId), Convert.ToString(LoggedInUser.UserId), Convert.ToString(Invoiceid), "all").Where(x => x.id.ToString() != Invoiceid).ToList();
                var a = JsonConvert.SerializeObject(versioninvid);
                return Ok(a);
            }
            catch (Exception ex)
            {
                db1.usp_AddAuditError(Convert.ToInt32(EventType.Case), Convert.ToInt32(Severity.High), Convert.ToInt32(REQUEST_TYPE.API), Convert.ToString(EventType.Case), Convert.ToString(Severity.High), Convert.ToString(REQUEST_TYPE.API), null, "Message=" + ex.Message + "@Inner Exception=" + ex.InnerException + "@Stack Trace=" + ex.StackTrace, myIP(), GetMacAddress().ToString(), 1, "");
                return Ok();
            }
        }
        /// <summary>
        /// Get invoice version history
        /// </summary>
        /// <returns></returns>
        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LoadInvoiceVersionHistory()
        {
            try
            {
                var versionName = QueryAES.UrlDecode(HttpContext.Current.Request.Form["versionname"]);
                //var invoiceId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["InvoiceId"]);
                string Invoiceid = QueryAES.UrlDecode(HttpContext.Current.Request.Form["InvoiceId"]);
                try
                {
                    Invoiceid = Invoiceid.Replace(" ", "+");
                    Invoiceid = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(Invoiceid));
                }
                catch
                {
                }
                string OriginalInvId = QueryAES.UrlDecode(HttpContext.Current.Request.Form["OriginalInvoiceNo"]);
                try
                {
                    OriginalInvId = OriginalInvId.Replace(" ", "+");
                    OriginalInvId = QueryAES.DecryptAes(QueryAES.FromBase64StringWithReplace(OriginalInvId));
                }
                catch
                {
                }
                int pageno = 1;
                int pagesize = 10;
                DataTable list = DataAccessADO.GetVersionHistoryDetail(versionName, Invoiceid, OriginalInvId, pageno, pagesize);
                var a = JsonConvert.SerializeObject(list);
                return Ok(a);
            }
            catch (Exception er)
            {
                return Ok();
            }
        }
    }
}