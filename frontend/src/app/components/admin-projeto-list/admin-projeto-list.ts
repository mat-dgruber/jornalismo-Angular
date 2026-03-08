import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ProjetosService, Projeto } from '../../services/projetos.service';
import { LucideAngularModule, Pencil, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-admin-projeto-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TooltipModule, ConfirmDialogModule, RouterLink, LucideAngularModule],
  templateUrl: './admin-projeto-list.html',
  styleUrl: './admin-projeto-list.css',
  providers: [ConfirmationService]
})
export class AdminProjetoList implements OnInit {
  projetos: Projeto[] = [];
  private projetosService = inject(ProjetosService);
  private confirmationService = inject(ConfirmationService);

  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;

  ngOnInit() {
    this.loadProjetos();
  }

  loadProjetos() {
    this.projetosService.getProjetos().subscribe(data => {
      this.projetos = data;
    });
  }

  deleteProjeto(slug: string) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este projeto?',
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-plain',
      accept: () => {
        this.projetosService.deleteProjeto(slug).subscribe(() => {
          this.loadProjetos();
        });
      }
    });
  }
}
