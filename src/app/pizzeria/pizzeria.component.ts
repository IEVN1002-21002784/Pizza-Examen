import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TablacompraComponent } from '../tabla/tabla.component';
import { CommonModule } from '@angular/common';

interface Pedido {
  tamanoPizza: string;
  ingredientesPizza: string[];
  cantidadPizza: number;
  subtotalPizza: number;
}

interface DatosCliente {
  nombreCliente: string;
  direccionCliente: string;
  telefonoCliente: string;
  fechaCompra: string;
}

@Component({
  selector: 'app-anadir',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './anadir.component.html',
  styles: ``
})
export class AnadirComponent {
  pedidoFormGroup!: FormGroup;
  datosCliente: DatosCliente = {
    nombreCliente: '',
    direccionCliente: '',
    telefonoCliente: '',
    fechaCompra: ''
  };
  pedidos: Pedido[] = [];

  constructor(private formularioBuilder: FormBuilder, private servicioComunicacion: ComunicacionService) {}

  ngOnInit(): void {
    this.pedidoFormGroup = this.iniciarFormulario();

    // Cargar datos previos del cliente
    const clienteGuardado = localStorage.getItem('datosCliente');
    if (clienteGuardado) {
      this.datosCliente = JSON.parse(clienteGuardado);
    }
  }

  iniciarFormulario(): FormGroup {
    return this.formularioBuilder.group({
      nombreCliente: [''],
      direccionCliente: [''],
      telefonoCliente: [''],
      fechaCompra: [''],
      tamanoPizza: [''],
      ingredienteJamon: [false],
      ingredientePina: [false],
      ingredienteChampinon: [false],
      cantidadPizza: [''],
    });
  }

  activarFuncionOtroComponente() {
    this.servicioComunicacion.triggerFunction();
  }

  alEnviarPedido(): void {
    const { nombreCliente, direccionCliente, telefonoCliente, tamanoPizza, fechaCompra, ingredienteJamon, ingredientePina, ingredienteChampinon, cantidadPizza } = this.pedidoFormGroup.value;

    this.datosCliente = { nombreCliente, direccionCliente, telefonoCliente, fechaCompra };
    this.servicioComunicacion.guardarCliente(this.datosCliente);
    
    const nuevoPedido = {
      tamanoPizza: tamanoPizza,
      ingredienteJamon: ingredienteJamon,
      ingredientePina: ingredientePina,
      ingredienteChampinon: ingredienteChampinon,
      cantidadPizza: cantidadPizza,
    };

    const pedidoConfirmado = this.servicioComunicacion.agregarOrden(nuevoPedido);
    console.log(pedidoConfirmado);
    
    this.pedidoFormGroup.get('nombreCliente')?.disable();
    this.pedidoFormGroup.get('direccionCliente')?.disable();
    this.pedidoFormGroup.get('telefonoCliente')?.disable();
    this.pedidoFormGroup.get('fechaCompra')?.disable();
    
    this.pedidoFormGroup.reset({
      direccionCliente: this.pedidoFormGroup.value.direccionCliente,
      nombreCliente: this.pedidoFormGroup.value.nombreCliente,
      telefonoCliente: this.pedidoFormGroup.value.telefonoCliente,
      tamanoPizza: '',
      ingredienteJamon: false,
      ingredientePina: false,
      ingredienteChampinon: false,
      cantidadPizza: ''
    });
  }
}
