import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'; 

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  message: string | null = null;

  constructor(private fb: FormBuilder) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {}

  async onSubmit() {
    if (this.forgotPasswordForm.invalid) return;

    const email = this.forgotPasswordForm.value.email;

    try {
      const auth = getAuth(); // Get the auth instance from Firebase
      await sendPasswordResetEmail(auth, email);
      this.message = 'Password reset email sent. Please check your inbox.';
    } catch (error: any) {
      this.message = 'Error: ' + error.message;
    }
  }
}