
DROP DATABASE IF EXISTS `site-db`;
CREATE DATABASE IF NOT EXISTS `site-db`;
USE `site-db`;


-- IMPORTANT                              |
-- When importing this DB, change the file addresses in the PRODUCTS
-- table to the correct location of their images on your system.

-- Part A: Creating Tables

-- Creating Users table
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Street VARCHAR(255),
    City VARCHAR(100),
    ZipCode VARCHAR(20),
    CONSTRAINT chk_email CHECK (Email LIKE '%@%.%')
);

-- Creating Payments table
CREATE TABLE Payments (
    PaymentID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    PaymentType VARCHAR(50) NOT NULL,
    CardNumber VARCHAR(20) NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Creating Suppliers table
CREATE TABLE Suppliers (
    SupplierID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Street VARCHAR(255),
    City VARCHAR(100),
    ZipCode VARCHAR(20)
);

-- Creating Products table
CREATE TABLE Products (
    ProductID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Description TEXT,
    Price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    Image BLOB,
    StockLevel INT NOT NULL DEFAULT 0,
    SupplierID INT,
    CONSTRAINT chk_price CHECK (Price >= 0.00),
    FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- Creating Tags table
CREATE TABLE Tags (
    TagID INT AUTO_INCREMENT PRIMARY KEY,
    TagName VARCHAR(50) NOT NULL UNIQUE
);

-- Creating ProductTags table
CREATE TABLE ProductTags (
    ProductID INT,
    TagID INT,
    PRIMARY KEY (ProductID, TagID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (TagID) REFERENCES Tags(TagID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Creating Orders table
CREATE TABLE Orders (
    OrderID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    OrderDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    TotalAmount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    Status VARCHAR(50) DEFAULT 'Pending',
    CONSTRAINT chk_status CHECK (Status IN ('Pending', 'Shipped', 'Delivered', 'Cancelled')),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Creating OrderDetails table
CREATE TABLE OrderDetails (
    OrderDetailID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT,
    ProductID INT,
    Quantity INT NOT NULL DEFAULT 1,
    Price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Creating Reviews table
CREATE TABLE Reviews (
    ReviewID INT AUTO_INCREMENT PRIMARY KEY,
    ProductID INT,
    UserID INT,
    Rating INT CHECK (Rating >= 1 AND Rating <= 5),
    Comment TEXT,
    ReviewDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Part B: Inserting Sample Data

-- Inserting Sample Data for Users
INSERT INTO Users (FirstName, LastName, Email, PasswordHash, Street, City, ZipCode) VALUES
('Harry', 'Potter', 'harry@hogwarts.com', 'hashed_password1', '4 Privet Drive', 'Little Whinging', '12345'),
('Hermione', 'Granger', 'hermione@hogwarts.com', 'hashed_password2', 'Hampstead', 'London', 'NW3'),
('Ron', 'Weasley', 'ron@hogwarts.com', 'hashed_password3', 'The Burrow', 'Ottery St Catchpole', 'EX11'),
('Albus', 'Dumbledore', 'albus@hogwarts.com', 'hashed_password4', 'Hogwarts', 'Scotland', 'H1G'),
('Severus', 'Snape', 'severus@hogwarts.com', 'hashed_password5', 'Hogwarts', 'Scotland', 'H1G'),
('Minerva', 'McGonagall', 'minerva@hogwarts.com', 'hashed_password6', 'Hogwarts', 'Scotland', 'H1G'),
('Rubeus', 'Hagrid', 'hagrid@hogwarts.com', 'hashed_password7', 'Hagrid\'s Hut', 'Hogwarts Grounds', 'H1G'),
('Draco', 'Malfoy', 'draco@hogwarts.com', 'hashed_password8', 'Malfoy Manor', 'Wiltshire', 'SN12'),
('Luna', 'Lovegood', 'luna@hogwarts.com', 'hashed_password9', 'Ottery St Catchpole', 'Devon', 'EX11'),
('Neville', 'Longbottom', 'neville@hogwarts.com', 'hashed_password10', 'Hogwarts', 'Scotland', 'H1G');

-- Inserting Sample Data for Payments
INSERT INTO Payments (UserID, PaymentType, CardNumber) VALUES
(1, 'Visa', '1234'),
(2, 'MasterCard', '5678'),
(3, 'Amex', '9012'),
(4, 'Visa', '3456'),
(5, 'MasterCard', '7890'),
(6, 'Visa', '1234'),
(7, 'Visa', '5678'),
(8, 'MasterCard', '9012'),
(9, 'Amex', '3456'),
(10, 'Visa', '7890');

-- Inserting Sample Data for Suppliers
INSERT INTO Suppliers (SupplierID, Name, Street, City, ZipCode) VALUES
(1, 'Weasleys\' Wizard Wheezes', 'Diagon Alley', 'London', 'WC2N 5DU'),
(2, 'Borgin and Burkes', 'Knockturn Alley', 'London', 'WC2N 5DU'),
(3, 'Ollivanders', 'Diagon Alley', 'London', 'WC2N 5DU'),
(4, 'Flourish and Blotts', 'Diagon Alley', 'London', 'WC2N 5DU'),
(5, 'Eeylops Owl Emporium', 'Diagon Alley', 'London', 'WC2N 5DU'),
(6, 'Madam Malkin\'s', 'Diagon Alley', 'London', 'WC2N 5DU'),
(7, 'Magical Menagerie', 'Diagon Alley', 'London', 'WC2N 5DU'),
(8, 'Quality Quidditch Supplies', 'Diagon Alley', 'London', 'WC2N 5DU'),
(9, 'Slug and Jiggers Apothecary', 'Diagon Alley', 'London', 'WC2N 5DU'),
(10, 'Gambol and Japes', 'Diagon Alley', 'London', 'WC2N 5DU'),
(11, 'Dungeon Adventurers', 'Skyrim', 'Tamriel', '12345');



-- Sample data for Products
INSERT INTO Products (Name, Description, Price, Image, StockLevel, SupplierID) VALUES
('Invisibility Cloak', 'A cloak that makes the wearer invisible.', 299.99, LOAD_FILE('/Users/owen/Desktop/445images/inviscloak.jpg'), 10, 1),
('Time-Turner', 'A device used for time travel.', 199.99, LOAD_FILE('/Users/owen/Desktop/445images/timeturner.jpg'), 5, 2),
('Elder Wand', 'The most powerful wand ever made.', 999.99, LOAD_FILE('/Users/owen/Desktop/445images/elderwand.jpg'), 3, 3),
('Firebolt', 'A high-speed broomstick.', 499.99, LOAD_FILE('/Users/owen/Desktop/445images/firebolt.jpg'), 7, 8),
('The Monster Book of Monsters', 'A book that bites.', 49.99, LOAD_FILE('/Users/owen/Desktop/445images/monsterbook.jpg'), 15, 4),
('Polyjuice Potion', 'A potion that allows the drinker to assume the form of someone else.', 99.99, LOAD_FILE('/Users/owen/Desktop/445images/polyjuice.jpg'), 20, 9),
('Golden Snitch', 'The ball used in Quidditch.', 29.99, LOAD_FILE('/Users/owen/Desktop/445images/goldensnitch.jpg'), 25, 8),
('Phoenix Feather Wand', 'A wand with a core of phoenix feather.', 299.99, LOAD_FILE('/Users/owen/Desktop/445images/phoenixwand.jpg'), 8, 3),
('Cauldron', 'A standard-sized cauldron for potion-making.', 19.99, LOAD_FILE('/Users/owen/Desktop/445images/cauldron.jpg'), 50, 9),
('Spectrespecs', 'Luna Lovegood\'s glasses.', 14.99, LOAD_FILE('/Users/owen/Desktop/445images/spectrespecs.jpg'), 30, 10), 
('Healing Potion', 'Potion for healing small wounds.', 19.99, LOAD_FILE('/Users/owen/Desktop/445images/healingpotion.jpg'), 100, 11),
('Staff of Fireball', 'Staff bound for launching explosive fire magic. Tuned for range and extreme temperature.', 3500.00, LOAD_FILE('/Users/owen/Desktop/445images/stafffireball.jpg'), 1, 11),
('Ancient Draugr Sword', 'Ancient Nord sword artifact from the first era.', 299.99, LOAD_FILE('/Users/owen/Desktop/445images/draugrsword.jpg'), 1, 11);

-- Sample data for Tags
INSERT INTO Tags (TagName) VALUES
('Magic'),
('Invisibility'),
('Time Travel'),
('Wand'),
('Broomstick'),
('Book'),
('Potion'),
('Quidditch'),
('Owl'),
('Clothing');

-- Sample data for ProductTags
INSERT INTO ProductTags (ProductID, TagID) VALUES
(1, 1),
(1, 2),
(2, 3),
(3, 1),
(3, 4),
(4, 1),
(4, 5),
(5, 1),
(5, 6),
(6, 1),
(6, 7),
(7, 1),
(7, 8),
(8, 1),
(8, 4),
(9, 1),
(9, 7),
(10, 10),
(11, 7),
(12, 1),
(13, 1);

-- Sample data for Orders
INSERT INTO Orders (UserID, TotalAmount, Status) VALUES
(1, 299.99, 'Pending'),
(2, 199.99, 'Shipped'),
(3, 999.99, 'Delivered'),
(4, 499.99, 'Cancelled'),
(5, 49.99, 'Pending'),
(6, 99.99, 'Shipped'),
(7, 29.99, 'Delivered'),
(8, 299.99, 'Cancelled'),
(9, 19.99, 'Pending'),
(10, 14.99, 'Shipped');

-- Sample data for OrderDetails
INSERT INTO OrderDetails (OrderID, ProductID, Quantity, Price) VALUES
(1, 1, 1, 299.99),
(2, 2, 1, 199.99),
(3, 3, 1, 999.99),
(4, 4, 1, 499.99),
(5, 5, 1, 49.99),
(6, 6, 1, 99.99),
(7, 7, 1, 29.99),
(8, 8, 1, 299.99),
(9, 9, 1, 19.99),
(10, 10, 1, 14.99);

-- Sample data for Reviews
INSERT INTO Reviews (ProductID, UserID, Rating, Comment) VALUES
(1, 1, 5, 'Amazing product!'),
(2, 2, 4, 'Very useful.'),
(3, 3, 5, 'Incredible wand.'),
(4, 4, 3, 'Good but expensive.'),
(5, 5, 4, 'Fun to read.'),
(6, 6, 4, 'Effective potion.'),
(7, 7, 5, 'Great for Quidditch.'),
(8, 8, 5, 'Beautiful wand.'),
(9, 9, 3, 'Basic but necessary.'),
(10, 10, 4, 'Stylish glasses.');
COMMIT;