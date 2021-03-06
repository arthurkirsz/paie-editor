Session.setDefault('brut', 1445.38);
Session.setDefault('superbrut', 2250);
Session.setDefault('weeklyHours', 40);

Template.body.rendered = function() {
	Session.set('queryString', $(this.find('form')).serialize());

	Meteor.autorun(function() {
		Object.keys(Taxes.fr).forEach(function(openfiscaCode) {
			Session.set(openfiscaCode + '-updating', true);

			Meteor.call('openfisca',
				openfiscaCode,
				Session.get('queryString'),
				function(error, result) {
					if (error)
						console.error(error);

					Session.set(openfiscaCode, result.data.value);
					Session.set(openfiscaCode + '-updating', false);
				}
			);
		});
	});
}

Template.body.events({
	'change': function(event, template) {
		Session.set('queryString', $(template.find('form')).serialize());
	}
});


var HOURS_IN_A_MONTH = 151.67,
	WEEKS_IN_A_MONTH = 4.2,
	INDIE_TAX_RATIO = 0.2;

Template.body.helpers({
	brut: function() {
		return	Session.get('brut');
	},

	superbrut: function() {
		return	Session.get('superbrut');
	},

	superbrutHoraire: function() {
		return	Session.get('superbrut')
				/ HOURS_IN_A_MONTH;
	},

	mensuel: function() {
		return	Session.get('superbrut')
				/ HOURS_IN_A_MONTH
				* Session.get('weeklyHours')
				* WEEKS_IN_A_MONTH
				* (1 - INDIE_TAX_RATIO);
	},

	weeklyHours: function() {
		return	Session.get('weeklyHours');
	},

	todayISO: function() {
		var today = new Date();

		return today.toISOString().split('T')[0];
	}
});
