<?php
header("Content-type:text/html;charset=utf-8");
	$username=$_POST['username'];
	$password=$_POST['password'];
	session_start();
	if ($username == 'admin' ){
		$_SESSION["name"]="username";
		$output=array("result"=>"success");
	}else{
		$output=array("result"=>"fail");
	}
	echo json_encode($output);
?>