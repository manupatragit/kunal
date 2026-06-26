
var fcode = localStorage.getItem("FirmCode");
var pageindex = 1,
    pagesize = 10, recordcount = 0, totrecord = 0;
var pagindexModal = 1,
    pagesizeModal = 10, recordcountModal = 0, totrecordModal = 0;
var qty123 = 0;
var zoneIds = "";
var zonenanme = "";

$(document).ready(function () {
    addtaskmember4();
    ZoneDetailsById();
    jQuery("#courtList,#teammemberss").multiselect({
        columns: 1,
        //placeholder: 'Select Mattertyt',
        search: true,
        selectAll: false
    });

    jQuery('#clearmember').click(function () {
        var $select = $("#courtList,#teammemberss").selectize();
        var selectize = $select[0].selectize;
        selectize.clear();
        selectize.clearOptions();
    });


})

function clearZoneForm() {

    $("#zone").val("");
}
function SubmitZoneDetails() {
    openload();
    var zone = $("#zone").val();
    if (zone == "" || zone == null || zone == undefined) {
        $("#zone").focus();
        return window.alert("Please enter the zone name");
    }
    $.ajax({
        type: "POST",
        url: "/CW/AddZoneDetails",
        data: {
            zoneName: zone,
        },
        success: function (response) {
            response = JSON.parse(response);

            if (response.data == 0) {
                alert("Zone Is already exist.");
                clearZoneForm();
            }
            else if (response.data == 1) {
                alert("Zone has been added.");
                ZoneDetailsById();
                clearZoneForm();
            }

            else {
                alert("Some thing went wrong.");
                clearZoneForm();
            }

            closeload();
        },
        error: function (error) {
            closeload();
        }
    });
}

function ZoneDetailsById() {
    openload();
    $.ajax({
        type: "POST",
        url: "/CW/ZonlistById",
        data: {

        },
        success: function (response) {
            var htmls = '';
            response = JSON.parse(response);
            if (response.data.length > 0) {
                $.each(response.data, function (index, value) {
                    qty123 = qty123 + 1;
                    htmls += '<tr>' +
                        '<td>' + (index + 1) + '</td>' +
                        '<td>' + value.name + '</td>' +
                        '<td class="">' +
                        '<span ' +
                        'onclick="ViewAssigncourt(\'' + value.zoneId + '\', \'' + qty123 + '\')" ' +
                        'data-toggle="collapse" ' +
                        'id_val="' + value.zoneId + '" ' +
                        'data-target="#dtn' + qty123 + '" ' +
                        'style="color:blue;cursor:pointer">' +
                        'more' +
                        '</span>' +
                        '<div ' +
                        'id="dtn' + qty123 + '" ' +
                        'class="collapse caseinfo" ' +
                        'style="border: 2px solid rgb(143, 213, 0); padding: 4px; width: 281px; position: inherit; border-radius: 10px; left: 65%; height: 71px;">' +
                        '<button ' +
                        'type="button" ' +
                        'class="close" ' +
                        'data-toggle="collapse" ' +
                        'data-target="#dtn' + qty123 + '" ' +
                        'style="padding-top: -34px; margin-top: -5px;">' +
                        '×' +
                        '</button>' +
                        '<span id="binddataalert_' + qty123 + '"></span>' + 
                        '</div>' +
                        '</td>' +
                        '<td>' +
                        '<span ' +
                        'id="updateUserById" ' +
                        /*'class="glyphicon glyphicon-edit" ' +*/
                        'style="cursor:pointer;" ' +
                        'data-id="' + value.zoneId + '" ' +
                        'data-toggle="modal" ' +
                        'data-target="#UpdatePWDetaildata" ' +
                        'title="Assign court to zone" ' +
                        'onclick="OpenAppealInformation(\'' + value.zoneId + '\', \'' + value.name + '\')">' +
                        '<img src="/newassets/img/court-icon.png" />' +
                        '</span>' +
                        '<span ' +
                        'id="deleteUserByid" ' +
                        /*'class="fa fa-user-plus" ' +*/
                        'style="cursor:pointer;" ' +
                        'data-id="' + value.zoneId + '" ' +
                        'title="Assign User" ' +
                        'onclick="OpenModalUser(\'' + value.zoneId + '\', \'' + value.name + '\')">' +
                        '<img src="/newassets/img/add-user.png" />' +
                        '</span>' +
                        '<span ' +
                        'id="deleteUserByid" ' +
                        /*'class="glyphicon glyphicon-trash" ' +*/
                        'style="cursor:pointer;" ' +
                        'data-id="' + value.zoneId + '" ' +
                        'title="Delete zone" ' +
                        'onclick="DeleteZoneDetails(\'' + value.zoneId + '\')">' +
                        '<img src="/newassets/img/deletecasesingle-icon.png" />' +
                        '</span>' +
                        '</td>' +
                        '</tr>';

                });
                $('#ZoneData').html(htmls);
            }
            else {
                $("#ptfooter").html("");

                htmls += '<tr>';
                htmls += '<td colspan="4"><div style="text-align:center;">' +
                    '<img src="/newassets/img/not-found.png" alt="Not Found">' +
                    '<h4>No Case list found</h4>' +
                    '<p>We found no Case list.</p>' +
                    '</div></td>';
                htmls += '</tr>';


                $('#ZoneData').html(htmls);
            }
            console.log(response);
            closeload();
        },
        error: function (error) {
            closeload();
        }
    });
}
function ViewAssigncourt(id, flags) {
    
    $("#binddataalert_" + flags + "").empty();

    var formdata = new FormData();
    formdata.append('Id', EncodeText(id));
    $.ajax({
        type: "POST",
        url: "/CW/ListOfAssignCourtZoneWise",
        data: formdata,
        contentType: false,
        processData: false,
        success: function (data) {
            
            data = JSON.parse(data);
            $("#binddataalert").empty();
            let courtNames = data.data.map(item => item.courtName).join(", ");

            $("#binddataalert_" + flags + "").empty();
            $("#binddataalert_" + flags + "").html(courtNames);
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
            console.error("Response:", xhr.responseText);
        }
    });
}

