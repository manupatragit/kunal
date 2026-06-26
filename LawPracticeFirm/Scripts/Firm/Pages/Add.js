function AddController() {
    var privateVariables = {
        configuredcustomfields: [],
        url: '',
        workflowfields: []
    };
    var delegateMethods = {
        showModal: function () {
            $(".fstElement", $("#divwfFields")).removeClass("col-md-3").addClass("col-md-12");
        },
        hideModal: function () {
            if (document.activeElement.id !== "btnClose") {
                var d = {};
                d.Data = privateVariables.configuredcustomfieldsdata;
                d.WorkFlowData = null;
                var d = {
                    WorkFlowData: [],
                    Client: {
                        "UserName": $.trim($("#txtusername").val()),
                        "Password": $.trim($("#txtpassword").val())
                    },
                    Data: privateVariables.configuredcustomfieldsdata
                }
                if (privateMethods.validateWorkflowFields()) {
                    alert("Save with workflow!!");
                    CustomFields.saveCustomFieldValues(privateVariables.url, d, { "configurationtype": configurationtype }, delegateMethods.saved);
                }
            }
        },
        save: function () {
            privateVariables.configuredcustomfieldsdata = [];
            var error = false;
            var errorMessage = "";
            var d = {};
            switch (configurationtype) {
                case 1:
                    var input = $("#txtusername");
                    var fieldname = $(input).attr("placeholder");
                    if (($(input).is(":required") && $(input)[0].validity.valueMissing)) {
                        error = true;
                        errorMessage += ">> " + fieldname + "-" + $(input)[0].validationMessage + "\n";
                    } else {
                        var password = $("#txtpassword");
                        var fieldname = $(password).attr("placeholder");
                        if (($(password).is(":required") && $(password)[0].validity.valueMissing)) {
                            error = true;
                            errorMessage += ">> " + fieldname + "-" + $(password)[0].validationMessage + "\n";
                        }
                        else {
                            privateVariables.url = "api/EmployeeApi/AddNewUser";
                            d = {
                                User: {
                                    "UserName": $.trim($("#txtusername").val()),
                                    "Password": $.trim($("#txtpassword").val())
                                }
                            }
                        }
                    }
                    break;
                case 2:
                    privateVariables.url = "api/FirmApi/AddNewCase";
                    break;
                case 3:
                    privateVariables.url = "api/FirmApi/AddNewTask";
                    break;
                case 4:
                    privateVariables.url = "api/FirmApi/AddNewEvent";
                    break;
                case 5:
                    var input = $("#txtusername");
                    var fieldname = $(input).attr("placeholder");
                    if ($(input).is(":required") && $(input)[0].validity.valueMissing) {
                        error = true;
                        errorMessage += ">> " + fieldname + "-" + $(input)[0].validationMessage + "\n";
                    } else {
                        var password = $("#txtpassword");
                        var fieldname = $(password).attr("placeholder");
                        if (($(password).is(":required") && $(password)[0].validity.valueMissing)) {
                            error = true;
                            errorMessage += ">> " + fieldname + "-" + $(password)[0].validationMessage + "\n";
                        } else {
                            privateVariables.url = "api/FirmApi/AddClient";
                            d = {
                                Client: {
                                    "UserName": $.trim($("#txtusername").val()),
                                    "Password": $.trim($("#txtpassword").val())
                                }
                            }
                        }
                    }
                    break;
            }
            if (error) {
                alert(errorMessage);
            }
            if (!error && CustomFields.validateFields(privateVariables.configuredcustomfieldsdata, Utility.UserInfo.UserId)) {
                privateVariables.workflowfields = Enumerable.From(privateVariables.configuredcustomfieldsdata).Where(function (o) {
                    return (o.FieldType === 19);
                }).ToArray();
                if (privateVariables.workflowfields.length > 0 && CustomFields.workflow.length > 0) {
                    $("#divwfFields").html('');
                    var field = null;
                    $.each(CustomFields.workflow, function (i, x) {
                        var ismultiple = false;
                        switch (x["assignTo"].toUpperCase()) {
                            case "STM":
                                field = Enumerable.From(privateVariables.configuredcustomfieldsdata).Where(function (o) {
                                    return (o.FieldType === 18 && o.Sub === 'primary');
                                }).ToArray();
                                break;
                            case "ATM":
                                ismultiple = true;
                                field = Enumerable.From(privateVariables.configuredcustomfieldsdata).Where(function (o) {
                                    return (o.FieldType === 18 && o.Sub === 'primary');
                                }).ToArray();
                                break;
                            case "SU":
                                break;
                            case "AU":
                                break;
                        }
                        if (field.length > 0) {
                            privateMethods.AddWorkflowField(x, field[0], ismultiple);
                        }
                    });
                    $('#workflow').modal('show');
                }
                else {
                    //alert("Save with out workflow!!");
                    d.Data = privateVariables.configuredcustomfieldsdata;
                    CustomFields.saveCustomFieldValues(privateVariables.url, d, { "configurationtype": configurationtype }, delegateMethods.saved);
                }
            }
        },
        saved: function (response) {
            if (response.Status) {
                alert("Create Successfully!!");
                location.reload();
            }
        },
        cancel: function () {
            if (confirm("Are you sure you want to cancel?")) {
                location.reload();
            }
        }
    };
    var privateMethods = {
        AddWorkflowField: function (wf, field, ismultiple) {
            var html = '';
            html += '<div class="row">';
            html += '<label class="control-label" style="width:50%;float:left;"> ' + wf.text + "(" + wf.task + ")" + ' <i class="fa fa-star" aria-hidden="true" ></i></label>:';
            html += '<div class="" style="width:50%;float:left;"><select style="width:-webkit-fill-available;" id="' + wf.id + '" ' + (ismultiple ? 'multiple' : '') + '>';
            html += '<option value="0">-Select Any-</option>';
            html += '</select></div>';
            html += '</div>';
            $("#divwfFields").append(html);
            var callback = function (response, aParam) {
                if (response.Status) {
                    var d = JSON.parse(response.Data);
                    var k = '';
                    if ($.isArray(d)) {
                        $.each(d[0], function (key, value) {
                            if (key != "Id") {
                                k = key;
                            }
                        });
                    }
                    $.each(d, function (i, a) {
                        var value = (a[k].split("|")).join(" ");
                        $(aParam).append('<option value="' + a.Id + '">' + value + '</option>');
                    });
                    $(aParam).fastselect();
                }
            };
            Utility.postDataToServer(field.Url, { "DefaultValues": field.DataValue }, {}, "json", callback, null, $("#" + wf.id), false);
        },
        validateWorkflowFields: function () {
            return false;
        },
        initiatePlugins: function () {
            $("#workflow").on('show.bs.modal', delegateMethods.showModal).on('hide.bs.modal', delegateMethods.hideModal);
        },
        attachevents: function () {
            $("#btnSave").unbind().bind("click", delegateMethods.save);
            $("#btnCancel").unbind().bind("click", delegateMethods.cancel);
        },
        load: function () {
            switch (configurationtype) {
                case 1:
                case 5:
                    $("#txtusername,#txtpassword").removeClass("borderless");
                    $("#divUserName").show();
                    break;
                default:
                    $("#divUserName").remove();
                    break;
            }
            CustomFields.getConfiguredCustomField();
        }
    };
    var constructor = {
        AddController: function () {
            privateMethods.load();
            privateMethods.attachevents();
            privateMethods.initiatePlugins();
        }
    };
    constructor.AddController();
}
$(document).ready(function () {
    var main = new AddController();
});