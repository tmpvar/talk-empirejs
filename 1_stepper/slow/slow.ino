void setup() {
 pinMode(2, OUTPUT); // pulse
 pinMode(5, OUTPUT); // direction
 Serial.begin(9600);
}

int incoming;

void loop() {
 while (Serial.available()) {
   incoming = Serial.read();
   if (incoming == '1') {
     digitalWrite(5, HIGH);
   } else if (incoming == '0') {
     digitalWrite(5, LOW);
   } else {
     // skip the pulse step
     return;
   }
   
   // Pulse pin #2
   digitalWrite(2, HIGH);
   digitalWrite(2, LOW);
 }
}
