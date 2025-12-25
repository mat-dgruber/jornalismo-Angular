import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MateriaisService, Material } from '../../services/materiais.service';
import { LucideAngularModule, Pencil, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-material-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TooltipModule, ConfirmDialogModule, RouterLink, LucideAngularModule],
  templateUrl: './material-list.html',
  styleUrl: './material-list.css',
  providers: [ConfirmationService]
})
export class MaterialList implements OnInit {
  materiais: Material[] = [];
  private materiaisService = inject(MateriaisService);
  private confirmationService = inject(ConfirmationService);
  
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;

  ngOnInit() {
    this.loadMateriais();
  }

  loadMateriais() {
    this.materiaisService.getMateriais().subscribe(data => {
      this.materiais = data;
    });
  }

  deleteMaterial(id: number) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este material?',
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-plain',
      accept: () => {
        this.materiaisService.deleteMaterial(id).subscribe(() => {
          this.loadMateriais();
        });
      }
    });
  }
}
