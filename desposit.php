<?php
header("Content-type:text/html;charset=utf-8");
$type=$_POST['type'];
$opt=$_POST['opt'];
$value=$_POST['value'];
$result=array();
$array=array('number'=>"2","name"=>'张三',"sex"=>'男',"phone"=>'2222',"birthday"=>'1992-2-2',"qq"=>'1333');
array_push($result,$array);
echo json_encode($result);
?>