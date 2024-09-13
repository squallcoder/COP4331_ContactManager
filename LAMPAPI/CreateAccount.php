<?php


 
 
	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = "";
	$lastName = "";

	$conn = new mysqli("localhost", "Admin", "Team7", "SmallProject"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else 
	{

		$stmt = $conn->prepare("SELECT ID,firstName,lastName FROM Users WHERE Login=? AND Password =?");
		$stmt->bind_param("ss", $inData["login"], $inData["password"]);
		$stmt->execute();
		$result = $stmt->get_result();

		if( $row = $result->fetch_assoc()  )
		{

			returnWithError("Found Record Found");
		}
		else
		{
			returnWithError("Found Record Found");
		}

		$stmt->close();
		$conn->close();
	}
























?>
