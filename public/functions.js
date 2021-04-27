


function openNav() {
    document.getElementById("mySidebar").style.width = "350px";
  }
  
  /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
  function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
  }

 // $('.modal').hide();

  document.getElementById('myModal').style.visibility = 'hidden';


window.addEventListener('click', function(e){
  if(e.target.className == 'mapimg'){
    document.getElementById('myModal').style.visibility = 'visible';
  }

  if(e.target.className == 'close'){
    document.getElementById('myModal').style.visibility = 'hidden';
  }
  
});
