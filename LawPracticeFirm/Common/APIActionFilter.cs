using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using BussinessLogic.Common;

namespace LawPracticeFirm.Common
{
    public class ApiActionFilter: ActionFilterAttribute
    {
        /// <summary>
        /// On action executing perform action before action run
        /// </summary>
        /// <param name="context"></param>
        public override void OnActionExecuting(HttpActionContext context)
        {
            context.Request.Headers.Add("Access-Control-Allow-Origin", "*");
            context.Request.Headers.Add("Access-Control-Allow-Headers", "*");
            context.Request.Headers.Add("Access-Control-Allow-Credentials", "true");
            if (context.ControllerContext.Controller is BaseFirmApiController b && b.IsAutheticated)
            {
                if (!b.ValidateSession(HttpContext.Current))
                {
                    context.Response = context.Request.CreateResponse(HttpStatusCode.OK,
                        new ResponseError(false, "SessionTimeOut"),
                      JsonMediaTypeFormatter.DefaultMediaType);
                }
            }
            base.OnActionExecuting(context);
        }
        /// <summary>
        /// On action executing perform action after action run
        /// </summary>
        /// <param name="actionExecutedContext"></param>
        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            if (actionExecutedContext.Exception != null)
            {
                var request = actionExecutedContext.Request;
                var result = new ResponseError(false, actionExecutedContext.Exception.Message);
                if (actionExecutedContext.Exception.GetType() == typeof(ValidationException))
                {
                    result = new ResponseError(false, actionExecutedContext.Exception.Message);
                }
                else
                {
                    if (actionExecutedContext.Exception.GetType() == typeof(NotImplementedException))
                    {
                        result = new ResponseError(false, "API not available!");
                    }
                    else
                    {
                    }
                }
                actionExecutedContext.Response = actionExecutedContext.Request.CreateResponse(
                    HttpStatusCode.OK,
                    result,
                    JsonMediaTypeFormatter.DefaultMediaType);
                actionExecutedContext.Exception = null;
            }
            else if (actionExecutedContext.Response != null)
            {
                if (actionExecutedContext.Response.Content is ObjectContent objectContent)
                {
                    //If return is Not Void
                    var type = objectContent.ObjectType; //type of the returned object
                    var value = objectContent.Value; //holding the returned value
                    if (type.IsClass || type.IsValueType || type.IsGenericType)
                    {
                        var data = new ResponseData<object> { Data = value };
                        actionExecutedContext.Response = actionExecutedContext.Request.CreateResponse(
                            HttpStatusCode.OK,
                            data,
                            JsonMediaTypeFormatter.DefaultMediaType);
                    }
                }
                else
                {
                    //if return is void
                    var data = new ResponseData<object> { Data = string.Empty };
                    actionExecutedContext.Response = actionExecutedContext.Request.CreateResponse(
                        HttpStatusCode.OK,
                        data,
                        JsonMediaTypeFormatter.DefaultMediaType);
                }
            }
            else
            {
                var data = new ResponseData<object> { Data = string.Empty };
                actionExecutedContext.Response = actionExecutedContext.Request.CreateResponse(
                    HttpStatusCode.OK,
                    data,
                    JsonMediaTypeFormatter.DefaultMediaType);
            }
            base.OnActionExecuted(actionExecutedContext);
        }
        /// <summary>
        /// Is API request file
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        private bool IsApiRequest(HttpRequestBase request)
        {
            return false;
        }
        /// <summary>
        /// Create exception
        /// </summary>
        /// <param name="context"></param>
        private void CreateException(HttpActionExecutedContext context)
        {
            //var exception = context.Exception;
            //context.Result = new ObjectResult(new ResponseError());
            //if (exception.GetType() == typeof(ValidationException))
            //{
            //    ((ObjectResult)context.Result).Value = new ResponseError(exception.Message);
            //}
            //else
            //{
            //    //Log Exceptopn
            //    StringBuilder sb = new StringBuilder();
            //    sb.Append("==============================================\n");
            //    sb.Append(exception.Message + "\n");
            //    sb.Append(exception.StackTrace + "\n");
            //    sb.Append(exception.InnerException + "\n");
            //    sb.Append("==============================================");
            //   File.AppendAllText(Directory.GetCurrentDirectory()+"/Exception/log"+DateTime.Now.Millisecond+".txt",sb.ToString());
            //    sb.Clear();
            //    if (exception.GetType() == typeof(NotImplementedException))
            //    {
            //        ((ObjectResult)context.Result).Value = new ResponseError("API not available!");
            //    }
            //    else
            //    {
            //        ((ObjectResult)context.Result).Value = new ResponseError("Something gone wrong, please try again later!");
            //    }
            //}
            context.Exception = null;
        }
        /// <summary>
        /// Anonymous Authentication
        /// </summary>
        /// <param name="controller"></param>
        /// <param name="method"></param>
        /// <returns></returns>
        private bool AnonymousAuthentication(string controller, string method)
        {
            //var valid = Configuration.GetSection("Authentication:Page:" + controller + ":" + method).Value;
            //return (valid != null);
            return false;
        }
    }
}
