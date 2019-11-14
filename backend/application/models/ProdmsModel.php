<?php

class ProdmsModel extends CI_Model
{

    public function __construct()
    {
        $this->load->database();
        $this->load->helper('url');
    }

    public function getCategory()
    {
        $this->db->select('c1.cat_id, c1.cat_name, c1.cat_parent, c2.cat_name as parent_name');
        $this->db->from('category as c1')
            ->join('category as c2', 'c1.cat_parent = c2.cat_id', 'left')
            ->where('c1.cat_parent', 0)
            ->or_where('c1.cat_parent', null);
        $query = $this->db->get()->result_array();
        if ($query) {

            foreach ($query as $k => &$v) {
                $v['sub_cat'] = $this->getSubCategories($v['cat_id']);
            }

            $arr = [
                'type' => 'true',
                'msg' => 'Data found',
                'data' => $query, //,
                //  'orderedArray' => $orderedArray
            ];

        } else {
            $arr = [
                'type' => 'false',
                'msg' => 'No Data found',
                'data' => [], //,
                // 'orderedArray' => $orderedArray
            ];
        }

        return $arr;
    }

    public function getSubCategories($id)
    {

        $this->db->select('c1.cat_id, c1.cat_name, c1.cat_parent, c2.cat_name as parent_name');
        $this->db->from('category as c1')
            ->join('category as c2', 'c1.cat_parent = c2.cat_id', 'left')
            ->where('c1.cat_parent', $id);
        $res = $this->db->get()->result_array();
        if ($res) {
            foreach ($res as $k => &$v) {
                $v['sub_sub_cat'] = $this->getSubCategories($v['cat_id']);
            }
            return $res;
        } else {
            return [];
        }

    }

    public function UpdateCategory($arr, $id)
    {

        $returnArr = [];

        if ($id == -1) {
            $this->db->insert('category', $arr);
            if ($this->db->affected_rows() > 0) {
                $returnArr = array('type' => 'true', 'msg' => 'Add Successful');
            } else {
                $returnArr = array('type' => 'false', 'msg' => 'Add UnSuccessful');
            }

        } else {

            $this->db->where('cat_id', $id);
            $this->db->update('category', $arr);
            if ($this->db->affected_rows() > 0) {
                $returnArr = array('type' => 'true', 'msg' => 'Edit Successful');
            } else {
                $returnArr = array('type' => 'false', 'msg' => 'Edit UnSuccessful');
            }

        }
        return $returnArr;
    }

    public function DeleteCategory($id)
    {

        $this->db->set('cat_parent', 0);
        $this->db->where('cat_parent', $id);
        $this->db->update('category');

        if (!$this->db->where('cat_id', $id)->delete('category')) {
            return array('type' => 'false', 'msg' => 'Delete Not Successful');
        } else {
            return array('type' => 'true', 'msg' => 'delete Successful');
        }

    }

    public function getCategoryLevelWise($level, $id = -1)
    {

        $result = [];
        switch ($level) {

            case 'one':{

                    $this->db->select('c1.cat_id as id, c1.cat_name as name');
                    $this->db->from('category as c1')
                        ->where('c1.cat_parent', 0)
                        ->or_where('c1.cat_parent', null);
                    $result = $this->db->get()->result_array();

                    break;
                }

            case 'two':{}
            case 'three':{

                if(is_array($id)){
                    foreach($id as $k => $v){
                        if($v == 0){
                            return array('type' => 'false', 'msg' => 'Data not found', 'data' => []);
                            exit;
                    }
            }
                }else{

                    if($id == 0){
                        return array('type' => 'false', 'msg' => 'Data not found', 'data' => []);
                            exit;
                    }
                }
               
                    $this->db->select('c1.cat_id as id, c1.cat_name as name');
                    $this->db->from('category as c1')
                        ->where_in('c1.cat_parent', $id);
                    $result = $this->db->get()->result_array();

                    break;
                }
        }

        if (!empty($result)) {
            return array('type' => 'true', 'msg' => 'Data found', 'data' => $result);
        } else {
            return array('type' => 'false', 'msg' => 'Data not found', 'data' => []);
        }

    }

