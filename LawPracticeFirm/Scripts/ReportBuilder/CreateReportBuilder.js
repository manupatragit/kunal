$(document).ready(function () {
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    var fcode = localStorage.getItem("FirmCode");
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
    droppedItems1 = [];
    currentDraggedItem1 = [];
    FinalSelectedColumnGroupByList = [];
    OperatorArray = [];
    FilterOperatorList = [];
    FilterNames = [];
    droppedItems = [];
    droppedItemsFinal = [];
    FinalSelectedValueList = [];
    FilterSelectMenu = [];
    droppedItemsOrderBy = [];
    droppedItems1Temp = [];
    droppedItemsOrderByTemp = [];
    ColumnGroupByList = [];
    SelectedColumnGroupByList = [];
    ColumnArray = [];
    openload();
    BindModules();
    ColumnNames = [ ];
    FilterNames = [];
    FilterSelectMenu = [];
   // BindColumnGroupByOperatorNames();
    BindGroupByOperator();
    function handleDragStart(ev, ui) {
    }
    function handleDragDrag(ev, ui) { }
    function handleDragStop(ev, ui) {
        //  alert(JSON.stringify(ColumnNames));
    }
    $("#DropColumnArea").sortable({
        revert: true,
        placeholder: "ui-state-highlight",
        start: function (event, ui) {
            ui.placeholder.css("visibility", "visible");
            ui.placeholder.css("background-color", "#f5fcff!important");
            ui.placeholder.css("width", "150px");
            ui.placeholder.css("height", "auto");
            ui.placeholder.css("list-style-type", "none");
            var start_pos = ui.item.index();
            ui.item.data('start_pos', start_pos);
        },
        update: function (event, ui) {
            var start_pos = ui.item.data('start_pos');
            var end_pos = ui.item.index();
            var productOrder = $(this).sortable('toArray').toString();
            //alert(productOrder);
            droppedItems1Temp = [];
            $('#DropColumnArea > li').map(function () {
                var datakeyvalue = droppedItems1.filter(x => x.Id == this.id);
                console.log(JSON.stringify(datakeyvalue))
                droppedItems1Temp.push({
                    "Id": datakeyvalue[0].Id,
                    "ColumnName": datakeyvalue[0].ColumnName,
                    "LabelName": datakeyvalue[0].LabelName
                });
            });
            droppedItems1 = [];
            droppedItems1 = droppedItems1Temp;
            droppedItems1Temp = [];
            console.log("rtret8989" + JSON.stringify(droppedItems1));
        }
    }).disableSelection();
    $("#DropOrderByArea").sortable({
        revert: false,
        forcePlaceholderSize: true,
        start: function (event, ui) {
            var start_pos = ui.item.index();
            ui.item.data('start_pos', start_pos);
        },
        update: function (event, ui) {
            console.log(event)
            var start_pos = ui.item.data('start_pos');
            var end_pos = ui.item.index();
            droppedItemsOrderByTemp = [];
            $('#DropOrderByArea > ul').map(function () {
                var ids = String(this.id).replace(/\D/g, '');
                var datakeyvalue = droppedItemsOrderBy.filter(x => x.Id == ids);
                console.log(JSON.stringify(datakeyvalue))
                droppedItemsOrderByTemp.push({
                    "Id": datakeyvalue[0].Id,
                    "ColumnName": datakeyvalue[0].ColumnName,
                    "LabelName": datakeyvalue[0].LabelName,
                    "OrderBy": datakeyvalue[0].OrderBy
                });
            });
            droppedItemsOrderBy = [];
            droppedItemsOrderBy = droppedItemsOrderByTemp;
            droppedItemsOrderByTemp = [];
            console.log("rr43354656" + JSON.stringify(droppedItemsOrderBy));
        }
    }).disableSelection();
    $("#DroppableAreaColumn").droppable({
        connectToSortable: "#DropColumnArea",
        accept: ".draggableColumn",
        opacity: 0.7,
        helper: "clone",
        hoverClass: "droppable-active",
        axis: "y",
        drop: function (event, ui) {
            dropped = true;
            $(event.target).addClass('dropped');
            console.log(ui);
            var ev = ui.draggable[0].attributes.dragdata.value;
            var e = JSON.parse(ev);
            var datakeyvalue = droppedItems1.filter(x => x.Id == e.Id);
            if (String(datakeyvalue) != "") {
                return false;
            }
            //end exist
            currentDraggedItem1 = e;
            droppedItems1.push(e);
            console.log("droppedItems1" + JSON.stringify(droppedItems1));
            BindDropColumn(droppedItems1.find(x => x.Id == e.Id));
        }
    });
    $("#DroppableOrderBy").droppable({
        //connectToSortable: "#DropOrderByArea",
        accept: ".draggableColumn",
        helper: "clone",
        hoverClass: "droppable-active",
        drop: function (event, ui) {
            var ev = ui.draggable[0].attributes.dragdata.value;
            var e = JSON.parse(ev);
            console.log(e);
            var datakeyvalue = droppedItemsOrderBy.find(x => x.Id == e.Id);
            if (String(datakeyvalue) != "undefined") {
                return false;
            }
            //end exist
            currentDraggedItem1 = e;
            droppedItemsOrderBy.push({
                "Id": e.Id,
                "ColumnName": e.ColumnName,
                "LabelName": e.LabelName,
                "OrderBy": "ASC"
            });
            console.log("rr433" + JSON.stringify(droppedItemsOrderBy));
            BindDropGroupBy(droppedItemsOrderBy.find(x => x.Id == e.Id));
        }
    });
    $("#DroppableAreaFilter").droppable({
        connectToSortable: "#DropFilterArea",
        accept: ".draggableFilter",
        helper: "clone",
        hoverClass: "droppable-active",
        drop: function (event, ui) {
            var ev = ui.draggable[0].attributes.dragdata.value;
            var e = JSON.parse(ev);
            //check exist
            var datakeyvalue = droppedItemsFinal.find(x => x.Id == e.Id);
            if (String(datakeyvalue) != "undefined") {
                return false;
            }
            //end exist
            var lengthbinddropped = droppedItems.length;
            FilterOperatorList[lengthbinddropped] = OperatorArray.find(x => x.Index == e.Id);
            currentDraggedItem = e;
            droppedItems.push(e);
            droppedItemsFinal.push(e);
            BindColumnGroupByOperatorNames(e.FilterName,e.Id);
            FinalSelectedValueList.push({
                'Filtername': e.FilterName,
                'FilterLabel': e.FilterLabelName,
                'Operator': '',
                'Value1': '',
                'Value2': '',
                'Id': e.Id,
                'ValueType1': '',
                'ValueType2': ''
            });
            console.log("droppedItems" + JSON.stringify(droppedItems));
            BindDropFilter(droppedItems);
            BindFilterOperatorList(e.Id, FilterOperatorList[lengthbinddropped]);
            BindFilterSelectMenu(e.FilterName, e.Id);
            droppedItems = [];
        }
    });
    function BindDropGroupBy(data) {
        var columnsmenu = "";
        columnsmenu += `<ul  style="margin-bottom: 5px;" id="GroupDiv` + data.Id + `" >
                            <li id="` + data.Id + `" class="list-group-item list-group-item-action list-group-item-default">
                            <span style="float: left;">` + data.LabelName + `</span>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="float: right;cursor: pointer;margin-right: 10px;"
                            id="removeItemColumnOrderBy" data-id="` + data.Id + `">X</span>
                            </li>
                            <li class="list-group-item list-group-item-action list-group-item-default">
                            <input type="radio" data-id="` + data.Id + `"  id="UpdateOrder" value="ASC" checked
                            name="orderby` + data.Id + `" style="float: left;cursor: pointer;margin-right: 10px;" />
                            <span style="font-size: 12px;"> <img src="/assets/img/ascorder.png" /> </span>
                            &nbsp;&nbsp;
                            <input type="radio"  id="UpdateOrder" data-id="` + data.Id + `"  value="DESC" name="orderby` + data.Id + `"
                            style="cursor: pointer;" />
                            &nbsp;&nbsp;
                            <span style="font-size: 12px;">  <img src="/assets/img/descorder.png" /> </span>
                            </li>
                            </ul>`;
        $("#DropOrderByArea").append(columnsmenu);
    }
    $(document).on('click', '#removeItemColumnOrderBy', function (e) {
        var Id = $(this).attr("data-id");
        Id = parseInt(Id);
        let index = droppedItemsOrderBy.map(function (e) {
            return e.Id
        }).indexOf(Id);
        droppedItemsOrderBy.splice(index, 1);
        $("#GroupDiv" + Id).remove();
        console.log("gb" + JSON.stringify(droppedItemsOrderBy));
    });
    function BindDropFilter(data) {
        var columnsmenu = "";
        for (var t = 0; t < data.length; t++) {
            columnsmenu += "<div  style='padding-top:5px; padding-bottom:5px;margin-top:5px;background-color:#f1f1f1;'  id='FilterDiv" + data[t].Id + "'>";
            columnsmenu += "<div class='col-sm-2'>";
            columnsmenu += "" + data[t].FilterLabelName + "";
            columnsmenu += "</div>";
            columnsmenu += "<div class='col-sm-3'>";
            columnsmenu += `<select  style="width: 130px;background:white;" data-ControlDispType="` + data[t].ControlDispType + `" data-id="` + data[t].Id + `"  id="OperatorChange` + data[t].Id + `" class="OperatorChange">
                        <option value="">Select</option>
                      </select>`;
            columnsmenu += "</div>";
            if (data[t].ControlDispType == 'select') {
                columnsmenu += "<div class='col-sm-3'>";
                columnsmenu += ` <select class="BindSelect" data-ControlDispType="` + data[t].ControlDispType + `" data-id="` + data[t].Id + `"
                        Id="BindSelect` + data[t].Id + `" style="width: 150px;background:white;">
                        <option value="">Select ` + data[t].FilterLabelName + `</option></select>`;
                columnsmenu += "</div>";
            }
            if (data[t].ControlDispType == 'date') {
                columnsmenu += "<div class='col-sm-3'>";
                columnsmenu += `<input style="width: 150px;height:23px !important" data-ControlDispType="` + data[t].ControlDispType + `" data-id="` + data[t].Id + `"
                        Id="ValueChange1" type="` + data[t].ControlDispType + `" class="form-control">`;
                columnsmenu += "</div>";
            }
            if (data[t].ControlDispType == 'number') {
                columnsmenu += "<div class='col-sm-3'>";
                columnsmenu += `<input  style="width:150px;height:23px !important" data-ControlDispType="` + data[t].ControlDispType + `" data-id="` + data[t].Id + `"
                        Id="ValueChange1"  type="` + data[t].ControlDispType + `" class="form-control" > `;
                columnsmenu += "</div>";
            }
            if (data[t].ControlDispType == 'text') {
                columnsmenu += "<div class='col-sm-3'>";
                columnsmenu += `<input style="width:150px;height:23px !important"
                       data-ControlDispType="` + data[t].ControlDispType + `" data-id="` + data[t].Id + `"
                        Id="ValueChange1" type="` + data[t].ControlDispType + `" class="form-control">`;
                columnsmenu += "</div>";
            }
            columnsmenu += "<div class='col-sm-3' id='RangeBox" + data[t].Id + "'>";
            columnsmenu += "</div>";
            columnsmenu += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style='cursor: pointer;margin-right:10px;' Id='removeItemFilter' data-id='" + data[t].Id + "' > X</span > ";
            columnsmenu += "</div>";
        }
        $("#DropFilterArea").append(columnsmenu);
    }
    function BindDropColumn(data) {
        var columnsmenu = "";
        columnsmenu += "<li style='margin-right:10px;height:34px !Important'  id=" + data.Id + " class='list-group-item '>" + data.LabelName + "";
        columnsmenu += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style='float: right; cursor: pointer; margin - right: 10px;' Id='removeItemColumn' data-id='" + data.Id + "' data-column='" + data.ColumnName + "'> X</span > ";
        columnsmenu += ` &nbsp;<img style="cursor: pointer;    height: 18px;color: #4e94db;"
             id="openGroupByModal" data-id="` + data.Id + `"  data-ColumnDataType="` + data.ColumnDataType + `" data-LabelName="` + data.LabelName + `"  data-ColumnName="` + data.ColumnName + `"
                          title="Add Group By Filter"
                          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABmJLR0QA/wD/AP+gvaeTAAABuElEQVQ4jb2VP0xTURjFz7m3pOHPwmQciAlCE1fpG1j8E3AgYa0DYZbSkdU4uRsXtXYyUQdrYsLiZKJhYXjFRabXKoMTBOgiqba97zgYzHuE1z4a4CRv+L578/vOu/ckF7gg8WSjUJX90Qym5exoKoB1R5Pjufr7+3SJ4NknP4c7I783AOTPZE/yh1rDtzfXJlrHLRNd74y0754ZCgCk1xn7cyfaioHFMNXvnyZJY4ng81QmNsVpC9asDAKiC7fOx1K/QdHCKwe3JPNoIBDDx34xt3Fcx44iJK8Qmh8EHJKVaH1hl3c5qRhADkCdxBGpZiLYSLuS+ZSGSMq5kA+/lqYuJ2b/B0cL73kwCWt6pkLSbq04vV6oyu40G08pffaLuQ8n98XjZjlD6WUPF3sQ5wpV2Z3DxisAyxIPAPQG95dZqq1e3+aL+lsQSwBAg8V8ObgaMyBTix1FvtJYQKiPSdhuNjPuWoZZ097rY2o/luOhX9kvkPyk3Zl2t/StdK1JcBlA9589vKbRvegnmpnY1M21iVahqtmkp4lWgkSffOeVGxD0BsB3/0EuVURTy6sE8zefBTdOW/sLnuekEHpBa3EAAAAASUVORK5CYII=">
                        &nbsp; &nbsp;`;
        columnsmenu += "</li>";
        $("#DropColumnArea").append(columnsmenu);
    }
    function BindColumn() {
        var dataobj =
        {
            moduleid: $("#Modules").val(),
        };
        $("#bindColumnDiv").empty();
        var json = JSON.stringify(dataobj);
        var rt2 = $.ajax({
            async: true,
            url: '/api/ReportBuilderApi/ColumnListForReport',
            data: json,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            success: function (response) {
                var columnsmenu = "";
                var obj = JSON.parse(response.Data);
                ColumnNames = obj;
                for (var t = 0; t < ColumnNames.length; t++) {
                    columnsmenu += "<li   dragData='" + JSON.stringify(ColumnNames[t]) + "' class='list-group-item list-group-item-action list-group-item-default draggable draggableColumn '>" + ColumnNames[t].LabelName + "</li>";
                }
                $("#bindColumnDiv").html(columnsmenu);
                closeload();
            },
            error: function (response) {
                alert(response.responseText);
                closeload();
            }
        });
        $.when(rt2).then(function (data, textStatus, jqXHR) {
            $(".draggable").draggable({
                drag: handleDragDrag,
                start: handleDragStart,
                stop: handleDragStop,
                appendTo: "body",
                helper: "clone",
                revert: true,
                revertDuration: 0
            });
        });
    }
    function BindFilter() {
        var filtermenu = "";
        for (var t = 0; t < FilterNames.length; t++) {
            filtermenu += "<li draggable dragData='" + JSON.stringify(FilterNames[t]) + "' class='list-group-item list-group-item-action list-group-item-default  draggable draggableFilter'>" + FilterNames[t].FilterLabelName + "</li>";
        }
        $("#bindFilterDiv").html(filtermenu);
        var dataobj =
        {
            moduleid: $("#Modules").val(),
        };
        $("#bindFilterDiv").empty();
        var json = JSON.stringify(dataobj);
        var rt1 = $.ajax({
            async: true,
            url: '/api/ReportBuilderApi/FilterListForReport',
            data: json,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            success: function (response) {
                var filtermenu = "";
                var obj = JSON.parse(response.Data);
                FilterNames = obj;
                for (var t = 0; t < FilterNames.length; t++) {
                    filtermenu += "<li draggable dragData='" + JSON.stringify(FilterNames[t]) + "' class='list-group-item list-group-item-action list-group-item-default  draggable draggableFilter'>" + FilterNames[t].FilterLabelName + "</li>";
                }
                $("#bindFilterDiv").html(filtermenu);
            },
            error: function (response) {
                alert(response.responseText);
                closeload();
            }
        });
        $.when(rt1).then(function (data, textStatus, jqXHR) {
            BindOperator();
            BindColumn();
        });
    }
    $(document).on('click', '#removeItemColumn', function (e) {
        var Id = $(this).attr("data-id");
        var ColumnName = $(this).attr("data-column");
        Id = parseInt(Id);
        let index = droppedItems1.map(function (e) {
            return e.Id
        }).indexOf(Id);
        droppedItems1.splice(index, 1);
        $("#" + Id).remove();
        //BindDropColumn(droppedItems1);
        //remove groupBy if column remove
        //check exist or not
        var resultsetdata = FinalSelectedColumnGroupByList.filter(x => x.ColumnName == ColumnName);
        if (resultsetdata != null) {
            for (var i = 0; i < resultsetdata.length; i++) {
                var Ids = parseInt(resultsetdata[i].ColumnId);
                let index1 = FinalSelectedColumnGroupByList.map(function (e) {
                    return e.ColumnId
                }).indexOf(Ids);
                FinalSelectedColumnGroupByList.splice(index1, 1);
            }
        }
    });
    function BindOperator() {
        OperatorArray = [];
        for (var i = 0; i < FilterNames.length; i++) {
            var item = FilterNames[i].Operator;
            OperatorArray.push({
                'Index': FilterNames[i].Id,
                'Operator': []
            })
        }
        for (var i = 0; i < FilterNames.length; i++) {
            var item = FilterNames[i].Operator;
            var newarr = item.split(",");
            for (var k = 0; k < newarr.length; k++) {
                var data = OperatorArray.find(x => x.Index == FilterNames[i].Id);
                if (String(data) != "undefined") {
                    //push operator
                    OperatorArray[i].Operator.push({
                        'Value': newarr[k]
                    });
                }
            }
        }
    }
    function BindFilterOperatorList(DropId, FilterOperatorListdata) {
        var output = "";
        for (var i = 0; i < FilterOperatorListdata.Operator.length; i++) {
            var item = FilterOperatorListdata.Operator[i].Value;
            output += ('<option value="' + item + '">' + item + '</option>');
        }
        $("#OperatorChange" + DropId).append(output);
        //;
    }
    $(document).on('click', '#removeItemFilter', function (e) {
        var Id = $(this).attr("data-id");
        Id = parseInt(Id);
        //this.IsRange[Id] = 0;
        let index = droppedItemsFinal.map(function (e) {
            return e.Id
        }).indexOf(Id);
        droppedItemsFinal.splice(index, 1);
        Id = parseInt(Id);
        /////////
        let index1 = FilterOperatorList.map(function (e) {
            return e.Index
        }).indexOf(Id);
        FilterOperatorList.splice(index1, 1);
        /////////
        Id = parseInt(Id);
        let index2 = FinalSelectedValueList.map(function (e) {
            return e.Id
        }).indexOf(Id);
        FinalSelectedValueList.splice(index2, 1);
        $("#FilterDiv" + Id).remove();
        console.log("droppedItems" + JSON.stringify(droppedItemsFinal));
        console.log("FilterOperatorList" + JSON.stringify(FilterOperatorList));
        console.log("FinalSelectedValueList" + JSON.stringify(FinalSelectedValueList));
    });
    $(document).on('change', '.OperatorChange', function (e) {
        var ControlDispType = $(this).attr("data-ControlDispType");
        var Id = $(this).attr("data-id");
        var value = $(this).val();
        if (value == "Range") {
            var columnsmenu = "";
            columnsmenu += `<input style="width: 150px;height:23px !important"
                  data-ControlDispType="` + ControlDispType + `" data-id="` + Id + `"
                        Id="ValueChange2"       type="` + ControlDispType + `" class="form-control">`;
            $("#RangeBox" + Id).html(columnsmenu);
        } else {
            $("#RangeBox" + Id).empty();
        }
        Id = parseInt(Id);
        //update value
        let index2 = FinalSelectedValueList.map(function (e) {
            return e.Id
        }).indexOf(Id);
        var datakeyvalue = FinalSelectedValueList.find(x => x.Id == Id);
        FinalSelectedValueList[index2].Operator = value;
        if (value != "Range") {
            FinalSelectedValueList[index2].Value2 = "";
        }
        console.log("fgf" + JSON.stringify(FinalSelectedValueList[index2]));
    });
    $(document).on('change', '#ValueChange1,.BindSelect', function (e) {
        var ControlDispType = $(this).attr("data-ControlDispType");
        var Id = $(this).attr("data-id");
        var value = $(this).val();
        Id = parseInt(Id);
        let index2 = FinalSelectedValueList.map(function (e) {
            return e.Id
        }).indexOf(Id);
        FinalSelectedValueList[index2].Value1 = value;
        FinalSelectedValueList[index2].ValueType1 = ControlDispType;
        console.log("fgf" + JSON.stringify(FinalSelectedValueList[index2]));
    });
    $(document).on('change', '#ValueChange2', function (e) {
        var ControlDispType = $(this).attr("data-ControlDispType");
        var Id = $(this).attr("data-id");
        var value = $(this).val();
        Id = parseInt(Id);
        let index2 = FinalSelectedValueList.map(function (e) {
            return e.Id
        }).indexOf(Id);
        FinalSelectedValueList[index2].Value2 = value;
        FinalSelectedValueList[index2].ValueType2 = ControlDispType;
        console.log("fgf" + JSON.stringify(FinalSelectedValueList[index2]));
    });
    function BindFilterSelectMenu(FilterName, Id) {
        var output = "";
        for (var i = 0; i < FilterSelectMenu.length; i++) {
            var item = FilterSelectMenu[i].Name;
            output += ('<option value="' + item + '">' + item + '</option>');
        }
        $("#BindSelect" + Id).append(output);
    }
    $(document).on('change', '#UpdateOrder', function (e) {
        var Id = $(this).attr("data-id");
        Id = parseInt(Id);
        var value = $(this).val();
        let index2 = droppedItemsOrderBy.map(function (e) {
            return e.Id
        }).indexOf(Id);
        droppedItemsOrderBy[index2].OrderBy = e.target.value;
        console.log("rr4335656" + JSON.stringify(droppedItemsOrderBy));
    });
    function BindGroupByColumnValues(data, ColumnIdForGroupBy, ModalCoumnGroupByLabel, ModalCoumnGroupByColumn) {
        var columnsmenu = "";
        for (var t = 0; t < data.length; t++) {
            var checked = "";
            if (data[t].checked == true) {
                checked = "checked";
            }
            columnsmenu += ` <li>
                                <p>
                                    <input ` + checked + ` type="checkbox"  data-id="` + data[t].Id + `" data-ColumnIdForGroupBy="` + ColumnIdForGroupBy + `" data-ModalCoumnGroupByLabel="`+ModalCoumnGroupByLabel+`"
                                 targetid="grp_` + t + `_` + ColumnIdForGroupBy + `"    data-ModalCoumnGroupByColumn="` + ModalCoumnGroupByColumn + `"      value="` + data[t].Value + `" id="GetOrderValue" />&nbsp; ` + data[t].Name + `
                                </p>
                            </li>`;
        }
        $("#DivGroupBind").html(columnsmenu);
    }
    $(document).on("click", "#GetOrderValue", function () {
        var id = $(this).attr("data-id");
        var Value = $(this).attr("Value");
        var ColumnIdForGroupBy = $(this).attr("data-ColumnIdForGroupBy");
        var ModalCoumnGroupByLabel = $(this).attr("data-ModalCoumnGroupByLabel");
        var ModalCoumnGroupByColumn = $(this).attr("data-ModalCoumnGroupByColumn");
        var targetid = $(this).attr("targetid");
        if ($(this).is(':checked')) {
            //push value in final selected group by array
            PushGroupByValue(targetid, ModalCoumnGroupByColumn, Value, id, ColumnIdForGroupBy, ModalCoumnGroupByLabel);
        } else {
            //Pop value in final selected group by array
            PopGroupByValue(id)
        }
        console.log("RR" + JSON.stringify(FinalSelectedColumnGroupByList));
    });
    function PushGroupByValue(Id, ColumnName, Value, GroupMasterId, ColumnId, LabelName) {
        //check exist
        var exist = FinalSelectedColumnGroupByList.filter(x => x.Id == Id);
        if (String(exist) == "") {
            FinalSelectedColumnGroupByList.push({
                GroupOperatorName: Value,
                ColumnName: ColumnName,
                LabelName: LabelName,
                ColumnId: ColumnId,
                Id: Id,
                checked: true,
                GroupByMasterId: GroupMasterId
            });
        } else {
            alert("You have already added this column in group by");
            // alert("You have already added this column in group by");
        }
    }
    function PopGroupByValue(Id) {
        Id = parseInt(Id);
        let index2 = FinalSelectedColumnGroupByList.map(function (e) {
            return e.Id
        }).indexOf(Id);
        FinalSelectedColumnGroupByList.splice(index2, 1);
    }
    $(document).on("click", "#openGroupByModal", function () {
        var Id = $(this).attr("data-id");
        var DataType = $(this).attr("data-ColumnDataType");
        var LabelName = $(this).attr("data-LabelName");
        var ColumnName = $(this).attr("data-ColumnName");
        $("#ModalCoumnGroupByLabel").text(LabelName);
        $('#myModalGroupBy').modal({
            show: true
        });
        ////reset all checkbox
        $("#DivGroupBind").html("");
        SelectedColumnGroupByList = ColumnGroupByList.filter(x => x.ColumnDataType == DataType);
        var ColumnIdForGroupBy = Id;
        var ModalCoumnGroupByLabel = LabelName;
        var ModalCoumnGroupByColumn = ColumnName;
        //bind default value in checkbox if exist
        var groupbyIdselected = FinalSelectedColumnGroupByList.filter(x => x.ColumnId == Id);
        //checkckd flase default 
        $(SelectedColumnGroupByList).each(function () {
            this.checked = false;
        });
        if (String(groupbyIdselected) != "") {
            for (var i = 0; i <= groupbyIdselected.length; i++) {
                const foundIndex = SelectedColumnGroupByList.findIndex(x => x.Id == groupbyIdselected[i]?.GroupByMasterId);
                if (foundIndex != -1) {
                    SelectedColumnGroupByList[foundIndex].checked = true;
                }
            }
        }
        BindGroupByColumnValues(SelectedColumnGroupByList, ColumnIdForGroupBy, ModalCoumnGroupByLabel, ModalCoumnGroupByColumn);
    });
    function BindGroupByOperator()
    {
        ColumnGroupByList = [
        ]
        var dataobj = {
            moduleid: $("#Modules").val(),
        };
        var json = JSON.stringify(dataobj);
        var html1 = "";
        var rt2 = $.ajax({
            async: true,
            url: '/api/ReportBuilderApi/ColumnGroupByListForReport',
            data: json,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            success: function (response) {
                var columnsmenu = "";
                var obj = JSON.parse(response.Data);
                for (var t = 0; t < obj.length; t++) {
                    ColumnGroupByList.push({ Id: obj[t].Id, ColumnDataType: obj[t].ColumnDataType, Name: obj[t].Name, Value: obj[t].Value, checked: false })
                }
                closeload();
            },
            error: function (response) {
                alert(response.responseText);
                closeload();
            }
        });
    }
    function BindColumnGroupByOperatorNames(types, Id) {
        var dataobj = {
            type:types,
            moduleid: $("#Modules").val(),
        };
        var json = JSON.stringify(dataobj);
        var html1 = "";
        var rt2 = $.ajax({
            async: true,
            url: '/api/ReportBuilderApi/DropdownBindForReportbyTypeFilter',
            data: json,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            success: function (response) {
                var columnsmenu = "";
                var result = JSON.stringify(response.Data);
                var obj = JSON.parse(result);
                for (var t = 0; t < obj.length; t++) {
                    html1 += '<option value="' + obj[t].Name + '" >' + obj[t].Name + '</option>';
                    //this.ColumnGroupByList.push({ Id: obj[t].Id, ColumnDataType: obj[t].ColumnDataType, Name: obj[t].Name, Value: obj[t].Value, checked: false })
                }
                $("#BindSelect" + Id).html(html1);
                closeload();
            },
            error: function (response) {
                alert(response.responseText);
                closeload();
            }
        });
        $.when(rt2).then(function (data, textStatus, jqXHR) {
        });
    }
    $(document).on("click", "#ViewPreviewModal", function () {
        var fileid = $(this).attr("id-val");
        var fileid = $(this).attr("id-val");
        var fileid = $(this).attr("id-val");
        var fileid = $(this).attr("id-val");
        var mode = "view";
        var url = "/firm/multiplefilelist/?ftype=completetask&data=" + fileid + "&mode=" + mode;
        $('.mymodels').load(url, function (result) {
            closeload();
            $('#myModal').modal({
                show: true
            });
        });
    });
    function ResetComponent() {
        droppedItems1 = [];
        droppedItems = [];
        FinalSelectedColumnGroupByList = [];
        droppedItemsOrderBy = [];
        $("#ReportName").val("");
        droppedItemsFinal = [];
        $("#DropFilterArea,#DropColumnArea,#DropOrderByArea").html("");
    }
    $(document).on('click', '#pgetdatabypagenum', function () {
        ppageindex = $("#ppagnumvalue").val();
        if (ppageindex != "undefined") {
            if (Math.sign(ppageindex) == 1) {
                var ppageindesx = $("#psotopage").text();
                if (ppageindex <= parseInt(ppageindesx)) {
                    pageindex = ppageindex;
                    $("#PreviewFormPaging").click();
                    //closeload();
                }
                else {
                    alert("Please enter a valid page number.");
                    closeload();
                }
            }
            else {
                alert("Please enter a valid page number.");
            }
        }
    });
    $(document).on('click', '#ppaginate', function () {
        /* your code here */
        pageindex = $(this).attr("index");
        $("#PreviewFormPaging").click();
    });
    let formDatasFinal = "";
    $(document).on("click", "#SaveForm,#PreviewForm,#PreviewFormPaging,#oexcel,#opdf", function () {
        var Searchparam = $('#ReportName').val();
        var ModuleId = $("#Modules").val();
        if (ModuleId == "") {
            alert("Please select module.");
            return false;
        }
        if ($(this).attr("id") == "SaveForm") {
            if (Searchparam == "") {
                alert("Please enter report name");
                return false;
            }
        }
            var ordercolcollecionforcustomRpt = "";
            var columnnameforcustomRpt = "";
            var TempTablecolumnnameforcustomRpt = "";
            var FilterforcustomRpt = "";
            var groupcolcollectionforcustomRpt = "";
            var groupBycoumn = "";
            //validate and check amd format data column
            if (droppedItems1.length == 0) {
                alert("Please select atleast 1 result");
                return false;
            }
            //validate mandate order column to selected column
            for (var i = 0; i <= droppedItemsOrderBy.length; i++) {
                try {
                    Id = parseInt(droppedItemsOrderBy[i].Id);
                    let index2 = droppedItems1.map(function (e) {
                        return e.Id
                    }).indexOf(Id);
                    if (index2 == -1) {
                        var message = "Please add column '" + droppedItemsOrderBy[i].LabelName + "' because you have added  '" + this.droppedItemsOrderBy[i].LabelName + "'  for Order by."
                        alert(message);
                        return false;
                    }
                } catch (er) {
                }
            }
            //for column
            for (var i = 0; i < droppedItems1.length; i++) {
                var checkexistingroup = FinalSelectedColumnGroupByList.filter(x => x.ColumnId == droppedItems1[i].Id);
                if (String(checkexistingroup) == "" || droppedItems1[i].ColumnDataType != "Number") {
                    if (droppedItems1[i].ColumnDataType == "date") {
                        columnnameforcustomRpt += "convert(varchar(32)," + droppedItems1[i].ColumnName + ",106) as " + (droppedItems1[i].LabelName).replaceAll(" ", "_") + ",";
                    } else {
                        columnnameforcustomRpt += droppedItems1[i].ColumnName + " as " + (droppedItems1[i].LabelName).replaceAll(" ", "_") + ",";
                    }
                    if (("," + groupBycoumn + ",").indexOf("," + droppedItems1[i].ColumnName + ",") == -1) {
                        groupBycoumn += droppedItems1[i].ColumnName + ",";
                    }
                }
            }
            //for orders
            for (var i = 0; i < droppedItemsOrderBy.length; i++) {
                ordercolcollecionforcustomRpt += droppedItemsOrderBy[i].ColumnName + " " + droppedItemsOrderBy[i].OrderBy + ",";
            }
            //for group by
            for (var i = 0; i < FinalSelectedColumnGroupByList.length; i++) {
                groupcolcollectionforcustomRpt += FinalSelectedColumnGroupByList[i].GroupOperatorName + "(" + FinalSelectedColumnGroupByList[i].ColumnName + ") as " + FinalSelectedColumnGroupByList[i].LabelName.replaceAll(" ", "_") + "_" + FinalSelectedColumnGroupByList[i].GroupOperatorName + ",";
            }
            //validate and check amd format data filters
            //console.log(JSON.stringify(this.FinalSelectedValueList));
            for (var i = 0; i < FinalSelectedValueList.length; i++) {
                if (FinalSelectedValueList[i].Operator == "") {
                    alert("Please select " + FinalSelectedValueList[i].FilterLabel + " Filter Operator");
                    return false;
                }
                if (FinalSelectedValueList[i].Operator == "Range") {
                    if (FinalSelectedValueList[i].Value1 == "") {
                        alert("Please select " + FinalSelectedValueList[i].FilterLabel + " first Filter Value");
                        return false;
                    }
                    if (FinalSelectedValueList[i].Value2 == "") {
                        alert("Please select " + FinalSelectedValueList[i].FilterLabel + " second Filter Value");
                        return false;
                    }
                } {
                    if (FinalSelectedValueList[i].Value1 == "") {
                        alert("Please select " + FinalSelectedValueList[i].FilterLabel + " first Filter Value");
                        return false;
                    }
                }
            }
            for (var i = 0; i < FinalSelectedValueList.length; i++) {
                if (FinalSelectedValueList[i].Operator == "Range") {
                    FilterforcustomRpt += FinalSelectedValueList[i].Filtername + ">='" + FinalSelectedValueList[i].Value1 + "' and " + FinalSelectedValueList[i].Filtername + "<='" + FinalSelectedValueList[i].Value2 + "',";
                    TempTablecolumnnameforcustomRpt += FinalSelectedValueList[i].Filtername + "=" + FinalSelectedValueList[i].Filtername + ">='" + FinalSelectedValueList[i].Value1 + "' and " + FinalSelectedValueList[i].Filtername + "<='" + FinalSelectedValueList[i].Value2 + "',";
                } else if (String(FinalSelectedValueList[i].Operator) == "Starting With") {
                    var operatornew = "like";
                    FilterforcustomRpt += FinalSelectedValueList[i].Filtername + " " + operatornew + " '" + FinalSelectedValueList[i].Value1 + "%',";
                    TempTablecolumnnameforcustomRpt += FinalSelectedValueList[i].Filtername + "=" + FinalSelectedValueList[i].Filtername + " " + operatornew + " '" + FinalSelectedValueList[i].Value1 + "%',";
                } else if (String(FinalSelectedValueList[i].Operator) == "Contains") {
                    var operatornew = "like";
                    FilterforcustomRpt += FinalSelectedValueList[i].Filtername + " " + operatornew + "'%" + FinalSelectedValueList[i].Value1 + "%',";
                    TempTablecolumnnameforcustomRpt += FinalSelectedValueList[i].Filtername + "=" + FinalSelectedValueList[i].Filtername + " " + operatornew + " '%" + FinalSelectedValueList[i].Value1 + "%',";
                } else if (String(FinalSelectedValueList[i].Operator) == "Equal to") {
                    var operatornew = "=";
                    if (String(FinalSelectedValueList[i].ValueType1) == "date") // shows 'valid Date'
                    {
                        FilterforcustomRpt += "cast(" + FinalSelectedValueList[i].Filtername + " as date)" + operatornew + "'" + FinalSelectedValueList[i].Value1 + "',";
                        TempTablecolumnnameforcustomRpt += FinalSelectedValueList[i].Filtername + "=" + FinalSelectedValueList[i].Filtername + operatornew + "'" + FinalSelectedValueList[i].Value1 + "',";
                    } else {
                        FilterforcustomRpt += FinalSelectedValueList[i].Filtername + " " + operatornew + " '" + FinalSelectedValueList[i].Value1 + "',";
                        TempTablecolumnnameforcustomRpt += FinalSelectedValueList[i].Filtername + "=" + FinalSelectedValueList[i].Filtername + " " + operatornew + " '" + FinalSelectedValueList[i].Value1 + "',";
                    }
                } else {
                    FilterforcustomRpt += FinalSelectedValueList[i].Filtername + " " + operatornew + " '" + FinalSelectedValueList[i].Value1 + "',";
                    TempTablecolumnnameforcustomRpt += FinalSelectedValueList[i].Filtername + "=" + FinalSelectedValueList[i].Filtername + " " + operatornew + " '" + FinalSelectedValueList[i].Value1 + "',";
                }
            }
            if (String($(this).attr("id")) == "PreviewForm") {
                pageindex = 1;
            }
            let formDatas = {
                "columnnameforcustomRpt": removeLastComma(columnnameforcustomRpt),
                "filternameforcustomRpt": removeLastComma(FilterforcustomRpt),
                "groupcolcollectionforcustomRpt": removeLastComma(groupcolcollectionforcustomRpt),
                "groupBycolumn": removeLastComma(groupBycoumn),
                "ordercolcollecionforcustomRpt": removeLastComma(ordercolcollecionforcustomRpt),
                "reportnameforcustomRpt": Searchparam,
                "reporttypeforcustomRpt": "",
                "tempTablecolumnnameforcustomRpt": removeLastComma(TempTablecolumnnameforcustomRpt),
                "FilterArray": JSON.stringify(droppedItems),
                "FilterValueArray": JSON.stringify(FinalSelectedValueList),
                "ColumnArray": JSON.stringify(droppedItems1),
                "GroupByArray": JSON.stringify(FinalSelectedColumnGroupByList),
                "OrderByArray": JSON.stringify(droppedItemsOrderBy),
                "OrderByValueArray": "",
                "moduleid": $("#Modules").val(),
                "pageno": pageindex,
                "pagesize": pagesize,
            }
            console.log(JSON.stringify(formDatas));
            if (String($(this).attr("id")) == "PreviewForm") {
                OpenDialogPreview(formDatas);
            }
            else if (String($(this).attr("id")) == "PreviewFormPaging") {
                OpenDialogPreview(formDatas);
            }
            else if (String($(this).attr("id")) == "oexcel") {
                oexcel(formDatas);
            }
            else if (String($(this).attr("id")) == "opdf") {
                opdf(formDatas);
            }
            else {
                if (confirm("Are you sure to proceed ")) {
                    SaveReportBuilderReport(formDatas);
                }
            }
    });
    function OpenDialogPreview(formDatas) {
        $('#ReportBuilderPreview').modal({ show: true });
        BindPreview(formDatas);
    }
    function BindPreview(formDatas)
    {
        ColumnArray = [];
        var json = JSON.stringify(formDatas);
       // openload();
        $.ajax({
            async: true,
            url: '/api/ReportBuilderApi/CustomReportDataPreviewtes',
            data: json,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            success: function (response) {
                var html1 = '';
                $("#Prevfooter").html("");
                if (response.Data == "Result Not Found") {
                    $("#Prevfooter,#rptbody,#rpcolumn").html("");
                    $("#noresultdiv").show();
                    return false;
                }
                else {
                    $("#noresultdiv").hide();
                }
                var result = JSON.stringify(response.Data);
                var obj = JSON.parse(result);
                //set column
                for (var i = 0; i <= obj.length; i++) {
                    var columnsIn = obj[i];
                    for (var key in columnsIn) {
                        if (key == "TotalRecord" || key == "RowId") {
                        }
                        else {
                            ColumnArray.push(key);
                        }
                    }
                    break;
                }
                var html1 = '';
                for (var i = 0; i < ColumnArray.length; i++) {
                    html1 += `<th >
                        <div class="thbg"> &nbsp;&nbsp;`+ ColumnArray[i].replaceAll('/', ' ') + `  &nbsp;&nbsp;</div>
                          </th >`;
                }
                var html2 = '';
                $("#rpcolumn").html(html1);
                //set paging
                var length = obj.length;
                $.each(obj, function (index, a) {
                    if (index === 0) {
                        firstvalue = a.RowId;
                    }
                    if (index === (length - 1)) {
                        var pnext = pageindex;
                        var pprev = pageindex;
                        var pageno = pageindex;
                        var totdata = a.TotalRecord;
                        var totpage = 0;
                        if (a.TotalRecord > 0) {
                            pnext = parseInt(pnext) + 1;
                            if (pnext == 0) pnext = 1;
                            pprev = parseInt(pageno) - 1;
                            if (pprev == 0) pprev = 1;
                            totpage = parseInt(totdata) / parseInt(pagesize);
                            if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            $("#pagnumvalue").attr("max", totpage);
                        }
                        var tfot = '';
                        tfot += '<ul>'
                        tfot += '<li>results <span>' + a.TotalRecord + '</span>  <span id="psotopage" style="display:none">' + totpage + '</span></li>'
                        tfot += '<li><span>|</span></li>'
                        tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                        tfot += '<li><span>|</span></li>'
                        tfot += '<li ><input type="number" id="ppagnumvalue" min="1"  class="footerInput"><a class="gobtn" type="button" id="pgetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</a> </li>'
                        if (a.TotalRecord <= length) {
                        }
                        else if (pageno == 1) {
                        }
                        else if (pageno == totpage) {
                            tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + firstvalue + '-' + a.RowId + '  <span>'
                        }
                        else {
                            tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>  ' + firstvalue + '-' + a.RowId + '  <span>'
                        }
                        if (pageno < totpage) {
                            tfot += '<a  id="ppaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        }
                        tfot += '</ul>'
                        $("#Prevfooter").append(tfot);
                    }
                });
                //set data
                for (var i = 0; i < obj.length; i++)
                {
                    html2 += `<tr>`;
                    for (var j = 0; j < ColumnArray.length; j++) {
                        html2 += `<td style="min-width:100px;" >` + obj[i][ColumnArray[j]] + `</td>`;
                    }
                    html2 += `</tr>`;
                }
                $("#rptbody").html(html2);
            },
            error: function (response) {
                alert(response.responseText);
                closeload();
            }
        });
    }
    function SaveReportBuilderReport(formDatas) {
        var json = JSON.stringify(formDatas);
         openload();
        $.ajax({
            async: true,
            url: '/api/ReportBuilderApi/CustomReportData',
            data: json,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            success: function (response) {
                alert(response.Data);
                closeload();
                ResetComponent();
                location.reload();
            },
            error: function (response) {
                alert(response.responseText);
                closeload();
            }
        });
    }
    function removeLastComma(str) {
        return str.replace(/,(\s+)?$/, '');
    }
    $(document).on("change", "#Modules", function () {
        ResetComponent();
        BindFilter();
    });
    function BindModules() {
        var dataobj = {};
        var rt2=$.ajax({
            async: true,
            url: '/api/ReportBuilderApi/ModuleListForReport',
            //data: dataobj,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            success: function (response) {
                var html1 = '';
                var obj = JSON.parse(response.Data);
                if (obj != "") {
                    $.each(obj, function (i, val) {
                        html1 += '<option value="' + val.id + '" >' + val.ModuleName + '</option>';
                    });
                }
                $("#Modules").html(html1);
            },
            error: function (response) {
                alert(response.responseText);
                closeload();
            }
        });
        $.when(rt2).then(function (data, textStatus, jqXHR) {
            BindFilter();
        });
    }
        function oexcel(formdata)
        {
            var urls = "/" + fcode + "/ReportBuilder/ExportToExcelReportBuilderPreview";
            url_redirect({
                url: urls,
                method: "post",
                data: formdata
            });
        }
    function opdf(formdata) {
            var urls = "/" + fcode + "/ReportBuilder/ExportToPDFReportBuilderPreview";
            url_redirect({
                url: urls,
                method: "post",
                data: formdata
            });
        }
});
