(function() {
  var students = [];
  var school = location.pathname.split("/")[1];
  var inClassRegex = /^(\w*) \(Level [0-9]*\) is currently studying (\w*)$/;
  var classTypeRegex = /(?:(\d*) hrs, )?(?:(\d*) minutes, )?(?:(\d*) seconds)/;
  
  var rows = Array.prototype.slice.call(document.querySelectorAll(".content tr")).reverse();
  var len = rows.length;
  var training = undefined;
  while(len--){
    if(training) {
      var match = classTypeRegex.exec(rows[len].querySelectorAll("td")[1].innerHTML);
      // IF NO MATCH - CHECK IF WAITING TO PAY OR COMPLETE!
      // Complete: Course Finished!
      // Waiting: -> first B tag <b>One Dubloon Coin</b>
      var offset = 0;
      offset += match[1] ? (match[1] * 60 * 60 * 1000) : 0;
      offset += match[2] ? (match[2] * 60 * 1000) : 0;
      offset += match[3] ? (match[3] * 1000) : 0;
      
      students.push({
        name: training[1],
        type: training[2],
        school: school,
        endTime: (new Date()).getTime() + offset
      });

      training = undefined;
    } else {
      training = inClassRegex.exec(rows[len].querySelectorAll("td b")[0].innerHTML);
    }
  }
  if(students.length > 0) {
    chrome.runtime.sendMessage({
      type: "intraining",
      students: students,
    });
  }
}())
