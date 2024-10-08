<?php

// storing userID from login
session_start();
$UserID = $_SESSION['UserID'];

// Requesting info
$inData = getRequestInfo();
$userInput = $inData["search"];

if (strpos($userInput, ' ') !== false) {
    $userInput = explode(" ", $userInput);
    $FirstName = $userInput[0];
    $LastName = $userInput[1];
} else {
    $FirstName = $userInput;
    $LastName = $userInput;
}


// Connect to database
$conn = new mysqli("localhost", "Admin", "Team7", "SmallProject");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {

    // SQL query to search
    $query = "SELECT * FROM Contacts WHERE UserID = '$UserID' AND (FirstName LIKE '%$FirstName%' OR LastName LIKE '%$LastName%')"; // Using either first or last name
    mysqli_query($conn, $query);
    
    $conn->close();

    // Output info we collect
    returnWithInfo($FirstName, $LastName);
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($firstName, $lastName)
{
    $retValue = '{"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
	sendResultInfoAsJson( $retValue );
}

?>
