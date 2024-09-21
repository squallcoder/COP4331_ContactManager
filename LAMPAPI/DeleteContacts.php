<?php

    //requesting info
    $inData = getRequestInfo();

        $fName = $inData["firstName"];
	$lName = $inData["lastName"];
	$userID= $inData["userID"];
    $conn = new mysqli("localhost", "Admin", "Team7", "SmallProject");

    if($conn->connect_error )
    {
	    returnWithError($conn->connect_error);
    } else {

        // defining vars

	$query = "DELETE FROM Contacts WHERE UserID='$userID' AND FirstName='$fName' AND LastName='$lName'";
        mysqli_query($conn,$query);

        $conn->close();

        returnWithInfo( $fName, $lName);

    }

    function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

    function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

    function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

    function returnWithInfo( $firstName, $lastName)
	{
		$retValue = '{"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
    
