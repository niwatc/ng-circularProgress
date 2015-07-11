var indicator = angular.module('indicator', []);

indicator.directive('circularProgress', [function (){
    return {
        restrict: 'AE',
        replace: true,
        transclude: true,
        controller: function($scope, $element, $attrs){
            var canvasWidth = $element.attr('width'),
                canvasHeight = $element.attr('height'),
                circle = $element.find('circle')[0],
                radius = circle.r.baseVal.value;

            $scope.radius = radius;
            $scope.canvasWidth = canvasWidth;
            $scope.canvasHeight = canvasHeight;
            $scope.spacing = 0.9;

            function convertToRads(angle){
                return angle * (Math.PI / 180) + Math.PI;
            }

            function findDegress(percentage){
                return 360 * percentage;
            }

            function getArcValues(index, radius, spacing){
                return {
                    innerRadius: (index + spacing) * radius,
                    outerRadius: (index + spacing) * radius
                };
            }

            $scope.buildArc = function(){
                return d3
                        .svg
                        .arc()
                        .innerRadius(function(d){
                            return d.innerRadius;
                        })
                        .outerRadius(function(d){
                            return d.outerRadius;
                        })
                        .startAngle(Math.PI)
                        .endAngle(function(d){
                            return d.endAngle;
                        });
            };

            $scope.getArcInfo = function(index, value, radius, spacing){
                var end = findDegress(value),
                    arcValues = getArcValues(index, radius, spacing);
                return {
                    innerRadius: arcValues.innerRadius,
                    outerRadius: arcValues.outerRadius,
                    endAngle: convertToRads(end),
                    startAngle: Math.PI
                };
            };

            $scope.tweenArc = function(b, arc){
                return function(a) {
                    var i = d3.interpolate(a, b);
                    for(var key in b){
                        a[key] = b[key];
                    }
                    return function(t) {
                        return arc(i(t));
                    };
                };
            }
        },
        templateUrl: 'indicator.html',
        link: function(scope, element, attrs){
            scope.actual_formatted = scope.innercurrent;
            scope.actual_formatted = scope.innercurrent;
        },
        scope: {
            innercurrent: '@',
            innertotal: '@',
            outercurrent: '@',
            outertotal: '@'
        }
    };
}]);

indicator.directive('pathGroup', function(){
    return {
        requires: '^circularProgress',
        link: function(scope, element, attrs, ctrl){
            element
                .attr(
                    "transform",
                    "translate("+ scope.canvasWidth/2 + "," + scope.canvasHeight/2 + ")"
                );
        }
    };
});

indicator.directive('innerPath', function(){
    return {
        restrict: 'A',
        transclude: true,
        requires: '^pathGroup',
        link: function(scope, element, attrs, ctrl){
            var arc = d3.select(element[0]),
                arcObject = scope.buildArc(),
                innerArc = scope.getArcInfo(1.0, scope.innercurrent/scope.innertotal, scope.radius, 0.05),
                end = innerArc.endAngle;

            innerArc.endAngle = Math.PI;
            arc
                .datum(innerArc)
                .attr('d', arcObject)
                .transition()
                .delay(100)
                .duration(2000)
                .attrTween("d", scope.tweenArc({
                    endAngle: end
                }, arcObject));
        }
    };
});


indicator.directive('outerPath', function(){
    return {
        restrict: 'A',
        transclude: true,
        requires: '^pathGroup',
        link: function(scope, element, attrs){
            var arc = d3.select(element[0]),
                arcObject = scope.buildArc(),
                outerArc = scope.getArcInfo(1.18, scope.outercurrent/scope.outertotal, scope.radius, 0.1),
                end = outerArc.endAngle;

            outerArc.endAngle = Math.PI;
            arc
                .datum(outerArc)
                .attr('d', arcObject)
                .transition()
                .delay(200)
                .duration(2500)
                .attrTween("d", scope.tweenArc({
                    endAngle: end
                }, arcObject));
        }
    };
});
