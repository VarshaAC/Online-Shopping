import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './home/header/header/header.component';
import { FooterComponent } from './home/footer/footer/footer.component';
import { ContactComponent } from './contact/contact/contact.component';
import { HomeComponent } from './home/home/home.component';
import { AboutComponent } from './about/about/about.component';
import { ShopComponent } from './shop/shop/shop.component';
import { ShopSingleComponent } from './shop-single/shop-single/shop-single.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { environment } from '../environments/environment';
import { SetupComponent } from './setup/setup/setup.component';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from 'ngx-toastr';
import { ConfirmationComponent } from './confirmation/confirmation/confirmation.component';  
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AdminProductOrderDetailsComponent } from './Order/admin-product-order-details/admin-product-order-details.component';
import { UserOrderDetailComponent } from './Order/user-order-detail/user-order-detail.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { ConfirmOrderComponent } from './Order/confirm-order/confirm-order.component';
import { PaymentComponent } from './Order/payment/payment.component';
import { ConfirmOrderDetailsComponent } from './confirm-order-details/confirm-order-details.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { LoginComponent } from './Auth/login/login.component';
import { ProfileComponent } from './profile/profile/profile.component';
import { RegisterComponent } from './Auth/register/register.component';
import { ForgotPasswordComponent } from './Auth/forgot-password/forgot-password.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { FilterComponent } from './filter/filter.component';
import { MainProductListComponent } from './main-product-list/main-product-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ContactComponent,
    HomeComponent,
    AboutComponent,
    ShopComponent,
    ShopSingleComponent,
    SetupComponent,
    ConfirmationComponent,
    AdminProductOrderDetailsComponent,
    UserOrderDetailComponent,
    ConfirmOrderComponent,
    PaymentComponent,
    ConfirmOrderDetailsComponent,
    MyOrdersComponent,
    LoginComponent,
    ProfileComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ProductListComponent,
    FilterComponent,
    MainProductListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFirestoreModule.enablePersistence(),
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    ReactiveFormsModule,
    ColorPickerModule,
    MatExpansionModule,      // For mat-accordion and mat-expansion-panel
    MatTableModule,          // For mat-table
    MatIconModule,
    ToastrModule.forRoot()  
  ],
  entryComponents: [ConfirmationComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
