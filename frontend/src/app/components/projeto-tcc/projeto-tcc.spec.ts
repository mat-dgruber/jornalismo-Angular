import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProjetoTCC } from './projeto-tcc';

describe('ProjetoTCCComponent', () => {
  let component: ProjetoTCC;
  let fixture: ComponentFixture<ProjetoTCC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjetoTCC],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjetoTCC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser instanciado com sucesso', () => {
    expect(component).toBeTruthy();
  });
});
