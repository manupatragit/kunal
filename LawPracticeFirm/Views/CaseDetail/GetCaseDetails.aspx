<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/NJDG.Master" Inherits="System.Web.Mvc.ViewPage" %>

<%@ Import Namespace="NJDGDetail.Models" %>
<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    GetCaseDetails
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
        function Dashboard() {
            window.location.href = '/Dashboard/CaseDetailDashbord';
        }
        function UploadDocument() {
            document.getElementById("gvCaseDetail").style.display = "none";
            document.getElementById("UploadDocument").style.display = "block";
            document.getElementById("divnotes").style.display = "none";
        }
        function ActivityHistory() {
            document.getElementById("gvCaseDetail").style.display = "block";
            document.getElementById("UploadDocument").style.display = "none";
            document.getElementById("divnotes").style.display = "none";
        }
        function Notes() {
            document.getElementById("gvCaseDetail").style.display = "none";
            document.getElementById("UploadDocument").style.display = "none";
            document.getElementById("divnotes").style.display = "block";
        }
    </script>
    <%--<a  style="text-align:right;" href="#" name="AddCase" onclick="Dashboard();">DashBoard</a>
    <a  style="text-align:right;" href="#" name="AddCase" onclick="AddCase();">AddCase</a>--%>
    <h2 style="text-align: center;">Get Case Details</h2>
    <div align="center">
        <select name="drpcourtname" id="drpcourtname" cssclass="selectbox">
            <option selected="selected" value="0">--Select Court Name--</option>
            <%
                AddCaseObjectList addcase = new AddCaseObjectList();
                addcase = AddCaseObjectController.GetAllCourtname();
                for (int i = 0; i < addcase.Count; i++)
                {
            %>
            <option value="<%=addcase[i].Courtid %>" text="<%=addcase[i].Courtname%>"><%=addcase[i].Courtname%></option>
            <%} %>
        </select>
    </div>
    <div align="center" style="position: absolute; right: 170px; top: 119px;">
        <a href="#" onclick="nextlink();">Click here for Case Details</a>
    </div>
    <input type="hidden" id="hdnqrystrname" name="hdnqrystrname" value="<%=Convert.ToString(Session[NJDGDetail.SharedClass.Global.LOGGED_USERID]) %>" />
    <div id="gvCaseDetail" style="width: 90%; margin: 14px auto; background: #efefef; border: 0px solid #ccc; padding: 20px; border-radius: 5px;">
        <table id="questionLIst" class="table table-striped table-bordered" cellspacing="0" border="1"
            width="100%">
            <thead style="background-color: #006384; color: #fff;">
                <tr>
                    <th>Case</th>
                    <th>Court</th>
                    <%--<th>Diary No</th>--%>
                    <th>Case Name</th>
                    <th>Bench Name</th>
                    <th>Advocate</th>
                    <th>Next Hearing</th>
                    <th>Disposed Date</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody style="text-align: center;">
                <% 
                    string crtd = Request.QueryString["crtid"].ToString();
                    string username = Convert.ToString(Session[NJDGDetail.SharedClass.Global.LOGGED_USERID]);
                    CaseDetailObjectList casemasterddata = CaseDetailObjeController.GetMasterCaseData(crtd, username);
                    for (int j = 0; j <= casemasterddata.Count - 1; j++)
                    {
                %>
                <tr>
                    <td>
                        <%if (casemasterddata[j].Iid == 0)
                            {%>
                        <%=casemasterddata[j].Csno%>
                        <%}
                            else
                            { %>
                        <a target="_blank" href="/CaseDetail/ShowFullCaseDetails?id=<%=casemasterddata[j].Iid%>" name="A1" id="A3"><%=casemasterddata[j].Csno%> </a>
                        <%} %> 
                    </td>
                    <td>
                        <%=casemasterddata[j].Courtname%>
                    </td>
                    <%--<td>
                                            <%=casemasterddata[j].Diaryno%>
                                        </td>--%>
                    <td>
                        <%=casemasterddata[j].Casename%>
                    </td>
                    <td>
                        <%=casemasterddata[j].Benchname%>
                    </td>
                    <td>
                        <%=casemasterddata[j].Advname%>
                    </td>
                    <td>
                        <%=casemasterddata[j].Nexthearing%>
                    </td>
                    <td>
                        <%=casemasterddata[j].Disposeddt%>
                    </td>
                    <td>
                        <%=casemasterddata[j].Status%>
                    </td>
                </tr>
                <% } %>
            </tbody>
        </table>
    </div>
    <form id="" method="post" action="SaveCertificate" role="form" enctype="multipart/form-data">
        <div id="UploadDocument" style="display: none; width: 90%; margin: 14px auto; background: #efefef; border: 0px solid #ccc; padding: 20px; border-radius: 5px;">
            Upload Document :
        <input type="file" id="fileCertificate" name="fileCertificate" accept="*/*" class="image-selector-input" />
            <input type="hidden" id="hdnpdf" name="hdnpdf" value="0" />
            <button class="btn-success btn btn-sm" type="submit" name="submit" value="Submit" id="btnAddCertificate" onclick="return validate();">Submit</button>
        </div>
    </form>
    <form id="notes" method="post" action="SaveNotes">
        <div id="divnotes" style="display: none; width: 90%; margin: 14px auto; background: #efefef; border: 0px solid #ccc; padding: 20px; border-radius: 5px;">
            <table width="90%">
                <tr>
                    <td>Notes :
                    </td>
                    <td>
                        <textarea name="txtnote" id="txtnote" style="width: 90%; margin: 0px; height: 187px;"></textarea>
                    </td>
                </tr>
                <tr></tr>
                <tr>
                    <td colspan="2" align="center">
                        <button style="align: center; text-align: center;" class="btn-success btn btn-sm" type="submit" name="Notes" value="Notes" id="btnNotes" onclick="return validatenotes();">Submit</button></td>
                </tr>
            </table>
        </div>
    </form>
    <script type="text/javascript">
        function validationcourt() {
            if (document.getElementById("drpcourtname").value == "0") {
                alert("please select court");
                return false;
            }
        }
        function nextlink() {
            // validationcourt();
            var s = validationcourt();
            if (s != false) {
                window.location.href = '/CaseDetail/GetCaseDetails?crtid=' + document.getElementById('drpcourtname').value + "&username=" + document.getElementById('hdnqrystrname').value;
            }
            else {
                window.location.href = '/CaseDetail/GetCaseDetails?crtid=&username=';
            }
        }
        function validate() {
            if (document.getElementById("fileCertificate").value == "") {
                alert("please select file");
                document.getElementById("fileCertificate").focus();
                return false;
            }
        }
        function validatenotes() {
            if (document.getElementById("txtnote").value == "") {
                alert("please enter notes");
                document.getElementById("txtnote").focus();
                return false;
            }
        }
    </script>
</asp:Content>
