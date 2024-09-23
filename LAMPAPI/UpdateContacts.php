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
        $newFname = $inData["newFirstName"];
        $newLname = $inData["newLastName"];
        $email = $inData["email"];
        $phone = $inData["phone"];

        // fetch current contact info before updating
        $selectQuery = "SELECT * FROM Contacts WHERE FirstName='$oldFname' AND LastName='$oldLname'";
        $result = $conn->query($selectQuery);

        if($result->num_rows > 0) {
            // fetch id of contact to update
            $row = $result->fetch_assoc();
            $id = $row["ID"];
        } else {
            returnWithError("Contact with current info not found");
        }

        //new query after meeting
        $query = "UPDATE Contacts SET FirstName='$newFname', LastName='$newLname', Phone='$phone', Email='$email' WHERE FirstName='$oldFname' AND LastName='$oldLname'";

		mysqli_query($conn,$query);

        $conn->close();

        //new
        returnWithInfo($id, $newFname, $newLname, $phone, $email);

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

    function returnWithInfo( $id, $newFirstName, $newLastName, $phone, $email)
	{
		$retValue = '{"id":' . $id . ',"FirstName":"' . $newFirstName . '","LastName":"' . $newLastName . '","phone":"' . $phone . '", "email":"' . $email . '""error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>