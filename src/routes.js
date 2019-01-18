var Event = require("./app/models/event");
var event_finder_middleware = require("./app/findImage");
const User = require('./app/models/user');
const fs = require("fs");
var career = '';

module.exports = (app, passport,cloudinary) => {

	// index routes
	app.get('/', (req, res) => {

		Event.find({},function(err, evento){
			if(err){
				res.render(err);
				return;
			}
			//muestra todas las imagenes
			res.render("index",{
				evento: evento,
				link: req.url,
				career: career
			});
		});
		career = '';
		});

app.get(['/IngInformatica', '/IngTelecom','/IngIndustrial','/IngCivil','/AdmYContad'
				,'/CienciasS', '/ComunicacionS', '/Derecho', '/Economia','/Educacion'
				,'/Filosofia', '/Letras','/Piscologia','/Teologia'], (req, res) => {
	switch(req.originalUrl){
		case '/IngInformatica': career = 'Ing. Informática'
			break;
		case '/IngTelecom':     career = 'Ing. Telecomunicaciones'
			break;
		case '/IngIndustrial':  career = 'Ing. Industrial'
			break;
		case '/IngCivil':       career = 'Ing. Civil'
			break;
		case '/AdmYContad':     career = 'Administración y Contaduría'
			break;
		case '/CienciasS':      career = 'Ciencias Sociales'
			break;
		case '/ComunicacionS':  career = 'Comunicacion Social'
			break;
		case '/Derecho':        career = 'Derecho'
			break;
		case '/Economia':       career = 'Economía'
			break;
		case '/Educacion':      career = 'Educación'
			break;
		case '/Filosofia':      career = 'Filosofía'
			break;
		case '/Letras':         career = 'Letras'
			break;
		case '/Piscologia':     career = 'Psicologia'
			break;
		case '/Teologia':       career = 'Teologia'
			break;
	}
	console.log('url: ' + req.originalUrl);
		Event.find({career: career},function(err, evento){
			if(err){
				res.render(err);
				return;
			}
			//muestra todas las imagenes
			res.render("index",{
				evento: evento,
				link: req.url,
				career: career
			});
		});
});

	//login view
app.get('/login', (req, res) => {
	if (req.isAuthenticated()) {
		res.redirect('/mis_publicaciones');
	}else{
		res.render('login', {
			message: req.flash('loginMessage')
		});
	}
});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/mis_publicaciones',
		failureRedirect: '/login',
		failureFlash: true
	}));

	// signup view
	app.get('/signup', (req, res) => {
		res.render('signup', {
			message: req.flash('signupMessage')
		});
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/editor',
		failureRedirect: '/signup',
		failureFlash: true // allow flash messages
	}));

	//administrar eventos
	/*REST*/
	app.route("/mis_publicaciones")
	.get(isLoggedIn,function(req,res){
		Event.find({creator: req.user._id},function(err, evento){
			if(err){
				res.redirect("/" );
				return;
			}
			//muestra todas las imagenes
			res.render("adminMyEvents",{
				evento: evento,
				link: req.url}
			 );
		});
	})

	app.get("/borrar_evento", function(req,res){
		Event.find({creator: req.user._id},function(err, evento){
			if(err){
				res.redirect("/" );
				return;
			}
			//muestra todas las imagenes
			res.render("adminDeleteEvent",{
				evento: evento,
				link: req.url}
			 );
		});
	});

	app.get("/agregar_evento", function(req,res){
		res.render("adminAddEvent");
	});

	app.route("/editar_evento")
	.get( function(req,res){
		res.render("adminEditEvent");
	})

	app.get("/borrar_evento", function(req,res){
		res.render("adminDeleteEvent");
	});

	app.all("/editor/:id*", event_finder_middleware);

	//editar imagenes
	app.get("/editor/:id/edit", function(req,res){
		res.render('adminEditEvent');
});

	//mostrar la imagen subida
	app.route("/editor/:id")
	.get(isLoggedIn, function(req,res){
			res.render('adminMyEvents');
	})

	//actualiza los datos
	.put(function(req,res){
			var img_id;
			img_id = res.locals.evento.image.split("/");
			img_id = img_id[img_id.length-1].split(".");

			res.locals.evento.title = req.body.title;
			res.locals.evento.career = req.body.career;
			res.locals.evento.description = req.body.description;

			if(req.file != null){
				cloudinary.uploader.upload(req.file.path, function(result, error){
					res.locals.evento.image = result.url;
					res.locals.evento.save(function(err){
						if(!err){
							res.redirect("/mis_publicaciones");
							if(req.file != null){
								cloudinary.v2.uploader.destroy(img_id[0], function(error, result){console.log(result, error)});
							}
						}
						else{
							res.render('/editor/'+req.params.id+'edit');
						}
					});
				});
			}else{
					res.locals.evento.save(function(err){
						if(!err){
							res.redirect("/mis_publicaciones");
						}
						else{
							res.render('/editor/'+req.params.id+'edit');
						}
					});
				}

		})

	//elimina
	.delete(function(req,res){
			// Eliminar y realiza otras acciones en el momento
			var img_id;
			Event.findById(req.params.id,function(err,evento){
			  img_id = evento.image.split("/");
				img_id = img_id[img_id.length-1].split(".");
				cloudinary.v2.uploader.destroy(img_id[0], function(error, result){console.log(result, error)});
				evento.remove();
				res.redirect('/borrar_evento');
			});


		/*solo elimina
		Event.findOneAndRemove({_id:req.params.id},function(err){
			if(!err){

				res.redirect('/borrar_evento');
			}else{
				console.log(err);
				res.redirect('/borrar_evento');
			}
		})*/
	});

	//muestra la informacion
	app.route("/editor")
	.get(isLoggedIn,function(req,res){
		Event.find({creator: req.user._id},function(err, evento){
			if(err){
				res.redirect("/" );
				return;
			}
			//muestra todas las imagenes
			res.render("adminMyEvents",{
				evento: evento,
				user: req.user}
			 );
		});
	})
	//guarda la informacion
	.post(function(req,res){
			console.log('file: ' + req.file.path);
			console.log('Descripcion: ' +req.body.description);

			var data = {
				title: req.body.title,
				creator: req.user._id,
				career: req.body.career,
				description: req.body.description,
				image: req.file.originalname
			}

			cloudinary.uploader.upload(req.file.path, function(repuesta){
					var evento = new Event(data);
					evento.image = repuesta.url;
					evento.save(function(err){
						if(!err){
							res.redirect("/mis_publicaciones");
						}
						else{
							res.render(err);
						}
					});
				});
  });


	// desconectarse
	app.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});

};



function isLoggedIn (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect('/');
}
