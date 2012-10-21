#include <avr/io.h>
#include <util/delay.h>

int main() {
  DDRB = 1<<5;

  while (1) {
    // OR
    PORTB |= (1<<5);

    _delay_ms(500);

    // XOR
    PORTB ^= (1<<5);

    _delay_ms(100);
  }

  return 0;
}