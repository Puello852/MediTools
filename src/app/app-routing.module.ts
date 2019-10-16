import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { DashboardHomePage } from './pages/dashboard-home/dashboard-home.page';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'registrar', loadChildren: './pages/registrar/registrar.module#RegistrarPageModule' },
  { path: 'forgot-password', loadChildren: './pages/forgot-password/forgot-password.module#ForgotPasswordPageModule' },
  { path: 'dashboard', 
    component:DashboardHomePage ,children:[
    { path: 'home', children: [ { path: '', loadChildren: './pages/tabs/home-tabs/home-tabs.module#HomeTabsPageModule' }]},
    { path: 'profile', children: [ {path:'', loadChildren: './pages/tabs/profile-tabs/profile-tabs.module#ProfileTabsPageModule'}]},
    { path: 'history', children:[{ path:'',loadChildren: './pages/tabs/clinical-histories/clinical-histories.module#ClinicalHistoriesPageModule'}]},
    { path: 'citas', children:[{path:'', loadChildren: './pages/tabs/citastabs/citastabs.module#CitastabsPageModule' }]},
  ]},
  { path: 'edit-profile', loadChildren: './pages/tabs/edit-profile/edit-profile.module#EditProfilePageModule' },
  { path: 'agregar-citas-tabs', loadChildren: './pages/tabs/citastabs/agregar-citas-tabs/agregar-citas-tabs.module#AgregarCitasTabsPageModule' },
  { path: 'detalle-nueva-cita/:id', loadChildren: './pages/tabs/citastabs/detalle-nueva-cita/detalle-nueva-cita.module#DetalleNuevaCitaPageModule' },
  { path: 'pedir-cita', loadChildren: './pages/tabs/citastabs/detalle-nueva-cita/pedir-cita/pedir-cita.module#PedirCitaPageModule' },
  { path: 'detalle-estado-cita/:id', loadChildren: './pages/tabs/citastabs/detalle-estado-cita/detalle-estado-cita.module#DetalleEstadoCitaPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
