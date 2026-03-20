import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Payment } from './models/payment.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient) { }

  addPayment(payment: Payment){
    const apiUrl = `http://127.0.0.1:8000/api/payments`

    this.http.post<Payment>(apiUrl,payment);
  }
}
