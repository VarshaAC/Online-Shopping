import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  orderDetails: any;
  cartItems: any;
  paymentForm: FormGroup;
  isCardPayment: boolean = false;

  constructor(private formBuilder: FormBuilder,private router: Router) {
    // Initialize the form with form controls and validation
    // Initialize form with controls using FormBuilder
    this.paymentForm = this.formBuilder.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{16}$/)]],
      expirationDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/[0-9]{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^[0-9]{3,4}$/)]],
      cardHolderName: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    // Get order details and cart items from router state
    this.orderDetails = history.state.orderDetails;
    this.cartItems = history.state.cartItems;
  }

  // Function to toggle between card payment and other methods
  togglePaymentMethod(isCard: boolean): void {
    this.isCardPayment = isCard;
  }

  // Function to handle form submission
  processPayment(): void {
    if (this.paymentForm.valid) {
      // Access form controls safely using 'get()' method
      const paymentDetails = {
        cardNumber: this.paymentForm.get('cardNumber')?.value,
        expirationDate: this.paymentForm.get('expirationDate')?.value,
        cvv: this.paymentForm.get('cvv')?.value,
        cardHolderName: this.paymentForm.get('cardHolderName')?.value
      };

      // Mock Payment processing or service call
      console.log('Processing payment:', paymentDetails);

      // Navigate to payment success or confirmation page
      this.router.navigate(['/payment-success']);
    } else {
      console.log('Invalid form');
    }
  }

  // Getter for easier template access
  get cardNumber() {
    return this.paymentForm.get('cardNumber');
  }

  get expirationDate() {
    return this.paymentForm.get('expirationDate');
  }

  get cvv() {
    return this.paymentForm.get('cvv');
  }

  get cardHolderName() {
    return this.paymentForm.get('cardHolderName');
  }
}
