<?php

//requesting info
$inData = getRequestInfo();

$conn = new mysqli("localhost", "Admin", "Team7", "SmallProject");
mysqli_select_db ($conn, "Contacts") or die ("could not find db"); //added this to see if it would work to solve the 500

if( $conn->connect_error )
{
	returnWithError( $conn->connect_error );
}
else
{
    // defining vars
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $Phone = $inData["phone"];
    $Email = $inData["email"];
    $UserID = $inData["userID"];

    // call the function to add the contact
    addContact($conn, $firstName, $lastName, $Phone, $Email, $UserID);

    $conn->close();
}

// create contact function
function addContact($conn, $FirstName, $LastName, $Phone, $Email, $UserID){
    $FirstName = mysqli_real_escape_string($conn, $FirstName);
    $LastName = mysqli_real_escape_string($conn, $LastName);
    $Phone = mysqli_real_escape_string($conn, $Phone);
    $Email = mysqli_real_escape_string($conn, $Email);
    $UserID = mysqli_real_escape_string($conn, $UserID);

    // insert contact into the database CHECK THIS
    /* UPDATED SYNTAX AND VARIABLES -c*/
    $query = "INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES ('$FirstName', '$LastName', '$Phone', '$Email', '$UserID')";

    // checking if contact was created successfully by running a query
    if (mysqli_query($conn, $query)){
        //echo "Contact successfully created!";

    } else{
       // echo "Error creating contact.... please try again" . mysqli_error($conn);
    }
}

function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}


?>
