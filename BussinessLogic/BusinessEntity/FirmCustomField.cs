using System;
using System.Collections.Generic;

namespace BussinessLogic.BusinessEntity
{
    [Serializable]
    public class FirmCustomField
    {
        public long Id { get; set; }

        public int Sequence { get; set; }

        public long FirmId { get; set; }

        public long ConfigurationType { get; set; }

        public string SubConfigurationType { get; set; }

        public string FieldName { get; set; }

        public long FieldType { get; set; }

        public bool IsRequired { get; set; }

        public int MinLength { get; set; }

        public int MaxLength { get; set; }

        public string FieldValues { get; set; }

        public string Formatter { get; set; }

        public bool IsDefault { get; set; }

        public bool IsSortable { get; set; }

        public string Url { get; set; }
    }

    [Serializable]
    public class FirmCustomFieldList
    {

        public string FormId { get; set; }

        public string FormName { get; set; }

        public bool IsPublished { get; set; }


        public List<FirmCustomField> CustomFieldList { get; set; }
    }
}
