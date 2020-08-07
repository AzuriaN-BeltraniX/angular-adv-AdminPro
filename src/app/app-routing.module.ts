import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";

// Modulos
import { PagesRoutingModule } from './pages/pages.routing';
import { AuthRoutingModule } from './auth/auth.routing';

// Componentes
import { NopagefoundComponent } from './nopagefound/nopagefound.component';

const routes: Routes = [

  // Path: '/dashboard' => PagesRoutingModule
  // Path: '/login' => AuthRoutingModule
  // Path: '/register' => AuthRoutingModule

  { path: '**', component: NopagefoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    PagesRoutingModule,
    AuthRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
