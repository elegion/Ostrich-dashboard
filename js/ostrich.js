$(function(){
  var namespace = "head" //todo: generate unique

  var servers = []

  var fetch = function() {
    $.each(servers, function(index, server){
      server.fetch();
    });
    setTimeout(fetch, 2000);
  };

  var reset = function() {
    indicators = [];  
    address = $('#ostrich-address').val().replace(/\/$/g, "");
    $('#graphs > table > tbody > tr').remove(); 
    if (localStorage) {
      localStorage["ostrich-address"] = address;
    }
    servers.push(new Server(address, address, "red"));
  };

  //bind reset events
  $('#reset').click(reset);
  
  $('#ostrich-address').keyup(function(event){
    if (event.keyCode == 13) {
      reset();
    }
  });

  //handle errors
  $('#errorClose').click(function(){
    $('#graphs > .error ').hide();
  });

  //load address from localStorage if any
  if (localStorage && localStorage["ostrich-address"]) {
    $('#ostrich-address').val(localStorage["ostrich-address"]);
  } else {
    $('#ostrich-address').val("http://elegion.github.com/Ostrich-dashboard/demo")
  }

  reset();
  fetch();
});