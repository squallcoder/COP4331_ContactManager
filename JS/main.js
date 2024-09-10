function doLogin() {
    const username = document.getElementById('loginName').value;
    const password = document.getElementById('loginPassword').value;
    
    if (username && password) {
        document.getElementById('loginResult').innerHTML = "Logged In!";
    } 
    else {
        document.getElementById('loginResult').innerHTML = "Please enter a valid username and password.";
    }
}

function createAccount() {
    const username = document.getElementById('createUsername').value;
    const password = document.getElementById('createPassword').value;
    
    if (username && password) {
        document.getElementById('loginResult').innerHTML = "Account Created!";
    } 
    else {
        document.getElementById('loginResult').innerHTML = "Please enter a valid username and password.";
    }
}