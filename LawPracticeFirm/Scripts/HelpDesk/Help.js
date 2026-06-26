$(document).ready(function () {
   
    //var url = window.location.href;
    function getUrlVars() {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }
    var urlparamId = getUrlVars();
    if (urlparamId['Id'] != undefined) {
        GetSubTopicDetailview(urlparamId['Id']);
    }
    $('div .dropdown-menu').on('click', function (event) {
        event.stopPropagation();
    });
    GetContentList();
    function GetContentList() {
        
        var html3 = '';
        var formData = new FormData();
        //formData.append("igroupid", groupval);

      var chkurl=  $.ajax({
            async: true,
            type: "POST",
            url: "/api/HelpDeskApi/HelpContentList",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,

            success: function (response1) {
                html3 += '';
                var icount = 0;
                var innerhtml1 = '';
                var headerhtml = '';
                var htmlheading = '';
                $.each(response1.Data, function (i, a) {
                    icount = icount + 1;
                    var IId = a.iid;
                    var vTopic = a.vTopic;
                    var vSubTopic = a.vSubTopic;
                    htmlheading = '<div class="card-header " id="heading"  txtfine="' + vTopic + '" value="' + IId +'">'
                    htmlheading += '<h2 class="mb-0"><a href="#" id=' + IId + ' name="' + IId + '"  class="btn btn-link headingclicktxt"><i class="fa fa-angle-right"></i> ' + vTopic+'</a></h2></div>'
                    htmlheading += '<div id="headingchild' + IId+'" style="display:none"></div>'
                    innerhtml1 += htmlheading
                });
                headerhtml += htmlheading + innerhtml1;
                $("#textbinding").html("");
                $("#textbinding").html(innerhtml1);

            },

            failure: function (data) {
                alert(data.responseText);

            },
            error: function (data) {
                alert(data.responseText);

            }

        });

        $.when(chkurl).then(function (data, textStatus, jqXHR) {
            // var cf = $("a").f.attr("Matter Management");
            // theDiv[i].id.indexOf('hk')
         //   var cf = $("#heading [txtfine='Document Management']");
            var modulename = "";
            var sourcepageuri = GetParameterValues("URI");
            if (sourcepageuri == "caselist" || sourcepageuri == "NewCaseDashboard" || sourcepageuri == "CreateCase") {
                var modulename = 'Matter Management'
            }
            else if (sourcepageuri == "0" || sourcepageuri == "AssignUserFileList" || sourcepageuri == "RemoveFileRequest" ) {
                var modulename = 'Document Management'
            }
            else if (sourcepageuri == "Search") {
                var modulename = 'Search'
            }
            else if (sourcepageuri == "UserTask") {
                var modulename = 'Task Management'
            }
            else if (sourcepageuri == "ViewTimer") {
                var modulename = 'Time Entry'
            }
            else if (sourcepageuri == "ExpenseReport") {
                var modulename = 'Expense Management'
            }
            else if (sourcepageuri == "PDFMergeList" || sourcepageuri == "Mailbox" || sourcepageuri == "ocr" || sourcepageuri == "pdfmerge" || sourcepageuri == "Mailboxsetting") {
                var modulename = 'Tool Box'
            }
            
            
            if (String(modulename) != "") {
                var cf = $('div [txtfine="' + modulename + '"]')
               // alert(cf.attr("value"));
                $("#" + cf.attr("value")).click();
                setTimeout(function () {

                    if (sourcepageuri == "PDFMergeList" || sourcepageuri == "pdfmerge") {
                     
                        $("#headingchild" + cf.attr("value")).find('.subtopicdetil:first').click();
                    }
                    else if (sourcepageuri == "Mailbox" || sourcepageuri == "Mailboxsetting" ) {
                      
                        $("#headingchild" + cf.attr("value")).find('.subtopicdetil:eq(1)').click();
                    }
                    else if (sourcepageuri == "ocr") {
                      
                        $("#headingchild" + cf.attr("value")).find('.subtopicdetil:last').click();
                    }
                    else {
                        $("#headingchild" + cf.attr("value")).find('.subtopicdetil:first').click();
                    }
                }, 1000);
               
            }
        });

    }
    function GetParameterValues(param) {
        var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
     
        for (var i = 0; i < url.length; i++) {
            var urlparam = url[i].split('=');
            if (urlparam[0] == param) {
                return urlparam[1];
            }
        }
    }  
    //for getting subtopiclist
    function GetSubTopicList(subid) {
       // var fileid = $('.headingclicktxt').attr("name");
        var fileid = subid;
        var formData = new FormData();
        formData.append("subid", fileid);
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/HelpDeskApi/HelpContentSubTopicList",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var icount = 0;
                var innerhtml1 = '';
                $.each(response1.Data, function (i, a) {
                    icount = icount + 1;
                    var IId = a.iid;
                    var vSubTopic = a.vSubTopic;
                    innerhtml1 += '<div id="collapse" aria-labelledby="heading">'
                    innerhtml1 += '<div class="card-body">'
                    innerhtml1 += '<p style="padding:0 0 0 25px;margin:0;"><a href="#" id=' + IId +' class="subtopicdetil">' + vSubTopic + '</a></p></div></div>'
                });
                $("#headingchild" + subid).html("");
                $("#headingchild" + subid).append(innerhtml1);
                $("#headingchild" + subid).toggle();

            },

            failure: function (data) {
                alert(data.responseText);

            },
            error: function (data) {
                alert(data.responseText);

            }

        });
    }
    //for showing details view
    function GetSubTopicDetailview(subid) {
        //alert(subid);
        var fileid = subid;
        var html3 = '';
        var formData = new FormData();
        formData.append("tid", fileid);

        $("#divdetails").html("");
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/HelpDeskApi/HelpTopicID",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                html3 += '';
              
                var icount = 0;
                var innerhtml1 = '';
                $.each(response1.Data, function (i, a) {

                    //alert(response1.Data.iid);
                    var IId = a.iid;
                    var vTopic = a.vTopic;
                    var vSubTopic = a.vSubTopic;
                    html3 = a.vDetails;
                });
                //alert(html3);
                $("#divdetails").html(html3);
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);

            }

        });


    }
    //GetTopicList();
    function GetTopicList() {

        var search = $("#txtsearch").val();
        var html3 = '';
        var formData = new FormData();
        formData.append("search", search);

        $("#ulsearchlist li").remove();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/HelpDeskApi/HelpSearchTopic",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,

            success: function (response1) {

                html3 += '';
                //if (response1.Data != "") {
                //    $("#ddlExpenseType").html("");
                //}
                //else {
                //    $("#ddlExpenseType").html("No Expense Type !");
                //}
                //var obj = JSON.parse(response1.Data);
                //alert(response1.Data);
                //var length = obj.length;
                var icount = 0;
                var innerhtml1 = '';
                $.each(response1.Data, function (i, a) {
                    icount = icount + 1;
                    //alert(response1.Data.iid);
                    var IId = a.iid;
                    var vTopic = a.vTopic;
                    var vSubTopic = a.vSubTopic;
                    html3 += '<li><a href="javascript:void()" id="aviewDetails" id-val="' + IId + '">' + vSubTopic + '</li>';
                });
                //alert(html3);
                $("#ulsearchlist").html("");
                $("#ulsearchlist").append(html3);

            },

            failure: function (data) {
                alert(data.responseText);

            },
            error: function (data) {
                alert(data.responseText);

            }

        });

    }

    $("#btnsearchtopic").click(function () {
        $("#divdetails div").remove();
        GetTopicList();

    })
    //$("#lblcontent").click(function () {
    //    $("#divdetails").hide();
    //});
    //$("#lblSearch").click(function () {
    //    $("#divdetails").show();
    //});

    $(document).on("click", "#aviewDetails", function () {
        //openload();
        var fileid = $(this).attr("id-val");
        
        var html3 = '';
        var formData = new FormData();
        formData.append("tid", fileid);

        $("#divdetails").html("");
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/HelpDeskApi/HelpTopicID",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,

            success: function (response1) {

                html3 += '';
                //if (response1.Data != "") {
                //    $("#ddlExpenseType").html("");
                //}
                //else {
                //    $("#ddlExpenseType").html("No Expense Type !");
                //}
                //var obj = JSON.parse(response1.Data);
                //alert(response1.Data);
                //var length = obj.length;
                var icount = 0;
                var innerhtml1 = '';
                $.each(response1.Data, function (i, a) {
                  
                    //alert(response1.Data.iid);
                    var IId = a.iid;
                    var vTopic = a.vTopic;
                    var vSubTopic = a.vSubTopic;
                    html3 = a.vDetails;
                    
                   
                });
                //alert(html3);
                $("#divdetails").html(html3);
                

            },

            failure: function (data) {
                alert(data.responseText);

            },
            error: function (data) {
                alert(data.responseText);

            }

        });
        

    });
    function openload() {
        $('#myOverlay').css("display", "block");
    }

    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    //for getting subtopicid
    $(document).on("click", ".headingclicktxt", function () {
        var id = $(this).attr('id');
       // alert(id);
        GetSubTopicList(id);
    });
    $(document).on("click", ".subtopicdetil", function () {
        var id = $(this).attr('id');
        
        GetSubTopicDetailview(id);
    });
    //for clearing the data
    $('#lblcontent').click(function () {
        $('#ulsearchlist').html('');
    });

   
});
function printDiv() {

    var divToPrint = document.getElementById('divdetails');

    var newWin = window.open('', 'Print-Window');

    newWin.document.open();

    newWin.document.write('<html><body onload="window.print()">' + divToPrint.innerHTML + '</body></html>');

    newWin.document.close();

    setTimeout(function () { newWin.close(); }, 10);

}
