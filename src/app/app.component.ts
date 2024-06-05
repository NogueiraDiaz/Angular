import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, FormsModule],
  standalone: true,
})
export class AppComponent implements OnInit {
  title = 'PracticaAngular';
  coches: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 8;
  editedCoche: any = { marca: '', modelo: '', anio: '' };
  mostrarFormulario: boolean = false;
  mostrarFormulario2: boolean = false;
  mostrarFormulario3: boolean = false;
  nombre: string = '';
  fecha: string = '';
  fechaFinal: string = '';
  estadoAlquilerOptions: string[] = ['Sí', 'No']; // Opciones de estado del alquiler
  marcaOptions: string[] = [];
  colorOptions: string[] = [];

  filters: any = {
    precioMin: 0,
    precioMax: 1000,
    color: '',
    marca: '',
    anio: '',
    estadoAlquiler: '',
    clienteNombre: ''
  };

  ngOnInit() {
    this.fetchCoches();
  }

  fetchCoches() {
    fetch('http://localhost:3000/coches')
      .then((response) => response.json())
      .then((data) => {
        this.coches = data;
        this.extractUniqueValues();
      })
      .catch((error) => {
        console.error('Error al obtener datos de coches:', error);
      });
  }

  extractUniqueValues() {
    // Extraer valores únicos para marca y color
    this.marcaOptions = Array.from(new Set(this.coches.map(coche => coche.marca)));
    this.colorOptions = Array.from(new Set(this.coches.map(coche => coche.color)));
  }

  cambioPagina(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  getCoches(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.getCochesFiltrados().slice(startIndex, endIndex);
  }

  getCochesFiltrados(): any[] {
    const filteredCoches = this.coches.filter(coche => {
      return (
        coche.precio_diario >= this.filters.precioMin &&
        coche.precio_diario <= this.filters.precioMax &&
        (this.filters.color === '' || coche.color === this.filters.color) &&
        (this.filters.marca === '' || coche.marca === this.filters.marca) &&
        (this.filters.anio === '' || coche.anio === this.filters.anio) &&
        (this.filters.estadoAlquiler === '' || (this.filters.estadoAlquiler === 'Sí' && coche.alquiler) || (this.filters.estadoAlquiler === 'No' && !coche.alquiler)) &&
        (this.filters.clienteNombre === '' || (coche.clienteNombre && coche.clienteNombre.includes(this.filters.clienteNombre)))
      );
    });
    return filteredCoches;
  }

  getPaginationArray(): number[] {
    const totalPages = this.getTotalPages();
    return Array(totalPages).fill(0).map((x, i) => i + 1);
  }

  getTotalPages(): number {
    return Math.ceil(this.getCochesFiltrados().length / this.itemsPerPage);
  }

  openEditForm(coche: any) {
    if (this.mostrarFormulario) {
      this.editedCoche = { ...coche };
      this.mostrarFormulario = false;
    } else {
      if (this.mostrarFormulario2 || this.mostrarFormulario3) {
        this.mostrarFormulario2 = false;
        this.mostrarFormulario3 = false;
      }
      this.editedCoche = { ...coche };
      this.mostrarFormulario = true;
      console.log(this.editedCoche.matricula)
    }

  }

  openEditForm2(coche: any) {
    if (this.mostrarFormulario2) {
      this.editedCoche = { ...coche };
      this.mostrarFormulario2 = false;
    } else {
      if (this.mostrarFormulario || this.mostrarFormulario3) {
        this.mostrarFormulario = false;
        this.mostrarFormulario3 = false;
      }
      this.editedCoche = { ...coche };
      this.mostrarFormulario2 = true;
    }
  }

  openEditForm3(coche: any) {
    if (this.mostrarFormulario3) {
      this.editedCoche = { ...coche };
      this.mostrarFormulario3 = false;
    } else {
      if (this.mostrarFormulario || this.mostrarFormulario2) {
        this.mostrarFormulario = false;
        this.mostrarFormulario2 = false;
      }
      this.editedCoche = { ...coche };
      this.mostrarFormulario3 = true;
    }
  }

  obtenerFechaHoy(): string {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Enero es 0
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  }

  confirmarReserva() {
    const cocheId = this.editedCoche.id; // Obtener el ID del coche
    const nombreCliente = (<HTMLInputElement>document.getElementById('nombre')).value;
    const fechaInicio = (<HTMLInputElement>document.getElementById('fecha')).value;
    this.editedCoche.alquiler = {
      clienteNombre: nombreCliente,
      fechaInicio: fechaInicio
    }
  
    // Lógica para confirmar el alquiler del vehículo
    // Aquí debes enviar los datos a tu backend para actualizar el coche
  
    // Por ejemplo:
    fetch(`http://localhost:3000/coches/${cocheId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.editedCoche)
    })
    .then(response => {
      if (response.ok) {
        console.log('Alquiler confirmado correctamente!');
        this.fetchCoches(); // Volver a cargar la lista de coches después de confirmar el alquiler
        this.mostrarFormulario2 = false; // Ocultar el formulario
      } else {
        console.error('Error al confirmar el alquiler.');
      }
    })
    .catch(error => {
      console.error('Error al confirmar el alquiler:', error);
    });
  }
  

  confirmarDevolucion() {
    const cocheId = this.editedCoche.id; // Obtener el ID del coche
    this.editedCoche.alquiler = null;
    const fechaFinalString = (<HTMLInputElement>document.getElementById('fechaFinal')).value;
    const fechaFinal = new Date(fechaFinalString);

    // Lógica para confirmar la devolución del vehículo
    // Aquí debes enviar los datos a tu backend para actualizar la reserva

    // Por ejemplo:
    fetch(`http://localhost:3000/coches/${cocheId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.editedCoche) // Establecer alquiler a null y enviar la fecha final
    })
      .then(response => {
        if (response.ok) {
          console.log('¡Devolución confirmada correctamente!');
          this.calcularMontoDevolucion(cocheId, fechaFinal); // Calcular el monto adeudado
          this.fetchCoches(); // Volver a cargar la lista de coches después de confirmar la devolución
          this.mostrarFormulario3 = false; // Ocultar el formulario
        } else {
          console.error('Error al confirmar la devolución.');
        }
      })
      .catch(error => {
        console.error('Error al confirmar la devolución:', error);
      });
  }

