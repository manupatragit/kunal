using DataAccess.Modals;
using LawPracticeFirm.Models;
using Newtonsoft.Json;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace BussinessLogic
{
    public class CommanNotice
    {
        /// <summary>
        /// Download bulk draft file
        /// </summary>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="NoticeId"></param>
        /// <returns></returns>
        public static string DownloadBulkDraftFile(string firmid, string userid, string NoticeId)
        {
            string outputs = "";
            LawPracticeEntities db = new LawPracticeEntities();
            var data = db.Usp_GetBulkNoticeToUnSavedAzureDocById(firmid, NoticeId).FirstOrDefault();
            if (data != null)
            {
                var maintemplateid = data.MainTemplateId;
                var currentnoticeid = data.Id;
                var selftemplateid = data.SelfTemplateId;
                var templatecontent = data.TemplateContentJson;
                templatecontent = templatecontent.TrimStart('[').TrimEnd(']');

                var isnoticeexist = db.sp_checknoticepathexist(currentnoticeid, null).FirstOrDefault();
                if (string.IsNullOrEmpty(isnoticeexist))
                {
                    var templdatecontent = db.sp_GetTemplatedataById(selftemplateid).FirstOrDefault();

                    var myDictionary = JsonConvert.DeserializeObject<Dictionary<string, string>>(templatecontent);


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

                        }

                        templatehtml = templatehtml.Replace("#" + key + "#", resultdata);
                    }
                    string filename = "DraftCopy_" + SaveCommonModulesDocument.randomno();
                    //filename = Regex.Replace(filename, @"[^0-9a-zA-Z.]+", "");
                    string folderPath = System.Web.Hosting.HostingEnvironment.MapPath("~/Documents/BulkNoticeDraft/DraftNotice/" + firmid.ToString() + "/" + userid.ToString() + "/");

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
                        folderpathazure = "Documents/BulkNoticeDraft/DraftNotice/" + firmid.ToString() + "/" + userid.ToString();
                        folderpathazure = folderpathazure.TrimEnd('/').TrimStart('/');
                        string fakepathout = "azuredirout/" + firmid.ToString() + "/" + userid.ToString();

                        if (!(Directory.Exists(System.Web.Hosting.HostingEnvironment.MapPath("~/" + fakepathout))))
                        {
                            Directory.CreateDirectory(System.Web.Hosting.HostingEnvironment.MapPath("~/" + fakepathout));
                        }

                        var input = pffth;
                        FileInfo fi = new FileInfo(input);
                        outputs = System.Web.Hosting.HostingEnvironment.MapPath("~/" + fakepathout + "/" + fi.Name);
                        QueryAES.FileEncrypt(input, outputs);

                        try
                        {
                            var status = AzureDocumentself.filecreateafteredit(outputs, folderpathazure, fi.Name, null, null);
                        }
#pragma warning disable CS0168 // The variable 'er' is declared but never used
                        catch (Exception er)
#pragma warning restore CS0168 // The variable 'er' is declared but never used
                        {
                            AzureDocumentself.CreateNestedDirectory(folderpathazure);

                            var status = AzureDocumentself.filecreateafteredit(outputs, folderpathazure, fi.Name, null, null);
                        }



                    }
#pragma warning disable CS0168 // The variable 'er' is declared but never used
                    catch (Exception er)
#pragma warning restore CS0168 // The variable 'er' is declared but never used
                    {

                    }

                    var returnpath = folderpathazure + "/" + filename + ".pdf";
                    try
                    {
                        db.sp_updatenoticepath(currentnoticeid, returnpath);
                    }
                    catch
                    {

                    }
                    return returnpath;
                }
                else
                {
                    return "";
                }
            }
            else
            {
                return "";
            }
        }
    }
}
