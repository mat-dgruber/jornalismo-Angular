import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { AdminDashboard } from './admin-dashboard';
import { AdminService, UsageStats } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboard;
  let fixture: ComponentFixture<AdminDashboard>;
  let adminServiceSpy: jasmine.SpyObj<AdminService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  const mockStats: UsageStats = {
    database: {
      used_bytes: 536870912,
      limit_bytes: 1073741824,
      percentage: 50
    },
    storage: {
      used_bytes: 268435456,
      limit_bytes: 1073741824,
      percentage: 25
    }
  };

  beforeEach(async () => {
    adminServiceSpy = jasmine.createSpyObj('AdminService', ['getUsageStats']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);

    adminServiceSpy.getUsageStats.and.returnValue(of(mockStats));
    authServiceSpy.logout.and.resolveTo();

    await TestBed.configureTestingModule({
      imports: [AdminDashboard],
      providers: [
        provideRouter([]),
        { provide: AdminService, useValue: adminServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboard);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('deve ser instanciado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar as estatísticas de uso do servidor', () => {
    expect(component.usageStats).toEqual(mockStats);
    expect(adminServiceSpy.getUsageStats).toHaveBeenCalled();
  });

  it('deve formatar bytes corretamente no método formatBytes', () => {
    expect(component.formatBytes(0)).toBe('0 Bytes');
    expect(component.formatBytes(1024)).toBe('1 KB');
    expect(component.formatBytes(1048576)).toBe('1 MB');
    expect(component.formatBytes(1073741824)).toBe('1 GB');
  });

  it('deve deslogar o usuário e redirecionar para /login', async () => {
    await component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
