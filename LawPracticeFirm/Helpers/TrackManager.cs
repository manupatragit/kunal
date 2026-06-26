/**
 *
 * (c) Copyright Ascensio System SIA 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
using QueryStringEDAES;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Configuration;
using System.Web.Script.Serialization;

namespace LawPracticeFirm.Helpers
{
    public class TrackManager
    {
        /// <summary>
        /// Read request body
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public static Dictionary<string, object> readBody(HttpContext context)
        {
            string body;
            try
            {
                // read request body by streams and check if it is correct
                using (var receiveStream = context.Request.InputStream)
                using (var readStream = new StreamReader(receiveStream))
                {
                    body = readStream.ReadToEnd();
                    if (string.IsNullOrEmpty(body)) context.Response.Write("{\"error\":1,\"message\":\"Request stream is empty\"}");
                }
            }
            catch (Exception e)
            {
                throw new HttpException((int)HttpStatusCode.BadRequest, e.Message);
            }
            var jss = new JavaScriptSerializer();
            var fileData = jss.Deserialize<Dictionary<string, object>>(body);
            // check if the document token is enabled
            if (JwtManager.Enabled)
            {
                string JWTheader = WebConfigurationManager.AppSettings["files.docservice.header"].Equals("") ? "Authorization" : WebConfigurationManager.AppSettings["files.docservice.header"];
                string token = null;
                // if the document token is in the data
                if (fileData.ContainsKey("token"))
                {
                    token = JwtManager.Decode(fileData["token"].ToString());  // decode it
                }
                else if (context.Request.Headers.AllKeys.Contains(JWTheader, StringComparer.InvariantCultureIgnoreCase))  // if the Authorization header exists
                {
                    var headerToken = context.Request.Headers.Get(JWTheader).Substring("Bearer ".Length);
                    token = JwtManager.Decode(headerToken);  // decode its part after Authorization prefix
                }
                else  // otherwise, an error occurs
                {
                    context.Response.Write("{\"error\":1,\"message\":\"JWT expected\"}");
                }
                if (token != null && !token.Equals(""))  // invalid signature error
                {
                    fileData = (Dictionary<string, object>)jss.Deserialize<Dictionary<string, object>>(token)["payload"];
                }
                else
                {
                    context.Response.Write("{\"error\":1,\"message\":\"JWT validation failed\"}");
                }
            }
            return fileData;
        }

        /// <summary>
        /// File saving process
        /// </summary>
        /// <param name="fileData"></param>
        /// <param name="fileName"></param>
        /// <param name="userAddress"></param>
        /// <param name="newstoragepath"></param>
        /// <param name="newstoragepathenc"></param>
        /// <param name="Azurepath"></param>
        /// <returns></returns>
        public static int processSave(Dictionary<string, object> fileData, string fileName, string userAddress,string newstoragepath,string newstoragepathenc, string Azurepath)
        {
            if (fileData["url"].Equals(null)) {
                throw new Exception("DownloadUrl is null");
            }
            var downloadUri = (string)fileData["url"];
            DownloadToFile(downloadUri, newstoragepath, newstoragepathenc, Azurepath);  // save file to the storage directory
            return 0;
        }
        /// <summary>
        /// File force saving process
        /// </summary>
        /// <param name="fileData"></param>
        /// <param name="fileName"></param>
        /// <param name="userAddress"></param>
        /// <param name="newstoragepath"></param>
        /// <param name="newstoragepathenc"></param>
        /// <param name="Azurepath"></param>
        /// <returns></returns>
        public static int processForceSave(Dictionary<string, object> fileData, string fileName, string userAddress, string newstoragepath, string newstoragepathenc, string Azurepath)
        {
            if (fileData["url"].Equals(null)) {
                throw new Exception("DownloadUrl is null");
            }
            var downloadUri = (string)fileData["url"];
            string forcesavePath = "";
            DownloadToFile(downloadUri, newstoragepath, newstoragepathenc, Azurepath);  // save file to the storage directory
            return 0;
        }

        /// <summary>
        /// Create a command request
        /// </summary>
        /// <param name="method"></param>
        /// <param name="key"></param>
        public static void commandRequest(string method, string key)
        {
            string documentCommandUrl = WebConfigurationManager.AppSettings["files.docservice.url.site"] + WebConfigurationManager.AppSettings["files.docservice.url.command"];
            var request = (HttpWebRequest)WebRequest.Create(documentCommandUrl);
            request.Method = "POST";
            request.ContentType = "application/json";
            var body = new Dictionary<string, object>() {
                { "c", method },
                { "key", key }
            };
            // check if a secret key to generate token exists or not
            if (JwtManager.Enabled)
            {
                var payload = new Dictionary<string, object>
                    {
                        { "payload", body }
                    };
                var payloadToken = JwtManager.Encode(payload);  // encode a payload object into a header token
                var bodyToken = JwtManager.Encode(body);  // encode body into a body token
                string JWTheader = WebConfigurationManager.AppSettings["files.docservice.header"].Equals("") ? "Authorization" : WebConfigurationManager.AppSettings["files.docservice.header"];
                request.Headers.Add(JWTheader, "Bearer " + payloadToken);  // add a header Authorization with a header token and Authorization prefix in it
                body.Add("token", bodyToken);
            }
            var bytes = Encoding.UTF8.GetBytes(new JavaScriptSerializer().Serialize(body));
            request.ContentLength = bytes.Length;
            using (var requestStream = request.GetRequestStream())
            {
                // write bytes to the output stream
                requestStream.Write(bytes, 0, bytes.Length);
            }
            string dataResponse;
            using (var response = request.GetResponse())  // get the response
            using (var stream = response.GetResponseStream())
            {
                if (stream == null) throw new Exception("Response is null");
                using (var reader = new StreamReader(stream))
                {
                    dataResponse = reader.ReadToEnd();  // and read it
                }
            }
            // convert stream to json string
            var jss = new JavaScriptSerializer();
            var responseObj = jss.Deserialize<Dictionary<string, object>>(dataResponse);
            if (!responseObj["error"].ToString().Equals("0"))
            {
                throw new Exception(dataResponse);
            }
        }

        /// <summary>
        /// Save file information from the url to the file specified
        /// </summary>
        /// <param name="downloadUri"></param>
        /// <param name="path"></param>
        /// <param name="newstoragePath"></param>
        /// <param name="azurepath"></param>
        private static void DownloadToFile(string downloadUri, string path,string newstoragePath, string azurepath)
        {
            if (string.IsNullOrEmpty(downloadUri)) throw new ArgumentException("url");  // url isn't specified
            if (string.IsNullOrEmpty(path)) throw new ArgumentException("path");  // file isn't specified
            var uri = new Uri(downloadUri);
            LogService("withhttpsdownloadUri=" + downloadUri);
            var scheme = uri.GetLeftPart(UriPartial.Scheme);
            downloadUri = downloadUri.ToString().Replace("https://", "http://");
            LogService("downloadUri=" + downloadUri);
            var req = (HttpWebRequest)WebRequest.Create(downloadUri);
            using (var stream = req.GetResponse().GetResponseStream())  // get input stream of the file information from the url
            {
                if (stream == null) throw new Exception("stream is null");
                const int bufferSize = 4096;
                using (var fs = File.Open(path, FileMode.Create))
                {
                    var buffer = new byte[bufferSize];
                    int readed;
                    while ((readed = stream.Read(buffer, 0, bufferSize)) != 0)
                    {
                        fs.Write(buffer, 0, readed);  // write bytes to the output stream
                    }
                }
            }
            try
            {
                LogService("during edit spath=" + path);
                LogService("during edit enspath=" + newstoragePath);
                QueryAES.FileEncrypt(path, newstoragePath);
                File.Delete(path);
            }
            catch (Exception err)
            {
                LogService("during edit encty=" + err.Message);
            }
        }
        /// <summary>
        /// Service log file
        /// </summary>
        /// <param name="content"></param>
        private static void LogService(string content)
        {
            var templogpath = HttpContext.Current.Server.MapPath("//");
            FileStream fs = new FileStream(templogpath + "//CloudMyKaseoffiecSyncLog.txt", FileMode.OpenOrCreate, FileAccess.Write);
            StreamWriter sw = new StreamWriter(fs);
            sw.BaseStream.Seek(0, SeekOrigin.End);
            sw.WriteLine(content);
            sw.Flush();
            sw.Close();
        }
    }
}