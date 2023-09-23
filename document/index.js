const formatDateToString = require('../utils/formatDateToString');

module.exports = (data) => {

    const { 
        patientName,
        patientAge,
        patientGender,
        patientUserId,
        patientAadhaar,
        patientEmail,
        patientPhone,
        vaccineName,
        doseNo,
        vaccinatedOn,
        doctorName,
        doctorAadhaar,
        hospitalName,
        pincode,
        fullyVaccinated,
        nextDose,
        remainingNoOfDose,
        certificateId
    } = data;

    return (
        `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Certificate</title>
                <style>
                    .bg-white{
                        background-color: white !important;
                    }
                    .w-75{
                        width: 75% !important;
                    } 
                    .mx-auto{
                        margin: 0 auto !important;
                    } 
                    .d-flex{
                        display: flex !important;
                    } 
                    .d-inline{
                        display: inline-flex;
                    }
                    .my-3 {
                        margin-top: 0.75rem !important;
                        margin-bottom: 0.75rem !important;
                    }
                    .py-5{
                        padding-top: 3.125rem !important;
                        padding-bottom: 3.125rem !important;
                    }
                    .m-auto{
                        margin: auto;
                    }
                    .text-center{
                        text-align: center !important;
                    } 
                    .text-white{
                        color: white !important;
                    }
                    .text-primary{
                        color: rgb(0,123,255) !important;
                    } 
                    .text-black{
                        color: black !important;
                    }
                    .text-success{
                        color: green !important;
                    }
                    .font-weight-bold{
                        font-weight: bold !important;
                    }
                    .container{
                        width: 90% !important;
                        margin: auto !important;
                    }
                    .text-decoration-underline{
                        text-decoration: underline !important;
                    }
                    .row{
                        flex-direction: row !important;
                    }
                    .col{
                        flex-direction: column !important;
                    }
                    .bg-danger{
                        background-color: red !important;
                    }
                    .bg-success{
                        background-color: green !important;
                    }
                    .rounded{
                        border-radius: 5px !important;
                    }
                    .badge{
                        padding: 4px !important;
                        font-size: 12px !important;
                    }
                    .font18{
                        font-size: 18px !important;
                    }
                    .font20{
                        font-size: 20px !important;
                    }
                </style>
            </head>
            <body>
                <div class="certificate bg-white w-75 mx-auto d-flex py-5">
                    <div class="m-auto w-75">
                        <div class="certificateHeader">
                            <div>
                                <h1 class="text-center text-success">AVS</h1>
                                <h3 class="text-center text-black">Vaccine Ensured, Life Secured!</h3>
                            </div>
                            <div>
                                <h2 class="text-center text-primary font-weight-bold">${fullyVaccinated ? "Final " : ""}Certificate for ${vaccineName} Vaccination.</h2>
                                <h3 class="text-center text-primary font-weight-bold my-3">issued by Ministry of health & family welfare.</h3>
                                <h4 class="text-center font-weight-bold text-black my-3">Certificate ID : ${certificateId}</h4>
                            </div>
                        </div>
                        <hr />
                        <div class="certificateBody">
                            <h4 class="my-3 text-primary text-decoration-underline">Patient Details</h4>
                            <div class="container text-black">
                                <p class="my-3 font20">Patient Name : <span class="font-weight-bold">${patientName}</span></p>
                                <p class="my-3 font20">Age : <span class="font-weight-bold">${patientAge}</span></p>
                                <p class="my-3 font20">Gender : <span class="font-weight-bold">${patientGender}</span></p>
                                <p class="my-3 font20">User Id : <span class="font-weight-bold">${patientUserId}</span></p>
                                <p class="my-3 font20">Patient Aadhaar : <span class="font-weight-bold">${patientAadhaar}</span></p>
                                <p class="my-3 font20">Patient email : <span class="font-weight-bold">${patientEmail}</span></p>
                                <p class="my-3 font20">Patient phone : <span class="font-weight-bold">${patientPhone}</span></p>
                            </div>
                            <hr />
                            <h4 class="my-3 text-primary text-decoration-underline">Vaccination Details</h4>
                            <div class="container text-black">
                                <p class="my-3 font20">Vaccine Name : <span class="font-weight-bold">${vaccineName}</span></p>
                                <p class="my-3 font20">Dose Number : <span class="font-weight-bold">${doseNo}/${doseNo + remainingNoOfDose}</span></p>
                                <p class="my-3 font20">Vaccinated On : <span class="font-weight-bold">${formatDateToString(vaccinatedOn)}</span></p>
                                <p class="my-3 font20">Vaccinated By : <span class="font-weight-bold"> Dr.${doctorName} / ${doctorAadhaar}</span></p>
                                <p class="my-3 font20">Vaccinated At : <span class="font-weight-bold">${hospitalName} / ${pincode}</span></p>
                                ${
                                    fullyVaccinated ?
                                    `<p class="my-3 font20"> Vaccinated Status : <span class="badge bg-success rounded text-white font18">Fully Vaccinated</span></p>` : 
                                    `<p class="my-3 font20"> Vaccinated Status : <span class="badge bg-danger rounded text-white font18">Partially Vaccinated</span></p>
                                    <p class="my-3 font20">Remaining Dose Number : <span class="font-weight-bold">${remainingNoOfDose}</span></p>
                                    <p class="my-3 font20">Next Dose after : <span class="font-weight-bold">after ${nextDose}</span></p>`
                                }
                            </div>
                            <hr />
                            <div class="container d-flex">
                                <div class="w-75">
                                    <h1 class="text-success">AVS</h1>
                                    <p class="text-black font20">Vaccine Ensured, Life Secured!</p>
                                    <small class="text-black">
                                        visit <a target="_blank" class="text-primary" href="https://anand-vaccination-system.netlify.app/">@anand-vaccination-system</a> for more info.
                                    </small>
                                </div>
                                <div class="w-25 qrcode-container"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        </html>
        `
    )
};