CREATE DATABASE SmallProject;

USE SmallProject;

-- Users table
CREATE TABLE `SmallProject`.`Users`
(
`ID` INT NOT NULL AUTO_INCREMENT ,
`DateCreated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
`DateLastLoggedIn` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
`FirstName` VARCHAR(50) NOT NULL DEFAULT '' ,
`LastName` VARCHAR(50) NOT NULL DEFAULT '' ,
`Login` VARCHAR(50) NOT NULL DEFAULT '' ,
`Password` VARCHAR(50) NOT NULL DEFAULT '' ,
PRIMARY KEY (ID)
) ENGINE = InnoDB;

-- Contacts table
CREATE TABLE `SmallProject`.`Contacts`
(
`ID` INT NOT NULL AUTO_INCREMENT ,
`FirstName` VARCHAR(50) NOT NULL DEFAULT '' ,
`LastName` VARCHAR(50) NOT NULL DEFAULT '' ,
`Phone` VARCHAR(50) NOT NULL DEFAULT '' ,
`Email` VARCHAR(50) NOT NULL DEFAULT '' ,
`UserID` INT NOT NULL DEFAULT '0' ,
PRIMARY KEY (ID),
FOREIGN KEY (UserID) REFERENCES Users(ID) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- Create test users
INSERT INTO Users (FirstName, LastName, Login, Password) VALUES ('John', 'Doe', 'jdoe', 'password');
INSERT INTO Users (FirstName, LastName, Login, Password) VALUES ('Jane', 'Smith', 'jsmith', 'password');

-- Test contacts for user 1
INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID)
VALUES 
('Alice', 'Smith', '123-456-7890', 'alice.smith@example.com', 1),
('Bob', 'Jones', '234-567-8901', 'bob.jones@example.com', 1),
('Carol', 'Williams', '345-678-9012', 'carol.williams@example.com', 1),
('David', 'Brown', '456-789-0123', 'david.brown@example.com', 1),
('Eve', 'Davis', '567-890-1234', 'eve.davis@example.com', 1);

-- Test contacts for user 2
INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID)
VALUES 
('Frank', 'Miller', '678-901-2345', 'frank.miller@example.com', 2),
('Grace', 'Wilson', '789-012-3456', 'grace.wilson@example.com', 2),
('Hank', 'Moore', '890-123-4567', 'hank.moore@example.com', 2),
('Ivy', 'Taylor', '901-234-5678', 'ivy.taylor@example.com', 2),
('Jack', 'Anderson', '012-345-6789', 'jack.anderson@example.com', 2);
