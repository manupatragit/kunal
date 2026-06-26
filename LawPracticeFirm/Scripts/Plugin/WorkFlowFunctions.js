//$('[title!=""]').qtip();

var clickX = new Array();
var clickY = new Array();
var startPoint = new Array(); /*Stores Rectangle start point 0=x, 1=y*/
var endPoint = new Array(); /*Stores Rectangle End point 0=x, 1=y*/
var currentSelection = ""; /*whcih button in toolbar selected - default is pointer */
var clclicksX, clclicksY, clclickeX, clclickeY, clclickiX, clclickiY;
var cline, mcline, fcline;
var activeObjectCopy, activeGroupCopy;
var circle = "";
var rect = "";
var paint;
var canvas;

var drawColor = "#000";
var fillColor = "#eef";
var currentOpacity = 1;

var canvasScale = origcanvasScale = 1;
var SCALE_FACTOR = 1.2;
var linedistance = origlinedistance = 140;
var parentlinedistance = 90;
var scale = 1;
var tempScale = 1;
var ismousedownonobject = false;
var ismousedown = false;

var mouseleft;
var mousetop;
var prevmouseleft = 0;
var prevmousetop = 0;

var selectedObject;
var linkstartObject;
var linkline, linkarrow;
var containerobjects = [];
var dragdataobjtype;

$("#line").click(function () {
    currentSelection = "line";
    setCursor("crosshair");
});

$("#delete").click(function () {
    deleteActObj();
});

function deleteActObj() {
    var actObj = canvas.getActiveObject();

    if (actObj.type == "i-text")
        return;

    if (actObj) {
        canvas.remove(actObj);
        if (actObj.custype == 'shape') {
            if (actObj.startlines)
                actObj.startlines.forEach(function (line) {
                    canvas.remove(line.sp);
                    canvas.remove(line.cp);
                    canvas.remove(line.ep);
                    canvas.remove(line);
                });
            if (actObj.endlines)
                actObj.endlines.forEach(function (line) {
                    canvas.remove(line.sp);
                    canvas.remove(line.cp);
                    canvas.remove(line.ep);
                    canvas.remove(line);
                });
            if (actObj.text)
                canvas.remove(actObj.text);
        }
    }
    selectedObject = "";
    canvas.renderAll();
}

$('html').keyup(function (e) {
    if (e.keyCode == 46) {
        deleteActObj();
    }
});

/*function to manage the mousedown and touchstart event in the canvas*/
function mouseDownTouchStart(mouseX, mouseY) {

    if (currentSelection == "rect") {

        paint = true;
        /*Set Start Point*/
        startPoint[0] = mouseX;
        startPoint[1] = mouseY;
    }

    if (currentSelection == "circle" || currentSelection == "line" || currentSelection == "distance") {

        paint = true;
        startPoint[0] = mouseX;
        startPoint[1] = mouseY;
    }

    if (currentSelection == "rect" || currentSelection == "line" || currentSelection == "circle") {

        selectAllObjects(false);
    }
}

function mouseMoveTouchMove(mouseX, mouseY) {

    if (currentSelection == "rect") {

        if (paint) {
            /*Set Current End point */
            endPoint[0] = mouseX;
            endPoint[1] = mouseY;
            /*draw rectangle to current mouse pointer*/
            drawRect();
        }
    }

    if (currentSelection == "circle") {

        if (paint) {

            endPoint[0] = mouseX;
            endPoint[1] = mouseY;
            /*Draw Circle   */
            drawCircle();
        }
    }

    if (currentSelection == "rect" || currentSelection == "line" || currentSelection == "circle") {

        selectAllObjects(false);
    }
}

/*function to handle mouse up and touchend events on canvas*/
function mouseUpTouchEnd(mouseX, mouseY) {

    if (currentSelection == "rect" || currentSelection == "line" || currentSelection == "circle") {

        paint = false;
        rect = "";
        circle = "";
        line = "";
        distanceline = "";
        /*clear temp data*/
        startPoint = new Array();
        endPoint = new Array();
        currentSelection = "";
    }

    selectAllObjects(true);
}

function selectAllObjects(selectflag) {

    canvas.forEachObject(function (object) {
        if (object.grid || object.cline || object.type == 'triangle') { } else {
            object.selectable = selectflag;
        }
    });
    canvas.renderAll();
}

