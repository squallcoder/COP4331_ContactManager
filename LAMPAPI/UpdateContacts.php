<?php

    //requesting info
    $inData = getRequestInfo();

    $conn = new mysqli("localhost", "Admin", "Team7", "SmallProject");

    if($conn->connect_error )
    {
	    returnWithError($conn->connect_error);
    } else {
        $id = mysqli_real_escape_string($conn, $id);
        $fName = mysqli_real_escape_string($conn, $firstName);
        $lName = mysqli_real_escape_string($conn, $lastName);
        $phone = mysqli_real_escape_string($conn, $phoneNumber);
        $email = mysqli_real_escape_string($conn, $email);

        $query = $conn->prepare("UPDATE Contacts SET FirstName='$fName', LastName='$lName', Phone='$phone', Email='$email' WHERE ID='$id'");
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