import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { ActivatedRoute, Params, Router, Routes } from '@angular/router';
import { Iproduct } from '../../model/productinterface';
import { AuthServiceService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-singleproduct',
  templateUrl: './singleproduct.component.html',
  styleUrls: ['./singleproduct.component.scss']
})
export class SingleproductComponent implements OnInit {

  constructor(
    private service: ProductService,
    private route : Router,
    private routes :ActivatedRoute,
    public authService: AuthServiceService
  ) { }
productId!:string
product!:Iproduct
  ngOnInit(): void {
    // this.getSingleProduct(this.routes.snapshot.params['id']);
    this.getSingleProduct();
  }


  getSingleProduct(){
    // this.productId = id;
    // this.service.fetchproductById(id)
    // .subscribe({
    //   next:res=>{
    //     this.product=res;
    //     console.log(this.product);
    //     this.route.navigate([id])
    //   },
    //   error:err=>{
    //     console.log('the product is misssing in the database')
    //   }
    // })
    this.routes.params.subscribe((
      param:Params
    )=>{
      this.productId = param['id']
      this.service.fetchproductById(this.productId)
      .subscribe(res=>{
        this.product= res;
        console.log(res);
      })
    })

  }
  onEdit(id:string){
    if (this.authService.canEditproduct()) {
      this.route.navigate(['product',`${this.productId}`,'edit'])
    }

  }
  onRemove(id:string){
    if (!this.authService.canDeleteProduct()) {
      return;
    }

    this.service.onRemoveProduct(id)
      .subscribe(res=>{
        this.service.prodRemoveSubject$.next(id)
        this.route.navigate(['product'])
      })
    

  }

}
