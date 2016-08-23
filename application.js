function renderHomeHours(container, template){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    var collection = getTodaysHours();
    Mustache.parse(template_html);   // optional, speeds up future uses
    item_list.push(collection);    
    $.each( item_list , function( key, val ) {
        val.day = get_day(val.day_of_week);
        var d = moment().tz(getPropertyTimeZone());
        val.month = d.format("MMM")
        val.weekday = d.format("dd")
        if (val.open_time && val.close_time && (val.is_closed == false || val.is_closed == null)){
            var open_time = in_my_time_zone(moment(val.open_time), "h:mm A");
            var close_time = in_my_time_zone(moment(val.close_time), "h:mm A");
            val.h = open_time + " - " + close_time;
        } else {
            val.h = "Closed";
        }
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderHours(container, template, collection, type){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    if (type == "reg_hours") {
        $.each( collection , function( key, val ) {
            if (!val.store_id && val.is_holiday == false) {
                switch(val.day_of_week) {
                    case 0:
                        val.day = "Sunday";
                        break;
                    case 1:
                        val.day = "Monday";
                        break;
                    case 2:
                        val.day = "Tuesday";
                        break;
                    case 3:
                        val.day = "Wednesday";
                        break;
                    case 4:
                        val.day = "Thursday";
                        break;
                    case 5:
                        val.day = "Friday";
                        break;
                    case 6:
                        val.day = "Saturday";
                        break;
                }
                if (val.open_time && val.close_time && val.is_closed == false){
                    var open_time = in_my_time_zone(moment(val.open_time), "h:mmA");
                    var close_time = in_my_time_zone(moment(val.close_time), "h:mmA");
                    val.h = open_time + " - " + close_time;
                } else {
                    "Closed";
                }
                
                item_list.push(val);
            }
        });
        collection = [];
        collection = item_list;
    }
    
    if (type == "holiday_hours") {
        $.each( collection , function( key, val ) {
            if (!val.store_id && val.is_holiday == true) {
                holiday = moment(val.holiday_date);
                val.formatted_date = in_my_time_zone(holiday, "ddd MMM DD YYYY");
                if (val.open_time && val.close_time && val.is_closed == false){
                    var open_time = in_my_time_zone(moment(val.open_time), "h:mmA");
                    var close_time = in_my_time_zone(moment(val.close_time), "h:mmA");
                    val.h = open_time + " - " + close_time;   
                } else {
                    val.h = "Closed";
                }
                item_list.push(val);
            }
        });
        collection = [];
        collection = item_list;
    }
    
    $.each( collection , function( key, val ) {
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);

    });
    
    $(container).show();
    $(container).html(item_rendered.join(''));
};

function in_my_time_zone(hour, format){
    return hour.tz(getPropertyTimeZone()).format(format)
}

function get_day(id){
    switch(id) {
        case 0:
            return ("Sunday");
            break;
        case 1:
            return ("Monday");
            break;
        case 2:
            return ("Tuesday");
            break;
        case 3:
            return ("Wednesday");
            break;
        case 4:
            return ("Thursday");
            break;
        case 5:
            return ("Friday");
            break;
        case 6:
            return ("Saturday");
            break;
    }
}