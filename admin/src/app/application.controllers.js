(function () {

    'use strict';

    /* Setup App Main Controller */
    EQA.controller('AppController', ['$rootScope', '$scope', '$cookies', '$state', 'constants', 'OAuth',
        function ($rootScope, $scope, $cookies, $state, constants, OAuth) {
            $scope.$on('$viewContentLoaded', function () {
            });

            // Other controller logic
            var user = $cookies.getObject(constants.cookies_user);
            $scope.currentUser = {fullname: ''};

            $rootScope.$on('$onCurrentUserData', function (event, data) {
                if (data != null) {
                    $scope.currentUser = data;
                }
            });

            /**
             * Logout...
             */
            $scope.logout = function () {
                // OAuth.revokeToken();

                $cookies.remove(constants.oauth2_token);
                $state.go('login');
            };

            /**
             * Check if the current user is EQA admin
             */
            $scope.isEqaAdmin = function (user) {
                if (!user || !user.roles || user.roles.length <= 0) {
                    return false;
                }

                var ret = false;
                angular.forEach(user.roles, function (role) {
                    if ("ROLE_ADMIN" == role.name.toUpperCase()
                        || "ROLE_EQA_MANAGEMENT" == role.name.toUpperCase()) {
                        ret = true;
                    }
                });

                return ret;
            };

            /**
             * Check if the current user is EQA participating member only
             */
            $scope.isEqaMember = function (user) {
                if (!user || !user.roles || user.roles.length <= 0) {
                    return false;
                }

                var ret = false;

                return (user.roles.length == 1 && user.roles[0].name.toUpperCase() == 'ROLE_EQA_MEMBER');
            };
        }
    ]);

    /***
     Layout Partials.
     By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial
     initialization can be disabled and Layout.init() should be called on page load complete as explained above.
     ***/

    /* Setup Layout Part - Header */
    EQA.controller('HeaderController', ['$scope', '$state', function ($scope, $state) {
        $scope.$on('$includeContentLoaded', function () {
            Layout.initHeader($state);
            Layout.initContent();
        });
    }]);

    /* Setup Layout Part - Sidebar/Page header */
    EQA.controller('SidebarController', ['$scope', 'settings', function ($scope, settings) {
        $scope.$on('$includeContentLoaded', function () {
            Layout.initSidebar(); // init sidebar
        });
    }]);

    /* Setup Layout Part - Quick Sidebar */
    EQA.controller('QuickSidebarController', ['$rootScope', '$scope', 'toastr', function ($rootScope, $scope, toastr) {
    }]);

    /* Setup Layout Part - Theme Panel */
    EQA.controller('ThemePanelController', ['$scope', function ($scope) {
        $scope.$on('$includeContentLoaded', function () {
            // ThemeSettings.init(); // init theme panel
        });
    }]);

    /* Setup Layout Part - Footer */
    EQA.controller('FooterController', ['$scope', 'settings', function ($scope, settings) {
        $scope.$on('$includeContentLoaded', function () {
            Layout.initFooter();
        });
    }]);

})();