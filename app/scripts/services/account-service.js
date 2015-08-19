'use strict';


angular.module('filerApp')
  .service('AccountService', function ($http) {

  	this.fetchAccount = function(accountId) {
      return $http.get('/api/account/' + accountId);
    };

  });
