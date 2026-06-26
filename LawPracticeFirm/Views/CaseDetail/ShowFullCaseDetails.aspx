<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage" ValidateRequest="false" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="https://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>ShowFullCaseDetails</title>
    <link href="../../Scripts/Calendar/dhtmlxscheduler.css" rel="stylesheet" type="text/css" />
    <script src="../../Scripts/jquery-1.10.2.min.js" type="text/javascript"></script>
    <script src="../../Scripts/Calendar/dhtmlxscheduler.js" type="text/javascript"></script>
</head>
<body>
    <div id="header">
        <div style="text-align: center; background: #006384; color: #fff; padding: 5px 0; margin: 0; font-size: 24px; font-weight: bold;" id="title">
            Manupatra Case Detail
        </div>
    </div>
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
    <h2 style="text-align: center;">Show Full Case Detail</h2>
    <style type="text/css">
        .calendar_inner {
            height: 80%;
            border: 1px solid #686868;
            border-top: none;
            width: 84.5%;
        }

        html, body {
            height: 100%;
            padding: 0px;
            margin: 0px;
        }

        .custom_btn_info {
            background-image: url('../../Scripts/Calendar/imgs/controls.gif');
            width: 20px;
        }
    </style>
    <script type="text/javascript">
        function UploadDocument() {
            document.getElementById("scheduler_here").style.display = "none";
            document.getElementById("UploadDocument").style.display = "block";
            document.getElementById("divnotes").style.display = "none";
        }
        function ActivityHistory() {
            document.getElementById("scheduler_here").style.display = "block";
            document.getElementById("UploadDocument").style.display = "none";
            document.getElementById("divnotes").style.display = "none";
        }
        function Notes() {
            document.getElementById("scheduler_here").style.display = "none";
            document.getElementById("UploadDocument").style.display = "none";
            document.getElementById("divnotes").style.display = "block";
        }
    </script>
    <%if (Request.QueryString["id"].ToString() != null && Request.QueryString["id"].ToString() != "0" && Request.QueryString["id"].ToString() != "")
        { %>
    <div style="width: 90%; margin: 14px auto; background: #efefef; border: 0px solid #ccc; padding: 20px; border-radius: 5px;">
        <a href="#" onclick="ActivityHistory();">Activity/History</a>&nbsp;&nbsp;
    <a href="#" onclick="UploadDocument();">Document</a> &nbsp;&nbsp;
    <a href="#" onclick="Notes();">Notes</a>
    </div>
    <%} %>
    <form id="" method="post" action="SaveCertificate" role="form" enctype="multipart/form-data">
        <input type="hidden" id="hdnqrystr" name="hdnqrystr" value="<%=Request.QueryString["id"].ToString()%>" />
        <div id="UploadDocument" style="display: none; width: 90%; margin: 14px auto; background: #efefef; border: 0px solid #ccc; padding: 20px; border-radius: 5px;">
            Upload Document :
        <input type="file" id="fileCertificate" name="fileCertificate" accept="*/*" class="image-selector-input" />
            <input type="hidden" id="hdnpdf" name="hdnpdf" value="0" />
            <button class="btn-success btn btn-sm" type="submit" name="submit" value="Submit" id="btnAddCertificate" onclick="return validate();">Submit</button>
            <br />
            <br />
            <br />
            <br />
            <table align="center" id="UploadDocumentDetail" class="table table-striped table-bordered" cellspacing="0" border="1"
                width="65%">
                <thead style="background-color: #006384; color: #fff;">
                    <tr>
                        <%--<th>iid</th>--%>
                        <th>Document</th>
                        <th>Created Date</th>
                    </tr>
                </thead>
                <tbody style="text-align: center;">
                    <% 
                        string crtd = Request.QueryString["id"].ToString();
                        NJDGDetail.Models.CaseDetailObjectList casemasterddata = NJDGDetail.Models.CaseDetailObjeController.GetCaseUploadData(crtd);
                        for (int j = 0; j < casemasterddata.Count; j++)
                        {
                    %>
                    <tr>
                        <td style="display: none;">
                            <%=casemasterddata[j].Iid%>
                        </td>
                        <td>
                            <a href="../File/<%=casemasterddata[j].Document%>" target="_blank"><%=casemasterddata[j].Document%></a>
                        </td>
                        <td>
                            <%=casemasterddata[j].Orderdt%>
                        </td>
                    </tr>
                    <% } %>
                </tbody>
            </table>
        </div>
    </form>
    <form id="notes" method="post" action="SaveNotes">
        <input type="hidden" id="hdnqrystr1" name="hdnqrystr" value="<%=Request.QueryString["id"].ToString()%>" />
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
            <br />
            <br />
            <br />
            <table align="center" id="noteslist" class="table table-striped table-bordered" cellspacing="0" border="1"
                width="65%">
                <thead style="background-color: #006384; color: #fff;">
                    <tr>
                        <%--<th>iid</th>--%>
                        <th>Notes</th>
                        <th>Created Date</th>
                    </tr>
                </thead>
                <tbody style="text-align: center;">
                    <% 
                        crtd = Request.QueryString["id"].ToString();
                        casemasterddata = NJDGDetail.Models.CaseDetailObjeController.GetCaseNotesData(crtd);
                        for (int j = 0; j < casemasterddata.Count; j++)
                        {
                    %>
                    <tr>
                        <td style="display: none;">
                            <%=casemasterddata[j].Iid%>
                        </td>
                        <td>
                            <%=casemasterddata[j].Notes%>
                        </td>
                        <td>
                            <%=casemasterddata[j].Orderdt%>
                        </td>
                    </tr>
                    <% } %>
                </tbody>
            </table>
        </div>
    </form>
    <%if (Request.QueryString["id"].ToString() != null && Request.QueryString["id"].ToString() != "0" && Request.QueryString["id"].ToString() != "")
        { %>
    <div id="scheduler_here" class="dhx_cal_container container calendar_inner" style="margin: 0px 87px;">
        <div class="dhx_cal_navline">
            <div class="dhx_cal_prev_button">&nbsp;</div>
            <div class="dhx_cal_next_button">&nbsp;</div>
            <div class="dhx_cal_today_button"></div>
            <div class="dhx_cal_date"></div>
            <div class="dhx_cal_tab" name="month_tab"></div>
        </div>
        <div class="dhx_cal_header">
        </div>
        <div class="dhx_cal_data">
        </div>
    </div>
    <%}
    %>
    <script type="text/javascript">
        var currentTime = new Date()
        // returns the month (from 0 to 11)
        var month = currentTime.getMonth()
        //alert("month:"+month);
        // returns the day of the month (from 1 to 31)
        var day = currentTime.getDate()
        //alert("day:" + day);
        // returns the year (four digits)
        var year = currentTime.getFullYear()
        //alert("year:" + year);
        $(document).ready(function () {
            init();
        });
        function init() {
            //alert("ankit" + hdnqrystr.value);
            scheduler.config.xml_date = "%m/%d/%Y %i";
            scheduler.config.dblclick_create = false;
            scheduler.config.details_on_create = false;
            scheduler.init("scheduler_here", new Date(year, month, 1), "month");
            if (hdnqrystr.value != "" && hdnqrystr.value != null && hdnqrystr.value != "0") {
                document.getElementById("scheduler_here").style.display = "block";
                scheduler.load("/CaseDetail/Data?id=" + hdnqrystr.value);
            }
            else {
                document.getElementById("scheduler_here").style.display = "none";
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
    <% if (TempData["SUCCESS"] != null)
        { %>
    <script type="text/javascript">
        $(document).ready(function () {
            alert('<%=TempData["SUCCESS"] %>');
        });
    </script>
    <% TempData["SUCCESS"] = null;
        } %>
</body>
</html>
