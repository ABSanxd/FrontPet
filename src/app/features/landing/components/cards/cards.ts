import { Component } from '@angular/core';

@Component({
  selector: 'app-cards',
  imports: [],
  templateUrl: './cards.html',
  styleUrl: './cards.css'
})
export class Cards {
  cards = [
    {
      img: 'assets/star-trofeo.svg',
      title: 'Gana puntos y sube de nivel',
      text: 'Cada cuidado diario de tu mascota te da XP. Completa retos y desbloquea logros exclusivos.'
    },
    {
      img: 'assets/animalitos.png',
      title: 'Tus mascotas bajo control',
      text: 'Registra todos tus peludos, lleva su historial de vacunas, edad y progreso en un solo lugar.'
    },
    {
      img: 'assets/medalla.svg',
      title: 'Desafíate a ti mismo',
      text: 'Compite en el ranking, gana medallas y muestra que eres el dueño más responsable.'
    }
  ];
}
