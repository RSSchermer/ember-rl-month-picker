import { test, moduleForComponent } from 'ember-qunit';
import startApp from '../../helpers/start-app';
import Ember from 'ember';

var App;

moduleForComponent('rl-month-picker', 'RlMonthPickerComponent', {
  needs: ['component:rl-year-picker'],

  setup: function () {
    App = startApp();
  },

  teardown: function () {
    Ember.run(App, 'destroy');
  }
});

test('does not show a picker when not in flatMode and not expanded', function (assert) {
  assert.equal(this.$().find('.picker').length, 0);
});

test('does show a picker when not in flatMode and expanded', function (assert) {
  this.$().find('.picker-toggle-btn').click();

  assert.equal(this.$().find('.picker').length, 1);
});

test('does show a picker when in flatMode', function (assert) {
  var component = this.subject();

  Ember.run(function () {
    component.set('flatMode', true);
  });

  assert.equal(this.$().find('.picker').length, 1);
});

test('closes the picker when the toggle button is clicked', function (assert) {
  var component = this.subject();

  Ember.run(function () {
    component.set('dropdownExpanded', true);
  });

  assert.equal(this.$().find('.picker').length, 1);

  this.$().find('.picker-toggle-btn').click();

  assert.equal(this.$().find('.picker').length, 0);
});

test('closes the picker when clicking outside', function (assert) {
  var component = this.subject();
  var $component = this.$();

  Ember.run(function () {
    component.set('dropdownExpanded', true);
  });

  assert.equal($component.find('.picker').length, 1);

  $component.parent().append('<div id="clickout-test-element"></div>');

  Ember.run.later(function () {
    $component.parent().find('#clickout-test-element').click();

    Ember.run.later(function () {
      assert.equal($component.find('.picker').length, 0);
    }, 2);
  }, 2);
});

test('decrease month button decreases the monthNumber by 1', function (assert) {
  var component = this.subject();

  Ember.run(function () {
    component.setProperties({ 'year': 2000, 'monthNumber': 5 });
  });

  this.$().find('.decrease-btn').click();

  assert.equal(component.get('year'), 2000);
  assert.equal(component.get('monthNumber'), 4);
});

test('when the monthNumber is one, decreases year by one and sets monthNumber to 12', function (assert) {
  var component = this.subject();

  Ember.run(function () {
    component.setProperties({ 'year': 2000, 'monthNumber': 1 });
  });

  this.$().find('.decrease-btn').click();

  assert.equal(component.get('year'), 1999);
  assert.equal(component.get('monthNumber'), 12);
});

test('increase month button increases the monthNumber by 1', function (assert) {
  var component = this.subject();

  Ember.run(function () {
    component.setProperties({ 'year': 2000, 'monthNumber': 5 });
  });

  this.$().find('.increase-btn').click();

  assert.equal(component.get('year'), 2000);
  assert.equal(component.get('monthNumber'), 6);
});

test('when the monthNumber is 12, increases year by one and sets monthNumber to 1', function (assert) {
  var component = this.subject();

  Ember.run(function () {
    component.setProperties({ 'year': 2000, 'monthNumber': 12 });
  });

  this.$().find('.increase-btn').click();

  assert.equal(component.get('year'), 2001);
  assert.equal(component.get('monthNumber'), 1);
});

test('the current month is shown as the active month', function (assert) {
  var component = this.subject();

  Ember.run(function () {
    component.setProperties({ 'year': 2000, 'monthNumber': 1, 'flatMode': true });
  });

  assert.equal(this.$().find('li.active').text().trim(), 'Jan');
});

test('the current month is not shown as the active month when the displayed year does not match the year', function (assert) {
  var component = this.subject();

  Ember.run(function () {
    component.setProperties({ 'year': 2000, 'monthNumber': 1, 'flatMode': true });
  });

  this.$().find('.previous-page-btn').click();

  assert.equal(this.$().find('li.active').length, 0);
});

test('decreases the displayed year when clicking the previous page button', function (assert) {
  var component = this.subject();

  Ember.run(function () {
    component.setProperties({ 'year': 2000, 'flatMode': true });
  });

  assert.equal(this.$().find('.year-picker-toggle-btn').text().trim(), '2000');

  this.$().find('.previous-page-btn').click();

  assert.equal(this.$().find('.year-picker-toggle-btn').text().trim(), '1999');
});

test('increases the displayed year when clicking the next page button', function (assert) {
  var component = this.subject();

  Ember.run(function(){
    component.setProperties({ 'year': 2000, 'flatMode': true });
  });

  assert.equal(this.$().find('.year-picker-toggle-btn').text().trim(), '2000');

  this.$().find('.next-page-btn').click();

  assert.equal(this.$().find('.year-picker-toggle-btn').text().trim(), '2001');
});

test('uses the displayed year as the new year when selecting a month on that page', function (assert) {
  var component = this.subject();

  Ember.run(function(){
    component.setProperties({ 'year': 2000, 'flatMode': true });
  });

  this.$().find('.next-page-btn').click();
  this.$().find('.picker li:first-of-type').click();

  assert.equal(component.get('monthNumber'), 1);
  assert.equal(component.get('year'), '2001');
});

test('a month is can not be selected when it is smaller than the minMonth specified', function (assert) {
  var component = this.subject();

  Ember.run(function(){
    component.setProperties({ 'year': 2000, 'monthNumber': 4, 'flatMode': true, 'minMonth': "2000-4" });
  });

  this.$().find('li:contains("Mar")').click();

  assert.equal(component.get('year'), 2000);
  assert.equal(component.get('monthNumber'), 4);
});

test('the decrease month button is disabled when the current month <= the minMonth specified', function (assert) {
  var component = this.subject();

  Ember.run(function(){
    component.setProperties({ 'year': 1998, 'monthNumber': 2, 'minMonth': "1998-2" });
  });

  this.$().find('.decrease-btn').click();

  assert.equal(component.get('year'), 1998);
  assert.equal(component.get('monthNumber'), 2);
});

test('the previous page button is disabled when the last month on the previous page < the minMonth specified', function (assert) {
  var component = this.subject();

  Ember.run(function(){
    component.setProperties({ 'year': 2000, 'flatMode': true, 'minMonth': '2000-1' });
  });

  this.$().find('.previous-page-btn').click();

  assert.equal(this.$().find('.year-picker-toggle-btn').text().trim(), '2000');
});

test('a month is can not be selected when it is greater than the maxMonth specified', function (assert) {
  var component = this.subject();

  Ember.run(function(){
    component.setProperties({ 'year': 2000, 'monthNumber': 4, 'flatMode': true, 'maxMonth': "2000-4" });
  });

  this.$().find('li:contains("May")').click();

  assert.equal(component.get('year'), 2000);
  assert.equal(component.get('monthNumber'), 4);
});

test('the increase month button is disabled when the current month >= the maxMonth specified', function (assert) {
  var component = this.subject();

  Ember.run(function(){
    component.setProperties({ 'year': 1998, 'monthNumber': 2, 'maxMonth': "1998-2" });
  });

  this.$().find('.increase-btn').click();

  assert.equal(component.get('year'), 1998);
  assert.equal(component.get('monthNumber'), 2);
});

test('the next page button is disabled when the first month on the next page > the maxMonth specified', function (assert) {
  var component = this.subject();

  Ember.run(function(){
    component.setProperties({ 'year': 2000, 'flatMode': true, 'maxMonth': '2000-12' });
  });

  this.$().find('.next-page-btn').click();

  assert.equal(this.$().find('.year-picker-toggle-btn').text().trim(), '2000');
});
