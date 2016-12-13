<?php
function sql_string($array,$type){
	$string=array();
	$column=array();
	foreach($array as $key=>$val){
		if ($key ==='$$hashKey'){
			continue;
		};
		if ($type=='insert'){
			array_push($string,"'$val'");
			array_push($column,$key);			
		}else{
			array_push($string,"$key='$val'");
		}
	}
	if ($type=='where'){
		$string_sql=join(' and ',$string);
	}elseif($type=='set'){
		$string_sql=join(',',$string);
	}elseif($type =='insert'){
		$string_sql['value']=join(',',$string);
		$string_sql['key']=join(',',$column);
	}
	return $string_sql;
}
?>