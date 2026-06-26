using System;
using System.Collections.Generic;

namespace NJDGDetail.Models
{
    /// <summary>
    /// Login
    /// </summary>
    public class Login
    {
        public string name;
        public string email;
        public int iid;
        public string password;
        public string displayname;
        public string mobileno;
        public string Name
        {
            get
            { return this.name; }
            set
            { this.name = value; }
        }
        public string Email
        {
            get
            { return this.email; }
            set
            { this.email = value; }
        }
        public int Iid
        {
            get
            { return this.iid; }
            set
            { this.iid = value; }
        }
        public string Password
        {
            get
            { return this.password; }
            set
            { this.password = value; }
        }
        public string Displayname
        {
            get
            { return this.displayname; }
            set
            { this.displayname = value; }
        }
        public string Mobileno
        {
            get
            { return this.mobileno; }
            set
            { this.mobileno = value; }
        }
    }
    public class LoginList : List<Login>
    {
        public LoginList()
        { }
    }
}