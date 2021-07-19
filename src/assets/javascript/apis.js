import * as tempura from "./tempura.js";

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
 { "text": "OpenAPI-GUI", "template": "https://mermade.github.io/openapi-gui/?url={swaggerUrl}" },
 { "text": "Stoplight Elements", "template": "https://elements-demo.stoplight.io/?spec={swaggerUrl}" }
];

const monthAgo = new Date(new Date().setDate(new Date().getDate()-30));
let category = '';
let tag = '';
let status = '';
let newData = false;

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
    this.classes = '';
    this.flashText = '';
    this.flashTitle = '';
    this.preferred = '';
    this.api = '';
    this.info = '';
    this.logo = '';
    this.externalUrl = '';
    this.versions = null;
    this.markedDescription = '';
    this.cardDescription = '';
    this.added = null;
    this.updated = null;
}

CardModel.prototype.fromAPIs = function(name, apis) {
    this.preferred = apis.preferred;
    this.api = apis.versions[this.preferred];
    this.info = this.api.info;
    this.externalDocs = this.api.externalDocs || {};
    this.contact = this.info.contact || {};
    this.externalUrl = this.externalDocs.url || this.contact.url || 'https://'+name.split(':')[0];
    this.logo = this.info['x-logo'] || {};
    if (this.api.info['x-origin']) {
      this.origUrl = this.api.info['x-origin'][0].url;
    }
    else {
      this.origUrl = this.api.swaggerUrl;
    }
    this.added = new Date(apis.added);
    this.updated = this.added;
    const that = this;

    var versions = [];
    $.each(apis.versions, function (version, api) {
        if (api.updated) {
            let updatedDate = new Date(api.updated);
            if (updatedDate > that.updated) {
                that.updated = updatedDate;
            }
        }
        if (version === this.preferred) {
            return;
        }
        versions.push({
            version: version,
            swaggerUrl: api.swaggerUrl,
            swaggerYamlUrl: api.swaggerYamlUrl
        });
    });
    if (this.added >= monthAgo) {
        this.classes = 'flash flash-green';
        this.flashText = 'New!';
        this.flashTitle = this.added.toLocaleString();
    }
    else if (this.updated >= monthAgo) {
        this.classes = 'flash flash-yellow';
        this.flashText = 'Updated';
        this.flashTitle = this.updated.toLocaleString();
    }
    if (this.api.info['x-tags'] && this.api.info['x-tags'].indexOf('helpWanted')>=0) {
        const link = (this.api.info['x-issues']||['https://github.com/APIs-guru/openapi-directory/issues'])[0];
        this.classes = 'flash flash-red';
        this.flashText = `<a href="${link}" target="_blank">Help Wanted</a>`;
        this.flashTitle = this.updated.toLocaleString();
    }

    this.versions = versions.length > 1 ? versions : null;
    this.markedDescription = window.marked(this.info.description || '', { renderer });
    this.cardDescription = this.markedDescription.replace(/(<([^>]+)>)/gi, "").split(" ").splice(0,50).join(" ");
    this.integrations = [];
    for (let i of integrations) {
        this.integrations.push({ text: i.text, template: i.template.replace('{swaggerUrl}',this.api.swaggerUrl) });
    }

    return this;
};

export function loadAPIs() {
    var cardTemplateSrc = document.querySelector('script[type="text/tempura"]').innerText;
    var cardTemplate = tempura.compile(cardTemplateSrc);

    var updateCards = function(data) {
        var fragment = $(document.createDocumentFragment());
        $.each(data, function (name, apis) {
            var model = new CardModel().fromAPIs(name, apis);
            var view = cardTemplate({it:model});
            fragment.append($(view));
        });

        $('#apis-list').append(fragment);
    };

    var filter = function(data, search, category, tag, status) {
        if (!(search || category || tag || status)) return data;
        var result = {};
        $.each(data, function (name, apis) {
            if (search && name.toLowerCase().indexOf(search) >= 0) {
                result[name] = apis;
            }
            else {
                const version = apis.versions[apis.preferred];
                if (status === 'updated' && new Date(version.updated) >= monthAgo) {
                    result[name] = apis;
                }
                if (status === 'new' && new Date(version.added) >= monthAgo) {
                    result[name] = apis;
                }
                if (category && (version.info['x-apisguru-categories']||[]).indexOf(category)>=0) {
                    result[name] = apis;
                }
                if (tag && (version.info['x-tags']||[]).indexOf(tag)>=0) {
                    result[name] = apis;
                }
            }
        });
        return result;
    };

    let urlParams = new URLSearchParams(location.search);
    if (urlParams.get('q')) {
        $('#search-input').val(urlParams.get('q'));
    }
    if (urlParams.get('category')) {
       category = urlParams.get('category').toLowerCase();
    }
    if (urlParams.get('tag')) {
       tag = urlParams.get('tag');
    }
    if (urlParams.get('status')) {
       status = urlParams.get('status').toLowerCase();
    }
    if (urlParams.get('nd')) {
       newData = true;
    }

    $.ajax({
      type: "GET",
      url: (newData ? "https://raw.githubusercontent.com/APIs-guru/openapi-directory/gh-pages/v2/list.json" : "https://api.apis.guru/v2/list.json"),
      dataType: 'json',
      cache: true,
      success: function (data) {
        $('#apis-list').empty();
        let search = $('#search-input').val().toLowerCase();
        if (search || category || tag || status) {
            let result = filter(data, search, category, tag, status);
            updateCards(result);
        }
        else {
            updateCards(data);
        }

        var searchInput = $('#search-input')[0];
        searchInput.addEventListener('keyup', debounce(function() {
            $('#apis-list').empty();

            let search = $('#search-input').val().toLowerCase();
            history.replaceState(null, '', '/' + (search ? '?q='+encodeURIComponent(search) : ''));
            if (search) {
              $('#btnCopy').show();
            }
            else {
              $('#btnCopy').hide();
            }
            let result = filter(data, search, category, tag, status);
            updateCards(result);
        }, 333), false);
      }
    });

    for (let i=0;i<15;i++) { updateCards(dummy); }

    $('#btnCopy').on('click',function(){
        $('#txtCopy').show();
        $('#txtCopy').val(window.location.href);
        $('#txtCopy').focus().select();
        document.execCommand('copy');
        $('#txtCopy').hide();
        $('#search-input').focus();
    });

}

