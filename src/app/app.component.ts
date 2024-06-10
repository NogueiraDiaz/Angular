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
  editedCoche: any = { marca: '', modelo: '', año: '' };
  mostrarFormulario: boolean = false;
  mostrarFormulario2: boolean = false;
  mostrarFormulario3: boolean = false;
  mostrarFormulario4: boolean = false;
  nombre: string = '';
  fecha: string = '';
  fechaFinal: string = '';
  estadoAlquilerOptions: string[] = ['Sí', 'No'];
  marcaOptions: string[] = [];
  colorOptions: string[] = [];

  nuevoCoche: any = {
    marca: '',
    modelo: '',
    año: null,
    color: '',
    matricula: '',
    precio_diario: null,
    alquiler: null,
    imagen: '',
    nota: '',
    kilometraje: null
  };

  filters: any = {
    precioMin: 0,
    precioMax: 1000,
    color: '',
    marca: '',
    año: '',
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
        (this.filters.año === '' || coche.año === this.filters.año) &&
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
      if (this.mostrarFormulario2 || this.mostrarFormulario3 || this.mostrarFormulario4) {
        this.mostrarFormulario2 = false;
        this.mostrarFormulario3 = false;
        this.mostrarFormulario4 = false;
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
      if (this.mostrarFormulario || this.mostrarFormulario3 || this.mostrarFormulario4) {
        this.mostrarFormulario = false;
        this.mostrarFormulario3 = false;
        this.mostrarFormulario4 = false;
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
      if (this.mostrarFormulario || this.mostrarFormulario2 || this.mostrarFormulario4) {
        this.mostrarFormulario = false;
        this.mostrarFormulario2 = false;
        this.mostrarFormulario4 = false;
      }
      this.editedCoche = { ...coche };
      this.mostrarFormulario3 = true;
    }
  }

  openEditForm4(coche: any) {
    if (this.mostrarFormulario4) {
      this.editedCoche = { ...coche };
      this.mostrarFormulario4 = false;
    } else {
      if (this.mostrarFormulario || this.mostrarFormulario2 || this.mostrarFormulario3) {
        this.mostrarFormulario = false;
        this.mostrarFormulario2 = false;
        this.mostrarFormulario3 = false;
      }
      this.editedCoche = { ...coche };
      this.mostrarFormulario4 = true;
    }
  }

  obtenerFechaHoy(): string {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  }

  alquilarCoche() {


    const nombreCliente = (<HTMLInputElement>document.getElementById('nombre')).value;
    const fechaInicio = (<HTMLInputElement>document.getElementById('fecha')).value;

    if (!nombreCliente || !fechaInicio) {
      alert('Por favor, complete todos los campos requeridos.');
      return;
    }

    const cocheId = this.editedCoche.id;
    this.editedCoche.alquiler = {
      clienteNombre: nombreCliente,
      fechaInicio: fechaInicio
    }

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
          this.fetchCoches();
          this.mostrarFormulario2 = false;
        } else {
          console.error('Error al confirmar el alquiler.');
        }
      })
      .catch(error => {
        console.error('Error al confirmar el alquiler:', error);
      });
  }


  confirmarDevolucion() {

    const fechaFinalString = (<HTMLInputElement>document.getElementById('fechaFinal')).value;

    if (!fechaFinalString) {
      alert('Por favor, complete todos los campos requeridos.');
      return;
    }

    this.editedCoche.alquiler = null;
    const fechaFinal = new Date(fechaFinalString);
    const cocheId = this.editedCoche.id;

    fetch(`http://localhost:3000/coches/${cocheId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.editedCoche)
    })
      .then(response => {
        if (response.ok) {
          console.log('¡Devolución confirmada correctamente!');
          this.calcularPrecio(cocheId, fechaFinal);
          this.fetchCoches();
          this.mostrarFormulario3 = false; // Ocultar el formulario
        } else {
          console.error('Error al confirmar la devolución.');
        }
      })
      .catch(error => {
        console.error('Error al confirmar la devolución:', error);
      });
  }

  calcularPrecio(cocheId: number, fechaFinal: Date) {
    const coche = this.coches.find(coche => coche.id === cocheId);
    if (coche && coche.alquiler && coche.alquiler.fechaInicio) {
      const fechaInicio = new Date(coche.alquiler.fechaInicio);
      const diasAlquilados = Math.ceil((fechaFinal.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)); // Calcular la diferencia en días
      const montoTotal = diasAlquilados * coche.precio_diario;
      alert(`El cliente ${coche.alquiler.clienteNombre} tiene un monto a pagar de: ${montoTotal}€`);
    } else {
      console.error('No se pudo calcular el monto de devolución porque los datos del alquiler no están completos.');
    }
  }

  insertarCoche() {
    if (!this.nuevoCoche.marca || !this.nuevoCoche.modelo || !this.nuevoCoche.año || !this.nuevoCoche.color || !this.nuevoCoche.matricula || !this.nuevoCoche.precio_diario || !this.nuevoCoche.imagen || !this.nuevoCoche.precio_diario || !this.nuevoCoche.kilometraje) {
      alert('Por favor, introduzca todos los campos requeridos.');
      return;
    }


    this.nuevoCoche.marca = (<HTMLInputElement>document.getElementById('marca')).value;
    this.nuevoCoche.modelo = (<HTMLInputElement>document.getElementById('modelo')).value;
    this.nuevoCoche.año = (<HTMLInputElement>document.getElementById('año')).value;
    this.nuevoCoche.color = (<HTMLInputElement>document.getElementById('color')).value;
    this.nuevoCoche.matricula = (<HTMLInputElement>document.getElementById('matricula')).value;
    this.nuevoCoche.precio_diario = (<HTMLInputElement>document.getElementById('precio_diario')).value;
    this.nuevoCoche.imagen = (<HTMLInputElement>document.getElementById('imagen')).value;
    this.nuevoCoche.nota = (<HTMLInputElement>document.getElementById('nota')).value;
    this.nuevoCoche.kilometraje = (<HTMLInputElement>document.getElementById('kilometraje')).value;

    fetch(`http://localhost:3000/coches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.nuevoCoche)
    })
      .then(response => {
        if (response.ok) {
          console.log('Coche introducido correctamente!');
          this.mostrarFormulario4 = false;
          this.fetchCoches();
          this.nuevoCoche = {
            marca: '',
            modelo: '',
            año: null,
            color: '',
            matricula: '',
            precio_diario: null,
            alquiler: null,
            imagen: '',
            nota: '',
            kilometraje: null
          };
        } else {
          console.error('Error al introducir el vehículo.');
        }
      })
      .catch(error => {
        console.error('Error al introducir el vehículo: ', error);
      });
  }

  editarCoche() {
    this.editedCoche.marca = (<HTMLInputElement>document.getElementById('marca')).value;
    this.editedCoche.modelo = (<HTMLInputElement>document.getElementById('modelo')).value;
    this.editedCoche.año = (<HTMLInputElement>document.getElementById('año')).value;
    this.editedCoche.color = (<HTMLInputElement>document.getElementById('color')).value;
    this.editedCoche.matricula = (<HTMLInputElement>document.getElementById('matricula')).value;
    this.editedCoche.precio_diario = (<HTMLInputElement>document.getElementById('precio_diario')).value;
    this.editedCoche.imagen = (<HTMLInputElement>document.getElementById('imagen')).value;
    this.editedCoche.nota = (<HTMLInputElement>document.getElementById('nota')).value;
    this.editedCoche.kilometraje = (<HTMLInputElement>document.getElementById('kilometraje')).value;

    

    if (!this.editedCoche.marca || !this.editedCoche.modelo || !this.editedCoche.año || !this.editedCoche.color || !this.editedCoche.matricula || !this.editedCoche.precio_diario || !this.editedCoche.imagen || !this.editedCoche.precio_diario || !this.editedCoche.kilometraje) {
      alert('Por favor, introduzca todos los campos requeridos.');
      return;
    }

    const cocheId = this.editedCoche.id;

    fetch(`http://localhost:3000/coches/${cocheId}`, {
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
            this.fetchCoches();
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
