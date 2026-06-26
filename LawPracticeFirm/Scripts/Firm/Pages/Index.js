function Index() {
    var privateVariables = {
        url:''
    };
    var delegateMethods = {};
    var privateMethods = {
        getUserInfo: function () {
            Utility.postDataToServer("api/EmployeeApi/UserProfile", {}, {}, "json", privateMethods.userInfo, privateMethods.initiatePlugins, null, false);
        },
        userInfo: function (response) {
            if (response.Status) {
                privateVariables.url = response.Data["Item1"];
                var menuUrls = response.Data["Item2"];
                var caseUrl = response.Data["Item3"];
                var data = response.Data["Item4"];
                Utility.UserInfo = response.Data["Item4"];
                Utility.UserInfo["Details"] = JSON.parse(Utility.UserInfo["Details"]);
                Utility.UserInfo["Cases"] = JSON.parse(Utility.UserInfo["Cases"]);
                Utility.UserInfo["Events"] = JSON.parse(Utility.UserInfo["Events"]);
                Utility.UserInfo["Tasks"] = JSON.parse(Utility.UserInfo["Tasks"]);
                var k =l= '';
                if ($.isArray(Utility.UserInfo["Cases"]) && Utility.UserInfo["Cases"].length > 0) {
                    var i = 0;
                    $.each(Utility.UserInfo["Cases"][0], function (key, value) {
                        if (key != "Id" && i==0) {
                            k = key;
                        }
                        if (key != "Id" && i == 1) {
                            l = key;
                        }
                        if (key != "Id") {
                            i += 1;
                        }
                    });
                }
                $.each(Utility.UserInfo["Cases"], function (i, a) {
                    $("#ulCases").append('<li><a tabindex=" - 1" href="' + caseUrl[0] + "/" + a["Id"] + '">' + a[k] + "(" + a[l].replace(/\|/g, " ")+")" + '</a></li>');
                });
                $("#ulCases").append('<li role="presentation" class="divider"></li>');
                $("#ulCases").append('<li><a tabindex=" - 1" href="' + caseUrl[1] + "/" + Utility.UserInfo.UserId + '">' + "Show All" + '</a></li>');
                if (menuUrls.length > 0) {
                    var add = Enumerable.From(menuUrls)
                        .Where(function (n) {
                            return n["Type"].toUpperCase() === "ADD";
                        }).ToArray();
                    if (add.length > 0) {
                        $.each(add, function (i, a) {
                            $("#ulAddNew").append('<li><a tabindex=" - 1" href="' + a["Url"] + '">' + a["Title"] + '</a></li>');
                        });
                    }
                    var info = Enumerable.From(menuUrls)
                        .Where(function (n) {
                            return n["Type"].toUpperCase() === "INFO";
                        }).ToArray();
                    if (info.length > 0) {
                        $.each(info, function (i, a) {
                            if (i == 0) {
                                $("#liinfo").append('<a tabindex=" - 1" href="' + a["Url"] + '">' + a["Title"] + '</a>').show();
                            }
                        });
                    }
                    var list = Enumerable.From(menuUrls)
                        .Where(function (n) {
                            return n["Type"].toUpperCase() === "LIST";
                        }).ToArray();
                    if (list.length > 0) {
                        $.each(list, function (i, a) {
                            $("#ullist").append('<li><a tabindex=" - 1" href="' + a["Url"] + '">' + a["Title"] + '</a></li>');
                        });
                    }
                    var conf = Enumerable.From(menuUrls)
                        .Where(function (n) {
                            return n["Type"].toUpperCase() === "CONFIGURATION";
                        }).ToArray();
                    if (conf.length > 0) {
                        $.each(conf, function (i, a) {
                            $("#ulconf").append('<li><a tabindex=" - 1" href="' + a["Url"] + '">' + a["Title"] + '</a></li>');
                        });
                    }
                    var workflow = Enumerable.From(menuUrls)
                        .Where(function (n) {
                            return n["Type"].toUpperCase() === "WORKFLOW";
                        }).ToArray();
                    if (workflow.length > 0) {
                        $.each(workflow, function (i, a) {
                            if (i == 0) {
                                $("#liwf").append('<a tabindex="- 1" href="' + a["Url"] + '">' + a["Title"] + '</a>').show();
                            }
                        });
                    }
                }
                if (workflow.length === 0 && conf.length === 0 && list.length === 0 && info.length===0) {
                    $("#liManage").remove();
                }
            }
        },
        initiatePlugins: function() {
        },
        attachevents: function () {
        },
        load: function () {
            privateMethods.getUserInfo();
        }
    };
    var constructor = {
        Index: function () {
            privateMethods.load();
            privateMethods.attachevents();
        }
    };
    constructor.Index();
}