import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, finalize, firstValueFrom, map } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Filter } from 'src/app/Model/x-mart.model';

export enum Category {
  Men = 1,
  Women = 2,
  Accessories = 3,
  Shoe = 4
}
@Injectable({
  providedIn: 'root'
})

export class DataService {

  // Declare and initialize the BehaviorSubject
  public mainSliderData = new BehaviorSubject<any>(null);
  public categoryData = new BehaviorSubject<any>(null);
  public productsData = new BehaviorSubject<any>(null);
  public themeColor = new BehaviorSubject<any>(null);
  public currentUser = new BehaviorSubject<any>(null);

  public shopName = new BehaviorSubject<any>(null);

  public shopContactDetails$ = new BehaviorSubject<any>(null);


  public loadingIndicator = new BehaviorSubject<boolean>(false);

  private mainSliderDataCache: any[] = [];
  private categoriesDataCache: any[] = [];
  private productsDataCache: any[] = [];

  public lastDoc = new BehaviorSubject<any>(null);
  public hasMore = new BehaviorSubject<boolean>(true);
  public limit = new BehaviorSubject<number>(8);
  public filter = new BehaviorSubject<any>(null);
  public filterFromSidePanel = new BehaviorSubject<any>(null);



  public lastDocMain = new BehaviorSubject<any>(null);
  public hasMoreMain = new BehaviorSubject<boolean>(true);
  public limitMain = new BehaviorSubject<number>(8);
  public filterMain = new BehaviorSubject<any>(null);
  public productsDataMainList = new BehaviorSubject<any>(null);


