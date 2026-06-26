using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using BussinessLogic.Common;

namespace BussinessLogic.BusinessEntity
{
    [Serializable]
    public class FirmDetail
    {
        [DataMember]
        public string FirmCode { get; set; } = string.Empty;
        [DataMember]
        public string FirmLabel { get; set; } = string.Empty;
        [DataMember]
        public string FirmName { get; set; } = string.Empty;
        [DataMember]
        public string FirmBriefDetails { get; set; } = string.Empty;
        [DataMember]
        public string FirmDetails { get; set; } = string.Empty;
        [DataMember]
        public string FirmContactInformation { get; set; } = string.Empty;
        [DataMember]
        public string FirmContactno { get; set; } = string.Empty;
        [DataMember]
        public string FirmContactEmail { get; set; } = string.Empty;
        [DataMember]
        public List<WorkingHour> FirmWorkingHours { get; set; }
        [DataMember]
        public List<PracticeArea> PracticeAreas { get; set; }
        [DataMember]
        public List<Article> Articles { get; set; }
        [DataMember]
        public FirmEmployee AdminUser { get; set; }
    }

    [Serializable]
    public class FirmInputData
    {
        public long Id { get; set; }

        public FirmEmployee User { get; set; }

        public FirmClientUser Client { get; set; }

        public List<FirmData> Data { get; set; }

        public List<FirmWorkFlowData> WorkFlowData { get; set; }
    }

    [Serializable]
    public class FirmData
    {
        public long Id { get; set; }

        public long RefId { get; set; }

        public ModuleType ConfigurationType { get; set; }

        public long CustomFieldId { get; set; }

        public string DataValue { get; set; }
    }

    [Serializable]
    public class FirmWorkFlowData
    {

    }

    [Serializable]
    public class PracticeArea
    {
        [DataMember]
        public string AreaName { get; set; } = string.Empty;
        [DataMember]
        public string AreaDetails { get; set; } = string.Empty;
    }

    [Serializable]
    public class WorkingHour
    {
        [DataMember]
        public string Day { get; set; } = string.Empty;
        [DataMember]
        public string StartTime { get; set; } = string.Empty;
        [DataMember]
        public string EndTime { get; set; } = string.Empty;
    }

    [Serializable]
    public class Article
    {
        [DataMember]
        public string HeadLine { get; set; } = string.Empty;
        [DataMember]
        public string Details { get; set; } = string.Empty;
    }
}
