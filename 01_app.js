const express = require('express')
const app = express()
const fs = require('fs')
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID
const Peupler = require('./public/data/peupler')
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))

/*------------------Accueil------------------*/
app.get('/', (req, res) => {
  res.render('gabarit.ejs')  
})

/*------------------Adresses------------------*/
app.get('/adresses', (req, res) => {
	let cursor = db.collection('adresse').find().toArray(function(err, resultat) {
	 	if (err) return console.log(err)
	 	console.log(JSON.stringify(resultat))
	 	// transfert du contenu vers la vue index.ejs (renders)
	 	// affiche le contenu de la BD          
	 	res.render('gabaritAdresses.ejs', {adresses: resultat})  
  })
})

/*------------------Formulaire------------------*/
app.get('/formulaire', (req, res) => {
  res.render('gabaritFormulaire.ejs')  
})

/*------------------Ajouter------------------*/
app.post('/ajouter', (req, res) => {
	db.collection('adresse').save(req.body, (err, result) => {
 		if (err) return console.log(err)
 		res.redirect('/adresses')
 	})
})

/*------------------Effacer------------------*/
app.get('/detruire/:id', (req, res) => {
	let id = req.params.id
  db.collection('adresse').findOneAndDelete({_id: ObjectID(id)}, (err, resultat) => {
  	if (err) return console.log(err)
  	console.log(id)
  	res.redirect('/adresses')
  })
})

/*------------------Trier------------------*/
app.get('/trier/:clef/:ordre', (req, res) => {
	let clef = req.params.clef
	let ordre = (req.params.ordre == 'asc' ? 1 : -1)
  db.collection('adresse').find().sort(clef, ordre).toArray((err, resultat) => {
  	if (err) return console.log(err)
  	ordre = (req.params.ordre == 'asc' ? 'des' : 'asc')
  	res.render('gabaritAdresses.ejs', {adresses: resultat, clef, ordre}) 
  })
})

/*------------------Modifier------------------*/
app.post('/modifier', (req, res) => {
	req.body._id = ObjectID(req.body._id)
 		db.collection('adresse').save(req.body, (err, result) => { 
 			if (err) return console.log(err) 
 			console.log('sauvegarder dans la BD') 
 			res.redirect('/adresses') 
 		})
})

/*------------------Peupler------------------*/
app.get('/peupler', (req, res) => {
	let resultat = Peupler();
	db.collection('adresse').insert(resultat, (err, result) => {
		if (err) return console.log(err);
		res.redirect('/adresses')
	})
})

/*------------------¸Drop------------------*/
app.get('/drop', (req, res) => {
	db.collection('adresse').drop((err, result) => {
		if (err) return console.log(err);
		res.redirect('/adresses')
	})
})

/*---------------profil----------------*/ 
app.get('/profil/:id', (req, res) => {
	db.collection('adresse').find( {_id: ObjectID(req.params.id)} ).toArray((err, resultat) => {
		if (err) return console.log(err)
		res.render('gabaritProfil.ejs', {adresses: resultat[0]})
	})
})


/*---------------rechercher----------------*/ 
app.post('/recherche', (req, res) => {

	db.collection('adresse').find( {prenom: req.body.prenom} ).toArray((err, resultat) => {
		if (err) return console.log(err)
		res.render('gabaritAdresses.ejs', {adresses: resultat})
	})
})

/*----------------------Connexion à MongoDB et au serveur Node.js-----------------------*/
let db // variable qui contiendra le lien sur la BD
MongoClient.connect('mongodb://127.0.0.1:27017/carnet_adresse', (err, database) => {
	if (err) return console.log(err)
	db = database.db('carnet_adresse')
	// lancement du serveur Express sur le port 8081
	app.listen(8081, () => {
	 	console.log('connexion à la BD et on écoute sur le port 8081')
	})
})