function OpenAppealInformation(zoneId, name) {
    
   // flagOff += 1;
    zoneIds = zoneId;
    zonenanme = name;
    $("#zoneName").val(name);
    FillCourtType1();
    $('#AppealModalInformation').modal({ show: true });
    AssignCourtZonWise(zoneId);
}

function closeModalAppeal() {
    zoneId = "";
    zonenanme = "";
    $('#AppealModalInformation').modal('hide');
}



function FillCourtType1() {
    $("#benchSection").css("display", "none");
    var drpbench1 = $("#drpbench1");
    drpbench1.empty();
    $("#stateSelection").css("display", "none");
    var drpState1 = $("#drpState1");
    drpState1.empty();
    var option = "";
    $("#divSCHCDistrict1").empty();
    $.ajax({
        async: true,
        type: "POST",
        url: "/Firm/FillCourt",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var option = '<option value="">Select Court Type</option>';
            $.each(response, function (i, a) {
                if (a["id"] == 1 || a["id"] == 5) {

                }
                else {
                    option += '<option value="' + a["id"] + '" >  ' + a["courtname"] + '</option>';
                }
                
            });
            $("#divSCHCDistrict1").append(option);//End of foreach Loop

        }, //End of AJAX Success function
        failure: function (response) {
            alert(data.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            alert(data.responseText);
        }
        });
}

function AddCourtName1() {
    $("#benchSection").css("display", "none");
    var drpbench1 = $("#drpbench1");
    drpbench1.empty();
    $("#stateSelection").css("display", "none");
    var drpState1 = $("#drpState1");
    drpState1.empty();
    var strcourttype = $("#divSCHCDistrict1").val();
    $.ajax({
        type: "POST",
        url: "/AddCase/AddCourtNameByCourtType?courttype=" + strcourttype,
        dataType: "json",
        success: function (response) {
            
            var obj = response;
            $("#courtList").html("");
            $.each(response, function (key1, value) {
                $(".ms-selectall").show();
                $("#courtList").append($("<option></option>").val(value.courtid).text(value.courtname));
            });
            $("#courtList").multiselect('reload');
        },
        error: function (data) {
        }
    });
}



function AssignCourtZonWise(id) {
    
    var formdata = new FormData();
    formdata.append("Id", EncodeText(id));

    $.ajax({
        type: "POST",
        url: "/CW/ListOfAssignCourtZoneWise",
        data: formdata,
        contentType: false,
        processData: false,
        success: function (data) {
            ;
            data = JSON.parse(data);

            // Assuming `data` contains an array of court objects with `iid` and `courtname`
            const tileContainer = document.getElementById("tileContainer");
            tileContainer.innerHTML = ""; // Clear existing tiles

            data.data.forEach((court) => {
                // Create a new tile for each court
                const tile = document.createElement("div");
                //tile.className = "tile";
                //tile.setAttribute("data-id", court.iid);

                tile.classList.add("tiles");
                tile.setAttribute("data-id", court.iid);
                tile.setAttribute("data-fulltext", court.courtName);
                tile.setAttribute("title", court.courtName);

                // Add court name to tile
                const tileText = document.createElement("span");
                tileText.textContent = court.courtName;

                // Add delete button to tile
                const deleteButton = document.createElement("button");
                deleteButton.className = "delete-btn";
                deleteButton.textContent = "X";
                deleteButton.onclick = function () {
                    tileContainer.removeChild(tile);
                    DeleteAssignCourtDetails(tile.getAttribute("data-id"));
                };

                // Append text and button to tile
                tile.appendChild(tileText);
                tile.appendChild(deleteButton);

                // Append tile to container
                tileContainer.appendChild(tile);
            });
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
            console.error("Response:", xhr.responseText);
        },
    });
}


