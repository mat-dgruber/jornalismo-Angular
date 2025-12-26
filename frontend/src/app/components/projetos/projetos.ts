import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjetosService, Projeto } from '../../services/projetos.service';

@Component({
  selector: 'app-projetos',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './projetos.html',
  styleUrls: ['./projetos.css']
})
export class Projetos implements OnInit {
  projects: Projeto[] = [];
  private projetosService = inject(ProjetosService);

  ngOnInit(): void {
    this.projetosService.getProjetos().subscribe(data => {
        this.projects = data.reverse();
    });
  }
}
