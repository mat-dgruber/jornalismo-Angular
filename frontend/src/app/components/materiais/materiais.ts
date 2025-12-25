import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MateriaisService, Material } from '../../services/materiais.service';

@Component({
  selector: 'app-materiais',
  templateUrl: './materiais.html',
  styleUrls: ['./materiais.css'],
  standalone: true,
  imports: [CommonModule]
})
export class Materiais implements OnInit {
  materials: Material[] = [];

  constructor(private materiaisService: MateriaisService) {}

  ngOnInit() {
    this.materiaisService.getMateriais().subscribe({
      next: (data) => {
        this.materials = data;
      },
      error: (error) => {
        console.error('Error fetching materials:', error);
      }
    });
  }
}
