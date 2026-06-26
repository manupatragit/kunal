using DataAccess.Modals;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
namespace LawPracticeFirm.Models
{
    /// <summary>
    /// Save mykase document
    /// </summary>
    public class SaveMykaseDocument
    {
        /// <summary>
        /// Save Mykase Document To Other Module
        /// </summary>
        /// <param name="FileId"></param>
        /// <param name="moduleName"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <param name="downloadfilemothod"></param>
        /// <returns></returns>
        public static string SaveMykaseDocumentToOtherModule(string FileId, string moduleName, string firmid, string userid, string downloadfilemothod = null)
        {
            try
            {
                var myList = new List<string>();
                var db = new LawPracticeEntities();
                dynamic FileNamelist = "";
                //get azurepath 
                string[] values = FileId.TrimStart(',').TrimEnd(',').Split(',');
                for (int i = 0; i < values.Length; i++)
                {
                    values[i] = values[i].Trim();
                    if (!String.IsNullOrEmpty(values[i]))
                    {
                        //get document details
                        var documentdetails = db.usp_CheckFilefolderCloud(firmid, values[i]).FirstOrDefault();
                        if (documentdetails != null)
                        {
                            var Sourceazurepath = documentdetails.AZureFileId;
                            var SourceFileName = documentdetails.fname;
                            string fakepathin = HttpContext.Current.Server.MapPath("~/azuredirin/" + firmid + "/" + userid);
                            var fakepathout = HttpContext.Current.Server.MapPath("~/Documents/OcrDocuments/" + firmid + "/" + userid);
                            if (!Directory.Exists(fakepathin))
                            {
                                Directory.CreateDirectory(fakepathin);
                            }
                            if (!Directory.Exists(fakepathout))
                            {
                                Directory.CreateDirectory(fakepathout);
                            }
                            if (String.IsNullOrEmpty(downloadfilemothod))
                            {
                                var folderpathazure = FindModuleAzurePath(moduleName, firmid, userid);
                                if (!String.IsNullOrEmpty(folderpathazure))
                                {
                                    //get source document from mykaseazure
                                    // var output = AzureDocument.DownloadFileWithOutDecrypt(Sourceazurepath, SourceFileName, fakepathin, firmid, userid);
                                    //rename file
                                    var fileNameWithoutEXT = Path.GetFileNameWithoutExtension(SourceFileName);
                                    var fileext = Path.GetExtension(SourceFileName);
                                    var NewFileName = fileNameWithoutEXT + randomno() + fileext;
                                    //save final docs to azure
                                    // var status = AzureDocumentself.filecreateafteredit(output, folderpathazure, NewFileName, null, null);
                                    var status = AzureDocument.CopyFromMykaseDocumenttoOtherModule(SourceFileName, NewFileName, folderpathazure, Sourceazurepath, firmid, userid);
                                    if (status == true)
                                    {
                                        myList.Add(NewFileName);
                                    }
                                }
                            }
                            else
                            {
                                //get source document from mykaseazure
                                var output = AzureDocument.Dirfilepath(Sourceazurepath, SourceFileName, fakepathin, fakepathout, firmid, userid);
                                //rename file
                                if (!String.IsNullOrEmpty(output))
                                {
                                    myList.Add(output);
                                }
                            }
                        }
                    }
                }
                var filearray = myList.ToArray();
                FileNamelist = string.Join("|", filearray);
                return FileNamelist;
            }
            catch
            {
                return "";
            }
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
        /// Find module azure path
        /// </summary>
        /// <param name="moduleName"></param>
        /// <param name="firmid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public static string FindModuleAzurePath(string moduleName, string firmid, string userid)
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
            return folderpathazure;
        }
    }
}