import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/service/dataService/data.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { animate, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-user-order-detail',
  templateUrl: './user-order-detail.component.html',
  styleUrls: ['./user-order-detail.component.css'],
  animations: [
    trigger('fadeInAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('300ms ease-in', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
    trigger('slideOutAnimation', [
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
})
export class UserOrderDetailComponent implements OnInit {
  cartItems: any[] = [];
  totalItems: number = 0;
  totalPrice: number = 0;
  currentUser: any;
  
  constructor(
    private dataService: DataService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private afAuth: AngularFireAuth,
  ){}

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.loadCart(user);

      } else {
        this.loadCart(null);
      }
    });
  }

  async loadCart(user?: any): Promise<void> {
    this.cartItems = await this.dataService.getCustomerCardProducts(user); // Await the Promise here
    this.calculateTotals();
  }
  

  calculateTotals(): void {
    this.totalItems = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  async removeFromCart(product: any){
    await this.dataService.deleteProductFromCard(product);
    this.loadCart(this.currentUser);
    this.cartItems = this.cartItems.filter(item => item.id !== product.productId);
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.calculateTotals();
  }

  navigateWithObject() {
    const data = this.cartItems;
    this.router.navigateByUrl('/confirm-order', { state: { data } });
  }
}
