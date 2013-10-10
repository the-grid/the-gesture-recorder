(function (context) {
  var Recorder = function (container, options) {
  if (!options) {
    options = {};
  }

  if (!options.events) {
    options.events = ['mousedown', 'mouseup', 'mousemove', 'touchstart', 'touchend', 'touchmove'];
  }

  this.listenTo = options.events;
  this.container = container;
  this.record = function (event) {
    this.recordEvent(event);
  }.bind(this);
};

Recorder.prototype.start = function () {
  this.events = [];
  this.listenTo.forEach(function (event) {
    this.container.addEventListener(event, this.record, false); 
  }.bind(this));
};

Recorder.prototype.recordEvent = function (event) {
  event.preventDefault();
  var eventTime = new Date().getTime();
  if ((event.type == 'touchstart' || event.type == 'mousedown') && !this.startTime) {
    this.startTime = eventTime;
  }
  if (!this.startTime) {
    return;
  }

  var eventData = {
    type: event.type,
    at: eventTime - this.startTime,
    x: event.clientX,
    y: event.clientY
  };

  if (event.targetTouches) {
    eventData.touches = [];
    for (var i = 0; i < event.targetTouches.length; i++) {
      eventData.touches.push({
        x: event.targetTouches[i].clientX,
        y: event.targetTouches[i].clientY
      });
    }
  }

  this.events.push(eventData);

  if (event.type == 'touchend' || event.type == 'mouseup') {
    this.stop();
  }
};

Recorder.prototype.stop = function () {
  this.startTime = null;
  this.listenTo.forEach(function (event) {
    this.container.removeEventListener(event, this.record, false); 
  }.bind(this));
  if (this.onStop) {
    this.onStop();
  }
};

Recorder.prototype.get = function () {
  return this.events;
};

context.GestureRecorder = Recorder;
})(this);