/*Draw Circle   */
function drawCircle() {

    /*calculate radius of the circle*/

    width = startPoint[0] - endPoint[0];

    height = startPoint[1] - endPoint[1];

    rad = Math.sqrt(width * width + height * height) / 2;

    if (circle != "") {
        canvas.remove(circle);
        canvas.renderAll();
    }

    circle = new fabric.CustomCircle({
        orginX: 'left',
        orginY: 'top',
        radius: rad,
        fill: fillColor,
        stroke: drawColor,
        opacity: currentOpacity,
        hasRotatingPoint: false,
        left: endPoint[0] + width / 2,
        top: endPoint[1] + height / 2,
        originX: "center",
        originY: "center",
        //set id for the object for editing.
        id: canvas.getObjects().length
    });

    circle.custype = 'shape';
    canvas.add(circle);


    circle.setCoords();
    canvas.setActiveObject(circle);
    canvas.renderAll();
}

function drawRect() {

    if (rect != "") {
        canvas.remove(rect);
        canvas.renderAll();
    }
    var width = endPoint[0] - startPoint[0];
    var height = endPoint[1] - startPoint[1];
    var left, top;

    if (width < 0) {
        left = endPoint[0] - width / 2;
        width *= -1;
    } else
        left = startPoint[0] + width / 2;

    if (height < 0) {
        top = endPoint[1] - height / 2;
        height *= -1;
    } else
        top = startPoint[1] + height / 2;

    rect = new fabric.CustomRect({
        orginX: 'left',
        orginY: 'top',
        width: width,
        height: height,
        fill: fillColor,
        stroke: drawColor,
        opacity: currentOpacity,
        hasRotatingPoint: false,
        left: left,
        top: top,
        originX: "center",
        originY: "center",
        //set id for the object for editing.
        id: canvas.getObjects().length
    });
    rect.setCoords();
    rect.custype = 'shape';
    canvas.add(rect);

    canvas.calcOffset();
    canvas.setActiveObject(rect);
    canvas.renderAll();
}

function setCursor(str) {

    canvas.isDrawingMode = false;
    currentCursor = str;

    canvas.defaultCursor = str;
    //canvas.hoverCursor = str;
    canvas.renderAll();
}

function centerObjects() {

    var objs = canvas.getObjects().map(function (o) {
        return o.set('active', true);
    });

    var group = new fabric.Group(objs, {
        originX: 'center',
        originY: 'center'
    });

    canvas._activeObject = null;

    canvas.setActiveGroup(group.setCoords()).renderAll();

    var activeGroup = canvas.getActiveGroup();
    canvas.centerObject(activeGroup);
    canvas.discardActiveGroup();
    canvas.renderAll();

    var objects = canvas.getObjects();
    for (var i in objects) {
        adjustLines(objects[i]);
    }
    canvas.calcOffset();
    canvas.renderAll();
}

// function to link two objects (source and destination)
function linkObjects(linkstartobject, linkendobject, isAddComponents, csy, csx, cey, cex) {

    if (!linkstartobject || !linkendobject)
        return;

    //for connection points
    if (csx == undefined) csx = 1;
    if (csy == undefined) csy = 1;
    if (cex == undefined) cex = 1;
    if (cey == undefined) cey = 1;

    //calculate offset for points
    var osx = 0, osy = 0;
    if (csx == 0)
        osx -= linkstartobject.width / 2;
    if (csx == 2)
        osx += linkstartobject.width / 2;

    if (csy == 0)
        osy -= linkstartobject.height / 2;
    if (csy == 2)
        osy += linkstartobject.height / 2;

    var oex = 0, oey = 0;
    if (cex == 0)
        oex -= linkendobject.width / 2;
    if (cex == 2)
        oex += linkendobject.width / 2;

    if (cey == 0)
        oey -= linkendobject.height / 2;
    if (cey == 2)
        oey += linkendobject.height / 2;

    var x1, y1, x2, y2;

    x1 = linkstartobject.left + osx;
    y1 = linkstartobject.top + osy;
    x2 = linkendobject.left + oex;
    y2 = linkendobject.top + oey;

    //M 100 100 Q 100, 100, 300, 150
    line = new fabric.CustomLine('M ' + x1 + ' ' + y1 + ' Q ' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ', ' + 50, {
        fill: '',
        stroke: 'grey',
        perPixelTargetFind: true,
        strokeWidth: 2,
        lockMovementX: true,
        lockMovementY: true,
        hasBorders: false,
        hasControls: false,
        originX: "center",
        originY: "center",
        id: canvas.getObjects().length
    });

    line.path[0][1] = x1;
    line.path[0][2] = y1;

    line.path[1][1] = x1;
    line.path[1][2] = y2;

    line.path[1][3] = x2;
    line.path[1][4] = y2;

    var centerpt = getQuadraticCurvePoint(line.path[0][1], line.path[0][2], line.path[1][1], line.path[1][2], line.path[1][3], line.path[1][4], 0.5);
    var cp = makecp(centerpt.x, centerpt.y, line);
    canvas.add(cp);

    line.connectionline = true;

    line.conn = linkstartobject.id + "," + linkendobject.id;

    canvas.add(line);

    line.setCoords();
    /**
     DONE
     */
    var arrow = makeArrow(centerpt, line.path[1][3], line.path[1][4], line);
    canvas.add(arrow);
    canvas.bringToFront(arrow);

    var endPoint = makeEndPoint(line.path[0][1], line.path[0][2], line);
    canvas.add(endPoint);
    canvas.bringToFront(endPoint);

    if (linkstartobject.startlines)
        linkstartobject.startlines[linkstartobject.startlines.length] = line;
    else {
        linkstartobject.startlines = new Array();
        linkstartobject.startlines[linkstartobject.startlines.length] = line;
    }

    if (linkendobject)
        if (linkendobject.endlines) {
            linkendobject.endlines[linkendobject.endlines.length] = line;
        } else {
            linkendobject.endlines = new Array();
            linkendobject.endlines[linkendobject.endlines.length] = line;
        }

    line.startobj = linkstartobject;
    line.endobj = linkendobject;

    if (isAddComponents)
        canvas.sendToBack(line);

    canvas.calcOffset();
    canvas.renderAll();

    adjustArrow(line);

    line.csx = csx;
    line.csy = csy;
    line.cex = cex;
    line.cey = cey;

    canvas.renderAll();
    linkstartObject = "";
}

