using System;

namespace BussinessLogic.BusinessEntity
{
    [Serializable]
    public class CustomField
    {
        public long Id { get; set; }

        public string Text { get; set; }

        public string DefaultValues { get; set; }

        public string Formatter { get; set; }

        public bool IsActive { get; set; }

        public string Url { get; set; }
    }
}
