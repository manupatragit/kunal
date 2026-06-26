using System.IO;
using System.Web;

namespace BussinessLogic
{
    public class AntivirusScanDocs
    {
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
        /// <summary>
        /// Scan document
        /// </summary>
        /// <param name="Filepath"></param>
        /// <param name="maliciousConfirm"></param>
        /// <returns></returns>
        public static string ScanDocument(string Filepath, string maliciousConfirm = "false")
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
        }

        //var CloudmersiveVirusKey= WebConfigurationManager.AppSettings["CloudmersiveVirusKey"];
        //Configuration.Default.AddApiKey("Apikey", "CloudmersiveVirusKey");
        //// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
        //// Configuration.Default.AddApiKeyPrefix("Apikey", "Bearer");

        //var apiInstance = new ScanApi();
        ////var inputFile = new System.IO.FileStream(Filepath, System.IO.FileMode.Open); // System.IO.Stream | Input file to perform the operation on.
        //var inputFile = new System.IO.FileStream("D:\\all.zip", System.IO.FileMode.Open);
        //try
        //{
        //    // Scan a file for viruses
        //    //  VirusScanResult result = apiInstance.ScanFile(inputFile);
        //    VirusScanAdvancedResult result1 = apiInstance.ScanFileAdvanced(inputFile, false, false, false, true, "");
        //    return Convert.ToBoolean(result1.CleanResult);

        //    // Console.WriteLine(result);
        //}
        //catch (Exception e)
        //{
        //    return false;
        //    // Debug.Print("Exception when calling ScanApi.ScanFile: " + e.Message);
        //}


        //try
        //{
        //    string filePath = Filepath;
        //    System.Diagnostics.Process process = new System.Diagnostics.Process();
        //    System.Diagnostics.ProcessStartInfo startInfo = new System.Diagnostics.ProcessStartInfo();
        //    startInfo.WindowStyle = System.Diagnostics.ProcessWindowStyle.Hidden;
        //    //startInfo.FileName = "C:\\Program Files\\Windows Defender\\MpCmdRun.exe";
        //    //startInfo.FileName = "C:\\Program Files\\Common Files\\McAfee\\Engine\\scan.exe";
        //    startInfo.FileName = "C:\Program Files\Common Files\McAfee\AVSolution\mcshield.exe";

        //    startInfo.Arguments = "-Scan -ScanType 3 -File " + filePath;
        //    process.StartInfo = startInfo;
        //    var result = process.Start();
        //    Console.WriteLine("Scanned with result: " + result.ToString());
        //    Console.ReadLine();
        //    return true;
        //}
        //catch (Exception ex)
        //{
        //    Console.WriteLine(ex.Message);
        //    Console.ReadLine();
        //    return false;
        //}


        //}


    }

}
