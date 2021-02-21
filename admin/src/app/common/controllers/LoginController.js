(function () {
    'use strict';

    angular.module('EQA.Common').controller('LoginController', LoginController);

    LoginController.$inject = [
        '$rootScope',
        '$scope',
        '$state',
        '$cookies',
        '$http',
        'settings',
        'constants',
        'LoginService',
        'toastr',
        'focus',
        'blockUI',
        '$timeout'
    ];

    function LoginController($rootScope, $scope, $state, $cookies, $http, settings, constants, service, toastr, focus, blockUI, $timeout) {
        var vm = this;
        vm.user = {};

        vm.login = function () {

            blockUI.start();

            // Username?
            if (!vm.user.username || vm.user.username.trim() == '') {
                blockUI.stop();

                toastr.error('Vui lòng nhập tên đăng nhập.', 'Thông báo');
                focus('username');
                return;
            }

            // Password?
            if (!vm.user.password || vm.user.password.trim() == '') {
                blockUI.stop();

                toastr.error('Vui lòng nhập mật khẩu.', 'Thông báo');
                focus('password');
                return;
            }

            $timeout(function() {
                blockUI.stop();
                $state.go('application.dashboard');
            }, 300);

            // service.performLogin(vm.user).then(function(response) {
            //     console.log(response);
            //     if (response && angular.isObject(response.data)) {
            //
            //         $http.get(settings.api.baseUrl + settings.api.apiV1Url + 'users/getCurrentUser').success(function (response, status, headers, config) {
            //             $rootScope.currentUser = response;
            //             $cookies.putObject(constants.cookies_user, $rootScope.currentUser);
            //
            //             blockUI.stop();
            //
            //             $state.go('application.dashboard');
            //         });
            //     } else {
            //         blockUI.stop();
            //         toastr.error('Something wrong happened. Please try again later.', 'Error');
            //     }
            // }).catch(function () {
            //     blockUI.stop();
            // });
        };

        // Focus on username field
        focus('username');
    }

})();