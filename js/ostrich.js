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

var fetch = function() {
  var address = $('#ostrich-address').val()
  $.ajax({
    url: address+"/stats.json", 
    data: {namespace: namespace, callback: ""},
    dataType: "jsonp",
    jsonpCallback: "ostrichCallback",
    success: function(data){
      $.each(data.counters, function(k,v){
        var counter = counters[k]
        if (!counter) {
          counter = new Counter(k)
          counters[k] = counter
        }
        counter.values.push(new TimedValue(v))
      });
    }
  });
};