    public function UpdateProduct($arr, $id = -1)
    {
        $data = array(
            'prod_name' => $arr['product_name'],
            'prod_price' => $arr['product_price'],
            'prod_description' => $arr['product_desc']
        );

        if(isset($arr['filepath'])){
            $data['prod_image'] = $arr['filepath'];
        }
        $relation_insert_array = [];
        if ($id == -1) {
          
            $this->db->insert('product', $data);
            if ($this->db->affected_rows() > 0) {
                $id = $this->db->insert_id();
            } else {
                return array('type' => 'false', 'msg' => 'Add UnSuccessful');
            }

        } else {

            $this->db->where('id', $id);
            $this->db->update('product', $data);
                //DELETE previous categories
            $this->db->where('product_id', $id)->delete('prod_cat_relation');
             
        }

        foreach ($arr['categories'] as $k => $v) {
            array_push($relation_insert_array, ['category_id' => $v['cat_id'], 'product_id' => $id, 'level_of_cat' => $v['level']]);
        }

        $this->db->insert_batch('prod_cat_relation', $relation_insert_array);

        if ($this->db->affected_rows() > 0) {
            $returnArr = array('type' => 'true', 'msg' => 'Add Successful');
        } else {
            $returnArr = array('type' => 'false', 'msg' => 'Add UnSuccessful');
        }

        return $returnArr;
    }

    public function DeleteProduct($id)
    {

        $this->db->where('id', $id)->delete('product');

        if (!$this->db->where('product_id', $id)->delete('prod_cat_relation')) {
            return array('type' => 'false', 'msg' => 'Delete Not Successful');
        } else {
            return array('type' => 'true', 'msg' => 'delete Successful');
        }

    }

    public function ListProduct()
    {

        $this->db->select('p.id, p.prod_name,p.prod_image, p.prod_price, p.prod_description');
        $this->db->from('product as p');
     
        $query = $this->db->get()->result_array();
        if ($query) {

            foreach ($query as $k => &$v) {

                $this->db->select('c.cat_name, r.level_of_cat')
                    ->from('prod_cat_relation as r')
                    ->join('category as c', 'r.category_id = c.cat_id')
                    ->where('r.product_id', $v['id']);

                $res = $this->db->get()->result_array();

                $v['category_list'] = $res;
                $v['image'] = $v['prod_image'] ? base_url().$v['prod_image']: null;
            }

            $arr = [
                'type' => 'true',
                'msg' => 'Data found',
                'data' => $query,
            ];

        } else {
            $arr = [
                'type' => 'false',
                'msg' => 'No Data found',
                'data' => [],
            ];
        }

        return $arr;
    }

    public function DetailProduct($id)
    {

        $this->db->select('p.id, p.prod_name , p.prod_price, p.prod_description');
        $this->db->from('product as p');
        $this->db->where('id', $id);
    
        $query = $this->db->get()->row_array();
        if ($query) { 
                $q = "SELECT GROUP_CONCAT(category_id SEPARATOR ', ') as cat, `level_of_cat` 
                FROM `prod_cat_relation` 
                WHERE `product_id` = '$id' group by level_of_cat";

                $res = $this->db->query($q)->result_array();
              //  $query['category_list'] = $res;
            
                foreach($res as $k => $v){
                    if($v['level_of_cat'] == 1){
                        $query['cat_basic']= explode(",",trim($v['cat']));
                    }

                    if($v['level_of_cat'] == 2){
                        $stripped = preg_replace('/\s/', '', $v['cat']);
                        $query['cat_level_one']= explode(",",$stripped);
                    }

                    if($v['level_of_cat'] == 3){
                        $stripped = preg_replace('/\s/', '', $v['cat']);
                        $query['cat_level_two']= explode(",", $stripped);
                    }
                }

            $arr = [
                'type' => 'true',
                'msg' => 'Data found',
                'data' => $query,
            ];

        } else {
            $arr = [
                'type' => 'false',
                'msg' => 'No Data found',
                'data' => [],
            ];
        }

        return $arr;
    }

    public function deleteFile($prodid)
    {
        $this->db->select('prod_image')->from('product')->where('id', $prodid);
        $res = $this->db->get()->row_array();
       
        if ($res && $res['prod_image'] != null) {
          return $res['prod_image'];
        }else{
			return null;
    } }
}
