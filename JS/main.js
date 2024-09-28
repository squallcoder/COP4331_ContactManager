const urlBase = 'http://www.averagesite.xyz/LAMPAPI';
const extension = 'php';

var userId = 0;
var holdUserID;
let firstName = "";
let lastName = "";
let contactArray = [];
let displayFunctionCall;

function doLogin() {

    userId = 0;
    firstName = "";
    lastName = "";
    const login = document.getElementById('loginName').value;
    const password = document.getElementById('loginPassword').value;

    document.getElementById("loginResult").innerHTML = "";

    let tmp = { login: login, password: password };
    let jsonPayload = JSON.stringify(tmp);
    // alert(jsonPayload);
    console.log(jsonPayload);

    let url = urlBase + '/Login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;


                if (userId < 1) {
                    document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
                    return;
                }

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                saveCookie();
                // alert(userId);

                window.location.href = "contacts.html";
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("loginResult").innerHTML = err.message;
    }

}


function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    document.cookie = "firstName=" + firstName + ";expires=" + date.toGMTString();
    document.cookie = "LastName=" + lastName + ";expires=" + date.toGMTString();
    document.cookie = "UserId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");
    for (var i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
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

    if (userId < 0) {
        window.location.href = "login.html";
    }
}


function createAccount() {

    firstName = document.getElementById('FirstName').value;
    lastName = document.getElementById('LastName').value;
    const login = document.getElementById('createUsername').value;
    const password = document.getElementById('createPassword').value;
    const confpassword = document.getElementById('confirmPassword').value;

    if (password != confpassword) {
        document.getElementById('loginResult').innerHTML = "Your passwords do not match.";
    }

    else {
        if (login && password && confpassword && firstName && lastName) {

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

                        if (userId < 1) {
                            document.getElementById("loginResult").innerHTML = "Can't Create Account";
                            return;
                        }

                        firstName = jsonObject.firstName;
                        lastName = jsonObject.lastName;

                        saveCookie();
                    }
                };
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

    document.getElementById("loginResult").innerHTML = "";


}

function displayContacts() {

    const cDecoded = decodeURI(document.cookie);
    const cArray = cDecoded.split("; ");
    let result; //result will store the userID

    cArray.forEach(element => {
        if (element.indexOf("UserID") == 0) {
            result = element.substring(6 + 1);
        }
    }
    )

    let tmp = { UserID: result };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/DisplayContacts.' + extension;

    let xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");//setRequestHeader is used to inform the server about
    //the content that is being sent.
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                //alert(xhr.responseText);

                console.log(jsonPayload);
                let jsonObject = JSON.parse(xhr.responseText);

                const contactList = document.getElementById('contactList');
                contactList.innerHTML = '';//This clears the contact list
                contactArray = jsonObject.contacts;
                console.log(contactArray);

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
        xhr.send(jsonPayload);
    }
    catch (err) {
        window.onload = err.message; //Prints message on the window
    }

}

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

// window.onload = populateContacts; //This populates the default array of contents to the contact
window.onload = displayContacts;



//This opens the block with all the users information
function openEditContactModal(contact) {
    document.getElementById("editFirstName").value = contact.FirstName;
    document.getElementById("editLastName").value = contact.LastName;
    document.getElementById("editNewFirstName").value = contact.FirstName;
    document.getElementById("editNewLastName").value = contact.LastName;
    document.getElementById("editContactEmail").value = contact.Email;
    document.getElementById("editContactPhone").value = contact.Phone;
    document.getElementById("editContactModal").style.display = "block";
}

function showContactToEdit() {
    const firstName = document.getElementById('oldFirstName').value;
    const lastName = document.getElementById('oldLastName').value;

    const contactIndex = contactArray.findIndex(c => (c.FirstName.toLowerCase() === firstName.toLowerCase()) && (c.LastName.toLowerCase() === lastName.toLowerCase()));
    contact = contactArray[contactIndex];

    if (contact) {
        closeSelectContactModal();
        openEditContactModal(contact);
    }
    else {
        document.getElementById('contactResult').innerHTML = "Contact not found.";
    }
}

function updateContactModal() {
    const name = document.getElementById('contactName').innerText;
    const words = name.split(" ");
    const firstName = words[0];
    const lastName = words[1];

    const contactIndex = contactArray.findIndex(c => (c.FirstName.toLowerCase() === firstName.toLowerCase()) && (c.LastName.toLowerCase() === lastName.toLowerCase()));
    contact = contactArray[contactIndex];

    openEditContactModal(contact);
}

function closeEditContactModal() {
    document.getElementById("editContactModal").style.display = "none";
    location.reload();
}


function openLogOutModal() {
    document.getElementById("logOutModal").style.display = "block";
    document.getElementById('loginRedirect').style.display = 'inline';

}

function closeLogOutModal() {
    document.getElementById("logOutModal").style.display = "none";
}

function openAddContactModal() {
    document.getElementById("addContactModal").style.display = "block";
}

function closeAddContactModal() {
    document.getElementById("addContactModal").style.display = "none";
    location.reload();
}

function openDeleteContactModal() {
    document.getElementById("deleteContactModal").style.display = "block";
}

function openSelectContactModal() {
    document.getElementById("selectContactModal").style.display = "block";
}

function closeSelectContactModal() {
    document.getElementById("selectContactModal").style.display = "none";
}

