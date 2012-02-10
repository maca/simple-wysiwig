(function() {
  var __hasProp = Object.prototype.hasOwnProperty;
  (function($) {
    var button_defaults, change_format, create_editable_area, create_toolbar, current_node, current_tag, exec_command, format_state, insert, parse, query_command_state, set_caret;
    if (!window.markdown) {
      throw 'mkEditor depends on markdown.js (https://github.com/evilstreak/markdown-js)';
    }
    query_command_state = function(command) {
      return document.queryCommandState(command);
    };
    exec_command = function(command) {
      return document.execCommand(command, false, null);
    };
    format_state = function() {
      return document.queryCommandValue("FormatBlock").toLowerCase();
    };
    change_format = function(format) {
      return document.execCommand("FormatBlock", null, "<" + format + ">");
    };
    insert = function(text) {
      return document.execCommand('insertHtml', false, text);
    };
    set_caret = function(element) {
      var range, selection;
      element = $(element)[0];
      if (document.createRange) {
        range = document.createRange();
        range.selectNodeContents(element);
        range.collapse(false);
        selection = window.getSelection();
        selection.removeAllRanges();
        return selection.addRange(range);
      } else if (document.selection) {
        range = document.body.createTextRange();
        range.moveToElementText(element);
        range.collapse(false);
        return range.select();
      }
    };
    current_node = function() {
      var range;
      if (window.getSelection) {
        return $(window.getSelection().anchorNode.parentNode);
      } else if (document.selection) {
        range = document.selection.createRange();
        range.collapse(true);
        return range.parentElement();
      }
    };
    current_tag = function() {
      return current_node()[0].tagName.toLowerCase();
    };
    button_defaults = {
      bold: {
        text: '<b>B</b>',
        hint: 'Bold',
        action: function() {
          console.log('this');
          return exec_command('bold');
        }
      },
      italic: {
        text: '<i>I</i>',
        hint: 'Italicize',
        action: function() {
          return exec_command('italic');
        }
      },
      ul: {
        text: '• –',
        hint: 'Unordered List',
        action: function() {
          return exec_command('insertUnorderedList');
        }
      },
      ol: {
        text: '1. –',
        hint: 'Ordered List',
        action: function() {
          return exec_command('insertOrderedList');
        }
      },
      link: {
        text: '\uD83D\uDD17',
        hint: 'Link to a web page',
        action: function() {
          var url;
          url = prompt("URL:", "http://");
          return document.execCommand("createLink", false, url);
        }
      },
      image: {
        text: '\uD83C\uDFB4',
        hint: 'Insert image',
        action: function() {
          var url;
          url = prompt("URL:", "http://");
          return document.execCommand("InsertImage", false, url);
        }
      },
      hr: {
        text: '―',
        hint: 'Insert image',
        action: function() {
          return document.execCommand("insertHorizontalRule", false, null);
        }
      },
      blockquote: {
        text: '“',
        hint: 'Insert quotation',
        action: function() {
          return change_format('BLOCKQUOTE');
        }
      },
      code: {
        text: '{}',
        hint: 'Format as code',
        action: function() {
          return change_format('pre');
        }
      },
      paragraph: {
        text: '¶',
        hint: 'Format as paragraph',
        action: function() {
          document.execCommand("outdent", false, null);
          return change_format('p');
        }
      },
      h1: {
        text: 'h1',
        hint: 'Heading 1',
        action: function() {
          return change_format('h1');
        }
      },
      h2: {
        text: 'h2',
        hint: 'Heading 2',
        action: function() {
          return change_format('h2');
        }
      },
      h3: {
        text: 'h3',
        hint: 'Heading 3',
        action: function() {
          return change_format('h3');
        }
      },
      h4: {
        text: 'h4',
        hint: 'Heading 4',
        action: function() {
          return change_format('h4');
        }
      },
      h5: {
        text: 'h5',
        hint: 'Heading 5',
        action: function() {
          return change_format('h5');
        }
      },
      h6: {
        text: 'h6',
        hint: 'Heading 6',
        action: function() {
          return change_format('h6');
        }
      }
    };
    parse = window.markdown.toMarkdown = function(html) {
      var output;
      output = '';
      $(html).contents().each(function() {
        var code, count, href, items, link, nesting, node, num, quoted, starter, tag_name, text, title;
        node = $(this);
        tag_name = this.tagName;
        if (node.parents(tag_name).not('p, blockquote').size() > 0) {
          text = node.text();
          return output = output + text.replace(/([\\`*_#+\-!{}()\[\]])/g, '\\$1');
        }
        if (this.nodeType === 3) {
          return output = output + node.text();
        } else if (node.filter('b, strong').size() > 0) {
          if (node.text()) {
            return output = output + ("**" + (parse(node)) + "**");
          }
        } else if (node.filter('i, em').size() > 0) {
          if (node.text()) {
            return output = output + ("*" + (parse(node)) + "*");
          }
        } else if (node.filter('a').size() > 0) {
          text = node.text();
          href = node.attr('href');
          title = node.attr('title');
          link = href === text ? "<" + href + ">" : title ? "[" + text + "](" + href + " \"" + title + "\")" : "[" + text + "](" + href + ")";
          return output = output + link;
        } else if (node.filter('br').size() > 0) {
          return output = "" + output + " \n";
        } else if (node.filter('hr').size() > 0) {
          return output = "- - -\n";
        } else if (node.filter('p').size() > 0) {
          return output = output + ("" + (parse(node)) + "\n\n");
        } else if (node.filter('blockquote').size() > 0) {
          nesting = parseInt(node.parents('blockquote').size());
          starter = ((function() {
            var _ref, _results;
            _results = [];
            for (num = 1, _ref = nesting + 1; 1 <= _ref ? num <= _ref : num >= _ref; 1 <= _ref ? num++ : num--) {
              _results.push('>');
            }
            return _results;
          })()).join('');
          quoted = parse(node);
          quoted = quoted.replace(/^(\n|[^>].*)/gm, "" + starter + " $1");
          if (nesting > 0) {
            if (!quoted.match(/\n/)) {
              quoted = "\n" + quoted;
            }
          } else {
            if (!quoted.match(/\n$/)) {
              quoted = "" + quoted + "\n";
            }
          }
          return output = output + quoted;
        } else if (node.filter('h1, h2, h3, h4, h5, h6').size() > 0) {
          count = parseInt(this.tagName.match(/\d/));
          return output = output + ("" + (((function() {
            var _results;
            _results = [];
            for (num = 1; 1 <= count ? num <= count : num >= count; 1 <= count ? num++ : num--) {
              _results.push('#');
            }
            return _results;
          })()).join('')) + " " + (node.text()) + "\n\n");
        } else if (node.filter('ol, ul').size() > 0) {
          count = 0;
          items = "";
          node.children('li').each(function() {
            var item, line, lines;
            if (node.filter('ol').size() > 0) {
              item = "" + (count += 1) + ".  " + (parse(this));
            } else {
              item = "-   " + (parse(this));
            }
            lines = (function() {
              var _i, _len, _ref, _results;
              _ref = item.split('\n');
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                line = _ref[_i];
                _results.push(line.match(/(^$|^(\n|-|\d+\.))/) ? line : "    " + line);
              }
              return _results;
            })();
            item = lines.join('\n');
            if (!item.match(/\n$/)) {
              item = "" + item + "\n";
            }
            return items = items + item;
          });
          if (!items.match(/\n\n$/)) {
            items = "" + items + "\n";
          }
          return output = output + items;
        } else if (node.filter('code').size() > 0) {
          code = node.text().replace(/^(.*)/gm, "    $1");
          if (!code.match(/\n$/)) {
            code = "" + code + "\n";
          }
          return output = output + code;
        } else {
          return output = output + parse(node);
        }
      });
      return output;
    };
    create_toolbar = function(buttons, button_attrs) {
      var attrs, editable_area, name, toolbar, _fn;
      toolbar = $('<div class="toolbar">');
      editable_area = this;
      console.log(this);
      _fn = function(name, attrs) {
        var button;
        if ($.inArray(name, buttons) >= 0) {
          attrs = $.extend({}, attrs, button_attrs[name]);
          button = $('<button>').addClass(name).attr('title', attrs.hint).html(attrs.text).click(function() {
            attrs.action.apply(this);
            editable_area.focus();
            return false;
          });
        }
        return toolbar.append(button);
      };
      for (name in button_defaults) {
        if (!__hasProp.call(button_defaults, name)) continue;
        attrs = button_defaults[name];
        _fn(name, attrs);
      }
      return toolbar;
    };
    create_editable_area = function() {
      var editable;
      return editable = $('<div class="editable" contenteditable="true">');
    };
    return $.fn.mkEditor = function(opts) {
      var defaults;
      if (opts == null) {
        opts = {};
      }
      defaults = {
        buttons: ['bold', 'italic', 'ul', 'ol', 'link', 'image', 'hr', 'blockquote', 'code', 'paragraph', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        button_attrs: {}
      };
      opts = $.extend(defaults, opts);
      return this.each(function() {
        var editable_area, editor, input, toolbar;
        input = $(this);
        editor = $('<div class="mkEditor">');
        editable_area = create_editable_area();
        toolbar = create_toolbar.apply(editable_area, [opts.buttons, opts.button_attrs]);
        input.after(editor.append(toolbar, editable_area));
        editable_area.html(window.markdown.toHTML(input.val()));
        editable_area.bind('parse', function() {
          return input.val(parse($(this)));
        });
        editable_area.keydown(function(e) {
          console.log(current_tag());
          if (current_tag() === 'div') {
            change_format('p');
          }
          if (e.keyCode === 9) {
            insert('\u00a0\u00a0');
            return false;
          }
        });
        return editable_area.bind('paste', function(e) {
          var clipboard;
          clipboard = e.originalEvent.clipboardData.getData('text');
          insert(window.markdown.toHTML(clipboard));
          return false;
        });
      });
    };
  })(jQuery);
}).call(this);
