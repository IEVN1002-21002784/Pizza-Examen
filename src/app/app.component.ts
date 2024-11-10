import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {pizzeriaComponent};
import { ComunicacionService } from './servicio.service';
import { TablacompraComponent } from './tabla/tabla.component';
import {Ventas}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,  TablacompraComponent,  , pizzeriaComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'pizza';
}
