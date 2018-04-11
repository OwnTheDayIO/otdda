
// Meta defaults
Meta.config({
  options: {
	suffix: 'or Get Paid for it!'
  }
});

/**
 * @summary A suffix method to allow for suffix updates (Title | [Suffix])
 * @method setSuffix
*/
Meta.setSuffix = function(suffix){
  Meta.setTitle(TAPi18n.__('page.title') + ' | ' + suffix);
};
