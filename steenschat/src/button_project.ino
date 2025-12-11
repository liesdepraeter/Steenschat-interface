
// digital pin 2 has a pushbutton attached to it. Give it a name:
int greenButton = 2;
int greenLed = 3;

int blueButton = 5;
int blueLed = 6;

int redButton = 8;
int redLed = 9;

int yellowButton = 11;
int yellowLed = 12;

// the setup routine runs once when you press reset:
void setup() {
  // initialize serial communication at 9600 bits per second:
  Serial.begin(9600);
  // make the pushbutton's pin an input with pull-up:
  pinMode(blueButton, INPUT_PULLUP);
  pinMode(yellowButton, INPUT_PULLUP);
  pinMode(redButton, INPUT_PULLUP);
  pinMode(greenButton, INPUT_PULLUP);
  pinMode(blueLed, OUTPUT);
  pinMode(yellowLed, OUTPUT);
  pinMode(redLed, OUTPUT);
  pinMode(greenLed, OUTPUT);
}

// the loop routine runs over and over again forever:
void loop() {
  // read the input pin:
  int blueButtonState = digitalRead(blueButton);
  int yellowButtonState = digitalRead(yellowButton);
  int redButtonState = digitalRead(redButton);
  int greenButtonState = digitalRead(greenButton);
  
  // Send button states while pressed (0 = pressed with INPUT_PULLUP)
  if (redButtonState == 0) {
    Serial.println("red");
    digitalWrite(redLed, HIGH);
  } else {
    digitalWrite(redLed, LOW);
  }
  
  if (greenButtonState == 0) {
    Serial.println("green");
    digitalWrite(greenLed, HIGH);
  } else {
    digitalWrite(greenLed, LOW);
  }
  
  if (blueButtonState == 0) {
    Serial.println("blue");
    digitalWrite(blueLed, HIGH);
  } else {
    digitalWrite(blueLed, LOW);
  }
  
  if (yellowButtonState == 0) {
    Serial.println("yellow");
    digitalWrite(yellowLed, HIGH);
  } else {
    digitalWrite(yellowLed, LOW);
  }
  
  delay(100);  // Send updates every 100ms
}