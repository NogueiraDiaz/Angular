// @ts-ignore
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule],
  standalone: true,
})
export class AppComponent implements OnInit {
  title = 'PracticaAngular';
  coches: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 8;
  editedCoche: any = {
    marca: ' ',
    modelo: ' ',
    anio: ' '
  };
  mostrarFormulario: boolean = false;
  mostrarFormulario2: boolean = false;
  nombre: string = '';
  fecha: string = '';

  ngOnInit() {
    this.fetchCoches();
  }

  fetchCoches() {
    fetch('http://localhost:3000/coches')
      .then((response) => response.json())
      .then((data) => {
        this.coches = data;
      })
      .catch((error) => {
        console.error('Error al obtener datos de coches:', error);
      });
  }

  cambioPagina(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  getCoches(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.coches.slice(startIndex, endIndex);
  }

  getPaginationArray(): number[] {
    const totalPages = this.getTotalPages();
    return Array(totalPages).fill(0).map((x, i) => i + 1);
  }

  getTotalPages(): number {
    return Math.ceil(this.coches.length / this.itemsPerPage);
  }

  openEditForm(coche: any) {
    if (coche !== null) {

      if (this.mostrarFormulario == true) {
  
        this.editedCoche = { ...coche };
        this.mostrarFormulario = false;
      }else{

        if (this.mostrarFormulario2 == true) {
          
          this.mostrarFormulario2 = false
          this.editedCoche = { ...coche };
        }


      this.editedCoche = { ...coche };
      this.mostrarFormulario = true;

      }


      
    }
  }

  openEditForm2(coche: any) {
    if (coche !== null) {

      if (this.mostrarFormulario2 == true) {
  
        this.editedCoche = { ...coche };
        this.mostrarFormulario2 = false;
      }else{

        if (this.mostrarFormulario == true) {
          
          this.mostrarFormulario = false
          this.editedCoche = { ...coche };
        }

      this.editedCoche = { ...coche };
      this.mostrarFormulario2 = true;

      }


      
    }
  }

  guardarCambios() {
    this.editedCoche.marca = (<HTMLInputElement>document.getElementById('marcaInput')).value;
    this.editedCoche.modelo = (<HTMLInputElement>document.getElementById('modeloInput')).value;
    this.editedCoche.anio = (<HTMLInputElement>document.getElementById('anioInput')).value;

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

  reservar(coche: any) {
    if (!coche.alquiler) {
      this.mostrarFormulario = true;
      this.nombre = (<HTMLInputElement>document.getElementById('nombre')).value;
      this.fecha = (<HTMLInputElement>document.getElementById('fecha')).value;
    }
  }

  confirmarReserva() {
    const nuevaReserva = {
      clienteNombre: this.nombre,
      fechaInicio: this.fecha,
    };

    fetch('http://localhost:3000/coches', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevaReserva),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Reserva almacenada:', data);
        this.nombre = '';
        this.fecha = '';
        this.mostrarFormulario = false;
      })
      .catch((error) => {
        console.error('Error al almacenar la reserva:', error);
      });
  }

  updateNombre(value: string) {
    this.nombre = value;
  }

  updateFecha(value: string) {
    this.fecha = value;
  }

}
