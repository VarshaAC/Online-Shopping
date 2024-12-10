import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { DataService } from 'src/app/service/dataService/data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-shop-single',
  templateUrl: './shop-single.component.html',
  styleUrls: ['./shop-single.component.css']
})
export class ShopSingleComponent implements OnInit {

  slides: any[] = [];
  selectedImageSrc: string = "";
  selectedImageAlt: string = "";
  products: any[] = [];
  items: any = [];
  availableColors = [];
  selectedProduct: any;
  quantity: number = 1;
  productSize: string = '';
  selectedColor: string = '';
  productId = 'S';

  @ViewChild('targetElement', { static: true }) targetElement!: ElementRef;
  fromShopSingle = true;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
    
  ) {

  }

  ngOnInit(): void {
    this.getProductByParamId();
    this.updateSize('S');
    this.dataService.productsData.subscribe((products: any) => {
      if (products === null) return

      this.products = products;
    })
  
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Check if URL after redirects is defined
      if (event.urlAfterRedirects) {
        // Scroll to top of the page
        window.scrollTo(0, 0);
      }
    });


  }

  triggerProductByid(productId: string) {
    this.getProductByParamId(productId);
  }

  async getProductByParamId(productId?: string) {
    this.availableColors = [];
    if(productId) {
      this.productId = productId;
    } else {
      this.productId = this.route.snapshot.paramMap.get('id')!;
    }

    this.selectedProduct =  await this.dataService.getProductById(this.productId);
    this.availableColors = this.selectedProduct?.colors?.split("/");
    this.selectedColor = this.availableColors && this.availableColors?.length > 0 ? this.availableColors[0]: '' ;
    this.items = this.selectedProduct.imageUrl;
    this.generateSlides();
    this.selectedImageSrc = this.items[0];
    this.selectedImageAlt = this.items[0];
    this.scrollToElement();
    
  }


  updateQuantity(operator: string) {
    if(operator === '+' && this.quantity < 15) {
      this.quantity += 1;
    } else if( this.quantity > 1) {
      this.quantity -= 1;
    }
  }

  selectColor(color: string, product: any): void {
    this.selectedColor = color;
    product.color = color;
    console.log('Selected Color:', this.selectedColor);
  }
  
  navigateWithObjectToConfirmOrder() {
    this.selectedProduct.quantity = this.quantity;
    this.selectedProduct.size = this.productSize;
    this.selectedProduct.color = this.selectedColor;
    this.selectedProduct.image = this.selectedProduct.imageUrl[0];
    this.selectedProduct.name = this.selectedProduct.title;
    this.selectedProduct.id = this.selectedProduct.productId;

    const data = [this.selectedProduct];
    this.router.navigateByUrl('/confirm-order', { state: { data } });
  }

  updateSize(size: string) {
    this.productSize = size;
  }

  generateSlides() {
    this.slides = [];
    for (let i = 0; i < this.items.length; i += 3) {
      this.slides.push(this.items.slice(i, i + 3));
    }
  }

  updateSelectedImage(src: string, alt: string) {
    this.selectedImageSrc = src;
    this.selectedImageAlt = alt;
    this.scrollToElement();

  }

  scrollToElement() {
    this.targetElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
  
  navigateWithObject(product: any) {
    this.router.navigate(['/product',product.productId], {
      state: { objectData: product }
    });
  }

  async addProductTocard(product: any ) {
    product.size = this.productSize;
    product.quantity =  this.quantity;
    product.color = this.selectedColor;
    this.spinner.show();
    await this.dataService.addProduct(product);
    this.spinner.hide();

  }

}
