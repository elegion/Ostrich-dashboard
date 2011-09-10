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
  this.values = newFilledArray(400, initial);
  this.opts = {}

  this.addValue = function(value) {
    this.values = this.values.slice(1)
    this.values.push(value)
  };

  $('#graphs > table > tbody').append(
    '<tr>' +
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
  return me;
}

function Gauge(name, initialValue) {
  var id = "g_"+name.replace(/[^a-zA-Z0-9]/g, "_");
  var me = new Indicator(id, name, initialValue, 'gauge');
  return me;  
}


