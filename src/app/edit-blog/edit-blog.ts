import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-edit-blog',
  imports: [ReactiveFormsModule,HttpClientModule],
  templateUrl: './edit-blog.html',
  styleUrl: './edit-blog.css'
})
export class EditBlog  implements OnInit{
  editForm!: FormGroup;
  blogId!: string;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.blogId = this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.loadBlog();
  }

  initForm() {
    this.editForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      author: ['', [Validators.required]],
      category: ['', [Validators.required]],
      content: ['', [Validators.required, Validators.minLength(100)]],
    });
  }

  loadBlog() {
    this.http.get<any>(`http://localhost:8000/api/blogs/${this.blogId}`).subscribe({
      next: (blog) => {
        this.editForm.patchValue({
          title: blog.title,
          author: blog.author,
          category: blog.category,
          content: blog.content,
        });
      },
      error: (err) => {
        alert('Failed to load blog.');
        console.error(err);
      }
    });
  }

  onSubmit() {
    if (this.editForm.invalid) return;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    this.loading = true;

    this.http.put(`http://localhost:8000/api/auth/dashboard/${this.blogId}`, this.editForm.value, { headers }).subscribe({
      next: () => {
        alert('Blog updated successfully!');
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        alert('Update failed.');
        console.error(err);
        this.loading = false;
      }
    });
  }

}