function updateContact() {
    fName = document.getElementById('editFirstName').value;
    lName = document.getElementById('editLastName').value;
    newFirstName = document.getElementById('editNewFirstName').value;
    newLastName = document.getElementById('editNewLastName').value;
    email = document.getElementById('editContactEmail').value;
    phone = document.getElementById('editContactPhone').value;

    const cDecoded = decodeURI(document.cookie);
    const cArray = cDecoded.split("; ");
    let result; //result will store the userID

    cArray.forEach(element => {
        if (element.indexOf("UserId") == 0) {
            result = element.substring(6 + 1);
        }
    }
    )

    let tmp = {
        userId: result, oldFirstName: fName,
        oldLastName: lName, phone: phone, email: email,
        newFirstName: newFirstName, newLastName: newLastName
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/UpdateContacts.' + extension;

    let xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");//setRequestHeader is used to inform the server about
    //the content that is being sent.
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                //alert(xhr.responseText);
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

function closeDeleteContactModal() {
    document.getElementById("deleteContactModal").style.display = "none";
    location.reload();
}


function deleteContact() {
    const fName = document.getElementById('deleteContactFirstName').value.trim();
    const lName = document.getElementById('deleteContactLastName').value.trim();

    const cDecoded = decodeURI(document.cookie);
    const cArray = cDecoded.split("; ");
    let result; //result will store the userID

    cArray.forEach(element => {
        if (element.indexOf("UserId") == 0) {
            result = element.substring(6 + 1);
        }
    }
    )


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

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");//setRequestHeader is used to inform the server about
    //the content that is being sent.
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log(jsonPayload);
                let jsonObject = JSON.parse(xhr.responseText);

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                contactArray.splice(contactIndex, 1);
            }
        };
        xhr.send(jsonPayload);
        // alert("Done!");
    }
    catch (err) {
        document.getElementById("deleteResult").innerHTML = err.message;
    }


    document.getElementById('deleteResult').innerHTML = "Contact deleted successfully.";
}

function deleteContactFromModal() {
    const name = document.getElementById('contactName').innerText;
    const words = name.split(" ");
    const fName = words[0];
    const lName = words[1];

    const contactIndex = contactArray.findIndex(c => (c.FirstName.toLowerCase() === fName.toLowerCase()) && (c.LastName.toLowerCase() === lName.toLowerCase()));

    const cDecoded = decodeURI(document.cookie);
    const cArray = cDecoded.split("; ");
    let result; //result will store the userID

    cArray.forEach(element => {
        if (element.indexOf("UserId") == 0) {
            result = element.substring(6 + 1);
        }
    }
    )

    let tmp = { userId: result, firstName: fName, lastName: lName };
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/DeleteContacts.' + extension;

    let xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");//setRequestHeader is used to inform the server about
    //the content that is being sent.
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
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("modalResult").innerHTML = err.message;
    }

    document.getElementById('modalResult').innerHTML = "Contact deleted successfully.";
}

function clearAndPopulate(){

    document.getElementById('searchBar').value = '';
    displayContacts();
}

function search() {

    //This gets the string that the user inputted in the search bar
    const searchName = document.getElementById('searchBar').value.trim().toLowerCase();

    //This variable stores all the names in a array called matchingContacts
    const matchingContacts = contactArray.filter(c => c.FirstName.concat(" ", c.LastName).toLowerCase().startsWith(searchName));

    let tmp = { search: searchName }; // This is the object we are going to send to the server

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/SearchContacts.' + extension;

    let xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");//setRequestHeader is used to inform the server about
    //the content that is being sent.

    const contactList = document.getElementById('contactList'); //This retrieves the contactList Id
    contactList.innerHTML = ''; // This clears all the contents inside the div that has a Id = contactList


    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                console.log(jsonPayload);
                let jsonObject = JSON.parse(xhr.responseText);

                //This checks if the search bar is empty 
                if (searchName.length === 0) {
                    displayContacts();
                }

                //This displays all the contacts that match with the string in the search bar
                if (matchingContacts.length > 0) {
                    matchingContacts.forEach(contact => {
                        const contactElement = document.createElement('div');
                        contactElement.classList.add('contact-item');
                        contactElement.innerText = contact.FirstName.concat(" ",  contact.LastName);
                        let fName = contact.FirstName;
                        let lName = contact.LastName;

                        contactElement.addEventListener('click', () => {
                            const contactIndex = contactArray.findIndex(c => (c.FirstName.toLowerCase() === fName.toLowerCase()) && (c.LastName.toLowerCase() === lName.toLowerCase()));
                            // openModal(contactIndex);//Pass in name , phone number , email 
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
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("modalResult").innerHTML = err.message;
    }


}


function addContact() {

    const cDecoded = decodeURI(document.cookie);
    const cArray = cDecoded.split("; ");
    let result; //result will store the userID

    cArray.forEach(element => {
        if (element.indexOf("UserId") == 0) {
            result = element.substring(6 + 1);
        }
    }
    )

    // alert(result);



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

                    // alert(jsonPayload);
                    let jsonObject = JSON.parse(xhr.responseText);


                    if (result < 1) {
                        document.getElementById("addResult").innerHTML = "Unable to Add Contact";
                        return;
                    }

                }
            };
            xhr.send(jsonPayload);
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