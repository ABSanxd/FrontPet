import { Component } from '@angular/core';

@Component({
  selector: 'app-carousel',
  imports: [],
  templateUrl: './carousel.html',
  styleUrl: './carousel.css'
})
export class Carousel {
  slides = [
    {
      img: 'assets/img-landing-01.png',
      title: 'Cuida a tu mascota, diviértete <br> y gana recompensas',
      text: 'Registra tus mascotas, completa retos diarios y <br> sube de nivel mientras tu peludo disfruta',
      active: true

    },
    {
      img: 'assets/img-landing-02.png',
      title: 'Adopta a tu mejor amigo <br> o ayuda a que encuentre un hogar',
      text: 'Explora mascotas en adopción cerca de ti o publica <br> un animal callejero para que encuentre una familia.'
    },
    {
      img: 'assets/img-landing-03.png',
      title: 'Conviértete en el dueño <br> más responsable',
      text: 'Cada tarea completada te hace super WOOF!'
    }
  ];
}

