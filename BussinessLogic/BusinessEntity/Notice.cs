using BussinessLogic.BusinessEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NoticeManagement.BusinessLayer.BusinessEntity
{
    public class Notice
    {
        public string SubectId { get; set; }
        public string PostedFiledocmodule { get; set; }
        public string ResonForHighPriority { get; set; }
        public string Tag { get; set; }
        public string SonOf { get; set; }
        public string RoOf { get; set; }
        public string NoticeID { get; set; }
        public string UserId { get; set; }
        public string Criticality { get; set; }
        public string Amountclaimed { get; set; }
        public string FirmId { get; set; }
        public string CaseStatus { get; set; }
        public string NoticeType { get; set; }
        public DateTime? NoticeCreatedOn { get; set; }
        public DateTime? DateofNotice { get; set; }
        public string ModeofServiceorDelivery { get; set; }
        public string AddressedTo { get; set; }
        public string AddresseeAddress { get; set; }
        public string OtherDetailsofAddressee { get; set; }
        public string SendersName { get; set; }
        public string SendersAddress { get; set; }
        public string OtherDetailsofSender { get; set; }
        public string NoticeSubject { get; set; }
        public string NoticeTitle { get; set; }
        public string CreateNotice { get; set; }
        public string NoticeThrough { get; set; }
        public DateTime? DateofDelivery { get; set; }
        public DateTime? DateofReceipt { get; set; }
        public DateTime? GenerationofAlerts { get; set; }
        public string AssignmentofTask { get; set; }
        public string CurrentStatus { get; set; }
        public string ClientName { get; set; }
        public string ManagerName { get; set; }
        public bool isClient { get; set; }
        public string TotalRows { get; set; }
        public bool IsFileAvailable { get; set; }
        public string postedFiledata { get; set; }
        public string NoticeThroughId { get; set; }
        public CustomizeFieldCollection customizefieldcollection { get; set; }

        public string col1 { get; set; }
        public string col2 { get; set; }
        public string col3 { get; set; }
        public string col4 { get; set; }
        public string col5 { get; set; }
        public string col6 { get; set; }
        public string col7 { get; set; }
        public string col8 { get; set; }
        public string col9 { get; set; }
        public string col10 { get; set; }
        public string col11 { get; set; }
        public string col12 { get; set; }
        public string col13 { get; set; }
        public string col14 { get; set; }
        public string col15 { get; set; }
        public string formtype { get; set; }
        public DateTime? DueDateOfNotice { get; set; }
        public string Senderothertxt { get; set; }
        public string SenderNameId { get; set; }

        public string ctxt1 { get; set; }
        public string ctxt2 { get; set; }
        public string ctxt3 { get; set; }
        public string ctxt4 { get; set; }
        public string ctxt5 { get; set; }
        public string ctxt6 { get; set; }
        public string ctxt7 { get; set; }
        public string ctxt8 { get; set; }
        public string ctxt9 { get; set; }
        public string ctxt10 { get; set; }
        public string ctxt11 { get; set; }
        public string ctxt12 { get; set; }
        public string ctxt13 { get; set; }
        public string ctxt14 { get; set; }
        public string ctxt15 { get; set; }
        public int ftype { get; set; }
        public int sum { get; set; }
        public string ReferenceNumber { get; set; }
        public string IntReferenceNumber { get; set; }

    }
}
