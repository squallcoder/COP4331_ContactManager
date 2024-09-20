<?php

    //requesting info
    $inData = getRequestInfo();

    $conn = new mysqli("localhost", "Admin", "Team7", "SmallProject");

    if($conn->connect_error )
    {
	    returnWithError($conn->connect_error);
    } else {
        $id = $inData["Id"];
        $fName = $inData["firstName"];
        $lName = $inData["lastName"];
        $phone = $inData["phone"];
        $email = $inData["email"];

        $query = "UPDATE Contacts SET FirstName='$fName', LastName='$lName', Phone='$phone', Email='$email' WHERE ID='$id'";
		mysqli_query($conn,$query);

        $conn->close();
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


?>