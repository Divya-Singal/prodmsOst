import { Component, OnInit } from '@angular/core';
import { ParentApiService } from '../../services/parent-api.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router'
import { FileUploadService } from '../../services/fileupload.service';
import { ViewChild , ElementRef} from '@angular/core';

@Component({
  selector: 'app-productms',
  templateUrl: './productms.component.html',
  styleUrls: ['./productms.component.css']
})



export class ProductmsComponent implements OnInit {

  @ViewChild('myInput', {static: false}) myInputVariable: ElementRef;

  productForm: FormGroup;

  edit = {
    is_editing: false,
    product_id: -1
  }
  filepath: '';

  categories = {
    basic: [],
    level_one: [],
    level_two: []
  };

  constructor(public ApiSvc: ParentApiService, public FormB: FormBuilder,
      public route:ActivatedRoute, public fileSvc: FileUploadService) {

    this.productForm = FormB.group({
      product_name: new FormControl(),
      product_desc: new FormControl(''),
      product_price: new FormControl(0),
      cat_basic : new FormControl(),
      cat_level_one : new FormControl(),
      cat_level_two :new FormControl()
    });

  }

  ngOnInit() {

    this.route.params.subscribe(params => {

      if(Object.getOwnPropertyNames(params).length > 0){
        this.edit.product_id = params['id'];
        this.edit.is_editing = true;
      
        this.initializeForEdit();
      }else{
       
      }
      });
     

     this.fetchCategories('one', -1);

  }

  updateCatsOnLevel(level){

    if(level == 'two'){
      this.fetchCategories(level, this.productForm.value.cat_basic);
    }else if(level == 'three'){
      this.fetchCategories(level, this.productForm.value.cat_level_one);
    }
   
  }

  fetchCategories(level, parent_id) {

    let data= { 'level': level, 'id': parent_id };
    

    this.ApiSvc.CategoryListLevelWise(data).subscribe(
      (jsondata) => {

        switch(level){
          case 'one' : { this.categories.basic = jsondata.data; break;}
          case 'two' : { this.categories.level_one = jsondata.data; break; }
          case 'three': { this.categories.level_two = jsondata.data; break;}
        }

      
       
      },
      (err) => { console.log(err); }
    );

  
  }


  UpdateProduct(ProductForm) {

    if(this.productForm.value.product_name == null){
      alert('Name is required');
      return;
    }

    if(this.productForm.value.cat_basic == null){
      alert('Select Atleast 1 category');
      return;
    }

   let data = this.productForm.value;
   data.id = this.edit.product_id;
   if(this.filepath != ''){
      data.filepath = this.filepath;
   }
   
    this.ApiSvc.UpdateProduct(data).subscribe(
      (jsondata) => {
        alert(jsondata.msg);
        this.productForm.reset();
        this.categories.level_one = [];
        this.categories.level_two = [];
        this.myInputVariable.nativeElement.value = "";
      },
      (err) => { console.log(err); }
    );

  }

  initializeForEdit(){

    this.ApiSvc.ProductDetail({'prod_id':this.edit.product_id}).subscribe(
      (jsondata) => {
        var detail = jsondata.data;

        this.productForm.patchValue({
          product_name: detail.prod_name,
          product_desc: detail.prod_description,
          product_price : detail.prod_price
        });
        this.productForm.controls['cat_basic'].setValue(detail.cat_basic[0], {onlySelf: true});
        this.fetchCategories('two',detail.cat_basic);
        
        this.fetchCategories('three',detail.cat_level_one);

        this.productForm.controls['cat_level_one'].setValue(detail.cat_level_one, {onlySelf: true});
        this.productForm.controls['cat_level_two'].setValue(detail.cat_level_two, {onlySelf: true});
      },
      (err) => { console.log(err); }
    );

  }
 
  upload(files: File[], type){ 
  
   
	  let fileArr= Array.from(files);
	  this.postToServer(0,fileArr,type);
  }

  postToServer(fileindex,fileArr,type)
  {
	    
	  var formData= new FormData();
	  if(fileArr[fileindex])
	  {
			formData.append('file',fileArr[fileindex]);
				
      formData.append('filecategory',type);
			
			//APPENDING ID FOR EDIT CASE
			if(this.edit.is_editing)
			{
        var str = String(this.edit.product_id);
				formData.append('product',str);
			}
			
			this.fileSvc.SaveFile(formData).subscribe(
			  (jsondata)=> { 
							
								this.filepath=jsondata.data;
							},
			  (err)=> { console.log(err) }); 
	  }
	  else
	  {
			  console.log('no file for upload');
	  }
		  
  }

}
