$(document).ready(function(){
  $('.wrapper').mousemove(function(e){
  	//5,10,15,20,25

  	$(".title_wrapper").animate({"left": "100px"}, 1500);

    var dict = [];

    dict.push(
    {
        key:   ".parallax",
        value: 10
    },
    {   
        key:   "#snow1",
        value: 5
    },
    {
        key:   ".ball",
        value: 50
    });

    console.log(dict[0].key);

    for(var i = 0; i < 3; i++){
      var x = -(e.pageX + this.offsetLeft) / dict[i].value;
      var y = -(e.pageY + this.offsetTop) / dict[i].value;
      $(dict[i].key).css('margin', x + 'px ' + y + 'px');
    }
    
  });    
});