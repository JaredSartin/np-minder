NPMinder = {
  currentUser: undefined,
  handleUserUpdate: function(message) {
    chrome.storage.sync.get("accounts", function(data) {
      var accounts = [];
      var account = {};

      if(data.accounts) {
        accounts = data.accounts;
      }

      var exists = false;
      var len = accounts.length;
      while(len-- && !exists) {
        if(account.userName == message.userName) {
          exists = true;
          account.onHandNP = message.onHandNP;
          account.onHandNC = message.onHandNC;
        }
      };

      if(!exists) {
        var acct = {
          userName: message.userName,
          onHandNP: message.onHandNP,
          onHandNC: message.onHandNC
        };
        accounts.push(acct);
      }

      chrome.storage.sync.set({"accounts": accounts})
    });
  },

  handleBasicPopup: function(sendResponse) {
    sendResponse({
      currentUser: NPMinder.currentUser
    });
  },

  handlePetsList: function(sendResponse) {
    //
    //
    // NEED TO HANDLE UPDATES IN THE LOOP
    // NEED TO HANDLE FORCE UPDATES
    //
    //
    chrome.storage.sync.get("pets", function(data) {
      var pets = [];
      // Check if pets contains pets for current user (if current user)
      if(data.pets) {
        sendResponse({"pets": data.pets});
      } else {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://www.neopets.com/quickref.phtml", true);
        xhr.onload = function() {
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

            pets.push(pet);

            chrome.storage.sync.set({"pets": pets})
            sendResponse({"pets": data.pets});
          }
        }
        xhr.send();
      }
    });
  },
};

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
      default:
        console.log("Unknown message type:");
        console.log(request);
    }

    return true;
    // if (request.greeting == "hello")
    //   sendResponse({farewell: "goodbye"});
});
