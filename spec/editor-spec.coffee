describe 'editor', ->
  editor = $('<textarea id="editor">')

  afterEach ->
    $('.mkEditor').detach()

  describe 'init', ->
    editor_area = null
    content_editable = null

    describe 'buttons', ->
      it 'should create default buttons', ->
        $('body').append editor
        editor.mkEditor {}
        editor_area = editor.nextAll("div.mkEditor")
        toolbar = $('div.toolbar', editor_area)
        expect(toolbar).toExist()
        expect(toolbar).toContain('button.bold[title=Bold]')
        expect(toolbar).toContain('button.italic')
        expect(toolbar).toContain('button.ul')
        expect(toolbar).toContain('button.ol')
        expect(toolbar).toContain('button.link')
        expect(toolbar).toContain('button.image')
        expect(toolbar).toContain('button.hr')
        expect(toolbar).toContain('button.blockquote')
        expect(toolbar).toContain('button.code')
        expect(toolbar).toContain('button.paragraph')
        expect(toolbar).toContain('button.h1')
        expect(toolbar).toContain('button.h2')
        expect(toolbar).toContain('button.h3')
        expect(toolbar).toContain('button.h4')
        expect(toolbar).toContain('button.h5')
        expect(toolbar).toContain('button.h6')

      it 'should limit buttons', ->
        $('body').append editor
        editor.mkEditor {buttons : ['bold']}
        editor_area = editor.nextAll("div.mkEditor")
        toolbar = $('div.toolbar', editor_area)
        expect(toolbar).toContain('button.bold[title=Bold]')
        expect(toolbar).not.toContain('button.italic')
        expect(toolbar).not.toContain('button.ul')
        expect(toolbar).not.toContain('button.ol')
        expect(toolbar).not.toContain('button.link')
        expect(toolbar).not.toContain('button.image')
        expect(toolbar).not.toContain('button.hr')
        expect(toolbar).not.toContain('button.blockquote')
        expect(toolbar).not.toContain('button.code')
        expect(toolbar).not.toContain('button.paragraph')
        expect(toolbar).not.toContain('button.h1')
        expect(toolbar).not.toContain('button.h2')
        expect(toolbar).not.toContain('button.h3')
        expect(toolbar).not.toContain('button.h4')
        expect(toolbar).not.toContain('button.h5')
        expect(toolbar).not.toContain('button.h6')

      it 'should override button attributes', ->
        $('body').append editor
        editor.mkEditor {button_attrs : 
          {
            bold   : {hint : 'Boldicize', text : 'Bold'}
            italic : {text : 'Italics'}
          }
        }
        editor_area = editor.nextAll("div.mkEditor")
        toolbar = $('div.toolbar', editor_area)
        expect(toolbar).toContain('button.bold[title=Boldicize]')
        expect($('button.bold')).toHaveText('Bold')
        expect(toolbar).toContain('button.italic[title=Italicize]')

    describe 'dom modification', ->
      beforeEach ->
        $('body').append editor
        editor.val "hey\n\nho\n\n"
        editor.mkEditor {}
        editor_area = editor.nextAll("div.mkEditor")
        content_editable = $('div.editable[contenteditable]', editor_area)
      
      it 'should create editor area', ->
        expect(editor_area).toExist()

      it 'should create content editable area', ->
        expect(content_editable).toExist()

      it 'should parse textarea markdown', ->
        expect(content_editable).toHaveHtml('<p>hey</p>\n\n<p>ho</p>')


  describe 'html parsing', ->
    beforeEach ->
      $('body').append editor
      editor.mkEditor {}

    describe 'inline elements', ->
      it 'should parse bold', ->
        $('.mkEditor .editable').html('<b>hello</b>').trigger('parse')
        expect(editor.val()).toBe('**hello**')

      it 'should parse strong', ->
        $('.mkEditor .editable').html('<strong>hello</strong>').trigger('parse')
        expect(editor.val()).toBe('**hello**')

      it 'should parse italics', ->
        $('.mkEditor .editable').html('<i>hello</i>').trigger('parse')
        expect(editor.val()).toBe('*hello*')

      it 'should parse em', ->
        $('.mkEditor .editable').html('<em>hello</em>').trigger('parse')
        expect(editor.val()).toBe('*hello*')

      it 'should parse bold and italics', ->
        $('.mkEditor .editable').html('<b><i>hello</i></b>').trigger('parse')
        expect(editor.val()).toBe('***hello***')

      it 'should escape asterisks', ->

      it 'should parse link with title', ->
        $('.mkEditor .editable').html('<a href="http://makarius.me" title="My Blog">Me</a>').trigger('parse')
        expect(editor.val()).toBe('[Me](http://makarius.me "My Blog")')

      it 'should parse link without title', ->
        $('.mkEditor .editable').html('<a href="http://makarius.me">Me</a>').trigger('parse')
        expect(editor.val()).toBe('[Me](http://makarius.me)')

      it 'should parse link without title and same content', ->
        $('.mkEditor .editable').html('<a href="http://makarius.me">http://makarius.me</a>').trigger('parse')
        expect(editor.val()).toBe('<http://makarius.me>')

    describe 'block elements', ->
      it 'should parse line break', ->
        $('.mkEditor .editable').html('hey<br>ho<br>lets<br>go').trigger('parse')
        expect(editor.val()).toBe "hey \nho \nlets \ngo"

      it 'should parse paragraphs', ->
        $('.mkEditor .editable').html('<p>hey</p><p>ho</p>').trigger('parse')
        expect(editor.val()).toBe "hey\n\nho\n\n"

      it 'should parse h1', ->
        $('.mkEditor .editable').html('<h1>hello</h1>').trigger('parse')
        expect(editor.val()).toBe "# hello\n\n"

      it 'should parse h2', ->
        $('.mkEditor .editable').html('<h2>hello</h2>').trigger('parse')
        expect(editor.val()).toBe "## hello\n\n"

      it 'should parse h3', ->
        $('.mkEditor .editable').html('<h3>hello</h3>').trigger('parse')
        expect(editor.val()).toBe "### hello\n\n"

      it 'should parse h4', ->
        $('.mkEditor .editable').html('<h4>hello</h4>').trigger('parse')
        expect(editor.val()).toBe "#### hello\n\n"

      it 'should parse h5', ->
        $('.mkEditor .editable').html('<h5>hello</h5>').trigger('parse')
        expect(editor.val()).toBe "##### hello\n\n"

      it 'should parse h6', ->
        $('.mkEditor .editable').html('<h6>hello</h6>').trigger('parse')
        expect(editor.val()).toBe "###### hello\n\n"
      
      it 'should parse h6', ->
        $('.mkEditor .editable').html('<h6>hello</h6>').trigger('parse')
        expect(editor.val()).toBe "###### hello\n\n"

      it 'should parse blockquote', ->
        $('.mkEditor .editable').html('<blockquote>hello</blockquote>').trigger('parse')
        expect(editor.val()).toBe "> hello\n"

      it 'should parse blockquote with paragraphs', ->
        $('.mkEditor .editable').html('<blockquote><p>hey</p><p>ho</p></blockquote>').trigger('parse')
        expect(editor.val()).toBe "> hey\n> \n> ho\n> \n"

      it 'should parse nested blockquote', ->
        $('.mkEditor .editable').html('<blockquote>hey<blockquote>ho</blockquote></blockquote>').trigger('parse')
        expect(editor.val()).toBe "> hey\n>> ho\n"

      it 'should parse nested blockquote with paragraphs', ->
        $('.mkEditor .editable').html('<blockquote><p>hey</p><blockquote><p>ho</p></blockquote></blockquote>').trigger('parse')
        expect(editor.val()).toBe "> hey\n> \n>> ho\n>> \n"

      it 'should parse ordered list', ->
        $('.mkEditor .editable').html('<ol><li>one</li><li>two</li><li>three</li></ol>').trigger('parse')
        expect(editor.val()).toBe "1.  one\n2.  two\n3.  three\n\n"

      it 'should parse ordered list with html node', ->
        $('.mkEditor .editable').html('<ol><li><b>one</b></li><li>two</li><li>three</li></ol>').trigger('parse')
        expect(editor.val()).toBe "1.  **one**\n2.  two\n3.  three\n\n"

      it 'should parse unordered list', ->
        $('.mkEditor .editable').html('<ul><li>one</li><li>two</li><li>three</li></ul>').trigger('parse')
        expect(editor.val()).toBe "-   one\n-   two\n-   three\n\n"

      it 'should parse unordered list with html node', ->
        $('.mkEditor .editable').html('<ul><li><b>one</b></li><li>two</li><li>three</li></ul>').trigger('parse')
        expect(editor.val()).toBe "-   **one**\n-   two\n-   three\n\n"

      it 'should parse unordered list with paragraph', ->
        $('.mkEditor .editable').html('<ul><li><p>one</p></li><li><p>two</p></li></ul>').trigger('parse')
        expect(editor.val()).toBe "-   one\n\n-   two\n\n"

      it 'should parse unordered list with paragraphs', ->
        $('.mkEditor .editable').html('<ul><li><p>one</p><p>two</p></li><li><p>three</p></li></ul>').trigger('parse')
        expect(editor.val()).toBe "-   one\n\n    two\n\n-   three\n\n"

      it 'should avoid triggering an unordered list from content'
      it 'should avoid triggering an ordered list from content'

      it 'should parse code block', ->
        $('.mkEditor .editable').html('<code>def hello\n  "hello"\nend</code>').trigger('parse')
        expect(editor.val()).toBe '    def hello\n      "hello"\n    end\n'

      it 'should parse horizontal rule', ->
        $('.mkEditor .editable').html('<hr>').trigger('parse')
        expect(editor.val()).toBe '- - -\n'

    describe 'external html', ->
      it 'should not accept nested nodes of the same kind', ->
        $('.mkEditor .editable').html('<b><b>hello</b></b>').trigger('parse')
        expect(editor.val()).toBe '**hello**'

      it 'should not accept nested nodes of the same kind except blockquote', ->
        $('.mkEditor .editable').html('<blockquote><blockquote><b><b>hello</b></b></blockquote></blockquote>').trigger('parse')
        expect(editor.val()).toBe '> \n>> **hello**\n'

    describe 'escaping special', ->
      it 'should escape backslash', ->
        $('.mkEditor .editable').html('\\').trigger('parse')
        expect(editor.val()).toBe '\\\\'

      it 'should escape backtick', ->
        $('.mkEditor .editable').html('`').trigger('parse')
        expect(editor.val()).toBe '\\`'

      it 'should escape asterisk', ->
        $('.mkEditor .editable').html('*').trigger('parse')
        expect(editor.val()).toBe '\\*'

      it 'should escape underscore', ->
        $('.mkEditor .editable').html('_').trigger('parse')
        expect(editor.val()).toBe '\\_'

      it 'should escape hash', ->
        $('.mkEditor .editable').html('#').trigger('parse')
        expect(editor.val()).toBe '\\#'

      it 'should escape plus sign', ->
        $('.mkEditor .editable').html('+').trigger('parse')
        expect(editor.val()).toBe '\\+'

      it 'should escape minus sign', ->
        $('.mkEditor .editable').html('-').trigger('parse')
        expect(editor.val()).toBe '\\-'

      it 'should escape exclamation mark', ->
        $('.mkEditor .editable').html('!').trigger('parse')
        expect(editor.val()).toBe '\\!'
      it 'should escape curly braces', ->
        $('.mkEditor .editable').html('{}').trigger('parse')
        expect(editor.val()).toBe '\\{\\}'

      it 'should escape parentheses', ->
        $('.mkEditor .editable').html('()').trigger('parse')
        expect(editor.val()).toBe '\\(\\)'

      it 'should escape square brackets', ->
        $('.mkEditor .editable').html('[]').trigger('parse')
        expect(editor.val()).toBe '\\[\\]'

      # it 'should escape dot', ->
      #   $('.mkEditor .editable').html('.').trigger('parse')
      #   expect(editor.val()).toBe '\\.'
