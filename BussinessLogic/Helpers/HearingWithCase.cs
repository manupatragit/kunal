using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BussinessLogic.Models
{
    public   class HearingWithCase
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public List<data> data { get; set; }

    }
    public class data
    {
        [JsonProperty("NexthearingDate")]
        public string NextHearing { get; set; }

        [JsonProperty("iid")]
        public string UserCaseid { get; set; }

        [JsonProperty("CaseId")]
        public string CaseId { get; set; }
    }
      

}