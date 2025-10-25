// src/app/features/inicio/inicio.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZoneAd } from '../../models/enums/zoneAd.enum';
import { AdZone } from '../publicidad/components/ad-zone/ad-zone'; 

// --- NUEVO IMPORT ---
import { ListarMascotas } from '../mascotas/listar-mascotas/listar-mascotas';

@Component({
  selector: 'app-inicio',
  imports: [CommonModule, AdZone, ListarMascotas], 
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio {
  // Dejamos solo la lógica que pertenece a inicio
  protected readonly ZoneAd = ZoneAd; 
}