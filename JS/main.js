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