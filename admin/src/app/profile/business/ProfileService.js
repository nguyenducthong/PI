(function () {
    'use strict';

    angular.module('EQA.Profile').service('ProfileService', ProfileService);

    ProfileService.$inject = [
        '$http',
        '$q',
        '$filter',
        'settings',
        'Utilities'
    ];

    function ProfileService($http, $q, $filter, settings, utils) {
        var self = this;
        var baseUrl = settings.api.baseUrl + settings.api.apiV1Url;
    }
})();