import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ContactComponent } from './contact/contact.component';
import { UploadComponent } from './upload/upload.component';
import { LibraryComponent } from './library/library.component';
import {RegisterComponent} from './register/register.component';
import {VideoComponent} from './video/video.component'
import { AuthService } from './auth.service';
import { EditVideoComponent } from './edit-video/edit-video.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'upload', component: UploadComponent, canActivate: [AuthService] },
  { path: 'library', component: LibraryComponent, canActivate: [AuthService] },
  { path: 'register', component: RegisterComponent },
  { path: 'video/:id', component: VideoComponent, canActivate: [AuthService] },
  { path: 'edit-video/:s3key', component: EditVideoComponent },

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
