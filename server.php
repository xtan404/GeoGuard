<?php
$servername = "localhost";
$username = "u992817289_geoguard";
$password = "F?+HO=VZJn4y";
$dbname = "u992817289_geoguard_db";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get data from NodeMCU
$battery_voltage = $_POST['battery_voltage'];
$battery_percentage = $_POST['battery_percentage'];
$sensor_one = $_POST['sensor_one'];
$sensor_two = $_POST['sensor_two'];
$ultrasonic = $_POST['ultrasonic'];

// Insert data into database
$sql = "INSERT INTO readings (sensor_one, sensor_two, ultrasonic, battery_voltage, battery_percentage)
VALUES ('$sensor_one', '$sensor_two', '$ultrasonic', '$battery_voltage', '$battery_percentage')";

if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
