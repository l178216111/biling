
var app=angular.module('myApp',['ui.router','ngAnimate','ui.grid','ui.grid.edit']);
app.run(function($rootScope, $location,$state) {
	$rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
		if (toState.name=='manage'  ){
			console.log(toState);
		}
    });
});
app.config(function($stateProvider,$urlRouterProvider) {
	var states=[{
		name:'home',
		url:'/home',
		templateUrl:'page-home.html',
	//	controller:'homeController'
	},{
		name:'vip',
		url:'/vip',
		templateUrl: 'page-vip.html',
//		controller: 'vipController'
	},{
		name:'vip.deposit',
		url:'/deposit',
		templateUrl:'vip/vip-deposit.html'
	},{
		name:'vip.records',
		url:'/records',
		templateUrl:'vip/vip-records.html',
	},{
		name:'vip.register',
		url:'/register',
		templateUrl:'vip/vip-register.html',
	},{
		name:'manage', 
		url:'/manage',
		templateUrl: 'page-manage.html',
	//	controller: 'manageController'
	},{
		name:'manage.project', 
		url:'/project',
		templateUrl: 'manage/page-project.html',
	},{
		name:'manage.free', 
		url:'/free',
		templateUrl: 'manage/page-free.html',
	//	controller: 'manageController'
	},{
		name:'manage.operator', 
		url:'/operator',
		templateUrl: 'manage/page-operator.html',
	//	controller: 'manageController'
	},{
		name:'admin',
		url:'/admin',
		templateUrl: 'page-admin.html',
		controller: 'adminController'
	},{
		name:'admin.salary',
		url:'/salary ',
		templateUrl: 'admin/admin-salary.html'

	},{
		name:'admin.attendance',
		url:'/attendance',
		templateUrl: 'admin/admin-attendance.html',
	}];
	states.forEach(function(state) {
		$stateProvider.state(state);
	});
	$urlRouterProvider.otherwise("home");
});
app.directive('modal', function () {
		return {
				restrict: 'A',
				link: function($scope,element, attr) {
						$scope[attr.modal]=$(element);
//						console.log($scope.modal);
				}
		};
})
app.directive('datetime', function () {
		return {
				restrict: 'A',
				link: function($scope,element, attr) {
						//console.log($(element));
						$(element).datetimepicker({
							language:  'zh-CN',
							minView: 'month',
							autoclose: 1,
							format:'yyyy-mm-dd',
							todayHighlight: 1,
							startView: 2,
						});

				}
		};
})
app.directive('select2',function() {
		return{
				restrict: 'A',
				link:function($scope, element, attrs) {
								$(element).select2({placeholder: 'Select a '+ attrs.select2 });
								if (attrs.select2 =='project'){
									$(element).select2({closeOnSelect: false});
								}
								$(element).on('change', function (evt) {
										$scope.getlist($(element).select2('val'),attrs.select2);
								});
				}
		};
});
app.controller('homeController', function($scope) {
	$scope.input={
		operator:"",
		project:"",
		card:""
	};
    $scope.pageClass = 'page-home';
	$scope.project=['E','D','C','B','A',];
	$scope.getlist=function(value,type){
			$scope.$apply(function(){
			$scope.input[type]=value;
			console.log($scope.input[type]);
		})
	}
	$scope.submit2=function(){
	}
})
app.controller('register', function($scope,uiGridConstants,$http) {
	var today = new Date();
    var nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
	$scope.gridOptions = {
		enableFiltering: true,
		enableSorting: true,
		columnDefs: [
		  { field: 'card',displayName:'卡号',type:'number'},
		  { field: 'name',displayName:'姓名',maxWidth:"100",type:'string' },
		  { field: 'rank',displayName:'等级',maxWidth:"100",type:'string' },
		  { field: 'gender' ,displayName:'性别', filter: {
			  term: '',
			  type: uiGridConstants.filter.SELECT,
			  selectOptions: [ { value: '男', label: '男' }, { value: '女', label: '女' }]
		  },type:'string'},
		  { field: 'birthday' ,displayName:'生日',type:'date'},
		  { field: 'qq' ,displayName:'QQ/微信',type:'string'},
		  { field: 'recently' ,displayName:'最近消费', type: 'date'},
		],
		onRegisterApi: function( gridApi ) {
		  $scope.grid1Api = gridApi;
		}
	};
	$http({
		method:'post',
		url:"register.php",
		headers: {
			'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
		},
		transformRequest:function(data){
			return $.param(data);
		},
		data:{
			'opt':"getlist"
		}
	})
	.then(function successCallback(response) {
		$scope.gridOptions.data =response.data;
	});
	$scope.register=function(){
		$scope.add.modal('toggle');
	}
})
app.controller('desposit', function($scope,$http) {
	$http({
		method:'post',
		url:"desposit.php",
		headers: {
			'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
		},
		transformRequest:function(data){
			return $.param(data);
		},
		data:{
			'opt':"getlist",
		}
	})
	.then(function successCallback(response) {
		$scope.list={
			phone:['1111','2222','3333'],
			card:['1111','2222','3333'],
		}
	});	
	$scope.getlist=function(value,type){
		$http({
			method:'post',
			url:"desposit.php",
			headers: {
				'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
			},
			transformRequest:function(data){
				return $.param(data);
			},
			data:{
				'opt':"grid",
				'type':type,
				'value':value
			}
		})
		.then(function successCallback(response) {
				$scope.result=response.data
		});
	}
	$scope.desposit=function(card_number){
		$scope.modal.modal('toggle');
	}
})
app.controller('record', function($scope,$http) {
	$http({
		method:'post',
		url:"record.php",
		headers: {
			'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
		},
		transformRequest:function(data){
			return $.param(data);
		},
		data:{
			'opt':"getlist",
		}
	})
	.then(function successCallback(response) {
		$scope.list={
			phone:['1111','2222','3333'],
			card:['1111','2222','3333'],
		}
	});	
	$scope.getlist=function(value,type){
		$http({
			method:'post',
			url:"record.php",
			headers: {
				'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
			},
			transformRequest:function(data){
				return $.param(data);
			},
			data:{
				'opt':"grid",
				'type':type,
				'value':value
			}
		})
		.then(function successCallback(response) {
				$scope.result=response.data
		});
	}
	$scope.desposit=function(card_number){
		$scope.modal.modal('toggle');
	}
})
app.controller('manageController', function($scope) {
    $scope.pageClass = 'page-manage';
})
app.controller('adminController', function($scope) {
    $scope.pageClass = 'page-admin';
})
app.controller('project', function($scope) {
	$scope.result=[{
		project:'美甲',
		price:'10',
		intrduce:'好玩吗'
	}]
    $scope.operate=function(operate,value){
		console.log(value);
		$scope[operate].modal('toggle');
	}
	$scope.add=function(){
		
	}
	$scope.modify=function(){
		
	}
	$scope.delete=function(){
		
	}
})
app.controller('free', function($scope) {
	$scope.gridOptions = {  };
	$scope.columnDefs=[{name:'等级', enableCellEdit: false}];
	var arr = new Array();
	arr=[{name:'美甲'},{name:'美睫'}];
	$scope.columnDefs=$scope.columnDefs.concat(arr);
	console.log($scope.columnDefs);
	$scope.gridOptions.columnDefs = $scope.columnDefs;

    $scope.operate=function(operate,value){
		$scope[operate].modal('toggle');
	}
	 $scope.msg = {};
	 $scope.gridOptions.onRegisterApi = function(gridApi){
          //set gridApi on scope
          $scope.gridApi = gridApi;
          gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
            $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue ;
            $scope.$apply();
          });
    };
	$scope.gridOptions.data =[{'等级':'A','美甲':'0.7','美睫':'1'}];
	$scope.add=function(){
		
	}
})