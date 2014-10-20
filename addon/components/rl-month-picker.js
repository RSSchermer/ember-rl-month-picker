import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['rl-month-picker', 'rl-picker'],

  classNameBindings: ['isExpanded:expanded'],

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

  isExpanded: false,

  yearPickerMode: function () {
    return !this.get('year');
  }.property(),

  pickerVisible: function () {
    return this.get('flatMode') || this.get('isExpanded');
  }.property('flatMode', 'isExpanded'),

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

    toggleIsExpanded: function () {
      this.set('isExpanded', !this.get('isExpanded'));
    },

    previousPage: function () {
      this.set('displayedYear', this.get('displayedYear') - 1);
    },

    nextPage: function () {
      this.set('displayedYear', this.get('displayedYear') + 1);
    },

    openYearPicker: function () {
      this.set('yearPickerMode', true);
    },

    pickedYear: function (year) {
      this.setProperties({ 'year': year, 'yearPickerMode': false });
    },

    pickedMonth: function (year, monthNumber) {
      this.setProperties({ 'year': year, 'monthNumber': monthNumber, 'isExpanded': false });
      this.sendAction('pickedMonth', year, monthNumber);
    }
  },

  resetCurrentPage: function () {
    this.set('displayedYear', this.get('year'));
  }.observes('year').on('didInsertElement'),

  clickoutHandler: function (event) {
    var component = event.data.component;
    var $target = Ember.$(event.target);

    // There is an issue when the click triggered a mode change: the event target will be unloaded before this
    // handler fires, which means the closest .picker or .picker-toggle-btn will no longer exist, so we cannot check
    // for this. A mode change should never close the picker though, so we can check if the target still exists in
    // the body and if not, the picker should not be closed. If anyone knows a better workaround, let me know.
    if(component.get('isExpanded') && $target.closest('body').length !== 0 &&
      !($target.closest('.rl-picker .picker').length || $target.closest('.rl-picker .picker-toggle-btn').length)
    ) {
      event.data.component.set('isExpanded', false);
    }
  },

  manageClickoutEvent: function () {
    if (this.get('isExpanded') && !this.get('flatMode')) {
      Ember.$(document).bind('click', {component: this}, this.clickoutHandler);
    } else {
      Ember.$(document).unbind('click', this.clickoutHandler);
    }
  }.observes('isExpanded', 'flatMode').on('didInsertElement'),

  unbindClickoutEvent: function () {
    Ember.$(document).unbind('click', this.clickoutHandler);
  }.on('willDestroyElement')
});
