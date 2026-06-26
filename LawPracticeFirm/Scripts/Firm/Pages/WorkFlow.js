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
function WorkFlow() {
    var privateVariables = {
        canvas: new fabric.Canvas('canvas', { width: $(".drawbar").innerWidth(), height: $(".drawbar").innerHeight() - 5 }),
        isWorkflowSaved: false,
        isEditMode: false,
        editObjectId:0,
        workFlowId: Id,
        enableconnectionline: false,
        startpoints: ["mr", "mb", "ml", "mt"],
        endpoints: ["ml", "mt", "mr", "mb"],
        objects: [],
        color: '#496686',//'#84acb3',
        linecolor: '#28a745',//'#cc2900',
        linestroke:2,
        textcolor:'#fff',
        stroke: '#eee',
        strokeWidth: 10,
        fontsize: 15,
        boldtext:true,
        objectwidth: 150,
        objectheight: 70,
        objectradius: 35,
        top: null,
        left: null,
        data:[]
    };
    var canvasVariables = {
        startobj:null,
        endobj: null,
        startConnection: false,
        paint: false,
        startPoint: new Array(),
        endPoint: new Array(),
        linkstartObject: null,
        selectedObject:null,
        ismousedown: false,
        ismousedownonobject: false,
        linkline: '',
        linkarrow:''
    };
    var delegateMethods = {
        showModal: function () {
            var p = privateMethods.findObjById(privateVariables.editObjectId);
            $("#spnTitle").text(privateVariables.type);
            $("#divEvent").show();
            if (privateVariables.isEditMode) {
                $("#btnAdd").text("Update");
            }
            else {
                $("#btnAdd").text("Add");
            }
            if (p !== null && p!== undefined) {
                $("#txtTitle").val(p.text);
                $("#ddlAssign").val(p.assignTo);
                $("#ddlEvent").val(p.task);
            }
            $("#ddlEvent,#ddlAssign").fastselect();
        },
        hideModal: function () {
            var status = true;
            if (document.activeElement.id !== "btnClose") {
                if ($.trim($("#txtTitle").val()) === '' || $("#ddlEvent").val() === "0" || $("#ddlAssign").val() === "0") {
                    alert("Missing mandatory Field(s)!");
                    status= false;
                }
                else {
                    switch (privateVariables.type.toUpperCase()) {
                        case "STATUS":
                            if ($.trim($("#txtTitle").val())!=="") {obj = privateMethods.drawRectangleWithCorners($("#txtTitle").val(), privateVariables.top, privateVariables.left, null, $("#ddlEvent").val(), $("#ddlAssign").val());}
                            break;
                        case "DECISION":
                            if ($.trim($("#txtTitle").val()) !== '') { obj = privateMethods.drawDiamond($("#txtTitle").val(), privateVariables.top, privateVariables.left, null, $("#ddlEvent").val(), $("#ddlAssign").val()); }
                            break;
                        case "OUTPUT":
                        case "INPUT":
                            if ($.trim($("#txtTitle").val()) !== '') { obj = privateMethods.drawPolygon($("#txtTitle").val(), privateVariables.top, privateVariables.left, null, $("#ddlEvent").val(), $("#ddlAssign").val()); }
                            break;
                    }
                    privateVariables.top = null;
                    privateVariables.left = null;
                    privateVariables.type = '';
                    $("#txtTitle").val('').focus();
                    $("#ddlEvent,#ddlAssign").val("0");
                    $("#divEvent").hide();
                }
            }
            else {
                privateVariables.top = null;
                privateVariables.left = null;
                privateVariables.type = '';
                $("#txtTitle").val('').focus();
                $("#ddlEvent,#ddlAssign").val("0");
                $("#divEvent").hide();
            }
            privateVariables.isEditMode = false;
            privateVariables.editObjectId = 0;
            return status;
        },
        reset: function () {
            privateVariables.canvas.clear();
            location.reload();
        },
        publish: function () {
            var btn = $(this);
            var url = ''
            if ($.trim($("#txtWFName").val().toUpperCase()) ==='WORKFLOW NAME') {
                alert("Work Flow Name can not be blank!!");
                $("#txtWFName").focus();
                return false;
            }
            else {
                if (privateVariables.workFlowId == 0) {
                    privateVariables.data = {
                        WorkFlowModule: configurationtype,
                        WorkFlowName: $.trim($("#txtWFName").val()),
                        WorkFlowInfo: JSON.stringify(privateVariables.canvas.toJSON())
                    }
                    url = "api/FirmApi/AddWorkFlow";
                }
                else {
                    privateVariables.data = {
                        Id: privateVariables.workFlowId,
                        WorkFlowModule: configurationtype,
                        WorkFlowName: $.trim($("#txtWFName").val()),
                        WorkFlowInfo: JSON.stringify(privateVariables.canvas.toJSON())
                    }
                    url = "api/FirmApi/UpdateWorkFlow";
                }
                var steps = {};
                var lineobjects = Enumerable.From(privateVariables.canvas.toJSON().objects).Where(function (o) {
                    return (o.type.toUpperCase() == 'LINEARROW');
                }).ToArray();
                $.each(lineobjects, function (i, o) {
                    var conn = o.conn.split(",");
                    if (steps[conn[0]] === undefined) {
                        steps[conn[0]] = conn[1];
                    }
                    else {
                        steps[conn[0]] = steps[conn[0]]+","+conn[1];
                    }
                });
                if ($.trim($(btn).text()).toUpperCase()==="PUBLISH") {
                    privateVariables.data["IsPublished"] = true;
                }
                Utility.postDataToServer(url, privateVariables.data, {}, "json", privateMethods.savedWorkFlow, null, null, false);
            }
        },
        create: function () {
            var option = $(this);
            privateVariables.type = $(option).attr("node-type");
            var f = privateMethods.findlastobject();
            var canvasTop = privateVariables.canvas.lowerCanvasEl.offsetTop;
            var canvasleft = privateVariables.canvas.lowerCanvasEl.offsetLeft;
            var canvasright = canvasleft + privateVariables.canvas.lowerCanvasEl.offsetWidth;
            var canvasbottom = canvasTop + privateVariables.canvas.lowerCanvasEl.offsetHeight;
            privateVariables.canvas.lowerCanvasEl.offsetWidth
            var top = f.top;
            var left = f.left + f.width + 50;
            if ((left+230) > canvasright) {
                var start = privateMethods.findObjById(1);
                left = start.left;
                top = f.top + f.height + 50;
            }
            if (top > canvasbottom) {
                alert("Can not add more items!!");
            }
            else {
                switch (privateVariables.type.toUpperCase()) {
                    case "END":
                        var finish = privateMethods.findObjById(999999);
                        if (finish == null) {
                            obj = privateMethods.drawEclipse("Finish", left, top, 999999);
                        }
                        else {
                            alert("Finish already exist!!");
                        }
                        break;
                    case "STATUS":
                        $('#workflow').modal('show');
                        privateVariables.top = top;
                        privateVariables.left = left;
                        break;
                    case "DECISION":
                        $('#workflow').modal('show');
                        privateVariables.top = top;
                        privateVariables.left = left;
                        break;
                    case "OUTPUT":
                    case "INPUT":
                        $('#workflow').modal('show');
                        privateVariables.top = top;
                        privateVariables.left = left;
                        break;
                    case "CONNECT":
                        privateVariables.enableconnectionline = true;
                        break;
                    default:
                        break;
                }
            }
            return false;
        },
        delete: function () {
            var actObj = privateVariables.canvas.getActiveObject();
            if (actObj!==null && confirm("Are you sure, you want to delete!!\n\n It will also remove all connections!!")) {
                var actObj = privateVariables.canvas.getActiveObject();
                switch (actObj.custype.toUpperCase()) {
                    case "GROUP":
                        $.each(actObj.connectorLines, function (i, line) {
                            var conn = line.conn.split(",");
                            if (conn.length == 2) {
                                var startobj = privateMethods.findObjById(conn[0]);
                                var endobj = privateMethods.findObjById(conn[1]);
                                $.each(startobj.connectorLines, function (i, v) {
                                    if (v.conn === line.conn) {
                                        startobj.connectorLines = $.grep(startobj.connectorLines, function (a) {
                                            return a.conn !== line.conn;
                                        });
                                    }
                                });
                                $.each(endobj.connectorLines, function (i, v) {
                                    if (v.conn === line.conn) {
                                        endobj.connectorLines = $.grep(endobj.connectorLines, function (a) {
                                            return a.conn !== line.conn;
                                        });
                                    }
                                });
                            }
                            privateVariables.canvas.remove(line);
                        });
                        privateVariables.canvas.remove(actObj);
                        break;
                    case "CONNECTIONLINE":
                        var conn = actObj.conn.split(",");
                        if (conn.length == 2) {
                            var startobj = privateMethods.findObjById(conn[0]);
                            var endobj = privateMethods.findObjById(conn[1]);
                            $.each(startobj.connectorLines, function (i, v) {
                                if (v.conn === actObj.conn) {
                                    startobj.connectorLines = $.grep(startobj.connectorLines, function (a) {
                                        return a.conn !== actObj.conn;
                                    });
                                }
                            });
                            $.each(endobj.connectorLines, function (i, v) {
                                if (v.conn === actObj.conn) {
                                    endobj.connectorLines = $.grep(endobj.connectorLines, function (a) {
                                        return a.conn !== actObj.conn;
                                    });
                                }
                            });
                            privateVariables.canvas.remove(actObj);
                        }
                        break;
                }
            }
        },
        objectmoved: function (e) {
            var p = e.target;
            var id = p.id;
            $.each(p.connectorLines, function (i, v) {
                var line = v;
                var conn = line.conn.split(",");
                if (conn.length == 2) {
                    var cp = p.getCenterPoint();
                    if (id == conn[0]) {
                        line.set({ 'x1': cp.x, 'y1': cp.y });
                    }
                    else {
                        line.set({ 'x2': cp.x, 'y2': cp.y });
                    }
                    line.setCoords();
                    line.bringToFront();
                }
            });            
            p.setCoords();
            privateVariables.canvas.renderAll();
            privateVariables.enableconnectionline = false;
        },
        objectselected: function (e) {
            if (privateVariables.enableconnectionline) {
                if (privateMethods.objectConnectionExist(canvasVariables.selectedObject.id, e.target.id)) {
                    alert("Already Connected!!");
                    return false;
                } else {
                    privateVariables.enableconnectionline = false;
                    var from = canvasVariables.selectedObject.getCenterPoint();
                    var to = e.target.getCenterPoint();
                    var l = privateMethods.drawLine("line", [from.x, from.y, to.x, to.y], canvasVariables.selectedObject.id + "," + e.target.id);
                    l.bringToFront();
                    canvasVariables.selectedObject.connectorLines[canvasVariables.selectedObject.connectorLines.length] = l;
                    e.target.connectorLines[e.target.connectorLines.length] = l;
                }
            }
            else {
                canvasVariables.selectedObject = e.target;
            }
        }
    };
    var customCanvasMethods = {
        mouseDownTouchStart:function(mouseX, mouseY) {
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
        makeArrow:function(centerpt, left, top, line) {
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
        savedWorkFlow: function (response) {
            if (response.Status) {
                location.reload();
            }
        },
        loadWorkFlowDetail:function(){
            Utility.postDataToServer("api/FirmApi/WorkFlowDetail", { Id: privateVariables.workFlowId}, {}, "json", privateMethods.loadWorkFlow, null, null, false);
        },
        loadWorkFlow: function (response) {
            if (response.Status) {
                privateVariables.data = response.Data;
                privateVariables.data.WorkFlowInfo = JSON.parse(privateVariables.data.WorkFlowInfo);
                $("#txtWFName").val(privateVariables.data.WorkFlowName);
                if (privateVariables.data.IsPublished) {
                    $("#divActions").remove();
                }
                else {
                    $("#txtWFName").removeClass('borderless');
                }
                if (privateVariables.data.WorkFlowInfo.objects.length > 0) {
                    privateMethods.generate(privateVariables.data.WorkFlowInfo);
                    privateMethods.getFilteredObjects(privateVariables.data.WorkFlowInfo.objects);
                }
            }
        },
        getFilteredObjects: function (objects) {
            objects = Enumerable.From(objects).Where(function (o) {
                return (o.assignTo !== undefined && o.assignTo !== null && o.assignTo !== '');
            }).OrderBy(function (x) { return parseInt(x.id); }).ToArray();
        },
        generate: function (data) {
            $.each(data.objects, function (i, o) {
                var obj;
                var top = o.top;
                var left = o.left;
                switch (o.type.toUpperCase()) {
                    case "LINEARROW":
                        obj=privateMethods.drawLine("line", [o.x1, o.y1, o.x2, o.y2], o.conn);
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
                        obj =privateMethods.drawCircle("Start", top, left, 1);
                        break;
                    case "ECLIPSE":
                        obj =privateMethods.drawEclipse("Finish", left, top, 999999);
                        break;
                    case "RECTWITHCORNER":
                        obj =privateMethods.drawRectangleWithCorners(o.text, top, left, o.id,o.task,o.assignTo);
                        break;
                    case "POLYGON":
                        obj = privateMethods.drawPolygon(o.text, top, left, o.id, o.task,o.assignTo);
                        break;
                    case "RECTANGLE":
                        break;
                    case "DIAMOND":
                        obj = privateMethods.drawDiamond(o.text, top, left, o.id, o.task,o.assignTo);
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
        findObjByType: function (type) {
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
        drawDiamond: function (text, topPoint, leftPoint, id, task, assign) {
            if (privateVariables.isEditMode && privateVariables.editObjectId > 0) {
                var g = privateMethods.findObjById(privateVariables.editObjectId);
                g.assignTo = assign;
                g.task= task;
                g.text = text;
                privateVariables.canvas.calcOffset();
                privateVariables.canvas.renderAll();
                return g;
            }
            else {
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
                var group = new fabric.Group([o, t], {
                    left: leftPoint,
                    top: topPoint,
                    text: text,
                    custype: 'group',
                    type: 'diamond',
                    perPixelTargetFind: true,
                    assignTo: assign,
                    task: task,
                    value: '',
                    start: '',
                    end: '',
                    formId: 0,
                    id: (id === null || id === undefined) ? privateVariables.canvas.getObjects().length + 1 : id,
                    connectorLines: []
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
                        perPixelTargetFind: this.perPixelTargetFind,
                        assignTo: this.assignTo,
                        task: this.task,
                        value: this.value,
                        start: this.start,
                        end: this.end,
                        formId: this.formId,
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
        drawRectangle: function (text, topPoint, leftPoint, id, task, assign) {
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
                var group = new fabric.Group([o, t], {
                    left: leftPoint,
                    top: topPoint,
                    text: text,
                    custype: 'group',
                    type: 'rectangle',
                    value: null,
                    perPixelTargetFind: true,
                    assignTo: assign,
                    task: task,
                    value: '',
                    start: '',
                    end: '',
                    formId: 0,
                    id: (id === null || id === undefined) ? privateVariables.canvas.getObjects().length + 1 : id,
                    connectorLines: []
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
                        perPixelTargetFind: this.perPixelTargetFind,
                        assignTo: this.assignTo,
                        task: this.task,
                        value: this.value,
                        start: this.start,
                        end: this.end,
                        formId: this.formId,
                        id: this.id,
                        connectorLines: this.connectorLines
                    });
                };
                group.setCoords();
                group.custype = 'group';
                privateVariables.canvas.add(group);
                //privateVariables.canvas.calcOffset();
                privateVariables.canvas.renderAll();
                return group;
            }
        },
        /*OUTPUT*/
        drawPolygon: function (text, topPoint, leftPoint, id, task, assign) {
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
                var group = new fabric.Group([o, t], {
                    left: leftPoint,
                    top: topPoint,
                    text: text,
                    custype: 'group',
                    type: 'polygon',
                    value: null,
                    perPixelTargetFind: true,
                    assignTo: assign,
                    task: task,
                    value: '',
                    start: '',
                    end: '',
                    formId: 0,
                    id: (id === null || id === undefined) ? privateVariables.canvas.getObjects().length + 1 : id,
                    connectorLines: []
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
                        perPixelTargetFind: this.perPixelTargetFind,
                        assignTo: this.assignTo,
                        task: this.task,
                        value: this.value,
                        start: this.start,
                        end: this.end,
                        formId: this.formId,
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
        drawRectangleWithCorners: function (text, topPoint, leftPoint, id, task, assign) {
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
                var group = new fabric.Group([o, t], {
                    left: leftPoint,
                    top: topPoint,
                    text: text,
                    custype: 'group',
                    type: 'rectwithcorner',
                    value: null,
                    perPixelTargetFind: true,
                    assignTo: assign,
                    task: task,
                    value: '',
                    start: '',
                    end: '',
                    formId: 0,
                    id: (id === null || id === undefined) ? privateVariables.canvas.getObjects().length + 1 : id,
                    connectorLines: []
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
                        perPixelTargetFind: this.perPixelTargetFind,
                        assignTo: this.assignTo,
                        task: this.task,
                        value: this.value,
                        start: this.start,
                        end: this.end,
                        formId: this.formId,
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
                custype: 'group',
                type: 'eclipse',
                value: null,
                perPixelTargetFind: true,
                id: (id === null || id === undefined) ? privateVariables.canvas.getObjects().length + 1 : id,
                connectorLines: []
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
            group.custype = 'group';
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
                custype: 'group',
                type: 'circle',
                value: null,
                perPixelTargetFind: true,
                id: 1,
                connectorLines: []
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
            group.custype = 'group';
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
            $("#workflow").on('show.bs.modal', delegateMethods.showModal).on('hide.bs.modal', delegateMethods.hideModal);
        },
        attachevents: function () {
            $(">li[node-type!='delete']", $("#uloptions")).unbind().bind("click", delegateMethods.create);
            $(">li[node-type='delete']", $("#uloptions")).unbind().bind("click", delegateMethods.delete);
            $("#btnSave,#btnPublish").unbind().bind("click", delegateMethods.publish);
            $("#btnCancel").unbind().bind("click", delegateMethods.reset);
            $("#txtWFName").unbind().bind("dblclick", function () {
                $(this).removeClass("borderless");
            }).bind("blur", function () {
                if ($.trim($("#txtWFName").val()) === '') {
                    $("#txtWFName").val("WorkFlow Name");
                }
                }).bind("focus", function () {
                    $(this).removeClass("borderless");
                    if ($.trim($("#txtWFName").val().toUpperCase()) == 'WORKFLOW NAME') {
                        $("#txtWFName").val('');
                    }
                });
            privateVariables.canvas.observe("after:render", function () {privateVariables.canvas.calcOffset();});
            privateVariables.canvas.on('object:moved', delegateMethods.objectmoved);
            privateVariables.canvas.on('object:rotated', delegateMethods.objectmoved);
            privateVariables.canvas.observe('object:selected', delegateMethods.objectselected);
            privateVariables.canvas.on("mouse:dblclick", function (e) {
                var p = e.target;
                if (p.id === 1 || p.id === 999999) {
                    return false;
                }
                else {
                    privateVariables.isEditMode = true;
                    privateVariables.editObjectId = p.id;
                    switch (p.custype.toUpperCase()) {
                        case "GROUP":
                            switch (p.type.toUpperCase()) {
                                case "RECTWITHCORNER":
                                    privateVariables.type = 'STATUS';
                                    $("#txtTitle").val(p.text);
                                    $("#ddlAssign").val(p.assignTo);
                                    $("#ddlEvent").val(p.task);
                                    break;
                                case "POLYGON":
                                    privateVariables.type = 'OUTPUT';
                                    $("#txtTitle").val(p.text);
                                    $("#ddlAssign").val(p.assignTo);
                                    $("#ddlEvent").val(p.task);
                                    break;
                                case "RECTANGLE":
                                    break;
                                case "DIAMOND":
                                    privateVariables.type = 'DECISION';
                                    $("#txtTitle").val(p.text);
                                    $("#ddlAssign").val(p.assignTo);
                                    $("#ddlEvent").val(p.task);
                                    break;
                            }
                            if (privateVariables.isEditMode && privateVariables.editObjectId > 0) {
                                $('#workflow').modal('show');
                            }
                            break;
                    }
                }
            });
        },
        load: function () {
            $.each(ApplicationData.WorkFlowActions, function (k, v) {
                $("#ddlEvent").append('<option value="'+k+'">'+v+'</option>');
            });
            $.each(ApplicationData.WorkFlowAssignment, function (k, v) {
                $("#ddlAssign").append('<option value="' + k + '">' + v + '</option>');
            });
            privateVariables.canvas.setWidth($(".drawbar").innerWidth());
            privateVariables.canvas.setHeight($(".drawbar").innerHeight() - 5);
            privateVariables.canvas.clear();
            if (privateVariables.workFlowId == 0) {
                var s = privateMethods.drawCircle("Start", 10, 10, 1);
            }
            else {
                privateMethods.loadWorkFlowDetail();
            }
        }
    };
    var constructor = {
        WorkFlow: function () {
            privateMethods.load();
            privateMethods.attachevents();
            privateMethods.initiatePlugins();
        }
    };
    constructor.WorkFlow();
}
$(document).ready(function () {
    var main = new WorkFlow();
});