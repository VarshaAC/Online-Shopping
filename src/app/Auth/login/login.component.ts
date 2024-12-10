import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/service/dataService/data.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  shopName!: string;
  signInForm!: FormGroup;
  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService // Your spinner service
  ) {
    this.dataService.currentUser.subscribe((data: any) => {
      if(data == null) return;
      this.router.navigate(['profile']);
    })
   }

  ngOnInit(): void {

    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    
    this.dataService.shopName.subscribe((data) => {
      if(data == null) return;
      this.shopName = data[0].shopName;
    });
  }


  async onSubmitSignIn() {
    if (this.signInForm.invalid) {
      this.signInForm.markAllAsTouched();
      return;
    }

    try {
      this.spinner.show();
      const { email, password } = this.signInForm.value;
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      if (result) {
        this.toastr.success('Login Successfully');
        this.dataService.syncLocalStorageToFirebase();
        
        this.router.navigate(['home']);
        
        this.spinner.hide();
      }
    } catch (error) {
      this.spinner.hide();
      this.toastr.warning('' + error);

    }
  }

  navigateToSignUp() {
    this.router.navigate(['signUp']);

  }

  handleForgotPassword() {
    this.router.navigate(['forgot-password']);
  }

}
