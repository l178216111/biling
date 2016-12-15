<?php
header("Content-type:text/html;charset=utf-8");
require_once('db_config.php');
require_once('sql_string.php');
$opt=$_POST['opt'];
$data=$_POST['data'];
$index=$_POST['index'];
$output=array();
if ($opt == 'ini'){
	$output['error']=0;
	$output['viplist']=getviplist();
}elseif($opt == "_deposit"){
	$output['error']=deposit($data,$index);
}elseif($opt=="_modify"){
	$output['error']=modify($data,$index);
}
$output['result']=ini();
echo json_encode($output);
function ini(){
	global $mysql;
	$array=array();
	$conn=mysql_connect($mysql['server_name'],$mysql['username'],$mysql['password']) or die("error connecting"); //连接数据库
	mysql_query("set names 'utf8'");
	mysql_select_db($mysql['database'],$conn);
	$sql="select * from viplist";
	$result = mysql_query($sql);
//	var_dump($result);
	if( mysql_num_rows($result)) {
		while($row = mysql_fetch_array($result,MYSQL_ASSOC)){
//			$row_tmp=array('project'=>$row['project'],'introduce'=>$row['introduce']);
			array_push($array,$row);
		}
	}else{
		mysql_error();
	}
	mysql_close($conn);
	return $array;
}
function getviplist(){
	global $mysql;
	$array=array();
	$conn=mysql_connect($mysql['server_name'],$mysql['username'],$mysql['password']) or die("error connecting"); //连接数据库
	mysql_query("set names 'utf8'");
	mysql_select_db($mysql['database'],$conn);
	$sql="select project from vip";
	$result = mysql_query($sql);
//	var_dump($result);
	if( mysql_num_rows($result)) {
		while($row = mysql_fetch_array($result,MYSQL_ASSOC)){
//			$row_tmp=array('project'=>$row['project'],'introduce'=>$row['introduce']);
			array_push($array,$row['project']);
		}
	}else{
		mysql_error();
	}
	mysql_close($conn);
	return $array;
}
function deposit($data,$index){
	global $mysql;
	$array=array();
	$isBad = 0;
	$conn=mysql_connect($mysql['server_name'],$mysql['username'],$mysql['password']) or die("error connecting");
	mysql_query("set names 'utf8'");
	mysql_select_db($mysql['database'],$conn);
	$where=sql_string($index,'where');
	$sql="select balance from viplist where $where";
	$result = mysql_query($sql);
	if( mysql_num_rows($result)) {
		while($row = mysql_fetch_array($result,MYSQL_ASSOC)){
			$deposit=$data['balance'];
			$data['balance']+=$row['balance'];
		}
		$set=sql_string($data,'set');
		$sql="update viplist set $set where $where";
		if(!mysql_query($sql)){
			 $isBad =mysql_error();
		}
		date_default_timezone_set('PRC');
		$time=date("Y-m-d h:i");
		$sql="insert deposithistory (card,sum,date) values ('".$index['card']."','$deposit','$time')";
		if(!mysql_query($sql)){
			$isBad =mysql_error();
		}
	}else{
		$isBad=mysql_error();
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
function modify($data,$index){
	global $mysql;
	$conn=mysql_connect($mysql['server_name'],$mysql['username'],$mysql['password']) or die("error connecting");
	mysql_query("set names 'utf8'");
	mysql_select_db($mysql['database'],$conn);
	mysql_query('START TRANSACTION');
	$isBad = 0;
	$set=sql_string($data,'set');
	$where=sql_string($index,'where');
	$ins_table_project = "UPDATE viplist SET $set  WHERE $where";
//	echo $ins_table_project;
	if(!mysql_query($ins_table_project)){
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
?>