import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-explore-page',
  imports: [CommonModule, HttpClientModule, RouterLink],
  templateUrl: './explore-page.html',
  styleUrl: './explore-page.css'
})
export class ExplorePage {
  categories = [
    { name: 'activism', image: 'assets/activism.jpg' },
    { name: 'memoirs', image: 'assets/memoir.jpg' },
    { name: 'culture', image: 'assets/culture.jpg' },
    { name: 'technology', image: 'assets/technology.jpg' },
    { name: 'science', image: 'assets/science.jpg' },
    { name: 'travel', image: 'assets/travel.jpg' }
  ];

  blogs: any[] = [];
  selectedCategory: string | null = null;

  skip = 0;
  limit = 4;
  hasMore = true;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchBlogs();
  }

  fetchBlogs() {
    const params: any = {
      skip: this.skip.toString(),
      limit: this.limit.toString()
    };

  
    if (this.selectedCategory) {
      params.category = this.selectedCategory;
    }

    this.http.get<any[]>('http://localhost:8000/api/blogs', { params }).subscribe(data => {
      this.blogs = data;
      this.hasMore = data.length === this.limit;
    });
  }

  selectCategory(name: string) {
    this.selectedCategory = name;
    this.skip = 0;
    this.fetchBlogs();
  }

  nextPage() {
    this.skip += this.limit;
    this.fetchBlogs();
  }

  prevPage() {
    if (this.skip >= this.limit) {
      this.skip -= this.limit;
      this.fetchBlogs();
    }
  }
}
