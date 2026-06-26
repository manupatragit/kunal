$("#savecasefilenew").click(function () {
    var formData = new FormData();
    formData.append("name", EncodeText("kkkk"))

    alert(1)
    $.ajax({
        type: "POST",
        url: "/api/TestOci/test",
        dataType: 'json',
        //async: false,
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            console.log(response);
            //$("#txtnoticethrough").append($("<option></option>").val("0").text('Please Select'));
            //if (response != null) {
            //    $.each(response, function (key, value) {
            //        $("#txtnoticethrough").append($("<option></option>").val(value.cid).text(value.fullnsame));
            //    })
            //}
        },
        failure: function (response) {
        },
        error: function (response) {

        }

    });
})