import { Routes } from '@angular/router';
import { ClientComponent } from './client/client.component';
import { ClientDetailComponent } from './client-detail/client-detail.component';

export const routes: Routes = [
    { path: '', component: ClientComponent },
    { path: 'client/:id', component: ClientDetailComponent }
];
