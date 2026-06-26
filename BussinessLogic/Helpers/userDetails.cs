using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LawPracticeFirm.Models
{
    public class userDetails
    {

        public int iid { get; set; }
        public int ifid { get; set; }
        public string vWordMark { get; set; }
        public string vProprietor { get; set; }
        public string vApplNo { get; set; }
        public string vClass { get; set; }
        public string dApplDate { get; set; }
        public string vJournalNo { get; set; }
        public string dJournalDate { get; set; }
        public string vStatus { get; set; }
        public string vUsedSince { get; set; }
        public string dValidUpto { get; set; }
        public string dGSDescription { get; set; }
        public string dCrwalDate { get; set; }
        public string vImgPath { get; set; }
        public string Agent { get; set; }
        public string AgentAddress { get; set; }


    }

    public class TrademarkDetailsList
    {
        public List<userDetails> data { get; set; }
    }


    public class userDetailsForCopyright
    {
        public int iid { get; set; }
        public int ifid { get; set; }
        public string vApplicantName { get; set; }
        public string vTitleofWork { get; set; }
        public string vDiaryNo { get; set; }
        public string vStatus { get; set; }
        public string dApplDate { get; set; }
        public string CategoryId { get; set; }
        public string vCategoryName { get; set; }
        public string dCrwalDate { get; set; }
        public string vImgPath { get; set; }
        public string vROCNumber { get; set; }
        public string NoofPages { get; set; }
    }

    public class CopyrightDetailsList
    {
        public List<userDetailsForCopyright> data { get; set; }
    }

    public class userDetailsForPatent
    {
        public int iid { get; set; }
        public int ifid { get; set; }
        public string vApplNo { get; set; }
        public string vPublicationNo { get; set; }
        public string dDateOffiling { get; set; }
        public string vInventionTitle { get; set; }
        public string vInventorName { get; set; }
        public string vInventoryCountryId { get; set; }
        public string vInventoryCountry { get; set; }
        public string vInventoryAddress { get; set; }
        public string vClassification { get; set; }
        public string vPriorityDocumentNo { get; set; }
        public string dPriorityDate { get; set; }
        public string vPriorityCountryId { get; set; }
        public string vPriorityCountryName { get; set; }
        public string dAdditionAppNoFillingDate { get; set; }
        public string dDivisionalAppNoFillingDate { get; set; }
        public string vApplicantName { get; set; }
        public string vApplicantAddress { get; set; }
        public string vAbstract { get; set; }
        public string vNoofPages { get; set; }
        public string vNoofClaims { get; set; }
        public string vJournalNo { get; set; }
        public string dJournalDate { get; set; }
        public string vApplicantCountryId { get; set; }
        public string vApplicantCountryName { get; set; }
        public string vCompSpecification { get; set; }
        public string StatusName { get; set; }
        public string dEntryDate { get; set; }
        public string PatentNo { get; set; }
        public string dAddedOn { get; set; }
    }

    public class PatentDetailsList
    {
        public List<userDetailsForPatent> data { get; set; }
    }
    
    public class userDetailsForGI
    {
        public string vApplicationNo { get; set; }
        public string vStatus { get; set; }
        public string vApplicantName { get; set; }
        public string dDateOfFiling { get; set; }
        public string vClass { get; set; }
        public string dRegisterDate { get; set; }
        public string vGoods { get; set; }
        public string vApplicantAddress { get; set; }
        public string vGIName { get; set; }
        public string vRegisteredProp { get; set; }
        public string vJournalNo { get; set; }
        public string vGeoArea { get; set; }
        public string vGeoIndication { get; set; }
        public string vPriorityCountry { get; set; }
        public string dAvailDate { get; set; }
        public string vCertificateNo { get; set; }
        public string dCertificateDate { get; set; }
        public string dDateofFilingto { get; set; }
        public string dDateofFilingfrom { get; set; }
    }

    public class GIDetailsList
    {
        public List<userDetailsForGI> data { get; set; }
    }

    public class userDetailsForDesign
    {
        public int ifid { get; set; }
        public string vDesignNo { get; set; }
        public string vClass { get; set; }
        public string vApplDetails { get; set; }
        public string vAddress { get; set; }
        public string dDateOfRegistration { get; set; }
        public string vTitle { get; set; }
        public string vPriorityNo { get; set; }
        public string vImgPath { get; set; }
    }
    public class Savedatamodelforcalculator
    {
        public string FirmId { get; set; }
        public string UserId { get; set; }
        public string MatterId { get; set; }
        public string Natureofclm { get; set; }
        public string LWDOfWorkman { get; set; }
        public string Valuationdate { get; set; }
        public string Claimdate { get; set; }
        public decimal Numberofmonth { get; set; }
        public decimal LastCTCPermonth { get; set; }
        public decimal Backwagespayable { get; set; }
        public decimal AdditionalValuation { get; set; }
        public decimal AgeofClm { get; set; }
        public decimal PrincipalCLMAmt { get; set; }
        public decimal IntrCLMPerAnnum { get; set; }
        public decimal TotalInterPayble { get; set; }
        public decimal TotalValuation { get; set; }
    }
    public class DesignDetailsList
    {
        public List<userDetailsForDesign> data { get; set; }
    }


}