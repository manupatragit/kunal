using DataAccess.Modals;
using Newtonsoft.Json;
using QueryStringEDAES;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace LawPracticeFirm.Models
{
    /// <summary>
    /// Bulk draft compressed
    /// </summary>
    public class BulkDraftCompressed
    {
        public string Between(string Text, string FirstString, string LastString)
        {
            string STR = Text;
            string STRFirst = FirstString;
            string STRLast = LastString;
            string FinalString;
            string TempString;
            int Pos1 = STR.IndexOf(FirstString) + FirstString.Length;
            int Pos2 = STR.IndexOf(LastString);
            FinalString = STR.Substring(Pos1, Pos2 - Pos1);
            return FinalString;
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
        /// Download notice in bulk
        /// </summary>
        /// <param name="maintemplateid"></param>
        /// <param name="firmid"></param>
        /// <param name="loginuserid"></param>
        /// <returns></returns>
        public Task<string> downloadNoticesInBulk(string maintemplateid, string firmid, string loginuserid)
        {
            var message = "Processing..,please wait it will take some time.......";
            string result = "";
            var arraylist = new ArrayList();
            var db = new LawPracticeEntities();
            db.sp_updateZipPathVal(maintemplateid, message);
            var noticelist = db.sp_GetNoticeList(maintemplateid).ToList();
            foreach (var item in noticelist)
            {
                var currentnoticeid = item.Id;
                var selftemplateid = item.SelfTemplateId;
                var templatecontent = item.TemplateContentJson;
                templatecontent = Between(templatecontent, "[", "]");
                var isnoticeexist = db.sp_checknoticepathexist(currentnoticeid,null).FirstOrDefault();
                if (string.IsNullOrEmpty(isnoticeexist))
                {
                    var templdatecontent = db.sp_GetTemplatedataById(selftemplateid).FirstOrDefault();
                    dynamic myDictionary = null;
                    try
                    {
                        myDictionary = JsonConvert.DeserializeObject<Dictionary<string, string>>(templatecontent);
                    }
                    catch (Exception ex)
                    {
                        var exs = ex.Message;
                    }
                    var templatehtml = "";
                    templatehtml += "<p>" + "Dated:" + DateTime.Now + "</p>";
                    templatehtml = templdatecontent.TemplateContent;
                    foreach (var key in myDictionary.Keys)
                    {
                        var resultdata = myDictionary[key];
                        try
                        {
                            DateTime.Parse(myDictionary[key]);
                            if (myDictionary[key].Contains("12:00:00 AM"))
                            {
                                resultdata = Convert.ToDateTime(myDictionary[key]).ToString("dd-MMM-yyyy");
                            }
                        }
                        catch
                        {
                            continue;
                        }
                        templatehtml = templatehtml.Replace("#" + key + "#", resultdata);
                    }
                    string filename = "DraftCopy_" + randomno();
                    string folderPath = "";
                    try
                    {
                        folderPath = System.Web.Hosting.HostingEnvironment.MapPath("~/Documents/BulkNoticeDraft/DraftNotice/" + firmid + "/" + maintemplateid + "/");
                    }
                    catch (Exception ex)
                    {
                        var abc = ex.Message;
                    }
                    if (!Directory.Exists(folderPath))
                    {
                        Directory.CreateDirectory(folderPath);
                    }
                    var htmlToPdf = new NReco.PdfGenerator.HtmlToPdfConverter();
                    var pdfBytes = htmlToPdf.GeneratePdf(templatehtml);
                    var pffth = folderPath + filename + ".pdf";
                    System.IO.File.WriteAllBytes(pffth, pdfBytes);
                    var folderpathazure = "";
                    try
                    {
                        folderpathazure = "Documents/BulkNoticeDraft/DraftNotice/" + firmid + "/" + maintemplateid;
                        folderpathazure = folderpathazure.TrimEnd('/').TrimStart('/');
                        string fakepathout = "azuredirout/" + firmid + "/" + maintemplateid;
                        if (!(Directory.Exists(HttpContext.Current.Server.MapPath("~/" + fakepathout))))
                        {
                            Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/" + fakepathout));
                        }
                        var input = pffth;
                        FileInfo fi = new FileInfo(input);
                        string outputs = HttpContext.Current.Server.MapPath("~/" + fakepathout + "/" + fi.Name);
                        QueryAES.FileEncrypt(input, outputs);
                        try
                        {
                            var status = AzureDocumentself.filecreateafteredit(outputs, folderpathazure, fi.Name, null, null);
                        }
                        catch (Exception er)
                        {
                            AzureDocumentself.CreateNestedDirectory(folderpathazure);
                            var status = AzureDocumentself.filecreateafteredit(outputs, folderpathazure, fi.Name, null, null);
                        }
                        Directory.Delete(fakepathout);
                    }
                    catch (Exception er)
                    {
                    }
                    var returnpath = folderpathazure + "/" + filename + ".pdf";
                    try
                    {
                        db.sp_updatenoticepath(currentnoticeid, returnpath);
                        Directory.Delete(folderPath);
                    }
                    catch
                    {
                    }
                    arraylist.Add(currentnoticeid);
                }
                else
                {
                    arraylist.Add(currentnoticeid);
                }
            }
            // var date = DateTime.Now;
            string startPath = HttpContext.Current.Server.MapPath("~/ZipOut/" + firmid + "/" + maintemplateid);
            foreach (var value in arraylist)
            {
                var downloadpath1 = "";
                downloadpath1 = value.ToString();
                string downloadpathnew = "";
                var fullpath = "";
                var fullpath2 = "";
                var filename = "";
                var getnoticedata = db.sp_checknoticepathexist(downloadpath1,null).FirstOrDefault();
                if (getnoticedata != null)
                {
                    fullpath = HttpContext.Current.Server.MapPath("~/ZipIn/" + firmid + "/" + maintemplateid);
                    fullpath2 = HttpContext.Current.Server.MapPath("~/ZipOut/" + firmid + "/" + maintemplateid);
                    if (!Directory.Exists(fullpath))
                    {
                        Directory.CreateDirectory(fullpath);
                    }
                    if (!Directory.Exists(fullpath2))
                    {
                        Directory.CreateDirectory(fullpath2);
                    }
                    downloadpathnew = getnoticedata.TrimEnd('/').Remove(getnoticedata.LastIndexOf('/') + 1).TrimEnd('/').TrimStart('/');
                    filename = getnoticedata.TrimEnd('/').Substring(getnoticedata.LastIndexOf('/') + 1);
                }
                var outputs = AzureDocumentself.Dirfilepath(downloadpathnew, filename, fullpath, fullpath2, firmid, loginuserid);
            }
            try
            {
                if (File.Exists(startPath + ".zip"))
                {
                    try
                    {
                        File.Delete(startPath + ".zip");
                    }
                    catch (Exception ex)
                    {
                    }
                }
                ZipFile.CreateFromDirectory(startPath, startPath + ".zip");
                result = "/ZipOut/" + firmid + "/" + maintemplateid + ".zip";
                db.sp_updateZipPathVal(maintemplateid, result);
                if (Directory.Exists(startPath))
                {
                    try
                    {
                        Directory.Delete(startPath, true);
                    }
                    catch (Exception ex)
                    {
                    }
                }
            }
            catch (Exception ex)
            {
                var tt = ex.Message;
                db.sp_updateZipPathVal(maintemplateid, null);
            }
            return Task.FromResult(result);
        }
    }
}