<?php
header("Content-type:text/html;charset=utf-8");
require_once('db_config.php');
$opt=$_POST['opt'];
//$opt="getproject";
$output=array();
if ($opt=='getproject'){
	$output['error']=0;
	$result=getproject();
	$output['result']=$result['data'];
	$output['title']=$result['title'];
}elseif($opt=='modifyproject'){
	$data=$_POST['data'];
	$index=$_POST['index'];
	$output['error']=modifyproject($data,$index);
	if ($output['error']!=0){
		$result=getproject();
		$output['result']=$result['data'];
	}
}

echo json_encode($output);
function getproject(){
	global $mysql;
	$data=array();
	$title=array();
	$conn=mysql_connect($mysql['server_name'],$mysql['username'],$mysql['password']) or die("error connecting"); //连接数据库
	mysql_query("set names 'utf8'");
	mysql_select_db($mysql['database'],$conn);
	$sql="select * from free";
	$result = mysql_query($sql);
	if( mysql_num_rows($result)) {
			while($row = mysql_fetch_array($result,MYSQL_ASSOC)){
				array_push($data,$row);
			}
	}
	$sql="select  column_name from Information_schema.columns  where table_Name = 'free'";
	$result = mysql_query($sql);
	if( mysql_num_rows($result)) {
			while($row = mysql_fetch_array($result,MYSQL_NUM)){
				array_push($title,array('name'=>$row[0]));
			}
	}
	array_shift($title);
	mysql_close($conn);
	return array('data'=>$data,'title'=>$title);
}
function modifyproject($data,$index){
	global $mysql;
	$conn=mysql_connect($mysql['server_name'],$mysql['username'],$mysql['password']) or die("error connecting");
	mysql_query("set names 'utf8'");
	mysql_select_db($mysql['database'],$conn);
	mysql_query('START TRANSACTION');
	$isBad = 0;
	$where=sql_string($index,'where');
	$ins_table_free="UPDATE free SET ".$data['col']."='".$data['value']."' WHERE $where";
//	echo $ins_table_free;
	if(!mysql_query($ins_table_free)){
	  $isBad =mysql_error();
	}
	if($isBad !== 0){
//		echo '回滚';
	    mysql_query('ROLLBACK');
	}else{
//		echo $isBad;
		mysql_query('COMMIT');
	}
	mysql_query("END"); 
	mysql_close($conn);
	return $isBad;
}
function sql_string($array,$type){
	$string=array();
	foreach($array as $key=>$val){
		if ($key ==='$$hashKey'){
			continue;
		};
		$string_tmp="$key='$val'";
		array_push($string,$string_tmp);
	}
	if ($type=='where'){
		$string_sql=join(' and ',$string);
	}elseif($type=='set'){
		$string_sql=join(',',$string);
	}
	return $string_sql;
}
?>