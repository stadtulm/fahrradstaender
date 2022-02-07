//Author:   Unknown, TH Ulm
//Edited:   Louis Petrick
//          louis.petrick@thu.de
//          Sep, 2021

//Code for payload evaluation within Node Red enviroment for "Fahrradständer_1"
//The code for "Fahrradständer1" is uniqe, since it is in charge of adding up all slots from the different "Fahrradständer"-flows in Node RED
//This code requires the usage of the payload formatter for "ELSYS_pf.js" within the designated device (currently "Fahrradstaender1") in TTN.
//For more details, see IAS_Schlick\02_TTN_payload_formatters/ELSYS_pf.js

//Define the variables
var slot2 = msg.payload.uplink_message.decoded_payload.analog1;     //slot2 = analog 1, mixed up the inputs while connecting the pressure sensors on "Fahrradstaender1" and "Fahrradstaender2"
var slot1 = msg.payload.uplink_message.decoded_payload.analog2; 
var vdd = msg.payload.uplink_message.decoded_payload.vdd;
var fields = {};

//Prepare data structure
fields["Fahrradzahl"] = 0;
fields["Fehler_Analog1"] = 0;
fields["Fehler_Analog2"] = 0;
fields["Stellplatz1"] = 0;
fields["Stellplatz2"] = 0;


//Evaluate slot 1 (analog 2)
if ((slot1 / vdd) > 0.6){
    fields["Stellplatz1"] = 1;
}
//Evaluate slot 2 (analog 1)
if ((slot2 / vdd) > 0.6){
    fields["Stellplatz2"] = 1;
}


//Test for cable break on slot 1
if (slot1 === 0){
    fields["Fehler_Analog1"] =  1;
}
//Test for cable break on slot 2
if (slot2 === 0){
    fields["Fehler_Analog2"] =  1;
}


//Calculating the overall bike-count by adding up all slots from the four different "fahrradständer"-flows within Node RED
fields["Fahrradzahl"] = fields["Stellplatz1"] + fields["Stellplatz2"] + global.get("Stellplatz21") + global.get("Stellplatz22") + global.get("Stellplatz31") + global.get("Stellplatz32"); + global.get("Stellplatz41") + global.get("Stellplatz42");
fields["bat_vol"] = vdd;
fields["time"] = new Date().getTime() * 1000 * 1000;

msg.payload = [fields,{"ID":"Fahrradständer_1","measuretime":"network"}];
return msg;