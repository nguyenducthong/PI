(function () {
    'use strict';

    angular.module('EQA.Common').service('LoginService', LoginService);
    LoginService.$inject = [
        'OAuth'
    ];

    function LoginService(OAuth) {
        var self = this;

        self.performLogin = performLogin;

        /**
         * Perform login
         * @param user
         */
        function performLogin(user) {
            return OAuth.getAccessToken(user, null);
        }
    }

})();