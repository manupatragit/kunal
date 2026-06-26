
var pageNumber = 1, pagesize = 10, recordcount = 0, totrecord = 0;
$(document).ready(function () {
  
    toDoListData(pageNumber);
    $(function () {
        var dtToday = new Date();
        var month = dtToday.getMonth() + 1;
        var day = dtToday.getDate();
        var year = dtToday.getFullYear();
        if (month < 10)
            month = '0' + month.toString();
        if (day < 10)
            day = '0' + day.toString();
        var maxDate = year + '-' + month + '-' + day;
        $('#txtduedatenotice').attr('min', maxDate);
    });
});

$(document).on('click', '#getdatabypagenum', function () {
    pageNumber = $("#pagnumvalue").val();
    if (pageNumber != "undefined") {
        if (Math.sign(pageNumber) == 1) {
            var ppageindesx = $("#sotopage").text();
            if (pageNumber <= parseInt(ppageindesx)) {
                openload();
                toDoListData(pageNumber);
                //closeload();
            }
            else {
                alert("Please enter a valid page number.");
                closeload();
                return false;
            }
        }
    }
});

/*Paginate*/
$(document).on('click', '#ppaginate', function () {
    pageNumber = $(this).attr("index");
    toDoListData(pageNumber);
});
//load table data
$(document).on('click', '#pgetdatabypagenum', function () {

    var pageNumbers = $("#ppagnumvalue").val();
    if (pageNumbers != "undefined") {
        if (Math.sign(pageNumbers) == 1) {
            var ppageindesxa = $("#psotopage").text();
            if (pageNumbers <= parseInt(ppageindesxa)) {
                openload();
                toDoListData(pageNumbers);
                closeload();
            }
            else {
                alert("Please enter a valid page number.");
                closeload();
            }
        }
        else {
            alert("Please enter a valid page number.");
        }
    }
});
// Get To Do List table data
function toDoListData(pageNumber) {
    var formData = new FormData();
    formData.append("pageNumber", EncodeText(pageNumber));
    formData.append("pagesize", EncodeText(pagesize));
    openload();
    $.ajax({
        type: "POST",
        url: "/api/CallApi/ToDoList",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            $("#ptfooterToDoList").empty();
            var obj = JSON.parse(response.Data);
            var htmls = '';
            if (obj.length > 0) {
                $.each(obj, function (i, value) {
                    if (i === 0) {
                        firstvalue = value.RowId;
                    }
                    if (i === (obj.length - 1)) {
                        var pnext = pageNumber;
                        var pprev = pageNumber;
                        var pageno = pageNumber;
                        var totdata = value.TotalRows;
                        var totpage = 0;
                        if (value.TotalRows > 0) {
                            pnext = parseInt(pnext) + 1;
                            if (pnext == 0) pnext = 1;
                            pprev = parseInt(pageno) - 1;
                            if (pprev == 0) pprev = 1;
                            totpage = parseInt(totdata) / parseInt(pagesize);
                            if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            $("#pagnumvalue").attr("max", totpage);
                        }
                 
                        var tfot = '';
                        tfot += '<ul>'
                        tfot += '<li>results <span>' + value.TotalRows + '</span>  <span id="psotopage" style="display:none">' + totpage + '</span></li>'
                        tfot += '<li><span>|</span></li>'
                        tfot += '<li>pages ' + pageNumber + '/ ' + parseInt(totpage) + '</li>'
                        tfot += '<li><span>|</span></li>'
                        tfot += '<li ><input type="number" id="ppagnumvalue" min="1"  style="border-bottom:1px solid #4b4b4b!important;width:30px;margin:0 8px 0 0 !Important"><a type="button" id="pgetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                        if (value.TotalRows <= obj.length) {
                        }
                        else if (pageno == 1) {
                        }
                        else if (pageno == totpage) {
                            tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span></a></span>  ' + firstvalue + '-' + value.RowId + '  <span>'
                        }
                        else {
                            tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span> </a></span>  ' + firstvalue + '-' + value.RowId + '  <span>'
                        }
                        if (pageno < totpage) {
                            tfot += '<a  id="ppaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><span class="glyphicon glyphicon-arrow-right" style="padding:0 0 0 10px !important"></span></a ></span ></li >'
                        }
                        tfot += '</ul>'
                        $("#ptfooterToDoList").append(tfot);
                    }

                    var options = { day: 'numeric', month: 'short', year: 'numeric' };
                    var formattedUpdateDate = new Date(value.dUpdateDate).toLocaleDateString('en-GB', options);
                    var formattedDueDate = new Date(value.vDueDate).toLocaleDateString('en-GB', options);
                    htmls += '<tr>' +

                        '<td  class="todoDetails">' + value.vToDos + '</td>' +
                        '<td  class="todoStatus">' + value.vStatus + '</td>' +
                        '<td  class="todoCreatedOn">' + formattedUpdateDate + '</td>' +
                        '<td  class="todoDueDate">' + formattedDueDate + '</td>' +
                        '<td>' + '<span id="editStatusbyId" style="cursor:pointer;" title="Edit Status" onclick="EditStatusById(' + value.iid + ')"><img src="/newassets/img/edit-icon.png"></span>' + '</td>' +
                        '<td>' + '<span id="deleteByTodoId" style="color:black; cursor:pointer;" data-id="' + value.iid + '"title="Delete User"> <img src="/newassets/img/deletecasesingle-icon.png"> </span>' + '</td>'
                        + '</tr>'
                });
                closeload();
                $('#toDoListData').html(htmls);
                $(document).ready(function () {
                    $('.shcheckbox1').change(function () {
                        var columnName = $(this).val();
                        $('.' + columnName).toggle();
                    });
                });
            }
            closeload();
        },
        error: function (data) {
            alert("Error fetching to-do list.");
            closeload();
        }
    });
}

