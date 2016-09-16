// Initialize Firebase
var config = {
	apiKey: "AIzaSyACieSoOZYL3O33lutnogvlg63qjqGXFOo",
	authDomain: "trainschedulerhw-b12de.firebaseapp.com",
	databaseURL: "https://trainschedulerhw-b12de.firebaseio.com",
	storageBucket: "",
};

firebase.initializeApp(config);

var database = firebase.database();
var rowNumber = 0;
var intialDataLoaded = false;
var dbTrainCount = 0;

$("#addTrainBtn").on("click",function(){

	//grabs user input
	var trainName = $("#trainName").val().trim();
	var destin = $("#destination").val().trim();
	var firstTrainTime = $("#firstTrTime").val().trim();
	var frequency = $("#frequency").val().trim();

	//creates a local temporary variable for holding train data

	var newTrain = {
		trainName: trainName,
		destination: destin,
		firstTrainTime: firstTrainTime,
		frequency: frequency
	}
	
	//uploads train data to the database
	database.ref().push(newTrain);

	console.log(newTrain.trainName);	
	console.log(newTrain.destination);
	console.log(newTrain.firstTrainTime);
	console.log(newTrain.frequency);	

	return false;

});

$(document).ready(function(){
//	if ( intialDataLoaded ) {
//		setInterval(function(){updateTime();},50000);
//	}
    
});



function setTrainTime(firstTrainTime, frequency, rowNo) {
	var currentTime = moment();
	console.log("CT:"+currentTime);
	console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));
	console.log("first train time:"+firstTrainTime);
	console.log("row no :"+rowNo );
	console.log("frequency: "+frequency);
	// First Time (pushed back 1 year to make sure it comes before current time)
	var firstTimeConverted = moment(firstTrainTime,"HH:mm").subtract(1, "years");
	console.log("firstTimeConvertd: "+ firstTimeConverted);

	console.log(moment(firstTrainTime,"HH:mm"));
	// Current Time
	var currentTime = moment();
	console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

	// Difference between the times
	var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
	console.log("DIFFERENCE IN TIME: " + diffTime);

	// Time apart (remainder)
	var tRemainder = diffTime % frequency;
	console.log(tRemainder);

	// Minute Until Train----------------
	var tMinutesTillTrain = frequency - tRemainder;
	console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

	// Next Train---------------------------------
	var nextTrainArrivalTime = moment().add(tMinutesTillTrain, "minutes")
	var nextTrArrivalTime = moment(nextTrainArrivalTime).format("HH:mm");
	console.log("ARRIVAL TIME: " + nextTrArrivalTime);

	$("#trATime"+rowNo).text(nextTrArrivalTime);
	$("#minTillTrain"+rowNo).text(tMinutesTillTrain);


} // end of settingTrainTime

function updateTime(){
	console.log("updateTime");
	var tempTrainFirstTime;
	var tempFrequency;

	for(var i = 0; i < rowNumber; i++ ){
			
		console.log("trainFirstTime: "+$("#trainFirstTime"+i).text());
		tempTrainFirstTime = $("#trainFirstTime"+i).text();
		tempFrequency = $("#frequency"+i).text();
		setTrainTime(tempTrainFirstTime, tempFrequency,i);
			
	}
						

} 

//creates firebase event for adding train details to the database and html page when anew train data added
database.ref().on("child_added",function(childSnapshot,prevChildKey){

  	console.log(childSnapshot.val());

  	var trainName = childSnapshot.val().trainName;
	var destin = childSnapshot.val().destination;
	var firstTrainTime = childSnapshot.val().firstTrainTime;
	var frequency = childSnapshot.val().frequency; 

	console.log(trainName);
	console.log(destin);
	console.log(firstTrainTime);
	console.log(frequency);

	var i = rowNumber;

	

	// Add each train's data into the table style=display:none
	$("#trainTableId > tbody").append("<tr><td>" + trainName + "</td>"+
										"<td>" + destin + "</td>	"+
										"<td id=trainFirstTime"+i+" >" + firstTrainTime + "</td>" +
										"<td id=frequency"+i+">" + frequency + "</td>" +
										"<td id=trATime"+i+"></td>" +
										"<td id=minTillTrain"+i+"></td></tr>");

	

	setTrainTime(firstTrainTime, frequency, rowNumber);
	rowNumber++;
	

			//setInterval(function(){updateTime();},6000);
		if (rowNumber >= dbTrainCount ) {
			intialDataLoaded = true;
			setInterval(function(){updateTime();},60000);
			console.log("timer start");	

		}

			

	   			

}, 
function (errorObject) {

  	console.log("The read failed: " + errorObject.code);

});

database.ref().once("value", function(snapshot) {
  var dbTrainCount = snapshot.numChildren();
  console.log("dbt: "+dbTrainCount);
  // a === 1 ("name")
  //var b = snapshot.child("name").numChildren());
  // b === 2 ("first", "last")
  //var c = snapshot.child("name/first").numChildren());
  // c === 0 (since "Fred" is a string)
});
//settingTrainTime();



