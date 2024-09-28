const urlBase = 'http://www.averagesite.xyz/LAMPAPI';
const extension = 'php';

// User information
var userId = 0;
var holdUserID;
let firstName = "";
let lastName = "";
let contactArray = [];
let displayFunctionCall;

// Handles user login
function doLogin() {
    userId = 0;
    firstName = "";
    lastName = "";
    // Retrieve user credentials
    const login = document.getElementById('loginName').value;
    const password = document.getElementById('loginPassword').value;

    document.getElementById("loginResult").innerHTML = "";

    // Create login request payload
    let tmp = { login: login, password: password };
    let jsonPayload = JSON.stringify(tmp);
    console.log(jsonPayload);

    let url = urlBase + '/Login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            // Check if request completed successfully
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;

                // If userId is invalid
                if (userId < 1) {
                    document.getElementById("loginResult").innerHTML = "Incorrect Username or Password.";
                    return;
                }

                // Set first and last name of user
                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                saveCookie();
                window.location.href = "contacts.html";
            }
        };
        // Send login request
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("loginResult").innerHTML = err.message;
    }

}

// Saves user data in cookies
function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    document.cookie = "firstName=" + firstName + ";expires=" + date.toGMTString();
    document.cookie = "LastName=" + lastName + ";expires=" + date.toGMTString();
    document.cookie = "UserId=" + userId + ";expires=" + date.toGMTString();
}

// Reads user data from cookies
function readCookie() {
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");

    for (var i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");

        // Check each cookie and set the corresponding value
        if (tokens[0] == "firstName") {
            firstName = tokens[1];
        }
        else if (tokens[0] == "lastName") {
            lastName = tokens[1];
        }
        else if (tokens[0] == "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }

    // Redirect to login page if no user is found
    if (userId < 0) {
        window.location.href = "login.html";
    }
}

// Handles account creation
function createAccount() {
    // Retrieve input fields values
    firstName = document.getElementById('FirstName').value;
    lastName = document.getElementById('LastName').value;
    const login = document.getElementById('createUsername').value;
    const password = document.getElementById('createPassword').value;
    const confpassword = document.getElementById('confirmPassword').value;

    // Checks if passwords match
    if (password != confpassword) {
        document.getElementById('loginResult').innerHTML = "Your passwords do not match.";
    }
    else {
        if (login && password && confpassword && firstName && lastName) {

            // Prepare request payload
            let tmp = { login: login, password: password, firstName: firstName, lastName: lastName };
            let jsonPayload = JSON.stringify(tmp);

            let url = urlBase + '/CreateAccount.' + extension;

            let xhr = new XMLHttpRequest();

            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

            try {
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        let jsonObject = JSON.parse(xhr.responseText);
                        userId = jsonObject.id;

                        // Check if account creation failed
                        if (userId < 1) {
                            document.getElementById("loginResult").innerHTML = "Can't Create Account.";
                            return;
                        }

                        // Save created user's first and last name
                        firstName = jsonObject.firstName;
                        lastName = jsonObject.lastName;

                        saveCookie();
                    }
                };
                // Send account creation request
                xhr.send(jsonPayload);
            }
            catch (err) {
                document.getElementById("loginResult").innerHTML = err.message;
            }

            document.getElementById('loginResult').innerHTML = "Account Created!";
            document.getElementById('loginRedirect').style.display = 'inline';
        }
        else {
            document.getElementById('loginResult').innerHTML = "Please enter a valid username and password.";
        }
    }

    // document.getElementById("loginResult").innerHTML = "";
}

