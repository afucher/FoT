
#include "SPI.h"
#include <ESP8266WiFi.h>
#include "SocketIoClient.h"
#include <sstream>

#define USE_SERIAL Serial


//wifi
const char* ssid     = "SydneiNote";
const char* password = "01010101";


//GPIO's nodemcu
const int trigPin = 2;  //D4
const int echoPin = 5;  //D3

const int powerLed = 4;  //D2
boolean isLedOn = false;

long duration;
int distance;

SocketIoClient webSocket;
const char* sensorId = "\"873612\"";
long int interval = 2000;
int temp = 0;

boolean isConnected = false;
long previousMillis = 0;

void setup() {
  Serial.begin(115200);
    
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");  
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());


  //connect websocket

    webSocket.begin("fluig05.hackathon2017.fluig.io",3000);
      
    webSocket.on("established", setEstablished);
    webSocket.on("interval", setInterval);
    webSocket.on("disconnected", setDisconnected);

    //Sensor GPIO's 
    pinMode(trigPin, OUTPUT); // Sets the trigPin as an Output
    pinMode(echoPin, INPUT); // Sets the echoPin as an Input
    pinMode(BUILTIN_LED, OUTPUT);

    pinMode(powerLed, OUTPUT); // Sets the trigPin as an Output

} 


void setEstablished(const char * _connected, size_t length) {
  isConnected = true;
  USE_SERIAL.printf("registering...");
  webSocket.emit("register",sensorId);
  temp = millis();
}

void setInterval(const char * _interval, size_t length) {
  USE_SERIAL.printf("got interval: %s\n", _interval);
  interval = atol(_interval) ;
  USE_SERIAL.printf("interval=  %ld\n", interval);
}

void setDisconnected(const char * _disconnected, size_t length) {
  isConnected = false;
  interval = 0;
  USE_SERIAL.printf("No connection to server...\n");
}

void loop() {      

      
      webSocket.loop();
      long currentMillis = millis();

        // Clears the trigPin
        digitalWrite(trigPin, LOW);
        delayMicroseconds(2);
        
        // Sets the trigPin on HIGH state for 10 micro seconds
        digitalWrite(trigPin, HIGH);
        delayMicroseconds(10);
        digitalWrite(trigPin, LOW);
        
        // Reads the echoPin, returns the sound wave travel time in microseconds
        duration = pulseIn(echoPin, HIGH);
        
        // Calculating the distance
        distance= duration*0.034/2;
          
      if(isConnected && interval != 0 && ((currentMillis - previousMillis) >= (interval*1000) ) ){
           if( !isLedOn ){
               digitalWrite(powerLed, HIGH);
           }else{
               digitalWrite(powerLed, LOW);            
           }
           
           isLedOn = !isLedOn;
           
           previousMillis = currentMillis ;
           // Prints the distance on the Serial Monitor
           USE_SERIAL.printf("Distance: ");
           Serial.println(distance);
           char distanceParsed[50];
           ltoa(distance,distanceParsed,10);
           USE_SERIAL.printf(distanceParsed);
           char distanceStr[256];
           sprintf(distanceStr,"%s\n",distanceParsed);
           webSocket.emit("measure",distanceStr);
      }else{
        
      }
}