function sendBackLineAndArrows() {
    var canvobjects = canvas.getObjects();
    for (var j in canvobjects) {
        if ((canvobjects[j].type == "CustomLine" || canvobjects[j].type == "triangle") && canvobjects[j].custype != "shape" && canvobjects[j].type != "i-text")
            canvas.sendToBack(canvobjects[j]);
    }
    canvas.renderAll();
}

function createConnLink() {
    linkstartObject = selectedObject;
    if (linkline) return;

    if (linkstartObject) {

        x1 = linkstartObject.left;
        y1 = linkstartObject.top + linkstartObject.height / 2;
        x2 = linkstartObject.left + 2;
        y2 = linkstartObject.top - linkstartObject.height / 2 + 2

        linkline = new fabric.CustomLine('M ' + x1 + ' ' + y1 + ' Q ' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ', ' + 50, {
            fill: '',
            stroke: 'black',
            strokeWidth: 2,
            selectable: false,
            originX: "center",
            originY: "center"
        });

        linkline.path[0][1] = x1;
        linkline.path[0][2] = y1;

        linkline.path[1][1] = x1;
        linkline.path[1][2] = y2;

        linkline.path[1][3] = x2;
        linkline.path[1][4] = y2;

        canvas.add(linkline);
        linkline.setCoords();

        var centerpt = getQuadraticCurvePoint(linkline.path[0][1], linkline.path[0][2], linkline.path[1][1], linkline.path[1][2], linkline.path[1][3], linkline.path[1][4], 0.5);
        linkarrow = makeArrow(centerpt, linkline.path[1][3], linkline.path[1][4], line);

        linkarrow.lockScalingX = linkarrow.lockScalingY = linkarrow.lockRotation = true;

        linkline.ep = linkarrow;
        canvas.add(linkarrow);

        linkarrow.setCoords();

        sendBackLineAndArrows();
        canvas.calcOffset();
        canvas.renderAll();
        adjustArrow(linkline);
        canvas.renderAll();
    }
}

function removeLink() {
    if (linkline) {
        canvas.remove(linkline);
        canvas.remove(linkarrow);
        linkline = "";
        linkarrow = "";
    }
    canvas.renderAll();
}

function getMousePos(mouseevent) {
    var p = canvas.getPointer(mouseevent);
    mouseleft = parseInt(p.x);
    mousetop = parseInt(p.y);
}

