// function popup(){
//     // Get the modal
//     var modal = document.getElementById("detail_form");

//     // Get the button that opens the modal
//     var btn = document.getElementById("detail_btn");

//     // Get the <span> element that closes the modal
//     var span = document.getElementsByClassName("close")[0];

//     // When the user clicks the button, open the modal 
//     btn.onclick = function() {
//     modal.style.display = "block";
//     }

//     // When the user clicks on <span> (x), close the modal
//     span.onclick = function() {
//     modal.style.display = "none";
//     }

//     // When the user clicks anywhere outside of the modal, close it
//     window.onclick = function(event) {
//     if (event.target == modal) {
//         modal.style.display = "none";
//     }
//     }
// }

$(document).ready(function(){

    $(".detail_button").on("click",function(){
    	var parentTr = $(this).closest("tr");
        var counter = 1;
        $("td", $(parentTr)).each(function(){
        	if(!($(this).hasClass("detail_td"))){
                $(".modal-body tr td:nth-child("+counter+")").text($(this).text());
            	counter++;
            }
        $(".modal-body").show();
		$("#bodytable").hide();
		
        });
    });
	
	$("#hide_popup").on("click",function(){
		$(".modal-body").hide();
		$("#bodytable").show();
	});
    
});