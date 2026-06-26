using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LawPracticeFirm.Models
{
    /// <summary>
    /// One drive file
    /// </summary>
    [Serializable]
    public class OneDriveFile
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Create_date { get; set; }
        public string modify_date { get; set; }
        public string driveid { get; set; }
        public string weburl { get; set; }
        public string downloadurl { get; set; }
        public string size { get; set; }
        public string path { get; set; }


    }
    /// <summary>
    /// One drive token
    /// </summary>
    [Serializable]
    public class OneDriveToken
    {
        public string token_type { get; set; }
        public string scope { get; set; }
        public string expires_in { get; set; }
        public string ext_expires_in { get; set; }
        public string access_token { get; set; }
    }
}