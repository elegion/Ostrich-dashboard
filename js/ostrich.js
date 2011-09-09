$(function(){
  var namespace = "head" //todo: generate unique

  var TimedValue = function(value) {
    this.time = new Date();
    this.value = value;
  }

  var Counter = function(name, initialValue) {
    var initial = new TimedValue(initialValue);
    this.name = name;
    this.values = newFilledArray(400, initial);
    
    this.addValue = function(value) {
      this.values = this.values.slice(1)
      this.values.push(value)
    };
  }

  var counters = []
  var address = $('#ostrich-address').val()

  var fetch = function() {
    $.jsonp({
      url: address+"/stats.json", 
      data: {callback: ""},
      dataType: "jsonp",
      callback: "ostrichCallback",
      timeout: 1000,
      success: function(data){
        $.each(data.counters, function(k,v){
          var id = "c_"+k.replace(/[^a-zA-Z0-9]/g, "_")
          var counter = counters[id]
          if (!counter) {
            counter = new Counter(id, v);
            counters[id] = counter;
            $('#graphs > table > tbody').append(
              '<tr>' +
               '<td>'+k+'&nbsp</td>' + 
               '<td id="value_'+id+'"></td>' + 
               '<td id="delta_'+id+'"></td>' + 
               '<td class="spark" id="'+id+'"><span>...</span></td>' + 
              '</tr>'
            );
          }
          counter.addValue(new TimedValue(v))
          updateValue(id)
        });
        $.each(data.gauges, function(k,v){
          var id = "g_"+k.replace(/[^a-zA-Z0-9]/g, "_")
          var counter = counters[id]
          if (!counter) {
            counter = new Counter(id, v);
            counters[id] = counter;
            $('#graphs > table > tbody').append(
              '<tr>' +
               '<td>'+k+'&nbsp</td>' + 
               '<td id="value_'+id+'"></td>' + 
               '<td id="delta_'+id+'"></td>' + 
               '<td class="spark" id="'+id+'"><span>...</span></td>' + 
              '</tr>'
            );
          }
          counter.addValue(new TimedValue(v))
          updateValue(id)
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
    var data = $.map(counters[name].values, function(timevalue){
      return timevalue.value;
    });
    $('#'+name+" > span").sparkline(data, {width: "500px", height: "30px"});
    $('#value_'+name).text(data[data.length-1]);
    var delta = data[data.length-1] - data[data.length-2];
    var sign  = delta >= 0 ? "+" : "";
    $('#delta_'+name).text('('+sign+delta+')');

  }

  $('#reset').click(function(){
    counters = [];  
    address = $('#ostrich-address').val();
    $('#graphs > table > tbody > tr').remove(); 
  });

  $('#errorClose').click(function(){
    $('#graphs > .error ').hide();
  });

  var newFilledArray = function(len, val) {
      var rv = new Array(len);
      while (--len >= 0) {
          rv[len] = val;
      }
      return rv;
  }

  fetch();
});