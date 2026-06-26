<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/NJDG.Master" Inherits="System.Web.Mvc.ViewPage" %>
<%@ Import Namespace="NJDGDetail.Models" %>
<%@ Import Namespace="NJDGDetail.Controllers" %>
<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
	AddCase
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
<a  style="text-align:right;" href="#" name="AddCase" onclick="Dashboard();">DashBoard</a>
<a  style="text-align:right;" href="#" name="AddCase" onclick="AddCase();">AddCase</a>
<a  style="text-align:right;" href="#" name="Logout" onclick="Logout();">Logout</a>
<%--<a  style="text-align:right;" href="#" name="AddCase" onclick="Dashboard();">DashBoard</a>--%>
    <h2 style="text-align:center;">Add Case Detail</h2>
    <link href="../../Content/usercasedetails.css" rel="stylesheet" type="text/css" />
    <script src="../../Scripts/jquery-1.3.2.min.js" type="text/javascript"></script>
    
        <script type="text/javascript">

            function validationcourt() {
                if (document.getElementById("drpcourtname").value == "0") {
                    alert("please select court");
                    return false;
                }
            }
            function divdisplay() {
              
                $("#drptype").empty();
                $("#drpNCBench").empty();
                  alert("hi");
                document.getElementById('divRH').style.display = "none";
                document.getElementById('divJK').style.display = "none";
                document.getElementById('divNC').style.display = "none";
                document.getElementById('savebtn').style.display = "none";
                document.getElementById("divKA").style.display = "none";
                document.getElementById('divMHGoa').style.display = "none";
                document.getElementById('divTN').style.display = "none";
                document.getElementById('divMHGoa').style.display = "none";
                document.getElementById("divMH").style.display = "none";
                var crtid = document.getElementById('drpcourtname').value;
                var courtname = document.getElementById('drpcourtname').value;
                alert("crtid");
                var x = document.getElementById("drpcourtname");
                for (var i = 0; i < x.length; i++) {
                    crtid = x.options[i].value;
                   
                    if (crtid != "0") {
                        if (x.options[i].selected == true) {

                            document.getElementById('Court').style.display = "block";
                            document.getElementById('savebtn').style.display = "block";
                            document.getElementById('lblcourtname').innerHTML = x.options[i].innerText;

                            if (crtid == 'MH') {
                                document.getElementById("divMHGoa").style.display = "block";
                                document.getElementById("divMH").style.display = "block";
                            }
                            if (crtid == 'KA') {
                                document.getElementById('divKA').style.display = "block";
                            }
                            if (crtid == 'NC' || crtid == 'NL' || crtid == 'IT' || crtid == 'CE') {
                                document.getElementById('divNC').style.display = "block";
                                getbench(crtid);
                            }

                            if (crtid == 'TN') {
                                document.getElementById("divTN").style.display = "block";
                                document.getElementById("divTNBench").style.display = "block";
                            }
                            if (crtid == 'RH') {
                                document.getElementById('divRH').style.display = "block";
                                document.getElementById('divRHBench').style.display = "block";
                            }
                            if (crtid == 'JK') {
                                document.getElementById('divJK').style.display = "block";
                                document.getElementById('divJKBench').style.display = "block";
                            }
                            if (crtid != 'IT' || crtid != 'CE') {
                                getCasetype(crtid, '', '', '');
                            }
                            else {
                                $.ajax({  async: true, 
                                    type: "POST",
                                    url: "AddcasetypeITCE?crtid=" + crtid + "&courttitle=&side=",
                                    dataType: "json",
                                    success: function (data) {

                                        $("#drptype").append("<option value='0'>-Select Case Type-</option>");
                                        for (var i = 0; i < data.length; i++) {
                                            $("#drptype").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");

                                        }
                                    },
                                    error: function (data) {

                                    }
                                });
                            }
                            

                        }
                    }
                }
            }

            function benchadd(crtid) {
                $.ajax({  async: true, 
                    type: "POST",
                    url: "AddBenchtype?bench=" + crtid,
                    dataType: "json",
                    success: function (data) {

                        $("#drpNCBench").append("<option value='0'>-Select Bench-</option>");
                        for (var i = 0; i < data.length; i++) {
                            $("#drpNCBench").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");

                        }
                    },
                    error: function (data) {

                    }
                });
            }


            function getbench(crtid) {
                var str = "";

                benchadd(crtid);


            }


            function getCasetype(crtid, bench, side, vcourttitle) {
                if (crtid == 'TN' && bench == '') {
                    document.getElementById('divTNBench').value = '';
                    return;
                }
                if (crtid == 'RH' && bench == '') {
                    document.getElementById('divRHBench').value = '';
                    return;
                }
                if (crtid == 'JK' && bench == '') {
                    document.getElementById('divJKBench').value = '';
                    return;
                }

                if (crtid != "MH" && crtid != "TN" && crtid != "RH" && crtid != "JK") {

                    $.ajax({  async: true, 
                        type: "POST",
                        url: "Addcasetype?crtid=" + crtid + "&courttitle=" + vcourttitle + "&side=" + side,
                        dataType: "json",
                        success: function (data) {

                            $("#drptype").append("<option value='0'>-Select Case Type-</option>");
                            for (var i = 0; i < data.length; i++) {
                                $("#drptype").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");

                            }
                        },
                        error: function (data) {

                        }
                    });
                }
                else {
                    if (vcourttitle != 'Goa' && bench == '') {
                        document.getElementById('drpbench').innerHtml = "";
                        $("#drpbench").empty;
                        $.ajax({  async: true, 
                            type: "POST",
                            url: "GetBenchName?crtid=" + crtid,
                            dataType: "json",
                            success: function (data) {

                                $("#drpbench").append("<option value='0'>-Select Bench-</option>");
                                for (var i = 0; i < data.length; i++) {
                                    $("#drpbench").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");

                                }
                            },
                            error: function (data) {

                            }
                        });

                    }
                    else {
                        $.ajax({  async: true, 
                            type: "POST",
                            url: "Addcasetype?crtid=" + crtid + "&courttitle=" + vcourttitle + "&bench=" + bench + "&side=" + side,
                            dataType: "json",
                            success: function (data) {

                                $("#drptype").append("<option value='0'>-Select Case Type-</option>");
                                for (var i = 0; i < data.length; i++) {
                                    $("#drptype").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");

                                }
                            },
                            error: function (data) {

                            }
                        });

                    }
                }
            }
      

    </script>


