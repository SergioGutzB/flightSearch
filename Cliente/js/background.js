$(function () {
	$.getJSON('/backgroundImages/', function(data){
    	var n_random = Math.floor((Math.random() * (data.length-1)) + 1); 
    	var contenedor = document.getElementById("initial-container");
    	contenedor.style.backgroundImage = "url("+"/"+data[n_random].fields.backgroundImage+")";
	});
});

