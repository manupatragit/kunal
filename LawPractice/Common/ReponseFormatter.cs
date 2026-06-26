using Microsoft.AspNetCore.Mvc.Formatters;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LawPractice.Common
{
    public class ReponseFormatter : IOutputFormatter
    {
        public bool CanWriteResult(OutputFormatterCanWriteContext context)
        {
            if (context == null) throw new ArgumentNullException(nameof(context));
            if (context.ContentType == null || context.ContentType.ToString() == "application/json")
                return true;

            return false;
        }

        public async Task WriteAsync(OutputFormatterWriteContext context)
        {
            if (context == null) throw new ArgumentNullException(nameof(context));
            var response = context.HttpContext.Response; response.ContentType = "application/json";

            using (var writer = context.WriterFactory(response.Body, Encoding.UTF8))
            {
                //object JSON = null;
                //JsonConvert.SerializeObject(context.Object);
                writer.Write(JsonConvert.SerializeObject(context.Object));
                await writer.FlushAsync();
            }
        }

    }
}
