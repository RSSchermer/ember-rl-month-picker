# Ember-rl-month-picker

Ember month picker component.

[![Build Status](https://travis-ci.org/RSSchermer/ember-rl-month-picker.svg?branch=master)](https://travis-ci.org/RSSchermer/ember-rl-month-picker)

See also:

* [ember-rl-year-picker](https://github.com/RSSchermer/ember-rl-year-picker)
* [ember-rl-week-picker](https://github.com/RSSchermer/ember-rl-week-picker)

## Demo

Demo available [here](http://rsschermer.github.io/ember-rl-month-picker/).

## Installation

```bash
npm install ember-rl-month-picker --save-dev
```

This addon does not automatically import a stylesheet into your application. Run the following command to generate a
stylesheet you can use as a base:

```bash
ember generate rl-picker-css
```

This will create a stylesheet at `app/styles/rl-picker/_rl-picker.css`. You can include this stylesheet into your
application's sass or less files (you may need to update the extension to `.scss` or `.less` respectively).

## Usage

```handlebars
{{rl-month-picker year=yearOfBirth monthNumber=monthOfBirth}}

<!-- You can also use a month string instead of a year and month number -->
{{rl-month-picker month="2015-02"}}
```

Bind the `year` and `monthNumber` (1-12 are valid values) properties to properties on your controller. Ember's two-way
bindings will keep the value updated. If you don't need the year and month number separately, you can also bind a
string to the `month` property, formatted as `year-monthNumber` (e.g. `2015-02` for February 2015).

The following properties can be set to customize the month picker:

* `monthPlaceholderText` (default: 'Month'): the text displayed on the picker toggle button when the `monthNumber` value
  is null.
* `flatMode` (default: false): when set to true, only the picker is shown (see demo).
* `monthLabels` (default: 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'): the labels used for the months, separated
  by commas, or bound to an Ember property containing an array or strings.
* `minMonth` (default: null): the minimum month that can be selected. Takes a string formatted as `year-monthNumber`
  (e.g. `2015-02` for February 2015).
* `maxMonth` (default: null): the maximum month that can be selected. Takes a string formatted as `year-monthNumber`
  (e.g. `2015-02` for February 2015).
* `yearsPerPage` (default: 12): the number of years shown on a page.
* `decreaseButtonText` (default: '<'): the text on the decrease year button. Set for example to
  `"<i class='fa fa-chevron-left'></i>"` to work with Font Awesome.
* `increaseButtonText` (default: '>'): the text on the decrease year button. Set for example to
  `"<i class='fa fa-chevron-right'></i>"` to work with Font Awesome.
* `previousPageButtonText` (default: '<'): the text on the previous page button. Set for example to
  `"<i class='fa fa-chevron-left'></i>"` to work with Font Awesome.
* `nextPageButtonText` (default: '>'): : the text on the next page button. Set for example to
  `"<i class='fa fa-chevron-right'></i>"` to work with Font Awesome.

If you want to set different defaults for all month pickers in your application, extend the component and override the
defaults with your own:

```javascript
// app/components/rl-month-picker.js
import RlMonthPickerComponent from 'ember-rl-month-picker/components/rl-month-picker';

export default RlMonthPickerComponent.extend({
  decreaseButtonText: "<i class='fa fa-chevron-left'></i>",

  increaseButtonText: "<i class='fa fa-chevron-right'></i>",

  previousPageButtonText: "<i class='fa fa-chevron-left'></i>",

  nextPageButtonText: "<i class='fa fa-chevron-right'></i>"
});
```
