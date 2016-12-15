<?php
header("Content-type:text/html;charset=utf-8");
require_once('db_config.php');
require_once('sql_string.php');
$opt=$_POST['opt'];
$data=TrimArray($_POST['data']);
$output=array();
if ($opt == 'ini'){
	$output['error']=0;
	$output['viplist']=getviplist();
}elseif($opt == "_register"){
	$output['error']=register($data);
}
$output['result']=ini();
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
function register($data){
	global $mysql;
	$conn=mysql_connect($mysql['server_name'],$mysql['username'],$mysql['password']) or die("error connecting");
	mysql_query("set names 'utf8'");
	mysql_select_db($mysql['database'],$conn);
	mysql_query('START TRANSACTION');
	$isBad = 0;
	$insert=array();
	$insert=sql_string($data,'insert');
	$ins_table_free = "INSERT INTO viplist (".$insert['key'].")VALUES (".$insert['value'].")";
	if(!mysql_query($ins_table_free)){
	  $isBad =mysql_error();
	}
	if($isBad !== 0){
//			echo $isBad;
	    mysql_query('ROLLBACK');
	}else{
		mysql_query('COMMIT');
	}
	mysql_query("END"); 
	mysql_close($conn);
	return $isBad;
}
echo json_encode($output);
?>