import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { AuthServiceService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
productArr: any[] = [];
  constructor(
    private service : ProductService,
    private authServicec : AuthServiceService
  ) { }

  ngOnInit(): void {
   this.getProducts();
   this.service.productSubjext$.subscribe(res=>{
    if(res){

      this.productArr.push(res);
    }
   })
   this.service.updateProductSubject$.subscribe(res=>{
    if(res){
      let getIndex =  this.productArr.findIndex(u=>u.id===res.id);
      this.productArr[getIndex]=res;
    }
   })
   this.service.prodRemoveSubject$.subscribe(res=>{
    if(res){
      let getIndex =  this.productArr.findIndex(r=>r.id===res);
      this.productArr.splice(getIndex,1);
    }
   })
  }
  getProducts(){
    this.service.fatchproducts()
    .subscribe({
      next:res=>{
        for (const key in res) {
          this.productArr.push({ ...res[key], id:key})
        }
      }
    })
  }
  canAdd():boolean{
    return this.authServicec.canAddProduct();
  }
  canEdit():boolean{
    return this.authServicec.canEditproduct();
  }
  canDelete():boolean{
    return this.authServicec.canDeleteProduct();
  }

}
