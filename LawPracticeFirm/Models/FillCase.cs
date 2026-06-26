using System;

namespace LawPracticeFirm.Models
{
    /// <summary>
    /// File court type list
    /// </summary>
    public class FillCourtTypeList
    {
        public string id { get; set; }
        public string courtname { get; set; }        
    }
    /// <summary>
    /// File court name by court type list
    /// </summary>
    public class FillCourtnamebyCourttypeList
    {
        public string courtid { get; set; }
        public string courtname { get; set; }
    }
    /// <summary>
    /// File case ttpe diary list
    /// </summary>
    public class FillCasetypeDiaryList
    {      
        public string id { get; set; }
        public string name { get; set; }
    }
    /// <summary>
    /// Fill case type list
    /// </summary>
    public class FillCasetypeList
    {
        public string casetype { get; set; }
        public string casetypename { get; set; }
    }
    /// <summary>
    /// Fill bench list
    /// </summary>
    public class FillBenchList
    {
        public string casetype { get; set; }
        public string casetypename { get; set; }
    }
    /// <summary>
    /// File district court list
    /// </summary>
    public class FillDistrictCourtList
    {
        public string courtid { get; set; }
        public string courtname { get; set; }
    }
    /// <summary>
    /// Fill court complex STB list
    /// </summary>
    public class FillCourtComplexSTBList
    {
        public string id { get; set; }
        public string name { get; set; }
    }
    /// <summary>
    /// File district case type list
    /// </summary>
    public class FillDistrictCaseTypeList
    {
        public string courtid { get; set; }
        public string courtname { get; set; }
    }
    /// <summary>
    /// Fill stamp register list
    /// </summary>
    public class FillStampRegisterList
    {
        public string value { get; set; }
        public string Name { get; set; }
    }
}