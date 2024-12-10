import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/service/dataService/data.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  shopName ='';
  signUpForm!: FormGroup;
  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required], // Corrected form control name
      lastName: ['', Validators.required], // Corrected form control name
      email: ['', [Validators.required, Validators.email]], // Corrected form control name
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]], // Corrected form control name
      country: ['', Validators.required], // Corrected form control name
      address1: ['', Validators.required], // Corrected form control name
      address2: [''], // Corrected form control name
      city: ['', Validators.required], // Corrected form control name
      state: ['', Validators.required], // Corrected form control name
      postalCode: ['', Validators.required], // Corrected form control name
      password: ['', Validators.required], // Corrected form control name
      birthday: ['', Validators.required], // Add this line
      confirmPassword: ['', Validators.required], // Corrected form control name
      
    },{ validators: this.passwordMatchValidator.bind(this) }
      
    );

    this.dataService.shopName.subscribe((data) => {
      if(data == null) return;
      this.shopName = data[0].shopName;
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    }
  }

  async onSubmitSignUp() {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    const { firstName, lastName, email, phone, country, address1, address2, city, state, postalCode, birthday, password } = this.signUpForm.value;

    try {
      this.spinner.show();
      // Create user with Firebase Authentication
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);

      // Store additional user details in Firestore
      await this.firestore.collection('users').doc(userCredential.user?.uid).set({
        firstName,
        lastName,
        email,
        phone,
        country,
        address1,
        address2,
        city,
        state,
        postalCode,
        birthday
      });
      this.spinner.hide();
      this.toastr.success('Sign Up Successful!');
      this.router.navigate(['home']);

    } catch (error) {
      this.spinner.hide();
      this.toastr.error('Sign Up Failed. Please try again.');
    }
  }

}