  public lastDocFilter = new BehaviorSubject<any>(null);
  public hasMoreFilter = new BehaviorSubject<boolean>(true);
  public limitFilter = new BehaviorSubject<number>(8);
  public filterFilter = new BehaviorSubject<any>(null);
  public productsDataFilterList = new BehaviorSubject<any>(null);




  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ) {
    // The constructor should not contain logic for initializing or updating the BehaviorSubject.
  }

  // Method to update the BehaviorSubject
  updateMainSliderData(newData: any) {
    this.mainSliderData.next(newData);
  }

  updateThemeColor(newData: any) {
    this.themeColor.next(newData);
  }

  updatecategoryData(newData: any) {
    this.categoryData.next(newData);
  }

  updateProductsData(newData: any) {
    this.productsData.next(newData);
  }

  updateShopName(newData: any) {
    this.shopName.next(newData);
  }

  updateLoadingIndicator(isLoading: boolean) {
    this.loadingIndicator.next(isLoading);
  }

  getMainSliderData(): any[] {
    const cachedData = localStorage.getItem('mainShowData');
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    return []; // Return an empty array if no data is cached
  }


  getCategoryData(): any[] {
    const cachedData = localStorage.getItem('categoriesData');
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    return [];
  }

  getThemeColor() {
    return this.themeColor.value;
  }

  getShopName() {
    return this.shopName.value;
  }


  getProductsData(): any[] {
    const cachedData = localStorage.getItem('Products');
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    return [];
  }

  clearCache(): void {
    this.mainSliderDataCache = [];
    this.categoriesDataCache = [];
    this.productsDataCache = [];
  }



  async getShopContact() {
    this.spinner.show(); // Show loader
    try {
      const contactDetail = this.firestore
        .collection('contactDetail').doc('contactDetail')
        .valueChanges();

      return await firstValueFrom(contactDetail); // Wait for the data

    } catch (error) {
      this.toastr.success('my orders get faild');
      return [];
    } finally {
      this.spinner.hide(); // Hide loader
    }
  }

  // Function to store product details with error handling
  async addProduct(product: any): Promise<void> {
    this.spinner.show();
    try {
      const user = await this.afAuth.currentUser; // Check if user is logged in

      if (user) {
        // If user is logged in, store product in Firebase Firestore
        const productId = this.firestore.createId(); // Create a unique ID for the product
        await this.firestore.collection('customerAddedProductToCard').doc(user.uid).collection('product').doc(product.productId).set({
          id: product.productId,
          image: product.imageUrl[0],
          name: product.title,
          price: product.price,
          size: product.size,
          quantity: product.quantity,
          label: product.label,
          color: product.color,
          category: product.category,
          description: product.description,
          userId: user.uid,
          createdAt: new Date()
        });
        this.spinner.hide();
        console.log('Product successfully added to Firestore');
        this.toastr.success('Product successfully added to Card');

      } else {
        // If user is not logged in, store product in localStorage
        this.storeProductInLocalStorage(product);
        console.log('Product stored in local storage');
        this.toastr.success('Product successfully added to Card');
        this.spinner.hide();

      }

    } catch (error) {
      // Handle any errors that occur
      console.error('Error adding product:', error);
      console.log('Product stored in local storage');
      this.toastr.warning('Product added to Card faild');

      this.spinner.hide();

      // Optionally, you can show an error message to the user
      // this.toastr.error('Failed to add product. Please try again later.');
    }
  }

  getUSerData() {
    return this.currentUser.value;
  }

  // Helper function to store product in localStorage
  private storeProductInLocalStorage(product: any): void {
    const productId = this.firestore.createId();
    let storedProducts = JSON.parse(localStorage.getItem('storedProducts') || '[]');
    storedProducts.push({
      id: product.productId,
      image: product.imageUrl[0],
      name: product.title,
      price: product.price,
      size: product.size,
      quantity: product.quantity,
      label: product.label,
      color: product.color,
      category: product.category,
      description: product.description,
      createdAt: new Date()
    });
    localStorage.setItem('storedProducts', JSON.stringify(storedProducts));
  }

  // Function to sync localStorage products to Firebase after login with error handling
  async syncLocalStorageToFirebase(): Promise<void> {
    this.spinner.show();

    try {
      const user = await this.afAuth.currentUser; // Ensure user is logged in

      if (user && this.getUSerData() && !this.getUSerData().isAdmin) {
        // Get the stored products from localStorage
        const storedProducts = JSON.parse(localStorage.getItem('storedProducts') || '[]');

        if (storedProducts && storedProducts.length > 0) {
          // Sync each product to Firebase
          for (const product of storedProducts) {
            // const productId = this.firestore.createId(); // Generate a unique ID for each product

            // Ensure that we are fetching fresh data from the server, not cache
            const productDocRef = this.firestore.collection('customerAddedProductToCard')
              .doc(user.uid)
              .collection('product')
              .doc(product.id);

            // Convert Observable to Promise and ensure fresh data from server
            const productSnapshot = await firstValueFrom(productDocRef.get({ source: 'server' })); // Convert Observable to Promise

            if (!productSnapshot.exists) {  // `exists` is available on DocumentSnapshot
              // Add product to Firestore if it doesn't exist
              await productDocRef.set({
                id: product.id,
                image: product.image,
                name: product.name,
                price: product.price,
                size: product.size,
                quantity: product.quantity,
                label: product.label,
                color: product.color,
                category: product.category,
                description: product.description,
                userId: user.uid
              });
            }
          }

          // Clear localStorage after syncing
          localStorage.removeItem('storedProducts');
          console.log('Products synced successfully to Firebase');
          this.toastr.success('Product successfully added to Card');
          this.spinner.hide();

        } else {
          this.spinner.hide();
        }
      } else if (!user) {
        this.toastr.warning('Product added to Card failed');
        this.spinner.hide();

        throw new Error('User is not logged in'); // Error if user is not logged in

      } else {
        this.spinner.hide();
      }
    } catch (error) {
      // Handle any errors that occur during the sync process
      console.error('Error syncing localStorage to Firebase:', error);
      this.toastr.warning('Product added to Card failed');
      this.spinner.hide();
    }
  }

  getProducts(
    limit: number,
    lastDoc?: any,
    filters?: Record<string, any>,
    component?: string
  ): Observable<any[]> {
    this.spinner.show(); // Show loader
  
    // Helper function to handle component-specific logic
    const handleComponentLogic = (productsSnapshot: any, component: string) => {
      const products = productsSnapshot.docs.map((doc: any) => doc.data());
      const hasMoreSubject = this.getComponentHasMoreSubject(component);
      const lastDocSubject = this.getComponentLastDocSubject(component);
  
      if (productsSnapshot.docs.length > 0) {
        lastDoc = productsSnapshot.docs[productsSnapshot.docs.length - 1];
        hasMoreSubject.next(true);
      } else {
        lastDoc = null;
        hasMoreSubject.next(false);
        this.toastr.info('No more products to load'); // Notify user
      }
  
      lastDocSubject.next(lastDoc);
      return products;
    };
  
    // Main Firestore query setup
    return this.firestore
      .collection('products')
      .doc('product')
      .collection('product', (ref) => {
        let queryRef = ref.limit(limit);
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== '') {
              queryRef = queryRef.where(key, '==', value);
            }
          });
        }
        if (lastDoc) {
          queryRef = queryRef.startAfter(lastDoc);
        }
        return queryRef;
      })
      .get({ source: 'server' })
      .pipe(
        map((productsSnapshot: any) => {
          if (component) {
            return handleComponentLogic(productsSnapshot, component);
          }
          return productsSnapshot.docs.map((doc: any) => doc.data());
        }),
        catchError((error: Error) => {
          this.toastr.error('Failed to load products');
          throw error;
        }),
        finalize(() => {
          this.spinner.hide(); // Ensure spinner is hidden
        })
      );
  }
  
  // Helper method to get the correct subject for "hasMore"
  private getComponentHasMoreSubject(component: string): BehaviorSubject<boolean> {
    switch (component) {
      case 'Main':
        return this.hasMoreMain;
      case 'Product-List':
        return this.hasMore;
      case 'Filter-List':
        return this.hasMoreFilter;
      default:
        throw new Error('Invalid component');
    }
  }
  
  // Helper method to get the correct subject for "lastDoc"
  private getComponentLastDocSubject(component: string): BehaviorSubject<any> {
    switch (component) {
      case 'Main':
        return this.lastDocMain;
      case 'Product-List':
        return this.lastDoc;
      case 'Filter-List':
        return this.lastDocFilter;
      default:
        throw new Error('Invalid component');
    }
  }
  


  async getOrdersByUserId(userId: string) {
    this.spinner.show(); // Show loader
    try {

      const productsObservable = this.firestore
        .collection('customerOrder', (ref: any) => ref.where('userId', '==', userId))
        .get({ source: 'server' }); // Ensure data is retrieved from the server

      // Use firstValueFrom to convert observable to a promise and fetch data
      const orderSnapshot = await firstValueFrom(productsObservable);
      const orders = orderSnapshot.docs.map(doc => doc.data()); // Map snapshot to an array of product data

      this.spinner.hide();

      return orders
    } catch (error) {
      this.toastr.success('my orders get faild');
      return [];
    } finally {
      this.spinner.hide(); // Hide loader
    }
  }

  async updateOrder(orderData: any) {
    // Update the order in 'customerOrder' collection
    this.spinner.show();

    try {
      await this.firestore.collection('customerOrder').doc(orderData.orderId).set({
        card: orderData.cardItems,
        customerDetails: orderData.customerDetails,
        paymentMethod: orderData.paymentMethod,
        orderId: orderData.orderId,
        userId: orderData.userId,
        createdAt: orderData.createdAt,
      });

      // Save updated order to 'orders' collection
      await this.firestore.collection('orders').doc(orderData.orderId).set({
        cardItems: orderData.cardItems,
        customerDetails: orderData.customerDetails,
        paymentMethod: orderData.paymentMethod,
        orderId: orderData.orderId,
        userId: orderData.userId,
        createdAt: orderData.createdAt,
      });
      this.spinner.hide();

    } catch (error) {
      this.spinner.hide();
      console.error('Error storing order:', error);

      throw new Error('Failed to store the order. Please try again.'); // Optionally rethrow the error
    }

  }

  async storeOdersForAdmin(orderData: any, card: any, user: any, orderId?: any) {
    this.spinner.show();
    try {
      // Save order to 'customerOrder' collection
      await this.firestore.collection('customerOrder').doc(orderId).set({
        card: card,
        customerDetails: orderData.customer,
        paymentMethod: orderData.paymentMethod,
        orderId: orderId,
        userId: user ? user.uid : 0,
        createdAt: new Date(),
      });

      // Save order to 'orders' collection
      await this.firestore.collection('orders').doc(orderId).set({
        orderId: orderId,
        userId: user ? user.uid : 0,
        cardItems: card,
        customerDetails: orderData.customer,
        paymentMethod: orderData.paymentMethod,
        createdAt: new Date(),
      });
      this.spinner.hide();

      //this.setEmailTocustomer(orderId, orderData.customer, card);
    } catch (error) {
      this.spinner.hide();

      console.error('Error storing order:', error);
      throw new Error('Failed to store the order. Please try again.'); // Optionally rethrow the error
    }
  }


  async storeOrders(orderData: any): Promise<void> {
    this.spinner.show();

    try {
      const user = await this.afAuth.currentUser; // Ensure user is logged in

      if (user && this.getUSerData() && !this.getUSerData().isAdmin) {


        const orderId = this.firestore.createId(); // Create a unique ID for the product

        this.storeOdersForAdmin(orderData, orderData.cart, user, orderId);




        orderData.cart.forEach((card: any) => {
          if (card == null) return;
          this.deleteProductFromCard(card);
        });
        this.spinner.hide();

        this.toastr.success('Your order is confirmed!');

      } else {
        const orderId = this.firestore.createId(); // Create a unique ID for the product

        this.storeOdersForAdmin(orderData, orderData.cart, null, orderId);




        orderData.cart.forEach((card: any) => {
          if (card == null) return;
          this.deleteProductFromCard(card);
        });
        this.spinner.hide();

        this.toastr.success('Your order is confirmed!');
      }
    } catch (error) {
      // Handle any errors that occur during the sync process
      console.error('Error syncing localStorage to Firebase:', error);
      this.toastr.warning('order save failed');
      this.spinner.hide();
    }
  }

  // Function to get customer card products with error handling
  async getOrders(): Promise<any[]> {
    this.spinner.show();

    try {
      const user = await this.afAuth.currentUser; // Ensure the user is logged in


      // Fetch products from Firestore, ensuring the data is retrieved from the server only
      const productsObservable = this.firestore
        .collection('orders')
        .get({ source: 'server' }); // Ensure data is retrieved from the server

      // Use firstValueFrom to convert observable to a promise and fetch data
      const orderSnapshot = await firstValueFrom(productsObservable);
      const orders = orderSnapshot.docs.map(doc => doc.data()); // Map snapshot to an array of product data

      this.spinner.hide();
      return orders || []; // Return the products or an empty array if none are found



    } catch (error) {
      this.spinner.hide();
      return []; // Return an empty array in case of any other error
    }
  }

  // Function to get customer card products with error handling
  async getCustomerCardProducts(user?: any): Promise<any[]> {
    this.spinner.show();

    try {


      if (user) {
        // Fetch products from Firestore, ensuring the data is retrieved from the server only
        const productsObservable = this.firestore
          .collection('customerAddedProductToCard')
          .doc(user.uid)
          .collection('product')
          .get({ source: 'server' }); // Ensure data is retrieved from the server

        // Use firstValueFrom to convert observable to a promise and fetch data
        const productsSnapshot = await firstValueFrom(productsObservable);
        const products = productsSnapshot.docs.map(doc => doc.data()); // Map snapshot to an array of product data

        this.spinner.hide();
        return products || []; // Return the products or an empty array if none are found

      } else {
        const cartItems = JSON.parse(localStorage.getItem('storedProducts') || '[]');
        if (cartItems && cartItems.length > 0) {
          this.spinner.hide();
          return cartItems
        }

        this.spinner.hide();
        console.warn('User is not logged in');
        return []; // Return an empty array if the user is not logged in
      }
    } catch (error) {
      this.spinner.hide();
      return []; // Return an empty array in case of any other error
    }
  }

  async getProductById(productId: string): Promise<any> {
    this.spinner.show();

    try {
      // Convert the observable to a promise
      const product = await firstValueFrom(
        this.firestore.collection('products').doc('product').collection('product').doc(productId).valueChanges()
      );

      this.spinner.hide();
      return product;

    } catch (error) {
      this.toastr.warning('Product added to cart failed');
      this.spinner.hide();
      return null;
    }
  }

  async getOrderById(orderId: string): Promise<any> {
    this.spinner.show();

    try {
      // Convert the observable to a promise
      const order = await firstValueFrom(
        this.firestore.collection('orders').doc(orderId).valueChanges()
      );

      this.spinner.hide();
      return order;

    } catch (error) {
      console.error('Error fetching product:', error);
      this.toastr.warning('order get failed');
      this.spinner.hide();
      return null;
    }
  }




  // Function to delete product from cart with error handling
  async deleteProductFromCard(product: any): Promise<void> {
    this.spinner.show();

    try {
      const user = await this.afAuth.currentUser;

      if (user) {
        // Delete the product from Firestore
        await this.firestore.collection('customerAddedProductToCard')
          .doc(user.uid)
          .collection('product')
          .doc(product.id)
          .delete();

        console.log(`Product with ID ${product.productId} deleted from Firestore.`);
        if (user && this.getUSerData() && this.getUSerData().isAdmin) {
          this.toastr.success('Product successfully deleted');
        }
        this.spinner.hide();


      } else {
        // If user is not logged in, delete from local storage
        const cartItems = JSON.parse(localStorage.getItem('storedProducts') || '[]');
        this.toastr.success('Product successfully deleted');
        // Filter out the product to be deleted
        const updatedCartItems = cartItems.filter((item: { id: string }) => item.id !== product.id);

        // Save the updated cart back to local storage
        localStorage.setItem('storedProducts', JSON.stringify(updatedCartItems));
        this.spinner.hide();

      }

    } catch (error) {
      this.toastr.warning('Product  delete faild');
      this.spinner.hide();

    }
  }




  async fetchCategoriesData(collection: string): Promise<any[]> {
    let productData: any[] = [];
    this.spinner.show();

    try {
      productData = await firstValueFrom(
        this.firestore
          .collection('products')
          .doc(collection)
          .collection(collection)
          .valueChanges()
      );

      this.spinner.hide();
      return productData;
    } catch (error) {
      this.toastr.warning('Failed to load categories data');
      this.spinner.hide();
      return [];
    }
  }




  handleDeleteByAdmin(collection1: string, collection2: string, productId: string, products: any[], index: number) {
    this.firestore.collection(collection1).doc(collection2).collection(collection2).doc(productId).delete()
      .then(async () => {
        if (collection2 == "product") {
          products.splice(index, 1);
          this.productsData.next(products)
        } else if (collection2 == "catergories") {
          const categories = await this.fetchCategoriesData(collection2);
          this.mainSliderData.next(categories)
        } else if (collection2 == "SliderShow") {
          const sliders = await this.fetchCategoriesData(collection2);
          this.mainSliderData.next(sliders)
        }
        this.toastr.success(' product deleted successfully.');
      })
      .catch((error) => {
        this.toastr.warning(error);
      });
  }


}
