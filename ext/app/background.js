NPMinder = {
  currentUser: undefined,
  petFetch: undefined,

  handleUserUpdate: function(message) {
    chrome.storage.sync.get("accounts", function(data) {
      var accounts = {};
      var account = {};

      if(data.accounts) {
        accounts = data.accounts;
      }

      if(accounts[message.userName]) {
        accounts[message.userName].onHandNP = message.onHandNP;
        accounts[message.userName].onHandNC = message.onHandNC;
      } else {
        accounts[message.userName] = {
          onHandNP: message.onHandNP,
          onHandNC: message.onHandNC
        };
      }

      chrome.storage.sync.set({"accounts": accounts})
    });
  },

  handleBasicPopup: function(sendResponse) {
    sendResponse({
      currentUser: NPMinder.currentUser
    });
  },

  handleInTraining: function(request) {
    chrome.storage.sync.get("pets", function(data) {
      var pets = {};
      if(data.pets) {
        pets = data.pets;
      }

      for(name in pets) {
        if(pets[name].owner == NPMinder.currentUser) {
          pets[name].training = request.students[name];
        }
      }

      chrome.storage.sync.set({"pets": pets})
    });
  },

  handlePetsList: function(sendResponse, update) {
    // Not returning training results?
    chrome.storage.sync.get("pets", function(data) {
      var pets = {};

      var needRefresh = false;
      if(update || !NPMinder.petFetch || (new Date() - NPMinder.petFetch > (30 * 60 * 1000))) {
        needRefresh = true;
      }

      if(data.pets && !needRefresh) {
        pets = data.pets;
        for(name in pets) {
          if(pets[name].owner == NPMinder.currentUser) {
            needRefresh = true;
          }
        }
      }

      if(needRefresh || !data.pets) {
        NPMinder.fetchPets(function(fetched) {
          for(name in fetched) {
            if(pets[name]) {
              var copyStats = Object.keys(fetched[name]);
              var len = copyStats.length;
              while(len--) {
                pets[name][copyStats[len]] = fetched[name][copyStats[len]];
              }
            } else {
              pets[name] = fetched[name];
            }
          }
          chrome.storage.sync.set({"pets": pets})
          console.log(pets);
          sendResponse({"pets": pets});
        });
      } else {
        console.log(pets);
        sendResponse({"pets": pets});
      }
    });
  },

  fetchPets: function(cb) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://www.neopets.com/quickref.phtml", true);
    xhr.onload = function() {
      var pets = {};
      var doc = document.implementation.createHTMLDocument("");
      doc.open();
      doc.write(xhr.responseText);
      doc.close();

      var petCards = doc.querySelectorAll(".contentModule")
      
      var len = petCards.length;
      while(len--) {
        var pet = {};

        var petInfo = petCards[len].querySelectorAll(".pet_info .pet_stats td.sf b");
        pet.owner = doc.querySelectorAll("#header .user a")[0].innerHTML;
        var nameContainer = petCards[len].querySelector(".contentModuleHeader a") ? petCards[len].querySelector(".contentModuleHeader a") : petCards[len].querySelector(".contentModuleHeaderAlt a");
        pet.name = nameContainer.innerHTML;
        pet.species = petInfo[0].innerHTML;
        pet.color = petInfo[1].innerHTML;
        pet.gender = petInfo[2].innerHTML;
        pet.level = petInfo[4].innerHTML;
        pet.health = petInfo[5].innerHTML;
        pet.strength = petInfo[8].innerHTML;
        pet.defense = petInfo[9].innerHTML;
        pet.move = petInfo[10].innerHTML;

        pets[pet.name] = pet;

        NPMinder.petFetch = new Date();
      }
      cb(pets);
    }
    xhr.send();
  },
};


//
//
// Message Manager
//
//

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // console.log(sender.tab ?
    //             "from a content script:" + sender.tab.url :
    //             "from the extension");
    switch(request.type) {
      case "userbasic":
        NPMinder.handleUserUpdate(request);
        NPMinder.currentUser = request.userName;
        break;
      case "rpopupbasic":
        NPMinder.handleBasicPopup(sendResponse);
        break;
      case "rpopuppets":
        NPMinder.handlePetsList(sendResponse);
        break;
      case "intraining":
        NPMinder.handleInTraining(request);
        break;
      default:
        console.log("Unknown message type:");
        console.log(request);
    }

    return true;
});
