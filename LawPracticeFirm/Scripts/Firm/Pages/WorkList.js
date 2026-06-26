function ListController() {
    var privateVariables = {
        addNewUrl: "",
        attachUrl: '',
        listDataUrls:[],
        listUrl: "",
        ufields: [],
        attachedItems:[]
    };
    var delegateMethods = {
        save: function () {
            if (CustomFields.validateFields()) {
                alert("Save Successfully!!");
            }
        },
        showModal: function () {
            var id = document.activeElement.id;
            $("#divList").empty();
            privateVariables.attachedItems = [];
            privateMethods.getAttachedItemList(parseInt(id, 10));
            $("#btnAttach").unbind().bind("click", function () {
                location.href=privateVariables.listDataUrls[1] + "/" + id;
            });
        },
        hideModal: function () {
            var status = true;
            if (document.activeElement.id !== "btnClose") {
            }
            return status;
        },
    };
    var privateMethods = {
        getAttachedItemList: function (id) {
            Utility.postDataToServer("api/FirmApi/AttachWorkFlowItemList", {}, { "wfId": id }, "json", privateMethods.loadAttachedItemList, null, null, false);
        },
        loadAttachedItemList: function (response) {
            if (response.Status) {
                var d = response.Data;
                var q = Enumerable.From(d)
                    .GroupBy(
                    null,
                    null,
                    "{ AttachedItemConfigurationtype: $.AttachedItemConfigurationtype, AttachedItemConfigurationName: $.AttachedItemConfigurationName,Id:$.Id, items: $$.Select('$.AttachedItemId').ToArray() }",
                    "$.AttachedItemConfigurationtype + '-' + $.AttachedItemConfigurationName" // compare selector needed
                    ).ToArray();
                if (q.length > 0) {
                    privateVariables.attachedItems = q;
                    $.each(q, function (i, a) {
                        var t = '<div style="margin-bottom:5px;border-bottom:1px solid black;"><h4 class="modal-title">' + a["AttachedItemConfigurationName"] + '</h4><table id="grvList' + a["AttachedItemConfigurationtype"] + '" class="grvList table table-bordered table-striped table-hover" width="100%"><thead><tr class="info"></tr></thead></table></div>';
                        $("#divList").append(t);
                        privateMethods.getAttachedItem(a["AttachedItemConfigurationtype"])
                    });
                }
            }
        },
        getAttachedItem: function (confId) {
            Utility.postDataToServer("api/FirmApi/ConfiguredCustomFields", {}, { "configurationtype": confId }, "json", privateMethods.loadAttachedItem, null, [$("#grvList" + confId), confId], true);
        },
        loadAttachedItem: function (response, additinalData) {
            if (response.Status) {
                var obj = additinalData[0];
                var confId = additinalData[1];
                var fields = [];
                privateVariables.configuredcustomfields = Enumerable.From(response.Data.CustomFieldList)
                    .Where(function (n) {
                        return (n["IsDefault"] === true && n["SubConfigurationType"] === 'primary');
                    }).ToArray();
                if (privateVariables.configuredcustomfields.length > 0) {
                    $.each(privateVariables.configuredcustomfields, function (i, a) {
                        fields.push({ "Id": a["Id"], "FieldType": a["FieldType"] });
                        $(">thead>tr", $(obj)).append('<th id="' + a["Id"] + '" type="' + a["FieldType"] + '" index="' + i + '">' + a["FieldName"] + '</th>');
                    });
                    $(">thead>tr", $(obj)).append('<th></th>');
                    $(">thead>tr", $(obj)).append('<th></th>');
                }
                privateMethods.getdatalist([fields, $(obj), confId]);
                privateMethods.getuFieldValue();
            }
        },
        getdatalist: function (additinalData) {
            var listUrl = '';
            switch (additinalData[2]) {
                case 2://Case
                    listUrl = "api/FirmApi/FirmCasesList";
                    break;
                case 3://Task
                    listUrl = "api/FirmApi/FirmTasksList";
                    break;
                case 4://Event
                    listUrl = "api/FirmApi/FirmEventsList";
                    break;
            }
            Utility.postDataToServer(listUrl, { Id: 0 }, {}, "json", privateMethods.loadDataList, null, additinalData, false);
        },
        loadDataList: function (response, additinalData) {
            if (response.Status) {
                var obj = additinalData[1];
                var fields = additinalData[0];
                $(obj).DataTable().destroy();
                var d = JSON.parse(response.Data["Item1"]);
                var i = Enumerable.From(privateVariables.attachedItems).Where(function (x) {
                    return x["AttachedItemConfigurationtype"] === additinalData[2];
                }).First();
                d = Enumerable.From(d).Where(function (n) {
                    if ($.inArray(n["Id"], i["items"])>-1) {
                        return n;
                    }
                }).ToArray();
                var c = privateMethods.generateConfTypeColumns(fields, additinalData[2], i["Id"]);
                var table = $(obj).DataTable({
                    "scrollY": parseInt($(window).height() - 400),
                    "scrollCollapse": true,
                    "scrollX": true,
                    "jQueryUI": true,
                    data: d,
                    columns: c,
                    order: [[1, 'asc']]
                });
                $("input[type='radio'][name='data']").unbind().bind("change", delegateMethods.loadselectedObject);
            }
        },
        getuFieldValue: function (obj) {
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
                            $(">tbody>tr>td>span[ui=" + v["Id"] + "]", $(obj)).text(">> " + t);
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
                            $(">tbody>tr>td>span[ui=" + v["Id"] + "]", $(obj)).text(">> " + t);
                        });
                    }
                }
            };
            Utility.postDataToServer("api/EmployeeApi/FirmUsers", { "DefaultValues": privateVariables.ufields.join(",") }, {}, "json", callback, null, null, false);
        },
        generateConfTypeColumns: function (fields, wfId, attachedItemId) {
            var columns = [];
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
                                    h += '<span ui="' + x + '" style="display: block; margin: 5px 0;"></span>';
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
            columns.push({
                orderable: false,
                data: null,
                render: function (data, type, row) {
                    if (data["IsPublished"]) {
                        return "Published";
                    }
                    else {
                        return "Saved Mode";
                    }
                },
                width: 10
            });
            columns.push({
                orderable: false,
                data: null,
                render: function (data, type, row) {
                    var url = '';
                    if (privateVariables.listDataUrls.length > 1) {
                        url = privateVariables.listDataUrls[1] + "/" + wfId + "/" + attachedItemId;
                    }
                    return '<a href="' + url + '" type="attached" Id="' + data["Id"] + '">View</a>';
                },
                width: 50
            });
            return columns;
        },
        loadListHeader: function (response) {
            $(">thead>tr", $("#grvList")).append('<th>Name</th>');
            $(">thead>tr", $("#grvList")).append('<th></th>');
            $(">thead>tr", $("#grvList")).append('<th></th>');
            //$(">thead>tr", $("#grvList")).append('<th></th>');
            privateMethods.getlist();
        },
        getlist: function () {
            Utility.postDataToServer(privateVariables.listUrl, { }, {}, "json", privateMethods.loadList, null, null, false);
        },
        loadList: function (response) {
            if (response.Status) {
                $('#grvList').DataTable().destroy();
                var d = response.Data["Item1"];
                privateVariables.listDataUrls = response.Data["Item2"];
                //privateVariables.addNewUrl = response.Data["Item2"][0];
                //privateVariables.attachUrl = response.Data["Item2"][1];
                $("#btnAddNew").attr("href", privateVariables.listDataUrls[0]);
                var c = privateMethods.generateColumns(privateVariables.listDataUrls);
                var table = $('#grvList').DataTable({
                    "scrollY": parseInt($(window).height() - 400),
                    "scrollCollapse": true,
                    "scrollX": true,
                    "jQueryUI": true,
                    data: d,
                    columns: c,
                    order: [[1, 'asc']]
                });
                privateMethods.attachGridEvent();
            }
        },
        generateColumns: function (detailUrl) {
            var columns = [];
            columns.push({
                orderable: false,
                data: null,
                render: function (data, type, row) {
                    return data.WorkFlowName;
                }
            });
            columns.push({
                orderable: false,
                data: null,
                render: function (data, type, row) {
                    var url = '';
                    if (privateVariables.listDataUrls.length>1) {
                        url = privateVariables.listDataUrls[1] + "/" + data["Id"];
                    }
                    if (data["IsPublished"]) {
                        if (parseInt(data["AttachedWithCount"],10)>0) {
                            return '<a href="#" Id="' + data["Id"] + '" type="attach" data-toggle="modal" data-target="#attachfield">Attached With-' + data["AttachedWithCount"] + '</a>';
                        }
                        else {
                            return '<a href="' + url + '" type="attached" Id="' + data["Id"] + '">Attached With-' + data["AttachedWithCount"] + '</a>';
                        }
                    }
                    else {
                        return "Saved Mode";
                    }
                },
                width: 50
            });
            columns.push({
                orderable: false,
                data: null,
                render: function (data, type, row) {
                    var url = '';
                    if (privateVariables.listDataUrls.length > 0) {
                        url = privateVariables.listDataUrls[0] + "/" + data["Id"];
                    }
                    return '<a href="' + url + '" type="detail" Id="' + data["Id"] + '">Detail</a>';
                },
                width: 50
            });
            //columns.push({
            //    orderable: false,
            //    data: null,
            //    render: function (data, type, row) {
            //        if (data.IsPublished) {
            //            return '<a href="#" type="delete" Id="' + data["Id"] + '">Delete</a>';
            //        }
            //        else {
            //            var url = detailUrl + "/" + data["Id"];
            //            return '<a href="' + url + '" type="publish" Id="' + data["Id"] + '">Publish</a>';
            //        }
            //    },
            //    width: 50
            //});
            return columns;
        },
        attachGridEvent: function () {
            $(">tbody>tr>td>a[type=delete]", $("#grvList")).unbind().bind("click", function () {
            });
        },
        setPrivateValues: function () {
               privateVariables.listUrl = "api/FirmApi/WorkFlowList";
        },
        initiatePlugins: function () {
        },
        attachevents: function () {
            $("#btnAddNew").unbind().bind("click", function () {
                location.href = $(this).attr("href");
            });
            $("#attachfield").on('show.bs.modal', delegateMethods.showModal).on('hide.bs.modal', delegateMethods.hideModal);
        },
        load: function () {
            privateMethods.setPrivateValues();
            privateMethods.loadListHeader();
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