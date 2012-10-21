#!/usr/bin/env bash

avr-gcc -Wall -Os -DF_CPU=16000000 -mmcu=atmega328p main.c -o main.o

avr-objcopy -j .text -j .data -O ihex main.o main.hex

PORT=`ls /dev/tty.usb*`
avrdude -c arduino -P $PORT -U flash:w:main.hex:i -p m328p