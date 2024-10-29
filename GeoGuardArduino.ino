// Water Sensors
const int analogInPin = A0;  // Pin for Water Sensor 1 (Yellow Level)
const int analogInPin1 = A1; // Pin for Water Sensor 2 (Orange Level)
int sensorValue = 0;
int sensor2Value = 0;
const int waterSensor1Digital = 3; // Digital pin for transmitting first sensor's data
const int waterSensor2Digital = 9; // Digital pin for transmitting second sensor's data

// Ultrasonic Sensor
#define trigPin 13
#define echoPin 12

// RGB Module
int redPin = 7; // Ensure this pin supports PWM
int greenPin = 6; // Ensure this pin supports PWM
int bluePin = 5; // Ensure this pin supports PWM

// Buzzer
int buzzerPin = 4; // Pin for the buzzer
unsigned long previousMillis = 0; // Will store the last time the buzzer was updated
const long interval = 1500; // Interval at which to buzz (milliseconds)

// Battery Monitoring
const int batteryPin = A5; // Pin for battery voltage monitoring
int batteryValue = 0;
float voltage;
float bat_percentage;

// GSM Module
#include <SoftwareSerial.h>
SoftwareSerial sim(10, 11); // RX, TX pins for SIM800L

// Uptime tracking
unsigned long startTime = 0; // Store the system start time
const unsigned long maintenanceInterval = 15 * 24 * 60 * 60 * 1000UL; // 15 days in milliseconds
bool maintenanceReminderSent = false;

// Timing variables for sensor health readings
unsigned long ultrasonicFailureStart = 0;
unsigned long waterSensorFailureStart = 0;
const long discrepancyThreshold = 120000; // 2 minutes in milliseconds

// Array of phone numbers for responders
const char* phoneNumbers[] = {
  "+639937583174", // Change to your phone numbers
  "+639560338164"
};
const int numPhones = sizeof(phoneNumbers) / sizeof(phoneNumbers[0]);

// Admin phone number (for maintenance alerts)
const char* adminPhoneNumber = "+639560338164";

// Alert Flags
bool yellowAlertSent = false;
bool orangeAlertSent = false;
bool redAlertSent = false;
bool batteryAlertSent20 = false;
bool batteryAlertSent10 = false;
bool batteryAlertSent1 = false;
bool waterSensorFailureAlertSent = false;
bool ultrasonicFailureAlertSent = false;

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

  pinMode(waterSensor1Digital, OUTPUT);
  pinMode(waterSensor2Digital, OUTPUT);

  // Set the RGB pins as outputs
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);

  // Set the buzzer pin as output
  pinMode(buzzerPin, OUTPUT);

  // Initial color (green for normal)
  setColor(0, 255, 0);

  // Record the start time of the system
  startTime = millis();

}

