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

  onDownload(material: Material): void {
    if (material.file) {
      // 1. Open in new tab
      window.open(material.file, '_blank');

      // 2. Trigger automatic download
      this.materiaisService.downloadFile(material.file).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          // Extract filename from URL or use default
          const filename = material.file?.split('/').pop() || 'download';
          link.download = filename;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Download failed:', error);
          // Fallback is already handled by the window.open above, 
          // but we could show a toast here if we had one.
        }
      });
    }
  }
}
