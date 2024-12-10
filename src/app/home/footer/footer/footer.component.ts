import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/service/dataService/data.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
   contactDetails: any;
   shopName: string = '';
  constructor(private dataSerive: DataService) { }

  ngOnInit(): void {
    this.dataSerive.shopContactDetails$.subscribe((data) => {
      if(data == null) return;
      this.contactDetails = data;
    });
    this.dataSerive.shopName.subscribe((data) => {
      if(data == null) return;
      this.shopName = data[0].shopName;
    })
  }

}
