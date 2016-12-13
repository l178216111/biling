<?php
header("Content-type:text/html;charset=utf-8");
require_once('db_config.php');
require_once('sql_string.php');
$opt=$_POST['opt'];
$data=$_POST['data'];
$index=$_POST['index'];
//$opt="getproject";
$output=array();
if ($opt=='getproject'){
	$output['error']=0;
}elseif($opt=="_add"){
//	var_dump($data);
	$output['error']=addproject($data);
}elseif($opt=='_delete'){
	$output['error']=deleteproject($data,$index);
}elseif($opt=='_modify'){
	$output['error']=modifyproject($data,$index);
}
$output['result']=getproject();
function getproject(){
	global $mysql;
	$array=array();
	$conn=mysql_connect($mysql['server_name'],$mysql['username'],$mysql['password']) or die("error connecting"); //连接数据库
	mysql_query("set names 'utf8'");
	mysql_select_db($mysql['database'],$conn);
	$sql="select project,price,introduce from project";
	$result = mysql_query($sql);
//	var_dump($result);
	if( mysql_num_rows($result)) {
		while($row = mysql_fetch_array($result,MYSQL_ASSOC)){
	//		$row_tmp=array('project'=>$row['project'],'price'=>$row['price'],'introduce'=>$row['introduce']);
			array_push($array,$row);
		}
	}else{
		mysql_error();
	}
	mysql_close($conn);
	return $array;
}
function addproject($data){
	global $mysql;
	$conn=mysql_connect($mysql['server_name'],$mysql['username'],$mysql['password']) or die("error connecting");
	mysql_query("set names 'utf8'");
	mysql_select_db($mysql['database'],$conn);
	mysql_query('START TRANSACTION');
	$isBad = 0;
	$ins_table_free="alter table free add  column ".$data['project']." varchar(100)  default 1";
	if(!mysql_query($ins_table_free)){
	  $isBad =mysql_error();
	}else{
		$insert=array();
		$insert=sql_string($data,'insert');
		$ins_table_project = "INSERT INTO project(".$insert['key'].") VALUES (".$insert['value'].")";
		//echo $ins_table_project;
		if(!mysql_query($ins_table_project)){
		  $isBad =mysql_error();
		}
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
function deleteproject($data,$index){
	global $mysql;
	$conn=mysql_connect($mysql['server_name'],$mysql['username'],$mysql['password']) or die("error connecting");
	mysql_query("set names 'utf8'");
	mysql_select_db($mysql['database'],$conn);
	mysql_query('START TRANSACTION');
	$isBad = 0;

	$ins_table_free="alter table free drop column ".$index['project'];
	if(!mysql_query($ins_table_free)){
	  $isBad =mysql_error();
	}else{
		$where=sql_string($index,'where');
		$ins_table_project = "DELETE FROM project WHERE $where";
	//	echo $ins_table_project;
		if(!mysql_query($ins_table_project)){
		  $isBad =mysql_error();
		}
	}
	if($isBad !== 0){
//		echo $isBad;
	    mysql_query('ROLLBACK');
	}else{
//		echo $isBad;
		mysql_query('COMMIT');
	}
	mysql_query("END"); 
	mysql_close($conn);
	return $isBad;
}
function modifyproject($data,$index){
	global $mysql;
	$conn=mysql_connect($mysql['server_name'],$mysql['username'],$mysql['password']) or die("error connecting");
	mysql_query("set names 'utf8'");
	mysql_select_db($mysql['database'],$conn);
	mysql_query('START TRANSACTION');
	$isBad = 0;
	if ( array_key_exists('project',$data)){
//		echo "project";
		$ins_table_free="alter table free change ".$index['project']." ".$data['project']." varchar(1000) not null";
//		echo $ins_table_free;
		if(!mysql_query($ins_table_free)){
		  $isBad =mysql_error();
		}
	}
	if($isBad == 0){
		$set=sql_string($data,'set');
		$where=sql_string($index,'where');
		$ins_table_project = "UPDATE project SET $set  WHERE $where";
	//	echo $ins_table_project;
		if(!mysql_query($ins_table_project)){
		  $isBad =mysql_error();
		}
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
echo json_encode($output);
?>