# Ember-rl-month-picker Changelog

## 0.2.0

Upgrades templates syntax to the new HTML-bars syntax, which means as of this version Ember 1.12 or higher is required.

## 0.1.0

Added `minMonth` and `maxMonth` options for constraining the months that can be selected by the user.
Some css changes may be required if you want to use this functionality. Months that are not within the
valid range get an `out-of-range` class added. You may want to rerun the css generator:

```bash
ember generate rl-picker-css
```

You are now also allowed to bind a month string (`year-monthNumber`, e.g. "2015-02") to the `month` property,
instead of binding to `year` and `monthNumber` separately.
