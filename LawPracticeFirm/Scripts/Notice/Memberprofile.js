var userDetails = JSON.parse(sessionStorage.getItem("LoginDetails"));
$(document).ready(function () {
    GetMemberProfilebyId();
})

/*Get vender details by id*/
function GetVendorDetailbyId() {
    var formData = new FormData();
    formData.append("loginid", EncodeText(userDetails.Id));
    $.ajax({
        type: "POST",
        url: "/api/VendorRegistration/GetProfileCardView",
        data: formData,
        dataType: 'json',
        contentType: false,
        processData: false,
        success: function (response) {
            var statecode = response[0].StateCode == "0" ? "" : response[0].StateCode;
            var pincode = response[0].Pincode == "0" ? "" : response[0].Pincode;
            var IfscCode = response[0].IfscCode == "undefined" ? "" : response[0].IfscCode;
            var AccountHolder = response[0].AccountHolder == "undefined" ? "" : response[0].AccountHolder;
            var custmvndrId = response[0].CustomVendorId == null ? "" : response[0].CustomVendorId;
            var msme = response[0].MSMERegNo == null ? "" : response[0].MSMERegNo;
            var certinc = response[0].CertificateIncorporate == null ? "" : response[0].CertificateIncorporate;
            var micr = response[0].MICRNumber == null ? "" : response[0].MICRNumber;
            var sacategory = response[0].sacdescription == null ? "" : response[0].sacdescription;
            var sacode = response[0].vndrSaccode == null ? "" : response[0].vndrSaccode;
            $("#vndrprofilediv").append(`<h3>` + response[0].Name + `</h3><br/><h4>` + 'Vendor Custom Id : ' + custmvndrId + `</h4>
              <hr>
              <div class=row>
              <div class="col-md-4">
              <p><strong>Email Id: </strong>`+ response[0].EmailId + `</p>
              </div>
              <div class="col-md-4">
              <p><strong>Contact Person: </strong>`+ response[0].ContactPerson + `</p>
              </div>
              <div class="col-md-4">
              <p><strong>Contact Number: </strong>`+ response[0].ContactNumber + `</p>
               </div>
              </div>
              <br/>
              <div class=row>
              <div class="col-md-4">
             <p><strong>Alternate Contact: </strong>`+ response[0].AlternateContact + `</p>
              </div>
              <div class="col-md-4">
              <p><strong>PAN Number: </strong>`+ response[0].PAN_No + `</p>
              </div>
              <div class="col-md-4">
              <p><strong>Aadhar Number: </strong>`+ response[0].AadharNumber + `</p>
               </div>
              </div>
              <br/>
              <div class=row>
              <div class="col-md-4">
              <p><strong>GST Number: </strong>`+ response[0].GSTNumber + `</p>
              </div>
              <div class="col-md-4">
              <p><strong>Category: </strong>`+ response[0].vendorcategory + `</p>
              </div>
              <div class="col-md-4">
              <p><strong>Vendor Type: </strong>`+ response[0].vendortype + `</p>
               </div>
              </div>
             <br/>
               <div class=row>
              <div class="col-md-4">
               <p><strong>Permanent Address: </strong>`+ response[0].PermanentAddress + `</p>
              </div>
              <div class="col-md-4">
               <p><strong>Residence Address: </strong>`+ response[0].ResidenceAddress + `</p>
              </div>
              <div class="col-md-4">
              <p><strong>Turn Over: </strong>`+ response[0].TurnOver + `</p>
               </div>
              </div>
               <br/>
              <div class=row>
              <div class="col-md-4">
              <p><strong>State: </strong>`+ response[0].statename + `</p>
              </div>
              <div class="col-md-4">
              <p><strong>State Code: </strong>`+ statecode + `</p>
              </div>
              <div class="col-md-4">
              <p><strong>Pin Code: </strong>`+ pincode + `</p>
               </div>
              </div>
              <br/>
              <div class=row>
              <div class="col-md-4">
              <p><strong>Gst Registration Number: </strong>`+ response[0].GSTNumber + `</p>
              </div>
              <div class="col-md-4">
              <p><strong>Bank Name: </strong>`+ response[0].BankName + `</p>
              </div>
              <div class="col-md-4">
              <p><strong>Account Number: </strong>`+ response[0].AccountNumber + `</p>
               </div>
              </div>
              <br/>
              <div class=row>
              <div class="col-md-4">
              <p><strong>Ifsc Code: </strong>`+ IfscCode + `</p>
              </div>
              <div class="col-md-4">
              <p><strong>Account Holder: </strong>`+ AccountHolder + `</p>
              </div>
              <div class="col-md-4">
              <p><strong>Branch: </strong>`+ response[0].Branch + `</p>
               </div>
              </div>
              <br/>
              <div class=row>
              <div class="col-md-4">
              <p><strong>MSME Reg. No: </strong>`+ msme + `</p>
              </div>
              <div class="col-md-4">
              <p><strong>Incorporation Certificate Num: </strong>`+ certinc + `</p>
              </div>
              <div class="col-md-4">
              <p><strong>MICR Number: </strong>`+ micr + `</p>
               </div>
              </div>
              <br/>
              <div class=row>
              <div class="col-md-4">
              <p><strong>SAC Code: </strong>`+ sacode + `</p>
              </div>
              <div class="col-md-4">
              <p><strong>SAC Category: </strong>`+ sacategory + `</p>
              </div>
              <div class="col-md-4">
               </div>
              </div>
              <br/>
              `)
            $.each(response, function (i, a) {
                if (a.CustomFieldName != "") {
                    $("#vndrprofilediv").append(`<div class="row"><div class="col-md-4"><p><strong>` + a.CustomFieldName + `: </strong>` + a.CustomFieldValue + `</p></div><div class="col-md-4"></div><div class="col-md-4"></div></div><br/>`)
                }
            })
        },
        failure: function (response) {
            alert(data.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            alert(data.responseText);
        } //End of AJAX error function
    });
}