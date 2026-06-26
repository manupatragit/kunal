<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage" ContentType="text/xml" ValidateRequest="false" %>

<%@ Import Namespace="NJDGDetail.Models" %>
<%@ Import Namespace="NJDGDetail.Controllers" %>
<data>
    <%
        EventList recentlyViewedEvent = CalendarEventController.GetCalendarEventByUserId(Request.QueryString["id"].ToString());
        //data = CaseDetailObjeController.ShowFullCaseData("608"); 
    %>
    <% foreach (var myevent in recentlyViewedEvent)
        {
            //myevent.id=1;
            //myevent.text = "Test";
            //myevent.start_date = "11-24-2018 00:00:00";
            //myevent.end_date = "11-24-2018 00:00:00";
            // myevent.text = "\"<a href=\"" + myevent.text + "\"  target=\"_blank\">Click to open Order</a>";
            if (myevent.Showstatus == "none")
            {
                myevent.text = myevent.CourseName + "\n (" + myevent.start_date + ")";
            }
            else
            {
                myevent.text = "\"<a href=\"../" + myevent.text + "\"  target=\"_blank\">" + myevent.CourseName + "\n (" + myevent.start_date + ")" + "</a>";
            }
    %>
    <event id="<%=myevent.id%>">
        <start_date><![CDATA[<%=  myevent.start_date %>]]></start_date>
        <end_date><![CDATA[<%=  myevent.end_date %>]]></end_date>
        <text><![CDATA[<%=  myevent.text%>"]]></text>
    </event>
    <% 
        } %>
</data>
