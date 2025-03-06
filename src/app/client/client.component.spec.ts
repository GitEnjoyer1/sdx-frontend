import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { ClientComponent } from './client.component';
import { BackendServiceService } from '../services/backend-service.service'; 
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ClientComponent', () => {
  let component: ClientComponent;
  let fixture: ComponentFixture<ClientComponent>;
  let mockBackendService: { getClients: { and: { returnValue: (arg0: Observable<number[]>) => void; }; }; };
  let mockRouter: { navigate: any; };

  beforeEach(async () => {
    mockBackendService = jasmine.createSpyObj(['getClients']);
    mockRouter = jasmine.createSpyObj(['navigate']);

    await TestBed.configureTestingModule({
      // Add declarations and providers
      imports: [ClientComponent, HttpClientTestingModule],
      providers: [
        { provide: BackendServiceService, useValue: mockBackendService },
        { provide: Router, useValue: mockRouter },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getClients', () => {
    it('should set clients with the items returned from the server', () => {
      const clients = [1, 2, 3];
      mockBackendService.getClients.and.returnValue(of(clients));

      component.getClients();
      expect(component.clients).toBe(clients);
    });
  });

  describe('goToDetails', () => {
    it('should navigate to the client detail for the given id', ()=> {
      const clientId = 1;
      component.goToDetails(clientId);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/client', clientId]);
    });
  });
});
