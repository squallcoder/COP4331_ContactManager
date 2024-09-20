<?php

    //requesting info
    $inData = getRequestInfo();

    $conn = new mysqli("localhost", "Admin", "Team7", "SmallProject");

    if($conn->connect_error )
    {
	    returnWithError($conn->connect_error);
    } else {

        // defining vars
        $fName = $inData["firstName"];
        $lName = $inData["lastName"];

        $query = "DELETE FROM Contacts WHERE FirstName='$fName', LastName='$lName'";
        mysqli_query($conn,$query);

        //$query = $conn->prepare("DELETE FROM Contacts WHERE FirstName='$fName', LastName='$lName'");
        //$query->execute();
		//$result = $query->get_result();

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
    