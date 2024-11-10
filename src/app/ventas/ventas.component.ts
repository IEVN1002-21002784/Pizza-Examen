import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ComunicacionService } from '../servicio.service';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './pedidos.component.html',
  styles: [],
})
export class PedidosComponent implements OnInit {
  formFiltros!: FormGroup;
  diasSemana: string[] = [
    'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
  ];
  listaMeses: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  tipoFiltro: string = '';
  resultados: { nombreProducto: string; totalPedido: number; fechaPedido: string | null }[] | null | undefined = [];
  sumaTotalPedidos: number = 0;
  mensajeError: string = 'none';

  constructor(private fb: FormBuilder, private servicios: ComunicacionService) {}

  ngOnInit() {
    this.formFiltros = this.crearFormulario();
  }

  crearFormulario(): FormGroup {
    return this.fb.group({
      filtroTipo: [this.tipoFiltro],
      diaSeleccionado: [''],
      mesSeleccionado: ['']
    });
  }

  submitFiltro(): void {
    this.sumaTotalPedidos = 0;
    let filtroFecha;
    const { filtroTipo, diaSeleccionado, mesSeleccionado } = this.formFiltros.value;

    if (filtroTipo === 'dia') {
      filtroFecha = diaSeleccionado;
    } else if (filtroTipo === 'mes') {
      filtroFecha = mesSeleccionado;
    }

    this.resultados = this.comunicacion.filtrar(filtroTipo, filtroFecha);

    if (Array.isArray(this.resultados) && this.resultados.length > 0) {
      this.mensajeError = 'none';
      this.resultados.forEach(resultado => {
        this.sumaTotalPedidos += resultado.totalPedido;
      });
    } else {
      this.mensajeError = 'flex';
    }
    console.log(this.mensajeError);
  }
}
