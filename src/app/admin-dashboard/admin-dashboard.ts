import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterModule,HttpClientModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
  standalone: true
})
export class AdminDashboard implements OnInit {
  showApproved = false;
  blogs: any[] = [];
  pendingBlogs: any[] = [];
  approvedBlogs: any[] = [];

  showModal: boolean = false;
  modalAction: 'approve' | 'delete' | 'edit' | null = null;
  selectedBlogId: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  get filteredBlogs() {
    return this.blogs.filter(b => b.approved === this.showApproved);
  }

  ngOnInit() {
    this.fetchBlogs();
  }

  fetchBlogs() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>('http://localhost:8000/api/auth/dashboard', { headers })
      .subscribe(data => {
        this.blogs = data;
        this.pendingBlogs = data.filter(b => !b.approved);
        this.approvedBlogs = data.filter(b => b.approved);
      });
  }

  confirmAction(action: 'approve' | 'delete' | 'edit', id: string) {
    this.modalAction = action;
    this.selectedBlogId = id;
    this.showModal = true;
  }

  performAction() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    if (this.modalAction === 'approve') {
      this.http.put(`http://localhost:8000/api/auth/dashboard/${this.selectedBlogId}/approve`, {}, { headers })
        .subscribe(() => this.fetchBlogs());
    } else if (this.modalAction === 'delete') {
      this.http.delete(`http://localhost:8000/api/auth/dashboard/${this.selectedBlogId}`, { headers })
        .subscribe(() => this.fetchBlogs());
    } else if (this.modalAction === 'edit') {
      this.router.navigate(['/admin/edit', this.selectedBlogId]);
      return; // Skip closing modal; redirecting
    }

    this.closeModal();
  }

  closeModal() {
    this.showModal = false;
    this.modalAction = null;
    this.selectedBlogId = '';
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/admin/login']);
  }
}
