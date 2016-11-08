'use strict';

module.exports = function(list, filterName) {
  switch (filterName) {
    case 'filter-popular':
      list.sort(function(a, b) {
        return b.likes - a.likes;
      });
      break;
    case 'filter-new':
      list.sort(function(a, b) {
        return b.created - a.created;
      });
      break;
    case 'filter-discussed':
      list.sort(function(a, b) {
        return b.comments - a.comments;
      });
      break;
  }
  return list;
};
