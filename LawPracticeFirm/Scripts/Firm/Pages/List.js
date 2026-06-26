function ListController() {
    var privateVariables = {
        configuredcustomfields: [],
        ufields:[],
        listUrl:""
    };
    var delegateMethods = {
        save: function () {
            if (CustomFields.validateFields()) {
                alert("Save Successfully!!");
            }
        }
    };

    var privateMethods = {
        getConfiguredDefaultField: function () {
            Utility.postDataToServer("api/FirmApi/ConfiguredCustomFields", {}, { "configurationtype": configurationtype }, "json", privateMethods.loadConfiguredCustomField, null, null, false);
        },
        loadConfiguredCustomField: function (response) {
            if (response.Status) {
                var fields = [];
                privateVariables.configuredcustomfields = Enumerable.From(response.Data)
                    .Where(function (n) {
                        return (n["IsDefault"] === true);
                    }).ToArray();
                $.each(privateVariables.configuredcustomfields, function (i, a) {
                    fields.push({ "Id": a["Id"], "FieldType": a["FieldType"] });
                    $(">thead>tr", $("#grvList")).append('<th id="' + a["Id"] + '">' + a["FieldName"] + '</th>');
                });
                switch (configurationtype) {
                    case 1:
                        $(">thead>tr", $("#grvList")).append('<th></th>');
                        $(">thead>tr", $("#grvList")).append('<th></th>');
                        break;
                    case 2:
                        $(">thead>tr", $("#grvList")).append('<th></th>');
                        break;
                    case 3:
                        $(">thead>tr", $("#grvList")).append('<th></th>');
                        break;
                    case 4:
                        $(">thead>tr", $("#grvList")).append('<th></th>');
                        break;
                    case 5:
                        $(">thead>tr", $("#grvList")).append('<th></th>');
                        $(">thead>tr", $("#grvList")).append('<th></th>');
                        break;
                }
                privateMethods.getlist(fields);
                privateMethods.getuFieldValue();
            }
        },
        getlist: function (additinalData) {
            Utility.postDataToServer(privateVariables.listUrl, { Id: Uid}, {}, "json", privateMethods.loadList, null, additinalData, false);
        },
        loadList: function (response, additinalData) {
            if (response.Status) {
                if (configurationtype == 6) {
                    additinalData = null;
                    $(">thead>tr", $("#grvList")).append('<th>Name</th>');
                    $(">thead>tr", $("#grvList")).append('<th></th>');
                    $(">thead>tr", $("#grvList")).append('<th></th>');
                }
                $('#grvList').DataTable().destroy();
                var d = JSON.parse(response.Data["Item1"]);
                try {
                    var c = privateMethods.generateColumns(additinalData, (response.Data["Item2"].length > 0 ? response.Data["Item2"][0] : ''), (response.Data["Item2"].length > 1 ? response.Data["Item2"][1] : ''), (response.Data["Item2"].length > 2 ? response.Data["Item2"][2] : ''));
                    var table = $('#grvList').DataTable({
                        "scrollY": parseInt($(window).height() - 400),
                        "scrollCollapse": true,
                        "scrollX": true,
                        "jQueryUI": true,
                        data: d,
                        columns: c,
                        order: [[0, 'asc']]
                    });
                }
                catch (e) {
                }
            }
        },
        generateColumns: function (fields, udetail, uanother, uanother1) {
            var columns = [];
            if (configurationtype === 6) {
                columns.push({
                    orderable: false,
                    data: null,
                    render: function (data, type, row) {
                        return data["FormName"];
                    }
                });
                columns.push({
                    orderable: false,
                    data: null,
                    render: function (data, type, row) {
                        if (data["IsPublished"]) {
                            return "<span style='color:green;'>Published</span>";
                        }
                        else {
                            return "<span style='color:red;'>Save Mode</span>";
                        }
                    },
                    width: 50
                });
                columns.push({
                    orderable: false,
                    data: null,
                    render: function (data, type, row) {
                        var url = $.trim(udetail) + "/" + data["Id"];
                        return '<a href="' + url + '" Id="' + data["Id"] + '">Details</a>';
                    },
                    width: 50
                });
            }
            else {
                $.each(fields, function (i, a) {
                    columns.push({
                        orderable: true,
                        data: null,
                        render: function (data, type, row) {
                            data[a.Id] = data[a.Id] == null ? "" : data[a.Id];
                            if (data[a.Id].indexOf("|") != -1) {
                                return data[a.Id].replace(/\|/g, " ");
                            }
                            else {
                                if (a["FieldType"] === 12 || a["FieldType"] === 13 || a["FieldType"] === 17 || a["FieldType"] === 18) {
                                    var s = data[a.Id].split(",");
                                    var h = '';
                                    $.each(s, function (i, x) {
                                        //"<a id='spn_" + x + "' style='display:block;margin:5px 0;'>" + x + "</a>";
                                        var url = '#';
                                        if (a["FieldType"] === 13) {
                                            url = uanother1 + "/" + x;
                                        }
                                        else { url = uanother + "/" + x; }
                                        h += '<a href="' + url + '" ui="' + x + '" style="display: block; margin: 5px 0;"></a>';
                                        if ($.inArray(x, privateVariables.ufields) < 0) {
                                            privateVariables.ufields.push(x);
                                        }
                                    });
                                    return h;
                                }
                                else {
                                    return data[a.Id];
                                }
                            }
                        },
                        width: 100
                    });
                });
            }
            switch (configurationtype) {
                case 1:
                    columns.push({
                        orderable: false,
                        data: null,
                        render: function (data, type, row) {
                            var url = $.trim(udetail) + "/" + data["Id"];
                            return '<a href="' + url + '" Id="' + data["Id"] + '">Profile</a>';
                        },
                        width: 100
                    });
                    columns.push({
                        orderable: false,
                        data: null,
                        render: function (data, type, row) {
                            var url = $.trim(uanother) + "/" + data["Id"];
                            return '<a href="#" Id="' + data["Id"] + '">Application Permissions</a>';
                        },
                        width: 100
                    });
                    break;
                case 2:
                case 3:
                case 4:
                    columns.push({
                        orderable: false,
                        data: null,
                        render: function (data, type, row) {
                            var url = $.trim(udetail) + "/" + data["Id"];
                            return '<a href="' + url + '" Id="' + data["Id"] + '">Details</a>';
                        },
                        width: 100
                    });
                    break;
                case 5:
                    columns.push({
                        orderable: false,
                        data: null,
                        render: function (data, type, row) {
                            var url = $.trim(udetail) + "/" + data["Id"];
                            return '<a href="' + url + '" Id="' + data["Id"] + '">Details</a>';
                        },
                        width: 100
                    });
                    columns.push({
                        orderable: false,
                        data: null,
                        render: function (data, type, row) {
                            var url = $.trim(uanother) + "/" + data["Id"];
                            return '<a href="' + url+'" Id="' + data["Id"] + '">Cases</a>';
                        },
                        width: 100
                    });
                    break;
            }
            return columns;
        },
        getuFieldValue: function () {
            var callback = function (response, aParam) {
                if (response.Status) {
                    var d = JSON.parse(response.Data["Item1"]);
                    var k = '';
                    if ($.isArray(d)) {
                        $.each(d[0], function (key, value) {
                            if (key != "Id") {
                                k = key;
                            }
                        });
                        $.each(d, function (i, v) {
                            var t = v[k].replace(/\|/g, " ");
                            $(">tbody>tr>td>a[ui=" + v["Id"] + "]", $("#grvList")).text(">> " + t);
                            //$("span[id$=_" + v["Id"]+"]").text(">> "+t);
                        });
                    }
                    d = JSON.parse(response.Data["Item2"]);
                    var k = '';
                    if ($.isArray(d)) {
                        $.each(d[0], function (key, value) {
                            if (key != "Id") {
                                k = key;
                            }
                        });
                        $.each(d, function (i, v) {
                            var t = v[k].replace(/\|/g, " ");
                            $(">tbody>tr>td>a[ui=" + v["Id"] + "]", $("#grvList")).text(">> " + t);
                            //$("#spn_" + v["Id"]).text(">> "+t);
                        });
                    }
                }
            };
            Utility.postDataToServer("api/EmployeeApi/FirmUsers", { "DefaultValues": privateVariables.ufields.join(",") }, {}, "json", callback, null, null, false);
        },
        setPrivateValues: function () {
            switch (configurationtype) {
                case 1:
                    privateVariables.listUrl = "api/EmployeeApi/FirmEmployeeList";
                    break;
                case 2:
                    privateVariables.listUrl = "api/FirmApi/FirmCasesList";
                    break;
                case 3:
                    privateVariables.listUrl = "api/FirmApi/FirmTasksList";
                    break;
                case 4:
                    privateVariables.listUrl = "api/FirmApi/FirmEventsList";
                    break;
                case 5:
                    privateVariables.listUrl = "api/FirmApi/FirmClientList";
                    break;
                case 6:
                    privateVariables.listUrl = "api/FirmApi/FirmCustomFormsList";
                    break;
            }
        },
        initiatePlugins: function () {
        },
        attachevents: function () {
            $("#btnSave").unbind().bind("click", delegateMethods.save);
        },
        load: function () {
            privateMethods.setPrivateValues();
            if (configurationtype === 6) {
                privateMethods.getlist();
            }
            else {
                privateMethods.getConfiguredDefaultField();
            }
        }
    };
    var constructor = {
        ListController: function () {
            privateMethods.load();
            privateMethods.attachevents();
            privateMethods.initiatePlugins();
        }
    };
    constructor.ListController();
}
$(document).ready(function () {
    var main = new ListController();
});