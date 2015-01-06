describe('Interpreter', function() {
  it('should run and return value', function() {
    var code = '2 + 3';
    var myInterpreter = new Interpreter(code);
    myInterpreter.run();
    expect(myInterpreter.value.data).toBe(5);
  });
});
