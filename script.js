$(document).ready(function(){
  $('.wrapper').mousemove(function(e){
  	//5,10,15,20,25

  	$(".title_wrapper").animate({"top": "150px", "opacity" : "1"}, 800);

    var dict = [];

    dict.push({
      key:   ".ball",
      value: 50
    });

    var snow = "#snow";
    var degree = 50;
    for (var i = 1; i < 6; i++){
      dict.push({key: snow + i, value: degree});

      degree -= 10;
      if (degree <= 0)
        degree = 50;
    }

    for(var i = 0; i < 6; i++){
      var x = -(e.pageX + this.offsetLeft) / dict[i].value;
      var y = -(e.pageY + this.offsetTop) / dict[i].value;

      if (i%2 == 0){
        var temp = x;
        x = y;
        y = temp;
      }
      $(dict[i].key).css('margin', x + 'px ' + y + 'px');
    }
    
  });    
});