// Populates all contacts on the screen
function displayContacts() {
    // Retrieve the userID from cookies
    const cDecoded = decodeURI(document.cookie);
    const cArray = cDecoded.split("; ");
    let result; // Stores the userID

    cArray.forEach(element => {
        if (element.indexOf("UserID") == 0) {
            result = element.substring(6 + 1);
        }
    })

    let tmp = { UserID: result };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/DisplayContacts.' + extension;

    let xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8"); // Inform the server about the content being sent

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                console.log(jsonPayload);
                let jsonObject = JSON.parse(xhr.responseText);

                // Populate contact list on the page
                const contactList = document.getElementById('contactList');
                contactList.innerHTML = '';
                contactArray = jsonObject.contacts;
                console.log(contactArray);

                // Add each contact as a separate object
                contactArray.forEach((contact, index) => {
                    const contactItem = document.createElement('div');
                    contactItem.className = 'contact-item';
                    contactItem.innerText = contact.FirstName.concat(" ", contact.LastName);
                    contactItem.onclick = function () {
                        openModal(index);
                    };
                    contactList.appendChild(contactItem);
                });
            }
        };
        xhr.send(jsonPayload); // Send populate contacts request
    }
    catch (err) {
        window.onload = err.message;
    }

}

// Load contacts on page load
window.onload = displayContacts;

// Log out pop up
function openLogOutModal() {
    document.getElementById("logOutModal").style.display = "block";
    document.getElementById('loginRedirect').style.display = 'inline';
}

function closeLogOutModal() {
    document.getElementById("logOutModal").style.display = "none";
}

// Contact Card
function openModal(index) {
    const contact = contactArray[index];

    document.getElementById('contactName').innerText = contact.FirstName.concat(" ", contact.LastName);
    document.getElementById('contactEmail').innerText = contact.Email;
    document.getElementById('contactPhone').innerText = contact.Phone;
    document.getElementById('contactModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('contactModal').style.display = 'none';
    location.reload();
}

// Search for contact to be updated
function openSelectContactModal() {
    document.getElementById("selectContactModal").style.display = "block";
}

function closeSelectContactModal() {
    document.getElementById("selectContactModal").style.display = "none";
}

// Finds contact to be updated
function showContactToEdit() {
    // Retrieve contact information from form fields
    const firstName = document.getElementById('oldFirstName').value;
    const lastName = document.getElementById('oldLastName').value;

    // Find contact in list of contacts
    const contactIndex = contactArray.findIndex(c => (c.FirstName.toLowerCase() === firstName.toLowerCase()) && (c.LastName.toLowerCase() === lastName.toLowerCase()));
    contact = contactArray[contactIndex];

    // Proceed with udpate process
    if (contact) {
        closeSelectContactModal();
        openEditContactModal(contact);
    }
    else {
        document.getElementById('contactResult').innerHTML = "Contact not found.";
    }
}

// Updates contact from contact card
function updateContactModal() {
    // Retrieve contact information from form fields
    const name = document.getElementById('contactName').innerText;
    const words = name.split(" ");
    const firstName = words[0];
    const lastName = words[1];

    const contactIndex = contactArray.findIndex(c => (c.FirstName.toLowerCase() === firstName.toLowerCase()) && (c.LastName.toLowerCase() === lastName.toLowerCase()));
    contact = contactArray[contactIndex];

    // Proceed with update process
    openEditContactModal(contact);
}

// Update contact pop up
function openEditContactModal(contact) {
    // Changeable contact info
    document.getElementById("editFirstName").value = contact.FirstName;
    document.getElementById("editLastName").value = contact.LastName;
    document.getElementById("editNewFirstName").value = contact.FirstName;
    document.getElementById("editNewLastName").value = contact.LastName;
    document.getElementById("editContactEmail").value = contact.Email;
    document.getElementById("editContactPhone").value = contact.Phone;
    document.getElementById("editContactModal").style.display = "block";
}

function closeEditContactModal() {
    document.getElementById("editContactModal").style.display = "none";
    location.reload();
}

// Updates contact in the database
function updateContact() {
    // Updated contact info
    fName = document.getElementById('editFirstName').value;
    lName = document.getElementById('editLastName').value;
    newFirstName = document.getElementById('editNewFirstName').value;
    newLastName = document.getElementById('editNewLastName').value;
    email = document.getElementById('editContactEmail').value;
    phone = document.getElementById('editContactPhone').value;

    const cDecoded = decodeURI(document.cookie);
    const cArray = cDecoded.split("; ");
    let result; // Stores the userID

    // Retrieves the UserID
    cArray.forEach(element => {
        if (element.indexOf("UserId") == 0) {
            result = element.substring(6 + 1);
        }
    })

    let tmp = {
        userId: result, oldFirstName: fName,
        oldLastName: lName, phone: phone, email: email,
        newFirstName: newFirstName, newLastName: newLastName
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/UpdateContacts.' + extension;

    let xhr = new XMLHttpRequest();

    // Inform the server about the content being sent
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log(jsonPayload);
                let jsonObject = JSON.parse(xhr.responseText);
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("updateResult").innerHTML = err.message;
    }
    document.getElementById('updateResult').innerHTML = "You have successfully updated your contact!"
}

// Add contact pop up
function openAddContactModal() {
    document.getElementById("addContactModal").style.display = "block";
}

function closeAddContactModal() {
    document.getElementById("addContactModal").style.display = "none";
    location.reload();
}

// Adds a new contact to the database
function addContact() {
    const cDecoded = decodeURI(document.cookie);
    const cArray = cDecoded.split("; ");
    let result; // Stores the userID

    // Retrieves the UserID
    cArray.forEach(element => {
        if (element.indexOf("UserId") == 0) {
            result = element.substring(6 + 1);
        }
    })

    // Retrieve contact information from form fields
    firstName = document.getElementById('newContactFirstName').value;
    lastName = document.getElementById('newContactLastName').value;
    const email = document.getElementById('newContactEmail').value;
    const phone = document.getElementById('newContactPhone').value;
    const fullName = firstName.concat(" ", lastName);

    const newContact = {
        name: fullName,
        email: email,
        phone: phone
    };

    // Ensure all fields are filled
    if (firstName && lastName && email && phone) {

        let tmp = { userId: result, firstName: firstName, lastName: lastName, email: email, phone: phone };

        let jsonPayload = JSON.stringify(tmp);
        let url = urlBase + '/AddContact.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try {
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    console.log(jsonPayload);

                    let jsonObject = JSON.parse(xhr.responseText);

                    // Check for an error during the process
                    if (result < 1) {
                        document.getElementById("addResult").innerHTML = "Unable to Add Contact.";
                        return;
                    }
                }
            };
            xhr.send(jsonPayload); // Send add contact request
        }
        catch (err) {
            document.getElementById("addResult").innerHTML = err.message;
        }

        document.getElementById("addResult").innerHTML = "Successfully Added Contact!"
    }
    else {
        document.getElementById('addResult').innerHTML = "Please fill out all fields.";
    }
}

