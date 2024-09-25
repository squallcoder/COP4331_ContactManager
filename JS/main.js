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
    //	var tmp = {login:login,password:hash};
    let jsonPayload = JSON.stringify(tmp);
    alert(jsonPayload);
    console.log(jsonPayload);

    let url = urlBase + '/Login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    // alert(xhr.responseText);

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
                alert(userId);

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
    else {
        //		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
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
            //	var tmp = {login:login,password:hash};
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

                        // window.location.href = "login.html";

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


// const contacts = [
//     { name: 'Alice Johnson', email: 'alice.johnson@example.com', phone: '555-123-4567' },
//     { name: 'Bob Smith', email: 'bob.smith@example.com', phone: '555-987-6543' },
//     { name: 'Charlie Brown', email: 'charlie.brown@example.com', phone: '555-876-5432' },
//     { name: 'David Wilson', email: 'david.wilson@example.com', phone: '555-432-1098' },
//     { name: 'Eva Martinez', email: 'eva.martinez@example.com', phone: '555-246-8102' },
//     { name: 'Fiona Davis', email: 'fiona.davis@example.com', phone: '555-135-7913' },
//     { name: 'George Harris', email: 'george.harris@example.com', phone: '555-864-2097' },
//     { name: 'Hannah Lee', email: 'hannah.lee@example.com', phone: '555-753-1482' },
//     { name: 'Isaac Clark', email: 'isaac.clark@example.com', phone: '555-951-2364' },
//     { name: 'Jessica Adams', email: 'jessica.adams@example.com', phone: '555-852-4671' },
//     { name: 'Kyle Foster', email: 'kyle.foster@example.com', phone: '555-963-5284' },
//     { name: 'Laura Bennett', email: 'laura.bennett@example.com', phone: '555-654-7389' },
//     { name: 'Mark Evans', email: 'mark.evans@example.com', phone: '555-753-1845' },
//     { name: 'Nina Gomez', email: 'nina.gomez@example.com', phone: '555-951-7823' },
//     { name: 'Oliver White', email: 'oliver.white@example.com', phone: '555-852-3917' },
//     { name: 'Paula Reed', email: 'paula.reed@example.com', phone: '555-963-5872' },
//     { name: 'Quinn Scott', email: 'quinn.scott@example.com', phone: '555-654-2934' },
//     { name: 'Rachel Green', email: 'rachel.green@example.com', phone: '555-753-4891' },
//     { name: 'Sam Walker', email: 'sam.walker@example.com', phone: '555-951-8245' },
//     { name: 'Tina Carter', email: 'tina.carter@example.com', phone: '555-852-3789' }
// ];


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
                // contactList.innerHTML = '';//Commented this out because i was getting a error on the console
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

// function populateContacts() {
//     const contactList = document.getElementById('contactList');
//     // contactList.innerHTML = '';//Commented this out because i was getting a error on the console

//     contacts.forEach((contact, index) => {
//         const contactItem = document.createElement('div');
//         contactItem.className = 'contact-item';
//         contactItem.innerText = contact.name;
//         contactItem.onclick = function () {
//             openModal(index);
//         };
//         contactList.appendChild(contactItem);
//     });
// }

function openModal(index) {
    const contact = contactArray[index];

    document.getElementById('contactName').innerText = contact.FirstName.concat(" ", contact.LastName);
    document.getElementById('contactEmail').innerText = contact.Email;
    document.getElementById('contactPhone').innerText = contact.Phone;
    document.getElementById('contactModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('contactModal').style.display = 'none';
    // displayContacts();
}

// window.onload = populateContacts; //This populates the default array of contents to the contact
window.onload = displayContacts;



//This opens the block with all the users information
function openEditContactModal(firstName, lastName) {
    document.getElementById("editContactModal").style.display = "block";


    // saveContactEdits();
    // document.getElementById("editContactEmail").value = contact.email;
    // document.getElementById("editContactPhone").value = contact.phone;
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

function openUpdateContactModal() {
    document.getElementById("editContactModal").style.display = "block";
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
    const contactIndex = contactArray.findIndex(c => c.name.toLowerCase() === contactName);


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
                //alert(xhr.responseText);
                console.log(jsonPayload);
                let jsonObject = JSON.parse(xhr.responseText);
                // userId = jsonObject.id;
                // if( result < 1 )
                // {		
                //     document.getElementById("deleteResult").innerHTML = "Unable to delete Contact";
                //     return;
                // }

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                //saveCookie();
                contactArray.splice(contactIndex, 1);
            }
        };
        xhr.send(jsonPayload);
        alert("Done!");
    }
    catch (err) {
        document.getElementById("deleteResult").innerHTML = err.message;
    }

    
    document.getElementById('deleteResult').innerHTML = "Contact deleted successfully.";
    displayContacts();
    // closeDeleteContactModal(); I commented this out so we can see the message that the Contact was deleted successfully message.
}

function deleteContactFromModal() {
    const contactName = document.getElementById('contactName').innerText;
    // const contactIndex = contacts.findIndex(c => c.name === contactName);

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
                //alert(xhr.responseText);
                console.log(jsonPayload);
                let jsonObject = JSON.parse(xhr.responseText);


            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("deleteResult").innerHTML = err.message;
    }
    // if (contactIndex !== -1) {
    //     contacts.splice(contactIndex, 1);
    //     closeModal();
    // populateContacts();
    // }
}


