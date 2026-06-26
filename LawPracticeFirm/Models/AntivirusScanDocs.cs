using System.IO;
using System.Web;
namespace LawPracticeFirm
{
    public class AntivirusScanDocs
    {
        /// <summary>
        /// Log service
        /// </summary>
        /// <param name="content"></param>
        private static void LogService(string content)
        {
            var templogpath = HttpContext.Current.Server.MapPath("//");
            FileStream fs = new FileStream(templogpath + "//azureofficefile22.txt", FileMode.OpenOrCreate, FileAccess.Write);
            StreamWriter sw = new StreamWriter(fs);
            sw.BaseStream.Seek(0, SeekOrigin.End);
            sw.WriteLine(content);
            sw.Flush();
            sw.Close();
        }
        public static string ScanDocument(string Filepath,string maliciousConfirm="false")
        {
            return "true";
            //if (maliciousConfirm == "true")
            //    return "true";
            //var fileext = Path.GetExtension(Filepath);
            //if (fileext.ToLower() == ".exe" || fileext.ToLower() == ".bat")
            //{
            //    return "false";
            //}
            //var CloudmersiveVirusKey = WebConfigurationManager.AppSettings["CloudmersiveVirusKey"];
            //Configuration.Default.AddApiKey("Apikey", CloudmersiveVirusKey.ToString());
            //Configuration.Default.Timeout = 300000;
            //var apiInstance = new ScanApi();
            //using (var inputFile = new System.IO.FileStream(Filepath, FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.ReadWrite))
            //{
            //    try
            //    {
            //        if (fileext.ToLower() == ".rar" || fileext.ToLower() == ".zip" || fileext.ToLower() == ".rar4")
            //        {
            //            VirusScanAdvancedResult result1 = apiInstance.ScanFileAdvanced(inputFile, false, false, false, true);
            //            var dt = Convert.ToBoolean(result1.CleanResult);
            //            LogService("success antivirus Filepath:" + Filepath);
            //            inputFile.Dispose();
            //            return dt.ToString();
            //        }
            //        else
            //        {
            //            VirusScanResult result1 = apiInstance.ScanFile(inputFile);
            //            var dt = Convert.ToBoolean(result1.CleanResult);
            //            LogService("success antivirus Filepath:" + Filepath);
            //            inputFile.Dispose();
            //            return dt.ToString();
            //        }
            //        // Console.WriteLine(result);
            //    }
            //    catch (Exception e)
            //    {
            //        LogService("error scanner antivirus:  " + e.Message + " | " + e.StackTrace + " | " + e.InnerException + " | Filepath:" + Filepath);
            //        inputFile.Dispose();
            //        // Debug.Print("Exception when calling ScanApi.ScanFile: " + e.Message);
            //        return (e.Message + " | " + e.StackTrace + " | " + e.InnerException + " | Filepath:" + Filepath).ToString();
            //    }
            //}
        }
    }
}
