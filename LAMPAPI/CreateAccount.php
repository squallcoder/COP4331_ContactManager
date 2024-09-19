<?php


	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$login = $inData["login"];

	$password = $inData["password"];

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

			returnWithError("Records Found");
	//		returnWithInfo( $row['firstName'], $row['lastName'], $row['ID'] );
		}
		else
	{
		$sql = "INSERT INTO Users (FirstName, LastName, Login, Password) VALUES ('$firstName', '$lastName', '$login', '$password');";
		mysqli_query($conn,$sql);
		}

		$stmt->close();
		$conn->close();
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
























?>