function AssignCourtZoneWise()
{
    var formdata = new FormData();
    if ($("#courtList").val() == "" || $("#courtList").val() == undefined || $("#courtList").val() == null) {
        window.alert("Pelease select the court");
        window.focus("#courtList")
        return;
    }
    formdata.append("ZoneId", zoneIds);
    formdata.append("crtid", $("#courtList").val());
    $.ajax({
        type: "POST",
        url: "/CW/AssignCourtZoneWise",
        data: formdata,
        contentType: false,
        processData: false,
        success: function (data) {
            data = JSON.parse(data);
            window.alert("Updated successfully.");
            AssignCourtZonWise(zoneIds);
        }
    });

}

//Teammember list get 
function addtaskmember4() {
    
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/MatterApi/TeamMemberbyFirmId",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#teammemberss").html("");
            if (response.Status == true) {
                var datas = JSON.stringify(response);
                //alert(datas);
                var obj = JSON.parse(response.Data);
          
                $.each(obj, function (key1, value) {
                    $(".ms-selectall").show();
                    if (value.roleid == 1) {

                    }
                    else {
                        $("#teammemberss").append($("<option></option>").val(value.id).text(value.UserName));

                    }
                });
                $("#teammemberss").multiselect('reload');

            }
        }
    });
}


function OpenModalUser(zoneId, name) {
    
    // flagOff += 1;
    zoneIds = zoneId;
    zonenanme = name;
    $("#zoneName1").val(name);
    $('#AssignUserToZone').modal({ show: true });
    AssignuserlistZonWise(zoneIds);
    addtaskmember4();
}

function closeModalUser() {
    zoneId = "";
    zonenanme = "";
    $('#AssignUserToZone').modal('hide');
}

//Save Assign User to zone
function AssignUserToZone() {
    if ($("#teammemberss").val() == null || $("#teammemberss").val() == undefined || $("#teammemberss").val() == "") {
        window.alert("Please select the user");
        return;
    }

    var formdata = new FormData();
    formdata.append("ZoneId", zoneIds);
    formdata.append("Assignto", $("#teammemberss").val());
    var teamMembers = document.getElementById("teammemberss");
    var selectedTexts = Array.from(teamMembers.selectedOptions).map(function (option) {
        return option.text;
    });
    var commaSeparatedTexts = selectedTexts.join(",");
    formdata.append("AssignUserName", commaSeparatedTexts);

    $.ajax({
        type: "POST",
        url: "/CW/AssignUserZoneWise",
        data: formdata,
        contentType: false,
        processData: false,
        success: function (data) {
            
            data = JSON.parse(data);
            AssignuserlistZonWise(zoneIds);
            window.alert("Updated successfully.");
        }
    });
}



//Delete zone details by id
function DeleteZoneDetails(zoneId) {
    
    openload();
    $.ajax({
        type: "POST",
        url: "/CW/DeleteZoneDetailsById",
        data: {
            zoneId: zoneId,
        },
        success: function (response) {
            response = JSON.parse(response);

            if (response.data == 1) {
                alert("Succesfully Deleted.");
                ZoneDetailsById();
            }
            else if (response.data == 0) {
                alert("Zone is already assign to user you can't delete.");

            }

            else {
                alert("Some thing went wrong.");
            }

            closeload();
        },
        error: function (error) {
            closeload();
        }
    });
}




function AssignuserlistZonWise(id) {
    
    var formdata = new FormData();
    formdata.append("Id", EncodeText(id));

    $.ajax({
        type: "POST",
        url: "/CW/ListOfAssignUserZoneWise",
        data: formdata,
        contentType: false,
        processData: false,
        success: function (data) {
            data = JSON.parse(data);
            const tileContainer = document.getElementById("tileContainerUser");
            tileContainer.innerHTML = ""; // Clear existing tiles

            data.data.forEach((court) => {
                // Create a new tile for each court
                const tile = document.createElement("div");
                tile.classList.add("tiles");
                tile.setAttribute("data-id", court.iid);
                tile.setAttribute("data-fulltext", court.vDispName);
                tile.setAttribute("title", court.vDispName);

                // Add court name to tile
                const tileText = document.createElement("span");
                tileText.textContent = court.vDispName;

                // Add delete button to tile
                const deleteButton = document.createElement("button");
                deleteButton.className = "delete-btn";
                deleteButton.textContent = "X";
                deleteButton.onclick = function () {
                    tileContainer.removeChild(tile);
                    DeleteAssignuserDetails(tile.getAttribute("data-id"));
                };
                tile.appendChild(tileText);
                tile.appendChild(deleteButton);
                tileContainer.appendChild(tile);
            });
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
            console.error("Response:", xhr.responseText);
        },
    });
}



