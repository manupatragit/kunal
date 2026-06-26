$(document).ready(function () {
    var type = 9;
    var fcode = localStorage.getItem("FirmCode");
/*Exporto Pdf Knowledge*/
    $("#pdf").click(function () {
        var searchdatss = "";
        var pagestypes = $("#searchtype").val();
        if (pagestypes == "1") {
            searchdatss = $("#searchdatainfile").val();
        }
        window.location = encodeURI("/firm/ExportoPdfKnowledge?status=true&pagetype=" + pagestypes + "&search=" + searchdatss);
    })
/*Email validation*/
    function checkEmail(email) {
        var regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return regExp.test(email);
    }
    try {
        $("#sharedocs").click(function () {
            var formdata1 = new FormData();
            var senddocsemail = $("#shareemail").val();
            var token = $("#knowfileid").val();
            if (senddocsemail == "") {
                alert("Please enter the E-mail Id.");
                return false;
            }
            else {
                var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
                if (reg.test(senddocsemail) == false) {
                    alert('Invalid Email ID');
                    return false;
                }
            }
            formdata1.append("email", EncodeText(senddocsemail));
            formdata1.append("token", token);
            $.ajax({
                async: true,
                url: '/firm/SendKnowledgefile',
                data: formdata1,
                processData: false,
                contentType: false,
                type: 'POST',
                success: function (response) {
                    new PNotify({
                        title: 'Success!',
                        text: ' File has been sent Successfully',
                        type: 'success',
                        delay: 3000
                    });
                    $("#shareemail").val("");
                },
                error: function () {
                    alert('Error!');
                }
            });
        });
    }
    catch (er) {
        alert(er.message);
    }
   
    /*//search data*/
    $("#seachsubmit").click(function () {
        var search = $('#searchdata').val();
        // alert(search);
        $('.pagination').hide();
        $('#maxRows option').prop('selected', function () {
            return this.defaultSelected;
        });
    });
    /*//load table data*/
    function hideEmptyCols(table) {
        var numCols = $("th", table).length;
        for (var i = 1; i <= 24; i++) {
            var empty = true;
            //grab all the <td>'s of the column at i
            $("td:nth-child(" + i + ")", table).each(function (index, el) {
                //check if the <span> of this <td> is empty
                if ($("span", el).text() != "") {
                    empty = false;
                    return false; //break out of each() early
                }
            });
            if (empty) {
                $("td:nth-child(" + i + ")", table).hide(); //hide <td>'s
            }
        }
    }
    var q = 2;
    loadmenu();
/*Load menu*/
    function loadmenu() {
        $.ajax({  async: true, 
            type: "POST",
            url: '/api/Demo/SpColMaps1',
            headers: {
                'fid': type
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                }
                else {
                    //alert("not found");
                }
                div1 = $('<div class="col-lg-12">  <div class="button-group"><button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown"><span class="glyphicon glyphicon-cog"></span> <span class="caret"></span></button> <ul class="dropdown-menu" id="ulbound"> < li > <a href="#" class="small" data-value="option1" tabIndex="-1"><input type="checkbox" name="fname" checked> fname</a></li><li><a href="#" class="small" data-value="option2" tabIndex="-1"><input type="checkbox" name="lname" checked />&nbsp;lname</a></li><li><a href="#" class="small" data-value="option2" tabIndex="-1"><input type="checkbox" name="lname" checked />&nbsp;Option 3</a></li></ul > </div ></div > ');
                $("input:checkbox:not(:checked)").each(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).hide();
                });
                $("input:checkbox").click(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).toggle();
                });
                var options = [];
                
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }
    $("#example tr td").each(function () {
        //  alert("gi");
    });
});
/*Move Fav*/
function MarkFav(strid, strchkval) {
    var strright = "0";
    var strchkval = $('input[name=' + strid + ']').is(':checked');
    if (strchkval) {
        strright = "1";
    }
    else {
        strright = "0";
    }
    $.ajax({  async: true, 
        url: '/api/WorkFlowNewApi/MarkFavourite',
        headers: { id: dtoe(strid), fav: strright },
        contentType: false,
        processData: false,
        type: 'POST',
        success: function (response) {
            $("#fileupload")[0].reset();
            if (response.Status == true) {
                var datas = JSON.stringify(response);
                new PNotify({
                    title: 'Success!',
                    text: 'Updated Successfully',
                    type: 'success',
                    delay: 3000
                });
            }
            else {
                //alert("not found");
            }
        },
        error: function () {
            alert('Error!');
        }
    });
}
/*Mark as delete*/
function MarkDelete(strid, strchkval) {
    var result = confirm("Are You sure want to delete?");
    if (result) {
        $.ajax({  async: true, 
            url: '/api/WorkFlowNewApi/MarkDelete',
            headers: { id: dtoe(strid) },
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
                $("#fileupload")[0].reset();
                alert("hi");
                if (response.Status == true) {
                    new PNotify({
                        title: 'Success!',
                        text: 'Deleted Successfully',
                        type: 'success',
                        delay: 3000
                    });
                    // alert(datas);
                }
                else {
                    //alert("not found");
                }
            },
            error: function () {
                alert('Error!');
            }
        });
        document.getElementById("btnback").click();
    }
    else {
        $("input[name='" + strid + "']:checkbox").prop('checked', false);
    }
    loadtabledata();
}
function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("example");
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc";
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 0; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            /*check if the two rows should switch place,
            based on the direction, asc or desc:*/
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            //Each time a switch is done, increase this count by 1:
            switchcount++;
        } else {
            /*If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again.*/
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}
