import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetoTCC } from './projeto-tcc';

describe('ProjetoTCC', () => {
  let component: ProjetoTCC;
  let fixture: ComponentFixture<ProjetoTCC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjetoTCC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjetoTCC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
