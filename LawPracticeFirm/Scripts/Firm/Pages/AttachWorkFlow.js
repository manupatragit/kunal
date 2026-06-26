fabric.LineArrow = fabric.util.createClass(fabric.Line, {

    type: 'lineArrow',

    initialize: function (element, options) {
        options || (options = {});
        this.callSuper('initialize', element, options);
        options && this.set('conn', options.conn);
    },

    toObject: function () {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            conn: this.conn,
            perPixelTargetFind: this.perPixelTargetFind,
            custype: this.custype,
            type: this.type
        });
    },

    _render: function (ctx) {
        this.callSuper('_render', ctx);

        // do not render if width/height are zeros or object is not visible
        if (this.width === 0 || this.height === 0 || !this.visible) return;

        ctx.save();

        var xDiff = this.x2 - this.x1;
        var yDiff = this.y2 - this.y1;
        var angle = Math.atan2(yDiff, xDiff);
        ctx.translate((this.x2 - this.x1) / 2, (this.y2 - this.y1) / 2);
        ctx.rotate(angle);
        ctx.beginPath();
        //move 10px in front of line to start the arrow so it does not have the square line end showing in front (0,0)
        ctx.moveTo(5, 0);
        ctx.lineTo(-10, 10);
        ctx.lineTo(-10, -10);
        ctx.closePath();
        ctx.fillStyle = this.stroke;
        ctx.fill();

        ctx.restore();

    }
});

fabric.LineArrow.fromObject = function (object, callback) {
    callback && callback(new fabric.LineArrow([object.x1, object.y1, object.x2, object.y2], object));
};

fabric.LineArrow.async = true;