//function to adjust connection lines when the source and destination objects are moved.
function adjustLines(p) {

    if (p.startlines)
        for (var i = 0; i < p.startlines.length; i++) {

            curvedline = p.startlines[i];

            curvedline.setCoords();

            //calculate offset for points
            var csx = curvedline.csx, csy = curvedline.csy;
            var osx = 0, osy = 0;
            if (csx == 0)
                osx -= p.width / 2;
            if (csx == 2)
                osx += p.width / 2;

            if (csy == 0)
                osy -= p.height / 2;
            if (csy == 2)
                osy += p.height / 2;

            curvedline.path[0][1] = p.left + osx;

            if (curvedline.path[0][2] <= curvedline.path[1][4])
                curvedline.path[0][2] = p.top + osy;

            if (curvedline.path[0][2] > curvedline.path[1][4])
                curvedline.path[0][2] = p.top + osy;

            curvedline.setCoords();

            var centerpt = getQuadraticCurvePoint(curvedline.path[0][1], curvedline.path[0][2], curvedline.path[1][1], curvedline.path[1][2], curvedline.path[1][3], curvedline.path[1][4], 0.5);
            curvedline.cp.left = centerpt.x;
            curvedline.cp.top = centerpt.y;

            adjustArrow(curvedline);

            //curve = updateDims(curvedline);
            //canvas.add(curve)

            //canvas.remove(curvedline);

            //p.startlines[i] = curve;

        }
    if (p.endlines)
        for (var i = 0; i < p.endlines.length; i++) {
            curvedline = p.endlines[i];

            curvedline.setCoords();

            //calculate offset for points
            var cex = curvedline.cex, cey = curvedline.cey;
            var oex = 0, oey = 0;
            if (cex == 0)
                oex -= p.width / 2;
            if (cex == 2)
                oex += p.width / 2;

            if (cey == 0)
                oey -= p.height / 2;
            if (cey == 2)
                oey += p.height / 2;

            if (curvedline.path[0][2] <= curvedline.path[1][4])
                curvedline.path[1][4] = p.top + oey;

            if (curvedline.path[0][2] > curvedline.path[1][4])
                curvedline.path[1][4] = p.top + oey;

            curvedline.path[1][3] = p.left + oex;

            curvedline.setCoords();

            var centerpt = getQuadraticCurvePoint(curvedline.path[0][1], curvedline.path[0][2], curvedline.path[1][1], curvedline.path[1][2], curvedline.path[1][3], curvedline.path[1][4], 0.5);
            curvedline.cp.left = centerpt.x;
            curvedline.cp.top = centerpt.y;

            adjustArrow(curvedline);
        }

    canvas.renderAll();
}

function createCurve(x1, y1, x2, y2, x3, y3) {

    curve = new fabric.CustomLine('M ' + x1 + ' ' + y1 + ' Q ' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ', ' + 50, {
        fill: '',
        stroke: 'grey',
        perPixelTargetFind: true,
        strokeWidth: 2,
        lockMovementX: true,
        lockMovementY: true,
        hasBorders: false,
        hasControls: false,
    });

    curve.path[0][1] = x1;
    curve.path[0][2] = y1;

    curve.path[1][1] = x2;
    curve.path[1][2] = y2;

    curve.path[1][3] = x3;
    curve.path[1][4] = y3;

    curve.selectable = true;

    curve.setCoords();
    return curve;
}


function updateDims(line) {
    curve = createCurve(line.path[0][1], line.path[0][2], line.path[1][1], line.path[1][2], line.path[1][3], line.path[1][4]);
    curve.sp = line.sp;
    curve.cp = line.cp;
    curve.ep = line.ep;

    curve.sp.line = curve;
    curve.cp.line = curve;
    curve.ep.line = curve;

    curve.startobj = line.startobj;
    curve.endobj = line.endobj;

    curve.csx = line.csx;
    curve.csy = line.csy;
    curve.cex = line.cex;
    curve.cey = line.cey;

    canvas.calcOffset();
    canvas.renderAll();
    return curve;
}

//function to adjust arrows when the source and destination objects are moved.
function adjustArrow(line) {

    line.setCoords();

    if (line.ep) {
        var arrowpt = getQuadraticCurvePoint(line.path[0][1], line.path[0][2], line.path[1][1], line.path[1][2], line.path[1][3], line.path[1][4], 0.99);

        line.ep.left = arrowpt.x;
        line.ep.top = arrowpt.y;

        var dx = line.path[1][3] - arrowpt.x;
        var dy = line.path[1][4] - arrowpt.y;

        var angle = Math.atan2(dy, dx) * 180 / Math.PI;
        line.ep.setAngle(angle + 90);

        line.ep.setCoords();
    }

    if (line.sp) {
        line.sp.left = line.path[0][1];
        line.sp.top = line.path[0][2];
        line.sp.setCoords();
    }

    adjustcp(line);
}

//function to adjust cp when the source and destination objects are moved.
function adjustcp(line) {

    line.setCoords();

    if (line.cp) {

        var pt = getQuadraticCurvePoint(line.path[0][1], line.path[0][2], line.path[1][1], line.path[1][2], line.path[1][3], line.path[1][4], 0.5);
        line.cp.left = pt.x;
        line.cp.top = pt.y;
        line.cp.setCoords();
    }
}

