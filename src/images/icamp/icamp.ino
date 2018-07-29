/*
  BluetoohBasic:LEDONOFF-Avishkar
  Coder-MayooghGirish
  Website-http://bit.do/Avishkar
  DownloadtheApp:https://github.com/Mayoogh/Arduino-Bluetooth-Basic
  ThisprogramletsyoutocontrolaLEDonpin13ofarduinousingabluetoothmodule
*/
byte data = 1; //Variableforstoringreceiveddata
//controldirections
int in1 = 3;
int in2 = 4;
int in3 = 5;
int in4 = 6;
int ena = 10;
void setup()
{
  Serial.begin(9600); //Setsthebaudforserialdatatransmission
  pinMode(in1, OUTPUT);
  pinMode(in2, OUTPUT);
  pinMode(in3, OUTPUT);
  pinMode(in4, OUTPUT);
  pinMode(ena, OUTPUT);
}

void loop()
{
  if (Serial.available() > 0) //Senddataonlywhenyoureceivedata:
  {
    data = Serial.read(); //Readtheincomingdata&storeintodata Stringx=
    switch (data) {
      case'a':
        //fr
        Serial.print('1');
        digitalWrite(in1, HIGH);
        digitalWrite(in3, LOW);
        digitalWrite(in2, LOW);
        digitalWrite(in4, LOW);
        analogWrite(ena, 100);
        break;
      case's':
        //fn
        Serial.print('2');
        digitalWrite(in2, LOW);
        digitalWrite(in4, LOW);
        digitalWrite(in1, HIGH);
        digitalWrite(in3, HIGH);
        analogWrite(ena, 100);
        //correct
        break;
      case'd':
        //fl
        Serial.print('3');
        //CORRECT
        digitalWrite(in1, HIGH);
        digitalWrite(in3, HIGH);
        digitalWrite(in2, HIGH);
        digitalWrite(in4, LOW);
        analogWrite(ena, 100);
        break;
      case'j':
        //br
        Serial.print('4');
        digitalWrite(in1, LOW);
        digitalWrite(in3, HIGH);
        digitalWrite(in2, HIGH);
        digitalWrite(in4, HIGH);
        analogWrite(ena, 100);
        break;
      case'l':
        //bl
        Serial.print('5');
        digitalWrite(in1, LOW);
        digitalWrite(in3, LOW);
        digitalWrite(in2, LOW);
        digitalWrite(in4, HIGH);
        analogWrite(ena, 100);
        break;
      case'k':
        //bn
        Serial.print('6');
        digitalWrite(in2, HIGH);
        digitalWrite(in4, HIGH);
        digitalWrite(in1, LOW);
        digitalWrite(in3, LOW);
        analogWrite(ena, 100);
        break;
      case'z':
        //fr
        Serial.print('1');
        digitalWrite(in1, HIGH);
        digitalWrite(in3, LOW);
        digitalWrite(in2, LOW);
        digitalWrite(in4, LOW);
        analogWrite(ena, 255);
        break;
      case'x':
        //fn
        Serial.print('2');
        digitalWrite(in2, LOW);
        digitalWrite(in4, LOW);
        digitalWrite(in1, HIGH);
        digitalWrite(in3, HIGH);
        analogWrite(ena, 255);
        //correct
        break;
      case'c':
        //fl
        Serial.print('3');
        //CORRECT
        digitalWrite(in1, HIGH);
        digitalWrite(in3, HIGH);
        digitalWrite(in2, HIGH);
        digitalWrite(in4, LOW);
        analogWrite(ena, 255);
        break;
      case'v':
        //br
        Serial.print('4');
        digitalWrite(in1, LOW);
        digitalWrite(in3, HIGH);
        digitalWrite(in2, HIGH);
        digitalWrite(in4, HIGH);
        analogWrite(ena, 255);
        break;
      case'n':
        //bl
        Serial.print('5');
        digitalWrite(in1, LOW);
        digitalWrite(in3, LOW);
        digitalWrite(in2, LOW);
        digitalWrite(in4, HIGH);
        analogWrite(ena, 255);
        break;
      case'b':
        //bn
        Serial.print('6');
        digitalWrite(in2, HIGH);
        digitalWrite(in4, HIGH);
        digitalWrite(in1, LOW);
        digitalWrite(in3, LOW);
        analogWrite(ena, 255);
        break;
      case'q':
        Serial.print('7');
        digitalWrite(in1, LOW);
        digitalWrite(in3, LOW);
        digitalWrite(in2, LOW);
        digitalWrite(in4, LOW);
        analogWrite(ena, 255);
        break;
    }
    Serial.print("\n");
  }
}
