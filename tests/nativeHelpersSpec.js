describe('Interpreter Native helpers', function () {
  it('should wrap native object', function () {
    var nativeObject = {
      val: 'some Value'
    };

    var initInterpreter = function (interpreter, scope) {
      var helper = new NativeHelper(interpreter);
      interpreter.setProperty(scope, 'wrappedObject',
        helper.nativeValueToInterpreter(nativeObject));
    };

    var code = 'wrappedObject.val';
    var myInterpreter = new Interpreter(code, initInterpreter);
    myInterpreter.run();
    expect(myInterpreter.value.data).toBe(nativeObject.val);
  });

  it('should wrap function in native object', function () {
    var nativeObject = {
      someFunction: function (n) {
        return n + 1;
      }
    };

    var initInterpreter = function (interpreter, scope) {
      var helper = new NativeHelper(interpreter);
      interpreter.setProperty(scope, 'wrappedObject',
        helper.nativeValueToInterpreter(nativeObject));
    };

    var code = 'wrappedObject.someFunction(5)';
    var myInterpreter = new Interpreter(code, initInterpreter);
    myInterpreter.run();
    expect(myInterpreter.value.data).toBe(6);
  });

  it('should wrap arrays in native object', function () {
    var nativeObject = {
      someArray: [1, 2, 3]
    };

    var initInterpreter = function (interpreter, scope) {
      var helper = new NativeHelper(interpreter);
      interpreter.setProperty(scope, 'wrappedObject',
        helper.nativeValueToInterpreter(nativeObject));
    };

    var code = 'wrappedObject.someArray.push(5);' +
      'wrappedObject.someArray.length';
    var myInterpreter = new Interpreter(code, initInterpreter);
    myInterpreter.run();
    expect(myInterpreter.value.data).toBe(4);
  });

  it('should send arrays to wrapped functions', function () {
    var nativeObject = {
      someFunction: function(arr) {
        return arr.length * arr[1];
      }
    };

    var initInterpreter = function (interpreter, scope) {
      var helper = new NativeHelper(interpreter);
      interpreter.setProperty(scope, 'wrappedObject',
        helper.nativeValueToInterpreter(nativeObject));
    };

    var code = 'var arr = [1,2,3];' +
      'wrappedObject.someFunction(arr)';
    var myInterpreter = new Interpreter(code, initInterpreter);
    myInterpreter.run();
    expect(myInterpreter.value.data).toBe(3 * 2);
  });
});