import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { ProjetosService, Projeto } from '../../services/projetos.service';

@Component({
  selector: 'app-projetos',
  standalone: true,
  imports: [RouterLink, SkeletonModule],
  templateUrl: './projetos.html',
  styleUrls: ['./projetos.css']
})
export class Projetos implements OnInit {
  projects: Projeto[] = [];
  isLoading = true;
  private projetosService = inject(ProjetosService);

  ngOnInit(): void {
    this.projetosService.getProjetos().subscribe({
      next: (data) => {
        this.projects = data.reverse();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
