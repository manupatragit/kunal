function EmployeesController() {
    var privateVariables = {
        configuredcustomfields: []
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
                response.Data = Enumerable.From(response.Data)
                    .Where(function (n) {
                        return n["IsDefault"] === true;
                    }).ToArray();
                $.each(response.Data, function (i, a) {
                    fields.push(a["Id"]);
                    $(">thead>tr", $("#grvList")).append('<th id="' + a["Id"] + '">' + a["FieldName"] + '</th>');
                });
                $(">thead>tr", $("#grvList")).append('<th></th>')
                privateMethods.getlist(fields);
            }
        },
        getlist: function (additinalData) {
            Utility.postDataToServer("api/EmployeeApi/FirmEmployeeList", {}, {}, "json", privateMethods.loadList, null, additinalData, false);
        },
        loadList: function(response,additinalData) {
            if (response.Status) {
                $('#grvList').DataTable().destroy();
                var c=privateMethods.generateColumns(JSON.parse(response.Data), additinalData);
                var table = $('#grvList').DataTable({
                    "scrollY": parseInt($(window).height() - 400),
                    "scrollCollapse": true,
                    "scrollX": true,
                    "jQueryUI": true,
                    data: JSON.parse(response.Data),
                    columns: c,
                    order: [[1, 'asc']]
                });
                privateMethods.attachGridEvent();
                
            }
        },
        generateColumns: function (d,fields) {
            var columns = [];
            $.each(fields, function (i, a) {
                columns.push({
                    orderable: true,
                    data: null,//d[a],
                    render: function (data, type, row) {
                        data[a] = data[a] == null ? "" : data[a];
                        if (data[a].indexOf("|") != -1) {
                            return data[a].replace(/\|/g," ");
                        }
                        else {
                            return data[a];
                        }
                        
                    },
                    width: 100
                });
            });
            columns.push({
                orderable: false,
                data: null,
                render: function (data, type, row) {
                    return '<a href="#" Id="' + data["Id"] + '">Profile</a>';
                },
                width: 100
            });

            return columns;
        },
        initiatePlugins: function () {

        },
        attachevents: function () {
            $("#btnSave").unbind().bind("click", delegateMethods.save);
        },
        load: function () {
            privateMethods.getConfiguredDefaultField();
            
        }
    };
    var constructor = {
        EmployeesController: function () {
            privateMethods.load();
            privateMethods.attachevents();
            privateMethods.initiatePlugins();
        }
    };
    constructor.EmployeesController();
}

$(document).ready(function () {
    var main = new EmployeesController();
});