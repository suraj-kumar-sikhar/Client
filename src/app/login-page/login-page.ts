import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  standalone:true,
  imports: [CommonModule, HttpClientModule, RouterModule,FormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage {
  @ViewChild('email') emailRef!: ElementRef;
  @ViewChild('password') passwordRef!: ElementRef;

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    console.log("Sumbit");
    const email = this.emailRef.nativeElement.value;
    const password = this.passwordRef.nativeElement.value;

    const formData = new URLSearchParams();
    formData.set('username', email);
    formData.set('password', password);

    this.http.post<any>('http://localhost:8000/api/auth/login', formData.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.access_token);
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        alert('Login failed: ' + err.error?.detail || 'Unknown error');
      }
    });
  }

}
