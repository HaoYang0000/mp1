
//University of Illinois/NCSA Open Source License
//Copyright (c) 2015 University of Illinois
//All rights reserved.
//
//Developed by: 		Eric Shaffer
//                  Department of Computer Science
//                  University of Illinois at Urbana Champaign
//
//
//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
//documentation files (the "Software"), to deal with the Software without restriction, including without limitation
//the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
//to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
//Redistributions of source code must retain the above copyright notice, this list of conditions and the following
//disclaimers.Redistributions in binary form must reproduce the above copyright notice, this list
//of conditions and the following disclaimers in the documentation and/or other materials provided with the distribution.
//Neither the names of <Name of Development Group, Name of Institution>, nor the names of its contributors may be
//used to endorse or promote products derived from this Software without specific prior written permission.
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
//WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//CONTRIBUTORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
//TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
//DEALINGS WITH THE SOFTWARE.





//--------------------------------------------------------
// A Simple 2D Grid Class
var UGrid2D = function(min_corner,max_corner,resolution){
  this.min_corner=min_corner;
  this.max_corner=max_corner;
  this.resolution=resolution;
  console.log('UGrid2D instance created');
}


// Method: draw_grid
// Draw the grid lines

UGrid2D.prototype.draw_grid = function(canvas){
	  var ctx = canvas.getContext('2d');
	  loc=[0,0];
	  delta = canvas.width/this.resolution;
	  for (var i=0;i<=this.resolution;i++)
	  {
      ctx.beginPath();
	  	ctx.moveTo(i*delta, 0);
      	ctx.lineTo(i*delta, canvas.height-1);
      	ctx.lineWidth = 1;
      	// set line color
      	ctx.strokeStyle = '#000000';
      	ctx.stroke();
	   }
	   loc=[0,0];

	  	delta = canvas.height/this.resolution;

	  for (var i=0;i<=this.resolution;i++)
	  {
      ctx.beginPath();
	  	ctx.moveTo(0,i*delta);
      	ctx.lineTo(canvas.width-1,i*delta);
      	ctx.lineWidth = 1;
      	// set line color
      	ctx.strokeStyle = '#000000';
      	ctx.stroke();
	   }
}

UGrid2D.prototype.contour_map = function(canvas,contour_val) {
  var ctx = canvas.getContext('2d');
  delta = canvas.width/this.resolution;

  var contour_val_array = contour_val.split(";");



  for (var k = 0; k < contour_val_array.length; k++) {
    //Variable to store map mappings
    var map_array = [];

    for (var i=0;i<=this.resolution;i++)
    {
      map_array[i] = new Array();
      for (var j=0;j<=this.resolution;j++)
  	  {
        var x = i*delta;
        var y = j*delta;
        var fval = gaussian(pixel2pt(canvas.width,canvas.height,[-1,1],[-1,1],x,y)).toFixed(2);
        //console.log(fval);
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.fillText(fval,x,y+5);
        // set line color
        ctx.strokeStyle = '#000000';

        if(fval > contour_val_array[k]){
          map_array[i].push(1);
          ctx.fillRect(x,y,10,10);

        }
        else{
          map_array[i].push(0);
        }

  	   }
    }

    //console.log(map_array);


    //Draw contour map
    draw_contour_map(canvas,map_array,this.resolution,contour_val_array[k]);

  }


}

