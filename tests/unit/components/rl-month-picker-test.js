import { test, moduleForComponent } from 'ember-qunit';
import startApp from '../../helpers/start-app';
import Ember from 'ember';

var App;

moduleForComponent('rl-month-picker', 'RlMonthPickerComponent', {
  needs: ['component:rl-year-picker'],

  setup: function() {
    App = startApp();
  },

  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('does not show a picker when not in flatMode and not expanded', function () {
  var $component = this.append();

  equal($component.find('.picker').length, 0);
});

test('does show a picker when not in flatMode and expanded', function () {
  var $component = this.append();

  click('.picker-toggle-btn');

  andThen(function () {
    equal($component.find('.picker').length, 1);
  });
});

test('does show a picker when in flatMode', function () {
  var component = this.subject();
  var $component = this.append();

  Ember.run(function(){
    component.set('flatMode', true);
  });

  equal($component.find('.picker').length, 1);
});

test('closes the picker when the toggle button is clicked', function () {
  var component = this.subject();
  var $component = this.append();

  Ember.run(function(){
    component.set('isExpanded', true);
  });

  equal($component.find('.picker').length, 1);

  click('.picker-toggle-btn');

  andThen(function () {
    equal($component.find('.picker').length, 0);
  });
});

test('closes the picker when clicking outside', function () {
  var component = this.subject();
  var $component = this.append();

  Ember.run(function(){
    component.set('isExpanded', true);
  });

  equal($component.find('.picker').length, 1);

  Ember.$($component).parent().append('<div id="clickout-test-element"></div>');

  click('#clickout-test-element');

  andThen(function () {
    equal($component.find('.picker').length, 0);
  });
});

test('decrease month button decreases the monthNumber by 1', function () {
  var component = this.subject();
  var $component = this.append();

  Ember.run(function(){
    component.setProperties({ 'year': 2000, 'monthNumber': 5 });
  });

  click('.decrease-btn');

  andThen(function () {
    equal(component.get('year'), 2000);
    equal(component.get('monthNumber'), 4);
  });
});

test('when the monthNumber is one, decreases year by one and sets monthNumber to 12', function () {
  var component = this.subject();
  var $component = this.append();

  Ember.run(function(){
    component.setProperties({ 'year': 2000, 'monthNumber': 1 });
  });

  click('.decrease-btn');

  andThen(function () {
    equal(component.get('year'), 1999);
    equal(component.get('monthNumber'), 12);
  });
});

test('increase month button increases the monthNumber by 1', function () {
  var component = this.subject();
  var $component = this.append();

  Ember.run(function(){
    component.setProperties({ 'year': 2000, 'monthNumber': 5 });
  });

  click('.increase-btn');

  andThen(function () {
    equal(component.get('year'), 2000);
    equal(component.get('monthNumber'), 6);
  });
});

test('when the monthNumber is 12, increases year by one and sets monthNumber to 1', function () {
  var component = this.subject();
  var $component = this.append();

  Ember.run(function(){
    component.setProperties({ 'year': 2000, 'monthNumber': 12 });
  });

  click('.increase-btn');

  andThen(function () {
    equal(component.get('year'), 2001);
    equal(component.get('monthNumber'), 1);
  });
});

test('the current month is shown as the active month', function () {
  var component = this.subject();
  var $component = this.append();

  Ember.run(function(){
    component.setProperties({ 'year': 2000, 'monthNumber': 1, 'flatMode': true });
  });

  andThen(function () {
    equal($component.find('li.active').text().trim(), 'Jan');
  });
});

test('the current month is not shown as the active month when the displayed year does not match the year', function () {
  var component = this.subject();
  var $component = this.append();

  Ember.run(function(){
    component.setProperties({ 'year': 2000, 'monthNumber': 1, 'flatMode': true });
  });

  click('.previous-page-btn');

  andThen(function () {
    equal($component.find('li.active').length, 0);
  });
});

test('decreases the displayed year when clicking the previous page button', function () {
  var component = this.subject();
  var $component = this.append();

  Ember.run(function(){
    component.setProperties({ 'year': 2000, 'flatMode': true });
  });

  andThen(function () {
    equal($component.find('.year-picker-toggle-btn').text().trim(), '2000');
  });

  click('.previous-page-btn');

  andThen(function () {
    equal($component.find('.year-picker-toggle-btn').text().trim(), '1999');
  });
});

test('increases the displayed year when clicking the next page button', function () {
  var component = this.subject();
  var $component = this.append();

  Ember.run(function(){
    component.setProperties({ 'year': 2000, 'flatMode': true });
  });

  andThen(function () {
    equal($component.find('.year-picker-toggle-btn').text().trim(), '2000');
  });

  click('.next-page-btn');

  andThen(function () {
    equal($component.find('.year-picker-toggle-btn').text().trim(), '2001');
  });
});

test('uses the displayed year as the new year when selecting a month on that page', function () {
  var component = this.subject();
  var $component = this.append();

  Ember.run(function(){
    component.setProperties({ 'year': 2000, 'flatMode': true });
  });

  click('.next-page-btn');
  click('.picker li:first-of-type');

  andThen(function () {
    equal(component.get('monthNumber'), 1);
    equal(component.get('year'), '2001');
  });
});
