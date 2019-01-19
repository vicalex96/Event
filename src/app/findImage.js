var Event = require("./models/event");

module.exports= function(req,res,next){
  Event.findById(req.params.id)
      .populate("creator")
      .exec(function(err,evento){
          if(evento != null){
            res.locals.evento = evento;
            next();
          }else{
            res.redirect("/");
          }
        })
}
