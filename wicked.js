Handlebars.registerHelper('noteq', function(a, b, options) {
    return a != b ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('html', function(context) {
    if (context) {
        return new Handlebars.SafeString(context);
    }
    return context;
});
