<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Welcome extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        $this->load->model('ProdmsModel', 'mymodel');
    }

    // public function index()
    // {
    //     $this->load->view('welcome_message');
    // }

    public function getCategories()
    {

        $arr = $this->mymodel->getCategory();
        echo json_encode($arr);
    }

    public function UpdateCategories()
    {
        $data = json_decode($this->input->raw_input_stream, true);

        if ($data['id'] == -1) {
            $updArr = array(
                'cat_name' => $data['name'],
                'cat_parent' => $data['cat_parent'],
            );

        } else {
            $updArr = array(
                'cat_name' => $data['name'],
                'cat_parent' => $data['cat_parent'],
            );
        }
        $arr = $this->mymodel->UpdateCategory($updArr, $data['id']);

        echo json_encode($arr);
    }

    public function DeleteCategories()
    {

        $data = json_decode($this->input->raw_input_stream, true);
        $arr = $this->mymodel->DeleteCategory($data['id']);
        echo json_encode($arr);
    }

    public function CategoryLevelWise()
    {
        $data = json_decode($this->input->raw_input_stream, true);
        $arr = $this->mymodel->getCategoryLevelWise($data['level'], $data['id']);
        echo json_encode($arr);
    }

    public function ListProducts()
    {
        $data = json_decode($this->input->raw_input_stream, true);
        $arr = $this->mymodel->ListProduct();
        echo json_encode($arr);
    }

    public function DeleteProduct()
    {
        $data = json_decode($this->input->raw_input_stream, true);
        $arr = $this->mymodel->DeleteProduct($data['id']);
        echo json_encode($arr);
    }

    public function DetailProduct()
    {
        $data = json_decode($this->input->raw_input_stream, true);
        $arr = $this->mymodel->DetailProduct($data['prod_id']);
        echo json_encode($arr);
    }

    public function UpdateProduct()
    {
        $data = json_decode($this->input->raw_input_stream, true);
        $data['categories'] = [];

        array_push($data['categories'], ['cat_id' => $data['cat_basic'], 'level' => 1]);

        if (is_array($data['cat_level_one'])) {

            foreach ($data['cat_level_one'] as $k => $v) {
                array_push($data['categories'], ['cat_id' => $v, 'level' => 2]);
            }

        } else {
            array_push($data['categories'], ['cat_id' => $data['cat_level_one'], 'level' => 2]);
        }

        if (is_array($data['cat_level_two'])) {

            foreach ($data['cat_level_two'] as $k => $v) {
                array_push($data['categories'], ['cat_id' => $v, 'level' => 3]);
            }

        } else {
            array_push($data['categories'], ['cat_id' => $data['cat_level_two'], 'level' => 3]);
        }

        $arr = $this->mymodel->UpdateProduct($data, $data['id']);

        echo json_encode($arr);
    }

    public function SaveFile()
    {

//         $path='/var/www/html/prodms/backend/application/controllers../../../uploads/157364030671kJWxfZSlL._UY741_.jpg';

//         if(file_exists($path)){
//             echo "file exists";
//         }else{
//             echo "file doesnt exist";
//         }
// unlink('/var/www/html/prodms/backend/application/controllers../../../uploads/157364030671kJWxfZSlL._UY741_.jpg');
// exit;
        $dirpath = FCPATH . "uploads/";
       // if (!is_dir($dirpath)) {
          //  mkdir($dirpath, 0777, true);
        //}

	
        $ext = pathinfo($_FILES["file"]["name"], PATHINFO_EXTENSION);

        $filePath = $dirpath . time(). basename($_FILES["file"]["name"]);
        $filePathForSave = "uploads/" .time(). basename($_FILES["file"]["name"]);

			//echo "Moving new file to = ".$filePath;
        if (move_uploaded_file($_FILES["file"]["tmp_name"], $filePath)) {

            if (isset($_POST['product'])) {
                $path2 = $this->mymodel->deleteFile($_POST['product']);
                
                if($path2 != null) {
                 $dirpath2 = __DIR__ . "../../../";
                 
              //   echo "trying to delete old path = " .$dirpath2 . $path2 ;
                   unlink(FCPATH . $path2);
					}

                
            }
            echo json_encode(['type' => true, 'msg' => 'File uploaded', 'data' => $filePathForSave]);
        } else {
            echo json_encode(['type' => false, 'msg' => 'File Not uploaded', 'data' => '']);
        }

    }

    public function farmerProblem(){


        $plotArray=[];
        $containerArray=[];
        $maxsum = 0;
        $number_plots = 100;
        $number_of_children= 10;

        //initialized array of plots to be divided
        for($i=$number_plots; $i>=1; $i--){
            array_push($plotArray, $i);
            $maxsum += $i;
        }

        $t1 =1;
        //initialized empty baskets for all 10 children
        while($t1  <= $number_of_children){

            $containerArray[$t1] = [
                'plots' => [],
                'sum' => 0
            ];
            
            $t1++;
        }
       
        while(!empty($plotArray)){
            $t1 = 1;
            $containerArray[$t1] = array_shift($plotArray);
        }
    }
   
}
