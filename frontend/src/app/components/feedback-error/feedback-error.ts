import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'primeng/button';
import { CardModule } from 'primeng/card';
// import { AccordionModule } from 'primeng/accordion'; // Removed

@Component({
  selector: 'app-feedback-error',
  standalone: true,
  imports: [CommonModule, Button, CardModule],
  templateUrl: './feedback-error.html',
  styleUrl: './feedback-error.css'
})
export class FeedbackError implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  message: string = 'Ocorreu um erro inesperado.';
  details: string | null = null;
  retryLabel: string = 'Tentar novamente';
  retryUrl: string = '';
  backLabel: string = 'Voltar';
  backUrl: string = '/admin';

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['message']) this.message = params['message'];
      if (params['details']) this.details = params['details'];
      if (params['retryLabel']) this.retryLabel = params['retryLabel'];
      if (params['retryUrl']) { // Normally the previous page
         this.retryUrl = params['retryUrl'];
      }
      if (params['backUrl']) this.backUrl = params['backUrl'];
    });
    
    // Fallback: if retryUrl is empty, try to get from history or keep empty to just go back
    if(!this.retryUrl) {
        // We can't easily guess the "retry" URL without it being passed 
        // because we are in a new route. So we rely on param.
    }
  }

  goBack() {
    this.router.navigateByUrl(this.backUrl);
  }

  retry() {
    if(this.retryUrl) {
        this.router.navigateByUrl(this.retryUrl);
    } else {
        // Default behavior: go back to admin dashboard
        this.router.navigate(['/admin']);
    }
  }
}
