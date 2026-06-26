using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Web;
using System.Web.Mvc;

namespace LawPracticeFirm.Models
{
    /// <summary>
    /// Notice model
    /// </summary>
    public class NoticeModal
    {
        public string NoticeID { get; set; }
        public string UserId { get; set; }
        public string FirmId { get; set; }
        [DisplayName("Case Status")]
        public string CaseStatus { get; set; }
        [DisplayName("Notice Type")]
        public string NoticeType { get; set; }
        [Column(TypeName = "datetime2")]
        public DateTime? NoticeCreatedOn { get; set; }
        [DisplayName("Date of Notice")]
        [Required(ErrorMessage = "Date of Notice is required.")]
        [Column(TypeName = "datetime2")]
        public DateTime DateofNotice { get; set; }
        [DisplayName("Mode of Service Delivery")]
        [Required(ErrorMessage = "Mode of Service or Delivery is required.")]
        public string ModeofServiceorDelivery { get; set; }
        [DisplayName("Addressed To")]
        [Required(ErrorMessage = "Addressed To is required.")]
        public string AddressedTo { get; set; }
        [DisplayName("Addressee Address")]
        [Required(ErrorMessage = "Addressee Address To is required.")]
        public string AddresseeAddress { get; set; }
        [DisplayName("Other Details of Addressee")]
        [Required(ErrorMessage = "Other Details of Addressee is required.")]
        public string OtherDetailsofAddressee { get; set; }
        [DisplayName("Senders Name")]
        [Required(ErrorMessage = "Sender's Name is required.")]
        public string SendersName { get; set; }
        [DisplayName("Senders Address")]
        [Required(ErrorMessage = "Sender's Address is required.")]
        public string SendersAddress { get; set; }
        [DisplayName("Other Details of Sender")]
        [Required(ErrorMessage = "Other Details of Sender is required.")]
        public string OtherDetailsofSender { get; set; }
        [DisplayName("Notice Subject")]
        [Required(ErrorMessage = "Notice Subject is required.")]
        public string NoticeSubject { get; set; }
        [DisplayName("Notice Title")]
        public string NoticeTitle { get; set; }
        [DisplayName("Create Notice")]
        [Required(ErrorMessage = "Create Notice is required.")]
        [AllowHtml]
        public string CreateNotice { get; set; }
        [DisplayName("Notice Through")]
        [Required(ErrorMessage = "Notice Through is required.")]
        public string NoticeThrough { get; set; }
        [DisplayName("Date of Delivery")]
        [Column(TypeName = "datetime2")]
        public DateTime? DateofDelivery { get; set; }
        [DisplayName("Date of Receipt")]
        [Required(ErrorMessage = "Date of Receipt is required.")]
        [Column(TypeName = "datetime2")]
        public DateTime? DateofReceipt { get; set; }
        [DisplayName("Generation of Alerts")]
        [Column(TypeName = "datetime2")]
        public DateTime? GenerationofAlerts { get; set; }
        [DisplayName("AssignmentofTask")]
        public string AssignmentofTask { get; set; }
        [DisplayName("CurrentStatus")]
        public string CurrentStatus { get; set; }
        public HttpPostedFileBase[] Files{ get; set; }
        public string ClientName { get; set; }
        public string ManagerName { get; set; }
        public bool isClient { get; set; }
        public string TotalRows { get; set; }
        public FileUpload FileName { get; set; }
        public bool IsFileAvailable { get; set; }
    }
    /// <summary>
    /// Notice type enum
    /// </summary>
    public enum TypeOfNotice
    {
        Statutory,
        NoticeType2
    }
    /// <summary>
    /// File upload model
    /// </summary>
    public class FileUpload
    {
        public string FileId { get; set; }
        public string FileName { get; set; }
        public string FileUrl { get; set; }
        public IEnumerable<FileUpload> FileList { get; set; }
    }
}