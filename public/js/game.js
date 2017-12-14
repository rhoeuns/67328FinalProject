
var answer 
var breedList
$(document).ready(function() { getScore() });

$(function(){ 
  $("#f2").submit(myDisplayFunction);
});

$(function(){
  //add submit handler to form
  $("#answerButton").on('click',function(event){
    let clientAnswer = $("#gameForm").find('input[name="selectBreed"]:checked').val();
    if (answer === clientAnswer){
      $.when(gameStatus("/correct")).done(getScore());
      swal({
        title: "Good job!",
        text: "You found the right breed!",
        icon: "success",
        timer: 1300,
      });
    } else{
      $.when(gameStatus("/wrong")).done(getScore());
      swal({
        title: "Oops!",
        text: "You chose the wrong answer!",
        icon: "error",
        timer: 1500,
      });
    }
    myDisplayFunction();
    //stop default submit action
    event.preventDefault();
    return false;
  });
});

//send ajax requiest to gamesRoute to pull gameScore data from user
function getScore(){
  $.ajax({
      type: 'GET',
      url: '/score',
      success: function(result) {
           console.log("calling score successful");
           console.log(result)
           displayScore(result)
          }
    });
}

//this function is for callback for getScore()
//it will display and update the scores
function displayScore(result){
  $("#correctScore").html(result.correct);
  $("#wrongScore").html(result.wrong);
}

//send ajax requiest to gamesRoute to update the mlab database
function gameStatus(gameStatus){
  $.ajax({
    //this is the DOG CEO api
    //documentation is at https://dog.ceo/dog-api/
      type: 'PUT',
      url: gameStatus,
      success: function(result) {
           console.log("updating score successful");
           console.log(result)
          }
    });
}

function myDisplayFunction() {
   $("#gameForm").show()
   $("#f2").hide()
   $("#scoreTable").css({"float":"right", "margin-right":'100px' })
   getScore()
   try {
    $.ajax({
    //this is the DOG CEO api
    //documentation is at https://dog.ceo/dog-api/
      type: 'GET',
      dataType: 'json',
      url:"https://dog.ceo/api/breeds/image/random",
      success: function(result) {displayInfo(result)},
    });
    return false;
  } 
  catch (e) {console.log(e.description);}
}         
 
 function displayInfo(response) {
  $(".breed-image").html("<img src='" + response.message + "'>");
  answer = findBreedFromImage(response.message);
  breedList = findThreeMoreBreed()
  //this adds the answer breed into the selection
  breedList.push(answer);
  updateSelection(breedList)
  console.log(breedList);
}


function updateSelection(breedList){
  //always order the list by alphabetical order
  breedList.sort();
  $("#game").html("");
  for (let i=0; i<4; i++){
    let div = document.createElement("div");
    let input = document.createElement("input");
    let label = document.createElement("label");
    input.setAttribute('type','radio');
    input.setAttribute('id','selectionChoice'+i);
    input.setAttribute('name','selectBreed');
    input.setAttribute('value',breedList[i]);
    label.setAttribute('for','selectionChoice'+i);
    label.innerHTML = breedList[i]
    div.append(input)
    div.append(label)
    $("#game").append(div);
  }
}

//return breed name from the image that is displayed
function findBreedFromImage(url){
  urlArray = url.split("/");
  //due to how url is structured, index 5 is always the name of the breed
  return urlArray[5]
}


//function that will return array of three breeds pulled from DOG CEO API
function findThreeMoreBreed(){
  console.log("trying to find more breed names");
  breedList = [];
   try {
    //ASYNC is false to wait for the breedlist to be updated
    $.ajax({
    //this is the DOG CEO api
    //documentation is at https://dog.ceo/dog-api/
      type: 'GET',
      dataType: 'json',
      async: false,
      url:"https://dog.ceo/api/breeds/list/all",
      success: function(result) {
        var selection = showSelection(result.message);
        breedList = selection;
      }
    });
    return breedList;
  } 
  catch (e) {console.log(e.description);}
}    

//return array of 3 breeds selected from the response
function showSelection(response){
  let length =  Object.keys(response).length
  let list = Object.keys(response);
  for (let i = 0; i<3; i++){
    breedList.push(picRandomItem(list, length))
  }
  return breedList
}

//this returns random number within the length of the given list
function picRandomItem(list, length){
  let randomNum = Math.floor(Math.random() * length)
  let breed = list[randomNum];
  return breed;
}
