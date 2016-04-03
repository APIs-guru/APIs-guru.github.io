$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "https://apis-guru.github.io/api-models/api/v1/list.json",
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
                var logoUrl = logo.url || 'no-logo.png';
                var logoBg = logo.backgroundColor || 'transparent';

                var card = $(
                    "<div class='col-xs-6 col-sm-4 col-md-3 .col-lg-2'>\
                      <div class='panel panel-default text-center'>\
                          <div class='panel-heading'>\
                            " + (externalUrl ? "<a href='" + (externalUrl || '') + "' target='_blank'>" + info.title + "</a>" : info.title) + "\
                          </div>\
                          <div class='panel-body'>\
                              <div class='text-center panel-body-logo'>\
                                <img src='" + logoUrl + "' style='background-color: " + logoBg + "'; class='api-logo'>\
                              </div>\
                              <div class='panel-body-description line-clamp line-clamp-3'>" + marked(info.description || '') + "</div>\
                          </div>\
                          <div class='panel-footer'>\
                              <div class='footer-description'> OpenAPI/Swagger 2.0: </div>\
                              <div class='versions'><span class='truncate'>" + preferred + "</span>\
                              <span>\
                                      <a href='" + api.swaggerUrl + "' target='_blank' class='label label-primary'>json</a> \
                                      <a href='" + api.swaggerYamlUrl + "' target='_blank' class='label label-primary'>yaml</a>\
                                  </span>\
                              </div>\
                          </div>\
                      </div>\
                    </div>");

                var versions;
                var versionsGroup = $(
                    "<div class='btn-group'>\
                        <button class='btn btn-default btn-xs dropdown-toggle' type='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='true'>\
                            <span class='caret'></span>\
                        </button>\
                        <ul class='dropdown-menu'></ul>\
                    </div>");
                card.find('.versions').prepend(versionsGroup);

                $.each(apis.versions, function (version, api) {
                    if (version != preferred) {
                        if (!versions) {
                            versions = card.find('.dropdown-menu');
                        }
                        versions.append(
                            "<li>\
                                <span>" + version + "</span>\
                                <span>\
                                    <a href='" + api.swaggerUrl + "' target='_blank' class='label label-primary'>json</a> \
                                    <a href='" + api.swaggerYamlUrl + "' target='_blank' class='label label-primary'>yaml</a>\
                                </span>\
                            </li>");
                    }
                });

                if (!versions) {
                    versionsGroup.css('visibility', 'hidden');
                    versionsGroup.css('width', '0');
                }

                fragment.append(card);
            });

            $('#list').append(fragment);
            $('#footer').show();
        }
    });
});
