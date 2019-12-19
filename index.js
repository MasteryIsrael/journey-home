var orderedTracks=[];
var tracks={};
var defaultTrackKey="";
var currentTrack="";
var me_player;

function setupTracks()
{
	$("#sidebar nav a").remove();
	
	tracks={};
	$.each(orderedTracks, function (i, value) {
		value.index=i;
		tracks[value.key]=value;
		var key=value.key;
		var link=document.createElement("a");
		link.id="href_"+key;
		link.href="#" + key;
		link.appendChild(document.createTextNode(value.navtitle));
		var dur=document.createElement("div");
		dur.textContent = value.duration;
		dur.className="duration-info";
		link.appendChild(dur);
		var addto=value.addto;
		if (!addto)
			addto="#disc-nav";
		$(addto).append(link);
	});
	
	defaultTrackKey = orderedTracks[0].key;
}
 
function afterDomMutated()
{
  $('a[href="#' + currentTrack +'"], a[href^="#' + currentTrack +':"]').smoothScroll({
	speed: 1000,
	easing: 'easeInOutCubic',
	excludeWithin: ['#disc-nav, #special-nav, .quick-nav']
  });
  
  //reapply_lightbox();
}

var spinner;
var loadTimeoutID;

function loadCurrentTrack() {
	window.clearTimeout(loadTimeoutID);
	loadTimeoutID=undefined;
	$.ajax({
		url: tracks[currentTrack].content,
		timeout: 15000
		})
		.done(function(data, ts, xhr) {
			//console.log('ajax done');
			$("#track-content").html(data);
			$('body').css('display', 'block'); 
			$('#track-content a[href^="#:"]').attr('href', function(i, val){
				return '#' + currentTrack + val.substring(1);    
			});
			$('#track-content *[id^=":"]').attr('id', function(i, val){
				return currentTrack + val;    
			});
			$('#track-content *[name^=":"]').attr('name', function(i, val){
				return currentTrack + val;    
			});
		
			
			afterDomMutated();

			spinner.stop();
			
			location.hash=location.hash;
			
			if (location.hash == "#" + currentTrack)
			{
				var contentOffset = $("#content").offset().top;
				if ($("body").scrollTop() > contentOffset)
					$.smoothScroll(contentOffset);
			}			
		})			
		.fail(function() {
			//console.log('ajax fail');
			spinner.stop(); loadTimeoutID=window.setTimeout(loadCurrentTrack, 1000);
		});
}

 $(window).load(function(){
 
  // Bind the event.
  $(window).hashchange( function(){
	kill_lightbox();
    // Alerts every time the hash changes!
	var s=location.hash;
	var matches = s.match(/^#(.+?)(?::|$)/);

	var track=currentTrack;
	if (matches && (matches.length>1))
		track=matches[1];

	
	var navdir=0;
	var prevCurrentTrack  = currentTrack;
	
	var changed=false;
	if (track in tracks)
	{
		if (currentTrack != track)
		{
			currentTrack = track;
			changed=true;
		}
	}

	if (!currentTrack)
	{
		currentTrack = defaultTrackKey;
		changed=true;
	}
	if (!currentTrack in tracks)
		return;
	if (prevCurrentTrack && (prevCurrentTrack in tracks))
	{
		navdir = tracks[currentTrack].index - tracks[prevCurrentTrack].index;
	}
	if (changed)
	{
		//$("#track-content").empty();
		
		var opts = {
		  lines: 11, // The number of lines to draw
		  length: 4, // The length of each line
		  width: 3, // The line thickness
		  radius: 5, // The radius of the inner circle
		  corners: 1, // Corner roundness (0..1)
		  rotate: 0, // The rotation offset
		  color: '#000', // #rgb or #rrggbb
		  speed: 1, // Rounds per second
		  trail: 60, // Afterglow percentage
		  shadow: true, // Whether to render a shadow
		  hwaccel: false, // Whether to use hardware acceleration
		  className: 'spinner', // The CSS class to assign to the spinner
		  zIndex: 2e9, // The z-index (defaults to 2000000000)
		  top: 'auto', // Top position relative to parent in px
		  left: 'auto' // Left position relative to parent in px
		};
		
		//var target = document.getElementById('track-content');
		//$("#spinholder").remove();
		//var target =    $('#disc-nav a[href$="#' + currentTrack +'"]').eq(0).append("<div/>").attr("id","spinholder");
		if (spinner)
		{
			spinner.stop();
			spinner = null;
		}
		spinner = new Spinner(opts).spin(document.getElementById('disc-nav'));

		$('#sidebar nav a').removeClass("current");
		// for (key in tracks)
		// {
			// if (tracks[key].hasOwnProperty("selectedclass"))
				// $('#disc-nav a').removeClass(tracks[key].selectedclass);
		// }
		
		// if (tracks[currentTrack].selectedclass)
			// $('#disc-nav a[href$="#' + currentTrack +'"]').addClass(tracks[key].selectedclass);
		// else
		$('#sidebar nav a[href$="#' + currentTrack +'"]').addClass("current");
			
		$("#track-header").text(tracks[currentTrack].navtitle);
		
			
		var nextTrack = '';
		if (tracks[currentTrack].index < orderedTracks.length-1)
			nextTrack = orderedTracks[tracks[currentTrack].index + 1].key;
		var prevTrack = '';
		if (tracks[currentTrack].index > 0)
			prevTrack = orderedTracks[tracks[currentTrack].index - 1].key;

		if (nextTrack)
		{
			$("a.href_next").attr("href", "#" + nextTrack);
			$("a.href_next .quick-nav-title").text(tracks[nextTrack].navtitle);
			$("a.href_next").show("fade",300);
		}
		else
		{
			$("a.href_next").hide();
		}

		if (prevTrack)
		{
			$("a.href_prev").attr("href", "#" + prevTrack);
			$("a.href_prev .quick-nav-title").text(tracks[prevTrack].navtitle);
			$("a.href_prev").show("fade",300);
		}
		else
		{
			$("a.href_prev").hide();
		}
		
		if (tracks[currentTrack].disable_comments)
			$("#comments").empty();
		else
			$("#comments").load("pnyxe.html");
		
		loadCurrentTrack();
		
		
	}
	
  });
  
  
  $.ajax({
  dataType: "json",
  url: "tracks.js",
  success:	function(data) {
				orderedTracks = data;
				setupTracks();
				$("#header").click(function() {
					window.location = "#" + defaultTrackKey;
				});
				$(window).hashchange();	
			},
  async: false
  }).fail(function(err,m) {});

  $("#player_area").hide();
	  

});