var fcode = localStorage.getItem("FirmCode");
$(document).ready(function () {
    if (dashtimeentry == "display:unset") {
        $("#alink_timeentry").show();
    }
    else {
        $("#alink_timeentry").hide();
    }
    if (dashcontact == "display:unset") {
        $("#alink_contacts").show();
    }
    else {
        $("#alink_contacts").hide();
    }
    if (dashinvoice == "display:unset") {
        $("#alink_invoice").show();
    }
    else {
        $("#alink_invoice").hide();
    }
    if (dashtask == "display:unset") {
        $("#alink_task").show();
    }
    else {
        $("#alink_task").hide();
    }
    if (dashexpense == "display:unset") {
        $("#alink_expensecreated").show();
    }
    else {
        $("#alink_expensecreated").hide();
    }
    if (dashmatter == "display:unset") {
        $("#alink_matteradded").show();
    }
    else {
        $("#alink_matteradded").hide();
    }
    if (dashuser == "display:unset") {
        $("#alink_users").show();
    }
    else {
        $("#alink_users").hide();
    }
    if (dashmatter == "display:unset") {
        $("#divcontent").load("/Report/MatterReport");
    }
    $(document).on('change', '.chkdhide', function () {
        var column = "." + $(this).attr("name");
        $(column).toggle();
    });
    var expetime = 0;
    $("#alink_expensecreated").click(function () {
        openload();
        $("#alink_matteradded").removeClass("active");
        $("#alink_expensecreated").addClass("active");
        $("#alink_timeentry").removeClass("active");
        $("#alink_invoice").removeClass("active");
        $("#alink_task").removeClass("active");
        $("#alink_activity").removeClass("active");
        $("#alink_users").removeClass("active");
        $("#alink_contacts").removeClass("active");
        $("#divcontent").load("/Report/ExpenseCreated");
        closeload();
    });
    $("#alink_matteradded").click(function () {
        expetime = expetime + 1;
        openload();
        $("#alink_matteradded").addClass("active");
        $("#alink_expensecreated").removeClass("active");
        $("#alink_timeentry").removeClass("active");
        $("#alink_invoice").removeClass("active");
        $("#alink_task").removeClass("active");
        $("#alink_activity").removeClass("active");
        $("#alink_users").removeClass("active");
        $("#alink_contacts").removeClass("active");
        $("#divcontent").load("/Report/MatterReport");
        closeload();
    });
    $("#alink_timeentry").click(function () {
        openload();
        $("#alink_matteradded").removeClass("active");
        $("#alink_expensecreated").removeClass("active");
        $("#alink_timeentry").addClass("active");
        $("#alink_invoice").removeClass("active");
        $("#alink_task").removeClass("active");
        $("#alink_activity").removeClass("active");
        $("#alink_users").removeClass("active");
        $("#alink_contacts").removeClass("active");
        $("#divcontent").load("/Report/TimeEntryReport");
        closeload();
    });
    $("#alink_invoice").click(function () {
        openload();
        $("#alink_matteradded").removeClass("active");
        $("#alink_expensecreated").removeClass("active");
        $("#alink_timeentry").removeClass("active");
        $("#alink_invoice").addClass("active");
        $("#alink_task").removeClass("active");
        $("#alink_activity").removeClass("active");
        $("#alink_users").removeClass("active");
        $("#alink_contacts").removeClass("active");
        $("#divcontent").load("/Report/InvoiceReport");
        closeload();
    });
    $("#alink_task").click(function () {
        openload();
        $("#alink_matteradded").removeClass("active");
        $("#alink_expensecreated").removeClass("active");
        $("#alink_timeentry").removeClass("active");
        $("#alink_invoice").removeClass("active");
        $("#alink_task").addClass("active");
        $("#alink_activity").removeClass("active");
        $("#alink_users").removeClass("active");
        $("#alink_contacts").removeClass("active");
        $("#divcontent").load("/Report/TaskReport");
        closeload();
    });
    $("#alink_activity").click(function () {
        openload();
        $("#alink_matteradded").removeClass("active");
        $("#alink_expensecreated").removeClass("active");
        $("#alink_timeentry").removeClass("active");
        $("#alink_invoice").removeClass("active");
        $("#alink_task").removeClass("active");
        $("#alink_activity").addClass("active");
        $("#alink_users").removeClass("active");
        $("#alink_contacts").removeClass("active");
        $("#divcontent").load("/Report/ActivityReport");
        closeload();
    });
    $("#alink_users").click(function () {
        openload();
        $("#alink_matteradded").removeClass("active");
        $("#alink_expensecreated").removeClass("active");
        $("#alink_timeentry").removeClass("active");
        $("#alink_invoice").removeClass("active");
        $("#alink_task").removeClass("active");
        $("#alink_activity").removeClass("active");
        $("#alink_users").addClass("active");
        $("#alink_contacts").removeClass("active");
        $("#divcontent").load("/Report/UsersReport");
        closeload();
    });
    $("#alink_contacts").click(function () {
        openload();
        $("#alink_matteradded").removeClass("active");
        $("#alink_expensecreated").removeClass("active");
        $("#alink_timeentry").removeClass("active");
        $("#alink_invoice").removeClass("active");
        $("#alink_task").removeClass("active");
        $("#alink_activity").removeClass("active");
        $("#alink_users").removeClass("active");
        $("#alink_contacts").addClass("active");
        $("#divcontent").load("/Report/ContactsReport");
        closeload();
    });
});
function openload() {
    $("#myOverlay").css("display", "block");
}
function closeload() {
    $("#myOverlay").css("display", "none");
}