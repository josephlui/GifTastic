
let topics = ['batman','minions', 'simpsons','spongebob','flintstones',
'beauty and the beast','fantasia','finding nemo','garfield','peanuts',
'mulan','popeye','peter pan'];

function init(){
    var button = '';
    for (var i = 0; i < topics.length; i++){
        renderButton(i);
    }
    $('.btn').on('click',function(event){
        event.preventDefault();
        if ($(this).attr ('data-type') === 'reset'){
            $('#r1_c1').empty();
            sessionStorage.clear();
        }else{
            // add topic
            var topic = $('#new_topic').val().trim();
            if (topic){
                addTopic (topic);
            }
            $('#new_topic').val('');
        }
    })
}

function renderButton(i){
    var button = $('<button>');
    button.text(topics[i]);
    button.attr('class', 'topic-button');
    button.attr('data-category', topics[i]);
    $('#topic_row').append(button);
}


function addTopic(topic){   
    topics.push(topic);
    renderButton(topics.length-1);
}

function getGif(){
  var topic = $(this).attr('data-category');
  var key= 'qdKtLS8A71YSb3vgcgf9fLMTAKAJKMMO';
  var limit = 10;
  var offset = sessionStorage.getItem(topic+'_offset');

  if (offset && parseInt(offset) >= 0){
    offset++;
  }else{
    offset = 0;
  }
  sessionStorage.setItem(topic+'_offset', offset); 
  var url = 'https://api.giphy.com/v1/gifs/search?api_key=' +key
    + '&q=' + topic 
    + '&limit='+limit 
    + '&offset=' + parseInt(offset*10+1)
    + '&rating=G&lang=en';
    $.ajax({
        url: url,
        method: "GET"
      }).then(function(response) {
          var img, div1, div2;
          $('#r1_c1').empty();

          for (var i = 0; i < response.data.length; i++){
            div1 = $('<div>');
            div1.attr('class', 'container-div');
            div1.text('rating: ' + response.data[i].rating);
            var div2 = $('<div>');
            div1.prepend(div2);
            img = $('<img>');
            img.attr ('src', response.data[i].images.fixed_height_small_still.url);
            img.attr('height',response.data[i].images.fixed_height_small_still.height);
            img.attr('width',response.data[i].images.fixed_height_small_still.width);
            img.attr ('dynamic-src',response.data[i].images.fixed_height_downsampled.url );
            img.attr ('static-src',response.data[i].images.fixed_height_small_still.url);
            img.attr('title',response.data[i].title);
            img.attr('alt',response.data[i].title);
            img.attr ('class','topic-image');
            img.attr ('action', 'still');
            div2.append(img);
          
            $('#r1_c1').append(div1);
          }
          if (sessionStorage.getItem(topic)){
            $('#r1_c1').append(sessionStorage.getItem(topic));
          }

          sessionStorage.setItem(topic, $('#r1_c1').html());   
         
      });

}

function updateImageState(){
    if ($(this).attr('action') === 'still'){
        $(this).attr ('action','dynamic');
        $(this).attr ('src', $(this).attr('dynamic-src') );
    } else {
        $(this).attr ('action','still');
        $(this).attr ('src', $(this).attr('static-src') );
    }
}

$( document ).ready(function(){
    init();
    $(document).on("click", ".topic-button", getGif);
    $(document).on("click",'.topic-image', updateImageState);

})