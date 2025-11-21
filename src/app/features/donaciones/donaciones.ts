import { Component, OnInit } from '@angular/core';

interface ConfettiPiece {
  id: number;
  color: string;
}

@Component({
  selector: 'app-donaciones',
  templateUrl: './donaciones.html',
  styleUrls: ['./donaciones.css']
})
export class Donaciones implements OnInit {
  confettiPieces: ConfettiPiece[] = [];

  constructor() {}

  ngOnInit(): void {
    this.generateConfetti();
  }

  generateConfetti(): void {
    const numConfetti = 50;
    const palette = ['#EE8E4F', '#1E8C88', '#A5B463', '#EE4F4F']; // Naranja, Celeste, Verde, Rojo

    for (let i = 0; i < numConfetti; i++) {
      this.confettiPieces.push({
        id: i,
        color: palette[Math.floor(Math.random() * palette.length)]
      });
    }
  }

  getRandomPosition(): number {
    return Math.floor(Math.random() * 100);
  }

  getRandomDelay(): number {
    return Math.random() * 5;
  }

  getConfettiColor(index: number): string {
    return this.confettiPieces[index].color;
  }
}
