var Promise = require('bluebird')

require('./ga-loader')

// var ga = window.ga

var TRACKER_NAME = 'resinAnalytics'

module.exports = function (propertyId, site, debug) {
	return {
		login: function (userId) {
			var options = {
				userId: userId
			}
			if (debug) {
				options.cookieDomain = 'none'
			}
			window.ga('create', propertyId, site, TRACKER_NAME, options)
		},
		logout: function () {
			return Promise.fromCallback(function (callback) {
				window.ga(function() {
					window.ga.remove(TRACKER_NAME)
					callback()
				})
			})
		},
		track: function (category, action, label) {
			return Promise.fromCallback(function (callback) {
				var options = {
					hitCallback: function() {
						console.log('DONE HIT')
						callback()
					}
				}
				if (debug) {
					options.transport = 'xhr'
				}
				window.ga(
					TRACKER_NAME + '.send', 'event',
					category, action, label,
					options
				)
			})
		}
	}
}
