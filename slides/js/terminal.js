window.createTerminal = function(fn) {
  (new BinaryClient('ws://' + window.location.hostname + ':10001')).on('stream', function(stream) {
    // augment the stream with a conversion util
    stream.chunkToString = function(chunk) {
      var p = new Uint8Array(chunk);
      var out = "";

      for (var i=0; i<p.byteLength; i++) {
        out += String.fromCharCode(p[i]);
      }

      return out;
    };

    fn(stream);
  });
};


Reveal.addEventListener( 'slidechanged', function() {
  var slide = Reveal.getCurrentSlide();


  if (slide &&
      slide.webkitMatchesSelector('section.terminal') &&
      !slide.terminalLaunched)
  {
    slide.terminalLaunched = true;
    createTerminal(function(stream) {

      stream.on('data', function(c) {
        slide.querySelector('pre.terminal').innerHTML += stream.chunkToString(c).replace(/\n/g,'<br />');
      });

      var input = slide.querySelector('input.terminal');

      input.addEventListener('keydown', function(ev) {

        if (ev.keyCode === 13) {
          stream.write(input.value + '\n');
          ev.stopImmediatePropagation();
          ev.preventDefault();
          return false;
        }
      }, true);

    });
  }
});
