import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { DataService } from 'src/app/service/dataService/data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userData: any;
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private dataService: DataService
  ) { }

  async ngOnInit(){
    const user = await this.afAuth.currentUser;
    if (user) {
      this.userData = this.dataService.currentUser.getValue();
      console.log(this.userData)
    } else {
      this.router.navigate(['login']);   
    }
  }

  goToOrders() {
    this.router.navigate(['/my-orders']); // Adjust the route as needed
  }

  logout() {
    this.afAuth.signOut().then(() => {
      console.log('User signed out successfully');
      this.dataService.currentUser.next(null);
      this.router.navigate(['login']);   
    }).catch((error) => {
      console.error('Error signing out:', error);
    });
  }



}
