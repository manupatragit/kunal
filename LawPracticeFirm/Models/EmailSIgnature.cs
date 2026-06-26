using System;

namespace LawPracticeFirm.Models
{
    /// <summary>
    /// Email signature
    /// </summary>
    public class EmailSignature
    {
        public int Id { get; set; }
        public string vUsername { get; set; }
        public string vName { get; set; }
        public string vOrgnisationname { get; set; }
        public string ReplyEmail { get; set; }
        public string AlertsFor { get; set; }
        public string dEntry { get; set; }
        public string dUpdated { get; set; }
        public string SignatureEmail { get; set; }
        public string SignatureMobile { get; set; }
        public string SignatureLogo { get; set; }
    }
}