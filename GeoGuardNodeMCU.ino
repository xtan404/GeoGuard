// Define pins
const int batteryPin = A0;        // Battery monitoring pin
const int waterSensor1Digital = D1;   // Digital pin for the first water sensor
const int waterSensor2Digital = D2;   // Digital pin for the second water sensor
const int trigPin = D5;           // Trig pin for ultrasonic sensor
const int echoPin = D6;           // Echo pin for ultrasonic sensor

// Battery monitoring variables
float voltage;
float bat_percentage;

// New conversion factor
const float conversionFactor = 2;


void setup() {
  Serial.begin(9600);
  Serial.println("System Started...");
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(waterSensor1Digital, INPUT);
  pinMode(waterSensor2Digital, INPUT);
}

void loop() {
  // Read battery voltage
  int sensorValue = analogRead(batteryPin);
  voltage = (((sensorValue * 3.3) / 1024) * 4.8 ); 
  bat_percentage = mapfloat(voltage, 5.3, 12.0, 0, 100); 
  
  // Clamp battery percentage within range
  if (bat_percentage >= 100) {
    bat_percentage = 100;
  } else if (bat_percentage <= 0) {
    bat_percentage = 1;
  }

  // Print Battery Information
  Serial.println("--------------------------------------------------------");
  Serial.print("Battery Voltage = ");
  Serial.print(voltage);
  Serial.print(" V\tBattery Percentage = ");
  Serial.print(bat_percentage);
  Serial.println(" %");

  // Read water sensors
  int waterSensor1Value = pulseIn(waterSensor1Digital, HIGH);
  int waterSensor2Value = pulseIn(waterSensor2Digital, HIGH);

  // Convert digital readings to analog-like values using the new conversion factor
  int waterSensor1Analog = waterSensor1Value / conversionFactor;
  int waterSensor2Analog = waterSensor2Value / conversionFactor;

  // Print Water Sensor Information
  Serial.print("Water Sensor 1: ");
  Serial.println(waterSensor1Analog);
  Serial.print("Water Sensor 2: ");
  Serial.println(waterSensor2Analog);

  // Read ultrasonic sensor
  float duration, distance;
  digitalWrite(trigPin, LOW);
  delayMicroseconds(5); // Increased delay to ensure proper triggering
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  duration = pulseIn(echoPin, HIGH); // Timeout of 30ms to avoid lockup
  if (duration == 0) {
    Serial.println("Ultrasonic Sensor: No echo received");
  } else {
    distance = (duration / 2) * 0.0344 - 2.51;

    // Validate and print Ultrasonic Sensor Information
    if (distance > 0 && distance < 400) { // Valid range for HC-SR04 sensor
      Serial.print("Ultrasonic Distance: ");
      Serial.print(distance);
      Serial.println(" cm");
    } else {
      Serial.println("Ultrasonic Sensor: Invalid distance");
    }
  }

  delay(3300);  // Delay for 1 second before next reading
}

// Function to map float values
float mapfloat(float x, float in_min, float in_max, float out_min, float out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