//Delete user details by id
function DeleteAssignuserDetails(iid) {
    
    openload();
    $.ajax({
        type: "POST",
        url: "/CW/DeleteAssignUserDetailsById",
        data: {
            iid: iid,
        },
        success: function (response) {
           // response = JSON.parse(response);

                alert("Succesfully Deleted.");
      

            closeload();
        },
        error: function (error) {
            closeload();
        }
    });
}


//Delete court details by id
function DeleteAssignCourtDetails(iid) {

    openload();
    $.ajax({
        type: "POST",
        url: "/CW/DeleteAssignCourtDetailsById",
        data: {
            iid: iid,
        },
        success: function (response) {
            // response = JSON.parse(response);

            alert("Succesfully Deleted.");


            closeload();
        },
        error: function (error) {
            closeload();
        }
    });
}
var benchFlg = false;
function BenchNameList() {
    benchFlg = false;
    var crtid = $("#courtList").val();
    var drpbench1 = $("#drpbench1");
    drpbench1.empty();
    $.ajax({
        type: "POST",
        url: "/AddCase/GetBenchName?crtid=" + crtid,
        dataType: "json",
        success: function (data) {
            if (data.length > 0) {
                benchFlg = true;
                $("#benchSection").css("display", "block"); 

                drpbench1.append("<option value=''>Select Bench</option>");
                for (var i = 0; i < data.length; i++) {
                    $("#drpbench1").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");
                }
            }
            else {
                drpbench1.empty();
                $("#benchSection").css("display", "none");
            }
          
        },
        error: function (data) {
        }
    });
}

//Add state select field for consumer form
/*Fill NCDRC State*/
function fillNCDRCState1() {
    //Prem logic start
    var vCourt = $("#courtList").val();
    var drpState1 = $("#drpState1");
    drpState1.empty();
    if (vCourt != "CF") {
        $("#stateSelection").css("display", "none");
        return;
    }
    var vBench = $("#drpbench1").val();
    if (vBench == "B") {
        $("#stateSelection").css("display", "none");
        return;
    }
    else if (vCourt == "CF" && vBench != "B") {
        $.ajax({
            type: "POST",
            url: "/AddCase/AddFillTriDistrictState?courtid=" + vCourt + "&courttype=" +"4" + "&iDistrict=" + "0",
            dataType: "json",
            success: function (data) {
                drpState1.append("<option value='0'>-Select the state.-</option>");
                for (var i = 0; i < data.length; i++) {
                    drpState1.append("<option value='" + data[i].Stateid + "'>" + data[i].Statename + "</option>");
                }
                $("#stateSelection").css("display", "block");

            },
            error: function (data) {
            }
        });
    }
}




function AssignCourtZoneWise() {
    var formdata = new FormData();
    if ($("#courtList").val() == "" || $("#courtList").val() == undefined || $("#courtList").val() == null) {
        window.alert("Pelease select the court");
        window.focus("#courtList")
        return;
    }
    if (benchFlg === true && ($("#drpbench1").val() === "" || $("#drpbench1").val() === undefined || $("#drpbench1").val() === null)) {
        window.alert("Please select the bench");
        $("#drpbench1").focus();
        return;
    }

    formdata.append("ZoneId", zoneIds);
    formdata.append("crtid", $("#courtList").val());
    formdata.append("bench", $("#drpbench1").val());
    formdata.append("vState", $("#drpState1").val());
    $.ajax({
        type: "POST",
        url: "/CW/AssignCourtZoneWise",
        data: formdata,
        contentType: false,
        processData: false,
        success: function (data) {
            response = JSON.parse(data);
            if (response.data == 1) {
                window.alert("Updated successfully.");
            }
            else if (response.data == 2) {
                window.alert("This court has already assigned.");
            }
            if (response.data == 3) {
                window.alert("This court has assigned to another zone. You can't assigned same court to different zone.");
            }
            $("#courtList").val("");
            $("courtList").val("0")
            var drpbench1 = $("#drpbench1");
            drpbench1.empty();
            $("#benchSection").css("display", "none");
            var drpState1 = $("#drpState1");
            drpState1.empty();
            $("#stateSelection").css("display", "none");

            AssignCourtZonWise(zoneIds);
        }
    });

}

