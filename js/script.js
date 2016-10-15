$(document).ready(function(){

  let dict = [];

    dict.push({
      key:   '.slow',
      value: 50
    });

    let snow = '#snow';
    let degree = 50;
    for (let i = 1; i < 6; i++){
      dict.push({key: snow + i, value: degree});

      degree -= 10;
      if (degree <= 0)
        degree = 50;
  }

  $('.wrapper').mousemove(function(e){

  	$('.title_wrapper').animate({'top': '150px', 'opacity' : '1'}, 800);
    $('.hint').delay(600).animate({'opacity' : '1'}, 400);

    for(let i = 0; i < 6; i++){
      let x = -(e.pageX + this.offsetLeft) / dict[i].value;
      let y = -(e.pageY + this.offsetTop) / dict[i].value;

      //swap direction of movement for half of the snow imgs
      if (i%2 == 0){
        let temp = x;
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

      $('.move_up').delay(2200).animate({'top': '0'},1000);
      $('.move_down').delay(2200).animate({'top': '100%'},1000);

      setTimeout(function(){ $('.main_page').css('display', 'none'); }, 3200);

  });   
});