function FirmMain() {
    var privateVariables = {
        url: ''
    };
    var delegateMethods = {};
    var fcode = '';
/*Private method*/
    var privateMethods = {
        getFirmInfo: function () {
            Utility.postDataToServer("api/FirmApi/FirmInfo", {}, {}, "json", privateMethods.firmInfo, privateMethods.initiatePlugins, null, false);
        },
        firmInfo: function (response) {
            if (response.Status) {
                var data = response.Data["Item3"];
                localStorage.setItem("FirmCode", data.FirmCode);
                fcode = localStorage.getItem("FirmCode");
                $("#aFirmLabel").text(data.FirmLabel);
                $("#hFirmName").text(data.FirmName);
                $("#pBriefDetails").text(data.FirmBriefDetails);
                $("#ulContact").append('<li>' + data.FirmContactInformation + '</li>');
                $("#ulContact").append('<li><a href="tel://' + data.FirmContactno + '">' + data.FirmContactno + '</a></li>');
                $("#ulContact").append('<li><a href="mailto:' + data.FirmContactEmail + '">' + data.FirmContactEmail + '</a></li>');
                if (data.FirmWorkingHours.length > 0) {
                    $.each(data.FirmWorkingHours, function (i, a) {
                        $("#ulWorkingHours").append('<li>' + a.Day + ':    ' + a.StartTime + ' - ' + a.EndTime + '</li>');
                    });
                }
                $("#sFirmName").text(data.FirmName);
                $.each(response.Data["Item1"],
                    function (i, a) {
                        $("#landingnav,#footernav").append('<li><a href="' + a.Url + '">' + a.Title + '</a></li>');
                    });
            }
            else {
                alert(JSON.stringify(response));
            }
        },
        initiatePlugins: function () {
        },
        attachevents: function () {
        },
        load: function () {
            privateMethods.getFirmInfo();
        }
    };
    var constructor = {
        FirmMain: function () {
            privateMethods.load();
            privateMethods.attachevents();
        }
    };
    constructor.FirmMain();
}
$(document).ready(function () {
    var main = new FirmMain();
});