// Delete contact pop up
function openDeleteContactModal() {
    document.getElementById("deleteContactModal").style.display = "block";
}

function closeDeleteContactModal() {
    document.getElementById("deleteContactModal").style.display = "none";
    location.reload();
}

// Deletes a contact from the database using on screen button
function deleteContact() {
    const fName = document.getElementById('deleteContactFirstName').value.trim();
    const lName = document.getElementById('deleteContactLastName').value.trim();

    const cDecoded = decodeURI(document.cookie);
    const cArray = cDecoded.split("; ");
    let result; // Stores the userID

    // Retrieves the UserID
    cArray.forEach(element => {
        if (element.indexOf("UserId") == 0) {
            result = element.substring(6 + 1);
        }
    })

    if (!fName || !lName) {
        document.getElementById('deleteResult').innerHTML = "Please fill out all fields.";
        return;
    }

    const contactName = fName.concat(" ", lName).toLowerCase();
    const contactIndex = contactArray.findIndex(c => c.FirstName.concat(" ", c.LastName).toLowerCase() === contactName);

    let tmp = { userId: result, firstName: fName, lastName: lName };
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/DeleteContacts.' + extension;

    let xhr = new XMLHttpRequest();

    // Inform the server about the content being sent
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log(jsonPayload);
                let jsonObject = JSON.parse(xhr.responseText);

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                //If contact index is -1 then we could not find the contact in our array which indicates there was no contact found
                if (contactIndex == -1) {
                    document.getElementById('deleteResult').innerHTML = "Contact not found!";
                }

                contactArray.splice(contactIndex, 1);
            }
        };
        xhr.send(jsonPayload); // Send delete request
    }
    catch (err) {
        document.getElementById("deleteResult").innerHTML = err.message;
    }

    //If contactIndex is not -1 we print out a message indicating that the contact was deleted successfully since we have a valid index
    if (contactIndex != -1) {
        document.getElementById('deleteResult').innerHTML = "Contact deleted successfully.";
    }

}

