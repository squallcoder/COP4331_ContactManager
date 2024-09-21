<?php

//requesting info
$inData = getRequestInfo();
$UserID = $inData["userId"];
$FirstName = $inData["firstName"];
$LastName = $inData["lastName"];

$output = '';

// connect to database
$conn = new mysqli("localhost", "Admin", "Team7", "SmallProject");
if($conn->connect_error )
{
	returnWithError($conn->connect_error);
}
else
{
    $searchq = $_POST['search']; //creating a serach query var
    $searchq = preg_replace("#[^0-9a-z]#i","",$searchq); //only searching for letters and numbers and anything else gets ignored

    //sql query to search
    $query = mysqli_query($con, "SELECT ALL FROM Contacts WHERE UserID = '$UserID' AND FirstName LIKE '%$searchq%' OR LastName LIKE '%$searchq%'") or die ("could not search!"); //using either first or last name

    //count query
    $count = mysqli_num_rows($query); //returns rows that are like the search
    if($count == 0){
        $output = 'There was no search results!';
    } else{
        //this is what searches the table
        while($row = mysqli_fetch_array($query)){
            $fname = $row['firstname'];
            $lname = $row['lastname'];
            $id = $row['id'];

            //output info we collect
            $output .= '<div> '.$fname.' '.$lname.' <div>';
        }
    }

    //print the info on the page
    print("$output");

    $conn->close();
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