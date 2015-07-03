chrome.runtime.sendMessage({type: "rpopupbasic"}, function(data) {
  if(data.currentUser) {
    var el = document.querySelector(".top-bar .current-user .name")
    el.innerHTML = data.currentUser;
    el.href = "http://www.neopets.com/userlookup.phtml?user=" + data.currentUser;
  } else {
    document.querySelector(".top-bar .current-user").innerHTML = "Visit Neopets to update your data!";
  }
});

// IMPLEMENT SECTIONS (active/toggle/etc)

// PETS SECTION GUTS
chrome.runtime.sendMessage({type: "rpopuppets"}, function(data) {
  var len = data.pets.length;
  while(len--) {
    var container = document.querySelector(".templates .pet-details").cloneNode(true);
    container.querySelector("img").src = "http://pets.neopets.com/cpn/" + data.pets[len].name + "/1/2.png";
    container.querySelector(".owner").innerHTML = data.pets[len].owner;
    container.querySelector(".name").innerHTML = data.pets[len].name;
    container.querySelector(".gender").innerHTML = data.pets[len].gender;
    container.querySelector(".color").innerHTML = data.pets[len].color;
    container.querySelector(".species").innerHTML = data.pets[len].species;
    container.querySelector(".level").innerHTML = data.pets[len].level;
    container.querySelector(".health").innerHTML = data.pets[len].health;
    container.querySelector(".strength").innerHTML = data.pets[len].strength;
    container.querySelector(".defense").innerHTML = data.pets[len].defense;
    container.querySelector(".move").innerHTML = data.pets[len].move;

    document.querySelector(".section.pets").appendChild(container);
  }
});
