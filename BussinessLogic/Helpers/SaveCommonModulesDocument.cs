using LawPracticeFirm.Models;
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.IO;
using System.Web;
namespace BussinessLogic
{
    public class SaveCommonModulesDocument
    {
        /// <summary>
        /// Get chk valid extension
        /// </summary>
        /// <param name="ext"></param>
        /// <returns></returns>
        public static int chkValidExtension(string ext)
        {
            int is_valid = 0;
            string[] PosterAllowedExtensions = new string[] { ".doc", ".docx", ".pdf", ".xls", ".xlsx", ".txt", ".ppt", ".pptx", ".csv", ".jpg", ".jpeg", ".png", ".jfif", ".tiff", ".mp4" };
            for (int i = 0; i < PosterAllowedExtensions.Length; i++)
            {
                if (ext.ToLower() == PosterAllowedExtensions[i])
                {
                    is_valid = 1;
                }
            }
            if (is_valid == 0)
            {
                throw new Exception("Invalid File Extention");
            }
            return 0;
        }
        /// <summary>
        /// Upload document
        /// </summary>
        /// <param name="httpRequest"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="ModuleName"></param>
        /// <param name="isVirusScan"></param>
        /// <returns></returns>
        public static DocUploadResult UploadDocument(HttpPostedFile httpRequest, string firmid, string userid, string ModuleName, bool isVirusScan = false)
        {
            DocUploadResult DUResult = new DocUploadResult();
            string folderPath = FindDocumentPath(ModuleName, firmid, userid);
            string folderpathazure = FindAzureDocuementPath(ModuleName, firmid, userid);
            var myList = new List<string>();
            var documentnamesize = new List<string>();
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }
            var postedFile = httpRequest;
            var fileName = Path.GetFileNameWithoutExtension(postedFile.FileName);
            var fileext = Path.GetExtension(postedFile.FileName);
            var fileextchk = Path.GetExtension(postedFile.FileName);
            var is_valid = chkValidExtension(fileextchk);
            var fileName1 = "_E2bdADS__" + fileName + randomno() + fileext;
            var fileNameemail = randomno() + fileName + fileext;
            var filePath = folderPath + Path.GetFileName(fileName1);
            postedFile.SaveAs(filePath);
            FileInfo fi = new FileInfo(filePath);
            var DocSize = fi.Length;
            string input = filePath;
            //start scan file
            if (isVirusScan == true)
            {
                var scanresult = AntivirusScanDocs.ScanDocument(input, "false");
                if (scanresult.ToLower().ToString() != "true")
                {
                    try
                    {
                        if (File.Exists(input))
                        {
                            GC.Collect();
                            GC.WaitForPendingFinalizers();
                            File.Delete(input);
                        }
                    }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
                    catch (Exception ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
                    {
                    }
                    DUResult.InfectedFile = postedFile.FileName;
                    return DUResult;
                }
            }
            //end scan file
            //start email file
            var emailfilePath = folderPath + Path.GetFileName(fileNameemail);
            postedFile.SaveAs(emailfilePath);
            //end email file
            string tempflname = fileName1;
            tempflname = tempflname.Remove(0, 10);
            string output = folderPath + Path.GetFileName(tempflname);
            QueryAES.FileEncrypt(input, output);
            try
            {
                var status = AzureDocumentself.filecreateafteredit(output, folderpathazure, Path.GetFileName(tempflname), null, null);
            }
#pragma warning disable CS0168 // The variable 'er' is declared but never used
            catch (Exception er)
#pragma warning restore CS0168 // The variable 'er' is declared but never used
            {
                AzureDocumentself.CreateNestedDirectory(folderpathazure);
                var status = AzureDocumentself.filecreateafteredit(output, folderpathazure, Path.GetFileName(tempflname), null, null);
            }
            //delete file
            try
            {
                System.IO.File.Delete(input);
            }
            catch
            {
            }
            DUResult.FileName = tempflname;
            DUResult.FileSize = DocSize.ToString();
            DUResult.EmailFilePath = emailfilePath;
            return DUResult;
        }
        /// <summary>
        /// Generate random number
        /// </summary>
        /// <returns></returns>
        public static string randomno()
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
        /// Find azure document path
        /// </summary>
        /// <param name="moduleName"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public static string FindAzureDocuementPath(string moduleName, string firmid, string userid)
        {
            var folderpathazure = "";
            if (moduleName == "task")
            {
                folderpathazure = "Documents/CaseTask/" + firmid + "/" + userid;
            }
            else if (moduleName == "communique")
            {
                folderpathazure = "Documents/CaseCommunique/" + firmid + "/" + userid;
            }
            else if (moduleName == "TimeEntry")
            {
                folderpathazure = "Documents/TimeEntry/" + firmid + "/" + userid;
            }
            else if (moduleName == "completetask")
            {
                folderpathazure = "Documents/CaseTask/" + firmid + "/" + userid;
            }
            else if (moduleName == "Expense")
            {
                folderpathazure = "Documents/Expensedocuments/" + firmid + "/" + userid;
            }
            else if (moduleName == "FeedBackForm")
            {
                folderpathazure = "Documents/FeedBackForm/" + firmid + "/" + userid;
            }
            else if (moduleName == "Lead")
            {
                folderpathazure = "Documents/Leaddocuments/" + firmid + "/" + userid;
            }
            return folderpathazure;
        }
        /// <summary>
        /// Find document path
        /// </summary>
        /// <param name="moduleName"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public static string FindDocumentPath(string moduleName, string firmid, string userid)
        {
            var folderPath = "";
            if (moduleName == "task")
            {
                folderPath = HttpContext.Current.Server.MapPath("~/Documents/CaseTask/" + firmid + "/" + userid + "/");
            }
            else if (moduleName == "communique")
            {
                folderPath = HttpContext.Current.Server.MapPath("~/Documents/CaseCommunique/" + firmid + "/" + userid + "/");
            }
            else if (moduleName == "TimeEntry")
            {
                folderPath = HttpContext.Current.Server.MapPath("~/Documents/TimeEntry/" + firmid + "/" + userid + "/");
            }
            else if (moduleName == "completetask")
            {
                folderPath = HttpContext.Current.Server.MapPath("~/Documents/CaseTask/" + firmid + "/" + userid + "/");
            }
            else if (moduleName == "Expense")
            {
                folderPath = HttpContext.Current.Server.MapPath("~/Documents/Expensedocuments/" + firmid + "/" + userid + "/");
            }
            else if (moduleName == "FeedBackForm")
            {
                folderPath = HttpContext.Current.Server.MapPath("~/Documents/Expensedocuments/" + firmid + "/" + userid + "/");
            }
            else if (moduleName == "Lead")
            {
                folderPath = HttpContext.Current.Server.MapPath("~/Documents/Leaddocuments/" + firmid + "/" + userid + "/");
            }
            return folderPath;
        }
    }
}
