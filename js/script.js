$(document).ready(function(){

  var dict = [];

    dict.push({
      key:   '.slow',
      value: 50
    });

    var snow = '#snow';
    var degree = 50;
    for (var i = 1; i < 6; i++){
      dict.push({key: snow + i, value: degree});

      degree -= 10;
      if (degree <= 0)
        degree = 50;
  }

  $('.wrapper').mousemove(function(e){

  	$('.title_wrapper').animate({'top': '150px', 'opacity' : '1'}, 800);

    for(var i = 0; i < 6; i++){
      var x = -(e.pageX + this.offsetLeft) / dict[i].value;
      var y = -(e.pageY + this.offsetTop) / dict[i].value;

      //swap direction of movement for half of the snow imgs
      if (i%2 == 0){
        var temp = x;
        x = y;
        y = temp;
      }
      $(dict[i].key).css('margin', x + 'px ' + y + 'px');
    }
    
  }); 
  $('.ball').click(function(){
      $(this).attr('src', 'resources/pokeball_opened.png');
      $(this).css('height', '120px');
      $(this).css('width', '120px');
      $('.pokemon').css('display', 'block');
      $('.pokemon').animate({'opacity': '1'},1000);
      $('.wrapper').delay(1500).animate({'opacity': '0'},500); 

  });   
});