  calcularMontoDevolucion(cocheId: number, fechaFinal: Date) {
    const coche = this.coches.find(coche => coche.id === cocheId);
    if (coche && coche.alquiler && coche.alquiler.fechaInicio) {
      const fechaInicio = new Date(coche.alquiler.fechaInicio);
      const diasAlquilados = Math.ceil((fechaFinal.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)); // Calcular la diferencia en días
      const montoTotal = diasAlquilados * coche.precio_diario; // Calcular el monto total adeudado
      alert(`El cliente ${coche.alquiler.clienteNombre} tiene un monto a pagar de: ${montoTotal}€`);
      // Aquí podrías mostrar el monto total en la interfaz de usuario o realizar cualquier otra acción necesaria
    } else {
      console.error('No se pudo calcular el monto de devolución porque los datos del alquiler no están completos.');
    }
  }



  guardarCambios() {
    this.editedCoche.marca = (<HTMLInputElement>document.getElementById('marca')).value;
    this.editedCoche.modelo = (<HTMLInputElement>document.getElementById('modelo')).value;
    this.editedCoche.anio = (<HTMLInputElement>document.getElementById('anio')).value;

    fetch(`http://localhost:3000/coches/${this.editedCoche.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.editedCoche)
    })
      .then(response => {
        if (response.ok) {
          console.log('¡Datos actualizados correctamente!');
          this.mostrarFormulario = false;
          this.fetchCoches();
        } else {
          console.error('Error al actualizar los datos del coche.');
        }
      })
      .catch(error => {
        console.error('Error al actualizar los datos del coche:', error);
      });
  }



  eliminarCoche(id: number) {
    if (confirm("¿Estás seguro de que quieres eliminar este coche?")) {
      fetch(`http://localhost:3000/coches/${id}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (response.ok) {
            console.log('¡Coche eliminado correctamente!');
            this.fetchCoches(); // Volver a cargar la lista de coches después de eliminar
          } else {
            console.error('Error al eliminar el coche.');
          }
        })
        .catch(error => {
          console.error('Error al eliminar el coche:', error);
        });
    }
  }

}
