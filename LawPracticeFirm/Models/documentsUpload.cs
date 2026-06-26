using System.Web;

namespace LawPracticeFirm.Models
{
    /// <summary>
    /// Upload documents
    /// </summary>
    public class documentsUpload
    {
        public HttpPostedFileBase cfile { get; set; }
    }
}