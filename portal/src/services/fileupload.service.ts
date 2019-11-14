import { Injectable } from '@angular/core';
import { Http , Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';


import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
 export class FileUploadService{
	 public options:any;

	 
	 public API_BASE_URL = 'http://localhost/prodms/backend/index.php/';
	 constructor (private http:Http){
	
		let headers = new Headers(/* { 'Content-Type': 'multipart/form-data' } */);
		this.options = new RequestOptions({ headers: headers });
		
	 }
	 /*------------FETCHING DATA FROM API........--------------*/
	

	
	SaveFile(formdata){

		return this.http.post(this.API_BASE_URL+ 'file/save',formdata,this.options).map((res)=>res.json(),(err)=>err);
		//  return this.http.post(ApiRouting.API_BASE_URL+ ApiRouting.put,formdata,this.options).map((res)=>res.json(),(err)=>err);
	 }

	
 }