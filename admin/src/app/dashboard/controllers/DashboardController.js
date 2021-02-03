(function () {
    'use strict';

    angular.module('EQA.Dashboard').controller('DashboardController', DashboardController);

    DashboardController.$inject = [
        '$rootScope',
        '$scope',
        '$http',
        '$timeout',
        'settings',
        'Utilities'
    ];
    
    function DashboardController ($rootScope, $scope, $http, $timeout, settings, utils) {
        $scope.$on('$viewContentLoaded', function() {
            // initialize core components
            App.initAjax();
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        var vm = this;

        // Chart 1
        Highcharts.chart('chart_1', {
            chart: {
                // type: 'column',
                height: 400,
                style: {
                    fontFamily: 'Quicksand'
                }
            },
            title: {
                text: null
            },
            xAxis: {
                categories: ['Vòng 4', 'Vòng 5', 'Vòng 6', 'Vòng 7', 'Vòng 8', 'Vòng 9', 'Vòng 10', 'Vòng 11', 'Vòng 12']
            },
            yAxis: [{
                min: 0,
                title: {
                    text: '# phòng xét nghiệm tham gia'
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }
            }],
            legend: false,
            tooltip: {
                // headerFormat: '<b>{point.x}</b><br/>',
                // pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
                shared: true
            },
            colors: ['#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce', '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'],
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: false,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                    }
                }
            },
            series: [{
                name: 'Số phòng XN',
                type: 'column',
                data: [25, 67, 95, 130, 133, 135, 145, 157, 160]
            }]
        });

        // Chart 2
        Highcharts.chart('chart_2', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                height: 400,
                style: {
                    fontFamily: 'Quicksand'
                }
            },
            title: {
                text: ''
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            colors: ['#8bbc21', '#910000', '#c42525', '#910000', '#1aadce', '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'],
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{
                name: 'Tỷ lệ',
                colorByPoint: true,
                data: [{
                    name: 'Đúng',
                    y: 12890
                }, {
                    name: 'Sai',
                    y: 1321,
                    sliced: true,
                    selected: true
                }, {
                    name: 'Không nộp',
                    y: 128
                }]
            }]
        });
    }

})();
