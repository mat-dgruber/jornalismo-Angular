import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Footer } from './footer';

describe('FooterComponent', () => {
  let component: Footer;
  let fixture: ComponentFixture<Footer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer]
    }).compileComponents();

    fixture = TestBed.createComponent(Footer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser instanciado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve conter o ano atual na propriedade currentYear', () => {
    const thisYear = new Date().getFullYear();
    expect(component.currentYear).toBe(thisYear);
  });
});