function addText() {
    var iText = new fabric.IText('Type name', {
        left: 100,
        top: 100,
        fontSize: 15
    });

    canvas.add(iText);
    canvas.bringToFront(iText);
}

function saveOrgChart() {

    selectAllObjects(true);

    canvas.deactivateAll().renderAll();

    var jsonCanvas = canvas.toDatalessJSON();
    var jsonData = JSON.stringify(jsonCanvas);

    $("#savestus").html(" Saving...");
    //$.ajax({  async: true, 
    //    url: "saveorgchart.php",
    //    type: "post",
    //    data: "json=" + encodeURIComponent(jsonData),
    //    success: function (msg) {
    //        if (msg == "error") {
    //            $("#savestus").html(" Not Saved...");
    //            alert("Error saving Org Chart. Please try again.");
    //        } else {
    //            $("#savestus").html(" Saved...");
    //            alert("Org Chart saved successfully.");
    //        }
    //        $("#savestus").html("");
    //    },
    //    error: function (jqXHR, textStatus, errorThrown) {

    //        switch (jqXHR.status) {
    //            case 400:
    //                var excp = $.parseJSON(jqXHR.responseText).error;
    //                //console.log("UnableToComplyException:" + excp.message, 'warning');
    //                break;
    //            case 500:
    //                var excp = $.parseJSON(jqXHR.responseText).error;
    //                //console.log("PanicException:" + excp.message, 'panic');
    //                break;
    //            default:
    //                //console.log("HTTP status=" + jqXHR.status + "," + textStatus + "," + errorThrown + "," + jqXHR.responseText);
    //        }

    //    }
    //});
}

function createCustomBox(left, top, objtype, object, color) {

    var options = new Object();
    options.width = 100;
    options.height = 80;

    options.left = left;
    options.top = top;

    options.strokeWidth = 2;

    options.fill = color;

    options.stroke = drawColor;
    options.opacity = currentOpacity;
    options.hasRotatingPoint = false;
    object.perPixelTargetFind = true;

    options.originX = 'center';
    options.originY = 'center';

    //options.id = canvas.getObjects().length;
    options.id = objtype + object.id;

    options.custype = 'shape';

    var box = new fabric.CustomRect(options);

    canvas.add(box);
    box.setCoords();

    var label = new fabric.IText(object.label, {
        left: left,
        top: top,
        originX: 'center',
        originY: 'center',
        fontSize: 15,
        selectable: false,
        lockMovementX: true,
        lockMovementY: true,
        hasRotatingPoint: false
    });

    canvas.add(label);
    box.text = label;
    label.shape = box;
    label.setCoords();

    canvas.bringToFront(label);
    canvas.calcOffset();
    canvas.renderAll();
}

var x = 150, y = 100;
//function loadcampaign() {
//    $.ajax({  async: true, 
//        url: "getcampaigndata.php",
//        type: "get",
//        success: function (data) {
//            //console.log(data)

//            if (data != "empty") {

//                var linkArray = [];
//                var jsonArr = $.parseJSON(data);
//                for (var i = 0; i < jsonArr.result.length; i++) {

//                    var object = jsonArr.result[i];
//                    if (object.sources) {
//                        y = 50;
//                        for (var j = 0; j < object.sources.length; j++) {
//                            createCustomBox(x * (j + 1), y, "Sources", object.sources[j], "yellow");
//                            if (object.sources[j].con) {
//                                linkArray[linkArray.length] = "Sources" + object.sources[j].id + "," + "Campaign" + object.sources[j].con;
//                            }
//                        }
//                    }
//                    if (object.campaign) {
//                        y = 200;
//                        for (var j = 0; j < object.campaign.length; j++) {
//                            createCustomBox(x * (j + 1), y, "Campaign", object.campaign[j], "#6495ED");
//                        }
//                    }
//                    if (object.targets) {
//                        y = 350;
//                        for (var j = 0; j < object.targets.length; j++) {
//                            createCustomBox(x * (j + 1), y, "Targets", object.targets[j], "grey");
//                        }
//                    }
//                    if (object.editions) {
//                        y = 500;
//                        for (var j = 0; j < object.editions.length; j++) {
//                            if (object.editions[j].level)
//                                y = 400 + (parseInt(object.editions[j].level) * 100);
//                            else
//                                y = 500;

//                            createCustomBox(x * (j + 1), y, "Editions", object.editions[j], "green");
//                            if (object.editions[j].scon) {
//                                linkArray[linkArray.length] = "Sources" + object.editions[j].scon + "," + "Editions" + object.editions[j].id;
//                            }
//                            if (object.editions[j].tcon) {
//                                linkArray[linkArray.length] = "Editions" + object.editions[j].id + "," + "Targets" + object.editions[j].tcon;
//                            }
//                        }
//                    }
//                }

