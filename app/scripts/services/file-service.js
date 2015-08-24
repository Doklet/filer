'use strict';


angular.module('filerApp')
  .service('FileService', function($http) {

    this.getFileInfo = function(accountId, path) {
      return $http.get('/api/account/' + accountId +'/file_info/' + path);
    };

    this.downloadFile = function(accountName, path) {
    	return $http.get('/api/account/' + accountId +'/file_info/' + path);
    };

  });
