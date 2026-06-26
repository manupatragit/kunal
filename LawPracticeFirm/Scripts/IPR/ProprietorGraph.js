var userDetails = JSON.parse(sessionStorage.getItem("LoginDetails"));
var fcode = localStorage.getItem("FirmCode");
//var urlParams = new URLSearchParams(window.location.search);
//var _id = urlParams.get("id");
var eventDates = [];
$(document).ready(function () {
    var hdnid = $("#hdnid").val();
    //alert("prop-" + hdnid);
    GetDataTypeOfProprietorGraph();

    function GetDataTypeOfProprietorGraph() {
        $("#tblbodyproprietor").html("");
        var IPTypeId = [];
        var ProprietorName = [];
        var CCount = [];
        var IPName = [];
        var html = '';
        lblpgraph = "";
        var formdata = new FormData();
        $.ajax({
            type: "POST",
            url: "/api/IPRApi/ProprietorIPGraph?id=" + hdnid,
            dataType: 'json',
            data: formdata,
            contentType: false,
            processData: false,
            async: false,
            success: function (response) {
                $(response.Data).each(function (key, value) {

                    if (value.IPTypeId == "" || value.IPTypeId == null || value.IPTypeId == "null") {

                    }
                    else {
                        lblpgraph = value.ProprietorName;
                        IPTypeId.push(value.IPTypeId);
                        IPName.push(value.IPName);
                        CCount.push(value.CCount);
                        html += '<tr><td>' + value.IPName + '</td><td><p>' + value.CCount + '</p></td></tr>'


                    }
                });
                $("#tblbodyproprietor").html(html)

            },
            failure: function (response) {
                alert("Something Went Wrong")
            }

        });
        $("#lblpgraphtbl").text(lblpgraph);
        $("#lblpgraph").text(lblpgraph);
        $("#barChartproprietor").html("");

        var chartDiv = $("#barChartproprietor");
        var myChart = new Chart(chartDiv, {
            type: 'doughnut',
            data: {
                
                //labels: ["Pending", "InProgress", "OnHold", "Complete", "Cancelled"],
                labels: IPName,
                datasets: [
                    {
                        data: CCount,
                        // data: [21, 39, 10, 14, 16],
                        backgroundColor: ["#A0D930", "#4D95DD", "#DEDEDE", "#9FD8FF", "#DDF49F"]
                    }]
            },
            options: {
                //title: {
                //    display: true,
                //    text: 'Pie Chart'
                //},
                //responsive: true,
                //maintainAspectRatio: false,
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    responsive: true,
                    // text: 'Status of Notice'
                },
                legend: {
                    display: true,
                    position: 'right',

                    labels: {
                        boxWidth: 10,
                        boxHeight: 2,
                        fontSize: 12,
                        fontColor: '#333333'

                    }
                },
            }
        });
    }
});