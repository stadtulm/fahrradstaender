//Author:   Unknown, TH Ulm
//Edited:   Louis Petrick
//          louis.petrick@thu.de
//          Sep, 2021

//Code for payload evaluation within Node Red enviroment for "Fahrradständer_2"
//This code requires the usage of the payload formatter for "ELSYS_pf.js" within the designated device (currently "Fahrradstaender2") in TTN.
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


fields["bat_vol"] = vdd;
fields["time"] = new Date().getTime() * 1000 * 1000;

msg.payload = [fields,{"ID":"Fahrradständer_2","measuretime":"network"}];
return msg;