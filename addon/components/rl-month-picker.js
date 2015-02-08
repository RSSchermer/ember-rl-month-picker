import Ember from 'ember';
import DropdownComponentMixin from 'ember-rl-dropdown/mixins/rl-dropdown-component';

export default Ember.Component.extend(DropdownComponentMixin, {
  classNames: ['rl-month-picker', 'rl-picker'],

  classNameBindings: ['dropdownExpanded:expanded'],

  year: null,

  monthNumber: null,

  minMonthNumber: null,

  minYearNumber: null,

  maxMonthNumber: null,

  maxYearNumber: null,

  monthPlaceholderText: 'Month',

  monthLabels: 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec',

  flatMode: false,

  decreaseButtonText: '<',

  increaseButtonText: '>',

  previousPageButtonText: '<',

  nextPageButtonText: '>',

  displayedYear: new Date().getFullYear(),

  clickOutEventNamespace: 'rl-month-picker',

  month: function(key, value) {
    // setter
    if (arguments.length > 1) {
      var nameParts = value.split("-");
      this.set('year', parseInt(nameParts[0]));
      this.set('monthNumber',  parseInt(nameParts[1]));
    }

    // getter
    return this.buildMonthString(this.get('year'), this.get('monthNumber'));
  }.property('year', 'monthNumber'),

  minMonth: function(key, value) {
    // setter
    if (arguments.length > 1) {
      var nameParts = value.split("-");
      this.set('minYear', parseInt(nameParts[0]));
      this.set('minMonthNumber',  parseInt(nameParts[1]));
    }

    // getter
    return this.buildMonthString(this.get('minYear'), this.get('minMonthNumber'));
  }.property('minYear', 'minMonthNumber'),

  maxMonth: function(key, value) {
    // setter
    if (arguments.length > 1) {
      var nameParts = value.split("-");
      this.set('maxYear', parseInt(nameParts[0]));
      this.set('maxMonthNumber',  parseInt(nameParts[1]));
    }

    // getter
    return this.buildMonthString(this.get('maxYear'), this.get('maxMonthNumber'));
  }.property('maxYear', 'maxMonthNumber'),

  yearPickerMode: function () {
    return !this.get('year');
  }.property(),

  pickerVisible: function () {
    return this.get('flatMode') || this.get('dropdownExpanded');
  }.property('flatMode', 'dropdownExpanded'),

  monthLabelsArray: function () {
    var monthLabels = this.get('monthLabels');

    return typeof monthLabels === 'string' ? monthLabels.split(',') : monthLabels;
  }.property('monthLabels'),

  decreaseMonthButtonDisabled: function () {
    var minMonth = this.get('minMonth');
    var date = new Date();
    var month = this.get('month') || date.getFullYear() +'-'+ (date.getMonth() + 1);

    return minMonth !== null && month <= minMonth;
  }.property('month', 'minMonth'),

  increaseMonthButtonDisabled: function () {
    var maxMonth = this.get('maxMonth');
    var date = new Date();
    var month = this.get('month') || date.getFullYear() +'-'+ (date.getMonth() + 1);

    return maxMonth !== null && month >= maxMonth;
  }.property('month', 'maxMonth'),

  months: function () {
    var self = this;
    var months = [];
    var monthLabels = this.get('monthLabelsArray');
    var displayedYear = this.get('displayedYear');
    var minMonth = this.get('minMonth');
    var maxMonth = this.get('maxMonth');

    monthLabels.forEach(function (label, index) {
      var month = self.buildMonthString(displayedYear, index + 1);

      months.push({
        label: label,

        monthNumber: index + 1,

        isActive: index + 1 === self.get('monthNumber') && displayedYear === self.get('year'),

        outOfRange: (minMonth !== null && month < minMonth) || (maxMonth !== null && month > maxMonth)
      });
    });

    return months;
  }.property('monthLabelsArray', 'monthNumber', 'year', 'displayedYear', 'minMonth', 'maxMonth'),

  previousPageButtonDisabled: function () {
    var minMonth = this.get('minMonth');

    return minMonth !== null && ((this.get('displayedYear') - 1).toString() +'-12') < minMonth;
  }.property('displayedYear', 'minMonth'),

  nextPageButtonDisabled: function () {
    var maxMonth = this.get('maxMonth');

    return maxMonth !== null && ((this.get('displayedYear') + 1).toString() +'-01') > maxMonth;
  }.property('displayedYear', 'maxMonth'),

  monthText: function () {
    var monthNumber = this.get('monthNumber');
    var year = this.get('year');

    if (monthNumber && year) {
      return this.get('monthLabelsArray')[monthNumber - 1] +' '+ year;
    } else {
      return null;
    }
  }.property('monthNumber', 'year', 'monthLabelsArray'),

  actions: {
    decreaseMonth: function () {
      if (!this.get('decreaseMonthButtonDisabled')) {
        var date = new Date();
        var monthIndex = this.get('monthNumber') ? (this.get('monthNumber') - 1) % 12 : date.getMonth();
        var year = this.get('year') || date.getFullYear();

        if (monthIndex === 0) {
          this.setProperties({ 'monthNumber': 12, 'year': year - 1 });
        } else {
          this.setProperties({ 'monthNumber': monthIndex, 'year': year });
        }

        this.sendAction('pickedMonth', this.get('year'), this.get('monthNumber'));
      }
    },

    increaseMonth: function () {
      if (!this.get('increaseMonthButtonDisabled')) {
        var date = new Date();
        var monthIndex = this.get('monthNumber') ? (this.get('monthNumber') - 1) % 12 : date.getMonth();
        var year = this.get('year') || date.getFullYear();

        if (monthIndex === 11) {
          this.setProperties({ 'monthNumber': 1, 'year': year + 1 });
        } else {
          this.setProperties({ 'monthNumber': monthIndex + 2, 'year': year });
        }

        this.sendAction('pickedMonth', this.get('year'), this.get('monthNumber'));
      }
    },

    previousPage: function () {
      if (!this.get('previousPageButtonDisabled')) {
        this.decrementProperty('displayedYear');
      }
    },

    nextPage: function () {
      if (!this.get('nextPageButtonDisabled')) {
        this.incrementProperty('displayedYear');
      }
    },

    openYearPicker: function () {
      this.set('yearPickerMode', true);
    },

    pickedYear: function (year) {
      this.setProperties({ 'year': year, 'yearPickerMode': false });
    },

    pickedMonth: function (year, monthNumber) {
      var minMonth = this.get('minMonth');
      var maxMonth = this.get('maxMonth');
      var month = this.buildMonthString(year, monthNumber);

      if (!((minMonth !== null && month < minMonth) || (maxMonth !== null && month > maxMonth))) {
        this.setProperties({ 'year': year, 'monthNumber': monthNumber, 'dropdownExpanded': false });
        console.log(this.get('month'));
        this.sendAction('pickedMonth', year, monthNumber);
      }
    }
  },

  resetCurrentPage: function () {
    this.set('displayedYear', this.get('year'));
  }.observes('year').on('didInsertElement'),

  buildMonthString: function (year, monthNumber) {
    if (year === null || monthNumber === null) {
      return null;
    } else {
      return year +'-'+ (monthNumber < 10 ? ('0'+ monthNumber.toString()) : monthNumber);
    }
  }
});