<script type="text/javascript">

    function fillCasetype() {
        var bench = document.getElementById('drpbench').value;
        var side = document.getElementById('drpside').value;
        var crtid = document.getElementById('drpcourtname').value;
        document.getElementById("drptype").innerHTML = '';
        getCasetype(crtid, bench, side, '');
    }

    function hiddiv() {
        document.getElementById("drpbench").innerHTML = "";
        document.getElementById("drpside").innerHTML = "";
        document.getElementById("drptype").innerHTML = "";
        if (document.getElementById('drpGoa').value == 'Goa') {
            document.getElementById('divMH').style.display = "none";
            getCasetype('MH', '', '', 'Goa');
        }
        else {
            document.getElementById('divMH').style.display = "block";
            getCasetype('MH', '', '', '');
        }
    }

    function fillside() {
        var bench = document.getElementById('drpbench').value;
        document.getElementById("drpside").innerHTML = '';
        GetSide(bench);
    }

    function GetSide(benchid) {
        document.getElementById('drpside').innerHtml = "";
        $("#drpside").empty;
        $.ajax({  async: true, 
            type: "POST",
            url: "GetSide?benchid=" + benchid,
            dataType: "json",
            success: function (data) {

                $("#drpside").append("<option value='0'>-Select Side-</option>");
                for (var i = 0; i < data.length; i++) {
                    $("#drpside").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");

                }
            },
            error: function (data) {

            }
        });
    }

    function hiddivTN() {
        document.getElementById("drptype").innerHTML = "";
        if (document.getElementById('divTNBench').value == '') {
            document.getElementById("drptype").innerHTML = "";
        }
        if (document.getElementById('divTNBench').value == "1") {
            getCasetype('TN', '1', '', '');
            return;
        }
        if (document.getElementById('divTNBench').value == "0") {
            getCasetype('TN', '0', '', '');
            return;
        }

    }

    function hiddivRH() {
        document.getElementById("drptype").innerHTML = "";
        if (document.getElementById('divRHBench').value == '') {
            document.getElementById("drptype").innerHTML = "";
        }
        if (document.getElementById('divRHBench').value == '1') {
            getCasetype('RH', '1', '', '');
            return;
        }
        if (document.getElementById('divRHBench').value == '0') {
            getCasetype('RH', '0', '', '');
            return;
        }

    }

    function hiddivJK() {
        document.getElementById("drptype").innerHTML = "";
        if (document.getElementById('divJKBench').value == '') {
            document.getElementById("drptype").innerHTML = "";
        }
        if (document.getElementById('divJKBench').value == '1') {
            getCasetype('JK', '1', '', '');
            return;
        }
        if (document.getElementById('divJKBench').value == '0') {
            getCasetype('JK', '0', '', '');
            return;
        }

    }


    function validation() {

        if (document.getElementById('drpcourtname').value != "0") {
            if (document.getElementById('drpcourtname').value == "MH") {
                if (document.getElementById('drpGoa').value != "Goa") {
                    if (document.getElementById('drpbench').value == "--Select Bench--" || document.getElementById('drpbench').value == "" || document.getElementById('drpbench').value == "0") {
                        alert("please select bench");
                        document.getElementById('drpbench').focus();
                        return false;
                    }
                    if (document.getElementById('drpside').value == "" || document.getElementById('drpside').value == "--Select Side--" || document.getElementById('drpside').value == "0") {
                        alert("please select side");
                        document.getElementById('drpside').focus();
                        return false;
                    }
                }
            }

            if (document.getElementById('drpcourtname').value == "TN") {
                if (document.getElementById('divTNBench').value == "") {
                    if (document.getElementById('divTNBench').value == "--Select Bench--" || document.getElementById('divTNBench').value == "" ||  document.getElementById('divTNBench').value == "0") {
                        alert("please select bench");
                        document.getElementById('divTNBench').focus();
                        return false;
                    }
                }
            }

            if (document.getElementById('drpcourtname').value == "JK") {
                    if (document.getElementById('divJKBench').value == "--Select Bench--" || document.getElementById('divJKBench').value == "") {
                        alert("please select bench");
                        document.getElementById('divJKBench').focus();
                        return false;
                    }
               
            }

            if (document.getElementById('drpcourtname').value == "RH") {
                if (document.getElementById('divRHBench').value == "") {
                    if (document.getElementById('divRHBench').value == "--Select Bench--" || document.getElementById('divRHBench').value == "") {
                        alert("please select bench");
                        document.getElementById('divRHBench').focus();
                        return false;
                    }
                }
            }

            if (document.getElementById('drpcourtname').value != "" ) {

                if (document.getElementById('drpcourtname').value == "NC" || document.getElementById('drpcourtname').value == "NL") {
                    if (document.getElementById('drpNCBench').value == "--Select Bench--" || document.getElementById('drpNCBench').value == "0") {
                        alert("please select bench");
                        document.getElementById('drpNCBench').focus();
                        return false;
                    }
                }

                if (document.getElementById('drpcourtname').value == "IT" || document.getElementById('drpcourtname').value == "CE") {
                    if (document.getElementById('drpNCBench').value == "--Select Bench--" || document.getElementById('drpNCBench').value == "0") {
                        alert("please select bench");
                        document.getElementById('drpNCBench').focus();
                        return false;
                    }
                }
                if (document.getElementById('drpcourtname').value != "NC" && document.getElementById('drpcourtname').value != "NL") {
                    if (document.getElementById('drptype').value == "--Select Case Type--" || document.getElementById('drptype').value == "0") {
                        alert("please select case type");
                        document.getElementById('drptype').focus();
                        return false;
                    }
                }

                if (document.getElementById('txtno').value == "") {
                    alert("please enter case no.");
                    document.getElementById('txtno').focus();
                    return false;
                }
                if (document.getElementById('drpYear').value == "" || document.getElementById('drpYear').value == "0") {
                    alert("please select case year");
                    document.getElementById('drpYear').focus();
                    return false;
                }
            }
        }
    }


