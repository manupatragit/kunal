using System;
namespace LawPracticeFirm.Models
{
    /// <summary>
    /// Client nexthearing date
    /// </summary>
    public class NextHearingClient
    {
        public int ID { get; set; }
        public string casetype { get; set; }
        public string vCourt { get; set; }
        public string Nexthearing { get; set; }
        public string benchname { get; set; }
    }
}