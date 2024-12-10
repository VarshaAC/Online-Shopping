import { Component, OnInit } from '@angular/core';
import { Filter } from '../Model/x-mart.model';
import { DataService } from '../service/dataService/data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  activeCategory: string | null = 'all';
  activeSubCategory: any | null = null;
  activeType: any | null = null;
  isMenCategoryClicked: boolean = false;
  isWomenCategoryClicked: boolean = false;
  filter = new Filter();
  // Define the type for subcategories and items
  subCategories: { name: string; image: string; key: string }[] = [
    { name: 'Casual', image: 'assets/img/feature_prod_03.jpg', key: 'casual' },
    { name: 'Formal', image: 'assets/img/feature_prod_03.jpg', key: 'formal' },
  ];

  items: { name: string; image: string }[] = []; // Initialize as an empty array

  allItems: any = {
    casual: [
      { name: 'T-shirt', image: 'assets/img/feature_prod_03.jpg' },
      { name: 'Shirt', image: 'assets/img/feature_prod_03.jpg' },
      { name: 'Denim', image: 'assets/img/feature_prod_03.jpg' },
    ],
    formal: [
      { name: 'Suit', image: 'assets/img/feature_prod_03.jpg' },
      { name: 'Blazer', image: 'assets/img/feature_prod_03.jpg' },
      { name: 'Shirt', image: 'assets/img/feature_prod_03.jpg' },
    ],
  };
  constructor(
    private dataService: DataService,
    private router: Router
  ) { 
    this.getFilter();
  }

  ngOnInit(): void {
  }

  getFilter() {
    this.dataService.filterFromSidePanel.subscribe((data) => {
      if(data == null) return;
      this.selectCategory(data.category);
      this.selectSubCategory(this.subCategories.find((sub) => sub.name.toLowerCase() == data.subCategory ));
      this.selectType( this.items.find((item) => item.name.toLowerCase() == data.type));
      this.getProductsData(); 

    })
  }
  // Select category
  selectCategory(category: string): void {
    this.isWomenCategoryClicked = category === 'women';
    this.isMenCategoryClicked = category === 'men';
    this.activeCategory = category;
    this.activeSubCategory = null; // Reset subcategory
    this.filter.category = category;
    if(category == 'all') {
      this.filter.category = '';
    }
    this.filter.subCategory = '';
    this.filter.type = '';
    this.dataService.filter.next(this.filter);
    this.getProductsData();
  }


  // Select subcategory
  selectSubCategory(subCategory: any) {
    this.activeSubCategory = subCategory.key;
    this.items = this.allItems[subCategory.key]; // Load items for selected subcategory
    this.filter.subCategory = subCategory.key;
    this.dataService.filter.next(this.filter);
    this.getProductsData();
  }

  selectType(type: any) {
    this.activeType = type;
    this.filter.type = type.name.toLowerCase();
    this.dataService.filter.next(this.filter);
    this.getProductsData();
  }

  getProductsData(comnent?: string) {
    let component;
    if(comnent) {
      component = comnent;
    }
    const currentUrl = this.router.url; // Get the current URL
    if (currentUrl.includes('shop')) {
      component = "Product-List"
    } else  if (currentUrl.includes('home')) {
      component = "Main"
    } 
    this.dataService.getProducts(8, null, this.filter, component).subscribe((data) => {
      if(data == null) return;

      if (currentUrl.includes('shop')) {
        this.dataService.productsData.next(data);

      } else  if (currentUrl.includes('home')) {
        this.dataService.productsDataMainList.next(data);

      } else {
        this.dataService.productsDataFilterList.next(data);
      }
    });
  }

} 
