<?php

    //requesting info
    $inData = getRequestInfo();

    $conn = new mysqli("localhost", "Admin", "Team7", "SmallProject");

    if($conn->connect_error )
    {
	    returnWithError($conn->connect_error);
    } else {
        // $id = $inData["userId"];
        $oldFname = $inData["oldFirstName"];
        $oldLname = $inData["oldLastName"];
        $email = $inData["email"];
        $phone = $inData["phone"];
        $newFname = $inData["newFirstName"];
        $newLname = $inData["newLastName"];

        // fetch current contact info before updating
        $selectQuery = "SELECT * FROM Contacts WHERE FirstName='$oldFname' AND LastName='$oldLname'";
        $result = $conn->query($selectQuery);

        if($result->num_rows > 0) {
            // fetch info
            $row = $result->fetch_assoc();
            $id = $row["ID"];
            $currentFname = $row["FirstName"];
            $currentLname = $row["LastName"];
            $currentPhone = $row["Phone"];
            $currentEmail = $row["Email"];

            returnWithOldInfo($id, $currentFname, $currentLname, $currentPhone, $currentEmail);
        } else {
            returnWithError("Contact with current info not found");
        }

        //old query
        //$query = "UPDATE Contacts SET FirstName='$oldFname', LastName='$oldLname', Phone='$phone', Email='$email' WHERE ID='$id'";

        //new query after meeting
        $query = "UPDATE Contacts SET FirstName='$newFname', LastName='$newLname', Phone='$phone', Email='$email' WHERE FirstName='$oldFname' AND LastName='$oldLname'";

		mysqli_query($conn,$query);

        $conn->close();

        //old
        //returnWithInfo($id, $oldFname, $oldLname,  $phone, $email);

        //new
        returnWithNewInfo($id, $newFname, $newLname, $phone, $email);

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
		$retValue = '{"id":0,"FirstName":"","LastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

    // function returnWithInfo( $id, $oldFirstName, $oldLastName, $phone, $email)
	// {
	// 	$retValue = '{"id":' . $id . ',"oldFirstName":"' . $oldFirstName . '","oldLastName":"' . $oldLastName . '","phone":"' . $phone . '", "email":"' . $email . '""error":""}';
	// 	sendResultInfoAsJson( $retValue );
	// }

    function returnWithOldInfo( $id, $oldFirstName, $oldLastName, $phone, $email)
    {
        $retValue = '{"id":' . $id . ',"oldFirstName":"' . $oldFirstName . '","oldLastName":"' . $oldLastName . '","phone":"' . $phone . '", "email":"' . $email . '""error":""}';
        sendResultInfoAsJson( $retValue );
    }

    function returnWithNewInfo( $id, $newFirstName, $newLastName, $phone, $email)
    {
        $retValue = '{"id":' . $id . ',"newFirstName":"' . $newFirstName . '","newLastName":"' . $newLastName . '","phone":"' . $phone . '", "email":"' . $email . '""error":""}';
        sendResultInfoAsJson( $retValue );
    }

?>