import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './Layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './Layouts/blank-layout/blank-layout.component';
import { NotfoundComponent } from './Components/notfound/notfound.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';

export const routes: Routes = [
    {path:'',component:AuthLayoutComponent,children:[
        {path:'',redirectTo:'login',pathMatch:'full'},
        {path:'login',component:LoginComponent},
        {path:'register',component:RegisterComponent}
    ]},
    {path:'blank',component:BlankLayoutComponent},



    {path:'**',component:NotfoundComponent}
];
