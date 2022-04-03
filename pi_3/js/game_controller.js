const back = "../resources/back.png";
const items = ["../resources/cb.png","../resources/co.png","../resources/sb.png",
"../resources/so.png","../resources/tb.png","../resources/to.png"];
var optionsInfo = {
	cards:2,
	dificulty:"hard"
};
var load = function(){
	var json = localStorage.getItem("config") || '{"cards":2,"difficulty":"hard"}';
	optionsInfo = JSON.parse(json);
};
load();

var game = new Vue({
	el: "#game_id",
	data: {
		username:'',
		current_card: [],
		items: [],
		num_cards: 2,
		bad_clicks: 0,
		gameStart: false,
		showTime: 4000				
	},
	created: function(){

		this.username = sessionStorage.getItem("username","unknown");
		this.items = items.slice(); // Copiem l'array
		this.items.sort(function(){return Math.random() - 0.5}); // Array aleatòria
		this.num_cards = optionsInfo.cards;
		this.items = this.items.slice(0, this.num_cards); // Agafem els primers numCards elements
		this.items = this.items.concat(this.items); // Dupliquem els elements
		this.items.sort(function(){return Math.random() - 0.5}); // Array aleatòria
		for (var i = 0; i < this.items.length; i++){
			this.current_card.push({done: false, texture: this.items[i]});
		}
		if(optionsInfo.dificulty === "hard") this.showTime = 1000;
		else if(optionsInfo.dificulty === "normal") this.showTime = 2000;
		else this.showTime = 4000;
	},
	methods: {
		clickCard: function(i){
			if (!this.current_card[i].done && this.current_card[i].texture === back)
				Vue.set(this.current_card, i, {done: false, texture: this.items[i]});
		}
	},
	watch: {
		current_card: function(value){
			if(this.gameStart){
				if (value.texture === back) return;
				var front = null;
				var i_front = -1;
				for (var i = 0; i < this.current_card.length; i++){
					if (!this.current_card[i].done && this.current_card[i].texture !== back){
						if (front){
							if (front.texture === this.current_card[i].texture){
								front.done = this.current_card[i].done = true;
								this.num_cards--;
							}
							else{
								Vue.set(this.current_card, i, {done: false, texture: back});
								Vue.set(this.current_card, i_front, {done: false, texture: back});
								this.bad_clicks++;
								break;
							}
						}
						else{
							front = this.current_card[i];
							i_front = i;
						}
					}
				}
			}
		}
	},
	computed: {
		score_text: function(){
			if(optionsInfo.dificulty === "hard"){
				return 100 - this.bad_clicks * 40;
			}
			else if(optionsInfo.dificulty === "normal"){
				return 100 - this.bad_clicks * 25;
			}
			else{
				return 100 - this.bad_clicks * 10;
			}
			
		}
		
	}
});

var hideCards = function(){
	for(var i = 0; i < game.items.length; i++){
		Vue.set(game.current_card, i, {texture: back});
	}
	game.gameStart = true;
};
var createTimer = function(){
	const timeOut = setTimeout(hideCards, game.showTime)
};
createTimer();


