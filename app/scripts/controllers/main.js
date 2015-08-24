'use strict';

angular.module('filerApp')
  .controller('MainCtrl', function($scope, $location, $window, Client, AccountService, FileService) {

    $scope.account = undefined;
    $scope.files = undefined;
    $scope.paths = undefined;


    // Show the root files
    if (Client.getAccount() === undefined) {

      // Save doclet id, name and session id in client.
      var docletId = $location.search().docletId;
      if (docletId !== undefined) {
        Client.setDocletId($window.unescape(docletId));
      }

      var sessionId = $location.search().token;
      if (sessionId !== undefined) {
        Client.setSessionId($window.unescape(sessionId));
      }

      var accountId = $window.unescape($location.search().accountId);

      AccountService.fetchAccount(accountId)
        .success(function(account) {
          Client.setAccount(account);
          $scope.account = account;

          // Populate breadcrumb with root after account has been fetched
          $scope.paths = [{
            name: $scope.account.name,
            path: ''
          }];

          // Fetch the file info for the root
          FileService.getFileInfo(accountId, '/')
            .success(function(files) {

              $scope.files = files;
            })
            .error(function() {
              $scope.error = 'Failed to fetch file info';
            });
        })
        .error(function() {
          $scope.error = 'Failed to fetch account';
        });
    }

    $scope.partSelected = function(part) {

      // Set correct breadcrumb path
      var index = $scope.paths.indexOf(part);
      $scope.paths = $scope.paths.splice(0, index + 1);

      // Clear the current fileinfos list
      $scope.files = undefined;

      // Load the fileinfo for the account and path
      FileService.getFileInfo($scope.account.id, part.path)
        .success(function(files) {
          $scope.files = files;
        })
        .error(function() {
          $scope.files = [];
          $scope.info = undefined;
          $scope.error = 'Failed to fetch file info';
        });
    };

    $scope.fileSelected = function(selectedFile) {

      if (selectedFile.isDir === true) {

        // Clear the current fileinfos list
        $scope.files = undefined;

        // Load the fileinfo for the account and path
        FileService.getFileInfo($scope.account.id, selectedFile.path)
          .success(function(files) {
            $scope.files = files;

            $scope.paths.push({
              name: selectedFile.name,
              path: selectedFile.path
            });
          })
          .error(function() {
            $scope.info = undefined;
            $scope.error = 'Failed to fetch fileinfo';
          });

      }
    };

    $scope.computeDownloadUrl = function(fileinfo) {
      var commands = 'pipe=echo';

      var args = '&token=' + Client.getSessionId();
      args += '&input=' + $scope.account.name + fileinfo.path;
      args += '&download=' + fileinfo.name;

      return '/api/pipe/run?' + commands + args;
    };

  });
