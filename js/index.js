
var app=angular.module('myApp',['ui.router','ngAnimate','ui.grid']);
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
		controller:'homeController'
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
						$scope.modal=$(element);
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
app.directive('select2card',function() {
		return{
				restrict: 'A',
				link:function($scope, element, attrs) {
								$(element).select2({placeholder: 'Select a VIP Number'});
								$scope.select2part=$(element);
								$(element).on('select2:select', function (evt) {
										$scope.getlist('card');
								});
				}
		};
});
app.directive('select2',function() {
		return{
				restrict: 'A',
				link:function($scope, element, attrs) {
								$(element).select2({placeholder: 'Select a Phone Number'});
								$(element).on('select2:select', function (evt) {
										$scope.getlist($(element).select2('val'),attrs.select2);
								});
				}
		};
});
app.controller('homeController', function($scope) {
    $scope.pageClass = 'page-home';
})
app.controller('register', function($scope) {
	$scope.data = [
    { name: 'Bob', title: 'CEO' },
    { name: 'Frank', title: 'Lowly Developer' }
  ];
	$scope.register=function(){
		$scope.modal.modal('toggle');
	}
})
app.controller('desposit', function($scope) {
	$scope.list={
		phone:['1111','2222','3333'],
		card:['1111','2222','3333'],
	}
	$scope.getlist=function(value,type){
		console.log('number'+value+'type:'+type);
	}
	$scope.result=[
		{
			number:'1',
			name:'张三',
			sex:'男',
			phone:'2222',
			birthday:'1992-2-2',
			qq:'1333'
		},{	
			number:'2',
			name:'李四',
			sex:'女',
			phone:'1111',
			birthday:'1990-1-1',
			qq:'a123'
		}
	]
	$scope.desposit=function(card_number){
		$scope.modal.modal('toggle');
	}
})
app.controller('record', function($scope) {
	$scope.list={
		phone:['1111','2222','3333'],
		card:['1111','2222','3333'],
	}
	$scope.getlist=function(value,type){
		console.log('number'+value+'type:'+type);
	}
	$scope.result=[
		{
			number:'1',
			name:'张三',
			sex:'男',
			phone:'2222',
			birthday:'1992-2-2',
			qq:'1333',
			date:'2016-11-2 13:54',
			operator:'A',
			record:'5元',
		},{	
			number:'1',
			name:'张三',
			sex:'男',
			phone:'2222',
			birthday:'1992-2-2',
			qq:'1333',
			date:'2016-11-2 14:54',
			operator:'A',
			record:'35元',
		},
	]
})
app.controller('manageController', function($scope) {
    $scope.pageClass = 'page-manage';
})
app.controller('adminController', function($scope) {
    $scope.pageClass = 'page-admin';
})
