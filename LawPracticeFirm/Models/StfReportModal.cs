using DataAccess.Modals;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace LawPracticeFirm.Models
{
    public class StfReportModal
    {
        public ObjectResult<sp_STF_CourtProcessReportCount_Result> CourtProcessReport { get; set; }
        public ObjectResult<sp_STF_CourtProcessServeReportCount_Result> CourtProcessServeReport { get; set; }

        public ObjectResult<sp_STF_CourtProcessNOTServeReportCount_Result> CourtProcessNOTServeReport { get; set; }

        public ObjectResult<sp_STF_CourtPWPresenceReportCount_Result> CourtPWPresenceReport { get; set; }

        public ObjectResult<sp_STF_CourtPWAbsenteReportCount_Result> CourtPWAbsenteReport { get; set; }

        public ObjectResult<sp_STF_CourtActionStatusReportCount_Result> CourtActionStatusReport { get; set; }

    }
    public class CourtProcessReportCount
    {
        public string CourtProcess { get; set; }
        public Nullable<int> CourtProcesCount { get; set; }
    }
}