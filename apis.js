$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "http://apis-guru.github.io/api-models/api/v1/list.json",
        dataType: 'json',
        cache: false,
        success: function (data) {
            var fragment = $(document.createDocumentFragment());
            $.each(data, function (name, apis) {
                var preferred = apis.preferred;
                var api = apis.versions[preferred];
                var info = api.info;
                var contact = info.contact || {};
                var logo = info['x-logo'] || {};
                var logoUrl = logo.url || 'no-logo.png';
                var logoBg = logo.backgroundColor || '#fff';

                var card = $(
                    "<div class='col-xs-6 col-sm-4 col-md-3 .col-lg-2'>\
                        <div class='api-card'>\
                            <div style='padding: 5px 15px; border-radius: 9px 9px 0 0; background-color: " + logoBg + ";'>\
                                <div class='logo' style='background-image: url(\"" + logoUrl + "\");'/>\
                            </div>\
                            <div class='content'>\
                                <div class='title'>\
                                    <a href='" + (contact.url || '') + "' target='_blank'>" + info.title + "</a>\
                                </div>\
                                <div>" + marked(info.description || '') + "</div>\
                            </div>\
                            <div class='footer'>\
                                <div>Swagger 2.0</div>\
                                <div class='versions'>\
                                    <div style='display: inline-block; vertical-align: bottom;' class='truncate'>" + preferred + "</div>\
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
                card.find('.versions').append(versionsGroup);

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