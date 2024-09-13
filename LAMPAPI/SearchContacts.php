<?php

$output = '';
// connect to database
$conn = new mysqli("localhost", "Admin", "Team7", "SmallProject");
mysql_select_db ("contacts") or die ("could not find db"); //idk if the db name is right but i guessed that it would be contacts 	
if($conn->connect_error )
{
	returnWithError($conn->connect_error);
}
else
{
    $searchq = $_POST['search']; //creating a serach query var
    $searchq = preg_replace("#[^0-9a-z]#i","",$searchq); //only searching for letters and numbers and anything else gets ignored

    //sql query to search
    $query = mysql_query("SELECT ALL FROM contacts WHERE firstname LIKE '%$searchq%' OR lastname LIKE '%$searchq%'") or die ("could not search!"); //using either first or last name

    //count query
    $count = mysql_num_rows($query); //returns rows that are like the search
    if($count == 0){
        $output = 'There was no search results!';
    } else{
        //this is what searches the table
        while($row = mysql_fetch_array($query)){
            $fname = $row['firstname'];
            $lname = $row['lastname'];
            $id = $row['id'];

            //output info we collect
            $output .= '<div> '.$fname.' '.$lname.' <div';
        }
    }

    //print the info on the page
    php.print("$output");
}