//                canvas.calcOffset();
//                canvas.renderAll();

//                linkArray.forEach(function (link) {

//                    link = link.split(",");
//                    var startobj = findObjById(link[0]);
//                    var endobj = findObjById(link[1]);
//                    linkObjects(startobj, endobj, true, 2, 1, 0, 1);
//                });
//            }
//        },
//        error: function (jqXHR, textStatus, errorThrown) {
//            switch (jqXHR.status) {
//                case 400:
//                    var excp = $.parseJSON(jqXHR.responseText).error;
//                    //console.log("UnableToComplyException:" + excp.message, 'warning');
//                    break;
//                case 500:
//                    var excp = $.parseJSON(jqXHR.responseText).error;
//                    //console.log("PanicException:" + excp.message, 'panic');
//                    break;
//                default:
//                    //console.log("HTTP status=" + jqXHR.status + "," + textStatus + "," + errorThrown + "," + jqXHR.responseText);
//            }

//        }
//    });
//}

//loadcampaign();


function findObjById(objid) {
    var canobj = canvas.getObjects().filter(function (o) {
        return o.id == objid;
    });
    return canobj[0];
}

function dropDragObject(left, top) {

    if (dragdataobjtype) {
        var object = new Object();
        object.width = 100;
        object.height = 80;

        object.left = left;
        object.top = top;

        if (dragdataobjtype == 'Sources')
            object.fill = 'yellow';
        else
            object.fill = 'green';

        object.stroke = drawColor;
        object.opacity = currentOpacity;
        object.hasRotatingPoint = false;

        object.originX = 'center';
        object.originY = 'center';

        object.id = canvas.getObjects().length;

        object.custype = 'shape';

        var customrect = new fabric.CustomRect(object);

        canvas.add(customrect);

        canvas.calcOffset();
        canvas.setActiveObject(customrect);
        canvas.renderAll();

        var iText = new fabric.IText(dragdataobjtype, {
            left: left,
            top: top,
            originX: 'center',
            originY: 'center',
            fontSize: 15,
            lockMovementX: true,
            lockMovementY: true,
            hasRotatingPoint: false
        });

        canvas.add(iText);
        customrect.text = iText;
        iText.shape = customrect;
        canvas.bringToFront(iText);
    }
    dragdataobjtype = "";
}

function makecp(left, top, line) {
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
}

function makeEndPoint(left, top, line) {
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

    c.name = 'sp';

    c.line = line;
    line.sp = c;

    return c;
}

function makeArrow(centerpt, left, top, line) {
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

    var angle = Math.atan2(dy, dx) * 180 / Math.PI;
    c.setAngle(angle + 90);

    c.setCoords();

    c.name = 'ep';
    line.ep = c;
    c.line = line;

    return c;
}

function _getQBezierValue(t, p1, p2, p3) {
    var iT = 1 - t;
    return iT * iT * p1 + 2 * iT * t * p2 + t * t * p3;
}

function getQuadraticCurvePoint(startX, startY, cpX, cpY, endX, endY, position) {
    return {
        x: _getQBezierValue(position, startX, cpX, endX),
        y: _getQBezierValue(position, startY, cpY, endY)
    };
}

function closePopup(className) {
    var annotpopup = document.getElementsByClassName(className);
    annotpopup[0].style.opacity = 0;
    annotpopup[0].style.left = "-500px";
    annotpopup[0].style.top = "-500px";
}


/**************************************************************************/
canvas.observe("after:render", function () {
    canvas.calcOffset();
});

var preselectobj;
canvas.observe('object:selected', function (e) {

    selectedObject = e.target;

    if (e.target.line) {
        e.target.line.stroke = 'red';
        e.target.line.sp.stroke = 'red';
        e.target.line.cp.stroke = 'red';
        e.target.line.ep.stroke = 'red';
    }
    if (preselectobj && preselectobj.line) {
        preselectobj.line.stroke = 'grey';
        preselectobj.line.sp.stroke = 'grey';
        preselectobj.line.cp.stroke = 'grey';
        preselectobj.line.ep.stroke = 'grey';
    }
    preselectobj = selectedObject;
    canvas.renderAll();
    /*var p = e.target;
    if(p.startlines) {
        for (var i = 0; i < p.startlines.length; i++) {
            curvedline = p.startlines[i];
            curvedline.cp.animate('opacity', '1', {
                duration: 200,
                onChange: canvas.renderAll.bind(canvas),
            });
            curvedline.cp.selectable = false;
        }
    }
    if(p.endlines) {
        for (var i = 0; i < p.endlines.length; i++) {
            curvedline = p.endlines[i];
            curvedline.cp.animate('opacity', '1', {
                duration: 200,
                onChange: canvas.renderAll.bind(canvas),
            });
            curvedline.cp.selectable = false;
        }
    }*/
});

