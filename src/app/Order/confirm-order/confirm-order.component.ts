import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'src/app/service/dataService/data.service';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/compat/auth';
// Define an interface for credit card details
interface CreditCardDetails {
  cardNumber: string;
  expirationDate: string;
  cvv: string;
}

// Define the order data structure
interface OrderData {
  cart: any;
  customer: {
    name: string;
    email: string;
    streetAddress: string;
    postalCode: string;
    city: string;
    province: string;
    country: string;
    phone: string;
  };
  paymentMethod: string;
  creditCardDetails?: CreditCardDetails;  // Optional property
}

@Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.component.html',
  styleUrls: ['./confirm-order.component.css']
})
export class ConfirmOrderComponent implements OnInit {

  cartItems: any;
  userData: any;

  // Order details including payment method
  customerDetails = {

    name: '',
    email: '',
    streetAddress: '',
    postalCode: '',
    city: '',
    province: '',
    country: '',
    phone: '',
    paymentMethod: '' // Payment method
  };

  orderData : OrderData =  {
    cart: '',
  customer:{
    name: '',
    email: '',
    streetAddress: '',
    postalCode: '',
    city: '',
    province: '',
    country: '',
    phone: ''
  },
  paymentMethod: '',
  creditCardDetails: {
    cardNumber: '',
    expirationDate: '',
    cvv: ''
  }
  }

  // Credit card details
  creditCardDetails: CreditCardDetails = {
    cardNumber: '',
    expirationDate: '',
    cvv: ''
  };

  constructor(private router: Router,private  dataService: DataService, private spinner: NgxSpinnerService,  private toastr: ToastrService,
    private afAuth: AngularFireAuth,) {}

  ngOnInit(): void {
    this.userData = this.dataService.getUSerData();
    if(this.userData) {
      this.customerDetails.streetAddress = this.userData.address1 + ' ' +  this.userData.address2;
      this.customerDetails.city = this.userData.city;
      this.customerDetails.name = this.userData.firstName + ' ' + this.userData.firstName ;
      this.customerDetails.country = this.userData.country;
      this.customerDetails.email = this.userData.email;
      this.customerDetails.province = this.userData.state;
      this.customerDetails.postalCode = this.userData.postalCode;
      this.customerDetails.phone = this.userData.phone;

    }

     // Access the passed state data
    const receivedData = history.state.data;

    this.afAuth.authState.subscribe(user => {
      if (user && !receivedData) {
        this.loadCart(user);

      } else if (!receivedData) {
        this.loadCart(null);
      } else {
        this.cartItems = receivedData;
      }
    });
    

  }

  async loadCart(user: any): Promise<void> {
    this.cartItems = await this.dataService.getCustomerCardProducts(user); // Await the Promise here


  }

  viewOrderDetails(productId: any): void {
    this.router.navigate(['/product',productId]);
  }

  // Handle payment method change
  onPaymentMethodChange(method: string) {
    this.customerDetails.paymentMethod = method;
  }

  // Updated placeOrder function
  placeOrder(form: NgForm) {
    if( this.cartItems.length > 0) {
      this.cartItems.forEach((card: any) => {
        card.status = "Pending";
      })
    }
    if (form.valid) {
      // If the payment method is 'creditCard', navigate to the card payment page
      if (this.customerDetails.paymentMethod === 'creditCard') {
        // Navigate to payment card details page
        this.router.navigate(['/payment'], { state: { orderDetails: this.customerDetails, cartItems: this.cartItems } });
      } else {
        // Handle other payment methods (like Cash on Delivery)
        const orderData: OrderData = {
          cart: this.cartItems,
          customer: this.customerDetails,
          paymentMethod: this.customerDetails.paymentMethod
        };

        this.dataService.storeOrders(orderData);
        this.router.navigate(['/shop']);
        // Clear form and data
        this.cartItems = [];
        this.customerDetails = {
          name: '',
          email: '',
          streetAddress: '',
          postalCode: '',
          city: '',
          province: '',
          country: '',
          phone: '',
          paymentMethod: ''
        };
        this.creditCardDetails = {
          cardNumber: '',
          expirationDate: '',
          cvv: ''
        };
        form.resetForm();


      }
    } else {
      alert('Please fill all required fields');
    }
  }

  // Calculate total price for the cart items
  calculateTotal(): number {
    return this.cartItems?.reduce((total: number, item: { price: number, quantity: number }) => {
      return total + item.price * item.quantity;
    }, 0);
  }
}
