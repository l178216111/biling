
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
		name:'manage.mvip', 
		url:'/mvip',
		templateUrl: 'manage/page-mvip.html',
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
								var string='select2'+attrs.select2;
								$scope[string]=$(element);
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
app.controller('homeController', function($scope,$http) {
	var initial=function(){
		$scope.input={
			card:null,
			operator:null,
			project:null,
			sum:0,
		};
		delete  $scope.info;
//		$scope.select2project.val("").trigger("change");
//		$scope.select2card.val("").trigger("change");
	}
	initial();
	$http({
		method:'post',
		url:"php/home.php",
		headers: {
			'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
		},
		transformRequest:function(data){
			return $.param(data);
		},
		data:{
			'opt':"ini",
			'data':{
				"result":"  asd  ",
				'asd':"asdasd  "
			}
		}
	})
	.then(function successCallback(response) {
		if (response.data.error!=0){				
			$scope.msg=response.data.error;
			$scope['_error'].modal('toggle');
		}
		$scope.data =response.data.result;
	});
	$scope.getlist=function(value,type){
//		$scope.$apply(function(){
			if (type =='card'){
				//console.log(value);
			//		console.log(type + ' value '+value);
					if (value != null){
			//			console.log(value);
						$scope.info=$scope.data.viplist[value];							
						if (typeof($scope.info.card)!='undefined'){
							$scope.input.card=$scope.info.card;
						}
						$scope.$apply();
					}
					$scope.select2project.val("").trigger("change");
					$scope.select2operator.val("").trigger("change");					
			}else if(type =='project'){
//				console.log(value);
				if (value != null){
					$scope.input.sum=0;
					$scope.input.project=[];
					for (var i = 0, length = value.length; i < length; i++) {
						var index=value[i];
						var rank=$scope.info.rank;
						var project=$scope.data.project[index].project;
						var free=$scope.data.free[rank][project];
						$scope.input.sum+=Number($scope.data.project[index].price)*free;
						$scope.input.project.push($scope.data.project[index].project);
					}
					$scope.$apply();
				}
				
			}else if (type =='operator'){
				if (value != null){
					if (typeof($scope.input.operator)!='undefined'){
						$scope.input.operator=value;
					}
					$scope.$apply();
				}
			}
			
//		})
	}
	$scope.submit=function(){
	//	console.log($scope.input.sum);
		if (Number($scope.input.sum) > Number($scope.info.balance)){
			$scope.msg="余额不足";
			$scope['_error'].modal('toggle');
		}else{
			$http({
				method:'post',
				url:"php/home.php",
				headers: {
					'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
				},
				transformRequest:function(data){
					return $.param(data);
				},
				data:{
					'opt':"submit",
					'data':$scope.input
				}
			})
			.then(function successCallback(response) {
				if (response.data.error!=0){				
					$scope.msg=response.data.error;
					$scope['_error'].modal('toggle');
				}
				$scope.data =response.data.result;
				initial();
				$scope.select2card.val("").trigger("change");
//				
			});
		}
	}
})
app.controller('register', function($scope,uiGridConstants,$http) {
	$scope.gridOptions = {
		enableFiltering: true,
		enableSorting: true,
		columnDefs: [
		  { field: 'card',displayName:'卡号',type:'number'},
		  { field: 'name',displayName:'姓名',maxWidth:"100",type:'string' },
		  { field: 'rank',displayName:'等级',maxWidth:"100",type:'string',width:'5%' },
		  { field: 'gender' ,displayName:'性别',width:'7%',filter: {
			  term: '',
			  type: uiGridConstants.filter.SELECT,
			  selectOptions: [ { value: '男', label: '男' }, { value: '女', label: '女' }]
		  },type:'string'},
		  { field: 'birthday' ,displayName:'生日',type:'date'},
		  { field: 'qq' ,displayName:'QQ/微信',type:'string'},
		  { field: 'lastpatronize' ,displayName:'最近消费', type: 'date',width:'15%'},
		  { field: 'balance' ,displayName:'余额', type: 'number'},
		  { field: 'points' ,displayName:'积分', type: 'number'},
		],
		onRegisterApi: function( gridApi ) {
		  $scope.grid1Api = gridApi;
		}
	};
	$http({
		method:'post',
		url:"php/register.php",
		headers: {
			'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
		},
		transformRequest:function(data){
			return $.param(data);
		},
		data:{
			'opt':"ini",
			'data':""
		}
	})
	.then(function successCallback(response) {
		if (response.data.error!=0){				
			$scope.msg=response.data.error;
			$scope['_error'].modal('toggle');
		}
		$scope.gridOptions.data =response.data.result;
		$scope.viplist=response.data.viplist;
	});
	$scope.register=function(type){
		$scope[type].modal('toggle');
	}
	$scope.modal_operate=function(type,index){
			$scope[type].modal('toggle');
			var data_type="modal"+type;
			$http({
				method:'post',
				url:"php/register.php",
				headers: {
					'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
				},
				transformRequest:function(data){
					return $.param(data);
				},
				data:{
					'opt':type,
					'data':$scope[data_type],
				}
			})
			.then(function successCallback(response) {
				if (response.data.error!=0){				
					$scope.msg=response.data.error;
					$scope['_error'].modal('toggle');
				}
				$scope[data_type]="";
				$scope.gridOptions.data =response.data.result;
			});
	}
})
app.controller('deposit', function($scope,$http,$filter) {
	$http({
		method:'post',
		url:"php/deposit.php",
		headers: {
			'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
		},
		transformRequest:function(data){
			return $.param(data);
		},
		data:{
			'opt':"ini",
			'data':'',
			'index':'',
		}
	})
	.then(function successCallback(response) {
		$scope.result =response.data.result;
		$scope.viplist=response.data.viplist;
		$scope.store=clone($scope.result);
		if (response.data.error!=0){
			$scope['_error'].modal('toggle');
		}
	});
    $scope.operate=function(operate,value){
//		console.log(operate);
		$scope.dataindex=value;
		$scope[operate].modal('toggle');
	}
	$scope.modal_operate=function(type,index){
			$scope[type].modal('toggle');
			var data_type="modal"+type;
			$http({
				method:'post',
				url:"php/deposit.php",
				headers: {
					'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
				},
				transformRequest:function(data){
					return $.param(data);
				},
				data:{
					'opt':type,
					'data':$scope[data_type],
					'index':$scope.result[index]
				}
			})
			.then(function successCallback(response) {
				if (response.data.error!=0){				
					$scope.msg=response.data.error;
					$scope['_error'].modal('toggle');
				}
				$scope[data_type]="";
				$scope.result =response.data.result;
			});
	}
	$scope.cancel=function(type){
		type='modal' + type;
		$scope[type]="";
	}
	$scope.getlist=function(value,type){
		var array=[]
		for (var key in $scope.store){
	//		console.log($scope.store[key][type]);
			if ($scope.store[key][type]==value){		
				array.push($scope.store[key]);
			}
		}
		$scope.$apply();
		$scope.result=array;
		$scope.$apply();
//		console.log($scope.result);
	}
})
app.controller('record', function($scope,uiGridConstants,$http) {
	$scope.gridOptions = {
		enableFiltering: true,
		enableSorting: true,
		columnDefs: [
		  { field: 'card',displayName:'卡号',type:'number'},
		  { field: 'name',displayName:'姓名',maxWidth:"100",type:'string' },
		  { field: 'rank',displayName:'会员等级',maxWidth:"100",type:'string',width:'5%'},
		  { field: 'gender' ,displayName:'性别',width:'7%', filter: {
			  term: '',
			  type: uiGridConstants.filter.SELECT,
			  selectOptions: [ { value: '男', label: '男' }, { value: '女', label: '女' }]
		  },type:'string'},
		  { field: 'birthday' ,displayName:'生日',type:'date',width:'10%'},
		  { field: 'qq' ,displayName:'QQ/微信',type:'string',width:'10%'},
		  { field: 'operator' ,displayName:'技师', type: 'string'},
		  { field: 'project' ,displayName:'项目', type: 'string',width:'15%'},
		  { field: 'date' ,displayName:'日期', type: 'date',width:'15%'},
		  { field: 'balance' ,displayName:'余额', type: 'number'},
		  { field: 'points' ,displayName:'积分', type: 'number'},
		],
		onRegisterApi: function( gridApi ) {
		  $scope.grid1Api = gridApi;
		}
	};
	$http({
		method:'post',
		url:"php/record.php",
		headers: {
			'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
		},
		transformRequest:function(data){
			return $.param(data);
		},
		data:{
			'opt':"ini",
		}
	})
	.then(function successCallback(response) {
		if (response.data.error!=0){				
			$scope.msg=response.data.error;
			$scope['_error'].modal('toggle');
		}
		$scope.gridOptions.data =response.data.result;
	});
})
app.controller('manageController', function($scope) {
    $scope.pageClass = 'page-manage';
})
app.controller('adminController', function($scope) {
    $scope.pageClass = 'page-admin';
})
app.controller('project', function($scope,$http) {
	$http({
		method:'post',
		url:"php/project.php",
		headers: {
			'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
		},
		transformRequest:function(data){
			return $.param(data);
		},
		data:{
			'opt':"getproject",
			'data':'',
			'index':'',
		}
	})
	.then(function successCallback(response) {
		$scope.result =response.data.result;
		if (response.data.error!=0){
			$scope['_error'].modal('toggle');
		}
	});
    $scope.operate=function(operate,value){
//		console.log(operate);
		$scope.dataindex=value;
		$scope[operate].modal('toggle');
	}
	$scope.cancel=function(type){
		type='modal' + type;
		$scope[type]="";
	}
	$scope.modal_operate=function(type,index){
			$scope[type].modal('toggle');
			var data_type="modal"+type;
			$http({
				method:'post',
				url:"php/project.php",
				headers: {
					'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
				},
				transformRequest:function(data){
					return $.param(data);
				},
				data:{
					'opt':type,
					'data':$scope[data_type],
					'index':$scope.result[index]
				}
			})
			.then(function successCallback(response) {
				if (response.data.error!=0){				
					$scope.msg=response.data.error;
					$scope['_error'].modal('toggle');
				}
				$scope[data_type]="";
				$scope.result =response.data.result;
			});
	}
})
app.controller('mvip', function($scope,$http) {
	$http({
		method:'post',
		url:"php/mvip.php",
		headers: {
			'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
		},
		transformRequest:function(data){
			return $.param(data);
		},
		data:{
			'opt':"getproject",
			'data':'',
			'index':'',
		}
	})
	.then(function successCallback(response) {
		$scope.result =response.data.result;
		if (response.data.error!=0){
			$scope['_error'].modal('toggle');
		}
	});
    $scope.operate=function(operate,value){
//		console.log(operate);
		$scope.dataindex=value;
		$scope[operate].modal('toggle');
	}
	$scope.modal_operate=function(type,index){
			$scope[type].modal('toggle');
			var data_type="modal"+type;
			$http({
				method:'post',
				url:"php/mvip.php",
				headers: {
					'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
				},
				transformRequest:function(data){
					return $.param(data);
				},
				data:{
					'opt':type,
					'data':$scope[data_type],
					'index':$scope.result[index]
				}
			})
			.then(function successCallback(response) {
				if (response.data.error!=0){				
					$scope.msg=response.data.error;
					$scope['_error'].modal('toggle');
				}
				$scope[data_type]="";
				$scope.result =response.data.result;
			});
	}
})
app.controller('free', function($scope,$http) {
	$scope.gridOptions = {};
	$http({
		method:'post',
		url:"php/free.php",
		headers: {
			'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
		},
		transformRequest:function(data){
			return $.param(data);
		},
		data:{
			'opt':"getproject",
		}
	})
	.then(function successCallback(response) {
		$scope.gridOptions.data =response.data.result;
		var array=new Array();
		array=[{name:'rank',displayName:"会员等级",enableCellEdit: false}];
		$scope.gridOptions.columnDefs=array.concat(response.data.title);
		if (response.data.error!=0){
			$scope['_error'].modal('toggle');
		}
	});
    $scope.operate=function(operate,value){
		$scope[operate].modal('toggle');
	}
	 $scope.gridOptions.onRegisterApi = function(gridApi){
          //set gridApi on scope
          $scope.gridApi = gridApi;
          gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
			var index=new Object();
			index=clone(rowEntity);
			index[colDef.name]=oldValue;	
  //          console.log(index);
			var update=new Object();
			update['col']=colDef.name;
			update['value']=newValue;
			$http({
				method:'post',
				url:"php/free.php",
				headers: {
					'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
				},
				transformRequest:function(data){
					return $.param(data);
				},
				data:{
					'opt':"modifyproject",
					'index':index,
					'data':update,
				}
			})
			.then(function successCallback(response) {
				if (response.data.error!=0){				
						$scope.msg=response.data.error;
						$scope['_error'].modal('toggle');
						$scope.gridOptions.data =response.data.result;
				}
			});
          });
    };
})
function clone(obj)
{
	var o,i,j,k;
	if(typeof(obj)!="object" || obj===null)return obj;
	if(obj instanceof(Array))
	{
		o=[];
		i=0;j=obj.length;
		for(;i<j;i++)
		{
			if(typeof(obj[i])=="object" && obj[i]!=null)
			{
				o[i]=arguments.callee(obj[i]);
			}
			else
			{
				o[i]=obj[i];
			}
		}
	}
	else
	{
		o={};
		for(i in obj)
		{
			if(typeof(obj[i])=="object" && obj[i]!=null)
			{
				o[i]=arguments.callee(obj[i]);
			}
			else
			{
				o[i]=obj[i];
			}
		}
	}
 
	return o;
}