import { Component, OnInit } from '@angular/core';
import { Persona } from '../interface/persona.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonasService } from '../service/persona.service';
import { FormControl, FormGroup } from '@angular/forms';
import { switchMap } from 'rxjs';
import Swal from 'sweetalert2';
import { ValidarService } from '../service/validar.service';
import { MostrarErroresComponent } from '../dialog/errores/mostrar-errores/mostrar-errores.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [
    `
      .example-radio-group {
        display: flex;
        flex-direction: column;
        margin: 15px 0;
        align-items: flex-start;
      }

      .example-radio-button {
        margin: 5px;
      }
    `
  ]
})

export class AgregarComponent implements OnInit {

  // Es necesario inicializar todas las propiedades del objeto para que no haya problemas al acceder a la página de agregar persona

  persona: Persona = {
    id: "",
    usuario: '',
    nombre: '',
    apellido: '',
    password: '',
    rPasswd: '',
    correo_empresa: '',
    correo_personal: '',
    ciudad: '',
    activo: false,
    f_creacion: new Date,
    f_finalizacion: new Date,
    urlImagen: ""
  }

  activoSeleccionado: boolean = false;
  activar: boolean[] = [
    true,
    false
  ]

  // Para el rango de fechas
  range = new FormGroup({
    inicio: new FormControl(),
    final: new FormControl()
  });

  errores!: string[];

  constructor(private rutaActiva: ActivatedRoute, 
              private personaService: PersonasService, 
              private route: Router,
              private validaService: ValidarService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    // Leer el parámetro de la ruta (id) para obtener los datos del usuario (edición)
    if (this.rutaActiva.routeConfig?.path === "agregar") {
      return;

    } else {
      this.rutaActiva.params
      .pipe(
        switchMap( ({id}) => this.personaService.obtenerPersona(id))                          // ({id}): Es el id de los parámetros de "this.rutaActiva.params"
      )
      .subscribe( (persona) => {
          this.persona = persona;
          this.activoSeleccionado = persona.activo;                                           // Al editar, aparece el valor almacenado en la base de datos en el RadioButton
      })
    }
  }

  gestionarUsuario() {

    // Validación

    this.validaService.validaUsuario(this.persona.usuario);
    this.validaService.validaNombre(this.persona.nombre);
    this.validaService.validaPassword(this.persona);
    this.validaService.validaCorreoEmpresa(this.persona.correo_empresa);
    this.validaService.validaCorreoPersonal(this.persona.correo_personal);

    this.errores = this.validaService.listaErrores;

    console.log(this.errores);

    if (this.errores.length > 0) {
      this.dialog.open(MostrarErroresComponent, {
        data: this.errores,
        width: "60%"
      }).afterClosed()
      .subscribe( () => {
        this.errores.length = 0;
      })

      console.log(this.errores);

      return;

    } else {
      if (this.persona.id == "") {
        // Añadir usuario
        this.personaService.añadirPersona(this.persona)
        .subscribe( (persona) => {
          this.popUp(persona);
        })
  
      } else {
        // Modificación
        this.personaService.modificarPersona(this.persona)
        .subscribe( (persona) => {
          this.persona = persona;
          this.popUp(persona);
        })
      }
    }

  }

  eliminar() {
    // Antes de eliminar, lanzar un mensaje de confirmación
    
    Swal.fire({
      title: '¿Estás seguro de que quieres eliminar a este usuario?',
      text: "Los cambios serán irreversibles",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: 'red',
      cancelButtonColor: '#BEAAFF',
      confirmButtonText: 'Sí'
    })
    .then((resultado) => {
      if (resultado.isConfirmed) {
        this.personaService.eliminarPersona(this.persona.id)
        .subscribe( () => {
          Swal.fire(
            'Usuario Eliminado',
            '',
            'success'
          )
          this.route.navigate(['/personas']);
        })
      }
    })
  }

  popUp(persona: Persona) {
    if (this.rutaActiva.routeConfig?.path === "agregar") {
      Swal.fire({
        title: 'Añadido',
        text: 'Usuario añadido con éxito',
        icon: 'success',
        imageUrl: `${persona.urlImagen}`,
        imageWidth: 100,
        imageHeight: 100,
        imageAlt: `${persona.usuario}`,
      })
      .then((resultado) => {
        if (resultado.isConfirmed == true) 
          this.route.navigate(['/personas']);
      })

    } else {
      Swal.fire({
        title: 'Editado',
        text: 'Usuario editado con éxito',
        imageUrl: `${persona.urlImagen}`,
        imageWidth: 100,
        imageHeight: 100,
        imageAlt: `${persona.usuario}`,
      })
      .then((resultado) => {
        if (resultado.isConfirmed == true) 
          this.route.navigate(['/personas']);
      })
    }
  }


}
