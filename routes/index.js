module.exports={

    latest: function(req, res){
        res.render('latest.ejs');
    },

    topRated : function(req, res){
        res.render('top-rated.ejs');
    },

    search: function(req, res){
        res.render('search.ejs');
    },

    watchList: function(req, res){
        res.render('watch-list.ejs');
    },
    details: function(req, res){
        res.render('details.ejs');
    },

}