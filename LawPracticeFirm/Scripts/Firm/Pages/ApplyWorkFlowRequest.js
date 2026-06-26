jQuery(document).ready(function () {
    var cnteventrows = 0;
    var cnttskrows = 0;
    LoadEvent();
    LoadTask();
    $("#hidwfid").val(GetParameterValues('wid'));
    /*Get parameter value*/
    function GetParameterValues(param) {
        var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < url.length; i++) {
            var urlparam = url[i].split('=');
            if (urlparam[0] == param) {
                return urlparam[1];
            }
        }
    }
    /*Validate apply event task*/
    $('form[id="applyeventtask"]').validate({
        submitHandler: function (form) {
            var strevtid = "";
            var strevtdt = "";
            var strevtusers = "";
            var strevtcontact = "";
            var strtskid = "";
            var strtskdt = "";
            var strtskusers = "";
            var strtskcontact = "";
            var strtskemail = "";
            for (var i = 1; i < cnteventrows; i++) {
                if (jQuery.type($("#hideventid" + i).val()) !== "undefined") {
                    strevtid += $("#hideventid" + i).val() + "^";
                    strevtdt += $("#evtduedt" + i).val() + "^";
                    strevtusers += $("#evtusers" + i).val().replace(",", "@") + "^";
                    strevtcontact += $("#evtcontact" + i).val() + "^";
                }
            }
            for (var i = 1; i < cnttskrows; i++) {
                if (jQuery.type($("#hidtaskid" + i).val()) !== "undefined") {
                    strtskid += $("#hidtaskid" + i).val() + "^";
                    strtskdt += $("#tskduedt" + i).val() + "^";
                    strtskusers += $("#tskusers" + i).val().replace(",", "@") + "^";
                    strtskcontact += $("#tskcontact" + i).val() + "^";
                    var emailval = $("#tskemail" + i).is(':checked');
                    strtskemail += emailval == true ? "1^" : "0^";// $("#tskemail" + i).val() + "^";                
                }
            }
            var formData = new FormData();
            formData.append("strevtid", strevtid);
            formData.append("strevtdt", strevtdt);
            formData.append("strevtusers", strevtusers);
            formData.append("strevtcontact", strevtcontact);
            formData.append("strtskid", strtskid);
            formData.append("strtskdt", strtskdt);
            formData.append("strtskusers", strtskusers);
            formData.append("strtskcontact", strtskcontact);
            formData.append("strtskemail", strtskemail);
            formData.append("workflow", $("#hidwfid").val());
            var f1 = $.ajax(
                {
                    type: "POST",
                    url: "/api/WorkFlowNewApi/ApplyWorkFlow", // Controller/View
                    dataType: 'json',
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        new PNotify({
                            title: 'Success!',
                            text: ' Workflow Apply Successfully',
                            type: 'success',
                            delay: 3000
                        });
                        var datas = JSON.stringify(data);
                        $("#hidApplywfid").val(data.Data.toString());
                    },
                    failure: function (data) {
                        alert(data.responseText);
                    },
                    error: function (data) {
                        alert(data.responseText);
                    }
                });
            $.when(f1).then(function (a1) {
                formData.append("wfid", $("#hidApplywfid").val());
                $.ajax(
                    {
                        type: "POST",
                        url: "/api/WorkFlowNewApi/ApplyWorkFlowEventTask", // Controller/View
                        dataType: 'json',
                        data: formData,
                        contentType: false,
                        processData: false,
                        success: function (data) {
                            $("#saveworkflow")[0].reset();
                            new PNotify({
                                title: 'Success!',
                                text: ' Workflow Added Successfully',
                                type: 'success',
                                delay: 3000
                            });
                        },
                        failure: function (data) {
                            alert(data.responseText);
                        },
                        error: function (data) {
                            alert(data.responseText);
                        }
                    });
            }, function (jqXHR, textStatus, errorThrown) {
                //  alert('Either j1 or j2 failed!');
            });
        }
    });
    /*Load event details*/
    function LoadEvent() {
        var counter = 1;
        var wid = GetParameterValues('wid');
        $.ajax({
            async: true,
            type: 'POST',
            url: '/api/WorkFlowNewApi/WorkFlowNEventList',
            headers: {
                'wid': wid
            },
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    $(".dynamicevt").append('<h3> EVENTS</h3>');
                    $.each(response.Data, function (i, val) {
                        $(".dynamicevt").append('<div class="col-md 12">' +
                            ' <div class="form-section-bordered">' +
                            ' <div class="form-group">' +
                            ' <label class="control-label col-md-2">' + val.EventName + ' DATE <span class="required" aria-required="true">*</span></label>' +
                            ' <div class="col-md-4">' +
                            '      <input class="form-control" name="evtduedt' + counter + '" type="date" placeholder="Date/Time" id="evtduedt' + counter + '" required />' +
                            '   </div>' +
                            '</div>' +
                            ' <div class="form-group">' +
                            ' <label class="control-label col-md-2">ATTENDEES<span class="required" aria-required="true">*</span></label>' +
                            ' <div class="col-md-4">' +
                            '    <input class="form-control" type="text" name="evtusers' + counter + '" value="" id="evtusers' + counter + '" required>' +
                            ' </div>' +
                            ' </div>' +
                            ' <div class="form-group">' +
                            '   <label class="control-label col-md-2">CONTACT </label>' +
                            '    <div class="col-md-4">' +
                            '         <input class="form-control" type="text" name="evtcontact' + counter + '" value="" id="evtcontact' + counter + '" >' +
                            '  </div>' +
                            '       </div>' +
                            ' <div class="form-group">' +
                            ' <div class="col-md-4">' +
                            '<input type=hidden id="hideventid' + counter + '" value="' + val.id + '"> ' +
                            ' </div>' +
                            ' </div>' +
                            '    </div>' +
                            '</div>' +
                            ' </div > ');
                        counter = counter + 1;
                    });
                    cnteventrows = counter;
                }
                else {
                    alert("not found");
                }
            },
            error: function () {
                alert('Error!');
            }
        });
    }
    /*Load task details*/
    function LoadTask() {
        var countertsk = 1;
        var wid = GetParameterValues('wid');
        $.ajax({
            async: true,
            type: 'POST',
            url: '/api/WorkFlowNewApi/WorkFlowNTaskList',
            headers: {
                'wid': wid
            },
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    $(".dynamictsk").append('<h3> TASKS</h3>');
                    $.each(response.Data, function (i, val) {
                        $(".dynamictsk").append(' <div class="col-md 12">' +
                            '<div class="form-section-bordered">' +
                            '    <div class="form-group">' +
                            '       <label class="control-label col-md-2">' + val.TaskName + ' DUE DATE <span class="required" aria-required="true">*</span></label>' +
                            '      <div class="col-md-4">' +
                            '         <input class="form-control" name="tskduedt' + countertsk + '" type="date" placeholder="Date/Time" id="tskduedt' + countertsk + '" required />' +
                            '    </div>' +
                            '</div>' +
                            '          <div class="form-group">' +
                            '             <label class="control-label col-md-2">ASSIGNED TO <span class="required" aria-required="true">*</span></label>' +
                            '            <div class="col-md-4">' +
                            '               <input class="form-control" type="text" name="tskusers' + countertsk + '" value="" id="tskusers' + countertsk + '" required>' +
                            '  </div>' +
                            '         </div>' +
                            '        <div class="form-group">' +
                            '           <label class="control-label col-md-2">CONTACT </label>' +
                            '          <div class="col-md-4">' +
                            '             <input class="form-control" type="text" name="tskcontact' + countertsk + '" value="" id="tskcontact' + countertsk + '" >' +
                            '        </div>' +
                            '                   </div>' +
                            '                  <div class="form-group">' +
                            '                     <label class="control-label col-md-2">EMAIl ASSIGNEES  </label>' +
                            '                    <div class="col-md-4">' +
                            '                       <input class="form-control" type="checkbox" name="tskemail' + countertsk + '" value="" id="tskemail' + countertsk + '" >' +
                            '  </div>' +
                            ' <div class="form-group">' +
                            ' <div class="col-md-4">' +
                            '<input type=hidden id="hidtaskid' + countertsk + '" value="' + val.id + '"> ' +
                            ' </div>' +
                            ' </div>' +
                            '                 </div>' +
                            '            </div>' +
                            '       </div>');
                        countertsk = countertsk + 1;
                    });
                    cnttskrows = countertsk;
                }
                else {
                    alert("not found");
                }
            },
            error: function () {
                alert('Error!');
            }
        });
    }
});
