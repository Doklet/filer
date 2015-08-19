'use strict';

angular.module('filerApp')
  .service('Client', function() {

    var _sessionId;
    var _docletId;

    var _account;

    this.getSessionId = function() {
      return _sessionId;
    };

    this.setSessionId = function(sessionId) {
      _sessionId = sessionId;
    };

    this.getDocletId = function() {
      return _docletId;
    };

    this.setDocletId = function(docletId) {
      _docletId = docletId;
    };

    this.getAccount = function() {
      return _account;
    };

    this.setAccount = function(account) {
      _account = account;
    };

  });
