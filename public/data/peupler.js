let peupler = () => {
	const tableau = require('./tableau');
	let liste = [];
	for (let i=0; i<5; i++) {
		let personne = {};
		personne.nom = tableau.nom[Math.floor(Math.random() * tableau.nom.length)];
		personne.prenom = tableau.prenom[Math.floor(Math.random() * tableau.prenom.length)];
		personne.telephone = tableau.telephone[Math.floor(Math.random() * tableau.telephone.length)] + "-" + Math.floor(Math.random()* 1000).ToString + "-" + Math.floor(Math.random()* 10000).ToString;
	}
}

