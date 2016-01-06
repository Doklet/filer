'use strict';

angular.module('filerApp')
  .controller('MainCtrl', function($scope, $location, $window, Client, AccountService, FileService, DocletService, PipeService) {

    $scope.account = undefined;
    $scope.files = undefined;
    $scope.paths = undefined;
    $scope.selectedFile = undefined;

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

      // Store doclets
      DocletService.list()
        .success(function(doclets) {
          Client.setDoclets(doclets);
          $scope.doclets = Client.getDoclets();
        })
        .error(function() {
          $scope.info = undefined;
          $scope.error = 'Failed to fetch doclets';
        });
    }

    $scope.partSelected = function(part) {

      // Set correct breadcrumb path
      var index = $scope.paths.indexOf(part);
      $scope.paths = $scope.paths.splice(0, index + 1);

      // Clear the current fileinfos list
      $scope.files = undefined;
      // Clear selected file 
      $scope.selectedFile = undefined;

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

    $scope.selectFile = function(file) {

      if (file.isDir === false) {
        $scope.selectedFile = file;
      }
    };

    $scope.showDirectory = function(selectedFile) {

      $scope.selectedFile = undefined;

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

    $scope.saveTo = function(dashboard) {

      // Execute the pipe with the provided parameters
      var commands = 'echo';
      var filePath = $scope.account.name + $scope.selectedFile.path;

      var cmd = 'brick --text --name=New --cmds="' + $window.btoa(commands) + '" --bricksid=' + dashboard.id;
      cmd += ' --file="' + filePath + '"';

      PipeService.execute(cmd)
        .success(function() {
          var home = $window.unescape($location.search().home);
          $window.top.location = home + '/' + dashboard.id;
        })
        .error(function() {
          $scope.info = undefined;
          $scope.error = 'Failed to save brick';
        });

    };

  });
