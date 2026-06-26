using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace IPRManagement.BusinessLayer.BusinessEntity

{
   public class IPR
    {

        public string Id { get; set; }
        public string firmuser { get; set; }
        public string FirmId { get; set; }
        public string IP_Type { get; set; }
        public string Applicant_Type { get; set; }
        public string Applicant_Name { get; set; }
        public string Applicant_Address { get; set; }
        public string Applicant_Country { get; set; }
        public string Applicant_State { get; set; }
        public string Applicant_District { get; set; }
        public string Applicant_EmailId { get; set; }
        public string Applicant_PhoneNo { get; set; }
        public string Legal_Status { get; set; }
        public string Use_of_Mark { get; set; }
        public string Category_of_Mark { get; set; }
        public string Mark_of_title { get; set; }
        public string Image_description { get; set; }
        public string Isimage { get; set; }
        public string Conditions { get; set; }
        public string Class { get; set; }
        public string Priority { get; set; }
        public int IsActive { get; set; }
        public int IsArchive { get; set; }
        public string date_tine { get; set; }
    }


    public class Message
    {
        public string message { get; set; }
        public bool status { get; set; }
        public string output { get; set; }
        public bool checkForDraftId { get; set; }
        public string DraftId { get; set; }
        public string parentDraftId { get; set; }

        public string CaseID { get; set; }
    }
}

