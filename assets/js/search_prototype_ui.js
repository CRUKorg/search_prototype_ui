(function($){
  'use strict';
  $(document).ready(function() {
    var last_search = '';

    function switchClasses() {
      if ($('#search-input').val() !== '') {
        if ($('.btn .glyphicon').hasClass('glyphicon-search')) {
          $('.btn .glyphicon-search').fadeOut('fast', function(){
            $(this).removeClass('glyphicon-search').addClass('glyphicon-remove').fadeIn('fast');
          });
        }
      }
      if ($('#search-input').val() === '' && $('.btn .glyphicon').hasClass('glyphicon-remove')) {
        $('.btn .glyphicon-remove').fadeOut('fast', function(){
          $(this).removeClass('glyphicon-remove').addClass('glyphicon-search').fadeIn('fast');
        });
      }
    }

    /**
     * Add and remove the focus class to the wrapper.
     */
    $('.cr-form-item .form-control').on('focus', function(){
      $(this).parent().addClass('cr-form-item--focused');
    }).on('blur', function(){
      $(this).parent().removeClass('cr-form-item--focused');
    });

    /**
     * On form submit switch out the action icon.
     */
    $('#search-form').submit(function(e){
      e.preventDefault();

      if ($('#search-input').val() === '') {
        return false;
      }

      switchClasses();

      /**
       * Do a search!
       */
      var query = encodeURIComponent($('#search-input').val()).trim();

      if (query !== '' && query !== last_search) {
        $.getJSON('https://www.googleapis.com/books/v1/volumes?q=' + query, function(data) {
          if (data.totalItems > 0) {
            var markup = '<div class="panel panel-default"><ul class="list-group">';
            $.each(data.items, function(key, val) {
              var snippet = '';
              if (val.hasOwnProperty('searchInfo')) {
                snippet = val.searchInfo.textSnippet;
              }
              markup += '<li class="list-group-item"><h3><a href="#">' + val.volumeInfo.title + '</a></h3><p>' + snippet + '</p></li>';
            });
            markup += '</ul></div>';
            $('#results').html(markup);
          }
          else {
            $('#results').html('<p class="text-center">Sorry, no results were found...</p>');
          }
        });

        last_search = query;
      }
    });

    /**
     * Click of the clear button.
     */
    $('.btn .glyphicon').on('click', function(e){
      if ($(this).hasClass('glyphicon-remove')) {
        $('#search-input').val('');
        switchClasses();
      }
    });
  });

}(jQuery));