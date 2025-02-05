import { Routes } from '@angular/router';
import { ClientComponent } from './client/client.component';
import { ClientDetailComponent } from './client-detail/client-detail.component';
import { ErrorPageComponent } from './error-page/error-page.component';

export const routes: Routes = [
    { path: '', component: ClientComponent },
    { path: 'clients', component: ClientComponent },
    { path: 'client/:id', component: ClientDetailComponent },
    { path: '**', component: ErrorPageComponent },
    
];
