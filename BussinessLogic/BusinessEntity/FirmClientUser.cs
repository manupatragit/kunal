using System;
using System.Collections.Generic;
using System.ComponentModel;

namespace BussinessLogic.BusinessEntity
{
    [Serializable]
    public class FirmClientUser 
    {
        public long UserId { get; set; }

        public long FirmId { get; set; }

        public string UserName { get; set; }

        public string Password { get; set; }

        public List<Case> Cases { get; set; }

        public List<Event> Events { get; set; }

        public List<Task> Tasks { get; set; }

        public string Details { get; set; }

        [DefaultValue("Client")]
        public string DefaultController { get; set; } = "Client";

        [DefaultValue("Index")]
        public string DefaultAction { get; set; } = "Index";
    }
}
