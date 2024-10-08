// Water Sensors
const int analogInPin = A0;  // Pin for Water Sensor 1 (Yellow Level)
const int analogInPin1 = A1; // Pin for Water Sensor 2 (Orange Level)
int sensorValue = 0;
int sensor2Value = 0;

// Ultrasonic Sensor
#define trigPin 9
#define echoPin 8

// GSM Module
#include <SoftwareSerial.h>
SoftwareSerial sim(10, 11); // RX, TX pins for SIM800L

// Array of phone numbers
const char* phoneNumbers[] = {
  "+639937583174", // Change to your phone numbers
  "+639560338164", // Add more numbers as needed
  "+639XXXXXXXXX"
};
const int numPhones = sizeof(phoneNumbers) / sizeof(phoneNumbers[0]);

bool yellowAlertSent = false;
bool orangeAlertSent = false;
bool redAlertSent = false;

// RGB Module
int redPin = 7; // Ensure this pin supports PWM
int greenPin = 6; // Ensure this pin supports PWM
int bluePin = 5; // Ensure this pin supports PWM

// Buzzer
int buzzerPin = 4; // Pin for the buzzer
unsigned long previousMillis = 0; // Will store the last time the buzzer was updated
const long interval = 1500; // Interval at which to buzz (milliseconds)

void setup() {
  // Initialize serial communication
  Serial.begin(9600);
  
  // Set up Ultrasonic Sensor pins
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  
  // Initialize GSM module
  sim.begin(9600);
  delay(1000);
  Serial.println("System Started...");

  // Set the RGB pins as outputs
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);

  // Set the buzzer pin as output
  pinMode(buzzerPin, OUTPUT);

  // Initial color (green for normal)
  setColor(0, 255, 0);
}

void loop() {
  // Reading Water Sensors
  sensorValue = analogRead(analogInPin); 
  sensor2Value = analogRead(analogInPin1);

  // Print Water Sensor 1 value
  Serial.print("Water Sensor 1 (Yellow Level) = ");
  Serial.println(sensorValue);
  
  // Print Water Sensor 2 value
  Serial.print("Water Sensor 2 (Orange Level) = ");
  Serial.println(sensor2Value);

  // Reading Ultrasonic Sensor
  float duration, distance;
  digitalWrite(trigPin, LOW); 
  delayMicroseconds(2);

  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  duration = pulseIn(echoPin, HIGH);
  distance = (duration / 2) * 0.0344;
  
  // Print Distance from Ultrasonic Sensor
  if (distance >= 400 || distance <= 2) {
    Serial.print("Distance = ");
    Serial.println("Out of range");
    distance = 401; // Set to out of range to avoid false red alerts
  } else {
    Serial.print("Distance = ");
    Serial.print(distance);
    Serial.println(" cm");
  }

  // Alert logic
  bool currentYellowAlert = sensorValue > 400 && distance <= 120;
  bool currentOrangeAlert = sensorValue > 400 && sensor2Value > 400 && distance <= 70;
  bool currentRedAlert = sensorValue > 400 && sensor2Value > 400 && distance < 10 && distance > 2;

  // Buzzer control with priority
  if (currentRedAlert) {
    tone(buzzerPin, 1000); // Continuous tone at 1000Hz
    setColor(255, 0, 0); // Red
    if (!redAlertSent) {
      SendMessage("Emergency: Red Level! The water has reached the red level. Please evacuate immediately to ensure your safety.");
      redAlertSent = true;
    }
  } else if (currentOrangeAlert) {
    unsigned long currentMillis = millis();
    setColor(255, 165, 0); // Orange
    if (!orangeAlertSent) {
      SendMessage("Urgent: Orange Level! The water has reached orange threshold. Please take precautionary measures and prepare for potential evacuation.");
      orangeAlertSent = true;
    }
    if (currentMillis - previousMillis >= interval) {
      previousMillis = currentMillis;
      tone(buzzerPin, 1000, 500); // Tone at 1000Hz for 500ms
    }

  } else if (currentYellowAlert) {
    noTone(buzzerPin); // Turn off buzzer
    setColor(255, 255, 0); // Yellow
    if (!yellowAlertSent) {
      SendMessage("Alert: Yellow Level! The water has reached yellow threshold. Please stay vigilant and be prepared for potential changes.");
      yellowAlertSent = true;
    }
  } else {
    noTone(buzzerPin); // Turn off buzzer
    setColor(0, 255, 0); // Green
  }

  // Reset alerts if water level drops below threshold
  if (!currentYellowAlert && yellowAlertSent) {
    yellowAlertSent = false;
  }
  if (!currentOrangeAlert && orangeAlertSent) {
    orangeAlertSent = false;
  }
  if (!currentRedAlert && redAlertSent) {
    redAlertSent = false;
  }

  // Delay before next reading
  delay(2000);
}

void SendMessage(String SMS) {
  for (int i = 0; i < numPhones; i++) {
    sim.println("AT+CMGF=1");    // Sets the GSM Module in Text Mode
    delay(200);
    sim.println("AT+CMGS=\"" + String(phoneNumbers[i]) + "\"\r"); // Mobile phone number to send message
    delay(200);
    sim.println(SMS);
    delay(100);
    sim.println((char)26); // ASCII code of CTRL+Z
    delay(3000); // Delay to ensure SMS are sent properly to each number
    String _buffer = _readSerial();
    Serial.println(_buffer);
  }
}

String _readSerial() {
  int _timeout = 0;
  while (!sim.available() && _timeout < 12000) {
    delay(13);
    _timeout++;
  }
  if (sim.available()) {
    return sim.readString();
  }
  return "";
}

void setColor(int red, int green, int blue) {
  analogWrite(redPin, red);
  analogWrite(greenPin, green);
  analogWrite(bluePin, blue);
}
