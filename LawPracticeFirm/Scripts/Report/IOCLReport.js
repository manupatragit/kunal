$(document).ready(function () {
    setTimeout(function () { $('.snav').show(); }, 2500); 
    $("#divcontent").load("/" + $('#hdnfrmcode').val() +"/Report/AgewiseShortPendingReport");
    $('.snav a').click(function () {
        openload();
        $('.snav a').removeClass("active");
        $(this).addClass("active");
        $("#divcontent").load($(this).attr("url"));
        closeload();
    })
    $('.settingpanel').remove()
})
