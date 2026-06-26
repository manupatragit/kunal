using System;

namespace LawPracticeFirm.Models
{
    public class OCRResult
    {
        /// <summary>
        /// Root object
        /// </summary>
        public class Rootobject
        {
            public Parsedresult[] ParsedResults { get; set; }
            public int OCRExitCode { get; set; }
            public bool IsErroredOnProcessing { get; set; }
            public string ErrorMessage { get; set; }
            public string ErrorDetails { get; set; }
            public string ProcessingTimeInMilliseconds { get; set; }
            public string SearchablePDFURL { get; set; }

        }
        /// <summary>
        /// Parse result model
        /// </summary>
        public class Parsedresult
        {
            public object FileParseExitCode { get; set; }
            public string ParsedText { get; set; }
            public string ErrorMessage { get; set; }
            public string ErrorDetails { get; set; }
        }
    }
}