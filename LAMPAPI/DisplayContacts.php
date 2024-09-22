<?php
    // get request info (UserID)
    $inData = getRequestInfo();
    $Login = $inData["Login"];
    $Password = $inData["Password"];

    $conn = new mysqli("localhost", "Admin", "Team7", "SmallProject");

    // check connection
    if($conn->connect_error )
    {
        returnWithError($conn->connect_error);
    } else { // if connection is good, fetch UserID and contacts
        $idQuery = "SELECT ID FROM Users WHERE Login = '$Login' AND Password = '$Password'";
        $result = $conn->query($idQuery);

        // if user is found, fetch ID
        if($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $UserID = $row["ID"];
        } else {
            returnWithError("No user found");
        }

        $query = "SELECT * FROM Contacts WHERE UserID = '$UserID'";
        $result = $conn->query($query);

        // fill contacts array with contacts
        if($result->num_rows > 0) {
            $contacts = array();
            while($row = $result->fetch_assoc()) {
                $contacts[] = $row;
            }
            returnWithInfo($contacts);
        } else {
            returnWithError("No contacts found");
        }

        $conn->close();
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err)
    {
        $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithInfo($contacts)
    {
        $retValue = '{"contacts":' . json_encode($contacts) . ',"error":""}';
        sendResultInfoAsJson($retValue);
    }
?>