var statusId = "";
function EditStatusById(id) {
    $('#myModalNotespopup').css('display', 'block');
    statusId = id;
}

// Edit and update status of To Do List Data
function updateStatus() {
    var selectedStatus = $("#divToDoStatus").val();
    var formData = new FormData();
    formData.append("iId", statusId);
    // Check if the selected status is 'Others'
    if (selectedStatus === '05') {
        var otherReason = $("#otherReason").val();
        formData.append("statusOption", otherReason);
    } else {
        formData.append("statusOption", selectedStatus);
    }
    openload();
    $.ajax({
        type: "POST",
        url: "/api/CallApi/UpdateStatusById",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            alert("Status updated successfully.");
            $('#myModalNotespopup').css('display', 'none');
            closeload();
            toDoListData(pageNumber);
        },
        error: function (data) {
            alert("Error updating status.");
            closeload();
        }
    });
}

function ModalNotesClose() {
    document.getElementById("myModalNotespopup").style.display = "none";
}

//Delete To Do List Data by Id
//$(document).on('click', '#deleteByTodoId', function () {
//    if (window.confirm("Are you sure you want to Delete?")) {
//        openload();
//        var id = $(this).data('id');
//        var formData = new FormData();
//        formData.append("iId", id);
//        openload();
//        $.ajax({
//            type: "POST",
//            url: "/api/CallApi/RemoveToDoListData",
//            dataType: 'json',
//            data: formData,
//            contentType: false,
//            processData: false,
//            success: function (response) {
//                alert("Task deleted successfully.");
//                toDoListData(pageNumber);
//                closeload();
//            },
//            error: function (error) {
//                closeload();
//            }
//        });
//    } else {
//    }
//})

$(document).on('click', '#deleteByTodoId', function () {
    var todoId = $(this).data('id');
    $("#removeToDoConfModal").modal();
    $("#removeToDoCnfirmD").attr("data-id", todoId);
})
$(document).on('click', "#removeToDoCnfirmD", function () {
    openload();
    var id = $(this).attr("data-id");
    DeleteRecordByToDoId(id);
});
function DeleteRecordByToDoId(id) {
    var formData = new FormData();
    formData.append("iId", id);
    openload();
    $.ajax({
        type: "POST",
        url: "/api/CallApi/RemoveToDoListData",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            //alert("Task deleted successfully.");
            new PNotify({
                title: 'Success!',
                text: 'Task deleted successfully.',
                type: 'success',
                delay: 3000
            });
            $("#removeToDoConfModal").modal("hide");
            toDoListData(pageNumber);
            closeload();
        },
        error: function (error) {
            closeload();
        }
    });
}

function submitData() {
    // Call validation function
    if (!validatetodos()) {
        return; // Stop submission if validation fails
    }
    var formData = new FormData();
    var dateValue = $("#txtduedatenotice").val();
    var txt = $("#txtnote").val();
    formData.append("txtnote", txt);
    formData.append("txtduedatenotice", dateValue);
    openload();
    $.ajax({
        type: "POST",
        url: "/api/CallApi/SaveDataOFToDO",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            alert("Task Added Successfully.");
            closeload();
        },
        error: function (data) {
            alert(data.responseText);
            closeload();
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    var selectElement = document.getElementById("divToDoStatus");
    // Iterate through options to find and disable the "Select" option
    for (var i = 0; i < selectElement.options.length; i++) {
        if (selectElement.options[i].value === "00") {
            // Disable the "Select" option
            selectElement.options[i].disabled = true;
            break;
        }
    }
});

//Input box of Other Reason handling on selected 'Others' dropdown Value
function handleStatusChange(selectedValue) {
    var otherInputBox = document.getElementById('otherInputBox');
    if (selectedValue === '05') {
        otherInputBox.style.display = 'block';
    } else {
        otherInputBox.style.display = 'none';
    }
}

// Validattion for Due date and Notes 
function validatetodos() {
    if (document.getElementById("txtduedatenotice").value == "") {
        alert("please enter due date.");
        document.getElementById("txtduedatenotice").focus();
        return false;
    }
    if (document.getElementById("txtnote").value == "") {
        alert("please enter notes");
        document.getElementById("txtnote").focus();
        return false;
    }
    return true;
}
