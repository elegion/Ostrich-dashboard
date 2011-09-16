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


function Indicator(id, name, initialValue, type, server) {
  var initial = new TimedValue(initialValue);
  this.id = id
  this.name = name;
  this.values = newFilledArray(350, initial);
  this.opts = {}
  this.server = server

  this.addValue = function(value) {
    this.values = this.values.slice(1)
    this.values.push(value)
  };

  this.render = function(color, count) {
    var oldCount = parseInt($('#'+this.id).attr("n"))
    var composite = true;
    if (oldCount < count) { //first redraw in this fetch pack
      $('#'+this.id).attr('n', count);
      $('#servers_'+this.id).empty();
      composite = false;  
      //$('#row_'+this.id).removeAttr('servers')
    } 
    var data = this.getData();
    var delta = this.values[this.values.length-1].value - this.values[this.values.length-2].value;
    var sign  = delta >= 0 ? "+" : "";
    var value = this.values[this.values.length-1].value;
    $('#'+this.id+" > span").sparkline(data, {width: "350px", height: "30px", lineColor: color, composite: composite, fillColor: false});
    $('#value_'+this.id).text(value);
    $('#delta_'+this.id).text('('+sign+delta+')');
    $('#servers_'+this.id).append('<span title="'+this.server.name+'" style="color: '+this.server.color+';">●&nbsp;</span>');
    var serversAttr = $('#row_'+this.id).attr('servers')
    if (!serversAttr) {
      serversAttr = ''
    }
    if (serversAttr.indexOf(this.server.id+',') < 0) {
      $('#row_'+this.id).attr('servers', serversAttr+this.server.id+',')
    }
  }

  if (!$('#'+id).length) {
    $('#graphs > table > tbody').append(
      '<tr id="row_'+id+'">' +
       '<td id="servers_'+id+'">'+type+'&nbsp</td>' + 
       '<td>'+name+'&nbsp</td>' + 
       '<td id="value_'+id+'"></td>' + 
       '<td id="delta_'+id+'"></td>' + 
       '<td class="spark" n="-1" id="'+id+'"><span>...</span></td>' + 
      '</tr>'
    );
  }
}

function Counter(name, initialValue, server) {
  var id = "c_"+name.replace(/[^a-zA-Z0-9]/g, "_");
  var me = new Indicator(id, name, initialValue, 'counter', server);
  me.getData = function() {
    var deltas = [];
    for (var i=1; i < me.values.length; i++) { //(puke)
      deltas.push(me.values[i].value - me.values[i-1].value);
    };
    return deltas;
  };

  return me;
}

function Gauge(name, initialValue, server) {
  var id = "g_"+name.replace(/[^a-zA-Z0-9]/g, "_");
  var me = new Indicator(id, name, initialValue, 'gauge', server);
  me.getData = function() {
    return $.map(me.values, function(timevalue){
      return timevalue.value;
    });
  };
  return me;  
}


