import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { ContactComponent } from './contact/contact/contact.component';
import { AboutComponent } from './about/about/about.component';
import { ShopComponent } from './shop/shop/shop.component';
import { ShopSingleComponent } from './shop-single/shop-single/shop-single.component';
import { SetupComponent } from './setup/setup/setup.component';
import { AdminProductOrderDetailsComponent } from './Order/admin-product-order-details/admin-product-order-details.component';
import { ConfirmOrderComponent } from './Order/confirm-order/confirm-order.component';
import { PaymentComponent } from './Order/payment/payment.component';
import { ConfirmOrderDetailsComponent } from './confirm-order-details/confirm-order-details.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { LoginComponent } from './Auth/login/login.component';
import { ProfileComponent } from './profile/profile/profile.component';
import { RegisterComponent } from './Auth/register/register.component';
import { ForgotPasswordComponent } from './Auth/forgot-password/forgot-password.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'product/:id', component: ShopSingleComponent },
  { path: 'setup', component: SetupComponent },
  { path: 'Admin-order-details', component: AdminProductOrderDetailsComponent },
  { path: 'confirm-order', component: ConfirmOrderComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'confirm-order-details/:id', component: ConfirmOrderDetailsComponent },
  { path: 'my-orders', component: MyOrdersComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signUp', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent }




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
