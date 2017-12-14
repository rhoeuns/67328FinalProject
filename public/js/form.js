$(function(){ 
  $("#f1").submit(myDisplayFunction);
});

$(document).ready(function() { 
appendBreedList() });

//calls to receive all breed names
function appendBreedList() {
  console.log("appending breed list to form");
  try {
    $.ajax({
    //this is the petfinder api
    //documentation is at https://www.petfinder.com/developers/api-docs
      type: 'GET',
      dataType: 'jsonp',
      url:"https://api.petfinder.com/breed.list",
      crossDomain: true,
      data: {
        'animal':'dog',
        'format':'json',
        'key' : '08fc6364a46811e277f4e63ebde75eca'
      },
      jsonpCallback: "display",
      success: function() {},
      error: function() { alert('Failed!'); },
    });
    return false;
  } 
  catch (e) {console.log(e.description);}
}         


//displayList of breed into select options
function display(response){
  list = response.petfinder.breeds.breed
  for (x in list){
    let breedName = list[x]['$t']
    let option = document.createElement("option");
    option.setAttribute('data-tokens',breedName);
    option.setAttribute('value',breedName);
    option.innerHTML = breedName;
    $(".selectpicker").append(option)
  }
}


//finds pet info from the data entered by users
function myDisplayFunction() {
  $("#reviews").html("");
  console.log("hihi");
  try {
    $.ajax({
    //this is the petfinder api
    //documentation is at https://www.petfinder.com/developers/api-docs
      type: 'GET',
      dataType: 'jsonp',
      url:"https://api.petfinder.com/pet.find",
      crossDomain: true,
      data: $("#f1").serialize()+"&key=08fc6364a46811e277f4e63ebde75eca&animal=dog&format=json",
      jsonpCallback: "displayInfo",
      success: function() {},
      error: function() { alert('Failed!'); },
    });
    return false;
  } 
  catch (e) {console.log(e.description);}
}         

//goes through the loop to display items in array
function displayInfo(response) {
  var pets = response.petfinder.pets
  if (pets.pet.length > 0){
    pets = pets.pet;
    for (each in pets){
      let pet = pets[each]
      imgSrc = findPicture(pet.media.photos.photo);
      $("#reviews").append("<div class='displayDog'><img src='"+imgSrc+"'><p>Name: <strong>"+pet.name['$t']+"</strong></br>Breed: "+pet.breeds.breed['$t']+"</br>Sex: "+pet.sex['$t']+"</br>Size: "+pet.size['$t']+"<br>Age: "+pet.age['$t']+"<br>"+pet.contact.email['$t']+"</p></div>");
    }
  }
}


//returns the picture of a small size
function findPicture(data){
  for (pic in data){
    if (data[pic]['@size'] === 'fpm'){
      console.log("found the size");
      console.log(data[pic]['$t']);
      return data[pic]['$t']
      break
    }
  }
}

//used to make top nav bar responsive and show list of menu when icon clicked
function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}