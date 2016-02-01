var UpdateInput = {
  delay: 0,        // delay after keystroke before updating
  preview: null,     // filled in by Init below
  buffer: null,      // filled in by Init below
  timeout: null,     // store setTimout id
  mjRunning: false,  // true when MathJax is processing
  oldText: null,     // used to check if an update is needed
  oldTextClean: null,
  currentDiv: 0,
  input: null,
  timeoutRunning: false,
  Running: function() {
    return (this.mjRunning || this.timeoutRunning);
  },
  Start: function () {
    var previews = document.getElementsByClassName("inputResult");
    this.preview = previews[previews.length - 1];
    this.buffer = document.getElementById("buffer");
    this.input = document.getElementById("expression");
  },
  Update: function () {
    var previews = document.getElementsByClassName("inputResult");
    this.preview = previews[previews.length - 1];
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(this.callback,this.delay);
    this.timeoutRunning = true;
  },
  CreatePreview: function() {
    this.timeout = null;
    if (this.mjRunning) {
      return;
    }
    this.oldTextClean = document.getElementById("expression").value + '';
    var text = '`' + this.oldTextClean + '`';
    if (text === this.oldtext) {
      return;
    }
    this.buffer.innerHTML = this.oldtext = text;
    this.mjRunning = true;
    MathJax.Hub.Queue(
      ["Typeset",MathJax.Hub,this.buffer],
      ["DrawMath",this]
    );
  },
  DrawMath: function () {
    this.preview.innerHTML = this.buffer.innerHTML;
    var theInput = this.oldtext.replace('`', '');
    this.preview.setAttribute('data-input', '(' + this.oldTextClean.replace('‸', '') + ')');
    this.mjRunning = false;
    this.timeoutRunning = false;
  },
};
UpdateInput.callback = MathJax.Callback(["CreatePreview",UpdateInput]);
UpdateInput.callback.autoReset = true;  // make sure it can run more than once
