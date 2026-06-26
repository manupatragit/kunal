using System;

namespace BussinessLogic.BusinessEntity
{
    [Serializable]
    public partial class ConfigurationTypes
    {
        public long Id { get; set; }

        public string Type { get; set; }
    }
}
