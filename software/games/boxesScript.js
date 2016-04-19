function updateDimensions (){
       console.log("Padding: ",document.getElementById("canvas-panel").style.marginRight*2);
       c.width = document.getElementById("canvas-panel").offsetWidth - 50; //sketchy, fix ... 
       c.height = c.width * 0.60;
}