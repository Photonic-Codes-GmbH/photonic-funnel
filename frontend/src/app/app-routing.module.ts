import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { KeycloakGuard } from './core/guards/keycloak.guard'
import { AppComponent } from './app.component'

const routes: Routes = [
  { path: '', canActivate: [KeycloakGuard], component: AppComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
