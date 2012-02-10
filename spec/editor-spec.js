(function() {
  describe('editor', function() {
    var editor;
    editor = $('<textarea id="editor">');
    afterEach(function() {
      return $('.mkEditor').detach();
    });
    describe('init', function() {
      var content_editable, editor_area;
      editor_area = null;
      content_editable = null;
      describe('buttons', function() {
        it('should create default buttons', function() {
          var toolbar;
          $('body').append(editor);
          editor.mkEditor({});
          editor_area = editor.nextAll("div.mkEditor");
          toolbar = $('div.toolbar', editor_area);
          expect(toolbar).toExist();
          expect(toolbar).toContain('button.bold[title=Bold]');
          expect(toolbar).toContain('button.italic');
          expect(toolbar).toContain('button.ul');
          expect(toolbar).toContain('button.ol');
          expect(toolbar).toContain('button.link');
          expect(toolbar).toContain('button.image');
          expect(toolbar).toContain('button.hr');
          expect(toolbar).toContain('button.blockquote');
          expect(toolbar).toContain('button.code');
          expect(toolbar).toContain('button.paragraph');
          expect(toolbar).toContain('button.h1');
          expect(toolbar).toContain('button.h2');
          expect(toolbar).toContain('button.h3');
          expect(toolbar).toContain('button.h4');
          expect(toolbar).toContain('button.h5');
          return expect(toolbar).toContain('button.h6');
        });
        it('should limit buttons', function() {
          var toolbar;
          $('body').append(editor);
          editor.mkEditor({
            buttons: ['bold']
          });
          editor_area = editor.nextAll("div.mkEditor");
          toolbar = $('div.toolbar', editor_area);
          expect(toolbar).toContain('button.bold[title=Bold]');
          expect(toolbar).not.toContain('button.italic');
          expect(toolbar).not.toContain('button.ul');
          expect(toolbar).not.toContain('button.ol');
          expect(toolbar).not.toContain('button.link');
          expect(toolbar).not.toContain('button.image');
          expect(toolbar).not.toContain('button.hr');
          expect(toolbar).not.toContain('button.blockquote');
          expect(toolbar).not.toContain('button.code');
          expect(toolbar).not.toContain('button.paragraph');
          expect(toolbar).not.toContain('button.h1');
          expect(toolbar).not.toContain('button.h2');
          expect(toolbar).not.toContain('button.h3');
          expect(toolbar).not.toContain('button.h4');
          expect(toolbar).not.toContain('button.h5');
          return expect(toolbar).not.toContain('button.h6');
        });
        return it('should override button attributes', function() {
          var toolbar;
          $('body').append(editor);
          editor.mkEditor({
            button_attrs: {
              bold: {
                hint: 'Boldicize',
                text: 'Bold'
              },
              italic: {
                text: 'Italics'
              }
            }
          });
          editor_area = editor.nextAll("div.mkEditor");
          toolbar = $('div.toolbar', editor_area);
          expect(toolbar).toContain('button.bold[title=Boldicize]');
          expect($('button.bold')).toHaveText('Bold');
          return expect(toolbar).toContain('button.italic[title=Italicize]');
        });
      });
      return describe('dom modification', function() {
        beforeEach(function() {
          $('body').append(editor);
          editor.val("hey\n\nho\n\n");
          editor.mkEditor({});
          editor_area = editor.nextAll("div.mkEditor");
          return content_editable = $('div.editable[contenteditable]', editor_area);
        });
        it('should create editor area', function() {
          return expect(editor_area).toExist();
        });
        it('should create content editable area', function() {
          return expect(content_editable).toExist();
        });
        return it('should parse textarea markdown', function() {
          return expect(content_editable).toHaveHtml('<p>hey</p>\n\n<p>ho</p>');
        });
      });
    });
    return describe('html parsing', function() {
      beforeEach(function() {
        $('body').append(editor);
        return editor.mkEditor({});
      });
      describe('inline elements', function() {
        it('should parse bold', function() {
          $('.mkEditor .editable').html('<b>hello</b>').trigger('parse');
          return expect(editor.val()).toBe('**hello**');
        });
        it('should parse strong', function() {
          $('.mkEditor .editable').html('<strong>hello</strong>').trigger('parse');
          return expect(editor.val()).toBe('**hello**');
        });
        it('should parse italics', function() {
          $('.mkEditor .editable').html('<i>hello</i>').trigger('parse');
          return expect(editor.val()).toBe('*hello*');
        });
        it('should parse em', function() {
          $('.mkEditor .editable').html('<em>hello</em>').trigger('parse');
          return expect(editor.val()).toBe('*hello*');
        });
        it('should parse bold and italics', function() {
          $('.mkEditor .editable').html('<b><i>hello</i></b>').trigger('parse');
          return expect(editor.val()).toBe('***hello***');
        });
        it('should escape asterisks', function() {});
        it('should parse link with title', function() {
          $('.mkEditor .editable').html('<a href="http://makarius.me" title="My Blog">Me</a>').trigger('parse');
          return expect(editor.val()).toBe('[Me](http://makarius.me "My Blog")');
        });
        it('should parse link without title', function() {
          $('.mkEditor .editable').html('<a href="http://makarius.me">Me</a>').trigger('parse');
          return expect(editor.val()).toBe('[Me](http://makarius.me)');
        });
        return it('should parse link without title and same content', function() {
          $('.mkEditor .editable').html('<a href="http://makarius.me">http://makarius.me</a>').trigger('parse');
          return expect(editor.val()).toBe('<http://makarius.me>');
        });
      });
      describe('block elements', function() {
        it('should parse line break', function() {
          $('.mkEditor .editable').html('hey<br>ho<br>lets<br>go').trigger('parse');
          return expect(editor.val()).toBe("hey \nho \nlets \ngo");
        });
        it('should parse paragraphs', function() {
          $('.mkEditor .editable').html('<p>hey</p><p>ho</p>').trigger('parse');
          return expect(editor.val()).toBe("hey\n\nho\n\n");
        });
        it('should parse h1', function() {
          $('.mkEditor .editable').html('<h1>hello</h1>').trigger('parse');
          return expect(editor.val()).toBe("# hello\n\n");
        });
        it('should parse h2', function() {
          $('.mkEditor .editable').html('<h2>hello</h2>').trigger('parse');
          return expect(editor.val()).toBe("## hello\n\n");
        });
        it('should parse h3', function() {
          $('.mkEditor .editable').html('<h3>hello</h3>').trigger('parse');
          return expect(editor.val()).toBe("### hello\n\n");
        });
        it('should parse h4', function() {
          $('.mkEditor .editable').html('<h4>hello</h4>').trigger('parse');
          return expect(editor.val()).toBe("#### hello\n\n");
        });
        it('should parse h5', function() {
          $('.mkEditor .editable').html('<h5>hello</h5>').trigger('parse');
          return expect(editor.val()).toBe("##### hello\n\n");
        });
        it('should parse h6', function() {
          $('.mkEditor .editable').html('<h6>hello</h6>').trigger('parse');
          return expect(editor.val()).toBe("###### hello\n\n");
        });
        it('should parse h6', function() {
          $('.mkEditor .editable').html('<h6>hello</h6>').trigger('parse');
          return expect(editor.val()).toBe("###### hello\n\n");
        });
        it('should parse blockquote', function() {
          $('.mkEditor .editable').html('<blockquote>hello</blockquote>').trigger('parse');
          return expect(editor.val()).toBe("> hello\n");
        });
        it('should parse blockquote with paragraphs', function() {
          $('.mkEditor .editable').html('<blockquote><p>hey</p><p>ho</p></blockquote>').trigger('parse');
          return expect(editor.val()).toBe("> hey\n> \n> ho\n> \n");
        });
        it('should parse nested blockquote', function() {
          $('.mkEditor .editable').html('<blockquote>hey<blockquote>ho</blockquote></blockquote>').trigger('parse');
          return expect(editor.val()).toBe("> hey\n>> ho\n");
        });
        it('should parse nested blockquote with paragraphs', function() {
          $('.mkEditor .editable').html('<blockquote><p>hey</p><blockquote><p>ho</p></blockquote></blockquote>').trigger('parse');
          return expect(editor.val()).toBe("> hey\n> \n>> ho\n>> \n");
        });
        it('should parse ordered list', function() {
          $('.mkEditor .editable').html('<ol><li>one</li><li>two</li><li>three</li></ol>').trigger('parse');
          return expect(editor.val()).toBe("1.  one\n2.  two\n3.  three\n\n");
        });
        it('should parse ordered list with html node', function() {
          $('.mkEditor .editable').html('<ol><li><b>one</b></li><li>two</li><li>three</li></ol>').trigger('parse');
          return expect(editor.val()).toBe("1.  **one**\n2.  two\n3.  three\n\n");
        });
        it('should parse unordered list', function() {
          $('.mkEditor .editable').html('<ul><li>one</li><li>two</li><li>three</li></ul>').trigger('parse');
          return expect(editor.val()).toBe("-   one\n-   two\n-   three\n\n");
        });
        it('should parse unordered list with html node', function() {
          $('.mkEditor .editable').html('<ul><li><b>one</b></li><li>two</li><li>three</li></ul>').trigger('parse');
          return expect(editor.val()).toBe("-   **one**\n-   two\n-   three\n\n");
        });
        it('should parse unordered list with paragraph', function() {
          $('.mkEditor .editable').html('<ul><li><p>one</p></li><li><p>two</p></li></ul>').trigger('parse');
          return expect(editor.val()).toBe("-   one\n\n-   two\n\n");
        });
        it('should parse unordered list with paragraphs', function() {
          $('.mkEditor .editable').html('<ul><li><p>one</p><p>two</p></li><li><p>three</p></li></ul>').trigger('parse');
          return expect(editor.val()).toBe("-   one\n\n    two\n\n-   three\n\n");
        });
        it('should avoid triggering an unordered list from content');
        it('should avoid triggering an ordered list from content');
        it('should parse code block', function() {
          $('.mkEditor .editable').html('<code>def hello\n  "hello"\nend</code>').trigger('parse');
          return expect(editor.val()).toBe('    def hello\n      "hello"\n    end\n');
        });
        return it('should parse horizontal rule', function() {
          $('.mkEditor .editable').html('<hr>').trigger('parse');
          return expect(editor.val()).toBe('- - -\n');
        });
      });
      describe('external html', function() {
        it('should not accept nested nodes of the same kind', function() {
          $('.mkEditor .editable').html('<b><b>hello</b></b>').trigger('parse');
          return expect(editor.val()).toBe('**hello**');
        });
        return it('should not accept nested nodes of the same kind except blockquote', function() {
          $('.mkEditor .editable').html('<blockquote><blockquote><b><b>hello</b></b></blockquote></blockquote>').trigger('parse');
          return expect(editor.val()).toBe('> \n>> **hello**\n');
        });
      });
      return describe('escaping special', function() {
        it('should escape backslash', function() {
          $('.mkEditor .editable').html('\\').trigger('parse');
          return expect(editor.val()).toBe('\\\\');
        });
        it('should escape backtick', function() {
          $('.mkEditor .editable').html('`').trigger('parse');
          return expect(editor.val()).toBe('\\`');
        });
        it('should escape asterisk', function() {
          $('.mkEditor .editable').html('*').trigger('parse');
          return expect(editor.val()).toBe('\\*');
        });
        it('should escape underscore', function() {
          $('.mkEditor .editable').html('_').trigger('parse');
          return expect(editor.val()).toBe('\\_');
        });
        it('should escape hash', function() {
          $('.mkEditor .editable').html('#').trigger('parse');
          return expect(editor.val()).toBe('\\#');
        });
        it('should escape plus sign', function() {
          $('.mkEditor .editable').html('+').trigger('parse');
          return expect(editor.val()).toBe('\\+');
        });
        it('should escape minus sign', function() {
          $('.mkEditor .editable').html('-').trigger('parse');
          return expect(editor.val()).toBe('\\-');
        });
        it('should escape exclamation mark', function() {
          $('.mkEditor .editable').html('!').trigger('parse');
          return expect(editor.val()).toBe('\\!');
        });
        it('should escape curly braces', function() {
          $('.mkEditor .editable').html('{}').trigger('parse');
          return expect(editor.val()).toBe('\\{\\}');
        });
        it('should escape parentheses', function() {
          $('.mkEditor .editable').html('()').trigger('parse');
          return expect(editor.val()).toBe('\\(\\)');
        });
        return it('should escape square brackets', function() {
          $('.mkEditor .editable').html('[]').trigger('parse');
          return expect(editor.val()).toBe('\\[\\]');
        });
      });
    });
  });
}).call(this);
