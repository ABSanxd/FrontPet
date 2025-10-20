import { Component } from '@angular/core';
import { AdZone } from '../publicidad/components/ad-zone/ad-zone';
import { CommonModule } from '@angular/common';
import { ZoneAd } from '../../models/enums/zoneAd.enum';

@Component({
  selector: 'app-inicio',
  imports: [CommonModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio {
protected readonly ZoneAd = ZoneAd;
}
