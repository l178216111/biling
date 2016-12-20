var app=angular.module('myApp',['ui.router','ngAnimate','ui.grid','ui.grid.edit','toastr']);
app.run(function($rootScope, $location,$state) {

});
app.service('scopeService', function() {
     return {
         safeApply: function ($scope, fn) {
             var phase = $scope.$root.$$phase;
             if (phase == '$apply' || phase == '$digest') {
                 if (fn && typeof fn === 'function') {
                     fn();
                 }
             } else {
                 $scope.$apply(fn);
             }
         },
     };
});
app.factory('myInterceptor', ["$rootScope", function ($rootScope) {  
 var timestampMarker = {  
	 request: function (config) { 
		 $rootScope.loading = true;  
		 return config;  
	 },  
	 response: function (response) {  
		$rootScope.loading = false;  
		 return response;  
	 }  
 };  
 return timestampMarker;  
}]);
app.config(
	function($stateProvider,$httpProvider,$urlRouterProvider) {
	var states=[{
		name:'home',
		url:'/home',
		templateUrl:'page-home.html',
		resolve:{
			data: function($http) {
				return $http({
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
						'data':""
						}
				})
				.then(function successCallback(response) {
					return response.data;
				});
			}
		},
		controller:function($scope,data,toastr) {
          $scope.data=data.result;
		  	if (data.error!=0){
				toastr.error(data.error,'错误');
			}
        }
	//	controller:'homeController'
	},{
		name:'vip',
		url:'/vip',
		templateUrl: 'page-vip.html',
//		controller: 'vipController'
	},{
		name:'vip.deposit',
		url:'/deposit',
		templateUrl:'vip/vip-deposit.html',
		resolve:{
			data:function($http){
				return 	$http({
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
					return response.data;
				});
			}
		},
		controller:function($scope,data,toastr){
			$scope.result =data.result;
			$scope.viplist=data.viplist;
			if (data.error!=0){
				toastr.error(data.error,'错误');
			}
		}
	},{
		name:'vip.records',
		url:'/records',
		templateUrl:'vip/vip-records.html',
		resolve:{
			data:function($http){
				return 	$http({
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
					return response.data;
				});
			}
		},
		controller:function($scope,data,toastr){
			if (data.error!=0){				
				toastr.error(data.error,'错误');
			}
			$scope.data =data.result;
		}
	},{
		name:'vip.register',
		url:'/register',
		templateUrl:'vip/vip-register.html',
		resolve:{
			data:function($http){
				return	$http({
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
					return response.data;
				});
			}
		},
		controller:function($scope,data,toastr){
			if (data.error!=0){				
				toastr.error(data.error,'错误');
			}
			$scope.data =data.result;
			$scope.viplist=data.viplist;
		}
	},{
		name:'manage', 
		url:'/manage',
		cache:false,
		templateUrl: 'page-manage.html',
	//	controller: 'manageController'
	},{
		name:'manage.project', 
		url:'/project',
		cache:false,
		templateUrl: 'manage/page-project.html',
		resolve:{
			   authenticate: authenticate,
		       data: function($http) {
					return $http({
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
						return response.data;
					});
				},
		},
		controller: function($scope,data,toastr) {
          $scope.result=data.result;
		  	if (data.error!=0){
				toastr.error(data.error,'错误');
			}
      }
	},{
		name:'manage.free', 
		url:'/free',
		cache:false,
		templateUrl: 'manage/page-free.html',
		resolve:{
			data:function($http){
				return 	$http({
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
					return response.data;
				});
			}
		},
		controller: function($scope,data,toastr){
					$scope.data={};
					$scope.data.result = data.result;
					$scope.data.title = data.title;
					if (data.error!=0){
						toastr.error(data.error,'错误');
					}
		}
	},{
		name:'manage.operator', 
		url:'/operator',
		cache:false,
		templateUrl: 'manage/page-operator.html',
	//	controller: 'manageController'
	},{
		name:'manage.mvip', 
		url:'/mvip',
		templateUrl: 'manage/page-mvip.html',
		resolve:{
			data:function($http){
				return 	$http({
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
					return response.data;
				});
			}
		},
		controller: function($scope,toastr,data){
			$scope.result =data.result;
			if (data.error!=0){
				toastr.error(data.error,'错误');
			}
		}
	},{
		name:'admin',
		url:'/admin',
		templateUrl: 'page-admin.html',
//		controller: 'adminController'
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
	$httpProvider.interceptors.push('myInterceptor');
	function authenticate($q,$rootScope, $state, $timeout,toastr) {
		
      if (0) {
        // Resolve the promise successfully
        return $q.when()
      } else {
		 toastr.info("权限不足",'Info');
        // The next bit of code is asynchronously tricky.
        $timeout(function() {
          // This code runs after the authentication promise has been rejected.
          // Go to the log-in page
          $state.go('home')
        })
        // Reject the authentication promise to prevent the state from loading
        return $q.reject()
      }
	 }
	},
	 function(toastrConfig) {
	  angular.extend(toastrConfig, {
		autoDismiss: false,
		containerId: 'toast-container',
		maxOpened: 0,    
		newestOnTop: true,
		positionClass: 'toast-bottom-right',
		preventDuplicates: false,
		preventOpenDuplicates: false,
		target: 'body'
	  });
	}
);
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
app.controller('index',function($scope,$rootScope,$location,$state,toastr){
	$rootScope.$on('$stateChangeStart', function(event, toState,toStateParams,fromState) {
		var path=toState.name;
		var re=/manage\..*/g;
		if (re.test(path)==true){			
		//	console.log(toState.name);		
		//	$location.path(fromState.url).replace();					
		//	toastr.info("请登录",'Info');
		//	$scope['_login'].modal('toggle');
		}
		$scope.modal_operate=function(type){
			$scope[type].modal('toggle');
		}
    });
})
app.controller('homeController', function($scope,$http,toastr,scopeService,$rootScope) {
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
	$scope.getlist=function(value,type){
			if (type =='card'){
					if (value != null){
						$scope.info=$scope.data.viplist[value];							
						if (typeof($scope.info.card)!='undefined'){
							$scope.input.card=$scope.info.card;
						}
						$scope.$apply();
					}else{
						delete  $scope.info;
					}
					$scope.select2project.val("").trigger("change");
					$scope.select2operator.val("").trigger("change");					
			}else if(type =='project'){
//				console.log(type +''+''+value);
				scopeService.safeApply($rootScope, function() {
					if (value != null){
						$scope.input.sum=0;
						$scope.input.project=[];
						for (var i = 0, length = value.length; i < length; i++) {
							var index=value[i];
							var rank=$scope.info.rank;
							var project=$scope.data.project[index].project;
							if (typeof($scope.data.free[rank])=='undefined'){
								var free=1;
							}else{
								var free=$scope.data.free[rank][project];
							}
							$scope.input.sum+=Number($scope.data.project[index].price)*free;
							$scope.input.project.push($scope.data.project[index].project);
						}
					}else{					
							$scope.input.sum=0;	
					}
				});	
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
	$scope.rest=function(){
				initial();
				$scope.select2card.val("").trigger("change");
	}
	$scope.submit=function(){
	//	console.log($scope.input.sum);
		if (Number($scope.input.sum) > Number($scope.info.balance)){
			toastr.warning('余额不足','警告');
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
					toastr.error(response.data.error,'错误');
				}else{
					toastr.success("操作成功",'Succusee');				
				}
				$scope.data =response.data.result;
				$scope.select2card.val("").trigger("change");
//				
			});
		}
	}
})
app.controller('register', function($scope,uiGridConstants,$http,toastr) {
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
	$scope.gridOptions.data=$scope.data;
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
					toastr.error(response.data.error,'错误');
				}else{
					toastr.success("操作成功",'Succusee');
				}
				$scope[data_type]="";
				$scope.gridOptions.data =response.data.result;
			});
	}
})
app.controller('deposit', function($scope,$http,$filter,toastr) {
	$scope.store=clone($scope.result);
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
					toastr.error(response.data.error,'错误');
				}else{
					toastr.success("操作成功",'Succusee');
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
app.controller('record', function($scope,uiGridConstants,$http,toastr) {
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
	$scope.gridOptions.data=$scope.data;
})
app.controller('project', function($scope,$http,toastr) {
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
					toastr.error(response.data.error,'错误');
				}else{
					toastr.success("操作成功",'Succusee');
				}
				$scope[data_type]="";
				$scope.result =response.data.result;
			});
	}
})
app.controller('mvip', function($scope,$http,toastr) {
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
					toastr.error(response.data.error,'错误');
				}else{
					toastr.success("操作成功",'Succusee');
				}
				$scope[data_type]="";
				$scope.result =response.data.result;
			});
	}
})
app.controller('free', function($scope,$http,toastr) {
	$scope.gridOptions = {};
	var array=new Array();
	array=[{name:'rank',displayName:"会员等级",enableCellEdit: false}];
	$scope.gridOptions.columnDefs=array.concat($scope.data.title);
	$scope.gridOptions.data=$scope.data.result;
    $scope.operate=function(operate,value){
		$scope[operate].modal('toggle');
	}
	 $scope.gridOptions.onRegisterApi = function(gridApi){
          //set gridApi on scope
          $scope.gridApi = gridApi;
          gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
//			  console.log(colDef.name);
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
						toastr.error(response.data.error,'错误');
						rowEntity[colDef.name]=oldValue;
				}else{
					toastr.success("操作成功",'Succusee');
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