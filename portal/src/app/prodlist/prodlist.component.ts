import { Component, OnInit } from '@angular/core';
import { ParentApiService } from '../../services/parent-api.service';

@Component({
  selector: 'app-prodlist',
  templateUrl: './prodlist.component.html',
  styleUrls: ['./prodlist.component.css']
})
export class ProdlistComponent implements OnInit {

  productList = [];
  view:string = 'table';
  constructor(public ApiSvc: ParentApiService) { 
  }

  ngOnInit() {

    this.fetchList();
  
  }

  fetchList(){

    this.ApiSvc.ListProduct({}).subscribe(
      (jsondata) => { if(jsondata.type == "true"){
          this.productList = jsondata.data;
          console.log(this.productList);
      }else{
          this.productList = [];
      } 
    },
      (err) => { console.log(err); }
    );
  }

  deleteFn(id){
   
    if(!confirm('Are you sure?')){
      return;
    }
    let data= { 'id' : id};
    this.ApiSvc.DeleteProduct(data).subscribe(
      (jsondata)=>{  
             alert(jsondata.msg);
             this.fetchList();
    
            },
            (err)=>
            { console.log(err); }
            );
  }


}
