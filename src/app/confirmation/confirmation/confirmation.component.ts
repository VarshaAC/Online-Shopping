import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ToastrService } from 'ngx-toastr';  

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
  name! : any;

  @Inject(MAT_DIALOG_DATA) data!: any
  constructor(
    private firestore: AngularFirestore,
    private toastr: ToastrService,
    private _mdr: MatDialogRef<any>
  ) { }

  ngOnInit(): void {
    this.name = this.data;
  }

  deleteProduct(productId : any) {
   
      this.firestore.collection('products').doc('product').collection('product').doc(productId).delete()
      .then(() => {
        this.toastr.success( ' product deleted successfully.');
      })
      .catch((error) => {
        this.toastr.warning(error );
      });
    
    
  }
  CloseDialog(flag: boolean) {
    this._mdr.close(flag);
  }
}