function AttachWorkFlow() {
    var outPutValues = {
        WorkFlowAttachId: attachId,
        WorkFlowId: wfId,
        AttachedItemId: 0,
        ConfigurationTypeId: 0,
        IsPublished:false,
        Items:[]
    };


    var privateVariables = {
        canvas: new fabric.Canvas('canvas', { width: $(".drawbar").innerWidth(), height: $(".drawbar").innerHeight() - 5 }),
        isWorkflowSaved: false,
        isEditMode: false,
        editObjectId: 0,
        enableconnectionline: false,
        startpoints: ["mr", "mb", "ml", "mt"],
        endpoints: ["ml", "mt", "mr", "mb"],
        objects: [],
        color: '#496686',//'#84acb3',
        linecolor: '#28a745',//'#cc2900',
        linestroke: 2,
        textcolor: '#fff',
        stroke: '#eee',
        strokeWidth: 10,
        fontsize: 15,
        boldtext: true,
        objectwidth: 150,
        objectheight: 70,
        objectradius: 35,
        top: null,
        left: null,
        data: [],

        listUrl: '',
        infoUrl:'',
        configurationtype: 0,
        configuredcustomfields: [],
        ufields: [],
        ufieldData: [],
        attachItemInfo: {},
        selectedObject: [],
        statusdoneColor: '#28a745',
        statuspendingColor:'red'
    };

    var canvasVariables = {
        startobj: null,
        endobj: null,
        startConnection: false,
        paint: false,
        startPoint: new Array(),
        endPoint: new Array(),
        linkstartObject: null,
        selectedObject: null,
        ismousedown: false,
        ismousedownonobject: false,
        linkline: '',
        linkarrow: ''
    };

    var delegateMethods = {
        showModal: function () {
            $("input[type='radio'][name='ConfigurationType']").prop('checked', false);
            
            if ($.fn.dataTable.isDataTable('#grvList')) {
                $('#grvList').DataTable().destroy();
                $('#grvList').empty();
                $('#grvList').append('<thead><tr class= "info"></tr></thead>');
            }
        },
        hideModal: function () {
            var status = true;
            if (document.activeElement.id !== "btnClose") {
                if (!$("input[type='radio'][name='data']:checked").val()) {
                    alert("Select item for attachment!");
                    status = false;
                }
                else {
                    var value = parseInt($("input[type='radio'][name='data']:checked").val(), 10);
                    $("#spnLinks").empty();
                    var links = '';
                    $.each(privateVariables.selectedObject, function (i, o) {
                        if (i == 0) {
                            links += '<span style="margin:0 1%"><lable style="font-size: 0.9rem !important;">' + o["title"] + '</lable>-<a target="_blank" href="' + o["url"]+'" val="' + o["objectid"] + '">' + o["value"] + '</a></span>';
                        }
                        else {
                            links += '<span style="margin:0 1%"><lable style="font-size: 0.9rem !important;">' + o["title"] + '</lable>-' + o["value"] + '</span>';
                        }
                    });
                    $("#spnLinks").html(links);
                    privateVariables.canvas.clear();
                    
                    privateMethods.generate(privateVariables.data.WorkFlowInfo, true);
                    privateMethods.attachCanvasevents();
                }
            }
            return status;
        },

        showValueModal: function () {
            $('#grvFormList').DataTable().destroy();
            $('#grvFormList').DataTable().columns.adjust();
            $("input[type='radio'][name='customform']").removeAttr('checked');
            $("#sDate,#eDate").val('');
            $("#divassign").append('<select class="col-md-8 textinput" id="ddlAssign"></select>');
            var object = privateMethods.findObjById(privateVariables.editObjectId);

            if (object.type.toUpperCase() =="DIAMOND") {
                $("#divFormList").hide();
            }
            else {
                $("#divFormList").show();
            }

            if (object !== null) {
                var d = [];
                switch (object.assignTo.toUpperCase()) {
                    case "STM":
                        $("#ddlAssign").append('<option value="0">-Select Any-</option>');
                        d=Enumerable.From(privateVariables.ufieldData).Where(function (o) {
                            return (o.type === 'Team');
                        }).ToArray();
                        break;
                    case "ATM":
                        $("#ddlAssign").prop("multiple",true);
                        d = Enumerable.From(privateVariables.ufieldData).Where(function (o) {
                            return (o.type === 'Team');
                        }).ToArray();
                        break;
                    case "SU":
                        $("#ddlAssign").append('<option value="0">-Select Any-</option>');
                        break;
                    case "AU":
                        $("#ddlAssign").attr("multiple", "multiple");
                        break;
                    case "C":
                        $("#ddlAssign").append('<option value="0">-Select Any-</option>');
                        d = Enumerable.From(privateVariables.ufieldData).Where(function (o) {
                            return (o.type === 'Client');
                        }).ToArray();
                        break;
                    default:
                }
                $.each(d, function (i, a) {
                    $("#ddlAssign").append('<option value="' + a.Id + '">' + a.Value + '</option>');
                });
            }

            if (object.value !== '') {
                var s = object.value.split(',');
                $("#ddlAssign").val(s);
                $("#sDate").val(object.start.toYYYYMMDD());
                $("#eDate").val(object.end.toYYYYMMDD());
                $("input[type='radio'][name='customform'][value=" + object.formId + "]").prop("checked", true);
            }


            $("#ddlAssign").fastselect();
        },
        hideValueModal: function () {
            var status = true;
            if (document.activeElement.id !== "btnClose") {
                //Validate Custom added Fields
                
                if ($.trim($("#ddlAssign").val()) === "0" || !$("#sDate")[0].validity.valid || !$("#eDate")[0].validity.valid) //|| ($("#divFormList").is(":visible") && $("input[type='radio'][name='customform']:checked").length == 0)
                {
                    alert("Missing mandatory Field(s)!");
                    status = false;
                }
                else {
                    var fId = $("input[type='radio'][name='customform']:checked").val();
                    var g = privateMethods.findObjById(privateVariables.editObjectId);
                    g.value = $.isArray($("#ddlAssign").val()) ? $("#ddlAssign").val().join(",") : $.trim($("#ddlAssign").val());
                    g.start = $.trim($("#sDate").val());
                    g.end = $.trim($("#eDate").val());
                    g.formId = (fId == undefined ||fId==null) ? 0 : parseInt(fId,10);
                    g._objects[2].set('fill', privateVariables.statusdoneColor);
                    privateVariables.canvas.calcOffset();
                    privateVariables.canvas.renderAll();
                    privateMethods.attachCanvasevents();

                    privateVariables.editObjectId = 0;
                    $("#ddlAssign").remove();
                }
            }
            else {
                privateVariables.editObjectId = 0;
                $("#ddlAssign").remove();
            }
           
            return status;
        },

        reset: function () {
            privateVariables.canvas.clear();
            location.reload();
        },
        publish: function () {
            //outPutValues
            var items =  privateVariables.canvas.getObjects().filter(function (o) {
                return o.custype == 'group' && (o.value===''||o.start==='' || o.end==='');
            });
            if (items.length>0) {
                alert("Update WorkFlow specific values!!");
            }
            else {
                outPutValues.Items = [];               
                $.each(privateVariables.canvas.getObjects(), function (i, o) {
                    if (o.custype === 'group' || o.custype === 'startgroup' || o.custype === 'endgroup') {
                        var d = {};
                        
                        var x = privateMethods.getConnectedObjects(o);
                        var d = {
                            ObjectId: o.id,
                            PreviousObjectIds: x[0].join(','),
                            NextObjctIds: x[1].join(','),
                            FormId: (o.custype === 'startgroup' || o.custype === 'endgroup') ? 0 : o.formId,
                            AssignTo: (o.custype === 'startgroup' || o.custype === 'endgroup') ? 0 : o.value,
                            StartDate: (o.custype === 'startgroup' || o.custype === 'endgroup')?'1/1/2000':o.start,
                            EndDate: (o.custype === 'startgroup' || o.custype === 'endgroup') ? '1/1/2000' : o.end,
                            ObjectType: o.custype
                        };
                        outPutValues.Items.push(d);
                    }
                });

                if ($.trim($(this).text()).toUpperCase() === "PUBLISH") {
                    outPutValues["IsPublished"] = true;
                }
                Utility.postDataToServer("api/FirmApi/AttachWorkFlow", outPutValues, {}, "json", privateMethods.attachedWorkFlow, null, null, false);
            }
        },
        loadConfigurationList: function () {
            var obj = $(this);
            privateVariables.configurationtype = parseInt(obj.attr("value"), 10);

            switch (privateVariables.configurationtype) {
                case 2://Case
                    privateVariables.listUrl = "api/FirmApi/FirmCasesList";
                    privateVariables.infoUrl = "api/FirmApi/CaseDetails";
                    break;
                case 3://Task
                    privateVariables.listUrl = "api/FirmApi/FirmTasksList";
                    privateVariables.infoUrl = "api/FirmApi/TaskDetails";
                    break;
                case 4://Event
                    privateVariables.listUrl = "api/FirmApi/FirmEventsList";
                    privateVariables.infoUrl = "api/FirmApi/EventDetails";
                    break;
            }
            if (privateVariables.listUrl !== '' && privateVariables.infoUrl !== '') {
                //$('#grvList').DataTable().clear().destroy();
                outPutValues.ConfigurationTypeId = privateVariables.configurationtype;
                privateMethods.getConfiguredDefaultField();
            }
        },
        loadselectedObject: function () {
            privateVariables.ufieldData = [];
            var id = parseInt($(this).val(), 10);
            outPutValues.AttachedItemId = id;
            var u = $(this).attr("url");
            var index = $(this).closest('tr').index();
            var tbl = $('#grvList');
            var head = $(">thead>tr", $(tbl));
            var teamcol = -1;
            var clientcol = -1;
            privateVariables.selectedObject = [];
            $.each($(">th", $(head)), function (i, h) {
                if (i>0) {
                    privateVariables.selectedObject.push({ objectid: id, index: i, title: $(h).text(), value: '', url: u });
                    if ( parseInt($(h).attr("type"),10)===18) {
                        teamcol = i;
                    }
                    if (parseInt($(h).attr("type"), 10) === 13) {
                        clientcol = i;
                    }
                }
            });
            var row = $(">tbody>tr:eq(" + index + ")", $(tbl));
            $.each($(">td", $(row)), function (i, h) {
                if (i > 0) {
                    var lineobjects = Enumerable.From(privateVariables.selectedObject).Where(function (o) {
                        return (o.index === i);
                    }).ToArray();
                    if (lineobjects.length>0) {
                        lineobjects[0]['value'] = $(h).text();
                        //privateVariables.ufieldData.push({ "Id": v["Id"], "Value": t,"type":'Team' });
                    }
                    if (i === teamcol) {
                        $.each($(">span", $(h)), function (a,v) {
                            privateVariables.ufieldData.push({ "Id": parseInt($(v).attr("ui"), 10), "Value": $(v).text(), "type": 'Team' });
                        });
                    }
                    if (i === clientcol) {
                        $.each($(">span", $(h)), function (a, v) {
                            privateVariables.ufieldData.push({ "Id": parseInt($(v).attr("ui"), 10), "Value": $(v).text(), "type": 'Client' });
                        });
                    }
                }
            });
        },
        loadselectedForm: function () {

        }
    };

    var customCanvasMethods = {
        mouseDownTouchStart: function (mouseX, mouseY) {
            canvasVariables.paint = true;
            canvasVariables.startPoint[0] = mouseX;
            canvasVariables.startPoint[1] = mouseY;
        },
        _getQBezierValue: function (t, p1, p2, p3) {
            var iT = 1 - t;
            return iT * iT * p1 + 2 * iT * t * p2 + t * t * p3;
        },
        getQuadraticCurvePoint: function (startX, startY, cpX, cpY, endX, endY, position) {
            return {
                x: customCanvasMethods._getQBezierValue(position, startX, cpX, endX),
                y: customCanvasMethods._getQBezierValue(position, startY, cpY, endY)
            };
        },
        makecp: function (left, top, line) {
            var c = new fabric.Circle({
                radius: 3,
                left: left,
                top: top,
                strokeWidth: 3,
                fill: 'grey',
                opacity: 1,
                stroke: 'grey',
                originX: 'center',
                originY: 'center'
            });

            c.hasBorders = c.hasControls = false;

            c.angle = 90;

            c.name = "cp";

            c.line = line;
            line.cp = c;

            return c;
        },
        makeArrow: function (centerpt, left, top, line) {
            var c = new fabric.Triangle({
                width: 10,
                height: 10,
                left: left,
                top: top,
                //selectable: false,
                strokeWidth: 3,
                fill: 'grey',
                opacity: 1,
                stroke: 'grey',
                originX: 'center',
                originY: 'center'
            });

            c.hasBorders = c.hasControls = false;

            c.angle = 90;

            c.line = line;

            var dx = left - centerpt.x;
            var dy = top - centerpt.y;

            //var angle = Math.atan2(dy, dx) * 180 / Math.PI;
            //c.setAngle(angle + 90);

            c.setCoords();

            c.name = 'ep';
            line.ep = c;
            c.line = line;

            privateVariables.canvas.add(c);
            privateVariables.canvas.bringToFront(c);
            privateVariables.canvas.renderAll();
            return c;
        },
        removeLink() {
            if (canvasVariables.linkline) {
                privateVariables.canvas.remove(linkline);
                privateVariables.canvas.remove(linkarrow);
                canvasVariables.linkline = "";
                canvasVariables.linkarrow = "";
            }
            privateVariables.canvas.renderAll();
        },
        getMousePos: function (mouseevent) {
            var p = privateVariables.canvas.getPointer(mouseevent);
            mouseleft = parseInt(p.x);
            mousetop = parseInt(p.y);
        },
        createConnLink: function () {
            canvasVariables.linkstartObject = canvasVariables.selectedObject;
            if (canvasVariables.linkline) return;

            if (canvasVariables.linkstartObject) {

                x1 = canvasVariables.linkstartObject.left;
                y1 = canvasVariables.linkstartObject.top + canvasVariables.linkstartObject.height / 2;
                x2 = canvasVariables.linkstartObject.left + 2;
                y2 = canvasVariables.linkstartObject.top - canvasVariables.linkstartObject.height / 2 + 2

                canvasVariables.linkline = new fabric.CustomLine('M ' + x1 + ' ' + y1 + ' Q ' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ', ' + 50, {
                    fill: '',
                    stroke: 'black',
                    strokeWidth: 2,
                    selectable: false,
                    originX: "center",
                    originY: "center"
                });


                canvasVariables.linkline.path[0][1] = x1;
                canvasVariables.linkline.path[0][2] = y1;

                canvasVariables.linkline.path[1][1] = x1;
                canvasVariables.linkline.path[1][2] = y2;

                canvasVariables.linkline.path[1][3] = x2;
                canvasVariables.linkline.path[1][4] = y2;

                privateVariables.canvas.add(canvasVariables.linkline);
                canvasVariables.linkline.setCoords();

                var centerpt = customCanvasMethods.getQuadraticCurvePoint(linkline.path[0][1], linkline.path[0][2], linkline.path[1][1], linkline.path[1][2], linkline.path[1][3], linkline.path[1][4], 0.5);
                canvasVariables.linkarrow = customCanvasMethods.makeArrow(centerpt, linkline.path[1][3], linkline.path[1][4], line);

                canvasVariables.linkarrow.lockScalingX = canvasVariables.linkarrow.lockScalingY = canvasVariables.linkarrow.lockRotation = true;

                canvasVariables.linkline.ep = canvasVariables.linkarrow;
                //privateVariables.canvas.add(canvasVariables.linkarrow);

                canvasVariables.linkarrow.setCoords();

                //sendBackLineAndArrows();
                privateVariables.canvas.calcOffset();
                privateVariables.canvas.renderAll();
                //adjustArrow(linkline);
                privateVariables.canvas.renderAll();
            }
        }
    };

    var privateMethods = {
        getPreviousObjects: function (o) {},
        getNextsObjects: function (o) { },
        getOutPutObjects: function (o) { },
        getConnectedObjects: function (p) {
            var pre = [];
            var next = [];
            $.each(p.connectorLines, function (i, v) {
                var line = v;
                var conn = line.conn.split(",");
                if (conn.length == 2 && conn[0] !== conn[1]) {
                    if (p.id==conn[0]) {
                        next.push(conn[1]);
                    }
                    if (p.id == conn[1]) {
                        pre.push(conn[0]);
                    }
                }
            });
            return [pre, next];
        },

        attachedWorkFlow: function (response) {
            if (response.Status) {
                alert("Workflow Is Attached!!");
                location.href = location.href + "/" + response.Data;
            }
            else {
                alert(response.Message);
            }
        },

        getAttachWorkFlowDetail: function () {
            Utility.postDataToServer("api/FirmApi/AttachWorkFlowDetail", outPutValues, {}, "json", privateMethods.loadAttachWorkFlowDetail, null, null, true);
        },
        loadAttachWorkFlowDetail: function (response) {
            if (response.Status && response.Data !== null) {
                outPutValues = {
                    WorkFlowAttachId: outPutValues.WorkFlowAttachId,
                    WorkFlowId: outPutValues.WorkFlowId,
                    AttachedItemId: response.Data.AttachedItemId,
                    ConfigurationTypeId: response.Data.ConfigurationTypeId,
                    IsPublished: response.Data.IsPublished,
                    Items: response.Data.Items
                };
                $("input[type='radio'][name='ConfigurationType']").val(outPutValues.ConfigurationTypeId).change();
                $("input[type='radio'][name='data']").val(outPutValues.AttachedItemId).change();
                var value = parseInt($("input[type='radio'][name='data']:checked").val(), 10);
                $("#spnLinks").empty();
                var links = '';
                $.each(privateVariables.selectedObject, function (i, o) {
                    if (i == 0) {
                        links += '<span style="margin:0 1%"><lable style="font-size: 0.9rem !important;">' + o["title"] + '</lable>-<a target="_blank" href="' + o["url"] + '" val="' + o["objectid"] + '">' + o["value"] + '</a></span>';
                    }
                    else {
                        links += '<span style="margin:0 1%"><lable style="font-size: 0.9rem !important;">' + o["title"] + '</lable>-' + o["value"] + '</span>';
                    }
                });
                $("#spnLinks").html(links);
                privateVariables.canvas.clear();
                privateMethods.generate(privateVariables.data.WorkFlowInfo, true);
                privateMethods.attachCanvasevents();
                $.each(outPutValues.Items, function (i, a) {
                    var g = privateMethods.findObjById(a.ObjectId);
                    g.value = a.AssignTo;
                    g.start = a.StartDate;
                    g.end = a.EndDate;
                    g.formId = a.FormId;
                    if (g._objects.length > 2) {
                        g._objects[2].set('fill', privateVariables.statusdoneColor);
                    }
                    
                });
                privateVariables.canvas.calcOffset();
                privateVariables.canvas.renderAll();
                privateMethods.attachCanvasevents();
            }
        },


        getCustomForm: function () {
            Utility.postDataToServer("api/FirmApi/FirmCustomFormsList", {}, {"published":true}, "json", privateMethods.loadCustomform, null, null, true);
        },
        loadCustomform: function (response) {
            if (response.Status) {
                //$('#grvFormList').DataTable().destroy();
                var d = JSON.parse(response.Data["Item1"]);
                var udetail = response.Data["Item2"];
                var columns = [];
                columns.push({
                    orderable: false,
                    data: null,
                    render: function (data, type, row) {
                        //var url = udetail + "/" + data["Id"];
                        return '<input type="radio" name="customform" class="radioinput" value="' + data["Id"] + '">';
                    },
                    width:5
                });
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
                        var url = $.trim(udetail) + "/" + data["Id"];
                        return '<a href="' + url + '" Id="' + data["Id"] + '" target="_blank">Details</a>';
                    },
                    width: 10
                });
                try {
                    var table = $('#grvFormList').DataTable({
                        "scrollY": parseInt($(window).height() - 400),
                        "scrollCollapse": true,
                        "scrollX": true,
                        "jQueryUI": true,
                        data: d,
                        columns: columns,
                        order: [[1, 'asc']]
                    });
                    
                    $("input[type='radio'][name='customform']").unbind().bind("change", delegateMethods.loadselectedForm);
                } catch (e) {
                }
                
            }
            
        },

        getConfiguredDefaultField: function () {
            Utility.postDataToServer("api/FirmApi/ConfiguredCustomFields", {}, { "configurationtype": privateVariables.configurationtype }, "json", privateMethods.loadConfiguredCustomField, null, null, false);
        },
        loadConfiguredCustomField: function (response) {
            if (response.Status) {
                $("#divList").empty();
                var t = '<table id="grvList" class="grvList table table-bordered table-striped table-hover" width="100%"><thead><tr class="info"></tr></thead></table>';
                $("#divList").append(t);
                var fields = [];
                
                privateVariables.configuredcustomfields = Enumerable.From(response.Data.CustomFieldList)
                    .Where(function (n) {
                        return (n["IsDefault"] === true && n["SubConfigurationType"]==='primary');
                    }).ToArray();
                if (privateVariables.configuredcustomfields.length>0) {
                    $(">thead>tr", $("#grvList")).append('<th></th>');

                    $.each(privateVariables.configuredcustomfields, function (i, a) {
                        fields.push({ "Id": a["Id"], "FieldType": a["FieldType"] });
                        $(">thead>tr", $("#grvList")).append('<th id="' + a["Id"] + '" type="' + a["FieldType"]+'" index="'+i+'">' + a["FieldName"] + '</th>');
                    });
                }
                privateMethods.getlist(fields);
                privateMethods.getuFieldValue();
            }
        },
        getlist: function (additinalData) {
            Utility.postDataToServer(privateVariables.listUrl, { Id: 0 }, {}, "json", privateMethods.loadList, null, additinalData, false);
        },
        loadList: function (response, additinalData) {
            if (response.Status) {
                $('#grvList').DataTable().destroy();
                var d = JSON.parse(response.Data["Item1"]);
                var c = privateMethods.generateColumns(additinalData, response.Data["Item2"], response.Data["Item3"], response.Data["Item4"]);
                var table = $('#grvList').DataTable({
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
        generateColumns: function (fields, udetail, uanother, uanother1) {
            var columns = [];
            columns.push({
                orderable: false,
                data: null,
                render: function (data, type, row) {
                    var url = udetail + "/" + data["Id"];
                    return '<input type="radio" name="data" class="radioinput" value="' + data["Id"] + '" url="' + url+'">';
                },
                width: 10
            });
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
                            $(">tbody>tr>td>span[ui=" + v["Id"] + "]", $("#grvList")).text(">> " + t);
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
                            $(">tbody>tr>td>span[ui=" + v["Id"] + "]", $("#grvList")).text(">> " + t);
                        });
                    }

                }
            };
            Utility.postDataToServer("api/EmployeeApi/FirmUsers", { "DefaultValues": privateVariables.ufields.join(",") }, {}, "json", callback, null, null, false);
        },
        getObjectData: function (id) {
            Utility.postDataToServer(privateVariables.infoUrl, { "Id": id }, { "configurationtype": privateVariables.configurationtype }, "json", privateMethods.loadObjectData, null, null, true);
        },
        loadObjectData: function (response) {
            if (response.Status) {
                privateVariables.attachItemInfo = JSON.parse(response.Data["Item2"]);                
            }
        },

        savedWorkFlow: function (response) {
            if (response.Status) {
                location.href = Utility.URL + response.Data;
            }
        },
        loadWorkFlowDetail: function () {
            Utility.postDataToServer("api/FirmApi/WorkFlowDetail", { Id: outPutValues.WorkFlowId, IsPublished:true }, {}, "json", privateMethods.loadWorkFlow, null, null, false);
        },
        loadWorkFlow: function (response) {
            if (response.Status) {
                privateVariables.data = response.Data;
                privateVariables.data.WorkFlowInfo = JSON.parse(privateVariables.data.WorkFlowInfo);

                $("#txtWFName").val(privateVariables.data.WorkFlowName).attr("readonly","readonly");

                //if (privateVariables.data.IsPublished) {
                //    $("#divActions").remove();
                //}
                //else {
                //    $("#btnSave").text("Publish");
                //}
                if (privateVariables.data.WorkFlowInfo.objects.length > 0) {
                    privateMethods.generate(privateVariables.data.WorkFlowInfo);
                    privateMethods.getFilteredObjects(privateVariables.data.WorkFlowInfo.objects);
                    privateMethods.getCustomForm();
                }
            }
            else {
                alert(response.Message);
                $(".pagebackground").find('a,input, textarea, button, select,textbox').attr('disabled', 'disabled').unbind().bind("click", function () { return false; });
            }
        },
        getFilteredObjects: function (objects) {
            objects = Enumerable.From(objects).Where(function (o) {
                return (o.assignTo !== undefined && o.assignTo !== null && o.assignTo !== '');
            }).OrderBy(function (x) { return parseInt(x.id); }).ToArray();
        },
        generate: function (data,displayImage) {
            $.each(data.objects, function (i, o) {
                var obj;
                var top = o.top;
                var left = o.left;
                switch (o.type.toUpperCase()) {
                    case "LINEARROW":
                        obj = privateMethods.drawLine("line", [o.x1, o.y1, o.x2, o.y2], o.conn);
                        var conn = o.conn.split(",");
                        var start = privateMethods.findObjById(conn[0]);
                        var end = privateMethods.findObjById(conn[1]);
                        start.connectorLines[start.connectorLines.length] = obj;
                        end.connectorLines[end.connectorLines.length] = obj;
                        var cp = start.getCenterPoint();
                        obj.set({ 'x1': cp.x, 'y1': cp.y });
                        cp = end.getCenterPoint();
                        obj.set({ 'x2': cp.x, 'y2': cp.y });
                        obj.setCoords();
                        obj.bringToFront();
                        break;
                    case "CIRCLE":
                        obj = privateMethods.drawCircle("Start", top, left, 1, displayImage);
                        break;
                    case "ECLIPSE":
                        obj = privateMethods.drawEclipse("Finish", left, top, 999999, displayImage);
                        break;
                    case "RECTWITHCORNER":
                        obj = privateMethods.drawRectangleWithCorners(o.text, top, left, o.id, o.task, o.assignTo, displayImage);
                        break;
                    case "POLYGON":
                        obj = privateMethods.drawPolygon(o.text, top, left, o.id, o.task, o.assignTo, displayImage);
                        break;
                    case "RECTANGLE":
                        break;
                    case "DIAMOND":
                        obj = privateMethods.drawDiamond(o.text, top, left, o.id, o.task, o.assignTo, displayImage);
                        break;

                }

            });
            //privateVariables.canvas.renderAll();
        },
        findlastobject: function () {
            var objects = privateVariables.canvas.getObjects().filter(function (o) {
                return o.custype == 'group';
            });
            objects = Enumerable.From(objects).Where(function (o) {
                return o.id !== 999999;
            }).OrderBy(function (x) { return parseInt(x.id); }).ToArray();
            return objects[objects.length - 1];
        },
        findObjById: function (objid) {
            var canobj = privateVariables.canvas.getObjects().filter(function (o) {
                return o.id == objid;
            });
            return canobj[0];
        },
        findObjByName: function (text) {
            var canobj = privateVariables.canvas.getObjects().filter(function (o) {
                return o.text == text;
            });
            return canobj[0];
        },
        findObjByCustType: function (type) {
            var canobj = privateVariables.canvas.getObjects().filter(function (o) {
                return o.custype == type;
            });
            return canobj[0];
        },
        findObjByProperty: function (prop, value) {
            var canobj = privateVariables.canvas.getObjects().filter(function (o) {
                return o[prop] == value;
            });
            return canobj;
        },
        objectConnectionExist: function (id1, id2) {
            var canobj = privateVariables.canvas.getObjects().filter(function (o) {
                return (o.custype == "connectionline" && ((o.conn == (id1 + "," + id2))));
            });
            return canobj.length > 0;
        },
        /*DECISION*/
        drawDiamond: function (text, topPoint, leftPoint, id, task, assign, displayImage) {
            if (privateVariables.isEditMode && privateVariables.editObjectId > 0) {
                var g = privateMethods.findObjById(privateVariables.editObjectId);
                g.value = assign;
                
                privateVariables.canvas.calcOffset();
                privateVariables.canvas.renderAll();
                return g;
            }
            else {
                var group;
                var baseleft = 200;
                var basetop = 0;
                var o = new fabric.Polygon([
                    { x: baseleft, y: basetop },
                    { x: (baseleft + (privateVariables.objectwidth / 2)), y: basetop + privateVariables.objectheight / 2 },
                    { x: baseleft, y: basetop + privateVariables.objectheight },
                    { x: (baseleft - (privateVariables.objectwidth / 2)), y: basetop + privateVariables.objectheight / 2 }
                ], {
                        angle: 0,
                        fill: privateVariables.color,
                        stroke: privateVariables.stroke,
                        strokeWidth: privateVariables.strokeWidth
                    });

                var t = new fabric.Text(text, {
                    left: baseleft + 10,
                    top: privateVariables.objectheight / 2,
                    fontSize: privateVariables.fontsize,
                    fontWeight: privateVariables.boldtext ? 'bold' : '',
                    originX: 'center',
                    originY: 'center',
                    type: 'text',
                    fill: privateVariables.textcolor
                });
                if (displayImage) {
                    var c = new fabric.Circle({
                        left: (baseleft + (privateVariables.objectwidth /2))-20,
                        top: (basetop + privateVariables.objectheight / 3)+5,
                        strokeWidth: 1,
                        radius: 10,
                        fill: privateVariables.statuspendingColor,
                        stroke: 1,
                        strokeWidth: 1,
                        type: 'circle'
                    });
                    group = new fabric.Group([o, t,c], {
                        left: leftPoint,
                        top: topPoint,
                        text: text,
                        custype: 'group',
                        type: 'diamond',
                        assignTo: assign,
                        task: task,
                        value: '',
                        start: '',
                        end: '',
                        formId:0,
                        id: (id === null || id === undefined) ? privateVariables.canvas.getObjects().length + 1 : id,
                        connectorLines: [],
                        hasBorders: false,
                        hasControls: false,
                        lockScalingX: true,
                        lockScalingY: true,
                        lockMovementX: true,
                        lockMovementY: true,
                        perPixelTargetFind: true
                    });
                }
                else {
                    group = new fabric.Group([o, t], {
                        left: leftPoint,
                        top: topPoint,
                        text: text,
                        custype: 'group',
                        type: 'diamond',
                        assignTo: assign,
                        task: task,
                        value: '',
                        start: '',
                        end: '',
                        formId: 0,
                        id: (id === null || id === undefined) ? privateVariables.canvas.getObjects().length + 1 : id,
                        connectorLines: [],
                        hasBorders: false,
                        hasControls: false,
                        lockScalingX: true,
                        lockScalingY: true,
                        lockMovementX: true,
                        lockMovementY: true,
                        perPixelTargetFind: true
                    });
                }



                
                group.set('hasRotatingPoint', false);
                group.set('hasBorders', false);
                group.set('transparentCorners', false);
                group.setControlsVisibility({
                    tl: false, tr: false,
                    br: false, bl: false
                });
                group.toObject = function () {
                    return fabric.util.object.extend(this.callSuper('toObject'), {
                        text: this.text,
                        custype: this.custype,
                        type: this.type,
                        value: this.value,
                        start: this.start,
                        end: this.end,
                        formId: this.formId,
                        perPixelTargetFind: this.perPixelTargetFind,
                        assignTo: this.assignTo,
                        task: this.task,
                        id: this.id,
                        connectorLines: this.connectorLines
                    });
                };
                group.setCoords();
                group.custype = 'group';
                privateVariables.canvas.add(group);
                privateVariables.canvas.calcOffset();
                privateVariables.canvas.renderAll();
                return group;
            }
        },
        drawRectangle: function (text, topPoint, leftPoint, id, task, assign, displayImage) {
            if (privateVariables.isEditMode && privateVariables.editObjectId > 0) {
                var g = privateMethods.findObjById(privateVariables.editObjectId);
                g.assignTo = assign;
                g.task = task;
                g.text = text;
                privateVariables.canvas.calcOffset();
                privateVariables.canvas.renderAll();
                return g;
            }
            else {
                var group;
                var o = new fabric.Rect({
                    left: 50,
                    top: 50,
                    width: privateVariables.objectwidth,
                    height: privateVariables.objectheight,
                    angle: 0,
                    fill: privateVariables.color,
                    stroke: privateVariables.stroke,
                    strokeWidth: privateVariables.strokeWidth
                });

                var t = new fabric.Text(text, {
                    left: privateVariables.objectwidth / 2,
                    top: privateVariables.objectheight / 2,
                    fontSize: privateVariables.fontsize,
                    fontWeight: privateVariables.boldtext ? 'bold' : '',
                    originX: 'center',
                    originY: 'center',
                    type: 'text',
                    fill: privateVariables.textcolor
                });
                if (displayImage) {
                    var c = new fabric.Circle({
                        left: (baseleft + (privateVariables.objectwidth / 2)),
                        top: (basetop + privateVariables.objectheight / 3) + 5,
                        strokeWidth: 1,
                        radius: 10,
                        fill: privateVariables.statuspendingColor,
                        stroke: 1,
                        strokeWidth: 1,
                        type: 'circle'
                    });
                    group = new fabric.Group([o, t, c], {
                        left: leftPoint,
                        top: topPoint,
                        text: text,
                        custype: 'group',
                        type: 'rectangle',
                        assignTo: assign,
                        task: task,
                        value: '',
                        start: '',
                        end: '',
                        formId: 0,
                        id: (id === null || id === undefined) ? privateVariables.canvas.getObjects().length + 1 : id,
                        connectorLines: [],
                        hasBorders: false,
                        hasControls: false,
                        lockScalingX: true,
                        lockScalingY: true,
                        lockMovementX: true,
                        lockMovementY: true,
                        perPixelTargetFind: true
                    });
                }
                else {
                    group = new fabric.Group([o, t], {
                        left: leftPoint,
                        top: topPoint,
                        text: text,
                        custype: 'group',
                        type: 'rectangle',
                        value: '',
                        start: '',
                        end: '',
                        formId: 0,
                        assignTo: assign,
                        task: task,
                        id: (id === null || id === undefined) ? privateVariables.canvas.getObjects().length + 1 : id,
                        connectorLines: [],
                        hasBorders: false,
                        hasControls: false,
                        lockScalingX: true,
                        lockScalingY: true,
                        lockMovementX: true,
                        lockMovementY: true,
                        perPixelTargetFind: true
                    });
                }
                group.set('hasRotatingPoint', false);
                group.set('hasBorders', false);
                group.set('transparentCorners', false);
                group.setControlsVisibility({
                    tl: false, tr: false,
                    br: false, bl: false
                });
                group.toObject = function () {
                    return fabric.util.object.extend(this.callSuper('toObject'), {
                        text: this.text,
                        custype: this.custype,
                        type: this.type,
                        value: this.value,
                        start: this.start,
                        end: this.end,
                        formId: this.formId,
                        perPixelTargetFind: this.perPixelTargetFind,
                        assignTo: this.assignTo,
                        task: this.task,
                        id: this.id,
                        connectorLines: this.connectorLines
                    });
                };
                group.setCoords();
                group.custype = 'group';
                privateVariables.canvas.add(group);
                privateVariables.canvas.renderAll();
                return group;
            }
        },
        /*OUTPUT*/
        drawPolygon: function (text, topPoint, leftPoint, id, task, assign, displayImage) {
            if (privateVariables.isEditMode && privateVariables.editObjectId > 0) {
                var g = privateMethods.findObjById(privateVariables.editObjectId);
                g.assignTo = assign;
                g.task = task;
                g.text = text;
                privateVariables.canvas.calcOffset();
                privateVariables.canvas.renderAll();
                return g;
            }
            else {
                var group;
                var baseleft = 100;
                var o = new fabric.Polygon([
                    { x: baseleft, y: 0 },
                    { x: (baseleft + privateVariables.objectwidth), y: 0 },
                    { x: (baseleft + (privateVariables.objectwidth / 2)), y: privateVariables.objectheight },
                    { x: (baseleft - (privateVariables.objectwidth / 2)), y: privateVariables.objectheight }
                ], {
                        angle: 0,
                        fill: privateVariables.color,
                        stroke: privateVariables.stroke,
                        strokeWidth: privateVariables.strokeWidth
                    });

                var t = new fabric.Text(text, {
                    left: (baseleft + privateVariables.objectwidth / 4),
                    top: privateVariables.objectheight / 2,
                    fontSize: privateVariables.fontsize,
                    fontWeight: privateVariables.boldtext ? 'bold' : '',
                    originX: 'center',
                    originY: 'center',
                    type: 'text',
                    fill: privateVariables.textcolor
                });
                if (displayImage) {
                    var c = new fabric.Circle({
                        left: (baseleft + privateVariables.objectwidth)-10,
                        top: 0,
                        strokeWidth: 1,
                        radius: 10,
                        fill: privateVariables.statuspendingColor,
                        stroke: 1,
                        strokeWidth: 1,
                        type: 'circle'
                    });
                    group = new fabric.Group([o, t, c], {
                        left: leftPoint,
                        top: topPoint,
                        text: text,
                        custype: 'group',
                        type: 'polygon',
                        assignTo: assign,
                        task: task,
                        value: '',
                        start: '',
                        end: '',
                        formId: 0,
                        id: (id === null || id === undefined) ? privateVariables.canvas.getObjects().length + 1 : id,
                        connectorLines: [],
                        hasBorders: false,
                        hasControls: false,
                        lockScalingX: true,
                        lockScalingY: true,
                        lockMovementX: true,
                        lockMovementY: true,
                        perPixelTargetFind: true
                    });
                }
                else {
                    var group = new fabric.Group([o, t], {
                        left: leftPoint,
                        top: topPoint,
                        text: text,
                        custype: 'group',
                        type: 'polygon',
                        value: '',
                        start: '',
                        end: '',
                        formId: 0,
                        assignTo: assign,
                        task: task,
                        id: (id === null || id === undefined) ? privateVariables.canvas.getObjects().length + 1 : id,
                        connectorLines: [],
                        hasBorders: false,
                        hasControls: false,
                        lockScalingX: true,
                        lockScalingY: true,
                        lockMovementX: true,
                        lockMovementY: true,
                        perPixelTargetFind: true
                    });
                    group.set('hasRotatingPoint', false);
                    group.set('hasBorders', false);
                    group.set('transparentCorners', false);
                    group.setControlsVisibility({
                        tl: false, tr: false,
                        br: false, bl: false
                    });
                }
                group.toObject = function () {
                    return fabric.util.object.extend(this.callSuper('toObject'), {
                        text: this.text,
                        custype: this.custype,
                        type: this.type,
                        value: this.value,
                        start: this.start,
                        end: this.end,
                        formId: this.formId,
                        perPixelTargetFind: this.perPixelTargetFind,
                        assignTo: this.assignTo,
                        task: this.task,
                        id: this.id,
                        connectorLines: this.connectorLines
                    });
                };
                group.setCoords();
                group.custype = 'group';
                privateVariables.canvas.add(group);
                privateVariables.canvas.renderAll();
                return group;
            }
        },
        /*STATUS*/
        drawRectangleWithCorners: function (text, topPoint, leftPoint, id, task, assign, displayImage) {
            if (privateVariables.isEditMode && privateVariables.editObjectId > 0) {
                var g = privateMethods.findObjById(privateVariables.editObjectId);
                g.assignTo = assign;
                g.task = task;
                g.text = text;
                privateVariables.canvas.calcOffset();
                privateVariables.canvas.renderAll();
                return g;
            }
            else {
                var o = new fabric.Rect({
                    left: 0,
                    top: 0,
                    width: privateVariables.objectwidth + 20,
                    height: privateVariables.objectheight,
                    angle: 0,
                    rx: 20,
                    ry: 20,
                    fill: privateVariables.color,
                    stroke: privateVariables.stroke,
                    strokeWidth: privateVariables.strokeWidth,
                });

                var t = new fabric.Text(text, {
                    left: (privateVariables.objectwidth / 2) + 10,
                    top: privateVariables.objectheight / 2,
                    fontSize: privateVariables.fontsize,
                    fontWeight: privateVariables.boldtext ? 'bold' : '',
                    originX: 'center',
                    originY: 'center',
                    type: 'text',
                    fill: privateVariables.textcolor
                });
                if (displayImage) {
                    var c = new fabric.Circle({
                        left: privateVariables.objectwidth,
                        top: 5,
                        strokeWidth: 1,
                        radius: 10,
                        fill: privateVariables.statuspendingColor,
                        stroke: 1,
                        strokeWidth: 1,
                        type: 'circle'
                    });
                    group = new fabric.Group([o, t, c], {
                        left: leftPoint,
                        top: topPoint,
                        text: text,
                        custype: 'group',
                        type: 'rectwithcorner',
                        assignTo: assign,
                        task: task,
                        value: '',
                        start: '',
                        end: '',
                        formId: 0,
                        id: (id === null || id === undefined) ? privateVariables.canvas.getObjects().length + 1 : id,
                        connectorLines: [],
                        hasBorders: false,
                        hasControls: false,
                        lockScalingX: true,
                        lockScalingY: true,
                        lockMovementX: true,
                        lockMovementY: true,
                        perPixelTargetFind: true
                    });
                }
                else {
                    var group = new fabric.Group([o, t], {
                        left: leftPoint,
                        top: topPoint,
                        text: text,
                        custype: 'group',
                        type: 'rectwithcorner',
                        value: '',
                        start: '',
                        end: '',
                        formId: 0,
                        assignTo: assign,
                        task: task,
                        id: (id === null || id === undefined) ? privateVariables.canvas.getObjects().length + 1 : id,
                        connectorLines: [],
                        hasBorders: false,
                        hasControls: false,
                        lockScalingX: true,
                        lockScalingY: true,
                        lockMovementX: true,
                        lockMovementY: true,
                        perPixelTargetFind: true
                    });
                }
                group.set('hasRotatingPoint', false);
                group.set('hasBorders', false);
                group.set('transparentCorners', false);
                group.setControlsVisibility({
                    tl: false, tr: false,
                    br: false, bl: false
                });
                group.toObject = function () {
                    return fabric.util.object.extend(this.callSuper('toObject'), {
                        text: this.text,
                        custype: this.custype,
                        type: this.type,
                        value: this.value,
                        start: this.start,
                        end: this.end,
                        formId: this.formId,
                        perPixelTargetFind: this.perPixelTargetFind,
                        assignTo: this.assignTo,
                        task: this.task,
                        id: this.id,
                        connectorLines: this.connectorLines
                    });
                };

                group.setCoords();
                group.custype = 'group';
                privateVariables.canvas.add(group);
                privateVariables.canvas.renderAll();
                return group;
            }
        },
        /*Finish*/
        drawEclipse: function (text, leftPoint, topPoint, id) {
            var o = new fabric.Ellipse({
                radius: privateVariables.objectradius,
                rx: privateVariables.objectradius + 10,
                ry: privateVariables.objectradius,
                width: privateVariables.objectwidth,
                height: privateVariables.objectheight,
                fill: privateVariables.color,
                stroke: privateVariables.stroke,
                strokeWidth: privateVariables.strokeWidth,
                originX: 'center',
                originY: 'center',
                type: 'eclipse'
            });
            o.set('active', true);
            o.set('hasRotatingPoint', false);
            o.set('hasBorders', false);
            o.set('transparentCorners', false);
            o.setControlsVisibility({
                tl: false, tr: false,
                br: false, bl: false
            });

            var t = new fabric.Text(text, {
                fontSize: privateVariables.fontsize,
                fontWeight: privateVariables.boldtext ? 'bold' : '',
                originX: 'center',
                originY: 'center',
                type: 'text',
                fill: privateVariables.textcolor
            });
            var group = new fabric.Group([o, t], {
                left: leftPoint,
                top: topPoint,
                text: text,
                custype: 'endgroup',
                type: 'eclipse',
                value: null,
                id: (id === null || id === undefined) ? privateVariables.canvas.getObjects().length + 1 : id,
                connectorLines: [],
                hasBorders: false,
                hasControls: false,
                lockScalingX: true,
                lockScalingY: true,
                lockMovementX: true,
                lockMovementY: true,
                perPixelTargetFind: true
            });
            group.set('hasRotatingPoint', false);
            group.set('hasBorders', false);
            group.set('transparentCorners', false);
            group.setControlsVisibility({
                tl: false, tr: false,
                br: false, bl: false
            });
            group.toObject = function () {
                return fabric.util.object.extend(this.callSuper('toObject'), {
                    text: this.text,
                    custype: this.custype,
                    type: this.type,
                    value: this.value,
                    perPixelTargetFind: this.perPixelTargetFind,
                    id: this.id,
                    connectorLines: this.connectorLines
                });
            };
            group.setCoords();
            group.custype = 'endgroup';
            privateVariables.canvas.add(group);
            privateVariables.canvas.calcOffset();
            privateVariables.canvas.renderAll();
            return group;
        },
        /*Start*/
        drawCircle: function (text, topPoint, leftPoint) {

            var c = new fabric.Circle({
                left: 0,
                top: 0,
                strokeWidth: 5,
                radius: privateVariables.objectradius,
                fill: privateVariables.color,
                stroke: privateVariables.stroke,
                strokeWidth: privateVariables.strokeWidth,
                type: 'circle'
            });

            var t = new fabric.Text(text, {
                fontSize: privateVariables.fontsize,
                fontWeight: privateVariables.boldtext ? 'bold' : '',
                left: privateVariables.objectradius + 5,
                top: privateVariables.objectradius + 5,
                originX: 'center',
                originY: 'center',
                type: 'text',
                fill: privateVariables.textcolor
            });
            var group = new fabric.Group([c, t], {
                left: 10,
                top: 10,
                text: text,
                custype: 'startgroup',
                type: 'circle',
                value: null,
                perPixelTargetFind: true,
                id: 1,
                connectorLines: [],
                hasBorders: false,
                hasControls: false,
                lockScalingX: true,
                lockScalingY: true,
                lockMovementX: true,
                lockMovementY: true,
                perPixelTargetFind: true,
            });

            group.set('hasRotatingPoint', false);
            group.set('transparentCorners', false);
            group.setControlsVisibility({
                tl: false, tr: false,
                br: false, bl: false
            });

            group.toObject = function () {
                return fabric.util.object.extend(this.callSuper('toObject'), {
                    text: this.text,
                    custype: this.custype,
                    type: this.type,
                    value: this.value,
                    perPixelTargetFind: this.perPixelTargetFind,
                    id: this.id,
                    connectorLines: this.connectorLines
                });
            };
            group.setCoords();
            group.custype = 'startgroup';
            privateVariables.canvas.add(group);
            privateVariables.canvas.calcOffset();
            privateVariables.canvas.renderAll();
            return group;
        },
        drawLine: function (text, coords, conn, id) {
            var l = new fabric.LineArrow(coords, {
                fill: privateVariables.linecolor,
                stroke: privateVariables.linecolor,
                strokeWidth: privateVariables.linestroke,
                originX: 'center',
                originY: 'center',
                hasBorders: false,
                hasControls: false,
                lockScalingX: true,
                lockScalingY: true,
                lockMovementX: true,
                lockMovementY: true,
                perPixelTargetFind: true,
                custype: 'connectionline',
                type: 'lineArrow',
                conn: conn,
                id: (id === null || id === undefined) ? privateVariables.canvas.getObjects().length + 1 : id
            });
            l.setCoords();
            privateVariables.canvas.add(l);

            privateVariables.canvas.renderAll();
            l.bringToFront();
            return l;
        },
        initiatePlugins: function () {
            $("#attachfield").on('show.bs.modal', delegateMethods.showModal).on('hide.bs.modal', delegateMethods.hideModal);
        },
        attachCanvasevents: function () {
            privateVariables.canvas.off('mouse:dblclick');
            privateVariables.canvas.on("mouse:dblclick", function (e) {
                $("#spnTitle").text('');
                $(".fstElement").remove();
                $("#sDate,#eDate").val('');
                var p = e.target;
                if (p.id === 1 || p.id === 999999) {
                    return false;
                }
                else {
                    privateVariables.editObjectId = p.id;
                    $("#spnTitle").text(p.text + " (" + ApplicationData.WorkFlowActions[p.task]+")");
                    
                    
                    $('#customform').modal('show');
                }
            });
        },
        attachevents: function () {
            $("#btnSave,#btnPublish").unbind().bind("click", delegateMethods.publish);
            $("#btnCancel").unbind().bind("click", delegateMethods.reset);
            $("input[type='radio'][name='ConfigurationType']").unbind().bind("change", delegateMethods.loadConfigurationList);
            $("#customform").on('show.bs.modal', delegateMethods.showValueModal).on('hide.bs.modal', delegateMethods.hideValueModal);
        },
        load: function () {
            privateVariables.canvas.setWidth($(".drawbar").innerWidth());
            privateVariables.canvas.setHeight($(".drawbar").innerHeight() - 5);
            privateVariables.canvas.clear();
            privateMethods.loadWorkFlowDetail();
            if (outPutValues.WorkFlowAttachId !== 0) {
                privateMethods.getAttachWorkFlowDetail();
            }
        }
    };

    var constructor = {
        AttachWorkFlow: function () {
            privateMethods.load();
            privateMethods.attachevents();
            privateMethods.initiatePlugins();
        }
    };
    constructor.AttachWorkFlow();
}


$(document).ready(function () {
    var main = new AttachWorkFlow();
});