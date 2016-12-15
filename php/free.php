<?php
header("Content-type:text/html;charset=utf-8");
require_once('db_config.php');
require_once('sql_string.php');
$opt=$_POST['opt'];
//$opt="getproject";
$output=array();
if ($opt=='getproject'){
	$output['error']=0;
	$result=getproject();
	$output['result']=$result['data'];
	$output['title']=$result['title'];
}elseif($opt=='modifyproject'){
	$data=TrimArray($_POST['data']);
	$index=TrimArray($_POST['index']);
	if ($data['value']>1 or $data['value']<=0){
		$output['error']="折扣输入有误";
	}else{
		$output['error']=modifyproject($data,$index);
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
?>