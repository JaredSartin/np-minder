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
  for(name in data.pets) {
    var container = document.querySelector(".templates .pet-details").cloneNode(true);
    container.querySelector("img").src = "http://pets.neopets.com/cpn/" + data.pets[name].name + "/1/2.png";
    container.querySelector(".owner").innerHTML = data.pets[name].owner;
    container.querySelector(".name").innerHTML = data.pets[name].name;
    container.querySelector(".gender").innerHTML = data.pets[name].gender;
    container.querySelector(".color").innerHTML = data.pets[name].color;
    container.querySelector(".species").innerHTML = data.pets[name].species;
    container.querySelector(".level").innerHTML = data.pets[name].level;
    container.querySelector(".health").innerHTML = data.pets[name].health;
    container.querySelector(".strength").innerHTML = data.pets[name].strength;
    container.querySelector(".defense").innerHTML = data.pets[name].defense;
    container.querySelector(".move").innerHTML = data.pets[name].move;

    console.log(data.pets[name]);

    if(data.pets[name].training) {
      container.querySelector(".training").innerHTML = "Training at " + data.pets[name].training.school + " for " + data.pets[name].training.type;
    }

    document.querySelector(".section.pets").appendChild(container);
  }
});
