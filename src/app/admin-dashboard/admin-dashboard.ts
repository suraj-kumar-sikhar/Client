import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard implements OnInit {
  blogs: any[] = [];
  showApproved = false;

  categories = ['Activism', 'Memoirs', 'Culture', 'Technology', 'Science', 'Travel'];
  selectedCategory: string = '';
  startDate: string = '';
  endDate: string = '';

  page = 1;
  limit = 5;
  totalBlogs = 0;

  showModal: boolean = false;
  modalAction: 'approve' | 'delete' | 'edit' | null = null;
  selectedBlogId: string = '';

  showSuccessPopup: boolean = false;
  successMessage: string = '';

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchBlogs();
  }

  fetchBlogs() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    let params = new HttpParams()
      .set('approved', this.showApproved.toString())
      .set('page', this.page.toString())
      .set('limit', this.limit.toString());

    if (this.selectedCategory) {
      params = params.set('category', this.selectedCategory);
    }
    if (this.startDate) {
      params = params.set('start_date', this.startDate);
    }
    if (this.endDate) {
      params = params.set('end_date', this.endDate);
    }

    this.http.get<{ blogs: any[]; total: number }>('http://localhost:8000/api/auth/dashboard', {
      headers,
      params
    }).subscribe({
      next: (res) => {
        this.blogs = res.blogs || [];
        this.totalBlogs = res.total || 0;

        if (this.sortColumn) {
          this.sortBlogs();
        }
      },
      error: (err) => {
        console.error('Failed to fetch blogs:', err);
      
      }
    });
  }

  applyFilters() {
    this.page = 1;
    this.fetchBlogs();
  }


  previousPage() {
    this.changePage(-1);
  }

  nextPage() {
    this.changePage(1);
  }

  changePage(delta: number) {
    const nextPage = this.page + delta;
    const maxPage = Math.ceil(this.totalBlogs / this.limit);

    if (nextPage >= 1 && nextPage <= maxPage) {
      this.page = nextPage;
      this.fetchBlogs();
    }
  }

  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortBlogs();
  }

  sortBlogs() {
    this.blogs.sort((a, b) => {
      const aVal = this.sortColumn === 'published' ? new Date(a[this.sortColumn]) : a[this.sortColumn]?.toLowerCase?.() || '';
      const bVal = this.sortColumn === 'published' ? new Date(b[this.sortColumn]) : b[this.sortColumn]?.toLowerCase?.() || '';

      const result = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      return this.sortDirection === 'asc' ? result : -result;
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
    const baseUrl = 'http://localhost:8000/api/auth/dashboard';

    if (this.modalAction === 'approve') {
      this.http.put(`${baseUrl}/${this.selectedBlogId}/approve`, {}, { headers }).subscribe({
        next: () => {
          this.fetchBlogs();
          this.closeModal();
          this.showSuccessMessage('Blog approved successfully!');
        },
        error: (err) => {
          console.error('Failed to approve blog:', err);
          this.closeModal();
        }
      });
    } else if (this.modalAction === 'delete') {
      this.http.delete(`${baseUrl}/${this.selectedBlogId}`, { headers }).subscribe({
        next: () => {
          this.fetchBlogs();
          this.closeModal();
          this.showSuccessMessage('Blog deleted successfully!');
        },
        error: (err) => {
          console.error('Failed to delete blog:', err);
          this.closeModal();
        }
      });
    } else if (this.modalAction === 'edit') {
      this.router.navigate(['/admin/edit', this.selectedBlogId]);
      this.closeModal();
    }
  }

  showSuccessMessage(message: string) {
    this.successMessage = message;
    this.showSuccessPopup = true;
    setTimeout(() => {
      this.showSuccessPopup = false;
    }, 3000);
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


  get currentPage(): number {
    return this.page;
  }

  get totalPages(): number {
    return Math.ceil(this.totalBlogs / this.limit);
  }

  get pendingBlogs(): any[] {
    return this.blogs.filter(blog => !blog.approved);
  }

  get approvedBlogs(): any[] {
    return this.blogs.filter(blog => blog.approved);
  }

  switchTab(showApproved: boolean) {
    this.showApproved = showApproved;
    this.page = 1;
    this.fetchBlogs();
  }
}