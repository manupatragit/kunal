using System.Collections.Generic;
using BussinessLogic.Common;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace BussinessLogic.BusinessEntity
{
    public class Permission
    {
        [JsonConverter(typeof(StringEnumConverter))]
        public Module ModuleName { get; set; }
        public List<AccessRight> AccessRights { get; set; }

    }

    
}