function draw_contour_map(canvas,map_array,resolution,contour_val) {

  var ctx = canvas.getContext('2d');
  var delta = canvas.width/resolution;

    for (var i=0;i<resolution;i++)
    {
      for (var j=0;j<resolution;j++)
  	  {
        var x = i*delta;
        var y = j*delta;
        var fval_lt = gaussian(pixel2pt(canvas.width,canvas.height,[-1,1],[-1,1],x,y));
        var fval_lb = gaussian(pixel2pt(canvas.width,canvas.height,[-1,1],[-1,1],x,(j+1)*delta));
        var fval_rt = gaussian(pixel2pt(canvas.width,canvas.height,[-1,1],[-1,1],(i+1)*delta,y));
        var fval_rb = gaussian(pixel2pt(canvas.width,canvas.height,[-1,1],[-1,1],(i+1)*delta,(j+1)*delta));

        var edge_l = Math.abs( (y*(fval_lb-contour_val) + (j+1)*delta*(contour_val-fval_lt) )/(fval_lb-fval_lt));
        var edge_r = Math.abs((y*(fval_rb-contour_val) + (j+1)*delta*(contour_val-fval_rt) )/(fval_rb-fval_rt));
        var edge_t = Math.abs((x*(fval_rt-contour_val) + (i+1)*delta*(contour_val-fval_lt) )/(fval_lt-fval_rt));
        var edge_b = Math.abs((x*(fval_rb-contour_val) + (i+1)*delta*(contour_val-fval_lb) )/(fval_lb-fval_rb));
        
        var x_half = (x+(i+1)*delta)/2;
        var y_half = (y+(j+1)*delta)/2;
        var x_next = (i+1)*delta;
        var y_next = (j+1)*delta;
        //Left top point
        var lt = map_array[i][j];
        //Left bottom point
        var lb = map_array[i][j+1];
        //Right top point
        var rt = map_array[i+1][j];
        //Right bottom point
        var rb = map_array[i+1][j+1];
        console.log((y*(fval_lb-contour_val) + (j+1)*delta*(contour_val-fval_lt) ));
        //Case 0
        if(lt == 0 && lb == 0 && rt == 0 && rb == 0){
          //draw nothing
        }
        //Case 1
        else if(lt == 0 && lb == 1 && rt == 0 && rb == 0){
            ctx.beginPath();
    	  	  ctx.moveTo(x,edge_l);
          	ctx.lineTo(edge_b,y_next);
          	ctx.lineWidth = 2;
          	// set line color
          	ctx.strokeStyle = '#000000';
          	ctx.stroke();
        }
        //Case 2
        else if(lt == 0 && lb == 0 && rt == 0 && rb == 1){
            ctx.beginPath();
    	  	  ctx.moveTo(edge_b,y_next);
          	ctx.lineTo(x_next,edge_r);
          	ctx.lineWidth = 2;
          	// set line color
          	ctx.strokeStyle = '#000000';
          	ctx.stroke();
        }
        //Case 3
        else if(lt == 0 && lb == 1 && rt == 0 && rb == 1){
            ctx.beginPath();
    	  	  ctx.moveTo(x,edge_l);
          	ctx.lineTo(x_next,edge_r);
          	ctx.lineWidth = 2;
          	// set line color
          	ctx.strokeStyle = '#000000';
          	ctx.stroke();
        }
        //Case 4
        else if(lt == 0 && lb == 0 && rt == 1 && rb == 0){
            ctx.beginPath();
    	  	  ctx.moveTo(edge_t,y);
          	ctx.lineTo(x_next,edge_r);
          	ctx.lineWidth = 2;
          	// set line color
          	ctx.strokeStyle = '#000000';
          	ctx.stroke();
        }
        //Case 5
        else if(lt == 0 && lb == 1 && rt == 1 && rb == 0){
            ctx.beginPath();
    	  	  ctx.moveTo(x,edge_l);
          	ctx.lineTo(edge_t,y);
          	ctx.lineWidth = 2;
          	// set line color
          	ctx.strokeStyle = '#000000';
          	ctx.stroke();

            ctx.beginPath();
    	  	  ctx.moveTo(edge_b,y_next);
          	ctx.lineTo(x_next,edge_r);
          	ctx.lineWidth = 2;
          	// set line color
          	ctx.strokeStyle = '#000000';
          	ctx.stroke();
        }
        //Case 6
        else if(lt == 0 && lb == 0 && rt == 1 && rb == 1){
            ctx.beginPath();
    	  	  ctx.moveTo(edge_t,y);
          	ctx.lineTo(edge_b,y_next);
          	ctx.lineWidth = 2;
          	// set line color
          	ctx.strokeStyle = '#000000';
          	ctx.stroke();
        }
        //Case 7
        else if(lt == 0 && lb == 1 && rt == 1 && rb == 1){
            ctx.beginPath();
    	  	  ctx.moveTo(x,edge_l);
          	ctx.lineTo(edge_t,y);
          	ctx.lineWidth = 2;
          	// set line color
          	ctx.strokeStyle = '#000000';
          	ctx.stroke();
        }
        //Case 8
        else if(lt == 1 && lb == 0 && rt == 0 && rb == 0){
            ctx.beginPath();
    	  	  ctx.moveTo(x,edge_l);
          	ctx.lineTo(edge_t,y);
          	ctx.lineWidth = 2;
          	// set line color
          	ctx.strokeStyle = '#000000';
          	ctx.stroke();
        }
        //Case 9
        else if(lt == 1 && lb == 1 && rt == 0 && rb == 0){
          ctx.beginPath();
          ctx.moveTo(edge_t,y);
          ctx.lineTo(edge_b,y_next);
          ctx.lineWidth = 2;
          // set line color
          ctx.strokeStyle = '#000000';
          ctx.stroke();
        }
        //Case 10
        else if(lt == 1 && lb == 0 && rt == 0 && rb == 1){
          ctx.beginPath();
          ctx.moveTo(x,edge_l);
          ctx.lineTo(edge_b,y_next);
          ctx.lineWidth = 2;
          // set line color
          ctx.strokeStyle = '#000000';
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(edge_t,y);
          ctx.lineTo(x_next,edge_r);
          ctx.lineWidth = 2;
          // set line color
          ctx.strokeStyle = '#000000';
          ctx.stroke();
        }
        //Case 11
        else if(lt == 1 && lb == 1 && rt == 0 && rb == 1){
          ctx.beginPath();
          ctx.moveTo(edge_t,y);
          ctx.lineTo(x_next,edge_r);
          ctx.lineWidth = 2;
          // set line color
          ctx.strokeStyle = '#000000';
          ctx.stroke();
        }
        //Case 12
        else if(lt == 1 && lb == 0 && rt == 1 && rb == 0){
          ctx.beginPath();
          ctx.moveTo(x,edge_l);
          ctx.lineTo(x_next,edge_r);
          ctx.lineWidth = 2;
          // set line color
          ctx.strokeStyle = '#000000';
          ctx.stroke();
        }
        //Case 13
        else if(lt == 1 && lb == 1 && rt == 1 && rb == 0){
          ctx.beginPath();
          ctx.moveTo(edge_b,y_next);
          ctx.lineTo(x_next,edge_r);
          ctx.lineWidth = 2;
          // set line color
          ctx.strokeStyle = '#000000';
          ctx.stroke();
        }
        //Case 14
        else if(lt == 1 && lb == 0 && rt == 1 && rb == 1){
          ctx.beginPath();
          ctx.moveTo(x,edge_l);
          ctx.lineTo(edge_b,y_next);
          ctx.lineWidth = 2;
          // set line color
          ctx.strokeStyle = '#000000';
          ctx.stroke();
        }
        //Case 15
        else if(lt == 1 && lb == 1 && rt == 1 && rb == 1){
          //draw nothing
        }


  	   }
    }
}




//End UGrid2D--------------------------------------------