canvas.observe('object:modified', function (e) {

    closePopup('annotorious-editor');

    adjustLines(e.target);

    if (e.target.type == 'i-text' && e.target.shape) {
        e.target.shape.left = e.target.left;
        e.target.shape.top = e.target.top;
        e.target.shape.setCoords();
    }
    if (e.target.custype == 'shape' && e.target.text) {
        e.target.text.left = e.target.left;
        e.target.text.top = e.target.top;
        e.target.text.setCoords();
    }

    if (e.target && (e.target.name == "sp" || e.target.name == "ep")) {
        if (e.target.intersectobj) {
            obj = e.target.intersectobj;
            if (e.target.name == "sp") {

                var tempstartlines = [];
                if (e.target.line.startobj) {

                    e.target.line.startobj.startlines.forEach(function (line) {
                        if (line.id != e.target.line.id)
                            tempstartlines.push(line);
                    });
                    e.target.line.startobj.startlines = tempstartlines;
                }

                if (obj.startlines)
                    obj.startlines[obj.startlines.length] = e.target.line;
                else {
                    obj.startlines = new Array();
                    obj.startlines[obj.startlines.length] = e.target.line;
                }

                e.target.line.startobj = obj;

                if (e.target.left < obj.left)
                    e.target.line.csx = 0;
                if (e.target.left > obj.left - 10 && e.target.left < obj.left + 10)
                    e.target.line.csx = 1;
                if (e.target.left > obj.left)
                    e.target.line.csx = 2;

                if (e.target.top < obj.top)
                    e.target.line.csy = 0;
                if (e.target.top > obj.top - 10 && e.target.top < obj.top + 10)
                    e.target.line.csy = 1;
                if (e.target.top > obj.top)
                    e.target.line.csy = 2;
            }
            if (e.target.name == "ep") {

                var tempstartlines = [];
                if (e.target.line.endobj) {
                    e.target.line.endobj.endlines.forEach(function (line) {
                        if (line.id != e.target.line.id)
                            tempstartlines.push(line);
                    });

                    e.target.line.endobj.endlines = tempstartlines;
                }

                if (obj.endlines)
                    obj.endlines[obj.endlines.length] = e.target.line;
                else {
                    obj.endlines = new Array();
                    obj.endlines[obj.endlines.length] = e.target.line;
                }

                e.target.line.endobj = obj;

                if (e.target.left < obj.left)
                    e.target.line.cex = 0;
                if (e.target.left > obj.left - 10 && e.target.left < obj.left + 10)
                    e.target.line.cex = 1;
                if (e.target.left > obj.left)
                    e.target.line.cex = 2;

                if (e.target.top < obj.top)
                    e.target.line.cey = 0;
                if (e.target.top > obj.top - 10 && e.target.top < obj.top + 10)
                    e.target.line.cey = 1;
                if (e.target.top > obj.top)
                    e.target.line.cey = 2;
            }
        }
    }
    canvas.renderAll();
});

canvas.observe('object:moving', function (e) {

    closePopup('annotorious-editor');

    e.target.setCoords();

    if (e.target.name == 'sp' || e.target.name == 'ep') {
        canvas.bringToFront(e.target.line);
        canvas.bringToFront(e.target);

        var curvedline = e.target.line;
        if (e.target.name == 'ep') {
            curvedline.path[1][3] = e.target.left;
            curvedline.path[1][4] = e.target.top;
        }
        if (e.target.name == 'sp') {
            curvedline.path[0][1] = e.target.left;
            curvedline.path[0][2] = e.target.top;
        }
        curvedline.setCoords();

        /*curvedline.cp.animate('opacity', '0', {
            duration: 10,
            onChange: canvas.renderAll.bind(canvas),
        });*/

        adjustArrow(curvedline);

    }

    if (e.target.name == "cp") {
        var p = e.target;

        curvedline = p.line;

        if (curvedline) {

            curvedline.path[1][1] = p.left;
            curvedline.path[1][2] = p.top;
            curvedline.setCoords();

            adjustArrow(curvedline);
        }
    } else
        adjustLines(e.target);

    if (e.target.type == 'i-text') {
        canvas.bringToFront(e.target);
    }

    if (e.target.custype == 'shape' && e.target.text) {
        e.target.text.left = e.target.left;
        e.target.text.top = e.target.top;
        e.target.text.setCoords();
    }

    canvas.forEachObject(function (obj) {
        if (obj === e.target) return;
        if (e.target.intersectsWithObject(obj) && obj.type == 'CustomRect') {
            e.target.intersectobj = obj;
            e.target.intersectid = obj.id;
        }
    });

    canvas.renderAll();
});

