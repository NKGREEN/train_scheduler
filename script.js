  $(document).ready(function () 

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyByeB0uGtz6cAWzBFoXivQvijL7qhESg8M",
    authDomain: "my-awesome-project-bff8c.firebaseapp.com",
    databaseURL: "https://my-awesome-project-bff8c.firebaseio.com",
    projectId: "my-awesome-project-bff8c",
    storageBucket: "my-awesome-project-bff8c.appspot.com",
    messagingSenderId: "196037992646"
  };

    // created variable to represent the database
    var database = firebase.database();

    //create an event listener to capture new train after user clicks button to submit
    $('#submitNewTrain').on('click', function (event) {
        // event.preventDefault(); //not needed sine button type is "button" not "submit"
        // console.log("button clicked");
        var trainName = $('#trainName').val().trim();
        var frequency = $('#frequency').val().trim();
        var destination = $('#destination').val().trim();
        //goal of moment is to calc time using the year method for the correct timezone that user needs
        var firstTrainTime = $('#firstTrainTime').val().trim();
        // console.log(moment().format());
        // var convertedTime = moment(firstTrainTime, "hh:mm").substract(1, "years");
        //var convertedTime = moment(firstTrainTime, "hh:mm").format("X");
        // .subtract(1, "years").format("X");

        //this console log should display an object from moment
        //what `moment(firstTrainTime, "hh:mm")` is doing is _parsing_ your user input and giving us a moment object which we can do many things with (add/subtract/format/diff/etc.)
        // console.log(moment(firstTrainTime, "hh:mm"));

        // console.log(convertedTime);
        // console.log.apply(convertedTime);

        // create local temporary object for holding new train data
        var newTrain = {
            Name: trainName,
            Destination: destination,
            Time: firstTrainTime,
            frequency: frequency,
        };

        //push adds user data to firebase db
        database.ref().push(newTrain);
        // console.log(trainName);
        // console.log(destination);
        // console.log(firstTrainTime);
        // console.log(frequency);

        // alert('train added!');

        //clear out user input boxes
        $('#trainName').val('');
        $('#destination').val('');
        $('#firstTrainTime').val('');
        $('#frequency').val('');
        //app needs to determine when next train arrives?
        return false; 
    }) //end of onclick event

    database.ref().on('child_added', function(childSnapshot, prevChildKey) {
        console.log("snapshot child" + childSnapshot.val());

    //store childSnapshots in variables
    var trainName = childSnapshot.val().Name;
    var destination = childSnapshot.val().Destination;
    var firstTrainTime = childSnapshot.val().Time;
    var frequency = childSnapshot.val().frequency;

        // console.log(trainName);
        // console.log(destination);
        // console.log(firstTrainTime);
        // console.log(frequency);
    // })

    //store user input in hh:mm format into new variable
    var firstTimeFormatted = moment(firstTrainTime, 'hh:mm').subtract(1, 'years')
    console.log ("first time formatted" + firstTimeFormatted);
    // OLD: var trainTime = moment.unix(firstTrainTime).format("X");
    // console.log("this is the train time: " + trainTime);

            // crete new variable storing the difference between the times?
            var timeDifference = moment().diff(moment(firstTrainTime),'minutes');

            // store only the remainder of timeDifference divided by frequency in variable
            var remainingTime = timeDifference % frequency;

            //store minutes until next arrival in new variable
            var minutesUntilArrival = frequency - remainingTime;

            //add minutes Until arrival to current time to get New arrival time in hh:mm; store in new var
            var nextArrival = moment().add(minutesUntilArrival, "minutes").format('hh:mm');
            console.log("this is the arrival", nextArrival);

    //Dynamically append user input to table in DOM
    $("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minutesUntilArrival + "</td></tr>");
})
