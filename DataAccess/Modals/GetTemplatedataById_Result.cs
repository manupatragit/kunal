using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Modals
{
    public class GetTemplatedataById_Result
    {
        public string Id { get; set; }
        public string TemplateContent { get; set; }
        public string TemplateName { get; set; }
        public string TempLanguage { get; set; }
    }
}
