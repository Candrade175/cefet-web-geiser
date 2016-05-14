var express = require('express'),
    app = express(),
    fs = require('fs'),
 	Handlebars = require('handlebars');

var aux,
 	data,
    games,
 	notPlayedYet,
 	orderedListOfGames,
    player,
    playerGames,
    players,
    topFive,
 	urlJogador = '/jogador/';

var _ = require('underscore');

// carregar "banco de dados" (data/jogadores.json e data/jogosPorJogador.json)
// você pode colocar o conteúdo dos arquivos json no objeto "db" logo abaixo
// dica: 3-4 linhas de código (você deve usar o módulo de filesystem (fs))
var db = [ JSON.parse(fs.readFileSync('server/data/jogadores.json')),
		   JSON.parse(fs.readFileSync('server/data/jogosPorJogador.json')) ];

players = db[0].players;
games 	= db[1];

// configurar qual templating engine usar. Sugestão: hbs (handlebars)
//app.set('view engine', '???');
app.set('view engine', 'hbs');

// EXERCÍCIO 2
// definir rota para página inicial --> renderizar a view index, usando os
// dados do banco de dados "data/jogadores.json" com a lista de jogadores
// dica: o handler desta função é bem simples - basta passar para o template
//       os dados do arquivo data/jogadores.json
app.set('views', 'server/views');

app.get('/', function (req, res) {
	res.render('index', {
		players: players
	});
});

// EXERCÍCIO 3
// definir rota para página de detalhes de um jogador --> renderizar a view
// jogador, usando os dados do banco de dados "data/jogadores.json" e
// "data/jogosPorJogador.json", assim como alguns campos calculados
// dica: o handler desta função pode chegar a ter umas 15 linhas de código

/**LÓGICA DE SELEÇÃO*/
app.get(urlJogador + '*', function (req, res) {

	player 				= _.find(players, function(num) { return req.url.indexOf(num.steamid) != -1 });
	playerGames 		= _.find(Object.keys(games), function(num) { return num == player.steamid });
	orderedListOfGames 	= _.sortBy(games[playerGames].games, function(num) { return (-1*num.playtime_forever); });
	notPlayedYet 		= 0;
	topFive 			= _.map(_.first(orderedListOfGames, [5]), function (num) { 
							num.playtime_forever = Math.round(num.playtime_forever/60); 
							return num; });

	for (var i = 0; i < games[playerGames].games.length; i++)
		if (games[playerGames].games[i].playtime_forever == 0)
			notPlayedYet++;
	
	res.render('jogador', {
		player: 		player,
		games: 			games[playerGames],
		notPlayedYet: 	notPlayedYet,
		favoriteGame: 	topFive[0],
		topFive: 		topFive
	});
});


//EXERCÍCIO 1
// configurar para servir os arquivos estáticos da pasta "client"
// dica: 1 linha de código
app.use(express.static('client'));

// abrir servidor na porta 3000
// dica: 1-3 linhas de código

app.listen(3000, function () {
  console.log('Listening');
});