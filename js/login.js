$(document).ready(function(){
	load();
})
function load(){
   	var app= angular.module('myApp', []);
	app.directive('setfoucs',function(){
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				attrs.$observe('setfoucs', function (name) {
					if (name === attrs.name) {
						element[0].focus();
					}
				});
			}
		}
	});
	app.controller('login',
		function($scope,$http,$location){
					$scope.error_hide=true;
					$scope.username="";
					$scope.password="";
			$scope.submit=function(){
					if ($scope.username == '') {
						$scope.error_top={"top":"27px"};
						$scope.error_hide=false;
						$scope.focus="username";
					}else if ($scope.password == ''){
						$scope.error_top={"top":"96px"};
						$scope.error_hide=false;
						$scope.focus="password";
					}else{
						$scope.error_hide=true;
						$http({
							method:'post',
							url:"login.php",
							headers: {
								'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
							},
							transformRequest:function(data){
								return $.param(data);
							},
							data:{
								'username':$scope.username,
								'password':$scope.password
							}
						})
						.then(function successCallback(response) {
								if (response.data.result =='success'){
									window.location.href="index.html";
								}else{
									alert("Login Fail")
								}	
						});
					}
			}
			$scope.fadout=function(string){
				if (string != ""){
					$scope.error_hide=true;
				}
			}
		})
}