import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ArtigosService, Artigo } from '../../services/artigos.service';
import { LucideAngularModule, Pencil, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-admin-artigo-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TooltipModule, ConfirmDialogModule, RouterLink, LucideAngularModule],
  templateUrl: './admin-artigo-list.html',
  styleUrl: './admin-artigo-list.css',
  providers: [ConfirmationService]
})
export class AdminArtigoList implements OnInit {
  artigos: Artigo[] = [];
  private artigosService = inject(ArtigosService);
  private confirmationService = inject(ConfirmationService);

  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;

  ngOnInit() {
    this.loadArtigos();
  }

  loadArtigos() {
    this.artigosService.getArtigos().subscribe(data => {
      this.artigos = data;
    });
  }

  deleteArtigo(id: number) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este artigo?',
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-plain',
      accept: () => {
        this.artigosService.deleteArtigo(id).subscribe(() => {
          this.loadArtigos();
        });
      }
    });
  }
}
