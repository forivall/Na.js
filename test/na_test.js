'use strict';

var na = require('../lib/na.js');
var P = require('promise-simple');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['na'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'no args': function(test) {
    test.expect(0);
    na({}, function() {
      test.done();
    });
  },
  'one callback': function(test) {
    test.expect(1);
    na({
      $main: function($callback) {
        $callback(1);
      }
    }, function(result) {
      test.equal(result, 1);
      test.done();
    });
  },
  'one promise': function(test) {
    test.expect(1);
    // tests here
    na({
      $main: function() {
        var d = P.defer();
        d.resolve(1);
        return d;
      }
    }, function(result) {
      test.equal(result, 1);
      test.done();
    });
  },
  'one value': function(test) {
    test.expect(1);
    // tests here
    na({
      $main: function() {
        return 1;
      }
    }, function(result) {
      test.equal(result, 1);
      test.done();
    });
  }
};