canvas.observe("mouse:move", function (e) {
    canvas.calcOffset();

    var pointer = canvas.getPointer(event.e);
    var mouseX = pointer.x;
    var mouseY = pointer.y;
    mouseMoveTouchMove(mouseX, mouseY);

    if (e.target)
        e.target.setCoords();

    if (ismousedownonobject && currentSelection == "line") {
        createConnLink();
        ismousedownonobject = false;
    }

    getMousePos(e.e);

    if (linkline) {

        linkline.path[1][2] = mousetop;

        linkline.path[1][3] = mouseleft;
        linkline.path[1][4] = mousetop;

        linkline.setCoords();

        if (linkarrow) {
            adjustArrow(linkline);
            linkarrow.setCoords();
        }
    }

    var p = canvas.getPointer(e.e);
    if (ismousedown && !paint) {

        canvas.forEachObject(function (obj) {
            if (prevmouseleft && obj.type != "CustomLine") {
                obj.left += p.x - prevmouseleft;
                obj.top += p.y - prevmousetop;
                obj.setCoords();
            }
            if (prevmouseleft && obj.type == "CustomLine") {
                obj.path[0][1] += p.x - prevmouseleft;
                obj.path[0][2] += p.y - prevmousetop;
                obj.path[1][1] += p.x - prevmouseleft;
                obj.path[1][2] += p.y - prevmousetop;
                obj.path[1][3] += p.x - prevmouseleft;
                obj.path[1][4] += p.y - prevmousetop;
                obj.setCoords();
            }
        });

        prevmouseleft = p.x;
        prevmousetop = p.y;
    }
    canvas.renderAll();
});

canvas.observe("mouse:down", function (e) {
    canvas.calcOffset();
    var pointer = canvas.getPointer(event.e);
    var mouseX = pointer.x;
    var mouseY = pointer.y;
    mouseDownTouchStart(mouseX, mouseY);

    if (e.target && e.target.custype == "shape") {
        e.target.setCoords();
        ismousedownonobject = true;
    } else if (!e.target)
        ismousedown = true;
});

canvas.observe("mouse:up", function (e) {
    if (e.target)
        e.target.setCoords();

    canvas.calcOffset();
    var pointer = canvas.getPointer(event.e);
    var mouseX = pointer.x;
    var mouseY = pointer.y;
    mouseUpTouchEnd(mouseX, mouseY);

    if (e.target && e.target.type == "CustomLine") {
        linkstartObject = "";
        removeLink();
        linkstartObject = "";
    }
    if (e.target && e.target.custype == "shape" && linkline) {
        linkObjects(linkstartObject, e.target, true);
        removeLink();
        linkstartObject = "";
    }

    if (!e.target) {
        linkstartObject = "";
        removeLink();
        linkstartObject = "";
    }

    ismousedown = false;
    ismousedownonobject = false;
    prevmouseleft = "";
});

canvas.observe("before:selection:cleared", function (e) {
    var p = e.target;

    /*if(p.startlines) {
        for (var i = 0; i < p.startlines.length; i++) {
            curvedline = p.startlines[i];
            curvedline.cp.animate('opacity', '0', {
                duration: 200,
                onChange: canvas.renderAll.bind(canvas),
            });
            curvedline.cp.selectable = false;
        }
    }

    if(p.endlines) {
        for (var i = 0; i < p.endlines.length; i++) {
            curvedline = p.endlines[i];
            curvedline.cp.animate('opacity', '0', {
                duration: 200,
                onChange: canvas.renderAll.bind(canvas),
            });
            curvedline.cp.selectable = false;
        }
    }*/
});

$('#drawingCanvas').on("dblclick", function (e) {

    p = selectedObject;
    if (p && p.type == 'CustomRect') {
        setTimeout(function () {
            document.getElementsByClassName('annotorious-editor')[0].style.opacity = 1;
            document.getElementsByClassName('annotorious-editor')[0].style.left = 100 + p.left + p.width + "px";
            document.getElementsByClassName('annotorious-editor')[0].style.top = 50 + p.height / 2 + p.top + "px";
        }, 100);
    }
});


