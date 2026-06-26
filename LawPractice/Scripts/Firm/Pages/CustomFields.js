var CustomFields = {
    configuredcustomfields:[],
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
    addCustomField: function (field, id) {
        field["FieldValues"] = field["FieldValues"] === null ? "" : field["FieldValues"].split(',');
        var html = '';
        html += '<div id="' + id + '" class="row" fieldtype="' + field["FieldType"] + '" fieldname="' + field["FieldName"] + '" data-val="' + field["IsRequired"] + '" maxlength="' + field["MaxLength"] + '" minlength="' + field["MinLength"] + '">';
        html += '<div class="col-md-12 parallel">';
        html += '<label for="" class="col-md-2 control-label">' + field["FieldName"] + (field["IsRequired"] ? '<i class="fa fa-star" aria-hidden="true"></i>' : '') + '</label>:';
        switch (field["FieldType"]) {
            case 1://checkbox list
                html += '<div class="btn-group mr-2" role="group" aria-label="Second group" style="margin-left:1%;" data-val="' + field["IsRequired"] + '">';
                if ($.isArray(field["FieldValues"])) {
                    $.each(field["FieldValues"], function (i, a) {
                        html += '<input type="checkbox" name="' + field["FieldName"] + '" class="radioinput">' + a;
                    });
                }
                html += '</div>';
                break;
            case 2://Date
                html += '<input  class="col-md-3 textinput" id="" name="" placeholder="' + field["FieldName"] + '" type="date" value="" ' + (field["Formatter"] !== null ? '" pattern="' + field["Formatter"] + '"' : '') + (parseInt(field["MaxLength"], 10) > 0 ? '" maxlength="' + field["MaxLength"] + '"' : '') + (parseInt(field["MinLength"], 10) > 0 ? '" minlength="' + field["MinLength"] + '"' : '') + (field["IsRequired"] ? " required" : '') + ' >';
                break;
            case 3://DateTime
                html += '<input  class="col-md-3 textinput" id="" name="" placeholder="' + field["FieldName"] + '" type="datetime-local" value=""  ' + (field["Formatter"] !== null ? '" pattern="' + field["Formatter"] + '"' : '') + (parseInt(field["MaxLength"], 10) > 0 ? '" maxlength="' + field["MaxLength"] + '"' : '') + (parseInt(field["MinLength"], 10) > 0 ? '" minlength="' + field["MinLength"] + '"' : '') + (field["IsRequired"] ? " required" : '') + ' >';
                break;
            case 4://DropDown
                html += '<select class="col-md-3 textinput" id="" data-val="' + field["IsRequired"] + '">';
                if ($.isArray(field["FieldValues"])) {
                    $.each(field["FieldValues"], function (i, a) {
                        html += '<option value="' + a + '">' + a + '</option>';
                    });
                }
                html += '</select>';
                break;
            case 5://Number
                html += '<input  class="col-md-3 textinput" id="" name="" placeholder="' + field["FieldName"] + '" type="number" value=""  ' + (field["Formatter"] !== null ? '" pattern="' + field["Formatter"] + '"' : '') + (parseInt(field["MaxLength"], 10) > 0 ? '" maxlength="' + field["MaxLength"] + '"' : '') + (parseInt(field["MinLength"], 10) > 0 ? '" minlength="' + field["MinLength"] + '"' : '') + (field["IsRequired"] ? " required" : '') + ' >';
                break;
            case 6://TextBox
                html += '<input  class="col-md-3 textinput" id="" name="" placeholder="' + field["FieldName"] + '" type="text" value="" ' + (field["Formatter"] !== null ? '" pattern="' + field["Formatter"] + '"' : '') + (parseInt(field["MaxLength"], 10) > 0 ? '" maxlength="' + field["MaxLength"] + '"' : '') + (parseInt(field["MinLength"], 10) > 0 ? '" minlength="' + field["MinLength"] + '"' : '') + (field["IsRequired"] ? " required" : '') + ' >';
                break;
            case 7://Address
                html += '<div class="col-md-10">';
                html += '<div class="address">';
                html += '<input class="col-md-4 textinput m-r-20" placeholder="Address 1" type="text" value="" ' + (parseInt(field["MaxLength"], 10) > 0 ? '" maxlength="' + field["MaxLength"] + '"' : '') + (parseInt(field["MinLength"], 10) > 0 ? '" minlength="' + field["MinLength"] + '"' : '') + (field["IsRequired"] ? " required" : '') + ' >';
                html += '<input class="col-md-4 textinput m-r-20" placeholder="Address 2" type="text" value="" ' + (parseInt(field["MaxLength"], 10) > 0 ? '" maxlength="' + field["MaxLength"] + '"' : '') + (parseInt(field["MinLength"], 10) > 0 ? '" minlength="' + field["MinLength"] + '"' : '') + (field["IsRequired"] ? " required" : '') + ' >';
                html += '</div>';
                html += '<div class="address">';
                html += '<input class="col-md-4 textinput m-r-20" placeholder="City" type="text" value="" ' + (parseInt(field["MaxLength"], 10) > 0 ? '" maxlength="' + field["MaxLength"] + '"' : '') + (parseInt(field["MinLength"], 10) > 0 ? '" minlength="' + field["MinLength"] + '"' : '') + (field["IsRequired"] ? " required" : '') + ' >';
                html += '<input class="col-md-4 textinput m-r-20" placeholder="State" type="text" value="" ' + (parseInt(field["MaxLength"], 10) > 0 ? '" maxlength="' + field["MaxLength"] + '"' : '') + (parseInt(field["MinLength"], 10) > 0 ? '" minlength="' + field["MinLength"] + '"' : '') + (field["IsRequired"] ? " required" : '') + ' >';
                html += '</div>';
                html += '<div class="address">';
                html += '<input class="col-md-4 textinput m-r-20" placeholder="Country" type="text" value="" ' + (parseInt(field["MaxLength"], 10) > 0 ? '" maxlength="' + field["MaxLength"] + '"' : '') + (parseInt(field["MinLength"], 10) > 0 ? '" minlength="' + field["MinLength"] + '"' : '') + (field["IsRequired"] ? " required" : '') + ' >';
                html += '<input class="col-md-4 textinput m-r-20" placeholder="Zip/Postal Code" type="text" value=""  ' + (field["Formatter"] !== null ? '" pattern="' + field["Formatter"] + '"' : '')+ (field["IsRequired"] ? " required" : '') + ' >';
                html += '</div>';
                html += '</div>';
                break;
            case 8://Mobile
                html += '<input  class="col-md-3 textinput" id="" name="" placeholder="' + field["FieldName"] + '" type="text" value=""   ' + (field["Formatter"] !== null ? '" pattern="' + field["Formatter"] + '"' : '') + (parseInt(field["MaxLength"], 10) > 0 ? '" maxlength="' + field["MaxLength"] + '"' : '') + (parseInt(field["MinLength"], 10) > 0 ? '" minlength="' + field["MinLength"] + '"' : '') + (field["IsRequired"] ? " required" : '') + ' >';
                break;
            case 9://LandLine Phone
                html += '<input  class="col-md-3 textinput" id="" name="" placeholder="' + field["FieldName"] + '" type="text" value=""   ' + (field["Formatter"] !== null ? '" pattern="' + field["Formatter"] + '"' : '') + (parseInt(field["MaxLength"], 10) > 0 ? '" maxlength="' + field["MaxLength"] + '"' : '') + (parseInt(field["MinLength"], 10) > 0 ? '" minlength="' + field["MinLength"] + '"' : '') + (field["IsRequired"] ? " required" : '') + ' >';
                break;
            case 10://ZipCode
                html += '<input  class="col-md-3 textinput" id="" name="" placeholder="' + field["FieldName"] + '" type="text" value=""  ' + (field["Formatter"] !== null ? '" pattern="' + field["Formatter"] + '"' : '') + (parseInt(field["MaxLength"], 10) > 0 ? '" maxlength="' + field["MaxLength"] + '"' : '') + (parseInt(field["MinLength"], 10) > 0 ? '" minlength="' + field["MinLength"] + '"' : '') + (field["IsRequired"] ? " required" : '') + ' >';
                break;
            case 11://Gender
                html += '<div class="btn-group mr-2" role="group" aria-label="Second group" style="margin-left:1%;" data-val="' + field["IsRequired"] + '">';
                if ($.isArray(field["FieldValues"])) {
                    $.each(field["FieldValues"], function (i, a) {
                        html += '<input type="radio" name="Gender" class="radioinput">' + a;
                    });
                }
                html += '</div>';
                break;
            case 12://User DropDown
                html += '<select class="col-md-3 textinput multipleSelect" multiple id="" data-val="' + field["IsRequired"] + '">';
                if ($.isArray(field["FieldValues"])) {
                    $.each(field["FieldValues"], function (i, a) {
                        html += '<option value="' + a + '">' + a + '</option>';
                    });
                }
                html += '</select>';
                break;
            case 13://Client DropDown
                html += '<select class="col-md-3 textinput multipleSelect" id="" data-val="' + field["IsRequired"] + '">';
                if ($.isArray(field["FieldValues"])) {
                    $.each(field["FieldValues"], function (i, a) {
                        html += '<option value="' + a + '">' + a + '</option>';
                    });
                }
                html += '</select>';
                break;
            case 14://EMail
                html += '<input  class="col-md-3 textinput" id="" name="" placeholder="' + field["FieldName"] + '" type="text" value=""  pattern="' + (field["Formatter"] === null ? '' : field["Formatter"]) + '"' + (parseInt(field["MaxLength"], 10) > 0 ? '" maxlength="' + field["MaxLength"] + '"' : '') + (parseInt(field["MinLength"], 10) > 0 ? '" minlength="' + field["MinLength"] + '"' : '') + (field["IsRequired"] ? " required" : '') + ' >';
                break;
            case 15://Name
                html += '<input  class="col-md-3 textinput" id="txtfirstName" name="" placeholder="First Name" type="text" value="" pattern="' + (field["Formatter"] === null ? '' : field["Formatter"]) + '"' + (parseInt(field["MaxLength"], 10) > 0 ? '" maxlength="' + field["MaxLength"] + '"' : '') + (parseInt(field["MinLength"], 10) > 0 ? '" minlength="' + field["MinLength"] + '"' : '') + (field["IsRequired"] ? " required" : '') + ' >';
                html += '<input  class="col-md-2 textinput" id="txtmiddleName" name="" placeholder="Middle Name" type="text" value=""  pattern="' + (field["Formatter"] === null ? '' : field["Formatter"]) + '"' + (parseInt(field["MaxLength"], 10) > 0 ? '" maxlength="' + field["MaxLength"] + '"' : '') + ' >';
                html += '<input  class="col-md-3 textinput" id="txtlastName" name="" placeholder="Last Name" type="text" value=""  pattern="' + (field["Formatter"] === null ? '' : field["Formatter"]) + '"' + (parseInt(field["MaxLength"], 10) > 0 ? '" maxlength="' + field["MaxLength"] + '"' : '') + (parseInt(field["MinLength"], 10) > 0 ? '" minlength="' + field["MinLength"] + '"' : '') + (field["IsRequired"] ? " required" : '') + ' >';
                break;
            case 16://Yes/No
                html += '<div class="btn-group mr-2" role="group" aria-label="Second group" style="margin-left:1%;" data-val="' + field["IsRequired"] + '">';
                if ($.isArray(field["FieldValues"])) {
                    $.each(field["FieldValues"], function (i, a) {
                        html += '<input type="radio" name="' + field["FieldName"] + '" class="radioinput">' + a;
                    });
                }

                html += '</div>';
                break;
            case 17://Case DropDown
                html += '<select class="col-md-3 textinput multipleSelect" id="" data-val="' + field["IsRequired"] + '">';
                if ($.isArray(field["FieldValues"])) {
                    $.each(field["FieldValues"], function (i, a) {
                        html += '<option value="' + a + '">' + a + '</option>';
                    });
                }
                html += '</select>';
                break;
        }
        html += '</div>';        
        html += '</div>';
        try {
            $("#divCFields").append(html);
        } catch (e) {
            console.log(e.message);
        }
        if (field["FieldType"] === 12 || field["FieldType"] === 13 || field["FieldType"] === 14) {
            $(".multipleSelect", $("#divCFields")).fastselect();
        }
    },
    setFieldValue: function (field, fieldtype, data) {
        data = data === null ? "" : data;
        var inputvalues = data.split("|");
        switch (fieldtype) {
            case 1://checkbox list
                break;
            case 2://Date
            case 3://DateTime
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
                $(textinput).val(inputvalues[0]);
                break;
            case 7://Address
                var inputs = $(">div input[type='text']", $(field));

                $.each(inputs, function (i, input) {
                    $(input).val(inputvalues[i]);
                });

                break;
            case 11://Gender
            case 16://Yes/No
                break;
            case 12://User DropDown
                break;
            case 13://Client DropDown
                break;
            case 15://Name
                var nameinputs = $(">div>input", $(field));
                
                $.each(nameinputs, function (i, input) {
                    $(input).val(inputvalues[i]);
                });

                break;
            case 17://Client DropDown
                break;
        }
    },
    validateFields: function (data,uid) {
        if (!$.isArray(data)) {
            data = [];
        }
        var fields = $(">div", $("#divCFields"));
        var error = false;
        var errorMessage = '**Validatetion Failed**\n';
        $.each(fields, function (i, a) {
            var validate = $(a).attr("data-val")==='true'?true:false;
            var fieldtype = parseInt($(a).attr("fieldtype"),10);
            var fieldname = $(a).attr("fieldname");
            var customfieldId = parseInt($(a).attr("Id").replace("divCField", ""), 10);
            var dValue = "";
            switch (fieldtype) {
                case 1://checkbox list
                    if (validate && !$("input[name='" + fieldname + "']:checked").val()) {
                        error = true;
                        errorMessage += ">> Alleast one " + fieldname + " selction is required \n";
                    }
                    else {
                        //add in Saving List
                        data.push({
                            RefId: uid,                            
                            ConfigurationType:configurationtype,
                            CustomFieldId: customfieldId,
                            DataValue: $("input[name='" + fieldname + "']:checked").val()
                        });
                    }

                    break;
                case 2://Date
                case 3://DateTime
                    var input = $(">div>input", $(a));
                    var value = $.trim($(input).val());
                    var format = $(input).attr("pattern");
                    var maxlength = $(input).attr("maxlength");
                    var minlength = $(input).attr("minlength");
                    if ($(input).is(":required") && $(input)[0].validity.badInput) {
                        error = true;
                        errorMessage += ">> " + fieldname + "-" + $(input)[0].validationMessage + "\n";
                    }
                    else {
                        data.push({
                            RefId: uid,
                            ConfigurationType: configurationtype,
                            CustomFieldId: customfieldId,
                            DataValue: $(input).val()
                        });
                    }
                    break;
                case 4://Drop Down
                    break;
                case 5://Number
                case 6://TextBox
                case 8://Mobile
                case 9://LandLine Phone
                case 10://ZipCode
                case 14://EMail
                    var textinput = $(">div>input", $(a));
                    if ($(textinput).is(":required") && $(textinput)[0].validity.valueMissing) {
                        error = true;
                        errorMessage += ">> " + fieldname + "-" + $(textinput)[0].validationMessage + " \n";
                    }
                    if ($(textinput)[0].validity.patternMismatch || $(textinput)[0].validity.tooLong || $(textinput)[0].validity.tooShort) {
                        error = true;
                        errorMessage += ">> " + fieldname + "-" + $(textinput)[0].validationMessage + "\n";
                    }
                    else {
                        //add in Saving List
                        data.push({
                            RefId: uid,
                            ConfigurationType: configurationtype,
                            CustomFieldId: customfieldId,
                            DataValue: $(textinput).val()
                        });
                    }
                    break;
                case 7://Address
                    var inputs = $(">div input[type='text']", $(a));
                    
                    $.each(inputs, function (i, input) {
                        var value = $.trim($(input).val());
                        var maxlength = $(input).attr("maxlength");
                        var minlength = $(input).attr("minlength");

                        if ($(input).is(":required") && $(input)[0].validity.valueMissing) {
                            error = true;
                            errorMessage += ">> " + $(input).attr("placeholder") + "-" + $(input)[0].validationMessage + " \n";
                        }
                        else {
                            if ($(input)[0].validity.patternMismatch || $(input)[0].validity.tooLong || $(input)[0].validity.tooShort) {
                                error = true;
                                errorMessage += ">> " + $(input).attr("placeholder") + "-" + $(input)[0].validationMessage + "\n";
                            }
                            else {
                                if (dValue === "") {
                                    dValue = value;
                                }
                                else {
                                    dValue = dValue + "|" + value;
                                }
                                
                            }
                        }
                    });
                    if (!error) {
                        //add in Saving List

                        data.push({
                            RefId: uid,
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
                        //add in Saving List
                        data.push({
                            RefId: uid,
                            ConfigurationType: configurationtype,
                            CustomFieldId: customfieldId,
                            DataValue: $("input[name='" + fieldname + "']:checked").val()
                        });
                    }
                    break;
                case 12://User DropDown
                    break;
                case 13://Client DropDown
                    break;
                case 15://Name
                    var nameinputs = $(">div>input", $(a));
                    $.each(nameinputs, function (i, input) {
                        var value = $.trim($(input).val());
                        var format = $(input).attr("pattern");
                        var maxlength = $(input).attr("maxlength");
                        var minlength = $(input).attr("minlength");

                        if ($(input).is(":required") && $(input)[0].validity.valueMissing) {
                            error = true;
                            errorMessage += ">> " + $(input).attr("placeholder") + "-" + $(input)[0].validationMessage + " \n";
                        }
                        else {
                            if ($(input)[0].validity.patternMismatch || $(input)[0].validity.tooLong || $(input)[0].validity.tooShort) {
                                error = true;
                                errorMessage += ">> " + $(input).attr("placeholder") + "-" + $(input)[0].validationMessage + "\n";
                            }
                            else {
                                if (dValue === "") {
                                    dValue = value;
                                }
                                else {
                                    dValue = dValue + "|" + value;
                                }
                            }
                        }
                    });
                    if (!error) {
                        //add in Saving List
                        data.push({
                            RefId: uid,
                            ConfigurationType: configurationtype,
                            CustomFieldId: customfieldId,
                            DataValue: dValue
                        });
                    }
                    break;
                case 17://Client DropDown
                    break;
            }
        });
        if (error) {
            alert(errorMessage);
        }
        return !error;
    },
    saveCustomFieldValues: function (url,data,header,callback) {
        Utility.postDataToServer(url, data, header, "json", callback, null, null, false);
    }
};