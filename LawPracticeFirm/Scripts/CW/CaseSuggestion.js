$(document).ready(function () {
    var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
    var fcode = localStorage.getItem("FirmCode");
    GetCaseSuggestion();
    $("#rdSC").click(function () {
        document.getElementById("hdnRadioType").value = "1";
        $("#vcode").val($("#scid").val());
        GetCaseSuggestion();
    });
    $("#rdHC").click(function () {
        document.getElementById("hdnRadioType").value = "2";
        $("#vcode").val($("#hcid").val());
        GetCaseSuggestion();
    });
    $("#rdDC").click(function () {
        document.getElementById("hdnRadioType").value = "3";
        $("#vcode").val($("#dcid").val());
        GetCaseSuggestion();
    });
    /*Get Counsel Juris diction*/
    function CounselJurisdiction() {
        var html3 = '';
        var formData = new FormData();
        $.ajax({
            async: true,
            type: "POST",
            url: "/CW/CounselJurisdiction",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var length = response1.length;
                if (length > 0) {
                    $.each(response1, function (i, a) {
                        var id = a.Id;
                        var vCode = a.VCode;
                        var x = parseInt(id);
                        if (isNaN(x)) {
                            if (id == "SC") {
                                $("#scid").val(id);
                            }
                            else {
                                $("#hcid").val(id);
                            }
                        }
                        else {
                            $("#dcid").val(id);
                        }
                    });
                }
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    }
    /*Get MyKase Counsel Suggested Case Details By Id*/
    $(document).on('click', '#getdetails', function () {
        var ids = $(this).attr("data-id");
        var html3 = '';
        var formData = new FormData();
        formData.append("Id", ids);
        $('#myModal').modal({ show: true });
        $.ajax({
            async: true,
            type: "POST",
            url: "/CW/MyKaseCounselSuggestedCaseDetailsById",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var length = response1.length;
                if (length > 0) {
                    $("#divState option").remove();
                    html3 += ''
                    $.each(response1, function (i, val) {
                        html3 += '<tr>'
                        html3 += '<td > '
                        html3 += val.AppealNo
                        html3 += '</td>'
                        html3 += '<td>'
                        html3 += val.Court
                        html3 += '</td>'
                        html3 += '<td>'
                        html3 += val.Appres
                        html3 += '</td>'
                        html3 += '</td>'
                        html3 += '<td> '
                        html3 += val.Counsels
                        html3 += '</td>'
                        html3 += '<td> '
                        html3 += val.District
                        html3 += '</td>'
                        html3 += '</tr>'
                    });
                    $("#bindappeal").html("").html(html3);
                }
                $("#divState").append(html3);
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    });
    /*Get Case Suggestion*/
    function GetCaseSuggestion() {
        var courttype = 1;
        var searchtext = "";
        var vcode = $("#vcode").val();
        var rtype = "1";
        rtype = $("#hdnRadioType").val();
        if (rtype == "1") {
            courttype = "1";
        }
        if (rtype == "2") {
            courttype = "2";
        }
        if (rtype == "3") {
            courttype = "3";
        }
        var html3 = '';
        html3 += '<table id="example" style="overflow-x:auto;" class="table table-bordered table-striped">'
        html3 += '<thead>'
        if (rtype == "3") {
            html3 += '<tr >'
            html3 += '<th width="20%">Appeal No</th>'
            html3 += '<th width="50%">Party Name</th>'
            html3 += '<th width="15%">District</th>'
            html3 += '<th width="15%">Court</th>'
            html3 += '</tr>'
        }
        else {
            html3 += '<tr >'
            html3 += '<th width="20%">Appeal No</th>'
            html3 += '<th width="60%">Party Name</th>'
            html3 += '<th width="20%">Court</th>'
            html3 += '</tr>'
        }
        html3 += '</thead>'
        html3 += '<tbody>'
        var formData = new FormData();
        formData.append("vcode", courttype);
        formData.append("Pageindex", pageindex);
        formData.append("Pagesize", pagesize);
        $.ajax({
            async: true,
            type: "POST",
            url: "/CW/MyKaseCounselSuggestedCases",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var length = response1.length;
                if (length > 0) {
                    $("#divsearchbypartyname tr").remove();
                    $.each(response1, function (i, a) {
                        var vdoc = "", dtype = "";
                        if (rtype == "3") {
                            html3 += '<tr>'
                            html3 += '<td> '
                            html3 += "<a href='javascript:void()' id='getdetails' data-id='" + a.Id + "'>" + a.AppealNo + "</a>"
                            html3 += '</td>'
                            html3 += '<td>'
                            html3 += a.Appres
                            html3 += '</td>'
                            html3 += '<td>' + a.District
                            html3 += '</td>'
                            html3 += '<td>'
                            html3 += a.Court
                            html3 += '</td>'
                            html3 += '</tr>'
                        }
                        else {
                            html3 += '<tr>'
                            html3 += '<td> '
                            html3 += "<a href='javascript:void()' id='getdetails' data-id='" + a.Id + "'>" + a.AppealNo + "</a>"
                            html3 += '</td>'
                            html3 += '<td>'
                            html3 += a.Appres
                            html3 += '</td>'
                            html3 += '<td>' + a.Court
                            html3 += '</td>'
                            html3 += '</tr>'
                        }
                    });
                } else {
                    html3 += '<tr>'
                    html3 += '<td colspan=4 align=center>Data Not Found</td></tr>'
                }
                html3 += '</tbody>'
                html3 += '</table>'
                $("#divsearchbypartyname").html("");
                $("#divsearchbypartyname").append(html3);
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    }
});