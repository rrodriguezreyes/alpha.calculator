import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';  // <<<< import it here
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-sample-page',
  standalone: true,
  imports: [NgFor, FormsModule, CommonModule, DatePipe],
  templateUrl: './sample-page.component.html',
  styleUrls: ['./sample-page.component.scss'],
})
export default class SamplePageComponent {

  products: any[] = [];
  loading: boolean = false;
  resultadoInversion: any = null;
  loginError: string = '';
  // Propiedades para los campos del formulario
  selectedProductId: number | null = null;
  enReinversion: boolean = false;
  plazo: number | null = null;

  fechaCreacionDate: string | null = null; // Separate date input
  fechaCreacionTime: string | null = null; // Separate time input

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    const token = localStorage.getItem('token');
    console.log(token);
    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      this.loading = true;

      this.http.get<any[]>('https://alpha-calculator-api.azurewebsites.net/products/', { headers }).pipe(
        catchError(error => {
          console.error('Error obteniendo productos:', error);
          this.loading = false;
          this.loginError = 'Error al cargar productos. Por favor, inténtelo de nuevo más tarde.';
          return throwError('Error al cargar productos. Por favor, inténtelo de nuevo más tarde.');
        })
      ).subscribe((response) => {
        this.products = response;
        this.loading = false;
        console.log(response);
      });
    }
  }

  formatDateTime(date: string, time: string): string {
    const formattedDateTime = `${date}T${time}:00`;
    const dateObj = new Date(formattedDateTime);
    const yyyy = dateObj.getFullYear();
    const MM = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const HH = String(dateObj.getHours()).padStart(2, '0');
    const mm = String(dateObj.getMinutes()).padStart(2, '0');
    const ss = String(dateObj.getSeconds()).padStart(2, '0');
    return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
  }

  calcularInversion(inversionForm: NgForm): void {
    this.loginError = '';

    if (inversionForm.invalid) {
      this.loginError = 'Por favor, complete todos los campos antes de calcular la inversión.';
      console.error('Por favor, complete todos los campos antes de calcular la inversión.');
      return;
    }

    const fechaCreacion = this.formatDateTime(this.fechaCreacionDate!, this.fechaCreacionTime!);

    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });

      const requestBody = {
        product_id: this.selectedProductId,
        en_reinversion: this.enReinversion,
        plazo: this.plazo,
        fecha_creacion: fechaCreacion
      };

      this.http.post<any>('https://alpha-calculator-api.azurewebsites.net/investments/investment-dates', requestBody, { headers }).pipe(
        catchError(error => {
          this.loginError = 'Error calculando la inversión. Por favor, inténtelo de nuevo más tarde.';
          console.error('Error calculando la inversión:', error);
          return throwError('Error al calcular la inversión. Por favor, inténtelo de nuevo más tarde.');
        })
      ).subscribe((response) => {
        this.resultadoInversion = response;
        console.log(this.resultadoInversion);
      });
    }
  }
}
