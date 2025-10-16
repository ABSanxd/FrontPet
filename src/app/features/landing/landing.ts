import { Component } from '@angular/core';
import { Carousel } from './components/carousel/carousel';
import { Cards } from './components/cards/cards';

@Component({
  selector: 'app-landing',
  imports: [Carousel,Cards],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing {

}
