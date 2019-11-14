import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// components
import { CategorymsComponent } from './categoryms/categoryms.component';

// modules
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule} from '@angular/forms';

//services
import { ParentApiService } from '../services/parent-api.service';
import { ProductmsComponent } from './productms/productms.component';
import { ProdlistComponent } from './prodlist/prodlist.component';
import { FileUploadService } from '../services/fileupload.service';


const appRoutes: Routes = [
  { path: 'catms', component: CategorymsComponent },
  { path: 'prodms', component: ProductmsComponent },
  { path: 'prodms/:id', component: ProductmsComponent },
  { path: 'prodlist', component: ProdlistComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    CategorymsComponent,
    ProductmsComponent,
    ProdlistComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    )
  ],
  providers: [ParentApiService, FileUploadService],
  bootstrap: [AppComponent]
})
export class AppModule { }
