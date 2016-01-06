'use strict';

angular.module('filerApp')
  .service('DocletService', function($http) {

    this.list = function() {
      return $http.get('/api/doclet');
    };

  });