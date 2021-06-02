---
layout: apis-page.liquid
title: Browse APIs
image: /assets/images/logo-big.png
permalink: /
order: 10
support: true
---
<a href="/projects" class="banner about-banner">
   Check out our other open-source projects
</a>
<div class="browse-apis container">
  {% include support.html %}
  <!-- search -->
  <div id="search" class="row">
    <div class="field col-md-6 col-md-offset-3">
      <label for="search">Filter <span id="numAPIs"></span> APIs&nbsp;
        <span id="btnCopy" class="hidden"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="height:1em;width:1em;"><title>Copy search link to clipboard</title><path d="M18 6v-6h-18v18h6v6h18v-18h-6zm-12 10h-4v-14h14v4h-10v10zm16 6h-14v-14h14v14z"></path></svg></span>
      </label>
      <input id="search-input" name="search" type="search" placeholder="Search…" required/>
    </div>
  </div>
  <input class="hidden" id="txtCopy"/>

  <section id="apis-list" class="cards"></section>
</div>

{% include card.html %}

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
<script>
  $(document).ready(function(){
    $.ajax({
      type: "GET",
      url: "https://api.apis.guru/v2/metrics.json",
      dataType: 'json',
      cache: true,
      success: function (data) {
        $('#numAPIs').text(data.numAPIs.toLocaleString());
      }
    });
  });
</script>
