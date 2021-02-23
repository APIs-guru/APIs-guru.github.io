'use strict';

const dummy = {
  loading: {
    preferred: 'Loading...',
    versions: {
      'Loading...': {
        info: {
          description: 'Please wait...',
          title: 'Loading...'
        }
      }
    }
  }
};

const integrations = [
 { "text": "Swagger UI", "template": "http://petstore.swagger.io/?url={swaggerUrl}" },
 { "text": "Swagger Editor", "template": "http://editor.swagger.io/?url={swaggerUrl}" },
 { "text": "OpenAPI-GUI", "template": "https://mermade.github.io/openapi-gui/?url={swaggerUrl}" }
];

const renderer = new window.marked.Renderer();
renderer.code = function(code, language) { return '' };
renderer.table = function(header, body) { return '' };
renderer.heading = function(text, number) { return `<h3>${text}</h3\n` };
renderer.link = function(href, title, text) { return text };
renderer.image = function(href, title, text) { return '' };

function debounce(func, wait, immediate) { // from underscore.js, MIT license
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

function CardModel() {
    this.preferred = '';
    this.api = '';
    this.info = '';
    this.logo = '';
    this.externalUrl = '';
    this.versions = null;
    this.markedDescription = '';
}

CardModel.prototype.fromAPIs = function(apis) {
    this.preferred = apis.preferred;
    this.api = apis.versions[this.preferred];
    this.info = this.api.info;
    this.externalDocs = this.api.externalDocs || {};
    this.contact = this.info.contact || {};
    this.externalUrl = this.externalDocs.url || this.contact.url;
    this.logo = this.info['x-logo'] || {};

    var versions = [];
    $.each(apis.versions, function (version, api) {
        if (version === this.preferred) {
            return;
        }
        versions.push({
            version: version,
            swaggerUrl: api.swaggerUrl,
            swaggerYamlUrl: api.swaggerYamlUrl
        });
    });

    this.versions = versions.length > 1 ? versions : null;
    this.markedDescription = window.marked(this.info.description || '', { renderer });
    this.integrations = [];
    for (let i of integrations) {
       this.integrations.push({ text: i.text, template: i.template.replace('{swaggerUrl}',this.api.swaggerUrl) });
    }

    return this;
};

if (window.$) {
  $(document).ready(function () {
    var cardTemplateSrc = document.querySelector('script[type="text/dot-template"]').innerText;
    var cardTemplate = window.doT.compile(cardTemplateSrc);

    var updateCards = function(data) {
        var fragment = $(document.createDocumentFragment());
        $.each(data, function (name, apis) {
            var model = new CardModel().fromAPIs(apis);
            var view = cardTemplate(model);
            fragment.append($(view));
        });

        $('#apis-list').append(fragment);
    };

    var filter = function(data, search) {
        var result = {};
        $.each(data, function (name, apis) {
            if (name.toLowerCase().indexOf(search) >= 0) {
                result[name] = apis;
            }
        });
        return result;
    };

    $.ajax({
      type: "GET",
      url: "https://api.apis.guru/v2/list.json",
      dataType: 'json',
      cache: true,
      headers: { "Accept-Encoding" : "gzip,deflate,br" },
      success: function (data) {
        $('#apis-list').empty();
        let search = $('#search-input').val().toLowerCase();
        if (search) {
          let result = filter(data, search);
          updateCards(result);
        }
        else {
          updateCards(data);
        }

        var searchInput = $('#search-input')[0];
        searchInput.addEventListener('keyup', debounce(function() {
            $('#apis-list').empty();

            let search = $('#search-input').val().toLowerCase();
            let result = filter(data, search);
            updateCards(result);
        }, 333), false);
      }
    });

    for (let i=0;i<8;i++) { updateCards(dummy); }

    let urlParams = new URLSearchParams(location.search);
    if (urlParams.get('q')) {
      $('#search-input').val(urlParams.get('q'));
    }

  });
}
