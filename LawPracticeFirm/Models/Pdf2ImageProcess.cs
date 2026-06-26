using Pdf2Image;
using System;
using System.Collections.Generic;
using System.IO;

namespace LawPracticeFirm.Models
{
    public class Pdf2ImageProcess
    {
        private bool IsDisposed = false;
        Dictionary<string, string> imagesdata = new Dictionary<string, string>();
        public  Dictionary<string, string> ExtractImagesFromPDF(string sourcePdf, string outputPath)
        {

            imagesdata.Clear();
            try
            {
                var pages = Pdf2Image.PdfSplitter.GetImages(sourcePdf, PdfSplitter.Scale.High);

                int i = 0;
                foreach (var page in pages)
                {
                    i = i + 1;
                    var tempfilename = Path.GetFileNameWithoutExtension(sourcePdf);
                    var filename = outputPath + "\\"+ tempfilename+"_Out_"+ i + ".jpg";
                    page.Save(filename);
                    imagesdata.Add(filename,System.IO.Path.GetFileName(filename));
                }
                pages = null;
                return imagesdata;

            }
            finally
            {
                Dispose();
                


            }

           
        }

        public void Dispose()
        {
            //Pass true in dispose method to clean managed resources too and say GC to skip finalize in next line.
            Dispose(true);
            //If dispose is called already then say GC to skip finalize on this instance.
            GC.SuppressFinalize(this);
        }
        protected virtual void Dispose(bool disposedStatus)
        {
            if (!IsDisposed)
            {
                IsDisposed = true;
                // Released unmanaged Resources
                if (disposedStatus)
                {
                    // Released managed Resources
                }
            }
        }
    }
}