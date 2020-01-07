chrome.commands.onCommand.addListener(function(command) {
  console.log('Command:', command);
  console.log(chrome.commands.getAll(function(command) {
    console.log(command)
  }));
});