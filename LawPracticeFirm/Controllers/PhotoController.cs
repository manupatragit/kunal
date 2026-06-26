using LawPracticeFirm.Common;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace LawPracticeFirm.Controllers
{
    public class PhotoController : BaseFirmController
    {
        // GET: Photo
       
        public ActionResult Index()
        {
            WebClient webClient = new WebClient();
            webClient.DownloadFile("http://10.60.1.47:8075/WorkSpace/2/3//AdminPanel.docx", @"D:\Project\LawPractice\LawPractice\LawPracticeFirm\WorkSpace\2\3\AdminPanel.docx");

            const int bufferLength = 10000;
            byte[] buffer = new Byte[bufferLength];
            int length = 0;
            Stream download = null;
            try
            {
                download = new FileStream(Server.MapPath("~/WorkSpace/2/3//AdminPanel.docx"),
                                                               FileMode.Open,
                                                               FileAccess.Read);
                do
                {
                    if (Response.IsClientConnected)
                    {
                        length = download.Read(buffer, 0, bufferLength);
                        Response.OutputStream.Write(buffer, 0, length);
                        buffer = new Byte[bufferLength];
                    }
                    else
                    {
                        length = -1;
                    }
                }
                while (length > 0);
                Response.Flush();
                Response.End();
            }
            finally
            {
                if (download != null)
                    download.Close();
            }
            return View();
        }
    }
}