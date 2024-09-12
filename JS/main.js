function doLogin() {
    const username = document.getElementById('loginName').value;
    const password = document.getElementById('loginPassword').value;
    
    if (username && password) {
        window.location.href = 'contacts.html';
    } 
    else {
        document.getElementById('loginResult').innerHTML = "Please enter a valid username and password.";
    }
}

function createAccount() {
    const username = document.getElementById('createUsername').value;
    const password = document.getElementById('createPassword').value;
    const confpassword = document.getElementById('confirmPassword').value;
    if (password != confpassword) {
        document.getElementById('loginResult').innerHTML = "Your passwords do not match.";
    }
    else {
        if (username && password && confpassword) {
            document.getElementById('loginResult').innerHTML = "Account Created!";
            document.getElementById('loginRedirect').style.display = 'inline';
        }
        else {
            document.getElementById('loginResult').innerHTML = "Please enter a valid username and password.";
        }
    }
}

const contacts = [
    { name: 'Alice Johnson', email: 'alice.johnson@example.com', phone: '555-123-4567' },
    { name: 'Bob Smith', email: 'bob.smith@example.com', phone: '555-987-6543' },
    { name: 'Charlie Brown', email: 'charlie.brown@example.com', phone: '555-876-5432' },
    { name: 'David Wilson', email: 'david.wilson@example.com', phone: '555-432-1098' },
    { name: 'Eva Martinez', email: 'eva.martinez@example.com', phone: '555-246-8102' },
    { name: 'Fiona Davis', email: 'fiona.davis@example.com', phone: '555-135-7913' },
    { name: 'George Harris', email: 'george.harris@example.com', phone: '555-864-2097' },
    { name: 'Hannah Lee', email: 'hannah.lee@example.com', phone: '555-753-1482' },
    { name: 'Isaac Clark', email: 'isaac.clark@example.com', phone: '555-951-2364' },
    { name: 'Jessica Adams', email: 'jessica.adams@example.com', phone: '555-852-4671' },
    { name: 'Kyle Foster', email: 'kyle.foster@example.com', phone: '555-963-5284' },
    { name: 'Laura Bennett', email: 'laura.bennett@example.com', phone: '555-654-7389' },
    { name: 'Mark Evans', email: 'mark.evans@example.com', phone: '555-753-1845' },
    { name: 'Nina Gomez', email: 'nina.gomez@example.com', phone: '555-951-7823' },
    { name: 'Oliver White', email: 'oliver.white@example.com', phone: '555-852-3917' },
    { name: 'Paula Reed', email: 'paula.reed@example.com', phone: '555-963-5872' },
    { name: 'Quinn Scott', email: 'quinn.scott@example.com', phone: '555-654-2934' },
    { name: 'Rachel Green', email: 'rachel.green@example.com', phone: '555-753-4891' },
    { name: 'Sam Walker', email: 'sam.walker@example.com', phone: '555-951-8245' },
    { name: 'Tina Carter', email: 'tina.carter@example.com', phone: '555-852-3789' }
];


function populateContacts() {
    const contactList = document.getElementById('contactList');
    contactList.innerHTML = '';

    contacts.forEach((contact, index) => {
        const contactItem = document.createElement('div');
        contactItem.className = 'contact-item';
        contactItem.innerText = contact.name;
        contactItem.onclick = function() {
            openModal(index);
        };
        contactList.appendChild(contactItem);
    });
}

function openModal(index) {
    const contact = contacts[index];
    document.getElementById('contactName').innerText = contact.name;
    document.getElementById('contactEmail').innerText = contact.email;
    document.getElementById('contactPhone').innerText = contact.phone;
    document.getElementById('contactModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('contactModal').style.display = 'none';
}

window.onload = populateContacts;