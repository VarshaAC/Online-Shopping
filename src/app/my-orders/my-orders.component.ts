import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/dataService/data.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';


@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  orders : any;
  displayedColumns: string[] = ['position', 'name']; // Adjust column IDs

  constructor(
    private dataService : DataService,
    private router: Router,
    private afAuth: AngularFireAuth
  ) { }

  async ngOnInit() {
    this.afAuth.authState.subscribe(async (user) => { // Add `async` to the callback
      if (user) {
        this.orders = await this.dataService.getOrdersByUserId(user.uid);
      }
    });
  }

  convertToDate(createdAt: any) {
    // Convert to milliseconds
    const milliseconds = (createdAt.seconds * 1000) + (createdAt.nanoseconds / 1_000_000);

    // Create a Date object
    return new Date(milliseconds);
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
  

 getTotalAmount(order: any): number {
 // console.log(order.card); // Log the card data to check its structure
  if (Array.isArray(order.card)) {
    return order.card.reduce((total: any, product: any) => total + product.quantity * product.price, 0);
  } else {
    return order.card.quantity * order.card.price

  }
}


  viewOrderDetails(productId: any): void {
    this.router.navigate(['/product',productId]);
  }
  

}
