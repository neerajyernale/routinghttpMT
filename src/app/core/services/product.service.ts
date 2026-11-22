import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Iproduct } from '../../shared/model/productinterface';
import { subscribe } from 'diagnostics_channel';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http: HttpClient
  ) { }
  readonly base_url = environment.product_url;
  readonly product_url = `${this.base_url}/products.json`;

updateProductSubject$:Subject<Iproduct> =  new Subject<Iproduct>();
productSubjext$: Subject<Iproduct> = new Subject<Iproduct>();
prodRemoveSubject$: Subject<string> =  new Subject<string>();
  fatchproducts():Observable<Iproduct[]>{
    return this.http.get<Iproduct[]>(this.product_url);
  }
  fetchproductById(id:string):Observable<Iproduct>{
      return this.http.get<Iproduct>(`${this.base_url}/products/${id}.json`)
  }

  createProduct(product:Iproduct):Observable<Iproduct>{
    return this.http.post<Iproduct>(`${this.base_url}/products.json`,product)
  }
  onUpdateProduct(updatePro:Iproduct):Observable<Iproduct>{
    return this.http.patch<Iproduct>(`${this.base_url}/products/${updatePro.id}.json`,updatePro);
  }
  onRemoveProduct(id:string):Observable<string>{
    return this.http.delete<string>(`${this.base_url}/products/${id}.json`)
  }
}
