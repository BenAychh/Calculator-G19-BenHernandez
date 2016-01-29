var UpdateInput = {
  delay: 150,        // delay after keystroke before updating
  preview: null,     // filled in by Init below
  buffer: null,      // filled in by Init below
  timeout: null,     // store setTimout id
  mjRunning: false,  // true when MathJax is processing
  oldText: null,     // used to check if an update is needed
  Start: function () {
    this.preview = document.getElementById("result");
    this.buffer = document.getElementById("buffer");
  },
  Update: function () {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(this.callback,this.delay);
  },
  CreatePreview: function () {
    this.timeout = null;
    if (this.mjRunning) {
      return;
    }
    var text = '`' + document.getElementById("expression").value + '`';
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
    this.mjRunning = false;
    this.preview.innerHTML = this.buffer.innerHTML;
  }

};
UpdateInput.callback = MathJax.Callback(["CreatePreview",UpdateInput]);
UpdateInput.callback.autoReset = true;  // make sure it can run more than once
