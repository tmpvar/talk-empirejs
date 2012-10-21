void setup() {
 pinMode(13, OUTPUT); 
}

int on = LOW;
void loop() {
 digitalWrite(13, on);
 on = !on;
 delay(100);
}
