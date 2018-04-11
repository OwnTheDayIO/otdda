

Meteor.startup(() => {
    // These options can also be supplied in the template as follows:
    // ex:
    //    {{> spinner color="#81590d" radius=5 lines=10 length=4 width=3 shadow=false}}
    Meteor.Spinner.options = {
        lines:      10,         // The number of lines to draw
        length:     4,          // The length of each line
        width:      3,          // The line thickness
        radius:     5,          // The radius of the inner circle
        corners:    0.7,        // Corner roundness (0..1)
        rotate:     0,          // The rotation offset
        direction:  1,          // 1: clockwise, -1: counterclockwise
        color:      '#fff',     // #rgb or #rrggbb
        speed:      1,          // Rounds per second
        trail:      60,         // Afterglow percentage
        shadow:     false,      // Whether to render a shadow
        hwaccel:    true,       // Whether to use hardware acceleration
        className:  'spinner',  // The CSS class to assign to the spinner
        zIndex:     2e9,        // The z-index (defaults to 2000000000)
        top:        'auto',     // Top position relative to parent in px
        left:       'auto'      // Left position relative to parent in px
    };
});
