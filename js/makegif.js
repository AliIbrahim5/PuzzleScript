function makeGIF() {
	var randomseed = RandomGen.seed;
	levelEditorOpened=false;
	var targetlevel=curlevel;
	var gifcanvas = document.createElement('canvas');
	gifcanvas.width=screenwidth*cellwidth;
	gifcanvas.height=screenheight*cellheight;
	gifcanvas.style.width=screenwidth*cellwidth;
	gifcanvas.style.height=screenheight*cellheight;

	var gifctx = gifcanvas.getContext('2d');

	var inputDat = inputHistory.concat([]);
	

	unitTesting=true;
	levelString=compiledText;



	var encoder = new GIFEncoder();
	encoder.setRepeat(0); //auto-loop
	encoder.setDelay(200);
	encoder.start();

	compile(["loadLevel",curlevel],levelString,randomseed);
	canvasResize();
	redraw();
	gifctx.drawImage(canvas,-xoffset,-yoffset);
  	encoder.addFrame(gifctx);
	var autotimer=0;

  	for(var i=0;i<inputDat.length;i++) {
  		var realtimeframe=false;
		var val=inputDat[i];
		if (val==="undo") {
			DoUndo(false,true);
		} else if (val==="restart") {
			DoRestart();
		} else if (val=="tick") {			
			processInput(-1,false,false);
			realtimeframe=true;
		} else {
			processInput(val|0,false,false);
		}
		redraw();
		gifctx.drawImage(canvas,-xoffset,-yoffset);
		encoder.addFrame(gifctx);
		encoder.setDelay(realtimeframe?autotickinterval:repeatinterval);
		autotimer+=repeatinterval;

		while (againing) {
			processInput(-1,false,false);		
			redraw();
			encoder.setDelay(againinterval);
			gifctx.drawImage(canvas,-xoffset,-yoffset);
	  		encoder.addFrame(gifctx);	
		}
	}

  	encoder.finish();
  	var dat = 'data:image/gif;base64,'+encode64(encoder.stream().getData());
  	window.open(dat);
  	
  	unitTesting = false;
}