<?php
header("Content-type:text/html;charset=utf-8");

$result=array();
$array=array('card'=>"2","name"=>'张三',"gender"=>'男',"phone"=>'2222',"birthday"=>'1992-2-2',"qq"=>'1333','recently'=>'2016-09-06');

array_push($result,$array);
$array=array('card'=>"1","name"=>'张二',"gender"=>'女',"phone"=>'22',"birthday"=>'1990-2-2',"qq"=>'33','recently'=>'2016-12-06');
array_push($result,$array);
echo json_encode($result);
?>