import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/Services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  constructor(public apiService:ApiService){}

  infoLogin = {
    correoLogin: "",
    passwordLogin: "",
    nombreLogin: "",
  };
  resLogin = {};
  loginStorage = {};

  private fb = inject(FormBuilder);
  loginForm = this.fb.group({
    Correo: [null, [Validators.required, Validators.pattern('^[^@]+@[^@]+\.[a-zA-Z]{2,}$')]],
    Contrasena: [null, [Validators.required]],
  });

  ngOnInit(): void {
    this.apiService.Get("Logins").then((res)=>{
      this.resLogin = res;
      return res;
    });
  }

  onSubmit(){
    if (this.loginForm.valid) {
      var encontrado;
      this.infoLogin.correoLogin = String(this.loginForm.controls['Correo'].value).toLowerCase();
      this.infoLogin.passwordLogin = String(this.loginForm.controls['Contrasena'].value).toLowerCase();
      for (var i = 0; i < Object.keys(this.resLogin).length; i++) {
        var login = this.resLogin[i];
        if (login['correo'] ==  this.infoLogin.correoLogin && login['password'] ==  this.infoLogin.passwordLogin) {
          localStorage.setItem('login', JSON.stringify(login))
          this.infoLogin.nombreLogin = `${login['nombreUsuario']} ${login['apellidoUsuario']}`
          encontrado = true;
          break;
        } else {
          encontrado = false;
        }
      }
      if (encontrado == true) {

        Swal.fire({
          title: 'Usuario Encontrado',
          text: `Bienvenido usuario ${this.infoLogin.nombreLogin}`,
          icon: 'success',
          color: '#716add',
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = '/Comidas';
          }
        })
      }
      if (encontrado == false) {
        Swal.fire(
          'usuario no encontrado',
          'Por favor Verifique que el correo y contraseña sean correctos',
          'error'
        )
      }
    } else {
      Swal.fire(
        'Ingresar los datos',
        'Por favor ingrese todos los campos requeridos',
        'error'
      )
    }
  }
}