</script>

<script type="text/javascript">
    function Dashboard() {
        window.location.href = '/Dashboard/CaseDetailDashbord';

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

<form id="form" runat="server" method="post" action="InsertCaseDetail">

<%--     <input type="hidden" id="hdnqrystrname" name="hdnqrystrname" value="<%=Convert.ToString(Session[NJDGDetail.SharedClass.Global.LOGGED_USERID]) %>" />--%>
<div  align="center">

    <select name="drpcourtname" id="drpcourtname" class="form-control1" onchange="divdisplay();">
                        <option selected="selected" value="0" >--Select Court Name--</option>

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
<div  align="center" style="position: absolute;right: 170px;top: 119px;">
<a href="#" onclick="nextlink();">Click here for Case Details</a>
</div>
<div>&nbsp;</div>
<div class="container" id="Court" style="display:none;">
        
<section id="header" style="border-top:1px dashed #cccccc; padding:10px 0 0 0;"><h1>Selected: <label id="lblcourtname"></label> <span style="padding:0; font-size:18px;margin:0 0 0 10px;"></span></h1></section>
<section id="toggle">
<div class="t_label">Add more information</div>
<div class="toggle_btn"><label class="switch"><input type="checkbox"><span class="slider round"></span>
</label>

</div>
</section>
</div>

<div id="divMHGoa"  style="display:none;">
  <section id="toggle">
</section>
<section id="fields">
<div class="raw">
<div class="col-33">
<label>Select Court</label>&nbsp;
<select name="drpGoa" id="drpGoa" class="selectbox" onchange="hiddiv();">
    <option selected="selected" value="" >--Select--</option>
     <option value="Goa" >Goa</option>
</select>

</div>

</div>
</section>
</div>  

<div id="divMH" style="display:none;">
  <section id="toggle">
</section>
<section id="fields">
<div class="raw">
<div class="col-33">
<label>Bench</label>&nbsp;
<select name="drpbench" id="drpbench" class="selectbox"  onchange="fillside();">
   
</select>

</div>
<div class="col-33">
<label>Side</label>

<select name="drpside" id="drpside" class="selectbox"  onchange="fillCasetype();">
   
</select>

</div>
<div class="col-33">
<label>Stamp/Register</label>
<select name="drpstampregister" id="drpstampregister" class="selectbox">
    <option  value="R" >Register</option>
     <option value="S" >Stamp</option>
</select>
</div>
</div>
</section>
</div>




















<div id="divTN"  style="display:none;">
  <section id="toggle">
</section>
<section id="fields">
<div class="raw">
<div class="col-33">
<label>Select Bench</label>&nbsp;
<select name="divTNBench" id="divTNBench" class="selectbox" onchange="hiddivTN();">
    <option  value="" >--Select Bench--</option>
    <option  value="0" >Madras</option>
     <option value="1" >Madurai</option>
</select>
</div>

</div>
</section>
</div>





 <div id="divKA" style="display:none;">
  <section id="toggle">
</section>
<section id="fields">
<div class="raw">
<div class="col-33">
<label>Bench</label>&nbsp;
<select name="drpKAbench" id="drpKAbench" class="selectbox" >
    <option  value="0" >Bengaluru Bench</option>
    <option  value="1" >Dharwad Bench</option>
     <option value="2" >Kalaburagi Bench</option>
</select>

</div>

</div>
</section>
</div>

<div id="divNC"  style="display:none;">
  <section id="toggle">
</section>
<section id="fields">
<div class="raw">
<div class="col-33">
<label>Bench</label>&nbsp;
<select name="drpNCBench" id="drpNCBench" class="selectbox">
   
</select>
</div>

</div>
</section>
</div>

<div id="divRH" style="display:none;">
  <section id="toggle">
</section>
<section id="fields">
<div class="raw">
<div class="col-33">
<label>Select Bench</label>&nbsp;
<select name="divRHBench" id="divRHBench" class="selectbox" onchange="hiddivRH();">
    <option  value="" >--Select Bench--</option>
    <option  value="0" >Jaipur</option>
     <option value="1" >Jodhpur</option>
</select>

</div>

</div>
</section>
</div>

 <div id="divJK"  style="display:none;">
  <section id="toggle">
</section>
<section id="fields">
<div class="raw">
<div class="col-33">
<label>Select Bench</label>&nbsp;
<select name="divJKBench" id="divJKBench" class="selectbox" onchange="hiddivJK();">
    <option  value="" >--Select Bench--</option>
    <option  value="0" >Jammu</option>
     <option value="1" >Srinagar</option>
</select>
</div>

</div>
</section>
</div>



<div id="savebtn" style="display:none;">
  
<section id="fields">
<div class="raw">
<div class="col-33"  >
<label>Case Type</label>&nbsp;
<select name="drptype" id="drptype" class="selectbox">
</select>
                      
</div>
<div class="col-33">
<label>Case Number</label>

<input type="text" class="selectbox2" placeholder="--Search Case No.--" name="txtno" id="txtno" maxlength="500" />
</div>
<div class="col-33">
<label>Case Year</label>


<select name="drpYear" id="drpYear" class="selectbox">

 <option value="0">--Select Case Year--</option>

</div>
</div>
<div class="raw">
<div class="col-100">
<label>File Number</label>
<input type="text" class="selectbox2" placeholder="keep this field blank to automatically generate a file number" name="txtFileNo" id="txtFileNo" maxlength="500" />

</div>
</div>
</section>

<section id="sbtn">
 <button CssClass="sbtn" type="submit" name="submit" value="Submit" Text="Add Case"
                    onclick="return validation();">Add Case</button>
<%--<asp:Button id="cmdSave" runat="server" Text="Add Case" CssClass="sbtn" OnClick="cmdSave_Click" OnClientClick="return validation();"/>--%>
</section>
</div>

</form>

<script type="text/javascript">

    function nextlink() {
        var s = validationcourt();
        if (s != false) {
            window.location.href = '/CaseDetail/GetCaseDetails?crtid=' + document.getElementById('drpcourtname').value + "&username=" + document.getElementById('hdnqrystrname').value;
        }
       
    }

</script>
</asp:Content>
