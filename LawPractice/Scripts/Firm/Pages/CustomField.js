function CustomField() {
    var privateVariables = {
        configuredcustomfields: [],
        customfields: []
    };
    var delegateMethods = {
        showModal: function () {
            $("#txtcustomFieldName").val('');
            $("#txtcustomFieldvalue").val('');
            $("#ddlcustomFieldtype").val("0");
            $("#divOptions").val('').hide();
            $("#divFieldLength").val('').hide();
            $("#txtcustomFieldNameminlength").val('0');
            $("#txtcustomFieldNamemaxlength").val('0');
            $('#chkRequired').bootstrapToggle('on');
        },
        hideModal: function () {
            if (document.activeElement.id !== "btnClose") {
                var option = $("#ddlcustomFieldtype>option:selected");
                var title = $.trim($("#txtcustomFieldName").val());
                var type = parseInt($.trim($("#ddlcustomFieldtype").val()), 10);
                var value = $.trim($("#txtcustomFieldvalue").val());
                var required = $.trim($("#chkRequired").is(":checked"));

                if (title === "") {
                    alert("Custom Field Name is required!");
                    return false;
                }
                if ((type === 1 || type === 4) && value === '') {
                    alert("Custom Field value is required!");
                    return false;
                }
                if (value === '' && $(option).attr("defaultvalues")!==null) {
                    value = $(option).attr("defaultvalues");
                }
                var length = 1;
                if (privateVariables.configuredcustomfields.length > 0) {
                    length = Enumerable.From(privateVariables.configuredcustomfields).Max(function (a) { return a.Id + 1; });
                }
                
                var field = {
                    Id: length,
                    Sequence:-1,
                    ConfigurationType: configurationtype,
                    FieldName: title,
                    FieldType: type,
                    FieldValue: value.split(','),
                    IsRequired: required === 'true',
                    MinLength: type === 5 || type === 6 ? parseInt($("#txtcustomFieldNameminlength").val(),10):0,
                    MaxLength: type === 5 || type === 6 ? parseInt($("#txtcustomFieldNamemaxlength").val(), 10) : 0,
                    Format: $(option).attr("formatter")
                };
                
                privateVariables.configuredcustomfields.push(field);
                //privateMethods.addCustomField(field,"divCField"+length);
                CustomFields.addCustomField(field, "divCField" + length);
            }
        },
        remove: function () {
            var target = $(this).attr("target");
            var id = parseInt($(target).attr("id").replace("divCField", ''), 10);
            privateVariables.configuredcustomfields = Enumerable.From(privateVariables.configuredcustomfields)
                .Where(function (n) {
                    return n["Id"] !== id;
                }).ToArray();
            $(target).remove();
        },
        saveConfiguration: function () {
            if (privateMethods.validateConfiguration()) {
                $.each($(">div", $("#divCFields")), function (i, a) {
                    var id = parseInt($(a).attr("id").replace("divCField", ''), 10);
                    var obj = Enumerable.From(privateVariables.configuredcustomfields)
                        .Where(function (n) {
                            return n["Id"] === id;
                        }).ToArray();
                    if (obj.length>0) {
                        obj[0]["Sequence"] = i + 1;
                        obj[0]["FieldValue"] = $.isArray(obj[0]["FieldValue"])?obj[0]["FieldValue"].join(','):"";
                    }
                });
                privateVariables.configuredcustomfields = Enumerable.From(privateVariables.configuredcustomfields)
                    .OrderBy(function (a) {
                        return a.Sequence;
                    }).ToArray();

                //var api = '';
                //switch (configurationtype) {
                //    case 1:
                //        api = "api/FirmApi/SaveFirmUserCustomFields";
                //        break;
                //    case 2:
                //        api = "api/FirmApi/SaveFirmCaseCustomFields";
                //        break;
                //    case 3:
                //        api = "api/FirmApi/SaveFirmTaskCustomFields";
                //        break;
                //    case 4:
                //        api = "api/FirmApi/SaveFirmEventCustomFields";
                //        break;
                //    case 5:
                //        api = "api/FirmApi/SaveFirmClientCustomFields";
                //        break;
                //}
                Utility.postDataToServer("api/FirmApi/SaveFirmCustomFields", { "CustomFieldList": privateVariables.configuredcustomfields }, { "configurationtype": configurationtype }, "json", privateMethods.saveCustomField, null, null, true);
            }
        }
    };
    var privateMethods = {
        saveCustomField: function (response) {
            if (response.Status) {
                alert("Publish Successfully!!");
            }
            else {
                alert(response.Message);
            }
        },
        getCustomField: function () {
            Utility.postDataToServer("api/FirmApi/CustomFields", {}, {}, "json", privateMethods.loadCustomField, null, null, false);
        },
        loadCustomField: function (response) {
            if (response.Status) {
                privateVariables.customfields = response.Data;
                $.each(response.Data, function (i, a) {
                    var option = '<option value="' + a["Id"] + '" formatter="' + a["Formatter"] + '" defaultvalues="' + a["DefaultValues"]+'">'+a["Text"]+'</option>';
                    $("#ddlcustomFieldtype").append(option);
                });
            }
            else {
                $("#divcustomField").remove();
            }
        },
        getConfiguredCustomField: function () {
            Utility.postDataToServer("api/FirmApi/ConfiguredCustomFields", {}, { "configurationtype": configurationtype }, "json", privateMethods.loadConfiguredCustomField, null, null, false);
        },
        loadConfiguredCustomField: function (response) {
            if (response.Status) {
                privateVariables.configuredcustomfields = response.Data;
                $.each(response.Data, function (i, a) {
                   var obj= Enumerable.From(privateVariables.customfields)
                        .Where(function (n) {
                            return n["Id"] === a["FieldType"];
                        }).ToArray();
                    if (obj.length > 0) {
                        privateMethods.addCustomField(a, "divCField" + a["Id"]);
                    }
                });
            }
        },
        validateConfiguration: function() {
            var result = true;
            var newFields = $.grep(privateVariables.configuredcustomfields, function (n, i) {
                return n["Sequence"] === -1;
            });
            if (newFields.length===0) {
                result = false;
            }
            return result;
        },
        addCustomField: function (field, id) {
            var html = '';
            html += '<div id="' + id+'" class="row" fieldtype="' + field["FieldType"] + '" fieldname="' + field["FieldName"] + '" data-val="' + field["IsRequired"] + '" maxlength="' + field["MaxLength"] + '" minlength="' + field["MinLength"] +'">';
                    html += '<div class="col-md-11 parallel">';
            html += '<label for="" class="col-md-2 control-label">' + field["FieldName"] + (field["IsRequired"] ?'<i class="fa fa-star" aria-hidden="true"></i>':'')+ '</label>:';
                        switch (field["FieldType"]) {
                            case 7:
                                html += '<div class="col-md-10">';
                                    html += '<div class="address">';
                                html += '<input class="col-md-4 textinput m-r-20" placeholder="Address 1" type="text" value="" maxlength="50">';
                                html += '<input class="col-md-4 textinput m-r-20" placeholder="Address 2" type="text" value="" maxlength="50">';
                                    html += '</div>';
                                    html += '<div class="address">';
                                html += '<input class="col-md-4 textinput m-r-20" placeholder="City" type="text" value="" maxlength="50">';
                                html += '<input class="col-md-4 textinput m-r-20" placeholder="State" type="text" value="" maxlength="50">';
                                    html += '</div>';
                                    html += '<div class="address">';
                                html += '<input class="col-md-4 textinput m-r-20" placeholder="Country" type="text" value="" maxlength="50">';
                                        html += '<input class="col-md-4 textinput m-r-20" placeholder="Zip/Postal Code" type="text" value="" format="' + field["Format"] + '" data-val="' + field["IsRequired"] + '">';
                                    html += '</div>';
                                html += '</div>';
                                break;
                            case 1://checkbox list
                                html += '<div class="btn-group mr-2" role="group" aria-label="Second group" style="margin-left:1%;" data-val="' + field["IsRequired"] + '">';
                                $.each(field["FieldValue"], function (i, a) {
                                    html += '<input type="checkbox" name="' + a + '" class="radioinput">' + a;
                                });
                                html += '</div>';
                                break;
                            case 2://Date
                                html += '<input  class="col-md-3 textinput" id="" name="" placeholder="' + field["FieldName"] + '" type="date" value="" data-val="' + field["IsRequired"] + '">';
                                break;
                            case 3://DateTime
                                html += '<input  class="col-md-3 textinput" id="" name="" placeholder="' + field["FieldName"] + '" type="datetime" value="" data-val="' + field["IsRequired"] + '">';
                                break;
                            case 4://DropDown
                                html += '<select class="col-md-3 textinput" id="" data-val="' + field["IsRequired"] + '">';
                                $.each(field["FieldValue"], function (i, a) {
                                    html += '<option value="' + a + '">' + a + '</option>';
                                });
                                html += '</select>';
                                break;
                            case 5://Number
                                html += '<input  class="col-md-3 textinput" id="" name="" placeholder="' + field["FieldName"] + '" type="number" value="" pattern="[0-9]+" data-val="' + field["IsRequired"] + '" maxlength="' + field["MaxLength"] + '" minlength="' + field["MinLength"] +'">';
                                break;
                            case 6://TextBox
                                html += '<input  class="col-md-3 textinput" id="" name="" placeholder="' + field["FieldName"] + '" type="text" value="" data-val="' + field["IsRequired"] + '" maxlength="' + field["MaxLength"] + '" minlength="' + field["MinLength"] +'">';
                                break;
                            case 8://Mobile
                                html += '<input  class="col-md-3 textinput" id="" name="" placeholder="' + field["FieldName"] + '" type="number" value=""  format="' + field["Format"] + '"  data-val="' + field["IsRequired"] + '" maxlength="' + field["MaxLength"] + '" minlength="' + field["MinLength"] +'">';
                                break;
                            case 9://LandLine Phone
                                html += '<input  class="col-md-3 textinput" id="" name="" placeholder="' + field["FieldName"] + '" type="number" value=""  format="' + field["Format"] + '"  data-val="' + field["IsRequired"] + '" maxlength="' + field["MaxLength"] + '" minlength="' + field["MinLength"] +'">';
                                break;
                            case 10://ZipCode
                                html += '<input  class="col-md-3 textinput" id="" name="" placeholder="' + field["FieldName"] + '" type="number" value="" format="' + field["Format"] + '"  data-val="' + field["IsRequired"] + '" maxlength="' + field["MaxLength"] + '" minlength="' + field["MinLength"] + '">';
                                break;
                            case 11://Gender
                                html += '<div class="btn-group mr-2" role="group" aria-label="Second group" style="margin-left:1%;" data-val="' + field["IsRequired"] + '">';
                                $.each(field["FieldValue"], function (i, a) {
                                    html += '<input type="radio" name="Gender" class="radioinput">' + a;
                                });
                                html += '</div>';
                                break;
                            case 12://User DropDown
                                html += '<select class="col-md-3 textinput multipleSelect" multiple id="" data-val="' + field["IsRequired"] + '">';
                                $.each(field["FieldValue"], function (i, a) {
                                    html += '<option value="' + a + '">' + a + '</option>';
                                });
                                html += '</select>';
                                break;
                            case 13://Multiple Client DropDown
                                html += '<select class="col-md-3 textinput multipleSelect"  id="" data-val="' + field["IsRequired"] + '">';
                                $.each(field["FieldValue"], function (i, a) {
                                    html += '<option value="' + a + '">' + a + '</option>';
                                });
                                html += '</select>';
                                break;
                            case 14://EMail
                                html += '<input  class="col-md-3 textinput" id="" name="" placeholder="' + field["FieldName"] + '" type="text" value="" pattern="' + field["Format"] + '"  data-val="' + field["IsRequired"] + '">';
                                break;
                            case 15://Name
                                html += '<input autofocus="" class="col-md-3 textinput" id="txtfirstName" name="" placeholder="First Name" type="text" value="">';
                                html += '<input autofocus="" class="col-md-2 textinput" id="txtmiddleName" name="" placeholder="Middle Name" type="text" value="">';
                                html += '<input autofocus="" class="col-md-3 textinput" id="txtlastName" name="" placeholder="Last Name" type="text" value="">';
                                break;
                        }
                html += '</div>';
                html += '<div class="col-md-1 parallel"><i class="close fa fa-times" target="#'+id+'"></i ></div >';
                html += '</div>';
            $("#divCFields").append(html);
            $("#divCFields i.close").unbind().bind("click", delegateMethods.remove);
            if (field["FieldType"] === 12 || field["FieldType"] === 13 || field["FieldType"]===14) {
                $(".multipleSelect", $("#divCFields")).fastselect();
            }
        },
        initiatePlugins: function () {
            $('#chkRequired').bootstrapToggle({
                on: 'Yes',
                off: 'No'
            }).bootstrapToggle('on');

            $("#customfield").on('show.bs.modal', delegateMethods.showModal).on('hide.bs.modal', delegateMethods.hideModal);

            $("#divCFields").sortable({ placeholder: "ui-state-highlight" });
        },
        attachevents: function () {
            $("#ddlcustomFieldtype").unbind().bind("change", function () {
                var val = parseInt($(this).val(),10);
                if (val===1 || val===4) {
                    $("#divOptions").val('').show();
                }
                else {
                    $("#divOptions").val('').hide();
                }

                if (val === 5 || val === 6) {
                    $("#divFieldLength").val('').show();
                }
                else {
                    $("#divFieldLength").val('').hide();
                }
            });
            $("#btnSave").unbind().bind("click", delegateMethods.saveConfiguration);
        },
        load: function () {
            privateMethods.getCustomField();
            privateMethods.getConfiguredCustomField();
        }
    };
    var constructor = {
        CustomField: function () {
            privateMethods.load();
            privateMethods.attachevents();
            privateMethods.initiatePlugins();
        }
    };
    constructor.CustomField();

}

$(document).ready(function () {
    var main = new CustomField();
});