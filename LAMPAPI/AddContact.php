<?php

	$inData = getRequestInfo();
	$UserID = $inData["userId"];
	$Phone = $inData["phone"];
	$Email = $inData["email"];
	$FirstName = $inData["firstName"];
	$LastName = $inData["lastName"];

	$conn = new mysqli("localhost", "Admin", "Team7", "SmallProject"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
//		$stmt = $conn->prepare("SELECT UserID FROM Contacts WHERE FirstName=? AND LastName =?");
//		$stmt->bind_param("ss", $inData["firstName"], $inData["lastName"]);
//		$stmt->execute();
//		$result = $stmt->get_result();

//		if( $row = $result->fetch_assoc()  )
//		{

//			returnWithError("Contact Found");
//		returnWithInfo( $row['firstName'], $row['lastName'], $row['ID'] );
//		}
//		else
//	{
		//(FirstName, LastName, Phone, Email, UserID) VALUES ('$FirstName', '$LastName', '$Phone', '$Email', '$UserID')
		$sql = "INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES ('$FirstName', '$LastName', '$Phone', '$Email', '$UserID');";
		mysqli_query($conn,$sql);
//		}

//		$stmt->close();
	$conn->close();

		returnWithInfo( $FirstName, $LastName, $UserID );
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