void loop() {
  // Reading Water Sensors
  sensorValue = analogRead(analogInPin); 
  sensor2Value = analogRead(analogInPin1);

  // Transmit the values as PWM signals
  analogWrite(waterSensor1Digital, map(sensorValue, 0, 1023, 0, 255));
  analogWrite(waterSensor2Digital, map(sensor2Value, 0, 1023, 0, 255));

  // Print Water Sensor 1 value
  Serial.println("--------------------------------------------------------");
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

  //  Flood monitoring alert logic
  bool currentYellowAlert = sensorValue > 400 && distance <= 120;
  bool currentOrangeAlert = sensorValue > 400 && sensor2Value > 400 && distance <= 70;
  bool currentRedAlert = sensorValue > 400 && sensor2Value > 400 && distance < 10 && distance > 2;
  
  // Conditional statements for Buzzer and RBG control with SMS Alerts
  // Buzzer and RBG control with SMS Alerts
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

  // Battery Monitoring
  batteryValue = analogRead(batteryPin);
  voltage = (((batteryValue * 5.0) / 1023) * 5); 
  bat_percentage = mapfloat(voltage, 5.3, 12.0, 0, 100); 
  
  // Clamp battery percentage within range
  if (bat_percentage >= 100) {
    bat_percentage = 100;
  } else if (bat_percentage <= 0) {
    bat_percentage = 1;
  }

  // Print Battery Information
  Serial.print("Battery Voltage = ");
  Serial.print(voltage);
  Serial.print(" V\tBattery Percentage = ");
  Serial.print(bat_percentage);
  Serial.println(" %");

  // Battery maintenance alert logic
  bool currentBatteryAlert20 = bat_percentage <= 20;
  bool currentBatteryAlert10 = bat_percentage <= 10;
  bool currentBatteryAlert1 = bat_percentage <= 1;

  // Conditional statements for battery maintenance
  if (currentBatteryAlert1) {
    if (!batteryAlertSent1) {
      SendMessageToAdmin(String(bat_percentage) + "% Battery is nearly empty. This is the last notification and the system may not function properly.");
      batteryAlertSent1 = true;
    }
  } else if (currentBatteryAlert10) {
    if (!batteryAlertSent10) {
      SendMessageToAdmin(String(bat_percentage) + "% Battery. Please recharge the battery immediately.");
      batteryAlertSent10 = true;
    }
  } else if (currentBatteryAlert20) {
    if (!batteryAlertSent20) {
      SendMessageToAdmin(String(bat_percentage) + "% Battery. Please consider recharging soon.");
      batteryAlertSent20 = true;
    }
  }

  // Reset alerts if battery percentage improves
  if (!currentBatteryAlert20 && batteryAlertSent20) {
    batteryAlertSent20 = false;
  }
  if (!currentBatteryAlert10 && batteryAlertSent10) {
    batteryAlertSent10 = false;
  }
  if (!currentBatteryAlert1 && batteryAlertSent1) {
    batteryAlertSent1 = false;
  }

  // Check for maintenance reminder
  checkMaintenanceReminder(startTime, maintenanceInterval, maintenanceReminderSent, 
                          "Regular Maintenance Reminder: The system has been running for 15 days. Please perform the necessary maintenance checks.");
  
  // Sensor health check logic
  bool currentUltrasonicFailure = sensorValue < 400 && sensor2Value < 400 && distance <= 120;
  bool currentWaterSensorFailure = sensorValue > 400 && distance > 120;

  // Check sensor maintenance function
  checkSensorFailure(currentUltrasonicFailure, ultrasonicFailureStart, ultrasonicFailureAlertSent, 
                     "Sensor Failure: Geoguard detects something in range, but water sensors are not responding. Please check sensor functionality.");

  checkSensorFailure(currentWaterSensorFailure, waterSensorFailureStart, waterSensorFailureAlertSent, 
                     "Sensor Failure: Geoguard detects something in range, but water sensors are not responding. Please check sensor functionality.");

  // Delay before next reading
  delay(3300);
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

void SendMessageToAdmin(String SMS) {
    sim.println("AT+CMGF=1");    // Sets the GSM Module in Text Mode
    delay(200);
    sim.println("AT+CMGS=\"" + String(adminPhoneNumber) + "\"\r"); // Mobile phone number to send message
    delay(200);
    sim.println(SMS);
    delay(100);
    sim.println((char)26); // ASCII code of CTRL+Z
    delay(3000); // Delay to ensure SMS are sent properly to each number
    String _buffer = _readSerial();
    Serial.println(_buffer);
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

void checkMaintenanceReminder(unsigned long &startTime, const unsigned long interval, bool &reminderSent, const char* message) {
  unsigned long currentMillis = millis();
  if ((currentMillis - startTime >= interval) && !reminderSent) {
    SendMessageToAdmin(message);
    reminderSent = true;             // Ensure the reminder is sent only once
    startTime = millis();             // Reset the start time
    reminderSent = false;             // Reset the reminder for future reminders
  }
}

// Function to handle sensor failure check and alert
void checkSensorFailure(bool currentFailure, unsigned long &failureStart, bool &alertSent, const char* failureMessage) {
  if (currentFailure) {
    if (failureStart == 0) {
      failureStart = millis();  // Start timer for failure
      Serial.println("SENSOR FAILURE COUNTDOWN");
    } else if (millis() - failureStart >= discrepancyThreshold) {
      if (!alertSent) {
        SendMessageToAdmin(failureMessage);
        alertSent = true;
      }
    }
  } else if (failureStart > 0) {
    failureStart = 0; // Reset timer
    alertSent = false; // Reset alert flag
    Serial.println("COUNTDOWN RESET");
  }
}

void setColor(int red, int green, int blue) {
  analogWrite(redPin, red);
  analogWrite(greenPin, green);
  analogWrite(bluePin, blue);
}

float mapfloat(float x, float in_min, float in_max, float out_min, float out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}



