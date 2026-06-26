using System;

namespace BussinessLogic.BusinessEntity
{
    [Serializable]
    public class Case
    {
        public long CaseId { get; set; }

        public FieldDetail FieldDetails { get; set; }
    }

    [Serializable]
    public class Event
    {
        public long EventId { get; set; }

        public FieldDetail FieldDetails { get; set; }
    }

    [Serializable]
    public class Task
    {
        public long TaskId { get; set; }

        public FieldDetail FieldDetails { get; set; }
    }
}