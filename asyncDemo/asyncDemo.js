var nativeObject = {
  updateProcessData: function (processId, progress, value) {
    var element = document.getElementById('processValue' + processId);
    element.style.marginLeft = Math.floor(progress * 600) + 'px';
    element.innerHTML = value;
  },
  waitForClick: function (processId, callback) {
    var element = document.getElementById('processValue' + processId);
    element.innerHTML = 'Click to Continue';
    element.onclick = function () {
      element.onclick = null;
      callback(null, true);
    };
  }
};


var initInterpreter = function (interpreter, scope, helper) {
  interpreter.setProperty(scope, 'native',
    helper.nativeValueToInterpreter(nativeObject));
};


window.runProcesses = function () {

  var scheduler = new AsyncScheduler();
  var templateCode = document.getElementById('codeToInterpret').value;
  for (var i = 0; i < 5; i++) {
    var code = templateCode.replace('$processId', i);
    var runner = new AsyncInterpreterRunner(code, initInterpreter);
    scheduler.submit(runner, 'runner' + i);
  }

  scheduler.run(function () {
    console.log('done');
  });
};