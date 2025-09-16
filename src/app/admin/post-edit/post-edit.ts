import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../services/post';
import { StorageService } from '../../services/storage';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.html',
  styleUrls: ['./post-edit.css']
})
export class PostEditComponent {
  postForm: FormGroup;
  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);
  postService = inject(PostService);
  storageService = inject(StorageService);
  editMode = false;
  postId: string;
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

    this.postId = this.route.snapshot.paramMap.get('id');
    if (this.postId) {
      this.editMode = true;
      this.postService.getPost(this.postId).subscribe(post => {
        this.postForm.setValue({
          title: post.title,
          content: post.content
        });
      });
    }
  }

  imageHandler(this: any) {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const url = await this.storageService.uploadImage(file);
        const range = this.quill.getSelection(true);
        this.quill.insertEmbed(range.index, 'image', url);
      }
    };
  }

  savePost() {
    if (this.postForm.valid) {
      if (this.editMode) {
        this.postService.updatePost({ id: this.postId, ...this.postForm.value })
          .then(() => this.router.navigate(['/admin/posts']));
      } else {
        this.postService.createPost(this.postForm.value)
          .then(() => this.router.navigate(['/admin/posts']));
      }
    }
  }
}
