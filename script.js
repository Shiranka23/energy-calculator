// Personal Information
var firstNameInput = document.getElementById("first-name-input");
var lastNameInput = document.getElementById("last-name-input");
var addressInput = document.getElementById("address-input");
var phoneInput = document.getElementById("phone-input");
var emailInput = document.getElementById("email-input");

// Site Information
var roofTypeSelect = document.getElementById("roof-type-select");
var yearlyConsumptionInput = document.getElementById("yearly-consumption-input");
var heatSourceSelect = document.getElementById("heat-source-select");
var heatingAreaInput = document.getElementById("heating-area-input");
var ownCarCheckbox = document.getElementById('own-car-checkbox');
var carConsumptionInput = document.getElementById("car-consumption-input");
var houseDirectionSelect = document.getElementById('house-direction-select');

// Battery Info
var batterySizeInput=document.getElementById('battery-size');

// Roof Area
var roofAreaInput=document.getElementById('roof-area');

var submitButton = document.getElementById("submitButton");
 
 // Adding event listener in submit button
 submitButton.addEventListener("click", function() {
     console.log();
     // Access and log the values of the input fields
     var heatingArea = heatingAreaInput.value;
     if (heatSourceSelect.value==='electric'){
         var heatingUsage = parseFloat(heatingArea*4*5);
        }
        else{
            heatingUsage=0;
        }
        if (ownCarCheckbox.value==='yes'){
            carEnergyConsumption=(carConsumptionInput.value/4.7998);
        }
        else{
            carEnergyConsumption=0;
        }
        totalEnergyConsumption=yearlyConsumptionInput.value+heatingUsage
        console.log(typeof totalEnergyConsumption);
    // console.log(totalEnergyConsumption);


 });