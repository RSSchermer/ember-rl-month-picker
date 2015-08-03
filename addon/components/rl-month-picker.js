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

  month: Ember.computed('year', 'monthNumber', {
    get: function () {
      return this.buildMonthString(this.get('year'), this.get('monthNumber'));
    },

    set: function(key, monthString) {
      if (monthString !== null) {
        var parts = monthString.split("-");
        var year = parseInt(parts[0]);
        var monthNumber = parseInt(parts[1]);

        this.setProperties({ 'year': year, 'monthNumber': monthNumber });

        return this.buildMonthString(year, monthNumber);
      }

      return null;
    }
  }),

  minMonth: Ember.computed('minYear', 'minMonthNumber', {
    get: function () {
      return this.buildMonthString(this.get('minYear'), this.get('minMonthNumber'));
    },

    set: function(key, monthString) {
      if (monthString !== null) {
        var parts = monthString.split("-");
        var year = parseInt(parts[0]);
        var monthNumber = parseInt(parts[1]);

        this.setProperties({ 'minYear': year, 'minMonthNumber': monthNumber });

        return this.buildMonthString(year, monthNumber);
      }

      return null;
    }
  }),

  maxMonth: Ember.computed('maxYear', 'maxMonthNumber', {
    get: function () {
      return this.buildMonthString(this.get('maxYear'), this.get('maxMonthNumber'));
    },

    set: function(key, monthString)  {
      if (monthString !== null) {
        var parts = monthString.split("-");
        var year = parseInt(parts[0]);
        var monthNumber = parseInt(parts[1]);

        this.setProperties({ 'maxYear': year, 'maxMonthNumber': monthNumber });

        return this.buildMonthString(year, monthNumber);
      }

      return null;
    }
  }),

  yearPickerMode: Ember.computed(function () {
    return !this.get('year');
  }),

  pickerVisible: Ember.computed('flatMode', 'dropdownExpanded', function () {
    return this.get('flatMode') || this.get('dropdownExpanded');
  }),

  monthLabelsArray: Ember.computed('monthLabels', function () {
    var monthLabels = this.get('monthLabels');

    return typeof monthLabels === 'string' ? Ember.A(monthLabels.split(',')) : Ember.A(monthLabels);
  }),

  decreaseMonthButtonDisabled: Ember.computed('month', 'minMonth', function () {
    var minMonth = this.get('minMonth');
    var date = new Date();
    var month = this.get('month') || date.getFullYear() +'-'+ (date.getMonth() + 1);

    return minMonth !== null && month <= minMonth;
  }),

  increaseMonthButtonDisabled: Ember.computed('month', 'maxMonth', function () {
    var maxMonth = this.get('maxMonth');
    var date = new Date();
    var month = this.get('month') || date.getFullYear() +'-'+ (date.getMonth() + 1);

    return maxMonth !== null && month >= maxMonth;
  }),

  months: Ember.computed('monthLabelsArray', 'monthNumber', 'year', 'displayedYear', 'minMonth', 'maxMonth', function () {
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

    return Ember.A(months);
  }),

  previousPageButtonDisabled: Ember.computed('displayedYear', 'minMonth', function () {
    var minMonth = this.get('minMonth');

    return minMonth !== null && ((this.get('displayedYear') - 1).toString() +'-12') < minMonth;
  }),

  nextPageButtonDisabled: Ember.computed('displayedYear', 'maxMonth', function () {
    var maxMonth = this.get('maxMonth');

    return maxMonth !== null && ((this.get('displayedYear') + 1).toString() +'-01') > maxMonth;
  }),

  monthText: Ember.computed('monthNumber', 'year', 'monthLabelsArray', function () {
    var monthNumber = this.get('monthNumber');
    var year = this.get('year');

    if (monthNumber && year) {
      return this.get('monthLabelsArray')[monthNumber - 1] +' '+ year;
    } else {
      return null;
    }
  }),

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
        this.sendAction('pickedMonth', year, monthNumber);
      }
    }
  },

  resetCurrentPage: Ember.on('didInsertElement', Ember.observer('year', function () {
    this.set('displayedYear', this.get('year'));
  })),

  buildMonthString: function (year, monthNumber) {
    if (year === null || monthNumber === null) {
      return null;
    } else {
      return year +'-'+ (monthNumber < 10 ? ('0'+ monthNumber.toString()) : monthNumber);
    }
  }
});
