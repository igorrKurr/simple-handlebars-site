/*jshint sub:true*/
var LoT = LoT || {};

var renderTemplate = function(templateName, data) {
  $('body').append(LoT.Templates[templateName](data));
};

var data = {name: "Olekkkg"};
renderTemplate('index', data);