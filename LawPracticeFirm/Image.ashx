<%@ WebHandler Language="C#" Class="Image" %>

using System;
using System.Web;
using System.IO;
using System.Web.SessionState;
using System.Drawing;
using System.Drawing.Imaging;
public class Image : IHttpHandler, System.Web.SessionState.IRequiresSessionState
{

    public void ProcessRequest(HttpContext context)
    {
        bool noisy = true;
        string ctype = "m";
        if (!string.IsNullOrEmpty(context.Request.QueryString["noisy"]))
        {
            noisy = Convert.ToBoolean(context.Request.QueryString["noisy"]);
        }

        if (!string.IsNullOrEmpty(context.Request.QueryString["ctype"]))
        {
            ctype = Convert.ToString(context.Request.QueryString["ctype"]);
        }

        try
        {
            
            var random = new Random((int)DateTime.Now.Ticks);

            string captcha = "";
            if (ctype == "m")
            {
                //generate new question 
                int a = random.Next(10, 99);
                int b = random.Next(0, 9);
                captcha = string.Format("{0} + {1} = ?", a, b);
                //store answer 
                int cval = a + b;
                context.Session["MathCaptcha"] = Convert.ToString(cval);
            }
            else if (ctype == "t")
            {

                int a = random.Next(10, 99);
                int b = random.Next(0, 9);
                captcha = Convert.ToBase64String(Guid.NewGuid().ToByteArray()).Substring(0, 6);
                context.Session["MathCaptcha"] = Convert.ToString(captcha);
            }
            else
            {
                int a = random.Next(10, 99);
                int b = random.Next(0, 9);
                captcha = string.Format("{0} + {1} = ?", a, b);
                //store answer 
                int cval = a + b;
                context.Session["MathCaptcha"] = Convert.ToString(cval);
            }

            using (var mem = new MemoryStream())
            using (var bmp = new Bitmap(130, 30))
            using (var gfx = Graphics.FromImage((System.Drawing.Image)bmp))
            {
                gfx.TextRenderingHint = System.Drawing.Text.TextRenderingHint.ClearTypeGridFit;
                gfx.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.AntiAlias;
                gfx.FillRectangle(Brushes.White, new Rectangle(0, 0, bmp.Width, bmp.Height));

                //add noise 
                if (noisy)
                {
                    int i;
                    int r, x, y;
                    var pen = new Pen(Color.Yellow);
                    for (i = 1; i < 10; i++)
                    {
                        pen.Color = Color.FromArgb(
                        (random.Next(0, 255)),
                        (random.Next(0, 255)),
                        (random.Next(0, 255)));

                        r = random.Next(0, (130 / 3));
                        x = random.Next(0, 130);
                        y = random.Next(0, 30);

                        var j = x - r;
                        var k = y - r;
                        gfx.DrawEllipse(pen, j, k, r, r);
                    }
                }

                //add question 
                gfx.DrawString(captcha, new Font("Arial", 15), Brushes.Gray, 2, 3);
                gfx.Flush();
                bmp.Save(mem, ImageFormat.Jpeg);
                byte[] imgBytes = mem.GetBuffer();
                gfx.Dispose();
                bmp.Dispose();


                //write image  
                context.Response.ContentType = "image/jpeg";
                context.Response.BinaryWrite(imgBytes);  
            }
        }
        catch (Exception ex)
        {
            context.Response.ContentType = "image/jpeg";
            context.Response.Write(ex.Message);
        }
        finally
        {
            context.Response.End();
        }
             
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }    
   
}
