import { Component, OnInit } from '@angular/core';
import { ParentApiService } from '../../services/parent-api.service';
import { FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-categoryms',
  templateUrl: './categoryms.component.html',
  styleUrls: ['./categoryms.component.css']
})
export class CategorymsComponent implements OnInit {
  newCatForm:FormGroup;
  editCatForm: FormGroup;
  
  edit = {
    is_editing : false,
    edit_id : -1,
    parent_id : -1
  }

  categoryList = [];
  catDropDown = [];
  new_category = false;

  constructor( public ApiSvc: ParentApiService, public FormB : FormBuilder) {

    this.newCatForm= FormB.group({
      parentCat: new FormControl(),
      newCat: new FormControl()	
    }); 

    this.editCatForm= FormB.group({
      catParent: new FormControl(),
      catName: new FormControl()	
    }); 

   }

  ngOnInit() {

    this.refreshcategory();
  }

  refreshcategory(){
    this.ApiSvc.GetCategory().subscribe(
      (jsondata) => { if(jsondata.type == "true"){
          this.categoryList = jsondata.data;
          this.catDropDown = this.CategoryArrayToList(this.categoryList);
      }else{
          this.categoryList = [];
      } 
    },
      (err) => { console.log(err); }
    );
  }

  managecat(obj){

    console.log(obj);
    this.edit.is_editing = true;
    this.edit.edit_id = obj.cat_id;
    this.edit.parent_id = obj.cat_parent;
    this.editCatForm.patchValue({catName:obj.cat_name});
    this.editCatForm.controls['catParent'].setValue(obj.cat_parent, {onlySelf: true});

  }

  AddCat(){
    this.edit = {
      is_editing : false,
      edit_id : -1,
      parent_id : -1
    }

    this.new_category = true;

    this.newCatForm.reset();

  }
  NewCat(form){


    let formData = {};
    if(this.edit.is_editing){


    if(form.value.catName == null){
      alert('Name is required');
      return;
    }

       formData = {
        'id' : this.edit.edit_id,
        'name' : form.value.catName,
        'cat_parent' : form.value.catParent
      };

    }else{


    if(form.value.newCat == null){
      alert('Name is required');
      return;
    }

       formData = {
        'id' : -1,
        'name' : form.value.newCat,
        'cat_parent' : form.value.parentCat
      };
    }

    this.ApiSvc.UpdateCategory(formData).subscribe(
      (jsondata)=>{  
           
              alert(jsondata.msg);
              this.refreshcategory();

              this.edit = {
                is_editing : false,
                edit_id : -1,
                parent_id : -1
              }
          
              this.new_category = false;

            },
            (err)=>
            { console.log(err); }
            );

  }

  deleteFn(id){
   
    if(!confirm('Are you sure?')){
      return;
    }
    let data= { 'id' : id};

    this.ApiSvc.DeleteCategory(data).subscribe(
      (jsondata)=>{  
             alert(jsondata.msg)
             this.refreshcategory();

             this.edit = {
              is_editing : false,
              edit_id : -1,
              parent_id : -1
            }
        
            this.new_category = false;
            },
            (err)=>
            { console.log(err); }
            );
  
  }

  CategoryArrayToList(id){
    let catDropDown = [];
   // console.log(this.categoryList);
      for(let p of this.categoryList){
          catDropDown.push({ 'id': p.cat_id , 'name': p.cat_name});
        for(let s of p.sub_cat){
          catDropDown.push({ 'id': s.cat_id , 'name': s.cat_name});
          for(let ss of s.sub_sub_cat){
            catDropDown.push({ 'id': ss.cat_id , 'name': ss.cat_name});
          }
        }
      }
      return catDropDown;
  }


}
