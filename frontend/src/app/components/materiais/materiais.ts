import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { MateriaisService, Material } from '../../services/materiais.service';

@Component({
  selector: 'app-materiais',
  templateUrl: './materiais.html',
  styleUrls: ['./materiais.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, SkeletonModule]
})
export class Materiais implements OnInit {
  materials: Material[] = [];
  isLoading = true;

  constructor(private materiaisService: MateriaisService) {}

  ngOnInit() {
    this.materiaisService.getMateriais().subscribe({
      next: (data) => {
        this.materials = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching materials:', error);
        this.isLoading = false;
      }
    });
  }
}
