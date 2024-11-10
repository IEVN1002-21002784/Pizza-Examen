import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServicioService } from '../servicio.service';
import { CommonModule } from '@angular/common';

interface Pedido {
  pedidoId: number;
  tamano: string;
  ingredientes: string[];
  cantidad: number;
  subtotal: number;
}

@Component({
  selector: 'app-tablacompra',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tablacompra.component.html',
  styles: ``
})
export class TablacompraComponent {
  formularioPedido!: FormGroup;
  pedidos: Pedido[] = [];
  pedidosInfo: Pedido[] = [];
  visibilidadModal = 'hidden';

  constructor(private fb: FormBuilder, private comunicacion: ComunicacionService) {}

  ngOnInit() {
    this.formularioPedido = this.iniciarFormulario();
    this.comunicacion.triggerFunction$.subscribe(() => {
      this.mostrarTabla();
    });
  }

  iniciarFormulario(): FormGroup {
    return this.fb.group({
      pedidoId: [0]
    });
  }

  mostrarTabla() {
    this.pedidosInfo = this.comunicacion.verCompra();
    console.log(this.pedidosInfo);
  }

  eliminarPedido(): void {
    const { pedidoId } = this.formularioPedido.value;
    this.comunicacion.eliminarPedido(pedidoId);
  }

  agregarPedido(): void {
    this.visibilidadModal = 'flex';
  }

  cerrarModal(): void {
    this.visibilidadModal = 'hidden';
  }

  confirmarPedido(): void {
    this.comunicacion.confirmarCompra();
  }
}
