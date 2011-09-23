var Server = function(id, address, color) {
  this.id = id
  this.address = address.replace(/\/$/g, "");
  this.name = address.replace(/^https*:\/\//g, "").replace(/\/$/g, "");
  
  this.color = color
  this.indicators = [];
  this.indicatorNames = [];
  this.lastCount = 0;

  this.fetch = function(count, updatedSet, targetCount) {
    var self = this;
    $.jsonp({
      url: address+"/stats.json", 
      data: {callback: ""},
      dataType: "jsonp",
      callback: "ostrichCallback",
      timeout: 2000,
      success: function(data){
        $.each(data.counters, function(k,v){
          var indicator = self.indicators[k]
          if (!indicator) {
            indicator = new Counter(k, v, self);
            self.indicators[k] = indicator;
            self.indicatorNames.push(k);
          }
          indicator.addValue(new TimedValue(v));
        });
        $.each(data.gauges, function(k,v){
          var indicator = self.indicators[k]
          if (!indicator) {
            indicator = new Gauge(k, v, self);
            self.indicators[k] = indicator;
            self.indicatorNames.push(k);
          }
          indicator.addValue(new TimedValue(v));
        });
        updatedSet.push(self);
        if (updatedSet.length >= targetCount) {
          $.each(updatedSet, function(k, server){
            server.render(count);
          });  
        }
        
      },
      error: function(xOptions, status) {
        $('#errorDiv').show();  
        $('#errorDiv > p').text('Error occurred while trying to fetch '+xOptions.url+' ('+status+')!');
        $.each(self.indicators, function(indicator){
          indicator.addValue(new TimedValue(null))
        });

        //cause we don't want hanged server break our rendering
        updatedSet.push(self);
        if (updatedSet.length >= targetCount) {
          $.each(updatedSet, function(k, server){
            server.render(count);
          });  
        }

      }
    });
  };

  this.render = function(count) {
    this.lastCount = count;
    var self = this;
    var myTab  = $('#server-'+self.id)
    var allTab = $('#all-servers')
    if (myTab.hasClass('active') || allTab.hasClass('active')) {
      $.each(self.indicatorNames, function(k,indicatorName){
        self.indicators[indicatorName].render(self.color, count); 
      });
    }
  };

  $('#servers').append(
    '<li id="server-'+this.id+'">' +
      '<a href="#" id="tab_'+this.id+'"><span style="color: '+this.color+';">●&nbsp;</span>'+this.name+'&nbsp;<span class="closeServer">×</span></a>' + 
    '</li>'
  );

  var self = this;
  $('#tab_'+this.id).click(
    function(evt) {
      $('#servers > .active').removeClass('active');
      $('#server-'+id).addClass('active');
      //self.render(self.lastCount);
      $('#graphs > table > tbody > tr').each(function(k, tr){
        var shown = false;
        for (var i=0; i<self.indicatorNames.length; i++) {
          if (tr.id == self.indicators[self.indicatorNames[i]].rowId()) {
            shown = true;
            $(tr).show();
            self.indicators[self.indicatorNames[i]].render(self.color, self.lastCount+0.5); 
          }
        }
        if (!shown) {
          $(tr).hide();
        }
      });
    }
  );

};