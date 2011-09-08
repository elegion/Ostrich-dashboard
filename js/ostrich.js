var namespace = "head" //todo: generate unique

var TimedValue = function(value) {
  this.time = new Date();
  this.value = value;
}

var Counter = function(name) {
  this.name = name
  this.values = []
}

var counters = []
var address = $('#ostrich-address').val()

var fetch = function() {
  $.ajax({
    url: address+"/stats.json", 
    data: {callback: ""},
    dataType: "jsonp",
    jsonpCallback: "ostrichCallback",
    success: function(data){
      $.each(data.counters, function(k,v){
        var id = "c_"+k.replace(/[^a-zA-Z0-9]/g, "_")
        var counter = counters[id]
        if (!counter) {
          counter = new Counter(id)
          counters[id] = counter
          $('#graphs > table > tbody').append('<tr><td>'+k+'&nbsp</td><td id="'+id+'"><span>...</span></td></tr>')
        }
        counter.values.push(new TimedValue(v))
        drawSparkline(id)
      });
      setTimeout(fetch, 2000);
    }
  });
};

var drawSparkline = function(name) {
  var data = $.map(counters[name].values, function(timevalue){
    return timevalue.value;
  });
  $('#'+name+" > span").sparkline(data, {width: "400px"});
}

var reset = function() {
  counters = []
  address = $('#ostrich-address').val()
}

fetch();