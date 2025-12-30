import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ProjetosService } from '../../services/projetos.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-projeto-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, InputText, Button, SelectModule, TextareaModule],
  templateUrl: './projeto-create.html',
  styleUrl: './projeto-create.css'
})
export class ProjetoCreate implements OnInit {
  private fb = inject(FormBuilder);
  private projetosService = inject(ProjetosService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEditMode = false;
  projetoId: number | null = null;
  submitLabel = 'Publicar Projeto';

  projetoForm: FormGroup = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(5)]],
    descricao: ['', Validators.required],
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
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.projetoId = +id;
      this.submitLabel = 'Salvar Alterações';
      this.loadProjeto(+id);
    }
  }

  loadProjeto(id: number) {
    this.projetosService.getProjeto(id).subscribe(projeto => {
      this.projetoForm.patchValue({
        titulo: projeto.titulo,
        descricao: projeto.descricao,
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
    formData.append('descricao', this.projetoForm.get('descricao')?.value);
    
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

    const request$ = this.isEditMode && this.projetoId
      ? this.projetosService.updateProjeto(this.projetoId, formData)
      : this.projetosService.createProjeto(formData);

    request$.subscribe({
      next: (res) => {
        alert(this.isEditMode ? 'Projeto atualizado!' : 'Projeto publicado com sucesso!');
        this.router.navigate(['/admin/projetos']);
      },
      error: (err) => {
        console.error('Erro no envio:', err);
        alert('Erro: ' + JSON.stringify(err.error));
      }
    });
  }
}
