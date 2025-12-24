import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { PostService } from '../../services/post'; // Ajuste o caminho se necessário
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EditorModule } from 'primeng/editor';
import { SelectModule } from 'primeng/select'; // Assuming PrimeNG 18+ structure or alias

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, EditorModule, SelectModule], // <--- Importante!
  templateUrl: './post-create.html',
  styleUrl: './post-create.css'
})
export class PostCreate {
  private fb = inject(FormBuilder);
  private postService = inject(PostService);
  private router = inject(Router);

  users: any[] = [];

  ngOnInit() {
    this.postService.getUsers().subscribe(data => {
      this.users = data;
    });
  }

  postForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    subtitle: ['', Validators.required],
    content: ['', Validators.required],
    author: ['', Validators.required],
    // O campo image não precisa de validação inicial aqui, tratamos no onFileSelected
    image: [null]
  });

  selectedFile: File | null = null;

  // Método para capturar o arquivo quando o usuário seleciona
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Atualizamos o formulário apenas para dizer que tem valor (opcional)
      this.postForm.patchValue({ image: file });
    }
  }

  onSubmit() {
    if (this.postForm.invalid) return;

    const formData = new FormData();
    // Pegamos os valores do form
    const title = this.postForm.get('title')?.value;

    formData.append('title', title);
    formData.append('subtitle', this.postForm.get('subtitle')?.value);
    formData.append('content', this.postForm.get('content')?.value);

    // Agora pegamos o valor selecionado no dropdown
    formData.append('author', this.postForm.get('author')?.value);

    // GERANDO O SLUG NO FRONT (Simples)
    // Transforma "Minha Notícia" em "minha-noticia"
    const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    formData.append('slug', slug);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.postService.createPost(formData).subscribe({
      next: (res) => {
        alert('Notícia publicada com sucesso!'); // Feedback visual
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Erro no envio:', err);
        // Isso vai nos ajudar a descobrir o que o Django recusou
        alert('Erro: ' + JSON.stringify(err.error));
      }
    });
  }
}
