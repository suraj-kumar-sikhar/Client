import { Component } from '@angular/core';
import formData from './form.json';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form';

@Component({
  selector: 'app-write-blog',
  imports: [DynamicFormComponent],
  templateUrl: './write-blog.html',
  styleUrl: './write-blog.css'
})
export class WriteBlog {
  blogFormConfig = formData;

}
