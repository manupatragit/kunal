<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/NJDG.Master" Inherits="System.Web.Mvc.ViewPage" %>

<%@ Import Namespace="NJDGDetail.Models" %>
<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    CaseDetailDashboard
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <script type="text/javascript">
        function AddCase() {
            window.location.href = '/AddCase/AddCase';
        }
        function Dashboard() {
            window.location.href = '/Dashboard/CaseDetailDashbord';
        }
        function Logout() {
            window.location.href = '/Login/Login';
        }
    </script>
    <a style="text-align: right;" href="#" name="AddCase" onclick="Dashboard();">DashBoard</a>
    <a style="text-align: right;" href="#" name="AddCase" onclick="AddCase();">AddCase</a>
    <a style="text-align: right;" href="#" name="Logout" onclick="Logout();">Logout</a>
    <script type="text/javascript">
        function AddCase() {
            window.location.href = '/AddCase/AddCase';
        }
        function TotalCase() {
            window.location.href = '/CaseDetail/GetCaseDetails?crtid=&username=';
        }
    </script>
    <%-- <a  style="text-align:right;" href="#" name="AddCase" onclick="AddCase();">AddCase</a>--%>
    <h2 style="text-align: center;">Case Detail Dashboard</h2>
    <div>
        <script src="../../Scripts/jquery-1.3.2.min.js" type="text/javascript"></script>
        <table cellpadding="10" align="center" width="90%" border="1">
            <tr>
                <td align="center">
                    <div>
                        Case&nbsp; 
  <%--   <%
        AddCaseObjectList addcase = new AddCaseObjectList();
        string username = Convert.ToString(Session[NJDGDetail.SharedClass.Global.LOGGED_USERID]);
        addcase = AddCaseObjectController.GetTotalCase(username);
        for (int i = 0; i < addcase.Count; i++)
        {
         %>
         <a  style="text-align:right;" href="#" name="TotalCase" onclick="TotalCase();">(<%=addcase[i].TotalCase%>)</a>
         <%} %>--%>
                    </div>
                </td>
                <td align="center">
                    <div>Client (0)</div>
                </td>
                <td align="center">
                    <div>Document (0)</div>
                </td>
            </tr>
            <tr>
                <td align="center">
                    <div>Team Member (0)</div>
                </td>
                <td align="center">
                    <div>To-dos (0)</div>
                </td>
                <td align="center">
                    <div>Invoices (0)</div>
                </td>
            </tr>
            <tr>
                <td align="center">
                    <div></div>
                </td>
                <td align="center">
                    <div></div>
                </td>
                <td align="center">
                    <div></div>
                </td>
            </tr>
        </table>
    </div>
</asp:Content>
