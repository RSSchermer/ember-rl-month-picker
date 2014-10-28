import Ember from 'ember';
import DropdownComponentMixin from 'ember-rl-dropdown/mixins/rl-dropdown-component';

export default Ember.Component.extend(DropdownComponentMixin, {
  classNames: ['rl-month-picker', 'rl-picker'],

  classNameBindings: ['dropdownExpanded:expanded'],

  year: null,

  monthNumber: null,

  monthPlaceholderText: 'Month',

  yearPlaceholderText: 'Year',

  monthLabels: 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec',

  flatMode: false,

  decreaseButtonText: '<',

  increaseButtonText: '>',

  previousPageButtonText: '<',

  nextPageButtonText: '>',

  displayedYear: new Date().getFullYear(),

  clickOutEventNamespace: 'rl-month-picker',

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

  months: function () {
    var self = this;
    var months = [];
    var monthLabels = this.get('monthLabelsArray');

    monthLabels.forEach(function (label, index) {
      months.push({
        label: label,

        monthNumber: index + 1,

        isActive: index + 1 === self.get('monthNumber') && self.get('displayedYear') === self.get('year')
      });
    });

    return months;
  }.property('monthLabelsArray', 'monthNumber', 'year', 'displayedYear'),

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
      var date = new Date();
      var monthIndex = this.get('monthNumber') ? (this.get('monthNumber') - 1) % 12 : date.getMonth();
      var year = this.get('year') || date.getFullYear();

      if (monthIndex === 0) {
        this.setProperties({ 'monthNumber': 12, 'year': year - 1 });
      } else {
        this.setProperties({ 'monthNumber': monthIndex, 'year': year });
      }

      this.sendAction('pickedMonth', this.get('year'), this.get('monthNumber'));
    },

    increaseMonth: function () {
      var date = new Date();
      var monthIndex = this.get('monthNumber') ? (this.get('monthNumber') - 1) % 12 : date.getMonth();
      var year = this.get('year') || date.getFullYear();

      if (monthIndex === 11) {
        this.setProperties({ 'monthNumber': 1, 'year': year + 1 });
      } else {
        this.setProperties({ 'monthNumber': monthIndex + 2, 'year': year });
      }

      this.sendAction('pickedMonth', this.get('year'), this.get('monthNumber'));
    },

    previousPage: function () {
      this.decrementProperty('displayedYear');
    },

    nextPage: function () {
      this.incrementProperty('displayedYear');
    },

    openYearPicker: function () {
      this.set('yearPickerMode', true);
    },

    pickedYear: function (year) {
      this.setProperties({ 'year': year, 'yearPickerMode': false });
    },

    pickedMonth: function (year, monthNumber) {
      this.setProperties({ 'year': year, 'monthNumber': monthNumber, 'dropdownExpanded': false });
      this.sendAction('pickedMonth', year, monthNumber);
    }
  },

  resetCurrentPage: function () {
    this.set('displayedYear', this.get('year'));
  }.observes('year').on('didInsertElement')
});
