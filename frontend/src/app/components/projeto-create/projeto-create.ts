import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ProjetosService } from '../../services/projetos.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { EditorModule } from 'primeng/editor';

@Component({
  selector: 'app-projeto-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, InputText, Button, SelectModule, TextareaModule, EditorModule],
  templateUrl: './projeto-create.html',
  styleUrl: './projeto-create.css'
})
export class ProjetoCreate implements OnInit {
  private fb = inject(FormBuilder);
  private projetosService = inject(ProjetosService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEditMode = false;
  projetoSlug: string | null = null;
  submitLabel = 'Publicar Projeto';

  projetoForm: FormGroup = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(5)]],
    subtitulo: [''],
    descricao: ['', Validators.required],
    conteudo: [''],
    data_realizacao: [new Date(), Validators.required],
    tipo: ['academico', Validators.required],
    link_externo: [''],
    image: [null]
  });

  tipoOptions = [
    { label: 'Acadêmico', value: 'academico' },
    { label: 'Pessoal', value: 'pessoal' }
  ];

  selectedFile: File | null = null;
  currentImageUrl: string | null = null;

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.isEditMode = true;
      this.projetoSlug = slug;
      this.submitLabel = 'Salvar Alterações';
      this.loadProjeto(slug);
    }
  }

  loadProjeto(slug: string) {
    this.projetosService.getProjeto(slug).subscribe(projeto => {
      this.projetoForm.patchValue({
        titulo: projeto.titulo,
        subtitulo: projeto.subtitulo,
        descricao: projeto.descricao,
        conteudo: projeto.conteudo,
        data_realizacao: new Date(projeto.data_realizacao),
        tipo: projeto.tipo,
        link_externo: projeto.link_externo
      });
      this.currentImageUrl = projeto.imagem || null;
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.projetoForm.patchValue({ image: file });
    }
  }

  onSubmit() {
    if (this.projetoForm.invalid) return;

    const formData = new FormData();
    formData.append('titulo', this.projetoForm.get('titulo')?.value);
    formData.append('subtitulo', this.projetoForm.get('subtitulo')?.value || '');
    formData.append('descricao', this.projetoForm.get('descricao')?.value);
    formData.append('conteudo', this.projetoForm.get('conteudo')?.value || '');
    
    // Format date
    const date = this.projetoForm.get('data_realizacao')?.value;
     if (date instanceof Date) {
        // Just extract YYYY-MM-DD
        const formattedDate = date.toISOString().split('T')[0];
        formData.append('data_realizacao', formattedDate); 
    } else {
        formData.append('data_realizacao', date);
    }

    formData.append('tipo', this.projetoForm.get('tipo')?.value);
    formData.append('link_externo', this.projetoForm.get('link_externo')?.value || '');

    if (this.selectedFile) {
      formData.append('imagem', this.selectedFile);
    }

    const request$ = this.isEditMode && this.projetoSlug
      ? this.projetosService.updateProjeto(this.projetoSlug, formData)
      : this.projetosService.createProjeto(formData);

    request$.subscribe({
      next: (res) => {
        const message = this.isEditMode ? 'Projeto atualizado com sucesso!' : 'Projeto publicado com sucesso!';
        this.router.navigate(['/admin/sucesso'], {
            queryParams: {
                message: message,
                actionLabel: 'Voltar para Projetos',
                actionUrl: '/admin/projetos',
                createLabel: 'Criar novo Projeto',
                createUrl: '/projetos/novo'
            }
        });
      },
      error: (err) => {
        console.error('Erro no envio:', err);
        const errorMessage = err.error?.detail || JSON.stringify(err.error) || 'Não foi possível salvar o projeto.';

        this.router.navigate(['/admin/erro'], {
            queryParams: {
                message: 'Erro ao salvar o projeto.',
                details: errorMessage,
                retryLabel: 'Tentar novamente',
                retryUrl: this.router.url,
                backUrl: '/admin/projetos'
            }
        });
      }
    });
  }
}
