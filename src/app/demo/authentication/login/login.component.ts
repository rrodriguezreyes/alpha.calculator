// Angular import
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
 

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent {
  username: string = 'a@test.com';
  password: string = 'P@$$w0rd';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.username, this.password)
      .subscribe(
        response => {
          const token = response.token;
 
          // Guarda el token en el almacenamiento local o en una cookie
          localStorage.setItem('token', token);
          // Redirecciona a la página de inicio o a donde sea necesario
          this.router.navigate(['/sample-page']);
        },
        error => {
          console.error('Error de inicio de sesión:', error);
          // Maneja errores de inicio de sesión
        }
      );
  }
  
}
