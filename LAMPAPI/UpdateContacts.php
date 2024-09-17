<?php

    $conn = new mysqli("localhost", "Admin", "Team7", "SmallProject");
    mysql_select_db ("Contacts") or die ("could not find db");

    if($conn->connect_error )
    {
	    returnWithError($conn->connect_error);
    } else {
        updateContact($id, $fName, $lName, $phone, $email);
    }

    function updateContact($id, $fName, $lName, $phone, $email){
        $id = mysqli_real_escape_string($conn, $id);
        $fName = mysqli_real_escape_string($conn, $firstName);
        $lName = mysqli_real_escape_string($conn, $lastName);
        $phone = mysqli_real_escape_string($conn, $phoneNumber);
        $email = mysqli_real_escape_string($conn, $email);

        $query = "UPDATE Contacts SET FirstName='$fName', LastName='$lName', Phone='$phone', Email='$email' WHERE ID='$id'";

        if($conn->mysqli_query($query) === TRUE){
            echo "Contact updated"
        } else {
            echo "Error: ".$query. "<br>".$conn->error;
        }

    }

?>