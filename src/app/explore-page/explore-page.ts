// explore-page.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil, catchError, of, finalize } from 'rxjs';

interface Category {
  name: string;
  image: string;
  displayName?: string;
}

interface Blog {
  id: string;
  title: string;
  author: string;
  category: string;
  imageuri: string;
  excerpt?: string;
  publishedDate?: string;
}

interface BlogResponse {
  blogs: Blog[];
  total: number;
  hasMore: boolean;
}

@Component({
  selector: 'app-explore-page',
  imports: [CommonModule, HttpClientModule, RouterLink],
  templateUrl: './explore-page.html',
  styleUrl: './explore-page.css'
})
export class ExplorePage implements OnInit {
  private readonly destroy$ = new Subject<void>();
  private readonly API_BASE_URL = 'http://localhost:8000/api';

  categories: Category[] = [
    { name: 'activism', image: 'assets/activism.jpg', displayName: 'Activism' },
    { name: 'memoirs', image: 'assets/memoir.jpg', displayName: 'Memoirs' },
    { name: 'culture', image: 'assets/culture.jpg', displayName: 'Culture' },
    { name: 'technology', image: 'assets/technology.jpg', displayName: 'Technology' },
    { name: 'science', image: 'assets/science.jpg', displayName: 'Science' },
    { name: 'travel', image: 'assets/travel.jpg', displayName: 'Travel' }
  ];

  blogs: Blog[] = [];
  selectedCategory: string | null = null;
  loading = false;
  error: string | null = null;

  // Pagination
  skip = 0;
  limit = 4;
  hasMore = true;
  totalBlogs = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchBlogs();
  }

  fetchBlogs(): void {
    this.loading = true

    const params: any = {
      skip: this.skip.toString(),
      limit: this.limit.toString()
    };

    if (this.selectedCategory) {
      params.category = this.selectedCategory;
    }

    this.http.get<BlogResponse>(`${this.API_BASE_URL}/blogs`, { params })
      .subscribe({
        next:(response) => {
        if (Array.isArray(response)) {
          this.blogs = response;
          this.hasMore = response.length === this.limit;
        } else {
          this.blogs = response.blogs || [];
          this.totalBlogs = response.total || 0;
          this.hasMore = response.hasMore ?? (response.blogs?.length === this.limit);
        }
        this.loading=false
      }

  });
  }

  selectCategory(categoryName: string): void {
    if (this.selectedCategory === categoryName) {
      this.selectedCategory = null;
    } else {
      this.selectedCategory = categoryName;
    }
    
    this.resetPagination();
    this.fetchBlogs();
  }

  clearCategory(): void {
    this.selectedCategory = null;
    this.resetPagination();
    this.fetchBlogs();
  }

  nextPage(): void {
    if (this.hasMore && !this.loading) {
      this.skip += this.limit;
      this.fetchBlogs();
    }
  }

  prevPage(): void {
    if (this.skip >= this.limit && !this.loading) {
      this.skip -= this.limit;
      this.fetchBlogs();
    }
  }

  private resetPagination(): void {
    this.skip = 0;
    this.hasMore = true;
  }


  get currentPage(): number {
    return Math.floor(this.skip / this.limit) + 1;
  }

  get selectedCategoryDisplay(): string {
    if (!this.selectedCategory) return 'All Categories';
    const category = this.categories.find(cat => cat.name === this.selectedCategory);
    return category?.displayName || this.capitalizeFirst(this.selectedCategory);
  }

  get canGoPrevious(): boolean {
    return this.skip > 0 && !this.loading;
  }

  get canGoNext(): boolean {
    return this.hasMore && !this.loading;
  }

  trackByBlogId(index: number, blog: Blog): string {
    return blog.id;
  }

  trackByCategoryName(index: number, category: Category): string {
    return category.name;
  }


  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}