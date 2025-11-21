import { Component, OnInit } from '@angular/core';

interface ConfettiPiece {
  id: number;
  color: string;
  left: number;
  delay: number;
}

@Component({
  selector: 'app-donaciones',
  templateUrl: './donaciones.html',
  styleUrls: ['./donaciones.css']
})
export class Donaciones implements OnInit {
  confettiPieces: ConfettiPiece[] = [];

  ngOnInit(): void {
    this.generateConfetti();
  }

  generateConfetti(): void {
    const numConfetti = 50;
    const palette = ['#EE8E4F', '#1E8C88', '#A5B463', '#EE4F4F'];

    for (let i = 0; i < numConfetti; i++) {
      this.confettiPieces.push({
        id: i,
        color: palette[Math.floor(Math.random() * palette.length)],
        left: Math.floor(Math.random() * 100),
        delay: Math.random() * 5
      });
    }
  }
}
