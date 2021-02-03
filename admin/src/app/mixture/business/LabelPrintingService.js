(function () {
    'use strict';

    angular.module('EQA.Mixture').service('LabelPrintingService', LabelPrintingService);

    LabelPrintingService.$inject = [
        '$http',
        '$q',
        '$filter',
        'settings',
        'Utilities'
    ];

    function LabelPrintingService($http, $q, $filter, settings, utils) {
        var self = this;
        var baseUrl = settings.api.baseUrl + settings.api.apiV1Url;

    }
})();