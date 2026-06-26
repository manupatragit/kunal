

using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Runtime.InteropServices;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using BussinessLogic.Common;

namespace LawPractice.Common
{
    public class ApiActionFilter: ActionFilterAttribute
    {
        //private readonly ILogger _logger;

        //public ActionFilter(IConfiguration Configuration)
        //{
        //    this.Configuration = Configuration;
        //    //_logger = loggerFactory.CreateLogger("ClassConsoleLogActionOneFilter");
        //}

        public override void OnActionExecuting(HttpActionContext context)
        {
            context.Request.Headers.Add("Access-Control-Allow-Origin", "*");
            context.Request.Headers.Add("Access-Control-Allow-Headers", "*");
            context.Request.Headers.Add("Access-Control-Allow-Credentials", "true");
            var b = context.ControllerContext.Controller as BaseApiController;
            
            if (b.IsAutheticated)
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

        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            if (actionExecutedContext.Exception != null)
            {
                var request = actionExecutedContext.Request;
                //string methodname = request.RequestUri.Segments[request.RequestUri.Segments.Length - 1];
                //var actionArguments = actionExecutedContext.ActionContext.ActionArguments;
                var result = new ResponseError(false, "Something gone wrong, please try again later!");
                if (actionExecutedContext.Exception.GetType() == typeof(ValidationException))
                {
                    result = new ResponseError(false, actionExecutedContext.Exception.Message);
                }
                else
                {
                    if (actionExecutedContext.Exception.GetType() == typeof(NotImplementedException))
                    {
                        result = new ResponseError(false, "API not available!");
                        //ExceptionHandling.CreateException(actionExecutedContext.Exception, methodname, actionArguments, LoggedInUserDetails.UserDetails);
                    }
                    else
                    {
                        //Log Error
                        //ExceptionHandling.CreateException(actionExecutedContext.Exception, methodname, actionArguments, LoggedInUserDetails.UserDetails);
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
                    //base.OnActionExecuted(actionExecutedContext);
                }
                else
                {
                    //if return is void
                    var data = new ResponseData<object> { Data = string.Empty };
                    actionExecutedContext.Response = actionExecutedContext.Request.CreateResponse(
                        HttpStatusCode.OK,
                        data,
                        JsonMediaTypeFormatter.DefaultMediaType);

                    //base.OnActionExecuted(actionExecutedContext);
                }
            }
            else
            {
                var data = new ResponseData<object> { Data = string.Empty };
                actionExecutedContext.Response = actionExecutedContext.Request.CreateResponse(
                    HttpStatusCode.OK,
                    data,
                    JsonMediaTypeFormatter.DefaultMediaType);

                //base.OnActionExecuted(actionExecutedContext);
            }



            base.OnActionExecuted(actionExecutedContext);
        }

        //public override void OnResultExecuting(ResultExecutingContext context)
        //{
        //    //_logger.LogWarning("ClassFilter OnResultExecuting");
        //    if (IsApiRequest(context.HttpContext.Request))
        //    {
        //        context.HttpContext.Response.ContentType = "application/json";
        //        //((ObjectResult)context.Result).Formatters.Add(new ReponseFormatter());
        //    }
        //    base.OnResultExecuting(context);
        //}

        //public override void OnResultExecuted(ResultExecutedContext context)
        //{
        //   // _logger.LogWarning("ClassFilter OnResultExecuted");
        //    base.OnResultExecuted(context);
        //}

        private bool IsApiRequest(HttpRequestBase request)
        {
            //return (request.Url.Value.ToUpper().StartsWith("/API/"));
            return false;
        }

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
       
        private bool AnonymousAuthentication(string controller, string method)
        {
            //var valid = Configuration.GetSection("Authentication:Page:" + controller + ":" + method).Value;
            //return (valid != null);
            return false;
        }
    }
}
