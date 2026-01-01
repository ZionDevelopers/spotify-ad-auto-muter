/*
Spotify Ad Auto-Muter is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
----------------------------------------------------------------------------------------------------------------------------
Copyright (c) 2022 - 2026 Júlio C. Oliveira <http://www.juliocesar.me>

This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
To view a copy of this license, visit <http://creativecommons.org/licenses/by-nc-sa/4.0/deed.en_US> .
----------------------------------------------------------------------------------------------------------------------------

$Id$
Version 0.1.9 - 2024-01-05
*/

// Define global variables
var seconds = 0.10 * 1000;
var closeId = 0;
var autoCloserId = 0;
var enabled = true;
var hotkey = 'F2';

/*
var ads = {
	payUpReminderLoggedIn: 'div.Modal div.Modal-cta.Modal-dismiss button',
	payUpReminderNotLoggedIn: 'div[data-testid="signup-bar"] button:nth-child(odd)'
};
*/

var mute = true;
var muted = false;
var audioAdDetector = 'div#main aside a[data-context-item-type="ad"]';

/**
 * Start interval
 * @constructor 
 */
function run() {
	console.log('Spotify Ad Auto-Muter is loading...');
	// Run autoCloser function every X milliseconds
    autoCloserId = setInterval(autoCloser, 100);
}

/**
 * Trigger hotkey
 * @constructor 
 */
function triggerHotkey () {
	// Revert enabled state
	enabled = !enabled;
	// Add html alert
	$('body').append('<div style="display: none; background-color:' + (enabled ? 'green':'red') + ';color: #fff;font-family: Arial; font-size: 12px; margin: 0 auto; z-index: 9999;position: absolute" id="spotify-ad-auto-muter-alert">Spotify Ad Auto-Muter: <b>'+(enabled ? 'Enabled!' : 'Disabled!')+'</b></div>');
	// Fade in the html alert
	$('div#spotify-ad-auto-muter-alert').fadeIn();
	// Trigger timout for the removal of the html alert
	setTimeout(function () {
		// Fade Out the html alert
		$('div#spotify-ad-auto-muter-alert').fadeOut(function () {
			// Remove the html alert
			$(this).remove();
		});
	},
	2000);
	// Set preferences
	chrome.storage.sync.set({enabled: enabled}, function() {});	
}

/**
 * Close an ad
 * @constructor
 * @param {string} selector - CSS Selector
 * @param {object} options - List of saved options
 *
 *
function closeAd(selector, options) {
	// This Ad is present?
	if ($(selector).is(':visible')) {
		// Convert seconds to milliseconds
		seconds = options.autoCloseAfter * 1000;
		
		// Clear Interval
		clearInterval(autoCloserId);
		
		// Click an Ad after X seconds
		setTimeout(function () {
			// Get Preferences
			chrome.storage.sync.get({enabled: true}, function (options) {			
				// Pass the enable variable
				enabled = options.enabled;
				// Check again if plugin is enabled
				if (enabled) {
					// Close Ad
					$(selector).click();					
				}
			});
			
			// Restart timer
			run();
		}, seconds);
	}		
}
*/

/**
 * Auto Closer function the extension Init function
 * @constructor
 */
var autoCloser = function () {
	// Get Preferences
	chrome.storage.sync.get({enabled: true, autoCloseAfter: 0.10, mute: true}, function (options) {
		// Pass the enable variable to global var
		enabled = options.enabled;
		// Pass the mute variable to global
		mute = options.mute;
		
		// The plugin is enabled?
		if (enabled) {			
			/* Do a check for each Ad
			$.each(ads, function (name, selector) {
				// Close this Ad
				closeAd(selector, options);			
			});
			*/
			
			// Mute option enabled?
			if (mute) {				
												
				// Check if audio ad is present and audio is not muted
				if ($(audioAdDetector).is(':visible') && !muted) {	
					// Click on mute button
					$('div[data-testid="volume-bar"] button').click();

					// Set state to muted
					muted = true;			
							
				// Check if audio ad is not present but the ad is muted
				} else if (!$(audioAdDetector).is(':visible') && muted) {									
					// Click on mute button
					$('div[data-testid="volume-bar"] button').click();						
					
					// Set state to be unmuted
					muted = false;
				}				
			}
		}
	});
}

// Run on ready
$(document).ready(function () { 
	// Get preferences
	chrome.storage.sync.get({enabled: true, hotkey: 'F2', mute: true}, function (options) {
		// Pass the enable variable to global var
		enabled = options.enabled;
		// Pass the hotkey variable to global var
		hotkey = options.hotkey		
		
		// Trigger hotkey
		$(document).on('keydown', null, hotkey, triggerHotkey);
		
		// Run Extension
		run();
	});	
});
