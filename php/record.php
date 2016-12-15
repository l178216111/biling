<?php
header("Content-type:text/html;charset=utf-8");
require_once('db_config.php');
require_once('sql_string.php');
$opt=$_POST['opt'];
$output=array();
if ($opt == 'ini'){
	$output['error']=0;
}
$output['result']=ini();
echo json_encode($output);
function ini(){
	global $mysql;
	$array=array();
	$conn=mysql_connect($mysql['server_name'],$mysql['username'],$mysql['password']) or die("error connecting"); //连接数据库
	mysql_query("set names 'utf8'");
	mysql_select_db($mysql['database'],$conn);
	$sql="select 
	a.card,a.project,a.date,a.operator,a.balance,a.points,b.name,b.rank,b.gender,b.phone,b.birthday
	from record a left join viplist b on a.card=b.card order by date desc";
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
?>