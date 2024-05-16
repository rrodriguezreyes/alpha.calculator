import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';  // <<<< import it here
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-sample-page',
  standalone: true,
  imports: [NgFor,FormsModule,CommonModule],
  templateUrl: './sample-page.component.html',
  styleUrls: ['./sample-page.component.scss'],
  
})
export default class SamplePageComponent {

  products: any[] = [];
  loading: boolean = false;
  resultadoInversion: any = null;

  // Propiedades para los campos del formulario
  selectedProductId: number | null = null;
  enReinversion: boolean = false;
  plazo: number | null = null;
  fechaCreacion: string | null = null;
  
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    const token = localStorage.getItem('token');
    console.log(token)
    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      this.loading = true;

      this.http.get<any[]>('https://alpha-calculator-api.azurewebsites.net/products/', { headers }).pipe(
        catchError(error => {
          console.error('Error obteniendo productos:', error);
          this.loading = false;
          return throwError('Error al cargar productos. Por favor, inténtelo de nuevo más tarde.');
        })
      ).subscribe((response) => {
        this.products = response;
        this.loading = false;
        console.log(response)
      });
    }
  }

  // Función para formatear la fecha en el formato requerido
formatFecha(fecha: Date): string {
  // Formatear la fecha en el formato '%Y-%m-%d %H:%M:%S'
  return formatDate(fecha, 'yyyy-MM-dd HH:mm:ss', 'en-US');
}

calcularInversion(): void {
  this.selectedProductId = 1;
  this.fechaCreacion = '2024-05-16 15:45:00'
  this.plazo =33;
  if (!this.selectedProductId || this.plazo === null || !this.fechaCreacion) {
    console.log(this.selectedProductId)
    console.log(this.plazo)
    console.log(this.fechaCreacion)
    console.error('Por favor, complete todos los campos antes de calcular la inversión.');
    return;
  }

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
      fecha_creacion: this.fechaCreacion
    };

    this.http.post<any>('https://alpha-calculator-api.azurewebsites.net/investments/investment-dates', requestBody, { headers }).pipe(
      catchError(error => {
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
