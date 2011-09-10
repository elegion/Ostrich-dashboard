$(function(){
  var namespace = "head" //todo: generate unique


  var indicators = []
  var address = $('#ostrich-address').val().replace(/\/$/g, "")

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
    var data = $.map(indicator.values, function(timevalue){
      return timevalue.value;
    });
    $('#'+indicator.id+" > span").sparkline(data, {width: "400px", height: "30px"});
    $('#value_'+indicator.id).text(data[data.length-1]);
    var delta = data[data.length-1] - data[data.length-2];
    var sign  = delta >= 0 ? "+" : "";
    $('#delta_'+indicator.id).text('('+sign+delta+')');
  }

  $('#reset').click(function(){
    indicators = [];  
    address = $('#ostrich-address').val().replace(/\/$/g, "");
    $('#graphs > table > tbody > tr').remove(); 
  });

  $('#errorClose').click(function(){
    $('#graphs > .error ').hide();
  });

  fetch();
});