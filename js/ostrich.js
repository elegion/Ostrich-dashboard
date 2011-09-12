$(function(){
  var namespace = "head" //todo: generate unique

  var indicators
  var address

  var fetch = function() {
    $.jsonp({
      url: address+"/stats.json", 
      data: {callback: ""},
      dataType: "jsonp",
      callback: "ostrichCallback",
      timeout: 1000,
      success: function(data){
        $.each(data.counters, function(k,v){
          var indicator = indicators[k]
          if (!indicator) {
            indicator = new Counter(k, v);
            indicators[k] = indicator;
          }
          indicator.addValue(new TimedValue(v))
          updateValue(k)
        });
        $.each(data.gauges, function(k,v){
          var id = "g_"+k.replace(/[^a-zA-Z0-9]/g, "_")
          var indicator = indicators[k]
          if (!indicator) {
            indicator = new Gauge(k, v);
            indicators[k] = indicator;
          }
          indicator.addValue(new TimedValue(v))
          updateValue(k)
        });
        setTimeout(fetch, 2000);
      },
      error: function(xOptions, status) {
        $('#graphs > .error ').show();  
        $('#graphs > .error > p').text('Error occurred while trying to fetch '+xOptions.url+' ('+status+')!');
        setTimeout(fetch, 2000); //todo: do fetch in reset after error
      }
    });
  };

  var updateValue = function(name) {
    var indicator = indicators[name];
    indicator.render();
  }

  var reset = function() {
    indicators = [];  
    address = $('#ostrich-address').val().replace(/\/$/g, "");
    $('#graphs > table > tbody > tr').remove(); 
    if (localStorage) {
      localStorage["ostrich-address"] = address;
    }
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