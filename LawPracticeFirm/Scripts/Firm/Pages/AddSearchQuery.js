var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var fcode = localStorage.getItem("FirmCode");
$(document).ready(function () {
    var fcode = localStorage.getItem("FirmCode");
    GetActState();
    /*Act on keyup*/
    $("#Act").keyup(function () {
        var st = document.getElementById("ActState").value;
        if (st == "0") {
            alert("Select the state.");
            $("#Act").val("");
            document.getElementById("ActState").focus();
            return false;
        }
        if ($("#Act").val().length > 2) {
            $("#hidactid").val("");
            $("#Section").empty();
            $("#Section").empty().append('<option value="0">Select</option>');
            var formData = new FormData();
            formData.append("stateid", $("#ActState").val());
            formData.append("act", $("#Act").val());
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/ManupatraSearchApi/ActByState",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response1) {
                    var str = "<ul id='Actlist'><li style=\" cursor:pointer; padding: 0; font-weight:bold; border-bottom: none;\"><span onclick=\"HideActautodiv()\" class=\"close_a\">×</span></li>";
                    if (response1.Data == "") {
                        str += "<li onClick=\"HideActautodiv()\">No Record Found</li>";
                    }
                    for (var i = 0; i < response1.Data.length; i++) {
                        var vText = response1.Data[i]["vactdesc"];
                        var vValue = response1.Data[i]["iActID"];
                        str += "<li style=\"cursor:pointer;\" onClick=\"SetActValue('" + vText + "','" + vValue + "')\">" + vText + "</li>";
                    }
                    str + "</ul>";
                    $("#Actlistdisp").attr("style", "border:1px solid #ccc;padding: 0 10px 10px 10px; margin:10px 0 10px 0; font-size:smaller; width:98%;")
                    $("#Actlistdisp").show();
                    $("#Actlistdisp").html(str);
                    $("#Act").css("background", "#FFF");
                    $("#Section").empty();
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
});
rdoptionval = "1";
/*click rdoption*/
function click_rdoption(val) {
    rdoptionval = val;
    if (val == "1") {
        document.getElementById("dvfreetext").style.display = "block";
        document.getElementById("divactsearch").style.display = "none";
        document.getElementById("ActState").value = "0";
        document.getElementById("Act").value = "";
        document.getElementById("Section").value = "0";
    }
    if (val == "2") {
        document.getElementById("dvfreetext").style.display = "none";
        document.getElementById("divactsearch").style.display = "block";
        document.getElementById("txtsearch").value = "";
    }
}
/*Act State Data*/
function GetActState() {
    var html3 = '';
    var formData = new FormData();
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/ManupatraSearchApi/ActStateData",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            if (response1.Data != "") {
                $("#ActState").html("");
            }
            else {
                $("#ActState").html("No State!");
            }
            var length = response1.Data.length;
            html3 += '<option value="0">-Select-</option>'
            for (var i = 0; i < response1.Data.length; i++) {
                var stateid = response1.Data[i]["IStateID"];
                var state = response1.Data[i]["VStateDesc"];
                html3 += '<option value=' + stateid + '>' + state + '</option>'
            }
            $("#ActState").html("");
            $("#ActState").append(html3);
        },
        failure: function (data) {
            alert(data.responseText);
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
}
/*Validation*/
function validation() {
    if (rdoptionval == "0") {
        alert("Please select search option");
        return false;
    }
    var st = document.getElementById("ActState").value;
    var qry = document.getElementById("txtsearch").value;
    var act = document.getElementById("Act").value;
    var Section = document.getElementById("Section").value;
    var citation = document.getElementById("txtcitation").value;
    var searchname = document.getElementById("txtsearchname").value;
    if (searchname == "") {
        alert("Enter search name");
        document.getElementById("txtsearchname").focus();
        return false;
    }
    if (rdoptionval == "1") {
        if (qry == "") {
            alert("Enter search text");
            document.getElementById("txtsearch").focus();
            return false;
        }
    }
    if (rdoptionval == "2") {
        if (st == "0") {
            alert("Select the state.");
            document.getElementById("ActState").focus();
            return false;
        }
        if (act == "") {
            alert("Enter Act name");
            document.getElementById("Act").focus();
            return false;
        }
        if (Section == "0") {
            alert("Select section");
            document.getElementById("Section").focus();
            return false;
        }
    }
    var formData = new FormData();
    formData.append("stateid", st);
    formData.append("act", act);
    formData.append("Section", Section);
    formData.append("citation", citation);
    formData.append("qry", qry);
    formData.append("searchname", searchname);
    $.ajax({
        cache: false,
        async: true,
        type: "POST",
        url: "/api/ManupatraSearchApi/InsertSearchQuery",
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            if (data.Data == "Success") {
                alert("Successfully Saved");
                location.reload();
            }
            else {
                alert("Unable to add, please delete or inactive the entries");
            }
        }
    });
}
/*Set act value*/
function SetActValue(atext, avalue) {
    $("#hidactid").val(avalue)
    $("#Act").val(atext);
    $("#Actlistdisp").hide();
    $("#Actlistdisp").html('');
    GetActSection();
}
/*Get act section*/
function GetActSection() {
    var formData = new FormData();
    formData.append("actid", $("#hidactid").val());
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/ManupatraSearchApi/ActSection",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            if (response1.Data != "") {
                $("#Section").empty();
            }
            else {
                $("#Section").html("No Data!");
            }
            $("#Section").empty().append('<option value="0">Select</option>');
            for (var i = 0; i < response1.Data.length; i++) {
                var vValue = response1.Data[i]["VCompVal"];
                var vText = response1.Data[i]["compdesc"];
                var textval = vText + " " + vValue;
                var option = '<option value="' + textval + '" > ' + textval + '</option>';
                $("#Section").append(option);
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
function HideActautodiv() {
    $("#Actlistdisp").hide();
}
