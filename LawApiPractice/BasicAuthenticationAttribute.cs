using System;
using System.Net;
using System.Net.Http;
using System.Security.Principal;
using System.Text;
using System.Threading;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace LawApiPractice
{
    public class BasicAuthenticationAttribute : AuthorizationFilterAttribute
    {
        public override void OnAuthorization(HttpActionContext actionContext)
    {
            if (actionContext.Request.Headers.Authorization == null)
            {
                actionContext.Response = actionContext.Request
                    .CreateResponse(HttpStatusCode.Unauthorized);
            }
            else
            {
                //string authenticationToken = actionContext.Request.Headers
                //                            .Authorization.Parameter;
                //string decodedAuthenticationToken = Encoding.UTF8.GetString(
                //    Convert.FromBase64String(authenticationToken));
                //string[] usernamePasswordArray = decodedAuthenticationToken.Split(':');
                //string username = usernamePasswordArray[0];
                //string password = usernamePasswordArray[1];



                dynamic data = actionContext.Request.Headers
                                            .Authorization.Parameter;
                // var authenticationToken = System.Convert.FromBase64String(data);

                byte[] datas = Convert.FromBase64String(data);
                string decodedAuthenticationToken = AES.DecryptAes(datas);


                string[] usernamePasswordArray = decodedAuthenticationToken.Split(':');
                string username = usernamePasswordArray[0];
                string password = usernamePasswordArray[1];

#if true

#endif

                if (EmployeeSecurity.Login(username, password))
                {
                    Thread.CurrentPrincipal = new GenericPrincipal(
                        new GenericIdentity(username), null);
                }
                else
                {
                    actionContext.Response = actionContext.Request
                        .CreateResponse(HttpStatusCode.Unauthorized);
                }
                base.OnAuthorization(actionContext);
            }
        }
    }
}