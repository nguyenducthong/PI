(function () {

    'use strict';

    /* Setup global constants */
    EQA.constant('constants', {
        cookies_user: 'eqa.user',
        oauth2_token: 'token'
    });

    /* Setup global settings */
    EQA.factory('settings', ['$rootScope', '$state', 'constants', function ($rootScope, $state, constants) {
        // supported languages
        var settings = {
            layout: {
                pageSidebarClosed: false, // sidebar menu state
                pageContentWhite: true, // set page content layout
                pageBodySolid: true, // solid body color state
                pageAutoScrollOnLoad: 1000 // auto scroll to top on page load,
            },
            locale: 'vi',
            assetsPath: 'assets',
            api: {
                baseUrl: EQA.API_SERVER_URL,
                apiV1Url: EQA.API_V1,
                clientId: EQA.API_CLIENT_ID,
                clientKey: EQA.API_CLIENT_KEY,
                oauth: {
                    token: constants.oauth2_token
                }
            },
            upload: {
                maxFilesize: '5MB'
            }
        };

        $rootScope.settings = settings;

        return settings;
    }]);

    /**
     * Set focus on element
     */
    EQA.factory('focus', ['$timeout', '$window', function ($timeout, $window) {
        return function (id) {
            $timeout(function () {
                var element = $window.document.getElementById(id);
                if (element)
                    element.focus();
            });
        };
    }]);

    /**
     * Invoke bstable API
     */
    EQA.factory('bsTableAPI', ['$window', function ($window) {
        return function (id, api, parameter) {
            var element = $window.document.getElementById(id);
            if (element && element.hasAttribute('bs-table-control')) {
                return $(element).bootstrapTable(api, parameter);
            }
        };
    }]);

    /**
     * Invoke fullcalendar API
     */
    EQA.factory('fullCalendarAPI', ['$window', function ($window) {
        return function (id, api) {
            var element = $window.document.getElementById(id);
            if (element && element.hasAttribute('fc')) {
                return $(element).fullCalendar(api);
            }
        }
    }]);

    /**
     * No server response interceptor
     */
    EQA.factory('ServerExceptionHandlerInterceptor', [
        '$q',
        'toastr',
        '$cookies',
        '$injector',
        'constants',
        function ($q, toastr, $cookies, $injector, constants) {
            return {
                responseError: function (rejection) {
                    if (rejection.status <= 0) {
                        toastr.warning('Không thể kết nối đến máy chủ.', 'Cảnh báo');
                        return;
                    }

                    if (rejection.status == 400) {
                        toastr.error('Có lỗi xảy ra. Xin vui lòng thử lại trong ít phút.', 'Lỗi (400)');
                    }

                    if (rejection.status == 401) {
                        // Force refresh token in application.run()
                    }

                    if (rejection.status == 403) {
                        toastr.error('Bạn không được phép thực hiện thao tác này.', 'Lỗi (403)');
                    }

                    if (rejection.status == 500) {
                        toastr.error('Hệ thống đang gặp trục trặc. Vui lòng thử lại sau.', 'Lỗi (500)');
                    }

                    return $q.reject(rejection);
                }
            };
        }
    ]);

})();