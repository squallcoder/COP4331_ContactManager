<?php

// Requesting info
$inData = getRequestInfo();
$UserID = $inData["userId"];
$FirstName = $inData["firstName"];
$LastName = $inData["lastName"];

// Connect to database
$conn = new mysqli("localhost", "Admin", "Team7", "SmallProject");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $searchq = $inData['search']; // Creating a search query var
    $searchq = preg_replace("#[^0-9a-z]#i", "", $searchq); // Only searching for letters and numbers and anything else gets ignored

    // SQL query to search
    $query = mysqli_query($conn, "SELECT * FROM Contacts WHERE UserID = '$UserID' AND (FirstName LIKE '%$searchq%' OR LastName LIKE '%$searchq%')"); // Using either first or last name

    // Count query
    $count = mysqli_num_rows($query); // Returns rows that are like the search
    if ($count == 0) {
        returnWithError("No search results found!");
    } else {
        while ($row = mysqli_fetch_array($query)) {
            $fname = $row['FirstName'];
            $lname = $row['LastName'];
            $id = $row['ID'];

            // Output info we collect
            returnWithInfo($fname, $lname);
        }
    }

    $conn->close();
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
