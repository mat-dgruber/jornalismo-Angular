import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../services/post';
import { StorageService } from '../../services/storage';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.html',
  styleUrls: ['./post-edit.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, QuillModule]
})
export class PostEditComponent implements OnInit {
  postForm: FormGroup;
  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);
  postService = inject(PostService);
  storageService = inject(StorageService);
  editMode = false;
  postId: string | null = null;
  quill: any;
  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean'],
        ['link', 'image', 'video']
      ],
      handlers: {
        'image': this.imageHandler.bind(this)
      }
    }
  };

  constructor() {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('id');
    if (this.postId) {
      this.editMode = true;
      this.postService.getPost(this.postId).subscribe(post => {
        if (post) {
          this.postForm.setValue({
            title: post.title,
            content: post.content
          });
        }
      });
    }
  }

  onEditorCreated(editor: any) {
    this.quill = editor;
  }

  imageHandler() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      if (input.files) {
        const file = input.files[0];
        if (file) {
          const url = await this.storageService.uploadImage(file);
          const editor = this.getEditorInstance();
          if (editor) {
            const range = editor.getSelection(true);
            editor.insertEmbed(range.index, 'image', url);
          }
        }
      }
    };
  }

  getEditorInstance() {
    return this.quill;
  }

  savePost() {
    if (this.postForm.valid) {
      if (this.editMode && this.postId) {
        this.postService.updatePost({ id: this.postId, ...this.postForm.value })
          .then(() => this.router.navigate(['/admin/posts']));
      } else {
        this.postService.createPost(this.postForm.value)
          .then(() => this.router.navigate(['/admin/posts']));
      }
    }
  }
}
