define(function (require) {
  // get the kibana/metric_vis module, and make sure that it requires the "kibana" module if it
  // didn't already
  var module = require('modules').get('kibana/metric_vis', ['kibana']);

  module.controller('KbnMetricVisController', function ($scope, Private) {
    var tabifyAggResponse = Private(require('components/agg_response/tabify/tabify'));

    var metrics = $scope.metrics = [];

    var pad = function (num) {
      if (num < 10) {
        return '00' + num.toString();
      } else if (num < 100) {
        return '0' + num.toString();
      } else {
        return num.toString();
      }
    };

    var commaify = function (num) {
      var result = [];
      num = parseInt(num, 10);
      while (num >= 1000) {
        result.unshift(pad(num % 1000));
        num = Math.floor(num / 1000);
      }
      result.unshift(num);
      return result.join(',');
    };

    $scope.processTableGroups = function (tableGroups) {
      tableGroups.tables.forEach(function (table) {
        table.columns.forEach(function (column, i) {
          var fieldFormatter = table.aggConfig(column).fieldFormatter();
          var finalVal = commaify(fieldFormatter(table.rows[0][i]));
          metrics.push({
            label: column.title,
            value: finalVal
          });
        });
      });
    };

    $scope.$watch('esResponse', function (resp) {
      if (resp) {
        metrics.length = 0;
        $scope.processTableGroups(tabifyAggResponse($scope.vis, resp));
      }
    });
  });
});