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
var batterySizeInput = document.getElementById('battery-size');

// Roof Area
var roofAreaInput = document.getElementById('roof-area');

var submitButton = document.getElementById("submitButton");

 // Direction wise solar production with specific city(current data=copenhegan,Denmark) data in kWh
 south = [17.494, 34.523, 70.247, 96.248, 132.192, 137.706, 133.241, 115.048, 70.268, 46.308, 18.794, 13.286];
 southEast = [16, 32, 65, 92, 128, 135, 131, 110, 68, 43, 17, 12];
 southWest = [15, 31, 67, 94, 130, 136, 130, 112, 67, 43, 17, 12];
 eastWest = [10, 23, 56, 84, 120, 128, 121, 102, 59, 34, 13, 8];

// Monthly Consumption fraction
const monthlyConsumptionPercentage = [0.0951, 0.0891, 0.0899, 0.0800, 0.0781, 0.0753, 0.0733, 0.0774, 0.0760, 0.0829, 0.0878, 0.0951];

 // Total number of months
 const months = ['Januray', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Battery specification
const [BatteryDOD, BatteryEfficiency, BatteryDegradationPerAnnum] = [100, 95, 3]; // all the data is in % 

// PV size &  per panel cost that we can have
const [Longi410AllBlack, ASTROENERGY405, JASolar545BIG, Trina415AllBlack] = [[410, 1147], [405, 1201], [545, 1280], [415, 1243]];


// Selecting appropriate inverter with battery
// A B C D E F G H I J K L M N O P Q R = 2 5 6 8 10 13 15 18 20 25 28 35 40 45 48 50 ALL THE VALUE ARE IN KW
const inverterList = [[2.40, 6595.875], [6.00, 12218.375], [7.20, 13676], [9.60, 16172], [12.00, 18187], [15.60, 28390], [18.00, 30405], [21.60, 34359], [24.00, 36374], [30.00, 48592], [33.60, 52546], [36.00, 54561], [42.00, 66779], [45.60, 70733], [48.00, 72748], [54.00, 84966], [57.60, 88920], [60.00, 90935]];

 
// A, B, C, D, E, F, G, H, I, J, K = 2 5 6 8 10 12 15 20 30 40 50
// AB =[2.40,6595.875] is category=[value,price]
const hybrideInverter = [[2.40, 6595.875], [6.00, 12218.375], [7.20, 13676], [9.60, 16172], [12.00, 18187], [14.40, 18676.125], [18.00, 21108.75], [24.00, 22766.25], [36.00, 0], [48.00, 0], [60.00, 27007.5]]

const mountingCategoryPrice = [[8, 17500], [16, 21000], [20, 24000], [26, 26000], [30, 28000], [37, 29000], [50, 39000], [66, 60000]];

const batteryPrice = [31300, 53000, 76000];

const perPanelWSlopCharge = 447;
const perPanelFlatCharge = 683;

const HuaweiSmartMeter1fasetPrice = 833.625;
const HuaweiSmartMeter3fasetPrice = 1527.5;

const ConsumptionIncreasePerYear = 0.05; // in % 
const nthYear = 23;


// Function to calculate total production for a given direction
function yearlySum(houseDirection){
    const productionData={
        south:south,
        southwest:southWest,
        southeast:southEast,
        eastwest:eastWest
    };
    return productionData[houseDirection].reduce((a,b)=>a+b,0);
}

// Calculating monthly consumption
function calculateMOnthlyConsumption(totalEnergyConsumption){
    const monthlyConsumption={};
    for (let i = 0; i < months.length; i++) {
        const month = months[i];
        const consumption = totalEnergyConsumption * parseFloat(monthlyConsumptionPercentage[i]);
        monthlyConsumption[month] = (Number((consumption).toPrecision(6)));
    }
    return monthlyConsumption;
}
function calculateTotalCost(PVSize,panelQty,panelPrice,AdditionalCost){
    // customer Battery Selected Size
    const batterySize = batterySizeInput.value;
    const batteryCost = batterySize>0?batteryPrice[(batterySize / 5) - 1]:batteryPrice[2];
    
    var mountingAndInstallationPrice = 0;
    for (let i = 0; i < mountingCategoryPrice.length; i++) {
        if ((panelQty <= mountingCategoryPrice[i][0]) && panelQty <= mountingCategoryPrice[mountingCategoryPrice.length - 1][0]) {
            mountingAndInstallationPrice = mountingCategoryPrice[i][1];
            break;
        }
    }
    
    
    var [InverterPrice,hybrideInverterPrice] = [0,0];
    // Calculating Which inverter is suitable
    for (let i = 0; i < inverterList.length; i++) {
        if ((PVSize <= inverterList[i][0]) && PVSize <= inverterList[inverterList.length - 1][0]) {
            InverterPrice = inverterList[i][1];
            break;
        }
    }
    
    for (let i = 0; i < hybrideInverter.length; i++) {
        if ((PVSize <= hybrideInverter[i][0]) && PVSize <= hybrideInverter[hybrideInverter.length - 1][0]) {
            hybrideInverterPrice = hybrideInverter[i][1];
            break;
        }
    }
    // console.log("InverterPrice ", InverterPrice);
    // console.log("hybrideInverterPrice ", hybrideInverterPrice);
    // console.log('mountingAndInstallationPrice ', mountingAndInstallationPrice);

    var SystemCostWithBattery = panelPrice + InverterPrice  + batteryCost + AdditionalCost+mountingAndInstallationPrice;
    var SystemCostWithoutBattery = panelPrice + hybrideInverterPrice + AdditionalCost+mountingAndInstallationPrice;
    if (batteryCost>0){
        var inverter=inverterList;
    }else{
        inverter=hybrideInverter;
    }
    return {
        SystemCostWithBattery : Math.round(SystemCostWithBattery / 1000) * 1000,
        SystemCostWithoutBattery : parseInt(SystemCostWithoutBattery / 1000) * 1000,
        inverter
    };

}

// Adding event listener in submit button
// class AstroEnergi{
submitButton.addEventListener("click",calculate=(event)=>{
        event.preventDefault();
        console.log();
    //  Extracting and log personal info
    var firstname = firstNameInput.value;
    var lastname = lastNameInput.value;
    var address = addressInput.value;
    var email = emailInput.value;

    // Extract site info
    var roofType = roofTypeSelect.value;
    var yearlyConsumption = yearlyConsumptionInput.value;

    // calculating heating usage based on heat source
    var heatingArea=parseFloat(heatingAreaInput.value);
    var heatSource =heatSourceSelect.value;
    var heatingUsage = heatSource === 'electric' ? heatingArea * 4 * 5 : 0;
    // console.log(heatingArea,heatSource);
    // Car Energy consumption
    const carConsumption = parseFloat(carConsumptionInput.value);
    const carEnergyConsumption = ownCarCheckbox.value === 'yes' ? parseFloat(carConsumption / 4.8) : 0;
    
    // calculate total energy consumption
    var totalEnergyConsumption = parseFloat(yearlyConsumptionInput.value) + parseFloat(heatingUsage) + parseFloat(carEnergyConsumption);
    totalEnergyConsumption = (Number(totalEnergyConsumption.toPrecision(7)));
    // console.log('1',yearlyConsumptionInput.value,'2',heatingUsage,'3',carEnergyConsumption);
    
    // Ccalculatin monthly consumption
    const monthlyConsumption = calculateMOnthlyConsumption(totalEnergyConsumption);

    // Total Production For 1 kWp System in four house directions 
    var houseDirection = houseDirectionSelect.value;
    const directionalYrlySum = yearlySum(houseDirectionSelect.value);
    
    // Total System Size Needed
    RequiresPVSize = parseFloat((Number(totalEnergyConsumption / directionalYrlySum).toPrecision(5)));
    
    // Maximum Capacity as per Roof Size
    var roofArea = roofAreaInput.value;
    maxRoofCapacity = ((roofArea * 410) / 2) / 1000;

    var remark = RequiresPVSize > maxRoofCapacity ? "Warning your roof may not fit the required capacity" : "All Ok ";
    
    const monthlyCompundedComsumption = {};
    for (let i = 0; i < months.length; i++) {
        const monthlyCompundedComsumption = {};
        const month = months[i];
        const consumption = monthlyConsumption[month] * Number((Math.pow((1 + ConsumptionIncreasePerYear), (nthYear - 1))).toPrecision(5));
        monthlyCompundedComsumption[month] = (Number((consumption).toPrecision(6)));
    }

    // Calculating Panel Quantity & Panel Price
    const panelQty = parseInt((RequiresPVSize * 1000) / Longi410AllBlack[0]);
    const panelPrice = panelQty * Longi410AllBlack[1];
    
    // Getting PV size
    PVSize = (Longi410AllBlack[0] * panelQty) / 1000
    
    const mountingWSlope = panelQty * perPanelWSlopCharge;
    const mountingFlatSlope = panelQty * perPanelFlatCharge;
   
    const RCD = PVSize > 10 ? 1462.5 : 1137.5;

    const AdditionalCost=mountingWSlope+RCD+HuaweiSmartMeter3fasetPrice;
    
    const {SystemCostWithBattery,SystemCostWithoutBattery,inverter}=calculateTotalCost(PVSize,panelQty,panelPrice,AdditionalCost);
    // console.log('car Energy ', carEnergyConsumption);
    // console.log('totalEnergyConsumption', totalEnergyConsumption);
    // console.log('monthlyConsumption ', monthlyConsumption);
    // console.log('Total Production For 1 kWp System in house direction ', directionalYrlySum, 'KWh');
    // console.log('Total System Size Needed ', RequiresPVSize, 'kWp');
    // console.log('Maximum Capacity as per Roof Size', maxRoofCapacity, 'kWp');
    // console.log("Total Panel Cost ", panelQty);
    // console.log('mountingWSlope ', mountingWSlope);
    // console.log('HuaweiSmartMeter3fasetPrice ', HuaweiSmartMeter3fasetPrice);
    // console.log('PVSize ', PVSize);
    // console.log('RCD ', RCD);
    console.log("Remark ", remark);
    msg="Note: if battery is not selected default battery size 15kw is taken for calculation";
    console.log('SystemCostWithBattery ', SystemCostWithBattery,msg);
    console.log('SystemCostWithoutBattery ', SystemCostWithoutBattery);

   
    localStorage.setItem('sysSize',JSON.stringify(RequiresPVSize));
    localStorage.setItem('sysWOBattery',JSON.stringify(SystemCostWithoutBattery));
    localStorage.setItem('sysWbattery',JSON.stringify(SystemCostWithBattery));
    localStorage.setItem('panelCount',JSON.stringify(panelQty));
    localStorage.setItem('panelArea',JSON.stringify(roofArea*2));

    
    // var value=document.createElement('p');
    // value.innerHTML=userData;
    // sysSize.append(value);
    console.log(document.location);
    urlOrigin=document.location.origin;
    window.open(urlOrigin+'/result.html');
    return {SystemCostWithBattery,SystemCostWithoutBattery,RequiresPVSize,panelQty,roofArea,RCD,inverter}
});


