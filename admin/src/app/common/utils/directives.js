/***
 GLobal Directives
 ***/
(function () {
    'use strict';

    var EQA = angular.module('EQA');

    // Route State Load Spinner(used on page or content load)
    EQA.directive('ngSpinnerBar', ['$rootScope',
        function ($rootScope) {
            return {
                link: function (scope, element, attrs) {
                    
                    // by defult hide the spinner bar
                    element.addClass('hide'); // hide spinner bar by default

                    // display the spinner bar whenever the route changes(the content part started loading)
                    $rootScope.$on('$stateChangeStart', function () {
                        element.removeClass('hide'); // show spinner bar
                    });

                    // hide the spinner bar on rounte change success(after the content loaded)
                    $rootScope.$on('$stateChangeSuccess', function () {
                        element.addClass('hide'); // hide spinner bar
                        $('body').removeClass('page-on-load'); // remove page loading indicator

                        Layout.setSidebarMenuActiveLink('match'); // activate selected link in the sidebar menu

                        // auto scorll to page top
                        setTimeout(function () {
                            App.scrollTop(); // scroll to the top on content load
                        }, $rootScope.settings.layout.pageAutoScrollOnLoad);
                    });

                    // handle errors
                    $rootScope.$on('$stateNotFound', function () {
                        element.addClass('hide'); // hide spinner bar
                    });

                    // handle errors
                    $rootScope.$on('$stateChangeError', function () {
                        element.addClass('hide'); // hide spinner bar
                    });

                    // handle errors
                    $rootScope.$on('$unauthorized', function () {
                        element.addClass('hide'); // hide spinner bar
                    });
                }
            };
        }
    ]);

    // Handle global LINK click
    EQA.directive('a', function () {
        return {
            restrict: 'E',
            link: function (scope, elem, attrs) {
                if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                    elem.on('click', function (e) {
                        e.preventDefault(); // prevent link click for above criteria
                    });
                }
            }
        };
    });

    // Handle Dropdown Hover Plugin Integration
    EQA.directive('dropdownMenuHover', function () {
        return {
            link: function (scope, elem) {
                elem.dropdownHover();
            }
        };
    });

    // Apply external libs to SELECT elements
    EQA.directive('select', function () {
        return {
            restrict: 'E',
            link: function (scope, elem, attrs) {
                if (elem.hasClass('select2') || elem.hasClass('select2-multiple')) {
                    elem.select2({
                        allowClear: elem.hasClass('allow-clear'),
                        placeholder: attrs.placeholder,
                        width: null
                    });
                }
            }
        };
    });

    /**
     * Required for ui-select
     */
    EQA.directive('uiSelectRequired', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ctrl) {
                ctrl.$validators.uiSelectRequired = function (modelValue, viewValue) {
                    if (attr.uiSelectRequired) {
                        var isRequired = scope.$eval(attr.uiSelectRequired)
                        if (isRequired == false)
                            return true;
                    }
                    var determineVal;
                    if (angular.isArray(modelValue)) {
                        determineVal = modelValue;
                    } else if (angular.isArray(viewValue)) {
                        determineVal = viewValue;
                    } else if (angular.isObject(modelValue)) {
                        determineVal = angular.equals(modelValue, {}) ? [] : ['true'];
                    } else if (angular.isObject(viewValue)) {
                        determineVal = angular.equals(viewValue, {}) ? [] : ['true'];
                    } else {
                        return false;
                    }
                    return determineVal.length > 0;
                };
            }
        };
    });

    /**
     * Tab component
     */
    EQA.directive('tabdrop', [function () {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                elem.find('.nav-tabs > li > a').on('click', function (ev) {
                    ev.preventDefault();
                });

                elem.tabdrop({align: 'left'});
            }
        };
    }]);

    /**
     * Modal draggable
     */
    EQA.directive('modalMovable', ['$document',
        function ($document) {
            return {
                restrict: 'AC',
                link: function (scope, elem, attrs) {
                    var startX = 0,
                        startY = 0,
                        x = 0,
                        y = 0;

                    var dialogWrapper = elem.parent();
                    var dialogHeader = dialogWrapper.find('.modal-header');

                    dialogHeader.css('cursor', 'move');

                    dialogWrapper.css({
                        position: 'relative'
                    });

                    dialogHeader.on('mousedown', function (event) {
                        // Prevent default dragging of selected content
                        event.preventDefault();
                        startX = event.pageX - x;
                        startY = event.pageY - y;
                        $document.on('mousemove', mousemove);
                        $document.on('mouseup', mouseup);

                        dialogHeader.css('background-color', '#f8f8f8');
                    });

                    function mousemove(event) {
                        y = event.pageY - startY;
                        x = event.pageX - startX;
                        dialogWrapper.css({
                            top: y + 'px',
                            left: x + 'px'
                        });
                    }

                    function mouseup() {
                        $document.unbind('mousemove', mousemove);
                        $document.unbind('mouseup', mouseup);

                        dialogHeader.css('background-color', '#ffffff');
                    }
                }
            };
        }
    ]);

    /**
     * Replace the ng-include node with the included contents
     */
    EQA.directive('includeReplace', function () {
        return {
            require: 'ngInclude',
            restrict: 'A',
            link: function (scope, el, attrs) {
                el.replaceWith(el.children());
            }
        };
    });

    /**
     * Toggle details
     */
    EQA.directive('toggleView', function () {
        return {
            restrict: 'A',
            link: function ($scope, $elem, $attrs) {
                var target = $attrs.target || '';

                $elem.on('click', function () {
                        var $fa = $elem.find('i.fa');
                        if (target != '') {
                            var $target = $(target);
                            if ($target.hasClass('hidden')) {
                                $target.removeClass('hidden');
                                $fa.removeClass('fa-caret-down').addClass('fa-caret-up');
                            } else {
                                $target.addClass('hidden');
                                $fa.removeClass('fa-caret-up').addClass('fa-caret-down');
                            }
                        }
                    }
                );
            }
        };
    });

    /**
     * On key press
     */
    EQA.directive('onKeyPress', [function () {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attrs) {
                $element.bind("keypress", function (event) {
                    var keyCode = event.which || event.keyCode;

                    if (keyCode == $attrs.whenKeyCode) {
                        $scope.$apply(function () {
                            $scope.$eval($attrs.onKeyPress, {$event: event});
                        });

                    }
                });
            }
        };
    }]);

    /**
     * Apply styles for login screen
     */
    EQA.directive('loginScreen', [function () {
        return {
            restrict: 'AC',
            link: function (scope, elem, attrs) {
                var $body = $('body');

                if ($body.hasClass('public-pages')) {
                    $body.removeClass('public-pages');
                }

                if (!$body.hasClass('login')) {
                    $body.addClass('login');
                }
            }
        };
    }]);

    /**
     * Apply styles for admin page
     */
    EQA.directive('adminScreen', [function () {
        return {
            restrict: 'AC',
            link: function (scope, elem, attrs) {
                var $body = $('body');

                if ($body.hasClass('login')) {
                    $body.removeClass('login');
                }
            }
        };
    }]);

    EQA.directive('slimScroll', [function () {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {

                var color = attrs.color || '#910000';
                var height = attrs.containerHeight || '400px';

                elem.slimScroll({
                    color: color,
                    size: '5px',
                    height: height,
                    alwaysVisible: true,
                    railVisible: true,
                    railColor: '#910000',
                    railOpacity: 0.1,
                    disableFadeOut: true,
                    allowPageScroll: false,
                });
            }
        };
    }]);

    EQA.directive('webuiPopover', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                var url = attrs.url || '#';
                var title = attrs.title || '';
                var moveTo = attrs.moveTo || '';
                var targetType = attrs.targetType || '';

                var popover = elem.webuiPopover({
                    url: url,
                    title: title,
                    placement: 'bottom',
                    type: 'html',
                    closeable: true,
                    arrow: false,
                    trigger: 'manual',
                    animation: 'pop',
                    backdrop: false,
                    dismissible: true,
                    onHide: function ($element) {
                        if (moveTo != '') {
                            if (targetType == 'ui-select') {
                                var uiSelect = angular.element($(moveTo).get(0)).controller('uiSelect');
                                $timeout(function () {
                                    uiSelect.activate(false, true);
                                }, 50);
                            } else {
                                $(moveTo).focus();
                            }
                        }
                    }
                });

                elem.on('focus', function () {
                    popover.webuiPopover('show');
                    $(this).trigger('blur');
                });

                $(url).find('button.btn').on('click', function () {
                    popover.webuiPopover('hide');
                });
            }
        };
    }]);

    EQA.directive('datetimeFormat', ['$parse', '$filter', function ($parse, $filter) {
        var directive = {
            restrict: 'A',
            require: ['ngModel'],
            link: link
        };
        return directive;

        function link(scope, element, attrs, ctrls) {
            var ngModelController = ctrls[0];
            var format = attrs.customFormat || 'dd/MM/yyyy';

            ngModelController.$formatters.push(function (modelValue) {
                if (!modelValue) {
                    return undefined;
                }

                var dt = new Date(modelValue);
                return $filter('date') (dt, format);
            });
        }
    }]);

    EQA.directive('hcPieChart', [function () {
        return {
            restrict: 'E',
            template: '<div></div>',
            scope: {
                title: '@',
                data: '='
            },
            link: function (scope, element) {
                Highcharts.chart(element[0], {
                    chart: {
                        type: 'pie'
                    },
                    title: {
                        text: scope.title
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                            }
                        }
                    },
                    series: [{
                        data: scope.data
                    }]
                });
            }
        };
    }]);

    EQA.directive('hcLineChart', [function () {
        return {
            restrict: 'E',
            template: '<div></div>',
            scope: {
                title: '@',
                subtitle: '@',
                data: '='
            },
            link: function (scope, element) {
                Highcharts.chart(element[0], {
                    chart: {
                        type: 'line'
                    },
                    title: {
                        text: scope.title
                    },
                    subtitle: {
                        text: 'Source: WorldClimate.com'
                    },
                    plotOptions: {
                        line: {
                            dataLabels: {
                                enabled: true
                            },
                            enableMouseTracking: false
                        }
                    },
                    series: [{
                        data: scope.data
                    }]
                });
            }
        };
    }]);

})();
