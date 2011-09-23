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

  var trackServer = function() {
    indicators = [];  
    address = $('#ostrich-address').val().replace(/\/$/g, "");
    addServer(address);
    if (localStorage) {
      localStorage["ostrich-addresses"] = $.map(servers, function(s){return s.address}).join(';;;');
    }
  };

  var addServer = function(address) {
    var id = address.replace(/[^a-zA-Z0-9]/g, "_")
    var server = new Server(id, address, colors[servers.length]);
    servers.push(server);
    $('li#server-'+id+' > a > .closeServer').click(function(){
      removeServer(id);
      return false;
    });
  }

  var removeServer = function(id) {
    $('li#server-'+id).remove();
    $('#graphs > table > tbody > tr').filter(function(i){return this.getAttribute('servers') == (id+',')}).remove();
    servers = servers.filter(function(server){return server.id != id});
    if (localStorage) {
      localStorage["ostrich-addresses"] = $.map(servers, function(s){return s.address}).join(';;;');
    }
  }

  //bind reset events
  $('#reset').click(trackServer);
  
  $('#ostrich-address').keyup(function(event){
    if (event.keyCode == 13) {
      trackServer();
    }
  });

  //handle errors
  $('#errorClose').click(function(){
    $('#errorDiv').hide();
  });

  $('#all-servers').click(function(event){
    $("#servers > .active").removeClass('active');
    $('#all-servers').addClass('active');
    // $.each(servers, function(index, server){
    //   server.render(fetchCounter-1);
    // });
    $('#graphs > table > tbody > tr').each(function(k, tr){
      $(tr).show();
    });
  });




  //load address from localStorage if any
  if (localStorage && localStorage["ostrich-addresses"] &&  localStorage["ostrich-addresses"].length > 0) {
    var addresses = localStorage["ostrich-addresses"].split(';;;')
    $.each(addresses, function(k, address){
      addServer(address);
    });
  }

  fetch();
});