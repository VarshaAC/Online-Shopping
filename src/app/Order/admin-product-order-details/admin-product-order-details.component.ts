import { Component, OnInit, Renderer2 } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DataService } from 'src/app/service/dataService/data.service';
import { Router } from '@angular/router';
interface Order {
  id: number;
  customerName: string;
  productName: string;
  quantity: number;
  price: number;
  status: string;
  paymentMethod: string;
}

@Component({
  selector: 'app-admin-product-order-details',
  templateUrl: './admin-product-order-details.component.html',
  styleUrls: ['./admin-product-order-details.component.css']
})
export class AdminProductOrderDetailsComponent implements OnInit {
  orders: any = [];
  orderItems: any = [];
  theme: any;
  currentUser: any;
  constructor(
    private dataService :DataService,
    private renderer: Renderer2,
    private router: Router,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore) { 
    this.theme = {
      backgroundColor: '#210b12', // Specify background color
      textColor: '#210b12' // Specify text color
    };
  }

  async ngOnInit() {
    this.dataService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
    await this.getOders();
    //document.documentElement.style.setProperty('--primary-color', this.theme.primaryColor);
    
    
  }

  async getOders() {
    this.orders = await this.dataService.getOrders();
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toLocaleLowerCase()) {
      case 'pending':
        return 'badge-warning'; // Yellow for pending status
      case 'processing':
        return 'badge-info'; // Blue for processing
      case 'shipped':
        return 'badge-primary'; // Blue for shipped
      case 'delivered':
        return 'badge-success'; // Green for delivered
      case 'cancelled':
        return 'badge-danger'; // Red for cancelled
      default:
        return 'badge-secondary'; // Gray for unknown status
    }
  }
  

  viewOrderDetails(orderId: any): void {
    this.router.navigate(['/confirm-order-details',orderId]);


  }

  calculateTotalPrice(order: any) {
    return order.cardItems.reduce(
      (total:any, product:any) => total + product.quantity * product.price,
      0
    );
  }

  calculateTotalQuantity(order: any) {
    return order.cardItems.reduce(
      (total:any, product:any) => total + product.quantity ,
      0
    );
  }
  
}
