import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import 'rxjs/Rx';

import 'rxjs/add/operator/catch';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ParentApiService {
  public options: any;

  public API_BASE_URL = 'http://localhost/prodms/backend/index.php/';

  constructor(private http: Http,
    private router: Router) {
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    this.options = new RequestOptions({ headers: headers });
  }


  GetCategory() {
    return this.http.get(this.API_BASE_URL + 'category/get', this.options)
      .pipe(map((res) => res.json(), (err) => err));
  }

  UpdateCategory(data) {
    return this.http.post(this.API_BASE_URL + 'category/update', data, this.options)
      .pipe(map((res) => res.json(), (err) => err));
  }

  DeleteCategory(data) {
    return this.http.post(this.API_BASE_URL + 'category/delete', data, this.options)
      .pipe(map((res) => res.json(), (err) => err));
  }

  CategoryListLevelWise(data) {
    return this.http.post(this.API_BASE_URL + 'product/category/list', data, this.options)
      .pipe(map((res) => res.json(), (err) => err));
  }

  ListProduct(data) {
    return this.http.post(this.API_BASE_URL + 'product/list', data, this.options)
      .pipe(map((res) => res.json(), (err) => err));
  }

  UpdateProduct(data) {
    return this.http.post(this.API_BASE_URL + 'product/update', data, this.options)
      .pipe(map((res) => res.json(), (err) => err));
  }

  DeleteProduct(data) {
    return this.http.post(this.API_BASE_URL + 'product/delete', data, this.options)
      .pipe(map((res) => res.json(), (err) => err));
  }

  ProductDetail(data){
    return this.http.post(this.API_BASE_URL + 'product/detail', data, this.options)
      .pipe(map((res) => res.json(), (err) => err));
  }

  SaveFile(formdata){
   
  }

}
