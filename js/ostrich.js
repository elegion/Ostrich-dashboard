$(function(){
  var namespace = "head" //todo: generate unique

  var colors = ["blue", "green", "red", "black", "magenta"]

  var servers = []
  var fetchCounter = 0

  var fetch = function() {
    var targetCount = servers.length
    var updatedSet = []
    $.each(servers, function(index, server){
      server.fetch(fetchCounter, updatedSet, targetCount);
    });
    fetchCounter++;
    setTimeout(fetch, 2000);
  };

  var addServer = function() {
    indicators = [];  
    address = $('#ostrich-address').val().replace(/\/$/g, "");
    //$('#graphs > table > tbody > tr').remove(); 
    var server = new Server(address, address, colors[servers.length]);
    servers.push(server);
    if (localStorage) {
      localStorage["ostrich-addresses"] = $.map(servers, function(s){return s.address}).join(';;;');
    }
  };

  //bind reset events
  $('#reset').click(addServer);
  
  $('#ostrich-address').keyup(function(event){
    if (event.keyCode == 13) {
      addServer();
    }
  });

  //handle errors
  $('#errorClose').click(function(){
    $('#errorDiv').hide();
  });

  //load address from localStorage if any
  if (localStorage && localStorage["ostrich-addresses"] &&  localStorage["ostrich-addresses"].length > 0) {
    var addresses = localStorage["ostrich-addresses"].split(';;;')
    $.each(addresses, function(k, address){
      var server = new Server(address, address, colors[servers.length]);
      servers.push(server);
    });
  }

  fetch();
});