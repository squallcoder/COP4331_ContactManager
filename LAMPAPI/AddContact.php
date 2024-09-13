<?php

$conn = new mysqli("localhost", "Admin", "Team7", "SmallProject"); 	
if( $conn->connect_error )
{
	returnWithError( $conn->connect_error );
}
else
{
    // call the function to add the contact
    addContact($id, $firstName, $lastName, $phoneNumber, $email);
}

// create contact function
function addContact($id, $firstName, $lastName, $phoneNumber, $email){
    $firstName = mysqli_real_escape_string($conn, $firstName);
    $lastName = mysqli_real_escape_string($conn, $lastName);
    $phoneNumber = mysqli_real_escape_string($conn, $phoneNumber);
    $email = mysqli_real_escape_string($conn, $email);

    // insert contact into the database CHECK THIS
    $query = "INSERT INTO contacts (id, firstName, lastName, phoneNumber, email) VALUES ('$id', '$firstName', '$lastName', '$phoneNumber', '$email')";

    // checking if contact was created successfully by running a query
    if (mysqli_query($conn, $query)){
        echo "Contact successfully created!";

    } else{
        echo "Error creating contact.... please try again" . mysqli_error($conn);
    }
}


?>