function search() {
    const searchName = document.getElementById('searchBar').value.trim().toLowerCase();
    const matchingContacts = contacts.filter(c => c.name.toLowerCase().startsWith(searchName));
    let tmp = { search: searchName };

    const contactList = document.getElementById('contactList');
    contactList.innerHTML = '';

    if (matchingContacts.length > 0) {
        matchingContacts.forEach(contact => {
            const contactElement = document.createElement('div');
            contactElement.classList.add('contact-item');
            contactElement.innerText = contact.name;

            contactElement.addEventListener('click', () => {
                // const contactIndex = contacts.findIndex(c => c.name.toLowerCase() === contact.name.toLowerCase());
                // openModal(contactIndex);//Pass in name , phone number , email 
                openModal(searchName);
            });

            contactList.appendChild(contactElement);
        });
    }
    else {
        contactList.innerHTML = '<div>No contacts found.</div>';
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

    alert(result);



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
                    //alert(xhr.responseText);
                    console.log(jsonPayload);

                    alert(jsonPayload);
                    let jsonObject = JSON.parse(xhr.responseText);


                    if (result < 1) {
                        document.getElementById("addResult").innerHTML = "Unable to Add Contact";
                        return;
                    }
        
                    saveCookie();
                    // alert(userId);

                }
            };
            xhr.send(jsonPayload);
        }
        catch (err) {
            document.getElementById("addResult").innerHTML = err.message;
        }

        // contactArray.splice(0, 0, newContact);
        document.getElementById("addResult").innerHTML = "Successfully Added Contact!"
        
        
    }
    else {
        document.getElementById('addResult').innerHTML = "Please fill out all fields.";
    }


}


// function showContactToEdit() {
//     const Fname = document.getElementById('updateContactFirstName').value;
//     const Lname = document.getElementById('updateContactLastName').value;
//     contact = firstName.concat(" ", lastName);

//     let tmp = {oldFirstName:Fname, oldLastName:Lname};

//     let jsonPayload = JSON.stringify(tmp);
//     let url = urlBase + '/UpdateContacts.' + extension;

//     let xhr = new XMLHttpRequest();

//     xhr.open("POST", url, true);
//     xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");//setRequestHeader is used to inform the server about
//                                                                             //the content that is being sent.
//     try {
//         xhr.onreadystatechange = function () {
//             if (this.readyState == 4 && this.status == 200) {

//                 console.log(jsonPayload);

//                 let jsonObject = JSON.parse(xhr.responseText);
//                 // console.log(jsonObject)
//             }
//         };
//         xhr.send(jsonPayload);
//         alert("Done!");
//     }
//     catch (err) {
//         document.getElementById("contactResult").innerHTML = err.message;
//     }


//     closeSelectContactModal();
//     openEditContactModal(fName, lName);
//     // }
//     // else {
//     //     document.getElementById('contactResult').innerHTML = "Contact not found.";
//     // }
// }

// function saveContactEdits() {
//     const cDecoded = decodeURI(document.cookie);
//     const cArray = cDecoded.split("; ");
//     let result; //result will store the userID

//     cArray.forEach(element => {
//         if (element.indexOf("UserId") == 0) {
//             result = element.substring(6 + 1);
//         }
//     }
//     )

//     // document.getElementById("editContactName").textContent = contact;
//     let oldFname = firstName;
//     let oldLname = lastName;
//     let newFname = document.getElementById("editFirstName").value;
//     let newLname = document.getElementById("editLastName").value;
//     let email = document.getElementById("editContactEmail").value;
//     let phone = document.getElementById("editContactPhone").value;

//     let tmp = {
//         userId: result, oldFirstName: oldFname, oldLastName: oldLname,
//         phone: phone, email: email, newFirstName: newFname, newLastName: newLname
//     };

//     let jsonPayload = JSON.stringify(tmp);
//     let url = urlBase + '/UpdateContacts.' + extension;

//     let xhr = new XMLHttpRequest();

//     xhr.open("POST", url, true);
//     xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");//setRequestHeader is used to inform the server about
//                                                                             //the content that is being sent.
//     try {
//         xhr.onreadystatechange = function () {
//             if (this.readyState == 4 && this.status == 200) {

//                 console.log(jsonPayload);
//                 let jsonObject = JSON.parse(xhr.responseText);

//                 //saveCookie();

//             }
//         };
//         xhr.send(jsonPayload);
//         alert("Done!");
//     }
//     catch (err) {
//         document.getElementById("contactResult").innerHTML = err.message;
//     }

//     closeEditContactModal();
// }

//This function is used when we select a contact from the list of contacts
// function openEditContactModalFromView() {

//     const cDecoded = decodeURI(document.cookie);
//     const cArray = cDecoded.split("; ");
//     let result; //result will store the userID

//     cArray.forEach(element => {
//         if (element.indexOf("UserId") == 0) {
//             result = element.substring(6 + 1);
//         }
//     }
//     )

//     const contactName = document.getElementById('contactName').innerText;
//     const contactEmail = document.getElementById('contactEmail').innerText;
//     const contactPhone = document.getElementById('contactPhone').innerText;

//     //Commented this out since we aren't looking for the name in our local contacts.
//     // const contact = contacts.find(c => c.name === contactName);

//     let textName = contact.name;
//     const nameArray = textName.split(" ");


//     if (contact) {
//         document.getElementById("editContactName").textContent = contact.name;
//         document.getElementById("editFirstName").value = nameArray[0];
//         document.getElementById("editLastName").value = nameArray[1];
//         document.getElementById("editContactEmail").value = contact.email;
//         document.getElementById("editContactPhone").value = contact.phone;

//         closeModal();
//         document.getElementById("editContactModal").style.display = "block";
//     }
// }


// function openSelectContactModal() {
//     document.getElementById("selectContactModal").style.display = "block";
// }

// function closeSelectContactModal() {
//     document.getElementById("selectContactModal").style.display = "none";
// }