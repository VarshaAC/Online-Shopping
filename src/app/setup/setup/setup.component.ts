import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { NgxSpinnerService } from 'ngx-spinner';
import { v4 as uuidv4 } from 'uuid';
import { ToastrService } from 'ngx-toastr';  
import { DataService } from 'src/app/service/dataService/data.service';
import { Router } from '@angular/router';
export const Categories= [
  {
      category : 'men',
      id : 1
  },
  {
      category : 'women',
      id : 2
  }
];

export const subCategories= [
  {
      subCategory : 'casual',
      id : 1
  },
  {
    subCategory : 'formal',
      id : 2
  }
];

export const type = [
  {
      type : 't-shirt',
      id : 1
  },
  {
    type : 'shirt',
      id : 2
  },
  {
    type : 'denim',
      id : 3
  }, {
    type : 'accessories',
      id : 4
  }
];

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  selectedFiles: any [] = [];
  showSelectedFiles: any [] = [];
  selectedIndex: number = 0;
  title: string = '';
  subTitle: string = '';
  specification: string = '';  
  colors: string = '';
  contant: string = '';
  selectedFile!: File;
  setupOption: string = '';
  price: number = 0;
  size: string = '';
  label: string = '';
  description: string = '';
  categoryId: number = 0;
  subCategoryId: number = 0;
  typeId: number = 0;
  primaryColor: string = '#ff0000';  // Default primary color (red)
  secondaryColor: string = '#00ff00';  // Default secondary color (green)
  shopName: string = '';
  email!: string;
  phoneNumber!: string;
  address!: string;
  city!: string;
  state!: string;
  postalCode!: string;
  country!: string;


  
  constructor(private firestore: AngularFirestore,
    private db: AngularFireDatabase,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private storage: AngularFireStorage,
  private dataService: DataService,
  private router: Router  ) {
    this.dataService.currentUser.subscribe((data) => {
      if(data ==null)   
        this.router.navigate(['']);
    })
   }
  ngOnInit(): void {
    this.primaryColor = this.dataService.getThemeColor()[0].primaryColor;
    this.secondaryColor = this.dataService.getThemeColor()[0].secondaryColor;

  }
  onFilesDropped(event: any): void {

    if((this.setupOption == 'catergories' || this.setupOption == 'SliderShow' ) && this.selectedFiles.length == 1) {
      event.preventDefault();
      this.toastr.warning('Can not add more than one image !');
      return
    } else {
      event.preventDefault();
      const files = event.dataTransfer.files;
      this.handleFiles(files);
    }
  
  }

  onDragOver(event: any): void {
    event.preventDefault();
  }

  onFilesSelected(event: any): void {
    if((this.setupOption == 'catergories' || this.setupOption == 'SliderShow' ) && this.selectedFiles.length == 1) {
      return
    } else {
      const files = event.target.files;
      this.handleFiles(files);
    }
   
  }

  onShopNameChange(event: Event): void {
    const input = event.target as HTMLInputElement; // Get the input element
    this.shopName = input.value; // Update shopName with the input value
  }

  onPrimaryColorChange(event: string) {
    this.primaryColor = event;
  }

  onSecondaryColorChange(event: string) {
    this.secondaryColor = event;
  }


  private handleFiles(files: FileList): void {
    for (let i = 0; i < files.length; i++) {
      this.selectedFiles.push(files[i]);
      const file = files[i];
      const fileName = file.name; // Get the file name
      this.readFile(file, fileName); // Pass both file and file name to readFile

   //   const file = files[i];
   // const reader = new FileReader();

    // reader.onload = (e: any) => {
    //   const img = new Image();
    //   img.onload = () => {
    //     const canvas = document.createElement('canvas');
    //     const ctx = canvas.getContext('2d')!;
    //     canvas.width = 600;
    //     canvas.height = 800;
    //     ctx.drawImage(img, 0, 0, 600, 800);
    //     canvas.toBlob((blob) => {
    //       const resizedFile = new File([blob!], file.name, { type: 'image/jpeg', lastModified: Date.now() });
    //       // Now you can use `resizedFile` as the resized image
    //       this.selectedFiles.push(resizedFile);
    //     }, 'image/jpeg');
    //   };
    //   img.src = e.target.result;
    // };

    //reader.readAsDataURL(file);
    }
  }
  private readFile(file: File, fileName: string): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const fileContent = e.target.result;
      // Now you have both the file name and content, you can handle them as needed
      this.showSelectedFiles.push({ name: fileName, content: fileContent });
    };
    reader.readAsDataURL(file);
  }
  deselectImage(index: number): void {
    this.showSelectedFiles.splice(index, 1);
    this.selectedFiles.splice(index, 1);

  }
  // onFilesSelected(event: any) {
  //   const files: FileList = event.target.files;
  //   for (let i = 0; i < files.length; i++) {
  //     this.selectedFiles.push(files[i]);
  //   }
  // }

  

  openImagePicker() {
    // Trigger click event on the input element to open the file picker dialog
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.click();
    }
  }

  selectImage(index: number) {
    if (this.selectedIndex === index) {
      this.selectedIndex = -1; // Deselect if already selected
    } else {
      this.selectedIndex = index;
    }
  }


  openFileInput(): void {
    this.fileInput.nativeElement.click(); // Access nativeElement to trigger click event
  }

   findCategoryById(id: number) {
    for (let i = 0; i < Categories.length; i++) {
        if (Categories[i].id == id) {
            return Categories[i].category;
        }
    }
    return null; // Return null if no category with the given id is found
  }

  findSubCategoryId(id: number) {
    for (let i = 0; i < subCategories.length; i++) {
        if (subCategories[i].id == id) {
            return subCategories[i].subCategory;
        }
    }
    return null; // Return null if no category with the given id is found
  }

  findTypeId(id: number) {
    for (let i = 0; i < type.length; i++) {
        if (type[i].id == id) {
            return type[i].type;
        }
    }
    return null; // Return null if no category with the given id is found
  }



  async uploadProduct(): Promise<void> {
    // Step 1: Upload image to Firebase Storage
    this.spinner.show();
   let imageURLs : any [] = [];
   const promises = this.selectedFiles.map(async (img) => {
    const filePath = `product-images/${Date.now()}_${img.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, img);

    // Get the download URL of the uploaded image
    const imageUrl = await task.snapshotChanges().toPromise().then(async () => {
        return await fileRef.getDownloadURL().toPromise();
    }).catch(error => {
        console.error('Error uploading image:', error);
        throw error;
    });

    return imageUrl;
});
   // Wait for all promises to resolve
   const resolvedURLs = await Promise.all(promises);
   imageURLs.push(...resolvedURLs);


    // Step 3: Save product details to Firebase Firestore

    if (this.setupOption == 'catergories') {
      
      const productId = uuidv4();
      this.firestore.collection('products').doc(this.setupOption).collection(this.setupOption).doc(productId).set({
        title: this.title,
        category : this.findCategoryById(this.categoryId),
        imageUrl: imageURLs,
        productId : productId

      }).then(() => {
        this.spinner.hide();
        this.selectedFiles = [];
        this.showSelectedFiles = [];
        this.toastr.success(this.setupOption + 'details uploaded successfully.');
        console.log('Product details uploaded successfully.');
      }).catch(error => {
        this.spinner.hide();
        this.toastr.warning(error);
        console.error('Error uploading product details:', error);
      });

    } else if(this.setupOption == 'SliderShow') {
      // Inside your component:
      const productId = uuidv4();
      this.firestore.collection('products').doc(this.setupOption).collection(this.setupOption).doc(productId).set({
        title: this.title,
        subTitle: this.subTitle,
        specification: this.specification,
        colors: this.colors,
        category : this.findCategoryById(this.categoryId),
        contant: '',
        imageUrl: imageURLs,
        productId : productId

      }).then(() => {
        this.spinner.hide();
        this.selectedFiles = [];
        this.showSelectedFiles = [];
        this.toastr.success(this.setupOption + 'details uploaded successfully.');
        console.log('Product details uploaded successfully.');
      }).catch(error => {
        this.spinner.hide();
        this.toastr.warning(error);
        console.error('Error uploading product details:', error);
      });
    } else if(this.setupOption == 'product') {
      const productId = uuidv4();
      this.firestore.collection('products').doc(this.setupOption).collection(this.setupOption).doc(productId).set({
        title: this.title,
        subTitle: this.subTitle,
        specification: this.specification,
        colors: this.colors,
        label : this.label,
        size : this.size,
        description : this.description,
        price : this.price,
        category : this.findCategoryById(this.categoryId),
        subCategory: this.findSubCategoryId(this.subCategoryId),
        type: this.findTypeId(this.typeId),
        imageUrl: imageURLs,
        productId : productId

      }).then(() => {
        this.spinner.hide();
        this.selectedFiles = [];
        this.showSelectedFiles = [];
        this.toastr.success(this.setupOption + ' details uploaded successfully.');
        console.log('Product details uploaded successfully.');
      }).catch(error => {
        this.spinner.hide();
        this.toastr.warning(error);
        console.error('Error uploading product details:', error);
      });
    } else if(this.setupOption == 'themeColor') {
      const productId = uuidv4();
      this.firestore.collection('Theme').doc('Theme-colors').set({
        primaryColor: this.primaryColor,
        secondaryColor: this.secondaryColor

      }).then(async () => {
        let theme;
        const getThemePromise = new Promise<any[]>((resolve, reject) => {
          this.firestore.collection('Theme').valueChanges().subscribe({
            next: (data) => resolve(data as any[]),
            error: (err) => reject(err)
          });
        });
        theme = await getThemePromise;
        this.dataService.updateThemeColor(theme);
        document.documentElement.style.setProperty('--primary-color', this.dataService.getThemeColor()[0].primaryColor);
        document.documentElement.style.setProperty('--secondary-color', this.dataService.getThemeColor()[0].secondaryColor);
        this.spinner.hide();
    
      }).catch(error => {
        this.spinner.hide();
        this.toastr.warning(error);
        console.error('Error uploading product details:', error);
      });
    } else if(this.setupOption == 'shopName') {
      this.firestore.collection('ShopName').doc('Shop-Name').set({
        shopName: this.shopName,
        secondaryColor: this.secondaryColor

      }).then(async () => {
        let shopName;
        const getShopName = new Promise<any[]>((resolve, reject) => {
          this.firestore.collection('ShopName').valueChanges().subscribe({
            next: (data) => resolve(data as any[]),
            error: (err) => reject(err)
          });
        });
        shopName = await getShopName;
        this.dataService.shopName.next(shopName);
        this.spinner.hide();
    
      }).catch(error => {
        this.spinner.hide();
        this.toastr.warning(error);
        console.error('Error uploading product details:', error);
      });
    } else if(this.setupOption == 'contactDetails') {
      this.firestore.collection('contactDetail').doc('contactDetail').set({
        email : this.email,
        phoneNumber: this.phoneNumber,
        address: this.address,
        city: this.city,
        state: this.state,
        postalCode: this.postalCode,
        country: this.country

      }).then(async () => {
        let contactDetail;
        const contactDetails = new Promise<any[]>((resolve, reject) => {
          this.firestore.collection('contactDetail').valueChanges().subscribe({
            next: (data) => resolve(data as any[]),
            error: (err) => reject(err)
          });
        });
        contactDetail = await contactDetails;
        this.dataService.shopContactDetails$.next(contactDetail);

        this.spinner.hide();
    
      }).catch(error => {
        this.spinner.hide();
        this.toastr.warning(error);
        console.error('Error uploading product details:', error);
      });
    }
  } 
}
