import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-blog',
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './edit-blog.html',
  styleUrl: './edit-blog.css'
})
export class EditBlog implements OnInit {
  editForm!: FormGroup;
  blogId!: string;
  loading = false;
  showSuccessPopup = false;
  options: string[] = ['Activism', 'Memoirs', 'Culture', 'Technology', 'Science', 'Travel']
  category:string=''

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
        const matchedCategory = this.options.find(opt => opt.toLowerCase() === blog.category.toLowerCase());
        this.editForm.patchValue({
          title: blog.title,
          author: blog.author,
          category: matchedCategory,
          content: blog.content,
        });
        this.category=blog.category
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
        this.loading = false;
        this.showSuccessPopup = true;
        setTimeout(() => {
          this.showSuccessPopup = false;
          this.router.navigate(['/admin/dashboard']);
        }, 2000);
      },
      error: (err) => {
        alert('Update failed.');
        console.error(err);
        this.loading = false;
      }
    });
  }
}