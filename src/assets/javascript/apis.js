'use strict';

$(document).ready(function () {
  var cardTemplateSrc = document.querySelector('script[type="text/dot-template"]').innerText;
  var cardTemplate = window.doT.compile(cardTemplateSrc);

  $.ajax({
    type: "GET",
    url: "https://apis.guru/api-models/api/v1/list.json",
    dataType: 'json',
    cache: false,
    success: function (data) {
      var fragment = $(document.createDocumentFragment());
      $.each(data, function (name, apis) {
        var preferred = apis.preferred;
        var api = apis.versions[preferred];
        var info = api.info;
        var externalDocs = api.externalDocs || {};
        var contact = info.contact || {};
        var externalUrl = externalDocs.url || contact.url;
        var logo = info['x-logo'] || {};

        var versions = [];
        $.each(apis.versions, function (version, api) {
          if (version === preferred) {
            return;
          }
          versions.push({
            version: version,
            swaggerUrl: api.swaggerUrl,
            swaggerYamlUrl: api.swaggerYamlUrl
          });
        });

        var card = cardTemplate({
          preferred: preferred,
          api: api,
          info: info,
          logo: logo,
          externalUrl: externalUrl,
          versions: versions.length ? versions : null,
          markedDescription: window.marked(info.description || '')
        });
        fragment.append($(card));
      });

      $('#apis-list').append(fragment);
    }
  });
});
