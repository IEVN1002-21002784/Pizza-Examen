import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// Nuevos nombres de interfaces
interface Producto {
  tamano: string;
  ingredientes: string[];
  cantidad: number;
  subtotal: number;
}

interface Usuario {
  nombre: string;
  direccion: string;
  telefono: string;
  fechacompra: string;
}

interface PedidoGuardado {
  nombre: string;
  total: number;
  fecha_compra: string | number;
}

@Injectable({
  providedIn: 'root'
})
export class ComunicacionService {
  // Variables renombradas
  productosInfo: {
    id: number;
    tamano: string;
    ingredientes: string[];
    cantidad: number;
    subtotal: number;
  }[] = []

  nuevoPedidoFinal: {
    nombre: string;
    dir: string;
    total: string;
    fecha_compra: string;
  }[] = []

  private triggerFunctionSource = new Subject<void>();
  triggerFunction$ = this.triggerFunctionSource.asObservable();

  triggerFunction() {
    this.triggerFunctionSource.next();
  }

  guardarUsuario(usuario: Usuario) {
    console.log(usuario);
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  obtenerUsuario(): Usuario | null {
    const guardadoUsuario = localStorage.getItem('usuario');
    return guardadoUsuario ? JSON.parse(guardadoUsuario) : null;
  }

  obtenerPedidos(): Producto[] {
    const guardadoPedido = localStorage.getItem('pedidos');
    return guardadoPedido ? JSON.parse(guardadoPedido) : [];
  }

  agregarPedido(pedidoData: any): Producto[] {
    let subtotalC = 0;
    const { tamano, ingrediente1, ingrediente2, ingrediente3, cantidad } = pedidoData;

    const nuevoPedido: Producto = {
      tamano: tamano,
      ingredientes: [],
      cantidad: cantidad,
      subtotal: 0
    };

    if (ingrediente1) {
      nuevoPedido.ingredientes.push('Jamon');
      subtotalC += 10;
    }
    if (ingrediente2) {
      nuevoPedido.ingredientes.push('Piña');
      subtotalC += 10;
    }
    if (ingrediente3) {
      nuevoPedido.ingredientes.push('Champiñones');
      subtotalC += 10;
    }

    switch (tamano) {
      case 'Chica':
        subtotalC += 40;
        break;
      case 'Mediana':
        subtotalC += 80;
        break;
      case 'Grande':
        subtotalC += 120;
        break;
    }
    subtotalC = subtotalC * cantidad;
    nuevoPedido.subtotal = subtotalC;

    const storedPedidos = localStorage.getItem('pedidos');
    const pedidos = storedPedidos ? JSON.parse(storedPedidos) : [];
    pedidos.push(nuevoPedido);
    localStorage.setItem('pedidos', JSON.stringify(pedidos));

    this.triggerFunction();
    return pedidos;
  }

  eliminarPedido(id: any) {
    console.log('El id a eliminar es ' + id);
    const datos = localStorage.getItem('pedidos');
    if (datos) {
      let pedidoEl: Producto[] = [];
      pedidoEl = JSON.parse(datos);
      if (id >= 0 && id < pedidoEl.length) {
        pedidoEl.splice(id, 1);
        console.log(pedidoEl);
        localStorage.setItem('pedidos', JSON.stringify(pedidoEl));
        console.log('Se eliminó el registro');
        this.triggerFunction();
      } else {
        console.log('Índice no válido.');
      }
    }
  }

  verCompra() {
    this.productosInfo = []
    let pedidosG: Producto[] = []
    let id = 0
    const datos = localStorage.getItem('pedidos')
    if (datos) {
      pedidosG = JSON.parse(datos)
      pedidosG.forEach(pedido => {
        let info = {
          id: id,
          tamano: pedido.tamano,
          ingredientes: pedido.ingredientes,
          cantidad: pedido.cantidad,
          subtotal: pedido.subtotal
        }
        this.productosInfo.push(info);
        id++;
      });
      return this.productosInfo;
      console.log(this.productosInfo);
    } else {
      return []
    }
  }

  agregar() {
    let total = 0;
    const usuario = this.obtenerUsuario();

    if (usuario) {
      const { nombre, direccion, fechacompra } = usuario;
      const pedidosGuardados = this.obtenerPedidos();
      if (pedidosGuardados) {
        console.log(pedidosGuardados)
        pedidosGuardados.forEach(pedido => {
          total += pedido.subtotal;
        });
      }
      if (fechacompra === "") {
        const fecha = new Date();
        const fechacompra = fecha.toISOString().split('T')[0];
        console.log(fechacompra);
      }
      const nuevoPedido: PedidoGuardado = {
        nombre: nombre,
        total: total,
        fecha_compra: fechacompra
      };
      console.log(nuevoPedido);
      const guardadosPedidos = localStorage.getItem('PedidosGuardados');
      const pedidos = guardadosPedidos ? JSON.parse(guardadosPedidos) : [];
      pedidos.push(nuevoPedido);
      localStorage.setItem('PedidosGuardados', JSON.stringify(pedidos));
      console.log(pedidos);
    }
    localStorage.removeItem('pedidos');
    localStorage.removeItem('usuario');
    window.location.reload();
  }

  filtrar(opcion: string, fechaFiltro: string | number) {
    let ventasJ: { nombre: string; total: number; fecha_compra: string | null }[][] = [];
    const ventas = localStorage.getItem('PedidosGuardados');

    if (ventas) {
      ventasJ = JSON.parse(ventas);
    }

    const ventasPlanas = ventasJ.flat();
    let ventasFiltradas;

    if (opcion === 'dia') {
      const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

      ventasFiltradas = ventasPlanas.filter(element => {
        if (element.fecha_compra) {
          const [year, month, day] = element.fecha_compra.split('-').map(Number);
          const fecha = new Date(year, month - 1, day);
          const diaSemana = diasSemana[fecha.getDay()];
          return diaSemana.toLowerCase() === fechaFiltro.toString().toLowerCase();
        }
        return false;
      });
    } else if (opcion === 'mes') {
      const filtroTexto = String(fechaFiltro).padStart(2, '0');

      ventasFiltradas = ventasPlanas.filter(element => {
        if (element.fecha_compra) {
          const [, mes] = element.fecha_compra.split('-');
          return mes === filtroTexto;
        }
        return false;
      });
    }

    return ventasFiltradas;
  }
}
