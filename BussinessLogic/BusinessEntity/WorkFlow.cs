using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BussinessLogic.BusinessEntity
{
    [Serializable]
    public class WorkFlow
    {
        public long Id { get; set; }

        public string WorkFlowName { get; set; }

        public string WorkFlowInfo { get; set; }

        public bool IsPublished { get; set; }

        [DefaultValue(0)]
        public int AttachedWithCount { get; set; }

        public List<Tuple<string, string>> AttachedItems { get; set; }
    }
}
