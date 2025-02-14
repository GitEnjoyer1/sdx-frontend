import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from './client/client.component';
import { ClientDetailComponent } from './client-detail/client-detail.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { CreateComponent } from './create/create.component';
import { CreateUserComponent } from './create-user/create-user.component';

export const routes: Routes = [
    { path: '', component: ClientComponent },
    { path: 'clients', component: ClientComponent },
    { path: 'client/:clientId', component: ClientDetailComponent, 
        children: [
            { path: 'user/:userId', component: UserDetailComponent },
            { path: 'create-user', component: CreateUserComponent}

        ]
    },    
    { path: 'create-client', component: CreateComponent},
    { path: '**', component: ErrorPageComponent }
];
RouterModule.forRoot(routes, { enableTracing: true })

