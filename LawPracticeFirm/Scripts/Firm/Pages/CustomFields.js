var CustomFields = {
    delayInitiate: false,
    workflow: [],
    configuredcustomfields: [],
    remove: function () {
        var target = $(this).attr("target");
        var id = parseInt($(target).attr("id").replace("divCField", ''), 10);
        CustomFields.configuredcustomfields = Enumerable.From(CustomFields.configuredcustomfields)
            .Where(function (n) {
                return n["Id"] !== id;
            }).ToArray();
        $(target).remove();
    },
    loadWorkFlowData: function (item, model, fastsearchApi) {
        Utility.postDataToServer("api/FirmApi/WorkFlowDetail", { Id: parseInt(model.value, 10) }, {}, "json", CustomFields.loadWorkFlow, null, null, false);
    },
    loadWorkFlow: function (response) {
        if (response.Status) {
            var x = response.Data;
            x.WorkFlowInfo = JSON.parse(x.WorkFlowInfo);
            CustomFields.getFilteredObjects(x.WorkFlowInfo.objects);
        }
    },
    getFilteredObjects: function (objects) {
        CustomFields.workflow = Enumerable.From(objects).Where(function (o) {
            return (o.assignTo !== undefined && o.assignTo !== null && o.assignTo !== '');
        }).OrderBy(function (x) { return parseInt(x.id); }).ToArray();
    },
    getConfiguredCustomField: function () {
        Utility.postDataToServer("api/FirmApi/ConfiguredCustomFields", {}, { "configurationtype": configurationtype }, "json", CustomFields.loadConfiguredCustomField, null, null, false);
    },
    loadConfiguredCustomField: function (response) {
        if (response.Status) {
            CustomFields.configuredcustomfields = response.Data;
            $.each(response.Data, function (i, a) {
                CustomFields.addCustomField(a, "divCField" + a["Id"]);
            });
        }
    },
    addCustomField: function (field, id, enabledelete, isSortable) {
        field["FieldValues"] = (field["FieldValues"] === null || field["FieldValues"] === "") ? "" : field["FieldValues"].split(',');
        var sub = (field["SubConfigurationType"] === null || field["SubConfigurationType"] === "") ? "" : field["SubConfigurationType"]
        var html = '';
        html += '<div id="' + id + '" class="row ' + (!isSortable ? "ui-state-disabled" : "") + '" ' + (field["Url"] == '' ? '' : 'Url="' + field["Url"] + '"') + ' sub="' + sub + '" fieldtype="' + field["FieldType"] + '" fieldname="' + field["FieldName"] + '" data-val="' + field["IsRequired"] + '" maxlength="' + field["MaxLength"] + '" minlength="' + field["MinLength"] + '">';
        if (enabledelete) {
            html += '<div class="col-md-11 parallel">';
        } else {
            html += '<div class="col-md-12 parallel">';
        }
        html += '<label for="" class="col-md-2 control-label">' + field["FieldName"] + (field["IsRequired"] ? '<i class="fa fa-star" aria-hidden="true"></i>' : '') + '</label>';
        switch (field["FieldType"]) {
            case 1://checkbox list
                html += '<div class="btn-group mr-2" role="group" aria-label="Second group" style="margin-left:1%;" data-val="' + field["IsRequired"] + '">';
                if ($.isArray(field["FieldValues"])) {
                    $.each(field["FieldValues"], function (i, a) {
                        html += '<input type="checkbox" name="' + field["FieldName"] + '" class="radioinput" value="' + a + '">' + a;
                    });
                }
                html += '</div>';
                break;
            case 2://Date
                html += '<input  class="col-md-3 textinput" id="" name="" placeholder="' + field["FieldName"] + '" type="date" value="" ' + (field["Formatter"] !== "" ? '" pattern="' + field["Formatter"] + '"' : '') + (parseInt(field["MaxLength"], 10) > 0 ? '" maxlength="' + field["MaxLength"] + '"' : '') + (parseInt(field["MinLength"], 10) > 0 ? '" minlength="' + field["MinLength"] + '"' : '') + (field["IsRequired"] ? " required" : '') + ' >';
                break;
            case 3://DateTime
                html += '<input  class="col-md-3 textinput" id="" name="" placeholder="' + field["FieldName"] + '" type="datetime-local" value=""  ' + (field["Formatter"] !== "" ? '" pattern="' + field["Formatter"] + '"' : '') + (parseInt(field["MaxLength"], 10) > 0 ? '" maxlength="' + field["MaxLength"] + '"' : '') + (parseInt(field["MinLength"], 10) > 0 ? '" minlength="' + field["MinLength"] + '"' : '') + (field["IsRequired"] ? " required" : '') + ' >';
                break;
            case 4://DropDown
                html += '<select class="col-md-3 textinput multipleSelect" id="" data-val="' + field["IsRequired"] + '">';
                if ($.isArray(field["FieldValues"])) {
                    $.each(field["FieldValues"], function (i, a) {
                        html += '<option value="' + a + '">' + a + '</option>';
                    });
                }
                html += '</select>';
                break;
            case 5://Number
                html += '<input  class="col-md-3 textinput" id="" name="" placeholder="' + field["FieldName"] + '" type="number" value=""  ' + (field["Formatter"] !== "" ? '" pattern="' + field["Formatter"] + '"' : '') + (parseInt(field["MaxLength"], 10) > 0 ? '" maxlength="' + field["MaxLength"] + '"' : '') + (parseInt(field["MinLength"], 10) > 0 ? '" minlength="' + field["MinLength"] + '"' : '') + (field["IsRequired"] ? " required" : '') + ' >';
                break;
            case 6://TextBox
                html += '<input  class="col-md-3 textinput" id="" name="" placeholder="' + field["FieldName"] + '" type="text" value="" ' + (field["Formatter"] !== "" ? '" pattern="' + field["Formatter"] + '"' : '') + (parseInt(field["MaxLength"], 10) > 0 ? '" maxlength="' + field["MaxLength"] + '"' : '') + (parseInt(field["MinLength"], 10) > 0 ? '" minlength="' + field["MinLength"] + '"' : '') + (field["IsRequired"] ? " required" : '') + ' >';
                break;
            case 7://Address
                html += '<div class="" style="width:75%;float:left;margin-left:1%;">';
                html += '<div class="address">';
                html += '<input class="col-md-4 textinput m-r-20" placeholder="Address 1" type="text" value="" ' + (parseInt(field["MaxLength"], 10) > 0 ? '" maxlength="' + field["MaxLength"] + '"' : '') + (parseInt(field["MinLength"], 10) > 0 ? '" minlength="' + field["MinLength"] + '"' : '') + (field["IsRequired"] ? " required" : '') + ' >';
                html += '<input class="col-md-3 textinput m-r-20" placeholder="Address 2" type="text" value="" ' + (parseInt(field["MaxLength"], 10) > 0 ? '" maxlength="' + field["MaxLength"] + '"' : '') + (parseInt(field["MinLength"], 10) > 0 ? '" minlength="' + field["MinLength"] + '"' : '') + (field["IsRequired"] ? " required" : '') + ' >';
                html += '</div>';
                html += '<div class="address">';
                html += '<input class="col-md-4 textinput m-r-20" placeholder="City" type="text" value="" ' + (parseInt(field["MaxLength"], 10) > 0 ? '" maxlength="' + field["MaxLength"] + '"' : '') + (parseInt(field["MinLength"], 10) > 0 ? '" minlength="' + field["MinLength"] + '"' : '') + (field["IsRequired"] ? " required" : '') + ' >';
                html += '<input class="col-md-3 textinput m-r-20" placeholder="State" type="text" value="" ' + (parseInt(field["MaxLength"], 10) > 0 ? '" maxlength="' + field["MaxLength"] + '"' : '') + (parseInt(field["MinLength"], 10) > 0 ? '" minlength="' + field["MinLength"] + '"' : '') + (field["IsRequired"] ? " required" : '') + ' >';
                html += '</div>';
                html += '<div class="address">';
                html += '<input class="col-md-4 textinput m-r-20" placeholder="Country" type="text" value="" ' + (parseInt(field["MaxLength"], 10) > 0 ? '" maxlength="' + field["MaxLength"] + '"' : '') + (parseInt(field["MinLength"], 10) > 0 ? '" minlength="' + field["MinLength"] + '"' : '') + (field["IsRequired"] ? " required" : '') + ' >';
                html += '<input class="col-md-3 textinput m-r-20" placeholder="Zip/Postal Code" type="text" value=""  ' + (field["Formatter"] !== "" ? '" pattern="' + field["Formatter"] + '"' : '') + (field["IsRequired"] ? " required" : '') + ' >';
                html += '</div>';
                html += '</div>';
                break;
            case 8://Mobile
                html += '<input  class="col-md-3 textinput" id="" name="" placeholder="' + field["FieldName"] + '" type="text" value=""   ' + (field["Formatter"] !== "" ? '" pattern="' + field["Formatter"] + '"' : '') + (parseInt(field["MaxLength"], 10) > 0 ? '" maxlength="' + field["MaxLength"] + '"' : '') + (parseInt(field["MinLength"], 10) > 0 ? '" minlength="' + field["MinLength"] + '"' : '') + (field["IsRequired"] ? " required" : '') + ' >';
                break;
            case 9://LandLine Phone
                html += '<input  class="col-md-3 textinput" id="" name="" placeholder="' + field["FieldName"] + '" type="text" value=""   ' + (field["Formatter"] !== "" ? '" pattern="' + field["Formatter"] + '"' : '') + (parseInt(field["MaxLength"], 10) > 0 ? '" maxlength="' + field["MaxLength"] + '"' : '') + (parseInt(field["MinLength"], 10) > 0 ? '" minlength="' + field["MinLength"] + '"' : '') + (field["IsRequired"] ? " required" : '') + ' >';
                break;
            case 10://ZipCode
                html += '<input  class="col-md-3 textinput" id="" name="" placeholder="' + field["FieldName"] + '" type="text" value=""  ' + (field["Formatter"] !== "" ? '" pattern="' + field["Formatter"] + '"' : '') + (parseInt(field["MaxLength"], 10) > 0 ? '" maxlength="' + field["MaxLength"] + '"' : '') + (parseInt(field["MinLength"], 10) > 0 ? '" minlength="' + field["MinLength"] + '"' : '') + (field["IsRequired"] ? " required" : '') + ' >';
                break;
            case 11://Gender
                html += '<div class="btn-group mr-2" role="group" aria-label="Second group" style="margin-left:1%;" data-val="' + field["IsRequired"] + '">';
                if ($.isArray(field["FieldValues"])) {
                    $.each(field["FieldValues"], function (i, a) {
                        html += '<input type="radio" name="' + field["FieldName"] + '" class="radioinput" value="' + a + '">' + a;
                    });
                }
                html += '</div>';
                break;
            case 12://User DropDown
                var callback = function (response) {
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
                        html += '<option value="-1">Select any ' + field["FieldName"] + '</option>';
                        $.each(d, function (i, a) {
                            var value = (a[k].split("|")).join(" ");
                            html += '<option value="' + a.Id + '">' + value + '</option>';
                        });
                    }
                };
                html += '<select class="col-md-3 textinput multipleSelect"  id="" data-val="' + field["IsRequired"] + '"' + (field["IsRequired"] ? " required" : '') + '>';
                Utility.postDataToServer(field["Url"], {}, {}, "json", callback, null, html, false);
                html += '</select>';
                break;
            case 18://Team DropDown
                var callback = function (response) {
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
                            html += '<option value="' + a.Id + '">' + value + '</option>';
                        });
                    }
                };
                html += '<select class="textinput multipleSelect" multiple id="" data-val="' + field["IsRequired"] + '"' + (field["IsRequired"] ? " required" : '') + '>';
                Utility.postDataToServer(field["Url"], {}, {}, "json", callback, null, html, false);
                html += '</select>';
                break;
            case 13://Client DropDown
                var callback = function (response) {
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
                        html += '<option value="-1">Select any ' + field["FieldName"] + '</option>';
                        $.each(d, function (i, a) {
                            var value = (a[k].split("|")).join(" ");
                            html += '<option value="' + a.Id + '">' + value + '</option>';
                        });
                    }
                };
                html += '<select class="col-md-3 textinput multipleSelect" id="" data-val="' + field["IsRequired"] + '"' + (field["IsRequired"] ? " required" : '') + '>';
                Utility.postDataToServer(field["Url"], {}, {}, "json", callback, null, html, false);
                html += '</select>';
                break;
            case 14://EMail
                html += '<input  class="col-md-3 textinput" id="" name="" placeholder="' + field["FieldName"] + '" type="text" value="" ' + (field["Formatter"] !== null ? '" pattern="' + field["Formatter"] + '"' : '') + (parseInt(field["MaxLength"], 10) > 0 ? '" maxlength="' + field["MaxLength"] + '"' : '') + (parseInt(field["MinLength"], 10) > 0 ? '" minlength="' + field["MinLength"] + '"' : '') + (field["IsRequired"] ? " required" : '') + ' >';
                break;
            case 15://Name
                html += '<input  class="col-md-3 textinput" id="txtfirstName" name="" placeholder="First Name" type="text" value="" ' + (field["Formatter"] !== null ? '" pattern="' + field["Formatter"] + '"' : '') + (parseInt(field["MaxLength"], 10) > 0 ? '" maxlength="' + field["MaxLength"] + '"' : '') + (parseInt(field["MinLength"], 10) > 0 ? '" minlength="' + field["MinLength"] + '"' : '') + (field["IsRequired"] ? " required" : '') + ' >';
                html += '<input  class="col-md-2 textinput" id="txtmiddleName" name="" placeholder="Middle Name" type="text" value="" ' + (parseInt(field["MaxLength"], 10) > 0 ? '" maxlength="' + field["MaxLength"] + '"' : '') + ' >';
                html += '<input  class="col-md-3 textinput" id="txtlastName" name="" placeholder="Last Name" type="text" value="" ' + (field["Formatter"] !== null ? '" pattern="' + field["Formatter"] + '"' : '') + (parseInt(field["MaxLength"], 10) > 0 ? '" maxlength="' + field["MaxLength"] + '"' : '') + (parseInt(field["MinLength"], 10) > 0 ? '" minlength="' + field["MinLength"] + '"' : '') + (field["IsRequired"] ? " required" : '') + ' >';
                break;
            case 16://Yes/No
                html += '<div class="btn-group mr-2" role="group" aria-label="Second group" style="margin-left:1%;" data-val="' + field["IsRequired"] + '">';
                if ($.isArray(field["FieldValues"])) {
                    $.each(field["FieldValues"], function (i, a) {
                        html += '<input type="radio" name="' + field["FieldName"] + '" class="radioinput" value="' + a + '">' + a;
                    });
                }
                html += '</div>';
                break;
            case 17://Case DropDown
                var callback = function (response, html) {
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
                        html += '<option value="-1">Select any ' + field["FieldName"] + '</option>';
                        $.each(d, function (i, a) {
                            var value = (a[k].split("|")).join(" ");
                            html += '<option value="' + a.Id + '">' + value + '</option>';
                        });
                    }
                };
                html += '<select class="col-md-3 textinput multipleSelect" id="" data-val="' + field["IsRequired"] + '"' + (field["IsRequired"] ? " required" : '') + '>';
                Utility.postDataToServer(field["Url"], {}, {}, "json", callback, null, html, false);
                html += '</select>';
                break;
            case 19://WorkFlow DropDown
                html += '<input  class="col-md-3 textinput" id="" name="" placeholder="' + field["FieldName"] + '" type="file"' + (field["IsRequired"] ? " required" : '') + ' multiple>';
                break;
        }
        html += '</div>';
        if (enabledelete) {
            html += '<div class="col-md-1 parallel"><i class="close fa fa-times" target="#' + id + '"></i ></div >';
            html += '</div>';
        }
        html += '</div>';
        try {
            $("#divCFields").append(html);
        } catch (e) {
        }
        if (enabledelete) {
            $("#divCFields i.close").unbind().bind("click", CustomFields.remove);
        }
        if (field["FieldType"] === 12 || field["FieldType"] === 13 || field["FieldType"] === 17 || field["FieldType"] === 18) {
            if (!CustomFields.delayInitiate) {
                $(".multipleSelect", $("#divCFields")).fastselect();
            }
        }
        if (field["FieldType"] === 19) {
            $("input[type=file]").fileinput("enable").fileinput("refresh", { showUpload: true })
        }
        if (field["FieldType"] === 4) {
            $(".multipleSelect", $("#divCFields")).fastselect();
        }
    },
    setFieldValue: function (field, fieldtype, data) {
        data = data === null ? "" : data;
        var inputvalues = (data === undefined || data === '') ? '' : (data.indexOf("|") > 0 ? data.split("|") : data);
        switch (fieldtype) {
            case 1://checkbox list
                break;
            case 2://Date
            case 3://DateTime
                var dinput = $(">div>input", $(field));
                $(dinput).val(inputvalues);
                break;
            case 4://Drop Down
                break;
            case 5://Number
            case 6://TextBox
            case 8://Mobile
            case 9://LandLine Phone
            case 10://ZipCode
            case 14://EMail
                var textinput = $(">div>input", $(field));
                $(textinput).val(inputvalues);
                break;
            case 7://Address
                var inputs = $(">div input[type='text']", $(field));
                $.each(inputs, function (i, input) {
                    $(input).val(inputvalues[i]);
                });
                break;
            case 11://Gender
            case 16://Yes/No
                var fieldname = $(field).attr("fieldname");
                $("input[name='" + fieldname + "'][value='" + inputvalues + "']").prop('checked', true);
                break;
            case 15://Name
                var nameinputs = $(">div>input", $(field));
                $.each(nameinputs, function (i, input) {
                    $(input).val(inputvalues[i]);
                });
                break;
            case 12://User DropDown
            case 13://Client DropDown
            case 17://Client DropDown
            case 18://Team DropDown
                var selectinput = $(">div select", $(field));
                var callback = function (response, aParam) {
                    if (response.Status) {
                        var d = JSON.parse(response.Data);
                        var k = [];
                        if ($.isArray(d)) {
                            $.each(d, function (i, v) {
                                $(">option[value='" + v["Id"] + "']", $(aParam)).attr("selected", "selected");
                            });
                            $(aParam).fastselect();//.destroy();
                        }
                    }
                };
                Utility.postDataToServer($(field).attr("Url"), { "DefaultValues": inputvalues }, {}, "json", callback, null, selectinput, false);
                break;
            case 19://workflow DropDown
                var selectinput = $(">div select", $(field));
                var callback = function (response, aParam) {
                    if (response.Status) {
                        var d = JSON.parse(response.Data);
                        var k = [];
                        if ($.isArray(d)) {
                            $.each(d, function (i, v) {
                                $(">option[value='" + v["Id"] + "']", $(aParam)).attr("selected", "selected");
                            });
                            $(aParam).fastselect({
                                onItemSelect: CustomFields.loadWorkFlowData
                            });//.destroy();
                        }
                    }
                };
                Utility.postDataToServer($(field).attr("Url"), { "DefaultValues": inputvalues }, {}, "json", callback, null, selectinput, false);
                break;
        }
    },
    validateFields: function (data, uid) {
        if (!$.isArray(data)) {
            data = [];
        }
        var fields = $(">div", $("#divCFields"));
        var error = false;
        var errorMessage = '**Validatetion Failed**\n';
        $.each(fields, function (i, a) {
            var validate = $(a).attr("data-val") === 'true' ? true : false;
            var fieldtype = parseInt($(a).attr("fieldtype"), 10);
            var fieldname = $(a).attr("fieldname");
            var sub = $(a).attr("sub");
            var url = $(a).attr("Url");
            var customfieldId = parseInt($(a).attr("Id").replace("divCField", ""), 10);
            var dValue = "";
            switch (fieldtype) {
                case 1://checkbox list
                    if (validate && !$("input[name='" + fieldname + "']:checked").val()) {
                        error = true;
                        errorMessage += ">> Alleast one " + fieldname + " selction is required \n";
                    }
                    else {
                        data.push({
                            RefId: uid,
                            FieldType: fieldtype,
                            Sub: sub,
                            Url: url,
                            ConfigurationType: configurationtype,
                            CustomFieldId: customfieldId,
                            DataValue: $("input[name='" + fieldname + "']:checked").val()
                        });
                    }
                    break;
                case 2://Date
                case 3://DateTime
                    var input = $(">div>input", $(a));
                    if (!$(input)[0].validity.valid) {
                        error = true;
                        errorMessage += ">> " + fieldname + "-" + $(input)[0].validationMessage + "\n";
                    }
                    else {
                        data.push({
                            RefId: uid,
                            FieldType: fieldtype,
                            Sub: sub,
                            Url: url,
                            ConfigurationType: configurationtype,
                            CustomFieldId: customfieldId,
                            DataValue: $.trim($(input).val())
                        });
                    }
                    break;
                case 4://Drop Down
                    var selectinput = $(">div select", $(a));
                    if (!$(selectinput)[0].validity.valid) {
                        error = true;
                        errorMessage += ">> " + fieldname + "-" + $(selectinput)[0].validationMessage + " \n";
                    } else {
                        data.push({
                            RefId: uid,
                            FieldType: fieldtype,
                            Sub: sub,
                            Url: url,
                            ConfigurationType: configurationtype,
                            CustomFieldId: customfieldId,
                            DataValue: $.trim($(selectinput).val())
                        });
                    }
                    break;
                case 5://Number
                case 6://TextBox
                case 8://Mobile
                case 9://LandLine Phone
                case 10://ZipCode
                case 14://EMail
                    var textinput = $(">div>input", $(a));
                    if (!$(textinput)[0].validity.valid) {
                        error = true;
                        errorMessage += ">> " + fieldname + "-" + $(textinput)[0].validationMessage + " \n";
                    } else {
                        data.push({
                            RefId: uid,
                            FieldType: fieldtype,
                            Sub: sub,
                            Url: url,
                            ConfigurationType: configurationtype,
                            CustomFieldId: customfieldId,
                            DataValue: $.trim($(textinput).val())
                        });
                    }
                    break;
                case 7://Address
                    var inputs = $(">div input[type='text']", $(a));
                    $.each(inputs, function (i, input) {
                        var value = $.trim($(input).val());
                        var maxlength = $(input).attr("maxlength");
                        var minlength = $(input).attr("minlength");
                        if (!$(input)[0].validity.valid) {
                            error = true;
                            errorMessage += ">> " + fieldname + '-' + $(input).attr("placeholder") + "-" + $(input)[0].validationMessage + " \n";
                        }
                        else {
                            if (dValue === "") {
                                dValue = $.trim(value);
                            }
                            else {
                                dValue = dValue + "|" + $.trim(value);
                            }
                        }
                    });
                    if (!error) {
                        data.push({
                            RefId: uid,
                            FieldType: fieldtype,
                            Sub: sub,
                            Url: url,
                            ConfigurationType: configurationtype,
                            CustomFieldId: customfieldId,
                            DataValue: dValue
                        });
                    }
                    break;
                case 11://Gender
                case 16://Yes/No
                    if (validate && !$("input[name='" + fieldname + "']:checked").val()) {
                        error = true;
                        errorMessage += ">> " + fieldname + " selection is required \n";
                    }
                    else {
                        data.push({
                            RefId: uid,
                            FieldType: fieldtype,
                            Sub: sub,
                            Url: url,
                            ConfigurationType: configurationtype,
                            CustomFieldId: customfieldId,
                            DataValue: $("input[name='" + fieldname + "']:checked").val()
                        });
                    }
                    break;
                case 15://Name
                    var nameinputs = $(">div>input", $(a));
                    $.each(nameinputs, function (i, input) {
                        var value = $.trim($(input).val());
                        var format = $(input).attr("pattern");
                        var maxlength = $(input).attr("maxlength");
                        var minlength = $(input).attr("minlength");
                        if (!$(input)[0].validity.valid) {
                            error = true;
                            errorMessage += ">> " + fieldname + '-' + $(input).attr("placeholder") + "-" + $(input)[0].validationMessage + " \n";
                        }
                        else {
                            if (dValue === "") {
                                dValue = $.trim(value);
                            }
                            else {
                                dValue = dValue + "|" + $.trim(value);
                            }
                        }
                    });
                    if (!error) {
                        data.push({
                            RefId: uid,
                            FieldType: fieldtype,
                            Sub: sub,
                            Url: url,
                            ConfigurationType: configurationtype,
                            CustomFieldId: customfieldId,
                            DataValue: dValue
                        });
                    }
                    break;
                case 12://User DropDown
                case 13://Client DropDown
                case 17://Case DropDown
                    var selectinput = $(">div select", $(a));
                    if (!$(selectinput)[0].validity.valid) {
                        error = true;
                        errorMessage += ">> " + fieldname + "-" + $(selectinput)[0].validationMessage + " \n";
                    } else {
                        if ($.trim($(selectinput).val()) === "-1") {
                            error = true;
                            errorMessage += ">> " + fieldname + "-" + "Please select an Item in the List" + " \n";
                        }
                        else {
                            data.push({
                                RefId: uid,
                                FieldType: fieldtype,
                                Sub: sub,
                                Url: url,
                                ConfigurationType: configurationtype,
                                CustomFieldId: customfieldId,
                                DataValue: $.trim($(selectinput).val())
                            });
                        }
                    }
                    break;
                case 18://Team DropDown
                    var selectinput = $(">div select", $(a));
                    if (!$(selectinput)[0].validity.valid) {
                        error = true;
                        errorMessage += ">> " + fieldname + "-" + $(selectinput)[0].validationMessage + " \n";
                    } else {
                        data.push({
                            RefId: uid,
                            FieldType: fieldtype,
                            Sub: sub,
                            Url: url,
                            ConfigurationType: configurationtype,
                            CustomFieldId: customfieldId,
                            DataValue: $.trim($(selectinput).val())
                        });
                    }
                    break;
                case 19://Workflow DropDown
                    var selectinput = $(">div select", $(a));
                    if (!$(selectinput)[0].validity.valid) {
                        error = true;
                        errorMessage += ">> " + fieldname + "-" + $(selectinput)[0].validationMessage + " \n";
                    } else {
                        data.push({
                            RefId: uid,
                            FieldType: fieldtype,
                            Sub: sub,
                            Url: url,
                            ConfigurationType: configurationtype,
                            CustomFieldId: customfieldId,
                            DataValue: $.trim($(selectinput).val())
                        });
                    }
                    break;
            }
        });
        if (error) {
            alert(errorMessage);
        }
        return !error;
    },
    saveCustomFieldValues: function (url, data, header, callback) {
        Utility.postDataToServer(url, data, header, "json", callback, null, null, false);
    }
};