import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation/confirmation.component';
import { DataService } from 'src/app/service/dataService/data.service';

@Component({
  selector: 'app-main-product-list',
  templateUrl: './main-product-list.component.html',
  styleUrls: ['./main-product-list.component.css']
})
export class MainProductListComponent implements OnInit {

  products: any = [];
  userData: any =[];
  @Input() fromShopSingle = false;
  @Output() triggerGetProduct = new EventEmitter<string>();
  matDialogRef!: MatDialogRef<ConfirmationComponent>;
  constructor(
    private dataService: DataService,   
    private afAuth: AngularFireAuth,
    private toster: ToastrService,
    private router: Router,
    private dialog: MatDialog
  ) { 
    this.subscriptionForProducts();
  }

  async ngOnInit() {

   this.dataService.currentUser.subscribe((data: any) => {
    if(data == null) return;
    this.userData = data;
   });
  
    this.dataService.productsDataMainList.subscribe((products: any) => {
      if (products === null) return

      this.products = products;

    })
  }

  subscriptionForProducts() {
    this.dataService.hasMoreMain.next(false);
    this.dataService.lastDocMain.next(null);
    this.dataService.limitMain.next(8);
    this.dataService.getProducts(this.dataService.limitMain.getValue(), null , {}, "Main").subscribe((data : any) => {
      if(data == null) return;
      this.dataService.productsDataMainList.next(data);
        localStorage.setItem('Products', JSON.stringify(data));
      // Save the last document for pagination
      if (data.length < this.dataService.limitMain.getValue()) {
        this.dataService.hasMoreMain.next(false);
      }

    })
  }

  navigateWithObject(product: any) {
    if(this.fromShopSingle) {
      this.triggerGetProduct.emit(product.productId);
    } else {
      this.router.navigate(['/product', product.productId], {
        state: { objectData: product }
      });
    }
   
  }

  openConfirmationForDelete(product: any, index: number) {
    this.matDialogRef = this.dialog.open(ConfirmationComponent, {
      width: '450px',
      height: '180px',
      data: product,
      disableClose: true
    });

    this.matDialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.deleteProduct(product.productId, index);
      }
    });

  }
  deleteProduct(productId: string, index: number) {
    this.dataService.handleDeleteByAdmin("products","product", productId, this.products, index);
  }

  disabledLoadMoreButton() {
    return this.products.length < this.dataService.limitMain.getValue();
  }

  loadMore() {
    if (!this.dataService.hasMoreMain.getValue()) {
      this.toster.info('No more products to load'); // Notify user
      return;
    }
    this.dataService.limit.next(this.dataService.limitMain.getValue() + 8);
    this.dataService.getProducts(this.dataService.limitMain.getValue() , this.dataService.lastDocMain.getValue(), {}, "Main").subscribe((newProducts) => {
      this.products = [...this.products, ...newProducts]; // Append new products
      this.dataService.productsDataMainList.next(this.products);
    });
  }


}
