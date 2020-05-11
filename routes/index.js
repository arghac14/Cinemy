

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

  
    details: function(req, res){
        res.render('details.ejs');
    },

    watchList: function(req,res){
       // console.log("not local:"+UN)
        //console.log("Before:"+UN+ "l"+UN.length)
        if (!req.session.loggedin){
            res.redirect('/signup')
        }
        else{
        if(UN.length<1){
            UN="arghac14";
        }
       // console.log("After:"+UN)

        let query="SELECT * FROM `"+UN+"`";
            db.query(query,function(err,result,fields){
                if(err){
                    res.redirect('/');
                }
                res.render('watch-list.ejs',{
                    info: result,
                    title: UN
                });
                
                //console.log(result)
    });
    }
   // handleDisconnect(db);
    },
    

    signUp: function(req, res){
        res.render('signup.ejs')
    },


    signIn: function(req, res){
        res.render('signin.ejs')
    },


    

}

