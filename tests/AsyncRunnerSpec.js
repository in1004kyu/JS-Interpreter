describe('Async Runner', function () {
  it('Should execute a blocking function', function (done) {
    var nativeObject = {
      someAsyncFunction: function (n, callback) {
        window.setTimeout(function () {
          callback(null, n + 1);
        }, 100);
      }
    };

    var initInterpreter = function (interpreter, scope, helper) {
      interpreter.setProperty(scope, 'wrappedObject',
        helper.nativeValueToInterpreter(nativeObject));
    };

    var code = 'wrappedObject.someAsyncFunction(5, asyncWait);\n' +
      'asyncResult.result';
    var myInterpreter = new AsyncInterpreterRunner(code, initInterpreter);
    myInterpreter.run(function interpreterDone() {
      expect(myInterpreter.interpreter.value.data).toBe(6);
      done();
    });
  });
});



describe('Async Scheduler', function () {
  it('Should execute multiple threads', function (done) {


    var initInterpreter = function (interpreter, scope, helper) {
      interpreter.setProperty(scope, 'console',
        helper.nativeValueToInterpreter(window.console));
    };


    var scheduler = new AsyncScheduler();
    for (var i = 0; i < 5; i++) {
      var code = 'for (var i = 0; i < 10; i++) {console.log(' + i + ',i);}';
      var runner = new AsyncInterpreterRunner(code, initInterpreter);
      scheduler.submit(runner, 'runner' + i);
    }

    scheduler.run(function () {
      expect(scheduler.queue.length).toBe(0);
      done();
    });
  });
});