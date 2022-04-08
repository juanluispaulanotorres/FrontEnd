
import { Injectable } from '@angular/core';
import { Persona } from '../interface/persona.interface';

@Injectable({
  providedIn: 'root'
})

export class ValidarService {

  listaErrores: string[];
  persona!: Persona;

  constructor() {
    this.listaErrores = [];
  }

  // Verificar si las contraseñas existen

  //Validar usuario
  validaUsuario(usuario: string): boolean {
    if (usuario == "") {
      this.listaErrores.push("Usuario en blanco");
      return false;
    } else {
      return true;
    }
  }

  //Validar nombre
  validaNombre(nombre: string): boolean {
    if (nombre == "") {
      this.listaErrores.push("Nombre en blanco");
      return false;
    } else {
      return true;
    }
  }

  //Validar contraseñas
  validaPassword(persona: Persona): boolean {
    if (persona.password == "" || persona.rPasswd == "") {
      this.listaErrores.push("Las contraseñas no pueden estar en blanco");
      return false;

    } else if (persona.password != persona.rPasswd) {
      this.listaErrores.push("Las contraseñas deben tener el mismo valor");
      return false;

    } else {
      return true;
    }
  }

  //Validar correo de empresa
  validaCorreoEmpresa(correoEmpresa: string): boolean {
    if (correoEmpresa == "") {
      this.listaErrores.push("Correo de empresa en blanco");
      return false;

    } else if (!correoEmpresa.match(/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/)) {
      this.listaErrores.push("Correo de empresa no válido");
      return false;

    } else {
      return true;
    }
  }

  //Validar correo personal
  validaCorreoPersonal(correoPersonal: string): boolean {
    if (correoPersonal == "") {
      this.listaErrores.push("Correo personal en blanco");
      return false;

    } else if (!correoPersonal.match(/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/)) {
      this.listaErrores.push("Correo personal no válido");
      return false;

    } else {
      return true;
    }
  }

  comprobarErrores(): boolean {
    if (this.listaErrores.length == 0)
      return true;
    else
      return false;
  }

}
