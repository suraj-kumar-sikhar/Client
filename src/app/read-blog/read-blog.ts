import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog-detail',
  imports:[HttpClientModule,CommonModule],
  templateUrl: './read-blog.html',
  styleUrls: ['./read-blog.css']
})
export class ReadBlog implements OnInit {
  blog: any = null;
  loading = true;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const blogId = this.route.snapshot.paramMap.get('id');
    this.http.get(`http://localhost:8000/api/blogs/${blogId}`).subscribe(
      (data: any) => {
        this.blog = data;
        this.loading = false;
      },
      error => {
        console.error('Error fetching blog:', error);
        this.loading = false;
      }
    );
  }
}
