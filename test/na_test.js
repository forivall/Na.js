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

// run all of the async.auto tests, converted into Na syntax.
exports['auto'] = function(test){
    var callOrder = [];
    var testdata = [{test: 'test'}];
    var args;
    na({
        task1: function(task2, $callback){
            setTimeout(function(){
                callOrder.push('task1');
                $callback();
            }, 25);
        },
        task2: function($callback){
            setTimeout(function(){
                callOrder.push('task2');
                $callback();
            }, 50);
        },
        task3: function(task2, $callback){
            callOrder.push('task3');
            $callback();
        },
        task4: function(task1, task2, $callback){
            callOrder.push('task4');
            $callback();
        },
        task5: function(task2, $callback){
            setTimeout(function(){
              callOrder.push('task5');
              $callback();
            }, 0);
        },
        task6: function(task2, $callback){
            callOrder.push('task6');
            $callback();
        }
    },
    function(){
        test.same(callOrder, ['task2','task6','task3','task5','task1','task4']);
        test.done();
    });
};

exports['auto petrify'] = function (test) {
    var callOrder = [];
    na({
        task1: function (task2, $callback) {
            setTimeout(function () {
                callOrder.push('task1');
                $callback();
            }, 100);
        },
        task2: function ($callback) {
            setTimeout(function () {
                callOrder.push('task2');
                $callback();
            }, 200);
        },
        task3: function (task2, $callback) {
            callOrder.push('task3');
            $callback();
        },
        task4: function (task1, task2, $callback) {
            callOrder.push('task4');
            $callback();
        }
    },
    function () {
        test.same(callOrder, ['task2', 'task3', 'task1', 'task4']);
        test.done();
    });
};

exports['auto results'] = function(test){
    test.expect(9);
    var callOrder = [];
    na({
      $main: function(task1, task2, task3, task4) {
        test.same(callOrder, ['task2','task3','task1','task4']);
        test.same(task1, ['task1a','task1b']);
        test.same(task2, 'task2');
        test.same(task3, undefined);
        test.same(task4, 'task4');
        test.done();
      },
      task1: function(task2, $callback){
          test.same(task2, 'task2');
          setTimeout(function(){
              callOrder.push('task1');
              $callback(['task1a', 'task1b']);
          }, 25);
      },
      task2: function($callback){
          setTimeout(function(){
              callOrder.push('task2');
              $callback('task2');
          }, 50);
      },
      task3: function(task2, $callback){
          test.same(task2, 'task2');
          callOrder.push('task3');
          $callback();
      },
      task4: function(task1, task2, $callback){
          test.same(task1, ['task1a','task1b']);
          test.same(task2, 'task2');
          callOrder.push('task4');
          $callback('task4');
      }
    });
};

exports['auto error'] = function(test){
    test.expect(1);
    na({
        task1: function($callback){
            throw 'testerror';
        },
        task2: function(task1, $callback){
            test.ok(false, 'task2 should not be called');
            $callback();
        },
        $error: function(err) {
          test.equals(err, 'testerror');
        }
    },
    function(){
      test.ok(false, 'exit callback should not be called');
    });
    setTimeout(test.done, 100);
};

exports['auto no callback'] = function(test){
    na({
        task1: function($callback){$callback();},
        task2: function(task1, $callback){$callback(); test.done();}
    });
};

// TODO: figure out how i want to handle partial results
/*
exports['auto error should pass partial results'] = function(test) {
    async.auto({
        task1: function($callback){
            $callback('result1');
        },
        task2: function($callback){
            var err = new Error('testerror');
            err.data = 'result2';
        },
        task3: function($callback){
            test.ok(false, 'task3 should not be called');
        }
    },
    function(err, results){
        test.equals(err, 'testerror');
        test.equals(results.task1, 'result1');
        test.equals(results.task2, 'result2');
                                test.done();
    });
};
*/

// Issue 24 on github: https://github.com/caolan/async/issues#issue/24
// Issue 76 on github: https://github.com/caolan/async/issues#issue/76
exports['auto removeListener has side effect on loop iterator'] = function(test) {
    na({
        task1: function(task3, $callback) { test.done() },
        task2: function(task3, $callback) { /* by design: DON'T call $callback */ },
        task3: function($callback) { $callback(); }
    });
};
