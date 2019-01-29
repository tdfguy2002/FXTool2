function myFunction() {
  var x = document.getElementById('filelist');

  var y = document.createElement("td");
  //y.setAttribute("id", "myTr");

  var z = document.createElement("tr");

  y.appendChild(z);



  document.getElementById("filelist").appendChild(y);




  //var z = document.createElement("TD");
  //var t = document.createTextNode("cell");
  //z.appendChild(t);
  //document.getElementById("myTr").appendChild(z);
}