(function() {
  var user = document.querySelectorAll("#header .user a");
  if(user.length > 0) {
    var userName = user[0].innerHTML;
    var onHandNP = parseInt(user[1].innerHTML.replace(",","")); // Need NC - more precise?
    var onHandNC = user[2].id == "logout_link" ? 0 : user[2].innerHtml; 

    chrome.runtime.sendMessage({
      type: "userbasic",
      userName: userName,
      onHandNP: onHandNP,
      onHandNC: onHandNC,
    });
  };
}())
