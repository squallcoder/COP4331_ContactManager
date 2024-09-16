<?php

$conn = new mysqli("localhost", "Admin", "Team7", "SmallProject"); 	
if( $conn->connect_error )
{
	returnWithError( $conn->connect_error );
}
else
{
    // call the function to add the contact
    addContact($FirstName, $LastName, $Phone, $Email, $UserID);
}

// create contact function
function addContact($FirstName, $LastName, $Phone, $Email, $UserID){
    $FirstName = mysqli_real_escape_string($conn, $FirstName);
    $LastName = mysqli_real_escape_string($conn, $LastName);
    $Phone = mysqli_real_escape_string($conn, $Phone);
    $Email = mysqli_real_escape_string($conn, $Email);
    $UserID = mysqli_real_escape_string($conn, $UserID);

    // insert contact into the database CHECK THIS
    /* UPDATED SYNTAX AND VARIABLES -c*/
    $query = "INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES ('$FirstName', '$LastName', '$Phone', '$Email', '$UserID')";

    // checking if contact was created successfully by running a query
    if (mysqli_query($conn, $query)){
        echo "Contact successfully created!";

    } else{
        echo "Error creating contact.... please try again" . mysqli_error($conn);
    }
}


?>
