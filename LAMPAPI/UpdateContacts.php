<?php

    //requesting info
    $inData = getRequestInfo();

    $conn = new mysqli("localhost", "Admin", "Team7", "SmallProject");

    if($conn->connect_error )
    {
	    returnWithError($conn->connect_error);
    } else {
        $id = $inData["userId"];
        $oldFname = $inData["oldFirstName"];
        $oldLname = $inData["oldLastName"];
        $phone = $inData["phone"];
        $email = $inData["email"];
        $newFname = $inData["newFirstName"];
        $newLname = $inData["newLastName"];

        //old query
        //$query = "UPDATE Contacts SET FirstName='$oldFname', LastName='$oldLname', Phone='$phone', Email='$email' WHERE ID='$id'";

        //new query after meeting
        $query = "UPDATE Contacts SET FirstName='$newFname', LastName='$newLname', Phone='$phone', Email='$email' WHERE FirstName='$oldFname' AND LastName='$oldLname'";

		mysqli_query($conn,$query);

        $conn->close();

        //old
        //returnWithInfo($id, $oldFname, $oldLname,  $phone, $email);

        //new
        returnWithInfo($id, $newFname, $newLname,  $phone, $email);

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
		$retValue = '{"id":0,"oldFirstName":"","oldLastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

    function returnWithInfo( $id, $oldFirstName, $oldLastName, $phone, $email)
	{
		$retValue = '{"id":' . $id . ',"oldFirstName":"' . $oldFirstName . '","oldLastName":"' . $oldLastName . '","phone":"' . $phone . '", "email":"' . $email . '""error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>