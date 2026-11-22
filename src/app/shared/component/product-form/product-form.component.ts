import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { Iproduct } from '../../model/productinterface';
import { BlockList } from 'net';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
editId!:String
  constructor(
    private service: ProductService,
    private router :ActivatedRoute,
    private routes : Router
    ) { }
isInEditMode:boolean=false;
  ngOnInit(): void {
    this.createForm();

    this.router.paramMap.subscribe(res=>{
      const id = res.get('id');
      if(id){
        this.isInEditMode=true;
        this.service.fetchproductById(id)
        .subscribe(res=>{
          this.editId=id
          this.productForm.patchValue(res);
        })
      }
    })
  }

  productForm!:FormGroup
  productId!:String

  canDeactivate(): boolean {
    if (!this.productForm.dirty) {
      return true;
    }

    return window.confirm('Discard unsaved product changes?');
  }


  createForm(){
    this.productForm =  new FormGroup({
      name: new FormControl(null,Validators.required),
      image: new FormControl(null,Validators.required),
      inStock : new FormControl(null,Validators.required),
      category: new FormControl(null,Validators.required),
      price: new FormControl(null,Validators.required),
      rating: new FormControl(null,Validators.required)
    })
  }
  onAdd(){
    let newObj:Iproduct =  {...this.productForm.value};
    this.service.createProduct(newObj).subscribe(res=>{
      this.productForm.markAsPristine();
      this.routes.navigate(['product'])
      console.log(res)
      newObj.id = res.name
      this.service.productSubjext$.next(newObj);
    })

  }
  onUpdate(){
    let updateObj = {...this.productForm.value,id:this.editId};
    this.service.onUpdateProduct(updateObj)
    .subscribe(res=>{
      this.productForm.markAsPristine();
      this.routes.navigate(['product']);
      this.service.updateProductSubject$.next(updateObj);
      console.log(res);
    })
    

  }

}
