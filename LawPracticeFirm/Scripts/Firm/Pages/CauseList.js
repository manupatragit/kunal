$(document).ready(function () {
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    function clearForm() {
        $('#savecasealert')[0].reset();
    }
    loadcauseload();
/*Get casewatch causelist*/
    function loadcauseload() {
        var casedate = $("#casedate").val();
        var scourt1 = $("input[name='ocasedata1']:checked").val();
        if (scourt1 == "") {
            return false;
        }
        if (casedate == "") {
            return false;
        }
        else {
            if (String(scourt1) == "3") {
                $("#questionLIstd").css("display", "block");
                $("#questionLIst").css("display", "none");
                tablename = "questionLIstd";
                CauselistCaseWatchd(casedate, scourt1,0);
            }
            else {
                $("#questionLIstd").css("display", "none");
                $("#questionLIst").css("display", "block");
                tablename = "questionLIst";
                CauselistCaseWatch(casedate, scourt1,0);
            }
        }
    }
/*Get cause list details*/
    $("#getcauselist").click(function () {
        var casedate = $("#casedate").val();
        var scourt1 = $("input[name='ocasedata1']:checked").val(); 
        if (scourt1 == "") {
            alert("select court");
            return false;
        }
        if (casedate == "") {
            alert("select date");
            return false;
        }
        else {
            if (String(scourt1) == "3") {
                $("#questionLIstd").css("display", "block");
                $("#questionLIst").css("display", "none");
                tablename = "questionLIstd";
                CauselistCaseWatchd(casedate, scourt1,1);
            }
            else {
                $("#questionLIstd").css("display", "none");
                $("#questionLIst").css("display", "block");
                tablename = "questionLIst";
                CauselistCaseWatch(casedate, scourt1,1);
            }
        }
    });
    /*Get cause list casewatch*/
    function CauselistCaseWatch(casedate,court,loader) {
        $("#binddatacw").html("");
        $("#datastatus34").html("");
        var formData = new FormData();
        formData.append("casedate", casedate);
        formData.append("court", court);
        qty1 = 0;
        var html = '';
        if (String(loader) == "1") {
          openload();
        }
        var d0 = $.ajax({
            async: true,
            type: "POST",
            url: "/firm/CaseDailyCauseListDetails",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response == "") {
                    $("#datastatus34").html("There are no Cause List Details available for this date.");
                    closeload();
                    return false;
                }
                else {
                    var obj = JSON.stringify(response);
                    var q = 0;
                    $.each(response, function (i, a) {
                        q = q + 1;
                        var whtsdata = "";
                        html += '<tr><td>' + q + '</td><td class="case"> ' + a.Courtname + '</td><td class="court">' + a.CaseType + ' <td class="cname"> ' + a.Caseno + '</td><td class="bname">' + a.Caseyear + '</td>';
                        html += '<td class="adv"> ' + a.CourtNo + '</td><td class="nh">' + a.JudgName + ' <td  class="dd"> ' + a.SessionTime + '</td><td>' + a.CauselistDate + '</td>';
                        html += '<td>' + a.Filetext+'</td>';
                        html += '</tr>';
                    }); //End of foreach Loop
                    $("#binddatacw").append(html);
                    closeload();
                }
            }, //End of AJAX Success function
            failure: function (response) {
                alert(response.responseText);
                closeload();
            }, //End of AJAX failure function
            error: function (response) {
                alert(response.responseText);
                closeload();
            } //End of AJAX error function
        });
    }
    function CauselistCaseWatchd(casedate, court,loader) {
        $("#binddatacwd").html("");
        $("#datastatus34").html("");
        var formData = new FormData();
        formData.append("casedate", casedate);
        formData.append("court", court);
        //read assign using list
        qty1 = 0;
        var html = '';
        if (String(loader) == "1") {
            openload();
        }
        var d0 = $.ajax({
            async: true,
            type: "POST",
            url: "/firm/CaseDailyCauseListDetails",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response == "") {
                    $("#datastatus34").html("There are no Cause List Details available for this date.");
                    closeload();
                    return false;
                }
                else {
                    var obj = JSON.stringify(response);
                    var q = 0;
                    $.each(response, function (i, a) {
                        q = q + 1;
                        var whtsdata = "";
                        html += '<tr><td>' + q + '</td><td class="case"> ' + a.Case + '</td> <td class="cname"> ' + a.District + '</td><td class="bname">' + a.JudgName + '</td>';
                        html += '<td class="adv"> ' + a.SessionTime + '</td><td class="nh">' + a.CourtComplexCourtEstablishmentType + ' <td  class="dd"> ' + a.CourtComplexCourtEstablishment + '</td><td>' + a.CauselistDate + '</td>';
                        html += '<td>' + a.CauselistDetail + '</td>';
                        html += '</tr>';
                    }); //End of foreach Loop
                    $("#binddatacwd").append(html);
                    closeload();
                }
            }, //End of AJAX Success function
            failure: function (response) {
                alert(response.responseText);
                closeload();
            }, //End of AJAX failure function
            error: function (response) {
                alert(response.responseText);
                closeload();
            } //End of AJAX error function
        });
    }
    $("#getcauselist2").click(function () {
        var casecourt = $("input[name='ocasedate']:checked").val();
        if (casecourt == "") {
            alert("select court");
            return false;
        }
        else {
            if (String(casecourt) == "3") {
                $("#questionLIst3").css("display", "block");
                $("#questionLIst2").css("display", "none");
                tablename = "questionLIst3";
                CauselistCaseWatch3(casecourt);
            }
            else {
                $("#questionLIst3").css("display", "none");
                $("#questionLIst2").css("display", "block");
                tablename = "questionLIst2";
                CauselistCaseWatch2(casecourt);
            }
        }
    });
    
    function CauselistCaseWatch2(casecourt) {
        $("#binddatacw2").html("");
        $("#datastatus2").html("");
        var formData = new FormData();
        formData.append("token", "67");
        formData.append("courtflag", casecourt);
        //read assign using list
        qty1 = 0;
        var html = '';
        openload();
        var d0 = $.ajax({
            async: true,
            type: "POST",
            url: "/firm/CaseCauseListDetails",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response == "") {
                    $("#datastatus2").html("There are no Cause List Details available for this date.");
                    closeload();
                    return false;
                }
                else {
                    var obj = JSON.stringify(response);
                    var q = 0;
                    $.each(response, function (i, a) {
                        q = q + 1;
                        var whtsdata = "";
                        html += '<tr><td>' + q + '</td><td class="case"> ' + a.Courtname + '</td><td class="court">' + a.CaseType + ' <td class="cname"> ' + a.Caseno + '</td><td class="bname">' + a.Caseyear + '</td>';
                        html += '<td class="adv"> ' + a.CourtNo + '</td><td class="nh">' + a.JudgName + ' <td  class="dd"> ' + a.SessionTime + '</td><td>' + a.CauselistDate + '</td>';
                        html += '<td>' + a.Filetext + '</td>';
                        html += '</tr>';
                    }); //End of foreach Loop
                        $("#binddatacw2").append(html);
                    closeload();
                }
            }, //End of AJAX Success function
            failure: function (response) {
                alert(response.responseText);
                closeload();
            }, //End of AJAX failure function
            error: function (response) {
                alert(response.responseText);
                closeload();
            } //End of AJAX error function
        });
    }
    function CauselistCaseWatch3(casecourt) {
        $("#binddatacw3").html("");
        $("#datastatus2").html("");
        var formData = new FormData();
        formData.append("token", "67");
        formData.append("courtflag", casecourt);
        //read assign using list
        qty1 = 0;
        var html = '';
        openload();
        var d0 = $.ajax({
            async: true,
            type: "POST",
            url: "/firm/CaseCauseListDetails",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response == "") {
                    $("#datastatus2").html("There are no Cause List Details available for this date.");
                    closeload();
                    return false;
                }
                else {
                    var obj = JSON.stringify(response);
                    var q = 0;
                    $.each(response, function (i, a) {
                        q = q + 1;
                        var whtsdata = "";
                        html += '<tr><td>' + q + '</td><td class="case"> ' + a.Case + '</td><td class="court">' + a.State + '</td> <td class="cname"> ' + a.District + '</td><td class="bname">' + a.JudgName + '</td>';
                        html += '<td class="adv"> ' + a.SessionTime + '</td><td class="nh">' + a.CourtComplexCourtEstablishmentType + ' <td  class="dd"> ' + a.CourtComplexCourtEstablishment + '</td><td>' + a.CauselistDate + '</td>';
                        html += '<td>' + a.CauselistDetail + '</td>';
                        html += '</tr>';
                    }); //End of foreach Loop
                        $("#binddatacw3").append(html);
                    closeload();
                }
            }, //End of AJAX Success function
            failure: function (response) {
                alert(response.responseText);
                closeload();
            }, //End of AJAX failure function
            error: function (response) {
                alert(response.responseText);
                closeload();
            } //End of AJAX error function
        });
    }
});