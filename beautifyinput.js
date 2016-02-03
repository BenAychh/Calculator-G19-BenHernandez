var UpdateInput = {
  delay: 150,        // delay after keystroke before updating
  preview: null,     // filled in by Init below
  buffer: null,      // filled in by Init below
  timeout: null,     // store setTimout id
  mjRunning: false,  // true when MathJax is processing
  oldText: null,     // used to check if an update is needed
  oldTextClean: null,
  currentDiv: 0,
  input: null,
  timeoutRunning: false,

  /**
   * Running - Returns true if math is being formatted.
   *
   * @return {bool}  true if running, false otherwise.
   */
  Running: function() {
    return (this.mjRunning || this.timeoutRunning);
  },

  /**
   * Start - Initializes the hidden divs and input
   *
   * @return {undefined}
   */
  Start: function () {
    var previews = document.getElementsByClassName("inputResult");
    this.preview = previews[previews.length - 1];
    this.buffer = document.getElementById("buffer");
    this.input = document.getElementById("expression");
  },

  /**
   * Update - Called when the input is changed.
   *
   * @return {undefined}
   */
  Update: function () {
    // Get the latest preview div on the screen.
    var previews = document.getElementsByClassName("inputResult");
    this.preview = previews[previews.length - 1];
    // If we are already running a timeout, restart it, we had more input.
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    // Set a timeout to create the preview.
    this.timeout = setTimeout(this.callback, this.delay);
    // For our Running function.
    this.timeoutRunning = true;
  },

  /**
   * CreatePreview - Calls MathJax to start creating a preview from our hidden
   * buffer div.
   *
   * @return {undefined}
   */
  CreatePreview: function() {
    // Stop the timer, we have been called (needed?)
    this.timeout = null;
    // We are already processing, don't do it yet but try again in a moment.
    if (this.mjRunning) {
      setTimeout(this.callback, this.delay);
      return;
    }
    // Get the input as a string.
    this.oldTextClean = document.getElementById("expression").value + '';
    // Put the mathjax processing escape characters around our expression.
    var text = '`' + this.oldTextClean + '`';
    // Nothing has changed, don't process again.
    if (text === this.oldtext) {
      return;
    }
    // Set the hidden buffer div to the text.
    this.buffer.innerHTML = this.oldtext = text;
    // Now MathJax is running.
    this.mjRunning = true;
    // Que up processing on the buffer then call this.DrawMath.
    MathJax.Hub.Queue(
      ["Typeset",MathJax.Hub,this.buffer],
      ["DrawMath",this]
    );
  },

  /**
   * DrawMath - Our math has been processed, it's time to copy it
   *            over.
   *
   * @return {undefined}
   */
  DrawMath: function () {
    // Copy the processed math over to our visible div.
    this.preview.innerHTML = this.buffer.innerHTML;
    // Remove the MathJax escape characters.
    var theInput = this.oldtext.replace('`', '');
    // This stores the simple value for our calculation.
    this.preview.setAttribute('data-input', this.oldTextClean.replace('‸', ''));
    // We are no longer running anything.
    this.mjRunning = false;
    this.timeoutRunning = false;
  },
};
// Some initializers.
UpdateInput.callback = MathJax.Callback(["CreatePreview",UpdateInput]);
UpdateInput.callback.autoReset = true;  // make sure it can run more than once
