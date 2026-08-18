import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Contato } from './contato';

describe('ContatoComponent', () => {
  let component: Contato;
  let fixture: ComponentFixture<Contato>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Contato],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Contato);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser instanciado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar o formulário inválido', () => {
    expect(component.contactForm.valid).toBe(false);
  });

  it('deve validar e acusar erro quando o formulário for submetido inválido', () => {
    component.onSubmit();
    expect(component.submissionMessage).toBe('Por favor, preencha todos os campos corretamente.');
  });

  it('deve enviar a mensagem com sucesso quando os campos forem válidos', () => {
    component.contactForm.setValue({
      nome: 'Maria Leitora',
      email: 'leitora@teste.com',
      mensagem: 'Excelente trabalho no portal!'
    });

    expect(component.contactForm.valid).toBe(true);

    component.onSubmit();
    expect(component.isSubmitting).toBe(true);

    const req = httpMock.expectOne('https://formspree.io/f/mwpnpgrg');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      nome: 'Maria Leitora',
      email: 'leitora@teste.com',
      mensagem: 'Excelente trabalho no portal!'
    });

    req.flush({ ok: true });

    expect(component.isSubmitting).toBe(false);
    expect(component.submissionMessage).toBe('Mensagem enviada com sucesso!');
    expect(component.contactForm.value.nome).toBeNull();
  });

  it('deve exibir mensagem amigável quando a submissão via HTTP falhar', () => {
    component.contactForm.setValue({
      nome: 'Maria Leitora',
      email: 'leitora@teste.com',
      mensagem: 'Mensagem de teste'
    });

    component.onSubmit();

    const req = httpMock.expectOne('https://formspree.io/f/mwpnpgrg');
    req.flush('Erro no servidor', { status: 500, statusText: 'Internal Server Error' });

    expect(component.isSubmitting).toBe(false);
    expect(component.submissionMessage).toBe('Ocorreu um erro ao enviar a mensagem. Tente novamente mais tarde.');
  });
});
