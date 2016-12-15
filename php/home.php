<?php
header("Content-type:text/html;charset=utf-8");
require_once('db_config.php');
require_once('sql_string.php');
$opt=$_POST['opt'];
$data=$_POST['data'];
//$opt="getproject";
$output=array();
if ($opt=='ini'){
	$output['error']=0;
}elseif($opt=='submit'){
	$output['error']=submit($data);
}
$output['result']=ini();
echo json_encode($output);
function ini(){
	global $mysql;
	$array=array();
	$array['viplist']=array();
	$array['project']=array();
	$array['free']=array();
	$conn=mysql_connect($mysql['server_name'],$mysql['username'],$mysql['password']) or die("error connecting"); //连接数据库
	mysql_query("set names 'utf8'");
	mysql_select_db($mysql['database'],$conn);
	$sql="select * from viplist";
	$result = mysql_query($sql);
//	var_dump($result);
	if( mysql_num_rows($result)) {
		while($row = mysql_fetch_array($result,MYSQL_ASSOC)){
//			$row_tmp=array('project'=>$row['project'],'introduce'=>$row['introduce']);
//			print_r($row);
			array_push($array['viplist'],$row);
		}
	}else{
		mysql_error();
	}
	$sql="select * from project";
	$result = mysql_query($sql);
//	var_dump($result);
	if( mysql_num_rows($result)) {
		while($row = mysql_fetch_array($result,MYSQL_ASSOC)){
//			$row_tmp=array('project'=>$row['project'],'introduce'=>$row['introduce']);
			array_push($array['project'],$row);
		}
	}else{
		mysql_error();
	}
		$sql="select * from free";
	$result = mysql_query($sql);
//	var_dump($result);
	if( mysql_num_rows($result)) {
		while($row = mysql_fetch_array($result,MYSQL_ASSOC)){
//			$row_tmp=array('project'=>$row['project'],'introduce'=>$row['introduce']);
			$rank=array_shift($row);
			$array['free'][$rank]=$row;
		}
	}else{
		mysql_error();
	}
	mysql_close($conn);
	return $array;
}
function submit($data){
	global $mysql;
	$array=array();
	$isBad = 0;
	$conn=mysql_connect($mysql['server_name'],$mysql['username'],$mysql['password']) or die("error connecting"); //连接数据库
	mysql_query("set names 'utf8'");
	mysql_select_db($mysql['database'],$conn);
	$card=$data['card'];
	$project=join(',',$data['project']);
	$operator=$data['operator'];
	$sql="select balance,points from viplist where card='$card'";
	$result=mysql_query($sql);
	if( mysql_num_rows($result)==1) {
		while($row=mysql_fetch_array($result,MYSQL_ASSOC)){
			
			if ($data['sum']>$row['balance']){
				return $isBad="余额不足";
			}else{
				$balance=$row['balance']-$data['sum'];
			}
			$points=$row['points']+$data['sum']*10;
		}
		date_default_timezone_set('PRC');
		$time=date("Y-m-d h:i");
		$sql="update viplist set balance='$balance',points='$points',lastpatronize='$time' where card='$card'";
		if(!mysql_query($sql)){
			 $isBad =mysql_error();
		}
		$sql="insert record (card,project,date,operator,balance,points) values('$card','$project','$time','$operator','$balance','$points');";
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
?>