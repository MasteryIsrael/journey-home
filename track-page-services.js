function play_mp3_in_global_player(url,text)
{
	$("#audioButtons").empty();

	var ubaPlayer=document.getElementById("ubaPlayer");
	if (ubaPlayer)
	{
		$(ubaPlayer).ubaPlayer("pause");
	}
	else
	{
		ubaPlayer=document.createElement("div");
		ubaPlayer.id="ubaPlayer";
		document.body.appendChild(ubaPlayer);
	}
	
	var li=document.createElement("span");
	var link=document.createElement("a");
	link.className="audioButton";
	link.href=url;
	li.appendChild(link);
	li.appendChild(document.createTextNode(text));
	document.getElementById("audioButtons").appendChild(li);
	//$("#ubaPlayer").ubaPlayer({codecs: {name:"MP3", codec: 'audio/mpeg'},autoPlay: $('.audioButton').eq(0)});
	$("#ubaPlayer").ubaPlayer({codecs: [{name:"MP3", codec: 'audio/mpeg; codecs="mp3"'}]});
	$("#ubaPlayer").ubaPlayer("play", $('.audioButton').eq(0));
	$("#player_area").show("fade",1000);	
}
