var app = {
        userInputs: [
            'christmas',
            'halloween',
            'disney movies',
            'ocean'
        ],
        userInput: "",

        // add user entered topics to array
        pushUserInputToArray: function() {
            app.userInput = $("#user-input").val().trim();
            if (app.userInput && ($.inArray(app.userInput, app.userInputs) < 0)) {
                app.userInputs.push(app.userInput);
            }
        },

        // create buttons for all topics
        displayButtons: function() {
            $("#buttons-holder").empty();
            $.each(app.userInputs, function(index, value) {
                val = value.charAt(0).toUpperCase() + value.slice(1);
                var newButton = $('<button id="' + value + '" class="btn btn-sm btn-primary topics">' + val + '</button>');
                $("#buttons-holder").append(newButton);
            });
        },

        //ajax call
        createAjaxCall: function(topic) {
            var searchTopic = encodeURIComponent(topic);
            var apiUrl = "https://api.giphy.com/v1/gifs/search";
            apiUrl += '?' + $.param({
                'q': searchTopic,
                'limit': 10,
                'rating': 'pg-13',
                'api_key': 'dc6zaTOxFJmzC',
            });
            $.ajax({ url: apiUrl, method: 'GET' }).done(function(response) {
                app.displayTopicInfo(response);
            }).fail(function(err) {
                var html = "<div class='no-img'>";
                html += "We couldn't pull any data at this time. Please try again later."
                html += "</div>"
                $("#topic-images").html(html);
            });
        },

        // create image tags and append it to page
        displayTopicInfo: function(response) {
            //console.log(response.data.length);
            if (response.data.length) {
                var result = response.data;
                var d = $('<div>');
                d.addClass("apiImgs");
                $.each(result, function(index, value) {
                    var imgRatingHolder = $('<div>');
                    imgRatingHolder.addClass('imgRatingHolder');

                    var rating = $('<div>');
                    rating.html('Rating:' + value.rating);
                    rating.addClass('rating');
                    imgRatingHolder.append(rating);

                    var imgTag = $('<img>');
                    imgTag.attr('src', value.images.downsized_still.url);
                    imgTag.attr('width', 150);
                    imgTag.attr('height', 120);
                    imgTag.addClass('gif');
                    imgTag.attr('data-still', value.images.downsized_still.url);
                    imgTag.attr('data-animate', value.images.downsized.url);
                    imgTag.attr('data-state', 'still');
                    imgRatingHolder.append(imgTag);
                    d.append(imgRatingHolder);
                });
                $("#topic-images").html(d);
            } else {
                $("#topic-images").html("<div class='no-img'>No Image Related To This Topic Available.</div>");
            }
        },

        //change api image status
        changeImgState: function(imgObj) {
            var state = $(imgObj).attr('data-state');
            if (state == 'still') {
                $(imgObj).attr('src', $(imgObj).data('animate'));
                $(imgObj).attr('data-state', 'animate');
            } else {
                $(imgObj).attr('src', $(imgObj).data('still'));
                $(imgObj).attr('data-state', 'still');
            }
        },

        // event handlers
        setUpEventHandlers: function() {
            app.displayButtons();
            $("#add-to-list").on('click', function() {
                app.pushUserInputToArray();
                app.displayButtons();
            });

            $("#buttons-holder").on('click', '.topics', function() {
                var topic = $(this).attr('id');
                app.createAjaxCall(topic);
            });

            $("#topic-images").on('click', '.gif', function() {
                app.changeImgState(this);
            });
        },
    } // end app obj

$(document).ready(function() {
    app.setUpEventHandlers();
});
