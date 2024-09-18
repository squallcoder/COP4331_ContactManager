<?php

    //requesting info
    $inData = getRequestInfo();

    $conn = new mysqli("localhost", "Admin", "Team7", "SmallProject");

    if($conn->connect_error )
    {
	    returnWithError($conn->connect_error);
    } else {

        // defining vars
        $firstName = $inData["firstName"];
        $lastName = $inData["lastName"];
        
        $fName = mysqli_real_escape_string($conn, $fName);
        $lName = mysqli_real_escape_string($conn, $lName);

        $query = $conn->prepare("DELETE FROM Contacts WHERE FirstName='$fName', LastName='$lName'");
        $query->execute();
		$result = $query->get_result();
    
        if($row = $result->fetch_assoc()){
            echo "Contact deleted";
        } 
        else {
            echo "Error: ".$query. "<br>".$conn->error;
        }

        $query->close();
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
    