// Deletes a contact from the database using contact card button
function deleteContactFromModal() {
    // Retrieve contact information from form fields
    const name = document.getElementById('contactName').innerText;
    const words = name.split(" ");
    const fName = words[0];
    const lName = words[1];

    const contactIndex = contactArray.findIndex(c => (c.FirstName.toLowerCase() === fName.toLowerCase()) && (c.LastName.toLowerCase() === lName.toLowerCase()));

    const cDecoded = decodeURI(document.cookie);
    const cArray = cDecoded.split("; ");
    let result; // Stores the userID

    cArray.forEach(element => {
        if (element.indexOf("UserId") == 0) {
            result = element.substring(6 + 1);
        }
    })

    let tmp = { userId: result, firstName: fName, lastName: lName };
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/DeleteContacts.' + extension;

    let xhr = new XMLHttpRequest();

    // Inform the server about the content being sent
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log(jsonPayload);
                let jsonObject = JSON.parse(xhr.responseText);

                if (contactIndex != -1) {
                    contactArray.splice(contactIndex, 1);
                    document.getElementById("modalResult").innerHTML = "Successfully Deleted the Contact!"
                }

            }
        };
        xhr.send(jsonPayload); // Send delete request
    }
    catch (err) {
        document.getElementById("modalResult").innerHTML = err.message;
    }

    document.getElementById('modalResult').innerHTML = "Contact deleted successfully.";
}

// Clears search bar
function clearAndPopulate() {
    document.getElementById('searchBar').value = '';
    displayContacts();
}

// Searches for a contact in the contact list
function search() {

    // This is the name the user inputs into the search bar
    const searchName = document.getElementById('searchBar').value.trim().toLowerCase();

    // Filter contacts by first and last name
    // const matchingContactsByFirstName = contactArray.filter(c => 
    //     c.FirstName.concat(" ", c.LastName).toLowerCase().startsWith(searchName));

    //matchingContacts is a array that contains all the names that match the search bar. Both by first name and last name.
    const matchingContacts = contactArray.filter(checkName);

    //This is the function we call for each element in our array.
    function checkName(contact) {
        return contact.FirstName.toLowerCase().startsWith(document.getElementById('searchBar').value.trim().toLowerCase()) || contact.LastName.toLowerCase().startsWith(document.getElementById('searchBar').value.trim().toLowerCase());
    }

    let tmp = { search: searchName };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/SearchContacts.' + extension;

    let xhr = new XMLHttpRequest();

    // Inform the server about the content being sent
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    // Retrieves the contactList Id
    const contactList = document.getElementById('contactList');
    contactList.innerHTML = '';


    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                console.log(jsonPayload);
                let jsonObject = JSON.parse(xhr.responseText);

                // Checks if the search bar is empty 
                if (searchName.length === 0) {
                    displayContacts();
                }

                // Displays all the matching contacts
                if (matchingContacts.length > 0) {
                    matchingContacts.forEach(contact => {
                        const contactElement = document.createElement('div');
                        contactElement.classList.add('contact-item');
                        contactElement.innerText = contact.FirstName.concat(" ", contact.LastName);
                        let fName = contact.FirstName;
                        let lName = contact.LastName;

                        contactElement.addEventListener('click', () => {
                            const contactIndex = contactArray.findIndex(c => (c.FirstName.toLowerCase() === fName.toLowerCase()) && (c.LastName.toLowerCase() === lName.toLowerCase()));
                            openModal(contactIndex);
                        });

                        contactList.appendChild(contactElement);
                    });
                }
                else {
                    contactList.innerHTML = '<div>No contacts found.</div>';
                }
            }
        };
        xhr.send(jsonPayload); // Send search request
    }
    catch (err) {
        document.getElementById("modalResult").innerHTML = err.message;
    }
}