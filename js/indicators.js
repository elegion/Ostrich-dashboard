function TimedValue(value) {
  this.time = new Date();
  this.value = value;
}

function newFilledArray(len, val) {
  var rv = new Array(len);
  while (--len >= 0) {
      rv[len] = val;
  }
  return rv;
}


function Indicator(id, name, initialValue, type) {
  var initial = new TimedValue(initialValue);
  this.id = id
  this.name = name;
  this.values = newFilledArray(350, initial);
  this.opts = {}

  this.addValue = function(value) {
    this.values = this.values.slice(1)
    this.values.push(value)
  };

  this.render = function() {
    var data = this.getData();
    $('#'+this.id+" > span").sparkline(data, {width: "350px", height: "30px"});
    $('#value_'+this.id).text(this.values[this.values.length-1].value);
    var delta = this.values[this.values.length-1].value - this.values[this.values.length-2].value;
    var sign  = delta >= 0 ? "+" : "";
    $('#delta_'+this.id).text('('+sign+delta+')');
  }

  $('#graphs > table > tbody').append(
    '<tr>' +
     '<td>'+type+'&nbsp</td>' + 
     '<td>'+name+'&nbsp</td>' + 
     '<td id="value_'+id+'"></td>' + 
     '<td id="delta_'+id+'"></td>' + 
     '<td class="spark" id="'+id+'"><span>...</span></td>' + 
    '</tr>'
  );

}

function Counter(name, initialValue) {
  var id = "c_"+name.replace(/[^a-zA-Z0-9]/g, "_");
  var me = new Indicator(id, name, initialValue, 'counter');
  me.getData = function() {
    var deltas = [];
    for (var i=1; i < me.values.length; i++) { //(puke)
      deltas.push(me.values[i].value - me.values[i-1].value);
    };
    return deltas;
  };

  return me;
}

function Gauge(name, initialValue) {
  var id = "g_"+name.replace(/[^a-zA-Z0-9]/g, "_");
  var me = new Indicator(id, name, initialValue, 'gauge');
  me.getData = function() {
    return $.map(me.values, function(timevalue){
      return timevalue.value;
    });
  };
  return me;  
}


