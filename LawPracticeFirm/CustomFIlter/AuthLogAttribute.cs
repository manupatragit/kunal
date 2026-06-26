using LawPracticeFirm.Common;
using System;
using System.Collections.Generic;
// using System.Configuration;
using System.Linq;
using System.Web;
using DataAccess.Modals;
using System.Web.Mvc;
using System.Web.Routing;

namespace LawPracticeFirm.CustomFIlter
{

    public class AuthLogAttribute : AuthorizeAttribute
    {
        //public AuthLogAttribute()
        //{
        //    View = "AuthorizeFailed";
        //}
        public AuthLogAttribute(params string[] roles)
        {
           // Roles = String.Join(",", roles);
        }

        public string View { get; set; }
        private BaseFirmController _controller;
        private string _responseReason;
        /// <summary>  
        /// Check for Authorization  
        /// </summary>  
        /// <param name="filterContext"></param>  
        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            //base.OnAuthorization(filterContext);

            _responseReason = string.Empty;
            var result = true;
            _controller = ((BaseFirmController)filterContext.Controller);
            if (!_controller.IsAutheticated)
            {
                var session = _controller.GetSession(HttpContext.Current);
                if (session != null)
                {
                     if (_controller.ValidateSession(HttpContext.Current))
                    {
                        string roleslist = Roles;
                        

                        // RBI: Partner/User (RoleId 2,3) get full access to all Firm pages
                        bool isRBIPartnerUser = false;
                        try
                        {
                            string rbiFirmId = System.Configuration.ConfigurationManager.AppSettings["RBICustomization"];
                            isRBIPartnerUser = !string.IsNullOrEmpty(rbiFirmId)
                                && session.FirmUserDetails.FirmId.ToString().ToUpper() == rbiFirmId.ToUpper()
                                && (session.FirmUserDetails.RoleId == 2 || session.FirmUserDetails.RoleId == 3);
                        }
                        catch { }

                        if (isRBIPartnerUser)
                        {
                            result = true;
                        }
                        else
                        {
                            string[] authorsListdata = roleslist.Split(',');
                            foreach (string author in authorsListdata)
                            {
                                if (author.ToString() == session.FirmUserDetails.RoleName.ToString())
                                {
                                    result = true;
                                    break;
                                }
                                else
                                {
                                    result = false;
                                    _responseReason = "InValid";
                                }
                            }
                        }
                        //else if (Roles == "1")
                        //{
                        //    var d = Roles;
                        //    result = true;
                        //}
                       

                    }
                    else
                    {
                        result = false;
                        _responseReason = "SessionTimeOut";
                    }
                }
                else
                {
                    result = false;
                    _responseReason = "InValid";
                }
                _controller.IsAutheticated = result;
                if (!result)
                {
                    HandleUnauthorizedRequest(filterContext);
                }
            }
            /// <summary>  
            /// Method to check if the user is Authorized or not  
            /// if yes continue to perform the action else redirect to error page  
            /// </summary>  
            /// <param name="filterContext"></param>  
            //private void IsUserAuthorized(AuthorizationContext filterContext)
            //{
            //    // If the Result returns null then the user is Authorized   
            //    if (filterContext.Result == null)
            //        return;

            //    //If the user is Un-Authorized then Navigate to Auth Failed View   
            //    if (filterContext.HttpContext.User.Identity.IsAuthenticated)
            //    {

            //        // var result = new ViewResult { ViewName = View };  
            //        var vr = new ViewResult();
            //        vr.ViewName = View;

            //        ViewDataDictionary dict = new ViewDataDictionary();
            //        dict.Add("Message", "Sorry you are not Authorized to View this Page");

            //        vr.ViewData = dict;

            //        var result = vr;

            //        filterContext.Result = result;
            //    }
        }

        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            //base.HandleUnauthorizedRequest(filterContext);
            if (_responseReason == "UnAuthorized")
            {
                filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary(new { controller = "Error", action = "AccessDenied" }));
            }
            else if (_responseReason == "SessionTimeOut")
            {
                filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary(new { controller = "Error", action = "Timeout" }));
            }
            else if (_responseReason == "InValid")
            {
                //filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary(new { controller = "home", action = "index", RedirectUrl = filterContext.RequestContext.HttpContext.Request.CurrentExecutionFilePath }));

                filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary(new { controller = "", action = "" }));
            }
        }



    }






}
