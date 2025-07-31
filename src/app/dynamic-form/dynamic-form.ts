import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './dynamic-form.html',
  styleUrls: ['./dynamic-form.css']
})
export class DynamicFormComponent implements OnInit {
  @Input() formConfig: any[] = [];
  form!: FormGroup;
  loading = false;
  showSuccessPopup = false;
successMessage = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    const group: any = {};
    for (const field of this.formConfig) {
      const validators = [];

      if (field.required) {
        validators.push(Validators.required);
      }

      if (field.type === 'email') {
        validators.push(Validators.email);
      }

      if (field.minLength) {
        validators.push(Validators.minLength(field.minLength));
      }

      if (field.maxLength) {
        validators.push(Validators.maxLength(field.maxLength));
      }

      group[field.name] = ['', validators];
    }

    this.form = this.fb.group(group);
  }

  onImageChange(event: Event, fieldName: string) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      this.uploadImage(file, fieldName);
    }
  }

  uploadImage(file: File, fieldName: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'blog-image');
    formData.append('cloud_name', 'dqiq5aus2');

    fetch('https://api.cloudinary.com/v1_1/dqiq5aus2/image/upload', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.secure_url) {
          this.form.get(fieldName)?.setValue(data.secure_url);
        }
      })
      .catch(err => console.error('Upload Error:', err));
  }

onSubmit() {
  if (this.form.invalid) return;

  this.loading = true;

  this.http.post('http://localhost:8000/api/blogs/create', this.form.value).subscribe({
    next: () => {
      this.successMessage = 'Blog submitted successfully!';
      this.showSuccessPopup = true;
      setTimeout(() => this.showSuccessPopup = false, 3000);
      this.form.reset();
      this.loading = false;
    },
    error: (err) => {
      alert('Error submitting blog: ' + JSON.stringify(err.error || err));
      this.loading = false;
    }
  });
}
}
