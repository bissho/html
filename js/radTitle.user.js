// ==UserScript==
// @name       radTitle
// @namespace   http://www.meneame.net/
// @version     1.0.0.0
// @description  poner titulo canción en página
// @include     https://www.radionomy.com/*
// @copyright   Ricardo Manzano Arribas. Licencia     GPL
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_log
// @grant       GM_xmlhttpRequest
// @grant       none
// ==/UserScript==


$(function () {

//document.title = $('#player .rad-tracks li').text();
//console.log("Hola");

//var oldUpdatePlayer = unsafeWindow.UpdatePlayer;
//unsafeWindow.UpdatePlayer = function() {
//  oldUpdatePlayer();
//  //unsafeWindow.document.title = currentStream.song;
//  unsafeWindow.document.title = $('#player .rad-tracks li').text();
//  console.log('UpdatePlayer'+$('#player .rad-tracks li').text());
//};
//var oldGetCurrentSong = unsafeWindow.GetCurrentSong;
//unsafeWindow.GetCurrentSong = function() {
//  oldGetCurrentSong();
//  unsafeWindow.document.title = $('#player .rad-tracks li').text();
//  console.log('GetCurrentSong'+$('#player .rad-tracks li').text());
//};
unsafeWindow.GetCurrentSong=function() {
    if (currentSongTimeout) clearTimeout(currentSongTimeout);
    if (!currentStream || !currentStream.radioUID) return;

    $.post('/' + language + '/OnAir/GetCurrentSong',
    { radioUID: currentStream.radioUID, f: 's' },
    function (result) {
        if (result) {
            var currentSongData = JSON.parse(result);
            var radioTile = $('#tile-' + currentStream.radioUID);
            var artist = currentSongData.Artist;
            var title = currentSongData.Title;

            if (artist != null && artist.length > 0) {
                radioTile.find('.nowPlaying').show();

                var ad = artist.match(/targetspot/i) || title.match(/targetspot/i);
                radioTile.find('.artist').text(ad ? adText : artist);
                radioTile.find('.title').text(ad ? '' : title);

                if (ad) {
                    radioTile.find('.separator').hide();
                }
                else {
                    radioTile.find('.separator').show();
                }

                currentStream.song = ad ? adText : (artist + ' - ' + title);

                $('.rad-tracks li').text(currentStream.song);
document.title = $('#player .rad-tracks li').text();
//console.log('GetCurrentSong'+$('#player .rad-tracks li').text());                
            }

            currentSongTimeout = setTimeout(GetCurrentSong, currentSongData.Callback);
        }
    });
}

});
