import 'core-js';
require('zone.js/dist/zone');

if (ENV !== 'production') {
  Error.stackTraceLimit = Infinity;
  require('zone.js/dist/long-stack-trace-zone');
}
