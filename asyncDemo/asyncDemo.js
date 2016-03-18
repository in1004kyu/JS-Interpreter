window.view = {
  codes: [],
  activeIndex: 0,
  selectProcess: function (processIndex) {
    document.getElementById('codeToInterpret').value = this.codes[processIndex];
    this.activeIndex = processIndex;
  },
  updateCode: function () {
    this.codes[this.activeIndex] = document.getElementById('codeToInterpret').value;
  },

  addProcess: function (code) {
    this.codes.push(code);
    var index = this.codes.length - 1;
    this.selectProcess(index);
    var processNameEl = document.createElement('a');
    processNameEl.className = 'processName';
    processNameEl.href = '#';
    processNameEl.innerHTML = 'thread' + index;
    processNameEl.onclick = this.selectProcess.bind(this, index);
    document.getElementById('processDefs').appendChild(processNameEl);
  },
  init: function () {
    var defaultCode = document.getElementById('codePolygon').innerHTML;
    view.addProcess(document.getElementById('codeCount').innerHTML);
    view.addProcess(defaultCode);
    view.addProcess(defaultCode);
    view.addProcess(defaultCode);
    view.addProcess(defaultCode);
  }
};


view.init();

function createInterpreterInitializer(processId) {

  var processesElement = document.getElementById('processes');
  var element = document.createElement('div');
  element.className = 'process';
  element.style.top = processId * 50 + "px";

  var titleElement = document.createElement('span');
  titleElement.innerHTML = 'Thread' + processId;
  titleElement.className = 'processTitle';
  element.appendChild(titleElement);

  var valueElement = document.createElement('span');
  valueElement.className = 'processValue';
  element.appendChild(valueElement);
  processesElement.appendChild(element);


  var turtle = {
    degree: 0,
    processId: processId,
    setText: function (value, progress) {
      valueElement.innerHTML = value;
    },
    forward: function (distance, duration, callback) {
      var radians = this.degree * (Math.PI / 180);
      var dx = distance * Math.cos(radians);
      var dy = distance * Math.sin(radians);
      var result = {
        'top': '+=' + dy,
        'left': '+=' + dx
      };
      $(element).animate(result, duration, callback);
    },

    rotate: function (degree, duration, callback) {
      var that = this;
      $({
        deg: this.degree
      }).animate({
        deg: degree
      }, {
        duration: duration,
        step: function (now) {
          $(element).css({
            transform: 'rotate(' + now + 'deg)'
          });
          that.degree = now;
        },
        done: function () {
          if (callback) {
            callback(null, true);
          }
        }
      });
    },
    left: function (degree, duration, callback) {
      this.rotate(this.degree - degree, duration, callback);
    },
    right: function (degree, duration, callback) {
      this.rotate(this.degree + degree, duration, callback);
    },
    waitForClick: function (callback) {
      var buttonElement = document.createElement('button');
      buttonElement.innerHTML = 'Click Me!';
      buttonElement.onclick = function () {
        callback();
        element.onclick = null;
        element.removeChild(buttonElement);
      };
      element.appendChild(buttonElement);
    }
  };

  return function (interpreter, scope, helper) {
    interpreter.setProperty(scope, 'turtle',
      helper.nativeValueToInterpreter(turtle));
    interpreter.setProperty(scope, 'console',
      helper.nativeValueToInterpreter(window.console));
  };
}
var runner;
var scheduler;
window.runLastProcesss = function() {
  //scheduler.submit(runner, )
  var processId = view.codes.length-1;
  var code = view.codes[processId];
  runner = new AsyncInterpreterRunner(code, createInterpreterInitializer(processId));
  scheduler.submit(runner, 'process' + processId);
}

window.runProcesses = function () {
  document.getElementById('processes').innerHTML = '';
  scheduler = new AsyncScheduler();


  for (var i = 0; i < view.codes.length-1; i++) {
    processId = i;
    var code = view.codes[i];
    runner = new AsyncInterpreterRunner(code, createInterpreterInitializer(processId));
    scheduler.submit(runner, 'process' + processId);
  }

  scheduler.run(function () {
    console.log('done');
  });
};