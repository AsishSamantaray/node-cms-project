const moment = require("moment");

module.exports = {
  select: (selected, options) => {
    return options
      .fn(this)
      .replace(
        new RegExp(' value="' + selected + '"'),
        '$&selected="selected"'
      );
  },
  generateTime: (date, format) => {
    return moment(date).format(format);
  }
};
